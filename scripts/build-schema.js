#!/usr/bin/env node
/*
 * JSON schemas for YAML editors (idea 56). Generated from src/types.ts so a new key is in the
 * schema the release it ships in, then given the one thing types cannot say: what a
 * placeholder may look like, built from the same step lists the card's lint reads.
 *
 *   node scripts/build-schema.js            writes docs-theme/schema/{dashboard,template,card}.json
 *   node scripts/build-schema.js --check    exits 1 when the committed files differ from a fresh build
 *
 * Published with the docs site, so a dashboard file can say
 *   # yaml-language-server: $schema=https://tempus2016.github.io/decluttering-card-plus/schema/dashboard.json
 * and Studio Code Server or VS Code completes keys and underlines mistakes as they are typed.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { createGenerator } = require('ts-json-schema-generator');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs-theme', 'schema');
const BASE = 'https://tempus2016.github.io/decluttering-card-plus/schema/';

// The step lists live in TypeScript; the test build already compiles that module to CommonJS.
function knownSteps() {
  const built = path.join(ROOT, '.test-build', 'variables.js');
  if (!fs.existsSync(built)) {
    execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '-p', 'tsconfig.test.json'], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
  const variables = require(built);
  return { steps: variables.KNOWN_STEPS, paramSteps: variables.KNOWN_PARAM_STEPS };
}

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/*
 * What may stand between [[ and ]]: a name (dots and nested brackets allowed, so
 * `colours.[[level]]` passes), then any number of steps, each a bare known step or a known
 * step with a colon and an argument, then an optional ?. Text around the placeholder is
 * anything. Written for the YAML language server's regular expressions (ECMAScript, no
 * lookbehind needed).
 */
function placeholderPattern({ steps, paramSteps }) {
  const bare = steps.map(escape).sort().join('|');
  const withArg = paramSteps.map(escape).sort().join('|');
  const step = `(?:${bare}|(?:${withArg}):[^|\\]]*)`;
  const inner = `!?[^|\\[\\]?]+(?:\\[\\[[^\\]]*\\]\\][^|\\[\\]?]*)*(?:\\|${step})*\\??`;
  // Either no placeholder at all, or every [[...]] in the text is well formed.
  return `^(?:[^\\[]|\\[(?!\\[)|\\[\\[${inner}\\]\\])*$`;
}

function generate(type) {
  const generator = createGenerator({
    path: path.join(ROOT, 'src', 'types.ts'),
    tsconfig: path.join(ROOT, 'tsconfig.json'),
    type,
    skipTypeCheck: true,
    expose: 'export',
    topRef: true,
    additionalProperties: true,
  });
  return generator.createSchema(type);
}

// Properties a template substitutes into, where a placeholder is at home and should be well formed.
const PLACEHOLDER_HOLDERS = new Set([
  'card',
  'row',
  'badge',
  'element',
  'group',
  'style',
  'name',
  'grid_options',
  'let',
  'default',
  'defaults',
]);

/*
 * Lets a string anywhere under the given properties carry placeholders, and requires those
 * placeholders to be well formed. Done as a `$defs` entry the properties reference, so the
 * pattern is written once per file.
 */
function withPlaceholders(schema, definitionName, pattern) {
  schema.$defs = schema.$defs || {};
  schema.$defs.text_with_placeholders = {
    type: 'string',
    pattern,
    description:
      'Text, with any number of [[placeholders]]. Each placeholder is a variable name, then steps the card knows, then an optional ?.',
  };
  schema.$defs.config_with_placeholders = {
    description: 'Card, row, badge or element configuration. Strings in it may hold [[placeholders]].',
    anyOf: [
      { $ref: '#/$defs/text_with_placeholders' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'null' },
      { type: 'array', items: { $ref: '#/$defs/config_with_placeholders' } },
      { type: 'object', additionalProperties: { $ref: '#/$defs/config_with_placeholders' } },
    ],
  };
  const definition = schema.definitions[definitionName];
  for (const [key, property] of Object.entries(definition.properties)) {
    if (!PLACEHOLDER_HOLDERS.has(key)) continue;
    const description = property.description;
    definition.properties[key] = description
      ? { description, $ref: '#/$defs/config_with_placeholders' }
      : { $ref: '#/$defs/config_with_placeholders' };
  }
  return schema;
}

function stamp(schema, name, title) {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: `${BASE}${name}.json`,
    title,
    ...schema,
  };
}

