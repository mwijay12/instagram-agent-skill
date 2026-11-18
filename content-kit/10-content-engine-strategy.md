# Content engine strategy — Mwijay Davie × Altraware Technologies

**Status:** strategy draft for owner approval, 17 Nov 2026. Owner confirmed handle, LinkedIn URLs, public phone and logo the same day; **V3 clean Reel** chosen, rendered at 60fps and shared on Drive for review: https://drive.google.com/file/d/1Jrg3m4hNYXLjbwgI8r9ZX9AwWmvYQNW3/view?usp=drivesdk. Nothing here has been posted.
**Source of truth:** `content-kit/09-decisions.md` overrides any conflicting copy on live sites.  
**Owner's brief:** tech business, IT, AI, vibe coding, money-making online; **Kiswahili + English**; programmatic video skills; clean motion graphics; IG carousels; LinkedIn; trends/real data; 15 live/demo systems as proof; agent prepares content, owner approves/posts.

---

## 1. What we are actually building

Not "one nicer Reel". We are building a repeatable **content engine**:

> research → one true idea → bilingual script → scored hooks → caption → carousel/video → clean motion render → QA → Drive handoff → owner posts → metrics log → next iteration.

The engine has two voices:

| Voice | Account | Job |
| --- | --- | --- |
| **Mwijay Davie / founder** | `mwijay__davie` + LinkedIn | Build-in-public, vibe coding, AI agents, lessons, money-making online, honest founder journey |
| **Altraware Technologies / studio** | Altraware IG + `https://altra.tanzaniareach.com/` | Product proof, systems, pricing, client education, Tanzanian business reality |

GitHub `Mwijay12` and `mwijaydavie` are proof-of-work sources, not the posting voice. `mwijaydavie` exists and has repos including `instagram-agent-skill`, `video-use`, `studio`, `rs-dsm`, `motorbike`, `mwijay__davie`.

## 2. What I verified, not invented

### Identity and company

