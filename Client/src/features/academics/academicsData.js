/** Academic intelligence seed data */

export const ACTIVE_MODULE = {
  title: 'React & State Management',
  code: 'MOD-04-REACT',
  facilitator: 'Facilitator John',
  week: 8,
  totalWeeks: 12,
  sprintProgress: 68,
  nextReview: '2026-06-02',
  reviewType: 'Module Checkpoint',
  githubStatus: 'active',
  projectStatus: 'in_review',
  cohortProgress: 72,
  healthScore: 84,
  timeline: [
    { phase: 'Foundations', status: 'done' },
    { phase: 'Hooks', status: 'active' },
    { phase: 'State Patterns', status: 'upcoming' },
    { phase: 'Assessment', status: 'upcoming' },
  ],
};

export const HEALTH_METRICS = [
  { id: 'attendance', label: 'Attendance Stability', value: 94, trend: '+2%', status: 'strong' },
  { id: 'tasks', label: 'Task Execution', value: 87, trend: '-1%', status: 'stable' },
  { id: 'reviews', label: 'Review Consistency', value: 82, trend: '+4%', status: 'growing' },
  { id: 'scrum', label: 'Scrum Participation', value: 96, trend: '+1%', status: 'strong' },
  { id: 'discipline', label: 'Discipline Index', value: 88, trend: '0%', status: 'stable' },
  { id: 'placement', label: 'Placement Readiness', value: 72, trend: '+5%', status: 'growing' },
  { id: 'technical', label: 'Technical Growth', value: 79, trend: '+6%', status: 'growing' },
  { id: 'collab', label: 'Collaboration Score', value: 85, trend: '+2%', status: 'strong' },
];

export const REVIEWS = [
  {
    id: 'r1',
    week: 'Week 8',
    type: 'Weekly Review',
    status: 'completed',
    score: 8.2,
    evaluator: 'Facilitator John',
    trend: 'up',
    date: '2026-05-24',
    strengths: ['React hooks implementation', 'Component composition', 'Code readability'],
    weaknesses: ['CSS Grid layouts', 'Performance optimization'],
    breakdown: { technical: 8.0, professional: 8.5, attendance: 9.0 },
    notes: 'Strong progress on hooks. Focus on layout systems before next checkpoint.',
    suggestions: ['Complete CSS Grid lab', 'Review useMemo/useCallback patterns'],
    technicalFeedback: 'Custom hooks are well-structured. Missing error boundaries in async flows.',
    attendanceImpact: 'Positive — 98% this week',
    academicTrend: 'Improving (+0.4 vs last week)',
  },
  {
    id: 'r2',
    week: 'Week 7',
    type: 'Weekly Review',
    status: 'completed',
    score: 7.8,
    evaluator: 'Facilitator John',
    trend: 'up',
    date: '2026-05-17',
    strengths: ['Problem solving', 'Debugging approach'],
    weaknesses: ['Time management on tasks', 'Verbal explanations'],
    breakdown: { technical: 7.5, professional: 8.0, attendance: 9.2 },
    notes: 'Good week overall. Improve explanation of logic during reviews.',
    suggestions: ['Practice Big-O explanations', 'Submit tasks earlier'],
    technicalFeedback: 'Solid DOM manipulation. React transition needs more practice.',
    attendanceImpact: 'Neutral',
    academicTrend: 'Stable',
  },
  {
    id: 'r3',
    week: 'Week 6',
    type: 'Module Checkpoint',
    status: 'completed',
    score: 8.5,
    evaluator: 'Facilitator John',
    trend: 'up',
    date: '2026-05-10',
    strengths: ['JavaScript fundamentals', 'API integration basics'],
    weaknesses: ['Async error handling'],
    breakdown: { technical: 8.5, professional: 8.5, attendance: 8.8 },
    notes: 'Passed module checkpoint. Cleared for React module.',
    suggestions: ['Begin React pre-reading'],
    technicalFeedback: 'Excellent fetch/axios usage. Add try/catch consistently.',
    attendanceImpact: 'Positive',
    academicTrend: 'Improving',
  },
  {
    id: 'r4',
    week: 'Week 5',
    type: 'Project Review',
    status: 'completed',
    score: 7.2,
    evaluator: 'Facilitator John',
    trend: 'down',
    date: '2026-05-03',
    strengths: ['Team collaboration', 'Git workflow'],
    weaknesses: ['Project scope management', 'UI polish'],
    breakdown: { technical: 7.0, professional: 7.5, attendance: 8.5 },
    notes: 'Project delivered late. Quality acceptable but needs refinement.',
    suggestions: ['Break tasks into smaller PRs', 'Use design checklist'],
    technicalFeedback: 'Merge conflicts handled well. Component structure needs refactoring.',
    attendanceImpact: 'Neutral',
    academicTrend: 'Slight decline',
  },
  {
    id: 'r5',
    week: 'Week 4',
    type: 'Mock Interview',
    status: 'completed',
    score: 7.5,
    evaluator: 'Interviewer Sarah',
    trend: 'up',
    date: '2026-04-26',
    strengths: ['Logical approach', 'Calm under pressure'],
    weaknesses: ['Time complexity analysis', 'Communication clarity'],
    breakdown: { technical: 7.0, professional: 8.0, attendance: null },
    notes: 'Promising performance. Schedule follow-up for DSA depth.',
    suggestions: ['Complete DSA sheet Week 4-5', 'Record mock answers'],
    technicalFeedback: 'Solved medium problems. Struggled with optimization discussion.',
    attendanceImpact: 'N/A',
    academicTrend: 'Improving',
  },
  {
    id: 'r6',
    week: 'Week 9',
    type: 'Weekly Review',
    status: 'scheduled',
    score: null,
    evaluator: 'Facilitator John',
    trend: null,
    date: '2026-05-31',
    strengths: [],
    weaknesses: [],
    breakdown: null,
    notes: 'Scheduled — complete Module 4 assessment beforehand.',
    suggestions: [],
    technicalFeedback: null,
    attendanceImpact: null,
    academicTrend: null,
  },
];

