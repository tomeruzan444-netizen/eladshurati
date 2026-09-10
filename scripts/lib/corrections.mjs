/**
 * Corrections applied on top of the WordPress capture.
 *
 * content/pages.json is the faithful record of what the live site publishes and
 * stays that way — re-crawling must never silently drop a fix, and nobody
 * should have to diff a 4 MB JSON file to see what we changed. Every correction
 * lives here instead, named, with the reason and the number of places it is
 * expected to touch.
 *
 * That count is the safety catch. If a re-crawl changes the source so a rule
 * stops matching, or starts matching more than it should, the build throws
 * rather than quietly applying something nobody reviewed.
 */

const HEB = '֐-׿'

/* ------------------------------------------------------- spelling fixes */

export const textRules = [
  {
    id: 'elad-missing-dalet',
    find: /אלע(?=\s+שורתי)/g,
    replace: 'אלעד',
    expect: 20,
    why: 'שם המותג חסר ד - מופיע בכותרת ובתיאור, כלומר בתוצאות החיפוש',
  },
  {
    id: 'bniat-typo',
    find: /בבניעת/g,
    replace: 'בבניית',
    expect: 15,
    why: 'שגיאת כתיב בשאלת FAQ שמשוכפלת על 15 עמודים',
  },
  {
    id: 'lehizaher',
    find: /להזהר/g,
    replace: 'להיזהר',
    expect: 14,
    why: 'כתיב מלא',
  },
  {
    id: 'metsuyenet',
    find: /מצויינת/g,
    replace: 'מצוינת',
    expect: 4,
    why: 'כתיב מלא - יוד אחת',
  },
  {
    id: 'restaurants-h1-leftover',
    // The H1 read "ייעוץ עסקי ליועצי למסעדות" — "ליועצי" is left over from the
    // mortgage-advisors page it was copied from.
    find: /ייעוץ עסקי ליועצי למסעדות/g,
    replace: 'ייעוץ עסקי למסעדות',
    expect: 3,
    why: 'ה-H1 של עמוד המסעדות נשא מילה מעמוד יועצי המשכנתאות',
  },
  {
    id: 'ai-agents-duplicate-stat',
    /*
     * The page states the same fact twice with different numbers: earlier,
     * "99% of developers... " sourced to an IBM / Morning Consult survey, and
     * later "by estimates, more than 95% of developers...". I cannot tell which
     * figure is right, so I am not picking one — I am removing the unsourced
     * restatement and keeping the sourced figure and the point that followed it.
     */
    find: /על פי הערכות, יותר מ-95% מהמפתחים מפתחים או מתנסים בסוכני AI\. אבל רוב הפרויקטים/g,
    replace: 'רוב הפרויקטים',
    expect: 1,
    why: 'אותו נתון הופיע פעמיים עם שני מספרים. הסרתי את החזרה הלא ממוקרת ושמרתי את הנתון עם המקור.',
  },
  {
    id: 'year-hyphen',
    // "ב 2026" / "ל 2026" — the prefix needs a hyphen before a numeral.
    find: new RegExp(`(^|[\\s>(])([בל])\\s+(?=(?:19|20)\\d\\d)`, 'g'),
    replace: '$1$2-',
    expect: 46,
    why: 'תחילית לפני מספר דורשת מקף: "ב 2026" -> "ב-2026"',
  },

]

/* ------------------------------------------------------- metadata fixes */

