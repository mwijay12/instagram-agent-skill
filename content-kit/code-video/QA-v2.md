# QA — pasi kamili ya `/ig-codevideo` (18 Nov 2026)

Hizi ni **receipts halisi** za `render_reel_v2.py`, si orodha ya mambo tuliyokusudia. Angalia pia [`samples/02-render-manifest.json`](samples/02-render-manifest.json).

## 1. Vipimo vya output

| Kitu | Thamani |
| --- | --- |
| MP4 | `samples/02-faida-offline-tts.mp4` · **2.3 MB** |
| Muda | **20.13s** (manifest 20.14s) |
| Video | H.264 High / yuv420p · **1080×1920** · 24 fps · ~798 kb/s |
| Sauti | **AAC-LC · 48 kHz · mono** · ~123 kb/s (hakuna muziki, hakuna SFX) |
| Voiceover | `audio/voiceover.wav` · 20.14s · RMS ~3744, peak 27448 (**si kimya**) |
| Picha | `plates/01-duka.png`, `02-contour.png`, `03-risiti.png` (768×1376 → 1080×1920) |
| Contact sheet | `samples/02-contact-sheet.jpg` · frame 5 |
| Scene | `faida-offline` · `@altrawaretechnology` · `mwijay12/faida-pos-releases` |

## 2. Ramani ya sauti (iliyowekwa na code, si kubahatisha)

| Clip | Muda ghafi | Baada ya `atempo=1.10` | Start | End |
| --- | --- | --- | --- | --- |
| `01-hook.wav` | 4.08s | 3.72s | 0.15s | 3.87s |
| `02-risiti.wav` | 4.08s | 3.70s | 4.05s | 7.75s |
| `03-code.wav` | 3.76s | 3.43s | 7.93s | 11.36s |
| `04-sync.wav` | 4.32s | 3.92s | 11.54s | 15.46s |
| `05-payoff.wav` | 4.48s | 4.05s | 15.64s | 19.69s |

Jumla ghafi **20.72s**, lead 0.15s, mapengo 4 × 0.18s. Video ya msingi ilikuwa 16s; beat 5 zimenyoshwa kwa `t16 = t × 16 / seconds` → `0–2.77 / 2.77–7.55 / 7.55–12.84 / 12.84–17.12 / 17.12–20.14`.

## 3. Amri zilizoendesha leo

```bash
/tmp/kvenv/bin/python content-kit/code-video/promptgen.py --all       # 32 prompts
/tmp/kvenv/bin/python skills/ig-reel/hookscore.py content-kit/qa/codevideo-v2-hooks.txt
/tmp/kvenv/bin/python skills/ig-reel/beats.py content-kit/code-video/audio/script-sw.txt --target 20
/tmp/kvenv/bin/python content-kit/code-video/render_video.py --fps 24 --crf 32
/tmp/kvenv/bin/python content-kit/code-video/render_reel_v2.py --fps 24 --crf 28
python3 content-kit/studio/build_data.py
python3 content-kit/check.py
node --check /tmp/studio-v2.js
```

| Chombo | Matokeo |
| --- | --- |
| `hookscore.py` | `81.8 STRONG / 76.4 STRONG / 56.0 OK` → [`../qa/codevideo-v2-hookscore.out`](../qa/codevideo-v2-hookscore.out) |
| `beats.py` | maneno 32 · ~11.6s @165wpm · **loop imegunduliwa** · 8.4s chini ya target → [`../qa/codevideo-v2-beats.out`](../qa/codevideo-v2-beats.out) |
| `promptgen.py --all` | `wrote 32 prompts` (guards/bei/tagline za v1.2 zimeingia) |
| `check.py` | **`47 pass · 0 warn · 0 fail · 6 decks · READY`** |
| `node --check` | JS ya studio OK (toggle v1/v2 imeongezwa) |
| ffmpeg probe | `Duration 00:00:20.13` + streams 2 (video + audio) |

## 4. Gate ya 12 (iliyokaguliwa kwenye frame 5 + contact sheet)

