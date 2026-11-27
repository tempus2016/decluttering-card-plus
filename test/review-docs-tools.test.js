/*
 * The docs-site tools after the 2026-11-27 review: the builder's multi-document paste, names
 * the sample house could not make an id from, links too large to open again, the step rows of
 * a very long chain, and a template named by a number.
 * Run with `npm test`.
 */
const { loadAll } = require('js-yaml');
const { buildTemplates } = require('../.test-build/builder.js');
const { ownEntities, tryOnPage, idFor, houseRows } = require('../.test-build/playground-house.js');
const { encodeState, decodeHash, readableHash, TOO_LARGE } = require('../.test-build/playground-share.js');
const { tryPlaceholder, MAX_STEP_ROWS } = require('../.test-build/playground.js');
const { tryTemplate } = require('../.test-build/try-template.js');
const { buildPage } = require('../.test-build/page-template.js');

const { check } = require('./check');

const warned = [];
console.warn = (...args) => warned.push(args.join(' '));
console.log = () => {};
console.groupCollapsed = () => {};
console.groupEnd = () => {};

/* ------------------------------------------------------------------ the builder, two documents */

{
  const tile = (id, name) => `- type: tile\n  entity: light.${id}\n  name: ${name}\n`;
  const made = buildTemplates(`${tile('a', 'A')}${tile('b', 'B')}---\n${tile('c', 'C')}${tile('d', 'D')}`);
  const back = loadAll(made.pastedYaml);
  check('two documents come back as two', back.length, 2);
  check(
    'with two cards in each',
    back.map((doc) => doc.length),
    [2, 2],
  );
  check(
    'and the last value of the first is itself',
    back[0][1].variables.find((entry) => 'name' in entry),
    { name: 'B' },
  );
  check(
    'one document has no marker in it',
    buildTemplates(`${tile('a', 'A')}${tile('b', 'B')}`).pastedYaml.includes('---'),
    false,
  );
}

/* ------------------------------------------------------------------ names with no a to z in them */

{
  const text =
    'kitchen_light:\n  domain: light\n  area: 厨房\n' +
    'lounge_light:\n  domain: light\n  area: 客厅\n  labels: [夜灯]\n' +
    'bed_light:\n  domain: light\n  area: Спальня\n  floor: Второй этаж\n' +
    'hall_light:\n  domain: light\n  area: Hall\n  labels: [Вечер]\n';
  const own = ownEntities(text, true);
  check('nothing is refused', own.problems, []);
  check(
    'each area is its own',
    Object.values(own.house.areas).map((area) => area.name),
    ['厨房', '客厅', 'Спальня', 'Hall'],
  );
  check('none has an empty id', Object.keys(own.house.areas).includes(''), false);
  check('a Latin name keeps the id it had', [idFor('Back Garden'), idFor('Hall')], ['back_garden', 'hall']);
  check(
    'one with none keeps its own letters',
    [idFor('厨房'), idFor('Второй этаж'), idFor('!!!')],
    ['厨房', 'второй_этаж', 'unnamed'],
  );
  check(
    'each entity is where it was put',
    houseRows(own.house, own.added).map((row) => [row.entity, row.where, row.labels.join(',')]),
    [
      ['light.kitchen_light', '厨房, on no floor', ''],
      ['light.lounge_light', '客厅, on no floor', '夜灯'],
      ['light.bed_light', 'Спальня, Второй этаж', ''],
      ['light.hall_light', 'Hall, on no floor', 'Вечер'],
    ],
  );
  const swept = tryOnPage({
    variables: 'src: {area: 客厅}',
    placeholder: '[[row|repeat:src]]',
    entities: text,
    onlyMine: true,
    templates: "row:\n  item:\n    entity: '[[entity]]'\n",
  });
  check('a repeat over one of them finds its entity', swept.whole.value, [{ entity: 'light.lounge_light' }]);
  check(
    'the same name twice is one area',
    Object.keys(ownEntities('a: {domain: light, area: 厨房}\nb: {domain: light, area: 厨房}\n', true).house.areas)
      .length,
    1,
  );
}

/* ------------------------------------------------------------------ links */

