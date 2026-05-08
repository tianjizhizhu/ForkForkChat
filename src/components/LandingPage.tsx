import React, { useState, useEffect } from 'react';
import { MessageSquare, GitBranch, ArrowLeftRight, Monitor, Smartphone, Tablet, ChevronRight, Sparkles, Anchor, Zap } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>全新对话体验</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            ForkFork
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Chat</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            像代码分支一样管理你的 AI 对话
            <br />
            <span className="text-indigo-600 font-medium">锚定 · 分支 · 同步</span>
          </p>
          
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1"
          >
            <MessageSquare className="w-5 h-5" />
            开始对话
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Feature Demo Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">核心功能</h2>
            <p className="text-lg text-slate-600">三大创新设计，重新定义 AI 对话体验</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Anchor */}
            <div className={`group p-8 bg-gradient-to-b from-indigo-50 to-white rounded-3xl border border-indigo-100 hover:shadow-xl transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Anchor className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">锚定对话</h3>
              <p className="text-slate-600 leading-relaxed">
                针对 AI 回复中的任意片段创建锚点，像 Word 批注一样精准定位讨论内容，不再迷失在长篇回复中。
              </p>
              <div className="mt-6 p-4 bg-white rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-xs font-bold">AI</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">
                      ...机器学习是一种让计算机通过数据...
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-medium">锚定此处</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Branch */}
            <div className={`group p-8 bg-gradient-to-b from-purple-50 to-white rounded-3xl border border-purple-100 hover:shadow-xl transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GitBranch className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">分支讨论</h3>
              <p className="text-slate-600 leading-relaxed">
                每个锚点都是一个独立分支，支持多轮深入讨论。分支之间相互独立，不影响主对话流程。
              </p>
              <div className="mt-6 p-4 bg-white rounded-xl border border-purple-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">主对话：继续原话题</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <GitBranch className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-slate-700">分支：深入细节讨论</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Sync */}
            <div className={`group p-8 bg-gradient-to-b from-emerald-50 to-white rounded-3xl border border-emerald-100 hover:shadow-xl transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ArrowLeftRight className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">同步合并</h3>
              <p className="text-slate-600 leading-relaxed">
                分支讨论完成后，一键同步回主对话。所有洞察和结论无缝整合，保持对话的完整性和连贯性。
              </p>
              <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    分支结论
                  </div>
                  <ArrowLeftRight className="w-5 h-5 text-emerald-500" />
                  <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                    主对话
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Section */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">全平台支持</h2>
            <p className="text-lg text-slate-600">随时随地，无缝切换设备继续对话</p>
          </div>

          <div className={`flex flex-col md:flex-row items-center justify-center gap-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
              <Monitor className="w-10 h-10 text-indigo-600" />
              <div>
                <h4 className="font-semibold text-slate-900">桌面端</h4>
                <p className="text-sm text-slate-500">三栏布局，高效操作</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
              <Tablet className="w-10 h-10 text-purple-600" />
              <div>
                <h4 className="font-semibold text-slate-900">平板端</h4>
                <p className="text-sm text-slate-500">自适应布局，触控优化</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
              <Smartphone className="w-10 h-10 text-emerald-600" />
              <div>
                <h4 className="font-semibold text-slate-900">手机端</h4>
                <p className="text-sm text-slate-500">侧边栏收起，专注对话</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="p-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-white">
            <Zap className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好体验了吗？</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              配置你的 API 密钥，立即开始使用 ForkForkChat，让 AI 对话像代码一样清晰有条理。
            </p>
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-2xl text-lg font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <MessageSquare className="w-5 h-5" />
              立即开始
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-slate-900">ForkForkChat</span>
          </div>
          <p className="text-sm text-slate-500">
            基于 React + TypeScript + Tailwind CSS 构建
          </p>
        </div>
      </footer>
    </div>
  );
};
