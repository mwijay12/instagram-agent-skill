# 08 · Bio variations 4 — chagua moja

> **17 Nov 2026** · `@altrawaretechnology` · Chanzo kimoja: [`bio-variations.json`](bio-variations.json)
> Umesema: **"Altraware Tech ndio brand"**, `altra.tanzaniareach.com` ni **subdomain tu, hatujapata domain, tunajitafuta**, na **Kiswahili mbele lakini English haiwezi kuondolewa kwenye captions**. Haya mambo matatu yameingia hapa. Hakuna lililobadilishwa kwenye IG — chagua kwanza.

---

## 0. Jibu fupi kwa maswali yako

**"Una suggest iwe in Swahili completely?"** → **Ndiyo**, nasuggest **Variation 1** kwa **name field + bio**. Lakini kwa caveat moja ya uaminifu: Instagram mwenyewe aliandika 2021 kwamba keyword search ilianza na **Kiingereza** na lugha nyingine zitaongezwa baadaye [1](https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works). Sijapata tamko rasmi la 2026 la lugha zote. Kwa hiyo bio ya Kiswahili kamili inaweza kupoteza kidogo kwenye *IG Search*, lakini **haipotezi kwenye Google** wala kwenye watu wanaokufuata — mradi **caption, alt text, hashtag, on-screen text na location tag** vibaki na maneno ya Kiingereza ya kiufundi (`POS`, `web design`, `Dar es Salaam`, `offline-first`).

Hiyo ndiyo hasa strategy yako: **Kiswahili kwa utambulisho na hisia, English kwa utafutaji na technical depth**. Sio tafsiri mara mbili — ni matoleo mawili yenye kazi tofauti [`05-content-system.md`](05-content-system.md).

**Ushauri wangu:** chukua **V1**. Kama leo kipaumbele chako ni *kupatikana kwenye search* kuliko *sauti ya kwetu*, chukua **V2** (iliyokuwa default). Zote ziko hapa chini.

---

## 1. Mambo yaliyowekwa sawa kabla ya variations

| Ulichosema | Jinsi kilivyowekwa |
| --- | --- |
| "Altraware tech ndio brand" | `Altraware Tech` inatumika kwenye name field inapowezekana. **Username `@altrawaretechnology` haibadilishwi** — ni handle iliyopo, thabiti, na name field ina limit ya 30 tu. |
| "hatuja pata domain bado, subdomain tu, tunajitafuta" | Link inabaki **`https://altra.tanzaniareach.com/`**. Hatuijaji "official website", hatubuni `.co.tz`, hatuandiki domain ya kufikirika. Ukishapata domain: **badilisha link moja tu**, mengine yote yanabaki. |
| "email … simu kuna whatsapp bot … ya pili ni mtu" | Zimewekwa wazi kwenye §4: **bot ≠ mtu**, na kila moja ina mahali pake. |
| "Kiswahili ila English ni lugha kubwa haswa kwenye captions" | §5 ina mifano miwili ya caption: Kiswahili yenye keywords za Kiingereza, na Kiingereza cha kiufundi. |

> ⚠️ **Hadi uchague:** [`01-presence-audit.md`](01-presence-audit.md) §4, `studio/data.js`, PDF na Google Doc bado vinatumia **V2** kama default iliyoandikwa wazi. Ukichagua V1/V3/V4, niambie nitasasisha **vyote pamoja** — usiache bio mbili tofauti zikisimama.

---

## 2. Variations 4 (copy-paste)

### V1 — Kiswahili kamili ⭐ ninayokusuggest

**Name field (23/30 chars):**
```
Altraware Tech | Mifumo
```

**Bio (148/150 chars):**
```
Tunatengeneza tovuti, programu na mifumo ya mauzo kwa biashara za kwetu.
Kiswahili kwanza, M-Pesa ndani, hata bila mtandao. Dar es Salaam · Bei wazi
```

| | |
| --- | --- |
| **Sauti** | Joto, la kwetu, mwenye duka Kariakoo analisoma bila kufikiria |
| **Kwa nini** | `Programu` badala ya `app`, `mifumo ya mauzo` badala ya `POS`, `biashara za kwetu` badala ya `TZ`. Kiswahili kamili isipokuwa **jina la brand** na **M-Pesa** (majina yasiyo na tafsiri). |
| **Gharama** | Name field haina `POS` wala `Websites` → search inategemea caption/alt/hashtag/location. Ndiyo maana English inabaki kwenye captions. |
| **Ukitaka neno la bidhaa lionekane** | Badilisha name iwe `Altraware Tech \| Tovuti na POS` (**30/30**), bio ikabaki. |

