import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import timeline from './timeline.json';

const NAVY = '#071022';
const PAPER = '#f7f6f2';
const GOLD = '#eab308';
const VIOLET = '#7c3aed';
const MUTED = '#a3aecb';
const INK = '#14203a';

const SPRING = { damping: 14, stiffness: 120, mass: 0.8 };

const fontCss = `
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-normal.ttf')}') format('truetype');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-italic.ttf')}') format('truetype');font-weight:100 900;font-style:italic;font-display:swap}
@font-face{font-family:'Inter';src:url('${staticFile('fonts/inter-latin-wght-normal.ttf')}') format('truetype');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('${staticFile('fonts/jetbrains-mono-latin-wght-normal.ttf')}') format('truetype');font-weight:100 900;font-style:normal;font-display:swap}
`;

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Background = ({ src, overlay, scale = 1.04, offsetX = 0, offsetY = 0, filter = 'none', opacity = 1 }) => (
  <AbsoluteFill style={{ backgroundColor: NAVY, overflow: 'hidden' }}>
    <img
      src={staticFile(src)}
      alt=""
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        transformOrigin: 'center center',
        filter,
        opacity,
        willChange: 'transform',
      }}
    />
    <AbsoluteFill style={{ background: overlay, zIndex: 1 }} />
  </AbsoluteFill>
);

const Kicker = ({ children, color = GOLD, top = 250 }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 72,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 22,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color,
      zIndex: 4,
    }}
  >
    {children}
  </div>
);

const Headline = ({ children, color = PAPER, size = 98, top = 470, width = 820, italic = false }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 72,
      width,
      fontFamily: 'Fraunces, Georgia, serif',
      fontStyle: italic ? 'italic' : 'normal',
      fontWeight: 600,
      fontSize: size,
      lineHeight: 0.96,
      letterSpacing: '-0.04em',
      color,
      whiteSpace: 'pre-line',
      textShadow: color === PAPER ? '0 12px 44px rgba(0,0,0,.48)' : 'none',
      zIndex: 4,
    }}
  >
    {children}
  </div>
);

const Caption = ({ clip, frame, fps }) => {
  if (!clip) return null;
  const local = Math.max(0, Math.round((frame / fps - clip.start) * fps));
  const p = interpolate(local, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        top: 1230,
        left: 72,
        width: 780,
        boxSizing: 'border-box',
        padding: '18px 22px',
        background: 'rgba(7,16,34,.80)',
        borderLeft: `6px solid ${GOLD}`,
        color: PAPER,
        fontFamily: 'Inter, sans-serif',
        fontSize: 29,
        lineHeight: 1.34,
        fontWeight: 500,
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
        zIndex: 20,
      }}
    >
      {clip.text_sw}
    </div>
  );
};

const Beat1 = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [1.0, 1.14], { extrapolateRight: 'clamp' });
  const underline = spring({ frame, fps, config: SPRING });
  const words = ['SI BANNER.', 'NI SIMU.'];
  return (
    <>
      <Background
        src="plates/07-dar-blue-hour.png"
        overlay="linear-gradient(180deg,rgba(7,16,34,.88) 0%,rgba(7,16,34,.56) 42%,rgba(7,16,34,.94) 100%)"
        scale={zoom}
        filter="brightness(.72) saturate(.92) contrast(1.05)"
      />
      <Kicker>TOVUTI · DAR ES SALAAM</Kicker>
      <div style={{ position: 'absolute', top: 460, left: 72, width: 820, zIndex: 4 }}>
        {words.map((w, i) => {
          const p = spring({ frame: Math.max(0, frame - i * 7), fps, config: SPRING });
          return (
            <div
              key={w}
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontWeight: 600,
                fontSize: 104,
                lineHeight: 0.96,
                letterSpacing: '-0.045em',
                color: i === 1 ? GOLD : PAPER,
                opacity: p,
                transform: `translateY(${(1 - p) * 54}px)`,
                textShadow: '0 12px 44px rgba(0,0,0,.5)',
              }}
            >
              {w}
            </div>
          );
        })}
        <div
          style={{
            marginTop: 28,
            width: 60 + 560 * underline,
            height: 10,
            background: GOLD,
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 820,
          left: 76,
          width: 760,
          fontFamily: 'Inter, sans-serif',
          fontSize: 32,
          lineHeight: 1.4,
          color: MUTED,
          zIndex: 4,
        }}
      >
        Mteja hajasimama mbele ya banner lako. Yuko kwenye simu.
      </div>
    </>
  );
};

