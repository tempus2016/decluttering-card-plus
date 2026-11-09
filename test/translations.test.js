/*
 * Translations for shared templates (#392): a template's `language:` block, and `[[$key]]`
 * looking a text up in it in Home Assistant's language. Run with `npm test`.
 */
const { check } = require('./check');
const {
  hassLanguage,
  languageOrder,
  translationEntries,
  translationKeys,
  mergeLanguages,
  translateText,
  translatedForDisplay,
  translatedTemplates,
} = require('../.test-build/translations.js');
const deepReplace = require('../.test-build/deep-replace.js').default;
const { collectTemplates } = require('../.test-build/templates.js');
const { lintTemplate, definedNames } = require('../.test-build/lint.js');
const { diagnoseInstance, usesTranslate, usedVariables } = require('../.test-build/variables.js');
const { completionsAt } = require('../.test-build/code-hooks.js');
const { buildExport } = require('../.test-build/share.js');
const { lintDashboard } = require('../.test-build/cli-lint.js');

const warnings = [];
const quietWarn = console.warn;
console.warn = (message) => warnings.push(String(message));

const hassIn = (language) => ({ locale: { language }, language, states: {} });

const fubar = {
  variables: [{ name: 'fu_bar', label: '[[$vars.fb.name]]', description: '[[$vars.fb.desc]]' }],
  language: {
    en: { vars: { fb: { name: 'Fubar', desc: 'Forked up beyond all recognition' } } },
    gd: { vars: { fb: { name: 'Knackered', desc: 'Briste' } } },
  },
  card: { type: 'tile', name: '[[$vars.fb.name]]', entity: '[[fu_bar]]' },
};

/* ------------------------------------------------------------------ the language */

check('the language comes from hass.locale first', hassLanguage({ locale: { language: 'gd' }, language: 'de' }), 'gd');
check('then from hass.language', hassLanguage({ language: 'de' }), 'de');
check('and English with no Home Assistant at all', hassLanguage(undefined), 'en');

check('the order: the language, its base, English, the first', languageOrder(['fr', 'en', 'pt'], 'pt-BR'), [
  'pt',
  'en',
  'fr',
]);
check('an exact region is first', languageOrder(['pt', 'pt-BR', 'en'], 'pt-BR'), ['pt-BR', 'pt', 'en']);
check('codes match without minding case or an underscore', languageOrder(['pt_br', 'en'], 'pt-BR'), ['pt_br', 'en']);
check('with no English the first one given is the fallback', languageOrder(['gd', 'de'], 'nl'), ['gd']);

/* ------------------------------------------------------------------ lookups */

check('the texts come out as $ names, in the language asked for', translationEntries(fubar, 'gd'), [
  { '$vars.fb.name': 'Knackered' },
  { '$vars.fb.desc': 'Briste' },
]);
check('a language the template lacks falls back to English', translationEntries(fubar, 'de')[0], {
  '$vars.fb.name': 'Fubar',
});
check(
  'the fallback is key by key: a half-done language shows the rest in English',
  translationEntries({ language: { en: { a: 'A', b: 'B' }, de: { a: 'Ä' } } }, 'de'),
  [{ $a: 'Ä' }, { $b: 'B' }],
);
check(
  'pt-BR reads pt when there is no pt-BR',
  translationEntries({ language: { en: { a: 'yes' }, pt: { a: 'sim' } } }, 'pt-BR'),
  [{ $a: 'sim' }],
);
check(
  'with no English, the first language given',
  translationEntries({ language: { gd: { a: 'tha' }, fr: { a: 'oui' } } }, 'de'),
  [{ $a: 'tha' }],
);
check('a template with no language: block has no texts', translationEntries({ card: {} }, 'en'), []);
check(
  'a language that is not a mapping is skipped',
  translationEntries({ language: { en: 'x', de: { a: 'b' } } }, 'en'),
  [{ $a: 'b' }],
);
check('every key once', translationKeys(fubar), ['vars.fb.name', 'vars.fb.desc']);

