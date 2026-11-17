# Maamuzi yaliyokubaliwa — 17 Nov 2026

Mmiliki ameamua migongano 5 ya [`01-presence-audit.md`](01-presence-audit.md) §5. **Hii ndiyo source of truth mpya.** §5 inabaki kama historia ya vyanzo vilivyogongana. Faili zote zimesasishwa: `bio-variations.json`, `present/content.json`, voice profiles, `05-content-system.md`, `06-30-day-plan.md`, `08-bio-variations.md`, carousel `03-bei-wazi`, PDF/Doc/site.

| # | Mada | Uamuzi |
| --- | --- | --- |
| 1 | **Bei: custom vs SaaS** | Tumia bei za **"kuanzia"** kwa kazi za mara moja: **Web Starter 350k**, **Growth 550k**, **Custom kuanzia 800k**, **mifumo kuanzia 1.2M**. **Care Plan 99k/mwezi** ni huduma **tofauti**. **Usiiite "SaaS"** isipokuwa Faida inauzwa kwa usajili. `"Bei wazi"` = *bei ya kuanzia iko wazi; bei kamili inawekwa kwa maandishi baada ya scope.* Tier ya 750K imeondolewa. |
| 2 | **Cloud-first** | Usitumie msimamo mkali. Sema **`offline-first, cloud-synced`**. Caption 2 ilikuwa `"Stop building cloud-first apps..."`; sasa ni **`"Build the queue first. Offline-first, cloud-synced POS for Tanzanian shops."`** (81.8 STRONG). Hook ile ile ya *"Build the queue first"*, bila kukanusha cloud. Faida ina-sync kwenye cloud. |
| 3 | **Umiliki** ⭐ | **Ukweli uliochaguliwa:** msingi wa Faida unabaki wa Altraware; mteja anamiliki data yake na tovuti/app yake; msingi unatolewa kwa leseni. Sentensi moja: **`Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.`** (EN: *You own your data and your site/app; the Faida core is licensed to you.*) **Hakuna "100%"** kwenye post wala bot. Hii inaendana na kifungu 3 cha mkataba (Altraware anamiliki templates/prompts/libraries). Mmiliki atarekebisha FAQ ya bot kwenye **knowledge files zote mbili** ili ziendane. Ukichagua upande mwingine (mteja anamiliki hata msingi), badilisha kifungu 3 **kwanza**, kisha uniambie nisasisha kit. |
| 4 | **Tagline** | **`Built in Tanzania, for how Tanzania really works.`** Ni mahususi na inathibitika. `"Rooted at home. Engineered for the World."` / `"Built for the world."` / `"Mizizi ya nyumbani. Ufundi wa kidunia."` zimeachwa; `"Engineered for the World"` ni dai kubwa kwa akaunti yenye wafuasi 5. Inaweza kurudi baadaye. |
| 5 | **Link** | Weka **`https://altra.tanzaniareach.com/`** uiache hivyo. **Usiiite "official website"**, usibuni domain. Ukipata domain, badilisha **link moja tu**; name, bio, captions, pinned na highlights zinabaki. |

## Jina lililosahihishwa

`Altraware Tech | Websites & Apps` = **32/30** → **litakatwa**. Tumia **`Altraware | Websites & Apps` (27/30)** kama jina mbadala. Bado **hujachagua V1–V4**; V2 (`Altraware | Websites & POS TZ`, 29/30) ndiyo default iliyoandikwa kwenye `01-presence-audit.md` §4 / studio hadi useme vinginevyo. Ukisema "hili ndilo default", nitasasisha §4 + `studio/data.js` + PDF + Doc pamoja.

## Bado kutoka kwako

| Kitu | Hali |
| --- | --- |
| Variation V1–V4 | **Bado.** V1 inasuggestiwa (Kiswahili kamili); V2 bado default. |
| IG Search suggestions DSM | **Dakika 10 zako.** Sijaweza kufungua IG search bar kwenye sandbox (hakuna session/akaunti ya DSM). Sijabuni maneno: Google autocomplete `gl=TZ&hl=sw` imeshafanywa kwenye [`search-terms.md`](search-terms.md) na mistari 5 ya kwanza ya wiki 2 iko kwenye `06-30-day-plan.md`. Leta screenshots/maandishi, nita-replace. |
| Screenshots / captions 3 za zamani | **Dakika 10 zako.** Chagua 1 bora, 1 ya kawaida, 1 usiyoipenda, au bandika maandishi hapa. Ficha binafsi; **usilete token wala login** ya akaunti ya zamani. |
| Insights za post 10–30 | **Hazifanyiki bado** — hakuna kilichopostwa. Anza kuchapisha, rekodi `views, reach, sends, saves, hold@3s` kwenye [`log-template.md`](log-template.md); angalia post 10, amua post 30. |
| Ruhusa ya namba za kujitangaza | Bado `NEEDS_INPUT`: 99.98% uptime, 24ms, 0.8s, 10x, "Neema", n.k. hazijatumika kama proof. |

**Hakuna kilichopostwa, hakuna DM, hakuna auto-DM, hakuna credential iliyohifadhiwa, akaunti ya Instagram haijaguswa.**
