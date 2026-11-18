# Code → Video: prompts zisizotoa output za kawaida

> Kwa `@mwijay__davie` na `@altrawaretechnology` · 17 Nov 2026
> Vitengo vyote viko tayari: [`scenes.json`](scenes.json), [`promptgen.py`](promptgen.py), [`prompts/`](prompts/), [`render_video.py`](render_video.py), [`samples/01-faida-offline.mp4`](samples/01-faida-offline.mp4).

---

## 1. Kwa nini ulikuwa unapata "outputs mbaya za kawaida"

Sio kwamba modeli ni mbaya. Ni kwamba prompt yako ilikuwa **tupu mahali muhimu**. Haya ndiyo mapungufu niliyoyakuta, kwa mpangilio wa athari:

| # | Kilichokosekana | Modeli ilijaza pengo na | Kirekebisho hapa |
| --- | --- | --- | --- |
| 1 | **Artifact halisi** (repo, faili, mstari wa code, risiti) | "mtu anayetype kwenye laptop gizani", "dashboard yenye chart za uwongo" | `scenes.json` inaanza na `artifact.repo`, `code`, `numbers`, `sources` |
| 2 | **Brand tokens** | gradient ya zambarau-bluu, fonti zozote, glossy blobs | `02-brand-system.md`: hex halisi, fonti 3, coordinates, contour, 0.3/0.6/1.1s |
| 3 | **Code iliyoombwa kuchorwa na modeli** | maandishi yasiyosomeka, syntax ya kubuni, herufi zilizopotoka | code inatoka kwenye **render halisi** (HTML/Remotion/Pillow+ffmpeg); modeli inapamba tu |
| 4 | **Shot list yenye sekunde** | shoti moja ndefu ya cinematic, Ken Burns kwenye screenshot | kila scene ina beats 5 zenye `t`, `visual`, `text`, `motion`; mabadiliko ≤ 2.5s |
| 5 | **Negative prompt** | globe, binary rain, sparkle, robot, confetti, "seamless" | `common_negative` yenye vitu 30+, inaingizwa kwenye kila prompt |
| 6 | **Vizuizi vya 9:16** | maandishi chini ya caption bar, upande wa action rail | safe zones zimeandikwa kwenye BRAND BLOCK ya kila prompt |
| 7 | **QA gate** | unakubali clip ya kwanza kwa sababu "inaonekana vizuri" | orodha ya 12 kabla ya kukubali clip |

Na sababu ya nane, iliyo nje ya prompt: **brand yako haikuwa imeandikwa popote**. `templates/voice.md` kwenye repo hili ilikuwa tupu. Hata caption nzuri inatoka kwa sauti ya default. Ndiyo maana `use-voice.sh` iko mwanzoni mwa kit.

---

## 2. Before / after (tofauti yote iko hapa)

**Before** — hii ndiyo inayozalisha "za kawaida":

```
Create a cinematic 4K vertical video about my POS app for Tanzanian shops.
Make it modern, professional and engaging, with cool motion graphics,
a happy business owner, and trending music. Add a call to action.
```

**After** — hii ndiyo `promptgen.py --scene faida-offline --lang sw` inatoa (kipande):

```
## 1. CHANZO CHA UKWELI
Artifact : POS ya Flutter yenye risiti za thermal, tahadhari za stoo,
           matawi mengi, na APK kupitia GitHub Releases
Repo    : mwijay12/faida-pos-releases  (https://github.com/...)
Numbers you may state: mifumo kuanzia TSh 1,200,000; Care Plan TSh 99,000/mwezi (huduma tofauti, si SaaS)
Code to composite:
  const sale = await faida.checkout({
    items, pay: "M-PESA",
    lang: "sw"
  })
Code source: altra.tanzaniareach.com homepage (verified)
GUARD: Usiseme '100% offline' wala '0.8s checkout'...

## 3. ORODHA YA SHOTI
  0:00-0:02 | real hand flipping a phone's Wi-Fi toggle; navy frame,
              gold crosshair, coords in mono
              | ON SCREEN: Nazima Wi-Fi kwenye duka.
              | MOTION: hard cut, 0.3s snap, no fade
  ...

## 4. BLOCK YA BRAND
navy #071022 ... gold #eab308 ... Fraunces / Inter / JetBrains Mono ...

## 7. YALIYOKATAZWA
generic purple-blue gradient, glassmorphism blobs, hooded hacker,
unreadable garbled code, invented syntax, invented client name, ...
```

Tofauti si "maneno mengi zaidi". Ni **ukweli, vizuizi, na orodha ya yasiyoruhusiwa**.

---

## 3. Tabaka 7 za prompt (ndio mfumo)

