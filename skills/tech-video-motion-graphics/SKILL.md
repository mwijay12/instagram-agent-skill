---
name: tech-video-motion-graphics
description: >-
  Design and build programmatic tech videos, code walkthroughs, website/system
  explainers and 60fps motion graphics with frame-driven physics, progressive
  code diffs, virtual camera choreography and strict visual pacing. Use when the
  user asks for code-to-video, animate code, motion graphics kali, tech Reel,
  website explainer, kinetic typography, or wants an agent to prepare video
  content repeatedly. Works with Remotion / Motion Canvas / Revideo when a
  browser is available, and with this fork's deterministic Pillow renderer when
  it is not.
---

# tech-video-motion-graphics

The **fifteenth skill** in this fork. It sits on top of `/ig-codevideo` (the
seven-layer prompt builder) and answers one complaint: *"kwa mwanzo ni nzuri,
lakini zitokee nzuri zaidi"*. The upgrade is not "more prompt words" - it is
**frame-accurate motion**.

## The one rule (inherited, never relaxed)

**An AI video model must never be asked to draw code, glyphs, numbers or a
logo.** All of those come from a deterministic render. The model supplies
texture plates only. `[inherited from /ig-codevideo]`

## 0. What was actually verified (18 Nov 2026)

Fetched from GitHub, not invented:

| Repo | What it is | Stars* |
| --- | --- | --- |
| `Tejashmakwana/motionmaxxing` | Agent skill: "looksmaxxing for motion graphics", seek-safe GSAP runtime, measured eases, scripted gates `look.py`/`lint.mjs`, **bans page chrome, progress bars, long end cards and invented stats** | 1,654 |
| `charlie947/motion-graphics-skills` | 15 Claude Code skills for launch-grade motion, "every frame is code"; includes `motion-brief-writer`, `motion-effects`, `reel-export` | 709 |
| `Barty-Bart/motion-graphics` | 6 video-editing skills (`explainer-high-energy`, `motion-broll`, `sound-effects`, ...) | 1,350 |
| `remotion-dev/remotion` | React/TypeScript MP4 renderer | 73,908 |
| `motion-canvas/motion-canvas` | TypeScript generator timeline (`yield*`) | 20,004 |
| `redotvideo/revideo` | Motion Canvas fork for AI video agents, JSON params + headless CLI | 4,219 |
| `ManimCommunity/manim` / `abhiemj/manim-mcp-server` | Python math animation + MCP render server | 42,646 / 662 |
| `tungs/timecut` | Headless Chrome recorder for GSAP pages | 656 |
| `upstash/context7` | Live docs for agents | 65,026 |

\* snapshot only, re-check before quoting. `remotion/llms.txt` was **404 at the
repo root** on 18 Nov 2026 - do not claim a file exists without fetching it.

## 1. Choose the engine (do not mix)

| Visual dominant | Engine | Runs in this sandbox? |
| --- | --- | --- |
| React/Tailwind, 3D, audio-synced subtitles | Remotion (`npx remotion render`) | ❌ needs Chromium |
| Sequential code mutations, node graphs, `yield*` | Motion Canvas / Revideo | ❌ needs Chromium/Node UI |
| Algorithms, networking, math | Manim + MCP | ❌ needs Manim + MCP server |
| Existing GSAP HTML page at 60fps | Timecut | ❌ needs headless Chrome |
| **Any of the above laws, deterministically** | **`render_websites.py` (Pillow + ffmpeg)** | ✅ **yes** |

No Chromium, no Playwright, no MCP server and no system ffmpeg exist here. So
this skill ships a **frame-driven Python fallback** that implements the same
laws. It is not a Remotion clone; it is the honest way to try the ideas today.
When the owner has Node + Chrome, the `scenes-websites.json` beat map ports
directly to a Remotion composition.

## 2. Frame-driven physics (no browser clocks)

Every transform, opacity and layout shift is computed from `frame` (the
`useCurrentFrame()` equivalent). **Never** `setTimeout`, CSS `transition`,
`requestAnimationFrame`, or `time.time()` inside a shot.

```
spring(frame, fps, damping=14, stiffness=120, mass=0.8)
  -> damped oscillator integrated once per frame, deterministic
interpolate(frame, [a,b], [c,d], clamp=True)
  -> extrapolateLeft/Right = 'clamp' ALWAYS
```

Unclamped interpolation makes elements fly off-screen or opacity exceed 1.
`render_websites.py` has no unclamped `interpolate` call.

## 3. Code is choreographed, not pasted

- **Line-by-line focus**: unrelated lines dim to **25%**, active line at 100%
  with a highlight bar. The eye tracks the execution path.
- **Token morph / diff**: initial implementation → refactored state over
  **0.6-0.9s** (`edit` / `insert` / `remove`). Only real code from this repo is
  used; anything else keeps an `ILLUSTRATIVE` label on screen.
- **Syntax highlighting**: strings gold `#eab308`, keywords violet `#7c3aed`,
  punctuation paper. Never a screenshot of a wall of code.
- **Tabular numerals**: counters and prices use JetBrains Mono so changing
  digits never reflow the layout.

## 4. Visual pacing and the virtual camera

- **3-second rule**: no frame stays static for more than 3s (180 frames @60fps).
  `render_websites.py` logs change events and asserts the max gap.
- **Camera rig**: wrap the frame in a parent transform; zoom `1.0 → 1.35` and
  `translateX/Y` toward the active component, then pull back. The code shot
  starts at the left edge and pans right so the long real viewport line reads
  without clipping.
