# Content kit: `@mwijay__davie` × `@altrawaretechnology`

**Imetengenezwa:** 17 Novemba 2026 · **Lugha:** Kiswahili / English · **Hali:** tayari kutumika, hakuna kilichoposted.

Soma ukurasa huu kwanza. Mengine yote ni vitu vya kuchukua na kutumia.

---

## 1. Nilichokuta, kwa kifupi

**Repo hii** ni pakiti ya skills 13 za kuandika Instagram (`/ig-reel`, `/ig-carousel`, `/ig-human`, `/ig-caption`, n.k.; sasa ni **14** baada ya `ig-codevideo`). Ni injini nzuri, lakini ilikuja **bila sauti yako wala ukweli wako**: `templates/voice.md` ni template tupu, na kila skill inasoma `~/.claude/instagram/voice.md`. Ikiwa faili hiyo haipo, kila script inatoka kwa sauti ya "default AI". Hapo ndipo "outputs mbaya za kawaida" zinaanzia, hata kabla hujafika kwenye video.

Mbili kati ya zana zake pia zilikuwa za Kiingereza tu: `hookscore.py` ilipa hook yako ya Kiswahili **39.2 WEAK** kwa sababu haikutambua `bado`, `bila`, `hayasimami`; `detect.py` ilipa caption safi VOICE 30 kwa kukosa `you/your`. Zimerekebishwa kwa tafsiri za Kiswahili (si kwa kuinua alama kwa ulaghai), na maelezo ya uaminifu yako kwenye [`qa/README.md`](qa/README.md).

