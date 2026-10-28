import { KNOWN_PARAM_STEPS, KNOWN_STEPS } from './variables';

/*
 * Working out what somebody meant: the template name a typo was close to, and the
 * placeholder step. Kept apart from templates.ts and lint.ts, which both need it, so that
 * deep-replace.ts can name an unknown step in the console without importing either of them
 * and closing a loop between the modules.
 */

/*
 * How many single-character edits turn one name into the other, capped: past a couple of
 * edits two names are not a typo of each other, and stopping early keeps a dashboard full
 * of templates cheap to check.
 */
function editDistance(a: string, b: string, cap: number): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    for (let j = 1; j <= b.length; j += 1) {
      row[j] = a[i - 1] === b[j - 1] ? previous[j - 1] : 1 + Math.min(previous[j - 1], previous[j], row[j - 1]);
    }
    if (Math.min(...row) > cap) return cap + 1;
    previous = row;
  }
  return previous[b.length];
}

/**
 * The name somebody probably meant, out of the ones that exist. A missing template is
 * nearly always a typo or a rename, and the card already knows every name there is - so
 * saying "did you mean" turns a hunt through the dashboard into a glance.
 */
export function closestTemplate(wanted: string, available: string[]): string | undefined {
  if (!wanted) return undefined;
  // Two edits on a short name, three on a long one: enough for a transposition and a
  // missing letter, not enough to start pointing at unrelated templates.
  const cap = wanted.length > 8 ? 3 : 2;

  let best: string | undefined;
  let bestScore = cap + 1;
  for (const name of available) {
    if (name === wanted) return undefined;
    const score = editDistance(wanted.toLowerCase(), name.toLowerCase(), cap);
    if (score < bestScore) {
      bestScore = score;
      best = name;
    }
  }
  return bestScore <= cap ? best : undefined;
}

/** Whether a step is one the chain grammar knows, by name or by its `name:` prefix. */
export function knownStep(step: string): boolean {
  if (KNOWN_STEPS.includes(step)) return true;
  const colon = step.indexOf(':');
  return colon > 0 && KNOWN_PARAM_STEPS.includes(step.slice(0, colon));
}

/**
 * The known step a mistyped one was probably meant to be: `slgu` is `slug`, and `defualt:x`
 * is `default:x` - a step with an argument is matched by its name and keeps its argument.
 */
export function closestStep(step: string): string | undefined {
  const colon = step.indexOf(':');
  if (colon > 0) {
    const name = closestTemplate(step.slice(0, colon), KNOWN_PARAM_STEPS);
    return name ? `${name}:${step.slice(colon + 1)}` : undefined;
  }
  return closestTemplate(step, KNOWN_STEPS);
}
