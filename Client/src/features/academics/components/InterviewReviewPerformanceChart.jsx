import React, { useMemo, useState } from 'react';
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
import { BarChart2, LineChart as LineChartIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { CODING_INTERVIEW_REVIEWS, PERFORMANCE_TIERS } from '../academicsData';

const PAGE_SIZE = 10;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { weekLabel, score, tier } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-md px-3 py-2 shadow-md text-xs">
      <p className="font-bold text-brand-charcoal">{weekLabel}</p>
      <p className="text-brand-gray mt-0.5">
        Score: <span className="font-black text-brand-charcoal">{score}</span>
      </p>
      <p className="text-[10px] font-bold mt-1 uppercase" style={{ color: payload[0].payload.fill }}>
        {tier}
      </p>
    </div>
  );
};

const InterviewReviewPerformanceChart = () => {
  const [chartType, setChartType] = useState('bar');
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(CODING_INTERVIEW_REVIEWS.length / PAGE_SIZE);

  const pageData = useMemo(() => {
    const start = page * PAGE_SIZE;
    return CODING_INTERVIEW_REVIEWS.slice(start, start + PAGE_SIZE);
  }, [page]);

  const legendItems = [
    PERFORMANCE_TIERS.good,
    PERFORMANCE_TIERS.average,
    PERFORMANCE_TIERS.belowAverage,
    PERFORMANCE_TIERS.weekBack,
  ];

  return (
    <section className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-brand-charcoal text-center sm:text-left">
              Last 10 Coding Interview Performance
            </h2>
            <p className="text-[10px] text-brand-gray font-medium text-center sm:text-left mt-0.5">
              Historical scores from institutional coding interview evaluations
            </p>
          </div>
          <div className="flex justify-center gap-1">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              aria-label="Bar chart view"
              aria-pressed={chartType === 'bar'}
              className={`p-2 rounded-md border transition-colors ${
                chartType === 'bar'
                  ? 'bg-brand-orange/10 border-brand-orange/40 text-brand-orange'
                  : 'bg-white border-gray-200 text-brand-gray hover:border-gray-300'
              }`}
            >
              <BarChart2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              aria-label="Line chart view"
              aria-pressed={chartType === 'line'}
              className={`p-2 rounded-md border transition-colors ${
                chartType === 'line'
                  ? 'bg-brand-orange/10 border-brand-orange/40 text-brand-orange'
                  : 'bg-white border-gray-200 text-brand-gray hover:border-gray-300'
              }`}
            >
              <LineChartIcon size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-3 py-2">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-2 sm:px-4 py-4">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={pageData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="weekLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 600, fill: '#929292' }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#929292' }}
                  label={{
                    value: 'Score',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 10, fontWeight: 700, fill: '#929292' },
                  }}
                  width={36}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="score" radius={0} barSize={36} maxBarSize={48}>
                  {pageData.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={pageData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="weekLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 600, fill: '#929292' }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={56}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#929292' }}
                  label={{
                    value: 'Score',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 10, fontWeight: 700, fill: '#929292' },
                  }}
                  width={36}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#1E2126"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle cx={cx} cy={cy} r={5} fill={payload.fill} stroke="#fff" strokeWidth={2} />
                    );
                  }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <p className="text-[10px] font-bold text-brand-gray text-center uppercase tracking-widest mt-2 mb-3">
          Weeks
        </p>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-md text-brand-gray hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`min-w-[32px] h-8 px-2 rounded-full text-xs font-bold transition-colors ${
                page === i
                  ? 'bg-brand-orange text-white'
                  : 'text-brand-charcoal hover:bg-brand-light'
              }`}
              aria-label={`Page ${i + 1}`}
              aria-current={page === i ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-md text-brand-gray hover:bg-brand-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InterviewReviewPerformanceChart;
