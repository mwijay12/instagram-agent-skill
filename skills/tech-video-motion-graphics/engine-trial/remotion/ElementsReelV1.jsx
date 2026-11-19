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
 * Altraware Elements Reel V1 — "Google Gemini 4: Hydrogen / Neon / Carbon / Argon".
 * 30s @60fps. Visual system: LAB JOURNAL — paper beats alternate with full-bleed
 * real specimen photos (Wikipedia/Unsplash/Pexels free sources) with ken-burns
 * motion, periodic-table tiles, per-element glow accents. Fresh layout — no cards.
 */

const FPS = 60;
const W = 1080;
const H = 1920;

const INK = '#10182b';
const MUTED = '#4b5563';
const PAPER = '#f7f6f2';
const GOLD = '#eab308';
const VIOLET = '#7c3aed';

// Element glow colors (from the real discharge photos)
const H2 = '#e26fb5'; // hydrogen pink-violet
const NE = '#f4361e'; // neon red-orange
const C = '#8fa3bb'; // carbon silver
const AR = '#7a5af8'; // argon violet

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
  { id: 1, from: 0, to: 279, captions: ['Google imetoa models nne mpya za AI —', 'zote kwa majina ya elementi.'] },
  { id: 2, from: 279, to: 500, captions: ['Hydrogen ni ya bure —', 'inatosha kwa kazi za kila siku.'] },
  { id: 3, from: 500, to: 784, captions: ['Neon ndio mpya zaidi: nguvu ya Carbon,', 'kwa kasi ya Flash. Imeingia app wiki hii.'] },
  { id: 4, from: 784, to: 1026, captions: ['Carbon ni kwa kazi ngumu kabisa.', 'Na Argon? Imeshafutwa kwenye app.'] },
  { id: 5, from: 1026, to: 1306, captions: ['Zinatengenezwa na Google DeepMind.', 'Tumia model sahihi kwa kazi sahihi.'] },
  { id: 6, from: 1306, to: 1800, captions: ['Comment neno GEMINI hapo chini —', 'nitakutumie PDF kamili, kwa Kiswahili.'] },
];

/* ------------------------------- atoms ---------------------------------- */

const slamIn = (lf, at, dur = 16) =>
  lf < at
    ? 0
    : spring({ frame: lf - at, fps: FPS, config: { damping: 24, stiffness: 330, mass: 0.75 }, durationInFrames: dur });

const wipe = (lf, at, dur = 12) =>
  lf < at
    ? 0
    : interpolate(lf, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

const DotGrid = ({ color = 'rgba(16,24,43,0.07)', spacing = 46 }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(${color} 1.6px, transparent 1.6px)`,
      backgroundSize: `${spacing}px ${spacing}px`,
    }}
  />
);

const Slam = ({ lf, at, size, color = INK, italic = false, font = FONT_DISPLAY, children, weight = 850, outline = false, stroke = null, ls = '-0.012em' }) => {
  const s = slamIn(lf, at);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 70}px) scale(${0.9 + s * 0.1})`,
        transformOrigin: '0 60%',
        color: outline ? 'transparent' : color,
        WebkitTextStroke: outline ? `3px ${stroke || color}` : undefined,
        fontFamily: font,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        letterSpacing: ls,
        wordSpacing: '0.10em',
        lineHeight: 0.98,
      }}
    >
      {children}
    </div>
  );
};

