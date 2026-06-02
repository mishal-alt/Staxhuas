import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Stack,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  Tooltip,
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  People,
  EmojiEvents,
  Assessment,
  Download,
  DateRange,
  MoreVert,
  NavigateNext,
  Print,
  Share,
  Sync,
  Warning,
  Timer,
  FilterList,
  Send,
  InsertDriveFile,
  PictureAsPdf,
  PieChart,
  Info
} from '@mui/icons-material';
import { LineChart, BarChart } from '@mui/x-charts';
import { toast } from 'sonner';

import AppShell from '../components/layout/AppShell';

// Custom theme to match Staxhaus brand
const theme = createTheme({
  palette: {
    primary: {
      main: '#E8391D', // Brand Orange
    },
    secondary: {
      main: '#1E2126', // Brand Charcoal
    },
    background: {
      default: '#F7F7F5',
    }
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em' },
    h4: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' },
    h6: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '8px 16px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }
      }
    }
  }
});

const KPI_DATA = [
  { label: 'Avg Attendance', value: '94%', icon: <People />, trend: '+2.4%', up: true, color: '#1976d2' },
  { label: 'Pass Rate', value: '88%', icon: <EmojiEvents />, trend: '+1.2%', up: true, color: '#2e7d32' },
  { label: 'Scrum Blocker', value: '1.2', icon: <Assessment />, trend: '-0.5%', up: false, color: '#E8391D' },
  { label: 'Active Students', value: '124', icon: <TrendingUp />, trend: '+12', up: true, color: '#9c27b0' },
];

const ACADEMIC_HEALTH_OVERVIEW_DATA = [
  { label: 'Attendance Stability', value: '94.2%', trend: '+0.4%', up: true, status: 'High Stability', threshold: 'Target: 95.0%', progress: 94.2, color: '#2e7d32' },
  { label: 'Interview Pass Ratio', value: '88.5%', trend: '+1.2%', up: true, status: 'Optimal Rate', threshold: 'Target: 80.0%', progress: 88.5, color: '#1976d2' },
  { label: 'Leave Impact Score', value: '4.2%', trend: '-0.8%', up: false, status: 'Low Impact', threshold: 'Target: < 5.0%', progress: 42.0, color: '#ed6c02' },
  { label: 'Scrum Consistency', value: '91.8%', trend: '+2.1%', up: true, status: 'Healthy participation', threshold: 'Target: 90.0%', progress: 91.8, color: '#9c27b0' },
];

const COHORT_MATRIX_DATA = [
  { name: 'MERN-STACK-2026-B1', students: 48, attendance: '96.2%', scrum: 92.4, interview: '88.5%', leave: '2.1%', risk: 'Low', progress: 92, statusColor: '#2e7d32' },
  { name: 'MERN-STACK-2026-B2', students: 52, attendance: '88.4%', scrum: 84.1, interview: '78.2%', leave: '5.6%', risk: 'Medium', progress: 78, statusColor: '#ed6c02' },
  { name: 'JAVA-LEGACY-02', students: 24, attendance: '82.5%', scrum: 75.8, interview: '68.0%', leave: '9.8%', risk: 'High', progress: 45, statusColor: '#d32f2f' },
  { name: 'UX-UI-DESIGN-B1', students: 30, attendance: '95.0%', scrum: 90.2, interview: '92.1%', leave: '1.2%', risk: 'Low', progress: 85, statusColor: '#2e7d32' },
  { name: 'DATA-SCIENCE-B3', students: 35, attendance: '91.3%', scrum: 88.7, interview: '81.4%', leave: '3.4%', risk: 'Medium', progress: 60, statusColor: '#ed6c02' },
];

const STUDENT_RISK_DATA = [
  { name: 'Aarav Sharma', batch: 'JAVA-LEGACY-02', category: 'Attendance + Leaves', details: 'Attendance dropped to 72% over last 10 days. 8 days of leave taken.', severity: 'Critical', avatar: 'AS' },
  { name: 'Priya Patel', batch: 'MERN-STACK-2026-B2', category: 'Evaluation Failures', details: 'Failed consecutive React Redux and Node.js evaluations.', severity: 'Critical', avatar: 'PP' },
  { name: 'Rohan Das', batch: 'JAVA-LEGACY-02', category: 'Scrum Inactivity', details: 'No scrum updates logged for 4 consecutive sessions. Flagged silent.', severity: 'Warning', avatar: 'RD' },
  { name: 'Neha Gupta', batch: 'MERN-STACK-2026-B2', category: 'Interview Performance', details: 'Scored 55/100 in Javascript Mock Interview. Technical review required.', severity: 'Warning', avatar: 'NG' },
];