| Tabaka | Swali linalojibiwa | Mahali kwenye kit |
| --- | --- | --- |
| **1 · Artifact** | Ni kitu gani halisi kinachoonekana? | `artifact` kwenye `scenes.json` |
| **2 · Claim** | Sentensi moja ya kweli, isiyo na kivumishi? | `claim_sw` / `claim_en` |
| **3 · Shot list** | Nini kinasogea kila sekunde, na maandishi gani? | `beats[]` (5 kwa scene, 8 scene = 40 beats) |
| **4 · Brand tokens** | Rangi/fonti/motifu gani, na yapi yamekatazwa? | `02-brand-system.md` → BRAND BLOCK |
| **5 · Motion** | Muda na easing gani, frame inabadilika lini? | 0.3 / 0.6 / 1.1s, `cubic-bezier(.22,1,.36,1)`, cut ≤ 2.5s |
| **6 · Negative** | Ni cliché zipi zisiruhusiwe kabisa? | `common_negative` (vitu 30+) |
| **7 · QA gate** | Nitajuaje clip iko tayari? | orodha ya 12 mwishoni mwa kila prompt |

Carousel [`06-prompt-moja`](../carousels/decks/06-prompt-moja.json) inafundisha tabaka hizi 7 kwa hadhira yako. Recap slide yake ndiyo ya kuscreenshot.

---

## 4. Njia tatu (usizichanganye)

| Unataka | Engine | Amri | Nani anachora code |
| --- | --- | --- | --- |
| Texture/B-roll ya sinema kutoka kwa Veo / Sora / Runway / Kling | `ai-video` | `python3 promptgen.py --scene faida-offline --engine ai-video --lang sw` | **Wewe**, baadaye kwenye compositor. Modeli hairuhusiwi kugusa code. |
| Reel ya kweli iliyorekodiwa kwenye simu + screen recording | `editor` | `--engine editor --lang en` | Screen recording halisi |
| Video inayotengenezwa **kabisa na code**, bila modeli yoyote | `remotion` (au `render_video.py`) | `--engine remotion --lang en` | Browser / Pillow. Herufi zote ni kweli. |

**Kanuni ya dhahabu:** *AI video model haijui kuandika code inayosomeka.* Ukimwomba, unapata maandishi yanayofanana na code. Kwa hiyo code, namba, risiti na captions vinatoka kwenye deterministic render; modeli inapewa kazi ya texture pekee. Hii ndiyo sababu `video-factory` yako (MoviePy, cuts 1.5–2.5s, captions, dual-language TTS) inaweza kutoa kitu bora mara tu **upstream prompt** inapokuwa na shot list: usiipatie script huru, ipatishe `beats[]` kutoka `scenes.json`.

---

## 5. Tumia

```bash
# Orodha ya scene 8 halisi
python3 promptgen.py --list

# Prompt moja, Kiswahili, tayari kunakili
python3 promptgen.py --scene faida-offline --lang sw

# Prompt hiyo kwa Kiingereza (technical depth / wateja wa nje)
python3 promptgen.py --scene faida-offline --lang en

# Brief kwa editor, au spec ya Remotion
python3 promptgen.py --scene shule-altra --engine editor --lang en
python3 promptgen.py --scene motion-lab-coords --engine remotion --lang en

# Tengeneza faili zote kwenye prompts/
python3 promptgen.py --all

# Video halisi kutoka code (Pillow + ffmpeg), 1080x1920, 16s
python3 render_video.py

# PASI KAMILI: picha 3 (plates) + TTS ya Kiswahili + AAC -> MP4 yenye sauti
python3 render_reel_v2.py                  # samples/02-faida-offline-tts.mp4
python3 render_reel_v2.py --no-voice       # sauti = kimya (parity na sample ya msingi)
python3 render_reel_v2.py --no-plates      # contour za code tu, bila picha za AI

# FINAL: + logo halisi la mmiliki + credits + "comment neno POS" (clip ya 6 ya TTS)
python3 render_reel_final.py                # samples/03-faida-offline-FINAL.mp4

# Picha moja ya kukagua frame ya 8.0s
python3 render_video.py --still 8.0 --out /tmp/frame.png
```

`promptgen.py` ni stdlib tu. `render_video.py` inahitaji `Pillow` na `ffmpeg` (au `pip install imageio-ffmpeg`). Hakuna API key, hakuna network, hakuna modeli.

**Scene 8** (zote zina chanzo, hakuna namba ya kubuni):

