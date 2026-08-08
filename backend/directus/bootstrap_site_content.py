#!/usr/bin/env python3
"""Create the operator-friendly full-site content model for Chentai.

The public website keeps its current HTML as a resilient fallback. Directus
provides global settings plus page modules that can override existing sections
or add new ones. Operators only see two entries: Global Settings and Page
Management. Technical child collections stay hidden and are edited inline.
"""

from __future__ import annotations

import sys
import urllib.parse
from typing import Any

from bootstrap_core_schema import (
    ApiError,
    ENV_PATH,
    authenticate,
    boolean_field,
    collection,
    deterministic_id,
    integer_field,
    load_env,
    m2o_field,
    request,
    select_field,
    string_field,
    text_field,
    uuid_pk,
    zh,
)
from bootstrap_editor_experience import ensure_folder


GROUP = {
    "collection": "website_management",
    "label": "网站内容",
    "icon": "web",
    "note": "全站设置与各页面内容模块",
}

MODULE_TYPES = [
    ("hero", "页面标题"),
    ("text_image", "图文模块"),
    ("cards", "卡片列表"),
    ("metrics", "数据指标"),
    ("gallery", "图片展示"),
    ("contact", "联系信息"),
    ("custom", "自定义内容"),
]

LAYOUTS = [
    ("inherit", "保持当前排版"),
    ("image_left", "图片在左"),
    ("image_right", "图片在右"),
    ("centered", "居中排版"),
    ("grid", "网格排版"),
    ("full_width", "通栏排版"),
]


PAGES = [
    ("home", "网站首页", "index.html", 1),
    ("profile", "关于我们", "profile.html", 2),
    ("news", "新闻资讯", "news.html", 3),
    ("innovation", "科研创新", "innovation.html", 4),
    ("industries", "业务领域", "industries.html", 5),
    ("solutions", "工艺解决方案", "solutions.html", 6),
    ("products", "产品体系", "products.html", 7),
    ("qualifications", "资质荣誉", "qualifications.html", 8),
    ("inquiry", "客户咨询", "inquiry.html", 9),
]


