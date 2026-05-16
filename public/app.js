let siteData;
let currentLang = "zh";
let newsFilter = "all";

const $ = (selector) => document.querySelector(selector);

const basePath = (() => {
  const scriptUrl = new URL(document.currentScript?.getAttribute("src") || "app.js", window.location.href);
  const scriptDir = scriptUrl.pathname.replace(/\/app\.js$/, "");
  return scriptDir === "/" ? "" : scriptDir;
})();

function withBase(value) {
  if (!value || /^(https?:|data:|blob:|mailto:|tel:|#|about:)/.test(value)) return value;
  return value.startsWith("/") ? `${basePath}${value}` : value;
}

function normalizeAssetPaths(value) {
  if (Array.isArray(value)) return value.map(normalizeAssetPaths);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeAssetPaths(entry)]));
  }
  return typeof value === "string" ? withBase(value) : value;
}

const labels = {
  zh: {
    "nav.home": "首页",
    "nav.about": "公司概况",
    "nav.news": "新闻版块",
    "nav.projects": "主营项目",
    "nav.technology": "技术服务",
    "nav.cases": "服务案例",
    "hero.primary": "查看主营项目",
    "hero.secondary": "浏览服务案例",
    "orbit.adsorb": "吸附",
    "orbit.desorb": "脱附",
    "orbit.condense": "冷凝",
    "orbit.recover": "回收",
    "sections.about": "公司概况",
    "sections.news": "新闻版块",
    "sections.projects": "主营项目",
    "sections.technology": "技术服务",
    "sections.cases": "服务案例",
    "sections.allNews": "新闻与行业资讯",
    "sections.allProjects": "全部主营项目",
    "sections.allTechnology": "全部技术服务",
    "sections.allCases": "全部服务案例",
    "sections.flowLibrary": "流程图资料库",
    "sections.inquiry": "在线留言",
    "form.name": "姓名",
    "form.company": "单位",
    "form.contact": "联系方式",
    "form.need": "需求说明",
    "form.submit": "提交需求",
    "modal.intro": "内容介绍",
    "modal.flow": "3D流程图",
    "modal.library": "流程图资料库",
    "modal.technology": "技术服务",
    "modal.case": "服务案例",
    "modal.news": "新闻详情",
    "modal.industry": "行业资讯",
    "ui.more": "查看更多",
    "ui.less": "收起",
    "ui.all": "全部",
    "ui.companyNews": "公司新闻",
    "ui.industryNews": "行业资讯",
    "modal.customDetail": "此流程图来自本地PDF资料库，当前以原图预览加3D设备流程的方式呈现，后续可按设备、阀门、管线和控制逻辑进一步细化。",
    "modal.techDetail": "该技术方向可结合项目风量、浓度、介质特性、回收价值和安全联锁要求进行工艺组合。",
    "modal.caseDetail": "第一版沿用原网站案例素材，后续可继续补充行业参数、处理风量、回收介质、排放指标和项目照片。",
    "flow.original": "原PDF流程图",
    "flow.generated": "设备化3D流程",
    "flow.complete": "完成",
    "form.success": "需求已提交，我们会尽快联系您。",
    "contact.phone": "电话",
    "contact.email": "邮箱"
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.news": "News",
    "nav.projects": "Projects",
    "nav.technology": "Technology",
    "nav.cases": "Cases",
    "hero.primary": "Main Projects",
    "hero.secondary": "Service Cases",
    "orbit.adsorb": "Adsorb",
    "orbit.desorb": "Desorb",
    "orbit.condense": "Condense",
    "orbit.recover": "Recover",
    "sections.about": "About",
    "sections.news": "News",
    "sections.projects": "Main Projects",
    "sections.technology": "Technology",
    "sections.cases": "Service Cases",
    "sections.allNews": "News & Industry Insights",
    "sections.allProjects": "All Main Projects",
    "sections.allTechnology": "All Technology Services",
    "sections.allCases": "All Service Cases",
    "sections.flowLibrary": "Flow Library",
    "sections.inquiry": "Inquiry",
    "form.name": "Name",
    "form.company": "Company",
    "form.contact": "Contact",
    "form.need": "Requirement",
    "form.submit": "Submit",
    "modal.intro": "Introduction",
    "modal.flow": "3D Process",
    "modal.library": "Flow Library",
    "modal.technology": "Technology",
    "modal.case": "Service Case",
    "modal.news": "News",
    "modal.industry": "Industry News",
    "ui.more": "View More",
    "ui.less": "Collapse",
    "ui.all": "All",
    "ui.companyNews": "Company News",
    "ui.industryNews": "Industry News",
    "modal.customDetail": "This diagram comes from the local PDF library. It is currently shown as the original preview plus a generated 3D equipment process, and can later be refined by valves, pipelines and control logic.",
    "modal.techDetail": "This technical route can be configured according to air volume, concentration, medium properties, recovery value and safety interlock requirements.",
    "modal.caseDetail": "The first version uses original case assets. Industry parameters, air volume, recovered media, emission targets and project photos can be added later.",
    "flow.original": "Original PDF",
    "flow.generated": "Generated 3D Process",
    "flow.complete": "Complete",
    "form.success": "Submitted. We will contact you soon.",
    "contact.phone": "Tel",
    "contact.email": "Email"
  }
};

const contentEn = {
  companyName: "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  brandSmall: "VOC Recovery · Organic Solvent Recovery",
  tagline: "Organic solvent recovery and VOC treatment system provider",
  summary: "Shijiazhuang Chentai Environmental Technology Co., Ltd. is a technology company focused on organic solvent recovery and treatment. Its business covers organic tail gas treatment, rectification and separation, aerobic hydrogen sulfide to elemental sulfur, industrial waste gas treatment and customized environmental equipment. The production base covers about 14,000 m2, with about 4,500 m2 of workshops and 1,500 m2 of office space, supported by more than 20 technical professionals.",
  address: "Zone 2, Lingshou Industrial Park, Shijiazhuang, Hebei, China",
  metrics: {
    "生产基地": "Production Base",
    "厂房面积": "Workshop Area",
    "技术人员": "Technical Staff",
    "流程图方案": "Process Diagrams"
  },
  culture: {
    "经营理念": ["Business Philosophy", "Integrity, standardization, efficiency and innovation. Chentai improves engineering quality and service efficiency through disciplined management and continuous innovation."],
    "服务理念": ["Service Philosophy", "Customer needs drive continuous improvement. Customer suggestions guide refinement, and win-win cooperation is the long-term pursuit."],
    "质量理念": ["Quality Philosophy", "Product quality is built with a strong sense of safety responsibility, process control and a pursuit of excellence."],
    "用人理念": ["Talent Philosophy", "Employees are Chentai's most valuable asset. The company respects people and builds platforms for long-term growth."]
  }
};

