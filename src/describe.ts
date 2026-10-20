import { toYaml } from './yaml';
import { freeName } from './share';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The other half of the template builder: for somebody with nothing pasted yet. They say
 * what they want - a tile per light that opens a room's page, hidden when the light is
 * unavailable - and this writes the template and the cards that use it, with a line for
 * each part saying which feature it is and where that is written up.
 *
 * It writes the plainest template that does the job. Anything a copy might not set - its
 * name, an icon, a colour - is an optional `[[name?]]`, so a copy that leaves it out gets
 * the card's own default rather than a hole: the tile names itself after its entity and
 * picks its domain's icon, exactly as it would written out by hand.
 */

export type Kind = 'card' | 'badge' | 'row';

/** The settings that can change from copy to copy, as the questions offer them. */
export type Change = 'name' | 'icon' | 'color' | 'navigate';

export interface Answers {
  kind: Kind;
  /** The card's type, for a card: `tile`, `button`, `entity`, or anything custom. */
  cardType?: string;
  /** Which domain the entities are, to narrow the editor's entity picker. Empty for any. */
  domain?: string;
  changes: Change[];
  /** Other settings that change, by their key: `show_state`, `vertical`. */
  extra?: string[];
  /** Hide a copy while its entity is unavailable. */
  hideUnavailable?: boolean;
  /** Write `variables:` declarations, so the visual editor shows a field for each. */
  describe?: boolean;
  /** The entities to make copies for, one per copy. */
  entities: string[];
  /** One card repeating the template over the entities, instead of a card per copy. Cards only. */
  repeat?: boolean;
  /** What to call it. Worked out from the type and domain when not given. */
  name?: string;
}

export interface Note {
  text: string;
  /** A page on the docs site, relative to it. */
  link: string;
}

export interface Described {
  name: string;
  templateYaml: string;
  usageYaml: string;
  notes: Note[];
  /** Asked for but not something this kind of thing has, so left out. */
  skipped: Change[];
}

// What each kind of thing can be told, of the settings the questions offer. A tile,
// a badge and most custom cards take a colour; a button and an entity card do not.
const SUPPORTS: Record<string, Change[]> = {
  tile: ['name', 'icon', 'color', 'navigate'],
  button: ['name', 'icon', 'navigate'],
  entity: ['name', 'icon'],
  badge: ['name', 'icon', 'color', 'navigate'],
  row: ['name', 'icon', 'navigate'],
};

// What the note shows a copy setting, for the settings it knows.
const EXAMPLE_VALUES: Record<string, string> = { name: 'Kitchen', icon: 'mdi:lightbulb', color: 'amber' };

const VALID_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
const ENTITY_ID = /^[a-z_]+\.[a-z0-9_]+$/;

const LABELS: Record<Change, string> = {
  name: 'Name',
  icon: 'Icon',
  color: 'Colour',
  navigate: 'Opens',
};

const clean = (text: string): string =>
  text
    .toLowerCase()
    .replace(/^custom:/, '')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');

/** What a kind of thing can be told: a known card's list, else - a custom card - all of it. */
export function supported(answers: Pick<Answers, 'kind' | 'cardType'>): Change[] {
  const key = answers.kind === 'card' ? (answers.cardType ?? 'tile') : answers.kind;
  return SUPPORTS[key] ?? ['name', 'icon', 'color', 'navigate'];
}

/** The entity ids people listed, one a line or comma-separated, that look like one. */
export function readEntities(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[\s,]+/)
        .map((each) => each.trim())
        .filter((each) => ENTITY_ID.test(each)),
    ),
  ];
}

function suggestName(answers: Answers): string {
  const domains = new Set(answers.entities.map((entity) => entity.split('.')[0]));
  const domain = clean(answers.domain || (domains.size === 1 ? [...domains][0] : ''));
  const thing = answers.kind === 'card' ? `${clean(answers.cardType || 'tile')}_card` : answers.kind;
  return [domain, thing.replace(/_card_card$/, '_card')].filter(Boolean).join('_');
}

/** A path to put in for a copy's `navigate` until they write their own. */
function examplePath(entity: string): string {
  return `/lovelace/${entity.split('.')[1] ?? 'room'}`;
}

