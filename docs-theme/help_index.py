#!/usr/bin/env python3
"""Write help-index.json for the editors' field-level help (idea 61), from the wiki pages.

Run by build.py over the wiki clone before it reshapes the pages. For each heading (h2 to
h4) the first paragraph under it and the first YAML block are kept; a setting is matched to
the first heading that names it in backticks, else to the first paragraph that does. The
editors fetch the file once and show the paragraph beside the field, with a link to the
page, so the help is the wiki's own words and never a second copy to keep in step.

Usage: help_index.py <wiki-dir> [<out-dir>]
"""
import json
import os
import re
import sys

SITE = "https://tempus2016.github.io/decluttering-card-plus/"

# The settings the editors have a field for. Steps are keyed as `step:name`.
KEYS = [
    "template", "type", "description", "category", "variables", "default", "defaults", "let", "extends",
    "examples", "deprecated", "publish", "suggest_for", "group", "grid_options", "style", "visibility",
    "for_each", "for_each_from", "columns", "min_column_width", "gap", "empty", "lazy", "lazy_eager",
    "on_error", "rebuild_on", "debug", "strict", "fit", "name", "inherit_variables", "template_by_domain",
    "decluttering_templates", "decluttering_defaults", "decluttering_variables", "decluttering_let",
    "decluttering_template_sources", "required", "pattern", "allowed", "selector", "label",
]

HEADING = re.compile(r"^(#{2,4})\s+(.*?)\s*#*\s*$")
FENCE = re.compile(r"^```\s*(\w+)?\s*$")
INLINE = re.compile(r"`([^`]+)`")


def slug(text):
    """Kramdown's auto id, near enough: lowercase, drop everything but letters, digits, spaces and hyphens, spaces to hyphens."""
    text = INLINE.sub(r"\1", text)
    text = re.sub(r"[^\w\s-]", "", text.lower(), flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text.strip())
    return text or "section"


def plain(text):
    """Markdown inline markup taken out: links keep their words, code keeps its text."""
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\[[^\]]*\]", r"\1", text)
    text = INLINE.sub(r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    return " ".join(text.split())


def sections(markdown):
    """[(level, heading, first paragraph, first yaml block, mentioned keys)] for one page."""
    out = []
    current = None
    paragraph = []
    fence = None
    yaml_lines = []
    for line in markdown.split("\n"):
        if fence is not None:
            if line.startswith("```"):
                if current is not None and fence in ("yaml", "yml") and current["yaml"] is None:
                    current["yaml"] = "\n".join(yaml_lines).strip()
                fence = None
                yaml_lines = []
            else:
                yaml_lines.append(line)
            continue
        fenced = FENCE.match(line)
        if fenced:
            fence = fenced.group(1) or ""
            if current is not None and current["text"] is None and paragraph:
                current["text"] = plain(" ".join(paragraph))
            paragraph = []
            continue
        heading = HEADING.match(line)
        if heading:
            if current is not None and current["text"] is None and paragraph:
                current["text"] = plain(" ".join(paragraph))
            current = {"level": len(heading.group(1)), "heading": heading.group(2), "text": None, "yaml": None, "codes": []}
            out.append(current)
            paragraph = []
            continue
        if current is None:
            continue
        if line.strip() == "":
            if current["text"] is None and paragraph:
                current["text"] = plain(" ".join(paragraph))
            paragraph = []
            continue
        if line.startswith(("|", "<", "- ", "* ", "1.")) and current["text"] is None and not paragraph:
            # Tables, raw HTML and lists are not the sentence the help wants.
            continue
        paragraph.append(line.strip())
        current["codes"].extend(INLINE.findall(line))
    if current is not None and current["text"] is None and paragraph:
        current["text"] = plain(" ".join(paragraph))
    return out


def mentions(section, key):
    """Whether a section names a key: `key` or `key:` in backticks, in the heading first, then the paragraph."""
    wanted = {key, key + ":"}
    in_heading = any(code.strip() in wanted for code in INLINE.findall(section["heading"]))
    in_text = any(code.strip() in wanted or code.strip().startswith(key + ":") for code in section["codes"])
    return 2 if in_heading else 1 if in_text else 0


def build(wiki_dir):
    index = {}
    scores = {}
    for name in sorted(os.listdir(wiki_dir)):
        if not name.endswith(".md") or name.startswith("_"):
            continue
        page = name[:-3]
        title = page.replace("-", " ")
        markdown = open(os.path.join(wiki_dir, name), encoding="utf-8").read()
        for section in sections(markdown):
            if not section["text"]:
                continue
            for key in KEYS:
                score = mentions(section, key)
                # The reference lists every key in a line; a page that explains it reads better.
                if score and page == "Configuration-Reference":
                    score -= 0.5
                # Between two paragraphs, the one with an example to show wins.
                if score and section["yaml"]:
                    score += 0.1
                if not score or scores.get(key, 0) >= score:
                    continue
                scores[key] = score
                entry = {
                    "page": title,
                    "heading": plain(section["heading"]),
                    "text": section["text"][:600],
                    "url": SITE + page + ".html#" + slug(section["heading"]),
                }
                if section["yaml"]:
                    entry["yaml"] = section["yaml"][:600]
                index[key] = entry
    return index


def main(wiki_dir, out_dir=None):
    index = build(wiki_dir)
    out = os.path.join(out_dir or wiki_dir, "help-index.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))
    print("wrote", out + ":", len(index), "settings documented")
    return index


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "site", sys.argv[2] if len(sys.argv) > 2 else None)
