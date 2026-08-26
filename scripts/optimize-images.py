# -*- coding: utf-8 -*-
"""
Build responsive derivatives for every image the site actually renders.

WordPress left behind originals that are far larger than any slot they appear
in — one blog thumbnail alone was 1.2 MB for a 380px card. For each referenced
image this writes WebP (and AVIF where the encoder is available) at a few
widths, plus a right-sized fallback in the original format, and records the
result in content/image-derivatives.json for the build to turn into srcset.

Originals under assets/images/ are never modified.
"""
import hashlib
import io
import json
import os
from urllib.parse import unquote

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
DERIV = os.path.join(ROOT, "assets", "derived")
ORIGIN = "https://elad-digital.co.il"
WIDTHS = [400, 700, 1000, 1400]
WEBP_Q = 78
AVIF_Q = 55

try:
    import pillow_avif  # noqa: F401
    HAS_AVIF = True
except Exception:
    HAS_AVIF = False


def local_path(url_or_path):
    """Map a manifest URL or /assets/... path to a file on disk."""
    p = unquote(url_or_path)   # Hebrew filenames arrive percent-encoded
    if p.startswith(ORIGIN):
        p = p[len(ORIGIN):]
    if p.startswith("/wp-content/uploads/"):
        p = "/assets/images/" + p[len("/wp-content/uploads/"):]
    if not p.startswith("/assets/"):
        return None
    return os.path.join(ROOT, p.lstrip("/").replace("/", os.sep))


def collect():
    """Every image the pages reference, plus the brand art the chrome uses."""
    wanted = set()
    with io.open(os.path.join(ROOT, "content", "pages.json"), encoding="utf-8") as fh:
        pages = json.load(fh)
    for page in pages:
        for b in page["blocks"]:
            if b.get("type") == "image" and b.get("src"):
                wanted.add(b["src"])
    for extra in ("/assets/brand/portrait-cutout.png",
                  "/assets/brand/wordmark-dark.png",
                  "/assets/brand/wordmark-navy.png",
                  "/assets/brand/wordmark-white.png"):
        wanted.add(extra)

    # Portfolio screenshots — they live outside pages.json, so pick them up here.
    proj = os.path.join(ROOT, "content", "projects.json")
    if os.path.exists(proj):
        with io.open(proj, encoding="utf-8") as fh:
            for item in json.load(fh):
                if item.get("image"):
                    wanted.add(item["image"])
    return sorted(wanted)


def derive(src_path, rel_key):
    """rel_key doubles as the output filename stem: short, ASCII, collision-free."""
    im = Image.open(src_path)
    im.load()
    ow, oh = im.size
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")

    # Short ASCII names rather than the source filename. Hebrew names with
    # spaces percent-encode to ~150 characters each and appeared a dozen times
    # per <picture>, which pushed the home page HTML up by 20KB — and a space
    # in a srcset URL is unparseable, so it also broke two of them outright.
    stem = rel_key
    folder = DERIV
    os.makedirs(folder, exist_ok=True)

    entry = {"width": ow, "height": oh, "webp": [], "avif": [], "fallback": None}
    widths = [w for w in WIDTHS if w < ow] + [ow]

    for w in widths:
        h = round(oh * w / ow)
        resized = im if w == ow else im.resize((w, h), Image.LANCZOS)

        wp = os.path.join(folder, f"{stem}-{w}.webp")
        resized.save(wp, "WEBP", quality=WEBP_Q, method=6)
        entry["webp"].append({"w": w, "url": to_url(wp), "bytes": os.path.getsize(wp)})

        if HAS_AVIF:
            av = os.path.join(folder, f"{stem}-{w}.avif")
            resized.save(av, "AVIF", quality=AVIF_Q)
            entry["avif"].append({"w": w, "url": to_url(av), "bytes": os.path.getsize(av)})

    # One fallback in a universally supported format, sized for the largest slot.
    fw = min(1400, ow)
    fb_img = im if fw == ow else im.resize((fw, round(oh * fw / ow)), Image.LANCZOS)
    if has_alpha:
        fb = os.path.join(folder, f"{stem}-{fw}.png")
        fb_img.save(fb, "PNG", optimize=True)
    else:
        fb = os.path.join(folder, f"{stem}-{fw}.jpg")
        fb_img.convert("RGB").save(fb, "JPEG", quality=82, optimize=True, progressive=True)
    entry["fallback"] = {"w": fw, "url": to_url(fb), "bytes": os.path.getsize(fb)}
    return entry


def to_url(path):
    return "/" + os.path.relpath(path, ROOT).replace(os.sep, "/")


def main():
    os.makedirs(DERIV, exist_ok=True)
    out = {}
    before = after = 0
    skipped = []

    for src in collect():
        p = local_path(src)
        if not p or not os.path.exists(p):
            skipped.append(src)
            continue
        if os.path.splitext(p)[1].lower() in (".svg", ".gif"):
            continue
        # Folder keyed by a hash of the source path, not its position in the
        # list: adding an image used to shift every index after it, so two
        # different pictures ended up sharing a folder.
        key = hashlib.sha1(src.encode("utf-8")).hexdigest()[:8]
        try:
            entry = derive(p, key)
        except Exception as err:
            skipped.append(f"{src} ({err})")
            continue
        out[src] = entry
        before += os.path.getsize(p)
        # what a modern browser would actually pull for a ~700px slot
        pick = min((c for c in entry["webp"] if c["w"] >= 700), key=lambda c: c["w"],
                   default=entry["webp"][-1])
        after += pick["bytes"]

    with io.open(os.path.join(ROOT, "content", "image-derivatives.json"), "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)

    print(f"avif encoder: {'yes' if HAS_AVIF else 'no (webp only)'}")
    print(f"{len(out)} images processed")
    print(f"originals            {before/1048576:.1f} MB")
    print(f"served at ~700px     {after/1048576:.1f} MB   ({100 - after/before*100:.0f}% smaller)")
    if skipped:
        print(f"skipped {len(skipped)}:")
        for s in skipped[:8]:
            print("  " + s)


main()
