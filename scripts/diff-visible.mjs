/**
 * What changed for a reader between two builds.
 *
 *   node scripts/diff-visible.mjs <old-site-dir> [new-site-dir]
 *
 * The pages ship minified onto one line, so `git diff` says "1 line changed"
 * and nothing else. This reads both builds the way a browser composes them -
 * block tags end a line, inline tags vanish - and reports the sentences that
 * actually moved. It is the last gate before a commit: anything it prints that
 * was not intended is a bug.
 *
 * To compare against the last commit:
 *   rm -rf /tmp/head && mkdir -p /tmp/head
 *   git archive HEAD site | tar -x -C /tmp/head
 *   node scripts/diff-visible.mjs /tmp/head/site
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OLD = process.argv[2]
const NEW = process.argv[3] || path.join(ROOT, 'site')

if (!OLD) {
  console.error('usage: node scripts/diff-visible.mjs <old-site-dir> [new-site-dir]')
  process.exit(2)
}

const BLOCK =
  /<\/?(p|div|h[1-6]|li|ul|ol|section|article|tr|td|th|br|figure|figcaption|blockquote|main|header|footer|nav)\b[^>]*>/gi

const visibleText = (html) => {
  // The whole body, not just <main>. The testimonials rail, the header and the
  // footer all live outside it, so a <main>-only read reported "no change"
  // when a testimonial was added to all 80 pages.
  const start = html.indexOf('<body')
  const end = html.indexOf('</body>')
  let body = start > -1 && end > -1 ? html.slice(start, end) : html
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
  body = body.replace(BLOCK, '\n').replace(/<[^>]*>/g, '')
  body = body
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/[​-‏]/g, '')
  return body
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
}

const walk = async (dir) => {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else if (e.name === 'index.html') out.push(p)
  }
  return out
}

const load = async (root) => {
  const map = new Map()
  for (const f of await walk(root)) {
    const html = await readFile(f, 'utf8')
    const rel = path.relative(root, path.dirname(f)).split(path.sep).join('/')
    map.set(rel ? `/${rel}/` : '/', {
      title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '',
      desc: (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '',
      lines: visibleText(html),
    })
  }
  return map
}

/** Multiset difference: a line present as often in both builds did not change. */
const minus = (a, b) => {
  const count = new Map()
  for (const l of b) count.set(l, (count.get(l) || 0) + 1)
  const out = []
  for (const l of a) {
    const n = count.get(l) || 0
    if (n > 0) count.set(l, n - 1)
    else out.push(l)
  }
  return out
}

const before = await load(OLD)
const after = await load(NEW)

let pagesChanged = 0
let metaChanges = 0
let gone = 0
let came = 0

for (const [p, o] of before) {
  const n = after.get(p)
  if (!n) {
    console.log(`\n!! PAGE DISAPPEARED: ${p}`)
    continue
  }
  const removed = minus(o.lines, n.lines)
  const added = minus(n.lines, o.lines)
  const meta = []
  if (o.title !== n.title) meta.push(['title', o.title, n.title])
  if (o.desc !== n.desc) meta.push(['description', o.desc, n.desc])
  if (!removed.length && !added.length && !meta.length) continue
  pagesChanged++
  console.log(`\n═══ ${p}`)
  for (const [k, a, b] of meta) {
    metaChanges++
    console.log(`  ${k}:\n    -  ${a}\n    +  ${b}`)
  }
  for (const l of removed) {
    gone++
    console.log(`  -  ${l.slice(0, 160)}`)
  }
  for (const l of added) {
    came++
    console.log(`  +  ${l.slice(0, 160)}`)
  }
}
for (const p of after.keys()) if (!before.has(p)) console.log(`\n++ NEW PAGE: ${p}`)

console.log('\n────────────────────────────────────')
console.log(
  `${pagesChanged} page(s) changed | ${metaChanges} metadata change(s) | ${gone} line(s) out, ${came} line(s) in`
)
