/*
 * The substitution engine's review fixes: each case here failed before its fix.
 * Run with `npm test`.
 */
const { check } = require('./check.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { splitSites } = require('../.test-build/compiled.js');

const build = (variables, content, extras, hass) =>
  deepReplace(variables, {}, content, 't', hass, true, undefined, 0, undefined, undefined, false, extras);
const tried = (run) => {
  try {
    return run();
  } catch (error) {
    return `threw: ${error.message}`;
  }
};

// A quote somebody wrote before a placeholder that ends its string is text, not a value's quote.
check(
  'a number after a written quote at the end of a string stays in the string',
  tried(() => build([{ n: 3 }], { content: '<a title="[[n]]' })),
  { content: '<a title="3' },
);
check(
  'so does a yes or no, and a mapping as its JSON',
  tried(() => build([{ on: true }, { o: { k: 1 } }], { a: 'x "[[on]]', b: 'x "[[o]]' })),
  { a: 'x "true', b: 'x "{"k":1}' },
);
check(
  'a value ending in a quote does not break the placeholder after it',
  tried(() => build([{ title: 'Say "hi"' }, { n: '[[k]]' }, { k: 3 }], { name: '[[title]][[n]]' })),
  { name: 'Say "hi"3' },
);
check(
  'nor one a fallback fills',
  tried(() => build([{ title: 'Say "hi"' }], { name: '[[title]][[n|count]]', b: 'x "[[zz|bool]]' })),
  { name: 'Say "hi"0', b: 'x "false' },
);
check(
  'nor one filled around an unset name in a step',
  tried(() => build([{ l: [{ k: 'a', n: 1 }] }], { b: 'x "[[l|pick:k=[[who]],n|default:zz|count]]' })),
  { b: 'x "1' },
);
check('a compiled site after a written quote is marked as text', splitSites('"x \\"[[a]]"')[1].inText, true);
check('and a whole value is not', splitSites('{"k":"[[a]]"}')[1].inText, undefined);

// A placeholder as a mapping's key is always text: JSON takes nothing else there.
check(
  'a number as a key is its text',
  tried(() => build([{ level: 5 }], { colors: { '[[level]]': 'red' } })),
  { colors: { 5: 'red' } },
);
check(
  'a yes or no, a count and a fallback as keys are their text',
  tried(() => build([{ on: true }, { l: 'a,b' }], { m: { '[[on]]': 1, '[[l|count]]': 2, '[[zz|bool]]': 3 } })),
  { m: { true: 1, 2: 2, false: 3 } },
);
check(
  'a key that is an option nothing set takes its entry with it',
  tried(() => build([], { m: { '[[zz?]]': 'red', k: 1, 'a[[zz?]]': 2 } })),
  { m: { k: 1, a: 2 } },
);

// What a variable fills to is remembered between nested builds (#497) only while everything
// it reads, however far down, is the same.
{
  const variables = [{ m: '[[a]]' }, { a: '[[b]]' }, { rows: [{ b: { k: 1 } }, { b: { k: 2 } }] }];
  check(
    'a dotted name through two variables is worked out for each copy',
    build([...variables, { body: '[[m.k]]' }], { l: '[[body|repeat:rows]]' }),
    { l: [1, 2] },
  );
  check(
    'and in an item template',
    build(variables, { l: '[[body|repeat:rows]]' }, { itemTemplates: { body: { item: '[[m.k]]' } } }),
    { l: [1, 2] },
  );
}

// A variable's value is taken apart for quoted bodies (#498) once, not again by every nested build.
{
  const { hoistInlineBodies } = require('../.test-build/inline-body.js');
  const variables = [{ body: { entities: '[["[[entity]]"|repeat:rooms]]' } }, { plain: { a: ['b'] } }];
  const first = hoistInlineBodies('', variables);
  const second = hoistInlineBodies('', variables);
  check(
    'the same value is hoisted to the same object each time',
    first.variables[0].body === second.variables[0].body,
    true,
  );
  check('with its body found both times', [first.added.length, second.added.length], [1, 1]);
  check('and a value with no quoted body is handed back as it was', second.variables[1] === variables[1], true);
}

// A variable that reads itself is read as written the second time round, not worked out
// again inside itself at every level.
{
  const length = (variables, content) => JSON.stringify(build(variables, content)).length;
  check(
    'a value that reads itself through or: stays small',
    length([{ n: '[[n|or:fallback]] x' }, { fallback: 'F' }], { y: '[[n]]' }) < 10000,
    true,
  );
  check(
    'with a name nothing sets beside it too',
    length([{ n: '[[n|or:fallback]] [[unit]]' }], { y: '[[n]]' }) < 50000,
    true,
  );
  const said = new Set();
  deepReplace([{ n: '[[n|or:fallback]] x' }, { fallback: 'F' }], {}, { y: '[[n]]' }, 't', undefined, said);
  check(
    'and is still said to refer to itself',
    [...said].some((message) => message.includes('[[n]] refers to itself')),
    true,
  );
  const started = Date.now();
  build([{ a: '[[zz?]] [[b|prefix:[[a]][[a]]]]' }, { b: '1' }], { x: '[[a]]' });
  check('a value that doubles itself stops at the ceiling, not long after it', Date.now() - started < 2500, true);
  check(
    'a value built from another through or: is still filled',
    build([{ a: '' }, { b: '[[c]] room' }, { c: 'Hall' }, { o: '[[obj]]' }, { obj: { k: 1 } }], {
      n: '[[a|or:b]]',
      m: '[[o|or:b]]',
    }),
    { n: 'Hall room', m: { k: 1 } },
  );
}

// Which patterns are run against a value, and which are too slow to.
{
  const { patternIsSafe, validateDeclared } = require('../.test-build/variables.js');
  check(
    'a group that only says what kind it is can be repeated',
    ['^(?:ab)+$', '^(?:\\d{1,3}\\.){3}\\d{1,3}$', '^(ab)+$', '^(?=a)a+$'].map((pattern) => patternIsSafe(pattern)),
    [true, true, true, true],
  );
  check(
    'a repeated group holding a quantifier or a bar is still refused',
    ['^(a+)+$', '^(x|xy)*$', '^(?:a+)+$', '^(a{2,})+$', '^(a*){20}$', '^(?:a?)+$'].map((pattern) =>
      patternIsSafe(pattern),
    ),
    [false, false, false, false, false, false],
  );
  const row = '^a*a*a*a*a*a*a*a*a*a*a*a*a*a*b$';
  check('a row of open-ended quantifiers is refused for text it would crawl over', patternIsSafe(row, 20), false);
  check('and two of them are fine on an ordinary value', patternIsSafe('^[a-z_]+\\.[a-z0-9_]+$', 1000), true);
  const template = (pattern) => ({ card: { type: 'x', v: '[[v]]' }, variables: [{ name: 'v', pattern }] });
  const started = Date.now();
  check('such a pattern is not run at all', validateDeclared([{ v: 'a'.repeat(20) }], template(row)), []);
  check('so the editor does not wait for it', Date.now() - started < 1000, true);
  check(
    'an address pattern is checked now',
    validateDeclared([{ v: '10.0.0' }], template('^(?:\\d{1,3}\\.){3}\\d{1,3}$')).map((bad) => bad.name),
    ['v'],
  );
}

// The config a card is handed is made of ordinary objects, whatever the build did to it.
{
  const plain = (node) =>
    !node || typeof node !== 'object'
      ? true
      : (Array.isArray(node) || Object.getPrototypeOf(node) === Object.prototype) && Object.values(node).every(plain);
  const optional = build([{ e: 'light.a' }], { type: 'tile', entity: '[[e]]', name: '[[n?]]', tap: { a: 1 } });
  check('a card with an option taken out can be asked hasOwnProperty', optional.hasOwnProperty('entity'), true);
  check('and is ordinary objects all the way down', plain(optional), true);
  check(
    'so is one a repeat built',
    plain(build([{ rows: ['a.b'] }, { row: { entity: '[[item]]' } }], { entities: ['[[row|repeat:rows]]'] })),
    true,
  );
  check('and one emptied altogether', plain(build([], { a: '[[zz?]]' })), true);
  const { mergeOver, applyListEdits } = require('../.test-build/list-edits.js');
  const waiting = mergeOver({ list: '[[rooms]]', o: { k: 1 } }, { list: { __append__: ['x'] } }, true);
  check('and what a list edit left for the build', plain(applyListEdits(waiting)), true);

  // A `__proto__` key is a key wherever a config is copied, and reaches no prototype.
  const own = (node) => Object.prototype.hasOwnProperty.call(node, '__proto__');
  const written = (extra) => JSON.parse(`{"type":"x","__proto__":{"polluted":1}${extra}}`);
  const cases = {
    escaped: build([{ a: 1 }], written(',"name":"[[!a]]"')),
    optional: build([{ a: 1 }], written(',"name":"[[zz?]]","n":"[[a]]"')),
    styled: build([{ a: 1 }], written(',"n":"[[a]]","card_mod":{"style":"a"}')),
    repeated: build([{ rows: [written('')] }, { row: '[[item]]' }], { l: ['[[row|repeat:rows]]'] }).l[0],
    inline: build([{ l: ['a'] }], written(',"n":"[[\\"<[[item]]>\\"|repeat:l]]"')),
  };
  for (const [name, built] of Object.entries(cases)) {
    check(`a __proto__ key stays a key: ${name}`, [own(built), built.polluted, plain(built)], [true, undefined, true]);
  }
  check('and nothing reached Object.prototype', {}.polluted, undefined);
}

// Every stylesheet in a card is shielded, a quoted body in one included (#498).
{
  const hass = {
    states: { 'light.css': { state: 'on', attributes: { friendly_name: 'x; background: url(//evil/?' } } },
    entities: {},
  };
  const shielded = 'a{--n:x background: urlevil?}';
  check(
    'a name filled into a quoted body in a style is shielded as in the two-line form',
    [
      build([], { card_mod: { style: '[["a{--n:[[e|friendly_name]]}"|with:e=light.css]]' } }, undefined, hass),
      build(
        [{ tmp: 'a{--n:[[e|friendly_name]]}' }],
        { card_mod: { style: '[[tmp|with:e=light.css]]' } },
        undefined,
        hass,
      ),
    ],
    [{ card_mod: { style: shielded } }, { card_mod: { style: shielded } }],
  );
  check(
    'several styles in one card are each built, shielded and put back where they were',
    build(
      [{ e: 'light.css' }, { c: 'red' }],
      {
        style: '[[zz?]]',
        elements: [
          { style: { top: '1%', color: '[[c]]' } },
          { style: { top: '2%' } },
          { styles: { card: [{ color: '[[e|friendly_name]]' }] }, card_mod: { style: '[[zz?]]' } },
          { type: 'custom:decluttering-card-plus', style: '[[c]]' },
        ],
        name: '[[e|friendly_name]]',
      },
      undefined,
      hass,
    ),
    {
      elements: [
        { style: { top: '1%', color: 'red' } },
        { style: { top: '2%' } },
        { styles: { card: [{ color: 'x background: urlevil?' }] } },
        { type: 'custom:decluttering-card-plus', style: 'red' },
      ],
      name: 'x; background: url(//evil/?',
    },
  );
}

// What the editor's diagnosis reads.
{
  const V = require('../.test-build/variables.js');
  const card = { type: 'x', name: '[[extra?]]' };
  const asList = {
    card,
    variables: [
      { name: 'mode', default: 'a' },
      { name: 'extra', show_if: 'mode=a' },
    ],
  };
  const asMapping = { card, variables: { mode: { default: 'a' }, extra: { show_if: 'mode=a' } } };
  check(
    'a variable only a show_if reads is used, declarations written as a list or as a mapping (#223)',
    [V.diagnoseTemplate(asList).unused, V.diagnoseTemplate(asMapping).unused],
    [[], []],
  );
  check('and a card setting it has not set it for nothing', V.diagnoseInstance([{ mode: 'b' }], asMapping).unused, []);
  const named = {
    card: { type: 'tile', entity: '[[e]]' },
    name: 'Room [[room]]',
    variables: [{ name: 'e' }, { name: 'room' }],
  };
  check("a variable the template's name: shows is used", V.diagnoseTemplate(named).unused, []);
  check(
    'and is neither unused nor missing on a card',
    [V.diagnoseInstance([{ e: 'light.a' }, { room: 'Hall' }], named), V.diagnoseInstance([{ e: 'light.a' }], named)],
    [
      { missing: [], unused: [], required: [] },
      { missing: [], unused: [], required: [] },
    ],
  );
  check(
    'a mapping reached through one of its keys is still used, and another is not',
    V.diagnoseInstance([{ room: { light: 'light.a' } }, { roomy: 1 }], { card: { e: '[[room.light]]' } }).unused,
    ['roomy'],
  );
  check(
    'a field called constructor gets its default like any other',
    V.filledObject({ a: 1 }, { constructor: 'd', b: 2 }, false).value,
    { a: 1, constructor: 'd', b: 2 },
  );
  check(
    'and __this__ reads only fields that are there',
    V.filledObject({}, { label: '[[__this__.toString]]' }, false).value,
    { label: '[[__this__.toString]]' },
  );
  const typed = { card: { c: '[[cols]]' }, variables: [{ name: 'cols', type: 'number' }] };
  check(
    'a list holding one list is judged like any other value',
    [[[1, 2]], [1, 2]].map((cols) => V.validateDeclared([{ cols }], typed).length),
    [1, 1],
  );
}

// What a step has complained about is remembered, but not without end.
{
  const { applyTransform } = require('../.test-build/variables.js');
  const { onWarning } = require('../.test-build/warnings.js');
  const quiet = console.warn;
  console.warn = () => {};
  let heard = 0;
  const stop = onWarning(() => (heard += 1));
  applyTransform('round', 'review-bad-0');
  applyTransform('round', 'review-bad-0');
  check('a step says what is wrong with a value once', heard, 1);
  for (let index = 1; index <= 600; index += 1) applyTransform('round', `review-bad-${index}`);
  applyTransform('round', 'review-bad-0');
  stop();
  console.warn = quiet;
  check('and starts its list over rather than keeping every value a page ever saw', heard, 602);
}

// Placeholders with a placeholder inside them are found by one read of the text, and they
// are the same ones the expression it replaces found.
{
  const { replaceAround } = require('../.test-build/deep-replace.js');
  const NESTED_ONCE = '(?:[^[\\]]|\\[\\[[^[\\]]*\\]\\])*\\[\\[[^[\\]]*\\]\\](?:[^[\\]]|\\[\\[[^[\\]]*\\]\\])*';
  const old = {
    true: new RegExp(`"\\[\\[(${NESTED_ONCE})\\]\\]"`, 'g'),
    false: new RegExp(`\\[\\[(${NESTED_ONCE})\\]\\]`, 'g'),
  };
  const mark = (match, inside, offset) => `<${offset}:${inside}>`;
  let seed = 7;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pieces = [
    '[[',
    ']]',
    '[',
    ']',
    '"',
    'a',
    '|x:',
    '[[b]]',
    '"[[',
    ']]"',
    ' ',
    '[[c|d:[[e]]]]',
    '"[[f|g:[[h]]]]"',
  ];
  let differing = 0;
  for (let run = 0; run < 4000; run += 1) {
    let text = '';
    for (let n = 1 + Math.floor(random() * 9); n > 0; n -= 1) text += pieces[Math.floor(random() * pieces.length)];
    for (const whole of [true, false]) {
      if (replaceAround(text, whole, mark) !== text.replace(old[whole], mark)) differing += 1;
    }
  }
  check('the scan finds what the expression found, on 4000 texts', differing, 0);
  const started = Date.now();
  replaceAround(`[[a|x:${'[[u]]'.repeat(40000)} `, false, mark);
  check('and one that never closes is given up on at once', Date.now() - started < 200, true);
}

// A fill's dotted names are worked out from the same overlay the fill itself is given.
{
  const itemTemplates = { it: { item: { entity: '[[ent]]', up: '[[shout]]' }, let: { shout: '[[ent|upper]]' } } };
  check(
    'an overlay entry that names itself means the value outside, for the dotted name too (#235)',
    build(
      [{ over: { ent: '[[ent]]' } }, { ent: 'light.a' }, { thing: '[[it|with:over]]' }],
      { whole: '[[thing]]', dotted: '[[thing.shout]]' },
      { itemTemplates },
    ),
    { whole: { entity: 'light.a', up: 'LIGHT.A' }, dotted: 'LIGHT.A' },
  );
  check(
    'a fill with more text after it is not read as one fill with a longer argument',
    build(
      [{ thing: '[[it|with:ent=light.a]] and [[u]]' }, { u: 'U' }],
      { dotted: '[[thing.shout]]' },
      { itemTemplates },
    ),
    { dotted: '[[thing.shout]]' },
  );
  check(
    'and one that is the whole value still gives its dotted names',
    build([{ thing: '[[it|with:ent=light.[[u]]]]' }, { u: 'a' }], { dotted: '[[thing.shout]]' }, { itemTemplates }),
    { dotted: 'LIGHT.A' },
  );
}

// A quoted body with a bare with (#314) is taken out like one with an argument (#498).
{
  const { hoistInlineBodies, restoreInlineBodies } = require('../.test-build/inline-body.js');
  check(
    'a quoted body with a bare with is filled from the card',
    build([{ e: 'x' }], { name: '[["n:[[e|upper]]"|with]]', opt: '[["n:[[e]]"|with?]]', lit: '[["with"|upper]]' }),
    { name: 'n:X', opt: 'n:x', lit: 'WITH' },
  );
  check(
    'a step that only starts with the word is not one',
    hoistInlineBodies('[["a"|within]] [["b"|repeated:x]]', []).added,
    [],
  );
  const names = ['a', 'bb', 'ccc', 'dddd'].map(
    (body) => Object.keys(hoistInlineBodies(`[["${body}"|repeat:l]]`, []).added[0])[0],
  );
  check(
    'every hidden name is the same length, so none is the start of another',
    new Set(names.map((name) => name.length)).size,
    1,
  );
  check(
    'and a body left standing is put back as written',
    restoreInlineBodies(`[[${names[1]}|repeat:l]]`),
    '[["bb"|repeat:l]]',
  );
}

// Values that lead back to each other through a mapping are given up on in good time: every
// value read on the way used to fill a megabyte of its own.
{
  const started = Date.now();
  const built = build(
    [{ a: '[[m]]' }, { b: '[[m.k|pad:[[m.j]]]]' }, { m: { k: '[[body|join]]', j: '' } }, { body: '[[m]][[b]]' }],
    [{ x: '[[a]]' }],
  );
  check('a loop through a mapping ends in good time', Date.now() - started < 3000, true);
  check('and what it built is no more than the ceiling allows', JSON.stringify(built).length < 2000000, true);
  check(
    'a build after it has its whole allowance again',
    build([{ big: 'x'.repeat(200000) }], { a: '[[big]]', b: '[[big]]', c: '[[big]]' }).c.length,
    200000,
  );
}

// Brackets opened in one value and closed in another are not a placeholder between them.
check(
  'a [[ in one value and a step and ]] in a later one leave what is between them alone',
  tried(() => build([{ body: '|exists]]' }], { x: '[[', y: { z: '[[body|last]]' } })),
  { x: '[[', y: { z: '|exists]]' } },
);
check(
  'so do an optional mark and a default: there',
  tried(() => build([], { a: 'see [[ note', b: { c: 'or this?]]', d: 'x|default:y]]' }, e: '[[zz|default:"q"]]' })),
  { a: 'see [[ note', b: { c: 'or this?]]', d: 'x|default:y]]' }, e: 'q' },
);

// Home Assistant's markers come off a long text in one read, and come off as they always did.
{
  const { restoreHaText, markHaText, HA_MARK } = require('../.test-build/variables.js');
  const old = (text) => {
    if (!text.includes(HA_MARK)) return text;
    let out = '';
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (ch !== HA_MARK) {
        out += ch;
        continue;
      }
      if (out.endsWith(HA_MARK)) continue;
      let j = i + 1;
      while (text[j] === HA_MARK) j += 1;
      const next = text[j];
      const prev = out[out.length - 1];
      const opens =
        (next === '[' && out.endsWith('[[')) ||
        (next === '{' && (prev === '{' || prev === '$')) ||
        (prev === '{' && (next === '%' || next === '#'));
      if (opens) out += HA_MARK;
    }
    return out;
  };
  let seed = 11;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pieces = ['[', ']', '{', '}', '$', '%', '#', 'a', ' ', HA_MARK, HA_MARK, HA_MARK + HA_MARK, '[[', '{{'];
  let differing = 0;
  for (let run = 0; run < 6000; run += 1) {
    let text = '';
    for (let n = Math.floor(random() * 12); n > 0; n -= 1) text += pieces[Math.floor(random() * pieces.length)];
    if (restoreHaText(text) !== old(text)) differing += 1;
    if (restoreHaText(markHaText(text)) !== old(markHaText(text))) differing += 1;
  }
  check('the markers come off 6000 texts as they did before', differing, 0);
  const long = markHaText('{"a":[1,2]}'.repeat(30000));
  const started = Date.now();
  restoreHaText(long);
  check('and off half a megabyte of JSON in good time', Date.now() - started < 500, true);
}

check(
  'a quoted name or an argument that only reads as one across two values is left alone',
  tried(() => [build([], ['[["', { x: '"]]' }]), build([{ a: 'v' }], { p: '[[a|default:x', q: 'y]]', r: '[[a]]' })]),
  [['[["', { x: '"]]' }], { p: '[[a|default:x', q: 'y]]', r: 'v' }],
);
{
  const said = new Set();
  deepReplace([{ e: 'x'.repeat(5000) }], {}, { a: '[[e|friendly_name]]' }, 't', {}, said);
  check(
    'a warning names a long value by its start',
    [...said].every((message) => message.length < 1500),
    true,
  );
}
