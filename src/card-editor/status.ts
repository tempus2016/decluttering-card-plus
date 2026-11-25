/*
 * The card editor's order (the UX pass): the variables straight after the picker, with how
 * many of the required ones are set, and everything the diagnostics have to say folded into
 * one line under the preview. Pure parts: what to count, and how the line reads.
 */

export interface DeclaredLike {
  name: string;
  required?: boolean;
}

/**
 * How many of the template's required variables have a value, out of how many it has. A
 * field the template hides is not counted either way, as the diagnostics do not count it.
 */
export function requiredProgress(
  declarations: DeclaredLike[],
  hidden: Set<string>,
  unset: string[],
): { set: number; total: number } {
  const required = declarations.filter((each) => each.required === true && !hidden.has(each.name));
  const missing = new Set(unset);
  return { set: required.filter((each) => !missing.has(each.name)).length, total: required.length };
}

export interface StatusCounts {
  /** Required variables with no value: what holds the preview back. */
  toFill: number;
  errors: number;
  warnings: number;
  /** The diagnostics that are information only. */
  notes: number;
}

/** The parts of the status line, in the order they are read, as locale keys and counts. Nothing to say, no parts. */
export function statusParts(counts: StatusCounts): { key: string; count: number }[] {
  const parts: { key: string; count: number }[] = [];
  const add = (stem: string, count: number): void => {
    if (count > 0) parts.push({ key: `editor.status.${stem}_${count === 1 ? 'one' : 'many'}`, count });
  };
  add('fill', counts.toFill);
  add('error', counts.errors);
  add('warning', counts.warnings);
  add('note', counts.notes);
  return parts;
}

/** How serious the line is, for its colour: the worst thing it stands for. */
export function statusLevel(counts: StatusCounts): 'error' | 'warning' | 'info' | undefined {
  if (counts.errors) return 'error';
  if (counts.toFill || counts.warnings) return 'warning';
  return counts.notes ? 'info' : undefined;
}

/** The names left to fill: those the diagnostics found unset, and those the preview's build was held for. */
export function namesToFill(diagnosed: string[], held: string[]): string[] {
  return [...new Set([...diagnosed, ...held])];
}

/** Whether the card repeats: then Repeat is part of what the card is, and stays out of Advanced. */
export function repeatsNow(config: Record<string, unknown> | undefined): boolean {
  return (
    !!config &&
    (config.for_each !== undefined ||
      config.for_each_from !== undefined ||
      config.empty !== undefined ||
      config.template_by_domain !== undefined)
  );
}
