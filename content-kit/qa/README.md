# QA receipts — zana tano za repo zimeendeshwa kweli

Sio maelezo ya jinsi zana zinavyofanya kazi. Haya ni **matokeo halisi** ya kuziendesha kwenye content ya kit hiki, 17 Nov 2026. Faili za `.out` ndizo stdout kamili.

| Input | Zana | Matokeo |
| --- | --- | --- |
| [`hooks.txt`](hooks.txt) | `skills/ig-reel/hookscore.py` | [`hookscore.out`](hookscore.out) — 81.8 STRONG / 76.4 STRONG / 56.0 OK |
| [`script.txt`](script.txt) | `skills/ig-reel/beats.py --target 20` | [`beats.out`](beats.out) — 18.6s, loop imegunduliwa, **hakuna flag** |
| [`caption.txt`](caption.txt) | `skills/ig-caption/caption.py --keywords "mfumo wa mauzo dukani,POS Tanzania"` | [`caption.out`](caption.out) — **VERDICT READY**, 9 PASS / 0 FAIL |
| [`caption.txt`](caption.txt) | `skills/ig-human/detect.py` | [`detect-clean.out`](detect-clean.out) — 62.9 REVIEW (angalia dokezo hapa chini) |
| [`sloppy-draft.txt`](sloppy-draft.txt) | `skills/ig-human/detect.py` | [`detect-sloppy.out`](detect-sloppy.out) — 24.8 FLAGGED |
| [`sloppy-draft.txt`](sloppy-draft.txt) | `skills/ig-human/humanize.py --report` | [`humanize.out`](humanize.out) — vifaa 10 vimeondolewa, miundo 3 imebaki kwa rewrite |
| before / after | `skills/ig-human/detect.py before.txt humanized.txt` | [`detect-delta.out`](detect-delta.out) — 24.8 → 38.4, bado FLAGGED |
| Kit kizima | `content-kit/check.py` | `47 pass · 0 warn · 0 fail · 6 decks · READY` |

Kuzalisha upya:

```bash
cd content-kit/qa
python3 ../../skills/ig-reel/hookscore.py hooks.txt
python3 ../../skills/ig-reel/beats.py script.txt --target 20
python3 ../../skills/ig-caption/caption.py caption.txt \
  --keywords "mfumo wa mauzo dukani,POS Tanzania"
python3 ../../skills/ig-human/detect.py caption.txt
python3 ../../skills/ig-human/humanize.py sloppy-draft.txt --report
cd ../.. && python3 content-kit/check.py
```

---

## Kilichopatikana (na kilichobadilishwa kwenye repo)

### 1. `hookscore.py` ilikuwa inaadhibu Kiswahili

Kabla ya kurekebisha, hook yetu ya Kiswahili `Nazima Wi-Fi kwenye duka. Mauzo hayasimami.` ilipata **39.2 WEAK** kwa sababu `STAKES` ilikuwa na maneno ya Kiingereza tu (`lost`, `cost`, `never`...). Hata `Repo 42...` ilipata 46.2. Hii si "hook mbaya"; ni **scorer ya lugha moja**.

Nimeongeza kwenye [`skills/ig-reel/hookscore.py`](../../skills/ig-reel/hookscore.py):

- `STAKES`, `SPOKEN_NUMBERS`, `MONEY_WORDS`, `WEAK_OPENERS`, `IMPERATIVES`: tafsiri za moja kwa moja za Kiswahili (`bado`, `bila`, `lakini`, `poteza`, `shilingi`, `habari`, `acha`...).
- `SW_TENSION_RE`: regex ya viambishi vya Kiswahili, kwa sababu `unapoteza` na `hayasimami` haviwezi kuorodheshwa neno kwa neno.
- `check_address`: `lako / yako / wewe / wako...` vinatambuliwa kama "speaks to the viewer".

**Baada:** `Duka lako likikosa mtandao dakika 5, unapoteza mauzo mangapi?` → **76.4 STRONG**. Hook ya cold-open → 56.0 OK. Toleo la Kiingereza lililosahihishwa (17 Nov 2026, bila kukanusha cloud): `"Build the queue first. Offline-first, cloud-synced POS for Tanzanian shops."` → **81.8 STRONG** (limepungua kutoka 92.6 kwa sababu tumeondoa "Stop building cloud-first apps"; bado STRONG).

**Regression ya Kiingereza haijabadilika:** `I lost $18,000 because of one missing contract.` bado **81.4 STRONG**; `Nobody tells you that your first 30 reels are supposed to flop` bado **85.6 STRONG** (namba za README ya repo).

> ⚠️ **Uaminifu:** nyongeza hizi ni **tafsiri**, hazijapimwa upya dhidi ya corpus ya hooks 74. AUC 0.83 / 0.56 kwenye README inaelezea scorer ya Kiingereza tu. Tumia alama ya Kiswahili kuua salamu na mistari isiyo na kitu; usitumie 70 dhidi ya 80 kama ushahidi wa views. Retention graph ndiyo hakimu.

### 2. `detect.py` pia ilikuwa ya Kiingereza

Caption safi ya Kiswahili ilipata VOICE **30.0** kwa sababu `PRONOUNS` ilitafuta `you / your / I` tu. Nimeongeza viwakilishi vya Kiswahili kwenye [`skills/ig-human/detect.py`](../../skills/ig-human/detect.py). Sasa ni 31.4 na jumla **62.9 REVIEW**.

