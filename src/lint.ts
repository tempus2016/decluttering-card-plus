import { TemplateConfig } from './types';
import {
  conditionTarget,
  ESCAPE,
  getDeclarations,
  normaliseVariables,
  POSITION_NAMES,
  templateDefaults,
  variableName,
} from './variables';
import { closestTemplate, closestStep, knownStep } from './closest';

export { closestStep, knownStep };
import { structureNames } from './structure';
import { unknownHidden } from './card-editor/hide';

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
const LINTED_KEYS = ['card', 'badge', 'row', 'element', 'group', 'style', 'let', 'default', 'grid_options', 'name'];

// Innermost placeholders: no bracket inside. A lookup like `[[colours.[[level]]]]` is read
// from the inside out, the inner one standing in as a plain word for the outer.
const INNERMOST = '\\[\\[([^[\\]]*)\\]\\]';

// What an inner placeholder becomes while the one around it is read.
const STAND_IN = '_';

const DEFAULT_STEP = 'default:';
const OR_STEP = 'or:';

/** The variable an `or:` or `if:` step reads, or undefined for any other step. */
function stepTarget(step: string): string | undefined {
  if (step.startsWith(OR_STEP)) return step.slice(OR_STEP.length);
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
  const name = head.split('.')[0];
  if (name && name !== STAND_IN && !scan.heads.has(name)) scan.heads.set(name, path);

  let filled = false;
  for (const step of steps) {
    if (!knownStep(step)) {
      const closest = closestStep(step);
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
    if (target && target !== STAND_IN) scan.targets.push({ name: target, placeholder, path });
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

/** The names a template gives a value of its own: declared, defaulted, or worked out in `let:`. */
export function definedNames(template: TemplateConfig | undefined): string[] {
  const names = new Set<string>();
  for (const declaration of getDeclarations(template)) names.add(declaration.name);
  for (const entry of [...normaliseVariables(templateDefaults(template)), ...normaliseVariables(template?.let)]) {
    const name = variableName(entry);
    if (name !== undefined) names.add(name);
  }
  return [...names];
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
export function lintTemplate(template: TemplateConfig | undefined, known: string[] = []): LintFinding[] {
  if (!template || typeof template !== 'object') return [];
  const scan: Scan = { findings: [], heads: new Map(), targets: [] };
  for (const key of LINTED_KEYS) {
    const value = (template as any)[key];
    if (value !== undefined) walk(value, key, scan);
  }
  getDeclarations(template).forEach((declaration, index) => {
    if (declaration.default !== undefined) walk(declaration.default, `variables[${index}].default`, scan);
  });

  // A name a `with:` or `repeat:` gives the body it fills in is set, one copy at a time.
  const defined = new Set([...definedNames(template), ...known, ...POSITION_NAMES, ...structureNames(template)]);
  const findings = [...scan.findings];

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

  // The same mistake written twice in one place is one thing to fix.
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const id = JSON.stringify([finding.key, finding.params, finding.path]);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
