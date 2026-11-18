#!/usr/bin/env python3
"""
render_video.py - the "code to video" path that does NOT ask an AI model to
draw code. It renders a 16-second 1080x1920 Reel from code, using the exact
brand fonts/tokens and the verified faida-offline scene from scenes.json.

This is the proof that standout output is a rendering problem, not a prompt
problem: every glyph is real text, every line of code came from the Altraware
homepage, and the motion uses the motion-lab 0.3 / 0.6 / 1.1s timings.

Usage:
    python3 render_video.py                       # samples/01-faida-offline.mp4
    python3 render_video.py --out /tmp/reel.mp4
    python3 render_video.py --fps 24 --seconds 16
    python3 render_video.py --still 8.0 --out samples/frame-08.png

Requires: Pillow + ffmpeg (or: pip install imageio-ffmpeg).
Fonts: ../assets/fonts/*.ttf. No network, no API key.
"""

import argparse
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
FONTS = HERE.parent / "assets" / "fonts"
SCENES = json.loads((HERE / "scenes.json").read_text(encoding="utf-8"))
SCENE = next(s for s in SCENES["scenes"] if s["id"] == "faida-offline")
BRAND = SCENES["brand"]

W, H = 1080, 1920
NAVY = BRAND["night"]["bg"]
PAPER = BRAND["night"]["fg"]
GOLD = BRAND["night"]["accent"]
VIOLET = BRAND["night"]["contour"]
MUTED = BRAND["night"]["muted"]
NAVY_700 = BRAND["day"]["contour"]
COORDS = BRAND["coords"]


def font(name, size, weight=400):
    f = ImageFont.truetype(str(FONTS / name), size)
    try:
        axes = f.get_variation_axes()
        if axes:
            vals = []
            for a in axes:
                tag = str(a.get("tag") or a.get("name") or "").lower()
                vals.append(weight if ("wght" in tag or "weight" in tag) else a.get("default", 0))
            f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f


FD = lambda s, w=600: font("fraunces-latin-opsz-normal.ttf", s, w)
FI = lambda s, w=600: font("fraunces-latin-opsz-italic.ttf", s, w)
FB = lambda s, w=400: font("inter-latin-wght-normal.ttf", s, w)
FM = lambda s, w=500: font("jetbrains-mono-latin-wght-normal.ttf", s, w)


def rgba(c, a=255):
    h = c.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)


def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def reveal(t, start, dur=0.6):
    return ease((t - start) / dur)


def contour_frames(count=24):
    """Pre-render drifting contour plates once; reuse them across all frames."""
    out = []
    for k in range(count):
        im = Image.new("RGBA", (W, H), rgba(NAVY))
        d = ImageDraw.Draw(im)
        phase = k / count * math.tau
        for i in range(34):
            pts = []
            for x in range(-30, W + 31, 24):
                y = 80 + i * 56
                y += 96 * math.sin(x / 260 + phase + i * 0.22)
                y += 30 * math.sin(x / 97 + phase * 1.6)
                y -= 150 * math.exp(-((x - 760) ** 2) / (2 * 340 ** 2)) * \
                     math.exp(-((y - 900) ** 2) / (2 * 620 ** 2))
                pts.append((x, y))
            d.line(pts, fill=rgba(VIOLET, 48), width=2, joint="curve")
        out.append(im)
    return out


PLATES = contour_frames()


def glass(d, box, fill=(13, 26, 64, 220), edge=(247, 246, 242, 45)):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=26, fill=fill, outline=edge, width=2)
    return layer


def hand_line(d, x1, y1, x2, y2, color, width=9, p=1.0):
    n = 18
    pts = []
    for i in range(n + 1):
        u = i / n * p
        pts.append((x1 + (x2 - x1) * u, y1 + (y2 - y1) * u + 4 * math.sin(u * 8)))
    d.line(pts, fill=color, width=width, joint="curve")