export const TECHNICAL_METRICS = [
  { label: 'Coding Quality', score: 82 },
  { label: 'Logic Building', score: 85 },
  { label: 'React Understanding', score: 78 },
  { label: 'API Handling', score: 80 },
  { label: 'Database Concepts', score: 72 },
];

export const PROFESSIONAL_METRICS = [
  { label: 'Attendance', score: 94 },
  { label: 'Communication', score: 76 },
  { label: 'Consistency', score: 88 },
  { label: 'Collaboration', score: 85 },
  { label: 'Discipline', score: 88 },
];

export const WEEKLY_SCORES = [
  { week: 'W1', score: 7.2 },
  { week: 'W2', score: 7.5 },
  { week: 'W3', score: 7.8 },
  { week: 'W4', score: 7.2 },
  { week: 'W5', score: 7.5 },
  { week: 'W6', score: 8.5 },
  { week: 'W7', score: 7.8 },
  { week: 'W8', score: 8.2 },
];

export const ATTENDANCE_TREND = [
  { week: 'W5', rate: 90 },
  { week: 'W6', rate: 92 },
  { week: 'W7', rate: 93 },
  { week: 'W8', rate: 98 },
];

export const MODULE_PERFORMANCE = [
  { module: 'M1', score: 85 },
  { module: 'M2', score: 80 },
  { module: 'M3', score: 80 },
  { module: 'M4', score: 76 },
];

export const TECHNICAL_GROWTH = [
  { week: 'W5', index: 68 },
  { week: 'W6', index: 72 },
  { week: 'W7', index: 76 },
  { week: 'W8', index: 79 },
];

export const INTERVIEW_READINESS = [
  { week: 'W5', score: 55 },
  { week: 'W6', score: 60 },
  { week: 'W7', score: 65 },
  { week: 'W8', score: 72 },
];

export const PRODUCTIVITY_EVOLUTION = [
  { week: 'W5', score: 75 },
  { week: 'W6', score: 78 },
  { week: 'W7', score: 80 },
  { week: 'W8', score: 82 },
];

export const FACILITATOR_FEEDBACK = [
  { type: 'comment', date: 'May 24', text: 'Excellent improvement in React hooks. Prioritize CSS Grid before checkpoint.', author: 'Facilitator John' },
  { type: 'advice', date: 'May 20', text: 'Submit assignments 24h before deadline to allow review buffer.', author: 'Facilitator John' },
  { type: 'recommendation', date: 'May 18', text: 'Schedule mock interview with placement cell after Module 4 assessment.', author: 'Placement Mentor' },
  { type: 'blocker', date: 'May 15', text: 'API integration project blocked until assessment cleared.', author: 'Facilitator John' },
  { type: 'sprint', date: 'May 12', text: 'Sprint 3 velocity below cohort average — increase daily commits.', author: 'Facilitator John' },
  { type: 'placement', date: 'May 10', text: 'Resume v2 approved. Begin LinkedIn optimization tasks.', author: 'Placement Mentor' },
];

export const GROWTH_TRACKER = [
  { metric: 'Academic Growth', value: '+12%', period: '8 weeks', status: 'improving' },
  { metric: 'Technical Growth', value: '+16%', period: '8 weeks', status: 'improving' },
  { metric: 'Score Improvement', value: '+1.0', period: 'avg weekly', status: 'improving' },
  { metric: 'Attendance Recovery', value: '98%', period: 'current', status: 'strong' },
  { metric: 'Weekly Consistency', value: '91%', period: '4-week avg', status: 'stable' },
  { metric: 'Module Velocity', value: '1.2x', period: 'cohort', status: 'ahead' },
];

