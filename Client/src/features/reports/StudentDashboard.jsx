import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Avatar,
  ThemeProvider,
  createTheme,
  Divider,
  Paper,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { 
  School, 
  CalendarToday, 
  Assignment, 
  WorkspacePremium, 
  Schedule, 
  Message,
  TrendingUp,
  Stars,
  GroupWork,
  CheckCircle,
  NavigateNext,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';

import * as reportApi from '../../api/reports.api';

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

const ATTENDANCE_DATA = [
  { label: 'Present', value: 85, color: '#2e7d32' },
  { label: 'Late', value: 5, color: '#ed6c02' },
  { label: 'Half Day', value: 3, color: '#ff9800' },
  { label: 'Excused', value: 2, color: '#d32f2f' },
  { label: 'Unexcused', value: 1, color: '#f44336' },
];

const RECENT_STUDENT_ACTIVITY = [
  { actor: 'You', action: 'submitted a leave request for next Monday.', time: '2h ago', color: '#10B981' },
  { actor: 'You', action: 'completed the React evaluation for B-1.', time: '5h ago', color: '#3B82F6' },
  { actor: 'You', action: 'submitted your scrum sync check.', time: 'Yesterday', color: '#EF4444' },
  { actor: 'You', action: 'marked your attendance for today.', time: '2 days ago', color: '#8B5CF6' }
];

const StudentDashboard = ({ user }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
        
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
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}>
                <DashboardIcon />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                  Student Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Hi {user?.name.split(' ')[0]}, welcome back to your academic portal.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Chip
            icon={<CalendarToday sx={{ color: 'primary.main !important' }} />}
            label={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
            sx={{
              fontWeight: 900,
              px: 2,
              bgcolor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 3,
              fontFamily: 'Outfit'
            }}
          />
        </Box>

        <Grid container spacing={4}>
           {/* Left Column: Stats & Lists */}
           <Grid item xs={12} lg={8}>
              <Stack spacing={4}>
                <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                      <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                           <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', color: '#1976d2', borderRadius: 4 }}><Schedule /></Box>
                           <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>ATTENDANCE SCORE</Typography>
                             <Typography variant="h4" fontWeight={900} color="secondary">92%</Typography>
                           </Box>
                        </CardContent>
                      </Card>
                   </Grid>
                   <Grid item xs={12} md={6}>
                      <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                           <Box sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', color: '#2e7d32', borderRadius: 4 }}><WorkspacePremium /></Box>
                           <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>AVG. INTERVIEW SCORE</Typography>
                             <Typography variant="h4" fontWeight={900} color="secondary">8.5 <span style={{ fontSize: '1rem', opacity: 0.5 }}>/ 10</span></Typography>
                           </Box>
                        </CardContent>
                      </Card>
                   </Grid>
                </Grid>

                <Grid container spacing={4}>
                   <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Assignment color="primary" /> Upcoming Sessions
                        </Typography>
                        <Card sx={{ borderStyle: 'dashed', border: '1px solid', borderColor: 'divider' }}>
                          <CardContent sx={{ p: 3 }}>
                             <Box sx={{ p: 2.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4, mb: 2 }}>
                               <Typography variant="subtitle2" fontWeight={900}>Technical Interview #3</Typography>
                               <Typography variant="caption" color="text.secondary" fontWeight={700}>MAY 15, 2026 • 10:00 AM</Typography>
                               <Box sx={{ mt: 1.5 }}><Chip label="SCHEDULED" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} /></Box>
                             </Box>
                             <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', display: 'block' }}>No other interviews scheduled yet.</Typography>
                          </CardContent>
                        </Card>
                      </Stack>
                   </Grid>

                   <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Message color="primary" /> Recent Feedback
                        </Typography>
                        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                          <CardContent sx={{ p: 3 }}>
                             <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                               <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8, mb: 3 }}>
                                 "Great understanding of React hooks. Need to work more on CSS Grid layouts."
                               </Typography>
                               <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="caption" fontWeight={900}>— FACILITATOR JOHN</Typography>
                                  <Chip label="8 / 10" size="small" color="primary" sx={{ fontWeight: 900 }} />
                               </Stack>
                             </Box>
                          </CardContent>
                        </Card>
                      </Stack>
                   </Grid>
                </Grid>
              </Stack>
           </Grid>

           {/* Right Column: Attendance Pie Chart & Recent Activity */}
           <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                     <Typography variant="h6" fontWeight={900} color="secondary">Attendance Insight</Typography>
                     <Typography variant="caption" fontWeight={700} color="text.secondary">7-DAY HISTORICAL SNAPSHOT</Typography>
                  </Box>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                     <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <PieChart
                          series={[{
                            data: ATTENDANCE_DATA,
                            innerRadius: 60,
                            outerRadius: 100,
                            paddingAngle: 5,
                            cornerRadius: 5,
                          }]}
                          width={300}
                          height={250}
                        />
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                           <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block' }}>RECORDS</Typography>
                           <Typography variant="h4" fontWeight={900} color="secondary">92</Typography>
                        </Box>
                     </Box>
                     <Stack spacing={1.5} sx={{ width: '100%', mt: 4 }}>
                        <Grid container spacing={1}>
                          {ATTENDANCE_DATA.map(d => (
                            <Grid item xs={6} key={d.label}>
                               <Stack direction="row" spacing={1} alignItems="center">
                                  <Box sx={{ width: 8, height: 8, bgcolor: d.color, borderRadius: '50%' }} />
                                  <Typography variant="caption" fontWeight={900} color="text.secondary">{d.label.toUpperCase()}</Typography>
                               </Stack>
                            </Grid>
                          ))}
                        </Grid>
                     </Stack>
                  </CardContent>
                </Card>

                {/* Student Recent Activity Card */}
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: 'text.secondary', letterSpacing: '0.1em', mb: 3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, color: 'primary.main' }} />
                      Recent Activity
                    </Typography>
                    <Box sx={{ pl: 2, borderLeft: '2px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 3.5, my: 1 }}>
                      {RECENT_STUDENT_ACTIVITY.map((item, i) => (
                        <Box key={i} sx={{ position: 'relative', pl: 1 }}>
                          {/* dot */}
                          <Box sx={{
                            position: 'absolute', left: -24, top: 4,
                            width: 10, height: 10, borderRadius: '2px', // Square dot shape matching "no rounded shape"
                            bgcolor: item.color,
                            border: '2px solid white',
                            boxShadow: '0 0 0 2px #E5E7EB'
                          }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', lineHeight: 1.4 }}>
                              {item.actor}{' '}
                              <span style={{ fontWeight: 500, color: '#4B5563' }}>{item.action}</span>
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600 }}>
                              {item.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
           </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
};

export default StudentDashboard;
