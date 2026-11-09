/*
 * The report's outline (#428): one line for each thing the build made - the card, each nested
 * card of ours, each `with:` and `repeat:` fill - nested as they sit, each pointing at its part
 * of the report. A long report is hard to find the way round; this is its table of contents.
 * A fill that was never made, because its `if:` did not hold or there is no template by its
 * name, gets a line too, with the reason.
 *
 * Pure: built from the structured trace. element.ts draws it, report.ts writes it as a list.
 */
import { ItemTrace, SkipTrace, TracePath, TraceReport, TraceSection, nestedCardTemplates } from './trace';
import { localize } from './localize';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type OutlineKind = 'card' | 'badge' | 'element' | 'row' | 'item' | 'variable';

export interface OutlineNode {
  /** Unique within the outline, for keyed rendering. */
  key: string;
  /** The report node this line jumps to: the same id the tree uses, and the Markdown's anchor. */
  target?: string;
  /** What was made: its name, or its template's when it has none. */
  name: string;
  /** What it came from, and the template's name when that is not the name already shown. */
  kind?: OutlineKind;
  template?: string;
  /** What built it: a `with:`, a `repeat:`, or a card of ours inside another. */
  step?: 'with' | 'repeat' | 'nested';
  /** A repeat's copies are folded under one line that says how many. */
  copies?: number;
  /** One copy of a repeat: `2/3`. */
  copy?: string;
  /** Why it was never made, when it was not. */
  skipped?: string;
  children: OutlineNode[];
}

/** The id a report's card, section or fill has in the tree and as an anchor in the Markdown. */
export const sectionId = (report: number, section: number, labelled: boolean): string =>
  labelled ? `r${report}-s${section}` : `r${report}`;

// `"Porch" [camera_card]` is the card called Porch, built from camera_card.
function labelParts(label: string): { name: string; template?: string } {
  const named = /^"([\s\S]*)" \[([^\]]*)\]$/.exec(label);
  if (named) return { name: named[1], template: named[2] };
  const plain = /^"([\s\S]*)"$/.exec(label);
  return { name: plain ? plain[1] : label };
}

// What a template builds, from the key its content sits under.
function kindOf(report: TraceReport): OutlineKind {
  const config = report.template?.config as Record<string, unknown> | undefined;
  if (config && typeof config === 'object') {
    for (const kind of ['card', 'badge', 'element', 'row'] as const) if (kind in config) return kind;
  }
  return 'card';
}

// Paths compared step by step, so `cards[2]` comes before `cards[10]`.
function comparePaths(a: TracePath = [], b: TracePath = []): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) continue;
    if (typeof a[i] === 'number' && typeof b[i] === 'number') return (a[i] as number) - (b[i] as number);
    return String(a[i]) < String(b[i]) ? -1 : 1;
  }
  return a.length - b.length;
}

const isPrefix = (outer: TracePath, inner: TracePath): boolean =>
  outer.length < inner.length && outer.every((step, i) => inner[i] === step);

/*
 * Which report each nested card's report sits inside. By where it sits in the outermost card,
 * when the report says: the card whose place is the longest start of its own. Otherwise by
 * the names of the cards around it, the nearest earlier report named last among them - names
 * can clash, so this is the fallback, not the rule.
 */
export function parentIndexes(reports: TraceReport[]): (number | undefined)[] {
  const pathOf = (index: number): TracePath | undefined => reports[index].path ?? (index === 0 ? [] : undefined);
  return reports.map((report, index) => {
    if (index === 0) return undefined;
    const own = pathOf(index);
    if (own) {
      let best: number | undefined;
      reports.forEach((_, other) => {
        const path = pathOf(other);
        if (other === index || !path || !isPrefix(path, own)) return;
        if (best === undefined || path.length > (pathOf(best) as TracePath).length) best = other;
      });
      if (best !== undefined) return best;
    }
    const around = report.chain[report.chain.length - 1];
    for (let other = index - 1; other >= 0; other--) {
      const candidate = reports[other];
      if (candidate.label === around && candidate.chain.length === report.chain.length - 1) return other;
    }
    return 0;
  });
}

// One fill's own values give a copy its name: `name: Front door`, when it has one in words.
function nameValue(item: ItemTrace): string | undefined {
  const value = item.trace.values?.get('name');
  return typeof value === 'string' && value.trim() && !value.includes('[[') ? value : undefined;
}

