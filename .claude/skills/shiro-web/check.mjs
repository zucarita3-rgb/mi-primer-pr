// Abre una URL en Chromium (escritorio y celular), saca capturas y lista errores de consola/CSP.
// Uso: node check.mjs <url> <carpeta-salida>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [url = 'https://shirowellness.com/', out = '.'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--ignore-certificate-errors'] }) // el proxy del entorno usa su propia CA;
let fallas = 0;
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('requestfailed', r => errs.push('failed: ' + r.url()));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/web-${w}.png`, fullPage: true });
  fallas += errs.length;
  console.log(w, errs.length ? errs : 'sin errores');
}
await b.close();
process.exit(fallas ? 1 : 0);
