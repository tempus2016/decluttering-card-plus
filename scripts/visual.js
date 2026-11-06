#!/usr/bin/env node
/*
 * Visual regression (idea 62): every view of examples/demo-dashboard.yaml rendered at a
 * desktop and a phone width, compared pixel by pixel with the images kept in
 * test/visual/baseline/. A view that drifts past the threshold fails, and its before, after
 * and diff images land in test/visual/out/ for a person to look at.
 *
 *   node scripts/visual.js                       against the dev Home Assistant and browserless (VISUAL_HA, VISUAL_TOKEN, VISUAL_CDP)
 *   node scripts/visual.js --local               a Home Assistant at VISUAL_HA with a Chromium of its own - what the workflow runs
 *   node scripts/visual.js --update              write what is rendered now as the new baseline
 *   node scripts/visual.js --dashboard dcp62-e-demo   which dashboard holds the demo (default dcp-visual)
 *
 * The dashboard is created and its config written by this script through the WebSocket
 * API, so the page under test is exactly the demo file. It refuses to overwrite a
 * dashboard it did not create with that name.
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
// pixelmatch 6 is an ES module; Node 22 can require it, with the function under `default`.
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;
const { chromium } = require('playwright');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
// CI's Home Assistant is a fresh one with other entities than the dev instance, so it keeps
// baselines of its own: VISUAL_BASELINE=test/visual/baseline-ci.
const BASELINE = path.resolve(ROOT, process.env.VISUAL_BASELINE || path.join('test', 'visual', 'baseline'));
const OUT = path.join(ROOT, 'test', 'visual', 'out');
const DEMO = path.join(ROOT, 'examples', 'demo-dashboard.yaml');
const WIDTHS = [1280, 388];
// Fonts and antialiasing differ a little between machines; a real layout change is far past this.
const THRESHOLD = 0.001; // repeat runs measure 0.00%; a few changed labels measure about 0.3%

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const at = args.indexOf(name);
  return at !== -1 && args[at + 1] ? args[at + 1] : fallback;
};

const HA = (process.env.VISUAL_HA || 'http://192.168.0.154:8124').replace(/\/$/, '');
const CDP = process.env.VISUAL_CDP || 'http://192.168.0.154:3002';
const DASHBOARD = option('--dashboard', process.env.VISUAL_DASHBOARD || 'dcp-visual');
const TOKEN =
  process.env.VISUAL_TOKEN ||
  (fs.existsSync(path.join(process.env.HOME || '', 'workspace/ha-dev/.ha_token'))
    ? fs.readFileSync(path.join(process.env.HOME, 'workspace/ha-dev/.ha_token'), 'utf8').trim()
    : undefined);

/* ---------------------------------------------------------------- Home Assistant */