export const seoFixes = {
  '/ייעוץ-עסקי-לפתיחת-עסק/': {
    title: 'ייעוץ עסקי לפתיחת עסק חדש | ליווי מהרעיון להשקה | אלעד שורתי',
    description:
      'פותחים עסק חדש? אחרי שנים של ליווי עשרות יזמים, אני מלווה אתכם מהרעיון ועד ההשקה - בדיקת היתכנות, תוכנית עסקית וליווי בחודשים הראשונים.',
    why: 'הכותרת והתיאור היו של עמוד המכללות. ה-H1 והתוכן תמיד היו על פתיחת עסק.',
  },
  '/ייעוץ-שיווקי-מי-צריך-את-זה-ומתי/': {
    title: 'ייעוץ שיווקי | מי צריך את זה ומתי? | אלעד שורתי',
    why: 'הכותרת הייתה של עמוד האימון העסקי. התיאור, ה-H1 והתוכן על ייעוץ שיווקי.',
  },
  '/qa/': {
    title: 'שאלות ותשובות על ייעוץ עסקי | אלעד שורתי',
    description:
      'התשובות לשאלות שאני מקבל הכי הרבה על ייעוץ עסקי - מה זה כולל, למי זה מתאים, כמה זמן זה לוקח ואיך מתחילים.',
    why: 'הכותרת שפורסמה הייתה "שאלות תשובות עיצוב חדש" - הערת עבודה פנימית.',
  },
  '/פרוייקטים/': {
    description:
      'פרויקטים ולקוחות שליוויתי - אתרי תדמית וסחר, מיתוג ותוכן לעסקים בתחומי המשפט, הקוסמטיקה, הרפואה והייצור.',
    why: 'התיאור שפורסם היה כתובת של קובץ mp4, וזה מה שגוגל הציג.',
  },
  '/category/blog/': {
    description: 'מאמרים וטיפים על ייעוץ עסקי, שיווק דיגיטלי ובניית עסק - מאת אלעד שורתי.',
    why: 'התיאור היה "Your blog category", ברירת מחדל של וורדפרס באנגלית.',
  },
  '/category/בלוג-עסקי-מקצועי/': {
    description: 'הבלוג העסקי - מאמרים על ניהול, שיווק, מכירות ואסטרטגיה לעסקים קטנים ובינוניים.',
    why: 'התיאור היה המחרוזת "null".',
  },
  '/info-articles/': {
    description: 'מידע מקצועי וטיפים לשיווק ולהצלחה עסקית - מאמרים, מדריכים ותשובות מהשטח.',
    why: 'התיאור היה המחרוזת "null".',
  },
  '/טעויות-נפוצות-בניהול-תקציב/': {
    title: '4 טעויות נפוצות בניהול תקציב בעסק | מדריך למניעת כשלים',
    description:
      'ארבע טעויות שעשיתי בעצמי בניהול תקציב העסק - מלנהל הכל בראש ועד לא לעקוב אחרי המדדים הנכונים, ומה אני עושה אחרת היום.',
    why:
      'הכותרת הבטיחה 5 טעויות והתיאור הבטיח "5 כללי זהב". בעמוד יש ארבע טעויות ' +
      'ואין רשימת כללים בכלל. תיקנתי את שניהם למה שקיים, ולא המצאתי טעות חמישית.',
  },
  '/סוכני-ai/': {
    title: 'סוכני AI: הכל על סוכני בינה מלאכותית | אלעד שורתי',
    why: 'רווח לפני נקודתיים בכותרת.',
  },
}

/* ------------------------------------------- list items split mid-sentence */

export const listJoins = [
  {
    page: '/ייעוץ-עסקי-למסעדות/',
    // One sentence published as two bullets: the first ends mid-clause with an
    // open parenthesis, the second starts mid-clause and closes it.
    startsWith: 'שיתופי פעולה עם משפיענים מקומיים',
    why: 'פריט רשימה שנחתך באמצע משפט - הסוגר נפתח בפריט אחד ונסגר בבא אחריו',
  },
]

/* ---------------------------------------------------- FAQ items to drop */

export const faqDrops = [
  {
    page: '/ייעוץ-עסקי-למאמני-כושר/',
    match: 'ביבוא או ברהיטים',
    why: 'שאלה על חנות רהיטים בעמוד של מאמני כושר - הועתקה מעמוד אחר.',
  },
]

/* ------------------------------------------------------------- applier */

const walk = (node, fn) => {
  if (typeof node === 'string') return fn(node)
  if (Array.isArray(node)) return node.map((n) => walk(n, fn))
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = walk(v, fn)
    return out
  }
  return node
}

/**
 * Apply every correction to the captured pages. Returns the corrected pages
 * plus a report, and throws if a rule matched a different number of places
 * than it was written for.
 */
