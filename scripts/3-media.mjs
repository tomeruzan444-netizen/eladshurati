/**
 * Step 3 — Bring every image across.
 *
 * Two passes: first scan the stylesheets the pages load (Elementor keeps section
 * backgrounds there, so they never appear in the markup), then download every
 * file into assets/images/ keeping the year/month folders WordPress used.
 * Read-only against the live site.
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { load } from 'cheerio'

const ROOT = path.resolve(import.meta.dirname, '..')
const ORIGIN = 'https://elad-digital.co.il'
const IMG_DIR = path.join(ROOT, 'assets', 'images')
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif|svg|ico)(\?|$)/i

/** WordPress writes out -300x200 style thumbnails; we only want the original. */
function baseVariant(url) {
  return url.replace(/-\d{2,4}x\d{2,4}(?=\.(png|jpe?g|webp|gif|avif)$)/i, '')
}

async function get(url, as = 'text') {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return as === 'buffer' ? Buffer.from(await res.arrayBuffer()) : await res.text()
}

async function scanStylesheets(htmlDir, files) {
  const sheets = new Set()
  for (const f of files) {
    const $ = load(await readFile(path.join(htmlDir, f), 'utf8'))
    $('link[rel="stylesheet"][href], link[rel="preload"][as="style"][href]').each((_, el) => {
      const href = $(el).attr('href')
      if (!href) return
      try {
        const u = new URL(href, ORIGIN)
        if (u.origin === ORIGIN) sheets.add(u.href)
      } catch {
        /* ignore */
      }
    })
  }

  const found = new Set()
  let ok = 0
  for (const sheet of sheets) {
    try {
      const css = await get(sheet)
      ok++
      for (const m of css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
        const raw = m[2].trim()
        if (!IMAGE_RE.test(raw) || raw.startsWith('data:')) continue
        try {
          const u = new URL(raw, sheet)
          if (u.origin === ORIGIN) found.add(u.href)
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* a stylesheet that 404s on the live site is not our problem */
    }
  }
  console.log(`stylesheets  ${ok}/${sheets.size} readable, ${found.size} image refs inside`)
  return found
}

const main = async () => {
  await mkdir(IMG_DIR, { recursive: true })
  const htmlDir = path.join(ROOT, '_source', 'html')
  const index = JSON.parse(await readFile(path.join(ROOT, '_source', 'url-index.json'), 'utf8'))
  const files = index.map((e) => path.basename(e.file))

  const fromMarkup = new Set(JSON.parse(await readFile(path.join(ROOT, 'content', 'media.json'), 'utf8')))
  const fromCss = await scanStylesheets(htmlDir, files)

  // The whole WordPress media library, so nothing is left behind on the old host.
  const library = []
  for (const f of ['wp-media.json', 'wp-media-2.json', 'wp-media-3.json']) {
    const p = path.join(ROOT, '_source', f)
    if (!existsSync(p)) continue
    const data = JSON.parse(await readFile(p, 'utf8'))
    if (Array.isArray(data)) library.push(...data)
  }
  const fromLibrary = new Set()
  const altText = {}
  for (const item of library) {
    if (item.source_url) {
      fromLibrary.add(item.source_url)
      altText[item.source_url] = {
        alt: item.alt_text || '',
        title: item.title?.rendered || '',
        width: item.media_details?.width ?? null,
        height: item.media_details?.height ?? null,
      }
    }
    for (const size of Object.values(item.media_details?.sizes || {})) {
      if (size.source_url) fromLibrary.add(size.source_url)
    }
  }
  console.log(`wp library   ${library.length} attachments, ${fromLibrary.size} files (incl. sizes)`)
  await writeFile(path.join(ROOT, 'content', 'media-alt.json'), JSON.stringify(altText, null, 2), 'utf8')

  // Keep every referenced URL, plus the un-resized original of each thumbnail.
  const all = new Set()
  for (const u of [...fromMarkup, ...fromCss, ...fromLibrary]) {
    if (!u.startsWith(ORIGIN)) continue
    if (!IMAGE_RE.test(u)) continue
    all.add(u)
    all.add(baseVariant(u))
  }

  const manifest = []
  let fetched = 0
  let cached = 0
  let missing = 0

  for (const url of [...all].sort()) {
    const rel = decodeURIComponent(new URL(url).pathname.replace(/^\/wp-content\/uploads\//, ''))
    const dest = path.join(IMG_DIR, rel)
    const localPath = `/assets/images/${rel.split(path.sep).join('/')}`

    if (existsSync(dest)) {
      cached++
      manifest.push({ url, local: localPath, bytes: (await stat(dest)).size })
      continue
    }
    try {
      const buf = await get(url, 'buffer')
      await mkdir(path.dirname(dest), { recursive: true })
      await writeFile(dest, buf)
      fetched++
      manifest.push({ url, local: localPath, bytes: buf.length })
      await new Promise((r) => setTimeout(r, 120))
    } catch (err) {
      missing++
      manifest.push({ url, local: null, error: String(err.message || err) })
    }
  }

  await writeFile(path.join(ROOT, 'content', 'media-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')

  const bytes = manifest.reduce((n, m) => n + (m.bytes || 0), 0)
  console.log(`downloaded   ${fetched} new, ${cached} already local, ${missing} unavailable`)
  console.log(`total        ${manifest.filter((m) => m.local).length} files, ${(bytes / 1048576).toFixed(1)} MB`)
  if (missing) {
    console.log('\nunavailable (referenced but 404 on the live site):')
    for (const m of manifest.filter((x) => !x.local).slice(0, 20)) {
      console.log('  ' + decodeURIComponent(m.url.replace(ORIGIN, '')))
    }
  }
}

main()
