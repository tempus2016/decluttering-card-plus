/*
 * Unit tests for `debug: console` (discussion #160): what deepReplace notes down while it
 * builds, and how src/trace.ts turns that into what the console is given.
 * Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const {
  newTrace,
  variableRows,
  describeSection,
  headline,
  handedDownNames,
  wantsTrace,
  withTrace,
  TRACE_KEY,
} = require('../.test-build/trace.js');
const { withoutStamps } = require('../.test-build/cycles.js');
const { OWN_DEFAULTS } = require('../.test-build/variables.js');

const { check, report } = require('./harness');

// Unresolved and refused placeholders warn as well, which is not what these tests are about.
console.warn = () => {};

/** Builds with a trace and hands back both, so a test can look at either. */
function traced(variables, template, content) {
  const trace = newTrace();
  const built = deepReplace(variables, template, content, 'test', undefined, false, undefined, 0, trace);
  return { built, trace, placeholders: Object.fromEntries(trace.placeholders) };
}

/* ------------------------------------------------------------------ placeholders */

check(
  'a plain placeholder is noted with the value it became',
  traced([{ name: 'Kitchen' }], {}, { title: '[[name]]' }).placeholders,
  { '[[name]]': 'Kitchen' },
);

check(
  'a transform is noted under the placeholder as written',
  traced([{ name: 'Living Room' }], {}, { title: '[[name|upper]]', id: 'light.[[name|slug]]' }).placeholders,
  { '[[name|upper]]': 'LIVING ROOM', '[[name|slug]]': 'living_room' },
);

check(
  'a whole value keeps its type - a number, a mapping',
  traced([{ size: 3 }, { tap: { action: 'toggle' } }], {}, { columns: '[[size]]', tap_action: '[[tap]]' }).placeholders,
  { '[[size]]': 3, '[[tap]]': { action: 'toggle' } },
);

check(
  'a let value shows its own placeholder resolving, so the chain can be followed',
  traced([{ room: 'Hall' }], { let: { slug: '[[room|slug]]' } }, { entity: 'light.[[slug]]' }).placeholders,
  { '[[slug]]': '[[room|slug]]', '[[room|slug]]': 'hall' },
);

check(
  'a default: stand-in is noted like any other value',
  traced(undefined, {}, { name: '[[room|default:Somewhere]]' }).placeholders,
  { '[[room|default:Somewhere]]': 'Somewhere' },
);

check('a placeholder nothing sets says so', traced([{ other: 1 }], {}, { name: '[[missing]]' }).placeholders, {
  '[[missing]]': 'nothing sets it, so it is left as written',
});

check(
  'an optional placeholder with nothing says it is taken out',
  traced([{ other: 1 }], {}, { name: '[[missing?]]' }).placeholders,
  { '[[missing?]]': 'nothing, so the option is taken out' },
);

check(
  'an escaped placeholder is meant to be there and is not mentioned',
  traced([{ name: 'x' }], {}, { text: '[[!name]]' }).placeholders,
  {},
);

{
  const { placeholders } = traced([{ tap: { action: 'toggle' } }], {}, { name: '[[tap|upper]]' });
  check('a refused transform gives its reason', placeholders['[[tap|upper]]'].startsWith('left as written: '), true);
}

check(
  'tracing does not change what is built',
  traced([{ name: 'Hall' }], { let: { slug: '[[name|slug]]' } }, { a: '[[slug]]', b: '[[x?]]', c: '[[name]] x' }).built,
  deepReplace([{ name: 'Hall' }], { let: { slug: '[[name|slug]]' } }, { a: '[[slug]]', b: '[[x?]]', c: '[[name]] x' }),
);

/* ---------------------------------------------------------------------- dropped */

check(
  'an empty option names the key it took out',
  traced([{ other: 1 }], {}, { type: 'tile', name: '[[title?]]' }).trace.dropped,
  ['name ([[title?]] was empty)'],
);

check(
  'a block left empty is named too, with its path',
  traced([{ other: 1 }], {}, { type: 'tile', features: [{ type: '[[kind?]]' }] }).trace.dropped,
  ['features[0].type ([[kind?]] was empty)', 'features[0] (nothing left in it)', 'features (nothing left in it)'],
);

