#!/usr/bin/env python3
"""Configure the Chentai Directus project for day-to-day content operators.

The core schema intentionally keeps content normalized. This follow-up script
adds the relational aliases and Data Studio metadata that make authoring feel
like a compact publishing form instead of a database editor. It also creates
the shared File Library folder tree used by article and certificate uploads.

The script is dependency-free, idempotent, and never changes Public access.
It only updates Directus metadata and creates virtual file folders; it does not
delete or rewrite content items or uploaded files.
"""

from __future__ import annotations

import sys
import urllib.parse
import uuid
from typing import Any

from bootstrap_core_schema import (
    ApiError,
    CONTENT_STATUS,
    ENV_PATH,
    TRANSLATION_STATUS,
    authenticate,
    load_env,
    request,
    zh,
)


IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
]

ARTICLE_TOOLBAR = [
    "undo",
    "redo",
    "bold",
    "italic",
    "underline",
    "h2",
    "h3",
    "alignleft",
    "aligncenter",
    "alignright",
    "bullist",
    "numlist",
    "blockquote",
    "customLink",
    "unlink",
    "customImage",
    "table",
    "hr",
    "removeformat",
    "fullscreen",
]


def stable_id(kind: str, key: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"https://cms.hebeict.cn/{kind}/{key}"))


COLLECTION_GROUPS = [
    {
        "collection": "content_operations",
        "label": "内容发布",
        "icon": "edit_note",
        "note": "新闻、行业资讯和技术服务内容",
        "sort": 1,
    },
    {
        "collection": "certificate_operations",
        "label": "资质荣誉",
        "icon": "workspace_premium",
        "note": "资质、专利、商标与荣誉证书",
        "sort": 2,
    },
    {
        "collection": "inquiry_operations",
        "label": "客户留言",
        "icon": "support_agent",
        "note": "客户留言、跟进备注和状态历史",
        "sort": 3,
    },
]


COLLECTION_META: dict[str, dict[str, Any]] = {
    "languages": {"hidden": True},
    "article_categories": {"hidden": True, "group": "content_operations"},
    "article_categories_translations": {
        "hidden": True,
        "group": "content_operations",
    },
    "articles": {
        "hidden": False,
        "group": "content_operations",
        "display_template": "{{article_date}} · {{slug}}",
    },
    "articles_translations": {"hidden": True, "group": "content_operations"},
    "certificate_categories": {
        "hidden": True,
        "group": "certificate_operations",
    },
    "certificate_categories_translations": {
        "hidden": True,
        "group": "certificate_operations",
    },
    "certificates": {
        "hidden": False,
        "group": "certificate_operations",
        "display_template": "{{certificate_no}}",
    },
    "certificates_translations": {
        "hidden": True,
        "group": "certificate_operations",
    },
    "certificate_placements": {
        "hidden": True,
        "group": "certificate_operations",
    },
    "inquiries": {"hidden": False, "group": "inquiry_operations"},
    "inquiry_notes": {"hidden": True, "group": "inquiry_operations"},
    "inquiry_status_history": {"hidden": True, "group": "inquiry_operations"},
}


FILE_FOLDER_TREE: dict[str, Any] = {
    "首页": {},
    "新闻资讯": {
        "公司新闻": {},
        "行业资讯": {},
        "技术服务": {},
    },
    "资质证书": {
        "企业资质": {},
        "体系认证": {},
        "许可与合格证": {},
        "发明专利": {},
        "实用新型专利": {},
        "商标": {},
        "研发机构": {},
        "荣誉奖项": {},
    },
    "业务领域": {},
    "工艺解决方案": {},
    "关于我们": {},
    "待整理": {},
}


TRANSLATION_INTERFACES = [
    (
        "article_categories",
        "article_categories_translations",
        "category_id",
        "分类中英文名称",
        5,
    ),
    ("articles", "articles_translations", "article_id", "中英文内容", 6),
    (
        "certificate_categories",
        "certificate_categories_translations",
        "category_id",
        "分类中英文名称",
        5,
    ),
    ("certificates", "certificates_translations", "certificate_id", "中英文信息", 5),
]


def collection_path(name: str) -> str:
    return urllib.parse.quote(name, safe="")


