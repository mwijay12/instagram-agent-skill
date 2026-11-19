import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

/*
 * Altraware Elements Reel — V3 "6 WORLDS".
 * Every beat has its OWN visual language (no shared template):
 *   1 Google Search mock (white, typing query, result rows)
 *   2 Hydrogen light lab (pale gradient, specimen photo card, price tag)
 *   3 Neon as a REAL neon sign (glowing tube text + flicker, dark)
 *   4 Carbon blueprint / spec sheet (dark graphite, metallic type, redacted Argon)
 *   5 Google DeepMind editorial (cream magazine, portrait photo card, pull quote)
 *   6 Gemini aurora CTA (dark navy gradient blobs, chat comment mock, gradient type)
 * Voice: voice-03 (user-selected), tempo 1.15, breathing gaps. 35s @60fps.
 */

const FPS = 60;
const W = 1080;
const H = 1920;

const INK = '#10182b';
const MUTED = '#4b5563';
const GOLD = '#eab308';

// Google brand
const G_BLUE = '#4285f4';
const G_RED = '#ea4335';
const G_YELLOW = '#fbbc04';
const G_GREEN = '#34a853';
const G_LINK = '#1a0dab';
const G_URL = '#0b8043';

// element accents
const H2 = '#e26fb5';
const NE = '#ff4a2e';
const C_SILVER = '#8fa3bb';
const VIOLET = '#a78bfa';

const FONT_DISPLAY = '"Fraunces", Georgia, serif';
const FONT_BODY = '"Inter", Arial, sans-serif';
const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';

const fontCss = `
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-italic.woff2')}') format('woff2');font-weight:100 900;font-style:italic;font-display:swap}
@font-face{font-family:'Inter';src:url('${staticFile('fonts/inter-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('${staticFile('fonts/jetbrains-mono-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
`;

const BEATS = [
  { id: 1, from: 0, to: 366, accent: G_BLUE, captions: ['Google imetoa models nne mpya za AI —', 'zote majina ya elementi.'] },
  { id: 2, from: 366, to: 588, accent: H2, captions: ['Hydrogen ni bure —', 'inatosha kwa kazi za kila siku.'] },
  { id: 3, from: 588, to: 873, accent: NE, captions: ['Neon ndio mpya zaidi —', 'nguvu ya Carbon, kasi ya Flash.'] },
  { id: 4, from: 873, to: 1198, accent: C_SILVER, captions: ['Carbon kwa kazi ngumu kabisa.', 'Na Argon? Imeshafutwa.'] },
  { id: 5, from: 1198, to: 1597, accent: GOLD, captions: ['Zinatengenezwa na Google DeepMind —', 'model sahihi, kazi sahihi.'] },
  { id: 6, from: 1597, to: 2100, accent: VIOLET, captions: ['Comment GEMINI hapo chini —', 'nitakutumie PDF kamili kwa Kiswahili.'] },
];

/* ------------------------------- atoms ---------------------------------- */

const slamIn = (lf, at, dur = 16) =>
  lf < at
    ? 0
    : spring({ frame: lf - at, fps: FPS, config: { damping: 24, stiffness: 320, mass: 0.75 }, durationInFrames: dur });

const wipe = (lf, at, dur = 14) =>
  lf < at
    ? 0
    : interpolate(lf, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

// dip-from-black at the start of every beat (covers the hard cut)
const BeatFade = ({ lf }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#04060c', opacity: lf < 9 ? 1 - lf / 9 : 0, zIndex: 60, pointerEvents: 'none' }} />
);

const TopTag = ({ label, dark = false }) => (
  <div style={{ position: 'absolute', top: 84, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 40 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <div style={{ width: 15, height: 15, background: GOLD }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.22em', color: dark ? 'rgba(255,255,255,0.92)' : INK }}>ALTRAWARE TECH</span>
    </div>
    <span style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.18em', color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(16,24,43,0.55)' }}>{label}</span>
  </div>
);

// floating caption pill (burned subtitles) — per-beat accent dot
const CaptionPill = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const dur = beat.to - beat.from;
  const idx = Math.min(beat.captions.length - 1, Math.floor((lf / dur) * beat.captions.length));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 92, display: 'flex', justifyContent: 'center', zIndex: 50 }}>
      <div
        style={{
          maxWidth: 940,
          background: 'rgba(7,10,20,0.88)',
          borderRadius: 999,
          padding: '20px 42px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          boxShadow: '0 18px 50px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 999, background: beat.accent, flexShrink: 0, boxShadow: `0 0 14px ${beat.accent}` }} />
        <div style={{ color: '#ffffff', fontFamily: FONT_BODY, fontSize: 34, fontWeight: 650, textAlign: 'center', letterSpacing: '0.005em' }}>
          {beat.captions[idx]}
        </div>
      </div>
    </div>
  );
};

