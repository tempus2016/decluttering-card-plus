/*
 * #485: an object selector field's `default:` can read another field of its own entry with
 * `[[__this__.<field>]]` - what the card set there, else that field's own default - for a
 * single object and for each entry of a list. Run with `npm test`.
 */
const { check } = require('./check');
const { resolveVariables, variableValues } = require('../.test-build/variables');
const deepReplace = require('../.test-build/deep-replace').default;
const { variableRows } = require('../.test-build/trace');

console.warn = () => {};

const object = (fields, multiple = false) => ({
  variables: [{ name: 'o', selector: { object: multiple ? { multiple: true, fields } : { fields } } }],
});
const values = (variables, template) => variableValues(resolveVariables(variables, template)).o;
const build = (variables, template, content, extras) =>
  deepReplace(
    JSON.parse(JSON.stringify(variables)),
    template,
    content,
    'card',
    undefined,
    false,
    undefined,
    0,
    undefined,
    undefined,
    false,
    extras,
  );

/* ------------------------------------------------------------ a single object */
const single = object({
  name: { selector: { text: {} } },
  entity: { selector: { entity: {} }, default: 'sensor.[[__this__.name]]_[[suffix]]' },
});
check('a single object: the default reads the field the card set', values([{ o: { name: 'dog' } }], single), {
  name: 'dog',
  entity: 'sensor.dog_[[suffix]]',
});
check(
  'a single object: the rest of the default is left for the build',
  build([{ o: { name: 'dog' } }, { suffix: 'x' }], single, { e: '[[o.entity]]' }),
  { e: 'sensor.dog_x' },
);
check(
  'a single object the card never sets: the reference reads the other default',
  values([], object({ a: { default: 'one' }, b: { default: '[[__this__.a]]-two' } })),
  { a: 'one', b: 'one-two' },
);

/* ------------------------------------------------------------ a list of objects */
const list = object(
  {
    name: { selector: { text: {} } },
    bg: { default: 'red' },
    fg: { default: '[[__this__.bg]]' },
  },
  true,
);
check(
  'each entry of a list reads its own fields, and a field the card sets wins',
  values([{ o: [{ name: 'dog' }, { name: 'cat', bg: 'yellow' }, { name: 'eel', bg: 'blue', fg: 'purple' }] }], list),
  [
    { name: 'dog', bg: 'red', fg: 'red' },
    { name: 'cat', bg: 'yellow', fg: 'yellow' },
    { name: 'eel', bg: 'blue', fg: 'purple' },
  ],
);
check('an unset list stays unset', values([], list), undefined);

/* ------------------------------------------------------------ chains and loops */
check(
  'a default reads a field whose own default reads another, in the order they need',
  values(
    [{ o: { a: 'x' } }],
    object({ c: { default: '[[__this__.b]]-c' }, b: { default: '[[__this__.a]]-b' }, a: {} }),
  ),
  { a: 'x', b: 'x-b', c: 'x-b-c' },
);
const loop = object({ a: { default: '[[__this__.b]]' }, b: { default: '[[__this__.a]]!' }, c: { default: 'z' } });
check('fields that read each other in a loop are left as written, and the rest still fill', values([], loop), {
  a: '[[__this__.b]]',
  b: '[[__this__.a]]!',
  c: 'z',
});
check('and the build reads them as unset variables, without hanging', build([], loop, { a: '[[o.a]]', c: '[[o.c]]' }), {
  a: '[[__this__.b]]',
  c: 'z',
});
check('a field reading itself is a loop too', values([], object({ a: { default: 'x[[__this__.a]]' } })), {
  a: 'x[[__this__.a]]',
});

/* ------------------------------------------------------------ unset fields */
const unsetRead = object({ name: {}, label: { default: '[[__this__.name|default:nobody]]' } });
check(
  'a field nothing sets reads as unset, so default: stands in',
  build([{ o: {} }], unsetRead, { v: '[[o.label]]' }),
  { v: 'nobody' },
);
check('and once the card sets it, it is read', build([{ o: { name: 'Ann' } }], unsetRead, { v: '[[o.label]]' }), {
  v: 'Ann',
});
check(
  'or: on an unset field works as it does on an unset variable',
  build([{ o: {} }, { fallback: 'fb' }], object({ name: {}, label: { default: '[[__this__.name|or:fallback]]' } }), {
    v: '[[o.label]]',
  }),
  { v: 'fb' },
);

/* ------------------------------------------------------------ steps after the reference */
const stepped = object({ name: {}, shout: { default: '[[__this__.name|upper]] [[__this__.name|lower]]!' } }, true);
check(
  'steps after the reference become steps on a quoted value',
  values([{ o: [{ name: 'Dog' }] }], stepped)[0].shout,
  "[['Dog'|upper]] [['Dog'|lower]]!",
);
check('and the build runs them', build([{ o: [{ name: 'Dog' }] }], stepped, { v: '[[o|json]]' }), {
  v: '[{"name":"Dog","shout":"DOG dog!"}]',
});
check(
  'a value with a quote of its own goes in as a variable instead, and the steps still run',
  build([{ o: [{ name: "it's" }] }], stepped, { v: '[[o|json]]' }),
  { v: `[{"name":"it's","shout":"IT'S it's!"}]` },
);

