import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';
import { getChromium } from './lib/chromium.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const samples = resolve(root, '../../../content-kit/code-video/samples');
const outDir = resolve(root, 'dist/remotion');
const publicDir = resolve(root, 'public');
const entryPoint = resolve(root, 'remotion/index-v3.jsx');
const poster = resolve(samples, '06-altraware-websites-v3-poster.png');
const video = resolve(samples, '06-altraware-websites-v3.mp4');
const receipt = resolve(samples, '06-render-manifest.json');

const args = process.argv.slice(2);
const mode = args.includes('--still') ? 'still' : args.includes('--render') ? 'render' : 'both';
const frameArg = args.find((a) => a.startsWith('--frame='));
const stillFrame = frameArg ? Number(frameArg.split('=')[1]) : 30;

const chromium = await getChromium();
process.env.PUPPETEER_EXECUTABLE_PATH = chromium.executablePath;
process.env.CHROME_PATH = chromium.executablePath;
process.env.FONTCONFIG_PATH ??= '/tmp/fonts';
process.env.HOME ??= '/tmp';

const chromiumVersion = execFileSync(chromium.executablePath, ['--version'], {
  encoding: 'utf8',
  env: { ...process.env, LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH },
}).trim();

const browserExecutable = chromium.executablePath;
const chromiumOptions = { gl: 'swiftshader', headless: true };
const chromeMode = 'headless-shell';
const logLevel = 'info';
const port = null;
const envVariables = {
  LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH ?? '',
  FONTCONFIG_PATH: process.env.FONTCONFIG_PATH ?? '',
  HOME: process.env.HOME ?? '',
};
const inputProps = {};
const onBrowserLog = (log) => {
  if (log.type === 'error' || log.type === 'warning') {
    console.log(`[browser ${log.type}] ${log.text}`);
  }
};

console.log('REMOTION_TRIAL_START');
console.log('chromium:', chromiumVersion, browserExecutable);
console.log('LD_LIBRARY_PATH:', process.env.LD_LIBRARY_PATH);

const serveUrl = await bundle({
  entryPoint,
  outDir,
  publicDir,
  rootDir: root,
  enableCaching: false,
  symlinkPublicDir: false,
  rspack: false,
  webpackOverride: (config) => config,
  onProgress: (p) => {
    if (p % 25 === 0) console.log(`bundle ${p}%`);
  },
});
console.log('bundle:', serveUrl);

const compositions = await getCompositions({
  serveUrl,
  browserExecutable,
  chromiumOptions,
  chromeMode,
  port,
  logLevel,
  inputProps,
  envVariables,
  timeoutInMilliseconds: 120000,
  onBrowserLog,
  isProduction: true,
});
const composition = compositions.find((c) => c.id === 'AltrawareWebsitesV3');
if (!composition) throw new Error(`Composition not found: ${compositions.map((c) => c.id).join(', ')}`);
console.log('composition:', composition.id, composition.width, composition.height, composition.fps, composition.durationInFrames);

if (mode === 'still' || mode === 'both') {
  mkdirSync(dirname(poster), { recursive: true });
  const still = await renderStill({
    composition,
    serveUrl,
    frame: stillFrame,
    output: poster,
    imageFormat: 'png',
    overwrite: true,
    browserExecutable,
    chromiumOptions,
    chromeMode,
    port,
    logLevel,
    inputProps,
    envVariables,
    scale: 1,
    isProduction: true,
    timeoutInMilliseconds: 120000,
    onBrowserLog,
  });
  console.log('renderStill:', poster, statSync(poster).size, 'bytes', still.contentType);
}

if (mode === 'render' || mode === 'both') {
  mkdirSync(dirname(video), { recursive: true });
  let last = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: video,
    inputProps,
    crf: 22,
    imageFormat: 'jpeg',
    jpegQuality: 88,
    x264Preset: 'veryfast',
    pixelFormat: 'yuv420p',
    audioCodec: 'aac',
    sampleRate: 48000,
    muted: false,
    enforceAudioTrack: true,
    overwrite: true,
    browserExecutable,
    chromiumOptions,
    chromeMode,
    port,
    concurrency: 2,
    logLevel,
    timeoutInMilliseconds: 180000,
    metadata: {
      title: 'Altraware Websites V3 — clean Reel',
      artist: 'Altraware Tech',
      comment: 'Remotion 4.0.544 + Chromium + React; clean plates/SVG; TTS only, no music/SFX',
    },
    onStart: ({ frameCount }) => console.log('renderMedia start:', frameCount, 'frames'),
    onProgress: ({ renderedFrames, encodedFrames, stitchStage }) => {
      if (renderedFrames - last >= 90) {
        last = renderedFrames;
        console.log(`render ${renderedFrames}/${composition.durationInFrames} encoded ${encodedFrames} ${stitchStage ?? ''}`);
      }
    },
    onBrowserLog,
    isProduction: true,
  });
  const bytes = statSync(video).size;
  console.log('renderMedia:', video, bytes, 'bytes');

  const manifest = {
    engine: 'Remotion 4.0.544 / @remotion/renderer / @remotion/bundler',
    react: '18.3.1',
    browser: { version: chromiumVersion, executable: browserExecutable, mode: chromeMode },
    ffmpeg: 'Remotion bundled compositor ffmpeg n7.1',
    composition: {
      id: composition.id,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
      durationSeconds: composition.durationInFrames / composition.fps,
    },
    assets: [
      'plates/11-clean-navy.png',
      'plates/12-clean-paper.png',
      'elements/phone-frame.svg',
      'elements/code-brackets.svg',
      'elements/signal-arc.svg',
      'elements/node-graph.svg',
      'logo.png',
      'plates/13-gold-orb.png',
      'plates/14-violet-ribbon.png',
    ],
    audio: 'audio/voiceover-websites-v2.wav (voice-00 Swahili TTS, atempo 1.7, no music/SFX)',
    poster: '06-altraware-websites-v3-poster.png',
    video: '06-altraware-websites-v3.mp4',
    videoBytes: bytes,
    corrections: {
      visual_system: 'content-kit/code-video/VISUAL-SYSTEM.md V3 clean background law',
      public_phone: '0790942616',
      ig_handle: '@altrawaretechnology',
      logo: 'content-kit/assets/altraware-logo.png (owner confirmed)',
      offline_guard: 'Offline-first, cloud-synced applies to Faida POS only; excluded from websites reel',
      ownership: 'Unamiliki data yako na tovuti/app yako; msingi wa Faida unatolewa kwa leseni.',
      domain_guard: 'No invented domain claim',
      fps_target: 60,
      visual_guard: 'Clean low-frequency plates 11/12 + isolated PNG elements 13/14 + animated SVGs',
      qa_gate: 'G0-G6 including G6 human background-readability check',
    },
    extra_guards: [],
    guards: [
      'No AI-drawn text or logo',
      'No invented metrics, clients, testimonials, or official-website claim',
      'No general-website offline or cloud-sync claim',
      'Ownership uses the exact 09-decisions phrase; no domain ownership claim',
      'Starting prices only; full price after scope',
      'Care Plan 99k/month is a separate service, not SaaS',
      'Tagline: Built in Tanzania, for how Tanzania really works.',
      'No auto-DM, bot, posting, DMs, credentials, or account changes',
    ],
  };
  writeFileSync(receipt, JSON.stringify(manifest, null, 2) + '\n');
  console.log('receipt:', receipt);
}

console.log('REMOTION_TRIAL_OK');
