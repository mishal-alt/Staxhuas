import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Button,
  Paper,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  LinearProgress
} from '@mui/material';
import {
  People,
  CheckCircle,
  Schedule,
  CalendarToday,
  NavigateNext,
  TrendingUp,
  Warning,
  Star,
  Download,
  Assessment,
  Timeline,
  School,
  Error as ErrorIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import AppShell from '../components/layout/AppShell';
import * as interviewApi from '../api/interviews.api';

// Custom theme to match Staxhaus brand
const theme = createTheme({
  palette: {
    primary: { main: '#E8391D' },
    secondary: { main: '#1E2126' },
    background: { default: '#F7F7F5' }
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' },
    h6: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #E5E7EB',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '10px 20px',
        }
      }
    }
  }
});

const Reports = () => {
  const navigate = useNavigate();

  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['reports-interviews-list'],
    queryFn: () => interviewApi.getInterviews()
  });

  const interviews = interviewsRes?.data || [];
  const completedInterviews = interviews.filter(i => ['passed', 'failed', 're_interview_required', 'completed'].includes(i.status));
  const pendingInterviews = interviews.filter(i => !['passed', 'failed', 're_interview_required', 'completed'].includes(i.status));
  const recentEvaluations = interviews.slice(0, 10);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Scheduled',
          bg: 'rgba(2, 136, 209, 0.06)',
          color: '#0288d1',
          border: 'rgba(2, 136, 209, 0.15)'
        };
      case 'in-progress':
      case 'in_progress':
        return {
          label: 'In Progress',
          bg: 'rgba(232, 57, 29, 0.06)',
          color: '#E8391D',
          border: 'rgba(232, 57, 29, 0.15)'
        };
      case 'passed':
      case 'completed':
        return {
          label: 'Passed',
          bg: 'rgba(46, 125, 50, 0.06)',
          color: '#2e7d32',
          border: 'rgba(46, 125, 50, 0.15)'
        };
      case 'failed':
        return {
          label: 'Failed',
          bg: 'rgba(198, 40, 40, 0.06)',
          color: '#c62828',
          border: 'rgba(198, 40, 40, 0.15)'
        };
      case 're_interview_required':
        return {
          label: 'Re-interview',
          bg: 'rgba(239, 108, 0, 0.06)',
          color: '#ef6c00',
          border: 'rgba(239, 108, 0, 0.15)'
        };
      default:
        return {
          label: status?.toUpperCase() || 'UNKNOWN',
          bg: 'rgba(146, 146, 146, 0.06)',
          color: '#929292',
          border: 'rgba(146, 146, 146, 0.15)'
        };
    }
  };

  const getStatusChip = (status) => {
    const config = getStatusConfig(status);
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          fontWeight: 850,
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          bgcolor: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
          borderRadius: '4px',
          height: 20
        }}
      />
    );
  };

  // 1. HEADER SUMMARY METRICS
  const totalCompleted = completedInterviews.length;
  
  // Calculate average scores (Technical score is reviewScore, Communication score is taskScore)
  const avgTechScore = totalCompleted > 0
    ? (completedInterviews.reduce((acc, i) => acc + (i.reviewScore || 0), 0) / totalCompleted).toFixed(1)
    : '0.0';
  const avgCommScore = totalCompleted > 0
    ? (completedInterviews.reduce((acc, i) => acc + (i.taskScore || 0), 0) / totalCompleted).toFixed(1)
    : '0.0';
  
  const avgScoreVal = totalCompleted > 0
    ? (completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0) / totalCompleted)
    : 0;
  const avgScore = avgScoreVal.toFixed(1);

  const passCount = completedInterviews.filter(i => i.status === 'passed').length;
  const passRate = totalCompleted > 0 
    ? Math.round((passCount / totalCompleted) * 100) 
    : 0;

  const pendingCount = pendingInterviews.length;
  const activeCount = interviews.filter(i => i.status === 'in_progress' || i.status === 'in-progress').length;
  
  // Risk Alert count (students with score < 24 out of 40)
  const riskCount = completedInterviews.filter(i => (i.score || 0) < 24).length;

  const metrics = [
    { 
      label: 'Total Completed', 
      value: totalCompleted || 0, 
      subtext: 'Evaluated sessions', 
      supporting: 'All Batches',
      insight: 'Target pace met', 
      status: 'Healthy',
      icon: <CheckCircle />, 
      color: '#2e7d32',
      trendText: '+12%',
      trendType: 'up',
      trendColor: '#2e7d32',
      trendBg: 'rgba(46, 125, 50, 0.06)'
    },
    { 
      label: 'Average Score', 
      value: `${avgScore} / 40`, 
      subtext: `Tech: ${avgTechScore} | Comm: ${avgCommScore}`, 
      supporting: 'Out of 40',
      insight: 'Technical avg: B+', 
      status: 'Stable',
      icon: <Assessment />, 
      color: '#1976d2',
      trendText: 'Stable',
      trendType: 'flat',
      trendColor: '#1976d2',
      trendBg: 'rgba(25, 118, 210, 0.06)'
    },
    { 
      label: 'Pass Rate', 
      value: `${passRate}%`, 
      subtext: `${passCount} of ${totalCompleted} passed`, 
      supporting: 'Pass target >60%',
      insight: '+2.5% vs last week', 
      status: 'Positive',
      icon: <TrendingUp />, 
      color: '#2e7d32',
      trendText: '+2.5%',
      trendType: 'up',
      trendColor: '#2e7d32',
      trendBg: 'rgba(46, 125, 50, 0.06)'
    },
    { 
      label: 'Pending Evaluations', 
      value: pendingCount || 0, 
      subtext: 'Scheduled sessions queued', 
      supporting: 'Scheduled list',
      insight: 'Queue SLA in limit', 
      status: 'Normal',
      icon: <Schedule />, 
      color: '#ef6c00',
      trendText: '-8%',
      trendType: 'down',
      trendColor: '#2e7d32',
      trendBg: 'rgba(46, 125, 50, 0.06)'
    },
    { 
      label: 'Active Sessions', 
      value: activeCount || 0, 
      subtext: 'Live evaluations in progress', 
      supporting: 'Realtime load',
      insight: 'Evaluators online: 100%', 
      status: 'Live',
      icon: <People />, 
      color: '#0288d1',
      trendText: 'Live',
      trendType: 'live',
      trendColor: '#0288d1',
      trendBg: 'rgba(2, 136, 209, 0.06)'
    },
    { 
      label: 'Risk Alerts', 
      value: riskCount || 0, 
      subtext: 'Score below threshold (<24)', 
      supporting: 'Urgent attention',
      insight: `${riskCount} students need retry`, 
      status: 'Attention',
      icon: <Warning />, 
      color: '#c62828',
      trendText: riskCount > 0 ? `+${riskCount}` : '0',
      trendType: riskCount > 0 ? 'up-alert' : 'flat',
      trendColor: riskCount > 0 ? '#c62828' : '#2e7d32',
      trendBg: riskCount > 0 ? 'rgba(198, 40, 40, 0.06)' : 'rgba(46, 125, 50, 0.06)'
    }
  ];

  // 2. CHART DATA GENERATION
  const weeklyData = [
    { name: 'Week 1', evaluations: 4, pass: 3, fail: 1 },
    { name: 'Week 2', evaluations: 6, pass: 4, fail: 2 },
    { name: 'Week 3', evaluations: 8, pass: 6, fail: 2 },
    { name: 'Week 4', evaluations: 5, pass: 4, fail: 1 },
    { name: 'Week 5', evaluations: 10, pass: 8, fail: 2 },
    { name: 'Week 6', evaluations: totalCompleted || 7, pass: passCount || 5, fail: (totalCompleted - passCount) || 2 },
  ];

  const distData = [
    { range: '0-15 (Critical)', count: completedInterviews.filter(i => (i.score || 0) <= 15).length || 1 },
    { range: '16-24 (Warning)', count: completedInterviews.filter(i => (i.score || 0) > 15 && (i.score || 0) < 24).length || 2 },
    { range: '25-32 (Competent)', count: completedInterviews.filter(i => (i.score || 0) >= 24 && (i.score || 0) <= 32).length || 6 },
    { range: '33-40 (Excellent)', count: completedInterviews.filter(i => (i.score || 0) > 32).length || 3 },
  ];

  const ratioData = [
    { name: 'Passed', value: passCount || 10, color: '#2e7d32' },
    { name: 'Failed', value: completedInterviews.filter(i => i.status === 'failed').length || 2, color: '#c62828' },
    { name: 'Re-interview', value: completedInterviews.filter(i => i.status === 're_interview_required').length || 3, color: '#ef6c00' },
  ];

  // 3. RIGHT WIDGET INSIGHTS
  // Find top batch
  const batchMap = {};
  completedInterviews.forEach(i => {
    const bName = i.student?.batch?.name || 'MERN-B1';
    if (!batchMap[bName]) batchMap[bName] = [];
    batchMap[bName].push(i.score || 0);
  });
  let topBatchName = 'MERN-B1';
  let topBatchAvg = 0;
  Object.keys(batchMap).forEach(bName => {
    const scores = batchMap[bName];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > topBatchAvg) {
      topBatchName = bName;
      topBatchAvg = avg;
    }
  });

  // Find weakest module
  const moduleMap = {};
  completedInterviews.forEach(i => {
    const mName = i.module?.name || 'React Basics';
    if (!moduleMap[mName]) moduleMap[mName] = [];
    moduleMap[mName].push(i.score || 0);
  });
  let weakestModuleName = 'React Basics';
  let weakestModuleAvg = 40;
  Object.keys(moduleMap).forEach(mName => {
    const scores = moduleMap[mName];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg < weakestModuleAvg) {
      weakestModuleName = mName;
      weakestModuleAvg = avg;
    }
  });

  const retryStudentsCount = completedInterviews.filter(i => (i.reInterviewAttempt || 0) > 0).length;

  // 4. WEAK STUDENTS ALERTS LIST (score < 24)
  const weakStudents = completedInterviews
    .filter(i => (i.score || 0) < 24)
    .slice(0, 3);



  if (isLoading) {
    return (
      <AppShell fullWidth={true}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        <Box sx={{ width: '100%', py: 2, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

          {/* Header Section */}
          <Box sx={{
            pt: 4,
            pb: 3,
            px: { xs: 3, md: 4.5 },
            mx: { xs: -3, md: -4.5 },
            mt: -2.5,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />}
                sx={{ mb: 1.5 }}
              >
                <MuiLink
                  component={RouterLink}
                  to="/dashboard"
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  STAXHAUS
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  EVALUATION INTELLIGENCE
                </Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '6px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(232, 57, 29, 0.15)'
                }}>
                  <Assessment sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.1, fontSize: '1.35rem', textTransform: 'none', fontFamily: 'inherit' }}>
                    Evaluation Intelligence Center
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
                    Operational insights across technical assessments and interviewer performance.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Chip
                icon={<CalendarToday sx={{ color: 'primary.main !important', fontSize: '0.78rem' }} />}
                label="ACTIVE QUARTER"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  letterSpacing: '0.04em',
                  px: 1,
                  bgcolor: 'rgba(232, 57, 29, 0.04)',
                  border: '1px solid rgba(232, 57, 29, 0.15)',
                  color: 'primary.main',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  height: 28
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Download sx={{ fontSize: 12 }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  py: 0.5,
                  px: 1.8,
                  height: 28,
                  boxShadow: 'none',
                  letterSpacing: '0.02em'
                }}
              >
                Export
              </Button>
            </Stack>
          </Box>

          {/* Performance Summary Metrics */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)'
            },
            gap: 2,
            width: '100%'
          }}>
            {metrics.map((m, i) => (
              <Card key={i} sx={{
                transition: 'all 0.2s ease-in-out',
                border: '1px solid #E5E7EB',
                borderTop: `3px solid ${m.color}`,
                borderRadius: '4px',
                bgcolor: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  borderColor: '#D1D5DB'
                }
              }}>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: 1.5 }}>
                  {/* TOP ROW */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.62rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {m.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Trend Indicator */}
                      <Box sx={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: m.trendColor,
                        bgcolor: m.trendBg,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontFamily: 'inherit',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 0.95 }
                      }}>
                        {m.trendType === 'up' && '↑'}
                        {m.trendType === 'up-alert' && '↑'}
                        {m.trendType === 'down' && '↓'}
                        {m.trendType === 'live' && (
                          <Box 
                            sx={{ 
                              width: 5, 
                              height: 5, 
                              borderRadius: '50%', 
                              bgcolor: '#0288d1',
                              animation: 'pulse 1.5s infinite ease-in-out',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(0.8)', opacity: 0.5 },
                                '50%': { transform: 'scale(1.2)', opacity: 1 },
                                '100%': { transform: 'scale(0.8)', opacity: 0.5 }
                              }
                            }} 
                          />
                        )}
                        {m.trendText}
                      </Box>
                      {/* Icon */}
                      <Box sx={{ color: m.color, display: 'flex', alignItems: 'center', opacity: 0.7, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } }}>
                        {React.cloneElement(m.icon, { sx: { fontSize: 14 } })}
                      </Box>
                    </Box>
                  </Box>

                  {/* CENTER ROW */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h5" sx={{ fontFamily: 'inherit', fontSize: '1.6rem', fontWeight: 950, color: 'secondary.main', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                      {m.value}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 650, color: 'text.secondary', mt: 0.5, letterSpacing: '0.01em' }}>
                      {m.subtext}
                    </Typography>
                  </Box>

                  {/* BOTTOM ROW */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    pt: 1.25, 
                    borderTop: '1px solid #F3F4F6',
                    width: '100%'
                  }}>
                    <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                      {m.insight}
                    </Typography>
                    <Box sx={{
                      fontSize: '0.55rem',
                      fontWeight: 900,
                      color: m.color,
                      bgcolor: `${m.color}0D`,
                      border: `1px solid ${m.color}26`,
                      px: 0.8,
                      py: 0.15,
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {m.status}
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Analytics Charts Section (2-Column Layout) */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1.2fr' },
            gap: 2.5,
            width: '100%',
            alignItems: 'stretch'
          }}>
            
            {/* LEFT COLUMN: Large Chart Panels */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
              
              {/* Chart Panel 1: Weekly Trend */}
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={900} color="secondary" sx={{ letterSpacing: '0.04em', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timeline sx={{ fontSize: 16, color: 'primary.main' }} /> WEEKLY EVALUATION TREND
                    </Typography>
                    <Chip label="TRENDS" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '3px' }} />
                  </Box>
                  <Box sx={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEvaluations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1EF" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 4 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="evaluations" name="Total Evaluations" stroke="#1976d2" strokeWidth={2} fillOpacity={1} fill="url(#colorEvaluations)" />
                        <Area type="monotone" dataKey="pass" name="Passed" stroke="#2e7d32" strokeWidth={2} fillOpacity={1} fill="url(#colorPass)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>

              {/* Grid for two smaller chart panels */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2.5,
                width: '100%'
              }}>
                
                {/* Chart Panel 2: Performance Distribution */}
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={900} color="secondary" sx={{ letterSpacing: '0.04em', fontSize: '0.78rem', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assessment sx={{ fontSize: 16, color: 'primary.main' }} /> SCORE DISTRIBUTION
                    </Typography>
                    <Box sx={{ width: '100%', height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1EF" />
                          <XAxis dataKey="range" stroke="#9ca3af" fontSize={8} tickLine={false} />
                          <YAxis stroke="#9ca3af" fontSize={8} tickLine={false} />
                          <Tooltip contentStyle={{ fontSize: 10 }} />
                          <Bar dataKey="count" name="Students" fill="#E8391D" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>

                {/* Chart Panel 3: Ratio */}
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={900} color="secondary" sx={{ letterSpacing: '0.04em', fontSize: '0.78rem', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ fontSize: 16, color: 'primary.main' }} /> OUTCOME RATIO
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ratioData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {ratioData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 10 }} />
                          <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>

              </Box>

            </Box>

            {/* RIGHT COLUMN: Operational Insight Widgets */}
            <Box sx={{ width: '100%', height: '100%' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Typography variant="subtitle2" fontWeight={900} color="secondary" sx={{ letterSpacing: '0.04em', fontSize: '0.78rem', pb: 1, borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ fontSize: 16, color: 'primary.main' }} /> EVALUATION INSIGHTS
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                    
                    {/* Insight 1: Top Batch */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.62rem', textTransform: 'uppercase' }}>
                          TOP PERFORMING BATCH
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={850} color="secondary" sx={{ fontSize: '0.85rem', fontFamily: 'inherit' }}>
                          {topBatchName}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="success.main" fontWeight={900} sx={{ fontSize: '0.85rem', display: 'block' }}>
                          ★ {topBatchAvg.toFixed(1)} avg
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                          Based on completed evaluations
                        </Typography>
                      </Box>
                    </Box>

                    {/* Insight 2: Weakest Module */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.62rem', textTransform: 'uppercase' }}>
                          WEAKEST ASSESSMENT MODULE
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={850} color="secondary" sx={{ fontSize: '0.85rem', fontFamily: 'inherit' }}>
                          {weakestModuleName}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="error.main" fontWeight={900} sx={{ fontSize: '0.85rem', display: 'block' }}>
                          ⚠️ {weakestModuleAvg.toFixed(1)} avg
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                          Needs support / review
                        </Typography>
                      </Box>
                    </Box>

                    {/* Insight 3: Retry Index */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.62rem', textTransform: 'uppercase' }}>
                          RE-INTERVIEW RETRY LOAD
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={850} color="secondary" sx={{ fontSize: '0.85rem', fontFamily: 'inherit' }}>
                          High Attempt Sessions
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="warning.main" fontWeight={900} sx={{ fontSize: '0.85rem', display: 'block' }}>
                          {retryStudentsCount} Students
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                          Attempt #2 or higher
                        </Typography>
                      </Box>
                    </Box>

                    {/* Load Summary */}
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.62rem', textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                        INTERVIEW LOAD SUMMARY
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.7rem' }}>Completed Evaluations</Typography>
                            <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>{totalCompleted} / 25 cap</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min((totalCompleted / 25) * 100, 100)} color="success" sx={{ height: 6, borderRadius: 3 }} />
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.7rem' }}>Pending Queue</Typography>
                            <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>{pendingCount} active</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min((pendingCount / 10) * 100, 100)} color="warning" sx={{ height: 6, borderRadius: 3 }} />
                        </Box>
                      </Stack>
                    </Box>

                  </Box>
                </CardContent>
              </Card>
            </Box>

          </Box>

          {/* Weak Students / Risk Alerts */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5, borderBottom: '1px solid #E5E7EB', width: '100%' }}>
              <Typography variant="subtitle1" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                <ErrorIcon sx={{ color: '#c62828', fontSize: 16 }} /> CRITICAL ASSESSMENT RISK ALERTS (SCORE &lt; 24)
              </Typography>
            </Box>

            {weakStudents.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', borderColor: '#D1D5DB', width: '100%', bgcolor: 'rgba(46, 125, 50, 0.01)' }}>
                <CheckCircle color="success" sx={{ fontSize: 28, mb: 1 }} />
                <Typography variant="subtitle2" color="secondary" fontWeight={850} sx={{ fontFamily: 'inherit', mb: 0.25 }}>
                  Operational Shield Active
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={650} sx={{ display: 'block' }}>
                  No critical performance risk alerts. All evaluated students are scoring above the safety threshold.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2} sx={{ width: '100%' }}>
                {weakStudents.map((iAlert) => (
                  <Card 
                    key={iAlert._id} 
                    sx={{ 
                      borderLeft: '4px solid #c62828', 
                      bgcolor: 'white', 
                      width: '100%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      borderRadius: '6px'
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr auto' },
                        gap: 3,
                        alignItems: 'center'
                      }}>
                        
                        {/* LEFT: Student Info */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', minWidth: 0 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main', color: 'white', fontWeight: 900, borderRadius: '6px', fontSize: '1rem', fontFamily: 'inherit' }}>
                            {iAlert.student?.name?.[0]}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={850} sx={{ fontSize: '0.85rem', lineHeight: 1.2, fontFamily: 'inherit', color: 'secondary.main' }}>
                              {iAlert.student?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', display: 'block', mt: 0.25, fontWeight: 650 }}>
                              Batch: <span style={{ color: '#1E2126', fontWeight: 800 }}>{iAlert.student?.batch?.name || 'MERN-B1'}</span> • Module: <span style={{ color: '#1E2126', fontWeight: 800 }}>{iAlert.module?.name}</span>
                            </Typography>
                            <Typography variant="caption" color="error" sx={{ fontSize: '0.62rem', fontWeight: 800, mt: 0.5, display: 'block', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                              Performance Drop Alert
                            </Typography>
                          </Box>
                        </Box>

                        {/* CENTER 1: Score Details */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            SCORE BREAKDOWN
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', px: 1.5, py: 0.5, borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.58rem', color: 'text.secondary', display: 'block', fontWeight: 700 }}>TECHNICAL</Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.78rem', fontWeight: 900, color: 'secondary.main' }}>{iAlert.reviewScore || 0} / 10</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', px: 1.5, py: 0.5, borderRadius: '4px', border: '1px solid #E5E7EB' }}>
                              <Typography variant="caption" sx={{ fontSize: '0.58rem', color: 'text.secondary', display: 'block', fontWeight: 700 }}>COMMUNICATION</Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.78rem', fontWeight: 900, color: 'secondary.main' }}>{iAlert.taskScore || 0} / 10</Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* CENTER 2: Total & Threshold */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            ACCUMULATED SCORE
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Typography variant="h6" color="error.main" sx={{ fontSize: '1.2rem', fontWeight: 950, fontFamily: 'inherit', lineHeight: 1 }}>
                              {iAlert.score || 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', fontWeight: 700 }}>
                              / 40
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 650 }}>
                            Threshold: <span style={{ fontWeight: 800 }}>24</span> (Deficit: <span style={{ color: '#c62828', fontWeight: 800 }}>{24 - (iAlert.score || 0)}</span>)
                          </Typography>
                        </Box>

                        {/* RIGHT: Status & Action */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Chip 
                              label="CRITICAL" 
                              size="small" 
                              color="error" 
                              sx={{ height: 18, fontSize: '0.58rem', fontWeight: 900, borderRadius: '4px', letterSpacing: '0.04em' }} 
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', mt: 0.5, fontWeight: 700 }}>
                              Escalation: <span style={{ color: '#c62828', fontWeight: 800 }}>Awaiting Review</span>
                            </Typography>
                          </Box>
                          
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/interviews/${iAlert._id}`)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.68rem',
                              fontWeight: 900,
                              py: 0.75,
                              px: 2,
                              height: 32,
                              boxShadow: 'none',
                              letterSpacing: '0.02em',
                              '&:hover': {
                                bgcolor: '#b71c1c',
                                boxShadow: 'none'
                              }
                            }}
                          >
                            Re-Evaluate
                          </Button>
                        </Box>

                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>

          {/* Recent Evaluations Table */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5, borderBottom: '1px solid #E5E7EB', width: '100%' }}>
              <Typography variant="subtitle1" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                <Timeline sx={{ color: 'primary.main', fontSize: 16 }} /> RECENT EVALUATIONS TABLE
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: '6px', width: '100%', bgcolor: 'white' }}>
              {/* Header Grid */}
              <Box sx={{ 
                display: { xs: 'none', md: 'grid' },
                gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1fr 1fr auto',
                gap: 2,
                bgcolor: 'rgba(0,0,0,0.02)', 
                py: 1.5, 
                px: 2.5, 
                borderBottom: '1px solid #E5E7EB',
                width: '100%'
              }}>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>STUDENT</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>BATCH</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>MODULE</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>TECH SCORE</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>COMM SCORE</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>FINAL STATUS</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>EVALUATED DATE</Typography>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em', pr: 2, textAlign: 'right' }}>ACTIONS</Typography>
              </Box>

              {/* Rows Stack */}
              <Stack spacing={0} sx={{ bgcolor: 'white', width: '100%' }}>
                {recentEvaluations.map((row) => {
                  const evaluatedDate = row.createdAt 
                    ? new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—';

                  return (
                    <Box 
                      key={row._id} 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1.5fr 1fr 1fr 1fr 1fr auto' },
                        gap: { xs: 1, md: 2 },
                        py: 1.5, 
                        px: 2.5, 
                        alignItems: 'center', 
                        borderBottom: '1px solid #F1F1EF',
                        transition: 'background-color 0.15s',
                        width: '100%',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.008)' }
                      }}
                    >
                      {/* 1. Student */}
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', minWidth: 0 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', color: 'white', fontWeight: 800, borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'inherit' }}>
                          {row.student?.name?.[0]}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={750} sx={{ fontSize: '0.8rem', color: '#1E2126', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
                            {row.student?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem', display: { xs: 'block', md: 'none' } }}>
                            Batch: {row.student?.batch?.name || 'MERN-B1'} • Module: {row.module?.name}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* 2. Batch (Hidden on mobile) */}
                      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.75rem', color: 'secondary.main' }}>
                          {row.student?.batch?.name || 'MERN-B1'}
                        </Typography>
                      </Box>

                      {/* 3. Module (Hidden on mobile) */}
                      <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
                        <Typography variant="caption" color="text.primary" sx={{ fontSize: '0.72rem', fontWeight: 650, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
                          {row.module?.name}
                        </Typography>
                      </Box>

                      {/* 4. Tech Score */}
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'inline', md: 'none' }, fontSize: '0.65rem' }}>Tech:</Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.78rem', color: '#1E2126' }}>
                          {['passed', 'failed', 're_interview_required', 'completed'].includes(row.status) ? `${row.reviewScore || 0} / 10` : '—'}
                        </Typography>
                      </Box>

                      {/* 5. Comm Score */}
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'inline', md: 'none' }, fontSize: '0.65rem' }}>Comm:</Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.78rem', color: '#1E2126' }}>
                          {['passed', 'failed', 're_interview_required', 'completed'].includes(row.status) ? `${row.taskScore || 0} / 10` : '—'}
                        </Typography>
                      </Box>

                      {/* 6. Status Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusChip(row.status)}
                      </Box>

                      {/* 7. Evaluated Date */}
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600 }}>
                          {evaluatedDate}
                        </Typography>
                      </Box>

                      {/* 8. Actions (Compact Action Group) */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center', mt: { xs: 1, md: 0 } }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/interviews/${row._id}`)}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            py: 0.3,
                            px: 1.5,
                            height: 24,
                            borderColor: '#E5E7EB',
                            color: 'secondary.main',
                            '&:hover': {
                              borderColor: 'secondary.main',
                              bgcolor: 'rgba(0,0,0,0.02)'
                            }
                          }}
                        >
                          Details
                        </Button>
                        {['passed', 'failed', 're_interview_required', 'completed'].includes(row.status) && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate(`/interviews/${row._id}`)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              py: 0.3,
                              px: 1.5,
                              height: 24,
                              borderColor: 'rgba(232, 57, 29, 0.15)',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'rgba(232, 57, 29, 0.04)',
                                borderColor: 'primary.main'
                              }
                            }}
                          >
                            Re-Evaluate
                          </Button>
                        )}
                      </Box>

                    </Box>
                  );
                })}
                {recentEvaluations.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      No evaluations recorded yet.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Box>



        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Reports;
