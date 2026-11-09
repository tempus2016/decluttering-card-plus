import { TemplateConfig } from './types';
import {
  conditionTarget,
  orTarget,
  quotedText,
  ALERTS_NAME,
  ESCAPE,
  getDeclarations,
  isWellFormedCondition,
  normaliseVariables,
  POSITION_NAMES,
  TEMPLATE_PLACEHOLDERS,
  templateDefaults,
  variableName,
  visibilityConditions,
} from './variables';
import { closestTemplate, closestStep, knownFunctionNames, knownStep } from './closest';
import { FUNCTION_VALUE, functionParameters, isFunctionTemplate } from './functions';
import { ENTRIES_STEP, isBuiltinStepName, REGISTRY_STEP, resolveVariables, variableValues } from './variables';
import { isRegistrySource, REGISTRY_KEYS, SOURCE_KEYS } from './registry';

export { closestStep, knownStep };
import { structureNames } from './structure';
import { unknownHidden } from './card-editor/hide';
import { CHECK_KEYS, CHECKS_KEY, checkLevel, conditionStep } from './checks';
import { strictProblems } from './strict';
import { splitDeclutteringKeys, withoutRepeatContent } from './page-body';
import {
  flattenTexts,
  isTranslationName,
  LANGUAGE_KEY,
  languageBlock,
  TRANSLATION_PREFIX,
  translationKeys,
} from './translations';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A placeholder that is wrong is not an error anywhere: the card renders, the brackets
 * stay visible, and the console says something once the card is on a dashboard. While the
 * template is being written is the moment that is cheapest to fix, so the template editor
 * reads the placeholders as they are typed and says what will not work.
 *
 * Everything here is advice. Nothing stops a save - a template is often half-written.
 */

export interface LintFinding {
  /** `warning` for what will not work as written, `info` for what probably needs a look. */
  level: 'warning' | 'info';
  /** The locale key of the message. */
  key: string;
  params: Record<string, string>;
  /** Where in the template, written the way a person would point at it: `card.entities[0].name`. */
  path: string;
}

// The parts of a template that are substituted into, and so the only places a placeholder
// does anything. A description or a label that mentions `[[name]]` is prose.
const LINTED_KEYS = [
  'card',
  'badge',
  'row',
  'element',
  'group',
  'style',
  'let',
  'default',
  'grid_options',
  'name',
  'alert',
  // A function template's result (#307).
  'function',
];

// A page template's whole dashboard (idea 33), read apart from the rest: see lintTemplate.
const PAGE_KEY = 'dashboard';

// Innermost placeholders: no bracket inside. A lookup like `[[colours.[[level]]]]` is read
// from the inside out, the inner one standing in as a plain word for the outer.
const INNERMOST = '\\[\\[([^[\\]]*)\\]\\]';

// What an inner placeholder becomes while the one around it is read.
const STAND_IN = '_';

const DEFAULT_STEP = 'default:';
const OR_STEP = 'or:';

/** The variable an `or:` or `if:` step reads, or undefined for any other step. */
function stepTarget(step: string): string | undefined {
  // `or:"text"` stands in with the text and reads no variable (#398).
  if (step.startsWith(OR_STEP)) return orTarget(step);
  return conditionTarget(step);
}

/** `[[` and `]]` counted in order: one closing with nothing open is stray, one never closed is unclosed. */
function bracketBalance(text: string): { unclosed: boolean; stray: boolean } {
  let depth = 0;
  let stray = false;
  for (let i = 0; i < text.length - 1; i += 1) {
    const pair = text.slice(i, i + 2);
    if (pair === '[[') {
      depth += 1;
      i += 1;
    } else if (pair === ']]') {
      if (depth === 0) stray = true;
      else depth -= 1;
      i += 1;
    }
  }
  return { unclosed: depth > 0, stray };
}

interface Scan {
  findings: LintFinding[];
  // Every variable a placeholder reads by name, with where it was first read.
  heads: Map<string, string>;
  // Every variable an `or:` or `if:` names, with the placeholder and where.
  targets: { name: string; placeholder: string; path: string }[];
  // The templates that can be used as steps (#307).
  functions: readonly string[];
  // Every `[[$key]]` text looked up (#392), with the placeholder and where.
  lookups: { key: string; placeholder: string; path: string }[];
  // Every `repeat:` over a named source, with what follows it (#429).
  repeats?: { source: string; after: string[]; placeholder: string; path: string }[];
}

