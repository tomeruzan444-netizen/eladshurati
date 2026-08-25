/**
 * Step 6 — Verify the built site.
 *
 * Every internal href must resolve to a page or file that actually exists in
 * site/, and every <img src> must point at a real file. This is the check that
 * proves the migration did not quietly drop a page or an image.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'site')

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) await walk(p, out)
    else out.push(p)
  }
  return out
}

const exists = async (p) => !!(await stat(p).catch(() => null))

const main = async () => {
  const all = await walk(OUT)
  const htmlFiles = all.filter((f) => f.endsWith('.html'))

  const brokenLinks = new Map()
  const brokenImages = new Map()
  // WordPress double-escaped some shortcode output, so raw tag source ended up
  // as visible text. Escaped markup in the output means that leaked through.
  const leakedMarkup = new Map()
  let links = 0
  let images = 0

  for (const file of htmlFiles) {
    const rel = path.relative(OUT, file)
    const html = await readFile(file, 'utf8')

    for (const m of html.matchAll(/href="([^"]+)"/g)) {
      const href = m[1]
      if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue
      links++
      const clean = decodeURIComponent(href.split('#')[0].split('?')[0])
      if (!clean || clean === '/') continue
      const asDir = path.join(OUT, clean, 'index.html')
      const asFile = path.join(OUT, clean)
      if (!(await exists(asDir)) && !(await exists(asFile))) {
        brokenLinks.set(`${rel} → ${clean}`, true)
      }
    }

    for (const m of html.matchAll(/&lt;(img|a|div|span|p)/gi)) {
      leakedMarkup.set(`${rel} → "${m[0]}"`, true)
    }

    for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      const src = m[1]
      if (/^(https?:|data:)/.test(src)) continue
      images++
      const p = path.join(OUT, decodeURIComponent(src.split('?')[0]))
      if (!(await exists(p))) brokenImages.set(`${rel} → ${src}`, true)
    }
  }

  console.log(`pages           ${htmlFiles.length}`)
  console.log(`internal links  ${links} checked, ${brokenLinks.size} broken`)
  console.log(`images          ${images} checked, ${brokenImages.size} missing`)
  console.log(`escaped markup  ${leakedMarkup.size} pages showing tag source as text`)

  for (const k of [...brokenLinks.keys()].slice(0, 20)) console.log('  broken link  ' + k)
  for (const k of [...brokenImages.keys()].slice(0, 20)) console.log('  missing img  ' + k)
  for (const k of [...leakedMarkup.keys()].slice(0, 10)) console.log('  markup text  ' + k)

  if (brokenLinks.size || brokenImages.size || leakedMarkup.size) process.exitCode = 1
}

main()
