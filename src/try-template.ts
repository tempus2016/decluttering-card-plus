import { loadAll } from 'js-yaml';
import deepReplace, { BuildExtras } from './deep-replace';
import { buildThing, contentFor, getThingType, manyConfig, templateAlerts, withGridOptions } from './build';
import { Alert, stoppingError, wantsAlerts, withAlerts } from './checks';
import {
  chainOf,
  chainWith,
  describeCycle,
  describeTooDeep,
  findCycle,
  MAX_NESTING,
  withChain,
  withInherited,
  withoutStamps,
} from './cycles';
import { localize } from './localize';
import { rebuildOnFor } from './rebuild-resolve';
import { isRegistrySource } from './registry';
import { canRepeat } from './repeat-kinds';
import { withSlotVariables } from './slots';
import { STRICT_OFF, strictLevels, StrictLevels, placeStrict } from './strict';
import {
  BY_DOMAIN_KEY,
  byDomainOf,
  collectTemplates,
  didYouMean,
  groupCard,
  itemTemplatesOf,
  MissingTemplateError,
  pickTemplate,
  withPickedEntity,
} from './templates';
import {
  formatPath,
  handedDownNames,
  newTrace,
  nestedCardPaths,
  TracePath,
  TraceReport,
  TraceSection,
  traceLabel,
  variableRows,
  workOutRows,
} from './trace';
import { LovelaceThingConfig, LovelaceThingType, TemplateConfig, VariablesConfig } from './types';
import {
  forEachItems,
  forEachVariables,
  hasRequiredVariables,
  inheritableVariables,
  ownVariables,
  withEveryStateReadable,
  withInheritedVariables,
  withStateScope,
} from './variables';
import { itemLabel, skippedConfig, templateVisibility } from './visibility';
import { withMobileVariables } from './breakpoints';
import { formatReport } from './report';
import { OutlineNode, reportOutline } from './report-outline';
import { OwnEntities, ownEntities } from './playground-house';
import { StandInField, standInFields } from './try-template-form';
import { VERSION } from './version';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * "Try a template" on the docs site (#427): templates and a card in, the YAML the card would
 * hand Home Assistant out, with what it warned about and its debug report. Every step of the
 * build is the card's own - the template lookup with its `extends:` and defaults, the checks,
 * the substitution, the card's override, grid_options, the variables handed down - called in
 * the order the card calls them (src/card.ts `_configure`/`_applyTemplate`, src/element.ts
 * `_setTemplateConfig`/`_setForEach`). What this file adds is the walk the dashboard does by
 * itself: a card of ours inside what was built is built here too, from the same templates.
 */

const MAX_ALIASES = 50;
// Past this many builds the page stops: a repeat of repeats should not take the tab with it.
const MAX_BUILDS = 400;

export const CARD_TYPE = 'custom:decluttering-card-plus';

/*
 * Every warning a build says comes to `onWarning` and into its trace; a quiet set that has
 * heard everything already keeps it out of the console, where the page has no use for it.
 */
class HeardEverything extends Set<string> {
  has(): boolean {
    return true;
  }
}

/** One of our cards, built: the outermost first, then each one inside it as the walk found it. */
export interface CardBuild {
  /** Where it sits in the outermost card, as the report writes it. */
  path: TracePath;
  where: string;
  /** Its template, or `template_by_domain` while it chooses. */
  template?: string;
  kind?: LovelaceThingType;
  /** What it built, nested cards still as cards of ours. */
  built?: unknown;
  /** What it said instead of building: the error card's message. */
  error?: string;
  warnings: string[];
  /** Placeholders left without a value. */
  unresolved: string[];
  alerts: Alert[];
  /** What `strict:` asked for, level by level. */
  strict: StrictLevels;
  /** `strict: {warnings: notice}`: the notice the card would show above itself. */
  notice?: string[];
  /** Why the card hides itself, when its template's `visibility:` rules it out. */
  hidden?: string;
  /** How many copies a repeat made, and how many its template's `visibility:` left out. */
  copies?: number;
  skipped?: number;
}

export interface TemplateBox {
  /** The templates box as the dashboard it stands for: decluttering_templates and the rest. */
  dashboard: Record<string, any>;
  names: string[];
  error?: string;
}

/**
 * The templates box read as a dashboard: a whole one pasted in, its
 * `decluttering_templates:` alone, or the templates themselves with no key around them.
 */
export function readTemplates(text: string): TemplateBox {
  if (!text.trim()) return { dashboard: { decluttering_templates: {} }, names: [] };
  let doc: any;
  try {
    doc = loadAll(text, { maxAliases: MAX_ALIASES }).filter((each) => each != null)[0] ?? {};
  } catch (err) {
    return { dashboard: { decluttering_templates: {} }, names: [], error: (err as Error).message };
  }
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { dashboard: { decluttering_templates: {} }, names: [], error: 'should be a mapping of templates' };
  }
  const keyed = Object.keys(doc).some((key) => /^decluttering_/.test(key));
  // A whole dashboard keeps its views: a template card in one defines a template too.
  const dashboard: Record<string, any> = keyed ? { ...doc } : { decluttering_templates: doc };
  const templates = dashboard.decluttering_templates;
  if (!templates || typeof templates !== 'object' || Array.isArray(templates)) dashboard.decluttering_templates = {};
  return { dashboard, names: Object.keys(dashboard.decluttering_templates) };
}