def ensure_collection_groups(token: str) -> None:
    _, result = request("GET", "/collections", token=token)
    existing = {
        row.get("collection")
        for row in result.get("data", [])
        if isinstance(row, dict)
    }

    for group in COLLECTION_GROUPS:
        name = group["collection"]
        meta = {
            "icon": group["icon"],
            "note": group["note"],
            "hidden": False,
            "singleton": False,
            "translations": zh(group["label"]),
            "sort": group["sort"],
        }
        if name in existing:
            request(
                "PATCH",
                f"/collections/{collection_path(name)}",
                token=token,
                payload={"meta": meta},
            )
            print(f"[update] collection group {group['label']}")
        else:
            request(
                "POST",
                "/collections",
                token=token,
                payload={"collection": name, "schema": None, "meta": meta},
            )
            print(f"[ok]     collection group {group['label']}")
            existing.add(name)


def configure_collection_navigation(token: str) -> None:
    for collection, meta in COLLECTION_META.items():
        request(
            "PATCH",
            f"/collections/{collection_path(collection)}",
            token=token,
            payload={"meta": meta},
        )
    print("[ok]     content navigation grouped and simplified")


def list_fields(token: str, collection: str) -> set[str]:
    _, result = request(
        "GET", f"/fields/{collection_path(collection)}", token=token
    )
    return {
        row.get("field")
        for row in result.get("data", [])
        if isinstance(row, dict) and row.get("field")
    }


def ensure_translation_interfaces(token: str) -> None:
    for parent, junction, reverse_field, label, sort in TRANSLATION_INTERFACES:
        if "translations" not in list_fields(token, parent):
            request(
                "POST",
                f"/fields/{collection_path(parent)}",
                token=token,
                payload={
                    "field": "translations",
                    "type": "alias",
                    "schema": None,
                    "meta": {
                        "special": ["translations"],
                        "interface": "translations",
                        "options": {
                            "languageField": "name",
                            "languageDirectionField": "direction",
                            "defaultLanguage": "zh-CN",
                            "defaultOpenSplitView": True,
                            "userLanguage": False,
                        },
                        "display": "translations",
                        "readonly": False,
                        "required": False,
                        "hidden": False,
                        "sort": sort,
                        "width": "full",
                        "translations": zh(label),
                        "note": "在同一表单中切换或对照编辑中文和英文",
                    },
                },
            )
            print(f"[ok]     translations interface {parent}.translations")
        else:
            request(
                "PATCH",
                f"/fields/{collection_path(parent)}/translations",
                token=token,
                payload={
                    "meta": {
                        "interface": "translations",
                        "options": {
                            "languageField": "name",
                            "languageDirectionField": "direction",
                            "defaultLanguage": "zh-CN",
                            "defaultOpenSplitView": True,
                            "userLanguage": False,
                        },
                        "hidden": False,
                        "sort": sort,
                        "width": "full",
                        "translations": zh(label),
                    }
                },
            )

        request(
            "PATCH",
            f"/relations/{collection_path(junction)}/{collection_path(reverse_field)}",
            token=token,
            payload={
                "meta": {
                    "one_field": "translations",
                    "junction_field": "language_code",
                }
            },
        )
        request(
            "PATCH",
            f"/relations/{collection_path(junction)}/language_code",
            token=token,
            payload={"meta": {"junction_field": reverse_field}},
        )
        # The parent foreign key is populated by Directus when the nested
        # translation is saved. Keeping it required in the hidden child form
        # makes new parent items fail client-side validation before that
        # automatic relation value can be injected.
        request(
            "PATCH",
            f"/fields/{collection_path(junction)}/{collection_path(reverse_field)}",
            token=token,
            payload={"meta": {"required": False, "hidden": True}},
        )
    print("[ok]     translation relations embedded in parent forms")


def ensure_certificate_placements_interface(token: str) -> None:
    if "placements" not in list_fields(token, "certificates"):
        request(
            "POST",
            "/fields/certificates",
            token=token,
            payload={
                "field": "placements",
                "type": "alias",
                "schema": None,
                "meta": {
                    "special": ["o2m"],
                    "interface": "list-o2m",
                    "options": {
                        "template": "{{placement}}",
                        "enableCreate": True,
                        "enableSelect": False,
                    },
                    "display": "related-values",
                    "readonly": False,
                    "required": False,
                    "hidden": False,
                    "sort": 10,
                    "width": "full",
                    "translations": zh("展示位置"),
                    "note": "选择证书需要出现的官网栏目，可添加多个位置",
                },
            },
        )
        print("[ok]     placements interface certificates.placements")

    request(
        "PATCH",
        "/relations/certificate_placements/certificate",
        token=token,
        payload={"meta": {"one_field": "placements"}},
    )


