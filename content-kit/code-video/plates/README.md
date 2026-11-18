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
