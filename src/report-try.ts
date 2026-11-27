import { PlaygroundResult, tryPlaceholderWith } from './playground';
import { redact, SECRET_NAME, secretValues } from './report';
import { BuildTrace, ItemTrace, itemTitle, SectionEvaluate, TraceReport } from './trace';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Try a placeholder in the report (#376): type one in and see what it gives, read against
 * one build of the report - the card, a copy of a repeat, a card nested inside, or one item
 * template's fill. Which one is the scope: the same name can mean something different in
 * each, and that is often the very thing being chased.
 */
export interface TryScope {
  label: string;
  evaluate: SectionEvaluate;
  /** An item template's fill: its values are its variables. */
  values?: Record<string, unknown>[];
  /** Placeholders to offer: each variable on its own, then each the build met. */
  offered: string[];
}

/** Every build in the report a placeholder can be tried against, the card's own first. */
export function tryScopes(reports: TraceReport[], hass?: any): TryScope[] {
  const scopes: TryScope[] = [];
  const offer = (names: string[], trace: BuildTrace): string[] => [
    ...new Set([...names.map((name) => `[[${name}]]`), ...trace.placeholders.keys()]),
  ];
  const items = (list: ItemTrace[] | undefined, base: string, evaluate: SectionEvaluate): void => {
    for (const item of list ?? []) {
      const label = `${base} › ${itemTitle(item, hass)}`;
      const values = [...(item.trace.values ?? [])].map(([name, value]) => ({ [name]: value }));
      scopes.push({
        label,
        evaluate,
        values,
        offered: offer([...(item.trace.values ?? []).keys()].map(String), item.trace),
      });
      items(item.trace.items, label, evaluate);
    }
  };
  for (const report of reports) {
    const card = [...report.chain, report.label].join(' › ');
    for (const section of report.sections) {
      if (!section.evaluate) continue;
      const label = section.label ? `${card} › ${section.label}` : card;
      const names = section.variables.map((row) => row.variable);
      scopes.push({ label, evaluate: section.evaluate, offered: offer(names, section.trace) });
      items(section.trace.items, label, section.evaluate);
    }
  }
  return scopes;
}

// Every variable a piece of text asks for by name, in a nested placeholder too.
const ASKED_FOR = /\[\[\s*([^[\]|?]+)/g;
// And every one a step reads: `or:password`, `if:token=x`, `unless:!pin`, `merge:credentials`.
const STEP_READS = /\|\s*(?:or|if|unless|merge):\s*!?([^[\]|?=!<>]+)/g;

/** Whether the expression reads a variable named like a secret, as a name, a key of one, or a step's target. */
function asksForSecret(expression: string): boolean {
  const names: string[] = [];
  for (const pattern of [ASKED_FOR, STEP_READS]) {
    pattern.lastIndex = 0;
    for (let found = pattern.exec(expression); found; found = pattern.exec(expression)) names.push(found[1]);
  }
  return names.some((name) => name.split('.').some((part) => SECRET_NAME.test(part.trim())));
}

/*
 * What the box shows for one placeholder in one scope, redacted as the report is: a secret
 * named in it hides every value outright - a step that only changes its case would still say
 * it - and anything else has the report's own rules run over it, the known secrets included,
 * so a variable built out of a password does not give it away either.
 */
export function tryInReport(
  scope: TryScope,
  expression: string,
  reports: TraceReport[],
  redacting: boolean,
): PlaygroundResult {
  const result = tryPlaceholderWith(
    (content, onMissing) => scope.evaluate(content, onMissing, scope.values),
    expression,
  );
  if (!redacting) return result;
  const secret = asksForSecret(expression);
  const secrets = secret ? [] : secretValues(reports);
  const hide = (value: unknown): unknown => {
    if (value === undefined) return value;
    if (secret) return '<redacted>';
    if (typeof value === 'string') return redact(value, secrets);
    if (value === null) return value;
    // A number can be a secret too: a PIN of 1234 is in the known secrets as text.
    const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const cleaned = redact(text, secrets);
    return cleaned === text ? value : cleaned;
  };
  return {
    ...result,
    steps: result.steps.map((step) => ({ ...step, value: hide(step.value) })),
    whole: { ...result.whole, value: hide(result.whole.value) },
    inText: result.inText === undefined ? undefined : (hide(result.inText) as string),
  };
}
