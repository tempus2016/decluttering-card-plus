#!/usr/bin/env node
/*
 * The browser suite (idea 6): builds test/dom/index.ts into one script, opens it in a real
 * Chromium and prints what the tests found.
 *
 *   npm run test:dom                 against a remote Chromium (DOM_CDP), serving the page from
 *                                    a Home Assistant's www/ (DOM_WWW, served at DOM_BASE_URL)
 *   npm run test:dom -- --local      a Chromium of its own (npx playwright install chromium) and a
 *                                    local server - what CI runs
 *
 * Why not @web/test-runner: its server has to be reachable from the browser, and the
 * remote browser cannot always reach the machine running the tests. So the page is static,
 * served from somewhere the browser can fetch, and the results come back through Playwright.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '.dom-build');
const CDP = process.env.DOM_CDP;
const WWW = process.env.DOM_WWW;
const BASE_URL = process.env.DOM_BASE_URL;
const DIR = 'dcp-dom';

async function build() {
  const { rollup } = require('rollup');
  const typescript = require('rollup-plugin-typescript2');
  const nodeResolve = require('@rollup/plugin-node-resolve').default;
  const commonjs = require('@rollup/plugin-commonjs');
  const json = require('@rollup/plugin-json');
  const bundle = await rollup({
    input: path.join(ROOT, 'test', 'dom', 'index.ts'),
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      typescript({
        include: ['**/*.ts'],
        tsconfigOverride: { include: ['src/**/*', 'test/dom/**/*'], compilerOptions: { sourceMap: false } },
        check: false,
      }),
      json(),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
  });
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  await bundle.write({ file: path.join(OUT, 'dom.js'), format: 'es', inlineDynamicImports: true, sourcemap: false });
  await bundle.close();
  fs.writeFileSync(
    path.join(OUT, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Decluttering Card Plus browser suite</title></head>' +
      '<body><script type="module" src="dom.js"></script></body></html>\n',
  );
  stageBundle();
}

/*
 * The built bundle, as a dashboard loads it (idea 4): the entry under a query string, the way
 * Home Assistant (`?v=`) and HACS (`?hacstag=`) load it, and then the editors chunk. The
 * page counts how many times the core module ran; the answer has to be one - a chunk that
 * imported the entry by its plain name would run it a second time, and every singleton
 * would exist twice. Skipped when dist/ has not been built.
 */
const DIST = process.env.DOM_DIST || path.join(ROOT, 'dist');
const BUNDLE_DIR = 'bundle';
function stageBundle() {
  const entry = path.join(DIST, 'decluttering-card-plus.js');
  if (!fs.existsSync(entry)) return false;
  const target = path.join(OUT, BUNDLE_DIR);
  fs.mkdirSync(target, { recursive: true });
  const files = fs.readdirSync(DIST).filter((name) => name.endsWith('.js'));
  for (const name of files) fs.copyFileSync(path.join(DIST, name), path.join(target, name));
  const editors = files.find((name) => /\.editors-[^.]+\.js$/.test(name));
  fs.writeFileSync(
    path.join(OUT, 'bundle.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Decluttering Card Plus bundle check</title></head><body><script type="module">
window.__dcpBundle = { running: true };
(async () => {
  const out = { loads: 0, afterEditors: 0, editorsDefined: false, error: '' };
  try {
    await import('./${BUNDLE_DIR}/decluttering-card-plus.js?v=' + Date.now());
    await new Promise((r) => setTimeout(r, 200));
    out.loads = window.__dcpModuleLoads ?? 0;
    ${editors ? `await import('./${BUNDLE_DIR}/${editors}');` : "out.error = 'no editors chunk in dist';"}
    await new Promise((r) => setTimeout(r, 200));
    out.afterEditors = window.__dcpModuleLoads ?? 0;
    out.editorsDefined = !!customElements.get('decluttering-card-plus-editor');
  } catch (err) {
    out.error = String(err && err.stack ? err.stack : err);
  }
  window.__dcpBundle = { ...out, running: false };
})();
</script></body></html>\n`,
  );
  return true;
}

/** Runs bundle.html in the same browser and turns what it found into results. */
async function checkBundle(browser, baseUrl) {
  if (!fs.existsSync(path.join(OUT, 'bundle.html'))) {
    return [{ name: 'bundle › built dist present (skipped: run npm run build first)', ok: true, ms: 0 }];
  }
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  const started = Date.now();
  await page.goto(`${baseUrl}/bundle.html?r=${Date.now()}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__dcpBundle && window.__dcpBundle.running === false, null, {
    timeout: 30000,
  });
  const found = await page.evaluate(() => window.__dcpBundle);
  await context.close();
  const ms = Date.now() - started;
  const detail = JSON.stringify({ ...found, pageErrors: errors });
  return [
    {
      name: 'bundle › the core module runs once when the entry is loaded with a query string',
      ok: !found.error && found.loads === 1,
      error: found.loads === 1 && !found.error ? undefined : detail,
      ms,
    },
    {
      name: 'bundle › opening the editors chunk does not run the core module again',
      ok: !found.error && found.afterEditors === 1 && found.editorsDefined,
      error: found.afterEditors === 1 && found.editorsDefined && !found.error ? undefined : detail,
      ms: 0,
    },
  ];
}

function serveLocal() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
      const file = path.join(OUT, name);
      if (!file.startsWith(OUT) || !fs.existsSync(file)) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { 'content-type': name.endsWith('.js') ? 'text/javascript' : 'text/html' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () =>
      resolve({ server, url: `http://127.0.0.1:${server.address().port}/index.html` }),
    );
  });
}

