/*
 * The little DOM the docs site's two tools share: the template builder and "Try a
 * placeholder". Text goes in as text nodes, never as HTML - what people paste is shown,
 * not run.
 */

import type { HouseRow } from './playground-house';

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
const MAX_OPENS_PER_LINE = 200;

export function placeholderRuns(text: string): { text: string; placeholder: boolean }[] {
  const runs: { text: string; placeholder: boolean }[] = [];
  let plain = '';
  let at = 0;
  // A line is scanned once from each `[[` in it, so a line made of thousands of them took the
  // square of its length. Past this many on one line nothing is a placeholder anybody wrote,
  // and the line is text (review 2026-10-25).
  let lineIsText = false;
  while (at < text.length) {
    if (at === 0 || text[at - 1] === '\n') {
      const lineEnd = text.indexOf('\n', at);
      const line = text.slice(at, lineEnd === -1 ? text.length : lineEnd);
      lineIsText = (line.match(/\[\[/g) ?? []).length > MAX_OPENS_PER_LINE;
    }
    if (!lineIsText && text.startsWith('[[', at)) {
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

async function copy(text: string, button: HTMLButtonElement, pre: HTMLElement): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
  } catch {
    // No clipboard (plain http, or a browser that refuses): select it for Ctrl+C instead.
    const range = document.createRange();
    range.selectNodeContents(pre);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    button.textContent = 'Selected - press Ctrl+C';
  }
  window.setTimeout(() => (button.textContent = 'Copy'), 2000);
}

/** A titled block of code with a line of help and a Copy button. */
export function codeBlock(title: string, help: string, text: string): HTMLElement {
  const wrap = el('div', undefined, 'builder-block');
  const head = el('div', undefined, 'builder-block-head');
  head.appendChild(el('strong', title));
  const button = el('button', 'Copy', 'builder-copy');
  button.type = 'button';
  head.appendChild(button);
  wrap.appendChild(head);
  wrap.appendChild(el('p', help, 'builder-help'));
  const pre = el('pre');
  pre.appendChild(codeWithPlaceholders(text));
  wrap.appendChild(pre);
  button.addEventListener('click', () => copy(text, button, pre));
  return wrap;
}

/**
 * The house's table for both Try pages, made from the rows the steps themselves read. `more`
 * adds the column of everything else an entity has, which only Try a placeholder shows.
 */
export function houseTable(rows: HouseRow[], more = false): HTMLElement {
  const table = el('table', undefined, 'try-house');
  const head = el('tr');
  const titles = ['Entity', 'State', 'Where', 'Labels', ...(more ? ['What else it has'] : [])];
  titles.forEach((title) => head.appendChild(el('th', title)));
  table.appendChild(el('thead')).appendChild(head);
  const body = table.appendChild(el('tbody'));
  for (const row of rows) {
    const tr = el('tr', undefined, row.own ? 'try-house-own' : undefined);
    const id = el('td');
    id.appendChild(el('code', row.entity));
    if (row.own) id.appendChild(el('span', ' yours', 'try-house-mark'));
    tr.appendChild(id);
    const state = el('td');
    if (row.state) state.appendChild(el('code', row.state));
    tr.appendChild(state);
    tr.appendChild(el('td', row.where));
    tr.appendChild(el('td', row.labels.join(', ')));
    if (more) tr.appendChild(el('td', row.more.join('; ')));
    body.appendChild(tr);
  }
  const scroll = el('div', undefined, 'try-house-scroll');
  scroll.appendChild(table);
  return scroll;
}