def ensure_folder(
    token: str,
    *,
    name: str,
    parent: str | None,
    key: str,
) -> str:
    query: dict[str, Any] = {
        "filter[name][_eq]": name,
        "limit": 1,
        "fields": "id,name,parent",
    }
    if parent is None:
        query["filter[parent][_null]"] = "true"
    else:
        query["filter[parent][_eq]"] = parent

    _, result = request("GET", "/folders", token=token, query=query)
    rows = result.get("data") or []
    if rows:
        return rows[0]["id"]

    folder_id = stable_id("file-folder", key)
    _, result = request(
        "POST",
        "/folders",
        token=token,
        payload={"id": folder_id, "name": name, "parent": parent},
    )
    print(f"[ok]     file folder {key}")
    return result.get("data", {}).get("id") or folder_id


def ensure_file_folders(token: str) -> dict[str, str]:
    folders: dict[str, str] = {}
    root_id = ensure_folder(
        token,
        name="辰泰官网素材",
        parent=None,
        key="辰泰官网素材",
    )
    folders["辰泰官网素材"] = root_id

    def walk(tree: dict[str, Any], parent_id: str, prefix: str) -> None:
        for name, children in tree.items():
            key = f"{prefix}/{name}"
            folder_id = ensure_folder(token, name=name, parent=parent_id, key=key)
            folders[key] = folder_id
            walk(children, folder_id, key)

    walk(FILE_FOLDER_TREE, root_id, "辰泰官网素材")
    print("[ok]     File Library folder tree ready")
    return folders


def field_meta(
    sort: int,
    *,
    width: str = "full",
    hidden: bool = False,
    readonly: bool | None = None,
    interface: str | None = None,
    options: dict[str, Any] | None = None,
    display: str | None = None,
    note: str | None = None,
) -> dict[str, Any]:
    meta: dict[str, Any] = {"sort": sort, "width": width, "hidden": hidden}
    if readonly is not None:
        meta["readonly"] = readonly
    if interface is not None:
        meta["interface"] = interface
    if options is not None:
        meta["options"] = options
    if display is not None:
        meta["display"] = display
    if note is not None:
        meta["note"] = note
    return meta


def localized_select_meta(
    sort: int,
    choices: list[tuple[str, str]],
    *,
    note: str | None = None,
) -> dict[str, Any]:
    return field_meta(
        sort,
        width="half",
        interface="select-dropdown",
        options={
            "choices": [
                {"text": label, "value": value}
                for value, label in choices
            ]
        },
        display="labels",
        note=note,
    )


