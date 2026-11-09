import { KNOWN_PARAM_STEPS, KNOWN_STEPS, RESOLVERS, VariableDeclaration } from './variables';
import { knownFunctionNames } from './closest';

/*
 * The pure parts of the code editor hooks (ideas 25 and 27): where the placeholders are in
 * a piece of text and what each one amounts to, and what to offer at the caret when `[[`,
 * `|` or a step's `:` has just been typed. The editor element draws these; nothing here
 * knows about CodeMirror.
 */

export type SpanKind = 'ok' | 'unset' | 'bad';

export interface PlaceholderSpan {
  from: number;
  to: number;
  kind: SpanKind;
  /** The placeholder as written, brackets included. */
  text: string;
  /** What to say on hover: the value it resolves to, or why it will not work. */
  message?: string;
}

// Outermost placeholders with up to two levels nested inside, escaped ones included so they can be skipped.
// One character at a time at each level, as in placeholders.ts: `[^[\]]*` inside `*` backtracks
// exponentially on a stray `[`, such as button-card JavaScript's `'test'[0]` (#403).
const CHAR = '[^[\\]]';
const ONE = `\\[\\[${CHAR}*\\]\\]`;
const TWO = `\\[\\[(?:${CHAR}|${ONE})*\\]\\]`;
const ANY = new RegExp(`\\[\\[(?:${CHAR}|${TWO})*\\]\\]`, 'g');

/**
 * Every placeholder in `text` with where it sits, judged by `resolve`: `ok` when it has a
 * value, `unset` when nothing sets it (and the brackets would stay, or the option be dropped
 * when optional), `bad` when the lint says it will not work.
 */
export function placeholderSpans(
  text: string,
  resolve: (placeholder: string) => { kind: SpanKind; message?: string },
): PlaceholderSpan[] {
  const out: PlaceholderSpan[] = [];
  ANY.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ANY.exec(text)) !== null) {
    const written = match[0];
    if (written.startsWith('[[!')) continue;
    const { kind, message } = resolve(written);
    out.push({ from: match.index, to: match.index + written.length, kind, text: written, message });
  }
  return out;
}

export interface CompletionOption {
  label: string;
  /** What the option is: a type, `let`, `dashboard`, a sample value. */
  detail?: string;
  /** Inserted in place of what was typed since the trigger; the label when absent. */
  insert?: string;
}

export interface Completion {
  /** Where the typed part being completed starts. */
  from: number;
  /** A heading for the list. */
  heading: 'variables' | 'steps' | 'values' | 'texts';
  options: CompletionOption[];
}

export interface CompletionContext {
  /** The template's own declarations. */
  variables: VariableDeclaration[];
  /** Names `let:` gives. */
  lets: string[];
  /** The dashboard's shared declarations. */
  shared: VariableDeclaration[];
  /** The template's `language:` texts (#392): each key, without its `$`, and its text in the user's language. */
  translations?: { key: string; text: string }[];
  /** For an entity-valued chain head: what each resolver gives for the example entity. */
  sample?: (step: string) => string | undefined;
}

// Steps that take an argument, offered with their colon.
const PARAM_STEPS = KNOWN_PARAM_STEPS.map((step) => `${step}:`);

// The steps most used first, then the rest alphabetically.
const FIRST_STEPS = ['default:', 'if:', 'slug', 'friendly_name', 'area', 'bool', 'upper', 'lower', 'title', 'replace:'];

/** The step list the `|` completion offers, in a useful order: the dashboard's function templates (#307) last. */
export function orderedSteps(functions: readonly string[] = knownFunctionNames()): string[] {
  const all = [...KNOWN_STEPS, ...PARAM_STEPS];
  const rest = all.filter((step) => !FIRST_STEPS.includes(step)).sort();
  const own = [...functions].filter((name) => !all.includes(name) && !all.includes(`${name}:`)).sort();
  return [...FIRST_STEPS.filter((step) => all.includes(step)), ...rest, ...own];
}

/**
 * What to offer at `pos` in `text`, or nothing when the caret is not just after `[[`, after a
 * `|` inside a placeholder, or after the `:` of a step - with whatever was typed since
 * narrowing the list.
 */
export function completionsAt(text: string, pos: number, ctx: CompletionContext): Completion | null {
  const before = text.slice(0, pos);
  const open = before.lastIndexOf('[[');
  if (open === -1) return null;
  const since = before.slice(open + 2);
  // A closed placeholder, or a newline: the caret is no longer inside one.
  if (since.includes(']]') || since.includes('\n')) return null;
  const pipe = since.lastIndexOf('|');
  if (pipe === -1) {
    // Just after `[[` and a `$`: the template's own texts (#392).
    if (/^\$[\w.-]*$/.test(since)) {
      const wanted = since.slice(1).toLowerCase();
      const texts = (ctx.translations ?? [])
        .filter((each) => each.key.toLowerCase().startsWith(wanted))
        .map((each) => ({ label: `$${each.key}`, detail: each.text }));
      return texts.length ? { from: open + 2, heading: 'texts', options: texts } : null;
    }
    // Just after `[[`: variables.
    if (!/^[\w.-]*$/.test(since)) return null;
    const typed = since.toLowerCase();
    const options: CompletionOption[] = [
      ...ctx.variables.map((each) => ({ label: each.name, detail: typeDetail(each) })),
      ...ctx.lets.map((name) => ({ label: name, detail: 'let' })),
      ...ctx.shared
        .filter((each) => !ctx.variables.some((own) => own.name === each.name))
        .map((each) => ({ label: each.name, detail: 'dashboard' })),
    ].filter((option) => option.label.toLowerCase().startsWith(typed));
    return options.length ? { from: open + 2, heading: 'variables', options } : null;
  }
  const afterPipe = since.slice(pipe + 1);
  const colon = afterPipe.indexOf(':');
  if (colon !== -1) {
    // After a step's colon: a few sample values, when the step has some.
    const step = afterPipe.slice(0, colon);
    const typedArg = afterPipe.slice(colon + 1);
    const values = argumentValues(step).filter((value) => value.startsWith(typedArg));
    return values.length
      ? { from: open + 2 + pipe + 1 + colon + 1, heading: 'values', options: values.map((label) => ({ label })) }
      : null;
  }
  if (!/^[\w-]*$/.test(afterPipe)) return null;
  const typed = afterPipe.toLowerCase();
  const options = orderedSteps()
    .filter((step) => step.toLowerCase().startsWith(typed))
    .map((step) => ({
      label: step,
      detail:
        ctx.sample && step in RESOLVERS
          ? ctx.sample(step)
          : knownFunctionNames().includes(step)
            ? 'function'
            : undefined,
    }));
  return options.length ? { from: open + 2 + pipe + 1, heading: 'steps', options } : null;
}

function typeDetail(declaration: VariableDeclaration): string {
  const type =
    declaration.type ??
    (declaration.selector && typeof declaration.selector === 'object'
      ? Object.keys(declaration.selector)[0]
      : undefined);
  const required = declaration.required ? ', required' : '';
  return `${type ?? 'any'}${required}`;
}

/** Sample arguments for the steps whose argument comes from a small set. */
export function argumentValues(step: string): string[] {
  switch (step) {
    case 'if':
      return ['other', '!other', 'mode=on', 'mode!=off'];
    case 'round':
      return ['0', '1', '2'];
    case 'switch':
      return ['on=green,off=grey,default=amber'];
    case 'pick':
      return ['name=value,icon'];
    case 'to_list':
      return ['key=name,value=entity'];
    case 'to_map':
      return ['key=name,value=icon'];
    default:
      return [];
  }
}
