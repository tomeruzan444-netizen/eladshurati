/**
 * Turn a PR article in content/pr/*.md into the two formats a publisher can
 * actually use:
 *
 *   <name>.html  - paste into the CMS editor (headings, bold, list, link)
 *   <name>.txt   - plain text, no markup at all, for mail or a plain editor
 *
 *   node scripts/pr-export.mjs                 every article in content/pr
 *   node scripts/pr-export.mjs <file.md>       just one
 *
 * The markdown file stays the single source: both outputs are generated from
 * the part after "## המאמר", so the working notes above it never ship.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIR = path.join(ROOT, 'content', 'pr')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Inline markdown -> HTML. Links first, so bold inside a link still works. */
const inlineHtml = (s) =>
  esc(s)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1<em>$2</em>')

/** Inline markdown -> plain text. A link becomes its words plus the address. */
const inlinePlain = (s) =>
  s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1$2')

function convert(md) {
  const start = md.indexOf('## המאמר')
  const body = start > -1 ? md.slice(start + '## המאמר'.length) : md
  const lines = body.split(/\r?\n/)

  // The headline sits under "כותרת מוצעת", above the body, and has to lead the
  // exported article - otherwise both files come out without a title.
  const titleAt = md.indexOf('## כותרת מוצעת')
  const title =
    titleAt > -1
      ? (md
          .slice(titleAt + '## כותרת מוצעת'.length, start > -1 ? start : undefined)
          .split(/\r?\n/)
          .map((l) => l.trim())
          .find((l) => l && l !== '---' && !l.startsWith('**') && !l.startsWith('-')) || '')
      : ''

  const html = []
  const text = []
  if (title) {
    html.push(`<h1>${inlineHtml(title)}</h1>`)
    text.push(inlinePlain(title), '')
  }
  let para = []
  let list = []

  const flushPara = () => {
    if (!para.length) return
    const joined = para.join(' ')
    html.push(`<p>${inlineHtml(joined)}</p>`)
    text.push(inlinePlain(joined), '')
    para = []
  }
  const flushList = () => {
    if (!list.length) return
    html.push('<ul>', ...list.map((i) => `  <li>${inlineHtml(i)}</li>`), '</ul>')
    text.push(...list.map((i) => `• ${inlinePlain(i)}`), '')
    list = []
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line === '---') {
      flushPara()
      flushList()
      continue
    }
    if (line.startsWith('## ')) {
      flushPara()
      flushList()
      const t = line.slice(3)
      html.push(`<h1>${inlineHtml(t)}</h1>`)
      text.push(inlinePlain(t), '')
      continue
    }
    if (line.startsWith('### ')) {
      flushPara()
      flushList()
      const t = line.slice(4)
      html.push(`<h2>${inlineHtml(t)}</h2>`)
      text.push(inlinePlain(t), '')
      continue
    }
    if (line.startsWith('- ')) {
      flushPara()
      list.push(line.slice(2))
      continue
    }
    // "כותרת מוצעת" and the alternatives are notes, not the article itself.
    if (/^\*\*כותרות חלופיות/.test(line)) break
    flushList()
    para.push(line)
  }
  flushPara()
  flushList()

  return { html: html.join('\n') + '\n', text: text.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n' }
}

const files = process.argv[2]
  ? [path.resolve(process.argv[2])]
  : (await readdir(DIR)).filter((f) => f.endsWith('.md')).map((f) => path.join(DIR, f))

for (const file of files) {
  const md = await readFile(file, 'utf8')
  const { html, text } = convert(md)
  const base = file.replace(/\.md$/, '')
  await writeFile(`${base}.html`, html, 'utf8')
  await writeFile(`${base}.txt`, text, 'utf8')
  const words = text.replace(/[•()]/g, ' ').replace(/https?:\S+/g, '').split(/\s+/).filter(Boolean).length
  console.log(`${path.basename(base)}\n  .html  ${html.length} chars\n  .txt   ${text.length} chars, ~${words} words`)
}
