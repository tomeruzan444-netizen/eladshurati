/* Header behaviour, scroll reveals, section tracking.
   Progressive: every one of these is an enhancement, and the page is fully
   usable and fully visible with this file blocked or still loading. */
(function () {
  'use strict'

  // The <head> already set the `js` flag; doing it here would be too late and
  // content would flash in before being hidden for the reveal.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ================================================== header */

  var header = document.querySelector('.header')
  if (header) {
    var toggle = header.querySelector('.header__toggle')
    var desktop = window.matchMedia('(min-width: 1081px)')

    var ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(function () {
        header.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false'
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    function setMenu(open) {
      header.dataset.menu = open ? 'open' : 'closed'
      if (toggle) toggle.setAttribute('aria-expanded', String(open))
      document.body.style.overflow = open && !desktop.matches ? 'hidden' : ''
    }
    if (toggle) {
      toggle.addEventListener('click', function () {
        setMenu(header.dataset.menu !== 'open')
      })
    }

    var items = header.querySelectorAll('.nav__item[data-dropdown]')
    Array.prototype.forEach.call(items, function (item) {
      var link = item.querySelector('.nav__link')
      var closeTimer

      function open(state) {
        item.dataset.open = state ? 'true' : 'false'
        if (link) link.setAttribute('aria-expanded', String(state))
      }

      item.addEventListener('mouseenter', function () {
        if (!desktop.matches) return
        clearTimeout(closeTimer)
        open(true)
      })
      item.addEventListener('mouseleave', function () {
        if (!desktop.matches) return
        closeTimer = setTimeout(function () {
          open(false)
        }, 140)
      })
      item.addEventListener('focusout', function (e) {
        if (!desktop.matches) return
        if (!item.contains(e.relatedTarget)) open(false)
      })
      if (link) {
        link.addEventListener('click', function (e) {
          if (desktop.matches) return
          e.preventDefault()
          open(item.dataset.open !== 'true')
        })
      }
    })

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return
      setMenu(false)
      Array.prototype.forEach.call(items, function (i) {
        i.dataset.open = 'false'
        var l = i.querySelector('.nav__link')
        if (l) l.setAttribute('aria-expanded', 'false')
      })
    })

    desktop.addEventListener('change', function () {
      setMenu(false)
      Array.prototype.forEach.call(items, function (i) {
        i.dataset.open = 'false'
      })
    })
  }

  if (reduced) return


  /* ========================================== hero headline */

  /* Split the headline into the lines it actually wraps onto, so each can rise
     out of its own mask. Line breaks depend on the rendered width, so this can
     only be done at runtime — and has to be redone when the width changes. */
  var splitTargets = document.querySelectorAll('[data-split-lines]')
  Array.prototype.forEach.call(splitTargets, function (el) {
    var source = el.textContent.trim()
    var lastWidth = 0
    var lastSignature = ''
    var lastMarkup = ''

    function split(animate) {
      var words = source.split(/\s+/)
      var probes = []
      el.textContent = ''
      words.forEach(function (word, i) {
        var span = document.createElement('span')
        span.textContent = word
        el.appendChild(span)
        probes.push(span)
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
      })

      // Group words by the vertical position they ended up on.
      var lines = []
      var current = null
      probes.forEach(function (span) {
        var top = span.offsetTop
        if (!current || current.top !== top) {
          current = { top: top, words: [] }
          lines.push(current)
        }
        current.words.push(span.textContent)
      })

      // If the grouping is unchanged there is nothing to rebuild, and rebuilding
      // would restart the entrance animation for no reason.
      var signature = lines.map(function (l) { return l.words.join(' ') }).join('|')
      if (!animate && signature === lastSignature) {
        el.innerHTML = lastMarkup
        return
      }
      lastSignature = signature

      el.textContent = ''
      el.classList.toggle('no-anim', !animate)
      lines.forEach(function (line, i) {
        var outer = document.createElement('span')
        outer.className = 'ln'
        outer.style.setProperty('--i', i)
        var inner = document.createElement('span')
        inner.textContent = line.words.join(' ')
        outer.appendChild(inner)
        // A whitespace node between the line boxes: it renders as nothing
        // between blocks, but keeps textContent from fusing the last word of
        // one line onto the first of the next. This is the H1 of a ranked
        // page — its extracted text has to stay exactly right.
        if (i > 0) el.appendChild(document.createTextNode(' '))
        el.appendChild(outer)
      })
      el.classList.add('is-split')
      lastWidth = el.clientWidth
      lastMarkup = el.innerHTML
    }

    split(true)

    // The webfont swapping in changes where the text wraps, so re-group once it
    // has landed. Silent: no animation restart, and a no-op if nothing moved.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        split(false)
      })
    }

    // ResizeObserver rather than window resize: it reports the element's own
    // box, so it catches a rotation or a font swap but ignores the mobile
    // address bar collapsing, which fires window resize constantly.
    if ('ResizeObserver' in window) {
      var resizeTimer
      var ro = new ResizeObserver(function () {
        if (Math.abs(el.clientWidth - lastWidth) < 24) return
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function () {
          split(false)
        }, 180)
      })
      ro.observe(el)
    }
  })

  /* ================================================= reveals */

  var revealables = document.querySelectorAll('.reveal')
  if (revealables.length && 'IntersectionObserver' in window) {
    // Children of a group get a small stagger so a row of cards lands in
    // sequence rather than snapping in as one block.
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var step = Number(group.dataset.stagger) || 70
      Array.prototype.forEach.call(group.children, function (child, i) {
        if (child.classList.contains('reveal')) {
          child.style.setProperty('--reveal-delay', Math.min(i, 6) * step + 'ms')
        }
      })
    })

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    revealables.forEach(function (el) {
      io.observe(el)
    })

    // Anything already on screen at load reveals immediately, so the first
    // paint is never a blank column while the observer settles.
    requestAnimationFrame(function () {
      revealables.forEach(function (el) {
        var r = el.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.92) {
          el.classList.add('is-in')
          io.unobserve(el)
        }
      })
    })
  } else {
    revealables.forEach(function (el) {
      el.classList.add('is-in')
    })
  }

  /* ========================================== progress bar */

  var bar = document.querySelector('.progress')
  if (bar && !CSS.supports('animation-timeline: scroll()')) {
    var barTick = false
    window.addEventListener(
      'scroll',
      function () {
        if (barTick) return
        barTick = true
        requestAnimationFrame(function () {
          var h = document.documentElement.scrollHeight - window.innerHeight
          bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')'
          barTick = false
        })
      },
      { passive: true }
    )
  }

  /* ====================================== table of contents */

  var tocLinks = document.querySelectorAll('.toc a[href^="#"]')
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = new Map()
    tocLinks.forEach(function (a) {
      var target = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))
      if (target) map.set(target, a)
    })
    var visible = new Set()
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) visible.add(e.target)
          else visible.delete(e.target)
        })
        var first = null
        map.forEach(function (_a, el) {
          if (visible.has(el) && (!first || el.compareDocumentPosition(first) & 2)) first = el
        })
        tocLinks.forEach(function (a) {
          a.removeAttribute('data-active')
        })
        if (first) map.get(first).setAttribute('data-active', 'true')
      },
      { rootMargin: '-88px 0px -62% 0px' }
    )
    map.forEach(function (_a, el) {
      spy.observe(el)
    })
  }

  /* ============================================ card sheen */

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener(
      'pointermove',
      function (e) {
        var card = e.target.closest && e.target.closest('.card, .post-card')
        if (!card) return
        var r = card.getBoundingClientRect()
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
      },
      { passive: true }
    )
  }
})()
