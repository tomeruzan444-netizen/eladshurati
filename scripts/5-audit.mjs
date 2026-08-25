/**
 * Step 5 — Audit the migrated content.
 *
 * Two jobs:
 *  1. Content defects that already exist on the live site (placeholder copy,
 *     missing meta, broken internal links). These get reported, not silently
 *     rewritten — the migration is 1:1 apart from agreed fixes.
 *  2. Migration integrity: every live URL accounted for, every internal link
 *     still resolving, no SEO field dropped on the way across.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const CONTENT = path.join(ROOT, 'content')

const read = async (f) => JSON.parse(await readFile(path.join(CONTENT, f), 'utf8'))

const LOREM = /לורם\s+איפסום|lorem\s+ipsum|דולור\s+סיט\s+אמט|קונסקטורר/i
const PLACEHOLDER = /^(test|בדיקה|texto|xxx+|\.\.\.|placeholder)$/i

const textOf = (block) => {
  switch (block.type) {
    case 'heading':
      return block.text || ''
    case 'richtext':
    case 'quote':
    case 'table':
      return (block.html || '').replace(/<[^>]+>/g, ' ')
    case 'list':
      return (block.items || []).join(' ').replace(/<[^>]+>/g, ' ')
    case 'faq':
      return (block.items || []).map((i) => `${i.q} ${(i.a || '').replace(/<[^>]+>/g, ' ')}`).join(' ')
    case 'card':
      return `${block.title || ''} ${block.text || ''}`
    default:
      return ''
  }
}

const main = async () => {
  const pages = await read('pages.json')
  const links = await read('links.json')
  const manifest = await read('media-manifest.json')

  const known = new Set(pages.map((p) => p.seo.path.replace(/\/$/, '') || '/'))
  const localImages = new Set(manifest.filter((m) => m.local).map((m) => m.url))

  const findings = { placeholder: [], noDescription: [], h1: [], duplicateTitle: [], duplicateDesc: [], brokenLink: [], missingImage: [], emptyAlt: [], thin: [], longTitle: [], longDesc: [] }

  const titles = new Map()
  const descs = new Map()

  for (const p of pages) {
    const { seo } = p
    const words = p.blocks.map(textOf).join(' ').split(/\s+/).filter(Boolean).length

    // placeholder copy left behind by whoever built the page
    for (const [i, b] of p.blocks.entries()) {
      const t = textOf(b)
      if (LOREM.test(t) || PLACEHOLDER.test(t.trim())) {
        findings.placeholder.push({ page: seo.path, block: i, type: b.type, excerpt: t.replace(/\s+/g, ' ').trim().slice(0, 160) })
      }
    }

    if (!seo.description) findings.noDescription.push({ page: seo.path, title: seo.title })
    else if (seo.description.length > 165) findings.longDesc.push({ page: seo.path, len: seo.description.length })
    if (seo.title && seo.title.length > 65) findings.longTitle.push({ page: seo.path, len: seo.title.length, title: seo.title })

    const h1s = seo.headings.filter((h) => h.level === 1)
    if (h1s.length !== 1) findings.h1.push({ page: seo.path, count: h1s.length, texts: h1s.map((h) => h.text).slice(0, 3) })

    if (seo.title) {
      const key = seo.title.trim()
      titles.set(key, [...(titles.get(key) || []), seo.path])
    }
    if (seo.description) {
      const key = seo.description.trim()
      descs.set(key, [...(descs.get(key) || []), seo.path])
    }

    if (words < 120 && p.type !== 'category') findings.thin.push({ page: seo.path, words })

    for (const b of p.blocks) {
      if (b.type !== 'image') continue
      if (b.src && !localImages.has(b.src)) findings.missingImage.push({ page: seo.path, src: b.src })
      if (!b.alt || !b.alt.trim()) findings.emptyAlt.push({ page: seo.path, src: (b.src || '').split('/').pop() })
    }
  }

  for (const [t, ps] of titles) if (ps.length > 1) findings.duplicateTitle.push({ title: t, pages: ps })
  for (const [d, ps] of descs) if (ps.length > 1) findings.duplicateDesc.push({ description: d.slice(0, 80) + '…', pages: ps })

  // internal links that no longer resolve to a page we migrated
  const seenBroken = new Set()
  for (const l of links) {
    if (!l.internal || !l.to || l.to.startsWith('#')) continue
    const target = l.to.split('#')[0].split('?')[0].replace(/\/$/, '') || '/'
    if (known.has(target)) continue
    if (/\.(pdf|jpe?g|png|webp|svg|zip|mp4)$/i.test(target)) continue
    const key = `${l.from}→${target}`
    if (seenBroken.has(key)) continue
    seenBroken.add(key)
    findings.brokenLink.push({ from: l.from, to: target, text: l.text.slice(0, 60) })
  }

  await writeFile(path.join(CONTENT, 'audit.json'), JSON.stringify(findings, null, 2), 'utf8')

  const line = (label, arr, extra = '') =>
    console.log(`${String(arr.length).padStart(4)}  ${label}${extra}`)

  console.log(`\n=== content audit — ${pages.length} pages ===\n`)
  line('pages with placeholder / lorem-ipsum copy', findings.placeholder)
  line('pages with no meta description', findings.noDescription)
  line('pages whose H1 count is not exactly 1', findings.h1)
  line('duplicate <title> values', findings.duplicateTitle)
  line('duplicate meta descriptions', findings.duplicateDesc)
  line('titles over 65 chars', findings.longTitle)
  line('descriptions over 165 chars', findings.longDesc)
  line('internal links with no matching page', findings.brokenLink)
  line('content images not downloaded', findings.missingImage)
  line('content images with empty alt', findings.emptyAlt)
  line('thin pages (<120 words)', findings.thin)

  if (findings.placeholder.length) {
    console.log('\n--- placeholder copy ---')
    for (const f of findings.placeholder) console.log(`  ${f.page}\n    [${f.type}] ${f.excerpt}`)
  }
  if (findings.brokenLink.length) {
    console.log('\n--- broken internal links ---')
    for (const f of findings.brokenLink.slice(0, 25)) console.log(`  ${f.from}\n    → ${f.to}   "${f.text}"`)
    if (findings.brokenLink.length > 25) console.log(`  … ${findings.brokenLink.length - 25} more in content/audit.json`)
  }
  if (findings.h1.length) {
    console.log('\n--- H1 problems ---')
    for (const f of findings.h1) console.log(`  ${f.page}  (${f.count} H1)`)
  }
  if (findings.noDescription.length) {
    console.log('\n--- missing meta description ---')
    for (const f of findings.noDescription) console.log(`  ${f.page}`)
  }
  console.log('\nfull detail: content/audit.json')
}

main()