| # | Kipengele | Hali | Maelezo |
| --- | --- | --- | --- |
| 1 | Frame 1 ina kitu halisi, si salamu/logo sting | ⚠️ | Hakuna salamu, kuna `MTANDAO UMEKATIKA` + `WI-FI OFF` + coords halisi. **Lakini** picha ya duka ni *AI texture*, si picha halisi ya duka lako. Ikiwa unataka ukweli kamili, badilisha `01-duka.png` na picha/screen recording yako. |
| 2 | Mabadiliko ya kweli ndani ya ≤2.5s | ✅ | Kila shot ina reveal/typing/slide (mistari ya code huingia kila ~0.76s baada ya kunyoosha); cuts 5. |
| 3 | Namba moja kubwa, yenye chanzo | ⚠️ | `TZS 15,000` na `RISITI 0342` ni **namba za DEMO** (sasa terminal pia imeandikwa `(DEMO)`). Si bei wala matokeo ya mteja; hazina chanzo. Zimesalia kwa sababu ni UI ya demo, na caption haidai chochote. |
| 4 | Navy/paper + accent MOJA, hakuna gradient/glossy blob | ✅ | Tokens kutoka `scenes.json → brand`; plates zimetiwa giza kwa navy kabla ya maandishi. |
| 5 | Code inasomeka, imetoka kwenye render | ✅ | Mistari 4 ya `faida.checkout({...})` imechorwa na Pillow kwa JetBrains Mono; hakuna modeli iliyoombwa kuandika code. |
| 6 | Kiswahili mstari wa kwanza, English mstari wa kiufundi | ✅ | Hook/captions Kiswahili; `REAL CODE`, `SYNCED`, `lang: "sw"`, `M-PESA` ni kiufundi/search. |
| 7 | Captions zimeburniwa | ✅ | Kila shot ina caption ndani ya safe zone ya kushoto (≤720px). |
| 8 | Ask MOJA, keyword inatamkwa na inaweza kuandikwa | ✅ | Kadi `COMMENT POS` kwenye payoff; CTA haijasemwa kwenye mstari wa mwisho wa sauti. |
| 9 | Hakuna URL / emoji bullets / hashtag wall kwenye caption | ✅ | Domain `altra.tanzaniareach.com` ipo kwenye **credit ya code**, si caption wala link inayobofya. |
| 10 | Hakuna kitu kutoka `common_negative` | ✅ | Prompt 32 zote zina negative list; frame hazina globe/binary rain/sparkle/robot. |
| 11 | Hakuna muziki chini ya sekunde 2 za kwanza | ✅ | Hakuna muziki **kabisa**, wala UI click/room tone. Hii ni TTS pekee. |
| 12 | Imeangaliwa kwenye SIMU, 1080×1920, sauti imezimwa | ⏳ | Tumeangalia frame 5 kwenye desktop + contact sheet. **Angalia wewe kwenye simu** kabla ya kupost; hii haijaigusa Instagram. |

## 5. Mambo yaliyokaguliwa ya ukweli (v1.2)

- Tagline ya frame ya mwisho sasa **`BUILT IN TANZANIA, FOR HOW TANZANIA REALLY WORKS.`** (zamani ilikuwa `ROOTED AT HOME · ENGINEERED FOR THE WORLD`).
- `scenes.json → numbers`: **mifumo kuanzia 1.2M**, **Care Plan 99k/mwezi = huduma tofauti, si SaaS**.
- `guard` inakataza **`"100%"`**, inasema **`offline-first, cloud-synced`**, inabana tagline na bei za kuanzia.
- Hakuna `0.8s`, `10x`, `99.98%`, `Neema`, wala domain iliyobuniwa.

## 6. Mapungufu yaliyoachwa wazi (usiyafiche)

- Sauti ni **TTS**, si rekodi ya mtu; `atempo=1.10` ni tempo, si pitch. Hakuna muziki/SFX.
- Picha 3 ni texture ya AI; si ushahidi wa duka/risiti/mteja yeyote.
- `beats.py` ilikadiria 11.6s lakini TTS ilichukua 20.72s → video 20.14s. Hii ni tofauti ya kasi ya kusoma, si hitilafu ya script.
- Alama za Kiswahili za `hookscore.py` ni **tafsiri za heuristic**, hazijathibitishwa upya; si utabiri wa views.
- **Hakuna kilichopostwa**, hakuna DM/auto-DM, hakuna credential, akaunti ya IG haijaguswa.
