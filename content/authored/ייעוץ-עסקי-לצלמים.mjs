/**
 * ייעוץ עסקי לצלמים - written for the site, not migrated from WordPress.
 *
 * Written to docs/writing-spec.md, requested by Tomer on 5.11.2026.
 *
 * Cannibalisation (section 10): no page covers photography. The nearest in
 * intent are /ייעוץ-עסקי-למעצבים/ (322 words, generic: pricing, boundaries,
 * income stability) and /ייעוץ-עסקי-לאדריכלים/ (pricing, time, personal brand,
 * marketing). Neither says anything specific to a creative business, so there
 * was nothing to avoid repeating - only a bar to clear.
 *
 * The argument is the seventh distinct one in this set and it is a definition
 * problem rather than a pricing, capacity, retention or collection one:
 *   psychologists  a hard ceiling on hours
 *   accountants    fee erosion under stable revenue
 *   therapists     what the outer frame fails to hold
 *   dietitians     the arc that never completes
 *   physiotherapy  the work is done and the money is elsewhere
 *   cosmetics      the step from one pair of hands to utilisation
 *   photography    the job has no edge
 * Every other service here ends by itself: a session ends, a treatment ends, a
 * financial year ends. A photography job ends when the client stops asking.
 * The contract describes the shoot hour by hour and the delivery in one line,
 * and the price is anchored to the visible part while most of the hours sit in
 * the invisible one.
 *
 * Adjacency watched carefully with the accountants page, which also has
 * unbilled work in it. There it is scope creep on a standing retainer; here the
 * priced unit itself is the minority of the job, by design, from day one.
 * Different mechanism, and the shingle check was run against it specifically.
 *
 * No legal claim anywhere. The licensing question in the FAQ is answered as
 * commercial logic and explicitly sends the wording of rights to a lawyer -
 * חוק זכות יוצרים was not read, so nothing about it is asserted.
 *
 * Numbers: none. The stacked bar carries no units and the caption says the
 * segments show proportion rather than measured hours.
 */
