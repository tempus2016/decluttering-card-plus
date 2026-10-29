import { BuilderResult, BuiltTemplate, LeftOut, MAX_DIFFERING, buildTemplates } from './builder';
import { codeBlock, el } from './docs-dom';
import { startDescribe } from './describe-page';

/*
 * The template builder page on the docs site: docs-theme/builder.html. Built by rollup to
 * docs-theme/assets/js/builder.js, which the page loads from its own origin - the docs
 * site's CSP allows no other script. The words are English like the rest of the site; the
 * card's own strings are the localized ones.
 */

const EXAMPLE = `- type: tile
  entity: light.kitchen
  name: Kitchen
  icon: mdi:stove
  tap_action:
    action: toggle
- type: tile
  entity: light.lounge
  name: Lounge
  icon: mdi:sofa
  tap_action:
    action: toggle
- type: tile
  entity: light.study
  name: Study
  icon: mdi:desk
  tap_action:
    action: toggle
- type: tile
  entity: light.hall
  name: Hall
  tap_action:
    action: toggle
`;

function inlineCode(parent: HTMLElement, text: string): void {
  parent.appendChild(el('code', text));
}

function joined(parent: HTMLElement, items: string[]): void {
  items.forEach((item, at) => {
    if (at) parent.appendChild(document.createTextNode(at === items.length - 1 ? ' and ' : ', '));
    inlineCode(parent, item);
  });
}

function templateSection(made: BuiltTemplate): HTMLElement {
  const section = el('section', undefined, 'builder-result');
  section.appendChild(el('h2', made.name));
  const lede = el('p');
  lede.appendChild(document.createTextNode(`From ${made.labels.length} ${made.type.replace(/^custom:/, '')} cards: `));
  lede.appendChild(document.createTextNode(made.labels.join(', ') + '. '));
  lede.appendChild(document.createTextNode(made.variables.length === 1 ? 'Its variable is ' : 'Its variables are '));
  joined(lede, made.variables);
  lede.appendChild(document.createTextNode('.'));
  section.appendChild(lede);
  if (made.optional.length) {
    const note = el('p');
    note.appendChild(document.createTextNode('Not every card has '));
    joined(note, made.optional);
    const one = made.optional.length === 1;
    note.appendChild(
      document.createTextNode(
        `, so the template marks ${one ? 'it' : 'them'} optional with a ? - a card that does not pass ${one ? 'it leaves that setting' : 'one leaves those settings'} out, as it did before.`,
      ),
    );
    section.appendChild(note);
  }
  return section;
}

/*
 * What to paste, once for everything: the templates, and the paste itself with each
 * copied card swapped for the decluttering card that draws it. Stacks, grids and views
 * come back as they went in, so the second block replaces the first one whole.
 */
function pasteSection(result: BuilderResult): HTMLElement {
  const section = el('section', undefined, 'builder-result');
  section.appendChild(el('h2', 'What to paste'));
  if (result.dashboard) {
    section.appendChild(
      codeBlock(
        'Your dashboard',
        'Open the dashboard, then Edit dashboard, the three dots, Raw configuration editor. Replace everything there with this. The templates are already at the top.',
        result.pastedYaml as string,
      ),
    );
    return section;
  }
  const one = result.templates.length === 1;
  section.appendChild(
    codeBlock(
      one ? '1. The template' : '1. The templates',
      'Add this to the top of the dashboard in the raw configuration editor, or to the template library dashboard. If decluttering_templates: is already there, add only the lines under it.',
      result.templatesYaml as string,
    ),
  );
  section.appendChild(
    codeBlock(
      '2. Your cards',
      'Replace what you pasted with this. It is the same cards, stacks and layout, with each copy swapped for the card that draws it.',
      result.pastedYaml as string,
    ),
  );
  return section;
}

function leftOutItem(item: LeftOut): HTMLElement {
  const li = el('li');
  li.appendChild(el('strong', item.label));
  li.appendChild(document.createTextNode(' - '));
  if (item.reason === 'template') {
    li.appendChild(document.createTextNode('already uses a template.'));
  } else if (item.reason === 'copies') {
    li.appendChild(
      document.createTextNode(
        'is an exact copy of another card here. A template needs at least one setting that changes from card to card.',
      ),
    );
  } else if (item.reason === 'too_many') {
    li.appendChild(
      document.createTextNode(
        `has the same settings as other cards here, but different values in ${item.differing} places - more than ${MAX_DIFFERING}, so it is probably a different card that happens to be built alike.`,
      ),
    );
  } else if (!item.nearest) {
    li.appendChild(document.createTextNode('has no other card of its type to be a copy of.'));
  } else {
    const { label, onlyHere, onlyThere } = item.nearest;
    li.appendChild(document.createTextNode(`is closest to ${label}, but they are not built the same: `));
    if (onlyHere.length) {
      li.appendChild(document.createTextNode('only this one has '));
      joined(li, onlyHere);
    }
    if (onlyHere.length && onlyThere.length) li.appendChild(document.createTextNode('; '));
    if (onlyThere.length) {
      li.appendChild(document.createTextNode(`only ${label} has `));
      joined(li, onlyThere);
    }
    li.appendChild(
      document.createTextNode('. Give both the same settings - with the values each one needs - and paste again.'),
    );
  }
  return li;
}

function render(output: HTMLElement, result: BuilderResult): void {
  output.replaceChildren();
  if (result.error) {
    const box = el('blockquote', undefined, 'builder-error');
    box.appendChild(el('p', 'That YAML does not read:'));
    const pre = el('pre');
    pre.appendChild(el('code', result.error));
    box.appendChild(pre);
    output.appendChild(box);
    return;
  }
  if (!result.found) {
    output.appendChild(
      el(
        'blockquote',
        'No cards found. Paste cards the way they look in the card editor or the raw configuration editor - each one starts with type:.',
      ),
    );
    return;
  }
  const summary =
    result.templates.length === 0
      ? `Found ${result.found} cards, and none of them are copies of each other yet.`
      : `Found ${result.found} cards and made ${result.templates.length} ${result.templates.length === 1 ? 'template' : 'templates'}.`;
  output.appendChild(el('p', summary, 'builder-summary'));
  result.templates.forEach((made) => output.appendChild(templateSection(made)));
  if (result.templates.length) output.appendChild(pasteSection(result));
  if (result.leftOut.length) {
    const section = el('section', undefined, 'builder-result');
    section.appendChild(el('h2', result.templates.length ? 'Left as they are' : 'Why not'));
    const list = el('ul');
    result.leftOut.forEach((item) => list.appendChild(leftOutItem(item)));
    section.appendChild(list);
    output.appendChild(section);
  }
}

function start(): void {
  const input = document.getElementById('builder-input') as HTMLTextAreaElement | null;
  const run = document.getElementById('builder-run');
  const example = document.getElementById('builder-example');
  const output = document.getElementById('builder-output');
  const form = document.getElementById('builder');
  if (!input || !run || !example || !output || !form) return;
  form.hidden = false;
  startDescribe();
  run.addEventListener('click', () => render(output, buildTemplates(input.value)));
  example.addEventListener('click', () => {
    input.value = EXAMPLE;
    render(output, buildTemplates(input.value));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
