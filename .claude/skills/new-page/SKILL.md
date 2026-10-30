---
name: new-page
description: Write and publish a new page on elad-digital.co.il. Use whenever Tomer asks for a page on a topic ("תוסיף עמוד חדש על X", "תוסיף עמוד לפי כללי התוכן על X"), or asks whether a page on some topic exists and then wants one. Covers the whole run: checking the topic is not already covered, reading the guides in precedence order, drafting in Elad's voice, passing the build gate, the voice and repetition checks, a diagram built for the topic, inbound links, and shipping.
---

# A new page on elad-digital.co.il

Eleven of the thirty-seven logged requests on this project were this one. It has
a long tail of steps that are easy to skip under momentum, and the steps most
often skipped are the ones that decide whether the page is worth publishing.

Read `CLAUDE.md` first if it is not already in context.

---

## 1. Before writing anything: does this page already exist?

Twice, Tomer asked "is there a page on X?" before asking for one. Make that
check automatic, and make it about *intent*, not about the slug.

```bash
node scripts/9-inbound.mjs | head -3          # the page list
grep -rl "<keyword>" site --include=index.html
```

Then read the candidates. A page covering the same search intent under a
different name is a cannibalisation problem (spec §10), and the right answer may
be to strengthen that page instead of adding a second one — as happened with the
author page, where `/אודות/` was extended rather than joined by a rival.

**Say which you are doing and why, before you write.**

---

## 2. Read the guides, in order

`docs/writing-spec.md`, then `docs/voice-guide.md`, then
`docs/content-guide.md`. Lower number wins a conflict.

Then `docs/google-helpful-content.md` — in particular the "who, how and why"
questions and the list of warning signs for search-engine-first content. The
page should survive those questions, not just the measurable rules below.

---

## 3. What has to be true of the draft

The build **refuses** a page that breaks any of these
(`scripts/lib/authored.mjs`):

| | |
|---|---|
| H1 | exactly one |
| `title` | 1–65 chars, not a copy of the H1 |
| `description` | 70–165 chars |
| first paragraph | no link in it |
| internal links | 2–3 in the body, each to a page that exists |
| length | 800–1,100 words |
| figure | `role="img"`, a `<title>`, and a caption |
| CTA | its own, not boilerplate |
| path | `/כתובת/`, not colliding with a migrated page |

**The word count is the rule to be careful with.** Google states plainly that it
has no preferred length and lists writing-to-a-count as a warning sign for
content written for the search engine. Our rule 17 demands 800. If a draft lands
short, do not pad: find what is genuinely missing, or say the topic does not
carry 800 words of real material and let Tomer decide. On three pages this has
already been resolved by adding content to clear the gate, which is the exact
behaviour Google warns about — it is logged in `docs/worklog.md` as an open
conflict.

## 4. Voice

`docs/voice-guide.md` is measured, so match the measurements, not the vibe:

- median sentence ~12 words; 39 is the ceiling and once per page at most
- first person is the default, not a seasoning
- at least one "מהניסיון שלי", anchored in a real meeting or client
- at least one "what this is not" and one genuine concession
- close on an observation in second person, not a summary paragraph
- consistent address — אתם throughout, or אתן where the field is women
- every number either has a named source, or came from Elad, or is not in the text

**The last test:** swap "אלעד שורתי" for another name. If the page still works,
it is too generic.

```bash
node scripts/audit-voice.mjs
```

## 5. Repetition against the rest of the site

New pages here have repeatedly echoed each other — transition sentences,
framings, whole scaffolds. Check the draft against all 80 pages before building,
and reword what collides. Rewording can introduce a *new* collision; re-run.

## 6. A diagram that belongs to this topic

**Load the `page-visual` skill for this step.** It holds the colour tokens, the
class inventory, the shapes already taken, the RTL traps and how to check the
result.

In short: every authored page has a visual nobody else has — circles, a funnel, a
timeline, a quadrant, a two-track flow, a wireframe, a branching tree, a
lifecycle loop, comparison bars. Pick the shape from the argument the page is
making. Inline SVG, `role="img"`, a `<title>`, a caption.

RTL: `text-anchor="start"` pins the right edge. `end` will clip Hebrew labels
off the left.

## 7. Links in, not only out

Rule 9א wants 1–3 contextual inbound links. A page that ships without them is
born orphaned — the site already carries 28 such pages. Decide where the links
come from and add them in the same change, through `blockInserts` if the source
is a migrated page.

## 8. What is missing from Elad

Before publishing, state plainly what the page could not say because nobody
supplied it — the real client story, the mistake he sees most, his position on
the contested question in that field. Write it at the bottom of a file in
`content/drafts/` and tell Tomer.

The family-business page shipped without this, and it is still open in the
worklog. Do not repeat it silently.

---

## 9. Ship

Follow the `ship` skill. Then add a row to the history table in
`docs/worklog.md`.