const HiBar = ({ lf, at, color, textSize = 92, children, ink = INK, padY = 16, padX = 24, skew = -4 }) => {
  const w = wipe(lf, at, 13);
  const s = slamIn(lf, at + 3, 14);
  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: `${padY}px ${padX}px` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: color, transform: `skewX(${skew}deg)` }} />
      <div
        style={{
          position: 'relative',
          opacity: s,
          transform: `translateY(${(1 - s) * 40}px)`,
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

// Periodic-table element tile
const Tile = ({ lf, at, num, sym, name, glow, size = 190, dark = false, struck = false }) => {
  const s = slamIn(lf, at, 15);
  const border = dark ? 'rgba(255,255,255,0.85)' : INK;
  const text = dark ? '#ffffff' : INK;
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${border}`,
        borderRadius: 14,
        position: 'relative',
        opacity: s,
        transform: `scale(${0.7 + s * 0.3}) rotate(${(1 - s) * -6}deg)`,
        background: dark ? 'rgba(16,24,43,0.35)' : '#ffffff',
        boxShadow: `0 18px 44px ${glow}55`,
      }}
    >
      <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: FONT_MONO, fontSize: size * 0.14, color: text, opacity: 0.75 }}>
        {num}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_DISPLAY,
          fontWeight: 900,
          fontSize: size * 0.46,
          color: text,
          letterSpacing: '-0.03em',
        }}
      >
        {sym}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT_MONO,
          fontSize: size * 0.115,
          letterSpacing: '0.16em',
          color: text,
          opacity: 0.85,
        }}
      >
        {name}
      </div>
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: -9, height: 6, background: glow, borderRadius: 3 }} />
      {struck ? (
        <div
          style={{
            position: 'absolute',
            left: -12,
            right: -14,
            top: '50%',
            height: 7,
            background: NE,
            transform: 'rotate(-14deg)',
            borderRadius: 4,
            opacity: 0.95,
          }}
        />
      ) : null}
    </div>
  );
};

// Full-bleed photo plate with ken-burns + legibility scrim
const PhotoPlate = ({ src, lf, zoom = 1.09, x0 = 0, y0 = 0, x1 = 0, y1 = 0, sat = 1.12, bright = 1.0, posY = '50%' }) => {
  const dur = 300;
  const scale = interpolate(lf, [0, dur], [1.0, zoom], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const dx = interpolate(lf, [0, dur], [x0, x1], { extrapolateRight: 'clamp' });
  const dy = interpolate(lf, [0, dur], [y0, y1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#05070d' }}>
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: -60,
          width: '120%',
          height: '120%',
          objectFit: 'cover',
          objectPosition: `50% ${posY}`,
          transform: `scale(${scale}) translate(${dx}px, ${dy}px)`,
          filter: `saturate(${sat}) contrast(1.06) brightness(${bright})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,7,12,0.55) 0%, rgba(5,7,12,0.12) 30%, rgba(5,7,12,0.10) 55%, rgba(5,7,12,0.72) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const TopTag = ({ label, dark = false }) => (
  <div style={{ position: 'absolute', top: 92, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 16, height: 16, background: GOLD }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 23, letterSpacing: '0.22em', color: dark ? '#ffffff' : INK }}>ALTRAWARE TECH</span>
    </div>
    <span style={{ fontFamily: FONT_MONO, fontSize: 23, letterSpacing: '0.18em', color: dark ? 'rgba(255,255,255,0.75)' : MUTED }}>{label}</span>
  </div>
);

const CaptionBar = ({ beat, dark = false }) => {
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
        zIndex: 10,
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${GOLD}, ${VIOLET})` }} />
      <div style={{ color: '#ffffff', fontFamily: FONT_BODY, fontSize: 36, fontWeight: 650, textAlign: 'center', letterSpacing: '0.01em' }}>
        {beat.captions[idx]}
      </div>
    </div>
  );
};

const NewsChip = ({ lf, at, text, glow }) => {
  const s = slamIn(lf, at, 14);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        border: `2px solid ${INK}`,
        borderRadius: 999,
        padding: '12px 26px',
        background: '#ffffff',
        opacity: s,
        transform: `translateY(${(1 - s) * 30}px)`,
        boxShadow: `0 10px 30px ${glow}44`,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 999, background: glow }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.14em', color: INK }}>{text}</span>
    </div>
  );
};

/* -------------------------------- beats --------------------------------- */

// B1 — hook: Google logo halisi + tiles
const BeatHook = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const logo = slamIn(lf, 2, 16);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <DotGrid />
      <TopTag label="01 — 06" />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 250 }}>
        <NewsChip lf={lf} at={4} text="NOV 2026 · GEMINI 4 · INARENDA" glow={NE} />
        {/* Google wordmark halisi */}
        <div
          style={{
            marginTop: 44,
            background: '#ffffff',
            border: `3px solid ${INK}`,
            borderRadius: 22,
            padding: '34px 40px',
            width: 640,
            opacity: logo,
            transform: `translateY(${(1 - logo) * 50}px) rotate(-1.2deg)`,
            boxShadow: '0 26px 60px rgba(16,24,43,0.16)',
          }}
        >
          <Img src={staticFile('elements/google-logo.png')} style={{ width: '100%', display: 'block' }} />
        </div>
        <div style={{ marginTop: 52 }}>
          <Slam lf={lf} at={30} size={96}>
            IMEGEUKIA
          </Slam>
          <div style={{ marginTop: 8 }}>
            <HiBar lf={lf} at={48} color={GOLD} textSize={104}>
              KEMIKALI.
            </HiBar>
          </div>
        </div>
        <Slam lf={lf} at={92} size={44} color={MUTED} font={FONT_BODY} weight={550} ls="0">
          Models nne mpya za AI, majina ya elementi.
        </Slam>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1230, display: 'flex', justifyContent: 'space-between' }}>
        <Tile lf={lf} at={130} num="1" sym="H" name="HYDROGEN" glow={H2} />
        <Tile lf={lf} at={148} num="10" sym="Ne" name="NEON" glow={NE} />
        <Tile lf={lf} at={166} num="6" sym="C" name="CARBON" glow={C} />
        <Tile lf={lf} at={184} num="18" sym="Ar" name="ARGON" glow={AR} struck />
      </div>
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B2 — hydrogen full-bleed
const BeatHydrogen = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  return (
    <AbsoluteFill>
      <PhotoPlate src="elements/hydrogen.jpg" lf={lf} zoom={1.12} y0={-18} y1={18} />
      <TopTag label="02 — 06" dark />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 340 }}>
        <Tile lf={lf} at={6} num="1" sym="H" name="HYDROGEN" glow={H2} size={210} dark />
        <div style={{ marginTop: 60 }}>
          <Slam lf={lf} at={24} size={168} color="#ffffff">
            HYDROGEN
          </Slam>
        </div>
        <div style={{ marginTop: 46, display: 'flex', gap: 22 }}>
          <HiBar lf={lf} at={60} color={H2} textSize={74} ink="#10182b">
            BURE KABISA
          </HiBar>
          <HiBar lf={lf} at={78} color="#ffffff" textSize={74} ink="#10182b">
            YA KILA SIKU
          </HiBar>
        </div>
        <Slam lf={lf} at={120} size={48} color="rgba(255,255,255,0.92)" italic font={FONT_BODY} weight={500} ls="0">
          inatosha kwa kazi za kila siku.
        </Slam>
      </div>
      <CaptionBar beat={beat} dark />
    </AbsoluteFill>
  );
};

// B3 — neon hero full-bleed
const BeatNeon = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const pulse = 0.5 + 0.5 * Math.sin(lf / 14);
  return (
    <AbsoluteFill>
      <PhotoPlate src="elements/neon-sign2.jpg" lf={lf} zoom={1.08} x0={-10} x1={10} sat={1.25} bright={1.18} posY="38%" />
      <TopTag label="03 — 06" dark />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 320 }}>
        <NewsChip lf={lf} at={4} text="MPYA ZAIDI — WIKI HII" glow={NE} />
        <div style={{ marginTop: 50, position: 'relative' }}>
          <Slam lf={lf} at={16} size={236} color="#ffffff">
            NEON
          </Slam>
          <div
            style={{
              position: 'absolute',
              left: -10,
              right: -10,
              top: -18,
              bottom: -18,
              borderRadius: 24,
              boxShadow: `0 0 ${60 + pulse * 50}px ${NE}66`,
              pointerEvents: 'none',
            }}
          />
        </div>
        <div style={{ marginTop: 64 }}>
          <Slam lf={lf} at={70} size={76} color="#ffffff">
            NGUVU YA CARBON.
          </Slam>
          <div style={{ marginTop: 18 }}>
            <HiBar lf={lf} at={92} color={NE} textSize={80} ink="#ffffff">
              KASI YA FLASH.
            </HiBar>
          </div>
        </div>
        <div style={{ marginTop: 30, opacity: slamIn(lf, 150), transform: `translateY(${(1 - slamIn(lf, 150)) * 30}px)` }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 38, fontWeight: 600, letterSpacing: '0.04em', color: '#ffffff', background: 'rgba(16,24,43,0.72)', padding: '14px 26px', borderRadius: 999 }}>
            imewekwa app kwa Pro · inachukua nafasi ya Argon
          </span>
        </div>
      </div>
      <CaptionBar beat={beat} dark />
    </AbsoluteFill>
  );
};

// B4 — carbon + argon (imeondolewa)
const BeatCarbon = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const stamp = slamIn(lf, 120, 12);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <DotGrid />
      <TopTag label="04 — 06" />
      {/* Carbon plate */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 240, height: 560, borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 70px rgba(16,24,43,0.28)', opacity: slamIn(lf, 6, 16) }}>
        <Img src={staticFile('elements/carbon.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(lf, [6, 280], [1, 1.08], { extrapolateRight: 'clamp' })})` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,7,12,0.62) 0%, rgba(5,7,12,0.18) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', left: 44, top: 46 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.9)' }}>6 · C · CARBON</div>
          <Slam lf={lf} at={18} size={96} color="#ffffff">
            KAZI NGUMU
          </Slam>
          <Slam lf={lf} at={34} size={96} color="#ffffff">
            KABISA.
          </Slam>
        </div>
        <div style={{ position: 'absolute', left: 44, bottom: 40, fontFamily: FONT_MONO, fontSize: 24, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.95)' }}>
          code · analysis · long-horizon
        </div>
      </div>
      {/* Argon plate */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 880, height: 480, borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 70px rgba(16,24,43,0.22)', opacity: slamIn(lf, 66, 16) }}>
        <Img src={staticFile('elements/argon.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.75) brightness(0.9)', transform: `scale(${interpolate(lf, [66, 300], [1, 1.06], { extrapolateRight: 'clamp' })})` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,7,12,0.72) 0%, rgba(5,7,12,0.2) 70%, transparent 100%)' }} />
        <div style={{ position: 'absolute', left: 44, top: 60 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)' }}>18 · Ar · ARGON</div>
          <Slam lf={lf} at={78} size={76} color="#ffffff">
            ILIKUWA HAPA.
          </Slam>
        </div>
        {/* stamp */}
        <div
          style={{
            position: 'absolute',
            right: 52,
            top: 120,
            border: `6px solid ${NE}`,
            borderRadius: 14,
            padding: '16px 30px',
            transform: `rotate(-11deg) scale(${0.7 + stamp * 0.3})`,
            opacity: stamp,
            background: 'rgba(16,24,43,0.35)',
          }}
        >
          <div style={{ fontFamily: FONT_MONO, fontSize: 40, fontWeight: 700, letterSpacing: '0.1em', color: NE }}>IMEONDOLEWA</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 24, color: 'rgba(255,255,255,0.9)', marginTop: 6 }}>miezi miwili tu</div>
        </div>
      </div>
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

// B5 — Google DeepMind lab + meaning
const BeatMeaning = ({ beat }) => {
  const frame = useCurrentFrame();
  const lf = frame - beat.from;
  const shot = slamIn(lf, 4, 18);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <DotGrid />
      <TopTag label="05 — 06" />
      {/* DeepMind office photo card */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 250,
          height: 640,
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 34px 80px rgba(16,24,43,0.3)',
          border: `3px solid ${INK}`,
          opacity: shot,
          transform: `translateY(${(1 - shot) * 60}px) rotate(-1deg)`,
        }}
      >
        <Img
          src={staticFile('elements/deepmind-office.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 30%',
            transform: `scale(${interpolate(lf, [4, 270], [1.02, 1.1], { extrapolateRight: 'clamp' })})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            background: 'rgba(16,24,43,0.85)',
            borderRadius: 999,
            padding: '12px 26px',
            fontFamily: FONT_MONO,
            fontSize: 26,
            letterSpacing: '0.1em',
            color: '#ffffff',
          }}
        >
          GOOGLE DEEPMIND · LONDON
        </div>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1000 }}>
        <Slam lf={lf} at={60} size={44} color={MUTED} font={FONT_MONO} weight={500} ls="0.12em">
          MAANA YAKE KWA WEWE
        </Slam>
        <div style={{ marginTop: 30 }}>
          <Slam lf={lf} at={78} size={100}>
            MODEL SAHIHI,
          </Slam>
          <div style={{ marginTop: 8 }}>
            <HiBar lf={lf} at={100} color={GOLD} textSize={100}>
              KAZI SAHIHI.
            </HiBar>
          </div>
        </div>
        <Slam lf={lf} at={150} size={42} color={MUTED} italic font={FONT_BODY} weight={500} ls="0">
          usilipie nguvu ya Carbon kazi ya Hydrogen.
        </Slam>
      </div>
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
    <AbsoluteFill style={{ background: PAPER }}>
      <DotGrid />
      <TopTag label="06 — 06" />
      <div style={{ position: 'absolute', left: 72, right: 72, top: 290 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: brand, transform: `translateY(${(1 - brand) * 26}px)` }}>
          <Img src={staticFile('logo.png')} style={{ width: 76, height: 76, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 34, color: INK, letterSpacing: '0.14em' }}>ALTRAWARE TECH</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 25, color: MUTED, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
              @altrawaretechnology · 0790942616
            </div>
          </div>
        </div>
        <div style={{ marginTop: 70 }}>
          <Slam lf={lf} at={28} size={58} color={MUTED} font={FONT_BODY} weight={550} ls="0">
            Unataka kuzielewa zote?
          </Slam>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 24 }}>
            <Slam lf={lf} at={48} size={58} color={MUTED} font={FONT_BODY} weight={550} ls="0">
              Comment neno
            </Slam>
            <Img
              src={staticFile('elements/gemini-sparkle.png')}
              style={{
                width: 92,
                height: 86,
                objectFit: 'contain',
                opacity: slamIn(lf, 56, 14),
                transform: `rotate(${(1 - slamIn(lf, 56, 14)) * -40}deg) scale(${0.6 + slamIn(lf, 56, 14) * 0.4})`,
              }}
            />
          </div>
          <div style={{ marginTop: 18 }}>
            <HiBar lf={lf} at={68} color={VIOLET} textSize={196} ink="#ffffff" padY={22} padX={34}>
              GEMINI.
            </HiBar>
          </div>
        </div>
        <div style={{ marginTop: 56 }}>
          <HiBar lf={lf} at={130} color={GOLD} textSize={66}>
            NITAKUTUMIE PDF KAMILI.
          </HiBar>
        </div>
        <Slam lf={lf} at={170} size={38} color={MUTED} italic font={FONT_BODY} weight={500} ls="0">
          kwa Kiswahili — bure.
        </Slam>
      </div>
      <div style={{ position: 'absolute', left: 72, right: 72, top: 1440, display: 'flex', justifyContent: 'space-between' }}>
        <Tile lf={lf} at={200} num="1" sym="H" name="HYDROGEN" glow={H2} size={150} />
        <Tile lf={lf} at={212} num="10" sym="Ne" name="NEON" glow={NE} size={150} />
        <Tile lf={lf} at={224} num="6" sym="C" name="CARBON" glow={C} size={150} />
        <Tile lf={lf} at={236} num="18" sym="Ar" name="ARGON" glow={AR} size={150} struck />
      </div>
      <CaptionBar beat={beat} />
    </AbsoluteFill>
  );
};

const SCENES = [BeatHook, BeatHydrogen, BeatNeon, BeatCarbon, BeatMeaning, BeatCTA];

export const AltrawareElementsReelV1 = () => {
  const frame = useCurrentFrame();
  const active = BEATS.find((b) => frame >= b.from && frame < b.to) || BEATS[BEATS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <Scene beat={active} />
      <Audio src={staticFile('audio/voiceover-elements-reel-v2.wav')} />
    </AbsoluteFill>
  );
};

export const RemotionRootElementsV1 = () => (
  <Composition
    id="AltrawareElementsReelV1"
    component={AltrawareElementsReelV1}
    durationInFrames={1800}
    fps={FPS}
    width={W}
    height={H}
  />
);
