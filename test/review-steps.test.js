/*
 * Value steps after the 2026-11-27 review: dates across time zones, colours with an alpha,
 * number formats, a function step's arguments and the sentences' parameters.
 * Run with `npm test`.
 */
const path = require('path');
const { execFileSync } = require('child_process');
const { applyTransform } = require('../.test-build/variables.js');
const { parseDate } = require('../.test-build/dates.js');
const { functionArguments } = require('../.test-build/functions.js');
const { localize } = require('../.test-build/localize.js');

const { check } = require('./check');

console.warn = () => {};

/* ------------------------------------------------------------------ dates, zone by zone */

// Each zone in a process of its own: the zone is read once, when the process starts.
const SCRIPT = `
  console.warn = () => {};
  const { applyTransform } = require(${JSON.stringify(path.join(__dirname, '..', '.test-build', 'variables.js'))});
  const hass = (language) => ({ locale: { language } });
  const t = (value, chain, language = 'en') => applyTransform(chain, value, hass(language));
  console.log(JSON.stringify({
    dateOnly: t('2026-03-10', 'format:YYYY-MM-DD ddd'),
    dateOnlyWords: t('2026-03-10', 'format:D MMMM YYYY'),
    midnight: t('2026-03-10', 'format:HH:mm'),
    earlyYear: t('0099-01-01', 'format:YYYY-MM-DD'),
    spaced: t('2026-03-10 12:00:00', 'format:YYYY-MM-DD HH:mm'),
    spacedZone: t('2026-03-10 12:00:00+00:00', 'format:mm'),
    local: t('2026-03-10T12:00:00', 'format:YYYY-MM-DD HH:mm'),
    utcMinutes: t('2026-03-10T12:34:00Z', 'format:mm'),
    oldMs: t('946684800000', 'format:YYYY'),
    ms: t('1773144000000', 'format:YYYY-MM'),
    seconds: t('1773144000', 'format:YYYY-MM'),
    ru: t('2026-03-10', 'format:D MMMM', 'ru'),
    pl: t('2026-03-10', 'format:D MMMM', 'pl'),
    uk: t('2026-03-10', 'format:DD MMMM', 'uk'),
    cs: t('2026-03-10', 'format:D. MMMM', 'cs'),
    ruAlone: t('2026-03-10', 'format:MMMM YYYY', 'ru'),
    en: t('2026-03-10', 'format:dddd D MMMM'),
    enShort: t('2026-03-10', 'format:D MMM'),
  }));
`;
for (const zone of ['America/New_York', 'Asia/Tokyo', 'Europe/London', 'Pacific/Auckland']) {
  const got = JSON.parse(
    execFileSync(process.execPath, ['-e', SCRIPT], { env: { ...process.env, TZ: zone }, encoding: 'utf8' }),
  );
  check(`${zone}: a date with no time is that day`, got.dateOnly, '2026-03-10 Tue');
  check(`${zone}: and in words`, got.dateOnlyWords, '10 March 2026');
  check(`${zone}: at midnight there`, got.midnight, '00:00');
  check(`${zone}: a year under 100 is that year`, got.earlyYear, '99-01-01');
  check(
    `${zone}: a space between date and time reads as a T does`,
    [got.spaced, got.local],
    ['2026-03-10 12:00', '2026-03-10 12:00'],
  );
  check(`${zone}: with an offset after it too`, got.spacedZone, '00');
  check(`${zone}: a time with a zone is still an instant`, got.utcMinutes, '34');
  check(`${zone}: milliseconds from the year 2000 are milliseconds`, ['1999', '2000'].includes(got.oldMs), true);
  check(`${zone}: milliseconds and seconds of today read alike`, [got.ms, got.seconds], ['2026-03', '2026-03']);
  check(
    `${zone}: a month beside a day is declined`,
    [got.ru, got.pl, got.uk, got.cs],
    ['10 марта', '10 marca', '10 березня', '10. března'],
  );
  check(`${zone}: a month on its own is not`, got.ruAlone, 'март 2026');
  check(`${zone}: English is as it was`, [got.en, got.enShort], ['Tuesday 10 March', '10 Mar']);
}
check(
  'a date that is not one is still not one',
  [parseDate('2026-3-1'), parseDate('2026/03/10')],
  [undefined, undefined],
);

/* ------------------------------------------------------------------ colours */

