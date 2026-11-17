# `log.md` — template ya historia ya post

> Nakili faili hii kwenda `~/.claude/instagram/log.md` (au weka kwenye notes zako).
> Skills `/ig-viral`, `/ig-audit`, `/ig-plan` zinasoma historia hii. Bila hiyo,
> kila "algorithm imebadilika" ni dhana, si kipimo.
> **Usiweke password, 2FA code, wala token yoyote kwenye log hii.**

## Kwa nini

Akaunti ya studio ilianza na followers 5. Kwa akaunti ndogo, **outlier multiple**
(post yako ikilinganishwa na median yako mwenyewe) ni muhimu zaidi kuliko raw
views au follower count. Unahitaji angalau safu **10–30** kabla ya kufanya
maamuzi. Hadi hapo: post tu, jaza log, usibadilishe muda wa kupost kutafuta
sababu ya views kidogo.

## Safu moja kwa kila post

```
| tarehe | akaunti | deck/prompt | format | hook id | mstari wa kwanza | keyword | views | reach | saves | sends | hold@3s | follows | DM halisi | nilichojifunza |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-11-18 | @altrawaretechnology | 01-offline-first | carousel | #18 | Mtandao ukikatika Kariakoo... | POS |  |  |  |  |  |  |  |  |
```

## Machache ya kuandika mara moja baada ya kupost

- **Tarehe + saa** (EAT).
- **Akaunti**: `@mwijay__davie` au `@altrawaretechnology`.
- **Chanzo**: `carousels/decks/<id>.json` au `code-video/scenes.json#<scene-id>`.
- **Hook formula id** kutoka `skills/ig-reel/hooks.json` (kwa Reel) au kichwa cha cover (kwa carousel).
- **Mstari wa kwanza kamili** — ndiyo kitu kinacholinganishwa na `hookscore.py`.
- **Keyword MOJA** tu (`POS`, `BEI`, `MKATABA`, `AUDIT`, `CODE`, `PROMPT`, `LUGHA`).
- **Utakapopata Insights** (baada ya 48h na baada ya siku 7): views, reach, saves, sends, hold@3s / average watch time, follows kutoka kwenye post hiyo, na idadi ya DM zilizoanza na mteja.
- **Sentensi moja tu ya kujifunza**, kwa lugha yako: "watu wali-save slide ya bei", "hawakusoma slide 6", "DM ilikuja baada ya first comment", n.k.

## Usiandike

- ❌ "Algorithm ilinikataa" bila namba.
- ❌ Follower count kama kipimo cha mafanikio.
- ❌ Namba za kubuni ili safu ionekane imejaa. Ukikosa Insights, acha tupu.
- ❌ Majina ya wateja / NIDA / IMEI / data ya mgonjwa au mwanafunzi.
- ❌ Password, backup codes, recovery codes, Meta/IG tokens, au "jinsi ya kurejesha account ya zamani" (hizi ni za notepad yako binafsi, si log ya content).

## Baada ya safu 10

```bash
# Kutoka root ya repo
python3 skills/ig-viral/swipe.py --help        # angalia jinsi inavyosoma log
# Kisha /ig-audit na /ig-plan vitakuwa na evidence yako, si defaults zangu.
```

Ukishapata safu 10–30, nitumie (bila data binafsi ya wateja) nitaendesha
`/ig-audit`, kurekebisha pillars kwenye `05-content-system.md`, na kusasisha
`06-30-day-plan.md` kwa kile **account yako** ilichoonyesha, si kile blogu
ilichosema kuhusu "2026 algorithm".
