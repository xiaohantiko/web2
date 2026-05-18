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
    "profile.p1": "石家庄辰泰环境科技有限公司是一家专业从事有机溶媒回收治理的高新技术企业，位于河北省石家庄灵寿县工业园二区，拥有现代化厂房、工程实验室、先进机械加工设备和完整售后服务体系。",
    "profile.p2": "公司围绕有机尾气回收治理、精馏分离、有氧硫化氢制取单质硫等方向，提供技术咨询、工程设计、设备制造、安装调试、技术培训及运行服务。",
    "profile.p3": "辰泰的关键技术特点，是将气相回收系统和液相分离系统从设计端整体融合，统一规划气相回收产生的液体与液相分离产生的不凝气体，实现达标排放、资源回收与能耗控制的协同。",
    "profile.more": "查看完整介绍",
    "profile.pageTitle": "完整公司介绍",
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
    "profile.p1": "Shijiazhuang Chentai Environmental Technology Co., Ltd. is a high-tech enterprise specializing in organic solvent recovery and treatment. Located in Zone 2 of Lingshou County Industrial Park, it has modern workshops, an engineering laboratory, advanced machining equipment and a complete service system.",
    "profile.p2": "The company provides technical consulting, engineering design, equipment manufacturing, installation, commissioning, training and operation services for organic tail-gas recovery, distillation separation and aerobic H2S-to-sulfur processes.",
    "profile.p3": "Chentai's key technical feature is integrating gas-phase recovery with liquid-phase separation from the design stage, so recovered liquids and non-condensable gases are planned together for compliant emission, resource recovery and energy control.",
    "profile.more": "Full Profile",
    "profile.pageTitle": "Full Company Profile",
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

function initGalleryCarousel() {
  const cards = $$(".gallery-carousel-card");
  if (!cards.length) return;
  const images = [
    "assets/gallery/project-site-01.jpg",
    "assets/gallery/project-site-02.jpg",
    "assets/gallery/project-site-03.jpg",
    "assets/gallery/project-site-04.jpg",
    "assets/gallery/project-site-05.jpg?v=20260518b"
  ];
  const visible = cards.map((card, index) => {
    const img = card.querySelector("img");
    const src = images[index % images.length];
    if (img) img.src = src;
    return src;
  });
  let step = cards.length;
  let cardIndex = 0;

  const chooseNext = () => {
    for (let i = 0; i < images.length; i += 1) {
      const candidate = images[(step + i) % images.length];
      if (!visible.includes(candidate)) return candidate;
    }
    return images[step % images.length];
  };

  window.setInterval(() => {
    const card = cards[cardIndex % cards.length];
    const current = card.querySelector("img:not(.gallery-next)");
    const nextSrc = chooseNext();
    const preloader = new Image();

    preloader.onload = () => {
      const next = document.createElement("img");
      next.src = nextSrc;
      next.alt = currentLang === "zh" ? `辰泰环保工程现场 ${cardIndex + 1}` : `Chentai project site ${cardIndex + 1}`;
      next.className = "gallery-next";
      card.appendChild(next);
      window.requestAnimationFrame(() => next.classList.add("is-visible"));
      window.setTimeout(() => {
        if (current) current.remove();
        next.classList.remove("gallery-next", "is-visible");
      }, 1200);
      visible[cardIndex % cards.length] = nextSrc;
      step = (images.indexOf(nextSrc) + 1) % images.length;
      cardIndex = (cardIndex + 1) % cards.length;
    };

    preloader.src = nextSrc;
  }, 2600);
}

function initHeroVideo() {
  const video = $(".hero-video");
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.controls = false;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  const playback = video.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {});
  }
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
  initGalleryCarousel();
  initHeroVideo();
  initSideNav();
  bind();
}

boot().catch((error) => {
  document.body.innerHTML = `<main class="section"><h1>网站加载失败</h1><p>${escapeHtml(error.message)}</p></main>`;
});