SECTION_SEEDS: list[dict[str, Any]] = [
    # Homepage
    {"page": "home", "key": "home.hero", "label": "首屏主视觉", "selector": ".hero", "type": "hero", "title_zh": "资源循环利用一体化工艺技术供应商", "subtitle_zh": "化工行业节能降耗专家", "body_zh": "聚焦化工、新能源、新材料等行业精馏分离提纯、含硫化氢尾气治理及硫回收工艺、有机尾气治理等，为客户提供技术咨询、工程设计、设备制造、安装调试和售后服务。"},
    {"page": "home", "key": "home.capabilities", "label": "核心能力", "selector": "#capabilities", "type": "cards", "title_zh": "核心能力", "body_zh": "精馏分离、溶剂回收、尾气治理、装备制造，进入详情页查看完整工艺。"},
    {"page": "home", "key": "home.delivery", "label": "工程交付", "selector": "#delivery", "type": "cards", "title_zh": "工程交付", "body_zh": "从实验验证、工艺设计到设备制造、安装调试，按项目链路推进。"},
    {"page": "home", "key": "home.industries", "label": "业务领域", "selector": "#industries", "type": "cards", "title_zh": "业务领域", "body_zh": "覆盖化工、医药、新能源、新材料项目，详情页展开行业应用。"},
    {"page": "home", "key": "home.news", "label": "新闻资讯", "selector": "#news", "type": "cards", "title_zh": "新闻资讯", "body_zh": "展示公司动态与行业观察，完整内容进入新闻资讯页查看。"},
    {"page": "home", "key": "home.contact", "label": "联系我们", "selector": "#contact", "type": "contact", "title_zh": "联系我们", "body_zh": "欢迎围绕有机尾气治理、溶剂回收、液相分离和精馏节能改造需求进行项目咨询。"},

    # Company profile
    {"page": "profile", "key": "profile.hero", "label": "页面标题", "selector": ".profile-hero", "type": "hero", "title_zh": "关于我们"},
    {"page": "profile", "key": "profile.overview", "label": "公司简介", "selector": "#company-overview", "type": "text_image", "title_zh": "资源循环利用一体化供应商"},
    {"page": "profile", "key": "profile.rd", "label": "技术研发中心", "selector": "#rd-center", "type": "text_image", "title_zh": "技术研发中心"},
    {"page": "profile", "key": "profile.manufacturing", "label": "智能制造", "selector": "#smart-manufacturing", "type": "text_image", "title_zh": "智能化高端加工设备"},
    {"page": "profile", "key": "profile.subsidiaries", "label": "子公司介绍", "selector": "#subsidiaries", "type": "cards", "title_zh": "子公司介绍"},
    {"page": "profile", "key": "profile.honors", "label": "资质荣誉", "selector": "#quality-system", "type": "cards", "title_zh": "资质荣誉"},
    {"page": "profile", "key": "profile.history", "label": "发展进程", "selector": "#company-history", "type": "cards", "title_zh": "发展进程"},

    # News page (individual articles remain in the dedicated News collection)
    {"page": "news", "key": "news.hero", "label": "页面标题", "selector": ".news-hero", "type": "hero", "title_zh": "新闻资讯"},

    # Innovation
    {"page": "innovation", "key": "innovation.hero", "label": "页面标题", "selector": ".innovation-hero", "type": "hero", "title_zh": "科研创新"},
    {"page": "innovation", "key": "innovation.team", "label": "科技团队建设", "selector": "#research-team", "type": "text_image", "title_zh": "科技团队建设"},
    {"page": "innovation", "key": "innovation.process", "label": "流程设计", "selector": "#research-process", "type": "text_image", "title_zh": "流程设计：全链条闭环研发，精准高效可控"},
    {"page": "innovation", "key": "innovation.cooperation", "label": "校企合作", "selector": "#university-cooperation", "type": "cards", "title_zh": "校企合作：产学研深度融合，技术协同创新"},
    {"page": "innovation", "key": "innovation.infrastructure", "label": "研发基础设施", "selector": "#research-infrastructure", "type": "gallery", "title_zh": "研发基础设施介绍"},
    {"page": "innovation", "key": "innovation.results", "label": "研发成果", "selector": "#research-results", "type": "gallery", "title_zh": "研发成果展示"},

    # Industries
    {"page": "industries", "key": "industries.hero", "label": "页面标题", "selector": ".industries-hero", "type": "hero", "title_zh": "业务领域"},
    {"page": "industries", "key": "industries.pharma", "label": "医药行业", "selector": "#pharma", "type": "text_image", "title_zh": "医药行业"},
    {"page": "industries", "key": "industries.chemical", "label": "化工行业", "selector": "#chemical", "type": "text_image", "title_zh": "化工行业"},
    {"page": "industries", "key": "industries.energy", "label": "新能源行业", "selector": "#energy", "type": "text_image", "title_zh": "新能源行业"},
    {"page": "industries", "key": "industries.materials", "label": "新材料行业", "selector": "#materials", "type": "text_image", "title_zh": "新材料行业"},

    # Process solutions
    {"page": "solutions", "key": "solutions.hero", "label": "页面标题", "selector": ".solutions-hero", "type": "hero", "title_zh": "工艺解决方案"},
    {"page": "solutions", "key": "solutions.distillation", "label": "精馏分离技术", "selector": "#solution-distillation", "type": "text_image", "title_zh": "精馏分离技术及装置"},
    {"page": "solutions", "key": "solutions.h2s", "label": "硫化氢治理", "selector": "#solution-h2s", "type": "text_image", "title_zh": "硫化氢尾气综合治理与硫回收技术及装置"},
    {"page": "solutions", "key": "solutions.vocs", "label": "VOCs回收治理", "selector": "#solution-vocs", "type": "text_image", "title_zh": "VOCs尾气回收治理与颗粒活性炭VPS回收装置"},
    {"page": "solutions", "key": "solutions.evaporation", "label": "多效蒸发系统", "selector": "#solution-evaporation", "type": "text_image", "title_zh": "多效蒸发系统"},
    {"page": "solutions", "key": "solutions.ammonia", "label": "混氨技术", "selector": "#solution-ammonia", "type": "text_image", "title_zh": "混氨技术及装置"},
    {"page": "solutions", "key": "solutions.mvr", "label": "MVR系统", "selector": "#solution-mvr", "type": "text_image", "title_zh": "MVR系统"},

    # Product system
    {"page": "products", "key": "products.hero", "label": "页面标题", "selector": ".products-hero", "type": "hero", "title_zh": "完整产品体系"},
    {"page": "products", "key": "products.intro", "label": "产品体系介绍", "selector": ".product-intro", "type": "text_image", "title_zh": "从尾气回收到液相精制的成套工艺"},
    {"page": "products", "key": "products.cryo", "label": "冷冻法回收", "selector": ".product-flow-card:nth-child(1)", "type": "text_image", "title_zh": "冷冻法回收有机溶剂"},
    {"page": "products", "key": "products.absorption", "label": "吸收法回收", "selector": ".product-flow-card:nth-child(2)", "type": "text_image", "title_zh": "吸收法回收溶剂"},
    {"page": "products", "key": "products.white_oil", "label": "白油吸收", "selector": ".product-flow-card:nth-child(3)", "type": "text_image", "title_zh": "白油吸收塔系统"},
    {"page": "products", "key": "products.acetate", "label": "醋酸萃取精馏", "selector": ".product-flow-card:nth-child(4)", "type": "text_image", "title_zh": "醋酸萃取精馏回收系统"},
    {"page": "products", "key": "products.dmso", "label": "DMSO精馏", "selector": ".product-flow-card:nth-child(5)", "type": "text_image", "title_zh": "DMSO 精馏回收系统"},
    {"page": "products", "key": "products.sulfur", "label": "硫化氢制硫", "selector": ".product-flow-card:nth-child(6)", "type": "text_image", "title_zh": "硫化氢尾气制取单质硫系统"},

    # Qualifications and inquiry
    {"page": "qualifications", "key": "qualifications.hero", "label": "页面标题", "selector": ".qual-hero", "type": "hero", "title_zh": "资质证书与实验室能力"},
    {"page": "qualifications", "key": "qualifications.certificates", "label": "资质证书", "selector": "#certificates", "type": "gallery", "title_zh": "资质证书"},
    {"page": "qualifications", "key": "qualifications.laboratory", "label": "实验室", "selector": "#laboratory", "type": "text_image", "title_zh": "实验室与研发中心"},
    {"page": "qualifications", "key": "qualifications.team", "label": "工程服务能力", "selector": "#engineering-team", "type": "cards", "title_zh": "研发与工程服务能力"},
    {"page": "inquiry", "key": "inquiry.hero", "label": "页面标题", "selector": ".inquiry-hero", "type": "hero", "title_zh": "客户咨询表"},
]


