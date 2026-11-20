/*
 * #482: an object selector's fields can say `default:`, and the build fills in any field the
 * card leaves out - or the whole object when the card never sets it - the way a variable's
 * own `default:` stands in. Run with `npm test`.
 */
const { check } = require('./check');
const { resolveVariables, variableValues } = require('../.test-build/variables');
const deepReplace = require('../.test-build/deep-replace').default;
const { variableRows } = require('../.test-build/trace');

const fields = {
  the_field: { label: 'The field', type: 'my_type' },
  size: { selector: { number: {} }, default: 10 },
  name: { selector: { text: {} } },
};
const template = {
  types: { my_type: { default: '[[default_text_val]]', selector: { text: {} } } },
  variables: [
    { name: 'default_text_val', type: 'text', default: 'hello' },
    { name: 'my_var', selector: { object: { fields } } },
  ],
  card: { type: 'markdown' },
};
const values = (variables, t = template) => variableValues(resolveVariables(variables, t));

check('an unset object is made from its field defaults', values([]).my_var, {
  the_field: '[[default_text_val]]',
  size: 10,
});
check(
  'a field the card leaves out is filled, one it sets is kept',
  values([{ my_var: { size: 30, name: 'Porch' } }]).my_var,
  { size: 30, name: 'Porch', the_field: '[[default_text_val]]' },
);
check('an empty value counts as unset', values([{ my_var: '' }]).my_var.size, 10);
check('a field set to null is kept as set', values([{ my_var: { size: null } }]).my_var.size, null);
check(
  'the card config is never changed',
  (() => {
    const mine = { size: 30 };
    values([{ my_var: mine }]);
    return mine;
  })(),
  { size: 30 },
);
check(
  "the variable's own default is filled too",
  values([], {
    variables: [{ name: 'o', default: { a: 1 }, selector: { object: { fields: { a: {}, b: { default: 2 } } } } }],
  }).o,
  { a: 1, b: 2 },
);
check(
  'fields with no defaults change nothing',
  values([], { variables: [{ name: 'o', selector: { object: { fields: { a: { selector: { text: {} } } } } } }] }).o,
  undefined,
);

const list = {
  variables: [{ name: 'rows', selector: { object: { multiple: true, fields: { a: {}, b: { default: 'x' } } } } }],
};
check('each entry of a list is filled', values([{ rows: [{ a: 1 }, { a: 2, b: 'y' }] }], list).rows, [
  { a: 1, b: 'x' },
  { a: 2, b: 'y' },
]);
check('an unset list stays unset - there is no entry to fill', values([], list).rows, undefined);

check(
  'a placeholder in a field default is filled from the card, and follows it',
  [
    deepReplace([], template, { c: '[[my_var.the_field]]-[[my_var.size]]' }),
    deepReplace([{ default_text_val: 'goodbye' }], template, { c: '[[my_var.the_field]]' }),
  ],
  [{ c: 'hello-10' }, { c: 'goodbye' }],
);

const rows = (variables) => variableRows(variables, template).filter((row) => row.variable === 'my_var');
check(
  'the report says an unset object came from field defaults',
  rows([]).map((row) => [row.from, row.fieldDefaults]),
  [['field_defaults', undefined]],
);
check(
  "the report marks a card's object that had fields filled in",
  rows([{ my_var: { size: 30 } }]).map((row) => [row.from, row.fieldDefaults, row.value]),
  [['card', true, { size: 30, the_field: '[[default_text_val]]' }]],
);
check(
  'a card object with every field set is not marked',
  rows([{ my_var: { size: 30, the_field: 'x' } }])[0].fieldDefaults,
  undefined,
);
