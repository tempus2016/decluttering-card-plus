import { TemplateConfig, VariablesConfig } from './types';
import { applyTransform } from './variables';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Translations for a shared template (#392). A template carries its own texts, one mapping
 * per language, keyed however its author likes:
 *
 *   language:
 *     en: {vars: {fb: {name: Fubar, desc: Forked up beyond all recognition}}}
 *     gd: {vars: {fb: {name: Knackered}}}
 *
 * and `[[$vars.fb.name]]` anywhere in the template is that text in the language Home
 * Assistant is set to. They stay inside the template rather than in files of their own,
 * because a template is already the thing people paste and share.
 *
 * Each key is looked up in the viewer's language, then that language without its region
 * (`pt-BR`, then `pt`), then English, then the first language the template gives - key by
 * key, so a language that translates half the texts still shows the other half in English.
 */
export const LANGUAGE_KEY = 'language';

/** What a translation lookup starts with: `[[$key]]`, never a variable's name. */
export const TRANSLATION_PREFIX = '$';

// Past this a mapping is not a set of texts anybody wrote by hand.
const MAX_KEY_DEPTH = 8;

// A key a placeholder could not name: it has a bar, a bracket or a question mark in it.
const UNNAMEABLE = /[|[\]?]/;

/** Whether a placeholder's name is a translation lookup rather than a variable. */
export function isTranslationName(name: string | undefined): boolean {
  return typeof name === 'string' && name.startsWith(TRANSLATION_PREFIX) && name.length > 1;
}

const isMapping = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/** The language Home Assistant is showing this user, `en` when there is no Home Assistant to ask. */
export function hassLanguage(hass: any): string {
  const language = hass?.locale?.language ?? hass?.language ?? hass?.selectedLanguage;
  return typeof language === 'string' && language ? language : 'en';
}

/** A template's `language:` block, when it is one: a mapping of languages to mappings of texts. */
export function languageBlock(template: unknown): Record<string, Record<string, any>> | undefined {
  const block = (template as any)?.[LANGUAGE_KEY];
  if (!isMapping(block)) return undefined;
  const out: Record<string, Record<string, any>> = {};
  for (const [code, texts] of Object.entries(block)) if (isMapping(texts) && code !== '__proto__') out[code] = texts;
  return Object.keys(out).length ? out : undefined;
}

const normal = (code: string): string => code.trim().toLowerCase().replace(/_/g, '-');

/**
 * The languages of a block in the order a key is looked for: the viewer's, the viewer's
 * without its region, English, then the first one written. Codes are matched without minding
 * case or `_` against `-`, so `pt_br` answers for Home Assistant's `pt-BR`.
 */
export function languageOrder(codes: string[], language: string): string[] {
  const wanted = normal(language);
  const base = wanted.split('-')[0];
  const order: string[] = [];
  const add = (code: string | undefined): void => {
    if (code !== undefined && !order.includes(code)) order.push(code);
  };
  add(codes.find((code) => normal(code) === wanted));
  add(codes.find((code) => normal(code) === base));
  add(codes.find((code) => normal(code) === 'en'));
  add(codes[0]);
  return order;
}

/** Every text in one language's mapping, by its dotted key: `vars.fb.name`. */
export function flattenTexts(texts: Record<string, any>): Map<string, unknown> {
  const out = new Map<string, unknown>();
  const walk = (value: Record<string, any>, prefix: string, depth: number): void => {
    for (const [key, inner] of Object.entries(value)) {
      if (key === '__proto__' || !key || UNNAMEABLE.test(key)) continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (isMapping(inner)) {
        if (depth + 1 < MAX_KEY_DEPTH) walk(inner, path, depth + 1);
      } else if (inner !== null && inner !== undefined) out.set(path, inner);
    }
  };
  walk(texts, '', 0);
  return out;
}

// Worked out once per block and language: a repeat builds the same template hundreds of times.
const entriesCache = new WeakMap<object, Map<string, VariablesConfig[]>>();

/**
 * A template's texts in one language, as the variables substitution reads them: each key
 * prefixed with `$` - `{'$vars.fb.name': 'Fubar'}` - from the first language in the
 * fallback order that has it. Nothing for a template without a `language:` block.
 */
export function translationEntries(template: unknown, language: string): VariablesConfig[] {
  const raw = (template as any)?.[LANGUAGE_KEY];
  if (!isMapping(raw)) return [];
  let byLanguage = entriesCache.get(raw);
  if (!byLanguage) {
    byLanguage = new Map();
    entriesCache.set(raw, byLanguage);
  }
  const cached = byLanguage.get(language);
  if (cached) return cached;
  const block = languageBlock(template);
  const entries: VariablesConfig[] = [];
  if (block) {
    const flat = new Map(Object.entries(block).map(([code, texts]) => [code, flattenTexts(texts)]));
    const order = languageOrder(Object.keys(block), language);
    const keys = new Set<string>();
    for (const code of Object.keys(block)) for (const key of flat.get(code)!.keys()) keys.add(key);
    for (const key of keys) {
      const from = order.find((code) => flat.get(code)!.has(key));
      if (from !== undefined) entries.push({ [TRANSLATION_PREFIX + key]: flat.get(from)!.get(key) });
    }
  }
  byLanguage.set(language, entries);
  return entries;
}

/** Every key a template's languages give, each once, without the `$`. */
export function translationKeys(template: unknown): string[] {
  const block = languageBlock(template);
  if (!block) return [];
  const keys = new Set<string>();
  for (const texts of Object.values(block)) for (const key of flattenTexts(texts).keys()) keys.add(key);
  return [...keys];
}

/**
 * Child over parent, language by language and key by key (`extends:`): the parent's texts
 * the child does not write are kept, and a text both write is the child's.
 */
export function mergeLanguages(parent: unknown, child: unknown): unknown {
  if (!isMapping(child)) return child === undefined ? parent : child;
  if (!isMapping(parent)) return child;
  const deep = (under: any, over: any): any => {
    if (!isMapping(over) || !isMapping(under)) return over;
    const out: Record<string, any> = { ...under };
    for (const [key, value] of Object.entries(over)) {
      if (key === '__proto__') continue;
      out[key] = deep(under[key], value);
    }
    return out;
  };
  return deep(parent, child);
}

// `[[$key]]`, or `[[$key|steps]]`, with no placeholder inside it.
const LOOKUP = /\[\[(\$[^|[\]?]+)((?:\|[^[\]]*?)?)(\?)?\]\]/g;

/** Whether some text in this value asks for a translation. */
export function holdsLookup(value: unknown): boolean {
  if (typeof value === 'string') return value.includes(`[[${TRANSLATION_PREFIX}`);
  const json = JSON.stringify(value);
  return typeof json === 'string' && json.includes(`[[${TRANSLATION_PREFIX}`);
}

/**
 * Text a person reads rather than a card is built from - a variable's label, a template's
 * description - with each lookup in it put in the viewer's language, its steps applied. A
 * key the template has no text for is left as written, so the author sees what is missing.
 */
export function translateText(text: string, template: unknown, hass?: any): string {
  if (typeof text !== 'string' || !text.includes(`[[${TRANSLATION_PREFIX}`)) return text;
  const texts = new Map<string, unknown>();
  for (const entry of translationEntries(template, hassLanguage(hass))) {
    const [key] = Object.keys(entry);
    texts.set(key, entry[key]);
  }
  return text.replace(LOOKUP, (match: string, name: string, chain: string, optional: string | undefined) => {
    if (!texts.has(name)) return optional ? '' : match;
    const value = texts.get(name);
    if (!chain) return typeof value === 'string' ? value : JSON.stringify(value);
    const out = applyTransform(chain.slice(1), value, hass);
    return out === undefined ? match : out;
  });
}

// What a declaration says to whoever fills it in; the rest of it is read by the card.
const DECLARATION_TEXT_KEYS = ['label', 'description', 'helper', 'group'];

function translateDeep(value: any, template: unknown, hass: any): any {
  if (typeof value === 'string') return translateText(value, template, hass);
  if (Array.isArray(value)) return value.map((each) => translateDeep(each, template, hass));
  if (isMapping(value)) {
    const out: Record<string, any> = {};
    for (const [key, inner] of Object.entries(value)) out[key] = translateDeep(inner, template, hass);
    return out;
  }
  return value;
}

function translateDeclaration(declaration: any, template: unknown, hass: any): any {
  if (!isMapping(declaration)) return declaration;
  const out: Record<string, any> = { ...declaration };
  for (const key of DECLARATION_TEXT_KEYS) {
    if (typeof out[key] === 'string') out[key] = translateText(out[key], template, hass);
  }
  // A select's options carry labels of their own.
  if (out.selector !== undefined) out.selector = translateDeep(out.selector, template, hass);
  return out;
}

/**
 * A template as an editor shows it to the person filling it in: its description, its
 * variables' labels, descriptions and option labels, and its examples' names in their
 * language. What the card builds is left alone - the build does its own lookups, with the
 * card's values to hand - and so is the `language:` block. The same template comes back
 * when there is nothing to translate.
 */
export function translatedForDisplay<T extends TemplateConfig | undefined>(template: T, hass?: any): T {
  if (!isMapping(template) || !languageBlock(template)) return template;
  const out: any = { ...template };
  if (typeof out.description === 'string') out.description = translateText(out.description, template, hass);
  const declared = out.variables;
  if (Array.isArray(declared)) {
    out.variables = declared.map((each: any) => translateDeclaration(each, template, hass));
  } else if (isMapping(declared)) {
    // The mapping form (#223): an object is the whole declaration, anything else its default.
    const mapped: Record<string, any> = {};
    for (const [name, value] of Object.entries(declared)) mapped[name] = translateDeclaration(value, template, hass);
    out.variables = mapped;
  }
  const examples = out.examples;
  const named = (example: any): any =>
    isMapping(example) && typeof example.name === 'string' && 'values' in example
      ? { ...example, name: translateText(example.name, template, hass) }
      : example;
  if (Array.isArray(examples)) out.examples = examples.map(named);
  else if (isMapping(examples)) out.examples = named(examples);
  return out as T;
}

/** Every template of a set, as the editors show them (see translatedForDisplay). */
export function translatedTemplates(
  templates: Record<string, TemplateConfig>,
  hass?: any,
): Record<string, TemplateConfig> {
  if (!Object.values(templates).some((template) => languageBlock(template))) return templates;
  const out: Record<string, TemplateConfig> = Object.assign(Object.create(null), templates);
  for (const [name, template] of Object.entries(templates)) out[name] = translatedForDisplay(template, hass);
  return out;
}
