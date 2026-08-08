#!/usr/bin/env python3
"""Small same-origin API that validates inquiries before writing to Directus."""

from __future__ import annotations

import json
import logging
import os
import re
import secrets
import threading
import time
import urllib.error
import urllib.request
from collections import defaultdict, deque
from datetime import datetime
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any


HOST = os.environ.get("INQUIRY_API_HOST", "127.0.0.1")
PORT = int(os.environ.get("INQUIRY_API_PORT", "8060"))
DIRECTUS_URL = os.environ.get("DIRECTUS_LOCAL_URL", "http://127.0.0.1:8055").rstrip("/")
DIRECTUS_TOKEN = os.environ.get("INQUIRY_DIRECTUS_TOKEN", "").strip()
MAX_BODY = 32 * 1024
RATE_WINDOW = 60 * 60
RATE_MAX = 10

PHONE_RE = re.compile(r"^[0-9+()\-\s]{6,80}$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
LOG = logging.getLogger("chentai-inquiry-api")


class RateLimiter:
    def __init__(self) -> None:
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        with self._lock:
            events = self._events[key]
            while events and events[0] <= now - RATE_WINDOW:
                events.popleft()
            if len(events) >= RATE_MAX:
                return False
            events.append(now)
            return True


LIMITER = RateLimiter()


def clean(value: Any, maximum: int) -> str:
    if not isinstance(value, str):
        return ""
    value = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", value)
    return value.strip()[:maximum]


def validate(raw: dict[str, Any]) -> tuple[dict[str, Any] | None, str | None]:
    name = clean(raw.get("name"), 120)
    phone = clean(raw.get("phone"), 80)
    need = clean(raw.get("need"), 5000)
    email = clean(raw.get("email"), 200)

    if len(name) < 2:
        return None, "请填写联系人姓名"
    if not PHONE_RE.fullmatch(phone):
        return None, "请填写有效的联系电话"
    if len(need) < 5:
        return None, "请填写至少 5 个字的需求说明"
    if email and not EMAIL_RE.fullmatch(email):
        return None, "请填写有效的电子邮箱"
    if raw.get("consent") not in (True, "true", "on", "1", 1):
        return None, "请先同意仅将信息用于本次项目沟通"

    language = clean(raw.get("language"), 16)
    if language not in {"zh-CN", "en-US"}:
        language = "zh-CN"

    payload = {
        "inquiry_no": "CT-" + datetime.now().strftime("%Y%m%d-%H%M%S-") + secrets.token_hex(2).upper(),
        "name": name,
        "company": clean(raw.get("company"), 200) or None,
        "phone": phone,
        "email": email or None,
        "industry": clean(raw.get("industry"), 160) or None,
        "medium": clean(raw.get("medium"), 200) or None,
        "flow_rate": clean(raw.get("flowRate"), 160) or None,
        "attachment_note": clean(raw.get("attachmentNote"), 2000) or None,
        "need": need,
        "source_page": clean(raw.get("sourcePage"), 300) or "/inquiry.html",
        "language": language,
        "utm_source": clean(raw.get("utmSource"), 160) or None,
        "utm_medium": clean(raw.get("utmMedium"), 160) or None,
        "utm_campaign": clean(raw.get("utmCampaign"), 160) or None,
        "consent": True,
    }
    return payload, None


def write_to_directus(payload: dict[str, Any]) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        f"{DIRECTUS_URL}/items/inquiries",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {DIRECTUS_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=8) as response:
            response.read()
            if not 200 <= response.status < 300:
                raise RuntimeError(f"Directus returned {response.status}")
    except urllib.error.HTTPError as exc:
        exc.read()
        raise RuntimeError(f"Directus returned {exc.code}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError("Directus is unavailable") from exc


class Handler(BaseHTTPRequestHandler):
    server_version = "ChentaiInquiryAPI/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        LOG.info("client=%s " + fmt, self.client_address[0], *args)

    def send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def client_key(self) -> str:
        return self.headers.get("X-Real-IP", "").strip() or self.client_address[0]

    def do_GET(self) -> None:
        if self.path == "/health":
            self.send_json(HTTPStatus.OK, {"status": "ok"})
        else:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path != "/inquiries":
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return
        if not self.headers.get("Content-Type", "").lower().startswith("application/json"):
            self.send_json(HTTPStatus.UNSUPPORTED_MEDIA_TYPE, {"error": "仅支持 JSON 请求"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            self.send_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {"error": "提交内容过大或为空"})
            return
        if not LIMITER.allow(self.client_key()):
            self.send_json(HTTPStatus.TOO_MANY_REQUESTS, {"error": "提交过于频繁，请稍后再试"})
            return

        try:
            raw = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "提交内容格式无效"})
            return
        if not isinstance(raw, dict):
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "提交内容格式无效"})
            return

        # A human never sees or fills this field. Return a normal-looking
        # response to bots without creating a database row.
        if clean(raw.get("website"), 200):
            time.sleep(0.4)
            self.send_json(HTTPStatus.CREATED, {"ok": True, "mail": {"sent": False}})
            return

        payload, error = validate(raw)
        if error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": error})
            return

        assert payload is not None
        try:
            write_to_directus(payload)
        except RuntimeError as exc:
            LOG.error("inquiry=%s write_failed=%s", payload["inquiry_no"], exc)
            self.send_json(HTTPStatus.BAD_GATEWAY, {"error": "留言暂时无法保存，请稍后再试"})
            return

        LOG.info("inquiry=%s saved", payload["inquiry_no"])
        self.send_json(
            HTTPStatus.CREATED,
            {"ok": True, "inquiryNo": payload["inquiry_no"], "mail": {"sent": False}},
        )


def main() -> None:
    if len(DIRECTUS_TOKEN) < 32:
        raise SystemExit("INQUIRY_DIRECTUS_TOKEN is missing or too short")
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    LOG.info("listening on %s:%s", HOST, PORT)
    server.serve_forever()


if __name__ == "__main__":
    main()
