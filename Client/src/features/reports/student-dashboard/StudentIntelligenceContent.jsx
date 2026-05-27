import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Flame,
  GitBranch,
  GraduationCap,
  MessageSquare,
  Mic,
  Target,
  Trophy,
  TrendingUp,
  Zap,
  FileText,
  Users,
  Briefcase,
} from 'lucide-react';

import MetricCard from './MetricCard';
import SectionHeader from './SectionHeader';
import {
  METRICS,
  TODAY_OPERATIONS,
  FEEDBACK_ITEMS,
  MODULE_JOURNEY,
  TASK_RESOURCES,
  LEADERBOARD,
  PLACEMENT_PANEL,
  SMART_INSIGHTS,
  ATTENDANCE_TREND,
  INTERVIEW_SCORES,
  WEEKLY_CONSISTENCY,
  TASK_HEATMAP,
  MODULE_PROGRESS,
  getGreeting,
  getAcademicHealth,
} from './dashboardData';

const OP_ICONS = {
  interview: Mic,
  task: ClipboardList,
  scrum: Users,
  deadline: Calendar,
  mentor: GraduationCap,
  attendance: Clock,
};

const OP_STATUS = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  upcoming: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  action: 'bg-red-50 text-red-600 border-red-100',
};

const chartTooltip = {
  contentStyle: { fontSize: '11px', borderRadius: 4, border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
};

const StudentIntelligenceContent = ({ user, isLoading }) => {
  const [expandedInsight, setExpandedInsight] = useState(null);
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const batchLabel = user?.batch?.name || 'FSD Cohort 2026';
  const moduleName = user?.currentModule?.name || MODULE_JOURNEY.current.name;
  const attendancePct = user?.attendancePercentage ?? 92;
  const health = useMemo(() => getAcademicHealth(attendancePct), [attendancePct]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-28 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-24 bg-gray-200 rounded-md" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 h-64 bg-gray-200 rounded-md" />
          <div className="h-64 bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* §1 — Student Command Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="lg:col-span-3 p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">Student Command</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                ACTIVE
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-brand-charcoal tracking-tight">{user?.name || firstName}</h1>
            <p className="text-xs text-brand-gray font-semibold mt-0.5">
              {batchLabel} · Full Stack Development
            </p>
            <p className="text-sm text-brand-charcoal/80 mt-2 font-medium">
              {getGreeting()}, {firstName}. Your operational workspace is ready.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-xs">
                <Flame size={14} className="text-brand-orange" />
                <span className="font-bold text-brand-charcoal">12-day</span>
                <span className="text-brand-gray">learning streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <BookOpen size={14} className="text-brand-charcoal" />
                <span className="font-bold text-brand-charcoal">{moduleName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Target size={14} className="text-emerald-600" />
                <span className="font-bold text-brand-charcoal">{MODULE_JOURNEY.current.progress}%</span>
                <span className="text-brand-gray">module progress</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${MODULE_JOURNEY.current.progress}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="h-full bg-brand-orange rounded-sm"
              />
            </div>
          </div>

          <div className="lg:col-span-2 p-4 md:p-5 bg-brand-light/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray mb-3">Academic Summary</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-md p-2.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Attendance</span>
                <p className="text-lg font-black text-brand-charcoal tabular-nums">{attendancePct}%</p>
                <span className="text-[9px] font-semibold text-emerald-600">On track</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-2.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Health Score</span>
                <p className="text-lg font-black text-brand-charcoal tabular-nums">{health.score}</p>
                <span
                  className={`text-[9px] font-semibold ${
                    health.color === 'emerald'
                      ? 'text-emerald-600'
                      : health.color === 'blue'
                        ? 'text-blue-600'
                        : health.color === 'amber'
                          ? 'text-amber-600'
                          : 'text-red-600'
                  }`}
                >
                  {health.label}
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-2.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Next Evaluation</span>
                <p className="text-sm font-black text-brand-charcoal">6 days</p>
                <span className="text-[9px] text-brand-gray">Module 4 interview</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-2.5">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Standing</span>
                <p className="text-sm font-black text-brand-charcoal">Top 12%</p>
                <span className="text-[9px] text-brand-gray">Cohort rank #{LEADERBOARD.rank}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* §2 — Academic Metrics Grid */}
      <section>
        <SectionHeader icon={BarChart3} title="Academic Performance Metrics" badge="8 KPIs" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((m, i) => (
            <MetricCard key={m.id} metric={m} index={i} />
          ))}
        </div>
      </section>

      {/* §3 + §10 row: Today's Operations + Smart Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <section className="xl:col-span-2 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Activity} title="Today's Academic Operations" badge={TODAY_OPERATIONS.length} />
          <div className="relative pl-4 border-l-2 border-gray-200 space-y-0">
            {TODAY_OPERATIONS.map((op, i) => {
              const Icon = OP_ICONS[op.type] || ClipboardList;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pb-3 last:pb-0 group"
                >
                  <span
                    className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-sm border-2 border-white ${
                      op.priority === 'high' ? 'bg-brand-orange' : op.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  />
                  <div className="flex items-start justify-between gap-3 p-2.5 -ml-1 rounded-md hover:bg-brand-light/80 transition-colors">
                    <div className="flex gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-md bg-brand-light border border-gray-200 shrink-0">
                        <Icon size={14} className="text-brand-charcoal" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-charcoal truncate">{op.title}</p>
                        <p className="text-[10px] text-brand-gray font-medium">{op.time}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${OP_STATUS[op.status]}`}>
                      {op.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="bg-brand-charcoal text-white border border-brand-charcoal rounded-md p-4 shadow-sm">
          <SectionHeader icon={Brain} title="Smart Insights" badge="AI" inverted />
          <ul className="space-y-2">
            {SMART_INSIGHTS.map((insight, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}
                  className="w-full text-left p-2.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-2">
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
                    <span className="text-[11px] font-medium leading-snug">{insight.text}</span>
                  </div>
                  <AnimatePresence>
                    {expandedInsight === i && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-[10px] text-white/60 mt-2 pl-5 overflow-hidden"
                      >
                        Operational insight generated from your recent academic activity patterns.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* §4 — Learning Performance Center */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={TrendingUp} title="Learning Performance Center" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Module Progress</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={MODULE_PROGRESS} layout="vertical" margin={{ left: 0, right: 8 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="module" width={68} tick={{ fontSize: 10, fill: '#929292' }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="progress" radius={[0, 2, 2, 0]} barSize={10}>
                  {MODULE_PROGRESS.map((_, idx) => (
                    <Cell key={idx} fill={idx < 2 ? '#1E2126' : idx === 2 ? '#E8391D' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Attendance Trend</p>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={ATTENDANCE_TREND}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8391D" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E8391D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} width={28} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="rate" stroke="#E8391D" fill="url(#attGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Interview Scores</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={INTERVIEW_SCORES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="module" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={{ fontSize: 10 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="score" stroke="#1E2126" strokeWidth={2} dot={{ r: 3, fill: '#E8391D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Weekly Consistency</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={WEEKLY_CONSISTENCY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} width={20} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="tasks" fill="#1E2126" radius={[2, 2, 0, 0]} barSize={12} />
                <Bar dataKey="scrum" fill="#E8391D" radius={[2, 2, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Task Completion Heatmap</p>
            <div className="grid grid-cols-6 gap-1.5 h-[140px] content-center">
              {TASK_HEATMAP.map((w) => {
                const pct = Math.round((w.completed / w.total) * 100);
                const intensity = pct >= 90 ? 'bg-brand-charcoal' : pct >= 70 ? 'bg-brand-orange' : pct >= 50 ? 'bg-brand-orange/50' : 'bg-gray-200';
                return (
                  <div key={w.week} className="flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-sm ${intensity}`} title={`${pct}%`} />
                    <span className="text-[9px] font-bold text-brand-gray">{w.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Placement Readiness Tracker</p>
            <div className="flex flex-col justify-center h-[140px] gap-2">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-brand-charcoal">72%</span>
                <span className="text-[10px] font-bold text-emerald-600">+5% this month</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-sm overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  className="h-full bg-brand-orange rounded-sm"
                />
              </div>
              <p className="text-[10px] text-brand-gray">Target: 85% before placement phase</p>
            </div>
          </div>
        </div>
      </section>

      {/* §5 + §6: Feedback + Module Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={MessageSquare} title="Performance Feedback Center" badge={FEEDBACK_ITEMS.length} />
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {FEEDBACK_ITEMS.map((fb, i) => (
              <div key={i} className="border border-gray-200 rounded-md p-3 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-xs font-bold text-brand-charcoal">{fb.reviewer}</p>
                    <p className="text-[10px] text-brand-gray">{fb.role} · {fb.date}</p>
                  </div>
                  {fb.score != null && (
                    <span className="text-[10px] font-black bg-brand-orange text-white px-2 py-0.5 rounded-sm shrink-0">
                      {fb.score}/{fb.maxScore}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-brand-charcoal/90 leading-relaxed mb-2">{fb.text}</p>
                <div className="flex flex-wrap gap-1">
                  {fb.tags.map((t) => (
                    <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-light border border-gray-200 rounded text-brand-gray">
                      {t}
                    </span>
                  ))}
                </div>
                {(fb.strengths.length > 0 || fb.improvements.length > 0) && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                    {fb.strengths.length > 0 && (
                      <div>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">Strengths</span>
                        <p className="text-[10px] text-brand-gray">{fb.strengths.join(', ')}</p>
                      </div>
                    )}
                    {fb.improvements.length > 0 && (
                      <div>
                        <span className="text-[9px] font-bold text-brand-orange uppercase">Improve</span>
                        <p className="text-[10px] text-brand-gray">{fb.improvements.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={GitBranch} title="Academic Journey Tracker" />
          <div className="mb-3 p-2.5 bg-brand-light border border-gray-200 rounded-md">
            <p className="text-[10px] font-bold text-brand-gray uppercase">Current Module</p>
            <p className="text-sm font-black text-brand-charcoal">{MODULE_JOURNEY.current.name}</p>
            <p className="text-[10px] text-brand-gray">Week {MODULE_JOURNEY.current.week} · {MODULE_JOURNEY.current.progress}% complete</p>
          </div>
          <div className="space-y-2 mb-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase">Completed</p>
            {MODULE_JOURNEY.completed.map((m) => (
              <div key={m} className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                <span className="font-medium text-brand-charcoal">{m}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase">Next Milestones</p>
            {MODULE_JOURNEY.upcoming.map((m) => (
              <div key={m} className="flex items-center gap-2 text-xs">
                <Clock size={12} className="text-brand-gray shrink-0" />
                <span className="font-medium text-brand-gray">{m}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-200">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Technical Stack Progress</p>
            {MODULE_JOURNEY.stack.map((s) => (
              <div key={s.name} className="mb-2">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="font-semibold text-brand-charcoal">{s.name}</span>
                  <span className="font-bold text-brand-gray">{s.pct}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-brand-charcoal rounded-sm transition-all" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* §7 + §8: Tasks + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader
            icon={ClipboardList}
            title="Task & Resource Center"
            action={
              <Link to="/tasks" className="text-[10px] font-bold text-brand-orange hover:underline flex items-center gap-0.5">
                View all <ChevronRight size={10} />
              </Link>
            }
          />
          <div className="divide-y divide-gray-100">
            {TASK_RESOURCES.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={13} className="text-brand-gray shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-charcoal truncate">{t.title}</p>
                    <p className="text-[10px] text-brand-gray capitalize">{t.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border bg-brand-light text-brand-charcoal border-gray-200">
                    {t.status.replace('_', ' ')}
                  </span>
                  {t.due && <p className="text-[9px] text-brand-gray mt-0.5">{t.due}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader
            icon={Trophy}
            title="Leaderboard & Competitive Insights"
            action={
              <Link to="/leaderboard" className="text-[10px] font-bold text-brand-orange hover:underline flex items-center gap-0.5">
                Full board <ChevronRight size={10} />
              </Link>
            }
          />
          <div className="flex items-center gap-4 mb-4 p-3 bg-brand-light border border-gray-200 rounded-md">
            <div className="text-center">
              <p className="text-3xl font-black text-brand-orange">#{LEADERBOARD.rank}</p>
              <p className="text-[10px] font-bold text-brand-gray uppercase">Cohort Rank</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <p className="text-lg font-black text-brand-charcoal">{LEADERBOARD.percentile}%</p>
                <p className="text-[9px] text-brand-gray font-semibold">Percentile</p>
              </div>
              <div>
                <p className="text-lg font-black text-brand-charcoal">{LEADERBOARD.cohortSize}</p>
                <p className="text-[9px] text-brand-gray font-semibold">Cohort Size</p>
              </div>
            </div>
            <Award size={32} className="text-brand-orange/30 shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LEADERBOARD.metrics.map((m) => (
              <div key={m.label} className="border border-gray-200 rounded-md p-2.5">
                <p className="text-[9px] font-bold text-brand-gray uppercase">{m.label}</p>
                <p className="text-sm font-black text-brand-charcoal">{m.value}</p>
                <div className="h-1 bg-gray-100 rounded-sm mt-1.5 overflow-hidden">
                  <div className="h-full bg-brand-orange rounded-sm" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* §9 — Placement Readiness Panel */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={Briefcase} title="Placement Readiness Intelligence" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {PLACEMENT_PANEL.map((item) => (
            <div key={item.label} className="border border-gray-200 rounded-md p-3 hover:border-brand-orange/30 transition-colors">
              <p className="text-[9px] font-bold text-brand-gray uppercase leading-tight mb-2">{item.label}</p>
              <p className="text-xl font-black text-brand-charcoal tabular-nums">{item.value}%</p>
              <div className="h-1 bg-gray-100 rounded-sm mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-sm ${item.value >= 70 ? 'bg-emerald-500' : item.value >= 50 ? 'bg-brand-orange' : 'bg-gray-400'}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default StudentIntelligenceContent;
