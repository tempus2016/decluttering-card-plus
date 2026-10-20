import { Kind, PlaygroundResult, kindOf, tryPlaceholder } from './playground';
import { codeWithPlaceholders, el } from './docs-dom';

/*
 * The "Try a placeholder" page on the docs site: docs-theme/playground.html. Built by
 * rollup to docs-theme/assets/js/playground.js. English like the rest of the site.
 */

const VARIABLES = `entity: light.kitchen_ceiling
room: Back Garden
count: 3
offset: 2
level: warning
colours:
  error: red
  warning: amber
  good: green
rooms: [kitchen, hall, study]
`;

// Something to start from for each thing people asked about in #216.
const TRIES: [string, string][] = [
  ['A sum, with a variable as the argument', '[[count|add:[[offset]]|mul:2]]'],
  ['Text made into an id', '[[room|slug|upper]]'],
  ["An area's id", '[[entity|area_id]]'],
  ["An area's name", '[[entity|area]]'],
  ['A state', '[[entity|state]]'],
  ['An attribute', '[[entity|attr:brightness]]'],
  ['A value looked up by another', '[[colours.[[level]]|default:grey]]'],
  ['A list, counted', '[[rooms|count]]'],
  ['A list, joined', '[[rooms|join]]'],
  ['Looked up in a list of pairs', '[[level|map:error=Stop,warning=Careful,*=Fine]]'],
  ['A yes or no', '[[room|contains:Garden]]'],
  ['Unset, with a stand-in', '[[missing|default:none]]'],
  ['Unset and optional', '[[missing?]]'],
  ['Only while another says so', '[[room|if:level=warning]]'],
];

const KIND_WORDS: Record<Kind, string> = {
  text: 'text',
  number: 'a number',
  boolean: 'true or false',
  list: 'a list',
  mapping: 'a mapping',
  null: 'null',
  unresolved: 'nothing - left as written',
  removed: 'nothing - the option is taken out',
};

function shown(value: unknown, kind: Kind): string {
  if (kind === 'removed') return '(gone)';
  if (kind === 'unresolved') return String(value);
  return JSON.stringify(value);
}

function valueCell(value: unknown, kind: Kind): HTMLElement {
  const td = el('td');
  td.appendChild(codeWithPlaceholders(shown(value, kind)));
  return td;
}

function kindCell(kind: Kind): HTMLElement {
  const td = el('td');
  td.appendChild(el('span', KIND_WORDS[kind], `try-kind try-kind-${kind}`));
  return td;
}

function render(output: HTMLElement, result: PlaygroundResult): void {
  output.replaceChildren();
  if (result.error) {
    const box = el('blockquote', undefined, 'builder-error');
    box.appendChild(el('p', 'Those variables do not read as YAML:'));
    const pre = el('pre');
    pre.appendChild(el('code', result.error));
    box.appendChild(pre);
    output.appendChild(box);
    return;
  }

  const table = el('table', undefined, 'try-table');
  const head = el('tr');
  ['Where it is written', 'It gives', 'As'].forEach((title) => head.appendChild(el('th', title)));
  table.appendChild(el('thead')).appendChild(head);
  const body = table.appendChild(el('tbody'));
  const whole = el('tr');
  whole.appendChild(el('td', 'The whole value of an option'));
  whole.appendChild(valueCell(result.whole.value, result.whole.kind));
  whole.appendChild(kindCell(result.whole.kind));
  body.appendChild(whole);
  if (result.inText !== undefined) {
    const inText = el('tr');
    inText.appendChild(el('td', 'Inside a longer piece of text'));
    const kind = kindOf(result.inText);
    inText.appendChild(valueCell(result.inText, kind === 'unresolved' ? 'text' : kind));
    inText.appendChild(kindCell(kind));
    body.appendChild(inText);
  }
  output.appendChild(table);

  if (result.unset.length) {
    const note = el('p', undefined, 'builder-help');
    note.appendChild(document.createTextNode('Nothing set '));
    result.unset.forEach((name, at) => {
      if (at) note.appendChild(document.createTextNode(', '));
      note.appendChild(el('code', name));
    });
    note.appendChild(
      document.createTextNode(
        '. Add it to the variables above, give it a |default:, or end the placeholder with ? to take the option out instead.',
      ),
    );
    output.appendChild(note);
  }

  if (result.steps.length) {
    output.appendChild(el('h3', 'Step by step'));
    const steps = el('table', undefined, 'try-table');
    const row = el('tr');
    ['Step', 'Gives', 'As'].forEach((title) => row.appendChild(el('th', title)));
    steps.appendChild(el('thead')).appendChild(row);
    const rows = steps.appendChild(el('tbody'));
    result.steps.forEach((step, at) => {
      const tr = el('tr');
      const name = el('td');
      name.appendChild(codeWithPlaceholders(at === 0 ? step.step : `|${step.step}`));
      tr.appendChild(name);
      tr.appendChild(valueCell(step.value, step.kind));
      tr.appendChild(kindCell(step.kind));
      rows.appendChild(tr);
    });
    output.appendChild(steps);
  }
}

function start(): void {
  const variables = document.getElementById('try-variables') as HTMLTextAreaElement | null;
  const expression = document.getElementById('try-expression') as HTMLInputElement | null;
  const output = document.getElementById('try-output');
  const tries = document.getElementById('try-examples');
  const tool = document.getElementById('try');
  if (!variables || !expression || !output || !tries || !tool) return;
  tool.hidden = false;
  variables.value = VARIABLES;
  expression.value = TRIES[0][1];

  const update = (): void => render(output, tryPlaceholder(variables.value, expression.value));
  let waiting: number | undefined;
  const soon = (): void => {
    window.clearTimeout(waiting);
    waiting = window.setTimeout(update, 150);
  };
  variables.addEventListener('input', soon);
  expression.addEventListener('input', soon);

  for (const [label, text] of TRIES) {
    const button = el('button', undefined, 'try-chip');
    button.type = 'button';
    button.appendChild(el('span', label, 'try-chip-label'));
    button.appendChild(codeWithPlaceholders(text));
    button.addEventListener('click', () => {
      expression.value = text;
      update();
      expression.focus();
    });
    tries.appendChild(button);
  }
  update();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
