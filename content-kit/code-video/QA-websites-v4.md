# QA — 07 Altraware Websites V4 short white Reel

**Status:** rendered, technically validated, and uploaded to Drive for review; **owner visual approval still pending**. V4 is the active revision after the owner looked at V3 dark frames and said `go on`. V2 and V3 are earlier review copies, not the final creative direction.

Owner corrections applied here: white should dominate for `hata kama mtu yuko kwenye jua kali asome vizuri`; slow the TTS down; make the whole video **less than 25 seconds**; try a male voice; speak/write prices as `laki tatu na nusu`, `laki tano na nusu`, `laki nane` and `elfu tisini na tisa`; replace the English planning term with `kufahamu kazi` / `mahitaji yako`. Dark is not banned, but it is subordinate — no full-frame dark theme.

**Deliverables**

| File | Purpose |
| --- | --- |
| `samples/07-altraware-websites-v4.mp4` | 1080×1920, 60fps, 23.509s white-dominant Reel |
| `samples/07-altraware-websites-v4-poster.png` | keyframe still, frame 30 |
| `samples/07-render-manifest.json` | Remotion render receipt + Drive handoff |
| `samples/07-contact-sheet.png` | six keyframe stills `[30,180,360,600,1000,1300]` |
| `samples/07-mp4-contact-sheet.jpg` | eight frames decoded from the final MP4 `[1,4,7,10,13,16,19,22s]` |
| `samples/07-drive-links.md` | public Drive review links |
| `scenes-websites-v4.json` | five-beat scene/caption/asset registry |
| `websites-script-v4.txt`, `websites-caption-v4.txt` | owner-facing script and IG caption |
| `qa/websites-v4-*.out` | hook/beat/caption/detect/humanize/technical/visual/claim-guard receipts |
| `qa-v4/` *(local only, gitignored)* | full-size keyframe stills and MP4 frames used for the agent-side check |

## G0 — Source of truth and claim guards

- Canonical: [`../09-decisions.md`](../09-decisions.md). Live site copy was **not** silently updated; `5.. endelea` was treated as permission to continue, not site-edit approval.
- Exact ownership used verbatim: `Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.`
- Exact tagline used verbatim: `Built in Tanzania, for how Tanzania really works.`
- Exact CTA used verbatim: `Comment neno TOVUTI`.
- Confirmed public phone `0790942616`, IG `@altrawaretechnology`, owner-confirmed logo `content-kit/assets/altraware-logo.png`.
- Prices are **starting prices**, written and spoken in Kiswahili words: Web Starter `laki tatu na nusu`, Growth `laki tano na nusu`, Custom `laki nane`. `Care Plan shilingi elfu tisini na tisa kwa mwezi` is a **separate service, not SaaS**. Full price after `kufahamu kazi` / `mahitaji yako`.
- The English planning term is **absent** from V4 content, captions, QA guards, timeline and manifest. Receipt: [`../qa/websites-v4-guards.out`](../qa/websites-v4-guards.out) → `NO_HITS`.
- `offline-first, cloud-synced` remains **Faida POS only**; it is not a websites claim.
- No invented domain, no `official website` claim, no invented metrics/clients/testimonials, no `100%`, `95+ Lighthouse`, `<2s on 2G`, `0.8s`, `10x`, `99.98%`.
- No live posting, DMs, auto-DM, bot, credentials, account changes, Docs work, Vercel work or site-copy edits. The owner-side reference video was **not** watched.

## G1 — Hook / script

Receipt: [`../qa/websites-v4-hooks-beats.out`](../qa/websites-v4-hooks-beats.out).

