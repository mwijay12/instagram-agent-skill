---
name: tech-video-motion-graphics
description: >-
  Design and build programmatic tech videos, code walkthroughs, system architecture explainers, kinetic typography and 60fps motion graphics using Remotion, Motion Canvas, Revideo, Manim/MCP, Timecut/GSAP and frame-driven skills. Use whenever the user asks to create programmatic MP4 videos, animate code diffs, build tech Reels, generate clean backgrounds/elements, prepare bilingual Kiswahili + English content, or wants an agent to prepare video/social content repeatedly.
---

# tech-video-motion-graphics — v2.0

The fifteenth skill in this fork, upgraded from the owner's brief: **"kwa mwanzo ni nzuri sanaa, but we need to use skills ili zitokee nzuri zaidi"**, and the direct critique **"background so busy, si clean"**.

This skill now covers both halves of the job:

1. **Programmatic motion craft** — code-to-video, not text-to-video.
2. **Repeatable content engine** — research, bilingual scripts, captions, carousels, QA and handoff.

## The one rule, never relaxed

**An AI video model must never be asked to draw code, glyphs, numbers, captions or a logo.** It supplies texture plates and isolated elements only. Everything readable is drawn deterministically from JSON / React / SVG.

## 0. Verified state, not aspirational

Snapshot 17 Nov 2026, re-check before quoting:

| Thing | Status |
| --- | --- |
| Remotion 4.0.544 + React 18 | **Rendered** `05-altraware-websites-v2.mp4`: 1080×1920, 30fps, 36.011s, H.264+AAC, full decode exit 0 |
| Chromium 153 from `@sparticuz/chromium` | Ran headless-shell; AL2023 libs via `LD_LIBRARY_PATH` |
| `ffmpeg-mcp@0.0.3` | Ran over stdio; `listTools` + `extract_audio` succeeded |
| `manim-mcp@0.1.1`, `@motion-canvas/*@3.17.2`, Revideo, Timecut | Installed/inspected; scripts written; **not rendered** |
| Context7 / Smithery / Cursor Directory / `remotion/llms.txt` | **Not connected / not found**; do not claim live docs |
| Python Pillow + ffmpeg fallback | Still available as deterministic fallback, not a Remotion clone |
| Drive handoff | MP4 uploaded with `anyoneWithLink reader` |

GitHub repos checked with `gh api`: `Tejashmakwana/motionmaxxing` (1,654★), `charlie947/motion-graphics-skills` (709★), `Barty-Bart/motion-graphics` (1,352★), `heygen-com/hyperframes` (86,101★), `naqashafzal/AI-Content-Studio` (946★), `remotion-dev/remotion` (73,958★), `motion-canvas/motion-canvas` (20,013★), `redotvideo/revideo` (4,219★), `ManimCommunity/manim` (42,653★), `abhiemj/manim-mcp-server` (662★), `tungs/timecut` (656★), `upstash/context7` (65,034★), `modelcontextprotocol/servers` (92,074★). Stars are snapshots, not proof.

Full evidence: `skills/tech-video-motion-graphics/ENGINE-TRIAL.md`.

## 1. Select the right engine

Choose ONE engine per deliverable; do not mix prompt paths.

| Visual dominant | Engine |
| --- | --- |
| React layouts, audio-synced captions, current Reels | **Remotion** |
| Sequential code mutations, node graphs, `yield*` | Motion Canvas / Revideo |
| Algorithms, networking, math | Manim + MCP |
| Existing GSAP HTML page at 60fps | Timecut |
| HTML-to-video agent workflow | HyperFrames |
| No browser available | deterministic Pillow + ffmpeg fallback |

Support skills: motionmaxxing gates, Charlie Hills launch-grade prompts, Barty-Bart B-roll/SFX licensing, `rediumvex/social-media-caption-generator-claude`, `DennisWei9898/social-cards-engine`, `ScrapeCreators/social-media-research-skills`, `blacktwist/social-media-skills`, `multica-ai/andrej-karpathy-skills`.

## 2. Clean background law (owner correction)

The V2 contact sheet was readable but too busy. **V3 must be calm.**

