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

test('the committed schemas match a fresh build', () => {
  for (const name of ['template.json', 'card.json', 'dashboard.json']) {
    const file = path.join(__dirname, '..', 'docs-theme', 'schema', name);
    assert.equal(fs.existsSync(file), true, `${name} missing: run node scripts/build-schema.js`);
    assert.equal(fs.readFileSync(file, 'utf8'), JSON.stringify(built[name], null, 2) + '\n', `${name} is stale`);
  }
});
