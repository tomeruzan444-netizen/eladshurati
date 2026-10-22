/**
 * בניית אתר אינטרנט לחברת נדל"ן - written for the site, not migrated.
 *
 * Written to docs/writing-spec.md, requested by Tomer on 22.10.2026.
 *
 * Cannibalisation (section 10), and the real risk here is the two sibling
 * pages rather than the migrated ones: /בניית-אתרים-לאדריכלים/ owns the
 * portfolio-as-product problem and image weight, /בניית-אתרים-לאירועים/ owns
 * dates as inventory, price ranges and form fields. This page owns what
 * neither touches - inventory that changes state, where a page left saying
 * "למכירה" after a sale costs trust, and where the sold project is the proof
 * that sells the next one. Two audiences, buyers and owners, is also its own.
 *
 * No real-estate company exists in content/projects.json, so there is no
 * client story. The one piece of work named - an accessible brochure site for
 * real-estate and mortgage advisors - is described exactly as the portfolio
 * page on this site already describes it, and nothing is added to it.
 *
 * No legal claims about broker licensing or advertising rules: they were not
 * verified, so they are not made.
 *
 * Structure is an eighth kind: a lifecycle loop, after the circles, funnel,
 * timeline, quadrant, two-track flow, wireframe and branching tree.
 */
