/*
 * What an edit in the card editor writes into the card (review): the variables form and the
 * layout form under it, a card-valued variable, and telling another card's config from this
 * card's next edit. Pure - the element only hands these what the form gave it.
 */
const { check } = require('./check');
const {
  applyVariablesForm,
  withCardVariable,
  isForeignConfig,
  itemIds,
  holdingOnSave,
} = require('../.test-build/card-editor/edits');

const base = { type: 'custom:decluttering-card-plus', template: 'tile' };
const NAMES = ['title', 'entity', 'on'];

// What the editor's _formData hands the form for a card: each declared field, the rest as extras, the layout keys.
function formData(config) {
  const values = {};
  const list = Array.isArray(config.variables) ? config.variables : config.variables ? [config.variables] : [];
  for (const entry of list) for (const [name, value] of Object.entries(entry)) values[name] = value;
  const data = { template: config.template };
  const extras = [];
  for (const [name, value] of Object.entries(values)) {
    if (NAMES.includes(name)) data[`variable:${name}`] = value;
    else extras.push({ [name]: value });
  }
  if (extras.length) data.extras = extras;
  for (const key of ['columns', 'min_column_width', 'gap', 'fit', 'lazy', 'lazy_eager']) {
    if (config[key] !== undefined) data[key] = config[key];
  }
  return data;
}

/* ------------------------------------------------------------ the form left as it was */

const UNTOUCHED = [
  { ...base, variables: [{ title: '' }, { entity: 'light.a' }, { zone: 'x' }] },
  { ...base, variables: [{ zone: 'x' }, { entity: 'light.a' }], fit: 'contents' },
  { ...base, variables: [{ entity: 'light.a' }], lazy: false, columns: 2, gap: 8 },
  { ...base, variables: [{ entity: 'light.a' }], lazy: true, lazy_eager: 4, min_column_width: 200 },
  { ...base, for_each: [{ entity: 'light.a' }], grid_options: { columns: 6 } },
  { ...base, variables: [{ on: 'yes' }, { title: 0 }, { entity: null }] },
];
for (const config of UNTOUCHED) {
  check(
    `the form left as it was writes ${JSON.stringify(config).slice(base.type.length + 28)} back untouched`,
    applyVariablesForm(config, formData(config), NAMES),
    config,
  );
}

/* ------------------------------------------------------------ what a change writes */

const empty = { ...base, variables: [{ title: '' }, { entity: 'light.a' }, { zone: 'x' }] };
check(
  'an empty string the card wrote stays while another field changes',
  applyVariablesForm(empty, { ...formData(empty), 'variable:entity': 'light.b' }, NAMES).variables,
  [{ title: '' }, { entity: 'light.b' }, { zone: 'x' }],
);
check(
  'a field cleared sets nothing',
  applyVariablesForm(empty, { ...formData(empty), 'variable:entity': '' }, NAMES).variables,
  [{ title: '' }, { zone: 'x' }],
);
check(
  'a mapping typed in the box under the fields is read like the list',
  applyVariablesForm(empty, { ...formData(empty), extras: { zone: 'x', floor: 1 } }, NAMES).variables,
  [{ title: '' }, { entity: 'light.a' }, { zone: 'x' }, { floor: 1 }],
);
check(
  'the box emptied takes the rest away',
  applyVariablesForm(empty, { ...formData(empty), extras: undefined }, NAMES).variables,
  [{ title: '' }, { entity: 'light.a' }],
);
check(
  'fit is written for a template that declares variables',
  applyVariablesForm(empty, { ...formData(empty), fit: 'contents' }, NAMES).fit,
  'contents',
);
check(
  'and taken out when it is cleared',
  'fit' in applyVariablesForm({ ...empty, fit: 'contents' }, { ...formData(empty), fit: undefined }, NAMES),
  false,
);
check(
  'lazy switched off takes the key out, declared or not',
  [
    'lazy' in applyVariablesForm({ ...empty, lazy: true }, { ...formData(empty), lazy: false }, NAMES),
    'lazy' in applyVariablesForm({ ...base, lazy: true }, { ...base, lazy: false }, []),
  ],
  [false, false],
);
check(
  'a lazy: false the card wrote stays, declared or not',
  [
    applyVariablesForm({ ...empty, lazy: false }, { ...formData(empty), lazy: false, gap: 4 }, NAMES).lazy,
    applyVariablesForm({ ...base, lazy: false }, { ...base, lazy: false, gap: 4 }, []).lazy,
  ],
  [false, false],
);
check(
  'a default only shown in its field stays unwritten',
  applyVariablesForm(
    { ...base, variables: [{ entity: 'light.a' }] },
    { template: 'tile', 'variable:entity': 'light.a', 'variable:title': 'Hall' },
    NAMES,
    new Map([['title', { shown: 'Hall', written: undefined }]]),
  ).variables,
  [{ entity: 'light.a' }],
);
check(
  'a switch shown for a written word keeps the word until it is moved',
  [true, false].map(
    (on) =>
      applyVariablesForm(
        { ...base, variables: [{ on: 'yes' }] },
        { template: 'tile', 'variable:on': on },
        NAMES,
        new Map([['on', { shown: true, written: 'yes' }]]),
      ).variables,
  ),
  [[{ on: 'yes' }], [{ on: false }]],
);
check(
  'with nothing declared the form holds the card itself',
  applyVariablesForm(base, { ...base, variables: [{ a: 1 }], fit: 'contents' }, []),
  { ...base, variables: [{ a: 1 }], fit: 'contents' },
);

