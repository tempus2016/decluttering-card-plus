/*
 * Unit tests for src/warnings.ts, the one log every warning goes through (idea 9). Run with
 * `npm test`.
 */
const { warn, warnings, onWarning, resetWarnings, WARNINGS_KEPT } = require('../.test-build/warnings.js');
const { check } = require('./check');

const said = [];
const realWarn = console.warn;
console.warn = (message) => said.push(message);

resetWarnings();
check('nothing has been said yet', warnings(), []);

warn({ kind: 'unset', message: 'first', template: 'room_light_tile', variable: 'entity' });
check('the console gets the words, and only the words', said, ['first']);
check(
  'the log keeps the words and what they are about',
  warnings().map((w) => {
    const copy = { ...w };
    delete copy.at;
    return copy;
  }),
  [{ kind: 'unset', message: 'first', template: 'room_light_tile', variable: 'entity' }],
);
check('and says when, as a number of milliseconds', typeof warnings()[0].at, 'number');

warn({ kind: 'deprecated', message: 'second', template: 'old_tile' });
warn({ kind: 'unset', message: 'third', template: 'room_light_tile', expansion: 'dcp-1' });
check(
  'oldest first',
  warnings().map((w) => w.message),
  ['first', 'second', 'third'],
);
check(
  'filtered by kind',
  warnings({ kind: 'unset' }).map((w) => w.message),
  ['first', 'third'],
);
check(
  'filtered by template',
  warnings({ template: 'old_tile' }).map((w) => w.message),
  ['second'],
);
check(
  'filtered by expansion',
  warnings({ expansion: 'dcp-1' }).map((w) => w.message),
  ['third'],
);
check(
  'filters combine',
  warnings({ kind: 'unset', template: 'old_tile' }).map((w) => w.message),
  [],
);
check(
  'an undefined filter value does not narrow',
  warnings({ kind: undefined }).map((w) => w.message),
  ['first', 'second', 'third'],
);
check('the list handed out is a copy', ((warnings().length = 0), warnings().length), 3);

const heard = [];
const stop = onWarning((w) => heard.push(w.message));
const throwing = onWarning(() => {
  throw new Error('listener broke');
});
warn({ kind: 'other', message: 'fourth' });
check('a listener is told as each one lands', heard, ['fourth']);
check('a listener that throws stops nothing', [said.at(-1), warnings().length], ['fourth', 4]);
stop();
throwing();
warn({ kind: 'other', message: 'fifth' });
check('a stopped listener hears no more', heard, ['fourth']);

resetWarnings();
check('reset forgets everything', warnings(), []);
for (let i = 0; i < WARNINGS_KEPT + 20; i++) warn({ kind: 'other', message: `m${i}` });
check('the log is capped', warnings().length, WARNINGS_KEPT);
check('and the oldest go first', [warnings()[0].message, warnings().at(-1).message], ['m20', `m${WARNINGS_KEPT + 19}`]);

console.warn = realWarn;
