/*
 * Unit tests for `debug: report` (#207): what is taken out before the report can be posted,
 * how the builds are written out as Markdown, and how the outermost card is told the
 * report is complete.
 * Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { newTrace, startExpansion, reportExpansion } = require('../.test-build/trace.js');
const { redact, formatReport } = require('../.test-build/report.js');

const { check } = require('./check');

const logged = [];
console.warn = () => {};
console.log = (...args) => logged.push(args);
console.groupCollapsed = () => {};
console.groupEnd = () => {};

/* ------------------------------------------------------------------ redact */

check('an IPv4 address goes', redact('stream: 192.168.1.20 and 10.0.0.1'), 'stream: <redacted-ip> and <redacted-ip>');
check('a version number with four parts after a slash stays', redact('Chrome/130.0.0.0'), 'Chrome/130.0.0.0');
check('a three-part version stays', redact('version: 2026.10.1'), 'version: 2026.10.1');
check(
  'the host in a URL goes, the path and port stay',
  redact('url: http://192.168.1.20:8123/api/camera_proxy/camera.front'),
  'url: http://<redacted-ip>:8123/api/camera_proxy/camera.front',
);
check(
  'a hostname in a URL goes',
  redact('rtsp://myhouse.tplinkdns.com:554/ch1/main'),
  'rtsp://<redacted-host>:554/ch1/main',
);
check(
  'credentials in a URL go, and are not read as an email',
  redact('rtsp://admin:hunter2@cam.local/ch1/main'),
  'rtsp://<redacted-credentials>@<redacted-host>/ch1/main',
);
check(
  'a token in a query string goes',
  redact('/api/camera_proxy/camera.x?token=abc123def&width=300'),
  '/api/camera_proxy/camera.x?token=<redacted>&width=300',
);
check('an email address goes', redact('notify: someone@example.co.uk'), 'notify: <redacted-email>');
check(
  'a password as a YAML key goes',
  redact('  - password: hunter2\n    user: bob'),
  '  - password: <redacted>\n    user: bob',
);
check(
  'a password as a JSON key goes',
  redact('{"password":"hunter2","user":"bob"}'),
  '{"password":"<redacted>","user":"bob"}',
);
check('`key:` on its own is left alone', redact('key: sort_by'), 'key: sort_by');
check(
  'a bearer token goes, as does the whole of an authorization line',
  [redact('Authorization: Bearer abc.def-ghi'), redact('h: Bearer abc.def-ghi')],
  ['Authorization: <redacted>', 'h: Bearer <redacted>'],
);
check('a JWT goes', redact('t: eyJhbGciOi.eyJzdWIiOi.SflKxwRJ'), 't: <redacted-token>');
check('an IPv6 address goes', redact('host fe80::1ff:fe23:4567:890a here'), 'host <redacted-ip> here');
check('a time of day stays', redact('at: 12:30:45'), 'at: 12:30:45');
check('a CSS pseudo-element stays', redact('ha-card::before { fade::after }'), 'ha-card::before { fade::after }');
check('an entity id stays', redact('entity: light.living_room'), 'entity: light.living_room');

/* ------------------------------------------------------------------ warnings */

{
  const trace = newTrace();
  deepReplace([], {}, { name: '[[missing]]' }, 'room', undefined, false, undefined, 0, trace);
  check('a warning the console gets is on the trace too', trace.warnings.length, 1);
  const quiet = newTrace();
  deepReplace([], {}, { name: '[[missing]]' }, 'room', undefined, true, undefined, 0, quiet);
  check('a quiet build notes no warnings', quiet.warnings.length, 0);
}

/* ------------------------------------------------------------------ formatReport */

function section(variables, built, placeholders = []) {
  const trace = newTrace();
  for (const [placeholder, became] of placeholders) trace.placeholders.set(placeholder, became);
  return { variables, trace, built };
}

