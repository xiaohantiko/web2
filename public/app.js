let siteData = {};
let currentLang = "zh";
let newsFilter = "all";
let homeRevealObserver;
let activeHeroMode = "distillation";
let currentTheme = "dark";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function assetPath(value) {
  if (!value || /^(https?:|data:|blob:|mailto:|tel:|#|about:)/.test(value)) return value;
  return value.startsWith("/") ? value.slice(1) : value;
}

const labels = {
  zh: {
    "company.name": "石家庄辰泰环境科技有限公司",
    "company.logoAlt": "石家庄辰泰环境科技有限公司",
    "nav.home": "网站首页",
    "nav.profile": "关于我们",
    "nav.manufacturing": "智能制造",
    "nav.qualifications": "资质能力",
    "nav.innovation": "科研创新",
    "nav.industries": "业务领域",
    "nav.solutions": "工艺解决方案",
    "nav.business": "主营业务",
    "nav.products": "产品体系",
    "nav.news": "新闻资讯",
    "nav.inquiry": "客户咨询",
    "nav.contact": "联系我们",
    "nav.home.profile": "公司简介",
    "nav.home.news": "新闻资讯",
    "nav.home.contact": "联系我们",
    "nav.profile.positioning": "企业定位",
    "nav.profile.rd": "研发制造",
    "nav.profile.quality": "质量体系",
    "nav.profile.qualifications": "资质能力",
    "nav.news.all": "全部新闻",
    "nav.news.company": "公司新闻",
    "nav.news.industry": "行业资讯",
    "nav.innovation.team": "科技团队建设",
    "nav.innovation.process": "流程设计",
    "nav.innovation.cooperation": "校企合作",
    "nav.innovation.infrastructure": "研发基础设施",
    "nav.innovation.results": "研发成果展示",
    "nav.industries.pharma": "医药行业",
    "nav.industries.chemical": "化工行业",
    "nav.industries.energy": "新能源行业",
    "nav.industries.materials": "新材料行业",
    "nav.solutions.distillation": "精馏分离",
    "nav.solutions.h2s": "硫化氢治理",
    "nav.solutions.vocs": "VOCs回收治理",
    "nav.solutions.vps": "活性炭VPS回收",
    "nav.solutions.mvr": "MVR系统",
    "nav.contact.details": "联系方式",
    "nav.contact.inquiry": "客户咨询表",
    "home.capabilitiesNav": "核心能力",
    "home.deliveryNav": "工程交付",
    "channel.companyOverview": "公司简介",
    "channel.rdCenter": "研发中心",
    "channel.workshop": "车间设备",
    "channel.subsidiaries": "子公司介绍",
    "channel.qualitySystem": "质量管理体系",
    "channel.companyHistory": "发展进程",
    "hero.eyebrow": "石家庄辰泰环境科技有限公司",
    "theme.light": "亮",
    "theme.dark": "暗",
    "theme.toLight": "切换为亮色主题",
    "theme.toDark": "切换为暗色主题",
    "hero.title": "资源循环利用一体化工艺技术供应商",
    "hero.subtitle": "化工行业节能降耗专家",
    "hero.copy": "聚焦化工、新能源、新材料等行业精馏分离提纯、含硫化氢尾气治理及硫回收工艺、有机尾气治理等，为化工、医药、新能源、新材料等行业提供技术咨询、工程设计、设备制造、安装调试和售后服务。",
    "hero.primary": "查看业务领域",
    "hero.secondary": "联系我们",
    "hero.land": "占地面积",
    "hero.plant": "建筑厂房",
    "hero.iso": "质量体系认证",
    "hero.ip": "知识产权",
    "hero.ipValue": "50+",
    "hero.expertise": "深耕",
    "hero.expertiseValue": "20年+",
    "hero.clients": "客户",
    "hero.clientsValue": "1000+",
    "hero.railDistillation": "精馏分离",
    "hero.railSolvent": "溶剂回收",
    "hero.railGas": "尾气治理",
    "hero.railManufacturing": "装备制造",
    "hero.consoleTitle": "工艺交互驾驶舱",
    "hero.consoleHint": "悬停切换能力焦点",
    "hero.modeGas": "尾气治理",
    "hero.modeSolvent": "溶剂回收",
    "hero.modeManufacturing": "装备制造",
    "hero.modeGasCopy": "从组分识别、吸附脱附到冷凝回收，形成可落地的尾气治理系统。",
    "hero.modeSolventCopy": "把回收液精制、萃取精馏和能量回用接入同一套工程方案。",
    "hero.modeManufacturingCopy": "以切割、焊接、装配和现场安装能力支撑非标设备成套交付。",
    "home.capabilitiesMore": "查看完整工艺",
    "home.capabilitiesTitle": "核心能力",
    "home.capabilitiesCopy": "精馏分离、溶剂回收、尾气治理、装备制造，进入详情页查看完整工艺。",
    "home.capabilityDistillation": "面向提纯、分离、节能精馏和溶剂精制。",
    "home.capabilitySolvent": "围绕冷凝、吸收、吸附、解析与资源化回用。",
    "home.capabilityGas": "覆盖有机尾气、含硫尾气和达标排放治理。",
    "home.capabilityManufacturing": "配套非标设备制造、安装调试与现场服务。",
    "home.deliveryTitle": "工程交付",
    "home.deliveryCopy": "从实验验证、工艺设计到设备制造、安装调试，按项目链路推进。",
    "home.deliveryStep1": "实验验证",
    "home.deliveryStep2": "工艺设计",
    "home.deliveryStep3": "设备制造",
    "home.deliveryStep4": "安装调试",
    "home.deliveryStep5": "售后服务",
    "home.industriesCopy": "覆盖化工、医药、新能源、新材料项目，详情页展开行业应用。",
    "home.newsCopy": "展示公司动态与行业观察，完整内容进入新闻资讯页查看。",
    "profile.title": "公司简介",
    "profile.card1Kicker": "Company Overview",
    "profile.card1Title": "资源循环利用一体化供应商",
    "profile.card2Kicker": "R&D Center",
    "profile.card2Title": "技术研发中心",
    "profile.card3Kicker": "Smart Manufacturing",
    "profile.card3Title": "智能化高端加工设备",
    "profile.p1": "石家庄辰泰环境科技有限公司是一家专注有机溶剂回收治理的高新技术企业。可为不同类型行业提供绿色化工分离技术一一数智化的液相和气相能源耦合利用一体化工艺系统，包括精馏分离、萃取分离绿色能源回收系统，含硫化氢尾气综合治理及硫回收技术，有机尾气能源回收系统，数智化蒸发结晶系统等，并承接EPC总包（技术咨询、工程设计、生产制造、安装调试、培训及售后）一站式服务。公司技术团队不断开发新工艺包的应用，能完美解决各行业所有溶剂的循环回收利用。自主创新的气相与液相分离系统融合设计，实现“废水、废气”都达标排放的双赢效果，能耗节省高达40-70%以上，行业技术国内领先",
    "profile.p2": "公司拥有化工专业硕士、高级工程师数人，拥有压力容器制造（含安装、改造）许可证，属于国家级高新技术企业、河北省“专精特新”企业、河北省创新型企业。公司设立精馏技术研发中心，是河北省工业企业研发机构B级研发中心，公司组建了“化工节能过程集成与资源利用研究室”，针对多家大中型化工企业，尤其是超高分子量聚乙烯材料、隔膜材料、PE新材料等行业的技术难题，创造了显著的经济效益和社会效益。",
    "profile.p3": "公司拥有自动化以及智能化高端加工和检测设备，配备先进的激光切割机、自动等离子焊机、管板自动焊机、法兰焊机、氩弧自动焊机以及铣、刨、磨、镗、钻、折弯成型等专业化机械加工设备。拥有各种非标设备制造及装配工艺的高级技师及中级以上技工数十人，公司成立至今，已成功研发设计并建成运行千余套工业化精馏装置。",
    "profile.p4": "公司同时还拥有多支专业经验丰富的工程安装队伍，配备多种先进的施工机械长期在项目现场进行设备、管道、电气仪表、钢结构、自控系统等工程安装服务，应用严格、全面的质量管理体系，成功完成了多个重大工程项目，施工地域覆盖全国各省市。",
    "profile.more": "查看完整介绍",
    "manufacturing.title": "智能制造与装备交付",
    "manufacturing.more": "查看制造能力",
    "manufacturing.videoKicker": "Laser Cutting",
    "manufacturing.videoTitle": "高端加工设备动态展示",
    "manufacturing.step1Title": "工艺设计",
    "manufacturing.step1Text": "结合物料性质、风量浓度和回收目标，确定分离与治理路线。",
    "manufacturing.step2Title": "装备制造",
    "manufacturing.step2Text": "依托切割、焊接、机加工和装配能力完成核心设备制造。",
    "manufacturing.step3Title": "现场交付",
    "manufacturing.step3Text": "完成安装、调试、培训与运行维护，形成全流程工程闭环。",
    "profile.pageTitle": "关于我们",
    "profile.pageCopy": "根据公司宣传资料整理企业定位、技术路线、发展历程、研发制造能力和合作方向。",
    "profile.coreTitle": "企业定位",
    "profile.coreText": "辰泰环保以有机溶媒回收治理为核心，面向化工、医药、高分子材料、锂电隔膜、纤维、涂布等行业，提供从工艺路线判断到装备制造、现场安装、系统调试和运行培训的全流程服务。",
    "profile.techTitle": "关键技术路线",
    "profile.techText": "公司把气相回收系统和液相分离系统统一规划，将尾气治理、回收液精制、不凝气处理和冷热量回用纳入同一套工程方案，降低能耗和二次污染风险。",
    "profile.rdTitle": "研发与制造",
    "profile.rdText": "公司建有工程实验室和专业研发中心，持续投入新工艺开发和人才引进，可进行液相溶媒回收过程模拟、参数分析、工艺验证，并配套数控焊接、切割、钻床及自动化加工装备。",
    "profile.historyTitle": "发展进程",
    "profile.history2007": "公司成立于石家庄市柳董工业区，开始服务国内工业客户。",
    "profile.history2009": "建立生产基地，具备自主设计和制作能力。",
    "profile.history2012": "投资购置生产建设用地，筹建综合生产基地。",
    "profile.history2016": "生产基地主厂房落成并投入使用，销售额突破 3000 万元。",
    "profile.history2017": "实验中心投入使用，二氯甲烷、白油深度分离中试成功，精馏分离技术完成验证。",
    "profile.history2018": "与日本大阪燃气建立战略合作关系，取得国家防爆认证资质。",
    "profile.history2020": "通过高新技术企业资质，获国家科技型中小企业认定。",
    "profile.history2022": "获专精特新企业认定，取得压力容器相关资质，市级工业研发机构能力持续完善。",
    "profile.history2023": "乙醚制造系统性整体工程一次开车成功。",
    "profile.history2024": "高新技术企业和国家级科技型中小企业复审通过，薄膜行业精馏与尾气系统工程落地。",
    "profile.history2025": "获得市级绿色工厂，取得机电安装贰级、环保工程贰级资质。",
    "profile.founded": "成立时间",
    "profile.rdInvest": "年度研发投入",
    "profile.greenFactory": "市级绿色工厂",
    "profile.factoryTitle": "研发制造能力",
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
    "business.introTitle": "围绕“气相回收 + 液相分离 + 能量回用”的工程体系",
    "business.introText": "公司以有机溶媒回收治理为核心，把尾气吸收吸附、冷凝回收、精馏萃取、含硫废气治理和 PSA 配套系统进行组合设计，可覆盖从原料、过程气、回收液到成品精制的整包工艺。",
    "business.item1Title": "工业有机尾气治理",
    "business.item1Text": "面向化工、医药、印刷、涂布、新材料等行业，提供吸附、脱附、冷凝、回收、达标排放一体化解决方案。",
    "business.item2Title": "液相萃取及精馏分离工艺设备",
    "business.item2Text": "围绕溶剂回收、节能精馏和资源利用，完成从基础设计、设备制作、安装施工到调试验收的全过程工作。",
    "business.item3Title": "工业臭气尾气治理",
    "business.item3Text": "针对硫化氢、恶臭气体及复合尾气，进行工艺组合设计和系统化治理。",
    "business.item4Title": "整包工艺与配套系统",
    "business.item4Text": "承接 PE 高分子材料、醋酸制醋酐、乙醚制造等整套工艺设计制造，并配套多效蒸发、MVR、PSA 制氮制氧及自动控制系统。",
    "innovation.title": "科研创新",
    "innovation.more": "展开科研创新",
    "innovation.copy": "以流程模拟、实验验证和工程放大为核心，形成从技术团队、研发平台到专利成果的持续创新能力。",
    "innovation.previewTitle": "流程模拟、实验验证、工程放大",
    "innovation.previewTeam": "技术团队",
    "innovation.previewPilot": "中小试平台",
    "innovation.previewResults": "研发成果",
    "industries.title": "业务领域",
    "industries.more": "查看业务领域",
    "industries.copy": "服务医药、化工、新能源、新材料等行业，围绕溶剂回收、尾气治理和节能分离提供行业化方案。",
    "industries.pharma": "医药行业",
    "industries.chemical": "化工行业",
    "industries.energy": "新能源行业",
    "industries.materials": "新材料行业",
    "solutions.title": "工艺解决方案",
    "solutions.more": "查看工艺解决方案",
    "solutions.copy": "覆盖精馏分离、硫化氢制硫、VOCs治理、多效蒸发、混氨及MVR等成套工艺路线。",
    "solutions.previewDistillation": "精馏分离",
    "solutions.previewDistillationText": "热泵、多效、变压与隔壁塔节能方案",
    "solutions.previewVocs": "VOCs治理",
    "solutions.previewVocsText": "吸附、脱附、深冷、吸收和回收组合",
    "solutions.previewH2s": "硫化氢制硫",
    "solutions.previewH2sText": "湿法吸收反应再生与单质硫回收",
    "solutions.previewMvr": "MVR / 蒸发",
    "solutions.previewMvrText": "面向母液浓缩、废水减量和资源化",
    "products.title": "产品体系",
    "products.more": "查看全部产品",
    "products.pageTitle": "完整产品体系",
    "products.pageCopy": "按工程路线集中展示尾气回收、冷冻冷凝、白油吸收、萃取精馏、高沸点溶剂再生和含硫尾气资源化等产品。",
    "products.systemTitle": "从尾气回收到液相精制的成套工艺",
    "products.systemText": "产品体系围绕 VOCs 有机尾气治理、溶剂冷凝回收、吸收吸附、精馏萃取、H2S 制硫及高沸点溶剂再生展开，可按介质性质、浓度、风量、回收价值和排放要求进行组合设计。",
    "products.tag1": "气相回收",
    "products.tag2": "液相分离",
    "products.tag3": "溶剂精制",
    "products.tag4": "达标排放",
    "products.processLabel": "核心流程",
    "products.sceneLabel": "适用场景",
    "products.dcmKicker": "低温冷凝回收",
    "products.dcmTitle": "冷冻法回收有机溶剂",
    "products.dcmText": "冷冻法通过一级、二级或多级冷凝换热，将含有机溶剂尾气降至目标露点以下，使有机蒸气冷凝成液相回收，并配合除雾、气液分离和回收液暂存稳定运行。",
    "products.dcmProcess": "尾气稳流、多级冷凝、除雾捕集、气液分离、冷凝液回收。",
    "products.dcmScene": "适用于浓度较高、溶剂价值较高、冷凝温度可实现的有机溶剂尾气回收。",
    "products.cryoKicker": "液相吸收回收",
    "products.cryoTitle": "吸收法回收溶剂",
    "products.cryoText": "吸收法利用循环吸收剂与含溶剂尾气逆流接触，使有机组分转入液相；系统通常设置一级吸收塔、二级吸收塔、除雾器、气液分离器和回收液储槽。",
    "products.cryoProcess": "一级吸收塔、二级吸收塔、吸收剂循环、除雾、气液分离、富液回收。",
    "products.cryoScene": "适用于可被吸收剂有效溶解或吸收的有机溶剂尾气，可作为回收系统或后续净化前处理。",
    "products.whiteOilKicker": "液相吸收",
    "products.whiteOilTitle": "白油吸收塔系统",
    "products.whiteOilText": "利用白油等高沸点吸收剂与 VOC 混合气逆流接触，吸收疏水性有机物；富油经冷却、输送或再生后循环使用，净化尾气由塔顶排出。",
    "products.whiteOilProcess": "多级吸收塔、白油循环、换热冷却、富油槽/贫油槽、尾气排放。",
    "products.whiteOilScene": "适合疏水性、可被油相吸收的 VOCs 及复合尾气预处理。",
    "products.acetateKicker": "萃取精馏",
    "products.acetateTitle": "醋酸萃取精馏回收系统",
    "products.acetateText": "通过萃取剂改变轻组分、水相和目标物之间的相对挥发度，配合多塔精馏、冷凝回流和溶剂循环，实现醋酸或相关溶剂的提纯回收。",
    "products.acetateProcess": "原料预热、萃取精馏、溶剂回收、产品精制、萃取剂循环。",
    "products.acetateScene": "含水、共沸或相对挥发度接近的液相溶剂分离回收。",
    "products.dmsoKicker": "高沸点溶剂再生",
    "products.dmsoTitle": "DMSO 精馏回收系统",
    "products.dmsoText": "DMSO 属高沸点强极性溶剂，回收通常需要多效蒸发、换热节能、真空或精馏塔精制，并通过冷凝、过滤和残液排放保证产品纯度。",
    "products.dmsoProcess": "多效蒸发浓缩、管壳换热、保护过滤、精馏塔、产品罐和废水/残液处理。",
    "products.dmsoScene": "锂电、新材料、医药和精细化工中的 DMSO 母液回收。",
    "products.h2sKicker": "恶臭气体资源化",
    "products.h2sTitle": "硫化氢尾气制取单质硫系统",
    "products.h2sText": "对含 H2S 尾气进行预处理、吸收/反应、冷凝分离和硫浆循环，将硫化氢转化为可收集的单质硫，同时降低恶臭和含硫污染物排放。",
    "products.h2sProcess": "预处理吸收、两级反应、酸性气冷凝、气液分离、硫浆过滤与熔硫。",
    "products.h2sScene": "化工、制药、污水及含硫尾气治理和资源化回收。",
    "gallery.title": "工厂与工程现场",
    "news.title": "新闻资讯",
    "news.all": "全部",
    "news.company": "公司新闻",
    "news.industry": "行业资讯",
    "news.read": "阅读详情",
    "news.more": "查看更多新闻",
    "news.pageTitle": "新闻资讯",
    "news.pageCopy": "集中查看公司新闻与行业资讯，保留旧网站新闻内容，并以更清晰的阅读方式呈现。",
    "news.allTitle": "新闻动态",
    "contact.title": "联系我们",
    "contact.copy": "欢迎围绕有机尾气治理、溶剂回收、液相分离和精馏节能改造需求进行项目咨询。",
    "contact.inquiry": "填写客户咨询表",
    "contact.phone": "电话",
    "contact.email": "邮箱",
    "contact.address": "地址",
    "contact.addressValue": "河北省石家庄市灵寿县经济开发区小商品产业园8号",
    "contact.wechat": "官方微信",
    "contact.wechatHint": "扫码关注，获取项目咨询与案例动态",
    "contact.wechatQrAlt": "石家庄辰泰环境科技有限公司官方微信二维码",
    "contact.mapTitle": "在线定位地图",
    "contact.mapCopy": "河北省石家庄市灵寿县经济开发区小商品产业园8号",
    "contact.openMap": "打开在线地图",
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
    "company.name": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
    "company.logoAlt": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
    "nav.home": "Home",
    "nav.profile": "About Us",
    "nav.manufacturing": "Smart Manufacturing",
    "nav.qualifications": "Qualifications",
    "nav.innovation": "R&D Innovation",
    "nav.industries": "Business Fields",
    "nav.solutions": "Process Solutions",
    "nav.business": "Business",
    "nav.products": "Products",
    "nav.news": "News",
    "nav.inquiry": "Inquiry",
    "nav.contact": "Contact",
    "nav.home.profile": "Company Profile",
    "nav.home.news": "News",
    "nav.home.contact": "Contact",
    "nav.profile.positioning": "Positioning",
    "nav.profile.rd": "R&D and Manufacturing",
    "nav.profile.quality": "Quality System",
    "nav.profile.qualifications": "Qualifications",
    "nav.news.all": "All News",
    "nav.news.company": "Company News",
    "nav.news.industry": "Industry News",
    "nav.innovation.team": "Technology Team",
    "nav.innovation.process": "Process Design",
    "nav.innovation.cooperation": "University Cooperation",
    "nav.innovation.infrastructure": "R&D Infrastructure",
    "nav.innovation.results": "R&D Results",
    "nav.industries.pharma": "Pharmaceuticals",
    "nav.industries.chemical": "Chemical Industry",
    "nav.industries.energy": "New Energy",
    "nav.industries.materials": "New Materials",
    "nav.solutions.distillation": "Distillation Separation",
    "nav.solutions.h2s": "H2S Treatment",
    "nav.solutions.vocs": "VOCs Recovery",
    "nav.solutions.vps": "Activated Carbon VPS",
    "nav.solutions.mvr": "MVR System",
    "nav.contact.details": "Contact Details",
    "nav.contact.inquiry": "Inquiry Form",
    "home.capabilitiesNav": "Core Capabilities",
    "home.deliveryNav": "Delivery Line",
    "channel.companyOverview": "Company Profile",
    "channel.rdCenter": "R&D Center",
    "channel.workshop": "Workshop Equipment",
    "channel.subsidiaries": "Subsidiaries",
    "channel.qualitySystem": "Quality System",
    "channel.companyHistory": "Milestones",
    "hero.eyebrow": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.toLight": "Switch to light theme",
    "theme.toDark": "Switch to dark theme",
    "hero.title": "Integrated Process Technology Supplier for Resource Recycling",
    "hero.subtitle": "Energy-saving and consumption-reduction specialist for the chemical industry",
    "hero.copy": "Chentai focuses on distillation separation and purification, H2S-containing tail-gas treatment and sulfur recovery, and organic exhaust treatment for chemical, new energy and new materials industries, providing technical consulting, engineering design, equipment manufacturing, installation, commissioning and after-sales service for chemical, pharmaceutical, new energy and new materials customers.",
    "hero.primary": "Business Fields",
    "hero.secondary": "Contact Us",
    "hero.land": "Land area",
    "hero.plant": "Plant area",
    "hero.iso": "Quality system certification",
    "hero.ip": "Intellectual Properties",
    "hero.ipValue": "50+",
    "hero.expertise": "Years of Expertise",
    "hero.expertiseValue": "20+",
    "hero.clients": "Clients",
    "hero.clientsValue": "1000+",
    "hero.railDistillation": "Distillation Separation",
    "hero.railSolvent": "Solvent Recovery",
    "hero.railGas": "Exhaust Treatment",
    "hero.railManufacturing": "Equipment Fabrication",
    "hero.consoleTitle": "Interactive Process Console",
    "hero.consoleHint": "Hover to shift focus",
    "hero.modeGas": "Exhaust Treatment",
    "hero.modeSolvent": "Solvent Recovery",
    "hero.modeManufacturing": "Equipment Fabrication",
    "hero.modeGasCopy": "From composition analysis and adsorption-desorption to condensation recovery, Chentai builds practical exhaust treatment systems.",
    "hero.modeSolventCopy": "Recovered-liquid refining, extractive distillation and energy reuse are planned as one engineering package.",
    "hero.modeManufacturingCopy": "Cutting, welding, assembly and site installation capacity support complete non-standard equipment delivery.",
    "home.capabilitiesMore": "View Process Details",
    "home.capabilitiesTitle": "Core capabilities",
    "home.capabilitiesCopy": "Distillation, solvent recovery, exhaust gas treatment and equipment fabrication, with full process detail on the dedicated pages.",
    "home.capabilityDistillation": "For purification, separation, energy-saving distillation and solvent refining.",
    "home.capabilitySolvent": "Condensation, absorption, adsorption, desorption and resource reuse.",
    "home.capabilityGas": "Organic exhaust, sulfur-containing exhaust and compliant emission treatment.",
    "home.capabilityManufacturing": "Non-standard equipment fabrication, installation, commissioning and site service.",
    "home.deliveryTitle": "Project delivery",
    "home.deliveryCopy": "From lab validation and process design to fabrication, installation and commissioning.",
    "home.deliveryStep1": "Validation",
    "home.deliveryStep2": "Process Design",
    "home.deliveryStep3": "Fabrication",
    "home.deliveryStep4": "Commissioning",
    "home.deliveryStep5": "After-sales",
    "home.industriesCopy": "Applications across chemical, pharmaceutical, new energy and new materials projects.",
    "home.newsCopy": "Company updates and industry observations, with full articles on the news page.",
    "profile.title": "Company Profile",
    "profile.card1Kicker": "Company Overview",
    "profile.card1Title": "Integrated Supplier for Resource Recycling",
    "profile.card2Kicker": "R&D Center",
    "profile.card2Title": "Technology R&D Center",
    "profile.card3Kicker": "Smart Manufacturing",
    "profile.card3Title": "Intelligent High-end Fabrication Equipment",
    "profile.p1": "Shijiazhuang Chentai Environmental Technology Co., Ltd. is a high-tech enterprise focused on organic solvent recovery and treatment. The company provides green chemical separation technologies for different industries, including digitalized integrated liquid-phase and gas-phase energy-coupled process systems, distillation separation, extraction separation and green energy recovery systems, comprehensive H2S tail-gas treatment and sulfur recovery, organic tail-gas energy recovery systems, digital evaporation crystallization systems, and EPC turnkey services covering technical consulting, engineering design, manufacturing, installation, commissioning, training and after-sales service. The technical team continuously develops new process packages to solve solvent recycling needs across industries. Its independently innovated gas-phase and liquid-phase separation integration design achieves compliant discharge of both wastewater and waste gas, saves energy by 40-70% or more, and leads the domestic industry technically.",
    "profile.p2": "The company has chemical engineering masters and senior engineers, holds a pressure vessel manufacturing license including installation and modification, and is recognized as a national high-tech enterprise, Hebei Specialized and Innovative Enterprise, and Hebei Innovative Enterprise. It has established a distillation technology R&D center, a Grade-B R&D center for industrial enterprises in Hebei, and the Research Office of Chemical Energy-saving Process Integration and Resource Utilization, creating significant economic and social benefits for many large and medium-sized chemical enterprises, especially in ultra-high molecular weight polyethylene, separator materials and PE new materials.",
    "profile.p3": "The company owns automated and intelligent high-end fabrication and inspection equipment, including advanced laser cutting machines, automatic plasma welding machines, tube-sheet automatic welding machines, flange welding machines, automatic argon arc welding machines, and professional machining equipment for milling, planing, grinding, boring, drilling and bending. It also has senior technicians and intermediate-or-above skilled workers for non-standard equipment manufacturing and assembly. Since its establishment, the company has successfully developed, designed and built more than one thousand industrial distillation units.",
    "profile.p4": "The company also has multiple experienced professional installation teams equipped with advanced construction machinery, providing long-term on-site services for equipment, piping, electrical instrumentation, steel structures and automation systems. With a strict and comprehensive quality management system, Chentai has completed many major engineering projects across China.",
    "profile.more": "Full Profile",
    "manufacturing.title": "Smart fabrication and equipment delivery",
    "manufacturing.more": "View fabrication capability",
    "manufacturing.videoKicker": "Laser Cutting",
    "manufacturing.videoTitle": "Dynamic display of high-end fabrication equipment",
    "manufacturing.step1Title": "Process design",
    "manufacturing.step1Text": "Define the separation and treatment route based on material properties, air volume, concentration and recovery goals.",
    "manufacturing.step2Title": "Equipment fabrication",
    "manufacturing.step2Text": "Build core equipment with cutting, welding, machining and assembly capability.",
    "manufacturing.step3Title": "Site delivery",
    "manufacturing.step3Text": "Complete installation, commissioning, training and maintenance as a closed-loop engineering service.",
    "profile.pageTitle": "About Us",
    "profile.pageCopy": "A structured summary of Chentai's positioning, technical route, development milestones, R&D and manufacturing capabilities based on the company presentation.",
    "profile.coreTitle": "Enterprise Positioning",
    "profile.coreText": "Chentai focuses on organic solvent recovery and treatment for chemical, pharmaceutical, polymer material, lithium battery separator, fiber and coating industries, delivering process assessment, equipment manufacturing, installation, commissioning and operation training.",
    "profile.techTitle": "Core Technical Route",
    "profile.techText": "Gas-phase recovery and liquid-phase separation are planned as one engineering system, integrating tail-gas treatment, recovered-liquid refining, non-condensable gas treatment and heat/cold energy reuse to reduce energy use and secondary pollution risk.",
    "profile.rdTitle": "R&D and Manufacturing",
    "profile.rdText": "The company operates an engineering laboratory and R&D center, invests continuously in process development and talent, and supports solvent-recovery simulation, parameter analysis and process validation with CNC welding, cutting, drilling and automated fabrication equipment.",
    "profile.historyTitle": "Development Milestones",
    "profile.history2007": "Founded in Shijiazhuang Liudong Industrial Zone and began serving industrial customers.",
    "profile.history2009": "Established a production base and built independent design and fabrication capability.",
    "profile.history2012": "Purchased land for a comprehensive production base.",
    "profile.history2016": "Main workshop completed and put into use; annual sales exceeded RMB 30 million.",
    "profile.history2017": "Experimental center launched; dichloromethane and white-oil deep separation pilot tests succeeded.",
    "profile.history2018": "Established strategic cooperation with Osaka Gas and obtained national explosion-proof certification.",
    "profile.history2020": "Recognized as a high-tech enterprise and national technology-based SME.",
    "profile.history2022": "Recognized as a specialized and innovative enterprise and obtained pressure-vessel related qualification.",
    "profile.history2023": "Ether manufacturing integrated project achieved successful first start-up.",
    "profile.history2024": "High-tech and national SME reviews passed; film-industry distillation and tail-gas systems delivered.",
    "profile.history2025": "Awarded municipal green factory and obtained Grade II mechanical-electrical installation and environmental engineering qualifications.",
    "profile.founded": "Founded",
    "profile.rdInvest": "Annual R&D investment",
    "profile.greenFactory": "Municipal green factory",
    "profile.factoryTitle": "R&D and Manufacturing Capability",
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
    "business.introTitle": "Engineering System: Gas Recovery + Liquid Separation + Energy Reuse",
    "business.introText": "Centered on organic solvent recovery, Chentai combines absorption, adsorption, condensation recovery, extraction distillation, sulfur-containing exhaust treatment and PSA supporting systems to cover feedstock, process gas, recovered liquid and product refining.",
    "business.item1Title": "Industrial Organic Waste Gas Treatment",
    "business.item1Text": "Integrated solutions for adsorption, desorption, condensation, recovery and compliant emission in chemical, pharmaceutical, printing, coating and new-material industries.",
    "business.item2Title": "Liquid Extraction and Distillation Equipment",
    "business.item2Text": "Full-process delivery from basic design to equipment fabrication, installation, commissioning and acceptance for solvent recovery and energy-saving separation.",
    "business.item3Title": "Industrial Odor and Tail Gas Treatment",
    "business.item3Text": "Combined process design and system treatment for hydrogen sulfide, odor gases and complex exhaust streams.",
    "business.item4Title": "Integrated Process Packages and Utilities",
    "business.item4Text": "Integrated process design and equipment supply for PE polymer materials, acetic-acid-to-acetic-anhydride and ether manufacturing, plus multi-effect evaporation, MVR, PSA nitrogen/oxygen and automation systems.",
    "innovation.title": "R&D Innovation",
    "innovation.more": "Explore R&D Innovation",
    "innovation.copy": "Process simulation, laboratory validation and engineering scale-up form Chentai's continuous innovation capability.",
    "industries.title": "Industries",
    "industries.more": "View Industries",
    "industries.copy": "Industry-oriented solutions for pharmaceutical, chemical, new energy and advanced materials projects.",
    "solutions.title": "Process Solutions",
    "solutions.more": "View Process Solutions",
    "solutions.copy": "Complete process routes covering distillation, H2S sulfur recovery, VOCs treatment, evaporation, ammonia mixing and MVR.",
    "products.title": "Product System",
    "products.more": "All Products",
    "products.pageTitle": "Complete Product System",
    "products.pageCopy": "A complete engineering view of tail-gas recovery, cryogenic condensation, white-oil absorption, extractive distillation, high-boiling solvent regeneration and sulfur-containing exhaust resource recovery.",
    "products.systemTitle": "Integrated Processes from Tail-Gas Recovery to Liquid-Phase Refining",
    "products.systemText": "The product system covers VOC treatment, solvent condensation recovery, absorption and adsorption, extraction distillation, H2S-to-sulfur conversion and high-boiling solvent regeneration. Routes can be combined according to medium properties, concentration, airflow, recovery value and emission requirements.",
    "products.tag1": "Gas recovery",
    "products.tag2": "Liquid separation",
    "products.tag3": "Solvent refining",
    "products.tag4": "Compliant emission",
    "products.processLabel": "Core Process",
    "products.sceneLabel": "Applications",
    "products.dcmKicker": "Low-Temperature Condensation",
    "products.dcmTitle": "Cryogenic Recovery of Organic Solvents",
    "products.dcmText": "Cryogenic recovery cools solvent-laden exhaust below the target dew point through primary, secondary or multi-stage condensation, converting organic vapor into recoverable liquid with demisting, gas-liquid separation and condensate storage.",
    "products.dcmProcess": "Exhaust buffering, multi-stage condensation, demisting, gas-liquid separation and condensate recovery.",
    "products.dcmScene": "Suitable for organic solvent exhaust with higher concentration, higher recovery value and achievable condensation temperature.",
    "products.cryoKicker": "Liquid Absorption Recovery",
    "products.cryoTitle": "Solvent Recovery by Absorption",
    "products.cryoText": "Absorption recovery uses a circulating absorbent to contact solvent-containing exhaust countercurrently, transferring organic components into the liquid phase. The system typically includes a first-stage absorption tower, second-stage absorption tower, demister, gas-liquid separator and recovered-liquid tank.",
    "products.cryoProcess": "First-stage absorption tower, second-stage absorption tower, absorbent circulation, demisting, gas-liquid separation and rich-liquid recovery.",
    "products.cryoScene": "Suitable for organic solvent exhaust that can be effectively dissolved or absorbed by the selected absorbent, either as a recovery system or as pretreatment before final purification.",
    "products.whiteOilKicker": "Liquid Absorption",
    "products.whiteOilTitle": "White-Oil Absorption Tower System",
    "products.whiteOilText": "White oil or similar high-boiling absorbent contacts VOC gas countercurrently to capture hydrophobic organics. Rich oil is cooled, transferred or regenerated, while purified gas exits from the tower top.",
    "products.whiteOilProcess": "Multi-stage absorption towers, white-oil circulation, heat exchange cooling, rich/lean oil tanks and treated gas discharge.",
    "products.whiteOilScene": "Hydrophobic VOCs and combined exhaust streams suitable for oil-phase absorption or pretreatment.",
    "products.acetateKicker": "Extractive Distillation",
    "products.acetateTitle": "Acetic-Acid Extraction Distillation Recovery System",
    "products.acetateText": "An extractant changes the relative volatility of light components, water and target materials. Combined with multi-column distillation, condensation reflux and solvent circulation, it enables purification and recovery of acetic acid or related solvents.",
    "products.acetateProcess": "Feed preheating, extractive distillation, solvent recovery, product refining and extractant circulation.",
    "products.acetateScene": "Liquid solvent mixtures with water, azeotropes or close relative volatility.",
    "products.dmsoKicker": "High-Boiling Solvent Regeneration",
    "products.dmsoTitle": "DMSO Distillation Recovery System",
    "products.dmsoText": "DMSO is a high-boiling polar solvent. Recovery usually requires multi-effect evaporation, heat integration, vacuum or distillation refining, plus condensation, filtration and residue handling to maintain product purity.",
    "products.dmsoProcess": "Multi-effect evaporation, shell-and-tube heat exchange, protective filtration, rectification column, product tank and wastewater/residue handling.",
    "products.dmsoScene": "DMSO mother-liquor recovery in lithium battery, new-material, pharmaceutical and fine chemical production.",
    "products.h2sKicker": "Odor-Gas Resource Recovery",
    "products.h2sTitle": "H2S Tail-Gas to Elemental Sulfur System",
    "products.h2sText": "H2S-containing exhaust is pretreated, absorbed or reacted, condensed, separated and circulated as sulfur slurry, converting hydrogen sulfide into recoverable elemental sulfur while reducing odor and sulfur emissions.",
    "products.h2sProcess": "Pretreatment absorption, two-stage reaction, acid-gas condensation, gas-liquid separation, sulfur-slurry filtration and sulfur melting.",
    "products.h2sScene": "Chemical, pharmaceutical, wastewater and sulfur-containing exhaust treatment with resource recovery.",
    "gallery.title": "Factory and Project Sites",
    "innovation.previewTitle": "Process Simulation, Experimental Verification and Scale-up",
    "innovation.previewTeam": "Technical Team",
    "innovation.previewPilot": "Pilot Platform",
    "innovation.previewResults": "R&D Results",
    "industries.pharma": "Pharmaceuticals",
    "industries.chemical": "Chemical Industry",
    "industries.energy": "New Energy",
    "industries.materials": "New Materials",
    "solutions.previewDistillation": "Distillation Separation",
    "solutions.previewDistillationText": "Energy-saving routes for heat-pump, multi-effect, pressure-swing and divided-wall distillation.",
    "solutions.previewVocs": "VOCs Treatment",
    "solutions.previewVocsText": "Integrated adsorption, desorption, cryogenic, absorption and recovery combinations.",
    "solutions.previewH2s": "H2S to Sulfur",
    "solutions.previewH2sText": "Wet absorption, reaction regeneration and elemental sulfur recovery.",
    "solutions.previewMvr": "MVR / Evaporation",
    "solutions.previewMvrText": "For mother-liquor concentration, wastewater reduction and resource recovery.",
    "news.title": "News Center",
    "news.all": "All",
    "news.company": "Company",
    "news.industry": "Industry",
    "news.read": "Read More",
    "news.more": "More News",
    "news.pageTitle": "News Center",
    "news.pageCopy": "Browse company updates and industry articles preserved from the previous website in a cleaner reading layout.",
    "news.allTitle": "News Updates",
    "contact.title": "Contact",
    "contact.copy": "Contact us for organic waste gas treatment, solvent recovery, liquid separation and energy-saving distillation projects.",
    "contact.inquiry": "Fill Inquiry Form",
    "contact.phone": "Tel",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.addressValue": "No. 8, Small Commodities Industrial Park, Lingshou Economic Development Zone, Shijiazhuang, Hebei Province, China",
    "contact.wechat": "Official WeChat",
    "contact.wechatHint": "Scan to follow project updates and case stories.",
    "contact.wechatQrAlt": "Official WeChat QR code for Shijiazhuang Chentai Environmental Technology Co., Ltd.",
    "contact.mapTitle": "Online Location Map",
    "contact.mapCopy": "No. 8, Small Commodities Industrial Park, Lingshou Economic Development Zone, Shijiazhuang, Hebei Province, China",
    "contact.openMap": "Open Online Map",
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

const staticEnglishOverrides = {
  "网站首页 - 石家庄辰泰环境科技有限公司": "Home - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "石家庄辰泰环境科技有限公司": "Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "公司简介 - 石家庄辰泰环境科技有限公司": "Company Profile - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "新闻资讯 - 石家庄辰泰环境科技有限公司": "News - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "科研创新 - 石家庄辰泰环境科技有限公司": "R&D Innovation - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "业务领域 - 石家庄辰泰环境科技有限公司": "Business Fields - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "工艺解决方案 - 石家庄辰泰环境科技有限公司": "Process Solutions - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "资质能力 - 石家庄辰泰环境科技有限公司": "Qualifications - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "资质证书与实验室 - 石家庄辰泰环境科技有限公司": "Certificates and Laboratory - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "产品体系 - 石家庄辰泰环境科技有限公司": "Product System - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "客户咨询表 - 石家庄辰泰环境科技有限公司": "Project Inquiry - Shijiazhuang Chentai Environmental Technology Co., Ltd.",
  "返回首页": "Back to home",
  "网站首页下拉导航": "Home dropdown navigation",
  "关于我们下拉导航": "About us dropdown navigation",
  "新闻资讯下拉导航": "News dropdown navigation",
  "科研创新下拉导航": "R&D innovation dropdown navigation",
  "业务领域下拉导航": "Business fields dropdown navigation",
  "工艺解决方案下拉导航": "Process solutions dropdown navigation",
  "联系我们下拉导航": "Contact dropdown navigation",
  "上一张": "Previous slide",
  "下一张": "Next slide",
  "子公司介绍": "Subsidiaries",
  "围绕华北、长三角、珠三角、海南及海外市场建立协同服务网络，覆盖项目开发、工程设计、生产制造、维护售后和进出口业务。": "A coordinated service network covers North China, the Yangtze River Delta, the Pearl River Delta, Hainan and overseas markets, supporting project development, engineering design, manufacturing, maintenance, after-sales service, and import-export business.",
  "南通剑驰分公司": "Nantong Jianchi Branch",
  "租赁厂房1800平方米，办公楼200㎡，拥有设备约800万元，负责长三角项目的开发与生产、维护及售后服务等。": "Leases an 1,800 m2 workshop and a 200 m2 office building, with equipment valued at about RMB 8 million. It handles development, production, maintenance and after-sales service for Yangtze River Delta projects.",
  "天津迪威洛普分公司": "Tianjin Develop Branch",
  "主要负责公司萃取精馏系统整体工程的设计、部分生产及售后服务等，拥有设备约1200万，租赁办公楼200平米。": "Mainly responsible for overall engineering design, partial production and after-sales service for extraction distillation systems, with equipment valued at about RMB 12 million and a 200 m2 leased office.",
  "石家庄市滕泰环保设备分公司": "Shijiazhuang Tengtai Environmental Equipment Branch",
  "租赁办公楼200平米，库房1000平米，拥有设备约200万，主要负责公司成套技术产品及吸附材料的进出口业务。": "Leases a 200 m2 office and a 1,000 m2 warehouse, with equipment valued at about RMB 2 million. It mainly handles import and export of complete technical products and adsorption materials.",
  "三亚鸿滕工贸分公司": "Sanya Hongteng Industry and Trade Branch",
  "租赁厂房1000平方米，办公楼200㎡，拥有设备约500万元，负责珠三角及海南项目的开发与生产、维护及售后服务等。": "Leases a 1,000 m2 workshop and a 200 m2 office building, with equipment valued at about RMB 5 million. It supports project development, production, maintenance and after-sales service in the Pearl River Delta and Hainan.",
  "美国 Syntech Chemical 分公司": "Syntech Chemical U.S. Branch",
  "用于开拓美国市场，承担部分组装、售后服务等工作，租用厂房1000㎡，设备约1000万元。": "Established to develop the U.S. market, undertake partial assembly and after-sales service, with a leased 1,000 m2 workshop and equipment valued at about RMB 10 million.",
  "质量体系管理": "Quality System Management",
  "石家庄辰泰环境科技有限公司依托ISO9001 质量管理体系认证，构建覆盖设计研发、材料工艺、生产制造、安装调试、售后服务全链条的闭环质量管理体系，以“技术创新为核心、过程管控为关键、客户满意为目标”，实现产品质量稳定可靠、技术服务专业高效，为客户提供节能降耗与资源循环利用综合解决方案。": "With ISO9001 quality management certification, Chentai has built a closed-loop quality system covering design and R&D, materials and processes, manufacturing, installation and commissioning, and after-sales service. With technical innovation at the core, process control as the key, and customer satisfaction as the goal, the system supports stable product quality, efficient technical service, and integrated solutions for energy saving and resource recycling.",
  "ISO9001质量管理体系认证": "ISO9001 Quality Management System Certification",
  "防爆合格证": "Explosion-proof Certificate",
  "压力容器制造许可证": "Pressure Vessel Manufacturing License",
  "高新技术企业": "High-tech Enterprise",
  "河北省工业企业研发机构 B 级": "Grade B R&D Institution for Hebei Industrial Enterprises",
  "专精特新企业": "Specialized and Innovative Enterprise",
  "市级绿色工厂": "Municipal Green Factory",
  "河北省科技型中小企业": "Hebei Technology-based SME",
  "企业荣誉": "Corporate Honors",
  "设计研发：源头把控，创新赋能质量": "Design and R&D: source control and innovation-driven quality",
  "公司建立“市场需求-技术研发-模拟验证-方案定型”研发质量管控流程，组建由高级工程师、行业专家领衔的专业技术团队，每年投入营收8%用于技术创新。对精馏工艺、设备结构进行多维度仿真验证，提前规避设计缺陷。从源头保障工艺适配性与技术可靠性。同时，严格执行研发评审制度，通过方案评审、图纸审核、样机测试三重把关，确保设计输出符合行业标准与客户需求，累计取得多项精馏技术专利，筑牢质量根基。": "The company follows an R&D quality control process from market demand to technical development, simulation verification and final scheme definition. A professional team led by senior engineers and industry experts invests 8% of annual revenue in technical innovation. Distillation processes and equipment structures are verified through multidimensional simulation to reduce design risks early. R&D reviews, drawing checks and prototype tests ensure outputs meet industry standards and customer requirements, forming a strong quality foundation supported by multiple distillation patents.",
  "材料工艺：精挑细选，标准严控品质": "Materials and processes: selected inputs and strict standards",
  "公司建立供应商准入-评估-动态管理机制，关键零部件供应商需通过资质审核、样品检验、现场考察三重筛选，签订质量协议，明确质量标准与追责机制。工艺管理方面，制定标准化作业指导书（SOP），明确设备焊接、组装、防腐等关键工序参数，严控填料层厚度、塔体垂直度等核心指标。针对有机溶剂分离提纯工艺，优化萃取剂配方与精馏参数，确保溶剂回收率、纯度达标，从材料与工艺双重维度严控质量。": "Chentai manages suppliers through admission, evaluation and dynamic review. Key component suppliers must pass qualification review, sample inspection and site assessment, then sign quality agreements defining standards and accountability. Standard operating procedures define parameters for welding, assembly, anti-corrosion and other key processes, with strict control of packing-layer thickness, tower verticality and other indicators. For organic solvent separation and purification, extractant formulas and distillation parameters are optimized to meet recovery and purity targets.",
  "自动化高端加工设备": "Automated High-end Processing Equipment",
  "机械加工与检测能力": "Machining and Inspection Capability",
  "成套装备生产现场": "Complete Equipment Production Site",
  "非标设备制造与装配": "Non-standard Equipment Manufacturing and Assembly",
  "生产制造：精益管控，全程追溯保稳": "Manufacturing: lean control and full traceability",
  "公司配备数控切割机、自动焊接机、无损检测仪等先进设备，实现生产自动化、精细化。生产环节推行“三检制”（自检、互检、专检），每道工序操作人员自检、上下工序互检、质检专员专检，关键工序全程旁站监督。焊接工序执行无损检测，水压试验100%合格，确保设备耐压性与密封性；组装环节严格把控部件精度，杜绝错装、漏装。建立产品全生命周期追溯系统，从原材料批次、生产工序、操作人员到检测数据全程记录，实现质量问题可追溯、可追责。同时，定期开展设备维护校准与员工技能培训，保障生产稳定性，产品良品率稳定在99%以上。": "The company uses CNC cutting machines, automatic welding machines, non-destructive testing instruments and other advanced equipment for automated, refined production. A three-level inspection system covers self-inspection, mutual inspection and dedicated inspection, with full supervision for key processes. Welds undergo non-destructive testing, hydrostatic tests are fully qualified, and assembly accuracy is controlled to prevent wrong or missing installation. A full lifecycle traceability system records raw material batches, production steps, operators and inspection data. Regular equipment calibration and staff training keep production stable, with product yield maintained above 99%.",
  "安装调试：规范实施，精准交付达标": "Installation and commissioning: standardized execution and accurate delivery",
  "公司制定标准化安装流程，明确现场勘测、基础施工、设备就位、管道连接、系统调试等全流程规范。安装前进行技术交底，核对图纸与现场工况；安装中严格执行安全与质量标准，严控设备水平度、管道密封性，杜绝安装偏差；安装后开展72小时连续试运行，全面检测设备运行参数、溶剂回收效率、废气废水排放指标，确保符合设计要求与环保标准，助力客户快速投产、稳定运行。": "Standardized installation procedures cover site survey, foundation work, equipment positioning, piping connection and system commissioning. Before installation, technical disclosure confirms drawings and site conditions. During installation, safety and quality standards control equipment leveling and pipe sealing. After installation, a 72-hour continuous trial run checks operating parameters, solvent recovery efficiency and wastewater and exhaust indicators to meet design and environmental requirements.",
  "售后服务：全程护航，持续改进提质": "After-sales service: full support and continuous improvement",
  "公司建立“快速响应-专业服务-定期回访-持续优化”售后服务体系，设立24小时服务热线。设备交付后，提供免费安装指导、技术培训与操作交底，确保客户人员熟练掌握设备操作与维护技能。建立客户档案，定期回访设备运行状况，提供预防性维护建议，及时更换易损部件，延长设备使用寿命。同时，跟踪行业技术动态与客户需求升级，持续迭代精馏技术与服务方案，助力客户实现节能降碳、提质增效，增强核心竞争力。": "Chentai has built an after-sales system covering rapid response, professional service, regular follow-up and continuous optimization, with a 24-hour hotline. After delivery, the company provides installation guidance, technical training and operation handover so customer teams can operate and maintain equipment properly. Customer files, regular follow-ups, preventive maintenance advice and timely replacement of wearing parts extend equipment life. Chentai also tracks industry technology and customer upgrades to improve distillation technology and service plans.",
  "客户服务与团队协作": "Customer Service and Team Collaboration",
  "项目沟通与现场支持": "Project Communication and Site Support",
  "工程服务团队": "Engineering Service Team",
  "持续培训与服务改进": "Continuous Training and Service Improvement",
  "售后回访与运营支持": "After-sales Follow-up and Operations Support",
  "企业文化与客户共创": "Corporate Culture and Customer Co-creation",
  "厂区外景": "Factory Exterior",
  "车间装备": "Workshop Equipment",
  "制造现场": "Manufacturing Site",
  "项目装置现场": "Project Unit Site",
  "塔器与管线系统": "Tower and Piping System",
  "企业风采": "Corporate Culture",
  "科研创新": "R&D Innovation",
  "以专业团队、闭环研发流程、校企合作、实验平台和专利成果为支撑，形成可从实验验证走向工业落地的技术体系。": "Supported by professional teams, closed-loop R&D processes, university-enterprise cooperation, experimental platforms and patent results, Chentai has built a technical system that moves from experimental verification to industrial implementation.",
  "高级工程师与专家占比": "Share of senior engineers and experts",
  "15年+": "15+ years",
  "核心骨干平均行业经验": "Average industry experience of core staff",
  "20项": "20 items",
  "发明与实用新型专利成果": "Invention and utility-model patent results",
  "科技团队建设": "Technology Team Building",
  "人才实力：专业团队引领，经验与创新兼备": "Talent strength: professional leadership with experience and innovation",
  "公司打造了一支专业的核心技术团队，其中高级工程师、教授级专家占比超60%，汇聚国内早期从事精馏分离技术研发、活性炭吸附的资深人员，核心骨干平均行业经验超15年。人才结构覆盖工艺设计、设备研发、模拟仿真、自动化控制全领域，形成“资深专家+骨干工程师+青年技术人员”三级梯队。": "The company has built a professional core technical team. Senior engineers and professor-level experts account for more than 60%, bringing together experienced specialists who worked early in China on distillation separation technology and activated-carbon adsorption. Core staff average more than 15 years of industry experience. The talent structure covers process design, equipment R&D, simulation and automation control, forming a three-level team of senior experts, backbone engineers and young technical staff.",
  "公司坚持“技术立身”，建立常态化内训与外部交流机制，团队兼具理论深度与工程实践能力，为技术迭代与项目落地提供坚实人才支撑。": "Chentai is built on technology. Through regular internal training and external technical exchange, the team combines theoretical depth with engineering practice, supporting continuous technical iteration and project delivery.",
  "流程设计：全链条闭环研发，精准高效可控": "Process design: closed-loop R&D across the full chain",
  "公司以需求识别、方案模拟、实验验证、工程放大、运行反馈为主线，将实验数据、工艺模型和项目现场反馈闭环管理，确保研发方案在进入工程阶段前完成关键参数校核与风险预判。": "Chentai manages demand identification, scheme simulation, experimental verification, engineering scale-up and operating feedback as one closed loop, integrating test data, process models and site feedback so key parameters and risks are checked before engineering implementation.",
  "需求识别": "Demand identification",
  "方案模拟": "Scheme simulation",
  "实验验证": "Experimental verification",
  "工程放大": "Engineering scale-up",
  "运行反馈": "Operating feedback",
  "校企合作：产学研深度融合，技术协同创新": "University-enterprise cooperation: integrated research and industrial innovation",
  "公司坚持产学研协同发展，与国内多所一流高校建立长期稳定合作关系，共建技术研发平台、联合实验室与人才培养基地，打通“高校科研-企业转化-产业应用”链条。": "The company promotes industry-university-research cooperation and has established long-term relationships with leading domestic universities to build R&D platforms, joint laboratories and talent training bases, connecting university research, enterprise transformation and industrial application.",
  "技术攻关，联合研发": "Technical breakthroughs and joint R&D",
  "聚焦新能源、新材料等行业溶剂回收、工业废气治理等关键技术，累计取得多项发明专利与实用新型专利。": "The cooperation focuses on key technologies such as solvent recovery and industrial exhaust treatment for new energy and new materials, resulting in multiple invention and utility-model patents.",
  "资源共享，优势互补": "Resource sharing and complementary strengths",
  "共享理论研究成果与企业工程化、产业化优势，加速科研成果转化；高校为企业提供技术咨询与人才培训，企业为高校提供实践平台与项目资金，实现互利共赢。": "Research results are combined with Chentai's engineering and industrialization strengths to accelerate transformation. Universities provide technical consulting and talent training, while the company provides practice platforms and project funding.",
  "人才共育，储备力量": "Joint talent development and reserve building",
  "开展“订单式”人才培养，定向输送技术人才；邀请高校专家驻企指导，提升团队理论水平与创新能力，为技术可持续发展储备人才。": "Customized talent training channels technical staff to the company, while university experts provide on-site guidance to improve the team's theoretical foundation and innovation capability.",
  "研发基础设施介绍": "R&D Infrastructure",
  "中小试实验平台搭建与检测仪器配置，为工艺路线验证、参数分析和工程放大提供支撑。": "Pilot platforms and analytical instruments support process route verification, parameter analysis and engineering scale-up.",
  "中小试实验平台": "Pilot Test Platform",
  "实验平台搭建": "Experimental Platform Setup",
  "中小试装置": "Pilot Test Unit",
  "检测仪器": "Testing Instruments",
  "检测设备": "Testing Equipment",
  "检测仪器细节": "Testing Instrument Details",
  "研发成果展示": "R&D Results",
  "4项": "4 items",
  "发明专利": "Invention Patents",
  "16项": "16 items",
  "实用新型专利": "Utility-model Patents",
  "业务领域": "Business Fields",
  "面向医药、化工、新能源、新材料等行业，围绕溶剂回收、尾气治理、节能精馏和资源化回收提供工程化解决方案。": "For pharmaceuticals, chemicals, new energy and new materials, Chentai provides engineered solutions for solvent recovery, exhaust treatment, energy-saving distillation and resource recycling.",
  "4类": "4 categories",
  "重点行业场景": "Key industry scenarios",
  "多路线": "Multiple routes",
  "冷凝、吸收、精馏与吸附组合": "Condensation, absorption, distillation and adsorption combinations",
  "工艺、设备、施工和调试交付": "Process, equipment, construction and commissioning delivery",
  "医药行业": "Pharmaceutical Industry",
  "医药生产过程涉及多种有机溶剂、母液和尾气工况，辰泰可根据溶剂沸点、浓度、含水量和回收价值，配置精馏、萃取、冷凝、吸附或真空脱附组合工艺。": "Pharmaceutical production involves many organic solvents, mother liquors and exhaust conditions. Chentai configures distillation, extraction, condensation, adsorption or vacuum desorption combinations based on boiling point, concentration, water content and recovery value.",
  "医药行业项目": "Pharmaceutical Project",
  "齐鲁制药": "Qilu Pharmaceutical",
  "齐鲁制药项目": "Qilu Pharmaceutical Project",
  "齐鲁天和惠世有限公司": "Qilu Tianhe Huishi Co., Ltd.",
  "山东朗诺制药": "Shandong Langnuo Pharmaceutical",
  "山东朗诺制药有限公司": "Shandong Langnuo Pharmaceutical Co., Ltd.",
  "甘肃康巴斯生物科技有限公司": "Gansu Kangbasi Biotechnology Co., Ltd.",
  "玉星生物": "Yuxing Bio",
  "医药行业精馏工艺": "Pharmaceutical Distillation Process",
  "化工行业": "Chemical Industry",
  "化工行业工况差异大，常见需求包括VOCs回收、尾气吸收、溶剂精制、含硫尾气治理和过程节能改造。辰泰以EPC思路整合工艺、设备、管道、自控和施工调试。": "Chemical operating conditions vary widely. Common needs include VOCs recovery, exhaust absorption, solvent refining, sulfur-containing exhaust treatment and process energy-saving retrofits. Chentai integrates process, equipment, piping, automation, construction and commissioning through an EPC approach.",
  "化工项目现场": "Chemical Project Site",
  "甘肃银光化工工业集团有限公司": "Gansu Yinguang Chemical Industry Group Co., Ltd.",
  "天辰泉港": "Tianchen Quangang",
  "安徽智新生物化工有限公司": "Anhui Zhixin Biochemical Co., Ltd.",
  "华陆工程科技有限责任公司": "Hualu Engineering & Technology Co., Ltd.",
  "山东章丘雅思达": "Shandong Zhangqiu Yasida",
  "山东银鹰": "Shandong Yinying",
  "尾气吸附装置": "Exhaust Adsorption Unit",
  "新能源行业": "New Energy Industry",
  "新能源和锂电隔膜等生产环节对溶剂回收率、能耗和运行稳定性要求较高，适合采用冷凝、吸收、精馏、白油吸收和尾气回收的组合路线。": "New energy and lithium battery separator production require high solvent recovery, low energy consumption and stable operation, making combined routes such as condensation, absorption, distillation, white-oil absorption and exhaust recovery suitable.",
  "沧州明珠": "Cangzhou Mingzhu",
  "沧州明珠项目": "Cangzhou Mingzhu Project",
  "新能源项目现场": "New Energy Project Site",
  "新能源项目": "New Energy Project",
  "新能源项目设备": "New Energy Project Equipment",
  "新材料行业": "New Materials Industry",
  "新材料、涂布和纤维类项目通常需要兼顾有机尾气治理、溶剂回收、低能耗运行和长期稳定。辰泰可按介质特性提供吸附回收、冷凝回收、白油吸收和精馏精制方案。": "New materials, coating and fiber projects must balance organic exhaust treatment, solvent recovery, low-energy operation and long-term stability. Chentai provides adsorption recovery, condensation recovery, white-oil absorption and distillation refining schemes based on media characteristics.",
  "新材料项目": "New Materials Project",
  "同益中": "Tongyizhong",
  "同益中项目": "Tongyizhong Project",
  "浙江蓝德": "Zhejiang Lande",
  "华泰": "Huatai",
  "南通新帝克": "Nantong Xindike",
  "常熟秀珀": "Changshu Xiupo",
  "活性炭吸附": "Activated Carbon Adsorption",
  "活性炭吸附回收": "Activated Carbon Adsorption Recovery",
  "工艺解决方案": "Process Solutions",
  "围绕精馏分离、硫回收、VOCs回收治理、蒸发结晶与混氨等核心工艺包，形成从实验验证、工艺设计到设备制造和现场交付的系统化解决方案。": "Chentai builds systematic solutions around core process packages such as distillation separation, sulfur recovery, VOCs recovery and treatment, evaporation crystallization and ammonia mixing, covering experimental verification, process design, equipment manufacturing and site delivery.",
  "10套": "10 sets",
  "核心工艺方案模块": "Core process solution modules",
  "重点场景节能空间": "Energy-saving potential in key scenarios",
  "全流程": "Full process",
  "验证、设计、制造和现场交付": "Verification, design, manufacturing and site delivery",
  "成套工艺路线": "Complete process routes",
  "精馏分离技术及装置": "Distillation Separation Technology and Equipment",
  "硫化氢尾气综合治理": "Comprehensive H2S Tail-gas Treatment",
  "脱硫 / 再生 / 后处理": "Desulfurization / Regeneration / Post-treatment",
  "VOCs尾气回收治理": "VOCs Exhaust Recovery and Treatment",
  "颗粒活性炭VPS回收": "Granular Activated Carbon VPS Recovery",
  "多效蒸发系统": "Multi-effect Evaporation System",
  "混氨技术及装置": "Ammonia Mixing Technology and Equipment",
  "MVR系统": "MVR System",
  "石家庄辰泰环境科技有限公司通过整体融合精馏分离专业技术团队，组建了具有本公司特点的“化工节能过程集成与资源利用研究室”，致力于化工节能过程与资源利用的相关研究，在精馏过程与设备的研究开发和工业应用方面具有鲜明特色。多年来针对多家大中型化工企业，尤其是超高分子量聚乙烯材料、隔膜材料、PE新材料、新能源等行业的技术难题，创造了显著的经济效益和社会效益。": "By integrating a professional distillation separation team, Chentai has established the Research Office for Chemical Energy-saving Process Integration and Resource Utilization. The team focuses on chemical energy-saving processes and resource utilization, with distinctive capabilities in distillation process and equipment R&D and industrial application. Over the years, it has created significant economic and social benefits for many large and medium-sized chemical enterprises, especially in ultra-high molecular weight polyethylene, separator materials, PE new materials and new energy.",
  "公司的热泵精馏技术可显著降低传统精馏工艺的蒸汽和冷却水消耗，在化工、石化等领域应用广泛，可使费用降低50%以上。多效精馏技术的应用，能实现40%以上的节能效率，助力多个行业的节能降耗。变压精馏通过压力变化实现共沸体系的高效分离，在医药、精细化工以及新能源等领域应用价值较高。": "Heat-pump distillation can significantly reduce steam and cooling water consumption compared with traditional distillation and is widely used in chemical and petrochemical fields, cutting costs by more than 50%. Multi-effect distillation can achieve more than 40% energy savings. Pressure-swing distillation separates azeotropic systems efficiently through pressure changes and has high application value in pharmaceuticals, fine chemicals and new energy.",
  "隔壁塔精馏广泛应用于精细化工、石油化工及新能源行业，比传统多塔精馏可节约30%的投资费用和60%的运行操作费用，特别在高纯电子级别溶剂的生产中有不可比拟的优势。": "Dividing-wall column distillation is widely used in fine chemicals, petrochemicals and new energy. Compared with conventional multi-column distillation, it can save 30% of investment cost and 60% of operating cost, with particular advantages in high-purity electronic-grade solvent production.",
  "公司拥有众多溶剂单品的回收案例和液相溶媒回收过程实验室，拥有醋酐制造、醋酸回收等多项完整工艺包，可模拟各类溶剂回收过程，形成完整的模拟参数分析，可以做到从原料到成品的全过程。公司拥有一支技术过硬、品质优良的团队，能够完成从项目基础设计、施工、设备制造、安装调试和验收的全流程工作。": "The company has many single-solvent recovery cases and a liquid-phase solvent recovery laboratory. Complete process packages such as acetic anhydride production and acetic acid recovery allow simulation and parameter analysis for many solvent recovery processes, covering the full path from raw materials to finished products. Its technical team can complete basic design, construction, equipment manufacturing, installation, commissioning and acceptance.",
  "硫化氢尾气综合治理与硫回收技术及装置": "Comprehensive H2S Tail-gas Treatment, Sulfur Recovery Technology and Equipment",
  "本工艺采用络合铁或PDS为催化剂，利用Na2CO3或NH4OH为碱源，将废气中的硫化氢，吸收还原生成单质硫，同时，碱液可循环使用。相较于传统碱洗工艺大大节约运行费用，有明显的经济效益。": "This process uses chelated iron or PDS as catalyst and Na2CO3 or NH4OH as alkaline source to absorb and reduce hydrogen sulfide in exhaust gas into elemental sulfur. The alkaline solution can be recycled, significantly reducing operating cost compared with traditional alkali scrubbing.",
  "脱硫工艺": "Desulfurization process",
  "将含H2S的尾气从塔底进入脱硫塔，与塔顶喷淋下来的脱硫液充分接触，吸收了H2S的脱硫液从脱硫塔下部回流至反应槽。": "H2S-containing tail gas enters the desulfurization tower from the bottom and contacts the sprayed desulfurization liquid from the top. The liquid absorbing H2S returns from the lower part of the tower to the reaction tank.",
  "再生工艺": "Regeneration process",
  "通过脱硫液循环泵将硫富液抽送进入再生塔，通入大量空气对脱硫富液进行氧化再生，再生后的溶液从塔底自流回脱硫塔循环使用。": "A circulation pump sends sulfur-rich liquid into the regeneration tower, where large volumes of air oxidize and regenerate it. The regenerated solution flows back to the desulfurization tower for reuse.",
  "后处理工艺": "Post-treatment process",
  "从再生塔顶部浮选出的硫泡沫，进入硫泡沫槽，经过熔硫釜的熔硫工艺，最后生成硫磺成品，排出的清液则返回脱硫塔。": "Sulfur foam floated from the top of the regeneration tower enters the sulfur foam tank, then passes through sulfur melting to produce finished sulfur. The discharged clear liquid returns to the desulfurization tower.",
  "VOCs尾气回收治理技术及装置": "VOCs Exhaust Recovery and Treatment Technology and Equipment",
  "我们通过自有真空负压专利技术，融合高效吸收与真空脱附、深度冷凝等组合工艺，保障尾气回收治理安全性，并使动力消耗减少40-60%，污水量减少50-80%。": "Chentai combines its patented vacuum negative-pressure technology with efficient absorption, vacuum desorption and deep condensation processes to improve exhaust recovery safety, reduce power consumption by 40-60%, and reduce wastewater by 50-80%.",
  "颗粒活性炭真空负压（VPS）回收装置": "Granular Activated Carbon Vacuum Negative-pressure (VPS) Recovery Unit",
  "以吸附、解吸性能优异的真空专用颗粒活性炭作为吸附剂，将有机废气中的有机物吸附，利用真空负压将吸附的有机物脱附，液化回收、再利用。": "Special vacuum granular activated carbon with excellent adsorption and desorption performance adsorbs organics from exhaust gas. Vacuum negative pressure desorbs the organics for liquefaction, recovery and reuse.",
  "整个脱附再生过程没有外界氧气的参与，无死角脱附，脱附温度更低、更加安全。": "The whole desorption and regeneration process avoids external oxygen, enables dead-zone-free desorption, and operates at lower, safer desorption temperatures.",
  "节约40%以上的能源消耗，减少50%的污水排放，污水处理压力更小。": "Saves more than 40% energy consumption and reduces wastewater discharge by 50%, lowering wastewater treatment pressure.",
  "吸附材料的使用寿命增加50-200%。": "Extends adsorbent service life by 50-200%.",
  "低脱附温度极大降低有机物的分解，从而减少设备的腐蚀性，设备的使用寿命增加50-200%。": "Lower desorption temperature greatly reduces organic decomposition, reducing equipment corrosion and extending equipment life by 50-200%.",
  "更容易做到环保达标排放。": "Makes compliant environmental discharge easier to achieve.",
  "颗粒活性炭（GAC）有机尾（废）气吸附净化回收装置：利用吸附、解吸性能优异的颗粒活性炭作为吸附剂，可将有机废气中的有机物吸附，并将有机物予以回收再利用，净化率可达90%~99.99%。": "Granular activated carbon (GAC) organic exhaust adsorption, purification and recovery unit: high-performance GAC adsorbs organics from organic exhaust gas and recovers them for reuse, with purification efficiency reaching 90%-99.99%.",
  "工艺流程简单，操作方便，自动化程度高。": "Simple process flow, convenient operation and high automation.",
  "吸附容量大，吸附效率高，有效使用时间长。": "Large adsorption capacity, high adsorption efficiency and long effective service time.",
  "投资少，见效快。": "Low investment and fast results.",
  "有卓越的安全性能，适用于易燃易爆场所。": "Excellent safety performance, suitable for flammable and explosive sites.",
  "性能稳定，技术成熟。": "Stable performance and mature technology.",
  "设备操作弹性大，可承受风量、浓度的剧烈波动。": "High operating flexibility, able to withstand large fluctuations in air volume and concentration.",
  "投资回报期短，通常一年内可收回投资成本。": "Short payback period, usually within one year.",
  "设备使用寿命长达10年，GAC的更换周期为1.5-3年。": "Equipment service life can reach 10 years, with GAC replacement every 1.5-3 years.",
  "流程图待补充": "Process Flow to Be Added",
  "后续上传对应图纸后可直接替换此区域": "This area can be replaced directly after the corresponding drawing is uploaded.",
  "多效蒸发是通过串联多个蒸发器，将前效的二次蒸汽作为下一效加热蒸汽的串联蒸发操作，通过逐级利用蒸汽潜热实现热能节约。在各效中，操作压力、加热蒸汽温度及溶液沸点依次降低，工业应用最常用2～3效。该系统广泛应用于化工、制药、食品等行业，适用于海水淡化、高盐废水处理及物料浓缩等领域。": "Multi-effect evaporation connects multiple evaporators in series, using secondary steam from the previous effect as heating steam for the next effect. Stepwise use of latent heat saves energy. In each effect, operating pressure, heating steam temperature and solution boiling point decrease in sequence. Two to three effects are most common in industrial applications. The system is widely used in chemicals, pharmaceuticals and food, and is suitable for seawater desalination, high-salt wastewater treatment and material concentration.",
  "混氨技术及装置（氨水调配器图）": "Ammonia Mixing Technology and Equipment (Ammonia Water Blender)",
  "液氨储存条件严苛，通常需高压或低温储罐，存在安全风险，而实际使用多需稀释为氨水。但传统加水稀释过程中，液氨易剧烈气化，导致氨气挥发、压力波动及浓度难控等问题，还需额外监管液氨储罐，增加安全隐患与成本。": "Liquid ammonia storage requires strict conditions, usually high-pressure or low-temperature tanks, which create safety risks. In use, it often needs to be diluted into ammonia water. Traditional water dilution can cause violent vaporization, ammonia volatilization, pressure fluctuations and difficult concentration control, while still requiring liquid ammonia tank supervision and adding cost.",
  "我公司自主研发的《氨水调配器》，可在液氨卸车时直接与水按比例混合，一步生成所需浓度的氨水，无需单独设置液氨储罐，既避免液氨储存风险，又精准控制浓度，简化流程，提升安全性与使用效率。": "Chentai's independently developed ammonia water blender mixes liquid ammonia directly with water in proportion during unloading, producing the required concentration in one step. It avoids separate liquid ammonia storage, controls concentration accurately, simplifies the process, and improves safety and efficiency.",
  "MVR系统（配图）": "MVR System",
  "MVR系统将低温低压的蒸汽经过压缩机进行压缩，提高蒸汽温度和压力，然后将高温高压的蒸汽传递给蒸发器，用于加热液体，使液体中的水分蒸发分离。蒸发后的蒸汽经过冷凝器冷凝回收，再经过再压缩，形成循环，实现高效能量利用。": "The MVR system compresses low-temperature, low-pressure steam to raise its temperature and pressure, then transfers the high-temperature, high-pressure steam to the evaporator to heat liquid and evaporate water. The vapor is condensed, recovered and recompressed to form a cycle for efficient energy use.",
  "高效节能：采用机械蒸汽再压缩技术，能够充分利用能量，节约能源消耗。": "High efficiency and energy saving: mechanical vapor recompression fully uses energy and reduces consumption.",
  "环保节能：蒸发过程中产生的蒸汽可以进行冷凝回收利用，减少能源消耗和环境污染。": "Environmental and energy benefits: vapor generated during evaporation can be condensed and reused, reducing energy consumption and pollution.",
  "稳定性好：采用循环压缩蒸汽的方式，能够稳定控制蒸发温度和蒸发效率。": "Good stability: circulating compressed vapor helps control evaporation temperature and efficiency.",
  "自动化程度高：可实现智能控制和远程监控，操作简单方便。": "High automation: intelligent control and remote monitoring make operation simple and convenient.",
  "营业执照": "Business License",
  "公司依法登记设立，经营范围覆盖工业工程设计、环保治理、设备制造及相关技术服务。": "The company is legally registered, with business scope covering industrial engineering design, environmental treatment, equipment manufacturing and related technical services.",
  "开户许可证": "Account Opening Permit",
  "公司基本账户开户许可资料，用于企业经营往来和项目合作资信资料补充。": "Basic account opening permit materials are used for business transactions and project cooperation credit documentation.",
  "特种设备生产许可证": "Special Equipment Production License",
  "具备固定式压力容器相关生产许可，为压力容器类环保设备制造提供资质支撑。": "The company holds production permission for fixed pressure vessels, supporting qualified manufacture of pressure-vessel environmental equipment.",
  "有机气体回收治理装置取得防爆合格证，适用于化工、医药等安全要求较高的现场。": "Organic gas recovery and treatment equipment has obtained explosion-proof certification, suitable for chemical, pharmaceutical and other high-safety sites.",
  "安全生产标准化": "Work Safety Standardization",
  "公司获安全生产标准化达标小微企业证书，强化生产安全和现场管理基础。": "The company has obtained work safety standardization certification for small and micro enterprises, strengthening production safety and site management.",
  "建筑业企业资质证书": "Construction Enterprise Qualification Certificate",
  "具备建筑机电安装工程、环保工程等相关承包资质，支撑项目现场安装交付。": "Chentai holds contracting qualifications for building mechanical and electrical installation and environmental engineering, supporting site installation and delivery.",
  "创新与荣誉证书": "Innovation and Honor Certificates",
  "公司在创新创业赛事、行业荣誉评选中取得相关奖项，体现持续研发和技术转化能力。": "Awards from innovation competitions and industry honors reflect continuous R&D and technology transformation capability.",
  "研发机构与荣誉": "R&D Institution and Honors",
  "公司研发中心及相关荣誉证书，为技术路线验证和工程产品迭代提供组织支撑。": "The R&D center and related honors provide organizational support for technical route verification and engineering product iteration.",
  "商标注册证": "Trademark Registration Certificate",
  "公司拥有商标知识产权，形成统一的品牌识别和产品服务标识体系。": "The company owns trademark intellectual property, forming a unified brand identity and product-service marking system.",
  "实验室环境与基础仪器": "Laboratory Environment and Basic Instruments",
  "检测分析设备": "Testing and Analysis Equipment",
  "恒温、称量与辅助实验设备": "Constant-temperature, Weighing and Auxiliary Lab Equipment",
  "首页板块导航": "Home section navigation",
  "石家庄辰泰环境科技有限公司公司大门": "Shijiazhuang Chentai company gate",
  "技术研发中心实验室": "Technology R&D center laboratory",
  "智能化高端加工设备车间": "Intelligent high-end processing equipment workshop",
  "资质证书轮播": "Certificate carousel",
  "高新技术企业证书": "High-tech enterprise certificate",
  "河北省工业企业研发机构证书": "Hebei industrial enterprise R&D institution certificate",
  "专精特新牌匾": "Specialized and innovative enterprise plaque",
  "绿色工厂牌匾": "Green factory plaque",
  "科技型中小企业证书": "Technology-based SME certificate",
  "企业荣誉证书": "Corporate honor certificate",
  "切换到第 1 张": "Go to slide 1",
  "切换到第 2 张": "Go to slide 2",
  "切换到第 3 张": "Go to slide 3",
  "切换到第 4 张": "Go to slide 4",
  "切换到第 5 张": "Go to slide 5",
  "切换到第 6 张": "Go to slide 6",
  "切换到第 7 张": "Go to slide 7",
  "切换到第 8 张": "Go to slide 8",
  "切换到第 9 张": "Go to slide 9",
  "车间设备轮播": "Workshop equipment carousel",
  "智能化车间设备": "Intelligent workshop equipment",
  "车间加工设备": "Workshop processing equipment",
  "车间生产线": "Workshop production line",
  "大型设备加工": "Large equipment processing",
  "辰泰风采轮播": "Chentai culture carousel",
  "辰泰团队风采": "Chentai team culture",
  "辰泰风采活动": "Chentai company event",
  "辰泰团队活动": "Chentai team event",
  "辰泰企业活动": "Chentai corporate event",
  "车间设备与企业风采轮播": "Workshop equipment and company culture carousel",
  "辰泰环保厂区": "Chentai factory area",
  "车间设备": "Workshop equipment",
  "工程现场": "Engineering site",
  "公司活动": "Company event",
  "科研创新能力概览": "R&D innovation capability overview",
  "科研创新团队": "R&D innovation team",
  "研发流程": "R&D process",
  "科研创新流程设计示意图": "R&D process design diagram",
  "实验平台": "Experimental platform",
  "业务领域能力概览": "Business fields capability overview",
  "工艺解决方案能力概览": "Process solutions capability overview",
  "工艺解决方案目录": "Process solutions directory",
  "精馏分离技术及装置流程图": "Distillation separation technology and equipment flowchart",
  "硫化氢尾气综合治理与硫回收流程图": "H2S tail-gas treatment and sulfur recovery flowchart",
  "VOCs尾气回收治理流程图": "VOCs exhaust recovery and treatment flowchart",
  "多效蒸发系统流程图": "Multi-effect evaporation system flowchart",
  "石家庄辰泰环境科技有限公司营业执照": "Shijiazhuang Chentai business license",
  "ISO9001质量管理体系认证证书": "ISO9001 quality management system certificate",
  "安全生产标准化证书": "Work safety standardization certificate",
  "河北省科技型中小企业证书": "Hebei technology-based SME certificate",
  "河北省专精特新中小企业证书": "Hebei specialized and innovative SME certificate",
  "创新创业大赛获奖证书": "Innovation and entrepreneurship competition award certificate",
  "研发中心证书": "R&D center certificate",
  "专利证书": "Patent certificate",
  "辰泰环保实验室": "Chentai laboratory",
  "公司实验室仪器与实验环境": "Company laboratory instruments and environment",
  "实验室检测设备": "Laboratory testing equipment",
  "实验室恒温及称量设备": "Laboratory constant-temperature and weighing equipment",
  "冷冻法回收有机溶剂工艺流程图": "Organic solvent cryogenic recovery process flowchart",
  "吸收法回收溶剂工艺流程图": "Solvent absorption recovery process flowchart",
  "白油吸收塔工艺流程图": "White-oil absorption tower process flowchart",
  "醋酸萃取精馏回收工艺流程图": "Acetic acid extraction distillation recovery process flowchart",
  "DMSO精馏回收工艺流程图": "DMSO distillation recovery process flowchart",
  "硫化氢尾气制取单质硫工艺流程图": "Elemental sulfur production from H2S tail gas flowchart",
  "化工 / 医药 / 涂布 / 新材料": "Chemical / pharmaceutical / coating / new materials",
  "如丙酮、乙酸乙酯、DMF、VOCs等": "For example: acetone, ethyl acetate, DMF, VOCs, etc.",
  "如 10000 Nm3/h": "For example: 10000 Nm3/h",
  "可备注已有检测报告、流程图或现场照片": "You may note existing test reports, flowcharts or site photos.",
  "请描述项目现状、治理目标、回收介质、现场限制或希望咨询的问题": "Describe the current project status, treatment goals, recovered media, site constraints or questions."
};

const staticOriginalText = new WeakMap();
const staticOriginalAttrs = new WeakMap();
let staticOriginalTitle = "";

function t(key) {
  return labels[currentLang][key] || labels.zh[key] || key;
}

function translatedValue(key) {
  return labels[currentLang]?.[key] || labels.zh?.[key] || "";
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("chentai-theme", theme);
  } catch (error) {
    // Theme still works for this visit when storage is unavailable.
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem("chentai-theme");
  } catch (error) {
    return null;
  }
}

function applyTheme(theme = currentTheme) {
  currentTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = currentTheme;
  document.body.dataset.theme = currentTheme;
  updateThemeToggle();
}

function updateThemeToggle() {
  const toggle = $("[data-theme-toggle]");
  if (!toggle) return;
  const isDark = currentTheme === "dark";
  toggle.textContent = isDark ? t("theme.light") : t("theme.dark");
  toggle.setAttribute("aria-label", isDark ? t("theme.toLight") : t("theme.toDark"));
}

function initThemeToggle() {
  applyTheme(getStoredTheme() || "dark");
  const toggle = $("[data-theme-toggle]");
  if (!toggle || toggle.dataset.themeReady === "true") return;
  toggle.dataset.themeReady = "true";
  toggle.addEventListener("click", () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setStoredTheme(nextTheme);
  });
}

function localField(item, key, fallback = "") {
  return currentLang === "en" ? item[`${key}En`] || item[key] || fallback : item[key] || fallback;
}

function withOriginalSpacing(original, replacement) {
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  return `${leading}${replacement}${trailing}`;
}

function applyStaticEnglishOverrides() {
  if (!staticOriginalTitle) staticOriginalTitle = document.title;
  const titleSource = staticOriginalTitle.trim();
  document.title = currentLang === "en" && staticEnglishOverrides[titleSource]
    ? staticEnglishOverrides[titleSource]
    : staticOriginalTitle;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, [data-i18n]")) return;
    if (!staticOriginalText.has(node)) staticOriginalText.set(node, node.nodeValue);
    const original = staticOriginalText.get(node);
    const replacement = staticEnglishOverrides[original.trim()];
    if (currentLang === "en" && replacement) {
      node.nodeValue = withOriginalSpacing(original, replacement);
    } else if (currentLang === "zh") {
      node.nodeValue = original;
    }
  });

  const attrConfigs = [
    ["alt", "data-i18n-alt"],
    ["aria-label", "data-i18n-aria-label"],
    ["title", "data-i18n-title"],
    ["placeholder", "data-i18n-placeholder"]
  ];

  $$("[alt], [aria-label], [title], [placeholder]").forEach((node) => {
    attrConfigs.forEach(([attr, i18nAttr]) => {
      if (!node.hasAttribute(attr) || node.hasAttribute(i18nAttr)) return;
      let originals = staticOriginalAttrs.get(node);
      if (!originals) {
        originals = {};
        staticOriginalAttrs.set(node, originals);
      }
      if (!Object.prototype.hasOwnProperty.call(originals, attr)) originals[attr] = node.getAttribute(attr);
      const original = originals[attr] || "";
      const replacement = staticEnglishOverrides[original.trim()];
      if (currentLang === "en" && replacement) {
        node.setAttribute(attr, replacement);
      } else if (currentLang === "zh") {
        node.setAttribute(attr, original);
      }
    });
  });
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
  $$("[data-i18n-alt]").forEach((node) => {
    const value = translatedValue(node.dataset.i18nAlt);
    if (value) node.setAttribute("alt", value);
  });
  $$("[data-i18n-title]").forEach((node) => {
    const value = translatedValue(node.dataset.i18nTitle);
    if (value) node.setAttribute("title", value);
  });
  $$("[data-i18n-aria-label]").forEach((node) => {
    const value = translatedValue(node.dataset.i18nAriaLabel);
    if (value) node.setAttribute("aria-label", value);
  });
  const toggle = $("[data-lang-toggle]");
  if (toggle) toggle.textContent = currentLang === "zh" ? "EN" : "CN";
  updateThemeToggle();
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  applyStaticEnglishOverrides();
  updateHeroMode(activeHeroMode);
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
      <article class="news-card card-spotlight" data-spotlight-card data-news-id="${escapeHtml(item.id)}" data-news-type="${item.sourceType}">
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
  initSpotlightCards();
  initHomeReveals();
}

