/** Operational seed data for student intelligence dashboard */

export const METRICS = [
  { id: 'attendance', label: 'Attendance Ratio', value: '92%', trend: '+3.2%', trendUp: true, status: 'strong', insight: 'Above cohort average', spark: [88, 89, 90, 91, 91, 92, 92] },
  { id: 'interview', label: 'Interview Performance', value: '8.5', unit: '/10', trend: '+0.4', trendUp: true, status: 'strong', insight: 'Consistent upward trend', spark: [7.2, 7.8, 8.0, 8.2, 8.3, 8.4, 8.5] },
  { id: 'scrum', label: 'Scrum Consistency', value: '94%', trend: '+1.1%', trendUp: true, status: 'stable', insight: '12-day active streak', spark: [90, 91, 92, 93, 93, 94, 94] },
  { id: 'tasks', label: 'Task Completion', value: '87%', trend: '-2.0%', trendUp: false, status: 'watch', insight: '2 tasks due tomorrow', spark: [92, 91, 90, 89, 88, 87, 87] },
  { id: 'leave', label: 'Leave Balance', value: '3', unit: 'days', trend: '—', trendUp: null, status: 'stable', insight: 'Within batch limit', spark: [5, 5, 4, 4, 4, 3, 3] },
  { id: 'velocity', label: 'Module Velocity', value: '1.2x', trend: '+8%', trendUp: true, status: 'strong', insight: 'Ahead of schedule', spark: [0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2] },
  { id: 'rank', label: 'Academic Rank', value: '#4', unit: '/32', trend: '+2', trendUp: true, status: 'strong', insight: 'Top 12% of cohort', spark: [8, 7, 7, 6, 5, 5, 4] },
  { id: 'placement', label: 'Placement Readiness', value: '72%', trend: '+5%', trendUp: true, status: 'growing', insight: 'Mock interviews pending', spark: [58, 62, 65, 67, 69, 71, 72] },
];

export const TODAY_OPERATIONS = [
  { type: 'interview', title: 'Technical Interview #3', time: '10:00 AM', status: 'scheduled', priority: 'high' },
  { type: 'task', title: 'React Hooks Assignment', time: 'Due Tomorrow', status: 'pending', priority: 'high' },
  { type: 'scrum', title: 'Daily Scrum Call', time: '9:30 AM', status: 'upcoming', priority: 'medium' },
  { type: 'deadline', title: 'CSS Grid Lab Submission', time: 'May 28', status: 'pending', priority: 'medium' },
  { type: 'mentor', title: 'Facilitator Check-in', time: '3:00 PM', status: 'scheduled', priority: 'low' },
  { type: 'attendance', title: 'Mark attendance reminder', time: 'Before 6 PM', status: 'action', priority: 'medium' },
];

export const FEEDBACK_ITEMS = [
  { reviewer: 'Facilitator John', role: 'Academic Facilitator', type: 'facilitator', score: 8, maxScore: 10, date: 'May 24', text: 'Great understanding of React hooks. Need to work more on CSS Grid layouts.', tags: ['React', 'CSS'], strengths: ['Hooks', 'Component design'], improvements: ['CSS Grid', 'Responsive layouts'] },
  { reviewer: 'Interviewer Sarah', role: 'Technical Interviewer', type: 'interview', score: 7.5, maxScore: 10, date: 'May 20', text: 'Solid problem-solving approach. Improve time complexity explanations.', tags: ['DSA', 'Communication'], strengths: ['Logic', 'Debugging'], improvements: ['Big-O analysis', 'Verbal clarity'] },
  { reviewer: 'System', role: 'Academic Recommendation', type: 'recommendation', score: null, maxScore: null, date: 'May 22', text: 'Complete Module 4 assessment before scheduling next re-interview.', tags: ['Module 4'], strengths: [], improvements: ['Assessment completion'] },
];

export const MODULE_JOURNEY = {
  current: { name: 'React & State Management', week: 8, progress: 68 },
  completed: ['HTML/CSS Foundations', 'JavaScript Core', 'DOM & APIs'],
  upcoming: ['Redux Toolkit', 'Node.js Backend', 'Deployment & DevOps'],
  certification: 45,
  stack: [
    { name: 'HTML/CSS', pct: 100 },
    { name: 'JavaScript', pct: 95 },
    { name: 'React', pct: 68 },
    { name: 'Node.js', pct: 0 },
    { name: 'MongoDB', pct: 0 },
  ],
  deploymentReadiness: 35,
};