const room = {
  label: '"room"',
  chain: [],
  ms: 1.25,
  template: { name: 'room', config: { card: { type: 'tile', entity: '[[entity]]' } } },
  sections: [
    section(
      [
        { variable: 'entity', value: 'light.kitchen', from: 'card' },
        { variable: 'password', value: 'hunter2', from: 'card' },
        { variable: 'title', value: 'a | b', from: 'default' },
      ],
      { type: 'tile', entity: 'light.kitchen', image: 'http://192.168.0.2/x.png' },
      [['[[entity]]', 'light.kitchen']],
    ),
  ],
};
const text = formatReport({
  context: { version: '1.16.0', haVersion: '2026.10.1', browser: 'Chrome/130.0.0.0', language: 'en' },
  reports: [room],
  full: { type: 'tile', entity: 'light.kitchen' },
  neverBuilt: ['cards[2]'],
});

check('the report starts with its title', text.split('\n')[0], '# Decluttering Card Plus debug report');
check('it says to read it first', /^> Read it before you post it/m.test(text), true);
check('the versions are in a table', text.includes('| Decluttering Card Plus | 1.16.0 |'), true);
check('Home Assistant too', text.includes('| Home Assistant | 2026.10.1 |'), true);
check('a fact not known is left out', text.includes('| Dashboard |'), false);
check('the browser is not mistaken for an address', text.includes('Chrome/130.0.0.0'), true);
check(
  'the build is folded under the console headline',
  text.includes('<details>\n<summary><b>decluttering-card-plus: "room" built in 1.3 ms</b></summary>\n\n'),
  true,
);
check('the template is written out', text.includes('### Template "room"\n\n```yaml\ncard:'), true);
check('variables are a table', text.includes('| variable | value | from |'), true);
check('a variable row says where it came from', text.includes('| entity | light.kitchen | this card |'), true);
check(
  'a variable called password has its value taken out',
  text.includes('| password | `<redacted>` | this card |'),
  true,
);
check('hunter2 is nowhere', text.includes('hunter2'), false);
check('a pipe in a value cannot start a cell', text.includes('| title | a \\| b | default: |'), true);
check('placeholders are a table', text.includes('| \\[\\[entity\\]\\] | light.kitchen |'), true);
check('an address in what was built goes', text.includes('http://<redacted-ip>/x.png'), true);
check(
  'the whole card is there, open',
  text.includes('<details open>\n<summary><b>decluttering-card-plus: "room" in full'),
  true,
);
check('and comes before the builds', text.indexOf('"room" in full') < text.indexOf('"room" built in'), true);
check(
  'so does the list of cards that never built',
  text.indexOf('- cards\\[2\\]') < text.indexOf('"room" built in'),
  true,
);
check('so are the cards that never built', text.includes('- cards\\[2\\]'), true);
check('no section without warnings has a warnings heading', text.includes('Warnings:'), false);

{
  const fenced = formatReport({
    context: { version: '1' },
    reports: [{ ...room, template: undefined, sections: [section([], { content: '```yaml\nx\n```' })] }],
  });
  check('a fence in the config is outlasted by a longer one', fenced.includes('````yaml'), true);
}

{
  const failed = formatReport({ context: { version: '1' }, reports: [], error: 'Refused: [[x]] is not set' });
  check('an error is reported', failed.includes('## Error\n\n```\nRefused: [[x]] is not set\n```'), true);
}

{
  const plain = formatReport({ context: { version: '1' }, reports: [room], built: { type: 'tile' } });
  check(
    'a card with nothing inside shows what it built first',
    plain.includes(
      '<details open>\n<summary><b>decluttering-card-plus: "room" as built</b></summary>\n\n```yaml\ntype: tile\n```\n\n</details>',
    ),
    true,
  );
  check('and says nothing about cards inside it', plain.includes('in full'), false);
}

{
  const hostileTitle = formatReport({
    context: { version: '1' },
    reports: [{ ...room, label: '<b>x</b> & </summary>', sections: [] }],
  });
  check(
    'a label is escaped as HTML in its summary',
    hostileTitle.includes('<summary><b>decluttering-card-plus: &lt;b&gt;x&lt;/b&gt; &amp; &lt;/summary&gt;'),
    true,
  );
}

/* ------------------------------------------------------------------ redact: false */

