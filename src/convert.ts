/*
 * Converting from other cards (idea 59): a button-card template becomes a decluttering
 * template, an auto-entities card becomes a repeating decluttering card. Pure functions; the
 * Share tab only calls them and hands the result to the import that already exists.
 *
 * Neither conversion pretends to more than it is. A `[[[ ]]]` block that does anything but
 * return a variable is carried as it was, for button-card to run; an auto-entities filter on
 * live state is dropped and named, because this card builds once and follows the registry.
 */
import { TemplateConfig } from './types';
import { VariableDeclaration } from './variables';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Conversion {
  /** What came out, the first entry being the one to import; the rest ride along as includes. */
  templates: Record<string, TemplateConfig>;
  /** For auto-entities: the card that uses the template, to put on the dashboard. */
  card?: Record<string, unknown>;
  /** Which converter made it. */
  from: 'button-card' | 'auto-entities';
  /** Things worth a look, as sentences. */
  notes: string[];
  /** Filters or settings that had no equivalent and were left out, as sentences. */
  dropped: string[];
  /** Custom cards the result needs. */
  needs: string[];
}

const isMapping = (value: unknown): value is Record<string, any> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

// A JavaScript template that only hands a variable back: `[[[ return variables.name ]]]`,
// with or without the semicolon, quotes around the name, or `variables['name']`.
const RETURNS_VARIABLE =
  /^\s*\[\[\[\s*return\s+variables(?:\.([A-Za-z_$][\w$]*)|\[\s*['"]([^'"]+)['"]\s*\])\s*;?\s*\]\]\]\s*$/;
const ANY_JS = /\[\[\[[\s\S]*?\]\]\]/;

function convertValue(value: unknown, read: Set<string>, kept: string[], path: string): unknown {
  if (typeof value === 'string') {
    const match = RETURNS_VARIABLE.exec(value);
    if (match) {
      const name = match[1] ?? match[2];
      read.add(name);
      return `[[${name}]]`;
    }
    if (ANY_JS.test(value)) kept.push(path);
    return value;
  }
  if (Array.isArray(value)) return value.map((item, index) => convertValue(item, read, kept, `${path}[${index}]`));
  if (isMapping(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, each] of Object.entries(value))
      out[key] = convertValue(each, read, kept, path ? `${path}.${key}` : key);
    return out;
  }
  return value;
}

/** One button-card template body as a decluttering template. */
function convertButtonCardTemplate(
  name: string,
  body: Record<string, any>,
  allNames: string[],
  notes: string[],
): TemplateConfig {
  const { variables, template, ...rest } = body;
  const read = new Set<string>();
  const kept: string[] = [];
  const card = convertValue({ type: 'custom:button-card', ...rest }, read, kept, '') as Record<string, unknown>;

  const declarations: VariableDeclaration[] = [];
  if (isMapping(variables)) {
    for (const [each, value] of Object.entries(variables)) {
      declarations.push(value === undefined || value === null ? { name: each } : { name: each, default: value });
    }
  }
  for (const each of read) {
    if (!declarations.some((declaration) => declaration.name === each)) declarations.push({ name: each });
  }

  const out: TemplateConfig = {};
  const parents = (Array.isArray(template) ? template : template !== undefined ? [template] : []).filter(
    (parent): parent is string => typeof parent === 'string',
  );
  if (parents.length) {
    // A parent that is also being converted keeps its name; one that is not cannot be followed.
    const known = parents.filter((parent) => allNames.includes(parent));
    const unknown = parents.filter((parent) => !allNames.includes(parent));
    if (known.length) out.extends = known.length === 1 ? known[0] : known;
    if (unknown.length) notes.push(localize('convert.parent_unknown', { name, parents: unknown.join(', ') }));
  }
  if (declarations.length) out.variables = declarations;
  out.card = card;
  if (kept.length) notes.push(localize('convert.js_kept', { name, count: kept.length, paths: kept.join(', ') }));
  return out;
}

