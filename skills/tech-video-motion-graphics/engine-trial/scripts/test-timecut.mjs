import { execFileSync, spawnSync } from 'node:child_process';
import { rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getChromium } from './lib/chromium.mjs';

const chromium = await getChromium();
const ffmpeg = execFileSync(
  '/tmp/kvenv/bin/python',
  ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],
  { encoding: 'utf8' },
).trim();
const html = fileURLToPath(new URL('./timecut-demo.html', import.meta.url));
const cli = fileURLToPath(new URL('../node_modules/timecut/cli.js', import.meta.url));
const output = '/tmp/timecut-demo.mp4';
const frames = '/tmp/timecut-frames';
rmSync(output, { force: true });
rmSync(frames, { recursive: true, force: true });

const env = {
  ...process.env,
  PUPPETEER_EXECUTABLE_PATH: chromium.executablePath,
  CHROME_PATH: chromium.executablePath,
  FONTCONFIG_PATH: process.env.FONTCONFIG_PATH ?? '/tmp/fonts',
  HOME: process.env.HOME ?? '/tmp',
  LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH ?? '/tmp/al2023/lib',
};

const args = [
  cli,
  html,
  '--output', output,
  '--fps', '30',
  '--duration', '2',
  '--frames', '60',
  '--viewport', '540,960',
  '--width', '540',
  '--height', '960',
  '--pix-fmt', 'yuv420p',
  '--screenshot-type', 'jpeg',
  '--screenshot-quality', '90',
  '--frame-cache', frames,
  '--threads', '1',
  '--executable-path', chromium.executablePath,
  '--ffmpeg-path', ffmpeg,
  '--launch-arguments', '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --hide-scrollbars',
];

console.log('timecut:', cli);
console.log('ffmpeg:', ffmpeg);
console.log('chromium:', chromium.executablePath);
const result = spawnSync(process.execPath, args, {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  env,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
  stdio: ['ignore', 'pipe', 'pipe'],
});
if (result.stdout) console.log(result.stdout.trim());
if (result.stderr) console.log(result.stderr.trim());
if (result.status !== 0) {
  console.error('Timecut FAILED with status', result.status);
  process.exitCode = 1;
} else {
  console.log('timecut output:', output, statSync(output).size, 'bytes');
  console.log('TIMECUT_OK');
}