{
  const open = formatReport({
    context: { version: '1' },
    reports: [room],
    full: { type: 'tile', image: 'http://192.168.0.2/x.png' },
    unredacted: true,
  });
  check('an unredacted report says so first', /^> Nothing has been taken out of this report/m.test(open), true);
  check('and does not claim it was checked', /^> Read it before you post it/m.test(open), false);
  check('a password variable is shown as it is', open.includes('| password | hunter2 | this card |'), true);
  check('an address is shown as it is', open.includes('http://192.168.0.2/x.png'), true);
  check('nothing is marked as taken out', /<redacted/.test(open), false);
}

/* ------------------------------------------------------------------ the outermost card is told */

{
  const results = [];
  startExpansion('r0', '"plain"', { type: 'tile' }, [], undefined, room, (result) => results.push(result));
  check('a card with nothing inside is told at once', results.length, 1);
  check('with its own entry and no whole card', [results[0].reports.length, results[0].full], [1, undefined]);
}

{
  const results = [];
  const inner = { ...room, label: '"inner"' };
  startExpansion(
    'r1',
    '"outer"',
    { type: 'vertical-stack', cards: [{ type: 'custom:decluttering-card-plus', template: 'inner' }] },
    [['cards', 0]],
    undefined,
    room,
    (result) => results.push(result),
  );
  check('a card with a card inside waits for it', results.length, 0);
  reportExpansion({ id: 'r1', path: ['cards', 0] }, { type: 'tile' }, [], inner);
  check('and is told once it builds', results.length, 1);
  check(
    'with both entries, outermost first',
    results[0].reports.map((r) => r.label),
    ['"room"', '"inner"'],
  );
  check('and the whole card built', results[0].full, { type: 'vertical-stack', cards: [{ type: 'tile' }] });
}

/* ------------------------------------------------------ redact: what review 2026-10-25 found left in */

check(
  'an alarm code, a pin and a passcode go',
  redact('data:\n  code: "482913"\n  pin: 1234\n  passcode: abcd'),
  'data:\n  code: <redacted>\n  pin: <redacted>\n  passcode: <redacted>',
);
check('Basic auth goes', redact('Authorization: Basic dXNlcjpwYXNz'), 'Authorization: <redacted>');
check('an auth key goes', redact('auth: abc123\nauthorization: xyz'), 'auth: <redacted>\nauthorization: <redacted>');
check(
  'a password inside a longer line goes',
  redact('url: x password=hunter22 more'),
  'url: x password=<redacted> more',
);
check(
  'where the house is goes',
  redact('latitude: 57.1234\nlongitude: -4.5678\ngps: [57.1, -4.5]'),
  'latitude: <redacted>\nlongitude: <redacted>\ngps: <redacted>',
);
check(
  'the token in a webhook, bot or Slack path goes',
  redact(
    'a: https://discord.com/api/webhooks/123/TOKENabc\nb: http://ha.local:8123/api/webhook/some-id\nc: https://api.telegram.org/bot123:ABC-def/sendMessage\nd: https://hooks.slack.com/services/T0/B0/xyz',
  ),
  'a: https://<redacted-host>/api/webhooks/123/<redacted>\nb: http://<redacted-host>:8123/api/webhook/<redacted>\nc: https://<redacted-host>/bot123:<redacted>\nd: https://<redacted-host>/services/<redacted>',
);
check('a MAC address goes', redact('mac: aa:bb:cc:dd:ee:ff'), 'mac: <redacted-mac>');
check(
  'a long known secret is taken out whole, not cut to its readable ends',
  redact(`x: ${'s'.repeat(5000)} y`, ['s'.repeat(5000)]).includes('sss'),
  false,
);
check(
  'a device class and a sort key stay',
  redact('device_class: door\nsort: code_format'),
  'device_class: door\nsort: code_format',
);
{
  const { formatReport: format } = require('../.test-build/report.js');
  const text = format({
    context: { version: '1' },
    reports: [
      {
        label: 'c',
        ms: 1,
        chain: [],
        sections: [
          {
            label: 'Hello @someone and www.example.com',
            variables: [{ variable: 'n', value: '@org/team', from: 'this card' }],
            trace: { placeholders: new Map(), dropped: [], warnings: [] },
            built: {},
          },
        ],
      },
    ],
  });
  check('a mention in a variable cannot notify anybody', /(?<!\\)@(?:someone|org)/.test(text), false);
  check('and a bare www. cannot link', text.includes('www.example'), false);
}

