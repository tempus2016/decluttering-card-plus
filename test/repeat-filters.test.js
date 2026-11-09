/*
 * #429, the rest: a condition after `repeat:` and `with:` read against each copy, `|entries`
 * and `|registry` saying which way a mapping is read, and `to_list` / `to_map`.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;
const {
  applyTransform,
  toList,
  toMap,
  convertArgs,
  splitCopyConditions,
  KNOWN_STEPS,
  KNOWN_PARAM_STEPS,
} = require('../.test-build/variables.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { structureNames } = require('../.test-build/structure.js');
const { reportOutline, outlineLines } = require('../.test-build/report-outline.js');
const { newTrace } = require('../.test-build/trace.js');
const { argumentValues } = require('../.test-build/code-hooks.js');

const said = [];
const realWarn = console.warn;
console.warn = (...args) => said.push(args.join(' '));

const hass = {
  states: {
    'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen' } },
    'light.hall': { entity_id: 'light.hall', state: 'off', attributes: { friendly_name: 'Hall' } },
  },
  entities: {
    'light.kitchen': { entity_id: 'light.kitchen', area_id: 'kitchen' },
    'light.hall': { entity_id: 'light.hall', area_id: 'hall' },
  },
  devices: {},
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen' }, hall: { area_id: 'hall', name: 'Hall' } },
  floors: {},
  labels: {},
};

const myList = [
  { name: 'foo', thing: 1, enabled: false },
  { name: 'bar', thing: 2, enabled: true },
  { name: 'sna', thing: 3, enabled: true },
];
const myMapping = { name: 'blah', thing: 4, enabled: false };
const extras = {
  itemTemplates: {
    my_template: { item: '[[name]] ([[thing]])' },
    // The user's second example: a flag worked out in the item template's own defaults.
    my_item_template: {
      default: [{ true_val: true }, { other_enabled: '[[true_val|if:thing=2]]' }],
      item: '[[name]] ([[thing]])',
    },
    row: { item: { name: '[[name]]', at: '[[index]]/[[count]]', first: '[[first]]', last: '[[last]]' } },
    entry: { item: '[[key]]=[[value]]' },
    det: { item: { type: '[[type]]', entity: '[[entity]]' } },
    zones: { item: ['[[name]]-a', '[[name]]-b'] },
    light_row: { item: '[[entity]]' },
  },
};
const base = [{ my_list: myList }, { my_mapping: myMapping }];
const run = (content, vars = base, trace, h) =>
  deepReplace(vars, {}, content, 't', h, true, undefined, 0, trace, undefined, false, extras);

// --- 1. conditions after repeat: and with: ---------------------------------------------------

check(
  'repeat:|if: keeps the copies whose entry is enabled (#429)',
  run({ out: '[[my_template|repeat:my_list|if:enabled]]' }),
  { out: ['bar (2)', 'sna (3)'] },
);
check(
  'item.enabled reads the same field, as the user wrote it',
  run({ out: '[[my_template|repeat:my_list|if:item.enabled]]' }),
  { out: ['bar (2)', 'sna (3)'] },
);
check(
  'unless: and comparisons work as if: does elsewhere',
  run({
    a: '[[my_template|repeat:my_list|unless:enabled]]',
    b: '[[my_template|repeat:my_list|if:thing=2]]',
    c: '[[my_template|repeat:my_list|if:thing!=2]]',
    d: '[[my_template|repeat:my_list|if:!enabled]]',
    e: '[[my_template|repeat:my_list|if:name="sna"]]',
  }),
  { a: ['foo (1)'], b: ['bar (2)'], c: ['foo (1)', 'sna (3)'], d: ['foo (1)'], e: ['sna (3)'] },
);
check(
  'several conditions chain, all of them must hold',
  run({ out: '[[my_template|repeat:my_list|if:enabled|unless:thing=3]]' }),
  { out: ['bar (2)'] },
);
check(
  'a condition on a value the item template works out in its defaults',
  run({
    a: '[[my_item_template|repeat:my_list|if:other_enabled]]',
    b: '[[my_item_template|repeat:my_list|if:item.other_enabled]]',
  }),
  { a: ['bar (2)'], b: ['bar (2)'] },
);
check(
  'the copies kept count among themselves: index, count, first and last',
  run({ out: '[[row|repeat:my_list|if:enabled]]' }),
  {
    out: [
      { name: 'bar', at: '1/2', first: true, last: false },
      { name: 'sna', at: '2/2', first: false, last: true },
    ],
  },
);
check(
  'a condition can read the card’s own values too, as before',
  run({ a: '[[my_template|repeat:my_list|if:show]]', b: '[[my_template|repeat:my_list|if:show]]' }, [
    ...base,
    { show: true },
  ]).a,
  ['foo (1)', 'bar (2)', 'sna (3)'],
);
check(
  'and an outer value that says no leaves no copies',
  run({ out: '[[my_template|repeat:my_list|if:show]]', n: 1 }, [...base, { show: false }]),
  { out: [], n: 1 },
);
check(
  'a condition before the repeat still gates the whole of it',
  run({ a: '[[my_template|if:show|repeat:my_list]]', b: '[[my_template|if:show|repeat:my_list?]]', n: 1 }, [
    ...base,
    { show: false },
  ]),
  { a: '[[my_template|if:show|repeat:my_list]]', n: 1 },
);
check(
  'no copies left inside a list splices to nothing',
  run({ cards: ['first', '[[my_template|repeat:my_list|if:thing=9]]', 'last'] }),
  { cards: ['first', 'last'] },
);
check('and an optional one is the same', run({ cards: ['[[my_template|repeat:my_list|if:thing=9?]]', 'last'] }), {
  cards: ['last'],
});
check(
  'a repeat over a mapping filters on its entries',
  run({ out: '[[entry|repeat:m|if:value=on]]' }, [{ m: { a: 'on', b: 'off', c: 'on' } }]),
  { out: ['a=on', 'c=on'] },
);
check(
  'a list of plain values filters on item',
  run({ out: '[[light_row|repeat:ids|if:item!=light.hall]]' }, [{ ids: ['light.kitchen', 'light.hall'] }]),
  { out: ['light.kitchen'] },
);

check(
  '|flat works either side of the conditions',
  run({
    a: '[[zones|repeat:my_list|if:enabled|flat]]',
    b: '[[zones|repeat:my_list|flat|if:enabled]]',
    c: '[[zones|repeat:my_list|if:enabled]]',
  }),
  {
    a: ['bar-a', 'bar-b', 'sna-a', 'sna-b'],
    b: ['bar-a', 'bar-b', 'sna-a', 'sna-b'],
    c: [
      ['bar-a', 'bar-b'],
      ['sna-a', 'sna-b'],
    ],
  },
);

check(
  'with:|if: fills when its own condition holds',
  run({ out: '[[my_template|with:m|if:enabled]]' }, [{ m: { ...myMapping, enabled: true } }]),
  { out: 'blah (4)' },
);
check(
  'with:|if: on the user’s mapping drops out when optional',
  run({ out: '[[my_template|with:my_mapping|if:item.enabled?]]', n: 1 }),
  { n: 1 },
);
said.length = 0;
check(
  'and is left standing when not, saying the condition did not hold',
  deepReplace(
    base,
    {},
    { out: '[[my_template|with:my_mapping|if:enabled]]' },
    't',
    undefined,
    false,
    undefined,
    0,
    undefined,
    undefined,
    false,
    extras,
  ),
  { out: '[[my_template|with:my_mapping|if:enabled]]' },
);
check(
  'the warning names the condition',
  said.some((m) => m.includes('its if: or unless: condition does not hold')),
  true,
);
check(
  'with:a=1|if:a=1 reads its own pairs',
  run({ a: '[[my_template|with:name=x,thing=1|if:thing=1]]', b: '[[my_template|with:name=x,thing=1|if:thing=2?]]' }),
  { a: 'x (1)' },
);
check(
  'a condition inside an item list keeps the list shape',
  run({ cards: ['[[my_template|with:my_mapping|unless:enabled]]', '[[my_template|with:my_mapping|if:enabled?]]'] }),
  { cards: ['blah (4)'] },
);

said.length = 0;
check(
  'any other step after repeat: is still refused',
  deepReplace(
    base,
    {},
    { out: '[[my_template|repeat:my_list|upper]]' },
    't',
    undefined,
    false,
    undefined,
    0,
    undefined,
    undefined,
    false,
    extras,
  ),
  { out: '[[my_template|repeat:my_list|upper]]' },
);
check(
  'with the old warning',
  said.some((m) => m.includes('repeat: can only be followed by if:, unless:, flat, entries or registry')),
  true,
);
said.length = 0;
deepReplace(
  base,
  {},
  { out: '[[my_template|with:my_mapping|upper]]' },
  't',
  undefined,
  false,
  undefined,
  0,
  undefined,
  undefined,
  false,
  extras,
);
check(
  'a with: followed by another step names only if: and unless:',
  said.some((m) => m.includes('with: can only be followed by if: or unless:')),
  true,
);
check(
  'a repeat whose source is not known here still offers key and value',
  ['key', 'value'].every((n) => structureNames({ card: { a: '[[entry|repeat:somewhere]]' } }).includes(n)),
  true,
);
said.length = 0;
check(
  'flat, entries and registry after a with: are refused',
  deepReplace(
    [{ m: { name: 'n', thing: 1 } }],
    {},
    { a: '[[my_template|with:m|flat]]', b: '[[my_template|with:m|entries]]' },
    't',
    undefined,
    false,
    undefined,
    0,
    undefined,
    undefined,
    false,
    extras,
  ),
  { a: '[[my_template|with:m|flat]]', b: '[[my_template|with:m|entries]]' },
);
check(
  'saying where they belong',
  [
    said.some((m) => m.includes('flat only works straight after a repeat:')),
    said.some((m) => m.includes('entries only works')),
  ],
  [true, true],
);

check(
  'splitCopyConditions keeps the gate before the step and the rest after',
  [
    splitCopyConditions('if:a|repeat:l|if:b|flat'),
    splitCopyConditions('with:m|unless:c'),
    splitCopyConditions('upper|if:a'),
    splitCopyConditions('if:a|slot'),
  ],
  [
    { gate: 'if:a', rest: 'repeat:l|if:b|flat' },
    { gate: '', rest: 'with:m|unless:c' },
    { gate: 'if:a', rest: 'upper' },
    { gate: 'if:a', rest: 'slot' },
  ],
);

// Trace and outline.
{
  const trace = newTrace();
  run({ out: '[[my_template|repeat:my_list|if:enabled]]' }, base, trace);
  check(
    'the trace counts the entries the condition left out',
    trace.dropped.filter((d) => d.includes('left out 1 of 3 entries') && d.includes('if:enabled')).length,
    1,
  );
  check(
    'and notes which one, for the outline',
    (trace.skipped ?? []).map((s) => [s.reason, s.copy, s.condition]),
    [['filtered', { number: 1, count: 3 }, 'if:enabled']],
  );
  const outline = reportOutline([
    {
      label: '"card"',
      chain: [],
      ms: 1,
      template: { name: 'card', config: { card: {} } },
      sections: [{ variables: [], trace, built: {} }],
    },
  ]);
  const lines = outlineLines(outline).map(({ node, depth }) => [depth, node.name, node.copy ?? '', node.skipped ?? '']);
  check('the outline lists the left-out entry among the copies', lines, [
    [0, 'card', '', ''],
    [1, 'my_template', '', ''],
    [2, 'bar', '1/2', ''],
    [2, 'sna', '2/2', ''],
    [2, 'my_template', '1/3', 'left out: if:enabled did not hold'],
  ]);
  const none = newTrace();
  run({ out: '[[my_template|repeat:my_list|if:thing=9]]' }, base, none);
  check('with every entry left out the outline still lists them', none.skipped.length, 3);
  const closed = newTrace();
  run({ out: '[[my_template|with:my_mapping|if:enabled?]]' }, base, closed);
  check(
    'a with: its own condition closed is noted as not built',
    closed.skipped.map((s) => [s.step, s.reason, s.condition]),
    [['with', 'closed', 'if:enabled']],
  );
}

// --- 2. entries and registry ------------------------------------------------------------------

const mixed = { area: 'Kitchen', name: 'Lights', icon: 'mdi:lamp' };
check(
  'a mapping with a registry key is still read as a source by default (backward compatible)',
  run({ out: '[[light_row|repeat:src]]' }, [{ src: { area: 'kitchen' } }], undefined, hass),
  { out: ['light.kitchen'] },
);
check(
  '|entries reads the same mapping entry by entry',
  run({ out: '[[entry|repeat:src|entries]]' }, [{ src: mixed }], undefined, hass),
  { out: ['area=Kitchen', 'name=Lights', 'icon=mdi:lamp'] },
);
check(
  '|registry reads a mapping as a source',
  run({ out: '[[light_row|repeat:src|registry]]' }, [{ src: { area: 'hall' } }], undefined, hass),
  { out: ['light.hall'] },
);
check(
  '|entries combines with a condition and flat',
  run({ out: '[[entry|repeat:src|entries|unless:key=name]]' }, [{ src: mixed }], undefined, hass),
  { out: ['area=Kitchen', 'icon=mdi:lamp'] },
);
check('|entries on a list changes nothing', run({ out: '[[my_template|repeat:my_list|entries]]' }), {
  out: ['foo (1)', 'bar (2)', 'sna (3)'],
});
check(
  'a bare repeat over a for_each mapping makes one copy per key with |entries',
  deepReplace(
    [],
    {},
    { a: '[[own|repeat|entries]]', b: '[[own|repeat]]' },
    't',
    undefined,
    true,
    undefined,
    0,
    undefined,
    undefined,
    false,
    {
      itemTemplates: { own: { for_each: { a: 1, b: 2 }, item: '[[key]][[value]]' } },
    },
  ),
  { a: ['a1', 'b2'], b: ['[[key]][[value]]'] },
);
said.length = 0;
check(
  'entries and registry together are refused',
  deepReplace(
    [{ src: mixed }],
    {},
    { out: '[[entry|repeat:src|entries|registry]]' },
    't',
    hass,
    false,
    undefined,
    0,
    undefined,
    undefined,
    false,
    extras,
  ),
  { out: '[[entry|repeat:src|entries|registry]]' },
);
check(
  'saying it takes one or the other',
  said.some((m) => m.includes('entries or registry, not both')),
  true,
);
said.length = 0;
check(
  'entries anywhere but after a repeat is refused',
  deepReplace([{ src: mixed }], {}, { out: '[[src|entries]]' }, 't', hass, false),
  { out: '[[src|entries]]' },
);
check(
  'with its own words',
  said.some((m) => m.includes('entries only works straight after a repeat:')),
  true,
);

check(
  'lint warns when a repeat source mixes registry keys with others',
  lintTemplate({ default: [{ src: mixed }], card: { cards: '[[entry|repeat:src]]' } })
    .filter((f) => f.key === 'lint.mixed_repeat_source')
    .map((f) => f.params),
  [{ placeholder: '[[entry|repeat:src]]', name: 'src', filters: 'area', others: 'name, icon' }],
);
check(
  'but not once |entries or |registry says which, nor for a real source',
  lintTemplate({
    default: [{ src: mixed }, { real: { area: 'kitchen', sort: 'name', limit: 3 } }],
    card: { a: '[[entry|repeat:src|entries]]', b: '[[entry|repeat:src|registry]]', c: '[[entry|repeat:real]]' },
  }).filter((f) => f.key === 'lint.mixed_repeat_source'),
  [],
);
check(
  'lint knows the new steps and reads no copy condition as the template’s own variable',
  lintTemplate({
    default: [{ src: mixed }, { m: { a: 1 } }],
    card: {
      a: '[[entry|repeat:src|entries|if:enabled|flat]]',
      b: '[[entry|with:m|unless:item.hidden]]',
      c: '[[m|to_list:key=name,value=icon|count]]',
      d: '[[src|to_map:key=name]]',
    },
  }).map((f) => `${f.key} ${JSON.stringify(f.params)}`),
  ['lint.undeclared {"names":"entry"}'],
);
check(
  'a condition before the repeat is still checked',
  lintTemplate({ default: [{ src: [] }], card: { a: '[[entry|if:nope|repeat:src]]' } }).some((f) =>
    JSON.stringify(f.params).includes('nope'),
  ),
  true,
);
check(
  'structureNames reads a repeat with conditions and entries',
  ['key', 'value', 'index'].every((n) =>
    structureNames({ default: [{ src: mixed }], card: { a: '[[entry|repeat:src|entries|if:x]]' } }).includes(n),
  ),
  true,
);
check(
  'the steps are known, and autocomplete offers arguments',
  [
    ['entries', 'registry', 'to_list', 'to_map'].every((s) => KNOWN_STEPS.includes(s)),
    ['to_list', 'to_map'].every((s) => KNOWN_PARAM_STEPS.includes(s)),
    argumentValues('to_list').length > 0,
    argumentValues('to_map').length > 0,
  ],
  [true, true, true, true],
);

// --- 3. to_list and to_map --------------------------------------------------------------------

const detections = { dog: 'binary_sensor.a', cat: 'binary_sensor.b' };
check(
  'convertArgs reads key= and value=, with defaults',
  [convertArgs('key=type,value=entity'), convertArgs(''), convertArgs('value="v"')],
  [
    { key: 'type', value: 'entity' },
    { key: 'key', value: undefined },
    { key: 'key', value: 'v' },
  ],
);
check('toList: the user’s example (#429)', toList(detections, 'key=type,value=entity'), [
  { type: 'dog', entity: 'binary_sensor.a' },
  { type: 'cat', entity: 'binary_sensor.b' },
]);
check('toList: bare gives key and value', toList({ a: 1 }), [{ key: 'a', value: 1 }]);
check(
  'toList: a mapping value has its fields merged in with key= only, the key winning',
  toList({ dog: { icon: 'mdi:dog', type: 'x' }, cat: 'plain' }, 'key=type'),
  [
    { type: 'dog', icon: 'mdi:dog' },
    { type: 'cat', value: 'plain' },
  ],
);
check(
  'toList: with value= a mapping value goes under it whole',
  toList({ dog: { icon: 'mdi:dog' } }, 'key=type,value=data'),
  [{ type: 'dog', data: { icon: 'mdi:dog' } }],
);
check(
  'toList: a list is left as it is, text is no list',
  [toList([1, 2]), toList('x'), toList(undefined)],
  [[1, 2], undefined, undefined],
);
const proto = toList(JSON.parse('{"__proto__": {"polluted": 1}}'));
check(
  'toList: a __proto__ key stays a key',
  [Object.getPrototypeOf(proto[0]) === Object.prototype, proto[0].polluted, {}.polluted],
  [true, 1, undefined],
);

const iconMap = [
  { name: 'dog', icon: 'mdi:dog' },
  { name: 'cat', icon: 'mdi:cat' },
  { icon: 'mdi:x' },
  { name: 'dog', icon: 'mdi:dog2' },
];
check('toMap: the original request', toMap(iconMap, 'key=name,value=icon'), { dog: 'mdi:dog2', cat: 'mdi:cat' });
check('toMap: without value= keeps the rest of the entry', toMap(iconMap.slice(0, 2), 'key=name'), {
  dog: { icon: 'mdi:dog' },
  cat: { icon: 'mdi:cat' },
});
check('toMap: a mapping is left as it is, text is none', [toMap({ a: 1 }), toMap('x')], [{ a: 1 }, undefined]);
check(
  'toMap: a __proto__ name stays a key',
  Object.getPrototypeOf(toMap([{ key: '__proto__', value: 1 }])) === Object.prototype,
  true,
);

const vars3 = [{ detections }, { icon_map: iconMap.slice(0, 2) }, { camera_name: 'porch' }];
check('to_list as a whole value is a real list', run({ out: '[[detections|to_list:key=type,value=entity]]' }, vars3), {
  out: [
    { type: 'dog', entity: 'binary_sensor.a' },
    { type: 'cat', entity: 'binary_sensor.b' },
  ],
});
check('to_map as a whole value is a real mapping', run({ out: '[[icon_map|to_map:key=name,value=icon]]' }, vars3), {
  out: { dog: 'mdi:dog', cat: 'mdi:cat' },
});
check(
  'the list steps read what to_list made',
  run(
    {
      n: '[[detections|to_list:key=type,value=entity|count]]',
      first: '[[detections|to_list:key=type,value=entity|first]]',
      picked: '[[detections|to_list:key=type,value=entity|pick:type=cat,entity]]',
      joined: 'in text: [[detections|to_list|count]] of them',
      contains: '[[icon_map|to_map:key=name,value=icon|count]]',
    },
    vars3,
  ),
  {
    n: 2,
    first: '{"type":"dog","entity":"binary_sensor.a"}',
    picked: 'binary_sensor.b',
    joined: 'in text: 2 of them',
    contains: 2,
  },
);
check(
  'a variable written as to_list is a repeat source (the user’s detect_list)',
  run({ out: '[[det|repeat:detect_list]]' }, [
    { detect_list: '[[detections|to_list:key=type,value=entity]]' },
    ...vars3,
  ]),
  {
    out: [
      { type: 'dog', entity: 'binary_sensor.a' },
      { type: 'cat', entity: 'binary_sensor.b' },
    ],
  },
);
check(
  'and filters too',
  run({ out: '[[det|repeat:detect_list|if:type=cat]]' }, [
    { detect_list: '[[detections|to_list:key=type,value=entity]]' },
    ...vars3,
  ]),
  { out: [{ type: 'cat', entity: 'binary_sensor.b' }] },
);
check(
  'a variable written as to_map comes out as the mapping',
  run({ out: '[[icon_lookup]]' }, [{ icon_lookup: '[[icon_map|to_map:key=name,value=icon]]' }, ...vars3]),
  { out: { dog: 'mdi:dog', cat: 'mdi:cat' } },
);
check(
  'an empty or unset source is a gap a default fills, and the default stays text',
  run(
    {
      a: '[[nothing|to_list|default:none]]',
      b: '[[empty|to_list|count]]',
      c: '[[empty|to_map|default:x]]',
    },
    [{ empty: {} }],
  ),
  { a: ['none'], b: 0, c: 'x' },
);
check('to_list on text gives nothing to stand in for', applyTransform('to_list|default:none', 'just text'), '["none"]');
check(
  'to_map after to_list goes back to the mapping',
  run({ out: '[[detections|to_list:key=t,value=e|to_map:key=t,value=e]]' }, vars3),
  { out: detections },
);

// --- backward compatibility ---------------------------------------------------------------------
check(
  'a plain repeat and a plain with: are unchanged',
  run({
    a: '[[my_template|repeat:my_list]]',
    b: '[[my_template|with:my_mapping]]',
    c: '[[zones|repeat:my_list|flat]]',
  }),
  {
    a: ['foo (1)', 'bar (2)', 'sna (3)'],
    b: 'blah (4)',
    c: ['foo-a', 'foo-b', 'bar-a', 'bar-b', 'sna-a', 'sna-b'],
  },
);
check(
  'a gated item template still decides copy by copy (#235)',
  deepReplace(
    base,
    {},
    { out: '[[gated|repeat:my_list]]' },
    't',
    undefined,
    true,
    undefined,
    0,
    undefined,
    undefined,
    false,
    {
      itemTemplates: { gated: { default: [{ label: '[[name]] ([[thing]])' }], item: '[[label|if:enabled?]]' } },
    },
  ),
  { out: ['bar (2)', 'sna (3)'] },
);

console.warn = realWarn;

// r5: `|registry` on a mapping with none of a registry source's keys says so.
{
  const said = [];
  const before = console.warn;
  console.warn = (m) => said.push(m);
  const out = deepReplace(
    [{ cars: { car: 'sun.sun', van: 'sun.sun' } }],
    {},
    { out: '[[row|repeat:cars|registry]]' },
    't',
    { states: {} },
    false,
    undefined,
    0,
    undefined,
    undefined,
    false,
    { itemTemplates: { row: { item: '[[key]]' } } },
  );
  console.warn = before;
  check('a |registry over a plain mapping is left visible', out, { out: '[[row|repeat:cars|registry]]' });
  check(
    'and says it has no registry keys',
    said.some((m) => m.includes('cars has none of a registry source')),
    true,
  );
}

// r5: the report records a repeat as the list it laid out, not the wrapper it travels in.
{
  const { newTrace } = require('../.test-build/trace.js');
  const trace = newTrace();
  deepReplace(
    [{ list: [{ n: 'a' }, { n: 'b' }] }],
    {},
    { rows: ['[[row|repeat:list]]'] },
    't',
    { states: {} },
    true,
    undefined,
    0,
    trace,
    undefined,
    false,
    { itemTemplates: { row: { item: { name: '[[n]]' } } } },
  );
  check('the repeat is recorded as its list', trace.placeholders.get('[[row|repeat:list]]'), [
    { name: 'a' },
    { name: 'b' },
  ]);
}
