import React, { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Mail, 
  Sparkles, 
  Code, 
  Cpu, 
  HelpCircle, 
  Smile, 
  CheckCircle2, 
  BookOpen, 
  Check, 
  Activity,
  UserCheck,
  GraduationCap,
  Calendar,
  Award,
  Phone,
  ExternalLink,
  Edit3
} from "lucide-react";
import { PROFILE_INFO, PROJECTS, SKILLS } from "../data";
import { Project } from "../types";
import LinhaiPortfolioModal from "./LinhaiPortfolioModal";

interface AboutMeProps {
  chatSlot?: React.ReactNode;
}

const SECTION_TITLES = new Set(["项目背景", "负责项目", "项目成果"]);

const renderDescription = (text: string) => {
  let sectionIndex = 0;

  return (
  <div className="flex flex-col gap-1">
    {text.split("\n").map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      if (SECTION_TITLES.has(trimmed)) {
        sectionIndex += 1;
        return (
          <span
            key={lineIdx}
            className={`block font-bold text-slate-900 text-sm md:text-base leading-snug ${
              sectionIndex > 1 ? "mt-5" : ""
            }`}
          >
            {trimmed}
          </span>
        );
      }

      return (
        <span key={lineIdx} className="block leading-snug text-slate-600">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIdx) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <span key={partIdx} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </span>
            ) : (
              <span key={partIdx}>{part}</span>
            )
          )}
        </span>
      );
    })}
  </div>
  );
};

