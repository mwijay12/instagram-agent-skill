# 01 · Presence audit & profile fix

**Tarehe ya ukaguzi:** 17 Novemba 2026 (EAT). **Njia:** faili 2 ulizoattach, repo hii, GitHub API (`users/mwijay12`, 42 public repos), kurasa za live, na kurasa za hadharani za Instagram. **Sijaingia** kwenye akaunti yoyote, sijascrape, sijaona insights wala grid ya post zaidi ya iliyo wazi.

> Kila kitu hapa kina link. Kitu kisicho na chanzo kimeandikwa `NEEDS_INPUT`. Hii ndiyo kanuni ya repo: "Nothing here fabricates."

---

## 1. Vyanzo nilivyotumia

| Chanzo | Nini kilitolewa |
| --- | --- |
| `altraware_knowledge.md`, `mwijay_altraware_ai_knowledge.md` (attachments) | Majina, bei, bidhaa, mchakato wa kazi, routing ya DM, maswali ya FAQ |
| Repo hii (`mwijay12/instagram-agent-skill`) | Skills 13, zana 5 za Python, `templates/voice.md` **tupu** |
| [GitHub profile](https://github.com/mwijay12) | `Mwijay Davie`, bio "Co-Founder @ Altraware Technologies \| Systems Architect & Software Engineer \| Building scalable digital platforms in East Africa", Dar es Salaam, **42 public repos**, **205 followers**, akaunti imeanzishwa 30 Machi 2024, blog `mwijayportfolio.vercel.app` |
| [`strategies`](https://github.com/mwijay12/strategies) | `docs/05-content-engine.md` (nguzo 4, brand voice, anti-hallucination guard), `docs/06-client-acquisition.md` (ICP 8, offer ladder), `docs/09-templates-scripts.md` (vifungu vya mkataba) |
| [`motion-lab`](https://github.com/mwijay12/motion-lab) | Design tokens halisi, fonti, mwendo, muundo wa tovuti ya studio |
| [altra.tanzaniareach.com](https://altra.tanzaniareach.com/) | Tagline, bidhaa, bei, "Act I — Mizizi", code snippet ya `faida.checkout()`, marquee ya Kiswahili |
| [altra-motion-lab.vercel.app](https://altra-motion-lab.vercel.app/) | Coordinates `6.7924° S, 39.2083° E`, "Built in Tanzania, for how Tanzania really works." (tagline mpya 17 Nov 2026; ya zamani: "Mizizi ya nyumbani. Ufundi wa kidunia."), kazi 6 zilizoorodheshwa, hatua 5, namba za kujitangaza |
| [faida-hq.vercel.app](https://faida-hq.vercel.app/) | FaidaHQ kama SaaS: TZS 0 / 35,000 / 90,000 kwa mwezi, "cloud-first", "10x Faster Billing" |
| [tanzaniareach.com](https://www.tanzaniareach.com/) | Hub ya sekta 18, mikoa 31, "Independent Educational Resource", **not government** |
| [instagram.com/mwijay__davie](https://www.instagram.com/mwijay__davie/) | "David Mwijage", "Co founder of Altraware Technology @altrawaretechnology", 48 followers / 159 following, link `mwijay-studio.vercel.app` |
| [instagram.com/altrawaretechnology](https://www.instagram.com/altrawaretechnology/) | "Software Developer", "Wholesale and Retail sale of Motorcycle @pikipikialtraware", 5 followers / 2 following, link `tanzaniareach.com`, post 1 ya 26 Okt 2026 (likes 2, comments 0) |

---

## 2. Inventory: vitu halisi vya kutengenezea content

Hii ndiyo **content mine**. Kila mstari ni Reel, carousel, au scene ya code-to-video.

| Kitu | Kilichothibitika | Live / repo |
| --- | --- | --- |
| Faida POS / FaidaHQ | POS + stoo, risiti za thermal, tahadhari za stoo, matawi mengi, Flutter APK kupitia GitHub Releases | [faida-pos-releases](https://github.com/mwijay12/faida-pos-releases) · [demo](https://faida-hq.vercel.app/) |
| Shule Altra / ShuleDirect Pro | NECTA-oriented O-level grading, mahudhurio, ada, kadi za wanafunzi, "Shule Guide" ya Kiswahili/Kiingereza (si LLM) | [Shule-Altra](https://github.com/mwijay12/Shule-Altra) · [live](https://shule-direct-pro.vercel.app) |
| loanapp (LIMS) | Mikopo ya simu, dual-IMEI ledger, NIDA ya tarakimu 20, matawi Kariakoo/Mbezi/Arusha/Mwanza/Dodoma, EN+SW | [loanapp](https://github.com/mwijay12/loanapp) |
| TabTune Studio | MV3 extension: tab audio → Gemini transcription → `.lrc`, imeundwa kwa Kiswahili, Sheng na English, karaoke view | [tabtune-studio](https://github.com/mwijay12/tabtune-studio) · [site](https://tabtune-studio.vercel.app) |
| RoadSafety_Dar | Data visualization ya usalama barabarani DSM, Python / Next.js / Supabase, ⭐4 | [RoadSafety_Dar](https://github.com/mwijay12/RoadSafety_Dar) |
| hype-alarm | Tauri + Rust, 400% volume boost, math challenge ya kuzima, AI fallback ya offline | [hype-alarm](https://github.com/mwijay12/hype-alarm) |
| techymwijay | Voice STT (Kiswahili–English), TZS expense tracker, priority `haraka / kawaida / baadaye` | [techymwijay](https://github.com/mwijay12/techymwijay) |
| video-factory | MoviePy compositor, cuts za sekunde 1.5–2.5, captions, dual-language TTS, longform clipper | [video-factory](https://github.com/mwijay12/video-factory) |
| motion-lab | WebGL2 contour shader, GSAP, Barba, Lenis, Fraunces/Inter/JetBrains Mono, navy/gold/violet | [motion-lab](https://github.com/mwijay12/motion-lab) |
| Altraware studio OS | Marketing + `/portal` + `/admin`, estimator, invoice PDF, milestones | [altraware-technology](https://github.com/mwijay12/altraware-technology) |
| Tanzania Reach | Sekta 18 za uwekezaji, mikoa 31, miongozo, "si chombo cha serikali" | [tanzaniareach.com](https://www.tanzaniareach.com/) |
| Kazi 6 za studio | Faida POS, UAUT Connect, AYMI Africa, Volta Rentals, Bongo Foodie, Audenic | [motion-lab / work](https://altra-motion-lab.vercel.app/work/) |
| MwijayNote, Audenic, Mwijay Music App | ⭐5, ⭐4, ⭐3 mtawalia; PWA ya muziki kwa Capacitor | [MwijayNote](https://github.com/mwijay12/MwijayNote) · [Audenic](https://github.com/mwijay12/audenic) · [Music App](https://github.com/mwijay12/Mwijay-Music-App) |

**Namba moja ya kutumia kwa uangalifu:** "repo 42 za public" ni sahihi tarehe ya ukaguzi. Ikiwa utaitumia baada ya mwezi mmoja, angalia tena au iandike "(Nov 2026)".

---

## 3. Profile audit (kwa [`rubric.json`](../skills/ig-profile/rubric.json))

Sijaona grid, highlights wala insights kwa ukamilifu, kwa hiyo **sitatoa alama ya uwongo /100**. Haya ndiyo mashamba yanayoonekana hadharani:

| Item (uzito) | `@mwijay__davie` | `@altrawaretechnology` |
| --- | --- | --- |
| `name_field` (12) | "David Mwijage" → 0. Jina tu, halitafutiki. | "ALTRAWARE TECHNOLOGY" → 0. Jina tu, ALL CAPS. |
| `bio_first_line` (12) | "Co founder of Altraware Technology" → 0. Cheo, si mabadiliko kwa mtazamaji. | "Software Developer" → 0. Kinachofuata ni **biashara ya pikipiki**. |
| `bio_body` (8) | Hakuna proof, hakuna offer → 0. | `@pikipikialtraware` → 0. Brand confusion. |
| `link` (8) | `mwijay-studio.vercel.app` → 3. Ni portfolio, si mlango mmoja wazi. | `tanzaniareach.com` → 2. Bidhaa tofauti kabisa. |
| `pinned_three` (10) | Haiwezi kuthibitishwa hadharani → `NEEDS_INPUT` | Post 1 tu inayoonekana → 0 |
| `highlights` (8) | `NEEDS_INPUT` | `NEEDS_INPUT` |
| `grid_legibility` / `photo` | `NEEDS_INPUT` | `NEEDS_INPUT` |

**Uamuzi:** hapa ndipo pa kuanza. `/ig-audit` inasema wazi: *Reel inayopata views bila follows si Reel iliyoshindwa, ni profile iliyoshindwa.* Kwa followers 48 na 5, kila mgeni ni wa thamani sana. Reel nzuri inayotua kwenye bio inayosema "Wholesale and Retail sale of Motorcycle" inapotea.

---

## 4. Rewrite: copy-paste hivi leo

### `@mwijay__davie`

**Name field (27/30 chars, linatafutika):**
```
Mwijay Davie | Systems & AI
```

**Bio (126/150 chars):**
```
Mifumo ya duka, shule na kliniki inayofanya kazi hata mtandao ukikatika.
Co-founder @altrawaretechnology · Code halisi, DSM 🇹🇿
```

**Link moja:** `https://altra.tanzaniareach.com/` (au `mwijay-studio.vercel.app` ukipendelea portfolio, lakini chagua **moja**).

**Pinned 3** (vitofauti vya kazi, si post zenye views kubwa zaidi):
1. **Proof** → carousel `02-code-halisi` (repo halisi, live links kwenye first comment).
2. **Offer/maelezo** → carousel `06-prompt-moja` (anachopata mtu akifollow).
3. **Utambulisho** → Reel yako ya kwanza ya "Kwa nini ninajenga Kiswahili kwanza" (angle kwenye `06-30-day-plan.md`, wiki 1).

**Highlights 5:** `Code`, `Mifumo`, `Bei`, `Maswali`, `DSM`. Covers zinazotumia navy + gold, bila emoji.

### `@altrawaretechnology`

**Name field (29/30 chars):**
```
Altraware | Websites & POS TZ
```

**Bio (141/150 chars):**
```
Tovuti, app na POS kwa biashara TZ. Kiswahili kwanza, M-Pesa ndani, hata offline.
Dar es Salaam · Bei wazi kwenye link · Mkataba wa maandishi
```

> Imeboreshwa 17 Nov 2026 baada ya utafiti wa IG Search: `POS` (keyword ya bidhaa) na `kwenye link` (CTA moja laini) vimeongezwa; `Websites` kwenye name field na `Tovuti` kwenye bio vinashikilia Kiswahili na Kiingereza bila kurudia tafsiri. Maelezo yote kwenye [`07-ig-setup.md`](07-ig-setup.md) §1.
>
> **Hii ni variation V2 (default), si uamuzi wa mwisho.** Mmiliki ameomba variations 4 (pamoja na Kiswahili kamili) → [`08-bio-variations.md`](08-bio-variations.md) / [`bio-variations.json`](bio-variations.json). Akichagua nyingine, sasisha §4 hii, `studio/data.js`, PDF na Google Doc pamoja. Pia amethibitisha: **brand = Altraware Tech**, **link ni subdomain, hakuna domain bado**, email `altrawaretechnology@gmail.com`, WhatsApp **bot** `0790942616`, na **mtu** `+255 792 867 427`.

> **Jina mbadala lililosahihishwa (17 Nov 2026):** `Altraware Tech | Websites & Apps` ni **32/30** → litakatwa. Tumia `Altraware | Websites & Apps` (**27/30**). Bado si canonical hadi uchague variation; angalia [`09-decisions.md`](09-decisions.md).

**Link moja:** `https://altra.tanzaniareach.com/` — sio Tanzania Reach, sio pikipiki, sio link tree ya chaguo 11.

**Pinned 3:**
1. **Proof** → carousel `01-offline-first` (Faida POS).
2. **Offer** → carousel `03-bei-wazi` (Web Starter 350k · Growth 550k · Custom kuanzia 800k · mifumo kuanzia 1.2M · Care Plan 99k/mwezi).
3. **Process** → carousel `05-wiki-1-hadi-uzinduzi`.

**Highlights 5:** `Bei`, `Faida POS`, `Kazi`, `Mchakato`, `Maswali`.

**Ondoa:** rejea ya `@pikipikialtraware` kwenye bio ya studio. Ikiwa biashara ya pikipiki ni yako pia, ipe akaunti yake, na ui-tag kwenye story, si kwenye bio ya software studio.

**First nine covers:** 3 carousel covers + 3 Reel covers + 3 proof frames. Kila Reel cover ichaguliwe kwa mkono (si frame ya kwanza ya mtu akifungua kinywa). Maandishi ya cover yawe ndani ya 120px za kati, yasomeke kwenye thumbnail.

---

## 5. Migongano kati ya vyanzo vyako (historia + maamuzi)

> ✅ **IMESASISHWA 17 Nov 2026:** mmiliki ameamua migongano 5. **Source of truth mpya ni [`09-decisions.md`](09-decisions.md)** na §12 ya PDF/Doc. Jedwali hili linabaki kuonyesha *ni kwa nini* yaligongana; safu ya mwisho sasa ina uamuzi, si sheria ya muda.

| # | Mada | Chanzo A | Chanzo B | Uamuzi (17 Nov 2026) |
| --- | --- | --- | --- | --- |
| 1 | **Faida POS ni nini?** | KB: custom **kuanzia TSh 1,200,000**, offline-first | [FaidaHQ](https://faida-hq.vercel.app/): **TZS 0 / 35,000 / 90,000 kwa mwezi** | **Bei za kuanzia:** Web Starter 350k · Growth 550k · Custom kuanzia 800k · mifumo kuanzia 1.2M. Care Plan 99k/mwezi ni huduma tofauti. "Bei wazi" = bei ya kuanzia wazi, bei kamili kwa maandishi baada ya scope. **Usiseme "SaaS" isipokuwa Faida inauzwa kwa usajili.** |
| 2 | **Offline au cloud?** | KB: "100% offline-first, ina-sync ikirudi" | FaidaHQ: "cloud-first", "100% Cloud Sync" | **offline-first, cloud-synced.** Hakuna msimamo mkali. Hook: *"Build the queue first"* bila kukanusha cloud. Caption 2 imesahihishwa. |
| 3 | **Umiliki wa code** | KB: "100% code & IP ownership kwa mteja" | [`strategies/docs/09`](https://github.com/mwijay12/strategies/blob/main/docs/09-templates-scripts.md) kifungu 3: Altraware anamiliki templates/prompts/libraries | **Ukweli uliochaguliwa:** *"Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni."* **Hakuna "100%"** kwenye post wala bot. Mkataba + matangazo vifuate. Mmiliki atarekebisha FAQ za knowledge files zote mbili. |
| 4 | **Tagline** | KB: "Rooted at Home. Engineered for the World." | Hero: "Rooted at home. **Built** for the world." | **`Built in Tanzania, for how Tanzania really works.`** "Engineered for the World" ni dai kubwa kwa wafuasi 5; inaweza kurudi baadaye. |
| 5 | **Link gani?** | `altra.tanzaniareach.com` + vercel nyingi 6 | Mmiliki: **hatuna domain bado**, "tunajitafuta" | **Weka `altra.tanzaniareach.com` uiache hivyo.** Usiiite "official website", usibuni domain. Ukipata domain, badilisha **link moja tu**. |
| 6 | **Namba za kujitangaza** | 95+ Lighthouse, 99.98% uptime, 24ms, 0.8s, 10x, 0% lost stock, "Neema" | Maandishi ya tovuti tu, si vipimo wala ruhusa | **Hazijatumika kama proof.** Usizitaje hadi uwe na log/measurement au ruhusa ya mteja. |
| 7 | **Uzingatiaji sheria** | "PDPA / PDPC compliant", "BRELA REGISTERED" | Hakuna cheti wala namba iliyothibitishwa | Sema *"tunaandika mikataba na kufuata misingi ya PDPA 2022"*, si *"tumeidhinishwa"*. |
| 8 | **Tanzania Reach** | KB: "linaloendeshwa na Altraware" | Tovuti: "NOT a Government Agency", footer inakataza AI training | Ui-link tu; usichukue maandishi/picha kama asset, usiiite serikali. |
| 9 | **Sauti ya lugha** | "bilingual, warm, concise" | `strategies/docs/05`: "matoleo mawili, si tafsiri" | Fuata doc 05. Ndiyo iliyojaza `voice.md`. |

---

## 6. Pengo zingine

- Hakuna `~/.claude/instagram/voice.md` iliyojazwa → skills zote zinaandika kwa default.
- Hakuna `swipe.md` (evidence ya niche) wala `log.md` (historia ya hook formulas). `/ig-viral` na `/ig-audit` zinakosa data yako.
- Hakuna orodha ya akaunti 10 za kuingiliana nazo kwa `/ig-plan`.
- Hakuna screenshot halisi ya mifumo ikifanya kazi kwenye duka/shule/kliniki; tovuti zako zina placeholders ("replace with your reel", picha za Unsplash). **Hii ndiyo asset ya kwanza ya kurekodi kesho**: video ya sekunde 20 ya Faida POS ikitoa risiti wakati Wi-Fi imezimwa. Ni proof isiyoweza kubuniwa.
- Kwenye akaunti ya studio kuna post 1 tu ya 26 Okt 2026. Kwa akaunti ndogo, `/ig-viral` inapendekeza kukusanya akaunti 6–12 zilizo karibu na ukubwa wako (ndani ya ~10x) na kupima **outlier multiple**, si raw views.

---

## 7. Mpangilio wa kurekebisha (usibadilishe)

1. Bio + name field + link + pinned 3 (§4). Dakika 15.
2. `./content-kit/use-voice.sh mwijay` → kisha `altraware` unapoandikia studio.
3. Pakia carousel `01-offline-first` kwenye studio, `02-code-halisi` kwenye binafsi.
4. Rekodi ushahidi mmoja halisi (§6) na uutumie kwenye Reel ya kwanza.
5. Anzisha `~/.claude/instagram/log.md`: tarehe, hook formula id, mstari wa kwanza.
6. Baada ya post 30, endesha `/ig-audit`. Kabla ya hapo, usibadilishe muda wa kupost ukitafuta sababu ya views kidogo: repo lenyewe linasema **first two seconds** ndizo zinazoamua.

---

## 8. Taarifa kutoka kwa mmiliki (17 Nov 2026) — akaunti ya zamani

> **Aina ya taarifa:** imesemwa na mmiliki kwenye conversation, **haijathibitishwa hadharani**. Si sehemu ya utafiti wa §1, wala chanzo cha identity, wala namba ya kutaja kwenye content. Iko hapa tu kwa ajili ya **risk context** na maamuzi ya usalama.

Mmiliki alikuwa na akaunti ya zamani `@mwijay.davie` yenye takriban **12K followers**, ambayo anasema wengi walikuwa **bots / fake**, na idadi hiyo ilikuwa "numbers tu". Akaunti ilibanwa; anadhani ilitokana na **automation**, na kwamba **Meta API token iliyo-expose** iliruhusu watu wengine kuingia hadi verification ikafungwa na akaunti ikalockiwa kabisa.

**Marekebisho kwenye utafiti wa awali:** matokeo ya web search yaliyomtaja "Mwijay Davie" kama freelancer wa graphic design / gospel music na `@mwijay.davie` yalikuwa yakisomwa kama *akaunti tofauti ya mtu mwingine*. Kwa taarifa hii, ni **akaunti yake ya zamani iliyobanwa**, si mwingine. Bado **si source-of-truth** ya tech identity — GitHub `mwijay12`, IG `@mwijay__davie` na `@altrawaretechnology` ndizo zinazotumika.

**Athari kwenye kit (muhimu):**

1. **Usichase idadi.** Followers 5 wa kweli kwenye studio ni baseline safi kuliko 12K ya bots. Vipimo vya kufuatilia ni reach, saves, sends, hold@3s, DM halisi, si follower count.
2. **Hakuna automation / hakuna kununua engagement / hakuna bulk DM.** Hii imekazwa kwenye [`07-ig-setup.md`](07-ig-setup.md) §2G. Meta ana Spam na Inauthentic Behavior policies zinazokataza fake engagement.
3. **Security kabla ya content:** 2FA kwa authenticator app, recovery codes offline, email iliyo salama, revoke `Apps and Websites`, angalia sessions, na **reset ya Meta App Secret / revoke tokens / GitHub secret scanning** (§7 ya `07-ig-setup.md`).
4. **Usafishe followers waliobaki:** professional account ina *Manage followers / Potential spam / Flagged for review* rasmi.
5. **Haijaingia kwenye caption, bio, prompt, carousel, wala MP4 yoyote.** Kamwe usiiandike kwenye post; usiitumie kama "experience" wala kama namba ya kujitangaza.
6. **Usijaribu kuikwepa kwa akaunti hizi:** endelea na credentials tofauti, hakuna automation ya pamoja, na recovery ikijaribiwa iwe kupitia njia rasmi tu (`instagram.com/hacked`, Meta Account Recovery Hub, appeal kwenye notice). Angalia [`07-ig-setup.md`](07-ig-setup.md) §7.

**Bado NEEDS_INPUT:** tarehe kamili ya ban, ujumbe halisi unaoonekana ukijaribu kuingia (disabled / suspended / hakuna ujumbe), na kama token iliyovuja ilikuwa ya app gani. Haya yanahitajika tu ukiamua kufuata recovery — **usitume password, 2FA code, wala token kwenye chat/repo**.

