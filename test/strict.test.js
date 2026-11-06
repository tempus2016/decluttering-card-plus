/*
 * `strict:` level by level (#390): what each place writes, and how the places add up.
 */
const { check } = require('./check');
const { strictLayer, strictLevels, placeStrict, strictProblems } = require('../.test-build/strict');

check('strict: true is errors fail, warnings left alone - as it always was', strictLevels([true]), {
  errors: 'fail',
  warnings: 'ignore',
});
check('strict: false is both ignored', strictLevels([false]), { errors: 'ignore', warnings: 'ignore' });
check('nothing anywhere is both ignored', strictLevels([undefined, undefined]), {
  errors: 'ignore',
  warnings: 'ignore',
});
check('the level-by-level form', strictLevels([{ errors: 'report', warnings: 'notice' }]), {
  errors: 'report',
  warnings: 'notice',
});
check('error: and warn:, as the issue wrote them, are read too', strictLayer({ error: 'fail', warn: 'report' }), {
  errors: 'fail',
  warnings: 'report',
});
check('modes are read without regard to case', strictLayer({ errors: 'Fail' }), { errors: 'fail' });
check(
  'a mode a level does not have is left to the next place',
  strictLevels([{ warnings: 'fail' }, { warnings: 'notice' }]),
  {
    errors: 'ignore',
    warnings: 'notice',
  },
);
check(
  'each level comes from the nearest place that sets it',
  strictLevels([{ warnings: 'notice' }, undefined, { errors: 'fail', warnings: 'report' }]),
  { errors: 'fail', warnings: 'notice' },
);
check('a card strict: false turns off what the dashboard asks for', strictLevels([false, { errors: 'fail' }]), {
  errors: 'ignore',
  warnings: 'ignore',
});
check('a card strict: true beats a dashboard report', strictLevels([true, { errors: 'report', warnings: 'report' }]), {
  errors: 'fail',
  warnings: 'ignore',
});

const ll = {
  decluttering_strict: { errors: 'report' },
  views: [
    { decluttering_strict: { warnings: 'notice' }, sections: [{ decluttering_strict: true }, {}] },
    { strategy: { type: 'custom:x', decluttering_strict: { warnings: 'report' } } },
  ],
};
check('a section, its view and the dashboard, nearest first', placeStrict(ll, 0, 0), [
  true,
  { warnings: 'notice' },
  { errors: 'report' },
]);
check('a section of its own beats the view', strictLevels(placeStrict(ll, 0, 0)), {
  errors: 'fail',
  warnings: 'ignore',
});
check('a section without one takes the view and the dashboard', strictLevels(placeStrict(ll, 0, 1)), {
  errors: 'report',
  warnings: 'notice',
});
check('a view written out by its strategy is read from inside it', strictLevels(placeStrict(ll, 1)), {
  errors: 'report',
  warnings: 'report',
});
check('with no view known, only the dashboard', strictLevels(placeStrict(ll, undefined)), {
  errors: 'report',
  warnings: 'ignore',
});

check(
  'lint: nothing to say about booleans and good modes',
  [strictProblems(true), strictProblems({ errors: 'fail' })],
  [[], []],
);
check('lint: a text strict is not a form it takes', strictProblems('yes'), [
  { key: 'strict', value: 'yes', allowed: 'true, false, errors:, warnings:' },
]);
