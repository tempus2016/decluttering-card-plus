/*
 * Reading other dashboards (src/templates.ts): a read that failed because the connection
 * dropped is asked for again, and the list of dashboards landing is counted once however
 * many cards asked for it. Run with `npm test`.
 */
const {
  fetchDashboardConfig,
  fetchDashboardPaths,
  findTemplateAnywhere,
  itemTemplatesOf,
  borrowedKnown,
} = require('../.test-build/templates.js');

const { check } = require('./check');

const settle = () => new Promise((resolve) => setTimeout(resolve, 5));

(async () => {
  let down = true;
  const asked = [];
  const hass = {
    callWS: async (message) => {
      asked.push(`${message.type}:${message.url_path}`);
      if (message.type === 'lovelace/dashboards/list') {
        if (down) throw new Error('Connection lost');
        return [{ url_path: 'lender' }];
      }
      if (message.url_path === 'nowhere') throw Object.assign(new Error('none'), { code: 'config_not_found' });
      if (message.url_path !== 'lender') return { views: [] };
      if (down) throw new Error('Connection lost');
      return { decluttering_templates: { borrowed: { card: { type: 'tile' } } }, views: [] };
    },
  };
  const warn = console.warn;
  console.warn = () => undefined;
  const ll = { decluttering_templates_from: ['lender'], views: [] };
  const star = { decluttering_templates_from: ['*'], decluttering_templates: { it: { item: { a: 1 } } }, views: [] };

  check('a dashboard that cannot be read gives no template', await findTemplateAnywhere(hass, ll, 'borrowed'), null);
  check('nor a list of dashboards', await fetchDashboardPaths(hass), []);
  await settle();
  check('a card is not left waiting on a read that failed', [borrowedKnown(ll), borrowedKnown(star)], [true, true]);

  down = false;
  check('once the connection is back the dashboard is read again', await findTemplateAnywhere(hass, ll, 'borrowed'), {
    card: { type: 'tile' },
  });
  check('and so is the list of dashboards', await fetchDashboardPaths(hass), ['lender', 'lovelace']);
  await settle();

  const before = asked.length;
  await fetchDashboardConfig(hass, 'lender');
  await fetchDashboardPaths(hass);
  check('a read that worked is kept', asked.length, before);

  await fetchDashboardConfig(hass, 'nowhere');
  await fetchDashboardConfig(hass, 'nowhere');
  check(
    'a dashboard that is not there is not asked for twice',
    asked.filter((each) => each === 'lovelace/config:nowhere').length,
    1,
  );

  await settle();
  const items = itemTemplatesOf(star);
  await fetchDashboardPaths(hass);
  await fetchDashboardPaths(hass);
  await settle();
  check('asking for the list again leaves what was worked out from it alone', itemTemplatesOf(star) === items, true);

  console.warn = warn;
})();
