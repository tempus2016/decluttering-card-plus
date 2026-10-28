/*
 * Unit tests for the placeholder lint in src/lint.ts, which the template editor runs as a
 * template is typed. Run with `npm test`.
 */
const { lintTemplate, definedNames } = require('../.test-build/lint.js');
const { KNOWN_STEPS, KNOWN_PARAM_STEPS } = require('../.test-build/variables.js');

const { check } = require('./check');

// The findings as short strings, which reads far better in a failure than the objects.
const lint = (template, known) =>
  lintTemplate(template, known).map((f) => `${f.level} ${f.key} ${JSON.stringify(f.params)} @${f.path}`);

check('nothing to say about no template', lintTemplate(undefined), []);
check('nothing to say about a template that is not an object', lintTemplate('card'), []);

check(
  'a clean template with its variables declared says nothing',
  lint({
    variables: [{ name: 'entity' }],
    default: [{ name: 'Lamp' }],
    card: { type: 'tile', entity: '[[entity]]', name: '[[name|upper]]' },
  }),
  [],
);

/* ------------------------------------------------------------------ brackets */

check(
  'an unclosed [[ is found, with where it is',
  lint({ default: [{ entity: 'x' }], card: { type: 'tile', entity: '[[entity' } }),
  ['warning lint.unclosed {} @card.entity'],
);

check('a stray ]] is found', lint({ default: [{ entity: 'x' }], card: { type: 'tile', entity: 'entity]]' } }), [
  'warning lint.stray_close {} @card.entity',
]);

check(
  'a nested lookup is balanced',
  lint({ default: [{ colours: {} }, { level: 'low' }], card: { color: '[[colours.[[level]]]]' } }),
  [],
);

check(
  'paths go through lists by position',
  lint({ default: [{ a: 1 }], card: { entities: ['ok', { name: '[[a' }] } }),
  ['warning lint.unclosed {} @card.entities[1].name'],
);

check('a description is prose and is not read', lint({ description: 'Takes [[entity', card: { type: 'tile' } }), []);

/* ------------------------------------------------------------------ steps */

check(
  'a mistyped step with an argument is matched by its name and keeps the argument',
  lint({ card: { name: '[[room|defualt:Hall]]' } }).filter((line) => /unknown_step/.test(line)),
  [
    'warning lint.unknown_step {"step":"defualt:Hall","placeholder":"[[room|defualt:Hall]]","closest":"default:Hall"} @card.name',
  ],
);
check(
  'and one nothing like any step has no suggestion',
  lint({ card: { name: '[[room|zzzzzz]]' } }).filter((line) => /unknown_step/.test(line)),
  ['warning lint.unknown_step {"step":"zzzzzz","placeholder":"[[room|zzzzzz]]"} @card.name'],
);

check(
  'an unknown step is named, with its placeholder',
  lint({ default: [{ room: 'x' }], card: { name: '[[room|slgu]]' } }),
  ['warning lint.unknown_step {"step":"slgu","placeholder":"[[room|slgu]]","closest":"slug"} @card.name'],
);
check(
  'the #210 steps are known, and a turned-round if: names its variable',
  lint({
    default: [{ room: 'x' }, { mode: 'a' }],
    card: {
      a: '[[room|exists]]',
      b: '[[room|contains:x]]',
      c: '[[room|find:x]]',
      d: '[[room|if:!mode]]',
      e: '[[room|if:mode!=a]]',
    },
  }),
  [],
);

check(
  'every kind of known step passes',
  lint({
    default: [{ room: 'x' }, { other: 'y' }],
    card: {
      a: '[[room|slug|upper|lower|title|kebab|trim|capitalize]]',
      b: '[[room|json]]',
      c: '[[room|bool]]',
      d: '[[room|friendly_name|area|device|floor|area_id|device_id|domain|object_id|labels]]',
      e: '[[room|attr:brightness]]',
      f: '[[room|replace:_: |prefix:x|suffix:y|max:3|map:a=b]]',
      g: '[[room|or:other|default:none]]',
      h: '[[room|if:other=on]]',
      i: '[[room?]]',
    },
  }),
  [],
);

check(
  'an escaped placeholder is the brackets written out, not a placeholder',
  lint({ card: { content: '[[!not|a|chain]]' } }),
  [],
);

check(
  'the optional marker swallowed by an argument is not part of it',
  lint({ default: [{ room: 'x' }], card: { name: '[[room|suffix: room?]]' } }),
  [],
);

check(
  'the known steps include the transforms and the resolvers',
  [
    KNOWN_STEPS.includes('slug'),
    KNOWN_STEPS.includes('friendly_name'),
    KNOWN_STEPS.includes('json'),
    KNOWN_STEPS.includes('bool'),
  ],
  [true, true, true, true],
);

check(
  'the known argument steps include the fallbacks and the condition',
  ['or', 'default', 'if', 'attr', 'map'].every((name) => KNOWN_PARAM_STEPS.includes(name)),
  true,
);

/* ------------------------------------------------------------------ fallbacks */

check(
  'an or: after a default: with text is never reached',
  lint({ default: [{ name: 'x' }, { label: 'y' }], card: { name: '[[name|default:Unnamed|or:label]]' } }),
  ['warning lint.after_default {"step":"or:label","placeholder":"[[name|default:Unnamed|or:label]]"} @card.name'],
);

