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
import { searchAt, validateOpening } from './lib-search-opening.mjs';
import planJson from './booking.plan.json';

/*
 * Altraware Business Story 03 — "Naweza ku-book vipi?"
 * Built 'like latest' (pilot 14 website-era): same 6-shot contract,
 * searchAt()-driven opening from a validated plan, .example domain,
 * MFANO WA SEARCH label throughout, text-only ChatGPT/Gemini marks,
 * KIELELEZO labels on illustrative proof (real captures stay private).
 * Design: cream/purple studio identity + spring motion, Bricolage display.
 * 45s · 1080×1920 @60fps · voice-04 scratch (owner VO replaces later).
 */

const FPS = 60;
const W = 1080;
const H = 1920;
const TOTAL = 2700;

const PLAN = validateOpening(planJson);

// studio palette (from the search-reels skill identity)
const CREAM = '#fcf5e9';
const CREAM2 = '#f6ecd9';
const INKP = '#2b203f';
const PURPLE = '#49337c';
const VIOLET = '#8d70ac';
const LILAC = '#f2e6ff';
const WARM = '#fff8eb';
const GOLD = '#eab308';
const GREEN = '#1b7a36';
const DARK = '#241a3a';

const FONT_DISPLAY = '"Bricolage Grotesque", "Fraunces", Georgia, serif';
const FONT_SERIF = '"Fraunces", Georgia, serif';
const FONT_BODY = '"Inter", Arial, sans-serif';
const FONT_MONO = '"JetBrains Mono", "Courier New", monospace';

const fontCss = `
@font-face{font-family:'Bricolage Grotesque';src:url('${staticFile('fonts/bricolage-grotesque-latin-wght-normal.woff2')}') format('woff2');font-weight:200 800;font-display:swap}
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-normal.woff2')}') format('woff2');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Fraunces';src:url('${staticFile('fonts/fraunces-latin-opsz-italic.woff2')}') format('woff2');font-weight:100 900;font-style:italic;font-display:swap}
@font-face{font-family:'Inter';src:url('${staticFile('fonts/inter-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'JetBrains Mono';src:url('${staticFile('fonts/jetbrains-mono-latin-wght-normal.woff2')}') format('woff2');font-weight:100 900;font-display:swap}
`;

const SHOTS = [
  { id: 1, from: 0, to: 360, captions: ['Mteja anauliza ChatGPT au Gemini —', '“naweza ku-book vipi?”'] },
  { id: 2, from: 360, to: 708, captions: ['AI inaweza kumpa jibu. Lakini akifungua link,', 'anakuta nini?'] },
  { id: 3, from: 708, to: 1176, captions: ['Website yako ndiyo sehemu unayodhibiti.', 'Huduma · masaa na bei · mawasiliano.'] },
  { id: 4, from: 1176, to: 1656, captions: ['Kwa mifano yetu — menyu hapa, specs hapa.', 'Bila kuuliza tena.'] },
  { id: 5, from: 1656, to: 2256, captions: ['Site nyepesi kwa simu, taarifa wazi.', 'Kuonekana si guarantee.'] },
  { id: 6, from: 2256, to: 2700, captions: ['Comment WEB hapo chini —', 'nitakutumie checklist ya bure.'] },
];

/* ------------------------------- atoms ---------------------------------- */

const ease = (f, a, b) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

const slamIn = (lf, at, dur = 16) =>
  lf < at ? 0 : spring({ frame: lf - at, fps: FPS, config: { damping: 24, stiffness: 320, mass: 0.75 }, durationInFrames: dur });

const BeatFade = ({ lf }) => (
  <div style={{ position: 'absolute', inset: 0, background: '#14101f', opacity: lf < 8 ? 1 - lf / 8 : 0, zIndex: 60, pointerEvents: 'none' }} />
);

