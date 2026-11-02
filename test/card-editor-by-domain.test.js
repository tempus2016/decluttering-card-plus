/*
 * Idea 16: the template_by_domain mapping as a table of domain to template.
 */
const { check } = require('./check');
const {
  byDomainRows,
  isReadableByDomain,
  applyByDomainRows,
  cardTemplateOptions,
  remainingDomains,
} = require('../.test-build/card-editor/by-domain');

const config = {
  type: 'custom:decluttering-card-plus',
  template_by_domain: { light: 'light_tile', switch: 'switch_tile', default: 'plain_tile' },
};

check('rows are the domains in order, default kept apart', byDomainRows(config), {
  rows: [
    { domain: 'light', template: 'light_tile' },
    { domain: 'switch', template: 'switch_tile' },
  ],
  fallback: 'plain_tile',
});
check('no mapping means no rows', byDomainRows({ type: 'x' }), { rows: [], fallback: undefined });
check('a mapping of strings is readable', isReadableByDomain(config), true);
check(
  'a mapping with a non-string value is not',
  isReadableByDomain({ template_by_domain: { light: { nested: true } } }),
  false,
);
check('no mapping is readable, as nothing', isReadableByDomain({ type: 'x' }), true);

check(
  'rows write the mapping back, default last',
  applyByDomainRows(
    { type: 'x', template_by_domain: { light: 'a', default: 'z' } },
    [
      { domain: 'switch', template: 'b' },
      { domain: 'light', template: 'a' },
    ],
    'z',
  ).template_by_domain,
  { switch: 'b', light: 'a', default: 'z' },
);
check(
  'an empty domain or template row is dropped',
  applyByDomainRows(
    { type: 'x' },
    [
      { domain: '', template: 'a' },
      { domain: 'fan', template: '' },
    ],
    'z',
  ).template_by_domain,
  {
    default: 'z',
  },
);
check(
  'no fallback writes no default key',
  'default' in applyByDomainRows({ type: 'x' }, [{ domain: 'light', template: 'a' }], '').template_by_domain,
  false,
);
check('no rows and no fallback removes the mapping', 'template_by_domain' in applyByDomainRows(config, [], ''), false);
check(
  'other keys pass through',
  applyByDomainRows({ type: 'x', columns: 2 }, [{ domain: 'light', template: 'a' }], 'z').columns,
  2,
);

check(
  'only card templates are offered',
  cardTemplateOptions({
    light_tile: { card: { type: 'tile' } },
    a_row: { row: { entity: 'x' } },
    a_badge: { badge: { type: 'entity' } },
    group_one: { group: [{ type: 'tile' }] },
    old: { card: { type: 'tile' }, deprecated: true },
  }).map((o) => o.value),
  ['group_one', 'light_tile', 'old'],
);
check(
  'a deprecated template is marked',
  cardTemplateOptions({ old: { card: {}, deprecated: 'use new' } })[0].label.includes('deprecated'),
  true,
);
check(
  'the domains not mapped yet',
  remainingDomains(['light', 'sensor', 'switch'], [{ domain: 'light', template: 'a' }]),
  ['sensor', 'switch'],
);
