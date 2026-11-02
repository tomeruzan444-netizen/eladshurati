/**
 * ייעוץ עסקי לדיאטנים - written for the site, not migrated from WordPress.
 *
 * Written to docs/writing-spec.md, requested by Tomer on 2.11.2026.
 *
 * Cannibalisation (section 10): nothing on the site mentions תזונה or דיאטן at
 * all. The nearest neighbours are /ייעוץ-עסקי-למאמני-כושר/ (595 words, generic:
 * acquisition, time management, services offered) and /ייעוץ-עסקי-למטפלים/
 * (clinic management). This page avoids both by taking an argument neither
 * makes, and links to each.
 *
 * The argument is retention, and it is deliberately not one of the three the
 * site already runs: the psychologists page is a hard ceiling on hours, the
 * accountants page is fee erosion under stable revenue, the therapists page is
 * what the outer frame fails to hold. Here it is the arc that never completes -
 * the first session is the easiest thing to sell and the least valuable, and a
 * practice built to fill it is built on the cheap end of its own curve.
 *
 * The law was read off the text of חוק הסדרת העיסוק במקצועות הבריאות,
 * התשס"ח-2008 on wikisource, not off summaries - two of which contradicted each
 * other on whether "דיאטן קליני" is still a protected title, which is exactly
 * why it was not claimed. Stated here, and nothing beyond it:
 *   §2 + התוספת הראשונה  "תזונאי"/"דיאטן" = מי שניתנה לו תעודת תזונאי-דיאטן.
 *   §4(א)  ייחוד התואר, including a title similar enough to mislead.
 *   §4(ב)  presenting yourself as practising the profession without it.
 *   §25(א) פרסומת "שיש בה כדי להטעות" - misleading advertising, not advertising.
 * Used as a positioning point rather than a list of prohibitions: the
 * psychologists page already owns "what the regulator permits", and repeating
 * that frame would have made the two pages read as one.
 *
 * Numbers: none. The curve in the figure carries no values and the caption says
 * it shows a shape. Nothing is attributed to a named client.
 *
 * Address: אתם, matching the H1's דיאטנים, which is the search term. The field
 * is mostly women in Israel and אתן may be the better fit - flagged for Tomer
 * in content/drafts/, not decided here.
 */
