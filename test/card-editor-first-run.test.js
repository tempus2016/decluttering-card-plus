/*
 * The first run: a card added from the picker names no template, and the editor opens on
 * choosing one. Pure parts.
 */
const { check } = require('./check');
const {
  choosingTemplate,
  isBareStub,
  withLibraryInstalled,
  newTemplateCard,
  NEW_TEMPLATE_NAME,
} = require('../.test-build/card-editor/first-run');

const TYPE = 'custom:decluttering-card-plus';

// --- choosingTemplate ---

check('no template: is choosing', choosingTemplate({ type: TYPE }), true);
check('an empty template: is choosing', choosingTemplate({ type: TYPE, template: '' }), true);
check('a null template: is choosing', choosingTemplate({ type: TYPE, template: null }), true);
check('a named template is not choosing, found or not', choosingTemplate({ type: TYPE, template: 'nowhere' }), false);
check(
  'a mapping by domain is not choosing, with no template of its own',
  choosingTemplate({ type: TYPE, template_by_domain: { light: 'a' } }),
  false,
);
// The card reads an empty mapping as choosing by domain too, so the editor does as well.
check(
  'a mapping by domain with nothing in it yet is not choosing',
  choosingTemplate({ type: TYPE, template_by_domain: {} }),
  false,
);
check('no config is not choosing', choosingTemplate(undefined), false);

// --- isBareStub ---

check('the stub itself is bare', isBareStub({ type: TYPE }), true);
check(
  'the layout keys Home Assistant adds keep it bare',
  isBareStub({ type: TYPE, grid_options: { columns: 6 }, visibility: [] }),
  true,
);
check('variables written by hand are not bare', isBareStub({ type: TYPE, variables: [{ a: 1 }] }), false);
check('a repeat written by hand is not bare', isBareStub({ type: TYPE, for_each: [{ a: 1 }] }), false);
check('a named template is not bare', isBareStub({ type: TYPE, template: 'x' }), false);

// --- withLibraryInstalled ---

const library = {
  tile: { name: 'tile', summary: '', template: { card: { type: 'tile', entity: '[[entity]]' } } },
  summary: {
    name: 'summary',
    summary: '',
    template: { card: { type: 'vertical-stack', cards: [{ type: TYPE, template: 'tile' }] } },
  },
};
const find = (name) => library[name];

check(
  'installs the entry under decluttering_templates, stamped with where it came from',
  withLibraryInstalled({ views: [] }, 'tile', [], '9.9.9', find),
  {
    views: [],
    decluttering_templates: {
      tile: { card: { type: 'tile', entity: '[[entity]]' }, source: { library: 'tile', version: '9.9.9' } },
    },
  },
);
check(
  'brings the library template it calls with it',
  Object.keys(withLibraryInstalled({ views: [] }, 'summary', [], '1', find).decluttering_templates),
  ['tile', 'summary'],
);
check(
  'a template the dashboard already has is left as it is',
  withLibraryInstalled({ decluttering_templates: { tile: { card: { type: 'mine' } } } }, 'summary', ['tile'], '1', find)
    .decluttering_templates.tile,
  { card: { type: 'mine' } },
);
check(
  'the rest of the dashboard is untouched',
  withLibraryInstalled({ title: 'Home', views: [{ cards: [1] }] }, 'tile', [], '1', find).views,
  [{ cards: [1] }],
);
check('an unknown entry changes nothing', withLibraryInstalled({ views: [] }, 'nope', [], '1', find), { views: [] });

// --- newTemplateCard ---

check('a new template card takes the first free name', newTemplateCard([]), {
  type: 'custom:decluttering-template-plus',
  template: NEW_TEMPLATE_NAME,
  card: { type: 'entity', entity: 'sun.sun' },
});
check(
  'and steps past names already taken',
  newTemplateCard([NEW_TEMPLATE_NAME, `${NEW_TEMPLATE_NAME}_2`]).template,
  `${NEW_TEMPLATE_NAME}_3`,
);

// --- keepingTemplates ---

const { keepingTemplates } = require('../.test-build/card-editor/first-run');
const namesOf = (ll) => Object.keys((ll && ll.decluttering_templates) || {});

(async () => {
  // The dialog's own save writes the dashboard as it was when it opened: no templates.
  const panel = { config: { views: [{ cards: [] }] }, saves: 0 };
  panel.saveConfig = async (config) => {
    panel.saves += 1;
    panel.config = config;
  };
  const opened = panel.config;
  const dialogSave = async (card) => panel.saveConfig({ ...opened, views: [{ cards: [card] }] });
  let save = keepingTemplates(dialogSave, 'tile', () => panel, namesOf, '1', find);
  save = keepingTemplates(save, 'summary', () => panel, namesOf, '1', find);
  await save({ type: TYPE, template: 'summary' });
  check('the card the dialog saved is there', panel.config.views, [{ cards: [{ type: TYPE, template: 'summary' }] }]);
  check('and every template installed while it was open', namesOf(panel.config), ['tile', 'summary']);
  check('in two saves, the dialog one then the templates', panel.saves, 2);
  check('wrapping twice keeps both names on one wrapper', save.dcpKeeps, ['tile', 'summary']);
  check('and the dialog save underneath, not the first wrapper', save.dcpOriginal === dialogSave, true);

  // Nothing to put back: no second save.
  const kept = { config: { decluttering_templates: { tile: {} }, views: [] }, saves: 0 };
  kept.saveConfig = async (config) => {
    kept.saves += 1;
    kept.config = config;
  };
  await keepingTemplates(
    async () => undefined,
    'tile',
    () => kept,
    namesOf,
    '1',
    find,
  )({});
  check('a template still there is not saved again', kept.saves, 0);
})();
