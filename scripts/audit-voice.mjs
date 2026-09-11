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