def path(name: str) -> str:
    return urllib.parse.quote(name, safe="")


def file_field(field: str, label: str) -> dict[str, Any]:
    return m2o_field(field, label, file_interface=True)


def schema_definitions() -> list[dict[str, Any]]:
    settings = collection(
        "site_settings",
        "全站设置",
        "tune",
        [
            uuid_pk(),
            string_field("company_name_zh", "公司中文名称", required=True),
            string_field("company_name_en", "公司英文名称"),
            string_field("short_name_zh", "公司中文简称", width="half"),
            string_field("short_name_en", "公司英文简称", width="half"),
            string_field("tagline_zh", "中文定位语"),
            string_field("tagline_en", "英文定位语"),
            text_field("summary_zh", "中文简介"),
            text_field("summary_en", "英文简介"),
            string_field("phone", "联系电话", width="half"),
            string_field("fax", "传真", width="half"),
            string_field("email", "联系邮箱", width="half"),
            string_field("contact_person", "联系人", width="half"),
            text_field("address_zh", "中文地址"),
            text_field("address_en", "英文地址"),
            string_field("icp_number", "ICP备案号", width="half"),
            string_field("map_url", "在线地图链接", max_length=1000),
            file_field("logo_file", "网站标志"),
            file_field("wechat_qr_file", "官方微信二维码"),
            text_field("footer_zh", "页脚中文文字"),
            text_field("footer_en", "页脚英文文字"),
        ],
        note="公司名称、联系方式、网站标志和全站公共信息",
        display_template="{{company_name_zh}}",
        sort=1,
        singleton=True,
    )

    pages = collection(
        "site_pages",
        "页面管理",
        "web_asset",
        [
            uuid_pk(),
            string_field("key", "技术标识", unique=True, max_length=80),
            string_field("admin_label", "页面名称", required=True),
            string_field("path", "页面地址", max_length=255),
            boolean_field("enabled", "页面启用", default=True),
            integer_field("sort", "排序", default=0),
            string_field("seo_title_zh", "中文网页标题"),
            string_field("seo_title_en", "英文网页标题"),
            text_field("seo_description_zh", "中文搜索摘要"),
            text_field("seo_description_en", "英文搜索摘要"),
        ],
        note="选择页面后，在同一表单内编辑页面模块",
        display_template="{{admin_label}}",
        sort=2,
    )

    sections = collection(
        "site_sections",
        "页面模块",
        "view_quilt",
        [
            uuid_pk(),
            m2o_field("page", "所属页面", required=True),
            string_field("key", "模块技术标识", unique=True, max_length=120),
            string_field("admin_label", "模块名称", required=True),
            string_field("dom_selector", "页面定位", max_length=255),
            select_field("module_type", "模块类型", MODULE_TYPES, default="text_image"),
            boolean_field("enabled", "显示在官网", default=True),
            integer_field("sort", "显示顺序", default=0),
            select_field("layout", "排版方式", LAYOUTS, default="inherit"),
            string_field("eyebrow_zh", "中文小标题"),
            string_field("eyebrow_en", "英文小标题"),
            string_field("title_zh", "中文标题"),
            string_field("title_en", "英文标题"),
            string_field("subtitle_zh", "中文副标题"),
            string_field("subtitle_en", "英文副标题"),
            text_field("body_zh", "中文正文", rich=True),
            text_field("body_en", "英文正文", rich=True),
            file_field("image_file", "主图片"),
            file_field("secondary_image_file", "辅助图片"),
            string_field("button_text_zh", "中文按钮文字", width="half"),
            string_field("button_text_en", "英文按钮文字", width="half"),
            string_field("button_url", "按钮链接", max_length=1000),
        ],
        note="页面内的标题、图文、卡片、图库和联系模块",
        display_template="{{admin_label}}",
        sort=3,
        hidden=True,
    )

    items = collection(
        "site_section_items",
        "模块内容项",
        "view_list",
        [
            uuid_pk(),
            m2o_field("section", "所属模块", required=True),
            string_field("key", "内容技术标识", max_length=120),
            string_field("admin_label", "内容名称", required=True),
            boolean_field("enabled", "显示在官网", default=True),
            integer_field("sort", "显示顺序", default=0),
            string_field("title_zh", "中文标题"),
            string_field("title_en", "英文标题"),
            string_field("subtitle_zh", "中文副标题"),
            string_field("subtitle_en", "英文副标题"),
            text_field("summary_zh", "中文简介"),
            text_field("summary_en", "英文简介"),
            text_field("body_zh", "中文正文", rich=True),
            text_field("body_en", "英文正文", rich=True),
            string_field("metric_value", "数据或编号", width="half"),
            file_field("image_file", "图片"),
            string_field("link_url", "跳转链接", max_length=1000),
        ],
        note="模块内可排序的卡片、数据、图片或列表项",
        display_template="{{admin_label}}",
        sort=4,
        hidden=True,
    )
    return [settings, pages, sections, items]