async function connect() {
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
        else rej(new Error(JSON.stringify(msg.error)));
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
 * The demo dashboard, written fresh. Only a dashboard this script made is overwritten: its
 * title says so, and a dashboard of that name with another title is left alone and the run
 * stops, because lovelace/config/save replaces everything.
 */
/*
 * The demo reads sun.sun, whose state follows the clock: a baseline taken at night failed in the
 * day. The check swaps it for an entity of its own, made through the REST API and pinned below
 * the horizon, which nothing in Home Assistant ever rewrites.
 */
const FIXED_SUN = 'sun.visual_check';
async function pinSun() {
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

async function writeDemo(call) {
  const title = 'Decluttering visual check';
  const list = await call({ type: 'lovelace/dashboards/list' });
  const found = list.find((d) => d.url_path === DASHBOARD);
  if (found && found.title !== title) {
    throw new Error(
      `dashboard ${DASHBOARD} exists with the title "${found.title}"; refusing to overwrite it. Pass --dashboard <another name>.`,
    );
  }
  if (!found) {
    await call({
      type: 'lovelace/dashboards/create',
      url_path: DASHBOARD,
      title,
      mode: 'storage',
      show_in_sidebar: false,
      require_admin: false,
      icon: 'mdi:image-check',
    });
  }
  await pinSun();
  // The page follows the user's saved language, not the browser's storage, so a run after a
  // language test would capture German. English is set on the user itself, in full.
  await call({
    type: 'frontend/set_user_data',
    key: 'language',
    value: {
      language: 'en',
      number_format: 'language',
      time_format: 'language',
      date_format: 'language',
      time_zone: 'local',
      first_weekday: 'language',
    },
  });
  const config = withFixedSun(yaml.load(fs.readFileSync(DEMO, 'utf8')));
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

async function openBrowser(local) {
  return local ? chromium.launch() : chromium.connectOverCDP(CDP);
}

async function newPage(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  // Over browserless the page lays out at the window size unless both are set.
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
  await page.addInitScript(
    (args) => {
      localStorage.setItem(
        'hassTokens',
        JSON.stringify({
          access_token: args.token,
          token_type: 'Bearer',
          expires_in: 315360000,
          hassUrl: args.origin,
          clientId: args.origin + '/',
          expires: Date.now() + 315360000000,
          refresh_token: '',
        }),
      );
      localStorage.setItem('selectedLanguage', JSON.stringify('en'));
    },
    { token: TOKEN, origin: HA },
  );
  return { context, page };
}

async function shoot(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
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
  fs.mkdirSync(OUT, { recursive: true });
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
  if (ratio > THRESHOLD || expected.width !== actual.width || expected.height !== actual.height) {
    fs.writeFileSync(path.join(OUT, `${name}.before.png`), PNG.sync.write(expected));
    fs.writeFileSync(path.join(OUT, `${name}.after.png`), PNG.sync.write(actual));
    fs.writeFileSync(path.join(OUT, `${name}.diff.png`), PNG.sync.write(diff));
    return {
      name,
      status: 'differs',
      ratio,
      size: expected.width !== actual.width || expected.height !== actual.height,
    };
  }
  return { name, status: 'match', ratio };
}

async function main() {
  if (!TOKEN) throw new Error('no token: set VISUAL_TOKEN');
  const local = flag('--local');
  const update = flag('--update');
  // A first run somewhere new (CI) writes what is missing instead of failing on it.
  const writeMissing = flag('--write-missing');
  const started = Date.now();

  const ha = await connect();
  let views;
  try {
    views = await writeDemo(ha.call);
  } finally {
    ha.close();
  }
  console.log(`demo dashboard ${DASHBOARD}: ${views.length} views`);

  const browser = await openBrowser(local);
  const results = [];
  try {
    for (const width of WIDTHS) {
      const { context, page } = await newPage(browser, width);
      for (const view of views) {
        const name = `${view.name}-${width}`;
        const png = await shoot(page, `${HA}/${DASHBOARD}/${view.index}`);
        if (update) {
          fs.mkdirSync(BASELINE, { recursive: true });
          fs.writeFileSync(path.join(BASELINE, `${name}.png`), PNG.sync.write(png));
          results.push({ name, status: 'written' });
        } else {
          const result = compare(name, png);
          if (result.status === 'new' && writeMissing) {
            fs.mkdirSync(BASELINE, { recursive: true });
            fs.writeFileSync(path.join(BASELINE, `${name}.png`), PNG.sync.write(png));
            result.status = 'written';
          }
          results.push(result);
        }
        console.log(
          `  ${name.padEnd(28)} ${results[results.length - 1].status}${results[results.length - 1].ratio !== undefined ? ` ${(results[results.length - 1].ratio * 100).toFixed(2)}%` : ''}`,
        );
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const differing = results.filter((r) => r.status === 'differs');
  const fresh = results.filter((r) => r.status === 'new');
  console.log(
    `${differing.length} of ${results.length} screens differ · threshold ${(THRESHOLD * 100).toFixed(1)}% · ${((Date.now() - started) / 1000).toFixed(1)} s`,
  );
  if (fresh.length) console.log(`${fresh.length} screen(s) have no baseline yet: run with --update to write them`);
  if (differing.length) {
    console.log(
      `before, after and diff images are in ${path.relative(ROOT, OUT)}/; to accept a change on purpose, run with --update and commit test/visual/baseline/`,
    );
    process.exitCode = 1;
  } else if (fresh.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 2;
});
