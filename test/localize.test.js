/*
 * Unit tests for src/localize.ts and the locale files themselves - a translation that
 * drops a placeholder or invents a key breaks quietly at render time, so both are
 * checked here instead. Run with `npm test`.
 */
const fs = require('fs');
const path = require('path');

const { localize } = require('../.test-build/localize.js');
const { LIBRARY } = require('../.test-build/library.js');

const { check, report } = require('./harness');

const localesDir = path.join(__dirname, '..', 'src', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));
const locales = fs
  .readdirSync(localesDir)
  .filter((file) => file.endsWith('.json') && file !== 'en.json')
  .map((file) => ({
    code: path.basename(file, '.json'),
    strings: JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8')),
  }));

/** The {placeholders} a sentence expects, sorted so the order they appear in is free. */
function placeholders(sentence) {
  return (sentence.match(/\{[a-z0-9_]+\}/g) ?? []).sort();
}

// --- the locale files themselves ---

// A key only a translation has is a typo in the translation: nothing ever looks it up.
for (const { code, strings } of locales) {
  check(
    `${code}.json has no keys that en.json lacks`,
    Object.keys(strings).filter((key) => !(key in en)),
    [],
  );
  // A translation is allowed to be partial - missing keys fall back to English - but a
  // translated sentence must keep the placeholders the code fills in.
  check(
    `${code}.json keeps every placeholder`,
    Object.keys(strings).filter(
      (key) => key in en && JSON.stringify(placeholders(strings[key])) !== JSON.stringify(placeholders(en[key])),
    ),
    [],
  );
  // The runtime forgives a missing key, but the files shipped here are kept complete -
  // this is what says a new en.json sentence still needs its translations written.
  check(
    `${code}.json translates every en.json key`,
    Object.keys(en).filter((key) => !(key in strings)),
    [],
  );
}

// The library list renders its summaries through these keys, so each entry needs one.
check(
  'every library entry has a summary key in en.json',
  LIBRARY.map((entry) => `library.${entry.name}.summary`).filter((key) => !(key in en)),
  [],
);
check(
  'the en.json summaries match what library.ts says',
  LIBRARY.filter((entry) => en[`library.${entry.name}.summary`] !== entry.summary).map((entry) => entry.name),
  [],
);

// --- the lookup itself ---

// Outside a browser nothing says what language to use, so everything reads as English.
check('a key resolves to its English sentence', localize('share.import_header'), 'Import');
check('an unknown key comes back as itself', localize('no.such.key'), 'no.such.key');
check(
  'every {placeholder} is replaced',
  localize('error.template_resolve_failed', { template: 'a', message: 'b' }),
  'Could not resolve the template "a": b',
);
check(
  'the same placeholder is replaced everywhere it appears',
  localize('tools.duplicate_confirm', { to: 'x', name: 'y' }).includes('"x"'),
  true,
);

// hass answers for the user, which is how the other languages are reached.
check('hass chooses the language', localize('share.import_header', undefined, { language: 'pt' }), 'Importar');
check('French is wired in', localize('tools.rename_header', undefined, { language: 'fr' }), 'Renommer');
check('Spanish is wired in', localize('tools.rename_header', undefined, { language: 'es' }), 'Renombrar');
check('German is wired in', localize('tools.rename_header', undefined, { language: 'de' }), 'Umbenennen');
check('Dutch is wired in', localize('tools.rename_header', undefined, { language: 'nl' }), 'Hernoemen');
check(
  'a regional language falls back to its base',
  localize('share.import_header', undefined, { language: 'pt-BR' }),
  'Importar',
);
check(
  'a language nobody translated falls back to English',
  localize('share.import_header', undefined, { language: 'xx' }),
  'Import',
);
check(
  'hass.locale wins over hass.language',
  localize('share.import_header', undefined, { language: 'en', locale: { language: 'pt' } }),
  'Importar',
);

report();
