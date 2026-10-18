/*
 * Unit tests for src/rebuild.ts and the `|state` resolver it allows - `rebuild_on:`, the
 * one place a card reads live state. Run with `npm test`.
 */
const {
  rebuildOnEntities,
  rebuildOnRejects,
  stateSnapshot,
  statesMoved,
  REBUILD_DEBOUNCE_MS,
} = require('../.test-build/rebuild.js');
const {
  withStateScope,
  stateAllowed,
  stateScope,
  unlistedState,
  applyTransform,
} = require('../.test-build/variables.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { checkDashboard } = require('../.test-build/templates.js');

const { check, report } = require('./harness');

const warnings = [];
console.warn = (m) => warnings.push(m);

const hass = {
  states: {
    'input_select.layout': { state: 'compact', attributes: { friendly_name: 'Layout' } },
    'light.kitchen': { state: 'on', attributes: {} },
  },
  entities: {},
};

/* ------------------------------------------------------------- what is listed */

check('one entity written on its own is a list of one', rebuildOnEntities('input_select.layout'), [
  'input_select.layout',
]);

check('a list is read in order, repeats and blanks dropped', rebuildOnEntities([' light.a ', 'light.b', 'light.a']), [
  'light.a',
  'light.b',
]);

check('anything not shaped like an entity id is not watched', rebuildOnEntities(['layout', 3, null, 'light.a']), [
  'light.a',
]);

check('nothing listed is nothing watched', [rebuildOnEntities(undefined), rebuildOnEntities(null)], [[], []]);

check('what was not an entity id is named, so the card can say so', rebuildOnRejects(['layout', 3, 'light.a']), [
  'layout',
  '3',
]);

check('a burst of changes is waited out for about a quarter second', REBUILD_DEBOUNCE_MS, 250);

/* ------------------------------------------------------------- when it moves */

check('a snapshot is each state in order, missing as nothing', stateSnapshot(hass, ['light.kitchen', 'light.gone']), [
  'on',
  undefined,
]);

check('the same states have not moved', statesMoved(['on', 'compact'], ['on', 'compact']), false);

check('one state changing has', statesMoved(['on', 'compact'], ['off', 'compact']), true);

check('an entity appearing has', statesMoved([undefined], ['on']), true);

check('no snapshot yet counts as moved', statesMoved(undefined, ['on']), true);

check('a different list counts as moved', statesMoved(['on'], ['on', 'off']), true);

/* ------------------------------------------------------------- the scope */

const scoped = withStateScope(hass, ['input_select.layout']);

check('a scoped hass still reads everything hass has', scoped.states['light.kitchen'].state, 'on');

check('it allows the listed entity', stateAllowed(scoped, 'input_select.layout'), true);

check('and no other', stateAllowed(scoped, 'light.kitchen'), false);

check('a hass nobody scoped allows nothing', [stateAllowed(hass, 'light.kitchen'), stateScope(hass)], [false, []]);

check('nothing listed hands back hass itself', withStateScope(hass, []), hass);

check('no hass stays no hass', withStateScope(undefined, ['light.a']), undefined);

check('state reads a listed entity', applyTransform('state', 'input_select.layout', scoped), 'compact');

check('and has nothing for one that is not', applyTransform('state', 'light.kitchen', scoped), undefined);

check('an unlisted entity is named', unlistedState('state', 'light.kitchen', scoped), 'light.kitchen');

check('a listed one is not', unlistedState('state', 'input_select.layout', scoped), undefined);

check('a chain asking no state is never unlisted', unlistedState('upper', 'light.kitchen', scoped), undefined);

check(
  'the entity is what the steps before state make of the value',
  unlistedState('prefix:input_select.|state', 'layout', scoped),
  undefined,
);

/* ------------------------------------------------------------- substitution */

check(
  'a variable holding a listed entity gives its state',
  deepReplace([{ layout_entity: 'input_select.layout' }], {}, { mode: '[[layout_entity|state]]' }, 't', scoped),
  { mode: 'compact' },
);

check(
  'a listed entity written straight into the placeholder stands for itself',
  deepReplace(
    [],
    {},
    { mode: '[[input_select.layout|state]]', name: 'is [[input_select.layout|state|upper]]' },
    't',
    scoped,
  ),
  { mode: 'compact', name: 'is COMPACT' },
);

check(
  'a variable of the same name as the entity still wins',
  deepReplace([{ 'input_select.layout': 'light.kitchen' }], {}, { x: '[[input_select.layout]]' }, 't', scoped),
  { x: 'light.kitchen' },
);

warnings.length = 0;
check(
  'state of an unlisted entity is left in brackets',
  deepReplace([{ e: 'light.kitchen' }], {}, { x: '[[e|state]]' }, 't', scoped),
  { x: '[[e|state]]' },
);

check(
  'and says it is not in rebuild_on, rather than blaming Home Assistant',
  /light\.kitchen is not in this card's rebuild_on/.test(warnings[0]) && /rebuild_on:/.test(warnings[0]),
  true,
);

warnings.length = 0;
check(
  'a default further along does not paper over it',
  deepReplace([{ e: 'light.kitchen' }], {}, { x: '[[e|state|default:off]]' }, 't', scoped),
  { x: '[[e|state|default:off]]' },
);

warnings.length = 0;
check(
  'nor does one on an entity written straight in',
  deepReplace([], {}, { x: '[[light.kitchen|state|default:off]]' }, 't', scoped),
  { x: '[[light.kitchen|state|default:off]]' },
);

check(
  'a default still stands in for a listed entity Home Assistant has no state for',
  deepReplace([], {}, { x: '[[sensor.gone|state|default:off]]' }, 't', withStateScope(hass, ['sensor.gone'])),
  { x: 'off' },
);

warnings.length = 0;
check(
  'with no rebuild_on at all, state is refused the same way',
  deepReplace([{ e: 'input_select.layout' }], {}, { x: '[[e|state]]' }, 't', hass),
  { x: '[[e|state]]' },
);

warnings.length = 0;
deepReplace([], {}, { x: '[[light.kitchen|state]]', y: '[[nobody]]' }, 't', scoped);
check(
  'an unlisted entity written straight in says so, apart from the unset variables',
  [
    warnings.some((w) => /\[\[light\.kitchen\|state\]\] asks for the state/.test(w)),
    warnings.some((w) => /\[\[nobody\]\]/.test(w) && !/light\.kitchen/.test(w)),
  ],
  [true, true],
);

warnings.length = 0;
deepReplace([{ e: 'light.kitchen' }], {}, { x: '[[e|state]]' }, 't', scoped, true);
check('asked quietly, it says nothing', warnings.length, 0);

{
  // A card building again on every change of what it watches hands the same set each time.
  const said = new Set();
  warnings.length = 0;
  for (let build = 0; build < 3; build += 1) {
    deepReplace([{ e: 'light.kitchen' }], {}, { x: '[[e|state]]' }, 't', scoped, said);
  }
  check('handed a set, the same warning is said once however often the card builds', warnings.length, 1);
  deepReplace([{ e: 'sensor.other' }], {}, { x: '[[e|state]]' }, 't', scoped, said);
  check('and a different entity is still said, once', warnings.length, 2);
  deepReplace([{ e: 'light.kitchen' }], {}, { x: '[[e|state]]' }, 't', scoped, new Set());
  check('a new set - a new config - says it again', warnings.length, 3);
}

/* ------------------------------------------------------------- the dashboard check */

check(
  'an entity the card rebuilds on is not an unset variable',
  checkDashboard({
    decluttering_templates: { t: { card: { type: 'markdown', content: '[[input_select.layout|state]]' } } },
    views: [
      {
        cards: [{ type: 'custom:decluttering-card-plus', template: 't', rebuild_on: 'input_select.layout' }],
      },
    ],
  }).unsetVariables,
  [],
);

report();
