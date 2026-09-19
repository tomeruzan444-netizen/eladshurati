/**
 * Pages written for the site rather than migrated from WordPress.
 *
 * Each lives as a module in content/authored/ and holds only what a writer
 * decides: the address, the meta, the blocks and the call to action. The rest
 * of the record - canonical, og, twitter, JSON-LD - is derived here, so a new
 * page gets exactly the same <head> shape as the migrated ones.
 *
 * This is also where docs/writing-spec.md becomes enforceable. Every rule that
 * can be measured is checked, and a page that breaks one does not build. The
 * rules that need judgement - voice, uniqueness, real value - stay with the
 * writer and with scripts/audit-voice.mjs.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { site } from './render.mjs'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const DIR = path.join(ROOT, 'content', 'authored')
const ROBOTS = 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large'

const plain = (h = '') =>
  String(h)
    // An SVG's <title> and <desc> are read to screen readers, never drawn.
    .replace(/<title[\s\S]*?<\/title>|<desc[\s\S]*?<\/desc>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const blockText = (b) => {
  switch (b.type) {
    case 'heading':
      return b.text || ''
    case 'richtext':
    case 'table':
      return plain(b.html)
    case 'list':
      return plain((b.items || []).join(' '))
    case 'faq':
      return plain((b.items || []).map((i) => `${i.q} ${i.a}`).join(' '))
    case 'figure':
      return plain(`${b.html} ${b.caption || ''}`)
    default:
      return ''
  }
}

/** Every word a reader sees in the page body, closing CTA included - rule 17. */
export const countWords = (page) =>
  [...page.blocks.map(blockText), page.cta?.title, page.cta?.text]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length

const hrefsIn = (b) =>
  [...String(b.html || (b.items || []).join(' ')).matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1])

/**
 * `migrated` - addresses the capture already owns, which a new page may not take.
 * `resolvable` - every address a link may point at, other authored pages included.
 */
function check(page, file, migrated, resolvable) {
  const fail = []
  const h1s = page.blocks.filter((b) => b.type === 'heading' && b.level === 1)
  const lead = page.blocks.find((b) => b.type === 'richtext')
  // The "related reading" template is generated navigation, not a link someone wrote.
  const outbound = page.blocks.filter((b) => b.type !== 'template').flatMap(hrefsIn)
  const words = countWords(page)

  if (!/^\/[^/].*\/$/.test(page.path || '')) fail.push(`path must look like /כתובת/, got ${page.path}`)
  if (migrated.has(page.path)) fail.push(`path already belongs to a migrated page: ${page.path}`)
  if (h1s.length !== 1) fail.push(`needs exactly one H1, has ${h1s.length} (spec 4)`)
  if (!page.title || page.title.length > 65) fail.push(`title must be 1-65 chars, is ${page.title?.length || 0} (spec 14)`)
  if (!page.description || page.description.length < 70 || page.description.length > 165)
    fail.push(`description must be 70-165 chars, is ${page.description?.length || 0} (spec 14)`)
  if (h1s[0] && page.title === h1s[0].text) fail.push('title is a copy of the H1 (spec 14)')
  if (lead && /<a\s/i.test(lead.html)) fail.push('link in the first paragraph (spec 9)')
  if (outbound.length < 2 || outbound.length > 3) fail.push(`needs 2-3 internal links in the body, has ${outbound.length} (spec 9)`)
  for (const href of outbound) if (!resolvable.has(href)) fail.push(`links to a page that does not exist: ${href}`)
  if (words < 800 || words > 1100) fail.push(`needs 800-1,100 words, has ${words} (spec 17)`)
  for (const b of page.blocks.filter((x) => x.type === 'figure')) {
    if (!/role="img"/.test(b.html) || !/<title[\s>]/.test(b.html)) fail.push('figure SVG needs role="img" and a <title>')
    if (!b.caption) fail.push('figure needs a caption')
  }
  if (!page.cta?.title || !page.cta?.text) fail.push('needs a CTA of its own, title and text (spec 12)')

  if (fail.length) throw new Error(`content/authored/${file} breaks the writing spec:\n  ${fail.join('\n  ')}`)
  return words
}

function seoFor(page, sitewide) {
  const url = `${site.origin}${encodeURI(page.path)}`
  const h1 = page.blocks.find((b) => b.type === 'heading' && b.level === 1).text
  const faq = page.blocks.find((b) => b.type === 'faq')
  const graph = [
    ...sitewide,
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      datePublished: page.published,
      dateModified: page.modified,
      isPartOf: { '@id': `${site.origin}/#website` },
      author: { '@id': `${site.origin}/#person` },
      publisher: { '@id': `${site.origin}/#person` },
      ...(page.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: page.image } } : {}),
      inLanguage: 'he-IL',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'עמוד הבית', item: `${site.origin}/` },
        { '@type': 'ListItem', position: 2, name: h1, item: url },
      ],
    },
  ]
  if (faq?.items?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.items.map((i) => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: plain(i.a) },
      })),
    })
  }
  return {
    url,
    path: page.path,
    title: page.title,
    description: page.description,
    robots: ROBOTS,
    canonical: url,
    og: {
      locale: 'he_IL',
      type: 'article',
      title: page.title,
      description: page.description,
      url,
      siteName: site.name,
      image: page.image || null,
      updatedTime: page.modified,
    },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, image: page.image || null },
    articleModified: page.modified,
    jsonld: [{ '@context': 'https://schema.org', '@graph': graph }],
    headings: page.blocks.filter((b) => b.type === 'heading').map((b) => ({ level: b.level, text: b.text })),
    h1,
  }
}

/**
 * Every authored page as a full record, ready to join the migrated ones.
 * `pages` supplies the addresses that already exist, and the site-wide Person
 * and WebSite nodes the JSON-LD graph refers to.
 */
export async function loadAuthored(pages) {
  let files
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith('.mjs')).sort()
  } catch {
    return []
  }

  const home = pages.find((p) => p.seo.path === '/')
  const sitewide = (home?.seo.jsonld?.[0]?.['@graph'] || []).filter((n) =>
    [`${site.origin}/#person`, `${site.origin}/#website`].includes(n['@id'])
  )

  const loaded = []
  for (const file of files) {
    const { default: page } = await import(pathToFileURL(path.join(DIR, file)).href)
    loaded.push({ file, page })
  }

  const migrated = new Set(pages.map((p) => decodeURIComponent(p.seo.path)))
  const own = new Set()
  for (const { file, page } of loaded) {
    if (own.has(page.path)) throw new Error(`content/authored/${file}: another authored page already uses ${page.path}`)
    own.add(page.path)
  }
  // Client pages are generated from projects.json later in the build, but they
  // are real addresses a page may point at - rule 9א wants exactly that.
  let clients = []
  try {
    const projects = JSON.parse(await readFile(path.join(ROOT, 'content', 'projects.json'), 'utf8'))
    clients = ['/לקוחות/', ...projects.map((p) => `/לקוחות/${p.slug}/`)]
  } catch {
    /* no client pages */
  }
  const resolvable = new Set([...migrated, ...own, ...clients])

  return loaded.map(({ file, page }) => ({
    key: page.path.replace(/^\/|\/$/g, ''),
    type: 'page',
    authored: true,
    lastmod: page.modified,
    wordCount: check(page, file, migrated, resolvable),
    cta: page.cta,
    blocks: page.blocks,
    seo: seoFor(page, sitewide),
  }))
}
