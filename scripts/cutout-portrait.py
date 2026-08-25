# -*- coding: utf-8 -*-
"""
Cut the studio backdrop out of the hero portrait.

The naive version of this keyed on brightness alone and ate the backlit ear,
whose skin is almost as light as the backdrop. What actually separates them is
colour, not luminance:

    backdrop   rgb(202,204,211) … rgb(220,220,226)   neutral, R-B ≈ -10
    lit ear    rgb(174,147,136)                      warm,    R-B ≈ +38

So a pixel counts as backdrop only if it is achromatic (small spread between
channels), not warm (R-B below a small threshold) and bright enough. A flood
fill seeded from the border then removes only backdrop that is actually
connected to the edge, so anything enclosed by the subject survives.

Alpha is a soft ramp across the transition band rather than a hard mask, and
edge pixels get their backdrop tint subtracted so no grey fringe is left when
the portrait sits on the purple hero panel.

Writes assets/brand/portrait-cutout.{png,webp}. The source photo is untouched.
"""
import os
from collections import deque
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
SRC = os.path.join(ROOT, "assets", "images", "2024", "06", "פרופיל-אלעד.jpg")
OUT_DIR = os.path.join(ROOT, "assets", "brand")

MAX_SPREAD = 20     # max channel spread for "achromatic"
MAX_WARMTH = 10     # max R-B for "not skin"
MIN_LUMA = 150      # backdrop is a bright studio sweep
SOFT_SPREAD = 46    # spread at which a pixel is fully subject
FEATHER = 1.1


def main():
    im = Image.open(SRC).convert("RGB")
    w, h = im.size
    px = im.load()

    def classify(p):
        """0 = certainly backdrop, 255 = certainly subject, between = edge."""
        r, g, b = p
        spread = max(r, g, b) - min(r, g, b)
        warmth = r - b
        luma = (r * 299 + g * 587 + b * 114) // 1000
        if luma < MIN_LUMA:
            return 255
        if spread <= MAX_SPREAD and warmth <= MAX_WARMTH:
            return 0
        # soft ramp so anti-aliased edge pixels get partial alpha
        t = max((spread - MAX_SPREAD) / (SOFT_SPREAD - MAX_SPREAD),
                (warmth - MAX_WARMTH) / (SOFT_SPREAD - MAX_WARMTH))
        return max(0, min(255, int(t * 255)))

    conf = [classify(px[x, y]) for y in range(h) for x in range(w)]

    # Flood fill inward from the border, crossing only backdrop-ish pixels.
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
    # Per-pixel classification leaves a stair-stepped edge. Blurring averages the
    # staircase away; the S-curve afterwards pulls the matte back to a ~1px edge
    # so it reads as anti-aliased rather than soft.
    a = a.filter(ImageFilter.GaussianBlur(2.2))
    lo, hi = 86, 170
    curve = []
    for v in range(256):
        t = (v - lo) / (hi - lo)
        t = 0.0 if t < 0 else 1.0 if t > 1 else t
        curve.append(int(255 * t * t * (3 - 2 * t)))   # smoothstep
    a = a.point(curve)
    a = a.filter(ImageFilter.GaussianBlur(FEATHER * 0.5))

    # De-fringe: where alpha is partial the pixel is a blend of subject and the
    # grey sweep, so subtract the backdrop contribution instead of leaving it.
    out = im.convert("RGBA")
    op = out.load()
    ap = a.load()
    BR, BG, BB = 212, 214, 220
    for y in range(h):
        for x in range(w):
            al = ap[x, y]
            if al == 0 or al == 255:
                continue
            r, g, b = px[x, y]
            f = al / 255
            nr = min(255, max(0, int((r - BR * (1 - f)) / f)))
            ng = min(255, max(0, int((g - BG * (1 - f)) / f)))
            nb = min(255, max(0, int((b - BB * (1 - f)) / f)))
            op[x, y] = (nr, ng, nb, al)

    out.putalpha(a)
    out = out.crop(out.getbbox())

    os.makedirs(OUT_DIR, exist_ok=True)
    base = os.path.join(OUT_DIR, "portrait-cutout")
    out.save(base + ".png", optimize=True)
    out.save(base + ".webp", quality=92, method=6)

    kept = sum(1 for v in alpha if v > 127) / (w * h)
    print(f"subject covers {kept:.0%}  ->  {out.size[0]}x{out.size[1]}")
    print("wrote assets/brand/portrait-cutout.png / .webp")


main()
