/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * What `debug: yaml` shows. People compare the debug output with a card they know works,
 * and that card is written in YAML, so JSON made them translate it in their heads first.
 *
 * Home Assistant's own YAML library is not on the page outside the editor, and a whole
 * library for one debug view is a lot of bundle. A card's config is only ever objects,
 * lists and plain values, which is all this has to handle. Anything it is unsure of gets
 * quoted: a quoted string reads back as the same string, so when in doubt it is correct
 * rather than pretty.
 */

// Words that YAML would read back as a boolean or null rather than as text.
const RESERVED = /^(true|false|yes|no|y|n|on|off|null|~)$/i;

/** Whether a string can be written as it is, without quotes, and still read back as itself. */
function isPlain(text: string): boolean {
  if (!/^[A-Za-z_/(]/.test(text)) return false;
  if (RESERVED.test(text)) return false;
  if (/[\s:]$/.test(text)) return false;
  if (/: |\s#|[\t\r\n]/.test(text)) return false;
  return true;
}

// A JSON string is also a valid double-quoted YAML string, escapes and all.
function quote(text: string): string {
  return JSON.stringify(text);
}

function scalar(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return isPlain(value) ? value : quote(value);
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
  return String(value);
}

/*
 * A template or a block of card_mod CSS is easier to read as the lines it was written as.
 * A block only works when the first line does not start with a space - YAML would take
 * that as the block's indent - and when there are no carriage returns or tabs to lose.
 * More than one newline at the end is left quoted: a block keeping them depends on what
 * comes after it, and at the end of the output nothing does.
 */
function block(text: string, indent: string): string | undefined {
  if (!text.includes('\n') || /^[ \n]/.test(text) || /[\r\t]/.test(text) || /\n\n$/.test(text)) return undefined;
  const body = text.replace(/\n$/, '');
  const chomp = body === text ? '|-' : '|';
  return `${chomp}\n${body
    .split('\n')
    .map((line) => (line ? indent + line : ''))
    .join('\n')}`;
}

function isObject(value: any): boolean {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Undefined is dropped, as JSON.stringify drops it, so both debug views show the same keys.
function entries(value: Record<string, any>): [string, any][] {
  return Object.entries(value).filter(([, v]) => v !== undefined);
}

function isEmpty(value: any): boolean {
  return Array.isArray(value) ? value.length === 0 : isObject(value) && entries(value).length === 0;
}

/** The value written after `key:` or `- `, on the same line or starting the next ones. */
function after(value: any, indent: string): string {
  if (Array.isArray(value)) return value.length ? '\n' + lines(value, indent + '  ') : ' []';
  if (isObject(value)) return isEmpty(value) ? ' {}' : '\n' + lines(value, indent + '  ');
  if (typeof value === 'string') {
    const text = block(value, indent + '  ');
    if (text) return ' ' + text;
  }
  return ' ' + scalar(value);
}

function lines(value: any, indent: string): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        // A mapping in a list starts on the dash's own line, the rest lined up under it.
        if (isObject(item) && !isEmpty(item)) {
          return `${indent}- ${lines(item, indent + '  ').slice(indent.length + 2)}`;
        }
        if (Array.isArray(item) && item.length) {
          return `${indent}-\n${lines(item, indent + '  ')}`;
        }
        return `${indent}-${after(item, indent)}`;
      })
      .join('\n');
  }
  return entries(value)
    .map(([key, v]) => `${indent}${scalar(key)}:${after(v, indent)}`)
    .join('\n');
}

/** A card's config as YAML, laid out the way it would be written in a dashboard. */
export function toYaml(value: any): string {
  if (Array.isArray(value) || isObject(value))
    return isEmpty(value) ? (Array.isArray(value) ? '[]' : '{}') : lines(value, '');
  const text = typeof value === 'string' ? block(value, '  ') : undefined;
  return text ?? scalar(value);
}
