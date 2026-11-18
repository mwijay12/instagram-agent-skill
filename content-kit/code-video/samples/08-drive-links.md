# 08 — business-tip-v1 Drive handoff (PENDING)

The MP4 + contact sheet are rendered and committed locally, but the Google Drive
connector calls failed across two turns: every call carrying a nested `input` object
(`search_files`, `get_file`, `upload_file`, `make_public`) arrived at the connector
with the arguments stripped, so no upload was executed. `validate_credential` and
`list_files` (no required args) DID succeed, so credentials are fine — this is a
platform transport bug, not an auth problem. No Drive file exists yet for
`08-altraware-business-tip-v1`.

Local sources (committed):

- Video: `content-kit/code-video/samples/08-altraware-business-tip-v1.mp4` (3,636,558 bytes, H.264 1080×1920 @60fps, 22.0s, AAC 48kHz)
- Contact sheet: `content-kit/code-video/samples/08-mp4-contact-sheet.jpg`
- Poster: `content-kit/code-video/samples/08-altraware-business-tip-v1-poster.png`
- Still sheet: `content-kit/code-video/samples/08-contact-sheet.png`

Retry plan (agent): `google_drive.upload_file` for the MP4 and JPG, then
`make_public` (`anyoneWithLink` reader, `allowFileDiscovery=false`), `get_file`
verify, then fill the links below and update `08-render-manifest.json` → `drive`.

| file | drive id | view link | direct link | status |
| --- | --- | --- | --- | --- |
| 08-altraware-business-tip-v1.mp4 | PENDING | PENDING | PENDING | upload failed across 2 turns (connector strips nested arguments) |
| 08-mp4-contact-sheet.jpg | PENDING | PENDING | PENDING | upload failed across 2 turns (connector strips nested arguments) |

Manual fallback: download the MP4 from this repo/workspace and upload it to Drive by hand;
the file is final-render quality (ffprobe + full decode verified).

## GitHub fallback (works now)

The files are committed and pushed on branch `arena/539a4f55-instagram-agent-skill`:

- Video: https://github.com/mwijay12/instagram-agent-skill/raw/arena/539a4f55-instagram-agent-skill/content-kit/code-video/samples/08-altraware-business-tip-v1.mp4
- Contact sheet: https://github.com/mwijay12/instagram-agent-skill/raw/arena/539a4f55-instagram-agent-skill/content-kit/code-video/samples/08-mp4-contact-sheet.jpg

Retry the connector in a fresh turn — the argument-stripping bug is usually
transient. Once uploads succeed, fill the table above and update
`08-render-manifest.json` → `drive`, `content-kit/data/channels.json` and
`content-kit/data/brand-profile.json`.
