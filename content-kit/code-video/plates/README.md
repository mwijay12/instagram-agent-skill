# Plates — texture tu, si maandishi

Picha 3 zilizotengenezwa 18 Nov 2026 kwa ajili ya `render_reel_v2.py`:

| Faili | Ilivyoombwa | Inatumika wapi |
| --- | --- | --- |
| `01-duka.png` | kaunta ya duka jioni, mwanga joto, navy, **bila watu/skrini/maandishi** | beat 1 (hook) |
| `02-contour.png` | contour mistari ya pwani, navy + violet + gold dot, **bila maandishi/namba** | beat 3 (code) |
| `03-risiti.png` | karatasi tupu ya risiti, macro, **bila printing/barcode/namba** | beat 4 (risiti) |

**Kanuni:** picha hizi ni *plates*. Zinatiwa giza kwa `navy #071022` na kupitishiwa contour ya brand kabla ya chochote kuandikwa. Herufi zote, mistari ya code, `TZS 15,000`, `RISITI 0342`, `SYNCED` na captions vinachorwa na **Pillow** kwa `.ttf` halisi kwenye `../assets/fonts/`. Hakuna modeli iliyoomba kuandika code wala namba.

Ukibadilisha picha, weka majina haya au hariri `prepare_plates()` kwenye `render_reel_v2.py`. Ukizifuta, tumia `--no-plates` (contour za code tu zinatosha).

Picha si ushahidi wa duka, risiti wala mteja yeyote halisi. Ni texture ya kuondoa "generic gradient" bila kuvunja sheria ya ukweli.

## V3 clean plates and isolated PNG elements — 18 Nov 2026

| Faili | Aina | Matumizi |
| --- | --- | --- |
| `11-clean-navy.png` | clean low-frequency navy plate | V3 dark beats (hook, language, code, CTA) |
| `12-clean-paper.png` | clean low-frequency paper plate | V3 light beats (questions, prices) |
| `13-gold-orb.png` | isolated AI PNG element | low-opacity glow fragment only, no text/logo |
| `14-violet-ribbon.png` | isolated AI PNG element | low-opacity cropped fragment only, no text/logo |

**Kanuni ya V3:** BG iwe clean na isomeke vizuri. Plates `07`–`10` hazitumiki kamili nyuma ya maandishi; zinaweza kuwa cropped/low-opacity fragments tu. Herufi zote, code, namba, captions, timing na logo vinachorwa na Remotion/React/SVG, si na modeli ya picha. Angalia [`../VISUAL-SYSTEM.md`](../VISUAL-SYSTEM.md) na [`../QA-websites-v3.md`](../QA-websites-v3.md).

## V4 white-dominant plates and ink elements — 18 Nov 2026

| Faili | Aina | Matumizi |
| --- | --- | --- |
| `15-clean-white.png` | clean low-frequency white plate | V4 dominant background |
| `16-white-gold-orb.png` | isolated white/gold AI PNG element | low-opacity accent only |
| `17-white-violet-ribbon.png` | isolated white/violet AI PNG element | low-opacity accent only |
| `phone-frame-ink.svg`, `code-brackets-ink.svg`, `signal-arc-ink.svg`, `node-graph-ink.svg` | deterministic ink SVGs | one hero per beat, no text/logo from AI |

**Kanuni ya V4:** baada ya mmiliki kuona frames za V3 zenye dark, white ndiyo inayotawala ili maandishi yasomeke hata kwenye jua kali. Dark inabaki tu kama ink ya maandishi, chips, kicker na CTA; hakuna full-frame dark theme. Plates `11`–`14` ni za historia ya V3. Bei zimeandikwa kwa maneno (`laki tatu na nusu`, `laki tano na nusu`, `laki nane`, `elfu tisini na tisa`) na neno la Kiingereza la kupanga kazi limebadilishwa na `kufahamu kazi` / `mahitaji yako`. Angalia [`../VISUAL-SYSTEM.md`](../VISUAL-SYSTEM.md) na [`../QA-websites-v4.md`](../QA-websites-v4.md).
