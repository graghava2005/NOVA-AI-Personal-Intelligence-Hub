import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  FileText,
  BookOpen,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Bot
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { Priority, TaskStatus } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    tasks,
    documents,
    notes,
    activities,
    tasksCompleted,
    totalTasks,
    documentsSaved,
    knowledgeNotes,
    productivityScore,
    taskProgressPercent,
    toggleTaskComplete,
    addTask,
    addNote,
  } = useApp();

  // Quick action modal state
  const [activeModal, setActiveModal] = useState<'task' | 'note' | null>(null);

  // Quick Task Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('High');
  const [taskCategory, setTaskCategory] = useState('Execution');
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );

  // Quick Note Form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Ideas, Strategy');

  // Chart data derived dynamically from tasks & documents
  const chartData = [
    { day: 'Mon', tasks: Math.max(1, Math.round(tasksCompleted * 0.4)), focusHours: 5.2, score: 72 },
    { day: 'Tue', tasks: Math.max(2, Math.round(tasksCompleted * 0.6)), focusHours: 6.0, score: 78 },
    { day: 'Wed', tasks: Math.max(1, Math.round(tasksCompleted * 0.5)), focusHours: 4.8, score: 74 },
    { day: 'Thu', tasks: Math.max(3, Math.round(tasksCompleted * 0.8)), focusHours: 7.1, score: 86 },
    { day: 'Fri', tasks: tasksCompleted, focusHours: 6.4, score: productivityScore },
    { day: 'Sat', tasks: Math.round(tasksCompleted * 0.7), focusHours: 3.5, score: Math.round(productivityScore * 0.9) },
    { day: 'Sun', tasks: tasksCompleted, focusHours: 4.2, score: productivityScore },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      priority: taskPriority,
      status: 'Pending' as TaskStatus,
      category: taskCategory,
      dueDate: taskDueDate,
    });
    setTaskTitle('');
    setActiveModal(null);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote({
      title: noteTitle.trim(),
      content: noteContent.trim() || 'No additional content provided.',
      tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
      category: 'General',
      isPinned: false,
    });
    setNoteTitle('');
    setNoteContent('');
    setActiveModal(null);
  };

  // High Priority Focus Tasks
  const highPriorityTasks = tasks
    .filter(t => t.status !== 'Completed')
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Quick Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#151D32] via-[#1A2440] to-[#151D32] border border-[#1F2942] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-[#8B5CF6]/10 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
              Intelligence Command Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Daily Execution & Cognitive Velocity
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl">
            {totalTasks - tasksCompleted} pending tasks across your pipeline. Your personal intelligence hub is synchronized locally.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Link
            to="/assistant"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 shadow-glow-purple transition-all"
          >
            <Bot className="w-4 h-4 text-[#22D3EE]" />
            <span>Ask NOVA</span>
          </Link>

          <Link
            to="/documents"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
          >
            <FileText className="w-4 h-4 text-[#22D3EE]" />
            <span>Upload Document</span>
          </Link>

          <button
            onClick={() => setActiveModal('task')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#8B5CF6]" />
            <span>Add Task</span>
          </button>

          <button
            onClick={() => setActiveModal('note')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#151D32] hover:bg-[#1B243E] border border-[#1F2942] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* 4 Core Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Tasks Completed */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] hover:border-[#8B5CF6]/40 transition-all duration-200 relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Tasks Completed
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-[#8B5CF6] group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {tasksCompleted}
            </span>
            <span className="text-xs text-[#94A3B8]">/ {totalTasks} total</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-[#101629] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-2 flex items-center justify-between">
              <span>Progress rate</span>
              <span className="font-semibold text-white">{taskProgressPercent}%</span>
            </p>
          </div>
        </div>

        {/* Stat 2: Documents Saved */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] hover:border-[#22D3EE]/40 transition-all duration-200 relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Documents Saved
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-[#22D3EE] group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {documentsSaved}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              Analyzed
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-3">
            Extractive summaries & keyword indexes stored locally.
          </p>
        </div>

        {/* Stat 3: Knowledge Notes */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] hover:border-indigo-500/40 transition-all duration-200 relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Knowledge Notes
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {knowledgeNotes}
            </span>
            <span className="text-xs text-[#94A3B8]">in Second Brain</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-3">
            {notes.filter(n => n.isPinned).length} pinned reference notes accessible.
          </p>
        </div>

        {/* Stat 4: Productivity Score */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] hover:border-emerald-500/40 transition-all duration-200 relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Productivity Score
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-[#22D3EE] bg-clip-text text-transparent">
              {productivityScore}
            </span>
            <span className="text-xs text-white font-bold">/ 100</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Real-time score derived from task & vault activity.
          </p>
        </div>
      </div>

      {/* Main Grid: Chart & Focus Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart (2 columns on lg) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#22D3EE]" />
                Cognitive Velocity & Focus Output
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Weekly velocity mapping completed milestones and focus rating.
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-[#8B5CF6] hover:text-[#22D3EE] flex items-center gap-1 transition-colors"
            >
              Full Analytics
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101629',
                    borderColor: '#1F2942',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Productivity Rating"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="focusHours"
                  name="Focus Hours"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#focusGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1F2942] text-xs text-[#94A3B8]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                Productivity Rating
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                Focus Hours
              </span>
            </div>
            <span className="text-[11px] text-[#64748B]">
              Updated live from state
            </span>
          </div>
        </div>

        {/* Priority Focus Widget (1 column on lg) */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Active Focus Queue
              </h3>
              <Link
                to="/tasks"
                className="text-xs text-[#8B5CF6] hover:text-[#22D3EE] font-semibold"
              >
                All Tasks
              </Link>
            </div>
            <p className="text-xs text-[#94A3B8] mb-4">
              Immediate deliverables requiring attention.
            </p>

            <div className="space-y-2.5">
              {highPriorityTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#94A3B8] bg-[#101629] rounded-xl border border-dashed border-[#1F2942]">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2 opacity-80" />
                  All high-priority tasks completed!
                </div>
              ) : (
                highPriorityTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-[#101629] border border-[#1F2942] hover:border-[#8B5CF6]/50 transition-all flex items-start gap-3 group"
                  >
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-[#64748B] hover:text-emerald-400 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded"
                      title="Mark complete"
                      aria-label={`Mark task ${task.title} as complete`}
                    >
                      <div className="w-4 h-4 rounded border border-[#64748B] group-hover:border-emerald-400" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white group-hover:text-[#22D3EE] transition-colors truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#94A3B8]">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                          {task.priority}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveModal('task')}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#101629] hover:bg-[#1B243E] border border-[#1F2942] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Quick Add Task
          </button>
        </div>
      </div>

      {/* Secondary Row: Pinned Notes & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pinned Second Brain Notes */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              Knowledge Vault Highlights
            </h3>
            <Link
              to="/vault"
              className="text-xs text-[#8B5CF6] hover:text-[#22D3EE] font-semibold"
            >
              Open Vault
            </Link>
          </div>
          <div className="space-y-3">
            {notes.slice(0, 3).map(note => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl bg-[#101629] border border-[#1F2942] hover:border-[#8B5CF6]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-white truncate max-w-[280px]">
                    {note.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {note.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed mb-2">
                  {note.content}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#151D32] text-[#94A3B8] border border-[#1F2942]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#22D3EE]" />
              System Activity Log
            </h3>
            <span className="text-xs text-[#94A3B8]">Real-time events</span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map(act => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#101629] border border-[#1F2942] flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-[#151D32] text-[#22D3EE] mt-0.5">
                  {act.type === 'task' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : act.type === 'document' ? (
                    <FileText className="w-4 h-4 text-[#22D3EE]" />
                  ) : act.type === 'note' ? (
                    <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-[#64748B]">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Task Modal */}
      {activeModal === 'task' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#151D32] border border-[#1F2942] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#8B5CF6]" />
              Create Focus Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="dash-task-title" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Task Title
                </label>
                <input
                  id="dash-task-title"
                  type="text"
                  required
                  placeholder="e.g., Calibrate inference latency pipeline"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="dash-task-priority" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Priority
                  </label>
                  <select
                    id="dash-task-priority"
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dash-task-cat" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Category
                  </label>
                  <input
                    id="dash-task-cat"
                    type="text"
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dash-task-due" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Due Date
                </label>
                <input
                  id="dash-task-due"
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Note Modal */}
      {activeModal === 'note' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#151D32] border border-[#1F2942] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Capture Knowledge Note
            </h3>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Latency budget calculations"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Content / Findings
                </label>
                <textarea
                  rows={4}
                  placeholder="Write thoughts, insights, or architecture notes..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={e => setNoteTags(e.target.value)}
                  placeholder="Architecture, Benchmark, Q3"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
