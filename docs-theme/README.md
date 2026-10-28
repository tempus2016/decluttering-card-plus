# docs-theme

How <https://tempus2016.github.io/decluttering-card-plus/> looks. The words all come from
the [wiki](https://github.com/tempus2016/decluttering-card-plus/wiki) — nothing in here is
content, and editing a page still means editing the wiki.

`.github/workflows/wiki-to-pages.yml` clones the wiki, runs `build.py` over it, copies this
directory on top and hands the result to Jekyll.

| | |
| --- | --- |
| `build.py` | Reshapes a wiki clone into a Jekyll source: rewrites `[Page](Page)` links to `.html`, gives each page front matter so it gets a `<title>` of its own, turns `Home.md` into `index.md` with the hero in its front matter, makes `_Sidebar.md` an include, and strips the raw HTML tags a page must not carry (`meta`, `form`, `iframe`, `object`, `embed`, `base`). |
| `_layouts/wiki.html` | The page: bar, navigation, content, "on this page". |
| `_layouts/home.html` | The same, with the hero on top. |
| `assets/css/docs.css` | All of it. Custom properties at the top, dark scheme underneath them. |
| `assets/js/docs.js` | Enhancement only — placeholder highlighting, the contents column, the marker on the current page. Every page reads fine without it. |
| `builder.html` | The template builder: paste cards, get the template they are copies of. One of the two pages that are not from the wiki. Its script, `assets/js/builder.js`, is built by rollup from `src/builder-page.ts` and committed - run `npm run build` after changing `src/builder.ts`, `src/similar.ts` or anything they import, and the release rebuilds it too. |
| `playground.html` | "Try a placeholder": variables and a placeholder in, what each step of the chain gives out. The other page not from the wiki. Its script, `assets/js/playground.js`, is built from `src/playground-page.ts` and committed the same way; the steps that ask Home Assistant read the sample house in `src/playground.ts`, which the page's table describes - change one, change the other. |
| `search_index.py` | Writes `search.json` for the search box in the bar: one entry per h2-h4 of every built page, plus one per key row (below). Runs after Jekyll, over `_site`, so the anchors are the ids Jekyll gave the headings rather than a guess at its slug rules. The box is in `_layouts/wiki.html`, the searching in `docs.js`; `search.json` is only fetched the first time someone uses it. |
| `assets/fonts/` | IBM Plex, self-hosted (OFL, `LICENSE.txt` alongside). Sans is one variable file covering 400–600. |

## Things worth knowing before you change it

**The hero is Home.md, taken apart.** `build.py` reads the wiki front page's tagline as the
headline, its first paragraph as the lede, and its first image as the proof. The last word
of the tagline gets the `[[placeholder]]` treatment, because that is the word a template
stands in for. Rewrite the tagline in the wiki and the hero follows.

**`[[placeholders]]` are lit by JavaScript, after Rouge.** Rouge highlights the YAML;
`docs.js` then walks the text nodes and wraps anything in double brackets. Doing it in
Rouge would mean a custom lexer, and doing it before Rouge would mean Rouge escaping it.

**"Start here" is a table pretending to be cards.** The router table on the front page is
laid out as a grid by CSS hung off the heading's `#start-here` id. Rename that heading in
the wiki and it goes back to being an ordinary table, which is still perfectly readable.

**Navigation is `_Sidebar.md` markdownified.** `**Group**` becomes the mono key, the list
under it becomes the indented block. Restructure the sidebar and the navigation follows.

**A table row whose first cell starts with `code` is a key row.** `build.py` puts an empty
`<span class="key" id="k-…">` at the start of it, so a search result can land on the row, and
`docs.css` marks the row when it is the target. The same rows make the A to Z page
(`A-to-Z.html`), which exists only on this site: every key, step and option, linked to every
place a page has a row for it. Document a key in a table that way and it is findable twice
over without anything else to do. A quoted first cell (`'[[e|area]]'`) is an example, not a
key, and is left alone.

**The search is forgiving on purpose.** It matches the start of a word, then the middle of
one, then the words in `SYNONYMS` in `docs.js` (someone looking for `rebuild_on` types
"refresh"), then the nearest word for a typo. When a search somebody reports finds nothing,
the fix is usually a line in `SYNONYMS`.

## Working on it

There is no way to preview this without Jekyll, so the workflow builds on pull requests
that touch this directory and checks the output before anything reaches main. Locally:

```
git clone https://github.com/tempus2016/decluttering-card-plus.wiki.git site
python3 docs-theme/build.py site
cp -r docs-theme/{_config.yml,_layouts,_includes,assets,builder.html,playground.html} site/
jekyll build --source site --destination _site
python3 docs-theme/search_index.py _site
jekyll serve --source site --destination _site --skip-initial-build --no-watch
```

Colours are checked at 4.5:1 or better against their background in both schemes. If you
add one, check it before you ship it.
