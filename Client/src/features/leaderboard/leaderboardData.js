/** Institutional ranking seed data */

export const COHORTS = ['All Cohorts', 'MERN-B1', 'MERN-B2', 'FSD-2026', 'B-3'];
export const TIMEFRAMES = ['This Week', 'This Month', 'All Time'];
export const RANK_FILTERS = ['Overall', 'Attendance', 'Interviews', 'Tasks', 'Consistency'];

const baseStudents = [
  { id: 1, name: 'Suhail Ahmed', cohort: 'MERN-B1', avatar: 'SA', attendance: 98, interview: 9.2, scrum: 96, tasks: 94, velocity: 1.3, project: 88, placement: 82, overall: 94.2, trend: 2, streak: 18, github: 92, badge: 'Elite' },
  { id: 2, name: 'Fathima Z', cohort: 'MERN-B2', avatar: 'FZ', attendance: 96, interview: 8.9, scrum: 94, tasks: 91, velocity: 1.2, project: 85, placement: 78, overall: 91.8, trend: 1, streak: 14, github: 88, badge: 'Elite' },
  { id: 3, name: 'Hrithic Raj', cohort: 'FSD-2026', avatar: 'HR', attendance: 95, interview: 8.7, scrum: 93, tasks: 89, velocity: 1.1, project: 84, placement: 76, overall: 89.5, trend: -1, streak: 12, github: 86, badge: 'Pro' },
  { id: 4, name: 'Sneha Kapoor', cohort: 'MERN-B1', avatar: 'SK', attendance: 94, interview: 8.5, scrum: 92, tasks: 88, velocity: 1.1, project: 82, placement: 74, overall: 87.8, trend: 3, streak: 11, github: 84, badge: 'Pro' },
  { id: 5, name: 'Arjun V', cohort: 'B-3', avatar: 'AV', attendance: 93, interview: 8.4, scrum: 91, tasks: 87, velocity: 1.0, project: 80, placement: 72, overall: 86.4, trend: 0, streak: 10, github: 82, badge: 'Pro' },
  { id: 6, name: 'Mohammad Mishal', cohort: 'MERN-B2', avatar: 'MM', attendance: 92, interview: 8.2, scrum: 90, tasks: 85, velocity: 1.0, project: 78, placement: 70, overall: 84.9, trend: -2, streak: 9, github: 80, badge: 'Rising' },
  { id: 7, name: 'Akhil Nair', cohort: 'FSD-2026', avatar: 'AN', attendance: 91, interview: 8.1, scrum: 89, tasks: 84, velocity: 0.95, project: 77, placement: 68, overall: 83.6, trend: 4, streak: 8, github: 79, badge: 'Rising' },
  { id: 8, name: 'Priya Menon', cohort: 'MERN-B1', avatar: 'PM', attendance: 90, interview: 8.0, scrum: 88, tasks: 83, velocity: 0.9, project: 76, placement: 67, overall: 82.4, trend: 1, streak: 7, github: 77, badge: 'Rising' },
  { id: 9, name: 'Rahul Das', cohort: 'B-3', avatar: 'RD', attendance: 89, interview: 7.9, scrum: 87, tasks: 82, velocity: 0.9, project: 75, placement: 65, overall: 81.2, trend: -1, streak: 6, github: 75, badge: 'Stable' },
  { id: 10, name: 'Ananya Iyer', cohort: 'MERN-B2', avatar: 'AI', attendance: 88, interview: 7.8, scrum: 86, tasks: 81, velocity: 0.85, project: 74, placement: 64, overall: 80.1, trend: 2, streak: 6, github: 74, badge: 'Stable' },
  { id: 11, name: 'Vishnu K', cohort: 'FSD-2026', avatar: 'VK', attendance: 87, interview: 7.7, scrum: 85, tasks: 80, velocity: 0.85, project: 72, placement: 62, overall: 79.0, trend: 0, streak: 5, github: 72, badge: 'Stable' },
  { id: 12, name: 'Meera Thomas', cohort: 'MERN-B1', avatar: 'MT', attendance: 86, interview: 7.6, scrum: 84, tasks: 79, velocity: 0.8, project: 71, placement: 60, overall: 77.8, trend: -3, streak: 5, github: 70, badge: 'Stable' },
  { id: 13, name: 'Adil Khan', cohort: 'B-3', avatar: 'AK', attendance: 85, interview: 7.5, scrum: 83, tasks: 78, velocity: 0.8, project: 70, placement: 58, overall: 76.5, trend: 1, streak: 4, github: 68, badge: 'Watch' },
  { id: 14, name: 'Deepa R', cohort: 'MERN-B2', avatar: 'DR', attendance: 84, interview: 7.4, scrum: 82, tasks: 77, velocity: 0.75, project: 68, placement: 56, overall: 75.2, trend: 2, streak: 4, github: 66, badge: 'Watch' },
  { id: 15, name: 'Nikhil P', cohort: 'FSD-2026', avatar: 'NP', attendance: 83, interview: 7.3, scrum: 81, tasks: 76, velocity: 0.75, project: 67, placement: 55, overall: 74.0, trend: -1, streak: 3, github: 65, badge: 'Watch' },
];

