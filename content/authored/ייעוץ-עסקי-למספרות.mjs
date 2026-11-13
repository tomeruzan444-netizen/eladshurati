/**
 * ייעוץ עסקי למספרות - written for the site, not migrated from WordPress.
 *
 * Written to docs/writing-spec.md, requested by Tomer on 13.11.2026.
 *
 * Cannibalisation (section 10): nothing on the site covers hair salons. The
 * two hits for "מספרות" were both incidental - a list of complementary trades
 * on /ייעוץ-עסקי-לקוסמטיקאיות/, and the verb on /פרסום-ושיווק-לעורכי-דין/.
 *
 * The argument is scheduling geometry, and no other page makes it. A salon
 * sells chair time and pays for stylist time, and in a colour those two come
 * apart: the chair is held through the whole appointment while the stylist is
 * free in the middle. So the diary, not the price list, decides the day - and
 * the person filling it in is usually the least senior in the room.
 *
 * Deliberately NOT written, because a neighbouring page already owns it:
 *   - "same price, different cost to serve". That is the whole argument of
 *     /ייעוץ-עסקי-ליועצי-מס/. The distinction here is sequencing, not cost:
 *     what the day earns depends on the order things are placed in.
 *   - A capacity ceiling with hours held, cancelled and unsold. That is
 *     /ייעוץ-עסקי-לפסיכולוגים/ and its week grid.
 *   - Stock sitting on a shelf paid for in advance. /ייעוץ-עסקי-לאופטיקה/.
 *   - Priced work against unpriced work. /ייעוץ-עסקי-לצלמים/.
 *   - Clients belonging to the person rather than the business, as a question
 *     of what the business is worth. /ייעוץ-עסקי-לרואי-חשבון/. It appears here
 *     only as a routing problem inside the diary, which is a different claim.
 *
 * Shape: two time tracks for one appointment, read right to left. Not on the
 * list of seventeen shapes already in use - the nearest, the hotel page's two
 * paths, compares two alternative routes for one booking. These two tracks are
 * simultaneous and time-aligned, which is the whole point.
 *
 * Two internal links, not three. A third was drafted to /קורס-מכירות/ off the
 * "whoever answers the phone" paragraph and dropped: it reads as a sale, and
 * rule 9 forbids a link placed to produce SEO. Both links that stayed earn
 * their sentence, and /ייעוץ-עסקי-לפתיחת-עסק/ was an orphan until this one.
 *
 * Address: אתם. The voice guide's אתן exception is for a field that is
 * overwhelmingly women; hairdressing is not, on either side of the chair.
 *
 * E-E-A-T: Elad has never said he works with salons, so there is no client,
 * no case and no result here. Judgements are marked as judgements. This is the
 * eighth sector page in that position - finding 9ה.
 *
 * Numbers: none. No minutes, no percentages, no prices. The figure carries
 * proportion and says so in its caption.
 */