def caption(d, text, y, color=PAPER, size=40, accent=None, theme="night", max_w=720):
    """Burned-in caption, wrapped inside the left 720px so IG's action rail
    never covers a word. theme='day' gets a light panel instead of navy."""
    f = FB(size, 500)
    lines, cur = [], []
    for w in text.split():
        trial = " ".join(cur + [w])
        if cur and d.textlength(trial, font=f) > max_w:
            lines.append(" ".join(cur))
            cur = [w]
        else:
            cur.append(w)
    lines.append(" ".join(cur))
    x0 = 90
    height = len(lines) * (size + 12) + 18
    bg = (7, 16, 34, 215) if theme == "night" else (255, 255, 255, 225)
    d.rounded_rectangle((x0 - 22, y - 12, x0 + max_w + 22, y - 12 + height),
                        radius=12, fill=bg)
    for i, line in enumerate(lines):
        d.text((x0, y + i * (size + 12)), line, font=f, fill=rgba(color))
    if accent:
        d.rectangle((x0 - 22, y - 12, x0 - 16, y - 12 + height), fill=rgba(accent))


def chrome(d, t, theme="night"):
    fg = PAPER if theme == "night" else NAVY
    acc = GOLD if theme == "night" else VIOLET
    mut = MUTED if theme == "night" else "#4b5570"
    d.text((90, 250), "ACT 01 / MIZIZI", font=FM(26, 600), fill=rgba(acc))
    cw = d.textlength(COORDS, font=FM(24, 400))
    d.text((W - 90 - cw, 252), COORDS, font=FM(24, 400), fill=rgba(mut))
    d.line((90, 310, W - 90, 310), fill=rgba(fg, 45), width=2)
    d.text((90, 1450), "@altrawaretechnology", font=FM(24, 500), fill=rgba(mut))
    stamp = f"{t:05.2f}s"
    d.text((W - 90 - d.textlength(stamp, font=FM(22, 500)), 1450), stamp,
           font=FM(22, 500), fill=rgba(acc))


def shot_hook(im, t):
    d = ImageDraw.Draw(im)
    chrome(d, t)
    p = reveal(t, 0.05, 0.3)
    # gold crosshair
    cx, cy = 820, 760
    r = 120 * p
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=rgba(GOLD, 190), width=4)
    d.line((cx - r - 40, cy, cx + r + 40, cy), fill=rgba(GOLD, 90), width=2)
    d.line((cx, cy - r - 40, cx, cy + r + 40), fill=rgba(GOLD, 90), width=2)
    f1, f2 = FD(112, 700), FI(112, 700)
    d.text((90, 420), "MTANDAO", font=f1, fill=rgba(PAPER))
    d.text((90, 540), "UMEKATIKA", font=f1, fill=rgba(PAPER))
    hand_line(d, 90, 690, 660, 690, rgba(GOLD), p=ease((t - 0.4) / 0.6))
    d.text((90, 760), "WI-FI OFF /  MAUZO HAYASIMAMI", font=FM(30, 600), fill=rgba(GOLD, int(255 * p)))
    if t > 0.7:
        d.rounded_rectangle((90, 860, 320, 930), radius=30, fill=rgba(GOLD))
        d.text((126, 878), "OFF", font=FM(30, 700), fill=rgba(NAVY))
    caption(d, "Nazima Wi-Fi kwenye duka. Mauzo hayasimami.", 1330, accent=GOLD)


def shot_terminal(im, t):
    d = ImageDraw.Draw(im)
    chrome(d, t)
    p = reveal(t, 2.3, 0.6)
    ov = glass(d, (90, 400, 990, 1180))
    im.alpha_composite(ov)
    d = ImageDraw.Draw(im)
    d.text((130, 440), "FAIDA POS  /  TERMINAL", font=FM(28, 600), fill=rgba(GOLD))
    d.line((130, 500, 950, 500), fill=rgba(PAPER, 45), width=2)
    d.text((130, 540), "STANDARD ITEM  ·  DEMO", font=FB(40, 400), fill=rgba(PAPER))
    d.text((130, 600), "TZS 15,000", font=FM(52, 700), fill=rgba(GOLD))
    n = 341 + (1 if t > 3.3 else 0)
    d.text((130, 730), f"RISITI  {n:04d}", font=FM(40, 600), fill=rgba(PAPER))
    yy = 840 + int((1 - p) * 60)
    d.text((130, yy), "M-PESA  /  IMEHAKIKIWA", font=FM(34, 600), fill=rgba(GOLD, int(255 * p)))
    d.rounded_rectangle((130, 990, 950, 1090), radius=18, fill=rgba(GOLD, int(255 * p)))
    d.text((170, 1015), "COMPLETE SALE", font=FM(38, 700), fill=rgba(NAVY, int(255 * p)))
    caption(d, "Risiti inatoka. Hakuna kusubiri mtandao.", 1330, accent=GOLD)


