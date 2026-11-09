/**
 * "כתבו עליי" - the strip of publications that ran an article linking here.
 *
 * Every entry in content/press.json was verified by fetching the page: it is
 * live, it carries a link to elad-digital.co.il, and the headline and the
 * publisher's name are the ones the publisher itself declares. Nothing in this
 * file is decorative - a press wall that lists a publication which never ran
 * anything is the sort of claim that costs trust, and on a YMYL site it costs
 * more than that.
 *
 * The logos are local copies under assets/press/, normalised to one height.
 * They are not hot-linked: a third-party image on the home page is a broken
 * picture the day they redesign, it hands every visitor to their server, and
 * it is a third-party request on the most important page of the site. Each one
 * is trimmed to its ink so a row of them lines up on a shared baseline rather
 * than on whatever padding each publisher shipped.
 *
 * A missing logo is not a missing card. `logo: null` renders the publisher's
 * name as a wordmark instead, which is what jokopost.com gets - their server
 * refuses non-browser clients, so there is no logo file to ship.
 *
 * Markup note: this reuses the same [data-rail] contract as the testimonial
 * rail, so the arrows, the RTL scrolling and the keyboard handling in site.js
 * drive both without a second implementation.
 */
import { esc } from './render.mjs'

const chev = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`

/**
 * @param items   content/press.json
 * @param sizes   { '/assets/press/x.png': {width, height} } - intrinsic sizes,
 *                so the row does not reflow while the logos load
 */
export function press(items, sizes = {}) {
  if (!items?.length) return ''

  const cards = items
    .map((p) => {
      const dim = sizes[p.logo] || null
      // The name is already in the card as text, so the logo is decorative:
      // alt="" keeps a screen reader from announcing the publisher twice. The
      // logos are rendered at 2x, and the intrinsic attributes are the CSS
      // pixels the slot occupies, which is what reserves the space.
      const mark = p.logo
        ? `<img class="pcard__logo" src="${esc(p.logo)}" alt="" loading="lazy" decoding="async"${
            dim ? ` width="${Math.round(dim.width / 2)}" height="${Math.round(dim.height / 2)}"` : ''
          }>`
        : `<span class="pcard__wordmark">${esc(p.publisher)}</span>`

      return `<article class="pcard">
              <a class="pcard__link" href="${esc(p.url)}" target="_blank" rel="noopener">
                <span class="pcard__mark">${mark}</span>
                ${p.logo ? `<span class="pcard__name">${esc(p.publisher)}</span>` : ''}
                <span class="pcard__title">${esc(p.title)}</span>
                <span class="pcard__go">לכתבה<span aria-hidden="true"> ←</span></span>
              </a>
            </article>`
    })
    .join('\n            ')

  return `
      <section class="section press" aria-labelledby="press-title">
        <div class="container">
          <div class="sec-head reveal">
            <span class="eyebrow">כתבו עליי</span>
            <h2 id="press-title">איפה פורסמתי</h2>
            <p class="press__lead">${esc(
              `${items.length} כתבות ומאמרים שפורסמו באתרי חדשות, מגזינים ופורטלים מקצועיים. לחיצה על כרטיס פותחת את הכתבה באתר שפרסם אותה.`
            )}</p>
          </div>

          <div class="trail press__rail" data-rail>
            <button type="button" class="trail__nav trail__nav--prev" data-rail-prev aria-label="הקודם" hidden>
              ${chev('m9 6 6 6-6 6')}
            </button>
            <div class="trail__track" data-rail-track tabindex="0" role="group" aria-label="פרסומים באתרים אחרים, ניתן לגלול לצדדים">
              ${cards}
            </div>
            <button type="button" class="trail__nav trail__nav--next" data-rail-next aria-label="הבא" hidden>
              ${chev('m15 6-6 6 6 6')}
            </button>
          </div>
        </div>
      </section>`
}
