/*
 * Idea 14: the Advanced section of the card editor. Pure: what the form shows for a config,
 * what it writes back, and how many of the settings a card has set.
 */
const { check } = require('./check');
const {
  advancedData,
  applyAdvanced,
  advancedCount,
  advancedSchema,
  onErrorCard,
  withOnErrorCard,
} = require('../.test-build/card-editor/advanced');

const base = { type: 'custom:decluttering-card-plus', template: 'tile' };

// --- data shown for a config

check('an untouched card shows the defaults', advancedData(base), { on_error_mode: 'show', debug: 'off' });

check(
  'every advanced key is read into its field',
  advancedData({
    ...base,
    grid_options: { columns: 6, rows: 2 },
    style: 'ha-card { color: red }',
    on_error: { type: 'markdown', content: 'x' },
    strict: true,
    rebuild_on: 'light.a',
    debug: 'report',
    name: 'Kitchen tile',
    inherit_variables: true,
  }),
  {
    grid_columns: '6',
    grid_rows: '2',
    style: 'ha-card { color: red }',
    on_error_mode: 'card',
    strict: true,
    rebuild_on: ['light.a'],
    debug: 'report',
    name: 'Kitchen tile',
    inherit_variables: true,
  },
);

check('on_error: hide shows as the hide mode', advancedData({ ...base, on_error: 'hide' }).on_error_mode, 'hide');
check(
  'debug: true, the original switch, shows as its own option',
  advancedData({ ...base, debug: true }).debug,
  'json',
);
check(
  'grid_options: full is kept as the word',
  advancedData({ ...base, grid_options: { columns: 'full' } }).grid_columns,
  'full',
);
check('a rebuild_on list is shown as a list', advancedData({ ...base, rebuild_on: ['a.b', 'c.d'] }).rebuild_on, [
  'a.b',
  'c.d',
]);

// --- writing back

check(
  'defaults write nothing',
  applyAdvanced({ ...base, variables: [{ x: 1 }] }, { on_error_mode: 'show', debug: 'off' }),
  { ...base, variables: [{ x: 1 }] },
);

check(
  'each field writes its own key',
  applyAdvanced(base, {
    grid_columns: '4',
    grid_rows: 'auto',
    style: 'ha-card {}',
    on_error_mode: 'hide',
    strict: true,
    rebuild_on: ['light.a'],
    debug: 'yaml',
    name: 'N',
    inherit_variables: true,
  }),
  {
    ...base,
    grid_options: { columns: 4, rows: 'auto' },
    style: 'ha-card {}',
    on_error: 'hide',
    strict: true,
    rebuild_on: ['light.a'],
    debug: 'yaml',
    name: 'N',
    inherit_variables: true,
  },
);

check('debug json writes the original true', applyAdvanced(base, { on_error_mode: 'show', debug: 'json' }).debug, true);

check(
  'grid_options keys the form does not draw are kept',
  applyAdvanced(
    { ...base, grid_options: { columns: 2, min_rows: 3 } },
    { on_error_mode: 'show', debug: 'off', grid_columns: '3' },
  ).grid_options,
  { columns: 3, min_rows: 3 },
);

check(
  'clearing the last grid field removes grid_options',
  'grid_options' in
    applyAdvanced({ ...base, grid_options: { columns: 2 } }, { on_error_mode: 'show', debug: 'off', grid_columns: '' }),
  false,
);

check(
  'switching on_error to show removes the key, card and all',
  'on_error' in applyAdvanced({ ...base, on_error: { type: 'markdown' } }, { on_error_mode: 'show', debug: 'off' }),
  false,
);

check(
  'switching to the card mode keeps a card already there',
  applyAdvanced({ ...base, on_error: { type: 'markdown' } }, { on_error_mode: 'card', debug: 'off' }).on_error,
  { type: 'markdown' },
);

check(
  'switching to the card mode with no card yet writes nothing until a card is picked',
  'on_error' in applyAdvanced(base, { on_error_mode: 'card', debug: 'off' }),
  false,
);

check(
  'strict off removes the key rather than writing false',
  'strict' in applyAdvanced({ ...base, strict: true }, { on_error_mode: 'show', debug: 'off', strict: false }),
  false,
);
check(
  'an empty rebuild_on list removes the key',
  'rebuild_on' in
    applyAdvanced({ ...base, rebuild_on: 'a.b' }, { on_error_mode: 'show', debug: 'off', rebuild_on: [] }),
  false,
);
check(
  'an empty name removes the key',
  'name' in applyAdvanced({ ...base, name: 'x' }, { on_error_mode: 'show', debug: 'off', name: '' }),
  false,
);

check(
  'keys outside the section pass through untouched',
  applyAdvanced(
    { ...base, for_each_from: { template: '{{ states.light | map(attribute="entity_id") | list }}' }, columns: 2 },
    { on_error_mode: 'show', debug: 'off' },
  ),
  { ...base, for_each_from: { template: '{{ states.light | map(attribute="entity_id") | list }}' }, columns: 2 },
);

// --- the fallback card

check('the fallback card is the on_error mapping', onErrorCard({ ...base, on_error: { type: 'markdown' } }), {
  type: 'markdown',
});
check('hide is not a card', onErrorCard({ ...base, on_error: 'hide' }), undefined);
check('picking a fallback card writes it', withOnErrorCard(base, { type: 'tile' }).on_error, { type: 'tile' });
check(
  'removing the fallback card leaves the card mode with nothing',
  'on_error' in withOnErrorCard({ ...base, on_error: { type: 'tile' } }, undefined),
  false,
);

// --- the count in the summary

check('nothing set counts zero', advancedCount(base), 0);
check(
  'every setting counts once',
  advancedCount({
    ...base,
    grid_options: { rows: 1 },
    style: 'x',
    on_error: 'hide',
    strict: true,
    rebuild_on: 'a.b',
    debug: 'yaml',
    name: 'n',
    inherit_variables: true,
  }),
  8,
);
check('a false strict does not count', advancedCount({ ...base, strict: false }), 0);

// --- the schema

const schema = advancedSchema();
check(
  'the schema names every field in the order the mockup shows',
  schema.map((entry) => entry.name),
  ['grid_columns', 'grid_rows', 'style', 'on_error_mode', 'strict', 'rebuild_on', 'debug', 'name', 'inherit_variables'],
);
check('rebuild_on takes several entities', schema.find((e) => e.name === 'rebuild_on').selector.entity.multiple, true);
check(
  'debug offers the four modes and the original switch',
  schema.find((e) => e.name === 'debug').selector.select.options.map((o) => o.value),
  ['off', 'json', 'yaml', 'console', 'report'],
);
check(
  'on_error offers show, hide and a card of my choosing',
  schema.find((e) => e.name === 'on_error_mode').selector.select.options.map((o) => o.value),
  ['show', 'hide', 'card'],
);