check(
  'the card shows the text in the viewer language',
  deepReplace([{ fu_bar: 'light.lamp' }], fubar, fubar.card, 'fubar', hassIn('gd'), true),
  { type: 'tile', name: 'Knackered', entity: 'light.lamp' },
);
check(
  'and in English for a language the template does not have',
  deepReplace([{ fu_bar: 'light.lamp' }], fubar, fubar.card, 'fubar', hassIn('ja'), true).name,
  'Fubar',
);
check(
  'with no hass at all, English',
  deepReplace([{ fu_bar: 'light.lamp' }], fubar, fubar.card, 'fubar', undefined, true).name,
  'Fubar',
);
check(
  'steps follow a lookup',
  deepReplace([], fubar, { name: '[[$vars.fb.name|upper]]' }, 'fubar', hassIn('gd'), true),
  { name: 'KNACKERED' },
);
check(
  'a text with placeholders in it fills them',
  deepReplace(
    [{ room: 'Kitchen' }],
    { language: { en: { hello: 'Lights in [[room]]' }, de: { hello: 'Licht in [[room]]' } } },
    { name: '[[$hello]]' },
    't',
    hassIn('de'),
    true,
  ),
  { name: 'Licht in Kitchen' },
);
check(
  'a lookup inside a step argument fills too',
  deepReplace(
    [],
    { language: { en: { none: 'Nothing' } } },
    { name: '[[gone|default:[[$none]]]]' },
    't',
    hassIn('en'),
    true,
  ),
  { name: 'Nothing' },
);
check(
  'an optional lookup with no text drops out',
  deepReplace([], { language: { en: { a: 'A' } } }, { name: 'x[[$b?]]' }, 't', hassIn('en'), true),
  { name: 'x' },
);

warnings.length = 0;
const missing = deepReplace([], fubar, { name: '[[$vars.fb.nmae]]' }, 'fubar', hassIn('en'), new Set());
check('a missing key is left as written', missing, { name: '[[$vars.fb.nmae]]' });
check('and the console names the key', warnings.length === 1 && warnings[0].includes('vars.fb.nmae'), true);
check(
  'as a missing text, not as a variable nobody set',
  /language:/.test(warnings[0]) && !/nothing gives a value/.test(warnings[0]),
  true,
);

check(
  'an item template carries its own texts, winning over the same key from the card',
  deepReplace(
    [],
    { language: { en: { a: 'card a', b: 'card b' } } },
    { rows: '[[row|with:x=1]]', a: '[[$a]]' },
    't',
    hassIn('en'),
    true,
    undefined,
    0,
    undefined,
    undefined,
    false,
    { itemTemplates: { row: { language: { en: { a: 'row a' } }, item: { a: '[[$a]]', b: '[[$b]]' } } } },
  ),
  { rows: { a: 'row a', b: 'card b' }, a: 'card a' },
);

/* ------------------------------------------------------------------ extends */

const dashboard = {
  decluttering_templates: {
    base: {
      language: { en: { title: 'Base', sub: 'Below' }, de: { title: 'Basis' } },
      card: { type: 'tile', name: '[[$title]]', state_content: '[[$sub]]' },
    },
    child: {
      extends: 'base',
      language: { en: { title: 'Child' }, gd: { title: 'Leanabh' } },
    },
  },
  views: [],
};
const resolved = collectTemplates(dashboard).child;
check('extends merges language: key by key, the child winning', resolved.language, {
  en: { title: 'Child', sub: 'Below' },
  de: { title: 'Basis' },
  gd: { title: 'Leanabh' },
});
check('and the child builds with both', deepReplace([], resolved, resolved.card, 'child', hassIn('de'), true), {
  type: 'tile',
  name: 'Basis',
  state_content: 'Below',
});
check('a merge with nothing on one side keeps the other', mergeLanguages(undefined, { en: { a: 1 } }), {
  en: { a: 1 },
});

/* ------------------------------------------------------------------ the editors */

check('a label is shown in the viewer language', translateText('[[$vars.fb.name]]', fubar, hassIn('gd')), 'Knackered');
check('with its steps', translateText('[[$vars.fb.name|lower]]!', fubar, hassIn('en')), 'fubar!');
check('a key with no text is left as written', translateText('[[$nope]]', fubar, hassIn('en')), '[[$nope]]');
check('text with no lookup is untouched', translateText('Plain [[x]]', fubar, hassIn('en')), 'Plain [[x]]');

const shown = translatedForDisplay(
  {
    ...fubar,
    description: '[[$about]]',
    language: { ...fubar.language, en: { ...fubar.language.en, about: 'About it', pick: 'Pick one', ex: 'Night' } },
    variables: [
      ...fubar.variables,
      { name: 'mode', selector: { select: { options: [{ value: 'a', label: '[[$pick]]' }] } } },
    ],
    examples: [{ name: '[[$ex]]', values: { fu_bar: 'light.x' } }],
  },
  hassIn('en'),
);
check(
  'the editor shows declarations in the viewer language',
  [shown.variables[0].label, shown.variables[0].description],
  ['Fubar', 'Forked up beyond all recognition'],
);
check('and select option labels', shown.variables[1].selector.select.options[0].label, 'Pick one');
check('and the description', shown.description, 'About it');
check('and example names', shown.examples[0].name, 'Night');
check('but not the card it builds', shown.card.name, '[[$vars.fb.name]]');
check(
  'the mapping form of declarations is shown translated too',
  translatedForDisplay({ ...fubar, variables: { fu_bar: { label: '[[$vars.fb.name]]' }, plain: 3 } }, hassIn('gd'))
    .variables,
  { fu_bar: { label: 'Knackered' }, plain: 3 },
);
const set = { a: fubar, b: { card: {} } };
const untranslated = { b: set.b };
check(
  'a set of templates with no texts comes back as it was',
  translatedTemplates(untranslated) === untranslated,
  true,
);
check(
  'a set is translated template by template',
  translatedTemplates(set, hassIn('gd')).a.variables[0].label,
  'Knackered',
);

