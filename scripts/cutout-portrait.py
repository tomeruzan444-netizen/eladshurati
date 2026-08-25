# -*- coding: utf-8 -*-
"""
Cut a studio backdrop out of a portrait.

Keying on brightness alone does not work here: on the first portrait it ate a
backlit ear, and on the current one the cream sweater is nearly as light as the
white sweep. What separates subject from backdrop is *colour*:

    backdrop        rgb(254,254,254)   spread 0    R-B 0     perfectly neutral
    cream sweater   rgb(239,232,227)   spread 19   R-B 19    consistently warm
    skin            rgb(191,130,104)   spread 92   R-B 92

So a pixel is backdrop only when it is achromatic (small spread between
channels), not warm, and bright. A flood fill seeded from the border then
removes only backdrop actually connected to the edge, so anything enclosed by
the subject survives.

Alpha is a soft ramp across the transition band, then blurred and pushed
through an S-curve so the edge reads as anti-aliased rather than stair-stepped.
Edge pixels get the backdrop tint subtracted so no pale fringe survives on a
dark panel.

    python scripts/cutout-portrait.py [source] [--spread N] [--warmth N]
                                      [--luma N] [--out name]

Defaults suit a white sweep. The source image is never modified.
"""
import argparse
import os
from collections import deque

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
DEFAULT_SRC = os.path.join(ROOT, "assets", "images", "תמונה חדשה של אלעד שורתי.jpg")
OUT_DIR = os.path.join(ROOT, "assets", "brand")


def build(src, max_spread, max_warmth, min_luma, soft, feather, out_name):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = im.load()

    def classify(p):
        """0 = certainly backdrop, 255 = certainly subject, between = edge."""
        r, g, b = p
        spread = max(r, g, b) - min(r, g, b)
        warmth = r - b
        luma = (r * 299 + g * 587 + b * 114) // 1000
        if luma < min_luma:
            return 255
        if spread <= max_spread and warmth <= max_warmth:
            return 0
        t = max((spread - max_spread) / (soft - max_spread),
                (warmth - max_warmth) / (soft - max_warmth))
        return max(0, min(255, int(t * 255)))

    conf = [classify(px[x, y]) for y in range(h) for x in range(w)]

    alpha = bytearray([255]) * (w * h)
    seen = bytearray(w * h)
    q = deque()

    def seed(x, y):
        i = y * w + x
        if not seen[i] and conf[i] < 128:
            seen[i] = 1
            alpha[i] = conf[i]
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                i = ny * w + nx
                if not seen[i]:
                    seen[i] = 1
                    if conf[i] < 128:
                        alpha[i] = conf[i]
                        q.append((nx, ny))

    a = Image.frombytes("L", (w, h), bytes(alpha))
    a = a.filter(ImageFilter.GaussianBlur(2.0))
    lo, hi = 86, 170
    curve = []
    for v in range(256):
        t = (v - lo) / (hi - lo)
        t = 0.0 if t < 0 else 1.0 if t > 1 else t
        curve.append(int(255 * t * t * (3 - 2 * t)))   # smoothstep
    a = a.point(curve)
    a = a.filter(ImageFilter.GaussianBlur(feather))

    out = im.convert("RGBA")
    op = out.load()
    ap = a.load()
    # Sample the backdrop from a corner rather than assuming a value.
    BR, BG, BB = px[2, 2]
    for y in range(h):
        for x in range(w):
            al = ap[x, y]
            if al == 0 or al == 255:
                continue
            r, g, b = px[x, y]
            f = al / 255
            op[x, y] = (
                min(255, max(0, int((r - BR * (1 - f)) / f))),
                min(255, max(0, int((g - BG * (1 - f)) / f))),
                min(255, max(0, int((b - BB * (1 - f)) / f))),
                al,
            )

    out.putalpha(a)
    box = out.getbbox()
    out = out.crop(box)

    os.makedirs(OUT_DIR, exist_ok=True)
    base = os.path.join(OUT_DIR, out_name)
    out.save(base + ".png", optimize=True)
    out.save(base + ".webp", quality=92, method=6)

    kept = sum(1 for v in alpha if v > 127) / (w * h)
    print(f"backdrop rgb({BR},{BG},{BB})   subject covers {kept:.0%}")
    print(f"cropped to {out.size[0]}x{out.size[1]}  ->  assets/brand/{out_name}.png / .webp")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", nargs="?", default=DEFAULT_SRC)
    ap.add_argument("--spread", type=int, default=8, help="max channel spread still counted as backdrop")
    ap.add_argument("--warmth", type=int, default=8, help="max R-B still counted as backdrop")
    ap.add_argument("--luma", type=int, default=150, help="backdrop must be at least this bright")
    ap.add_argument("--soft", type=int, default=34, help="value at which a pixel is fully subject")
    ap.add_argument("--feather", type=float, default=0.55)
    ap.add_argument("--out", default="portrait-cutout")
    args = ap.parse_args()
    build(args.source, args.spread, args.warmth, args.luma, args.soft, args.feather, args.out)


main()