const itemEn = {
  "精馏萃取装置": "Rectification and Extraction Unit",
  "丙酮、异丙醇尾气水吸收装置": "Acetone and Isopropanol Tail Gas Water Absorption Unit",
  "颗粒活性炭(GAC)吸附回收装置": "Granular Activated Carbon Adsorption Recovery Unit",
  "活性炭纤维有机气体回收设备": "Activated Carbon Fiber Organic Gas Recovery Unit",
  "真空挡板阀": "Vacuum Gate Valve",
  "有氧硫化氢制取单质硫设备": "Aerobic H2S to Elemental Sulfur Unit",
  "DSP系列真空自动回收装置": "DSP Series Automatic Vacuum Recovery Unit",
  "焦化行业VOC治理装置": "Coking Industry VOC Treatment Unit",
  "湖南某集团溶剂回收项目": "Solvent Recovery Project for a Hunan Group",
  "山东某化企溶剂回收项目": "Solvent Recovery Project for a Shandong Chemical Enterprise",
  "PSA空分制氧": "PSA Oxygen Generation",
  "PSA空分制氮设备": "PSA Nitrogen Generation Unit",
  "石药集团尾气回收项目": "Tail Gas Recovery Project for CSPC",
  "双氧水尾气回收项目": "Hydrogen Peroxide Tail Gas Recovery Project",
  "江苏苏化集团尾气回收项目": "Tail Gas Recovery Project for Jiangsu Suhua Group",
  "光学膜行业尾气回收项目": "Optical Film Tail Gas Recovery Project",
  "江苏农化尾气回收项目": "Agrochemical Tail Gas Recovery Project",
  "联邦制药尾气回收设备": "Tail Gas Recovery Equipment for United Laboratories",
  "华药尾气回收项目": "Tail Gas Recovery Project for NCPC",
  "安徽某实业集团尾气回收项目": "Tail Gas Recovery Project for an Anhui Industrial Group",
  "丙酮、异丙醇尾气水吸收流程": "Acetone and Isopropanol Water Absorption Process",
  "二氯甲烷吸附回收流程": "Dichloromethane Adsorption Recovery Process",
  "白油吸收塔流程": "White Oil Absorption Tower Process",
  "沧州明珠二氯回收流程": "Cangzhou Mingzhu DCM Recovery Process",
  "二氯吸附回收与白油二氯分离流程": "DCM Adsorption Recovery and White Oil Separation Process",
  "光焱新材料二氯尾气吸附流程": "Guangyan New Materials DCM Tail Gas Adsorption Process",
  "华强35000风量治理流程": "Huaqiang 35,000 Air Volume Treatment Process",
  "金立丙酮活性炭吸附回收流程": "Jinli Acetone Activated Carbon Recovery Process",
  "三罐两级吸附流程": "Three-Vessel Two-Stage Adsorption Process",
  "乙醚乙醇精馏流程": "Ether and Ethanol Rectification Process",
  "乙醚乙醇吸附回收精馏流程（6罐）": "Six-Vessel Ether/Ethanol Adsorption and Rectification Process",
  "浙江尤夫流程": "Zhejiang Youfu Process",
  "中峰化学醋酸回收流程（20t）": "Zhongfeng Chemical Acetic Acid Recovery Process",
  "中福流程": "Zhongfu Process",
  "DMSO-900流程": "DMSO-900 Process",
  "H2S治理流程": "H2S Treatment Process",
  "水吸收": "Water absorption",
  "活性炭吸附": "Activated carbon adsorption",
  "吸收分离": "Absorption separation",
  "吸附回收": "Adsorption recovery",
  "吸附 + 精馏分离": "Adsorption + rectification separation",
  "蒸汽脱附": "Steam desorption",
  "组合治理": "Combined treatment",
  "活性炭吸附回收": "Activated carbon recovery",
  "多罐切换": "Multi-vessel switching",
  "精馏分离": "Rectification separation",
  "6罐吸附 + 精馏": "Six-vessel adsorption + rectification",
  "尾气回收": "Tail gas recovery",
  "回收精制": "Recovery refining",
  "吸附治理": "Adsorption treatment",
  "回收治理": "Recovery treatment",
  "制取单质硫": "Elemental sulfur production",
  "丙酮 / 异丙醇": "Acetone / isopropanol",
  "二氯甲烷": "Dichloromethane",
  "白油吸收": "White oil absorption",
  "白油 / 二氯甲烷": "White oil / dichloromethane",
  "二氯尾气": "Dichloromethane tail gas",
  "大风量尾气": "High-volume tail gas",
  "丙酮": "Acetone",
  "有机尾气": "Organic tail gas",
  "乙醚 / 乙醇": "Ether / ethanol",
  "涂布尾气": "Coating exhaust",
  "醋酸": "Acetic acid",
  "DMSO": "DMSO",
  "硫化氢": "Hydrogen sulfide",
  "活性炭吸附真空负压脱附": "Activated Carbon Adsorption and Vacuum Desorption",
  "VOCs有机废气处理设备": "VOC Organic Waste Gas Treatment Equipment",
  "干式螺杆真空泵工作原理": "Dry Screw Vacuum Pump Working Principle",
  "气动执行器安装维护": "Pneumatic Actuator Installation and Maintenance"
};

