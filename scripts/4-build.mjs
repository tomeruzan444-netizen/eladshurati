/**
 * Step 4 — Generate the static site.
 *
 * Reads content/*.json (migrated 1:1) and writes site/ with the same URL shape
 * the live site uses, so nothing about the address of a page changes.
 */
import { readFile, writeFile, mkdir, cp, rm, readdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import {
  site, esc, head, header, footer, renderBlock, renderFlow, renderFaq, renderCard,
  crumbs, ctaSection, hrefFor, rewriteHtml, slugify, responsiveImage, preloadImage, icons, social,
} from './lib/render.mjs'
import { minifyCss, minifyHtml } from './lib/minify.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'site')
const read = async (f) => JSON.parse(await readFile(path.join(ROOT, 'content', f), 'utf8'))
const RAW = process.env.RAW === '1'   // skip minification when debugging output

/* ---------------------------------------------------------------- helpers */

const stripTags = (h = '') => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

/** site path -> output file */
function outFile(p) {
  const clean = p.replace(/^\/|\/$/g, '')
  return clean ? path.join(OUT, clean, 'index.html') : path.join(OUT, 'index.html')
}

const byPath = (pages) => Object.fromEntries(pages.map((p) => [p.seo.path, p]))

/** PNG intrinsic size straight from the IHDR chunk, so the hero reserves the right box. */
async function pngSize(file) {
  const buf = await readFile(file)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

/* ------------------------------------------------------------------- home */

function homePage(page, ctx) {
  const b = page.blocks
  const at = (i) => b[i] || {}
  const headings = b.filter((x) => x.type === 'heading')

  // Hero — the live page carries two H1s; the brand-name one becomes a kicker
  // so the page keeps every word but ends up with a single H1.
  const kicker = at(0).text
  const title = at(1).text
  const sub = at(2).text
  const heroCta = b.find((x) => x.type === 'button')

  // The six "client" logos on the live page are the theme's placeholder brands
  // (Adlero, NIMON, LORTU, xorit, Remark, ALPHA), not real clients — dropped at
  // Tomer's request. They stay in content/pages.json, so putting a genuine
  // logo strip back is a template change, not a re-migration.
  const intro = b.slice(5, 8).filter((x) => x.type === 'richtext' || x.type === 'heading')
  const promiseHead = at(8)
  const promiseList = b.find((x) => x.type === 'iconlist')
  const servicesHead = at(10)
  const serviceCards = b.slice(11, 15).filter((x) => x.type === 'card')
  const beliefs = b.slice(15, 18).filter((x) => x.type === 'heading')
  const moreHead = at(18)
  const moreCards = b.slice(19, 23).filter((x) => x.type === 'card')
  const closingHead = headings.find((h) => h.text?.includes('למנף'))
  const form = b.find((x) => x.type === 'form')

  return `
    <main id="main">
      <section class="hero">
        <svg class="hero__ribbons" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="ribbon" d="M40 100 L74 0 L100 0 L100 100 Z" fill="#60DADB"/>
        </svg>
        <svg class="hero__hairlines" viewBox="0 0 200 200" preserveAspectRatio="xMaxYMin meet" aria-hidden="true" focusable="false">
          <g stroke="#0B1024" stroke-opacity=".18" stroke-width="1">
            <path d="M150 14 V96"/><path d="M158 14 V96"/><path d="M166 14 V96"/>
            <path d="M174 14 V96"/><path d="M182 14 V96"/><path d="M190 14 V96"/>
          </g>
        </svg>
        <div class="container hero__grid">
          <div class="hero__copy hero-intro">
            <p class="hero__eyebrow" style="--i:0">${esc(kicker)}${icons.arrowDown}</p>
            <h1 class="hero__title" data-split-lines style="--i:1">${esc(title)}</h1>
            ${sub ? `<p class="hero__lead" style="--i:2">${esc(sub)}</p>` : ''}
            <div class="hero__actions" style="--i:3">
              <a class="btn btn--primary" href="/צרו-קשר/">${esc(heroCta?.text || 'לשיחת ייעוץ חינם')} ${icons.arrow.replace('<svg', '<svg class="btn__arrow" width="18" height="18"')}</a>
              <a class="btn btn--ghost" href="#services">השירותים שלי</a>
            </div>
          </div>
          <figure class="hero__figure reveal reveal--near is-in">
            ${responsiveImage('/assets/brand/portrait-cutout.png', {
              alt: 'אלעד שורתי, יועץ עסקי ודיגיטלי',
              sizes: '(max-width: 900px) 84vw, 520px',
              className: 'hero__portrait',
              priority: true,
              derivatives: ctx.derivatives,
            })}
            <img class="hero__spark" src="/assets/brand/mark-navy.svg" alt="" aria-hidden="true" width="62" height="59">
          </figure>
        </div>
        <div class="hero__strip">
            <ul>
              <li>${icons.chart}<span>שיווק דיגיטלי <br> ממוקד תוצאות</span></li>
              <li>${icons.target}<span>ייעוץ <br> עסקי</span></li>
              <li>${icons.growth}<span>אסטרטגיית <br> צמיחה</span></li>
            </ul>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="sec-head reveal">
            <span class="eyebrow">למה אני</span>
            <h2>${esc(at(5).text || 'צמיחה, יעילות ורווחיות')}</h2>
          </div>
          <div class="grid grid--2 reveal" style="margin-block-start:2.25rem">
            <div class="prose">${intro.filter((x) => x.type === 'richtext').map((x) => rewriteHtml(x.html, ctx.manifest)).join('')}</div>
            <div class="card" style="gap:1.25rem">
              <h3 class="card__title">${esc(promiseHead.text || '')}</h3>
              ${promiseList ? `<ul class="linklist" style="grid-template-columns:1fr">${promiseList.items
                .map((i) => `<li><a>${esc(i.text)}</a></li>`).join('')}</ul>` : ''}
            </div>
          </div>
        </div>
      </section>

      ${serviceCards.length ? `<section class="section section--mist" id="services">
        <div class="container">
          <div class="sec-head sec-head--center reveal">
            <span class="eyebrow">השירותים שלי</span>
            <h2>${esc(servicesHead.text || '')}</h2>
          </div>
          <div class="grid grid--4" data-stagger="80" style="margin-block-start:2.75rem">
            ${serviceCards.map((c, i) => renderCard(c, { ...ctx, index: i, reveal: true })).join('\n            ')}
          </div>
        </div>
      </section>` : ''}

      ${beliefs.length ? `<section class="section">
        <div class="container">
          <div class="panel panel--statement reveal reveal--soft">
            ${beliefs[2] ? `<span class="eyebrow eyebrow--on-dark">${esc(beliefs[2].text)}</span>` : ''}
            <h2>${esc(beliefs[0]?.text || '')}</h2>
            ${beliefs[1] ? `<p class="panel__lead">${esc(beliefs[1].text)}</p>` : ''}
          </div>
        </div>
      </section>` : ''}

      ${moreCards.length ? `<section class="section">
        <div class="container">
          <div class="sec-head reveal">
            <span class="eyebrow">עוד בתחום</span>
            <h2>${esc(moreHead.text || '')}</h2>
          </div>
          <div class="grid grid--2" data-stagger="90" style="margin-block-start:2.25rem">
            ${moreCards.map((c, i) => renderCard(c, { ...ctx, index: i + 4, reveal: true })).join('\n            ')}
          </div>
        </div>
      </section>` : ''}

      ${ctx.latestPosts()}

      <section class="section section--mist" id="contact">
        <div class="container contact-grid">
          <div>
            <span class="eyebrow">בואו נעבוד יחד</span>
            <h2 style="margin-block-start:1.1rem">${esc(closingHead?.text || 'זה הזמן למנף את העסק שלכם')}</h2>
            ${ctx.contactList()}
          </div>
          ${ctx.formCard(form)}
        </div>
      </section>
    </main>`
}

/* ---------------------------------------------------------------- landing */

function landingPage(page, ctx) {
  const b = [...page.blocks]
  const h1 = b.find((x) => x.type === 'heading' && x.level === 1)
  if (h1) b.splice(b.indexOf(h1), 1)

  // First paragraph doubles as the page lead.
  const leadIdx = b.findIndex((x) => x.type === 'richtext')
  let lead = ''
  if (leadIdx > -1 && leadIdx < 3) {
    lead = stripTags(b[leadIdx].html)
    if (lead.length > 40) b.splice(leadIdx, 1)
    else lead = ''
  }

  const related = b.filter((x) => x.type === 'template').flatMap((x) => x.links || [])
  const body = b.filter((x) => x.type !== 'template' && x.type !== 'postlist' && x.type !== 'form')
  const form = page.blocks.find((x) => x.type === 'form')

  return `
    <div class="progress" aria-hidden="true"></div>
    <main id="main">
      <section class="page-hero">
        <div class="container page-hero__inner">
          ${crumbs([{ label: 'עמוד הבית', href: '/' }, { label: h1?.text || page.seo.title }])}
          <h1>${esc(h1?.text || page.seo.title)}</h1>
          ${lead ? `<p class="page-hero__lead">${esc(lead)}</p>` : ''}
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="article">
            <div class="article__main">${renderFlow(body, ctx)}</div>
            ${ctx.rail(body, Boolean(form))}
          </div>
        </div>
      </section>

      ${related.length ? `<section class="section section--tight section--mist">
        <div class="container">
          <div class="sec-head reveal"><span class="eyebrow">להמשך קריאה</span><h2 style="font-size:var(--step-3)">מאמרים נוספים</h2></div>
          <ul class="linklist" style="margin-block-start:1.5rem">
            ${[...new Map(related.map((l) => [l.href, l])).values()]
              .map((l) => `<li><a href="${esc(hrefFor(l.href))}">${esc(ctx.titleFor(l.href) || l.text)}</a></li>`)
              .filter(Boolean)
              .join('')}
          </ul>
        </div>
      </section>` : ''}

      ${form ? `<section class="section section--mist" id="contact">
        <div class="container contact-grid">
          <div>
            <span class="eyebrow">בואו נדבר</span>
            <h2 style="margin-block-start:1.1rem">נשמח לשמוע על העסק שלכם</h2>
            ${ctx.contactList()}
          </div>
          ${ctx.formCard(form)}
        </div>
      </section>` : ctaSection()}
    </main>`
}

/* ------------------------------------------------------------------- post */

function postPage(page, ctx) {
  const b = [...page.blocks]
  const h1 = b.find((x) => x.type === 'heading' && x.level === 1)
  if (h1) b.splice(b.indexOf(h1), 1)
  // The blog template repeats the title as an H2 right below the H1.
  const dupe = b.findIndex((x) => x.type === 'heading' && x.text === h1?.text)
  if (dupe > -1) b.splice(dupe, 1)
  // …and prefixes every post with a bare "בלוג" label, which the breadcrumb covers.
  if (b[0]?.type === 'heading' && /^בלוג$/.test((b[0].text || '').trim())) b.shift()
  const body = b.filter((x) => x.type !== 'template' && x.type !== 'postlist')

  const date = page.lastmod ? new Date(page.lastmod) : null
  const dateStr = date
    ? date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return `
    <div class="progress" aria-hidden="true"></div>
    <main id="main">
      <section class="page-hero">
        <div class="container container--narrow page-hero__inner">
          ${crumbs([
            { label: 'עמוד הבית', href: '/' },
            { label: 'בלוג עסקי', href: '/category/בלוג-עסקי-מקצועי/' },
            { label: h1?.text || page.seo.title },
          ])}
          <h1>${esc(h1?.text || page.seo.title)}</h1>
          ${dateStr ? `<p class="post-card__meta"><time datetime="${esc(page.lastmod)}">${esc(dateStr)}</time></p>` : ''}
        </div>
      </section>
      <article class="section">
        <div class="container container--narrow">
          ${renderFlow(body, ctx)}
        </div>
      </article>
      ${ctx.latestPosts('עוד מהבלוג')}
      ${ctaSection()}
    </main>`
}

/* ---------------------------------------------------------------- archive */

function archivePage(page, ctx) {
  const h1 = page.blocks.find((x) => x.type === 'heading' && x.level === 1)
  return `
    <div class="progress" aria-hidden="true"></div>
    <main id="main">
      <section class="page-hero">
        <div class="container page-hero__inner">
          ${crumbs([{ label: 'עמוד הבית', href: '/' }, { label: h1?.text || page.seo.title }])}
          <h1>${esc(h1?.text || 'בלוג עסקי — מקצועי')}</h1>
          ${page.seo.description ? `<p class="page-hero__lead">${esc(page.seo.description)}</p>` : ''}
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="grid grid--3" data-stagger="70">${ctx.postCards(99)}</div>
        </div>
      </section>
      ${ctaSection()}
    </main>`
}

/* ------------------------------------------------------------------ build */

const main = async () => {
  const pages = await read('pages.json')
  const nav = await read('nav.json')
  const manifestList = await read('media-manifest.json')
  const altMap = existsSync(path.join(ROOT, 'content', 'media-alt.json')) ? await read('media-alt.json') : {}

  const manifest = Object.fromEntries(manifestList.filter((m) => m.local).map((m) => [m.url, m.local]))
  const derivatives = existsSync(path.join(ROOT, 'content', 'image-derivatives.json'))
    ? await read('image-derivatives.json')
    : {}
  const lookup = byPath(pages)

  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const posts = pages
    .filter((p) => p.type === 'post' && p.seo.path !== '/info-articles/')
    .sort((a, b) => String(b.lastmod).localeCompare(String(a.lastmod)))

  const portrait = await pngSize(path.join(ROOT, 'assets', 'brand', 'portrait-cutout.png'))

  const ctx = {
    manifest,
    altMap,
    derivatives,
    portrait,
    img(src) {
      if (src?.startsWith('/wp-content/')) return manifest[site.origin + src] || src
      return manifest[src] || src
    },
    postCards(limit = 3) {
      return posts
        .slice(0, limit)
        .map((p) => {
          const h1 = p.blocks.find((x) => x.type === 'heading' && x.level === 1)
          const img = p.blocks.find((x) => x.type === 'image' && x.src && !x.src.includes('gstatic'))
          const lead = stripTags(p.blocks.find((x) => x.type === 'richtext')?.html || '').slice(0, 130)
          const d = p.lastmod ? new Date(p.lastmod).toLocaleDateString('he-IL', { year: 'numeric', month: 'long' }) : ''
          return `<article class="post-card reveal">
            ${img ? `<div class="post-card__media">${responsiveImage(img.src, {
              alt: img.alt || '',
              sizes: '(max-width: 700px) 92vw, 380px',
              derivatives: ctx.derivatives,
            })}</div>` : ''}
            <div class="post-card__body">
              ${d ? `<p class="post-card__meta">${esc(d)}</p>` : ''}
              <h3 class="post-card__title"><a href="${esc(p.seo.path)}">${esc(h1?.text || p.seo.title)}</a></h3>
              <p class="card__text">${esc(lead)}…</p>
            </div>
          </article>`
        })
        .join('\n            ')
    },
    latestPosts(title = 'מהבלוג העסקי') {
      if (!posts.length) return ''
      return `
      <section class="section">
        <div class="container">
          <div class="sec-head reveal"><span class="eyebrow">ידע מקצועי</span><h2>${esc(title)}</h2></div>
          <div class="grid grid--3" data-stagger="90" style="margin-block-start:2.25rem">
            ${ctx.postCards(3)}
          </div>
        </div>
      </section>`
    },
    /**
     * The heading of the page a path points at. Used for the "related reading"
     * links, whose anchor text in the source is unusable escaped markup.
     */
    titleFor(href) {
      if (!href) return ''
      const target = lookup[href] || lookup[href.replace(/\/?$/, '/')]
      if (!target) return ''
      const h1 = target.blocks.find((b) => b.type === 'heading' && b.level === 1)
      return h1?.text || target.seo.title || ''
    },
    /** Sticky rail: section links built from the page's own H2s, plus a CTA. */
    rail(blocks, hasForm) {
      const h2s = blocks.filter(
        (b) => b.type === 'heading' && b.level === 2 && !/^["“”״']/.test((b.text || '').trim())
      )
      const toc = h2s.length >= 3
        ? `<nav class="toc" aria-label="בעמוד הזה">
              <h2>בעמוד הזה</h2>
              <ol>${h2s
                .slice(0, 9)
                .map((h) => `<li><a href="#${esc(slugify(h.text))}">${esc(h.text)}</a></li>`)
                .join('')}</ol>
            </nav>`
        : ''
      // A page that already ends in a contact form does not need the rail to
      // repeat the same call to action — on the contact page it echoed the H1.
      const cta = hasForm
        ? ''
        : `<div class="rail-cta">
              <h2>זה הזמן למנף את העסק שלך</h2>
              <p>אשמח לפגוש אותך וללמוד הכל על העסק שלך</p>
              <a class="btn btn--on-dark btn--sm" href="/צרו-קשר/">לשיחת ייעוץ חינם</a>
            </div>`
      if (!toc && !cta) return ''
      return `<aside class="article__rail reveal reveal--near">
            ${toc}
            ${cta}
          </aside>`
    },
    contactList() {
      // Labels only — no claims (hours, response times) that the live site never made.
      return `<ul class="contact-list">
            <li><span class="ico">${icons.phone}</span><div><a href="${site.phoneHref}">${esc(site.phone)}</a><span>טלפון</span></div></li>
            <li><span class="ico">${icons.mail}</span><div><a href="mailto:${site.email}">${esc(site.email)}</a><span>אימייל</span></div></li>
            <li><span class="ico">${social.whatsapp.replace('<svg', '<svg width="19" height="19"')}</span><div><a href="${site.whatsapp}" target="_blank" rel="noopener">${esc(site.phone)}</a><span>וואטסאפ</span></div></li>
          </ul>`
    },
    formCard(form) {
      const fields = form?.fields?.length
        ? form.fields
        : [
            { name: 'name', type: 'text', label: 'שם מלא', required: true },
            { name: 'phone', type: 'tel', label: 'טלפון', required: true },
            { name: 'email', type: 'email', label: 'אימייל', required: false },
            { name: 'message', type: 'textarea', label: 'ספרו לי על העסק', required: false },
          ]
      const row = fields
        .filter((f) => f.type !== 'textarea')
        .map(
          (f, i) => `<div class="field">
              <label for="f-${i}">${esc(f.label || f.name)}${f.required ? ' *' : ''}</label>
              <input id="f-${i}" name="${esc(f.name)}" type="${esc(f.type === 'tel' ? 'tel' : f.type)}" ${f.required ? 'required' : ''} placeholder="${esc(f.placeholder || '')}">
            </div>`
        )
        .join('\n            ')
      const area = fields.find((f) => f.type === 'textarea')
      return `<div class="form-card reveal">
            <form class="form" method="post" action="#" novalidate>
              <div class="form__row">${row}</div>
              ${area ? `<div class="field">
                <label for="f-msg">${esc(area.label || 'הודעה')}</label>
                <textarea id="f-msg" name="${esc(area.name)}" placeholder="${esc(area.placeholder || '')}"></textarea>
              </div>` : ''}
              <button class="btn btn--primary" type="submit">${esc(form?.submit || 'שליחה')}</button>
              <p class="form__note">הטופס אינו מחובר עדיין — יחובר בעת העלייה לאוויר.</p>
            </form>
          </div>`
    },
  }

  // footer link groups, taken from the live menus
  const headerItems = nav.header.filter((it, i, arr) => arr.findIndex((x) => x.label === it.label) === i)
  const groups = {
    services: (headerItems.find((i) => i.label === 'שירותים')?.children || []).slice(0, 7),
    sectors: (headerItems.find((i) => i.label.includes('לפי תחום'))?.children || []).slice(0, 8),
    info: [
      { label: 'אודות', href: '/אודות/' },
      { label: 'בלוג עסקי', href: '/category/בלוג-עסקי-מקצועי/' },
      { label: 'שאלות ותשובות', href: '/qa/' },
      { label: 'פרוייקטים', href: '/פרוייקטים/' },
      { label: 'צרו קשר', href: '/צרו-קשר/' },
    ],
  }

  // Built before the pages so the hashed asset URLs can go into every <head>.
  const { outCss, jsSource, cssUrl, jsUrl } = await buildAssets()

  let written = 0
  for (const page of pages) {
    const p = page.seo.path
    let body
    if (p === '/') body = homePage(page, ctx)
    else if (page.type === 'category') body = archivePage(page, ctx)
    else if (page.type === 'post') body = postPage(page, ctx)
    else body = landingPage(page, ctx)

    const preload = p === '/'
      ? preloadImage('/assets/brand/portrait-cutout.png', {
          sizes: '(max-width: 900px) 78vw, 430px',
          derivatives,
        })
      : ''
    let html = head({ seo: page.seo, preload, cssUrl }) + header(nav, p) + body + footer(nav, groups, jsUrl)
    if (!RAW) html = minifyHtml(html)
    const file = outFile(p)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, html, 'utf8')
    written++
  }

  // Static assets — only what the built pages actually reference. The full
  // WordPress library stays in assets/ but shipping all 82 MB of originals
  // when the pages serve derivatives would bloat every deploy.
  const referenced = new Set()
  for (const page of pages) {
    const file = outFile(page.seo.path)
    const html = await readFile(file, 'utf8')
    for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) referenced.add(decodeURIComponent(m[1]))
    for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const part of m[1].split(',')) {
        const u = part.trim().split(/\s+/)[0]
        if (u?.startsWith('/assets/')) referenced.add(decodeURIComponent(u))
      }
    }
  }
  // fonts are pulled in by CSS, not markup
  for (const f of await readdir(path.join(ROOT, 'assets', 'fonts'))) {
    referenced.add(`/assets/fonts/${f}`)
  }

  let copied = 0
  let bytes = 0
  for (const rel of referenced) {
    const from = path.join(ROOT, rel.replace(/^\//, ''))
    const to = path.join(OUT, rel.replace(/^\//, ''))
    const info = await stat(from).catch(() => null)
    if (!info) continue
    await mkdir(path.dirname(to), { recursive: true })
    await cp(from, to)
    copied++
    bytes += info.size
  }
  await mkdir(path.join(OUT, 'assets', 'css'), { recursive: true })
  await mkdir(path.join(OUT, 'assets', 'js'), { recursive: true })
  await writeFile(path.join(OUT, cssUrl.replace(/^\//, '')), outCss, 'utf8')
  await writeFile(path.join(OUT, jsUrl.replace(/^\//, '')), jsSource, 'utf8')

  await writeSitemapAndMap(pages)

  console.log(`built ${written} pages -> site/`)
  console.log(`       ${copied} assets copied (${(bytes / 1048576).toFixed(1)} MB), sitemap.xml, robots.txt, url-map.csv`)
  console.log(`       ${cssUrl}  ${jsUrl}`)
}

/** Assemble the stylesheet and script, and give each a content-hashed URL. */
async function buildAssets() {
  const css = (
    await Promise.all(
      ['tokens.css', 'motifs.css', 'base.css', 'components.css', 'motion.css'].map((f) =>
        readFile(path.join(ROOT, 'src', 'styles', f), 'utf8').catch(() => '')
      )
    )
  ).join('\n')
  const outCss = RAW ? css : minifyCss(css)
  if (!RAW) {
    // Guard against the minifier eating whitespace that CSS math needs — a
    // broken `calc(1rem+2vw)` is dropped silently and takes the type scale
    // with it, which is easy to miss in a diff.
    const count = (text, needle) => text.split(needle).length - 1
    const problems = []
    for (const fn of ['clamp(', 'calc(', 'min(', 'max(']) {
      if (count(css, fn) !== count(outCss, fn)) problems.push(`${fn} count changed`)
    }
    // `1.45rem + 2vw` must keep its spaces; `1.45rem+2vw` is invalid and the
    // whole declaration would be discarded. Ignore url() payloads and
    // unicode-range, where a bare `+` is legitimate (data:image/svg+xml, U+05D0).
    const mathOnly = outCss
      .replace(/url\([^)]*\)/g, 'URL')
      .replace(/unicode-range:[^;}]*/g, 'UR')
    if (/[a-z%\d]\+/.test(mathOnly)) problems.push('a "+" lost its surrounding space')
    if (problems.length) throw new Error('CSS minification damaged the stylesheet: ' + problems.join('; '))
  }

  const jsSource = await readFile(path.join(ROOT, 'src', 'js', 'site.js'), 'utf8')
  // Content hash in the filename is what makes a one-year immutable cache safe:
  // an edit produces a new URL instead of a stale hit.
  const digest = (text) => createHash('sha256').update(text).digest('hex').slice(0, 10)
  return {
    outCss,
    jsSource,
    cssUrl: `/assets/css/site.${digest(outCss)}.css`,
    jsUrl: `/assets/js/site.${digest(jsSource)}.js`,
  }
}

async function writeSitemapAndMap(pages) {
  // sitemap — same URL set as the live Rank Math sitemaps
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${site.origin}${encodeURI(p.seo.path)}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
  </url>`
    )
    .join('\n')
  await writeFile(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8'
  )
  // A staging build must not invite crawlers: the live site is still up at the
  // same content, and an indexed copy would compete with it.
  await writeFile(
    path.join(OUT, 'robots.txt'),
    RAW || process.env.STAGING !== '1'
      ? `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`
      : `User-agent: *\nDisallow: /\n`,
    'utf8'
  )

  // URL inventory — the checklist for go-live: every live URL, unchanged.
  const rows = [['live_url', 'new_path', 'type', 'title', 'has_description', 'blocks']]
  for (const p of pages) {
    rows.push([
      p.seo.url,
      p.seo.path,
      p.type,
      (p.seo.title || '').replace(/"/g, "'"),
      p.seo.description ? 'yes' : 'NO',
      String(p.blocks.length),
    ])
  }
  await writeFile(
    path.join(ROOT, 'content', 'url-map.csv'),
    '﻿' + rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n'),
    'utf8'
  )

}

main()
