/**
 * The client testimonials rail that sits above the footer.
 *
 * The videos are YouTube Shorts. Embedding them as iframes would pull roughly a
 * megabyte of player JavaScript into every page on the site for something most
 * visitors never press — on a site whose TTFB is 0.27s that is the single most
 * expensive thing on the page. So each card ships as a facade: a local poster
 * image and a play button. The iframe is built on click, in site.js, and only
 * then does YouTube get loaded.
 *
 * Adding more is editing content/testimonials.json — no code change.
 */
import { esc } from './render.mjs'

const play = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 6.5v11a.7.7 0 0 0 1.07.6l8.5-5.5a.7.7 0 0 0 0-1.2l-8.5-5.5A.7.7 0 0 0 9 6.5Z"/></svg>`
const chev = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`

/** The client testimonials: Shorts of customers talking about Elad. */
export function testimonials(items, ctx) {
  return videoRail(items, ctx, {
    id: 'testimonials',
    eyebrow: 'המלצות',
    title: 'מה הלקוחות מספרים',
    alt: 'המלצה של לקוח על אלעד שורתי',
    play_label: 'נגן את ההמלצה',
    mist: true,
  })
}

/** Elad's own clips, in a second rail under the testimonials. */
export function clips(items, ctx) {
  return videoRail(items, ctx, {
    id: 'clips',
    eyebrow: 'מהערוץ שלי',
    title: 'סרטונים מאת אלעד',
    alt: 'אלעד שורתי בסרטון על שיווק וייעוץ עסקי',
    play_label: 'נגן את הסרטון',
    mist: false,
  })
}

/**
 * One rail of Shorts. Used twice on every page - the testimonials above and
 * Elad's own clips below - so the section id, the headings and the background
 * all come from the caller. The client script already handles any number of
 * rails: it wires every [data-rail] it finds, and the play handler is
 * delegated from the document.
 */
export function videoRail(items, ctx, { id, eyebrow, title, alt, mist, play_label }) {
  if (!items?.length) return ''

  const cards = items
    .map(
      (t) => `<article class="tcard">
              <button type="button" class="tcard__frame" data-yt="${esc(t.id)}"
                      aria-label="${esc(play_label)}: ${esc(t.caption)}">
                ${ctx.responsiveImage(t.thumb, {
                  alt,
                  sizes: '(max-width: 700px) 68vw, 260px',
                  className: 'tcard__poster',
                  derivatives: ctx.derivatives,
                })}
                <span class="tcard__play">${play}</span>
              </button>
              <p class="tcard__caption">${esc(t.caption)}</p>
            </article>`
    )
    .join('\n            ')

  return `
      <section class="section${mist ? ' section--mist' : ''} testimonials" aria-labelledby="${esc(id)}-title">
        <div class="container">
          <div class="sec-head reveal">
            <span class="eyebrow">${esc(eyebrow)}</span>
            <h2 id="${esc(id)}-title">${esc(title)}</h2>
          </div>

          <div class="trail" data-rail>
            <button type="button" class="trail__nav trail__nav--prev" data-rail-prev aria-label="הקודם" hidden>
              ${chev('m9 6 6 6-6 6')}
            </button>
            <div class="trail__track" data-rail-track tabindex="0" role="group" aria-label="${esc(title)}, ניתן לגלול לצדדים">
              ${cards}
            </div>
            <button type="button" class="trail__nav trail__nav--next" data-rail-next aria-label="הבא" hidden>
              ${chev('m15 6-6 6 6 6')}
            </button>
          </div>
        </div>
      </section>`
}
