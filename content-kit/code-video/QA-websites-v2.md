# QA — Altraware Websites V2 (corrected final render)

**Status:** `CODE-VIDEO READY` for owner review. The corrected MP4 has been rendered, validated, and uploaded to Google Drive with `anyoneWithLink reader` access; it has **not** been posted to Instagram, converted to Docs, deployed to Vercel, or sent to anyone. Music/SFX, final edit, and publishing remain owner-side.

**Source of truth:** `content-kit/09-decisions.md` and the same-websites scene source `skills/tech-video-motion-graphics/scenes-websites.json`.

## Corrections applied (17 Nov 2026)

1. **`offline-first, cloud-synced` is Faida POS only.**  
   The websites reel no longer says a general website works offline and syncs to the cloud. Beat 4 was rebuilt from the real artifact `content-kit/present/site/index.html`:
   - `html lang="sw"`
   - viewport for mobile: `width=device-width`
   - branded `<title>`
   - on-screen: `REAL CODE · SIMU KWANZA` / `TOVUTI SI PICHA TU`
   - voice/caption: `Tovuti si picha tu. HTML lang ni sw, viewport ya simu, na title yenye brand.`

2. **Ownership uses the exact owner decision.**  
   Replaced `Unamiliki domain, faili na content.` with:
   > `Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.`

   No invented domain ownership claim remains. `https://altra.tanzaniareach.com/` is kept as the approved link and is **not** called an “official website”.

3. The corrected Swahili was regenerated for TTS clips `v2-04-real-code.wav` and `v2-06-cta.wav`, the 36.0 s composite WAV was rebuilt, and `remotion/timeline.json`, the script, caption, scene manifest, JSX, and render receipt were updated together.

## Outputs

| File | Result |
|---|---|
| `content-kit/code-video/samples/05-altraware-websites-v2.mp4` | 7,303,730 bytes · 36.011 s · 1080×1920 · 30 fps |
| Drive copy of the same MP4 | https://drive.google.com/file/d/1v8W6RpPCdiiLXZY-0nje_94tKcek54ba/view?usp=drivesdk · `anyoneWithLink reader` · 7,303,730 bytes |
| `content-kit/code-video/samples/05-contact-sheet.jpg` | 289,803 bytes · frames at 1, 5, 10, 15, 20, 25, 30, 32, 35.5 s |
| `content-kit/code-video/samples/05-altraware-websites-v2-poster.png` | 1,812,717 bytes · still at frame 30 |
| `content-kit/code-video/samples/05-render-manifest.json` | Render receipt with `corrections` and `guards` |
| `content-kit/code-video/audio/voiceover-websites-v2.wav` | 3,456,044 bytes · 36.0 s · 48 kHz mono · voice-00 TTS at `atempo=1.7` |
| `content-kit/code-video/audio/v2-timeline.json` | Clip starts/ends and corrected `text_sw` |
| `content-kit/code-video/websites-script-v2.txt` | Corrected 6-line script |
| `content-kit/code-video/websites-caption-v2.txt` | Corrected caption |
| `skills/tech-video-motion-graphics/scenes-websites-v2.json` | Corrected claim, beats, guard, and `corrections` field |

## Technical validation

- `esbuild` bundle parse of `remotion/WebsitesV2.jsx`: **OK**.
- JSON parse of scene manifest, Remotion timeline, and audio timeline: **OK**.
- `ffprobe`: H.264 `yuvj420p` 1080×1920 `30/1`, **1080** video frames; AAC 48 kHz 2 ch, **1690** audio frames; duration `36.011000`; bitrate `1622555`.
- Full `ffmpeg -v error -i … -f null -` decode: **exit 0**, no errors.
- `REMOTION_TRIAL_OK` from the corrected render: 1080 frames rendered and encoded.
- Human visual check: contact sheet plus full frames at **15 s** and **30 s** were viewed. Corrected Beat 4 code chips and the full ownership sentence are readable; CTA frames keep continuous drift, ghost `TOVUTI`, and the gold/violet sweep. No page chrome, progress bar, or AI-drawn text/logo.

## QA scripts

Outputs are in `content-kit/qa/websites-v2-*.out`.

| Check | Result |
|---|---|
| `hookscore.py` | Top `80.0 STRONG`; chosen hook `78.6 STRONG`; third `37.8 WEAK` |
| `caption.py` | **READY** · 673/2200 chars · 3 hashtags · 1 ask · 3/3 search terms |
| `beats.py --target 36` | **REVIEW** · 104 words · ~37.8 s at 165 wpm; flags long spoken beats and no loop |
| `detect.py` | **REVIEW** · 66.5 · weakest signal VOICE 40.2 |
| `humanize.py` | Printed normalized caption; no structural tells |

`beats.py` reads the script at natural 165 wpm and does not see the 1.7× TTS tempo or the six React beat sequences. `detect.py` is calibrated for English and normally returns REVIEW on clean Swahili. These are recorded, not self-certified as PASS. G1/G4 remain human/owner review.

## Guards verified

- No `100%`, `95+ Lighthouse`, `<2s on 2G`, `0.8s`, `10x`, `99.98%`, invented metrics, clients, testimonials, or invented domains.
- Prices are **starting prices**: Web Starter TSh 350,000 · Growth TSh 550,000 · Custom kuanzia TSh 800,000; full price after scope.
- `Care Plan TSh 99,000/mwezi` is a **separate service, not SaaS**.
- Tagline exact: `Built in Tanzania, for how Tanzania really works.`
- CTA exact: `Comment neno TOVUTI`.
- No auto-DM, bot, live IG posting, DMs, credentials, or account changes.

## Owner-side pending

- Confirm the purple-cloud asset in `content-kit/assets/altraware-logo.png` is the approved logo.
- Check the bot/human phone numbers before publishing.
- Add music/SFX and make the final edit in the editor.
- Publish manually; no scheduling or automation was performed.
