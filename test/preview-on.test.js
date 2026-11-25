/*
 * #510: a field declared `preview_on: leave` tells the edit dialog's preview about its value
 * only once the field is left, so typing a number a slow card rebuilds on does not rebuild it
 * per keystroke. These cover the decision: which edits wait and which go straight through.
 */
const { check } = require('./check');
const { onlyLeaveFieldsChanged, updatesOnLeave } = require('../.test-build/card-editor/preview-on');

const declarations = [
  { name: 'weather_scale', type: 'number', preview_on: 'leave' },
  { name: 'offset', preview_on: 'leave' },
  { name: 'camera', type: 'entity' },
  { name: 'title', preview_on: 'typing' },
];
const card = (variables, more = {}) => ({
  type: 'custom:decluttering-card',
  template: 'camera_card',
  variables,
  ...more,
});
const before = card([{ camera: 'camera.front' }, { weather_scale: 1 }]);

check('updatesOnLeave: leave waits', updatesOnLeave({ preview_on: 'leave' }), true);
check('updatesOnLeave: typing does not', updatesOnLeave({ preview_on: 'typing' }), false);
check('updatesOnLeave: unset does not', updatesOnLeave({}), false);
check('updatesOnLeave: no declaration', updatesOnLeave(undefined), false);

check(
  'a leave field changing waits',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.front' }, { weather_scale: 1.5 }]), declarations),
  true,
);
check(
  'a leave field set for the first time waits',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.front' }, { weather_scale: 1 }, { offset: 4 }]), declarations),
  true,
);
check(
  'a leave field cleared waits',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.front' }]), declarations),
  true,
);
check(
  'two leave fields changing together wait',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.front' }, { weather_scale: 2 }, { offset: 1 }]), declarations),
  true,
);
check(
  'a field without preview_on goes straight through',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.back' }, { weather_scale: 1 }]), declarations),
  false,
);
check(
  'preview_on: typing goes straight through',
  onlyLeaveFieldsChanged(
    before,
    card([{ camera: 'camera.front' }, { weather_scale: 1 }, { title: 'x' }]),
    declarations,
  ),
  false,
);
check(
  'a leave field with another field goes straight through',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.back' }, { weather_scale: 3 }]), declarations),
  false,
);
check(
  'an undeclared variable goes straight through',
  onlyLeaveFieldsChanged(before, card([{ camera: 'camera.front' }, { weather_scale: 1 }, { extra: 1 }]), declarations),
  false,
);
check(
  'a layout change with a leave field goes straight through',
  onlyLeaveFieldsChanged(
    before,
    card([{ camera: 'camera.front' }, { weather_scale: 2 }], { columns: 2 }),
    declarations,
  ),
  false,
);
check(
  'a template change goes straight through',
  onlyLeaveFieldsChanged(
    before,
    { ...card([{ camera: 'camera.front' }, { weather_scale: 2 }]), template: 'other' },
    declarations,
  ),
  false,
);
check(
  'nothing changed sends as before',
  onlyLeaveFieldsChanged(before, card([...before.variables]), declarations),
  false,
);
check('no config yet sends', onlyLeaveFieldsChanged(undefined, before, declarations), false);
check(
  'mapping-form variables are read the same',
  onlyLeaveFieldsChanged(
    card({ camera: 'camera.front', weather_scale: 1 }),
    card([{ camera: 'camera.front' }, { weather_scale: 1.25 }]),
    declarations,
  ),
  true,
);
