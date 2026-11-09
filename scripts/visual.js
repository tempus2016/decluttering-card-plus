#!/usr/bin/env node
/*
 * Visual regression (idea 62): every view of examples/demo-dashboard.yaml rendered at a
 * desktop and a phone width, compared pixel by pixel with the images kept in a baseline
 * folder. A view that drifts past the threshold fails, and its before, after and diff images
 * land in test/visual/out/ for a person to look at. See test/visual/README.md.
 *
 *   npm run test:visual                     the dev Home Assistant through browserless (VISUAL_HA, VISUAL_TOKEN, VISUAL_CDP)
 *   npm run test:visual -- --local          a Home Assistant at VISUAL_HA with a Chromium of its own - what CI runs
 *   npm run test:visual -- --update         write what is rendered now as the new baseline
 *   npm run test:visual -- --baseline <dir> compare with (or --update) another baseline folder (also VISUAL_BASELINE)
 *   npm run test:visual -- --accept <dir>   copy the captures from a downloaded run (a folder holding actual/*.png,
 *                                           such as CI's "screens" artifact) into the baseline folder; nothing is rendered
 *
 * The card under test is always the local build: every request the page makes for
 * /local/decluttering-card-plus*.js is answered from dist/ (VISUAL_DIST), whatever the Home
 * Assistant itself has installed. The run fails if the page never asked for it.
 *
 * The dashboard is always dcp-all-visual, created by this script through the WebSocket API.
 * An existing one is read first and only overwritten when it carries this script's marker.
 * The Home Assistant user's saved language is never changed: the page is told it is English
 * by rewriting the frontend's own reads of it on the WebSocket, inside the browser.
 *
 * Exit codes: 0 every screen matches, 1 a screen differs, 2 the run broke, 3 nothing differs
 * but one or more screens have no baseline yet (the captures are in test/visual/out/actual/).
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
// pixelmatch 6 is an ES module; Node 22 can require it, with the function under `default`.
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  if (at === -1) return fallback;
  if (!args[at + 1] || args[at + 1].startsWith('--')) throw new Error(`${name} needs a value`);
  return args[at + 1];
};

// CI's Home Assistant is a fresh one with other entities than the dev instance, so it keeps
// baselines of its own: --baseline test/visual/baseline-ci.
const BASELINE = path.resolve(
  ROOT,
  option('--baseline', process.env.VISUAL_BASELINE || path.join('test', 'visual', 'baseline')),
);
const OUT = path.join(ROOT, 'test', 'visual', 'out');
const DEMO = path.join(ROOT, 'examples', 'demo-dashboard.yaml');
const DIST = path.resolve(ROOT, process.env.VISUAL_DIST || 'dist');
const WIDTHS = [1280, 388];
// Fonts and antialiasing differ a little between machines; a real layout change is far past this.
const THRESHOLD = 0.001; // repeat runs measure 0.00%; a few changed labels measure about 0.3%
const SCREEN_NAME = /^[a-z0-9-]+\.png$/;

const HA = (process.env.VISUAL_HA || 'http://localhost:8123').replace(/\/$/, '');
const CDP = process.env.VISUAL_CDP;

/*
 * The only dashboard this script writes. The dcp-all- prefix is the one the ha-dev test rigs
 * share, so it can never land on a dashboard someone uses.
 */
const DASHBOARD = 'dcp-all-visual';
const MARKER = 'Decluttering visual check';

function token() {
  if (process.env.VISUAL_TOKEN) return process.env.VISUAL_TOKEN;
  const file = process.env.VISUAL_TOKEN_FILE;
  return file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : undefined;
}

/* ---------------------------------------------------------------- Home Assistant */

