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

// The step lists and the other closed sets live in TypeScript; the test build already
// compiles those modules to CommonJS.
function compiled(name) {
  const built = path.join(ROOT, '.test-build', `${name}.js`);
  if (!fs.existsSync(built)) {
    execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '-p', 'tsconfig.test.json'], {
      cwd: ROOT,
      stdio: 'inherit',
    });
  }
  return require(built);
}

function knownSteps() {
  const variables = compiled('variables');
  return { steps: variables.KNOWN_STEPS, paramSteps: variables.KNOWN_PARAM_STEPS };
}

const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/*
 * What may stand between [[ and ]]: a name (dots and nested brackets allowed, so
 * `colours.[[level]]` passes), then any number of steps, each a bare known step, a known
 * step with a colon and an argument, or a function template's name, then an optional ?. Text around the placeholder is
 * anything. Written for the YAML language server's regular expressions (ECMAScript, no
 * lookbehind needed).
 *
 * A run of three or more brackets opens button-card's `[[[ JavaScript ]]]`, which the card
 * never reads as a placeholder (insideButtonCardJs: a `[[` with a bracket before it). The run
 * is taken whole, so a `[[name]]` written inside the JavaScript is still checked. The
 * look-ahead keeps the run from being split up, which would backtrack badly on a failure.
 */
function placeholderPattern({ steps, paramSteps }) {
  const bare = steps.map(escape).sort().join('|');
  const withArg = paramSteps.map(escape).sort().join('|');
  /*
   * A template can be used as a step (#307), and the schema cannot know a dashboard's
   * templates, so any other name is a step too - the card and its lint still say when it is
   * neither. The look-ahead keeps a built-in name out of it, so each step has one reading and
   * a failure does not backtrack every way round.
   */
  const names = [...new Set([...steps, ...paramSteps])]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|');
  const named = `(?!(?:${names})(?![A-Za-z0-9_-]))[A-Za-z_][A-Za-z0-9_-]*(?::[^|\\]]*)?`;
  const step = `(?:${bare}|(?:${withArg}):[^|\\]]*|${named})`;
  const inner = `!?[^|\\[\\]?]+(?:\\[\\[[^\\]]*\\]\\][^|\\[\\]?]*)*(?:\\|${step})*\\??`;
  // Either no placeholder at all, or every [[...]] in the text is well formed.
  return `^(?:[^\\[]|\\[{3,}(?!\\[)|\\[(?!\\[)|\\[\\[${inner}\\]\\])*$`;
}