const flowEn = {
  "尾气收集": "Gas collection",
  "预处理": "Pretreatment",
  "水吸收塔": "Water absorber",
  "循环液冷却": "Loop cooling",
  "达标排放": "Emission",
  "回收液外送": "Recovered liquid",
  "尾气缓冲": "Buffering",
  "过滤预处理": "Filtration",
  "吸附罐组": "Adsorbers",
  "真空脱附": "Vacuum desorption",
  "冷凝回收": "Condensation",
  "尾气达标": "Clean exhaust",
  "尾气引入": "Gas inlet",
  "白油吸收": "White oil absorption",
  "循环换热": "Heat exchange",
  "油气分离": "Oil-gas separation",
  "尾气排放": "Exhaust",
  "富液处理": "Rich liquid treatment",
  "生产尾气": "Process exhaust",
  "多级吸附": "Multi-stage adsorption",
  "脱附再生": "Regeneration",
  "冷凝分层": "Condense and separate",
  "回收储存": "Storage",
  "自动切换": "Auto switching",
  "含二氯尾气": "DCM gas",
  "活性炭吸附": "Carbon adsorption",
  "白油分离": "White oil separation",
  "精制回用": "Refined reuse",
  "吸附净化": "Adsorption",
  "蒸汽脱附": "Steam desorption",
  "冷凝": "Condensation",
  "油水分离": "Oil-water separation",
  "回收二氯": "DCM recovery",
  "大风量收集": "High-volume collection",
  "前端除雾": "Demisting",
  "吸附浓缩": "Adsorption concentration",
  "脱附回收": "Desorption recovery",
  "排风监测": "Exhaust monitoring",
  "联锁控制": "Interlock control",
  "丙酮尾气": "Acetone exhaust",
  "除尘过滤": "Dust filtration",
  "脱附解析": "Desorption",
  "排放检测": "Emission check",
  "一级吸附": "Primary adsorption",
  "二级吸附": "Secondary adsorption",
  "备用切换": "Standby switch",
  "干燥冷却": "Drying/cooling",
  "循环运行": "Cyclic operation",
  "混合液进料": "Mixed feed",
  "预热": "Preheating",
  "精馏塔": "Rectification column",
  "冷凝回流": "Condensing reflux",
  "产品采出": "Product draw",
  "残液处理": "Residue treatment",
  "六罐吸附": "Six adsorbers",
  "解析回收": "Desorption recovery",
  "精馏提纯": "Rectification",
  "溶剂回用": "Solvent reuse",
  "涂布尾气": "Coating exhaust",
  "风量平衡": "Air balancing",
  "吸附回收": "Adsorption recovery",
  "冷凝分离": "Condensing separation",
  "溶剂储存": "Solvent storage",
  "系统排放": "System exhaust",
  "含醋酸物料": "Acetic acid feed",
  "蒸馏浓缩": "Distillation",
  "精制储存": "Refined storage",
  "尾气处理": "Off-gas treatment",
  "废气汇集": "Gas manifold",
  "过滤稳压": "Filter and stabilize",
  "脱附冷凝": "Desorb/condense",
  "回收暂存": "Recovery buffer",
  "自动控制": "Automation",
  "DMSO尾气": "DMSO exhaust",
  "预冷": "Pre-cooling",
  "吸收回收": "Absorption recovery",
  "循环净化": "Loop purification",
  "尾气排放": "Exhaust",
  "在线监测": "Online monitoring",
  "含硫尾气": "Sulfur gas",
  "安全预处理": "Safety pretreatment",
  "氧化反应": "Oxidation",
  "单质硫回收": "Sulfur recovery",
  "尾气净化": "Gas polishing"
};

const processStages = {
  zh: [
    ["安全、质量第一的工程理念", "公司本着安全、质量第一的经营理念，主抓设备的安全性，提高设备的稳定性，降低设备的能耗。"],
    ["面向有机溶媒治理的成套装备", "围绕化工、医药、涂布等行业现场需求，形成从工艺设计、设备制造到系统集成的整体服务能力。"],
    ["持续推进技术交流与科研攻关", "通过和国内一流大学的技术交流与合作，积极进行科研攻关，解决并攻克了多项专业技术专题。"],
    ["以稳定运行服务长期项目", "公司重视工程实施、调试运行和售后服务，让设备在真实生产场景中保持可靠、节能和可维护。"]
  ],
  en: [
    ["Safety and Quality First", "Chentai focuses on equipment safety, stable operation and lower energy consumption under a safety-first engineering philosophy."],
    ["Integrated Equipment for Solvent Treatment", "The company serves chemical, pharmaceutical and coating-industry sites with process design, equipment manufacturing and system integration."],
    ["Technical Collaboration and R&D", "Through technical cooperation with leading universities, Chentai continues to solve specialized engineering challenges."],
    ["Reliable Long-Term Project Operation", "The team values implementation, commissioning and after-sales service so systems remain reliable, efficient and maintainable in production."]
  ]
};

let processCopyTimer;

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

