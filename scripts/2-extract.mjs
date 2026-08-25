/**
 * Step 2 — Turn the captured HTML into a structured content layer.
 *
 * For every URL we keep two things:
 *   seo     — everything Google currently sees (title, description, canonical,
 *             robots, OG/Twitter, JSON-LD, heading outline). Migrated verbatim.
 *   blocks  — the page content as an ordered list of typed blocks, freed from
 *             Elementor's div soup so the new design can lay it out its own way.
 *
 * Nothing here touches the live site; it only reads _source/html/.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { load } from 'cheerio'

const ROOT = path.resolve(import.meta.dirname, '..')
const ORIGIN = 'https://elad-digital.co.il'
const CONTENT = path.join(ROOT, 'content')

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim()

/** Absolute site URL -> site-relative path, so internal links survive the move. */
function toRelative(href) {
  if (!href) return href
  try {
    const u = new URL(href, ORIGIN)
    if (u.origin !== ORIGIN) return href
    return decodeURIComponent(u.pathname) + u.search + u.hash
  } catch {
    return href
  }
}

const isInternal = (href) => {
  if (!href) return false
  if (href.startsWith('#') || href.startsWith('/')) return true
  try {
    return new URL(href, ORIGIN).origin === ORIGIN
  } catch {
    return false
  }
}

/**
 * Cloudflare rewrites mailto links to /cdn-cgi/l/email-protection and hides the
 * address in data-cfemail (XOR'd, first byte is the key). Off Cloudflare that
 * link is dead, so decode it back into a real mailto.
 */
function decodeCfEmail(hex) {
  try {
    const key = parseInt(hex.slice(0, 2), 16)
    let out = ''
    for (let i = 2; i < hex.length; i += 2) {
      out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key)
    }
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out) ? out : null
  } catch {
    return null
  }
}

/** Strip Elementor/WP classes and ids but keep the semantic markup and links. */
function sanitize($, el) {
  return cleanNode($, el).html()?.replace(/\s+/g, ' ').trim() ?? ''
}

/** Same cleaning, but keeps the element itself (used for <p>, <li> and friends). */
function sanitizeOuter($, el) {
  const $el = cleanNode($, el)
  return ($.html($el) || '').replace(/\s+/g, ' ').trim()
}

function cleanNode($, el) {
  const $el = $(el).clone()
  $el.find('script, style, noscript').remove()
  $el.find('a[data-cfemail], .__cf_email__').addBack('a[data-cfemail], .__cf_email__').each((_, a) => {
    const $a = $(a)
    const mail = decodeCfEmail($a.attr('data-cfemail') || '')
    if (!mail) return
    $a.attr('href', `mailto:${mail}`).removeAttr('data-cfemail').text(mail)
  })
  $el.find('*').each((_, n) => {
    const $n = $(n)
    const keep = {}
    const href = $n.attr('href')
    if (href) keep.href = toRelative(href)
    for (const a of ['src', 'alt', 'width', 'height', 'target', 'rel', 'title', 'colspan', 'rowspan']) {
      const v = $n.attr(a)
      if (v != null) keep[a] = a === 'src' ? v : v
    }
    // drop everything else (class, id, data-*, style, aria-* noise from Elementor)
    for (const a of Object.keys(n.attribs || {})) $n.removeAttr(a)
    for (const [k, v] of Object.entries(keep)) $n.attr(k, v)
  })
  return $el
}

/** The real file behind an <img>, looking past WP Rocket's lazyload placeholder. */
function imgSrc($i) {
  const raw = $i.attr('data-lazy-src') || $i.attr('data-src') || $i.attr('src') || ''
  if (!raw || raw.startsWith('data:')) return ''
  try {
    return new URL(raw, ORIGIN).href
  } catch {
    return ''
  }
}