const DotGrid = ({ color = 'rgba(43,32,63,0.07)', spacing = 46 }) => (
  <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${color} 1.6px, transparent 1.6px)`, backgroundSize: `${spacing}px ${spacing}px` }} />
);

const Brand = ({ chapter, dark = false }) => (
  <div style={{ position: 'absolute', top: 84, left: 72, right: 72, display: 'flex', alignItems: 'center', gap: 14, zIndex: 40 }}>
    <div style={{ width: 15, height: 15, background: GOLD }} />
    <span style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.2em', color: dark ? '#fdf6e9' : INKP, fontWeight: 700 }}>ALTRAWARE</span>
    <span style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.16em', color: dark ? 'rgba(253,246,233,0.55)' : 'rgba(43,32,63,0.5)' }}>BUSINESS STORY / 03</span>
    <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.14em', color: dark ? 'rgba(253,246,233,0.55)' : 'rgba(43,32,63,0.5)' }}>{String(chapter).padStart(2, '0')} — 06</span>
  </div>
);

const Title = ({ eyebrow, children, dark = false, top = 200 }) => (
  <div style={{ position: 'absolute', top, left: 72, right: 72, zIndex: 5 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <div style={{ width: 34, height: 3, background: GOLD }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: '0.2em', color: dark ? 'rgba(253,246,233,0.65)' : PURPLE }}>{eyebrow}</span>
    </div>
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 92, lineHeight: 1.04, letterSpacing: '-0.015em', color: dark ? '#fdf6e9' : INKP }}>
      {children}
    </div>
  </div>
);

const Em = ({ children }) => (
  <span style={{ fontFamily: FONT_SERIF, fontStyle: 'italic', fontWeight: 560 }}>{children}</span>
);

const CaptionPill = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const dur = shot.to - shot.from;
  const idx = Math.min(shot.captions.length - 1, Math.floor((lf / dur) * shot.captions.length));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 92, display: 'flex', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ maxWidth: 950, background: 'rgba(20,16,31,0.9)', borderRadius: 999, padding: '20px 44px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 18px 50px rgba(20,16,31,0.35)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: GOLD, flexShrink: 0, boxShadow: `0 0 14px ${GOLD}` }} />
        <div style={{ color: '#fffdf7', fontFamily: FONT_BODY, fontSize: 34, fontWeight: 650, textAlign: 'center' }}>{shot.captions[idx]}</div>
      </div>
    </div>
  );
};

/* ------------------------- SCENE 1 · SEARCH ------------------------------ */

const Pointer = ({ x, y, press = 0, opacity = 1 }) => (
  <svg style={{ position: 'absolute', left: x, top: y, transform: `scale(${1 - 0.14 * press})`, opacity, zIndex: 30 }} width="46" height="60" viewBox="0 0 42 55">
    <path d="M 5,3 38,34 25,35 30,46 22,51 16,38 6,47 Z" stroke="#fffaf5" strokeLinejoin="round" strokeWidth="4" fill={PURPLE} />
  </svg>
);

const SceneSearch = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const s = searchAt(PLAN, lf);
  const t = PLAN.beats;
  const reveal = ease(lf, t.ready, t.ready + 24);
  const hover = ease(lf, t.hover, t.hover + 22);
  const press = ease(lf, t.click - 1, t.click + 5) * (1 - ease(lf, t.click + 8, t.open));
  const send = ease(lf, t.submit - 2, t.submit + 3) * (1 - ease(lf, t.submit + 4, t.submit + 12));
  const open = s.phase === 'open';
  const shift = ease(lf, 210, t.hover + 24);
  const cardIn = slamIn(lf, 4, 18);
  const cursorOn = Math.floor(lf / 16) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <DotGrid />
      <Brand chapter={1} />
      <Title eyebrow={`${s.label} · SIMULATION`}>
        Mteja anatafuta
        <br />
        <Em>booking.</Em>
      </Title>

      {/* search app card */}
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 80,
          right: 80,
          background: '#fffefa',
          borderRadius: 30,
          border: '2.5px solid #ddcdee',
          boxShadow: '0 44px 100px rgba(43,32,63,0.22), 0 8px 24px rgba(43,32,63,0.10)',
          transform: `rotate(-1.2deg) translateY(${(1 - cardIn) * 70}px)`,
          opacity: cardIn,
          overflow: 'hidden',
        }}
      >
        {/* chrome bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: PURPLE, padding: '22px 30px' }}>
          {['#f28b82', '#fbbc04', '#34a853'].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 999, background: c }} />
          ))}
          <div style={{ flex: 1, marginLeft: 18, background: 'rgba(255,250,240,0.14)', borderRadius: 999, padding: '10px 24px', fontFamily: FONT_MONO, fontSize: 24, color: '#fdf6e9', letterSpacing: '0.04em' }}>
            {open ? s.domain : 'tafuta · ui ya mfano'}
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 22, color: 'rgba(253,246,233,0.6)' }}>01</span>
        </div>

        {open ? (
          /* opened .example page */
          <div style={{ padding: '54px 48px 58px', opacity: ease(lf, t.open, t.open + 20) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <div style={{ width: 74, height: 74, borderRadius: 999, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 40, fontWeight: 800, fontFamily: FONT_BODY }}>✓</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, color: INKP }}>Page imefunguka.</div>
            </div>
            <div style={{ marginTop: 26, fontFamily: FONT_MONO, fontSize: 25, color: PURPLE, letterSpacing: '0.1em' }}>{s.domain} · PAGE YA MFANO</div>
            <div style={{ marginTop: 34, display: 'flex', gap: 16 }}>
              {['09:00', '11:30', '14:00'].map((h, i) => (
                <div key={h} style={{ border: `2px solid ${i === 1 ? GREEN : '#d9c9ea'}`, background: i === 1 ? '#eaf6ec' : '#fff', borderRadius: 14, padding: '14px 26px', fontFamily: FONT_MONO, fontSize: 27, color: i === 1 ? GREEN : INKP }}>{h}</div>
              ))}
            </div>
          </div>
        ) : (
          /* query + result */
          <div style={{ padding: '40px 48px 50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <svg width="40" height="40" viewBox="0 0 32 32">
                <circle cx="13" cy="13" r="8" fill="none" stroke={VIOLET} strokeWidth="3" />
                <path d="M19 19l9 9" stroke={VIOLET} strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div style={{ fontFamily: FONT_BODY, fontSize: 46, fontWeight: 650, color: INKP, minHeight: 60 }}>
                {s.query || <span style={{ color: 'rgba(43,32,63,0.4)' }}>Andika swali…</span>}
                <span style={{ display: 'inline-block', width: 4, height: 48, background: PURPLE, marginLeft: 5, verticalAlign: '-7px', opacity: s.phase === 'type' && cursorOn ? 1 : 0 }} />
              </div>
              <div style={{ marginLeft: 'auto', width: 72, height: 72, borderRadius: 999, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.18 * send})`, boxShadow: `0 10px 26px rgba(27,122,54,${0.3 + send * 0.4})` }}>
                <span style={{ color: '#fff', fontSize: 36, fontWeight: 800, fontFamily: FONT_BODY }}>↵</span>
              </div>
            </div>

            {/* waiting shimmer */}
            {s.phase === 'waiting' && (
              <div style={{ marginTop: 40 }}>
                <div style={{ height: 12, borderRadius: 8, background: LILAC, overflow: 'hidden' }}>
                  <div style={{ width: 100 + ease(lf, t.submit, t.ready) * 690, height: '100%', borderRadius: 8, background: `linear-gradient(90deg, ${PURPLE}, ${VIOLET})` }} />
                </div>
                <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.18em', color: VIOLET }}>INATAFUTA · SIMULATION</div>
              </div>
            )}

            {/* result card */}
            {s.canShowResult && (
              <div
                style={{
                  marginTop: 40,
                  border: `2.5px solid ${hover > 0.5 ? PURPLE : VIOLET}`,
                  borderRadius: 20,
                  padding: '28px 32px',
                  background: hover > 0.5 ? WARM : '#fff',
                  boxShadow: hover > 0.5 ? '0 18px 44px rgba(73,51,124,0.22)' : '0 10px 26px rgba(43,32,63,0.10)',
                  opacity: reveal,
                  transform: `translateY(${18 * (1 - reveal) + 4 * press}px) scale(${1 - 0.012 * press})`,
                }}
              >
                <div style={{ fontFamily: FONT_MONO, fontSize: 23, color: PURPLE, letterSpacing: '0.06em' }}>{s.domain} · LINK YA MFANO</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 44, fontWeight: 800, color: INKP }}>Fungua page ya booking</div>
                  <div style={{ fontSize: 44, color: PURPLE, fontFamily: FONT_BODY, transform: `translate(${hover * 6}px, ${hover * -6}px)` }}>↗</div>
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{ padding: '0 48px 34px', fontFamily: FONT_MONO, fontSize: 21, color: 'rgba(43,32,63,0.45)', letterSpacing: '0.04em' }}>Si jibu halisi la AI — UI ya mfano.</div>
      </div>

      {/* pointer with trail */}
      {lf > 210 && !open && (
        <>
          <Pointer x={900 - 200 * ease(lf, 210, t.hover + 26) + 26} y={1340 - 236 * ease(lf, 210, t.hover + 26) + 20} opacity={0.14} />
          <Pointer x={900 - 200 * ease(lf, 210, t.hover + 26) + 13} y={1340 - 236 * ease(lf, 210, t.hover + 26) + 10} opacity={0.28} />
          <Pointer x={900 - 200 * shift} y={1340 - 236 * shift} press={press} />
        </>
      )}

      {/* tools (text-only marks) */}
      <div style={{ position: 'absolute', top: 1560, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: slamIn(lf, 150) }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 24, color: 'rgba(43,32,63,0.55)', letterSpacing: '0.08em' }}>anauliza kwenye</span>
        {['ChatGPT', 'Gemini'].map((m) => (
          <span key={m} style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 27, color: INKP, border: `2px solid ${VIOLET}`, borderRadius: 999, padding: '9px 24px', background: '#fff' }}>{m}</span>
        ))}
      </div>

      <CaptionPill shot={shot} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* -------------------------- SCENE 2 · LINK ------------------------------- */

