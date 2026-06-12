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
      content: "嘿，我是辛柯的数字分身 👋\n\n想打听他最近在干嘛、做过啥项目、怎么联系他——问我就行。我会尽量讲人话，不装懂。\n\n拿不准的我不会瞎编，会直接让你去找本人确认。下面几个快捷问题可以先点着玩～",
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
    "current_status": "最近在忙这几件事，说实话有点上头：\n- **整理 AI 项目**，把实习做过的东西捋清楚\n- **从 0 到 1 鼓捣这个个人站**（你现在正在逛的）\n- **用 AI 做产品**，边学边试\n- **学 vibecoding**，写代码这件事也想玩得更顺一点\n\n主页左边有 4 个实习项目卡片，想深挖哪个可以继续问我～",
    "projects_info": "实习做过 4 个项目，给你一分钟版：\n- **智谱 PPT 评测**：当大模型的 PPT 考官，抓排版烂、格式乱的 Bad Case\n- **百度 AI 训练师**：给脏数据做大扫除，洗出能喂模型的干净语料\n- **天际汽车 UI**：用 MJ/SD 做小工具，运营勾选风格就能出图\n- **来未来 UI**：医疗数据可视化大屏、动效、移动端与品牌物料设计\n\n想听大白话版，去左边卡片点「切换大白话」～",
    "contacts_info": `想找本人？最直接就这两条路：\n- 📧 **邮箱**：[yinguoqing615@gmail.com](mailto:yinguoqing615@gmail.com)\n- 💬 **微信**：**${PROFILE_INFO.wechat}**（备注「主页访客」就行）\n\n谈合作、聊 AI、随便唠都行，他看到会回的。`,
    "ai_interests": "我长期盯这几块：\n- **AI 前沿资讯**——新模型、新工具出了啥，会追着看\n- **行业发展动态**——AI 怎么落地、谁在真干活\n\n具体某家公司内幕、某模型参数细节这种，我没法替本人打包票，拿不准的建议你直接问他本人哈。"
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
    if (clean.includes("关注") || clean.includes("前沿") || clean.includes("资讯") || clean.includes("行业") || clean.includes("擅长") || clean.includes("兴趣")) {
      return "ai_interests";
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
          content: "对话重置啦～我是辛柯的数字分身，继续问就行，拿不准的我不会瞎编。",
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
              <div className={`w-7 h-7 rounded-full shrink-0 mt-0.5 overflow-hidden ${
                isBot ? "" : "bg-cyan-600 border border-cyan-500 flex items-center justify-center"
              }`}>
                {isBot
                  ? <img src="/images/avatar.jpg" alt="辛柯" className="w-full h-full object-cover" />
                  : <User className="w-3.5 h-3.5 text-white" />}
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
