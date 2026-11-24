"""Check the editorial inputs using only the Python standard library."""

import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read_json(relative):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def check_texts(record, fields, label):
    require(isinstance(record, dict), f"{label} must be an object")
    for field in fields:
        value = record.get(field)
        require(isinstance(value, str) and value.strip(), f"{label}: missing {field}")


def check_links(links, label):
    require(isinstance(links, list) and len(links) > 0, f"{label}: add an evidence link")
    for item in links:
        check_texts(item, ["label", "url"], label)
        address = urlsplit(item["url"])
        require(address.scheme == "https" and address.hostname, f"{label}: use an absolute HTTPS URL")
        require(not address.username and not address.password, f"{label}: embedded credentials")


def check_content():
    profile = read_json("content/profile.json")
    check_texts(profile, ["name", "brand", "intro", "resume_file"], "profile")
    check_links(profile["profiles"], "profile")
    public_dir = (ROOT / "public").resolve()
    resume = (ROOT / profile["resume_file"]).resolve()
    require(resume.is_relative_to(public_dir), "résumé must be under public/")
    require(resume.is_file() and resume.read_bytes().startswith(b"%PDF-"), "résumé PDF is missing")
    projects = read_json("content/projects.json")
    require(isinstance(projects, list) and projects, "add at least one project")
    slugs = set()
    for project in projects:
        check_texts(project, ["slug", "name", "status", "summary", "role", "problem",
                              "implementation", "evidence", "limits", "next_step", "verified_on"], "project")
        slug = project["slug"]
        require(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug), f"invalid page slug {slug!r}")
        require(slug not in slugs, f"duplicate project slug {slug}")
        slugs.add(slug)
        date.fromisoformat(project["verified_on"])
        if project.get("source_access") != "private" or project["links"] != []:
            check_links(project["links"], slug)
    print(f"Checked {len(slugs)} project records, profile links and the résumé PDF.")


if __name__ == "__main__":
    try:
        check_content()
    except (ValueError, KeyError, OSError) as error:
        sys.exit(str(error))