/* --------------------------------------------------------------------- variables */

check(
  'variables say where each came from, and the first definition is the one listed',
  variableRows([{ room: 'Hall' }, { icon: 'mdi:x' }], {
    let: { slug: '[[room|slug]]' },
    variables: [
      { name: 'icon', default: 'mdi:lamp' },
      { name: 'size', default: 2 },
    ],
    default: [{ room: 'nowhere' }, { colour: 'red' }],
  }),
  [
    { variable: 'slug', value: '[[room|slug]]', from: 'let' },
    { variable: 'room', value: 'Hall', from: 'card' },
    { variable: 'icon', value: 'mdi:x', from: 'card' },
    { variable: 'size', value: 2, from: 'declared' },
    { variable: 'colour', value: 'red', from: 'default' },
  ],
);

check(
  "a repeat's item values are told apart from the card's own",
  variableRows([{ light: 'light.a' }, { room: 'Hall' }], {}, [], ['light']).map((row) => row.from),
  ['repeat', 'card'],
);

check(
  'a handed-down variable is marked as such',
  variableRows([{ room: 'Hall' }, { colour: 'red' }], {}, ['colour']).map((row) => row.from),
  ['card', 'handed_down'],
);

{
  const template = { default: [{ own: 1 }, { shared: 2 }] };
  template[OWN_DEFAULTS] = [{ own: 1 }];
  check(
    "a dashboard's shared value is told apart from the template's own default",
    variableRows(undefined, template).map((row) => row.from),
    ['default', 'dashboard'],
  );
}

check(
  'handed-down names are the inherited ones the card did not set itself',
  handedDownNames({
    inherit_variables: true,
    variables: [{ room: 'Mine' }],
    decluttering_inherited_variables: [{ room: 'Theirs' }, { colour: 'red' }],
  }),
  ['colour'],
);

check('nothing is handed down without inherit_variables', handedDownNames({ variables: [] }), []);

/* ---------------------------------------------------------------------- describe */

{
  const { trace } = traced([{ name: 'Hall' }, { tap: { action: 'toggle' } }], {}, { a: '[[name]]', b: '[[tap]]' });
  const described = describeSection({ variables: variableRows([{ name: 'Hall' }], {}), trace, built: {} });
  check('the variables table is in plain words', described.variables, [
    { variable: 'name', value: 'Hall', from: 'this card' },
  ]);
  check('a mapping is shown as its JSON in the table', described.placeholders[1], {
    placeholder: '[[tap]]',
    became: '{"action":"toggle"}',
  });
}

check(
  'the headline names the template and the time',
  headline({ template: 'room', chain: [], ms: 1.234, sections: [] }),
  'decluttering-card-plus: "room" built in 1.2 ms',
);

check(
  'a nested card says which templates it sits inside',
  headline({ template: 'light', chain: ['page', 'room'], ms: 0.5, sections: [] }),
  'decluttering-card-plus: "light" built in 0.5 ms (inside page › room)',
);

/* ----------------------------------------------------------------- nested cards */

check('debug: console asks for the log', wantsTrace({ debug: 'console' }), true);
check('a card told to by the card around it logs', wantsTrace({ [TRACE_KEY]: true }), true);
check('but its own debug: wins', wantsTrace({ [TRACE_KEY]: true, debug: false }), false);
check('debug: true is the on-card view, not the log', wantsTrace({ debug: true }), false);

{
  const config = {
    type: 'vertical-stack',
    cards: [
      { type: 'custom:decluttering-card-plus', template: 'inner' },
      { type: 'tile', entity: 'sun.sun' },
    ],
  };
  const stamped = withTrace(config);
  check('every nested card of ours is told to log', stamped.cards[0][TRACE_KEY], true);
  check('other cards are left alone', stamped.cards[1][TRACE_KEY], undefined);
  check('the original is not written to', config.cards[0][TRACE_KEY], undefined);
  check('the stamp is not shown in the debug view', withoutStamps(stamped), config);
}

{
  const config = { type: 'tile', entity: 'sun.sun' };
  check('a config with nothing of ours in it is not copied', withTrace(config) === config, true);
}

report();