/* ------------------------------------------------------------------ redact: names, shapes, hosts */

for (const name of [
  'api_token',
  'auth_token',
  'client_secret',
  'webhook_id',
  'refresh_token',
  'private_key',
  'pwd',
  'x-api-key',
]) {
  check(`${name} as a YAML key goes`, redact(`${name}: abc123\nuser: bob`), `${name}: <redacted>\nuser: bob`);
  check(
    `${name} as a JSON key goes`,
    redact(`{"${name}":"abc123","user":"bob"}`),
    `{"${name}":"<redacted>","user":"bob"}`,
  );
}
check(
  'a word that only contains a secret word stays',
  redact('tokens: 3\nsecretary: jane'),
  'tokens: 3\nsecretary: jane',
);
check(
  'a password written as a block scalar goes whole',
  redact('password: |\n  trail\nuser: bob'),
  'password: <redacted>\nuser: bob',
);
check(
  'so does one in a list, keeping what follows',
  redact('  - api_token: |-\n      x\n      y\n    user: bob'),
  '  - api_token: <redacted>\n    user: bob',
);
check(
  'an escaped quote does not end a JSON password',
  redact('{"token":"ab\\"cd","user":"bob"}'),
  '{"token":"<redacted>","user":"bob"}',
);
check('a GitHub token goes', redact('t: ghp_abcdefghijklmnopqrstuvwxyz0123456789'), 't: <redacted-token>');
check('a fine-grained one too', redact('t: github_pat_11ABCDEFG0abcdefghijklmnopqrstuvwxyz'), 't: <redacted-token>');
check('and an OAuth one', redact('t: gho_abcdefghijklmnopqrstuvwxyz0123456789'), 't: <redacted-token>');
check('an sk- key goes', redact('t: sk-abcdefghijklmnopqrstuvwxyz'), 't: <redacted-token>');
check('a Slack token goes', redact('t: xoxb-1234567890-abcdefghij'), 't: <redacted-token>');
check('the host in any scheme goes', redact('ftp://nas.lan/backup'), 'ftp://<redacted-host>/backup');
check('a protocol-relative host goes', redact('src: //cdn.example.com/x.js'), 'src: //<redacted-host>/x.js');
check(
  'a media source is not an address',
  redact('media-source://media_source/local/x.mp3'),
  'media-source://media_source/local/x.mp3',
);
check('a bare .local host goes', redact('host: nas.local'), 'host: <redacted-host>');
check('a bare .lan host with a port goes', redact('host: nas.lan:8123'), 'host: <redacted-host>:8123');
check('a DuckDNS name goes', redact('me.duckdns.org:8123/lovelace'), '<redacted-host>:8123/lovelace');
check('a tplinkdns name goes', redact('at myhouse.tplinkdns.com here'), 'at <redacted-host> here');
check('a Nabu Casa name goes', redact('abc123.ui.nabu.casa'), '<redacted-host>');
check('a .home host with a port goes', redact('nas.home:8123'), '<redacted-host>:8123');
check('an entity called zone.home stays', redact('entity: zone.home'), 'entity: zone.home');
check('an entity whose id starts local stays', redact('sensor.local_temperature'), 'sensor.local_temperature');
check(
  'a slash in a password does not end the credentials',
  redact('rtsp://admin:pa/ss@cam.local/ch1/main'),
  'rtsp://<redacted-credentials>@<redacted-host>/ch1/main',
);
{
  const started = Date.now();
  const out = redact('a'.repeat(80000));
  check('one long run is cut down', out.length < 5000, true);
  check('and redacted in good time', Date.now() - started < 100, true);
}

/* ------------------------------------------------------------------ formatReport: a secret anywhere */

