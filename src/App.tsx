/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import AboutMe from "./components/AboutMe";
import CloneChat from "./components/CloneChat";
import { MessageSquare, Terminal, Heart, ChevronDown } from "lucide-react";

export default function App() {
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  const chatSlot = isChatExpanded ? (
    <div className="chat-panel-featured gap-4">
      <div className="shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <img src="/images/avatar.jpg" alt="辛柯" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="section-eyebrow">AI Digital Twin</span>
              <h2 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 leading-tight">
                对话数字分身
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 glass-badge px-2 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Online
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          像和本人聊天一样，了解项目经历、技能方向与合作方式
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <CloneChat onCollapse={() => setIsChatExpanded(false)} />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-4 h-full justify-center">
      <button
        onClick={() => setIsChatExpanded(true)}
        className="glass-collapsed-tab hidden lg:flex w-full max-w-[88px] mx-auto flex-col items-center justify-center gap-5 py-10 text-[#243b53] rounded-2xl cursor-pointer"
        title="点击展开对话数字分身"
      >
        <MessageSquare className="w-6 h-6 text-cyan-600" />
        <span className="text-xs font-mono tracking-widest [writing-mode:vertical-rl]">数字分身</span>
        <span className="text-[10px] glass-chip text-slate-600 px-2 py-0.5 rounded">展开</span>
      </button>

      <button
        onClick={() => setIsChatExpanded(true)}
        className="glass-collapsed-tab lg:hidden w-full flex items-center justify-between p-5 text-[#243b53] rounded-2xl text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="glass-chip p-2.5 rounded-xl shrink-0">
            <MessageSquare className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-[#243b53]">对话数字分身</h4>
            <p className="text-xs text-slate-600 mt-1">点击开始提问，了解项目与合作方式</p>
          </div>
        </div>
        <span className="text-xs font-medium glass-chip text-cyan-700 px-3 py-1.5 rounded-lg shrink-0">
          开始对话
        </span>
      </button>
    </div>
  );

  return (
    <div className="page-bg min-h-screen text-slate-800 selection:bg-cyan-100 flex flex-col font-sans">
      <div className="fixed inset-0 -z-10 bg-[#bae6fd]">
        <img src="/images/hero-beach-bg.png" alt="" className="w-full h-full object-cover object-bottom" />
      </div>
      <header id="main-header" className="sticky top-0 z-40 bg-transparent border-b border-white/25">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden shadow-sm shrink-0">
              <img src="/images/avatar.jpg" alt="辛柯" className="w-full h-full object-cover" />
            </div>
            <span className="font-sans font-semibold text-slate-900 tracking-tight text-sm md:text-base">
              辛柯
            </span>
          </div>

          <a
            href="#scroll-content"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-700 transition-colors"
          >
            项目与技能
            <ChevronDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <main className="flex-1">
        <AboutMe chatSlot={chatSlot} />
      </main>

      <footer className="bg-transparent border-t border-white/25 py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} 阴国庆（辛柯）</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70 text-slate-500">v1.1</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>用大白话把 AI 做到好用</span>
            <Heart className="w-3 h-3 text-cyan-600/70" />
          </div>
        </div>
      </footer>
    </div>
  );
}
