"""
Build the favicon set from a single source image.

    python scripts/make-favicon.py <source-image>

The source is a flat two-tone logo - a coloured glyph on white. Three things
have to happen for it to work as a favicon:

  1. The white becomes transparent, so the icon sits on any tab colour. Alpha
     is taken from the blue channel, which is ~0 in the orange and 255 in the
     white, so anti-aliased edges keep their softness instead of going jagged.
     Every pixel is then painted the solid logo colour, so no edge pixel ends
     up a washed-out pink.
  2. The glyph is cropped out of its white margin and re-centred with a small
     even padding. In the source it fills about half the canvas, which at 32px
     would leave a glyph too small to recognise.
  3. Apple's touch icon is flattened onto white, because iOS composites
     transparency onto black and the orange would be unreadable.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "brand"
PAD = 0.08  # share of the final square left as margin on each side


def extract(src: Path):
    im = Image.open(src).convert("RGB")
    r, g, b = im.split()

    # Alpha: white -> 0, the orange -> 255, edges in between.
    alpha = b.point(lambda v: 255 - v)
    lo = min(im.getpixel(xy)[2] for xy in ((im.width // 2, im.height // 2),))
    span = 255 - lo
    if span > 0:
        alpha = alpha.point(lambda v: min(255, int(v * 255 / span)))

    # The glyph colour: the most common non-white pixel.
    counts = {}
    for px in im.resize((128, 128)).getdata():
        if sum(px) < 720:
            counts[px] = counts.get(px, 0) + 1
    colour = max(counts, key=counts.get)

    glyph = Image.new("RGBA", im.size, colour + (0,))
    glyph.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    return glyph.crop(box), colour


def square(glyph: Image.Image, size: int, background=None):
    inner = round(size * (1 - 2 * PAD))
    w, h = glyph.size
    scale = inner / max(w, h)
    art = glyph.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (background or (0, 0, 0, 0)))
    canvas.paste(art, ((size - art.width) // 2, (size - art.height) // 2), art)
    return canvas


def main():
    if len(sys.argv) < 2:
        print("usage: python scripts/make-favicon.py <source-image>")
        return 2
    glyph, colour = extract(Path(sys.argv[1]))
    print(f"glyph {glyph.size[0]}x{glyph.size[1]}, colour #{colour[0]:02X}{colour[1]:02X}{colour[2]:02X}")

    for size in (32, 192, 512):
        path = OUT / f"favicon-{size}.png"
        square(glyph, size).save(path, optimize=True)
        print(f"  {path.name:24} {path.stat().st_size:>6} bytes")

    apple = OUT / "apple-touch-icon.png"
    square(glyph, 180, background=(255, 255, 255, 255)).convert("RGB").save(apple, optimize=True)
    print(f"  {apple.name:24} {apple.stat().st_size:>6} bytes  (flattened on white for iOS)")

    ico = OUT / "favicon.ico"
    square(glyph, 64).save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  {ico.name:24} {ico.stat().st_size:>6} bytes  (16/32/48)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
