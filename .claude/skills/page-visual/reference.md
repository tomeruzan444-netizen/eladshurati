# The site's visual language

Everything here is read off the codebase, not invented. When it drifts, re-read
`src/styles/tokens.css` and `src/styles/components.css` rather than trusting
this file.

---

## Colour tokens

Defined in `src/styles/tokens.css`. The SVG never names a colour directly - it
names a class, and the class names a token.

| group | tokens |
|---|---|
| plum (dark ground, headings) | `--plum-900 #1c0024` `--plum-800 #2b0038` `--plum-700 #3d0b4f` `--plum-600 #521769` `--plum-500 #6b2a85` |
| purple (primary) | `--purple-050 #f9f4ff` `--purple-100 #f1e6ff` `--purple-300 #d3aaff` `--purple-500 #ae5dff` `--purple-600 #9647f0` `--purple-ink #7326cf` |
| orange (the accent that means *this one*) | `--orange-100 #ffeadb` `--orange-300 #ffb87a` `--orange-500 #fe7a1d` `--orange-600 #e96a10` `--orange-ink #c04f00` |
| ink | `--ink #1f0b29` `--ink-soft #4a3a54` `--ink-muted #6d5f77` |
| surface | `--surface #ffffff` `--surface-tint #faf8fc` `--surface-page #f5f4f8` `--surface-mist #efedf4` |
| line | `--line #e9e3ef` `--line-strong #d8cfe2` |

**The grammar:** purple is the normal state, orange is the one element the
argument turns on, mist and `--line` are the inert or absent state, plum is
weight. A drawing where everything is orange says nothing.

The site is light-only. There is no dark mode to theme for, which is why these
drawings use classes rather than `currentColor`.

## Class inventory

In `src/styles/components.css`, all prefixed `diagram__`.

| class | what it is for |
|---|---|
| `svg` | the root element; sets the responsive sizing |
| `head` | a title inside the drawing, 24px bold |
| `step` | a primary label on a mark, bold |
| `note` | a secondary label, regular |
| `lever` `logic` `name` | further label weights, used by specific drawings |
| `box` `box--intent` `box--off` | rounded containers; intent = emphasised, off = inert |
| `cell` `cell--best` `cell--off` `cell--lost` | grid squares; best = orange, off = grey, lost = dashed orange |
| `band` `band--end` | wide stages in a journey |
| `bar` `barlabel` | a dark summary bar and its text |
| `node` `node--end` | points on a path; end is orange |
| `dot` | a small neutral marker |
| `axis` | a rule or connector line |
| `tip` | an arrowhead polygon |
| `line` `line--rising` | a series polyline; rising is orange |
| `gap` | a filled area between two series |
| `ring` `ring--family` `ring--management` `ring--ownership` | the three-circle model |
| `core` | the centre of that model |
| `frame` `chrome` | a browser window outline and its bar |
| `box--surface` | a layer that should read lighter than the one around it |
| `cell--open` | a gate in a boundary that was never closed: outlined, dashed |
| `icon` `icon--alert` | line icons, 2.5px stroke, in the figure's own language |
| `rule` | the short orange accent bar under a figure title |
| `eyebrow` | the small orange label above a figure title |
| `tip--alert` | an orange arrowhead, for the one line the argument turns on |

Adding a class is fine when a state genuinely has no representation. Give it a
comment saying what it means, and keep it in the grammar above.

## Shapes already taken

Twelve. Eleven are authored pages, one is a migrated page that got its figure
through a blockInsert. Do not reuse one.

