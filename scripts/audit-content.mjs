/**
 * Content audit over every built page.
 *
 * Reads the text as a browser would compose it: tags are removed with an empty
 * string, not a space. Replacing a tag with a space is what made an earlier
 * audit report 32 errors that were not in the source — "לייעוץ" published as
 * "ל<a>ייעוץ</a>" came back as "ל ייעוץ" and looked like a typo.
 *
 * Block-level elements do end a line, so those are turned into newlines before
 * the inline tags are dropped. That keeps two separate paragraphs from being
 * glued into one run-on sentence, which was the other false positive.
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

const BLOCK = /<\/?(p|div|h[1-6]|li|ul|ol|section|article|tr|td|th|br|figure|figcaption|blockquote|main|header|footer|nav)\b[^>]*>/gi

export const visibleText = (html) => {
  const start = html.indexOf('<main')
  const end = html.indexOf('</main>')
  let body = start > -1 && end > -1 ? html.slice(start, end) : html
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
  body = body.replace(/<style[\s\S]*?<\/style>/gi, '')
  body = body.replace(BLOCK, '\n')
  body = body.replace(/<[^>]*>/g, '') // inline tags vanish, exactly like a browser
  body = body
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&laquo;|&raquo;/g, '')
    .replace(/[​-‏]/g, '')
  return body
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
}

const pathOf = (file) => {
  const rel = path.relative(OUT, path.dirname(file)).split(path.sep).join('/')
  return rel ? `/${rel}/` : '/'
}

const files = await walk(OUT)
const pages = []
for (const f of files) {
  const html = await readFile(f, 'utf8')
  pages.push({
    path: pathOf(f),
    title: (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '',
    description: (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '',
    h1: ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]*>/g, '').trim(),
    lines: visibleText(html),
  })
}

if (process.argv[2] === '--dump') {
  const only = process.argv[3] && decodeURIComponent(process.argv[3])
  for (const p of pages) {
    if (only && !p.path.includes(only)) continue
    console.log(`\n\n═══════════════ ${p.path}`)
    console.log(`TITLE: ${p.title}`)
    console.log(`DESC : ${p.description}`)
    p.lines.forEach((l) => console.log(l))
  }
  process.exit(0)
}

/* ------------------------------------------------------------- checks */

const findings = []
const add = (kind, page, detail) => findings.push({ kind, page, detail })

// Repeated word: "את את". Only within one line, so two paragraphs cannot fake it.
//
// Hebrew doubles a handful of words for emphasis on purpose - "כן כן" reads as
// "yes, really", "לאט לאט" as "gradually". Those are writing, not typos, and
// flagging them buries the real ones under noise.
const DELIBERATE = /^(כן|לא|לאט|מהר|טוב|רגע|ממש|הרבה|עוד|שוב)$/
for (const p of pages) {
  for (const line of p.lines) {
    const m = line.match(/(?:^|\s)([֐-׿]{2,})\s+\1(?=\s|$|[.,!?])/)
    if (m && !DELIBERATE.test(m[1])) add('repeated word', p.path, `«${m[1]} ${m[1]}» in: ${line.slice(0, 90)}`)
  }
}

// A lone one-letter Hebrew prefix really is a typo — but only if it survives
// the browser-accurate strip above.
for (const p of pages) {
  for (const line of p.lines) {
    const m = line.match(/(?:^|\s)([להבומשכ])\s+([֐-׿]{2,})/)
    if (m) add('separated prefix', p.path, `«${m[1]} ${m[2]}» in: ${line.slice(0, 90)}`)
  }
}

// Unbalanced brackets or quotes inside a single line.
for (const p of pages) {
  for (const line of p.lines) {
    const open = (line.match(/\(/g) || []).length
    const close = (line.match(/\)/g) || []).length
    if (open !== close) add('unbalanced parens', p.path, `${open} open / ${close} close: ${line.slice(0, 95)}`)
  }
}

// Spacing and punctuation.
for (const p of pages) {
  for (const line of p.lines) {
    if (/\s[,.](?=\s|$)/.test(line)) add('space before punctuation', p.path, line.slice(0, 95))
    if (/[֐-׿],[֐-׿]/.test(line)) add('missing space after comma', p.path, line.slice(0, 95))
    if (/ {2,}/.test(line)) add('double space', p.path, line.slice(0, 95))
    if (/[!?]{2,}/.test(line)) add('repeated punctuation', p.path, line.slice(0, 95))
  }
}

// Known Hebrew spelling slips.
const SPELLING = [
  [/להזהר/, 'להיזהר'],
  [/מצויינ/, 'מצוינ'],
  [/בבניעת/, 'בבניית'],
  [/אלע(?=\s+שורתי)/, 'אלעד'],
  [/שיכנוע/, 'שכנוע'],
  // Only a bare "יעוץ" — not the ייעוץ it sits inside, and not "ייעוץ" itself.
  [/(?<![֐-׿])יעוץ/, 'ייעוץ'],
]
for (const p of pages) {
  for (const line of p.lines) {
    for (const [re, fix] of SPELLING) {
      if (!fix) continue
      const m = line.match(re)
      if (m) add('spelling', p.path, `«${m[0]}» -> «${fix}» in: ${line.slice(0, 85)}`)
    }
  }
}

// Numbers promised in a heading versus items delivered.
for (const p of pages) {
  const m = (p.h1 + ' ' + p.title).match(/(\d+)\s*(סוגי|טיפים|טעויות|שלבים|דרכים|עקרונות|צעדים|כללים|סיבות|שאלות)/)
  if (!m) continue
  const want = Number(m[1])
  // A page usually lists its items twice - once as a table of contents, once as
  // the headings themselves. Count distinct items, or every such page looks
  // like it delivers double what it promised.
  const numbered = new Set(
    p.lines.filter((l) => /^(\d+)[.)]\s/.test(l) || /^(טעות|שלב|טיפ|כלל|סיבה|דרך)\s*(מספר)?\s*\d/.test(l))
  ).size
  if (numbered && numbered !== want) add('count mismatch', p.path, `promises ${want} ${m[2]}, found ${numbered} distinct items`)
}

// Metadata hygiene.
const seenTitle = {}
const seenDesc = {}
for (const p of pages) {
  ;(seenTitle[p.title] = seenTitle[p.title] || []).push(p.path)
  if (p.description) (seenDesc[p.description] = seenDesc[p.description] || []).push(p.path)
  if (!p.description) add('missing description', p.path, '')
  else if (p.description.length < 70) add('short description', p.path, `${p.description.length} chars: ${p.description}`)
  else if (p.description.length > 165) add('long description', p.path, `${p.description.length} chars`)
  if (p.title.length > 65) add('long title', p.path, `${p.title.length} chars: ${p.title}`)
  if (!p.h1) add('no H1', p.path, '')
}
for (const [t, list] of Object.entries(seenTitle)) if (list.length > 1) add('duplicate title', list.join(', '), t)
for (const [d, list] of Object.entries(seenDesc)) if (list.length > 1) add('duplicate description', list.join(', '), d.slice(0, 80))

/* ------------------------------------------------------------- report */

const byKind = {}
for (const f of findings) (byKind[f.kind] = byKind[f.kind] || []).push(f)

console.log(`\n${pages.length} pages read\n`)
if (!findings.length) console.log('no mechanical findings')
for (const [kind, list] of Object.entries(byKind).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n════ ${kind} — ${list.length}`)
  for (const f of list.slice(0, 12)) console.log(`  ${f.page}\n      ${f.detail}`)
  if (list.length > 12) console.log(`  … and ${list.length - 12} more`)
}
