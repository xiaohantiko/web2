#!/usr/bin/env python3
"""Create the least-privilege Directus identity used by the public inquiry API.

The service identity can only create rows in ``inquiries``. It has no app,
admin, read, update, or delete access. The static token is supplied through
``INQUIRY_DIRECTUS_TOKEN`` and is never printed.
"""

from __future__ import annotations

import os
import sys
import uuid
from typing import Any

from bootstrap_core_schema import ApiError, ENV_PATH, authenticate, load_env, request


BASE_ID = "https://cms.hebeict.cn/inquiry-api"
POLICY_ID = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{BASE_ID}/policy"))
ROLE_ID = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{BASE_ID}/role"))
USER_ID = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{BASE_ID}/user"))
POLICY_NAME = "辰泰-官网留言接口策略"
ROLE_NAME = "官网留言接口"
USER_EMAIL = "inquiry-api@hebeict.cn"


def first(token: str, endpoint: str, query: dict[str, Any]) -> dict[str, Any] | None:
    _, result = request("GET", endpoint, token=token, query={**query, "limit": 1})
    rows = result.get("data") or []
    return rows[0] if rows else None


def ensure_policy(token: str) -> str:
    existing = first(
        token,
        "/policies",
        {"filter[name][_eq]": POLICY_NAME, "fields": "id,name"},
    )
    payload = {
        "name": POLICY_NAME,
        "icon": "contact_page",
        "description": "仅允许官网受控接口新增客户留言；不可登录后台或读取留言。",
        "app_access": False,
        "admin_access": False,
        "enforce_tfa": False,
        "ip_access": None,
    }
    if existing:
        request("PATCH", f"/policies/{existing['id']}", token=token, payload=payload)
        return existing["id"]
    request("POST", "/policies", token=token, payload={"id": POLICY_ID, **payload})
    return POLICY_ID


def ensure_role(token: str, policy_id: str) -> str:
    existing = first(
        token,
        "/roles",
        {"filter[name][_eq]": ROLE_NAME, "fields": "id,name"},
    )
    payload = {
        "name": ROLE_NAME,
        "icon": "contact_page",
        "description": "官网留言接口专用服务角色，不供人员登录。",
    }
    if existing:
        role_id = existing["id"]
        request("PATCH", f"/roles/{role_id}", token=token, payload=payload)
    else:
        role_id = ROLE_ID
        request("POST", "/roles", token=token, payload={"id": role_id, **payload})

    access = first(
        token,
        "/access",
        {
            "filter[role][_eq]": role_id,
            "filter[policy][_eq]": policy_id,
            "fields": "id",
        },
    )
    if not access:
        request(
            "POST",
            "/access",
            token=token,
            payload={"role": role_id, "policy": policy_id},
        )
    return role_id


def ensure_permission(token: str, policy_id: str) -> None:
    existing = first(
        token,
        "/permissions",
        {
            "filter[policy][_eq]": policy_id,
            "filter[collection][_eq]": "inquiries",
            "filter[action][_eq]": "create",
            "fields": "id",
        },
    )
    payload = {
        "policy": policy_id,
        "collection": "inquiries",
        "action": "create",
        "permissions": None,
        "validation": {
            "_and": [
                {"name": {"_nnull": True}},
                {"phone": {"_nnull": True}},
                {"need": {"_nnull": True}},
            ]
        },
        "presets": {
            "status": "new",
            "priority": "normal",
            "spam_score": 0,
            "notification_status": "pending",
        },
        "fields": [
            "inquiry_no",
            "name",
            "company",
            "phone",
            "email",
            "industry",
            "medium",
            "flow_rate",
            "attachment_note",
            "need",
            "source_page",
            "language",
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "consent",
        ],
    }
    if existing:
        request(
            "PATCH",
            f"/permissions/{existing['id']}",
            token=token,
            payload=payload,
        )
    else:
        request("POST", "/permissions", token=token, payload=payload)


def ensure_user(token: str, role_id: str, service_token: str) -> None:
    existing = first(
        token,
        "/users",
        {"filter[email][_eq]": USER_EMAIL, "fields": "id,email"},
    )
    payload = {
        "first_name": "官网留言",
        "last_name": "接口",
        "email": USER_EMAIL,
        "status": "active",
        "role": role_id,
        "token": service_token,
    }
    if existing:
        request("PATCH", f"/users/{existing['id']}", token=token, payload=payload)
    else:
        request("POST", "/users", token=token, payload={"id": USER_ID, **payload})


def main() -> int:
    service_token = os.environ.get("INQUIRY_DIRECTUS_TOKEN", "").strip()
    if len(service_token) < 32:
        raise RuntimeError("INQUIRY_DIRECTUS_TOKEN is missing or too short")

    admin_token = authenticate(load_env(ENV_PATH))
    policy_id = ensure_policy(admin_token)
    role_id = ensure_role(admin_token, policy_id)
    ensure_permission(admin_token, policy_id)
    ensure_user(admin_token, role_id, service_token)
    print("Inquiry API identity and create-only permission are ready.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ApiError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