- `hookscore.py`: `80.0 STRONG` (`Tovuti yako haipigwi makofi…`), `47.0 WEAK`, `39.2 WEAK`. V4 speaks the short line `Mteja yuko kwenye simu.` (the `39.2 WEAK` hook) because it matches the re-recorded, slower male TTS clip. The `80.0 STRONG` line is kept as a future A/B option.
- `beats.py --target 23.5`: **49 words, ~17.8s, REVIEW**. It flags text-only beats longer than 4s, few concrete markers and no spoken loop. This is a script heuristic, not a frame-motion measure: V4 changes camera, captions, code focus, cards and chips frame-by-frame. **Not self-certified.**
- 3-second rule: beats are 1.9s / 2.95s / 3.3s / 7.3s / 8.05s. The two long beats still animate camera, captions, price-row reveals and CTA reveal inside the shot; they are not one static frame. **Not self-certified.**
- G3 pacing heuristic from the render: final beat `8.05s` = `34.3%` of the video and the CTA button is visible `6.22s`, both above the skill's `<=25%` final-shot / `<=1.4s` end-card guide. Recorded as **REVIEW**, not self-certified; owner may want a shorter end card in the final edit.

## G2 — Caption

Receipt: [`../qa/websites-v4-caption.out`](../qa/websites-v4-caption.out).

- `caption.py --keywords TOVUTI,tovuti,website` → **READY**.
- `740 / 2200` chars, 3 hashtags, 1 ask, `3/3` search terms, first line lands whole, no dead links, no emoji flood.
- Caption uses `laki tatu na nusu · laki tano na nusu · laki nane`, `Care Plan shilingi elfu tisini na tisa kwa mwezi`, and `kufahamu kazi yako`.

## G3 — Human voice

Receipts: [`../qa/websites-v4-detect.out`](../qa/websites-v4-detect.out), [`../qa/websites-v4-humanize.out`](../qa/websites-v4-humanize.out).

- `detect.py`: **51.6 REVIEW**, weakest `SPECIFICITY 28.0`. Clean Kiswahili normally returns REVIEW here; `humanize.py` produced a normalized copy. **Not self-certified.**
- Audio: `voiceover-websites-v4.wav`, one Swahili TTS voice, `atempo 1.3` (slower than V2/V3 `1.7`). `voice-01` is a **masculine trial auto-assigned when the voice-choice vote was skipped**; it is **NOT** owner-selected. Another audition can be requested.
- No music, no SFX in the render. Owner adds them.

## G4 — Deterministic visual/motion contract

Receipts: [`../qa/websites-v4-technical.out`](../qa/websites-v4-technical.out), [`../qa/websites-v4-visual.out`](../qa/websites-v4-visual.out), `samples/07-render-manifest.json`.

- `esbuild` OK, `node --check` OK, JSON parse OK, SVG XML OK, `content-kit/check.py` → `47 pass · 0 warn · 0 fail · READY`.
- All readable text, code, numbers, captions, timing and brand marks come from `WebsitesV4.jsx` `BEATS[]` + `timeline-v4.json` + `scenes-websites-v4.json`. Generated images carry **no text or logo**.
- Frame-driven only: `useCurrentFrame()`, `spring()`, clamped `interpolate()`. No `setTimeout`, `requestAnimationFrame`, CSS transitions, `Date.now()` or `Math.random()`.
- 60fps rendered: composition `1410` frames at `60/1`; duration `23.5s`, under the owner's `<25s` limit.
- Camera rig `1.0 → 1.12` per beat; stagger 3–5 frames; line-by-line code focus with deterministic token spans; `tabular-nums` on prices, counters and phone.
- No HUD, timecodes, progress bars, stat walls, fake dashboards or invented product screenshots. One quiet brand/kicker line and a metaphorical phone frame are used, never as proof of a real UI.
- White assets: `plates/15-clean-white.png`, `plates/12-clean-paper.png`; isolated white PNG elements `16-white-gold-orb.png`, `17-white-violet-ribbon.png`; ink SVGs `phone-frame-ink.svg`, `code-brackets-ink.svg`, `signal-arc-ink.svg`, `node-graph-ink.svg`. Old busy plates `07`–`10` and V3 navy plate `11` are **not** the V4 background.
- **Not self-certified.** One hero per beat and proof readability remain owner-side judgments.