/** The card box read: one card, or a `card:` around it. Throws, in words, when it is not one. */
export function readCard(text: string): Record<string, any> {
  const doc: any = loadAll(text, { maxAliases: MAX_ALIASES }).filter((each) => each != null)[0];
  if (doc === undefined) throw new Error('is empty: write a card with type: custom:decluttering-card-plus');
  const card = doc && typeof doc === 'object' && !Array.isArray(doc) && doc.card && !doc.type ? doc.card : doc;
  if (!card || typeof card !== 'object' || Array.isArray(card))
    throw new Error('should be a card: a mapping with type:');
  return card;
}

export interface TemplateRun {
  /** What Home Assistant would be handed, every card of ours inside it built too. */
  final?: unknown;
  builds: CardBuild[];
  /** The debug report's builds, for formatReport. */
  reports: TraceReport[];
  /** Where a card of ours sits that was left as it is: past the limit, or of a type this page does not build. */
  neverBuilt: string[];
  /** The outermost card's error, when it did not build at all. */
  error?: string;
  /** The template the outermost card uses, as the card resolves it (for the stand-in form). */
  template?: TemplateConfig;
  templateName?: string;
}

interface Walk {
  ll: any;
  house: any;
  readAll: boolean;
  builds: CardBuild[];
  reports: TraceReport[];
  neverBuilt: string[];
  count: number;
  outer?: { template?: TemplateConfig; name?: string };
}

/** The states a build may read: the card's rebuild_on, as on a dashboard, or every one when asked. */
function buildHassFor(walk: Walk, rebuildOn: string[], written: string): any {
  if (!walk.readAll) return withStateScope(walk.house, rebuildOn);
  const standing = Object.keys(walk.house?.states ?? {}).filter((id) => written.includes(id));
  return withEveryStateReadable(walk.house, [...new Set([...standing, ...rebuildOn])]);
}

function getAt(config: any, path: TracePath): any {
  let node = config;
  for (const step of path) node = node?.[step];
  return node;
}

function setAt(config: any, path: TracePath, value: unknown): any {
  if (!path.length) return value;
  const parent = getAt(config, path.slice(0, -1));
  if (parent && typeof parent === 'object') parent[path[path.length - 1]] = value;
  return config;
}

// What a card of ours inside another hands down, filled in the outer card (src/element.ts `_handDown`).
function handDown(
  variables: VariablesConfig[] | undefined,
  template: TemplateConfig,
  name: string | undefined,
  hass: any,
  chain: string[],
): unknown[] {
  const list = deepReplace(
    variables,
    template,
    inheritableVariables(variables, template),
    name,
    hass,
    true,
    undefined,
    0,
    undefined,
    undefined,
    true,
    { templateChain: chain },
  );
  return (Array.isArray(list) ? list : []).filter(
    (entry: unknown) => !!entry && typeof entry === 'object' && Object.keys(entry as object).length > 0,
  );
}

