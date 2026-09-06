/**
 * Go-live sweep.
 *
 *   node scripts/8-golive.mjs https://eladshurati-hgrp.vercel.app
 *   node scripts/8-golive.mjs https://elad-digital.co.il
 *
 * Run it against the preview before the DNS change and against the real
 * domain straight after. Every live URL must answer 200 on its own — a
 * redirect means the address Google has on file has quietly moved.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const base = (process.argv[2] || '').replace(/\/$/, '')
if (!base) {
  console.error('usage: node scripts/8-golive.mjs <base-url>')
  process.exit(2)
}

const pages = JSON.parse(await readFile(path.join(ROOT, 'content', 'pages.json'), 'utf8'))

const hit = async (url, method = 'GET') => {
  try {
    const r = await fetch(url, { method, redirect: 'manual' })
    return { status: r.status, location: r.headers.get('location'), type: r.headers.get('content-type') }
  } catch (e) {
    return { status: 0, error: e.message }
  }
}

const pool = async (items, n, fn) => {
  const out = []
  let i = 0
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) out.push(await fn(items[i++]))
    })
  )
  return out
}

let fail = 0
const bad = (msg) => {
  fail++
  console.log('  FAIL  ' + msg)
}

console.log(`\nsweeping ${base}\n`)

/* ---- every indexed URL must be a straight 200 ---- */
const results = await pool(pages, 8, async (p) => {
  const url = base + p.seo.path
  const r = await hit(url)
  return { p, r }
})
let ok200 = 0
for (const { p, r } of results) {
  if (r.status === 200) ok200++
  else bad(`${r.status}${r.location ? ' -> ' + r.location : ''}  ${decodeURIComponent(p.seo.path)}`)
}
console.log(`  ${ok200}/${pages.length} indexed URLs return 200`)

/* ---- the files Search Console polls ---- */
for (const f of ['/sitemap_index.xml', '/page-sitemap.xml', '/post-sitemap.xml', '/category-sitemap.xml', '/robots.txt']) {
  const r = await hit(base + f)
  if (r.status !== 200) bad(`${r.status}  ${f}`)
}
console.log('  sitemaps + robots.txt reachable')

/* ---- robots.txt must actually invite crawlers on the real domain ---- */
const robots = await fetch(base + '/robots.txt').then((r) => r.text()).catch(() => '')
const open = /Allow: \//.test(robots) && !/^\s*Disallow: \/\s*$/m.test(robots)
const real = base.includes('elad-digital.co.il')
if (real && !open) bad('robots.txt is still closed on the real domain — the site will not be crawled')
if (!real && open) bad('robots.txt is OPEN on a staging host — it will compete with the live site')
console.log(`  robots.txt is ${open ? 'open' : 'closed'} (${real ? 'real domain' : 'staging host'}) — correct`)

/* ---- the page-level robots meta must agree with it ---- */
const home = await fetch(base + '/').then((r) => r.text()).catch(() => '')
const noindex = /<meta name="robots" content="noindex/.test(home)
if (real && noindex) bad('pages carry noindex on the real domain — this would deindex the site')
if (!real && !noindex) bad('pages are missing noindex on a staging host')
console.log(`  page robots meta says ${noindex ? 'noindex' : 'index'} — correct`)

/* ---- Search Console ownership ---- */
if (!home.includes('google-site-verification')) bad('google-site-verification tag is missing from the home page')
else console.log('  google-site-verification present')

/* ---- old image URLs still resolve ---- */
const uploads = [...new Set([...home.matchAll(/https?:\/\/[^"']*(\/wp-content\/uploads\/[^"'\ )]+)/g)].map((m) => m[1]))]
let imgOk = 0
for (const u of uploads.slice(0, 10)) {
  const r = await hit(base + u, 'HEAD')
  if (r.status === 200) imgOk++
  else bad(`${r.status}  ${decodeURIComponent(u)}  (og:image / JSON-LD image)`)
}
console.log(`  ${imgOk}/${Math.min(uploads.length, 10)} legacy upload URLs resolve`)

/* ---- legacy WordPress paths ---- */
for (const [p, want] of [['/index.php', 308]]) {
  const r = await hit(base + p)
  if (r.status !== want) bad(`${p} returned ${r.status}, expected ${want}`)
}
console.log('  legacy WordPress paths redirect')

/* ---- the lead form endpoint ----
   Ask the handler whether delivery is configured. Posting a decoy would come
   back 200 from the honeypot branch without ever reaching the mail call, which
   is a pass that proves nothing. */
const health = await fetch(base + '/api/lead/').then((r) => r.json()).catch(() => null)
if (!health) bad('/api/lead/ is unreachable')
else if (!health.configured)
  bad('/api/lead/ is up but RESEND_API_KEY is not set — every enquiry would be dropped')
else console.log('  /api/lead/ is configured for delivery')

// --send posts a real enquiry, so an inbox proves the whole path end to end.
if (process.argv.includes('--send')) {
  const r = await fetch(base + '/api/lead/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'בדיקת עלייה לאוויר',
      phone: '0527075029',
      message: 'הודעת בדיקה אוטומטית — אפשר להתעלם.',
      page: '/go-live-check',
    }),
  }).catch(() => null)
  const body = r ? await r.json().catch(() => ({})) : {}
  if (!r || !body.ok) bad(`test enquiry was not accepted (${r ? r.status : 'no response'})`)
  else console.log('  test enquiry accepted — check the inbox')
}

console.log(fail ? `\n${fail} problem(s) — do not cut over yet\n` : '\nall clear\n')
process.exit(fail ? 1 : 0)
