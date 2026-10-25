/*
 * Unit tests for src/rename-variable.ts: renaming a variable in a template and in every
 * card that passes it. Run with `npm test`.
 */
const {
  validVariableName,
  renamePlaceholders,
  renameVariableKey,
  renameVariableInTemplate,
  renameVariableInCard,
  affectedTemplates,
  variableNames,
  renameVariableInDashboard,
  borrowsTemplate,
  nameTakenIn,
} = require('../.test-build/rename-variable.js');

const { check, report } = require('./harness');

/* -------------------------------------------------------------------- names */

check('a plain name is valid', ['light', 'room_2', 'a-b'].map(validVariableName), [true, true, true]);
check('a name with a space, a dot or a bracket is not', ['a b', 'a.b', '[[a]]', ''].map(validVariableName), [
  false,
  false,
  false,
  false,
]);

/* -------------------------------------------------------------------- placeholders */

const rename = (text) => renamePlaceholders(text, 'old', 'new');

check('a bare placeholder', rename('[[old]]'), '[[new]]');
check('with a chain', rename('[[old|slug|upper]]'), '[[new|slug|upper]]');
check('optional', rename('[[old?]]'), '[[new?]]');
check('optional after a chain', rename('[[old|suffix: x?]]'), '[[new|suffix: x?]]');
check('a dotted reach into it', rename('[[old.light]]'), '[[new.light]]');
check('named by or:', rename('[[x|or:old]]'), '[[x|or:new]]');
check('named by or: at the end of an optional', rename('[[x|or:old?]]'), '[[x|or:new?]]');
check('named by if:', rename('[[x|if:old]]'), '[[x|if:new]]');
check('named by if: with a value', rename('[[x|if:old=on|bool]]'), '[[x|if:new=on|bool]]');
check(
  'named by a turned-round if:',
  [rename('[[x|if:!old]]'), rename('[[x|if:old!=on]]'), rename('[[x|if:older]]')],
  ['[[x|if:!new]]', '[[x|if:new!=on]]', '[[x|if:older]]'],
);
check('inside longer text, every one', rename('[[old]] and [[old|upper]]!'), '[[new]] and [[new|upper]]!');
check('a lookup by it', rename('[[colours.[[old]]]]'), '[[colours.[[new]]]]');
check('a lookup into it', rename('[[old.[[level]]]]'), '[[new.[[level]]]]');
check(
  'a name that only starts the same is another variable',
  [rename('[[older]]'), rename('[[x|or:older]]'), rename('[[x|if:older]]'), rename('[[old_x.y]]')],
  ['[[older]]', '[[x|or:older]]', '[[x|if:older]]', '[[old_x.y]]'],
);
check('an escaped placeholder is left alone', rename('[[!old]] [[!x|or:old]]'), '[[!old]] [[!x|or:old]]');
check('text without brackets is untouched', rename('old'), 'old');
check('a default: that only mentions it is text', rename('[[x|default:old]]'), '[[x|default:old]]');
check(
  'a name with regex characters is taken literally',
  renamePlaceholders('[[a.b.[[c]]]]', 'a.b', 'z'),
  '[[z.[[c]]]]',
);

/* -------------------------------------------------------------------- variable lists */

check('a list of entries keeps its order', renameVariableKey([{ a: 1 }, { old: 2 }, { c: 3 }], 'old', 'new'), [
  { a: 1 },
  { new: 2 },
  { c: 3 },
]);
check('a mapping keeps its order', renameVariableKey({ a: 1, old: 2, c: 3 }, 'old', 'new'), { a: 1, new: 2, c: 3 });
check('a list without it is returned as it was', renameVariableKey([{ a: 1 }], 'old', 'new'), [{ a: 1 }]);
check('nothing at all stays nothing', renameVariableKey(undefined, 'old', 'new'), undefined);
check(
  'an entry already using the new name, which nothing read, goes',
  renameVariableKey([{ new: 'stale' }, { old: 'kept' }, { b: 1, new: 'x' }], 'old', 'new'),
  [{ new: 'kept' }, { b: 1 }],
);
check('in a mapping too', renameVariableKey({ new: 'stale', old: 'kept' }, 'old', 'new'), { new: 'kept' });
check('anything else in a list is left where it is', renameVariableKey(['odd', { old: 1 }], 'old', 'new'), [
  'odd',
  { new: 1 },
]);

/* -------------------------------------------------------------------- template */

const template = {
  type: 'custom:decluttering-template-plus',
  template: 'tile',
  description: 'Shows [[old]]',
  variables: [{ name: 'old', label: 'Old' }, { name: 'other' }],
  default: [{ old: 'light.a' }, { other: '[[old|friendly_name]]' }],
  let: { slug: '[[old|slug]]', old_copy: 'x' },
  card: {
    type: 'vertical-stack',
    cards: [
      { type: 'tile', entity: '[[old]]', name: '[[other|or:old]]', '[[old]]_key': 1 },
      { type: 'custom:decluttering-card-plus', template: 'inner', variables: [{ old: '[[old]]' }] },
    ],
  },
};

