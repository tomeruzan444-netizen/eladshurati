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
  /* ---------------------------------------- audit of 12.9.2026: spelling */
  {
    id: 'about-binoniim',
    find: /ובינונים/g,
    replace: 'ובינוניים',
    expect: 1,
    why: 'עמוד אודות: "עסקים קטנים ובינונים" חסרה יוד',
  },
  {
    id: 'about-murkavut',
    find: /בעיות מורכבויות/g,
    replace: 'בעיות מורכבות',
    expect: 1,
    why: 'עמוד אודות: "בעיות מורכבויות" - צורת ריבוי שגויה',
  },
  {
    id: 'sites-hitmachut',
    find: /התחמחות/g,
    replace: 'ההתמחות',
    expect: 4,
    why: 'שגיאת כתיב בתיאור המטא של בניית אתרים - מוצג בתוצאות החיפוש',
  },
  {
    id: 'sites-baet',
    find: /דואגים באת בניית/g,
    replace: 'דואגים בעת בניית',
    expect: 2,
    why: 'בניית אתרים: "באת" במקום "בעת" בכותרת H2',
  },
  {
    id: 'sites-midvarim',
    find: /ומתעלמים ודברים/g,
    replace: 'ומתעלמים מדברים',
    expect: 1,
    why: 'בניית אתרים: "מתעלמים ודברים" במקום "מדברים"',
  },
  {
    id: 'sites-mehen-cms',
    find: /מהם מערכות ניהול תוכן/g,
    replace: 'מהן מערכות ניהול תוכן',
    expect: 1,
    why: 'התאמת מין: "מערכות" נקבה',
  },
  {
    id: 'sites-mehen-alujot',
    find: /מהם העלויות הכרוכות בבניית אתר\?0/g,
    replace: 'מהן העלויות הכרוכות בבניית אתר?',
    expect: 1,
    why: 'התאמת מין, וגם ספרה 0 תלושה בסוף השאלה',
  },
  {
    id: 'budget-kenken',
    find: /כןכן מה שאתה קוראים/g,
    replace: 'כן כן, מה שאתם קוראים',
    expect: 1,
    why: 'שתי מילים נדבקו, ויחיד מול רבים באותו משפט',
  },
  {
    id: 'volume-bnonim',
    find: /קטנים ובנונים/g,
    replace: 'קטנים ובינוניים',
    expect: 2,
    why: 'שגיאת כתיב',
  },
  {
    id: 'volume-vada',
    find: /ודא שהיועץ שיש לך ניסיון עבודה/g,
    replace: 'ודא שליועץ יש ניסיון עבודה',
    expect: 1,
    why: 'משפט שבור תחבירית',
  },
  {
    id: 'volume-pgosh',
    find: /<strong>פגש עם מספר יועצים:<\/strong>/g,
    replace: '<strong>היפגש עם מספר יועצים:</strong>',
    expect: 1,
    why: 'צורת ציווי שגויה',
  },
  {
    id: 'marketing-taut-hi',
    find: /הנפוצות בבניית אסטרטגיה שיווקית הוא לנסות/g,
    replace: 'הנפוצות בבניית אסטרטגיה שיווקית היא לנסות',
    expect: 1,
    why: 'התאמת מין: "טעות" נקבה',
  },

  /* ------------------------------------- audit of 12.9.2026: punctuation */
  {
    id: 'doctors-space-period',
    find: /רמה מקצועית גבוהה \./g,
    replace: 'רמה מקצועית גבוהה.',
    expect: 1,
    why: 'רווח לפני נקודה',
  },
  {
    id: 'insurance-comma',
    find: /סוכני ביטוח,זה/g,
    replace: 'סוכני ביטוח, זה',
    expect: 1,
    why: 'חסר רווח אחרי פסיק',
  },
  {
    id: 'cosmetics-double-q',
    find: /רווחים\. למה\?\?/g,
    replace: 'רווחים. למה?',
    expect: 1,
    why: 'סימן שאלה כפול',
  },
  {
    id: 'hyphen-space-year',
    find: /([בל])- (?=(?:19|20)\d\d)/g,
    replace: '$1-',
    expect: 4,
    why: 'רווח אחרי המקף: "ב- 2026" -> "ב-2026"',
  },

  /* ----------------------------------------- audit of 12.9.2026: content */
  {
    id: 'bare-yeutz',
    /*
     * "יעוץ" without the second yod. Only in prose — seo.path and the page key
     * carry it too, and rewriting either would move the page, so the applier
     * keeps both out of reach.
     */
    find: /(?<![֐-׿])יעוץ(?=\s)/g,
    replace: 'ייעוץ',
    expect: 15,
    why: 'כתיב חסר של "ייעוץ" בכותרת, ב-H1 ובגוף',
  },
  {
    id: 'qa-label-phone',
    find: /^Phone$/g,
    replace: 'טלפון',
    expect: 1,
    why: 'תווית טופס באנגלית בעמוד שאלות ותשובות, בזמן שה-placeholder בעברית',
  },
  {
    id: 'qa-label-email',
    find: /^Email$/g,
    replace: 'מייל',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'home-our-services',
    find: /בין השירותים שלנו תוכלו למצוא/g,
    replace: 'בין השירותים שלי תוכלו למצוא',
    expect: 2,
    why: 'האתר כתוב בגוף ראשון יחיד; "שלנו" קורא כאילו נכתב על ידי חברה',
  },

  /* ------------------------------------------- audit of 12.9.2026: years */
  {
    id: 'bizplan-year-heading',
    find: /המרכיבים החיוניים של תכנית עסקית ב 2025/g,
    replace: 'המרכיבים החיוניים של תכנית עסקית ב 2026',
    expect: 2,
    why: 'הכותרת מבטיחה 2026 והגוף מדבר על 2025',
  },
  {
    id: 'bizplan-year-sustain',
    find: /ב-2025, קיימות/g,
    replace: 'ב-2026, קיימות',
    expect: 1,
    why: 'אותה סתירה',
  },
  {
    id: 'bizplan-year-tools',
    find: /היתרונות הגדולים של 2025/g,
    replace: 'היתרונות הגדולים של 2026',
    expect: 1,
    why: 'אותה סתירה',
  },
  {
    id: 'restaurants-year-market',
    find: /התחרותי של ישראל ב 2025/g,
    replace: 'התחרותי של ישראל ב 2026',
    expect: 1,
    why: 'הכותרת מבטיחה 2026',
  },
  {
    id: 'restaurants-year-nu',
    find: /נו באמת, 2025 ואתם/g,
    replace: 'נו באמת, 2026 ואתם',
    expect: 1,
    why: 'אותה סתירה',
  },

  /* --------------------------- audit of 12.9.2026: first person, singular */
  /*
   * /בניית-אתרים/ was written in the company voice - "אנו בונים", "מה מבדיל
   * אותנו" - on a site where every other page is one person speaking. It reads
   * as though someone else wrote it.
   */
  {
    id: 'sites-voice-otanu',
    find: /מה מבדיל אותנו\?/g,
    replace: 'מה מבדיל אותי?',
    expect: 2,
    why: 'גוף ראשון רבים בעמוד שכל האתר סביבו ביחיד',
  },
  {
    id: 'sites-voice-ifyun',
    find: /אנו מבצעים אפיון מקיף/g,
    replace: 'אני מבצע אפיון מקיף',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-lanu',
    find: /זה מאפשר לנו לבנות אתר/g,
    replace: 'זה מאפשר לי לבנות אתר',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-bonim',
    find: /כל אתר שאנו בונים הוא/g,
    replace: 'כל אתר שאני בונה הוא',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-doagim',
    find: /אנו דואגים לעיצוב/g,
    replace: 'אני דואג לעיצוב',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-mishtamshim',
    find: /אנו משתמשים בטכנולוגיות/g,
    replace: 'אני משתמש בטכנולוגיות',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-yodim',
    find: /אנו יודעים מה עובד ומה לא\. אנו נלווה אתכם/g,
    replace: 'אני יודע מה עובד ומה לא. אלווה אתכם',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-heading',
    find: /לאילו עוד דברים אנחנו דואגים/g,
    replace: 'לאילו עוד דברים אני דואג',
    expect: 2,
    why: 'אותו דבר, בכותרת H2',
  },
  {
    id: 'sites-voice-mityahasim',
    find: /אז כחלק מבניית האתר אנחנו גם מתייחסים/g,
    replace: 'אז כחלק מבניית האתר אני גם מתייחס',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-hashuv',
    find: /חשוב לנו מאוד לשים דגש/g,
    replace: 'חשוב לי מאוד לשים דגש',
    expect: 1,
    why: 'אותו דבר',
  },
  {
    id: 'sites-voice-desc',
    find: /אנחנו נבנה לכם אתר/g,
    replace: 'אבנה לכם אתר',
    expect: 4,
    why: 'אותו דבר, בתיאור המטא',
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
  /* -------------------------------- audit of 12.9.2026: thin or long meta */
  '/אודות/': {
    description:
      'אלעד שורתי, יועץ עסקי ומומחה שיווק, דיגיטל ובינה מלאכותית. מי אני, איך אני עובד, ולמה יועץ הוא לפני הכל חבר של העסק שבניתם.',
    why: 'התיאור היה "אודות אלעד שורתי. קצת עלי" - 25 תווים',
  },
  '/צרו-קשר/': {
    description:
      'רוצים לדבר על העסק? אפשר להשאיר פרטים, להתקשר או לכתוב בוואטסאפ. שיחת ההיכרות הראשונה היא בלי התחייבות.',
    why: 'התיאור היה "צרו קשר" - 7 תווים',
  },
  '/הצהרת-נגישות/': {
    description:
      'הצהרת הנגישות של אתר אלעד שורתי: מה הותאם באתר, לפי אילו תקנים, ואיך לפנות אם משהו אינו נגיש עבורכם.',
    why: 'התיאור היה "הצהרת נגישות" - 12 תווים',
  },
  '/מדיניות-פרטיות/': {
    description:
      'מדיניות הפרטיות של אתר אלעד שורתי: איזה מידע נאסף, למה הוא משמש, ואיך אפשר לפנות בבקשה לעיון או להסרה.',
    why: 'התיאור היה "מדיניות פרטיות" - 14 תווים',
  },
  '/תנאי-שימוש/': {
    description:
      'תנאי השימוש באתר אלעד שורתי: זכויות יוצרים, אחריות, שימוש בתכנים והכללים שחלים על הגלישה באתר.',
    why: 'התיאור היה "תנאי שימוש" - 10 תווים',
  },
  '/volume_up/': {
    title: 'ייעוץ עסקי מותאם אישית בעידן הדיגיטלי | אלעד שורתי',
    description:
      'מה זה ייעוץ עסקי מותאם אישית, למי הוא מתאים, ואיך בוחרים יועץ שיתאים לעסק שלכם ולשלב שבו אתם נמצאים.',
    why: 'כותרת של 93 תווים ותיאור של 29',
  },
  '/הכוח-המוסתר-שמאחורי-יעוץ-עסקי/': {
    title: 'הכוח המוסתר שמאחורי ייעוץ עסקי | אלעד שורתי',
    description:
      'ייעוץ עסקי משנה את דרך החשיבה בעסק, לא רק את המספרים. על חשיבה אסטרטגית, פתרונות מותאמים, והיתרונות שקשה לראות מבפנים.',
    why: 'התיאור היה 39 תווים, והכותרת נשאה את הכתיב החסר "יעוץ"',
  },
  '/למה-חשוב-אתר-אינטרנט-לעסק/': {
    description:
      'אתר אינטרנט עובד בשביל העסק 24 שעות ביממה. מה הוא באמת נותן, מתי כדאי להקים אחד, ומה מפסיד עסק שאין לו אתר.',
    why: 'התיאור היה 41 תווים',
  },
  '/פיתוח-שריר-המכירות-הגישה-המהפכנית-להצ/': {
    title: 'פיתוח שריר המכירות | הגישה שהופכת אנשי מקצוע למוכרים',
    why: 'כותרת של 117 תווים - נחתכת בתוצאות החיפוש',
  },
  '/הדרך-להפוך-לאיש-מכירות-יותר-טוב-10-טיפים/': {
    title: '10 טיפים להפוך לאיש מכירות טוב יותר | אלעד שורתי',
    why: 'כותרת של 87 תווים',
  },
  '/עולם-השיווק-בעידן-הבינה-המלאכותית-כל-מ/': {
    title: 'שיווק בעידן הבינה המלאכותית | כל מה שצריך לדעת',
    why: 'כותרת של 76 תווים',
  },
  '/פרסום-בלינקדאין-לעסקים/': {
    title: 'פרסום בלינקדאין לעסקים | לבנות סמכות ולהביא לקוחות',
    why: 'כותרת של 76 תווים',
  },
  '/פרסום-בפייסבוק/': {
    title: 'פרסום בפייסבוק | להביא לקוחות ולהגדיל מכירות',
    why: 'כותרת של 71 תווים',
  },
  '/בניית-אסטרטגיה-עסקית/': {
    title: 'בניית אסטרטגיה עסקית לכל סוגי העסקים | אלעד שורתי',
    why: 'כותרת של 66 תווים',
  },
  '/ייעוץ-לעסקים-קטנים/': {
    title: 'ייעוץ עסקי לעסקים קטנים | אסטרטגיה שמביאה תוצאות',
    why: 'כותרת של 66 תווים',
  },
  '/': {
    description:
      'אלעד שורתי - ייעוץ עסקי, שיווק דיגיטלי ובינה מלאכותית. ליווי לעסקים קטנים, בינוניים וחברות, מאסטרטגיה ועד ביצוע.',
    why: 'התיאור היה 169 תווים ונחתך בתוצאות החיפוש',
  },
  '/תיווך-עסקים/': {
    description:
      'תיווך עסקים - קנייה ומכירה של עסקים פעילים. איך מעריכים שווי, מה בודקים לפני שקונים, ואיך מוכרים עסק בלי לשרוף אותו.',
    why: 'התיאור היה 195 תווים',
  },

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

/* ------------------------------------------- whole blocks to drop */

export const blockDrops = [
  {
    page: '/volume_up/',
    // The article is about business consulting and then, without transition,
    // starts giving the reader SEO advice about their own website — keyword
    // placement, meta tags, Search Console — and signs off "בהצלחה!".
    // It reads as leftover output from a writing tool, not as part of the page.
    match: /מילות המפתח והביטויים הרלוונטיים|לאופטימיזציה של האתר שלך|השתמש במילות מפתח רלוונטיות|Search Console|^בהצלחה!$/,
    why: 'קטע עצות SEO שלא קשור לנושא המאמר, כולל סיום "בהצלחה!"',
  },
  {
    page: '/פיתוח-עסקי/',
    // A heading promising the difference between consulting and business
    // development, answered with lorem ipsum. The page answers that exact
    // question properly further down, under "ההבדל בין ייעוץ עסקי ליועצי
    // פיתוח עסקי" - so the placeholder section can go without losing anything.
    match: /^\s*ההבדל בין ייעוץ עסקי לפיתוח עסקי\s*$|^לורם איפסום/,
    why: 'כותרת עם טקסט לורם איפסום. התשובה האמיתית לאותה שאלה כבר מופיעה בהמשך העמוד.',
  },
]

/* ------------------------------------------------------ alt text */

/**
 * Alt text for images that arrived with none - nothing in the page markup and
 * nothing in the WordPress media library either. Each line here was written by
 * opening the image and describing what is in the frame, which is why it lives
 * in the corrections layer: it is a reviewed editorial decision, not something
 * the build is allowed to invent on its own.
 *
 * The two infographics are transcribed rather than summarised. Their content
 * is text, so a reader using a screen reader should get the same list that a
 * sighted reader gets, not "infographic about market research".
 *
 * Keyed by the decoded URL - the src in the capture is percent-encoded.
 */
export const imageAlts = {
  'https://elad-digital.co.il/wp-content/uploads/2025/02/אינפוגרפיה-על-מחקר-שוק-מאת-אלעד-שורתי-812x1024.png':
    'אינפוגרפיה: מטרות מחקר שוק - הגדרת מטרות, איסוף נתונים, ניתוח נתונים ופיתוח המלצות, ארבעה שלבים שמובילים לאסטרטגיות עסקיות משופרות',
  'https://elad-digital.co.il/wp-content/uploads/2025/01/עקרונות-פיתוח-עסקי.png':
    'אינפוגרפיה: עקרונות פיתוח עסקי - ניתוח שוק, מחקר מתחרים, חזון ויעדים, חדשנות ויצירתיות, ניהול פיננסי ובניית אסטרטגיה',
  'https://elad-digital.co.il/wp-content/uploads/2025/08/אלעד-שורתי-min-1-1024x683.webp':
    'אלעד שורתי בחולצה תכלת על רקע מגדלי משרדים',
  'https://elad-digital.co.il/wp-content/uploads/2025/01/אלעד.jpg':
    'אלעד שורתי, תמונת פורטרט בשחור לבן',
  'https://elad-digital.co.il/wp-content/uploads/2024/06/3E9A2033-1024x683.jpg':
    'אלעד שורתי עומד על רקע לבן בחולצה מודפסת',
  'https://elad-digital.co.il/wp-content/uploads/2023/07/team-work-process-young-business-managers-crew-working-with-new-startup-project-labtop-wood-table-typing-keyboard-texting-message-analyze-graph-plans-1024x683.jpg':
    'שני אנשי עסקים מצביעים על מסך טאבלט, ועל השולחן שלפניהם דוחות וגרפים מודפסים',
  'https://elad-digital.co.il/wp-content/uploads/2023/07/CTA-contact-us-new.png':
    'אישה מצביעה על סקיצה של ממשק ולוח מחוונים המצוירת על לוח לבן',
}

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
    // `key` is an identifier, not prose - keep it out of reach too.
    const { key, ...prose } = rest
    return {
      ...walk(prose, fixString),
      key,
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

  const blockApplied = []
  corrected = corrected.map((p) => {
    const key = decodeURIComponent(p.seo.path)
    const drops = blockDrops.filter((d) => d.page === key)
    if (!drops.length) return p
    const text = (b) =>
      b.type === 'heading' ? b.text
      : b.type === 'richtext' ? String(b.html || '').replace(/<[^>]*>/g, '').trim()
      : b.type === 'list' ? (b.items || []).join(' ')
      : ''
    const blocks = p.blocks.filter((b) => {
      const t = text(b)
      if (!t) return true
      const hit = drops.some((d) => d.match.test(t))
      if (hit) blockApplied.push(key)
      return !hit
    })
    return { ...p, blocks }
  })

  // Alt text for images that reached us with none. A block that already has
  // alt keeps it; the media library is consulted later, by altFor, and every
  // entry in imageAlts was checked to have nothing in either place.
  const altApplied = []
  corrected = corrected.map((p) => {
    const blocks = p.blocks.map((b) => {
      if (b.type !== 'image' || !b.src) return b
      if (b.alt && String(b.alt).trim()) return b
      const fix = imageAlts[decodeURIComponent(b.src)]
      if (!fix) return b
      altApplied.push(decodeURIComponent(b.src))
      return { ...b, alt: fix }
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
  const missingBlock = blockDrops.filter((d) => !blockApplied.includes(d.page))
  if (missingBlock.length) {
    throw new Error('Block corrections matched nothing: ' + missingBlock.map((d) => d.page).join(', '))
  }
  const missingAlt = Object.keys(imageAlts).filter((k) => !altApplied.includes(k))
  if (missingAlt.length) {
    throw new Error('Alt-text corrections matched no image: ' + missingAlt.join(', '))
  }
  const missingFaq = faqDrops.filter((d) => !faqApplied.includes(d.page))
  if (missingFaq.length) {
    throw new Error('FAQ corrections matched nothing:\n  ' + missingFaq.map((d) => d.page + ' / ' + d.match).join('\n  '))
  }

  return {
    pages: corrected,
    report: { text: counts, seo: seoApplied.length, faq: faqApplied.length, joins: joinApplied.length, blocks: blockApplied.length, alts: new Set(altApplied).size },
  }
}