function scanText(text: string, path: string, scan: Scan): void {
  if (!text.includes('[[') && !text.includes(']]')) return;
  const balance = bracketBalance(text);
  if (balance.unclosed) scan.findings.push({ level: 'warning', key: 'lint.unclosed', params: {}, path });
  if (balance.stray) scan.findings.push({ level: 'warning', key: 'lint.stray_close', params: {}, path });

  let rest = text;
  // A lookup nests one level per pass; past a handful nobody is writing it on purpose.
  for (let pass = 0; pass < 5; pass += 1) {
    let found = false;
    rest = rest.replace(new RegExp(INNERMOST, 'g'), (_match, inside: string) => {
      found = true;
      // `[[!name]]` is the brackets written out, not a placeholder.
      if (!inside.startsWith(ESCAPE)) scanPlaceholder(inside, path, scan);
      return STAND_IN;
    });
    if (!found) break;
  }
}

function scanPlaceholder(inside: string, path: string, scan: Scan): void {
  // The optional marker goes against the brackets, and an argument swallows it if the
  // chain ends in one - either way it is not part of a name.
  const bare = inside.endsWith('?') ? inside.slice(0, -1) : inside;
  const [rawHead, ...steps] = bare.split('|');
  const placeholder = `[[${inside}]]`;
  const head = rawHead.endsWith('?') ? rawHead.slice(0, -1) : rawHead;
  // `[[room.light]]` reads `room`; the part after the dot is a key of its value.
  // A quoted name is text, not a variable (#398), and its dots are the text's own.
  // A `$` name is one of the template's own texts (#392): a key of `language:`, not a variable.
  if (isTranslationName(head)) scan.lookups.push({ key: head.slice(1), placeholder, path });
  const name = quotedText(head) === undefined && !isTranslationName(head) ? head.split('.')[0] : undefined;
  if (name && name !== STAND_IN && !scan.heads.has(name)) scan.heads.set(name, path);

  let filled = false;
  // A condition after a `with:` or `repeat:` reads the copy's own values (#429), which are not the template's.
  let inCopy = false;
  const at = steps.findIndex((step) => /^repeat:./.test(step));
  if (at !== -1 && name) {
    (scan.repeats ??= []).push({
      source: steps[at].slice('repeat:'.length),
      after: steps.slice(at + 1),
      placeholder,
      path,
    });
  }
  for (const step of steps) {
    if (!knownStep(step, scan.functions)) {
      const closest = closestStep(step, scan.functions);
      scan.findings.push({
        level: 'warning',
        key: 'lint.unknown_step',
        params: closest ? { step, placeholder, closest } : { step, placeholder },
        path,
      });
      continue;
    }
    const fallback = step.startsWith(DEFAULT_STEP) || step.startsWith(OR_STEP);
    // A `default:` with text in it always fills the gap, so nothing after it ever runs.
    if (fallback && filled) {
      scan.findings.push({ level: 'warning', key: 'lint.after_default', params: { step, placeholder }, path });
    }
    if (step.startsWith(DEFAULT_STEP) && step.length > DEFAULT_STEP.length) filled = true;
    const target = stepTarget(step);
    if (target && target !== STAND_IN && !(inCopy && conditionTarget(step))) {
      scan.targets.push({ name: target, placeholder, path });
    }
    if (/^(?:with|repeat)(?::|$)/.test(step)) inCopy = true;
  }
}

/*
 * A mapping a `repeat:` runs over that has a registry source's keys - `area`, `domain` - is read
 * as a source, and its other keys are then options nobody asked for (#429). Both kinds in one
 * mapping is most likely a mapping of your own that happens to use one of those names.
 */
function lintMixedSources(template: TemplateConfig, scan: Scan, findings: LintFinding[]): void {
  if (!scan.repeats?.length) return;
  const values = variableValues(resolveVariables(undefined, template));
  for (const repeat of scan.repeats) {
    if (repeat.after.includes(ENTRIES_STEP) || repeat.after.includes(REGISTRY_STEP)) continue;
    const source = values[repeat.source];
    if (!isRegistrySource(source)) continue;
    const keys = Object.keys(source as object);
    const filters = keys.filter((key) => SOURCE_KEYS.includes(key));
    const others = keys.filter((key) => !REGISTRY_KEYS.includes(key));
    if (!filters.length || !others.length) continue;
    findings.push({
      level: 'warning',
      key: 'lint.mixed_repeat_source',
      params: {
        placeholder: repeat.placeholder,
        name: repeat.source,
        filters: filters.join(', '),
        others: others.join(', '),
      },
      path: repeat.path,
    });
  }
}