// The card's name filled in, for the report's label (src/element.ts `_traceName`).
function traceName(
  variables: any,
  template: TemplateConfig,
  name: string | undefined,
  instance: any,
  hass: any,
): string | undefined {
  const written = instance?.name ?? template.name;
  if (typeof written !== 'string') return undefined;
  const filled = deepReplace(variables, template, written, name, hass, true);
  return typeof filled === 'string' ? filled : undefined;
}

function section(
  variables: VariablesConfig[] | undefined,
  template: TemplateConfig,
  name: string | undefined,
  hass: any,
  rawHass: any,
  extras: BuildExtras,
  trace: ReturnType<typeof newTrace>,
  built: unknown,
  handedDown: string[],
  repeated: string[] = [],
  label?: string,
): TraceSection {
  return {
    ...(label ? { label } : {}),
    variables: workOutRows(
      variableRows(variables, template, handedDown, repeated),
      (content, worked) =>
        deepReplace(variables, template, content, name, hass, true, undefined, 0, worked, undefined, false, extras),
      rawHass,
    ),
    trace,
    built: withoutStamps(built),
    evaluate: (content, onMissing, values) =>
      deepReplace(
        (values as VariablesConfig[]) ?? variables,
        values ? ({} as TemplateConfig) : template,
        content,
        values ? undefined : name,
        hass,
        true,
        onMissing,
        0,
        undefined,
        undefined,
        false,
        extras,
      ),
  };
}

/*
 * One card of ours, as src/card.ts builds it: the card's config read the way `_configure`
 * reads it, its template found, then built once or once per copy. Returns what it built with
 * the cards of ours inside it still to be built, or undefined when it built nothing.
 */
