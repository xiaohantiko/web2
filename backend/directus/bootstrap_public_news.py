#!/usr/bin/env python3
"""Expose published news and enabled website content through Public policy.

The script is dependency-free and idempotent. It grants anonymous read access
to the minimum collections and fields required by the public website. Draft
articles, unreviewed translations, non-news uploads, users, inquiries, and all
write actions remain private.
"""

from __future__ import annotations

import sys
from typing import Any

from bootstrap_core_schema import ApiError, ENV_PATH, authenticate, load_env, request


PUBLIC_POLICY_ID = "abf8a154-5b1c-4a46-ac9c-7300570f4f17"
PROTECTED_COLLECTIONS = {
    "languages",
    "article_categories",
    "articles",
    "articles_translations",
    "directus_files",
    "site_settings",
    "site_pages",
    "site_sections",
    "site_section_items",
}


def get_public_policy(token: str) -> str:
    _, result = request(
        "GET",
        f"/policies/{PUBLIC_POLICY_ID}",
        token=token,
        query={"fields": "id,name,app_access,admin_access"},
    )
    policy = result.get("data") or {}
    if policy.get("id") != PUBLIC_POLICY_ID:
        raise RuntimeError("Directus Public policy could not be verified")
    if policy.get("app_access") or policy.get("admin_access"):
        raise RuntimeError("Refusing to modify a Public policy with app/admin access")
    return PUBLIC_POLICY_ID


def public_asset_folder_ids(token: str) -> list[str]:
    _, result = request(
        "GET",
        "/folders",
        token=token,
        query={"limit": -1, "fields": "id,name,parent"},
    )
    folders = result.get("data") or []

    root = next(
        (
            row
            for row in folders
            if row.get("name") == "辰泰官网素材" and row.get("parent") is None
        ),
        None,
    )
    if not root:
        raise RuntimeError("Missing File Library folder: 辰泰官网素材")

    allowed_names = {"新闻资讯", "全站内容"}
    allowed_roots = [
        row
        for row in folders
        if row.get("name") in allowed_names and row.get("parent") == root["id"]
    ]
    found_names = {row.get("name") for row in allowed_roots}
    missing = sorted(allowed_names - found_names)
    if missing:
        raise RuntimeError(
            "Missing File Library folder(s): "
            + ", ".join(f"辰泰官网素材/{name}" for name in missing)
        )

    selected = {row["id"] for row in allowed_roots}
    changed = True
    while changed:
        changed = False
        for row in folders:
            if row.get("parent") in selected and row.get("id") not in selected:
                selected.add(row["id"])
                changed = True
    return sorted(selected)


