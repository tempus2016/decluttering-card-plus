import { Answers, Change, Kind, describeTemplate, readEntities, supported } from './describe';
import { codeBlock, el } from './docs-dom';

/*
 * "Describe what you want" on the template builder page: the questions in
 * docs-theme/builder.html, answered into describeTemplate and written out as it goes.
 */

const CHANGES: Change[] = ['name', 'icon', 'color', 'navigate'];

function value(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
}

// A box greyed out for this kind of thing does not count, ticked or not.
function ticked(id: string): boolean {
  const box = document.getElementById(id) as HTMLInputElement | null;
  return !!box && box.checked && !box.disabled;
}

function answers(): Answers {
  const kind = (document.querySelector('input[name="describe-kind"]:checked') as HTMLInputElement | null)
    ?.value as Kind;
  const picked = value('describe-type');
  return {
    kind: kind || 'card',
    cardType: picked === 'other' ? value('describe-custom').trim() || 'tile' : picked,
    domain: value('describe-domain').trim(),
    changes: CHANGES.filter((change) => ticked(`describe-${change}`)),
    extra: value('describe-extra').split(/[\s,]+/),
    hideUnavailable: ticked('describe-hide'),
    describe: ticked('describe-describe'),
    repeat: ticked('describe-repeat'),
    entities: readEntities(value('describe-entities')),
    name: value('describe-name-field'),
  };
}

/** Grey out what this kind of thing cannot be told, so nobody asks for a colour on a button. */
function reflect(asked: Answers): void {
  const can = supported(asked);
  for (const change of CHANGES) {
    const box = document.getElementById(`describe-${change}`) as HTMLInputElement | null;
    if (box) box.disabled = !can.includes(change);
  }
  const card = asked.kind === 'card';
  const typeRow = document.getElementById('describe-type-row');
  if (typeRow) typeRow.hidden = !card;
  const custom = document.getElementById('describe-custom');
  if (custom) custom.hidden = !card || value('describe-type') !== 'other';
  const repeat = document.getElementById('describe-repeat') as HTMLInputElement | null;
  if (repeat) repeat.disabled = !card;
  const hide = document.getElementById('describe-hide') as HTMLInputElement | null;
  if (hide) hide.disabled = asked.kind === 'row';
}

function render(output: HTMLElement): void {
  // Grey out first, so what is greyed out is not asked for.
  reflect(answers());
  const asked = answers();
  const made = describeTemplate(asked);
  output.replaceChildren();
  output.appendChild(
    codeBlock(
      '1. The template',
      'Add this to the top of the dashboard in the raw configuration editor, or to the template library dashboard. If decluttering_templates: is already there, add only the lines under it.',
      made.templateYaml,
    ),
  );
  const where =
    asked.kind === 'badge'
      ? "Put these in a sections view's badges: list."
      : asked.kind === 'row'
        ? 'Add this Entities card where you want the rows, or copy its entities: into one you have.'
        : 'Add these to the dashboard where you want the cards.';
  output.appendChild(codeBlock('2. Your cards', where, made.usageYaml));

  if (made.skipped.length) {
    output.appendChild(el('p', `Left out: ${made.skipped.join(', ')} - not something this card has.`, 'builder-help'));
  }
  const heading = el('h3', 'What each part is');
  output.appendChild(heading);
  const list = el('ul');
  for (const note of made.notes) {
    const li = el('li', note.text + ' ');
    const link = el('a', 'More');
    link.href = note.link;
    li.appendChild(link);
    list.appendChild(li);
  }
  output.appendChild(list);
}

export function startDescribe(): void {
  const form = document.getElementById('describe');
  const output = document.getElementById('describe-output');
  if (!form || !output) return;
  form.hidden = false;
  form.addEventListener('input', () => render(output));
  form.addEventListener('change', () => render(output));
  render(output);
}
