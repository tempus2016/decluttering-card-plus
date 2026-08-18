/*
 * Unit tests for src/suggest.ts - turning a card somebody already built into a template
 * by proposing variables for the parts that differ between copies. Run with `npm test`.
 */
const { suggestVariables } = require('../.test-build/suggest.js');

const { check, report } = require('./harness');

check('a card with nothing to vary is left alone', suggestVariables({ type: 'markdown', content: 'hello' }, []), {
  card: { type: 'markdown', content: 'hello' },
  variables: [],
});

check(
  'an entity becomes a variable that defaults to it',
  suggestVariables({ type: 'tile', entity: 'light.hall' }, []),
  {
    card: { type: 'tile', entity: '[[entity]]' },
    variables: [{ name: 'entity', label: 'Entity', selector: { entity: {} }, default: 'light.hall' }],
  },
);

check(
  'the same entity used twice becomes one variable',
  suggestVariables({ type: 'vertical-stack', cards: [{ entity: 'light.hall' }, { entity: 'light.hall' }] }, []),
  {
    card: { type: 'vertical-stack', cards: [{ entity: '[[entity]]' }, { entity: '[[entity]]' }] },
    variables: [{ name: 'entity', label: 'Entity', selector: { entity: {} }, default: 'light.hall' }],
  },
);

check(
  'a second entity is numbered rather than colliding',
  suggestVariables({ cards: [{ entity: 'light.hall' }, { entity: 'light.shed' }] }, []),
  {
    card: { cards: [{ entity: '[[entity]]' }, { entity: '[[entity_2]]' }] },
    variables: [
      { name: 'entity', label: 'Entity', selector: { entity: {} }, default: 'light.hall' },
      { name: 'entity_2', label: 'Entity 2', selector: { entity: {} }, default: 'light.shed' },
    ],
  },
);

check(
  'a name and an icon are offered with the right controls',
  suggestVariables({ type: 'tile', name: 'Hall light', icon: 'mdi:lamp' }, []),
  {
    card: { type: 'tile', name: '[[name]]', icon: '[[icon]]' },
    variables: [
      { name: 'name', label: 'Name', selector: { text: {} }, default: 'Hall light' },
      { name: 'icon', label: 'Icon', selector: { icon: {} }, default: 'mdi:lamp' },
    ],
  },
);

check(
  'a name the template already declares does not have its name taken',
  suggestVariables({ name: 'Hall' }, ['name']),
  {
    card: { name: '[[name_2]]' },
    variables: [{ name: 'name_2', label: 'Name 2', selector: { text: {} }, default: 'Hall' }],
  },
);

check('a value that is already a variable is left alone', suggestVariables({ entity: '[[entity]]' }, []), {
  card: { entity: '[[entity]]' },
  variables: [],
});

check('a value that is not an entity id is left alone', suggestVariables({ entity: 'not an entity' }, []), {
  card: { entity: 'not an entity' },
  variables: [],
});

check(
  'an entity_id list is left alone rather than half replaced',
  suggestVariables({ entity_id: ['a.b', 'c.d'] }, []),
  {
    card: { entity_id: ['a.b', 'c.d'] },
    variables: [],
  },
);

check('an empty name is not worth a variable', suggestVariables({ name: '   ' }, []), {
  card: { name: '   ' },
  variables: [],
});

check(
  'a nested decluttering card keeps its template name',
  suggestVariables({ type: 'custom:decluttering-card-plus', template: 'inner', entity: 'light.hall' }, []),
  {
    card: { type: 'custom:decluttering-card-plus', template: 'inner', entity: '[[entity]]' },
    variables: [{ name: 'entity', label: 'Entity', selector: { entity: {} }, default: 'light.hall' }],
  },
);

report();
