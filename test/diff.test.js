/*
 * Unit tests for the line diff in src/diff.ts, which the impact preview and the other
 * before-and-after views draw with. Run with `npm test`.
 */
const { lineDiff, withContext, hasChanges } = require('../.test-build/diff.js');

const { check, report } = require('./harness');

const kinds = (lines) =>
  lines.map((line) => (line.kind === 'skip' ? `~${line.count}` : `${line.kind[0]}:${line.text}`));

check('two empty texts have nothing to show', lineDiff('', ''), []);

check('identical texts are all kept', kinds(lineDiff('a\nb\nc', 'a\nb\nc')), ['s:a', 's:b', 's:c']);

check('a trailing newline does not add an empty line', kinds(lineDiff('a\n', 'a\n')), ['s:a']);

check('everything added to nothing', kinds(lineDiff('', 'a\nb')), ['a:a', 'a:b']);

check('everything removed', kinds(lineDiff('a\nb', '')), ['r:a', 'r:b']);

check('a changed line is the old one removed, then the new one added', kinds(lineDiff('a\nb\nc', 'a\nB\nc')), [
  's:a',
  'r:b',
  'a:B',
  's:c',
]);

check('an inserted line in the middle', kinds(lineDiff('a\nc', 'a\nb\nc')), ['s:a', 'a:b', 's:c']);

check('a removed line in the middle', kinds(lineDiff('a\nb\nc', 'a\nc')), ['s:a', 'r:b', 's:c']);

check(
  'common lines inside a changed stretch are kept rather than replaced',
  kinds(lineDiff('x\nkeep\ny', 'p\nkeep\nq')),
  ['r:x', 'a:p', 's:keep', 'r:y', 'a:q'],
);

check('a moved line is one removal and one addition, the rest kept', kinds(lineDiff('a\nb\nc\nd', 'b\nc\nd\na')), [
  'r:a',
  's:b',
  's:c',
  's:d',
  'a:a',
]);

check('hasChanges is false for identical texts', hasChanges(lineDiff('a\nb', 'a\nb')), false);
check('hasChanges is true for any edit', hasChanges(lineDiff('a', 'b')), true);

// A diff too big to compare line by line is still true: all of one out, all of the other in.
{
  const big = Array.from({ length: 2100 }, (_, i) => `line ${i}`);
  const other = Array.from({ length: 2100 }, (_, i) => `other ${i}`);
  const result = lineDiff(big.join('\n'), other.join('\n'));
  check(
    'a huge diff falls back to all removed then all added',
    [result.length, result[0].kind, result[2100].kind],
    [4200, 'remove', 'add'],
  );
}

/* -------------------------------------------------------------------- context */

const long = Array.from({ length: 20 }, (_, i) => `l${i}`);
const edited = [...long];
edited[10] = 'changed';

check(
  'unchanged lines beyond three either side are folded, with a count',
  kinds(withContext(lineDiff(long.join('\n'), edited.join('\n')))),
  ['~7', 's:l7', 's:l8', 's:l9', 'r:l10', 'a:changed', 's:l11', 's:l12', 's:l13', '~6'],
);

check('the context width can be changed', kinds(withContext(lineDiff(long.join('\n'), edited.join('\n')), 1)), [
  '~9',
  's:l9',
  'r:l10',
  'a:changed',
  's:l11',
  '~8',
]);

check(
  'a fold of a single line is not worth folding, so the line is shown',
  kinds(withContext(lineDiff('a\nb\nc\nd\ne\nf', 'a\nb\nc\nd\ne\nF'), 3)).slice(0, 2),
  ['~2', 's:c'],
);

{
  const five = 'a\nb\nc\nd\ne';
  check(
    'one hidden line between two changes is shown rather than folded',
    kinds(withContext(lineDiff(`x\n${five}\ny`, `X\n${five}\nY`), 2)),
    ['r:x', 'a:X', 's:a', 's:b', 's:c', 's:d', 's:e', 'r:y', 'a:Y'],
  );
}

check(
  'two changes far apart get a fold each side and one between',
  kinds(withContext(lineDiff('1\n2\n3\n4\n5\n6\n7\n8\n9', 'X\n2\n3\n4\n5\n6\n7\n8\nY'), 1)),
  ['r:1', 'a:X', 's:2', '~5', 's:8', 'r:9', 'a:Y'],
);

check('no changes at all folds everything', kinds(withContext(lineDiff('a\nb\nc', 'a\nb\nc'))), ['~3']);

report();
