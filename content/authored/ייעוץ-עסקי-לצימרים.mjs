/**
 * ייעוץ עסקי לצימרים - written for the site, not migrated from WordPress.
 *
 * Written to docs/content-guide.md, requested by Tomer on 24.11.2026. The
 * "כללים לעמודים חדשים" section governs, and section 4א was checked against
 * the finished copy: no spaced hyphen, no em dash, no "זה לא X, זה Y", no
 * heading opening on a number, no announce-before-content, none of the listed
 * words. One kind of apostrophe throughout (the straight ').
 *
 * Cannibalisation (section 10): nothing on the site is about running a zimmer.
 * "צימר" appears on one page, /בניית-אתר-לבית-מלון/, once, in an FAQ answer
 * about booking forms. That page owns the OTA commission and the direct
 * booking; this one mentions the commission in one sentence and links there
 * rather than re-arguing it.
 *
 * The argument: a zimmer earns per night and pays per arrival. Cleaning,
 * linen, the hot tub, heating the unit and the owner's own hours come with
 * every check-in whatever the length of stay. So the real pricing levers are
 * the minimum stay, the orphan night, and what to do midweek, more than the
 * nightly rate.
 *
 * Deliberately NOT written, because a neighbouring page already owns it:
 *   - The OTA commission and winning back the booking. /בניית-אתר-לבית-מלון/.
 *   - "The year is not evenly spread" as a spine. /שיווק-רואי-חשבון/ owns the
 *     year timeline, and the tax advisers page dropped seasonality for that
 *     reason. Holidays appear here in one FAQ answer only, about the minimum.
 *   - Same price, different cost to serve because of the client.
 *     /ייעוץ-עסקי-ליועצי-מס/. Here the cost differs with the length of stay,
 *     not with who the guest is.
 *   - Unpriced work that trails a delivered job. /ייעוץ-עסקי-לצלמים/. The
 *     turnover is a fixed cost per arrival and is argued as a pricing-policy
 *     question, not as hidden hours.
 *   - A capacity ceiling drawn as a week grid. /ייעוץ-עסקי-לפסיכולוגים/. That
 *     is why the figure is not a calendar.
 *
 * Shape: a decision tree with real branch labels, on reference.md's list of
 * shapes not yet used. The events page has a branching visitor flow, which
 * describes what visitors do; this tree is a decision the owner makes, with a
 * yes/no on every branch and an action on every leaf. It is also the one part
 * of the page a reader can apply the same day without hiring anyone.
 *
 * Three outbound links: the hotel page (commission), operating profit, and
 * the family-business page (a zimmer in the couple's own yard).
 *
 * Address: אתם. Couples run most of these together; not a women-majority field.
 *
 * E-E-A-T: Elad has never said he works with zimmer owners. No client, no
 * case, no result, no occupancy figure, no price. The experience anchor is
 * written about owner-run businesses where the owner does the work himself,
 * the widest claim the material supports. Eleventh sector page in that
 * position. Finding 9ה.
 *
 * Regulation deliberately NOT touched: business licensing for tourist
 * accommodation, VAT and income tax on short-term rental, consumer
 * cancellation rules. A cancellation-policy FAQ was drafted and dropped
 * because Israeli consumer law governs cancellations and it was not checked
 * against the primary text.
 *
 * Numbers: none. The figure carries structure only and its caption says so.
 */
