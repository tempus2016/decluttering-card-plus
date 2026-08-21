# docs-theme

How <https://tempus2016.github.io/decluttering-card-plus/> looks. The words all come from
the [wiki](https://github.com/tempus2016/decluttering-card-plus/wiki) — nothing in here is
content, and editing a page still means editing the wiki.

`.github/workflows/wiki-to-pages.yml` clones the wiki, runs `build.py` over it, copies this
directory on top and hands the result to Jekyll.

| | |
| --- | --- |
| `build.py` | Reshapes a wiki clone into a Jekyll source: rewrites `[Page](Page)` links to `.html`, gives each page front matter so it gets a `<title>` of its own, turns `Home.md` into `index.md` with the hero in its front matter, and makes `_Sidebar.md` an include. |
| `_layouts/wiki.html` | The page: bar, navigation, content, "on this page". |
| `_layouts/home.html` | The same, with the hero on top. |
| `assets/css/docs.css` | All of it. Custom properties at the top, dark scheme underneath them. |
| `assets/js/docs.js` | Enhancement only — placeholder highlighting, the contents column, the marker on the current page. Every page reads fine without it. |
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

## Working on it

There is no way to preview this without Jekyll, so the workflow builds on pull requests
that touch this directory and checks the output before anything reaches main. Locally:

```
git clone https://github.com/tempus2016/decluttering-card-plus.wiki.git site
python3 docs-theme/build.py site
cp -r docs-theme/{_config.yml,_layouts,_includes,assets} site/
jekyll serve --source site
```

Colours are checked at 4.5:1 or better against their background in both schemes. If you
add one, check it before you ship it.
