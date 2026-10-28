/**
 * ייעוץ עסקי לפסיכולוגים - written for the site, not migrated from WordPress.
 *
 * Written to docs/writing-spec.md, requested by Tomer on 28.10.2026.
 *
 * Cannibalisation (section 10): /ייעוץ-עסקי-למטפלים/ already exists and owns
 * the generic clinic material - stability, boundaries, authenticity. It is 430
 * words, broad, and never uses the word פסיכולוג. This page is not a rival to
 * it: it takes what is specific to psychologists - a statutory protected title,
 * a regulator, a different payer mix - and links to the therapists page for the
 * rest. The division is stated in the body so a reader lands in the right place.
 *
 * The law was read off the text of חוק הפסיכולוגים, תשל"ז-1977 on wikisource,
 * not off summaries. Three things are stated and nothing beyond them:
 *   §5  ייחוד התואר פסיכולוג, and §5א's definition of "השתמש", which explicitly
 *       reaches notices, signs, business cards and electronic means.
 *   §10 ייחוד תואר מומחה.
 *   §6  סייגים לפרסומת - which bans advertising "שיש בה כדי להטעות", not
 *       advertising. That distinction is the only reason the section is here.
 * Deliberately NOT claimed: that psychologists may not advertise, that any
 * particular wording is forbidden, or anything about ethics-code rules, since
 * הפ"י is a voluntary association and not the statutory regulator.
 *
 * Kept clear of angles the other authored pages own: no "what the regulations
 * forbid" list (that is the doctors page), no referral-network section (the
 * accountants page), no response-time section (cosmetics). The argument here is
 * the capacity ceiling, which no other page on the site makes.
 *
 * Numbers: none. The slot counts in the diagram are illustrative and the
 * caption says so. Nothing is attributed to a named client.
 */
