/*
 * Unit tests for src/example-labels.ts - what the example strip calls each example (idea 26).
 * Run with `npm test`.
 */
const { exampleHint, addExample, passCount } = require('../.test-build/example-labels.js');

const { check } = require('./check');

check('an example is named by its name variable first', exampleHint([{ entity: 'light.x' }, { name: 'Hall' }]), 'Hall');
check('then by its entity', exampleHint([{ colour: 'red' }, { entity: 'light.kitchen' }]), 'light.kitchen');
check('an example with nothing telling names its first variable', exampleHint([{ colour: 'red' }]), 'colour: red');
check('an empty example has no hint', exampleHint([]), undefined);

check(
  'adding an example appends a mapping of the values',
  addExample({ template: 't', examples: [{ name: 'A' }] }, [{ name: 'B' }, { entity: 'light.b' }]).examples,
  [{ name: 'A' }, { name: 'B', entity: 'light.b' }],
);
check('a template with no examples gains a list of one', addExample({ template: 't' }, [{ name: 'A' }]).examples, [
  { name: 'A' },
]);
check(
  'a single mapping example becomes a list of two',
  addExample({ template: 't', examples: { name: 'A' } }, [{ name: 'B' }]).examples,
  [{ name: 'A' }, { name: 'B' }],
);

check('pass count is the total less the failures', passCount({ examples: [{}, {}, {}] }, 1), { passes: 2, total: 3 });
check('and never negative', passCount({ examples: [{}] }, 3), { passes: 0, total: 1 });

// Home Assistant's deep-equal calls hasOwnProperty on the config it is handed, so the new
// example must be an ordinary object - one with no prototype threw "t.hasOwnProperty is not
// a function" when + was pressed (idea 26).
check(
  'a new example is an ordinary object',
  typeof addExample({ template: 't' }, [{ name: 'A' }]).examples[0].hasOwnProperty,
  'function',
);