const SceneLink = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const card = slamIn(lf, 20, 18);
  const slotPop = (i) => slamIn(lf, 60 + i * 14, 13);
  const pulse = 0.5 + 0.5 * Math.sin(lf / 11);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${CREAM} 0%, ${LILAC} 100%)` }}>
      <DotGrid />
      <Brand chapter={2} />
      <Title eyebrow="SWALI HALISI">
        Akifungua link,
        <br />
        <Em>anakuta nini?</Em>
      </Title>

      <div style={{ position: 'absolute', left: 72, top: 700, width: 430 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, lineHeight: 1.08, color: INKP, opacity: slamIn(lf, 40), transform: `translateY(${(1 - slamIn(lf, 40)) * 40}px)` }}>
          Anapaswa kukuta <Em>jibu</Em> —
        </div>
        <div style={{ marginTop: 26, fontFamily: FONT_BODY, fontSize: 34, fontWeight: 550, lineHeight: 1.45, color: 'rgba(43,32,63,0.75)', opacity: slamIn(lf, 70) }}>
          si ukiwa, si “jaribu tena baadaye”.
        </div>
        <div style={{ marginTop: 40, fontFamily: FONT_MONO, fontSize: 24, letterSpacing: '0.1em', color: PURPLE, opacity: slamIn(lf, 100) }}>haya yote yapo kwenye page unayodhibiti</div>
      </div>

      {/* phone mock: booking.example page */}
      <div
        style={{
          position: 'absolute',
          top: 620,
          right: 60,
          width: 500,
          height: 880,
          background: '#fffefa',
          borderRadius: 44,
          border: '10px solid #14101f',
          boxShadow: '0 50px 110px rgba(43,32,63,0.35)',
          transform: `rotate(1.6deg) translateY(${(1 - card) * 90}px)`,
          opacity: card,
          overflow: 'hidden',
        }}
      >
        <div style={{ background: LILAC, padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: VIOLET }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 21, color: PURPLE }}>booking.example</span>
          <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO, fontSize: 18, letterSpacing: '0.1em', background: PURPLE, color: '#fdf6e9', borderRadius: 8, padding: '4px 12px' }}>PAGE YA MFANO</span>
        </div>
        <div style={{ padding: '34px 30px' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 42, color: INKP, lineHeight: 1.1 }}>Studio Mfano<br /><Em>Booking</Em></div>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['Kukata nywele', 'Kupaka rangi', 'Massage'].map((sv, i) => (
              <div key={sv} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '2px solid #ead9f7', borderRadius: 16, padding: '16px 20px', opacity: slamIn(lf, 40 + i * 10), transform: `translateX(${(1 - slamIn(lf, 40 + i * 10)) * 26}px)` }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: VIOLET }} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 28, fontWeight: 650, color: INKP }}>{sv}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {['09:00', '11:30', '14:00', '16:30'].map((h, i) => (
              <div key={h} style={{ border: `2px solid ${i === 1 ? GREEN : '#d9c9ea'}`, background: i === 1 ? '#eaf6ec' : '#fff', color: i === 1 ? GREEN : INKP, borderRadius: 12, padding: '12px 20px', fontFamily: FONT_MONO, fontSize: 24, transform: `scale(${0.6 + slotPop(i) * 0.4})`, opacity: slotPop(i) }}>{h}</div>
            ))}
          </div>
          <div style={{ marginTop: 30, background: GREEN, borderRadius: 18, padding: '22px 0', textAlign: 'center', fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: '#fff', letterSpacing: '0.02em', boxShadow: `0 0 ${24 + pulse * 22}px rgba(27,122,54,${0.35 + pulse * 0.25})`, opacity: slamIn(lf, 130), transform: `translateY(${(1 - slamIn(lf, 130)) * 30}px)` }}>
            BOOK SASA
          </div>
        </div>
      </div>

      <CaptionPill shot={shot} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* -------------------------- SCENE 3 · OWN -------------------------------- */

const OWN_ROWS = [
  { n: '01', t: 'HUDUMA', s: 'unachotoa, kwa wazi' },
  { n: '02', t: 'MASAA & BEI', t2: true, sub: 'za sasa — si za zamani' },
  { n: '03', t: 'MAWASILIANO', sub: 'simu · WhatsApp · booking link' },
];

const SliderRow = ({ lf, at, label }) => {
  const on = ease(lf, at, at + 30);
  return (
    <div style={{ marginBottom: 52, opacity: 0.35 + 0.65 * slamIn(lf, at - 8) }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.18em', color: 'rgba(43,32,63,0.6)', marginBottom: 14 }}>{label}</div>
      <div style={{ position: 'relative', height: 10, borderRadius: 6, background: '#e4d3f2' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${on * 100}%`, background: `linear-gradient(90deg, ${VIOLET}, ${PURPLE})`, borderRadius: 6 }} />
        <div style={{ position: 'absolute', top: '50%', left: `${on * 100}%`, transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: 999, background: '#fff', border: `4px solid ${PURPLE}`, boxShadow: '0 8px 20px rgba(43,32,63,0.25)' }} />
      </div>
    </div>
  );
};

