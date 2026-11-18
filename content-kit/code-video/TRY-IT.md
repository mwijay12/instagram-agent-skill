# /ig-codevideo — tuitumie vipi? (jaribio halisi, 18 Nov 2026)

> Uliuliza: *"hebu tujaribu making video content, can u try code to video kabisaa???!! na tuangalie hii skill tunaitumia vipi?"*
> Jibu: **ndio, imefanyika.** Chini ni njia halisi tuliyopitia, si nadharia. Output iko kwenye `samples/02-faida-offline-tts.mp4`.

---

## 1. Wazo moja tu la kushika (ndio maana skill ipo)

**AI video model haiwezi kuchora code.** Ukiiomba, inakupa maandishi *yanayofanana* na code. Kwa hiyo:

| Nani | Anachora nini |
| --- | --- |
| **Code** (Pillow + ffmpeg) | herufi zote, mistari ya code, namba, risiti, captions, muda wa kila shoti |
| **Picha za AI** (`plates/`) | texture tu: duka jioni, contour, karatasi ya risiti. **Hakuna maandishi, hakuna code, hakuna namba** |
| **TTS** (`audio/`) | sauti ya Kiswahili, sauti **moja** kwa clip zote 5 |
| **Wewe** | unacheza, una-edit, unapost. Hii haiposti chochote |

Ukibadilisha meza hii, unarudi kwenye "laptop + globe + purple gradient". Ndiyo diagnosis ya kwanza kabisa.

---

## 2. Amri tulizoendesha leo (copy-paste)

```bash
# 0. Mazingira (mara moja tu)
python3 -m venv /tmp/kvenv
/tmp/kvenv/bin/pip install Pillow imageio-ffmpeg   # huleta ffmpeg bila system install

# 1. Soma scene halisi, usibuni artifact
/tmp/kvenv/bin/python content-kit/code-video/promptgen.py --list
/tmp/kvenv/bin/python content-kit/code-video/promptgen.py --scene faida-offline --lang sw

# 2. Tengeneza prompt zote 32 (scene 8 × engine/lugha)
/tmp/kvenv/bin/python content-kit/code-video/promptgen.py --all

# 3. Pima hook (3 chaguo), kisha pima muda wa script
/tmp/kvenv/bin/python skills/ig-reel/hookscore.py content-kit/qa/codevideo-v2-hooks.txt
/tmp/kvenv/bin/python skills/ig-reel/beats.py content-kit/code-video/audio/script-sw.txt --target 20

# 4. Picha 3 za texture  ->  plates/*.png   (zana ya generate_image)
# 5. Sauti 5 za Kiswahili ->  audio/*.wav   (add_voice -> generate_speech, voice_id mmoja)

# 6. RENDER KABISAA: picha + TTS + code -> MP4 yenye sauti
/tmp/kvenv/bin/python content-kit/code-video/render_reel_v2.py

# 7. Usisahau lango la QA
python3 content-kit/check.py
```

**Smoke test bila kusubiri:** ongeza `--fps 20`, au `--no-voice`, au `--no-plates`.
**Frame moja tu:** `python3 content-kit/code-video/render_video.py --still 8.0 --out /tmp/frame.png`.

---

## 3. Skill ina tabaka 7; kila moja iko wapi leo

| # | Tabaka | Leo |
| --- | --- | --- |
| 1 | **Artifact** | `mwijay12/faida-pos-releases` + snippet halisi kutoka `altra.tanzaniareach.com` (kwenye `scenes.json`) |
| 2 | **Claim** | "Faida POS inarekodi mauzo, inatoa risiti, inasasisha stoo hata bila internet, kisha inasync muunganisho ukirudi." Hakuna kivumishi, hakuna `%` ya kubuni |
| 3 | **Shot list** | beats 5 zenye sekunde; `render_reel_v2.py` inazinyoosha kutoka 16s → muda wa voiceover |
| 4 | **Brand tokens** | navy `#071022`, paper `#f7f6f2`, gold `#eab308`, violet `#7c3aed`, Fraunces / Inter / JetBrains Mono, `0.3 / 0.6 / 1.1s` |
| 5 | **Motion** | hard cut, reveal, risiti inapanda, `SYNCED` inapop 0.3s. Frame inabadilika ≤ 2.5s |
| 6 | **Negative** | `common_negative` (vitu 30+) kwenye kila prompt iliyotengenezwa na `promptgen.py` |
| 7 | **QA gate** | orodha ya 12 kwenye [`QA-v2.md`](QA-v2.md) + `check.py` |

---

## 4. Jinsi ya kutumia kwenye scene **mpya** (si ya lebo tu)

