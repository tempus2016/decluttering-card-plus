/*
 * The JSON schemas for YAML editors (idea 56): built from the types, with a placeholder
 * pattern that admits exactly the steps the lint knows.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { check } = require('./check');
const { build, placeholderPattern } = require('../scripts/build-schema');
const { KNOWN_STEPS, KNOWN_PARAM_STEPS } = require('../.test-build/variables');

const pattern = new RegExp(placeholderPattern({ steps: KNOWN_STEPS, paramSteps: KNOWN_PARAM_STEPS }));
const ok = (text) => pattern.test(text);

check('plain text passes', ok('Kitchen'), true);
check('a bare placeholder passes', ok('[[entity]]'), true);
check('a known step passes', ok('[[entity|friendly_name]]'), true);
check('a chain of known steps passes', ok('Hello [[name|default:Unnamed|upper]] and [[other?]]'), true);
check('a step with an argument holding a colon passes', ok('[[icon|default:mdi:lamp]]'), true);
check('a nested lookup passes', ok('[[colours.[[level]]]]'), true);
check('an escaped placeholder passes', ok('[[!name]]'), true);
check('a dotted name passes', ok('[[entity.state|upper]]'), true);
check('a misspelt step fails', ok('[[entity|frendly_name]]'), false);
check('an unclosed placeholder fails', ok('[[entity'), false);
check('a single bracket is fine', ok('a [b] c'), true);
check('an empty step fails', ok('[[entity|]]'), false);

const built = build();
check(
  'three files are built',
  Object.keys(built)
    .filter((name) => name.endsWith('.json'))
    .sort(),
  ['card.json', 'dashboard.json', 'template.json'],
);
check('the template schema points at its definition', built['template.json'].$ref, '#/definitions/TemplateConfig');
check(
  'the template schema knows the keys a template has',
  [
    'card',
    'row',
    'badge',
    'element',
    'group',
    'extends',
    'variables',
    'examples',
    'publish',
    'suggest_for',
    'on_error',
    'let',
    'default',
    'defaults',
  ].every((key) => key in built['template.json'].definitions.TemplateConfig.properties),
  true,
);
check(
  'the content keys take placeholders',
  built['template.json'].definitions.TemplateConfig.properties.card.$ref,
  '#/$defs/config_with_placeholders',
);
check(
  'declarations may be a list or a mapping',
  built['template.json'].definitions.TemplateConfig.properties.variables.anyOf.length,
  2,
);
check(
  'a declaration knows its type names',
  'type' in built['template.json'].definitions.VariableDeclaration.properties,
  true,
);
check('the card schema requires the type', built['card.json'].definitions.DeclutteringCardConfig.required, ['type']);
check(
  'the card schema lists the two card types',
  built['card.json'].definitions.DeclutteringCardConfig.properties.type.enum,
  ['custom:decluttering-card-plus', 'custom:decluttering-card'],
);
check(
  'the card schema knows the repeat keys',
  ['for_each', 'for_each_from', 'columns', 'empty', 'lazy', 'rebuild_on', 'on_error', 'debug'].every(
    (key) => key in built['card.json'].definitions.DeclutteringCardConfig.properties,
  ),
  true,
);
check(
  'the dashboard schema refers to the template schema by URL',
  built['dashboard.json'].properties.decluttering_templates.additionalProperties.$ref,
  'https://tempus2016.github.io/decluttering-card-plus/schema/template.json',
);
check(
  'every schema has an id under the docs site',
  Object.entries(built)
    .filter(([name]) => name.endsWith('.json'))
    .every(([name, schema]) => schema.$id === `https://tempus2016.github.io/decluttering-card-plus/schema/${name}`),
  true,
);

// button-card's own JavaScript is never a placeholder; a placeholder written inside it still is.
check('button-card JavaScript passes', ok('[[[ return entity.state ]]]'), true);
check('a placeholder inside button-card JavaScript passes', ok('[[[ return [[name|json]] ]]]'), true);
check(
  'button-card JavaScript with brackets of its own passes',
  ok("background-color: \"[[[ const t = states['sun.sun'].state; return t === 'above' ? 'gold' : 'navy' ]]]\""),
  true,
);
check('a misspelt step inside button-card JavaScript fails', ok('[[[ return [[name|jsn]] ]]]'), false);
check(
  'a long run of brackets that fails does not hang',
  (() => {
    const started = Date.now();
    ok('['.repeat(60) + ' [[x|nope]]');
    return Date.now() - started < 1000;
  })(),
  true,
);

/*
 * Real configs against the built schemas, with ajv (draft-07, as the YAML language server
 * reads them). Each case is one that went wrong against real dashboards, passing and failing.
 */
const Ajv = require('ajv');
const ajv = new Ajv({ schemaId: 'auto' });
const SITE = 'https://tempus2016.github.io/decluttering-card-plus/schema/';
for (const name of ['template.json', 'card.json', 'dashboard.json']) ajv.addSchema(built[name]);
const valid = (name, config) => ajv.validate(`${SITE}${name}`, config);
const CARD = 'custom:decluttering-card-plus';

