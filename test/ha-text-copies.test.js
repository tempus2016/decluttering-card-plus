/*
 * Home Assistant's text stays text inside a `with:` or `repeat:` copy. A copy's values are
 * marked as any resolver's are, but each copy used to write its marks out before it went back
 * into the card's text, which is substituted again - so a friendly name of `[[secret]]` was
 * read as the card's `secret` variable one pass later. Each path a copy's values can take is
 * checked here. Run with `npm test`.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { resolveRegistryItems } = require('../.test-build/registry.js');
const { forEachVariables, filledReader } = require('../.test-build/variables.js');
const { optionsFrom } = require('../.test-build/options-from.js');
const { tryInReport } = require('../.test-build/report-try.js');

const WJ = '⁠';
const houseNamed = (name) => ({
  states: { 'sensor.evil': { state: 'x', attributes: { friendly_name: name } } },
  entities: { 'sensor.evil': { entity_id: 'sensor.evil', platform: 'demo' } },
  devices: {},
  areas: {},
  floors: {},
  labels: {},
});
const hass = houseNamed('[[secret]]');
const source = { f: { entities: 'sensor.evil' } };
const secret = { secret: 'LEAKED' };
const build = (variables, content, itemTemplates, house = hass, trace) =>
  deepReplace(variables, {}, content, 't', house, true, undefined, 0, trace, undefined, false, { itemTemplates });
const row = { hrow: { item: { type: '[[name]]', entity: '[[entity]]' } } };

check(
  'a repeat over a registry source keeps a friendly name as text',
  build([source, secret], { d: '[[hrow|repeat:f]]' }, row),
  { d: [{ type: '[[secret]]', entity: 'sensor.evil' }] },
);
const viaWith = { ...row, ha: { default: source, item: ['[[hrow|repeat:f]]'] } };
check('and so does one inside a with: body', build([secret], { d: '[[ha|with]]' }, viaWith), {
  d: [{ type: '[[secret]]', entity: 'sensor.evil' }],
});
check('and one reached through a variable', build([{ hl: '[[ha|with]]' }, secret], { d: '[[hl]]' }, viaWith), {
  d: [{ type: '[[secret]]', entity: 'sensor.evil' }],
});
check(
  'a with: inside a repeat copy keeps it too',
  build(
    [source, secret],
    { d: '[[wrap|repeat:f]]' },
    { wrap: { item: { x: '[[inner|with]]' } }, inner: { item: { t: '[[name]]' } } },
  ),
  { d: [{ x: { t: '[[secret]]' } }] },
);
check(
  'and |flat lays the copies out with it as text',
  build([source, secret], { d: ['[[lst|repeat:f|flat]]'] }, { lst: { item: ['[[name]]', 'b'] } }),
  { d: ['[[secret]]', 'b'] },
);
check(
  'a repeat over a mapping whose values are Home Assistant text keeps them as text',
  [
    build(
      [{ e: 'sensor.evil' }, { m: { a: '[[e|friendly_name]]' } }, secret],
      { d: '[[mrow|repeat:m]]' },
      { mrow: { item: { t: '[[value]]' } } },
    ),
    build(
      [{ e: 'sensor.evil' }, { m: { a: { n: '[[e|friendly_name]]' } } }, secret],
      { d: '[[mrow|repeat:m]]' },
      { mrow: { item: { t: '[[n]]' } } },
    ),
  ],
  [{ d: [{ t: '[[secret]]' }] }, { d: [{ t: '[[secret]]' }] }],
);
check(
  'pick: on a list holding Home Assistant text gives it as text',
  build([{ e: 'sensor.evil' }, { l: [{ k: 'a', n: '[[e|friendly_name]]' }] }, secret], { d: '[[l|pick:k=a,n]]' }, {}),
  { d: '[[secret]]' },
);

// A for_each_from card copy: the card builds each copy from its item's values, as here.
const [item] = resolveRegistryItems(hass, source.f);
check(
  'a for_each_from copy keeps its item text',
  build([...forEachVariables(item, undefined, 0, 1), secret], { type: '[[name]]' }, {}),
  { type: '[[secret]]' },
);

// A nested decluttering card in a copy is handed the value still marked, and reads it as text.
const nested = build(
  [source, secret],
  { d: '[[nest|repeat:f]]' },
  {
    nest: { item: { type: 'custom:decluttering-card-plus', template: 'z', variables: [{ label: '[[name]]' }] } },
  },
);
const handed = nested.d[0].variables[0].label;
check(
  'a nested card in a copy is handed the name still marked',
  [handed.includes('[['), handed.replace(/⁠/g, '')],
  [false, '[[secret]]'],
);
check(
  'and builds it as text',
  deepReplace([...nested.d[0].variables, secret], {}, { t: '[[label]]' }, 'z', hass, true),
  { t: '[[secret]]' },
);

// Other languages stay inert, and ordinary names display as written.
const shown = (name) =>
  build([source, secret, { x: 'X' }], { d: '[[hrow|repeat:f]]' }, row, houseNamed(name)).d[0].type;
check(
  'a copy of a name that opens code keeps a joiner in it, and nothing else',
  ["[[[ return 'JS' ]]]", "{{ 'J' }}", '${x}', '{% if %}'].map(shown),
  [`[[${WJ}[ return 'JS' ]]]`, `{${WJ}{ 'J' }}`, `$${WJ}{x}`, `{${WJ}% if %}`],
);
check('a name with brackets shows exactly as written, no joiner left', shown('Hall [1] {left}'), 'Hall [1] {left}');
check(
  "the template's own button-card code still works in a copy",
  build([source], { d: '[[b|repeat:f]]' }, { b: { item: { name: "[[[ return '[[entity]]' ]]]" } } }),
  { d: [{ name: "[[[ return 'sensor.evil' ]]]" }] },
);

// The debug report's try box reads a copy's values back as text.
const trace = { placeholders: new Map(), dropped: [], warnings: [] };
build([source, secret], { d: '[[hrow|repeat:f]]' }, row, hass, trace);
const values = [...trace.items[0].trace.values].map(([name, value]) => ({ [name]: value }));
const evaluate = (content, onMissing, own) =>
  deepReplace(own, {}, content, undefined, hass, true, onMissing, 0, undefined, undefined, false, {});
check(
  "the report's try box gives a copy's name as text",
  tryInReport({ label: 'copy', evaluate, values: [...values, secret], offered: [] }, '[[name]]', [], false).whole.value,
  '[[secret]]',
);

// show_if reading a filled value (#426) sees the text, not a variable it names.
const read = filledReader({ v: '[[x|repeat:f]]' }, (content) =>
  build([source, secret, { v: '[[x|repeat:f]]' }], content, { x: { item: '[[name]]' } }),
);
check('show_if reads a repeat over the registry as text', read('v'), ['[[secret]]']);

// options_from (#404): the value goes into the card's config, so it stays marked there.
const [option] = optionsFrom({ options_from: source.f, option_value: '[[name]]' }, hass);
check(
  'an options_from value keeps Home Assistant text marked, and its label is written out',
  [option.value.includes('[['), option.value.replace(/⁠/g, ''), option.label],
  [false, '[[secret]]', '[[secret]]'],
);
check(
  'so the card built from the chosen value shows it as text',
  build([{ v: option.value }, secret], { name: '[[v]]' }, {}),
  { name: '[[secret]]' },
);
check(
  'an ordinary options_from option is unchanged',
  optionsFrom({ options_from: source.f, option_value: '[[name]]' }, houseNamed('Hall')),
  [{ value: 'Hall', label: 'Hall' }],
);
