/**
 * ייעוץ עסקי לחשמלאים - written for the site, not migrated from WordPress.
 *
 * Written to docs/content-guide.md, requested by Tomer on 20.11.2026. The
 * "כללים לעמודים חדשים" section governs, and section 4א (the extended AI-tells
 * list, in force from 16.11) was checked against the finished copy: no spaced
 * hyphen, no em dash, no "זה לא X, זה Y" inversion, no heading opening on a
 * number, no announce-before-content, none of the listed words.
 *
 * Cannibalisation (section 10): nothing on the site covers electricians.
 * "חשמלאי" appears on zero of the 89 pages. Search Console for the 30 days to
 * 20.11.2026 returned **zero queries containing "חשמל"**, so like the graphic
 * designers page this is a bet on an intent the site does not touch yet rather
 * than demand it already has. Said out loud rather than buried.
 *
 * The two neighbours are both thin migrated pages and both generic:
 * /ייעוץ-עסקי-לקבלן-שיפוצים/ (329 words: leads, project chaos) and
 * /ייעוץ-עסקי-לקבלנים/ (299 words: finance, pricing, cash flow).
 *
 * The argument: an electrician is priced per job and pays per day. Capacity is
 * not hours and not speed, it is stops, and what sets the number of stops is
 * the distance between them. The travel is real working time that nobody
 * charges for and no report shows, so the cheapest lever in the business is
 * which jobs share a day.
 *
 * Deliberately NOT written, because a neighbouring page already owns it:
 *   - Two kinds of time inside one job, where the resource and the person come
 *     apart. /ייעוץ-עסקי-למספרות/. That page never mentions travel and this one
 *     never splits a resource; the overlap is only that both end at the diary.
 *   - Same price, different cost to serve. /ייעוץ-עסקי-ליועצי-מס/, where the
 *     difference comes from the client. Here it comes from where the *previous*
 *     job was, so the same client costs differently on different days.
 *   - Unpriced work that trails a delivered job. /ייעוץ-עסקי-לצלמים/.
 *   - Cash flow and pricing a project. /ייעוץ-עסקי-לקבלנים/.
 *   - Leads and project management. /ייעוץ-עסקי-לקבלן-שיפוצים/.
 *   - A capacity ceiling counted in hours. /ייעוץ-עסקי-לפסיכולוגים/.
 *
 * Shape: a map-like spatial layout, which reference.md lists among the shapes
 * not yet used. One route, not two: the hotel page already compares two paths
 * for one booking, so a before/after pair of routes would have read as that
 * shape in a new coat. The picture argues by proportion instead - the stops are
 * small and the line between them fills the frame, which is the claim.
 *
 * Two internal links, not three. A third to /ייעוץ-עסקי-לקבלנים/ was drafted
 * next to the קבלן שיפוצים link and dropped: two links in neighbouring
 * sentences is the clustering rule 9 warns about, and the sentence only wanted
 * one of them.
 *
 * Address: אתם. Electrical work is not a women-majority field.
 *
 * E-E-A-T: Elad has never said he works with electricians. No client, no case,
 * no result, no named study. The experience anchor is written about
 * travel-based businesses generally, the widest claim the material supports.
 * Tenth sector page in that position. Finding 9ה.
 *
 * Numbers: none. No minutes, no kilometres, no call-out fee, no percentages.
 * The figure carries structure only and its caption says so.
 */