export default {
  path: '/ייעוץ-עסקי-לפסיכולוגים/',
  published: '2026-10-28T09:00:00+02:00',
  modified: '2026-10-28T09:00:00+02:00',
  title: 'ייעוץ עסקי לפסיכולוגים | כשאי אפשר להוסיף עוד שעות',
  description:
    'לקליניקה של פסיכולוג יש תקרה קלינית, ולכן "עוד מטופלים" כמעט אף פעם אינו הפתרון. איפה הכסף באמת נמצא - בתעריף, בתמהיל ובשעות שדולפות.',
  image: 'https://elad-digital.co.il/wp-content/uploads/2024/06/3E9A2033-1024x683.jpg',
  cta: {
    title: 'רוצים לדעת איפה הקליניקה מאבדת שעות?',
    text: 'בשיחה אחת אפשר לעבור על היומן של החודש האחרון ולראות את שלושת המספרים. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי לפסיכולוגים: הקליניקה שלא גדלה כמו עסק רגיל' },
    {
      type: 'richtext',
      html: '<p>לרוב העסקים יש תשובה אחת כשרוצים לגדול: למכור יותר. פסיכולוג לא יכול להשתמש בה. ארבעים מטופלים בשבוע הם לא פי שניים מעשרים - הם עבודה אחרת, ופחות טובה. התקרה כאן היא קלינית, לא מסחרית.</p>',
    },
    {
      type: 'richtext',
      html: '<p>זה לא אומר שאין מה לעשות עם הצד העסקי. זה אומר שהמקומות שבהם הוא נשבר הם אחרים, ורובם לא קשורים כלל להבאת מטופלים חדשים.</p>',
    },

    { type: 'heading', level: 2, text: 'התקרה, והמכפלה שמאחוריה' },
    {
      type: 'richtext',
      html: '<p>ההכנסה של קליניקה היא מכפלה של שניים: שעות כפול תעריף. הם נראים כמו שני גורמים שווים, והם לא. את התעריף אפשר לשנות בהחלטה, ואת השעות כמעט לא.</p><p>לכל פסיכולוג יש מספר שעות טיפוליות שמעליו העבודה מתחילה להיפגע. הסימנים מוכרים: תיעוד שנדחה לסוף השבוע, פגישה שנזכרים בה רק כשהמטופל כבר בחדר, החלטה שמתקבלת מתוך עייפות. אני רואה שהגבול הזה ידוע לרוב האנשים שאני יושב מולם. הם פשוט לא מתייחסים אליו כנתון עסקי.</p><p>הוא כן. ברגע שמניחים אותו על השולחן, רוב התוכניות שמתחילות ב"צריך עוד מטופלים" נפסלות מעצמן.</p>',
    },
    {
      type: 'figure',
      caption:
        'שבוע לדוגמה בקליניקה, כדי להראות את החלוקה - לא נתון אמיתי. מה שחשוב הוא היחס בין שלושת הצבעים ביומן שלכם.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 600" role="img" aria-labelledby="psy-week-title psy-week-desc">
  <title id="psy-week-title">שבוע אחד בקליניקה, לפי מה שקרה לכל שעה</title>
  <desc id="psy-week-desc">רשת של חמישה ימים על פני שש שעות ביום. מעליה קו מקווקו שמסמן את התקרה - מספר השעות שמעליו העבודה נפגעת. עשרים שעות התקיימו, ארבע נקבעו ובוטלו מאוחר מכדי למכור אותן מחדש, ושש לא נמכרו כלל. שתי הקבוצות האחרונות הן הצד העסקי שאפשר לטפל בו בלי להוסיף אף שעה.</desc>

  <text class="diagram__head" x="570" y="42" text-anchor="start">שבוע אחד בקליניקה</text>
  <text class="diagram__note" x="570" y="80" text-anchor="start">התקרה: מספר השעות שמעליו העבודה נפגעת</text>
  <line class="diagram__axis" x1="70" y1="102" x2="570" y2="102" stroke-dasharray="7 6"/>

  <text class="diagram__note" x="524" y="128" text-anchor="middle">א׳</text>
  <text class="diagram__note" x="422" y="128" text-anchor="middle">ב׳</text>
  <text class="diagram__note" x="320" y="128" text-anchor="middle">ג׳</text>
  <text class="diagram__note" x="218" y="128" text-anchor="middle">ד׳</text>
  <text class="diagram__note" x="116" y="128" text-anchor="middle">ה׳</text>

  <rect class="diagram__cell" x="478" y="140" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="478" y="192" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="478" y="244" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="478" y="296" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="478" y="348" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--off" x="478" y="400" width="92" height="44" rx="10"/>

  <rect class="diagram__cell" x="376" y="140" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="376" y="192" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--lost" x="376" y="244" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="376" y="296" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="376" y="348" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--off" x="376" y="400" width="92" height="44" rx="10"/>

  <rect class="diagram__cell" x="274" y="140" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="274" y="192" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="274" y="244" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--lost" x="274" y="296" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="274" y="348" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="274" y="400" width="92" height="44" rx="10"/>

  <rect class="diagram__cell" x="172" y="140" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--lost" x="172" y="192" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="172" y="244" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--off" x="172" y="296" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="172" y="348" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--off" x="172" y="400" width="92" height="44" rx="10"/>

  <rect class="diagram__cell" x="70" y="140" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="70" y="192" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--lost" x="70" y="244" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--off" x="70" y="296" width="92" height="44" rx="10"/>
  <rect class="diagram__cell" x="70" y="348" width="92" height="44" rx="10"/>
  <rect class="diagram__cell diagram__cell--off" x="70" y="400" width="92" height="44" rx="10"/>

  <rect class="diagram__cell" x="542" y="466" width="26" height="26" rx="7"/>
  <text class="diagram__note" x="524" y="486" text-anchor="start">עשרים שעות התקיימו</text>
  <rect class="diagram__cell diagram__cell--lost" x="542" y="508" width="26" height="26" rx="7"/>
  <text class="diagram__note" x="524" y="528" text-anchor="start">ארבע נקבעו ובוטלו מאוחר</text>
  <rect class="diagram__cell diagram__cell--off" x="542" y="550" width="26" height="26" rx="7"/>
  <text class="diagram__note" x="524" y="570" text-anchor="start">שש לא נמכרו כלל</text>
</svg>`,
    },
    {
      type: 'richtext',
      html: '<p>זה השבוע שאני מבקש לראות בפגישה ראשונה. לא כמה מטופלים יש, אלא מה קרה לכל שעה: אילו מהן התקיימו, אילו נשארו ריקות, ואילו נקבעו ובוטלו מאוחר מדי מכדי למכור אותן מחדש. היחס בין שלושת הצבעים מספר כמעט את כל הסיפור הכלכלי.</p>',
    },

    { type: 'heading', level: 2, text: 'שלושה מקומות, ורק הם' },
    {
      type: 'richtext',
      html: '<p>כשמספר השעות נעול, נשארים שלושה מקומות שבהם משהו יכול לזוז:</p>',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '<b>התעריף</b> - כמה עולה שעה, ומתי הוא השתנה בפעם האחרונה.',
        '<b>התמהיל</b> - מי ממלא את השעות. טיפול פרטי, עבודה מול קופה, אבחונים, ועדות, הדרכה.',
        '<b>הדליפה</b> - שעות שנקבעו ולא התקיימו, חלונות שנשארו פתוחים, וזמן ניהולי שאיש לא משלם עליו.',
      ],
    },
    {
      type: 'richtext',
      html: '<p>הדליפה היא בדרך כלל הגדולה משלושתם, וגם היחידה שאפשר לצמצם בלי לשנות שום דבר מהותי. שעה שבוטלה ביום שלישי בערב לא נמכרת שוב. זו לא הכנסה שנדחתה, זו הכנסה שנעלמה.</p><p>הצד הרחב יותר של העבודה הזו - יציבות, גבולות, ניהול קליניקה - נמצא בעמוד על <a href="/ייעוץ-עסקי-למטפלים/">ייעוץ עסקי למטפלים</a>, והוא נכון לכל מי שמקבל מטופלים, ואילו כאן אני נשאר במה שייחודי לפסיכולוגים.</p>',
    },

    { type: 'heading', level: 2, text: 'התעריף, והשיחה שנדחית' },
    {
      type: 'richtext',
      html: '<p>העלאת מחיר למטופל חדש היא החלטה. העלאת מחיר למי שנמצא בטיפול שלוש שנים היא שיחה, ולכן היא נדחית. אני פוגש קליניקות שהתעריף בהן לא זז שנים, ולא משיקול כלכלי אלא מאי-נוחות.</p><p>אי-הנוחות אמיתית וכדאי להגיד את זה: הקשר הטיפולי הוא לא יחסי ספק ולקוח, ומשא ומתן בתוכו הוא דבר עדין. מה שעובד בדרך כלל הוא להפריד בין השניים: תעריף חדש למי שמתחיל, והודעה מסודרת עם מועד ידוע מראש למי שכבר בפנים.</p><p>ויש מקרים שבהם התשובה הנכונה היא לא להעלות בכלל. מטופל בשלב רגיש, או כזה שההעלאה תוציא אותו מהטיפול - זה שיקול קליני, והוא גובר. אבל אז זו החלטה, ולא ברירת מחדל שנמשכת חמש שנים.</p>',
    },

    { type: 'heading', level: 2, text: 'התמהיל: מי באמת ממלא את השבוע' },
    {
      type: 'richtext',
      html: '<p>שעה מול קופה ושעה פרטית נראות זהות ביומן, והן לא. הן נבדלות בתעריף, במועד שבו הכסף נכנס, בכמות הניירת ובסיכוי שייקבע ולא יגיע. רוב הקליניקות יודעות לומר מה ההרגשה, לא מה החלוקה בפועל.</p><p>לספור את זה לוקח שעה אחת, והמספר בדרך כלל מפתיע - לפעמים הוא לבדו מספיק כדי להחליט מה לשנות. זה אותו בירור שעושים ב<a href="/ייעוץ-לעסקים-קטנים/">ייעוץ לעסקים קטנים</a> בכל תחום. מה שמשתנה כאן הוא רק מה נמצא בעמודות.</p>',
    },

    { type: 'heading', level: 2, text: 'מה החוק אומר על הפרסום שלכם' },
    {
      type: 'richtext',
      html: '<p>חוק הפסיכולוגים נוגע ישירות בכל מילה שכתובה באתר או על שלט. סעיף 5 מייחד את התואר "פסיכולוג", וההגדרה שם רחבה: היא כוללת גם ביטוי או קיצור שמרמזים על הסמכה, והיא מתייחסת במפורש למודעות, לשלטים, לכרטיסי ביקור ולאמצעים אלקטרוניים. סעיף 10 עושה את אותו דבר לתארי מומחיות.</p><p>סעיף 6 עוסק בפרסומת, וכדאי לקרוא אותו בדיוק: הוא אוסר פרסומת "שיש בה כדי להטעות". לא פרסום. הטעיה. זה הבדל גדול, ומשמעותו המעשית היא שאתר שמסביר מה אתם עושים, למי, ואיך נראה תהליך - עומד בשורה.</p><p>את הניסוח הסופי כדאי לבדוק מול הנוסח העדכני של החוק, ולא מול מה שכתוב כאן.</p>',
    },

    { type: 'heading', level: 2, text: 'מתי ייעוץ עסקי לא יעזור' },
    {
      type: 'richtext',
      html: '<p>יש מצבים שבהם הבעיה פשוט אינה עסקית. קליניקה שמתרוקנת אחרי תקופה ארוכה של עומס היא לפעמים סימן לשחיקה, לא לשיווק חסר. ופסיכולוג ששוקל לסגור ולעבור למסגרת מקבל החלטת חיים, וייעוץ עסקי יכול לכל היותר לתמחר אותה.</p><p>ומה שהוא בוודאי לא עושה: הוא לא נכנס לחדר. הוא לא קובע כמה מטופלים לקחת, ולא מתערב בשיקול קליני. אלה לא גבולות של נימוס, הם גבולות של מקצוע.</p>',
    },

    {
      type: 'richtext',
      html: '<p>אם אתם רוצים לדעת איפה אתם עומדים, יש דרך קצרה. פתחו את היומן של החודש האחרון וספרו שלושה מספרים: כמה שעות התקיימו, כמה בוטלו, וכמה פשוט לא נמכרו. המספר השלישי הוא זה שמפתיע כמעט תמיד, ו<a href="/בניית-אסטרטגיה-עסקית/">אסטרטגיה עסקית</a> לקליניקה מתחילה בדרך כלל ממנו.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'כמה שעות טיפול בשבוע זה המספר הנכון?',
          a: '<p>אין מספר אחד, יש מספר שלכם, והוא משתנה לפי סוג העבודה ולפי התקופה. הדרך למצוא אותו היא לא לשאול כמה אפשר, אלא מאיזו שעה בשבוע האיכות מתחילה לרדת. רוב האנשים יודעים לענות על זה מיד, גם אם מעולם לא ניסחו את זה.</p>',
        },
        {
          q: 'מדיניות ביטולים פוגעת בקשר הטיפולי?',
          a: '<p>מדיניות שמוסברת מראש כמעט אף פעם לא. מה שפוגע הוא דווקא היעדרה: כשאין כלל, כל ביטול הופך לשיחה נפרדת ולשיקול דעת מחדש, וזה מעמיס על שני הצדדים. כלל ברור שנאמר בפגישה הראשונה מוריד את הנושא מהשולחן.</p>',
        },
        {
          q: 'כדאי לעבוד מול קופת חולים?',
          a: '<p>תלוי מה אתם קונים בזה: התעריף נמוך יותר, אבל זרם הפניות יציב ואינו תלוי בשיווק. ההחלטה נעשית נכון כשמסתכלים עליה כתמהיל ולא כשאלה בינארית: איזה חלק מהשבוע אתם מוכנים שיהיה בתעריף הזה בתמורה ליציבות.</p>',
        },
        {
          q: 'מתי עוברים מחדר לפי שעה לקליניקה משלכם?',
          a: '<p>כשהשעות הקבועות כבר מכסות את השכירות, ולא כשההכנסה החודשית נראית מספיקה. חדר לפי שעה הוא הוצאה משתנה, קליניקה היא הוצאה קבועה, והמעבר הופך חודש חלש מעניין לפחות. זה חישוב של רצפה, לא של תקרה.</p>',
        },
      ],
    },
  ],
}