export default {
  path: '/בניית-אתר-לחברת-נדלן/',
  published: '2026-10-22T09:00:00+03:00',
  modified: '2026-10-22T09:00:00+03:00',
  title: 'בניית אתר אינטרנט לחברת נדל"ן | מלאי שמשתנה',
  description:
    'אתר של חברת נדל"ן מוכר מלאי שמשתנה כל הזמן. איך בונים עמוד פרויקט שמוכר, מה עושים עם פרויקט שנמכר, ולמה קונים ובעלי נכסים לא יכולים לחלוק עמוד אחד.',
  image: 'https://elad-digital.co.il/wp-content/uploads/2025/08/%D7%90%D7%9C%D7%A2%D7%93-%D7%A9%D7%95%D7%A8%D7%AA%D7%99-min-1-1024x683.webp',
  cta: {
    title: 'האתר שלכם מעודכן כמו המלאי?',
    text: 'בשיחה אחת אפשר לעבור על האתר של החברה, לראות איזה מידע חסר בעמודי הפרויקטים ואיפה פניות הולכות לאיבוד. בלי התחייבות.',
  },
  blocks: [
    { type: 'heading', level: 1, text: 'בניית אתר אינטרנט לחברת נדל"ן: המלאי משתנה, והאתר מסגיר' },
    {
      type: 'richtext',
      html: '<p>לחברת נדל"ן יש בעיה שאין כמעט לאף עסק אחר. המוצר שלה משתנה כל הזמן: פרויקט נפתח לשיווק, דירות נמכרות, נשארות אחרונות, ואז נגמר. האתר אמור לרוץ באותו קצב, ובפועל הוא כמעט תמיד מפגר אחריו.</p>',
    },
    {
      type: 'richtext',
      html: '<p>זה לא פרט טכני. קונה שמתקשר על דירה שנמכרה לפני חצי שנה לומד דבר אחד על החברה, והוא לא דבר טוב.</p>',
    },

    { type: 'heading', level: 2, text: 'מלאי שמשתנה, ואתר שצריך לעמוד בקצב' },
    {
      type: 'richtext',
      html: '<p>לכל פרויקט יש כמה מצבים, ולכל מצב יש תפקיד אחר באתר. "בקרוב" אוסף רשימת מתעניינים לפני שיש מה למכור. "בשיווק" הוא העמוד שעובד הכי קשה. "אחרונות" מייצר דחיפות אמיתית, כזו שלא צריך להמציא. ו"נמכר" הוא לא סוף הדרך אלא ההוכחה הבאה.</p>',
    },
    {
      type: 'figure',
      caption: 'מחזור החיים של עמוד פרויקט. המצב משתנה, העמוד נשאר - ופרויקט שנמכר הוא ההוכחה שמוכרת את הבא אחריו.',
      html: `<svg class="diagram__svg" viewBox="0 0 640 500" role="img" aria-labelledby="re-cycle-title re-cycle-desc">
  <title id="re-cycle-title">מחזור החיים של עמוד פרויקט באתר של חברת נדל"ן</title>
  <desc id="re-cycle-desc">ארבעה מצבים במעגל: בקרוב - אוסף רשימת מתעניינים. בשיווק - העמוד שעובד הכי קשה. אחרונות - דחיפות אמיתית. נמכר - נשאר באוויר כהוכחה. ומשם חוזרים לפרויקט הבא.</desc>
  <rect class="diagram__box" x="370" y="60" width="230" height="110" rx="14"/>
  <text class="diagram__step" x="485" y="105" text-anchor="middle">בקרוב</text>
  <text class="diagram__note" x="485" y="140" text-anchor="middle">אוסף רשימת מתעניינים</text>
  <rect class="diagram__box diagram__box--intent" x="370" y="320" width="230" height="110" rx="14"/>
  <text class="diagram__step" x="485" y="365" text-anchor="middle">בשיווק</text>
  <text class="diagram__note" x="485" y="400" text-anchor="middle">העמוד שעובד הכי קשה</text>
  <rect class="diagram__box diagram__box--intent" x="40" y="320" width="230" height="110" rx="14"/>
  <text class="diagram__step" x="155" y="365" text-anchor="middle">אחרונות</text>
  <text class="diagram__note" x="155" y="400" text-anchor="middle">דחיפות אמיתית</text>
  <rect class="diagram__box diagram__box--off" x="40" y="60" width="230" height="110" rx="14"/>
  <text class="diagram__step" x="155" y="105" text-anchor="middle">נמכר</text>
  <text class="diagram__note" x="155" y="140" text-anchor="middle">נשאר באוויר כהוכחה</text>
  <line class="diagram__axis" x1="485" y1="170" x2="485" y2="302"/>
  <polygon class="diagram__tip" points="485,320 475,300 495,300"/>
  <line class="diagram__axis" x1="370" y1="375" x2="288" y2="375"/>
  <polygon class="diagram__tip" points="270,375 290,365 290,385"/>
  <line class="diagram__axis" x1="155" y1="320" x2="155" y2="188"/>
  <polygon class="diagram__tip" points="155,170 145,190 165,190"/>
  <line class="diagram__axis" x1="270" y1="115" x2="352" y2="115"/>
  <polygon class="diagram__tip" points="370,115 350,105 350,125"/>
  <text class="diagram__head" x="320" y="235" text-anchor="middle">כל פרויקט שנמכר</text>
  <text class="diagram__head" x="320" y="268" text-anchor="middle">מוכר את הבא אחריו</text>
</svg>`,
    },
    {
      type: 'richtext',
      html: '<p>המסקנה המעשית פשוטה: לכל עמוד פרויקט צריך להיות מצב גלוי ותאריך עדכון. זה נשמע קטן, אבל זה ההבדל בין אתר שקונה סומך עליו לאתר שהוא מניח שהוא לא מעודכן - ואז הוא גם לא טורח להתקשר.</p>',
    },

    { type: 'heading', level: 2, text: 'שני קהלים שלא יכולים לחלוק עמוד אחד' },
    {
      type: 'richtext',
      html: '<p>רוב חברות הנדל"ן מדברות בפועל עם שני קהלים הפוכים. מצד אחד קונים, שמחפשים דירה ורוצים לדעת איפה, כמה ומתי. מצד שני בעלי נכסים או קרקע, שהחברה רוצה שיתקשרו אליה - בהתחדשות עירונית, בעסקאות קומבינציה או בנכסים למכירה.</p><p>השאלות שלהם לא נפגשות בשום נקודה. קונה שואל מה אני מקבל, בעל נכס שואל מה אתם לוקחים ומה אני מקבל בתמורה, וכמה זמן זה ייקח. כשמנסים לשרת את שניהם בעמוד אחד, נוצר עמוד כללי שלא משכנע אף אחד ולא נמצא בחיפוש של אף אחד.</p><p>הפתרון הוא מסלול נפרד לכל אחד, כבר מעמוד הבית, עם שפה ועם טופס משלו.</p>',
    },

    { type: 'heading', level: 2, text: 'מה חייב להיות בעמוד פרויקט' },
    {
      type: 'richtext',
      html: '<p>עמוד פרויקט הוא לא ברושור. זה המקום שבו מישהו מחליט אם להשקיע שעה בביקור במשרד המכירות:</p>',
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '<strong>מיקום אמיתי, לא רק שם שכונה.</strong> מפה, ומה יש סביב - תחבורה, חינוך, מסחר.',
        '<strong>מצב ותאריך עדכון.</strong> הדבר שהכי חסר, והכי זול להוסיף.',
        '<strong>תמהיל הדירות.</strong> כמה חדרים, אילו שטחים, מה נשאר.',
        '<strong>טווח מחירים או מה שמשפיע עליו.</strong> גם "החל מ" עדיף על שתיקה מוחלטת.',
        '<strong>לוח זמנים למסירה,</strong> ומה קורה אם הוא זז.',
        '<strong>מי עומד מאחורי הפרויקט.</strong> היזם, הקבלן המבצע, והפרויקטים הקודמים.',
        '<strong>מפרט ותוכניות דירה.</strong> אפשר לפתוח אותם לכולם ואפשר לבקש פרטים בתמורה, אבל כדאי להחליט במודע - גדר גבוהה מדי מבריחה דווקא את הרציניים.',
      ],
    },
    {
      type: 'richtext',
      html: '<p>ומה שעדיף להשאיר בחוץ: הבטחות תשואה ומספרים שאי אפשר לגבות. בעסקה בסדר גודל כזה, הבטחה שלא מתממשת נזכרת הרבה יותר מכל מצגת.</p><p>יש עוד סוג עמוד ששווה לבנות לצד עמודי הפרויקטים, והוא כמעט תמיד חסר: עמוד לכל אזור שבו אתם פעילים. אנשים מחפשים דירה לפי שכונה ולא לפי שם חברה, ועמוד אזור חי הרבה אחרי שהפרויקט הספציפי נמכר. הוא גם המקום הטבעי לרכז את מה שאתם יודעים על האזור.</p>',
    },

    { type: 'heading', level: 2, text: 'מה עושים עם פרויקט שנמכר' },
    {
      type: 'richtext',
      html: '<p>התגובה הנפוצה היא למחוק את העמוד. זו טעות כפולה. ראשית, העמוד הזה צבר דירוג וקישורים לאורך חודשים, ומחיקה מוחקת גם אותם. שנית, פרויקט שנמסר הוא בדיוק מה שקונה מחפש כשהוא בודק אם אפשר לסמוך עליכם.</p><p>מה שכן עובד: להשאיר את העמוד, לסמן עליו בבירור שהפרויקט נמכר או נמסר, להוסיף תמונות מהמבנה הגמור, ולהציע בתחתית את הפרויקט הפעיל הבא. ככה כל פרויקט שהסתיים ממשיך לעבוד, במקום להיעלם.</p>',
    },

    { type: 'heading', level: 2, text: 'מה קונה בודק לפני שהוא מרים טלפון' },
    {
      type: 'richtext',
      html: '<p>בסכומים האלה אף אחד לא פועל מהבטן. בין הביקור הראשון באתר לבין השיחה יש בדיקה שלמה, ורובה קורית בלי שתדעו עליה: מי החברה, מה היא בנתה, האם מסרה בזמן, ומה אנשים כותבים עליה.</p><p>האתר לא יכול לשלוט בכל זה, אבל הוא כן יכול לענות על החלק שלו. עמוד "עלינו" עם שמות ופנים, רשימת פרויקטים שהושלמו עם שנים, וגילוי כן גם לגבי עיכוב שקרה - שלושת אלה עושים יותר מכל סופרלטיב. השקיפות הזו היא גם מה שמבדיל חברה שעובדת לטווח ארוך.</p><p>מהירות, מובייל וטפסים מתנהגים כאן כמו בכל <a href="/בניית-אתרים/">אתר עסקי</a> אחר. השוני הוא באילו ספקות האתר נדרש לפזר. בתיק העבודות שלי יש גם אתר תדמית ליועצי נדל"ן ומשכנתא שנבנה עם דגש על נגישות, לצד <a href="/פרוייקטים/">פרויקטים נוספים</a>.</p>',
    },
    {
      type: 'richtext',
      html: '<p>ואם אתם גם בצד המבצע ולא רק המשווק, <a href="/ייעוץ-עסקי-לקבלנים/">ייעוץ עסקי לקבלנים</a> נוגע בשאלה שמגיעה אחרי המכירה: כמה באמת נשאר מכל פרויקט.</p>',
    },

    { type: 'heading', level: 2, text: 'שאלות על אתר לחברת נדל"ן' },
    {
      type: 'faq',
      items: [
        {
          q: 'צריך עמוד לכל פרויקט, או שמספיק עמוד אחד עם כולם?',
          a: '<p>עמוד לכל פרויקט. אנשים לא מחפשים חברת נדל"ן, הם מחפשים דירות באזור מסוים. עמוד אחד שמרכז הכל לא יכול להופיע בחיפושים האלה, וגם לא נותן מספיק מידע כדי להחליט. עמוד אחד מרכז עדיין שימושי, אבל כתוכן עניינים לפרויקטים.</p>',
        },
        {
          q: 'כמה פרטים על מחיר כדאי לפרסם?',
          a: '<p>לפחות טווח או נקודת התחלה, ואת מה שמזיז אותו - קומה, כיווני אוויר, תמהיל. מי שלא מוצא שום מספר מניח את הגבוה ביותר או פונה למתחרה שכן כתב. פרסום טווח גם חוסך פניות שלא היו מבשילות ממילא.</p>',
        },
        {
          q: 'אין לנו כרגע פרויקט בשיווק. מה שמים באתר?',
          a: '<p>בדיוק את מה שבונה את הפעם הבאה: פרויקטים שהושלמו, מי החברה, ואיך עובדים איתה. אפשר גם לפתוח עמוד "בקרוב" שאוסף רשימת מתעניינים. חברה שמתחילה לבנות נוכחות רק ביום שהפרויקט יוצא לשיווק מתחילה מאחור.</p>',
        },
      ],
    },
    {
      type: 'template',
      name: 'latest-posts',
      links: [
        { href: '/רווח-תפעולי/', text: '' },
        { href: '/טעויות-נפוצות-בניהול-תקציב/', text: '' },
        { href: '/מחזור-עסקי/', text: '' },
      ],
    },
  ],
}