export default {
  path: '/ייעוץ-עסקי-לצלמים/',
  published: '2026-11-05T09:00:00+02:00',
  modified: '2026-11-05T09:00:00+02:00',
  title: 'ייעוץ עסקי לצלמים | מוכרים יום, מוסרים חודש',
  description:
    'המחיר מעוגן ליום הצילום, ורוב השעות יושבות אחריו. למה לעבודת צילום אין קצה, ואילו שלוש שורות בהסכם משנות את כל הכלכלה.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'רוצים לדעת מה התעריף השעתי האמיתי שלכם?',
    text: 'נחשב אותו יחד על עבודה אחת אמיתית שלכם, כולל השעות שאחרי. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי לצלמים: מוכרים יום, מוסרים חודש' },
    {
      type: 'richtext',
      html: '<p>הלקוח קונה יום צילום. אתם כבר יודעים שהיום הזה הוא החלק הקטן. אחריו מגיעים המיון, העריכה, סבבי התיקונים והמסירה - ורובם לא מופיעים בשום שורה בהצעת המחיר.</p>',
    },
    {
      type: 'richtext',
      html: '<p>הבעיה העסקית המרכזית של צלם עצמאי היא שהמחיר מעוגן לחלק הנראה של העבודה, בעוד רוב השעות יושבות בחלק שאינו נראה. וכשלחלק הזה אין הגדרה בהסכם, גם אין לו סוף. הוא נגמר כשהלקוח מפסיק לבקש, לא כשהעבודה הושלמה.</p>',
    },

    { type: 'heading', level: 2, text: 'היום שתומחר, והחודש שלא' },
    {
      type: 'richtext',
      html: '<p>לא צריך מערכת מדידה כדי לראות את זה. קחו עבודה אחת מהחודש שעבר ורשמו, בגסות, כמה שעות הלכו לכל שלב: צילום, מיון, עריכה, תיקונים, מסירה. רוב הצלמים שעושים את התרגיל הזה בפעם הראשונה מופתעים מהיחס.</p><p>ההפתעה היא לא שהעריכה לוקחת זמן. זה ידוע. ההפתעה היא שהמחיר נבנה סביב השלב הקצר ביותר.</p>',
    },
    {
      type: 'figure',
      caption:
        'חלוקת השעות בעבודה אחת, לפי יחס ולא לפי שעות מדודות. היחס משתנה בין צלם לצלם ובין סוג עבודה לסוג עבודה - מה שלא משתנה הוא איזה חלק תומחר.',
      html: `<svg class="diagram__svg" viewBox="0 0 680 400" role="img" aria-labelledby="ph-split-title ph-split-desc">
  <title id="ph-split-title">לאן הולכות השעות בעבודת צילום אחת</title>
  <desc id="ph-split-desc">עמודה אחת מחולקת לארבעה מקטעים לפי סדר העבודה מימין לשמאל: הצילום, מיון ועריכה, סבבי תיקונים, ומסירה. מקטע הצילום הוא הקצר ביותר והוא היחיד שצבוע בכתום, מפני שהוא החלק היחיד שתומחר. סוגר כתום מעליו מסמן אותו, וסוגר סגול מתחת לעמודה כולה מסמן את מה שבוצע בפועל.</desc>

  <text class="diagram__eyebrow" x="630" y="46" text-anchor="start">עבודת צילום אחת</text>
  <text class="diagram__head" x="630" y="86" text-anchor="start">לאן הולכות השעות</text>
  <rect class="diagram__rule" x="564" y="96" width="66" height="5" rx="2.5"/>

  <text class="diagram__step" x="565" y="146" text-anchor="middle">מה שתומחר</text>
  <polyline class="diagram__line diagram__line--rising" points="500,172 500,160 630,160 630,172"/>

  <rect class="diagram__band diagram__band--end" x="500" y="186" width="130" height="66" rx="10"/>
  <rect class="diagram__band" x="250" y="186" width="246" height="66" rx="10"/>
  <rect class="diagram__band" x="120" y="186" width="126" height="66" rx="10"/>
  <rect class="diagram__band" x="50" y="186" width="66" height="66" rx="10"/>

  <text class="diagram__note" x="565" y="284" text-anchor="middle">הצילום</text>
  <text class="diagram__note" x="373" y="284" text-anchor="middle">מיון ועריכה</text>
  <text class="diagram__note" x="183" y="284" text-anchor="middle">תיקונים</text>
  <text class="diagram__note" x="83" y="284" text-anchor="middle">מסירה</text>

  <polyline class="diagram__line" points="50,312 50,324 630,324 630,312"/>
  <text class="diagram__step" x="340" y="364" text-anchor="middle">מה שבוצע</text>
</svg>`,
    },

    { type: 'heading', level: 2, text: 'למה לעבודת צילום אין קצה' },
    {
      type: 'richtext',
      html: '<p>כמעט כל שירות אחר נגמר מעצמו. פגישה נגמרת כשהשעה נגמרת, טיפול נגמר בסוף הסדרה, שנת מס נגמרת בדצמבר. לעבודת צילום אין נקודה כזו. היא נגמרת כשהלקוח מפסיק לבקש.</p><p>וזה לא כי הלקוחות מנצלים. זה כי ההסכם מתאר את יום הצילום לפרטי פרטים - שעות, מיקומים, ציוד - ואת המסירה בשורה אחת. כשאין הגדרה, כל צד ממלא אותה לפי מה שסביר בעיניו, והצד שמשלם ממלא אותה אחרת מהצד שעובד.</p><p>אני חושב שזו הסיבה שצלמים מרגישים שהם מתווכחים הרבה. הם לא מתווכחים על כסף אלא על גבול שאף אחד לא שרטט.</p>',
    },

    { type: 'heading', level: 2, text: 'שלוש שורות שמשנות את ההסכם' },
    {
      type: 'list',
      ordered: false,
      items: [
        '<b>כמה תמונות ערוכות נמסרות.</b> מספר, לא "מבחר". בלי זה כל מסירה היא פתיחה של משא ומתן.',
        '<b>כמה סבבי תיקונים כלולים, ומה המחיר של הרביעי.</b> הסעיף הזה כמעט אף פעם לא מופעל - עצם קיומו הוא שמסיים את הסבבים.',
        '<b>תאריך מסירה, ומה קורה לבקשות אחריו.</b> לא כדי לסרב, אלא כדי שיהיה רגע שבו העבודה הוכרזה כגמורה.',
      ],
    },
    {
      type: 'richtext',
      html: '<p>שלוש השורות האלה לא מייקרות את ההצעה. הן רק הופכות אותה למדידה, וזה מה שהופך את התעריף השעתי האמיתי שלכם למספר ידוע. אותו עיקרון בדיוק נכון ל<a href="/ייעוץ-עסקי-למעצבים/">מעצבים עצמאיים</a>, שחיים מול בדיוק אותה בעיה עם סבבי תיקונים.</p>',
    },

    { type: 'heading', level: 2, text: 'קיבולת נמדדת בתאריכים, לא בשעות' },
    {
      type: 'richtext',
      html: '<p>צלם אירועים מוכר שבת מסוימת פעם אחת. אפשר למתוח שעה, אי אפשר למתוח תאריך. זה הופך את שאלת הקיבולת למשהו אחר לגמרי מעסק שמוכר זמן: לא כמה שעות אפשר לעבוד, אלא כמה תאריכים קיימים בעונה ומה ממלא את שאר השנה.</p><p>מי שמוכר לשוק האירועים מתמודד עם זה מכל הכיוונים, וזה משפיע גם על איך נראה <a href="/בניית-אתרים-לאירועים/">אתר של עסק אירועים</a> ומתי בכלל כדאי להשקיע בו.</p><p>ויש כאן הסתייגות שאני אומר בכנות: לחלק מהצלמים התשובה הנכונה היא שהעונה החלשה נועדה למנוחה ולא להכנסה. זו החלטה עסקית לגיטימית לגמרי, בתנאי אחד - שהמחיר בעונה החזקה נושא אותה. אם הוא לא, זו לא החלטה אלא גירעון מתוכנן.</p>',
    },

    { type: 'heading', level: 2, text: 'הציוד הוא לא הוצאה, הוא מלאי שנשחק' },
    {
      type: 'richtext',
      html: '<p>גוף מצלמה, עדשות, תאורה וגיבוי אינם קנייה חד-פעמית אלא מחזור החלפה. רוב המחירונים שאני רואה בנויים כאילו הציוד כבר שולם, והוא כמעט תמיד באמצע להישלם.</p><p>החישוב פשוט ולא נעים: כמה עולה הסט שאתם באמת עובדים איתו, כל כמה שנים הוא מתחלף, וכמה עבודות נכנסות בשנה. מה שיוצא הוא הסכום שכל עבודה חייבת להחזיר רק כדי לעמוד במקום, עוד לפני שדיברנו על רווח.</p><p>זה לא אומר להעלות מחיר. זה אומר לדעת מה המחיר אמור לכסות לפני שמחליטים עליו - וזה בדיוק ההבדל בין תעריף שנבחר לבין תעריף שהתקבע מעצמו.</p>',
    },

    { type: 'heading', level: 2, text: 'למה הגדרה בהסכם היא לא פס ייצור' },
    {
      type: 'richtext',
      html: '<p>החשש הזה עולה כמעט בכל שיחה, והוא הגיוני. סגנון, עריכה וכמה זמן מגיע לתמונה הם שיקול מקצועי שלכם בלבד, ואין לי בו דעה.</p><p>אבל הגדרה בהסכם לא מצמצמת את העבודה היצירתית - היא מגינה עליה. השעות שהולכות על ויכוח מה בדיוק הובטח נלקחות מאותו מאגר שעות שממנו באה העריכה. גבול ברור הוא מה שמחזיר אותן.</p>',
    },

    {
      type: 'richtext',
      html: '<p>קחו את העבודה האחרונה שסיימתם, רשמו את השעות בכל שלב, וחלקו את המחיר בסכום. המספר שיוצא הוא התעריף השעתי האמיתי שלכם. הוא כמעט תמיד נמוך ממה שכתוב במחירון, וההפרש בין השניים הוא כל מה שצריך לדעת כדי להתחיל.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'כמה תמונות ערוכות נכון למסור?',
          a: '<p>פחות ממה שנדמה, ובלבד שהמספר נאמר מראש. מסירה גדולה נראית נדיבה ועולה לכם פעמיים - בשעות עריכה ובכך שהלקוח מתקשה לבחור ומבקש עוד. מספר מוגדר הוא שירות טוב יותר, לא פחות.</p>',
        },
        {
          q: 'מה עושים כשמבקשים סבב רביעי?',
          a: '<p>נותנים אותו, ומחייבים עליו לפי מה שנכתב מראש. הבעיה אף פעם אינה הסבב הרביעי אלא זה שלא הוגדר מה קורה בו. כשזה כתוב, רוב הלקוחות פשוט לא מגיעים אליו.</p>',
        },
        {
          q: 'למכור קבצים או רישיון שימוש?',
          a: '<p>זו שאלה מסחרית לפני שהיא משפטית. לקוח עסקי קונה שימוש - איפה, לכמה זמן, באילו ערוצים - ושם יש מקום לתמחור מדורג. מכירה חד-פעמית של קבצים מסיימת את הקשר ואת ההכנסה באותו רגע. את הניסוח המשפטי של הזכויות כדאי לעשות מול עורך דין, לא מולי.</p>',
        },
        {
          q: 'איך מתמחרים בעונה חלשה?',
          a: '<p>לא בהנחה אוטומטית. הנחה בעונה חלשה מלמדת את השוק לחכות לה, והיא פוגעת גם בעונה החזקה. עדיף להציע משהו אחר - סוג עבודה שמתאים לחודשים האלה, או חבילה מצומצמת במחיר מלא לשעה.</p>',
        },
      ],
    },
  ],
}
