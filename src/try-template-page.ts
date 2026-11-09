import { dump } from 'js-yaml';
import { CardBuild, readCard, tryTemplate, TryTemplateResult, TryTemplateState } from './try-template';
import { controlValue, StandInField, withVariable } from './try-template-form';
import { gistId, loadGist } from './try-template-gist';
import { decodeHash, encodeState, SharedState } from './playground-share';
import { houseRows } from './playground-house';
import { outlineLines, outlineTags } from './report-outline';
import { toYaml } from './yaml';
import { el } from './docs-dom';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The "Try a template" page on the docs site (#427): docs-theme/try-template.html, built by
 * rollup to docs-theme/assets/js/try-template.js. English like the rest of the site. Every
 * piece of text people typed goes in as text, never as HTML.
 */

const SMALL_TEMPLATES = `decluttering_defaults:
  - accent: amber
decluttering_templates:
  light_tile:
    variables:
      - name: entity
        type: entity
        domain: light
        required: true
      - name: show_name
        type: boolean
        default: true
      - name: name
        description: Shown only while show_name is on
        default: '[[entity|friendly_name]]'
        show_if: show_name
      - name: colour
        selector: {select: {options: [red, amber, green]}}
        default: '[[accent]]'
        group: Looks
      - name: size
        type: number
        min: 1
        max: 4
        default: 2
        group: Looks
    card:
      type: tile
      entity: '[[entity]]'
      name: '[[name|if:show_name?]]'
      color: '[[colour]]'
      grid_options: {columns: '[[size|mul:3]]'}
`;

const SMALL_CARD = `type: custom:decluttering-card-plus
template: light_tile
variables:
  - entity: light.kitchen_ceiling
`;

const NESTED_CARD = `type: custom:decluttering-card-plus
template: two_lights
`;

const NESTED_TEMPLATES = `decluttering_templates:
  light_tile:
    default:
      - colour: amber
    card:
      type: tile
      entity: '[[entity]]'
      color: '[[colour]]'
  two_lights:
    let:
      - upstairs: light.landing
    card:
      type: horizontal-stack
      cards:
        - type: custom:decluttering-card-plus
          template: light_tile
          variables:
            - entity: light.kitchen_ceiling
        - type: custom:decluttering-card-plus
          template: light_tile
          inherit_variables: true
          variables:
            - entity: '[[upstairs]]'
            - colour: blue
`;

const REPEAT_CARD = `type: custom:decluttering-card-plus
template: light_tile
columns: 2
for_each:
  - entity: light.kitchen_ceiling
  - entity: light.hall
  - entity: sensor.garden_temperature
`;

const CHECKS_TEMPLATES = `decluttering_templates:
  camera_tile:
    strict: {warnings: notice}
    checks:
      - name: No camera
        condition: '[[camera|exists]]'
        fail_on: false
        level: warn
        message: There is no [[camera]] in Home Assistant.
    variables:
      - name: camera
        type: entity
        domain: camera
    card:
      type: picture-entity
      entity: '[[camera]]'
      name: '[[camera|friendly_name|default:Camera]]'
`;

const CHECKS_CARD = `type: custom:decluttering-card-plus
template: camera_tile
variables:
  - camera: camera.front_door
`;

const BY_DOMAIN_TEMPLATES = `decluttering_templates:
  light_row:
    row: {entity: '[[entity]]', icon: mdi:lightbulb}
  sensor_row:
    row: {entity: '[[entity]]', secondary_info: last-changed}
  plain_row:
    row: {entity: '[[entity]]'}
  every_row:
    card:
      type: entities
      entities:
        - type: custom:decluttering-card-plus
          template_by_domain: {light: light_row, sensor: sensor_row, default: plain_row}
          for_each:
            - entity: light.kitchen_ceiling
            - entity: sensor.garden_temperature
            - entity: binary_sensor.bedroom_window
`;

const BY_DOMAIN_CARD = `type: custom:decluttering-card-plus
template: every_row
`;

interface Example {
  label: string;
  templates: string;
  card: string;
  entities?: string;
}

const EXAMPLES: Example[] = [
  { label: 'A tile with defaults, show_if and a group', templates: SMALL_TEMPLATES, card: SMALL_CARD },
  { label: 'Cards of ours inside a card, one handed variables', templates: NESTED_TEMPLATES, card: NESTED_CARD },
  { label: 'A repeat with for_each, in two columns', templates: NESTED_TEMPLATES, card: REPEAT_CARD },
  { label: 'Rows chosen by domain', templates: BY_DOMAIN_TEMPLATES, card: BY_DOMAIN_CARD },
  {
    label: 'A failed check and a strict notice',
    templates: CHECKS_TEMPLATES,
    card: CHECKS_CARD,
  },
];

// A link past this is long for a chat message or an issue; a gist is the better way to share it.
const LONG_LINK = 8000;
// A build that takes longer than this stops building on every keystroke and waits for the button.
const SLOW_MS = 800;

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function noteInto(target: HTMLElement, bad: boolean, ...parts: (string | Node)[]): void {
  target.replaceChildren(...parts.map((part) => (typeof part === 'string' ? document.createTextNode(part) : part)));
  target.classList.toggle('try-note-bad', bad);
}

async function copyInto(text: string, button: HTMLButtonElement): Promise<void> {
  const was = button.textContent;
  try {
    if (!navigator.clipboard) throw new Error('no clipboard');
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select and copy it';
  }
  window.setTimeout(() => (button.textContent = was), 1600);
}

function block(title: string, text: string, open = true, id?: string): HTMLElement {
  const box = el('details', undefined, 'try-box tt-block');
  if (id) box.id = id;
  box.open = open;
  const summary = el('summary');
  summary.appendChild(el('span', title));
  box.appendChild(summary);
  const head = el('div', undefined, 'tt-block-tools');
  const copy = el('button', 'Copy', 'builder-copy');
  copy.type = 'button';
  copy.addEventListener('click', () => void copyInto(text, copy));
  head.appendChild(copy);
  box.appendChild(head);
  const pre = el('pre', undefined, 'tt-pre');
  pre.appendChild(el('code', text));
  box.appendChild(pre);
  return box;
}

function buildLine(build: CardBuild): string {
  const where = build.where === '.' ? 'the card' : build.where;
  return `${build.template ?? '?'} (${where})`;
}

function renderWarnings(target: HTMLElement, result: TryTemplateResult): void {
  const items: HTMLElement[] = [];
  const add = (level: 'bad' | 'warn' | 'info', title: string, text: string): void => {
    const li = el('li', undefined, `tt-said tt-said-${level}`);
    li.appendChild(el('strong', `${title}: `));
    li.appendChild(document.createTextNode(text));
    items.push(li);
  };
  for (const build of result.builds) {
    const who = buildLine(build);
    if (build.error) add('bad', who, `does not build - ${build.error}`);
    if (build.hidden) add('info', who, `hides itself: ${build.hidden}`);
    for (const alert of build.alerts)
      add(
        alert.level === 'info' ? 'info' : alert.level === 'error' ? 'bad' : 'warn',
        who,
        `check ${alert.name ? `"${alert.name}" ` : ''}failed (${alert.level}): ${alert.message}`,
      );
    if (build.unresolved.length)
      add('warn', who, `nothing set ${build.unresolved.map((name) => `[[${name}]]`).join(', ')} - left as written`);
    for (const warning of build.warnings) add('warn', who, warning);
    if (build.notice) add('info', who, `strict: shows a notice above the card - ${build.notice.join('; ')}`);
    if (build.skipped) add('info', who, `${build.skipped} of its copies left out by the template's visibility:`);
  }
  for (const path of result.neverBuilt)
    add('info', path, 'a card of ours inside, left as it is: it built nothing, or this page does not build it');
  target.replaceChildren();
  if (!items.length) {
    target.appendChild(el('p', 'Nothing to say: every card built, every placeholder had a value.', 'builder-help'));
    return;
  }
  const list = el('ul', undefined, 'tt-said-list');
  items.forEach((item) => list.appendChild(item));
  target.appendChild(list);
}

function renderOutline(result: TryTemplateResult): HTMLElement | undefined {
  if (!result.outline.length || !result.outline[0].children.length) return undefined;
  const box = el('details', undefined, 'try-box tt-block');
  box.open = true;
  box.appendChild(el('summary', 'What built what'));
  const list = el('ul', undefined, 'tt-outline');
  for (const { node, depth } of outlineLines(result.outline)) {
    const li = el('li');
    li.style.paddingInlineStart = `${depth * 1.1}rem`;
    li.appendChild(el('code', node.copy ? `${node.name} ${node.copy}` : node.name));
    const tags = outlineTags(node);
    if (tags.length) li.appendChild(el('span', ` · ${tags.join(' · ')}`, 'tt-outline-tags'));
    if (node.skipped) li.appendChild(el('span', ` · ${node.skipped}`, 'tt-outline-tags'));
    list.appendChild(li);
  }
  box.appendChild(list);
  return box;
}

function fieldText(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function renderForm(
  target: HTMLElement,
  result: TryTemplateResult,
  onSet: (name: string, value: unknown) => void,
): void {
  target.replaceChildren();
  if (!result.fields.length) {
    target.appendChild(
      el(
        'p',
        result.template
          ? `The template ${result.templateName ? `"${result.templateName}" ` : ''}declares no variables, so the card editor shows only its YAML box.`
          : 'The form appears once the card builds from a template that declares its variables.',
        'builder-help',
      ),
    );
    return;
  }
  let group: string | undefined;
  let into: HTMLElement = target;
  for (const field of result.fields) {
    if (field.group !== group) {
      group = field.group;
      if (group === undefined) into = target;
      else {
        const box = el('details', undefined, 'tt-group');
        box.open = true;
        box.appendChild(el('summary', group));
        target.appendChild(box);
        into = box;
      }
    }
    into.appendChild(renderField(field, onSet));
  }
}

function renderField(field: StandInField, onSet: (name: string, value: unknown) => void): HTMLElement {
  const row = el('div', undefined, `tt-field${field.hidden ? ' tt-field-hidden' : ''}`);
  const id = `tt-var-${field.name.replace(/[^A-Za-z0-9_-]/g, '_')}`;
  const label = el('label', undefined, 'tt-field-label');
  label.htmlFor = id;
  label.appendChild(document.createTextNode(field.label));
  if (field.required) label.appendChild(el('span', ' *', 'tt-required'));
  const meta = el('span', undefined, 'tt-field-meta');
  meta.appendChild(el('code', field.name));
  meta.appendChild(document.createTextNode(` · ${field.selector}`));
  label.appendChild(meta);
  row.appendChild(label);

  // Run after the current redraw: a field taken out mid-redraw fires its change as it goes,
  // and a second redraw inside the first would pull the form apart.
  const set = (value: unknown): void => void setTimeout(() => onSet(field.name, value), 0);
  let control: HTMLElement;
  if (field.control === 'checkbox') {
    const box = el('input');
    box.type = 'checkbox';
    box.id = id;
    box.checked = field.set
      ? field.value === true || ['true', 'yes', 'on', '1'].includes(String(field.value).toLowerCase())
      : field.shown === true;
    box.addEventListener('change', () => set(box.checked));
    control = box;
  } else if (field.control === 'select') {
    const select = el('select', undefined, 'builder-input tt-input');
    select.id = id;
    select.appendChild(
      new Option(field.shown !== undefined ? `(default: ${fieldText(field.shown)})` : '(not set)', ''),
    );
    for (const option of field.options ?? []) select.appendChild(new Option(option.label, option.value));
    const current = fieldText(field.value);
    if (field.set && ![...select.options].some((option) => option.value === current)) {
      select.appendChild(new Option(`${current} (not one of the options)`, current));
    }
    select.value = field.set ? current : '';
    select.addEventListener('change', () => set(select.value === '' ? undefined : select.value));
    control = select;
  } else if (field.control === 'card') {
    control = el('p', 'A card: write it in the card box above.', 'builder-help');
  } else {
    const input = field.multiline
      ? el('textarea', undefined, 'builder-input tt-input')
      : el('input', undefined, 'builder-input tt-input');
    if (input instanceof HTMLInputElement) {
      input.type = field.control === 'number' ? 'number' : 'text';
      if (field.min !== undefined) input.min = String(field.min);
      if (field.max !== undefined) input.max = String(field.max);
      if (field.step !== undefined) input.step = String(field.step);
    }
    input.id = id;
    input.spellcheck = false;
    input.setAttribute('autocomplete', 'off');
    input.value = field.set ? fieldText(field.value) : '';
    input.placeholder = field.shown !== undefined ? fieldText(field.shown) : '';
    input.addEventListener('change', () => set(input.value === '' ? undefined : controlValue(field, input.value)));
    control = input;
  }
  row.appendChild(control);
  if (field.unit) row.appendChild(el('span', ` ${field.unit}`, 'tt-field-meta'));

  const said: string[] = [];
  if (field.set) said.push('set by the card');
  else if (field.shown !== undefined) said.push(`unset: builds with ${fieldText(field.shown)}`);
  else said.push('unset, with no default');
  if (field.hidden)
    said.push(
      `hidden in the editor now (${[...(field.showIf ?? []).map((c) => `show_if ${c}`), ...(field.hideIf ?? []).map((c) => `hide_if ${c}`)].join(', ')})`,
    );
  else if (field.showIf || field.hideIf) said.push('shown now');
  const help = el('p', undefined, 'tt-field-help');
  if (field.description) help.appendChild(el('span', `${field.description}. `));
  help.appendChild(document.createTextNode(said.join(' · ')));
  row.appendChild(help);
  return row;
}

function renderHouse(target: HTMLElement, result: TryTemplateResult): void {
  const table = el('table', undefined, 'try-house');
  const head = el('tr');
  ['Entity', 'State', 'Where', 'Labels'].forEach((title) => head.appendChild(el('th', title)));
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
    body.appendChild(tr);
  }
  const scroll = el('div', undefined, 'try-house-scroll');
  scroll.appendChild(table);
  target.replaceChildren(scroll);
}

async function start(): Promise<void> {
  const tool = byId('tt');
  const templates = byId<HTMLTextAreaElement>('tt-templates');
  const card = byId<HTMLTextAreaElement>('tt-card');
  const entities = byId<HTMLTextAreaElement>('tt-entities');
  const onlyMine = byId<HTMLInputElement>('tt-only');
  const readAll = byId<HTMLInputElement>('tt-all');
  const templatesNote = byId('tt-templates-note');
  const cardNote = byId('tt-card-note');
  const entitiesNote = byId('tt-entities-note');
  const entitiesBox = byId<HTMLDetailsElement>('tt-entities-box');
  const form = byId('tt-form');
  const said = byId('tt-said');
  const output = byId('tt-output');
  const status = byId('tt-status');
  const buildNow = byId<HTMLButtonElement>('tt-build');
  const examples = byId('tt-examples');
  const copy = byId<HTMLButtonElement>('tt-copy');
  const link = byId<HTMLInputElement>('tt-link');
  const linkNote = byId('tt-link-note');
  const gist = byId<HTMLInputElement>('tt-gist');
  const gistLoad = byId<HTMLButtonElement>('tt-gist-load');
  const gistNote = byId('tt-gist-note');
  const house = byId('tt-house');
  if (!tool || !templates || !card || !entities || !onlyMine || !readAll || !templatesNote || !cardNote) return;
  if (!entitiesNote || !entitiesBox || !form || !said || !output || !status || !buildNow || !examples) return;
  if (!copy || !link || !linkNote || !gist || !gistLoad || !gistNote) return;
  tool.hidden = false;

  const state = (): TryTemplateState => ({
    templates: templates.value,
    card: card.value,
    entities: entities.value,
    onlyMine: onlyMine.checked,
    readAll: readAll.checked,
  });
  const shared = (): SharedState => ({
    templates: templates.value,
    card: card.value,
    entities: entities.value,
    onlyMine: onlyMine.checked,
    readAll: readAll.checked,
  });

  const fill = (wanted: SharedState): void => {
    templates.value = wanted.templates ?? EXAMPLES[0].templates;
    card.value = wanted.card ?? EXAMPLES[0].card;
    entities.value = wanted.entities ?? '';
    onlyMine.checked = !!wanted.onlyMine;
    readAll.checked = !!wanted.readAll;
    if (entities.value.trim() || onlyMine.checked) entitiesBox.open = true;
  };

  let manual = false;
  const update = (): void => {
    const started = performance.now();
    const result = tryTemplate(state());
    const ms = Math.round(performance.now() - started);
    manual = ms > SLOW_MS;
    buildNow.hidden = !manual;
    noteInto(
      status,
      false,
      `Built in ${ms} ms.${manual ? ' That is slow enough that the page now waits for Build now rather than building on every change.' : ''}`,
    );

    const box = result.templatesBox;
    if (box.error) noteInto(templatesNote, true, 'That does not read as YAML: ', el('code', box.error.split('\n')[0]));
    else noteInto(templatesNote, false, box.names.length ? `Templates: ${box.names.join(', ')}.` : 'No templates yet.');
    if (result.cardError) noteInto(cardNote, true, 'The card ', el('code', result.cardError));
    else noteInto(cardNote, false, '');
    const own = result.entities;
    const count = Object.keys(own.house.states).length;
    if (own.error) noteInto(entitiesNote, true, 'That does not read as YAML: ', el('code', own.error.split('\n')[0]));
    else if (own.problems.length) noteInto(entitiesNote, true, own.problems.join(' '));
    else
      noteInto(
        entitiesNote,
        false,
        own.added.length
          ? `${own.added.length} of yours, ${count} in the house altogether.`
          : `${count} entities in the house.`,
      );

    // The form is drawn again on every build: the field that had focus keeps it (#427).
    const active = document.activeElement;
    const focused = active && form.contains(active) && active.id ? active.id : '';
    renderForm(form, result, (name, value) => {
      let parsed: Record<string, any>;
      try {
        parsed = readCard(card.value);
      } catch {
        return;
      }
      card.value = dump(withVariable(parsed, name, value), { lineWidth: -1, noRefs: true });
      update();
      soonHash();
    });
    if (focused) (document.getElementById(focused) as HTMLElement | null)?.focus();
    renderWarnings(said, result);

    output.replaceChildren();
    if (result.cardError) {
      output.appendChild(el('p', 'Nothing built: the card box does not read.', 'builder-help'));
    } else if (result.final === undefined) {
      const error = result.error ?? result.builds[0]?.hidden;
      output.appendChild(
        el(
          'p',
          result.builds[0]?.hidden
            ? `The card hides itself, so Home Assistant is handed nothing: ${result.builds[0].hidden}`
            : `The card does not build - Home Assistant draws its error card: ${error ?? ''}`,
          'builder-help',
        ),
      );
    } else {
      output.appendChild(block('What Home Assistant is handed', toYaml(result.final), true, 'tt-final'));
    }
    const outline = renderOutline(result);
    if (outline) output.appendChild(outline);
    if (result.report)
      output.appendChild(
        block('Debug report (Markdown, as debug: report copies it)', result.report, false, 'tt-report'),
      );
    if (house) renderHouse(house, result);
  };

  let writing: number | undefined;
  let written = '';
  const writeHash = async (): Promise<string> => {
    const hash = await encodeState(shared());
    written = hash;
    try {
      history.replaceState(null, '', `#${hash}`);
    } catch {
      // A page opened from a file may refuse; Copy link still works.
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
    if (!manual) waiting = window.setTimeout(update, 300);
    soonHash();
  };
  [templates, card, entities].forEach((box) => box.addEventListener('input', soon));
  [onlyMine, readAll].forEach((box) =>
    box.addEventListener('change', () => {
      update();
      soonHash();
    }),
  );
  buildNow.addEventListener('click', () => update());

  copy.addEventListener('click', async () => {
    window.clearTimeout(writing);
    const hash = await writeHash();
    const url = `${location.href.split('#')[0]}#${hash}`;
    link.value = url;
    const long =
      url.length > LONG_LINK ? ` It is ${url.length.toLocaleString()} characters long - a gist may travel better.` : '';
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(url);
      link.hidden = true;
      linkNote.textContent = `Link copied.${long}`;
    } catch {
      link.hidden = false;
      link.focus();
      link.select();
      linkNote.textContent = `Copy the link below - it is selected.${long}`;
    }
  });

  const fromGist = async (typed: string): Promise<void> => {
    if (!gistId(typed)) {
      noteInto(gistNote, true, 'That is not a gist id or a gist address.');
      return;
    }
    gistLoad.disabled = true;
    noteInto(gistNote, false, 'Loading the gist...');
    const loaded = await loadGist(typed);
    gistLoad.disabled = false;
    if ('problem' in loaded) {
      noteInto(gistNote, true, loaded.problem);
      return;
    }
    fill({
      templates: loaded.boxes.templates ?? '',
      card: loaded.boxes.card ?? '',
      entities: loaded.boxes.entities ?? '',
    });
    noteInto(
      gistNote,
      false,
      `Loaded ${loaded.files.join(', ')}${loaded.owner ? ` from ${loaded.owner}'s gist` : ''}. Read what it holds before you trust it - it is someone's YAML, shown here, never run.`,
    );
    written = '';
    update();
  };
  gistLoad.addEventListener('click', () => {
    const id = gistId(gist.value);
    if (id) {
      try {
        history.replaceState(null, '', `#gist=${id}`);
      } catch {
        // as above
      }
    }
    void fromGist(gist.value);
  });
  gist.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') gistLoad.click();
  });

  for (const example of EXAMPLES) {
    const button = el('button', undefined, 'try-chip');
    button.type = 'button';
    button.appendChild(el('span', example.label, 'try-chip-label'));
    button.addEventListener('click', () => {
      fill({
        templates: example.templates,
        card: example.card,
        entities: example.entities ?? entities.value,
        onlyMine: onlyMine.checked,
        readAll: readAll.checked,
      });
      update();
      soonHash();
    });
    examples.appendChild(button);
  }

  const fromHash = async (opening = false): Promise<void> => {
    const hash = location.hash.replace(/^#/, '');
    if (written && hash === written) return;
    const asGist = /^gist=(.+)$/.exec(hash);
    if (asGist) {
      let id: string;
      try {
        id = decodeURIComponent(asGist[1]);
      } catch {
        // A cut or garbled link: say so, and open the page as it would without one.
        id = '';
      }
      gist.value = id;
      if (opening) fill({});
      if (id) await fromGist(id);
      else linkNote.textContent = 'That gist link did not read - it may have been cut short when it was copied.';
      // Built whatever the gist did, so a failed one still leaves a working page.
      update();
      return;
    }
    const decoded = await decodeHash(location.hash);
    if (!decoded && !opening) return;
    linkNote.textContent = '';
    if (decoded && 'problem' in decoded) {
      linkNote.textContent = decoded.problem;
      fill({});
    } else fill(decoded?.state ?? {});
    update();
  };
  window.addEventListener('hashchange', () => void fromHash());
  await fromHash(true);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void start());
else void start();
