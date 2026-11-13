import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';
import { VariableDeclaration } from './variables';
import { StrictConfig } from './strict';

/* eslint-disable @typescript-eslint/no-explicit-any */
/** What counts as a change of a rebuild_on entity (#411): `all`, `read`, or the parts named. */
export type RebuildWatch = 'all' | 'read' | string | string[];

/** One rebuild_on entity that says which parts of its state count as a change (#411). */
export interface RebuildOnEntity {
  /** The entity id, or a placeholder that fills to one. */
  entity: string;
  /** `read`, `all`, or a list of `state`, `last_changed`, `last_updated` and attribute names. */
  watch?: RebuildWatch;
}

/** A rebuild_on value: one entity or many, each an id or `{entity, watch}`. */
export type RebuildOnValue = string | RebuildOnEntity | (string | RebuildOnEntity)[];

export interface DeclutteringCardConfig extends LovelaceCardConfig {
  variables?: VariablesConfig[];
  template: string;
  style?: string;
  /** One copy of the template per item, each item holding that copy's variables.
   *  A single mapping counts as a list of one. */
  for_each?: unknown[] | Record<string, unknown>;
  /** What to repeat over, read from Home Assistant rather than written out. */
  for_each_from?: unknown;
  /** How many columns the copies are laid out in. One column stacks them vertically.
   *  With `min_column_width` set, this is the most columns it will ever use. */
  columns?: number;
  /** How narrow a copy may get, in pixels, before a column is dropped. */
  min_column_width?: number;
  /** What to show instead when a repeat produces no copies at all. */
  empty?: unknown;
  /** The space between repeated copies, in pixels. */
  gap?: number;
  /** How much of a sections grid the card asks for, overriding what the template says. */
  grid_options?: unknown;
  /** Renders what the card builds instead of the card itself, for working out why - `yaml` to show it as YAML,
   *  `console` to render the card as normal and log how it was built, `report` to log it and show it as text to copy. */
  debug?: boolean | 'yaml' | 'console' | 'report';
  /** `false` leaves passwords, tokens, addresses and hosts in the `debug: report` text as they are. */
  redact?: boolean;
  /** What the card does about an error or a warning in its build: `true` refuses on errors, or one mode per level (#390). */
  strict?: boolean | StrictConfig;
  /** What `debug: console` calls this card, placeholders and all. Beats the template's. */
  name?: string;
  /** Inside another template: be handed every variable of the card that builds this one. */
  inherit_variables?: boolean;
  /** Whether this card keeps a box of its own in the layout, or gets out of the way. */
  fit?: 'box' | 'contents';
  /** What to show instead of an error when the card cannot be built: a config of the template's kind, or `hide`. */
  on_error?: 'hide' | Record<string, unknown>;
  /** A template per entity domain, chosen copy by copy from the `entity` variable; `default:` for the rest. */
  template_by_domain?: Record<string, string>;
  /** Builds the copies of a repeat past the first few only as they near the screen. */
  lazy?: boolean;
  /** How many copies a lazy repeat builds straight away. Six unless it says. */
  lazy_eager?: number;
  /**
   * Entities whose state changes rebuild the card - and the only ones `|state` can read.
   * Placeholders are filled from the variables (#411). An entry can say which parts of the
   * state count: `{entity: camera.front, watch: [state, camera_name]}`.
   */
  rebuild_on?: RebuildOnValue;
  /**
   * Which parts of a rebuild_on entity's state count as a change, for every entry that does
   * not say (#411): `read` - the state and the attributes the template reads - or a list of
   * `state`, `last_changed`, `last_updated` and attribute names. Left out, all of it counts.
   */
  rebuild_on_watch?: RebuildWatch;
  /** Cards of the card's own, by slot name, put where the template left a `[[name|slot]]`. */
  slots?: Record<string, unknown>;
  /** Values laid over `variables` while the screen is a phone's - or, with `mobile_below`, while the card itself is narrower than that. */
  variables_mobile?: VariablesConfig[] | Record<string, unknown>;
  /** A card width, in pixels, below which `variables_mobile` applies instead of the screen deciding. */
  mobile_below?: number;
}

