import React, { useState, useEffect } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Grid, 
  Layers, 
  CheckCircle, 
  Sliders, 
  Database,
  Shield,
  Activity,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  CornerDownRight,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImageItem {
  id: string;
  title: string;
  path: string;
  altPaths: string[];
  subtitle: string;
  techs: string[];
  features: string[];
  color: string;
}

const LINHAI_IMAGES: ImageItem[] = [
  {
    id: "device-cockpit",
    title: "设备管理驾驶舱",
    path: "/临海/临海市设备管理驾驶舱.png",
    altPaths: ["/临海/临海市设备管理驾驶舱.png", "/linhai/device_cockpit.png", "/linhai/临海市设备管理驾驶舱.png"],
    subtitle: "临海市医疗机构设备资产及采购全景监控、效率分析大屏",
    techs: ["Sketch", "数据大屏", "ECharts", "E级架构"],
    color: "from-blue-600 to-indigo-600",
    features: ["设备资产折旧状态实时追踪", "高端耗材与维保时效综合评定", "科室闲置率与饱和度动态排序"]
  },
  {
    id: "consumables",
    title: "耗材监管平台",
    path: "/临海/耗材监管平台.png",
    altPaths: ["/临海/耗材监管平台.png", "/linhai/consumables.png", "/linhai/耗材监管平台.png"],
    subtitle: "高低值医用耗材全生命周期追溯及采购限额智能监管系统",
    techs: ["Sketch", "UI设计", "B端管理端", "数据分析"],
    color: "from-sky-500 to-indigo-500",
    features: ["耗材采购两票制透明流向核验", "科室耗材超支区间自动弹窗预警", "供货商时效与质量考核星级看板"]
  },
  {
    id: "internal-control",
    title: "内控监管平台",
    path: "/临海/内控监管平台.png",
    altPaths: ["/临海/内控监管平台.png", "/linhai/internal_control.png", "/linhai/内控监管平台.png"],
    subtitle: "公立医院财务收支、合规审计、预算指标执行全链路内控中心",
    techs: ["Sketch", "财务中台", "多维图表", "权限中心"],
    color: "from-violet-600 to-fuchsia-600",
    features: ["预算、合同、报销全闭环审核规则链", "异常大额财务单据高光高亮标记", "审计轨迹与多级审批电子看板"]
  },
  {
    id: "personnel",
    title: "人员监管平台",
    path: "/临海/人员监管平台.png",
    altPaths: ["/临海/人员监管平台.png", "/linhai/personnel.png", "/linhai/人员监管平台.png"],
    subtitle: "医共体医护人员资质核验、排班效能、工时绩效全方位考核矩阵",
    techs: ["Sketch", "权限矩阵", "人效看板", "报表设计"],
    color: "from-teal-600 to-cyan-600",
    features: ["多点执业多校核签到校验", "资深执业药师合规操作分时段评估", "跨科室会诊负荷及工效自动折算"]
  },
  {
    id: "family-doctor",
    title: "家庭签约服务监管",
    path: "/临海/家庭签约服务监管.png",
    altPaths: ["/临海/家庭签约服务监管.png", "/linhai/family_doctor.png", "/linhai/家庭签约服务监管.png"],
    subtitle: "基层医生家庭签约推进深度、慢病随访追踪、签约服务效能驾驶舱",
    techs: ["Sketch", "地图可视化", "网格监管", "进度追踪"],
    color: "from-emerald-600 to-teal-600",
    features: ["网格化慢病家庭定期履约打分", "签约率与复购流失率分片区热力图", "签约居民健康干预时效预警通知"]
  },
  {
    id: "public-health",
    title: "基本公共卫生资金管理",
    path: "/临海/基本公共卫生资金管理.png",
    altPaths: ["/临海/基本公共卫生资金管理.png", "/linhai/public_health.png", "/linhai/基本公共卫生资金管理.png"],
    subtitle: "基本公卫项目市级统筹补助资金、下拨拨支、结余留用明细监管",
    techs: ["Sketch", "资金流向", "饼图拆解", "Excel导出"],
    color: "from-cyan-600 to-indigo-600",
    features: ["公卫专项项目绩效折合下拨计算机制", "严厉防止违规挪用财务防线及留痕", "多部门拨库资金对账全网透明化"]
  },
  {
    id: "medicine",
    title: "药品监管平台",
    path: "/临海/药品监管平台.png",
    altPaths: ["/临海/药品监管平台.png", "/linhai/medicine.png", "/linhai/药品监管平台.png"],
    subtitle: "基本药物采购比例、药占比限制、抗生素用量及违规用药异常监测",
    techs: ["Sketch", "药理规则库", "柱状趋势", "健康合规"],
    color: "from-indigo-600 to-purple-600",
    features: ["违规开药前置规则阻截与追溯", "两票制药厂合规流通比对分析", "抗生素合理用药等级动态警示仪表盘"]
  },
  {
    id: "alerts",
    title: "预警信息",
    path: "/临海/预警信息.png",
    altPaths: ["/临海/预警信息.png", "/linhai/alerts.png", "/linhai/预警信息.png"],
    subtitle: "全域医疗安全、合规红线、财务风险、服务失效秒级综合弹窗预警中心",
    techs: ["Sketch", "告警流转", "即时通知", "极简卡片"],
    color: "from-rose-600 to-orange-500",
    features: ["高危事件秒级多渠道消息分流触达", "闭环响应率及待办响应超时自动升级", "事件影响评估与智能化等级标定"]
  }
];

