/*
 * What a refused pick: or map: says: a pick: written without field=value says how it is written,
 * and map: on a mapping or a list shows the value rather than "[object Object]".
 */
const { check } = require('./check');
const deepReplace = require('../.test-build/deep-replace.js').default;

const realWarn = console.warn;
const said = [];
console.warn = (...args) => said.push(args.join(' '));
const run = (content, variables) => {
  said.length = 0;
  return deepReplace(JSON.parse(JSON.stringify(variables)), {}, content, 't');
};

const icons = [{ m: { cat: 'mdi:cat' } }, { l: [{ k: 'a' }] }];

check('a pick: with no field=value is left as written', run({ v: '[[l|pick:cat]]' }, icons), { v: '[[l|pick:cat]]' });
check(
  'it says how pick: is written',
  said.some((m) => m.includes('pick:name=dog,icon')),
  true,
);
check(
  'it does not say an empty field',
  said.some((m) => m.includes('has  =')),
  false,
);

run({ v: '[[l|pick:k=z,k]]' }, icons);
check(
  'a pick: that finds nothing still names what it looked for',
  said.some((m) => m.includes('no entry has k = "z"')),
  true,
);

check('map: on a mapping is left as written', run({ v: '[[m|map:a=b]]' }, icons), { v: '[[m|map:a=b]]' });
check(
  'map: on a literal mapping says a mapping',
  said.some((m) => m.includes('(a mapping)')),
  true,
);
check(
  'map: on a placeholder that fills in a mapping is left as written',
  run({ v: '[[al|map:a=b]]' }, [...icons, { al: '[[m]]' }]),
  { v: '[[al|map:a=b]]' },
);
check(
  'it does not say [object Object]',
  said.some((m) => m.includes('[object Object]')),
  false,
);
check(
  'it says a mapping, as a written-out one does',
  said.some((m) => m.includes('(a mapping)')),
  true,
);
run({ v: '[[ll|map:a=b]]' }, [{ x: ['a'] }, { ll: '[[x]]' }]);
check(
  'a placeholder that fills in a list says a list',
  said.some((m) => m.includes('(a list)')),
  true,
);

run({ v: '[[s|map:a=b]]' }, [{ s: 'zz' }]);
check(
  'map: on text still quotes the text',
  said.some((m) => m.includes('"zz" matches none')),
  true,
);
console.warn = realWarn;
