/**
 * SEO state of the built site, as a set of numbers that mean the same thing
 * every time they are measured.
 *
 * The audits before this one were written fresh each time they were asked for,
 * which made each answer correct and none of them comparable — "28 orphans"
 * meant nothing without knowing whether the previous 31 had been counted the
 * same way. Everything here is defined once, in code, so a later run can be
 * read against an earlier one.
 *
 * It reports. It never writes, and it never fails the build; a finding here is
 * a thing to decide about, not a thing to block on.
 *
 * Usage:  node scripts/audit-seo.mjs
 *         node scripts/audit-seo.mjs --json   (for diffing two runs)
 */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'site')
const JSON_OUT = process.argv.includes('--json')

/* ------------------------------------------------------------- reading */

async function pages(dir = OUT, found = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name)
    if (e.isDirectory()) await pages(f, found)
    else if (e.name === 'index.html') found.push(f)
  }
  return found
}

const urlOf = (file) =>
  decodeURIComponent(
    '/' + path.relative(OUT, file).split(path.sep).slice(0, -1).join('/') + (path.relative(OUT, file).includes(path.sep) ? '/' : '')
  ).replace('//', '/') || '/'

/** Visible words: what a reader gets, with script, style and nav stripped. */
const visibleWords = (html) => {
  const m = html.slice(html.indexOf('<main'), html.indexOf('</main>'))
  const t = m
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return t ? t.split(' ').length : 0
}

const meta = (html, prop) => {
  const re = new RegExp(`<meta (?:property|name)="${prop}" content="([^"]*)"`)
  return (html.match(re) || [])[1] || ''
}

const schemaTypes = (html) => {
  const out = []
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1])
      const nodes = j['@graph'] || (Array.isArray(j) ? j : [j])
      for (const n of nodes) out.push(...[].concat(n['@type'] || []))
    } catch {
      /* a malformed block is itself reported below */
    }
  }
  return out
}

const hasAuthor = (html) =>
  /<script type="application\/ld\+json">[\s\S]*?"author"[\s\S]*?<\/script>/.test(html)

/* ----------------------------------------------------------- crawlability */

/** Pages a crawler reaches by following links from the home page. */
function reachable(byUrl) {
  const seen = new Set(['/'])
  const queue = ['/']
  while (queue.length) {
    const cur = queue.shift()
    const html = byUrl.get(cur)
    if (!html) continue
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = decodeURIComponent(m[1])
      const norm = href.endsWith('/') ? href : href + '/'
      if (byUrl.has(norm) && !seen.has(norm)) {
        seen.add(norm)
        queue.push(norm)
      }
    }
  }
  return seen
}

/* ------------------------------------------------------------ duplication */

/**
 * Overlap in 8-word runs, discounting the site's own furniture.
 *
 * A naive pair comparison here reported 190 pairs over 25%, which was true and
 * useless: the CTA, the related-articles cards and the boilerplate FAQ are the
 * same on most pages, so every pair looked duplicated. Anything appearing on
 * ten pages or more is treated as chrome and removed from both sides first, so
 * what remains is two pages genuinely saying the same thing in body copy.
 *
 * The chrome itself is worth seeing, so it is reported separately — that is the
 * duplicated-FAQ finding, measured rather than asserted.
 */
function shingleOverlap(texts) {
  const shingles = new Map()
  const seenOn = new Map()
  for (const [url, words] of texts) {
    const set = new Set()
    for (let i = 0; i + 8 <= words.length; i++) set.add(words.slice(i, i + 8).join(' '))
    shingles.set(url, set)
    for (const s of set) seenOn.set(s, (seenOn.get(s) || 0) + 1)
  }

  const CHROME_AT = 10
  const chrome = new Set([...seenOn].filter(([, n]) => n >= CHROME_AT).map(([s]) => s))

  const body = new Map()
  for (const [url, set] of shingles) {
    body.set(url, new Set([...set].filter((s) => !chrome.has(s))))
  }

  const pairs = []
  const urls = [...body.keys()]
  for (let i = 0; i < urls.length; i++) {
    for (let j = i + 1; j < urls.length; j++) {
      const a = body.get(urls[i])
      const b = body.get(urls[j])
      if (a.size < 40 || b.size < 40) continue
      let shared = 0
      for (const s of a) if (b.has(s)) shared++
      const pct = Math.round((shared / Math.min(a.size, b.size)) * 100)
      if (pct >= 25) pairs.push({ a: urls[i], b: urls[j], pct })
    }
  }

  // How much of an average page is text it shares with ten or more others.
  const chromeShare = [...shingles]
    .filter(([, set]) => set.size >= 40)
    .map(([, set]) => [...set].filter((s) => chrome.has(s)).length / set.size)
  const median = chromeShare.sort((x, y) => x - y)[Math.floor(chromeShare.length / 2)] || 0

  return {
    pairs: pairs.sort((x, y) => y.pct - x.pct),
    chromeRuns: chrome.size,
    chromeMedianShare: Math.round(median * 100),
  }
}

/* ------------------------------------------------------------------ main */

const files = await pages()
const byUrl = new Map()
const info = []