const SceneOwn = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const rowsAt = [50, 120, 195];
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <DotGrid />
      <Brand chapter={3} />
      <Title eyebrow="SEHEMU UNAYODHIBITI">
        Website yako ndiyo
        <br />
        <Em>unadhibiti.</Em>
      </Title>

      <div style={{ position: 'absolute', left: 72, right: 510, top: 640, display: 'flex', flexDirection: 'column', gap: 46 }}>
        {OWN_ROWS.map((r, i) => {
          const on = slamIn(lf, rowsAt[i], 16);
          const check = slamIn(lf, rowsAt[i] + 22, 12);
          return (
            <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: 26, opacity: 0.15 + 0.85 * on, transform: `translateX(${(1 - on) * -34}px)` }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 26, color: VIOLET }}>{r.n}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52, color: INKP, letterSpacing: '-0.01em', lineHeight: 1 }}>{r.t}</div>
                <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 27, color: 'rgba(43,32,63,0.65)', fontWeight: 550 }}>{r.s || r.sub}</div>
              </div>
              <div style={{ width: 62, height: 62, borderRadius: 999, background: check > 0.5 ? GREEN : '#e4d3f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 800, fontFamily: FONT_BODY, transform: `scale(${0.5 + check * 0.5})`, opacity: check }}>✓</div>
            </div>
          );
        })}
      </div>

      {/* control panel motif */}
      <div style={{ position: 'absolute', right: 56, top: 660, width: 380, background: '#fffefa', border: '2.5px solid #ddcdee', borderRadius: 26, padding: '40px 36px', boxShadow: '0 30px 70px rgba(43,32,63,0.16)', transform: `rotate(1.4deg) translateY(${(1 - slamIn(lf, 30, 18)) * 60}px)`, opacity: slamIn(lf, 30, 18) }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.16em', color: PURPLE, marginBottom: 36 }}>UDHIBITI · WAKO</div>
        <SliderRow lf={lf} at={rowsAt[0] + 10} label="TAARIFA" />
        <SliderRow lf={lf} at={rowsAt[1] + 10} label="BEI" />
        <SliderRow lf={lf} at={rowsAt[2] + 10} label="HATUA" />
        <div style={{ fontFamily: FONT_MONO, fontSize: 20, color: 'rgba(43,32,63,0.45)', lineHeight: 1.6 }}>hubadilisha muda wowote,<br />bila kutegemea mtu</div>
      </div>

      <CaptionPill shot={shot} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* -------------------------- SCENE 4 · WORK ------------------------------- */

const SiteWindow = ({ path, tag, children, lf, at }) => (
  <div style={{ background: '#fffefa', borderRadius: 24, overflow: 'hidden', border: '2px solid rgba(141,112,172,0.5)', boxShadow: '0 30px 80px rgba(10,6,20,0.5)', opacity: slamIn(lf, at, 16), transform: `translateY(${(1 - slamIn(lf, at, 16)) * 40}px)` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#17102a', padding: '14px 24px' }}>
      <div style={{ width: 12, height: 12, borderRadius: 999, background: VIOLET }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: 'rgba(253,246,233,0.85)' }}>{path}</span>
      <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO, fontSize: 17, letterSpacing: '0.12em', color: GOLD, border: `1.5px solid ${GOLD}`, borderRadius: 7, padding: '3px 10px' }}>{tag}</span>
    </div>
    <div style={{ padding: '28px 28px 32px' }}>{children}</div>
  </div>
);