export function applyCorrections(pages) {
  const counts = Object.fromEntries(textRules.map((r) => [r.id, 0]))

  const fixString = (s) => {
    let out = s
    for (const r of textRules) {
      r.find.lastIndex = 0
      const hits = (out.match(r.find) || []).length
      if (hits) {
        counts[r.id] += hits
        out = out.replace(r.find, r.replace)
      }
    }
    return out
  }

  // One traversal over everything that is prose. og, twitter and the JSON-LD
  // hold their own copies of the title and description, which is why a single
  // typo shows up a dozen times — each copy has to be corrected, not just the
  // one the page displays.
  let corrected = pages.map((p) => {
    const { seo, ...rest } = p
    // Addresses, not prose. Rewriting one would move the page.
    const { url, path: pth, canonical, ...seoProse } = seo
    return {
      ...walk(rest, fixString),
      seo: { ...walk(seoProse, fixString), url, path: pth, canonical },
    }
  })

  const seoApplied = []
  corrected = corrected.map((p) => {
    const key = decodeURIComponent(p.seo.path)
    const fix = seoFixes[key]
    if (!fix) return p
    const seo = { ...p.seo }
    const og = { ...seo.og }
    const tw = { ...seo.twitter }
    const oldTitle = seo.title
    const oldDesc = seo.description
    if (fix.title) {
      seo.title = fix.title
      if (og.title) og.title = fix.title
      if (tw.title) tw.title = fix.title
    }
    if (fix.description) {
      seo.description = fix.description
      if (og.description) og.description = fix.description
      if (tw.description) tw.description = fix.description
    }
    // The JSON-LD graph keeps its own name/headline/description. Swap only the
    // copies that still hold the old value, so an unrelated node — the person,
    // the site, an image caption — is never touched.
    const relabel = (node) => {
      if (Array.isArray(node)) return node.map(relabel)
      if (node && typeof node === 'object') {
        const out = {}
        for (const [k, v] of Object.entries(node)) {
          if (typeof v === 'string' && fix.title && v === oldTitle && (k === 'name' || k === 'headline')) out[k] = fix.title
          else if (typeof v === 'string' && fix.description && v === oldDesc && k === 'description') out[k] = fix.description
          else out[k] = relabel(v)
        }
        return out
      }
      return node
    }
    seo.jsonld = relabel(seo.jsonld)
    seoApplied.push(key)
    return { ...p, seo: { ...seo, og, twitter: tw } }
  })

  const joinApplied = []
  corrected = corrected.map((p) => {
    const key = decodeURIComponent(p.seo.path)
    const joins = listJoins.filter((j) => j.page === key)
    if (!joins.length) return p
    const blocks = p.blocks.map((b) => {
      if (b.type !== 'list' || !Array.isArray(b.items)) return b
      const items = []
      for (let i = 0; i < b.items.length; i++) {
        const cur = String(b.items[i])
        const j = joins.find((x) => cur.trimStart().startsWith(x.startsWith))
        const next = b.items[i + 1]
        // Only join when the first really is unfinished: more "(" than ")".
        const unclosed = (cur.match(/\(/g) || []).length > (cur.match(/\)/g) || []).length
        if (j && next !== undefined && unclosed) {
          items.push(cur.trimEnd() + ' ' + String(next).trimStart())
          joinApplied.push(key)
          i++
        } else items.push(b.items[i])
      }
      return { ...b, items }
    })
    return { ...p, blocks }
  })

  const faqApplied = []
  corrected = corrected.map((p) => {
    const key = decodeURIComponent(p.seo.path)
    const drops = faqDrops.filter((d) => d.page === key)
    if (!drops.length) return p
    const blocks = p.blocks.map((b) => {
      if (b.type !== 'faq') return b
      const items = (b.items || []).filter(
        (i) => !drops.some((d) => String(i.q || '').includes(d.match))
      )
      if (items.length !== (b.items || []).length) faqApplied.push(key)
      return { ...b, items }
    })
    return { ...p, blocks }
  })

  const drift = textRules
    .filter((r) => counts[r.id] !== r.expect)
    .map((r) => `  ${r.id}: expected ${r.expect}, matched ${counts[r.id]}`)
  if (drift.length) {
    throw new Error(
      'Correction rules no longer match the source as written:\n' +
        drift.join('\n') +
        '\nThe capture changed. Re-read the text and update scripts/lib/corrections.mjs.'
    )
  }

  const missingSeo = Object.keys(seoFixes).filter((k) => !seoApplied.includes(k))
  if (missingSeo.length) {
    throw new Error('SEO corrections target pages that no longer exist:\n  ' + missingSeo.join('\n  '))
  }
  const missingJoin = listJoins.filter((j) => !joinApplied.includes(j.page))
  if (missingJoin.length) {
    throw new Error('List-join corrections matched nothing: ' + missingJoin.map((j) => j.page).join(', '))
  }
  const missingFaq = faqDrops.filter((d) => !faqApplied.includes(d.page))
  if (missingFaq.length) {
    throw new Error('FAQ corrections matched nothing:\n  ' + missingFaq.map((d) => d.page + ' / ' + d.match).join('\n  '))
  }

  return {
    pages: corrected,
    report: { text: counts, seo: seoApplied.length, faq: faqApplied.length, joins: joinApplied.length },
  }
}
