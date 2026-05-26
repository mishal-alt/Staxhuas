import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  People,
  Layers,
  AutoStories,
  AssignmentInd,
  TrendingUp,
  AccountTree,
  Dashboard as DashboardIcon,
  NavigateNext
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';
import {
  VideoCameraFront,
  EventNote,
  Warning,
  CheckCircle,
  Speed,
  MoreVert,
  Timeline,
  Assessment,
  Groups,
  Engineering
} from '@mui/icons-material';

import * as reportApi from '../../api/reports.api';
import { STUDENT_STATUS } from '../../utils/constants';

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
  shape: { borderRadius: 24 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.03)',
        }
      }
    }
  }
});

const AdminDashboardContent = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: response, isLoading } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: reportApi.getAdminOverview,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    );
  }

  const { kpis, students, invitations } = response.data;

  // Mock Data for New Operations UI
  const commandCenterMetrics = [
    { 
      label: 'Ongoing Interviews', 
      value: 12, 
      trend: '+3 this week', 
      status: 'optimal', 
      icon: <VideoCameraFront />,
      subMetrics: [
        { label: "Today's", value: 4 },
        { label: "Active Interviewers", value: 8 },
        { label: "Delayed Eval", value: 1, alert: true }
      ]
    },
    { 
      label: 'Pending Leaves', 
      value: 5, 
      trend: '-2 since yesterday', 
      status: 'warning', 
      icon: <EventNote />,
      subMetrics: [
        { label: "Emergency", value: 2, alert: true },
        { label: "Awaiting Review", value: 3 },
        { label: "Escalated", value: 0 }
      ]
    },
    { 
      label: 'Students at Risk', 
      value: 8, 
      trend: 'Requires attention', 
      status: 'critical', 
      icon: <Warning />,
      subMetrics: [
        { label: "Attendance Risk", value: 4, alert: true },
        { label: "Failed Interviews", value: 3 },
        { label: "Scrum Inactivity", value: 1 }
      ]
    },
    { 
      label: 'Scrum Completion', 
      value: '92%', 
      trend: '+5% vs last week', 
      status: 'optimal', 
      icon: <CheckCircle />,
      subMetrics: [
        { label: "Daily Sync", value: "95%" },
        { label: "Missing", value: 4, alert: true },
        { label: "Pending Review", value: 12 }
      ]
    },
    { 
      label: 'Deployment Ready', 
      value: 24, 
      trend: 'Available', 
      status: 'optimal', 
      icon: <Speed />,
      subMetrics: [
        { label: "Placement Ready", value: 18 },
        { label: "Mock Interviews", value: 24 },
        { label: "Module Comp.", value: "100%" }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return '#2e7d32'; // green
      case 'warning': return '#ed6c02'; // orange
      case 'critical': return '#d32f2f'; // red
      default: return '#1976d2'; // blue
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>

      {/* Header */}
      <Box sx={{
        pt: 4,
        pb: 3,
        px: 6,
        mx: -6,
        mt: -6,
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        mb: 3,
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
              DASHBOARD
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 1,
              borderRadius: 2,
              display: 'flex',
              boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
            }}>
              <DashboardIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} color="text.primary" sx={{
                letterSpacing: '-0.02em',
                mb: 0.2,
                fontSize: '1.75rem',
                textTransform: 'none'
              }}>
                Institute Intelligence
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                High-level overview of Staxhaus core operations
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* KPI Grid - Strictly 4-column layout */}
      <Box sx={{ 
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        gap: { xs: 1.5, md: 2 },
        mb: 2
      }}>
        {[
          { label: 'Students', value: kpis.totalStudents, icon: <People />, color: '#1976d2' },
          { label: 'Batches', value: kpis.activeBatches, icon: <Layers />, color: '#E8391D' },
          { label: 'Courses', value: kpis.totalCourses, icon: <AutoStories />, color: '#9c27b0' },
          { label: 'Facilitators', value: kpis.totalFacilitators, icon: <AssignmentInd />, color: '#2e7d32' },
        ].map((stat, i) => (
          <Card key={i} sx={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.05)',
            height: { xs: 80, sm: 100 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <CardContent sx={{
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5, md: 2 },
              width: '100%',
              '&:last-child': { pb: { xs: 1.5, sm: 2 } }
            }}>
              <Box sx={{
                p: { xs: 1, sm: 1.2, md: 1.5 },
                bgcolor: `${stat.color}10`,
                color: stat.color,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 18, sm: 20, md: 22 } } })}
              </Box>
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography 
                  variant="caption" 
                  fontWeight={900} 
                  color="text.secondary" 
                  sx={{ 
                    letterSpacing: '0.05em', 
                    display: 'block',
                    fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.7rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1
                  }}
                >
                  {stat.label.toUpperCase()}
                </Typography>
                <Typography 
                  variant="h4" 
                  fontWeight={900} 
                  sx={{ 
                    fontFamily: 'Outfit', 
                    color: 'secondary.main',
                    fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.8rem' },
                    mt: 0.3,
                    lineHeight: 1
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 1. INSTITUTION COMMAND CENTER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" color="secondary" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Speed color="primary" /> Institution Command Center
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
          gap: 2.5
        }}>
          {commandCenterMetrics.map((metric, idx) => (
            <Card key={idx} sx={{
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
              }
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                bgcolor: getStatusColor(metric.status),
              }} />
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: `${getStatusColor(metric.status)}15`, color: getStatusColor(metric.status), display: 'flex' }}>
                    {metric.icon}
                  </Box>
                  <Box sx={{
                    px: 1.5, py: 0.5, borderRadius: 1.5,
                    bgcolor: `${getStatusColor(metric.status)}10`,
                    color: getStatusColor(metric.status),
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    {metric.status}
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" sx={{ fontFamily: 'Outfit', fontWeight: 900, mb: 0.5, color: 'text.primary', letterSpacing: '-0.02em' }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ letterSpacing: '0.01em' }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, fontWeight: 600 }}>
                    <TrendingUp fontSize="small" sx={{ color: metric.status === 'warning' || metric.status === 'critical' ? 'error.main' : 'success.main' }} />
                    {metric.trend}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2, opacity: 0.6 }} />

                <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                  {metric.subMetrics.map((sub, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{sub.label}</Typography>
                      <Typography variant="caption" fontWeight={800} color={sub.alert ? 'error.main' : 'text.primary'}>
                        {sub.value}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* 2. LIVE OPERATIONAL GRID */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="secondary" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
          <Assessment color="primary" /> Institutional Monitor
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1.2fr' }, 
          gap: 3 
        }}>
          
          {/* Cohort Health Monitor */}
          <Card sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Layers sx={{ color: 'primary.main' }} /> Cohort Health Monitor
                </Typography>
                <MoreVert color="action" />
              </Box>
              <Stack spacing={3.5}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={700} color="text.secondary">Attendance Velocity</Typography>
                    <Typography variant="body2" fontWeight={900} color="primary.main">88%</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#f0f0f0', borderRadius: 4 }}>
                    <Box sx={{ width: '88%', height: '100%', bgcolor: 'primary.main', borderRadius: 4 }} />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={700} color="text.secondary">Interview Readiness</Typography>
                    <Typography variant="body2" fontWeight={900} color="success.main">High</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#f0f0f0', borderRadius: 4, display: 'flex', gap: 0.5 }}>
                    <Box sx={{ flex: 1, height: '100%', bgcolor: 'success.main', borderRadius: 4 }} />
                    <Box sx={{ flex: 1, height: '100%', bgcolor: 'success.main', borderRadius: 4 }} />
                    <Box sx={{ flex: 1, height: '100%', bgcolor: 'success.main', borderRadius: 4 }} />
                    <Box sx={{ flex: 1, height: '100%', bgcolor: '#e0e0e0', borderRadius: 4 }} />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={700} color="text.secondary">Module Progression</Typography>
                    <Typography variant="body2" fontWeight={900} color="warning.main">Lagging</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#f0f0f0', borderRadius: 4 }}>
                    <Box sx={{ width: '65%', height: '100%', bgcolor: 'warning.main', borderRadius: 4 }} />
                  </Box>
                </Box>
                
                <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 0.5 }}>Risk Status</Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="success.main">Stable</Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9fa', borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 0.5 }}>Health Score</Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">A-</Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Facilitator Efficiency Center */}
          <Card sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Engineering sx={{ color: 'secondary.main' }} /> Facilitator Efficiency
                </Typography>
                <MoreVert color="action" />
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                <Box sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Active Sessions</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 1, color: 'success.main' }}>8</Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Pending Reviews</Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ mt: 1, color: 'warning.main' }}>24</Typography>
                </Box>
              </Box>

              <Stack spacing={3} divider={<Divider sx={{ opacity: 0.6 }} />}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight={800} color="text.primary">Avg Turnaround Time</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Code evaluations (last 7 days)</Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={900} color="primary.main">2.4h</Typography>
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={800} color="text.primary">Evaluation Load</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>System capacity utilized</Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight={900} color="error.main">High</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 6, bgcolor: '#f0f0f0', borderRadius: 3, display: 'flex' }}>
                    <Box sx={{ width: '85%', height: '100%', bgcolor: 'error.main', borderRadius: 3 }} />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Institutional Incident Monitor */}
          <Card sx={{ borderRadius: '24px', border: '1px solid rgba(211, 47, 47, 0.15)', boxShadow: '0 8px 32px rgba(211, 47, 47, 0.04)', display: 'flex', flexDirection: 'column', bgcolor: '#fffcfc' }}>
            <CardContent sx={{ p: 3.5, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'error.main' }}>
                  <Warning /> Incident Monitor
                </Typography>
                <Button size="small" color="error" variant="outlined" sx={{ borderRadius: 8, fontWeight: 700, textTransform: 'none' }}>View All</Button>
              </Box>
              
              <Stack spacing={2}>
                {/* Critical Incident */}
                <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 3, borderLeft: '4px solid #d32f2f', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight={800} color="error.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>10m ago</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>Mass Attendance Drop: Batch B-02</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block', mb: 1.5 }}>Attendance dropped below 60% threshold for today's session.</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ px: 1, py: 0.5, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary' }}>Escalated to Lead</Box>
                  </Box>
                </Box>

                {/* Warning Incident */}
                <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 3, borderLeft: '4px solid #ed6c02', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight={800} color="warning.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Warning</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>2h ago</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>Overdue Interviews (5)</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block' }}>Students waiting &gt; 48hrs for mock evaluations.</Typography>
                </Box>
                
                {/* Monitoring Incident */}
                <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 3, borderLeft: '4px solid #1976d2', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monitoring</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>4h ago</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 0.5 }}>System Resource Usage High</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block' }}>Sandbox environments reaching 85% capacity.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
        </Box>
      </Box>

    </Box>
  );
};

const AdminDashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <AdminDashboardContent />
    </ThemeProvider>
  );
};
export default AdminDashboard;
