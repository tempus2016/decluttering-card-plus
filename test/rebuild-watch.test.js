/*
 * #411, opt-in: rebuild_on entries and cards that say which parts of a state count as a change.
 * Nothing said must compare exactly as before.
 */
const { check } = require('./check');
const {
  parseWatch,
  mergeWatch,
  watchedParts,
  stateSnapshot,
  statesMoved,
  rebuildOnEntities,
  rebuildOnRejects,
} = require('../.test-build/rebuild.js');
const { rebuildOnFor, rebuildOnEach } = require('../.test-build/rebuild-resolve.js');
const { stateReads } = require('../.test-build/variables.js');

const camera = (extra = {}) => ({
  state: 'idle',
  last_changed: '2026-11-08T10:00:00+00:00',
  last_updated: '2026-11-08T10:00:00+00:00',
  attributes: { camera_name: 'Front_Door', access_token: 'aaa', ...extra.attributes },
  ...extra,
  ...(extra.attributes ? { attributes: { camera_name: 'Front_Door', access_token: 'aaa', ...extra.attributes } } : {}),
});
const hassWith = (state) => ({ states: { 'camera.front': state } });
const tokenRefresh = camera({ attributes: { access_token: 'bbb' }, last_updated: '2026-11-08T10:05:00+00:00' });
const renamed = camera({ attributes: { camera_name: 'Porch' }, last_updated: '2026-11-08T10:05:00+00:00' });

// parseWatch
check('nothing said is the default', parseWatch(undefined), undefined);
check('all is the default', parseWatch('all'), undefined);
check('all in a list is the default', parseWatch(['state', 'all']), undefined);
check('read', parseWatch('read'), { read: true, parts: [] });
check('a bare attribute name', parseWatch('camera_name'), { read: false, parts: ['attr:camera_name'] });
check('a list of parts', parseWatch(['state', 'attr:camera_name', 'camera_name', 'last_updated']), {
  read: false,
  parts: ['state', 'attr:camera_name', 'last_updated'],
});
check('read with extra parts', parseWatch(['read', 'friendly_name']), { read: true, parts: ['attr:friendly_name'] });
check('nonsense names nothing, so the default', parseWatch(['not a name!', 3]), undefined);

// mergeWatch
check('default wins a merge', mergeWatch(undefined, { read: true, parts: [] }), undefined);
check('two lists merge', mergeWatch({ read: false, parts: ['state'] }, { read: true, parts: ['attr:a', 'state'] }), {
  read: true,
  parts: ['state', 'attr:a'],
});

// watchedParts
const reads = { attributes: ['camera_name'], lastUpdated: false, unknown: false };
check('default stays default', watchedParts(undefined, reads), undefined);
check('read is the state and what is read', watchedParts({ read: true, parts: [] }, reads), [
  'state',
  'attr:camera_name',
]);
check(
  'read takes last_updated when it is read',
  watchedParts({ read: true, parts: [] }, { attributes: [], lastUpdated: true, unknown: false }),
  ['state', 'last_updated'],
);
check(
  'read with an attribute named by a placeholder is the default',
  watchedParts({ read: true, parts: [] }, { attributes: [], lastUpdated: false, unknown: true }),
  undefined,
);
check('a list is itself', watchedParts({ read: false, parts: ['attr:camera_name'] }, undefined), ['attr:camera_name']);

// stateSnapshot: the default is unchanged
const ids = ['camera.front'];
check('default, no attr: state only', stateSnapshot(hassWith(camera()), ids, false), ['idle']);
check('default, attr: state and last_updated', stateSnapshot(hassWith(camera()), ids, true), [
  'idle\u00002026-11-08T10:00:00+00:00',
]);
check('an empty watched list is the default', stateSnapshot(hassWith(camera()), ids, true, []), [
  'idle\u00002026-11-08T10:00:00+00:00',
]);
check('an undefined entry is the default', stateSnapshot(hassWith(camera()), ids, false, [undefined]), ['idle']);
check(
  'default with attr: still moves on a token refresh',
  statesMoved(stateSnapshot(hassWith(camera()), ids, true), stateSnapshot(hassWith(tokenRefresh), ids, true)),
  true,
);
check('a missing entity is undefined', stateSnapshot({ states: {} }, ids, true, [['state']]), [undefined]);

// stateSnapshot: watched parts
const watch = [['state', 'attr:camera_name']];
const snap = (state) => stateSnapshot(hassWith(state), ids, true, watch);
check('watched: a token refresh is no change', statesMoved(snap(camera()), snap(tokenRefresh)), false);
check('watched: the watched attribute is', statesMoved(snap(camera()), snap(renamed)), true);
check('watched: the state is', statesMoved(snap(camera()), snap(camera({ state: 'unavailable' }))), true);
check(
  'watched: an object attribute compares by value',
  statesMoved(
    stateSnapshot(hassWith(camera({ attributes: { list: [1, 2] } })), ids, false, [['attr:list']]),
    stateSnapshot(hassWith(camera({ attributes: { list: [1, 2] } })), ids, false, [['attr:list']]),
  ),
  false,
);

