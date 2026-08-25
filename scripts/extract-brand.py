# -*- coding: utf-8 -*-
"""
Extract brand assets from ELAD-SHURATI-branding.pdf.

The brand book is one 1920 x 13604 pt vector page. This pulls out:
  * the symbol ("סמליל") in its three colourways, plus a reversed white version
  * the stacked and horizontal lockups, with the wordmark converted to outlines
  * the three embedded Discovery FS weights

Everything is emitted as tight-viewBox SVG so the site can scale it freely.
"""
import os
import fitz
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

SRC = r"C:/Users/tomer/Downloads/ELAD-SHURATI-branding.pdf"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "assets", "brand"))
# Discovery FS is a commercial licence — keep it out of assets/, which ships.
FONT_OUT = os.path.normpath(os.path.join(HERE, "..", "_source", "brand-fonts"))
os.makedirs(OUT, exist_ok=True)
os.makedirs(FONT_OUT, exist_ok=True)

ORANGE, PURPLE, PLUM = "#FE7A1D", "#AE5DFF", "#2B0038"
# The mark is drawn with a marginally different orange than the swatch; normalise it.
ORANGE_ALIASES = {"#FE710F", "#FD7A1D", "#FE8F00"}


def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def rgb(c):
    if c is None:
        return None
    h = "#%02X%02X%02X" % tuple(round(x * 255) for x in c)
    return ORANGE if h in ORANGE_ALIASES else h


def path_d(items):
    """Join drawing items into continuous subpaths (PyMuPDF hands them over segment by segment)."""
    out, cur = [], None
    for it in items:
        op = it[0]
        if op == "l":
            p1, p2 = it[1], it[2]
            if cur is None or (abs(cur.x - p1.x) > 0.01 or abs(cur.y - p1.y) > 0.01):
                out.append(f"M{fmt(p1.x)} {fmt(p1.y)}")
            out.append(f"L{fmt(p2.x)} {fmt(p2.y)}")
            cur = p2
        elif op == "c":
            p1, p2, p3, p4 = it[1], it[2], it[3], it[4]
            if cur is None or (abs(cur.x - p1.x) > 0.01 or abs(cur.y - p1.y) > 0.01):
                out.append(f"M{fmt(p1.x)} {fmt(p1.y)}")
            out.append(f"C{fmt(p2.x)} {fmt(p2.y)} {fmt(p3.x)} {fmt(p3.y)} {fmt(p4.x)} {fmt(p4.y)}")
            cur = p4
        elif op == "re":
            r = it[1]
            out.append(f"M{fmt(r.x0)} {fmt(r.y0)}H{fmt(r.x1)}V{fmt(r.y1)}H{fmt(r.x0)}Z")
            cur = None
        elif op == "qu":
            q = it[1]
            out.append(
                f"M{fmt(q.ul.x)} {fmt(q.ul.y)}L{fmt(q.ur.x)} {fmt(q.ur.y)}"
                f"L{fmt(q.lr.x)} {fmt(q.lr.y)}L{fmt(q.ll.x)} {fmt(q.ll.y)}Z"
            )
            cur = None
    if out:
        out.append("Z")
    return "".join(out)


def shapes_in(drawings, clip):
    """Drawings fully inside clip, ignoring background panels."""
    found = []
    for dr in drawings:
        r = dr["rect"]
        if not (r.x0 >= clip.x0 - 1 and r.x1 <= clip.x1 + 1 and r.y0 >= clip.y0 - 1 and r.y1 <= clip.y1 + 1):
            continue
        if r.get_area() > clip.get_area() * 0.6:
            continue
        found.append(dr)
    return found