const SCRUM_INSIGHT_DATA = {
  blocked: [
    { name: 'Aarav Sharma', detail: 'Stuck on Spring Boot JPA mapping', duration: '3d' },
    { name: 'Devendra Patel', detail: 'React Context rerender loop', duration: '2d' },
    { name: 'Sarah Connor', detail: 'Database connection pool timeout', duration: '1d' }
  ],
  silent: [
    { name: 'Rohan Das', duration: '4d inactive' },
    { name: 'Aditya Sen', duration: '3d inactive' },
    { name: 'Emily Watson', duration: '2d inactive' }
  ],
  contributors: [
    { name: 'Vikram Seth', score: '14 PRs merged', help: '4 blocker solves' },
    { name: 'Simran Kaur', score: '12 PRs merged', help: '6 code reviews' },
    { name: 'Aniket Rao', score: '9 PRs merged', help: '5 peer sessions' }
  ]
};

const Reports = () => {
  const [timeframe, setTimeframe] = useState('This Month');
  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('10 mins ago');

  const handleSync = () => {
    setIsSyncing(true);
    toast.loading('Syncing operations intelligence data...', { id: 'sync-op' });
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(`Just now (${timeStr})`);
      setIsSyncing(false);
      toast.success('Operations data synchronized successfully.', { id: 'sync-op' });
    }, 1200);
  };

  const triggerExport = (type) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Preparing ${type} export...`,
        success: `${type} report exported successfully!`,
        error: `Could not export ${type} report.`,
      }
    );
  };

  const handleIntervention = (studentName, actionType) => {
    toast.success(`Intervention initiated: Resending ${actionType} invite/alert to ${studentName}.`);
  };

  const handleInspectBatch = (batchName) => {
    toast.info(`Opening details for batch ${batchName}...`);
  };

  const pulseAnimation = {
    '@keyframes pulse': {
      '0%': { opacity: 0.4 },
      '50%': { opacity: 1 },
      '100%': { opacity: 0.4 },
    },
    animation: 'pulse 1.5s infinite ease-in-out',
  };

  const spinAnimation = {
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    animation: 'spin 1s infinite linear',
  };

  const growProgressAnimation = {
    '@keyframes growProgress': {
      '0%': { width: '0%' },
      '100%': { width: '100%' },
    },
    animation: 'growProgress 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        <Box sx={{ width: '100%', py: 2.5, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Header */}
          <Box sx={{
            pt: 2.5,
            pb: 2,
            px: { xs: 3, md: 4.5 },
            mx: { xs: -3, md: -4.5 },
            mt: { xs: -2.5, md: -2.5 },
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2
          }}>
            <Box>
              <Breadcrumbs 
                separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />} 
                sx={{ mb: 0.8 }}
              >
                <MuiLink 
                  component={Link} 
                  to="/dashboard" 
                  underline="none" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  DASHBOARD
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  REPORTS
                </Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  p: 0.8, 
                  borderRadius: 1.5, 
                  display: 'flex', 
                  boxShadow: '0 4px 12px rgba(232, 57, 29, 0.15)' 
                }}>
                  <Assessment fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.1, fontSize: { xs: '1.25rem', sm: '1.5rem' }, textTransform: 'none' }}>
                    Performance Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                    Comprehensive overview of student and cohort performance
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack 
              direction="row" 
              spacing={1.5} 
              sx={{ 
                width: { xs: '100%', sm: 'auto' }, 
                justifyContent: { xs: 'space-between', sm: 'flex-start' }
              }}
            >
              <Button 
                variant="outlined" 
                startIcon={<DateRange />} 
                sx={{ 
                  color: 'text.primary', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  fontSize: '0.75rem',
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                Timeframe
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Download />}
                sx={{ 
                  px: 3.5,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  boxShadow: '0 4px 12px rgba(232, 57, 29, 0.15)',
                  flex: { xs: 1, sm: 'none' }
                }}
              >
                Export Ledger
              </Button>
            </Stack>
          </Box>

          {/* Stats Section - Standardized 4-Box Grid */}
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2
          }}>
            {KPI_DATA.map((kpi, i) => (
              <Card key={i} sx={{
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.04)',
                minHeight: { xs: 72, sm: 88 },
                height: 'auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                overflow: 'hidden',
                bgcolor: 'white'
              }}>
                <CardContent sx={{ 
                  p: { xs: 1.2, sm: 1.5 }, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, sm: 1.5 },
                  width: '100%',
                  '&:last-child': { pb: 1.5 }
                }}>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: `${kpi.color}10`, 
                    color: kpi.color, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {React.cloneElement(kpi.icon, { sx: { fontSize: { xs: 16, sm: 18, md: 20 } } })}
                  </Box>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="caption" 
                        fontWeight={900} 
                        color="text.secondary" 
                        sx={{ 
                          letterSpacing: '0.05em', 
                          display: 'block',
                          fontSize: { xs: '0.55rem', sm: '0.62rem', md: '0.68rem' },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1
                        }}
                      >
                        {kpi.label.toUpperCase()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: kpi.up ? 'success.main' : 'error.main' }}>
                        {kpi.up ? <TrendingUp sx={{ fontSize: 10 }} /> : <TrendingDown sx={{ fontSize: 10 }} />}
                        <Typography variant="caption" sx={{ fontSize: '0.55rem', fontWeight: 900, ml: 0.1 }}>{kpi.trend}</Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="h4" 
                      fontWeight={900} 
                      sx={{ 
                        fontFamily: 'Outfit', 
                        color: 'secondary.main',
                        fontSize: { xs: '1.05rem', sm: '1.35rem', md: '1.55rem' },
                        mt: 0.1,
                        lineHeight: 1
                      }}
                    >
                      {kpi.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Section 1: Performance Control Center */}
          {/* Section 1: Performance Control Center */}
          <Card sx={{ 
            borderRadius: '6px', 
            border: '1px solid rgba(0,0,0,0.05)', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
            bgcolor: 'white'
          }}>
            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', md: 'center' }, 
                gap: 1.5 
              }}>
                
                {/* Filters */}
                <Stack 
                  direction="row" 
                  spacing={1.5} 
                  sx={{ 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    width: { xs: '100%', md: 'auto' }, 
                    justifyContent: { xs: 'space-between', md: 'flex-start' } 
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <FilterList sx={{ color: 'text.secondary', fontSize: '0.95rem' }} />
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.68rem' }}>FILTERS:</Typography>
                  </Box>
                  
                  {/* Timeframe Select */}
                  <Box
                    component="select"
                    value={timeframe}
                    onChange={(e) => {
                      setTimeframe(e.target.value);
                      toast.info(`Timeframe filtered to: ${e.target.value}`);
                    }}
                    sx={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      color: '#1E2126',
                      fontFamily: 'Outfit',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      outline: 'none',
                      flex: { xs: '1 1 auto', md: 'none' }
                    }}
                  >
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="This Quarter">This Quarter</option>
                    <option value="All Time">All Time</option>
                  </Box>

                  {/* Batch Select */}
                  <Box
                    component="select"
                    value={batchFilter}
                    onChange={(e) => {
                      setBatchFilter(e.target.value);
                      toast.info(`Batch filtered to: ${e.target.value}`);
                    }}
                    sx={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      color: '#1E2126',
                      fontFamily: 'Outfit',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      outline: 'none',
                      flex: { xs: '1 1 auto', md: 'none' }
                    }}
                  >
                    <option value="All Batches">All Batches</option>
                    <option value="MERN-STACK-2026-B1">MERN-STACK-2026-B1</option>
                    <option value="MERN-STACK-2026-B2">MERN-STACK-2026-B2</option>
                    <option value="JAVA-LEGACY-02">JAVA-LEGACY-02</option>
                    <option value="UX-UI-DESIGN-B1">UX-UI-DESIGN-B1</option>
                    <option value="DATA-SCIENCE-B3">DATA-SCIENCE-B3</option>
                  </Box>

                  {/* Module Select */}
                  <Box
                    component="select"
                    value={moduleFilter}
                    onChange={(e) => {
                      setModuleFilter(e.target.value);
                      toast.info(`Module filtered to: ${e.target.value}`);
                    }}
                    sx={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      color: '#1E2126',
                      fontFamily: 'Outfit',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      outline: 'none',
                      flex: { xs: '1 1 auto', md: 'none' }
                    }}
                  >
                    <option value="All Modules">All Modules</option>
                    <option value="HTML">HTML</option>
                    <option value="JS">JS</option>
                    <option value="React">React</option>
                    <option value="Node">Node</option>
                    <option value="DB">Database</option>
                  </Box>
                </Stack>

                {/* Live Sync Status & Trigger */}
                <Stack 
                  direction="row" 
                  spacing={1.5} 
                  alignItems="center"
                  justifyContent={{ xs: 'space-between', md: 'flex-end' }}
                  sx={{ 
                    width: { xs: '100%', md: 'auto' },
                    borderTop: { xs: '1px dashed rgba(0,0,0,0.06)', md: 'none' },
                    pt: { xs: 1.5, md: 0 }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#2e7d32',
                      boxShadow: '0 0 6px #2e7d32',
                      ...(isSyncing ? spinAnimation : pulseAnimation)
                    }} />
                    <Typography variant="caption" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: 'text.secondary', fontSize: '0.68rem' }}>
                      Operational Sync
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem sx={{ height: 12 }} />

                  <Typography variant="caption" sx={{ fontFamily: 'Outfit', color: 'text.disabled', fontWeight: 600, fontSize: '0.68rem' }}>
                    Synced: {lastUpdated}
                  </Typography>

                  <Tooltip title="Synchronize Operations Data" arrow>
                    <IconButton 
                      size="small" 
                      onClick={handleSync}
                      disabled={isSyncing}
                      sx={{ 
                        color: 'primary.main', 
                        bgcolor: 'rgba(232, 57, 29, 0.05)',
                        p: 0.5,
                        '&:hover': { bgcolor: 'rgba(232, 57, 29, 0.1)' }
                      }}
                    >
                      <Sync sx={{ 
                        fontSize: '0.95rem',
                        ...(isSyncing && spinAnimation)
                      }} />
                    </IconButton>
                  </Tooltip>
                </Stack>

              </Box>
            </CardContent>
          </Card>

          {/* Section 2: Academic Health Overview */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                Academic Health Overview
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 3, 
              width: '100%' 
            }}>
              {ACADEMIC_HEALTH_OVERVIEW_DATA.map((metric, i) => (
                <Card key={i} sx={{
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  bgcolor: 'white',
                  transition: 'all 0.25s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }
                }}>
                  <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    {/* Top Row: label and trend badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 800, 
                          color: '#4B5563',
                          fontSize: '0.75rem', 
                          letterSpacing: '0.04em', 
                          textTransform: 'uppercase'
                        }}
                      >
                        {metric.label}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '6px',
                        bgcolor: metric.up ? 'rgba(46, 125, 50, 0.08)' : 'rgba(211, 47, 47, 0.08)',
                        color: metric.up ? '#2e7d32' : '#d32f2f'
                      }}>
                        {metric.up ? <TrendingUp sx={{ fontSize: 13 }} /> : <TrendingDown sx={{ fontSize: 13 }} />}
                        <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 800 }}>
                          {metric.trend}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Middle Row: big number */}
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontFamily: 'Outfit', 
                        fontWeight: 900, 
                        color: '#1E2126', 
                        mt: 0.5, 
                        mb: 1.5, 
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        lineHeight: 1
                      }}
                    >
                      {metric.value}
                    </Typography>

                    {/* Progress Bar */}
                    <Box sx={{ width: '100%', mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={metric.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.04)',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: metric.color,
                            borderRadius: 3
                          },
                          ...growProgressAnimation
                        }}
                      />
                    </Box>

                    {/* Bottom Row: Status and Threshold */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip
                        label={metric.status}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          height: '24px',
                          bgcolor: `${metric.color}12`,
                          color: metric.color,
                          borderRadius: '6px',
                          px: 0.75
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.72rem', fontWeight: 600 }}>
                        {metric.threshold}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Section 3: Cohort Performance Matrix */}
          <Card sx={{ overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '6px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)', bgcolor: 'white' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                  Cohort Performance Matrix
                </Typography>
              </Box>
              <Chip
                label="MAY 2026 CYCLE"
                size="small"
                sx={{ fontWeight: 900, bgcolor: 'secondary.main', color: 'white', borderRadius: 1, fontSize: '0.58rem', height: 18 }}
              />
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 0 }}>
              <Table sx={{ minWidth: 800 }} size="small">
                <TableHead sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', py: 1.2, fontSize: '0.65rem', pl: 2 }}>COHORT IDENTITY</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>RISK LEVEL</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>ACTIVE STUDENTS</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>AVG ATTENDANCE</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>SCRUM SCORE</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>INTERVIEW PASS %</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>LEAVE VECTOR</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>DEPLOYMENT PROMPTNESS</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem', pr: 2 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {COHORT_MATRIX_DATA.map((cohort, i) => (
                    <TableRow 
                      key={i} 
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }, 
                        transition: 'background-color 0.15s ease',
                        borderBottom: '1px solid rgba(0,0,0,0.03)'
                      }}
                    >
                      <TableCell sx={{ py: 1.2, pl: 2 }}>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Box sx={{ 
                            width: 26, 
                            height: 26, 
                            bgcolor: `${cohort.statusColor}12`, 
                            color: cohort.statusColor, 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 900,
                            fontSize: '0.72rem'
                          }}>
                            {cohort.name[0]}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.78rem', color: 'secondary.main' }}>
                              {cohort.name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell align="center" sx={{ py: 1.2 }}>
                        <Chip
                          label={cohort.risk}
                          size="small"
                          icon={cohort.risk === 'High' ? <Warning style={{ color: 'inherit', fontSize: '0.75rem' }} /> : undefined}
                          sx={{
                            fontWeight: 900,
                            fontSize: '0.58rem',
                            height: 16,
                            bgcolor: cohort.risk === 'Low' ? '#2e7d3212' : (cohort.risk === 'Medium' ? '#ed6c0212' : '#d32f2f12'),
                            color: cohort.risk === 'Low' ? '#2e7d32' : (cohort.risk === 'Medium' ? '#ed6c02' : '#d32f2f'),
                            border: `1px solid ${cohort.risk === 'Low' ? '#2e7d3220' : (cohort.risk === 'Medium' ? '#ed6c0220' : '#d32f2f20')}`,
                            borderRadius: '4px',
                            letterSpacing: '0.01em'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell sx={{ py: 1.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>
                          {cohort.students} Profiles
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>
                          {cohort.attendance}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>
                          {cohort.scrum}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>
                          {cohort.interview}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>
                          {cohort.leave}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.2, minWidth: 120 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={cohort.progress}
                              sx={{
                                height: 3,
                                borderRadius: 1.5,
                                bgcolor: 'rgba(0,0,0,0.04)',
                                '& .MuiLinearProgress-bar': { bgcolor: cohort.statusColor }
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.7rem', minWidth: 24 }}>
                            {cohort.progress}%
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="right" sx={{ py: 1.2, pr: 2 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleInspectBatch(cohort.name)}
                          sx={{ 
                            py: 0.4,
                            px: 1.2,
                            fontSize: '0.58rem',
                            fontWeight: 800,
                            borderRadius: '4px',
                            color: 'secondary.main',
                            borderColor: 'rgba(0,0,0,0.1)',
                            textTransform: 'uppercase',
                            '&:hover': {
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              bgcolor: 'rgba(232, 57, 29, 0.01)'
                            }
                          }}
                        >
                          INSPECT
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile Cards View */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, p: 2 }}>
              {COHORT_MATRIX_DATA.map((cohort, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    p: 2, 
                    border: '1px solid rgba(0,0,0,0.06)', 
                    borderRadius: '6px', 
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box sx={{ 
                        width: 30, 
                        height: 30, 
                        bgcolor: `${cohort.statusColor}12`, 
                        color: cohort.statusColor, 
                        borderRadius: '6px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 900,
                        fontSize: '0.8rem'
                      }}>
                        {cohort.name[0]}
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.78rem', color: 'secondary.main' }}>
                        {cohort.name}
                      </Typography>
                    </Stack>
                    
                    <Chip
                      label={cohort.risk}
                      size="small"
                      icon={cohort.risk === 'High' ? <Warning style={{ color: 'inherit', fontSize: '0.75rem' }} /> : undefined}
                      sx={{
                        fontWeight: 900,
                        fontSize: '0.58rem',
                        height: 18,
                        bgcolor: cohort.risk === 'Low' ? '#2e7d3212' : (cohort.risk === 'Medium' ? '#ed6c0212' : '#d32f2f12'),
                        color: cohort.risk === 'Low' ? '#2e7d32' : (cohort.risk === 'Medium' ? '#ed6c02' : '#d32f2f'),
                        border: `1px solid ${cohort.risk === 'Low' ? '#2e7d3220' : (cohort.risk === 'Medium' ? '#ed6c0220' : '#d32f2f20')}`,
                        borderRadius: '4px',
                        letterSpacing: '0.01em'
                      }}
                    />
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.58rem', display: 'block', mb: 0.2 }}>ACTIVE STUDENTS</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>{cohort.students} Profiles</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.58rem', display: 'block', mb: 0.2 }}>AVG ATTENDANCE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>{cohort.attendance}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.58rem', display: 'block', mb: 0.2 }}>SCRUM SCORE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>{cohort.scrum}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.58rem', display: 'block', mb: 0.2 }}>INTERVIEW PASS %</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>{cohort.interview}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.58rem', display: 'block', mb: 0.2 }}>LEAVE VECTOR</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.75rem' }}>{cohort.leave}</Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.58rem' }}>DEPLOYMENT PROMPTNESS</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={cohort.progress}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: 'rgba(0,0,0,0.04)',
                            '& .MuiLinearProgress-bar': { bgcolor: cohort.statusColor }
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.7rem' }}>
                        {cohort.progress}%
                      </Typography>
                    </Stack>
                  </Box>

                  <Button 
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => handleInspectBatch(cohort.name)}
                    sx={{ 
                      py: 0.6,
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      borderRadius: '6px',
                      color: 'secondary.main',
                      borderColor: 'rgba(0,0,0,0.1)',
                      textTransform: 'uppercase',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        bgcolor: 'rgba(232, 57, 29, 0.01)'
                      }
                    }}
                  >
                    INSPECT COHORT
                  </Button>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Side by side: Section 4 (Student Risk Monitor) & Section 6 (Scrum Insight Panel) */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1.4fr' }, 
            gap: 2, 
            width: '100%' 
          }}>
            
            {/* Section 4: Student Risk Monitor */}
            <Card sx={{ 
              p: 2.5, 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '6px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.01)', 
              bgcolor: 'white', 
              height: { xs: 'auto', md: 400 }, 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%'
            }}>
              <Box sx={{ pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                    Student Risk Monitor
                  </Typography>
                </Box>
                <Chip
                  label="4 ATTENTION FLAGS"
                  size="small"
                  color="error"
                  sx={{ fontWeight: 900, borderRadius: 1, fontSize: '0.62rem', height: 20 }}
                />
              </Box>
              
              <Stack spacing={1.5} sx={{ 
                overflowY: 'auto', 
                flexGrow: 1, 
                pt: 1.5,
                pr: 0.5,
                '&::-webkit-scrollbar': { width: '3px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: '#E5E7EB', borderRadius: '3px' }
              }}>
                {STUDENT_RISK_DATA.map((student, idx) => (
                  <Box 
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: '10px',
                      bgcolor: student.severity === 'Critical' ? 'rgba(211, 47, 47, 0.015)' : 'rgba(237, 108, 2, 0.015)',
                      border: '1px solid',
                      borderColor: student.severity === 'Critical' ? 'rgba(211, 47, 47, 0.12)' : 'rgba(237, 108, 2, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.2
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' }, 
                      justifyContent: 'space-between', 
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 1.5
                    }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          bgcolor: student.severity === 'Critical' ? '#d32f2f15' : '#ed6c0215',
                          color: student.severity === 'Critical' ? '#d32f2f' : '#ed6c02',
                          border: `1px solid ${student.severity === 'Critical' ? '#d32f2f22' : '#ed6c0222'}`
                        }}>
                          {student.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.78rem', color: 'secondary.main', lineHeight: 1.1 }}>
                            {student.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.62rem', fontWeight: 600 }}>
                            {student.batch}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                        <Chip 
                          label={student.category.toUpperCase()}
                          size="small"
                          sx={{ height: 18, fontSize: '0.58rem', fontWeight: 900, bgcolor: 'rgba(0,0,0,0.05)', color: 'secondary.main', borderRadius: '4px' }}
                        />
                        <Chip 
                          label={student.severity.toUpperCase()}
                          size="small"
                          sx={{ 
                            height: 18, 
                            fontSize: '0.58rem', 
                            fontWeight: 900, 
                            bgcolor: student.severity === 'Critical' ? '#d32f2f' : '#ed6c02', 
                            color: 'white', 
                            borderRadius: '4px' 
                          }}
                        />
                      </Stack>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.primary', display: 'block', fontSize: '0.72rem', fontWeight: 500, pl: 0.1, lineHeight: 1.3 }}>
                      {student.details}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', borderTop: '1px dashed rgba(0,0,0,0.06)', pt: 1 }}>
                      <Button 
                        size="small"
                        onClick={() => handleIntervention(student.name, 'Activity Update')}
                        sx={{ 
                          py: 0.3, 
                          px: 1.2, 
                          fontSize: '0.62rem', 
                          fontWeight: 800, 
                          borderRadius: '4px',
                          color: 'text.secondary',
                          bgcolor: 'rgba(0,0,0,0.02)',
                          textTransform: 'none',
                          letterSpacing: '0.01em',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                        }}
                      >
                        Sync Activity
                      </Button>
                      <Button 
                        size="small"
                        variant="contained"
                        color={student.severity === 'Critical' ? 'error' : 'warning'}
                        onClick={() => handleIntervention(student.name, 'Facilitator Alert')}
                        startIcon={<Send sx={{ fontSize: '0.62rem !important' }} />}
                        sx={{ 
                          py: 0.3, 
                          px: 1.4, 
                          fontSize: '0.62rem', 
                          fontWeight: 800, 
                          borderRadius: '4px',
                          textTransform: 'none',
                          letterSpacing: '0.01em',
                          boxShadow: 'none',
                          '&:hover': { boxShadow: 'none' }
                        }}
                      >
                        Alert
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>

            {/* Section 6: Scrum Insight Panel */}
            <Card sx={{ 
              p: 2.5, 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '6px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.01)', 
              bgcolor: 'white', 
              height: { xs: 'auto', md: 400 }, 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%'
            }}>
              <Box sx={{ pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                    Scrum Insight Panel
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                gap: 2, 
                flexGrow: 1, 
                minHeight: 0, 
                pt: 1.5, 
                overflowY: 'auto' 
              }}>
                
                {/* Column 1: Blocked */}
                <Box sx={{ 
                  borderRight: { sm: '1px solid rgba(0,0,0,0.08)' }, 
                  pr: { sm: 2 }, 
                  pb: { xs: 2, sm: 0 },
                  borderBottom: { xs: '1px solid rgba(0,0,0,0.08)', sm: 'none' },
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.2,
                  minWidth: 0
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main' }} />
                    <Typography variant="caption" fontWeight={900} color="error.main" sx={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>BLOCKED ({SCRUM_INSIGHT_DATA.blocked.length})</Typography>
                  </Box>
                  
                  <Stack spacing={1} sx={{ overflowY: 'auto', flexGrow: 1, pr: 0.5 }}>
                    {SCRUM_INSIGHT_DATA.blocked.map((blocker, idx) => (
                      <Box key={idx} sx={{ p: 1.2, border: '1px solid rgba(211, 47, 47, 0.15)', bgcolor: 'rgba(211, 47, 47, 0.015)', borderRadius: '8px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'secondary.main' }}>{blocker.name}</Typography>
                          <Chip label={blocker.duration} size="small" color="error" sx={{ height: 16, fontSize: '0.58rem', fontWeight: 900, borderRadius: '4px' }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.68rem', lineHeight: 1.25 }}>
                          {blocker.detail}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Column 2: Silent */}
                <Box sx={{ 
                  borderRight: { sm: '1px solid rgba(0,0,0,0.08)' }, 
                  px: { sm: 2 }, 
                  pb: { xs: 2, sm: 0 },
                  borderBottom: { xs: '1px solid rgba(0,0,0,0.08)', sm: 'none' },
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.2,
                  minWidth: 0
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    <Typography variant="caption" fontWeight={900} color="warning.main" sx={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>SILENT ({SCRUM_INSIGHT_DATA.silent.length})</Typography>
                  </Box>

                  <Stack spacing={1} sx={{ overflowY: 'auto', flexGrow: 1, pr: 0.5 }}>
                    {SCRUM_INSIGHT_DATA.silent.map((silent, idx) => (
                      <Box key={idx} sx={{ p: 1.2, border: '1px solid rgba(237, 108, 2, 0.15)', bgcolor: 'rgba(237, 108, 2, 0.015)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'secondary.main' }}>{silent.name}</Typography>
                        <Chip label={silent.duration} size="small" color="warning" sx={{ height: 16, fontSize: '0.58rem', fontWeight: 900, borderRadius: '4px' }} />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Column 3: Contributors */}
                <Box sx={{ 
                  pl: { sm: 1 }, 
                  pt: { xs: 1, sm: 0 },
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.2,
                  minWidth: 0
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="caption" fontWeight={900} color="success.main" sx={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>PEER SAVIORS ({SCRUM_INSIGHT_DATA.contributors.length})</Typography>
                  </Box>

                  <Stack spacing={1} sx={{ overflowY: 'auto', flexGrow: 1, pr: 0.5 }}>
                    {SCRUM_INSIGHT_DATA.contributors.map((c, idx) => (
                      <Box key={idx} sx={{ p: 1.2, border: '1px solid rgba(46, 125, 50, 0.15)', bgcolor: 'rgba(46, 125, 50, 0.015)', borderRadius: '8px' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'secondary.main', mb: 0.2 }}>{c.name}</Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          <Chip label={c.score} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, borderRadius: '4px', color: '#2e7d32', borderColor: '#2e7d3230' }} />
                          <Chip label={c.help} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, borderRadius: '4px', bgcolor: '#2e7d3210', color: '#2e7d32' }} />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>

              </Box>
            </Card>

          </Box>

          {/* Section 5: Attendance + Interview Analytics (Charts) */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, 
            gap: 2, 
            width: '100%' 
          }}>
            
            {/* Attendance trajectory Chart */}
            <Card sx={{ 
              p: 2, 
              borderRadius: '6px', 
              border: '1px solid rgba(0,0,0,0.05)', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.01)', 
              bgcolor: 'white', 
              height: 320, 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%'
            }}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                    Attendance Trajectory
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => toast.info('Attendance Trajectory details.')}>
                  <MoreVert sx={{ fontSize: '0.9rem' }} />
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', height: 230 }}>
                <LineChart
                  xAxis={[{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], scaleType: 'point' }]}
                  series={[
                    {
                      data: [92, 95, 88, 94, 96, 90, 93],
                      area: true,
                      color: '#E8391D',
                      label: 'Attendance Ratio (%)',
                    },
                  ]}
                  margin={{ top: 10, bottom: 25, left: 30, right: 10 }}
                />
              </Box>
            </Card>

            {/* Interview outcome analytics Chart */}
            <Card sx={{ 
              p: 2, 
              borderRadius: '6px', 
              border: '1px solid rgba(0,0,0,0.05)', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.01)', 
              bgcolor: 'white', 
              height: 320, 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%'
            }}>
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
                    Interview Outcome Analysis
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => toast.info('Interview Outcome details.')}>
                  <MoreVert sx={{ fontSize: '0.9rem' }} />
                </IconButton>
              </Box>
              <Box sx={{ width: '100%', height: 230 }}>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: ['HTML', 'JS', 'React', 'Node', 'DB'] }]}
                  series={[{ data: [98, 82, 75, 88, 92], color: '#1E2126', label: 'Pass Rate (%)' }]}
                  margin={{ top: 10, bottom: 25, left: 30, right: 10 }}
                />
              </Box>
            </Card>

          </Box>



          {/* Section 8: Export & Report Actions (Footer Toolbar) */}
          <Card sx={{ 
            borderRadius: '6px', 
            border: '1px solid rgba(0,0,0,0.05)', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
            bgcolor: 'white'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' }, 
                gap: 2 
              }}>
                
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Info sx={{ color: 'primary.main', fontSize: '0.85rem' }} /> Action Operations
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.68rem' }}>
                    Generate formal logs, print spreadsheets, or share secure snapshots
                  </Typography>
                </Box>

                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    flexWrap: 'wrap', 
                    gap: 1,
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                  }}
                >
                  
                  {/* Export PDF Button */}
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => triggerExport('PDF')}
                    startIcon={<PictureAsPdf sx={{ fontSize: '0.85rem !important' }} />}
                    sx={{ 
                      color: '#E8391D', 
                      borderColor: 'rgba(232, 57, 29, 0.15)',
                      bgcolor: 'rgba(232, 57, 29, 0.01)',
                      borderRadius: 1.5,
                      px: 1.8,
                      py: 0.6,
                      fontSize: '0.65rem',
                      flex: { xs: 1, sm: 'none' },
                      '&:hover': {
                        borderColor: '#E8391D',
                        bgcolor: 'rgba(232, 57, 29, 0.04)'
                      }
                    }}
                  >
                    Export PDF
                  </Button>

                  {/* Export Excel Button */}
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => triggerExport('Excel')}
                    startIcon={<InsertDriveFile sx={{ fontSize: '0.85rem !important' }} />}
                    sx={{ 
                      color: '#2e7d32', 
                      borderColor: 'rgba(46, 125, 50, 0.15)',
                      bgcolor: 'rgba(46, 125, 50, 0.01)',
                      borderRadius: 1.5,
                      px: 1.8,
                      py: 0.6,
                      fontSize: '0.65rem',
                      flex: { xs: 1, sm: 'none' },
                      '&:hover': {
                        borderColor: '#2e7d32',
                        bgcolor: 'rgba(46, 125, 50, 0.04)'
                      }
                    }}
                  >
                    Excel
                  </Button>

                  {/* Share Snapshot Button */}
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => triggerExport('Snapshot Share')}
                    startIcon={<Share sx={{ fontSize: '0.85rem !important' }} />}
                    sx={{ 
                      color: 'secondary.main', 
                      borderColor: 'rgba(0,0,0,0.08)',
                      borderRadius: 1.5,
                      px: 1.8,
                      py: 0.6,
                      fontSize: '0.65rem',
                      flex: { xs: 1, sm: 'none' },
                      '&:hover': {
                        borderColor: 'secondary.main',
                        bgcolor: 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    Share
                  </Button>

                  {/* Print Report Button */}
                  <Button 
                    variant="contained" 
                    color="secondary"
                    size="small"
                    onClick={() => triggerExport('Print View')}
                    startIcon={<Print sx={{ fontSize: '0.85rem !important' }} />}
                    sx={{ 
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.6,
                      fontSize: '0.65rem',
                      boxShadow: 'none',
                      flex: { xs: 1, sm: 'none' },
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Print
                  </Button>

                </Stack>

              </Box>
            </CardContent>
          </Card>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Reports;
