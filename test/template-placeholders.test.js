/*
 * The template's own names as placeholders (#391): `__template_name__`,
 * `__parent_template_name__`, `__root_template_name__` and `__template_path__`.
 * Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { usedVariables, diagnoseInstance } = require('../.test-build/variables.js');
const { lintTemplate } = require('../.test-build/lint.js');

const { check } = require('./check');

const warnings = [];
console.warn = (m) => warnings.push(m);

const build = (content, name, chain, variables = []) =>
  deepReplace(variables, {}, content, name, undefined, false, undefined, 0, undefined, undefined, false, {
    templateChain: chain,
  });

const CONTENT = {
  a: '[[__template_name__]]',
  b: '[[__parent_template_name__]]',
  c: '[[__root_template_name__]]',
  d: '[[__template_path__]]',
};

check('a template at the top is its own root, with no parent', build(CONTENT, 'light_tile'), {
  a: 'light_tile',
  b: '',
  c: 'light_tile',
  d: ['light_tile'],
});

check(
  'a template inside others knows its parent, its root and the way down',
  build(CONTENT, 'light_tile', ['room', 'room_stack']),
  {
    a: 'light_tile',
    b: 'room_stack',
    c: 'room',
    d: ['room', 'room_stack', 'light_tile'],
  },
);

check(
  'the path joins and takes steps like any list',
  build({ a: 'In [[__template_path__|join: > ]]', n: '[[__template_path__|count]]' }, 'c', ['a', 'b']),
  { a: 'In a > b > c', n: 3 },
);

check('no parent is a gap a default can fill', build({ a: '[[__parent_template_name__|default:none]]' }, 'top'), {
  a: 'none',
});

check(
  'the names reach a variable that uses them',
  build(
    { a: '[[message]]' },
    'cam',
    ['house'],
    [{ message: 'Problem in [[__template_name__]] (inside [[__parent_template_name__]])' }],
  ),
  { a: 'Problem in cam (inside house)' },
);

check(
  'a variable of the same name wins',
  build({ a: '[[__template_name__]]' }, 'cam', [], [{ __template_name__: 'mine' }]),
  { a: 'mine' },
);

warnings.length = 0;
check('a build that asks for none is left as it was', build({ a: 'plain' }, 'cam'), { a: 'plain' });
build(CONTENT, 'cam');
check('nothing is said about them being unset', warnings, []);

const TEMPLATE = { card: { type: 'markdown', content: '[[__template_name__]] [[__template_path__|join:/]] [[room]]' } };
check('the editors do not list them as variables to fill', usedVariables(TEMPLATE), ['room']);
check('nor call them missing', diagnoseInstance([{ room: 'x' }], TEMPLATE).missing, []);
check(
  'the template lint knows them',
  lintTemplate({
    variables: ['room'],
    card: { type: 'markdown', content: '[[x|if:__parent_template_name__]] [[__root_template_name__]]' },
  }).filter((finding) => /__/.test(JSON.stringify(finding.params))),
  [],
);
