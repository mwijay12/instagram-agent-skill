#!/usr/bin/env python3
"""
check.py - lint the content kit before anything is pasted into Instagram.

Stdlib only. It reads carousels/decks/*.json and the two voice files, then
checks the rules this kit and the parent skill pack actually enforce:

  - cover headline <= 6 words; other headlines <= 7 words
  - slide body <= 25 words (recap slides with numbered lines may be longer)
  - 6-10 slides per deck
  - caption hook line fits Instagram's ~125 visible characters
  - <= 5 hashtags, all specific (no #viral / #fyp / #explorepage)
  - exactly one ask, and the keyword is one sayable word
  - no URL in the caption
  - banned slop words and banned unverified claims anywhere in post copy
  - no em dash, no invisible characters
  - bio length (<= 150) and name field (<= 30)

Usage:
    python3 check.py                 # full report
    python3 check.py --json          # machine readable
Exit code 1 if any FAIL, 0 otherwise. WARN does not fail the build.
"""

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
DECKS = HERE / "carousels" / "decks"

SLOP = [
    "revolutionize", "game-changer", "game changer", "unlock", "seamless",
    "leverage", "delve", "cutting-edge", "world-class", "in today's fast-paced",
    "stop scrolling", "in this video", "follow for more", "tag someone who",
    "the algorithm loves", "run don't walk", "hey guys", "link in bio",
    "synergy", "elevate your", "empower", "transform your business",
]

# Site numbers are self-claimed, not measured. In post copy they must not
# appear as proof. See 01-presence-audit.md section 5.
UNVERIFIED = [
    "99.98%", "24ms", "0.8s", "10x faster", "10x billing", "0% lost stock",
    "100% cloud sync", "100% code ownership", "100% code & ip", "95+ lighthouse",
    "95+ Lighthouse", "lighthouse 95", "brela registered", "pdpc certified",
    "neema mwakalinga", "200+ clients", "2s on 2g",
]

BAD_TAGS = {"#viral", "#fyp", "#foryou", "#explorepage", "#followforfollow", "#like4like"}
WORD_RE = re.compile(r"[\w'’\-]+", re.UNICODE)
URL_RE = re.compile(r"https?://|www\.", re.IGNORECASE)
ASK_RE = re.compile(r"\b(comment|dm|save|follow|reply|write|andika|tuma|commenti)\b", re.IGNORECASE)


def words(s):
    return WORD_RE.findall(s.replace("\n", " "))


def invisible(s):
    return [c for c in s if unicodedata.category(c) == "Cf"]


def check_deck(path, report):
    d = json.loads(path.read_text(encoding="utf-8"))
    tag = d.get("id", path.stem)
    def fail(msg): report.append(("FAIL", tag, msg))
    def warn(msg): report.append(("WARN", tag, msg))
    def ok(msg): report.append(("PASS", tag, msg))

    slides = d.get("slides", [])
    if not 6 <= len(slides) <= 10:
        fail(f"{len(slides)} slides; /ig-carousel wants 6-10")
    else:
        ok(f"{len(slides)} slides")

    for i, s in enumerate(slides, 1):
        limit = 6 if i == 1 else 7
        n = len(words(s.get("headline", "")))
        if n > limit:
            fail(f"slide {i} headline {n} words (> {limit}): {s.get('headline','')[:60]}")
        body = s.get("body", "")
        nb = len(words(body))
        if nb > 25 and "visual" in s and s.get("visual") != "steps":
            fail(f"slide {i} body {nb} words (> 25)")
        if "\u2014" in (s.get("headline", "") + body) or "\u2013" in (s.get("headline", "") + body):
            fail(f"slide {i} has an em/en dash (use a plain hyphen)")
        if invisible(s.get("headline", "") + body):
            fail(f"slide {i} has invisible characters")

    cap = d.get("caption", "")
    if not cap:
        fail("no caption")
    else:
        first = cap.splitlines()[0]
        if len(first) > 125:
            fail(f"caption line 1 is {len(first)} chars, gets cut at 125")
        else:
            ok(f"caption hook {len(first)}/125 visible chars")
        if URL_RE.search(cap):
            fail("caption has a URL (captions are not clickable)")
        tags = re.findall(r"#\w+", cap)
        if len(tags) > 5:
            fail(f"{len(tags)} hashtags (> 5)")
        elif any(t.lower() in BAD_TAGS for t in tags):
            fail(f"generic hashtag: {[t for t in tags if t.lower() in BAD_TAGS]}")
        else:
            ok(f"{len(tags)} hashtags")
        asks = ASK_RE.findall(cap)
        strong = len(re.findall(r"\bcomment\b", cap, re.IGNORECASE))
        if strong != 1:
            fail(f"expected exactly one 'Comment X' ask, found {strong}")
        else:
            ok("one ask")
        kw = d.get("keyword", "")
        if not kw or not re.fullmatch(r"[A-Za-z]{3,12}", kw):
            fail(f"keyword {kw!r} is not one sayable word")
        elif kw.lower() not in cap.lower():
            fail(f"keyword {kw} not spoken in the caption")

    all_copy = " ".join([cap] + [s.get("headline", "") + " " + s.get("body", "") for s in slides])
    low = all_copy.lower()
    for term in SLOP:
        if term in low:
            fail(f"slop word: {term!r}")
    for term in UNVERIFIED:
        if term.lower() in low:
            fail(f"unverified claim in post copy: {term!r}")
    if "\u2014" in all_copy or "\u2013" in all_copy:
        fail("em/en dash in post copy (humanize.py would rewrite it)")
    if invisible(all_copy):
        fail("invisible characters in post copy")
    if not d.get("alt"):
        warn("no alt text for the cover")
    if not d.get("sources"):
        warn("no sources listed")
    return d


