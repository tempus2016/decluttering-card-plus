/*
 * Unit tests for src/unread.ts: the variables a card passes that its template never reads,
 * which the health panel lists. Run with `npm test`.
 */
const { readsIn, templateReads, unreadVariables, checkUnreadVariables } = require('../.test-build/unread.js');
const { collectTemplates } = require('../.test-build/templates.js');

const { check } = require('./check');

/* -------------------------------------------------------------------- readsIn */

check('plain text reads nothing', readsIn('Living room'), []);
check('a value that is not text is read as its JSON', readsIn({ a: ['[[x]]'] }), ['x']);
check('undefined reads nothing', readsIn(undefined), []);
check('a placeholder reads its name', readsIn('[[entity]]'), ['entity']);
check('a dotted name reads the name and the mapping it reaches into', readsIn('[[room.light]]'), [
  'room.light',
  'room',
]);
check('transforms are not names', readsIn('[[room|slug|upper]]'), ['room']);
check('or: and if: name variables too', readsIn('[[a|or:b|if:c=on]]'), ['a', 'b', 'c']);
check('an optional marker is not part of the name', readsIn('[[a?]] [[b|or:c?]]'), ['a', 'b', 'c']);
check('a nested lookup reads both', readsIn('[[colours.[[level]]]]'), ['level', 'colours._', 'colours']);
check('an escaped placeholder reads nothing', readsIn('[[!entity]]'), []);

/* -------------------------------------------------------------------- unreadVariables */

const tile = { card: { type: 'tile', entity: '[[entity]]', name: '[[name|or:label]]' } };

check(
  'a card passing only what is read is fine',
  unreadVariables(tile, {}, [{ entity: 'light.a' }, { label: 'A' }]),
  [],
);

check('a typo is unread, with the name it was meant to be', unreadVariables(tile, {}, [{ entitiy: 'light.a' }]), [
  { name: 'entitiy', closest: 'entity' },
]);

check('a name with no near miss has no suggestion', unreadVariables(tile, {}, [{ colour_scheme: 'dark' }]), [
  { name: 'colour_scheme' },
]);

check(
  'the near miss is never a name the card already passes',
  unreadVariables({ card: { a: '[[name]]' } }, {}, [{ name: 'x' }, { nmae: 'y' }]),
  [{ name: 'nmae' }],
);

check('a variable read only through or: is read', unreadVariables(tile, {}, [{ label: 'x' }]), []);

check(
  'a variable read only through if: is read',
  unreadVariables({ card: { a: '[[x|if:show]]' } }, {}, { show: true }),
  [],
);

check(
  'declared and defaulted names count, even unused',
  unreadVariables({ variables: [{ name: 'a' }], default: [{ b: 1 }], card: {} }, {}, { a: 1, b: 2 }),
  [],
);

check(
  'placeholders in let: values, group cards and style are read',
  unreadVariables(
    { let: { slug: '[[room|slug]]' }, group: { cards: [{ entity: '[[e]]' }] }, style: 'color: [[c]]' },
    {},
    { room: 'x', e: 'y', c: 'z' },
  ),
  [],
);

check(
  'a name the template works out in let: is never read from the card',
  unreadVariables({ let: { slug: 'fixed' }, card: { a: '[[slug]]' } }, {}, { slug: 'mine' }),
  [{ name: 'slug' }],
);

check(
  'a variable read by the value of a read variable is read',
  unreadVariables({ card: { name: '[[label]]' } }, {}, [{ label: '[[room]] light' }, { room: 'Hall' }]),
  [],
);

check(
  'but not when the variable holding it is itself unread',
  unreadVariables({ card: { name: 'x' } }, {}, [{ label: '[[room]]' }, { room: 'Hall' }]),
  [{ name: 'label' }, { name: 'room' }],
);

check(
  'a mapping read through one of its keys is read',
  unreadVariables({ card: { a: '[[room.light]]' } }, {}, { room: { light: 'light.a' } }),
  [],
);

check('no template, nothing to say', unreadVariables(undefined, {}, { a: 1 }), []);

/* -------------------------------------------------------------------- nesting */

const templates = {
  inner: { card: { entity: '[[camera]]' } },
  outer: {
    card: {
      type: 'vertical-stack',
      cards: [{ type: 'custom:decluttering-card-plus', template: 'inner', inherit_variables: true }],
    },
  },
  explicit: {
    card: { type: 'custom:decluttering-card-plus', template: 'inner', variables: [{ camera: '[[cam]]' }] },
  },
  loop: { card: { type: 'custom:decluttering-card-plus', template: 'loop', inherit_variables: true, x: '[[y]]' } },
};

check(
  'a nested card handed every variable reads what its template reads',
  unreadVariables(templates.outer, templates, { camera: 'camera.a' }),
  [],
);

check(
  'a nested card given its variables by name reads only those placeholders',
  unreadVariables(templates.explicit, templates, { camera: 'camera.a', cam: 'camera.b' }),
  [{ name: 'camera' }],
);