// `[[camera_entry|with:x=1]]` fills in camera_entry, for a trace older than the name field.
const placeholderHead = (placeholder: string): string =>
  placeholder.replace(/^\[\[/, '').split('|')[0].replace(/\?$/, '');

const stepOf = (item: ItemTrace): 'with' | 'repeat' =>
  item.step ?? (/\|repeat(?::|\||\]|\?)/.test(item.placeholder) ? 'repeat' : 'with');

/*
 * Somewhere the nested cards can go: a section, or a fill inside one. `own` counts the cards
 * of ours that it built itself and not a fill inside it did, by template.
 */
interface Slot {
  node: OutlineNode;
  own: Map<string, number>;
}

function count(names: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  return counts;
}

// Every card the slots built themselves, one name per card.
function ownOf(slots: Slot[]): string[] {
  const names: string[] = [];
  for (const slot of slots) for (const [name, many] of slot.own) for (let i = 0; i < many; i++) names.push(name);
  return names;
}

function minus(from: Map<string, number>, names: string[]): Map<string, number> {
  const left = new Map(from);
  for (const name of names) {
    const now = left.get(name) ?? 0;
    if (now > 1) left.set(name, now - 1);
    else left.delete(name);
  }
  return left;
}

/** The outline: the outermost card first, every card and fill inside it under what built it. */
export function reportOutline(
  reports: TraceReport[],
  hass?: any,
  hide: (text: string) => string = (text) => text,
): OutlineNode[] {
  if (!reports.length) return [];
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const skipNode = (skip: SkipTrace, key: string): OutlineNode => ({
    key,
    name: hide(skip.name),
    step: skip.step,
    skipped:
      skip.reason === 'closed'
        ? hide(t('report.outline_closed', { condition: skip.condition ?? 'if:' }))
        : skip.reason === 'filtered'
          ? hide(t('report.outline_filtered', { condition: skip.condition ?? 'if:' }))
          : t('report.outline_missing'),
    // An entry a repeat's own condition left out says which it was (#429).
    ...(skip.copy ? { copy: `${skip.copy.number}/${skip.copy.count}` } : {}),
    children: [],
  });

  /*
   * A build's fills as lines, its repeats' copies folded under one line each, and the places a
   * nested card could sit gathered on the way, in the order they come.
   */
  const fills = (items: ItemTrace[] | undefined, skipped: SkipTrace[] | undefined, base: string, slots: Slot[]) => {
    const lines: OutlineNode[] = [];
    const list = items ?? [];
    // The entries a repeat's own condition left out go among its copies, when it made any (#429).
    const rest = [...(skipped ?? [])];
    const leftOut = (placeholder: string): OutlineNode[] => {
      const found: OutlineNode[] = [];
      for (let k = rest.length - 1; k >= 0; k--) {
        if (rest[k].reason !== 'filtered' || rest[k].placeholder !== placeholder) continue;
        found.unshift(skipNode(rest[k], `${base}-f${k}`));
        rest.splice(k, 1);
      }
      return found;
    };
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const name = item.name ?? placeholderHead(item.placeholder);
      const kind: OutlineKind = item.source === 'variable' ? 'variable' : 'item';
      const line = (one: ItemTrace, index: number): OutlineNode => {
        const id = `${base}-i${index}`;
        const node: OutlineNode = {
          key: id,
          target: id,
          name: hide(nameValue(one) ?? name),
          children: [],
        };
        const inner: Slot[] = [];
        const own = count(one.cards ?? []);
        const slot: Slot = { node, own };
        slots.push(slot);
        node.children = fills(one.trace.items, one.trace.skipped, id, inner);
        slots.push(...inner);
        slot.own = minus(own, ownOf(inner));
        if (one.empty) node.skipped = t('report.outline_empty');
        return node;
      };
      if (item.copy) {
        // The copies of one repeat sit side by side, each saying which it is.
        let end = i;
        while (end + 1 < list.length && list[end + 1].copy && list[end + 1].placeholder === item.placeholder) end++;
        const copies: OutlineNode[] = [];
        for (let c = i; c <= end; c++) {
          const node = line(list[c], c);
          node.copy = `${list[c].copy!.number}/${list[c].copy!.count}`;
          copies.push(node);
        }
        lines.push({
          key: `${base}-i${i}-copies`,
          target: `${base}-i${i}`,
          name: hide(name),
          kind,
          step: 'repeat',
          copies: copies.length,
          children: [...copies, ...leftOut(item.placeholder)],
        });
        i = end;
        continue;
      }
      const node = line(item, i);
      node.kind = kind;
      node.step = stepOf(item);
      if (node.name !== hide(name)) node.template = hide(name);
      lines.push(node);
    }
    rest.forEach((skip, index) => lines.push(skipNode(skip, `${base}-x${index}`)));
    return lines;
  };

  const parents = parentIndexes(reports);
  const cardNodes: { node: OutlineNode; slots: Slot[] }[] = reports.map((report, index) => {
    const { name, template } = labelParts(report.label);
    const templateName = report.template?.name || template;
    const node: OutlineNode = {
      key: `r${index}`,
      target: `r${index}`,
      name: hide(name),
      kind: kindOf(report),
      ...(templateName && templateName !== name ? { template: hide(templateName) } : {}),
      ...(index > 0 ? { step: 'nested' as const } : {}),
      children: [],
    };
    const slots: Slot[] = [];
    const sectionLines = report.sections.map((section: TraceSection, s) => {
      const labelled = section.label !== undefined;
      const id = sectionId(index, s, labelled);
      const inner: Slot[] = [];
      const lines = fills(section.trace.items, section.trace.skipped, `r${index}-s${s}`, inner);
      const all = nestedCardTemplates(section.built);
      const fromFills = ownOf(inner);
      const sectionNode: OutlineNode = labelled
        ? { key: id, target: id, name: hide(section.label as string), children: lines }
        : node;
      slots.push({ node: sectionNode, own: minus(count(all), fromFills) }, ...inner);
      return { labelled, sectionNode, lines };
    });
    if (sectionLines.length === 1 && !sectionLines[0].labelled) {
      node.children = sectionLines[0].lines;
    } else {
      // A card's own copies, `for_each` or a picker's, folded like a repeat's.
      node.copies = sectionLines.length;
      node.children = sectionLines.map(({ sectionNode, lines }) =>
        sectionNode === node ? { key: `${node.key}-c`, name: node.name, children: lines } : sectionNode,
      );
    }
    return { node, slots };
  });

  /*
   * Each nested card under the fill or section that built it: the first, in order, that
   * built a card of that template and has not been given one yet. A card it cannot place
   * goes under the card around it.
   */
  // In the order they sit, which is not always the order they built in.
  const order = reports.map((_, index) => index).filter((index) => index > 0);
  order.sort((a, b) => comparePaths(reports[a].path, reports[b].path));
  for (const index of order) {
    const parent = parents[index] ?? 0;
    const template = reports[index].template?.name ?? '';
    const home = cardNodes[parent];
    const slot = home.slots.find((s) => (s.own.get(template) ?? 0) > 0);
    const child = cardNodes[index].node;
    if (slot) {
      slot.own.set(template, (slot.own.get(template) as number) - 1);
      slot.node.children.push(child);
    } else {
      home.node.children.push(child);
    }
  }
  return [cardNodes[0].node];
}

/** Every line in the outline, depth first, with how deep it sits. */
export function outlineLines(nodes: OutlineNode[], depth = 0): { node: OutlineNode; depth: number }[] {
  const lines: { node: OutlineNode; depth: number }[] = [];
  for (const node of nodes) lines.push({ node, depth }, ...outlineLines(node.children, depth + 1));
  return lines;
}

/** The words a line shows after its name: what it came from, what built it, how many copies. */
export function outlineTags(node: OutlineNode, hass?: any): string[] {
  const t = (key: string, params?: Record<string, unknown>): string => localize(key, params, hass);
  const tags: string[] = [];
  if (node.kind)
    tags.push(node.template ? `${t(`report.kind_${node.kind}`)} ${node.template}` : t(`report.kind_${node.kind}`));
  if (node.step) tags.push(node.step === 'nested' ? t('report.step_nested') : node.step);
  if (node.copies !== undefined) tags.push(t('report.outline_copies', { count: node.copies }));
  return tags;
}