export interface DeclutteringTemplateConfig extends LovelaceCardConfig, TemplateConfig {
  template: string;
}

export interface VariablesConfig {
  [key: string]: any;
}

export interface TemplateConfig {
  /** What the template is for, shown to whoever uses it. */
  description?: string;
  /** What `debug: console` calls a card built from this template; it can use the card's variables. */
  name?: string;
  /** Groups templates in the picker - "Rooms", "Badges" - for dashboards with many. */
  category?: string;
  /** Lists the template as a card of its own in Home Assistant's add-card dialog; a string names the entry. */
  publish?: boolean | string;
  /** Says the template is on its way out - `true`, or a message saying what to use instead. Not inherited. */
  deprecated?: boolean | string;
  /** Sets of variables the template is shown working with: checked by the health panel, offered by the editors. */
  examples?: unknown;
  /** What a card using this template shows instead of an error, unless the card says otherwise. */
  on_error?: 'hide' | Record<string, unknown>;
  /**
   * What counts as a problem with the values a card gives it (#389): each a `condition`, a
   * `message`, a `level` - info, warn or error - and for an error whether to go on building.
   */
  checks?: TemplateCheck[];
  /** A config of the template's kind shown instead of the card while a warn or error check has failed. */
  alert?: Record<string, unknown>;
  /** What a card using this template does about errors and warnings, unless the card says otherwise (#390). */
  strict?: boolean | StrictConfig;
  /** Which entities Home Assistant's add-card dialog offers this template for. */
  suggest_for?: unknown;
  /** Only for other templates to extend: left out of the card editor's template picker. Not inherited. */
  base?: boolean;
  /** Parts of the card editor this template has no use for - `repeat`, `extras`, `fit`, `advanced` or an Advanced field. */
  editor_hide?: string | string[];
  /**
   * Entities a card using this template rebuilds on, as well as the card's own - and the only
   * ones `|state` and `|attr:` can read. Placeholders are filled from the variables: `'[[camera]]'` (#411).
   */
  rebuild_on?: RebuildOnValue;
  /** What a rebuild_on entity's change is compared on, for cards using this template that do not say (#411). */
  rebuild_on_watch?: RebuildWatch;
  /** Who wrote it: a name, or `name`/`github`/`email`/`url`. For sharing; not inherited. */
  author?: string | Record<string, string>;
  /** The licence it is shared under. Not inherited. */
  license?: string;
  /** A page or post explaining it. Not inherited. */
  help?: string;
  /** Where it lives, and where newer versions are. Not inherited. */
  homepage?: string;
  /** Markdown shown before it is installed. Not inherited. */
  readme?: string;
  /** Templates that belong with this one without it calling them; they travel with it. Not inherited. */
  related?: string | string[];
  /** Integrations, entities, custom cards and versions it needs, checked before installing. */
  requires?: Record<string, unknown>;
  /** Variables to ask for when it is installed, written into its defaults. */
  setup?: string | string[];
  /** The template this one builds on: its content underneath, this one's last word on top.
   *  A list builds on several, left to right, each later one over the ones before. */
  extends?: string | string[];
  /** The variables the template takes, described so its editor can offer real controls. */
  variables?: VariableDeclaration[];
  /**
   * The template's texts in each language (#392), keyed by language code - `en`, `de`, `pt-BR` -
   * each a mapping of texts of any depth. `[[$key.path]]` anywhere in the template is that text
   * in Home Assistant's language, falling back to the language without its region, then `en`,
   * then the first one given. `extends:` merges them key by key.
   */
  language?: Record<string, Record<string, unknown>>;
  default?: VariablesConfig[];
  /** `default:` spelled plural, read the same - the two are merged, `default:` winning a name both set. */
  defaults?: VariablesConfig[] | Record<string, unknown>;
  /**
   * Values the template computes for itself from the others - `room_slug: '[[room|slug]]'`
   * written once instead of the chain repeated everywhere. Template internals: an instance
   * cannot override one.
   */
  let?: Record<string, unknown> | VariablesConfig[];
  /**
   * A piece of config rather than a card - one entry of a camera card's `cameras:`, say -
   * filled in where a placeholder asks for it: `[[name|with:...]]` once, `[[name|repeat:...]]`
   * once per item. Takes `default:`, `let:` and `variables:` like any template.
   */
  item?: unknown;
  /**
   * A template used as a step (#307): `[[room|name]]`, `[[room|name:a,b]]`. What the step gives -
   * a placeholder text or a plain value - with the value it is applied to as `[[value]]`. It
   * sees nothing of the card's variables: only the value, its arguments, and its own
   * `default:` and `let:`.
   */
  function?: unknown;
  /** For a function template: the names its unnamed arguments take, in order. */
  parameters?: string[];
  /** For an item template: what a bare `[[name|repeat]]` repeats over - a list, or a placeholder that fills to one. */
  for_each?: unknown;
  /** For an item template: the registry source a bare `[[name|repeat]]` repeats over. */
  for_each_from?: unknown;
  card?: any;
  row?: any;
  element?: any;
  badge?: any;
  /** Cards that take their places in the section one by one, as if each were written there. */
  group?: any;
  /** A whole dashboard, for a dashboard strategy's `page:` to build. Not a card. */
  dashboard?: any;
  style?: string;
  /** How much of a sections grid a card built from this template asks for. */
  grid_options?: any;
  /** Conditions on the variables that decide whether a copy is built at all - `variable:` with
   *  `exists`, `equals`, `not_equals`, `in`, `not_in` or `matches`. Every one must hold. */
  visibility?: unknown;
  /** Which version of itself the template is, for the health panel and the shared store. Not enforced. */
  version?: number | string;
  /** What changed in each version, keyed by version - the health panel reads a variable's story from these. */
  changes?: Record<string, string | string[]>;
}

