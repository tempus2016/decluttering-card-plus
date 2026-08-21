/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Templates to start from. The hard part of this card has never been the syntax - it is
 * the blank page, and knowing which shapes are worth building at all. These are worked
 * examples of the things people ask for most, ready to be dropped in and changed.
 *
 * They are carried in the bundle rather than fetched: a dashboard should not have to reach
 * the internet to show a card, and nobody should have to think about what their Home
 * Assistant is talking to in order to use a starter template.
 */

export interface LibraryEntry {
  /** The name it is installed under, which is also how a card would call it. */
  name: string;
  /** One line about what it is for, shown in the list. */
  summary: string;
  /** The template itself, exactly as a template card would hold it. */
  template: Record<string, any>;
}

export const LIBRARY: LibraryEntry[] = [
  {
    name: 'room_light_tile',
    summary: 'A tile per light, with the light named after itself.',
    template: {
      description: 'A tile for one light, taking its name from Home Assistant.',
      variables: [
        { name: 'entity', label: 'Light', selector: { entity: { domain: 'light' } }, required: true },
        { name: 'name', label: 'Name', description: 'Leave empty to use the light’s own name', selector: { text: {} } },
      ],
      card: {
        type: 'tile',
        entity: '[[entity]]',
        name: '[[name|or:entity|friendly_name]]',
        features: [{ type: 'light-brightness' }],
      },
    },
  },
  {
    name: 'room_summary',
    summary: 'A heading per area, listing the lights in it. Uses grouping.',
    template: {
      description: 'One card per area, with a tile for every light in that area.',
      card: {
        type: 'vertical-stack',
        cards: [
          { type: 'markdown', content: '## [[area]]\n\n[[entity_count]] lights' },
          { type: 'custom:decluttering-card-plus', template: 'room_light_tile', for_each: '[[items]]' },
        ],
      },
    },
  },
  {
    name: 'sensor_line',
    summary: 'An Entities row showing one sensor with its area.',
    template: {
      description: 'A row for one sensor, labelled with the area it is in.',
      variables: [{ name: 'entity', label: 'Sensor', selector: { entity: {} }, required: true }],
      row: {
        entity: '[[entity]]',
        name: '[[entity|friendly_name]] ([[entity|area|default:no area]])',
      },
    },
  },
  {
    name: 'status_badge',
    summary: 'A badge that only appears when something needs attention.',
    template: {
      description: 'A badge for one entity, hidden unless it is in the state you care about.',
      variables: [
        { name: 'entity', label: 'Entity', selector: { entity: {} }, required: true },
        { name: 'when', label: 'Show when the state is', selector: { text: {} }, default: 'on' },
      ],
      badge: {
        type: 'entity',
        entity: '[[entity]]',
        visibility: [{ condition: 'state', entity: '[[entity]]', state: '[[when]]' }],
      },
    },
  },
  {
    name: 'counted_grid',
    summary: 'A numbered grid of anything, showing "3 of 12".',
    template: {
      description: 'A tile that knows where it sits in a repeat.',
      variables: [{ name: 'entity', label: 'Entity', selector: { entity: {} }, required: true }],
      card: {
        type: 'tile',
        entity: '[[entity]]',
        name: '[[entity|friendly_name]]',
        footer: { type: 'markdown', content: '[[index]] of [[total|or:count]]' },
      },
    },
  },
];

/** One entry by name, for installing it. */
export function libraryEntry(name: string): LibraryEntry | undefined {
  return LIBRARY.find((entry) => entry.name === name);
}

/**
 * What a library template needs that is not in it. `room_summary` calls another template,
 * and dropping it in on its own would leave a card pointing at a name that is not there.
 */
export function libraryNeeds(entry: LibraryEntry, existing: string[]): string[] {
  const needed = new Set<string>();
  const walk = (node: any): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (typeof node.type === 'string' && node.type.includes('decluttering-card') && typeof node.template === 'string') {
      needed.add(node.template);
    }
    Object.values(node).forEach(walk);
  };
  walk(entry.template);
  return [...needed].filter((name) => !existing.includes(name));
}
