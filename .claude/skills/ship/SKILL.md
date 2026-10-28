---
name: ship
description: The verification routine for elad-digital.co.il, run before every commit and push. Use after any change that reaches site/ — a new page, a correction rule, a site-wide element, a style change. Covers the build, the four checks, the visible diff against the previous version, phone and desktop screenshots, the worklog, the commit, the push, and live verification.
---

# Shipping a change

The site ranks. The cost of a bad change is not a bug report, it is traffic. So
this runs in full, in order, every time.

Read `CLAUDE.md` first if it is not already in context.

---

## 1. Snapshot the current published state first

The visible diff needs something to compare against. Take it **before**
rebuilding:

```bash
SNAP="<scratchpad>/head-snap"
rm -rf "$SNAP" && mkdir -p "$SNAP"
git archive HEAD site | tar -x -C "$SNAP"
```

## 2. Build

```bash
node scripts/4-build.mjs
```

Read the corrections line. Every count in it is a rule with an expectation —
text, metadata, faq, list, blocks, alt, inserts, author. A count that moved
without you moving it means the source changed and the build is telling you so.

## 3. The four checks

```bash
node scripts/audit-content.mjs      # expect: no mechanical findings
node scripts/6-linkcheck.mjs        # expect: 0 broken, 0 missing, 0 escaped
node scripts/serve.mjs &            # 7-mobile needs this running
node scripts/7-mobile.mjs           # expect: no horizontal overflow
node scripts/9-inbound.mjs          # orphan count should not go up
```

## 4. The visible diff — and check the gate itself

```bash
node scripts/diff-visible.mjs "$SNAP/site" site
```

This is the last thing standing between a change and the live site. It reports
what a reader's eyes would see change.

**Before trusting a quiet result, confirm it can speak.** It once read only
inside `<main>` and so reported "no change" while a testimonial was added to all
80 pages — the final gate was blind to the header, the footer and every rail for
as long as that lasted. If the diff says nothing changed and you believe
something did, the diff is wrong, not you.

Read the numbers against your intent: pages touched, lines in, **lines out**,
metadata changes. Lines going *out* of a ranked page is the dangerous direction.
If anything was removed and you did not mean to remove it, stop.

## 5. Look at it

Screenshot at desktop and phone width. Chrome on Windows will not open a window
narrower than ~500px, so a `--window-size=390` screenshot crops RTL pages. Use a
390px iframe inside a wider window, the way `scripts/7-mobile.mjs` does:

```bash
# probe page in site/, removed afterwards
<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#fff}iframe{border:0;width:390px;height:900px}</style>
</head><body><iframe src="<encoded path>"></iframe></body></html>
```

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --virtual-time-budget=5000 --window-size=400,900 \
  --screenshot=<out>.png http://localhost:4471/__probe.html
```

Delete the probe file when done.

## 6. Worklog

`docs/worklog.md` — a row in the history table, and update the open items the
change affected. If a finding is now closed, strike it and say what closed it
and when. If a count moved (orphans, thin pages), restate it with the new
number and the old one in parentheses.

## 7. Commit

The message carries the reasoning. What was wrong, what was done, what was
deliberately not done, and the numbers the checks produced. Someone reading
`git log` in a year should not need this conversation.

Check nothing unrelated is staged — `git status --short` before committing.

## 8. Push, then verify live

Vercel takes a moment. Poll rather than assume:

```bash
for i in $(seq 1 10); do
  curl -s "<a changed URL>" | grep -c '<something the change added>' && break
  sleep 20
done
```

Then verify across the whole site, not a sample — read `site/sitemap.xml`, fetch
every URL, and count. A sample confirms the deploy landed; a sweep confirms the
change is where you said it would be.

## 9. Tell Tomer

Post the LAN preview URL. He checks on his phone.

Report what the checks actually said, including anything that came out worse
than the framing you were about to use.
