import type { HeroData, ProjectCard, ProjectDetail, AboutData, ContactData, BrandLogo } from "./types";

// ============================================================
// Hero — name + sliding taglines
// ============================================================
export const heroData: HeroData = {
  name: "徐羽佳",
  taglines: [
    { zh: "快消食品", en: "FMCG Food" },
    { zh: "时尚生活", en: "Fashion & Lifestyle" },
    { zh: "商场酒店", en: "Retail & Hospitality" },
  ],
};

// ============================================================
// Projects — chronological order
// ============================================================
export const projects: ProjectCard[] = [
  {
    slug: "campus-tour",
    name: "四城校园行",
    brand: "TAOKAENOI 老板仔",
    date: "2024.4.5 – 5.25",
    tags: ["校园推广", "新品上市", "巡回活动"],
    summary: "郑州、厦门、天津、青岛四城校园巡回，推广新品椰子海苔，线下触达4.7万+",
    cover: "/projects/campus-tour/cover.jpg",
    metrics: [
      { label: "线下触达", value: "47,500+" },
      { label: "线上曝光", value: "110,377" },
      { label: "销售额", value: "¥9,530" },
    ],
  },
  {
    slug: "pet-party",
    name: "小猫小狗同学会",
    brand: "TAOKAENOI 老板仔",
    date: "2024.5.31 – 6.2",
    tags: ["萌宠活动", "IP互动", "伴手礼派发"],
    summary:
      "六一儿童节联合上海苏河湾万象天地，以人偶+摊位+伴手礼融入萌宠主题活动，三天触达1.8万+。",
    cover: "/projects/pet-party/cover.jpg",
    metrics: [
      { label: "参与人数", value: "18,000+" },
      { label: "社媒曝光", value: "226,211" },
      { label: "伴手礼", value: "3,000份" },
    ],
  },
  {
    slug: "bangkok-festival",
    name: "北京泰国风情节",
    brand: "TAOKAENOI 老板仔",
    date: "2024.6.21 – 6.23",
    tags: ["市集活动", "IP互动", "社媒增长"],
    summary:
      "北京三里屯泰国风情节，以摊位打卡+骰子游戏+双人偶CP巡游深度参与，线下触达3万+。",
    cover: "/projects/bangkok-festival/cover.jpg",
    metrics: [
      { label: "线下触达", value: "30,000+" },
      { label: "社媒曝光", value: "57,750" },
      { label: "粉丝增长", value: "2,650位" },
    ],
  },
  {
    slug: "sanya-hotel",
    name: "三亚酒店联动",
    brand: "TAOKAENOI 老板仔",
    date: "2024.8.1 – 8.31",
    tags: ["跨界合作", "线下活动", "社媒投放"],
    summary:
      "首度酒店跨界，联合洲际与希尔顿打造沉浸式品牌体验，覆盖住客全旅程触点，总曝光近30万",
    cover: "/projects/sanya-hotel/cover.jpg",
    metrics: [
      { label: "总曝光", value: "293,278+" },
      { label: "KOL 覆盖", value: "496,153" },
      { label: "下午茶售出", value: "139套" },
    ],
  },
  {
    slug: "xmas-market",
    name: "圣诞集市",
    brand: "TAOKAENOI 老板仔",
    date: "2024.12.21 – 12.22",
    tags: ["快闪集市", "粉丝运营", "IP 互动"],
    summary:
      "大学路圣诞集市摊位+人偶巡游，扭蛋机制驱动社媒涨粉，两日销售额超额完成目标",
    cover: "/projects/xmas-market/cover.jpg",
    metrics: [
      { label: "总曝光", value: "47,248+" },
      { label: "扭蛋互动", value: "1,500+" },
      { label: "净增粉丝", value: "461人" },
    ],
  },
  {
    slug: "cny-2025",
    name: "2025 新春活动",
    brand: "TAOKAENOI 老板仔",
    date: "2024.12 – 2025.2",
    tags: ["整合营销", "明星合作", "快闪展"],
    summary:
      "三阶段递进式 CNY 战役，明星开箱+达人矩阵+UGC+线下快闪，全网曝光 536 万，礼盒售出 1 万套",
    cover: "/projects/cny-2025/cover.jpg",
    metrics: [
      { label: "全网曝光", value: "536万+" },
      { label: "全网互动", value: "17.2万+" },
      { label: "礼盒销售", value: "10,000套" },
    ],
  },
];