**GitHub yako** ([github.com/mwijay12](https://github.com/mwijay12)) si tupu hata kidogo: repo 42 za public, followers 205, bio "Co-Founder @ Altraware Technologies | Systems Architect & Software Engineer". Kuna mifumo halisi yenye majina, lugha, na live URLs: Faida POS, Shule Altra, loanapp (LIMS), TabTune Studio, RoadSafety_Dar, hype-alarm, motion-lab, video-factory. Hii ndiyo **proof** ambayo content yako inakosa.

**Instagram yako** ndiyo pengo kubwa:

| Akaunti | followers | Bio ya sasa | Link | Post za hivi karibuni |
| --- | --- | --- | --- | --- |
| `@mwijay__davie` | 48 | "David Mwijage / Co founder of Altraware Technology" | mwijay-studio.vercel.app | haionekani hadharani |
| `@altrawaretechnology` | 5 | "Software Developer / Wholesale and Retail sale of Motorcycle @pikipikialtraware" | tanzaniareach.com | 1 post, 26 Okt 2026, likes 2, comments 0 |

Ya pili inaelezea **biashara ya pikipiki** na inapeleka watu kwenye **Tanzania Reach**, si kwenye studio. Mgeni anayetoka kwenye Reel nzuri hajui anachopaswa kufanya. Kwa mujibu wa `/ig-profile` na `/ig-audit`: hii si tatizo la hook, ni **tatizo la profile**. Reel ikipata views bila follows, profile ndiyo imeshindwa.

**Kwa nini prompt zako za "code to video" zinatoa vitu vya kawaida:**

1. Prompt inaelezea *mada* ("make a video about my POS app") badala ya *kitu halisi* (jina la repo, mstari wa code, screen, namba).
2. Hakuna **brand system** iliyoandikwa: rangi, fonti, mwendo, motifu, na orodha ya mambo yaliyokatazwa. Modeli inajaza pengo kwa cliché za tech.
3. Modeli inaombwa **kuchora code**. Haiwezi. Code inayosomeka lazima itoke kwenye render halisi (HTML/Remotion/Pillow/ffmpeg), si kwenye fikira ya modeli.
4. Hakuna shot list yenye sekunde, hakuna safe zone ya 9:16, hakuna negative prompt, hakuna QA gate.

---

## 2. Kilicho ndani ya kit hiki

| Faili | Kazi |
| --- | --- |
| [`01-presence-audit.md`](01-presence-audit.md) | Ukweli wote niliothibitisha online, migongano kati ya vyanzo vyako, na **rewrite ya bio zote mbili** |
| [`02-brand-system.md`](02-brand-system.md) | Rangi halisi (`#071022`, `#eab308`, `#7c3aed`), fonti (Fraunces / Inter / JetBrains Mono), mwendo (0.3 / 0.6 / 1.1s), motifu, na orodha ya clichés zilizokatazwa |
| [`03-voice-mwijay.md`](03-voice-mwijay.md) | `voice.md` iliyojazwa kwa akaunti ya kibinafsi |
| [`04-voice-altraware.md`](04-voice-altraware.md) | `voice.md` iliyojazwa kwa akaunti ya studio |
| [`05-content-system.md`](05-content-system.md) | Nguzo 4, hadhira, **proof bank** iliyogawanywa "verified / self-claimed / NEEDS_INPUT", maneno yaliyokatazwa, ramani ya CTA na keyword |
| [`06-30-day-plan.md`](06-30-day-plan.md) | Wiki 4 za post zenye angle halisi, hook formula id, format, stories na keywords |
| [`carousels/`](carousels/README.md) | Carousel 6 zilizoandikwa tayari, na **PNG 1080×1350 za kupakia** |
| [`code-video/`](code-video/README.md) | Mfumo wa prompt wa tabaka 7, `promptgen.py`, scene 8 halisi, na MP4 iliyotengenezwa kwa code |
| [`qa/`](qa/README.md) | **Receipts halisi**: zana 5 za repo zimeendeshwa kwenye content hii, pamoja na before/after ya draft mbaya |
| [`studio/index.html`](studio/index.html) | Live preview: carousel zote 48, MP4, prompt 32, brand tokens na QA kwenye ukurasa mmoja |
| [`check.py`](check.py) | Linter ya stdlib: maneno ya slop, idadi ya hashtag, cover, urefu wa slide, bio, madai yasiyothibitishwa → `29 pass · 0 fail · READY` |
| [`use-voice.sh`](use-voice.sh) | Installer ya `~/.claude/instagram/voice.md` (inahifadhi ya awali kama `voice.previous.md`) |
| [`skills/ig-codevideo/SKILL.md`](../skills/ig-codevideo/SKILL.md) | Skill ya 14: kugeuza repo/code kuwa Reel prompt isiyo ya kawaida |

---

## 3. Anza hapa (leo, kwa dakika 20)

```bash
# 1. Weka sauti kwenye injini (skills zote zinasoma faili hii)
./content-kit/use-voice.sh mwijay        # au: altraware
#    ina-copy voice sahihi kwenda ~/.claude/instagram/voice.md

# 2. Badilisha bio za IG kwa copy-paste kutoka 01-presence-audit.md §4
#    (name field, bio, link, pinned 3, highlights)

# 3. Pakia carousel ya kwanza
ls content-kit/carousels/build/01-offline-first/     # PNG 8, tayari

# 4. Tengeneza prompt ya video isiyo ya kawaida
python3 content-kit/code-video/promptgen.py --list
python3 content-kit/code-video/promptgen.py --scene faida-offline --lang sw

# 5. Kagua kila kitu kabla ya kupost
python3 content-kit/check.py        # 29 pass · 0 fail · READY

# 6. Fungua live preview (server tayari inaendesha kwenye port 8000)
#    https://8000-<sandbox>.e2b.app/studio/index.html
#    Au locally: cd content-kit && python3 -m http.server 8000
```

Mpangilio ni muhimu: **profile → voice → post → log → audit**. Ukiruka profile, Reel nzuri inapoteza follows. Ukiruka `voice.md`, kila kitu kinasikika kama kilichoandikwa na mashine.

**Studio** inafanya kazi pia ukiifungua `index.html` moja kwa moja kutoka kwenye diski: `studio/data.js` ime-inline deck zote 6, scene 8 na prompt 32, kwa hiyo hakuna `fetch` wala server inayohitajika kwa ajili ya maandishi. MP4 na PNG zinahitaji relative paths, ndiyo maana server ndio njia bora. Ukibadilisha deck/scene/prompt yoyote, endesha `python3 content-kit/studio/build_data.py`.

---

## 4. Sheria tatu zisizovunjika

1. **Hakuna namba ya kubuni.** Kila namba kwenye kit hiki ina chanzo. Isiyo na chanzo imeandikwa `NEEDS_INPUT`. Vile vile hakuna majina ya wateja, asilimia za matokeo, wala "tumewasaidia biashara 200+".
2. **Matoleo mawili, si tafsiri.** Kiswahili kwa hisia na mifano ya DSM/Kariakoo/M-Pesa; English kwa technical depth. Ukitafsiri tu, zote mbili zinakuwa mbaya.
3. **Hakuna kinachopostwa na kit hiki.** Unapata copy-ready blocks na PNG/MP4. Unapost wewe mwenyewe. Kwa auto-DM: wao wanaanza, wewe unajibu.

---

## 5. Bado nahitaji kutoka kwako

| Kitu | Kwa nini |
| --- | --- |
| Screenshots 3 za Reel/caption zako za zamani | Kurekebisha `voice.md` iwe sauti yako hasa, si ile niliyokisia kutoka `strategies/docs/05-content-engine.md` |
| Insights za post 10–30 (views, reach, sends, hold@3s) | `/ig-audit` na `/ig-viral` zinahitaji **evidence yako**, si defaults za repo |
| Uamuzi juu ya migongano kwenye `01-presence-audit.md` §5 | Hasa: Faida POS ni custom build ya TSh 1.2M au SaaS ya TZS 35k/mwezi? `cloud-first` au `offline-first`? |
| Ruhusa ya kutumia namba kama "0.8s checkout", "99.98% uptime" | Ziko kwenye tovuti zako lakini sijazithibitisha, kwa hiyo **hazijatumika** kama proof kwenye content |
| Akaunti 10 za kuingiliana nazo (kutoka Saved collection yako) | `/ig-plan` inahitaji orodha halisi, si majina niliyoyabuni |
