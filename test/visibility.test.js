/*
 * Unit tests for src/visibility.ts (idea 45): a template's own `visibility:` decides which
 * copies are built, read off the variables before anything is built.
 */
const {
  templateVisibility,
  visibilityConditions,
  hasVisibility,
  itemLabel,
  skippedConfig,
  SKIPPED_TAG,
} = require('../.test-build/visibility.js');
const { hasRequiredVariables } = require('../.test-build/variables.js');

const { check } = require('./check');

const climate = {
  variables: [{ name: 'area' }, { name: 'climate', type: 'entity' }],
  visibility: [
    { variable: 'climate', exists: true },
    { variable: 'area', not_in: ['Garage', 'Shed'] },
  ],
  card: { type: 'thermostat', entity: '[[climate]]' },
};

check('a template without visibility shows everything', templateVisibility({ card: {} }, [{ a: 1 }]), {
  visible: true,
});
check('hasVisibility tells the two apart', [hasVisibility(climate), hasVisibility({ card: {} })], [true, false]);

check(
  'every condition holds: built',
  templateVisibility(climate, [{ area: 'Living room' }, { climate: 'climate.living' }]),
  { visible: true },
);
check('exists: true fails on an unset variable, and says so', templateVisibility(climate, [{ area: 'Shed' }]), {
  visible: false,
  reason: 'climate is unset',
});
check(
  'not_in fails on a listed value, naming the value and the condition',
  templateVisibility(climate, [{ area: 'Garage' }, { climate: 'climate.g' }]),
  { visible: false, reason: 'area is "Garage" (not_in: Garage, Shed)' },
);
check(
  'the first failing condition is the reason given',
  templateVisibility(climate, [{ area: 'Garage' }]).reason,
  'climate is unset',
);

check(
  'exists: false wants the variable unset',
  [
    templateVisibility({ visibility: [{ variable: 'x', exists: false }] }, []).visible,
    templateVisibility({ visibility: [{ variable: 'x', exists: false }] }, [{ x: 1 }]).visible,
  ],
  [true, false],
);
check(
  'equals compares as text, so a number written either way matches',
  [
    templateVisibility({ visibility: { variable: 'n', equals: 3 } }, [{ n: '3' }]).visible,
    templateVisibility({ visibility: { variable: 'n', equals: 3 } }, [{ n: 4 }]).visible,
    templateVisibility({ visibility: { variable: 'n', equals: 3 } }, []).visible,
  ],
  [true, false, false],
);
check(
  'not_equals passes an unset variable and a different value',
  [
    templateVisibility({ visibility: { variable: 'n', not_equals: 'off' } }, []).visible,
    templateVisibility({ visibility: { variable: 'n', not_equals: 'off' } }, [{ n: 'on' }]).visible,
    templateVisibility({ visibility: { variable: 'n', not_equals: 'off' } }, [{ n: 'off' }]).visible,
  ],
  [true, true, false],
);
check(
  'in wants one of the listed values, written as a list or comma text',
  [
    templateVisibility({ visibility: { variable: 'd', in: ['light', 'switch'] } }, [{ d: 'switch' }]).visible,
    templateVisibility({ visibility: { variable: 'd', in: 'light, switch' } }, [{ d: 'switch' }]).visible,
    templateVisibility({ visibility: { variable: 'd', in: ['light'] } }, [{ d: 'switch' }]).visible,
  ],
  [true, true, false],
);
check(
  'matches is a glob, case-insensitive like the repeat filters',
  [
    templateVisibility({ visibility: { variable: 'e', matches: 'light.kitchen_*' } }, [{ e: 'light.kitchen_ceiling' }])
      .visible,
    templateVisibility({ visibility: { variable: 'e', matches: 'light.kitchen_*' } }, [{ e: 'light.hall' }]).visible,
  ],
  [true, false],
);

check(
  'conditions read the variables as they end up: a declared default counts',
  templateVisibility(
    { variables: [{ name: 'mode', default: 'full' }], visibility: { variable: 'mode', equals: 'full' } },
    [],
  ),
  { visible: true },
);
check(
  'and a let: value too',
  templateVisibility({ let: { slug: '[[area|slug]]' }, visibility: { variable: 'slug', equals: 'living_room' } }, [
    { area: 'Living Room' },
  ]),
  { visible: true },
);

check(
  'malformed conditions are ignored rather than hiding everything',
  visibilityConditions({ visibility: [{ exists: true }, 'x', { variable: 'a' }, { variable: 'b', exists: true }] }),
  [{ variable: 'b', exists: true }],
);

/* ------------------------------------------------- required and visibility compose */

const both = {
  variables: [{ name: 'climate', required: true }],
  visibility: { variable: 'area', not_in: ['Shed'] },
  card: {},
};
check(
  'required drops a copy first; visibility drops another; the rest are built',
  [{ area: 'Hall', climate: 'climate.h' }, { area: 'Shed', climate: 'climate.s' }, { area: 'Loft' }].map(
    (item) => hasRequiredVariables(both, item) && templateVisibility(both, [item]).visible,
  ),
  [true, false, false],
);

/* ------------------------------------------------------------- the slot drawn */

check(
  'an item is named by its name, area or entity, in that order',
  [
    itemLabel({ entity: 'light.a', area: 'Kitchen', name: 'Ceiling' }, 0),
    itemLabel({ entity: 'light.a', area: 'Kitchen' }, 0),
    itemLabel({ entity: 'light.a' }, 0),
    itemLabel({ brightness: 50 }, 0),
    itemLabel('light.a', 0),
    itemLabel({}, 2),
  ],
  ['Ceiling', 'Kitchen', 'light.a', '50', 'light.a', '#3'],
);
check('the slot card config', skippedConfig('Garage', 'area is "Garage" (not_in: Garage, Shed)'), {
  type: `custom:${SKIPPED_TAG}`,
  label: 'Garage',
  reason: 'area is "Garage" (not_in: Garage, Shed)',
});