Bado si PASS, na **hilo ni sahihi**: Kiswahili hakina apostrophe contractions, wakati `CONTRACTIONS` inahesabu hizo tu (35% ya alama ya VOICE). Badala ya kulaghai alama, nimeandika dokezo kwenye docstring: kwa Kiswahili, hukumu kwa `BURSTINESS`, `SPECIFICITY`, `SLOP DENSITY`, `FINGERPRINT` na "je, mtu atasema mstari huu kwa sauti?". Hizi caption zetu zina 100 / 100 / 100 / 100 kwenye nne hizo.

### 3. `humanize.py` haiwezi kutengeneza ukweli

Draft ya makusudi yenye `hey guys`, em dash, `revolutionize`, `stop scrolling`, hashtag 10, na 🚀🚀🚀 ilipata **24.8 FLAGGED**. Baada ya `humanize.py`: **38.4 FLAGGED** (+13.6). Vifaa 10 vimeondolewa, lakini miundo 3 (`It's not just X, it's Y`, rocket emojis, hashtag wall) inahitaji **rewrite ya mtu**, na `SPECIFICITY` bado 0 kwa sababu draft haina namba wala jina halisi.

Somo kwa workflow yako: **usimpe humanizer kazi ya kutafuta ukweli**. Mpe caption iliyo na artifact halisi tangu mwanzo (kama [`caption.txt`](caption.txt): SPECIFICITY 100).

### 4. `beats.py` ilibaini mambo mawili tuliyoyarekebisha

Toleo la kwanza la script lilikuwa na: (a) beats 3–5 zisizo na kitu kinachoonekana, (b) hakuna loop, (c) 9.6s chini ya target. Tumeongeza `Risiti 0342` (namba ya demo), `M-Pesa` na `Faida POS` kwenye beats, tumeacha CTA kama kadi ya on-screen (si mstari wa mwisho wa sauti), na tumeweka target 20s. Sasa: **hakuna flag, loop imegunduliwa, 18.6s / 20s**.

---

## Kuhusu namba kwenye script

`Risiti 0342` na `TZS 15,000` ni **namba za demo** kutoka kwenye UI ya FaidaHQ / risiti yetu iliyoandikwa `DEMO`. Si mauzo halisi ya mteja. `dakika 5` kwenye hook ni swali la kufikiria, si kipimo. Hakuna hata moja kati ya hizi iliyoingia kwenye caption ya post kama matokeo ya mteja.

---

## Mstari wa mwisho

Zana hizi **hazitabiri views**. README ya repo inasema wazi: AUC 0.56 kwenye kutofautisha hit na miss za creator yule yule. Kazi yao hapa ni kuua mambo yanayojulikana kuua Reel: salamu, preamble, ukosefu wa namba, frame isiyobadilika, caption iliyokatwa katikati ya sentensi, na slop. Mengine yataamuliwa na retention graph yako baada ya post 30.

---

## 18 Nov 2026 · jaribio la `/ig-codevideo` (pasi kamili ya v2)

Tumejaribu "code to video kabisaa": picha 3 za AI kama **texture**, TTS 5 za Kiswahili (sauti moja), na render ya Pillow + ffmpeg. Receipts mpya hazibadilishi zile za juu; ziko kwenye faili zao:

| Faili | Matokeo |
| --- | --- |
| [`codevideo-v2-hookscore.out`](codevideo-v2-hookscore.out) | `81.8 STRONG / 76.4 STRONG / 56.0 OK` (zile zile tatu, zimethibitishwa tena) |
| [`codevideo-v2-beats.out`](codevideo-v2-beats.out) | maneno 32 · ~11.6s @ 165 wpm · loop imegunduliwa · **8.4s chini ya target 20s** |
| `audio/voiceover.wav` | 20.14s · clip 5 · `atempo=1.10` · RMS ~3744 (si kimya) |
| `samples/02-faida-offline-tts.mp4` | **20.13s** · 1080×1920 · 24fps · H.264 + AAC-LC 48kHz mono |
| `content-kit/check.py` | `47 pass · 0 warn · 0 fail · 6 decks · READY` |

⚠️ **Tofauti ya uaminifu:** `beats.py` inakadiria ~11.6s kwa 165 wpm, lakini TTS halisi ilichukua **20.72s** kabla ya `atempo`, hivyo video imenyoshwa hadi **20.14s**. Hii si kosa la script; ni kasi ya sauti iliyochaguliwa. Gate ya 12 iko kwenye [`../code-video/QA-v2.md`](../code-video/QA-v2.md), pamoja na mambo mawili yaliyoachwa wazi (frame 1 ni texture ya AI, `TZS 15,000` ni namba ya DEMO).

### FINAL (baada ya maoni ya mmiliki)

`render_reel_final.py` → **28.63s**, clip **6** ya TTS, **logo halisi** + credits + `comment neno POS`, WAV safi ya kuongezea muziki. Drive: [`../code-video/samples/03-drive-links.md`](../code-video/samples/03-drive-links.md). Gate na usafi wa madai: [`../code-video/QA-final.md`](../code-video/QA-final.md). `check.py` bado `47 pass · 0 fail · READY`.
