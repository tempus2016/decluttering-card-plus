/*
 * Unit tests for src/code-hooks.ts - placeholder spans and completions in the code editor (ideas 25, 27).
 * Run with `npm test`.
 */
const { placeholderSpans, completionsAt, orderedSteps, argumentValues } = require('../.test-build/code-hooks.js');

const { check } = require('./check');

const text = 'type: tile\nentity: [[entity]]\nname: [[name|default:[[entity|area]]]]\nicon: [[icon?]]\nx: [[!kept]]\n';
const spans = placeholderSpans(text, (p) => (p.includes('icon') ? { kind: 'unset' } : { kind: 'ok', message: 'v' }));
check(
  'every outermost placeholder with its place and kind, escaped ones skipped',
  spans.map((s) => [s.text, s.kind, text.slice(s.from, s.to) === s.text]),
  [
    ['[[entity]]', 'ok', true],
    ['[[name|default:[[entity|area]]]]', 'ok', true],
    ['[[icon?]]', 'unset', true],
  ],
);

const ctx = {
  variables: [
    { name: 'entity', type: 'entity', required: true },
    { name: 'name', type: 'text' },
    { name: 'colour', selector: { select: {} } },
  ],
  lets: ['area_slug'],
  shared: [{ name: 'accent' }, { name: 'name' }],
  sample: (step) => ({ area: 'Kitchen', friendly_name: 'Kitchen ceiling' })[step],
};
const doc = 'name: [[';
check(
  'after [[ the variables come first, then lets, then shared names not already declared',
  completionsAt(doc, doc.length, ctx),
  {
    from: 8,
    heading: 'variables',
    options: [
      { label: 'entity', detail: 'entity, required' },
      { label: 'name', detail: 'text' },
      { label: 'colour', detail: 'select' },
      { label: 'area_slug', detail: 'let' },
      { label: 'accent', detail: 'dashboard' },
    ],
  },
);
check(
  'typing narrows the variables',
  completionsAt('[[co', 4, ctx).options.map((o) => o.label),
  ['colour'],
);
const piped = 'name: [[entity|';
const steps = completionsAt(piped, piped.length, ctx);
check(
  'after | the steps, with a sample where the resolver has one',
  [steps.heading, steps.from, steps.options.slice(0, 3)],
  [
    'steps',
    15,
    [
      { label: 'default:', detail: undefined },
      { label: 'if:', detail: undefined },
      { label: 'slug', detail: undefined },
    ],
  ],
);
check('a resolver step carries its sample', steps.options.find((o) => o.label === 'area').detail, 'Kitchen');
check(
  'typing narrows the steps',
  completionsAt('[[entity|fr', 11, ctx).options.map((o) => o.label),
  ['friendly_name'],
);
check('after if: sample conditions', completionsAt('[[name|if:', 10, ctx), {
  from: 10,
  heading: 'values',
  options: [{ label: 'other' }, { label: '!other' }, { label: 'mode=on' }, { label: 'mode!=off' }],
});
check(
  'nothing outside a placeholder, after it closed, or across a line',
  [completionsAt('name: x', 7, ctx), completionsAt('[[a]] b', 7, ctx), completionsAt('[[a\nb', 5, ctx)],
  [null, null, null],
);
check(
  'the step list starts with the common ones and has every known step',
  [orderedSteps().slice(0, 3), orderedSteps().includes('json')],
  [['default:', 'if:', 'slug'], true],
);
check(
  'argument samples exist for if and round only, so far',
  [argumentValues('if').length, argumentValues('round'), argumentValues('slug')],
  [4, ['0', '1', '2'], []],
);

// #403: a stray `[` in button-card JavaScript once made this scan backtrack for minutes.
{
  const js =
    "[[[\n  const lastUpdate = hass.states['sensor.mg_hs_phev_trophy_last_update_time']?.state;\n  const c = 'test'[0];\n  if (!['unknown','unavailable'].includes(lastUpdate)) return c;\n]]] [[entity]]";
  const started = Date.now();
  const found = placeholderSpans(js, () => ({ kind: 'ok' })).map((span) => span.text);
  check('button-card JavaScript with brackets is scanned quickly', Date.now() - started < 500, true);
  check('and the real placeholder after it is still found', found, ['[[entity]]']);
}

// #429: `pick:` is offered after a `|`, with a sample argument after its colon.
check(
  'pick: is in the step list and has a sample argument',
  [orderedSteps().includes('pick:'), argumentValues('pick')],
  [true, ['name=value,icon']],
);
