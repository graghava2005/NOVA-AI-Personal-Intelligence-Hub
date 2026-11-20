import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  FileText,
  BookOpen,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { tasks, documents, notes, userSettings } = useApp();

  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;

  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/assistant',
      label: 'AI Assistant',
      icon: Bot,
      badge: 'Local AI',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      to: '/documents',
      label: 'Documents',
      icon: FileText,
      badge: documents.length > 0 ? documents.length : null,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      to: '/vault',
      label: 'Knowledge Vault',
      icon: BookOpen,
      badge: notes.length > 0 ? notes.length : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      to: '/tasks',
      label: 'Task Planner',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#101629] border-r border-[#1F2942] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#1F2942]">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#22D3EE] shadow-glow-purple group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-[#22D3EE] bg-clip-text text-transparent">
                  NOVA
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  HUB
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#94A3B8] tracking-tight">
                Personal Intelligence
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151D32] lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Status Pill */}
        <div className="px-5 py-3">
          <div className="px-3 py-2 rounded-xl bg-[#151D32]/90 border border-[#1F2942] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]"></span>
              </span>
              <span className="text-[11px] font-medium text-[#94A3B8]">
                Local Engine Active
              </span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#22D3EE]/10 text-white border border-[#8B5CF6]/50 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151D32]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-[#22D3EE]'
                            : 'text-[#94A3B8] group-hover:text-white'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== null && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#22D3EE]" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Assistant CTA card */}
        <div className="p-4 mx-4 mb-3 rounded-2xl bg-gradient-to-br from-[#151D32] to-[#1a233d] border border-[#1F2942] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-4 h-4 text-[#22D3EE]" />
            <h4 className="text-xs font-semibold text-white">Instant Co-Pilot</h4>
          </div>
          <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-3">
            Ask NOVA to plan sprints, summarize notes, or evaluate tasks.
          </p>
          <NavLink
            to="/assistant"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-glow-purple transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            Launch Assistant
          </NavLink>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-4 border-t border-[#1F2942] flex items-center justify-between bg-[#0e1324]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm shadow-md">
                {userSettings.displayName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#101629] rounded-full" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {userSettings.displayName}
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate">
                {userSettings.role}
              </p>
            </div>
          </div>
          <NavLink
            to="/settings"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#151D32] transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>
        </div>
      </aside>
    </>
  );
};