interface LinhaiPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinhaiPortfolioModal({ isOpen, onClose }: LinhaiPortfolioModalProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [imageErrored, setImageErrored] = useState<Record<string, boolean>>({});
  const [tryPathIndex, setTryPathIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    // Reset load attempts when modal opens or index changes
    setImageErrored({});
    setTryPathIndex({});
  }, [isOpen, activeIndex]);

  if (!isOpen) return null;

  const currentItem = LINHAI_IMAGES[activeIndex];
  
  // Resolve current active image url based on index
  const currentTryIndex = tryPathIndex[currentItem.id] ?? 0;
  const currentImageUrl = currentTryIndex === 0 ? currentItem.path : currentItem.altPaths[currentTryIndex] || currentItem.path;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % LINHAI_IMAGES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + LINHAI_IMAGES.length) % LINHAI_IMAGES.length);
  };

  const handleImgLoadError = () => {
    // If the image fails to load, try other fallback paths before giving up
    if (currentTryIndex < currentItem.altPaths.length - 1) {
      setTryPathIndex(prev => ({
        ...prev,
        [currentItem.id]: currentTryIndex + 1
      }));
    } else {
      setImageErrored(prev => ({
        ...prev,
        [currentItem.id]: true
      }));
    }
  };

  // Render high-fidelity upload / sync guide when the image file is actually missing
  const renderSyncGuide = (item: ImageItem) => {
    return (
      <div className="absolute inset-0 bg-slate-950 flex flex-col font-sans p-8 border border-amber-500/10 rounded-xl overflow-y-auto">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none"></div>
        
        {/* Top Warning Banner */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-5 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-500 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded shadow-3xs uppercase">
                  READY-TO-SYNC / 等待图稿同步
                </span>
              </div>
              <h4 className="text-md font-extrabold text-white tracking-wider flex items-center gap-1.5 mt-1">
                {item.title} — 界面图稿尚未上传
              </h4>
            </div>
          </div>
          <div className="text-[10px] text-right font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <div>TARGET PATH: /public{item.path}</div>
            <div className="mt-0.5 text-amber-400">WAITING_FOR_DATA | 404 FALLBACK</div>
          </div>
        </div>

        {/* Dynamic Instructional content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-center">
          
          {/* Left panel instructions */}
          <div className="space-y-4 bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
            <h5 className="text-sm font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              如何让该页面呈现真实 UI 设计图？
            </h5>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              您当前选择的 <strong className="text-white">{item.title}</strong> 界面设计尚未在应用后台上传源切图。您可以通过以下简单步骤立即将其激活：
            </p>

            <div className="space-y-3.5 pt-2 text-xs text-slate-300">
              <div className="flex gap-2.5 items-start">
                <span className="h-5 w-5 bg-slate-800 text-slate-300 font-bold font-mono rounded-full flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-semibold text-slate-100">准备切图文件</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">将您做好的 UI 设计大图重命名为 <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px] border border-slate-800">{item.title}.png</code> 或 <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px] border border-slate-800">{item.path.split('/').pop()}</code>。</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="h-5 w-5 bg-slate-800 text-slate-300 font-bold font-mono rounded-full flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-semibold text-slate-100">上传到临海文件夹</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">通过云端编辑器的文件树，将图片直接拖拽或上传到项目根目录下的 <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px] border border-slate-800">public/临海/</code> (或英文重命名后的文件夹) 中。</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="h-5 w-5 bg-slate-800 text-slate-300 font-bold font-mono rounded-full flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-semibold text-slate-100">自动无缝渲染</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">上传完成后刷新本作品集，大图区域将自动完美替换，与设备管理驾驶舱效果完全保持一致！</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel blueprint layout layout demonstration */}
          <div className="bg-[#0b1329]/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-[230px]">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
              <span className="h-2 w-2 rounded-full bg-slate-600 animate-pulse"></span>
              <span>STANDBY</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase font-bold">LAYOUT TEMPLATE / 支持多语言路径</span>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1 text-slate-300 font-mono">
                  <span className="text-emerald-400">✓</span>
                  <span>可识别路径 1: ./public/临海/{item.title}.png</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300 font-mono">
                  <span className="text-emerald-400">✓</span>
                  <span>可识别路径 2: ./public/linhai/{item.id.replace('-', '_')}.png</span>
                </div>
              </div>
            </div>

            <div className="border border-indigo-500/25 bg-indigo-550/5 p-3 rounded-lg text-xs leading-relaxed text-indigo-300 mt-3 flex gap-2">
              <Layers className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-200">系统已搭建无缝对齐通道</span>
                左侧的列表名称、核心指标和交互动作现已全部就绪。只要您往该路径添加切图并刷新，作品集即可立刻投入使用。
              </div>
            </div>
          </div>

        </div>

        {/* Footer info banner */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-slate-500 mt-6 pt-4 border-t border-slate-800 font-mono gap-2 shrink-0">
          <span>PORTFOLIO AUTOMATION SYSTEM · LAIWEILAI TECH</span>
          <span>SYSTEM READY FOR CONTENT INSERTION</span>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        {/* Backdrop scale click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 cursor-zoom-out"
        />

        {/* Main Dialog Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh] lg:h-[720px] overflow-hidden z-10"
        >
          {/* Left panel: Selected Image Details & List Sidebar */}
          <div className="w-full lg:w-[350px] bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col h-[260px] lg:h-full shrink-0">
            {/* Header / Brand */}
            <div className="p-5 border-b border-slate-800 shrink-0 bg-slate-950/90">
              <span className="text-[10px] font-mono tracking-widest text-[#06b6d4] block uppercase font-bold mb-1">
                来未来科技有限公司
              </span>
              <h3 className="text-base font-extrabold text-white font-sans flex items-center gap-1.5">
                临海智慧医疗监管平台
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                临海市多机构医共体全域数据监控系列设计作品集。
              </p>
            </div>

            {/* Desktop List / Tabs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wide block mb-3 pl-1">
                选择浏览模块 (共 {LINHAI_IMAGES.length} 项)
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {LINHAI_IMAGES.map((item, index) => {
                  const isSelected = index === activeIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveIndex(index)}
                      className={`w-full text-left p-3 rounded-xl transition duration-250 cursor-pointer text-xs flex gap-2.5 items-start border ${
                        isSelected 
                          ? "bg-[#06b6d4]/10 text-white border-[#06b6d4]/30 shadow-sm" 
                          : "bg-slate-900/30 text-slate-400 border-slate-800/20 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors ${isSelected ? 'bg-[#06b6d4] animate-pulse' : 'bg-slate-600'}`}></span>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <span className="font-bold font-sans block truncate text-[12px]">{item.title}</span>
                        <span className="text-[10px] text-slate-500 truncate block font-sans">{item.subtitle}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Footer inside left panel */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950 sticky bottom-0 text-[10px] text-slate-500 font-sans font-medium flex items-center justify-between shrink-0 select-none">
              <span>设计工具: Sketch / AI标注</span>
              <span className="text-[#06b6d4] bg-[#06b6d4]/5 px-1.5 py-0.5 rounded border border-[#06b6d4]/15">B端大屏</span>
            </div>
          </div>

          {/* Right panel: Grand Lightbox Visualization Display */}
          <div className="flex-1 bg-slate-900/40 flex flex-col h-[calc(100%-260px)] lg:h-full relative overflow-hidden">
            
            {/* Upper Right Action buttons (Close, navigation overlay) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full cursor-pointer transition duration-150 border border-slate-800 bg-slate-950/90 shadow-md backdrop-blur-sm"
                title="关闭作品集"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Media Container */}
            <div className="flex-1 bg-[#040810] relative flex items-center justify-center p-4 md:p-6 min-h-0">
              
              {/* Carousel navigation arrow - Left */}
              <button
                onClick={handlePrev}
                className="absolute left-4 z-20 p-2.5 text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 rounded-full transition-all cursor-pointer shadow-lg active:scale-95"
                title="上一页"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Carousel navigation arrow - Right */}
              <button
                onClick={handleNext}
                className="absolute right-4 z-20 p-2.5 text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 rounded-full transition-all cursor-pointer shadow-lg active:scale-95"
                title="下一页"
              >
                <ChevronRight className="w-5 h-5 animate-pulse" />
              </button>

              {/* Image element or friendly instruction guide */}
              <div className="w-full h-full max-w-4xl max-h-[90%] relative flex items-center justify-center rounded-xl overflow-hidden shadow-2xl">
                {imageErrored[currentItem.id] ? (
                  renderSyncGuide(currentItem)
                ) : (
                  <div className="relative max-w-full max-h-full flex items-center justify-center">
                    <img 
                      src={currentImageUrl}
                      alt={currentItem.title}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain pointer-events-none rounded-lg select-none"
                      onError={handleImgLoadError}
                    />
                    
                    {/* Floating load path banner */}
                    <div className="absolute bottom-4 left-4 z-10 bg-slate-950/95 border border-slate-800/90 rounded-lg px-3.5 py-1.5 text-[10px] font-mono text-slate-400 flex items-center gap-2 select-none shadow-xl backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>ACTIVE PATH: public{currentImageUrl}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Context Details bar under container */}
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/90 flex flex-col md:flex-row justify-between gap-4 shrink-0 bg-slate-950">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-sans uppercase bg-gradient-to-r ${currentItem.color} text-white shadow-3xs`}>
                    界面 0{activeIndex + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white font-sans truncate">{currentItem.title}</h4>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{currentItem.subtitle}</p>
              </div>

              {/* Specifications / Technologies */}
              <div className="flex flex-wrap items-center gap-1.5 select-none self-start md:self-center shrink-0">
                {currentItem.techs.map((t) => (
                  <span 
                    key={t}
                    className="px-2.5 py-1 text-[10px] font-bold font-sans text-sky-400 bg-sky-950/50 border border-sky-800/30 rounded-lg"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
