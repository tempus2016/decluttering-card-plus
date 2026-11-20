/*
 * #482: `type: entity` narrows its picker by `integration:` and `supported_features:` as well
 * as `domain:` and `device_class:` - the four things Home Assistant's entity filter takes.
 * Run with `npm test`.
 */
const { check } = require('./check');
const { declarationSelector, withNamedType } = require('../.test-build/variables');

check(
  'integration narrows the picker',
  declarationSelector({ name: 'e', type: 'entity', domain: 'switch', integration: 'zha' }),
  { entity: { filter: { domain: 'switch', integration: 'zha' } } },
);
check(
  'supported_features narrows it too, one number or a list',
  declarationSelector({ name: 'e', type: 'entity', domain: 'cover', supported_features: [1, 4] }),
  { entity: { filter: { domain: 'cover', supported_features: [1, 4] } } },
);
check(
  'all four together',
  declarationSelector({
    name: 'e',
    type: 'entity',
    domain: 'light',
    device_class: 'x',
    integration: 'hue',
    supported_features: 32,
  }),
  { entity: { filter: { domain: 'light', device_class: 'x', integration: 'hue', supported_features: 32 } } },
);
check('nothing written is no filter', declarationSelector({ name: 'e', type: 'entity' }), { entity: {} });
check(
  'an object field takes them too',
  withNamedType(
    { name: 'o', selector: { object: { fields: { sw: { type: 'entity', integration: 'zha' } } } } },
    () => ({}),
  ).selector.object.fields.sw.selector,
  { entity: { filter: { integration: 'zha' } } },
);
check(
  'a named type can carry them',
  declarationSelector(
    withNamedType({ name: 'e', type: 'zha_switch' }, () => ({
      zha_switch: { type: 'entity', domain: 'switch', integration: 'zha' },
    })),
  ),
  { entity: { filter: { domain: 'switch', integration: 'zha' } } },
);