// ============================================================
// About — skills + about combined
// ============================================================
export const aboutData: AboutData = {
  capabilities: [
    {
      title: "内容策划",
      titleEN: "Content Strategy",
      description: "爆款内容生产与多平台分发策略",
    },
    {
      title: "品牌活动",
      titleEN: "Brand Campaigns",
      description: "从创意策划到落地执行的全链路管理",
    },
    {
      title: "社媒传播",
      titleEN: "Social Media",
      description: "小红书 / 微博 / 微信矩阵运营与投放",
    },
    {
      title: "数据复盘",
      titleEN: "Data Analysis",
      description: "活动效果分析与迭代优化",
    },
  ],
  styles: ["强执行力", "结果导向", "细节控制"],
  stylesEN: ["Execution-Driven", "Result-Oriented", "Detail-Focused"],
  languages: [
    { name: "CET-6", nameCN: "大学英语六级", level: "" },
    { name: "Shanghai Intermediate Interpretation", nameCN: "上海英语中级口译", level: "" },
  ],
};

// ============================================================
// Contact
// ============================================================
export const contactData: ContactData = {
  email: "546097747@qq.com",
  wechat: "15005770676",
  location: "浙江 · 温州",
  locationEN: "Wenzhou, Zhejiang",
  directions: ["品牌营销", "内容运营", "活动策划"],
  directionsEN: ["Brand Marketing", "Content Strategy", "Event Planning"],
};

// ============================================================
// Brand Logos
// ============================================================
export const brandLogos: BrandLogo[] = [
  { name: "NIKE x 权志龙 联名", file: "NIKE.png", slug: "NIKE", height: "h-15", carouselHeight: "h-14" },
  { name: "宝格丽SERPENTI系列", file: "BVLGARI.png", slug: "bvlgari", height: "h-24", carouselHeight: "h-19" },
  { name: "欧莱雅·金致松露艺术展", file: "LOREAL.png", slug: "LOREAL", height: "h-15", carouselHeight: "h-14", hasDetail0: true },
  { name: "三得利全球首家旗舰店", file: "SUNTORY.png", slug: "SUNTORY", height: "h-8", carouselHeight: "h-8", hasDetail0: true },
  { name: "山姆会员商店中秋礼", file: "sams.png", slug: "sams", height: "h-15", carouselHeight: "h-14", hasDetail0: true },
  { name: "上海浦东香格里拉圣诞季", file: "SHANGRILA.png", slug: "SHANGRILA", height: "h-17", carouselHeight: "h-16", hasDetail0: true },
  { name: "Mardi Mercredi", file: "Mardi.png", slug: "Mardi", height: "h-15", carouselHeight: "h-14", hasDetail0: true },
  { name: "STAYREAL 15周年", file: "STAYREAL.png", slug: "STAYREAL", height: "h-13", carouselHeight: "h-12" },
  { name: "世纪汇广场 x FOLLOW上海", file: "世纪汇广场.png", slug: "世纪汇广场", height: "h-13", carouselHeight: "h-13" },
  { name: "海梦一方DreamGala", file: "dreamgala.png", slug: "DreamGala", height: "h-27", carouselHeight: "h-24", logoClass: "mt-1" },
  { name: "大白兔新春快闪", file: "大白兔.png", slug: "大白兔", height: "h-17", carouselHeight: "h-16", hasDetail0: true },
  { name: "Common Rare凡几", file: "common rare.png", slug: "common rare", height: "h-15", carouselHeight: "h-14", hasDetail0: true },
];

