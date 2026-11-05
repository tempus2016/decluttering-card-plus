import { localize } from './localize';
import { TemplateConfig, VariablesConfig } from './types';
import {
  ALERTS_NAME,
  conditionHolds,
  isCondition,
  isWellFormedCondition,
  normaliseVariables,
  stripHaMarks,
  truthy,
} from './variables';

export { ALERTS_NAME };

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `checks:` (#389): a template saying what counts as a problem with the values it was given,
 * the way `show_if` and `hide_if` say when a field is wanted. Each check has a condition, a
 * message and a level:
 *
 *   checks:
 *     - name: No camera
 *       condition: '[[camera|exists]]'
 *       fail_on: false
 *       level: error
 *       message: The camera [[camera]] is not in Home Assistant.
 *       continue_rendering: false
 *
 * The condition is one of show_if's - `name`, `!name`, `name=text`, `name!=text` - or text
 * with placeholders in it, filled in and read as a yes or a no the way `bool` reads it, or a
 * plain true or false. The check fails when the condition comes out as its `fail_on`, which
 * is true unless it says otherwise. A failed check is an alert:
 *
 * - `info` is said in the console and nowhere else;
 * - `warn`, which is what a check with no level is, goes in the warnings the card keeps, in
 *   the card editor and at the top of the debug report;
 * - `error` does all that and shows the debug report under the card even with `debug` off,
 *   and with `continue_rendering: false` the card is not built at all - it fails like any
 *   other card that cannot be, so its `on_error:` decides what shows instead.
 *
 * Every alert is in `[[__alerts__]]`, so the template - or its `alert:` - can show them.
 */
export const CHECKS_KEY = 'checks';
/** A config of the template's kind shown in place of the card while a check has failed. */
export const ALERT_KEY = 'alert';

export const CHECK_LEVELS = ['info', 'warn', 'error'] as const;
export type CheckLevel = (typeof CHECK_LEVELS)[number];

/** One failed check. */
export interface Alert {
  level: CheckLevel;
  message: string;
  /** The check's `name:`, when it has one. */
  name?: string;
  /** The template the check is on. */
  template?: string;
  /** An `error` with `continue_rendering: false`: the card is not built. */
  stop: boolean;
}

/** The keys a check is read from; anything else in one is a mistake template lint points out. */
export const CHECK_KEYS = ['name', 'condition', 'fail_on', 'message', 'level', 'continue_rendering'];

/** A template's checks, the ones that are mappings - a single mapping counts as a list of one. */
export function checksOf(template: TemplateConfig | undefined): Record<string, unknown>[] {
  const written = (template as any)?.[CHECKS_KEY];
  const list = Array.isArray(written) ? written : written && typeof written === 'object' ? [written] : [];
  return list.filter((each: unknown) => !!each && typeof each === 'object' && !Array.isArray(each));
}

/** A check's level: `warn` when it says none, `warning` read as `warn`, undefined for one nobody knows. */
export function checkLevel(written: unknown): CheckLevel | undefined {
  if (written === undefined || written === null || written === '') return 'warn';
  const level = String(written).trim().toLowerCase();
  if (level === 'warning') return 'warn';
  return (CHECK_LEVELS as readonly string[]).includes(level) ? (level as CheckLevel) : undefined;
}

/** The condition as an `if:` step, when it is written as one of show_if's rather than as text to fill in. */
export function conditionStep(condition: string): string | undefined {
  const trimmed = condition.trim();
  if (!trimmed || trimmed.includes('[[')) return undefined;
  return isCondition(trimmed) ? trimmed : `if:${trimmed}`;
}

/**
 * How each check is read: `fill` fills text in with the card's values the way the build
 * does, and gives back what it became - a placeholder with nothing to fill it left as it was.
 */
export type CheckFill = (content: unknown) => unknown;

/** Whether a condition holds, or undefined for one that cannot be read - which is passed over. */
export function conditionResult(condition: unknown, fill: CheckFill): boolean | undefined {
  if (typeof condition === 'boolean') return condition;
  if (typeof condition === 'number') return truthy(condition);
  if (typeof condition !== 'string') return undefined;
  const word = condition.trim().toLowerCase();
  if (word === 'true' || word === 'false') return word === 'true';
  const step = conditionStep(condition);
  if (step === undefined) {
    if (!condition.includes('[[')) return undefined;
    const filled = fill(condition);
    // Text still wearing brackets had nothing to fill it, which is no.
    if (typeof filled === 'string' && /\[\[[^[\]]*\]\]/.test(filled)) return false;
    return truthy(typeof filled === 'string' ? stripHaMarks(filled) : filled);
  }
  if (!isWellFormedCondition(step)) return undefined;
  return conditionHolds(step, (name) => {
    const placeholder = `[[${name}]]`;
    const value = fill(placeholder);
    return value === placeholder ? undefined : value;
  });
}

function messageOf(check: Record<string, unknown>, fill: CheckFill, template: string | undefined, hass?: any): string {
  const written = check.message;
  if (written !== undefined && written !== null && written !== '') {
    const filled = typeof written === 'string' ? fill(written) : written;
    const text = typeof filled === 'string' ? filled : JSON.stringify(filled);
    if (text?.trim()) return stripHaMarks(text).trim();
  }
  const name = typeof check.name === 'string' && check.name ? check.name : undefined;
  return localize(name ? 'check.failed_named' : 'check.failed', { name: name ?? '', template: template ?? '' }, hass);
}

/** The template's checks that fail with these values, in the order they are written. */
export function runChecks(
  template: TemplateConfig | undefined,
  templateName: string | undefined,
  fill: CheckFill,
  hass?: any,
): Alert[] {
  const alerts: Alert[] = [];
  for (const check of checksOf(template)) {
    let holds: boolean | undefined;
    try {
      holds = conditionResult(check.condition, fill);
    } catch {
      holds = undefined;
    }
    if (holds === undefined) continue;
    const failOn = check.fail_on === undefined ? true : truthy(check.fail_on);
    if (holds !== failOn) continue;
    const level = checkLevel(check.level) ?? 'warn';
    const name = typeof check.name === 'string' && check.name ? check.name : undefined;
    alerts.push({
      level,
      message: messageOf(check, fill, templateName, hass),
      ...(name ? { name } : {}),
      ...(templateName ? { template: templateName } : {}),
      stop: level === 'error' && check.continue_rendering === false,
    });
  }
  return alerts;
}

/**
 * What `[[__alerts__]]` holds: every alert under `all`, with how many there are and the
 * worst level among them, and each level's messages on their own.
 *
 *   all: { count: 2, highest_level: error, items: [{ level: warn, message: ... }, ...] }
 *   info: { count: 0, items: [] }
 *   warn: { count: 1, items: [...] }
 *   error: { count: 1, items: [...] }
 */
export function alertsValue(alerts: Alert[]): Record<string, unknown> {
  const highest = [...CHECK_LEVELS].reverse().find((level) => alerts.some((alert) => alert.level === level));
  const value: Record<string, unknown> = {
    all: {
      count: alerts.length,
      highest_level: highest ?? '',
      items: alerts.map((alert) => ({
        level: alert.level,
        message: alert.message,
        ...(alert.name ? { name: alert.name } : {}),
        ...(alert.template ? { template: alert.template } : {}),
      })),
    },
  };
  for (const level of CHECK_LEVELS) {
    const items = alerts.filter((alert) => alert.level === level).map((alert) => alert.message);
    value[level] = { count: items.length, items };
  }
  return value;
}

/*
 * The variables with this build's `__alerts__` ahead of them. It is the build's own word, so
 * it beats one handed down from a card around it - which `inherit_variables` hands down
 * with everything else - and one a card sets by hand.
 */
export function withAlerts(
  variables: VariablesConfig[] | VariablesConfig | undefined,
  alerts: Alert[],
): VariablesConfig[] {
  return [{ [ALERTS_NAME]: alertsValue(alerts) }, ...normaliseVariables(variables)];
}

/** Whether a template reads `[[__alerts__]]` anywhere, or has checks that could fill it. */
export function wantsAlerts(template: TemplateConfig | undefined): boolean {
  if (!template) return false;
  if (checksOf(template).length) return true;
  return JSON.stringify(template)?.includes(ALERTS_NAME) ?? false;
}

/** The checks that keep the card from being built, as the one error it fails with. */
export function stoppingError(alerts: Alert[], hass?: any): string | undefined {
  const stopping = alerts.filter((alert) => alert.stop);
  if (!stopping.length) return undefined;
  return localize('error.check_stopped', { message: stopping.map((alert) => alert.message).join(' ') }, hass);
}

/** The alerts a failed check says in the console as it is found: info as information, the rest as warnings. */
export function alertConsoleMessage(alert: Alert, hass?: any): string {
  return localize(`check.console_${alert.level}`, { template: alert.template ?? '', message: alert.message }, hass);
}
