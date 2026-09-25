/*
 * Home Assistant stopped registering mwc-button, and an unregistered custom element is
 * just an inline box: every button drawn with it came out as bare text, with no chrome
 * and no visible disabled state (fixed in v1.6.1). Nothing fails when it happens - the
 * page renders, the click even works - so this reads the source and refuses any mwc-*
 * element, in markup or in a CSS selector. Use ha-button, ha-list-item and friends.
 *
 * Reads the source rather than a build, like styles-order.test.js, and checks that it can
 * actually see elements before trusting a clean result - a scan that finds nothing
 * because it looked in the wrong place would otherwise pass.
 */
const fs = require('fs');
const path = require('path');

const { check, report } = require('./harness');

const SRC = path.join(__dirname, '..', 'src');
const files = fs.readdirSync(SRC).filter((name) => name.endsWith('.ts'));

/** Every `mwc-` element named in a file: opening/closing tags and CSS selectors. */
const mwcUses = (text) => {
  const hits = [];
  text.split('\n').forEach((line, index) => {
    if (/<\/?mwc-[a-z-]+|(^|[\s,>+~])mwc-[a-z-]+\s*[{,:[.]/.test(line)) hits.push(index + 1);
  });
  return hits;
};

check('the scan finds the source files', files.length > 0 && files.includes('decluttering-card-plus.ts'), true);

check(
  'the scan would notice an mwc-button, as a tag and as a selector',
  [mwcUses('<mwc-button @click=${x}>go</mwc-button>').length, mwcUses('  .share mwc-button {').length],
  [1, 1],
);

const card = fs.readFileSync(path.join(SRC, 'decluttering-card-plus.ts'), 'utf8');
check(
  'the editors do draw buttons, so a clean result means something',
  (card.match(/<ha-button/g) || []).length > 0,
  true,
);

const offenders = files
  .map((name) => ({ name, lines: mwcUses(fs.readFileSync(path.join(SRC, name), 'utf8')) }))
  .filter((file) => file.lines.length)
  .map((file) => `${file.name}:${file.lines.join(',')}`);

check('no mwc-* element anywhere in src', offenders, []);

report();
