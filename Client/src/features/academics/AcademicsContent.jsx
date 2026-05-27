import React, { useState, useMemo } from 'react';
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
  Activity,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GitBranch,
  GraduationCap,
  MessageSquare,
  Mic,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Minus,
  AlertCircle,
} from 'lucide-react';

import InterviewReviewPerformanceChart from './components/InterviewReviewPerformanceChart';
import {
  ACTIVE_MODULE,
  HEALTH_METRICS,
  REVIEWS,
  TECHNICAL_METRICS,
  PROFESSIONAL_METRICS,
  WEEKLY_SCORES,
  ATTENDANCE_TREND,
  MODULE_PERFORMANCE,
  TECHNICAL_GROWTH,
  INTERVIEW_READINESS,
  PRODUCTIVITY_EVOLUTION,
  FACILITATOR_FEEDBACK,
  GROWTH_TRACKER,
  UPCOMING_EVENTS,
  STANDING,
} from './academicsData';

const chartTooltip = {
  contentStyle: { fontSize: '11px', borderRadius: 4, border: '1px solid #E5E7EB' },
};

const STATUS_STYLES = {
  strong: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  stable: 'bg-blue-50 text-blue-700 border-blue-100',
  growing: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
};

const SectionHeader = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center gap-2 mb-3">
    {Icon && <Icon size={14} className="text-brand-orange shrink-0" />}
    <h2 className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider">{title}</h2>
    {badge != null && (
      <span className="text-[9px] font-black bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded">{badge}</span>
    )}
  </div>
);

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={11} className="text-emerald-600" />;
  if (trend === 'down') return <TrendingDown size={11} className="text-red-600" />;
  return <Minus size={11} className="text-brand-gray" />;
};

