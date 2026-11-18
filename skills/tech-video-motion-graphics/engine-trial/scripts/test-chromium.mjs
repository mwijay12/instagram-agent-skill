import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { getChromium } from './lib/chromium.mjs';

const opts = await getChromium();
console.log('chromium executable:', opts.executablePath);
try {
  console.log('version:', execFileSync(opts.executablePath, ['--version'], { encoding: 'utf8' }).trim());
} catch (err) {
  console.error('version failed:', err.message);
}

let browser;
try {
  browser = await puppeteer.launch({
    executablePath: opts.executablePath,
    headless: opts.headless,
    args: opts.args,
    dumpio: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#071022;color:#f7f6f2;font:700 90px sans-serif;display:grid;place-items:center;height:100vh">CHROMIUM OK</body></html>`);
  const shot = await page.screenshot({ type: 'png' });
  writeFileSync('/tmp/chromium-smoke.png', shot);
  console.log('puppeteer launch: OK');
  console.log('screenshot: /tmp/chromium-smoke.png', shot.length, 'bytes');
} catch (err) {
  console.error('puppeteer launch FAILED:', err.stack || err.message);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
