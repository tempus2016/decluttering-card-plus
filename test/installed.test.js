/*
 * The steps that ask what is installed (#397): integration_exists, card_exists, icon_exists,
 * and the if_ forms that keep the value or leave a gap. Node has no custom element registry
 * and no window, so both are stood in for here, the way a browser would have them.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { usesResolver, usesInstalled } = require('../.test-build/variables.js');
const { lintTemplate } = require('../.test-build/lint.js');
const lint = (template) => lintTemplate(template).map((f) => f.key);
const { unmetRequirements } = require('../.test-build/sharing.js');
const installed = require('../.test-build/installed.js');

const { check } = require('./check');

const warnings = [];
const realWarn = console.warn;
console.warn = (m) => warnings.push(m);

// No browser yet: card_exists and icon_exists have nothing to ask, like exists before hass.
check(
  'with no browser to ask, card_exists and icon_exists leave the placeholder for later',
  deepReplace(
    [{ c: 'more-info-popup-card', i: 'gamer-icons:dog' }],
    {},
    { a: '[[c|card_exists]]', b: '[[i|icon_exists]]' },
  ),
  { a: '[[c|card_exists]]', b: '[[i|icon_exists]]' },
);

const defined = new Map();
const waits = new Map();
globalThis.customElements = {
  get: (tag) => defined.get(tag),
  whenDefined: (tag) =>
    new Promise((resolve) => {
      waits.set(tag, resolve);
    }),
};
globalThis.window = globalThis;

const hass = {
  states: {},
  entities: {},
  config: { components: ['frigate', 'sensor.reolink', 'http'] },
};

const issue = {
  card: {
    use_more_info: '[[more_info_name|card_exists]]',
    icon: '[[custom_dog_icon|if_icon_exists|or:stock_icon]]',
  },
};
const issueValues = [
  { more_info_name: 'more-info-popup-card', custom_dog_icon: 'gamer-icons:dog', stock_icon: 'mdi:dog' },
];

check(
  "the issue's example falls back on the stock icon and switches the popup off where neither is installed",
  deepReplace(issueValues, {}, issue, undefined, hass),
  { card: { use_more_info: false, icon: 'mdi:dog' } },
);

defined.set('more-info-popup-card', class {});
globalThis.customIcons = { 'gamer-icons': { getIcon: () => undefined } };
check(
  "the issue's example keeps the custom icon and switches the popup on where both are installed",
  deepReplace(issueValues, {}, issue, undefined, hass),
  { card: { use_more_info: true, icon: 'gamer-icons:dog' } },
);
delete globalThis.customIcons;

check(
  'integration_exists reads hass.config.components, a platform counting as its integration',
  deepReplace(
    [{ a: 'frigate' }, { b: 'reolink' }, { c: 'zwave_js' }],
    {},
    {
      a: '[[a|integration_exists]]',
      b: '[[b|integration_exists]]',
      c: '[[c|integration_exists]]',
      d: '[[unset|integration_exists]]',
    },
    undefined,
    hass,
  ),
  { a: true, b: true, c: false, d: false },
);
check(
  'integration_exists waits for Home Assistant the way exists does',
  deepReplace([{ a: 'frigate' }], {}, { a: '[[a|integration_exists]]' }),
  { a: '[[a|integration_exists]]' },
);
check(
  'if_integration_exists keeps the value or is a gap for ?, default: and or:',
  deepReplace(
    [{ yes: 'frigate', no: 'zwave_js', other: 'fallback' }],
    {},
    {
      a: '[[yes|if_integration_exists]]',
      b: '[[no|if_integration_exists?]]',
      c: '[[no|if_integration_exists|default:none]]',
      d: '[[no|if_integration_exists|or:other]]',
    },
    undefined,
    hass,
  ),
  { a: 'frigate', c: 'none', d: 'fallback' },
);

check(
  'card_exists takes a card type with or without custom:, and a name that cannot be an element is a no',
  deepReplace(
    [{ a: 'custom:more-info-popup-card', b: 'more-info-popup-card', c: 'button-card', d: 'tile' }],
    {},
    { a: '[[a|card_exists]]', b: '[[b|card_exists]]', c: '[[c|card_exists]]', d: '[[d|card_exists]]' },
    undefined,
    hass,
  ),
  { a: true, b: true, c: false, d: false },
);
check(
  'if_card_exists keeps the type or falls back',
  deepReplace(
    [{ popup: 'custom:more-info-popup-card', missing: 'custom:button-card', plain: 'entities' }],
    {},
    { a: '[[popup|if_card_exists]]', b: '[[missing|if_card_exists|or:plain]]' },
    undefined,
    hass,
  ),
  { a: 'custom:more-info-popup-card', b: 'entities' },
);

check(
  'icon_exists checks only the set: mdi is always there, an unknown set or no colon is a no',
  deepReplace(
    [{ a: 'mdi:anything-at-all', b: 'gamer-icons:dog', c: 'dog' }],
    {},
    { a: '[[a|icon_exists]]', b: '[[b|icon_exists]]', c: '[[c|icon_exists]]' },
    undefined,
    hass,
  ),
  { a: true, b: false, c: false },
);
globalThis.customIconsets = { fapro: () => undefined };
check(
  'icon_exists knows a set registered the old way, on customIconsets',
  deepReplace([{ a: 'fapro:dog' }], {}, { a: '[[a|icon_exists]]' }, undefined, hass),
  { a: true },
);
delete globalThis.customIconsets;

check(
  'the steps count as asking, so the card builds again when the answer can change',
  [
    usesResolver({ card: { a: '[[x|card_exists]]' } }),
    usesResolver({ card: { a: '[[x|if_icon_exists?]]' } }),
    usesInstalled({ card: { a: '[[x|if_integration_exists|default:y]]' } }),
    usesInstalled({ card: { a: '[[x|exists]]' } }),
  ],
  [true, true, true, false],
);

check(
  'the lint knows all six steps',
  lint({
    default: [{ x: 'y' }],
    card: {
      a: '[[x|integration_exists]]',
      b: '[[x|if_integration_exists?]]',
      c: '[[x|card_exists]]',
      d: '[[x|if_card_exists?]]',
      e: '[[x|icon_exists]]',
      f: '[[x|if_icon_exists?]]',
    },
  }),
  [],
);

check(
  'the sharing check still reads a platform as its integration after sharing the helper',
  unmetRequirements([{ requires: { integrations: ['reolink', 'zwave_js'] } }], {
    components: hass.config.components,
    entities: [],
    card: '9.9.9',
    isDefined: () => false,
  }).map((each) => each.any),
  [['zwave_js']],
);

// A card waited for that turns up tells every listener once.
(async () => {
  let heard = 0;
  const stop = installed.whenInstalledChanges(() => {
    heard += 1;
  });
  const before = installed.installedKey(hass)[2];
  check(
    'a missing card is waited for once',
    [installed.cardExists('late-card'), installed.cardExists('late-card'), waits.has('late-card')],
    [false, false, true],
  );
  defined.set('late-card', class {});
  waits.get('late-card')();
  await new Promise((resolve) => setTimeout(resolve, 0));
  stop();
  check('its arrival moves the key and calls the listener', [heard, installed.installedKey(hass)[2] - before], [1, 1]);
  console.warn = realWarn;
})();