RELATIONS = [
    ("site_settings", "logo_file", "directus_files", "id", "SET NULL"),
    ("site_settings", "wechat_qr_file", "directus_files", "id", "SET NULL"),
    ("site_sections", "page", "site_pages", "id", "CASCADE"),
    ("site_sections", "image_file", "directus_files", "id", "SET NULL"),
    ("site_sections", "secondary_image_file", "directus_files", "id", "SET NULL"),
    ("site_section_items", "section", "site_sections", "id", "CASCADE"),
    ("site_section_items", "image_file", "directus_files", "id", "SET NULL"),
]


def ensure_group(token: str) -> None:
    _, result = request("GET", "/collections", token=token)
    existing = {row.get("collection") for row in result.get("data", [])}
    meta = {
        "icon": GROUP["icon"],
        "note": GROUP["note"],
        "hidden": False,
        "singleton": False,
        "translations": zh(GROUP["label"]),
        "sort": 1,
    }
    if GROUP["collection"] in existing:
        request("PATCH", f"/collections/{GROUP['collection']}", token=token, payload={"meta": meta})
    else:
        request("POST", "/collections", token=token, payload={"collection": GROUP["collection"], "schema": None, "meta": meta})
    print("[ok]     website content group")


def ensure_collections(token: str) -> None:
    _, result = request("GET", "/collections", token=token)
    existing = {row.get("collection") for row in result.get("data", [])}
    for definition in schema_definitions():
        name = definition["collection"]
        if name not in existing:
            request("POST", "/collections", token=token, payload=definition)
            print(f"[ok]     collection {name}")
            existing.add(name)
        request(
            "PATCH",
            f"/collections/{path(name)}",
            token=token,
            payload={
                "meta": {
                    "group": GROUP["collection"],
                    "hidden": name in {"site_sections", "site_section_items"},
                    "singleton": name == "site_settings",
                }
            },
        )


