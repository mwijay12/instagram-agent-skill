#!/usr/bin/env python3
"""
promptgen.py - build a paste-ready, non-generic "code to video" prompt.

Why this exists: a prompt like "make a video about my POS app" has no artifact,
no brand tokens, no shot list and no negative prompt, so a model fills the gaps
with laptop/globe/gradient cliches. This script composes a 7-layer prompt from
verified facts in scenes.json, so every clip starts from something real.

Usage:
    python3 promptgen.py --list
    python3 promptgen.py --scene faida-offline --lang sw
    python3 promptgen.py --scene faida-offline --engine editor --lang en
    python3 promptgen.py --scene faida-offline --engine remotion --lang en
    python3 promptgen.py --all            # write every combination to prompts/
    python3 promptgen.py --scene faida-offline --out /tmp/my-prompt.txt

Engines:
    ai-video  Veo / Sora / Runway / Kling style. TEXTURE ONLY: the model must
              not draw code or readable type; composite those afterwards.
    editor    A human editing brief: what to screen-record, cuts, captions,
              audio, export. No generative model involved.
    remotion  A deterministic React/Remotion spec. The code is rendered by a
              browser, so it is readable every single frame.

Stdlib only. No API key, no network.
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = json.loads((HERE / "scenes.json").read_text(encoding="utf-8"))
SCENES = {s["id"]: s for s in DATA["scenes"]}
NEG = DATA["common_negative"]
BRAND = DATA["brand"]

HEADINGS = {
    "en": ["OUTPUT", "SOURCE OF TRUTH", "STORY", "SHOT LIST", "BRAND BLOCK",
           "TYPOGRAPHY AND CAPTIONS", "AUDIO", "NEGATIVE PROMPT", "QA GATE"],
    "sw": ["MATOKEO", "CHANZO CHA UKWELI", "HADITHI", "ORODHA YA SHOTI",
           "BLOCK YA BRAND", "MAANDISHI NA CAPTIONS", "SAUTI", "YALIYOKATAZWA", "LANGO LA QA"],
}


def brand_block():
    n, d, m = BRAND["night"], BRAND["day"], BRAND["motion"]
    return f"""BRAND (non-negotiable, from the client's own design tokens):
Vertical 9:16, 1080x1920. Navy {n['bg']} background, paper {n['fg']} text,
gold {n['accent']} as the ONE accent at night, violet {d['accent']} as the ONE
accent on paper sections. Contour lines {n['contour']} on navy, {d['contour']}
on paper, opacity 0.12-0.35, drifting slowly. Muted metadata {n['muted']}.
Type: Fraunces (display serif, italic for exactly one word), Inter (body),
JetBrains Mono (code, numbers, coordinates). No other fonts.
Signature marks: "{BRAND['coords']}" in mono top-right; ACT 01 / MIZIZI style
mono kicker; a glass panel behind long copy; a real code window with line
numbers; a thermal receipt or a phone showing SYNCED; one hand-drawn underline.
Motion: {m['fast']}s / {m['base']}s / {m['slow']}s, ease {m['ease']},
transform + opacity only, a visible frame change every 2.5s or sooner.
Bilingual: Kiswahili for the human line, English for the technical line.
Never translate the same sentence twice on one frame.
No logo animation, no intro card, no "who we are" slide.
Safe zone (Reels): {BRAND['safe_reel']}. Safe zone (carousels): {BRAND['safe_carousel']}."""


def negative_block():
    lines = ", ".join(NEG)
    return "NEGATIVE / DO NOT GENERATE:\n" + lines + "."


def shot_list(scene, lang):
    out = []
    for b in scene["beats"]:
        text = b["text_sw"] if lang == "sw" else b["text_en"]
        out.append(f"  {b['t']:12} | {b['visual']}\n"
                   f"                 | ON SCREEN / SPOKEN: {text}\n"
                   f"                 | MOTION: {b['motion']}")
    return "\n".join(out)


def source_block(scene, lang):
    a = scene["artifact"]
    what = a["what_sw"] if lang == "sw" else a["what_en"]
    numbers = "\n".join(f"  - {n}" for n in a["numbers"])
    code = "\n".join(f"  {l}" for l in a["code"])
    return f"""Artifact : {what}
Repo    : {a['repo']}  ({a['url']})
Live    : {a.get('live') or 'n/a'}
Numbers you may state (and nothing else):
{numbers}
Code to composite (rendered as real text, NOT imagined by the model):
{code}
Code source: {a['code_source']}
Code label : {a.get('code_label', 'REAL - copied from source')}
Sources : {', '.join(scene['sources'])}
GUARD   : {scene['guard']}"""


def qa_gate(lang):
    if lang == "sw":
        return """QA GATE (usikubali clip kabla yote hayajapita):
  [ ] Frame 1 ina kitu halisi, si salamu wala "leo tutaonyesha".
  [ ] Kuna mabadiliko ya frame ndani ya sekunde 2.5 kila mahali.
  [ ] Namba moja tu kubwa, na ina chanzo kwenye SOURCE OF TRUTH.
  [ ] Rangi ni navy/paper na accent MOJA. Hakuna gradient.
  [ ] Code inasomeka na imetoka kwenye repo/tokens, haijazuliwa.
  [ ] Maandishi ya kwanza ni Kiswahili; yale ya kiufundi ni English.
  [ ] Captions zimeburniwa (watu wanaanza muted).
  [ ] Ask MOJA tu mwishoni; keyword inatamkwa.
  [ ] Hakuna kitu chochote kutoka YALIYOKATAZWA.
  [ ] Hakuna jina la mteja, asilimia, wala ushuhuda usiothibitishwa.
  [ ] Hakuna URL wala logo sting.
  [ ] Imeangaliwa kwenye simu, 1080x1920, sauti ikiwa imezimwa."""
    return """QA GATE (do not accept the clip until all pass):
  [ ] Frame 1 shows a real artifact, not a greeting or a preamble.
  [ ] A visible frame change happens at least every 2.5 seconds.
  [ ] Exactly one large number, and it is in SOURCE OF TRUTH.
  [ ] Colours are navy/paper with ONE accent. No gradient.
  [ ] Code is readable and came from the repo/tokens, not the model.
  [ ] The first line is Kiswahili; the technical line is English.
  [ ] Captions are burned in (most viewers start muted).
  [ ] ONE ask at the end, and the keyword is spoken.
  [ ] Nothing from the NEGATIVE list appears.
  [ ] No client name, percentage or unverified testimonial.
  [ ] No URL on screen, no logo sting.
  [ ] Checked on a phone at 1080x1920 with the sound off."""


def ai_video(scene, lang):
    h = HEADINGS[lang]
    hook = scene["hook"]["sw"] if lang == "sw" else scene["hook"]["en"]
    onscreen = scene["hook"]["onscreen_sw"] if lang == "sw" else scene["hook"]["onscreen_en"]
    claim = scene["claim_sw"] if lang == "sw" else scene["claim_en"]
    payoff = scene["payoff_sw"] if lang == "sw" else scene["payoff_en"]
    intro = ("Tengeneza clip moja ya wima kwa texture tu. USIJARIBU kuchora code wala "
             "maandishi yanayosomeka; hayo yatawekwa baadaye kwenye compositor."
             if lang == "sw" else
             "Produce ONE vertical clip as TEXTURE ONLY. Do NOT attempt to draw code or "
             "readable typography; those are composited afterwards in the edit.")
    return f"""# PROMPT / {scene['id']} / AI-VIDEO / {lang.upper()}
# generated by promptgen.py from scenes.json on {date.today().isoformat()}
# Paste everything below this line into the video model.
# ---------------------------------------------------------------------------

## 0. {h[0]}
{intro}
Single 9:16 clip, 1080x1920, 24fps, 16-18 seconds, no baked-in music.
Deliver the background plates and the physical actions listed below. Leave
clean space at y=230..1440 and the right 230px for composited type.

## 1. {h[1]} (do not contradict, do not add anything)
{source_block(scene, lang)}

## 2. {h[2]}
HOOK (first 2 seconds, spoken): "{hook}"
ON SCREEN AT FRAME 1: "{onscreen}"
CLAIM (one sentence, no adjectives): "{claim}"
PAYOFF: "{payoff}"
ONE ASK: "{scene['cta']['sw'] if lang == 'sw' else scene['cta']['en']}" (keyword {scene['cta']['keyword']})
Hook formula id: #{scene['hook']['formula']} from skills/ig-reel/hooks.json

## 3. {h[3]} (one visual change per beat, every <= 2.5s)
{shot_list(scene, lang)}

## 4. {h[4]}
{brand_block()}

## 5. {h[5]}
Composite AFTER generation, as real text: Fraunces 120px for the headline,
Inter 44px for the body, JetBrains Mono 30px for code, numbers and coordinates.
On-screen cards are six words or fewer. Hook card is present at frame 1.
Burn in captions for every spoken line. Keep every word inside the safe zone.

## 6. {h[6]}
{scene['audio']}

## 7. {h[7]}
{negative_block()}

## 8. {h[8]}
{qa_gate(lang)}
"""


def editor(scene, lang):
    h = HEADINGS[lang]
    hook = scene["hook"]["sw"] if lang == "sw" else scene["hook"]["en"]
    onscreen = scene["hook"]["onscreen_sw"] if lang == "sw" else scene["hook"]["onscreen_en"]
    return f"""# EDITOR BRIEF / {scene['id']} / {lang.upper()}
# generated by promptgen.py from scenes.json on {date.today().isoformat()}
# No AI video model. A phone, a screen recorder, and an editor.

## 0. {h[0]}
One vertical Reel, 1080x1920, 24 or 30fps, 16-18s, H.264, captions burned in.
Export at 1080x1920 with the audio at -14 LUFS. No template pack, no intro.

## 1. {h[1]}
{source_block(scene, lang)}

## 2. {h[2]}
HOOK (say it, do not write "habari"): "{hook}"
FRAME 1 CARD: "{onscreen}"
CLAIM: "{scene['claim_sw'] if lang == 'sw' else scene['claim_en']}"
ASK (one): "{scene['cta']['sw'] if lang == 'sw' else scene['cta']['en']}"

## 3. {h[3]} - RECORD THESE, IN ORDER
{shot_list(scene, lang)}

RECORDING NOTES
- Screen record at 1080x1920 or crop a 1440p capture; hide bookmarks, cursor
  halos, notifications and your desktop wallpaper.
- Every code line must be real text from the source above. Never let an AI
  model generate a code frame. If a line is illustrative, keep its label.
- Capture the Wi-Fi toggle, the receipt and the SYNCED state for real. A
  simulated state is fine only if the caption says DEMO, as on the receipt.
- Hold each shot 2.5s maximum. Cut on the beat; do not Ken Burns a still.
- Frame 1 must move. No static title card, no logo sting.

EDIT ORDER
1. Lay the hook shot at 0:00. Trim all pre-roll.
2. Add the on-screen card at frame 1 (Fraunces 120px, six words or fewer).
3. Add code/receipt/phone plates, each <= 2.5s, with a 0.3s snap between them.
4. Burn in captions line by line, 44px Inter, inside y=230..1440.
5. Add the audio listed below. Duck nothing; there is no music bed.
6. Night -> paper section change once, at the timecode in the shot list.
7. Last frame: one keyword. Nothing else. Loop the first word if possible.

## 4. {h[4]}
{brand_block()}

## 5. {h[6]}
{scene['audio']}

## 6. {h[7]}
{negative_block()}

## 7. {h[8]}
{qa_gate(lang)}
"""


def remotion(scene, lang):
    a = scene["artifact"]
    h = HEADINGS[lang]
    props = {
        "sceneId": scene["id"],
        "hook": scene["hook"]["onscreen_sw"] if lang == "sw" else scene["hook"]["onscreen_en"],
        "spokenHook": scene["hook"]["sw"] if lang == "sw" else scene["hook"]["en"],
        "claim": scene["claim_sw"] if lang == "sw" else scene["claim_en"],
        "keyword": scene["cta"]["keyword"],
        "code": a["code"],
        "codeLabel": a.get("code_label", ""),
        "numbers": a["numbers"],
        "beats": [{"t": b["t"], "visual": b["visual"],
                   "text": b["text_sw"] if lang == "sw" else b["text_en"]} for b in scene["beats"]],
        "palette": BRAND["night"],
        "fonts": BRAND["fonts"],
        "motion": BRAND["motion"],
        "coords": BRAND["coords"],
    }
    return f"""# REMOTION SPEC / {scene['id']} / {lang.upper()}
# generated by promptgen.py from scenes.json on {date.today().isoformat()}
# Deterministic render: the browser types real code. No AI video model.

## 0. {h[0]}
Composition: 1080x1920, 30fps, {sum(1 for _ in scene['beats']) * 3 + 3}s, H.264.
Output: out/{scene['id']}.mp4. Fonts: local .woff2 in content-kit/assets/fonts.

## 1. {h[1]}
{source_block(scene, lang)}

## 2. COMPONENT TREE
<Root>                         one accent, all tokens from CSS custom props
  <ContourField />             30 sine paths, drift with useCurrentFrame(), 1.1s loop
  <Chrome />                   kicker + coordinates in JetBrains Mono
  <Beat i={{0}}>               hook card, snap 0.3s, text at frame 1
  <CodeWindow lines={{props.code}} />   one line per 0.6s, gold strings only
  <ArtifactPlate />            receipt / phone / chart, chosen by scene id
  <PaperCut />                 navy -> paper, 0.6s, once
  <Payoff />                   one keyword, no second ask

## 3. TIMELINE (constants, in frames at 30fps)
const FAST = 9;        // {BRAND['motion']['fast']}s
const BASE = 18;       // {BRAND['motion']['base']}s
const SLOW = 33;       // {BRAND['motion']['slow']}s
const EASE = '{BRAND['motion']['ease']}';
{shot_list(scene, lang)}

## 4. PROPS (paste into src/scenes/{scene['id']}.ts)
{json.dumps(props, indent=2, ensure_ascii=False)}

## 5. {h[4]}
{brand_block()}

## 6. RULES
- Every code line comes from props.code. Never generate code in the render.
- Move transform and opacity only. No layout animation, no colour tween on text.
- One number is allowed to be big, and only a number from props.numbers.
- Captions are DOM text, burned into the export, never an AI caption track.
- prefers-reduced-motion: freeze the contour, show all text at once.

## 7. {h[7]}
{negative_block()}

## 8. {h[8]}
{qa_gate(lang)}

## 9. RENDER
npx remotion render src/index.ts {scene['id']} out/{scene['id']}.mp4 --codec=h264
# Or use content-kit/code-video/render_video.py for the no-Node Pillow/ffmpeg path.
"""


BUILDERS = {"ai-video": ai_video, "editor": editor, "remotion": remotion}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scene", help="scene id (see --list)")
    ap.add_argument("--engine", choices=list(BUILDERS), default="ai-video")
    ap.add_argument("--lang", choices=["sw", "en"], default="sw")
    ap.add_argument("--out", help="write to this file instead of stdout")
    ap.add_argument("--all", action="store_true", help="write all combinations to prompts/")
    ap.add_argument("--list", action="store_true", help="list scenes")
    args = ap.parse_args()

    if args.list:
        print(f"SCENES ({len(SCENES)})  source: scenes.json")
        for s in DATA["scenes"]:
            print(f"  {s['id']:22} {s['account']:22} {s['title_sw']} / {s['title_en']}")
        print("\nENGINES: " + ", ".join(BUILDERS) + "   LANGS: sw, en")
        return 0

    if args.all:
        out_dir = HERE / "prompts"
        out_dir.mkdir(exist_ok=True)
        written = []
        for s in DATA["scenes"]:
            for lang in ("sw", "en"):
                p = out_dir / f"{s['id']}.ai-video.{lang}.txt"
                p.write_text(ai_video(s, lang), encoding="utf-8")
                written.append(p)
            for engine in ("editor", "remotion"):
                p = out_dir / f"{s['id']}.{engine}.en.txt"
                p.write_text(BUILDERS[engine](s, "en"), encoding="utf-8")
                written.append(p)
        print(f"wrote {len(written)} prompts -> {out_dir}")
        return 0

    if not args.scene:
        ap.error("--scene is required (or use --list / --all)")
    if args.scene not in SCENES:
        ap.error(f"unknown scene {args.scene!r}; try --list")
    text = BUILDERS[args.engine](SCENES[args.scene], args.lang)
    if args.out:
        Path(args.out).write_text(text, encoding="utf-8")
        print(f"wrote {args.out} ({len(text)} chars)")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