check('in a template, every place the name is written', renameVariableInTemplate(template, 'old', 'new'), {
  type: 'custom:decluttering-template-plus',
  template: 'tile',
  description: 'Shows [[new]]',
  variables: [{ name: 'new', label: 'Old' }, { name: 'other' }],
  default: [{ new: 'light.a' }, { other: '[[new|friendly_name]]' }],
  let: { slug: '[[new|slug]]', old_copy: 'x' },
  card: {
    type: 'vertical-stack',
    cards: [
      { type: 'tile', entity: '[[new]]', name: '[[other|or:new]]', '[[new]]_key': 1 },
      // The nested card's own key belongs to the template it uses; its value is ours.
      { type: 'custom:decluttering-card-plus', template: 'inner', variables: [{ old: '[[new]]' }] },
    ],
  },
});

check('a let: name is renamed too', renameVariableInTemplate({ let: [{ old: '[[a]]' }] }, 'old', 'new'), {
  let: [{ new: '[[a]]' }],
});

check('the original is not touched', template.variables[0].name, 'old');

/* -------------------------------------------------------------------- card */

check(
  'in a card, its variables, its repeat items, its overrides and its name',
  renameVariableInCard(
    {
      type: 'custom:decluttering-card-plus',
      template: 'tile',
      name: '[[old]] card',
      variables: [{ old: 'light.a' }, { keep: '[[old]]' }],
      for_each: [{ old: 'light.b' }, [{ old: 'light.c' }]],
      for_each_from: { entities: 'light.*', overrides: { 'light.d': { old: 'x' } } },
      card: { name: '[[old]]' },
    },
    'old',
    'new',
  ),
  {
    type: 'custom:decluttering-card-plus',
    template: 'tile',
    name: '[[new]] card',
    // A card's values are its own words, not the template's placeholders.
    variables: [{ new: 'light.a' }, { keep: '[[old]]' }],
    for_each: [{ new: 'light.b' }, [{ new: 'light.c' }]],
    for_each_from: { entities: 'light.*', overrides: { 'light.d': { new: 'x' } } },
    card: { name: '[[old]]' },
  },
);

check('a for_each written as one mapping', renameVariableInCard({ for_each: { old: 1 } }, 'old', 'new'), {
  for_each: { new: 1 },
});

check('a card with nothing to rename comes back the same', renameVariableInCard({ template: 't' }, 'old', 'new'), {
  template: 't',
});

/* -------------------------------------------------------------------- dashboard */

const dashboard = {
  decluttering_templates: {
    base: { card: { type: 'tile', entity: '[[old]]' } },
    child: { extends: 'base', default: [{ old: 'light.child' }] },
    grandchild: { extends: ['other', 'child'] },
    other: { card: { name: '[[old]]' } },
    nests: {
      card: { type: 'custom:decluttering-card-plus', template: 'base', variables: [{ old: '[[thing]]' }] },
    },
  },
  views: [
    {
      cards: [
        { type: 'custom:decluttering-card-plus', template: 'base', variables: [{ old: 'light.a' }] },
        { type: 'custom:decluttering-card', template: 'grandchild', variables: { old: 'light.b' } },
        { type: 'custom:decluttering-card-plus', template: 'other', variables: [{ old: 'light.c' }] },
        { type: 'custom:decluttering-card-plus', template: 'base' },
        {
          type: 'custom:decluttering-template-plus',
          template: 'card_child',
          extends: 'child',
          card: { name: '[[old]]' },
        },
        {
          type: 'vertical-stack',
          cards: [{ type: 'custom:decluttering-card-plus', template: 'card_child', variables: [{ old: 'x' }] }],
        },
      ],
    },
  ],
};

check('the template and everything built on it, however far down', [...affectedTemplates(dashboard, 'base')].sort(), [
  'base',
  'card_child',
  'child',
  'grandchild',
]);

{
  const { config, cards, templates } = renameVariableInDashboard(dashboard, 'base', 'old', 'new');
  check('it says how many cards and templates it rewrote', [cards, templates], [4, 3]);
  check('the template itself', config.decluttering_templates.base, { card: { type: 'tile', entity: '[[new]]' } });
  check('a child built on it', config.decluttering_templates.child, {
    extends: 'base',
    default: [{ new: 'light.child' }],
  });
  check('a template with nothing of its own to rename is left alone', config.decluttering_templates.grandchild, {
    extends: ['other', 'child'],
  });
  check('an unrelated template using the same name is not touched', config.decluttering_templates.other, {
    card: { name: '[[old]]' },
  });
  check('a template nesting it passes the new name', config.decluttering_templates.nests.card.variables, [
    { new: '[[thing]]' },
  ]);
  check(
    'cards using it, or anything built on it, pass the new name',
    config.views[0].cards.map((card) => card.variables),
    [[{ new: 'light.a' }], { new: 'light.b' }, [{ old: 'light.c' }], undefined, undefined, undefined],
  );
  check('a template card built on it is renamed in place', config.views[0].cards[4].card, { name: '[[new]]' });
  check('a card in a stack using that one too', config.views[0].cards[5].cards[0].variables, [{ new: 'x' }]);
  check('the dashboard handed in is not touched', dashboard.decluttering_templates.base.card.entity, '[[old]]');
}

