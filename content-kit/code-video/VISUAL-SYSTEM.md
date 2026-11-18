# Visual system V3 — clean, readable, frame-driven

**Owner verdict on V2:** "nzuri ilaa, but background so busy, si clean." Attached frames at 10s and 15s showed strong typography over high-frequency topology/ribbon art. The fix is not smaller text. The fix is a **quieter world**.

## Hard laws

1. **Clean ground.** Background is flat or low-frequency. No dense line art, particles, city texture or isometric mesh behind readable copy.
2. **One hero per frame.** Big needs small around it. At most 3 focal objects; text always gets a quiet safe zone.
3. **Elements are separate.** Motion lives in isolated SVG/PNG elements placed away from the words, not as a full-frame texture.
4. **No AI text/logo.** Generated images are texture or isolated elements only. All glyphs, code, numbers, captions, timing and logo marks come from deterministic render.
5. **No page chrome.** No HUD, timecodes, counters, progress bars, stat walls, fake dashboards/analytics panels, or invented product screenshots presented as proof. One quiet brand/kicker line and a metaphorical phone frame are allowed; no deck-style kicker stacks or header/footer bars with backgrounds.
6. **Frame-driven only.** `useCurrentFrame()`, `spring()`, `interpolate()` with `extrapolateLeft/Right: 'clamp'`. No CSS transitions, `setTimeout`, `requestAnimationFrame`, `time.time()`.
7. **60fps rendered.** V2 was validated at 30fps; V3 rendered 1080×1920 at 60fps / 2160 frames with Remotion 4.0.544.
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
| `public/logo.png` | **Owner-confirmed** Altraware mark for V3 credits |
| `plates/13-gold-orb.png` | Isolated AI-generated PNG element, low-opacity glow only |
| `plates/14-violet-ribbon.png` | Isolated AI-generated PNG element, low-opacity fragment only |

Old plates `07-dar-blue-hour.png` … `10-paper-blueprint.png` remain available but should be used only as **cropped, low-opacity fragments** or isolated elements, never as a full-frame background under text.

**V3 owner-confirmed assets:** logo `content-kit/assets/altraware-logo.png` copied to `engine-trial/public/logo.png`; public phone `0790942616` in credits.

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

**V3 QA:** [`QA-websites-v3.md`](QA-websites-v3.md) records G0–G6, including the G6 human background-readability check.

## V4 correction — white-dominant / sun readability (18 Nov 2026)

Owner feedback on the V3 dark frames: `hizi dark sio mbaya saana` but `darks hazija kaa poa sana`, and content must be readable `hata kama mtu yuko kwenye jua kali asome vizuri`. For the active V4 revision, **white dominates**; V3 navy dominance is superseded, though dark is not banned as subordinate ink.

Hard additions for V4:

1. `plates/15-clean-white.png` is the dominant ground; `plates/12-clean-paper.png` is the quiet paper variant. No full-frame dark plate.
2. Dark appears only as ink text, small chips, the narrow top accent and the CTA gradient. Coloured bands never cover the copy.
3. Isolated white PNG elements `16-white-gold-orb.png` / `17-white-violet-ribbon.png` and `*-ink.svg` decorations stay away from readable words.
4. Prices are spoken and written in Kiswahili words: `laki tatu na nusu`, `laki tano na nusu`, `laki nane`, `shilingi elfu tisini na tisa kwa mwezi`. The English planning term is replaced by `kufahamu kazi` / `mahitaji yako`.
5. Whole video `<25s`: V4 renders `1410` frames at `60fps` / `23.5s`. TTS is slower (`atempo 1.3`) with a masculine `voice-01` trial that was auto-assigned, not owner-selected.
6. G6 is now a **sun-readability** check: dark-on-white contrast, white-dominant pixel receipt, one hero per beat, and an owner-side phone check in strong sun. Agent-side contact sheets and full frames were viewed; owner approval is still pending.

V2 and V3 remain historical review copies. V4 QA: [`QA-websites-v4.md`](QA-websites-v4.md).
