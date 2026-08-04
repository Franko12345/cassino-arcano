#!/usr/bin/env python3
"""Minimal static-site check used locally and in CI."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", ROOT / "blackjack/index.html", ROOT / "roulette/index.html"]


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.title = True
        for key in ("href", "src"):
            value = attrs.get(key, "")
            if value and not value.startswith(("http:", "https:", "#", "data:")):
                self.refs.append(value)


errors = []
for page in PAGES:
    parser = Parser()
    parser.feed(page.read_text())
    errors += ([] if parser.title else [f"{page.relative_to(ROOT)}: missing <title>"])
    for ref in parser.refs:
        target = (page.parent / ref.split("?", 1)[0]).resolve()
        if target.is_dir():
            target /= "index.html"
        if not target.exists():
            errors.append(f"{page.relative_to(ROOT)}: broken local ref {ref}")

if errors:
    print("\n".join(f"FAIL {error}" for error in errors))
    sys.exit(1)
print(f"PASS {len(PAGES)} pages; all local assets resolve")
