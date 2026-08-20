/*
 * The host styles are all :host(.one-class), so they share a specificity and the last one
 * to match wins. That makes their order load-bearing: the rule hiding a card whose
 * visibility conditions are not met has to come after the rules that give the host a
 * display, or the card stays laid out and holds its place in the row.
 *
 * This reads the source rather than the class, because the card module pulls in lit and
 * the browser-only pieces that the rest of the suite deliberately avoids. Run with
 * `npm test`.
 */
const fs = require('fs');
const path = require('path');

const { check, report } = require('./harness');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'decluttering-card-plus.ts'), 'utf8');

const styles = source.slice(source.indexOf('static get styles()'), source.indexOf('protected firstUpdated()'));

/** Where a `:host(.name)` rule starts, or -1 when it is not there at all. */
const ruleAt = (name) => styles.indexOf(`:host(.${name})`);

const hidden = ruleAt('child-card-hidden');
const container = ruleAt('decluttering-container');
const badge = ruleAt('decluttering-badge');
const card = ruleAt('decluttering-card');

check(
  'every host rule is present',
  [hidden, container, badge, card].every((i) => i >= 0),
  true,
);

check('the hidden rule comes after the container rule', hidden > container, true);
check('the hidden rule comes after the badge rule', hidden > badge, true);
check('the hidden rule comes after the card rule', hidden > card, true);

// A rule added after this one would take the display back, which is the mistake this
// whole file exists to catch, so nothing may follow it.
check('nothing follows the hidden rule', styles.indexOf(':host(', hidden + 1), -1);

report();