| id | Akaunti | Kitu halisi |
| --- | --- | --- |
| `faida-offline` | studio | Faida POS, Wi-Fi off, risiti, SYNCED |
| `shule-altra` | studio | NECTA O-level, Shule Guide ya lugha mbili |
| `loanapp-lims` | binafsi | Dual-IMEI, NIDA 20, matawi 5 |
| `tabtune-swh` | binafsi | `.lrc` kwa Kiswahili / Sheng / English |
| `roadsafety-dar` | binafsi | Data ya barabara za DSM, ⭐4 |
| `motion-lab-coords` | studio | WebGL contour, tokens halisi, `6.7924° S` |
| `hype-alarm` | binafsi | Tauri + Rust, 400% volume, offline fallback |
| `repos-42` | binafsi | Repo 42 za public (17 Nov 2026) |

---

## 6. Sheria za ukweli (hazijadiliwi)

- Kila `numbers[]` kwenye scene ina chanzo. **Usiongeze namba.** Ukikosa, `NEEDS_INPUT`.
- Code iliyoandikwa `REAL` imenakiliwa kutoka kwenye tovuti/repo yako. Iliyoandikwa `ILLUSTRATIVE` ni ya kiufundi tu na **lazima ibaki na lebo hiyo** kwenye frame. Kamwe usiiwasilishe kama code ya repo.
- Hakuna majina ya wateja, NIDA/IMEI halisi, data ya mgonjwa/mwanafunzi, asilimia za matokeo, wala ushuhuda.
- `guard` ya kila scene ni sehemu ya prompt; usiifute. Ndiyo inayokuzuia kusema "100% offline", "0.8s checkout", "42 clients", au kuchanganya `cloud-first` na `offline-first` ([`09-decisions.md`](../09-decisions.md), maamuzi ya mmiliki ya 17 Nov 2026).
- "Repo 42 / followers 205" ni za 17 Nov 2026. Angalia tena kabla ya kuzitumia tena.

---

## 7. QA kabla ya kupost (nakili kwenye notes zako)

```
[ ] Frame 1 ina kitu halisi, si salamu, si "leo tutaonyesha", si logo sting.
[ ] Kuna mabadiliko ya kweli ndani ya sekunde 2.5 (si Ken Burns kwenye screenshot).
[ ] Namba moja tu kubwa, na ina chanzo.
[ ] Rangi ni navy/paper + accent MOJA. Hakuna gradient wala glossy blob.
[ ] Code inasomeka; imetoka kwenye render, si modeli.
[ ] Kiswahili mstari wa kwanza, English mstari wa kiufundi; hakuna tafsiri mara mbili.
[ ] Captions zimeburniwa (watu wanaanza muted).
[ ] Ask MOJA tu, keyword inatamkwa na inaweza kuandikwa.
[ ] Hakuna URL, hakuna emoji bullets, hakuna hashtag wall.
[ ] Hakuna kitu kutoka common_negative.
[ ] Sauti: hakuna muziki chini ya sekunde 2 za kwanza.
[ ] Nimeiangalia kwenye SIMU, 1080x1920, sauti imezimwa.
```

Ukikosa mawili, **usiongeze "cinematic, 4K, highly detailed, masterpiece"**. Maneno hayo huongeza clichés, haziongezi ubora. Ondoa pengo kwenye tabaka 1–6.

---

## 8. Kilichotengenezwa tayari kwenye folda hii