def write_svg(name, shapes, label, recolour=None, extra_paths=()):
    parts = []
    boxes = []
    for dr in shapes:
        d = path_d(dr["items"])
        if not d:
            continue
        fill = recolour or rgb(dr.get("fill")) or "none"
        rule = ' fill-rule="evenodd"' if dr.get("even_odd") else ""
        parts.append(f'<path fill="{fill}"{rule} d="{d}"/>')
        boxes.append(dr["rect"])
    for fill, d, box in extra_paths:
        parts.append(f'<path fill="{recolour or fill}" d="{d}"/>')
        boxes.append(box)
    if not parts:
        print(f"  !! {name}: empty")
        return

    bbox = fitz.Rect(boxes[0])
    for b in boxes[1:]:
        bbox |= b
    pad = max(bbox.width, bbox.height) * 0.015
    bbox += (-pad, -pad, pad, pad)

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fmt(bbox.x0)} {fmt(bbox.y0)} '
        f'{fmt(bbox.width)} {fmt(bbox.height)}" role="img" aria-label="{label}">'
        + "".join(parts)
        + "</svg>\n"
    )
    with open(os.path.join(OUT, f"{name}.svg"), "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"  {name}.svg  {len(parts)} paths  {fmt(bbox.width)}x{fmt(bbox.height)}")


def glyph_paths(page, clip, fonts):
    """Outline every glyph drawn inside clip, using the embedded font files."""
    result = []
    for span in page.get_texttrace():
        chars = [c for c in span["chars"] if clip.contains(fitz.Point(c[2], c[3]))]
        if not chars:
            continue
        fname = span["font"]
        tt = fonts.get(fname)
        if tt is None:
            continue
        upm = tt["head"].unitsPerEm
        gs = tt.getGlyphSet()
        order = tt.getGlyphOrder()
        size = span["size"]
        colour = "#%02X%02X%02X" % (
            (span["color"] >> 16) & 255, (span["color"] >> 8) & 255, span["color"] & 255
        ) if isinstance(span["color"], int) else rgb(span["color"])
        colour = ORANGE if colour in ORANGE_ALIASES else colour

        for gid, _uni, ox, oy, _adv in [(c[0], c[1], c[2], c[3], c[4]) for c in chars]:
            if gid >= len(order):
                continue
            pen = SVGPathPen(gs, ntos=lambda v: fmt(v))
            gs[order[gid]].draw(pen)
            d = pen.getCommands()
            if not d:
                continue
            s = size / upm
            # PDF text space is y-up; the page SVG is y-down.
            result.append((colour, d, ox, oy, s))
    return result


def transform_glyphs(glyphs):
    """Bake each glyph's placement into its path data and report a bbox."""
    out = []
    import re as _re
    num = _re.compile(r"-?\d*\.?\d+")
    for colour, d, ox, oy, s in glyphs:
        coords = []

        def sub(text):
            toks = _re.split(r"([MLCQZmlcqz])", text)
            res, buf = [], []
            for t in toks:
                if not t:
                    continue
                if t.strip() in "MLCQZmlcqz":
                    res.append(t.strip())
                else:
                    vals = [float(v) for v in num.findall(t)]
                    pts = []
                    for i in range(0, len(vals) - 1, 2):
                        x = ox + vals[i] * s
                        y = oy - vals[i + 1] * s
                        coords.append((x, y))
                        pts.append(f"{fmt(x)} {fmt(y)}")
                    res.append(" ".join(pts))
            return "".join(a + (b if b else "") for a, b in zip(res[0::2], res[1::2] + [""]))

        nd = sub(d)
        if not coords:
            continue
        xs = [c[0] for c in coords]
        ys = [c[1] for c in coords]
        out.append((colour, nd, fitz.Rect(min(xs), min(ys), max(xs), max(ys))))
    return out


def main():
    doc = fitz.open(SRC)
    page = doc[0]
    drawings = page.get_drawings()

    # ---- fonts -------------------------------------------------------------
    fonts = {}
    for xref, ext, _typ, name, _ref, _enc, _ in [f + (0,) if len(f) == 6 else f for f in page.get_fonts(full=True)]:
        if ext != "ttf":
            continue
        fname, fext, _t, buf = doc.extract_font(xref)
        dest = os.path.join(FONT_OUT, f"{fname}.{fext}")
        with open(dest, "wb") as fh:
            fh.write(buf)
        if fname.startswith("Discovery"):
            print(f"  font {fname}.{fext}  {len(buf)//1024}KB")
        fonts[fname] = TTFont(dest)

    # ---- symbol, three colourways -----------------------------------------
    row = fitz.Rect(1100, 3380, 1860, 3640)
    marks = sorted(shapes_in(drawings, row), key=lambda d: d["rect"].x0)
    # Three marks side by side; each is two overlapping strokes.
    groups, current = [], []
    for m in marks:
        if current and m["rect"].x0 > current[-1]["rect"].x1 + 20:
            groups.append(current)
            current = []
        current.append(m)
    if current:
        groups.append(current)
    print(f"  symbol groups found: {[len(g) for g in groups]}")
    names = ["mark-orange", "mark-purple", "mark-duotone"]
    for name, grp in zip(names, groups):
        write_svg(name, grp, "Elad Shurati")
    if len(groups) == 3:
        write_svg("mark-white", groups[2], "Elad Shurati", recolour="#FFFFFF")
        write_svg("mark-plum", groups[2], "Elad Shurati", recolour=PLUM)

    # ---- lockups (symbol + outlined wordmark) ------------------------------
    for name, clip, label in [
        ("logo-stacked", fitz.Rect(600, 9500, 1320, 10250), "Elad Shurati — יעוץ עסקי, שיווק, אסטרטגיה"),
        ("logo-horizontal", fitz.Rect(500, 10780, 1420, 11060), "Elad Shurati — יעוץ עסקי, שיווק, אסטרטגיה"),
    ]:
        shapes = shapes_in(drawings, clip)
        glyphs = transform_glyphs(glyph_paths(page, clip, fonts))
        print(f"  {name}: {len(shapes)} shapes + {len(glyphs)} glyphs")
        write_svg(name, shapes, label, extra_paths=glyphs)
        white_glyphs = [("#FFFFFF", d, b) for _c, d, b in glyphs]
        write_svg(f"{name}-white", shapes, label, recolour="#FFFFFF", extra_paths=white_glyphs)


main()
