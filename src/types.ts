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
  /** How many columns the copies are laid out in. One column stacks them vertically.
   *  With `min_column_width` set, this is the most columns it will ever use. */
  columns?: number;
  /** How narrow a copy may get, in pixels, before a column is dropped. */
  min_column_width?: number;
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
