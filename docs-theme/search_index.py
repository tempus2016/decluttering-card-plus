#!/usr/bin/env python3
"""Write search.json for the docs site's search box, from the pages Jekyll has built.

Run by .github/workflows/wiki-to-pages.yml over _site, after Jekyll. It reads the rendered
HTML rather than the wiki's markdown so the anchors are the ids Jekyll actually gave the
headings, not a guess at its slug rules, and the text is what the page shows rather than
markdown with its punctuation still in.

One entry per heading (h2 to h4), so a result can land on the part of a page that matched
instead of the top of it. Only <main> is read: the navigation and the footer are on every
page and would match everything.

On top of those, one entry per key row: a table row build.py gave an anchor, because its
first cell names a key, step or option. Those carry the names in "k", so typing a key lands
on the row that defines it rather than on a heading somewhere above it.
"""

import json
import os
import re
import sys
from html.parser import HTMLParser

SECTION_TAGS = {"h2", "h3", "h4"}
# Text inside these is never shown as words on the page, or (h1) is the page's title,
# which every entry for the page carries already.
SKIP_TAGS = {"script", "style", "template", "noscript", "h1"}
VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
SITE_SUFFIX = re.compile(r"\s*·\s*[^·]*$")


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.sections = []  # [heading, anchor, [text parts]]
        self._in_title = False
        self._main_depth = 0  # open elements inside <main>, 0 = outside it
        self._skip_depth = 0
        self._heading = None  # [tag, anchor, [text parts]] while inside a heading
        self.sections.append(["", "", []])
        self.keys = []  # [section anchor, row anchor, [names], [text parts]]
        self._row = None  # the key row being read, as above, or a plain row as False
        self._cell = 0  # which cell of the row, from 1
        self._code = None  # text parts of a <code> in the first cell

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self._in_title = True
        if self._main_depth == 0:
            if tag == "main":
                self._main_depth = 1
            return
        if tag not in VOID_TAGS:
            self._main_depth += 1
        if tag in SKIP_TAGS:
            self._skip_depth += 1
        elif tag in SECTION_TAGS and self._heading is None:
            self._heading = [tag, dict(attrs).get("id") or "", []]
        elif tag == "tr":
            self._row, self._cell = False, 0
        elif tag in ("td", "th") and self._row is not None:
            self._cell += 1
        elif tag == "span" and self._cell == 1 and "key" in (dict(attrs).get("class") or "").split():
            self._row = [self.sections[-1][1], dict(attrs).get("id") or "", [], []]
        elif tag == "code" and self._cell == 1 and self._row:
            self._code = []
        elif tag in ("br", "p", "li", "td", "th", "pre", "div", "tr"):
            self._text(" ")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if self._main_depth == 0:
            return
        if tag in SKIP_TAGS and self._skip_depth:
            self._skip_depth -= 1
        if self._heading and tag == self._heading[0]:
            text = squash("".join(self._heading[2]))
            # A heading without an id cannot be linked to; its words go into the section
            # it sits in rather than starting one nobody could land on.
            if self._heading[1]:
                self.sections.append([text, self._heading[1], []])
            else:
                self.sections[-1][2].append(" " + text + " ")
            self._heading = None
        if tag == "code" and self._code is not None:
            name = squash("".join(self._code))
            if name and self._row:
                self._row[2].append(name)
            self._code = None
        if tag == "tr":
            if self._row and self._row[1] and self._row[2]:
                self.keys.append(self._row)
            self._row = None
        if tag not in VOID_TAGS:
            self._main_depth -= 1

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._main_depth and not self._skip_depth:
            self._text(data)

    def _text(self, data):
        (self._heading[2] if self._heading else self.sections[-1][2]).append(data)
        if self._row:
            self._row[3].append(data)
        if self._code is not None:
            self._code.append(data)


def squash(text):
    return " ".join(text.split())


def index_page(path, name):
    page = Page()
    page.feed(open(path, encoding="utf-8").read())
    title = SITE_SUFFIX.sub("", squash(page.title)) or name[:-5].replace("-", " ")
    entries = []
    for heading, anchor, parts in page.sections:
        text = squash("".join(parts))
        if not heading and not text:
            continue
        entries.append({
            "p": title,
            "h": heading,
            "u": name + ("#" + anchor if anchor else ""),
            "x": text,
        })
    headings = {anchor: heading for heading, anchor, _ in page.sections}
    for section, anchor, names, parts in page.keys:
        entries.append({
            "p": title,
            "h": headings.get(section, ""),
            "k": names,
            "u": name + "#" + anchor,
            "x": squash("".join(parts)),
        })
    return entries


def main(root):
    entries = []
    for name in sorted(os.listdir(root)):
        # The A to Z page is a list of every key with links to the rows already indexed;
        # in the results it would only ever be a worse copy of the hit above it.
        if not name.endswith(".html") or name in ("404.html", "A-to-Z.html"):
            continue
        found = index_page(os.path.join(root, name), name)
        entries += found
        print("indexed", name + ":", len(found), "sections")
    out = os.path.join(root, "search.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False, separators=(",", ":"))
    print("key rows:", sum(1 for e in entries if "k" in e))
    print("wrote", out + ":", len(entries), "sections,", os.path.getsize(out), "bytes")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "_site")
