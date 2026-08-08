#!/usr/bin/env python3
"""Bootstrap the first production data model for the Chentai Directus CMS.

The script is intentionally dependency-free and idempotent. It authenticates
against the local Directus API with ADMIN_EMAIL / ADMIN_PASSWORD from the
server-side .env file, creates missing collections and relations, and seeds
the language and category reference data.

It never prints credentials or the Directus access token.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path
from typing import Any


API_URL = os.environ.get("DIRECTUS_LOCAL_URL", "http://127.0.0.1:8055").rstrip("/")
ENV_PATH = Path(os.environ.get("CHENTAI_ENV_FILE", "/opt/chentai-cms/.env"))


class ApiError(RuntimeError):
    def __init__(self, method: str, path: str, status: int, detail: str):
        super().__init__(f"{method} {path} failed ({status}): {detail}")
        self.status = status


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        values[key.strip()] = value
    return values


def request(
    method: str,
    path: str,
    *,
    token: str | None = None,
    payload: Any | None = None,
    query: dict[str, Any] | None = None,
) -> tuple[int, Any]:
    url = f"{API_URL}{path}"
    if query:
        url += "?" + urllib.parse.urlencode(query)

    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            body = response.read()
            return response.status, json.loads(body) if body else None
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(raw)
            errors = parsed.get("errors") or []
            detail = "; ".join(
                str(item.get("message", item)) if isinstance(item, dict) else str(item)
                for item in errors
            ) or raw
        except json.JSONDecodeError:
            detail = raw
        raise ApiError(method, path, exc.code, detail[:1000]) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Cannot connect to Directus at {API_URL}: {exc.reason}") from exc


def zh(name: str, english: str | None = None) -> list[dict[str, str]]:
    result = [{"language": "zh-CN", "translation": name}]
    if english:
        result.append({"language": "en-US", "translation": english})
    return result


def field_meta(
    label: str,
    *,
    interface: str | None = "input",
    required: bool = False,
    readonly: bool = False,
    hidden: bool = False,
    width: str = "full",
    special: list[str] | None = None,
    options: dict[str, Any] | None = None,
    note: str | None = None,
    display: str | None = None,
) -> dict[str, Any]:
    return {
        "interface": interface,
        "required": required,
        "readonly": readonly,
        "hidden": hidden,
        "width": width,
        "special": special,
        "options": options,
        "note": note,
        "display": display,
        "translations": zh(label),
    }


def uuid_pk() -> dict[str, Any]:
    return {
        "field": "id",
        "type": "uuid",
        "meta": field_meta("编号", readonly=True, hidden=True, special=["uuid"]),
        "schema": {"is_primary_key": True, "is_nullable": False},
    }


def string_pk(field: str, label: str, max_length: int = 64) -> dict[str, Any]:
    return {
        "field": field,
        "type": "string",
        "meta": field_meta(label, required=True),
        "schema": {
            "is_primary_key": True,
            "is_nullable": False,
            "max_length": max_length,
        },
    }


def string_field(
    field: str,
    label: str,
    *,
    required: bool = False,
    default: str | None = None,
    unique: bool = False,
    max_length: int = 255,
    width: str = "full",
    note: str | None = None,
) -> dict[str, Any]:
    return {
        "field": field,
        "type": "string",
        "meta": field_meta(label, required=required, width=width, note=note),
        "schema": {
            "is_nullable": not required,
            "is_unique": unique,
            "default_value": default,
            "max_length": max_length,
        },
    }


def select_field(
    field: str,
    label: str,
    choices: list[tuple[str, str]],
    *,
    default: str,
    required: bool = True,
    width: str = "half",
) -> dict[str, Any]:
    return {
        "field": field,
        "type": "string",
        "meta": field_meta(
            label,
            interface="select-dropdown",
            required=required,
            width=width,
            options={
                "choices": [{"text": text, "value": value} for value, text in choices]
            },
            display="labels",
        ),
        "schema": {
            "is_nullable": not required,
            "default_value": default,
            "max_length": 64,
        },
    }


def text_field(
    field: str,
    label: str,
    *,
    required: bool = False,
    rich: bool = False,
    note: str | None = None,
) -> dict[str, Any]:
    return {
        "field": field,
        "type": "text",
        "meta": field_meta(
            label,
            interface="input-rich-text-html" if rich else "input-multiline",
            required=required,
            note=note,
        ),
        "schema": {"is_nullable": not required},
    }


def integer_field(
    field: str, label: str, *, default: int | None = None, width: str = "half"
) -> dict[str, Any]:
    return {
        "field": field,
        "type": "integer",
        "meta": field_meta(label, interface="input", width=width),
        "schema": {"is_nullable": True, "default_value": default},
    }


def boolean_field(field: str, label: str, *, default: bool = False) -> dict[str, Any]:
    return {
        "field": field,
        "type": "boolean",
        "meta": field_meta(label, interface="boolean", width="half"),
        "schema": {"is_nullable": False, "default_value": default},
    }


def date_field(field: str, label: str, *, width: str = "half") -> dict[str, Any]:
    return {
        "field": field,
        "type": "date",
        "meta": field_meta(label, interface="datetime", width=width),
        "schema": {"is_nullable": True},
    }


def timestamp_field(
    field: str,
    label: str,
    *,
    special: str | None = None,
    readonly: bool = False,
    hidden: bool = False,
) -> dict[str, Any]:
    return {
        "field": field,
        "type": "timestamp",
        "meta": field_meta(
            label,
            interface="datetime",
            width="half",
            readonly=readonly,
            hidden=hidden,
            special=[special] if special else None,
        ),
        "schema": {"is_nullable": True},
    }


def decimal_field(field: str, label: str) -> dict[str, Any]:
    return {
        "field": field,
        "type": "decimal",
        "meta": field_meta(label, interface="input", width="half"),
        "schema": {"is_nullable": True, "numeric_precision": 10, "numeric_scale": 2},
    }


def m2o_field(
    field: str,
    label: str,
    *,
    data_type: str = "uuid",
    required: bool = False,
    file_interface: bool = False,
    hidden: bool = False,
) -> dict[str, Any]:
    return {
        "field": field,
        "type": data_type,
        "meta": field_meta(
            label,
            interface="file-image" if file_interface else "select-dropdown-m2o",
            required=required,
            hidden=hidden,
            width="half",
            special=["file"] if file_interface else ["m2o"],
            display="image" if file_interface else "related-values",
        ),
        "schema": {"is_nullable": not required},
    }


CONTENT_STATUS = [
    ("draft", "草稿"),
    ("in_review", "待审核"),
    ("published", "已发布"),
    ("archived", "已归档"),
]

TRANSLATION_STATUS = [
    ("missing", "缺失"),
    ("draft", "草稿"),
    ("reviewed", "已校对"),
]

INQUIRY_STATUS = [
    ("new", "新留言"),
    ("assigned", "已分派"),
    ("contacted", "已联系"),
    ("follow_up", "跟进中"),
    ("completed", "已完成"),
    ("invalid", "无效"),
    ("spam", "垃圾留言"),
]


def common_content_fields(*, slug: bool = True) -> list[dict[str, Any]]:
    fields = [
        uuid_pk(),
        select_field("status", "状态", CONTENT_STATUS, default="draft"),
        integer_field("sort", "排序", default=0),
    ]
    if slug:
        fields.append(
            string_field("slug", "URL标识", required=True, unique=True, max_length=160)
        )
    fields.extend(
        [
            timestamp_field("published_at", "发布时间"),
            timestamp_field(
                "date_created", "创建时间", special="date-created", readonly=True, hidden=True
            ),
            timestamp_field(
                "date_updated", "更新时间", special="date-updated", readonly=True, hidden=True
            ),
        ]
    )
    return fields


def collection(
    name: str,
    label: str,
    icon: str,
    fields: list[dict[str, Any]],
    *,
    note: str,
    display_template: str | None = None,
    sort: int,
    hidden: bool = False,
    singleton: bool = False,
) -> dict[str, Any]:
    field_names = {item["field"] for item in fields}
    meta: dict[str, Any] = {
        "icon": icon,
        "note": note,
        "hidden": hidden,
        "singleton": singleton,
        "translations": zh(label),
        "display_template": display_template,
        "accountability": "all",
        "sort": sort,
    }
    if "status" in field_names:
        meta.update(
            {
                "archive_field": "status",
                "archive_value": "archived",
                "unarchive_value": "draft",
                "archive_app_filter": True,
            }
        )
    if "sort" in field_names:
        meta["sort_field"] = "sort"
    return {
        "collection": name,
        "schema": {"name": name},
        "meta": meta,
        "fields": fields,
    }


def schema_definitions() -> list[dict[str, Any]]:
    definitions: list[dict[str, Any]] = []

    definitions.append(
        collection(
            "languages",
            "内容语言",
            "translate",
            [
                string_pk("code", "语言代码", 16),
                string_field("name", "语言名称", required=True, max_length=80),
                select_field(
                    "direction",
                    "文字方向",
                    [("ltr", "从左到右"), ("rtl", "从右到左")],
                    default="ltr",
                ),
                boolean_field("enabled", "启用", default=True),
                integer_field("sort", "排序", default=0),
            ],
            note="网站中英文内容使用的语言列表",
            display_template="{{name}} ({{code}})",
            sort=1,
        )
    )

    definitions.append(
        collection(
            "article_categories",
            "文章分类",
            "category",
            [
                uuid_pk(),
                string_field("key", "分类标识", required=True, unique=True, max_length=80),
                select_field(
                    "type",
                    "分类类型",
                    [
                        ("news", "新闻"),
                        ("industry", "行业资讯"),
                        ("technical", "技术服务"),
                    ],
                    default="news",
                ),
                boolean_field("enabled", "启用", default=True),
                integer_field("sort", "排序", default=0),
            ],
            note="新闻资讯、行业资讯和技术服务分类",
            display_template="{{key}}",
            sort=10,
        )
    )

    definitions.append(
        collection(
            "article_categories_translations",
            "文章分类翻译",
            "translate",
            [
                m2o_field("category_id", "文章分类", required=True),
                m2o_field(
                    "language_code", "语言", data_type="string", required=True
                ),
                string_field("name", "分类名称", required=True),
                text_field("description", "分类说明"),
                select_field(
                    "translation_status",
                    "翻译状态",
                    TRANSLATION_STATUS,
                    default="draft",
                ),
            ],
            note="文章分类的中英文名称",
            display_template="{{name}}",
            sort=11,
        )
    )

    article_fields = common_content_fields()
    article_fields[3:3] = [
        m2o_field("category", "文章分类", required=True),
        m2o_field("cover_file", "封面图片", file_interface=True),
        date_field("article_date", "文章日期"),
        string_field("source_url", "来源链接", max_length=500),
        string_field("legacy_id", "旧站编号", max_length=120),
        boolean_field("featured", "推荐", default=False),
    ]
    definitions.append(
        collection(
            "articles",
            "文章管理",
            "article",
            article_fields,
            note="公司新闻、行业资讯和技术服务文章",
            display_template="{{slug}}",
            sort=12,
        )
    )

    definitions.append(
        collection(
            "articles_translations",
            "文章翻译",
            "translate",
            [
                m2o_field("article_id", "文章", required=True),
                m2o_field(
                    "language_code", "语言", data_type="string", required=True
                ),
                string_field("title", "标题", required=True, max_length=300),
                text_field("summary", "摘要"),
                text_field("body", "正文", rich=True),
                string_field("seo_title", "SEO标题", max_length=300),
                text_field("seo_description", "SEO描述"),
                select_field(
                    "translation_status",
                    "翻译状态",
                    TRANSLATION_STATUS,
                    default="draft",
                ),
            ],
            note="文章的中文和英文内容",
            display_template="{{title}}",
            sort=13,
        )
    )

    definitions.append(
        collection(
            "certificate_categories",
            "证书分类",
            "workspace_premium",
            [
                uuid_pk(),
                string_field("key", "分类标识", required=True, unique=True, max_length=100),
                select_field("status", "状态", CONTENT_STATUS, default="draft"),
                integer_field("sort", "排序", default=0),
            ],
            note="企业资质、体系认证、专利和荣誉分类",
            display_template="{{key}}",
            sort=20,
        )
    )

    definitions.append(
        collection(
            "certificate_categories_translations",
            "证书分类翻译",
            "translate",
            [
                m2o_field("category_id", "证书分类", required=True),
                m2o_field(
                    "language_code", "语言", data_type="string", required=True
                ),
                string_field("name", "分类名称", required=True),
                text_field("description", "分类说明"),
                select_field(
                    "translation_status",
                    "翻译状态",
                    TRANSLATION_STATUS,
                    default="draft",
                ),
            ],
            note="证书分类的中英文名称",
            display_template="{{name}}",
            sort=21,
        )
    )

    certificate_fields = common_content_fields()
    certificate_fields[3:3] = [
        m2o_field("category", "证书分类", required=True),
        string_field("certificate_no", "证书编号", max_length=160),
        date_field("issue_date", "签发日期"),
        date_field("expiry_date", "到期日期"),
        m2o_field("file", "证书文件", file_interface=True, required=True),
        select_field(
            "claim_review_status",
            "材料审核状态",
            [
                ("pending", "待审核"),
                ("verified", "已核实"),
                ("private", "不公开"),
            ],
            default="pending",
        ),
    ]
    definitions.append(
        collection(
            "certificates",
            "资质证书",
            "verified",
            certificate_fields,
            note="统一管理资质、专利、商标和荣誉证书",
            display_template="{{certificate_no}}",
            sort=22,
        )
    )

    definitions.append(
        collection(
            "certificates_translations",
            "证书翻译",
            "translate",
            [
                m2o_field("certificate_id", "证书", required=True),
                m2o_field(
                    "language_code", "语言", data_type="string", required=True
                ),
                string_field("title", "证书名称", required=True, max_length=300),
                string_field("issuer", "签发机构", max_length=300),
                text_field("summary", "说明"),
                select_field(
                    "translation_status",
                    "翻译状态",
                    TRANSLATION_STATUS,
                    default="draft",
                ),
            ],
            note="证书的中文和英文名称及说明",
            display_template="{{title}}",
            sort=23,
        )
    )

    definitions.append(
        collection(
            "certificate_placements",
            "证书展示位置",
            "grid_view",
            [
                m2o_field("certificate", "证书", required=True),
                select_field(
                    "placement",
                    "展示栏目",
                    [
                        ("about", "关于我们"),
                        ("innovation", "科研创新"),
                        ("qualifications", "资质荣誉"),
                    ],
                    default="qualifications",
                ),
                integer_field("sort", "排序", default=0),
                boolean_field("featured", "精选", default=False),
            ],
            note="同一证书可分配到多个公开页面",
            display_template="{{placement}}",
            sort=24,
        )
    )

    inquiry_fields = [
        uuid_pk(),
        string_field("inquiry_no", "留言编号", unique=True, max_length=80),
        select_field("status", "处理状态", INQUIRY_STATUS, default="new"),
        select_field(
            "priority",
            "优先级",
            [("low", "低"), ("normal", "普通"), ("high", "高"), ("urgent", "紧急")],
            default="normal",
        ),
        m2o_field("assigned_to", "负责人"),
        string_field("name", "联系人", required=True, max_length=120),
        string_field("company", "公司名称", max_length=200),
        string_field("phone", "联系电话", required=True, max_length=80),
        string_field("email", "电子邮箱", max_length=200),
        string_field("industry", "所属行业", max_length=160),
        string_field("medium", "废气或溶剂类型", max_length=200),
        string_field("flow_rate", "处理风量或产能", max_length=160),
        text_field("attachment_note", "资料说明"),
        text_field("need", "需求说明", required=True),
        string_field("source_page", "提交页面", max_length=300),
        string_field("language", "提交语言", max_length=16),
        string_field("utm_source", "UTM来源", max_length=160),
        string_field("utm_medium", "UTM媒介", max_length=160),
        string_field("utm_campaign", "UTM活动", max_length=160),
        boolean_field("consent", "同意隐私条款", default=False),
        decimal_field("spam_score", "反垃圾评分"),
        select_field(
            "notification_status",
            "通知状态",
            [("pending", "待发送"), ("sent", "已发送"), ("failed", "发送失败")],
            default="pending",
        ),
        timestamp_field("last_contacted_at", "最近联系时间"),
        timestamp_field("completed_at", "完成时间"),
        timestamp_field(
            "date_created", "提交时间", special="date-created", readonly=True
        ),
        timestamp_field(
            "date_updated", "更新时间", special="date-updated", readonly=True, hidden=True
        ),
    ]
    definitions.append(
        collection(
            "inquiries",
            "客户留言",
            "contact_support",
            inquiry_fields,
            note="客户咨询、分派和处理状态；严禁开放公共读取权限",
            display_template="{{inquiry_no}} · {{name}} · {{company}}",
            sort=30,
        )
    )

    definitions.append(
        collection(
            "inquiry_notes",
            "留言跟进备注",
            "sticky_note_2",
            [
                m2o_field("inquiry", "客户留言", required=True),
                text_field("note", "跟进内容", required=True),
                select_field(
                    "note_type",
                    "备注类型",
                    [
                        ("internal", "内部备注"),
                        ("call", "电话记录"),
                        ("email", "邮件记录"),
                        ("visit", "拜访记录"),
                    ],
                    default="internal",
                ),
                m2o_field("created_by", "记录人", hidden=True),
                timestamp_field(
                    "created_at", "记录时间", special="date-created", readonly=True
                ),
            ],
            note="留言客服的联系记录和内部备注",
            display_template="{{note_type}} · {{created_at}}",
            sort=31,
        )
    )

    definitions.append(
        collection(
            "inquiry_status_history",
            "留言状态历史",
            "history",
            [
                m2o_field("inquiry", "客户留言", required=True),
                select_field(
                    "from_status", "原状态", INQUIRY_STATUS, default="new", required=False
                ),
                select_field("to_status", "新状态", INQUIRY_STATUS, default="new"),
                m2o_field("changed_by", "操作人", hidden=True),
                timestamp_field(
                    "changed_at", "变更时间", special="date-created", readonly=True
                ),
            ],
            note="客户留言状态变更的审计记录",
            display_template="{{from_status}} → {{to_status}}",
            sort=32,
        )
    )

    return definitions


RELATIONS: list[tuple[str, str, str, str, str]] = [
    ("article_categories_translations", "category_id", "article_categories", "id", "CASCADE"),
    ("article_categories_translations", "language_code", "languages", "code", "CASCADE"),
    ("articles", "category", "article_categories", "id", "RESTRICT"),
    ("articles", "cover_file", "directus_files", "id", "SET NULL"),
    ("articles_translations", "article_id", "articles", "id", "CASCADE"),
    ("articles_translations", "language_code", "languages", "code", "CASCADE"),
    ("certificate_categories_translations", "category_id", "certificate_categories", "id", "CASCADE"),
    ("certificate_categories_translations", "language_code", "languages", "code", "CASCADE"),
    ("certificates", "category", "certificate_categories", "id", "RESTRICT"),
    ("certificates", "file", "directus_files", "id", "RESTRICT"),
    ("certificates_translations", "certificate_id", "certificates", "id", "CASCADE"),
    ("certificates_translations", "language_code", "languages", "code", "CASCADE"),
    ("certificate_placements", "certificate", "certificates", "id", "CASCADE"),
    ("inquiries", "assigned_to", "directus_users", "id", "SET NULL"),
    ("inquiry_notes", "inquiry", "inquiries", "id", "CASCADE"),
    ("inquiry_notes", "created_by", "directus_users", "id", "SET NULL"),
    ("inquiry_status_history", "inquiry", "inquiries", "id", "CASCADE"),
    ("inquiry_status_history", "changed_by", "directus_users", "id", "SET NULL"),
]


def authenticate(env: dict[str, str]) -> str:
    email = os.environ.get("ADMIN_EMAIL") or env.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD") or env.get("ADMIN_PASSWORD")
    if not email or not password:
        raise RuntimeError(
            f"ADMIN_EMAIL / ADMIN_PASSWORD were not found in environment or {ENV_PATH}"
        )
    _, result = request(
        "POST", "/auth/login", payload={"email": email, "password": password}
    )
    token = result.get("data", {}).get("access_token")
    if not token:
        raise RuntimeError("Directus login succeeded but no access token was returned")
    return token


def exists(token: str, path: str) -> bool:
    try:
        request("GET", path, token=token)
        return True
    except ApiError as exc:
        if exc.status == 404:
            return False
        raise


def create_collections(token: str) -> None:
    for definition in schema_definitions():
        name = definition["collection"]
        if exists(token, f"/collections/{urllib.parse.quote(name)}"):
            print(f"[skip] collection {name}")
            continue
        request("POST", "/collections", token=token, payload=definition)
        print(f"[ok]   collection {name}")


def create_relations(token: str) -> None:
    for collection_name, field, related, related_field, on_delete in RELATIONS:
        relation_path = (
            f"/relations/{urllib.parse.quote(collection_name)}/{urllib.parse.quote(field)}"
        )
        if exists(token, relation_path):
            print(f"[skip] relation {collection_name}.{field} -> {related}.{related_field}")
            continue
        payload = {
            "collection": collection_name,
            "field": field,
            "related_collection": related,
            "schema": {
                "table": collection_name,
                "column": field,
                "foreign_key_table": related,
                "foreign_key_column": related_field,
                "on_update": "NO ACTION",
                "on_delete": on_delete,
            },
            "meta": {
                "many_collection": collection_name,
                "many_field": field,
                "one_collection": related,
                "one_field": None,
                "one_deselect_action": "delete" if on_delete == "CASCADE" else "nullify",
            },
        }
        request("POST", "/relations", token=token, payload=payload)
        print(f"[ok]   relation {collection_name}.{field} -> {related}.{related_field}")


def deterministic_id(kind: str, key: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"https://cms.hebeict.cn/{kind}/{key}"))


def item_exists(token: str, collection_name: str, field: str, value: str) -> bool:
    _, result = request(
        "GET",
        f"/items/{urllib.parse.quote(collection_name)}",
        token=token,
        query={f"filter[{field}][_eq]": value, "limit": 1, "fields": field},
    )
    return bool(result.get("data"))


def create_item_if_missing(
    token: str,
    collection_name: str,
    lookup_field: str,
    lookup_value: str,
    payload: dict[str, Any],
) -> None:
    if item_exists(token, collection_name, lookup_field, lookup_value):
        return
    request(
        "POST",
        f"/items/{urllib.parse.quote(collection_name)}",
        token=token,
        payload=payload,
    )


def seed_reference_data(token: str) -> None:
    for item in [
        {"code": "zh-CN", "name": "简体中文", "direction": "ltr", "enabled": True, "sort": 1},
        {"code": "en-US", "name": "English", "direction": "ltr", "enabled": True, "sort": 2},
    ]:
        create_item_if_missing(token, "languages", "code", item["code"], item)

    article_categories = [
        ("company-news", "news", 1, "新闻资讯", "Company News"),
        ("industry-news", "industry", 2, "行业资讯", "Industry News"),
        ("technical-service", "technical", 3, "技术服务", "Technical Services"),
    ]
    for key, category_type, sort, cn_name, en_name in article_categories:
        category_id = deterministic_id("article-category", key)
        create_item_if_missing(
            token,
            "article_categories",
            "key",
            key,
            {"id": category_id, "key": key, "type": category_type, "enabled": True, "sort": sort},
        )
        for language_code, name in [("zh-CN", cn_name), ("en-US", en_name)]:
            _, result = request(
                "GET",
                "/items/article_categories_translations",
                token=token,
                query={
                    "filter[category_id][_eq]": category_id,
                    "filter[language_code][_eq]": language_code,
                    "limit": 1,
                    "fields": "id",
                },
            )
            if not result.get("data"):
                request(
                    "POST",
                    "/items/article_categories_translations",
                    token=token,
                    payload={
                        "category_id": category_id,
                        "language_code": language_code,
                        "name": name,
                        "translation_status": "reviewed",
                    },
                )

    certificate_categories = [
        ("enterprise-qualification", "企业资质", "Enterprise Qualifications"),
        ("management-system", "体系认证", "Management Systems"),
        ("license", "许可与合格证", "Licenses and Certificates"),
        ("invention-patent", "发明专利", "Invention Patents"),
        ("utility-patent", "实用新型专利", "Utility Model Patents"),
        ("trademark", "商标", "Trademarks"),
        ("research-institution", "研发机构", "Research Institutions"),
        ("honor", "荣誉奖项", "Honors and Awards"),
    ]
    for sort, (key, cn_name, en_name) in enumerate(certificate_categories, start=1):
        category_id = deterministic_id("certificate-category", key)
        create_item_if_missing(
            token,
            "certificate_categories",
            "key",
            key,
            {"id": category_id, "key": key, "status": "published", "sort": sort},
        )
        for language_code, name in [("zh-CN", cn_name), ("en-US", en_name)]:
            # Each new category receives its Chinese row first. A composite uniqueness
            # constraint is added in the follow-up schema hardening step.
            _, result = request(
                "GET",
                "/items/certificate_categories_translations",
                token=token,
                query={
                    "filter[category_id][_eq]": category_id,
                    "filter[language_code][_eq]": language_code,
                    "limit": 1,
                    "fields": "id",
                },
            )
            if not result.get("data"):
                request(
                    "POST",
                    "/items/certificate_categories_translations",
                    token=token,
                    payload={
                        "category_id": category_id,
                        "language_code": language_code,
                        "name": name,
                        "translation_status": "reviewed",
                    },
                )

    print("[ok]   reference data seeded")


def main() -> int:
    env = load_env(ENV_PATH)
    token = authenticate(env)
    print(f"Connected to Directus at {API_URL}")
    create_collections(token)
    create_relations(token)
    seed_reference_data(token)
    print("Core schema bootstrap completed successfully.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ApiError, RuntimeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
