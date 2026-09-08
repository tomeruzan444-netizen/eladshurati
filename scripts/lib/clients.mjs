/**
 * The client pages — /לקוחות/ and a page per client.
 *
 * These are the first pages on the site that are not migrated 1:1 from
 * WordPress, so docs/content-guide.md governs them: first person, a 40-60 word
 * answer straight after the H1, no internal link in the opening paragraph,
 * two or three descriptive internal links spread down the page, a real call to
 * action at the end.
 *
 * What the guide also asks for — the challenge, the numbers, how long it took,
 * what was learned — is deliberately absent. None of that is recorded anywhere
 * in this project, and inventing a result for a named, real client on a site
 * that ranks is not a trade worth making. Every sentence here is either the
 * client's own description of their business or the work description the live
 * /פרוייקטים/ carousel already publishes. When Elad supplies the real story per
 * client, `story` on each entry in content/projects.json is where it goes.
 */
import { site, esc, icons, arrowChip } from './render.mjs'

export const clientPath = (p) => `/לקוחות/${p.slug}/`

const cta = (label) => `
      <section class="section section--cta">
        <div class="container">
          <div class="cta-panel reveal">
            <div>
              <h2>${esc(label)}</h2>
              <p>נדבר על העסק שלכם, על מה שעובד ועל מה שחסר - בלי התחייבות.</p>
            </div>
            <div class="cta-panel__actions">
              <a class="btn btn--primary" href="/צרו-קשר/">לשיחת ייעוץ חינם${icons.arrow}</a>
              <a class="btn btn--ghost" href="${site.whatsapp}" target="_blank" rel="noopener">וואטסאפ</a>
            </div>
          </div>
        </div>
      </section>`

/* ------------------------------------------------------------- index */

export function clientsIndexPage(projects, ctx) {
  const cards = projects
    .map(
      (p) => `<article class="client-card" data-tone="${esc(p.tone)}">
            <a class="client-card__link" href="${esc(clientPath(p))}">
              <span class="client-card__screen">
                <span class="client-card__bar" aria-hidden="true"><i></i><i></i><i></i><span></span></span>
                ${ctx.responsiveImage(p.image, {
                  alt: `האתר של ${p.name}`,
                  sizes: '(max-width: 760px) 84vw, (max-width: 1080px) 46vw, 30vw',
                  className: 'client-card__shot',
                  derivatives: ctx.derivatives,
                })}
              </span>
              <span class="client-card__body">
                <span class="client-card__tag">${esc(p.tag)}</span>
                <span class="client-card__name">${esc(p.name)}</span>
                <span class="client-card__text">${esc(p.summary)}</span>
                <span class="client-card__more">לעמוד הלקוח${arrowChip}</span>
              </span>
            </a>
          </article>`
    )
    .join('\n          ')

  return `
      <main id="main">
      <section class="page-hero">
        <div class="container page-hero__inner">
          <nav class="crumbs" aria-label="מיקום בעמוד">
            <a href="/">עמוד הבית</a><span aria-hidden="true">/</span><span aria-current="page">לקוחות</span>
          </nav>
          <h1>הלקוחות של אלעד שורתי</h1>
          <p class="page-hero__lead">עסקים שליוויתי - משרדי עורכי דין, מותגי קוסמטיקה, מרפאות וארגונים. לכל לקוח יש עמוד משלו עם התמונה של הפרויקט ומה שנבנה עבורו.</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="clients">
            ${cards}
          </div>
        </div>
      </section>
      ${cta('רוצים להיות הלקוח הבא?')}
      </main>`
}

/* ------------------------------------------------------------ client */