function initGalleryCarousel() {
  const carousel = $("[data-gallery-carousel]");
  if (!carousel) return;
  const track = carousel.querySelector("[data-carousel-track]");
  const indicators = carousel.querySelector("[data-carousel-indicators]");
  if (!track || !indicators || carousel.dataset.carouselReady === "true") return;
  carousel.dataset.carouselReady = "true";

  const items = [
    {
      src: "assets/about/company-gate.jpg",
      title: "厂区外景",
      description: "现代化生产基地与工程服务体系。"
    },
    {
      src: "assets/about/workshop-panel-1.png",
      title: "装置框架",
      description: "多层钢结构平台承载尾气回收与溶剂处理单元。"
    },
    {
      src: "assets/about/workshop-panel-2.png",
      title: "管线与塔器",
      description: "不锈钢塔器、冷凝换热与管廊系统协同运行。"
    },
    {
      src: "assets/about/workshop-panel-3.png",
      title: "工程现场",
      description: "面向化工与新材料场景的成套环保设备。"
    },
    {
      src: "assets/about/workshop-panel-4.png",
      title: "现场细节",
      description: "设备安装、巡检通道和安全维护空间一体考虑。"
    }
  ];

  let active = 0;
  let paused = false;
  let dragStart = 0;
  let autoplayTimer;

  track.innerHTML = items.map((item, index) => `
    <figure class="factory-carousel-card" data-carousel-card="${index}" aria-label="${escapeHtml(item.title)}">
      <img src="${item.src}" alt="${escapeHtml(item.title)}" loading="eager" />
      <figcaption>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.description)}</p>
      </figcaption>
    </figure>
  `).join("");

  indicators.innerHTML = items.map((_, index) => `
    <button type="button" data-carousel-dot="${index}" aria-label="切换到第 ${index + 1} 张"></button>
  `).join("");

  const cards = $$("[data-carousel-card]", track);
  const dots = $$("[data-carousel-dot]", indicators);

  const update = () => {
    cards.forEach((card, index) => {
      const offset = (index - active + items.length) % items.length;
      const signedOffset = offset > items.length / 2 ? offset - items.length : offset;
      const absOffset = Math.abs(signedOffset);
      const isActive = signedOffset === 0;
      const state = isActive ? "is-active" : absOffset === 1 ? "is-near" : "is-far";
      card.classList.toggle("is-active", isActive);
      card.classList.toggle("is-near", absOffset === 1);
      card.classList.toggle("is-far", absOffset > 1);
      card.style.setProperty("--offset", signedOffset);
      card.style.setProperty("--rotate", `${signedOffset * -28}deg`);
      card.style.setProperty("--scale", 1 - Math.min(absOffset, 2) * 0.12);
      card.style.setProperty("--z", isActive ? "90px" : "0px");
      card.style.zIndex = String(20 - absOffset);
      card.setAttribute("aria-hidden", isActive ? "false" : "true");
      card.dataset.carouselState = state;
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === active);
      dot.setAttribute("aria-current", index === active ? "true" : "false");
    });
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      if (!paused) go(1);
    }, 3200);
  };

  const goTo = (index, shouldResetAutoplay = false) => {
    active = (index + items.length) % items.length;
    update();
    if (shouldResetAutoplay) restartAutoplay();
  };

  const go = (direction, shouldResetAutoplay = false) => {
    goTo(active + direction, shouldResetAutoplay);
  };

  update();
  restartAutoplay();

  carousel.addEventListener("mouseenter", () => { paused = true; });
  carousel.addEventListener("mouseleave", () => { paused = false; });
  carousel.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-carousel-prev], [data-carousel-next], [data-carousel-dot]")) return;
    dragStart = event.clientX;
    carousel.setPointerCapture?.(event.pointerId);
  });
  carousel.addEventListener("pointerup", (event) => {
    if (event.target.closest("[data-carousel-prev], [data-carousel-next], [data-carousel-dot]")) return;
    const delta = event.clientX - dragStart;
    if (Math.abs(delta) > 42) go(delta < 0 ? 1 : -1, true);
  });

  carousel.addEventListener("click", (event) => {
    const prev = event.target.closest("[data-carousel-prev]");
    const next = event.target.closest("[data-carousel-next]");
    const dot = event.target.closest("[data-carousel-dot]");
    if (!prev && !next && !dot) return;
    event.preventDefault();
    event.stopPropagation();
    if (prev) go(-1, true);
    if (next) go(1, true);
    if (dot) goTo(Number(dot.dataset.carouselDot), true);
  }, true);
  window.addEventListener("beforeunload", () => window.clearInterval(autoplayTimer), { once: true });
}

