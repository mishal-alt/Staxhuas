import React, { useEffect, useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const COLUMNS = [
  { key: 'rank', label: 'Rank', sortable: true },
  { key: 'name', label: 'Student', sortable: true },
  { key: 'cohort', label: 'Cohort', sortable: true },
  { key: 'attendance', label: 'Attend.', sortable: true },
  { key: 'interview', label: 'Interview', sortable: true },
  { key: 'scrum', label: 'Scrum', sortable: true },
  { key: 'tasks', label: 'Tasks', sortable: true },
  { key: 'velocity', label: 'Velocity', sortable: true },
  { key: 'project', label: 'Project', sortable: true },
  { key: 'placement', label: 'Placement', sortable: true },
  { key: 'overall', label: 'Overall', sortable: true },
  { key: 'trend', label: 'Trend', sortable: true },
];

const PAGE_SIZE = 8;

const TrendCell = ({ trend }) => {
  if (trend > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[10px] font-bold">
        <TrendingUp size={11} />+{trend}
      </span>
    );
  }
  if (trend < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-600 text-[10px] font-bold">
        <TrendingDown size={11} />{trend}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-brand-gray text-[10px] font-bold">
      <Minus size={11} />0
    </span>
  );
};

const RANK_SORT_MAP = {
  Overall: 'overall',
  Attendance: 'attendance',
  Interviews: 'interview',
  Tasks: 'tasks',
  Consistency: 'scrum',
};

const RankingsTable = ({ students, search, cohortFilter, rankFilter = 'Overall' }) => {
  const [sortKey, setSortKey] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);

  useEffect(() => {
    const key = RANK_SORT_MAP[rankFilter] || 'overall';
    setSortKey(key);
    setSortDir(key === 'rank' ? 'asc' : 'desc');
    setPage(0);
  }, [rankFilter, cohortFilter, search]);

  const filtered = useMemo(() => {
    let list = [...students];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.cohort.toLowerCase().includes(q));
    }
    if (cohortFilter && cohortFilter !== 'All Cohorts') {
      list = list.filter((s) => s.cohort === cohortFilter);
    }
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [students, search, cohortFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'cohort' ? 'asc' : 'desc');
    }
    setPage(0);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronsUpDown size={10} className="opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
  };

  const formatCell = (key, row) => {
    if (key === 'trend') return <TrendCell trend={row.trend} />;
    if (key === 'name') {
      return (
        <div className="flex items-center gap-2 min-w-[140px]">
          <span className="w-7 h-7 rounded-md bg-brand-charcoal text-white text-[10px] font-black flex items-center justify-center shrink-0">
            {row.avatar}
          </span>
          <span className="font-bold text-brand-charcoal text-xs truncate">{row.name}</span>
        </div>
      );
    }
    if (key === 'velocity') return `${row.velocity}x`;
    if (['attendance', 'scrum', 'tasks', 'project', 'placement'].includes(key)) return `${row[key]}%`;
    if (key === 'overall') return <span className="font-black text-brand-charcoal">{row.overall}</span>;
    if (key === 'rank') return <span className="font-black text-brand-gray tabular-nums">#{row.rank}</span>;
    return row[key];
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-brand-light border-b border-gray-200">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-2.5">
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-gray hover:text-brand-charcoal transition-colors"
                    >
                      {col.label}
                      <SortIcon col={col.key} />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-xs text-brand-gray">
                  No students match your filters.
                </td>
              </tr>
            ) : (
              pageData.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-brand-light/60 transition-colors ${
                    i % 2 === 0 ? 'bg-white' : 'bg-brand-light/30'
                  }`}
                >
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-3 py-2.5 text-xs text-brand-charcoal whitespace-nowrap">
                      {formatCell(col.key, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-brand-light/50">
        <span className="text-[10px] font-semibold text-brand-gray">
          Showing {pageData.length ? page * PAGE_SIZE + 1 : 0}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{' '}
          {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 text-[10px] font-bold rounded border border-gray-200 disabled:opacity-40 hover:border-brand-orange/40 transition-colors"
          >
            Prev
          </button>
          <span className="text-[10px] font-bold text-brand-charcoal px-2">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 text-[10px] font-bold rounded border border-gray-200 disabled:opacity-40 hover:border-brand-orange/40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingsTable;
