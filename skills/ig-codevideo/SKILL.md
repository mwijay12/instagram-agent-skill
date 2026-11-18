---
name: ig-codevideo
description: >-
  Turn a repo, a code file, a screen recording or a product fact into a
  standout short-form video prompt - seven layers, a timed shot list, the
  client's real design tokens, a negative prompt and a QA gate. Use when the
  user says "code to video", "turn this repo into a reel", "video prompt",
  "my AI videos look generic", "prompt ya video", "outputs mbaya za kawaida",
  or has code/screens and wants a Reel that does not look like a template.
---

# ig-codevideo

The fourteenth skill. Everything else in this pack writes copy; this one turns
**a real artifact** into a video brief. It exists because "make a video about
my app" produces a laptop, a globe and a purple gradient. Every time.

This skill is local to the `mwijay12` fork. It reads the content kit at
`content-kit/` and works with the other thirteen skills.

## The one rule

**An AI video model must never be asked to draw code.** It cannot. It produces
readable-looking nonsense. Code, numbers, receipts and captions come from a
deterministic render (Remotion, HTML, Pillow+ffmpeg, or a real screen
recording). The model gets texture only. Say this out loud in the output.

## Before you write anything

1. Read `~/.claude/instagram/voice.md` (install with
   `content-kit/use-voice.sh mwijay|altraware`).
2. Read [`content-kit/02-brand-system.md`](../../content-kit/02-brand-system.md).
   Never invent a palette, a font or a motion duration.
3. Read [`content-kit/09-decisions.md`](../../content-kit/09-decisions.md) for
   the **resolved** owner decisions (17 Nov 2026): starting prices,
   `offline-first, cloud-synced`, licensed ownership (never `"100%"`), the
   Tanzania tagline and the one canonical link.
   [`content-kit/01-presence-audit.md`](../../content-kit/01-presence-audit.md)
   §5 is now the *history* of those conflicts, not a list of open questions.
4. Read `content-kit/code-video/scenes.json`. If the user's artifact is one of
   the eight scenes, use it. If not, build a new scene entry with the same
   fields and get approval before writing a prompt.

If the artifact has no verified source (no repo, no URL, no real screen, no
number with a source), stop. Ask one batched question: **what is the thing,
where does it live, and what one true claim does it support?** A prompt without
an artifact is the exact failure this skill exists to prevent.

## The seven layers (every output has all seven)

| # | Layer | Where it comes from |
| --- | --- | --- |
| 1 | Artifact | repo / file / screen / number, with a URL |
| 2 | Claim | one sentence, no adjectives, no invented outcome |
| 3 | Shot list | `beats[]` with `t`, `visual`, `text`, `motion`; frame change ≤ 2.5s |
| 4 | Brand tokens | exact hex, Fraunces / Inter / JetBrains Mono, coordinates, contour |
| 5 | Motion | 0.3 / 0.6 / 1.1s, `cubic-bezier(.22,1,.36,1)`, transform+opacity |
| 6 | Negative | `common_negative` (30+ banned clichés), always included |
| 7 | QA gate | 12 checks, always included |

## The loop

**1. Pick the engine.** Do not mix them.

| User wants | Engine | Command |
| --- | --- | --- |
| Texture from Veo / Sora / Runway / Kling | `ai-video` | `python3 content-kit/code-video/promptgen.py --scene ID --lang sw` |
| A human edit of real screen recordings | `editor` | `--engine editor --lang en` |
| A video rendered entirely by code | `remotion` or `render_video.py` | `--engine remotion --lang en` |

**2. Generate.** Use `promptgen.py`, do not hand-write the prompt. It composes
all seven layers from `scenes.json`, so the brand tokens and negative list
cannot be forgotten.

```bash
python3 content-kit/code-video/promptgen.py --list
python3 content-kit/code-video/promptgen.py --scene faida-offline --lang sw
python3 content-kit/code-video/promptgen.py --scene shule-altra --engine editor --lang en
```

**3. Score the hook.** Take the scene's `hook.formula` id, write two more
options from `ig-reel/hooks.json`, put all three in a file and run
`hookscore.py`. Show the ranking. If the winner is under 50, rewrite it before
anything else. Note: `hookscore.py` now carries Kiswahili markers, but those
are translations, not re-validated signals. For Swahili hooks, kill greetings
and vague lines, then trust the retention graph.

**4. Time the beats.** Write the spoken script from `beats[]` and run
`beats.py script.txt --target 20`. Fix every flag: hook past 3s, a beat over
4s, a run with nothing concrete, no loop. The last spoken line should echo a
word from the hook; put the CTA on an on-screen card, not in the last spoken
beat, or the loop detector will correctly complain.

**5. Humanize and lint.** Run the caption through `/ig-human` and
`ig-caption/caption.py` with two search terms. Captions from this skill are
Job B when the video is not carrying the hook, Job A usually. Say which.

**6. Render or hand off.** For the code path:

```bash
python3 content-kit/code-video/render_video.py            # 1080x1920 MP4 (kimya)
python3 content-kit/code-video/render_video.py --still 8.0 --out /tmp/frame.png

# Full pass: AI texture plates + Kiswahili TTS + AAC mux -> MP4 yenye sauti
python3 content-kit/code-video/render_reel_v2.py
python3 content-kit/code-video/render_reel_v2.py --no-voice    # parity check

# Shareable cut: + real owner logo, Altraware credits, one keyword CTA, 6th TTS clip
python3 content-kit/code-video/render_reel_final.py
```