/** One of a template's `checks:` (#389). */
export interface TemplateCheck {
  name?: string;
  /** A show_if condition - `name`, `!name`, `name=text`, `name!=text` - text with placeholders, or true or false. */
  condition?: string | boolean;
  /** What the condition comes out as when the check fails. True unless it says otherwise. */
  fail_on?: boolean;
  /** What is said when it fails, with placeholders; a generic sentence when there is none. */
  message?: string;
  /** `info`, `warn` (the default) or `error`; `warning` reads as `warn`. */
  level?: 'info' | 'warn' | 'warning' | 'error';
  /** An error with `false` fails the build, so `on_error:` takes over. */
  continue_rendering?: boolean;
}

export interface LovelaceElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceElementConfig): void;
}

export interface LovelaceElementConfig {
  type: string;
  style: Record<string, string>;
  [key: string]: any;
}

export interface LovelaceRow extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceRowConfig): void;
}

export interface LovelaceRowConfig {
  type?: string;
  [key: string]: any;
}

/** One entry of an ha-form schema, as far as the card's label and helper callbacks read it. */
export interface FormSchemaEntry {
  name: string;
  label?: string;
  helper?: string;
  /** A Home Assistant selector, as ha-form reads it, when the entry is a field. */
  selector?: Record<string, unknown>;
  /** `grid` or `expandable`, when the entry lays other entries out. */
  type?: string;
  schema?: FormSchemaEntry[];
  title?: string;
  column_min_width?: string;
  required?: boolean;
}

export type LovelaceThing = LovelaceCard | LovelaceElement | LovelaceRow;
export type LovelaceThingConfig = LovelaceCardConfig | LovelaceElementConfig | LovelaceRowConfig;
export type LovelaceThingType = 'card' | 'row' | 'element' | 'badge';
