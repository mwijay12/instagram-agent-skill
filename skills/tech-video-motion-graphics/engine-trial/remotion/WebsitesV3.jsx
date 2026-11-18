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

// V3 CLEAN REEL — Altraware Tech / Websites
// All readable text, numbers, code, brand marks, captions and timing come from
// this file + BEATS[] + timeline-v3.json. Generated PNGs are low-frequency
// plates/elements only; SVGs are decorative, deterministic elements.
// Frame-driven only: useCurrentFrame() + spring()/interpolate(). No CSS timers,
// no setTimeout, no requestAnimationFrame, no CSS transitions.

const C = {
  navy: '#071022',
  navy2: '#0b1830',
  paper: '#f7f6f2',
  ink: '#10182b',
  gold: '#eab308',
  violet: '#7c3aed',
  violetLight: '#a78bfa',
  white: '#ffffff',
  muted: '#a3aecb',
  mutedInk: '#56627a',
  green: '#34d399',
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

// Every on-screen word is authored here. `captions` are burned in from BEATS[].
const BEATS = [
  {
    id: 1,
    label: 'SIMU KWANZA',
    from: 0,
    to: 234,
    kicker: 'TOVUTI / WEBSITE',
    eyebrow: 'MWANZO',
    title: 'Mteja yuko\nkwenye simu.',
    subtitle: 'Your customer is on a phone. Looking for one quick answer.',
    sw: 'Mteja yuko kwenye simu.\nAnatafuta jibu la haraka.',
    en: 'Your customer is on a phone.\nLooking for one quick answer.',
    mode: 'navy',
    pills: [
      { text: 'KISWAHILI', color: C.gold, delay: 0 },
      { text: 'MOBILE-FIRST', color: C.violetLight, delay: 4 },
    ],
    phoneBrand: 'ALTRAWARE TECH',
    phoneQuestions: 'Unafanya nini?\nBei gani?\nWasiliana vipi?',
    answerChip: 'JIBU LA HARAKA',
    phoneFoot: 'Jibu la haraka · linaonekana mara moja',
    captions: [
      'Mteja hajasimama mbele ya banner lako.',
      'Yuko kwenye simu, anatafuta jibu la haraka.',
    ],
  },
  {
    id: 2,
    label: 'MASWALI 3',
    from: 234,
    to: 510,
    kicker: 'USIIACHE IKIWA KIMYA',
    eyebrow: 'BEFORE THEY LEAVE',
    title: 'Simu inauliza\nmaswali matatu.',
    sw: 'Maswali matatu:\nunafanya nini · bei gani · wasiliana vipi?',
    en: 'Three questions:\nwhat you do · price · how to contact?',
    mode: 'paper',
    items: [
      { n: '01', q: 'UNAFANYA NINI?', sub: 'Service / product', tint: C.violet },
      { n: '02', q: 'BEI GANI?', sub: 'Price / scope', tint: C.gold },
      { n: '03', q: 'WASILIANA VIPI?', sub: 'Call / WhatsApp / form', tint: C.green },
    ],
    captions: [
      'Haoni unachofanya, bei wala jinsi ya kuwasiliana?',
      'Amekwenda kwa mwingine kabla hujajua.',
    ],
  },
  {
    id: 3,
    label: 'LUGHA MBILI',
    from: 510,
    to: 816,
    kicker: 'BUILT FOR TZ',
    eyebrow: 'LUGHA / LANGUAGE',
    title: 'Watu wako\nwanasomaje?',
    sw: 'Kiswahili + English.\nMuundo unaoeleweka.\nUjumbe unaofika.',
    en: 'Kiswahili + English.\nClear structure.\nA message that lands.',
    mode: 'navy',
    langCards: [
      { title: 'KISWAHILI', lines: ['Karibu', 'Bei wazi', 'Wasiliana nasi'], accent: C.gold, delay: 8 },
      { title: 'ENGLISH', lines: ['Welcome', 'Clear pricing', 'Get in touch'], accent: C.violetLight, delay: 12 },
    ],
    connector: '+ CLEAR STRUCTURE',
    footer: 'Ujumbe unaofika moja kwa moja.',
    captions: [
      'Altraware huanza na simu.',
      'Kiswahili na English, muundo unaoeleweka.',
      'Ujumbe unaofika moja kwa moja.',
    ],
  },
  {
    id: 4,
    label: 'REAL CODE',
    from: 816,
    to: 1116,
    kicker: 'SIMU KWANZA · HTML',
    eyebrow: 'REAL CODE · SIMU KWANZA',
    title: 'Tovuti si picha tu.',
    subtitle: 'HTML · viewport · brand title',
    sw: 'Tovuti si picha tu.',
    en: 'A website is not just a picture.',
    mode: 'navy',
    codeLines: [
      { id: '01', tokens: [['TAG', '<html'], ['ATTR', ' lang='], ['STR', '"sw"'], ['TAG', '>']] },
      { id: '02', tokens: [['TAG', '<meta'], ['ATTR', ' name='], ['STR', '"viewport"'], ['TAG', '>']] },
      { id: '03', tokens: [['TAG', '<title'], ['ATTR', '>'], ['STR', 'Altraware Tech'], ['TAG', '</title>']] },
    ],
    pills: [
      { text: 'HTML LANG="SW"', color: C.gold, delay: 0 },
      { text: 'VIEWPORT', color: C.violetLight, delay: 4 },
      { text: 'TITLE', color: C.green, delay: 8 },
    ],
    captions: [
      'Tovuti si picha tu.',
      'HTML lang ni sw, viewport ya simu, na title yenye brand.',
    ],
  },
  {
    id: 5,
    label: 'BEI WAZI',
    from: 1116,
    to: 1692,
    kicker: 'SCOPE KWANZA · BEI BAADAYE',
    eyebrow: 'BEI WAZI · STARTING PRICES',
    title: 'Anza na bei\niliyo wazi.',
    sw: 'Bei ya kuanzia iko wazi.',
    en: 'Starting prices, in writing.',
    mode: 'paper',
    priceRows: [
      { name: 'WEB STARTER', price: 'TSh 350,000', note: 'Kuanzia', accent: C.violet },
      { name: 'GROWTH', price: 'TSh 550,000', note: 'Kuanzia', accent: C.gold },
      { name: 'CUSTOM', price: 'TSh 800,000', note: 'Kuanzia', accent: C.green },
    ],
    priceNoteStrong: 'Scope kwanza, bei kamili kwa maandishi baadaye.',
    priceNoteRest: 'Care Plan TSh 99,000/mwezi ni huduma tofauti, si SaaS.',
    captions: [
      'Bei ya kuanzia iko wazi.',
      'Web Starter TSh 350,000, Growth TSh 550,000.',
      'Custom kuanzia TSh 800,000.',
      'Bei kamili baada ya scope.',
    ],
  },
  {
    id: 6,
    label: 'MILIKI / CTA',
    from: 1692,
    to: 2160,
    kicker: 'FAIDA CORE IS LICENSED',
    eyebrow: 'UMILIKI · OWNERSHIP',
    title: 'Umiliki wazi.',
    subtitle: 'Data yako · tovuti/app yako · leseni ya Faida',
    sw: 'Unamiliki data yako na tovuti/app yako.',
    en: 'You own your data and your site/app.',
    mode: 'navy',
    brandName: 'Altraware Tech',
    brandLine: 'Websites · Kiswahili + English · mobile-first',
    ownership: 'Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.',
    tagline: 'Built in Tanzania, for how Tanzania really works.',
    pills: [
      { text: '@altrawaretechnology', color: C.violetLight, delay: 0 },
      { text: '0790942616', color: C.gold, delay: 4 },
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
    durationInFrames: 28,
  });
  const exit = softStep(frame, beat.to - 20, beat.to - 1);
  // Camera rig: every beat drifts from 1.0 to 1.35 across its own duration.
  const camera = interpolate(frame, [beat.from, beat.to], [1.0, 1.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { frame, local, enter, exit, camera };
};

const BeatLabel = ({ beat, dark }) => {
  const { enter, exit } = useBeat(beat);
  const color = dark ? C.white : C.ink;
  const accent = dark ? C.gold : C.violet;
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
        color,
        fontFamily: FONT_MONO,
        fontSize: 22,
        letterSpacing: '0.18em',
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 12, background: accent }} />
      <span style={{ opacity: 0.68 }}>ALTRAWARE TECH</span>
      <span style={{ width: 34, height: 2, background: dark ? 'rgba(255,255,255,0.22)' : 'rgba(16,24,43,0.18)' }} />
      <span>{beat.kicker}</span>
    </div>
  );
};

