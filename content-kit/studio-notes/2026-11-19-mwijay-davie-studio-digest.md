# Studio repo digest — mwijaydavie/mwijay__davie

**Imepitiwa:** 19 Nov 2026 · full read (AGENTS.md, README, strategy, playbook, creative-direction, tools, series files, pilots 01–14, research notes, skills zote mbili, production/website-era + search-race source).

## Muundo wa studio

- **Akaunti mbili, kazi mbili:** @mwijay__davie (devs/founders, SW Reels, watch-time metric) na @altrawaretechnology (wamiliki wa biashara, carousels, saves+inquiries). LinkedIn = EN-first, one screen/one decision/one lesson.
- **Series 4 kwa wiki 4 za pilot:** Built in Tanzania (Njombe) → Systems under pressure (Faida POS) → Vibe coding with receipts (MwijayNote) → Tech skills → paid work. Story moja → Reel + carousel + LinkedIn, si story 12.
- **Pilots 01–14:** kila moja ina md file na ugani (SW/EN), captions, DM copy, claims+sources zenye tarehe, na production folder kwa zilizo renderiwa (website-era, search-race zina full source).

## Kanuni zilizoanzishwa (AGENTS.md + playbook + creative-direction)

1. **One audience · one provable claim · one visible artifact · one CTA.** Hakuna madai bila source yenye tarehe; metrics zisizojulikana ziachwe wazi.
2. **Lebo za uaminifu:** DEMO / MFANO / IN DEVELOPMENT / KIELELEZO on-screen. Data halisi ya wateja/watoto/mashamba haingii Git wala screen.
3. **Keyword discipline:** keyword moja (PARACHICHI, TEST, API, SEARCH, WEB…), tahajia ileile kwenye creative + caption + DM; resource iwe TAYARI kabla ya post; link moja ya audience, si folda ya kazi.
4. **Sauti:** owner VO ni toleo kuu; TTS = scratch cut yenye lebo. Swanglish kwa tech (`API key`, `rate limit`, `deploy`); namba kwa maneno ("shilingi elfu tano"); hakuna kusoma URL.
5. **Picha:** palette inatoka kwenye PRODUCT, si studio theme moja. White/cream itawale (kusomeka jua la simu). Badilisha background family kila episode; contour si default. SVG za sekta zinaposaidia kitendo.
6. **Motion:** kitendo kimoja libebe stori kila sekunde 2–3; cut juu ya action; 60fps daima (si 30fps ya wengine).
7. **Tools:** Remotion = default; Motion Canvas kwa code diffs; HyperFrames alternate; motionmaxxing/charlie947/Barty-Bart = direction/QA/choreography reference. Hakuna platform mpya kabla pilot haijapitia review.
8. **Hakuna** autopost, DM auto-change, deploy, wala mark clearance bila ridhaa maalum.

## Skill mpya: altraware-search-reels (imeingizwa kwenye `skills/`)

- Mechanism: swali la mteja → type → submit → result `.example` → hover → click → open. `searchAt(plan, frame)` pure function; `check-opening.mjs` validates (label, `.example` domain, beats zinazofuatana); `preview-opening.mjs` = SVG storyboard.
- `MFANO WA SEARCH` / `SEARCH DEMO` visible throughout; mock itengenezwe na evidence kwa hard cut + lebo.
- 45s rhythm: 0–6 search · 6–12 anakuta nini · 12–20 levers · 20–28 examples 2 · 28–38 value+caveat · 38–45 close.
- Host: female Business host (art private), Rhubarb visemes = estimate tu kwa Swahili; ChatGPT/Gemini = text-only marks isipokuwa zimecleariwa.

## Pilot 14 (website-era) — "latest" niliyojifunza

- Six `Sequence` shots [0–360–708–1176–1656–2256–2700], `layout.json` inabeba motion timings, `cues.json` inabeba trims/joins/lead + caption parts SW/EN, `editions.json` = SW/EN outputs tofauti (reel, master, cover, PDF, kit, SRTs).
- Host rig: base + hand pivot + 8 mouth patches + lids blink, weights kutoka `visemes.mjs` dhidi ya dry VO.
- `guide.mjs`: WEB checklist PDF kupitia playwright print-to-PDF + fit asserts. (Kwangu hiyo ina-hang → nimetumia fpdf2; content ileile.)
- QA: `verify-and-pack.py` — CFR timestamps, loudness, caption bounds, evidence hashes; owner gates = listen-through, IG UI crop, mark clearance, CTA approval, in-IG WEB delivery.

## Nilichotumia kwenye Business Story 03 (booking-era)

6-shot contract ileile · plan yangu `production/booking-era/opening.plan.json` (imepita checker) · text-only marks · KIELELEZO labels · caveat "Kuonekana si guarantee" audible+visible · keyword WEB + PDF tayari · scratch voice-04 (female, user-selected) imewekwa lebo "owner VO inakuja".

## Sipo/wezi kutoka hapo (zinahitaji owner)

- Host art + rig (private) · proof captures halisi za Bongo/Audenic (private kit, md5/pinned) · reference video ya Drive (imeshindikana kufikiwa: private + connector bug) · DM automation setup.