const step = (value, chain, hass) => applyTransform(chain, value, hass);
check('darken keeps a wash', step('rgba(255,0,0,0.5)', 'darken:10'), '#e6000080');
check('lighten keeps one', step('#ffffff80', 'lighten:20'), '#ffffff80');
check('lighten after alpha keeps it', step('#ff0000', 'alpha:0.5|lighten:20'), '#ff333380');
check('mix blends the alphas', step('rgba(255,0,0,.5)', 'mix:rgba(0,0,255,.5),50'), '#80008080');
check(
  'a solid colour is still six digits',
  [step('#ff0000', 'lighten:20'), step('#ff0000', 'darken:20')],
  ['#ff3333', '#cc0000'],
);
check('and a solid mix', step('#ff0000', 'mix:#0000ff,50'), '#800080');
check('mix reads rgb() with no amount', step('#ff0000', 'mix:rgb(0,0,255)'), '#800080');
check('and a list with none', step('#ff0000', 'mix:[0,0,255]'), '#800080');
check(
  'and either with one',
  [step('#ff0000', 'mix:rgb(0,0,255),25'), step('#ff0000', 'mix:[0,0,255],25')],
  ['#bf0040', '#bf0040'],
);
check('a name with an amount still mixes', step('#ff0000', 'mix: blue , 50 '), '#800080');
check('an amount left empty is refused', step('#ff0000', 'mix:blue,'), '#ff0000');
check('alpha with nothing after it leaves the colour alone', step('#ff0000', 'alpha:'), '#ff0000');
check('and with only a space', step('#ff0000', 'alpha: '), '#ff0000');
check('alpha:0 is still a real zero', step('#ff0000', 'alpha:0'), 'rgba(255,0,0,0)');
check(
  'lighten and darken with nothing leave it alone',
  [step('#f00', 'lighten:'), step('#f00', 'darken: ')],
  ['#f00', '#f00'],
);
check('lighten:0 is the colour, written out', step('#f00', 'lighten:0'), '#ff0000');

/* ------------------------------------------------------------------ number formats */

const formatted = (number_format, language = 'en') =>
  step('1234.5', 'format_number', { locale: { language, number_format } });
check('quote_decimal groups with an apostrophe', formatted('quote_decimal').replace(/[’']/, "'"), "1'234.5");
check('whatever the language', formatted('quote_decimal', 'de').replace(/[’']/, "'"), "1'234.5");
check(
  "system is the browser's own, not the language's",
  formatted('system', 'de'),
  new Intl.NumberFormat([]).format(1234.5),
);
check(
  'the others are as they were',
  ['comma_decimal', 'decimal_comma', 'none', 'language'].map((each) => formatted(each)),
  ['1,234.5', '1.234,5', '1234.5', '1,234.5'],
);
check('language follows the language', formatted('language', 'de'), '1.234,5');

/* ------------------------------------------------------------------ a function step's arguments */

const args = (text) => functionArguments(text, ['first', 'second']);
check('an apostrophe inside a word is a character', args("don't,now"), {
  values: [{ first: "don't" }, { second: 'now' }],
});
check('a quoted piece still keeps its comma', args("'a,b',c"), { values: [{ first: 'a,b' }, { second: 'c' }] });
check('in double quotes, as the JSON writes them', args('\\"a,b\\",c'), {
  values: [{ first: 'a,b' }, { second: 'c' }],
});
check('a named one quoted too', args("second='x,y',one"), { values: [{ second: 'x,y' }, { first: 'one' }] });
check('a quote mid-word does not open one', args('5",6'), { values: [{ first: '5"' }, { second: '6' }] });

/* ------------------------------------------------------------------ parameters */

const en = { language: 'en' };
check(
  'a value holding another name is not filled again',
  localize('trace.built', { label: 'x {ms}', ms: '1.0' }, en),
  localize('trace.built', { label: 'x {m' + 's}', ms: '1.0' }, en).replace('{m' + 's}', '{ms}'),
);
check(
  'it says the label as given',
  localize('trace.built', { label: 'x {ms}', ms: '1.0' }, en).includes('x {ms}'),
  true,
);
check('a name nobody gave stays', localize('trace.built', { label: 'a' }, en).includes('{ms}'), true);
check(
  'a dollar sign is a dollar sign',
  localize('trace.built', { label: '$& $1', ms: '1' }, en).includes('$& $1'),
  true,
);
