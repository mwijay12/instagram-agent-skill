import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// V4 WHITE-DOMINANT REEL — Altraware Tech / Websites
// Owner correction after V3: white should dominate for sun readability; slow the
// TTS down; use a male voice trial; prices must be spoken/written in Swahili
// words; replace the English planning term with "kufahamu kazi"; whole video < 25 seconds.
// All readable text, code, numbers, captions, timing and brand marks come from
// BEATS[] + timeline-v4.json. Generated PNGs are low-frequency plates/elements
// only; SVGs are deterministic decorative elements. Frame-driven only.

const C = {
  navy: '#071022',
  ink: '#10182b',
  paper: '#f7f6f2',
  white: '#ffffff',
  gold: '#eab308',
  goldInk: '#92400e',
  violet: '#7c3aed',
  violetInk: '#6d28d9',
  greenInk: '#047857',
  muted: '#56627a',
  line: 'rgba(16,24,43,0.12)',
  card: 'rgba(255,255,255,0.88)',
};

const FONT_DISPLAY = '"Fraunces", Georgia, serif';
const FONT_BODY = '"Inter", Arial, sans-serif';
const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';

const fontCss = `
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-normal.ttf')}') format('truetype');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-italic.ttf')}') format('truetype');font-weight:100 900;font-style:italic;font-display:swap}
@font-face{font-family:'Inter';src:url('${staticFile('fonts/inter-latin-wght-normal.ttf')}') format('truetype');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('${staticFile('fonts/jetbrains-mono-latin-wght-normal.ttf')}') format('truetype');font-weight:100 900;font-style:normal;font-display:swap}
`;

