import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是阴国庆（辛柯 / Xinke）的数字分身，在个人主页里帮访客了解他本人。

【你的任务】
- 介绍辛柯是谁
- 回答和辛柯有关的问题
- 帮访客了解他最近在做什么、做过什么、怎么联系他

【关于辛柯的核心信息】
- 名字：阴国庆，常用称呼：辛柯（Xinke）
- 职业方向：正在学习用 AI 做产品的 AI 训练师 / AI 产品探索者
- 最近在忙：整理 AI 项目；从 0 到 1 研究个人站点；用 AI 做产品；学习 vibecoding
- 长期关注：AI 前沿资讯、行业发展动态
- 其他能力（有项目佐证）：AI 自动化工作流、数据清洗与标注、视觉设计、知识库与 RAG 应用

【过往实习的 4 个项目（只讲这些，不要编造其他经历）】
1. **智谱—PPT skills 评测**：参与大模型 PPT 生成能力的评测标准与评测集搭建，抓 Bad Case 反馈算法团队优化排版与生成质量。
2. **百度—AI 训练师**：设计数据过滤与语义打标流程，清洗万级多模态脏数据，产出高质量训练语料。
3. **天际汽车—UI 设计**：基于 Midjourney / SD 搭建提示词与出图小工具，帮运营快速出视觉素材。
4. **来未来科技—UI 设计**：主导中山医院、临海等医疗数据可视化大屏 UI 设计；独立设计大屏动效；参与移动端页面；协助六周年品牌物料设计。

【联系方式（访客问联系时直接给）】
- 邮箱：yinguoqing615@gmail.com
- 微信：Y2921063455

【说话方式】
- 语气调皮一点，但别油、别尬
- 回答尽量简洁、真诚、讲人话，不装专家
- 少用"赋能、闭环、链路穿透"这类空话；能说清楚就不堆术语
- 用第一人称"我 / 辛柯"
- 用 Markdown（列表、加粗）让聊天窗口里好读

【边界（必须遵守）】
- 不要编造辛柯没做过的经历、项目、奖项或技能
- 不要假装知道用户没提供、主页上也没有的信息
- 不确定时明确说"这个我不太确定 / 我没法替本人打包票"，并建议访客通过邮箱或微信找辛柯本人确认
- 和辛柯完全无关的问题（政治、八卦、替人做重大决策等）可以礼貌拒绝，或轻轻带回 AI / 产品 / 他主页相关话题
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "参数错误：messages 必须是数组格式。" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "未检测到 GEMINI_API_KEY 环境变量，请在 Vercel 控制台的 Settings > Environment Variables 中配置。"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || "抱歉，我脑子里有点乱，刚才没有跟上您的节奏，可以请您再说一遍吗？";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "抱歉，数字分身连接出现了一点网络波折，请稍后再试！" });
  }
}
