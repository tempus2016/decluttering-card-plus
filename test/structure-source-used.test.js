/*
 * The list a `repeat:` works through and the mapping a `with:` lays over are read by the
 * template, so a card that passes them is not told they are unused.
 */
const { diagnoseInstance, structureSource } = require('../.test-build/variables.js');
const { readsIn } = require('../.test-build/unread.js');

const { check } = require('./check');

const list = [{ entity: 'light.a' }];
const twoLine = { default: [{ tmp: '[[entity]]' }], card: { type: 'entities', entities: '[[tmp|repeat:my_list]]' } };

check('a repeat list the card passes is not unused', diagnoseInstance([{ my_list: list }], twoLine).unused, []);

check(
  'a with: mapping the card passes is not unused',
  diagnoseInstance([{ front: { cam: 'camera.a' } }], {
    default: [{ row: { camera_entity: '[[cam]]' } }],
    card: { type: 'x', cameras: ['[[row|with:front]]'] },
  }).unused,
  [],
);

check(
  'with: pairs name no variable of their own',
  diagnoseInstance([{ cam: 'x' }], {
    default: [{ row: { camera_entity: '[[cam]]' } }],
    card: { type: 'x', cameras: ['[[row|with:cam=camera.a]]'] },
  }).unused,
  [],
);

check(
  'something passed and never read is still unused',
  diagnoseInstance([{ my_list: list }, { stray: 1 }], twoLine).unused,
  ['stray'],
);

check(
  'a repeat after a condition and |flat still counts its list',
  diagnoseInstance([{ my_list: list }, { on: true }], {
    default: [{ tmp: '[[entity]]' }],
    card: { entities: '[[tmp|repeat:my_list|flat|if:on]]' },
  }).unused,
  [],
);

check('readsIn counts the repeat list', readsIn({ e: '[[tmp|repeat:my_list]]' }).sort(), ['my_list', 'tmp']);
check('readsIn counts a with: mapping', readsIn({ e: '[[row|with:front]]' }).sort(), ['front', 'row']);
check('readsIn does not count with: pairs as names', readsIn({ e: '[[row|with:a=1,b=2]]' }), ['row']);

check('structureSource: repeat list', structureSource('repeat:my_list'), 'my_list');
check('structureSource: bare repeat names nothing', structureSource('repeat'), undefined);
check('structureSource: empty repeat names nothing', structureSource('repeat:'), undefined);
check('structureSource: with mapping', structureSource('with:front'), 'front');
check('structureSource: with pairs name nothing', structureSource('with:a=1'), undefined);
check('structureSource: other steps name nothing', structureSource('upper'), undefined);