check('a dashboard with nothing on it comes back as it was', renameVariableInDashboard({}, 'base', 'old', 'new'), {
  config: {},
  cards: 0,
  templates: 0,
});

/* -------------------------------------------------------------------- other dashboards */

check(
  'a dashboard borrowing from the lender by name, or with a star, means its template',
  [
    borrowsTemplate({ decluttering_templates_from: 'home' }, 'base', 'home'),
    borrowsTemplate({ decluttering_templates_from: ['*'] }, 'base', 'home'),
  ],
  [true, true],
);
check('every dashboard borrows from the library', borrowsTemplate({}, 'base', 'decluttering-templates'), true);
check(
  'a dashboard borrowing from somewhere else does not',
  borrowsTemplate({ decluttering_templates_from: 'x' }, 'base', 'home'),
  false,
);
check(
  'a dashboard with its own template of that name uses its own',
  borrowsTemplate({ decluttering_templates_from: 'home', decluttering_templates: { base: {} } }, 'base', 'home'),
  false,
);

/* -------------------------------------------------------------------- names in use */

check(
  'the names a template has a use for, sorted, without dotted reaches',
  variableNames({ variables: [{ name: 'b' }], default: { a: 1 }, card: { x: '[[c.d]] [[e|or:f]]' } }),
  ['a', 'b', 'c', 'e', 'f'],
);
check('no template has none', variableNames(undefined), []);

check('a name the template already uses is taken', nameTakenIn(dashboard, 'base', 'old'), true);
check(
  'a name a template built on it uses is taken too',
  nameTakenIn(
    {
      ...dashboard,
      decluttering_templates: {
        ...dashboard.decluttering_templates,
        child: { extends: 'base', card: { a: '[[taken]]' } },
      },
    },
    'base',
    'taken',
  ),
  true,
);
check('a free name is free', nameTakenIn(dashboard, 'base', 'fresh'), false);
check(
  'the editor’s own copy of the template is what is checked',
  nameTakenIn(dashboard, 'base', 'typed', { card: { a: '[[typed]]' } }),
  true,
);

check(
  'defaults: is renamed like default:',
  renameVariableInTemplate({ template: 't', defaults: { old: 1 }, card: { name: '[[old]]' } }, 'old', 'new'),
  { template: 't', defaults: { new: 1 }, card: { name: '[[new]]' } },
);

/* --------------------------------------------- a borrower using the children */

{
  // The lender: a template, a child of it, and a grandchild.
  const lender = {
    decluttering_templates: {
      base: { card: { type: 'tile', entity: '[[light]]' } },
      child: { extends: 'base', default: [{ light: 'light.bedroom' }] },
      grandchild: { extends: 'child' },
      unrelated: { card: { type: 'markdown', content: '[[light]]' } },
    },
  };
  const lent = affectedTemplates(lender, 'base');
  check('the lender answers the template and everything built on it', [...lent].sort(), [
    'base',
    'child',
    'grandchild',
  ]);

  // A borrower whose cards use the lender's children, plus a child of its own and one it
  // overrides with a template of its own under the same name.
  const borrower = {
    decluttering_templates_from: 'home',
    decluttering_templates: {
      mine: { extends: 'child' },
      grandchild: { card: { type: 'markdown', content: '[[light]]' } },
    },
    views: [
      {
        cards: [
          { type: 'custom:decluttering-card-plus', template: 'base', variables: [{ light: 'light.a' }] },
          { type: 'custom:decluttering-card-plus', template: 'child', variables: [{ light: 'light.b' }] },
          { type: 'custom:decluttering-card-plus', template: 'mine', variables: [{ light: 'light.c' }] },
          { type: 'custom:decluttering-card-plus', template: 'grandchild', variables: [{ light: 'light.d' }] },
          { type: 'custom:decluttering-card-plus', template: 'unrelated', variables: [{ light: 'light.e' }] },
        ],
      },
    ],
  };
  const passes = (config) => config.views[0].cards.map((card) => Object.keys(card.variables[0])[0]);

  check(
    'without the lender, only the cards naming the template itself were reached',
    passes(renameVariableInDashboard(borrower, 'base', 'light', 'lamp').config),
    ['lamp', 'light', 'light', 'light', 'light'],
  );
  const done = renameVariableInDashboard(borrower, 'base', 'light', 'lamp', lent);
  check(
    "with it, a card using the lender's child is reached, and so is the borrower's own child of it",
    passes(done.config),
    ['lamp', 'lamp', 'lamp', 'light', 'light'],
  );
  check(
    'a name the borrower defines for itself is its own, and left alone',
    done.config.decluttering_templates.grandchild,
    borrower.decluttering_templates.grandchild,
  );
  check('the count says so', [done.cards, done.templates], [3, 0]);
}

check(
  'a mapping declaration is renamed by its key',
  renameVariableInTemplate({ variables: { old: 'x', other: 1 }, card: { a: '[[old]]' } }, 'old', 'new'),
  { variables: { new: 'x', other: 1 }, card: { a: '[[new]]' } },
);

report();
