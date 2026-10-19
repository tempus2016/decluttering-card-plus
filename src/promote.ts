import { PLACEHOLDER, VariableDeclaration } from './variables';
import { freeName } from './share';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A template usually starts as a card somebody built, and the next step is deciding which of
 * its settings should change from one copy to the next. Suggest variables guesses at the
 * usual ones; this is for the rest - pick any one setting, give it a name, and it becomes a
 * placeholder whose default is the value it had, so the template still builds what it did.
 */

export type SettingPath = (string | number)[];

export interface Setting {
  path: SettingPath;
  value: string | number | boolean;
  /** `tap_action › navigation_path`, list items counted from one. */
  label: string;
}

/** The keys a template's content can sit under, in the order a template is read. */
export const CONTENT_KEYS = ['card', 'badge', 'row', 'element', 'group'] as const;

const VALID_NAME = /^[A-Za-z0-9_-]+$/;
const ENTITY_ID = /^[a-z_]+\.[a-z0-9_]+$/;

/** Which key holds the template's content, if any does. */
export function contentKey(template: any): (typeof CONTENT_KEYS)[number] | undefined {
  return CONTENT_KEYS.find((key) => template?.[key] !== undefined && template?.[key] !== null);
}

function labelFor(path: SettingPath): string {
  return path.map((step) => (typeof step === 'number' ? `#${step + 1}` : step)).join(' › ');
}

/*
 * Every setting that can become a variable: a plain value, not a `type` (a variable card type
 * is a template of a different kind), and not already a placeholder. Lists and mappings are
 * walked into rather than offered whole - the picker is for one value at a time.
 */
export function listSettings(content: any): Setting[] {
  const out: Setting[] = [];
  const walk = (node: any, path: SettingPath): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, [...path, index]));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (key === 'type' && typeof value === 'string') continue;
        walk(value, [...path, key]);
      }
      return;
    }
    if (typeof node === 'string' && PLACEHOLDER.test(node)) return;
    if (!path.length || node === null || node === undefined) return;
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
      out.push({ path, value: node, label: labelFor(path) });
    }
  };
  walk(content, []);
  return out;
}

/** The names a template already answers to: what it declares, and what its content uses. */
export function namesInUse(template: any): string[] {
  const names = new Set<string>();
  for (const declaration of Array.isArray(template?.variables) ? template.variables : []) {
    if (declaration && typeof declaration.name === 'string') names.add(declaration.name);
  }
  const text = JSON.stringify(template ?? {});
  const used = /\[\[([A-Za-z0-9_-]+)/g;
  for (let match = used.exec(text); match; match = used.exec(text)) names.add(match[1]);
  return [...names];
}

/** A name for the setting at `path`: the key it sits under, numbered if that is taken. */
export function nameForSetting(path: SettingPath, taken: string[]): string {
  const key = [...path].reverse().find((step) => typeof step === 'string') as string | undefined;
  const last = path[path.length - 1];
  const base = (typeof last === 'number' ? `${key ?? 'item'}_${last + 1}` : (key ?? 'value'))
    .replace(/[^A-Za-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return freeName(base || 'value', taken);
}

/** The kind of value it is, which picks the control a card using the template gets for it. */
function typeFor(value: unknown): string {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string' && ENTITY_ID.test(value)) return 'entity';
  if (typeof value === 'string' && /^[a-z]+:[a-z0-9-]+$/.test(value)) return 'icon';
  return 'text';
}

function setAt(node: any, path: SettingPath, value: unknown): any {
  if (!path.length) return value;
  const [step, ...rest] = path;
  if (Array.isArray(node)) return node.map((item, index) => (index === step ? setAt(item, rest, value) : item));
  return { ...node, [step]: setAt(node?.[step], rest, value) };
}

function valueAt(node: any, path: SettingPath): unknown {
  return path.reduce((at, step) => (at === undefined || at === null ? undefined : at[step]), node);
}

export type PromoteResult = { ok: true; template: any } | { ok: false; error: 'name_invalid' | 'name_taken' | 'gone' };

/**
 * The template with the setting at `path` (inside its content) swapped for `[[name]]`, and
 * `name` declared with the old value as its default. Nothing is mutated.
 */
export function promoteSetting(template: any, path: SettingPath, name: string): PromoteResult {
  if (!VALID_NAME.test(name)) return { ok: false, error: 'name_invalid' };
  if (namesInUse(template).includes(name)) return { ok: false, error: 'name_taken' };
  const key = contentKey(template);
  const value = key ? valueAt(template[key], path) : undefined;
  if (!key || value === undefined || value === null || typeof value === 'object') return { ok: false, error: 'gone' };

  const declaration: VariableDeclaration = { name, type: typeFor(value), default: value };
  const declared = Array.isArray(template.variables) ? template.variables : [];
  return {
    ok: true,
    template: { ...template, [key]: setAt(template[key], path, `[[${name}]]`), variables: [...declared, declaration] },
  };
}
