/*
 * #411: rebuild_on with placeholders, and on the template as well as the card.
 */
const { check } = require('./check');
const { rebuildOnFor, rebuildOnEach, isRebuildPlaceholder } = require('../.test-build/rebuild-resolve.js');

const template = (extra = {}) => ({
  variables: [
    { name: 'camera', selector: { entity: {} } },
    { name: 'lights', default: ['light.a', 'light.b'] },
  ],
  card: { type: 'markdown', content: '[[camera|attr:camera_name]]' },
  ...extra,
});
const hass = {
  states: {
    'camera.front': { state: 'idle', attributes: { camera_name: 'Front_Door' } },
    'input_text.pick': { state: 'camera.back', attributes: {} },
  },
};

check('an entity id is not a placeholder', isRebuildPlaceholder('camera.front'), false);
check('a placeholder is', isRebuildPlaceholder('[[camera]]'), true);

check('the card rebuild_on as before', rebuildOnFor({ rebuild_on: 'camera.front' }, template(), hass).entities, [
  'camera.front',
]);
check(
  'a placeholder in the card rebuild_on is filled from its variables',
  rebuildOnFor({ rebuild_on: '[[camera]]', variables: [{ camera: 'camera.front' }] }, template(), hass).entities,
  ['camera.front'],
);
check(
  'the template rebuild_on counts, filled from the card variables',
  rebuildOnFor({ variables: [{ camera: 'camera.front' }] }, template({ rebuild_on: '[[camera]]' }), hass).entities,
  ['camera.front'],
);
check(
  'the card and the template together, each entity once',
  rebuildOnFor(
    { rebuild_on: ['sun.sun', 'camera.front'], variables: [{ camera: 'camera.front' }] },
    template({ rebuild_on: ['[[camera]]', 'input_select.mode'] }),
    hass,
  ).entities,
  ['sun.sun', 'camera.front', 'input_select.mode'],
);
check(
  'a variable holding a list gives each entity, from a template default',
  rebuildOnFor({}, template({ rebuild_on: '[[lights]]' }), hass).entities,
  ['light.a', 'light.b'],
);
check(
  'a value with steps is filled the same way',
  rebuildOnFor({ variables: [{ room: 'kitchen' }] }, template({ rebuild_on: 'light.[[room]]' }), hass).entities,
  ['light.kitchen'],
);
{
  const found = rebuildOnFor({}, template({ rebuild_on: '[[camera]]' }), hass);
  check('an unset variable watches nothing', found.entities, []);
  check('and says what it could not fill', found.rejects, ['[[camera]]']);
}
check(
  'an optional variable left empty names nothing, and is no mistake',
  rebuildOnFor({}, template({ rebuild_on: '[[camera?]]' }), hass).rejects,
  [],
);
{
  // What a card may read is never decided by a state, or a card could widen its own scope.
  const found = rebuildOnFor(
    { variables: [{ which: 'input_text.pick' }] },
    template({ rebuild_on: ['[[which|state]]', 'input_text.pick'] }),
    hass,
  );
  check('a state in rebuild_on is not read, even of an entity listed beside it', found.entities, ['input_text.pick']);
}
check(
  'something filled in that is not an entity id is said, not watched',
  rebuildOnFor({ variables: [{ camera: 'Front Door' }] }, template({ rebuild_on: '[[camera]]' }), hass),
  { entities: [], rejects: ['Front Door'], watch: [] },
);
check('no card and no template watch nothing', rebuildOnFor(undefined, undefined, hass), {
  entities: [],
  rejects: [],
  watch: [],
});

// The editor lists each entry with what it fills to, and where it is written.
check(
  'each entry of the card and the template, filled in',
  rebuildOnEach(
    { rebuild_on: ['sun.sun', '[[camera]]'], variables: [{ camera: 'camera.front' }] },
    template({ rebuild_on: '[[lights]]' }),
    hass,
  ),
  [
    { entry: 'sun.sun', from: 'card', entities: ['sun.sun'], rejects: [], watch: [undefined] },
    { entry: '[[camera]]', from: 'card', entities: ['camera.front'], rejects: [], watch: [undefined] },
    {
      entry: '[[lights]]',
      from: 'template',
      entities: ['light.a', 'light.b'],
      rejects: [],
      watch: [undefined, undefined],
    },
  ],
);
check(
  'an entry that fills to no entity says what it filled to',
  rebuildOnEach({ rebuild_on: '[[camera]]', variables: [{ camera: 'Front Door' }] }, template(), hass),
  [{ entry: '[[camera]]', from: 'card', entities: [], rejects: ['Front Door'], watch: [] }],
);
check('nothing written, nothing listed', rebuildOnEach({}, template(), hass), []);