// 23.5s @ 60fps = 1410 frames. Beat boundaries follow the slower male TTS clips.
const BEATS = [
  {
    id: 1,
    label: 'SIMU KWANZA',
    from: 0,
    to: 114,
    kicker: 'TOVUTI / WEBSITE',
    eyebrow: 'MWANZO',
    titleLines: ['Mteja yuko', 'kwenye simu.'],
    subtitle: 'Jibu la haraka, si banner.',
    mode: 'white',
    pills: [
      { text: 'KISWAHILI', color: C.goldInk, delay: 0 },
      { text: 'MOBILE-FIRST', color: C.violetInk, delay: 4 },
    ],
    phoneBrand: 'ALTRAWARE TECH',
    phoneQuestions: ['Unafanya nini?', 'Bei gani?', 'Wasiliana vipi?'],
    answerChip: 'JIBU LA HARAKA',
    phoneFoot: 'Inaonekana mara moja kwenye simu.',
    captions: ['Mteja yuko kwenye simu.'],
  },
  {
    id: 2,
    label: 'MASWALI 3',
    from: 114,
    to: 291,
    kicker: 'USIIACHE IKIWA KIMYA',
    eyebrow: 'MASWALI MATATU',
    titleLines: ['Simu inauliza', 'maswali matatu.'],
    subtitle: 'Majibu wazi, bila kutafuta sana.',
    mode: 'paper',
    items: [
      { n: '01', q: 'UNAFANYA NINI?', sub: 'Huduma / bidhaa', tint: C.violet },
      { n: '02', q: 'BEI GANI?', sub: 'Bei ya kuanzia', tint: C.gold },
      { n: '03', q: 'WASILIANA VIPI?', sub: 'Simu / WhatsApp / form', tint: C.greenInk },
    ],
    captions: [
      'Unafanya nini? Bei gani?',
      'Wasiliana vipi? Majibu yawe wazi.',
    ],
  },
  {
    id: 3,
    label: 'LUGHA / CODE',
    from: 291,
    to: 489,
    kicker: 'BUILT FOR TZ',
    eyebrow: 'LUGHA / LANGUAGE',
    titleLines: ['Tovuti si', 'picha tu.'],
    subtitle: 'HTML · viewport · title ya brand',
    mode: 'white',
    langChips: ['KISWAHILI', 'ENGLISH'],
    codeLines: [
      { id: '01', tokens: [['TAG', '<html'], ['ATTR', ' lang='], ['STR', '"sw"'], ['TAG', '>']] },
      { id: '02', tokens: [['TAG', '<meta'], ['ATTR', ' name='], ['STR', '"viewport"'], ['TAG', '>']] },
      { id: '03', tokens: [['TAG', '<title'], ['ATTR', '>'], ['STR', 'Altraware Tech'], ['TAG', '</title>']] },
    ],
    pills: [
      { text: 'HTML LANG="SW"', color: C.goldInk, delay: 0 },
      { text: 'VIEWPORT', color: C.violetInk, delay: 4 },
      { text: 'TITLE', color: C.greenInk, delay: 8 },
    ],
    captions: [
      'Kiswahili + English, muundo safi.',
      'HTML, viewport, title ya brand.',
    ],
  },
  {
    id: 4,
    label: 'BEI WAZI',
    from: 489,
    to: 927,
    kicker: 'BEI YA KUANZIA',
    eyebrow: 'BEI KWA MANENO',
    titleLines: ['Anza na bei', 'iliyo wazi.'],
    subtitle: 'Shilingi kwa maneno, si namba ngumu.',
    mode: 'white',
    priceRows: [
      { name: 'WEB STARTER', price: 'Laki tatu na nusu', note: 'Kuanzia', accent: C.violet },
      { name: 'GROWTH', price: 'Laki tano na nusu', note: 'Kuanzia', accent: C.gold },
      { name: 'CUSTOM', price: 'Laki nane', note: 'Kuanzia', accent: C.greenInk },
    ],
    priceNoteStrong: 'Bei kamili huandikwa baada ya kufahamu kazi yako.',
    priceNoteRest: 'Care Plan shilingi elfu tisini na tisa kwa mwezi ni huduma tofauti, si SaaS.',
    captions: [
      'Kuanzia laki tatu na nusu, laki tano na nusu, laki nane.',
      'Bei kamili baada ya kufahamu kazi yako.',
      'Care Plan ni huduma tofauti, si SaaS.',
    ],
  },
  {
    id: 5,
    label: 'MILIKI / CTA',
    from: 927,
    to: 1410,
    kicker: 'FAIDA CORE IS LICENSED',
    eyebrow: 'UMILIKI · OWNERSHIP',
    titleLines: ['Umiliki wazi.'],
    subtitle: 'Data yako · tovuti/app yako · leseni ya Faida',
    mode: 'white',
    brandName: 'Altraware Tech',
    brandLine: 'Websites · Kiswahili + English · mobile-first',
    ownership: 'Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.',
    tagline: 'Built in Tanzania, for how Tanzania really works.',
    pills: [
      { text: '@altrawaretechnology', color: C.violetInk, delay: 0 },
      { text: '0790942616', color: C.goldInk, delay: 4 },
    ],
    link: 'altra.tanzaniareach.com',
    ctaPre: 'Comment neno',
    ctaKeyword: 'TOVUTI',
    captions: [
      'Unamiliki data yako na tovuti/app yako;',
      'msingi wa Faida unatolewa kwa leseni.',
      'Unahitaji tovuti leo? Comment neno TOVUTI.',
    ],
  },
];

const FPS = 60;
const W = 1080;
const H = 1920;
const SAFE = { l: 96, r: 96, t: 170, b: 220 };

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const softStep = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

