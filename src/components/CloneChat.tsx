import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  X, 
  AlertCircle,
  Clock,
  User,
  Cpu,
  Mail,
  Zap
} from "lucide-react";
import { Message } from "../types";
import { PROFILE_INFO, SUGGESTED_QUESTIONS } from "../data";

// Custom light-weight markdown formatter to present list bullets, bold headings, and emails wonderfully.
// This is robust, secure, and doesn't suffer from compilation or peer dependency crashes.
const renderMessageContent = (text: string) => {
  if (!text) return null;
  
  const paragraphs = text.split("\n");
  
  return paragraphs.map((para, pIdx) => {
    let trimmed = para.trim();
    if (!trimmed) return <div key={pIdx} className="h-2"></div>;

    // Ordered or Unordered Lists
    const isBulletList = trimmed.startsWith("- ") || trimmed.startsWith("* ");
    const isNumberedList = /^\d+\.\s/.test(trimmed);

    if (isBulletList) {
      const listContent = trimmed.substring(2);
      return (
        <li key={pIdx} className="ml-4 list-disc pl-1 my-0.5 text-xs sm:text-sm leading-relaxed">
          {formatInline(listContent)}
        </li>
      );
    }

    if (isNumberedList) {
      const match = trimmed.match(/^(\d+)\.\s(.*)/);
      if (match) {
        return (
          <li key={pIdx} className="ml-5 list-decimal pl-1 my-0.5 text-xs sm:text-sm leading-relaxed">
            {formatInline(match[2])}
          </li>
        );
      }
    }

    return (
      <p key={pIdx} className="text-xs sm:text-sm my-0.5 leading-relaxed">
        {formatInline(trimmed)}
      </p>
    );
  });
};

const formatInline = (text: string) => {
  // Regex to match bold **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Render email addresses with mailto: to make it functional
    if (part.includes("@") && part.includes(".") && !part.startsWith("http")) {
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
      const subParts = part.split(emailRegex);
      return subParts.map((sub, sIdx) => {
        if (emailRegex.test(sub)) {
          return (
            <a 
              key={sIdx} 
              href={`mailto:${sub}`} 
              className="text-sky-600 hover:underline font-mono bg-sky-50/50 px-1 py-0.5 rounded"
            >
              {sub}
            </a>
          );
        }
        return sub;
      });
    }
    return part;
  });
};

interface CloneChatProps {
  onCollapse?: () => void;
}