export default {
  path: '/ייעוץ-עסקי-לדיאטנים/',
  published: '2026-11-02T09:00:00+02:00',
  modified: '2026-11-02T09:00:00+02:00',
  title: 'ייעוץ עסקי לדיאטנים | הבעיה היא לא להביא מטופלים',
  description:
    'הפגישה הראשונה היא הקלה ביותר למכור והפחות שווה. למה התוצאה והרווח נמצאים בפגישה הרביעית, ומה מחזיק מטופלים בתהליך עד שם.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'רוצים לדעת כמה מהמטופלים שלכם מגיעים לפגישה רביעית?',
    text: 'זו שאלה שאפשר לענות עליה בחצי שעה מול היומן, ובדרך כלל המספר מפתיע. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי לדיאטנים: הבעיה היא לא להביא מטופלים' },
    {
      type: 'richtext',
      html: '<p>כמעט כל השיווק בתחום התזונה מכוון לדבר אחד: למלא את הפגישה הראשונה. זו גם הפגישה הכי קלה למכור, וגם הכי פחות שווה. התוצאה של המטופל נמצאת הרבה אחריה, והרווח שלכם נמצא בדיוק באותו מקום.</p>',
    },
    {
      type: 'richtext',
      html: '<p>השאלה הנכונה היא לא כמה אנשים נכנסים בחודש. היא כמה מהם עדיין כאן בפגישה החמישית.</p>',
    },

    { type: 'heading', level: 2, text: 'העקומה שכל קליניקת תזונה מכירה' },
    {
      type: 'richtext',
      html: '<p>הנשירה בתזונה חדה יותר מברוב תחומי הטיפול, והיא קורית במקום צפוי. השבועיים הראשונים נעימים: המשקל זז, הבגדים מרגישים אחרת, והמטופל חוזר הביתה עם תחושה שזה עובד. השבוע השלישי והרביעי הם אחרים. הקצב נעצר, החיים חוזרים, וההתלהבות מהפגישה הראשונה כבר לא מספיקה כדי להחזיק.</p><p>זה בדיוק הרגע שבו אנשים נעלמים. לא בכעס ולא באכזבה - פשוט לא קובעים את הפגישה הבאה.</p>',
    },
    {
      type: 'figure',
      caption:
        'צורת העקומה, לא נתון. מה שחשוב הוא לא הגובה של כל עמודה אלא איפה הנפילה החדה קורית, ומה נמצא מימין לה לעומת משמאל.',
      html: `<svg class="diagram__svg" viewBox="0 0 680 440" role="img" aria-labelledby="diet-curve-title diet-curve-desc">
  <title id="diet-curve-title">כמה מטופלים נשארים, לפי מספר הפגישה</title>
  <desc id="diet-curve-desc">עמודות יורדות משמאל לימין: הגבוהה ביותר היא הפגישה הראשונה, ומשם הגובה צונח בחדות בפגישות השנייה והשלישית ומתייצב אחרי הרביעית. שטח כתום מסומן מעל הפגישות הרביעית עד השמינית, מפני ששם נמצאות גם התוצאה של המטופל וגם הרווח של הקליניקה - אחרי שעלות הגיוס כבר שולמה.</desc>

  <text class="diagram__eyebrow" x="620" y="44" text-anchor="start">קליניקת תזונה</text>
  <text class="diagram__head" x="620" y="84" text-anchor="start">כמה נשארים, לפי מספר הפגישה</text>
  <rect class="diagram__rule" x="554" y="94" width="66" height="5" rx="2.5"/>

  <rect class="diagram__gap" x="48" y="118" width="356" height="242" rx="16"/>
  <text class="diagram__step" x="396" y="152" text-anchor="start">כאן התוצאה, וכאן הרווח</text>

  <rect class="diagram__band" x="550" y="130" width="56" height="230" rx="10"/>
  <rect class="diagram__band" x="480" y="192" width="56" height="168" rx="10"/>
  <rect class="diagram__band" x="410" y="240" width="56" height="120" rx="10"/>
  <rect class="diagram__band" x="340" y="270" width="56" height="90" rx="10"/>
  <rect class="diagram__band" x="270" y="286" width="56" height="74" rx="10"/>
  <rect class="diagram__band" x="200" y="298" width="56" height="62" rx="10"/>
  <rect class="diagram__band" x="130" y="305" width="56" height="55" rx="10"/>
  <rect class="diagram__band" x="60" y="310" width="56" height="50" rx="10"/>

  <line class="diagram__axis" x1="44" y1="360" x2="624" y2="360"/>
  <text class="diagram__note" x="578" y="388" text-anchor="middle">1</text>
  <text class="diagram__note" x="508" y="388" text-anchor="middle">2</text>
  <text class="diagram__note" x="438" y="388" text-anchor="middle">3</text>
  <text class="diagram__note" x="368" y="388" text-anchor="middle">4</text>
  <text class="diagram__note" x="298" y="388" text-anchor="middle">5</text>
  <text class="diagram__note" x="228" y="388" text-anchor="middle">6</text>
  <text class="diagram__note" x="158" y="388" text-anchor="middle">7</text>
  <text class="diagram__note" x="88" y="388" text-anchor="middle">8</text>
  <text class="diagram__note" x="334" y="420" text-anchor="middle">מספר הפגישה</text>
</svg>`,
    },
    {
      type: 'richtext',
      html: '<p>רוב הקליניקות מודדות את העמודה הימנית בלבד. כמה פניות הגיעו, כמה נסגרו. העמודות שמשמאל הן אלה שקובעות אם החודש היה טוב.</p>',
    },

    { type: 'heading', level: 2, text: 'למה פגישה רביעית שווה יותר מפגישה ראשונה' },
    {
      type: 'richtext',
      html: '<p>את עלות הגיוס של מטופל משלמים פעם אחת. הפרסום, השיחה, השעה שהלכה על פנייה שלא נסגרה - כל זה יושב על הפגישה הראשונה. הפגישה הרביעית לא נושאת ממנה כלום.</p><p>המשמעות המעשית היא ששתי קליניקות עם אותו מחזור חודשי יכולות להיות במצב כלכלי שונה לגמרי, בלי הבדל אחד במחיר. ההבדל כולו בשאלה איפה הפגישות שלהן יושבות על העקומה. זה אותו חישוב שעומד מאחורי <a href="/רווח-תפעולי/">רווח תפעולי</a> בכל עסק, רק שכאן המשתנה הוא מספר הפגישה.</p><p>אני חושב שזו הטעות היקרה ביותר בתחום: להגדיל תקציב פרסום לפני שמסתכלים על העקומה. כסף שנשפך פנימה בקצב גדול יותר הוא עדיין כסף שנשפך.</p>',
    },

    { type: 'heading', level: 2, text: 'מה באמת מחזיק אנשים בתהליך' },
    {
      type: 'richtext',
      html: '<p>לא מוטיבציה. מוטיבציה היא מה שמביא אנשים לפגישה הראשונה, וזו בדיוק הסיבה שאי אפשר להישען עליה אחר כך.</p><p>מה שאני מחפש ראשון כשאני בודק קליניקה הוא לא המחיר אלא מה בדיוק נמכר. זה מבנה, ויש לו ארבעה חלקים:</p>',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '<b>מה נמכר.</b> פגישה בודדת או תהליך. מי שמוכר פגישה מוכר מחדש בכל פעם, ומפסיד בכל פעם שהמטופל מתלבט.',
        '<b>מתי משלמים.</b> תשלום מראש על תהליך הוא לא טריק גבייה, הוא התחייבות הדדית שמשנה את ההתנהגות של שני הצדדים.',
        '<b>מה קורה בין פגישות.</b> שבועיים של שקט מוחלט הם שבועיים שבהם ההחלטה לא לחזור מתקבלת לבד.',
        '<b>מה נאמר מראש על השבוע השלישי.</b> מטופל שיודע שהקצב ייעצר לא מפרש את זה ככישלון.',
      ],
    },
    {
      type: 'richtext',
      html: '<p>הסעיף האחרון הוא הזול ביותר ליישום והכי מושמט. אותה נשירה קיימת גם אצל <a href="/ייעוץ-עסקי-למאמני-כושר/">מאמני כושר</a>, מאותה סיבה בדיוק.</p><p>ויש הסתייגות אמיתית: יש מטופלים שנכון שיפסיקו. מי שהגיע ללא בשלות, או שהתהליך לא מתאים לו עכשיו - שימור שלו הוא לא הישג. המטרה היא לא שאף אחד לא יעזוב, אלא שמי שעוזב יעשה את זה מתוך החלטה ולא מתוך היעלמות.</p>',
    },

    { type: 'heading', level: 2, text: 'הרישיון שלכם הוא בידול שאתם לא משתמשים בו' },
    {
      type: 'richtext',
      html: '<p>חוק הסדרת העיסוק במקצועות הבריאות, התשס"ח-2008, מגדיר "תזונאי" ו"דיאטן" כמי שניתנה לו תעודת תזונאי-דיאטן, ומונה את המקצוע בתוספת הראשונה. סעיף 4 אוסר על אדם להשתמש בתואר, או בתואר דומה עד כדי להטעות, אם אין לו התעודה - וגם אוסר עליו להציג את עצמו, במישרין או בעקיפין, כעוסק במקצוע.</p><p>המשמעות העסקית היא לא שהשוק סגור. השוק מלא באנשים שנותנים ייעוץ תזונתי תחת שמות אחרים, וזה חוקי כל עוד הם לא משתמשים בתואר ולא מציגים את עצמם כעוסקים במקצוע. מה שכן משתנה הוא שלכם יש משהו שלהם אין, ורוב עמודי הבית שאני קורא בתחום לא אומרים עליו מילה.</p><p>סעיף 25 אוסר פרסומת שיש בה כדי להטעות. לומר מה התעודה כוללת ומה היא דורשת אינו הטעיה - זו בדיוק המידע שהקורא מחפש כדי להבדיל ביניכם לבין מי שלא עבר את זה. אני קורא כאן את לשון החוק ולא מפרש אותה, והנוסח המחייב הוא זה שבספר החוקים.</p>',
    },

    { type: 'heading', level: 2, text: 'שני דברים שהייעוץ הזה לא עושה' },
    {
      type: 'richtext',
      html: '<p>הוא לא נכנס לתוכן הטיפולי, ולא קובע כמה פגישות נכון לתת. זו החלטה מקצועית שלכם, והיא משתנה ממטופל למטופל.</p><p>והוא גם לא הופך תהליך טיפולי למנוי. אם המבנה העסקי דורש מכם להאריך תהליכים שהיו צריכים להסתיים - המבנה שגוי, לא התהליך. הצד העסקי של <a href="/ייעוץ-עסקי-למטפלים/">קליניקה טיפולית</a> אמור לשרת את העבודה, לא להיפך.</p>',
    },

    {
      type: 'richtext',
      html: '<p>יש מספר אחד ששווה לכם לדעת, ורובכם לא יודעים אותו. קחו את המטופלים שהתחילו בחצי השנה האחרונה, וספרו כמה מהם הגיעו לפגישה הרביעית. אחוז אחד, שלוקח חצי שעה לחשב, ואומר על הקליניקה יותר מכל דוח הכנסות חודשי.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'כמה שווה מטופל שחוזר לעומת מטופל חדש?',
          a: '<p>יותר, וההפרש גדול ממה שנדמה. המטופל החדש נושא את כל עלות הגיוס - הפרסום, השיחות שלא נסגרו, הזמן שהלך על תיאום. החוזר לא נושא ממנה כלום. לכן שיפור קטן בשימור מזיז את הרווח הרבה יותר מגידול דומה בפניות.</p>',
        },
        {
          q: 'למכור חבילה מראש או פגישה-פגישה?',
          a: '<p>חבילה, ברוב המקרים, אבל לא בשביל התזרים. תשלום מראש משנה את ההתנהגות: מי ששילם על תהליך מגיע גם בשבוע שבו הקצב נעצר. מה שחשוב הוא שהחבילה תתאר תהליך אמיתי עם נקודות עצירה, ולא תהיה מכירה של כמות.</p>',
        },
        {
          q: 'מה עושים עם מטופל שנעלם אחרי הפגישה השנייה?',
          a: '<p>פונים, פעם אחת, בלי מכירה. ההודעה שעובדת היא זו ששואלת מה קרה ולא זו שמציעה הנחה. חלק יחזרו, וחלק יענו תשובה שתלמד אתכם למה אחרים עזבו באותה נקודה. שתי התוצאות שוות את הפנייה.</p>',
        },
        {
          q: 'קבוצות הן פתרון לתקרת השעות?',
          a: '<p>בתזונה כן, יותר מאשר בתחומים טיפוליים אחרים, כי חלק גדול מהידע חוזר על עצמו בין מטופלים. קבוצה טובה לא מחליפה את הליווי האישי אלא לוקחת ממנו את החלק שאינו אישי באמת, ומפנה את הפגישה הפרטית למה שבאמת דורש אותה.</p>',
        },
      ],
    },
  ],
}
