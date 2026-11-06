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