function buildOne(given: any, path: TracePath, parents: string[], walk: Walk): unknown {
  walk.count += 1;
  const record: CardBuild = {
    path,
    where: formatPath(path),
    warnings: [],
    unresolved: [],
    alerts: [],
    strict: STRICT_OFF,
  };
  walk.builds.push(record);
  const fail = (message: string): undefined => {
    record.error = message;
    return undefined;
  };
  const hass = walk.house;
  const open = chainOf(given);
  const handedDown = handedDownNames(given);
  let config = withInheritedVariables(given);
  config = withSlotVariables(config);
  // The page is as wide as a desktop: `variables_mobile:` is not laid over.
  config = withMobileVariables(config, false);
  record.template = config.template ?? (byDomainOf(config) ? BY_DOMAIN_KEY : undefined);
  if (!config.template && !byDomainOf(config)) return fail(localize('error.missing_template'));
  const cycle = findCycle(open, config.template);
  if (cycle || open.length >= MAX_NESTING) return fail(cycle ? describeCycle(cycle) : describeTooDeep(open));

  const ll = walk.ll;
  const templates = collectTemplates(ll);
  const available = Object.keys(templates);
  const lookup = (name: string | undefined): TemplateConfig | undefined =>
    name !== undefined && Object.prototype.hasOwnProperty.call(templates, name) ? templates[name] : undefined;
  const items = forEachItems(config.for_each);
  if (items === undefined && isRegistrySource(config.for_each_from)) {
    return fail(
      'for_each_from: reads the registry of a real Home Assistant, which this page does not build. Write the copies out with for_each: to try them here.',
    );
  }
  const byDomain = byDomainOf(config);
  let templateConfig: TemplateConfig | undefined;
  let name: string | undefined = config.template;
  let picker:
    | ((variables: VariablesConfig[] | undefined) => { name: string; template: TemplateConfig; entity?: string })
    | undefined;
  try {
    if (byDomain) {
      picker = (variables) => pickTemplate(config, variables, (each) => lookup(each), hass, available);
      if (!items) {
        const picked = picker(config.variables);
        name = picked.name;
        templateConfig = picked.template;
        config = {
          ...config,
          template: name,
          variables: withPickedEntity(config.variables, picked.entity),
        };
        picker = undefined;
      } else {
        const fallback = Object.prototype.hasOwnProperty.call(byDomain, 'default') ? byDomain.default : config.template;
        const named = [config.template, ...Object.values(byDomain)].filter(Boolean) as string[];
        templateConfig = lookup(fallback) ?? lookup(named.find((each) => lookup(each))) ?? ({} as TemplateConfig);
      }
    } else {
      templateConfig = lookup(config.template);
      if (!templateConfig) {
        return fail(
          localize('error.template_missing', { template: config.template }) + didYouMean(config.template, available),
        );
      }
    }
  } catch (err) {
    if (err instanceof MissingTemplateError) return fail(err.message);
    return fail((err as Error).message);
  }
  record.template = name ?? record.template;
  if (!walk.outer) walk.outer = { template: templateConfig, name };

  // The dashboard's item templates and its views, as src/element.ts `_buildExtras` hands them.
  const extras: BuildExtras = {
    itemTemplates: itemTemplatesOf(ll),
    context: { views: ll?.views } as BuildExtras['context'],
    templateChain: open,
  };
  const rebuildOn = rebuildOnFor(config, templateConfig, hass, extras).entities;
  const buildHass = buildHassFor(walk, rebuildOn, JSON.stringify(config));
  record.strict = strictLevels([config.strict, (templateConfig as { strict?: unknown }).strict, ...placeStrict(ll)]);
  const gridOptions = config.grid_options ?? (templateConfig as { grid_options?: unknown }).grid_options;
  const chainBelow = (template: string | undefined): string[] => chainWith(open, template);
  const label = (template: TemplateConfig, own: string | undefined, variables: any): string =>
    traceLabel(own ?? '', traceName(variables, template, own, config, buildHass));
  const said: string[] = [];
  const buildExtras: BuildExtras = {
    ...extras,
    onWarning: (m: string) => said.push(m.replace(/^decluttering-card-plus:\s*/, '')),
  };
  const started = Date.now();

  /* ------------------------------------------------- once */
  if (!items) {
    const thingType = getThingType(templateConfig);
    if (!thingType) {
      const defined = ['card', 'row', 'element', 'badge', 'group'].filter(
        (key) => (templateConfig as any)[key] !== undefined,
      );
      return fail(
        defined.length
          ? localize('error.defines_both', { first: defined[0], second: defined[1] })
          : localize('error.defines_nothing'),
      );
    }
    record.kind = thingType;
    const seen = templateVisibility(templateConfig, config.variables, buildHass);
    if (!seen.visible) {
      record.hidden = 'reason' in seen ? seen.reason : '';
      return undefined;
    }
    const alerts = templateAlerts(config.variables, templateConfig, name, buildHass, hass, extras);
    record.alerts = alerts;
    const stopped = stoppingError(alerts, hass);
    if (stopped) return fail(stopped);
    let variables = config.variables as VariablesConfig[] | undefined;
    if (wantsAlerts(templateConfig)) variables = withAlerts(variables, alerts);
    const trace = newTrace();
    const unresolved: string[] = [];
    const built = buildThing({
      variables,
      templateConfig,
      content: contentFor(templateConfig, alerts),
      templateName: name,
      hass: buildHass,
      quiet: new HeardEverything(),
      onUnresolved: (names) => unresolved.push(...names),
      trace,
      extras: buildExtras,
      instance: config,
      kind: thingType,
    });
    record.unresolved = [...new Set(unresolved)];
    walk.reports.push({
      label: label(templateConfig, name, variables),
      chain: parents,
      ...(path.length ? { at: formatPath(path), path } : {}),
      ms: Date.now() - started,
      sections: [section(variables, templateConfig, name, buildHass, hass, extras, trace, built, handedDown)],
      template: { name: name ?? '', config: withoutStamps(templateConfig) },
      ...(alerts.length
        ? { alerts: alerts.map((a) => ({ level: a.level, message: a.message, ...(a.name ? { name: a.name } : {}) })) }
        : {}),
    });
    record.warnings = [...new Set(said)];
    const heard = record.strict.warnings === 'ignore' ? [] : [...said];
    return finish(record, heard, alerts, true, () =>
      withInherited(withChain(withGridOptions(thingType, built, gridOptions), chainBelow(name)), () =>
        handDown(variables, templateConfig as TemplateConfig, name, buildHass, open),
      ),
    );
  }

  /* ------------------------------------------------- once per copy */
  const chosen = items.map((item) => ({
    item,
    ...(picker
      ? picker(forEachVariables(item, config.variables))
      : { name: config.template as string, template: templateConfig as TemplateConfig }),
  }));
  const kind = getThingType(templateConfig);
  const repeatKind: 'card' | 'row' | 'element' = canRepeat(kind) ? kind : 'card';
  for (const copy of picker ? chosen : [{ name: config.template, template: templateConfig }]) {
    const copyKind = getThingType(copy.template);
    if (canRepeat(copyKind) && (!picker || copyKind === repeatKind)) continue;
    const what = copyKind ?? localize('error.a_different_kind');
    return fail(
      picker
        ? localize('error.by_domain_not_card', { template: copy.name, kind: what })
        : localize('error.for_each_not_card', { template: config.template, kind: what }),
    );
  }
  record.kind = repeatKind;
  const wanted = chosen.filter((copy) => hasRequiredVariables(copy.template, copy.item, config.variables));
  const entries = wanted.map((copy, index) => {
    const seen = templateVisibility(
      copy.template,
      forEachVariables(copy.item, config.variables, index, wanted.length),
      buildHass,
    );
    return seen.visible
      ? { copy }
      : { skipped: skippedConfig(itemLabel(copy.item, index), 'reason' in seen ? seen.reason : '') };
  });
  const shown = entries.map((entry) => entry.copy).filter((copy) => copy !== undefined) as typeof chosen;
  record.skipped = entries.length - shown.length;
  record.copies = shown.length;
  if (!shown.length && config.empty) {
    return finish(record, [], [], false, () =>
      withInherited(
        withChain(withGridOptions(repeatKind, config.empty as LovelaceThingConfig, gridOptions), chainBelow(name)),
        () => handDown(config.variables, templateConfig as TemplateConfig, name, buildHass, open),
      ),
    );
  }
  const copies = shown.map(({ item, name: copyName, template, entity }, index) => {
    const variables = withPickedEntity(
      forEachVariables(item, config.variables, index, shown.length),
      entity,
    ) as VariablesConfig[];
    const alerts = templateAlerts(variables, template, copyName, buildHass, hass, extras);
    return {
      variables: wantsAlerts(template) ? withAlerts(variables, alerts) : variables,
      content: contentFor(template, alerts),
      alerts,
    };
  });
  record.alerts = ([] as Alert[]).concat(...copies.map((copy) => copy.alerts));
  const stopped = stoppingError(record.alerts, hass);
  if (stopped) return fail(stopped);
  const sections: TraceSection[] = [];
  const names = (list: unknown): string[] => ownVariables(list).map((entry) => Object.keys(entry)[0]);
  const cards = shown.map(({ item, name: copyName, template }, index) => {
    const { variables, content } = copies[index];
    const trace = newTrace();
    const repeated = [
      ...names(item),
      ...['index', 'index0', 'count', 'first', 'last'].filter((each) => !names(config.variables).includes(each)),
    ];
    const unresolved: string[] = [];
    const built = buildThing({
      variables,
      templateConfig: template,
      content,
      templateName: copyName,
      hass: buildHass,
      quiet: new HeardEverything(),
      onUnresolved: (missing) => unresolved.push(...missing),
      trace,
      extras: buildExtras,
      instance: config,
      kind: repeatKind,
    });
    record.unresolved.push(...unresolved.filter((each) => !record.unresolved.includes(each)));
    const own = traceName(variables, template, copyName, config, buildHass);
    const copyLabel = localize('trace.copy', { number: index + 1, count: shown.length });
    sections.push(
      section(
        variables,
        template,
        copyName,
        buildHass,
        hass,
        extras,
        trace,
        built,
        handedDown,
        repeated,
        own ? `${copyLabel}: "${own}"` : copyLabel,
      ),
    );
    const chained = picker ? withChain(built, chainWith(open, copyName)) : built;
    return withInherited(chained, () => handDown(variables, template, copyName, buildHass, open));
  });
  walk.reports.push({
    label: traceLabel(
      config.template ?? BY_DOMAIN_KEY,
      config.name === undefined
        ? undefined
        : traceName(config.variables, templateConfig, config.template, config, buildHass),
    ),
    chain: parents,
    ...(path.length ? { at: formatPath(path), path } : {}),
    ms: Date.now() - started,
    sections,
    template: { name: name ?? '', config: withoutStamps(templateConfig) },
    ...(record.alerts.length
      ? {
          alerts: record.alerts.map((a) => ({
            level: a.level,
            message: a.message,
            ...(a.name ? { name: a.name } : {}),
          })),
        }
      : {}),
  });
  record.unresolved = [...new Set(record.unresolved)];
  // A copy's own warnings are not the notice's (src/element.ts `_setForEach` hears only its
  // checks), and a repeat is not refused for a variable left unset - only for a failed check.
  record.warnings = [...new Set(said)];
  return finish(record, [], record.alerts, false, () => {
    if (repeatKind !== 'card') return withChain(manyConfig(repeatKind, cards), chainBelow(picker ? undefined : name));
    // In edit mode the slots stand where the skipped copies would have been; on the page, as on a dashboard, they are left out.
    const columns = Number(config.columns) || 1;
    const group = picker
      ? shown.length > 0 && shown.every((copy) => copy.template.group !== undefined)
      : templateConfig?.group !== undefined;
    const stack =
      columns > 1
        ? { type: 'grid', columns, square: false, cards }
        : group
          ? groupCard(cards)
          : { type: 'vertical-stack', cards };
    return picker ? stack : withChain(stack, chainBelow(name));
  });
}