// entries written as {entity, watch}
check('an object entry is an entity', rebuildOnEntities([{ entity: 'camera.front', watch: 'read' }, 'sun.sun']), [
  'camera.front',
  'sun.sun',
]);
check('an object entry is not a reject', rebuildOnRejects([{ entity: 'camera.front' }]), []);
check('an object with a bad entity is', rebuildOnRejects([{ entity: 'nope' }]), ['{"entity":"nope"}']);

const template = (extra = {}) => ({
  variables: [{ name: 'camera', selector: { entity: {} } }],
  card: { type: 'markdown', content: '[[camera|attr:camera_name]]' },
  ...extra,
});
const hass = hassWith(camera());

check('plain strings watch the default', rebuildOnFor({ rebuild_on: ['camera.front', 'sun.sun'] }, template(), hass), {
  entities: ['camera.front', 'sun.sun'],
  rejects: [],
  watch: [undefined, undefined],
});
check(
  'an entry says what it watches',
  rebuildOnFor({ rebuild_on: [{ entity: 'camera.front', watch: ['state', 'camera_name'] }] }, template(), hass).watch,
  [{ read: false, parts: ['state', 'attr:camera_name'] }],
);
check(
  'a placeholder entity is filled, and keeps its watch',
  rebuildOnFor(
    { rebuild_on: [{ entity: '[[camera]]', watch: 'read' }], variables: [{ camera: 'camera.front' }] },
    template(),
    hass,
  ),
  { entities: ['camera.front'], rejects: [], watch: [{ read: true, parts: [] }] },
);
check(
  'the card rebuild_on_watch covers every entry',
  rebuildOnFor({ rebuild_on: ['camera.front'], rebuild_on_watch: 'read' }, template({ rebuild_on: 'sun.sun' }), hass)
    .watch,
  [
    { read: true, parts: [] },
    { read: true, parts: [] },
  ],
);
check(
  'the template rebuild_on_watch covers a card that says nothing',
  rebuildOnFor(
    { rebuild_on: '[[camera]]', variables: [{ camera: 'camera.front' }] },
    template({ rebuild_on_watch: 'read' }),
    hass,
  ).watch,
  [{ read: true, parts: [] }],
);
check(
  'the card all beats the template read',
  rebuildOnFor({ rebuild_on: 'camera.front', rebuild_on_watch: 'all' }, template({ rebuild_on_watch: 'read' }), hass)
    .watch,
  [undefined],
);
check(
  'an entry beats its card',
  rebuildOnFor({ rebuild_on: [{ entity: 'camera.front', watch: 'all' }], rebuild_on_watch: 'read' }, template(), hass)
    .watch,
  [undefined],
);
check(
  'the same entity twice watches the wider',
  rebuildOnFor(
    { rebuild_on: [{ entity: 'camera.front', watch: 'camera_name' }] },
    template({ rebuild_on: [{ entity: 'camera.front', watch: ['state'] }] }),
    hass,
  ).watch,
  [{ read: false, parts: ['attr:camera_name', 'state'] }],
);
check(
  'an object with no entity is a reject',
  rebuildOnFor({ rebuild_on: [{ watch: 'read' }] }, template(), hass).rejects,
  ['{"watch":"read"}'],
);
check(
  'rebuildOnEach keeps the object as written',
  rebuildOnEach({ rebuild_on: [{ entity: 'camera.front', watch: 'read' }] }, template(), hass)[0].entry,
  { entity: 'camera.front', watch: 'read' },
);

// stateReads
check('what a template reads', stateReads(template()), {
  attributes: ['camera_name'],
  lastUpdated: false,
  unknown: false,
});
check(
  'several attributes and last_updated',
  stateReads({
    card: {
      type: 'markdown',
      content: '[[a|attr:x]] [[a|attr:y|default:[[b]]]] [[a|last_updated|relative]] [[a|attr:x]]',
    },
  }),
  { attributes: ['x', 'y'], lastUpdated: true, unknown: false },
);
check(
  'an attribute named by a placeholder is unknown',
  stateReads({ card: { type: 'markdown', content: '[[a|attr:[[which]]]]' } }).unknown,
  true,
);
check('nothing read', stateReads({ card: { type: 'markdown', content: '[[a|state]]' } }), {
  attributes: [],
  lastUpdated: false,
  unknown: false,
});
