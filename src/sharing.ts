/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * What a template says about itself for whoever it is shared with (#345): who wrote it, under
 * what licence, where to read more and where it lives, a readme, the templates that belong
 * with it, what it needs from the Home Assistant it lands in, and the variables to ask for on
 * install. All ordinary keys on the template, so they travel in an export and a post the way
 * `description:` does, and none of them change what the template builds.
 *
 * Everything here is read from config that may have come from a stranger's post, so each
 * value is checked for its type, trimmed to a sensible length, and a link is only a link when
 * it is http or https.
 */

import { DEFAULTS_ALIAS, templateDefaults } from './variables';

const MAX_TEXT = 200;
const MAX_README = 8_000;
const MAX_LIST = 50;

export interface ShareAuthor {
  name?: string;
  github?: string;
  email?: string;
  url?: string;
}

export interface ShareInfo {
  author?: ShareAuthor;
  license?: string;
  /** A page or post that explains the template. */
  help?: string;
  /** Where the template lives and where newer versions are. */
  homepage?: string;
  /** Markdown, shown before installing. */
  readme?: string;
  /** Templates that belong with this one without it calling them: they travel with it. */
  related: string[];
  /** Variables to ask for when the template is installed, written into its defaults. */
  setup: string[];
}

const text = (value: unknown, max = MAX_TEXT): string | undefined => {
  if (typeof value === 'number') value = String(value);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
};

/** A link worth rendering as one: http or https, and nothing else. */
export function safeUrl(value: unknown): string | undefined {
  const url = text(value, 2_000);
  if (!url || !/^https?:\/\/[^\s/]+/i.test(url)) return undefined;
  return url;
}

const names = (value: unknown): string[] =>
  ([] as unknown[])
    .concat(value ?? [])
    .map((each) => text(each))
    .filter((each): each is string => !!each)
    .slice(0, MAX_LIST);

function author(value: unknown): ShareAuthor | undefined {
  if (typeof value === 'string') {
    const name = text(value);
    return name ? { name } : undefined;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const given = value as Record<string, unknown>;
  const github = text(given.github);
  const out: ShareAuthor = {
    name: text(given.name),
    // A GitHub login is letters, digits and single dashes; anything else is not one.
    github: github && /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(github) ? github : undefined,
    email: text(given.email),
    url: safeUrl(given.url),
  };
  for (const key of Object.keys(out) as (keyof ShareAuthor)[]) if (out[key] === undefined) delete out[key];
  return Object.keys(out).length ? out : undefined;
}

/** The sharing details a template carries, each one checked. */
export function shareInfo(template: unknown): ShareInfo {
  const t = (template && typeof template === 'object' ? template : {}) as Record<string, unknown>;
  const info: ShareInfo = {
    author: author(t.author),
    license: text(t.license),
    help: safeUrl(t.help),
    homepage: safeUrl(t.homepage),
    readme: text(t.readme, MAX_README),
    related: names(t.related),
    setup: names(t.setup),
  };
  for (const key of ['author', 'license', 'help', 'homepage', 'readme'] as const) {
    if (info[key] === undefined) delete info[key];
  }
  return info;
}

/** The author on one line: name, GitHub login and email, whichever are given. */
export function authorLine(value: ShareAuthor | undefined): string {
  if (!value) return '';
  return [value.name, value.github ? `@${value.github}` : undefined, value.email].filter(Boolean).join(' · ');
}

export type RequirementKind = 'integration' | 'entity' | 'custom_card' | 'homeassistant' | 'card';

/*
 * The keys that say something about a template rather than build it. Nothing in them is
 * fetched or run, so a scan of what a template would do skips them: a help link is a link
 * the person may follow, not an address the card reaches.
 */
export const SHARING_KEYS = ['author', 'license', 'help', 'homepage', 'readme', 'requires', 'setup', 'related'];

/** A template without its sharing details, for scans of what it builds. */
export function withoutSharing<T>(template: T): T {
  if (!template || typeof template !== 'object' || Array.isArray(template)) return template;
  const rest: Record<string, unknown> = { ...(template as Record<string, unknown>) };
  for (const key of SHARING_KEYS) delete rest[key];
  return rest as T;
}

export interface Requirement {
  kind: RequirementKind;
  /** Any one of these will do. A version is a single minimum. */
  any: string[];
  /** What the template's author wants said when it is missing. */
  message?: string;
}

// The `requires:` keys, and the key a mapping entry under each uses for what it names.
const REQUIREMENT_KEYS: Record<string, { kind: RequirementKind; key: string }> = {
  integrations: { kind: 'integration', key: 'integration' },
  entities: { kind: 'entity', key: 'entity' },
  custom_cards: { kind: 'custom_card', key: 'card' },
};

const version = (value: unknown): string | undefined => {
  const written = text(value, 40);
  return written ? written.replace(/\+$/, '').trim() || undefined : undefined;
};

/*
 * `requires:` as a list of things to check. Under integrations, entities and custom_cards an
 * entry is a name, a list of names any one of which will do, or a mapping that adds a message:
 *
 *   requires:
 *     integrations:
 *       - frigate
 *       - integration: [frigate, reolink]
 *         message: Needs Frigate or Reolink.
 *     entities: ['binary_sensor.*_zone_*']
 *     custom_cards: [advanced-camera-card]
 *     homeassistant: '2026.10'
 *     card: '2.5'
 */
export function requirementsOf(template: unknown): Requirement[] {
  const requires = (template as any)?.requires;
  if (!requires || typeof requires !== 'object' || Array.isArray(requires)) return [];
  const out: Requirement[] = [];
  for (const [field, { kind, key }] of Object.entries(REQUIREMENT_KEYS)) {
    for (const entry of ([] as unknown[]).concat(requires[field] ?? []).slice(0, MAX_LIST)) {
      const mapping = entry && typeof entry === 'object' && !Array.isArray(entry) ? (entry as any) : undefined;
      const any = names(mapping ? mapping[key] : entry).map((each) =>
        kind === 'custom_card' ? each.replace(/^custom:/, '') : each,
      );
      if (!any.length) continue;
      const message = mapping ? text(mapping.message, 300) : undefined;
      out.push(message ? { kind, any, message } : { kind, any });
    }
  }
  for (const kind of ['homeassistant', 'card'] as const) {
    const wanted = version(requires[kind]);
    if (wanted) out.push({ kind, any: [wanted] });
  }
  return out;
}

/**
 * Whether a version is at least another: dotted numbers compared in turn, a missing part
 * counting as nought, so 2026.10.4 is at least 2026.10. Anything after the digits of a part -
 * the b1 of a beta - is ignored.
 */
export function versionAtLeast(have: string, want: string): boolean {
  const parts = (value: string): number[] => value.split('.').map((each) => parseInt(each, 10) || 0);
  const a = parts(have);
  const b = parts(want);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) return x > y;
  }
  return true;
}

