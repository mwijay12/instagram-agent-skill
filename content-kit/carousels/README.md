# Carousels — 6 decks, 48 PNG zilizotengenezwa kwa code

> 1080 × 1350 · Fraunces / Inter / JetBrains Mono halisi · navy `#071022` / paper `#f7f6f2` / gold `#eab308` / violet `#7c3aed`
> Chanzo cha ukweli ni [`decks/`](decks/). [`build/`](build/) ni output inayoweza kuzalishwa upya.

---

## Kwa nini hizi si "za kawaida"

Carousel nyingi za tech-agency zinafanana: gradient, icon tatu, "Why choose us?", na CTA ya "DM us". Hizi hapa zinaanza na **kitu kinachoweza kuthibitishwa**: Wi-Fi inayozimwa Kariakoo, code halisi kutoka homepage yako, bei zilizoandikwa kwenye tovuti yako, `lang: "sw"` kwenye mstari wa code, wiki 1 hadi uzinduzi, na prompt mbaya uliyoianza nayo mwenyewe.

Kila deck ina **slides 8** (si 5, si 10), **caption ya Job B** (kazi ya kuhifadhi/kutuma, si kurudia hook), **ask moja** ya keyword, **hashtag ≤ 3**, **first comment**, **alt text ya cover**, **sources**, na **claim note** inayosema ni nini kisichoruhusiwa kudaiwa.

---

## Decks

| # | id | Akaunti | Keyword | Cover |
| --- | --- | --- | --- | --- |
| 01 | [`01-offline-first`](decks/01-offline-first.json) | `@altrawaretechnology` | `POS` | Mtandao ukikatika, muuzo unasimama? |
| 02 | [`02-code-halisi`](decks/02-code-halisi.json) | `@mwijay__davie` | `CODE` | Hii si mockup. Ni code. |
| 03 | [`03-bei-wazi`](decks/03-bei-wazi.json) | `@altrawaretechnology` | `BEI` | Bei za tovuti, bila kuficha |
| 04 | [`04-lugha-kwanza`](decks/04-lugha-kwanza.json) | `@mwijay__davie` | `LUGHA` | Kiswahili si tafsiri |
| 05 | [`05-wiki-1-hadi-uzinduzi`](decks/05-wiki-1-hadi-uzinduzi.json) | `@altrawaretechnology` | `MKATABA` | Wiki 1 hadi uzinduzi |
| 06 | [`06-prompt-moja`](decks/06-prompt-moja.json) | `@mwijay__davie` | `PROMPT` | Prompt moja, video ya kawaida |

Copy kamili ya kila slide, caption, first comment na hashtag iko kwenye [`DECKS.md`](DECKS.md) (inatengenezwa na renderer). Orodha ya machine-readable iko kwenye [`decks/index.json`](decks/index.json).

**Anza na 01** kwa akaunti ya studio (profile yake ndiyo iliyo mbaya zaidi), kisha **06** kwa akaunti ya kibinafsi: inaelezea tatizo lile lile uliloniambia, na inaunganisha moja kwa moja na [`code-video/`](../code-video/README.md).

---

## Faili zilizopo

```
carousels/
├── README.md                 <- hii
├── DECKS.md                  <- copy yote ya kusoma / kunakili (generated)
├── decks/
│   ├── index.json            <- manifest: 6 decks, order, account, keyword
│   └── 0*.json               <- source of truth (USIHARIRI PNG moja kwa moja)
├── render/
│   └── build_slides.py       <- Pillow renderer, deterministic
└── build/
    ├── index.json            <- njia za PNG kwa studio/
    ├── contact-sheet.jpg     <- kagua deck zote 6 kwa picha moja
    ├── 01-offline-first/01.png … 08.png
    └── … 06-prompt-moja/01.png … 08.png     (jumla 48)
```

Fonti ziko kwenye [`../assets/fonts/`](../assets/fonts/FONTS.md): `.woff2` za asili kutoka `motion-lab`, pamoja na `.ttf` zilizobadilishwa kwa ajili ya Pillow.

---

## Tengeneza upya

```bash
# Kutoka root ya repo. /tmp/kvenv ina Pillow; system python haina.
/tmp/kvenv/bin/python content-kit/carousels/render/build_slides.py

# Kagua tu deck moja (SI kwa final artifacts - angalia dokezo chini)
/tmp/kvenv/bin/python content-kit/carousels/render/build_slides.py \
  --deck 06-prompt-moja --out /tmp/preview

# Kabla ya kugenereta, hakikisha sources ziko safi
python3 content-kit/check.py
```

> ⚠️ `--deck` inachuja orodha kabla ya kuandika `DECKS.md`, `contact-sheet.jpg` na `build/index.json`. Ukiiendesha bila `--out` tofauti, **itaandika upya generated artifacts kwa deck moja tu**. Kwa final build, iendeshe bila `--deck` kila wakati. Baada ya kubadilisha deck yoyote,endesha pia `python3 content-kit/studio/build_data.py` ili live preview iendane.

Mahitaji: `Pillow` (tu). Hakuna browser, hakuna Chromium, hakuna API key, hakuna network. Renderer inachora contour lines, glass panel, code window, thermal receipt / `SYNCED` phone, grid ya bei, na hatua 7 kwa `ImageDraw` — ndiyo maana maandishi yote yanasomeka na hayana "AI letter salad".

---

## Vizuizi vya design (viko kwenye renderer, si mapendekezo)

| Kipengele | Thamani |
| --- | --- |
| Ukubwa | 1080 × 1350 (4:5) |
| Safe margin | 120px kila upande |
| Kicker | `ACT 01 / MIZIZI` + `6.7924° S, 39.2083° E` kwa JetBrains Mono |
| Display | Fraunces, italic kwenye neno moja tu |
| Accent | gold **au** violet, si zote mbili kwa nguvu sawa kwenye slide moja |
| Chini | footer yenye handle + namba ya slide |
| Code | `faida.checkout({ items, pay: "M-PESA", lang: "sw" })` — imenakiliwa kutoka [altra.tanzaniareach.com](https://altra.tanzaniareach.com/) |
| Hakuna | gradients, glossy blobs, stock icons, emoji bullets, "Why choose us?", mock dashboards zenye chart za uwongo |

Angalia [`../02-brand-system.md`](../02-brand-system.md) kwa BRAND BLOCK na NEGATIVE BLOCK kamili.

---

## Kabla ya kupakia

```
[ ] Nimeangalia contact-sheet.jpg: cover 6 zinasomeka kwa ukubwa wa kidole.
[ ] Nimefungua PNG 3–4 kwenye SIMU, si kwenye desktop tu.
[ ] Hakuna mstari uliokatwa, hakuna herufi inayogusa contour/footer.
[ ] Caption ina ask MOJA tu (Comment KEYWORD), si "like + save + share + DM".
[ ] Hashtag ≤ 3, ziko chini ya fold, hakuna URL kwenye caption.
[ ] First comment iko tayari kunakiliwa.
[ ] Alt text ya cover imewekwa kwenye IG accessibility.
[ ] Claim note ya deck imesomwa: hakuna 0.8s / 99.98% / "wateja 200+" / "100% ownership".
[ ] Link kwenye bio ni moja (angalia 01-presence-audit.md §5).
[ ] Nimeandika kwenye log.md: tarehe, deck id, keyword, saves baada ya 48h.
```

Usisahau: **carousel hii haiposti chochote**. Unapakia wewe. Pia usibadilishe PNG moja kwa moja kwenye editor — badilisha `.json` kwenye `decks/` kisha generate upya, ili studio, `DECKS.md` na linter vibaki sawa.
