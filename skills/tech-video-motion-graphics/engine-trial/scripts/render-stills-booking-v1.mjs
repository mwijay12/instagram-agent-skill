// Stills for the booking-era reel v1 (key frames per scene).
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';
import { getChromium } from './lib/chromium.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const qaDir = resolve(root, '../../../content-kit/code-video/qa-booking-v1');
const publicDir = resolve(root, 'public');
const entryPoint = resolve(root, 'remotion/index-booking-v1.jsx');

const frames = [950];

const chromium = await getChromium();
mkdirSync(qaDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint,
  outDir: '/tmp/booking-v1-bundle',
  publicDir,
  rootDir: root,
  enableCaching: false,
  symlinkPublicDir: false,
  webpackOverride: (config) => config,
});

const compositions = await getCompositions({
  serveUrl,
  browserExecutable: chromium.executablePath,
  chromiumOptions: { gl: 'swiftshader', headless: true },
  chromeMode: 'headless-shell',
  inputProps: {},
  envVariables: { HOME: '/tmp', FONTCONFIG_PATH: '/tmp/fonts' },
});

const composition = compositions.find((c) => c.id === 'AltrawareBookingReelV1');
if (!composition) throw new Error('AltrawareBookingReelV1 not found');
console.log('composition:', composition.id, composition.fps, composition.durationInFrames);

for (const frame of frames) {
  const out = resolve(qaDir, `frame-${String(frame).padStart(4, '0')}.png`);
  await renderStill({
    composition,
    serveUrl,
    frame,
    output: out,
    browserExecutable: chromium.executablePath,
    chromiumOptions: { gl: 'swiftshader', headless: true },
    chromeMode: 'headless-shell',
    inputProps: {},
    envVariables: { HOME: '/tmp', FONTCONFIG_PATH: '/tmp/fonts' },
  });
  console.log('still', frame);
}
console.log('BOOKING_V1_STILLS_OK');
