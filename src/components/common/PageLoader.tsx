import React from 'react';
import { Sparkles } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4 animate-in fade-in duration-200">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#6D28D9] to-[#22D3EE] flex items-center justify-center text-white shadow-glow-purple animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-[#22D3EE] animate-ping opacity-25" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-white tracking-wide">NOVA Intelligence</p>
        <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Initializing module...</p>
      </div>
    </div>
  );
};
