import { Project, SkillItem } from "./types";

export const PROFILE_INFO = {
  name: "阴国庆（辛柯）",
  englishName: "Xinke",
  title: "AI 训练师 / AI 产品探索者",
  oneLiner: "一个正在学习用 AI 做产品的 AI 训练师",
  intro: "具备多模态文生图、视频数据标注与视频模型评测实战经验，了解多模态模型数据训练全流程；能够借助 IDE等⼯具提升⼯作效率，积累知识库。在项目协作中，能够与产品、算法团队高效配合，具备与岗位所需相匹配的学习能力、沟通能力与落地意识;具备扎实的视觉设计基础，兼顾设计审美与数据严谨性。性格随和、团队协作意识强，具有清晰的职业规划，期望在AI多模态领域深耕发展。",
  location: "上海 / 远程",
  email: "yinguoqing615@gmail.com",
  wechat: "Y2921063455",
  currentTask: "整理自己过往实习的 4 个项目，打磨个人作品集与数字分身主页",
  targetAudience: "如果你是我的面试官、潜在合作伙伴，或是对 AI 应用感兴趣的朋友，很高兴认识你！"
};

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "智谱—PPT skills 评测",
    subtitle: "AI HTML功能进行了迭代更新，需要对现有模型效果进行评测，了解模型生成PPT的目前各方面能力水平",
    description: "在实习中深度参与对大语言模型及 Agent 在 PPT 创作与生成各维度（如大纲架构、排版逻辑、排版美观度）的评测标准搭建。通过构建高精度的多维度评测集与数据配方，针对评测中的 Bad Case 反复迭代打磨对齐，推动了大模型在核心生产力场景排版方向的迭代升级。",
    simpleExpl: "就是当一个‘超级严格的大模型 PPT 考官’。以前大模型生成的 PPT 经常格式混乱、样式不美观或者文不对题，我们制定了一整套科学打分标准和考集对它进行摸底测试，把不达标的地方提报给算法团队定向补短板，最终让它生成的 PPT 像专业设计师做的一样高级好看。",
    tags: ["PPT 评测", "大语言模型评测", "质量对齐", "多模态打标", "Bad Case 治理"],
    roleInProject: "多模态模型评测（实习）"
  },
  {
    id: "proj-2",
    title: "百度-AI 训练师",
    subtitle: "万级多模态语料库高精度智能清洗清洗流水线",
    description: "由于大模型在垂类任务训练中需要极其纯净的多模态数据支持，针对数万条含广告、敏感词、废白、乱码的数据，设计并调试了自动归类、语义过滤与标签校准流。为算法团队产出了高质量、纯净的训练高纯度语料包。",
    simpleExpl: "给海量数据做一次精细的‘大扫除’。大语言模型也是人，要吃健康、干净的粮食才会聪明。我们用 AI 扫地机器人除掉乱码广告，像归类衣柜一样把数据分堆，大模型吃了这批‘精粮’表现更好！",
    tags: ["数据清洗", "多模态打标", "格式规整", "大模型高质量数据集"],
    roleInProject: "AI 数据训练师（实习）"
  },
  {
    id: "proj-3",
    title: "天际汽车科技有限公司—UI 设计",
    subtitle: "产品运营图无缝快速创意出图系统",
    description: "产品发布或新媒体运营常常有急迫的设计返工和排版卡点。本人基于 Midjourney & SD 自研调试了通用型高保真画笔与提示词生成器。整理出一键勾选配色风格、物体特征即可出大厂级别原画素材的简易工具，解决了设计排期卡点。",
    simpleExpl: "很多人学写长长的英文 Prompt 学到头大。我直接把复杂的设计参数和效果封包。伙伴们只要勾选‘深蓝科技风’、‘插画扁平’等简单中文，就能直接获得媲美专业插画师的精准参考图，一秒解围排期难。",
    tags: ["Figma", "AE", "comfy UI", "PS", "用户调研", "竞品分析", "原型绘制", "前瞻设计"],
    roleInProject: "UI 设计（实习）",
    portfolioUrl: "/portfolio.pdf"
  },
  {
    id: "proj-4",
    title: "来未来科技有限公司—UI 设计",
    subtitle: "百页内部指南语义搜索与自然语言通俗问答系统",
    description: "解决部门新人入职或操作手册厚达百页、要检索一处定义得翻箱倒柜的难题。基于企业内部已有 PDF 手册、规章，设计向量检索方案(RAG)，搭建起极速定位出处并附带详细说明的垂类 AI 客服系统。",
    simpleExpl: "就像给深奥的庞大图书馆请了一个‘不打官腔、高智商的图书管理员’。你只用问‘我请假怎么走流程’这种普通问题，它立马就翻到具体的 122 页，用极其亲切的大白话，1秒钟把流程教给你听。",
    tags: ["Sketch", "AE", "PS"],
    roleInProject: "UI 设计（实习）",
    portfolioUrl: "/portfolio.pdf"
  }
];

export const SKILLS: SkillItem[] = [
  {
    name: "AI 自动化工作流",
    category: "core",
    description: "Make / Zapier / Coze 等低代码自动化串联，让工具和 API 之间自己对话，把苦活干完"
  },
  {
    name: "AI 数据清理 & 标注",
    category: "core",
    description: "将混乱的一手数据梳理出能喂给大模型的高纯度好粮，善于使用自动化打标"
  },
  {
    name: "AI 应用创意 & RAG 搭建",
    category: "core",
    description: "擅长结合大模型和本地文件资料做检索增强，杜绝 AI 胡言乱语，说大白话"
  },
  {
    name: "视觉与提示词工程",
    category: "core",
    description: "Midjourney、Stable Diffusion、DALL-E 视觉样式设计，提示词工程模版封装"
  },
  {
    name: "知识整理与讲人话",
    category: "interest",
    description: "不喜欢装。拒绝技术黑话，任何晦涩知识都可以在一分钟内，用买菜大娘也能听懂的白话讲透"
  },
  {
    name: "界面清爽视觉排版",
    category: "interest",
    description: "深度强迫症：排版要有呼吸感。文字对齐、配色舒适是我的基础追求"
  }
];

export const SUGGESTED_QUESTIONS = [
  "你现在在忙什么？",
  "一分钟介绍你的 4 个实习作品？",
  "怎么联系或勾搭你？",
  "为什么要在意把复杂科技‘讲成人话’？"
];
