/*
 * Unit tests for template sharing in src/share.ts - what an exported template carries
 * with it, and what an imported one has to look like before it is accepted.
 * Run with `npm test`.
 */
const { scanDependencies, buildExport, validateImport, freeName } = require('../.test-build/share.js');

const { check } = require('./check');

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
  'what a template says about itself is exported before what it draws',
  Object.keys(
    buildExport({
      card: { type: 'entity' },
      template: 'weather_tile',
      variables: [{ name: 'entity' }],
      description: 'A tile for the weather',
      type: 'custom:decluttering-template-plus',
    }).payload,
  ),
  ['type', 'template', 'description', 'variables', 'card'],
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
    validateImport({ template: 'a', group: { cards: [] } }).ok,
  ],
  [true, true, true, true],
);

check(
  'a template with both a card and a group is refused',
  validateImport({ template: 'a', card: { type: 'tile' }, group: { cards: [] } }).ok,
  false,
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

/* --- bundles --- */

const KNOWN = {
  inner_tile: { card: { type: 'tile' } },
  wrapper: { card: { type: 'custom:decluttering-card-plus', template: 'inner_tile' } },
};

check(
  'an export bundles the templates it uses, transitively',
  buildExport(
    {
      type: 'custom:decluttering-template-plus',
      template: 'outer',
      card: { type: 'custom:decluttering-card-plus', template: 'wrapper' },
    },
    KNOWN,
  ).payload.includes,
  {
    wrapper: { card: { type: 'custom:decluttering-card-plus', template: 'inner_tile' } },
    inner_tile: { card: { type: 'tile' } },
  },
);

check(
  'a dependency nobody can find is still only a note',
  buildExport(
    {
      type: 'custom:decluttering-template-plus',
      template: 'outer',
      card: { type: 'custom:decluttering-card-plus', template: 'ghost' },
    },
    KNOWN,
  ).payload.includes,
  undefined,
);

check(
  'without the map the export reads as before',
  buildExport({ type: 'custom:decluttering-template-plus', template: 'outer', card: {} }).payload.includes,
  undefined,
);

check(
  'a bundled import is still a valid template',
  validateImport({ template: 'outer', card: {}, includes: { inner: { card: {} } } }).ok,
  true,
);

/* --- freeName --- */

check(
  'every parent in an extends list rides along, and a missing one is named',
  (() => {
    const out = buildExport(
      { template: 'room', extends: ['base', 'with_actions', 'gone'], card: {} },
      { base: { card: { type: 'tile' } }, with_actions: { card: { tap_action: {} } } },
    );
    return [Object.keys(out.payload.includes), out.notes.length];
  })(),
  [['base', 'with_actions'], 1],
);

check('a single extends is a dependency too', scanDependencies({ extends: 'base', card: {} }).templateRefs, ['base']);

check('a free name is its own copy name', freeName('tile', ['other']), 'tile');
check('a taken name counts up from two', freeName('tile', ['tile']), 'tile_2');
check('and keeps counting past taken copies', freeName('tile', ['tile', 'tile_2']), 'tile_3');

/* --- defaults: travels as default:, which every version reads --- */

check(
  'an export folds defaults: into default:',
  buildExport({
    type: 'custom:decluttering-template-plus',
    template: 't',
    card: { type: 'tile' },
    default: [{ colour: 'red' }],
    defaults: { colour: 'amber', size: 'small' },
  }).payload,
  {
    type: 'custom:decluttering-template-plus',
    template: 't',
    default: [{ colour: 'red' }, { size: 'small' }],
    card: { type: 'tile' },
  },
);

/* ------------------------------------------------------------- custom cards that are not installed */

{
  const { missingCustomCards } = require('../.test-build/share.js');
  const installed = new Set(['mushroom-template-card']);
  const isDefined = (tag) => installed.has(tag);
  check(
    'custom cards this browser lacks are named by their element, once each, in order',
    missingCustomCards(
      [
        { card: { type: 'custom:button-card', cards: [{ type: 'custom:mushroom-template-card' }] } },
        { card: { type: 'vertical-stack', cards: [{ type: 'custom:button-card' }, { type: 'custom:apex-charts' }] } },
      ],
      isDefined,
    ),
    ['apex-charts', 'button-card'],
  );

  check(
    'this card and Home Assistant own cards never count',
    missingCustomCards(
      [{ card: { type: 'tile', cards: [{ type: 'custom:decluttering-card-plus', template: 'x' }] } }],
      () => false,
    ),
    [],
  );
}

/* ------------------------------------------------------------- the source: stamp stays with the install */

{
  const { withoutSource, withoutSources } = require('../.test-build/share.js');

  check(
    'an export leaves the source: stamp behind',
    buildExport({ template: 't', card: {}, source: { discussion: 7, updated: '2026-01-01', author: 'a' } }).payload,
    { template: 't', card: {} },
  );

  check(
    'and so do the templates it bundles',
    buildExport(
      { template: 't', card: { type: 'custom:decluttering-card-plus', template: 'inner' } },
      {
        inner: { card: { type: 'tile' }, source: { discussion: 7 } },
      },
    ).payload.includes,
    { inner: { card: { type: 'tile' } } },
  );

  check(
    'a pasted stamp comes off the template and off every include',
    withoutSources({
      template: 't',
      card: {},
      source: { discussion: 4242, updated: '2000-01-01' },
      includes: {
        a: { card: {}, source: { discussion: 4242 } },
        b: { card: {} },
      },
    }),
    { template: 't', card: {}, includes: { a: { card: {} }, b: { card: {} } } },
  );

  check(
    'a paste without a stamp is left exactly as it was',
    withoutSources({ template: 't', card: {}, includes: { a: { card: {} } } }),
    { template: 't', card: {}, includes: { a: { card: {} } } },
  );

  check(
    'something that is not a template passes through',
    [withoutSource(null), withoutSource('x'), withoutSources(undefined)],
    [null, 'x', undefined],
  );

  check(
    'the pasted value itself is not changed',
    (() => {
      const pasted = { template: 't', card: {}, source: { discussion: 1 }, includes: { a: { card: {}, source: {} } } };
      withoutSources(pasted);
      return [pasted.source, pasted.includes.a.source];
    })(),
    [{ discussion: 1 }, {}],
  );
}
