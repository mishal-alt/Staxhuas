import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
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
  TrendingDown,
  Minus,
  GitBranch,
  Users,
  Zap,
} from 'lucide-react';

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

const ThreeDPodium = ({ topThree }) => {
  if (!topThree || topThree.length < 3) return null;

  const pillars = [
    { student: topThree[1], place: 2, heightClass: 'h-[440px] sm:h-[490px] md:h-[530px]', delay: 0.2, theme: 'silver' },
    { student: topThree[0], place: 1, heightClass: 'h-[500px] sm:h-[560px] md:h-[600px]', delay: 0, theme: 'gold' },
    { student: topThree[2], place: 3, heightClass: 'h-[390px] sm:h-[430px] md:h-[470px]', delay: 0.4, theme: 'bronze' }
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-6">
      <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 pt-16 pb-6 w-full relative z-10">
        {pillars.map((p) => {
          const { student, place, heightClass, delay, theme } = p;
          
          const themeConfigs = {
            gold: {
              border: 'border-amber-400/50 shadow-amber-400/10',
              avatarRing: 'border-4 border-amber-400 shadow-lg shadow-amber-400/20',
              avatarBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950',
              scoreText: 'text-amber-400',
              badgeBg: 'bg-amber-400 border-amber-300 text-slate-950',
              pillarBg: 'bg-slate-950/95',
              topRadius: 'rounded-t-2xl',
              zClass: 'z-30'
            },
            silver: {
              border: 'border-sky-400/30 shadow-sky-400/5',
              avatarRing: 'border-4 border-sky-400 shadow-lg shadow-sky-400/20',
              avatarBg: 'bg-gradient-to-br from-sky-400 to-sky-600 text-slate-950',
              scoreText: 'text-sky-400',
              badgeBg: 'bg-sky-400 border-sky-300 text-slate-950',
              pillarBg: 'bg-slate-950/80',
              topRadius: 'rounded-tl-2xl rounded-tr-sm',
              zClass: 'z-20'
            },
            bronze: {
              border: 'border-emerald-400/30 shadow-emerald-400/5',
              avatarRing: 'border-4 border-emerald-400 shadow-lg shadow-emerald-400/20',
              avatarBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950',
              scoreText: 'text-emerald-400',
              badgeBg: 'bg-emerald-400 border-emerald-300 text-slate-950',
              pillarBg: 'bg-slate-950/80',
              topRadius: 'rounded-tl-sm rounded-tr-2xl',
              zClass: 'z-20'
            }
          }[theme];

          const TrendIcon = student.trend > 0 ? TrendingUp : student.trend < 0 ? TrendingDown : Minus;
          const trendColor = student.trend > 0 ? 'text-emerald-400' : student.trend < 0 ? 'text-rose-400' : 'text-slate-400';

          return (
            <div key={student.id} className={`flex flex-col items-center w-full max-w-[280px] relative ${themeConfigs.zClass}`}>
              {/* Floating Avatar ring overlapping top of pillar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delay + 0.6 }}
                className={`w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-full flex items-center justify-center font-black ${themeConfigs.avatarRing} z-10 -mb-7 sm:-mb-9`}
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-black ${themeConfigs.avatarBg}`}>
                  {student.avatar}
                </div>
              </motion.div>

              {/* The Pillar body with grow animation */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay }}
                className={`w-full ${heightClass} ${themeConfigs.pillarBg} border ${themeConfigs.border} ${themeConfigs.topRadius} shadow-xl flex flex-col justify-between pt-10 sm:pt-12 pb-6 px-1.5 sm:px-3 text-white overflow-hidden`}
              >
                {/* Upper section of pillar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: delay + 0.8 }}
                  className="flex flex-col items-center w-full min-w-0"
                >
                  <p className="text-xs sm:text-sm md:text-base font-black truncate text-center w-full px-1">
                    {student.name}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 text-center uppercase tracking-wide">
                    {student.cohort}
                  </p>
                  <span
                    className={`text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded mt-1.5 ${
                      student.badge === 'Elite' ? 'bg-brand-orange text-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {student.badge}
                  </span>

                  <div className="w-4/5 border-t border-white/5 my-2.5 sm:my-3" />

                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Overall Score
                  </p>
                  <p className={`text-xl sm:text-2xl md:text-3xl font-black text-center tracking-tight ${themeConfigs.scoreText}`}>
                    {student.overall}
                  </p>
                  <div className={`flex items-center gap-1 mt-0.5 ${trendColor}`}>
                    <TrendIcon size={10} className="shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-bold">
                      {student.trend > 0 ? `+${student.trend}` : student.trend} positions
                    </span>
                  </div>
                </motion.div>

                {/* Grid of 6 detailed metrics */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: delay + 1.0 }}
                  className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] w-full mt-3 px-0.5 sm:px-1"
                >
                  {[
                    ['Attendance', `${student.attendance}%`],
                    ['Interview', student.interview],
                    ['Scrum', `${student.scrum}%`],
                    ['Tasks', `${student.tasks}%`],
                    ['GitHub', `${student.github}%`],
                    ['Velocity', `${student.velocity}x`],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      className="px-1.5 py-1 rounded bg-white/5 border border-white/5 flex flex-col justify-center min-w-0"
                    >
                      <span className="text-white/40 text-[7.5px] sm:text-[8.5px] font-semibold truncate leading-none mb-0.5">{label}</span>
                      <span className="font-black text-white leading-none truncate">{val}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Footer metrics (streak and active status) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: delay + 1.2 }}
                  className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 w-full text-[9px] sm:text-[10px] px-1"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <Flame size={10} className="text-brand-orange shrink-0" />
                    <span className="font-bold text-slate-300 truncate">
                      {student.streak}d streak
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <GitBranch size={10} className="text-slate-400" />
                    <span className="font-semibold text-slate-400">
                      Active
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Diamond Rank Badge overlapping bottom edge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: delay + 1.4 }}
                className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rotate-45 border-2 flex items-center justify-center shadow-lg ${themeConfigs.badgeBg} z-20`}
              >
                <span className="rotate-[-45deg] text-xs font-black select-none">
                  {place}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PersonalizedAnalytics = ({ activeUser }) => {
  const student = STUDENTS.find(
    (s) => s.name.toLowerCase() === activeUser?.name?.toLowerCase()
  ) || STUDENTS[5]; // Default to Mohammad Mishal if not matched (e.g. administrator/facilitator)

  const TrendIcon = student.trend > 0 ? TrendingUp : student.trend < 0 ? TrendingDown : Minus;
  const trendColor = student.trend > 0 ? 'text-emerald-500' : student.trend < 0 ? 'text-rose-500' : 'text-slate-400';

  const cohortAvgs = {
    attendance: 91.5,
    interview: 8.1,
    scrum: 89.2,
    tasks: 84.6,
    github: 81.0,
    velocity: 0.95
  };

  return (
    <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
      <SectionHeader icon={Activity} title="Your Standing & Performance Insights" badge="PERSONAL ANALYTICS" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
        {/* Profile Card */}
        <div className="bg-brand-charcoal text-white rounded-md p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-md bg-brand-orange text-white flex items-center justify-center text-sm font-black shrink-0">
                {student.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate">{student.name}</p>
                <p className="text-[10px] font-semibold text-white/60 uppercase">{student.cohort}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[8px] font-bold text-white/50 uppercase tracking-wider">Current Standing</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black">Rank #{student.rank}</p>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    student.badge === 'Elite' ? 'bg-brand-orange text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {student.badge} Tier
                  </span>
                </div>
                <div className={`flex items-center gap-1 mt-0.5 text-[10px] ${trendColor}`}>
                  <TrendIcon size={11} className="shrink-0" />
                  <span className="font-bold">
                    {student.trend > 0 ? `+${student.trend}` : student.trend} positions this week
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[8px] font-bold text-white/50 uppercase tracking-wider">Overall Score</p>
                <p className="text-3xl font-black text-brand-orange leading-none">{student.overall}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <Flame size={12} className="text-brand-orange shrink-0" />
              <span className="font-bold">{student.streak}d streak</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch size={12} className="text-white/60 shrink-0" />
              <span className="font-semibold text-white/60">Active Status</span>
            </div>
          </div>
        </div>

        {/* Comparative Analysis */}
        <div className="lg:col-span-2 border border-gray-200 rounded-md p-4 bg-brand-light/30 flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-bold text-brand-charcoal uppercase tracking-wider mb-3">Your Metrics vs. Cohort Average</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Attendance', val: student.attendance, symbol: '%', key: 'attendance' },
                { label: 'Interview Score', val: student.interview, symbol: '/10', key: 'interview' },
                { label: 'Scrum Consistency', val: student.scrum, symbol: '%', key: 'scrum' },
                { label: 'Tasks Completed', val: student.tasks, symbol: '%', key: 'tasks' },
                { label: 'GitHub Contributions', val: student.github, symbol: '%', key: 'github' },
                { label: 'Velocity Multiplier', val: student.velocity, symbol: 'x', key: 'velocity' },
              ].map((m) => {
                const avg = cohortAvgs[m.key];
                const diff = m.val - avg;
                const isPositive = diff >= 0;
                const formattedDiff = m.key === 'interview' || m.key === 'velocity' ? diff.toFixed(1) : Math.round(diff);
                
                const percentMax = m.key === 'interview' ? 10 : m.key === 'velocity' ? 2 : 100;
                const barPercent = Math.min((m.val / percentMax) * 100, 100);
                const avgPercent = Math.min((avg / percentMax) * 100, 100);

                return (
                  <div key={m.label} className="p-2 bg-white border border-gray-200/80 rounded flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-brand-charcoal truncate pr-1">{m.label}</span>
                      <div className="flex items-center gap-1 font-black shrink-0">
                        <span className="text-brand-charcoal">{m.val}{m.symbol}</span>
                        <span className={`text-[8px] font-bold px-1 rounded ${isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                          {isPositive ? '+' : ''}{formattedDiff}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${isPositive ? 'bg-brand-orange' : 'bg-slate-700'}`}
                        style={{ width: `${barPercent}%` }}
                      />
                      <div 
                        className="absolute top-0 h-full w-0.5 bg-brand-charcoal z-10" 
                        style={{ left: `${avgPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-brand-gray font-semibold leading-none mt-0.5">
                      <span>Cohort Avg: {avg}{m.symbol}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-[8px] font-bold text-brand-gray">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-brand-orange rounded" /> Your Score
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-0.5 h-2 bg-brand-charcoal" /> Cohort Average
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const LeaderboardContent = ({ isLoading }) => {
  const { user } = useAuth();
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
      {/* §2 — Top Performers Podium */}
      <section>
        <SectionHeader icon={Award} title="Top Performers — Institutional Podium" badge="TOP 3" />
        <ThreeDPodium topThree={topThree} />
      </section>

      {/* §3 — Global Performance Rankings */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={BarChart3} title="Global Performance Rankings" badge={STUDENTS.length} />
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-4">
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
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
            >
              {TIMEFRAMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
            >
              {COHORTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="text-xs font-semibold border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange cursor-pointer"
            >
              {RANK_FILTERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-brand-charcoal hover:bg-brand-charcoal/90 rounded-md px-3 py-1.5 transition-colors cursor-pointer"
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>
        <RankingsTable students={STUDENTS} search={search} cohortFilter={cohort} rankFilter={rankFilter} />
      </section>

      {/* §5 — Personalized Standing & Performance Insights */}
      <PersonalizedAnalytics activeUser={user} />
    </div>
  );
};

export default LeaderboardContent;