/* ------------------------------------------------------------ whole values keep their type */
const typed = object({
  n: {},
  m: {},
  b: {},
  copy_n: { default: '[[__this__.n]]' },
  copy_m: { default: '[[__this__.m]]' },
  copy_b: { default: '[[__this__.b]]' },
});
check(
  'a whole-value reference is the value itself, not its text',
  values([{ o: { n: 5, m: { a: 1 }, b: false } }], typed),
  { n: 5, m: { a: 1 }, b: false, copy_n: 5, copy_m: { a: 1 }, copy_b: false },
);
check(
  'a number with steps keeps its type through the build',
  build([{ o: { n: 5 } }], object({ n: {}, twice: { default: '[[__this__.n|mul:2]]' } }), { v: '[[o.twice]]' }),
  { v: 10 },
);

/* ------------------------------------------------------------ values that look like syntax */
const tricky = object({
  name: {},
  quiet: { default: '<[[__this__.name|lower]]>' },
  plain: { default: '<[[__this__.name]]>' },
});
for (const name of ['A|B', 'x]]y', 'say "hi" it\'s', 'a[[b]]c', 'why?', 'back\\slash']) {
  check(
    `a value with syntax in it is neither broken nor read as a placeholder: ${name}`,
    build([{ o: { name } }, { b: 'B' }], tricky, { q: '[[o.quiet]]', p: '[[o.plain]]' }),
    // Exactly what the same field reads as by its own name, a placeholder inside it included.
    build([{ o: { name } }, { b: 'B' }], tricky, { q: '<[[o.name|lower]]>', p: '<[[o.name]]>' }),
  );
}

/* ------------------------------------------------------------ __this__ elsewhere */
check(
  '__this__ outside a field default reads as an unset variable, as before',
  build([], {}, { v: '[[__this__.name|default:unset]]' }),
  { v: 'unset' },
);
check(
  "a card value with __this__ in it is the card's, not read",
  values([{ o: [{ name: 'dog', bg: '[[__this__.name]]' }] }], list)[0].fg,
  '[[__this__.name]]',
);

/* ------------------------------------------------------------ the report */
check(
  'the report shows each entry filled from its own fields',
  variableRows([{ o: [{ name: 'dog' }] }], list).find((row) => row.variable === 'o').value,
  [{ name: 'dog', bg: 'red', fg: 'red' }],
);

/* ------------------------------------------------------------ the issue's example */
const issue = {
  types: { color_picker: { selector: { text: {} } } },
  variables: [
    { name: 'detect_suffix', default: 'occupancy' },
    {
      name: 'detect_items',
      selector: {
        object: {
          multiple: true,
          fields: {
            name: { selector: { text: {} } },
            entity: { selector: { entity: {} }, default: 'sensor.[[__this__.name]]_[[detect_suffix]]' },
            bg_color: { type: 'color_picker', default: 'red' },
            fg_color: { type: 'color_picker', default: '[[__this__.bg_color|set_color]]' },
          },
        },
      },
    },
  ],
};
const itemTemplates = { set_color: { function: 'dark[[value]]' } };
check(
  "the issue's example, end to end",
  build(
    [
      {
        detect_items: [
          { name: 'dog', bg_color: 'red' },
          { name: 'cat', bg_color: 'yellow', fg_color: 'purple' },
        ],
      },
    ],
    issue,
    { items: '[[detect_items]]', dog: '[[detect_items|first]]' },
    { itemTemplates },
  ),
  {
    items: [
      { name: 'dog', bg_color: 'red', entity: 'sensor.dog_occupancy', fg_color: 'darkred' },
      { name: 'cat', bg_color: 'yellow', fg_color: 'purple', entity: 'sensor.cat_occupancy' },
    ],
    dog: '{"name":"dog","bg_color":"red","entity":"sensor.dog_occupancy","fg_color":"darkred"}',
  },
);
check(
  'an entry leaving bg_color out reads its default through the step',
  build([{ detect_items: [{ name: 'eel' }] }], issue, { items: '[[detect_items]]' }, { itemTemplates }).items,
  [{ name: 'eel', entity: 'sensor.eel_occupancy', bg_color: 'red', fg_color: 'darkred' }],
);

/* ------------------------------------------------------------ the card editor */
const { shownDefaults } = require('../.test-build/card-editor/defaults');
check(
  'the editor shows an unset object with each default worked out from its own fields',
  shownDefaults(
    ['o'],
    [],
    object({
      a: { default: 'one' },
      n: { default: 5 },
      b: { default: '[[__this__.a|upper]]' },
      c: { default: '[[__this__.n|mul:2]]' },
    }),
  ).get('o'),
  { a: 'one', n: 5, b: 'ONE', c: 10 },
);