export const STUDENTS = baseStudents.map((s, i) => ({ ...s, rank: i + 1 }));

export const COHORT_COMPARISON = [
  { cohort: 'MERN-B1', score: 88.4 },
  { cohort: 'MERN-B2', score: 85.2 },
  { cohort: 'FSD-2026', score: 84.1 },
  { cohort: 'B-3', score: 81.6 },
];

export const WEEKLY_GROWTH = [
  { week: 'W1', avg: 78 },
  { week: 'W2', avg: 80 },
  { week: 'W3', avg: 82 },
  { week: 'W4', avg: 84 },
  { week: 'W5', avg: 85 },
  { week: 'W6', avg: 87 },
];

export const ATTENDANCE_LEADERS = [
  { name: 'Suhail', rate: 98 },
  { name: 'Fathima', rate: 96 },
  { name: 'Hrithic', rate: 95 },
  { name: 'Sneha', rate: 94 },
  { name: 'Arjun', rate: 93 },
];

export const INTERVIEW_EXCELLENCE = [
  { name: 'Suhail', score: 9.2 },
  { name: 'Fathima', score: 8.9 },
  { name: 'Hrithic', score: 8.7 },
  { name: 'Sneha', score: 8.5 },
  { name: 'Arjun', score: 8.4 },
];

export const SCRUM_RANKING = [
  { name: 'Suhail', score: 96 },
  { name: 'Fathima', score: 94 },
  { name: 'Hrithic', score: 93 },
  { name: 'Sneha', score: 92 },
  { name: 'Arjun', score: 91 },
];

export const CODING_PRODUCTIVITY = [
  { name: 'Suhail', commits: 142 },
  { name: 'Akhil', commits: 128 },
  { name: 'Fathima', commits: 119 },
  { name: 'Sneha', commits: 105 },
  { name: 'Hrithic', commits: 98 },
];

export const ACHIEVEMENTS = [
  { title: 'Fastest Learner', recipient: 'Akhil Nair', metric: '+4 ranks this month', icon: 'zap' },
  { title: 'Highest Attendance', recipient: 'Suhail Ahmed', metric: '98% consistency', icon: 'calendar' },
  { title: 'Best Interviewer', recipient: 'Suhail Ahmed', metric: '9.2 avg score', icon: 'mic' },
  { title: 'Best Consistency', recipient: 'Suhail Ahmed', metric: '18-day streak', icon: 'flame' },
  { title: 'Deployment Champion', recipient: 'Fathima Z', metric: '4 live deployments', icon: 'rocket' },
  { title: 'Collaboration Leader', recipient: 'Sneha Kapoor', metric: '12 peer reviews', icon: 'users' },
];

export const GROWTH_TRACKER = [
  { student: 'Akhil Nair', rankDelta: '+4', scoreDelta: '+6.2', weekly: '+2.1%', module: 'React Hooks', stability: 'Improving' },
  { student: 'Sneha Kapoor', rankDelta: '+3', scoreDelta: '+4.8', weekly: '+1.8%', module: 'State Mgmt', stability: 'Stable' },
  { student: 'Suhail Ahmed', rankDelta: '+2', scoreDelta: '+3.1', weekly: '+1.2%', module: 'Redux', stability: 'Elite' },
  { student: 'Mohammad Mishal', rankDelta: '-2', scoreDelta: '-1.4', weekly: '-0.6%', module: 'CSS Grid', stability: 'Declining' },
];

export const LIVE_FEED = [
  { time: '2m ago', text: 'Akhil Nair moved to Rank #7', type: 'rank' },
  { time: '8m ago', text: 'MERN-B2 topped attendance this week', type: 'cohort' },
  { time: '15m ago', text: 'React module leaderboard updated', type: 'module' },
  { time: '22m ago', text: 'Interview scores synced for FSD-2026', type: 'sync' },
  { time: '35m ago', text: '3 students achieved elite consistency status', type: 'achievement' },
  { time: '1h ago', text: 'Suhail Ahmed retained #1 overall position', type: 'rank' },
];

export const OVERVIEW_STATS = {
  totalStudents: 32,
  activeCohorts: 4,
  avgScore: 84.6,
  topPercentile: 12,
};
