#!/usr/bin/env python3
"""Create the initial Directus 11 roles, policies, and permissions.

This script imports the authenticated API helper from bootstrap_core_schema.py.
It is idempotent: policies, roles, and permission rules are updated by their
stable names/keys instead of being duplicated.

The built-in Administrator role and the Public policy are never modified.
"""

from __future__ import annotations

import sys
import uuid
from dataclasses import dataclass
from typing import Any

from bootstrap_core_schema import ApiError, ENV_PATH, authenticate, load_env, request


@dataclass(frozen=True)
class RoleSpec:
    key: str
    name: str
    icon: str
    description: str

    @property
    def policy_name(self) -> str:
        return f"辰泰-{self.name}策略"

    @property
    def role_id(self) -> str:
        return stable_id("role", self.key)

    @property
    def policy_id(self) -> str:
        return stable_id("policy", self.key)


def stable_id(kind: str, key: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"https://cms.hebeict.cn/{kind}/{key}"))


ROLES = [
    RoleSpec(
        "content-editor",
        "内容编辑",
        "edit_note",
        "编辑新闻、证书及后续网站栏目；不能访问客户留言或系统设置。",
    ),
    RoleSpec(
        "news-editor",
        "新闻编辑",
        "newspaper",
        "管理新闻资讯、行业资讯和技术服务文章；不能访问客户留言。",
    ),
    RoleSpec(
        "inquiry-agent",
        "留言客服",
        "support_agent",
        "查看、分派和跟进客户留言；不能访问网站内容配置或系统设置。",
    ),
    RoleSpec(
        "reviewer",
        "只读审阅",
        "fact_check",
        "只读查看网站公开内容，不能编辑、删除或读取客户留言。",
    ),
]


REFERENCE_COLLECTIONS = [
    "languages",
    "article_categories",
    "article_categories_translations",
    "certificate_categories",
    "certificate_categories_translations",
]

ARTICLE_COLLECTIONS = ["articles", "articles_translations"]

CERTIFICATE_COLLECTIONS = [
    "certificates",
    "certificates_translations",
    "certificate_placements",
]

CONTENT_COLLECTIONS = REFERENCE_COLLECTIONS + ARTICLE_COLLECTIONS + CERTIFICATE_COLLECTIONS


def permission(
    collection: str,
    action: str,
    *,
    fields: list[str] | None = None,
    item_filter: dict[str, Any] | None = None,
    validation: dict[str, Any] | None = None,
    presets: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "collection": collection,
        "action": action,
        "permissions": item_filter,
        "validation": validation,
        "presets": presets,
        "fields": fields or ["*"],
    }


def read_permissions(collections: list[str]) -> list[dict[str, Any]]:
    return [permission(collection, "read") for collection in collections]


def editable_permissions(
    collections: list[str],
    *,
    status_limited: bool = False,
) -> list[dict[str, Any]]:
    rules: list[dict[str, Any]] = []
    for collection in collections:
        rules.append(permission(collection, "create"))
        rules.append(permission(collection, "read"))
        if status_limited and collection in {"articles", "certificates"}:
            editable_filter = {"status": {"_in": ["draft", "in_review"]}}
            rules[-2]["validation"] = editable_filter
            rules[-2]["presets"] = {"status": "draft"}
            rules.append(
                permission(
                    collection,
                    "update",
                    item_filter=editable_filter,
                    validation=editable_filter,
                )
            )
        else:
            rules.append(permission(collection, "update"))
    return rules


def permissions_for(role_key: str) -> list[dict[str, Any]]:
    if role_key == "content-editor":
        rules = read_permissions(REFERENCE_COLLECTIONS)
        rules += editable_permissions(
            ARTICLE_COLLECTIONS + CERTIFICATE_COLLECTIONS,
            status_limited=True,
        )
        rules += [
            permission("directus_files", "create"),
            permission("directus_files", "read"),
            permission("directus_files", "update"),
            permission("directus_folders", "read"),
        ]
        return rules

    if role_key == "news-editor":
        rules = read_permissions(REFERENCE_COLLECTIONS)
        rules += editable_permissions(ARTICLE_COLLECTIONS)
        rules += [
            permission("directus_files", "create"),
            permission("directus_files", "read"),
            permission("directus_files", "update"),
            permission("directus_folders", "read"),
        ]
        return rules

    if role_key == "inquiry-agent":
        return [
            permission("inquiries", "read"),
            permission("inquiries", "update"),
            permission("inquiry_notes", "create"),
            permission("inquiry_notes", "read"),
            permission("inquiry_notes", "update"),
            permission("inquiry_status_history", "create"),
            permission("inquiry_status_history", "read"),
            permission(
                "directus_users",
                "read",
                fields=["id", "first_name", "last_name", "email", "status", "role"],
            ),
        ]

    if role_key == "reviewer":
        return read_permissions(CONTENT_COLLECTIONS + ["directus_files", "directus_folders"])

    raise ValueError(f"Unknown role key: {role_key}")


