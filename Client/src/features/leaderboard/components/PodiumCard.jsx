import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Flame, GitBranch } from 'lucide-react';

const MEDAL = {
  1: { label: '1', ring: 'ring-brand-orange/40', bg: 'bg-brand-charcoal text-white', accent: 'border-brand-orange' },
  2: { label: '2', ring: 'ring-gray-300', bg: 'bg-white', accent: 'border-gray-300' },
  3: { label: '3', ring: 'ring-amber-600/30', bg: 'bg-white', accent: 'border-amber-200' },
};

const PodiumCard = ({ student, place, emphasized = false }) => {
  const medal = MEDAL[place];
  const TrendIcon = student.trend > 0 ? TrendingUp : student.trend < 0 ? TrendingDown : Minus;
  const trendColor = student.trend > 0 ? 'text-emerald-600' : student.trend < 0 ? 'text-red-600' : 'text-brand-gray';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: place * 0.08, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className={`relative border rounded-md shadow-sm overflow-hidden ${
        emphasized ? `${medal.accent} border-2 ring-1 ${medal.ring}` : `border-gray-200 ${medal.bg}`
      } ${emphasized ? 'lg:-mt-2' : ''}`}
    >
      {emphasized && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-orange" />
      )}
      <div className={`p-3 md:p-4 ${emphasized ? 'bg-brand-charcoal text-white' : 'bg-white'}`}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
              emphasized ? 'border-white/20 bg-white/10' : 'border-gray-200 bg-brand-light text-brand-charcoal'
            }`}
          >
            RANK #{place}
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              emphasized ? 'bg-brand-orange text-white' : 'bg-brand-orange/10 text-brand-orange'
            }`}
          >
            {student.badge}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-md flex items-center justify-center text-sm font-black shrink-0 ${
              emphasized ? 'bg-brand-orange text-white' : 'bg-brand-charcoal text-white'
            }`}
          >
            {student.avatar}
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-black truncate ${emphasized ? 'text-white' : 'text-brand-charcoal'}`}>
              {student.name}
            </p>
            <p className={`text-[10px] font-semibold ${emphasized ? 'text-white/60' : 'text-brand-gray'}`}>
              {student.cohort}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <p className={`text-[9px] font-bold uppercase tracking-wider ${emphasized ? 'text-white/50' : 'text-brand-gray'}`}>
            Overall Score
          </p>
          <p className={`text-2xl font-black tabular-nums ${emphasized ? 'text-brand-orange' : 'text-brand-charcoal'}`}>
            {student.overall}
          </p>
          <div className={`flex items-center gap-1 mt-0.5 ${trendColor}`}>
            <TrendIcon size={11} />
            <span className="text-[10px] font-bold">
              {student.trend > 0 ? `+${student.trend}` : student.trend} positions
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
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
              className={`px-2 py-1.5 rounded border ${
                emphasized ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-brand-light/80'
              }`}
            >
              <span className={`block font-semibold ${emphasized ? 'text-white/50' : 'text-brand-gray'}`}>{label}</span>
              <span className={`font-black ${emphasized ? 'text-white' : 'text-brand-charcoal'}`}>{val}</span>
            </div>
          ))}
        </div>

        <div
          className={`flex items-center justify-between mt-3 pt-2 border-t ${
            emphasized ? 'border-white/10' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center gap-1">
            <Flame size={11} className="text-brand-orange" />
            <span className={`text-[10px] font-bold ${emphasized ? 'text-white/80' : 'text-brand-charcoal'}`}>
              {student.streak}d streak
            </span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch size={11} className={emphasized ? 'text-white/60' : 'text-brand-gray'} />
            <span className={`text-[10px] font-semibold ${emphasized ? 'text-white/60' : 'text-brand-gray'}`}>
              Active
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodiumCard;