BIO_DOCS = ("01-presence-audit.md", "07-ig-setup.md")


def check_bios(report):
    """Validate every fenced Name field / Bio block in the copy-paste docs.

    07-ig-setup.md repeats the studio bio as a quick-copy block, so both
    documents are checked: if they drift, the linter says so.
    """
    found_any = False
    for doc in BIO_DOCS:
        path = HERE / doc
        if not path.exists():
            continue
        lines = path.read_text(encoding="utf-8").splitlines()
        for i, line in enumerate(lines):
            if not (line.startswith("**Name field") or line.startswith("**Bio (")):
                continue
            block = "\n".join(lines[i:i + 7])
            m = re.search(r"```\n(.+?)\n```", block, re.S)
            if not m:
                continue
            found_any = True
            value = m.group(1).strip()
            limit = 30 if line.startswith("**Name") else 150
            status = "PASS" if len(value) <= limit else "FAIL"
            label = "name field" if limit == 30 else "bio"
            report.append((status, "bio", f"{doc}: {label} {len(value)}/{limit} chars"))
    if not found_any:
        report.append(("WARN", "bio", "could not parse any bio block; check by hand"))


def check_variations(report):
    """Validate the four copy-paste bio variations in bio-variations.json."""
    path = HERE / "bio-variations.json"
    if not path.exists():
        report.append(("FAIL", "variations", "bio-variations.json missing"))
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    vs = data.get("variations", [])
    report.append(("PASS" if len(vs) == 4 else "FAIL", "variations",
                   f"{len(vs)} bio variations (want 4)"))
    for v in vs:
        n, b = v.get("name", ""), v.get("bio", "")
        n_ok, b_ok = len(n) <= 30, len(b) <= 150
        report.append(("PASS" if n_ok else "FAIL", "variations",
                       f"{v['id']}: name {len(n)}/30 chars"))
        report.append(("PASS" if b_ok else "FAIL", "variations",
                       f"{v['id']}: bio {len(b)}/150 chars"))
        declared = (v.get("name_chars") == len(n) and v.get("bio_chars") == len(b))
        report.append(("PASS" if declared else "FAIL", "variations",
                       f"{v['id']}: declared char counts match text"))
    report.append(("PASS" if any(v.get("fully_swahili") for v in vs) else "FAIL",
                   "variations", "at least one fully-Kiswahili option"))
    c = data.get("contacts", {})
    ok = all(k in c for k in ("email", "whatsapp_bot", "human"))
    report.append(("PASS" if ok else "FAIL", "variations",
                   "email + bot + human contact are labelled"))
    report.append(("PASS" if "subdomain" in data.get("domain", {}).get("status", "")
                   else "WARN", "variations", "subdomain status is stated honestly"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--verbose", action="store_true", help="also print every PASS line")
    args = ap.parse_args()

    report = []
    decks = sorted(DECKS.glob("[0-9]*.json"))
    parsed = []
    for p in decks:
        parsed.append(check_deck(p, report))
    check_bios(report)
    check_variations(report)

    manifest = DECKS / "index.json"
    if manifest.exists():
        listed = {d["file"] for d in json.loads(manifest.read_text(encoding="utf-8"))["decks"]}
        actual = {p.name for p in decks}
        if listed != actual:
            report.append(("FAIL", "manifest", f"index.json mismatch: {listed ^ actual}"))
        else:
            report.append(("PASS", "manifest", f"{len(listed)} decks indexed"))
    else:
        report.append(("FAIL", "manifest", "index.json missing"))

    if args.json:
        print(json.dumps([{"level": a, "where": b, "message": c} for a, b, c in report], indent=2))
    else:
        print("CONTENT KIT LINT")
        print("=" * 68)
        for level, where, msg in report:
            if level != "PASS" or args.verbose:
                print(f"  {level:4}  {where:22}  {msg}")
        n_fail = sum(1 for r in report if r[0] == "FAIL")
        n_warn = sum(1 for r in report if r[0] == "WARN")
        n_pass = sum(1 for r in report if r[0] == "PASS")
        print("-" * 68)
        print(f"  {n_pass} pass · {n_warn} warn · {n_fail} fail · {len(parsed)} decks")
        print("  READY" if n_fail == 0 else "  NOT READY - fix every FAIL before posting")
    return 1 if any(r[0] == "FAIL" for r in report) else 0


if __name__ == "__main__":
    sys.exit(main())