def public_rules(folder_ids: list[str]) -> list[dict[str, Any]]:
    return [
        {
            "collection": "site_settings",
            "action": "read",
            "permissions": {},
            "fields": [
                "id",
                "company_name_zh",
                "company_name_en",
                "short_name_zh",
                "short_name_en",
                "tagline_zh",
                "tagline_en",
                "summary_zh",
                "summary_en",
                "phone",
                "fax",
                "email",
                "contact_person",
                "address_zh",
                "address_en",
                "icp_number",
                "map_url",
                "logo_file",
                "wechat_qr_file",
                "footer_zh",
                "footer_en",
            ],
        },
        {
            "collection": "site_pages",
            "action": "read",
            "permissions": {},
            "fields": [
                "id",
                "key",
                "admin_label",
                "path",
                "enabled",
                "sort",
                "seo_title_zh",
                "seo_title_en",
                "seo_description_zh",
                "seo_description_en",
                "sections",
            ],
        },
        {
            "collection": "site_sections",
            "action": "read",
            "permissions": {},
            "fields": [
                "id",
                "page",
                "key",
                "admin_label",
                "dom_selector",
                "module_type",
                "enabled",
                "sort",
                "layout",
                "eyebrow_zh",
                "eyebrow_en",
                "title_zh",
                "title_en",
                "subtitle_zh",
                "subtitle_en",
                "body_zh",
                "body_en",
                "image_file",
                "secondary_image_file",
                "button_text_zh",
                "button_text_en",
                "button_url",
                "items",
            ],
        },
        {
            "collection": "site_section_items",
            "action": "read",
            "permissions": {},
            "fields": [
                "id",
                "section",
                "key",
                "admin_label",
                "enabled",
                "sort",
                "title_zh",
                "title_en",
                "subtitle_zh",
                "subtitle_en",
                "summary_zh",
                "summary_en",
                "body_zh",
                "body_en",
                "metric_value",
                "image_file",
                "link_url",
            ],
        },
        {
            "collection": "languages",
            "action": "read",
            "permissions": {"enabled": {"_eq": True}},
            "fields": ["code", "name", "direction", "enabled", "sort"],
        },
        {
            "collection": "article_categories",
            "action": "read",
            "permissions": {"enabled": {"_eq": True}},
            "fields": ["id", "key", "type", "enabled", "sort"],
        },
        {
            "collection": "articles",
            "action": "read",
            "permissions": {"status": {"_eq": "published"}},
            "fields": [
                "id",
                "status",
                "slug",
                "category",
                "cover_file",
                "article_date",
                "published_at",
                "featured",
                "sort",
                "translations",
            ],
        },
        {
            "collection": "articles_translations",
            "action": "read",
            "permissions": {
                "_and": [
                    {"article_id": {"status": {"_eq": "published"}}},
                    {"translation_status": {"_eq": "reviewed"}},
                ]
            },
            "fields": [
                "id",
                "article_id",
                "language_code",
                "title",
                "summary",
                "body",
                "translation_status",
            ],
        },
        {
            "collection": "directus_files",
            "action": "read",
            "permissions": {"folder": {"_in": folder_ids}},
            "fields": [
                "id",
                "storage",
                "filename_disk",
                "filename_download",
                "title",
                "type",
                "folder",
                "width",
                "height",
                "filesize",
                "metadata",
                "modified_on",
            ],
        },
    ]


def existing_permissions(token: str, policy_id: str) -> list[dict[str, Any]]:
    _, result = request(
        "GET",
        "/permissions",
        token=token,
        query={
            "filter[policy][_eq]": policy_id,
            "limit": -1,
            "fields": "id,collection,action,permissions,fields",
        },
    )
    return result.get("data") or []


def guard_against_public_writes(rows: list[dict[str, Any]]) -> None:
    unsafe = [
        f"{row.get('collection')}.{row.get('action')}"
        for row in rows
        if row.get("collection") in PROTECTED_COLLECTIONS
        and row.get("action") in {"create", "update", "delete"}
    ]
    if unsafe:
        raise RuntimeError(
            "Refusing to continue: Public write permissions already exist for "
            + ", ".join(sorted(unsafe))
        )


def ensure_read_permissions(token: str, policy_id: str, folder_ids: list[str]) -> None:
    rows = existing_permissions(token, policy_id)
    guard_against_public_writes(rows)
    existing = {
        (row.get("collection"), row.get("action")): row.get("id") for row in rows
    }

    for rule in public_rules(folder_ids):
        key = (rule["collection"], rule["action"])
        payload = {
            "policy": policy_id,
            **rule,
            "validation": None,
            "presets": None,
        }
        permission_id = existing.get(key)
        if permission_id:
            request(
                "PATCH",
                f"/permissions/{permission_id}",
                token=token,
                payload=payload,
            )
            print(f"[update] public read {rule['collection']}")
        else:
            request("POST", "/permissions", token=token, payload=payload)
            print(f"[ok]     public read {rule['collection']}")


def main() -> int:
    token = authenticate(load_env(ENV_PATH))
    print("Connected to Directus Public-policy API")
    policy_id = get_public_policy(token)
    folders = public_asset_folder_ids(token)
    ensure_read_permissions(token, policy_id, folders)
    print("[ok]     drafts and unreviewed translations remain private")
    print("[ok]     Public create/update/delete permissions were not added")
    print("Public website content bootstrap completed successfully.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ApiError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
