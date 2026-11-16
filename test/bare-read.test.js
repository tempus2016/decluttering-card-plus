/*
 * The work a value read inside a build shares with the build around it (#471): the list and
 * its values worked out once per list, each entry normalised once, and what each entry holds
 * searched once. Each is checked against the uncached answer, and against an entry or list
 * changed after it was first read. Run with `npm test`.
 */
const { check } = require('./check.js');
const {
  bareRead,
  isBareTemplate,
  normaliseVariables,
  resolveVariables,
  variableValues,
} = require('../.test-build/variables.js');
const { findAcross } = require('../.test-build/placeholder-text.js');
const deepReplace = require('../.test-build/deep-replace.js').default;

const plain = (value) => JSON.parse(JSON.stringify(value));

check('an empty template is bare (#471)', isBareTemplate({}), true);
check('no template is bare (#471)', isBareTemplate(undefined), true);
check('a template with defaults is not bare (#471)', isBareTemplate({ default: [{ a: 1 }] }), false);
check('a template with a symbol key is not bare (#471)', isBareTemplate({ [Symbol('x')]: 1 }), false);

{
  const list = normaliseVariables([{ a: '[[b]]' }, { b: 'x' }, { m: { k: 'v', n: { o: 1 } } }, { a: 'later' }]);
  const first = bareRead(list);
  check('bareRead lists what resolveVariables lists (#471)', plain(first.list), plain(resolveVariables(list, {})));
  check(
    'bareRead values are variableValues of that list (#471)',
    { ...first.values() },
    { ...variableValues(resolveVariables(list, {})) },
  );
  first.list.push({ added: 1 });
  check('the list handed back is a copy (#471)', bareRead(list).list.length, first.list.length - 1);
  check('the same list gives the same shared values (#471)', bareRead(list).values() === first.values(), true);
  list.push({ grown: 'yes' });
  const grown = bareRead(list);
  check('a list that has grown is read again (#471)', grown.values().grown, 'yes');
  check('and its values are new, not the old ones changed (#471)', first.values().grown, undefined);
}

{
  const entry = { room: { light: 'light.a' } };
  const once = normaliseVariables([entry]);
  check('an entry normalises with its dotted names (#471)', plain(once), [
    { room: { light: 'light.a' } },
    { 'room.light': 'light.a' },
  ]);
  check('the same entry gives the same objects again (#471)', normaliseVariables([entry])[1] === once[1], true);
  const single = { name: 'x' };
  check('a plain entry is its own normal form (#471)', normaliseVariables([single])[0] === single, true);
  const many = { a: 1, b: 2 };
  check('a mapping of many names normalises to each (#471)', plain(normaliseVariables(many)), [{ a: 1 }, { b: 2 }]);
  many.c = 3;
  check('and is read fresh after it changes (#471)', plain(normaliseVariables(many)), [{ a: 1 }, { b: 2 }, { c: 3 }]);
  const swapped = { v: { k: 1 } };
  normaliseVariables([swapped]);
  swapped.v = 'plain';
  check('an entry given a new value is normalised again (#471)', plain(normaliseVariables([swapped])), [
    { v: 'plain' },
  ]);
}

{
  const ASK = /\[\[([a-z_]+)\]\]/g;
  const entry = { a: '[[b]]' };
  check('findAcross reads an entry (#471)', findAcross({}, [entry], ASK), ['b']);
  check('and gives the same again (#471)', findAcross({}, [entry], ASK), ['b']);
  entry.a = '[[c]]';
  check('an entry given a new value is searched again (#471)', findAcross({}, [entry], ASK), ['c']);
  const many = { x: '[[d]]', y: '[[e]]' };
  check('an entry of many names is searched whole (#471)', findAcross({}, [many], ASK), ['d', 'e']);
}

{
  // A card whose `if:` reads and mapping placeholders build values from its own list, many times over.
  const template = {
    default: [
      { flags: { a: true, b: false } },
      { picked: '[[flags]]' },
      { label: '[[name|if:picked.a|or:"none"]]' },
      { other: '[[name|if:picked.b|or:"none"]]' },
      { name: 'cam' },
    ],
  };
  const content = { a: '[[label]]', b: '[[other]]', c: '[[picked.a]]', d: '[[label|upper]]' };
  const build = () => deepReplace([], template, content, 't', undefined, true);
  const first = build();
  check('values read inside a build come out as before (#471)', first, { a: 'cam', b: 'none', c: true, d: 'CAM' });
  check('and the same on a second build (#471)', build(), first);
}
