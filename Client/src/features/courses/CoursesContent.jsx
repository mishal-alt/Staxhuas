import React, { useState } from 'react';
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
} from 'recharts';
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  GitBranch,
  GraduationCap,
  Layers,
  Lock,
  Mic,
  Rocket,
} from 'lucide-react';

import ModuleLearningPanel from './components/ModuleLearningPanel';
import {
  COURSE_OVERVIEW,
  LEARNING_PIPELINE,
  MODULES,
  MODULE_STATUS_STYLES,
  WEEKLY_LEARNING,
  MODULE_VELOCITY,
  ATTENDANCE_VS_LEARNING,
  EXECUTION_TRACKER,
  UPCOMING_EVENTS,
  FACILITATOR_INSIGHTS,
  CERTIFICATIONS,
} from './coursesData';

const chartTooltip = { contentStyle: { fontSize: '11px', borderRadius: 4, border: '1px solid #E5E7EB' } };

const SectionHeader = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center gap-2 mb-3">
    {Icon && <Icon size={14} className="text-brand-orange shrink-0" />}
    <h2 className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider">{title}</h2>
    {badge != null && <span className="text-[9px] font-black bg-brand-orange/10 text-brand-orange px-1.5 py-0.5 rounded">{badge}</span>}
  </div>
);

