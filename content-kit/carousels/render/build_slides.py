#!/usr/bin/env python3
"""
build_slides.py - render the six carousels as real 1080x1350 PNG files.

This is a deterministic renderer, not an image model. It reads the deck JSON
files (the source of truth), uses the exact fonts and colours from the
motion-lab design tokens, and writes Instagram-ready files plus:

    build/<deck-id>/01.png ... 08.png   upload these, in order
    build/contact-sheet.jpg              all six covers at a glance
    build/index.json                     paths for studio/index.html
    DECKS.md                            all copy, readable and editable

Usage:
    python3 build_slides.py                    # all decks
    python3 build_slides.py --deck 01-offline-first
    python3 build_slides.py --out /tmp/slides

Requires: Pillow (pip install pillow). No network, no API key, no AI model.
Fonts: ../../assets/fonts/*.ttf (SIL OFL 1.1, from motion-lab).
"""

import argparse
import json
import math
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
DECKS = HERE.parent / "decks"
FONTS = HERE.parent.parent / "assets" / "fonts"
OUT = HERE.parent / "build"

W, H = 1080, 1350
SAFE = 120
TOP = 205
BOTTOM = 1230

NAVY = "#071022"
PAPER = "#f7f6f2"
GOLD = "#eab308"
VIOLET = "#7c3aed"
MUTED = "#a3aecb"
NAVY_700 = "#10265c"
GLASS = "#0d1a40"
COORDS = "6.7924° S, 39.2083° E"

# Real code, copied from the Altraware homepage. Never invent syntax here.
CODE_LINES = [
    'const sale = await faida.checkout({',
    '  items, pay: "M-PESA",',
    '  lang: "sw"',
    '})',
]

THEMES = {
    "night": {"bg": NAVY, "fg": PAPER, "accent": GOLD, "contour": VIOLET,
              "muted": MUTED, "rule": (247, 246, 242, 46), "glass": (13, 26, 64, 205),
              "glass_edge": (247, 246, 242, 40)},
    "paper": {"bg": PAPER, "fg": NAVY, "accent": VIOLET, "contour": NAVY_700,
              "muted": "#4b5570", "rule": (7, 16, 34, 40), "glass": (255, 255, 255, 210),
              "glass_edge": (16, 38, 92, 45)},
}


def font(name, size, weight=400):
    path = FONTS / name
    f = ImageFont.truetype(str(path), size)
    try:
        axes = f.get_variation_axes()
        if axes:
            vals = []
            for a in axes:
                tag = (a.get("tag") or a.get("name") or "").lower()
                if "wght" in tag or "weight" in tag:
                    vals.append(weight)
                else:
                    vals.append(a.get("default", a.get("minimum", 0)))
            f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


F_DISPLAY = lambda s, w=400: font("fraunces-latin-opsz-normal.ttf", s, w)
F_ITALIC = lambda s, w=400: font("fraunces-latin-opsz-italic.ttf", s, w)
F_BODY = lambda s, w=400: font("inter-latin-wght-normal.ttf", s, w)
F_MONO = lambda s, w=400: font("jetbrains-mono-latin-wght-normal.ttf", s, w)


def rgba(hex_color, alpha=255):
    h = hex_color.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def contour(draw, theme, seed=0, intensity=1.0):
    """Thin drifting contour lines, the signature of motion-lab's shader."""
    t = THEMES[theme]
    c = rgba(t["contour"], int(70 * intensity))
    cx, cy = W * 0.72, H * 0.52
    for i in range(30):
        phase = seed * 1.7 + i * 0.28
        pts = []
        for x in range(-40, W + 41, 18):
            y = 120 + i * 42
            y += 74 * math.sin(x / 235 + phase)
            y += 26 * math.sin(x / 91 + phase * 1.8)
            # a soft pull towards a high point, like a topographic map
            y -= 96 * math.exp(-((x - cx) ** 2) / (2 * 330 ** 2)) * math.exp(-((y - cy) ** 2) / (2 * 520 ** 2))
            pts.append((x, y))
        draw.line(pts, fill=c, width=2, joint="curve")


