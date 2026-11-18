#!/usr/bin/env python3
"""
render_reel_v2.py - the FULL "code to video" pass for /ig-codevideo.

render_video.py proves that code, numbers and captions must be drawn by a
deterministic renderer. This script keeps that rule and adds the two things
the base sample deliberately lacked:

  1. PICTURES  - AI-generated plates in plates/*.png, used as TEXTURE ONLY.
                 They contain no text, no code and no numbers. All glyphs are
                 still Pillow text with the exact brand .ttf fonts.
  2. TTS       - five Kiswahili WAV clips in audio/*.wav (same voice_id),
                 laid out on a timeline by Python, muxed to AAC by ffmpeg.

Usage:
    python3 render_reel_v2.py                    # samples/02-faida-offline-tts.mp4
    python3 render_reel_v2.py --fps 20          # faster smoke test
    python3 render_reel_v2.py --no-plates       # procedural contour only
    python3 render_reel_v2.py --no-voice        # silent, base-renderer parity

Requires: Pillow + ffmpeg (pip install imageio-ffmpeg). No API key.
Outputs:  MP4 (H.264 + AAC), audio/voiceover.wav, samples/02-contact-sheet.jpg,
          samples/02-render-manifest.json.

The AI images are plates, never the source of a claim. The canonical claim,
tagline and guards still come from scenes.json / 09-decisions.md.
"""

import argparse
import array
import json
import math
import subprocess
import sys
import wave
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_video as rv  # noqa: E402  (base deterministic renderer)

W, H = rv.W, rv.H
SR = 48000
GAP = 0.18          # seconds between voice clips
LEAD = 0.15         # first voice starts here (no music under the first 2s)
ATEMPO = 1.10       # gentle tempo fit toward the 20s /ig-reel target
PLATE_DIR = HERE / "plates"
AUDIO_DIR = HERE / "audio"
SAMPLES = HERE / "samples"

VOICE_FILES = ["01-hook.wav", "02-risiti.wav", "03-code.wav",
               "04-sync.wav", "05-payoff.wav"]
BEATS = [(0.0, 2.2, "hook / Wi-Fi off"),
         (2.2, 6.0, "terminal / risiti"),
         (6.0, 10.2, "code / lang: sw"),
         (10.2, 13.6, "receipt / SYNCED"),
         (13.6, 16.0, "payoff / CTA card")]


def rel(p):
    """Repo-relative path for the manifest; fall back to the given path."""
    try:
        return str(Path(p).resolve().relative_to(HERE))
    except ValueError:
        return str(p)


def ffmpeg_exe():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        import shutil
        exe = shutil.which("ffmpeg")
        if not exe:
            raise SystemExit("ffmpeg not found: pip install imageio-ffmpeg")
        return exe


FF = ffmpeg_exe()


# ---------------------------------------------------------------- plates ---
def load_plate(name, alpha=170):
    """AI plate -> 1080x1920 RGBA, darkened to brand navy. Text-free by prompt."""
    im = Image.open(PLATE_DIR / name).convert("RGB")
    im = im.resize((W, H), Image.LANCZOS).convert("RGBA")
    veil = Image.new("RGBA", (W, H), rv.rgba(rv.NAVY, alpha))
    return Image.alpha_composite(im, veil)


def contour_veil(k, strength=0.42):
    """The brand contour motif, faint, over photographic plates."""
    im = rv.PLATES[k].copy()
    a = im.getchannel("A").point(lambda v: int(v * strength))
    im.putalpha(a)
    return im


def prepare_plates(enabled=True):
    if not enabled:
        return {}
    need = ["01-duka.png", "02-contour.png", "03-risiti.png"]
    missing = [n for n in need if not (PLATE_DIR / n).exists()]
    if missing:
        raise SystemExit(f"missing plates: {missing}. Generate them first, or use --no-plates")
    return {
        "duka": load_plate("01-duka.png", 150),
        "contour": load_plate("02-contour.png", 110),
        "risiti": load_plate("03-risiti.png", 160),
    }


