---
name: page-visual
description: Add or improve a visual on a page of elad-digital.co.il - an inline-SVG diagram, a chart, or an illustration in the site's design language. Use when Tomer asks for an infographic, a diagram, a design or an image on a page, when a new page needs its own visual, or when a page that has none should get one. Covers what earns a picture, picking a shape nothing else on the site uses, the brand classes, the RTL traps, and how to check the result.
---

# A visual for a page

Spec §8 asks every page to carry a visual element unique to its topic, and the
build refuses an authored page whose figure has no `role="img"`, no `<title>`
and no caption. This skill is about the part the build cannot check: whether the
picture is worth looking at.

Read `reference.md` in this folder before drawing. It holds the colour tokens,
the class inventory, and the eleven shapes already taken.

Two general skills are worth loading alongside this one when they fit:
**`artifact-diagramming`** for the question of whether a picture earns its place
and for inline-SVG craft, and **`dataviz`** when the visual is genuinely a chart
with series, axes and a legend. Neither knows this site - that is what
`reference.md` is for. Where they disagree with it, `reference.md` wins: it
describes a real design system, they describe defaults.

---

## 1. Does this page want a picture at all?

A diagram earns its place when it lets a cold reader see a mechanism they would
otherwise have to assemble from prose. If a sentence says it faster, write the
sentence.

The test that works here: **can you name the one claim the picture makes?**
Write that sentence first. It becomes the `<title>`, and a compressed version
becomes the caption. If you cannot write it, you do not have a diagram yet - you
have a decoration, and decoration on a ranked page is cost without return.

What that rules out: a box labelled with a concept, a list of four services in
rounded rectangles, an arrow between two nouns. Those restate the headings.

## 2. The shape comes from the argument

Draw the mechanism, not its name. The accountants page argues that a fee stays
flat while the work grows, so the drawing is two lines diverging and the wedge
between them filled in. The psychologists page argues that capacity is capped,
so the drawing is a week of slots with a ceiling above it. In both cases the
shape *is* the sentence.

**Then check `reference.md` for what is taken.** Eleven shapes are in use. A
twelfth page that reaches for a funnel because funnels are familiar makes the
site look like a template, which is precisely the thing to avoid. If the
argument genuinely wants a shape that exists, change the argument's framing or
accept a different cut of it - do not ship the same picture twice.

## 3. Draw it in the site's language

Every colour comes from a `.diagram__*` class. **Never a literal hex in the
SVG** - the tokens are the design language, and a hand-picked colour is how a
site stops looking like one site. If a state genuinely has no class, add one to
`src/styles/components.css` with a comment saying what it means, the way
`--lost` and `--gap` were added.

Grid discipline does most of the work: shared baselines, even gaps, repeated
spacing. Eyeballed offsets read as noise even when nobody can say why.

Label the marks, not the legend, unless the same encoding repeats. Explanatory
sentences belong in the caption, never inside the drawing.

## 4. RTL, which is where these go wrong

**`text-anchor="start"` pins the right edge of Hebrew text. `end` pins the
left.** This is the single most common defect here - it has clipped labels off
the canvas more than once. When in doubt use `middle` and place the label in
open space.

Read the numbers back: right-to-left means the first step, the first year or the
first day belongs at the **highest** x value, not the lowest.

## 5. Check it, do not assume it

Render the figure on its own with the real stylesheet, which is faster and more
reliable than scrolling a built page:

```bash
node -e "
const fs=require('fs')
const css=fs.readdirSync('site/assets/css').find(f=>f.endsWith('.css'))
const h=fs.readFileSync('site/<page>/index.html','utf8')
const svg=h.match(/<svg class=\"diagram__svg\"[\s\S]*?<\/svg>/)[0]
fs.writeFileSync('site/__probe.html','<!doctype html><html dir=\"rtl\" lang=\"he\"><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"assets/css/'+css+'\"><style>body{margin:0;background:#fff;padding:20px}</style></head><body>'+svg+'</body></html>')
"
# screenshot http://localhost:4471/__probe.html, then delete site/__probe.html
```

Then look, and check three things:

1. **No label touches a line or another label.** Overlap is the second most
   common defect, and it is invisible in the source.
2. **The counts in the drawing match the counts in the caption.** If the legend
   says twenty, count twenty. This has to be done by eye or by script - nothing
   else checks it.
3. **It survives phone width.** Add the page to the list in
   `scripts/7-mobile.mjs` and run it.

## 6. Raster images

Be straight with Tomer about this rather than quietly substituting.

What is realistic here: vector illustration and composed graphics built from the
same tokens, which stay on-brand and stay sharp at any size. What is not: a
photograph. Generic stock photography is available and is exactly the "generic"
to avoid - a stock photo of a handshake on a consulting page costs trust rather
than building it.

The photographs already on the site are of Elad and of real client work. More of
those come from a shoot or from the clients, not from here.

If a page needs a raster file rather than inline SVG, run it through
`scripts/optimize-images.py` so it gets AVIF and WebP derivatives, and confirm
the AVIF encoder is present first - a regeneration without it strips AVIF from
every image on the site.
