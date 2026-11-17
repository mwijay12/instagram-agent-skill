# Fonts

These are the **exact** self-hosted fonts from your own
[`motion-lab/src/fonts`](https://github.com/mwijay12/motion-lab/tree/main/motion-lab/src/fonts)
directory, copied here so carousels, the video renderer and the live studio
preview all use the same type.

| File | Role |
| --- | --- |
| `fraunces-latin-opsz-normal.woff2` / `.ttf` | Display serif, headlines |
| `fraunces-latin-opsz-italic.woff2` / `.ttf` | One italic word in a headline |
| `inter-latin-wght-normal.woff2` / `.ttf` | Body copy |
| `jetbrains-mono-latin-wght-normal.woff2` / `.ttf` | Code, numbers, coordinates |

- `.woff2` is the original from `motion-lab` and is what the browser uses.
- `.ttf` is the same font converted with `fontTools` (`TTFont(flavor=None)`)
  so Pillow / ffmpeg renderers can load it. Both are variable fonts; the
  renderer sets the weight axis where a bold face is needed.
- Licence: **SIL Open Font License 1.1**, as stated in the `motion-lab`
  README. Keep this note if you copy the fonts elsewhere.
- Latin subset: Kiswahili and English are fully covered. No third-party CDN,
  no font request at runtime, which also matches the `motion-lab` AGENTS rules.

To refresh from the source repo:

```bash
for f in fraunces-latin-opsz-normal.woff2 fraunces-latin-opsz-italic.woff2 \
         inter-latin-wght-normal.woff2 jetbrains-mono-latin-wght-normal.woff2; do
  gh api "repos/mwijay12/motion-lab/contents/motion-lab/src/fonts/$f" --jq .content \
    | base64 -d > "content-kit/assets/fonts/$f"
done
```
