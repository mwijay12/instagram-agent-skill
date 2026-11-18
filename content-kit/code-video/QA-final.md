# QA — FINAL cut (18 Nov 2026)

Hii ndiyo version ya **kushiriki**: `samples/03-faida-offline-FINAL.mp4`. Inaanza na pasi ya v2 (5 beats + plate 3 + TTS 5), kisha **end card** yenye logo halisi, credits na CTA moja. Chanzo: [`samples/03-render-manifest.json`](samples/03-render-manifest.json) na [`samples/03-drive-links.md`](samples/03-drive-links.md).

## 1. Vipimo

| Kitu | Thamani |
| --- | --- |
| MP4 | **28.63s** (manifest 28.65s) · **3.6 MB** · 1080×1920 · 24 fps |
| Video | H.264 High / yuv420p · ~921 kb/s |
| Sauti | AAC-LC · 48 kHz · mono · ~122 kb/s · **TTS pekee, hakuna muziki wala SFX** |
| Voiceover | `audio/voiceover-final.wav` · 28.65s · clip **6** · sauti moja ya Kiswahili |
| Picha | plate 3 za AI (texture) + **logo halisi** la mmiliki (RGBA 256×256) |
| Contact sheet | `samples/03-contact-sheet.jpg` · frame 6 |
| Lint | `47 pass · 0 warn · 0 fail · 6 decks · READY` |

## 2. Ramani ya sauti

| Clip | Start | End | Juu ya shoti |
| --- | --- | --- | --- |
| `01-hook.wav` | 0.15s | 3.87s | hook / Wi-Fi off |
| `02-risiti.wav` | 4.05s | 7.75s | terminal |
| `03-code.wav` | 7.93s | 11.36s | code |
| `04-sync.wav` | 11.54s | 15.46s | risiti / SYNCED |
| `05-payoff.wav` | 15.64s | 19.69s | payoff |
| `06-cta.wav` | **20.34s** | **28.20s** | **end card / credits + CTA** |

Beat 1–5 zimebaki vile vile hadi **20.14s**; end card inaanzia hapo. `atempo=1.10`, lead 0.15s, mapengo 0.18s.

## 3. End card (kilichoombiwa na mmiliki)

| Ombi | Kilichowekwa |
| --- | --- |
| **"logo yetu iwe mwishoni"** | `assets/altraware-logo.png` kutoka `final_poster_1.png` iliyoambatanishwa, **haijachorwa upya na AI**, ina-reveal 0.6s kwenye navy frame |
| **"video iwe na credits for altraware"** | `ALTRAWARE TECHNOLOGY` · `Tunatengeneza app na mifumo ya biashara` · `Faida POS · APP + MFUMO / SYSTEM` · `@altrawaretechnology · altra.tanzaniareach.com` · `Built in Tanzania, for how Tanzania really works.` (zinaingia moja baada ya nyingine, 0.3s) |
| **"Faida POS ni app na system"** | Imeingia kwenye `claim_sw`, `claim_en`, `artifact.what_sw/en`, prompts 32, TTS clip 06 na credits. Si "app tu" tena. |
| **"kama unahitaji app hii uone leo comment neno POS"** | Kadi `UNAHITAJI KUIONA LEO? COMMENT NENO POS` + caption iliyoburniwa `Kama unahitaji app hii leo, comment neno POS.` + TTS inayosema hivyo. |
| **"tuna many chats, utilize well"** | Neno **moja** `POS` la kuchuja comments/chats **kwa mkono**. **Hakuna auto-DM, hakuna bot, hakuna ManyChat iliyowekwa** — hiyo ni kazi ya mmiliki baadaye, kwa maamuzi yake. |
| **"TTS nzuri kama hii, mimi nitaongeza muziki"** | Sauti ile ile `voice-00`, clip 6, WAV safi imewekwa Drive tofauti. Hakuna muziki wala SFX kwenye MP4 yetu. |

## 4. Gate ya 12

| # | Kipengele | Hali | Maelezo |
| --- | --- | --- | --- |
| 1 | Frame 1 si salamu / logo sting | ✅ | Hook `MTANDAO UMEKATIKA` mara moja; **logo iko mwishoni**, si mwanzoni (kama ulivyotaka). |
| 2 | Mabadiliko ≤ 2.5s | ✅ | Typing, reveal, receipt slide, CTA pop, na contour za end card zinasogea kila frame. |
| 3 | Namba kubwa yenye chanzo | ⚠️ | `TZS 15,000` / `RISITI 0342` ni **DEMO** (terminal sasa imeandikwa `(DEMO)`). Hazijadaiwa kuwa mauzo halisi. |
| 4 | Navy/paper + accent MOJA | ✅ | Tokens halisi; plates zimetiwa navy, logo ya violet inakaa kwenye navy frame. |
| 5 | Code inasomeka, si ya modeli | ✅ | Pillow + JetBrains Mono. |
| 6 | Kiswahili mbele, English kiufundi | ✅ | `APP + MFUMO / SYSTEM`, `SYNCED`, `lang: "sw"`. |
| 7 | Captions zimeburniwa | ✅ | Kila shoti, ikiwemo end card. |
| 8 | Ask MOJA, keyword inasemeka | ✅ | `POS` tu. Hakuna "link in bio", hakuna ask ya pili. |
| 9 | Hakuna URL/emoji/hashtag wall kwenye caption | ✅ | Domain iko kwenye **credits**, si caption ya post. |
| 10 | Hakuna `common_negative` | ✅ | Prompt 32 zina negative list; hakuna globe/binary rain/sparkle. |
| 11 | Hakuna muziki chini ya 2s za kwanza | ✅ | Hakuna muziki **kabisa**; mmiliki ataongeza. |
| 12 | Imeangaliwa kwenye SIMU | ⏳ | Frame 6 zimekaguliwa kwenye desktop + contact sheet. Angalia wewe kwenye simu kabla ya post. |

## 5. Usafi wa madai (v1.2)

- Hakuna **`"100%"`** popote kwenye video, captions, credits wala manifest. Umiliki ni **kwa leseni**: *"Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni."*
- `offline-first, cloud-synced`; hakuna kukanusha cloud.
- Bei ni **za kuanzia**; Care Plan 99k/mwezi ni huduma tofauti, si SaaS.
- Tagline `Built in Tanzania, for how Tanzania really works.`; link `altra.tanzaniareach.com` bila `"official website"` wala domain ya kubuni.
- Hakuna `0.8s`, `10x`, `99.98%`, `Neema`, wala ushuhuda wa kubuni.

> ⚠️ **Nje ya repo:** knowledge files mbili za bot zilizoambatanishwa leo bado zina `"umiliki wa 100% wa code"`, `"100% code & IP ownership"` na `"100% offline-first"`. **Video hii haina hayo**, lakini bot ikijibu bado itakwenda kinyume na uamuzi wako wa leseni. Mmiliki aliahidi kurekebisha FAQ kwenye faili zote mbili; hadi hapo, usiitumie bot kujibu maswali ya umiliki.

## 6. Drive (public, anyoneWithLink reader)

| Faili | ID |
| --- | --- |
| MP4 | `1UG1-Vn0niV833ZNH_IcSrxCj0WeVNkPe` |
| WAV safi | `18Au32g2vi0mhRki0E1LsWXHgDd01lOB_` |
| Contact sheet | `1ZljgN1RkTXPVHniW3OfKwX8EeRJmQ-C4` |

**Hakuna post, DM, auto-DM, credential, wala mabadiliko kwenye akaunti ya Instagram.**