async function connect(TOKEN) {
  const sock = new WebSocket(HA.replace(/^http/, 'ws') + '/api/websocket');
  let id = 1;
  const pending = new Map();
  await new Promise((resolve, reject) => {
    sock.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'auth_required') sock.send(JSON.stringify({ type: 'auth', access_token: TOKEN }));
      else if (msg.type === 'auth_ok') resolve();
      else if (msg.type === 'auth_invalid') reject(new Error('Home Assistant rejected the token'));
      else if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.success) res(msg.result);
        else rej(Object.assign(new Error(JSON.stringify(msg.error)), { code: msg.error && msg.error.code }));
      }
    });
    sock.addEventListener('error', () => reject(new Error('cannot reach ' + HA)));
  });
  const call = (payload) =>
    new Promise((res, rej) => {
      const i = id++;
      pending.set(i, { res, rej });
      sock.send(JSON.stringify({ id: i, ...payload }));
    });
  return { call, close: () => sock.close() };
}

/*
 * The demo reads sun.sun, whose state follows the clock: a baseline taken at night failed in the
 * day. The check swaps it for an entity of its own, made through the REST API and pinned below
 * the horizon, which nothing in Home Assistant ever rewrites.
 */
const FIXED_SUN = 'sun.visual_check';
async function pinSun(TOKEN) {
  const res = await fetch(`${HA}/api/states/${FIXED_SUN}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      state: 'below_horizon',
      attributes: { friendly_name: 'Sun', elevation: -20, rising: true, icon: 'mdi:weather-night' },
    }),
  });
  if (!res.ok) throw new Error(`could not pin ${FIXED_SUN}: HTTP ${res.status}`);
}
function withFixedSun(node) {
  if (typeof node === 'string') return node.split('sun.sun').join(FIXED_SUN);
  if (Array.isArray(node)) return node.map(withFixedSun);
  if (node && typeof node === 'object')
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, withFixedSun(v)]));
  return node;
}

/*
 * The demo dashboard, written fresh into dcp-all-visual. lovelace/config/save replaces
 * everything, so an existing dashboard is read first: it is overwritten only when both its
 * title and its saved config carry the marker this script writes, or it has no config yet.
 */
async function writeDemo(call, TOKEN) {
  const list = await call({ type: 'lovelace/dashboards/list' });
  const found = list.find((d) => d.url_path === DASHBOARD);
  if (found) {
    if (found.title !== MARKER) {
      throw new Error(`dashboard ${DASHBOARD} exists with the title "${found.title}"; refusing to overwrite it.`);
    }
    let saved = null;
    try {
      saved = await call({ type: 'lovelace/config', url_path: DASHBOARD, force: true });
    } catch (err) {
      if (err.code !== 'config_not_found') throw err;
    }
    if (saved && saved.title !== MARKER) {
      throw new Error(`dashboard ${DASHBOARD} holds a config this script did not write; refusing to overwrite it.`);
    }
  } else {
    await call({
      type: 'lovelace/dashboards/create',
      url_path: DASHBOARD,
      title: MARKER,
      mode: 'storage',
      show_in_sidebar: false,
      require_admin: false,
      icon: 'mdi:image-check',
    });
  }
  await pinSun(TOKEN);
  const config = { title: MARKER, ...withFixedSun(yaml.load(fs.readFileSync(DEMO, 'utf8'))) };
  await call({ type: 'lovelace/config/save', url_path: DASHBOARD, config });
  return config.views.map((view, index) => ({
    index,
    name: String(view.path || view.title || `view-${index}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  }));
}

/* ---------------------------------------------------------------- browser */

const ENGLISH = {
  language: 'en',
  number_format: 'language',
  time_format: 'language',
  date_format: 'language',
  time_zone: 'local',
  first_weekday: 'language',
};

/*
 * The page follows the user's saved language, not the browser's storage, so a run after a
 * language test would capture German. Rather than change the user, the page's own WebSocket is
 * wrapped before the frontend loads: its reads of that setting come back as the value below,
 * and a write of it is answered inside the page and never reaches Home Assistant.
 * (Playwright's routeWebSocket would do the same from outside, but its handler never runs over
 * browserless CDP and the page hangs, so this lives in an init script.)
 */