export const TASK_RESOURCES = [
  { title: 'React Hooks Assignment', type: 'assignment', status: 'in_progress', due: 'May 27' },
  { title: 'Portfolio Project v2', type: 'submission', status: 'pending', due: 'Jun 02' },
  { title: 'Module 4 Cheat Sheet', type: 'resource', status: 'available', due: null },
  { title: 'CSS Grid Challenge', type: 'challenge', status: 'pending', due: 'May 28' },
  { title: 'staxhaus-lab-repo', type: 'github', status: 'review', due: null },
  { title: 'Code Review Request #12', type: 'review', status: 'open', due: 'May 26' },
];

export const LEADERBOARD = {
  rank: 4,
  cohortSize: 32,
  percentile: 88,
  metrics: [
    { label: 'Attendance Rank', value: '#3', pct: 91 },
    { label: 'Interview Rank', value: '#5', pct: 84 },
    { label: 'Consistency Rank', value: '#2', pct: 94 },
    { label: 'Coding Activity', value: '#6', pct: 81 },
  ],
};

export const PLACEMENT_PANEL = [
  { label: 'Mock Interview Readiness', value: 68, max: 100 },
  { label: 'Resume Completion', value: 85, max: 100 },
  { label: 'GitHub Activity', value: 72, max: 100 },
  { label: 'Project Readiness', value: 60, max: 100 },
  { label: 'Deployment Score', value: 35, max: 100 },
  { label: 'Communication Rating', value: 78, max: 100 },
];

export const SMART_INSIGHTS = [
  { type: 'positive', text: 'Attendance improved by 8% this month' },
  { type: 'warning', text: '2 pending tasks due tomorrow' },
  { type: 'positive', text: 'You are in top 12% of your cohort' },
  { type: 'positive', text: 'Interview consistency is improving' },
  { type: 'info', text: 'React module nearing completion — 68% done' },
];

export const ATTENDANCE_TREND = [
  { week: 'W1', rate: 88 },
  { week: 'W2', rate: 90 },
  { week: 'W3', rate: 89 },
  { week: 'W4', rate: 91 },
  { week: 'W5', rate: 92 },
  { week: 'W6', rate: 93 },
  { week: 'W7', rate: 92 },
];

export const INTERVIEW_SCORES = [
  { module: 'M1', score: 7.2 },
  { module: 'M2', score: 7.8 },
  { module: 'M3', score: 8.0 },
  { module: 'M4', score: 8.5 },
];

export const WEEKLY_CONSISTENCY = [
  { day: 'Mon', scrum: 1, tasks: 3 },
  { day: 'Tue', scrum: 1, tasks: 2 },
  { day: 'Wed', scrum: 1, tasks: 4 },
  { day: 'Thu', scrum: 1, tasks: 3 },
  { day: 'Fri', scrum: 1, tasks: 2 },
];

export const TASK_HEATMAP = [
  { week: 'W1', completed: 4, total: 5 },
  { week: 'W2', completed: 5, total: 5 },
  { week: 'W3', completed: 4, total: 6 },
  { week: 'W4', completed: 5, total: 5 },
  { week: 'W5', completed: 3, total: 5 },
  { week: 'W6', completed: 4, total: 5 },
];

export const MODULE_PROGRESS = [
  { module: 'HTML/CSS', progress: 100 },
  { module: 'JavaScript', progress: 95 },
  { module: 'React', progress: 68 },
  { module: 'Redux', progress: 0 },
  { module: 'Node.js', progress: 0 },
];

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getAcademicHealth = (attendance = 92, interview = 8.5, tasks = 87) => {
  const score = Math.round((attendance * 0.35 + (interview / 10) * 100 * 0.35 + tasks * 0.3));
  if (score >= 85) return { score, label: 'Excellent', color: 'emerald' };
  if (score >= 70) return { score, label: 'Good Standing', color: 'blue' };
  if (score >= 55) return { score, label: 'Needs Attention', color: 'amber' };
  return { score, label: 'At Risk', color: 'red' };
};
