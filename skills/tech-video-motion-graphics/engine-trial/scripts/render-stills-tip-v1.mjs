import { mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';
import { getChromium } from './lib/chromium.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const qaDir = resolve(root, '../../../content-kit/code-video/qa-tip-v1');
const outDir = resolve(root, 'dist/remotion-stills-tip-v1');
const publicDir = resolve(root, 'public');
const entryPoint = resolve(root, 'remotion/index-tip-v1.jsx');

const frames = [30, 180, 360, 600, 900, 1290];

const chromium = await getChromium();
process.env.PUPPETEER_EXECUTABLE_PATH = chromium.executablePath;
process.env.CHROME_PATH = chromium.executablePath;
process.env.FONTCONFIG_PATH ??= '/tmp/fonts';
process.env.HOME ??= '/tmp';

const browserExecutable = chromium.executablePath;
const chromiumOptions = { gl: 'swiftshader', headless: true };
const chromeMode = 'headless-shell';
const logLevel = 'info';
const port = null;
const inputProps = {};
const envVariables = {
  LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH ?? '',
  FONTCONFIG_PATH: process.env.FONTCONFIG_PATH ?? '',
  HOME: process.env.HOME ?? '',
};
const onBrowserLog = (log) => {
  if (log.type === 'error' || log.type === 'warning') {
    console.log(`[browser ${log.type}] ${log.text}`);
  }
};

mkdirSync(dirname(qaDir), { recursive: true });
mkdirSync(qaDir, { recursive: true });

const serveUrl = await bundle({
  entryPoint,
  outDir,
  publicDir,
  rootDir: root,
  enableCaching: false,
  symlinkPublicDir: false,
  rspack: false,
  webpackOverride: (config) => config,
});

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
const composition = compositions.find((c) => c.id === 'AltrawareBusinessTipV1');
if (!composition) throw new Error('AltrawareBusinessTipV1 not found');
console.log('composition:', composition.id, composition.fps, composition.durationInFrames);

for (const frame of frames) {
  const output = resolve(qaDir, `frame-${String(frame).padStart(4, '0')}.png`);
  await renderStill({
    composition,
    serveUrl,
    frame,
    output,
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
  console.log('still', frame, output, statSync(output).size, 'bytes');
}
console.log('TIP_V1_STILLS_OK');