function walk(value: unknown, path: string, scan: Scan): void {
  if (typeof value === 'string') {
    scanText(value, path, scan);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, scan));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      // Substitution works on the JSON text, so a placeholder in a key is substituted too.
      scanText(key, path, scan);
      walk(item, path ? `${path}.${key}` : key, scan);
    }
  }
}

// `[[$key]]` and `[[$key|steps]]` in prose, which is otherwise not read for placeholders.
const LOOKUP_IN_PROSE = /\[\[(\$[^|[\]?]+)[^[\]]*\]\]/g;

/*
 * The prose a person reads - a description, a variable's label - is no place for a variable,
 * but it is where a translated text is most at home (#392), so it is read for those alone.
 */
function scanProse(value: unknown, path: string, scan: Scan): void {
  if (typeof value !== 'string' || !value.includes('[[$')) return;
  const pattern = new RegExp(LOOKUP_IN_PROSE.source, 'g');
  for (let match = pattern.exec(value); match !== null; match = pattern.exec(value)) {
    scan.lookups.push({ key: match[1].slice(1), placeholder: match[0], path });
  }
}

const PROSE_DECLARATION_KEYS = ['label', 'description', 'helper', 'group'];

function scanTemplateProse(template: TemplateConfig, scan: Scan): void {
  scanProse((template as any).description, 'description', scan);
  getDeclarations(template).forEach((declaration, index) => {
    for (const key of PROSE_DECLARATION_KEYS) scanProse((declaration as any)[key], `variables[${index}].${key}`, scan);
  });
  const examples = (template as any).examples;
  (Array.isArray(examples) ? examples : examples ? [examples] : []).forEach((example: any, index: number) => {
    scanProse(example?.name, `examples[${index}].name`, scan);
  });
}

/*
 * The `language:` block itself (#392): a mapping of languages, each a mapping of texts, every
 * language giving every key - one that leaves a key out shows another language's text for it,
 * which is worth knowing before somebody reading that language sees it.
 */
function lintLanguages(template: TemplateConfig, known: string[], scan: Scan, findings: LintFinding[]): void {
  const written = (template as any)[LANGUAGE_KEY];
  if (written !== undefined && written !== null) {
    if (typeof written !== 'object' || Array.isArray(written)) {
      findings.push({ level: 'warning', key: 'lint.language_not_mapping', params: {}, path: LANGUAGE_KEY });
    } else {
      for (const [language, texts] of Object.entries(written)) {
        if (!texts || typeof texts !== 'object' || Array.isArray(texts)) {
          findings.push({
            level: 'warning',
            key: 'lint.language_entry_not_mapping',
            params: { language },
            path: `${LANGUAGE_KEY}.${language}`,
          });
        }
      }
    }
  }
  const block = languageBlock(template);
  const keys = translationKeys(template);
  if (block && Object.keys(block).length > 1) {
    for (const [language, texts] of Object.entries(block)) {
      const has = flattenTexts(texts);
      const missing = keys.filter((key) => !has.has(key));
      if (missing.length) {
        findings.push({
          level: 'warning',
          key: 'lint.translation_missing_in',
          params: { language, keys: missing.join(', ') },
          path: `${LANGUAGE_KEY}.${language}`,
        });
      }
    }
  }
  const given = new Set([...keys, ...known.filter(isTranslationName).map((name) => name.slice(1))]);
  const said = new Set<string>();
  for (const lookup of scan.lookups) {
    if (given.has(lookup.key) || said.has(lookup.key)) continue;
    said.add(lookup.key);
    const closest = closestTemplate(lookup.key, [...given]);
    findings.push({
      level: 'warning',
      key: 'lint.translation_unknown',
      params: closest
        ? { key: lookup.key, placeholder: lookup.placeholder, closest }
        : { key: lookup.key, placeholder: lookup.placeholder },
      path: lookup.path,
    });
  }
}

/**
 * The names a template gives a value of its own: declared, defaulted, or worked out in `let:` -
 * and its `language:` texts, each as the `$key` that looks it up (#392).
 */
