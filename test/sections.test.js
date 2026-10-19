/*
 * Unit tests for the section half of the declutter picker in src/templates.ts.
 * Run with `npm test`.
 */
const {
  listSections,
  replaceSectionCards,
  groupCards,
  withGroupCards,
  moveItem,
} = require('../.test-build/templates.js');

const { check, report } = require('./harness');

const tiles = [
  { type: 'heading', heading: 'Kitchen' },
  { type: 'tile', entity: 'light.kitchen' },
];
const ll = {
  views: [
    {
      title: 'Home',
      sections: [
        { type: 'grid', cards: tiles },
        { type: 'grid', cards: [] },
      ],
    },
    { title: 'Old', cards: [{ type: 'markdown' }] },
    {
      title: 'Defs',
      sections: [{ type: 'grid', cards: [{ type: 'custom:decluttering-template-plus', template: 't' }] }],
    },
  ],
};

check(
  'sections with cards are listed, named by view, place and heading',
  listSections(ll).map((each) => [each.label, each.view, each.section, each.cards.length]),
  [['Home · 1 (Kitchen)', 0, 0, 2]],
);
check('no dashboard, no sections', listSections(undefined), []);

const replaced = replaceSectionCards(ll, 0, 0, tiles, [{ type: 'custom:decluttering-card-plus', template: 'kitchen' }]);
check('the section now holds the one card', replaced.views[0].sections[0].cards, [
  { type: 'custom:decluttering-card-plus', template: 'kitchen' },
]);
check('the rest of the section is kept', replaced.views[0].sections[0].type, 'grid');
check('other views are untouched', replaced.views[1], ll.views[1]);
check('the original is not mutated', ll.views[0].sections[0].cards.length, 2);
check(
  'a section changed since it was picked is left alone',
  replaceSectionCards(ll, 0, 0, [tiles[0]], [{ type: 'x' }]) === ll,
  true,
);
check('a section that is gone is left alone', replaceSectionCards(ll, 0, 5, tiles, []) === ll, true);

check('a bare group is its cards', groupCards([1, 2]), [1, 2]);
check('a written-out group has its cards', groupCards({ cards: [1], grid_options: {} }), [1]);
check('anything else has none', groupCards('x'), []);
check('a bare group stays bare', withGroupCards([1], [2]), [2]);
check('a written-out group keeps its other keys', withGroupCards({ cards: [1], grid_options: { columns: 6 } }, [2]), {
  cards: [2],
  grid_options: { columns: 6 },
});
check('moving down', moveItem(['a', 'b', 'c'], 0, 2), ['b', 'c', 'a']);
check('moving up', moveItem(['a', 'b', 'c'], 2, 0), ['c', 'a', 'b']);
const list = ['a'];
check('out of range is the same list', moveItem(list, 0, 3) === list, true);

report();
