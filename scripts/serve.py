#!/usr/bin/env python3
"""本地预览：生成文章索引并启动静态服务器。

用法：
    python3 scripts/serve.py            # 自动选择空闲端口
    PORT=8080 python3 scripts/serve.py  # 指定端口
"""

from __future__ import annotations

import os
import socket
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "content" / "blog"
sys.path.insert(0, str(ROOT / "scripts"))

import build_manifest  # noqa: E402


class NoCacheHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".md": "text/markdown; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))


def free_port(start: int = 3000, end: int = 9000) -> int:
    for port in range(start, end + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(0.2)
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise SystemExit("在 3000-9000 范围内没有找到空闲端口")


def snapshot() -> tuple:
    items = []
    if BLOG_DIR.is_dir():
        for path in BLOG_DIR.glob("*.md"):
            try:
                stat = path.stat()
            except OSError:
                continue
            items.append((path.name, stat.st_mtime_ns, stat.st_size))
    return tuple(sorted(items))


def watch_blog(interval: float = 1.5) -> None:
    last = snapshot()
    while True:
        time.sleep(interval)
        current = snapshot()
        if current == last:
            continue
        last = current
        try:
            manifest = build_manifest.write_manifest()
            print(
                f"[watch] 检测到 content/blog/ 变化，索引已更新：{len(manifest['posts'])} 篇文章",
                flush=True,
            )
        except Exception as exc:  # noqa: BLE001
            print(f"[watch] 更新索引失败：{exc}", flush=True)


def main() -> None:
    build_manifest.main()
    threading.Thread(target=watch_blog, daemon=True).start()
    port = int(os.environ.get("PORT") or free_port())
    server = ThreadingHTTPServer(("0.0.0.0", port), partial(NoCacheHandler, directory=str(ROOT)))
    print(f"[serve] http://127.0.0.1:{port}/  (root: {ROOT})", flush=True)
    print("[serve] 监听 content/blog/，新增或修改 md 后刷新页面即可", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[serve] stopped")


if __name__ == "__main__":
    main()