const Slam = ({ lf, at, size, color = INK, italic = false, font = FONT_DISPLAY, children, weight = 850, style = {}, center = false }) => {
  const s = slamIn(lf, at);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 60}px) scale(${0.92 + s * 0.08})`,
        transformOrigin: center ? '50% 60%' : '0 60%',
        color,
        fontFamily: font,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        letterSpacing: '-0.012em',
        lineHeight: 1.02,
        textAlign: center ? 'center' : 'left',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------- B1 — GOOGLE SEARCH ---------------------------- */

const GOOGLE_RESULTS = [
  { sym: 'H', name: 'Hydrogen', url: 'gemini.google.com › models › hydrogen', title: 'Hydrogen — ya bure kabisa', color: H2, struck: false },
  { sym: 'Ne', name: 'Neon', url: 'gemini.google.com › models › neon', title: 'Neon — mpya zaidi, wiki hii', color: NE, struck: false },
  { sym: 'C', name: 'Carbon', url: 'gemini.google.com › models › carbon', title: 'Carbon — kazi ngumu kabisa', color: '#5b6b82', struck: false },
  { sym: 'Ar', name: 'Argon', url: 'gemini.google.com › models › argon', title: 'Argon — imeondolewa', color: '#7a5af8', struck: true },
];

const ResultRow = ({ lf, at, r }) => {
  const s = slamIn(lf, at, 16);
  return (
    <div style={{ display: 'flex', gap: 26, alignItems: 'flex-start', opacity: s, transform: `translateY(${(1 - s) * 46}px)` }}>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 16,
          background: r.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 30,
          color: '#fff',
          flexShrink: 0,
          marginTop: 6,
        }}
      >
        {r.sym}
      </div>
      <div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: G_URL, letterSpacing: '0.02em' }}>{r.url}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 4 }}>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 45,
              color: G_LINK,
              letterSpacing: '-0.01em',
              textDecoration: r.struck ? 'line-through' : 'none',
              textDecorationColor: G_RED,
              textDecorationThickness: 5,
            }}
          >
            {r.title}
          </div>
          {r.struck ? (
            <div style={{ background: G_RED, color: '#fff', borderRadius: 8, padding: '6px 14px', fontFamily: FONT_MONO, fontSize: 20, letterSpacing: '0.1em' }}>
              IMEONDOLEWA
            </div>
          ) : null}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 29, color: '#4d5156', marginTop: 6 }}>Gemini 4 · Google DeepMind</div>
      </div>
    </div>
  );
};

const BeatSearch = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const q = 'models mpya za gemini';
  const n = Math.max(0, Math.min(q.length, Math.floor((lf - 16) / 2.1)));
  const cursorOn = Math.floor(lf / 14) % 2 === 0 || n < q.length;
  const logo = slamIn(lf, 2, 16);
  return (
    <AbsoluteFill style={{ background: '#ffffff' }}>
      <TopTag label="01 — 06" />
      {/* wordmark */}
      <div style={{ position: 'absolute', top: 196, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }}>
        <Img src={staticFile('elements/google-logo.png')} style={{ width: 400, display: 'block' }} />
      </div>
      {/* search bar */}
      <div
        style={{
          position: 'absolute',
          top: 452,
          left: 90,
          right: 90,
          height: 108,
          borderRadius: 999,
          border: '2px solid #dfe1e5',
          background: '#fff',
          boxShadow: '0 14px 40px rgba(60,64,67,0.16)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 44px',
          gap: 24,
          opacity: slamIn(lf, 8, 14),
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <circle cx="10.5" cy="10.5" r="6.5" stroke="#9aa0a6" strokeWidth="2.4" />
          <line x1="15.6" y1="15.6" x2="21" y2="21" stroke="#9aa0a6" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: FONT_BODY, fontSize: 40, color: '#202124', letterSpacing: '0.01em' }}>
          {q.slice(0, n)}
          <span style={{ display: 'inline-block', width: 4, height: 44, background: G_BLUE, marginLeft: 4, verticalAlign: '-6px', opacity: cursorOn ? 1 : 0 }} />
        </div>
      </div>
      {/* meta line */}
      <div style={{ position: 'absolute', top: 612, left: 96, fontFamily: FONT_MONO, fontSize: 23, color: '#5f6368', opacity: slamIn(lf, 46) }}>
        Matokeo 4 · sekunde 0.42
      </div>
      {/* results */}
      <div style={{ position: 'absolute', top: 700, left: 96, right: 90, display: 'flex', flexDirection: 'column', gap: 58 }}>
        {GOOGLE_RESULTS.map((r, i) => (
          <ResultRow key={r.sym} lf={lf} at={58 + i * 22} r={r} />
        ))}
      </div>
      {/* google color dots */}
      <div style={{ position: 'absolute', top: 1610, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18, opacity: slamIn(lf, 160) }}>
        {[G_BLUE, G_RED, G_YELLOW, G_GREEN].map((c) => (
          <div key={c} style={{ width: 20, height: 20, borderRadius: 999, background: c }} />
        ))}
      </div>
      <CaptionPill beat={beat} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* ------------------------- B2 — HYDROGEN LAB ----------------------------- */

const BeatHydrogen = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const tag = slamIn(lf, 20, 14);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(168deg, #eef3ff 0%, #fdf1f7 62%, #ffffff 100%)' }}>
      {/* giant ghost H */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          right: -40,
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: 880,
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '3px rgba(226,111,181,0.20)',
          opacity: slamIn(lf, 0, 20),
        }}
      >
        H
      </div>
      <TopTag label="02 — 06" />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 250 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.24em', color: '#8b5cf6', opacity: slamIn(lf, 4) }}>01 · H · ELEMENTI YA KWANZA</div>
        <div style={{ marginTop: 26 }}>
          <Slam
            lf={lf}
            at={8}
            size={152}
            italic
            style={{
              backgroundImage: 'linear-gradient(94deg, #e26fb5 10%, #8b5cf6 90%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            Hydrogen
          </Slam>
        </div>
      </div>
      {/* specimen photo card */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 640,
          height: 350,
          borderRadius: 34,
          border: '10px solid #ffffff',
          overflow: 'hidden',
          boxShadow: '0 34px 80px rgba(139,92,246,0.28)',
          transform: `rotate(-2deg) scale(${0.9 + slamIn(lf, 12, 16) * 0.1})`,
          opacity: slamIn(lf, 12, 16),
          background: '#0b0714',
        }}
      >
        <Img
          src={staticFile('elements/hydrogen.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${interpolate(lf, [12, 220], [1.04, 1.14], { extrapolateRight: 'clamp' })})`,
          }}
        />
      </div>
      {/* price tag */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          right: 62,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: '#fbbf24',
          border: '6px dashed rgba(16,24,43,0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(9deg) scale(${0.4 + tag * 0.6})`,
          opacity: tag,
          boxShadow: '0 24px 60px rgba(16,24,43,0.25)',
          zIndex: 5,
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: 86, color: INK, lineHeight: 1 }}>BURE</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 30, color: 'rgba(16,24,43,0.75)', marginTop: 8 }}>TSH 0/=</div>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1130 }}>
        <Slam lf={lf} at={30} size={66} font={FONT_BODY} weight={700} color={INK}>
          Inatosha kwa kazi za kila siku.
        </Slam>
        <div style={{ marginTop: 22, fontFamily: FONT_MONO, fontSize: 27, color: 'rgba(16,24,43,0.6)', opacity: slamIn(lf, 44), letterSpacing: '0.06em' }}>
          bila kulipa · bila kikomo cha kuingilia
        </div>
      </div>
      <CaptionPill beat={beat} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* -------------------------- B3 — NEON SIGN ------------------------------- */