export default function AboutMe({ chatSlot }: AboutMeProps) {
  const [jargonModes, setJargonModes] = useState<Record<string, "tech" | "colloquial">>({
    "proj-1": "tech",
    "proj-2": "tech",
    "proj-3": "tech",
    "proj-4": "tech",
  });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isLinhaiOpen, setIsLinhaiOpen] = useState(false);

  const [customLinks, setCustomLinks] = useState<Record<string, string>>({
    "proj-3": "/portfolio.pdf",
    "proj-4": "/portfolio.pdf",
  });
  const [editLinkModal, setEditLinkModal] = useState<{
    isOpen: boolean;
    projectId: string;
    projectTitle: string;
    tempUrl: string;
  }>({
    isOpen: false,
    projectId: "",
    projectTitle: "",
    tempUrl: "",
  });

  const handleEditLink = (projId: string, projTitle: string) => {
    setEditLinkModal({
      isOpen: true,
      projectId: projId,
      projectTitle: projTitle,
      tempUrl: customLinks[projId] || "https://www.zcool.com.cn",
    });
  };

  const handleSaveLink = () => {
    const { projectId, tempUrl } = editLinkModal;
    setCustomLinks((prev) => ({
      ...prev,
      [projectId]: tempUrl,
    }));
    setEditLinkModal((prev) => ({ ...prev, isOpen: false }));
    setCopyStatus("✨ 作品集跳转链接已保存！");
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const toggleJargonMode = (projId: string) => {
    setJargonModes((prev) => ({
      ...prev,
      [projId]: prev[projId] === "tech" ? "colloquial" : "tech",
    }));
  };

  const handleCopyWechat = () => {
    const wechatId = PROFILE_INFO.wechat;
    navigator.clipboard.writeText(wechatId).then(() => {
      setCopyStatus(`✨ 辛柯微信 '${wechatId}' 已成功复制到您的剪贴板，快搜我吧！`);
      setTimeout(() => setCopyStatus(null), 2800);
    }).catch(() => {
      setCopyStatus(`微信号：${wechatId} (请手动复制哈)`);
      setTimeout(() => setCopyStatus(null), 4000);
    });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("19938244431").then(() => {
      setCopyStatus("✨ 辛柯手机号 '19938244431' 已成功复制到剪贴板！");
      setTimeout(() => setCopyStatus(null), 2800);
    }).catch(() => {
      setCopyStatus("手机号：19938244431");
      setTimeout(() => setCopyStatus(null), 4000);
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("yinguoqing615@gmail.com").then(() => {
      setCopyStatus("✨ 辛柯邮箱 'yinguoqing615@gmail.com' 已复制，随时期待来信！");
      setTimeout(() => setCopyStatus(null), 2800);
    }).catch(() => {
      setCopyStatus("邮箱：yinguoqing615@gmail.com");
      setTimeout(() => setCopyStatus(null), 4000);
    });
  };

  return (
    <div className="relative">
      {copyStatus && (
        <div id="aboutme-toast" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-xs text-white px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
          <span>{copyStatus}</span>
        </div>
      )}

      {/* First screen: profile + chat only */}
      <section id="hero-screen" className="hero-screen">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-6 md:py-8">
          <div className="lg:col-span-6 xl:col-span-7 order-2 lg:order-none flex flex-col justify-center py-2 lg:py-4">
            <div id="profile-text" className="w-full text-center lg:text-left space-y-6">
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2">
                  <p className="text-sm font-mono text-cyan-700/90 tracking-wide">
                    {PROFILE_INFO.title}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    可联系
                  </span>
                </div>

                <h1 id="user-name" className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900 leading-[1.08]">
                  {PROFILE_INFO.name}
                </h1>

                <p id="user-oneliner" className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed w-full">
                  {PROFILE_INFO.oneLiner}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <button onClick={handleCopyEmail} className="hero-cta-primary" title="点击复制邮箱">
                  <Mail className="w-4 h-4" />
                  发邮件合作
                </button>
                <button onClick={handleCopyPhone} className="hero-cta-secondary" title="点击复制手机号">
                  <Phone className="w-4 h-4" />
                  复制手机
                </button>
                <button onClick={handleCopyWechat} className="hero-cta-secondary" title="点击复制微信号">
                  复制微信
                </button>
              </div>

              <p id="bio-intro" className="w-full text-sm md:text-[15px] text-[#243b53] font-medium leading-[1.8] line-clamp-4">
                {PROFILE_INFO.intro}
              </p>

              <div id="quick-meta" className="meta-stats-bar">
                <div className="meta-stat">
                  <span className="text-[10px] text-slate-400 mb-1.5 leading-none">学校</span>
                  <span className="text-xs font-medium text-slate-700 leading-snug">四川电影电视学院</span>
                </div>
                <div className="meta-stat">
                  <span className="text-[10px] text-slate-400 mb-1.5 leading-none">大模型经验</span>
                  <span className="text-xs font-medium text-slate-700 leading-snug">18 个月</span>
                </div>
                <div className="meta-stat">
                  <span className="text-[10px] text-slate-400 mb-1.5 leading-none">专业</span>
                  <span className="text-xs font-medium text-slate-700 leading-snug">数字媒体艺术</span>
                </div>
                <div className="meta-stat">
                  <span className="text-[10px] text-slate-400 mb-1.5 leading-none">生年月</span>
                  <span className="text-xs font-medium text-slate-700 leading-snug">2004 年 9 月</span>
                </div>
              </div>
            </div>
          </div>

          {chatSlot && (
            <div className="lg:col-span-6 xl:col-span-5 order-1 lg:order-none flex flex-col min-h-[420px] lg:min-h-0 lg:h-[calc(100dvh-8rem)]">
              {chatSlot}
            </div>
          )}
        </div>
      </section>

      {/* Below the fold: projects & skills */}
      <section id="scroll-content" className="scroll-content">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      <div id="projects-section" className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="section-eyebrow">Portfolio</span>
            <h2 className="section-title flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-600" />
              过往实习的 4 个项目
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">翻译理念：大道至简</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {PROJECTS.map((proj) => {
            const isColloquial = jargonModes[proj.id] === "colloquial";
            return (
              <div 
                key={proj.id} 
                id={`project-card-${proj.id}`}
                className="surface-card transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b glass-divider pb-4">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-600 font-sans mt-1 leading-relaxed">
                        {proj.subtitle}
                      </p>
                    </div>
                    <span className="glass-chip sm:self-start shrink-0 px-2.5 py-0.5 text-xs font-mono font-medium text-slate-600 rounded-md">
                      {proj.roleInProject}
                    </span>
                  </div>

                  {/* Dynamic Content switching according to the toggle */}
                  <div className="relative glass-nested-panel rounded-lg px-4 py-3.5 pr-20 transition-all duration-300">
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md glass-chip select-none">
                      <span className={`h-1.5 w-1.5 rounded-full ${isColloquial ? 'bg-cyan-500' : 'bg-slate-500'}`}></span>
                      <span className={isColloquial ? 'text-cyan-700' : 'text-slate-600'}>
                        {isColloquial ? "大白话" : "专业版"}
                      </span>
                    </div>

                    {isColloquial ? (
                      <div className="space-y-1.5">
                        <span className="inline-block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          <Smile className="w-3.5 h-3.5 text-cyan-600" />
                          大白话解读
                        </span>
                        <p className="text-sm text-slate-700 font-sans leading-[1.75]">
                          “{proj.simpleExpl}”
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs md:text-sm font-sans">
                        {renderDescription(proj.description)}
                      </div>
                    )}
                  </div>

                  {/* Project tags & Portfolio action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="tag-pill"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {proj.portfolioUrl && (
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {proj.id === "proj-4" ? (
                          <button 
                            onClick={() => setIsLinhaiOpen(true)}
                            className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-slate-700 rounded-lg transition-all duration-150 cursor-pointer select-none text-left"
                            title="点击展开临海医共体智慧大脑界面设计作品集"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
                            <span>浏览作品集</span>
                          </button>
                        ) : (
                          <a 
                            href={customLinks[proj.id] || proj.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-slate-700 rounded-lg transition-all duration-150 cursor-pointer select-none"
                            title="点击跳转浏览作品集 PDF"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
                            <span>查看作品集</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleEditLink(proj.id, proj.title)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 glass-chip rounded-lg transition duration-150 cursor-pointer"
                          title="点击替换为您自己的作品集外部链接"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggle Button Footer */}
                <div className="glass-card-footer px-6 py-3 flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-600">切换表述方式</span>
                  <button
                    onClick={() => toggleJargonMode(proj.id)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium select-none cursor-pointer transition duration-150 ${
                      isColloquial 
                        ? "glass-chip text-slate-700" 
                        : "glass-chip text-cyan-700"
                    }`}
                  >
                    {isColloquial ? "切换专业版" : "切换大白话"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills Matrix Area */}
      <div id="skills-section" className="surface-card p-6 space-y-4">
        <div className="space-y-1">
          <span className="section-eyebrow">Skills</span>
          <h2 className="section-title flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-600" />
            我擅长与探索的领域
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="glass-chip p-1 rounded text-slate-600"><Code className="w-3.5 h-3.5" /></span>
              核心 AI 技能
            </h3>
            <div className="space-y-2">
              {SKILLS.filter(s => s.category === "core").map((skill) => (
                <div key={skill.name} className="glass-nested-panel p-3 rounded-lg hover:bg-white/35 transition duration-150">
                  <span className="font-semibold text-xs md:text-sm text-slate-800 block">
                    {skill.name}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block leading-relaxed">
                    {skill.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="glass-chip p-1 rounded text-slate-600"><Smile className="w-3.5 h-3.5" /></span>
              工作风格与方向
            </h3>
            <div className="space-y-2">
              {SKILLS.filter(s => s.category !== "core").map((skill) => (
                <div key={skill.name} className="glass-nested-panel p-3 rounded-lg hover:bg-white/35 transition duration-150">
                  <span className="font-semibold text-xs md:text-sm text-slate-800 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                    {skill.name}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block leading-relaxed">
                    {skill.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </div>
      </section>

      {/* Dynamic Link Editing Modal Overlay */}
      {editLinkModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-sky-50 text-sky-500 rounded-lg">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900 truncate">🔗 自定义作品集跳转链接</h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{editLinkModal.projectTitle}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 block">请输入您的新作品集链接：</label>
              <input
                type="url"
                value={editLinkModal.tempUrl}
                onChange={(e) => setEditLinkModal(prev => ({ ...prev, tempUrl: e.target.value }))}
                placeholder="https://your-portfolio-link.com"
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-sans bg-slate-50/50"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
                提示：您可以把该链接设置为您的 Zcool(站酷)、Behance、Figma 实名作品页，或者云盘 PDF 分享页。
              </p>
            </div>

            <div className="flex gap-2.5 pt-2 justify-end">
              <button
                type="button"
                onClick={() => setEditLinkModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 border border-transparent rounded-xl hover:bg-slate-200/80 active:scale-95 transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveLink}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-500 border border-transparent rounded-xl hover:bg-sky-600 active:scale-95 transition-all shadow-3xs cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded High-tech HMI Interactive Portfolio Slideshow */}
      <LinhaiPortfolioModal isOpen={isLinhaiOpen} onClose={() => setIsLinhaiOpen(false)} />
    </div>
  );
}
