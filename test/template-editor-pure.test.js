/*
 * Unit tests for src/template-editor/pure.ts - the template editor's decisions that need no
 * page: the kind of template open, an edit to the Describe panel, rewrites made again after
 * the dialog's save. Run with `npm test`.
 */
const {
  THING_STUBS,
  templateKind,
  describeChange,
  hasOwnCardType,
  cameFromOutside,
  memoLast,
  badMessageFor,
  redoingRewrites,
  addsOneNode,
} = require('../.test-build/template-editor/pure.js');
const { collectTemplates, addTemplateToRoot, renameTemplate, replaceCard } = require('../.test-build/templates.js');
const test = require('node:test');
const assert = require('node:assert/strict');

const { check } = require('./check');

const T = 'custom:decluttering-template-plus';
const SHAPES = {
  card: { type: T, template: 't', card: { type: 'tile', entity: '[[entity]]' } },
  badge: { type: T, template: 't', badge: { type: 'entity', entity: '[[entity]]' } },
  row: { type: T, template: 't', row: { entity: '[[entity]]' } },
  element: { type: T, template: 't', element: { type: 'icon', icon: 'mdi:home' } },
  group: { type: T, template: 't', group: { cards: [{ type: 'tile' }, { type: 'button' }] } },
  function: { type: T, template: 't', function: '[[value|upper]]', parameters: ['value'] },
  item: { type: T, template: 't', item: { type: 'picture-entity', entity: '[[entity]]' } },
  dashboard: { type: T, template: 't', dashboard: { views: [] } },
  extendsOnly: { type: T, template: 't', extends: 'parent', default: [{ entity: 'light.kitchen' }] },
};

// --- the kind of template ---------------------------------------------------------------
check(
  'each shape of template is the kind it holds',
  Object.fromEntries(Object.entries(SHAPES).map(([shape, config]) => [shape, templateKind(config)])),
  {
    card: 'card',
    badge: 'badge',
    row: 'row',
    element: 'element',
    group: 'card',
    function: 'function',
    item: 'item',
    dashboard: 'dashboard',
    extendsOnly: 'card',
  },
);
check(
  'a template with no body of its own is what its parents make it',
  [
    templateKind(SHAPES.extendsOnly, { badge: { type: 'entity' } }),
    templateKind(SHAPES.extendsOnly, { row: { entity: 'x' } }),
    templateKind(SHAPES.extendsOnly, { item: {} }),
    templateKind(SHAPES.extendsOnly, undefined),
  ],
  ['badge', 'row', 'item', 'card'],
);
check('a new template with nothing in it reads as a card', templateKind({ type: T, template: 'new' }), 'card');
check(
  'what the dashboard resolves is not asked when the template has a body',
  templateKind(SHAPES.badge, SHAPES.card),
  'badge',
);

// --- an edit to the Describe panel that is not the Type field leaves the body alone ------
const BODY_KEYS = [
  'card',
  'badge',
  'row',
  'element',
  'group',
  'function',
  'parameters',
  'item',
  'dashboard',
  'extends',
];
const body = (config) => Object.fromEntries(BODY_KEYS.filter((key) => key in config).map((key) => [key, config[key]]));
for (const [shape, config] of Object.entries(SHAPES)) {
  for (const [field, value] of [
    ['description', 'Typed'],
    ['category', 'Lights'],
    ['template', 'renamed'],
  ]) {
    const out = describeChange(config, { [field]: value });
    check(`${shape}: an edit to ${field} leaves the body as it was`, body(out), body(config));
    check(`${shape}: and sets ${field}`, out[field], value);
  }
  check(
    `${shape}: the type picked again as it reads changes nothing`,
    describeChange(config, { thingType: templateKind(config) }),
    config,
  );
}
check(
  'an emptied description is taken out',
  'description' in describeChange({ ...SHAPES.card, description: 'x' }, { description: '' }),
  false,
);

// The case that was reported: a child that only extends, as the dashboard resolves it.
const parent = { type: T, template: 'warm_tile', card: { type: 'tile', entity: '[[entity]]', color: 'amber' } };
const child = { type: T, template: 'warm_kitchen', extends: 'warm_tile', default: [{ entity: 'light.kitchen' }] };
const ll = { views: [{ cards: [parent, child] }] };
const described = describeChange(child, { description: 'Kitchen' }, collectTemplates(ll).warm_kitchen);
check('a child that only extends gets no card of its own from a description', 'card' in described, false);
check('so it still builds what its parent built', collectTemplates(ll, undefined, described).warm_kitchen.card, {
  type: 'tile',
  entity: '[[entity]]',
  color: 'amber',
});

