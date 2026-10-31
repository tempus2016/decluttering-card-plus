/*
 * Unit tests for src/sharing.ts - the sharing details a template carries (#345): who wrote
 * it, its licence and links, what it needs from Home Assistant, and the variables it asks
 * for on install. Run with `npm test`.
 */
const {
  shareInfo,
  safeUrl,
  authorLine,
  requirementsOf,
  versionAtLeast,
  unmetRequirements,
  unquotedVersions,
  setupVariables,
  ownDefault,
  withSetup,
} = require('../.test-build/sharing.js');
const { buildExport } = require('../.test-build/share.js');
const { collectTemplates } = require('../.test-build/templates.js');

const { check } = require('./check');

/* --- shareInfo: each value checked for its type --- */

check(
  'the sharing details are read off the template',
  shareInfo({
    author: { name: 'Dan', github: 'dstrohl', email: 'dan@example.com' },
    license: 'MIT',
    help: 'https://example.com/help',
    homepage: 'https://github.com/someone/templates',
    readme: '# Camera\nShows a camera.',
    related: ['reolink_card'],
    setup: 'frigate_url',
  }),
  {
    author: { name: 'Dan', github: 'dstrohl', email: 'dan@example.com' },
    license: 'MIT',
    help: 'https://example.com/help',
    homepage: 'https://github.com/someone/templates',
    readme: '# Camera\nShows a camera.',
    related: ['reolink_card'],
    setup: ['frigate_url'],
  },
);

check('an author can be just a name', shareInfo({ author: 'Dan Strohl' }).author, { name: 'Dan Strohl' });

check('nothing given is nothing read', shareInfo({ card: {} }), { related: [], setup: [] });

check('a javascript: link is not a link', safeUrl('javascript:alert(1)'), undefined);

check('an address without a scheme is not a link', safeUrl('example.com/help'), undefined);

check(
  'a help link that is not http or https is dropped',
  shareInfo({ help: 'data:text/html,<b>x</b>', homepage: 'http://example.com' }),
  { homepage: 'http://example.com', related: [], setup: [] },
);

check('a GitHub login that is not one is dropped', shareInfo({ author: { github: 'a/b?c' } }).author, undefined);

check('an author url must be http or https', shareInfo({ author: { name: 'x', url: 'javascript:1' } }).author, {
  name: 'x',
});

check('a long licence is cut short', shareInfo({ license: 'x'.repeat(500) }).license.length, 200);

check(
  'the author line joins what is given',
  authorLine({ name: 'Dan', github: 'dstrohl', email: 'dan@example.com' }),
  'Dan · @dstrohl · dan@example.com',
);

/* --- requirementsOf --- */

check(
  'requirements read as names, any-of lists and mappings with messages',
  requirementsOf({
    requires: {
      integrations: ['frigate', ['frigate', 'reolink'], { integration: ['unifiprotect'], message: 'For UniFi.' }],
      entities: ['binary_sensor.*_zone_*'],
      custom_cards: ['custom:advanced-camera-card'],
      homeassistant: '2026.10+',
      card: '2.5',
    },
  }),
  [
    { kind: 'integration', any: ['frigate'] },
    { kind: 'integration', any: ['frigate', 'reolink'] },
    { kind: 'integration', any: ['unifiprotect'], message: 'For UniFi.' },
    { kind: 'entity', any: ['binary_sensor.*_zone_*'] },
    { kind: 'custom_card', any: ['advanced-camera-card'] },
    { kind: 'homeassistant', any: ['2026.10'] },
    { kind: 'card', any: ['2.5'] },
  ],
);

check('requires that is not a mapping is nothing', requirementsOf({ requires: ['frigate'] }), []);

/* --- versionAtLeast --- */

check('a patch release is at least its minor', versionAtLeast('2026.10.4', '2026.10'), true);
check('October is newer than January', versionAtLeast('2026.10.0', '2026.2'), true);
check('an older minor is not enough', versionAtLeast('2026.9.3', '2026.10'), false);
check('a beta counts as its numbers', versionAtLeast('2026.11.0b1', '2026.11'), true);
check('the same version is enough', versionAtLeast('2.5.0', '2.5'), true);

/* --- unmetRequirements --- */

const here = {
  components: ['frigate', 'sensor.template', 'mqtt'],
  entities: ['binary_sensor.front_zone_motion', 'light.kitchen'],
  homeassistant: '2026.10.4',
  card: '2.5.0',
  isDefined: (tag) => tag === 'mushroom-template-card',
};

check(
  'everything met is nothing said',
  unmetRequirements(
    [
      {
        requires: {
          integrations: ['frigate', 'template'],
          entities: ['binary_sensor.*_zone_*'],
          custom_cards: ['mushroom-template-card'],
          homeassistant: '2026.10',
          card: '2.5',
        },
      },
    ],
    here,
  ),
  [],
);