/*
 * What `strict:` does once the card has built (src/element.ts `_strictOutcome`,
 * `_refuseIfStrict`, `_refuseForCheck`): a notice, or the card refused with the error card.
 */
function finish(
  record: CardBuild,
  heard: string[],
  alerts: Alert[],
  refuseUnset: boolean,
  made: () => unknown,
): unknown {
  const strict = record.strict;
  const warnings = [...heard];
  if (strict.warnings !== 'ignore')
    for (const alert of alerts) if (alert.level === 'warn') warnings.push(alert.message);
  if (strict.warnings === 'notice' && warnings.length) record.notice = [...new Set(warnings)];
  if (refuseUnset && strict.errors === 'fail' && record.unresolved.length) {
    const which = record.unresolved.map((each) => `[[${each}]]`).join(', ');
    record.error = localize(record.unresolved.length === 1 ? 'error.strict_one' : 'error.strict_many', { which });
    return undefined;
  }
  const failed = alerts.find((alert) => alert.level === 'error');
  if (strict.errors === 'fail' && failed) {
    record.error = localize('error.check_stopped', { message: failed.message });
    return undefined;
  }
  const built = made();
  record.built = withoutStamps(built);
  return built;
}

/*
 * The cards of ours inside what a card built, built in their places - what the dashboard does
 * when Home Assistant creates them. One that builds nothing - hidden by its template's
 * `visibility:`, refused, past the limit - stays as the card it was, and is listed as never
 * built, as the card's own report lists it.
 */