| page | shape | the claim it makes |
|---|---|---|
| `/ייעוץ-עסקי-לעסק-משפחתי/` | three overlapping circles | ownership, management and family are different seats |
| `/שיווק-לקוסמטיקאיות/` | a five-stage journey band | where a new client is lost on the way in |
| `/שיווק-רואי-חשבון/` | a year timeline | when a firm actually has time to market |
| `/פרסום-ושיווק-לעורכי-דין/` | a quadrant grid | case value against search volume |
| `/שיווק-דיגיטלי-לרופאים/` | two stacked page types | knowledge pages bring, intent pages close |
| `/בניית-אתרים-לאדריכלים/` | a page wireframe | what a project page is made of |
| `/בניית-אתרים-לאירועים/` | a branching visitor flow | what happens to a visitor |
| `/בניית-אתר-לחברת-נדלן/` | a lifecycle loop | a project page's life from listing to sold |
| `/בניית-אתר-לבית-מלון/` | a comparison of two paths | the same booking via an OTA or direct |
| `/ייעוץ-עסקי-לפסיכולוגים/` | a week grid under a ceiling | capacity is capped, and where the hours go |
| `/ייעוץ-עסקי-לרואי-חשבון/` | two diverging series | the fee stays flat while the work grows |
| `/ייעוץ-עסקי-למטפלים/` | nested layers with a gate left open | what the outer layer fails to hold, the inner one absorbs |

Shapes not yet used, as a starting point rather than a menu: a stacked bar that
sums to a whole, a matrix of two states against two actors, a nested containment
diagram, a sankey-ish split of one flow into several, a calendar strip, a
decision tree with real branch labels, a stock-and-flow with an accumulating
level, a map-like spatial layout, a waterfall from a starting figure to an
ending one.

## Composition, not only correctness

A figure can be a correct diagram and still look schematic: four rounded
rectangles and an arrow carry the argument but nobody wants to look at them.
What separates the two, in this system:

- **An icon on every repeated element,** drawn in the same stroke language. A
  row of labelled pills becomes a row of gates once each one has a mark.
- **A title block.** Eyebrow, title, and the short orange `rule` beneath it -
  the same treatment the page's own h2 headings get, so the figure belongs.
- **Layers that differ in weight,** not only in size: `box` (light purple) around
  `box--surface` (white) around `box--intent` (orange) reads as depth.
- **One marker per layer, in the same corner.** Consistency across three labels
  does more for the composition than any single ornament.

And the failure that cost three rounds on the therapists figure: patching label
positions one at a time never converges. When two labels collide, re-plan the
whole grid - zones first, then place into them.

## The figure contract

`scripts/lib/authored.mjs` refuses to build a page whose figure breaks this:

```js
{
  type: 'figure',
  caption: '…',                       // required
  html: `<svg class="diagram__svg" viewBox="0 0 W H" role="img"
              aria-labelledby="x-title x-desc">
    <title id="x-title">the one claim</title>
    <desc id="x-desc">what a reader who cannot see it needs</desc>
    …
  </svg>`
}
```

`role="img"` and a `<title>` are checked mechanically. The `<desc>` is not
checked and should still be there - it is the only thing a screen reader gets
beyond the title.

Viewbox widths on this site are 640; heights vary with content (420-620).

## RTL, concretely

- `text-anchor="start"` pins the **right** edge of Hebrew text; `end` pins the
  left. Getting this backwards pushes labels off the canvas.
- Sequences run right to left: step one, year one and Sunday belong at the
  highest x.
- `middle` is the safe choice for a label floating in open space.

## Pages with no visual at all

Currently 22, all migrated. To list them:

```bash
node -e "
const fs=require('fs'),path=require('path')
const read=(d,a=[])=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name); if(e.isDirectory())read(f,a); else if(e.name==='index.html')a.push(f)} return a}
for(const f of read('site')){
  const h=fs.readFileSync(f,'utf8'); const m=h.slice(h.indexOf('<main'),h.indexOf('</main>'))
  const i=m.indexOf('article__main'), j=m.indexOf('article__rail')
  const art=i>=0?m.slice(i, j>i?j:undefined):m
  if(!/diagram__svg|<img|<figure/.test(art)) console.log('/'+decodeURIComponent(path.relative('site',f).split(path.sep).slice(0,-1).join('/'))+'/')
}"
```

A migrated page cannot be edited directly. A figure goes in through a named
`blockInsert` in `scripts/lib/corrections.mjs`, with an anchor that matches
exactly once - adding a drawing never means touching the captured copy.