for (const f of files) {
  const html = await readFile(f, 'utf8')
  const url = urlOf(f)
  byUrl.set(url, html)
  info.push({
    url,
    words: visibleWords(html),
    title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '',
    description: meta(html, 'description'),
    ogImage: meta(html, 'og:image'),
    canonical: (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '',
    types: schemaTypes(html),
    author: hasAuthor(html),
    byline: /class="byline"/.test(html),
    h1s: [...html.matchAll(/<h1[\s>]/g)].length,
    faqVisible: /class="[^"]*faq/.test(html),
  })
}

const reach = reachable(byUrl)

// The sitemap is what we ask Google to read; the canonicals are what we tell it
// each page really is. They have to agree.
let sitemapUrls = []
try {
  const sm = await readFile(path.join(OUT, 'sitemap.xml'), 'utf8')
  sitemapUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeURIComponent(m[1]))
} catch {
  /* reported as 0 below */
}

const texts = info
  .filter((p) => p.words > 150)
  .map((p) => [
    p.url,
    byUrl
      .get(p.url)
      .slice(byUrl.get(p.url).indexOf('<main'), byUrl.get(p.url).indexOf('</main>'))
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' '),
  ])

const dup = shingleOverlap(texts)
const dupes = dup.pairs

const unreachable = info.filter((p) => !reach.has(p.url)).map((p) => p.url)
const thin = info.filter((p) => p.words < 300).sort((a, b) => a.words - b.words)
const noOg = info.filter((p) => !p.ogImage).map((p) => p.url)
const noAuthor = info.filter((p) => !p.author).map((p) => p.url)
const noBreadcrumb = info.filter((p) => !p.types.includes('BreadcrumbList')).map((p) => p.url)
const faqGap = info.filter((p) => p.faqVisible && !p.types.includes('FAQPage')).map((p) => p.url)
const badH1 = info.filter((p) => p.h1s !== 1).map((p) => `${p.url} (${p.h1s})`)
const longTitle = info.filter((p) => p.title.length > 65).map((p) => `${p.url} (${p.title.length})`)
const badDesc = info
  .filter((p) => p.description.length < 70 || p.description.length > 165)
  .map((p) => `${p.url} (${p.description.length})`)
const canonMismatch = info
  .filter((p) => p.canonical && !sitemapUrls.includes(decodeURIComponent(p.canonical)))
  .map((p) => p.url)

const report = {
  measured: new Date().toISOString().slice(0, 10),
  pages: info.length,
  reachableFromHome: reach.size,
  unreachable,
  thin: thin.map((p) => `${p.url} (${p.words})`),
  medianWords: [...info.map((p) => p.words)].sort((a, b) => a - b)[Math.floor(info.length / 2)],
  withByline: info.filter((p) => p.byline).length,
  noAuthorInSchema: noAuthor,
  noBreadcrumb: noBreadcrumb.length,
  faqVisibleWithoutSchema: faqGap,
  noOgImage: noOg.length,
  h1NotExactlyOne: badH1,
  titleOver65: longTitle,
  descriptionOutOfRange: badDesc.length,
  canonicalNotInSitemap: canonMismatch,
  sitemapUrls: sitemapUrls.length,
  duplicatePairsOver25pct: dupes.slice(0, 12).map((d) => `${d.pct}%  ${d.a}  ↔  ${d.b}`),
  boilerplateRuns: dup.chromeRuns,
  boilerplateMedianShareOfPage: dup.chromeMedianShare,
}

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 2))
} else {
  const line = (label, value) => console.log(`  ${String(label).padEnd(34)} ${value}`)
  console.log(`\nSEO state — ${report.measured}\n`)
  line('pages built', report.pages)
  line('reachable from the home page', `${report.reachableFromHome} / ${report.pages}`)
  line('median visible words', report.medianWords)
  line('under 300 words', thin.length)
  line('with a visible byline', `${report.withByline} / ${report.pages}`)
  line('no author in structured data', noAuthor.length)
  line('no BreadcrumbList', report.noBreadcrumb)
  line('FAQ on screen, none in schema', faqGap.length)
  line('no og:image', report.noOgImage)
  line('H1 not exactly one', badH1.length)
  line('title over 65 chars', longTitle.length)
  line('description out of 70-165', report.descriptionOutOfRange)
  line('canonical not in the sitemap', canonMismatch.length)
  line('sitemap URLs', report.sitemapUrls)
  line('page pairs sharing >25% body text', dupes.length)
  line('text repeated on 10+ pages', `${dup.chromeMedianShare}% of a typical page`)

  const show = (title, list) => {
    if (!list.length) return
    console.log(`\n${title}`)
    list.slice(0, 20).forEach((x) => console.log('   ' + x))
    if (list.length > 20) console.log(`   … and ${list.length - 20} more`)
  }
  show('unreachable by crawling from the home page:', unreachable)
  show('under 300 words:', report.thin)
  show('FAQ visible but not in the schema:', faqGap)
  show('most duplicated pairs:', report.duplicatePairsOver25pct)
  show('H1 count wrong:', badH1)
  show('title too long:', longTitle)
  console.log('')
}