/**
 * A `button_card_templates:` mapping, a mapping of template names to bodies, or one body
 * on its own (then named `converted`). Undefined when it is none of those.
 */
export function convertButtonCardTemplates(parsed: unknown): Conversion | undefined {
  if (!isMapping(parsed)) return undefined;
  let entries: Record<string, any> | undefined;
  if (isMapping(parsed.button_card_templates)) entries = parsed.button_card_templates;
  else if (looksLikeButtonCardBody(parsed)) entries = { converted: parsed };
  else if (
    Object.values(parsed).length &&
    Object.values(parsed).every((value) => isMapping(value) && looksLikeButtonCardBody(value))
  ) {
    entries = parsed;
  }
  if (!entries || !Object.keys(entries).length) return undefined;

  const notes: string[] = [];
  const names = Object.keys(entries);
  const templates: Record<string, TemplateConfig> = {};
  for (const name of names) templates[name] = convertButtonCardTemplate(name, entries[name], names, notes);
  return { templates, from: 'button-card', notes, dropped: [], needs: ['custom:button-card'] };
}

// Keys only a button-card template body would have at its top.
const BUTTON_CARD_KEYS = [
  'variables',
  'styles',
  'show_name',
  'show_icon',
  'show_state',
  'tap_action',
  'icon',
  'entity',
  'name',
  'template',
  'state',
  'custom_fields',
  'label',
  'color',
  'color_type',
  'size',
  'aspect_ratio',
];

function looksLikeButtonCardBody(value: Record<string, any>): boolean {
  if (value.type !== undefined && value.type !== 'custom:button-card') return false;
  if (value.card !== undefined || value.row !== undefined || value.badge !== undefined) return false;
  return Object.keys(value).some((key) => BUTTON_CARD_KEYS.includes(key));
}

/* ---------------------------------------------------------------- auto-entities */

// auto-entities include keys the registry repeat answers, and what the repeat calls them.
const FILTER_TO_REPEAT: Record<string, string> = {
  domain: 'domain',
  area: 'area',
  floor: 'floor',
  label: 'label',
  integration: 'integration',
  device_class: 'device_class',
  entity_category: 'entity_category',
  hidden: 'include_hidden',
};

// Filters that read something only live state knows.
const STATE_FILTERS = ['state', 'attributes', 'last_changed', 'last_updated', 'last_triggered', 'not', 'or', 'and'];

// The names the conversion writes; a dashboard with them already gets a free spelling from the import.
export const CONVERTED_ROWS = 'converted_rows';
export const CONVERTED_CARD = 'converted_card';

/**
 * A `custom:auto-entities` card. An entities card becomes a template holding an entities
 * card whose rows are one `[[row|repeat:source]]`, spliced in per entity the registry finds,
 * and a decluttering card using it; any other card becomes a card template repeated with
 * `for_each_from`. One include rule converts; more than one is noted and only the first is
 * used, because a repeat has one source. Undefined when the card is not auto-entities.
 */
