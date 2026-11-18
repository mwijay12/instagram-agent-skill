# look.md - gates computed on the render (not self-certified)

G0 render exists : PASS  (00:00:35.07, audio=yes, 2572 KB, expected 35.08s)
G2 no empty frame: PASS  (longest near-flat run 1.983s; limit 3.0s)
G3 end hold      : PASS  (1.40s; limit 1.4s)
G5 no page chrome: PASS  (no ACT/coords/timecode/progress bar in renderer)
G1 proof readable: HUMAN - check 04-contact-sheet.jpg (code/text >= 0.04H)
G4 one hero      : HUMAN - check 04-contact-sheet.jpg (no equal split panels)

Motion laws: frame-driven only, spring(14/120/0.8), clamped interpolate,
camera 1.0->1.35, line focus 25% dim, token morph 0.8s, 4-frame stagger,
tabular-nums, 3-second rule measured per frame at 60fps.

Honesty: Remotion / Motion Canvas / Revideo / Timecut / Manim-MCP did NOT run
(there is no Chromium or MCP server). This is the deterministic Python fallback.
TTS only, no music/SFX - owner adds music. Nothing posted.
