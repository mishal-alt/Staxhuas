/** Student attendance intelligence seed data */

export const ATTENDANCE_OVERVIEW = {
  percentage: 94,
  streak: 12,
  monthlyRate: 96,
  status: 'Eligible',
  cohort: 'MERN-B1',
  week: 8,
  warnings: 0,
};

export const HEALTH_METRICS = [
  { label: 'Overall Attendance', value: '94%', status: 'strong' },
  { label: 'Monthly Consistency', value: '96%', status: 'strong' },
  { label: 'Late Arrivals', value: '2', status: 'stable' },
  { label: 'Leave Ratio', value: '8%', status: 'stable' },
  { label: 'Attendance Streak', value: '12d', status: 'strong' },
  { label: 'Review Eligibility', value: 'Yes', status: 'strong' },
  { label: 'Interview Eligibility', value: 'Yes', status: 'strong' },
  { label: 'Discipline Score', value: 88, status: 'stable' },
];

export const STATUS_STYLES = {
  present: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  absent: 'bg-red-50 text-red-700 border-red-100',
  leave: 'bg-blue-50 text-blue-700 border-blue-100',
  'half-day': 'bg-amber-50 text-amber-700 border-amber-200',
  late: 'bg-orange-50 text-brand-orange border-brand-orange/30',
  'review-day': 'bg-purple-50 text-purple-700 border-purple-200',
  'interview-day': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

/** Last 28 days for heatmap — status key per day */
export const HEATMAP_DAYS = Array.from({ length: 28 }, (_, i) => {
  const day = 28 - i;
  const statuses = ['present', 'present', 'present', 'late', 'present', 'leave', 'present'];
  const status = i === 5 ? 'absent' : i === 12 ? 'half-day' : i === 18 ? 'leave' : statuses[i % 7];
  return { day: `D${day}`, status, date: `May ${Math.max(1, 30 - i)}` };
});

export const DAILY_LOG = [
  { date: '2026-05-26', checkIn: '09:02', checkOut: '17:45', status: 'present', module: 'React Hooks', scrum: true, facilitator: '—', source: 'Scrum sync', remarks: 'On time' },
  { date: '2026-05-25', checkIn: '09:15', checkOut: '17:30', status: 'late', module: 'React Hooks', scrum: true, facilitator: 'Late 15m noted', source: 'Manual', remarks: 'Traffic delay' },
  { date: '2026-05-24', checkIn: '08:55', checkOut: '17:50', status: 'present', module: 'React Hooks', scrum: true, facilitator: '—', source: 'Scrum sync', remarks: '—' },
  { date: '2026-05-23', checkIn: '—', checkOut: '—', status: 'leave', module: '—', scrum: false, facilitator: 'Approved', source: 'Leave system', remarks: 'Medical leave' },
  { date: '2026-05-22', checkIn: '09:00', checkOut: '17:40', status: 'present', module: 'JavaScript', scrum: true, facilitator: '—', source: 'Scrum sync', remarks: '—' },
  { date: '2026-05-21', checkIn: '09:05', checkOut: '13:00', status: 'half-day', module: 'React', scrum: true, facilitator: 'Half day approved', source: 'Manual', remarks: 'Personal' },
  { date: '2026-05-20', checkIn: '08:58', checkOut: '17:55', status: 'review-day', module: 'Weekly Review', scrum: true, facilitator: 'Present for review', source: 'Review', remarks: 'Review attended' },
  { date: '2026-05-19', checkIn: '09:00', checkOut: '17:30', status: 'present', module: 'React', scrum: true, facilitator: '—', source: 'Scrum sync', remarks: '—' },
  { date: '2026-05-18', checkIn: '10:00', checkOut: '17:00', status: 'interview-day', module: 'Mock Interview', scrum: false, facilitator: 'Interview slot', source: 'Interview', remarks: 'DSA mock' },
  { date: '2026-05-17', checkIn: '—', checkOut: '—', status: 'absent', module: '—', scrum: false, facilitator: 'Follow-up sent', source: 'Auto', remarks: 'No scrum check-in' },
];

export const WEEKLY_TREND = [
  { week: 'W5', rate: 90 },
  { week: 'W6', rate: 92 },
  { week: 'W7', rate: 93 },
  { week: 'W8', rate: 98 },
];

export const RECOVERY_GRAPH = [
  { week: 'W1', rate: 82 },
  { week: 'W2', rate: 85 },
  { week: 'W3', rate: 88 },
  { week: 'W4', rate: 94 },
];

export const ATTENDANCE_VS_REVIEW = [
  { week: 'W5', attendance: 90, review: 7.5 },
  { week: 'W6', attendance: 92, review: 7.8 },
  { week: 'W7', attendance: 93, review: 8.0 },
  { week: 'W8', attendance: 98, review: 8.2 },
];

export const LEAVE_SUMMARY = {
  approved: 3,
  pending: 0,
  rejected: 1,
  emergency: 0,
  balance: 3,
  impact: 'Minimal — within batch limit',
};

export const ALERTS = [
  { type: 'info', text: 'Attendance above 85% threshold — review eligibility maintained' },
  { type: 'warning', text: '2 late arrivals this month — monitor punctuality' },
  { type: 'info', text: 'Interview access enabled — attendance criteria met' },
];

export const FACILITATOR_FEEDBACK = [
  { date: 'May 24', text: 'Excellent recovery after May 17 absence. Maintain scrum punctuality.', author: 'Facilitator John' },
  { date: 'May 20', text: 'Punctuality improved. Half-day properly documented.', author: 'Facilitator John' },
  { date: 'May 15', text: 'Discipline note: ensure leave requests submitted 24h in advance.', author: 'Facilitator John' },
];

export const ACHIEVEMENTS = [
  { title: '12-Day Streak', metric: 'Active', type: 'streak' },
  { title: '98% Week 8', metric: 'Top cohort', type: 'weekly' },
  { title: 'Recovery Excellence', metric: '+12% from W1', type: 'recovery' },
  { title: 'Review Eligible', metric: 'Maintained', type: 'eligibility' },
];

export const HEATMAP_COLORS = {
  present: '#2e7d32',
  absent: '#d32f2f',
  leave: '#1976d2',
  'half-day': '#ed6c02',
  late: '#e8391d',
  'review-day': '#7b1fa2',
  'interview-day': '#3949ab',
};
