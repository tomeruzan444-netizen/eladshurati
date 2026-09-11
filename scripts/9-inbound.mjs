/**
 * Inbound editorial links per page - the check behind rule 9א in the spec.
 *
 *   node scripts/9-inbound.mjs            every page, fewest links first
 *   node scripts/9-inbound.mjs /לקוחות/   one page, and who links to it
 *
 * "Editorial" means a link inside the page body that is not site-wide
 * navigation. A link in the header, the footer or a card grid appears on every
 * page and tells you nothing about whether anyone thought this page was worth
 * pointing at, so anything that shows up on nearly every page is excluded.
 *
 * A new page with zero of these is an orphan: Google finds it through the
 * sitemap, but it inherits no strength from the site and no reader arrives at
 * it mid-sentence.
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'site')

const walk = async (dir) => {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.name === 'index.html') out.push(p)
  }
  return out
}

const pathOf = (file) => {
  const rel = path.relative(OUT, path.dirname(file)).split(path.sep).join('/')
  return rel ? `/${rel}/` : '/'
}

const files = await walk(OUT)
const links = new Map() // page -> Set of pages it links to

/*
 * Editorial body only. Three things have to come out first:
 *   - everything outside <main>, so the header and footer do not count
 *   - the CTA panel and the testimonials rail, which repeat on every page
 *   - the "מאמרים נוספים" list, which is generated rather than written
 * What is left is prose somebody actually wrote, which is what the rule is
 * about.
 */
const editorialBody = (html) => {
  const start = html.indexOf('<main')
  const end = html.indexOf('</main>')
  if (start < 0 || end < 0) return ''
  let body = html.slice(start, end)
  body = body.replace(/<section[^>]*class="[^"]*section--cta[^"]*"[\s\S]*?<\/section>/g, '')
  body = body.replace(/<section[^>]*class="[^"]*testimonials[^"]*"[\s\S]*?<\/section>/g, '')
  body = body.replace(/<ul class="linklist"[\s\S]*?<\/ul>/g, '')
  // Card grids are navigation too: a tile in a portfolio or client listing is
  // not somebody choosing to point at a page mid-sentence, which is what the
  // rule is asking for.
  body = body.replace(/<div class="(?:work|clients)"[\s\S]*?<\/div>\s*(?=<p class="work-hint"|<\/div>)/g, '')
  body = body.replace(/<article class="(?:work-card|client-card)[\s\S]*?<\/article>/g, '')
  return body
}

for (const f of files) {
  const html = await readFile(f, 'utf8')
  const body = editorialBody(html)
  const set = new Set()
  for (const m of body.matchAll(/href="(\/[^"#]*?)"/g)) {
    const u = decodeURIComponent(m[1])
    if (u.startsWith('/assets') || u.startsWith('/api')) continue
    set.add(u)
  }
  links.set(pathOf(f), set)
}

// Whatever still survives on nearly every page is furniture we did not catch.
const timesLinked = {}
for (const set of links.values()) for (const u of set) timesLinked[u] = (timesLinked[u] || 0) + 1
const chrome = new Set(
  Object.entries(timesLinked).filter(([, n]) => n >= files.length - 2).map(([u]) => u)
)

const inbound = {}
for (const page of links.keys()) inbound[page] = []
for (const [from, set] of links) {
  for (const to of set) {
    if (chrome.has(to) || to === from) continue
    if (inbound[to]) inbound[to].push(from)
  }
}

// One page: pass any distinctive fragment of its path. Matching on a
// substring sidesteps the shell rewriting a leading slash into a file path.
const arg = process.argv[2] ? decodeURIComponent(process.argv[2]) : ''
const SEP = String.fromCharCode(92) // avoid writing a backslash in a regex here
const needle = arg.split('/').join(' ').split(SEP).join(' ').trim().split(' ').filter(Boolean).pop() || ''
const matches = needle ? Object.keys(inbound).filter((k) => k.includes(needle)) : []
const target = matches.length === 1 ? matches[0] : ''

if (arg && matches.length === 0) {
  console.error(`nothing in the build matches: ${needle}`)
  process.exit(2)
}
if (arg && matches.length > 1) {
  console.error(`"${needle}" matches ${matches.length} pages:`)
  matches.forEach((m) => console.error(`  ${m}`))
  process.exit(2)
}

if (target) {
  const list = inbound[target]
  if (!list) {
    console.error(`no such page in the build: ${target}`)
    process.exit(2)
  }
  console.log(`\n${target}`)
  console.log(`  editorial inbound links: ${list.length}`)
  list.forEach((f) => console.log(`    <- ${f}`))
  console.log(list.length >= 1 ? '\n  meets rule 9א' : '\n  ORPHAN - rule 9א requires 1-3 inbound links')
  process.exit(list.length >= 1 ? 0 : 1)
}

const rows = Object.entries(inbound).sort((a, b) => a[1].length - b[1].length)
const orphans = rows.filter(([, l]) => l.length === 0)

console.log(`\n${files.length} pages | ${chrome.size} site-wide links treated as navigation\n`)
console.log('fewest editorial inbound links first:\n')
for (const [page, list] of rows.slice(0, 18)) {
  console.log(`  ${String(list.length).padStart(2)}  ${page}`)
}

console.log()
if (orphans.length) {
  console.log(`${orphans.length} orphaned page(s) - rule 9א wants 1-3 inbound links each:`)
  orphans.forEach(([p]) => console.log(`  ${p}`))
  process.exit(1)
}
console.log('no orphans - every page is linked from somewhere in the body of another')
