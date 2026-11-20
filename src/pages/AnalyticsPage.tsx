import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Zap,
  CheckCircle2,
  FileText,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const {
    tasks,
    documents,
    notes,
    tasksCompleted,
    totalTasks,
    documentsSaved,
    knowledgeNotes,
    productivityScore,
    taskProgressPercent
  } = useApp();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Multiplier based on timeRange
  const multiplier = timeRange === '7d' ? 1 : timeRange === '30d' ? 3.5 : 8;

  // Chart 1: Focus & Productivity Trends
  const trendData = [
    { name: 'Mon', focusHours: +(5.2 * (multiplier > 1 ? 1.1 : 1)).toFixed(1), score: 72, tasksDone: Math.round(tasksCompleted * 0.4) },
    { name: 'Tue', focusHours: +(6.1 * (multiplier > 1 ? 1.0 : 1)).toFixed(1), score: 78, tasksDone: Math.round(tasksCompleted * 0.6) },
    { name: 'Wed', focusHours: +(4.8 * (multiplier > 1 ? 0.9 : 1)).toFixed(1), score: 74, tasksDone: Math.round(tasksCompleted * 0.5) },
    { name: 'Thu', focusHours: +(7.4 * (multiplier > 1 ? 1.2 : 1)).toFixed(1), score: 86, tasksDone: Math.round(tasksCompleted * 0.8) },
    { name: 'Fri', focusHours: +(6.5 * (multiplier > 1 ? 1.1 : 1)).toFixed(1), score: productivityScore, tasksDone: tasksCompleted },
    { name: 'Sat', focusHours: +(3.8 * (multiplier > 1 ? 0.8 : 1)).toFixed(1), score: Math.round(productivityScore * 0.88), tasksDone: Math.round(tasksCompleted * 0.7) },
    { name: 'Sun', focusHours: +(4.5 * (multiplier > 1 ? 0.9 : 1)).toFixed(1), score: productivityScore, tasksDone: tasksCompleted },
  ];

  // Chart 2: Task Distribution by Priority
  const highCount = tasks.filter(t => t.priority === 'High').length;
  const medCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowCount = tasks.filter(t => t.priority === 'Low').length;

  const priorityData = [
    { name: 'High Priority (Q1)', count: highCount, color: '#F59E0B' },
    { name: 'Medium Priority (Q2)', count: medCount, color: '#8B5CF6' },
    { name: 'Low Priority (Q3/Q4)', count: lowCount, color: '#22D3EE' },
  ];

  // Chart 3: Category breakdown
  const categoryMap: Record<string, number> = {};
  tasks.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
  }));

  if (categoryData.length === 0) {
    categoryData.push({ name: 'Architecture', count: 3 }, { name: 'Research', count: 2 });
  }

  // Activity breakdown
  const activityDomainData = [
    { domain: 'Deep Engineering', hours: 14.5, output: 88 },
    { domain: 'Document Synthesis', hours: 8.2, output: 76 },
    { domain: 'Vault Organization', hours: 5.4, output: 92 },
    { domain: 'Strategic Planning', hours: 6.8, output: 84 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2942]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Productivity & Cognitive Analytics</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
              Live Engine Telemetry
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time analytics evaluating task resolution rate, cognitive focus blocks, and knowledge acquisition velocity.
          </p>
        </div>

        {/* Time range toggle */}
        <div className="p-1 rounded-xl bg-[#151D32] border border-[#1F2942] flex items-center text-xs">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              timeRange === '7d'
                ? 'bg-[#8B5CF6] text-white shadow-glow-purple'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              timeRange === '30d'
                ? 'bg-[#8B5CF6] text-white shadow-glow-purple'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
              timeRange === 'all'
                ? 'bg-[#8B5CF6] text-white shadow-glow-purple'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Productivity Rating
            </span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {productivityScore}%
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            Based on active tasks, docs parsed, and vault density.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Completion Velocity
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#22D3EE]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {taskProgressPercent}%
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            {tasksCompleted} resolved out of {totalTasks} tracked targets.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Document Synthesis
            </span>
            <FileText className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {documentsSaved} Files
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            Extractive intelligence models active locally.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Vault Knowledge Density
            </span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {knowledgeNotes} Notes
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            Structured second-brain assets indexed.
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                Cognitive Focus vs. Productivity Trend
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Correlation between uninterrupted focus blocks and output velocity.
              </p>
            </div>
            <span className="text-xs font-bold text-[#22D3EE] bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Avg 5.8h / day
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="focusColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101629',
                    borderColor: '#1F2942',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Productivity Rating"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreColor)"
                />
                <Area
                  type="monotone"
                  dataKey="focusHours"
                  name="Focus Hours"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#focusColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Donut Chart (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#151D32] border border-[#1F2942] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-amber-400" />
              Eisenhower Task Distribution
            </h3>
            <p className="text-xs text-[#94A3B8] mb-4">
              Breakdown of tracked milestones by priority weight.
            </p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#101629',
                      borderColor: '#1F2942',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#1F2942]">
            {priorityData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#94A3B8]">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Domain Activity Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#151D32] border border-[#1F2942]">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#22D3EE]" />
            Deep Work Output by Domain
          </h3>
          <p className="text-xs text-[#94A3B8] mb-6">
            Allocated weekly hours across core operational sectors.
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityDomainData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="domain" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101629',
                    borderColor: '#1F2942',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" name="Invested Hours" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cognitive Insights Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#151D32] via-[#1A2340] to-[#151D32] border border-[#1F2942] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">
                NOVA Intelligence Recommendations
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">
              Based on your local telemetry, here is an executive synthesis of your workflow:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#101629] border border-[#1F2942]">
                <h4 className="text-xs font-bold text-[#22D3EE] mb-1">
                  1. Quadrant 2 Calibration
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  You have {highCount} High-Priority tasks. Ensure you reserve uninterrupted 90-minute morning focus blocks before addressing lower priority communications.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#101629] border border-[#1F2942]">
                <h4 className="text-xs font-bold text-[#8B5CF6] mb-1">
                  2. Document Retention & Synthesis
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  You have indexed {documentsSaved} documents. Use the "Save to Vault" action on extracted summaries to keep critical findings readily searchable in your Second Brain.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1F2942] flex items-center justify-between text-xs text-[#64748B]">
            <span>Deterministic NLP Analysis</span>
            <span className="text-emerald-400 font-semibold">100% Client-Side Computation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
