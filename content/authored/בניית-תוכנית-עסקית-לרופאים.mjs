/**
 * בניית תוכנית עסקית לרופאים - written for the site, not migrated from WordPress.
 *
 * Written to docs/content-guide.md, requested by Tomer on 27.11.2026 after a
 * Search Console read. The "כללים לעמודים חדשים" section governs, and section
 * 4א was checked against the finished copy.
 *
 * Demand: unlike the last three sector pages, this one answers queries the site
 * already gets and ranks badly for. From the export Tomer pasted on 27.11:
 * תוכנית עסקית לרופאים 92 impressions at 24.7, בניית תוכנית עסקית לרופאים 75
 * at 25.1, יעוץ עסקי למרפאות 63 at 27.2, ייעוץ בהקמת מרפאה 50 at 27.3,
 * פתיחת מרפאה פרטית 16 at 59.1. About 300 impressions and no clicks.
 * "פתיחת מרפאה" and "הקמת מרפאה" appeared on no page.
 *
 * Spelling: "תוכנית", as searched. The general page is /בניית-תכנית-עסקית/
 * and keeps its own spelling; the anchor to it uses that spelling.
 *
 * Cannibalisation, and the line drawn: /ייעוץ-עסקי-לרופאים/ ranks 4.4 for its
 * head term and 3-4 for residents, vets and "the health sector". This page is
 * about the plan and the move to private practice only. It does not use the
 * phrase "ייעוץ עסקי לרופאים" in title, H1, H2 or description, and that page
 * links here from its own sentence about the business plan.
 *
 * The argument: a doctor does not start from zero. He starts with a salary, a
 * public-system week and a reputation inside an institution, so the core of the
 * plan is an order of moves (how many public hours come out, when, and what
 * must be true in the private clinic first), not a market analysis.
 *
 * Consistent with, and not repeating, the positions Elad already published on
 * /ייעוץ-עסקי-לרופאים/: part-time in the public system alongside the clinic,
 * no large loans at the start, no over-investment in equipment and location.
 * None of that page's eight FAQ questions is asked again here. Its "6-12
 * months to break even" is NOT repeated: it is his number on his page, and
 * restating it here would turn an aside into a headline claim.
 *
 * Deliberately NOT written, because a neighbour owns it:
 *   - The general parts of a plan. /בניית-תכנית-עסקית/, linked.
 *   - Time between treatment and money, by payer. /ייעוץ-עסקי-לפיזיותרפיסטים/.
 *     Insurers appear here only as a source of patients.
 *   - A capacity ceiling counted in hours. /ייעוץ-עסקי-לפסיכולוגים/.
 *   - Where private patients come from online. /שיווק-דיגיטלי-לרופאים/, linked.
 *
 * Regulation deliberately NOT touched: nothing on whether or how a doctor may
 * see public-system patients privately, on rules for residents working
 * privately, on clinic licensing, or on insurer arrangements beyond naming them
 * as a patient source. A first draft listed "patients who ask to continue with
 * you" as a source and it was removed for that reason.
 *
 * Shape: three stacked bars that each sum to the whole working week, read top
 * to bottom, with the condition for the next step between them. reference.md
 * lists "a stacked bar that sums to a whole" as unused. The photographers' page
 * divides one job into parts once; here the same whole is shown three times and
 * the claim is the order and the gates, not the parts.
 *
 * E-E-A-T: the experience anchor rests on the doctors page's own published
 * claim that Elad works with doctors. No client, no case, no result.
 *
 * Numbers: none. The bar proportions are illustrative and the caption says so.
 */
