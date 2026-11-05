/*
 * Quoted text in placeholders (#398): a quoted name is its own value, and a quoted step
 * argument is that text with the quotes off. Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { quotedText, usedVariables, diagnoseInstance } = require('../.test-build/variables.js');
const { lintTemplate } = require('../.test-build/lint.js');
const { readsIn } = require('../.test-build/unread.js');
const { variableNames } = require('../.test-build/rename-variable.js');

const { check } = require('./check');

const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(m);

const hass = { states: { 'sensor.something': { state: '21', attributes: {} } }, entities: {} };

check(
  'a quoted name is its own value, with or without variables to go with it',
  [
    deepReplace(
      [],
      {},
      {
        a: '[["sensor.something"|if_exists]]',
        b: "[['text'|upper]]",
        c: '[["a b"]]',
        d: 'x [["a b"|upper]] y',
        e: '[["sensor.nothing"|if_exists|default:"none here"]]',
        f: '[["sensor.nothing"|if_exists?]]',
      },
      undefined,
      hass,
    ),
    deepReplace([{ room: 'Hall' }], {}, { a: '[["Hall"|lower]] [[room]]' }),
  ],
  [{ a: 'sensor.something', b: 'TEXT', c: 'a b', d: 'x A B y', e: 'none here' }, { a: 'hall Hall' }],
);

check(
  'a variable named like the text in quotes does not answer for it',
  deepReplace([{ hall: 'nope' }], {}, { a: "[['hall']]" }),
  { a: 'hall' },
);

check(
  'empty quotes are a gap, so a default stands in',
  deepReplace([], {}, { a: '[[""|default:"empty"]]', b: "[[''?]]", keep: 1 }),
  { a: 'empty', keep: 1 },
);

check(
  "JSON's own quotes are never a quoted name: a list of lists is left alone",
  deepReplace([{ v: 'a' }], {}, { pair: [['[[v]]']], rows: [['b', 'c']] }),
  { pair: [['a']], rows: [['b', 'c']] },
);

check(
  'quoted step arguments lose their quotes',
  deepReplace(
    [{ v: 'foobar' }, { l: ['a', 'b'] }, { other: 'oob' }],
    {},
    {
      contains: '[[v|contains:"foo"]]',
      containsVar: '[[v|contains:[[other]]]]',
      def: '[[u|default:"foo bar"]]',
      defBare: '[[u|default:plain]]',
      cond: '[[v|if:v="foobar"]]',
      join: '[[l|join:", "]]',
      split: '[["a; b"|split:"; "|join:+]]',
      replace: '[[v|replace:"oo":" 0 "]]',
      replaceBare: '[[v|replace:o:0]]',
      replaceColon: '[["a: b"|replace:": ":-]]',
      pad: '[[v|prefix:" "|suffix:": "]]',
      single: "[[v|prefix:'> ']]",
    },
  ),
  {
    contains: true,
    containsVar: true,
    def: 'foo bar',
    defBare: 'plain',
    cond: 'foobar',
    join: 'a, b',
    split: 'a+b',
    replace: 'f 0 bar',
    replaceBare: 'f00bar',
    replaceColon: 'a-b',
    pad: ' foobar: ',
    single: '> foobar',
  },
);

check(
  'or: with quotes stands in with the text rather than a variable of that name',
  deepReplace(
    [{ v: 'foobar' }, { lit: 'from the variable' }],
    {},
    {
      a: '[[u|or:"lit"]]',
      b: '[[v|or:"lit"]]',
      c: '[[u|or:lit]]',
    },
  ),
  { a: 'lit', b: 'foobar', c: 'from the variable' },
);

check(
  'quotedText reads both spellings of a quote and leaves anything else alone',
  [
    quotedText('"a b"'),
    quotedText("'a b'"),
    quotedText('\\"a b\\"'),
    quotedText('\\"say \\"hi\\"\\"'),
    quotedText('plain'),
    quotedText('"open'),
    quotedText('"'),
  ],
  ['a b', 'a b', 'a b', 'say "hi"', null, null, null],
);

warnings.length = 0;
deepReplace([], {}, { a: '[["sensor.nothing"|if_exists]]', b: '[["x"|bogus]]' }, undefined, hass);
check(
  'a quoted name is never called unset, and the warnings show its quotes as written',
  [
    warnings.some((w) => w.includes('nothing gives a value to')),
    warnings.some((w) => w.includes('[["sensor.nothing"|if_exists]]')),
    warnings.some((w) => w.includes('[["x"|bogus]]') && w.includes('"bogus" is not a step')),
  ],
  [false, true, true],
);

const template = {
  card: {
    type: 'tile',
    a: '[["sensor.x"|if_exists|or:"y"]]',
    b: "[['lit'|upper]]",
    c: '[[v|or:"z"]]',
    d: '[[w|if:v="q"]]',
  },
  default: [{ v: 1 }, { w: 2 }],
};

check(
  'quoted names and quoted or: are not variables to any of the scans',
  [
    [...usedVariables(template)],
    diagnoseInstance({ type: 'custom:decluttering-card-plus', template: 't' }, template, 't').missing,
    lintTemplate(template),
    readsIn(template.card),
    variableNames(template),
  ],
  [['v', 'w'], [], [], ['v', 'w'], ['v', 'w']],
);

/* ------------------------------------------- or:[[name]] reads like other steps' */

check(
  'or:[[name]] is or:name, and or:[[chain]] stands in with what the chain gives',
  deepReplace(
    [{ other: 'O' }, { sp: 'a b' }, { set: 'S' }, { l: ['x', 'y'] }, { c: 'C' }, { v: '[[nope|or:[[other]]]]' }],
    {},
    {
      bare: '[[nope|or:[[other]]]]',
      bare_optional: '[[nope|or:[[other?]]]]',
      falls_through: '[[nope|or:[[missing]]|default:z]]',
      chain: '[[nope|or:[[sp|upper]]]]',
      chain_falls_through: '[[nope|or:[[missing|upper]]|default:z]]',
      kept: '[[set|or:[[other]]]]',
      in_text: 'x [[nope|or:[[other]]]] y',
      list: '[[nope|or:[[l]]]]',
      nested: '[[nope|or:[[missing|or:[[c]]]]]]',
      from_a_variable: '[[v]]',
      dropped: { k: '[[nope|or:[[missing]]?]]', keep: 1 },
    },
    't',
    hass,
    true,
  ),
  {
    bare: 'O',
    bare_optional: 'O',
    falls_through: 'z',
    chain: 'A B',
    chain_falls_through: 'z',
    kept: 'S',
    in_text: 'x O y',
    list: ['x', 'y'],
    nested: 'C',
    from_a_variable: 'O',
    dropped: { keep: 1 },
  },
);

console.warn = realWarn;
