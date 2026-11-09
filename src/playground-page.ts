import { Kind, PlaygroundResult, kindOf } from './playground';
import { PageResult, PageState, houseRows, tryOnPage } from './playground-house';
import { decodeHash, encodeState } from './playground-share';
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
upstairs_lights: {domain: light, floor: first_floor}
`;

// An item template for the examples that fill one.
const LIGHT_ROW = `light_row:
  default:
    - area: no area
  item:
    entity: '[[entity]]'
    name: '[[name]]'
    area: '[[area]]'
`;

const OWN_EXAMPLE = `porch_light:
  domain: light
  state: 'on'
  area: Porch
  floor: ground_floor
  attributes: {brightness: 120}
my_sensors:
  domain: sensor
  count: 5
  name: Sensor [[index]]
  state: '1[[index]]'
  area: Garage
`;

interface Try {
  label: string;
  placeholder: string;
  templates?: string;
  entities?: string;
  /** A variable the example needs, added to the box when it is not there. */
  variable?: string;
}

// Something to start from for each thing people asked about in #216 and #427.
const TRIES: Try[] = [
  { label: 'A sum, with a variable as the argument', placeholder: '[[count|add:[[offset]]|mul:2]]' },
  { label: 'Text made into an id', placeholder: '[[room|slug|upper]]' },
  { label: "An area's id", placeholder: '[[entity|area_id]]' },
  { label: "An area's name", placeholder: '[[entity|area]]' },
  { label: 'A state', placeholder: '[[entity|state]]' },
  { label: 'An attribute', placeholder: '[[entity|attr:brightness]]' },
  { label: 'When it last changed', placeholder: '[[entity|last_changed]]' },
  { label: 'A value looked up by another', placeholder: '[[colours.[[level]]|default:grey]]' },
  { label: 'A list, counted', placeholder: '[[rooms|count]]' },
  { label: 'A list, joined', placeholder: '[[rooms|join]]' },
  { label: 'Looked up in a list of pairs', placeholder: '[[level|map:error=Stop,warning=Careful,*=Fine]]' },
  { label: 'A yes or no', placeholder: '[[room|contains:Garden]]' },
  { label: 'Unset, with a stand-in', placeholder: '[[missing|default:none]]' },
  { label: 'Unset and optional', placeholder: '[[missing?]]' },
  { label: 'Only while another says so', placeholder: '[[room|if:level=warning]]' },
  {
    label: 'Every light upstairs, through an item template',
    placeholder: '[[light_row|repeat:upstairs_lights]]',
    templates: LIGHT_ROW,
  },
  {
    label: 'An item template filled once',
    placeholder: '[[light_row|with:entity=light.hall,name=Hall]]',
    templates: LIGHT_ROW,
  },
  {
    label: 'Your own entities, repeated',
    placeholder: '[[light_row|repeat:garage]]',
    templates: LIGHT_ROW,
    entities: OWN_EXAMPLE,
    variable: 'garage: {area: Garage}',
  },
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

// What a box's own reading went wrong on, under the box.
function renderNote(note: HTMLElement, error: string | undefined, problems: string[], fine: string): void {
  note.replaceChildren();
  note.classList.toggle('try-note-bad', !!error || problems.length > 0);
  if (error) {
    note.appendChild(el('span', 'That does not read as YAML: '));
    note.appendChild(el('code', error.split('\n')[0]));
    return;
  }
  if (!problems.length) {
    note.textContent = fine;
    return;
  }
  const list = el('ul');
  for (const problem of problems) list.appendChild(el('li', problem));
  note.appendChild(list);
}

// The sample house's table, made from the same data the steps read.
function renderHouse(target: HTMLElement, result: PageResult): void {
  const table = el('table', undefined, 'try-house');
  const head = el('tr');
  ['Entity', 'State', 'Where', 'Labels', 'What else it has'].forEach((title) => head.appendChild(el('th', title)));
  table.appendChild(el('thead')).appendChild(head);
  const body = table.appendChild(el('tbody'));
  for (const row of houseRows(result.entities.house, result.entities.added)) {
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
    tr.appendChild(el('td', row.more.join('; ')));
    body.appendChild(tr);
  }
  const scroll = el('div', undefined, 'try-house-scroll');
  scroll.appendChild(table);
  target.replaceChildren(scroll);
}

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

async function start(): Promise<void> {
  const variables = byId<HTMLTextAreaElement>('try-variables');
  const expression = byId<HTMLInputElement>('try-expression');
  const output = byId('try-output');
  const tries = byId('try-examples');
  const tool = byId('try');
  const entities = byId<HTMLTextAreaElement>('try-entities');
  const onlyMine = byId<HTMLInputElement>('try-only');
  const entitiesNote = byId('try-entities-note');
  const entitiesBox = byId<HTMLDetailsElement>('try-entities-box');
  const templates = byId<HTMLTextAreaElement>('try-templates');
  const templatesNote = byId('try-templates-note');
  const templatesBox = byId<HTMLDetailsElement>('try-templates-box');
  const copy = byId<HTMLButtonElement>('try-copy');
  const link = byId<HTMLInputElement>('try-link');
  const linkNote = byId('try-link-note');
  const house = byId('try-house');
  if (!variables || !expression || !output || !tries || !tool) return;
  if (!entities || !onlyMine || !entitiesNote || !entitiesBox || !templates || !templatesNote || !templatesBox) return;
  if (!copy || !link || !linkNote) return;
  tool.hidden = false;

  const state = (): PageState => ({
    variables: variables.value,
    placeholder: expression.value,
    entities: entities.value,
    onlyMine: onlyMine.checked,
    templates: templates.value,
  });

  const fill = (wanted: Partial<PageState>): void => {
    variables.value = wanted.variables ?? VARIABLES;
    expression.value = wanted.placeholder ?? TRIES[0].placeholder;
    entities.value = wanted.entities ?? '';
    onlyMine.checked = !!wanted.onlyMine;
    templates.value = wanted.templates ?? '';
    // A box a link filled is shown open; an empty one stays out of the way.
    if (entities.value.trim() || onlyMine.checked) entitiesBox.open = true;
    if (templates.value.trim()) templatesBox.open = true;
  };

  const update = (): void => {
    const result = tryOnPage(state());
    render(output, result);
    const own = result.entities;
    const count = Object.keys(own.house.states).length;
    renderNote(
      entitiesNote,
      own.error,
      own.problems,
      own.added.length
        ? `${own.added.length} of yours, ${count} in the house altogether.`
        : `${count} entities in the house.`,
    );
    const named = Object.keys(result.templates.templates);
    renderNote(
      templatesNote,
      result.templates.error,
      result.templates.problems,
      named.length ? `Templates here: ${named.join(', ')}.` : 'No templates yet.',
    );
    if (house) renderHouse(house, result);
  };

  // The address follows the boxes, a little behind them, so a copied address is the example.
  let writing: number | undefined;
  let written = '';
  const writeHash = async (): Promise<string> => {
    const hash = await encodeState(state());
    written = hash;
    try {
      history.replaceState(null, '', `#${hash}`);
    } catch {
      // A page opened from a file, or a sandbox, may refuse; the Copy link still works.
    }
    return hash;
  };
  const soonHash = (): void => {
    window.clearTimeout(writing);
    writing = window.setTimeout(() => void writeHash(), 400);
  };

  let waiting: number | undefined;
  const soon = (): void => {
    window.clearTimeout(waiting);
    waiting = window.setTimeout(update, 150);
    soonHash();
  };
  [variables, expression, entities, templates].forEach((box) => box.addEventListener('input', soon));
  onlyMine.addEventListener('change', () => {
    update();
    soonHash();
  });

  const fromHash = async (opening = false): Promise<void> => {
    if (written && location.hash.slice(1) === written) return;
    const decoded = await decodeHash(location.hash);
    // A plain anchor - Contents, a heading, Skip to content - is not a shared example: the
    // boxes stay as they are. Only the first read, when the page opens, fills the defaults.
    if (!decoded && !opening) return;
    linkNote.textContent = '';
    if (decoded && 'problem' in decoded) {
      linkNote.textContent = decoded.problem;
      fill({});
    } else fill(decoded?.state ?? {});
    update();
  };
  window.addEventListener('hashchange', () => void fromHash());

  copy.addEventListener('click', async () => {
    window.clearTimeout(writing);
    const hash = await writeHash();
    const url = `${location.href.split('#')[0]}#${hash}`;
    link.value = url;
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(url);
      link.hidden = true;
      linkNote.textContent = 'Link copied. It opens this page with these boxes filled in.';
    } catch {
      // No clipboard here (plain http, an old browser): the link, selected, to copy by hand.
      link.hidden = false;
      link.focus();
      link.select();
      linkNote.textContent = 'Copy the link below - it is selected.';
    }
  });

  for (const each of TRIES) {
    const button = el('button', undefined, 'try-chip');
    button.type = 'button';
    button.appendChild(el('span', each.label, 'try-chip-label'));
    button.appendChild(codeWithPlaceholders(each.placeholder));
    button.addEventListener('click', () => {
      expression.value = each.placeholder;
      if (each.templates !== undefined && !templates.value.includes(each.templates.split(':')[0] + ':')) {
        templates.value = templates.value.trim()
          ? `${templates.value.replace(/\s+$/, '')}\n${each.templates}`
          : each.templates;
        templatesBox.open = true;
      }
      if (each.entities !== undefined && !entities.value.includes(each.entities.split(':')[0] + ':')) {
        entities.value = entities.value.trim()
          ? `${entities.value.replace(/\s+$/, '')}\n${each.entities}`
          : each.entities;
        entitiesBox.open = true;
      }
      if (each.variable !== undefined && !variables.value.includes(each.variable.split(':')[0] + ':')) {
        variables.value = `${variables.value.replace(/\s+$/, '')}\n${each.variable}\n`;
      }
      update();
      soonHash();
      expression.focus();
    });
    tries.appendChild(button);
  }

  await fromHash(true);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void start());
else void start();