function initMediaCarousels() {
  $$("[data-media-carousel]").forEach((carousel) => {
    if (carousel.dataset.mediaCarouselReady === "true") return;
    const slides = $$("[data-media-slide], .media-carousel-slide", carousel);
    const dotsWrap = carousel.querySelector("[data-media-dots]");
    if (!slides.length || !dotsWrap) return;
    carousel.dataset.mediaCarouselReady = "true";
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-roledescription", "carousel");

    let active = 0;
    let paused = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isDragging = false;
    let timer;
    const autoplayDelay = Number(carousel.dataset.interval || carousel.dataset.autoplay || 3800);

    dotsWrap.innerHTML = slides.map((_, index) => `
      <button type="button" data-media-dot="${index}" aria-label="切换到第 ${index + 1} 张"></button>
    `).join("");
    const dots = $$("[data-media-dot]", dotsWrap);

    const update = () => {
      slides.forEach((slide, index) => {
        const offset = (index - active + slides.length) % slides.length;
        const signedOffset = offset > slides.length / 2 ? offset - slides.length : offset;
        const absOffset = Math.abs(signedOffset);
        const isActive = signedOffset === 0;
        slide.classList.toggle("is-active", isActive);
        slide.classList.toggle("is-prev", signedOffset === -1);
        slide.classList.toggle("is-next", signedOffset === 1);
        slide.classList.toggle("is-hidden", absOffset > 1);
        slide.style.setProperty("--media-offset", signedOffset);
        slide.style.zIndex = String(20 - absOffset);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
        slide.toggleAttribute("inert", !isActive);
      });
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === active);
        dot.setAttribute("aria-current", index === active ? "true" : "false");
      });
    };

    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        if (!paused) go(1);
      }, Number.isFinite(autoplayDelay) && autoplayDelay > 0 ? autoplayDelay : 3800);
    };

    const goTo = (index, shouldReset = false) => {
      active = (index + slides.length) % slides.length;
      update();
      if (shouldReset) restart();
    };

    const go = (direction, shouldReset = false) => goTo(active + direction, shouldReset);

    carousel.addEventListener("click", (event) => {
      const prev = event.target.closest("[data-media-prev]");
      const next = event.target.closest("[data-media-next]");
      const dot = event.target.closest("[data-media-dot]");
      if (!prev && !next && !dot) return;
      event.preventDefault();
      event.stopPropagation();
      if (prev) go(-1, true);
      if (next) go(1, true);
      if (dot) goTo(Number(dot.dataset.mediaDot), true);
    }, true);

    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });
    carousel.addEventListener("focusin", () => { paused = true; });
    carousel.addEventListener("focusout", () => { paused = false; });
    carousel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      go(event.key === "ArrowRight" ? 1 : -1, true);
    });
    carousel.addEventListener("pointerdown", (event) => {
      if (event.target.closest("[data-media-prev], [data-media-next], [data-media-dot]")) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      isDragging = true;
      paused = true;
      carousel.setPointerCapture?.(event.pointerId);
    });
    carousel.addEventListener("pointerup", (event) => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
        go(deltaX < 0 ? 1 : -1, true);
      }
      paused = false;
    });
    carousel.addEventListener("pointercancel", () => {
      isDragging = false;
      paused = false;
    });

    update();
    restart();
    window.addEventListener("beforeunload", () => window.clearInterval(timer), { once: true });
  });
}

