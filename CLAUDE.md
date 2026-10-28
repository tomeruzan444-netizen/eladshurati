# elad-digital.co.il

A ranked Hebrew business-consulting site, moved off WordPress and onto a static
build. The content came across 1:1; the design is what changed.

Everything here is a standing rule, not a suggestion. The parts that are easy to
get wrong are the ones written down.

---

## The one rule everything else serves

**The site ranks. Do not cost it rankings.**

Captured copy is not edited. Not a word, not a comma, not a typo — except
through a named rule in `scripts/lib/corrections.mjs` with an expected match
count. If the count stops matching, the build throws. That is the point: a
re-crawl can never silently drop a fix, and nobody has to diff a 4 MB JSON file
to see what we changed.

`content/pages.json` is the faithful record of what WordPress published. It
stays pristine.

**Never touch the live WordPress install.** Read-only, always.

---

## Where things are

| | |
|---|---|
| `content/pages.json` | the WordPress capture — never edited by hand |
| `scripts/lib/corrections.mjs` | every change to captured content, named, with a reason and a count |
| `content/authored/*.mjs` | pages written here, not migrated |
| `scripts/lib/authored.mjs` | the build-time gate that refuses a page breaking a measurable rule |
| `site/` | the build output, committed |
| `docs/worklog.md` | the single task log — what was asked, what was done, what is open |

## The writing guides, in precedence order

1. `docs/writing-spec.md` — the top authority. Approach, originality, search
   intent, SEO, E-E-A-T, visuals, links, the 20-point quality check.
2. `docs/voice-guide.md` — how Elad sounds, in numbers, measured from 1,230
   sentences of his own writing.
3. `docs/content-guide.md` — the first guide. Structure, GEO, FAQ.

**On a conflict the lower number wins.** `docs/README.md` holds the full map.

Alongside them, and not ours: `docs/google-helpful-content.md` (a faithful
translation of Google's official page) and `docs/google-content-practical.md`
(the practical companion, explicitly interpretation). They do not override the
three — they measure them. When an internal rule contradicts Google, raise it
for a decision rather than quietly picking a side. One such conflict is open
right now; `docs/README.md` has it.

When quoting Google, quote the translation, not the practical guide.

---

## Never invent

No statistics, no client stories, no results, no quotes, no regulatory claims.

If a page needs a number and nobody supplied one, the page ships without the
number, or it does not ship. Where a claim touches regulation — the Bar, the
medical associations — verify it against the primary text (nevo, wikisource),
and record in a code comment what was deliberately *not* claimed.

This matters more than usual here: business and financial advice is YMYL.

---

## Before every commit

Not optional, and in this order:

```
node scripts/audit-content.mjs     # mechanical content findings
node scripts/6-linkcheck.mjs       # internal links and images
npm run serve &                    # 7-mobile needs the preview server
node scripts/7-mobile.mjs          # no horizontal overflow at phone widths
node scripts/diff-visible.mjs <before> site   # what a reader actually sees, changed
```

The visible diff is the last gate. **Sanity-check that it still sees anything** —
it once read only inside `<main>` and reported "no change" while a testimonial
was being added to all 80 pages. A gate that cannot fail is not a gate.

Then: update `docs/worklog.md`, commit, push, and verify live. The commit
message carries the reasoning, not just the change.

At the end of every session, post the LAN preview URL in chat.

---

## Things that have cost time here

- **`/tmp` in Bash is not `/tmp` for Windows Python or Node.** Use the
  scratchpad absolute path for temporary files.
- **`grep -c` returning 0 breaks an `&&` chain.** A build once silently never
  ran because of this.
- **`text-anchor="end"` pins the *left* edge of RTL SVG text.** For Hebrew
  labels you almost always want `start`.
- **Chrome on Windows will not open a window narrower than ~500px.** A
  `--window-size=390` screenshot crops RTL pages. Render a phone viewport the
  way `scripts/7-mobile.mjs` does: a 390px-wide iframe inside a wider window.
- **Escaping through bash → node → a JS string mangles `\n` and `\1`.** Edit
  files with the editing tools, not heredoc pipelines.
- **Console encoding.** `PYTHONIOENCODING=utf-8` or `python -X utf8` before
  printing Hebrew.
- **`/wp-content/uploads/` still resolves** — `vercel.json` rewrites it to
  `/assets/images/`. A URL under it is not broken; check before "fixing" one.

---

## Open, and known

`docs/worklog.md` is the list. The urgent one, at the time of writing: the
contact form silently drops every enquiry because `RESEND_API_KEY` is not set in
Vercel. `curl https://elad-digital.co.il/api/lead/` should return
`configured:true` and does not.

Do not act on an open item without asking. They are logged, not approved.
