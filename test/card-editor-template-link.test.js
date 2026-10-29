/*
 * Idea 20: the way from a card to its template and back. Pure parts.
 */
const { check } = require('./check');
const {
  templateCardPath,
  stashReturn,
  takeReturn,
  dashboardHref,
} = require('../.test-build/card-editor/template-link');

// The same dashboard the picker tests use: a masonry view, then a sections view.
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

check('a template card in a masonry view', templateCardPath(ll, 'room_light_tile'), undefined);
check('a template card in a section', templateCardPath(ll, 'camera_tile'), [1, 0, 1]);
check(
  'a template card in a masonry view has a two-part address',
  templateCardPath(
    { views: [{ cards: [{ type: 'tile' }, { type: 'custom:decluttering-template-plus', template: 'x' }] }] },
    'x',
  ),
  [0, 1],
);
check('a template nowhere', templateCardPath(ll, 'nope'), undefined);
check('no dashboard', templateCardPath(undefined, 'x'), undefined);

const store = (() => {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
})();
const opened = { type: 'custom:decluttering-card-plus', template: 'tile' };
stashReturn(
  { config: { ...opened, variables: [{ name: 'Hall' }] }, openedWith: opened, template: 'tile' },
  store,
  1000,
);
check('a ticket for another card is left alone', takeReturn({ type: 'tile' }, store, 2000), undefined);
check('the ticket for this card comes back', takeReturn(opened, store, 2000).config.variables, [{ name: 'Hall' }]);
check('and only once', takeReturn(opened, store, 2000), undefined);
stashReturn({ config: opened, openedWith: opened, template: 'tile' }, store, 1000);
check('a stale ticket is thrown away', takeReturn(opened, store, 1000 + 31 * 60 * 1000), undefined);
check('the default dashboard address', dashboardHref('lovelace'), '/lovelace');
check('another dashboard address', dashboardHref('/upstairs'), '/upstairs');