def ensure_relations(token: str) -> None:
    _, result = request("GET", "/relations", token=token)
    existing = {(row.get("collection"), row.get("field")) for row in result.get("data", [])}
    for collection_name, field, related, related_field, on_delete in RELATIONS:
        if (collection_name, field) in existing:
            continue
        request(
            "POST",
            "/relations",
            token=token,
            payload={
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
            },
        )
        print(f"[ok]     relation {collection_name}.{field}")


def field_names(token: str, collection_name: str) -> set[str]:
    _, result = request("GET", f"/fields/{path(collection_name)}", token=token)
    return {row.get("field") for row in result.get("data", []) if row.get("field")}


def ensure_o2m(
    token: str,
    *,
    parent: str,
    alias: str,
    child: str,
    foreign_key: str,
    label: str,
    sort: int,
) -> None:
    if alias not in field_names(token, parent):
        request(
            "POST",
            f"/fields/{path(parent)}",
            token=token,
            payload={
                "field": alias,
                "type": "alias",
                "schema": None,
                "meta": {
                    "special": ["o2m"],
                    "interface": "list-o2m",
                    "options": {
                        "template": "{{admin_label}}",
                        "enableCreate": True,
                        "enableSelect": False,
                        "sortField": "sort",
                    },
                    "display": "related-values",
                    "readonly": False,
                    "required": False,
                    "hidden": False,
                    "sort": sort,
                    "width": "full",
                    "translations": zh(label),
                    "note": "点击条目编辑；拖动调整顺序；关闭显示开关即可暂时隐藏",
                },
            },
        )
    request(
        "PATCH",
        f"/relations/{path(child)}/{path(foreign_key)}",
        token=token,
        payload={"meta": {"one_field": alias}},
    )
    request(
        "PATCH",
        f"/fields/{path(child)}/{path(foreign_key)}",
        token=token,
        payload={"meta": {"required": False, "hidden": True}},
    )


def patch_field(token: str, collection_name: str, field: str, meta: dict[str, Any]) -> None:
    request(
        "PATCH",
        f"/fields/{path(collection_name)}/{path(field)}",
        token=token,
        payload={"meta": meta},
    )


def configure_operator_forms(token: str, upload_folder: str) -> None:
    ensure_o2m(token, parent="site_pages", alias="sections", child="site_sections", foreign_key="page", label="页面模块", sort=10)
    ensure_o2m(token, parent="site_sections", alias="items", child="site_section_items", foreign_key="section", label="模块内容项", sort=30)

    for field in ["key", "path", "id"]:
        patch_field(token, "site_pages", field, {"hidden": True, "readonly": True})
    patch_field(token, "site_pages", "admin_label", {"sort": 1, "readonly": True, "width": "half"})
    patch_field(token, "site_pages", "enabled", {"sort": 2, "width": "half"})
    patch_field(token, "site_pages", "sort", {"hidden": True})
    for field in ["key", "dom_selector", "id", "page"]:
        patch_field(token, "site_sections", field, {"hidden": True, "readonly": True})
    patch_field(token, "site_sections", "admin_label", {"sort": 1, "width": "half"})
    patch_field(token, "site_sections", "enabled", {"sort": 2, "width": "half"})
    patch_field(token, "site_sections", "module_type", {"sort": 3, "width": "half"})
    patch_field(token, "site_sections", "layout", {"sort": 4, "width": "half", "note": "选择保持当前排版最稳妥；新增模块可自由选择其他排版"})
    patch_field(token, "site_sections", "sort", {"sort": 5, "width": "half", "note": "数字越小越靠前"})
    for index, field in enumerate(["eyebrow_zh", "title_zh", "subtitle_zh", "body_zh", "eyebrow_en", "title_en", "subtitle_en", "body_en"], start=6):
        patch_field(token, "site_sections", field, {"sort": index})
    for index, field in enumerate(["image_file", "secondary_image_file"], start=20):
        patch_field(token, "site_sections", field, {"sort": index, "interface": "file-image", "options": {"folder": upload_folder, "crop": True, "enableCreate": True, "enableSelect": True}})
    for field in ["logo_file", "wechat_qr_file"]:
        patch_field(token, "site_settings", field, {"interface": "file-image", "options": {"folder": upload_folder, "crop": True, "enableCreate": True, "enableSelect": True}})
    for field in ["key", "id", "section"]:
        patch_field(token, "site_section_items", field, {"hidden": True, "readonly": True})
    for field in ["image_file"]:
        patch_field(token, "site_section_items", field, {"interface": "file-image", "options": {"folder": upload_folder, "crop": True, "enableCreate": True, "enableSelect": True}})
    print("[ok]     simplified operator forms")


