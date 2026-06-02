import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Chip, 
  IconButton, 
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  Avatar,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  People, 
  Info, 
  CheckCircle, 
  Chat, 
  Schedule, 
  ArrowForward,
  Bolt,
  Forum,
  NavigateNext
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';

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
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #E5E7EB',
        }
      }
    }
  }
});

const DUMMY_SCRUM = [
  { id: 1, batch: 'MERN-B1', time: '10:00 AM', status: 'Completed', attendees: 12, blockers: 2, color: '#2e7d32' },
  { id: 2, batch: 'MERN-B2', time: '11:30 AM', status: 'In Progress', attendees: 14, blockers: 0, color: '#E8391D' },
  { id: 3, batch: 'FS-JAVA-02', time: '02:00 PM', status: 'Scheduled', attendees: 8, blockers: 0, color: '#9e9e9e' },
];

const ScrumManagement = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
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
                  component={Link} 
                  to="/dashboard" 
                  underline="none" 
                  color="text.secondary" 
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  DASHBOARD
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  SCRUM TRACKER
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
                  <Forum fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Scrum Tracker
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Mandatory daily progress sync and blocker tracking per batch
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Chip 
              label="SYNC DATE: MAY 30, 2026" 
              sx={{ 
                bgcolor: 'secondary.main', 
                color: 'white', 
                fontWeight: 900, 
                px: 2,
                borderRadius: 2,
                fontSize: '0.75rem'
              }} 
            />
          </Box>

          {/* Scrum Cards */}
          <Grid container spacing={4}>
            {DUMMY_SCRUM.map((session) => (
              <Grid item xs={12} md={4} key={session.id}>
                <Card sx={{ borderLeft: `8px solid ${session.color}`, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h5" fontWeight={900}>{session.batch}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                            {session.time}
                          </Typography>
                        </Stack>
                      </Box>
                      <Chip 
                        label={session.status} 
                        size="small" 
                        sx={{ 
                          fontWeight: 900, 
                          bgcolor: `${session.color}10`, 
                          color: session.color,
                          borderRadius: 2
                        }} 
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 4, textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>ATTENDEES</Typography>
                          <Typography variant="h6" fontWeight={900}>{session.attendees}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: session.blockers > 0 ? 'rgba(232, 57, 29, 0.05)' : 'background.default', borderRadius: 4, textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={900} color={session.blockers > 0 ? 'primary.main' : 'text.secondary'} sx={{ letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>BLOCKERS</Typography>
                          <Typography variant="h6" fontWeight={900} color={session.blockers > 0 ? 'primary.main' : 'inherit'}>{session.blockers}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Button 
                      fullWidth 
                      variant={session.status === 'Scheduled' ? 'contained' : 'outlined'} 
                      color="secondary"
                      disableElevation
                      sx={{ borderRadius: 4, py: 1.5 }}
                    >
                      {session.status === 'Scheduled' ? 'Start Session' : 'View Summary'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Blockers Feed */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(232, 57, 29, 0.05)', color: 'primary.main', borderRadius: 4 }}>
                  <Forum />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={900} color="secondary">Active Blockers</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Priority issues reported during today's sessions.</Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {[
                  { student: 'Hrithic Raj', batch: 'MERN-B1', issue: 'Deployment failed on AWS due to IAM permissions.', time: '10:05 AM' },
                  { student: 'Rahul V', batch: 'FS-JAVA-02', issue: 'Maven dependency conflict in Module 8 task.', time: '02:15 PM' },
                ].map((blocker, i) => (
                  <Paper 
                    key={i} 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'background.default', 
                      borderRadius: 4, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'white' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box sx={{ width: 4, height: 40, bgcolor: 'primary.main', borderRadius: 2 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={800} sx={{ mb: 0.5 }}>{blocker.issue}</Typography>
                        <Stack direction="row" spacing={2} divider={<Typography variant="caption" sx={{ opacity: 0.3 }}>•</Typography>}>
                           <Typography variant="caption" fontWeight={900} color="text.secondary">{blocker.student.toUpperCase()}</Typography>
                           <Typography variant="caption" fontWeight={900} color="text.secondary">{blocker.batch}</Typography>
                           <Typography variant="caption" fontWeight={900} color="primary.main">{blocker.time}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                    <Button size="small" sx={{ fontWeight: 900 }}>Resolve</Button>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default ScrumManagement;
