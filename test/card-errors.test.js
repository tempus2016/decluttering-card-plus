/*
 * Unit tests for src/card-errors.ts (#463): finding the error cards Home Assistant puts in
 * place of a card that refused its config, reading what each says, and whether
 * `show_card_errors:` is on. The elements are plain objects shaped like the DOM. Run with `npm test`.
 */
const { check } = require('./check.js');
const { errorOf, findCardErrors, showCardErrors, sameErrors, errorLine } = require('../.test-build/card-errors.js');

// An element: a tag, children, an optional shadow root and anything else it holds.
const el = (localName, extra = {}, children = []) => {
  const node = { localName, children, style: {}, ...extra };
  for (const child of children) child.parentElement = node;
  return node;
};
const errorCard = (config, extra) => el('hui-error-card', { _config: config, ...extra });

// errorOf: today's message, the older error key, and a badge
check('errorOf: message', errorOf(errorCard({ type: 'error', message: "invalid configuration: ['view.actions']" })), {
  message: "invalid configuration: ['view.actions']",
});
check('errorOf: older error key', errorOf(errorCard({ type: 'error', error: 'Bad', origConfig: { type: 'tile' } })), {
  type: 'tile',
  message: 'Bad',
});
check('errorOf: badge', errorOf(el('hui-error-badge', { _config: { type: 'error', error: 'No entity' } })), {
  message: 'No entity',
});
check('errorOf: says nothing', errorOf(errorCard({ type: 'error' })), undefined);
check('errorOf: not an error card', errorOf(el('hui-tile-card', { _config: { message: 'x' } })), undefined);
check('errorOf: nothing', errorOf(undefined), undefined);

// errorOf: the type comes from the hui-card around it
const acc = errorCard({ type: 'error', message: 'invalid configuration' });
el('hui-card', { config: { type: 'custom:advanced-camera-card' } }, [acc]);
check('errorOf: type from the hui-card', errorOf(acc), {
  type: 'custom:advanced-camera-card',
  message: 'invalid configuration',
});

// findCardErrors: through a stack's shadow root and into a hidden hui-card's element
const inStack = errorCard({ type: 'error', message: 'one' });
const hidden = errorCard({ type: 'error', message: 'two' });
const stack = el('hui-vertical-stack-card', {
  shadowRoot: {
    children: [el('div', {}, [el('hui-card', { config: { type: 'tile' } }, [inStack])])],
  },
});
const root = el('hui-card', {}, [stack, el('hui-card', { _element: hidden })]);
check(
  'findCardErrors: stack and hidden card',
  findCardErrors(root).map(({ error }) => error.message),
  ['one', 'two'],
);
check('findCardErrors: the element is returned', findCardErrors(root)[0].element === inStack, true);
check('findCardErrors: nothing', findCardErrors(undefined), []);
check('findCardErrors: no errors', findCardErrors(el('hui-card', {}, [el('hui-tile-card')])), []);

// findCardErrors: one still waiting for its custom card to load is not an error yet
const waiting = errorCard({ type: 'error', message: "Custom element doesn't exist: my-card." });
waiting.style.display = 'None';
check('findCardErrors: waiting is skipped', findCardErrors(el('hui-card', {}, [waiting])), []);
waiting.style.display = '';
check('findCardErrors: once shown it counts', findCardErrors(el('hui-card', {}, [waiting])).length, 1);

// findCardErrors: an element reached twice is read once
const shared = errorCard({ type: 'error', message: 'once' });
check('findCardErrors: read once', findCardErrors(el('hui-card', { _element: shared }, [shared])).length, 1);

// showCardErrors: the card's word wins over the template's
check('showCardErrors: off by default', showCardErrors({}, {}), false);
check('showCardErrors: card', showCardErrors({ show_card_errors: true }, {}), true);
check('showCardErrors: template', showCardErrors({}, { show_card_errors: true }), true);
check(
  'showCardErrors: card false beats template',
  showCardErrors({ show_card_errors: false }, { show_card_errors: true }),
  false,
);
check('showCardErrors: not a boolean', showCardErrors({ show_card_errors: 'yes' }, undefined), false);

// sameErrors and errorLine
check('sameErrors: same', sameErrors([{ type: 'a', message: 'b' }], [{ type: 'a', message: 'b' }]), true);
check('sameErrors: different', sameErrors([{ message: 'b' }], [{ message: 'c' }]), false);
check('sameErrors: length', sameErrors([], [{ message: 'c' }]), false);
check('errorLine: with type', errorLine({ type: 'tile', message: 'Bad' }), 'tile: Bad');
check('errorLine: without type', errorLine({ message: 'Bad' }), 'Bad');

/* ------------------------------------------------- the report and the editor */

const { formatReport } = require('../.test-build/report.js');
const { reportTree } = require('../.test-build/report-tree.js');
const {
  advancedData,
  applyAdvanced,
  advancedCount,
  advancedSchema,
} = require('../.test-build/card-editor/advanced.js');

const reports = [{ label: '"cam"', chain: [], ms: 1, sections: [] }];
const cardErrors = ["custom:advanced-camera-card: invalid configuration: ['view.actions']"];
const text = formatReport({ context: { version: '9.9.9' }, reports, cardErrors });
check(
  'report: refused cards get a section',
  text.includes(
    "## Cards that refused their config\n\n- custom:advanced-camera-card: invalid configuration: \\['view.actions'\\]",
  ) ||
    text.includes(
      "## Cards that refused their config\n\n- custom:advanced-camera-card: invalid configuration: ['view.actions']",
    ),
  true,
);
check(
  'report: no section without any',
  formatReport({ context: { version: '9.9.9' }, reports }).includes('refused their config'),
  false,
);
const tree = reportTree({ reports, neverBuilt: [], cardErrors });
const node = tree.find((each) => each.id === 'card-errors');
check(
  'tree: refused cards node',
  [node?.title, node?.meta, node?.children?.[0]?.title],
  ['Cards that refused their config', '1', cardErrors[0]],
);
check(
  'tree: no node without any',
  reportTree({ reports, neverBuilt: [] }).some((each) => each.id === 'card-errors'),
  false,
);

// The Advanced section: a switch for show_card_errors
const base = { type: 'custom:decluttering-card-plus', template: 't' };
check('advanced: off by default', advancedData(base).show_card_errors, undefined);
check('advanced: read', advancedData({ ...base, show_card_errors: true }).show_card_errors, true);
check(
  'advanced: written on',
  applyAdvanced(base, { ...advancedData(base), show_card_errors: true }).show_card_errors,
  true,
);
check(
  'advanced: off removes it',
  'show_card_errors' in
    applyAdvanced({ ...base, show_card_errors: true }, { ...advancedData(base), show_card_errors: false }),
  false,
);
check(
  'advanced: a written false is kept',
  applyAdvanced({ ...base, show_card_errors: false }, advancedData({ ...base, show_card_errors: false }))
    .show_card_errors,
  false,
);
check('advanced: counted', advancedCount({ ...base, show_card_errors: true }), 1);
check(
  'advanced: in the form',
  advancedSchema().some((entry) => entry.name === 'show_card_errors'),
  true,
);
