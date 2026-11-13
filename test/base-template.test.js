/*
 * #444: `base: true` keeps a template that is only there to be extended out of the card
 * editor's pickers, and a child of it is an ordinary template again.
 */
const { check } = require('./check');
const { pickerItems } = require('../.test-build/card-editor/template-picker');
const { cardTemplateOptions } = require('../.test-build/card-editor/by-domain');
const { collectTemplates } = require('../.test-build/templates');

const ll = {
  decluttering_templates: {
    camera_base: {
      base: true,
      card: { type: 'vertical-stack', cards: [{ type: 'heading', heading: '[[name]]' }] },
    },
    camera_simple: { extends: 'camera_base', card: { title: 'Simple' } },
    camera_mixin: { base: true, extends: 'camera_base', card: { title: 'Mixin' } },
    camera_full: { extends: 'camera_mixin' },
    off_switch: { base: false, card: { type: 'tile' } },
  },
  views: [],
};
const templates = collectTemplates(ll);
const names = (items) => items.map((item) => item.value).sort();

check(
  'a base is left out of the template picker; its children and base: false are not',
  names(pickerItems(templates, ll, undefined)),
  ['camera_full', 'camera_simple', 'off_switch'],
);
check(
  'a base the card already uses stays listed so the box can show it',
  names(pickerItems(templates, ll, undefined, () => undefined, 'camera_base')),
  ['camera_base', 'camera_full', 'camera_simple', 'off_switch'],
);
check(
  'the by-domain template list leaves bases out too',
  cardTemplateOptions(templates).map((option) => option.value),
  ['camera_full', 'camera_simple', 'off_switch'],
);
check('a child does not inherit base:', templates.camera_simple.base, undefined);
check('a base extending a base keeps its own base:', templates.camera_mixin.base, true);
check('and still takes its parent content', templates.camera_full.card.cards[0].heading, '[[name]]');
