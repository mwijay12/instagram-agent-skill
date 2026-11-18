# Altraware Tech · Websites Reel brief (18 Nov 2026)

Content: websites in general for Altraware Technology — SI Faida POS-specific.
Skill: `tech-video-motion-graphics` (15th skill). Engine: deterministic
Pillow + ffmpeg fallback implementing Remotion / Motion Canvas laws.

## Hook iliyoshinda (80.0 STRONG)

Tovuti nzuri haipimwi kwa rangi. Inapimwa kwa ujumbe unaoingia kwenye simu yako.

## Script ya sauti (voice-00, TTS tu)

Tovuti nzuri haipimwi kwa rangi. Inapimwa kwa ujumbe unaoingia kwenye simu yako.
Wateja wako wako kwenye simu. Hapo ndipo tunapoanza.
Kiswahili na English: matoleo mawili, si tafsiri mara mbili.
Bei ya kuanzia iko wazi: Web Starter 350k, Growth 550k, Custom kuanzia 800k.
Care Plan ni huduma tofauti. Bei kamili inaandikwa baada ya scope.
Altraware Technology. Unahitaji tovuti leo? Comment neno TOVUTI.

## Caption (READY · 565/2200 · 3 hashtags · one ask)

Tovuti nzuri haipimwi kwa rangi. Inapimwa kwa ujumbe unaoingia kwenye simu yako.
Wateja wako wako kwenye simu. Ndiyo maana website yetu huanza na html lang="sw" na viewport ya simu, kisha Kiswahili na English kama matoleo mawili, si tafsiri mara mbili.
Bei ya kuanzia iko wazi: Web Starter 350k, Growth 550k, Custom kuanzia 800k. Care Plan 99k/mwezi ni huduma tofauti. Bei kamili inaandikwa baada ya scope.
Built in Tanzania, for how Tanzania really works.
Comment TOVUTI, tuanze mazungumzo ya scope na bei iliyoandikwa.
#WebDesignDarEsSalaam #Tovuti #AltrawareTech

## Motion laws zilizotekelezwa

- frame-driven pekee: hakuna CSS transition, setTimeout, requestAnimationFrame
- spring(damping 14, stiffness 120, mass 0.8), interpolate() clamped
- virtual camera 1.0 → 1.35, pan/zoom, 3-second pacing gate
- code line focus 25% dim + token morph 0.8s kwenye mistari halisi ya
  `content-kit/present/site/index.html`
- stagger ya frame 4, tabular-nums, kinetic type, no page chrome
- end card ya logo + credits 1.4s; G0/G2/G3/G5 ziko `samples/04-look.md`

## Deliverables

- `samples/04-altraware-websites.mp4` — 35.08s · 1080×1920 · 60fps · H.264 + AAC
- `samples/04-contact-sheet.jpg` — frame 9 zinazosomeka
- `samples/04-render-manifest.json` — clip 6, laws, guards, artifact halisi
- `samples/04-look.md` — gates zilizohesabiwa kwenye render
- `samples/04-poster.png` — poster ya hook
- `audio/voiceover-websites.wav` — sauti safi ya kuongezea muziki
- `websites-script.txt`, `websites-caption.txt`, `QA-websites.md`

## Uaminifu / limits

Remotion, Motion Canvas, Revideo, Timecut na Manim-MCP HAVIKURUN hapa: hakuna
Chromium, Playwright wala MCP server. Context7/`llms.txt` live docs hazikufuatwa.
Hii ni fallback ya Python inayotekeleza laws zao, si Remotion clone. TTS ni
`voice-00` pekee; HAKUNA muziki wala SFX — mmiliki anaongeza muziki. AI plates ni
texture tu; herufi, code, namba, captions na logo vinatoka kwenye renderer.
Hakuna `"100%"`, hakuna domain iliyobuniwa, hakuna "official website", hakuna
madai ya Lighthouse/uptime/2G. Bei zote ni za kuanzia kutoka `09-decisions.md`;
Care Plan 99k/mwezi ni huduma tofauti, si SaaS. CTA ni neno moja `TOVUTI` kwa
kuchuja chats kwa mkono — hakuna auto-DM, bot, post, DM, wala mabadiliko ya
akaunti ya Instagram.

## Drive (public, 18 Nov 2026)

Angalia `samples/04-drive-links.md` kwa orodha kamili. Muhimu:

- MP4: https://drive.google.com/file/d/1ExQEC_7Q3Ty95SKCzliSRCp9Ays31c6q/view?usp=drivesdk
- Direct MP4: https://drive.google.com/uc?id=1ExQEC_7Q3Ty95SKCzliSRCp9Ays31c6q&export=download
- WAV: https://drive.google.com/file/d/1pu9j_QaqHHppGc1Kwt4EvP6pr30Z9Lyy/view?usp=drivesdk
- Contact sheet: https://drive.google.com/file/d/1EhbjuiCZcMRwP59zhHC8y7qDrgP_WCal/view?usp=drivesdk
- Poster: https://drive.google.com/file/d/1XtLt7QIyhO3rf5VKKrCncR_mXRWDFo2U/view?usp=drivesdk
- Brief hii kama Google Doc: https://docs.google.com/document/d/1Nt9f_TasuJ-a5BieeU3YrBbt8HfJSCWMLPDwMGV8GPs/edit?usp=drivesdk

`anyoneWithLink reader` imethibitishwa kwa MP4 na Doc; WAV, contact sheet na
poster pia zimewekwa public.
