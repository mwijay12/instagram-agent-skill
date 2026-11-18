import React, { useEffect, useRef, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

/*
 * Altraware Vibe Reel V1 — "Vibe coding vs Engineering" (ArtCraft news peg).
 * 30s @60fps. Visual system: motion-lab GLSL field shader (DAY palette) as the
 * living background, kinetic Fraunces type, motion-lab sticker SVGs, hand-drawn
 * scribbles drawn in by stroke-dashoffset, one real project screenshot in a
 * die-cut frame, ink caption strip. All frame-driven, deterministic.
 */

const FPS = 60;
const W = 1080;
const H = 1920;

const INK = '#10182b';
const MUTED = '#4b5563';
const WHITE = '#ffffff';
const PAPER = '#f7f6f2';
const GOLD = '#eab308';
const VIOLET = '#7c3aed';
const GREEN = '#047857';

const FONT_DISPLAY = '"Fraunces", Georgia, serif';
const FONT_BODY = '"Inter", Arial, sans-serif';
const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';

const fontCss = `
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-italic.woff2')}') format('woff2');font-weight:100 900;font-style:italic;font-display:swap}
@font-face{font-family:'Inter';src:url('${staticFile('fonts/inter-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('${staticFile('fonts/jetbrains-mono-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
`;

/* ------------------------- motion-lab field shader ------------------------- */
/* src/gl/field.frag.glsl from mwijay12/motion-lab, verbatim. DAY palette is
   paper + navy contours + violet high ground — white-dominant by design. */

const FIELD_FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uPx;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPress;
uniform float uScroll;
uniform float uDay;
uniform float uDensity;
uniform float uWarp;
uniform float uAccent;
uniform float uInk;
uniform float uSurge;
uniform float uScale;
uniform vec2 uSeed;
uniform float uRush;
uniform float uCalm;

out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.xxx;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float terrain(vec2 p, float t) {
  float n = snoise(vec3(p, t));
  n += 0.5 * snoise(vec3(p * 2.03 + 11.7, t * 1.3));
  n += 0.22 * snoise(vec3(p * 4.01 - 5.3, t * 1.7));
  return n / 1.72;
}

float contour(float value, float halfWidth) {
  float distancePx = abs(fract(value - 0.5) - 0.5) / max(fwidth(value), 1e-5);
  return 1.0 - smoothstep(halfWidth - 0.5, halfWidth + 0.5, distancePx);
}

const vec3 NIGHT_LOW = vec3(0.016, 0.035, 0.086);
const vec3 NIGHT_HIGH = vec3(0.043, 0.094, 0.235);
const vec3 NIGHT_LINE = vec3(0.640, 0.610, 0.960);
const vec3 NIGHT_ACCENT = vec3(0.918, 0.702, 0.031);

const vec3 DAY_LOW = vec3(0.933, 0.925, 0.898);
const vec3 DAY_HIGH = vec3(0.984, 0.980, 0.965);
const vec3 DAY_LINE = vec3(0.039, 0.090, 0.208);
const vec3 DAY_ACCENT = vec3(0.486, 0.227, 0.929);

const vec3 NIGHT_PLAIN = vec3(0.027, 0.063, 0.133);
const vec3 DAY_PLAIN = vec3(0.969, 0.965, 0.949);

void main() {
  float shortSide = min(uRes.x, uRes.y);
  vec2 screen = (gl_FragCoord.xy - 0.5 * uRes) / shortSide;

  vec2 stretched = screen * vec2(1.0 + uRush * 0.10, 1.0 - uRush * 0.30);
  vec2 q = stretched * uScale + uSeed;
  q.y -= uScroll * 0.22;
  float t = uTime * 0.03;

  vec2 fold = vec2(
    snoise(vec3(q * 0.55, t + 3.1)),
    snoise(vec3(q * 0.55 + 7.9, t - 1.4)));
  q += fold * (uWarp + uSurge * 0.5);

  float height = terrain(q, t);

  vec2 pointer = (uPointer - 0.5 * uRes) / shortSide;
  float reach = length(screen - pointer);
  float hill = exp(-reach * reach * 7.0) * uPress;
  height += hill * 0.5;

  float levels = uDensity * (1.0 + uSurge * 0.9);
  float value = height * levels;

  float crowd = fwidth(value);
  float minor = contour(value, 0.5 * uPx) * (1.0 - smoothstep(0.22, 0.55, crowd));
  float major = contour(value / 5.0, 0.8 * uPx) * (1.0 - smoothstep(0.6, 1.4, crowd));

  float level = smoothstep(-0.85, 0.85, height);

  vec3 ground = mix(mix(NIGHT_LOW, NIGHT_HIGH, level * level), mix(DAY_LOW, DAY_HIGH, level), uDay);

  vec2 slope = vec2(dFdx(height), dFdy(height)) * shortSide;
  vec3 normal = normalize(vec3(-slope * 0.55, 1.0));
  vec3 light = normalize(vec3(-0.55, 0.62, 0.56));
  float relief = dot(normal, light) - light.z;
  ground += relief * mix(vec3(0.030, 0.040, 0.085), vec3(0.040), uDay);

  float high = smoothstep(1.0 - uAccent - 0.10, 1.0 - uAccent + 0.10, level) * step(0.001, uAccent);
  vec3 ink = mix(mix(NIGHT_LINE, NIGHT_ACCENT, high), mix(DAY_LINE, DAY_ACCENT, high), uDay);

  float minorAlpha = mix(0.20, 0.13, uDay) + high * mix(0.26, 0.20, uDay);
  float majorAlpha = mix(0.26, 0.17, uDay) + high * mix(0.30, 0.22, uDay);
  float alpha = (minor * minorAlpha + major * majorAlpha) * uInk * (1.0 + uSurge * 0.9 + uRush * 0.35);

  vec3 color = mix(ground, ink, clamp(alpha, 0.0, 1.0));

  color += NIGHT_LINE * hill * 0.05 * (1.0 - uDay);

  float vignette = smoothstep(1.25, 0.2, length(screen * vec2(0.85, 1.0)));
  color *= mix(mix(0.62, 0.955, uDay), 1.0, vignette);

  float grain = hash12(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5;
  color += grain * mix(0.030, 0.018, uDay);

  color = mix(color, mix(NIGHT_PLAIN, DAY_PLAIN, uDay), uCalm);

  fragColor = vec4(color, 1.0);
}`;

const FIELD_VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Presets from motion-lab src/gl/presets.js (ink clamped for legibility).
const PRESETS = [
  { density: 9, warp: 0.46, accent: 0.2, ink: 0.62, scale: 1.05, seedX: 0, seedY: 0 }, // home-hero
  { density: 10, warp: 0.4, accent: 0.24, ink: 0.68, scale: 1.1, seedX: 12, seedY: 3 }, // work-hero
  { density: 11, warp: 0.52, accent: 0.18, ink: 0.55, scale: 1.2, seedX: -14, seedY: -7 }, // services-hero
  { density: 15, warp: 0.2, accent: 0.16, ink: 0.62, scale: 1.0, seedX: 3.6, seedY: -1.3 }, // plate-volta
  { density: 7, warp: 0.3, accent: 0.08, ink: 0.42, scale: 0.85, seedX: 0.35, seedY: -0.3 }, // home-statement
  { density: 8, warp: 0.5, accent: 0.3, ink: 0.66, scale: 0.95, seedX: 6.6, seedY: -2.6 }, // home-cta
];

const BEATS = [
  { id: 1, from: 0, to: 360, captions: ['Mwezi huu, developer mmoja ametengeneza', 'clone ya Adobe kwa AI pekee.'] },
  { id: 2, from: 360, to: 652, captions: ['Vibe coding imewagawanya:', 'wazabuni, engineers, wamiliki wa biashara.'] },
  { id: 3, from: 652, to: 933, captions: ['AI huandika demo haraka.', 'Lakini demo si production.'] },
  { id: 4, from: 933, to: 1233, captions: ['Security, malipo, data ya wateja —', 'hapo biashara inaishi au kufa.'] },
  { id: 5, from: 1233, to: 1432, captions: ['Vibe coding kwa prototype.', 'Engineering kwa production.'] },
  { id: 6, from: 1432, to: 1800, captions: ['Tunajenga mifumo inayostahimili Tanzania halisi.', 'Comment neno BUILD.'] },
];

const glState = new WeakMap();

const lerpPreset = (a, b, t) => {
  const out = {};
  for (const k of Object.keys(a)) {
    out[k] = a[k] + (b[k] - a[k]) * t;
  }
  return out;
};

const ShaderField = () => {
  const frame = useCurrentFrame();
  const ref = useRef(null);
  const [handle] = useState(() => delayRender('field-shader', { timeoutInMilliseconds: 120000 }));

  useEffect(() => {
    const canvas = ref.current;
    try {
      const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
      if (!gl) throw new Error('webgl2 unavailable');
      let st = glState.get(canvas);
      if (!st) {
        const compile = (type, src) => {
          const sh = gl.createShader(type);
          gl.shaderSource(sh, src);
          gl.compileShader(sh);
          if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            throw new Error('shader compile: ' + gl.getShaderInfoLog(sh));
          }
          return sh;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, FIELD_VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FIELD_FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          throw new Error('program link: ' + gl.getProgramInfoLog(prog));
        }
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'aPos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const uniforms = {};
        for (const u of ['uRes', 'uPx', 'uTime', 'uPointer', 'uPress', 'uScroll', 'uDay', 'uDensity', 'uWarp', 'uAccent', 'uInk', 'uSurge', 'uScale', 'uSeed', 'uRush', 'uCalm']) {
          uniforms[u] = gl.getUniformLocation(prog, u);
        }
        st = { prog, uniforms };
        glState.set(canvas, st);
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.useProgram(st.prog);
      const u = st.uniforms;

      // Active preset, tweened across the first 22 frames of each beat.
      const idx = BEATS.findIndex((b) => frame >= b.from && frame < b.to);
      const active = idx === -1 ? BEATS.length - 1 : idx;
      const prev = PRESETS[Math.max(0, active - 1)];
      const next = PRESETS[active];
      const tween = active === 0 ? 1 : interpolate(frame, [BEATS[active].from, BEATS[active].from + 22], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      const p = lerpPreset(prev, next, tween);
      const surge = active === 0 ? 0 : 1 - tween;

      const t = frame / FPS;
      const cw = canvas.width;
      const ch = canvas.height;
      const px = cw * (0.5 + 0.28 * Math.sin(t * 0.35));
      const py = ch * (0.5 + 0.3 * Math.cos(t * 0.27));

      gl.viewport(0, 0, cw, ch);
      gl.uniform2f(u.uRes, cw, ch);
      gl.uniform1f(u.uPx, 1.0);
      gl.uniform1f(u.uTime, t);
      gl.uniform2f(u.uPointer, px, py);
      gl.uniform1f(u.uPress, 0.12);
      gl.uniform1f(u.uScroll, 0.0);
      gl.uniform1f(u.uDay, 1.0);
      gl.uniform1f(u.uDensity, p.density);
      gl.uniform1f(u.uWarp, p.warp);
      gl.uniform1f(u.uAccent, p.accent);
      gl.uniform1f(u.uInk, p.ink);
      gl.uniform1f(u.uSurge, surge * 0.6);
      gl.uniform1f(u.uScale, p.scale);
      gl.uniform2f(u.uSeed, p.seedX, p.seedY);
      gl.uniform1f(u.uRush, 0.0);
      gl.uniform1f(u.uCalm, 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } catch (e) {
      // Fallback: paper gradient shows through (canvas stays blank).
    }
    continueRender(handle);
  }, [frame, handle]);

  return (
    <canvas
      ref={ref}
      width={540}
      height={960}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
};

/* ------------------------------ motion atoms ------------------------------ */

const slamIn = (lf, at, dur = 16) =>
  lf < at
    ? 0
    : spring({ frame: lf - at, fps: FPS, config: { damping: 24, stiffness: 330, mass: 0.75 }, durationInFrames: dur });

const wipe = (lf, at, dur = 12) =>
  lf < at
    ? 0
    : interpolate(lf, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

const Slam = ({ lf, at, size, color = INK, italic = false, font = FONT_DISPLAY, rot = 0, dx = 0, children, weight = 850, outline = false }) => {
  const s = slamIn(lf, at);
  return (
    <div
      style={{
        opacity: s,
        transform: `translate(${dx + (1 - s) * 54}px, ${(1 - s) * 78}px) scale(${0.88 + s * 0.12}) rotate(${rot}deg)`,
        transformOrigin: '0 60%',
        color: outline ? 'transparent' : color,
        WebkitTextStroke: outline ? `3px ${color}` : undefined,
        fontFamily: font,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        letterSpacing: '-0.012em',
        wordSpacing: '0.10em',
        lineHeight: 0.98,
      }}
    >
      {children}
    </div>
  );
};

const HiBar = ({ lf, at, color, textSize = 96, children, ink = INK, padY = 16, padX = 22, skew = -4 }) => {
  const w = wipe(lf, at, 13);
  const s = slamIn(lf, at + 3, 14);
  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: `${padY}px ${padX}px` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: color, transform: `skewX(${skew}deg)` }} />
      <div
        style={{
          position: 'relative',
          opacity: s,
          transform: `translateY(${(1 - s) * 42}px)`,
          color: ink,
          fontFamily: FONT_DISPLAY,
          fontSize: textSize,
          fontWeight: 850,
          letterSpacing: '-0.01em',
          wordSpacing: '0.10em',
          lineHeight: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Ghost = ({ text, top, left, rot = -6 }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      fontFamily: FONT_DISPLAY,
      fontSize: 430,
      fontWeight: 900,
      color: 'transparent',
      WebkitTextStroke: '2px rgba(16,24,43,0.08)',
      transform: `rotate(${rot}deg)`,
      letterSpacing: '-0.05em',
      lineHeight: 1,
      userSelect: 'none',
    }}
  >
    {text}
  </div>
);

const Scrim = ({ top = 500, height = 900, strength = 0.9 }) => (
  <div
    style={{
      position: 'absolute',
      left: -140,
      right: -140,
      top,
      height,
      background: `radial-gradient(ellipse 66% 52% at 50% 50%, rgba(255,255,255,${strength}) 0%, rgba(255,255,255,${strength * 0.62}) 45%, rgba(255,255,255,0) 75%)`,
    }}
  />
);

const Sticker = ({ src, lf, at, x, y, w, rot = -8, drift = 18 }) => {
  const s = slamIn(lf, at, 16);
  const dy = interpolate(lf, [0, 320], [0, -drift], { extrapolateRight: 'clamp' });
  const r = rot + Math.sin((lf - at) / 26) * 2.2;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: x,
        top: y + dy,
        width: w,
        opacity: s,
        transform: `rotate(${r}deg) scale(${0.85 + s * 0.15})`,
        filter: 'drop-shadow(0 14px 26px rgba(16,24,43,0.18))',
      }}
    />
  );
};

// Hand-drawn scribbles from motion-lab, drawn in via stroke-dashoffset (pathLength=100).
const Draw = ({ lf, at, dur = 20, vb, paths, color, sw = 4, x, y, w, rot = 0 }) => {
  const p = wipe(lf, at, dur);
  return (
    <svg viewBox={vb} style={{ position: 'absolute', left: x, top: y, width: w, transform: `rotate(${rot}deg)`, overflow: 'visible' }}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={100}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={100}
          strokeDashoffset={(1 - p) * 100}
        />
      ))}
    </svg>
  );
};

const SCRIBBLE_UNDERLINE = [
  'M2.7 9.2C7.3 8.4 20.4 4.7 30.3 4.7C40.2 4.6 51.1 8.8 62.1 8.8C73 8.7 83.5 4.3 96 4.2C108.5 4.1 130.1 7.4 137 8.1',
  'M127.6 15C121.7 14.6 105.3 12.5 92.4 12.8C79.5 13.1 57.2 16 50.2 16.7',
];
const SCRIBBLE_OVAL = [
  'M122.3 9.4C113.9 8.8 87.9 5.5 71.9 6.4C55.8 7.3 37 9.5 26 14.6C15 19.6 6.6 28.9 5.9 36.3C5.2 43.7 9.4 53.6 21.8 59C34.2 64.3 58.9 67.2 80.2 68.1C101.6 69 131.3 68.3 150 64.5C168.7 60.8 186.1 52.7 192.3 45.7C198.5 38.7 194.2 28.3 187.2 22.3C180.1 16.4 163.9 12.7 149.8 9.9C135.6 7.1 116.2 5.5 102.2 5.5C88.3 5.6 72.2 9.6 66.2 10.3',
];
const SCRIBBLE_BURST = [
  'M30.2 21.7C30.1 19.1 29.8 8.6 29.7 6',
  'M38.3 25.7C40.2 23.7 47.8 15.7 49.7 13.7',
  'M39.7 34.2C42.4 34.5 53.2 35.8 56 36.1',
  'M21.7 26.1C19.7 24.1 11.9 16.2 10 14.3',
  'M20.2 34.2C17.5 34.6 6.7 35.9 4 36.2',
];

const ShotSticker = ({ src, caption, lf, at, x, y, w, rot = 2.5 }) => {
  const s = slamIn(lf, at, 18);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        transform: `rotate(${rot}deg) scale(${0.9 + s * 0.1}) translateY(${(1 - s) * 40}px)`,
        opacity: s,
        background: '#ffffff',
        padding: 12,
        paddingBottom: 50,
        borderRadius: 10,
        boxShadow: '0 30px 70px rgba(16,24,43,0.22)',
        border: '1px solid rgba(16,24,43,0.10)',
      }}
    >
      <Img src={staticFile(src)} style={{ width: '100%', borderRadius: 6, display: 'block' }} />
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 10, fontFamily: FONT_MONO, fontSize: 21, color: MUTED, letterSpacing: '0.06em' }}>
        {caption}
      </div>
    </div>
  );
};

const TopTag = ({ beat, label }) => (
  <div style={{ position: 'absolute', top: 92, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 16, height: 16, background: GOLD }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 23, letterSpacing: '0.22em', color: INK }}>ALTRAWARE TECH</span>
    </div>
    <span style={{ fontFamily: FONT_MONO, fontSize: 23, letterSpacing: '0.18em', color: MUTED }}>{label}</span>
  </div>
);

const CaptionBar = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const dur = beat.to - beat.from;
  const idx = Math.min(beat.captions.length - 1, Math.floor((lf / dur) * beat.captions.length));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 172,
        background: INK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 72px',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${GOLD}, ${VIOLET})` }} />
      <div style={{ color: '#ffffff', fontFamily: FONT_BODY, fontSize: 36, fontWeight: 650, textAlign: 'center', letterSpacing: '0.01em' }}>
        {beat.captions[idx]}
      </div>
    </div>
  );
};