const AcademicsContent = ({ isLoading }) => {
  const completedReviews = useMemo(() => REVIEWS.filter((r) => r.status === 'completed'), []);
  const [selectedReviewId, setSelectedReviewId] = useState(completedReviews[0]?.id || REVIEWS[0]?.id);

  const selectedReview = REVIEWS.find((r) => r.id === selectedReviewId) || REVIEWS[0];

  const daysToReview = useMemo(() => {
    const d = new Date(ACTIVE_MODULE.nextReview);
    const now = new Date();
    return Math.max(0, Math.ceil((d - now) / (1000 * 60 * 60 * 24)));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-16 bg-gray-200 rounded-md" />
          ))}
        </div>
        <div className="h-80 bg-gray-200 rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* §1 — Academic Command Header */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="lg:col-span-2 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">Academic Intelligence</p>
            <h1 className="text-lg font-black text-brand-charcoal">Performance & Review Center</h1>
            <p className="text-xs text-brand-gray mt-1 font-medium">
              {ACTIVE_MODULE.title} · {ACTIVE_MODULE.code}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs">
              <span className="font-bold text-brand-charcoal">
                Standing: <span className="text-emerald-600">{STANDING.label}</span>
              </span>
              <span className="text-brand-gray">
                Rank #{STANDING.rank}/{STANDING.cohortSize}
              </span>
              <span className="text-brand-gray">MERN-B1 · FSD 2026</span>
            </div>
          </div>
          <div className="lg:col-span-3 p-4 bg-brand-light/50 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Next Review</span>
              <p className="text-lg font-black text-brand-charcoal">{daysToReview}d</p>
              <p className="text-[10px] text-brand-gray">{ACTIVE_MODULE.reviewType}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Eval Cycle</span>
              <p className="text-sm font-black text-brand-charcoal">{STANDING.cycle}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Status</span>
              <p className="text-sm font-black text-emerald-600">{STANDING.label}</p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-gray uppercase">Readiness</span>
              <p className="text-lg font-black text-brand-charcoal">{STANDING.readiness}%</p>
              <div className="h-1 bg-gray-200 rounded-sm mt-1 overflow-hidden">
                <div className="h-full bg-brand-orange rounded-sm" style={{ width: `${STANDING.readiness}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* §2 — Active Module Overview */}
      <section className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 bg-brand-light/50">
          <SectionHeader icon={BookOpen} title="Active Module Overview" badge="LIVE" />
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <p className="text-[10px] font-bold text-brand-gray uppercase">Module</p>
            <p className="text-sm font-black text-brand-charcoal">{ACTIVE_MODULE.title}</p>
            <p className="text-[10px] text-brand-gray font-semibold mt-0.5">
              {ACTIVE_MODULE.code} · Week {ACTIVE_MODULE.week}/{ACTIVE_MODULE.totalWeeks}
            </p>
            <p className="text-[10px] text-brand-gray mt-2 flex items-center gap-1">
              <GraduationCap size={11} />
              {ACTIVE_MODULE.facilitator}
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Module Timeline</p>
            <div className="flex gap-1">
              {ACTIVE_MODULE.timeline.map((p) => (
                <div
                  key={p.phase}
                  className={`flex-1 h-1.5 rounded-sm ${
                    p.status === 'done'
                      ? 'bg-brand-charcoal'
                      : p.status === 'active'
                        ? 'bg-brand-orange'
                        : 'bg-gray-200'
                  }`}
                  title={p.phase}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {ACTIVE_MODULE.timeline.map((p) => (
                <span key={p.phase} className="text-[8px] font-semibold text-brand-gray truncate max-w-[48px]">
                  {p.phase}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[10px] font-bold text-brand-gray uppercase">Sprint Progress</p>
            <p className="text-xl font-black text-brand-charcoal">{ACTIVE_MODULE.sprintProgress}%</p>
            <div className="h-1.5 bg-gray-100 rounded-sm mt-1 overflow-hidden">
              <div className="h-full bg-brand-orange rounded-sm" style={{ width: `${ACTIVE_MODULE.sprintProgress}%` }} />
            </div>
            <p className="text-[10px] text-brand-gray mt-2">Cohort avg: {ACTIVE_MODULE.cohortProgress}%</p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 gap-2">
            <div className="p-2 border border-gray-200 rounded-md">
              <p className="text-[9px] font-bold text-brand-gray uppercase">GitHub</p>
              <p className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <GitBranch size={11} />
                {ACTIVE_MODULE.githubStatus}
              </p>
            </div>
            <div className="p-2 border border-gray-200 rounded-md">
              <p className="text-[9px] font-bold text-brand-gray uppercase">Project</p>
              <p className="text-xs font-black text-brand-charcoal">{ACTIVE_MODULE.projectStatus}</p>
            </div>
            <div className="p-2 border border-gray-200 rounded-md">
              <p className="text-[9px] font-bold text-brand-gray uppercase">Next Review</p>
              <p className="text-xs font-black text-brand-charcoal">{ACTIVE_MODULE.nextReview}</p>
            </div>
            <div className="p-2 border border-gray-200 rounded-md">
              <p className="text-[9px] font-bold text-brand-gray uppercase">Health</p>
              <p className="text-xs font-black text-brand-orange">{ACTIVE_MODULE.healthScore}/100</p>
            </div>
          </div>
        </div>
      </section>

      {/* §3 — Academic Health Matrix */}
      <section>
        <SectionHeader icon={BarChart3} title="Academic Health Matrix" badge="8 KPIs" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {HEALTH_METRICS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white border border-gray-200 rounded-md p-2.5 shadow-sm hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="text-[9px] font-bold text-brand-gray uppercase leading-tight">{m.label}</span>
                <span className={`text-[8px] font-bold px-1 py-0.5 rounded border uppercase ${STATUS_STYLES[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xl font-black text-brand-charcoal tabular-nums">{m.value}</p>
              <p className="text-[10px] font-bold text-emerald-600">{m.trend}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Coding Interview Performance — Last 10 Reviews Bar Chart */}
      <InterviewReviewPerformanceChart />

      {/* §4 — Review Timeline Center */}
      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col max-h-[520px]">
          <div className="px-4 py-2 border-b border-gray-200">
            <SectionHeader icon={Clock} title="Review Timeline" badge={REVIEWS.length} />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {REVIEWS.map((review) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setSelectedReviewId(review.id)}
                className={`w-full text-left p-2.5 rounded-md border transition-all ${
                  selectedReviewId === review.id
                    ? 'border-brand-orange bg-brand-orange/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-brand-light/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-brand-gray">{review.week}</p>
                    <p className="text-xs font-black text-brand-charcoal truncate">{review.type}</p>
                    <p className="text-[10px] text-brand-gray">{review.evaluator}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {review.score != null ? (
                      <p className="text-sm font-black text-brand-charcoal">{review.score}/10</p>
                    ) : (
                      <span className="text-[9px] font-bold text-brand-orange uppercase">Scheduled</span>
                    )}
                    {review.trend && <TrendIcon trend={review.trend} />}
                  </div>
                </div>
                <span
                  className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                    review.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {review.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <SectionHeader icon={Target} title="Review Intelligence" />
          {selectedReview ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
                <div>
                  <p className="text-sm font-black text-brand-charcoal">
                    {selectedReview.type} — {selectedReview.week}
                  </p>
                  <p className="text-[10px] text-brand-gray">
                    {selectedReview.date} · {selectedReview.evaluator}
                  </p>
                </div>
                {selectedReview.score != null && (
                  <span className="text-2xl font-black text-brand-orange">{selectedReview.score}/10</span>
                )}
              </div>

              {selectedReview.breakdown && (
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(selectedReview.breakdown).map(([k, v]) => (
                    <div key={k} className="p-2 border border-gray-200 rounded-md text-center">
                      <p className="text-[9px] font-bold text-brand-gray uppercase">{k}</p>
                      <p className="text-sm font-black text-brand-charcoal">{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedReview.strengths?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Strengths</p>
                  <ul className="text-xs text-brand-charcoal space-y-0.5">
                    {selectedReview.strengths.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedReview.weaknesses?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-brand-orange uppercase mb-1">Areas to Improve</p>
                  <ul className="text-xs text-brand-charcoal space-y-0.5">
                    {selectedReview.weaknesses.map((w) => (
                      <li key={w}>· {w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedReview.notes && (
                <div className="p-2.5 bg-brand-light border border-gray-200 rounded-md">
                  <p className="text-[10px] font-bold text-brand-gray uppercase mb-1">Facilitator Notes</p>
                  <p className="text-xs text-brand-charcoal leading-relaxed">{selectedReview.notes}</p>
                </div>
              )}

              {selectedReview.technicalFeedback && (
                <div>
                  <p className="text-[10px] font-bold text-brand-gray uppercase mb-1">Technical Feedback</p>
                  <p className="text-xs text-brand-charcoal">{selectedReview.technicalFeedback}</p>
                </div>
              )}

              {selectedReview.suggestions?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-brand-gray uppercase mb-1">Improvement Suggestions</p>
                  <ul className="text-xs text-brand-gray space-y-0.5">
                    {selectedReview.suggestions.map((s) => (
                      <li key={s} className="flex items-center gap-1">
                        <ChevronRight size={10} className="text-brand-orange shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                {selectedReview.attendanceImpact && (
                  <p className="text-[10px] text-brand-gray">
                    <span className="font-bold text-brand-charcoal">Attendance: </span>
                    {selectedReview.attendanceImpact}
                  </p>
                )}
                {selectedReview.academicTrend && (
                  <p className="text-[10px] text-brand-gray">
                    <span className="font-bold text-brand-charcoal">Trend: </span>
                    {selectedReview.academicTrend}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-brand-gray">Select a review from the timeline.</p>
          )}
        </div>
      </section>

      {/* §5 — Performance Analytics */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={Activity} title="Performance Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Weekly Score Progression</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={WEEKLY_SCORES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={{ fontSize: 9 }} width={20} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="score" stroke="#E8391D" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Attendance Trend</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={ATTENDANCE_TREND}>
                <defs>
                  <linearGradient id="attAcad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E2126" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#1E2126" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="rate" stroke="#1E2126" fill="url(#attAcad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Module Performance</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={MODULE_PERFORMANCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="module" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="score" radius={[2, 2, 0, 0]} barSize={20}>
                  {MODULE_PERFORMANCE.map((entry, i) => (
                    <Cell key={i} fill={entry.score >= 80 ? '#1E2126' : entry.score >= 70 ? '#E8391D' : '#929292'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Technical Growth</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={TECHNICAL_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 90]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="index" stroke="#1E2126" strokeWidth={2} dot={{ r: 3, fill: '#E8391D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Interview Readiness</p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={INTERVIEW_READINESS}>
                <defs>
                  <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8391D" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E8391D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 80]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="score" stroke="#E8391D" fill="url(#intGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Productivity Evolution</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={PRODUCTIVITY_EVOLUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 90]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="score" stroke="#E8391D" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* §6 — Review Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={BarChart3} title="Technical Metrics" />
          <div className="space-y-2">
            {TECHNICAL_METRICS.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="font-semibold text-brand-charcoal">{m.label}</span>
                  <span className="font-black text-brand-charcoal">{m.score}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-brand-charcoal rounded-sm transition-all"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Users} title="Professional Metrics" />
          <div className="space-y-2">
            {PROFESSIONAL_METRICS.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="font-semibold text-brand-charcoal">{m.label}</span>
                  <span className="font-black text-brand-charcoal">{m.score}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-sm transition-all"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §7 + §8 + §9 row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={MessageSquare} title="Facilitator Feedback Center" />
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {FACILITATOR_FEEDBACK.map((fb, i) => (
              <div key={i} className="p-2.5 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase text-brand-orange">{fb.type}</span>
                  <span className="text-[9px] text-brand-gray">{fb.date}</span>
                </div>
                <p className="text-[11px] text-brand-charcoal leading-snug">{fb.text}</p>
                <p className="text-[10px] text-brand-gray mt-1 font-semibold">— {fb.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={TrendingUp} title="Student Growth Tracker" />
          <div className="space-y-2">
            {GROWTH_TRACKER.map((g) => (
              <div key={g.metric} className="flex items-center justify-between p-2 border border-gray-100 rounded-md">
                <div>
                  <p className="text-[10px] font-bold text-brand-charcoal">{g.metric}</p>
                  <p className="text-[9px] text-brand-gray">{g.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-brand-charcoal">{g.value}</p>
                  <span
                    className={`text-[9px] font-bold ${
                      g.status === 'improving' ? 'text-emerald-600' : g.status === 'ahead' ? 'text-brand-orange' : 'text-brand-gray'
                    }`}
                  >
                    {g.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Calendar} title="Upcoming Academic Events" badge={UPCOMING_EVENTS.length} />
          <ul className="space-y-2">
            {UPCOMING_EVENTS.map((ev) => (
              <li
                key={ev.title}
                className={`p-2.5 border rounded-md ${
                  ev.priority === 'critical' ? 'border-red-200 bg-red-50/30' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-bold text-brand-charcoal">{ev.title}</p>
                  <span className="text-[9px] font-bold text-brand-gray shrink-0">{ev.date}</span>
                </div>
                <p className="text-[10px] text-brand-gray mt-0.5 flex items-center gap-2">
                  {ev.type === 'Interview' ? <Mic size={10} /> : <Calendar size={10} />}
                  {ev.type}
                  {ev.priority === 'critical' && <AlertCircle size={10} className="text-red-600" />}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AcademicsContent;