def hand_line(draw, x1, y1, x2, y2, color, width=7):
    """A slightly imperfect hand-drawn underline, drawn as one SVG-like path."""
    pts = []
    n = 16
    for i in range(n + 1):
        t = i / n
        pts.append((x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + 3 * math.sin(t * 7)))
    draw.line(pts, fill=color, width=width, joint="curve")


def wrap_words(draw, text, fnt, max_width):
    """Return lines as lists of words that fit max_width."""
    lines, cur = [], []
    for w in text.split():
        trial = " ".join(cur + [w])
        if cur and draw.textlength(trial, font=fnt) > max_width:
            lines.append(cur)
            cur = [w]
        else:
            cur.append(w)
    if cur:
        lines.append(cur)
    return lines


def draw_headline(draw, slide, theme, top):
    t = THEMES[theme]
    text = slide["headline"]
    size = 104 if len(text) <= 28 else (92 if len(text) <= 44 else 78)
    normal = F_DISPLAY(size, 600)
    italic = F_ITALIC(size, 600)
    max_w = W - 2 * SAFE
    lines = wrap_words(draw, text, normal, max_w)
    accent_word = slide.get("accent")
    if not accent_word and slide.get("kicker", "").startswith("ACT"):
        accent_word = re.sub(r"[^\w’'\-]", "", text.split()[-1])
    y = top
    lh = int(size * 1.06)
    for li, line_words in enumerate(lines):
        x = SAFE
        for w in line_words:
            clean = re.sub(r"[^\w’'\-]", "", w)
            is_accent = accent_word and clean.upper() == accent_word.upper()
            f = italic if is_accent else normal
            col = t["accent"] if is_accent else t["fg"]
            draw.text((x, y), w, font=f, fill=col)
            x += draw.textlength(w + " ", font=f)
        y += lh
    return y


def body_lines(draw, body, fnt, max_w):
    out = []
    for raw in body.split("\n"):
        out.extend(wrap_words(draw, raw, fnt, max_w) if raw.strip() else [""])
    return [" ".join(l) if isinstance(l, list) else l for l in out]


def draw_glass(draw, y0, y1, t):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle((SAFE - 20, y0, W - SAFE + 20, y1), radius=28,
                        fill=t["glass"], outline=t["glass_edge"], width=2)
    return ov


def draw_code_window(img, draw, t, y):
    x0, x1 = SAFE, W - SAFE
    y1 = y + 226
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle((x0, y, x1, y1), radius=18, fill=(7, 16, 34, 235),
                        outline=t["glass_edge"], width=2)
    d.line((x0, y + 48, x1, y + 48), fill=t["glass_edge"], width=2)
    for i, c in enumerate(("#eab308", "#7c3aed", "#a3aecb")):
        d.ellipse((x0 + 22 + i * 26, y + 18, x0 + 34 + i * 26, y + 30), fill=c)
    img.alpha_composite(ov)
    mono = F_MONO(25, 500)
    d2 = ImageDraw.Draw(img)
    for i, line in enumerate(CODE_LINES):
        yy = y + 66 + i * 38
        d2.text((x0 + 26, yy), f"{i+1:02d}", font=F_MONO(22, 400), fill=rgba(MUTED, 170))
        color = rgba(GOLD) if '"' in line else rgba(PAPER)
        d2.text((x0 + 82, yy), line, font=mono, fill=color)
    return y1


