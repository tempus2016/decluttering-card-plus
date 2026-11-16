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
/*
 * A pick: after a step that left text has nothing to look through, so it says that, and which
 * step it came after, rather than that no entry matched.
 */
const pickList = [{ l: [{ k: 'a', n: 1 }] }, { s: 'hi' }];
for (const [placeholder, step] of [
  ['[[l|first|pick:k=a,n]]', 'first'],
  ['[[l|join|pick:k=a,n]]', 'join'],
  ['[[s|upper|pick:k=a,n]]', 'upper'],
]) {
  check(`${placeholder} is left as written`, run({ v: placeholder }, pickList), { v: placeholder });
  check(
    `${placeholder} does not say no entry matched`,
    said.some((m) => m.includes('no entry has')),
    false,
  );
  check(
    `${placeholder} says pick: had no list after ${step}`,
    said.some((m) => m.includes(`pick: has no list to look through after ${step}`)),
    true,
  );
}
check(
  'it quotes what the step before gave',
  run({ v: '[[s|upper|pick:k=a,n]]' }, pickList) && said.some((m) => m.includes('which gave "HI"')),
  true,
);
check(
  'it does not ask for a default: that would not help',
  said.some((m) => m.includes('|default:something')),
  false,
);
run({ v: '[[s|pick:k=a,n]]' }, pickList);
check(
  'pick: on text says the text is neither a list nor a mapping',
  said.some((m) => m.includes('pick: looks through a list or a mapping, and "hi" is neither')),
  true,
);
run({ v: '[[s|split|pick:k=a,n]]' }, [{ s: 'a,b' }]);
check(
  'a pick: after split has a list, so it still says no entry matched',
  said.some((m) => m.includes('no entry has k = "a"')),
  true,
);
check('a default: after it still stands in', run({ v: '[[l|first|pick:k=a,n|default:d]]' }, pickList), { v: 'd' });
console.warn = realWarn;
