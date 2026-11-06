/*
 * Dates and times for a placeholder (idea 38). A timestamp attribute - `last_seen`,
 * `last_changed`, a sensor whose state is an ISO date - is shaped into words a person reads:
 * `relative` says how long ago, `format:` takes a pattern, `age:` gives a number in the unit
 * named, which the number steps can then work on. Words come from the browser's own
 * formatting in the viewer's language, so "18 minutes ago" is "il y a 18 minutes" without a
 * locale file.
 *
 * A date is read from an ISO string or an epoch - seconds or milliseconds, told apart by
 * size. Anything else is not a date, and the step leaves the value as it was, the way a
 * number step leaves a word.
 */

/** The moment a piece of text names, or undefined when it names none. */
export function parseDate(text: string): Date | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    const number = Number(trimmed);
    // Seconds until the year 33658 is still under a trillion; milliseconds passed it in 2001.
    const date = new Date(Math.abs(number) < 1e12 ? number * 1000 : number);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  // Only what looks like a date is handed to Date.parse: it reads "3" and "on" as dates too.
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return undefined;
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

const UNIT_SECONDS: Record<string, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
};

/** The units `age:` takes, written as `age:days`. Bare `age` is seconds. */
export const AGE_UNITS = Object.keys(UNIT_SECONDS);

/** How long ago the date was, as a number in the unit asked for, or undefined for a unit nobody knows. */
export function age(date: Date, now: Date, unit = 'seconds'): number | undefined {
  const seconds = UNIT_SECONDS[unit];
  if (seconds === undefined) return undefined;
  return (now.getTime() - date.getTime()) / 1000 / seconds;
}

// The unit that reads best for a span, as people say it: under 45 seconds is seconds,
// under 45 minutes is minutes, and so on - the thresholds moment.js settled on.
function relativeUnit(seconds: number): [number, Intl.RelativeTimeFormatUnit] {
  const abs = Math.abs(seconds);
  if (abs < 45) return [Math.round(seconds), 'second'];
  if (abs < 2700) return [Math.round(seconds / 60), 'minute'];
  if (abs < 79200) return [Math.round(seconds / 3600), 'hour'];
  if (abs < 2246400) return [Math.round(seconds / 86400), 'day'];
  if (abs < 29030400) return [Math.round(seconds / 2592000), 'month'];
  return [Math.round(seconds / 31536000), 'year'];
}

/** "18 minutes ago", "in 2 days", in the language given. */
export function relative(date: Date, now: Date, language: string): string {
  const [value, unit] = relativeUnit((date.getTime() - now.getTime()) / 1000);
  try {
    return new Intl.RelativeTimeFormat(language || 'en', { numeric: 'auto' }).format(value, unit);
  } catch {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(value, unit);
  }
}

// The letters a pattern is made of, longest first so `MMMM` is read before `MM` and `M`.
const TOKENS = [
  'YYYY',
  'MMMM',
  'dddd',
  'YY',
  'MMM',
  'ddd',
  'MM',
  'DD',
  'HH',
  'hh',
  'mm',
  'ss',
  'M',
  'D',
  'H',
  'h',
  'm',
  's',
  'A',
  'a',
];

const TOKEN_PATTERN = new RegExp(TOKENS.join('|'), 'g');

function names(language: string, options: Intl.DateTimeFormatOptions, date: Date): string {
  try {
    return new Intl.DateTimeFormat(language || 'en', options).format(date);
  } catch {
    return new Intl.DateTimeFormat('en', options).format(date);
  }
}

const two = (n: number): string => String(n).padStart(2, '0');

/**
 * The date written to a pattern of the common letters - `HH:mm`, `ddd D MMM`, `YYYY-MM-DD` -
 * in the browser's own time zone, with month and day names in the language given. Anything
 * in the pattern that is not a letter from the list is written as it is.
 */
export function formatDate(date: Date, pattern: string, language: string): string {
  const hours = date.getHours();
  const twelve = hours % 12 || 12;
  return pattern.replace(TOKEN_PATTERN, (token) => {
    switch (token) {
      case 'YYYY':
        return String(date.getFullYear());
      case 'YY':
        return two(date.getFullYear() % 100);
      case 'MMMM':
        return names(language, { month: 'long' }, date);
      case 'MMM':
        return names(language, { month: 'short' }, date);
      case 'MM':
        return two(date.getMonth() + 1);
      case 'M':
        return String(date.getMonth() + 1);
      case 'dddd':
        return names(language, { weekday: 'long' }, date);
      case 'ddd':
        return names(language, { weekday: 'short' }, date);
      case 'DD':
        return two(date.getDate());
      case 'D':
        return String(date.getDate());
      case 'HH':
        return two(hours);
      case 'H':
        return String(hours);
      case 'hh':
        return two(twelve);
      case 'h':
        return String(twelve);
      case 'mm':
        return two(date.getMinutes());
      case 'm':
        return String(date.getMinutes());
      case 'ss':
        return two(date.getSeconds());
      case 's':
        return String(date.getSeconds());
      case 'A':
        return hours < 12 ? 'AM' : 'PM';
      case 'a':
        return hours < 12 ? 'am' : 'pm';
      default:
        return token;
    }
  });
}
