/*
 * Home Assistant stopped registering mwc-button, and an unregistered custom element is
 * just an inline box: every button drawn with it came out as bare text, with no chrome
 * and no visible disabled state (fixed in v1.6.1). Nothing fails when it happens - the
 * page renders, the click even works - so this reads the source and refuses any mwc-*
 * element, in markup or in a CSS selector. Use ha-button, ha-list-base and friends.
 *
 * Reads the source rather than a build, like styles-order.test.js, and checks that it can
 * actually see elements before trusting a clean result - a scan that finds nothing
 * because it looked in the wrong place would otherwise pass.
 */
const fs = require('fs');
const path = require('path');

const { check } = require('./check');

const SRC = path.join(__dirname, '..', 'src');
// Every TypeScript file under src, subdirectories included - the editors are split into folders.
const walk = (dir, prefix = '') =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name), prefix + entry.name + '/')
        : entry.name.endsWith('.ts')
          ? [prefix + entry.name]
          : [],
    );
const files = walk(SRC);

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

// The editors live in their own modules since the main file was split (idea 5).
const editors = ['card-editor.ts', 'template-editor.ts']
  .map((name) => fs.readFileSync(path.join(SRC, name), 'utf8'))
  .join('\n');
check(
  'the editors do draw buttons, so a clean result means something',
  (editors.match(/<ha-button/g) || []).length > 0,
  true,
);

const offenders = files
  .map((name) => ({ name, lines: mwcUses(fs.readFileSync(path.join(SRC, name), 'utf8')) }))
  .filter((file) => file.lines.length)
  .map((file) => `${file.name}:${file.lines.join(',')}`);

check('no mwc-* element anywhere in src', offenders, []);

/*
 * Home Assistant 2026.7 stopped registering ha-textfield too, and drew its inputs with
 * ha-input, so every name field in the editors vanished. The card still runs on Home
 * Assistants that only have ha-textfield, so the one helper that picks between them at
 * runtime (textField) is the only place either tag may be written.
 */
const tagCount = (tag) =>
  files.reduce((sum, name) => {
    const text = fs.readFileSync(path.join(SRC, name), 'utf8');
    return sum + (text.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
  }, 0);
check('ha-textfield is drawn in one place only, the helper', tagCount('ha-textfield'), 1);
check('ha-input is drawn in one place only, the helper', tagCount('ha-input'), 1);
const helperHome = files
  .map((name) => fs.readFileSync(path.join(SRC, name), 'utf8'))
  .find((text) => /function textField/.test(text));
check(
  'that place picks whichever of the two the page has',
  /function textField[\s\S]*?isDefinedHere\('ha-input'\)[\s\S]*?<ha-input[\s\S]*?<ha-textfield/.test(helperHome || ''),
  true,
);

/*
 * Home Assistant 2026.12 took out the last list elements built on mwc: ha-list,
 * ha-list-item, ha-check-list-item and ha-radio-list-item (ha-md-list went in 2026.11).
 * Their replacements are ha-list-base, ha-list-nav and ha-list-selectable. Any of the old
 * tags would draw as an empty inline box, so they are refused like mwc-*.
 */
const removedTags = [
  'ha-list',
  'ha-list-item',
  'ha-check-list-item',
  'ha-radio-list-item',
  'ha-md-list',
  'ha-md-list-item',
];
const removedTagUses = (text) => {
  const hits = [];
  text.split('\n').forEach((line, index) => {
    for (const tag of removedTags) {
      if (new RegExp(`<\\/?${tag}(?![a-z-])|(^|[\\s,>+~])${tag}(?![a-z-])\\s*[{,:[.]`).test(line))
        hits.push(`${index + 1} ${tag}`);
    }
  });
  return hits;
};
check(
  'the scan would notice a removed list tag, and not its replacements',
  [
    removedTagUses('<ha-list-item graphic="icon">x</ha-list-item>').length > 0,
    removedTagUses('  ha-check-list-item {').length > 0,
    removedTagUses('<ha-list-base><ha-list-item-button>x</ha-list-item-button></ha-list-base>').length,
  ],
  [true, true, 0],
);
const listOffenders = files
  .map((name) => ({ name, lines: removedTagUses(fs.readFileSync(path.join(SRC, name), 'utf8')) }))
  .filter((file) => file.lines.length)
  .map((file) => `${file.name}:${file.lines.join(',')}`);
check('no list element Home Assistant removed, anywhere in src', listOffenders, []);

/*
 * The --mdc-* custom properties only reach the mwc elements. Once ha-dialog and
 * ha-icon-button were rebuilt on Web Awesome, --mdc-dialog-min-width, --mdc-dialog-max-width
 * and --mdc-icon-button-size stopped doing anything there, so the gallery quietly opened at
 * the default dialog width. Older Home Assistants still draw the mwc versions, so the old
 * property stays, but only in a rule that also sets the one current releases read.
 * --mdc-icon-size needs no partner: ha-svg-icon and ha-icon still size themselves by it.
 * Any other --mdc-* property is refused until its partner is written down here.
 */
const mdcPartners = {
  '--mdc-icon-size': null,
  '--mdc-dialog-min-width': '--ha-dialog-width-lg',
  '--mdc-dialog-max-width': '--ha-dialog-width-lg',
  '--mdc-icon-button-size': '--ha-icon-button-size',
};
/** Each `--mdc-x:` declaration with the CSS rule it sits in, from `{` to `}`. */
const mdcDeclarations = (text) =>
  [...text.matchAll(/--mdc-[a-z-]+(?=\s*:)/g)].map((m) => {
    const open = text.lastIndexOf('{', m.index);
    const close = text.indexOf('}', m.index);
    return { prop: m[0], rule: text.slice(open, close === -1 ? undefined : close) };
  });
check(
  'the pairing check sees a lone old property and accepts a paired one',
  [
    mdcDeclarations('a { --mdc-icon-button-size: 4px; }').length,
    mdcDeclarations('a { --ha-icon-button-size: 4px; --mdc-icon-button-size: 4px; }')[0].rule.includes(
      '--ha-icon-button-size',
    ),
  ],
  [1, true],
);
const unpairedMdc = files.flatMap((name) =>
  mdcDeclarations(fs.readFileSync(path.join(SRC, name), 'utf8'))
    .filter(
      ({ prop, rule }) => !(prop in mdcPartners) || (mdcPartners[prop] !== null && !rule.includes(mdcPartners[prop])),
    )
    .map(({ prop }) => `${name} ${prop}`),
);
check('every --mdc-* property sits beside the one current Home Assistant reads', unpairedMdc, []);
