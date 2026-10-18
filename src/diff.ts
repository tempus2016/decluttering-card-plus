/*
 * A unified line diff, for showing what an edit does to a card rather than only what the
 * card becomes. Two YAML documents of a card are mostly the same; the impact preview used
 * to show the "after" in full and leave the reader to spot the one line that moved, which
 * is exactly the comparison a person is worst at and a computer is best at.
 *
 * Written here rather than pulled in from npm: the card is one file with no dependencies
 * worth the name, and a longest-common-subsequence over a few hundred lines of YAML is a
 * screenful of code.
 */

export type DiffKind = 'same' | 'add' | 'remove';

export interface DiffLine {
  kind: DiffKind;
  text: string;
}

/** A run of unchanged lines left out of the view, standing in for `count` of them. */
export interface DiffSkip {
  kind: 'skip';
  count: number;
}

/*
 * Past this many cells the table would cost real memory and time on the main thread -
 * two documents of two thousand lines each - and the answer would be unreadable anyway.
 * Such a pair is shown as everything removed and everything added, which is still true.
 */
const MAX_CELLS = 4_000_000;

function splitLines(text: string): string[] {
  if (text === '') return [];
  // A trailing newline ends the last line rather than starting an empty one after it.
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * The lines of `a` and `b` in order, each marked as kept, removed from `a` or added in `b`.
 * Lines common to both ends are matched first and cheaply, so a one-line edit to a long
 * document only runs the full comparison over the part in between.
 */
export function lineDiff(a: string, b: string): DiffLine[] {
  const before = splitLines(a);
  const after = splitLines(b);

  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start += 1;
  let endBefore = before.length;
  let endAfter = after.length;
  while (endBefore > start && endAfter > start && before[endBefore - 1] === after[endAfter - 1]) {
    endBefore -= 1;
    endAfter -= 1;
  }

  const head: DiffLine[] = before.slice(0, start).map((text) => ({ kind: 'same', text }));
  const tail: DiffLine[] = before.slice(endBefore).map((text) => ({ kind: 'same', text }));
  const middleBefore = before.slice(start, endBefore);
  const middleAfter = after.slice(start, endAfter);
  return [...head, ...diffMiddle(middleBefore, middleAfter), ...tail];
}

function diffMiddle(before: string[], after: string[]): DiffLine[] {
  const removed = (text: string): DiffLine => ({ kind: 'remove', text });
  const added = (text: string): DiffLine => ({ kind: 'add', text });
  if (!before.length || !after.length || before.length * after.length > MAX_CELLS) {
    return [...before.map(removed), ...after.map(added)];
  }

  // lengths[i][j]: the longest run the two have in common from before[i] and after[j] on.
  const rows = before.length;
  const cols = after.length;
  const lengths: Uint32Array[] = Array.from({ length: rows + 1 }, () => new Uint32Array(cols + 1));
  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      lengths[i][j] =
        before[i] === after[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }

  // Walked forwards, a removal before an addition when either would do, so a changed line
  // reads as the old one struck out and the new one under it - the way people write diffs.
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < rows && j < cols) {
    if (before[i] === after[j]) {
      out.push({ kind: 'same', text: before[i] });
      i += 1;
      j += 1;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      out.push(removed(before[i]));
      i += 1;
    } else {
      out.push(added(after[j]));
      j += 1;
    }
  }
  while (i < rows) out.push(removed(before[i++]));
  while (j < cols) out.push(added(after[j++]));
  return out;
}

/** Whether a diff changes anything at all. */
export function hasChanges(lines: DiffLine[]): boolean {
  return lines.some((line) => line.kind !== 'same');
}

/**
 * The diff as it is shown: every change, `context` unchanged lines either side of it, and
 * each longer run of unchanged lines folded into one marker saying how many it hides. A
 * fold that would hide a single line hides nothing worth hiding, so that line is shown.
 */
export function withContext(lines: DiffLine[], context = 3): (DiffLine | DiffSkip)[] {
  const keep = lines.map((line) => line.kind !== 'same');
  const near = new Array<boolean>(lines.length).fill(false);
  lines.forEach((line, index) => {
    if (line.kind === 'same') return;
    for (let k = Math.max(0, index - context); k <= Math.min(lines.length - 1, index + context); k += 1) near[k] = true;
  });

  const out: (DiffLine | DiffSkip)[] = [];
  let index = 0;
  while (index < lines.length) {
    if (keep[index] || near[index]) {
      out.push(lines[index]);
      index += 1;
      continue;
    }
    let end = index;
    while (end < lines.length && !keep[end] && !near[end]) end += 1;
    const count = end - index;
    if (count === 1) out.push(lines[index]);
    else out.push({ kind: 'skip', count });
    index = end;
  }
  return out;
}
