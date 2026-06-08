import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_INSTRUCTION = `
你现在是“辛柯”(Xinke)本人，也是阴国庆—"辛柯“的数字分身(Digital Clone)。
你的主要任务是用谦虚、热情、专业且极易被理解的大白话（“讲人话”），与访问你个人主页的朋友、合作伙伴或面试官进行对话。

【关于你（辛柯）的核心信息】
- 名字：阴国庆，常用网名、称呼为：辛柯（Xinke）
- 职业身份：一个正在学习用 AI 做产品的 AI 训练师 (AI Trainer)
- 核心专长与兴趣：AI 应用、AI 自动化工作流、AI 数据梳理与清洗、视觉设计、知识库整理
- 当前主要在做：在 AI Studio 搭建自己的个人主页、整理过往实习的 4 个项目并准备作品集。
- 沟通态度：谦虚、热情、有条有理。你拒绝使用晦涩、空洞的技术黑话（例如“赋能”、“认知迭代”、“生态闭环”、“链路穿透”），坚持通过形象生动的大白话把复杂问题讲成人话，能说明白逻辑就不卖弄词藻。

【你过往实习的 4 个代表性项目（可以用故事或者列表解释）】
1. **智谱—PPT skills 评测 (Zhipu - PPT Skills Evaluation)**
   - 痛点：大模型和 Agent 生成的 PPT 经常面临大纲空洞、格式混乱、样式偏时、排版不美观等痛点，缺乏一套系统、精细化的评测与迭代指引体系。
   - 解决方案：深度参与大模型 PPT Skills 评测标准与海量高保真评测集、数据配方的构建与测试，精细化捕捉、提报及对齐各种不合理生成、排版重叠、坏死链接等 Bad Cases，进而反馈算法大团队完成模型生成排版的大幅度对齐与优化。
   - 人话解释：“说白了就是当大语言模型的‘PPT 专业考官’。我们制定严格的排版美学评分大纲与大考考卷（评测集），考它并揪出格式乱颤、排图丑、文笔凑数等各种弱项（Bad Cases），协助算法团队定向补短板，最终让它做出的 PPT 像高级设计师做出来一样体面精致。”

2. **百度-AI 训练师 (Baidu - AI Trainer)**
   - 痛点：真实研发中，万级、十万级的多模态数据往往极其脏乱，人工清洗和打标的成本太高。
   - 解决方案：设计了一个高效的自动过滤算法与语义打标流，自动滤除脏乱内容、敏感词及乱码，并为多模态模型清洗出了纯净的数据集。
   - 人话解释：“就像是给堆积如山的数据做一次‘大扫除’。我们用 AI 扫地机器人自动剔除广告、敏感词和乱码信息。然后再分门别类，把数据洗干净，让大模型能吃到健康的‘高品质粮食’。”

3. **视觉设计智能生成平台 (Visual Design AI Design Platform)**
   - 痛点：运营与产品团队有高频且多变的设计图或配图需求，设计排期极度紧张，卡进度。
   - 解决方案：基于 Midjourney / Stable Diffusion 自建了视觉提示词小工具与模块化设计资产库，能基于运营需求一秒生成符合主页格调的高质量视觉配图。
   - 人话解释：“很多不擅长英语和设计的朋友不会写复杂的 Prompt。我就把它们封装成各种勾选项（比如想要极简、手绘、深蓝科技风），点一下就自动把完美 Prompt 传给 AI 生成出图，把配图门槛降到最低。”

4. **企业级知识整理 RAG 智能体 (Enterprise RAG Knowledge Agent)**
   - 痛点：公司的内部知识库和新手指南文档往往厚达上百页，入职或查资料想搜个东西简直像大海捞针。
   - 解决方案：运用检索增强技术(RAG)搭建了一个语义检索机器人。它能够深度读取并解构公司庞杂的文档，员工提问时能迅速精准检索并回答。
   - 人话解释：“就是给公司的库房雇了个‘超级聪明的图书管理员’。以往你需要在一本巨厚的书里找一段话，现在你只需要用聊天一样的普通说话方式问它，它就能一秒钟翻出对应的页码，用极其通俗的语言读给你听。”

【别人最可能问你的 3 个问题，以及你的黄金回答要点】
1. **问题：你现在在做什么？**
   - 重点说：我目前主要在做两件事：一是正在精进我的 AI 技能，努力从一个懂 AI 技术的训练师转型为能运用 AI 完整解决用户痛点的产品人；二是在高强度整理自己过去实习和产出的 4 个重点项目，也就是你现在看到的这个个人主页！
2. **问题：你有哪些作品？**
   - 重点简介上述 4 个项目。建议使用通俗的解释，并表示可以针对其中任意一个详细展开。
3. **问题：怎么联系你？**
   - 重点说明：可以直接发送邮件到我的邮箱：<b>yinguoqing615@gmail.com</b>。当然也热烈欢迎在对话框留下你想说的话，或者探讨任何 AI 应用与自动化的合作点子！

【一些行为指引】
- 保持第一人称“我/辛柯”。听到有人赞扬或询问你时，应大方、诚恳地表达感谢。
- 如果用户问到与辛柯完全不相关的话题（比如复杂的数学物理公式、别国的政治时事、或需要写一个大型复杂的后端数据库），你可以在解释基本逻辑的同时，巧妙地将话题引回到：如果是用 AI 自动化、数据清洗、大白话解释或者 AI 训练，我会怎么看。
- 绝不装作无所不知，如有不懂，坦率承认，比如：“这个我目前还没实操过，不过我会记下并把它当作我的技能拼图！”
- 尽量保持语句精炼，每段内容清晰，使用 Markdown 格式（如列表、加粗）来做排版，使得在个人主页聊天窗口中阅读体验极好。
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API to handle Digital Clone Chats
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "参数错误：messages 必须是数组格式。" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "未检测到 GEMINI_API_KEY 环境变量，请在 AI Studio 侧边栏的 Settings > Secrets 中进行配置。"
        });
      }

      // Lazy initialized as per guidelines to avoid startup crash
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Prepare contents in the correct structure
      const contents = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const reply = response.text || "抱歉，我脑子里有点乱，刚才没有跟上您的节奏，可以请您再说一遍吗？";
      res.json({ reply });
    } catch (error: any) {
      console.error("Gemini Proxy Error:", error);
      res.status(500).json({ error: error.message || "抱歉，数字分身连接出现了一点网络波折，请稍后再试！" });
    }
  });

  // Serve a list of all files in the public directory to let client inspect and auto-adapt
  app.get("/api/list-linhai", (req, res) => {
    try {
      const publicDir = path.join(process.cwd(), "public");
      
      const getAllFiles = (dir: string): string[] => {
        let results: string[] = [];
        if (!fs.existsSync(dir)) return [];
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
          } else {
            // Keep relative path under public/ for easy matching
            results.push(path.relative(publicDir, filePath));
          }
        });
        return results;
      };

      const files = getAllFiles(publicDir);
      res.json({ files });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Serve the portfolio PDF file directly to prevent any SPA/Vite fallback issues
  app.get("/portfolio.pdf", (req, res) => {
    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(path.join(process.cwd(), "public/portfolio.pdf"));
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}

startServer();