/** Write the template and its cards for what was asked. */
export function describeTemplate(answers: Answers): Described {
  const can = supported(answers);
  const changes = answers.changes.filter((change) => can.includes(change));
  const skipped = answers.changes.filter((change) => !can.includes(change));
  const extra = [...new Set((answers.extra ?? []).map((key) => key.trim()).filter((key) => VALID_KEY.test(key)))]
    // Keys the template already writes are not extras.
    .filter((key) => !['entity', 'name', 'icon', 'color', 'tap_action', 'type', 'visibility'].includes(key));
  const repeat = !!answers.repeat && answers.kind === 'card';
  const wanted = answers.name?.trim() ? clean(answers.name) : '';
  const name = wanted || freeName(suggestName(answers), []);
  const notes: Note[] = [];

  const content: Record<string, any> = {};
  if (answers.kind === 'card') content.type = answers.cardType?.trim() || 'tile';
  if (answers.kind === 'badge') content.type = 'entity';
  content.entity = '[[entity]]';
  notes.push({
    text: '[[entity]] is the one value every copy passes.',
    link: 'Variables.html#passing-values',
  });

  const optional = changes.filter((change) => change !== 'navigate');
  if (changes.includes('name')) content.name = '[[name?]]';
  if (changes.includes('icon')) content.icon = '[[icon?]]';
  if (changes.includes('color')) content.color = '[[color?]]';
  for (const key of extra) content[key] = `[[${key}?]]`;
  if (optional.length || extra.length) {
    notes.push({
      text: `The ? on ${[...optional, ...extra].map((key) => `[[${key}?]]`).join(', ')} makes ${optional.length + extra.length === 1 ? 'it' : 'them'} optional: a copy that leaves one out gets the card's own default - its entity's own name, say - instead of a gap.`,
      link: 'Variables.html#a-variable-the-template-can-do-without-v110',
    });
  }
  if (changes.includes('navigate')) {
    content.tap_action = { action: 'navigate', navigation_path: '[[path]]' };
    notes.push({
      text: 'tap_action takes a variable like any other setting, so each copy opens its own page.',
      link: 'Variables.html#writing-placeholders',
    });
  }
  if (answers.hideUnavailable && answers.kind !== 'row') {
    content.visibility = [{ condition: 'state', entity: '[[entity]]', state_not: 'unavailable' }];
    notes.push({
      text: 'visibility on the template hides every copy whose entity is unavailable, and a hidden copy leaves no gap. An entity id Home Assistant does not know at all is not unavailable, so a typo still shows. In edit mode every copy shows, so you can find it.',
      link: 'Visibility.html',
    });
  }

  const template: Record<string, any> = {};
  if (answers.describe) {
    const declarations: Record<string, any>[] = [
      {
        name: 'entity',
        label: 'Entity',
        type: 'entity',
        ...(answers.domain?.trim() ? { domain: clean(answers.domain) } : {}),
        required: true,
      },
    ];
    for (const change of changes) {
      const key = change === 'navigate' ? 'path' : change;
      const type = change === 'name' || change === 'navigate' ? 'text' : change;
      declarations.push({
        name: key,
        label: LABELS[change],
        type,
        ...(change === 'name' ? { description: "Leave empty to use the entity's own name" } : {}),
        ...(change === 'navigate'
          ? { description: 'The dashboard path it opens, like /lovelace/kitchen', required: true }
          : {}),
      });
    }
    for (const key of extra) declarations.push({ name: key, label: key.replace(/_/g, ' '), type: 'text' });
    template.variables = declarations;
    notes.push({
      text: 'variables: describes each variable, so the visual editor shows a picker or a box for it instead of YAML.',
      link: 'Describing-Variables.html#declaring-them',
    });
  }
  template[answers.kind] = content;

  const entities = answers.entities.length ? answers.entities : [`${clean(answers.domain || '') || 'light'}.example`];
  const perCopy = (entity: string): Record<string, unknown> => ({
    entity,
    ...(changes.includes('navigate') ? { path: examplePath(entity) } : {}),
  });

  let usage: unknown;
  if (repeat) {
    usage = [{ type: 'custom:decluttering-card-plus', template: name, for_each: entities.map(perCopy) }];
    notes.push({
      text: 'for_each repeats the template once per entity from one card. Add name:, icon: and the rest to an entry to set them for that copy.',
      link: 'Repeating-a-Template.html',
    });
  } else {
    usage = entities.map((entity) => ({
      type: 'custom:decluttering-card-plus',
      template: name,
      variables: Object.entries(perCopy(entity)).map(([key, value]) => ({ [key]: value })),
    }));
    if (optional.length || extra.length) {
      notes.push({
        text: `To set one on a single copy, add it to that card's variables: - ${[...optional, ...extra][0]}: ${EXAMPLE_VALUES[[...optional, ...extra][0]] ?? '...'}`,
        link: 'Using-Templates.html',
      });
    }
  }
  if (answers.kind === 'badge') {
    notes.push({ text: "These go in a sections view's badges: list.", link: 'Badges.html' });
  }
  if (answers.kind === 'row') {
    notes.push({ text: "These go in an Entities card's entities: list.", link: 'Rows.html' });
  }

  const usageYaml = answers.kind === 'row' ? toYaml({ type: 'entities', entities: usage }) : toYaml(usage);

  return {
    name,
    templateYaml: toYaml({ decluttering_templates: { [name]: template } }),
    usageYaml,
    notes,
    skipped,
  };
}
