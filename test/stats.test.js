/*
 * Unit tests for src/stats.ts - build statistics in the health panel (idea 60).
 * Run with `npm test`.
 */
const { buildStats, snapshotOf, sortRows, statsAsMarkdown } = require('../.test-build/stats.js');

const { check } = require('./check');

const entries = [
  { template: 'camera_card', copies: 1, ms: 31, view: 'Cameras' },
  { template: 'camera_card', copies: 1, ms: 25, view: 'Cameras' },
  { template: 'room_light_tile', name: 'Hall', copies: 1, ms: 4, view: 'Rooms' },
  { template: 'room_light_tile', name: 'Hall', copies: 1, ms: 3, view: 'Rooms', follows: true },
  { template: 'room_light_tile', name: 'Hall', copies: 1, ms: 3, view: 'Rooms', follows: true },
  { template: 'sensor_line', copies: 1, ms: 2, view: 'Home' },
  { template: 'sensor_line', copies: 1, ms: 2, view: 'Rooms' },
];
const stats = buildStats(entries);

check('the counters', [stats.cardsBuilt, stats.templatesInUse, stats.totalMs, stats.rebuiltOnState], [4, 3, 70, 2]);
check(
  'rows by total, with every view a template was built in',
  stats.rows.map((row) => [row.template, row.views, row.builds, row.total, row.slowest]),
  [
    ['camera_card', ['Cameras'], 2, 56, 31],
    ['room_light_tile', ['Rooms'], 3, 10, 4],
    ['sensor_line', ['Home', 'Rooms'], 2, 4, 2],
  ],
);
check(
  'against a snapshot, each row says how it moved and why when it can tell',
  buildStats(entries, {
    camera_card: { total: 16, builds: 2 },
    room_light_tile: { total: 22, builds: 6 },
    sensor_line: { total: 4, builds: 2 },
  }).rows.map((row) => [row.template, row.delta, row.reason]),
  [
    ['camera_card', 40, undefined],
    ['room_light_tile', -12, 'lazy'],
    ['sensor_line', 0, undefined],
  ],
);
check('a snapshot keeps totals and builds per template', snapshotOf(stats), {
  camera_card: { total: 56, builds: 2 },
  room_light_tile: { total: 10, builds: 3 },
  sensor_line: { total: 4, builds: 2 },
});
check(
  'sorting by a column',
  [sortRows(stats.rows, 'template').map((r) => r.template), sortRows(stats.rows, 'builds').map((r) => r.template)],
  [
    ['camera_card', 'room_light_tile', 'sensor_line'],
    ['room_light_tile', 'camera_card', 'sensor_line'],
  ],
);
check(
  'markdown has a heading row, a rule and one line per template',
  statsAsMarkdown(stats, ['Template', 'View', 'Builds', 'Total', 'Slowest', 'Since']).split('\n'),
  [
    '| Template | View | Builds | Total | Slowest | Since |',
    '| --- | --- | --- | --- | --- | --- |',
    '| camera_card | Cameras | 2 | 56 ms | 31 ms |  |',
    '| room_light_tile | Rooms | 3 | 10 ms | 4 ms |  |',
    '| sensor_line | Home, Rooms | 2 | 4 ms | 2 ms |  |',
  ],
);
check('nothing built is all zeros', buildStats([]), {
  cardsBuilt: 0,
  templatesInUse: 0,
  totalMs: 0,
  rebuiltOnState: 0,
  rows: [],
});

// Two cards using one template in one view are two cards, once the builds say which card made them.
{
  const t = (card, follows) => ({
    template: 'room_light_tile',
    copies: 1,
    ms: 1,
    view: 'Home',
    card,
    ...(follows ? { follows: true } : {}),
  });
  const stats = buildStats([t(1), t(2), t(3), t(4)]);
  check('four cards of one template in one view count as four', stats.cardsBuilt, 4);
  check('and as one template', stats.templatesInUse, 1);
  check(
    'a second build of the same following card is a rebuild',
    buildStats([t(1, true), t(1, true), t(2, true)]).rebuiltOnState,
    1,
  );
  check(
    'builds without a card number still count by template and view',
    buildStats([
      { template: 'a', copies: 1, ms: 1, view: 'V' },
      { template: 'a', copies: 1, ms: 1, view: 'V' },
    ]).cardsBuilt,
    1,
  );
}