async function loadSiteData() {
  try {
    return normalizeAssetPaths(await api(withBase("/api/site")));
  } catch (error) {
    const response = await fetch(withBase("/data/site.json"), { cache: "no-store" });
    if (!response.ok) throw error;
    return normalizeAssetPaths(await response.json());
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderParagraphs(paragraphs = []) {
  return paragraphs.filter(Boolean).map((text) => `<p>${escapeHtml(text)}</p>`).join("");
}

function localField(item, field, fallback = "") {
  if (!item) return fallback;
  if (currentLang === "en") {
    const direct = item[`${field}En`];
    const nested = item.en?.[field];
    if (direct !== undefined) return direct;
    if (nested !== undefined) return nested;
  }
  return item[field] ?? fallback;
}

function localArray(item, field) {
  const value = localField(item, field, []);
  return Array.isArray(value) ? value : [];
}

function localTitle(item) {
  const value = localField(item, "title", item?.title || "");
  return currentLang === "en" ? tx(value) : value;
}

function localSummary(item, fallback = "") {
  return localField(item, "summary", fallback || item?.summary || "");
}

function renderProductDetail(item, fallbackText) {
  const detailParagraphs = localArray(item, "detailParagraphs");
  const paragraphs = detailParagraphs.length ? detailParagraphs : [fallbackText];
  if (item.detailLayout === "model-top") {
    return `<div class="inline-flow-slot" data-inline-flow-slot></div>` + paragraphs.filter(Boolean).map((text) => {
      const isHeading = text.length <= 10 && !/[。；，,.]/.test(text);
      return isHeading
        ? `<h4>${escapeHtml(text)}</h4>`
        : `<p>${escapeHtml(text)}</p>`;
    }).join("");
  }
  if (item.detailLayout === "flow-between") {
    let flowInserted = false;
    const insertBefore = item.flowInsertBefore || "适用范围";
    return paragraphs.filter(Boolean).map((text) => {
      const isHeading = text.length <= 8 && !/[。；，,.]/.test(text);
      const block = isHeading
        ? `<h4>${escapeHtml(text)}</h4>`
        : `<p>${escapeHtml(text)}</p>`;
      if (!flowInserted && text === insertBefore) {
        flowInserted = true;
        return `<div class="inline-flow-slot" data-inline-flow-slot></div>${block}`;
      }
      return block;
    }).join("") + (flowInserted ? "" : `<div class="inline-flow-slot" data-inline-flow-slot></div>`);
  }
  return paragraphs.filter(Boolean).map((text) => {
    const isHeading = text.length <= 8 && !/[。；，,.]/.test(text);
    return isHeading
      ? `<h4>${escapeHtml(text)}</h4>`
      : `<p>${escapeHtml(text)}</p>`;
  }).join("");
}

function renderTechDetail(item, fallbackText) {
  const paragraphs = localArray(item, "paragraphs").length ? localArray(item, "paragraphs") : [fallbackText];
  if (item.detailLayout === "consultation-form") {
    const form = currentLang === "zh" ? item.consultationForm : item.consultationFormEn;
    const labels = currentLang === "zh"
      ? { download: "下载咨询表", note: "填写完整后，请通过邮件或电话提交至公司业务部。" }
      : { download: "Download Form", note: "After completion, please submit the form to our business department by email or phone." };
    const requiredNote = localField(item, "consultationRequiredNote", currentLang === "zh" ? "* 号为必填项" : "* Required field");
    return `
      <div class="consultation-form-layout">
        <div class="consultation-form-toolbar">
          <div>
            <h4>${escapeHtml(form.title)}</h4>
            <p>${escapeHtml(form.subtitle)}</p>
          </div>
          <a class="consultation-download" href="${escapeHtml(item.downloadUrl || "")}" download>
            ${escapeHtml(labels.download)}
          </a>
        </div>
        <div class="consultation-sheet">
          <table class="consultation-table">
            <tbody>
              <tr>
                <th>${escapeHtml(form.basic.company)}</th>
                <td></td>
                <th>${escapeHtml(form.basic.project)}</th>
                <td>${escapeHtml(form.basic.projectValue)}</td>
              </tr>
              <tr>
                <th>${escapeHtml(form.basic.date)}</th>
                <td></td>
                <th>${escapeHtml(form.basic.contact)}</th>
                <td></td>
              </tr>
              ${form.sections.map((section) => `
                <tr class="consultation-section-row">
                  <th colspan="4">${escapeHtml(section.title)}</th>
                </tr>
                ${section.rows.map((row) => `
                  <tr>
                    ${row.map((cell) => `
                      <${cell.heading ? "th" : "td"} ${cell.span ? `colspan="${cell.span}"` : ""}>
                        ${escapeHtml(cell.text)}
                      </${cell.heading ? "th" : "td"}>
                    `).join("")}
                  </tr>
                `).join("")}
              `).join("")}
            </tbody>
          </table>
        </div>
        <p class="consultation-required-note">${escapeHtml(requiredNote)}</p>
        <p class="consultation-note">${escapeHtml(labels.note)}</p>
      </div>
    `;
  }
  if (item.detailLayout === "comparison-table") {
    const sections = currentLang === "zh" ? item.comparisonSections : item.comparisonSectionsEn;
    const table = currentLang === "zh" ? item.costTable : item.costTableEn;
    const notes = currentLang === "zh" ? item.costNotes : item.costNotesEn;
    return `
      <div class="comparison-article">
        ${sections.map((section) => `
          <section class="comparison-section">
            <h4>${escapeHtml(section.title)}</h4>
            <p>${escapeHtml(section.text)}</p>
            ${section.showCostTable ? `
              <div class="comparison-cost-table-wrap">
                <table class="comparison-cost-table">
                  <thead>
                    <tr>
                      ${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${table.rows.map((row) => `
                      <tr>
                        ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
              <div class="comparison-cost-notes">
                ${notes.map((note) => `<p>${escapeHtml(note)}</p>`).join("")}
              </div>
            ` : ""}
          </section>
        `).join("")}
      </div>
    `;
  }
  if (item.detailLayout === "diagram-article") {
    return `
      <div class="diagram-article-layout">
        <figure class="diagram-article-figure">
          <img src="${escapeHtml(item.diagramImage || "")}" alt="${escapeHtml(localTitle(item))}" loading="lazy" />
        </figure>
        <div class="diagram-article-copy">
          ${paragraphs.filter(Boolean).map((text) => {
            const isHeading = text.length <= 60 && !/[。；，,.]/.test(text);
            return isHeading
              ? `<h4>${escapeHtml(text)}</h4>`
              : `<p>${escapeHtml(text)}</p>`;
          }).join("")}
        </div>
      </div>
    `;
  }
  if (item.detailLayout === "text-only") {
    return `
      <div class="text-only-article">
        ${paragraphs.filter(Boolean).map((text) => {
          const isHeading = text.length <= 60 && !/[。；，,.]/.test(text);
          return isHeading
            ? `<h4>${escapeHtml(text)}</h4>`
            : `<p>${escapeHtml(text)}</p>`;
        }).join("")}
      </div>
    `;
  }
  if (item.detailLayout === "pump-principle") {
    const principleIntro = localField(item, "principleIntro", fallbackText);
    const principleSteps = localArray(item, "principleSteps");
    const principleNotes = localArray(item, "principleNotes");
    return `
      <div class="pump-principle-layout">
        <div class="tech-article-lead">
          <p>${escapeHtml(principleIntro)}</p>
        </div>
        <figure class="pump-principle-figure">
          <img src="${escapeHtml(item.principleImage || "")}" alt="${escapeHtml(localTitle(item))}" loading="lazy" />
        </figure>
        <div class="pump-step-grid">
          ${principleSteps.map((step, index) => `
            <article class="pump-step-card">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h4>${escapeHtml(step.title)}</h4>
              <p>${escapeHtml(step.text)}</p>
            </article>
          `).join("")}
        </div>
        <section class="pump-principle-notes">
          <h4>${escapeHtml(currentLang === "zh" ? "整体结构与维护关注" : "Overall Structure and Maintenance Focus")}</h4>
          ${principleNotes.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
        </section>
      </div>
    `;
  }
  if (item.detailLayout === "vocs-methods") {
    const methodIntro = localArray(item, "methodIntro");
    const methodSections = localArray(item, "methodSections");
    return `
      <div class="vocs-method-layout">
        <div class="tech-article-lead">
          ${methodIntro.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
        </div>
        <div class="vocs-method-grid">
          ${methodSections.map((method, index) => `
            <article class="vocs-method-card ${method.image ? "" : "is-text-only"}">
              <div class="vocs-method-index">${String(index + 1).padStart(2, "0")}</div>
              <h4>${escapeHtml(method.title)}</h4>
              <p>${escapeHtml(method.text)}</p>
              ${method.image ? `
                <figure>
                  <img src="${escapeHtml(method.image)}" alt="${escapeHtml(method.title)}工艺流程图" loading="lazy" />
                </figure>
              ` : ""}
            </article>
          `).join("")}
        </div>
        ${localField(item, "methodFooter", "") ? `<p class="vocs-method-footer">${escapeHtml(localField(item, "methodFooter", ""))}</p>` : ""}
      </div>
    `;
  }
  if (item.detailLayout === "article-flow") {
    const [lead, ...rest] = paragraphs.filter(Boolean);
    return `
      <div class="tech-article-layout">
        <div class="tech-article-lead">
          ${lead ? `<p>${escapeHtml(lead)}</p>` : ""}
        </div>
        ${renderArticleImages(item.images || [])}
        <div class="inline-flow-slot" data-inline-flow-slot></div>
        <div class="tech-article-copy">
          ${rest.map((text) => {
            const isHeading = text.length <= 80 && !/[。；，,.]/.test(text);
            return isHeading
              ? `<h4>${escapeHtml(text)}</h4>`
              : `<p>${escapeHtml(text)}</p>`;
          }).join("")}
        </div>
      </div>
    `;
  }
  return renderParagraphs(paragraphs);
}

function renderCaseDetail(item) {
  const paragraphs = localArray(item, "paragraphs").length
    ? localArray(item, "paragraphs")
    : [localSummary(item, item.summary)];
  return `
    <div class="case-plain-layout">
      <figure class="case-plain-figure">
        <img src="${escapeHtml(item.image || "")}" alt="${escapeHtml(localTitle(item))}" loading="lazy" />
      </figure>
      <div class="case-plain-copy">
        ${paragraphs.filter(Boolean).map((text) => {
          const isHeading = text.length <= 42 && !/[。；，,.]/.test(text);
          return isHeading
            ? `<h4>${escapeHtml(text)}</h4>`
            : `<p>${escapeHtml(text)}</p>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderArticleImages(images = []) {
  if (!images.length) return "";
  return `
    <div class="article-gallery image-count-${images.length}">
      ${images.map((src, index) => `
        <figure>
          <img src="${escapeHtml(src)}" alt="" loading="lazy" />
          ${index === 0 ? `<figcaption>${escapeHtml(currentLang === "zh" ? "图文资料" : "Article image")}</figcaption>` : ""}
        </figure>
      `).join("")}
    </div>
  `;
}

function articleCover(item) {
  return item.coverImage || item.images?.[0] || "/assets/hero/factory-realistic.png";
}

function t(key) {
  return labels[currentLang][key] || labels.zh[key] || key;
}

function tx(value) {
  if (currentLang === "zh") return value;
  return itemEn[value] || flowEn[value] || value;
}

function shortEn(value) {
  return currentLang === "zh" ? value : tx(value);
}

function flowById(id) {
  return siteData.flows.find((flow) => flow.id === id) || siteData.flows[0];
}

function renderStaticLabels() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("[data-lang-toggle]").textContent = currentLang === "zh" ? "EN" : "中文";
  document.querySelectorAll("[data-toggle-section]").forEach((node) => {
    node.textContent = t("ui.more");
  });
  document.querySelectorAll("[data-close-more]").forEach((node) => {
    node.textContent = t("ui.less");
  });
}

function renderMetrics() {
  $("[data-metrics]").innerHTML = siteData.metrics.map((item) => `
    <article class="metric">
      <strong>${escapeHtml(item.value)}</strong>
      <span>${escapeHtml(currentLang === "zh" ? item.label : contentEn.metrics[item.label] || item.label)}</span>
    </article>
  `).join("");
}

function renderCulture() {
  $("[data-culture]").innerHTML = siteData.culture.map((item) => {
    const en = contentEn.culture[item.title];
    return `
      <article class="culture-card">
        <h3>${escapeHtml(currentLang === "zh" ? item.title : en?.[0] || item.title)}</h3>
        <p>${escapeHtml(currentLang === "zh" ? item.text : en?.[1] || item.text)}</p>
      </article>
    `;
  }).join("");
}

function renderNews() {
  const company = siteData.news || [];
  const industry = siteData.industryNews || [];
  const homeNews = [...company.slice(0, 2), ...industry.slice(0, 2)];
  $("[data-news]").innerHTML = homeNews.map((item) => `
    <button class="news-card" type="button" data-open-detail="article:${escapeHtml(item.id)}">
      <span class="news-thumb"><img src="${escapeHtml(articleCover(item))}" alt="${escapeHtml(tx(item.title))}" loading="lazy" /></span>
      <span class="news-copy">
        <time>${escapeHtml(item.date)} · ${escapeHtml(currentLang === "zh" ? item.category : "News")}</time>
        <strong>${escapeHtml(localTitle(item))}</strong>
        <span>${escapeHtml(localSummary(item, "Company updates and technical activities related to VOC treatment, solvent recovery and safe engineering delivery."))}</span>
      </span>
    </button>
  `).join("");
  renderFullNews();
}

function renderProducts() {
  const render = (item) => `
    <button class="project-card" type="button" data-open-detail="product:${escapeHtml(item.id)}">
      <span class="image-wrap"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(tx(item.title))}" /></span>
      <span class="card-meta">${escapeHtml(currentLang === "zh" ? item.category : "Process Equipment")}</span>
      <strong>${escapeHtml(tx(item.title))}</strong>
      <span>${escapeHtml(currentLang === "zh" ? item.summary : productSummaryEn(item))}</span>
    </button>
  `;
  $("[data-products]").innerHTML = siteData.products.slice(0, 4).map(render).join("");
  $("[data-products-full]").innerHTML = siteData.products.map(render).join("");
}

function productSummaryEn(item) {
  if (item.summaryEn) return item.summaryEn;
  const flow = flowById(item.flowId);
  return `${tx(flow.medium)} process equipment for ${tx(flow.type).toLowerCase()}, shown with original imagery and generated 3D process logic.`;
}

function renderTechnology() {
  const render = (item) => {
    const flow = flowById(item.flowId);
    return `
      <button class="tech-card" type="button" data-open-detail="tech:${escapeHtml(item.id)}">
        <span class="tech-date">${escapeHtml(item.date)}</span>
        <strong>${escapeHtml(localTitle(item))}</strong>
        <span>${escapeHtml(localSummary(item, "Open for the full technical article and engineering notes."))}</span>
        <em>${escapeHtml(item.detailLayout === "text-only" || item.detailLayout === "pump-principle" ? (currentLang === "zh" ? item.category : "Technical Article") : `${tx(flow.type)} · ${tx(flow.medium)}`)}</em>
      </button>
    `;
  };
  $("[data-technology]").innerHTML = siteData.technicalServices.slice(0, 4).map(render).join("");
  $("[data-technology-full]").innerHTML = siteData.technicalServices.map(render).join("");
}

function renderCases() {
  const render = (item) => `
    <button class="case-card" type="button" data-open-detail="case:${escapeHtml(item.id)}">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(tx(item.title))}" />
      <span>
        <strong>${escapeHtml(tx(item.title))}</strong>
        <em>${escapeHtml(localSummary(item, "Industrial VOC treatment and solvent recovery reference project."))}</em>
      </span>
    </button>
  `;
  $("[data-cases]").innerHTML = siteData.cases.slice(0, 4).map(render).join("");
  $("[data-cases-full]").innerHTML = siteData.cases.map(render).join("");
}

function renderFullNews() {
  const all = [...(siteData.news || []), ...(siteData.industryNews || [])];
  const items = newsFilter === "company"
    ? siteData.news || []
    : newsFilter === "industry"
      ? siteData.industryNews || []
      : all;
  $("[data-news-tabs]").innerHTML = [
    ["all", `${t("ui.all")} ${all.length}`],
    ["company", `${t("ui.companyNews")} ${(siteData.news || []).length}`],
    ["industry", `${t("ui.industryNews")} ${(siteData.industryNews || []).length}`]
  ].map(([key, label]) => `
    <button class="${newsFilter === key ? "is-active" : ""}" type="button" data-news-filter="${key}">${escapeHtml(label)}</button>
  `).join("");
  $("[data-news-full]").innerHTML = items.map((item) => `
    <button class="news-card full-news-card" type="button" data-open-detail="article:${escapeHtml(item.id)}">
      <span class="news-thumb"><img src="${escapeHtml(articleCover(item))}" alt="${escapeHtml(tx(item.title))}" loading="lazy" /></span>
      <span class="news-copy">
        <time>${escapeHtml(item.date)} · ${escapeHtml(currentLang === "zh" ? item.category : "News")}</time>
        <strong>${escapeHtml(localTitle(item))}</strong>
        <span>${escapeHtml(localSummary(item, "Open for the full article, images and original text."))}</span>
      </span>
    </button>
  `).join("");
}

function equipmentForStep(step, index, flow) {
  const text = `${step}${flow.type}${flow.medium}`;
  if (text.includes("吸收") || text.includes("塔") || text.includes("精馏") || text.includes("蒸馏")) return "tower";
  if (text.includes("冷凝") || text.includes("换热") || text.includes("冷却") || text.includes("预冷")) return "condenser";
  if (text.includes("泵") || text.includes("循环") || text.includes("真空") || text.includes("脱附") || text.includes("解析")) return "pump";
  if (text.includes("分离") || text.includes("分层") || text.includes("储") || text.includes("回收") || text.includes("暂存")) return "separator";
  if (text.includes("过滤") || text.includes("预处理") || text.includes("除雾") || text.includes("除尘")) return "filter";
  if (index === 0) return "inlet";
  if (index === flow.steps.length - 1) return "outlet";
  return "vessel";
}

function equipmentSvg(kind) {
  const common = {
    inlet: '<path d="M18 58h94l22 22-22 22H18z"></path><circle cx="42" cy="80" r="11"></circle>',
    outlet: '<path d="M24 50h86l28 30-28 30H24z"></path><path d="M52 80h56"></path>',
    vessel: '<rect x="42" y="22" width="68" height="116" rx="28"></rect><path d="M42 54h68M42 106h68"></path>',
    tower: '<path d="M58 16h52l14 128H44z"></path><path d="M52 52h64M48 86h72M45 120h78"></path>',
    condenser: '<rect x="26" y="42" width="116" height="76" rx="18"></rect><path d="M42 64c18-24 42 24 60 0s30 18 30 18M42 96c18-24 42 24 60 0s30 18 30 18"></path>',
    pump: '<circle cx="78" cy="82" r="42"></circle><path d="M78 50v64l34-32z"></path><path d="M18 82h18M120 82h24"></path>',
    separator: '<rect x="38" y="28" width="84" height="104" rx="18"></rect><path d="M38 72h84M56 102h48"></path><circle cx="80" cy="52" r="8"></circle>',
    filter: '<rect x="32" y="36" width="100" height="92" rx="16"></rect><path d="M52 52v60M72 52v60M92 52v60M112 52v60"></path>'
  };
  return common[kind] || common.vessel;
}

function openDetail(token) {
  const [type, id] = token.split(":");
  let item;
  let flow;
  let image = "";
  let images = [];
  let kicker = "";
  let detail = "";
  let summary = "";

  if (type === "product") {
    item = siteData.products.find((entry) => entry.id === id);
    flow = flowById(item.flowId);
    image = item.image;
    images = [item.image];
    kicker = currentLang === "zh" ? item.category : "Process Equipment";
    detail = currentLang === "zh"
      ? renderProductDetail(item, item.detail)
      : renderProductDetail(item, productSummaryEn(item));
    summary = currentLang === "zh" ? item.summary : productSummaryEn(item);
  }

  if (type === "tech") {
    item = siteData.technicalServices.find((entry) => entry.id === id);
    flow = flowById(item.flowId);
    image = flow.pdfPreview;
    images = item.images || [];
    kicker = t("modal.technology");
    summary = localSummary(item, "Open for the full technical article and engineering notes.");
    detail = renderTechDetail(item, `${summary} ${t("modal.techDetail")}`);
  }

  if (type === "case") {
    item = siteData.cases.find((entry) => entry.id === id);
    flow = null;
    image = item.image;
    images = [];
    kicker = t("modal.case");
    summary = localSummary(item, "Industrial VOC treatment and solvent recovery reference project.");
    detail = renderCaseDetail(item);
  }

  if (type === "article") {
    item = [...(siteData.news || []), ...(siteData.industryNews || [])]
      .find((entry) => entry.id === id);
    if (!item) return;
    images = item.images || [];
    image = "";
    kicker = item.category === "行业资讯" ? t("modal.industry") : t("modal.news");
    summary = `${item.date} · ${currentLang === "zh" ? item.category : "News"}`;
    const articleParagraphs = localArray(item, "paragraphs");
    detail = articleParagraphs.length ? renderParagraphs(articleParagraphs) : renderParagraphs([localSummary(item, item.summary)]);
  }

  if (type === "flow") {
    flow = flowById(id);
    item = { title: flow.title, summary: `${flow.medium} · ${flow.type}` };
    image = flow.pdfPreview;
    images = [flow.pdfPreview];
    kicker = t("modal.library");
    summary = `${tx(flow.medium)} · ${tx(flow.type)}`;
    detail = renderParagraphs([t("modal.customDetail")]);
  }

  if (!item || (type !== "article" && type !== "case" && !flow)) return;

  const isArticle = type === "article";
  const isCase = type === "case";
  const isReadingLayout = isArticle || isCase || item.detailLayout === "article-flow" || item.detailLayout === "vocs-methods" || item.detailLayout === "text-only" || item.detailLayout === "pump-principle" || item.detailLayout === "consultation-form" || item.detailLayout === "comparison-table" || item.detailLayout === "diagram-article";
  const hideFlowSection = isArticle || isCase || item.detailLayout === "vocs-methods" || item.detailLayout === "text-only" || item.detailLayout === "pump-principle" || item.detailLayout === "consultation-form" || item.detailLayout === "comparison-table" || item.detailLayout === "diagram-article";
  const usesCustomFlow = !isArticle && Boolean(item.customFlowPage);
  const hidePdfPreview = isArticle || Boolean(item.hidePdfPreview);
  const detailImages = item.detailLayout === "article-flow" ? [] : (item.hidePdfPreview && !item.keepDetailImage ? [] : images);
  const hideHeroImage = isReadingLayout || Boolean(item.hideHeroImage);

  $("[data-modal-kicker]").textContent = kicker;
  $("[data-modal-title]").textContent = localTitle(item);
  $("[data-modal-summary]").textContent = summary;
  $("[data-modal-detail]").innerHTML = detail + renderArticleImages(detailImages);
  $("[data-modal]").classList.toggle("is-news-modal", isReadingLayout);
  $("[data-modal-image]").hidden = hideHeroImage;
  $("[data-modal-body]").classList.toggle("is-article", isReadingLayout);
  $("[data-modal-body]").classList.toggle("has-custom-flow", usesCustomFlow);
  $("[data-modal-body]").classList.toggle("flow-between", item.detailLayout === "flow-between");
  $("[data-modal-body]").classList.toggle("article-flow", item.detailLayout === "article-flow");
  $("[data-modal-body]").classList.toggle("vocs-methods", item.detailLayout === "vocs-methods");
  $("[data-modal-body]").classList.toggle("text-only", item.detailLayout === "text-only");
  $("[data-modal-body]").classList.toggle("pump-principle", item.detailLayout === "pump-principle");
  $("[data-modal-body]").classList.toggle("consultation-form", item.detailLayout === "consultation-form");
  $("[data-modal-body]").classList.toggle("comparison-table", item.detailLayout === "comparison-table");
  $("[data-modal-body]").classList.toggle("diagram-article", item.detailLayout === "diagram-article");
  $("[data-modal-body]").classList.toggle("case-plain", isCase);
  $("[data-modal-body]").classList.toggle("model-top", item.detailLayout === "model-top");
  $("[data-modal-pdf-wrap]").hidden = hidePdfPreview;
  $("[data-modal-flow-section]").hidden = hideFlowSection;
  $("[data-modal-flow-title]").textContent = usesCustomFlow
    ? (localField(item, "customFlowTitle", "") || (currentLang === "zh" ? "动态流程图" : "Dynamic Process Flow"))
    : t("modal.flow");
  if (hideFlowSection) {
    $("[data-modal-image]").removeAttribute("src");
    $("[data-modal-pdf]").removeAttribute("src");
    $("[data-modal-flow]").src = "about:blank";
  } else {
    if (hideHeroImage) {
      $("[data-modal-image]").removeAttribute("src");
    } else {
      $("[data-modal-image]").hidden = false;
      $("[data-modal-image]").src = image;
    }
    if (hidePdfPreview) {
      $("[data-modal-pdf]").removeAttribute("src");
    } else {
      $("[data-modal-pdf]").src = flow.pdfPreview;
    }
    const customJoin = item.customFlowPage?.includes("?") ? "&" : "?";
    $("[data-modal-flow]").src = item.customFlowPage
      ? `${item.customFlowPage}${customJoin}lang=${currentLang}`
      : `${withBase("/flow3d.html")}?id=${encodeURIComponent(flow.id)}&lang=${currentLang}`;
  }
  const inlineSlot = document.querySelector("[data-inline-flow-slot]");
  const flowSection = $("[data-modal-flow-section]");
  if (inlineSlot && flowSection) {
    inlineSlot.replaceChildren(flowSection);
  } else {
    $("[data-modal-body]").append(flowSection);
  }
  $("[data-modal]").setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  $("[data-modal]").setAttribute("aria-hidden", "true");
  $("[data-modal]").classList.remove("is-news-modal");
  $("[data-modal-image]").hidden = false;
  $("[data-modal-body]").classList.remove("has-custom-flow");
  $("[data-modal-body]").classList.remove("flow-between");
  $("[data-modal-body]").classList.remove("article-flow");
  $("[data-modal-body]").classList.remove("vocs-methods");
  $("[data-modal-body]").classList.remove("text-only");
  $("[data-modal-body]").classList.remove("pump-principle");
  $("[data-modal-body]").classList.remove("consultation-form");
  $("[data-modal-body]").classList.remove("comparison-table");
  $("[data-modal-body]").classList.remove("diagram-article");
  $("[data-modal-body]").classList.remove("case-plain");
  $("[data-modal-body]").classList.remove("model-top");
  $("[data-modal-body]").append($("[data-modal-flow-section]"));
  $("[data-modal-flow-title]").textContent = t("modal.flow");
  $("[data-modal-flow]").src = "about:blank";
  document.body.classList.remove("modal-open");
}

function openMoreSection(key) {
  const section = document.querySelector(`[data-more-section="${key}"]`);
  if (!section) return;
  section.hidden = false;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeMoreSection(key) {
  const section = document.querySelector(`[data-more-section="${key}"]`);
  if (!section) return;
  section.hidden = true;
  const anchor = key === "products" ? "projects" : key;
  document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindInteractions() {
  document.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-open-detail]");
    if (detailButton) {
      openDetail(detailButton.dataset.openDetail);
      return;
    }
    const toggleButton = event.target.closest("[data-toggle-section]");
    if (toggleButton) {
      openMoreSection(toggleButton.dataset.toggleSection);
      return;
    }
    const closeMoreButton = event.target.closest("[data-close-more]");
    if (closeMoreButton) {
      closeMoreSection(closeMoreButton.dataset.closeMore);
      return;
    }
    const newsFilterButton = event.target.closest("[data-news-filter]");
    if (newsFilterButton) {
      newsFilter = newsFilterButton.dataset.newsFilter;
      renderFullNews();
      return;
    }
    if (event.target.closest("[data-close-modal]")) closeModal();
  });

  $("[data-menu-button]").addEventListener("click", () => {
    $("[data-nav]").classList.toggle("is-open");
  });

  $("[data-lang-toggle]").addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    renderAll();
  });

  $("[data-inquiry-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = $("[data-form-status]");
    try {
      await api(withBase("/api/inquiries"), {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      form.reset();
      status.textContent = t("form.success");
    } catch (error) {
      status.textContent = error.message;
    }
  });

  window.addEventListener("scroll", updateScrollProcess, { passive: true });
  window.addEventListener("resize", resizeHeroCanvas);
}

function renderCompany() {
  const { company } = siteData;
  const name = currentLang === "zh" ? company.name : contentEn.companyName;
  const tagline = currentLang === "zh" ? company.tagline : contentEn.tagline;
  const summary = currentLang === "zh" ? company.summary : contentEn.summary;
  document.title = `${name} | ${tagline}`;
  const brandName = $("[data-company-name]");
  if (brandName) brandName.textContent = name;
  const brandEn = $("[data-company-en]");
  if (brandEn) brandEn.textContent = contentEn.companyName;
  $("[data-hero-name]").textContent = name;
  $("[data-hero-summary]").textContent = tagline;
  $("[data-about-title]").textContent = tagline;
  $("[data-about-summary]").textContent = summary;
  $("[data-phone]").textContent = `${t("contact.phone")}：${company.phone}`;
  $("[data-email]").textContent = `${t("contact.email")}：${company.email}`;
  $("[data-address]").textContent = currentLang === "zh" ? company.address : contentEn.address;
  $("[data-footer-name]").textContent = name;
  $("[data-footer-icp]").textContent = company.icp;
}

function renderAll() {
  renderStaticLabels();
  renderCompany();
  renderMetrics();
  renderCulture();
  renderNews();
  renderProducts();
  renderTechnology();
  renderCases();
  updateScrollProcess();
}

let heroCanvas;
let heroCtx;
let heroSize = { width: 0, height: 0, ratio: 1 };
let heroStart = 0;

function resizeHeroCanvas() {
  if (!heroCanvas) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = heroCanvas.getBoundingClientRect();
  heroSize = { width: rect.width, height: rect.height, ratio };
  heroCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
  heroCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
  heroCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawTank(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(200,240,90,.65)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.13)";
  ctx.fillRect(x + 10, y + 16, w - 20, 8);
  ctx.fillRect(x + 10, y + h - 28, w - 20, 8);
  ctx.restore();
}

function animateHero(time) {
  if (!heroStart) heroStart = time;
  const tms = (time - heroStart) / 1000;
  const ctx = heroCtx;
  const w = heroSize.width;
  const h = heroSize.height;
  const scroll = Math.min(1, window.scrollY / Math.max(1, h));
  ctx.clearRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#06231f");
  grad.addColorStop(0.45, "#104234");
  grad.addColorStop(1, "#091715");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(200,240,90,.08)";
  ctx.lineWidth = 1;
  for (let x = -80 + (tms * 12) % 80; x < w + 80; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - h * 0.35, h);
    ctx.stroke();
  }
  for (let y = h * 0.22; y < h; y += 46) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(tms + y) * 4);
    ctx.lineTo(w, y + Math.sin(tms + y) * 4);
    ctx.stroke();
  }

  const baseY = h * (0.62 - scroll * 0.08);
  const offset = Math.sin(tms * 0.7) * 8;
  drawTank(ctx, w * 0.56, baseY - 150 + offset, 92, 178, "rgba(20,104,78,.9)");
  drawTank(ctx, w * 0.66, baseY - 198 - offset, 78, 226, "rgba(28,125,91,.9)");
  drawTank(ctx, w * 0.77, baseY - 132 + offset * 0.6, 104, 160, "rgba(18,89,70,.92)");

  ctx.strokeStyle = "rgba(119,215,173,.78)";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  const pipeY = baseY - 44;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, pipeY);
  ctx.bezierCurveTo(w * 0.32, pipeY - 90, w * 0.48, pipeY + 40, w * 0.59, pipeY - 30);
  ctx.lineTo(w * 0.84, pipeY - 8);
  ctx.stroke();

  ctx.strokeStyle = "rgba(200,240,90,.95)";
  ctx.lineWidth = 3;
  const pulse = (tms * 90) % (w * 0.75);
  ctx.beginPath();
  ctx.moveTo(w * 0.1 + pulse, pipeY);
  ctx.lineTo(w * 0.16 + pulse, pipeY - 18);
  ctx.stroke();

  for (let i = 0; i < 38; i += 1) {
    const px = (i * 97 + tms * (16 + i % 5) * (1 + scroll)) % w;
    const py = (i * 53 + Math.sin(tms + i) * 30) % h;
    ctx.fillStyle = i % 4 === 0 ? "rgba(200,240,90,.7)" : "rgba(119,215,173,.34)";
    ctx.beginPath();
    ctx.arc(px, py, i % 4 === 0 ? 2.3 : 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(4,18,16,.42)";
  ctx.fillRect(0, h * 0.78, w, h * 0.22);
  requestAnimationFrame(animateHero);
}

function setupHeroCanvas() {
  heroCanvas = $("[data-hero-canvas]");
  heroCtx = heroCanvas.getContext("2d");
  resizeHeroCanvas();
  requestAnimationFrame(animateHero);
}

function updateScrollProcess() {
  const section = $("[data-scroll-process]");
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const progress = Math.min(0.999, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
  const index = Math.min(3, Math.floor(progress * 4));
  section.style.setProperty("--process", String(index));
  const [title, text] = processStages[currentLang][index];
  const titleNode = $("[data-process-title]");
  const textNode = $("[data-process-text]");
  if (section.dataset.processIndex !== String(index) || titleNode.textContent !== title) {
    section.dataset.processIndex = String(index);
    const copyNode = $("[data-process-copy]");
    clearTimeout(processCopyTimer);
    if (!titleNode.textContent || titleNode.textContent === title) {
      titleNode.textContent = title;
      textNode.textContent = text;
    } else {
      copyNode.classList.add("is-fading");
      processCopyTimer = setTimeout(() => {
        titleNode.textContent = title;
        textNode.textContent = text;
        copyNode.classList.remove("is-fading");
      }, 180);
    }
  }
  const frame = $(".equipment-model-frame");
  if (frame?.contentWindow) {
    frame.contentWindow.postMessage({
      type: "equipment-rotation",
      rotation: progress * Math.PI * 2
    }, "*");
  }
}

async function boot() {
  siteData = await loadSiteData();
  renderAll();
  bindInteractions();
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>网站加载失败</h1><p>${escapeHtml(error.message)}</p></main>`;
});
