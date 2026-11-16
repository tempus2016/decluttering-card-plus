/*
 * #469: after an edit, the card editor names the fields the card set by hand whose
 * worked-out default moved with the edit, so they no longer follow it.
 */
const { check } = require('./check');
const { changedNames, leftBehind, stillBehind, nextNotes } = require('../.test-build/card-editor/left-behind');

// dstrohl's case: camera drives zone, zone drives every detection's entity.
const itemTemplates = {
  detection: { item: { type: '[[type]]', entity: 'binary_sensor.[[zone]]_[[type]]_occupancy', enabled: true } },
};
const extras = { itemTemplates };
const template = {
  default: [{ detectors: [{ type: 'person' }, { type: 'cat' }] }],
  variables: [
    { name: 'camera', selector: { entity: {} } },
    { name: 'zone', selector: { text: {} }, default: '[[camera|object_id]]' },
    { name: 'detections', selector: { object: {} }, default: '[[detection|repeat:detectors]]' },
    { name: 'stream', selector: { text: {} }, default: '[[camera|object_id]]_stream' },
    { name: 'title', selector: { text: {} }, default: 'Cameras' },
    { name: 'colour', selector: { text: {} } },
  ],
  card: { type: 'entities', entities: '[[detections]]' },
};
const names = ['camera', 'zone', 'detections', 'stream', 'title', 'colour'];
const run = (before, after) => leftBehind(names, before, after, template, undefined, extras);

// The cat switched off: the whole list is now the card's.
const edited = [
  { type: 'person', entity: 'binary_sensor.drive_person_occupancy', enabled: true },
  { type: 'cat', entity: 'binary_sensor.drive_cat_occupancy', enabled: false },
];

check(
  'changedNames finds a changed, an added and a removed value',
  changedNames([{ a: 1 }, { b: 2 }], [{ a: 3 }, { c: 4 }]),
  ['a', 'b', 'c'],
);
check('changedNames finds nothing when nothing changed', changedNames([{ a: [1] }], { a: [1] }), []);

check(
  'changing the zone names the hand-edited detections list built from it',
  run(
    [{ camera: 'camera.drive' }, { zone: 'drive' }, { detections: edited }],
    [{ camera: 'camera.drive' }, { zone: 'gate' }, { detections: edited }],
  ),
  ['detections'],
);

check(
  'changing the camera reaches through the zone the card does not set',
  run([{ camera: 'camera.drive' }, { detections: edited }], [{ camera: 'camera.gate' }, { detections: edited }]),
  ['detections'],
);

check(
  'changing the camera names the zone and the stream set by hand, not the detections the zone shields',
  run(
    [{ camera: 'camera.drive' }, { zone: 'drive' }, { stream: 'drive_stream' }, { detections: edited }],
    [{ camera: 'camera.gate' }, { zone: 'drive' }, { stream: 'drive_stream' }, { detections: edited }],
  ),
  ['zone', 'stream'],
);

check(
  'a field whose default does not use the changed one is not named',
  run(
    [{ camera: 'camera.drive' }, { title: 'Mine' }, { colour: 'red' }],
    [{ camera: 'camera.gate' }, { title: 'Mine' }, { colour: 'red' }],
  ),
  [],
);

check(
  'a field set to what its new default works out to is not named',
  run([{ camera: 'camera.drive' }, { stream: 'gate_stream' }], [{ camera: 'camera.gate' }, { stream: 'gate_stream' }]),
  [],
);

check(
  'a field changed in the same edit is not named',
  run([{ camera: 'camera.drive' }, { stream: 'x' }], [{ camera: 'camera.gate' }, { stream: 'y' }]),
  [],
);

check('a field the card did not set is not named', run([{ camera: 'camera.drive' }], [{ camera: 'camera.gate' }]), []);

check('no template names nothing', leftBehind(names, [{ camera: 'a' }], [{ camera: 'b' }], undefined), []);

check(
  'the mapping form of variables works the same',
  run({ camera: 'camera.drive', stream: 'x' }, { camera: 'camera.gate', stream: 'x' }),
  ['stream'],
);

// stillBehind: what a note keeps showing as the card changes.
check(
  'stillBehind keeps a field still set away from its default',
  stillBehind(['stream', 'zone'], [{ camera: 'camera.gate' }, { stream: 'drive_stream' }], template, undefined, extras),
  ['stream'],
);
check(
  'stillBehind drops a field set to its default since',
  stillBehind(['stream'], [{ camera: 'camera.gate' }, { stream: 'gate_stream' }], template),
  [],
);

// nextNotes: the notes the editor holds between edits.
const declared = new Set(names);
check(
  'an edit with something left behind adds a note under the field it changed',
  [...nextNotes(new Map(), ['camera'], ['stream'], declared)],
  [['camera', ['stream']]],
);
check(
  'a later edit of the same field replaces its note, and an empty one goes',
  [...nextNotes(new Map([['camera', ['stream']]]), ['camera'], [], declared)],
  [],
);
check(
  'editing a named field takes it out of the note, and other notes stay',
  [
    ...nextNotes(
      new Map([
        ['camera', ['stream', 'zone']],
        ['zone', ['detections']],
      ]),
      ['stream'],
      [],
      declared,
    ),
  ],
  [
    ['camera', ['zone']],
    ['zone', ['detections']],
  ],
);
check(
  'a note goes under a declared field, never an undeclared one',
  [...nextNotes(new Map(), ['other', 'camera'], ['stream'], declared)],
  [['camera', ['stream']]],
);
