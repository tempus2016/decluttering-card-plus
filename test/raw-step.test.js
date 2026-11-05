/*
 * The `raw` step (#391): a variable's value as it was written, before its own placeholders
 * are filled. Run with `npm test`, which transpiles the source into .test-build first.
 */
const deepReplace = require('../.test-build/deep-replace.js').default;
const { KNOWN_STEPS } = require('../.test-build/variables.js');

const { check } = require('./check');

const warnings = [];
console.warn = (m) => warnings.push(m);

const CAMERA = [{ cam_name: 'my_camera' }, { camera_entity: 'camera.[[cam_name]]' }];

check(
  'raw gives the value as written, its placeholders left unfilled',
  deepReplace(CAMERA, {}, { content: 'There was an error rendering "[[camera_entity|raw]]"!' }),
  { content: 'There was an error rendering "camera.[[cam_name]]"!' },
);

check(
  'the same variable without raw is still filled',
  deepReplace(CAMERA, {}, { entity: '[[camera_entity]]', content: '[[camera_entity|raw]]' }),
  { entity: 'camera.my_camera', content: 'camera.[[cam_name]]' },
);

check(
  'raw is not the bang, which only writes the brackets',
  deepReplace(CAMERA, {}, { a: '[[!camera_entity]]', b: '[[camera_entity|raw]]' }),
  { a: '[[camera_entity]]', b: 'camera.[[cam_name]]' },
);

check(
  'raw works from a template default too',
  deepReplace(undefined, { default: CAMERA }, { content: '[[camera_entity|raw]]' }),
  { content: 'camera.[[cam_name]]' },
);

check(
  'raw keeps steps and escapes in the value as written',
  deepReplace([{ a: 1 }, { label: '[[name|upper]] and [[!kept]]' }], {}, { content: '[[label|raw]]' }),
  { content: '[[name|upper]] and [[!kept]]' },
);

check(
  'raw of a value with no placeholders is the value',
  deepReplace([{ name: 'Hall' }], {}, { a: '[[name|raw]]', b: 'x [[name|raw]] y' }),
  { a: 'Hall', b: 'x Hall y' },
);

check(
  'raw of a mapping is its JSON as written',
  deepReplace([{ cam_name: 'c' }, { map: { entity: 'camera.[[cam_name]]' } }], {}, { content: '[[map|raw]]' }),
  { content: '{"entity":"camera.[[cam_name]]"}' },
);

check(
  'raw keeps button-card JavaScript as written',
  deepReplace([{ js: '[[[ return 1 ]]]' }], {}, { content: '[[js|raw]]' }),
  { content: '[[[ return 1 ]]]' },
);

check(
  'raw can be shaped further, the placeholders still left',
  deepReplace(CAMERA, {}, { content: '[[camera_entity|raw|upper]]' }),
  { content: 'CAMERA.[[CAM_NAME]]' },
);

warnings.length = 0;
check(
  'nothing unset is reported for a raw placeholder',
  (deepReplace(CAMERA, {}, { a: '[[camera_entity|raw]]' }), warnings),
  [],
);

warnings.length = 0;
check('raw later in the chain is left as written', deepReplace(CAMERA, {}, { a: '[[camera_entity|upper|raw]]' }), {
  a: '[[camera_entity|upper|raw]]',
});
check(
  'and says raw has to come first',
  warnings.some((w) => /raw/.test(w) && /first/.test(w)),
  true,
);

check(
  'raw with a default stands in when nothing is set',
  deepReplace([{ other: 1 }], {}, { a: '[[nope|raw|default:none]]' }),
  {
    a: 'none',
  },
);

check('the lint knows raw', KNOWN_STEPS.includes('raw'), true);