function expand(built: unknown, path: TracePath, chain: string[], walk: Walk): unknown {
  let out = JSON.parse(JSON.stringify(built));
  for (const at of nestedCardPaths(out)) {
    const node = getAt(out, at);
    const full = [...path, ...at];
    if (walk.count >= MAX_BUILDS || node?.type !== CARD_TYPE) {
      walk.neverBuilt.push(formatPath(full));
      continue;
    }
    const reported = walk.reports.length;
    const inner = buildOne(node, full, chain, walk);
    if (inner === undefined) {
      walk.neverBuilt.push(formatPath(full));
      continue;
    }
    const label = walk.reports.length > reported ? walk.reports[reported].label : '';
    out = setAt(out, at, expand(inner, full, [...chain, label], walk));
  }
  return out;
}

/** Build a card from the templates box, against a house, every card of ours inside it as well. */
export function runTemplate(
  dashboard: Record<string, any>,
  card: Record<string, any>,
  house: any,
  readAll = false,
): TemplateRun {
  const walk: Walk = { ll: dashboard, house, readAll, builds: [], reports: [], neverBuilt: [], count: 0 };
  if (card.type !== CARD_TYPE) {
    return {
      builds: [],
      reports: [],
      neverBuilt: [],
      error: `The card box should hold a card with type: ${CARD_TYPE}, not ${card.type === undefined ? 'one with no type' : `type: ${card.type}`}.`,
    };
  }
  const built = buildOne(card, [], [], walk);
  const outer = walk.builds[0];
  const label = walk.reports[0]?.label ?? '';
  const final = built === undefined ? undefined : withoutStamps(expand(built, [], [label], walk));
  return {
    final,
    builds: walk.builds,
    reports: walk.reports,
    neverBuilt: walk.neverBuilt,
    ...(outer?.error ? { error: outer.error } : {}),
    template: walk.outer?.template,
    templateName: walk.outer?.name,
  };
}

