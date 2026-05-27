import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
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
  Calendar,
  Download,
  Filter,
  Flame,
  Mic,
  Radio,
  Rocket,
  Search,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import PodiumCard from './components/PodiumCard';
import RankingsTable from './components/RankingsTable';
import {
  STUDENTS,
  COHORTS,
  TIMEFRAMES,
  RANK_FILTERS,
  COHORT_COMPARISON,
  WEEKLY_GROWTH,
  ATTENDANCE_LEADERS,
  INTERVIEW_EXCELLENCE,
  SCRUM_RANKING,
  CODING_PRODUCTIVITY,
  ACHIEVEMENTS,
  GROWTH_TRACKER,
  LIVE_FEED,
  OVERVIEW_STATS,
} from './leaderboardData';

const chartTooltip = {
  contentStyle: { fontSize: '11px', borderRadius: 4, border: '1px solid #E5E7EB' },
};

const ACHIEVEMENT_ICONS = {
  zap: Zap,
  calendar: Calendar,
  mic: Mic,
  flame: Flame,
  rocket: Rocket,
  users: Users,
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

const LeaderboardContent = ({ isLoading }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[1]);
  const [cohort, setCohort] = useState(COHORTS[0]);
  const [rankFilter, setRankFilter] = useState(RANK_FILTERS[0]);
  const [search, setSearch] = useState('');

  const topThree = STUDENTS.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 bg-gray-200 rounded-md" />
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray mb-1">Institutional Rankings</p>
            <h1 className="text-lg font-black text-brand-charcoal">Hall of Fame — Performance Index</h1>
            <p className="text-xs text-brand-gray mt-1 font-medium">
              {OVERVIEW_STATS.totalStudents} students · {OVERVIEW_STATS.activeCohorts} active cohorts · Avg score{' '}
              {OVERVIEW_STATS.avgScore}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="text-xs">
                <span className="text-brand-gray font-semibold">Network rank coverage</span>
                <p className="font-black text-brand-charcoal">100%</p>
              </div>
              <div className="text-xs">
                <span className="text-brand-gray font-semibold">Elite tier</span>
                <p className="font-black text-brand-orange">Top {OVERVIEW_STATS.topPercentile}%</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 p-4 bg-brand-light/50 flex flex-col justify-center gap-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Timeframe</span>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                >
                  {TIMEFRAMES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Cohort</span>
                <select
                  value={cohort}
                  onChange={(e) => setCohort(e.target.value)}
                  className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                >
                  {COHORTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-brand-gray uppercase">Ranking</span>
                <select
                  value={rankFilter}
                  onChange={(e) => setRankFilter(e.target.value)}
                  className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                >
                  {RANK_FILTERS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-1 justify-end">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-brand-charcoal hover:bg-brand-charcoal/90 rounded-md px-3 py-1.5 transition-colors"
                >
                  <Download size={13} />
                  Export
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-semibold text-brand-gray">Live rankings · Last synced 2 min ago</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* §2 — Top Performers Podium */}
      <section>
        <SectionHeader icon={Award} title="Top Performers — Institutional Podium" badge="TOP 3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end max-w-5xl mx-auto lg:max-w-none">
          <div className="md:order-1">
            <PodiumCard student={topThree[1]} place={2} />
          </div>
          <div className="md:order-2">
            <PodiumCard student={topThree[0]} place={1} emphasized />
          </div>
          <div className="md:order-3">
            <PodiumCard student={topThree[2]} place={3} />
          </div>
        </div>
      </section>

      {/* §3 — Global Performance Rankings */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={BarChart3} title="Global Performance Rankings" badge={STUDENTS.length} />
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="search"
              placeholder="Search student or cohort..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-orange"
              aria-label="Search students"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gray">
            <Filter size={12} />
            <span>{rankFilter} · {timeframe}</span>
          </div>
        </div>
        <RankingsTable students={STUDENTS} search={search} cohortFilter={cohort} rankFilter={rankFilter} />
      </section>

      {/* §4 — Performance Analytics */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={TrendingUp} title="Performance Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Cohort Comparison</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={COHORT_COMPARISON}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="cohort" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 95]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="score" radius={[2, 2, 0, 0]} barSize={16}>
                  {COHORT_COMPARISON.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#E8391D' : '#1E2126'} opacity={i === 0 ? 1 : 0.5 + i * 0.1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Weekly Growth Trend</p>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={WEEKLY_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 95]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="avg" stroke="#E8391D" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Attendance Leaders</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={ATTENDANCE_LEADERS} layout="vertical" margin={{ left: 4 }}>
                <XAxis type="number" domain={[85, 100]} hide />
                <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="rate" fill="#1E2126" radius={[0, 2, 2, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Interview Excellence</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={INTERVIEW_EXCELLENCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[7, 10]} tick={{ fontSize: 9 }} width={20} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="score" fill="#E8391D" radius={[2, 2, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Scrum Consistency</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={SCRUM_RANKING}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="score" fill="#1E2126" radius={[2, 2, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Coding Productivity</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={CODING_PRODUCTIVITY} layout="vertical" margin={{ left: 4 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={48} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="commits" fill="#E8391D" radius={[0, 2, 2, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* §5 + §7: Achievements + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Award} title="Academic Achievement Recognition" badge={ACHIEVEMENTS.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ACHIEVEMENTS.map((a) => {
              const Icon = ACHIEVEMENT_ICONS[a.icon] || Award;
              return (
                <div
                  key={a.title}
                  className="flex items-start gap-2.5 p-2.5 border border-gray-200 rounded-md hover:border-brand-orange/30 transition-colors"
                >
                  <div className="p-1.5 rounded-md bg-brand-light border border-gray-200 shrink-0">
                    <Icon size={14} className="text-brand-orange" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-brand-gray uppercase">{a.title}</p>
                    <p className="text-xs font-black text-brand-charcoal truncate">{a.recipient}</p>
                    <p className="text-[10px] text-brand-gray font-medium">{a.metric}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-brand-charcoal text-white border border-brand-charcoal rounded-md p-4 shadow-sm">
          <SectionHeader icon={Radio} title="Live Competition Feed" badge="LIVE" />
          <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {LIVE_FEED.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-2.5 rounded-md bg-white/5 border border-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-medium leading-snug">{item.text}</p>
                  <span className="text-[9px] text-white/40 font-semibold shrink-0">{item.time}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>
      </div>

      {/* §6 — Student Growth Tracker */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={Activity} title="Student Growth Tracker" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {['Student', 'Rank Δ', 'Score Δ', 'Weekly', 'Module', 'Stability'].map((h) => (
                  <th key={h} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-brand-gray">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROWTH_TRACKER.map((row, i) => (
                <tr key={row.student} className={`border-b border-gray-100 ${i % 2 ? 'bg-brand-light/30' : ''}`}>
                  <td className="px-3 py-2.5 text-xs font-bold text-brand-charcoal">{row.student}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`text-[10px] font-bold ${
                        row.rankDelta.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {row.rankDelta}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-brand-charcoal">{row.scoreDelta}</td>
                  <td className="px-3 py-2.5 text-xs text-brand-gray">{row.weekly}</td>
                  <td className="px-3 py-2.5 text-xs text-brand-gray">{row.module}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        row.stability === 'Elite'
                          ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
                          : row.stability === 'Improving'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : row.stability === 'Declining'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-gray-50 text-brand-gray border-gray-200'
                      }`}
                    >
                      {row.stability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardContent;