export default {
  path: '/ייעוץ-עסקי-למספרות/',
  published: '2026-11-13T15:00:00+02:00',
  modified: '2026-11-13T15:00:00+02:00',
  title: 'ייעוץ עסקי למספרות | היומן קובע יותר מהמחירון',
  description:
    'במספרה חלק מהתור הוא זמן שבו הכיסא תפוס ואתם פנויים. מי שקובע את התורים מחליט מה קורה לזמן הזה, בדרך כלל בלי לדעת שזו החלטה עסקית.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'כמה מהיום שלכם הוא זמן שכבר שולם עליו?',
    text: 'נפתח יחד שבוע אחד ביומן ונסמן את הקטעים שבהם הכיסא תפוס ואתם לא. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי למספרות: הכיסא תפוס, אתם פנויים' },
    {
      type: 'richtext',
      html: '<p>יומן מלא וחודש בינוני הם לא סתירה, ובמספרה הם קורים יחד כל הזמן. הסיבה לא יושבת במחירון, והיא גם לא במתחרה שפתח ממול. היא יושבת בצורה שבה היום מסודר, ובמי שמסדר אותו.</p>',
    },
    {
      type: 'richtext',
      html: '<p>מספרה מוכרת זמן של כיסא ומשלמת על זמן של אדם. בחלק מהשירותים שני הזמנים האלה נפרדים לגמרי, וההפרש ביניהם לא נרשם בשום מקום.</p>',
    },

    { type: 'heading', level: 2, text: 'למה יומן מלא לא אומר חודש טוב' },
    {
      type: 'richtext',
      html: '<p>קחו צבע. הלקוחה יושבת בכיסא זמן ארוך, ואתם עובדים עליה רק בחלק ממנו. בהתחלה יש מריחה, בסוף יש שטיפה וסידור, ובאמצע החומר פועל והיא יושבת עם הטלפון. הכיסא תפוס לכל אורך הדרך. אתם לא.</p><p>תספורת היא ההפך הגמור: אתם עסוקים בכל דקה, והכיסא מתפנה מהר.</p><p>ביומן שתי הפעולות נראות אותו דבר, משבצת שתופסת שורה. בפועל אחת מהן מכילה חור והשנייה לא.</p>',
    },
    {
      type: 'figure',
      caption:
        'הרצועות מצוירות לפי יחס ולא לפי שעון. מה שהתרשים טוען הוא דבר אחד: באמצע התור הכיסא עדיין תפוס ואתם כבר לא, וזה הקטע שכבר שולם עליו.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 430" role="img" aria-labelledby="salon-time-title salon-time-desc">
  <title id="salon-time-title">הכיסא תפוס לכל אורך התור, ואתם פנויים באמצע</title>
  <desc id="salon-time-desc">שתי רצועות זמן זו מתחת לזו, לאותו תור צבע אחד, שנקראות מימין לשמאל. הרצועה העליונה היא הכיסא, והיא מלאה מתחילת התור ועד סופו. הרצועה התחתונה היא אתם, והיא מחולקת לשלושה חלקים: מריחה בתחילת התור, סידור בסופו, ובאמצע קטע מקווקו שבו החומר פועל ואתם פנויים. מתחת לקטע האמצעי מסומנת תספורת שיכולה להיכנס אליו, עם חץ שמצביע כלפי מעלה.</desc>

  <text class="diagram__eyebrow" x="620" y="40" text-anchor="start">תור אחד של צבע</text>
  <text class="diagram__head" x="620" y="76" text-anchor="start">אותו זמן, שני משאבים</text>
  <rect class="diagram__rule" x="554" y="88" width="66" height="5" rx="2.5"/>

  <text class="diagram__note" x="500" y="136" text-anchor="start">תחילת התור</text>
  <text class="diagram__note" x="70" y="136" text-anchor="end">סוף התור</text>

  <rect class="diagram__band" x="70" y="150" width="430" height="50" rx="8"/>
  <text class="diagram__note" x="285" y="182" text-anchor="middle">תפוס לכל אורך התור</text>
  <text class="diagram__step" x="620" y="186" text-anchor="start">הכיסא</text>

  <rect class="diagram__band" x="390" y="260" width="110" height="50" rx="8"/>
  <rect class="diagram__cell diagram__cell--open" x="190" y="260" width="200" height="50" rx="8"/>
  <rect class="diagram__band" x="70" y="260" width="120" height="50" rx="8"/>
  <text class="diagram__step" x="620" y="296" text-anchor="start">אתם</text>

  <text class="diagram__note" x="445" y="292" text-anchor="middle">מריחה</text>
  <text class="diagram__note" x="290" y="292" text-anchor="middle">החומר פועל</text>
  <text class="diagram__note" x="130" y="292" text-anchor="middle">סידור</text>

  <polygon class="diagram__tip--alert" points="290,318 272,342 308,342"/>
  <rect class="diagram__band diagram__band--end" x="200" y="348" width="180" height="48" rx="8"/>
  <text class="diagram__note" x="290" y="379" text-anchor="middle">תספורת</text>
</svg>`,
    },
    {
      type: 'richtext',
      html: '<p>על הקטע האמצעי כבר שולם - השכירות רצה, העמדה תפוסה, והלקוחה יושבת. בניגוד להעלאת מחיר, אף אחד לא צריך לשלם עליו יותר.</p><p>לא בכל מקצוע ביופי זה עובד ככה. בקליניקה של קוסמטיקאית הטיפול הוא בלוק אחד שבו המטפלת נוכחת כמעט בכל דקה, ולכן השאלות שם מתחילות במקום אחר - תמחור, חזרה של לקוחות וניהול הזמן שבין הטיפולים. כתבתי עליהן בעמוד על <a href="/ייעוץ-עסקי-לקוסמטיקאיות/">ייעוץ עסקי לקוסמטיקאיות</a>.</p>',
    },

    { type: 'heading', level: 2, text: 'מי קובע בפועל כמה המספרה תכניס' },
    {
      type: 'richtext',
      html: '<p>ברוב המספרות התורים נקבעים לפי כלל אחד: המשבצת הפנויה הראשונה. הוא מהיר, הוא הוגן כלפי הלקוחה, והוא גם מה שמוחק את החור.</p><p>מי שעונה לטלפון מקבל כאן החלטה עסקית, בדרך כלל בלי לדעת. לפעמים זו עובדת שנכנסה החודש, ולפעמים זו אפליקציה שמציגה ללקוחה את כל המשבצות הפנויות ונותנת לה לבחור לבד. לדעתי זו ההחלטה היקרה ביותר במספרה שנמסרת למי שהכי פחות מתוגמל עליה.</p>',
    },
    {
      type: 'table',
      html: '<table><thead><tr><th>הכלל שלפיו נקבע תור</th><th>מה הוא עושה ליום</th></tr></thead><tbody><tr><td>המשבצת הפנויה הראשונה</td><td>היום מתמלא מהבוקר קדימה. זמני ההמתנה נשארים ריקים, ומי שרוצה צבע אחר הצהריים לא מוצאת מקום.</td></tr><tr><td>לפי אורך השירות</td><td>תספורות נכנסות לתוך זמני ההמתנה של הצבעים. אותו צוות, אותן שעות, יותר ראשים ביום.</td></tr><tr><td>לפי מי שביקשו</td><td>אחת עמוסה שבועיים קדימה ולשנייה יש חורים. זה כלל של שירות, הוא עולה כסף, ולפעמים הוא בכל זאת הנכון.</td></tr></tbody></table>',
    },

    { type: 'heading', level: 2, text: 'הביטול של תשע בבוקר' },
    {
      type: 'richtext',
      html: '<p>ביטול ברגע האחרון הוא לא אותו אירוע בכל שירות. צבע שמתבטל פותח בור ארוך באמצע היום, וביום שכבר התחיל אי אפשר למלא בור כזה - אנשים לא מתפנים בהתראה של שעה. תספורת שמתבטלת פותחת חור קצר, ולפעמים מישהו נכנס אליו.</p><p>ההפרש בין השניים הוא לא בכסף אלא בצורה, ולכן מדיניות ביטולים אחידה מתייחסת לשני אירועים שונים לגמרי כאילו הם אותו אירוע, והיא גם נשמעת ללקוחות שרירותית.</p>',
    },

    { type: 'heading', level: 2, text: 'אחת עמוסה, והעמדה לידה ריקה' },
    {
      type: 'richtext',
      html: '<p>לקוחות מבקשות מי שתטפל בהן וזה טבעי לגמרי, והתוצאה היא שבאותה מספרה יש מי שעמוסה שבועיים קדימה ומי שיש לה חורים בכל יום. במספרה קוראים לזה "היא החזקה", ומשאירים את זה ככה.</p><p>התור הראשון שלקוחה חדשה מקבלת הוא שקובע למי היא שייכת בשנים הבאות. זו החלטה שמתקבלת בשלושים שניות בטלפון, ולרוב בלי שאף אחד חשב עליה כעל החלטה.</p><p>ומספר העמדות עצמו נקבע עוד לפני שהמספרה נפתחה. זה אחד הדברים היקרים ביותר לשנות בדיעבד, ולכן הוא שייך לשלב שלפני - כתבתי עליו בעמוד על <a href="/ייעוץ-עסקי-לפתיחת-עסק/">ייעוץ עסקי לפתיחת עסק</a>.</p>',
    },

    { type: 'heading', level: 2, text: 'לא, זה לא אומר לדחוס לקוחות' },
    {
      type: 'richtext',
      html: '<p>החשש הראשון שעולה כשמתחילים לדבר על סידור היום הוא שהמספרה תהפוך לפס ייצור. אני לא מציע לקצר אף טיפול, לא למהר אף לקוחה ולא להוסיף לכם דקה אחת של עבודה. ההצעה הפוכה: למלא זמן שממילא עומד ריק.</p><p>ויש מספרות שזה לא מתאים להן. סלון קטן שבנוי על לקוחה אחת בכל פעם, בלי המתנה ובלי רעש, מוכר בדיוק את השקט הזה. שם החור הוא המוצר ולא בזבוז, ואם זו המספרה שלכם - אל תיגעו בה.</p><p>אני גם לא בא מצד המקצוע: איך לצבוע, באיזה חומר ובאיזה סדר - זה התחום שלכם ולא שלי. מה שאפשר לעשות מבחוץ זה להסתכל על היום כעל רצועה של זמן, ולשאול כמה ממנה באמת נמכרה.</p>',
    },

    {
      type: 'richtext',
      html: '<p>פתחו מחר את היומן והסתכלו עליו פעם אחת לא כרשימת שמות אלא כרצועה של זמן. החורים יקפצו לעיניים, ואחרי שראיתם אותם כבר קשה להפסיק.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'כמה זמן מראש כדאי לפתוח את היומן להזמנות?',
          a: '<p>רחוק מספיק כדי שצבעים ייכנסו, קרוב מספיק כדי שיישאר מרחב לסדר. צבע מתוכנן שבועות מראש, ותספורת נקבעת לפעמים באותו בוקר. אם היומן פתוח חודשיים קדימה והכול נתפס לפי סדר הגעה, שום כלל סידור כבר לא יעזור.</p>',
        },
        {
          q: 'האם לגבות דמי ביטול?',
          a: '<p>פחות חשוב אם, יותר חשוב שזה לא יהיה אחיד. ביטול של תור ארוך פותח בור שלא נסגר, וביטול של תור קצר לא. מדיניות שמבחינה בין השניים מובנת ללקוחות הרבה יותר מקנס שווה לכולם.</p>',
        },
        {
          q: 'לקוחה מבקשת מישהי מסוימת שעמוסה. מה עונים?',
          a: '<p>לא "אין מקום". מה שעובד זה להגיד באותו משפט שני דברים: מועד מאוחר יותר אצל מי שביקשה, ומועד קרוב אצל מישהי אחרת. ככה היא בוחרת בין שתי אפשרויות ולא בין כן ולא.</p>',
        },
        {
          q: 'מי צריך לקבוע את התורים?',
          a: '<p>פחות משנה מי, ומשנה מאוד לפי איזה כלל. מי שקובעת בין לקוחה ללקוחה תבחר את המשבצת הקרובה, כי זה מה שאפשר לעשות בשלושים שניות. ברגע שיש כלל כתוב - מה נכנס לתוך זמני המתנה ומה לא - גם הבחירה הנכונה לוקחת שלושים שניות.</p>',
        },
      ],
    },
  ],
}