const useBeat = (beat) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - beat.from;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 20, stiffness: 160, mass: 0.9 },
    durationInFrames: 24,
  });
  const exit = softStep(frame, beat.to - 16, beat.to - 1);
  const camera = interpolate(frame, [beat.from, beat.to], [1.0, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { frame, local, enter, exit, camera };
};

const Background = ({ mode, beat }) => {
  const { frame, camera } = useBeat(beat);
  const plate = mode === 'paper'
    ? staticFile('plates/12-clean-paper.png')
    : staticFile('plates/15-clean-white.png');
  const drift = interpolate(frame, [beat.from, beat.to], [0, -12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.white, overflow: 'hidden' }}>
      <Img
        src={plate}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: mode === 'paper' ? 0.94 : 0.97,
          transform: `scale(${camera}) translateY(${drift}px)`,
          transformOrigin: '50% 40%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: 250,
          bottom: 300,
          borderRadius: 56,
          background: 'rgba(255,255,255,0.84)',
          border: `1px solid ${C.line}`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 22px 70px rgba(16,24,43,0.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 12,
          background: `linear-gradient(90deg, ${C.gold} 0%, ${C.violet} 52%, transparent 100%)`,
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

const BeatLabel = ({ beat }) => {
  const { enter, exit } = useBeat(beat);
  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE.t - 74,
        left: SAFE.l,
        right: SAFE.r,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * -16}px)`,
        color: C.ink,
        fontFamily: FONT_MONO,
        fontSize: 22,
        letterSpacing: '0.18em',
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 12, background: C.violet }} />
      <span style={{ opacity: 0.62 }}>ALTRAWARE TECH</span>
      <span style={{ width: 34, height: 2, background: C.line }} />
      <span>{beat.kicker}</span>
    </div>
  );
};

const CaptionLines = ({ beat }) => {
  const frame = useCurrentFrame();
  const { enter, exit } = useBeat(beat);
  const span = (beat.to - beat.from) / beat.captions.length;
  const raw = Math.floor((frame - beat.from) / span);
  const idx = Math.max(0, Math.min(beat.captions.length - 1, raw));
  const text = beat.captions[idx];
  const lineIn = softStep(frame, beat.from + idx * span, beat.from + idx * span + 8);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: SAFE.b - 92,
        left: SAFE.l,
        right: SAFE.r,
        display: 'flex',
        justifyContent: 'center',
        opacity: enter * (1 - exit),
      }}
    >
      <div
        style={{
          padding: '18px 30px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.94)',
          border: `1px solid ${C.line}`,
          color: C.ink,
          fontFamily: FONT_BODY,
          fontSize: 30,
          lineHeight: 1.35,
          fontWeight: 560,
          textAlign: 'center',
          maxWidth: 880,
          boxShadow: '0 18px 54px rgba(16,24,43,0.10)',
          opacity: lineIn,
          transform: `translateY(${(1 - lineIn) * 12}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const SvgOrb = ({ src, size, x, y, rotate = 0, opacity = 1, beat }) => {
  const { frame, enter, exit, camera } = useBeat(beat);
  const spin = interpolate(frame, [beat.from, beat.to], [0, 18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        opacity: opacity * enter * (1 - exit * 0.65),
        transform: `rotate(${rotate + spin + (camera - 1) * 10}deg) scale(${0.94 + enter * 0.06})`,
        filter: 'drop-shadow(0 0 18px rgba(124,58,237,0.14))',
      }}
    />
  );
};

const PngFragment = ({ src, size, x, y, opacity = 0.1, beat, rotate = 0 }) => {
  const { frame, enter, exit, camera } = useBeat(beat);
  const drift = interpolate(frame, [beat.from, beat.to], [0, 24], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        left: x,
        top: y + drift,
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: 60,
        opacity: opacity * enter * (1 - exit * 0.5),
        mixBlendMode: 'multiply',
        transform: `rotate(${rotate}deg) scale(${camera * 0.98})`,
      }}
    />
  );
};

const CleanBase = ({ beat, children }) => (
  <AbsoluteFill>
    <Background mode={beat.mode} beat={beat} />
    <BeatLabel beat={beat} />
    {children}
    <CaptionLines beat={beat} />
  </AbsoluteFill>
);

const Pill = ({ text, color, delay = 0, beat }) => {
  const { frame } = useBeat(beat);
  const s = softStep(frame, beat.from + 14 + delay, beat.from + 32 + delay);
  return (
    <span
      style={{
        padding: '14px 22px',
        borderRadius: 18,
        background: 'rgba(16,24,43,0.04)',
        border: `1px solid ${color}66`,
        color,
        fontFamily: FONT_MONO,
        fontSize: 22,
        letterSpacing: '0.08em',
        fontVariantNumeric: 'tabular-nums',
        opacity: s,
        transform: `translateY(${(1 - s) * 12}px)`,
      }}
    >
      {text}
    </span>
  );
};

/* ----------------------------- BEAT 1 ----------------------------- */