- Public GitHub profile says: **"Hi, I'm Mwijay Davie — Co-Founder at Altraware Technologies, Website Developer, and Digital Smart Systems Specialist from Tanzania."** It lists RoadSafety_Dar, Mwijay Music App, uautconnect and tanzaniareach.com [1](https://github.com/mwijay12/mwijay12).
- `mwijay12/altraware-tech` describes a Dar es Salaam studio building websites, web/mobile apps and business systems for shops, schools, clinics, care centres and NGOs, in **Kiswahili & English** [2](https://github.com/mwijay12/altraware-tech).
- `mwijay12/strategies` is explicitly a playbook for Altraware: n8n, AI agents, **content engine**, client acquisition, 90-day roadmap [3](https://github.com/mwijay12/strategies).
- `mwijay12/altraware-technology` describes an "enterprise digital studio & client operating system" with Faida POS, CareTrack, pricing estimator, client portal and admin console [4](https://github.com/mwijay12/altraware-technology).
- Another repo references **David Erick Mwijage / David Mwijage** and co-founder **Clemence Ng'unda**; I will use **Mwijay Davie** as the preferred public name unless you say otherwise [5](https://github.com/mwijay12/daviecode).

### Sites fetched

- `https://altra.tanzaniareach.com/` loaded and returned the logo, navigation, services, platforms, pricing, impact, blog and contact sections. It is the approved link. **Do not call it "official website".**
- `https://mwijay.ct.ws/` loaded as the **Avocado Farmers Njombe demo**. Owner confirmed it is a demo. Its "0+ growers / 0 orchards" counters and placeholder stock photos must not be used as proof.

### Important conflict: site copy vs owner decisions

The live Altraware site currently shows copy that conflicts with `09-decisions.md`:

| Site shows | Canonical decision |
| --- | --- |
| `Rooted at home. Built for the world.` | `Built in Tanzania, for how Tanzania really works.` |
| `TSH 350K / 550K / 750K` | Web Starter 350k, Growth 550k, **Custom kuanzia 800k**; 750K tier removed |
| `Neema Mwakalinga` testimonial, `0%`, `0`, `0/7` counters | No invented testimonials, clients or self-claimed metrics |
| `Works on 2G / offline`, `offline-first` as general site claim | `offline-first, cloud-synced` belongs to **Faida POS**, not websites in general |
| `M-Pesa Ready`, `2G ready` style claims | Do not reuse until measured/approved |

**Rule:** when preparing posts, use `09-decisions.md` and the project registry, not scraped marketing copy. If you want the site to match, that is a separate site-update task.

### Drive reference video

The link `https://drive.google.com/file/d/1S-DgN0qHFeRApDUJW6mLFRA822ylAuWe/view?usp=drive_link` currently resolves to a Google sign-in page, and the file ID was not found in the connected Drive account. Please share it with the connected account or make it link-public if you want me to study it. I have **not** claimed to have watched it.

### What I cannot do yet

- I can fetch page text and main image URLs with `fetch_page`, but there is no browser screenshot tool here. For real UI screenshots, either upload them, or approve using the page's existing hero/product images as stills.
- IG search suggestions, insights, follower quality and retention need owner-side access and 10–30 posted items. No invented numbers.

## 3. Language strategy

Use **paired variants**, not one mixed paragraph:

| Layer | Kiswahili | English |
| --- | --- | --- |
| Hook | Local trust, everyday business language | Regional/B2B reach, LinkedIn |
| Technical terms | Keep `API`, `POS`, `AI`, `vibe coding`, `Next.js` | Same |
| Caption | One clear ask | One clear ask |
| On-screen text | Short, one idea per frame | Same layout, swapped text layer |

Default: **Kiswahili-first for IG/Tanzania**, **English-first for LinkedIn**, and publish both when a post performs. Because Remotion draws text from JSON, one composition can render SW and EN from the same frame-driven timeline.

## 4. Content pillars

| # | Pillar | Owner voice | Proof source |
| --- | --- | --- | --- |
| 1 | **Build in public / founder journey** | Mwijay | `MwijayNoteApp`, `Portfolio`, `strategies`, GitHub repos |
| 2 | **Vibe coding & AI agents** | Mwijay | `instagram-agent-skill`, `video-use`, `hyperframes`, Context7, MCP |
| 3 | **Systems that solve Tanzanian problems** | Altraware | Faida POS, CareTrack, RoadSafety_Dar, uautconnect, Avocado demo |
| 4 | **Product/UI craft** | Altraware | audenic, Nike Tz, Bongo Foodie, Nyama TZ, Quickopia, AymiAfrica |
| 5 | **Money-making online / digital offers** | Mwijay + Altraware | `09-decisions.md` pricing, portfolio, Care Plan |
| 6 | **Motion-graphics craft** | Both | Remotion renders, clean plates, SVG elements, QA receipts |

Project registry: `content-kit/data/projects.json` (15 projects, URLs normalised, demo/in-development flagged). Channel registry: `content-kit/data/channels.json`.

## 5. Channel plan

| Channel | Handle / URL | Cadence pilot | Format |
| --- | --- | --- | --- |
| IG personal | `mwijay__davie` | 2×/week | Reel + carousel, SW+EN |
| IG Altraware | **`@altrawaretechnology`** — confirmed by owner | 1×/week | Product proof Reel / carousel |
| LinkedIn personal | https://www.linkedin.com/in/mwijay-davie/ | 1×/week | English text + 1 screenshot/diagram |
| LinkedIn company | https://www.linkedin.com/company/altraware-technology/posts/?viewAsMember=true | as needed | Company updates / proof |
| Public phone | `0790942616` | as needed | Reel credits / captions |
| GitHub | `Mwijay12`, `mwijaydavie` | as shipped | README / repo as proof |
| Site | `https://altra.tanzaniareach.com/` | canonical link | Not "official website" |

Low follower count changes the goal: optimise for **saves, sends, profile visits, qualified comments**, not views. Use `content-kit/log-template.md` after each post; decide at post 10 and post 30.

## 6. Skills and engine stack

Use **programmatic video**, never a text-to-video model for code, glyphs, numbers or logo.

| Need | Primary | Support skills / repos |
| --- | --- | --- |
| React layouts, audio-synced captions, current reel | **Remotion 4.0.544** | `remotion-dev/remotion` |
| Sequential code diffs, node graphs, `yield*` | Motion Canvas / Revideo | `motion-canvas/motion-canvas`, `redotvideo/revideo` |
| Algorithms, networking, math explainers | Manim + MCP | `ManimCommunity/manim`, `abhiemj/manim-mcp-server`, `manim-mcp` |
| Existing GSAP HTML at 60fps | Timecut | `tungs/timecut` |
| HTML-to-video agent workflow | HyperFrames | `heygen-com/hyperframes` |
| Voice/TTS/caption automation research | AI Content Studio, HyperFrames media-use skills | `naqashafzal/AI-Content-Studio` |
| Motion critique and gates | motionmaxxing | `Tejashmakwana/motionmaxxing` |
| Launch-grade motion prompts | Charlie Hills pack | `charlie947/motion-graphics-skills` |
| B-roll, explainers, SFX licensing | Barty-Bart pack | `Barty-Bart/motion-graphics` |
| Captions | `rediumvex/social-media-caption-generator-claude` | plus our `skills/ig-caption` |
| IG carousels | `DennisWei9898/social-cards-engine` | plus our `skills/ig-carousel` |
| Research/trends | `ScrapeCreators/social-media-research-skills`, `blacktwist/social-media-skills` | plus `web_search` |
| Agent coding discipline | `multica-ai/andrej-karpathy-skills` | plus `upstash/context7`, `modelcontextprotocol/servers` |

GitHub metadata was checked on 17 Nov 2026 via `gh api`; star counts are snapshots, not proof of quality. `ffmpeg-mcp@0.0.3` already ran here; `manim-mcp@0.1.1` and `@motion-canvas/*` are installed but have not rendered. Context7/Smithery/Cursor Directory were **not** connected; do not claim live docs were pulled.

## 7. Visual direction — the fix you asked for

Your verdict: **"nzuri ilaa, but background so busy, si clean."** Accepted. The attached frames at 10s and 15s show strong type over high-frequency line art; the text still reads but the frame is noisy.

New hard rule: **clean background, one hero, readable first.**

- Use flat/low-frequency grounds: `content-kit/code-video/plates/11-clean-navy.png` and `12-clean-paper.png` were generated for this.
- Put motion in **separate SVG/PNG elements**, not behind the words: `content-kit/code-video/elements/*.svg`.
- One hero per frame; at most 3 focal objects; every text block gets a quiet safe zone.
- No page chrome: no HUD, timecodes, progress bars, stat walls, fake dashboards or invented names/numbers. One quiet brand/kicker line and a metaphorical phone frame are allowed; no full-frame busy art behind copy.
- Generated images may be texture or isolated elements only — **never text or logo**.
- All letters, code, numbers, captions and timing come from deterministic render.
- Spec: 1080×1920 vertical, **60fps rendered** for V3, dark `#071022` / paper `#f7f6f2`, gold `#eab308`, violet `#7c3aed`, Fraunces / Inter / JetBrains Mono.
- Frame-driven only: `useCurrentFrame()`, `spring({damping:14,stiffness:120,mass:0.8})`, `interpolate()` with both clamps. No CSS transitions, `setTimeout`, `requestAnimationFrame`.
- 3-second rule: no static frame > 180 frames at 60fps. Camera zoom `1.0→1.35`, stagger 3–5 frames, cut on motion.
- Code: line-by-line focus at 25% dim / 100% active, token morph 0.6–0.9s, Shiki or deterministic spans, tabular numerals.
- Gates: motionmaxxing G0/G2/G3/G5 scripted; G1/G4 by eye on contact sheet; **add G6 = background readability**, human check. No self-certification.

Full spec: `content-kit/code-video/VISUAL-SYSTEM.md`. Skill law: `skills/tech-video-motion-graphics/SKILL.md`.

## 8. Trend and real-data policy

1. Use `web_search` / research skills to find a trend, then **cite the source**.
2. Separate "third-party claim" from "our proof". A blog statistic is not Altraware proof.
3. Never invent metrics, clients, testimonials, domains, uptime, Lighthouse scores or revenue.
4. Real proof = repo path, live URL, owner decision, screenshot you supply, or measured post log.
5. Owner approves before any number appears on screen.

2026 search results consistently point to short-form vertical video, founder-led authenticity, AI-assisted production and repurposing as themes [6](https://www.thethunderclap.com/blog/top-video-marketing-trends) [7](https://blog.mean.ceo/short-form-video-marketing-trends-september-2026/). Treat those as direction, not as our numbers.

## 9. 30-day pilot — 12 posts

| Week | # | Pillar | Project / source | Format | Lang |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | Founder | `mwijay12/mwijay12` + `strategies` | Reel "who I am + what we build" | SW |
| 1 | 2 | Motion craft | clean plates + SVG elements | Carousel "why code-to-video" | EN |
| 1 | 3 | Pricing | `09-decisions.md` | Carousel "bei za kuanzia" | SW+EN |
| 2 | 4 | Systems | Faida POS | Reel "offline-first, cloud-synced POS" | SW |
| 2 | 5 | Impact | CareTrack | Carousel "kumbukumbu za vituo" | SW+EN |
| 2 | 6 | Founder | `MwijayNoteApp` | LinkedIn text + diagram | EN |
| 3 | 7 | Vibe coding | `instagram-agent-skill`, `video-use` | Reel "AI agent skills" | EN |
| 3 | 8 | Product | Quickopia / Bongo Foodie | Carousel "3 screens, 1 flow" | SW+EN |
| 3 | 9 | Data | RoadSafety_Dar | LinkedIn "data analytics in Dar" | EN |
| 4 | 10 | Client proof | AymiAfrica / Portfolio | Reel "real site, real scope" | SW+EN |
| 4 | 11 | AgriTech demo | Avocado Farmers | Carousel "demo, not proof" | SW |
| 4 | 12 | Offer | Altraware services | Reel + CTA `Comment neno TOVUTI` | SW+EN |

After post 10: review `views, reach, saves, sends, profile visits, hold@3s`. After post 30: double down on the top two pillars.

## 10. Workflow I will run for you

1. Read `09-decisions.md`, `data/projects.json`, `data/channels.json`, `data/brand-profile.json`.
2. Pick one project + one pillar + one true claim.
3. Research trend/source if needed; cite it.
4. Write SW + EN script, 3 hooks each, run `hookscore.py`.
5. Write caption, run `caption.py`, `detect.py`, `humanize.py`; say REVIEW honestly.
6. Build carousel outline or Remotion beat map from JSON.
7. Render a **keyframe still first**, look at it, then render MP4.
8. Validate `esbuild`/JSON, `ffprobe`, full decode, contact sheet, G0–G6.
9. Upload to Drive with `anyoneWithLink reader`, save link in `samples/*-drive-links.md`.
10. Hand off script/caption/carousel/video. **Owner adds music, edits, posts.** No auto-DM, bot, credentials or account changes.

## 11. Owner confirmations and open items — updated 17 Nov 2026

| Item | Status |
| --- | --- |
| Altraware IG handle | **Confirmed:** `@altrawaretechnology` |
| LinkedIn | **Confirmed:** personal `https://www.linkedin.com/in/mwijay-davie/`; company `https://www.linkedin.com/company/altraware-technology/posts/?viewAsMember=true` |
| Public phone | **Confirmed:** `0790942616` for content/credits; human `+255 792 867 427` stays internal |
| Logo | **Confirmed:** `final_poster_1.png` = `content-kit/assets/altraware-logo.png`, SHA-256 `72981d16…` |
| Site copy | **Continue** with `09-decisions.md` as source of truth; site update deferred |
| Drive reference video | Still not accessible; share with connected account / public link |
| Screenshots | Still owner-supplied; no browser screenshot tool here |
| Cadence | **Assumed** 3 posts/week pilot; owner said "endelea" |
| First deliverable | **Done:** V3 clean Reel rendered, QA G0–G6 recorded, Drive review link shared; owner approval pending |

---

### Sources

1. https://github.com/mwijay12/mwijay12  
2. https://github.com/mwijay12/altraware-tech  
3. https://github.com/mwijay12/strategies  
4. https://github.com/mwijay12/altraware-technology  
5. https://github.com/mwijay12/daviecode  
6. https://www.thethunderclap.com/blog/top-video-marketing-trends  
7. https://blog.mean.ceo/short-form-video-marketing-trends-september-2026/  
8. User-provided repos: https://github.com/Tejashmakwana/motionmaxxing · https://github.com/charlie947/motion-graphics-skills · https://github.com/Barty-Bart/motion-graphics · https://github.com/heygen-com/hyperframes · https://github.com/naqashafzal/AI-Content-Studio · https://github.com/rediumvex/social-media-caption-generator-claude · https://github.com/DennisWei9898/social-cards-engine · https://github.com/multica-ai/andrej-karpathy-skills · https://github.com/ScrapeCreators/social-media-research-skills · https://github.com/blacktwist/social-media-skills

## 11. V4 revision status — 18 Nov 2026

`anza na reel sawa` ilileta V3 kwanza; baada ya mmiliki kuona dark frames, **V4 short white Reel** ndiyo revision inayofanyiwa kazi sasa, si batch pana zaidi. V4 ina `<25s`, white-dominant/sun-readable ground, slower masculine TTS trial, bei kwa maneno ya Kiswahili, na `kufahamu kazi` / `mahitaji yako` badala ya neno la Kiingereza la kupanga kazi. V2/V3 ni nakala za awali za review. Mmiliki bado hajaidhinisha; anaongeza music/SFX, final edit, anapost mwenyewe na kurekodi insights. Hakuna site-copy edit, Docs/Vercel work, live posting, DM wala bot.