def shot_code(im, t):
    d = ImageDraw.Draw(im)
    chrome(d, t)
    ov = glass(d, (90, 430, 990, 1030), fill=(7, 16, 34, 240), edge=(247, 246, 242, 60))
    im.alpha_composite(ov)
    d = ImageDraw.Draw(im)
    d.line((90, 500, 990, 500), fill=rgba(PAPER, 45), width=2)
    for i, c in enumerate((GOLD, VIOLET, MUTED)):
        d.ellipse((120 + i * 30, 458, 134 + i * 30, 472), fill=rgba(c))
    d.text((90, 1060), "REAL CODE · altra.tanzaniareach.com", font=FM(24, 500), fill=rgba(MUTED))
    for i, line in enumerate(SCENE["artifact"]["code"]):
        start = 6.2 + i * 0.6
        if t < start:
            continue
        p = reveal(t, start, 0.3)
        n_chars = max(1, int(len(line) * min(1, (t - start) / 0.45)))
        shown = line[:n_chars]
        col = rgba(GOLD) if '"' in line else rgba(PAPER)
        d.text((140, 560 + i * 92), f"{i+1:02d}", font=FM(30, 400), fill=rgba(MUTED))
        d.text((220, 560 + i * 92), shown, font=FM(32, 500),
               fill=(col[0], col[1], col[2], int(255 * p)))
        if n_chars == len(line) and t < start + 0.6:
            d.rectangle((220 + d.textlength(shown, font=FM(32, 500)) + 6, 566 + i * 92,
                         226 + d.textlength(shown, font=FM(32, 500)) + 6, 608 + i * 92),
                        fill=rgba(GOLD))
    caption(d, "lang: sw iko kwenye code, si kwenye footer.", 1330, accent=GOLD)


def shot_receipt(im, t):
    d = ImageDraw.Draw(im)
    chrome(d, t)
    p = reveal(t, 10.3, 1.1)
    y = 1250 - int(560 * p)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(ov)
    dd.rectangle((250, y, 830, y + 520), fill=rgba(PAPER, 250))
    for i in range(0, 580, 26):
        dd.polygon([(250 + i, y + 520), (263 + i, y + 505), (276 + i, y + 520)],
                   fill=rgba(PAPER, 250))
    im.alpha_composite(ov)
    d = ImageDraw.Draw(im)
    ink = rgba(NAVY)
    d.text((290, y + 40), "FAIDA POS", font=FM(36, 700), fill=ink)
    d.text((290, y + 96), "DEMO · DUKA LA KARIAKOO", font=FM(24, 400), fill=rgba(NAVY_700, 200))
    d.line((290, y + 150, 790, y + 150), fill=rgba(NAVY_700, 90), width=2)
    for i, (a, b) in enumerate((("KITU", "TZS 15,000"), ("MALIPO", "M-PESA"), ("RISITI", "0342"))):
        yy = y + 190 + i * 76
        d.text((290, yy), a, font=FM(30, 500), fill=ink)
        d.text((790 - d.textlength(b, font=FM(30, 700)), yy), b, font=FM(30, 700), fill=ink)
    d.text((290, y + 440), "HAKUNA MTANDAO · BADO INATOKA", font=FM(24, 600), fill=rgba(VIOLET))
    if t > 11.9:
        q = reveal(t, 11.9, 0.3)
        lift = int(20 * (1 - q))
        d.rounded_rectangle((250, 1215 - lift, 830, 1300 - lift),
                            radius=24, fill=rgba(GOLD, int(255 * q)))
        d.text((390, 1238 - lift), "SYNCED", font=FM(46, 700), fill=rgba(NAVY, int(255 * q)))
    caption(d, "Muunganisho ukirudi, kila kitu kina-sync.", 1330, accent=GOLD)