---

### V2 — Mchanganyiko / search-first *(default ya sasa)*

**Name field (29/30 chars):**
```
Altraware | Websites & POS TZ
```

**Bio (141/150 chars):**
```
Tovuti, app na POS kwa biashara TZ. Kiswahili kwanza, M-Pesa ndani, hata offline.
Dar es Salaam · Bei wazi kwenye link · Mkataba wa maandishi
```

| | |
| --- | --- |
| **Sauti** | Wazi, inatafutika, salama kwa Google |
| **Kwa nini** | `Websites` + `POS` + `TZ` kwenye name field, `Dar es Salaam` kwenye bio. Instagram analinganisha text ya search na usernames, bios, captions, hashtags na places [1](https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works). |
| **Gharama** | Inasikika kidogo kama agency ya Kiingereza; si "yetu" kama V1. |

---

### V3 — Faida POS mbele

**Name field (26/30 chars):**
```
Altraware Tech | Faida POS
```

**Bio (148/150 chars):**
```
Faida POS: mauzo, risiti na stoo hata mtandao ukikatika. Pia tovuti na app
kwa biashara TZ. Kiswahili kwanza, M-Pesa ndani. Dar es Salaam · Bei wazi
```

| | |
| --- | --- |
| **Sauti** | Bidhaa moja wazi, proof mbele |
| **Kwa nini** | Anayetafuta `Faida POS` anakupata moja kwa moja; inaunganisha na carousel `01-offline-first` na Reel ya kwanza. |
| **Gharama** | Studio inaonekana kama kampuni ya POS tu, wakati pia unajenga tovuti, Shule-Altra, loanapp, TabTune. |

---

### V4 — Ujasiri / build in public

**Name field (24/30 chars):**
```
Altraware Tech | DSM, TZ
```

**Bio (133/150 chars):**
```
Hatuna domain yetu. Tuna code, bei wazi na mkataba.
Tovuti, app na POS kwa biashara TZ. Kiswahili kwanza, M-Pesa ndani. Dar es Salaam
```

| | |
| --- | --- |
| **Sauti** | Ukweli mtupu, inastandout sana, haiwezi kuchanganywa na "world-class digital solutions" |
| **Kwa nini** | Inakubali wazi hali ya subdomain. Hii ndiyo tofauti ya kweli dhidi ya output "za kawaida". |
| **Gharama** | Kwa mteja mkubwa anayekutathmini leo, "hatuna domain" inaweza kusoma kama udogo. Inafaa zaidi `@mwijay__davie` au hadhira ya founder. |

---

## 3. Jedwali la kuchagua

| | V1 ⭐ | V2 | V3 | V4 |
| --- | --- | --- | --- | --- |
| Kiswahili kamili | **Ndiyo** | Hapana | Hapana | Hapana |
| Name field | 23/30 | 29/30 | 26/30 | 24/30 |
| Bio | 148/150 | 141/150 | 148/150 | 133/150 |
| Keyword za Kiingereza kwenye name | 0 | 3 | 1 | 0 |
| Inataja Faida POS | Hapana | Hapana | **Ndiyo** | Hapana |
| Inakubali subdomain wazi | Hapana | Hapana | Hapana | **Ndiyo** |
| Salama kwa pitch ya mteja mkubwa | Ndiyo | **Ndiyo** | Ndiyo | Hatari kidogo |
| Inayolingana na strategy yako | **Ndiyo** | Ndiyo | Ndiyo | Ndiyo |

**Uamuzi wangu:** V1 + caption za Kiswahili zenye keywords za Kiingereza. Ukitaka ushahidi wa haraka wa search kabla ya kubadili, chukua V2 kwa wiki 2, kisha uhamie V1 ukiwa na Insights.

---

## 4. Contacts — ziko wazi, bot si mtu

| Kitu | Thamani | Mahali pa kuiweka |
| --- | --- | --- |
| **Email** | `altrawaretechnology@gmail.com` | **Contact button → Email** kwenye profile (si kwenye maandishi ya bio) |
| **WhatsApp bot** | `0790942616` = `+255 790 942 616` | **DM auto-reply / FAQ / Highlight `Maswali` / first comment.** Iandikwe wazi "bot - majibu ya haraka". **Usiiweke kama Call button** – mteja akipiga anapata bot. |
| **Mtu halisi** | `+255 792 867 427` | **Contact button → Call / WhatsApp** inayoonekana kwenye profile. Huyu anajibu bei na mkataba. |

