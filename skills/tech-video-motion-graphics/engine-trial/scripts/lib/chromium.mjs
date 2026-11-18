import Chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// @sparticuz/chromium ships the headless-shell binary inside the npm tarball.
// No storage.googleapis.com / Playwright CDN download is needed. The sandbox is
// Debian, but the binary is built for AL2023; force-extract the bundled AL2023
// libs and prepend them to LD_LIBRARY_PATH so libnspr4/libnss3 resolve.
const al2023Br = fileURLToPath(
  new URL('../../node_modules/@sparticuz/chromium/bin/al2023.tar.br', import.meta.url),
);
const al2023 = await inflate(al2023Br);
setupLambdaEnvironment(join(al2023, 'lib'));
process.env.FONTCONFIG_PATH ??= join(tmpdir(), 'fonts');
process.env.HOME ??= tmpdir();

let cached;

export async function getChromium() {
  if (cached) return cached;
  const executablePath = await Chromium.executablePath();
  cached = {
    executablePath,
    args: [
      ...Chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
    ],
    headless: 'shell',
  };
  return cached;
}

export function chromiumEnv() {
  return {
    LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH,
    FONTCONFIG_PATH: process.env.FONTCONFIG_PATH,
    HOME: process.env.HOME,
  };
}
