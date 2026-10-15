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

  report();
})();