/* --------------------------------- BEATS --------------------------------- */

// B1 — news hook: clone ya Adobe kwa AI pekee
const BeatHook = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  return (
    <AbsoluteFill>
      <Ghost text="AI" top={1200} left={-40} rot={-5} />
      <TopTag beat={beat} label="01 — 06" />
      <Scrim top={300} height={1000} />
      <Draw lf={lf} at={4} vb="0 0 60 60" paths={SCRIBBLE_BURST} color={INK} sw={4} x={880} y={220} w={90} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 320 }}>
        <Slam lf={lf} at={6} size={40} color={MUTED} font={FONT_MONO} weight={500}>
          NOV 2026 · INARENDA SASA
        </Slam>
        <div style={{ marginTop: 44 }}>
          <Slam lf={lf} at={16} size={130}>
            CLONE YA
          </Slam>
          <Slam lf={lf} at={30} size={196}>
            ADOBE
          </Slam>
        </div>
        <div style={{ marginTop: 56 }}>
          <HiBar lf={lf} at={86} color={GOLD} textSize={92}>
            KWA AI PEKEE.
          </HiBar>
        </div>
        <Slam lf={lf} at={134} size={50} color={MUTED} italic font={FONT_BODY} weight={500}>
          bila timu, bila funding.
        </Slam>
        <div style={{ marginTop: 34 }}>
          <Slam lf={lf} at={172} size={30} color={MUTED} font={FONT_MONO} weight={500}>
            ARTCRAFT · THE WEEK / ARS TECHNICA
          </Slam>
        </div>
      </div>
      <Sticker src="stickers/sticker-cursor.svg" lf={lf} at={120} x={800} y={1080} w={190} rot={-10} />
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B2 — the divide
const BeatDivide = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const rows = [
    { n: '01', q: 'WAZABUNI', at: 96 },
    { n: '02', q: 'ENGINEERS', at: 120 },
    { n: '03', q: 'WAMILIKI WA BIASHARA', at: 144 },
  ];
  return (
    <AbsoluteFill>
      <Ghost text="VS" top={1150} left={560} rot={5} />
      <TopTag beat={beat} label="02 — 06" />
      <Scrim top={280} height={1100} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 310 }}>
        <Slam lf={lf} at={4} size={126}>
          VIBE CODING
        </Slam>
        <div style={{ marginTop: 44 }}>
          <HiBar lf={lf} at={46} color={VIOLET} textSize={88} ink="#ffffff">
            IMEWAGAWANYA.
          </HiBar>
        </div>
        <div style={{ marginTop: 76, display: 'flex', flexDirection: 'column', gap: 56 }}>
          {rows.map((r) => (
            <div key={r.n} style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 38, color: VIOLET, opacity: slamIn(lf, r.at), fontVariantNumeric: 'tabular-nums' }}>{r.n}</span>
              <Slam lf={lf} at={r.at} size={76}>
                {r.q}
              </Slam>
            </div>
          ))}
        </div>
      </div>
      <Sticker src="stickers/sticker-spark.svg" lf={lf} at={60} x={810} y={600} w={150} rot={8} />
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B3 — demo si production
const BeatDemo = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  return (
    <AbsoluteFill>
      <Ghost text="80" top={1250} left={-60} rot={-4} />
      <TopTag beat={beat} label="03 — 06" />
      <Scrim top={320} height={1050} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 360 }}>
        <Slam lf={lf} at={4} size={96}>
          AI HUANDIKA
        </Slam>
        <div style={{ marginTop: 30 }}>
          <Slam lf={lf} at={30} size={210} outline>
            DEMO.
          </Slam>
        </div>
        <Slam lf={lf} at={82} size={64} color={MUTED} italic font={FONT_BODY} weight={500}>
          lakini
        </Slam>
        <div style={{ marginTop: 24, position: 'relative' }}>
          <Slam lf={lf} at={102} size={112}>
            PRODUCTION.
          </Slam>
          <Draw lf={lf} at={130} vb="0 0 140 20" paths={SCRIBBLE_UNDERLINE} color={GOLD} sw={4.5} x={-6} y={430} w={700} dur={22} />
        </div>
        <Slam lf={lf} at={168} size={46} color={MUTED} font={FONT_MONO} weight={500}>
          demo ≠ production
        </Slam>
      </div>
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B4 — the killers
const BeatKillers = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const rows = [
    { q: 'SECURITY.', at: 16, c: VIOLET },
    { q: 'MALIPO.', at: 52, c: GREEN },
    { q: 'DATA YA WATEJA.', at: 88, c: INK },
  ];
  return (
    <AbsoluteFill>
      <Ghost text="DATA" top={1240} left={-90} rot={-5} />
      <TopTag beat={beat} label="04 — 06" />
      <Scrim top={300} height={1080} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 330 }}>
        <Slam lf={lf} at={2} size={40} color={MUTED} font={FONT_MONO} weight={500}>
          SEHEMU HATARI —
        </Slam>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 34 }}>
          {rows.map((r, i) => (
            <div key={r.q} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ width: 12, height: 88, background: r.c, opacity: slamIn(lf, r.at) }} />
              <Slam lf={lf} at={r.at} size={i === 2 ? 96 : 116}>
                {r.q}
              </Slam>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 72 }}>
          <Slam lf={lf} at={170} size={56} italic font={FONT_BODY} weight={550}>
            hapo biashara inaishi au kufa.
          </Slam>
        </div>
      </div>
      <Sticker src="stickers/sticker-coins.svg" lf={lf} at={120} x={40} y={1330} w={170} rot={-8} />
      <Sticker src="stickers/sticker-receipt.svg" lf={lf} at={140} x={830} y={1290} w={160} rot={7} />
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B5 — the line + real work proof
const BeatLine = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  return (
    <AbsoluteFill>
      <TopTag beat={beat} label="05 — 06" />
      <Scrim top={300} height={1050} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 320 }}>
        <Slam lf={lf} at={4} size={64} color={MUTED} font={FONT_MONO} weight={500}>
          VIBE CODING → <span style={{ color: INK }}>PROTOTYPE</span>
        </Slam>
        <div style={{ marginTop: 40 }}>
          <Slam lf={lf} at={34} size={64} color={MUTED} font={FONT_MONO} weight={500}>
            ENGINEERING →
          </Slam>
        </div>
        <div style={{ marginTop: 26 }}>
          <HiBar lf={lf} at={58} color={GOLD} textSize={118}>
            PRODUCTION.
          </HiBar>
        </div>
      </div>
      <ShotSticker
        src="work/faida-800.webp"
        caption="FAIDA POS · PROJECT YA ALTRAWARE"
        lf={lf}
        at={110}
        x={238}
        y={1010}
        w={600}
        rot={2.5}
      />
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B6 — CTA
const BeatCTA = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const brand = slamIn(lf, 6, 18);
  return (
    <AbsoluteFill>
      <Ghost text="TZ" top={1180} left={620} rot={6} />
      <TopTag beat={beat} label="06 — 06" />
      <Scrim top={300} height={1100} />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 330 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: brand, transform: `translateY(${(1 - brand) * 26}px)` }}>
          <Img src={staticFile('logo.png')} style={{ width: 76, height: 76, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 34, color: INK, letterSpacing: '0.14em' }}>ALTRAWARE TECH</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 25, color: MUTED, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
              @altrawaretechnology · 0790942616
            </div>
          </div>
        </div>
        <div style={{ marginTop: 80 }}>
          <Slam lf={lf} at={30} size={62} color={MUTED} font={FONT_BODY} weight={550}>
            Tunajenga mifumo ya
          </Slam>
          <div style={{ marginTop: 22 }}>
            <HiBar lf={lf} at={56} color={GOLD} textSize={108}>
              TANZANIA HALISI.
            </HiBar>
          </div>
        </div>
        <div style={{ marginTop: 90, position: 'relative' }}>
          <Slam lf={lf} at={128} size={58} color={MUTED} font={FONT_BODY} weight={550}>
            Comment neno
          </Slam>
          <div style={{ marginTop: 12, position: 'relative', display: 'inline-block', padding: '64px 70px' }}>
            <HiBar lf={lf} at={150} color={VIOLET} textSize={230} ink="#ffffff" padY={24} padX={36}>
              BUILD.
            </HiBar>
            <Draw lf={lf} at={186} vb="0 0 200 74" paths={SCRIBBLE_OVAL} color={INK} sw={4} x={-2} y={-2} w={960} dur={24} />
          </div>
        </div>
      </div>
      <Sticker src="stickers/sticker-thumb.svg" lf={lf} at={200} x={846} y={1400} w={150} rot={9} />
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

const SCENES = [BeatHook, BeatDivide, BeatDemo, BeatKillers, BeatLine, BeatCTA];

export const AltrawareVibeReelV1 = () => {
  const frame = useCurrentFrame();
  const active = BEATS.find((b) => frame >= b.from && frame < b.to) || BEATS[BEATS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <ShaderField />
      <Scene beat={active} />
      <Audio src={staticFile('audio/voiceover-vibe-reel-v1.wav')} />
    </AbsoluteFill>
  );
};

export const RemotionRootVibeV1 = () => (
  <Composition
    id="AltrawareVibeReelV1"
    component={AltrawareVibeReelV1}
    durationInFrames={1800}
    fps={FPS}
    width={W}
    height={H}
  />
);
