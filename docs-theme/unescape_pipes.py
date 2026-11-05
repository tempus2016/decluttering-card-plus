#!/usr/bin/env python3
"""Take the backslash off \\| in table cells of the pages Jekyll has built.

Run by .github/workflows/wiki-to-pages.yml over _site, after Jekyll and before the search
index, so the index reads the same text the page shows.

A pipe inside a markdown table has to be written \\| or it ends the cell, and the wiki
writes placeholders like `[[room\\|slug]]` that way. GitHub's renderer drops the backslash
even inside backticks. Jekyll's kramdown keeps it inside a code span, so the published site
showed `[[room\\|slug]]` where the wiki shows `[[room|slug]]` (#401).

Only table cells are touched. Outside a table there is no reason to write \\|, so one in a
code block is meant literally (a regular expression, say) and is left alone.
"""

import os
import re
import sys

CELL = re.compile(r"(<t[dh]\b[^>]*>)(.*?)(</t[dh]>)", re.S)


def fix(html):
    return CELL.sub(lambda m: m.group(1) + m.group(2).replace("\\|", "|") + m.group(3), html)


def main(site):
    changed = 0
    for dirpath, _, files in os.walk(site):
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(dirpath, name)
            with open(path, encoding="utf-8") as f:
                html = f.read()
            out = fix(html)
            if out != html:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(out)
                changed += 1
    print(f"unescaped table pipes in {changed} pages")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "_site")