/* ------------------------------------------------------------ a card-valued variable */

const cards = { ...base, variables: [{ header: { type: 'markdown' } }, { entity: 'light.a' }] };
check(
  'a card variable edited keeps its place',
  withCardVariable(cards, 'header', { type: 'markdown', content: 'x' }).variables,
  [{ header: { type: 'markdown', content: 'x' } }, { entity: 'light.a' }],
);
check('a new one goes after the rest', withCardVariable(cards, 'footer', { type: 'tile' }).variables, [
  { header: { type: 'markdown' } },
  { entity: 'light.a' },
  { footer: { type: 'tile' } },
]);
check('cleared, it goes', withCardVariable(cards, 'header', undefined).variables, [{ entity: 'light.a' }]);
check(
  'and the key with the last one',
  'variables' in withCardVariable({ ...base, variables: [{ header: { type: 'x' } }] }, 'header', undefined),
  false,
);

/* ------------------------------------------------------------ another card's config */

const a = { ...base, variables: [{ entity: 'light.a' }] };
const b = { ...base, variables: [{ entity: 'light.b' }] };
check('the first config is the card being opened', isForeignConfig(a, undefined, undefined), false);
check(
  'a config the editor fired is its own, the same object or a copy',
  [isForeignConfig(b, a, b), isForeignConfig(JSON.parse(JSON.stringify(b)), a, b)],
  [false, false],
);
check('the card it already holds, handed over again, changes nothing', isForeignConfig({ ...a }, a, undefined), false);
check(
  'a config it never fired is another card',
  [isForeignConfig(b, a, undefined), isForeignConfig(b, a, a)],
  [true, true],
);

/* ------------------------------------------------------------ the ids of a list's items */

check('an id for each item', itemIds([], 3), [0, 1, 2]);
check('a new item is numbered on from the highest', itemIds([2, 0, 1], 4), [2, 0, 1, 3]);
check('fewer items, fewer ids', itemIds([2, 0, 1], 2), [2, 0]);

/* ------------------------------------------------------------ holding an undo when the dialog saves */

(async () => {
  let dashboard = { v: 1 };
  const held = [];
  const save = holdingOnSave(
    async (config) => {
      dashboard = { v: config };
      return 'saved';
    },
    () => dashboard,
    (before, after) => held.push([before, after]),
  );
  check('nothing is held until the dialog saves', held.length, 0);
  const result = await save(2);
  check(
    "the dialog's own save still runs, and what it changed is held",
    [result, held],
    ['saved', [[{ v: 1 }, { v: 2 }]]],
  );
  const same = holdingOnSave(
    async () => 'saved',
    () => dashboard,
    () => held.push('again'),
  );
  await same(3);
  check('a save that changed nothing holds nothing', held.length, 1);
})();

/* ------------------------------------------------------------ allow_empty (#514) */

{
  const ALLOW = new Set(['entity']);
  const shownDefault = new Map([['entity', { shown: 'camera.front', written: undefined }]]);
  const empty = { ...base };
  // HA's entity field hands back undefined once cleared.
  const cleared = { ...formData(empty) };
  delete cleared['variable:entity'];
  check(
    'an allow_empty field showing its default and cleared writes an empty value (#514)',
    applyVariablesForm(empty, cleared, NAMES, shownDefault, ALLOW).variables,
    [{ entity: '' }],
  );
  check(
    'the same field left showing its default writes nothing (#514)',
    'variables' in
      applyVariablesForm(empty, { ...formData(empty), 'variable:entity': 'camera.front' }, NAMES, shownDefault, ALLOW),
    false,
  );
  const set = { ...base, variables: [{ entity: 'camera.back' }] };
  const setCleared = { ...formData(set) };
  delete setCleared['variable:entity'];
  check(
    'an allow_empty field the card sets, cleared, writes an empty value (#514)',
    applyVariablesForm(set, setCleared, NAMES, new Map(), ALLOW).variables,
    [{ entity: '' }],
  );
  check(
    'without allow_empty the same clear takes the line out, as before',
    'variables' in applyVariablesForm(set, setCleared, NAMES, new Map()),
    false,
  );
  check(
    'an allow_empty field never shown and never set stays unwritten (#514)',
    'variables' in applyVariablesForm(empty, cleared, NAMES, new Map(), ALLOW),
    false,
  );
}