function pinLanguageInPage(value) {
  const Native = window.WebSocket;
  const isLanguage = (m) => m && m.key === 'language' && typeof m.type === 'string' && m.type.startsWith('frontend/');
  class Pinned extends Native {
    constructor(...a) {
      super(...a);
      this.__pinned = /\/api\/websocket$/.test(String(a[0])) ? new Set() : null;
      this.__wrapped = new Map();
    }
    send(data) {
      if (!this.__pinned) return super.send(data);
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        return super.send(data);
      }
      const batch = Array.isArray(msg) ? msg : [msg];
      const forward = [];
      for (const m of batch) {
        if (isLanguage(m) && m.type === 'frontend/set_user_data') {
          const reply = JSON.stringify({ id: m.id, type: 'result', success: true, result: null });
          setTimeout(() => this.dispatchEvent(new MessageEvent('message', { data: reply })), 0);
          continue;
        }
        if (isLanguage(m)) this.__pinned.add(m.id);
        forward.push(m);
      }
      if (forward.length) super.send(JSON.stringify(Array.isArray(msg) ? forward : forward[0]));
    }
    __rewrite(event) {
      if (!this.__pinned || !this.__pinned.size || typeof event.data !== 'string') return event;
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return event;
      }
      let changed = false;
      for (const m of Array.isArray(msg) ? msg : [msg]) {
        if (!m || !this.__pinned.has(m.id)) continue;
        if (m.type === 'result' && m.result && typeof m.result === 'object') m.result.value = value;
        else if (m.type === 'event' && m.event && typeof m.event === 'object') m.event.value = value;
        else continue;
        changed = true;
      }
      return changed ? new MessageEvent('message', { data: JSON.stringify(msg) }) : event;
    }
    addEventListener(type, listener, options) {
      if (type !== 'message' || typeof listener !== 'function') return super.addEventListener(type, listener, options);
      const wrapped = (event) => listener.call(this, this.__rewrite(event));
      this.__wrapped.set(listener, wrapped);
      return super.addEventListener(type, wrapped, options);
    }
    removeEventListener(type, listener, options) {
      const wrapped = type === 'message' && this.__wrapped.get(listener);
      return super.removeEventListener(type, wrapped || listener, options);
    }
    set onmessage(listener) {
      super.onmessage =
        typeof listener === 'function' ? (event) => listener.call(this, this.__rewrite(event)) : listener;
    }
    get onmessage() {
      return super.onmessage;
    }
  }
  window.WebSocket = Pinned;
}

/*
 * The local build in place of whatever the Home Assistant serves: the entry, under any query
 * string, and every chunk it loads. Counted, so a page that never loaded it fails the run.
 */
const BUNDLE = /\/local\/decluttering-card-plus[^/]*\.js(\.map)?(\?.*)?$/;
async function routeBundle(context, served) {
  await context.route(BUNDLE, async (route) => {
    const name = path.basename(new URL(route.request().url()).pathname);
    const file = path.join(DIST, name);
    if (!/^decluttering-card-plus[^/]*\.js(\.map)?$/.test(name) || !fs.existsSync(file)) {
      return route.fulfill({ status: 404, body: `not in ${DIST}: ${name}` });
    }
    served.push(name);
    return route.fulfill({
      status: 200,
      contentType: name.endsWith('.map') ? 'application/json' : 'application/javascript',
      body: fs.readFileSync(file),
    });
  });
}

