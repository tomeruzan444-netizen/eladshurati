/**
 * Re-measure the numbers in docs/voice-guide.md.
 *
 * The guide is built on measurement, not opinion, so the measurement has to be
 * repeatable. Run this after new pages go up and update section 3 if the
 * figures have moved.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { applyCorrections } from './lib/corrections.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')

/*
 * With no argument this measures the whole site, which is where the figures in
 * docs/voice-guide.md come from. With a file it measures one draft against
 * those same figures, so a new page can be checked before it is built.
 */
const draftPath = process.argv[2]

if (draftPath) {
  const md = await readFile(path.resolve(draftPath), 'utf8')
  // A draft carries a meta package and working notes; only the page body counts.
  const from = md.indexOf('### H1:')
  const to = md.indexOf('## מה חסר')
  const body = md.slice(from > -1 ? from : 0, to > -1 ? to : md.length)
  const plain = body.replace(/<[^>]*>/g, ' ').replace(/[#*|>`_]/g, ' ').replace(/\s+/g, ' ').trim()
  const words = plain.split(' ').filter(Boolean).length

  // Prose paragraphs only — the basis the site figures were measured on.
  // Counting list items and bold labels as sentences deflates the median.
  const paras = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(
      (b) =>
        b &&
        !b.startsWith('#') &&
        !b.startsWith('|') &&
        !b.startsWith('-') &&
        !b.startsWith('*') &&
        !/^\d+\./.test(b)
    )
  const prose = paras.join(' ').replace(/<[^>]*>/g, '').replace(/[*`]/g, '').replace(/\s+/g, ' ')
  const sents = prose
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 15)
  const lens = sents.map((x) => x.split(/\s+/).length).sort((a, b) => a - b)
  const mid = lens[Math.floor(lens.length / 2)]
  const short = Math.round((lens.filter((l) => l < 12).length / lens.length) * 100)
  const hits = (re) => (prose.match(re) || []).length
  const plural = hits(/(?:^|\s)(אתם|שלכם|לכם|אצלכם)(?=\s|[.,!?])/g)
  const singular = hits(/(?:^|\s)(אתה|שלך|לך)(?=\s|[.,!?])/g)
  const feminine = hits(/(?:^|\s)(אתן|שלכן|לכן)(?=\s|[.,!?])/g)

  let failed = 0
  const line = (label, value, ok, note) => {
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label.padEnd(24)} ${String(value).padEnd(9)} ${note}`)
  }

  console.log(`\n${path.basename(draftPath)}\n`)
  line('words', words, words >= 800 && words <= 1100, 'rule 17: 800-1,100')
  line('median sentence', mid, Math.abs(mid - 12) <= 2, 'site: 12 words')
  line('under 12 words', short + '%', Math.abs(short - 44) <= 12, 'site: 44%')
  line('longest sentence', lens[lens.length - 1], lens[lens.length - 1] <= 39, 'site ceiling: 39')
  line(
    'address plural/sg/fem',
    `${plural}/${singular}/${feminine}`,
    !(plural >= 3 && singular >= 3),
    'never mixed in one page'
  )
  console.log()
  process.exit(failed ? 1 : 0)
}

const raw = JSON.parse(await readFile(path.join(ROOT, 'content', 'pages.json'), 'utf8'))
const { pages } = applyCorrections(raw)

const norm = (s) =>
  String(s || '').replace(/&nbsp;/g, ' ').replace(/[\u200b-\u200f]/g, '').replace(/\s+/g, ' ').trim()

let prose = ''
const sentences = []
for (const p of pages) {
  for (const b of p.blocks) {
    if (b.type === 'richtext') {
      const t = norm(b.html.replace(/<[^>]*>/g, ' '))
      prose += ' ' + t
      t.split(/(?<=[.!?])\s+/).forEach((s) => {
        s = norm(s)
        if (s.length > 15) sentences.push(s)
      })
    } else if (b.type === 'list') {
      ;(b.items || []).forEach((i) => (prose += ' ' + norm(String(i).replace(/<[^>]*>/g, ' '))))
    }
  }
}

// Sentence openers: how often a thought starts in the first person.
const openers = sentences.filter((s) => /^אני(?=\s)/.test(s)).length

const lens = sentences.map((s) => s.split(/\s+/).length).sort((a, b) => a - b)
const at = (q) => lens[Math.floor(lens.length * q)]
const n = (re) => (prose.match(re) || []).length

console.log('sentences measured   ', sentences.length)
console.log('median sentence      ', at(0.5), 'words')
console.log('under 12 words       ', Math.round((lens.filter((l) => l < 12).length / lens.length) * 100) + '%')
console.log('longest sentence     ', lens[lens.length - 1], 'words')
console.log('sentences opening "אני"', openers)
console.log()
// Address is only meaningful per page — the site-wide totals hide that each
// page is internally consistent while the site as a whole is not.
const textOf = (pg) => {
  let t = ''
  for (const b of pg.blocks) {
    if (b.type === 'richtext') t += ' ' + norm(b.html.replace(/<[^>]*>/g, ' '))
    else if (b.type === 'list') (b.items || []).forEach((i) => (t += ' ' + norm(String(i).replace(/<[^>]*>/g, ' '))))
    else if (b.type === 'faq')
      (b.items || []).forEach((i) => (t += ' ' + norm(i.q) + ' ' + norm((i.a || '').replace(/<[^>]*>/g, ' '))))
  }
  return t
}
const hits = (t, re) => (t.match(re) || []).length
const tally = { plural: 0, singular: 0, feminine: 0, mixed: 0, none: 0 }
for (const pg of pages) {
  const t = textOf(pg)
  const pl = hits(t, /(?:^|\s)(אתם|שלכם|לכם|עליכם|אצלכם)(?=\s|[.,!?])/g)
  const sg = hits(t, /(?:^|\s)(אתה|שלך|לך|אצלך)(?=\s|[.,!?])/g)
  const fm = hits(t, /(?:^|\s)(אתן|שלכן|לכן|אצלכן)(?=\s|[.,!?])/g)
  if (fm >= 3) tally.feminine++
  else if (pl + sg === 0) tally.none++
  else if (pl >= 3 && sg >= 3) tally.mixed++
  else if (pl > sg) tally.plural++
  else tally.singular++
}
console.log('pages mostly אתם     ', tally.plural)
console.log('pages mostly אתה     ', tally.singular)
console.log('pages mostly אתן     ', tally.feminine)
console.log('pages mixing both    ', tally.mixed)
console.log('pages with no address', tally.none)
console.log()

for (const [label, re] of [
  ['"מהניסיון שלי"', /מהניסיון שלי/g],
  ['"אני רואה"', /אני רואה/g],
  ['"אני תמיד"', /אני תמיד/g],
  ['"אני מאמין"', /אני מאמין/g],
  ['"אני לא"', /אני לא/g],
  ['"ניתן ל" (passive)', /ניתן ל/g],
  ['אתם / שלכם', /(?:^|\s)(אתם|שלכם|לכם|עליכם|אצלכם)(?=\s|[.,!?])/g],
  ['אתה / שלך', /(?:^|\s)(אתה|שלך|לך|אצלך)(?=\s|[.,!?])/g],
  ['אתן / שלכן', /(?:^|\s)(אתן|שלכן|לכן|אצלכן)(?=\s|[.,!?])/g],
]) {
  console.log(String(n(re)).padStart(5), label)
}
