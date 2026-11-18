import { execFileSync } from 'node:child_process';
import { chmodSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { getChromium } from './lib/chromium.mjs';

const require = createRequire(import.meta.url);
const { renderVideo } = require('@revideo/renderer');

const root = fileURLToPath(new URL('..', import.meta.url));
const chromium = await getChromium();
const ffmpegPath = execFileSync(
  '/tmp/kvenv/bin/python',
  ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],
  { encoding: 'utf8' },
).trim();
const ffprobePath = fileURLToPath(
  new URL('../node_modules/@remotion/compositor-linux-x64-gnu/ffprobe', import.meta.url),
);
chmodSync(ffprobePath, 0o755);
const output = '/tmp/revideo-demo.mp4';
rmSync(output, { force: true });

process.chdir(root);
process.env.PUPPETEER_EXECUTABLE_PATH = chromium.executablePath;
process.env.CHROME_PATH = chromium.executablePath;
process.env.FONTCONFIG_PATH ??= '/tmp/fonts';
process.env.HOME ??= '/tmp';

const env = {
  ...process.env,
  PUPPETEER_EXECUTABLE_PATH: chromium.executablePath,
  CHROME_PATH: chromium.executablePath,
  FONTCONFIG_PATH: process.env.FONTCONFIG_PATH,
  HOME: process.env.HOME,
  LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH,
};

console.log('revideo renderer:', require.resolve('@revideo/renderer'));
console.log('chromium:', chromium.executablePath);
console.log('ffmpeg:', ffmpegPath);
console.log('ffprobe:', ffprobePath);

try {
  const rendered = await renderVideo({
    projectFile: 'revideo-project.tsx',
    variables: {},
    settings: {
      outFile: output,
      outDir: '/tmp',
      workers: 1,
      logProgress: true,
      viteBasePort: 9100,
      ffmpeg: {
        ffmpegPath,
        ffprobePath,
        ffmpegLogLevel: 'error',
      },
      puppeteer: {
        headless: true,
        executablePath: chromium.executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--hide-scrollbars',
        ],
        env,
        timeout: 60000,
      },
      projectSettings: {
        range: [0, 2],
        size: { x: 540, y: 960 },
        background: '#071022',
        exporter: {
          name: '@revideo/core/ffmpeg',
          options: { format: 'mp4' },
        },
      },
      viteConfig: {
        server: { host: '127.0.0.1', strictPort: false },
      },
    },
  });
  console.log('revideo returned:', rendered);
  console.log('revideo output:', output, statSync(output).size, 'bytes');
  console.log('REVIDEO_OK');
} catch (err) {
  console.error('Revideo FAILED:', err.stack || err.message);
  process.exitCode = 1;
}
