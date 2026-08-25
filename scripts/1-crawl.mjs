/**
 * Step 1 — Crawl the live site.
 * Reads the Rank Math sitemaps, downloads the rendered HTML of every URL,
 * and stores it under _source/html/ for offline parsing.
 * Read-only against the live site.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const HTML_DIR = path.join(ROOT, '_source', 'html')
const ORIGIN = 'https://elad-digital.co.il'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

/** Turn a URL into a stable, filesystem-safe filename. */
export function slugKey(url) {
  const u = new URL(url)
  const decoded = decodeURIComponent(u.pathname).replace(/^\/|\/$/g, '')
  if (!decoded) return 'home'
  return decoded.replace(/\//g, '__')
}

async function readSitemap(file) {
  const xml = await readFile(path.join(ROOT, '_source', 'sitemaps', file), 'utf8')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const loc = m[1].trim()
    const block = xml.slice(m.index, m.index + 600)
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null
    return { loc, lastmod }
  })
}

async function fetchWithRetry(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'he-IL,he;q=0.9' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (err) {
      if (i === tries) throw err
      await new Promise((r) => setTimeout(r, 1200 * i))
    }
  }
}

const main = async () => {
  await mkdir(HTML_DIR, { recursive: true })

  const groups = [
    { type: 'page', file: 'page.xml' },
    { type: 'post', file: 'post.xml' },
    { type: 'category', file: 'category.xml' },
  ]

  const index = []
  for (const g of groups) {
    const entries = await readSitemap(g.file)
    for (const { loc, lastmod } of entries) {
      const key = slugKey(loc)
      const file = path.join(HTML_DIR, `${key}.html`)
      let status = 'cached'
      if (!existsSync(file)) {
        const html = await fetchWithRetry(loc)
        await writeFile(file, html, 'utf8')
        status = 'fetched'
        await new Promise((r) => setTimeout(r, 350)) // be gentle with the live server
      }
      index.push({ type: g.type, url: loc, lastmod, key, file: path.relative(ROOT, file) })
      console.log(`${status.padEnd(8)} ${g.type.padEnd(8)} ${decodeURIComponent(new URL(loc).pathname)}`)
    }
  }

  await writeFile(path.join(ROOT, '_source', 'url-index.json'), JSON.stringify(index, null, 2), 'utf8')
  console.log(`\n${index.length} URLs captured -> _source/url-index.json`)
}

main()
