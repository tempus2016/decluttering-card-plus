/*
 * Unit tests for src/dates.ts (idea 38): a timestamp read from text, said as how long ago,
 * written to a pattern, or counted in a unit.
 */
const { parseDate, relative, formatDate, age, AGE_UNITS } = require('../.test-build/dates.js');
const { check } = require('./check');

const now = new Date('2026-10-24T08:00:00Z');

check('an ISO timestamp is a date', parseDate('2026-10-24T07:42:11Z').toISOString(), '2026-10-24T07:42:11.000Z');
check(
  'an ISO date with an offset is read at that offset',
  parseDate('2026-10-24T07:42:11+01:00').toISOString(),
  '2026-10-24T06:42:11.000Z',
);
check('an epoch in seconds is a date', parseDate('1792826531').toISOString(), '2026-10-24T07:22:11.000Z');
check('an epoch in milliseconds is a date', parseDate('1792826531000').toISOString(), '2026-10-24T07:22:11.000Z');
check('a word is not a date', parseDate('on'), undefined);
check('an empty value is not a date', parseDate(''), undefined);
check('a short number is read as seconds, not as a year', parseDate('3') instanceof Date, true);
check('a bad ISO string is not a date', parseDate('2026-13-45T99:00:00Z'), undefined);

check('eighteen minutes ago', relative(new Date('2026-10-24T07:42:00Z'), now, 'en'), '18 minutes ago');
check('seconds under forty-five', relative(new Date('2026-10-24T07:59:30Z'), now, 'en'), '30 seconds ago');
check('hours under twenty-two', relative(new Date('2026-10-24T03:00:00Z'), now, 'en'), '5 hours ago');
check('days', relative(new Date('2026-10-21T08:00:00Z'), now, 'en'), '3 days ago');
check('the future reads forward', relative(new Date('2026-10-26T08:00:00Z'), now, 'en'), 'in 2 days');
check('in French without a locale file', relative(new Date('2026-10-24T07:42:00Z'), now, 'fr'), 'il y a 18 minutes');
check(
  'an unknown language falls back to English',
  relative(new Date('2026-10-24T07:42:00Z'), now, 'xx-nowhere'),
  '18 minutes ago',
);

const sample = new Date(2026, 9, 24, 7, 42, 11); // local time, 24 October 2026 07:42:11
check('a pattern of the common letters', formatDate(sample, 'YYYY-MM-DD HH:mm:ss', 'en'), '2026-10-24 07:42:11');
check('short day and month names', formatDate(sample, 'ddd D MMM', 'en'), 'Sat 24 Oct');
check('long names in German', formatDate(sample, 'dddd MMMM', 'de'), 'Samstag Oktober');
check('twelve-hour time', formatDate(sample, 'h:mm a', 'en'), '7:42 am');
check('letters that are not tokens are written as they are', formatDate(sample, 'HH.mm uur', 'en'), '07.42 uur');
check('a two-digit year', formatDate(sample, 'YY', 'en'), '26');

check('age in seconds by default', age(new Date('2026-10-24T07:59:00Z'), now), 60);
check('age in days', age(new Date('2026-10-20T08:00:00Z'), now, 'days'), 4);
check('age in hours is fractional', age(new Date('2026-10-24T07:30:00Z'), now, 'hours'), 0.5);
check('an unknown unit is refused', age(now, now, 'fortnights'), undefined);
check('the units offered', AGE_UNITS, ['seconds', 'minutes', 'hours', 'days', 'weeks']);