- Use flat / low-frequency grounds: `content-kit/code-video/plates/11-clean-navy.png`, `12-clean-paper.png`.
- Put motion in separate SVG/PNG elements: `content-kit/code-video/elements/*.svg`.
- One hero per frame; quiet safe zone behind every text block.
- Old busy plates may be cropped/low-opacity fragments only, never full-frame behind copy.
- No page chrome: no HUD, timecodes, progress bars, stat walls, fake dashboards or invented product screenshots as proof. One quiet brand/kicker line and a metaphorical phone frame are allowed.
- Add **G6 = background readability**, judged by eye on the contact sheet. G1/G4 also remain human.

Full spec: `content-kit/code-video/VISUAL-SYSTEM.md`.

## 3. Frame-driven physics and timing

Never use browser clocks.

Remotion:

```ts
const frame = useCurrentFrame();
const {fps} = useVideoConfig();
const p = spring({frame, fps, config: {damping: 14, stiffness: 120, mass: 0.8}});
const x = interpolate(frame, [0, 60], [0, 240], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
```

- Every transform / opacity / layout shift is a pure function of `frame`.
- No CSS `transition`, `animation`, `requestAnimationFrame`, `setTimeout` inside a shot.
- Unclamped interpolation is banned.
- `fontVariantNumeric: 'tabular-nums'` for counters/prices.
- 60fps rendered for V3, 1080×1920 vertical, `damping: 20, stiffness: 160, mass: 0.9`.

Motion Canvas / Revideo: use generator signals and `yield*`; `easeOutExpo`, `easeInOutCubic`, `spring(PlopSpring, ...)`. Calling `node().opacity(1, 0.5)` without `yield*` creates an unexecuted generator.

## 4. Code is choreographed, not pasted

- Line-by-line focus: unrelated lines **25%**, active line **100%** with highlight bar.
- Token morph / diff: `edit` / `insert` / `remove` over **0.6–0.9s**.
- Syntax highlighting: strings gold `#eab308`, keywords violet `#7c3aed`, punctuation paper. Use Shiki or deterministic spans.
- Only real code from this repo / owner projects; anything else is labelled `ILLUSTRATIVE`.
- Never a screenshot of a wall of code.

## 5. Visual pacing and virtual camera

- **3-second rule:** no frame stays static > 180 frames at 60fps.
- Camera rig: parent transform, zoom `1.0 → 1.35`, pan toward the active component, then pull back.
- Staggered entrances: 3–5 frames (0.05–0.08s @60fps).
- Kinetic typography: Fraunces display + JetBrains Mono technical badges, tight tracking, one accent with one meaning.
- Cut on motion; entries decelerate, exits accelerate; almost nothing fades between scenes.
- End card ≤ 1.4s; no web-footer ending.

## 6. Gates — computed, not self-certified

| Gate | Pass | Method |
| --- | --- | --- |
| G0 render exists | decodes, not blank, picture moves, length matches, audio present | `look.py` / ffprobe |
| G1 proof readable | UI text ≥ 0.04H, lit, in a world | by eye |
| G2 no empty frame | no run > 3 flat frames | `look.py` |
| G3 end card short | hold ≤ 1.4s, final shot ≤ 25% | `look.py` |
| G4 one hero per frame | ≤ 3 focal objects, one dominant | by eye |
| G5 no page chrome | no HUD/timecodes/progress bars/stat walls; one quiet brand/kicker line allowed | grep + by eye |
| **G6 clean background** | hero line readable in one glance | by eye on contact sheet |

Quote script numbers. Never certify the film as "good".

## 7. Brand, claims and bilingual content engine

Canonical: `content-kit/09-decisions.md`, `content-kit/data/brand-profile.json`, `content-kit/data/channels.json`, `content-kit/data/projects.json`.

- Two voices: **Mwijay Davie** founder journey / AI / vibe coding; **Altraware Technologies** product proof / systems / pricing.
- **Kiswahili + English** as paired variants from the same JSON beat map, not one mixed paragraph.
- Niche: tech business, IT, AI, vibe coding, money-making online.
- 15 projects are proof sources; `Avocado Farmers` is a **demo**, `Faida POS` is in development, others need URL verification.
- Screenshots: `fetch_page` gives text + main image URL; real browser screenshots are owner-supplied until a browser tool exists.
- Trends: `web_search` + research skills, cite the source, separate third-party claim from our proof, owner approves before any number appears.

Guards:

