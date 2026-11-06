/*
 * Unit tests for src/compare.ts - Compare with another version (idea 30).
 * Run with `npm test`.
 */
const { compareSources, diffStats, templateBody, agoParts } = require('../.test-build/compare.js');

const { check } = require('./check');

const labels = {
  library: (name) => `Starter library: ${name}`,
  shared: (title, author) => `Shared: ${title} by ${author}`,
  elsewhere: (urlPath) => `On ${urlPath}`,
  trash: (ago, reason) => `Trash, ${reason} ${ago}`,
  ago: (ms) => `${Math.round(ms / 60000)} min ago`,
};
const now = 10_000_000;
const sources = compareSources('room_light_tile', {
  library: [
    { name: 'sensor_line', summary: '', template: { row: { entity: 'x' } } },
    { name: 'room_light_tile', summary: '', template: { card: { type: 'tile' } } },
  ],
  installed: [
    {
      name: 'room_light_tile',
      status: 'update',
      entry: { id: 7, title: 'My tile', author: 'ann' },
      latest: { template: 'room_light_tile', card: { type: 'tile', icon: 'mdi:x' } },
    },
    { name: 'other', status: 'update', entry: { id: 8, title: 'Other', author: 'bob' }, latest: { card: {} } },
  ],
  elsewhere: [{ urlPath: 'upstairs', template: { template: 'room_light_tile', card: { type: 'tile', name: 'Up' } } }],
  trash: [
    {
      name: 'room_light_tile',
      dashboard: 'lovelace',
      template: { card: { type: 'tile' } },
      reason: 'replaced',
      at: now - 3 * 60000,
    },
    {
      name: 'room_light_tile',
      dashboard: 'lovelace',
      template: { card: { type: 'tile', old: true } },
      reason: 'removed',
      at: now - 60 * 60000,
    },
    { name: 'other', dashboard: 'lovelace', template: {}, reason: 'removed', at: now },
  ],
  now,
  labels,
});

check(
  'sources come matching library first, then the rest of the library, the shared post, other dashboards, trash newest first',
  sources.map((s) => s.id),
  [
    'library:room_light_tile',
    'library:sensor_line',
    'shared:7',
    'elsewhere:upstairs',
    'trash:9820000',
    'trash:6400000',
  ],
);
check(
  'labels name the source in words',
  sources.map((s) => s.label),
  [
    'Starter library: room_light_tile',
    'Starter library: sensor_line',
    'Shared: My tile by ann',
    'On upstairs',
    'Trash, replaced 3 min ago',
    'Trash, removed 60 min ago',
  ],
);
check('a template body drops its name and type', templateBody({ template: 't', type: 'custom:x', card: { a: 1 } }), {
  card: { a: 1 },
});
check(
  'diff stats count added and removed lines and the places they sit in',
  diffStats({ card: { type: 'tile', icon: 'a', name: 'n' } }, { card: { type: 'tile', icon: 'b' } }),
  { added: 2, removed: 1, places: 1 },
);
check('no difference is all zeros', diffStats({ card: { a: 1 } }, { template: 'x', card: { a: 1 } }), {
  added: 0,
  removed: 0,
  places: 0,
});
check(
  'ago picks minutes, hours or days',
  [agoParts(5 * 60000), agoParts(3 * 3600000), agoParts(72 * 3600000)],
  [
    { count: 5, unit: 'minute' },
    { count: 3, unit: 'hour' },
    { count: 3, unit: 'day' },
  ],
);
