# QA — business-tip-v1 (Jibu la haraka kwenye simu)

Reel ya tip ya biashara, mfano wa V4: white-dominant, chini ya sekunde 25, captions
zilizochomwa (burned-in), sauti moja ya kiume (TTS). Topic: **Jibu la haraka kwenye
simu** — `unafanya nini`, `bei gani`, `wasiliana vipi`.

Final media:

- Video: [`samples/08-altraware-business-tip-v1.mp4`](samples/08-altraware-business-tip-v1.mp4) — 3,636,558 bytes, H.264 1080×1920 @60fps, 1320 frames, 22.0s, AAC 48kHz
- Poster: [`samples/08-altraware-business-tip-v1-poster.png`](samples/08-altraware-business-tip-v1-poster.png)
- Still contact sheet: [`samples/08-contact-sheet.png`](samples/08-contact-sheet.png) (6 frames)
- MP4 contact sheet: [`samples/08-mp4-contact-sheet.jpg`](samples/08-mp4-contact-sheet.jpg) (8 encoded frames: 1/4/7/10/13/16/19/21.5s)
- Render receipt: [`samples/08-render-manifest.json`](samples/08-render-manifest.json)
- Scene registry: [`scenes-business-tip-v1.json`](scenes-business-tip-v1.json)
- Timeline: `skills/tech-video-motion-graphics/engine-trial/remotion/timeline-tip-v1.json` (+ copies under `public/` and `content-kit/code-video/audio/`)
- Script / caption / hooks: `business-tip-script-v1.txt`, `business-tip-caption-v1.txt`, `../qa/business-tip-v1-hooks.txt`

Owner workflow still applies: **owner adds music/SFX, does the final edit, approves on a
real phone in strong sun, posts manually, replies manually, and logs metrics.** No live
posting, DMs, auto-DM/bot, credentials or account changes by the agent.

## G0 — Source of truth

Receipt: canonical `content-kit/09-decisions.md` guards; `scenes-business-tip-v1.json`;
`BusinessTipV1.jsx` `BEATS[]`; `timeline-tip-v1.json`.

- All readable text, numbers, captions and timing come from `BEATS[]` + timeline JSON.
  Generated images (plates 15/12/16/17) are texture only — no text or logo baked in.
- Topic follows the owner choice: jibu la haraka — unafanya nini, bei gani, wasiliana vipi.
- Brand facts: `Altraware Tech`, `@altrawaretechnology`, `0790942616`,
  `altra.tanzaniareach.com`, tagline `Built in Tanzania, for how Tanzania really works.`,
  CTA `Comment neno TIP`.

## G1 — Hook & pacing

Receipt: [`../qa/business-tip-v1-hooks-beats.out`](../qa/business-tip-v1-hooks-beats.out).

- `hookscore.py`: top hook `81.4 STRONG` — `Biashara yako haianzi na banner. Inaanza na jibu la haraka.`
  (weakest axis STAKES 70). This is the line that opens the Reel, spoken and captioned.
- `beats.py --target 21`: **47 words, ~17.1s**. It flags a 3.6s hook and one 4.7s mid
  beat and no spoken loop word — a text-only heuristic. The render changes camera,
  captions, cards and chips frame-by-frame inside every beat; beats are 3.8s/4.0s/4.4s/
  4.7s/5.1s, none static. **Not self-certified.**
- Final beat is 5.1s = 23.2% of the video; the gradient CTA bar is visible ~1.4s at the
  end — within the <=25% final-shot / <=1.4s end-card guide. Owner review still required.

## G2 — Caption

Receipt: [`../qa/business-tip-v1-caption.out`](../qa/business-tip-v1-caption.out).

- `caption.py --keywords TIP,business tip,biashara` → **READY**: 645/2200 chars, first
  line lands whole (96 chars), 3 hashtags below the fold, 1 ask, 0 emoji, 3/3 search
  terms (2 in the visible window).