check(
  'what is missing is said, with the version that is here',
  unmetRequirements(
    [
      {
        requires: {
          integrations: [{ integration: ['reolink', 'unifiprotect'], message: 'Needs a camera integration.' }],
          entities: ['camera.*'],
          custom_cards: ['advanced-camera-card'],
          homeassistant: '2026.11',
          card: '3.0',
        },
      },
    ],
    here,
  ),
  [
    { kind: 'integration', any: ['reolink', 'unifiprotect'], message: 'Needs a camera integration.' },
    { kind: 'entity', any: ['camera.*'] },
    { kind: 'custom_card', any: ['advanced-camera-card'] },
    { kind: 'homeassistant', any: ['2026.11'], have: '2026.10.4' },
    { kind: 'card', any: ['3.0'], have: '2.5.0' },
  ],
);

check(
  'one of an any-of list is enough',
  unmetRequirements([{ requires: { integrations: [['reolink', 'frigate']] } }], here),
  [],
);

check(
  'the same requirement from two templates is said once',
  unmetRequirements([{ requires: { integrations: ['zha'] } }, { requires: { integrations: ['zha'] } }], here).length,
  1,
);

check(
  'an unknown Home Assistant version is not too old',
  unmetRequirements([{ requires: { homeassistant: '2099.1' } }], { ...here, homeassistant: undefined }),
  [],
);

check(
  'a development build of the card meets any card version',
  unmetRequirements([{ requires: { card: '9.0' } }], { ...here, card: '0.0.0-dev' }),
  [],
);

check(
  'an entity pattern is the whole id, not part of it',
  unmetRequirements([{ requires: { entities: ['light.kit'] } }], here).length,
  1,
);

/* --- unquotedVersions --- */

check(
  'a version written as a number is caught',
  unquotedVersions({ requires: { homeassistant: 2026.1, card: '2.5' } }),
  ['homeassistant'],
);

/* --- setup --- */

check(
  'setup variables are listed once, in order',
  setupVariables([{ setup: ['frigate_url', 'zone'] }, { setup: 'frigate_url' }]),
  ['frigate_url', 'zone'],
);

check(
  'a template default is found in the list form',
  ownDefault({ default: [{ frigate_url: 'http://frigate:5000' }] }, 'frigate_url'),
  'http://frigate:5000',
);

check('and in the plural mapping form', ownDefault({ defaults: { zone: 'front' } }, 'zone'), 'front');

check(
  'values typed at install replace the template defaults they name',
  withSetup(
    { setup: ['frigate_url'], default: [{ frigate_url: 'http://old' }, { size: 2 }], card: {} },
    { frigate_url: 'http://frigate.local:5000' },
  ),
  { setup: ['frigate_url'], default: [{ frigate_url: 'http://frigate.local:5000' }, { size: 2 }], card: {} },
);

check(
  'the plural defaults are folded into the one list',
  withSetup({ setup: 'zone', defaults: { zone: 'a', size: 1 }, card: {} }, { zone: 'b' }),
  { setup: 'zone', default: [{ zone: 'b' }, { size: 1 }], card: {} },
);

check(
  'an empty value leaves the template as it was',
  withSetup({ setup: ['zone'], default: [{ zone: 'a' }], card: {} }, { zone: '' }),
  { setup: ['zone'], default: [{ zone: 'a' }], card: {} },
);

check(
  'a value for a variable the template does not ask for is not written',
  withSetup({ default: [{ zone: 'a' }], card: {} }, { zone: 'b' }),
  { default: [{ zone: 'a' }], card: {} },
);

/* --- export: related templates travel with it --- */

const dashboard = {
  frigate_card: { related: ['reolink_card'], card: { type: 'picture-entity' } },
  reolink_card: {
    related: ['frigate_card', 'unifi_card'],
    card: { type: 'custom:decluttering-card-plus', template: 'base' },
  },
  unifi_card: { card: { type: 'picture' } },
  base: { card: { type: 'entity' } },
};

check(
  'related templates, theirs, and what they call go out under includes',
  Object.keys(
    buildExport(
      { type: 'custom:decluttering-template-plus', template: 'frigate_card', related: ['reolink_card'], card: {} },
      dashboard,
    ).payload.includes,
  ).sort(),
  ['base', 'reolink_card', 'unifi_card'],
);

check(
  'a related template that is not here is not called missing',
  buildExport({ type: 'custom:decluttering-template-plus', template: 'a', related: ['gone'], card: {} }, {}).notes,
  [],
);

check(
  'the sharing details lead the export, after the description',
  Object.keys(
    buildExport({
      card: {},
      requires: { integrations: ['frigate'] },
      template: 'x',
      license: 'MIT',
      description: 'd',
      type: 'custom:decluttering-template-plus',
    }).payload,
  ),
  ['type', 'template', 'description', 'license', 'requires', 'card'],
);

check(
  'a version written as a number is a note on the export',
  buildExport({ template: 'x', requires: { homeassistant: 2026.1 }, card: {} }).notes.length,
  1,
);

/* --- inheritance: the details about a template are its own --- */

