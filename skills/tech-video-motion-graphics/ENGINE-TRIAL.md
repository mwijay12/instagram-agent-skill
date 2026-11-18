# Strong engine trial — evidence

This note records what actually ran while rebuilding the websites reel with a code-driven motion engine. It is evidence for `scenes-websites-v2.json`, not a claim that every listed package produced a video.

## Rendered the deliverable

| Engine | Version | What ran | Result |
|---|---|---|---|
| Remotion + React | 4.0.544 / 18.3.1 | `bundle`, `getCompositions`, `renderStill`, `renderMedia` via `scripts/render-remotion.mjs` | Corrected `05-altraware-websites-v2.mp4`, poster, and render manifest |
| Chromium | 153.0.8010.0 | `@sparticuz/chromium` headless-shell, Puppeteer smoke | Launch OK; `/tmp/chromium-smoke.png` 22,111 bytes |
| Remotion compositor | ffmpeg n7.1 / ffprobe | H.264 + AAC stitch and validation | 1080 frames, 36.011 s, full decode exit 0 |

Environment notes: the sandbox had no system browser or ffmpeg. Chromium was force-extracted from the npm tarball to `/tmp/chromium`; AL2023 NSS/NSPR libs were extracted to `/tmp/al2023/lib`; brand TTFs were exposed through `/tmp/fonts/fonts.conf`. `node_modules/` and `dist/remotion/` are gitignored and were reinstalled/rebundled after the workspace snapshot reload.

## MCP trial

`ffmpeg-mcp@0.0.3` was started over stdio with the MCP SDK. `listTools` returned `speed_up` and `extract_audio`; `extract_audio` wrote `/tmp/mcp-websites-audio.mp3` (281,043 bytes). This is the only MCP server that was executed. No Smithery, Context7, Cursor Directory, `llms.txt`, or general MCP server integration is claimed.

## Packages inspected / prepared but not rendered

| Package / file | State |
|---|---|
| `timecut@0.3.3` + `scripts/timecut-demo.html`, `scripts/test-timecut.mjs` | Written; CLI demo not executed |
| `@revideo/*@0.11.0` + `revideo-project.tsx`, `scripts/test-revideo.mjs` | Written; direct renderer test not executed |
| `@motion-canvas/*@3.17.2`, `@motion-canvas/vite-plugin@3.17.2`, `motion-canvas-project.tsx` | Installed and project file written; no Motion Canvas render |
| `manim-mcp@0.1.1` | Installed and `dist/server.js` inspected; not run. It expects Python/Manim/voiceover/LaTeX/ffmpeg setup |
| `@ffmpeg-installer/linux-x64/ffmpeg` | Available locally; used as an ffmpeg path option |

`package.json` scripts `revideo:test` and `timecut:test` point at the actual `scripts/test-*.mjs` files. `render_websites.py` remains the deterministic Pillow + ffmpeg fallback, not a Remotion/Motion Canvas clone.

## Not done

No live Instagram posting, DMs, auto-DM/bot, credentials, account changes, Drive/Docs/Vercel work for this v2 cut, music/SFX, or owner-side final edit. TTS is the only audio track; the owner adds music in the editor.
