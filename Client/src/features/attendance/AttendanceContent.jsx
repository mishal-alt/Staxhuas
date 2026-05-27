import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  TrendingUp,
  XCircle,
} from 'lucide-react';

import {
  ATTENDANCE_OVERVIEW,
  HEALTH_METRICS,
  HEATMAP_DAYS,
  HEATMAP_COLORS,
  DAILY_LOG,
  WEEKLY_TREND,
  RECOVERY_GRAPH,
  ATTENDANCE_VS_REVIEW,
  LEAVE_SUMMARY,
  ALERTS,
  FACILITATOR_FEEDBACK,
  ACHIEVEMENTS,
  STATUS_STYLES,
} from './attendanceData';

const chartTooltip = { contentStyle: { fontSize: '11px', borderRadius: 4, border: '1px solid #E5E7EB' } };

const SectionHeader = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center gap-2 mb-3">
    {Icon && <Icon size={14} className="text-brand-orange shrink-0" />}
    <h2 className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider">{title}</h2>
    {badge != null && <span className="text-[9px] font-black bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded">{badge}</span>}
  </div>
);

const AttendanceContent = ({ isLoading }) => {
  const [logPage, setLogPage] = useState(0);
  const pageSize = 5;
  const logPages = Math.ceil(DAILY_LOG.length / pageSize);
  const logSlice = useMemo(() => DAILY_LOG.slice(logPage * pageSize, logPage * pageSize + pageSize), [logPage]);

  if (isLoading) {
    return <div className="flex flex-col gap-4 animate-pulse"><div className="h-24 bg-gray-200 rounded-md" /><div className="h-64 bg-gray-200 rounded-md" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* §1 Command Header */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="lg:col-span-2 p-4">
            <p className="text-[10px] font-bold uppercase text-brand-gray">Attendance Intelligence</p>
            <h1 className="text-lg font-black text-brand-charcoal">Academic Presence Center</h1>
            <p className="text-xs text-brand-gray mt-1">{ATTENDANCE_OVERVIEW.cohort} · Week {ATTENDANCE_OVERVIEW.week}</p>
            <span className="inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-100">{ATTENDANCE_OVERVIEW.status}</span>
          </div>
          <div className="lg:col-span-3 p-4 bg-brand-light/50 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Attendance</span><p className="text-2xl font-black text-brand-charcoal">{ATTENDANCE_OVERVIEW.percentage}%</p></div>
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Streak</span><p className="text-xl font-black text-brand-charcoal flex items-center gap-1"><Flame size={16} className="text-brand-orange" />{ATTENDANCE_OVERVIEW.streak}d</p></div>
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">This Month</span><p className="text-xl font-black text-brand-charcoal">{ATTENDANCE_OVERVIEW.monthlyRate}%</p></div>
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Warnings</span><p className={`text-xl font-black ${ATTENDANCE_OVERVIEW.warnings ? 'text-red-600' : 'text-emerald-600'}`}>{ATTENDANCE_OVERVIEW.warnings}</p></div>
          </div>
        </div>
      </motion.section>

      {/* §2 Health Overview */}
      <section>
        <SectionHeader icon={BarChart3} title="Attendance Health Overview" badge="8 KPIs" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {HEALTH_METRICS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-white border border-gray-200 rounded-md p-2.5 shadow-sm">
              <p className="text-[9px] font-bold text-brand-gray uppercase leading-tight">{m.label}</p>
              <p className="text-lg font-black text-brand-charcoal">{m.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* §3 Timeline Heatmap + §4 Daily Log */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Calendar} title="Academic Presence Timeline" />
          <p className="text-[10px] text-brand-gray mb-3">28-day operational heatmap</p>
          <div className="grid grid-cols-7 gap-1.5">
            {HEATMAP_DAYS.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1" title={`${d.date}: ${d.status}`}>
                <div className="w-full aspect-square rounded-sm min-h-[28px]" style={{ backgroundColor: HEATMAP_COLORS[d.status] || '#e5e7eb' }} />
                <span className="text-[8px] font-semibold text-brand-gray">{d.date.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
            {Object.entries(HEATMAP_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} /><span className="text-[9px] font-semibold text-brand-gray capitalize">{status.replace('-', ' ')}</span></div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Clock} title="Daily Attendance Log" badge={DAILY_LOG.length} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[10px]">
              <thead className="border-b border-gray-200 bg-brand-light/50">
                <tr>{['Date', 'In', 'Out', 'Status', 'Module', 'Scrum', 'Remarks'].map((h) => (
                  <th key={h} className="px-2 py-2 font-bold text-brand-gray uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {logSlice.map((row, i) => (
                  <tr key={row.date} className={`border-b border-gray-100 ${i % 2 ? 'bg-brand-light/20' : ''}`}>
                    <td className="px-2 py-2 font-bold text-brand-charcoal">{row.date}</td>
                    <td className="px-2 py-2">{row.checkIn}</td>
                    <td className="px-2 py-2">{row.checkOut}</td>
                    <td className="px-2 py-2"><span className={`font-bold px-1 py-0.5 rounded border uppercase ${STATUS_STYLES[row.status]}`}>{row.status}</span></td>
                    <td className="px-2 py-2 text-brand-gray">{row.module}</td>
                    <td className="px-2 py-2">{row.scrum ? <CheckCircle2 size={12} className="text-emerald-600" /> : <XCircle size={12} className="text-brand-gray" />}</td>
                    <td className="px-2 py-2 text-brand-gray max-w-[120px] truncate">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            <button type="button" disabled={logPage === 0} onClick={() => setLogPage((p) => p - 1)} className="px-2 py-1 text-[10px] font-bold border rounded-md disabled:opacity-40">Prev</button>
            <span className="text-[10px] font-bold">{logPage + 1}/{logPages}</span>
            <button type="button" disabled={logPage >= logPages - 1} onClick={() => setLogPage((p) => p + 1)} className="px-2 py-1 text-[10px] font-bold border rounded-md disabled:opacity-40">Next</button>
          </div>
        </section>
      </div>

      {/* §5 Analytics */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={TrendingUp} title="Attendance Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Weekly Trend</p>
            <ResponsiveContainer width="100%" height={100}><AreaChart data={WEEKLY_TREND}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis domain={[85, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Area type="monotone" dataKey="rate" stroke="#E8391D" fill="#E8391D" fillOpacity={0.12} strokeWidth={2} /></AreaChart></ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Recovery Graph</p>
            <ResponsiveContainer width="100%" height={100}><LineChart data={RECOVERY_GRAPH}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis domain={[75, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Line type="monotone" dataKey="rate" stroke="#1E2126" strokeWidth={2} dot={{ r: 2, fill: '#E8391D' }} /></LineChart></ResponsiveContainer>
          </div>
          <div className="border border-gray-200 rounded-md p-3 md:col-span-2">
            <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Attendance vs Review Score</p>
            <ResponsiveContainer width="100%" height={100}><LineChart data={ATTENDANCE_VS_REVIEW}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis yAxisId="left" domain={[85, 100]} tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} /><YAxis yAxisId="right" orientation="right" domain={[7, 9]} tick={{ fontSize: 9 }} width={20} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Line yAxisId="left" type="monotone" dataKey="attendance" stroke="#1E2126" strokeWidth={2} dot={false} /><Line yAxisId="right" type="monotone" dataKey="review" stroke="#E8391D" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* §6 Leave + §7 Alerts + §8 Feedback + §9 Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Calendar} title="Leave Management" />
          <div className="grid grid-cols-2 gap-2 text-center">
            {[['Approved', LEAVE_SUMMARY.approved], ['Pending', LEAVE_SUMMARY.pending], ['Rejected', LEAVE_SUMMARY.rejected], ['Balance', LEAVE_SUMMARY.balance]].map(([l, v]) => (
              <div key={l} className="p-2 border border-gray-200 rounded-md"><p className="text-[9px] font-bold text-brand-gray uppercase">{l}</p><p className="text-lg font-black text-brand-charcoal">{v}</p></div>
            ))}
          </div>
          <p className="text-[10px] text-brand-gray mt-2">{LEAVE_SUMMARY.impact}</p>
        </section>
        <section className="bg-brand-charcoal text-white border border-brand-charcoal rounded-md p-4 shadow-sm">
          <SectionHeader icon={AlertTriangle} title="Alert Center" />
          <ul className="space-y-2">{ALERTS.map((a, i) => (
            <li key={i} className="p-2 rounded-md bg-white/5 border border-white/10 text-[11px] flex gap-2">
              <AlertTriangle size={12} className={a.type === 'warning' ? 'text-amber-400 shrink-0' : 'text-blue-400 shrink-0'} />
              {a.text}
            </li>
          ))}</ul>
        </section>
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={MessageSquare} title="Facilitator Feedback" />
          <div className="space-y-2 max-h-[160px] overflow-y-auto">{FACILITATOR_FEEDBACK.map((fb, i) => (
            <div key={i} className="p-2 border border-gray-200 rounded-md text-[11px]"><p className="text-brand-charcoal">{fb.text}</p><p className="text-[10px] text-brand-gray mt-1">{fb.date} · {fb.author}</p></div>
          ))}</div>
        </section>
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Award} title="Attendance Achievements" />
          <div className="space-y-2">{ACHIEVEMENTS.map((a) => (
            <div key={a.title} className="flex justify-between items-center p-2 border border-gray-200 rounded-md">
              <p className="text-xs font-bold text-brand-charcoal">{a.title}</p>
              <span className="text-[10px] font-bold text-brand-orange">{a.metric}</span>
            </div>
          ))}</div>
        </section>
      </div>
    </div>
  );
};

export default AttendanceContent;