def draw_phone(img, draw, t, y):
    x0, y0 = W - SAFE - 268, y - 20
    x1, y1 = x0 + 268, y0 + 470
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rounded_rectangle((x0, y0, x1, y1), radius=36, fill=(7, 16, 34, 240),
                        outline=(247, 246, 242, 70), width=3)
    d.rounded_rectangle((x0 + 96, y0 + 14, x1 - 96, y0 + 22), radius=4, fill=(247, 246, 242, 70))
    img.alpha_composite(ov)
    d2 = ImageDraw.Draw(img)
    d2.text((x0 + 24, y0 + 56), "MAUZO YA LEO", font=F_MONO(19, 500), fill=rgba(MUTED))
    for i, (label, val) in enumerate((("Risiti", "0342"), ("Stoo", "IMEI"), ("Malipo", "M-PESA"))):
        yy = y0 + 110 + i * 86
        d2.text((x0 + 24, yy), label, font=F_BODY(24, 400), fill=rgba(PAPER))
        d2.text((x0 + 24, yy + 28), val, font=F_MONO(26, 600), fill=rgba(GOLD))
        d2.line((x0 + 24, yy + 68, x1 - 24, yy + 68), fill=(247, 246, 242, 40), width=1)
    d2.rounded_rectangle((x0 + 24, y1 - 92, x1 - 24, y1 - 30), radius=12, fill=rgba(GOLD))
    d2.text((x0 + 44, y1 - 80), "SYNCED", font=F_MONO(26, 700), fill=rgba(NAVY))
    return y1


def draw_receipt(img, draw, t, y):
    x0, x1 = SAFE + 40, W - SAFE - 40
    y1 = y + 330
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    d.rectangle((x0, y, x1, y1), fill=(247, 246, 242, 245))
    for i in range(0, x1 - x0, 22):
        d.polygon([(x0 + i, y1), (x0 + i + 11, y1 - 13), (x0 + i + 22, y1)],
                  fill=(247, 246, 242, 245))
    img.alpha_composite(ov)
    d2 = ImageDraw.Draw(img)
    ink = rgba(NAVY)
    d2.text((x0 + 34, y + 28), "FAIDA POS", font=F_MONO(24, 700), fill=ink)
    d2.text((x0 + 34, y + 68), "DEMO · DUKA LA KARIAKOO", font=F_MONO(17, 400), fill=rgba(NAVY_700, 190))
    d2.line((x0 + 34, y + 108, x1 - 34, y + 108), fill=rgba(NAVY_700, 90), width=2)
    for i, (a, b) in enumerate((("KITU", "TZS 15,000"), ("MALIPO", "M-PESA"), ("RISITI", "0342"))):
        yy = y + 132 + i * 48
        d2.text((x0 + 34, yy), a, font=F_MONO(21, 400), fill=ink)
        d2.text((x1 - 34 - d2.textlength(b, font=F_MONO(21, 700)), yy), b,
                font=F_MONO(21, 700), fill=ink)
    d2.text((x0 + 34, y1 - 66), "MTANDAO UKIkatika, BADO", font=F_MONO(18, 500), fill=rgba(VIOLET))
    return y1


def draw_grid(img, draw, t, y):
    names = ["loanapp", "Shule-Altra", "tabtune-studio", "faida-pos-releases",
             "RoadSafety_Dar", "techymwijay"]
    mono = F_MONO(23, 500)
    for i, name in enumerate(names):
        col, row = i % 2, i // 2
        x0 = SAFE + col * 430
        yy = y + row * 82
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(ov)
        d.rounded_rectangle((x0, yy, x0 + 400, yy + 64), radius=12,
                            fill=t["glass"], outline=t["glass_edge"], width=2)
        img.alpha_composite(ov)
        d2 = ImageDraw.Draw(img)
        d2.ellipse((x0 + 20, yy + 27, x0 + 30, yy + 37), fill=rgba(t["accent"]))
        d2.text((x0 + 46, yy + 18), name, font=mono, fill=rgba(t["fg"]))
    return y + 3 * 82


def draw_big_number(draw, t, slide, y):
    m = re.search(r"\d[\d.,]*\s*(?:K|M|%|/|·)?", slide["headline"])
    if not m:
        return
    num = m.group(0).strip().rstrip("·/")
    f = F_MONO(210, 700)
    col = rgba(t["accent"], 32 if t is THEMES["night"] else 26)
    draw.text((W - SAFE - draw.textlength(num, font=f), y - 60), num, font=f, fill=col)