**Routing** (kutoka [`05-content-system.md`](05-content-system.md) §8): maswali ya kibinafsi / collab / automation → bot; mteja wa studio → kusanya (huduma, jina la biashara, WhatsApp) kisha mpelekee **mtu**. Jibu la kwanza halina attachment wala pitch. **Wao wanaanza, wewe unajibu** — hakuna bulk DM.

> Nime-normalize `255 792 867 427` → `+255 792 867 427` na `0790942616` → `+255 790 942 616` (namba ile ile, muundo wa kimataifa). Kama ulikusudia namba tofauti, niambie.
>
> Gmail ni sawa kwa sasa ("tunajitafuta"). Ukishapata domain, tengeneza email ya domain na uibadilishe kwenye Contact button — hiyo ndiyo itakayofanya subdomain ionekane imekomaa.

---

## 5. Kiswahili mbele, English kwenye captions — mifano

**Caption A (Kiswahili + keywords za Kiingereza ndani ya sentensi):**
```
Mtandao ukikatika Kariakoo, risiti 0342 bado inatoka.

Faida POS inarekodi mauzo, inatoa risiti ya thermal na inasasisha stoo
hata bila internet. Muunganisho ukirudi, M-Pesa na stoo vina-sync chenyewe.
Offline-first POS for Tanzanian shops, si demo.

Comment POS, tutakutumia demo.

#FaidaPOS #BiasharaTanzania #Altraware
```

**Caption B (Kiingereza kwa technical depth / hadhira ya nje):**
```
Stop building cloud-first apps for Kariakoo. Build the queue first.

A Flutter POS writes the sale locally, prints the thermal receipt, then syncs
when the connection returns. Real code:
faida.checkout({ items, pay: "M-PESA", lang: "sw" })

Comment CODE
#POSSoftware #DarEsSalaam #BuildInPublic
```

Kanuni: **mstari wa kwanza Kiswahili (hisia / eneo / tatizo), mstari wa kiufundi English (utafutaji / ushahidi), CTA moja.** Usitafsiri caption yote mara mbili — zote mbili zinakuwa mbaya.

---

## 6. Settings zinazobaki (hazibadiliki kwa variation yoyote)

Hata ukichagua ipi, hizi ni zile zile kutoka [`07-ig-setup.md`](07-ig-setup.md):

1. Professional → **Business**, public.
2. **Search-engine indexing ON** (`Settings → Privacy → "Allow public photos and videos to appear in search engine results"`) — tangu 10 Jul 2025, public professional 18+ ina-indexiwa na Google by default [2](https://help.instagram.com/147542625391305/).
3. **Account Status** safi kabla ya post.
4. **2FA kwa authenticator app**, revoke `Apps and Websites`, angalia sessions — kabla ya content.
5. Category ionekane (`Software Company`), profile photo = logo kwenye navy `#071022`.
6. Hashtag **3–5** kwenye caption (cap = 5 tangu 18 Des 2025), alt text kila picha, location tag `Dar es Salaam`.
7. Pinned 3: `01-offline-first`, `03-bei-wazi`, `05-wiki-1-hadi-uzinduzi`. Highlights: `Bei`, `Faida POS`, `Kazi`, `Mchakato`, `Maswali`.

---

## 7. Vyanzo

- [1] Instagram / Adam Mosseri, *Breaking Down How Instagram Search Works* (2021) — https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works
- [2] Instagram Help, *Why search engines might index public Instagram photos and videos* — https://help.instagram.com/147542625391305/
- [3] Instagram Help, *About professional accounts* — https://help.instagram.com/138925576505882/
- [4] `strategies/docs/05-content-engine.md` — "Kiswahili kwa hisia, English kwa technical depth" — https://github.com/mwijay12/strategies/blob/main/docs/05-content-engine.md
- [5] Maelezo kamili ya settings/SEO/recovery: [`07-ig-setup.md`](07-ig-setup.md) §9

**Bado NEEDS_INPUT:** ① variation uliyochagua (nitasasisha 01 + studio + PDF + Doc pamoja), ② maneno halisi ya IG Search suggestions DSM, ③ uamuzi wa migongano 5 kwenye `01-presence-audit.md` §5, ④ kama namba ya pili ilikuwa tofauti na `+255 792 867 427`.