export default {
  path: '/ייעוץ-עסקי-לצימרים/',
  published: '2026-11-24T09:15:00+02:00',
  modified: '2026-11-24T09:15:00+02:00',
  title: 'ייעוץ עסקי לצימרים | מינימום לילות, לילה יתום ואמצע השבוע',
  description:
    'צימר מרוויח לפי לילה ומשלם לפי הגעה. מה זה משנה במינימום הלילות, מה עושים עם לילה יתום, ומתי נכון להשאיר את אמצע השבוע סגור.',
  // JPEG on purpose: X's cards do not render WebP.
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/01/%D7%90%D7%9C%D7%A2%D7%93.jpg',
  cta: {
    title: 'כמה נשאר לכם מכל הגעה?',
    text: 'בשיחה אחת נעבור על חודש של הזמנות ונחשב מה נשאר מכל כניסה. אם יתברר שהיומן שלכם בנוי נכון, גם את זה תשמעו ממני.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'ייעוץ עסקי לצימרים: מוכרים לילות, משלמים על כל הגעה' },
    {
      type: 'richtext',
      html: '<p>צימר מרוויח לפי לילה ומשלם לפי הגעה. ניקיון, כביסה, הג\'קוזי והשעות שלכם מגיעים עם כל זוג שנכנס, בלי קשר לכמה לילות הוא נשאר. לכן ייעוץ עסקי לצימר מתחיל אצלי ביומן ההזמנות: אילו לילות אתם מוכרים, באיזה אורך שהייה, ומה עולה לכם כל כניסה עוד לפני שהאורח הדליק את האור.</p>',
    },
    {
      type: 'richtext',
      html: '<p>יומן מלא נראה כמו הצלחה. אבל שבוע של חמש הזמנות קצרות יכול להשאיר פחות כסף משבוע של שתי הזמנות ארוכות, ושניהם ייראו מלאים באותה מידה.</p>',
    },

    { type: 'heading', level: 2, text: 'מה עולה כניסה אחת' },
    {
      type: 'richtext',
      html: '<p>את המחיר ללילה כולם מכירים. את עלות ההגעה כמעט אף אחד לא מחשב. היא כוללת את כל מה שקורה בין אורח לאורח: מצעים ומגבות, ניקיון מלא, החלפת המים בג\'קוזי, חימום או קירור של היחידה לפני שמגיעים, והסלסלה שמחכה על השולחן. כל זה קורה פעם אחת להזמנה, בין שהיא ללילה אחד ובין שהיא לארבעה.</p><p>החלק שהכי נעלם הוא הזמן שלכם. בעסקים שבעלי הבית עושים בהם הכול בעצמם, התבנית שחוזרת אצלי היא שהעבודה הזאת נספרת כחינם. אף אחד לא שילם עליה משכורת, אז היא לא מופיעה בשום חשבון. וכך ההזמנה הקצרה נראית רווחית יותר ממה שהיא.</p><p>הבדיקה לוקחת ערב אחד. קחו חודש, חלקו את ההכנסה במספר ההגעות ולא במספר הלילות, והורידו את מה שעולה כניסה אחת, כולל השעות שלכם. המספר שיוצא קרוב הרבה יותר ל<a href="/רווח-תפעולי/">רווח תפעולי</a> של הצימר מכל אחוז תפוסה.</p>',
    },

    { type: 'heading', level: 2, text: 'מינימום הלילות הוא החלטת מחיר' },
    {
      type: 'richtext',
      html: '<p>הרבה צימרים כבר מבקשים מינימום של שני לילות בסוף השבוע. רובם מתייחסים לזה כנוהל. אני רואה בזה את כלי התמחור החזק ביותר שיש לכם, חזק יותר מהמחיר ללילה, כי הוא קובע כמה פעמים בשבוע תשלמו על כניסה.</p><p>ההיגיון פשוט. הזמנה של שישי לבד חוסמת גם את חמישי וגם את שבת. אם שבת לא תימכר לבד, החלפתם הזמנה ארוכה בקצרה, ושילמתם על הניקיון אותו דבר.</p><p>את אותו כלל לא כדאי למתוח על כל השבוע. באמצע השבוע מינימום של שני לילות מסנן החוצה בדיוק את מי שהיה ממלא לילה ריק.</p>',
    },

    { type: 'heading', level: 2, text: 'הלילה היתום, והכלל שצריך לשבור בשבילו' },
    {
      type: 'richtext',
      html: '<p>זוג אחד יוצא ביום שלישי בבוקר. הזוג הבא מגיע ביום רביעי. באמצע נשאר לילה אחד ריק, ובמינימום של שני לילות אף אחד לא יכול להזמין אותו. זה לילה יתום.</p><p>אני ממליץ לפתוח לילות כאלה ידנית להזמנה של לילה אחד, גם כשהם נופלים בסוף השבוע. לילה יתום לא יימכר בשום דרך אחרת. כל הזמנה שמכסה את עלות הכניסה עדיפה עליו ריק.</p>',
    },
    {
      type: 'figure',
      caption:
        'שלוש שאלות על כל בקשה ללילה אחד, לפי הסדר. התרשים מראה סדר החלטה ולא נתונים: אין בו מחירים ואין בו אחוזי תפוסה.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 670" role="img" aria-labelledby="zim-tree-title zim-tree-desc">
  <title id="zim-tree-title">בקשה ללילה אחד: מתי לקבל, מתי לשמור ומתי להציע לילה נוסף</title>
  <desc id="zim-tree-desc">עץ החלטה. בקשה ללילה אחד עוברת שלוש שאלות לפי הסדר. אם הלילה תקוע בין שתי הזמנות, פותחים אותו, אחרת הוא יישאר ריק. אם לא, ואם זה לילה של סוף שבוע, שומרים אותו למינימום של שני לילות. אם זה לילה של אמצע השבוע ומחירו מכסה כניסה שלמה, מקבלים. אם לא, מציעים לילה נוסף או מחיר אחר ללילה בודד.</desc>

  <text class="diagram__eyebrow" x="610" y="40" text-anchor="start">בקשה שנכנסה ליומן</text>
  <text class="diagram__head" x="610" y="76" text-anchor="start">לילה אחד: לקבל או לא</text>
  <rect class="diagram__rule" x="544" y="88" width="66" height="5" rx="2.5"/>

  <rect class="diagram__bar" x="350" y="112" width="260" height="52" rx="12"/>
  <text class="diagram__barlabel" x="480" y="146" text-anchor="middle">בקשה ללילה אחד</text>
  <line class="diagram__axis" x1="480" y1="164" x2="480" y2="188"/>
  <polygon class="diagram__tip" points="473,186 487,186 480,196"/>

  <rect class="diagram__box diagram__box--surface" x="350" y="196" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="480" y="228" text-anchor="middle">לילה בודד בין</text>
  <text class="diagram__head" x="480" y="258" text-anchor="middle">שתי הזמנות?</text>

  <line class="diagram__axis" x1="350" y1="234" x2="300" y2="234"/>
  <polygon class="diagram__tip--alert" points="300,227 300,241 290,234"/>
  <text class="diagram__note" x="320" y="222" text-anchor="middle">כן</text>
  <rect class="diagram__box diagram__box--intent" x="30" y="196" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="160" y="228" text-anchor="middle">לפתוח אותו</text>
  <text class="diagram__note" x="160" y="258" text-anchor="middle">אחרת הוא יישאר ריק</text>

  <line class="diagram__axis" x1="480" y1="272" x2="480" y2="312"/>
  <polygon class="diagram__tip" points="473,310 487,310 480,320"/>
  <text class="diagram__note" x="508" y="302" text-anchor="middle">לא</text>

  <rect class="diagram__box diagram__box--surface" x="350" y="320" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="480" y="366" text-anchor="middle">לילה של סוף שבוע?</text>

  <line class="diagram__axis" x1="350" y1="358" x2="300" y2="358"/>
  <polygon class="diagram__tip" points="300,351 300,365 290,358"/>
  <text class="diagram__note" x="320" y="346" text-anchor="middle">כן</text>
  <rect class="diagram__box" x="30" y="320" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="160" y="352" text-anchor="middle">לשמור למינימום</text>
  <text class="diagram__note" x="160" y="382" text-anchor="middle">שני לילות לפחות</text>

  <line class="diagram__axis" x1="480" y1="396" x2="480" y2="436"/>
  <polygon class="diagram__tip" points="473,434 487,434 480,444"/>
  <text class="diagram__note" x="508" y="426" text-anchor="middle">לא</text>

  <rect class="diagram__box diagram__box--surface" x="350" y="444" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="480" y="476" text-anchor="middle">המחיר מכסה</text>
  <text class="diagram__head" x="480" y="506" text-anchor="middle">כניסה שלמה?</text>

  <line class="diagram__axis" x1="350" y1="482" x2="300" y2="482"/>
  <polygon class="diagram__tip" points="300,475 300,489 290,482"/>
  <text class="diagram__note" x="320" y="470" text-anchor="middle">כן</text>
  <rect class="diagram__box" x="30" y="444" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="160" y="476" text-anchor="middle">לקבל</text>
  <text class="diagram__note" x="160" y="506" text-anchor="middle">ההזמנה מכסה את עצמה</text>

  <line class="diagram__axis" x1="480" y1="520" x2="480" y2="560"/>
  <polygon class="diagram__tip" points="473,558 487,558 480,568"/>
  <text class="diagram__note" x="508" y="550" text-anchor="middle">לא</text>

  <rect class="diagram__box" x="350" y="568" width="260" height="76" rx="12"/>
  <text class="diagram__head" x="480" y="600" text-anchor="middle">להציע לילה נוסף</text>
  <text class="diagram__note" x="480" y="630" text-anchor="middle">או מחיר ללילה בודד</text>
</svg>`,
    },

    { type: 'heading', level: 2, text: 'אמצע השבוע, בלי לחלק הנחות' },
    {
      type: 'richtext',
      html: '<p>בסוף השבוע הצימר מוכר את עצמו. אמצע השבוע הוא המקום שבו העסק נמדד.</p><p>התגובה הראשונה היא כמעט תמיד הנחה, ואני לא אוהב אותה כצעד ראשון. הנחה קבועה על ימי חול מלמדת את האורחים לחכות לה. זוג שהיה מגיע בשישי במחיר מלא עובר לשלישי במחיר מופחת, והלילה של שישי צריך עכשיו קונה אחר.</p><p>מה שעובד יותר הוא לבדוק מי בכלל פנוי באמצע השבוע, ולבנות הצעה בשבילו. תעברו על ההזמנות של ימי החול מהשנה האחרונה ותראו מי הזמין. לפעמים אלה זוגות שלקחו יום חופש, לפעמים זוגות שהילדים שלהם כבר יצאו מהבית. לכל אחד מהם אפשר להוסיף משהו במקום להוריד: לילה שלישי במחיר אחר, או יציאה מאוחרת שלא עולה לכם כלום כשאף אחד לא נכנס אחריהם.</p><p>תבדקו גם מאיזה ערוץ ההזמנות האלה מגיעות. לילה אחד באמצע השבוע, דרך אתר הזמנות שגובה עמלה, עם עלות כניסה מלאה, הוא לפעמים ההזמנה הכי דקה ביומן. את שאלת העמלה פירקתי בעמוד על <a href="/בניית-אתר-לבית-מלון/">בניית אתר לבית מלון</a>, והיא נכונה לצימר באותה מידה.</p>',
    },

    { type: 'heading', level: 2, text: 'כשהדבר הנכון הוא להשאיר את היחידה סגורה' },
    {
      type: 'richtext',
      html: '<p>החשש הטבעי כאן הוא שיועץ יגיד לכם למלא כל לילה, והבית יהפוך לבית מלון. אני לא מציע את זה.</p><p>יש צימרים שבהם הדבר הנכון הוא לא לפתוח את אמצע השבוע בכלל. אם כניסה אחת עולה לכם בוקר שלם של עבודה, ומה שתקבלו על לילה של יום שלישי בקושי מכסה אותה, לילה סגור הוא החלטה עסקית לגיטימית. בעיקר אם יש לכם עבודה נוספת, או שאתם גרים מטר מהיחידה ושווה לכם לילה בלי אורחים.</p><p>וכשהיחידה יושבת בחצר של הבית ושני בני הזוג עובדים בה, החשבון גולש מהכסף אל הבית. מי מנקה, מי עונה לטלפון בעשר בלילה ומי מקבל על זה שכר הן שאלות של <a href="/ייעוץ-עסקי-לעסק-משפחתי/">ייעוץ עסקי לעסק משפחתי</a> לא פחות משהן שאלות של תמחור.</p>',
    },

    {
      type: 'richtext',
      html: '<p>אם הצימר מלא כל סוף שבוע ובסוף החודש לא ברור לאן הלך הכסף, תפסיקו לספור לילות ותתחילו לספור החלפות מצעים.</p>',
    },

    {
      type: 'faq',
      items: [
        {
          q: 'כדאי לגבות דמי ניקיון בנפרד מהמחיר ללילה?',
          a: '<p>זה הופך את עלות הכניסה לגלויה, ולכן הזמנה קצרה מתומחרת נכון מעצמה. החיסרון הוא שאורח שמשווה מחירים נבהל מתוספת שמופיעה בסוף. אם גובים, מציגים אותה כבר במחיר הראשון שהוא רואה. החלופה היא מחיר ללילה גבוה יותר להזמנה של לילה אחד, שעושה את אותו דבר בלי שורה נוספת בחשבון.</p>',
        },
        {
          q: 'בחגים הכול מלא ממילא. מה יש לשנות שם?',
          a: '<p>את המינימום, לפני המחיר. כשהביקוש גדול מהיחידות, אתם יכולים לבחור את אורך השהייה, ושלושה לילות של זוג אחד עדיפים על שלושה זוגות של לילה אחד. מחיר גבוה יותר עם אותו מינימום משאיר אתכם עם אותו מספר החלפות, רק עם אורחים שמצפים ליותר.</p>',
        },
        {
          q: 'יש לי שתי יחידות. כדאי לבנות שלישית?',
          a: '<p>קודם בודקים מה קורה לשתיים הקיימות באמצע השבוע. יחידה שלישית מוסיפה מקום בסוף השבוע, וגם עוד יחידה ריקה ביום שלישי ועוד ניקיון בכל החלפה. אם אתם דוחים זוגות בסופי שבוע באופן קבוע, יש על מה לדבר. והשאלה הראשונה בדיון הזה היא מי ינקה אותה.</p>',
        },
      ],
    },
  ],
}