function build() {
  const pattern = placeholderPattern(knownSteps());

  const template = withPlaceholders(generate('TemplateConfig'), 'TemplateConfig', pattern);
  // `variables:` may also be a mapping keyed by name (#223); the generator only sees the list.
  const declarations = template.definitions.TemplateConfig.properties.variables;
  template.definitions.TemplateConfig.properties.variables = {
    description: declarations.description,
    anyOf: [
      declarations,
      {
        type: 'object',
        description:
          'The same declarations keyed by name: a scalar or list is the default, a mapping is the whole declaration, null is a bare name.',
        additionalProperties: {
          anyOf: [
            { $ref: '#/definitions/VariableDeclaration' },
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'array' },
            { type: 'null' },
          ],
        },
      },
    ],
  };
  template.definitions.TemplateConfig.properties.extends = {
    description: template.definitions.TemplateConfig.properties.extends.description,
    anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  };
  const templateSchema = stamp(
    { $ref: '#/definitions/TemplateConfig', ...template },
    'template',
    'A Decluttering Card Plus template',
  );

  const card = withPlaceholders(generate('DeclutteringCardConfig'), 'DeclutteringCardConfig', pattern);
  const cardDefinition = card.definitions.DeclutteringCardConfig;
  cardDefinition.properties.type = {
    type: 'string',
    enum: ['custom:decluttering-card-plus', 'custom:decluttering-card'],
    description: 'The card type.',
  };
  cardDefinition.required = ['type'];
  const templateCard = generate('DeclutteringTemplateConfig');
  const templateCardDefinition = templateCard.definitions.DeclutteringTemplateConfig;
  templateCardDefinition.properties.type = {
    type: 'string',
    enum: ['custom:decluttering-template-plus', 'custom:decluttering-template'],
    description: 'The template card type: a template defined where it is used.',
  };
  templateCardDefinition.required = ['type', 'template'];
  for (const [key, property] of Object.entries(templateCardDefinition.properties)) {
    if (PLACEHOLDER_HOLDERS.has(key)) {
      templateCardDefinition.properties[key] = property.description
        ? { description: property.description, $ref: '#/$defs/config_with_placeholders' }
        : { $ref: '#/$defs/config_with_placeholders' };
    }
  }
  const cardSchema = stamp(
    {
      anyOf: [{ $ref: '#/definitions/DeclutteringCardConfig' }, { $ref: '#/definitions/DeclutteringTemplateConfig' }],
      definitions: { ...card.definitions, ...templateCard.definitions },
      $defs: card.$defs,
    },
    'card',
    'A Decluttering Card Plus card, or a template card',
  );

  const dashboardSchema = stamp(
    {
      type: 'object',
      properties: {
        title: { type: 'string' },
        decluttering_templates: {
          type: 'object',
          description:
            'Templates by name. Each is a card, row, badge, element or group with [[placeholders]] for what changes.',
          additionalProperties: { $ref: `${BASE}template.json` },
        },
        decluttering_defaults: {
          description:
            'Values every template on this dashboard falls back to, as a list of single-key mappings or one mapping.',
          anyOf: [{ type: 'array', items: { type: 'object' } }, { type: 'object' }],
        },
        decluttering_variables: {
          description: 'Variable declarations shared by every template; a template takes one up by naming it.',
          anyOf: [
            { type: 'array', items: { $ref: `${BASE}template.json#/definitions/VariableDeclaration` } },
            { type: 'object' },
          ],
        },
        decluttering_let: {
          description: 'Values worked out once for the whole dashboard, read by every template.',
          anyOf: [{ type: 'array', items: { type: 'object' } }, { type: 'object' }],
        },
        decluttering_templates_from: {
          description: 'Dashboards to borrow templates from, by url path; "*" for all of them.',
          anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
        },
        views: {
          type: 'array',
          description:
            'The views. A view, section or card inside is not checked by this schema beyond its decluttering cards.',
          items: { type: 'object' },
        },
      },
    },
    'dashboard',
    'A Home Assistant dashboard with Decluttering Card Plus templates',
  );

  return { 'template.json': templateSchema, 'card.json': cardSchema, 'dashboard.json': dashboardSchema, pattern };
}

function main() {
  const built = build();
  const check = process.argv.includes('--check');
  fs.mkdirSync(OUT, { recursive: true });
  let stale = 0;
  for (const [name, schema] of Object.entries(built)) {
    if (name === 'pattern') continue;
    const file = path.join(OUT, name);
    const text = JSON.stringify(schema, null, 2) + '\n';
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) {
        console.error(`${path.relative(ROOT, file)} is stale; run node scripts/build-schema.js`);
        stale += 1;
      }
    } else {
      fs.writeFileSync(file, text);
      console.log(`wrote ${path.relative(ROOT, file)} (${text.length} bytes)`);
    }
  }
  if (stale) process.exit(1);
}

if (require.main === module) main();

module.exports = { build, placeholderPattern };
