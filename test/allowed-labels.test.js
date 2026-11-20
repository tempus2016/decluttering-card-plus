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
  { name: 'mode', expected: 'static, dynamic, unconstrained' },
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