/** An entity pattern as a test: `*` stands for anything, the rest is literal. */
function entityPattern(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
}

export interface Surroundings {
  /** Home Assistant's loaded integrations, `hass.config.components`. */
  components: string[];
  /** Every entity id there is. */
  entities: string[];
  /** Home Assistant's version, `hass.config.version`. */
  homeassistant?: string;
  /** This card's version. */
  card: string;
  /** Whether a custom element is registered in this browser. */
  isDefined: (tag: string) => boolean;
}

export interface Unmet extends Requirement {
  /** For a version: what is here. */
  have?: string;
}

function met(requirement: Requirement, here: Surroundings): boolean {
  switch (requirement.kind) {
    case 'integration': {
      // A platform loads as `sensor.frigate`; the integration is the part after the dot.
      const loaded = new Set<string>();
      for (const each of here.components) {
        loaded.add(each);
        loaded.add(each.split('.').pop() as string);
      }
      return requirement.any.some((each) => loaded.has(each));
    }
    case 'entity':
      return requirement.any.some((pattern) => {
        const test = entityPattern(pattern);
        return here.entities.some((id) => test.test(id));
      });
    case 'custom_card':
      return requirement.any.some((tag) => here.isDefined(tag));
    case 'homeassistant':
      // Not knowing which version this is is not a reason to say it is too old.
      return !here.homeassistant || versionAtLeast(here.homeassistant, requirement.any[0]);
    case 'card':
      // A development build has no real version to compare.
      return here.card.startsWith('0.0.0') || versionAtLeast(here.card, requirement.any[0]);
  }
}