export default {
  path: '/בניית-תוכנית-עסקית-לרופאים/',
  published: '2026-11-27T17:40:00+02:00',
  modified: '2026-11-27T17:40:00+02:00',
  title: 'בניית תוכנית עסקית לרופאים | מתי ואיך עוברים לקליניקה פרטית',
  description:
    'רופא לא פותח קליניקה מאפס. הוא מתחיל עם משכורת ושבוע במערכת הציבורית. כך בונים תוכנית שקובעת כמה שעות מוציאים, מתי, ומה צריך לקרות לפני כל צעד.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'כמה שעות אפשר להוריד מחר בבוקר?',
    text: 'בשיחה אחת נעבור על השבוע שלכם, נגדיר רצפת הכנסה ואת התנאי לצעד הראשון. לפעמים המסקנה היא לחכות, וגם היא נכתבת עם תאריך.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'בניית תוכנית עסקית לרופאים: סדר המעבר לקליניקה פרטית' },
    {
      type: 'richtext',
      html: '<p>תוכנית עסקית של רופא שונה מתוכנית של עסק רגיל בנקודה אחת: אתם לא מתחילים מאפס. יש לכם משכורת, שבוע עבודה במערכת הציבורית ומוניטין שיושב בתוך מוסד. לכן בניית תוכנית עסקית לרופאים היא קודם כול לוח זמנים של מעבר. כמה שעות מוציאים מהמערכת, באיזה סדר, ומה צריך לקרות בקליניקה הפרטית לפני כל צעד. פתיחת המרפאה היא התוצאה של התוכנית, ולא השורה הראשונה שלה.</p>',
    },
    {
      type: 'richtext',
      html: '<p>תבנית רגילה של תוכנית עסקית נכתבה למי שמשקיע כסף ומחכה ללקוח הראשון. אצל רופא הסיכון הפוך. הכסף כבר נכנס, והשאלה היא כמה ממנו אתם מוכנים לסכן ובאיזה קצב.</p>',
    },

    { type: 'heading', level: 2, text: 'התוכנית מתחילה מהיומן שלכם' },
    {
      type: 'richtext',
      html: '<p>כשאני יושב עם רופא על תוכנית כזאת, הדף הראשון שאני מבקש לראות הוא השבוע שלו כמו שהוא היום. משמרות, תורנויות, שעות קבלה, ומה מתוך כל אלה אפשר להזיז ובאיזו הודעה מראש.</p><p>מהדף הזה יוצאים שני מספרים שכל השאר נשען עליהם. הראשון הוא רצפת ההכנסה: הסכום החודשי שאתם צריכים כדי לחיות, בלי קשר לקליניקה. השני הוא כמה שעות ציבוריות צריך להשאיר כדי לעמוד ברצפה הזאת. כל שעה מעבר להן היא שעה שאפשר להעביר לפרטי בלי לסכן את הבית.</p><p>על הדרך המדורגת, משרה חלקית במערכת לצד הקליניקה, כתבתי גם בעמוד על <a href="/ייעוץ-עסקי-לרופאים/">ייעוץ עסקי לרופאים</a>. התוכנית היא מה שהופך את ההמלצה הזאת לתאריכים.</p>',
    },

    { type: 'heading', level: 2, text: 'מאיפה יגיעו המטופלים הפרטיים' },
    {
      type: 'richtext',
      html: '<p>זה הסעיף שהכי קל לכתוב בו משפט אופטימי, והכי קשה לבדוק אותו. מטופלים פרטיים מגיעים לרופא מכמה מקורות, ולכל אחד קצב אחר. עמיתים שמפנים, הסדרים עם ביטוחים משלימים או פרטיים, ואנשים שמחפשים רופא בתחום שלכם ומגיעים בלי שום היכרות קודמת.</p><p>בתוכנית כותבים ליד כל מקור כמה מטופלים בחודש אתם מצפים ממנו, ואיך תדעו בתוך רבעון אם צדקתם. מקור שאי אפשר לבדוק הוא תקווה, ולא שורה בתוכנית.</p><p>המקור האחרון הוא היחיד שאתם בונים לבד ושלא תלוי באף אחד. אם הוא חסר בתוכנית, כדאי לקרוא על <a href="/שיווק-דיגיטלי-לרופאים/">שיווק דיגיטלי לרופאים</a> לפני שחותמים על שכירות.</p>',
    },

    { type: 'heading', level: 2, text: 'הוצאה קבועה נכנסת רק אחרי הביקוש' },
    {
      type: 'richtext',
      html: '<p>בתוכנית שאני בונה עם רופאים, לכל הוצאה קבועה יש תנאי כניסה. בשלב הראשון החדר נשכר לפי שעות או לפי ימים, בקליניקה של מישהו אחר. כשהשעות האלה מתמלאות כמה שבועות ברצף, עוברים לחדר קבוע לחלק מהשבוע. קליניקה משלכם מגיעה רק כשההכנסה הפרטית עוברת את רצפת ההכנסה לבד.</p><p>היתרון בסדר הזה הוא שאפשר לעצור בכל שלב. רופא שנתקע בשלב השני עדיין עובד, עדיין מרוויח, ולא חתום על חוזה ארוך לחדר שעומד ריק.</p>',
    },
    {
      type: 'figure',
      caption:
        'אותו שבוע עבודה בשלושה שלבים, והתנאי שפותח כל שלב. החלוקה בכל פס היא להמחשה ולא נתון. הטענה היא הסדר, והשער בין שלב לשלב.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 540" role="img" aria-labelledby="mdplan-title mdplan-desc">
  <title id="mdplan-title">שבוע העבודה של רופא בשלושה שלבי מעבר, ומה פותח כל שלב</title>
  <desc id="mdplan-desc">שלושה פסים אופקיים, אחד מתחת לשני. כל פס הוא שבוע עבודה שלם, מחולק לחלק פרטי בכתום ולחלק ציבורי בסגול. בשלב הראשון, חדר לפי שעות, החלק הפרטי קטן. בשלב השני, חדר קבוע לחלק מהשבוע, הוא כמעט חצי. בשלב השלישי, קליניקה משלכם, הוא רוב השבוע, אבל החלק הציבורי לא נעלם. בין השלב הראשון לשני כתוב שעוברים כשהיומן הפרטי מלא כמה שבועות ברצף. בין השני לשלישי כתוב שעוברים כשההכנסה הפרטית עוברת את רצפת ההכנסה.</desc>

  <text class="diagram__eyebrow" x="600" y="40" text-anchor="start">תוכנית עסקית לרופא</text>
  <text class="diagram__head" x="600" y="76" text-anchor="start">אותו שבוע, שלושה שלבים</text>
  <rect class="diagram__rule" x="534" y="88" width="66" height="5" rx="2.5"/>

  <text class="diagram__head" x="600" y="140" text-anchor="start">חדר לפי שעות</text>
  <rect class="diagram__box diagram__box--intent" x="488" y="156" width="112" height="44" rx="10"/>
  <rect class="diagram__box" x="40" y="156" width="444" height="44" rx="10"/>
  <text class="diagram__note" x="544" y="185" text-anchor="middle">פרטי</text>
  <text class="diagram__note" x="262" y="185" text-anchor="middle">ציבורי</text>

  <polygon class="diagram__tip--alert" points="590,226 604,226 597,238"/>
  <text class="diagram__note" x="578" y="238" text-anchor="start">עוברים כשהיומן הפרטי מלא שבועות ברצף</text>

  <text class="diagram__head" x="600" y="296" text-anchor="start">חדר קבוע, חלק מהשבוע</text>
  <rect class="diagram__box diagram__box--intent" x="348" y="312" width="252" height="44" rx="10"/>
  <rect class="diagram__box" x="40" y="312" width="304" height="44" rx="10"/>
  <text class="diagram__note" x="474" y="341" text-anchor="middle">פרטי</text>
  <text class="diagram__note" x="192" y="341" text-anchor="middle">ציבורי</text>

  <polygon class="diagram__tip--alert" points="590,382 604,382 597,394"/>
  <text class="diagram__note" x="578" y="394" text-anchor="start">עוברים כשההכנסה הפרטית עוברת את הרצפה</text>

  <text class="diagram__head" x="600" y="452" text-anchor="start">קליניקה משלכם</text>
  <rect class="diagram__box diagram__box--intent" x="180" y="468" width="420" height="44" rx="10"/>
  <rect class="diagram__box" x="40" y="468" width="136" height="44" rx="10"/>
  <text class="diagram__note" x="390" y="497" text-anchor="middle">פרטי</text>
  <text class="diagram__note" x="108" y="497" text-anchor="middle">ציבורי</text>
</svg>`,
    },

    { type: 'heading', level: 2, text: 'מה צריך להיות כתוב בתוכנית' },
    {
      type: 'list',
      ordered: true,
      items: [
        'מפת השבוע הנוכחי: מה ציבורי, מה אפשר להזיז, ובאיזו הודעה מראש.',
        'רצפת ההכנסה, ומספר השעות הציבוריות שמחזיקות אותה.',
        'מקורות המטופלים הפרטיים, עם צפי לכל אחד ודרך לבדוק אותו.',
        'ההוצאות הקבועות לפי שלב, והתנאי שמכניס כל אחת מהן.',
        'התנאי לכל צעד הבא, כתוב כמספר שאפשר למדוד ביומן.',
        'נקודת חזרה: מה עושים אם אחרי תקופה שקבעתם מראש הצד הפרטי לא גדל.',
      ],
    },
    {
      type: 'richtext',
      html: '<p>את המרכיבים הכלליים, ניתוח שוק ותכנון פיננסי, פירטתי בעמוד על <a href="/בניית-תכנית-עסקית/">בניית תכנית עסקית</a>. הרשימה כאן היא רק מה שאין בתבנית הכללית ויש אצל כל רופא.</p>',
    },

    { type: 'heading', level: 2, text: 'כשהתוכנית אומרת להישאר' },
    {
      type: 'richtext',
      html: '<p>החשש שעולה אצל רופאים הוא שתוכנית עסקית תדחוף אותם לעזוב את בית החולים. התוכנית שאני מציע עושה את ההפך. היא מראה גם מתי לא לזוז.</p><p>יש רופאים שהתוכנית הנכונה בשבילם היא אחר צהריים אחד בשבוע בקליניקה, לאורך שנים. יש התמחויות שבהן העבודה עצמה תלויה בחדר ניתוח, במכשור או בצוות של בית החולים, ושם קליניקה פרטית מלאה פשוט לא נמצאת על המפה. ויש שלבים בקריירה שבהם המעבר לא עומד על הפרק בכלל, והתוכנית היא רשימה של מה לבנות עכשיו כדי שיהיה ממה להתחיל אחר כך.</p><p>השורה בתוכנית שהכי שווה לשמור עליה היא נקודת החזרה. דלת פתוחה במערכת הציבורית שווה יותר מכל תחזית אופטימית.</p>',
    },

    {
      type: 'richtext',
      html: '<p>אם אתם יודעים כמה תעלה הקליניקה, אבל לא יודעים כמה שעות ציבוריות תוכלו להוריד בלי לגעת ברצפה, התוכנית שלכם עוד לא התחילה.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'אני לא לוקח הלוואה. צריך בכלל תוכנית כתובה?',
          a: '<p>כן, והיא אפילו פשוטה יותר. תוכנית לבנק נכתבת כדי לשכנע אחרים. תוכנית בלי הלוואה נכתבת כדי שאתם תדעו מתי לזוז, והיא יכולה להיות שני עמודים. מה שחשוב בה הם התנאים לכל שלב, כתובים מראש, לפני שהתחושה מחליטה בשבילכם.</p>',
        },
        {
          q: 'כדאי לפתוח קליניקה משותפת עם רופא נוסף?',
          a: '<p>זה מחלק את ההוצאות הקבועות ומקצר את הדרך לחדר קבוע. מה שצריך להיות כתוב לפני שחותמים הוא מה קורה כשאחד מכם מלא והשני לא. מי משלם על החדר בשעות הריקות, ומי מקבל שעות שהתפנו. זו השאלה שכדאי לסגור בכתב, כי היא תעלה.</p>',
        },
        {
          q: 'תוכנית למרפאה עם צוות שונה מתוכנית לרופא יחיד?',
          a: '<p>מאוד. ברגע שיש מזכירה, אחות או רופא נוסף בשכר, ההוצאה הקבועה הגדולה היא משכורות, והן רצות מהיום הראשון. אותן אי אפשר לשכור לפי שעה, ולכן ההיגיון המדורג של העמוד הזה לא עובד שם. הקמת מרפאה כזאת דורשת הון לתקופת הבנייה והוכחה שיש ביקוש עוד לפני הפתיחה. ההוכחה הכי טובה לזה היא קליניקה של רופא יחיד שכבר מלאה.</p>',
        },
      ],
    },
  ],
}