function initSpotlightCards() {
  $$("[data-spotlight-card]").forEach((card) => {
    if (card.dataset.spotlightReady === "true") return;
    card.dataset.spotlightReady = "true";
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      card.style.setProperty("--spotlight-color", "rgba(128, 221, 212, 0.24)");
    });
  });
}

function initInteractiveHero() {
  const hero = $("[data-interactive-hero]");
  if (!hero || hero.dataset.interactiveHeroReady === "true") return;
  hero.dataset.interactiveHeroReady = "true";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (prefersReducedMotion || isCoarsePointer) return;

  let raf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    hero.style.setProperty("--hero-x", currentX.toFixed(2));
    hero.style.setProperty("--hero-y", currentY.toFixed(2));
    raf = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05
      ? requestAnimationFrame(render)
      : 0;
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    targetX = ((x / rect.width) - 0.5) * 52;
    targetY = ((y / rect.height) - 0.5) * 38;
    hero.style.setProperty("--hero-light-x", `${(x / rect.width) * 100}%`);
    hero.style.setProperty("--hero-light-y", `${(y / rect.height) * 100}%`);
    if (!raf) raf = requestAnimationFrame(render);
  });

  hero.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    hero.style.setProperty("--hero-light-x", "62%");
    hero.style.setProperty("--hero-light-y", "42%");
    if (!raf) raf = requestAnimationFrame(render);
  });
}