async function newPage(browser, width, TOKEN, served, versions) {
  // A service worker would answer the bundle request before the route sees it.
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    serviceWorkers: 'block',
  });
  await routeBundle(context, served);
  const page = await context.newPage();
  // The card's start-up banner names its version: printed, so the log shows which build ran.
  page.on('console', (message) => {
    const found = /DECLUTTERING-CARD-PLUS[\s\S]*?Version\s+(\S+)/.exec(message.text());
    if (found) versions.add(found[1]);
  });
  const cdp = await context.newCDPSession(page);
  // Over browserless the page lays out at the window size unless both are set.
  const metrics = (w) =>
    cdp.send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
  await metrics(width);
  await page.addInitScript(
    (a) => {
      localStorage.setItem(
        'hassTokens',
        JSON.stringify({
          access_token: a.token,
          token_type: 'Bearer',
          expires_in: 315360000,
          hassUrl: a.origin,
          clientId: a.origin + '/',
          expires: Date.now() + 315360000000,
          refresh_token: '',
        }),
      );
      localStorage.setItem('selectedLanguage', JSON.stringify(a.language.language));
    },
    { token: TOKEN, origin: HA, language: ENGLISH },
  );
  await page.addInitScript(pinLanguageInPage, ENGLISH);
  return { context, page, metrics };
}

async function shoot(page, metrics, width, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  // A masonry view counts its columns from media queries, and over browserless those can be
  // read before the metrics above apply: the same page came out in two columns on one run and
  // three on the next. Nudging the width and back makes every query fire with the final size.
  await metrics(width - 1);
  await page.waitForTimeout(300);
  await metrics(width);
  // Cards build after hass lands, and a lazy repeat builds its copies as they scroll near:
  // the page is walked to the bottom and back so every copy has been near the screen.
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const step = Math.max(300, window.innerHeight - 100);
    for (let y = 0; y < document.documentElement.scrollHeight + step; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  // Playwright's css engine looks through open shadow roots, so the view is found wherever Home Assistant nests it.
  const view = await page.$('hui-sections-view, hui-masonry-view, hui-view');
  const take = async () => (view ? await view.screenshot() : await page.screenshot({ fullPage: true }));
  // Two captures a second apart that agree: whatever was still building has finished.
  let last = await take();
  for (let attempt = 0; attempt < 6; attempt++) {
    await page.waitForTimeout(1000);
    const next = await take();
    if (next.equals(last)) return PNG.sync.read(next);
    last = next;
  }
  return PNG.sync.read(last);
}

/* ---------------------------------------------------------------- compare */

function compare(name, actual) {
  const file = path.join(BASELINE, `${name}.png`);
  if (!fs.existsSync(file)) return { name, status: 'new' };
  const expected = PNG.sync.read(fs.readFileSync(file));
  const width = Math.max(expected.width, actual.width);
  const height = Math.max(expected.height, actual.height);
  const pad = (png) => {
    if (png.width === width && png.height === height) return png;
    const out = new PNG({ width, height, fill: true });
    PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);
    return out;
  };
  const a = pad(expected);
  const b = pad(actual);
  const diff = new PNG({ width, height });
  const differing = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  const ratio = differing / (width * height);
  const size = expected.width !== actual.width || expected.height !== actual.height;
  if (ratio > THRESHOLD || size) {
    fs.writeFileSync(path.join(OUT, `${name}.before.png`), PNG.sync.write(expected));
    fs.writeFileSync(path.join(OUT, `${name}.after.png`), PNG.sync.write(actual));
    fs.writeFileSync(path.join(OUT, `${name}.diff.png`), PNG.sync.write(diff));
    return { name, status: 'differs', ratio, size };
  }
  return { name, status: 'match', ratio };
}

/*
 * --accept <dir>: the captures of a run somewhere else (CI's "screens" artifact, unzipped)
 * become the baseline. Only well-formed PNGs with a screen's plain name are copied.
 */
