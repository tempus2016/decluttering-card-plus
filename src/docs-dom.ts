/*
 * The little DOM the docs site's two tools share: the template builder and "Try a
 * placeholder". Text goes in as text nodes, never as HTML - what people paste is shown,
 * not run.
 */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

/*
 * Text cut into plain runs and whole placeholders. Brackets are counted, so a placeholder
 * with another inside it - `[[count|add:[[offset]]]]` - is one piece, not one and a half.
 * An opening with no closing is plain text.
 */
export function placeholderRuns(text: string): { text: string; placeholder: boolean }[] {
  const runs: { text: string; placeholder: boolean }[] = [];
  let plain = '';
  let at = 0;
  while (at < text.length) {
    if (text.startsWith('[[', at)) {
      let depth = 0;
      let end = at;
      while (end < text.length) {
        if (text.startsWith('[[', end)) {
          depth += 1;
          end += 2;
        } else if (text.startsWith(']]', end)) {
          depth -= 1;
          end += 2;
          if (depth === 0) break;
        } else if (text[end] === '\n') break;
        else end += 1;
      }
      if (depth === 0) {
        if (plain) runs.push({ text: plain, placeholder: false });
        plain = '';
        runs.push({ text: text.slice(at, end), placeholder: true });
        at = end;
        continue;
      }
    }
    plain += text[at];
    at += 1;
  }
  if (plain) runs.push({ text: plain, placeholder: false });
  return runs;
}

/** Code with every `[[placeholder]]` lit, the way docs.js lights the code on every page. */
export function codeWithPlaceholders(text: string): HTMLElement {
  const code = el('code');
  for (const run of placeholderRuns(text)) {
    code.appendChild(run.placeholder ? el('span', run.text, 'ph-var') : document.createTextNode(run.text));
  }
  return code;
}