check('card variables as a list pass', valid('card.json', { type: CARD, template: 't', variables: [{ a: 1 }] }), true);
check(
  'card variables as a mapping pass',
  valid('card.json', { type: CARD, template: 't', variables: { a: 'one', b: 'two' } }),
  true,
);
check('card variables as text fail', valid('card.json', { type: CARD, template: 't', variables: 'a: one' }), false);
check(
  'a repeated card with mapping variables passes',
  valid('card.json', {
    type: CARD,
    template: 't',
    variables: { a: 1 },
    for_each: [{ b: 2 }],
    variables_mobile: { a: 2 },
  }),
  true,
);

const sized = { size: { default: 2, label: 'Size', selector: { number: { min: 1, max: 4 } } } };
check('a mapping-form declaration needs no name', valid('template.json', { variables: sized, card: {} }), true);
check(
  'a mapping-form declaration on a template card needs no name',
  valid('card.json', { type: 'custom:decluttering-template-plus', template: 't', variables: sized, card: {} }),
  true,
);
check(
  'mapping-form declarations take defaults and bare names',
  valid('template.json', { variables: { a: 1, b: 'x', c: null, d: [1] }, card: {} }),
  true,
);
check(
  'a list-form declaration still needs its name',
  valid('template.json', { variables: [{ default: 2 }], card: {} }),
  false,
);
check(
  'a mapping-form declaration of the wrong type fails',
  valid('template.json', { variables: { size: { label: 7 } }, card: {} }),
  false,
);
check('dashboard declarations by name pass', valid('dashboard.json', { decluttering_variables: sized }), true);

check(
  'button-card JavaScript in a template card passes',
  valid('template.json', {
    card: {
      type: 'custom:button-card',
      name: '[[[ return [[name|json]] ]]]',
      styles: { card: ['background-color: "[[[ const t = states[\'sun.sun\'].state; return t ]]]"'] },
    },
  }),
  true,
);
check(
  'a misspelt step in a template card fails',
  valid('template.json', { card: { name: '[[name|frendly_name]]' } }),
  false,
);

check(
  'dashboard strict levels pass',
  valid('dashboard.json', { decluttering_strict: { errors: 'fail', warnings: 'notice' } }),
  true,
);
check('dashboard strict true passes', valid('dashboard.json', { decluttering_strict: true }), true);
check('an unknown strict mode fails', valid('dashboard.json', { decluttering_strict: { errors: 'loud' } }), false);
check(
  'strict on a view and a section passes',
  valid('dashboard.json', {
    views: [{ decluttering_strict: true, sections: [{ decluttering_strict: { warn: 'report' } }] }],
  }),
  true,
);
check(
  'strict on a section as text fails',
  valid('dashboard.json', { views: [{ sections: [{ decluttering_strict: 'yes' }] }] }),
  false,
);
check(
  'a page strategy passes',
  valid('dashboard.json', {
    strategy: {
      type: CARD,
      decluttering_templates: { kiosk: { dashboard: { views: [] } } },
      page: { template: 'kiosk', variables: { room: 'kitchen' } },
    },
  }),
  true,
);
check(
  'decluttering_page passes',
  valid('dashboard.json', {
    strategy: { type: CARD, decluttering_page: { template: 'kiosk', variables: [{ a: 1 }] } },
  }),
  true,
);
check(
  'a page without a template fails',
  valid('dashboard.json', { strategy: { type: CARD, page: { variables: {} } } }),
  false,
);
check(
  'a repeating dashboard strategy passes',
  valid('dashboard.json', {
    strategy: {
      type: CARD,
      variables: { a: 1 },
      views: [{ for_each_from: { areas: true }, view: { title: '[[area]]' } }],
    },
  }),
  true,
);
check(
  'a strategy with a bad shared key fails',
  valid('dashboard.json', { strategy: { type: CARD, decluttering_strict: 'loud' } }),
  false,
);
check(
  'another strategy is left alone',
  valid('dashboard.json', { strategy: { type: 'original-states', page: 3 } }),
  true,
);
check(
  'a view strategy passes',
  valid('dashboard.json', { views: [{ strategy: { type: CARD, sections: [{ for_each_from: { areas: true } }] } }] }),
  true,
);

check(
  'a visibility condition passes',
  valid('template.json', { visibility: [{ variable: 'a', exists: true }], card: {} }),
  true,
);
check(
  'a single visibility condition passes',
  valid('template.json', { visibility: { variable: 'area', not_in: 'Garage, Shed' }, card: {} }),
  true,
);
check(
  'a misspelt visibility key fails',
  valid('template.json', { visibility: [{ variable: 'a', exist: true }], card: {} }),
  false,
);
check(
  'a visibility condition without a test fails',
  valid('template.json', { visibility: [{ variable: 'a' }], card: {} }),
  false,
);
check(
  'a visibility condition without a variable fails',
  valid('template.json', { visibility: [{ exists: true }], card: {} }),
  false,
);

test('the committed schemas match a fresh build', () => {
  for (const name of ['template.json', 'card.json', 'dashboard.json']) {
    const file = path.join(__dirname, '..', 'docs-theme', 'schema', name);
    assert.equal(fs.existsSync(file), true, `${name} missing: run node scripts/build-schema.js`);
    assert.equal(fs.readFileSync(file, 'utf8'), JSON.stringify(built[name], null, 2) + '\n', `${name} is stale`);
  }
});
