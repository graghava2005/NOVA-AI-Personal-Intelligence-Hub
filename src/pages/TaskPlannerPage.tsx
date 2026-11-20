import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
  Filter,
  CheckCircle2,
  Search,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, Priority, TaskStatus } from '../types';

export const TaskPlannerPage: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    tasksCompleted,
    totalTasks,
    taskProgressPercent
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick inline add
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('High');
  const [quickDueDate, setQuickDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );

  // Edit modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('Medium');
  const [editStatus, setEditStatus] = useState<TaskStatus>('Pending');
  const [editDueDate, setEditDueDate] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      priority: quickPriority,
      status: 'Pending',
      dueDate: quickDueDate,
      category: 'Focus',
    });
    setQuickTitle('');
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditDueDate(task.dueDate);
    setEditCategory(task.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;
    updateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      status: editStatus,
      dueDate: editDueDate,
      category: editCategory,
    });
    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Pending'
        ? task.status === 'Pending'
        : statusFilter === 'In Progress'
        ? task.status === 'In Progress'
        : task.status === 'Completed';

    const matchesPriority =
      priorityFilter === 'All' ? true : task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2942]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Task Planner</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
              Eisenhower Engine
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Track execution velocity, prioritize Q1/Q2 imperatives, and hit sprint milestones.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-[#151D32] border border-[#1F2942] flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-white">
              {tasksCompleted} of {totalTasks} Completed
            </div>
            <div className="text-[10px] text-[#94A3B8]">
              {taskProgressPercent}% Completion Velocity
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#101629] border border-[#1F2942] flex items-center justify-center text-xs font-extrabold text-[#22D3EE]">
            {taskProgressPercent}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-2xl bg-[#151D32] border border-[#1F2942]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
            Sprint Velocity Progress
          </span>
          <span className="text-[#94A3B8]">{tasksCompleted}/{totalTasks} targets checked</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#101629] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#22D3EE] rounded-full transition-all duration-500"
            style={{ width: `${taskProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Inline Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="p-3 rounded-2xl bg-[#151D32] border border-[#1F2942] flex flex-col sm:flex-row items-center gap-3 shadow-md"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            required
            placeholder="Add new task (e.g. Conduct ablation study on tokenizer)..."
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
          />
          <Plus className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={quickPriority}
            onChange={e => setQuickPriority(e.target.value as Priority)}
            className="px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <input
            type="date"
            value={quickDueDate}
            onChange={e => setQuickDueDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90 shadow-glow-purple shrink-0"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['All', 'Pending', 'In Progress', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                statusFilter === tab
                  ? 'bg-[#8B5CF6] text-white shadow-glow-purple font-bold'
                  : 'bg-[#151D32] text-[#94A3B8] hover:text-white border border-[#1F2942]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Priority Filter & Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#151D32] border border-[#1F2942] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] w-40 sm:w-48"
            />
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2" />
          </div>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#151D32] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[#151D32] border border-dashed border-[#1F2942] p-8">
            <CheckSquare className="w-12 h-12 text-[#64748B] mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white mb-1">No Tasks Match Criteria</h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Try switching your status filter or create a new task using the quick add bar above.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDone = task.status === 'Completed';
            const isHigh = task.priority === 'High';
            const isMed = task.priority === 'Medium';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl bg-[#151D32] border transition-all duration-200 flex items-start sm:items-center justify-between gap-4 group hover:shadow-lg ${
                  isDone
                    ? 'border-[#1F2942]/60 opacity-60 bg-[#101629]/50'
                    : isHigh
                    ? 'border-[#1F2942] hover:border-amber-500/40'
                    : 'border-[#1F2942] hover:border-[#8B5CF6]/40'
                }`}
              >
                {/* Left: Checkbox + Title + Meta */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : 'border-[#64748B] hover:border-[#22D3EE] bg-[#101629]'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-xs sm:text-sm font-bold transition-colors ${
                          isDone
                            ? 'line-through text-[#64748B]'
                            : 'text-white group-hover:text-[#22D3EE]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#101629] text-[#94A3B8] border border-[#1F2942]">
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
                      <span className="flex items-center gap-1 text-[#94A3B8]">
                        <Calendar className="w-3 h-3 text-[#8B5CF6]" />
                        Due: {task.dueDate}
                      </span>
                      <span>•</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-semibold ${
                          isHigh
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : isMed
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span>•</span>
                      <span className="capitalize">{task.status}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-2 text-[#64748B] hover:text-white rounded-lg hover:bg-[#101629] transition-colors"
                    title="Edit Task"
                    aria-label={`Edit task ${task.title}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-[#64748B] hover:text-rose-400 rounded-lg hover:bg-[#101629] transition-colors"
                    title="Delete Task"
                    aria-label={`Delete task ${task.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#151D32] border border-[#1F2942] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1F2942]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#8B5CF6]" />
                Edit Task Details
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label htmlFor="task-edit-title" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Task Title
                </label>
                <input
                  id="task-edit-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label htmlFor="task-edit-desc" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Description / Specification
                </label>
                <textarea
                  id="task-edit-desc"
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-edit-priority" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Priority
                  </label>
                  <select
                    id="task-edit-priority"
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="task-edit-status" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Status
                  </label>
                  <select
                    id="task-edit-status"
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-edit-category" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Category
                  </label>
                  <input
                    id="task-edit-category"
                    type="text"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label htmlFor="task-edit-due-date" className="block text-xs font-semibold text-[#94A3B8] mb-1">
                    Due Date
                  </label>
                  <input
                    id="task-edit-due-date"
                    type="date"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101629] border border-[#1F2942] text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2942]">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