check(
  'a nested template that cannot be seen makes the answer unknowable, so nothing is said',
  unreadVariables(templates.outer, {}, { anything: 1 }),
  [],
);

check('a template nesting itself does not loop', unreadVariables(templates.loop, templates, { y: 1, z: 2 }), [
  { name: 'z' },
]);

check(
  'templateReads gathers declarations, defaults and placeholders',
  [...templateReads({ variables: [{ name: 'a' }], default: { b: 1 }, card: { c: '[[c]]' } }, {}).names].sort(),
  ['a', 'b', 'c'],
);

check('templateReads of nothing is empty and complete', templateReads(undefined, {}), { names: {}, complete: true });

/* -------------------------------------------------------------------- the dashboard */

const dashboard = {
  decluttering_defaults: [{ shared_colour: 'red' }],
  decluttering_templates: { tile },
  views: [
    {
      title: 'Home',
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ entity: 'a' }, { entitiy: 'b' }] },
        { type: 'custom:decluttering-card-plus', template: 'tile', variables: [{ entitiy: 'c' }] },
        { type: 'custom:decluttering-card-plus', template: 'nowhere', variables: [{ x: 1 }] },
        {
          type: 'custom:decluttering-card-plus',
          template: 'tile',
          for_each: [{ entity: 'a', icon: 'mdi:x' }],
          for_each_from: { entities: 'light.*', overrides: { 'light.a': { nmae: 'A' } } },
        },
      ],
    },
    {
      path: 'second',
      sections: [
        {
          type: 'grid',
          cards: [{ type: 'custom:decluttering-card', template: 'tile', variables: { shared_colour: 'blue' } }],
        },
      ],
    },
  ],
};

check(
  'every card on the dashboard passing what its template never reads',
  checkUnreadVariables(dashboard, collectTemplates(dashboard)),
  [
    {
      view: { title: 'Home', path: '', index: 0 },
      template: 'tile',
      name: 'entitiy',
      closest: 'entity',
      where: 'variables',
      count: 2,
    },
    { view: { title: 'Home', path: '', index: 0 }, template: 'tile', name: 'icon', where: 'for_each', count: 1 },
    {
      view: { title: 'Home', path: '', index: 0 },
      template: 'tile',
      name: 'nmae',
      closest: 'name',
      where: 'overrides',
      count: 1,
    },
    {
      view: { title: 'second', path: 'second', index: 1 },
      template: 'tile',
      name: 'shared_colour',
      where: 'variables',
      count: 1,
    },
  ],
);

check('a dashboard with no views has nothing to report', checkUnreadVariables({}, {}), []);

check(
  'a name in defaults: is read by the template that defaults it',
  unreadVariables({ template: 't', defaults: { colour: 'red' }, card: { type: 'tile' } }, {}, [{ colour: 'blue' }]),
  [],
);

/* ------------------------------------- what the view, section and dashboard give */

{
  // The view's let works `vlet` out from `name`; the section's from `who`; the dashboard's
  // defaults read `room`. None of the three is read by the template itself.
  const LETS = {
    decluttering_defaults: [{ label: '[[room]] lights' }],
    decluttering_templates: { let_t: { card: { type: 'markdown', content: '[[vlet]] [[slet]] [[label]]' } } },
    views: [
      {
        type: 'sections',
        decluttering_let: [{ vlet: 'V-[[name]]' }],
        sections: [
          {
            decluttering_let: [{ slet: 'S-[[who]]' }],
            cards: [
              {
                type: 'custom:decluttering-card-plus',
                template: 'let_t',
                variables: [{ name: 'amy' }, { who: 'me' }, { room: 'Hall' }, { vlet: 'mine' }],
              },
            ],
          },
          {
            cards: [{ type: 'custom:decluttering-card-plus', template: 'let_t', variables: [{ who: 'me' }] }],
          },
        ],
      },
    ],
  };
  const found = checkUnreadVariables(LETS, collectTemplates(LETS));
  check(
    "a name read by a let or a default reaching the card is read; one a let works out is the let's, not the card's",
    found.map((each) => `${each.name}@${each.where}`),
    ['vlet@variables', 'who@variables'],
  );
  check(
    "and a section's let reaches only the cards in that section",
    found.filter((each) => each.name === 'who').length,
    1,
  );
}

{
  const ON_ERROR = {
    decluttering_templates: {
      t: { card: { type: 'markdown', content: '[[a]]' }, on_error: { type: 'markdown', content: '[[fromtemplate]]' } },
    },
    views: [
      {
        cards: [
          {
            type: 'custom:decluttering-card-plus',
            template: 't',
            variables: [{ a: 1 }, { fromcard: 2 }, { fromtemplate: 3 }, { nobody: 4 }],
            on_error: { type: 'markdown', content: 'Could not show [[fromcard]]' },
          },
        ],
      },
    ],
  };
  check(
    "names read by the card's on_error or the template's are read",
    checkUnreadVariables(ON_ERROR, collectTemplates(ON_ERROR)).map((each) => each.name),
    ['nobody'],
  );
}
