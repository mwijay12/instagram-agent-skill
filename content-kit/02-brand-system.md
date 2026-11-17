# 02 · Brand system (prompt-safe)

Hati hii ni **chanzo kimoja cha ukweli wa kuona**. Kila carousel na kila prompt ya video kwenye kit hiki inaisoma. Ilitolewa kutoka [`motion-lab/src/styles/tokens.css`](https://github.com/mwijay12/motion-lab/blob/main/motion-lab/src/styles/tokens.css), [`motion-lab/src/lib/motion.js`](https://github.com/mwijay12/motion-lab/blob/main/motion-lab/src/lib/motion.js), [`altra.tanzaniareach.com`](https://altra.tanzaniareach.com/) na [`altra-motion-lab.vercel.app`](https://altra-motion-lab.vercel.app/). Sio palette niliyoibuni.

---

## 1. Rangi

| Token | Hex | Matumizi |
| --- | --- | --- |
| `--navy-900` | `#071022` | Usiku / background default |
| `--navy-800` | `#0a1735` | Paneli ya kioo |
| `--navy-700` | `#10265c` | Mistari ya contour kwenye paper |
| `--paper` | `#f7f6f2` | Mchana / maandishi kwenye usiku |
| `--violet` | `#7c3aed` | Contour lines kwenye usiku, accent ya mchana |
| `--violet-deep` | `#5b21b6` | Kivuli cha contour |
| `--violet-ink` | `#3b1a8f` | Mstari mzito |
| `--gold` | `#eab308` | **Accent pekee ya usiku**: namba, mstari, CTA |
| `--muted` | `#a3aecb` | Maandishi ya pili |
| `--rule` | `rgba(247,246,242,.18)` | Mistari ya kugawa |
| `--sticker-sun` | `#f4d774` | Doodle backing |
| `--sticker-lilac` | `#dccfff` | Doodle backing |

**Kanuni:** theme moja ina accent **moja**. Usiku = gold. Mchana = violet. Usichanganye gold na violet kama "accents mbili" kwenye frame moja. Hakuna gradient ya zambarau-bluu ya generic tech.

**Mbano mbili tu (rhythm):** usiku / paper. Carousel inabadilisha theme kati ya slide; Reel inabadilisha kati ya beat. Mpito huo wenyewe ni "signature".

---

## 2. Type

| Jukumu | Fonti | Kwenye 1080×1350 | Kwenye 1080×1920 |
| --- | --- | --- | --- |
| Display / headline | **Fraunces** (variable, opsz) | 92–128 px | 110–150 px |
| Display iliyokoza | **Fraunces Italic** | neno 1 tu, si sentensi | neno 1 tu |
| Body / caption | **Inter** | 34–42 px | 40–48 px |
| Code / namba / metadata | **JetBrains Mono** | 24–30 px | 28–34 px |

Fonti ziko ndani ya kit: [`assets/fonts/`](assets/fonts/) (`.woff2` kwa browser, `.ttf` kwa renderer). Asili: repo yako ya `motion-lab`, leseni SIL OFL 1.1 — angalia [`assets/fonts/FONTS.md`](assets/fonts/FONTS.md).

**Sheria za type:**
- Hakuna fonti ndogo kuliko 32px kwenye slide. Inasomwa kwenye simu kwa theluthi ya ukubwa wake.
- Namba kubwa zinakwenda kwa JetBrains Mono, si kwa display serif. `0.8s`, `42`, `350K`, `6.7924° S` ni vitu vya uhandisi, si mapambo.
- Kiswahili na Kiingereza kwenye slide moja: lugha moja kwa headline, nyingine kwa kicker ndogo. Usitafsiri mstari mmoja mara mbili kwenye frame moja.
- Usiandike kwa ALL CAPS zaidi ya maneno 6. Headline ndefu ya CAPS inasomwa kama template ya Canva.

---

## 3. Motifu zilizokwepo (ndizo zinazofanya isiwe "ya kawaida")

| Motifu | Jinsi inavyoonekana | Kwa nini ni yako |
| --- | --- | --- |
| **Coordinates** | `6.7924° S, 39.2083° E` kwa mono, juu kulia, 26px, muted | Iko kwenye motion-lab hero. Inasema "mahali halisi" bila kusema "Tanzania 🇹🇿" mara tano. |
| **Contour field** | Mistari myembamba iliyopinda, violet kwenye navy / navy kwenye paper, opacity 0.12–0.35, ikisogea polepole | WebGL shader halisi kwenye motion-lab. Sio grid ya dots wala mesh ya 3D ya stock. |
| **Act numbering** | `ACT 01 / MIZIZI`, `000`, `01 / 06` kwa mono | Site yako imegawanywa kwa "Act I — Mizizi". Namba inaahidi muundo. |
| **Kioo (glass panel)** | Rounded rect `#0d1a40` @ ~50% juu ya contour, rim nyembamba | Maandishi marefu yanasomeka juu ya texture. |
| **Code halisi** | Dirisha la mono lenye line numbers, syntax rangi 2 tu (gold kwa string, violet kwa keyword) | Wewe ni engineer. Code ni ushahidi, sio picha ya laptop. |
| **Risiti / simu** | Thermal receipt yenye `TZS`, au simu yenye `SYNCED` | Bidhaa zako zinaisha kwenye risiti na M-Pesa, si kwenye dashboard ya kufikirika. |
| **Mstari uliochorwa kwa mkono** | Underline/ring/arrow ya SVG, inajichora yenyewe | Inatokea kwenye motion-lab, inavunja ukali wa grid. |

---

## 4. Mwendo

Kutoka `motion.js`: `DURATION = { fast: 0.3, base: 0.6, slow: 1.1 }`, `EASE = power3.out / power3.inOut`. Kwa CSS: `cubic-bezier(.22,1,.36,1)` (out) na `cubic-bezier(.65,0,.35,1)` (inOut).

| Kitendo | Muda | Easing |
| --- | --- | --- |
| Kuonekana kwa mstari / namba | 0.3s | out |
| Kubadilisha scene / kadi | 0.6s | out |
| Contour drift, curtain, namba kubwa ikicount | 1.1s | inOut |

**Sheria:** sogeza `transform` na `opacity` tu. Usianimishe layout, width, wala rangi ya maandishi. Kila beat ya Reel ina mabadiliko ya frame ndani ya sekunde 2.5 (hii pia ndiyo kanuni ya `video-factory`: cuts za 1.5–2.5s). `prefers-reduced-motion` ikipo, maandishi yako tayari, hayaji kwa kucheza.

**Safe zones:** 1080×1920 → hakuna maandishi muhimu juu ya `y=230` wala chini ya `y=1440`, na acha `230px` za kulia wazi (action rail). 1080×1350 → acha `120px` kila upande kwa ajili ya grid crop. Handle ndogo chini kushoto kwenye kila slide; screenshots zinasafiri bila wewe.

---

## 5. BRAND BLOCK — weka hii kwenye kila prompt

> Nakili kama ilivyo. `promptgen.py` inaiingiza moja kwa moja.

```
BRAND (non-negotiable, from the client's own design tokens):
Vertical 9:16, 1080x1920 for Reels; 1080x1350 for carousels.
Palette: navy #071022 background, paper #f7f6f2 text, gold #eab308
(accent at night, ONE accent only), violet #7c3aed contour lines,
muted #a3aecb metadata, rule rgba(247,246,242,.18). Light sections use
paper #f7f6f2 with navy #10265c lines and violet as the accent.
Type: Fraunces (display serif, italic for exactly one word), Inter (body),
JetBrains Mono (code, numbers, coordinates). No other fonts.
Signature marks: "6.7924° S, 39.2083° E" in mono top-right; thin drifting
contour lines; "ACT 01 / MIZIZI" style mono kicker; a glass panel behind
long copy; a real code window with line numbers; a thermal receipt or a
phone showing SYNCED. Hand-drawn underline on one number only.
Motion: 0.3s / 0.6s / 1.1s, cubic-bezier(.22,1,.36,1), transform+opacity
only, a visible frame change every 2.5 seconds or sooner.
Bilingual: Kiswahili for the human line, English for the technical line.
Never translate the same sentence twice on one frame.
No logo animation, no intro card, no "who we are" slide.
```

---

## 6. NEGATIVE BLOCK — hii ndiyo inayokata "za kawaida"

> Orodha hii ndiyo iliyokosekana kwenye prompt zako. Iweke **kila mara**, hata kama modeli inasema "negative prompt si lazima".

```
NEGATIVE / DO NOT GENERATE:
generic purple-blue gradient, glassmorphism blobs, floating 3D UI cards,
glowing globe or hologram, fibre-optic network lines, binary rain,
matrix code, hooded hacker, person typing on a laptop in a dark room,
stock photo of a smiling team, handshakes, rocket ships, lightbulb,
chess pieces, AI sparkle icons, robot face, "innovation" abstract art,
neon cyberpunk city, dashboard with random charts and fake KPIs,
unreadable garbled code, invented syntax, misspelled variable names,
confetti, lens flare, slow cinematic drone shot, parallax zoom on a
still screenshot for more than 2 seconds, emoji as bullets, word "seamless",
word "revolutionize", word "game-changer", word "unlock", word "leverage",
"in today's fast-paced world", "follow for more", "stop scrolling",
hashtag wall, 30 hashtags, more than one call to action, a URL on screen,
a logo sting at the start, a face that is not the client's, invented client
names, invented percentages, invented testimonials.
```

---

## 7. "Standout" ina maana gani hapa (checklist ya kuona)

- [ ] Frame ya kwanza ina **kitu halisi**: mstari wa code, risiti, au namba yenye chanzo, si " habari, leo...".
- [ ] Kuna **mabadiliko ya kweli** ndani ya sekunde 2 (si Ken Burns kwenye screenshot).
- [ ] Namba moja tu kubwa, na ina maana (`42`, `350K`, `1.2M`, `6.7924° S`).
- [ ] Rangi ni navy/paper + accent **moja**. Hakuna gradient.
- [ ] Kiswahili kwenye mstari wa kwanza, Kiingereza kwenye mstari wa kiufundi.
- [ ] Code inasomeka. Ilichukuliwa kutoka repo/tovuti, haikuzuliwa na modeli.
- [ ] Caption zimeburniwa (watu wanaanza muted).
- [ ] Ask **moja** tu mwishoni, na keyword inaweza kutamkwa.
- [ ] Hakuna kitu kutoka NEGATIVE BLOCK.

Ikiwa masharti mawili hayajatimia, usi-post. Ondoa na urekebishe prompt, usiongeze "make it more cinematic, 4k, highly detailed" — maneno hayo huongeza clichés, haziongezi ubora.
