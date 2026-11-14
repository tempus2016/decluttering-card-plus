/*
 * The work a build does once per value rather than once per nested build (#456): dotted
 * names under a mapping, what the scans find in an object, and the report's long-run cut.
 * Each is checked against what the old, uncached way gave, and a dashboard with many item
 * templates is built twice to show nothing kept from the first build leaks into the second.
 * Run with `npm test`.
 */
const { check } = require('./check.js');
const { placeholderJson, findAcross } = require('../.test-build/placeholder-text.js');
const { normaliseVariables, variableValues, addVariableValues } = require('../.test-build/variables.js');
const { redact } = require('../.test-build/report.js');
const deepReplace = require('../.test-build/deep-replace.js').default;

// The old variableValues: every entry normalised into a list, the first of each name kept.
const oldValues = (variables) => {
  const map = Object.create(null);
  for (const entry of normaliseVariables(variables)) {
    const key = Object.keys(entry)[0];
    if (key !== undefined && !(key in map)) map[key] = entry[key];
  }
  return map;
};

const room = { light: 'light.kitchen', sensor: { entity: 'sensor.t', deep: { deeper: { deepest: 1 } } } };
const chosen = { active_choice: 'b', a: 'one', b: { x: 'two' } };
const variables = [
  { room },
  { 'room.light': 'light.override' },
  { picked: chosen },
  { list: [{ a: 1 }] },
  { room: 'ignored, the first room wins' },
  { two: 'a', three: { inner: 'b' } },
  null,
  ['not an entry'],
];

check('variableValues gives what the old way gave (#456)', variableValues(variables), oldValues(variables));
check(
  'variableValues gives the same again from the same objects (#456)',
  variableValues(variables),
  oldValues(variables),
);
check('variableValues reads a single mapping as before (#456)', variableValues(room), oldValues(room));
check(
  'the same contents in a new object read the same (#456)',
  variableValues([{ room: JSON.parse(JSON.stringify(room)) }]),
  oldValues([{ room }]),
);
check(
  'normaliseVariables still lists the dotted names in order (#456)',
  normaliseVariables([{ picked: chosen }]).map((entry) => Object.keys(entry)[0]),
  ['picked', 'picked.active_choice', 'picked.a', 'picked.b', 'picked.b.x', 'picked.chosen', 'picked.chosen.x'],
);

{
  const map = variableValues([{ a: 'first' }]);
  addVariableValues(map, { a: 'later' });
  addVariableValues(map, { b: { c: 'd' } });
  check(
    'addVariableValues reads one more entry as if it ended the list (#456)',
    map,
    oldValues([{ a: 'first' }, { a: 'later' }, { b: { c: 'd' } }]),
  );
}

// The old scans: one regex over the JSON of [content, variables].
const DOTTED_ASK = /(?:\[\[!?|\|(?:if:!?|or:))([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/g;
const oldAsks = (content, vars) => {
  const text = placeholderJson([content, vars]);
  const out = [];
  for (let match = DOTTED_ASK.exec(text); match !== null; match = DOTTED_ASK.exec(text)) {
    out.push(`${match[1]}.${match[2]}`);
  }
  DOTTED_ASK.lastIndex = 0;
  return out;
};
const content = {
  a: '[[thing.ent_exists]]',
  b: 'x [[cam.name|upper]] y [[!esc.aped]]',
  c: [['[[nested.list]]']],
  d: '[[flag|if:other.on|or:fallback.value]]',
};
const vars = [
  { thing: '[[camera_entry|with:entity=light.a]]' },
  { body: { deep: ['[[row.title]]', { e: 'no dots here [[plain]]' }] } },
  { '[[key.name]]': 'a name with brackets' },
  { n: 3 },
  { quote: 'say "[[q.uoted]]"' },
];
check(
  'findAcross finds what one scan of the whole JSON found (#456)',
  findAcross(content, vars, DOTTED_ASK),
  oldAsks(content, vars),
);
check(
  'findAcross finds the same again from the same objects (#456)',
  findAcross(content, vars, DOTTED_ASK),
  oldAsks(content, vars),
);
const NAME_USE = /\[\[__(?:parent_|root_)?template_(?:name|path)__/;
check(
  'findAcross with a pattern that has no groups gives the matches (#456)',
  findAcross({ t: '[[__template_name__]]' }, [], NAME_USE),
  ['[[__template_name__'],
);
check('findAcross finds nothing where there is nothing (#456)', findAcross({ t: 'plain' }, [{ a: 'b' }], NAME_USE), []);

// The long-run cut: only a word longer than the limit is cut, and nothing else changes.
const long = 'x'.repeat(5000);
const cut = redact(`before ${long} after`);
check(
  'a run past the limit is still cut to its ends (#456)',
  [cut.startsWith('before x'), cut.includes(' … '), cut.endsWith('x after'), cut.length < 4200],
  [true, true, true, true],
);
const many = Array.from({ length: 50 }, () => 'y'.repeat(3000)).join(' ');
check('long text with no run past the limit is left alone (#456)', redact(many) === many, true);

// A dashboard with many item templates: the scope every nested build reads is large, and
// what the first build kept must not change what a second build with other values gives.
{
  const itemTemplates = {};
  for (let index = 0; index < 40; index += 1) {
    itemTemplates[`filler_${index}`] = {
      item: { type: 'custom:thing', name: `[[name]] ${index}`, options: { a: { b: { c: index } } } },
    };
  }
  itemTemplates.camera_entry = {
    default: { live_provider: 'go2rtc', ent_exists: 'yes' },
    item: { camera_entity: '[[camera_entity]]', live_provider: '[[live_provider]]' },
  };
  const build = (entity) =>
    deepReplace(
      [{ cam: `[[camera_entry|with:camera_entity=${entity}]]` }, { label: '[[__template_name__]]' }],
      {},
      { camera: '[[cam]]', exists: '[[cam.ent_exists]]', label: '[[label]]', provider: '[[cam.live_provider]]' },
      'tpl',
      undefined,
      true,
      undefined,
      0,
      undefined,
      undefined,
      false,
      { itemTemplates },
    );
  const first = build('camera.one');
  const second = build('camera.two');
  check('a build among many item templates fills as before (#456)', first, {
    camera: { camera_entity: 'camera.one', live_provider: 'go2rtc' },
    exists: 'yes',
    label: 'tpl',
    provider: 'go2rtc',
  });
  check("a second build is not given the first one's values (#456)", second.camera.camera_entity, 'camera.two');
}