# ----------------------------------------------------------------- audio ---
def pcm48(path):
    """ffmpeg: atempo -> 48 kHz mono s16le, return samples as array('h')."""
    tmp = Path("/tmp") / ("v2-" + path.name)
    cmd = [FF, "-y", "-loglevel", "error", "-i", str(path),
           "-filter:a", f"atempo={ATEMPO}", "-ar", str(SR), "-ac", "1",
           "-c:a", "pcm_s16le", str(tmp)]
    subprocess.run(cmd, check=True)
    with wave.open(str(tmp), "rb") as w:
        assert w.getnchannels() == 1 and w.getsampwidth() == 2
        assert w.getframerate() == SR
        return array.array("h", w.readframes(w.getnframes()))


def layout_voice(enabled=True):
    """Place clips sequentially by code; return master PCM, timeline and end."""
    if not enabled:
        return array.array("h", [0]), [], 0.0
    clips, cursor, timeline = [], LEAD, []
    for name in VOICE_FILES:
        path = AUDIO_DIR / name
        if not path.exists():
            raise SystemExit(f"missing TTS clip: {path}")
        data = pcm48(path)
        dur = len(data) / SR
        fade = int(0.035 * SR)
        for i in range(min(fade, len(data) // 2)):
            g = i / fade
            data[i] = int(data[i] * g)
            data[-1 - i] = int(data[-1 - i] * g)
        clips.append((cursor, data))
        timeline.append({"clip": name, "start": round(cursor, 3),
                         "end": round(cursor + dur, 3),
                         "duration": round(dur, 3)})
        cursor += dur + GAP
    end = cursor - GAP
    total = int((end + 0.45) * SR)   # exactly matches `seconds` below
    master = array.array("h", [0]) * total
    for start, data in clips:
        off = int(start * SR)
        for i, s in enumerate(data):
            master[off + i] = max(-32768, min(32767, master[off + i] + s))
    return master, timeline, end


def write_wav(samples, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(samples.tobytes())
    return path


# ----------------------------------------------------------------- video ---
def make_frame(t, seconds, plates, fps):
    """Stretch the base 16s shot timeline over `seconds`, choose a plate."""
    t16 = min(15.999, t * 16.0 / seconds)
    k = int(t * 12) % len(rv.PLATES)
    if not plates:
        base = rv.PLATES[k].copy()
    elif t16 < 2.2:
        base = Image.alpha_composite(plates["duka"], contour_veil(k, 0.30))
    elif t16 < 6.0:
        base = rv.PLATES[k].copy()
    elif t16 < 10.2:
        base = Image.alpha_composite(plates["contour"], contour_veil(k, 0.22))
    elif t16 < 13.6:
        base = Image.alpha_composite(plates["risiti"], contour_veil(k, 0.30))
    else:
        base = rv.PLATES[k].copy()   # payoff paints paper over the whole frame
    for start, end, fn in rv.SHOTS:
        if start <= t16 < end:
            fn(base, t16)
            break
    return base.convert("RGB")


def render_silent(path, seconds, fps, crf, plates):
    cmd = [FF, "-y", "-loglevel", "error", "-f", "rawvideo", "-vcodec",
           "rawvideo", "-s", f"{W}x{H}", "-pix_fmt", "rgb24", "-r", str(fps),
           "-i", "-", "-an", "-c:v", "libx264", "-preset", "veryfast",
           "-crf", str(crf), "-pix_fmt", "yuv420p", "-movflags", "+faststart",
           str(path)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int(fps * seconds)
    try:
        for i in range(total):
            t = i / fps
            proc.stdin.write(make_frame(t, seconds, plates, fps).tobytes())
            if i % (fps * 4) == 0:
                print(f"  {i:4d}/{total} frames  {t:5.2f}s", flush=True)
    finally:
        proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit("ffmpeg video encode failed")


def mux(video, voice, out):
    cmd = [FF, "-y", "-loglevel", "error", "-i", str(video), "-i", str(voice),
           "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac",
           "-b:a", "128k", "-shortest", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)


def contact_sheet(seconds, fps, plates, out):
    marks = [0.06, 0.22, 0.45, 0.68, 0.92]
    thumbs = []
    for m in marks:
        im = make_frame(seconds * m, seconds, plates, fps)
        thumbs.append(im.resize((216, 384), Image.LANCZOS))
    sheet = Image.new("RGB", (1080, 444), rv.rgba(rv.NAVY)[:3])
    for i, im in enumerate(thumbs):
        sheet.paste(im, (i * 216, 0))
    d = ImageDraw.Draw(sheet)
    d.text((16, 398), "CODE -> VIDEO V2  /  5 BEATS  /  KISWAHILI TTS  /  3 PLATES",
           font=rv.FM(20, 500), fill=rv.rgba(rv.PAPER)[:3])
    d.text((16, 424), "text + code drawn by Pillow; AI supplies texture only",
           font=rv.FM(16, 400), fill=rv.rgba(rv.MUTED)[:3])
    sheet.save(out, "JPEG", quality=88)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(SAMPLES / "02-faida-offline-tts.mp4"))
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--crf", type=int, default=28)
    ap.add_argument("--seconds", type=float, default=0.0,
                    help="0 = fit to voiceover (recommended)")
    ap.add_argument("--no-plates", action="store_true")
    ap.add_argument("--no-voice", action="store_true")
    args = ap.parse_args()

    SAMPLES.mkdir(parents=True, exist_ok=True)
    plates = prepare_plates(not args.no_plates)
    voice, timeline, voice_end = layout_voice(not args.no_voice)
    seconds = args.seconds or round(max(16.0, voice_end + 0.45), 2)
    if args.no_voice:
        seconds = args.seconds or 16.0

    voice_wav = AUDIO_DIR / "voiceover.wav"
    if not args.no_voice:
        write_wav(voice, voice_wav)
        print(f"voiceover: {voice_end:.2f}s across {len(timeline)} clips -> {voice_wav}")

    silent = SAMPLES / "02-silent.mp4"
    print(f"rendering {seconds:.2f}s @ {args.fps}fps -> {silent.name}")
    render_silent(silent, seconds, args.fps, args.crf, plates)

    out = Path(args.out)
    if args.no_voice:
        silent.replace(out)
    else:
        mux(silent, voice_wav, out)
        silent.unlink()
    print(f"wrote {out} ({out.stat().st_size // 1024} KB, {seconds:.2f}s, {W}x{H})")

    sheet = SAMPLES / "02-contact-sheet.jpg"
    contact_sheet(seconds, args.fps, plates, sheet)
    print(f"wrote {sheet}")

    scene = rv.SCENE
    manifest = {
        "version": "v2",
        "date": "2026-11-18",
        "skill": "/ig-codevideo",
        "engine": "code-render (Pillow + ffmpeg), NOT an AI video model",
        "scene": scene["id"],
        "account": scene["account"],
        "artifact": scene["artifact"]["url"],
        "claim_sw": scene["claim_sw"],
        "tagline": "Built in Tanzania, for how Tanzania really works.",
        "rule": "AI images are texture only; all code, numbers and captions are real Pillow text",
        "seconds": seconds,
        "fps": args.fps,
        "size": [W, H],
        "plates": sorted(p.name for p in PLATE_DIR.glob("*.png")) if plates else [],
        "voice": {"language": "sw", "clips": timeline,
                  "atempo": ATEMPO, "lead": LEAD, "gap": GAP,
                  "note": "no music, no SFX; burned-in captions on every shot"},
        "beat_map": [{"base_16s": [a, b], "scaled": [round(a * seconds / 16, 2),
                                                     round(b * seconds / 16, 2)],
                      "shot": label} for a, b, label in BEATS],
        "guards": ["no 100% claim", "offline-first, cloud-synced",
                   "prices are starting prices", "Care Plan is a separate service"],
        "outputs": {"mp4": rel(out),
                    "voiceover": rel(voice_wav) if not args.no_voice else None,
                    "contact_sheet": rel(sheet)},
    }
    (SAMPLES / "02-render-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote samples/02-render-manifest.json")


if __name__ == "__main__":
    main()
