// Full render: elements reel v1 → MP4 (1080x1920 @60fps, 30s, audio).
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { getChromium } from './lib/chromium.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = resolve(root, 'public');
const entryPoint = resolve(root, 'remotion/index-elements-v1.jsx');
const outFile = resolve(root, '../../../content-kit/code-video/samples/10-altraware-elements-reel-v2.mp4');

mkdirSync(resolve(outFile, '..'), { recursive: true });

const chromium = await getChromium();

const serveUrl = await bundle({
  entryPoint,
  outDir: '/tmp/elements-v1-render',
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

const composition = compositions.find((c) => c.id === 'AltrawareElementsReelV1');
if (!composition) throw new Error('AltrawareElementsReelV1 not found');
console.log('rendering', composition.id, composition.durationInFrames, 'frames');

await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: outFile,
  browserExecutable: chromium.executablePath,
  chromiumOptions: { gl: 'swiftshader', headless: true },
  chromeMode: 'headless-shell',
  inputProps: {},
  envVariables: { HOME: '/tmp', FONTCONFIG_PATH: '/tmp/fonts' },
  concurrency: 2,
  onProgress: ({ progress }) => {
    if (Math.round(progress * 100) % 5 === 0) process.stdout.write(`\rprogress ${(progress * 100).toFixed(0)}%`);
  },
});
console.log('\nRENDER_OK', outFile);
