/**
 * Shell, chrome and block renderers.
 *
 * Rule for this file: anything under seo.* is reproduced byte-for-byte from the
 * live site. Design decides how content is arranged, never what it says.
 */
import { icons, social } from './icons.mjs'

export const site = {
  name: 'אלעד שורתי',
  tagline: 'יעוץ עסקי • שיווק • אסטרטגיה',
  origin: 'https://elad-digital.co.il',
  phone: '052-707-5029',
  phoneHref: 'tel:0527075029',
  email: 'eladshurati131@gmail.com',
  whatsapp: 'https://wa.me/972527075029?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%97%D7%AA%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%9C%D7%A2%D7%A1%D7%A7%20%D7%A9%D7%9C%D7%99',
  instagram: 'https://www.instagram.com/elad_shurati',
  facebook: 'https://www.facebook.com/eladshurati/',
}

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Site-relative path -> path used by the static build (keeps the live URL shape). */
export const hrefFor = (p) => {
  if (!p) return '#'
  if (/^(https?:|mailto:|tel:|#)/.test(p)) return p
  return p
}

/* ------------------------------------------------------------------ head */

export function head({ seo, extraCss = '', bodyClass = '', preload = '', cssUrl = '/assets/css/site.css' }) {
  const jsonld = (seo.jsonld || [])
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join('\n    ')

  // On a staging host the whole build must stay out of the index; the live
  // robots value is only emitted for the real deploy.
  const staging = process.env.STAGING === '1'

  const metas = [
    seo.description && `<meta name="description" content="${esc(seo.description)}">`,
    staging
      ? '<meta name="robots" content="noindex, nofollow">'
      : seo.robots && `<meta name="robots" content="${esc(seo.robots)}">`,
    seo.canonical && `<link rel="canonical" href="${esc(seo.canonical)}">`,
    seo.og.locale && `<meta property="og:locale" content="${esc(seo.og.locale)}">`,
    seo.og.type && `<meta property="og:type" content="${esc(seo.og.type)}">`,
    seo.og.title && `<meta property="og:title" content="${esc(seo.og.title)}">`,
    seo.og.description && `<meta property="og:description" content="${esc(seo.og.description)}">`,
    seo.og.url && `<meta property="og:url" content="${esc(seo.og.url)}">`,
    seo.og.siteName && `<meta property="og:site_name" content="${esc(seo.og.siteName)}">`,
    seo.og.image && `<meta property="og:image" content="${esc(seo.og.image)}">`,
    seo.og.updatedTime && `<meta property="og:updated_time" content="${esc(seo.og.updatedTime)}">`,
    seo.articleModified && `<meta property="article:modified_time" content="${esc(seo.articleModified)}">`,
    seo.twitter.card && `<meta name="twitter:card" content="${esc(seo.twitter.card)}">`,
    seo.twitter.title && `<meta name="twitter:title" content="${esc(seo.twitter.title)}">`,
    seo.twitter.description && `<meta name="twitter:description" content="${esc(seo.twitter.description)}">`,
    seo.twitter.image && `<meta name="twitter:image" content="${esc(seo.twitter.image)}">`,
  ]
    .filter(Boolean)
    .join('\n    ')

  return `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(seo.title)}</title>
    ${metas}
    <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
    ${preload}
    <link rel="preload" href="/assets/fonts/plex-hebrew-400-hebrew.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/plex-hebrew-700-hebrew.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${cssUrl}">
    <meta name="theme-color" content="#2b0038">
    <script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')</script>
    ${extraCss}
    ${jsonld}
  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ''}>
    <a class="skip-link" href="#main">דלג לתוכן הראשי</a>`
}

/* ---------------------------------------------------------------- header */

export function header(nav, currentPath) {
  const items = nav.header
    .filter((it, i, arr) => arr.findIndex((x) => x.label === it.label) === i)
    .map((item, i) => {
      const hasKids = item.children?.length
      // Dropdown parents all point at "/", so only leaf links can be "current".
      const current = !hasKids && item.href === currentPath ? ' aria-current="page"' : ''
      const caret = hasKids
        ? '<svg class="nav__caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m2.5 4.5 3.5 3.5 3.5-3.5"/></svg>'
        : ''
      const panel = hasKids
        ? `<ul class="nav__panel">${item.children
            .map((c) => `<li><a href="${esc(hrefFor(c.href))}">${esc(c.label)}</a></li>`)
            .join('')}</ul>`
        : ''
      return `<li class="nav__item"${hasKids ? ` data-dropdown="${i}"` : ''}>
              <a class="nav__link" href="${esc(hrefFor(item.href))}"${current}${
                hasKids ? ' aria-expanded="false" aria-haspopup="true"' : ''
              }>${esc(item.label)}${caret}</a>${panel}
            </li>`
    })
    .join('\n            ')

  return `
    <header class="header" data-menu="closed">
      <div class="container header__inner">
        <a class="brand" href="/" aria-label="${esc(site.name)} — לעמוד הבית">
          <img class="brand__mark" src="/assets/brand/mark-duotone.svg" alt="" width="42" height="40">
          <img class="brand__word" src="/assets/brand/wordmark-dark.png" alt="${esc(site.name)}" width="240" height="34">
        </a>
        <button class="header__toggle" type="button" aria-label="תפריט" aria-expanded="false" aria-controls="site-nav"><span></span></button>
        <nav class="nav" id="site-nav" aria-label="ניווט ראשי">
          <ul class="nav__list">
            ${items}
          </ul>
          <div class="nav__mobile-cta">
            <a class="btn btn--primary" href="/צרו-קשר/">לשיחת ייעוץ חינם</a>
          </div>
        </nav>
        <a class="btn btn--primary btn--sm header__cta" href="/צרו-קשר/">לשיחת ייעוץ חינם ${icons.arrow.replace('<svg', '<svg class="btn__arrow" width="17" height="17"')}</a>
      </div>
    </header>`
}

/* ---------------------------------------------------------------- footer */

export function footer(nav, groups, jsUrl = '/assets/js/site.js') {
  const col = (title, links) => `
          <div>
            <h3>${esc(title)}</h3>
            <ul>${links
              .map((l) => `<li><a href="${esc(hrefFor(l.href))}">${esc(l.label)}</a></li>`)
              .join('')}</ul>
          </div>`

  return `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <img src="/assets/brand/wordmark-white.png" alt="${esc(site.name)}" width="280" height="40" loading="lazy">
            <p class="footer__about">${esc(site.tagline)}</p>
            <div class="footer__social">
              <a href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="וואטסאפ">${social.whatsapp}</a>
              <a href="${site.instagram}" target="_blank" rel="noopener" aria-label="אינסטגרם">${social.instagram}</a>
              <a href="${site.facebook}" target="_blank" rel="noopener" aria-label="פייסבוק">${social.facebook}</a>
            </div>
          </div>
          ${col('שירותים', groups.services)}
          ${col('ייעוץ לפי תחום', groups.sectors)}
          ${col('מידע', groups.info)}
        </div>
        <div class="footer__bar">
          <p>© ${new Date().getFullYear()} ${esc(site.name)}. כל הזכויות שמורות.</p>
          <nav class="footer__legal" aria-label="מידע משפטי">
            <a href="/מדיניות-פרטיות/">מדיניות פרטיות</a>
            <a href="/תנאי-שימוש/">תנאי שימוש</a>
            <a href="/הצהרת-נגישות/">הצהרת נגישות</a>
          </nav>
        </div>
      </div>
    </footer>
    <a class="wa" href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="שליחת הודעת וואטסאפ">${social.whatsapp}</a>
    <script src="${jsUrl}" defer></script>
  </body>
</html>`
}


/* ------------------------------------------------------- images */

/**
 * A <picture> with AVIF + WebP srcset and a sized fallback, built from the
 * derivatives table. Falls back to a plain <img> for anything not processed
 * (SVGs, or images added after the last optimise run).
 */
export function responsiveImage(src, opts = {}) {
  const {
    alt = '', sizes = '100vw', className = '', loading = 'lazy',
    priority = false, derivatives = {}, width, height,
  } = opts
  const d = derivatives[src]
  const cls = className ? ` class="${className}"` : ''
  const prio = priority
    ? ' fetchpriority="high" decoding="async"'
    : ` loading="${loading}" decoding="async"`

  if (!d) {
    const dim = width && height ? ` width="${width}" height="${height}"` : ''
    return `<img${cls} src="${esc(src)}" alt="${esc(alt)}"${dim}${prio}>`
  }

  const set = (list) => list.map((c) => `${c.url} ${c.w}w`).join(', ')
  const fb = d.fallback
  const ratioH = Math.round((d.height * fb.w) / d.width)
  const sources = []
  if (d.avif?.length) sources.push(`<source type="image/avif" srcset="${set(d.avif)}" sizes="${sizes}">`)
  if (d.webp?.length) sources.push(`<source type="image/webp" srcset="${set(d.webp)}" sizes="${sizes}">`)

  return `<picture>${sources.join('')}<img${cls} src="${fb.url}" alt="${esc(alt)}" width="${fb.w}" height="${ratioH}"${prio}></picture>`
}

/** Preload hint matching the srcset a <picture> will choose — for the LCP image. */
export function preloadImage(src, { sizes, derivatives = {} }) {
  const d = derivatives[src]
  if (!d) return ''
  const list = d.avif?.length ? d.avif : d.webp
  const type = d.avif?.length ? 'image/avif' : 'image/webp'
  if (!list?.length) return ''
  const set = list.map((c) => `${c.url} ${c.w}w`).join(', ')
  return `<link rel="preload" as="image" type="${type}" imagesrcset="${esc(set)}" imagesizes="${esc(sizes)}" fetchpriority="high">`
}

/* ---------------------------------------------------------------- blocks */

/**
 * Alt text, in order: what the page markup had, then whatever the WordPress
 * media library still holds for that file. Never invented here.
 */
export function altFor(b, ctx = {}) {
  if (b.alt && b.alt.trim()) return b.alt
  const map = ctx.altMap || {}
  const rec = map[b.src] || map[String(b.src).replace(/-\d+x\d+(?=\.\w+$)/, '')]
  return (rec?.alt || rec?.title || '').trim()
}

const localImg = (src, manifest) => {
  const hit = manifest[src]
  return hit || src
}

/** Rewrite absolute uploads URLs inside migrated HTML to the local copies. */
export function rewriteHtml(html, manifest) {
  if (!html) return ''
  let out = html
  for (const [remote, local] of Object.entries(manifest)) {
    if (out.includes(remote)) out = out.split(remote).join(local)
  }
  return out
}

/** Stable, readable anchor for a heading (used by the section rail). */
export function slugify(text) {
  return String(text)
    .trim()
    .replace(/["'׳״.,:;!?()]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

/** Some H2s in the migrated copy are pull-quotes wrapped in quotation marks. */
const isQuote = (t = '') => /^["“”״']/.test(t.trim()) && /["“”״']$/.test(t.trim())

export function renderBlock(b, ctx) {
  const { manifest } = ctx
  switch (b.type) {
    case 'heading': {
      const lvl = Math.min(Math.max(b.level, 2), 6)
      const cls = lvl === 2 && isQuote(b.text) ? ' class="is-quote"' : ''
      const id = lvl === 2 && !isQuote(b.text) ? ` id="${esc(slugify(b.text))}"` : ''
      return `<h${lvl}${id}${cls}>${esc(b.text)}</h${lvl}>`
    }
    case 'richtext':
      return rewriteHtml(b.html, manifest)
    case 'list': {
      const tag = b.ordered ? 'ol' : 'ul'
      return `<${tag}>${b.items.map((i) => `<li>${rewriteHtml(i, manifest)}</li>`).join('')}</${tag}>`
    }
    case 'quote':
      return `<blockquote>${rewriteHtml(b.html, manifest)}</blockquote>`
    case 'table':
      return `<div class="table-wrap">${rewriteHtml(b.html, manifest)}</div>`
    case 'image': {
      if (!b.src) return ''
      const img = responsiveImage(b.src, {
        alt: altFor(b, ctx),
        sizes: '(max-width: 820px) 92vw, 720px',
        derivatives: ctx.derivatives || {},
        width: b.width,
        height: b.height,
      })
      return b.caption ? `<figure>${img}<figcaption>${esc(b.caption)}</figcaption></figure>` : img
    }
    case 'faq':
      return renderFaq(b, ctx)
    case 'iconlist':
      return `<ul class="linklist">${b.items
        .map(
          (i) =>
            `<li>${i.href ? `<a href="${esc(hrefFor(i.href))}">${esc(i.text)}</a>` : `<a>${esc(i.text)}</a>`}</li>`
        )
        .join('')}</ul>`
    case 'card':
      return renderCard(b, ctx)
    case 'button':
      return `<p><a class="btn btn--primary" href="${esc(hrefFor(b.href))}">${esc(b.text)}</a></p>`
    case 'video':
      return b.src
        ? `<div class="table-wrap"><iframe src="${esc(b.src)}" title="וידאו" loading="lazy" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:16px"></iframe></div>`
        : ''
    case 'unknown':
      return rewriteHtml(b.html, manifest)
    default:
      return ''
  }
}

export function renderFaq(b) {
  return `<div class="faq">${b.items
    .map(
      (i) => `<details class="faq__item">
      <summary class="faq__q">${esc(i.q)}</summary>
      <div class="faq__a">${i.a || ''}</div>
    </details>`
    )
    .join('')}</div>`
}

const CARD_ICONS = [icons.website, icons.ads, icons.sales, icons.strategy, icons.growth, icons.consulting, icons.target, icons.users]

export function renderCard(b, ctx = {}) {
  const i = ctx.index ?? 0
  const icon = CARD_ICONS[i % CARD_ICONS.length]
  const title = b.title || b.cta || ''
  const link = b.href
  const rv = ctx.reveal ? ' reveal' : ''
  return `<article class="card${rv}">
      <span class="card__icon">${icon}</span>
      <h3 class="card__title">${link ? `<a href="${esc(hrefFor(link))}">${esc(title)}</a>` : esc(title)}</h3>
      <p class="card__text">${esc(b.text || '')}</p>
      ${link ? `<span class="card__more">לפרטים נוספים ${icons.arrowSmall}</span>` : ''}
    </article>`
}

/* ------------------------------------------------------------ prose flow */

/**
 * Render a run of blocks as an article. Consecutive cards are collected into a
 * grid and FAQ blocks break out of the prose column, so long landing pages get
 * rhythm instead of one endless text wall.
 */
export function renderFlow(blocks, ctx) {
  const out = []
  let prose = []
  let cards = []

  const flushProse = () => {
    if (!prose.length) return
    out.push(`<div class="prose">${prose.join('\n')}</div>`)
    prose = []
  }
  const flushCards = () => {
    if (!cards.length) return
    out.push(
      `<div class="grid grid--${cards.length >= 4 ? '4' : '3'}">${cards
        .map((c, i) => renderCard(c, { ...ctx, index: i }))
        .join('')}</div>`
    )
    cards = []
  }

  for (const b of blocks) {
    if (b.type === 'card') {
      flushProse()
      cards.push(b)
      continue
    }
    flushCards()

    if (b.type === 'faq') {
      flushProse()
      out.push(`<div class="faq-wrap">${renderFaq(b)}</div>`)
      continue
    }
    if (b.type === 'iconlist') {
      flushProse()
      out.push(renderBlock(b, ctx))
      continue
    }
    prose.push(renderBlock(b, ctx))
  }
  flushCards()
  flushProse()
  return out.filter(Boolean).join('\n')
}

/* ------------------------------------------------------------ crumbs/cta */

export function crumbs(trail) {
  return `<nav class="crumbs" aria-label="מיקום באתר"><ol>${trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<li><span aria-current="page">${esc(t.label)}</span></li>`
        : `<li><a href="${esc(hrefFor(t.href))}">${esc(t.label)}</a></li>`
    )
    .join('')}</ol></nav>`
}

export function ctaSection({ title, text, primary = 'לשיחת ייעוץ חינם', href = '/צרו-קשר/' } = {}) {
  return `
    <section class="section">
      <div class="container">
        <div class="cta">
          <span class="eyebrow eyebrow--on-dark">בואו נדבר</span>
          <h2>${esc(title || 'זה הזמן למנף את העסק שלך')}</h2>
          <p>${esc(text || 'אשמח לפגוש אותך וללמוד הכל על העסק שלך. התקשרו אלי, כתבו לי מייל או שלחו לי ווטסאפ.')}</p>
          <div class="cta__actions">
            <a class="btn btn--on-dark" href="${esc(href)}">${esc(primary)} ${icons.arrow.replace('<svg', '<svg class="btn__arrow" width="18" height="18"')}</a>
            <a class="btn btn--ghost-dark" href="${site.whatsapp}" target="_blank" rel="noopener">וואטסאפ ${site.phone}</a>
          </div>
        </div>
      </div>
    </section>`
}

export { icons, social }
