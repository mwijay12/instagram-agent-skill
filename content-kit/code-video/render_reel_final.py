#!/usr/bin/env python3
"""
render_reel_final.py - the SHAREABLE cut for @altrawaretechnology.

Starts from render_reel_v2.py (5 beats + 3 AI texture plates + Kiswahili TTS)
and adds exactly what the owner asked for on 18 Nov 2026:

  * the REAL Altraware logo supplied by the owner, at the END of the video
  * Altraware credits on a paper end card
  * "Faida POS ni app na system" (not just "an app")
  * one keyword CTA: "Kama unahitaji app hii leo, comment neno POS."
  * a 6th TTS clip for credits/CTA, same voice, no music (owner adds music)

Rule unchanged: AI images are TEXTURE ONLY. Every glyph, digit, logo and
caption is placed by Pillow with real .ttf fonts. No model draws code, text
or the logo. Source of truth: scenes.json -> faida-offline.final_card.

Usage:
    python3 render_reel_final.py                 # samples/03-faida-offline-FINAL.mp4
    python3 render_reel_final.py --fps 20       # faster smoke test

Requires: Pillow + ffmpeg (pip install imageio-ffmpeg).
"""

import argparse
import array
import json
import math
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_video as rv        # noqa: E402
import render_reel_v2 as v2      # noqa: E402

W, H = rv.W, rv.H
SR = v2.SR
BASE = 20.14                     # seconds of the v2 cut (kept byte-for-byte in timing)
AUDIO_DIR = v2.AUDIO_DIR
SAMPLES = v2.SAMPLES
LOGO = HERE.parent / "assets" / "altraware-logo.png"
SCENE = next(s for s in json.loads((HERE / "scenes.json").read_text(encoding="utf-8"))["scenes"]
             if s["id"] == "faida-offline")
FC = SCENE["final_card"]

OUT_MP4 = SAMPLES / "03-faida-offline-FINAL.mp4"
OUT_SHEET = SAMPLES / "03-contact-sheet.jpg"
OUT_MANIFEST = SAMPLES / "03-render-manifest.json"
OUT_VOICE = AUDIO_DIR / "voiceover-final.wav"


def load_logo():
    if not LOGO.exists():
        raise SystemExit(f"missing real logo: {LOGO}")
    im = Image.open(LOGO).convert("RGBA")
    return im.resize((300, 300), Image.LANCZOS)


