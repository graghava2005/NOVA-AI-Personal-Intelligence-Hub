import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Volume2,
  Trash2,
  RotateCcw,
  Download,
  ShieldCheck,
  Check,
  Sparkles,
  AlertTriangle,
  Lock,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const {
    userSettings,
    updateUserSettings,
    resetToDefaults,
    clearAllData,
    tasks,
    notes,
    documents
  } = useApp();

  const [displayName, setDisplayName] = useState(userSettings.displayName);
  const [email, setEmail] = useState(userSettings.email);
  const [role, setRole] = useState(userSettings.role);
  const [theme, setTheme] = useState(userSettings.theme);
  const [notifications, setNotifications] = useState(userSettings.notifications);
  const [autoSummarize, setAutoSummarize] = useState(userSettings.autoSummarize);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Confirmation modals
  const [confirmModal, setConfirmModal] = useState<'reset' | 'clear' | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSettings({
      displayName,
      email,
      role,
      theme,
      notifications,
      autoSummarize,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      userSettings,
      tasks,
      notes,
      documents,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-intelligence-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-[#1F2942]">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Hub Configuration & Settings</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
            Preferences Persisted Locally
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1">
          Customize your profile, notification triggers, and client-side intelligence parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Workspace preferences saved successfully to LocalStorage!</span>
        </div>
      )}

      {/* Profile Settings Card */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1F2942]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm shadow-md">
              {displayName.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Profile & Identity</h3>
              <p className="text-xs text-[#94A3B8]">Displayed across dashboard greetings and assistant headers</p>
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 shadow-glow-purple"
          >
            Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="settings-display-name" className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">
              Display Name
            </label>
            <input
              id="settings-display-name"
              type="text"
              required
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div>
            <label htmlFor="settings-email" className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">
              Email / Handle
            </label>
            <input
              id="settings-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="settings-role" className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">
              Role & Operational Focus
            </label>
            <input
              id="settings-role"
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. AI Product Architect / Machine Learning Researcher"
              className="w-full px-4 py-2.5 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>
      </form>

      {/* Preferences & Toggles Card */}
      <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] space-y-6">
        <h3 className="text-sm font-bold text-white pb-3 border-b border-[#1F2942]">
          Workspace Preferences & Automation
        </h3>

        <div className="space-y-4">
          {/* Notification toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101629] border border-[#1F2942]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-[#8B5CF6]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">System Activity Notifications</h4>
                <p className="text-[11px] text-[#94A3B8]">
                  Receive live visual notifications for task completions, document parsing, and vault changes.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => {
                  setNotifications(e.target.checked);
                  updateUserSettings({ notifications: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1F2942] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
            </label>
          </div>

          {/* Auto Summarize toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101629] border border-[#1F2942]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-[#22D3EE]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Extractive Document Analysis</h4>
                <p className="text-[11px] text-[#94A3B8]">
                  Automatically extract key points and high-frequency terms as soon as a document is dropped.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSummarize}
                onChange={e => {
                  setAutoSummarize(e.target.checked);
                  updateUserSettings({ autoSummarize: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1F2942] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22D3EE]"></div>
            </label>
          </div>

          {/* Theme aesthetic */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#101629] border border-[#1F2942]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Futuristic Cyber Interface</h4>
                <p className="text-[11px] text-[#94A3B8]">
                  Obsidian dark base with purple glowing gradients (#090D1A, #101629, #8B5CF6, #22D3EE).
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Active SaaS Mode
            </span>
          </div>
        </div>
      </div>

      {/* Data Management & Sovereign Storage */}
      <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2942]">
          <div>
            <h3 className="text-sm font-bold text-white">Sovereign Data Management</h3>
            <p className="text-xs text-[#94A3B8]">
              Export full workspace state or reset demo benchmarks.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#101629] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
          >
            <Download className="w-4 h-4 text-[#22D3EE]" />
            <span>Export JSON Backup</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#101629] border border-[#1F2942] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#22D3EE]" />
                Reset Demo Workspace
              </h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-4">
                Restores the standard sample tasks, autonomous agent whitepapers, notes, and chat session.
              </p>
            </div>
            <button
              onClick={() => setConfirmModal('reset')}
              className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
            >
              Reset to Initial Seed
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#101629] border border-rose-500/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                Clear All Workspace Data
              </h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-4">
                Permanently wipes all tasks, uploaded documents, and vault notes from browser LocalStorage.
              </p>
            </div>
            <button
              onClick={() => setConfirmModal('clear')}
              className="w-full py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            >
              Wipe Local Storage
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#151D32] border border-[#1F2942] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {confirmModal === 'reset'
                    ? 'Confirm Workspace Reset'
                    : 'Confirm Complete Data Wipe'}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {confirmModal === 'reset'
                    ? 'This will restore default sample tasks, documents, and notes.'
                    : 'All custom tasks, uploaded PDFs, and notes will be deleted.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2942]">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal === 'reset') resetToDefaults();
                  if (confirmModal === 'clear') clearAllData();
                  setConfirmModal(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${
                  confirmModal === 'reset'
                    ? 'bg-[#8B5CF6] hover:bg-[#7C3AED]'
                    : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
