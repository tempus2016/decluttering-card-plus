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

// --- the switch: starting and stopping a mapping from the form ---

const { hasByDomain, startByDomain, stopByDomain } = require('../.test-build/card-editor/by-domain');

check('no mapping written', hasByDomain({ type: 'x', template: 'a' }), false);
check('a mapping written', hasByDomain(config), true);
check('an empty mapping counts as written', hasByDomain({ type: 'x', template_by_domain: {} }), true);
check('one the table cannot read counts too', hasByDomain({ template_by_domain: { light: { nested: true } } }), true);

check(
  'starting: the template becomes what anything else uses',
  startByDomain({ type: 'x', template: 'room_tile', variables: [{ a: 1 }] }),
  { type: 'x', variables: [{ a: 1 }], template_by_domain: { default: 'room_tile' } },
);
check('starting with no template: an empty mapping', startByDomain({ type: 'x' }), {
  type: 'x',
  template_by_domain: {},
});
check(
  'the started mapping reads back as no rows and that default',
  byDomainRows(startByDomain({ type: 'x', template: 'room_tile' })),
  { rows: [], fallback: 'room_tile' },
);

check(
  'stopping: the default becomes the template again',
  stopByDomain({ type: 'x', template_by_domain: { light: 'room_tile', default: 'plain' }, variables: [] }),
  { type: 'x', variables: [], template: 'plain' },
);
check(
  'with no default, the first domain gives it',
  stopByDomain({ type: 'x', template_by_domain: { switch: 'switch_tile', light: 'room_tile' } }),
  { type: 'x', template: 'switch_tile' },
);
check(
  'with nothing in the mapping, the template the card still names stays',
  stopByDomain({ type: 'x', template: 'kept', template_by_domain: {} }),
  { type: 'x', template: 'kept' },
);
check('with nothing at all, no template is made up', stopByDomain({ type: 'x', template_by_domain: {} }), {
  type: 'x',
});
check('start then stop is where it began', stopByDomain(startByDomain({ type: 'x', template: 'room_tile' })), {
  type: 'x',
  template: 'room_tile',
});
