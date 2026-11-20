/*
 * A declaration's own mapping `default:` is read by dotted names, as one in the template's
 * `default:` list always was - `[[o.a]]` used to give up "more than 10 deep". Run with `npm test`.
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace').default;

const run = (variables, template, content) => deepReplace(variables, template, content, 't');
const declared = { variables: [{ name: 'o', default: { a: 'x', n: { m: 1 } } }] };

check('a dotted name reads a declared mapping default', run([], declared, { d: '[[o.a]]' }), { d: 'x' });
check('two deep too', run([], declared, { d: '[[o.n.m]]' }), { d: 1 });
check('the whole mapping still comes whole', run([], declared, { w: '[[o]]' }), {
  w: { a: 'x', n: { m: 1 } },
});
check('the mapping form of declarations', run([], { variables: { o: { default: { a: 'y' } } } }, { d: '[[o.a]]' }), {
  d: 'y',
});
check("the card's own mapping wins a name it sets", run([{ o: { a: 'mine' } }], declared, { d: '[[o.a]]' }), {
  d: 'mine',
});
check(
  'as with the default: list, a name the card leaves out reads the default',
  [
    run([{ o: { b: 1 } }], declared, { d: '[[o.a]]' }),
    run([{ o: { b: 1 } }], { default: [{ o: { a: 'x' } }] }, { d: '[[o.a]]' }),
  ],
  [{ d: 'x' }, { d: 'x' }],
);
