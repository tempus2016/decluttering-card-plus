/*
 * An `or:` whose value came out empty and whose fallback names a variable nothing sets is
 * left as written, and the warning says so, rather than calling it a chain more than ten
 * deep. Run with `npm test`.
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

check('inside text, it is left as written', run({ w: 'x[[n|or:O]]y' }, [{ n: '' }]), { w: 'x[[n|or:O]]y' });
check(
  'it names the or: target as the one with no value',
  said.some((m) => m.includes('or: falls back to [[O]]') && m.includes('nothing gives a value to')),
  true,
);
check(
  'it does not call it a chain',
  said.some((m) => m.includes('deep')),
  false,
);
check(
  'it shows how to write it as text',
  said.some((m) => m.includes('or:"O"')),
  true,
);

check('as the whole value, too', run({ w: '[[n|or:fallback]]' }, [{ n: '' }]), { w: '[[n|or:fallback]]' });
check(
  'the whole value says the same',
  said.some((m) => m.includes('or: falls back to [[fallback]]')),
  true,
);

check('a set target still stands in', run({ w: 'x[[n|or:o]]y' }, [{ n: '' }, { o: 'Z' }]), { w: 'xZy' });
check('quoted text still stands in', run({ w: 'x[[n|or:"O"]]y' }, [{ n: '' }]), { w: 'xOy' });
check('a set value needs no or:', run({ w: 'x[[n|or:O]]y' }, [{ n: 'v' }]), { w: 'xvy' });
check('nothing said when it works', said.length, 0);

run({ w: 'x[[n|or:O]]y' }, [{ q: 1 }]);
check(
  'with the value itself unset, it is the ordinary unset warning',
  said.some((m) => m.includes('uses [[n|or:O]], which nothing gives a value to')),
  true,
);

run({ w: '[[a]]' }, [{ a: '[[a]]' }]);
check(
  'a real loop still says so',
  said.some((m) => m.includes('[[a]]') && /itself/.test(m)),
  true,
);

console.warn = realWarn;