/** What a set of templates says it needs that this Home Assistant does not have, once each. */
export function unmetRequirements(templates: unknown[], here: Surroundings): Unmet[] {
  const seen = new Set<string>();
  const out: Unmet[] = [];
  for (const template of templates) {
    for (const requirement of requirementsOf(template)) {
      const key = `${requirement.kind}:${requirement.any.join('|')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (met(requirement, here)) continue;
      const have =
        requirement.kind === 'homeassistant' ? here.homeassistant : requirement.kind === 'card' ? here.card : undefined;
      out.push(have ? { ...requirement, have } : requirement);
    }
  }
  return out;
}

/** The surroundings as a browser with Home Assistant connected sees them. */
export function surroundingsOf(hass: any, card: string, isDefined: (tag: string) => boolean): Surroundings {
  return {
    components: Array.isArray(hass?.config?.components) ? hass.config.components : [],
    entities: Object.keys(hass?.states ?? {}),
    homeassistant: typeof hass?.config?.version === 'string' ? hass.config.version : undefined,
    card,
    isDefined,
  };
}

/*
 * A version written as a bare number has already lost its trailing nought by the time it is
 * read - YAML makes `2026.10` the number 2026.1 - so it is worth a line to the author before
 * the template goes anywhere.
 */
export function unquotedVersions(template: unknown): string[] {
  const requires = (template as any)?.requires;
  if (!requires || typeof requires !== 'object') return [];
  return (['homeassistant', 'card'] as const).filter((key) => typeof requires[key] === 'number');
}

/** The variables the templates ask for on install, once each, in order. */
export function setupVariables(templates: unknown[]): string[] {
  const out: string[] = [];
  for (const template of templates)
    for (const name of shareInfo(template).setup) if (!out.includes(name)) out.push(name);
  return out;
}

/** What a template has as its own default for a variable, if it has one that is plain text or a number. */
export function ownDefault(template: unknown, name: string): string | undefined {
  const defaults = templateDefaults(template as any);
  const entries: Record<string, unknown>[] = Array.isArray(defaults)
    ? defaults.filter((each) => each && typeof each === 'object')
    : defaults && typeof defaults === 'object'
      ? Object.entries(defaults).map(([key, value]) => ({ [key]: value }))
      : [];
  const found = entries.find((entry) => Object.prototype.hasOwnProperty.call(entry, name));
  const value = found?.[name];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

/**
 * A template with the values given at install written into its defaults, for the variables
 * it asks for - each replacing the default it had. A value left empty changes nothing.
 */
export function withSetup(template: Record<string, any>, values: Record<string, string>): Record<string, any> {
  const asked = shareInfo(template).setup.filter((name) => typeof values[name] === 'string' && values[name] !== '');
  if (!asked.length) return template;
  const defaults = templateDefaults(template as any);
  const entries: Record<string, unknown>[] = Array.isArray(defaults)
    ? defaults.filter((each) => each && typeof each === 'object')
    : defaults && typeof defaults === 'object'
      ? Object.entries(defaults).map(([key, value]) => ({ [key]: value }))
      : [];
  const kept = entries.filter((entry) => !asked.some((name) => Object.prototype.hasOwnProperty.call(entry, name)));
  const out: Record<string, any> = {
    ...template,
    default: [...asked.map((name) => ({ [name]: values[name] })), ...kept],
  };
  delete out[DEFAULTS_ALIAS];
  return out;
}

/*
 * The sharing details as the Share tab's form shows them (#345): one flat field per value.
 * A requirement written with its own message, or as an any-of list, has no field of its own -
 * it stays in the YAML and survives every edit made through the form.
 */
export interface SharingForm {
  author_name?: string;
  author_github?: string;
  author_email?: string;
  author_url?: string;
  license?: string;
  help?: string;
  homepage?: string;
  readme?: string;
  related?: string[];
  setup?: string[];
  requires_integrations?: string[];
  requires_entities?: string[];
  requires_custom_cards?: string[];
  requires_homeassistant?: string;
  requires_card?: string;
}

const LIST_FIELDS = {
  integrations: 'requires_integrations',
  entities: 'requires_entities',
  custom_cards: 'requires_custom_cards',
} as const;

const raw = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : typeof value === 'number' ? String(value) : undefined;
const plainList = (value: unknown): string[] =>
  ([] as unknown[]).concat(value ?? []).filter((each): each is string => typeof each === 'string');

/** The form's values, read from the template as written. */
export function sharingFormData(template: unknown): SharingForm {
  const t = (template && typeof template === 'object' ? template : {}) as Record<string, any>;
  const author = t.author && typeof t.author === 'object' && !Array.isArray(t.author) ? t.author : undefined;
  const requires = t.requires && typeof t.requires === 'object' && !Array.isArray(t.requires) ? t.requires : {};
  const out: SharingForm = {
    author_name: author ? raw(author.name) : raw(t.author),
    author_github: raw(author?.github),
    author_email: raw(author?.email),
    author_url: raw(author?.url),
    license: raw(t.license),
    help: raw(t.help),
    homepage: raw(t.homepage),
    readme: raw(t.readme),
    related: plainList(t.related),
    setup: plainList(t.setup),
    requires_integrations: plainList(requires.integrations),
    requires_entities: plainList(requires.entities),
    requires_custom_cards: plainList(requires.custom_cards),
    requires_homeassistant: raw(requires.homeassistant),
    requires_card: raw(requires.card),
  };
  for (const key of Object.keys(out) as (keyof SharingForm)[]) if (out[key] === undefined) delete out[key];
  return out;
}

const filled = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;
const filledList = (value: unknown): string[] =>
  ([] as unknown[])
    .concat(value ?? [])
    .map(filled)
    .filter((each): each is string => !!each);

/**
 * The template with the form's values written in: an emptied field takes its key away, an
 * author with only a name is written as just the name, and versions are always text.
 */
export function applySharingForm(template: Record<string, any>, form: SharingForm): Record<string, any> {
  const out: Record<string, any> = { ...template };
  const set = (key: string, value: unknown): void => {
    const empty = value === undefined || (Array.isArray(value) && !value.length);
    if (empty) delete out[key];
    else out[key] = value;
  };

  const author: Record<string, string> = {};
  const name = filled(form.author_name);
  if (name) author.name = name;
  for (const key of ['github', 'email', 'url'] as const) {
    const value = filled(form[`author_${key}`]);
    if (value) author[key] = value;
  }
  // Anything else the author mapping held, which the form has no field for, stays.
  const was =
    template.author && typeof template.author === 'object' && !Array.isArray(template.author) ? template.author : {};
  for (const [key, value] of Object.entries(was)) {
    if (!['name', 'github', 'email', 'url'].includes(key)) author[key] = value as string;
  }
  const keys = Object.keys(author);
  set('author', !keys.length ? undefined : keys.length === 1 && name ? name : author);

  for (const key of ['license', 'help', 'homepage'] as const) set(key, filled(form[key]));
  // A readme keeps its own spacing; only a readme of nothing but spaces is no readme.
  set('readme', typeof form.readme === 'string' && form.readme.trim() ? form.readme : undefined);
  set('related', filledList(form.related));
  set('setup', filledList(form.setup));

  const requires: Record<string, any> =
    template.requires && typeof template.requires === 'object' && !Array.isArray(template.requires)
      ? { ...template.requires }
      : {};
  for (const [key, field] of Object.entries(LIST_FIELDS)) {
    // Entries the form cannot show - any-of lists, entries with a message - are kept, after the plain ones.
    const kept = ([] as unknown[]).concat(requires[key] ?? []).filter((each) => typeof each !== 'string');
    const list = [...filledList(form[field]), ...kept];
    if (list.length) requires[key] = list;
    else delete requires[key];
  }
  for (const key of ['homeassistant', 'card'] as const) {
    const value = filled(form[`requires_${key}`]);
    if (value) requires[key] = value;
    else delete requires[key];
  }
  set('requires', Object.keys(requires).length ? requires : undefined);
  return out;
}
