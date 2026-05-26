import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Sparkline from './Sparkline';

const STATUS_STYLES = {
  strong: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  stable: 'bg-blue-50 text-blue-700 border-blue-100',
  watch: 'bg-amber-50 text-amber-700 border-amber-100',
  growing: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
};

const MetricCard = ({ metric, index = 0 }) => {
  const statusClass = STATUS_STYLES[metric.status] || STATUS_STYLES.stable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -1 }}
      className="bg-white border border-gray-200/80 rounded-md p-3 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider leading-tight">
          {metric.label}
        </span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${statusClass}`}>
          {metric.status}
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-black text-brand-charcoal tabular-nums">{metric.value}</span>
            {metric.unit && (
              <span className="text-[11px] font-semibold text-brand-gray">{metric.unit}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {metric.trendUp === true && <TrendingUp size={11} className="text-emerald-600" />}
            {metric.trendUp === false && <TrendingDown size={11} className="text-amber-600" />}
            {metric.trendUp === null && <Minus size={11} className="text-brand-gray" />}
            <span
              className={`text-[10px] font-bold ${
                metric.trendUp === true
                  ? 'text-emerald-600'
                  : metric.trendUp === false
                    ? 'text-amber-600'
                    : 'text-brand-gray'
              }`}
            >
              {metric.trend}
            </span>
          </div>
        </div>
        <Sparkline data={metric.spark} />
      </div>

      <p className="text-[10px] text-brand-gray font-medium mt-2 pt-2 border-t border-gray-100 leading-snug">
        {metric.insight}
      </p>
    </motion.div>
  );
};

export default MetricCard;
