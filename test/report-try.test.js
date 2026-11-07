/*
 * Unit tests for src/report-try.ts: the debug report's Try a placeholder box (#376), which
 * runs a placeholder typed in through one build's own substitution, chosen by scope, and
 * takes out of what it shows anything the report would take out. Run with `npm test`.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { newTrace } = require('../.test-build/trace.js');
const { tryScopes, tryInReport } = require('../.test-build/report-try.js');
const { formatReport } = require('../.test-build/report.js');
const { withStateScope } = require('../.test-build/variables.js');

const { check } = require('./check');

console.warn = () => {};

// attr: reads only an entity the card rebuilds on, as |state does (idea 39).
const HASS = withStateScope(
  {
    states: {
      'camera.front_porch': {
        entity_id: 'camera.front_porch',
        state: 'idle',
        attributes: { friendly_name: 'Front porch' },
      },
    },
  },
  ['camera.front_porch'],
);

// What element.ts keeps on each section: the build's own call, quiet, or an item fill's values in its place.
const evaluate = (variables, template, name) => (content, onMissing, values) =>
  deepReplace(values ?? variables, values ? {} : template, content, values ? undefined : name, HASS, true, onMissing);

function section(label, variables, template, placeholders = [], items) {
  const trace = newTrace();
  for (const [placeholder, became] of placeholders) trace.placeholders.set(placeholder, became);
  if (items) trace.items = items;
  return {
    ...(label ? { label } : {}),
    variables: variables.map((entry) => ({
      variable: Object.keys(entry)[0],
      value: Object.values(entry)[0],
      from: 'card',
    })),
    trace,
    built: {},
    evaluate: evaluate(variables, template, 'cam'),
  };
}

const template = {
  let: { cam_name: '[[cam|attr:friendly_name]]', cam_id: '[[cam|object_id]]_sub' },
  card: { type: 'picture-entity' },
};

const itemTrace = newTrace();
itemTrace.values = new Map([
  ['entity', 'camera.front_porch'],
  ['size', 3],
]);
itemTrace.placeholders.set('[[size]]', 3);

const reports = [
  {
    label: '"cam"',
    chain: [],
    ms: 1,
    sections: [
      section(
        undefined,
        [{ cam: 'camera.front_porch' }, { pin_code: '8642' }],
        template,
        [['[[cam_id]]', '[[cam|object_id]]_sub']],
        [{ placeholder: '[[row|with:entity=x]]', trace: itemTrace }],
      ),
    ],
  },
  {
    label: '"cam"',
    chain: ['"page"'],
    ms: 1,
    sections: [
      section('Copy 1 of 2', [{ cam: 'camera.back_garden' }], template),
      section('Copy 2 of 2', [{ cam: 'camera.driveway' }], template),
      // A section logged before #376 kept no way to build again, and offers nothing to try.
      { variables: [], trace: newTrace(), built: {} },
    ],
  },
];

const scopes = tryScopes(reports);

check(
  'every build in the report is a scope, nested cards and item fills included',
  scopes.map((scope) => scope.label),
  [
    '"cam"',
    '"cam" › Item template [[row|with:entity=x]]',
    '"page" › "cam" › Copy 1 of 2',
    '"page" › "cam" › Copy 2 of 2',
  ],
);

check('a scope offers its own variables, then the placeholders its build met', scopes[0].offered, [
  '[[cam]]',
  '[[pin_code]]',
  '[[cam_id]]',
]);
check('an item fill offers its values', scopes[1].offered, ['[[entity]]', '[[size]]']);

{
  const result = tryInReport(scopes[0], '[[cam|attr:friendly_name|upper]]', reports, true);
  check(
    'a placeholder typed in is built step by step against the card, asking Home Assistant',
    result.steps.map((step) => [step.step, step.value]),
    [
      ['cam', 'camera.front_porch'],
      ['attr:friendly_name', 'Front porch'],
      ['upper', 'FRONT PORCH'],
    ],
  );
  check('and gives its whole value', result.whole, { value: 'FRONT PORCH', kind: 'text' });
}

check(
  "the template's own let: is read too",
  tryInReport(scopes[0], '[[cam_id]]', reports, true).whole.value,
  'front_porch_sub',
);

check(
  'the same placeholder in another scope reads that build',
  [
    tryInReport(scopes[2], '[[cam_id]]', reports, true).whole.value,
    tryInReport(scopes[3], '[[cam_id]]', reports, true).whole.value,
  ],
  ['back_garden_sub', 'driveway_sub'],
);

check("an item fill's scope reads its values", tryInReport(scopes[1], '[[size|add:1]]', reports, true).whole, {
  value: 4,
  kind: 'number',
});

check('a name nothing sets is said to be unset', tryInReport(scopes[0], '[[nope]]', reports, true).unset, ['nope']);

/* ------------------------------------------------------------------ redaction */

{
  const result = tryInReport(scopes[0], '[[pin_code|upper]]', reports, true);
  check(
    'a secret-named variable shows no value at any step',
    [...result.steps.map((step) => step.value), result.whole.value, result.inText],
    ['<redacted>', '<redacted>', '<redacted>', '<redacted>'],
  );
}

check(
  'nor does a secret asked for inside a step',
  tryInReport(scopes[0], '[[nope|default:[[pin_code]]]]', reports, true).whole.value,
  '<redacted>',
);

check(
  'a secret named anywhere in longer text hides the whole of it',
  tryInReport(scopes[0], 'code [[pin_code|add:0]] and [[cam]]', reports, true).whole.value,
  '<redacted>',
);

check(
  "a number that is a secret's value goes too",
  tryInReport(scopes[0], '[[x|default:8642]]', reports, true).whole.value,
  '<redacted>',
);

check(
  "the report's own rules run over the rest",
  tryInReport(scopes[0], 'http://192.168.1.5/[[cam]]', reports, true).whole.value,
  'http://<redacted-ip>/camera.front_porch',
);

check(
  'with redact: false everything shows as it is',
  tryInReport(scopes[0], '[[pin_code]]', reports, false).whole.value,
  '8642',
);

check(
  'the build kept for the box is not written into the report',
  formatReport({ context: { version: '0' }, reports }).includes('evaluate'),
  false,
);
