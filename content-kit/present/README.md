# Company presentation kit — 17 Nov 2026

Hii ni **output** ya `content.json` + `bio-variations.json`. Usihariri PDF/Doc/HTML moja kwa moja; badilisha source kisha:

```bash
/tmp/kvenv/bin/python content-kit/present/build_all.py
python3 content-kit/check.py
```

## Vya kusoma / kushiriki (v1.1)

| Aina | Link / faili |
| --- | --- |
| PDF yenye brand (A4, kurasa 12) | [Google Drive — v1.1](https://drive.google.com/file/d/1tmpqn7UAcsyn18YGsPS2IupnYnwlfnCX/view?usp=drivesdk) · ndani: `Altraware-Content-Strategy.pdf` |
| Google Doc inayohaririwa | [Docs — v1.1](https://docs.google.com/document/d/10943ZIl3_YQ8Xdpwslj_dT8rFmRbyfhHIZBXSuYgHrk/edit?usp=drivesdk) |
| DOCX (export ya Google Doc) | [Drive — v1.1.docx](https://drive.google.com/uc?id=1u1QlD2RvSfn772fIsnQu1-dYq35pSv9T&export=download) · ndani: `Altraware-Content-Strategy.docx` |
| Tovuti ya simu (static) | `site/index.html` · [Vercel preview](https://altraware-tech-git-arena-1db882-davidbyanmwijage-7829s-projects.vercel.app/) |
| Live preview ya Arena | `python3 -m http.server 8010 --bind 0.0.0.0` kwenye `content-kit/present/site` (process `strategy-site-15903bc8`) |

PDF, Google Doc na DOCX zote zina **QA receipts sahihi**: `92.6 STRONG / 76.4 STRONG / 56.0 OK`, si `78.7` ya zamani.

## Hali ya Vercel (usome kabla ya kushiriki link)

- Deployment ya kwanza kwenye project `altraware-tech` ilifanikiwa (`dpl_5HfYC9cx9ipSNNv868X9z7wb7pmD`, commit `32d65e0`). Inahitaji **login ya Vercel** kwa sababu team ina SSO/deployment protection; `fetch_page` ilirudisha `Protected Deployment`.
- Project maalum `altraware-ig-content-kit` iliundwa lakini first deployment ilikataliwa na connector kwa sababu ya `projectSettings`/`skipAutoDetectionConfirmation` zisizopatikana kwenye tool.
- Jaribio la redeploy ya **v1.1** (commit `4ddff0b`) lilikataliwa: `402 api-deployments-free-per-day` — zaidi ya deployment 100 kwa siku kwenye free plan. Rudi baada ya saa 24 au tumia Vercel dashboard/CLI.
- Kwa hiyo **Vercel preview bado ni v1** (PDF link ya zamani + hook score ya zamani). Tumia PDF/Doc/DOCX v1.1 au `site/index.html` ya ndani kwa maudhui yaliyosahihishwa.

## Vyanzo na sheria

- `content.json` — sehemu 11 za presentation.
- `bio-variations.json` — variations V1–V4; `selection.chosen` bado `null`.
- `links.json` — PDF, site na Google Doc links zinazoingizwa kwenye output.
- `build_all.py`, `site.template.html` — generator.
- `vercel.json` (root + `site/`) — static settings: `framework: null`, `buildCommand: null`, `installCommand: null`, `outputDirectory`.

**Bado unahitaji kuchagua V1–V4.** V1 ndiyo inayosuggestiwa (Kiswahili kamili); V2 bado ni default iliyoandikwa kwenye `01-presence-audit.md §4` na studio hadi uchague. Hakuna kilichopostwa, hakuna DM, hakuna auto-DM, hakuna credentials.