## G5 — Technical render

Receipt: [`../qa/websites-v4-technical.out`](../qa/websites-v4-technical.out).

- `ffprobe`: H.264 video `1080×1920`, `60/1`, `1410` frames, `23.500000s`; AAC audio `48000 Hz`, `2ch`, `1104` frames, `23.509000s`.
- Format `mov,mp4,m4a,3gp,3g2,mj2`, duration `23.509000s`, size `3,699,257` bytes, bit_rate `1,258,839`. Container `mp4` family; `UNDER_25_SECONDS YES`.
- Full decode with imageio ffmpeg v9.0.2: **exit 0 / FULL_DECODE_OK**.
- Render engine: **Remotion 4.0.544 + React 18 + Chromium 153**. Motion Canvas / Revideo / Timecut / Manim-MCP did **not** render this MP4.
- Keyframe still rendered before MP4; six QA stills and eight decoded MP4 frames were built into `07-contact-sheet.png` and `07-mp4-contact-sheet.jpg`.

## G6 — White-dominant background / sun readability / human visual check

Viewed: `07-altraware-websites-v4-poster.png`, `07-contact-sheet.png`, `07-mp4-contact-sheet.jpg`, plus local full-size `qa-v4/frame-*.png` and eight decoded `mp4-*.png` frames. Receipt: [`../qa/websites-v4-visual.out`](../qa/websites-v4-visual.out).

- Six still frames and eight encoded-video frames are white/near-white dominant with dark ink text. Sampled luminance `>=200` covers `0.919–0.981` of pixels; mean luminance `237.7–245.8 / 255`.
- Dark is subordinate only: narrow top accent band, dark ink type, colored question/price chips and the CTA gradient. No full-frame dark theme.
- One hero per beat: phone, question cards, language/code card, price rows, ownership/CTA card. Copy stays inside the safe zone; captions sit on a solid rounded white plate; code, prices and phone use high contrast and `tabular-nums`.
- Logo is the owner-confirmed purple-cloud mark; it appears only in beat 5, not inside AI art.
- **Agent-side human check complete. Owner-side phone check in strong sun and final visual approval are still required** before music, final edit or posting.

## Drive handoff

| File | ID | View | Direct | Size | Created | Permission |
| --- | --- | --- | --- | --- | --- | --- |
| MP4 | `1cfTBt5uUIAt7q7pmThfI9EsIYf1epxTY` | https://drive.google.com/file/d/1cfTBt5uUIAt7q7pmThfI9EsIYf1epxTY/view?usp=drivesdk | https://drive.google.com/uc?id=1cfTBt5uUIAt7q7pmThfI9EsIYf1epxTY&export=download | 3,699,257 bytes | 2026-11-18T11:19:23.228Z | `anyoneWithLink reader`, `allowFileDiscovery=false` |
| Contact sheet | `1ZWjIlUuCFSCrhzphpLiZFEPL2sg6cPQC` | https://drive.google.com/file/d/1ZWjIlUuCFSCrhzphpLiZFEPL2sg6cPQC/view?usp=drivesdk | https://drive.google.com/uc?id=1ZWjIlUuCFSCrhzphpLiZFEPL2sg6cPQC&export=download | 151,263 bytes | 2026-11-18T11:19:23.587Z | `anyoneWithLink reader`, `allowFileDiscovery=false` |

`get_file` verified both files as `shared=true` with the `anyoneWithLink` reader permission.

## Owner handoff still pending

- Approve the white-dominant look on a real phone in strong sun; confirm or replace the auto-assigned male voice.
- Add music/SFX and final edit (including any shorter end card).
- Post manually to `@altrawaretechnology` / LinkedIn; reply to comments manually.
- Record `views, reach, saves, sends, profile visits, hold@3s` in `content-kit/log-template.md` after posting.
