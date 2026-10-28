#!/usr/bin/env python3
"""Turn a clone of the wiki into something Jekyll can build.

Run by .github/workflows/wiki-to-pages.yml against the cloned wiki directory. Everything
here exists because a wiki and a static site want the same content in different shapes;
none of it needs the wiki to change, so the wiki keeps working as a wiki.
"""

import html
import json
import os
import re
import shutil
import sys

# What may be published. The wiki is a git repository anyone with wiki write access can push
# to, and upload-pages-artifact serves the whole directory - so a `login.html` or an
# `evil.js` pushed alongside the pages would go live next to them. Only the markdown this
# script turns into pages, and the images those pages show, have any business being served.
# Inside images/ that means image files: a script or a page there is served just the same,
# and an SVG is a page. Symlinks are followed by both git and open(), so they go first.
ALLOWED_DIRS = {'images'}
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}

# A wiki links to `[Variables](Variables)`, which works because GitHub's wiki serves
# extensionless URLs. Jekyll produces Variables.html, so every one of those links would
# 404. Only bare page names match: anything with a slash or a dot - images/, http://,
# a mailto: - has no chance of hitting this.
WIKI_LINK = re.compile(r"\]\(([A-Za-z0-9][A-Za-z0-9_-]*)(#[^)]*)?\)")

