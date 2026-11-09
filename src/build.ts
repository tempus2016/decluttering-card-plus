import deepReplace, { BuildExtras } from './deep-replace';
import { Alert, ALERT_KEY, checksOf, runChecks } from './checks';
import { applyOverride, groupCard } from './templates';
import { usesResolver } from './variables';
import { BuildTrace } from './trace';
import { LovelaceThingConfig, LovelaceThingType, TemplateConfig, VariablesConfig } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The part of a card's build that needs nothing but its inputs (#427): which kind of thing a
 * template makes, what it builds from, its checks, the substitution and the card's own
 * override laid over it. The card element calls these with its own state; the docs site's
 * "Try a template" page calls them with what was typed into it - the same code either way,
 * so the page cannot build anything the card would not.
 */

// The things a template can define, exactly one of which it must. A group is a kind of card.
export const THING_TYPE_KEYS = ['card', 'row', 'element', 'badge', 'group'];

export function getThingType(templateConfig: TemplateConfig): LovelaceThingType | undefined {
  const thingTypes = Object.keys(templateConfig).filter((key) => THING_TYPE_KEYS.includes(key));
  if (thingTypes.length !== 1) return undefined;
  return thingTypes[0] === 'group' ? 'card' : (thingTypes[0] as LovelaceThingType);
}

// What a template builds, before its variables are put in. A group builds the card that lays it out.
export function thingContent(templateConfig: TemplateConfig): any {
  if (templateConfig.group !== undefined) return groupCard(templateConfig.group);
  return templateConfig.card ?? templateConfig.element ?? templateConfig.row ?? templateConfig.badge;
}

/**
 * A template's checks (#389) against one build's values, every failure and nothing said
 * about it - the card says them itself, once per config. Before Home Assistant is here an
 * `exists` is a no, so a template asking Home Assistant has no checks read until it is.
 */
export function templateAlerts(
  variables: VariablesConfig[] | undefined,
  templateConfig: TemplateConfig,
  templateName: string | undefined,
  buildHass: any,
  hass: any,
  extras: BuildExtras,
): Alert[] {
  if (!checksOf(templateConfig).length) return [];
  if (!hass && usesResolver(templateConfig, extras.itemTemplates)) return [];
  return runChecks(
    templateConfig,
    templateName,
    (content) =>
      deepReplace(
        variables,
        templateConfig,
        content,
        templateName,
        buildHass,
        true,
        undefined,
        0,
        undefined,
        undefined,
        false,
        extras,
      ),
    hass,
  );
}

// The template's `alert:`, built in place of its content while a warning or an error stands.
export function alertContent(templateConfig: TemplateConfig, alerts: Alert[]): unknown {
  const alert = (templateConfig as Record<string, unknown>)[ALERT_KEY];
  if (!alert || typeof alert !== 'object' || Array.isArray(alert)) return undefined;
  return alerts.some((each) => each.level !== 'info') ? alert : undefined;
}

/** What one build fills in: the template's content, or its `alert:` while a check fails. */
export function contentFor(templateConfig: TemplateConfig, alerts: Alert[]): unknown {
  return alertContent(templateConfig, alerts) ?? thingContent(templateConfig);
}

export interface ThingBuild {
  variables: VariablesConfig[] | undefined;
  templateConfig: TemplateConfig;
  content: unknown;
  templateName: string | undefined;
  hass: any;
  /** true says nothing in the console; a set says each thing once. */
  quiet: boolean | Set<string>;
  onUnresolved?: (names: string[]) => void;
  trace?: BuildTrace;
  extras: BuildExtras;
  /** The card using the template, whose `card:` (or `badge:`, `row:`...) block goes over what is built. */
  instance?: Record<string, unknown>;
  kind: string;
}

/** One build of a template: its content substituted, the card's override laid over it. */
export function buildThing(build: ThingBuild): any {
  return applyOverride(
    deepReplace(
      build.variables,
      build.templateConfig,
      build.content,
      build.templateName,
      build.hass,
      build.quiet,
      build.onUnresolved,
      0,
      build.trace,
      undefined,
      false,
      build.extras,
    ),
    build.instance,
    build.kind,
  );
}

/*
 * The N rows, or N picture elements, a repeated row or element template builds (idea 34), as
 * the config the card hands its `decluttering-card-plus-many` wrapper (src/row-repeat.ts).
 */
export const MANY_TAG = 'decluttering-card-plus-many';
export const MANY_TYPE = `custom:${MANY_TAG}`;

export type ManyKind = 'row' | 'element';

export interface ManyConfig {
  type: string;
  kind: ManyKind;
  items: Record<string, any>[];
}

/** The config the card hands the wrapper for N copies of a row or element template. */
export function manyConfig(kind: ManyKind, items: unknown[]): ManyConfig {
  return { type: MANY_TYPE, kind, items: items as Record<string, any>[] };
}

/*
 * The card's - or its template's - grid_options handed to the card it wraps, unless that has
 * its own. Only for a card: the rows of a repeat describe all the copies together.
 */
export function withGridOptions(
  thingType: LovelaceThingType,
  thingConfig: LovelaceThingConfig,
  gridOptions: unknown,
): LovelaceThingConfig {
  if (thingType !== 'card' || gridOptions === undefined) return thingConfig;
  if (!thingConfig || typeof thingConfig !== 'object' || 'grid_options' in thingConfig) return thingConfig;
  return { ...thingConfig, grid_options: gridOptions };
}