const CoursesContent = ({ isLoading }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  if (isLoading) {
    return <div className="flex flex-col gap-4 animate-pulse"><div className="h-24 bg-gray-200 rounded-md" /><div className="h-64 bg-gray-200 rounded-md" /></div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* §1 Command Header */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          <div className="lg:col-span-2 p-4">
            <p className="text-[10px] font-bold uppercase text-brand-gray">Learning Workspace</p>
            <h1 className="text-lg font-black text-brand-charcoal">{COURSE_OVERVIEW.title}</h1>
            <p className="text-xs text-brand-gray mt-1">{COURSE_OVERVIEW.cohort} · {COURSE_OVERVIEW.cycle}</p>
            <span className="inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-100">{COURSE_OVERVIEW.status}</span>
          </div>
          <div className="lg:col-span-3 p-4 bg-brand-light/50 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Progress</span><p className="text-lg font-black text-brand-charcoal">{COURSE_OVERVIEW.progress}%</p></div>
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Modules</span><p className="text-lg font-black text-brand-charcoal">{COURSE_OVERVIEW.completedModules}/{COURSE_OVERVIEW.totalModules}</p></div>
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Next Unlock</span><p className="text-xs font-black text-brand-charcoal">{COURSE_OVERVIEW.nextUnlock}</p><p className="text-[10px] text-brand-gray">{COURSE_OVERVIEW.nextUnlockDate}</p></div>
            <div><span className="text-[9px] font-bold text-brand-gray uppercase">Standing</span><p className="text-sm font-black text-emerald-600">{COURSE_OVERVIEW.standing}</p></div>
          </div>
        </div>
      </motion.section>

      {/* §2 Learning Pipeline */}
      <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <SectionHeader icon={Layers} title="Current Learning Pipeline" badge="ACTIVE" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            ['Course', LEARNING_PIPELINE.activeCourse],
            ['Module', LEARNING_PIPELINE.currentModule],
            ['Sprint', `Week ${LEARNING_PIPELINE.sprintWeek}`],
            ['Facilitator', LEARNING_PIPELINE.facilitator],
            ['Est. Complete', LEARNING_PIPELINE.estCompletion],
            ['Health', `${LEARNING_PIPELINE.moduleHealth}%`],
            ['Velocity', LEARNING_PIPELINE.velocity],
            ['Placement +', `+${LEARNING_PIPELINE.placementContribution}%`],
          ].map(([label, val]) => (
            <div key={label} className="p-2 border border-gray-200 rounded-md">
              <p className="text-[9px] font-bold text-brand-gray uppercase">{label}</p>
              <p className="text-[11px] font-black text-brand-charcoal truncate" title={val}>{val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {LEARNING_PIPELINE.sequence.map((m, i) => (
            <span key={m} className={`text-[10px] font-bold px-2 py-1 rounded-md border shrink-0 ${i < 3 ? 'bg-brand-charcoal text-white border-brand-charcoal' : i === 3 ? 'bg-brand-orange text-white border-brand-orange' : 'bg-gray-100 text-brand-gray border-gray-200'}`}>{m}</span>
          ))}
        </div>
      </section>

      {/* §3 Module Grid */}
      <section>
        <SectionHeader icon={BookOpen} title="Module Grid" badge={MODULES.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {MODULES.map((mod, i) => (
            <motion.button
              key={mod.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => mod.status !== 'locked' && setSelectedModule(mod)}
              disabled={mod.status === 'locked'}
              className={`text-left p-3 border rounded-md transition-all ${mod.status === 'locked' ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:border-brand-orange/40 hover:shadow-sm'}`}
            >
              <div className="flex justify-between gap-2 mb-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${MODULE_STATUS_STYLES[mod.status]}`}>{mod.status.replace('_', ' ')}</span>
                {mod.status === 'locked' && <Lock size={12} className="text-brand-gray" />}
              </div>
              <p className="text-xs font-black text-brand-charcoal leading-snug">{mod.name}</p>
              <p className="text-[10px] text-brand-gray">{mod.code} · {mod.type}</p>
              <div className="h-1 bg-gray-100 rounded-sm mt-2 overflow-hidden"><div className="h-full bg-brand-orange rounded-sm" style={{ width: `${mod.progress}%` }} /></div>
              <p className="text-[10px] font-bold text-brand-charcoal mt-1">{mod.progress}% · {mod.difficulty}</p>
              <div className="grid grid-cols-2 gap-1 mt-2 text-[9px] text-brand-gray">
                <span>{mod.tasks} tasks</span>
                <span>{mod.duration}</span>
                <span>{mod.reviewStatus}</span>
                <span>{mod.attendanceImpact} impact</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {mod.stack.map((t) => <span key={t} className="text-[8px] font-semibold px-1 py-0.5 bg-brand-light border border-gray-100 rounded">{t}</span>)}
                {mod.github && <GitBranch size={10} className="text-brand-charcoal" />}
                {mod.interview && <Mic size={10} className="text-brand-orange" />}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* §5 Analytics + §6 Execution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <section className="xl:col-span-2 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={BarChart3} title="Course Progress Analytics" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Weekly Learning</p>
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={WEEKLY_LEARNING}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Area type="monotone" dataKey="progress" stroke="#E8391D" fill="#E8391D" fillOpacity={0.15} strokeWidth={2} /></AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Attendance vs Learning</p>
              <ResponsiveContainer width="100%" height={110}>
                <LineChart data={ATTENDANCE_VS_LEARNING}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9 }} width={24} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Line type="monotone" dataKey="attendance" stroke="#1E2126" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="learning" stroke="#E8391D" strokeWidth={2} dot={false} /></LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border border-gray-200 rounded-md p-3 md:col-span-2">
              <p className="text-[10px] font-bold text-brand-gray uppercase mb-2">Module Completion Velocity (weeks)</p>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={MODULE_VELOCITY}><XAxis dataKey="module" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9 }} width={20} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} /><Bar dataKey="weeks" fill="#1E2126" radius={[2, 2, 0, 0]} barSize={24} /></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={GitBranch} title="Practical Execution Tracker" />
          <div className="space-y-2">
            {EXECUTION_TRACKER.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] mb-0.5"><span className="font-semibold text-brand-charcoal">{item.label}</span><span className="font-black">{item.unit ? `${item.value}${item.unit}` : `${item.value}/${item.max}`}</span></div>
                <div className="h-1 bg-gray-100 rounded-sm overflow-hidden"><div className="h-full bg-brand-orange rounded-sm" style={{ width: item.max ? `${(item.value / item.max) * 100}%` : '70%' }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* §7 Events + §8 Insights + §9 Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Calendar} title="Upcoming Learning Events" />
          <ul className="space-y-2">{UPCOMING_EVENTS.map((ev) => (
            <li key={ev.title} className="p-2.5 border border-gray-200 rounded-md flex justify-between gap-2">
              <div><p className="text-xs font-bold text-brand-charcoal">{ev.title}</p><p className="text-[10px] text-brand-gray">{ev.type}</p></div>
              <span className="text-[10px] font-bold text-brand-gray shrink-0">{ev.date}</span>
            </li>
          ))}</ul>
        </section>
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={GraduationCap} title="Facilitator Insights" />
          <div className="space-y-2 max-h-[220px] overflow-y-auto">{FACILITATOR_INSIGHTS.map((fb, i) => (
            <div key={i} className="p-2 border border-gray-200 rounded-md text-[11px]">
              <span className="text-[9px] font-bold uppercase text-brand-orange">{fb.type}</span>
              <p className="text-brand-charcoal mt-0.5">{fb.text}</p>
              <p className="text-[10px] text-brand-gray mt-1">— {fb.author}</p>
            </div>
          ))}</div>
        </section>
        <section className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <SectionHeader icon={Award} title="Certification & Achievements" />
          <div className="space-y-2">{CERTIFICATIONS.map((c) => (
            <div key={c.title} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
              {c.type === 'deployment' ? <Rocket size={14} className="text-brand-orange" /> : <Award size={14} className="text-brand-orange" />}
              <div className="flex-1 min-w-0"><p className="text-xs font-bold text-brand-charcoal">{c.title}</p><p className="text-[10px] text-brand-gray">{c.date}</p></div>
            </div>
          ))}</div>
        </section>
      </div>

      <ModuleLearningPanel module={selectedModule} onClose={() => setSelectedModule(null)} />
    </div>
  );
};

export default CoursesContent;
