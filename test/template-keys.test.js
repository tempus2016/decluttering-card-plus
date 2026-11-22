/*
 * Keys no template reads (#494): a misspelt `variblees:` is passed over without a word, so
 * the health panel and the command-line lint name it, with the key it is probably a slip for.
 */
const { check } = require('./check');
const { unknownTemplateKeys, TEMPLATE_KEYS } = require('../.test-build/template-keys');
const { checkDashboard } = require('../.test-build/templates');
const cli = require('../.test-build/cli-lint');

check(
  'a misspelt key is named, with the key it is close to',
  unknownTemplateKeys({ decluttering_templates: { foobar: { variblees: 'blah', card: { type: 'tile' } } } }),
  [{ template: 'foobar', key: 'variblees', closest: 'variables' }],
);
check(
  'a key close to nothing is named on its own',
  unknownTemplateKeys({ decluttering_templates: { t: { card: {}, zzzzzzzzzz: 1 } } }),
  [{ template: 't', key: 'zzzzzzzzzz' }],
);
check(
  'every template key passes',
  unknownTemplateKeys({
    decluttering_templates: { t: Object.fromEntries(TEMPLATE_KEYS.map((key) => [key, null])) },
  }),
  [],
);
check(
  'templates come back in name order, each key in the order written',
  unknownTemplateKeys({ decluttering_templates: { b: { cardd: {} }, a: { rwo: {}, nme: 'x' } } }).map(
    (each) => `${each.template}.${each.key}`,
  ),
  ['a.rwo', 'a.nme', 'b.cardd'],
);
check(
  'a template card is left alone, since cards carry keys of their own',
  unknownTemplateKeys({
    views: [
      {
        cards: [
          {
            type: 'custom:decluttering-template-plus',
            template: 't',
            card: {},
            view_layout: { position: 'main' },
          },
        ],
      },
    ],
  }),
  [],
);
check(
  'nothing to read gives nothing',
  [
    unknownTemplateKeys(undefined),
    unknownTemplateKeys({}),
    unknownTemplateKeys({ decluttering_templates: [] }),
    unknownTemplateKeys({ decluttering_templates: { t: null, u: 'text' } }),
  ],
  [[], [], [], []],
);
check(
  'the dashboard check carries them',
  checkDashboard({ decluttering_templates: { foobar: { variblees: 'blah', card: {} } }, views: [] }).unknownKeys,
  [{ template: 'foobar', key: 'variblees', closest: 'variables' }],
);

const { findings } = cli.lintText(
  'decluttering_templates:\n  foobar:\n    variblees: blah\n    card:\n      type: tile\nviews: []\n',
  'unknown.yaml',
);
check(
  'the command-line lint warns, on the template, with did-you-mean',
  findings
    .filter((finding) => finding.path === 'foobar.variblees')
    .map((finding) => [finding.level, finding.line, finding.message]),
  [
    [
      'warning',
      2,
      'Template foobar has variblees:, which no template reads, so it is ignored. Did you mean "variables"?',
    ],
  ],
);