const BeatNeon = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const flick = 0.88 + 0.12 * Math.sin(lf * 0.9 + 1.2) * Math.sin(lf * 0.37);
  const drop = lf % 97 < 3 ? 0.5 : 1;
  const glow = Math.max(0.35, flick * drop);
  const on = slamIn(lf, 10, 14);
  const zoom = interpolate(lf, [0, 285], [1.02, 1.12], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#0a0407' }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('elements/neon-sign2.jpg')}
          style={{
            position: 'absolute',
            inset: -70,
            width: '114%',
            height: '114%',
            objectFit: 'cover',
            objectPosition: '50% 38%',
            transform: `scale(${zoom})`,
            filter: 'saturate(1.35) contrast(1.08) brightness(0.5)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 42%, rgba(5,2,6,0.05) 0%, rgba(5,2,6,0.66) 74%, rgba(5,2,6,0.9) 100%)' }} />
      </AbsoluteFill>
      <TopTag label="03 — 06" dark />
      {/* capsule kicker */}
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: slamIn(lf, 4) }}>
        <div
          style={{
            border: `2px solid ${NE}`,
            borderRadius: 999,
            padding: '13px 34px',
            fontFamily: FONT_MONO,
            fontSize: 26,
            letterSpacing: '0.22em',
            color: '#ffb4aa',
            boxShadow: `0 0 26px ${NE}55, inset 0 0 18px ${NE}33`,
          }}
        >
          MPYA ZAIDI — WIKI HII
        </div>
      </div>
      {/* the sign */}
      <div style={{ position: 'absolute', top: 430, left: 0, right: 0, textAlign: 'center', opacity: on * glow }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 262,
            letterSpacing: '0.02em',
            color: '#fff3ee',
            textShadow: `0 0 14px #ff2d1e, 0 0 46px #ff2d1e, 0 0 96px #ff6a00, 0 0 170px #ff2d1e`,
            transform: `scale(${0.94 + on * 0.06})`,
          }}
        >
          NEON
        </div>
        <div
          style={{
            width: 470,
            height: 9,
            borderRadius: 6,
            margin: '26px auto 0',
            background: '#ffd9d2',
            boxShadow: `0 0 18px 4px #ff2d1ecc, 0 0 60px 14px #ff2d1e66`,
          }}
        />
      </div>
      {/* outline neon lines */}
      <div style={{ position: 'absolute', top: 900, left: 0, right: 0, textAlign: 'center' }}>
        <Slam
          lf={lf}
          at={52}
          size={70}
          center
          font={FONT_BODY}
          weight={800}
          style={{
            color: 'transparent',
            WebkitTextStroke: '2.5px #ff9d8a',
            textShadow: '0 0 22px rgba(255,45,30,0.75)',
            letterSpacing: '0.06em',
          }}
        >
          NGUVU YA CARBON.
        </Slam>
        <div style={{ marginTop: 30 }}>
          <Slam lf={lf} at={74} size={84} center color="#ffe9e4" weight={850} style={{ textShadow: '0 0 30px rgba(255,45,30,0.9), 0 0 80px rgba(255,106,0,0.5)' }}>
            KASI YA FLASH.
          </Slam>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, textAlign: 'center', opacity: slamIn(lf, 120) }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 27, letterSpacing: '0.08em', color: 'rgba(255,180,170,0.78)' }}>inachukua nafasi ya Argon kwenye app</span>
      </div>
      <CaptionPill beat={beat} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* ------------------------ B4 — CARBON BLUEPRINT -------------------------- */