export function clientPage(p, ctx) {
  // The one-line answer the guide asks for right under the H1. Built from what
  // is known, so it stays short when little is known rather than padded.
  const quick = p.work
    ? `${p.name} הוא לקוח שלי. ${p.summary} עבור העסק הזה נבנה ${p.work}. בעמוד הזה אפשר לראות את הפרויקט, להיכנס לאתר החי, ולהבין איך אני עובד עם עסקים בתחום ה${p.tag}.`
    : `${p.name} הוא לקוח שלי. ${p.summary} בעמוד הזה אפשר לראות את הפרויקט ולהבין איך אני עובד עם עסקים בתחום ה${p.tag}.`

  const visit = p.url
    ? `<a class="btn btn--ghost" href="${esc(p.url)}" target="_blank" rel="noopener">לאתר של ${esc(p.name)}${icons.arrow}</a>`
    : ''

  return `
      <main id="main">
      <section class="page-hero">
        <div class="container page-hero__inner">
          <nav class="crumbs" aria-label="מיקום בעמוד">
            <a href="/">עמוד הבית</a><span aria-hidden="true">/</span><a href="/לקוחות/">לקוחות</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span>
          </nav>
          <span class="eyebrow">${esc(p.tag)}</span>
          <h1>${esc(p.name)}</h1>
          <p class="page-hero__lead">${esc(quick)}</p>
        </div>
      </section>

      <section class="section">
        <div class="container client-detail">
          <figure class="client-detail__shot" data-tone="${esc(p.tone)}">
            <span class="client-card__bar" aria-hidden="true"><i></i><i></i><i></i><span></span></span>
            ${ctx.responsiveImage(p.image, {
              alt: `האתר של ${p.name}`,
              sizes: '(max-width: 900px) 90vw, 620px',
              className: 'client-detail__img',
              derivatives: ctx.derivatives,
            })}
          </figure>

          <div class="client-detail__body flow">
            <h2>מי הלקוח</h2>
            <p>${esc(p.summary)}</p>

            ${p.work ? `<h2>מה נבנה</h2>\n            <p>${esc(p.work)}.</p>` : ''}

            <h2>איך אני עובד עם עסקים בתחום הזה</h2>
            <p>לכל תחום יש את הכללים שלו - מה שמביא פניות למשרד עורכי דין לא בהכרח עובד למרפאה או למותג קוסמטיקה. כתבתי בהרחבה על <a href="${esc(p.sector.href)}">${esc(p.sector.label)}</a>, ושם אפשר לראות איך התהליך נראה מהצד שלי.</p>
            <p>בפועל, רוב העבודה מתחילה לפני העיצוב: להבין את הלקוח של הלקוח, מה הוא מחפש ואיפה הוא מחפש. רק אחרי שזה ברור, נכנסים ל<a href="${esc(p.also.href)}">${esc(p.also.label)}</a>.</p>

            ${visit ? `<div class="client-detail__actions">${visit}</div>` : ''}
          </div>
        </div>
      </section>
      ${cta('רוצים תוצאה כזו לעסק שלכם?')}
      </main>`
}

/* --------------------------------------------------------------- seo */

export function clientSeo(p) {
  const url = `${site.origin}${encodeURI(clientPath(p))}`
  const title = `${p.name} | לקוחות אלעד שורתי`
  const description = p.work
    ? `${p.name} - ${p.work}. ${p.summary}`.slice(0, 158)
    : `${p.name} - לקוח של אלעד שורתי. ${p.summary}`.slice(0, 158)
  return {
    url,
    path: clientPath(p),
    title,
    description,
    robots: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
    canonical: url,
    og: {
      locale: 'he_IL',
      type: 'article',
      title,
      description,
      url,
      siteName: 'אלעד- יועץ ופיתוח עסקי',
      image: `${site.origin}${encodeURI(p.image)}`,
    },
    twitter: { card: 'summary_large_image', title, description },
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'עמוד הבית', item: `${site.origin}/` },
          { '@type': 'ListItem', position: 2, name: 'לקוחות', item: `${site.origin}/${encodeURI('לקוחות')}/` },
          { '@type': 'ListItem', position: 3, name: p.name, item: url },
        ],
      },
    ],
    headings: [],
    h1: p.name,
  }
}

export function clientsIndexSeo(projects) {
  const url = `${site.origin}/${encodeURI('לקוחות')}/`
  const title = 'הלקוחות של אלעד שורתי | תיק עבודות'
  const description =
    'עסקים שליוויתי - משרדי עורכי דין, מותגי קוסמטיקה, מרפאות וארגונים. לכל לקוח עמוד משלו עם תמונת הפרויקט ומה שנבנה עבורו.'
  return {
    url,
    path: '/לקוחות/',
    title,
    description,
    robots: 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
    canonical: url,
    og: {
      locale: 'he_IL',
      type: 'website',
      title,
      description,
      url,
      siteName: 'אלעד- יועץ ופיתוח עסקי',
      image: `${site.origin}${encodeURI(projects[0]?.image || '')}`,
    },
    twitter: { card: 'summary_large_image', title, description },
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url,
      },
    ],
    headings: [],
    h1: 'הלקוחות של אלעד שורתי',
  }
}