const SceneWork = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const swap = lf >= 230;
  const crossA = 1 - ease(lf, 226, 252);
  const crossB = ease(lf, 226, 252);
  const reveal = ease(lf, 70, 110);
  const scroll = ease(lf - 230, 60, 120);
  return (
    <AbsoluteFill style={{ background: DARK }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(141,112,172,0.14) 1.6px, transparent 1.6px)', backgroundSize: '46px 46px' }} />
      <Brand chapter={4} dark />
      <Title eyebrow="PROOF · MIFANO YETU" dark>
        Kwa mifano yetu —
        <br />
        <Em>bila kuuliza tena.</Em>
      </Title>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 600 }}>
        {/* Bongo window */}
        <div style={{ position: 'absolute', left: 0, right: 0, opacity: crossA, transform: `translateX(${-30 * (1 - crossA)}px)` }}>
          <SiteWindow lf={lf} at={26} path="bongofoodie.vercel.app/search" tag="KIELELEZO">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, border: '2px solid #ead9f7', borderRadius: 14, padding: '16px 22px' }}>
              <svg width="30" height="30" viewBox="0 0 32 32"><circle cx="13" cy="13" r="8" fill="none" stroke={VIOLET} strokeWidth="3" /><path d="M19 19l9 9" stroke={VIOLET} strokeWidth="3" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: FONT_BODY, fontSize: 32, fontWeight: 650, color: INKP }}>pilau</span>
            </div>
            <div style={{ marginTop: 22, border: '2px solid #d9c9ea', borderRadius: 16, padding: '20px 24px', background: WARM, opacity: reveal, transform: `translateY(${(1 - reveal) * 24}px)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 38, color: INKP }}>Pilau ya Kuku</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 21, color: 'rgba(43,32,63,0.55)', marginTop: 6 }}>MENU · INAPATIKANA</div>
              </div>
              <div style={{ fontSize: 36, color: GREEN, fontFamily: FONT_BODY, fontWeight: 800 }}>✓</div>
            </div>
            <div style={{ marginTop: 20, fontFamily: FONT_MONO, fontSize: 19, color: 'rgba(43,32,63,0.45)' }}>mteja anaona menyu — bila kuuliza</div>
          </SiteWindow>
        </div>
        {/* Audenic window */}
        <div style={{ position: 'absolute', left: 0, right: 0, opacity: crossB, transform: `translateX(${30 * (1 - crossB)}px)`, pointerEvents: 'none' }}>
          <SiteWindow lf={lf} at={230} path="audenic.vercel.app/shop/…" tag="KIELELEZO">
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: INKP }}>Audenic Classic Red</div>
            <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 20, color: 'rgba(43,32,63,0.5)' }}>PRODUCT PAGE</div>
            <div style={{ marginTop: 20, height: 210, overflow: 'hidden', position: 'relative', borderRadius: 14, border: '2px solid #ead9f7' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${-150 * scroll}px)`, padding: '22px' }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 28, fontWeight: 650, color: INKP }}>Maelezo ya bidhaa…</div>
                <div style={{ marginTop: 130, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, color: PURPLE }}>Technical specifications</div>
                <div style={{ marginTop: 12, fontFamily: FONT_MONO, fontSize: 20, color: 'rgba(43,32,63,0.6)', lineHeight: 1.7 }}>driver · battery · connectivity</div>
              </div>
            </div>
            <div style={{ marginTop: 20, fontFamily: FONT_MONO, fontSize: 19, color: 'rgba(43,32,63,0.45)' }}>specs ziko page-ni — si picha tu</div>
          </SiteWindow>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 1450, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 22, letterSpacing: '0.06em', color: 'rgba(253,246,233,0.55)', opacity: slamIn(lf, 300) }}>
        kielelezo — si capture halisi · proof halisi iko kwenye review kit ya owner
      </div>

      <CaptionPill shot={shot} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* -------------------------- SCENE 5 · OFFER ------------------------------ */

