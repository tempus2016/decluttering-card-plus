/*
 * Unit tests for src/placeholders.ts and the editor's entry into the playground (idea 28).
 * Run with `npm test`.
 */
const { placeholdersIn, listPlaceholders } = require('../.test-build/placeholders.js');
const { tryPlaceholderIn } = require('../.test-build/playground.js');

const { check } = require('./check');

check(
  'every outermost placeholder, once, nesting kept',
  placeholdersIn('a [[x]] b [[y|default:[[z|slug]]]] c [[x]] [[!escaped]]'),
  ['[[x]]', '[[y|default:[[z|slug]]]]'],
);
check(
  'a template lists the placeholders of its content, style and let, not its description',
  listPlaceholders({
    description: 'Shows [[name]]',
    card: { type: 'tile', entity: '[[entity]]', name: '[[name|default:[[entity|area]]]]' },
    style: ':host { --c: [[colour]]; }',
    let: { slug: '[[entity|slug]]' },
  }),
  ['[[entity]]', '[[name|default:[[entity|area]]]]', '[[colour]]', '[[entity|slug]]'],
);
check('nothing in, nothing out', [listPlaceholders(undefined), listPlaceholders('x')], [[], []]);

// The editor's playground: the template's let and defaults apply, hass is the real one.
const hass = {
  states: {
    'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen light' } },
  },
  entities: { 'light.kitchen': { entity_id: 'light.kitchen', area_id: 'kitchen' } },
  devices: {},
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen' } },
};
const template = {
  template: 't',
  default: [{ name: 'Fallback' }],
  let: { slug: '[[entity|slug]]' },
  card: { type: 'tile' },
};
check(
  'each step of a chain under the template, with the real hass',
  tryPlaceholderIn(template, [{ entity: 'light.kitchen' }], '[[entity|area|upper]]', hass).steps.map((s) => [
    s.step,
    s.value,
  ]),
  [
    ['entity', 'light.kitchen'],
    ['area', 'Kitchen'],
    ['upper', 'KITCHEN'],
  ],
);
check(
  'a let value is readable, and a default stands in for a variable nobody set',
  [
    tryPlaceholderIn(template, [{ entity: 'light.kitchen' }], '[[slug]]', hass).whole.value,
    tryPlaceholderIn(template, [], '[[name]]', hass).whole.value,
  ],
  ['light_kitchen', 'Fallback'],
);
check(
  'a refusing step leaves the chain unresolved',
  tryPlaceholderIn(template, [{ entity: 'light.kitchen' }], '[[entity|slug|friendly_name]]', hass).whole.kind,
  'unresolved',
);
