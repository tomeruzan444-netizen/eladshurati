/**
 * ייעוץ עסקי לגרפיקאים - written for the site, not migrated from WordPress.
 *
 * Written to docs/content-guide.md (the merged guide, 14.11.2026), requested
 * by Tomer on 16.11.2026. The "כללים לעמודים חדשים" section governs: no fixed
 * template, an original infographic, 2-5 internal links, and the banned AI
 * tells. No spaced hyphen and no em dash anywhere in the copy below.
 *
 * Cannibalisation (section 10), and this one was close. /ייעוץ-עסקי-למעצבים/
 * already exists and is a migrated 271-word page about designers generally.
 * The decision to write a separate page rather than strengthen that one was
 * made on Search Console data, not on judgement:
 *   - Zero queries containing "גרפיק" reached the site in the 30 days to
 *     16.11.2026. Not one impression.
 *   - The two designer queries that did arrive are "ייעוץ עסקי למעצבות"
 *     (3 impressions, position 12) and "ייעוץ עסקי למעצבי פנים" (2, position
 *     26.5). That page is drifting toward interior design, which is a
 *     different profession and a different intent.
 * So the two pages do not compete in practice. They are cross-linked in both
 * directions so the distinction is legible to a crawler as well as a reader.
 *
 * The argument: a graphic designer's portfolio is not a display, it is the
 * only mechanism in the business that selects clients unattended. What it
 * shows decides what gets asked for, which decides the job mix, which decides
 * whether the business is viable at a given revenue. Nobody chooses that mix
 * on purpose; it fills with whatever came last.
 *
 * Deliberately NOT written, because a neighbouring page already owns it:
 *   - Revisions and scope creep as unpriced work. That is the whole of
 *     /ייעוץ-עסקי-לצלמים/ ("מוכרים יום, מוסרים חודש"), and it is the first
 *     place anyone goes with graphic designers. Named here only to send the
 *     reader there and to say the mechanism differs.
 *   - Underpricing, unclear client boundaries, burnout. The existing
 *     /ייעוץ-עסקי-למעצבים/ lists all three.
 *   - A capacity ceiling in hours. /ייעוץ-עסקי-לפסיכולוגים/.
 *   - A flat fee while the work grows. /ייעוץ-עסקי-לרואי-חשבון/.
 *   - Same price, different cost to serve. /ייעוץ-עסקי-ליועצי-מס/.
 *   - Two kinds of time inside one job. /ייעוץ-עסקי-למספרות/.
 *
 * Shape: a bipartite mirror. Two columns of discrete items, right to left,
 * with the unmatched slot carrying the claim. None of the nineteen figures
 * already on the site is this: the nearest are the photographers' and tax
 * advisers' segmented proportion bars, which divide one quantity, and the
 * hotel page's two paths, which compare alternative routes. This one matches
 * items across a gap and argues from the one that has no partner.
 *
 * Three internal links. A fourth to /ייעוץ-עסקי-ליזמים/ (an orphan) was
 * drafted off the studio paragraph and dropped: the paragraph was about hiring
 * rather than about founding, so the link would have been placed for SEO,
 * which rule 9 forbids.
 *
 * Address: אתם. Graphic design is not an overwhelmingly female field, so the
 * אתן exception does not apply.
 *
 * E-E-A-T: Elad has never said he works with graphic designers. There is no
 * client, no case, no result and no named study here. The experience anchor is
 * written about project-based businesses generally, which is the widest claim
 * the material supports, and judgements are marked as judgements. This is the
 * ninth sector page in that position. Finding 9ה.
 *
 * Numbers: none. No counts, no percentages, no prices, no hours. The figure
 * carries structure only, and its caption says so.
 *
 * Not claimed, on purpose: anything about copyright, ownership of files, or
 * what a client may or may not do with delivered work. That is law, it is
 * YMYL, and no primary text was checked. The FAQ on showing unapproved work
 * answers as a matter of practice and timing, never as a matter of rights.
 */