function collectMedia($, root, bag) {
  const $in = (sel) => (root ? $(root).find(sel).add($(root).filter(sel)) : $(sel))
  const add = (u) => {
    if (!u || u.startsWith('data:')) return
    try {
      bag.add(new URL(u, ORIGIN).href)
    } catch {
      /* malformed url in source markup */
    }
  }
  // WP Rocket swaps src for a placeholder and parks the real file on data-lazy-*
  $in('img, source, video, iframe').each((_, el) => {
    const $i = $(el)
    for (const a of ['src', 'data-src', 'data-lazy-src', 'poster', 'data-large_image']) add($i.attr(a))
    for (const a of ['srcset', 'data-srcset', 'data-lazy-srcset']) {
      const set = $i.attr(a)
      if (!set) continue
      for (const part of set.split(',')) add(part.trim().split(/\s+/)[0])
    }
  })
  $in('[data-bg], [data-lazy-bg], [data-settings]').each((_, el) => {
    const $e = $(el)
    for (const a of ['data-bg', 'data-lazy-bg']) {
      const v = $e.attr(a)
      if (v) add(v.replace(/^url\((['"]?)(.*)\1\)$/, '$2'))
    }
    const s = $e.attr('data-settings') || ''
    for (const m of s.matchAll(/https?:\\?\/\\?\/[^"'\\ )]+\.(?:png|jpe?g|webp|svg|gif|avif)/gi)) {
      add(m[0].replace(/\\\//g, '/'))
    }
  })
  $in('link[rel="preload"][as="image"], link[rel="icon"], link[rel="apple-touch-icon"]').each((_, el) =>
    add($(el).attr('href'))
  )
  $in('[style]').each((_, el) => {
    const st = $(el).attr('style') || ''
    for (const m of st.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
      const u = m[2]
      if (u && !u.startsWith('data:')) bag.add(new URL(u, ORIGIN).href)
    }
  })
  $in('style').each((_, el) => {
    for (const m of ($(el).html() || '').matchAll(/url\((['"]?)([^'")]+)\1\)/g)) {
      const u = m[2]
      if (u && !u.startsWith('data:') && /\.(png|jpe?g|webp|svg|gif|avif)/i.test(u)) {
        bag.add(new URL(u, ORIGIN).href)
      }
    }
  })
}

function extractSeo($, url, container) {
  const meta = (sel, attr = 'content') => $(sel).attr(attr) || null
  const jsonld = []
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jsonld.push(JSON.parse($(el).contents().text()))
    } catch {
      /* malformed block on the live site — recorded as raw below */
      jsonld.push({ __raw: $(el).contents().text().slice(0, 4000) })
    }
  })

  const headings = []
  $(container).find('h1,h2,h3,h4,h5,h6').each((_, el) => {
    headings.push({ level: Number(el.tagName[1]), text: clean($(el).text()) })
  })

  return {
    url,
    path: toRelative(url),
    title: clean($('head > title').text()),
    description: meta('meta[name="description"]'),
    robots: meta('meta[name="robots"]'),
    canonical: meta('link[rel="canonical"]', 'href'),
    og: {
      locale: meta('meta[property="og:locale"]'),
      type: meta('meta[property="og:type"]'),
      title: meta('meta[property="og:title"]'),
      description: meta('meta[property="og:description"]'),
      url: meta('meta[property="og:url"]'),
      siteName: meta('meta[property="og:site_name"]'),
      image: meta('meta[property="og:image"]'),
      updatedTime: meta('meta[property="og:updated_time"]'),
    },
    twitter: {
      card: meta('meta[name="twitter:card"]'),
      title: meta('meta[name="twitter:title"]'),
      description: meta('meta[name="twitter:description"]'),
      image: meta('meta[name="twitter:image"]'),
    },
    articleModified: meta('meta[property="article:modified_time"]'),
    jsonld,
    headings,
    h1: headings.find((h) => h.level === 1)?.text ?? null,
  }
}

/**
 * Split a rich-text region into typed blocks so the new design can style each
 * piece. Anything unrecognised falls through as richtext, so no copy is lost.
 */
function htmlToBlocks($, $root) {
  const out = []
  const pushRich = (html) => {
    if (clean($('<div>').html(html).text())) out.push({ type: 'richtext', html })
  }

  $root.children().each((_, node) => {
    const $n = $(node)
    const tag = node.tagName?.toLowerCase()
    if (!tag) return

    if (/^h[1-6]$/.test(tag)) {
      const text = clean($n.text())
      if (text) out.push({ type: 'heading', level: Number(tag[1]), text })
      return
    }
    if (tag === 'ul' || tag === 'ol') {
      const items = []
      $n.children('li').each((_, li) => items.push(sanitize($, li)))
      if (items.length) out.push({ type: 'list', ordered: tag === 'ol', items })
      return
    }
    if (tag === 'blockquote') {
      out.push({ type: 'quote', html: sanitize($, node) })
      return
    }
    if (tag === 'table') {
      out.push({ type: 'table', html: sanitize($, node) })
      return
    }
    if (tag === 'figure' || tag === 'img') {
      const $i = tag === 'img' ? $n : $n.find('img').first()
      // Four posts carry a stray gstatic sparkle icon pasted in with AI output.
      if ($i.length && !/gstatic\.com/.test(imgSrc($i))) {
        out.push({
          type: 'image',
          src: imgSrc($i),
          alt: $i.attr('alt') || '',
          width: Number($i.attr('width')) || null,
          height: Number($i.attr('height')) || null,
          caption: clean($n.find('figcaption').text()) || null,
        })
      }
      return
    }
    if (tag === 'div' || tag === 'section' || tag === 'article') {
      const nested = htmlToBlocks($, $n)
      if (nested.length) out.push(...nested)
      else pushRich(sanitize($, node))
      return
    }
    pushRich(sanitizeOuter($, node))
  })

  // A region with no element children (bare text) still has to survive.
  if (!out.length) pushRich(sanitize($, $root[0]))
  return out
}

/** Walk the page container and emit typed blocks in document order. */
function extractBlocks($, container, media) {
  const blocks = []

  $(container)
    .find('[data-widget_type]')
    .each((_, el) => {
      const $w = $(el)
      // skip widgets nested inside another widget we already handle
      if ($w.parents('[data-widget_type]').length) return
      const type = ($w.attr('data-widget_type') || '').split('.')[0]
      const $c = $w.find('.elementor-widget-container').first()
      const $scope = $c.length ? $c : $w

      switch (type) {
        case 'heading':
        case 'animated-headline': {
          const $h = $scope.find('h1,h2,h3,h4,h5,h6').first()
          const tag = $h.length ? $h[0].tagName : 'h2'
          const text = clean(($h.length ? $h : $scope).text())
          if (text) blocks.push({ type: 'heading', level: Number(tag[1]) || 2, text })
          break
        }
        case 'text-editor': {
          if (clean($scope.text())) blocks.push(...htmlToBlocks($, $scope))
          break
        }
        case 'image': {
          const $i = $scope.find('img').first()
          if ($i.length) {
            blocks.push({
              type: 'image',
              src: imgSrc($i),
              alt: $i.attr('alt') || '',
              width: Number($i.attr('width')) || null,
              height: Number($i.attr('height')) || null,
              caption: clean($scope.find('figcaption').text()) || null,
            })
          }
          break
        }
        case 'icon-list': {
          const items = []
          $scope.find('.elementor-icon-list-item').each((_, li) => {
            const $li = $(li)
            const $a = $li.find('a').first()
            items.push({
              text: clean($li.text()),
              href: $a.length ? toRelative($a.attr('href')) : null,
            })
          })
          if (items.length) blocks.push({ type: 'iconlist', items })
          break
        }
        case 'toggle':
        case 'accordion': {
          // Elementor puts several classes on the same title node, so select the
          // toggle wrapper and read one title + one panel out of each.
          const items = []
          const $rows = $scope.find('.elementor-toggle-item, .elementor-accordion-item')
          const rows = $rows.length ? $rows : $scope.find('.elementor-tab-title').parent()
          rows.each((_, row) => {
            const $row = $(row)
            const q = clean($row.find('.elementor-tab-title, .elementor-toggle-title, .elementor-accordion-title').first().text())
            const $a = $row.find('.elementor-tab-content').first()
            if (q) items.push({ q, a: $a.length ? sanitize($, $a) : '' })
          })
          if (items.length) blocks.push({ type: 'faq', items })
          break
        }
        case 'icon-box':
        case 'call-to-action': {
          const $a = $scope.find('a').first()
          blocks.push({
            type: 'card',
            title: clean($scope.find('h1,h2,h3,h4,h5,h6,.elementor-icon-box-title,.elementor-cta__title').first().text()),
            text: clean($scope.find('.elementor-icon-box-description,.elementor-cta__description,p').first().text()),
            href: $a.length ? toRelative($a.attr('href')) : null,
            cta: $a.length ? clean($a.text()) : null,
          })
          break
        }
        case 'button': {
          const $a = $scope.find('a').first()
          blocks.push({
            type: 'button',
            text: clean($scope.text()),
            href: $a.length ? toRelative($a.attr('href')) : null,
          })
          break
        }
        case 'form': {
          const fields = []
          $scope.find('input, textarea, select').each((_, f) => {
            const $f = $(f)
            const name = $f.attr('name')
            const ftype = $f.attr('type') || f.tagName
            if (!name || ['hidden', 'submit'].includes(ftype)) return
            const id = $f.attr('id')
            const label = clean($scope.find(`label[for="${id}"]`).text())
            fields.push({
              name,
              type: ftype,
              label: label || $f.attr('placeholder') || '',
              placeholder: $f.attr('placeholder') || '',
              required: $f.attr('required') != null || $f.attr('aria-required') === 'true',
            })
          })
          blocks.push({
            type: 'form',
            id: $scope.find('form').attr('id') || null,
            submit: clean($scope.find('button[type="submit"], .elementor-button-text').first().text()) || 'שליחה',
            fields,
          })
          break
        }
        case 'theme-post-title': {
          const $h = $scope.find('h1,h2,h3,h4,h5,h6').first()
          const text = clean(($h.length ? $h : $scope).text())
          if (text) blocks.push({ type: 'heading', level: 1, text })
          break
        }
        case 'theme-post-content': {
          blocks.push(...htmlToBlocks($, $scope))
          break
        }
        case 'posts':
        case 'archive-posts': {
          blocks.push({ type: 'postlist', variant: type === 'archive-posts' ? 'archive' : 'grid' })
          break
        }
        case 'shortcode': {
          // On this site the shortcode widget is always the shared "latest posts"
          // Elementor template, rendered identically on 46 pages. Recorded as a
          // recurring section rather than page copy.
          const links = []
          $scope.find('a[href]').each((_, a) => {
            const href = toRelative($(a).attr('href'))
            const text = clean($(a).text())
            if (href && text && !links.some((l) => l.href === href)) links.push({ href, text })
          })
          blocks.push({ type: 'template', name: 'latest-posts', links })
          break
        }
        case 'video': {
          const iframe = $scope.find('iframe').attr('src') || null
          blocks.push({ type: 'video', src: iframe, raw: clean($scope.attr('data-settings') || '') })
          break
        }
        case 'social-icons':
        case 'divider':
        case 'spacer':
        case 'icon':
          break // presentation only — the new design supplies its own
        default: {
          const text = clean($scope.text())
          if (text) blocks.push({ type: 'unknown', widget: type, html: sanitize($, $scope), text })
        }
      }
    })

  collectMedia($, container, media)
  return blocks
}

function extractNav($, selector) {
  const items = []
  $(selector)
    .find('li')
    .each((_, li) => {
      const $li = $(li)
      if ($li.parents('li').length) return
      const $a = $li.children('a').first()
      if (!$a.length) return
      const children = []
      $li.find('ul li > a').each((_, a) => {
        children.push({ label: clean($(a).text()), href: toRelative($(a).attr('href')) })
      })
      items.push({
        label: clean($a.text()),
        href: toRelative($a.attr('href')),
        children: children.length ? children : undefined,
      })
    })
  return items
}

const main = async () => {
  await mkdir(CONTENT, { recursive: true })
  const index = JSON.parse(await readFile(path.join(ROOT, '_source', 'url-index.json'), 'utf8'))
  const media = new Set()
  const pages = []
  const linkGraph = []

  for (const entry of index) {
    const html = await readFile(path.join(ROOT, entry.file), 'utf8')
    const $ = load(html)

    const $container = $(
      '[data-elementor-type="wp-page"], [data-elementor-type="single-post"], [data-elementor-type="archive"]'
    ).first()
    const container = $container.length ? $container[0] : $('body')[0]

    const seo = extractSeo($, entry.url, container)
    for (const u of [seo.og.image, seo.twitter.image]) {
      if (u && !u.startsWith('data:')) media.add(new URL(u, ORIGIN).href)
    }
    const blocks = extractBlocks($, container, media)

    // every link inside the content, for the internal-link audit
    $(container)
      .find('a[href]')
      .each((_, a) => {
        const href = $(a).attr('href')
        linkGraph.push({
          from: seo.path,
          to: toRelative(href),
          text: clean($(a).text()),
          internal: isInternal(href),
        })
      })

    pages.push({
      key: entry.key,
      type: entry.type,
      lastmod: entry.lastmod,
      seo,
      blocks,
      wordCount: blocks.reduce((n, b) => n + (JSON.stringify(b).match(/[֐-׿\w]+/g) || []).length, 0),
    })
  }

  // Header / footer navigation, taken once from the home page capture
  const $home = load(await readFile(path.join(ROOT, '_source', 'html', 'home.html'), 'utf8'))
  const nav = {
    header: extractNav($home, 'header .elementor-nav-menu--main, header nav'),
    footer: extractNav($home, 'footer'),
  }
  collectMedia($home, 'header', media)
  collectMedia($home, 'footer', media)

  await writeFile(path.join(CONTENT, 'pages.json'), JSON.stringify(pages, null, 2), 'utf8')
  await writeFile(path.join(CONTENT, 'nav.json'), JSON.stringify(nav, null, 2), 'utf8')
  await writeFile(path.join(CONTENT, 'links.json'), JSON.stringify(linkGraph, null, 2), 'utf8')
  await writeFile(
    path.join(CONTENT, 'media.json'),
    JSON.stringify([...media].sort(), null, 2),
    'utf8'
  )

  const blockTypes = {}
  for (const p of pages) for (const b of p.blocks) blockTypes[b.type] = (blockTypes[b.type] || 0) + 1

  console.log(`pages       ${pages.length}`)
  console.log(`blocks      ${Object.entries(blockTypes).map(([k, v]) => `${k}:${v}`).join('  ')}`)
  console.log(`links       ${linkGraph.length} (${linkGraph.filter((l) => l.internal).length} internal)`)
  console.log(`media urls  ${media.size}`)
  console.log(`nav         header:${nav.header.length} footer:${nav.footer.length}`)
}

main()