export function definedNames(template: TemplateConfig | undefined): string[] {
  const names = new Set<string>(translationKeys(template).map((key) => TRANSLATION_PREFIX + key));
  for (const declaration of getDeclarations(template)) names.add(declaration.name);
  for (const entry of [...normaliseVariables(templateDefaults(template)), ...normaliseVariables(template?.let)]) {
    const name = variableName(entry);
    if (name !== undefined) names.add(name);
  }
  return [...names];
}

/*
 * `checks:` (#389): a list of mappings, each with a condition this card can read, a level it
 * knows, and nothing it would not read. Placeholders in a message or a condition are linted
 * like any others; a condition written the show_if way names a variable that has to exist.
 */
function lintChecks(template: TemplateConfig, scan: Scan): void {
  const written = (template as any)[CHECKS_KEY];
  if (written === undefined || written === null) return;
  if (!Array.isArray(written)) {
    scan.findings.push({ level: 'warning', key: 'lint.checks_not_list', params: {}, path: CHECKS_KEY });
    return;
  }
  written.forEach((check: unknown, index: number) => {
    const path = `${CHECKS_KEY}[${index}]`;
    if (!check || typeof check !== 'object' || Array.isArray(check)) {
      scan.findings.push({ level: 'warning', key: 'lint.check_not_mapping', params: {}, path });
      return;
    }
    const entry = check as Record<string, unknown>;
    walk(entry.message, `${path}.message`, scan);
    for (const key of Object.keys(entry)) {
      if (!CHECK_KEYS.includes(key)) {
        scan.findings.push({ level: 'warning', key: 'lint.check_key_unknown', params: { key }, path });
      }
    }
    if (checkLevel(entry.level) === undefined) {
      scan.findings.push({
        level: 'warning',
        key: 'lint.check_level_unknown',
        params: { level: String(entry.level) },
        path: `${path}.level`,
      });
    }
    const condition = entry.condition;
    if (condition === undefined || condition === null || condition === '') {
      scan.findings.push({ level: 'warning', key: 'lint.check_no_condition', params: {}, path });
      return;
    }
    if (typeof condition === 'boolean' || typeof condition === 'number') return;
    if (typeof condition !== 'string') {
      scan.findings.push({
        level: 'warning',
        key: 'lint.check_condition_malformed',
        params: { condition: JSON.stringify(condition) },
        path: `${path}.condition`,
      });
      return;
    }
    const step = conditionStep(condition);
    if (step === undefined) {
      walk(condition, `${path}.condition`, scan);
      return;
    }
    if (/^(?:true|false)$/i.test(condition.trim())) return;
    if (!isWellFormedCondition(step)) {
      scan.findings.push({
        level: 'warning',
        key: 'lint.check_condition_malformed',
        params: { condition },
        path: `${path}.condition`,
      });
      return;
    }
    const name = conditionTarget(step);
    if (name) {
      scan.targets.push({
        name: name.split('.')[0],
        placeholder: `condition: ${condition}`,
        path: `${path}.condition`,
      });
    }
  });
}

/**
 * What is wrong, or probably wrong, with the placeholders in a template: brackets that do
 * not pair up, a step in a chain nobody has heard of, an `or:` that a `default:` before it
 * makes unreachable, an `if:` or `or:` naming a variable the template never mentions
 * anywhere else, and - as information rather than a warning - variables read but neither
 * declared nor given a default, which a card then has to set.
 *
 * `known` is names the template gets from elsewhere: a parent it extends, the dashboard's
 * shared declarations and defaults. The editor passes them in; they are not this
 * template's to declare.
 */
