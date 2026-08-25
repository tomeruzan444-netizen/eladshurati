/**
 * Small, conservative minifiers.
 *
 * Deliberately not clever: the point is to strip build-time formatting without
 * ever risking the content. Anything ambiguous is left alone. Gzip/Brotli at
 * the host does the heavy lifting; this just removes what compresses badly.
 */

/** Strip comments and collapse whitespace, leaving strings and url() intact. */
export function minifyCss(css) {
  let out = ''
  let i = 0
  const n = css.length

  while (i < n) {
    const c = css[i]

    // strings — copy verbatim
    if (c === '"' || c === "'") {
      const quote = c
      let j = i + 1
      while (j < n && (css[j] !== quote || css[j - 1] === '\\')) j++
      out += css.slice(i, j + 1)
      i = j + 1
      continue
    }

    // url(...) — data URIs must survive byte for byte
    if (c === 'u' && css.startsWith('url(', i)) {
      let j = i + 4
      let depth = 1
      while (j < n && depth > 0) {
        if (css[j] === '(') depth++
        else if (css[j] === ')') depth--
        j++
      }
      out += css.slice(i, j)
      i = j
      continue
    }

    // comments
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      i = end === -1 ? n : end + 2
      continue
    }

    // whitespace runs
    if (/\s/.test(c)) {
      let j = i
      while (j < n && /\s/.test(css[j])) j++
      const prev = out[out.length - 1]
      const next = css[j]
      // Never touch space around `+` or `-`: they are selector combinators but
      // also math operators, and `calc(1rem + 2vw)` is invalid without the
      // spaces — which silently drops the whole declaration.
      const safeBefore = '{}:;,>~('
      const safeAfter = '{}:;,>~)'
      if (prev && next && !safeBefore.includes(prev) && !safeAfter.includes(next)) {
        out += ' '
      }
      i = j
      continue
    }

    out += c
    i++
  }

  return out.replace(/;}/g, '}').trim()
}

const SKIP = /<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi

/**
 * Collapse formatting whitespace in HTML. Runs of whitespace become a single
 * space rather than nothing, so no word ever fuses with its neighbour, and
 * pre/textarea/script/style are passed through untouched.
 */
export function minifyHtml(html) {
  const kept = []
  // A control character as the marker: it cannot occur in the source HTML, so
  // restoring can never collide with real text. A space-wrapped number would —
  // body copy like "5 עקרונות לפיתוח עסקי" contains exactly that.
  const MARK = String.fromCharCode(1)
  const masked = html.replace(SKIP, (m) => {
    kept.push(m)
    return MARK + (kept.length - 1) + MARK
  })

  const squeezed = masked
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/>\s+</g, '> <')

  return squeezed.replace(new RegExp(MARK + '([0-9]+)' + MARK, 'g'), (_, i) => kept[Number(i)])
}