## G3 — Human voice

Receipts: [`../qa/business-tip-v1-detect.out`](../qa/business-tip-v1-detect.out),
[`../qa/business-tip-v1-humanize.out`](../qa/business-tip-v1-humanize.out).

- `detect.py` on the script returns REVIEW on clean Kiswahili as usual; **not
  self-certified**.
- Audio: `voiceover-business-tip-v1.wav` — one Swahili TTS voice, `voice-01`, masculine,
  **auto-assigned when the voice vote was skipped; NOT owner-selected**. `atempo 1.3`
  (same slower pace as V4). Clip starts 0/3.8/7.8/12.2/16.9s; speech ends 21.39s;
  composite 22.0s / 48kHz mono. No music, no SFX.

## G4 — Deterministic visual/motion contract

Receipts: [`../qa/business-tip-v1-technical.out`](../qa/business-tip-v1-technical.out),
[`../qa/business-tip-v1-visual.out`](../qa/business-tip-v1-visual.out), manifest.

- `esbuild` bundle OK, `node --check` OK on both render scripts, JSON parse OK, SVG XML OK.
- Frame-driven only: `useCurrentFrame()`, `spring()`, clamped `interpolate()`. No
  `setTimeout`, `requestAnimationFrame`, CSS transitions, `Date.now()`, `Math.random()`.
- 60fps, 1320 frames, 22.0s — under the owner's `<25s` limit.
- Camera rig 1.0 → 1.12 per beat; stagger 3–5 frames; `tabular-nums` on the phone number.
- No HUD, timecodes, progress bars, stat walls, fake dashboards or invented screenshots.
- Assets: white plate `15-clean-white.png`, paper `12-clean-paper.png`, isolated white
  PNG elements `16/17`, ink SVGs (`phone-frame`, `code-brackets`, `signal-arc`,
  `node-graph`), owner-confirmed `logo.png`.
- `@font-face` Fraunces/Inter/JetBrains Mono.

## G5 — Claim guards

Receipt: [`../qa/business-tip-v1-guards.out`](../qa/business-tip-v1-guards.out).

- Forbidden scan across script, caption, hooks, JSX, timeline: `NO_HITS` for `scope`,
  numeric prices (`350,000/550,000/800,000/99,000/350k/550k/800k/99k`), `TSh`,
  `official website`, `100%`, `95+ Lighthouse`, `0.8s`, `10x`, `99.98%`,
  `offline-first/cloud-synced`, `Unamiliki domain`, `HAISIMAMI MTANDAO`.
  (The two `100%` JSX hits are CSS `width/height: '100%'` — technical style, not claims.)
- Exact phrases present: `Comment neno TIP`, tagline, handle, phone, `Tip ya biashara`,
  `business tip`.
- No prices are spoken or shown in this Reel; `Bei kamili huandikwa baada ya kufahamu
  kazi yako` carries the approved wording (no English planning term).

## G6 — Sun-readability / owner check

Receipts: `qa-tip-v1/tip-v1-frame-metrics.json` (ignored path), still + MP4 contact
sheets viewed agent-side.

- Six 1080×1920 stills: white fraction (luma >= 220) 0.874–0.946, mean luminance
  238.4–244.8/255, dark fraction (luma < 80) <= 0.013. No full-frame dark background.
- Eight encoded MP4 frames (1/4/7/10/13/16/19/21.5s) confirm burned captions and
  readable cards inside the real video stream.
- **PENDING:** owner's real-phone check in strong sun, plus owner approval of voice,
  pacing and the final edit with music/SFX. This gate is never self-certified.

## Verdict

QA gates G0–G5 pass with receipts; G1/G3 heuristics recorded as REVIEW (not
self-certified); G6 pending owner. V4 remains the websites review candidate; this
`business-tip-v1` is a separate short tip Reel built on the same V4 white-dominant law.
