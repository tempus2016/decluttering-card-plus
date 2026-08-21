# Contributing

Thanks for looking. This is a small project with a clear shape, and this page is the short
version of what makes a change easy to accept.

## Getting it running

```bash
npm install
npm test          # the unit suite
npm run build     # lint, then bundle to dist/
npm start         # rebuild on change, served for a local Home Assistant
```

`npm run build` runs the linter first and stops if it fails, so a green build means lint and
bundle both passed. `dist/decluttering-card-plus.js` is committed on purpose — HACS installs
it straight from the repository — so a change to `src/` needs the bundle rebuilt in the same
commit.

## Commit messages matter

Releases are cut by [semantic-release][sr] from the commit history, so the first line
decides the next version number:

| Prefix | Means | Version |
| --- | --- | --- |
| `fix:` | something was wrong and now is not | patch |
| `feat:` | something the card could not do before | minor |
| `docs:`, `chore:`, `refactor:`, `test:`, `ci:` | no release on their own | none |

A `BREAKING CHANGE:` paragraph in the body means a major. Write the body for somebody
reading it in a year with no memory of the conversation: what was wrong, what it does now,
and why it was done that way rather than the obvious other way.

## Tests

The suite is plain Node — no framework, no runner, no watch mode. `test/harness.js` gives
you `check(name, actual, expected)` and `report()`, and every suite is a list of `check`
calls read top to bottom.

Anything that can be a pure function should be, and pure functions get tests. The card's
own behaviour in a browser is verified by hand against a real Home Assistant before release;
the unit suite covers everything underneath it.

`npm run coverage` runs the same suites through [c8][c8] and fails if they reach less of
the source than they do today — 99% of statements, 86% of branches at the time of writing.
The thresholds are in `package.json`, set a little below the current numbers so they catch
a real slide rather than a rounding difference. CI runs it on every pull request.

Write the test first when you can. On this project it has repeatedly caught the thing that
was actually wrong rather than the thing that looked wrong.

## Translations

The easiest contribution there is: copy `src/locales/en.json` to `src/locales/<code>.json`,
translate the values, and register the file in `src/localize.ts` (one import, one entry in
`LANGUAGES`). Keep every `{placeholder}` and `[[name]]` as written — the card fills those
in. `npm test` lists any keys you have missed and verifies the placeholders survived; at
runtime a missing key falls back to English, so don't agonise over the hard ones — flag
them in the PR and they can be worked out there. No git? Open an issue with the language
and your translated file pasted in, and it will be wired in for you. Fixes to an existing
translation are just as welcome, file or issue alike.

New user-facing text in the card goes through `localize()` with a key in `en.json` rather
than as a string literal, or it can never be translated.

## What tends to get pushed back

- **A change that rebuilds the card on every state change.** Substitution builds the card's
  config once. Anything that reads live state — a `|state` resolver, filtering a repeat by
  what is currently on — would rebuild the whole card several times a second. It is a
  deliberate limit, not an oversight; [auto-entities][ae] is the right tool for that.
- **Something that stops a card saving.** A template can be edited after the cards that use
  it, so a card that looks wrong now may be right in a moment. Warn, never block. `strict:
  true` is how somebody opts into the opposite.
- **Silently changing what a dashboard renders.** If the card cannot do what was asked, it
  leaves the placeholder visible and says why in the console. Guessing is worse than
  stopping.

## Reporting something

An [issue][issues] with the YAML of the template, the YAML of the card using it, and what
you expected instead is almost always enough. If the browser console said anything, it is
usually the answer.

[c8]: https://github.com/bcoe/c8
[sr]: https://semantic-release.gitbook.io/
[ae]: https://github.com/thomasloven/lovelace-auto-entities
[issues]: https://github.com/tempus2016/decluttering-card-plus/issues
