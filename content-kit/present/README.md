# Company presentation kit — 17 Nov 2026 (v1.2)

Hii ni **output** ya `content.json` + `bio-variations.json` + `09-decisions.md`. Usihariri PDF/Doc/HTML moja kwa moja; badilisha source kisha:

```bash
/tmp/kvenv/bin/python content-kit/present/build_all.py
python3 content-kit/check.py
```

## Vya kusoma / kushiriki (v1.2 — sahihi)

| Aina | Link / faili |
| --- | --- |
| PDF yenye brand (A4, kurasa **13**) | [Google Drive — v1.2](https://drive.google.com/file/d/1JtgqO9Tw7fbwsQC4HYXMw4QsudKjaIFU/view?usp=drivesdk) · ndani: `Altraware-Content-Strategy.pdf` |
| Google Doc inayohaririwa | [Docs — v1.2](https://docs.google.com/document/d/1njUgtZfAovlz1atWWKp6AT6SOdQ2NiOsvCsR4QHz67k/edit?usp=drivesdk) |
| DOCX (export ya Google Doc) | [Download — v1.2.docx](https://drive.google.com/uc?id=1KLrpobXkKfmLMpHdGK4S9TScsDYBGrZr&export=download) · ndani: `Altraware-Content-Strategy.docx` |
| Tovuti ya simu (static) | `site/index.html` · [Vercel preview](https://altraware-tech-git-arena-1db882-davidbyanmwijage-7829s-projects.vercel.app/) *(bado v1, tazama chini)* |
| Live preview ya Arena | `python3 -m http.server 8010 --bind 0.0.0.0` kwenye `content-kit/present/site` (process `strategy-site-15903bc8`) |

PDF, Google Doc na DOCX zote zina **QA receipts sahihi**: `81.8 STRONG / 76.4 STRONG / 56.0 OK`. Hook ya Kiingereza imesahihishwa kuwa `Build the queue first. Offline-first, cloud-synced POS for Tanzanian shops.` bila kukanusha cloud; si `92.6` wala `78.7` ya zamani.

**§12 "Maamuzi yaliyokubaliwa"** ndani ya PDF/Doc/site: bei za kuanzia, umiliki kwa leseni (si `"100%"`), tagline `Built in Tanzania, for how Tanzania really works.`, link moja, na jina `Altraware | Websites & Apps` (27/30). Angalia `../09-decisions.md` na `../search-terms.md`.

> v1.1 na v1.0 zimeachwa hai kwenye Drive zikiitwa **"superseded by v1.2"** ili link za zamani zisife, lakini **usizitumie**.

## Hali ya Vercel (usome kabla ya kushiriki link)

- Deployment ya kwanza kwenye project `altraware-tech` ilifanikiwa (`dpl_5HfYC9cx9ipSNNv868X9z7wb7pmD`, commit `32d65e0`). Inahitaji **login ya Vercel** kwa sababu team ina SSO/deployment protection; `fetch_page` ilirudisha `Protected Deployment`.
- Project maalum `altraware-ig-content-kit` iliundwa lakini first deployment ilikataliwa na connector kwa sababu ya `projectSettings`/`skipAutoDetectionConfirmation` zisizopatikana kwenye tool.
- Redeploy ya toleo jipya ilikataliwa: `402 api-deployments-free-per-day` — zaidi ya deployment 100 kwa siku kwenye free plan (hata `files` payload iligonga limit hiyo). Rudi baada ya saa 24 au tumia Vercel dashboard/CLI.
- Kwa hiyo **Vercel preview bado ni v1** (PDF link ya zamani + hook score ya zamani). **Tumia v1.2 PDF/Doc/DOCX au `site/index.html` ya ndani** kwa maudhui yaliyoamuliwa. Repo `site/index.html` ni v1.2 kamili.

## Vyanzo na sheria

- `content.json` — sehemu **12** za presentation (§12 = maamuzi).
- `bio-variations.json` — variations V1–V4, `decisions`, `name_options`, `week2_caption_openers`; `selection.chosen` bado `null`.
- `../09-decisions.md` — maamuzi 5 + sentensi ya umiliki + jina 27/30 + kazi zilizobaki.
- `../search-terms.md` — Google autocomplete halisi (TZ); IG search-bar bado ni dakika 10 za mmiliki.
- `links.json` — PDF, site, Google Doc na DOCX links zinazoingizwa kwenye output.
- `build_all.py`, `site.template.html` — generator.
- `vercel.json` (root + `site/`) — static settings: `framework: null`, `buildCommand: null`, `installCommand: null`, `outputDirectory`.

**Bado unahitaji kuchagua V1–V4.** V1 ndiyo inayosuggestiwa (Kiswahili kamili); V2 bado ni default iliyoandikwa kwenye `01-presence-audit.md §4` na studio hadi uchague. Hakuna kilichopostwa, hakuna DM, hakuna auto-DM, hakuna credentials.