check(
  'an or: after an empty default: still gets its turn',
  lint({ default: [{ name: 'x' }, { label: 'y' }], card: { name: '[[name|default:|or:label]]' } }),
  [],
);

check(
  'an or: before the default: is the right way round',
  lint({ default: [{ name: 'x' }, { label: 'y' }], card: { name: '[[name|or:label|default:Unnamed]]' } }),
  [],
);

/* ------------------------------------------------------------------ targets */

check(
  'an if: naming a variable the template never mentions is a warning, with a near miss',
  lint({
    variables: [{ name: 'entity' }, { name: 'show_name' }],
    card: { entity: '[[entity]]', name: '[[entity|friendly_name|if:show_nmae]]' },
  }),
  [
    'warning lint.target_unknown {"name":"show_nmae","placeholder":"[[entity|friendly_name|if:show_nmae]]","closest":"show_name"} @card.name',
  ],
);

check(
  'an or: naming a variable read elsewhere in the template is fine',
  lint({ default: [{ name: 'x' }, { label: 'y' }], card: { a: '[[name|or:label]]', b: '[[label]]' } }),
  [],
);

check(
  'an or: target with no near miss gets no suggestion',
  lint({ default: [{ name: 'x' }], card: { a: '[[name|or:zzzzzzzz]]' } }),
  ['warning lint.target_unknown {"name":"zzzzzzzz","placeholder":"[[name|or:zzzzzzzz]]"} @card.a'],
);

check(
  'a target known from elsewhere - a parent, the shared values - is fine',
  lint({ default: [{ name: 'x' }], card: { a: '[[name|if:wide]]' } }, ['wide']),
  [],
);

check(
  'a let value counts as defined',
  lint({ let: { wide: '[[size]]' }, default: [{ size: 1 }, { name: 'x' }], card: { a: '[[name|if:wide]]' } }),
  [],
);

/* ------------------------------------------------------------------ undeclared */

check(
  'variables read but neither declared nor defaulted are one info, each name with where it is first read',
  lint({ card: { type: 'tile', entity: '[[entity]]', name: '[[room.name]]', icon: '[[entity|domain]]' } }),
  ['info lint.undeclared {"names":"entity (card.entity), room (card.name)"} @'],
);

check(
  'the position names every repeat supplies are not undeclared',
  lint({ card: { name: 'Zone [[index]] of [[count]]', first: '[[first]]' } }),
  [],
);

check('one undeclared name keeps the place it is read', lint({ card: { type: 'tile', entity: '[[entity]]' } }), [
  'info lint.undeclared {"names":"entity"} @card.entity',
]);

check(
  'placeholders in let values and declared defaults are read too',
  lint({ let: { slug: '[[room|slgu]]' }, variables: [{ name: 'x', default: '[[y|nope]]' }] }),
  [
    'warning lint.unknown_step {"step":"slgu","placeholder":"[[room|slgu]]","closest":"slug"} @let.slug',
    'warning lint.unknown_step {"step":"nope","placeholder":"[[y|nope]]"} @variables[0].default',
    'info lint.undeclared {"names":"room (let.slug), y (variables[0].default)"} @',
  ],
);

check('a placeholder in a key is read like one in a value', lint({ default: [{ a: 1 }], card: { '[[a|bad]]': 1 } }), [
  'warning lint.unknown_step {"step":"bad","placeholder":"[[a|bad]]"} @card',
]);

check(
  'the same mistake twice in one place is said once',
  lint({ default: [{ a: 1 }], card: { name: '[[a|bad]] and [[a|bad]]' } }),
  ['warning lint.unknown_step {"step":"bad","placeholder":"[[a|bad]]"} @card.name'],
);

check(
  'an inner lookup standing in for a word is not read as a target',
  lint({ default: [{ a: 1 }, { b: 2 }], card: { name: '[[a|or:[[b]]]]' } }),
  [],
);

check(
  'definedNames gathers declarations, defaults and let names',
  definedNames({
    variables: [{ name: 'a' }],
    default: { b: 1 },
    let: [{ c: '[[a]]' }],
  }),
  ['a', 'b', 'c'],
);

/* -------------------------------------------- steps added alongside the lint */

check(
  'arithmetic, list and state steps are known steps, not typos',
  lint(
    {
      template: 't',
      default: [{ n: 1 }, { l: 'a,b' }, { e: 'light.x' }],
      card: {
        a: '[[n|add:1|sub:2|mul:3|div:4|mod:5|round|round:2|pad:3]]',
        b: '[[l|join|join:-|split|split:;|first|last|count]]',
        c: '[[e|state]] [[e|icon]] [[e|translate]]',
      },
    },
    [],
  ),
  [],
);

check('a name in defaults: counts as defined', definedNames({ template: 't', defaults: { colour: 'red' } }), [
  'colour',
]);

// `with:` and `repeat:` (#227) are steps the lint knows, and what they supply is defined.
check(
  'a repeat: body reading what the repeat supplies is not undeclared',
  lintTemplate({
    default: { lights: { domain: 'light' }, row: { entity: '[[entity]]', name: '[[name]]' } },
    card: { type: 'entities', entities: ['[[row|repeat:lights]]'] },
  }),
  [],
);
check(
  'a misspelt with: is an unknown step with the right suggestion',
  lintTemplate({ card: { x: '[[row|wiht:entity=x]]' } }).map((f) => [f.key, f.params.closest]),
  [
    ['lint.unknown_step', 'with:entity=x'],
    ['lint.undeclared', undefined],
  ],
);