function generate(type, file = 'types.ts') {
  const generator = createGenerator({
    path: path.join(ROOT, 'src', file),
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
  // A function template's result (#307).
  'function',
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
    // Shown by the YAML language server in place of the raw pattern when a placeholder is malformed (#410).
    patternErrorMessage:
      'A [[placeholder]] here is not well formed. Check that the brackets come in pairs and that a step with a value is written name:value, as in if:name or default:x. Misspelt step names are not checked here: the card editor and lint name them.',
    description:
      'Text, with any number of [[placeholders]]. Each placeholder is a variable name, then any steps - built-in ones, or a template used as a step - then an optional ?.',
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

const withPlaceholdersOn = (definition) => {
  for (const [key, property] of Object.entries(definition.properties)) {
    if (PLACEHOLDER_HOLDERS.has(key)) {
      definition.properties[key] = property.description
        ? { description: property.description, $ref: '#/$defs/config_with_placeholders' }
        : { $ref: '#/$defs/config_with_placeholders' };
    }
  }
};

/*
 * A card's `variables:` (and a page's) may be a list of single-key mappings or one mapping;
 * normaliseVariables reads both. The generator only sees the list the type names.
 */
function valuesListOrMapping(property, description) {
  return {
    ...(description || property.description ? { description: description || property.description } : {}),
    anyOf: [
      { type: 'array', items: { type: 'object' } },
      { type: 'object', description: 'The same values as one mapping, keyed by name.' },
    ],
  };
}

/*
 * Declarations keyed by name (#223): a scalar or list is the default, a mapping is the whole
 * declaration - its name is the key, so it needs no `name:` of its own - and null is a bare name.
 */
function declarationMapping(ref) {
  return {
    type: 'object',
    description:
      'The same declarations keyed by name: a scalar or list is the default, a mapping is the whole declaration, null is a bare name.',
    additionalProperties: {
      anyOf: [
        { $ref: ref },
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'array' },
        { type: 'null' },
      ],
    },
  };
}

// The declaration as a mapping-form entry writes it: the same keys, the name given by the key.
function declarationByName(definitions) {
  const byName = JSON.parse(JSON.stringify(definitions.VariableDeclaration));
  byName.required = (byName.required || []).filter((key) => key !== 'name');
  if (!byName.required.length) delete byName.required;
  byName.description = 'A declaration under a mapping-form `variables:`, named by its key.';
  definitions.VariableDeclarationByName = byName;
}

/*
 * A template's `visibility:` (idea 45), typed from src/visibility.ts: each condition names a
 * `variable` and says at least one thing about it. Closed, so `exist:` for `exists:` is caught
 * rather than quietly making the condition one the card leaves out.
 */
function visibilitySchema(definitions) {
  const generated = generate('VisibilityCondition', 'visibility.ts').definitions.VisibilityCondition;
  const conditionKeys = Object.keys(generated.properties).filter((key) => key !== 'variable');
  const condition = {
    ...generated,
    description: `One condition: a \`variable\` and ${conditionKeys.join(', ')}.`,
    required: ['variable'],
    additionalProperties: false,
    anyOf: conditionKeys.map((key) => ({ required: [key] })),
  };
  // `in:` and `not_in:` also take a comma-separated string, or one value (listOf).
  for (const key of ['in', 'not_in']) if (condition.properties[key]) condition.properties[key] = {};
  definitions.VisibilityCondition = condition;
  return {
    anyOf: [
      { $ref: '#/definitions/VisibilityCondition' },
      { type: 'array', items: { $ref: '#/definitions/VisibilityCondition' } },
    ],
  };
}

// The keys a template definition gets beyond what its type says, in template.json and card.json alike.
function patchTemplateDefinition(schema, definitionName, { visibility }) {
  const definition = schema.definitions[definitionName];
  declarationByName(schema.definitions);
  const declarations = definition.properties.variables;
  definition.properties.variables = {
    description: declarations.description,
    anyOf: [declarations, declarationMapping('#/definitions/VariableDeclarationByName')],
  };
  definition.properties.extends = {
    description: definition.properties.extends.description,
    anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  };
  if (visibility) {
    definition.properties.visibility = {
      description: definition.properties.visibility.description,
      ...visibilitySchema(schema.definitions),
    };
  }
}

function build() {
  const pattern = placeholderPattern(knownSteps());
  const { ERROR_MODES, WARNING_MODES } = compiled('strict');
  const { STRATEGY_TYPE } = compiled('strategy');
  const { PAGE_KEY } = compiled('page-template');

  const template = withPlaceholders(generate('TemplateConfig'), 'TemplateConfig', pattern);
  patchTemplateDefinition(template, 'TemplateConfig', { visibility: true });
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
  cardDefinition.properties.variables = valuesListOrMapping(
    cardDefinition.properties.variables,
    "The template's variables for this card: a list of single-key mappings, or one mapping.",
  );
  cardDefinition.required = ['type'];
  const templateCard = generate('DeclutteringTemplateConfig');
  const templateCardDefinition = templateCard.definitions.DeclutteringTemplateConfig;
  templateCardDefinition.properties.type = {
    type: 'string',
    enum: ['custom:decluttering-template-plus', 'custom:decluttering-template'],
    description: 'The template card type: a template defined where it is used.',
  };
  templateCardDefinition.required = ['type', 'template'];
  withPlaceholdersOn(templateCardDefinition);
  // The template card's `visibility:` is Home Assistant's own card visibility, so it is left open.
  patchTemplateDefinition(templateCard, 'DeclutteringTemplateConfig', { visibility: false });
  const cardSchema = stamp(
    {
      anyOf: [{ $ref: '#/definitions/DeclutteringCardConfig' }, { $ref: '#/definitions/DeclutteringTemplateConfig' }],
      definitions: { ...card.definitions, ...templateCard.definitions },
      $defs: card.$defs,
    },
    'card',
    'A Decluttering Card Plus card, or a template card',
  );

  const valuesSchema = { anyOf: [{ type: 'array', items: { type: 'object' } }, { type: 'object' }] };
  // The keys a section, a view or the whole dashboard can carry for the cards inside it.
  const placeKeys = {
    decluttering_defaults: {
      description: 'Values every template in here falls back to, as a list of single-key mappings or one mapping.',
      ...valuesSchema,
    },
    decluttering_let: {
      description: 'Values worked out once for everything in here, read by every template.',
      ...valuesSchema,
    },
    decluttering_strict: {
      description:
        'What the cards in here do about errors and warnings (#390): true, false, or a mode per level. The nearest place that sets a level wins.',
      $ref: '#/$defs/strict',
    },
  };
  const declutteringKeys = {
    decluttering_templates: {
      type: 'object',
      description:
        'Templates by name. Each is a card, row, badge, element or group with [[placeholders]] for what changes.',
      additionalProperties: { $ref: `${BASE}template.json` },
    },
    ...placeKeys,
    decluttering_variables: {
      description: 'Variable declarations shared by every template; a template takes one up by naming it.',
      anyOf: [
        { type: 'array', items: { $ref: `${BASE}template.json#/definitions/VariableDeclaration` } },
        declarationMapping(`${BASE}template.json#/definitions/VariableDeclarationByName`),
      ],
    },
    decluttering_templates_from: {
      description: 'Dashboards to borrow templates from, by url path; "*" for all of them.',
      anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    },
  };
  // A strategy of another type is that strategy's business; one of ours is checked.
  const ourStrategy = (ref) => ({
    type: 'object',
    if: { properties: { type: { const: STRATEGY_TYPE } }, required: ['type'] },
    then: { $ref: ref },
  });
  const pageSchema = {
    type: 'object',
    description: 'The page template this dashboard is, and the variables it is built with.',
    properties: {
      template: { type: 'string', description: 'The template, with a `dashboard:` body, to build the page from.' },
      variables: valuesListOrMapping(
        {},
        "The page template's variables: a list of single-key mappings, or one mapping.",
      ),
    },
    required: ['template'],
  };
  const dashboardSchema = stamp(
    {
      type: 'object',
      properties: {
        title: { type: 'string' },
        ...declutteringKeys,
        strategy: {
          description: `A dashboard strategy. \`type: ${STRATEGY_TYPE}\` writes the dashboard out from its views, or builds it from a page template.`,
          ...ourStrategy('#/$defs/dashboard_strategy'),
        },
        views: {
          type: 'array',
          description:
            'The views. A view, section or card inside is not checked by this schema beyond its decluttering keys.',
          items: { $ref: '#/$defs/view' },
        },
      },
      $defs: {
        strict: {
          anyOf: [
            { type: 'boolean' },
            {
              type: 'object',
              properties: {
                errors: { enum: [...ERROR_MODES] },
                error: { enum: [...ERROR_MODES] },
                warnings: { enum: [...WARNING_MODES] },
                warn: { enum: [...WARNING_MODES] },
              },
              additionalProperties: false,
            },
          ],
        },
        page: pageSchema,
        dashboard_strategy: {
          type: 'object',
          properties: {
            type: { const: STRATEGY_TYPE },
            ...declutteringKeys,
            variables: valuesListOrMapping({}, 'Values every view the strategy writes out is filled in with.'),
            views: {
              type: 'array',
              description:
                'The views, a repeat entry (`for_each` or `for_each_from` with `view:`) written out once per item.',
              items: { $ref: '#/$defs/view' },
            },
            [PAGE_KEY]: { $ref: '#/$defs/page' },
            decluttering_page: { $ref: '#/$defs/page' },
          },
        },
        view_strategy: {
          type: 'object',
          properties: {
            type: { const: STRATEGY_TYPE },
            variables: valuesListOrMapping(
              {},
              'Values every section and badge the strategy writes out is filled in with.',
            ),
            sections: { type: 'array', items: { $ref: '#/$defs/section' } },
            badges: { type: 'array' },
          },
        },
        view: {
          type: 'object',
          properties: {
            ...placeKeys,
            strategy: ourStrategy('#/$defs/view_strategy'),
            sections: { type: 'array', items: { $ref: '#/$defs/section' } },
          },
        },
        section: {
          type: 'object',
          properties: { ...placeKeys },
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