def shot_payoff(im, t):
    d = ImageDraw.Draw(im)
    im.paste(rgba(PAPER)[:3], (0, 0, W, H))
    # paper contour lines
    for i in range(26):
        pts = []
        for x in range(-30, W + 31, 30):
            y = 100 + i * 72 + 60 * math.sin(x / 300 + i * 0.3)
            pts.append((x, y))
        d.line(pts, fill=rgba(NAVY_700, 22), width=2, joint="curve")
    chrome(d, t, theme="day")
    p = reveal(t, 13.7, 0.6)
    d.text((90, 470), "HII NDIYO", font=FD(110, 700), fill=rgba(NAVY))
    d.text((90, 590), "TOFAUTI", font=FI(110, 700), fill=rgba(VIOLET))
    hand_line(d, 90, 740, 620, 740, rgba(VIOLET), p=p)
    d.text((90, 800), "KATI YA DEMO NA MFUMO WA DUKANI", font=FM(30, 600), fill=rgba(NAVY))
    d.rounded_rectangle((90, 980, 560, 1090), radius=20, fill=rgba(VIOLET, int(255 * p)))
    d.text((130, 1010), "COMMENT NENO POS", font=FM(40, 700), fill=rgba(PAPER, int(255 * p)))
    d.text((90, 1220), "BUILT IN TANZANIA, FOR HOW TANZANIA REALLY WORKS.", font=FM(24, 400),
           fill=rgba(NAVY_700, 160))
    caption(d, "Unahitaji kuiona leo? Comment neno POS.", 1330, color=NAVY, accent=VIOLET, theme="day")


SHOTS = [
    (0.0, 2.2, shot_hook),
    (2.2, 6.0, shot_terminal),
    (6.0, 10.2, shot_code),
    (10.2, 13.6, shot_receipt),
    (13.6, 16.0, shot_payoff),
]


def make_frame(t, fps):
    plate = PLATES[int(t * 12) % len(PLATES)].copy()
    im = plate
    for start, end, fn in SHOTS:
        if start <= t < end:
            fn(im, t)
            break
    return im.convert("RGB")


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        raise SystemExit("ffmpeg not found. Install it, or: pip install imageio-ffmpeg")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(HERE / "samples" / "01-faida-offline.mp4"))
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--seconds", type=float, default=16.0)
    ap.add_argument("--crf", type=int, default=30, help="H.264 quality; 26 sharper, 32 smaller")
    ap.add_argument("--still", type=float, help="render one PNG at this timestamp instead of a video")
    args = ap.parse_args()

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    total = int(args.fps * args.seconds)

    if args.still is not None:
        still = Path(args.out)
        if not still.suffix.lower() == ".png":
            still = still.with_suffix(".png")
        make_frame(args.still, args.fps).save(still, "PNG", optimize=True)
        print(f"wrote {still}")
        return 0

    cmd = [ffmpeg_exe(), "-y", "-loglevel", "error",
           "-f", "rawvideo", "-vcodec", "rawvideo", "-s", f"{W}x{H}",
           "-pix_fmt", "rgb24", "-r", str(args.fps), "-i", "-",
           "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", str(args.crf),
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    try:
        for i in range(total):
            t = i / args.fps
            proc.stdin.write(make_frame(t, args.fps).tobytes())
            if i % (args.fps * 4) == 0:
                print(f"  {i:4d}/{total} frames  {t:5.2f}s", flush=True)
    finally:
        proc.stdin.close()
    rc = proc.wait()
    if rc != 0:
        raise SystemExit(f"ffmpeg exited {rc}")
    print(f"wrote {out}  ({out.stat().st_size // 1024} KB, {args.seconds}s, {W}x{H})")


if __name__ == "__main__":
    main()