function accept(dir) {
  const from = fs.existsSync(path.join(dir, 'actual')) ? path.join(dir, 'actual') : dir;
  const names = fs.readdirSync(from).filter((name) => SCREEN_NAME.test(name));
  if (!names.length) throw new Error(`no screens in ${from}: expected <view>-<width>.png files`);
  fs.mkdirSync(BASELINE, { recursive: true });
  for (const name of names) {
    const data = fs.readFileSync(path.join(from, name));
    PNG.sync.read(data);
    fs.writeFileSync(path.join(BASELINE, name), data);
    console.log(`  ${name.padEnd(28)} accepted`);
  }
  console.log(`${names.length} screen(s) written to ${path.relative(ROOT, BASELINE)}/ - commit that folder`);
}

async function main() {
  if (flag('--dashboard')) throw new Error(`the dashboard is always ${DASHBOARD}; --dashboard is not supported`);
  if (flag('--accept')) return accept(path.resolve(option('--accept')));

  const TOKEN = token();
  if (!TOKEN) throw new Error('no token: set VISUAL_TOKEN');
  if (!fs.existsSync(path.join(DIST, 'decluttering-card-plus.js'))) {
    throw new Error(`no build in ${DIST}: run npm run rollup (or npm run build) first`);
  }
  const local = flag('--local');
  const update = flag('--update');
  const started = Date.now();

  const ha = await connect(TOKEN);
  let views;
  try {
    views = await writeDemo(ha.call, TOKEN);
  } finally {
    ha.close();
  }
  console.log(`demo dashboard ${DASHBOARD}: ${views.length} views · card from ${path.relative(ROOT, DIST) || '.'}/`);

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'actual'), { recursive: true });

  const { chromium } = require('playwright');
  if (!local && !CDP) throw new Error('no browser: set VISUAL_CDP, or pass --local');
  const browser = local ? await chromium.launch() : await chromium.connectOverCDP(CDP);
  const results = [];
  const versions = new Set();
  try {
    for (const width of WIDTHS) {
      const served = [];
      const { context, page, metrics } = await newPage(browser, width, TOKEN, served, versions);
      for (const view of views) {
        const name = `${view.name}-${width}`;
        const png = await shoot(page, metrics, width, `${HA}/${DASHBOARD}/${view.index}`);
        if (!served.includes('decluttering-card-plus.js')) {
          throw new Error(
            'the page never asked for /local/decluttering-card-plus.js, so the local build was not tested: ' +
              'register it as a dashboard resource',
          );
        }
        fs.writeFileSync(path.join(OUT, 'actual', `${name}.png`), PNG.sync.write(png));
        let result;
        if (update) {
          fs.mkdirSync(BASELINE, { recursive: true });
          fs.writeFileSync(path.join(BASELINE, `${name}.png`), PNG.sync.write(png));
          result = { name, status: 'written' };
        } else result = compare(name, png);
        results.push(result);
        const pct = result.ratio !== undefined ? ` ${(result.ratio * 100).toFixed(2)}%` : '';
        console.log(`  ${name.padEnd(28)} ${result.status}${pct}${result.size ? ' (size changed)' : ''}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`card version on the page: ${[...versions].join(', ') || 'not reported'}`);
  const differing = results.filter((r) => r.status === 'differs');
  const fresh = results.filter((r) => r.status === 'new');
  console.log(
    `${differing.length} of ${results.length} screens differ · threshold ${(THRESHOLD * 100).toFixed(1)}% · ` +
      `baseline ${path.relative(ROOT, BASELINE)}/ · ${((Date.now() - started) / 1000).toFixed(1)} s`,
  );
  if (differing.length) {
    console.log(
      `before, after and diff images are in ${path.relative(ROOT, OUT)}/; to accept a change on purpose, ` +
        `run with --update (or --accept) and commit ${path.relative(ROOT, BASELINE)}/`,
    );
    process.exitCode = 1;
  } else if (fresh.length) {
    console.log(
      `${fresh.length} screen(s) have no baseline in ${path.relative(ROOT, BASELINE)}/; the captures are in ` +
        `${path.relative(ROOT, OUT)}/actual/ - run with --update, or --accept a downloaded run, and commit them`,
    );
    process.exitCode = 3;
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 2;
});
