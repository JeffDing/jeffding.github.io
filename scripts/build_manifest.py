#!/usr/bin/env python3
"""扫描 content/blog/ 下的 Markdown，生成博客索引 blog-manifest.json。

标题始终取自文件名（去掉 .md 后缀）。
frontmatter 中的 date / summary 为可选字段，缺失时自动推断。
"""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
OUTPUT = ROOT / "blog-manifest.json"

FRONTMATTER_RE = re.compile(r"^\ufeff?---\s*\r?\n(.*?)\r?\n---\s*\r?\n?", re.S)


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text

    meta: dict[str, str] = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip().lower()] = value.strip().strip("\"'")

    return meta, text[match.end():]


def strip_markdown(text: str) -> str:
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"`[^`]*`", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+", " ", text, flags=re.M)
    text = re.sub(r"[*_~]", "", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def summarize(body: str, meta: dict[str, str], limit: int = 110) -> str:
    if meta.get("summary"):
        return meta["summary"]
    if meta.get("description"):
        return meta["description"]
    plain = strip_markdown(body)
    if len(plain) <= limit:
        return plain
    return plain[:limit].rstrip("，。,.、;； ") + "…"


def reading_time(body: str) -> int:
    text = strip_markdown(body)
    cjk = len(re.findall(r"[\u4e00-\u9fff]", text))
    words = len(re.findall(r"[A-Za-z0-9_]+", text))
    minutes = cjk / 250 + words / 160
    return max(1, round(minutes))


def normalize_date(raw: str | None, fallback: datetime) -> str:
    if raw:
        for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M:%S"):
            try:
                return datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
            except ValueError:
                continue
        match = re.search(r"\d{4}-\d{2}-\d{2}", raw)
        if match:
            return match.group(0)
    return fallback.strftime("%Y-%m-%d")


def build() -> dict:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    posts = []

    for path in sorted(BLOG_DIR.glob("*.md")):
        if not path.is_file():
            continue
        raw = path.read_text(encoding="utf-8", errors="replace")
        meta, body = parse_frontmatter(raw)
        modified = datetime.fromtimestamp(path.stat().st_mtime)
        posts.append(
            {
                "slug": path.stem,
                "title": path.stem,
                "date": normalize_date(meta.get("date"), modified),
                "summary": summarize(body, meta),
                "readingTime": reading_time(body),
            }
        )

    posts.sort(key=lambda item: (item["date"], item["title"]), reverse=True)
    return {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "posts": posts,
    }


def write_manifest() -> dict:
    manifest = build()
    OUTPUT.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def main() -> None:
    manifest = write_manifest()
    print(f"[manifest] {len(manifest['posts'])} 篇文章 -> {OUTPUT.relative_to(ROOT)}")
    for post in manifest["posts"]:
        print(f"           {post['date']}  {post['title']}")


if __name__ == "__main__":
    main()
