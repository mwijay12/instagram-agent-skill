# Deterministic SVG elements for clean tech reels

These SVGs are **decorative elements only**. They contain no text, no logo and no AI-generated glyphs. In Remotion they should be loaded with `staticFile('elements/<name>.svg')` and animated with `useCurrentFrame()`, `spring()` and `interpolate()` — never CSS transitions or `setTimeout`.

| File | Use |
| --- | --- |
| `phone-frame.svg` | Mobile-first / simu kwanza beats |
| `code-brackets.svg` | Vibe coding / code diff beats |
| `signal-arc.svg` | Ujumbe unafika / API / sync beats |
| `node-graph.svg` | System architecture / project proof beats |

Brand tokens: navy `#071022`, paper `#f7f6f2`, gold `#eab308`, violet `#7c3aed`, muted `#a3aecb`.

Rule: one hero per frame. Elements stay low-opacity or outside the text safe zone so the background remains clean and the copy is readable.