def find_by_name(token: str, endpoint: str, name: str) -> dict[str, Any] | None:
    _, result = request(
        "GET",
        endpoint,
        token=token,
        query={"filter[name][_eq]": name, "limit": 1, "fields": "id,name"},
    )
    rows = result.get("data") or []
    return rows[0] if rows else None


def ensure_policy(token: str, spec: RoleSpec) -> str:
    existing = find_by_name(token, "/policies", spec.policy_name)
    payload = {
        "name": spec.policy_name,
        "icon": spec.icon,
        "description": spec.description,
        "app_access": True,
        "admin_access": False,
        "enforce_tfa": False,
        "ip_access": None,
    }
    if existing:
        policy_id = existing["id"]
        request("PATCH", f"/policies/{policy_id}", token=token, payload=payload)
        print(f"[update] policy {spec.policy_name}")
        return policy_id

    payload["id"] = spec.policy_id
    _, result = request("POST", "/policies", token=token, payload=payload)
    policy_id = result.get("data", {}).get("id") or spec.policy_id
    print(f"[ok]     policy {spec.policy_name}")
    return policy_id


def ensure_role(token: str, spec: RoleSpec, policy_id: str) -> str:
    existing = find_by_name(token, "/roles", spec.name)
    payload = {
        "name": spec.name,
        "icon": spec.icon,
        "description": spec.description,
    }
    if existing:
        role_id = existing["id"]
        request("PATCH", f"/roles/{role_id}", token=token, payload=payload)
        print(f"[update] role {spec.name}")
    else:
        payload["id"] = spec.role_id
        _, result = request("POST", "/roles", token=token, payload=payload)
        role_id = result.get("data", {}).get("id") or spec.role_id
        print(f"[ok]     role {spec.name}")

    ensure_role_policy_access(token, role_id, policy_id)
    return role_id


def ensure_role_policy_access(token: str, role_id: str, policy_id: str) -> None:
    """Attach a policy through Directus 11's access junction endpoint.

    Sending ``policies`` as a nested field while creating ``/roles`` can be
    rejected by Directus even for an administrator. Directus' own v11 CLI
    creates the role first and then writes the ``directus_access`` junction;
    mirror that sequence here and keep it idempotent.
    """
    _, result = request(
        "GET",
        "/access",
        token=token,
        query={
            "filter[role][_eq]": role_id,
            "filter[policy][_eq]": policy_id,
            "limit": 1,
            "fields": "id",
        },
    )
    if result.get("data"):
        return

    request(
        "POST",
        "/access",
        token=token,
        payload={"role": role_id, "policy": policy_id},
    )
    print("[ok]     policy attached to role")


def existing_permissions(token: str, policy_id: str) -> dict[tuple[str, str], str]:
    _, result = request(
        "GET",
        "/permissions",
        token=token,
        query={
            "filter[policy][_eq]": policy_id,
            "limit": -1,
            "fields": "id,collection,action",
        },
    )
    return {
        (row["collection"], row["action"]): row["id"]
        for row in result.get("data", [])
    }


def ensure_permissions(token: str, spec: RoleSpec, policy_id: str) -> None:
    existing = existing_permissions(token, policy_id)
    for rule in permissions_for(spec.key):
        key = (rule["collection"], rule["action"])
        payload = {"policy": policy_id, **rule}
        if key in existing:
            request(
                "PATCH",
                f"/permissions/{existing[key]}",
                token=token,
                payload=payload,
            )
            continue
        request("POST", "/permissions", token=token, payload=payload)
    print(f"[ok]     permissions {spec.name}")


def main() -> int:
    token = authenticate(load_env(ENV_PATH))
    print("Connected to Directus access-control API")
    for spec in ROLES:
        policy_id = ensure_policy(token, spec)
        ensure_role(token, spec, policy_id)
        ensure_permissions(token, spec, policy_id)
    print("[ok]     Public policy was not modified")
    print("Access-control bootstrap completed successfully.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ApiError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