(async () => {
  const thrown = async (make) => {
    try {
      await make();
      return 'no throw';
    } catch (err) {
      return err.message;
    }
  };
  let seed = 7;
  const noise = Array.from({ length: 160000 }, () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return String.fromCharCode(33 + (seed % 90));
  }).join('');
  check(
    'boxes too long for a plain link are refused, not written',
    await thrown(() => encodeState({ templates: noise }, false)),
    TOO_LARGE,
  );
  check(
    'more than the page will inflate is refused however well it squeezes',
    await thrown(() => encodeState({ templates: 'row: {item: {entity: x}}\n'.repeat(50000) }, true)),
    TOO_LARGE,
  );
  const fits = await encodeState({ templates: 'row: {item: {entity: x}}\n'.repeat(30000), placeholder: '[[a]]' }, true);
  check('what fits squeezed still makes a link', fits.startsWith('try=z.'), true);
  check('that opens again', (await decodeHash(fits)).state.placeholder, '[[a]]');
  check(
    'too long an address says so',
    (await decodeHash(`#try=j.${'A'.repeat(200001)}`)).problem.includes('more than this page will open'),
    true,
  );
  {
    const zeros = new Uint8Array(3_000_000);
    const stream = new CompressionStream('deflate-raw');
    const zipped = new Uint8Array(await new Response(new Blob([zeros]).stream().pipeThrough(stream)).arrayBuffer());
    const problem = (await decodeHash(`try=z.${Buffer.from(zipped).toString('base64url')}`)).problem;
    check(
      'one that inflates too far says it is too much, not cut short',
      problem.includes('more than this page will open'),
      true,
    );
  }
  check('a cut-short one still says cut short', (await decodeHash('try=z.AAAA')).problem.includes('cut short'), true);

  check(
    'a plus sign written by hand is a plus sign',
    await decodeHash('#placeholder=[[count|add:+1]]&variables=count:%203'),
    {
      state: { placeholder: '[[count|add:+1]]', variables: 'count: 3' },
    },
  );
  for (const id of ['variables', 'card', 'entities', 'templates', 'placeholder', 'only', 'all']) {
    check(`a heading called #${id} is not an example`, await decodeHash(`#${id}`), undefined);
  }
  check('an empty box written out is still one', await decodeHash('#card=&placeholder=x'), {
    state: { placeholder: 'x', card: '' },
  });
  check('all=1 is every state readable', await decodeHash('#card=x&all=1'), { state: { card: 'x', readAll: true } });
  check('and readableHash writes it', readableHash({ card: 'x', readAll: true }), 'card=x&all=1');
  check('which reads back', await decodeHash(readableHash({ card: 'a + b', readAll: true, onlyMine: true })), {
    state: { card: 'a + b', onlyMine: true, readAll: true },
  });
})();

/* ------------------------------------------------------------------ a very long chain */

{
  const long = `[[a${'|upper'.repeat(2000)}]]`;
  const started = Date.now();
  const result = tryPlaceholder('a: x', long);
  check('the whole value is still worked out', result.whole.value, 'X');
  check('the rows stop at the limit', result.steps.length, MAX_STEP_ROWS + 1);
  check('in well under a second', Date.now() - started < 1000, true);
  check(
    'a short chain has every row',
    tryPlaceholder('a: x', '[[a|upper|lower]]').steps.map((row) => row.value),
    ['x', 'X', 'x'],
  );
}

/* ------------------------------------------------------------------ a template named by a number */

{
  const run = (templates, card) => tryTemplate({ templates, card, entities: '', onlyMine: false, readAll: false });
  const CARD = 'type: custom:decluttering-card-plus\ntemplate: 5\n';
  const missing = run('t: {card: {type: tile}}\n', CARD);
  check('a number that names no template says so in words', missing.error.includes('"5"'), true);
  check('not in JavaScript', /is not a function/.test(missing.error), false);
  check('one that names a template builds it', run('5: {card: {type: tile}}\n', CARD).final, { type: 'tile' });
  check(
    'a mapping is no name at all',
    /is not a function|object Object/.test(
      run('t: {card: {type: tile}}\n', 'type: custom:decluttering-card-plus\ntemplate: {a: 1}\n').error,
    ),
    false,
  );
}

/* ------------------------------------------------------------------ a page filled once */

{
  const templates = (body) => ({ page: { dashboard: body } });
  const page = { page: { template: 'page', variables: [{ room: 'Hall' }] } };
  warned.length = 0;
  const plain = buildPage(
    page,
    templates({ views: [{ title: '[[room]]', cards: [{ type: 'markdown', content: '[[missing]]' }] }] }),
  );
  check('a page with no repeat is built as before', plain.dashboard.views[0].title, 'Hall');
  check('and still says what it left unset, once', warned.filter((line) => line.includes('missing')).length, 1);
  warned.length = 0;
  const repeated = buildPage(
    page,
    templates({ views: [{ title: '[[gone]]' }, { for_each: [{ n: 1 }], view: { title: '[[n]] [[index]]' } }] }),
  );
  check(
    'one with a repeat keeps the repeat for the writing-out',
    repeated.dashboard.views[1].view.title,
    '[[n]] [[index]]',
  );
  check(
    'and says only what the page itself left unset',
    [warned.some((l) => l.includes('gone')), warned.some((l) => l.includes('index'))],
    [true, false],
  );
}
