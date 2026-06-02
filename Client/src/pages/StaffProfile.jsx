import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CircularProgress,
Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Avatar, 
  IconButton, 
  Grid, 
  Chip,
  Divider,
  ThemeProvider,
  createTheme,
  Button,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { 
  ArrowBack, 
  Email, 
  Shield, 
  EventAvailable,
  Badge,
  TrendingUp,
  AssignmentTurnedIn,
  Groups,
  NavigateNext
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as userApi from '../api/users.api';
import { ROLES } from '../utils/constants';

const theme = createTheme({
  palette: {
    primary: { main: '#E8391D' },
    secondary: { main: '#1E2126' },
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
  },
  shape: { borderRadius: 6 }
});

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userRes, isLoading } = useQuery({
    queryKey: ['staff-profile', id],
    queryFn: () => userApi.getUserById(id)
  });

  if (isLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const user = userRes?.data;

  const stats = [
    { label: 'Role', value: user?.role?.toUpperCase(), icon: <Shield sx={{ fontSize: 20 }} />, color: '#1E2126' },
    { label: 'Status', value: 'ACTIVE', icon: <EventAvailable sx={{ fontSize: 20 }} />, color: '#2E7D32' },
    { label: 'Assignments', value: user?.role === ROLES.FACILITATOR ? '4 Batches' : '12 Interviews', icon: <AssignmentTurnedIn sx={{ fontSize: 20 }} />, color: '#E8391D' },
    { label: 'Network', value: 'Verified', icon: <VerifiedUser sx={{ fontSize: 18 }} />, color: '#0288D1' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8, px: { xs: 2, sm: 0 } }}>
          
          {/* Header */}
          <Box sx={{
            pt: 4,
            pb: 3,
            px: { xs: 3, sm: 6 },
            mx: { xs: -2, sm: -6 },
            mt: -6,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box>
              <Breadcrumbs 
                separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />} 
                sx={{ mb: 1.5 }}
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
                <MuiLink 
                  component={Link} 
                  to="/staff" 
                  underline="none" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  STAFF
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  PROFILE
                </Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                  <ArrowBack fontSize="small" />
                </IconButton>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  p: 1, 
                  borderRadius: 2, 
                  display: 'flex', 
                  boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)' 
                }}>
                  <Badge fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: { xs: '1.25rem', sm: '1.75rem' }, textTransform: 'none' }}>
                    Staff Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Comprehensive overview of facilitator and staff activity
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={{ xs: 3, sm: 4 }} justifyContent="center">
            {/* Left Column: Profile Card */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                <Box sx={{ height: 120, bgcolor: 'secondary.main' }} />
                <CardContent sx={{ textAlign: 'center', mt: -7, px: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 110, 
                      height: 110, 
                      mx: 'auto', 
                      bgcolor: 'primary.main', 
                      fontSize: '2.5rem', 
                      fontWeight: 900,
                      border: '6px solid white',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    {user?.name?.[0]}
                  </Avatar>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 2.5 }}>{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '0.05em' }}>{user?.role?.toUpperCase()}</Typography>
                  
                  <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Email color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={700} sx={{ wordBreak: 'break-all' }}>{user?.email}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Badge color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={700}>ID: {user?._id?.slice(-6).toUpperCase()}</Typography>
                    </Stack>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Stats & Activity */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={{ xs: 3, sm: 4 }}>
                {/* Stats Grid */}
                <Grid container spacing={1.5}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card sx={{ 
                        textAlign: 'center', 
                        p: { xs: 1.5, sm: 3 }, 
                        height: '100%', 
                        borderRadius: 2, 
                        border: '1px solid rgba(0,0,0,0.03)', 
                        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ color: stat.color, mb: { xs: 1, sm: 1.5 }, display: 'flex', justifyContent: 'center' }}>
                          {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 18, sm: 20 } } })}
                        </Box>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ 
                          fontSize: { xs: '0.75rem', sm: '1rem' },
                          lineHeight: 1.2,
                          wordBreak: 'break-word'
                        }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ 
                          letterSpacing: '0.02em', 
                          display: 'block',
                          fontSize: { xs: '0.6rem', sm: '0.75rem' }
                        }}>
                          {stat.label}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Performance Chart Placeholder */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight={900}>Performance Overview</Typography>
                      <TrendingUp color="primary" />
                    </Stack>
                    <Box sx={{ height: 220, bgcolor: 'rgba(0,0,0,0.01)', borderRadius: 2, border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 2 }}>
                      <Typography color="text.secondary" fontWeight={700}>Activity metrics visualizer coming soon</Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Typography variant="h6" fontWeight={900} sx={{ mb: 4 }}>Recent Activity</Typography>
                    <Stack spacing={3}>
                      {[1, 2, 3].map((_, i) => (
                        <Stack key={i} direction="row" spacing={2} alignItems="center">
                          <Box sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: 'rgba(232, 57, 29, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <EventAvailable color="primary" sx={{ fontSize: 22 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={900} sx={{ lineHeight: 1.2 }}>Batch Session Completed</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>2 hours ago • Full Stack Web Development</Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

// Internal component for VerifiedUser since it wasn't in imports
const VerifiedUser = (props) => (
  <Shield {...props} />
);

export default StaffProfile;