const PhoneHeroWhite = ({ beat }) => {
  const { enter, camera } = useBeat(beat);
  const glow = 0.5 + 0.5 * Math.sin((useCurrentFrame() - beat.from) / 16);
  return (
    <CleanBase beat={beat}>
      <PngFragment
        src={staticFile('plates/16-white-gold-orb.png')}
        size={430}
        x={690}
        y={980}
        opacity={0.12}
        beat={beat}
        rotate={-8}
      />
      <div
        style={{
          position: 'absolute',
          left: SAFE.l,
          right: SAFE.r,
          top: 320,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 32}px)`,
        }}
      >
        <div style={{ color: C.goldInk, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 28,
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontSize: 88,
            lineHeight: 1.02,
            fontWeight: 720,
            letterSpacing: '-0.035em',
          }}
        >
          {beat.titleLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ marginTop: 22, color: C.muted, fontFamily: FONT_BODY, fontSize: 28 }}>
          {beat.subtitle}
        </div>
        <div style={{ marginTop: 30, display: 'flex', gap: 12 }}>
          {beat.pills.map((p) => (
            <Pill key={p.text} text={p.text} color={p.color} beat={beat} delay={p.delay} />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 280,
          top: 720,
          width: 520,
          height: 1040,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 40}px) scale(${1 + (camera - 1) * 0.2})`,
          transformOrigin: '50% 30%',
        }}
      >
        <Img
          src={staticFile('elements/phone-frame-ink.svg')}
          style={{ width: 520, height: 1040, filter: 'drop-shadow(0 30px 70px rgba(16,24,43,0.14))' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 74,
            right: 74,
            top: 74,
            bottom: 108,
            borderRadius: 30,
            background: C.white,
            border: `1px solid ${C.line}`,
            padding: '42px 30px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: C.gold }} />
            <div style={{ color: C.muted, fontFamily: FONT_MONO, fontSize: 19, letterSpacing: '0.14em' }}>
              {beat.phoneBrand}
            </div>
          </div>
          <div
            style={{
              marginTop: 50,
              color: C.ink,
              fontFamily: FONT_DISPLAY,
              fontSize: 34,
              lineHeight: 1.34,
            }}
          >
            {beat.phoneQuestions.map((q) => (
              <div key={q}>{q}</div>
            ))}
          </div>
          <div
            style={{
              marginTop: 38,
              display: 'inline-flex',
              padding: '12px 18px',
              borderRadius: 16,
              border: `1px solid ${C.goldInk}55`,
              background: 'rgba(234,179,8,0.10)',
              color: C.goldInk,
              fontFamily: FONT_MONO,
              fontSize: 19,
              letterSpacing: '0.12em',
              opacity: 0.82 + glow * 0.16,
            }}
          >
            {beat.answerChip}
          </div>
          <div style={{ marginTop: 28, color: C.muted, fontFamily: FONT_BODY, fontSize: 23 }}>
            {beat.phoneFoot}
          </div>
        </div>
      </div>

      <SvgOrb
        src={staticFile('elements/signal-arc-ink.svg')}
        size={190}
        x={830}
        y={420}
        rotate={8}
        opacity={0.42}
        beat={beat}
      />
    </CleanBase>
  );
};

/* ----------------------------- BEAT 2 ----------------------------- */

const QuestionCardsWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  return (
    <CleanBase beat={beat}>
      <PngFragment
        src={staticFile('plates/17-white-violet-ribbon.png')}
        size={480}
        x={650}
        y={1080}
        opacity={0.09}
        beat={beat}
        rotate={6}
      />
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 320, opacity: enter }}>
        <div style={{ color: C.violetInk, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 26,
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontSize: 76,
            lineHeight: 1.04,
            fontWeight: 720,
            letterSpacing: '-0.03em',
          }}
        >
          {beat.titleLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ marginTop: 20, color: C.muted, fontFamily: FONT_BODY, fontSize: 28 }}>
          {beat.subtitle}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 116, right: 116, top: 700 }}>
        {beat.items.map((it, i) => {
          const s = softStep(frame, beat.from + 10 + i * 4, beat.from + 34 + i * 4);
          return (
            <div
              key={it.n}
              style={{
                marginBottom: 30,
                padding: '38px 42px',
                borderRadius: 38,
                background: C.card,
                border: `1px solid ${C.line}`,
                boxShadow: '0 20px 56px rgba(16,24,43,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: 32,
                opacity: s,
                transform: `translateX(${(1 - s) * 48}px) scale(${0.97 + s * 0.03})`,
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 26,
                  background: it.tint,
                  color: it.tint === C.gold ? C.ink : C.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_MONO,
                  fontSize: 32,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {it.n}
              </div>
              <div>
                <div style={{ color: C.ink, fontFamily: FONT_BODY, fontSize: 40, fontWeight: 760 }}>
                  {it.q}
                </div>
                <div style={{ marginTop: 8, color: C.muted, fontFamily: FONT_BODY, fontSize: 25 }}>
                  {it.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SvgOrb
        src={staticFile('elements/node-graph-ink.svg')}
        size={160}
        x={830}
        y={340}
        rotate={-8}
        opacity={0.28}
        beat={beat}
      />
    </CleanBase>
  );
};

/* ----------------------------- BEAT 3 ----------------------------- */

const LanguageCodeWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  return (
    <CleanBase beat={beat}>
      <PngFragment
        src={staticFile('plates/17-white-violet-ribbon.png')}
        size={500}
        x={640}
        y={1120}
        opacity={0.08}
        beat={beat}
        rotate={-6}
      />
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 310, opacity: enter }}>
        <div style={{ color: C.goldInk, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 26,
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
          }}
        >
          {beat.titleLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ marginTop: 18, color: C.muted, fontFamily: FONT_BODY, fontSize: 28 }}>
          {beat.subtitle}
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          {beat.langChips.map((chip, i) => (
            <Pill key={chip} text={chip} color={i === 0 ? C.goldInk : C.violetInk} beat={beat} delay={i * 4} />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 108,
          right: 108,
          top: 720,
          padding: '38px 36px',
          borderRadius: 40,
          background: C.card,
          border: `1px solid ${C.line}`,
          boxShadow: '0 26px 70px rgba(16,24,43,0.08)',
          opacity: enter,
          transform: `translateY(${(1 - enter) * 28}px)`,
        }}
      >
        {beat.codeLines.map((line, i) => {
          const focus = clamp01(
            interpolate(frame, [beat.from + 18 + i * 20, beat.from + 36 + i * 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }) -
              interpolate(frame, [beat.from + 78 + i * 20, beat.from + 104 + i * 20], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
          );
          return (
            <div
              key={line.id}
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'baseline',
                padding: '14px 16px',
                borderRadius: 16,
                background: `rgba(124,58,237,${0.02 + focus * 0.10})`,
                border: `1px solid rgba(234,179,8,${focus * 0.28})`,
                opacity: 0.52 + focus * 0.48,
                transform: `translateX(${focus * 8}px)`,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  color: C.muted,
                  fontFamily: FONT_MONO,
                  fontSize: 21,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {line.id}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 25, whiteSpace: 'nowrap' }}>
                {line.tokens.map(([kind, text], j) => (
                  <span
                    key={`${line.id}-${j}`}
                    style={{
                      color:
                        kind === 'TAG'
                          ? C.violetInk
                          : kind === 'ATTR'
                            ? C.goldInk
                            : kind === 'STR'
                              ? C.greenInk
                              : C.ink,
                      opacity: 0.6 + focus * 0.4,
                      transform: `translateY(${(1 - focus) * (j % 2 === 0 ? 3 : -3)}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {text}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {beat.pills.map((p) => (
            <Pill key={p.text} text={p.text} color={p.color} beat={beat} delay={p.delay} />
          ))}
        </div>
      </div>

      <SvgOrb
        src={staticFile('elements/code-brackets-ink.svg')}
        size={160}
        x={840}
        y={380}
        rotate={10}
        opacity={0.32}
        beat={beat}
      />
    </CleanBase>
  );
};

/* ----------------------------- BEAT 4 ----------------------------- */

const PricesWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  return (
    <CleanBase beat={beat}>
      <PngFragment
        src={staticFile('plates/16-white-gold-orb.png')}
        size={400}
        x={720}
        y={1060}
        opacity={0.1}
        beat={beat}
        rotate={8}
      />
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 310, opacity: enter }}>
        <div style={{ color: C.violetInk, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 24,
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontSize: 74,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
          }}
        >
          {beat.titleLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ marginTop: 18, color: C.muted, fontFamily: FONT_BODY, fontSize: 27 }}>
          {beat.subtitle}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 116, right: 116, top: 680 }}>
        {beat.priceRows.map((r, i) => {
          const s = softStep(frame, beat.from + 10 + i * 4, beat.from + 36 + i * 4);
          return (
            <div
              key={r.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '34px 40px',
                marginBottom: 22,
                borderRadius: 34,
                background: C.card,
                border: `1px solid ${C.line}`,
                boxShadow: '0 18px 50px rgba(16,24,43,0.06)',
                opacity: s,
                transform: `translateY(${(1 - s) * 30}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <div style={{ width: 10, height: 58, borderRadius: 10, background: r.accent }} />
                <div>
                  <div style={{ color: C.ink, fontFamily: FONT_BODY, fontSize: 35, fontWeight: 760 }}>
                    {r.name}
                  </div>
                  <div style={{ color: C.muted, fontFamily: FONT_BODY, fontSize: 23, marginTop: 4 }}>
                    {r.note}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: C.ink,
                  fontFamily: FONT_DISPLAY,
                  fontSize: 34,
                  fontWeight: 680,
                  textAlign: 'right',
                }}
              >
                {r.price}
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 14,
            padding: '26px 34px',
            borderRadius: 28,
            background: 'rgba(124,58,237,0.07)',
            border: `1px solid ${C.violet}33`,
            color: C.ink,
            fontFamily: FONT_BODY,
            fontSize: 26,
            lineHeight: 1.42,
            opacity: softStep(frame, beat.from + 54, beat.from + 86),
          }}
        >
          <strong>{beat.priceNoteStrong}</strong>
          <br />
          {beat.priceNoteRest}
        </div>
      </div>
    </CleanBase>
  );
};

/* ----------------------------- BEAT 5 ----------------------------- */

const OwnershipCTAWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const reveal = softStep(frame, beat.from + 30, beat.from + 72);
  const cta = softStep(frame, beat.from + 110, beat.from + 148);
  return (
    <CleanBase beat={beat}>
      <div style={{ position: 'absolute', left: 104, right: 104, top: 300, opacity: enter }}>
        <div style={{ color: C.goldInk, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 28,
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
          }}
        >
          {beat.titleLines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div style={{ marginTop: 18, color: C.muted, fontFamily: FONT_BODY, fontSize: 27 }}>
          {beat.subtitle}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 132,
          right: 132,
          top: 700,
          padding: '46px 42px',
          borderRadius: 44,
          background: C.card,
          border: `1px solid ${C.line}`,
          boxShadow: '0 26px 70px rgba(16,24,43,0.08)',
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 28}px)`,
        }}
      >
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Img src={staticFile('logo.png')} style={{ width: 88, height: 88, objectFit: 'contain' }} />
          <div>
            <div style={{ color: C.ink, fontFamily: FONT_BODY, fontSize: 37, fontWeight: 720 }}>
              {beat.brandName}
            </div>
            <div style={{ color: C.muted, fontFamily: FONT_BODY, fontSize: 23, marginTop: 6 }}>
              {beat.brandLine}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            color: C.ink,
            fontFamily: FONT_BODY,
            fontSize: 28,
            lineHeight: 1.42,
          }}
        >
          {beat.ownership}
        </div>
        <div
          style={{
            marginTop: 26,
            color: C.violetInk,
            fontFamily: FONT_DISPLAY,
            fontSize: 31,
            fontStyle: 'italic',
          }}
        >
          {beat.tagline}
        </div>
        <div
          style={{
            marginTop: 26,
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            fontFamily: FONT_MONO,
            fontSize: 23,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {beat.pills.map((p) => (
            <Pill key={p.text} text={p.text} color={p.color} beat={beat} delay={p.delay} />
          ))}
        </div>
        <div style={{ marginTop: 20, color: C.muted, fontFamily: FONT_MONO, fontSize: 21 }}>
          {beat.link}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 132,
          right: 132,
          bottom: 300,
          opacity: cta,
          transform: `scale(${0.96 + cta * 0.04})`,
        }}
      >
        <div
          style={{
            padding: '34px 44px',
            borderRadius: 32,
            background: `linear-gradient(110deg, ${C.violet}, ${C.gold})`,
            color: C.navy,
            textAlign: 'center',
            fontFamily: FONT_BODY,
            fontSize: 40,
            fontWeight: 820,
            boxShadow: '0 22px 62px rgba(124,58,237,0.22)',
          }}
        >
          {beat.ctaPre} <span style={{ fontFamily: FONT_MONO }}>{beat.ctaKeyword}</span>
        </div>
      </div>
    </CleanBase>
  );
};

const SCENES = [PhoneHeroWhite, QuestionCardsWhite, LanguageCodeWhite, PricesWhite, OwnershipCTAWhite];

export const AltrawareWebsitesV4 = () => {
  const frame = useCurrentFrame();
  const active = BEATS.find((b) => frame >= b.from && frame < b.to) || BEATS[BEATS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: C.white, fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <Audio src={staticFile('audio/voiceover-websites-v4.wav')} />
      <Scene beat={active} />
    </AbsoluteFill>
  );
};

export const RemotionRootV4 = () => (
  <Composition
    id="AltrawareWebsitesV4"
    component={AltrawareWebsitesV4}
    durationInFrames={1410}
    fps={FPS}
    width={W}
    height={H}
  />
);
