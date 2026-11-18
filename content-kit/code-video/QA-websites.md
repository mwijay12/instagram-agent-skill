# QA · Altraware Websites 60fps (18 Nov 2026)

Gate ya mwisho kabla ya mmiliki kuongeza muziki, ku-edit na kupost mwenyewe.
Hii si self-certification: namba za G0/G2/G3/G5 zinatoka kwenye
[`samples/04-look.md`](samples/04-look.md), na G1/G4 zimeangaliwa kwa jicho kwenye
[`samples/04-contact-sheet.jpg`](samples/04-contact-sheet.jpg).

| # | Gate | Matokeo |
| --- | --- | --- |
| 1 | Content ni **websites in general** ya Altraware Tech, si Faida POS-specific | ✅ PASS |
| 2 | Artifact halisi: `<html lang="sw">`, viewport, `<title>` kutoka `present/site/index.html` | ✅ PASS |
| 3 | Bei halisi za kuanzia kutoka `09-decisions.md` (350k / 550k / kuanzia 800k) | ✅ PASS |
| 4 | Guards: hakuna `100%`, hakuna domain iliyobuniwa, hakuna "official website", Care Plan si SaaS, hakuna Lighthouse/uptime/2G/10x | ✅ PASS |
| 5 | `hookscore.py` | ✅ **80.0 STRONG** (heuristic ya Kiswahili, si utabiri wa views) |
| 6 | `caption.py` | ✅ **READY** · 565/2200 · hashtag 3 · one ask · search terms 3/3 |
| 7 | `detect.py` | ⚠️ **71.6 REVIEW** · VOICE 48.0 kwa sababu Kiswahili haina contractions za Kiingereza; SLOP/FINGERPRINT/SPECIFICITY 100 |
| 8 | `beats.py` | ⚠️ REVIEW · 61 words / ~22.2s @165wpm; hook 4.4s na bei 4.7s, lakini visual inabadilika ndani ya beat (G2 inathibitisha) |
| 9 | `humanize.py` | ✅ PASS · 0 machine artefacts · 0 structural tells (hashtag wall 5→3 ilirekebishwa) |
| 10 | Render gates | ✅ **G0 PASS** · **G2 PASS** (flat run 1.983s < 3.0s) · **G3 PASS** (1.40s) · **G5 PASS** (no page chrome) |
| 11 | G1 / G4 | 👁 HUMAN · contact sheet ya frame 9: code/text inasomeka, one hero per frame, hakuna equal split panels |
| 12 | Probe + handoff | ✅ 35.07s · 1080×1920 · **60fps** · 2104 frames · H.264 + AAC 48kHz mono · [`04-drive-links.md`](samples/04-drive-links.md) · Google Doc public · `check.py` `47 pass · 0 warn · 0 fail · READY` · `node --check` OK · HTTP 200 |

## Kilichotekelezwa kwa code (si maneno tu)

- Frame-driven pekee: hakuna CSS transition, `setTimeout`, `requestAnimationFrame`.
- `spring(damping 14, stiffness 120, mass 0.8)`, `interpolate()` always clamped.
- Virtual camera `1.0 → 1.35`, pan/zoom, breath ya frame, 3-second gate.
- Code line focus 25% dim + token morph 0.8s; syntax highlighting; `tabular-nums`.
- Stagger ya frame 4, kinetic type, end card 1.4s, **no ACT/coords/timecode/progress bar**.
- RGBA ime-flatten-iwa juu ya navy/paper kabla ya `rgb24` pipe: ndiyo sababu
  mistari iliyodimwa na highlight hazijageuka rangi kali kwenye MP4.

## Mambo yaliyoachwa wazi / uaminifu

- ⚠️ **Remotion, Motion Canvas, Revideo, Timecut na Manim-MCP havikurun.** Hakuna
  Chromium, Playwright wala MCP server kwenye sandbox. Hii ni deterministic
  Pillow + ffmpeg fallback inayotekeleza laws zao, si Remotion clone. Context7 /
  `llms.txt` live docs hazikufuatwa; `remotion/llms.txt` ilikuwa 404 kwenye repo root.
- ⚠️ **Logo:** `assets/altraware-logo.png` ni `final_poster_1.png` iliyotumika bila
  uthibitisho maalum wa mmiliki. Kama si logo sahihi, badilisha asset na rerender.
- ⏳ **Phone check** bado ni ya mmiliki: angalia captions, CTA na end card kwenye
  simu halisi kabla ya kupost.
- Sauti ni TTS ya `voice-00` pekee. **Hakuna muziki wala SFX** — mmiliki ataongeza
  muziki mwenyewe. AI plates ni texture tu; herufi, code, namba, captions na logo
  vinatoka kwenye renderer.
- CTA moja: **`comment neno TOVUTI`** kwa kuchuja chats kwa mkono. Hakuna auto-DM,
  bot, post, DM, credential, wala mabadiliko ya akaunti ya Instagram.
- Vercel haijadeploy-iwa upya kwa pasi hii: preview za awali zilihitaji login/SSO,
  kwa hiyo Drive ndio link ya kuangalia mara moja.