export function lintTemplate(
  template: TemplateConfig | undefined,
  known: string[] = [],
  // The template's own name, and the dashboard's templates that can be used as steps (#307),
  // when the caller knows them; the functions default to the dashboard last read.
  options: { name?: string; functions?: readonly string[] } = {},
): LintFinding[] {
  if (!template || typeof template !== 'object') return [];
  const functions = options.functions ?? knownFunctionNames();
  const scan: Scan = { findings: [], heads: new Map(), targets: [], functions, lookups: [] };
  scanTemplateProse(template, scan);
  for (const key of LINTED_KEYS) {
    const value = (template as any)[key];
    if (value !== undefined) walk(value, key, scan);
  }
  if ((template as any)[PAGE_KEY] !== undefined) {
    // The page's own template keys are definitions, each linted where it is used. A repeat's
    // content is filled for each copy from items nobody can name here - `[[entity]]`,
    // `[[area]]` - so it is read for mistakes in how it is written, not for whose names it uses.
    const { rest } = splitDeclutteringKeys((template as any)[PAGE_KEY]);
    walk(withoutRepeatContent(rest), PAGE_KEY, scan);
    const inRepeats: Scan = { findings: [], heads: new Map(), targets: [], functions, lookups: [] };
    walk(rest, PAGE_KEY, inRepeats);
    scan.findings.push(...inRepeats.findings);
  }
  getDeclarations(template).forEach((declaration, index) => {
    if (declaration.default !== undefined) walk(declaration.default, `variables[${index}].default`, scan);
    // show_if and hide_if (#347) are `if:` conditions without the `if:`, not placeholders.
    for (const key of ['show_if', 'hide_if'] as const) {
      const path = `variables[${index}].${key}`;
      for (const step of visibilityConditions(declaration, key)) {
        const written = step.slice('if:'.length);
        if (!isWellFormedCondition(step)) {
          scan.findings.push({
            level: 'warning',
            key: 'lint.condition_malformed',
            params: { key, condition: written },
            path,
          });
          continue;
        }
        const name = conditionTarget(step);
        // A dotted name reads a key of a mapping variable, which is what has to exist.
        if (name) scan.targets.push({ name: name.split('.')[0], placeholder: `${key}: ${written}`, path });
      }
    }
  });

  lintChecks(template, scan);

  /*
   * A function template (#307) is given its value and its parameters by the step that calls
   * it. Named after a built-in step it is never called at all: the built-in wins.
   */
  const isFunction = isFunctionTemplate(template);
  if (isFunction && options.name && isBuiltinStepName(options.name)) {
    scan.findings.push({
      level: 'warning',
      key: 'lint.function_shadowed',
      params: { name: options.name },
      path: 'function',
    });
  }
  if (!isFunction && (template as any).parameters !== undefined) {
    scan.findings.push({ level: 'info', key: 'lint.parameters_without_function', params: {}, path: 'parameters' });
  }

  // A name a `with:` or `repeat:` gives the body it fills in is set, one copy at a time.
  // `__alerts__` is set by every build of a template (#389).
  const defined = new Set([
    ...definedNames(template),
    ...known,
    ...POSITION_NAMES,
    ...TEMPLATE_PLACEHOLDERS,
    ...structureNames(template),
    ALERTS_NAME,
    ...(isFunction ? [FUNCTION_VALUE, ...functionParameters(template)] : []),
  ]);
  const findings = [...scan.findings];
  lintLanguages(template, known, scan, findings);
  lintMixedSources(template, scan, findings);

  // `[[room.light]]` reaches into `room`, so a condition on `room.light` names something real
  // once `room` is - a choose selector's `dims.active_choice` most of all (#346).
  const isKnown = (name: string): boolean => defined.has(name) || scan.heads.has(name);
  const reachable = (name: string): boolean =>
    isKnown(name) || name.split('.').some((_, i, parts) => i > 0 && isKnown(parts.slice(0, i).join('.')));
  for (const target of scan.targets) {
    if (reachable(target.name)) continue;
    const closest = closestTemplate(target.name, [...defined, ...scan.heads.keys()]);
    findings.push({
      level: 'warning',
      key: 'lint.target_unknown',
      params: closest
        ? { name: target.name, placeholder: target.placeholder, closest }
        : { name: target.name, placeholder: target.placeholder },
      path: target.path,
    });
  }

  const undeclared = [...scan.heads.entries()].filter(([name]) => !defined.has(name));
  if (undeclared.length) {
    findings.push({
      level: 'info',
      key: 'lint.undeclared',
      // Several names are read in several places, so each carries its own and the finding none.
      params: {
        names: undeclared.map(([name, path]) => (undeclared.length > 1 ? `${name} (${path})` : name)).join(', '),
      },
      path: undeclared.length > 1 ? '' : undeclared[0][1],
    });
  }

  // A part of the editor named wrong is never hidden, and nothing else would say so.
  for (const unknown of unknownHidden(template)) {
    findings.push({ level: 'warning', key: 'lint.editor_hide_unknown', params: { ...unknown }, path: 'editor_hide' });
  }

  // A `strict:` level written wrong is left to the next place that sets it (#390), so it would quietly do nothing.
  for (const problem of strictProblems((template as any).strict)) {
    findings.push({ level: 'warning', key: 'lint.strict_unknown', params: problem, path: 'strict' });
  }

  // The same mistake written twice in one place is one thing to fix.
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const id = JSON.stringify([finding.key, finding.params, finding.path]);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