export default function CloneChat({ onCollapse }: CloneChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 你好呀！我是辛柯的 AI 知识分身。\n\n你可以把我当成他本人。我非常了解他做过的 4 个大模型实习项目、他在低代码/数据标注上的沉淀，以及最富特色的“大白话”翻译理念！\n\n你可以测试我的回复，不管是打探他的实习细节，还是向我挑战更难的技术黑话，我都会努力给你“讲人话”解答。建议你可以点击下面的快捷按钮直接开启我们俩的聊天喔！👇",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<any>(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const triggerToast = (text: string) => {
    setCopyToast(text);
    setTimeout(() => {
      setCopyToast(null);
    }, 2800);
  };

  const handleCopyWechat = () => {
    const wechatId = PROFILE_INFO.wechat;
    navigator.clipboard.writeText(wechatId).then(() => {
      triggerToast(`✨ 辛柯微信号 '${wechatId}' 已成功复制到您的剪贴板，快去搜我吧！`);
    }).catch(() => {
      triggerToast(`微信号：${wechatId} (请手动复制哦)`);
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("yinguoqing615@gmail.com").then(() => {
      triggerToast("✉️ 辛柯邮箱 'yinguoqing615@gmail.com' 已复制，随时写信合作！");
    }).catch(() => {
      triggerToast("邮箱：yinguoqing615@gmail.com");
    });
  };

  // Preset smart response database (vernacular, non-jargon)
  const LOCAL_RESPONSES: Record<string, string> = {
    "current_status": "我目前主要在忙两件事，都很充实：\n- **第一，精进我的 AI 技能**。我当前正在努力从一个简单的‘AI 训练协助者’，精进化并转型为真正能够洞察用户细节痛点，并把大模型、API 和自动化工具串起来解决问题的 **AI 产品探索者**。\n- **第二，高强度整理实习项目并搭建这间主页**。也就是你在左侧区域看到的过往 **4 个 AI 相关项目**。希望能在这个小天地里，把过去敲掉头发做出来的成果，原汁原味地分享给每一位朋友、面试官和潜在合作伙伴。\n\n这也是我探索数字分身的第一步，你可以继续在下方挑选其他预设问题，我随时在线等候哈！😄",
    "projects_info": "哈哈，说到我过往在实习中倾尽心血做好的这 4 个作品，那我真是有一肚子话可以说：\n- **1. 智谱—PPT skills 评测**：深度参与大模型及 Agent 在 PPT 创作、排版及格式生成能力上的高精度评测，制定打分细则与考集摸底测试，搜集 Bad Case 对齐迭代，不断提高并对准核心模型在高质量办公场景下的高保真排版呈现质量！\n- **2. 百度-AI 训练师**：类似给数据做‘大扫除’。大语言模型也要吃干净的‘健康细粮’才会聪明。我搭建了高效过滤、清洗语料的自动过滤和语义打标管道，剔除敏感、乱码和脏广告，给算法团队产出最干净的高保真数据集。\n- **3. 视觉设计智能生成平台**：很多人不会写长篇繁琐英文 Prompt，我把 Midjourney/SD 底层参数打包成简单中文勾选项，运营同学只需在工具点配‘科技深蓝’、‘扁平插画’，一秒出媲美大厂的原画参考，彻底释放设计排期压力！\n- **4. 企业级知识整理 RAG 智能体**：像是公司的‘高情商图书馆新版管理员’。新入职员工或者翻阅手册不想在大海捞针，像拉家常一样问它，它精准咬住页数并翻译成好听直白的大白话教你流程。\n\n你还可以选择在左侧卡片点击【翻译成大白话】按钮，检验一下我讲人话的沟通实力哦！",
    "contacts_info": `要一步找我本人开撩或提议面试？那太棒了！随时用以下两种最实在、最直接的方式呼唤我：\n- 📧 **电子邮箱**：[yinguoqing615@gmail.com](mailto:yinguoqing615@gmail.com) —— 每天都会开着手机通知高频查收，最建议发邮件给我，谈合作或推荐入职都极大欢迎！\n- 💬 **加我微信号**：**${PROFILE_INFO.wechat}** —— 这是我个人一直用的微信账号，直接复制或者点击右上角‘加我微信’气泡即可，记得备注‘主页访客’让我看到你哈！\n\n随时留言，看到肯定第一时间真诚秒回！`,
    "jargon_philosophy": "因为在这个大家都喜欢疯狂搬弄‘RAG 架构、Agent 涌现、端侧对齐、大模型智能范式’等生涩英文与高级黑话的时代，我发现**最珍稀的，反而是把高大上的科技术语剥开、用买菜大娘都能听懂的大白话翻译出来的能力**。\n\n听得懂，工具才实实在在能用起来；讲人话，代码才会有源源不断的温度，而不会变成闷在象牙塔里的冷酷机器。这就是我作为一个‘AI 训练师’想一直精进并做好的初心。讨厌装，只说接地气的干货人话！"
  };

  const matchLocalIntent = (text: string): string | null => {
    const clean = text.toLowerCase();
    
    // Exact suggested questions mapping
    if (clean.includes("现在在忙什么") || clean.includes("你现在在做什么") || clean.includes("做什么") || clean.includes("最近")) {
      return "current_status";
    }
    if (clean.includes("作品") || clean.includes("有哪些作品") || clean.includes("实习") || clean.includes("过往") || clean.includes("项目")) {
      return "projects_info";
    }
    if (clean.includes("联系") || clean.includes("合作") || clean.includes("联系你") || clean.includes("邮箱") || clean.includes("微信")) {
      return "contacts_info";
    }
    if (clean.includes("人话") || clean.includes("复杂问题") || clean.includes("特点") || clean.includes("特点是") || clean.includes("特点？")) {
      return "jargon_philosophy";
    }
    return null;
  };

  const simulateTypewriterResponse = (responseText: string) => {
    setIsLoading(false);
    setIsTyping(true);

    const botMsgId = `msg-${Date.now()}-local-bot`;
    const emptyBotMsg: Message = {
      id: botMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, emptyBotMsg]);

    let currentIndex = 0;
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIndex += 2; // Output 2 characters at a time for fluent experience
      if (currentIndex <= responseText.length) {
        const slicedText = responseText.slice(0, currentIndex);
        setMessages((prev) => 
          prev.map((m) => (m.id === botMsgId ? { ...m, content: slicedText } : m))
        );
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setMessages((prev) => 
          prev.map((m) => (m.id === botMsgId ? { ...m, content: responseText } : m))
        );
        setIsTyping(false);
      }
    }, 12);
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (isLoading || isTyping) return;

    const rawText = textToSend || inputMessage;
    const cleanText = rawText.trim();
    if (!cleanText) return;

    if (!textToSend) {
      setInputMessage("");
    }

    // Append user message to list
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: cleanText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setApiError(null);

    // 1. Prioritize Intent Matcher (Always real, extremely interactive, zero lag)
    const localKey = matchLocalIntent(cleanText);
    if (localKey && LOCAL_RESPONSES[localKey]) {
      // Simulate natural thinking delay (350ms) then start typing beautifully!
      setTimeout(() => {
        simulateTypewriterResponse(LOCAL_RESPONSES[localKey]);
      }, 350);
      return;
    }

    // 2. Fallback to server API for custom open-ended questions
    try {
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: chatHistory })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "大模型服务器通信略微有点波折。");
      }

      // Output Gemini response via smooth typewriter
      simulateTypewriterResponse(data.reply);
    } catch (err: any) {
      console.warn("Server API error, trigger intelligent local fallback: ", err);
      // Give smart fallback answers instead of breaking up, showing ultimate resilience!
      setTimeout(() => {
        const fallbackText = "哎呀，数字分身刚才遭遇了网络连线的微弱波动 🛰️，或者是 GEMINI_API_KEY 暂时没有在右侧面板的 Settings/Secrets 中完成初始化对接。\n\n不过不用担心！我的本地脑库已经准备好！**您可以直接在下方点击热门预设问题，这些我在离线状态下同样能为您做出极度细腻、绝对真诚的大白话讲人话解答！** 随时等您提问哦！";
        simulateTypewriterResponse(fallbackText);
        setApiError("（建议在右侧设置面板 Secrets 填入 GEMINI_API_KEY 以解锁全部自由度追问聊天哈！）");
      }, 400);
    }
  };

  const handleSuggestClick = (question: string) => {
    if (isLoading || isTyping) return;
    handleSendMessage(question);
  };

  const clearChat = () => {
    if (window.confirm("确定要清空与数字分身的聊天记录并重新对话吗？")) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "对话已经重新启动！我是辛柯的数字分身，您可以继续点击建议问题，或者随便找我唠嗑！",
          timestamp: new Date()
        }
      ]);
      setApiError(null);
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div id="clone-chat-card" className="glass-card-inner">
      
      {/* Toast Notice inside chat card */}
      {copyToast && (
        <div id="copy-toast" className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-xs text-white px-3.5 py-2 rounded-full shadow-lg border border-slate-800 flex items-center gap-1.5 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>{copyToast}</span>
        </div>
      )}

      {/* Optimized compact header */}
      <div className="glass-bar px-3.5 py-3 flex items-center justify-between border-b shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <span className="absolute -top-0.5 -right-0.5 inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
            <div className="glass-chip w-8 h-8 rounded-lg flex items-center justify-center text-slate-700">
              <Cpu className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-xs md:text-sm font-semibold text-slate-800 tracking-tight font-sans truncate">
              辛柯的数字分身
            </h2>
            <p className="text-[10px] text-slate-500 flex items-center gap-0.5 font-mono">
              <Sparkles className="w-2.5 h-2.5 text-cyan-600" /> Online
            </p>
          </div>
        </div>

        {onCollapse && (
          <button 
            type="button"
            onClick={onCollapse}
            title="收起对话"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white/30 transition duration-200 cursor-pointer shrink-0 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Message area — scroll contained inside chat panel only */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3.5 glass-scroll space-y-4 overscroll-contain">
        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div 
              key={msg.id} 
              className={`flex gap-2 max-w-[95%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              {/* Profile Bubble */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                isBot 
                  ? "bg-slate-800 border-slate-700 text-cyan-200" 
                  : "bg-cyan-600 border-cyan-500 text-white"
              }`}>
                {isBot ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Message wrapper */}
              <div className="space-y-0.5 min-w-0">
                <div className={`p-3 rounded-xl text-slate-800 font-sans ${
                  isBot 
                    ? "glass-bubble-bot rounded-tl-sm" 
                    : "glass-bubble-user text-white rounded-tr-sm"
                }`}>
                  <div className={isBot ? "text-slate-700 font-sans" : "text-white font-sans"}>
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
                <span className={`text-[9px] text-slate-400 font-mono block ${!isBot && "text-right"}`}>
                  <Clock className="w-2.5 h-2.5 inline mr-1" />
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {(isLoading || isTyping) && (
          <div className="flex gap-2 max-w-[95%] mr-auto">
            <div className="w-7 h-7 rounded-full glass-chip text-slate-600 flex items-center justify-center shrink-0 mt-0.5 animate-spin">
              <Loader2 className="w-3.5 h-3.5" />
            </div>
            <div className="glass-bubble-bot p-3 rounded-xl rounded-tl-sm">
              <span className="text-xs text-slate-500 font-sans flex items-center gap-1.5">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
                <span className="text-[10px] font-mono">thinking...</span>
              </span>
            </div>
          </div>
        )}

        {apiError && (
          <div className="p-3 rounded-lg glass-chip flex items-start gap-2">
            <Zap className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-[10px] font-bold text-slate-700 font-sans">密钥提示</h4>
              <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
                {apiError}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Suggested quick prompt area */}
      <div className="glass-bar border-t p-3 space-y-2 shrink-0">
        <span className="text-[9px] font-mono font-medium text-slate-500 flex items-center gap-1 uppercase tracking-wider">
          <Zap className="w-3 h-3 text-cyan-600" />
          快捷提问
        </span>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => handleSuggestClick(question)}
              disabled={isLoading || isTyping}
              className="text-[10px] sm:text-[11px] font-sans text-slate-600 glass-chip rounded-md px-2 py-1 hover:text-cyan-700 disabled:opacity-50 transition cursor-pointer select-none"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input container */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 glass-bar border-t flex gap-1.5 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="输入问题，与数字分身对话..."
          disabled={isLoading || isTyping}
          className="glass-input flex-1 rounded-lg px-3 py-1.5 text-xs focus:outline-hidden disabled:opacity-60 disabled:text-slate-400 font-sans min-w-0"
        />
        <button
          type="submit"
          disabled={isLoading || isTyping || !inputMessage.trim()}
          className="glass-icon-dark hover:bg-slate-800/80 text-white font-sans font-medium text-xs p-2.5 rounded-lg flex items-center justify-center transition duration-150 disabled:bg-white/25 disabled:text-slate-400 disabled:shadow-none cursor-pointer h-[34px] w-[34px] shrink-0"
          title="发送"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