def get_first(token: str, collection_name: str, query: dict[str, Any]) -> dict[str, Any] | None:
    _, result = request("GET", f"/items/{path(collection_name)}", token=token, query={**query, "limit": 1})
    rows = result.get("data") or []
    if isinstance(rows, dict):
        return rows if rows.get("id") else None
    return rows[0] if rows else None


def seed_settings(token: str) -> None:
    if get_first(token, "site_settings", {"fields": "id"}):
        return
    request(
        "PATCH",
        "/items/site_settings",
        token=token,
        payload={
            "id": deterministic_id("site-settings", "main"),
            "company_name_zh": "石家庄辰泰环境科技有限公司",
            "company_name_en": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
            "short_name_zh": "辰泰环境科技",
            "short_name_en": "Chentai Environmental",
            "tagline_zh": "资源循环利用一体化工艺技术供应商",
            "tagline_en": "Integrated Process Technology Supplier for Resource Recycling",
            "phone": "0311-82649608 / 0311-86826970",
            "email": "chentaihj@163.com",
            "address_zh": "河北省石家庄市灵寿县经济开发区小商品产业园8号",
            "address_en": "No. 8, Small Commodities Industrial Park, Lingshou Economic Development Zone, Shijiazhuang, Hebei, China",
            "icp_number": "冀ICP备19026973号-1",
            "footer_zh": "石家庄辰泰环境科技有限公司",
            "footer_en": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
        },
    )
    print("[ok]     global settings seeded")


def seed_pages_and_sections(token: str) -> None:
    page_ids: dict[str, str] = {}
    for key, label, page_path, sort in PAGES:
        page_id = deterministic_id("site-page", key)
        page_ids[key] = page_id
        if not get_first(token, "site_pages", {"filter[key][_eq]": key, "fields": "id"}):
            request(
                "POST",
                "/items/site_pages",
                token=token,
                payload={"id": page_id, "key": key, "admin_label": label, "path": page_path, "enabled": True, "sort": sort},
            )

    counters: dict[str, int] = {}
    for seed in SECTION_SEEDS:
        key = seed["key"]
        if get_first(token, "site_sections", {"filter[key][_eq]": key, "fields": "id"}):
            continue
        page_key = seed["page"]
        counters[page_key] = counters.get(page_key, 0) + 1
        payload = {
            "id": deterministic_id("site-section", key),
            "page": page_ids[page_key],
            "key": key,
            "admin_label": seed["label"],
            "dom_selector": seed.get("selector"),
            "module_type": seed.get("type", "text_image"),
            "enabled": True,
            "sort": counters[page_key],
            "layout": "inherit",
            "title_zh": seed.get("title_zh"),
            "title_en": seed.get("title_en"),
            "subtitle_zh": seed.get("subtitle_zh"),
            "subtitle_en": seed.get("subtitle_en"),
            "body_zh": seed.get("body_zh"),
            "body_en": seed.get("body_en"),
        }
        request("POST", "/items/site_sections", token=token, payload=payload)
    print("[ok]     page and module defaults seeded")


def ensure_upload_folder(token: str) -> str:
    root = ensure_folder(token, name="辰泰官网素材", parent=None, key="辰泰官网素材")
    folder = ensure_folder(token, name="全站内容", parent=root, key="辰泰官网素材/全站内容")
    return folder


def main() -> int:
    token = authenticate(load_env(ENV_PATH))
    print("Connected to Directus full-site content API")
    ensure_group(token)
    ensure_collections(token)
    ensure_relations(token)
    upload_folder = ensure_upload_folder(token)
    configure_operator_forms(token, upload_folder)
    seed_settings(token)
    seed_pages_and_sections(token)
    print("Full-site content bootstrap completed successfully.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ApiError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
