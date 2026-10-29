/*
 * Ideas 14 and 17: the card slot that stands in for a YAML object wherever a config takes a
 * whole card. Pure: how a chosen card is summarised.
 */
const { check } = require('./check');
const { summariseCard } = require('../.test-build/card-editor/summarise');

check(
  'a markdown card is its type and its first line of content',
  summariseCard({ type: 'markdown', content: 'Kitchen light is not set up yet\nSecond line' }),
  {
    type: 'Markdown',
    text: 'Kitchen light is not set up yet',
  },
);
check(
  'a custom card is named by its tag',
  summariseCard({ type: 'custom:mushroom-light-card', entity: 'light.a' }).type,
  'mushroom-light-card',
);
check('a card with a title shows the title', summariseCard({ type: 'entities', title: 'Lights' }).text, 'Lights');
check('a card with a name shows the name', summariseCard({ type: 'tile', name: 'Hall' }).text, 'Hall');
check(
  'a card with only an entity shows the entity',
  summariseCard({ type: 'tile', entity: 'light.hall' }).text,
  'light.hall',
);
check(
  'a stack says how many cards it holds',
  summariseCard({ type: 'vertical-stack', cards: [{}, {}, {}] }).text,
  '3 cards',
);
check('nothing to say leaves the text empty', summariseCard({ type: 'divider' }).text, '');
check('not a card at all', summariseCard('hide'), undefined);
