#!/usr/bin/env python3
"""扫描 content/certificates/ 下的图片，生成证书索引 certificates-manifest.json。

证书名称取图片文件名（去掉扩展名）。把证书图片放进 content/certificates/
目录后运行本脚本，或在 GitHub Actions 中自动生成即可在页面展示。
"""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CERT_DIR = ROOT / "content" / "certificates"
OUTPUT = ROOT / "certificates-manifest.json"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp", ".avif"}


def build() -> dict:
    CERT_DIR.mkdir(parents=True, exist_ok=True)
    certificates = []

    for path in sorted(CERT_DIR.iterdir(), key=lambda p: p.name):
        if not path.is_file():
            continue
        ext = path.suffix.lower()
        if ext not in IMAGE_EXTS:
            continue
        certificates.append(
            {
                "name": path.stem,
                "file": path.name,
                "src": f"content/certificates/{path.name}",
                "ext": ext.lstrip("."),
            }
        )

    return {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "certificates": certificates,
    }


def write_manifest() -> dict:
    manifest = build()
    OUTPUT.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def main() -> None:
    manifest = write_manifest()
    certs = manifest["certificates"]
    print(f"[manifest] {len(certs)} 张证书 -> {OUTPUT.relative_to(ROOT)}")
    for cert in certs:
        print(f"           {cert['name']}")


if __name__ == "__main__":
    main()
