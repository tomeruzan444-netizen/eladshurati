/**
 * Print the exact source strings a correction rule will have to match.
 *
 * Correction rules are written against content/pages.json, not against the
 * rendered page, so the string has to be copied from there — guessing at it is
 * how a rule silently matches nothing.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const pages = JSON.parse(await readFile(path.join(ROOT, 'content', 'pages.json'), 'utf8'))

const TARGETS = [
  ['/אודות/', /ובינונים/g],
  ['/אודות/', /מורכבויות/g],
  ['/בניית-אתרים/', /התחמחות/g],
  ['/בניית-אתרים/', /באת בניית/g],
  ['/בניית-אתרים/', /ומתעלמים ודברים/g],
  ['/בניית-אתרים/', /מהם מערכות/g],
  ['/בניית-אתרים/', /מהם העלויות[^"]{0,30}/g],
  ['/טעויות-נפוצות-בניהול-תקציב/', /כןכן[^"]{0,30}/g],
  ['/volume_up/', /ובנונים/g],
  ['/volume_up/', /ודא שהיועץ שיש לך[^"]{0,40}/g],
  ['/volume_up/', /פגש עם מספר/g],
  ['/volume_up/', /בנוסף למידע שהוזכר[^"]{0,60}/g],
  ['/אימון-עסקי/', /בניגוד ל [^"]{0,30}/g],
  ['/בניית-אסטרטגיה-שיווקית/', /אלעד שורתי ,/g],
  ['/בניית-אסטרטגיה-שיווקית/', /הנפוצות בבניית אסטרטגיה שיווקית הוא/g],
  ['/ייעוץ-עסקי-לרופאים/', /מקצועית גבוהה \./g],
  ['/ייעוץ-עסקי-לסוכני-ביטוח/', /ביטוח,זה/g],
  ['/ייעוץ-עסקי-לקוסמטיקאיות/', /רווחים\. למה\?\?/g],
  ['/בניית-תכנית-עסקית/', /ב- 2026/g],
  ['/בניית-תכנית-עסקית/', /[^"]{0,25}2025[^"]{0,45}/g],
  ['/שיווק-ממומן/', /ב- 2026/g],
  ['/ייעוץ-עסקי-למסעדות/', /[^"]{0,25}2025[^"]{0,45}/g],
  ['/qa/', /"label":"(Phone|Email)"/g],
  ['/', /השירותים שלנו/g],
  ['/הכוח-המוסתר-שמאחורי-יעוץ-עסקי/', /(?<![֐-׿])יעוץ/g],
]

for (const [slug, re] of TARGETS) {
  const page = pages.find((p) => decodeURIComponent(p.seo.path) === slug)
  console.log(`\n── ${slug}   ${re}`)
  if (!page) {
    console.log('   page not found')
    continue
  }
  const blob = JSON.stringify(page)
  const seen = new Set()
  let n = 0
  for (const m of blob.matchAll(re)) {
    const ctx = blob.slice(Math.max(0, m.index - 60), m.index + m[0].length + 60)
    if (seen.has(ctx)) continue
    seen.add(ctx)
    n++
    if (n <= 3) console.log(`   …${ctx.replace(/\\"/g, '"')}…`)
  }
  console.log(`   ${[...blob.matchAll(re)].length} match(es) in the record`)
}
