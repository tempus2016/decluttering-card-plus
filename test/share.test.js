/*
 * Unit tests for template sharing in src/share.ts - what an exported template carries
 * with it, and what an imported one has to look like before it is accepted.
 * Run with `npm test`.
 */
const { scanDependencies, buildExport, validateImport } = require('../.test-build/share.js');

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
    console.log(`PASS ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL ${name}\n  got      ${a}\n  expected ${e}`);
  }
}

/* --- scanDependencies: custom cards the recipient has to install --- */

check(
  'a custom card type in the templated card is a dependency',
  scanDependencies({ card: { type: 'custom:mushroom-template-card' } }).customTypes,
  ['custom:mushroom-template-card'],
);

check('built-in card types are not dependencies', scanDependencies({ card: { type: 'entities' } }).customTypes, []);

check(
  'custom types nested inside a stack are found',
  scanDependencies({
    card: { type: 'vertical-stack', cards: [{ type: 'markdown' }, { type: 'custom:button-card' }] },
  }).customTypes,
  ['custom:button-card'],
);

check(
  'our own tags are not dependencies, the recipient already has them',
  scanDependencies({
    type: 'custom:decluttering-template-plus',
    template: 'outer',
    card: {
      type: 'vertical-stack',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'inner' },
        { type: 'custom:decluttering-card', template: 'legacy_inner' },
      ],
    },
  }).customTypes,
  [],
);

check(
  'repeated custom types are listed once, in order',
  scanDependencies({
    card: {
      type: 'vertical-stack',
      cards: [{ type: 'custom:mushroom-chips-card' }, { type: 'custom:button-card' }, { type: 'custom:button-card' }],
    },
  }).customTypes,
  ['custom:button-card', 'custom:mushroom-chips-card'],
);

/* --- scanDependencies: other templates that have to be shared separately --- */

check(
  'a nested decluttering card names the template it needs',
  scanDependencies({ card: { type: 'custom:decluttering-card-plus', template: 'my_base' } }).templateRefs,
  ['my_base'],
);

check(
  'a nested legacy decluttering card names its template too',
  scanDependencies({ card: { type: 'custom:decluttering-card', template: 'legacy_base' } }).templateRefs,
  ['legacy_base'],
);

check(
  "the template's own name is not a reference to itself",
  scanDependencies({
    type: 'custom:decluttering-template-plus',
    template: 'weather_tile',
    card: { type: 'entity', entity: 'sun.sun' },
  }).templateRefs,
  [],
);

check(
  'template references are found in rows, elements and badges as well as cards',
  scanDependencies({
    row: { type: 'custom:decluttering-card-plus', template: 'from_row' },
    element: { type: 'custom:decluttering-card-plus', template: 'from_element' },
    badge: { type: 'custom:decluttering-card-plus', template: 'from_badge' },
  }).templateRefs,
  ['from_badge', 'from_element', 'from_row'],
);

check(
  'a config with nothing to declare has no dependencies',
  scanDependencies({ card: { type: 'entity', entity: 'sun.sun' } }),
  { customTypes: [], templateRefs: [] },
);

check('a missing config is not an error', scanDependencies(undefined), { customTypes: [], templateRefs: [] });

/* --- buildExport --- */

check(
  'the exported payload keeps the card type so it can be pasted into a view',
  Object.keys(
    buildExport({
      card: { type: 'entity' },
      template: 'weather_tile',
      style: '.x {}',
      default: [{ entity: 'weather.home' }],
      type: 'custom:decluttering-template-plus',
    }).payload,
  ),
  ['type', 'template', 'default', 'card', 'style'],
);

check(
  'keys the template does not use are left out of the payload',
  Object.keys(
    buildExport({ type: 'custom:decluttering-template-plus', template: 'a', badge: { type: 'entity' } }).payload,
  ),
  ['type', 'template', 'badge'],
);

check(
  'an export with no dependencies has no notes',
  buildExport({ type: 'custom:decluttering-template-plus', template: 'a', card: { type: 'entity' } }).notes,
  [],
);

check(
  'an export names the custom cards the recipient needs',
  buildExport({ template: 'a', card: { type: 'custom:button-card' } }).notes,
  ['Requires these custom cards: custom:button-card'],
);

check(
  'an export warns that referenced templates are not included',
  buildExport({ template: 'a', card: { type: 'custom:decluttering-card-plus', template: 'my_base' } }).notes,
  ['Uses these other templates, which are not included here: my_base'],
);

/* --- validateImport --- */

check(
  'a well formed template is accepted',
  validateImport({ type: 'custom:decluttering-template-plus', template: 'a', card: { type: 'entity' } }),
  { ok: true, errors: [] },
);

check(
  'a template built around a badge, row or element is accepted too',
  [
    validateImport({ template: 'a', badge: { type: 'entity' } }).ok,
    validateImport({ template: 'a', row: { entity: 'sun.sun' } }).ok,
    validateImport({ template: 'a', element: { type: 'icon' } }).ok,
  ],
  [true, true, true],
);

check('text that is not a mapping is rejected', validateImport('template: a'), {
  ok: false,
  errors: ['This does not look like a template: it should be a block of YAML keys and values.'],
});

check('an empty box is rejected', validateImport(undefined), {
  ok: false,
  errors: ['This does not look like a template: it should be a block of YAML keys and values.'],
});

check('a list is rejected', validateImport([{ template: 'a', card: { type: 'entity' } }]), {
  ok: false,
  errors: ['This does not look like a template: it should be a block of YAML keys and values.'],
});

check('a template with no name is rejected', validateImport({ card: { type: 'entity' } }).errors, [
  'This template has no name: it needs a "template:" line.',
]);

check('a template with nothing to render is rejected', validateImport({ template: 'a' }).errors, [
  'This template defines nothing: it needs one of "card:", "badge:", "row:" or "element:".',
]);

check(
  'a template defining two things at once is rejected',
  validateImport({ template: 'a', card: { type: 'entity' }, badge: { type: 'entity' } }).errors,
  ['This template defines both "card" and "badge": it can only define one of them.'],
);

check('every problem is reported at once, not one at a time', validateImport({}).errors.length, 2);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
