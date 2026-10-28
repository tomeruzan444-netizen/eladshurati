---
name: seo-audit
description: Measure the SEO and content state of elad-digital.co.il. Use when Tomer asks how the site is doing on crawling, indexing, orphan pages, duplicate content, thin pages, structured data, or whether the content meets Google's guidelines — and when a change should be checked for whether it moved any of those numbers.
---

# Auditing the site

Every audit before this one was written fresh for the question that prompted it.
Each was right; none were comparable. "28 orphans" tells you nothing against a
previous "31" unless both were counted the same way.

So the counting lives in code now.

```bash
node scripts/audit-seo.mjs            # the readable report
node scripts/audit-seo.mjs --json     # for diffing two runs
```

Run it on a fresh build. Read `CLAUDE.md` first if it is not already in context.

---

## What each number means, and what it does not

**reachable from the home page** — a BFS over internal `href`s starting at `/`.
This is the crawler's view. It is a different question from inbound links, and
the two numbers will not match: a page can be reachable through navigation and
still have no editorial link pointing at it. For that second question:

```bash
node scripts/9-inbound.mjs      # rule 9א — 1-3 contextual inbound links
```

**under 300 words** — visible text inside `<main>`, with nav, script and style
removed. A contact page or a client page being short is not automatically a
fault; a topic page being short is.

**page pairs sharing >25% body text** — 8-word runs, with everything appearing
on ten pages or more removed first. That subtraction matters: without it the
measure reported 190 pairs, because the CTA, the related-articles cards and the
boilerplate FAQ are identical nearly everywhere. What survives is two pages
genuinely saying the same thing.

**text repeated on 10+ pages** — the chrome that was subtracted, as a share of a
typical page. This is the duplicated-FAQ finding, measured instead of asserted.
It is not automatically bad — a CTA should repeat — but it is the number to
watch if it climbs.

**no author in structured data** — pages whose JSON-LD names no author. Archive
pages legitimately have none. A topic page with a visible byline and no author
in the schema is telling a reader and a crawler two different things.

**FAQ on screen, none in schema** — questions a reader can see that Google is
not being told about.

---

## What the script cannot tell you

It measures form. It cannot tell you whether a page is worth reading.

For that, go to `docs/google-helpful-content.md` — the "who, how and why"
questions and the warning signs for search-engine-first content — and read the
pages themselves. The questions that matter are the ones no script answers:
does this page say something the other seventy-nine do not; would someone
forward it; does it read like Elad or like a brief about Elad.

And the Search Console questions are a separate skill of their own kind. Two
facts worth keeping:

- **Organic position is not position on the screen.** A page ranking 3.2 can sit
  below an AI overview, below a pack, below ads. "I can't find it when I search"
  and "it ranks third" are both true at once.
- **High impressions with zero clicks** points at placement or at rank-tracker
  traffic, not necessarily at the page.

---

## After the audit

Findings go into `docs/worklog.md` with the date and the number, so the next run
has something to be read against. Restate a moved count with the old one in
parentheses — "28 (was 31)".

**Do not fix what you found without asking.** The worklog is a list of things to
decide about. An audit that quietly starts editing a ranked site is the thing
this whole project is set up to prevent.
