# 08 — business-tip-v1 Drive handoff (PENDING)

The MP4 + contact sheet are rendered and committed locally, but the Google Drive
connector calls failed in this turn (the connector received empty arguments on every
call, so no upload was executed). No Drive file exists yet for `08-altraware-business-tip-v1`.

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
| 08-altraware-business-tip-v1.mp4 | PENDING | PENDING | PENDING | upload failed this turn (connector arguments) |
| 08-mp4-contact-sheet.jpg | PENDING | PENDING | PENDING | upload failed this turn (connector arguments) |

Manual fallback: download the MP4 from this repo/workspace and upload it to Drive by hand;
the file is final-render quality (ffprobe + full decode verified).