- **Staggered entrances**: list items / badges / price rows offset by **3-5
  frames** (0.05-0.08s @60fps) so they cascade.
- **Kinetic typography**: Fraunces display + JetBrains Mono technical badges,
  tight tracking, one accent with one meaning.

## 5. The motionmaxxing critique we accepted

The old FINAL cut had `ACT 01 / MIZIZI`, coordinates, a timecode and a progress
bar - `motionmaxxing` calls that **page chrome (G5 fail)** and rejects end cards
held past **1.4s (G3)**. For the new websites cut we therefore:

- removed all chrome, kicker labels, timecodes and progress bars;
- cut on motion, with scenes already moving when they start;
- kept the logo/credits end card to **1.4s**;
- kept only real numbers with a source (starting prices from `09-decisions.md`);
- added a scripted gate instead of self-certifying: `04-look.md` prints G0/G2/G3/G5.

G1 (proof readable) and G4 (one hero per frame) are judged **by eye** on the
contact sheet and said so honestly; no invented numbers.

## 6. Brand and claim guards (this fork, v1.2)

Never invent a palette. Tokens: navy `#071022`, paper `#f7f6f2`, gold `#eab308`,
violet `#7c3aed`, muted `#a3aecb`; Fraunces / Inter / JetBrains Mono; motion
`0.3 / 0.6 / 1.1s`, ease `cubic-bezier(.22,1,.36,1)`.

From `content-kit/09-decisions.md`: starting prices only (Web Starter 350k,
Growth 550k, Custom kuanzia 800k, mifumo kuanzia 1.2M), **Care Plan 99k/month
is a separate service, not SaaS**, `offline-first, cloud-synced`, **no `"100%"`**,
tagline `Built in Tanzania, for how Tanzania really works.`, link
`altra.tanzaniareach.com` (never "official website", never an invented domain).
No `95+ Lighthouse`, `<2s on 2G`, `0.8s`, `10x`, `99.98%`, invented clients or
testimonials - those are self-claimed site numbers, not measured proof.

## 7. Loop (use it every time)

1. Read `~/.claude/instagram/voice.md` (install: `content-kit/use-voice.sh`).
2. Pick ONE engine. Pick ONE scene from `scenes-websites.json`; add a new one
   only with a real artifact (repo path / URL / real number with source).
3. Write the spoken script from `beats[]`; run `skills/ig-reel/beats.py`.
4. Write 3 hooks, run `skills/ig-reel/hookscore.py`, show the ranking.
5. Write the caption, run `skills/ig-caption/caption.py --keywords ...`, then
   `skills/ig-human/detect.py` / `humanize.py`. Say Job A or Job B.
6. **Verify a keyframe first** (the Remotion `still` equivalent):
   ```bash
   /tmp/kvenv/bin/python skills/tech-video-motion-graphics/render_websites.py --still 3.0 --out /tmp/web-frame.png
   ```
   Look at it. Then render:
   ```bash
   /tmp/kvenv/bin/python skills/tech-video-motion-graphics/render_websites.py --fps 60 --crf 30
   python3 content-kit/check.py
   ```
7. Print `04-look.md` gates, the contact sheet, and the prompt/handoff block.
8. **Never publish.** The owner adds music, edits and posts. No auto-DM.

## 8. Handoff sentence for AI-texture engines

> *"Composite all code, numbers, glyphs and captions afterwards as real text.
> The model supplies the plates."*

## 9. Websites deliverable (18 Nov 2026)

`scenes-websites.json` uses only real website material: the live
`content-kit/present/site/index.html` `<html lang="sw">` / viewport / `<title>`
lines, the owner's starting prices in `09-decisions.md`, the owner's logo and
Altraware credits, and one keyword CTA (`TOVUTI`). The spoken hook is
`Tovuti nzuri haipimwi kwa rangi. Inapimwa kwa ujumbe unaoingia kwenye simu
yako.` (`hookscore.py` **80.0 STRONG**). Script/caption receipts live in
`content-kit/qa/websites-*.out`.

Outputs: `content-kit/code-video/samples/04-altraware-websites.mp4`,
`04-contact-sheet.jpg` (nine readable keyframes), `04-render-manifest.json`,
`04-look.md`, and `audio/voiceover-websites.wav`. A copy-ready script/caption
brief is also a public native Google Doc:
`https://docs.google.com/document/d/1Nt9f_TasuJ-a5BieeU3YrBbt8HfJSCWMLPDwMGV8GPs/edit?usp=drivesdk`.
Public MP4/WAV/contact-sheet/poster links are in
`content-kit/code-video/samples/04-drive-links.md` and in the manifest's `drive`
block; `anyoneWithLink reader` was confirmed. The MP4 is 1080×1920,
**60fps**, H.264 + AAC, TTS only — no music or SFX. `04-look.md` prints G0/G2/G3/G5
computed from the render; G1/G4 remain human judgments. The owner adds music,
edits and posts; nothing is published here.

## 10. Limits (say them out loud)

- Remotion / Motion Canvas / Revideo / Timecut / Manim-MCP **did not run here**;
  only their laws were implemented in the Python fallback. No MCP server was
  installed, no Context7 docs were fetched live, no `llms.txt` was found.
- The websites deliverable was rendered at **60fps**; `--fps 30` remains a
  quick-preview option. The code is frame-driven at either rate.
- TTS is external, one consistent voice_id; **no music or SFX** (owner adds).
- Kiswahili hook scores are unvalidated translations, not view predictions.
- `motionmaxxing`'s G1/G4 are human judgments; we do not self-certify them.
