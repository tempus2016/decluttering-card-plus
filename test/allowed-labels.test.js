/*
 * #482: `allowed:` entries can be `{label, value}` mappings, the way Home Assistant's select
 * selector writes its options, so a dropdown built from `allowed:` reads as words while the
 * card is given the value. Run with `npm test`.
 */
const { check } = require('./check');
const { declarationSelector, validateDeclared, hasLabelledAllowed } = require('../.test-build/variables');

const labelled = [
  { label: 'Static Ratio', value: 'static' },
  { label: 'Match Media', value: 'dynamic' },
  { label: 'Ratio Unenforced', value: 'unconstrained' },
];

check(
  'labelled entries make a dropdown of their labels, handing back the values',
  declarationSelector({ name: 'mode', type: 'select', allowed: labelled }),
  {
    select: {
      mode: 'dropdown',
      options: [
        { value: 'static', label: 'Static Ratio' },
        { value: 'dynamic', label: 'Match Media' },
        { value: 'unconstrained', label: 'Ratio Unenforced' },
      ],
    },
  },
);
check(
  'without a type they make the same dropdown',
  declarationSelector({ name: 'mode', allowed: labelled }).select.options[1],
  { value: 'dynamic', label: 'Match Media' },
);
check(
  'plain and labelled entries mix, and an entry with no label shows its value',
  declarationSelector({ name: 'size', allowed: [10, { value: 30 }, { label: 'Large', value: 50 }] }).select.options,
  [
    { value: '10', label: '10' },
    { value: '30', label: '30' },
    { value: '50', label: 'Large' },
  ],
);
check(
  'a mapping with no value is not an option',
  declarationSelector({ name: 'size', allowed: [{ label: 'Nothing' }, 'a'] }).select.options,
  [{ value: 'a', label: 'a' }],
);
check('plain values are unchanged', declarationSelector({ name: 'x', allowed: ['a', 'b'] }).select.options, [
  { value: 'a', label: 'a' },
  { value: 'b', label: 'b' },
]);

const template = { variables: [{ name: 'mode', allowed: labelled }], card: { type: 'markdown' } };
check('a value in the list passes', validateDeclared([{ mode: 'dynamic' }], template), []);
check('a label is not a value', validateDeclared([{ mode: 'Match Media' }], template), [
  { name: 'mode', expected: 'static, dynamic, unconstrained', value: '"Match Media"' },
]);
check(
  'numbers and true or false still compare as text',
  validateDeclared([{ on: 'true' }, { size: 30 }], {
    variables: [
      {
        name: 'on',
        allowed: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      },
      {
        name: 'size',
        allowed: [
          { label: 'Small', value: 10 },
          { label: 'Medium', value: 30 },
        ],
      },
    ],
  }),
  [],
);

check('labelled entries are spotted', hasLabelledAllowed({ allowed: ['a', { label: 'B', value: 'b' }] }), true);
check('plain entries are not', hasLabelledAllowed({ allowed: ['a', 1, true] }), false);
check('no allowed is not', hasLabelledAllowed({}), false);

/* #490: a value holding a placeholder is judged by what it becomes, never by its brackets. */
const camera = {
  default: [{ default_camera_view: 'live' }],
  variables: [
    {
      name: 'default_view',
      default: '[[default_camera_view]]',
      allowed: [
        { label: 'Image (updated)', value: 'image' },
        { label: 'Live Camera', value: 'live' },
      ],
    },
    { name: 'shape', default: '[[default_camera_view]]', pattern: '^(live|image)$' },
  ],
  card: { type: 'picture-entity', camera_view: '[[default_view]]' },
};
const fillWith = (values) => (value) => {
  const text = String(value);
  const match = /^\[\[(\w+)\]\]$/.exec(text);
  return match && match[1] in values ? values[match[1]] : undefined;
};
check('a placeholder default is not judged by its brackets (#490)', validateDeclared(undefined, camera), []);
check(
  'a placeholder default that fills to an allowed value passes (#490)',
  validateDeclared(undefined, camera, undefined, fillWith({ default_camera_view: 'live' })),
  [],
);
check(
  'a placeholder default that fills to something else is reported with what it became (#490)',
  validateDeclared(undefined, camera, undefined, fillWith({ default_camera_view: 'video' })),
  [
    { name: 'default_view', expected: 'image, live', value: '"video"' },
    { name: 'shape', expected: '^(live|image)$', value: '"video"' },
  ],
);
check(
  'a placeholder that cannot be worked out yet is left alone (#490)',
  validateDeclared(undefined, camera, undefined, () => undefined),
  [],
);

const { shownValue } = require('../.test-build/variables');
check('a value is shown in quotes, so a space shows (#490)', shownValue(' live'), '" live"');
check('a character that prints as nothing is written out (#490)', shownValue('li​ve'), '"li\\u200bve"');
check('a non-breaking space is written out (#490)', shownValue('live '), '"live\\u00a0"');
check('a number is shown as itself (#490)', shownValue(30), '"30"');
check('a long value is cut short (#490)', shownValue('x'.repeat(100)).length, 83);