- Starting prices only: Web Starter 350k, Growth 550k, Custom kuanzia 800k, mifumo kuanzia 1.2M. Care Plan 99k/month is a **separate service, not SaaS**.
- `offline-first, cloud-synced` is **Faida POS only**, not websites in general.
- Ownership: `Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.`
- Tagline exact: `Built in Tanzania, for how Tanzania really works.`
- Link `https://altra.tanzaniareach.com/`, never "official website", never invented domain.
- No `100%`, `95+ Lighthouse`, `<2s on 2G`, `0.8s`, `10x`, `99.98%`, invented clients/testimonials/metrics.
- Live site copy currently conflicts with these decisions; use the canonical files, not scraped site copy.

## 8. Loop — run it every time

1. Read canonical decisions + project/channel/brand registries.
2. Pick ONE project + ONE pillar + ONE true claim.
3. Research trend/source if needed; cite it.
4. Write SW + EN script; 3 hooks each; run `skills/ig-reel/hookscore.py`.
5. Write caption; run `skills/ig-caption/caption.py --keywords ...`, then `skills/ig-human/detect.py` / `humanize.py`. Say Job A or Job B; do not force REVIEW to PASS.
6. Build beat map / carousel outline from JSON. Choose engine.
7. **Verify a keyframe still first** and look at it. Then render.
8. `esbuild` / JSON parse, `ffprobe`, full decode, contact sheet, G0–G6, QA receipts.
9. Upload to Drive with `anyoneWithLink reader`; save link in `samples/*-drive-links.md`.
10. Hand off script/caption/carousel/video. **Owner adds music, edits and posts.** No auto-DM, bot, credentials or account changes.

## 9. Handoff sentence for AI-texture engines

> "Composite all code, numbers, glyphs, captions and the logo afterwards as real text. The model supplies clean plates and isolated elements only."

## 10. Limits — say them out loud

- Remotion rendered V2 at **30fps** and V3 at **60fps / 2160 frames**. Do not claim any other engine rendered an MP4.
- Motion Canvas / Revideo / Timecut / Manim-MCP have **not** rendered an MP4 here.
- `ffmpeg-mcp` ran; `manim-mcp` was inspected but not run.
- No Context7 live docs, no Smithery, no Cursor Directory install, no `llms.txt` found.
- TTS is one consistent voice; no music/SFX. Owner adds them.
- Kiswahili hook scores are unvalidated translations, not view predictions.
- `detect.py` clean Swahili is normally REVIEW; do not self-certify.
- IG insights require 10–30 owner-posted items. No posting, no DM, no account changes.
- Drive reference video `1S-DgN0qHFeRApDUJW6mLFRA822ylAuWe` was not accessible to the connected account; do not claim it was watched.
- V3 clean Reel is a review cut: owner still approves the background, adds music/SFX, does final edit and posts manually.

## 11. Confirmed owner inputs — 17 Nov 2026

- IG Altraware: **`@altrawaretechnology`**.
- LinkedIn company: `https://www.linkedin.com/company/altraware-technology/posts/?viewAsMember=true`; personal: `https://www.linkedin.com/in/mwijay-davie/`.
- Public phone: **`0790942616`** for credits/captions/CTA. Human `+255 792 867 427` stays internal.
- Logo: `content-kit/assets/altraware-logo.png` confirmed; copy to `engine-trial/public/logo.png` for V3.
- Site copy: continue with `09-decisions.md`; site update deferred.
- First deliverable: **V3 clean Reel**; 3 posts/week pilot assumed.
- Drive reference video still not accessible; do not claim it was watched.

## 12. V3 clean Reel — rendered 18 Nov 2026

- Composition `AltrawareWebsitesV3`: 1080×1920, **60fps**, 2160 frames, 36.011s, H.264 + AAC.
- Clean plates `11-clean-navy.png` / `12-clean-paper.png`, isolated PNG elements `13-gold-orb.png` / `14-violet-ribbon.png`, animated SVGs from `content-kit/code-video/elements/`.
- All readable text/code/numbers/captions/timing from `BEATS[]`; frame-driven only; camera rig 1.0→1.35; stagger 3–5 frames; line-by-line code focus; `tabular-nums`.
- QA: [`content-kit/code-video/QA-websites-v3.md`](../../content-kit/code-video/QA-websites-v3.md), G0–G6 including human background-readability check.
- Drive review: https://drive.google.com/file/d/1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3/view?usp=drivesdk
- No music/SFX, no live posting, no DMs, no bot, no credentials, no account changes.
