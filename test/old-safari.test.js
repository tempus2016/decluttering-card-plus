/*
 * Safari before 16.4 (iOS/iPadOS 15) cannot parse a regex lookbehind. One in a regex literal
 * is a SyntaxError for the whole file, so the card never defines its element and Home
 * Assistant reports "Custom element doesn't exist" (forum thread 1021962, post 28). One
 * built with `new RegExp` throws when that line runs. Neither may come back, in the source
 * or in the bundle that ships.
 */
const fs = require('node:fs');
const path = require('node:path');
const { check } = require('./check');
const { redact } = require('../.test-build/report.js');
const { markHaText, HA_MARK } = require('../.test-build/variables.js');

const LOOKBEHIND = /\(\?<[=!]/;
const root = path.join(__dirname, '..');
const files = (dir, ext) =>
  fs
    .readdirSync(path.join(root, dir))
    .filter((name) => name.endsWith(ext))
    .map((name) => path.join(dir, name));

for (const file of [...files('src', '.ts'), ...files('dist', '.js')]) {
  check(`no lookbehind in ${file}`, LOOKBEHIND.test(fs.readFileSync(path.join(root, file), 'utf8')), false);
}

// The checks that replaced the lookbehinds look again one place on, as a lookbehind did.
check('mac after a letter is left', redact('xaa:bb:cc:dd:ee:ff'), 'xaa:bb:cc:dd:ee:ff');
check('mac on its own is taken', redact('mac aa:bb:cc:dd:ee:ff'), 'mac <redacted-mac>');
check('version after Chrome/ is left', redact('Chrome/120.0.1.2'), 'Chrome/120.0.1.2');
check('address after a space is taken', redact('at 192.168.0.1'), 'at <redacted-ip>');
check('address after a dot is left', redact('.10.0.0.1'), '.10.0.0.1');
check('media-source host is kept', redact('media-source://media_source/x'), 'media-source://media_source/x');
check(
  'dotted scheme ending in media-source is kept',
  redact('nas.localmedia-source://media_source'),
  'nas.localmedia-source://media_source',
);
check('other schemes lose the host', redact('see http://nas:8123/x'), 'see http://<redacted-host>:8123/x');
check('credentials go', redact('https://user:pw@nas'), 'https://<redacted-credentials>@<redacted-host>');
check('bare // after : is not a host', redact('a://b'), 'a://<redacted-host>');
check('password inside a word is left', redact('xpassword=1'), 'xpassword=1');
check('password after a space is taken', redact('x password=1'), 'x password=<redacted>');
check('home domain after a dot is left', redact('.nas.local'), '.nas.local');
check('home domain on its own is taken', redact('host nas.local'), 'host <redacted-host>');

const M = HA_MARK;
check('brackets marked both sides, one mark between two', markHaText('[[x]]'), `${M}[${M}[${M}x${M}]${M}]${M}`);
check('marked text is not marked again', markHaText(markHaText('{a}[b]')), markHaText('{a}[b]'));