/* ------------------------------------------------------------------ rebuilds, lint, checks */

check('a lookup makes the card build again on a change of language', usesTranslate(fubar), true);
check('a template without one does not', usesTranslate({ card: { name: '[[x]]' } }), false);

check('a lookup is not a variable the template uses', usedVariables(fubar), ['fu_bar']);
check('nor one a card is told it has not set', diagnoseInstance([{ fu_bar: 'light.x' }], fubar).missing, []);
check(
  'a variable a text uses is used, and missing when unset',
  diagnoseInstance([], { language: { en: { hi: 'Hi [[who]]' } }, card: { name: '[[$hi]]' } }).missing,
  ['who'],
);

const lint = (template, known) =>
  lintTemplate(template, known).map((f) => `${f.level} ${f.key} ${JSON.stringify(f.params)} @${f.path}`);
check('a well-translated template lints clean', lint(fubar), []);
check(
  'a key no language has is a warning, with the closest one',
  lint({ ...fubar, card: { name: '[[$vars.fb.nmae]]' } }),
  [
    'warning lint.translation_unknown {"key":"vars.fb.nmae","placeholder":"[[$vars.fb.nmae]]","closest":"vars.fb.name"} @card.name',
  ],
);
check(
  'so is one in a label',
  lint({ ...fubar, variables: [{ name: 'fu_bar', label: '[[$nope]]' }] }).some((line) =>
    line.startsWith('warning lint.translation_unknown {"key":"nope"'),
  ),
  true,
);
check(
  'a key one language leaves out is a warning on that language',
  lint({ language: { en: { a: 'A', b: 'B' }, de: { a: 'Ä' } }, card: { name: '[[$a]] [[$b]]' } }),
  ['warning lint.translation_missing_in {"language":"de","keys":"b"} @language.de'],
);
check('a language: that is not a mapping is a warning', lint({ language: 'en', card: {} }), [
  'warning lint.language_not_mapping {} @language',
]);
check('nor is a language inside it', lint({ language: { en: ['x'] }, card: {} }), [
  'warning lint.language_entry_not_mapping {"language":"en"} @language.en',
]);
check('a key the parent gives is known through definedNames', lint({ card: { name: '[[$t]]' } }, ['$t']), []);
check('definedNames lists the texts as $ names', definedNames(fubar).includes('$vars.fb.name'), true);
check('a lookup is never an undeclared variable', lint({ language: { en: { a: 'A' } }, card: { name: '[[$a]]' } }), []);

check(
  'the CLI linter reads lookups through extends',
  lintDashboard(dashboard, 'ui-lovelace.yaml')
    .filter((finding) => /translation|language/.test(finding.message))
    .map((finding) => finding.path),
  ['base.language.de', 'child.language.de', 'child.language.gd'],
);

check(
  'a check message is in the viewer language',
  deepReplace([], fubar, '[[$vars.fb.desc]]', 'fubar', hassIn('gd'), true),
  'Briste',
);

/* ------------------------------------------------------------------ autocomplete and export */

const ctx = {
  variables: [{ name: 'fu_bar' }],
  lets: [],
  shared: [],
  translations: [
    { key: 'vars.fb.name', text: 'Fubar' },
    { key: 'vars.fb.desc', text: 'Forked' },
    { key: 'other', text: 'Other' },
  ],
};
check('after [[$ the completions are the texts', completionsAt('name: [[$vars.fb.n', 18, ctx), {
  from: 8,
  heading: 'texts',
  options: [{ label: '$vars.fb.name', detail: 'Fubar' }],
});
check(
  'and after [[ they are the variables, not the texts',
  completionsAt('[[', 2, ctx).options.map((o) => o.label),
  ['fu_bar'],
);

const exported = buildExport({ type: 'custom:decluttering-template-plus', template: 'fubar', ...fubar }).payload;
check('an export keeps the language: block', exported.language, fubar.language);
check('after what reads it', Object.keys(exported).slice(-1), ['language']);

console.warn = quietWarn;