export const UPCOMING_EVENTS = [
  { title: 'Week 9 Weekly Review', date: 'May 31', type: 'Review', priority: 'high' },
  { title: 'Module 4 Assessment', date: 'Jun 02', type: 'Evaluation', priority: 'critical' },
  { title: 'Mock Interview — DSA', date: 'Jun 05', type: 'Interview', priority: 'high' },
  { title: 'Project Presentation', date: 'Jun 08', type: 'Presentation', priority: 'medium' },
  { title: 'Placement Workshop', date: 'Jun 12', type: 'Placement', priority: 'medium' },
];

export const STANDING = {
  label: 'Good Standing',
  rank: 4,
  cohortSize: 32,
  cycle: 'Evaluation Cycle 2',
  readiness: 78,
};

/** Score tier for interview / review performance bars */
export const PERFORMANCE_TIERS = {
  good: { label: 'Good', color: '#2e7d32' },
  average: { label: 'Average', color: '#ed6c02' },
  belowAverage: { label: 'Below Average', color: '#e8391d' },
  weekBack: { label: 'WeekBack', color: '#d32f2f' },
};

export const getPerformanceTier = (score, isWeekBack = false) => {
  if (isWeekBack || score < 60) return { key: 'weekBack', ...PERFORMANCE_TIERS.weekBack };
  if (score >= 80) return { key: 'good', ...PERFORMANCE_TIERS.good };
  if (score >= 70) return { key: 'average', ...PERFORMANCE_TIERS.average };
  if (score >= 60) return { key: 'belowAverage', ...PERFORMANCE_TIERS.belowAverage };
  return { key: 'weekBack', ...PERFORMANCE_TIERS.weekBack };
};

/** 30 coding interview review scores (newest first) — 3 pages × 10 */
export const CODING_INTERVIEW_REVIEWS = [
  { weekLabel: 'Week 24 WB 1', score: 71, isWeekBack: true },
  { weekLabel: 'Week 23', score: 70, isWeekBack: false },
  { weekLabel: 'Week 22', score: 83, isWeekBack: false },
  { weekLabel: 'Week 21', score: 80, isWeekBack: false },
  { weekLabel: 'Week 20', score: 80, isWeekBack: false },
  { weekLabel: 'Week 19', score: 80, isWeekBack: false },
  { weekLabel: 'Week 18', score: 72, isWeekBack: false },
  { weekLabel: 'Week 17', score: 80, isWeekBack: false },
  { weekLabel: 'Week 17 WB 1', score: 59, isWeekBack: true },
  { weekLabel: 'Week 16', score: 76, isWeekBack: false },
  { weekLabel: 'Week 15', score: 82, isWeekBack: false },
  { weekLabel: 'Week 14', score: 78, isWeekBack: false },
  { weekLabel: 'Week 13 WB 1', score: 58, isWeekBack: true },
  { weekLabel: 'Week 12', score: 85, isWeekBack: false },
  { weekLabel: 'Week 11', score: 79, isWeekBack: false },
  { weekLabel: 'Week 10', score: 74, isWeekBack: false },
  { weekLabel: 'Week 9', score: 81, isWeekBack: false },
  { weekLabel: 'Week 8', score: 77, isWeekBack: false },
  { weekLabel: 'Week 7 WB 1', score: 62, isWeekBack: true },
  { weekLabel: 'Week 6', score: 88, isWeekBack: false },
  { weekLabel: 'Week 5', score: 75, isWeekBack: false },
  { weekLabel: 'Week 4', score: 80, isWeekBack: false },
  { weekLabel: 'Week 3', score: 73, isWeekBack: false },
  { weekLabel: 'Week 2', score: 84, isWeekBack: false },
  { weekLabel: 'Week 1', score: 68, isWeekBack: false },
  { weekLabel: 'Week 0', score: 79, isWeekBack: false },
  { weekLabel: 'Week -1', score: 82, isWeekBack: false },
  { weekLabel: 'Week -2 WB 1', score: 55, isWeekBack: true },
  { weekLabel: 'Week -3', score: 71, isWeekBack: false },
  { weekLabel: 'Week -4', score: 86, isWeekBack: false },
].map((entry, index) => {
  const tier = getPerformanceTier(entry.score, entry.isWeekBack);
  return {
    id: `ci-${index}`,
    weekLabel: entry.weekLabel,
    score: entry.score,
    isWeekBack: entry.isWeekBack,
    tier: tier.label,
    fill: tier.color,
  };
});
