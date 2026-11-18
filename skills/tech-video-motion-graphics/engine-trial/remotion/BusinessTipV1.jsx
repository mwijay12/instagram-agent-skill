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


const TipHookWhite = ({ beat }) => {
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


const TipQuestionsWhite = ({ beat }) => {
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

const TipPriceWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const reveal = softStep(frame, beat.from + 20, beat.from + 60);
  return (
    <CleanBase beat={beat}>
      <PngFragment
        src={staticFile('plates/16-white-gold-orb.png')}
        size={420}
        x={700}
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
      <div
        style={{
          position: 'absolute',
          left: 116,
          right: 116,
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
        <div
          style={{
            color: C.ink,
            fontFamily: FONT_DISPLAY,
            fontSize: 56,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
          }}
        >
          {beat.statement}
        </div>
        <div
          style={{
            marginTop: 26,
            color: C.ink,
            fontFamily: FONT_BODY,
            fontSize: 30,
            lineHeight: 1.42,
          }}
        >
          <strong>{beat.noteStrong}</strong>
          <br />
          {beat.noteRest}
        </div>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {beat.chips.map((p) => (
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
        opacity={0.28}
        beat={beat}
      />
    </CleanBase>
  );
};


/* ----------------------------- BEAT 4 ----------------------------- */

const TipContactWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  return (
    <CleanBase beat={beat}>
      <PngFragment
        src={staticFile('plates/17-white-violet-ribbon.png')}
        size={460}
        x={660}
        y={1080}
        opacity={0.09}
        beat={beat}
        rotate={6}
      />
      <div style={{ position: 'absolute', left: SAFE.l, right: SAFE.r, top: 310, opacity: enter }}>
        <div style={{ color: C.goldInk, fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.2em' }}>
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
      <div style={{ position: 'absolute', left: 116, right: 116, top: 690 }}>
        {beat.contactRows.map((r, i) => {
          const s = softStep(frame, beat.from + 10 + i * 4, beat.from + 34 + i * 4);
          return (
            <div
              key={r.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '34px 40px',
                marginBottom: 22,
                borderRadius: 34,
                background: C.card,
                border: `1px solid ${C.line}`,
                boxShadow: '0 18px 50px rgba(16,24,43,0.06)',
                opacity: s,
                transform: `translateX(${(1 - s) * 42}px)`,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 24,
                  background: r.tint,
                  color: r.tint === C.gold ? C.ink : C.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT_MONO,
                  fontSize: 26,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {r.n}
              </div>
              <div>
                <div style={{ color: C.ink, fontFamily: FONT_BODY, fontSize: 36, fontWeight: 760 }}>
                  {r.label}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    color: C.muted,
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {r.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <SvgOrb
        src={staticFile('elements/signal-arc-ink.svg')}
        size={170}
        x={830}
        y={360}
        rotate={-8}
        opacity={0.3}
        beat={beat}
      />
    </CleanBase>
  );
};

const TipRecapCTAWhite = ({ beat }) => {
  const { frame, enter } = useBeat(beat);
  const reveal = softStep(frame, beat.from + 24, beat.from + 64);
  const cta = softStep(frame, beat.from + 222, beat.from + 260);
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
          {beat.recap}
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


// 22.0s @ 60fps = 1320 frames. Beat boundaries follow the slower male TTS clips.
const BEATS = [
  {
    id: 1,
    label: 'SIMU KWANZA',
    from: 0,
    to: 228,
    kicker: 'TIP YA BIASHARA',
    eyebrow: 'MWANZO',
    titleLines: ['Biashara haianzi', 'na banner.'],
    subtitle: 'Inaanza na jibu la haraka.',
    mode: 'white',
    pills: [
      { text: 'BUSINESS TIP', color: C.goldInk, delay: 0 },
      { text: 'JIBU LA HARAKA', color: C.violetInk, delay: 4 },
    ],
    phoneBrand: 'ALTRAWARE TECH',
    phoneQuestions: ['Unafanya nini?', 'Bei gani?', 'Wasiliana vipi?'],
    answerChip: 'JIBU LA HARAKA',
    phoneFoot: 'Majibu matatu, ukurasa mmoja.',
    captions: [
      'Biashara yako haianzi na banner.',
      'Inaanza na jibu la haraka.',
    ],
  },
  {
    id: 2,
    label: 'MASWALI 3',
    from: 228,
    to: 468,
    kicker: 'USAHIHI WA KWANZA',
    eyebrow: 'MASWALI MATATU',
    titleLines: ['Mteja anauliza', 'maswali matatu.'],
    subtitle: 'Yajibu mwanzoni, si mwishoni.',
    mode: 'paper',
    items: [
      { n: '01', q: 'UNAFANYA NINI?', sub: 'Huduma / bidhaa wazi', tint: C.violet },
      { n: '02', q: 'BEI GANI?', sub: 'Bei ya kuanzia wazi', tint: C.gold },
      { n: '03', q: 'WASILIANA VIPI?', sub: 'Simu / WhatsApp / form', tint: C.greenInk },
    ],
    captions: [
      'Unafanya nini? Huduma au bidhaa iwe wazi.',
      'Maswali matatu, majibu wazi.',
    ],
  },
  {
    id: 3,
    label: 'BEI WAZI',
    from: 468,
    to: 732,
    kicker: 'TIP YA PILI',
    eyebrow: 'BEI YA KUANZIA',
    titleLines: ['Bei ya kuanzia', 'iwe wazi.'],
    subtitle: 'Si baada ya mkutano wa tatu.',
    mode: 'white',
    statement: 'Bei ya kuanzia iwe wazi.',
    noteStrong: 'Si baada ya mkutano wa tatu.',
    noteRest: 'Bei kamili huandikwa baada ya kufahamu kazi yako.',
    chips: [
      { text: 'BEI YA KUANZIA', color: C.goldInk, delay: 0 },
      { text: 'KUFAHAMU KAZI', color: C.violetInk, delay: 4 },
    ],
    captions: [
      'Bei gani? Bei ya kuanzia iwe wazi.',
      'Si baada ya mkutano wa tatu.',
      'Bei kamili baada ya kufahamu kazi yako.',
    ],
  },
  {
    id: 4,
    label: 'WASILIANA',
    from: 732,
    to: 1014,
    kicker: 'TIP YA TATU',
    eyebrow: 'NJIA MOJA WAZI',
    titleLines: ['Wasiliana vipi?', 'Njia moja wazi.'],
    subtitle: 'Simu, WhatsApp au form — chagua moja iwe wazi.',
    mode: 'white',
    contactRows: [
      { n: '01', label: 'SIMU', value: '0790942616', tint: C.gold },
      { n: '02', label: 'WHATSAPP', value: '0790942616', tint: C.violet },
      { n: '03', label: 'FORM', value: 'altra.tanzaniareach.com', tint: C.greenInk },
    ],
    captions: [
      'Wasiliana vipi? Simu, WhatsApp au form.',
      'Njia moja wazi, si kutafuta.',
    ],
  },
  {
    id: 5,
    label: 'RECAP / CTA',
    from: 1014,
    to: 1320,
    kicker: 'JIBU LA HARAKA',
    eyebrow: 'TIP YA LEO',
    titleLines: ['Majibu matatu,', 'ukurasa mmoja.'],
    subtitle: 'Unafanya nini · Bei gani · Wasiliana vipi',
    mode: 'white',
    brandName: 'Altraware Tech',
    brandLine: 'Business tip · Kiswahili-first · mobile-first',
    recap: 'Weka majibu matatu wazi kwenye ukurasa wa kwanza.',
    tagline: 'Built in Tanzania, for how Tanzania really works.',
    pills: [
      { text: '@altrawaretechnology', color: C.violetInk, delay: 0 },
      { text: '0790942616', color: C.goldInk, delay: 4 },
    ],
    link: 'altra.tanzaniareach.com',
    ctaPre: 'Comment neno',
    ctaKeyword: 'TIP',
    captions: [
      'Majibu matatu, ukurasa mmoja.',
      'Unahitaji msaada? Comment neno TIP.',
    ],
  },
];

const SCENES = [TipHookWhite, TipQuestionsWhite, TipPriceWhite, TipContactWhite, TipRecapCTAWhite];

export const AltrawareBusinessTipV1 = () => {
  const frame = useCurrentFrame();
  const active = BEATS.find((b) => frame >= b.from && frame < b.to) || BEATS[BEATS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: C.white, fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <Audio src={staticFile('audio/voiceover-business-tip-v1.wav')} />
      <Scene beat={active} />
    </AbsoluteFill>
  );
};

export const RemotionRootTipV1 = () => (
  <Composition
    id="AltrawareBusinessTipV1"
    component={AltrawareBusinessTipV1}
    durationInFrames={1320}
    fps={FPS}
    width={W}
    height={H}
  />
);
