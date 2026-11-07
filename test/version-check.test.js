/*
 * Unit tests for src/version-check.ts (idea 43): what a template's version lets the health panel say.
 */
const {
  templateVersion,
  changeNotes,
  replacementIn,
  versionNote,
  withVersionNotes,
  olderElsewhere,
  renameVariableOnCards,
} = require('../.test-build/version-check.js');

const { check } = require('./check');

const tile = {
  version: 3,
  changes: { 3: 'show_brightness is now brightness_mode', 2: "icon defaults to the entity's own" },
  variables: [{ name: 'entity' }, { name: 'brightness_mode' }],
  card: { type: 'tile' },
};

check(
  'the version as a number, however written',
  [templateVersion(tile), templateVersion({ version: '4' }), templateVersion({})],
  [3, 4, undefined],
);
check('change notes newest first', changeNotes(tile), [
  { version: 3, note: 'show_brightness is now brightness_mode' },
  { version: 2, note: "icon defaults to the entity's own" },
]);
check(
  'a note can be a list, and a key that is not a number is skipped',
  changeNotes({ changes: { 2: ['a', 'b'], x: 'c' } }),
  [
    { version: 2, note: 'a' },
    { version: 2, note: 'b' },
  ],
);

check(
  'the replacement a note names, in the ways people write it',
  [
    replacementIn('show_brightness is now brightness_mode', 'show_brightness'),
    replacementIn('`show_brightness` renamed to `brightness_mode`', 'show_brightness'),
    replacementIn('show_brightness -> brightness_mode', 'show_brightness'),
    replacementIn('show_brightness → brightness_mode, which takes slider, text or none', 'show_brightness'),
    replacementIn('show_brightness was removed', 'show_brightness'),
  ],
  ['brightness_mode', 'brightness_mode', 'brightness_mode', 'brightness_mode', undefined],
);

check('the note that explains an unread variable, with its replacement', versionNote(tile, 'show_brightness'), {
  version: 3,
  note: 'show_brightness is now brightness_mode',
  replacement: 'brightness_mode',
});
check('a variable no note mentions has no story', versionNote(tile, 'colour'), undefined);
check(
  'a name is matched as a word, not as part of another',
  versionNote({ changes: { 2: 'icon_size gone' } }, 'icon'),
  undefined,
);

const finding = {
  view: { title: 'Home', path: '', index: 0 },
  template: 'room_light_tile',
  name: 'show_brightness',
  where: 'variables',
  count: 2,
};
check(
  'findings gain the note when their template has one',
  withVersionNotes([finding], { room_light_tile: tile })[0].since,
  {
    version: 3,
    note: 'show_brightness is now brightness_mode',
    replacement: 'brightness_mode',
  },
);
check(
  'and are left alone when it has none',
  withVersionNotes([finding], { room_light_tile: { card: {} } })[0].since,
  undefined,
);

check(
  'a library copy at an older version is named with its dashboard',
  olderElsewhere(
    { room_light_tile: tile, other: { version: 1 } },
    { room_light_tile: { version: 2 }, other: { version: 1 } },
    {
      room_light_tile: 'upstairs',
      other: 'upstairs',
    },
  ),
  [{ template: 'room_light_tile', here: 3, there: 2, dashboard: 'upstairs' }],
);

const ll = {
  views: [
    {
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'room_light_tile', variables: [{ show_brightness: true }] },
        { type: 'custom:decluttering-card-plus', template: 'room_light_tile', variables: [{ entity: 'light.a' }] },
        { type: 'custom:decluttering-card-plus', template: 'other', variables: [{ show_brightness: true }] },
      ],
    },
    {
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'room_light_tile', variables: [{ show_brightness: 1 }] },
      ],
    },
  ],
};
check(
  'the rename reaches the cards of that template, on that view, that pass the name - and nothing else',
  renameVariableOnCards(ll, 0, 'room_light_tile', 'show_brightness', 'brightness_mode').views.map((view) =>
    view.cards.map((card) => JSON.stringify(card.variables)),
  ),
  [['[{"brightness_mode":true}]', '[{"entity":"light.a"}]', '[{"show_brightness":true}]'], ['[{"show_brightness":1}]']],
);