/* ------------------------------------------------------------------ the page */

export interface TryTemplateState {
  templates: string;
  card: string;
  entities: string;
  onlyMine: boolean;
  /** Every state readable, as if the card listed each one in rebuild_on. */
  readAll: boolean;
}

export interface TryTemplateResult extends TemplateRun {
  templatesBox: TemplateBox;
  entities: OwnEntities;
  /** The card box did not read. */
  cardError?: string;
  card?: Record<string, any>;
  /** The debug report as the card writes it. */
  report?: string;
  outline: OutlineNode[];
  /** The stand-in form for the outermost card's template. */
  fields: StandInField[];
}

/** Everything on the page at once: the house, the templates, the card built in it, the report and the form. */
export function tryTemplate(state: TryTemplateState): TryTemplateResult {
  const entities = ownEntities(state.entities, state.onlyMine);
  const templatesBox = readTemplates(state.templates);
  const empty = { builds: [], reports: [], neverBuilt: [], outline: [], fields: [] };
  let card: Record<string, any>;
  try {
    card = readCard(state.card);
  } catch (err) {
    return { ...empty, templatesBox, entities, cardError: (err as Error).message.split('\n')[0] };
  }
  const run = runTemplate(templatesBox.dashboard, card, entities.house, state.readAll);
  const nested = run.builds.length > 1 || run.neverBuilt.length > 0;
  const report = formatReport({
    context: { version: VERSION, haVersion: 'none - the docs site', dashboard: 'Try a template', language: 'en' },
    reports: run.reports,
    ...(nested ? { full: run.final } : { built: run.final }),
    neverBuilt: run.neverBuilt,
    ...(run.error ? { error: run.error } : {}),
  });
  const extras: BuildExtras = {
    itemTemplates: itemTemplatesOf(templatesBox.dashboard as any),
    context: { views: templatesBox.dashboard.views } as BuildExtras['context'],
  };
  const formHass = run.template
    ? buildHassFor(
        { ll: templatesBox.dashboard, house: entities.house, readAll: state.readAll } as Walk,
        rebuildOnFor(card as any, run.template, entities.house, extras).entities,
        JSON.stringify(card),
      )
    : entities.house;
  const fields = standInFields(
    run.template,
    withSlotVariables(card as { variables?: unknown }).variables as VariablesConfig[] | undefined,
    run.templateName,
    formHass,
    extras,
  );
  return { ...run, templatesBox, entities, card, report, outline: reportOutline(run.reports), fields };
}