const CaptionLines = ({ beat, dark }) => {
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
          background: dark ? 'rgba(4,10,22,0.78)' : 'rgba(247,246,242,0.90)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(16,24,43,0.14)'}`,
          color: dark ? C.white : C.ink,
          fontFamily: FONT_BODY,
          fontSize: 30,
          lineHeight: 1.35,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: 860,
          boxShadow: dark ? '0 18px 54px rgba(0,0,0,0.28)' : '0 18px 54px rgba(16,24,43,0.10)',
          opacity: lineIn,
          transform: `translateY(${(1 - lineIn) * 12}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Background = ({ mode, beat }) => {
  const { frame, camera } = useBeat(beat);
  const isDark = mode === 'navy';
  const plate = isDark ? staticFile('plates/11-clean-navy.png') : staticFile('plates/12-clean-paper.png');
  const drift = interpolate(frame, [beat.from, beat.to], [0, -18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ backgroundColor: isDark ? C.navy : C.paper, overflow: 'hidden' }}>
      <Img
        src={plate}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isDark ? 0.88 : 0.94,
          transform: `scale(${camera}) translateY(${drift}px)`,
          transformOrigin: '50% 40%',
        }}
      />
      {/* Quiet zone: a flat, low-frequency panel behind all copy. */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: 250,
          bottom: 300,
          borderRadius: 56,
          background: isDark ? 'rgba(7,16,34,0.76)' : 'rgba(247,246,242,0.82)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,43,0.08)'}`,
          boxShadow: isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'inset 0 1px 0 rgba(255,255,255,0.60)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 14,
          background: `linear-gradient(90deg, ${C.gold} 0%, ${C.violet} 52%, transparent 100%)`,
          opacity: 0.66,
        }}
      />
    </AbsoluteFill>
  );
};

const SvgOrb = ({ src, size, x, y, rotate = 0, opacity = 1, beat, glow = 'violet' }) => {
  const { frame, enter, exit, camera } = useBeat(beat);
  const spin = interpolate(frame, [beat.from, beat.to], [0, 26], {
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
        transform: `rotate(${rotate + spin + (camera - 1) * 14}deg) scale(${0.92 + enter * 0.08})`,
        filter:
          glow === 'gold'
            ? 'drop-shadow(0 0 26px rgba(234,179,8,0.22))'
            : 'drop-shadow(0 0 26px rgba(124,58,237,0.20))',
      }}
    />
  );
};

const PngFragment = ({ src, size, x, y, opacity = 0.14, beat, rotate = 0 }) => {
  const { frame, enter, exit, camera } = useBeat(beat);
  const drift = interpolate(frame, [beat.from, beat.to], [0, 34], {
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
        mixBlendMode: 'screen',
        transform: `rotate(${rotate}deg) scale(${camera * 0.98})`,
      }}
    />
  );
};

const CleanBase = ({ beat, children, dark }) => (
  <AbsoluteFill>
    <Background mode={beat.mode} beat={beat} />
    <BeatLabel beat={beat} dark={dark} />
    {children}
    <CaptionLines beat={beat} dark={dark} />
  </AbsoluteFill>
);

const Pill = ({ text, color, dark, delay = 0, beat }) => {
  const { frame } = useBeat(beat);
  const s = softStep(frame, beat.from + 18 + delay, beat.from + 38 + delay);
  return (
    <span
      style={{
        padding: '14px 22px',
        borderRadius: 18,
        background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(16,24,43,0.05)',
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

const PhoneHero = ({ beat }) => {
  const { enter, camera } = useBeat(beat);
  const glow = 0.5 + 0.5 * Math.sin((useCurrentFrame() - beat.from) / 16);
  return (
    <CleanBase beat={beat} dark>
      <PngFragment
        src={staticFile('plates/13-gold-orb.png')}
        size={420}
        x={700}
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
          top: 330,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 36}px)`,
        }}
      >
        <div style={{ color: C.gold, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 28,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontSize: 86,
            lineHeight: 1.02,
            fontWeight: 720,
            letterSpacing: '-0.035em',
            whiteSpace: 'pre-line',
          }}
        >
          {beat.title}
        </div>
        <div
          style={{
            marginTop: 22,
            color: C.muted,
            fontFamily: FONT_BODY,
            fontSize: 27,
            lineHeight: 1.35,
          }}
        >
          Your customer is on a phone. Looking for one quick answer.
        </div>
        <div style={{ marginTop: 30, display: 'flex', gap: 12 }}>
          {beat.pills.map((p) => (
            <Pill key={p.text} text={p.text} color={p.color} dark beat={beat} delay={p.delay} />
          ))}
        </div>
      </div>

      {/* One hero: a clean phone frame with a quiet, readable mobile answer card. */}
      <div
        style={{
          position: 'absolute',
          left: 280,
          top: 700,
          width: 520,
          height: 1040,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 44}px) scale(${1 + (camera - 1) * 0.22})`,
          transformOrigin: '50% 30%',
        }}
      >
        <Img
          src={staticFile('elements/phone-frame.svg')}
          style={{ width: 520, height: 1040, filter: 'drop-shadow(0 36px 90px rgba(0,0,0,0.34))' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 74,
            right: 74,
            top: 74,
            bottom: 108,
            borderRadius: 30,
            background: 'rgba(7,16,34,0.97)',
            border: '1px solid rgba(255,255,255,0.10)',
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
              marginTop: 54,
              color: C.white,
              fontFamily: FONT_DISPLAY,
              fontSize: 33,
              lineHeight: 1.32,
              whiteSpace: 'pre-line',
            }}
          >
            {beat.phoneQuestions}
          </div>
          <div
            style={{
              marginTop: 38,
              display: 'inline-flex',
              padding: '12px 18px',
              borderRadius: 16,
              border: `1px solid ${C.gold}88`,
              background: 'rgba(234,179,8,0.08)',
              color: C.gold,
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
        src={staticFile('elements/signal-arc.svg')}
        size={200}
        x={820}
        y={430}
        rotate={10}
        opacity={0.38}
        beat={beat}
        glow="gold"
      />
    </CleanBase>
  );
};

/* ----------------------------- BEAT 2 ----------------------------- */

const QuestionCards = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const items = beat.items;
  return (
    <CleanBase beat={beat} dark={false}>
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 320, opacity: enter }}>
        <div style={{ color: C.violet, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
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
            whiteSpace: 'pre-line',
          }}
        >
          {beat.title}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 116, right: 116, top: 700 }}>
        {items.map((it, i) => {
          const s = softStep(frame, beat.from + 12 + i * 4, beat.from + 38 + i * 4);
          return (
            <div
              key={it.n}
              style={{
                marginBottom: 34,
                padding: '42px 44px',
                borderRadius: 40,
                background: 'rgba(255,255,255,0.78)',
                border: '1px solid rgba(16,24,43,0.10)',
                boxShadow: '0 24px 64px rgba(16,24,43,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 34,
                opacity: s,
                transform: `translateX(${(1 - s) * 54}px) scale(${0.97 + s * 0.03})`,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 28,
                  background: it.tint,
                  color: it.tint === C.gold ? C.ink : C.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_MONO,
                  fontSize: 34,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {it.n}
              </div>
              <div>
                <div style={{ color: C.ink, fontFamily: FONT_BODY, fontSize: 42, fontWeight: 760 }}>
                  {it.q}
                </div>
                <div style={{ marginTop: 10, color: C.mutedInk, fontFamily: FONT_BODY, fontSize: 26 }}>
                  {it.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SvgOrb
        src={staticFile('elements/node-graph.svg')}
        size={170}
        x={820}
        y={330}
        rotate={-8}
        opacity={0.18}
        beat={beat}
      />
    </CleanBase>
  );
};

/* ----------------------------- BEAT 3 ----------------------------- */

const LanguageFlow = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const mix = softStep(frame, beat.from + 40, beat.from + 170);
  return (
    <CleanBase beat={beat} dark>
      <PngFragment
        src={staticFile('plates/14-violet-ribbon.png')}
        size={520}
        x={620}
        y={1080}
        opacity={0.10}
        beat={beat}
        rotate={6}
      />
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 320, opacity: enter }}>
        <div style={{ color: C.gold, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 28,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontSize: 80,
            lineHeight: 1.03,
            letterSpacing: '-0.03em',
            whiteSpace: 'pre-line',
          }}
        >
          {beat.title}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 116, right: 116, top: 720 }}>
        <LangCard
          title={beat.langCards[0].title}
          lines={beat.langCards[0].lines}
          accent={beat.langCards[0].accent}
          delay={beat.langCards[0].delay}
          frame={frame}
          beat={beat}
        />
        <div style={{ height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: mix }}>
          <div style={{ width: 4, height: 58, background: `linear-gradient(${C.violet}, ${C.gold})` }} />
          <div style={{ color: C.muted, fontFamily: FONT_MONO, fontSize: 22, padding: '0 18px' }}>
            {beat.connector}
          </div>
          <div style={{ width: 4, height: 58, background: `linear-gradient(${C.gold}, ${C.violet})` }} />
        </div>
        <LangCard
          title={beat.langCards[1].title}
          lines={beat.langCards[1].lines}
          accent={beat.langCards[1].accent}
          delay={beat.langCards[1].delay}
          frame={frame}
          beat={beat}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 116,
          right: 116,
          bottom: 320,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: mix,
          transform: `translateY(${(1 - mix) * 24}px)`,
        }}
      >
        <Img src={staticFile('elements/signal-arc.svg')} style={{ width: 78, height: 78 }} />
        <div style={{ color: C.white, fontFamily: FONT_BODY, fontSize: 31, fontWeight: 600 }}>
          {beat.footer}
        </div>
      </div>
    </CleanBase>
  );
};

const LangCard = ({ title, lines, accent, delay, frame, beat }) => {
  const s = softStep(frame, beat.from + delay, beat.from + delay + 28);
  return (
    <div
      style={{
        padding: '34px 42px',
        borderRadius: 40,
        background: 'rgba(255,255,255,0.045)',
        border: `1px solid ${accent}44`,
        opacity: s,
        transform: `translateX(${(1 - s) * (delay < 10 ? -48 : 48)}px)`,
      }}
    >
      <div style={{ color: accent, fontFamily: FONT_MONO, fontSize: 24, letterSpacing: '0.18em' }}>
        {title}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
        {lines.map((l) => (
          <span
            key={l}
            style={{
              padding: '14px 22px',
              borderRadius: 18,
              background: 'rgba(255,255,255,0.06)',
              color: C.white,
              fontFamily: FONT_BODY,
              fontSize: 28,
            }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ----------------------------- BEAT 4 ----------------------------- */

const RealCode = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const codeLines = beat.codeLines;
  return (
    <CleanBase beat={beat} dark>
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 310, opacity: enter }}>
        <div style={{ color: C.gold, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 26,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
          }}
        >
          {beat.title}
        </div>
        <div style={{ marginTop: 20, color: C.muted, fontFamily: FONT_BODY, fontSize: 29 }}>
          {beat.subtitle}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 108,
          right: 108,
          top: 690,
          padding: '40px 36px',
          borderRadius: 42,
          background: 'rgba(3,8,18,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.36)',
          opacity: enter,
          transform: `translateY(${(1 - enter) * 32}px)`,
        }}
      >
        {codeLines.map((line, i) => {
          const focus = clamp01(
            interpolate(frame, [beat.from + 28 + i * 26, beat.from + 48 + i * 26], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }) -
              interpolate(frame, [beat.from + 92 + i * 26, beat.from + 122 + i * 26], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
          );
          return (
            <div
              key={line.id}
              style={{
                display: 'flex',
                gap: 22,
                alignItems: 'baseline',
                padding: '16px 18px',
                borderRadius: 18,
                background: `rgba(124,58,237,${0.02 + focus * 0.16})`,
                border: `1px solid rgba(234,179,8,${focus * 0.34})`,
                opacity: 0.46 + focus * 0.54,
                transform: `translateX(${focus * 10}px)`,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  color: C.muted,
                  fontFamily: FONT_MONO,
                  fontSize: 22,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {line.id}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 26, whiteSpace: 'nowrap' }}>
                {line.tokens.map(([kind, text], j) => (
                  <span
                    key={`${line.id}-${j}`}
                    style={{
                      color:
                        kind === 'TAG'
                          ? C.violetLight
                          : kind === 'ATTR'
                            ? C.gold
                            : kind === 'STR'
                              ? C.green
                              : C.white,
                      opacity: 0.55 + focus * 0.45,
                      transform: `translateY(${(1 - focus) * (j % 2 === 0 ? 4 : -4)}px)`,
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

        <div style={{ marginTop: 30, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {beat.pills.map((p) => (
            <Pill key={p.text} text={p.text} color={p.color} dark beat={beat} delay={p.delay} />
          ))}
        </div>
      </div>

      <SvgOrb
        src={staticFile('elements/code-brackets.svg')}
        size={170}
        x={840}
        y={380}
        rotate={10}
        opacity={0.26}
        beat={beat}
        glow="gold"
      />
    </CleanBase>
  );
};

/* ----------------------------- BEAT 5 ----------------------------- */

const Prices = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const rows = beat.priceRows;
  return (
    <CleanBase beat={beat} dark={false}>
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 320, opacity: enter }}>
        <div style={{ color: C.violet, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
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
            whiteSpace: 'pre-line',
          }}
        >
          {beat.title}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 116, right: 116, top: 700 }}>
        {rows.map((r, i) => {
          const s = softStep(frame, beat.from + 12 + i * 4, beat.from + 40 + i * 4);
          return (
            <div
              key={r.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '38px 42px',
                marginBottom: 26,
                borderRadius: 36,
                background: 'rgba(255,255,255,0.80)',
                border: '1px solid rgba(16,24,43,0.10)',
                boxShadow: '0 20px 56px rgba(16,24,43,0.07)',
                opacity: s,
                transform: `translateY(${(1 - s) * 34}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ width: 12, height: 62, borderRadius: 12, background: r.accent }} />
                <div>
                  <div style={{ color: C.ink, fontFamily: FONT_BODY, fontSize: 38, fontWeight: 760 }}>
                    {r.name}
                  </div>
                  <div style={{ color: C.mutedInk, fontFamily: FONT_BODY, fontSize: 24, marginTop: 4 }}>
                    {r.note}
                  </div>
                </div>
              </div>
              <div
                style={{
                  color: C.ink,
                  fontFamily: FONT_MONO,
                  fontSize: 38,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {r.price}
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 20,
            padding: '30px 36px',
            borderRadius: 30,
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.22)',
            color: C.ink,
            fontFamily: FONT_BODY,
            fontSize: 27,
            lineHeight: 1.4,
            opacity: softStep(frame, beat.from + 62, beat.from + 96),
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

/* ----------------------------- BEAT 6 ----------------------------- */

const OwnershipCTA = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const reveal = softStep(frame, beat.from + 40, beat.from + 88);
  const cta = softStep(frame, beat.from + 130, beat.from + 170);
  return (
    <CleanBase beat={beat} dark>
      <div style={{ position: 'absolute', left: 104, right: 104, top: 300, opacity: enter }}>
        <div style={{ color: C.gold, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
          {beat.eyebrow}
        </div>
        <div
          style={{
            marginTop: 30,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontSize: 68,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            whiteSpace: 'pre-line',
          }}
        >
          {beat.title}
        </div>
        <div style={{ marginTop: 20, color: C.muted, fontFamily: FONT_BODY, fontSize: 27 }}>
          {beat.subtitle}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 132,
          right: 132,
          top: 720,
          padding: '50px 44px',
          borderRadius: 46,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.12)',
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 32}px)`,
        }}
      >
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Img src={staticFile('logo.png')} style={{ width: 92, height: 92, objectFit: 'contain' }} />
          <div>
            <div style={{ color: C.white, fontFamily: FONT_BODY, fontSize: 38, fontWeight: 720 }}>
              {beat.brandName}
            </div>
            <div style={{ color: C.muted, fontFamily: FONT_BODY, fontSize: 24, marginTop: 6 }}>
              {beat.brandLine}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 34,
            color: C.white,
            fontFamily: FONT_BODY,
            fontSize: 29,
            lineHeight: 1.42,
          }}
        >
          {beat.ownership}
        </div>
        <div
          style={{
            marginTop: 30,
            color: C.white,
            fontFamily: FONT_DISPLAY,
            fontSize: 32,
            fontStyle: 'italic',
          }}
        >
          {beat.tagline}
        </div>
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            fontFamily: FONT_MONO,
            fontSize: 24,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {beat.pills.map((p) => (
            <Pill key={p.text} text={p.text} color={p.color} dark beat={beat} delay={p.delay} />
          ))}
        </div>
        <div style={{ marginTop: 22, color: C.muted, fontFamily: FONT_MONO, fontSize: 22 }}>
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
            padding: '36px 44px',
            borderRadius: 34,
            background: `linear-gradient(110deg, ${C.violet}, ${C.gold})`,
            color: C.navy,
            textAlign: 'center',
            fontFamily: FONT_BODY,
            fontSize: 42,
            fontWeight: 820,
            boxShadow: '0 24px 70px rgba(124,58,237,0.28)',
          }}
        >
          {beat.ctaPre} <span style={{ fontFamily: FONT_MONO }}>{beat.ctaKeyword}</span>
        </div>
      </div>
    </CleanBase>
  );
};

const SCENES = [PhoneHero, QuestionCards, LanguageFlow, RealCode, Prices, OwnershipCTA];

export const AltrawareWebsitesV3 = () => {
  // Absolute composition frame: no <Sequence> shift, so useBeat() receives
  // the real timeline frame and every beat's 1.0 -> 1.35 camera rig is correct.
  const frame = useCurrentFrame();
  const active = BEATS.find((b) => frame >= b.from && frame < b.to) || BEATS[BEATS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <Audio src={staticFile('audio/voiceover-websites-v2.wav')} />
      <Scene beat={active} />
    </AbsoluteFill>
  );
};

export const RemotionRootV3 = () => (
  <Composition
    id="AltrawareWebsitesV3"
    component={AltrawareWebsitesV3}
    durationInFrames={2160}
    fps={FPS}
    width={W}
    height={H}
  />
);
