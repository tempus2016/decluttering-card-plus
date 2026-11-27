/*
 * Home Assistant's live demos (demo.home-assistant.io/embed.js) draw a dashboard on any web
 * page with no Home Assistant app around it. The card has to find its templates in the
 * hui-root or hui-view inside ha-embed-dashboard / ha-embed-view, and must not treat that
 * dashboard's do-nothing saveConfig as somewhere to save.
 */
const { getLovelaceConfig, getLovelaceEmbed, getLovelacePanel } = require('../.test-build/utils.js');
const { check } = require('./check');

/** A page with these elements at the top level, each with a shadow root holding `inner`. */
const page = (elements) => {
  global.document = {
    location: { pathname: '/decluttering-card-plus/live-demo.html' },
    querySelector: () => null,
    querySelectorAll: (selector) =>
      elements.filter((el) =>
        selector
          .split(',')
          .map((s) => s.trim())
          .includes(el.localName),
      ),
  };
};
const embed = (localName, inner) => ({
  localName,
  shadowRoot: {
    querySelector: (selector) =>
      inner &&
      selector
        .split(',')
        .map((s) => s.trim())
        .includes(inner.localName)
        ? inner
        : null,
  },
});
const lovelace = (templates) => ({
  config: { decluttering_templates: templates, views: [] },
  saveConfig: async () => undefined,
  embedded: true,
});

page([]);
check(
  'a page with no app and no demo has no dashboard',
  [getLovelaceEmbed(), getLovelaceConfig() ?? null],
  [null, null],
);

const viewDashboard = lovelace({ from_view: { card: { type: 'tile' } } });
page([embed('ha-embed-view', { localName: 'hui-view', lovelace: viewDashboard })]);
check('a demo view gives its dashboard, templates and all', Object.keys(getLovelaceConfig().decluttering_templates), [
  'from_view',
]);
check('and it is not somewhere to save', getLovelacePanel(), null);

const rootDashboard = lovelace({ from_root: { card: { type: 'tile' } } });
page([embed('ha-embed-dashboard', { localName: 'hui-root', lovelace: rootDashboard })]);
check('a demo dashboard gives its own', Object.keys(getLovelaceConfig().decluttering_templates), ['from_root']);

page([
  embed('ha-embed-view', null),
  embed('ha-embed-dashboard', { localName: 'hui-root', lovelace: rootDashboard }),
  embed('ha-embed-view', { localName: 'hui-view', lovelace: viewDashboard }),
]);
check(
  'one still drawing is passed over for the first that has drawn',
  Object.keys(getLovelaceConfig().decluttering_templates),
  ['from_root'],
);

delete global.document;
check('without a document at all there is nothing, and no throw', getLovelaceEmbed(), null);