// --- the Type field itself -----------------------------------------------------------------
check('a card made a badge swaps the body for a starter', body(describeChange(SHAPES.card, { thingType: 'badge' })), {
  badge: THING_STUBS.badge,
});
check('a badge made a card', body(describeChange(SHAPES.badge, { thingType: 'card' })), { card: THING_STUBS.card });
check('a group made a row loses its group', body(describeChange(SHAPES.group, { thingType: 'row' })), {
  row: THING_STUBS.row,
});
check(
  'a card made a function gets a function body and no card',
  body(describeChange(SHAPES.card, { thingType: 'function' })),
  {
    function: '[[value]]',
  },
);
check(
  'a function made a card loses its function and parameters',
  body(describeChange(SHAPES.function, { thingType: 'card' })),
  {
    card: THING_STUBS.card,
  },
);
check(
  'an item template made a card stops being an item template',
  body(describeChange(SHAPES.item, { thingType: 'card' })),
  {
    card: THING_STUBS.card,
  },
);
check('a page made an element stops being a page', body(describeChange(SHAPES.dashboard, { thingType: 'element' })), {
  element: THING_STUBS.element,
});
check(
  'a child that only extends, given a type of its own, gets that starter',
  body(describeChange(SHAPES.extendsOnly, { thingType: 'badge' }, { card: { type: 'tile' } })),
  { extends: 'parent', badge: THING_STUBS.badge },
);
check('nothing is changed in place', SHAPES.card.card, { type: 'tile', entity: '[[entity]]' });

// --- small decisions ---------------------------------------------------------------------
check(
  'a card says its own type or it does not',
  [
    hasOwnCardType({ type: 'tile' }),
    hasOwnCardType({ color: 'red' }),
    hasOwnCardType(undefined),
    hasOwnCardType('tile'),
  ],
  [true, false, false, false],
);
check(
  'a config is from outside when it is not what was last sent',
  [
    cameFromOutside({ a: 1 }, undefined),
    cameFromOutside({ a: 1, b: 2 }, { b: 2, a: 1 }),
    cameFromOutside({ a: 2 }, { a: 1 }),
  ],
  [false, false, true],
);

const memo = memoLast();
let made = 0;
const keyA = {};
const keyB = {};
const first = memo([keyA, 'x'], () => ({ n: (made += 1) }));
const again = memo([keyA, 'x'], () => ({ n: (made += 1) }));
const other = memo([keyB, 'x'], () => ({ n: (made += 1) }));
const back = memo([keyA, 'x'], () => ({ n: (made += 1) }));
check(
  'the same things give the last answer without working it out again',
  [first === again, first.n, made],
  [true, 1, 3],
);
check('a different object works it out again, and only the last is kept', [other.n, back.n], [2, 3]);
check(
  'a different number of things is not the same things',
  memo([keyA], () => 'short'),
  'short',
);

// --- what the lint said about a placeholder ---------------------------------------------
const bad = new Map([
  ['name', 'name is not set'],
  ['uper', 'no step called uper'],
]);
check(
  'a warning about a name says nothing of a longer name that holds it',
  badMessageFor('[[entity_name]]', bad),
  undefined,
);
check('nor of a step that holds it', badMessageFor('[[entity|friendly_name]]', bad), undefined);
check('the name itself is found', badMessageFor('[[name]]', bad), 'name is not set');
check('with steps after it', badMessageFor('[[name|upper?]]', bad), 'name is not set');
check('and as a condition', badMessageFor('[[icon|if:!name]]', bad), 'name is not set');
check('a step is found by its name', badMessageFor('[[entity|uper]]', bad), 'no step called uper');
check('a dotted read is a use of what it reads from', badMessageFor('[[name.first]]', bad), 'name is not set');
check(
  'a finding filed under the whole placeholder is found',
  badMessageFor('[[a|b]]', new Map([['[[a|b]]', 'whole']])),
  'whole',
);
check('nothing said, nothing found', badMessageFor('[[name]]', new Map()), undefined);

