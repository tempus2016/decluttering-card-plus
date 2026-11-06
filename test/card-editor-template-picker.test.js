/*
 * Idea 21: the template combo box, and the borrowed-from record it groups by. Pure parts.
 */
const { check } = require('./check');
const {
  pickerItems,
  filterPickerItems,
  groupHeading,
  countText,
} = require('../.test-build/card-editor/template-picker');
const { borrowedFrom, recordBorrowed } = require('../.test-build/templates');

const templates = {
  zebra: { card: {}, description: 'Last by name' },
  room_light_tile: { card: {}, description: 'A tile per light' },
  sensor_line: { row: {}, category: 'Sensors' },
  camera_tile: { card: {}, category: 'Cameras', description: 'One camera' },
  old_tile: { card: {}, deprecated: 'Use room_light_tile', category: 'Cameras' },
  shared_one: { card: {}, description: 'From the library' },
  cam_item: { item: { type: 'tile' } },
};
const ll = {
  views: [
    {
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'room_light_tile' },
        { type: 'custom:decluttering-card-plus', template: 'room_light_tile' },
      ],
    },
    {
      sections: [
        {
          cards: [
            { type: 'custom:decluttering-card-plus', template: 'zebra' },
            { type: 'custom:decluttering-template-plus', template: 'camera_tile', card: {} },
          ],
        },
      ],
    },
  ],
};
const items = pickerItems(templates, ll, undefined, (name) =>
  name === 'shared_one' ? 'decluttering-templates' : undefined,
);
check(
  'uncategorised first by name, then categories, deprecated last in its group, borrowed last of all; item templates left out',
  items.map((i) => i.value),
  ['room_light_tile', 'zebra', 'camera_tile', 'old_tile', 'sensor_line', 'shared_one'],
);
check('the count is how many cards use it', items.find((i) => i.value === 'room_light_tile').count, 2);
check(
  'a deprecated template shows its note as the description',
  items.find((i) => i.value === 'old_tile').description,
  'Use room_light_tile',
);
check(
  'typing filters by name and description, the deprecation note included',
  filterPickerItems(items, 'LIGHT').map((i) => i.value),
  ['room_light_tile', 'old_tile'],
);
check(
  'two words both have to match',
  filterPickerItems(items, 'cam one').map((i) => i.value),
  ['camera_tile'],
);
check('nothing typed shows everything', filterPickerItems(items, '  ').length, items.length);
check('the first of a category opens its heading', groupHeading(items[2], items[1]), 'Cameras');
check('the second does not', groupHeading(items[3], items[2]), undefined);
check('an uncategorised item has no heading', groupHeading(items[0], undefined), undefined);
check('a borrowed item says where from', groupHeading(items[5], items[4]), 'Borrowed from decluttering-templates');
check('unused is said as a hint', countText(0), 'unused');
check('used once', countText(1), 'used by 1 card');
check('used many', countText(3), 'used by 3 cards');

// --- the borrowed-from record used by the picker

recordBorrowed({ one: 'upstairs', two: 'decluttering-templates' }, ['two']);
check('a borrowed template remembers its dashboard', borrowedFrom('one'), 'upstairs');
check('a name this dashboard defines itself is not borrowed', borrowedFrom('two'), undefined);
check('an unknown name is not borrowed', borrowedFrom('three'), undefined);
