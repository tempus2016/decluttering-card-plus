/*
 * The `yaml` step (#391): a value written out as the YAML lines a dashboard would hold.
 * Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { KNOWN_STEPS } = require('../.test-build/variables.js');

const { check } = require('./check');

const warnings = [];
console.warn = (m) => warnings.push(m);

check(
  'yaml writes a mapping as its YAML lines',
  deepReplace([{ tap: { action: 'toggle', entity: 'light.hall' } }], {}, { content: 'Tap:\n[[tap|yaml]]' }),
  { content: 'Tap:\naction: toggle\nentity: light.hall' },
);

check(
  'yaml writes a list as a YAML list',
  deepReplace([{ rooms: ['Hall', 'Kitchen'] }], {}, { content: '[[rooms|yaml]]' }),
  { content: '- Hall\n- Kitchen' },
);

check(
  'yaml as the whole value is text, not the mapping',
  deepReplace([{ tap: { action: 'toggle' } }], {}, { content: '[[tap|yaml]]' }),
  { content: 'action: toggle' },
);

check(
  'yaml of plain text is that text, quoted only where YAML needs it',
  deepReplace([{ a: 'light.hall' }, { b: 'on' }], {}, { x: '[[a|yaml]]', y: '[[b|yaml]]' }),
  { x: 'light.hall', y: '"on"' },
);

check(
  'yaml writes a mapping from the values it works out to',
  deepReplace(
    [{ name: 'my_camera' }, { map: { entity: 'camera.[[name]]', label: '[[name|upper]]' } }],
    {},
    { content: '[[map|yaml]]' },
  ),
  { content: 'entity: camera.my_camera\nlabel: MY_CAMERA' },
);

check(
  'yaml can be shaped further',
  deepReplace([{ tap: { action: 'toggle' } }], {}, { content: '[[tap|yaml|upper]]' }),
  { content: 'ACTION: TOGGLE' },
);

warnings.length = 0;
check('yaml later in the chain is left as written', deepReplace([{ name: 'Hall' }], {}, { a: '[[name|upper|yaml]]' }), {
  a: '[[name|upper|yaml]]',
});
check(
  'and says yaml has to come first',
  warnings.some((w) => /yaml/.test(w) && /first/.test(w)),
  true,
);
check(
  'with the reason yaml has to come first, not the one for a mapping or a list',
  warnings.some((w) => w.includes("yaml turns the variable's own value into YAML text") && !/only shapes text/.test(w)),
  true,
);

check('yaml with no value stays visible', deepReplace([{ other: 1 }], {}, { a: '[[nope|yaml]]' }), {
  a: '[[nope|yaml]]',
});

check(
  'yaml with a default stands in when nothing is set',
  deepReplace([{ other: 1 }], {}, { a: '[[nope|yaml|default:none]]' }),
  {
    a: 'none',
  },
);

check('the lint knows yaml', KNOWN_STEPS.includes('yaml'), true);
