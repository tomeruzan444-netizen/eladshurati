/**
 * Dry run for the correction rules: print every place each one would fire,
 * with context, and where in the record it sits.
 *
 * Written after an audit that stripped tags by replacing them with a space and
 * so invented 32 errors that were not in the source. Nothing gets corrected
 * here until its matches have been read one by one.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { textRules } from './lib/corrections.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const pages = JSON.parse(await readFile(path.join(ROOT, 'content', 'pages.json'), 'utf8'))

const hits = Object.fromEntries(textRules.map((r) => [r.id, []]))

const scan = (node, where, page) => {
  if (typeof node === 'string') {
    for (const r of textRules) {
      r.find.lastIndex = 0
      for (const m of node.matchAll(r.find)) {
        hits[r.id].push({
          page,
          where,
          match: m[0],
          context: node.slice(Math.max(0, m.index - 55), m.index + 60).replace(/\s+/g, ' '),
        })
      }
    }
    return
  }
  if (Array.isArray(node)) return node.forEach((n, i) => scan(n, `${where}[${i}]`, page))
  if (node && typeof node === 'object')
    return Object.entries(node).forEach(([k, v]) => scan(v, where ? `${where}.${k}` : k, page))
}

for (const p of pages) {
  const key = decodeURIComponent(p.seo.path)
  const { url, path: pth, canonical, ...seoRest } = p.seo
  scan({ ...p, seo: seoRest }, '', key)
}

for (const r of textRules) {
  const list = hits[r.id]
  console.log()
  console.log(`════ ${r.id}  —  ${list.length} match(es)`)
  console.log(`     ${r.why}`)
  // group by field so the og/twitter/jsonld duplication is visible, not surprising
  const byField = {}
  list.forEach((h) => {
    const f = h.where.replace(/\[\d+\]/g, '[]')
    byField[f] = (byField[f] || 0) + 1
  })
  Object.entries(byField)
    .sort((a, b) => b[1] - a[1])
    .forEach(([f, n]) => console.log(`       ${String(n).padStart(3)}  ${f}`))
  const pagesHit = [...new Set(list.map((h) => h.page))]
  console.log(`       on ${pagesHit.length} page(s)`)
  list.slice(0, 3).forEach((h) => console.log(`       e.g. …${h.context}…`))
}
