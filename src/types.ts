import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';
import { VariableDeclaration } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  /** Renders what the card builds instead of the card itself, for working out why. */
  debug?: boolean;
  /** Turns what is normally a warning into a card that refuses to render. */
  strict?: boolean;
  /** Whether this card keeps a box of its own in the layout, or gets out of the way. */
  fit?: 'box' | 'contents';
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
  /** The variables the template takes, described so its editor can offer real controls. */
  variables?: VariableDeclaration[];
  default?: VariablesConfig[];
  card?: any;
  row?: any;
  element?: any;
  badge?: any;
  style?: string;
  /** How much of a sections grid a card built from this template asks for. */
  grid_options?: any;
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
  setConfig(config: LovelaceRowConfig);
}

export interface LovelaceRowConfig {
  type?: string;
  [key: string]: any;
}

export type LovelaceThing = LovelaceCard | LovelaceElement | LovelaceRow;
export type LovelaceThingConfig = LovelaceCardConfig | LovelaceElementConfig | LovelaceRowConfig;
export type LovelaceThingType = 'card' | 'row' | 'element' | 'badge';
