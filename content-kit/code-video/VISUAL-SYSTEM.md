# Visual system V3 — clean, readable, frame-driven

**Owner verdict on V2:** "nzuri ilaa, but background so busy, si clean." Attached frames at 10s and 15s showed strong typography over high-frequency topology/ribbon art. The fix is not smaller text. The fix is a **quieter world**.

## Hard laws

1. **Clean ground.** Background is flat or low-frequency. No dense line art, particles, city texture or isometric mesh behind readable copy.
2. **One hero per frame.** Big needs small around it. At most 3 focal objects; text always gets a quiet safe zone.
3. **Elements are separate.** Motion lives in isolated SVG/PNG elements placed away from the words, not as a full-frame texture.
4. **No AI text/logo.** Generated images are texture or isolated elements only. All glyphs, code, numbers, captions, timing and logo marks come from deterministic render.
5. **No page chrome.** No kicker-over-headline deck, tracked caps, timecodes, counters, progress bars, header/footer bars, stat walls, invented UI cards.
6. **Frame-driven only.** `useCurrentFrame()`, `spring()`, `interpolate()` with `extrapolateLeft/Right: 'clamp'`. No CSS transitions, `setTimeout`, `requestAnimationFrame`, `time.time()`.
7. **60fps target.** V2 was validated at 30fps; V3 should render 1080×1920 at 60fps when the Chromium/Remotion environment is available.
8. **3-second rule.** No static frame > 180 frames at 60fps. Cut on motion; entries decelerate, exits accelerate; stagger 3–5 frames.
9. **Readability gate G6.** Human check on contact sheet + full frames: can a stranger read the hero line in one glance? If not, simplify the ground before touching the type.

## Assets generated for V3

| Asset | Use |
| --- | --- |
| `plates/11-clean-navy.png` | Dark beats: hook, language, code, CTA |
| `plates/12-clean-paper.png` | Light beats: prices, process, carousel-derived frames |
| `elements/phone-frame.svg` | Simu kwanza / mobile-first |
| `elements/code-brackets.svg` | Vibe coding / code diff |
| `elements/signal-arc.svg` | Ujumbe unafika / API / sync |
| `elements/node-graph.svg` | System architecture / project proof |

Old plates `07-dar-blue-hour.png` … `10-paper-blueprint.png` remain available but should be used only as **cropped, low-opacity fragments** or isolated elements, never as a full-frame background under text.

## Palette and type

- Navy `#071022`, paper `#f7f6f2`, gold `#eab308`, violet `#7c3aed`, muted `#a3aecb`.
- Fraunces display, Inter body, JetBrains Mono technical badges/counters.
- `fontVariantNumeric: 'tabular-nums'` for every counter or price.
- One accent with one meaning. Gold = action/CTA, violet = system/AI.

## Code scenes

- Line-by-line focus: unrelated lines 25% opacity, active line 100% with highlight bar.
- Token morph / diff over 0.6–0.9s (`edit`, `insert`, `remove`).
- Syntax colours: strings gold, keywords violet, punctuation paper.
- Use Shiki or deterministic spans; never a screenshot of a wall of code.
- Only real code from this repo / owner's projects; otherwise label `ILLUSTRATIVE`.

## Remotion implementation notes

- `Background` takes a clean plate plus optional `offsetX/offsetY`; keep drift ≤ 18px so the ground stays calm.
- Load SVG elements with `staticFile('elements/<name>.svg')`; wrap in a component whose `transform`/`opacity` is computed from `frame`.
- Camera rig: parent transform `scale(1.0→1.35)` and `translateX/Y` toward the active element, then pull back.
- Audio-synced captions come from `timeline.json`; one text layer per language variant.
- No `jpegQuality` on PNG stills; `concurrency: 2` on this sandbox; `x264Preset: 'veryfast'`.

## QA before handoff

1. `esbuild` parse + JSON parse.
2. Render a keyframe still first and look at it.
3. Render MP4; `ffprobe`; full `ffmpeg -v error -i … -f null -` decode.
4. Contact sheet at 1, 5, 10, 15, 20, 25, 30, 32, 35.5s.
5. Describe every sheet frame in one sentence; judge G1/G4/G6 by eye.
6. motionmaxxing G0/G2/G3/G5 from scripts; never self-certify "good".
7. `caption.py`, `hookscore.py`, `beats.py`, `detect.py`, `humanize.py` receipts.
8. Drive upload + `anyoneWithLink reader`; owner adds music, edits and posts.

## Claim guards (inherit)

`09-decisions.md` wins. Starting prices only. Care Plan separate, not SaaS. `offline-first, cloud-synced` is **Faida POS only**. Ownership: `Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.` Tagline exact. CTA `Comment neno TOVUTI`. No invented metrics, clients, testimonials, domains or "official website".