def render_slide(deck, slide, index, total, seed):
    theme = slide.get("theme", "night")
    t = THEMES[theme]
    base = Image.new("RGBA", (W, H), rgba(t["bg"]))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    contour(d, theme, seed=seed + index)
    base.alpha_composite(layer)
    img = base
    d = ImageDraw.Draw(img)

    # Header
    d.text((SAFE, 128), slide["kicker"], font=F_MONO(24, 600), fill=rgba(t["accent"]))
    cw = d.textlength(COORDS, font=F_MONO(21, 400))
    d.text((W - SAFE - cw, 130), COORDS, font=F_MONO(21, 400), fill=rgba(t["muted"]))
    d.line((SAFE, 178, W - SAFE, 178), fill=t["rule"], width=2)

    # Headline
    y = draw_headline(d, slide, theme, 268)
    if slide.get("visual") == "numbers":
        draw_big_number(d, t, slide, y)
    hand_line(d, SAFE, y + 26, SAFE + 250, y + 26, rgba(t["accent"]), 8)

    body = slide.get("body", "")
    is_steps = slide.get("visual") == "steps" or "\n" in body
    fnt = F_BODY(38 if not is_steps else 37, 400)
    lines = body_lines(d, body, fnt, W - 2 * SAFE - 70)
    lh = 54 if not is_steps else 62
    by = y + 76
    panel_h = len(lines) * lh + 66
    if by + panel_h > BOTTOM - 60:
        by = BOTTOM - 60 - panel_h
    ov = draw_glass(d, by, by + panel_h, t)
    img.alpha_composite(ov)
    d = ImageDraw.Draw(img)

    for i, line in enumerate(lines):
        yy = by + 30 + i * lh
        if is_steps and line.strip():
            d.rectangle((SAFE + 4, yy + 12, SAFE + 18, yy + 26), fill=rgba(t["accent"]))
            d.text((SAFE + 38, yy), line, font=fnt, fill=rgba(t["fg"]))
        else:
            d.text((SAFE + 4, yy), line, font=fnt, fill=rgba(t["fg"]))

    # Visual furniture, kept below the copy where possible
    visual = slide.get("visual")
    vy = min(by + panel_h + 40, BOTTOM - 250)
    if visual == "code":
        draw_code_window(img, d, t, vy)
    elif visual == "phone":
        draw_phone(img, d, t, max(560, BOTTOM - 500))
    elif visual == "receipt":
        draw_receipt(img, d, t, max(620, BOTTOM - 370))
    elif visual == "grid":
        draw_grid(img, d, t, max(600, BOTTOM - 260))
    elif visual == "swipe":
        d2 = ImageDraw.Draw(img)
        d2.text((SAFE, BOTTOM - 118), "SWIPE →  /  " + deck["keyword"],
                font=F_MONO(28, 600), fill=rgba(t["accent"]))
        d2.ellipse((W - SAFE - 90, BOTTOM - 160, W - SAFE - 10, BOTTOM - 80),
                   outline=rgba(t["accent"]), width=5)
    elif visual == "contour":
        d2 = ImageDraw.Draw(img)
        d2.ellipse((W - SAFE - 210, BOTTOM - 300, W - SAFE - 30, BOTTOM - 120),
                   outline=rgba(t["accent"], 130), width=3)
        d2.line((W - SAFE - 120, BOTTOM - 320, W - SAFE - 120, BOTTOM - 100),
                fill=rgba(t["accent"], 70), width=2)
        d2.line((W - SAFE - 220, BOTTOM - 210, W - SAFE - 20, BOTTOM - 210),
                fill=rgba(t["accent"], 70), width=2)

    # Footer
    d = ImageDraw.Draw(img)
    d.line((SAFE, BOTTOM + 8, W - SAFE, BOTTOM + 8), fill=t["rule"], width=2)
    d.text((SAFE, BOTTOM + 30), deck["handle"], font=F_MONO(23, 500), fill=rgba(t["muted"]))
    num = f"{index:02d}/{total:02d}"
    d.text((W - SAFE - d.textlength(num, font=F_MONO(23, 600)), BOTTOM + 30),
           num, font=F_MONO(23, 600), fill=rgba(t["accent"]))
    d.text((SAFE, BOTTOM + 70), "ROOTED AT HOME · ENGINEERED FOR THE WORLD",
           font=F_MONO(17, 400), fill=rgba(t["muted"], 170))
    return img.convert("RGB")