const OFFER_ROWS = [
  { n: '01', t: 'Mobile-first', s: 'inasomeka bila zoom, hata kwa mtandao mbaya' },
  { n: '02', t: 'Taarifa wazi', s: 'menu, bei, specs kama text — search na AI zisome' },
  { n: '03', t: 'Hatua moja', s: 'button moja iliyo wazi: simu, WhatsApp au booking' },
];

const SceneOffer = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const rowsAt = [24, 120, 210];
  return (
    <AbsoluteFill style={{ background: '#17102a' }}>
      <div style={{ position: 'absolute', width: 900, height: 900, left: -300, top: -200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(141,112,172,0.28) 0%, transparent 62%)' }} />
      <div style={{ position: 'absolute', width: 800, height: 800, right: -260, bottom: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,179,8,0.14) 0%, transparent 62%)' }} />
      <Brand chapter={5} dark />
      <Title eyebrow="TUNACHOJENGA" dark>
        Site nyepesi kwa simu,
        <br />
        <Em>taarifa wazi.</Em>
      </Title>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 640, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {OFFER_ROWS.map((r, i) => {
          const on = slamIn(lf, rowsAt[i], 18);
          return (
            <div key={r.n} style={{ display: 'flex', gap: 28, alignItems: 'flex-start', opacity: 0.12 + 0.88 * on, transform: `translateY(${(1 - on) * 34}px)` }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 26, color: GOLD, marginTop: 12 }}>{r.n}</span>
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 58, color: '#fdf6e9', lineHeight: 1.02 }}>{r.t}</div>
                <div style={{ marginTop: 8, fontFamily: FONT_BODY, fontSize: 30, fontWeight: 550, color: 'rgba(253,246,233,0.68)' }}>{r.s}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 1330, opacity: slamIn(lf, 330, 16) }}>
        <div style={{ border: `2px solid ${GOLD}`, borderRadius: 18, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(234,179,8,0.08)' }}>
          <span style={{ fontSize: 34 }}>⚠</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: '0.08em', color: GOLD }}>KUONEKANA SI GUARANTEE — indexing si ranking</span>
        </div>
      </div>

      <CaptionPill shot={shot} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

/* -------------------------- SCENE 6 · CLOSE ------------------------------ */

const SceneClose = ({ shot }) => {
  const frame = useCurrentFrame();
  const lf = frame - shot.from;
  const word = 'WEB';
  const n = Math.max(0, Math.min(word.length, Math.floor((lf - 26) / 8)));
  const cursorOn = Math.floor(lf / 15) % 2 === 0 || n < word.length;
  const big = slamIn(lf, 50, 18);
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <DotGrid />
      <Brand chapter={6} />
      <Title eyebrow="ZAWADI YA BURE">
        Comment <Em>WEB</Em> —
        <br />
        hapo chini.
      </Title>

      {/* comment mock */}
      <div style={{ position: 'absolute', top: 660, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 720, background: '#fffefa', border: '2.5px solid #ddcdee', borderRadius: 30, padding: '30px 36px', boxShadow: '0 34px 80px rgba(43,32,63,0.18)', transform: `rotate(-1.1deg) translateY(${(1 - slamIn(lf, 12, 16)) * 50}px)`, opacity: slamIn(lf, 12, 16) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg, ${PURPLE}, ${VIOLET})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BODY, fontWeight: 800, fontSize: 32, color: '#fff' }}>W</div>
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: 'rgba(43,32,63,0.5)' }}>@wewe · sasa hivi</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 52, fontWeight: 800, color: INKP, letterSpacing: '0.08em', marginTop: 2 }}>
                {word.slice(0, n)}
                <span style={{ display: 'inline-block', width: 5, height: 50, background: PURPLE, marginLeft: 5, verticalAlign: '-7px', opacity: cursorOn ? 1 : 0 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 950, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 44, fontWeight: 650, color: INKP, opacity: big, transform: `translateY(${(1 - big) * 30}px)` }}>
          nitakutumie <b>checklist ya bure</b> — ikiwa site yako
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 44, fontWeight: 650, color: INKP, opacity: big, transform: `translateY(${(1 - big) * 34}px)` }}>
          inajibu maswali ya wateja.
        </div>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', opacity: slamIn(lf, 90, 16) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, border: `2px solid ${VIOLET}`, borderRadius: 16, padding: '16px 28px', background: '#fff' }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: '#c0392b', letterSpacing: '0.08em' }}>PDF</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 25, color: INKP }}>WEB-Checklist-ya-Website.pdf</span>
          </div>
        </div>
      </div>

      {/* brand row */}
      <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: slamIn(lf, 120, 16) }}>
        <Img src={staticFile('logo.png')} style={{ width: 64, height: 64, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 26, color: INKP, letterSpacing: '0.1em', fontWeight: 700 }}>ALTRAWARE TECH</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 23, color: 'rgba(43,32,63,0.55)', marginTop: 4 }}>@altrawaretechnology · 0790942616</div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 1500, left: 0, right: 0, textAlign: 'center', fontFamily: FONT_MONO, fontSize: 22, color: 'rgba(43,32,63,0.45)', letterSpacing: '0.08em', opacity: slamIn(lf, 140) }}>
        business story 03 · scratch voice — owner VO inakuja
      </div>

      <CaptionPill shot={shot} />
      <BeatFade lf={lf} />
    </AbsoluteFill>
  );
};

const SCENES = [SceneSearch, SceneLink, SceneOwn, SceneWork, SceneOffer, SceneClose];

export const AltrawareBookingReelV1 = () => {
  const frame = useCurrentFrame();
  const active = SHOTS.find((s) => frame >= s.from && frame < s.to) || SHOTS[SHOTS.length - 1];
  const Scene = SCENES[active.id - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM, fontFamily: FONT_BODY }}>
      <style>{fontCss}</style>
      <Scene shot={active} />
      <Audio src={staticFile('audio/voiceover-booking-v1.wav')} />
    </AbsoluteFill>
  );
};

export const RemotionRootBookingV1 = () => (
  <Composition id="AltrawareBookingReelV1" component={AltrawareBookingReelV1} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