`render_reel_v2.py` needs `Pillow` + `ffmpeg` (`pip install imageio-ffmpeg`),
reads `plates/*.png` and `audio/*.wav`, writes `samples/02-*.mp4`,
`02-contact-sheet.jpg` and `02-render-manifest.json`.
`render_reel_final.py` adds the **end card**: a real owner-supplied logo
(`assets/altraware-logo.png`, never AI-drawn), Altraware credits,
`Faida POS ni app na system`, one CTA (`comment neno POS`) and a 6th TTS clip.
The AI images are **plates only**: no model draws a glyph, a digit, a logo or
a line of code. Voiceover clips are external TTS with one consistent voice_id;
no music or SFX is added (the owner adds music in the editor). If the user has
no TTS clips, render silently with `--no-voice`. See
[`content-kit/code-video/TRY-IT.md`](../../content-kit/code-video/TRY-IT.md)
and [`QA-final.md`](../../content-kit/code-video/QA-final.md).

For the AI path, hand over the prompt plus this sentence: *"Composite all code,
numbers and captions afterwards as real text. The model supplies the plates."*

**7. Print the block.** The prompt in a fenced block, then:

```
CODE-VIDEO READY
scene:       faida-offline (@altrawaretechnology)
engine:      ai-video / sw
artifact:    mwijay12/faida-pos-releases (verified)
hook:        #18, 56.0 OK (alt #16, 76.4 STRONG)
beats:       5 shots, 16s, frame change <= 2.5s
brand:       motion-lab tokens, no invented palette
negative:    30+ banned cliches
qa:          12 checks, all must pass
claim guard: no 0.8s / 10x / 99.98% / Neema / 100% ownership
next:        /ig-caption for the caption, /ig-human for the pass
```

**8. Never publish.** The user renders, edits and posts. On "yes", append to
`~/.claude/instagram/log.md`: date, scene id, hook formula, first line.

## Worked example

```
/ig-codevideo nataka Reel ya Faida POS, ila prompt zangu zinatoa video za kawaida
```

```
Diagnosis: the old prompt named a topic ("my POS app") and no artifact, so
the model filled the gaps with a laptop, a globe and a gradient. It was also
asked to draw code, which no video model can do.

Using scene faida-offline from scenes.json (8 scenes available).
Artifact: github.com/mwijay12/faida-pos-releases + the real checkout snippet
from altra.tanzaniareach.com.

[promptgen.py --scene faida-offline --lang sw output, seven layers]

Hook options scored:
  76.4 STRONG  #16  "Duka lako likikosa mtandao dakika 5..."
  56.0 OK      #18  "Nazima Wi-Fi kwenye duka. Mauzo hayasimami."
  81.8 STRONG  #2   "Build the queue first. Offline-first, cloud-synced POS for Tanzanian shops."

Shooting #18 anyway: it is the one the user can say while actually switching
off Wi-Fi on camera. The score is a drafting aid, not a view prediction.

beats.py: 18.6s / 20s, no flags, loop detected.
render_video.py: samples/01-faida-offline.mp4 exists as a reference.
caption: run /ig-caption (Job A). Nothing is posted.
full pass: render_reel_v2.py -> samples/02-faida-offline-tts.mp4
           (3 AI plates + 5 Kiswahili TTS clips, burned-in captions, no music).
final cut: render_reel_final.py -> samples/03-faida-offline-FINAL.mp4
           (+ real logo, Altraware credits, "comment neno POS", 6th TTS clip).
```

## Rules

- **Never fabricate.** No invented clients, percentages, testimonials,
  view counts or code syntax. If a number is missing, write
  `NEEDS_INPUT: <what is needed>`. Code marked `ILLUSTRATIVE` must keep that
  label on screen.
- **Never add "cinematic, 4K, highly detailed, masterpiece" to fix a weak
  prompt.** Those words add clichés. Fix layers 1–6 instead.
- **One claim, one number, one ask.** One accent colour. One frame change
  every 2.5s or sooner.
- **Bilingual, not translated twice.** Kiswahili for the human line, English
  for the technical line. `--lang sw` and `--lang en` are separate deliverables.
- **Honour the guards.** The five conflicts in `01-presence-audit.md` §5 were
  decided on 17 Nov 2026 and live in `09-decisions.md`: starting prices (no
  750K, Care Plan is a separate service), `offline-first, cloud-synced`,
  licensed ownership (never `"100%"`), `Built in Tanzania, for how Tanzania
  really works.`, and `altra.tanzaniareach.com` (not "official website"). Do
  not let a prompt reintroduce a rejected claim.
- **Say the limitation.** `ai-video` prompts do not guarantee results; the base
  `render_video.py` has no audio (use `render_reel_v2.py` for the TTS + plates
  pass, still no music/SFX); the Swahili scorer additions are unvalidated.
  Generated plates are AI texture, never evidence for a claim.
- **Do not post, do not auto-DM.** Copy-ready output only.