| Faili | Kazi |
| --- | --- |
| `scenes.json` | Scene 8, beats 40, brand tokens, negative list, guards |
| `promptgen.py` | Inajenga prompt ya tabaka 7 kwa engine 3 × lugha 2 |
| `prompts/` | Prompt zilizotengenezwa tayari: `*.ai-video.sw.txt`, `*.ai-video.en.txt`, `*.editor.en.txt`, `*.remotion.en.txt` |
| `render_video.py` | Renderer halisi: Pillow + ffmpeg → MP4 ya 1080x1920 |
| `samples/01-faida-offline.mp4` | Mfano uliotengenezwa **kwa code**, si kwa modeli ya video |
| [`../studio/index.html`](../studio/index.html) | Live preview: cheza MP4, badilisha scene, nakili prompt |
| `render_reel_v2.py` | Pasi kamili: plates + TTS + mux → MP4 yenye sauti |
| `plates/` | Picha 3 za AI, **texture tu**, hazina maandishi/code |
| `audio/` | Clip 5 za TTS (Kiswahili, sauti moja) + `voiceover.wav` + script |
| `samples/02-*` | `02-faida-offline-tts.mp4`, `02-contact-sheet.jpg`, `02-render-manifest.json` |
| [`TRY-IT.md`](TRY-IT.md) | Njia ya kutumia skill leo, hatua kwa hatua (Kiswahili) |
| [`QA-v2.md`](QA-v2.md) | Receipts za pasi kamili + gate ya 12 |
| `render_reel_final.py` | FINAL: end card, logo halisi, credits, CTA `POS`, clip ya 6 |
| `assets/altraware-logo.png` | Logo la mmiliki (`final_poster_1.png`), si AI-drawn |
| `samples/03-*` | `03-faida-offline-FINAL.mp4`, contact sheet, manifest, [`03-drive-links.md`](samples/03-drive-links.md) |
| [`QA-final.md`](QA-final.md) | Gate ya 12 ya FINAL + usafi wa madai |
| `skills/tech-video-motion-graphics/render_websites.py` | Websites 60fps: spring/camera/code-diff, `--still` kwanza kisha `--fps 60` |
| `samples/04-*` | `04-altraware-websites.mp4`, contact sheet ya frame 9, manifest, [`04-look.md`](samples/04-look.md), [`04-drive-links.md`](samples/04-drive-links.md) |
| [`QA-websites.md`](QA-websites.md) | Gate ya websites + uaminifu wa engine |
| [Google Doc](https://docs.google.com/document/d/1Nt9f_TasuJ-a5BieeU3YrBbt8HfJSCWMLPDwMGV8GPs/edit?usp=drivesdk) | Brief ya script + caption + limits, public |

---

## 9. Mapungufu ya uaminifu

- `ai-video` prompts hazihakikishii matokeo: kila modeli ina tabia yake. Ndiyo maana zinatoa **texture tu** na QA gate, si ahadi ya "viral".
- `render_video.py` (sample ya msingi) **haina sauti**. `render_reel_v2.py` inaongeza voiceover ya TTS (clip 5 za Kiswahili, sauti moja) na plate 3 za picha; `render_reel_final.py` inaongeza clip ya 6, **logo halisi la mmiliki**, credits na CTA moja. Zote zina-mux AAC kwa ffmpeg; **bado hakuna muziki wala SFX** (mmiliki ataongeza muziki mwenyewe), captions zimeburniwa. Sauti ya TTS inatoka kwenye zana ya nje, si `scenes.json`; usipokuwa na clips tumia `--no-voice`. Picha za AI ni **texture tu**, hazina maandishi wala ushahidi wa dai lolote; logo si la AI.
- Hii haiposti chochote. Unapata prompt, brief, spec na MP4. Unapost wewe.
- Mstari mmoja wa code kwenye `faida-offline` umenakiliwa kutoka [altra.tanzaniareach.com](https://altra.tanzaniareach.com/); mistari mingine iliyoandikwa `ILLUSTRATIVE` haijadaiwa kuwa ya repo zako.
- Namba kama `400% volume`, `0.8s checkout`, `99.98% uptime`, `10x faster billing` ni **vipengele/madai ya tovuti yako**, si vipimo. Kwenye prompts zetu `400%` imetumika kama kipengele kilichoandikwa kwenye README ya `hype-alarm`; nyingine hazijatumika.

---

## 10. Websites · 60fps programmatic motion graphics ⭐

Tofauti na `01/02/03` (Faida POS), hii ni **content ya websites kwa ujumla** ya
Altraware Tech. Inatumia skill ya 15: [`tech-video-motion-graphics`](../../skills/tech-video-motion-graphics/SKILL.md).

```bash
# Kagua keyframe KABLA ya full render (Remotion `still` equivalent)
/tmp/kvenv/bin/python skills/tech-video-motion-graphics/render_websites.py \
  --fps 60 --still 12.0 --out /tmp/web-frame.png

# Kisha render 60fps
/tmp/kvenv/bin/python skills/tech-video-motion-graphics/render_websites.py --fps 60 --crf 30
```

Laws zilizotekelezwa kwa code, si maneno: `frame` pekee (hakuna CSS transition,
`setTimeout` wala `requestAnimationFrame`), `spring(14/120/0.8)`, `interpolate()`
iliyo clamped, camera `1.0→1.35`, line-focus 25% + token morph 0.8s, stagger ya
frame 4, tabular-nums, 3-second gate iliyopimwa frame-by-frame, na **no page
chrome**. `04-look.md` inachapisha G0/G2/G3/G5; G1/G4 ni hukumu ya jicho kwenye
contact sheet ya frame 9.

⚠️ **Uaminifu:** Remotion, Motion Canvas, Revideo, Timecut na Manim-MCP
**havikurun** hapa (hakuna Chromium / MCP server). Hii ni fallback ya Pillow +
ffmpeg inayotekeleza laws zao kwa deterministic Python. TTS ya `voice-00` tu;
hakuna muziki wala SFX — mmiliki anaongeza muziki. Hakuna post, DM, auto-DM wala
mabadiliko ya akaunti.