# ----------------------------------------------------------------- audio ---
def layout_voice():
    """First 5 clips exactly as v2, then the credits/CTA clip over the end card."""
    master, timeline, _ = v2.layout_voice(True)
    cta = v2.pcm48(AUDIO_DIR / "06-cta.wav")
    fade = int(0.035 * SR)
    for i in range(min(fade, len(cta) // 2)):
        g = i / fade
        cta[i] = int(cta[i] * g)
        cta[-1 - i] = int(cta[-1 - i] * g)
    start = BASE + 0.20
    off = int(start * SR)
    need = off + len(cta) + int(0.45 * SR)
    if len(master) < need:
        master.extend(array.array("h", [0]) * (need - len(master)))
    for i, s in enumerate(cta):
        master[off + i] = max(-32768, min(32767, master[off + i] + s))
    end = start + len(cta) / SR
    timeline.append({"clip": "06-cta.wav", "start": round(start, 3),
                     "end": round(end, 3), "duration": round(len(cta) / SR, 3),
                     "note": "credits + one keyword ask, spoken over the end card"})
    return master, timeline, end


# ----------------------------------------------------------------- frames ---
def end_card(t, total, logo):
    """Paper end card: real logo, Altraware credits, one CTA. All text is Pillow."""
    te = t - BASE
    im = Image.new("RGBA", (W, H), rv.rgba(rv.PAPER))
    d = ImageDraw.Draw(im)

    # paper contour motif, drifting slowly so the credits card is never static
    phase = te * 0.5
    for i in range(26):
        pts = [(x, 100 + i * 72 + 60 * math.sin(x / 300 + i * 0.3 + phase))
               for x in range(-30, W + 31, 30)]
        d.line(pts, fill=rv.rgba(rv.NAVY_700, 22), width=2, joint="curve")

    # header / chrome
    d.text((90, 250), "ALTRAWARE TECHNOLOGY  /  CREDITS", font=rv.FM(26, 600),
           fill=rv.rgba(rv.VIOLET))
    cw = d.textlength(rv.COORDS, font=rv.FM(24, 400))
    d.text((W - 90 - cw, 252), rv.COORDS, font=rv.FM(24, 400), fill=rv.rgba("#4b5570"))
    d.line((90, 310, W - 90, 310), fill=rv.rgba(rv.NAVY, 45), width=2)

    # logo: real asset, revealed 0.6s, never AI-drawn
    p = rv.ease(te / 0.6)
    d.rounded_rectangle((70, 380, 410, 720), radius=22,
                        fill=rv.rgba(rv.NAVY, int(14 * p)),
                        outline=rv.rgba(rv.VIOLET, int(90 * p)), width=2)
    if p > 0:
        size = max(1, int(300 * p))
        lg = logo.resize((size, size), Image.LANCZOS)
        alpha = lg.getchannel("A").point(lambda a, q=p: int(a * q))
        lg.putalpha(alpha)
        im.alpha_composite(lg, (90 + (300 - size) // 2, 400 + (300 - size) // 2))
        d = ImageDraw.Draw(im)

    # staggered credit lines
    credits = [
        ("ALTRAWARE TECHNOLOGY", rv.FD(48, 700), rv.NAVY),
        ("Tunatengeneza app na mifumo ya biashara", rv.FB(32, 400), rv.NAVY),
        ("Faida POS  ·  APP + MFUMO / SYSTEM", rv.FM(28, 600), rv.VIOLET),
        ("@altrawaretechnology  ·  altra.tanzaniareach.com", rv.FM(21, 400), "#4b5570"),
        ("Built in Tanzania, for how Tanzania really works.", rv.FM(20, 400), rv.NAVY),
    ]
    for i, (txt, fnt, col) in enumerate(credits):
        st = 0.45 + i * 0.30
        if te >= st:
            q = rv.ease((te - st) / 0.30)
            yy = 770 + i * 52
            d.text((90, yy), txt, font=fnt,
                   fill=(rv.rgba(col)[0], rv.rgba(col)[1], rv.rgba(col)[2], int(255 * q)))

    # one keyword CTA card
    q = rv.ease((te - 1.55) / 0.30)
    if q > 0:
        d.rounded_rectangle((90, 1080, 800, 1215), radius=20,
                            fill=rv.rgba(rv.VIOLET, int(255 * q)))
        d.text((120, 1098), "UNAHITAJI KUIONA LEO?", font=rv.FM(28, 600),
               fill=rv.rgba(rv.PAPER, int(255 * q)))
        d.text((120, 1148), "COMMENT NENO POS", font=rv.FM(42, 700),
               fill=rv.rgba(rv.PAPER, int(255 * q)))

    # 1.1s-style progress accent while the credits are on screen
    span = max(0.1, total - BASE)
    d.rounded_rectangle((90, 1418, 800, 1426), radius=4, fill=rv.rgba(rv.NAVY_700, 40))
    d.rounded_rectangle((90, 1418, 90 + int(710 * min(1.0, te / span)), 1426),
                        radius=4, fill=rv.rgba(rv.VIOLET))

    rv.caption(d, FC["text_sw"], 1330, color=rv.NAVY, accent=rv.VIOLET, theme="day")
    d.text((90, 1450), "@altrawaretechnology", font=rv.FM(24, 500),
           fill=rv.rgba("#4b5570"))
    stamp = f"{t:05.2f}s"
    d.text((W - 90 - d.textlength(stamp, font=rv.FM(22, 500)), 1450), stamp,
           font=rv.FM(22, 500), fill=rv.rgba(rv.VIOLET))
    return im.convert("RGB")


def make_frame(t, seconds, plates, fps, logo):
    if t < BASE:
        return v2.make_frame(t, BASE, plates, fps)
    return end_card(t, seconds, logo)


def render_silent(path, seconds, fps, crf, plates, logo):
    cmd = [v2.FF, "-y", "-loglevel", "error", "-f", "rawvideo", "-vcodec",
           "rawvideo", "-s", f"{W}x{H}", "-pix_fmt", "rgb24", "-r", str(fps),
           "-i", "-", "-an", "-c:v", "libx264", "-preset", "veryfast",
           "-crf", str(crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(path)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int(fps * seconds)
    try:
        for i in range(total):
            t = i / fps
            proc.stdin.write(make_frame(t, seconds, plates, fps, logo).tobytes())
            if i % (fps * 4) == 0:
                print(f"  {i:4d}/{total} frames  {t:5.2f}s", flush=True)
    finally:
        proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit("ffmpeg encode failed")


def contact_sheet(seconds, fps, plates, logo, out):
    marks = [0.8, 4.0, 8.0, 11.8, 18.5, BASE + 1.4]
    thumbs = []
    for t in marks:
        im = make_frame(t, seconds, plates, fps, logo)
        thumbs.append(im.resize((180, 320), Image.LANCZOS))
    sheet = Image.new("RGB", (1080, 380), rv.rgba(rv.NAVY)[:3])
    for i, im in enumerate(thumbs):
        sheet.paste(im, (i * 180, 0))
    d = ImageDraw.Draw(sheet)
    d.text((16, 330), "FINAL / 6 SHOTS / KISWAHILI TTS / 3 PLATES / REAL LOGO + CREDITS",
           font=rv.FM(19, 500), fill=rv.rgba(rv.PAPER)[:3])
    d.text((16, 356), "text + code + logo drawn by Pillow; owner adds music; nothing posted",
           font=rv.FM(15, 400), fill=rv.rgba(rv.MUTED)[:3])
    sheet.save(out, "JPEG", quality=88)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--crf", type=int, default=28)
    ap.add_argument("--out", default=str(OUT_MP4))
    args = ap.parse_args()

    SAMPLES.mkdir(parents=True, exist_ok=True)
    plates = v2.prepare_plates(True)
    logo = load_logo()
    voice, timeline, voice_end = layout_voice()
    seconds = round(max(BASE + 3.2, voice_end + 0.45), 2)
    v2.write_wav(voice, OUT_VOICE)
    print(f"voiceover: {voice_end:.2f}s across {len(timeline)} clips -> {OUT_VOICE}")

    silent = SAMPLES / "03-silent.mp4"
    print(f"rendering {seconds:.2f}s @ {args.fps}fps -> {silent.name}")
    render_silent(silent, seconds, args.fps, args.crf, plates, logo)

    out = Path(args.out)
    v2.mux(silent, OUT_VOICE, out)
    silent.unlink()
    print(f"wrote {out} ({out.stat().st_size // 1024} KB, {seconds:.2f}s, {W}x{H})")

    contact_sheet(seconds, args.fps, plates, logo, OUT_SHEET)
    print(f"wrote {OUT_SHEET}")

    manifest = {
        "version": "final",
        "date": "2026-11-18",
        "skill": "/ig-codevideo",
        "engine": "code-render (Pillow + ffmpeg) + external Kiswahili TTS",
        "scene": SCENE["id"],
        "account": SCENE["account"],
        "positioning": "Faida POS ni app na system / system, si app tu",
        "claim_sw": SCENE["claim_sw"],
        "tagline": "Built in Tanzania, for how Tanzania really works.",
        "final_card": FC,
        "logo_source": "owner-supplied final_poster_1.png (transparent PNG, unmodified)",
        "cta": SCENE["cta"],
        "cta_note": "Neno moja POS kwa kuchuja chats kwa mkono; hakuna auto-DM wala bot iliyowekwa.",
        "seconds": seconds,
        "base_cut_seconds": BASE,
        "fps": args.fps,
        "size": [W, H],
        "audio": {"language": "sw", "clips": timeline,
                  "music": "NONE - owner adds music in the editor",
                  "sfx": "NONE", "captions": "burned in on every shot"},
        "plates": sorted(p.name for p in v2.PLATE_DIR.glob("*.png")),
        "guards": ["no 100% claim", "offline-first, cloud-synced",
                   "starting prices only", "Care Plan separate service",
                   "no invented domain, no 'official website'"],
        "outputs": {"mp4": v2.rel(out), "voiceover": v2.rel(OUT_VOICE),
                    "contact_sheet": v2.rel(OUT_SHEET)},
        "drive": None,
    }
    OUT_MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
                            encoding="utf-8")
    print(f"wrote {OUT_MANIFEST}")


if __name__ == "__main__":
    main()