async function main() {
  const local = process.argv.includes('--local');
  const started = Date.now();
  await build();

  let browser;
  let url;
  let server;
  if (local) {
    ({ server, url } = await serveLocal());
    browser = await chromium.launch();
  } else {
    if (!CDP || !WWW || !BASE_URL) {
      console.error('A remote run needs DOM_CDP, DOM_WWW and DOM_BASE_URL set; or use --local.');
      process.exit(2);
    }
    const target = path.join(WWW, DIR);
    fs.mkdirSync(target, { recursive: true });
    for (const name of ['index.html', 'dom.js', 'bundle.html']) {
      if (fs.existsSync(path.join(OUT, name))) fs.copyFileSync(path.join(OUT, name), path.join(target, name));
    }
    if (fs.existsSync(path.join(OUT, BUNDLE_DIR))) {
      fs.rmSync(path.join(target, BUNDLE_DIR), { recursive: true, force: true });
      fs.mkdirSync(path.join(target, BUNDLE_DIR));
      for (const name of fs.readdirSync(path.join(OUT, BUNDLE_DIR))) {
        fs.copyFileSync(path.join(OUT, BUNDLE_DIR, name), path.join(target, BUNDLE_DIR, name));
      }
    }
    browser = await chromium.connectOverCDP(CDP);
    url = `${BASE_URL}/${DIR}/index.html?r=${Date.now()}`;
  }

  const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await context.newPage();
  const console_ = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning')
      console_.push(`${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', (err) => console_.push(`pageerror: ${err.message}`));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__dcpRunning === false, null, { timeout: 60000 });
  const results = await page.evaluate(() => window.__dcpResults);
  await context.close();
  results.push(...(await checkBundle(browser, url.replace(/\/[^/]*$/, ''))));
  await browser.close();
  if (server) server.close();

  console.log(`TAP version 13\n1..${results.length}`);
  let failed = 0;
  results.forEach((result, index) => {
    if (result.ok) console.log(`ok ${index + 1} - ${result.name} (${result.ms.toFixed(0)} ms)`);
    else {
      failed += 1;
      console.log(
        `not ok ${index + 1} - ${result.name}\n  ---\n  error: |\n${String(result.error)
          .split('\n')
          .map((line) => `    ${line}`)
          .join('\n')}\n  ...`,
      );
    }
  });
  const unexpected = console_.filter((line) => !/favicon|DevTools/.test(line));
  if (unexpected.length)
    console.log(`# console: ${unexpected.length} line(s)\n${unexpected.map((line) => `#   ${line}`).join('\n')}`);
  console.log(
    `# ${results.length - failed} passed, ${failed} failed in ${((Date.now() - started) / 1000).toFixed(1)} s`,
  );
  process.exitCode = failed ? 1 : 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
