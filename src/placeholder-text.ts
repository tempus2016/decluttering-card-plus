/*
 * A value's JSON, for reading the placeholders in it. JSON.stringify writes a list inside a
 * list as `[[...]]`, and that reads as a placeholder: a group's list of cards, held in a
 * list of the template's parts, came out as `[[{"type":"heading",...}]]`, and the editor
 * said a variable named after the whole list had no value. The brackets of a placeholder
 * are only ever inside a string, so here two brackets of the JSON's own that meet are
 * kept apart by a space - which JSON.parse reads past, so the text still parses to the
 * same value. Brackets inside strings are left exactly as written.
 */
// Typed as JSON.stringify is: a string, though undefined and functions still give undefined.
export function placeholderJson(value: unknown): string {
  const json = JSON.stringify(value);
  if (typeof json !== 'string' || (!json.includes('[[') && !json.includes(']]'))) return json;
  let out = '';
  let inString = false;
  let previous = '';
  for (let index = 0; index < json.length; index += 1) {
    const char = json[index];
    if (inString) {
      out += char;
      if (char === '\\') {
        index += 1;
        out += json[index];
      } else if (char === '"') {
        inString = false;
      }
      previous = char;
      continue;
    }
    if (char === '"') inString = true;
    else if ((char === '[' || char === ']') && previous === char) out += ' ';
    out += char;
    previous = char;
  }
  return out;
}

/*
 * What a pattern finds across a value and a list of variables, worked out a value at a time
 * so a value that is an object is searched once and the answer kept against it (#456). Every
 * nested build searches its whole scope - every item template's body is in it - and turning
 * all of that into JSON and searching it again for each one was most of a large card's
 * build. Each value is searched as its own JSON, the same text the whole would have given
 * it; a match never spans two values, as none of these patterns can cross a JSON string.
 */
const FOUND = new WeakMap<RegExp, WeakMap<object, string[]>>();
const GLOBAL = new WeakMap<RegExp, RegExp>();
const NONE: string[] = [];
function foundIn(value: unknown, pattern: RegExp): string[] {
  const search = (): string[] => {
    const json = typeof value === 'string' ? value : placeholderJson(value);
    if (typeof json !== 'string') return NONE;
    let global = GLOBAL.get(pattern);
    if (!global) {
      global = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
      GLOBAL.set(pattern, global);
    }
    global.lastIndex = 0;
    let out = NONE;
    for (let match = global.exec(json); match !== null; match = global.exec(json)) {
      if (out === NONE) out = [];
      out.push(match.length > 1 ? match.slice(1).join('.') : match[0]);
      if (match[0] === '') global.lastIndex += 1;
    }
    global.lastIndex = 0;
    return out;
  };
  // Every pattern here starts at a placeholder's brackets or a step's bar.
  if (typeof value === 'string') return value.includes('[[') || value.includes('|') ? search() : NONE;
  if (!value || typeof value !== 'object') return NONE;
  let byValue = FOUND.get(pattern);
  if (!byValue) FOUND.set(pattern, (byValue = new WeakMap()));
  let found = byValue.get(value);
  if (!found) byValue.set(value, (found = search()));
  return found;
}

/**
 * Every match of `pattern` in `content` and the variables' names and values, as the JSON of
 * `[content, variables]` would have shown them: a match's groups joined with `.`, or the
 * whole match when the pattern has none.
 */
export function findAcross(content: unknown, variables: readonly unknown[], pattern: RegExp): string[] {
  const out: string[] = [];
  const add = (found: string[]): void => {
    for (const each of found) out.push(each);
  };
  add(foundIn(content, pattern));
  for (const entry of variables) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      add(foundIn(entry, pattern));
      continue;
    }
    for (const name in entry) {
      if (!Object.prototype.hasOwnProperty.call(entry, name)) continue;
      add(foundIn(name, pattern));
      add(foundIn((entry as Record<string, unknown>)[name], pattern));
    }
  }
  return out;
}
