/*
 * Unit tests for src/library.ts - the templates the editor can drop in to start from.
 * Run with `npm test`.
 */
const { LIBRARY, libraryEntry, libraryNeeds } = require('../.test-build/library.js');

const { check, report } = require('./harness');

check('there is a library to offer', LIBRARY.length > 0, true);

check(
  'every entry has a name, a summary and something to render',
  LIBRARY.every(
    (e) =>
      typeof e.name === 'string' &&
      e.name.length > 0 &&
      typeof e.summary === 'string' &&
      ['card', 'row', 'element', 'badge'].filter((k) => e.template[k] !== undefined).length === 1,
  ),
  true,
);

check(
  'every entry describes itself for the card editor',
  LIBRARY.every((e) => typeof e.template.description === 'string'),
  true,
);

check(
  'names are unique, so installing one cannot clash with another',
  new Set(LIBRARY.map((e) => e.name)).size,
  LIBRARY.length,
);

check('an entry can be found by name', libraryEntry('room_light_tile')?.name, 'room_light_tile');

check('a name that is not there finds nothing', [libraryEntry('no_such_thing')], [null]);

check('a template that calls another says so', libraryNeeds(libraryEntry('room_summary'), []), ['room_light_tile']);

check(
  'and says nothing when what it calls is already there',
  libraryNeeds(libraryEntry('room_summary'), ['room_light_tile']),
  [],
);

check('a template that calls nothing needs nothing', libraryNeeds(libraryEntry('sensor_line'), []), []);

check(
  'everything a library template calls is in the library itself',
  LIBRARY.every(
    (e) =>
      libraryNeeds(
        e,
        LIBRARY.map((x) => x.name),
      ).length === 0,
  ),
  true,
);

report();