const Beat2 = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [1.12, 1.02], { extrapolateRight: 'clamp' });
  const active = Math.min(2, Math.floor(frame / (fps * 1.25)));
  const focus = spring({ frame: Math.max(0, frame - active * fps * 1.25), fps, config: SPRING });
  const lines = [
    '<html lang="sw">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Altraware Tech · Mkakati wa Maudhui</title>',
  ];
  const questions = ['UNAFANYA NINI?', 'BEI GANI?', 'WASILIANAJE?'];
  return (
    <>
      <Background
        src="plates/08-site-topology.png"
        overlay="linear-gradient(180deg,rgba(7,16,34,.90) 0%,rgba(7,16,34,.72) 55%,rgba(7,16,34,.96) 100%)"
        scale={zoom}
        filter="brightness(.68) saturate(1.05)"
      />
      <Kicker top={250}>REAL CODE · SIMU KWANZA</Kicker>
      <div style={{ position: 'absolute', top: 320, left: 72, width: 820, zIndex: 4 }}>
        {questions.map((q, i) => {
          const p = spring({ frame: Math.max(0, frame - 8 - i * 9), fps, config: SPRING });
          return (
            <div
              key={q}
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontWeight: 600,
                fontSize: i === 0 ? 62 : 58,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: i === 0 ? PAPER : MUTED,
                opacity: p,
                transform: `translateY(${(1 - p) * 34}px)`,
              }}
            >
              {q}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: 72,
          width: 820,
          background: 'rgba(7,16,34,.78)',
          border: '1px solid rgba(247,246,242,.14)',
          borderRadius: 18,
          padding: '26px 28px',
          zIndex: 4,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: 24 + active * 58,
            width: 5,
            height: 48,
            background: GOLD,
            borderRadius: 3,
            opacity: focus,
          }}
        />
        {lines.map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 24,
              lineHeight: '58px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: i === active ? GOLD : 'rgba(247,246,242,.28)',
              opacity: i === active ? 1 : 0.9,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {line}
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 76,
          width: 760,
          fontFamily: 'Inter, sans-serif',
          fontSize: 28,
          color: MUTED,
          zIndex: 4,
        }}
      >
        Kama haoni majibu, amekwenda kwa mwingine.
      </div>
    </>
  );
};

const Beat3 = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [1.10, 1.0], { extrapolateRight: 'clamp' });
  const chip = (i) => spring({ frame: Math.max(0, frame - 8 - i * 10), fps, config: SPRING });
  const n = Math.min(2, Math.floor(interpolate(frame, [0, 48], [1, 2.99], { extrapolateRight: 'clamp' })));
  const glow = interpolate(frame, [0, duration], [0.25, 0.65], { extrapolateRight: 'clamp' });
  return (
    <>
      <Background
        src="plates/09-signal-ribbons.png"
        overlay={`linear-gradient(180deg,rgba(7,16,34,.88) 0%,rgba(124,58,237,${glow * 0.18}) 45%,rgba(7,16,34,.94) 100%)`}
        scale={zoom}
        filter="brightness(.66) saturate(1.12)"
      />
      <Kicker top={250}>KISWAHILI + ENGLISH</Kicker>
      <Headline size={92} top={420} width={820}>
        {'UJUMBE\nUNAFIKA'}
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 700,
          left: 72,
          width: 820,
          display: 'flex',
          gap: 24,
          zIndex: 5,
        }}
      >
        {['KISWAHILI', 'ENGLISH'].map((label, i) => {
          const p = chip(i);
          return (
            <div
              key={label}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 30,
                letterSpacing: '0.06em',
                color: i === 0 ? GOLD : PAPER,
                border: `2px solid ${i === 0 ? GOLD : 'rgba(247,246,242,.55)'}`,
                borderRadius: 999,
                padding: '16px 30px',
                opacity: p,
                transform: `translateY(${(1 - p) * 44}px) scale(${0.9 + 0.1 * p})`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 880,
          left: 76,
          width: 760,
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          zIndex: 5,
        }}
      >
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, color: MUTED }}>LUGHA</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 66,
            fontWeight: 700,
            color: GOLD,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          0{n}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, color: MUTED }}>/ 02</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 76,
          width: 760,
          fontFamily: 'Inter, sans-serif',
          fontSize: 30,
          lineHeight: 1.4,
          color: PAPER,
          zIndex: 5,
        }}
      >
        Muundo unaoeleweka. Ujumbe haujapotea kwenye kelele.
      </div>
    </>
  );
};