export function convertAutoEntities(parsed: unknown): Conversion | undefined {
  if (!isMapping(parsed) || parsed.type !== 'custom:auto-entities') return undefined;
  const notes: string[] = [];
  const dropped: string[] = [];
  const filter = isMapping(parsed.filter) ? parsed.filter : {};
  const includes: any[] = Array.isArray(filter.include) ? filter.include.filter(isMapping) : [];
  const excludes: any[] = Array.isArray(filter.exclude) ? filter.exclude.filter(isMapping) : [];

  const source: Record<string, unknown> = {};
  if (includes.length > 1) notes.push(localize('convert.many_includes', { count: includes.length }));
  const rule = includes[0] ?? {};
  for (const [key, value] of Object.entries(rule)) {
    if (key === 'entity_id') {
      // A glob over entity ids - `light.kitchen_*` - is the pattern the repeat matches entities by.
      source.entities = value;
    } else if (key in FILTER_TO_REPEAT) {
      source[FILTER_TO_REPEAT[key]] = value;
    } else if (key === 'options') {
      // Per-entity row options go into the row body below.
    } else if (STATE_FILTERS.includes(key)) {
      dropped.push(localize('convert.state_filter_dropped', { key, value: JSON.stringify(value) }));
    } else {
      dropped.push(localize('convert.filter_unknown', { key }));
    }
  }
  if (source.entities === undefined) source.entities = true;
  const excluded = excludes
    .map((each) => (typeof each.entity_id === 'string' ? each.entity_id : undefined))
    .filter((each): each is string => each !== undefined);
  for (const each of excludes) {
    if (typeof each.entity_id !== 'string')
      dropped.push(localize('convert.exclude_dropped', { rule: JSON.stringify(each) }));
  }
  if (excluded.length) source.exclude = excluded;

  const sort = isMapping(parsed.sort) ? parsed.sort : undefined;
  if (sort) {
    if (sort.method === 'name' || sort.method === 'friendly_name') source.sort = 'name';
    else if (sort.method === 'entity_id') source.sort = 'entity_id';
    else if (sort.method !== undefined) dropped.push(localize('convert.sort_dropped', { method: String(sort.method) }));
    if (sort.reverse === true) source.reverse = true;
    if (typeof sort.count === 'number') source.limit = sort.count;
  }
  if (parsed.show_empty === false) notes.push(localize('convert.show_empty'));

  const rowOptions = isMapping(rule.options) ? rule.options : {};
  const inner = isMapping(parsed.card) ? parsed.card : { type: 'entities' };

  if (inner.type === 'entities' || inner.type === undefined) {
    // The source is a declared variable so a card can narrow it; the row body is the template's own.
    const { entities: _entities, ...cardRest } = inner;
    void _entities;
    const template: TemplateConfig = {
      variables: [{ name: 'source', default: source }],
      let: { row: { entity: '[[entity]]', ...rowOptions } },
      card: { type: 'entities', ...cardRest, entities: ['[[row|repeat:source]]'] },
    };
    const card: Record<string, unknown> = { type: 'custom:decluttering-card-plus', template: CONVERTED_ROWS };
    notes.push(localize('convert.rows_repeat'));
    return { templates: { [CONVERTED_ROWS]: template }, card, from: 'auto-entities', notes, dropped, needs: [] };
  }

  const template: TemplateConfig = {
    variables: [{ name: 'entity', type: 'entity' }],
    card: { ...inner, entity: '[[entity]]', ...rowOptions },
  };
  const card: Record<string, unknown> = {
    type: 'custom:decluttering-card-plus',
    template: CONVERTED_CARD,
    for_each_from: source,
  };
  notes.push(localize('convert.card_per_entity'));
  return {
    templates: { [CONVERTED_CARD]: template },
    card,
    from: 'auto-entities',
    notes,
    dropped,
    needs: customTypesIn(inner),
  };
}

function customTypesIn(node: unknown, found = new Set<string>()): string[] {
  if (Array.isArray(node)) node.forEach((item) => customTypesIn(item, found));
  else if (isMapping(node)) {
    if (typeof node.type === 'string' && node.type.startsWith('custom:')) found.add(node.type);
    Object.values(node).forEach((value) => customTypesIn(value, found));
  }
  return [...found].sort();
}

/** Whichever converter recognises the paste. */
export function convert(parsed: unknown): Conversion | undefined {
  return convertAutoEntities(parsed) ?? convertButtonCardTemplates(parsed);
}

/**
 * The conversion in the shape the Share tab's import reads: the first template as the body,
 * the rest under `includes:`. The template keeps the name it was converted under.
 */
export function asImport(conversion: Conversion): Record<string, unknown> {
  const [first, ...rest] = Object.keys(conversion.templates);
  const out: Record<string, unknown> = { template: first, ...conversion.templates[first] };
  if (rest.length) {
    const includes: Record<string, TemplateConfig> = {};
    for (const name of rest) includes[name] = conversion.templates[name];
    out.includes = includes;
  }
  return out;
}
