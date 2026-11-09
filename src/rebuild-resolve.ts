/* eslint-disable @typescript-eslint/no-explicit-any */
import deepReplace, { BuildExtras } from './deep-replace';
import { isRebuildObject, mergeWatch, parseWatch, rebuildEntryEntity, rebuildOnEntities, WatchSpec } from './rebuild';
import { DeclutteringCardConfig, TemplateConfig } from './types';
import { PLACEHOLDER } from './variables';

/*
 * #411: `rebuild_on:` written with placeholders, and written on the template as well as the
 * card. A template that reads `[[camera|attr:camera_name]]` knows which entity it needs and
 * can say so once - `rebuild_on: '[[camera]]'` - rather than every card using it repeating
 * the entity id by hand.
 *
 * The placeholders are filled from the card's variables, its template's defaults and the
 * dashboard's, the same as anything else the card builds - but never from a state. What a
 * card may read is decided here, so letting a state decide it would let a card widen its own
 * scope from what it reads. hass is passed as it is, without a state scope, so `|state` and
 * `|attr:` in a rebuild_on entry find nothing and the entry is dropped.
 *
 * Built once per build, like the card. A card repeated with for_each fills them with the
 * card's own variables, not each copy's, so a per-copy entity still has to be listed by id.
 */

/** A rebuild_on value as a list of what it names, one entry or many. */
function entries(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

/** Whether a rebuild_on entry is a placeholder to fill rather than an entity id. */
export function isRebuildPlaceholder(value: unknown): value is string {
  return typeof value === 'string' && PLACEHOLDER.test(value);
}

export interface RebuildOn {
  /** The entities the card rebuilds on, and the only ones a build may read the state of. */
  entities: string[];
  /** What it named that is not an entity id once filled in, for saying so. */
  rejects: string[];
  /** What each entity watches, in the same order (#411): undefined is the default, all of it. */
  watch: WatchSpec[];
}

type RebuildConfig = Pick<DeclutteringCardConfig, 'rebuild_on' | 'rebuild_on_watch' | 'variables' | 'template'>;

/** One thing an entry names once filled in, with what it watches. */
interface Named {
  value: unknown;
  watch: WatchSpec;
  /** The entry as written, for saying what was wrong with it. */
  written: unknown;
}

/** What the card says to watch on every entry that does not say for itself: its own, else its template's. */
function levelWatch(config: RebuildConfig | undefined, template: TemplateConfig | undefined): WatchSpec {
  const own = config?.rebuild_on_watch;
  return parseWatch(
    own !== undefined ? own : (template as { rebuild_on_watch?: unknown } | undefined)?.rebuild_on_watch,
  );
}

/** What one rebuild_on entry names once filled in: a placeholder may give none, one or many. */
function filledEntry(
  entry: unknown,
  config: RebuildConfig | undefined,
  template: TemplateConfig | undefined,
  hass?: any,
  extras?: BuildExtras,
  level?: WatchSpec,
): Named[] {
  const own = isRebuildObject(entry);
  const watch = own && (entry as { watch?: unknown }).watch !== undefined ? parseWatch(entry.watch) : level;
  const named = rebuildEntryEntity(entry);
  // An object with no entity in it names nothing a card can watch, and is said as written.
  if (own && named === undefined) return [{ value: entry, watch, written: entry }];
  if (!isRebuildPlaceholder(named)) return [{ value: named, watch, written: entry }];
  let filled: unknown;
  try {
    filled = deepReplace(
      config?.variables,
      template ?? ({} as TemplateConfig),
      named,
      config?.template,
      hass,
      true,
      undefined,
      0,
      undefined,
      undefined,
      false,
      extras,
    );
  } catch {
    filled = named;
  }
  // A variable holding a list of entities gives each of them.
  return entries(filled).map((each) => {
    const value = typeof each === 'string' ? each.trim() : each;
    return { value, watch, written: own ? entry : value };
  });
}

/** The entities named, and what was named that is not an entity id once filled in. */
function sorted(named: Named[]): RebuildOn {
  const entities = rebuildOnEntities(named.map((each) => each.value));
  const watch: WatchSpec[] = [];
  const seen = new Set<string>();
  for (const each of named) {
    if (typeof each.value !== 'string' || !entities.includes(each.value)) continue;
    const at = entities.indexOf(each.value);
    // The same entity named twice watches what both of them say: the wider of the two.
    watch[at] = seen.has(each.value) ? mergeWatch(watch[at], each.watch) : each.watch;
    seen.add(each.value);
  }
  const rejects = named
    // Left empty - an optional variable with no value - names nothing, which is not a mistake.
    .filter((each) => each.value !== '' && !(typeof each.value === 'string' && entities.includes(each.value)))
    .map((each) =>
      typeof each.written === 'string'
        ? each.written
        : typeof each.value === 'string'
          ? each.value
          : JSON.stringify(each.written),
    );
  return { entities, rejects, watch: entities.map((_, index) => watch[index]) };
}

/** The entities a card rebuilds on: its own rebuild_on and its template's, placeholders filled in. */
export function rebuildOnFor(
  config: RebuildConfig | undefined,
  template: TemplateConfig | undefined,
  hass?: any,
  extras?: BuildExtras,
): RebuildOn {
  const written = [...entries(config?.rebuild_on), ...entries((template as { rebuild_on?: unknown })?.rebuild_on)];
  const level = levelWatch(config, template);
  const named: Named[] = [];
  for (const entry of written) named.push(...filledEntry(entry, config, template, hass, extras, level));
  return sorted(named);
}

export interface RebuildOnEntry extends RebuildOn {
  /** The entry as written. */
  entry: unknown;
  /** Where it is written: on the card, or on its template. */
  from: 'card' | 'template';
}

/**
 * Each rebuild_on entry the card and its template write, with what it fills to - for the
 * card editor, which shows the card's placeholders beside the entity picker and the
 * template's entries under it (#411).
 */
export function rebuildOnEach(
  config: RebuildConfig | undefined,
  template: TemplateConfig | undefined,
  hass?: any,
  extras?: BuildExtras,
): RebuildOnEntry[] {
  const level = levelWatch(config, template);
  const each = (entry: unknown, from: 'card' | 'template'): RebuildOnEntry => ({
    entry,
    from,
    ...sorted(filledEntry(entry, config, template, hass, extras, level)),
  });
  return [
    ...entries(config?.rebuild_on).map((entry) => each(entry, 'card')),
    ...entries((template as { rebuild_on?: unknown })?.rebuild_on).map((entry) => each(entry, 'template')),
  ];
}