{
  const leaky = {
    label: '"cam"',
    chain: [],
    ms: 1,
    template: { name: 'cam', config: { card: { type: 'tile', name: '[[password]]' } } },
    sections: [
      {
        variables: [
          { variable: 'password', value: 'hunter2', from: 'card' },
          { variable: 'creds', value: { client_secret: 'deepsecret1' }, from: 'let' },
          { variable: 'token', value: 'on', from: 'default' },
        ],
        trace: {
          placeholders: new Map([
            ['[[password|upper]]', 'HUNTER2'],
            ['[[password?]]', 'hunter2'],
          ]),
          dropped: [],
          warnings: ['left [[password]] as written: nothing in Home Assistant for "hunter2"'],
        },
        built: { type: 'tile', name: 'hunter2', url: 'https://x/?q=hunter2', note: 'deepsecret1', state: 'on' },
      },
    ],
  };
  const text = formatReport({ context: { version: '1' }, reports: [leaky], full: { type: 'tile', name: 'hunter2' } });
  check('a secret used under another key is nowhere', text.includes('hunter2'), false);
  check('nor its upper-cased copy', text.includes('HUNTER2'), false);
  check(
    'a placeholder named after a secret shows nothing',
    text.includes('| \\[\\[password\\|upper\\]\\] | `<redacted>` |'),
    true,
  );
  check('nor one marked optional', text.includes('| \\[\\[password?\\]\\] | `<redacted>` |'), true);
  check('a secret nested in a variable is nowhere', text.includes('deepsecret1'), false);
  check('a short secret value does not wipe the word out of the report', text.includes('state: "on"'), true);
  check('but its own row is still blank', text.includes('| token | `<redacted>` | default: |'), true);
}

/* ------------------------------------------------------------------ formatReport: nothing injects Markdown */

{
  const hostile = {
    label: '"x"\n# not a heading',
    chain: [],
    ms: 1,
    sections: [
      {
        label: '# label <b>bold</b>\nsecond line',
        variables: [{ variable: 'name', value: '<img src=x onerror=alert(1)> *em* _u_ `c` [l](h) !', from: 'card' }],
        trace: { placeholders: new Map(), dropped: ['cards[0]'], warnings: ['one\ntwo'] },
        built: {},
      },
    ],
  };
  const text = formatReport({
    context: { version: '1', dashboard: 'my <dash>' },
    reports: [hostile],
    error: 'bad\n```\nfence',
  });
  check(
    'a newline in a headline does not start a new line',
    text.includes('<summary><b>decluttering-card-plus: "x" # not a heading built in 1.0 ms</b></summary>'),
    true,
  );
  check('a summary cannot carry HTML', text.includes('<summary><b>\\# label'), false);
  check('a section label is one escaped line', text.includes('### \\# label \\<b\\>bold\\</b\\> second line'), true);
  check(
    'a value cannot carry HTML or Markdown into a cell',
    text.includes('| name | \\<img src=x onerror=alert(1)\\> \\*em\\* \\_u\\_ \\`c\\` \\[l\\](h) \\! | this card |'),
    true,
  );
  check('a warning is one list item', text.includes('- one two\n'), true);
  check('a dashboard name is escaped in the header', text.includes('| Dashboard | my \\<dash\\> |'), true);
  check('a path is escaped', text.includes('- cards\\[0\\]'), true);
  check('an error with a fence in it is fenced longer', text.includes('## Error\n\n````\nbad\n```\nfence\n````'), true);
}

/* ------------------------------------------------------- item templates (#235) */
{
  const trace = newTrace();
  const inner = newTrace();
  inner.values = new Map([
    ['entity', 'sensor.a'],
    ['api_password', 'swordfish'],
    ['there', false],
  ]);
  inner.placeholders.set('[[entity|exists]]', false);
  trace.items = [{ placeholder: '[[row|repeat:rooms]]', copy: { number: 1, count: 2 }, trace: inner }];
  const text = formatReport({
    context: { version: '1' },
    reports: [{ label: '"t"', chain: [], ms: 1, sections: [{ variables: [], trace, built: {} }] }],
  });
  check(
    'an item template fill gets a heading',
    text.includes('#### Item template \\[\\[row\\|repeat:rooms\\]\\] - Copy 1 of 2'),
    true,
  );
  check('its values are a table', text.includes('| there | false |'), true);
  check('its placeholders too', text.includes('| \\[\\[entity\\|exists\\]\\] | false |'), true);
  check('a secret among them is taken out', text.includes('swordfish'), false);
}
