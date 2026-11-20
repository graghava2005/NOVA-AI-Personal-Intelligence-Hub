import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  FileText,
  BookOpen,
  CheckSquare,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Zap,
  Layers,
  Cpu,
  Lock,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { enterWorkspace, updateUserSettings, userSettings } = useApp();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [tempName, setTempName] = useState(userSettings.displayName);
  const [selectedFocus, setSelectedFocus] = useState('AI Engineering & Architecture');

  const focusOptions = [
    { id: 'eng', title: 'AI Engineering & Architecture', desc: 'Synthesizing technical specs, task pipelines, and system benchmarks.' },
    { id: 'res', title: 'Research & Deep Learning', desc: 'Parsing research PDFs, organizing literature notes, and hypothesis tracking.' },
    { id: 'exec', title: 'Executive Strategy & Operations', desc: 'High-level planning, daily Eisenhower prioritization, and team velocity.' },
  ];

  const handleStart = () => {
    setShowOnboardingModal(true);
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateUserSettings({
        displayName: tempName.trim(),
        role: selectedFocus
      });
    }
    enterWorkspace();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#090D1A] text-[#F8FAFC] selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#8B5CF6]/15 via-[#22D3EE]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-[#1F2942]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#22D3EE] p-0.5 shadow-glow-purple flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-[#22D3EE] bg-clip-text text-transparent">
              NOVA
            </span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Personal Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              enterWorkspace();
              navigate('/');
            }}
            className="text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors hidden sm:block"
          >
            Direct Workspace Access
          </button>
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] shadow-glow-purple transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 pt-16 pb-24 flex flex-col items-center text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151D32] border border-[#1F2942] text-xs font-semibold text-[#22D3EE] mb-8 shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Category 08: AI, Machine Learning & Future Technology</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight mb-6">
          Think Smarter.{' '}
          <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#22D3EE] bg-clip-text text-transparent">
            Work Better.
          </span>{' '}
          Live Intelligently.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#94A3B8] max-w-3xl leading-relaxed mb-10">
          Fragmented tools destroy cognitive focus. NOVA unifies your daily execution: an interactive AI co-pilot, browser-side document intelligence, structured second-brain notes, and real-time productivity analytics.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#22D3EE] hover:opacity-95 shadow-glow-purple flex items-center justify-center gap-2 group transition-all"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Enter NOVA Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              enterWorkspace();
              navigate('/');
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#22D3EE]" />
            <span>Explore Demo Data</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <section aria-label="Core Capabilities" className="w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 text-center bg-gradient-to-r from-white via-slate-200 to-[#22D3EE] bg-clip-text text-transparent">
            Ambient Intelligence Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#151D32]/80 border border-[#1F2942] hover:border-[#8B5CF6]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interactive AI Assistant</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Deterministic co-pilot for planning 5-day sprints, breaking down complex engineering tasks, and brainstorming strategies without remote API dependencies.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#151D32]/80 border border-[#1F2942] hover:border-[#22D3EE]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#22D3EE] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Document Intelligence</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Upload PDF and TXT files directly in browser. Extracts text with PDF.js, generating extractive summaries, key actionable points, and keyword clouds locally.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#151D32]/80 border border-[#1F2942] hover:border-[#8B5CF6]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Knowledge Vault</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              A streamlined Second Brain for notes, technical snippets, and architectural thoughts. Full tag filtering, instant search, and pin controls.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#151D32]/80 border border-[#1F2942] hover:border-[#22D3EE]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[#22D3EE] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Task Planner</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Priority-based execution with Eisenhower categorization, due dates, progress analytics, and visual confetti rewards upon completion.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-[#151D32]/80 border border-[#1F2942] hover:border-[#8B5CF6]/50 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#8B5CF6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Productivity Analytics</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Interactive Recharts visualizations mapping completion velocity, cognitive load by category, and weekly intelligence trends.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-[#151D32]/80 border border-[#1F2942] hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">100% Client-Side Privacy</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Zero mandatory cloud servers, no API tokens to buy, and zero data leakage. All intelligence and LocalStorage persistence reside in your browser.
            </p>
          </div>
        </div>
      </section>
    </main>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#151D32] border border-[#1F2942] p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Configure Your Workspace</h3>
                <p className="text-xs text-[#94A3B8]">Personalize your NOVA intelligence profile</p>
              </div>
            </div>

            <form onSubmit={handleFinishOnboarding} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101629] border border-[#1F2942] text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
                  placeholder="e.g. Alex Mercer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">
                  Primary Intelligence Focus
                </label>
                <div className="space-y-2.5">
                  {focusOptions.map(opt => (
                    <div
                      key={opt.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedFocus === opt.title}
                      onClick={() => setSelectedFocus(opt.title)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedFocus(opt.title);
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${
                        selectedFocus === opt.title
                          ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white shadow-sm'
                          : 'bg-[#101629] border-[#1F2942] text-[#94A3B8] hover:border-[#1F2942]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{opt.title}</span>
                        {selectedFocus === opt.title && (
                          <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] shadow-glow-purple flex items-center gap-2"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