// --- rewrites made again after the dialog's save ----------------------------------------
const baseDash = { title: 'Home', views: [{ cards: [{ type: 'tile', entity: 'a' }] }, { sections: [{ cards: [] }] }] };
const withCard = (dash, view, card) => ({
  ...dash,
  views: dash.views.map((each, index) => (index === view ? { ...each, cards: [...(each.cards ?? []), card] } : each)),
});
check('a card added to a view is one thing put in', addsOneNode(baseDash, withCard(baseDash, 0, { type: 'x' })), true);
check(
  'so is the first card of a view that had none',
  addsOneNode(baseDash, withCard(baseDash, 1, { type: 'x' })),
  true,
);
check(
  'and a card added to a section',
  addsOneNode(baseDash, {
    ...baseDash,
    views: [baseDash.views[0], { sections: [{ cards: [{ type: 'x' }] }] }],
  }),
  true,
);
check('a card put in the middle of a list', addsOneNode([1, 2, 3], [1, 9, 2, 3]), true);
check('the same dashboard is not', addsOneNode(baseDash, baseDash), false);
check(
  'a card changed in place is not',
  addsOneNode(baseDash, { ...baseDash, views: [{ cards: [{ type: 'tile', entity: 'b' }] }, baseDash.views[1]] }),
  false,
);
check(
  'a card added and another thing changed is not',
  addsOneNode(baseDash, { ...withCard(baseDash, 0, { type: 'x' }), title: 'Other' }),
  false,
);
check('two cards added is not', addsOneNode([1], [1, 2, 3]), false);
check('a card taken away is not', addsOneNode([1, 2], [1]), false);

const installOnce = (config) =>
  config.decluttering_templates?.installed
    ? config
    : addTemplateToRoot(config, 'installed', { card: { type: 'tile' } });
const pagePanel = (config) => ({
  config,
  saves: [],
  async saveConfig(next) {
    this.saves.push(next);
    this.config = next;
  },
});

test('a rewrite the dialog save undid is made again, once', async () => {
  const opened = { views: [{ cards: [{ type: 'tile' }] }] };
  const panel = pagePanel(installOnce(opened));
  // The dialog for a card being added saves the dashboard as it was when it opened, plus the card.
  const dialogSave = async (card) => panel.saveConfig(withCard(opened, 0, card));
  let save = redoingRewrites(dialogSave, installOnce, () => panel, opened);
  // By the second rewrite the page has moved on; the dialog still holds what it opened with.
  save = redoingRewrites(
    save,
    (config) => renameTemplate(config, 'old', 'new'),
    () => panel,
    panel.config,
  );
  await save({ type: T, template: 'new', card: { type: 'tile' } });
  assert.equal(panel.saves.length, 2);
  assert.deepEqual(Object.keys(panel.config.decluttering_templates), ['installed']);
  assert.equal(panel.config.views[0].cards.length, 2);
  assert.equal(save.dcpRewrites.length, 2);
  assert.equal(save.dcpBase, opened);
});

test('a dialog that saves over the dashboard as it stands has nothing made again', async () => {
  // Two cards written alike; the tool swapped the first, and must not swap the second on Save.
  const alike = { type: 'tile', entity: 'light.a' };
  const opened = { views: [{ cards: [{ type: T, template: 'mine', card: { type: 'button' } }, alike, alike] }] };
  const swap = (config) => replaceCard(config, alike, { type: 'custom:decluttering-card-plus', template: 'mine' });
  const panel = pagePanel(swap(opened));
  const dialogSave = async (card) =>
    panel.saveConfig({ views: [{ cards: [card, ...panel.config.views[0].cards.slice(1)] }] });
  await redoingRewrites(dialogSave, swap, () => panel, opened)({ type: T, template: 'mine', card: { type: 'tile' } });
  assert.equal(panel.saves.length, 1);
  assert.deepEqual(panel.config.views[0].cards[2], alike);
});

test('with no dashboard to save through, the dialog save is all that happens', async () => {
  let saved = 0;
  const result = await redoingRewrites(
    async () => (saved += 1),
    (config) => config,
    () => null,
    {},
  )({});
  assert.deepEqual([saved, result], [1, 1]);
});

// --- what a pasted bundle's includes install ---------------------------------------------
const { importableIncludes } = require('../.test-build/template-editor/pure.js');
const { checkDashboard } = require('../.test-build/templates.js');

const carried = {
  good: { card: { type: 'tile' } },
  text: 'oops',
  number: 5,
  yes: true,
  none: null,
  list: ['a'],
  here: { card: {} },
};
const wanted = importableIncludes(carried, ['here']);
check('only the includes that are templates, under names not here yet, are installed', wanted, [
  ['good', { card: { type: 'tile' } }],
]);
check(
  'includes that are not a mapping install nothing',
  [importableIncludes(['a'], []), importableIncludes('x', []), importableIncludes(undefined, [])],
  [[], [], []],
);
test('the dashboard an import leaves behind can still be checked', () => {
  const saved = wanted.reduce((built, [name, template]) => addTemplateToRoot(built, name, template), { views: [] });
  assert.doesNotThrow(() => checkDashboard(saved));
});