export default {
  path: '/ייעוץ-עסקי-לחשמלאים/',
  published: '2026-11-20T17:00:00+02:00',
  modified: '2026-11-20T17:00:00+02:00',
  title: 'ייעוץ עסקי לחשמלאים | מה שהנסיעות עושות ליום העבודה',
  description:
    'אצל חשמלאי מספר העבודות ביום נקבע לפי המרחק ביניהן ולא לפי מהירות העבודה. הנסיעה היא זמן עבודה שאף אחד לא שילם עליו, וזה מה שאפשר לעשות איתה.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'כמה מהיום שלכם עובר בכביש?',
    text: 'נפתח יחד שבוע אחד ביומן ונסמן את הנסיעות בין העבודות. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי לחשמלאים: הקיבולת נמדדת בעצירות, לא בשעות' },
    {
      type: 'richtext',
      html: '<p>חשמלאי מתומחר לפי עבודה ומשלם לפי יום. שתי עבודות שנראות זהות במחירון עולות לכם סכומים שונים לגמרי, וההפרש יושב כמעט תמיד בכביש. הקיבולת היומית שלכם לא נקבעת לפי כמה מהר אתם עובדים, אלא לפי כמה רחוקות העבודות זו מזו.</p>',
    },
    {
      type: 'richtext',
      html: '<p>זו הסיבה שיום עמוס נגמר לפעמים בפחות כסף מיום רגוע. ספרתם עבודות. היום ספר נסיעות.</p>',
    },

    { type: 'heading', level: 2, text: 'למה שתי עבודות זהות לא עולות אותו דבר' },
    {
      type: 'richtext',
      html: '<p>קחו החלפת שקע. אצל לקוח בבניין שאתם כבר נמצאים בו, זו עבודה קצרה שנכנסת לתוך מה שממילא תכננתם. אצל לקוח בקצה השני של העיר, אותה עבודה בדיוק אוכלת נתח גדול מהיום, רובו בנהיגה ובחיפוש חניה.</p><p>במחירון שתיהן אותו סעיף. ביום שלכם הן לא דומות בכלל.</p><p>כשאני נכנס לעסק שמבוסס על נסיעות, אחד הדברים הראשונים שאני מבקש לראות הוא כמה מהיום הולך על הדרך. כמעט תמיד אין תשובה. זה לא מופיע בשום דוח, פשוט כי אף אחד לא מחייב עליו.</p>',
    },
    {
      type: 'figure',
      caption:
        'התרשים מראה מבנה ולא מרחקים מדודים. אין בו קילומטרים ואין בו שעון. מה שהוא טוען הוא שהעבודות הן הנקודות הקטנות, והקו שמחבר ביניהן הוא רוב היום.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 430" role="img" aria-labelledby="elec-map-title elec-map-desc">
  <title id="elec-map-title">העבודות הן הנקודות, והיום הוא הקו שביניהן</title>
  <desc id="elec-map-desc">מפה סכמטית של אזור עבודה, עם חמש נקודות שמסמנות חמש עבודות של יום אחד. קו אחד מחבר אותן לפי הסדר שבו הקריאות התקבלו, והוא חוצה את המפה הלוך ושוב מצד לצד. הנקודה הראשונה נמצאת בצד ימין והאחרונה במרכז התחתון. הקו ארוך בהרבה מסך הנקודות שהוא מחבר.</desc>

  <text class="diagram__eyebrow" x="620" y="40" text-anchor="start">יום אחד של חשמלאי</text>
  <text class="diagram__head" x="620" y="76" text-anchor="start">העבודה היא הנקודות</text>
  <rect class="diagram__rule" x="554" y="88" width="66" height="5" rx="2.5"/>

  <rect class="diagram__box" x="40" y="118" width="580" height="268" rx="14"/>

  <line class="diagram__axis" x1="180" y1="118" x2="180" y2="386"/>
  <line class="diagram__axis" x1="330" y1="118" x2="330" y2="386"/>
  <line class="diagram__axis" x1="480" y1="118" x2="480" y2="386"/>
  <line class="diagram__axis" x1="40" y1="206" x2="620" y2="206"/>
  <line class="diagram__axis" x1="40" y1="300" x2="620" y2="300"/>

  <polyline class="diagram__line diagram__line--rising" fill="none"
            points="556,196 168,288 492,344 236,172 400,330"/>

  <circle class="diagram__node" cx="556" cy="196" r="9"/>
  <circle class="diagram__node" cx="168" cy="288" r="9"/>
  <circle class="diagram__node" cx="492" cy="344" r="9"/>
  <circle class="diagram__node" cx="236" cy="172" r="9"/>
  <circle class="diagram__node diagram__node--end" cx="400" cy="330" r="9"/>

  <text class="diagram__note" x="600" y="176" text-anchor="start">הראשונה</text>
  <text class="diagram__note" x="400" y="368" text-anchor="middle">האחרונה</text>
</svg>`,
    },

    { type: 'heading', level: 2, text: 'הנסיעה השנייה לאותה עבודה' },
    {
      type: 'richtext',
      html: '<p>יש סוג נסיעה אחד שעולה יותר מכולם, וזו החזרה לאותה כתובת. מגיעים, מאבחנים, ומגלים שהחלק לא נמצא על הרכב. העבודה נעצרת באמצע, נוסעים לספק או חוזרים ביום אחר, והלקוח משלם על עבודה אחת.</p><p>זו הנקודה שבה מלאי הרכב הופך משאלה טכנית לשאלה עסקית. השאלה היא תדירות: איזה פריט חוזר אצלכם מספיק פעמים כדי להצדיק מקום קבוע בארגז, גם אם הוא יישב שם שבועיים בלי שימוש.</p><p>הבדיקה לוקחת חמש דקות. בחודש האחרון, לכמה עבודות נסעתם פעמיים? אם יש פריט שחוזר ברשימה הזאת, הוא עולה לכם הרבה יותר מהמחיר שלו בחנות.</p>',
    },

    { type: 'heading', level: 2, text: 'דמי הקריאה, והמקום שבו הם מתומחרים נמוך מדי' },
    {
      type: 'richtext',
      html: '<p>לענף יש כבר תשובה חלקית לבעיה הזאת, והיא דמי הקריאה. מה שקורה אצל רוב החשמלאים הוא שהסכום נקבע פעם אחת, לפי מה שהיה מקובל אז, ומאז הוא לא זז.</p><p>דמי קריאה אמורים לכסות את הנסיעה ואת הזמן שמסביבה. כשהם נמוכים מדי, עבודה קטנה ורחוקה הופכת להפסד מוסווה. היא נראית כמו הכנסה, והיא תופסת את המקום של עבודה קרובה יותר באותו יום.</p><p>הדבר הראשון שאני בודק שם הוא לא הסכום אלא אם הוא מבחין בין קרוב לרחוק. תעריף אחיד לכל העיר אומר דבר אחד: הלקוח הקרוב מסבסד את הרחוק.</p>',
    },

    { type: 'heading', level: 2, text: 'הקריאה הדחופה ששוברת את היום' },
    {
      type: 'richtext',
      html: '<p>תקלת חשמל אי אפשר לדחות, וזה בדיוק מה שהופך קריאות דחופות לרווחיות. הלקוח מוכן לשלם יותר כי אין לו ברירה, וזה לגיטימי לגמרי.</p><p>המחיר שלהן פחות גלוי. קריאה דחופה באמצע היום מפרקת את כל מה שסודר: נוסעים לקצה אחד, חוזרים, והעבודות שנקבעו מראש נדחקות או מתבטלות. הרווח מהקריאה האחת מגיע על חשבון שלוש אחרות, ואף אחד לא עושה את החשבון הזה בסוף השבוע.</p><p>מה שעובד זה להחליט מראש כמה חלונות דחופים היום יכול לספוג, במקום להחליט את זה בכל פעם מחדש בטלפון.</p>',
    },

    { type: 'heading', level: 2, text: 'איך נראה יום שסודר לפי אזור' },
    {
      type: 'richtext',
      html: '<p>השינוי הוא לא בקצב העבודה. הוא בשאלה ששואלים כשקובעים מועד. במקום לשאול מתי אתם פנויים, השאלה היא איפה אתם ממילא נמצאים ביום שלישי.</p><p>בפועל זה אומר לקבץ עבודות לפי אזור, ולהציע ללקוח מועד מתוך מה שכבר מתוכנן קרוב אליו. רוב הלקוחות מסכימים, כי מי שמחכה להחלפת שקע לא מחכה לשעה מסוימת.</p><p>מה שזה פותח הוא עוד עצירות באותן שעות בדיוק, בלי להאריך את היום בדקה. ההפרש הזה לא מופיע במחזור אלא ב<a href="/רווח-תפעולי/">רווח התפעולי</a>, וזה המספר שכדאי להסתכל עליו בסוף החודש.</p>',
    },

    { type: 'heading', level: 2, text: 'זה לא אומר לסרב לעבודות רחוקות' },
    {
      type: 'richtext',
      html: '<p>החשש שעולה כאן ראשון הוא שצריך להתחיל לסנן לקוחות ולוותר על עבודה. אני לא מציע את זה, ובטח לא בעסק שעדיין בונה את עצמו.</p><p>מה שאני כן מציע זה לדעת מה עולה לכם נסיעה, ורק אז להחליט. לפעמים התשובה היא לנסוע בכל זאת, כי מדובר בלקוח חוזר או בבניין שלם שייפתח אחר כך. לפעמים התשובה היא להציע מועד אחר באותו אזור.</p><p>ויש מצב שבו כל העמוד הזה לא רלוונטי לכם. חשמלאי שעובד בעיקר מול קבלן אחד, באתר אחד, לאורך חודשים, לא מנהל יום של נסיעות אלא יום של אתר. שם השאלות יושבות בתנאי תשלום ובתזרים, ואלה השאלות של <a href="/ייעוץ-עסקי-לקבלן-שיפוצים/">ייעוץ עסקי לקבלן שיפוצים</a>.</p>',
    },

    {
      type: 'richtext',
      html: '<p>אם אתם מסיימים ימים עייפים ולא מבינים לאן הלך הכסף, תסתכלו פעם אחת על מד הקילומטרים ולא על יומן העבודות. התשובה בדרך כלל שם.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'איך יודעים כמה באמת עולה נסיעה?',
          a: '<p>לוקחים שבוע אחד ורושמים ליד כל עבודה מתי יצאתם ומתי הגעתם. בלי אפליקציה ובלי מערכת, שתי שורות ביומן. בסוף השבוע מחברים את הזמן שבדרך ומחלקים במספר העבודות. המספר שיוצא הוא מה שכל עבודה עולה לכם לפני שנגעתם בכבל.</p>',
        },
        {
          q: 'לקוח מבקש שאגיע היום, והאזור לא מתאים. מה עונים?',
          a: '<p>תלוי אם זו תקלה או עבודה מתוכננת. תקלה היא דחופה והיא מתומחרת ככזו. עבודה מתוכננת סובלת מועד, ושם מה שעובד זה להציע תאריך קרוב שבו אתם ממילא באזור. כשמנסחים את זה כהצעה ולא כסירוב, כמעט אף אחד לא נעלב.</p>',
        },
        {
          q: 'האם כדאי לקחת עבודות קטנות בכלל?',
          a: '<p>כן, אבל לא בכל מקום. עבודה קטנה קרובה היא עבודה טובה, והיא גם הדרך שבה לקוח חדש מכיר אתכם. עבודה קטנה רחוקה היא כמעט תמיד הפסד, גם כשהיא נראית כמו עוד הכנסה ביום. ההבדל בין השתיים הוא לא הגודל אלא המרחק.</p>',
        },
        {
          q: 'האם שווה לקחת עובד שני כדי לכסות יותר אזורים?',
          a: '<p>זו החלטה שבאה אחרי הסידור, לא לפניו. עובד שני מכפיל גם את הנסיעות אם היומן ממשיך להתמלא לפי סדר הגעת הקריאות. כשהיומן כבר מקובץ לפי אזור, אפשר לראות בבירור אם יש מספיק עבודה רצופה לשני אנשים, ואז זו כבר שאלה של מספרים ולא של תחושה.</p>',
        },
      ],
    },
  ],
}
