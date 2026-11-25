/*
 * A `with:` or `repeat:` body written in place, in quotes (#498): `[["[[entity]]"|repeat:list]]`
 * does what `tmp: '[[entity]]'` and `[[tmp|repeat:list]]` do, without the extra variable.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { hoistInlineBodies, INLINE_PREFIX } = require('../.test-build/inline-body.js');

const { check } = require('./check');

const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(m);

const list = [{ entity: 'light.a' }, { entity: 'light.b' }];

check(
  'the two-line form still works (baseline)',
  deepReplace([{ my_list: list }, { tmp: '[[entity]]' }], {}, { entities: '[[tmp|repeat:my_list]]' }).entities,
  ['light.a', 'light.b'],
);

check(
  'a quoted body repeats as the two-line form does',
  deepReplace([{ my_list: list }], {}, { entities: '[["[[entity]]"|repeat:my_list]]' }).entities,
  ['light.a', 'light.b'],
);

check(
  'the reporter spelling, with a bang inside, means the same',
  deepReplace([{ my_list: list }], {}, { entities: '[["[[!entity]]"|repeat:my_list]]' }).entities,
  ['light.a', 'light.b'],
);

check(
  'single quotes work too',
  deepReplace([{ my_list: list }], {}, { entities: "[['[[entity]]'|repeat:my_list]]" }).entities,
  ['light.a', 'light.b'],
);

check(
  'text around the inner placeholder is kept per copy',
  deepReplace([{ my_list: list }], {}, { entities: '[["sensor.[[entity]]_power"|repeat:my_list]]' }).entities,
  ['sensor.light.a_power', 'sensor.light.b_power'],
);

check(
  'a card-level variable of the same name does not leak into the body',
  deepReplace([{ my_list: list }, { entity: 'light.card' }], {}, { entities: '[["[[entity]]"|repeat:my_list]]' })
    .entities,
  deepReplace(
    [{ my_list: list }, { entity: 'light.card' }, { tmp: '[[entity]]' }],
    {},
    {
      entities: '[[tmp|repeat:my_list]]',
    },
  ).entities,
);

check(
  'index and count reach the body',
  deepReplace([{ my_list: list }], {}, { rows: '[["[[index]]/[[count]]"|repeat:my_list]]' }).rows,
  deepReplace([{ my_list: list }, { tmp: '[[index]]/[[count]]' }], {}, { rows: '[[tmp|repeat:my_list]]' }).rows,
);

check(
  'with: takes a quoted body and its pairs',
  deepReplace([], {}, { name: '[["Hello [[who]]"|with:who=World]]' }).name,
  'Hello World',
);

check(
  'a condition after the repeat still picks the copies',
  deepReplace(
    [
      {
        my_list: [
          { entity: 'light.a', on: true },
          { entity: 'light.b', on: false },
        ],
      },
    ],
    {},
    { entities: '[["[[entity]]"|repeat:my_list|if:on]]' },
  ).entities,
  ['light.a'],
);

check(
  'a quoted body in a list of other entries splices in place',
  deepReplace([{ my_list: list }], {}, { entities: ['light.first', '[["[[entity]]"|repeat:my_list]]'] }).entities,
  ['light.first', 'light.a', 'light.b'],
);

check(
  'a quoted body inside a variable value works when the value is used',
  deepReplace([{ my_list: list }, { rows: '[["[[entity]]"|repeat:my_list]]' }], {}, { entities: '[[rows]]' }).entities,
  ['light.a', 'light.b'],
);

check(
  'a quoted body nested in another quoted body repeats inside each copy',
  deepReplace(
    [
      {
        groups: [
          { name: 'g1', items: [{ v: 1 }, { v: 2 }] },
          { name: 'g2', items: [{ v: 3 }] },
        ],
      },
    ],
    {},
    { out: '[["[[\'[[name]]-[[v]]\'|repeat:items]]"|repeat:groups|flat]]' },
  ).out,
  ['g1-1', 'g1-2', 'g2-3'],
);

check(
  'a double bang in a body writes the brackets themselves',
  deepReplace([{ l: [{ entity: 'a' }] }], {}, { e: '[["x [[!!entity]] [[entity]]"|repeat:l]]' }).e,
  ['x [[entity]] a'],
);

// Things that must not change.
check(
  'a quoted literal with an ordinary step is left to #398',
  deepReplace([], {}, { e: '[["sensor.hall"|upper]]' }).e,
  'SENSOR.HALL',
);

check(
  'a plain repeat is untouched',
  deepReplace([{ my_list: list }, { tmp: '[[entity]]' }], {}, { e: '[[tmp|repeat:my_list]]' }).e,
  ['light.a', 'light.b'],
);

check('an escaped placeholder outside a body stays escaped', deepReplace([], {}, { e: '[[!x]]' }).e, '[[x]]');

// The hoisting itself.
const plain = { a: 'nothing here', b: ['[[x]]'] };
const hoisted = hoistInlineBodies(plain, []);
check('content with no quoted body comes back as the same object', hoisted.content === plain, true);

const one = hoistInlineBodies({ a: '[["[[!e]]"|repeat:l]]' }, []);
const hidden = Object.keys(one.added[0] ?? {})[0] ?? '';
check('a hoisted site points at a hidden variable', one.content.a, `[[${hidden}|repeat:l]]`);
check('the hidden name has the prefix', hidden.startsWith(INLINE_PREFIX), true);
check('the hidden variable holds the body, one bang taken off', one.added[0]?.[hidden], '[[e]]');

const same = { a: '[["[[e]]"|repeat:l]]' };
check(
  'the same content object hoists to the same object every build',
  hoistInlineBodies(same, []).content === hoistInlineBodies(same, []).content,
  true,
);

check('an unclosed quoted body is left as written', hoistInlineBodies({ a: '[["[[e]]|repeat:l]]' }, []).added, []);

check(
  'a long unclosed run is scanned in linear time',
  (() => {
    const text = '[["' + '[['.repeat(20000);
    const start = Date.now();
    hoistInlineBodies({ a: text }, []);
    return Date.now() - start < 500;
  })(),
  true,
);

check(
  'a quoted body that cannot be filled is left as written',
  deepReplace([], {}, { e: '[["[[!x]]"|repeat:nope]]' }, undefined, undefined, true).e,
  '[["[[!x]]"|repeat:nope]]',
);

warnings.length = 0;
deepReplace([], {}, { e: '[["sensor.[[x]]"|repeat:nope2]]' });
check(
  'its warning names it as written, not by its hidden name',
  warnings.some((w) => String(w).includes('[["sensor.[[x]]"|repeat:nope2]]') && !String(w).includes(INLINE_PREFIX)),
  true,
);

check(
  'no warnings from any of it',
  warnings.filter((w) => String(w).includes('inline')),
  [],
);

warnings.length = 0;
deepReplace([{ l: [{ e: 1 }] }], {}, { a: '[["[[!e]]"|repeat:l]]', b: '[["[[e]]"|repeat:gone]]' });
check(
  'two spellings of one body each keep their own words in a warning',
  warnings.some((w) => String(w).includes('[["[[e]]"|repeat:gone]]')),
  true,
);

console.warn = realWarn;

// The card editor and the health check read a quoted body as they read the two-line form.
{
  const { diagnoseInstance, usedVariables } = require('../.test-build/variables.js');
  const { structureNames } = require('../.test-build/structure.js');
  const diagnose = (vars, template) =>
    diagnoseInstance(
      vars,
      template,
      structureNames(template, vars).map((name) => ({ [name]: null })),
    );
  const vars = [{ my_list: [{ entity: 'light.a' }] }];
  check(
    'a quoted repeat body leaves nothing missing',
    diagnose(vars, { card: { entities: '[["[[entity]]"|repeat:my_list]]' } }).missing,
    [],
  );
  check(
    'a quoted with: body leaves its pair names not missing',
    diagnose([], { card: { title: '[["Hi [[who]]"|with:who=x]]' } }).missing,
    [],
  );
  check(
    'a name a quoted body reads from the card is still missing when unset',
    diagnose(vars, { card: { entities: '[["[[entity]] [[suffix]]"|repeat:my_list]]' } }).missing,
    ['suffix'],
  );
  check(
    'usedVariables sees through a quoted body, without the hidden name',
    usedVariables({ card: { e: '[["[[entity]]"|repeat:my_list]]' } }).filter((n) => n.startsWith(INLINE_PREFIX)),
    [],
  );
}
