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
    "nav.inquiry": "客户咨询",
    "nav.contact": "联系我们",
    "hero.eyebrow": "有机溶媒回收治理科技型企业",
    "hero.title": "石家庄辰泰环境科技有限公司",
    "hero.subtitle": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
    "hero.copy": "聚焦工业有机尾气治理、液相萃取及精馏分离工艺设备，为化工、医药、涂布、新材料等行业提供技术咨询、工程设计、设备制造、安装调试和售后服务。",
    "hero.primary": "查看业务能力",
    "hero.secondary": "提交项目咨询",
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
    "qual.card3Title": "实验室与研发",
    "qual.card3Text": "公司建有市级实验室及专业化研发中心，可围绕气相回收、液相分离、精馏萃取等工况进行工艺模拟、参数分析和工程验证。",
    "qual.more": "查看资质与实验室",
    "qual.pageTitle": "资质证书与实验室能力",
    "qual.pageCopy": "把资质、研发、实验验证和工程交付能力独立呈现，首页保持简洁，详细资料在本页集中查看。",
    "qual.certTitle": "资质证书",
    "qual.labTitle": "实验室与研发中心",
    "qual.teamTitle": "研发与工程服务能力",
    "cert.isoTitle": "ISO9001质量体系认证",
    "cert.isoText": "以质量管理体系约束设计、制造、安装、调试和售后流程。",
    "cert.exTitle": "防爆认证资质",
    "cert.exText": "具备有机尾气治理回收设备相关防爆认证资质，适配化工、医药等安全要求较高的现场。",
    "cert.highTitle": "高新技术企业",
    "cert.highText": "围绕有机溶媒回收、精馏萃取与尾气治理持续进行技术研发和工程转化。",
    "cert.smeTitle": "科技型中小企业",
    "cert.smeText": "获评河北省科技型中小企业、国家级科技型中小企业等企业认定。",
    "cert.specialTitle": "专精特新中小企业",
    "cert.specialText": "在有机溶媒回收治理细分方向形成专业化产品与工程服务能力。",
    "cert.ipTitle": "知识产权与专利成果",
    "cert.ipText": "拥有多项自主知识产权、商标知识产权及专利成果，支撑工艺设备持续迭代。",
    "lab.mainTitle": "面向工程落地的工艺验证平台",
    "lab.mainText": "公司建立市级实验室及专业化研发中心，可模拟多种溶媒回收过程，形成完整的模拟参数分析，为项目工艺路线、设备选型、能耗评估和现场调试提供依据。",
    "lab.item1": "气相有机尾气吸附、脱附、冷凝、回收流程验证",
    "lab.item2": "液相溶剂萃取、精馏、分离与节能方案模拟",
    "lab.item3": "气相回收系统与液相分离系统协同设计评估",
    "lab.item4": "项目工况参数、设备规格、运行能耗与安全边界分析",
    "team.item1Title": "技术咨询",
    "team.item1Text": "根据废气组分、浓度、风量、回收目标和排放要求，判断适用工艺路线。",
    "team.item2Title": "工程设计",
    "team.item2Text": "完成工艺、设备、管线、自控和安全配置的综合设计。",
    "team.item3Title": "制造交付",
    "team.item3Text": "依托现代化厂房和数控设备，完成核心设备制造、组装与出厂检验。",
    "team.item4Title": "安装调试",
    "team.item4Text": "提供现场安装、系统调试、技术培训和后续维护支持。",
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
    "contact.inquiry": "填写客户咨询表",
    "contact.phone": "电话",
    "contact.email": "邮箱",
    "contact.address": "地址",
    "contact.addressValue": "河北省石家庄市灵寿县工业园区二区",
    "inquiry.title": "客户咨询表",
    "inquiry.copy": "请填写项目基础信息，便于我们判断工艺路线、设备规模和后续沟通重点。带 * 的项目为必填项。",
    "form.name": "姓名",
    "form.company": "单位名称",
    "form.phone": "联系电话",
    "form.email": "邮箱",
    "form.industry": "所属行业",
    "form.medium": "废气或溶剂类型",
    "form.flowRate": "处理风量/产能",
    "form.fileHint": "资料说明",
    "form.need": "需求说明",
    "form.requiredNote": "备注：* 号为必填项。",
    "form.submit": "提交咨询",
    "form.download": "下载咨询表",
    "form.success": "咨询已提交，我们会尽快联系您。",
    "form.savedNoEmail": "咨询已提交并保存。当前后台邮件尚未配置，请部署时设置 SMTP 邮箱参数。",
    "form.staticError": "当前 GitHub Pages 为静态演示，无法直接提交表单。请部署 Node 后台后使用，或下载咨询表发送至邮箱。"
  },
  en: {
    "nav.profile": "Profile",
    "nav.qualifications": "Qualifications",
    "nav.business": "Business",
    "nav.products": "Products",
    "nav.news": "News",
    "nav.inquiry": "Inquiry",
    "nav.contact": "Contact",
    "hero.eyebrow": "Technology Company for Organic Solvent Recovery",
    "hero.title": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
    "hero.subtitle": "Organic solvent recovery and VOCs treatment systems provider",
    "hero.copy": "Chentai focuses on industrial organic waste gas treatment, liquid extraction and distillation separation equipment, providing technical consulting, engineering design, equipment manufacturing, installation, commissioning and after-sales service.",
    "hero.primary": "Business Capability",
    "hero.secondary": "Project Inquiry",
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
    "qual.card3Title": "Laboratory and R&D",
    "qual.card3Text": "The company operates a municipal laboratory and dedicated R&D center for process simulation, parameter analysis and engineering validation of gas recovery, liquid separation and distillation systems.",
    "qual.more": "View Qualifications and Laboratory",
    "qual.pageTitle": "Qualifications and Laboratory Capability",
    "qual.pageCopy": "Certificates, R&D, testing and engineering delivery capabilities are presented on this dedicated page so the homepage stays focused.",
    "qual.certTitle": "Certificates",
    "qual.labTitle": "Laboratory and R&D Center",
    "qual.teamTitle": "R&D and Engineering Services",
    "cert.isoTitle": "ISO9001 Quality System Certification",
    "cert.isoText": "Quality management covers design, manufacturing, installation, commissioning and after-sales service.",
    "cert.exTitle": "Explosion-Proof Certification",
    "cert.exText": "Certification for organic waste gas recovery equipment supports projects in chemical and pharmaceutical sites with strict safety requirements.",
    "cert.highTitle": "High-Tech Enterprise",
    "cert.highText": "Continuous R&D and engineering application in organic solvent recovery, distillation extraction and tail gas treatment.",
    "cert.smeTitle": "Technology-Based SME",
    "cert.smeText": "Recognized as a Hebei technology-based SME and a national technology-based SME.",
    "cert.specialTitle": "Specialized and Innovative SME",
    "cert.specialText": "Focused product and engineering capabilities in the organic solvent recovery and treatment segment.",
    "cert.ipTitle": "Intellectual Property and Patents",
    "cert.ipText": "Patents, trademarks and proprietary technologies support continuous process and equipment iteration.",
    "lab.mainTitle": "Process Validation for Real Projects",
    "lab.mainText": "The municipal laboratory and professional R&D center can simulate multiple solvent recovery processes and generate complete parameter analysis for process selection, equipment sizing, energy evaluation and commissioning.",
    "lab.item1": "Validation of adsorption, desorption, condensation and recovery for gas-phase organic exhaust",
    "lab.item2": "Simulation of liquid solvent extraction, distillation, separation and energy-saving routes",
    "lab.item3": "Integrated assessment of gas recovery and liquid separation systems",
    "lab.item4": "Analysis of operating parameters, equipment scale, energy use and safety boundaries",
    "team.item1Title": "Technical Consulting",
    "team.item1Text": "Assess process routes based on gas composition, concentration, airflow, recovery target and emission requirements.",
    "team.item2Title": "Engineering Design",
    "team.item2Text": "Integrated design of process, equipment, piping, automation and safety configuration.",
    "team.item3Title": "Manufacturing",
    "team.item3Text": "Modern workshops and CNC equipment support fabrication, assembly and factory inspection.",
    "team.item4Title": "Installation and Commissioning",
    "team.item4Text": "On-site installation, system commissioning, technical training and maintenance support.",
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
    "contact.inquiry": "Fill Inquiry Form",
    "contact.phone": "Tel",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.addressValue": "Zone 2, Lingshou County Industrial Park, Shijiazhuang City, Hebei Province",
    "inquiry.title": "Project Inquiry",
    "inquiry.copy": "Please provide basic project information so we can assess the process route, equipment scale and follow-up priorities. Fields marked with * are required.",
    "form.name": "Name",
    "form.company": "Company",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.industry": "Industry",
    "form.medium": "Gas or Solvent",
    "form.flowRate": "Air Flow / Capacity",
    "form.fileHint": "Document Notes",
    "form.need": "Requirement",
    "form.requiredNote": "Note: * fields are required.",
    "form.submit": "Submit Inquiry",
    "form.download": "Download Form",
    "form.success": "Your inquiry has been submitted. We will contact you soon.",
    "form.savedNoEmail": "Your inquiry has been saved. Email delivery is not configured on the backend yet.",
    "form.staticError": "GitHub Pages is a static demo and cannot submit forms directly. Deploy the Node backend or download the form and email it to us."
  }
};