export default {
  path: '/ייעוץ-עסקי-לגרפיקאים/',
  published: '2026-11-16T16:30:00+02:00',
  modified: '2026-11-16T16:30:00+02:00',
  title: 'ייעוץ עסקי לגרפיקאים | התיק קובע מה יבקשו מכם',
  description:
    'אצל גרפיקאי תמהיל העבודות קובע אם העסק מחזיק, והתמהיל נקבע לפי מה שמוצג בתיק. רוב התיקים התמלאו ממה שהזדמן, בלי שאף אחד בחר.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'רוצים לדעת מה התיק שלכם מזמין לשנה הבאה?',
    text: 'נעבור יחד על תיק העבודות שלכם ונספור מה מופיע בו ומה חסר. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי לגרפיקאים: התיק בוחר את העבודה הבאה' },
    {
      type: 'richtext',
      html: '<p>הבעיה העסקית של גרפיקאי היא לרוב לא המחיר לעבודה. היא תמהיל העבודות. אפשר לתמחר כל פרויקט בנפרד בצורה הגיונית לגמרי, ועדיין לסיים שנה עם המון שעות ורווח בינוני. התמהיל הזה נקבע הרבה לפני שיחת המחיר, והוא נקבע במקום אחד: מה שמוצג בתיק העבודות.</p>',
    },
    {
      type: 'richtext',
      html: '<p>לקוח לא בוחר גרפיקאי מתוך רשימת שירותים, אלא אחרי שראה משהו שדומה למה שהוא צריך. מה שאתם מראים הוא בפועל מה שיבקשו מכם, וזה עובד גם כשלא התכוונתם לכך.</p>',
    },

    { type: 'heading', level: 2, text: 'למה התיק הוא החלטה עסקית ולא תצוגה' },
    {
      type: 'richtext',
      html: '<p>תיק עבודות נראה כמו שאלה של טעם, ורוב הגרפיקאים מתייחסים אליו ככה. בוחרים את העבודות שיצאו יפה, מסדרים אותן, ומעדכנים כשיש משהו חדש.</p><p>בפועל זה המנגנון היחיד בעסק שמסנן לקוחות כשאתם ישנים. הוא עובד כל הזמן, הוא עובד לבד, ואף אחד מעולם לא כתב לו הוראות.</p><p>והוא מסנן לשני הכיוונים: הוא מושך את מי שצריך את מה שהוא רואה, ובשקט מרחיק את כל השאר.</p>',
    },
    {
      type: 'figure',
      caption:
        'התרשים מראה מבנה ולא כמויות. אין בו מספרים ואין בו גדלים מדודים. המשבצת שמסומנת בקו מקווקו היא סוג העבודה שאתם רוצים עוד ממנה והיא לא מוצגת בתיק, ומולה משמאל אין כלום. זו כל הטענה.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 412" role="img" aria-labelledby="gd-mirror-title gd-mirror-desc">
  <title id="gd-mirror-title">סוגי העבודות שנכנסות הם השתקפות של סוגי העבודות שמוצגות</title>
  <desc id="gd-mirror-desc">שתי עמודות של משבצות זו מול זו, שנקראות מימין לשמאל. העמודה הימנית היא מה שתיק העבודות מראה, והעמודה השמאלית היא סוגי הפניות שמגיעות. שלוש השורות הראשונות זהות בשתי העמודות, ומחוברות בחיצים שמצביעים שמאלה: לוגו לחנות, פוסטים לרשתות, ופלייר ותפריט. בשורה הרביעית יש בעמודה הימנית משבצת מסומנת בקו מקווקו שכתוב בה מיתוג שלם לעסק, בלי חץ ובלי מקבילה בעמודה השמאלית, ובמקומה משמאל כתוב שאין ממה לבקש.</desc>

  <text class="diagram__eyebrow" x="620" y="40" text-anchor="start">תיק עבודות של גרפיקאי</text>
  <text class="diagram__head" x="620" y="76" text-anchor="start">מה שמוצג הוא מה שיבקשו</text>
  <rect class="diagram__rule" x="554" y="88" width="66" height="5" rx="2.5"/>

  <text class="diagram__step" x="500" y="128" text-anchor="middle">מה שהתיק מראה</text>
  <text class="diagram__step" x="160" y="128" text-anchor="middle">מה שמבקשים מכם</text>

  <rect class="diagram__box" x="380" y="150" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="500" y="180" text-anchor="middle">לוגו לחנות</text>
  <rect class="diagram__box" x="40" y="150" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="160" y="180" text-anchor="middle">לוגו לחנות</text>
  <line class="diagram__axis" x1="378" y1="174" x2="302" y2="174"/>
  <polygon class="diagram__tip" points="284,174 302,163 302,185"/>

  <rect class="diagram__box" x="380" y="216" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="500" y="246" text-anchor="middle">פוסטים לרשתות</text>
  <rect class="diagram__box" x="40" y="216" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="160" y="246" text-anchor="middle">פוסטים לרשתות</text>
  <line class="diagram__axis" x1="378" y1="240" x2="302" y2="240"/>
  <polygon class="diagram__tip" points="284,240 302,229 302,251"/>

  <rect class="diagram__box" x="380" y="282" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="500" y="312" text-anchor="middle">פלייר ותפריט</text>
  <rect class="diagram__box" x="40" y="282" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="160" y="312" text-anchor="middle">פלייר ותפריט</text>
  <line class="diagram__axis" x1="378" y1="306" x2="302" y2="306"/>
  <polygon class="diagram__tip" points="284,306 302,295 302,317"/>

  <rect class="diagram__cell diagram__cell--lost" x="380" y="348" width="240" height="48" rx="8"/>
  <text class="diagram__note" x="500" y="378" text-anchor="middle">מיתוג שלם לעסק</text>
  <text class="diagram__note" x="160" y="378" text-anchor="middle">אין ממה לבקש</text>
</svg>`,
    },

    { type: 'heading', level: 2, text: 'העבודה שרוצים עוד ממנה היא זו שלא מוצגת' },
    {
      type: 'richtext',
      html: '<p>כאן נסגרת לולאה שמהדקת את עצמה. עשיתם מעט מסוג מסוים, אז יש ממנו מעט בתיק. כיוון שיש ממנו מעט, כמעט אף אחד לא מבקש אותו. וכיוון שאף אחד לא מבקש, אתם ממשיכים לעשות ממנו מעט.</p><p>אף שלב בלולאה הזאת לא מרגיש כמו החלטה, והיא פשוט ממשיכה לרוץ.</p><p>הצד ההפוך חד עוד יותר. עבודה אחת שיצאה מצוין והצגתם בגאווה יכולה להביא אליכם שנתיים של פניות מאותו סוג בדיוק. לפעמים זה מה שרציתם. לפעמים זו עבודה שלא תרצו לעשות שוב לעולם.</p>',
    },

    { type: 'heading', level: 2, text: 'אותו מחזור, שני עסקים שונים לגמרי' },
    {
      type: 'richtext',
      html: '<p>קחו שני גרפיקאים שסגרו שנה באותו מחזור. אחד עשה הרבה עבודות קטנות, השני עשה מעט גדולות.</p><p>ההפרש ביניהם הוא לא בהכנסה. הוא בכמה לקוחות צריך לגייס, כמה הצעות מחיר צריך לכתוב, כמה חשבוניות צריך לגבות, וכמה פעמים צריך להיכנס מחדש לראש של מישהו אחר. אצל הראשון חלק גדול מהשעות הולך למה שמסביב לעיצוב ולא לעיצוב עצמו.</p><p>בעסקים שמבוססי פרויקטים אני רואה את זה שוב ושוב: העלות האמיתית יושבת בכמות ההתחלות, לא בכמות השעות. שתי השורות האלה נראות זהות בדוח, ומרגישות אחרת לגמרי בסוף החודש. ההפרש מופיע ברווח ולא במחזור. <a href="/רווח-תפעולי/">רווח תפעולי</a> הוא המספר שחושף אותו, והסברתי שם איך מחשבים אותו.</p>',
    },

    { type: 'heading', level: 2, text: 'שעה אחת שמראה את התחזית שלכם' },
    {
      type: 'richtext',
      html: '<p>הצעד הראשון לא עולה כסף ולוקח בערך שעה. פתחו את התיק והסתכלו עליו לא כעל אוסף עבודות אלא כעל רשימת הזמנות. ספרו כמה יש מכל סוג.</p><p>זו תחזית הפניות שלכם לשנה הקרובה, בקירוב טוב למדי.</p><p>אחר כך כתבו בצד את סוגי העבודה שאתם רוצים יותר מהם. אם אחד מהם לא מופיע בתיק בכלל, מצאתם את הסיבה שלא מבקשים אותו. זו הבדיקה הכי זולה שאני מכיר, והיא לא דורשת אותי.</p>',
    },

    { type: 'heading', level: 2, text: 'לעשות עבודה שאף אחד לא הזמין' },
    {
      type: 'richtext',
      html: '<p>עבודה יזומה היא הדרך המהירה למלא חור בתיק. פרויקט דמה, מיתוג מחדש של עסק קיים כתרגיל, או סדרה שבנויה בדיוק כמו עבודת לקוח.</p><p>ויש לזה מחיר אמיתי ולא אעמיד פנים שאין: זה זמן שאף אחד לא שילם עליו, בעסק שכבר עמוס. גרפיקאי שעובד שישים שעות בשבוע לא ימצא את הזמן הזה, ולהגיד לו "תמצא" זה לא ייעוץ.</p><p>מה שאני כן מציע: עבודה יזומה אחת בשנה, עם תאריך יעד שנקבע כמו ללקוח משלם. אחת מספיקה. היא לא צריכה להיות גדולה, היא צריכה להיות מהסוג שרוצים עוד ממנו.</p>',
    },

    { type: 'heading', level: 2, text: 'זה לא אומר לעשות רברנד לעצמכם' },
    {
      type: 'richtext',
      html: '<p>החשש הראשון שעולה כאן הוא שצריך לעצור הכול ולבנות מחדש זהות, אתר ותיק. אני לא מציע את זה. כמעט כל מה שכתוב למעלה הוא שינוי בבחירה ובסדר, לא בעיצוב.</p><p>אצל צלמים זה נראה דומה ועובד אחרת לגמרי. שם הבעיה המרכזית היא הזנב שאחרי העבודה: מוכרים יום ומוסרים חודש, והעריכה שבאמצע לא תומחרה. יש לי עמוד נפרד שמפרק את המנגנון הזה, <a href="/ייעוץ-עסקי-לצלמים/">ייעוץ עסקי לצלמים</a>. לגרפיקאי יש זנב משלו, אבל הוא לא זה שקובע את גודל העסק.</p><p>ואם אתם עובדים בעיקר על חללים, על מוצרים או על פנים ופחות על קבצים, חלק מהשאלות זהות וחלק מהן לא. את המשותף להן, תמחור, גבולות מול לקוחות ויציבות הכנסה, ריכזתי תחת <a href="/ייעוץ-עסקי-למעצבים/">ייעוץ עסקי למעצבים</a>.</p>',
    },

    {
      type: 'richtext',
      html: '<p>אם אתם מסתכלים על התיק שלכם ורואים בעיקר עבודות שלא הייתם בוחרים לעשות שוב, זה לא סימן שהטעם שלכם השתנה. זה סימן שמישהו אחר בחר בשבילכם, והתיק הוא זה שנתן לו לבחור.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'כמה עבודות צריכות להיות בתיק?',
          a: '<p>פחות ממה שנדמה לכם, והתמהיל חשוב הרבה יותר מהכמות. כל פריט נוסף מסוג שאתם לא רוצים עוד ממנו עובד נגדכם בפועל, כי הוא מגדיל את הסיכוי שיבקשו בדיוק אותו. תיק קטן ומכוון מביא עבודות טובות יותר מתיק גדול שמראה הכול.</p>',
        },
        {
          q: 'אפשר להציג עבודה שהלקוח עוד לא אישר לפרסם?',
          a: '<p>שואלים, וזו שאלה של תזמון. הרגע הנכון לבקש הוא במסירה, כשהלקוח מרוצה מהתוצאה. בקשה שמגיעה שנה אחרי זה נתקלת במישהו שכבר לא זוכר ולא בטוח, והיא גם מזמינה דיון מיותר. כדאי לסגור את זה כשסוגרים את הפרויקט, לא אחריו.</p>',
        },
        {
          q: 'העבודה יצאה טוב אצלי והלקוח שינה אותה לרעה. מה מציגים?',
          a: '<p>את מה שעלה לאוויר, או כלום. הצגת גרסה שלא קיימת בעולם מביאה לקוחות שמצפים למשהו שלא תוכלו לחזור עליו, כי הם לא ראו את מי שישב מולכם. אם הגרסה הסופית מביכה מספיק, עדיף להשאיר את העבודה בחוץ ולמלא את המקום בעבודה יזומה.</p>',
        },
        {
          q: 'כדאי להתמחות בתחום אחד או להישאר רחבים?',
          a: '<p>זה תלוי בגודל השוק שאתם מכוונים אליו. התמחות מייקרת את העבודה ומקצרת את שיחות המכירה, כי הלקוח מרגיש שכבר פגשתם את הבעיה שלו. היא גם מקטינה את מספר הלקוחות האפשריים. בשוק הישראלי זו בדרך כלל התמחות בסוג עבודה ולא בענף, פשוט כי יש יותר ממנה.</p>',
        },
      ],
    },
  ],
}
