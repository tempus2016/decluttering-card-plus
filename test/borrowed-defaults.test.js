/*
 * Shared values on templates borrowed from other dashboards, in a file of its own so the
 * dashboards it reads are not ones another test has already fetched and cached.
 */
const { collectAllTemplates, setLibraryForTest } = require('../.test-build/templates.js');
/*
 * A template built on a borrowed one keeps its parent's own defaults ahead of every
 * dashboard's, the way it does on a single dashboard, and shared values given more than
 * once are listed once (found from the #375 debug report).
 */
require('node:test')('borrowed extends: parent defaults beat dashboard defaults, nothing listed twice', async () => {
  const assert = require('node:assert/strict');
  const fill = require('../.test-build/deep-replace.js').default;
  const lib = {
    decluttering_defaults: [{ colour: 'from-library' }],
    decluttering_templates: {
      parent: { default: [{ colour: 'from-parent' }], card: { type: 'x', c: '[[colour]]', s: '[[size]]' } },
      child: { extends: 'parent', default: [{ size: 'child-size' }] },
    },
    views: [],
  };
  const lender = {
    decluttering_defaults: [{ tone: 'from-lender' }],
    decluttering_templates: { lent: { card: { type: 'y', t: '[[tone]]', c: '[[colour]]' } } },
    views: [],
  };
  const hass = {
    callWS: (m) =>
      Promise.resolve(m.url_path === 'decluttering-templates' ? lib : m.url_path === 'lender' ? lender : { views: [] }),
  };
  setLibraryForTest(lib);
  const page = {
    decluttering_templates_from: 'lender',
    decluttering_defaults: [{ size: 'from-page' }, { colour: 'from-library' }],
    decluttering_templates: {
      local_child: { extends: 'parent', default: [{ size: 'local-size' }] },
      on_lent: { extends: 'lent' },
    },
    views: [{}],
  };
  const all = await collectAllTemplates(hass, page, 0);
  const built = (name) => fill(undefined, all[name], all[name].card, name);
  assert.equal(built('parent').c, 'from-parent');
  assert.equal(built('child').c, 'from-parent', 'a borrowed child keeps its parent default');
  assert.equal(built('child').s, 'child-size');
  assert.equal(built('local_child').c, 'from-parent', 'a local child of a library parent keeps it too');
  assert.equal(built('local_child').s, 'local-size');
  assert.equal(built('on_lent').t, 'from-lender', "a parent on a lender still has the lender's values");
  for (const name of Object.keys(all)) {
    const keys = (all[name].default ?? []).map((entry) => JSON.stringify(entry));
    assert.equal(new Set(keys).size, keys.length, name + ' lists a default twice');
  }
  setLibraryForTest(undefined);
});