function t(key) {
  return labels[currentLang][key] || labels.zh[key] || key;
}

function translatedValue(key) {
  return labels[currentLang]?.[key] || labels.zh?.[key] || "";
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
    const value = translatedValue(node.dataset.i18n);
    if (value) node.textContent = value;
  });
  const toggle = $("[data-lang-toggle]");
  if (toggle) toggle.textContent = currentLang === "zh" ? "EN" : "中";
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
  const modal = $("[data-modal]");
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function bind() {
  const menuButton = $("[data-menu-button]");
  const nav = $("[data-nav]");
  const langToggle = $("[data-lang-toggle]");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "zh" ? "en" : "zh";
      renderI18n();
      renderNews();
    });
  }
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

  const inquiryForm = $("[data-inquiry-form]");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = $("[data-form-status]");
      const button = inquiryForm.querySelector("button[type='submit']");
      status.textContent = "";
      button.disabled = true;
      try {
        const response = await fetch("api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(inquiryForm)))
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "提交失败");
        inquiryForm.reset();
        status.textContent = data.mail?.sent ? t("form.success") : t("form.savedNoEmail");
      } catch (error) {
        status.textContent = location.protocol === "file:" || location.hostname.endsWith("github.io")
          ? t("form.staticError")
          : error.message;
      } finally {
        button.disabled = false;
      }
    });
  }
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
