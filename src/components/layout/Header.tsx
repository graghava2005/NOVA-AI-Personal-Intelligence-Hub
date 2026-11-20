import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  CheckCircle2,
  FileText,
  BookOpen,
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenQuickAction?: (action: 'task' | 'note' | 'doc' | 'chat') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const { userSettings, activities, productivityScore } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Dynamic time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Current formatted date
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/vault?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#090D1A]/85 backdrop-blur-md border-b border-[#1F2942] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Greeting & Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#151D32] lg:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                {userSettings.displayName}
              </span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Focus Mode
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-medium hidden sm:block">
            {currentDate} • Productivity Score: <span className="text-[#22D3EE] font-bold">{productivityScore}%</span>
          </p>
        </div>
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block" role="search">
          <input
            type="text"
            placeholder="Search notes, tasks, or docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Global search across notes, tasks, and documents"
            className="w-56 lg:w-72 pl-9 pr-4 py-2 rounded-xl bg-[#151D32] border border-[#1F2942] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
        </form>

        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2.5 rounded-xl text-[#94A3B8] hover:text-white bg-[#151D32] border border-[#1F2942] md:hidden focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          aria-label="Toggle search input"
          aria-expanded={isSearchOpen}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Ask NOVA shortcut */}
        <Link
          to="/assistant"
          aria-label="Ask NOVA AI Assistant"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs font-semibold hover:opacity-95 shadow-glow-purple transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Ask NOVA</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-[#94A3B8] hover:text-white bg-[#151D32] border border-[#1F2942] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            aria-label="System notifications and recent activity"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4" />
            {activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
                aria-hidden="true"
              />
              <div
                role="region"
                aria-label="Notifications history panel"
                className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#151D32] border border-[#1F2942] shadow-2xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1F2942]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#8B5CF6]" />
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                      Recent Activity
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">
                    {activities.length} updates
                  </span>
                </div>

                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {activities.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#94A3B8]">
                      No recent activities recorded.
                    </div>
                  ) : (
                    activities.slice(0, 5).map(act => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-[#101629]/70 border border-[#1F2942]/60 hover:border-[#8B5CF6]/40 transition-colors flex items-start gap-3"
                      >
                        <div className="p-2 rounded-lg bg-[#151D32] text-[#22D3EE] mt-0.5">
                          {act.type === 'task' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : act.type === 'document' ? (
                            <FileText className="w-3.5 h-3.5 text-[#22D3EE]" />
                          ) : act.type === 'note' ? (
                            <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] truncate">
                            {act.description}
                          </p>
                          <span className="text-[10px] text-[#64748B] mt-0.5 block">
                            {act.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-[#1F2942] flex justify-between items-center text-[11px]">
                  <Link
                    to="/analytics"
                    onClick={() => setShowNotifications(false)}
                    className="text-[#8B5CF6] hover:text-[#22D3EE] font-semibold flex items-center gap-1"
                  >
                    View Full Analytics
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#94A3B8] hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar */}
        <Link
          to="/settings"
          aria-label="Open user profile settings"
          className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-xl bg-[#151D32] border border-[#1F2942] hover:border-[#8B5CF6]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {userSettings.displayName.charAt(0)}
          </div>
          <span className="text-xs font-semibold text-white hidden md:inline">
            {userSettings.displayName.split(' ')[0]}
          </span>
        </Link>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-20 left-0 right-0 p-4 bg-[#101629] border-b border-[#1F2942] z-40 md:hidden animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="flex gap-2" role="search">
            <input
              type="text"
              placeholder="Search notes, tasks, or docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Mobile search query"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#151D32] border border-[#1F2942] text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2.5 rounded-xl text-[#94A3B8] bg-[#151D32] border border-[#1F2942]"
              aria-label="Close mobile search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