def write_decks_md(decks):
    out = ["# Carousels - copy-ready", "",
           "Generated from `decks/*.json` by `render/build_slides.py`. Edit the JSON, re-render.",
           "Every caption is Job B (`/ig-caption`): line 1 is the hook, one ask, <= 5 hashtags.",
           ""]
    for d in decks:
        out += [f"## {d['id']} · {d['title']}", "",
                f"- **Akaunti:** {d['account']}  · **Nguzo:** {d['pillar']}  · **Keyword:** `{d['keyword']}`",
                f"- **Lengo:** {d['goal']}  · **Lugha:** {d['language']}", ""]
        for i, s in enumerate(d["slides"], 1):
            out += [f"**{i:02d} · {s['kicker']}**", f"### {s['headline']}", "",
                    s["body"].replace("\n", "  \n"), "", f"_(visual: {s['visual']} · {s['theme']})_", ""]
        out += ["**Caption**", "", "```text", d["caption"], "```", "",
                f"**First comment:** {d['first_comment']}", "",
                f"**Alt text (cover):** {d['alt']}", "",
                f"**Claim note:** {d['claim_note']}", "",
                "**Vyanzo:** " + "; ".join(d["sources"]), "", "---", ""]
    (HERE.parent / "DECKS.md").write_text("\n".join(out), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--deck", help="only render this deck id")
    ap.add_argument("--out", default=str(OUT), help="output directory")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((DECKS / "index.json").read_text(encoding="utf-8"))
    decks = []
    for item in manifest["decks"]:
        if args.deck and args.deck not in item["id"]:
            continue
        decks.append(json.loads((DECKS / item["file"]).read_text(encoding="utf-8")))
    if not decks:
        raise SystemExit("no decks matched")

    covers = []
    built = {}
    for seed, d in enumerate(decks):
        folder = out / d["id"]
        folder.mkdir(parents=True, exist_ok=True)
        paths = []
        for i, s in enumerate(d["slides"], 1):
            img = render_slide(d, s, i, len(d["slides"]), seed * 7)
            p = folder / f"{i:02d}.png"
            img.save(p, "PNG", optimize=True)
            paths.append(str(p.relative_to(out)))
            if i == 1:
                covers.append(img.copy())
        built[d["id"]] = {"paths": paths, "title": d["title"],
                          "account": d["account"], "keyword": d["keyword"]}
        print(f"  {d['id']}: {len(paths)} slides -> {folder}")

    # Contact sheet: six covers, 3 across, scaled down.
    tw, th = 324, 405
    sheet = Image.new("RGB", (3 * tw + 4 * 24, 2 * th + 3 * 24), NAVY)
    for i, c in enumerate(covers[:6]):
        sheet.paste(c.resize((tw, th), Image.LANCZOS),
                    (24 + (i % 3) * (tw + 24), 24 + (i // 3) * (th + 24)))
    sheet.save(out / "contact-sheet.jpg", "JPEG", quality=88, optimize=True)
    (out / "index.json").write_text(json.dumps({"decks": built}, indent=2), encoding="utf-8")
    write_decks_md(decks)
    print(f"  contact-sheet.jpg  DECKS.md  build/index.json")


if __name__ == "__main__":
    main()
