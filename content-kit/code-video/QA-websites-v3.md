# QA — 06 Altraware Websites V3 clean Reel

**Status:** rendered, technically validated, and uploaded to Drive for review; **owner visual approval still pending**. Drive: [https://drive.google.com/file/d/1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3/view?usp=drivesdk](https://drive.google.com/file/d/1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3/view?usp=drivesdk). This is the first deliverable after `anza na reel sawa`. V2 remains a completed earlier review copy, not the final creative direction.

**Deliverables**

| File | Purpose |
| --- | --- |
| `samples/06-altraware-websites-v3.mp4` | 1080×1920, 60fps, 36.011s clean Reel |
| `samples/06-altraware-websites-v3-poster.png` | keyframe still, frame 60 |
| `samples/06-render-manifest.json` | Remotion render receipt |
| `samples/06-contact-sheet.png` | six keyframe stills, one per beat |
| `samples/06-mp4-contact-sheet.jpg` | eight frames decoded from the final MP4 |
| `scenes-websites-v3.json` | six-beat scene/caption/asset registry |
| `websites-script-v3.txt`, `websites-caption-v3.txt` | owner-facing script and IG caption |
| `qa/websites-v3-*.out` | hook/beat/caption/detect/humanize/technical lint receipts |
| `qa-v3/` *(local only, gitignored)* | full-size keyframe stills and MP4 frames used for the human check |

## G0 — Source of truth and claim guards

- Canonical: [`../09-decisions.md`](../09-decisions.md). Live site copy was **not** silently updated; `5.. endelea` was treated as permission to continue, not site-edit approval.
- Exact ownership used verbatim: `Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.`
- Exact tagline used verbatim: `Built in Tanzania, for how Tanzania really works.`
- Exact CTA used verbatim: `Comment neno TOVUTI`.
- Confirmed public phone `0790942616`, IG `@altrawaretechnology`, owner-confirmed logo `content-kit/assets/altraware-logo.png`.
- Prices are **starting prices**: Web Starter TSh 350,000 · Growth TSh 550,000 · Custom kuanzia TSh 800,000. `Care Plan TSh 99,000/mwezi` is a **separate service, not SaaS**. Full price after scope.
- `offline-first, cloud-synced` remains **Faida POS only**; it is not a websites claim.
- No invented domain, no `official website` claim, no invented metrics/clients/testimonials, no `100%`, `95+ Lighthouse`, `<2s on 2G`, `0.8s`, `10x`, `99.98%`.
- No live posting, DMs, auto-DM, bot, credentials, account changes, Docs work or Vercel work.

## G1 — Hook / script

Receipt: [`../qa/websites-v3-hooks-beats.out`](../qa/websites-v3-hooks-beats.out).

- `hookscore.py`: `80.0 STRONG` / `78.6 STRONG` / `37.8 WEAK`. V3 uses the **78.6 STRONG** hook (`Mteja hajasimama mbele ya banner lako…`) because it is the one already aligned with the corrected V2 TTS composite; the 80.0 line is kept as a future A/B option.
- `beats.py --target 36`: **104 words, ~37.8s, REVIEW**. It flags text-only beats longer than 4s and no spoken loop. This is a script heuristic, not a frame-motion measure: V3 changes camera, captions, code focus, cards and chips frame-by-frame. **Not self-certified.**
- 3-second rule: beat 1 runs 0–3.9s but the phone hero, kicker, pills and caption all enter inside the first 28 frames; the frame is not static for 3 seconds.

## G2 — Caption

Receipt: [`../qa/websites-v3-caption.out`](../qa/websites-v3-caption.out).

- `caption.py --keywords TOVUTI,tovuti,website` → **READY**.
- `733 / 2200` chars, 3 hashtags, 1 ask, `3/3` search terms, first line lands whole, no dead links, no emoji flood.

## G3 — Human voice

Receipts: [`../qa/websites-v3-detect.out`](../qa/websites-v3-detect.out), [`../qa/websites-v3-humanize.out`](../qa/websites-v3-humanize.out).

- `detect.py`: **64.0 REVIEW**, weakest `VOICE 40.0`. Clean Kiswahili normally returns REVIEW here; `humanize.py` produced a normalized copy.
- **Not self-certified.** Owner should read the caption/script aloud before posting; one consistent TTS voice, no music/SFX in the render.

## G4 — Deterministic visual/motion contract

Receipts: [`../qa/websites-v3-technical.out`](../qa/websites-v3-technical.out), `samples/06-render-manifest.json`.

- `esbuild` OK, `node --check` OK, JSON parse OK.
- All readable text, code, numbers, captions, timing and brand marks come from `WebsitesV3.jsx` `BEATS[]` + `timeline-v3.json` + `scenes-websites-v3.json`. Generated images carry **no text or logo**.
- Frame-driven only: `useCurrentFrame()`, `spring()`, clamped `interpolate()`. No `setTimeout`, `requestAnimationFrame`, CSS transitions, `Date.now()` or `Math.random()`.
- 60fps rendered: composition `2160` frames at `60/1`.
- Camera rig `1.0 → 1.35` per beat; stagger 3–5 frames; line-by-line code focus with deterministic token spans; `tabular-nums` on prices, counters and phone.
- No HUD, timecodes, progress bars, stat walls, fake dashboards or invented product screenshots. One quiet brand/kicker line and a metaphorical phone frame are used, never as proof of a real UI. Old busy plates `07`–`10` are **not used** in V3.
- Clean assets: `plates/11-clean-navy.png`, `plates/12-clean-paper.png`; isolated AI PNG elements `13-gold-orb.png`, `14-violet-ribbon.png` at low opacity; animated SVGs `phone-frame.svg`, `code-brackets.svg`, `signal-arc.svg`, `node-graph.svg`.

## G5 — Technical render

Receipt: [`../qa/websites-v3-technical.out`](../qa/websites-v3-technical.out).

- `ffprobe`: H.264 video `1080×1920`, `60/1`, `2160` frames, `36.000000s`; AAC audio `48000 Hz`, `2ch`, `1690` frames, `36.011000s`.
- Format `mov,mp4,m4a,3gp,3g2,mj2`, duration `36.011000s`, size `5529176` bytes, bit_rate `1228330`.
- Full decode with imageio ffmpeg v9.0.2: **exit 0 / FULL_DECODE_OK**.
- Render engine: **Remotion 4.0.544 + React 18 + Chromium 153**. Motion Canvas / Revideo / Timecut / Manim-MCP did **not** render this MP4.
- Audio: corrected `voiceover-websites-v2.wav` (one Swahili TTS voice, `atempo 1.7`). **No music, no SFX** — owner adds them.
- Keyframe still rendered before MP4; MP4 frames at 1/5/10/15/20/25/30/35s decoded into `06-mp4-contact-sheet.jpg`.

## G6 — Background readability / human visual check

Viewed: `06-altraware-websites-v3-poster.png`, `06-contact-sheet.png`, `06-mp4-contact-sheet.jpg`, plus local full-size `qa-v3/mp4-15s.png` and `qa-v3/mp4-30s.png` (QA frames are gitignored; the contact sheets are committed evidence).

- Background is clean and low-frequency: subtle navy/paper plates plus a flat quiet zone behind copy. No busy full-frame art behind text.
- One hero per beat: phone, question cards, language cards, code card, price rows, ownership/CTA card.
- Copy stays inside the safe zone; captions sit on a solid rounded plate; code, prices and phone use high contrast and `tabular-nums`.
- Logo is the owner-confirmed purple-cloud mark; it appears only in beat 6, not inside AI art.
- **Agent-side human check complete. Owner-side phone check and final approval are still required** before music, final edit or posting.

## Drive handoff

| Field | Value |
| --- | --- |
| ID | `1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3` |
| View | https://drive.google.com/file/d/1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3/view?usp=drivesdk |
| Direct | https://drive.google.com/uc?id=1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3&export=download |
| Size | 5,529,176 bytes |
| Created | 2026-11-18T06:48:55.733Z |
| Permission | `anyoneWithLink reader`, `allowFileDiscovery=false` |

## Owner handoff still pending

- Add music/SFX and final edit.
- Approve the clean background on a real phone.
- Post manually to `@altrawaretechnology` / LinkedIn; reply to comments manually.
- Record `views, reach, saves, sends, profile visits, hold@3s` in `content-kit/log-template.md` after posting.
