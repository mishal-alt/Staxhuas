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
import { useAuth } from '../../context/AuthContext';
import { getModules } from '../../api/courses.api';
import {
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

const TasksContent = ({ isLoading: propIsLoading }) => {
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksList, setTasksList] = useState([]);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);

  React.useEffect(() => {
    const fetchRealTasks = async () => {
      const courseId = user?.batch?.course?._id;
      if (!courseId) return;

      setIsFetchingTasks(true);
      try {
        const response = await getModules(courseId);
        const modulesData = response.data;
        const mapped = [];

        modulesData.forEach((mod) => {
          if (mod.tasks && Array.isArray(mod.tasks)) {
            mod.tasks.forEach((task) => {
              mapped.push({
                id: task._id,
                title: task.title,
                description: task.description,
                type: task.type === 'technical' ? 'Technical' : 'Collaboration',
                module: mod.name,
                assignedBy: 'Facilitator John',
                priority: task.type === 'technical' ? 'high' : 'medium',
                status: 'pending',
                difficulty: 'Intermediate',
                dueDate: `2026-06-${10 + (task.week || 1) * 3}`,
                estHours: 6,
                evalWeight: 10,
                impact: 'Medium',
                progress: 0,
                github: task.type === 'technical' ? 'pending' : 'n/a',
                githubLink: '',
                outcomes: ['Master the module topic', 'Practical implementation'],
                instructions: 'Submit via GitHub PR/repository link.',
                rubric: 'Functionality 50%, Code Quality 30%, Documentation 20%',
                resources: ['handbook.pdf', 'starter-repo'],
                submissions: [],
                comments: [],
              });
            });
          }
        });
        setTasksList(mapped);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsFetchingTasks(false);
      }
    };

    fetchRealTasks();
  }, [user]);

  const filteredTasks = useMemo(() => {
    let list = [...tasksList];
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
  }, [typeFilter, statusFilter, search, tasksList]);

  const completionPct = Math.round(
    (tasksList.filter((t) => t.status === 'completed' || t.status === 'submitted').length / (tasksList.length || 1)) * 100
  );

  const isLoading = propIsLoading || isFetchingTasks;

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
              MERN Full Stack Development · React & State Management · Week 8 · Sprint 4
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

      {/* Main workspace grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left column — Task Workspace */}
        <div className="xl:col-span-2">
          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm h-full">
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
                className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-2 bg-white cursor-pointer"
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
                  className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-colors cursor-pointer ${
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
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:border-brand-orange/40 hover:shadow-sm transition-all group cursor-pointer"
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
        </div>

        {/* Right column — Side Widgets */}
        <div className="flex flex-col gap-4">
          {/* §7 — Upcoming Deadlines */}
          <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <SectionHeader icon={Calendar} title="Upcoming Deadlines" badge={DEADLINES.length} />
            <ul className="space-y-1.5">
              {DEADLINES.map((dl) => (
                <li
                  key={dl.title}
                  className="flex items-center justify-between gap-2 p-2 rounded-md border border-gray-100 hover:bg-brand-light/60 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-brand-charcoal truncate">{dl.title}</p>
                    <p className="text-[10px] text-brand-gray">{dl.type}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-bold text-brand-gray">{dl.due}</span>
                    <span className={`text-[8px] font-black px-1 py-0.5 rounded uppercase ${PRIORITY_STYLES[dl.priority]}`}>
                      {dl.priority}
                    </span>
                  </div>
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
      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default TasksContent;