function updateHeroMode(mode = activeHeroMode) {
  const hero = $("[data-interactive-hero]");
  const copy = $("[data-hero-mode-copy]");
  const modeKey = ["distillation", "solvent", "gas", "manufacturing"].includes(mode) ? mode : "distillation";
  activeHeroMode = modeKey;
  if (hero) hero.dataset.heroMode = modeKey;
  $$("[data-hero-mode-trigger]").forEach((button) => {
    const isActive = button.dataset.heroModeTrigger === modeKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (copy) {
    const labelKey = `hero.mode${modeKey[0].toUpperCase()}${modeKey.slice(1)}Copy`;
    copy.textContent = t(labelKey);
  }
}

function initHeroModeControls() {
  const triggers = $$("[data-hero-mode-trigger]");
  if (!triggers.length) return;
  triggers.forEach((button) => {
    if (button.dataset.heroModeReady === "true") return;
    button.dataset.heroModeReady = "true";
    const mode = button.dataset.heroModeTrigger;
    button.addEventListener("mouseenter", () => updateHeroMode(mode));
    button.addEventListener("focus", () => updateHeroMode(mode));
    button.addEventListener("click", () => updateHeroMode(mode));
  });
  updateHeroMode(activeHeroMode);
}

function channelPanelKey(panel) {
  return panel?.dataset.channelPanel || panel?.id || "";
}

function resolveChannelTarget(rawHash, panels, links) {
  const cleanHash = String(rawHash || "").replace(/^#/, "");
  if (cleanHash) {
    const directPanel = panels.find((panel) => channelPanelKey(panel) === cleanHash);
    if (directPanel) return channelPanelKey(directPanel);
    const nestedTarget = document.getElementById(cleanHash)?.closest("[data-channel-panel]");
    if (nestedTarget) return channelPanelKey(nestedTarget);
  }
  const firstLocalLink = links.find((link) => link.hash);
  return firstLocalLink ? firstLocalLink.hash.slice(1) : channelPanelKey(panels[0]);
}

function setActiveChannel(target, panels, links, options = {}) {
  const activePanel = panels.find((panel) => channelPanelKey(panel) === target);
  if (!activePanel) return;
  panels.forEach((panel) => {
    panel.hidden = channelPanelKey(panel) !== target;
  });
  links.forEach((link) => {
    const linkTarget = resolveChannelTarget(link.hash, panels, links);
    const isActive = linkTarget === target;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "true" : "false");
  });
  if (options.updateHash && window.location.hash !== `#${target}`) {
    history.pushState(null, "", `#${target}`);
  }
  if (options.scroll) {
    const tabs = activePanel.ownerDocument.querySelector("[data-channel-tabs]");
    (tabs || activePanel).scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

function initChannelTabs() {
  const panels = $$("[data-channel-panel]");
  const links = $$("[data-channel-tabs] a[href^='#']");
  if (!panels.length || !links.length) return;
  const activateFromHash = (options = {}) => {
    const target = resolveChannelTarget(window.location.hash, panels, links);
    setActiveChannel(target, panels, links, options);
  };
  links.forEach((link) => {
    if (link.dataset.channelReady === "true") return;
    link.dataset.channelReady = "true";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = resolveChannelTarget(link.hash, panels, links);
      setActiveChannel(target, panels, links, { updateHash: true, scroll: true });
    });
  });
  window.addEventListener("hashchange", () => activateFromHash({ scroll: true }));
  activateFromHash();
}

function initMagneticButtons() {
  $$("[data-magnetic-button]").forEach((button) => {
    if (button.dataset.magneticReady === "true") return;
    button.dataset.magneticReady = "true";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate3d(${(x * 0.16).toFixed(1)}px, ${(y * 0.24 - 2).toFixed(1)}px, 0)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

function initHomeReveals() {
  if (!homeRevealObserver) {
    homeRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        homeRevealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -80px" });
  }

  const revealSelectors = [
    ".home-section-kicker",
    ".home-statement",
    ".capability-tile",
    ".home-delivery-copy",
    ".delivery-track a",
    ".industry-strip a",
    ".contact-card",
    ".contact-map-panel"
  ];

  $$(revealSelectors.join(",")).forEach((node, index) => {
    if (node.dataset.revealReady === "true") return;
    node.dataset.revealReady = "true";
    node.classList.add("home-reveal");
    node.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
    homeRevealObserver.observe(node);
  });

  $$(".capability-tile, .delivery-track a, .industry-strip a").forEach((node) => {
    node.classList.add("home-interactive-card");
  });
}

function initSplitText() {
  $$("[data-split-text]").forEach((element) => {
    const text = element.textContent.trim();
    if (!text) return;
    const splitType = element.dataset.splitType || "chars";
    const units = splitType === "words" ? text.split(/(\s+)/) : Array.from(text);
    element.setAttribute("aria-label", text);
    element.innerHTML = units.map((unit, index) => {
      const isSpace = /^\s+$/.test(unit);
      const safe = isSpace ? "&nbsp;" : escapeHtml(unit);
      return `<span class="split-unit" aria-hidden="true" style="--split-index:${index};">${safe}</span>`;
    }).join("");
    element.classList.remove("is-split-visible");
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-split-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "-80px" });

  $$("[data-split-text]").forEach((element) => observer.observe(element));
}

function initHeroVideo() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$(".hero-video, .inline-loop-video").forEach((video) => {
    if (video.dataset.loopVideoReady === "true") return;
    video.dataset.loopVideoReady = "true";
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.controls = false;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    if (prefersReducedMotion) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }
    const playback = video.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {});
    }
  });
}

function initSideNav() {
  const links = $$(".hero-side-nav a");
  if (!links.length) return;
  const items = links.map((link) => {
    const hash = link.getAttribute("href");
    const target = hash === "#home" ? $(".hero") : $(hash);
    return { link, target };
  }).filter((item) => item.target);

  const setActive = () => {
    const marker = window.scrollY + window.innerHeight * 0.42;
    let active = items[0];
    items.forEach((item) => {
      if (item.target.offsetTop <= marker) active = item;
    });
    items.forEach((item) => item.link.classList.toggle("is-active", item === active));
  };

  setActive();
  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
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
      if (!nav.classList.contains("is-open")) {
        $$(".nav-item.is-expanded", nav).forEach((item) => item.classList.remove("is-expanded"));
      }
    });
  }
  if (nav) {
    nav.addEventListener("click", (event) => {
      const trigger = event.target.closest(".nav-trigger");
      const dropdownLink = event.target.closest(".nav-dropdown a");
      const isCompactNav = window.matchMedia("(max-width: 1100px)").matches;
      if (trigger && isCompactNav) {
        const item = trigger.closest(".nav-item");
        const hasDropdown = item?.querySelector(".nav-dropdown");
        if (hasDropdown && !item.classList.contains("is-expanded")) {
          event.preventDefault();
          $$(".nav-item.is-expanded", nav).forEach((openItem) => {
            if (openItem !== item) openItem.classList.remove("is-expanded");
          });
          item.classList.add("is-expanded");
        }
      }
      if (dropdownLink && isCompactNav) {
        nav.classList.remove("is-open");
        $$(".nav-item.is-expanded", nav).forEach((item) => item.classList.remove("is-expanded"));
      }
    });
  }
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "zh" ? "en" : "zh";
      renderI18n();
      renderNews();
      initSplitText();
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
  initSplitText();
  initThemeToggle();
  initSpotlightCards();
  initInteractiveHero();
  initHeroModeControls();
  initMagneticButtons();
  initHomeReveals();
  initGalleryCarousel();
  initMediaCarousels();
  initChannelTabs();
  initHeroVideo();
  initSideNav();
  bind();
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>网站加载失败</h1><p>${escapeHtml(error.message)}</p></main>`;
});
