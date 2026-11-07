/*
 * The template gallery (idea 52): tiles from three sources, filtered, with thumbnails built
 * against the sample house.
 */
const { check } = require('./check');
const {
  galleryEntries,
  galleryCategories,
  filterGallery,
  galleryCounts,
  thumbnailConfig,
  categoryOf,
  thumbnailHass,
} = require('../.test-build/gallery');
const { LIBRARY } = require('../.test-build/library');
const { SAMPLE_HOUSE } = require('../.test-build/playground');

const community = [
  {
    id: 42,
    title: 'Camera card with snapshot',
    author: 'dstrohl',
    url: 'https://github.com/x/discussions/42',
    name: 'camera_card',
    template: {
      description: 'A camera with its last snapshot.',
      category: 'Cameras',
      variables: [{ name: 'camera' }],
      card: { type: 'custom:advanced-camera-card', cameras: [{ camera_entity: '[[camera]]' }] },
    },
    includes: { camera_row: { row: { entity: '[[camera]]' } } },
    reactions: 3,
    updated: '2026-10-01T00:00:00Z',
  },
  {
    id: 43,
    title: 'Status badge',
    author: 'someone',
    url: 'https://github.com/x/discussions/43',
    name: 'status_badge',
    template: { badge: { type: 'entity', entity: '[[entity]]' } },
    includes: {},
    reactions: 0,
    updated: '2026-10-02T00:00:00Z',
  },
];
const installed = {
  room_light_tile: { ...LIBRARY[0].template, source: { library: 'room_light_tile', version: '2.2.0' } },
  hand_written: { card: { type: 'tile', entity: 'light.a' } },
  from_post: {
    card: { type: 'tile', entity: '[[e]]' },
    source: { url: 'https://github.com/x/discussions/9', author: 'ann', discussion: 9 },
  },
};
const entries = galleryEntries({ library: LIBRARY, community, installed }, (name) => `summary of ${name}`);

check('one tile per library entry, per shared post, per installed template with a stamp', galleryCounts(entries), {
  library: LIBRARY.length,
  community: 2,
  installed: 2,
});
check('keys are unique', new Set(entries.map((e) => e.key)).size, entries.length);
const lib = entries.find((e) => e.key === 'library:room_light_tile');
check(
  'a library tile keeps its description and counts its variables',
  [lib.description, lib.variables, lib.kind, lib.source],
  [LIBRARY[0].template.description, 2, 'card', 'library'],
);
check(
  'a library entry without a description gets the summary',
  entries.filter((e) => e.source === 'library').every((e) => e.description.length > 0),
  true,
);
const cam = entries.find((e) => e.key === 'community:42');
check(
  'a shared tile carries its post, author and category',
  [cam.title, cam.author, cam.category, cam.customCards, Object.keys(cam.includes)],
  ['Camera card with snapshot', 'dstrohl', 'Cameras', ['custom:advanced-camera-card'], ['camera_row']],
);
check('a badge template is filed under Badges', entries.find((e) => e.key === 'community:43').category, 'Badges');
check('an installed tile says where it came from', entries.find((e) => e.key === 'installed:from_post').author, 'ann');
check(
  'a hand-written template is not a tile',
  entries.some((e) => e.name === 'hand_written'),
  false,
);

check(
  'categories in first-seen order, each once',
  galleryCategories(entries).length,
  new Set(galleryCategories(entries)).size,
);
check(
  'a repeat is filed under Repeats unless it says otherwise',
  categoryOf({ card: { type: 'grid', cards: [], for_each_from: { areas: true } } }),
  'Repeats',
);
check('a plain card is a Card', categoryOf({ card: { type: 'tile' } }), 'Cards');
check('a group is a Group', categoryOf({ group: [{ type: 'tile' }] }), 'Groups');
check('category: wins', categoryOf({ category: ' Rooms ', card: { type: 'tile' } }), 'Rooms');

check('filtering by source', filterGallery(entries, { source: 'community' }).length, 2);
check(
  'filtering by category',
  filterGallery(entries, { category: 'Cameras' }).map((e) => e.key),
  ['community:42'],
);
check(
  'searching reads the custom card too',
  filterGallery(entries, { query: 'advanced-camera' }).map((e) => e.key),
  ['community:42'],
);
check('searching reads the author', filterGallery(entries, { query: 'DSTROHL' }).length, 1);
check('searching reads the description', filterGallery(entries, { query: 'snapshot' }).length, 1);
check('an empty search is everything', filterGallery(entries, { query: '  ' }).length, entries.length);

const thumb = thumbnailConfig(lib);
check(
  'a card thumbnail is the template built against the sample house',
  [thumb.type, thumb.entity],
  ['tile', LIBRARY[0].template.variables[0].default ?? thumb.entity],
);
check(
  'a thumbnail never carries the repeat',
  'for_each_from' in (thumbnailConfig(entries.find((e) => e.repeats) ?? lib) ?? {}),
  false,
);
check('a badge has no thumbnail', thumbnailConfig(entries.find((e) => e.key === 'community:43')), undefined);
check(
  'a group shows its first card',
  thumbnailConfig({ ...lib, kind: 'group', template: { group: [{ type: 'markdown', content: 'hi' }] } }),
  { type: 'markdown', content: 'hi' },
);
check(
  "the thumbnail hass has the sample entities and the page's functions",
  (() => {
    const h = thumbnailHass({ localize: () => 'x', states: { 'light.real': {} } });
    return [typeof h.localize, 'light.real' in h.states, 'light.kitchen_ceiling' in h.states, 'kitchen' in h.areas];
  })(),
  ['function', false, true, true],
);
check('no hass, no thumbnail hass', thumbnailHass(undefined), undefined);
check('the sample house is what the playground uses', Object.keys(SAMPLE_HOUSE.states).length >= 4, true);

/* ------------------------------------------- thumbnails against the sample house (idea 52, round 1) */
{
  const { sampleVariables, galleryTemplates } = require('../.test-build/gallery');
  const tile = thumbnailConfig(lib);
  check('a declared entity with no example is filled from the sample house', tile.entity, 'light.kitchen_ceiling');
  check('and the name reads the sample entity', tile.name, 'Kitchen ceiling');
  const summary = entries.find((e) => e.name === 'room_summary');
  const stack = thumbnailConfig(summary, galleryTemplates(entries));
  check(
    'an undeclared name the sample house knows is filled in',
    stack.cards[0].content.startsWith('## Kitchen'),
    true,
  );
  check(
    'a card inside that uses another template is built from the gallery, not the page',
    [stack.cards[1].type, stack.cards[1].entity],
    ['tile', 'light.kitchen_ceiling'],
  );
  check(
    'the sample values give a declared text its default over a sample',
    sampleVariables({ variables: [{ name: 'when', default: 'on' }] }, {}),
    [],
  );
  check(
    'a domain filter on the selector picks a sample of that domain',
    sampleVariables({ variables: [{ name: 'sensor', selector: { entity: { domain: 'sensor' } } }] }, {}),
    [{ sensor: 'sensor.garden_temperature' }],
  );
  check(
    'every gallery template is known by name, with the bundled ones',
    Object.keys(galleryTemplates(entries)).includes('room_light_tile'),
    true,
  );
}
