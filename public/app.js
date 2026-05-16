let siteData = {};
let currentLang = "zh";
let newsFilter = "all";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function assetPath(value) {
  if (!value || /^(https?:|data:|blob:|mailto:|tel:|#|about:)/.test(value)) return value;
  return value.startsWith("/") ? value.slice(1) : value;
}

const labels = {
  zh: {
    "nav.profile": "公司简介",
    "nav.qualifications": "资质能力",
    "nav.business": "主营业务",
    "nav.products": "产品体系",
    "nav.news": "新闻版块",
    "nav.contact": "联系我们",
    "hero.eyebrow": "有机溶媒回收治理科技型企业",
    "hero.title": "辰起蓝天，泰然自若",
    "hero.copy": "聚焦工业有机尾气治理、液相萃取及精馏分离工艺设备，为化工、医药、涂布、新材料等行业提供技术咨询、工程设计、设备制造、安装调试和售后服务。",
    "hero.primary": "查看业务能力",
    "hero.secondary": "浏览新闻动态",
    "hero.land": "占地面积",
    "hero.plant": "建筑厂房",
    "hero.iso": "质量体系认证",
    "profile.title": "公司简介",
    "profile.p1": "石家庄辰泰环境科技有限公司是一家专业从事有机溶媒回收治理的科技型企业。公司位于石家庄灵寿县工业园区，拥有现代化厂房、先进数控设备、市级实验室及专业研发中心。",
    "profile.p2": "公司可为不同类型行业企业提供有机尾气治理、精馏分离工艺、有氧硫化氢制取单质硫工艺等方向的技术咨询、工程设计、设备制造、安装调试、技术培训以及售后服务。",
    "profile.p3": "辰泰将气相回收系统和液相分离系统从设计角度进行融合，实现气相产生液体、液相分离产生气体的统一规划处理，兼顾达标排放、资源回收与能耗控制。",
    "stats.land": "占地面积",
    "stats.plant": "建筑厂房",
    "stats.labValue": "市级",
    "stats.lab": "实验室与研发中心",
    "stats.serviceValue": "全流程",
    "stats.service": "设计制造安装调试",
    "qual.title": "资质能力",
    "qual.card1Title": "企业资质",
    "qual.card1Text": "公司通过 ISO9001 质量体系认证，并取得有机尾气治理回收设备相关防爆认证资质，拥有多项自主知识产权、商标知识产权及专利成果。",
    "qual.card2Title": "企业认定",
    "qual.card2Text": "公司先后获评河北省科技型中小企业、高新技术企业、规模以上企业、国家级科技型中小企业、河北省专精特新中小企业。",
    "business.title": "主营业务",
    "business.item1Title": "工业有机尾气治理",
    "business.item1Text": "面向化工、医药、印刷、涂布、新材料等行业，提供吸附、脱附、冷凝、回收、达标排放一体化解决方案。",
    "business.item2Title": "液相萃取及精馏分离工艺设备",
    "business.item2Text": "围绕溶剂回收、节能精馏和资源利用，完成从基础设计、设备制作、安装施工到调试验收的全过程工作。",
    "business.item3Title": "工业臭气尾气治理",
    "business.item3Text": "针对硫化氢、恶臭气体及复合尾气，进行工艺组合设计和系统化治理。",
    "products.title": "产品体系",
    "products.distillationTitle": "精馏萃取设备",
    "products.distillationText": "融合精馏分离专业技术团队与化工节能过程集成研究能力，适用于甲醇、乙醇、DMF、DMAC、DMSO、NMP、乙酸乙酯等常用溶剂的分离提纯与回收。",
    "products.p1": "萃取精馏技术",
    "products.p2": "恒沸精馏技术",
    "products.p3": "多效精馏节能技术",
    "products.p4": "热泵精馏技术",
    "products.p5": "隔壁塔技术",
    "products.p6": "催化反应精馏技术",
    "products.tailTitle": "有机尾气治理设备",
    "products.tailText": "颗粒活性炭吸附蒸汽脱附、真空脱附、变压吸附回收以及活性炭纤维吸附蒸汽脱附等装置。",
    "products.liquidTitle": "液相分离及配套设备",
    "products.liquidText": "液相萃取及精馏分离装置、有机混合物分离装置、多效蒸发装置等。",
    "products.supportTitle": "配套系统",
    "products.supportText": "变压吸附制氮、变压吸附制氧及项目现场配套自动控制系统。",
    "gallery.title": "工厂与工程现场",
    "news.title": "新闻版块",
    "news.all": "全部",
    "news.company": "公司新闻",
    "news.industry": "行业资讯",
    "news.read": "阅读详情",
    "news.more": "查看更多新闻",
    "news.pageTitle": "新闻版块",
    "news.pageCopy": "集中查看公司新闻与行业资讯，保留旧网站新闻内容，并以更清晰的阅读方式呈现。",
    "news.allTitle": "全部新闻资讯",
    "contact.title": "联系我们",
    "contact.copy": "欢迎围绕有机尾气治理、溶剂回收、液相分离和精馏节能改造需求进行项目咨询。",
    "contact.phone": "电话",
    "contact.email": "邮箱",
    "contact.address": "地址",
    "contact.addressValue": "河北省石家庄市灵寿县工业园区二区"
  },
  en: {
    "nav.profile": "Profile",
    "nav.qualifications": "Qualifications",
    "nav.business": "Business",
    "nav.products": "Products",
    "nav.news": "News",
    "nav.contact": "Contact",
    "hero.eyebrow": "Technology Company for Organic Solvent Recovery",
    "hero.title": "Cleaner Air, Reliable Engineering",
    "hero.copy": "Chentai focuses on industrial organic waste gas treatment, liquid extraction and distillation separation equipment, providing technical consulting, engineering design, equipment manufacturing, installation, commissioning and after-sales service.",
    "hero.primary": "Business Capability",
    "hero.secondary": "News Center",
    "hero.land": "Land area",
    "hero.plant": "Plant area",
    "hero.iso": "Quality system certification",
    "profile.title": "Company Profile",
    "profile.p1": "Shijiazhuang Chentai Environmental Technology Co., Ltd. is a technology-oriented enterprise specializing in organic solvent recovery and treatment. The company is located in Lingshou County Industrial Park, Shijiazhuang, with modern workshops, CNC equipment, a municipal laboratory and a dedicated R&D center.",
    "profile.p2": "Chentai provides technical consulting, engineering design, equipment manufacturing, installation, commissioning, training and after-sales service for organic waste gas treatment, distillation separation and sulfur recovery processes.",
    "profile.p3": "The company integrates gas-phase recovery systems with liquid-phase separation systems at the design stage, planning both streams as one engineering system for compliant emission, resource recovery and energy control.",
    "stats.land": "Land area",
    "stats.plant": "Plant area",
    "stats.labValue": "Municipal",
    "stats.lab": "laboratory and R&D center",
    "stats.serviceValue": "Full process",
    "stats.service": "design, manufacturing and commissioning",
    "qual.title": "Qualifications",
    "qual.card1Title": "Certifications",
    "qual.card1Text": "The company has passed ISO9001 quality system certification, obtained explosion-proof certification for organic waste gas recovery equipment, and owns patents, trademarks and other intellectual property achievements.",
    "qual.card2Title": "Recognitions",
    "qual.card2Text": "Chentai has been recognized as a Hebei technology-based SME, high-tech enterprise, above-scale enterprise, national technology-based SME and Hebei Specialized and Innovative SME.",
    "business.title": "Core Business",
    "business.item1Title": "Industrial Organic Waste Gas Treatment",
    "business.item1Text": "Integrated solutions for adsorption, desorption, condensation, recovery and compliant emission in chemical, pharmaceutical, printing, coating and new-material industries.",
    "business.item2Title": "Liquid Extraction and Distillation Equipment",
    "business.item2Text": "Full-process delivery from basic design to equipment fabrication, installation, commissioning and acceptance for solvent recovery and energy-saving separation.",
    "business.item3Title": "Industrial Odor and Tail Gas Treatment",
    "business.item3Text": "Combined process design and system treatment for hydrogen sulfide, odor gases and complex exhaust streams.",
    "products.title": "Product System",
    "products.distillationTitle": "Distillation and Extraction Equipment",
    "products.distillationText": "Chentai integrates distillation separation expertise with chemical energy-saving process research for the recovery and purification of methanol, ethanol, DMF, DMAC, DMSO, NMP, ethyl acetate and other common solvents.",
    "products.p1": "Extractive distillation",
    "products.p2": "Azeotropic distillation",
    "products.p3": "Multi-effect energy-saving distillation",
    "products.p4": "Heat-pump distillation",
    "products.p5": "Dividing-wall column",
    "products.p6": "Catalytic reactive distillation",
    "products.tailTitle": "Organic Waste Gas Treatment Equipment",
    "products.tailText": "Granular activated carbon steam desorption, vacuum desorption, pressure swing adsorption recovery and activated carbon fiber steam desorption units.",
    "products.liquidTitle": "Liquid Separation Equipment",
    "products.liquidText": "Liquid extraction and distillation units, organic mixture separation equipment and multi-effect evaporation systems.",
    "products.supportTitle": "Supporting Systems",
    "products.supportText": "PSA nitrogen generation, PSA oxygen generation and project automation control systems.",
    "gallery.title": "Factory and Project Sites",
    "news.title": "News Center",
    "news.all": "All",
    "news.company": "Company",
    "news.industry": "Industry",
    "news.read": "Read More",
    "news.more": "More News",
    "news.pageTitle": "News Center",
    "news.pageCopy": "Browse company updates and industry articles preserved from the previous website in a cleaner reading layout.",
    "news.allTitle": "All News and Articles",
    "contact.title": "Contact",
    "contact.copy": "Contact us for organic waste gas treatment, solvent recovery, liquid separation and energy-saving distillation projects.",
    "contact.phone": "Tel",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.addressValue": "Zone 2, Lingshou County Industrial Park, Shijiazhuang City, Hebei Province"
  }
};

function t(key) {
  return labels[currentLang][key] || labels.zh[key] || key;
}

function localField(item, key, fallback = "") {
  return currentLang === "en" ? item[`${key}En`] || item[key] || fallback : item[key] || fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderI18n() {
  $$("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("[data-lang-toggle]").textContent = currentLang === "zh" ? "EN" : "中";
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
}

function articleImage(item) {
  return assetPath(item.coverImage || item.images?.[0] || "assets/hero/factory-realistic.png");
}

function allNews() {
  const company = (siteData.news || []).map((item) => ({ ...item, sourceType: "company" }));
  const industry = (siteData.industryNews || []).map((item) => ({ ...item, sourceType: "industry" }));
  return [...company, ...industry];
}

function filteredNews() {
  return allNews().filter((item) => newsFilter === "all" || item.sourceType === newsFilter);
}

function renderNews() {
  const grid = $("[data-news-grid]");
  if (!grid) return;
  const limit = Number(grid.dataset.newsLimit || 0);
  const list = limit ? filteredNews().slice(0, limit) : filteredNews();
  grid.innerHTML = list.map((item) => {
    const title = escapeHtml(localField(item, "title"));
    const summary = escapeHtml(localField(item, "summary", localField(item, "content", [])[0] || ""));
    const tag = item.sourceType === "company" ? t("news.company") : t("news.industry");
    return `
      <article class="news-card" data-news-id="${escapeHtml(item.id)}" data-news-type="${item.sourceType}">
        <img src="${articleImage(item)}" alt="${title}" loading="lazy" />
        <div>
          <span>${tag}</span>
          <h3>${title}</h3>
          <p>${summary}</p>
          <button type="button">${t("news.read")}</button>
        </div>
      </article>
    `;
  }).join("");
}

function openNews(id, type) {
  const item = allNews().find((entry) => entry.id === id && entry.sourceType === type);
  if (!item) return;
  const title = escapeHtml(localField(item, "title"));
  const summary = escapeHtml(localField(item, "summary"));
  const content = localField(item, "content", []);
  const paragraphs = Array.isArray(content) ? content : [content];
  const images = item.images?.length ? item.images : [];
  $("[data-modal-content]").innerHTML = `
    <p class="eyebrow">${type === "company" ? t("news.company") : t("news.industry")}</p>
    <h2>${title}</h2>
    ${summary ? `<p class="modal-summary">${summary}</p>` : ""}
    <div class="article-body">
      ${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    </div>
    ${images.length ? `<div class="article-images">${images.map((src) => `<img src="${assetPath(src)}" alt="${title}" loading="lazy" />`).join("")}</div>` : ""}
  `;
  $("[data-modal]").setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  $("[data-modal]").setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function bind() {
  $("[data-menu-button]").addEventListener("click", () => {
    $("[data-nav]").classList.toggle("is-open");
  });
  $("[data-lang-toggle]").addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    renderI18n();
    renderNews();
  });
  document.addEventListener("click", (event) => {
    const card = event.target.closest("[data-news-id]");
    if (card) openNews(card.dataset.newsId, card.dataset.newsType);
    const filter = event.target.closest("[data-news-filter]");
    if (filter) {
      newsFilter = filter.dataset.newsFilter;
      $$("[data-news-filter]").forEach((btn) => btn.classList.toggle("is-active", btn === filter));
      renderNews();
    }
    if (event.target.closest("[data-close-modal]") || event.target.matches("[data-modal]")) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

async function boot() {
  const response = await fetch("data/site.json", { cache: "no-store" });
  siteData = await response.json();
  renderI18n();
  renderNews();
  bind();
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>网站加载失败</h1><p>${escapeHtml(error.message)}</p></main>`;
});