HEADING = re.compile(r"^#\s+(.+?)\s*$", re.M)
IMAGE = re.compile(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$", re.M)

# Markdown carries raw HTML through to the page, and the layout's meta CSP is what keeps an
# unwanted page from doing much. These are the tags that would get around it or that the CSP
# cannot reach: a <meta> can refresh to another site or declare a looser policy of its own,
# a <base> redirects every relative link, a <form> is a phishing page, and <iframe>,
# <object> and <embed> pull in content from wherever. None of them has a use in a page of
# documentation, so they come out wholesale - opening and closing tags, any case, attributes
# across lines - and the text between them stays as text.
RAW_TAG = re.compile(r"</?\s*(?:meta|form|iframe|object|embed|base)\b[^>]*>", re.I)

# A table row whose first cell opens with `code` documents that key, step or option, so it
# gets an anchor of its own: a search result or the A to Z page can land on the row rather
# than on the heading above a table forty rows long. The anchor is an empty span at the
# start of the cell; the row is lit by `tr:has(:target)` in docs.css.
FENCE = re.compile(r"^\s*(```|~~~)")
TABLE_RULE = re.compile(r"^\s*\|?\s*:?-{3,}")
SECTION = re.compile(r"^(#{2,4})\s+(.+?)\s*$")
CODE = re.compile(r"`([^`]+)`")
A_TO_Z = "A-to-Z"


def front_matter(fields):
    """YAML is a superset of JSON for scalars, so json.dumps quotes these safely."""
    lines = ["---"]
    lines += ["{}: {}".format(k, json.dumps(v)) for k, v in fields.items() if v]
    lines += ["---", ""]
    return "\n".join(lines)


ENDRAW = re.compile(r"\{(%-?\s*endraw)", re.I)


def literal(text, name):
    """
    Jekyll runs every page through Liquid before Markdown, and Liquid reads {{ }} and {% %} -
    which is exactly what a Home Assistant Jinja example is made of. {{ states(...) }} came
    out blank and {% set %} failed the whole build, so a page's text is kept away from it.

    A page that spells out an endraw tag itself would end the block early and hand the rest of
    itself to Liquid - which is how a tag the stripper took out could be written back in
    (review 2026-10-25). The tag is broken with a word joiner instead, which is invisible on
    the page and not a tag to Liquid, however it is spaced or cased.
    """
    if ENDRAW.search(text):
        print("broke an endraw tag spelt out in", name)
        text = ENDRAW.sub("{\u2060\\1", text)
    return "{% raw %}" + text + "{% endraw %}"


def first_cell(line):
    """The first cell of a markdown table row; a pipe escaped as \\| does not end it."""
    return re.split(r"(?<!\\)\|", line.strip()[1:])[0].strip()


def key_slug(code, taken):
    slug = "k-" + (re.sub(r"[^a-z0-9_]+", "-", sort_key(code)[0]).strip("-") or "key")
    n, base = 2, slug
    while slug in taken:
        slug, n = "{}-{}".format(base, n), n + 1
    taken.add(slug)
    return slug


def plain_heading(text):
    """A markdown heading as words: no version tag, no backticks, no emphasis."""
    text = re.sub(r"\s*\*?\(v\d+\.\d+\.\d+\+?\)\*?\s*$", "", text)
    return text.replace("`", "").replace("*", "").strip()


def anchor_rows(text, page, found):
    """
    Give every key row an anchor (see FENCE above), and note it in `found` for the A to Z
    page as (term, page, section, anchor). Tables inside a code fence are examples, not
    tables, and the header row of a table names columns rather than keys.
    """
    out, taken, fenced, section = [], set(), False, ""
    lines = text.split("\n")
    for i, line in enumerate(lines):
        if FENCE.match(line):
            fenced = not fenced
        heading = None if fenced else SECTION.match(line)
        if heading:
            section = plain_heading(heading.group(2))
        is_row = not fenced and line.lstrip().startswith("|") and not TABLE_RULE.match(line)
        is_header = is_row and i + 1 < len(lines) and TABLE_RULE.match(lines[i + 1])
        if is_row and not is_header:
            first = first_cell(line)
            codes = [c.replace("\\|", "|").strip() for c in CODE.findall(first)] if first.startswith("`") else []
            # A quoted example ('[[e|area]]') is a value someone wrote, not a key to look up.
            codes = [c for c in codes if c and c[0] not in "'\""]
            if codes:
                anchor = key_slug(codes[0], taken)
                cell_at = line.index("|") + 1
                line = '{} <span class="key" id="{}"></span>{}'.format(line[:cell_at], anchor, line[cell_at:])
                for code in codes:
                    found.append((code, page, section, anchor))
        out.append(line)
    return "\n".join(out)


def sort_key(term):
    """`[[name|slug]]` files under S, `custom:decluttering-card-plus` under D."""
    t = term.lower()
    t = re.sub(r"^\[\[[a-z0-9_.!?]*\|?", "", t).replace("]]", "")
    t = re.sub(r"^(custom:|\|)", "", t)
    t = t.lstrip("-_:.[]|!?")
    return (t or term.lower(), term.lower())


def a_to_z(found, titles):
    """The A to Z page: every key, step and option any page has a row for, with every
    place it is described, built fresh from the pages on every publish."""
    terms = {}
    for term, page, section, anchor in found:
        # A sentence (an error message, a line of YAML) or a bare number is something to
        # search for, not a word to look up; those keep their anchors but stay off the list.
        if page == "index" or " " in term or term.isdigit():
            continue
        where = terms.setdefault(term, [])
        link = (titles.get(page, page), section, page, anchor)
        if link not in where:
            where.append(link)
    lines = [
        "# A to Z",
        "",
        "Every key, placeholder step and option the documentation describes, in one list. "
        "Each entry links to every place it is covered: the reference row, and the page that "
        "explains it with an example. Built from the pages themselves each time they are "
        "published, so nothing here can fall behind.",
        "",
    ]
    letter = None
    for term in sorted(terms, key=sort_key):
        first = sort_key(term)[0][:1].upper()
        first = first if first.isalpha() else "#"
        if first != letter:
            letter = first
            lines += ["", "## " + letter, ""]
        places = " · ".join(
            "[{}{}]({}.html#{})".format(title, " › " + section if section and section != title else "", page, anchor)
            for title, section, page, anchor in terms[term]
        )
        lines.append("- `{}` — {}".format(term.replace("`", ""), places))
    return "\n".join(lines) + "\n"


def rewrite_links(text):
    text = WIKI_LINK.sub(lambda m: "]({}.html{})".format(m.group(1), m.group(2) or ""), text)
    # Home.md is published as index.md, so nothing should still point at Home.html.
    return text.replace("](Home.html)", "](index.html)")


def strip_raw_tags(text, name):
    """
    Drop the raw HTML tags a page must not carry (see RAW_TAG), and say which. Done again until
    nothing changes: taking `<meta>` out of `<me<meta>ta ...>` leaves `<meta ...>` behind, and a
    single pass would have published it (review 2026-10-25). A tag still standing after that is
    a page that must not be published at all.
    """
    dropped = 0
    while True:
        found = RAW_TAG.findall(text)
        if not found:
            break
        dropped += len(found)
        stripped = RAW_TAG.sub("", text)
        if stripped == text:
            raise SystemExit("refusing to publish {}: a raw tag survived stripping".format(name))
        text = stripped
    if dropped:
        print("dropped", dropped, "raw tag(s) from", name)
    return text


def headline_html(tagline):
    """The tagline is "Write a card once, use it everywhere." - the last word is the part
    a template stands in for, so it gets the placeholder treatment in the hero.

    The result is emitted as raw HTML in the layout, so the only markup here is the span this
    builds; the tagline's own text is HTML-escaped, so a tagline carrying `<` or `"` becomes
    that text rather than markup that breaks out of the heading."""
    m = re.match(r"^(.*?)([\w'-]+)(\W*)$", tagline.strip())
    if not m:
        return html.escape(tagline)
    before, word, after = (html.escape(part) for part in m.groups())
    return '{}<span class="ph">{}</span>{}'.format(before, word, after)


def split_home(text):
    """Home.md's preamble becomes the hero; the rest stays the page.

    Everything before the first `##` is the title, the tagline, the opening paragraph and
    the picture that proves it - which is exactly what a hero is made of. Editing Home.md
    therefore still edits the hero.
    """
    body_at = text.find("\n## ")
    preamble, body = (text[:body_at], text[body_at:]) if body_at != -1 else (text, "")

    image = IMAGE.search(preamble)
    hero = {"layout": "home"}
    if image:
        hero["hero_image_alt"] = image.group(1)
        hero["hero_image"] = image.group(2)
        preamble = preamble[: image.start()] + preamble[image.end():]

    blocks = [b.strip() for b in re.split(r"\n\s*\n", HEADING.sub("", preamble)) if b.strip()]
    blocks = [b for b in blocks if b != "---"]
    if blocks:
        hero["hero_headline_html"] = headline_html(blocks[0])
    if len(blocks) > 1:
        hero["hero_lede"] = " ".join(blocks[1].split())
    if len(blocks) > 2:
        hero["hero_caption"] = " ".join(blocks[2].split())

    title = HEADING.search(text)
    hero["title"] = title.group(1) if title else "Home"
    return hero, body.lstrip("\n")


def drop_unpublishable(root):
    """Remove anything in the wiki clone that is not a page or an image, so only what this
    script publishes can be served. Runs before the theme is laid over the clone, so it only
    ever sees wiki content, never the theme's own files."""
    for name in sorted(os.listdir(root)):
        path = os.path.join(root, name)
        if os.path.islink(path):
            os.remove(path)
            print("dropped link", name)
        elif os.path.isdir(path):
            if name not in ALLOWED_DIRS:
                shutil.rmtree(path)
                print("dropped directory", name)
            else:
                drop_non_images(path)
        elif not name.endswith(".md"):
            os.remove(path)
            print("dropped file", name)


def drop_non_images(root):
    """Inside an image directory, at any depth: images stay, everything else goes."""
    for folder, dirs, files in os.walk(root, topdown=True):
        for name in list(dirs):
            path = os.path.join(folder, name)
            if os.path.islink(path):
                os.remove(path)
                dirs.remove(name)
                print("dropped link", os.path.relpath(path, root))
        for name in files:
            path = os.path.join(folder, name)
            if os.path.islink(path) or os.path.splitext(name)[1].lower() not in IMAGE_EXTENSIONS:
                os.remove(path)
                print("dropped file", os.path.relpath(path, root))


def main(root):
    drop_unpublishable(root)
    found, titles = [], {}
    for name in sorted(os.listdir(root)):
        if not name.endswith(".md"):
            continue
        path = os.path.join(root, name)
        text = rewrite_links(strip_raw_tags(open(path, encoding="utf-8").read(), name))
        if name != "_Sidebar.md":
            page = "index" if name == "Home.md" else name[:-3]
            text = anchor_rows(text, page, found)
            title = HEADING.search(text)
            titles[page] = plain_heading(title.group(1)) if title else page.replace("-", " ")

        # The sidebar becomes the navigation on every page rather than a page of its own.
        # Copied after the link rewrite, so its links point at .html too.
        # Kept away from Liquid like every page: it is on every page, and a tag the stripper
        # took out could otherwise be written back in by Liquid (review 2026-10-25).
        if name == "_Sidebar.md":
            os.makedirs(os.path.join(root, "_includes"), exist_ok=True)
            open(os.path.join(root, "_includes", "sidebar.md"), "w", encoding="utf-8").write(literal(text, name))
            print("sidebar -> navigation")
            continue

        if name == "Home.md":
            # A wiki's Home page is its front page; a web server wants an index.
            fields, body = split_home(text)
            open(os.path.join(root, "index.md"), "w", encoding="utf-8").write(
                front_matter(fields) + literal(body, name)
            )
            print("Home.md -> index.md, hero from:", fields.get("hero_headline_html", "-"))
            continue

        # Front matter is what makes Jekyll render a file rather than copy it, and it is
        # where each page gets a <title> of its own - the whole point of publishing here.
        title = HEADING.search(text)
        open(path, "w", encoding="utf-8").write(
            front_matter({"title": title.group(1) if title else name[:-3].replace("-", " ")})
            + literal(text, name)
        )

    # Written last, from what the pages above held. A wiki page of the same name would be
    # replaced, which is why the name is one no wiki page should want.
    open(os.path.join(root, A_TO_Z + ".md"), "w", encoding="utf-8").write(
        front_matter({"title": "A to Z"}) + literal(a_to_z(found, titles), A_TO_Z)
    )
    print("A to Z:", len({t for t, *_ in found}), "terms")

    print("prepared", len([f for f in os.listdir(root) if f.endswith('.md')]), "pages")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "site")