check(
  'a child template takes its parent requirements but not its credits',
  (() => {
    const out = collectTemplates({
      decluttering_templates: {
        parent: {
          author: 'Dan',
          license: 'MIT',
          readme: 'r',
          requires: { integrations: ['frigate'] },
          setup: ['u'],
          card: {},
        },
        child: { extends: 'parent', card: {} },
      },
    }).child;
    return [out.author, out.license, out.readme, out.requires, out.setup];
  })(),
  [undefined, undefined, undefined, { integrations: ['frigate'] }, ['u']],
);

/* --- the risk scan does not count the sharing details --- */

const { communityRisks } = require('../.test-build/community.js');

check(
  'help, homepage and readme links are not addresses the template reaches',
  communityRisks({
    name: 'x',
    template: {
      help: 'https://example.com/help',
      homepage: 'https://github.com/someone/templates',
      readme: 'See https://example.com/readme',
      author: { url: 'https://example.com/me' },
      card: { type: 'markdown', content: 'hi' },
    },
    includes: { y: { help: 'https://example.com/other', card: { type: 'markdown', content: 'y' } } },
  }).urls,
  [],
);

check(
  'an address in what it builds is still found',
  communityRisks({
    name: 'x',
    template: { help: 'https://example.com/help', card: { type: 'picture', image: 'https://evil.example/x.png' } },
    includes: {},
  }).urls,
  ['https://evil.example/x.png'],
);

/* --- the Share tab's form: read and written back --- */

const { sharingFormData, applySharingForm } = require('../.test-build/sharing.js');

check(
  'the form reads the details as written',
  sharingFormData({
    author: { name: 'Dan', github: 'dstrohl' },
    license: 'MIT',
    related: 'other',
    requires: { integrations: ['frigate', { integration: ['a', 'b'], message: 'm' }], homeassistant: '2026.10' },
  }),
  {
    author_name: 'Dan',
    author_github: 'dstrohl',
    license: 'MIT',
    related: ['other'],
    setup: [],
    requires_integrations: ['frigate'],
    requires_entities: [],
    requires_custom_cards: [],
    requires_homeassistant: '2026.10',
  },
);

check('an author written as a name reads as the name', sharingFormData({ author: 'Dan' }).author_name, 'Dan');

check(
  'the form writes the details back',
  applySharingForm(
    { card: {} },
    {
      author_name: 'Dan',
      author_github: 'dstrohl',
      license: ' MIT ',
      readme: '# Hi\n\n  indented\n',
      related: ['other', ''],
      setup: ['frigate_url'],
      requires_integrations: ['frigate'],
      requires_homeassistant: '2026.10',
    },
  ),
  {
    card: {},
    author: { name: 'Dan', github: 'dstrohl' },
    license: 'MIT',
    readme: '# Hi\n\n  indented\n',
    related: ['other'],
    setup: ['frigate_url'],
    requires: { integrations: ['frigate'], homeassistant: '2026.10' },
  },
);

check(
  'an author with only a name is written as the name',
  applySharingForm({ card: {} }, { author_name: 'Dan' }).author,
  'Dan',
);

check(
  'emptied fields take their keys away',
  applySharingForm(
    { card: {}, license: 'MIT', author: 'Dan', related: ['x'], requires: { card: '2.5', homeassistant: '2026.10' } },
    { license: '', author_name: '', related: [], requires_card: '', requires_homeassistant: '' },
  ),
  { card: {} },
);

check(
  'requirements the form cannot show are kept',
  applySharingForm(
    { card: {}, requires: { integrations: ['frigate', ['a', 'b'], { integration: 'c', message: 'm' }], other: 1 } },
    { requires_integrations: ['zha'] },
  ).requires,
  { integrations: ['zha', ['a', 'b'], { integration: 'c', message: 'm' }], other: 1 },
);

check(
  'author keys the form has no field for are kept',
  applySharingForm({ card: {}, author: { name: 'Dan', mastodon: '@dan' } }, { author_name: 'Dan' }).author,
  { name: 'Dan', mastodon: '@dan' },
);

check(
  'a version read as a number is written back as text',
  applySharingForm({ card: {}, requires: { card: 2.5 } }, sharingFormData({ requires: { card: 2.5 } })).requires,
  { card: '2.5' },
);

check(
  'a round trip changes nothing written in the usual way',
  (() => {
    const t = {
      template: 'x',
      card: {},
      author: { name: 'Dan', github: 'dstrohl' },
      license: 'MIT',
      help: 'https://example.com',
      setup: ['u'],
      requires: { integrations: ['frigate'], homeassistant: '2026.10' },
    };
    return applySharingForm(t, sharingFormData(t));
  })(),
  {
    template: 'x',
    card: {},
    author: { name: 'Dan', github: 'dstrohl' },
    license: 'MIT',
    help: 'https://example.com',
    setup: ['u'],
    requires: { integrations: ['frigate'], homeassistant: '2026.10' },
  },
);