// ============================================================
// Project Details — expanded content for /projects/[slug]
// ============================================================
export const projectDetails: Record<string, ProjectDetail> = {
  "campus-tour": {
    slug: "campus-tour",
    name: "四城校园行",
    subtitle: "郑州、厦门、天津、青岛四城校园巡回，以新品椰子海苔为核心，线下触达4.7万+",
    brand: "TAOKAENOI 老板仔",
    date: "2024.4.5 – 5.25",
    tags: ["校园推广", "新品上市", "巡回活动", "互动游戏"],
    summary:
      "郑州、厦门、天津、青岛四城校园巡回，推广新品椰子海苔，线下触达4.7万+。",
    cover: "/projects/campus-tour/cover.jpg",
    hero: "/projects/campus-tour/hero.webp",
    metrics: [
      { label: "线下触达", value: "47,500+" },
      { label: "线上曝光", value: "110,377" },
      { label: "销售额", value: "¥9,530" },
    ],
    description: `老板仔新品椰子海苔上市之际，在郑州、厦门、天津、青岛四所高校开展巡回推广。现场设置代言人立牌打卡区、游戏互动区、新品售卖台、礼品兑换台等，以满赠机制等驱动转化。线上配合社媒各平台实时宣发，每站活动同步投放图文内容进行社媒造势。

活动覆盖南北方，从不同地区的反响了解到老板仔品牌在各区域的知名度与受众偏好差异，拓宽老板仔往后活动的城市选择。`,
    role: `策略与机制设计：校园巡回活动互动方式规划，设计"扫码互动→骰子/套圈游戏→试吃体验→满赠转化"四级递进互动流程，制定满赠机制 · 视觉与物料统筹：KV需求梳理及设计方向对接，GWP周边构思与厂家生产对接（网兜袋、折叠扇定制） · 现场执行：四城校园活动跟进，补充物料与产品，实时追踪销量 · 线上社媒宣发：配合小红书、微信、微博三平台每站活动实时内容发布与社媒造势 · 数据复盘：汇总四城销售数据，分析南北方城市占比优势，为后续线下活动选址提供参考`,
    gallery: [
      "/projects/campus-tour/scene/01.jpg",
      "/projects/campus-tour/scene/02.jpg",
      "/projects/campus-tour/scene/03.jpg",
      "/projects/campus-tour/scene/04.jpg",
      "/projects/campus-tour/scene/05.jpg",
      "/projects/campus-tour/scene/06.jpg",
      "/projects/campus-tour/scene/07.jpg",
      "/projects/campus-tour/scene/08.jpg",
      "/projects/campus-tour/scene/09.jpg",
      "/projects/campus-tour/scene/10.jpg",
    ],
    videos: [],
    routeMap: true,
    theme: {
      heroObjectPosition: "object-top",
      heroGradientVia: "#abc8d0",
      heroGradientTo: "#c2dae0",
      contentGradientStart: "#c2dae0",
      contentGradientMid: "#d0e6e0",
    },
  },
  "sanya-hotel": {
    slug: "sanya-hotel",
    name: "三亚酒店联动",
    subtitle: "联合三亚半山半岛洲际度假酒店、金茂三亚亚龙湾希尔顿大酒店，打造沉浸式品牌体验",
    brand: "TAOKAENOI 老板仔",
    date: "2024.8.1 – 8.31",
    tags: ["跨界合作", "线下活动", "社媒投放", "KOL营销"],
    summary:
      "首度酒店跨界，联合洲际与希尔顿打造沉浸式品牌体验，覆盖住客全旅程触点，总曝光近30万。",
    cover: "/projects/sanya-hotel/cover.jpg",
    hero: "/projects/sanya-hotel/hero.webp",
    metrics: [
      { label: "总曝光", value: "293,278+" },
      { label: "KOL粉丝覆盖", value: "496,153" },
      { label: "下午茶售出", value: "139套" },
    ],
    description: `老板仔首度跨界酒店行业，联合洲际与希尔顿两大五星酒店，以"快乐际遇/生活，咔嚓一夏"为主题，将海苔零食融入住宿、餐饮、亲子娱乐全场景。

六大互动点位覆盖住客全旅程触点——从迎宾互动区、入住欢迎礼、联名餐食套餐、亲子夏令营到户外沙滩打卡等，近300组亲子家庭到场参与。线上配合13组KOL探店与小红书信息流投放，总曝光近30万，联名下午茶售出139套，成功验证"零食×高端酒店"跨界模式。`,
    role: `创意方案策划：主导"快乐际遇/生活，咔嚓一夏"跨界主题构思，规划六大互动点位覆盖住客全旅程触点 · 视觉与物料设计对接：KV设计跟进，六大点位延展物料构想及设计审核 · 社媒投放策略：社媒宣发方案制定，小红书信息流投放规划，13组KOL筛选与全流程管理（brief撰写、内容审核、发布追踪） · 现场执行协调：活动期间现场统筹，协调酒店运营团队确保活动落地效果 · 数据复盘：全渠道数据汇总与结案报告撰写，验证"零食×高端酒店"跨界模式可行性`,
    gallery: [
      "/projects/sanya-hotel/scene/01.jpg",
      "/projects/sanya-hotel/scene/02.jpg",
      "/projects/sanya-hotel/scene/03.jpg",
      "/projects/sanya-hotel/scene/04.jpg",
      "/projects/sanya-hotel/scene/05.jpg",
      "/projects/sanya-hotel/scene/06.jpg",
      "/projects/sanya-hotel/scene/07.jpg",
      "/projects/sanya-hotel/scene/08.jpg",
      "/projects/sanya-hotel/scene/09.jpg",
      "/projects/sanya-hotel/scene/10.jpg",
      "/projects/sanya-hotel/scene/11.jpg",
    ],
    videos: [
      "/projects/sanya-hotel/videos/0814-老板仔-希尔顿.mp4",
      "/projects/sanya-hotel/videos/0815-老板仔-洲际.mp4",
    ],
    videoCaptions: [
      "金茂三亚亚龙湾希尔顿大酒店",
      "三亚半山半岛洲际度假酒店",
    ],
    videoMaxWidth: "260px",
  },
  "cny-2025": {
    slug: "cny-2025",
    name: "2025 新春活动",
    subtitle: "有仔有福 · 2025 新春礼盒整合营销，三阶段递进式 CNY 战役",
    brand: "TAOKAENOI 老板仔",
    date: "2024.12 – 2025.2",
    tags: ["整合营销", "明星合作", "快闪展", "达人种草"],
    summary:
      "三阶段递进式 CNY 战役，明星开箱+达人矩阵+线上晒单+线下快闪，全网曝光 536 万，礼盒售出 1 万套。",
    cover: "/projects/cny-2025/cover.jpg",
    hero: "/projects/cny-2025/hero.jpg",
    metrics: [
      { label: "全网曝光", value: "5,368,375" },
      { label: "全网互动", value: "172,368" },
      { label: "礼盒销售", value: "10,000套" },
    ],
    description: `2025 年春节前夕，老板仔推出"有仔有福"新春限量版礼盒，在预算可控的前提下，将一款零食礼盒与"新年开箱""年货种草""线下打卡"等春节消费场景深度绑定。

整体分为三阶段递进式推进：预热期官方自媒体发布 CNY 礼盒预告及晒单活动参加方式，同步启动正大广场快闪展物料设计；爆发期四条线并行——明星开箱（邢菲、代高政、纪李）、达人矩阵（18 位 KOL 跨平台 26 篇内容）、UGC 晒单（227 人参与，微信投票 12.8 万+）、线下快闪（正大广场新春展）；余热期公布中奖、内容长尾持续发酵。`,
    role: `整体策略制定：规划三阶段传播节奏，统筹明星开箱、达人矩阵、自媒体运营、线下快闪四条执行线 · 自媒体矩阵运营：各平台宣发新春礼盒，跟进官号晒单活动，筛选 UGC 优质图片用于二次传播，统计各平台活动合格用户并定时开奖 · 线下活动布景：正大广场快闪展物料设计与布置方案 · 结案报告：汇总全渠道数据，输出结案分析`,
    gallery: [
      "/projects/cny-2025/scene/展区全景.jpg",
      "/projects/cny-2025/scene/活动现场人群.jpg",
      "/projects/cny-2025/scene/活动现场展区.jpg",
      "/projects/cny-2025/scene/品牌展示区.jpg",
      "/projects/cny-2025/scene/观众参与.jpg",
    ],
    theme: {
      heroGradientVia: "#c42828",
      heroGradientTo: "#d4422a",
      contentGradientStart: "#d4422a",
      contentGradientMid: "#f5e6d3",
    },
  },
  "xmas-market": {
    slug: "xmas-market",
    name: "圣诞集市",
    subtitle: "大学路圣诞集市摊位+人偶巡游，扭蛋机制驱动社媒涨粉，两日销售额超额完成目标",
    brand: "TAOKAENOI 老板仔",
    date: "2024.12.21 – 12.22",
    tags: ["快闪集市", "粉丝运营", "IP 互动", "限定赠礼"],
    summary:
      "大学路圣诞集市摊位+人偶巡游，扭蛋机制驱动社媒涨粉，两日销售额超额完成目标。",
    cover: "/projects/xmas-market/cover.jpg",
    hero: "/projects/xmas-market/hero.webp",
    metrics: [
      { label: "总曝光", value: "47,248+" },
      { label: "扭蛋互动", value: "1,500+" },
      { label: "销售额", value: "¥8,479" },
    ],
    description: `2024年圣诞季，老板仔入驻上海大学路圣诞集市——魔都圣诞季核心打卡地标之一，周末日均客流过万。品牌以"摊位+人偶巡游"双线并行，通过"扫码关注→扭蛋抽奖"的低门槛互动机制引导消费者关注社媒账号，配合圣诞限定礼包与满赠福利驱动现场销售转化。

现场客流以亲子家庭为主（约60%），人偶IP对各年龄段均有吸引力——小朋友追逐互动，年轻人主动合影并自发传播社媒。两日活动超额完成销售目标，扭蛋机互动超1,500人次，社媒净增粉丝近1000人，活动日粉丝增长达到周期峰值。`,
    role: `方案策划：互动玩法设计（扫码+扭蛋机）、产品组合与礼赠机制 · 物料管理：统筹13类物料的定制采购，包括摊位KV、手举牌、规则牌、代言人海景立牌、手机支架、暖宝宝周边等 · 现场执行：两日活动全程驻场，管理摊位布置、人偶巡游排程、实时销量追踪 · 社媒配合：协调官号前期预热与后期回顾内容发布节奏，监控粉丝增长数据 · 撤场与复盘：库存盘点、物料回收、数据汇总及结案报告撰写`,
    gallery: [
      "/projects/xmas-market/scene/01.jpg",
      "/projects/xmas-market/scene/02.jpg",
      "/projects/xmas-market/scene/03.jpg",
      "/projects/xmas-market/scene/04.jpg",
      "/projects/xmas-market/scene/05.jpg",
      "/projects/xmas-market/scene/06.jpg",
      "/projects/xmas-market/scene/07.jpg",
      "/projects/xmas-market/scene/08.jpg",
      "/projects/xmas-market/scene/09.jpg",
    ],
    videos: [
      "/projects/xmas-market/videos/xmas-market.mp4",
    ],
    videoSectionMaxWidth: "620px",
    videoMaxWidth: "280px",
    theme: {
      heroObjectPosition: "object-top",
      heroGradientVia: "#8b5a4a",
      heroGradientTo: "#c49a88",
      contentGradientStart: "#c49a88",
      contentGradientMid: "#e0d0c4",
    },
  },
  "pet-party": {
    slug: "pet-party",
    name: "小猫小狗同学会",
    subtitle: "上海苏河湾万象天地萌宠主题活动，以摊位+人偶+伴手礼融入，三天触达1.8万+",
    brand: "TAOKAENOI 老板仔",
    date: "2024.5.31 – 6.2",
    tags: ["萌宠活动", "IP互动", "伴手礼派发", "儿童节"],
    summary:
      "六一儿童节联合苏河湾万象天地，以摊位+人偶+伴手礼融入萌宠主题活动，三天触达1.8万+。",
    cover: "/projects/pet-party/cover.jpg",
    hero: "/projects/pet-party/hero.webp",
    metrics: [
      { label: "参与人数", value: "18,000+" },
      { label: "社媒曝光", value: "226,211" },
      { label: "伴手礼派发", value: "3,000份" },
    ],
    description: `2024年六一儿童节期间，老板仔联合上海苏河湾万象天地"小猫小狗同学会"萌宠主题活动，以品牌摊位+人偶互动+伴手礼派发的形式融入活动现场。活动包含双层狗狗巴士城市游、小猫小狗时装走秀、夏日萌宠运动会、名师宠物知识课堂等多个板块，三天吸引超18,000人次参与，是老板仔首次进入萌宠线下场景的尝试。

活动亮点：老板仔3000份伴手礼派发，巴士贴标品牌海苔产品及logo露出，人偶互动及摊位扭蛋机简易游戏。内场+外场3天合计参与18,000+人。`,
    role: `活动前期对接：与主办方沟通品牌摊位位置、人偶巡游排程及巴士贴标露出权益 · 跟进物料设计：摊位品牌视觉设计（KV延展、规则牌、扫码牌、伴手礼卡片），巡游大巴车身贴标设计 · 现场执行：活动驻场，管理摊位运营、人偶巡游、伴手礼发放及实时销量追踪 · 线上宣发配合：协调品牌官号发布活动预告与回顾内容 · 活动复盘：汇总线上线下数据，输出结案报告`,
    gallery: [
      "/projects/pet-party/scene/1.jpg",
      "/projects/pet-party/scene/2.jpg",
      "/projects/pet-party/scene/3.jpg",
      "/projects/pet-party/scene/4.jpg",
      "/projects/pet-party/scene/5.jpg",
      "/projects/pet-party/scene/6.jpg",
      "/projects/pet-party/scene/7.jpg",
      "/projects/pet-party/scene/8.png",
      "/projects/pet-party/scene/9.png",
    ],
    phoneReview: {
      video: "/projects/pet-party/videos/pet-party.mp4",
      reviewImage: "/projects/pet-party/review.jpg",
      phoneFrame: "/projects/pet-party/iphone-frame.png",
    },
    theme: {
      heroObjectPosition: "object-top",
      heroGradientVia: "#d4a574",
      heroGradientTo: "#e8cfa0",
      contentGradientStart: "#e8cfa0",
      contentGradientMid: "#f5e6d3",
    },
  },
  "bangkok-festival": {
    slug: "bangkok-festival",
    name: "北京泰国风情节",
    subtitle: "北京三里屯泰国风情节，以摊位打卡+骰子游戏+双人偶CP巡游深度参与",
    brand: "TAOKAENOI 老板仔",
    date: "2024.6.21 – 6.23",
    tags: ["市集活动", "IP互动", "社媒增长", "线下销售"],
    summary:
      "北京三里屯泰国风情节，以摊位打卡+骰子游戏+双人偶CP巡游深度参与，线下触达3万+。",
    cover: "/projects/bangkok-festival/cover.jpg",
    hero: "/projects/bangkok-festival/hero.webp",
    metrics: [
      { label: "线下触达", value: "30,000+" },
      { label: "销售额", value: "¥9,096" },
      { label: "粉丝净增长", value: "2,650位" },
    ],
    description: `2024年6月，北京三里屯一号场举办泰国风情节，汇集超过40家泰国餐厅和品牌，主打泰国民俗文化体验，含人气泰国明星互动及传统表演。老板仔作为参展品牌之一，以摊位打卡+骰子游戏+双人偶CP巡游的形式深度参与，三天线下触达超3万人次。

活动亮点：老板仔摊位合影打卡区、骰子游戏互动区、老板仔双人偶CP惊喜出现。三日销售额9,096元，社媒粉丝净增长2,650位（微信1,572 + 小红书792 + 抖音286）。购买人群中20-30岁青年占42%，30-40岁宝妈占40%。`,
    role: `摊位设计与搭建：场地排布规划、摊位视觉设计（合影区、骰子游戏区、产品陈列区） · 互动机制设计：设计"扫码关注→投掷骰子→领取奖品"三级递进互动流程 · 物料统筹：游戏规则牌、桌牌、地贴、代言人海景立牌、宣发海报等全套物料设计对接 · 线上配合：活动前后社媒预告与回顾内容发布，实时更新场地信息 · 数据复盘：汇总销售数据、社媒增长数据与消费者画像分析`,
    gallery: [
      "/projects/bangkok-festival/scene/01.jpg",
      "/projects/bangkok-festival/scene/02.jpg",
      "/projects/bangkok-festival/scene/03.jpg",
      "/projects/bangkok-festival/scene/04.JPG",
      "/projects/bangkok-festival/scene/05.jpg",
      "/projects/bangkok-festival/scene/06.jpg",
      "/projects/bangkok-festival/scene/07.jpg",
      "/projects/bangkok-festival/scene/08.JPG",
      "/projects/bangkok-festival/scene/09.JPG",
    ],
    galleryFirst: true,
    theme: {
      heroObjectPosition: "object-top",
      heroGradientVia: "#c4956a",
      heroGradientTo: "#e0c8a0",
      contentGradientStart: "#e0c8a0",
      contentGradientMid: "#f0e0c8",
    },
  },
};