const Beat4 = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [1.02, 1.13], { extrapolateRight: 'clamp' });
  const progress = interpolate(frame, [0, duration * 0.72], [0, 1], { extrapolateRight: 'clamp' });
  const p = spring({ frame, fps, config: SPRING });
  const nodes = [
    { x: 72, label: 'HTML LANG="SW"', sub: 'lang="sw"' },
    { x: 410, label: 'VIEWPORT', sub: 'width=device-width' },
    { x: 748, label: 'TITLE', sub: 'Altraware Tech' },
  ];
  return (
    <>
      <Background
        src="plates/08-site-topology.png"
        overlay="linear-gradient(180deg,rgba(7,16,34,.92) 0%,rgba(124,58,237,.20) 50%,rgba(7,16,34,.96) 100%)"
        scale={zoom}
        filter="brightness(.62) saturate(1.18) hue-rotate(8deg)"
      />
      <Kicker top={250} color={VIOLET}>REAL CODE · SIMU KWANZA</Kicker>
      <Headline size={86} top={410} width={830}>
        {'TOVUTI\nSI PICHA\nTU'}
      </Headline>
      <div style={{ position: 'absolute', top: 800, left: 72, width: 820, height: 4, zIndex: 4 }}>
        <div
          style={{
            width: 820 * progress,
            height: 4,
            background: `linear-gradient(90deg,${GOLD},${VIOLET})`,
            borderRadius: 2,
          }}
        />
      </div>
      {nodes.map((node, i) => {
        const np = spring({ frame: Math.max(0, frame - i * 14), fps, config: SPRING });
        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              top: 770 + (i % 2) * 40,
              left: node.x,
              width: 240,
              zIndex: 5,
              opacity: np,
              transform: `translateY(${(1 - np) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: i === 2 ? VIOLET : GOLD,
                border: '4px solid rgba(247,246,242,.85)',
                marginBottom: 22,
              }}
            />
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 20,
                letterSpacing: '0.05em',
                color: PAPER,
              }}
            >
              {node.label}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, lineHeight: 1.3, color: MUTED, marginTop: 8 }}>
              {node.sub}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 76,
          width: 760,
          fontFamily: 'Inter, sans-serif',
          fontSize: 29,
          color: PAPER,
          opacity: p,
          zIndex: 5,
        }}
      >
        Lugha, simu na brand vimeandikwa kwenye code.
      </div>
    </>
  );
};

const PriceRow = ({ label, target, note, delay, frame, fps, accent }) => {
  const p = spring({ frame: Math.max(0, frame - delay), fps, config: SPRING });
  const value = interpolate(frame, [delay, delay + 52], [0, target], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: 800,
        borderBottom: `1px solid rgba(20,32,58,.18)`,
        padding: '18px 0',
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
      }}
    >
      <div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 600, color: INK }}>
          {label}
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 17,
            letterSpacing: '0.1em',
            color: accent,
          }}
        >
          {note}
        </div>
      </div>
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 40,
          fontWeight: 700,
          color: INK,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        TSh {Math.round(value).toLocaleString('en-US')}
      </div>
    </div>
  );
};

const Beat5 = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [1.0, 1.06], { extrapolateRight: 'clamp' });
  return (
    <>
      <Background
        src="plates/10-paper-blueprint.png"
        overlay="linear-gradient(180deg,rgba(247,246,242,.90) 0%,rgba(247,246,242,.78) 48%,rgba(247,246,242,.94) 100%)"
        scale={zoom}
        filter="saturate(.72) contrast(1.04)"
        opacity={0.92}
      />
      <Kicker top={250} color={VIOLET}>BEI YA KUANZIA · 17 NOV 2026</Kicker>
      <Headline size={84} top={380} width={830} color={INK}>
        {'IKO WAZI\nKABLA YA\nMKUTANO'}
      </Headline>
      <div style={{ position: 'absolute', top: 690, left: 72, width: 820, zIndex: 5 }}>
        <PriceRow label="WEB STARTER" note="KUANZIA" target={350000} delay={4} frame={frame} fps={fps} accent={GOLD} />
        <PriceRow label="GROWTH" note="KUANZIA" target={550000} delay={22} frame={frame} fps={fps} accent={GOLD} />
        <PriceRow label="CUSTOM" note="KUANZIA" target={800000} delay={40} frame={frame} fps={fps} accent={VIOLET} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1050,
          left: 76,
          width: 760,
          fontFamily: 'Inter, sans-serif',
          fontSize: 26,
          lineHeight: 1.45,
          color: INK,
          zIndex: 5,
        }}
      >
        Bei kamili inaandikwa baada ya scope. Care Plan TSh 99,000/mwezi ni huduma tofauti, si SaaS.
      </div>
    </>
  );
};

const Beat6 = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [1.0, 1.12], { extrapolateRight: 'clamp' });
  const p = spring({ frame, fps, config: SPRING });
  const credits = spring({ frame: Math.max(0, frame - 22), fps, config: SPRING });
  const driftX = Math.sin(frame / 18) * 18;
  const driftY = Math.cos(frame / 24) * 10;
  const pulse = 1 + 0.018 * Math.sin(frame / 10);
  const sweep = interpolate(frame, [0, duration], [-420, 1220], { extrapolateRight: 'clamp' });
  const bandTop = 1110 + Math.sin(frame / 20) * 60;
  const ghostY = 250 + Math.sin(frame / 28) * 52;
  const ghostX = -70 + Math.cos(frame / 32) * 46;
  const ghostOpacity = 0.055 + 0.018 * Math.sin(frame / 16);
  return (
    <>
      <Background
        src="plates/07-dar-blue-hour.png"
        overlay="linear-gradient(180deg,rgba(7,16,34,.90) 0%,rgba(7,16,34,.70) 45%,rgba(7,16,34,.97) 100%)"
        scale={zoom}
        offsetX={Math.sin(frame / 26) * 18}
        offsetY={Math.cos(frame / 30) * 12}
        filter="brightness(.58) saturate(1.05)"
      />
      <div
        style={{
          position: 'absolute',
          top: ghostY,
          left: ghostX,
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 700,
          fontSize: 230,
          letterSpacing: '-0.06em',
          color: PAPER,
          opacity: ghostOpacity,
          whiteSpace: 'nowrap',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        TOVUTI
      </div>
      <div
        style={{
          position: 'absolute',
          top: bandTop,
          left: sweep,
          width: 520,
          height: 10,
          background: 'linear-gradient(90deg,transparent,rgba(234,179,8,.70),rgba(124,58,237,.55),transparent)',
          transform: 'rotate(-12deg)',
          filter: 'blur(1px)',
          opacity: 0.72,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
      <Kicker top={250}>ALTRAWARE TECHNOLOGY</Kicker>
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 72,
          width: 820,
          zIndex: 5,
          opacity: p,
          transform: `translate(${driftX}px, ${driftY}px) scale(${(1.7 - 0.7 * p) * pulse})`,
          transformOrigin: 'left top',
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 34,
            fontWeight: 600,
            color: MUTED,
            marginBottom: 18,
          }}
        >
          Unahitaji tovuti leo?
        </div>
        <div
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 700,
            fontSize: 128,
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
            color: GOLD,
            textShadow: '0 18px 50px rgba(0,0,0,.55)',
          }}
        >
          COMMENT
        </div>
        <div
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 0.92,
            letterSpacing: '-0.05em',
            color: PAPER,
            textShadow: '0 18px 50px rgba(0,0,0,.55)',
          }}
        >
          TOVUTI
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1000,
          left: 76,
          width: 780,
          fontFamily: 'Inter, sans-serif',
          fontSize: 24,
          lineHeight: 1.45,
          color: PAPER,
          opacity: credits,
          transform: `translateY(${(1 - credits) * 24 + Math.sin(frame / 22) * 4}px)`,
          zIndex: 5,
        }}
      >
        Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1270,
          left: 76,
          width: 780,
          fontFamily: 'Inter, sans-serif',
          fontSize: 22,
          lineHeight: 1.6,
          color: MUTED,
          opacity: credits,
          transform: `translateY(${Math.sin(frame / 26) * 5}px)`,
          zIndex: 5,
        }}
      >
        <div>Websites · Kiswahili + English · mobile-first</div>
        <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', color: PAPER, fontSize: 24 }}>
          Built in Tanzania, for how Tanzania really works.
        </div>
        <div>@altrawaretechnology · altra.tanzaniareach.com</div>
      </div>
    </>
  );
};

const BEATS = [Beat1, Beat2, Beat3, Beat4, Beat5, Beat6];

export const WebsitesV2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = timeline.duration_frames;
  const t = frame / fps;
  let activeIndex = timeline.clips.findIndex((c) => t >= c.start && t < c.end);
  if (activeIndex < 0) activeIndex = timeline.clips.length - 1;

  const sequences = timeline.clips.map((clip, i) => {
    const from = Math.round(clip.start * fps);
    const nextStart = timeline.clips[i + 1]?.start ?? timeline.duration_seconds;
    const duration = Math.max(1, Math.round(nextStart * fps) - from);
    const Beat = BEATS[i];
    return (
      <Sequence key={clip.i} from={from} durationInFrames={duration}>
        <Beat duration={duration} />
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, fontFamily: 'Inter, sans-serif' }}>
      <style>{fontCss}</style>
      <Audio src={staticFile('audio/voiceover-websites-v2.wav')} volume={1} />
      {sequences}
      {activeIndex < 5 && (
        <Caption clip={timeline.clips[activeIndex]} frame={frame} fps={fps} />
      )}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 40%,transparent 55%,rgba(7,16,34,${0.12 + 0.04 * Math.sin(frame / 18)}) 100%)`,
          zIndex: 30,
        }}
      />
    </AbsoluteFill>
  );
};
