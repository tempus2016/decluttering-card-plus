/*
 * Unit tests for src/family.ts - the extends family tree (idea 29).
 * Run with `npm test`.
 */
const { extendsFamilies, familyOf, layersOf, familySize } = require('../.test-build/family.js');

const { check } = require('./check');

const templates = {
  tile_base: { card: { type: 'tile', tap_action: { action: 'toggle' }, grid_options: { columns: 6 } } },
  light_tile: { extends: 'tile_base', card: { features: [{ type: 'light-brightness' }] } },
  room_light_tile: { extends: 'light_tile', card: { name: '[[name]]', icon: '[[icon]]', color: '[[colour]]' } },
  hall_light_tile: { extends: 'room_light_tile', card: { name: 'Hall' } },
  sensor_tile: { extends: 'tile_base', card: { tap_action: null, state_content: 'state' } },
  old_tile: { extends: 'tile_base', deprecated: 'use sensor_tile', card: {} },
  loner: { card: { type: 'markdown' } },
  orphan: { extends: 'gone', card: { type: 'tile' } },
};
// The base sets nothing the children change, so what counts as a change is read off light_tile.
templates.light_tile.card.name = 'Light';

const usage = (name) =>
  ({ tile_base: 0, light_tile: 2, room_light_tile: 6, hall_light_tile: 1, sensor_tile: 9, old_tile: 1 })[name] ?? 0;
const roots = extendsFamilies(templates, usage);

check(
  'roots are the templates with children and no parent, plus one whose parent is missing; a loner is no family',
  roots.map((root) => root.name),
  ['orphan', 'tile_base'],
);
const base = roots.find((root) => root.name === 'tile_base');
check('a root says what it sets', base.sets, ['type', 'tap_action', 'grid_options']);
check(
  'children hang in order, with their uses',
  base.children.map((child) => [child.name, child.uses]),
  [
    ['light_tile', 2],
    ['old_tile', 1],
    ['sensor_tile', 9],
  ],
);
const room = base.children[0].children[0];
check(
  'a child says what it changes and adds against the merged parent',
  [room.name, room.changes, room.adds, room.drops],
  ['room_light_tile', ['name'], ['icon', 'color'], []],
);
check('a null drops a key', base.children[2].drops, ['tap_action']);
check('deprecated is carried', base.children[1].deprecated, true);
check('a missing parent is named', roots[0].missingParent, 'gone');
check(
  'familyOf finds the tree holding a name, and nothing for a loner',
  [familyOf(roots, 'hall_light_tile').name, familyOf(roots, 'loner')],
  ['tile_base', undefined],
);
check(
  'layers run from the root to the template',
  layersOf(templates, 'hall_light_tile').map((layer) => [layer.from, Object.keys(layer.content)]),
  [
    ['tile_base', ['type', 'tap_action', 'grid_options']],
    ['light_tile', ['features', 'name']],
    ['room_light_tile', ['name', 'icon', 'color']],
    ['hall_light_tile', ['name']],
  ],
);
check('a family is counted in templates and cards', familySize(base), { templates: 6, cards: 19 });
