/*
 * `debug: report` gathers every warning into one list at the top (#391), rather than inside
 * each build's folded section. Run with `npm test`, which transpiles the source first.
 */
const { formatReport } = require('../.test-build/report.js');

const { check } = require('./check');

const trace = (warnings, items) => ({ placeholders: new Map(), dropped: [], warnings, items });
const build = (label, sections, chain = []) => ({ label, chain, ms: 1, sections });
const section = (warnings, label, items) => ({ label, variables: [], trace: trace(warnings, items), built: {} });

{
  const text = formatReport({
    context: { version: '1' },
    reports: [build('"room"', [section(['room is missing [[light]]'])])],
    full: { type: 'tile' },
  });
  check(
    'the warnings have a heading of their own',
    text.includes('## Warnings\n\n- room is missing \\[\\[light\\]\\]\n'),
    true,
  );
  check('ahead of the card in full', text.indexOf('## Warnings') < text.indexOf('in full'), true);
  check('and ahead of every build', text.indexOf('## Warnings') < text.indexOf('<details>'), true);
  check('they are not said again inside the build', text.split('room is missing').length - 1, 1);
}

{
  const text = formatReport({
    context: { version: '1' },
    reports: [
      build('"room"', [section(['first'])]),
      build('"light_tile"', [section(['second', 'second']), section([], 'copy 2')], ['room']),
      build('"repeat"', [section(['third'], 'copy 1', [{ name: 'row', trace: trace(['in a fill']) }])]),
    ],
    error: 'it broke',
  });
  check(
    'from more than one build, each says which build it came from',
    text.includes(
      '- "room": first\n- "light\\_tile": second\n- "repeat" › copy 1: third\n- "repeat" › copy 1: in a fill\n',
    ),
    true,
  );
  check('the error still comes first', text.indexOf('## Error') < text.indexOf('## Warnings'), true);
}

{
  const text = formatReport({ context: { version: '1' }, reports: [build('"x"', [section(['token=abc123secret'])])] });
  check('a warning is redacted like everything else', text.includes('abc123secret'), false);
}

check(
  'no warnings, no heading',
  formatReport({ context: { version: '1' }, reports: [build('"x"', [section([])])] }).includes('## Warnings'),
  false,
);