1. Fungua `scenes.json`, nakili kitu kimoja cha scene, jaza `artifact` (repo/URL/screen/namba **yenye chanzo**), `claim_sw`, `beats[]`, `guard`.
2. Kama hakuna chanzo halisi → **simama**. Uliza swali moja: *kitu gani, kiko wapi, na ni dai gani moja la kweli linaunga mkono?* Prompt isiyo na artifact ndio tatizo linalepuka.
3. `promptgen.py --all` kujenga prompts; `hookscore.py` kupima hook; `beats.py --target 20` kupima muda.
4. Chagua engine **moja**: `ai-video` (texture), `editor` (screen recording halisi), au `remotion`/`render_reel_v2.py` (kila kitu kwa code). **Usizichanganye.**
5. Kwa AI path, kwenye handoff andika: *"Composite all code, numbers and captions afterwards as real text. The model supplies the plates."*
6. Burn-in captions (watu wanaanza muted), CTA kwenye kadi si kwenye mstari wa mwisho wa sauti, mstari wa mwisho urudie neno la hook.
7. `check.py` → kisha wewe una-edit na kupost. Kamwe usiseme "nimekupa Reel kamili" kama hakuna sauti/muziki.

---

## 5. Maamuzi ya mmiliki yaliyoheshimiwa (v1.2)

`09-decisions.md` ndio source of truth. Leo tume:

- Badilisha tagline ya zamani kwenye frame ya mwisho → **`Built in Tanzania, for how Tanzania really works.`**
- Badilisha `numbers[]`: **mifumo kuanzia 1.2M**, **Care Plan 99k/mwezi ni huduma tofauti, si SaaS** (si "custom build 1.2M / 99k support").
- `guard` sasa inakataza **`"100%"`**, inasema **`offline-first, cloud-synced`**, na inabana tagline + bei za kuanzia.
- Hakuna `"0.8s"`, `"10x"`, `"99.98%"`, `"Neema"`, wala domain iliyobuniwa.

---

## 6. Mapungufu (usiyafiche)

- Sauti ni **TTS ya Kiswahili kutoka zana ya nje**, si rekodi ya mtu; **hakuna muziki wala SFX**. `scenes.json → audio` bado inaeleza click/room tone kama *spec ya editor*, haijatekelezwa kwenye MP4 hii.
- Picha 3 ni **AI-generated texture**. Hazina maandishi, lakini si ushahidi wa duka/risiti yoyote halisi.
- `atempo=1.10` inatumiwa kufaa muda wa ~20s; ni tempo, si pitch. Ukibadilisha clips, muda wa video unajirekebisha (`--seconds 0` = fit to voice).
- Matokeo ya `hookscore.py` kwa Kiswahili ni **tafsiri za heuristic, si ishara zilizothibitishwa**; si utabiri wa views.
- MP4 haijapostwa, hakuna DM, hakuna auto-DM, hakuna credential, akaunti ya Instagram haijaguswa.
- `use-voice.sh` bado haija-executiwa: `~/.claude/instagram/voice.md` ni kazi ya local install.

---

## 7. Vya kuangalia mara moja

| Faili | Maana |
| --- | --- |
| `samples/02-faida-offline-tts.mp4` | **Reel yenye sauti** (1080×1920, H.264 + AAC) |
| `samples/02-contact-sheet.jpg` | frame 5 kwa mtazamo mmoja |
| `samples/02-render-manifest.json` | clip start/end, beat map, plates, guards |
| `audio/voiceover.wav` | track ya sauti pekee (unaweza kuibadilisha kwenye editor) |
| `plates/*.png` | texture 3 |
| `QA-v2.md` | receipts za pasi ya v2 |

---

## 8. FINAL (leo, baada ya maoni ya mmiliki) ⭐

```bash
/tmp/kvenv/bin/python content-kit/code-video/render_reel_final.py
```

Inachukua v2 yote (20.14s) na kuongeza **end card**: **logo halisi** ulichotuma (`final_poster_1.png`), **credits za Altraware**, positioning **"Faida POS ni app na system"**, na CTA moja **`comment neno POS`**. TTS ina clip ya 6, sauti ile ile, **bado hakuna muziki** (utaongeza wewe kwenye editor).

| Faili | Maana |
| --- | --- |
| `samples/03-faida-offline-FINAL.mp4` | **Ya kushiriki** · 28.6s · H.264 + AAC |
| `audio/voiceover-final.wav` | sauti safi ya kuwekea muziki wako |
| `samples/03-contact-sheet.jpg` | frame 6 |
| `samples/03-drive-links.md` | link za Drive (public) |
| `samples/03-render-manifest.json` | ramani ya clip 6 + guards |
| `QA-final.md` | gate ya 12 + mambo yaliyoachwa wazi |
| `assets/altraware-logo.png` | logo yako, haijachorwa upya |

**Kanuni ya CTA:** neno moja `POS` linakusaidia kuchuja zile *many chats* **kwa mkono**. Sijaweka auto-DM wala bot — uamuzi huo ni wako, na unakuja baada ya ku-rekebisha FAQ ya bot (angalia `QA-final.md` §5).
