import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ClipboardList,
  FileText,
  Flame,
  GitBranch,
  Search,
  Target,
  TrendingUp,
  Zap,
  Clock,
  ExternalLink,
} from 'lucide-react';

import TaskDetailPanel from './components/TaskDetailPanel';
import {
  TASKS,
  TASK_TYPES,
  OVERVIEW_STATS,
  RESOURCES,
  DEADLINES,
  TODAY_PIPELINE,
  INSIGHTS,
  WEEKLY_PRODUCTIVITY,
  COMPLETION_TREND,
  INTERVIEW_PREP,
  SPRINT_EXECUTION,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from './tasksData';

const chartTooltip = {
  contentStyle: { fontSize: '11px', borderRadius: 4, border: '1px solid #E5E7EB' },
};

const SectionHeader = ({ icon: Icon, title, badge, action }) => (
  <div className="flex items-center justify-between gap-2 mb-3">
    <div className="flex items-center gap-2 min-w-0">
      {Icon && <Icon size={14} className="text-brand-orange shrink-0" />}
      <h2 className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider truncate">{title}</h2>
      {badge != null && (
        <span className="text-[9px] font-black bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded shrink-0">
          {badge}
        </span>
      )}
    </div>
    {action}
  </div>
);

const TasksContent = ({ isLoading }) => {
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = useMemo(() => {
    let list = [...TASKS];
    if (typeFilter !== 'All') {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.module.toLowerCase().includes(q) ||
          t.assignedBy.toLowerCase().includes(q)
      );
    }
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    list.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    return list;
  }, [typeFilter, statusFilter, search]);

  const completionPct = Math.round(
    (TASKS.filter((t) => t.status === 'completed' || t.status === 'submitted').length / TASKS.length) * 100
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-16 bg-gray-200 rounded-md" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* §1 — Command Header */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="lg:col-span-2 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">Academic Execution Workspace</p>
            <h1 className="text-lg font-black text-brand-charcoal mt-0.5">Task Operations Center</h1>
            <p className="text-xs text-brand-gray mt-1 font-medium">
              React & State Management · Week 8 · Sprint 4
            </p>
          </div>
          <div className="lg:col-span-3 p-4 bg-brand-light/50 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Completion</span>
              <p className="text-lg font-black text-brand-charcoal">{completionPct}%</p>
              <div className="h-1 bg-gray-200 rounded-sm mt-1 overflow-hidden">
                <div className="h-full bg-brand-orange rounded-sm" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Productivity</span>
              <p className="text-lg font-black text-brand-charcoal">{OVERVIEW_STATS.productivityScore}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Streak</span>
              <p className="text-lg font-black text-brand-charcoal flex items-center gap-1">
                <Flame size={14} className="text-brand-orange" />
                12d
              </p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Alerts</span>
              <p className="text-lg font-black text-red-600 flex items-center gap-1">
                <AlertTriangle size={14} />
                {OVERVIEW_STATS.overdue}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* §2 — Productivity Overview */}
      <section>
        <SectionHeader icon={BarChart3} title="Student Productivity Overview" />
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-2">
          {[
            { label: 'Active Tasks', value: OVERVIEW_STATS.active },
            { label: 'Overdue', value: OVERVIEW_STATS.overdue, alert: true },
            { label: 'Done This Week', value: OVERVIEW_STATS.completedWeek },
            { label: 'Productivity', value: OVERVIEW_STATS.productivityScore },
            { label: 'Sprint %', value: `${OVERVIEW_STATS.sprintCompletion}%` },
            { label: 'Interview Prep', value: `${OVERVIEW_STATS.interviewPrep}%` },
            { label: 'Submission Acc.', value: `${OVERVIEW_STATS.submissionAccuracy}%` },
            { label: 'Consistency', value: `${OVERVIEW_STATS.consistency}%` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white border rounded-md p-2.5 shadow-sm ${
                stat.alert ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              <span className="text-[9px] font-bold text-brand-gray uppercase leading-tight block">{stat.label}</span>
              <span className={`text-lg font-black tabular-nums ${stat.alert ? 'text-red-600' : 'text-brand-charcoal'}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main grid: workspace + sidebar panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* §3 — Task Workspace */}
        <section className="xl:col-span-2 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={ClipboardList} title="Task Execution Workspace" badge={filteredTasks.length} />
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-gray" />
              <input
                type="search"
                placeholder="Search tasks, modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-orange"
                aria-label="Search tasks"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-2 bg-white"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="overdue">Overdue</option>
              <option value="submitted">Submitted</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {TASK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-colors ${
                  typeFilter === type
                    ? 'bg-brand-charcoal text-white border-brand-charcoal'
                    : 'bg-white text-brand-gray border-gray-200 hover:border-brand-orange/40'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-brand-gray text-center py-8">No tasks match your filters.</p>
            ) : (
              filteredTasks.map((task, i) => (
                <motion.button
                  key={task.id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedTask(task)}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:border-brand-orange/40 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-brand-charcoal truncate group-hover:text-brand-orange transition-colors">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-brand-gray font-medium mt-0.5">
                        {task.module} · {task.assignedBy}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${PRIORITY_STYLES[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${STATUS_STYLES[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] mb-2">
                    <span className="text-brand-gray">
                      <Calendar size={10} className="inline mr-0.5" />
                      {task.dueDate}
                    </span>
                    <span className="text-brand-gray">
                      <Clock size={10} className="inline mr-0.5" />
                      {task.estHours}h est.
                    </span>
                    <span className="text-brand-gray">Weight {task.evalWeight}%</span>
                    <span className="text-brand-gray flex items-center gap-0.5">
                      <GitBranch size={10} />
                      {task.github}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-brand-orange rounded-sm transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-brand-charcoal tabular-nums w-8">{task.progress}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[9px] font-semibold px-1 py-0.5 bg-brand-light border border-gray-100 rounded">
                      {task.type}
                    </span>
                    <span className="text-[9px] font-semibold px-1 py-0.5 bg-brand-light border border-gray-100 rounded">
                      {task.difficulty}
                    </span>
                    <span className="text-[9px] font-semibold px-1 py-0.5 bg-brand-light border border-gray-100 rounded">
                      Impact: {task.impact}
                    </span>
                    {task.attachments > 0 && (
                      <span className="text-[9px] font-semibold px-1 py-0.5 bg-brand-light border border-gray-100 rounded flex items-center gap-0.5">
                        <FileText size={9} />
                        {task.attachments}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </section>

        {/* Right column: deadlines + today + insights */}
        <div className="flex flex-col gap-4">
          {/* §7 — Upcoming Deadlines */}
          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <SectionHeader icon={Calendar} title="Upcoming Deadlines" badge={DEADLINES.length} />
            <ul className="space-y-2">
              {DEADLINES.map((d) => (
                <li
                  key={d.title}
                  className={`p-2.5 border rounded-md ${
                    d.status === 'overdue' ? 'border-red-200 bg-red-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <p className="text-xs font-bold text-brand-charcoal">{d.title}</p>
                    <span
                      className={`text-[9px] font-bold uppercase shrink-0 ${
                        d.status === 'overdue' ? 'text-red-600' : d.status === 'today' ? 'text-brand-orange' : 'text-brand-gray'
                      }`}
                    >
                      {d.due}
                    </span>
                  </div>
                  <p className="text-[10px] text-brand-gray mt-0.5">
                    {d.type} · {d.priority}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* §8 — Today's Execution Pipeline */}
          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <SectionHeader icon={Target} title="Today's Execution Pipeline" />
            <ul className="space-y-1.5">
              {TODAY_PIPELINE.map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between gap-2 p-2 rounded-md border border-gray-100 hover:bg-brand-light/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-brand-charcoal truncate">{item.title}</p>
                    <p className="text-[10px] text-brand-gray">{item.type}</p>
                  </div>
                  <span
                    className={`text-[9px] font-bold shrink-0 ${
                      item.status === 'overdue'
                        ? 'text-red-600'
                        : item.status === 'done'
                          ? 'text-emerald-600'
                          : 'text-brand-gray'
                    }`}
                  >
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* §9 — Performance Insights */}
          <section className="bg-brand-charcoal text-white border border-brand-charcoal rounded-md p-4 shadow-sm">
            <SectionHeader icon={Brain} title="Performance Insights" badge="AI" />
            <ul className="space-y-2">
              {INSIGHTS.map((insight, i) => (
                <li key={i} className="p-2 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium leading-snug flex gap-2">
                  <Zap
                    size={12}
                    className={`shrink-0 mt-0.5 ${
                      insight.type === 'positive'
                        ? 'text-emerald-400'
                        : insight.type === 'warning'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                    }`}
                  />
                  {insight.text}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* §5 — Learning Resource Hub */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={BookOpen} title="Learning Resource Hub" badge={RESOURCES.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {RESOURCES.map((res) => (
            <a
              key={res.name}
              href={res.url}
              className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-md hover:border-brand-orange/40 transition-colors group"
            >
              <div className="p-1.5 rounded-md bg-brand-light border border-gray-200 shrink-0">
                {res.type === 'GitHub' ? (
                  <GitBranch size={14} className="text-brand-charcoal" />
                ) : res.type === 'Video' ? (
                  <ExternalLink size={14} className="text-brand-orange" />
                ) : (
                  <FileText size={14} className="text-brand-orange" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-charcoal truncate group-hover:text-brand-orange transition-colors">
                  {res.name}
                </p>
                <p className="text-[10px] text-brand-gray">
                  {res.module} · {res.size}
                </p>
              </div>
              <span className="text-[9px] font-bold px-1 py-0.5 bg-brand-light border border-gray-200 rounded shrink-0">
                {res.type}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* §6 — Productivity Analytics */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={TrendingUp} title="Productivity Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Weekly Productivity</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={WEEKLY_PRODUCTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} width={20} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="completed" fill="#E8391D" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar dataKey="target" fill="#1E2126" opacity={0.2} radius={[2, 2, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Completion Trend</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={COMPLETION_TREND}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8391D" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E8391D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[65, 95]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="rate" stroke="#E8391D" fill="url(#compGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Interview Prep Progress</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={INTERVIEW_PREP} layout="vertical" margin={{ left: 4 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="area" width={72} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="progress" radius={[0, 2, 2, 0]} barSize={8}>
                  {INTERVIEW_PREP.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#E8391D' : '#1E2126'} opacity={0.4 + i * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Sprint Execution</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={SPRINT_EXECUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="sprint" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="done" stroke="#1E2126" strokeWidth={2} dot={{ r: 3, fill: '#E8391D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default TasksContent;