const SpecBar = ({ lf, at, label, pct, note }) => {
  const w = wipe(lf, at, 22);
  return (
    <div style={{ marginBottom: 44, opacity: slamIn(lf, at - 4) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.18em', color: 'rgba(226,236,247,0.85)', marginBottom: 14 }}>
        <span>{label}</span>
        <span style={{ color: 'rgba(143,163,187,0.9)' }}>{note}</span>
      </div>
      <div style={{ width: '100%', height: 26, borderRadius: 6, border: '1px solid rgba(143,163,187,0.4)', background: 'rgba(10,14,22,0.55)', overflow: 'hidden' }}>
        <div style={{ width: `${w * pct}%`, height: '100%', background: 'linear-gradient(90deg, #5b6b82, #c8d5e3)', borderRadius: 6 }} />
      </div>
    </div>
  );
};

const BeatCarbon = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const redact = wipe(lf, 118, 16);
  const zoom = interpolate(lf, [0, 325], [1.05, 1.13], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#0a0e16' }}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img
          src={staticFile('elements/carbon.jpg')}
          style={{ position: 'absolute', inset: -70, width: '114%', height: '114%', objectFit: 'cover', transform: `scale(${zoom})`, filter: 'brightness(0.42) saturate(0.9) contrast(1.1)' }}
        />
        {/* blueprint grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(143,163,187,0.10) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, rgba(143,163,187,0.10) 0 1px, transparent 1px 56px)',
          }}
        />
      </AbsoluteFill>
      {/* crosshairs */}
      {[
        { top: 150, left: 60 },
        { top: 150, right: 60 },
        { bottom: 260, left: 60 },
        { bottom: 260, right: 60 },
      ].map((p, i) => (
        <div key={i} style={{ position: 'absolute', ...p, fontFamily: FONT_MONO, fontSize: 34, color: 'rgba(143,163,187,0.65)' }}>
          +
        </div>
      ))}
      <TopTag label="04 — 06" dark />
      <div style={{ position: 'absolute', left: 84, right: 84, top: 250 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 25, letterSpacing: '0.24em', color: 'rgba(200,213,227,0.8)', opacity: slamIn(lf, 4) }}>
          SPECIMEN 06 · GRAPHITE
        </div>
        <div style={{ marginTop: 24 }}>
          <Slam
            lf={lf}
            at={10}
            size={158}
            font={FONT_BODY}
            weight={900}
            style={{
              backgroundImage: 'linear-gradient(180deg, #f4f8fc 8%, #93a6bd 52%, #e8eef5 95%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              letterSpacing: '0.015em',
            }}
          >
            CARBON
          </Slam>
        </div>
        <div style={{ marginTop: 20, fontFamily: FONT_BODY, fontSize: 44, fontWeight: 600, color: 'rgba(226,236,247,0.92)', opacity: slamIn(lf, 26), transform: `translateY(${(1 - slamIn(lf, 26)) * 30}px)` }}>
          kwa kazi ngumu kabisa.
        </div>
      </div>
      {/* spec sheet */}
      <div style={{ position: 'absolute', left: 84, right: 84, top: 780 }}>
        <SpecBar lf={lf} at={44} label="NGUVU" pct={94} note="deep reasoning" />
        <SpecBar lf={lf} at={60} label="KASI" pct={42} note="si ya haraka" />
        <SpecBar lf={lf} at={76} label="BEI" pct={78} note="$$$$ premium" />
      </div>
      {/* argon redacted */}
      <div style={{ position: 'absolute', left: 84, right: 84, top: 1210, opacity: slamIn(lf, 100) }}>
        <div style={{ height: 2, background: 'repeating-linear-gradient(90deg, rgba(143,163,187,0.5) 0 14px, transparent 14px 26px)', marginBottom: 40 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 32, letterSpacing: '0.16em', color: 'rgba(143,163,187,0.85)' }}>18 · Ar ·</span>
          <div style={{ width: 400 * redact, height: 56, background: '#04060a', border: '1px solid rgba(255,255,255,0.14)', transform: 'rotate(-1.2deg)', borderRadius: 4 }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 30, color: '#ff5a4e', letterSpacing: '0.1em', opacity: wipe(lf, 134, 10) }}>IMEONDOREWA</span>
        </div>
        <div style={{ marginTop: 22, fontFamily: FONT_MONO, fontSize: 25, color: 'rgba(143,163,187,0.6)', letterSpacing: '0.06em' }}>
          argon alikaa miezi miwili tu — Google amemfuta
        </div>
      </div>
      <CaptionPill beat={beat} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* ----------------------- B5 — DEEPMIND EDITORIAL ------------------------- */

const BeatDeepMind = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const shot = slamIn(lf, 10, 18);
  return (
    <AbsoluteFill style={{ background: '#f8f4ea' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(16,24,43,0.055) 1.5px, transparent 1.5px)', backgroundSize: '44px 44px' }} />
      <TopTag label="05 — 06" />
      {/* portrait photo card */}
      <div
        style={{
          position: 'absolute',
          top: 240,
          right: 56,
          width: 448,
          height: 640,
          background: '#fff',
          border: '14px solid #ffffff',
          borderRadius: 10,
          boxShadow: '0 40px 90px rgba(16,24,43,0.30)',
          transform: `rotate(2.2deg) translateY(${(1 - shot) * 60}px)`,
          opacity: shot,
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        <Img
          src={staticFile('elements/deepmind-office.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 28%', transform: `scale(${interpolate(lf, [10, 390], [1.03, 1.12], { extrapolateRight: 'clamp' })})` }}
        />
        <div style={{ position: 'absolute', left: 20, bottom: 20, background: 'rgba(16,24,43,0.88)', borderRadius: 999, padding: '10px 24px', fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.12em', color: '#fff' }}>
          GOOGLE DEEPMIND · LONDON
        </div>
      </div>
      {/* pull quote */}
      <div style={{ position: 'absolute', left: 72, top: 250, width: 560 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 25, letterSpacing: '0.24em', color: 'rgba(16,24,43,0.55)', opacity: slamIn(lf, 4) }}>05 · MAANA YAKE</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 900, fontSize: 300, lineHeight: 0.6, color: GOLD, marginTop: 30, opacity: slamIn(lf, 14), height: 150 }}>“</div>
        <Slam lf={lf} at={40} size={86} italic>
          Model sahihi,
        </Slam>
        <div style={{ marginTop: 6 }}>
          <Slam lf={lf} at={58} size={86} italic>
            kazi sahihi.
          </Slam>
        </div>
        <div style={{ marginTop: 40, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.14em', color: 'rgba(16,24,43,0.6)', opacity: slamIn(lf, 84) }}>
          — GOOGLE DEEPMIND
        </div>
      </div>
      {/* bottom explainer strip */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 1210,
          borderTop: `3px solid ${INK}`,
          paddingTop: 34,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: slamIn(lf, 120),
          transform: `translateY(${(1 - slamIn(lf, 120)) * 30}px)`,
        }}
      >
        <div style={{ fontFamily: FONT_BODY, fontSize: 40, fontWeight: 650, color: INK, width: 620, lineHeight: 1.25 }}>
          Zinatengenezwa na maabara ya <span style={{ fontWeight: 800 }}>Google DeepMind</span>.
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: 'rgba(16,24,43,0.55)', letterSpacing: '0.08em', textAlign: 'right' }}>
          hydrogen → kila siku
          <br />
          carbon → kazi ngumu
        </div>
      </div>
      <CaptionPill beat={beat} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* ------------------------- B6 — GEMINI AURORA ---------------------------- */

const BeatCTA = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const word = 'GEMINI';
  const n = Math.max(0, Math.min(word.length, Math.floor((lf - 36) / 6)));
  const cursorOn = Math.floor(lf / 15) % 2 === 0 || n < word.length;
  const blob = (i, size, color, cx, cy, ax, ay, sp) => (
    <div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: cx + Math.sin(lf / sp + i * 2.1) * ax - size / 2,
        top: cy + Math.cos(lf / (sp * 1.3) + i) * ay - size / 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 62%)`,
        opacity: 0.55,
      }}
    />
  );
  const float = Math.sin(lf / 26) * 14;
  return (
    <AbsoluteFill style={{ background: '#0a0f24', overflow: 'hidden' }}>
      {blob(0, 980, 'rgba(59,130,246,0.5)', 240, 500, 90, 70, 52)}
      {blob(1, 1060, 'rgba(139,92,246,0.5)', 860, 900, 80, 90, 61)}
      {blob(2, 900, 'rgba(236,72,153,0.42)', 420, 1400, 70, 80, 57)}
      <TopTag label="06 — 06" dark />
      {/* floating sparkle */}
      <Img
        src={staticFile('elements/gemini-sparkle.png')}
        style={{
          position: 'absolute',
          top: 208 + float,
          right: 110,
          width: 150,
          height: 150,
          objectFit: 'cover',
          borderRadius: 34,
          background: '#ffffff',
          border: '1px solid rgba(255,255,255,0.25)',
          transform: `rotate(${Math.sin(lf / 34) * 8}deg) scale(${0.7 + slamIn(lf, 6, 16) * 0.3})`,
          opacity: slamIn(lf, 6, 16),
          filter: 'drop-shadow(0 0 26px rgba(167,139,250,0.75))',
        }}
      />
      {/* comment mock */}
      <div style={{ position: 'absolute', top: 430, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 800,
            background: '#ffffff',
            borderRadius: 34,
            padding: '34px 40px',
            transform: `rotate(-1.2deg) translateY(${(1 - slamIn(lf, 14, 16)) * 50}px)`,
            opacity: slamIn(lf, 14, 16),
            boxShadow: '0 34px 90px rgba(3,6,18,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT_BODY,
                fontWeight: 800,
                fontSize: 34,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              W
            </div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 23, color: '#6b7280' }}>@wewe · sasa hivi</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 52, fontWeight: 800, color: '#0f172a', letterSpacing: '0.06em', marginTop: 4 }}>
                {word.slice(0, n)}
                <span style={{ display: 'inline-block', width: 5, height: 52, background: '#8b5cf6', marginLeft: 5, verticalAlign: '-7px', opacity: cursorOn ? 1 : 0 }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_MONO, fontSize: 26, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', opacity: slamIn(lf, 30) }}>
          andika kwenye comments ↓
        </div>
      </div>
      {/* gradient GEMINI */}
      <div style={{ position: 'absolute', top: 840, left: 0, right: 0, textAlign: 'center' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 720,
            height: 300,
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(closest-side, rgba(139,92,246,0.5), transparent)',
            opacity: slamIn(lf, 70),
          }}
        />
        <Slam
          lf={lf}
          at={70}
          size={196}
          center
          style={{
            backgroundImage: 'linear-gradient(92deg, #60a5fa 5%, #a78bfa 48%, #f472b6 95%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          GEMINI.
        </Slam>
      </div>
      <div style={{ position: 'absolute', top: 1180, left: 0, right: 0, textAlign: 'center' }}>
        <Slam lf={lf} at={98} size={50} center color="#ffffff" font={FONT_BODY} weight={650}>
          nitakutumie PDF kamili — kwa Kiswahili
        </Slam>
        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center', opacity: slamIn(lf, 122), transform: `translateY(${(1 - slamIn(lf, 122)) * 26}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, border: '1.5px solid rgba(255,255,255,0.28)', borderRadius: 16, padding: '16px 28px', background: 'rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: '#f87171', letterSpacing: '0.08em' }}>PDF</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 25, color: 'rgba(255,255,255,0.85)' }}>gemini-4-elements-guide.pdf</span>
          </div>
        </div>
      </div>
      {/* brand row */}
      <div style={{ position: 'absolute', top: 1560, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: slamIn(lf, 150) }}>
        <Img src={staticFile('logo.png')} style={{ width: 62, height: 62, objectFit: 'contain' }} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 26, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em' }}>@altrawaretechnology · 0790942616</span>
      </div>
      <CaptionPill beat={beat} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

const SCENES = [BeatSearch, BeatHydrogen, BeatNeon, BeatCarbon, BeatDeepMind, BeatCTA];

export const AltrawareElementsReelV1 = () => {
  const frame = useCurrentFrame();
  const active = BEATS.find((b) => frame >= b.from && frame < b.to) || BEATS[BEATS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: '#04060c', fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <Scene beat={active} />
      <Audio src={staticFile('audio/voiceover-elements-reel-v3.wav')} />
    </AbsoluteFill>
  );
};

export const RemotionRootElementsV1 = () => (
  <Composition id="AltrawareElementsReelV1" component={AltrawareElementsReelV1} durationInFrames={2100} fps={FPS} width={W} height={H} />
);