def form_field_updates(folders: dict[str, str]) -> dict[str, dict[str, dict[str, Any]]]:
    news_folder = folders["辰泰官网素材/新闻资讯"]
    certificate_folder = folders["辰泰官网素材/资质证书"]

    return {
        "articles": {
            "status": localized_select_meta(
                1,
                CONTENT_STATUS,
                note="先保存为草稿，确认后再改为已发布",
            ),
            "category": field_meta(
                2,
                width="half",
                options={
                    "template": "{{translations.name}}",
                    "enableCreate": False,
                    "enableSelect": True,
                },
            ),
            "article_date": field_meta(3, width="half", note="新闻在官网显示的日期"),
            "featured": field_meta(4, width="half"),
            "cover_file": field_meta(
                5,
                interface="file-image",
                options={
                    "folder": news_folder,
                    "crop": True,
                    "enableCreate": True,
                    "enableSelect": True,
                    "allowedMimeTypes": IMAGE_MIME_TYPES,
                },
                note="可拖入 JPG、PNG、WebP 或 AVIF 图片，建议横版图片",
            ),
            "translations": field_meta(6),
            "slug": field_meta(
                7,
                options={
                    "slug": True,
                    "trim": True,
                    "placeholder": "例如：company-news-2026",
                },
                note="网页地址标识，请填写简短英文、拼音、数字或短横线，不能重复",
            ),
            "source_url": field_meta(8, note="转载内容可填写原始来源网址"),
            "published_at": field_meta(9, width="half", note="正式发布时填写；可暂时留空"),
            "sort": field_meta(10, width="half", hidden=True),
            "legacy_id": field_meta(11, hidden=True),
            "id": field_meta(90, hidden=True, readonly=True),
            "date_created": field_meta(91, hidden=True, readonly=True),
            "date_updated": field_meta(92, hidden=True, readonly=True),
        },
        "articles_translations": {
            "title": field_meta(1, note="新闻或文章标题"),
            "summary": field_meta(2, note="用于列表卡片和搜索摘要，建议一至两句话"),
            "body": field_meta(
                3,
                interface="input-rich-text-html",
                options={"toolbar": ARTICLE_TOOLBAR, "folder": news_folder},
                note="支持排版、链接、表格和正文图片上传",
            ),
            "translation_status": localized_select_meta(4, TRANSLATION_STATUS),
            "seo_title": field_meta(5, width="half", note="可留空，后续统一优化"),
            "seo_description": field_meta(6, note="可留空，后续统一优化"),
            "article_id": field_meta(90, hidden=True),
            "language_code": field_meta(91, hidden=True),
            "id": field_meta(92, hidden=True, readonly=True),
        },
        "certificates": {
            "status": localized_select_meta(
                1,
                CONTENT_STATUS,
                note="确认资料无误后再改为已发布",
            ),
            "category": field_meta(
                2,
                width="half",
                options={
                    "template": "{{translations.name}}",
                    "enableCreate": False,
                    "enableSelect": True,
                },
            ),
            "file": field_meta(
                3,
                interface="file-image",
                options={
                    "folder": certificate_folder,
                    "crop": False,
                    "letterbox": True,
                    "enableCreate": True,
                    "enableSelect": True,
                    "allowedMimeTypes": IMAGE_MIME_TYPES,
                },
                note="上传清晰、方向正确的证书扫描图或照片",
            ),
            "certificate_no": field_meta(4, width="half"),
            "claim_review_status": field_meta(5, width="half"),
            "translations": field_meta(6),
            "issue_date": field_meta(7, width="half"),
            "expiry_date": field_meta(8, width="half"),
            "slug": field_meta(
                9,
                options={
                    "slug": True,
                    "trim": True,
                    "placeholder": "例如：iso-9001-2026",
                },
                note="网页地址标识，请填写简短英文、拼音、数字或短横线，不能重复",
            ),
            "placements": field_meta(10),
            "published_at": field_meta(11, width="half", note="正式发布时填写；可暂时留空"),
            "sort": field_meta(12, width="half", hidden=True),
            "id": field_meta(90, hidden=True, readonly=True),
            "date_created": field_meta(91, hidden=True, readonly=True),
            "date_updated": field_meta(92, hidden=True, readonly=True),
        },
        "certificates_translations": {
            "title": field_meta(1, note="证书、专利、商标或荣誉的正式名称"),
            "issuer": field_meta(2),
            "summary": field_meta(3, note="可填写证书用途或简要说明"),
            "translation_status": localized_select_meta(4, TRANSLATION_STATUS),
            "certificate_id": field_meta(90, hidden=True),
            "language_code": field_meta(91, hidden=True),
            "id": field_meta(92, hidden=True, readonly=True),
        },
        "certificate_placements": {
            "placement": field_meta(1, width="half"),
            "featured": field_meta(2, width="half"),
            "sort": field_meta(3, width="half"),
            "certificate": field_meta(90, hidden=True),
            "id": field_meta(91, hidden=True, readonly=True),
        },
    }


def configure_forms(token: str, folders: dict[str, str]) -> None:
    for collection, fields in form_field_updates(folders).items():
        existing = list_fields(token, collection)
        missing = sorted(set(fields) - existing)
        if missing:
            raise RuntimeError(
                f"Expected fields are missing from {collection}: {', '.join(missing)}"
            )
        payload = [
            {"field": field, "meta": meta}
            for field, meta in fields.items()
        ]
        request(
            "PATCH",
            f"/fields/{collection_path(collection)}",
            token=token,
            payload=payload,
        )
        print(f"[ok]     operator form {collection}")


def main() -> int:
    token = authenticate(load_env(ENV_PATH))
    print("Connected to Directus editor-experience API")
    ensure_collection_groups(token)
    configure_collection_navigation(token)
    ensure_translation_interfaces(token)
    ensure_certificate_placements_interface(token)
    folders = ensure_file_folders(token)
    configure_forms(token, folders)
    print("[ok]     Public policy was not modified")
    print("Editor-experience bootstrap completed successfully.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ApiError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
