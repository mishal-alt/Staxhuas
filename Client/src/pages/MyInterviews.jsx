import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  InputAdornment,
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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Search,
  FilterList,
  ChevronRight,
  CalendarToday,
  Schedule,
  Group,
  School,
  Assessment,
  EventBusy,
  NavigateNext
} from '@mui/icons-material';

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
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
          }
        }
      }
    }
  }
});

const MyInterviews = () => {
  const navigate = useNavigate();
  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['my-interviews-list'],
    queryFn: () => interviewApi.getInterviews()
  });

  const interviews = interviewsRes?.data || [];

  const getStatusChip = (status) => {
    switch (status) {
      case 'scheduled': return <Chip label="Scheduled" color="info" size="small" sx={{ fontWeight: 900, borderRadius: 1.5 }} />;
      case 'in-progress':
      case 'in_progress': return <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 900, borderRadius: 1.5, animation: 'pulse 2s infinite' }} />;
      case 'scored':
      case 'completed': return <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 900, borderRadius: 1.5 }} />;
      default: return <Chip label={status} size="small" sx={{ fontWeight: 900, borderRadius: 1.5 }} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        <Box sx={{ width: '100%', py: 2.5, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

          {/* Header */}
          <Box sx={{
            pt: 4,
            pb: 3,
            px: { xs: 3, md: 4.5 },
            mx: { xs: -3, md: -4.5 },
            mt: -2.5,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: 3
          }}>
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
                DASHBOARD
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                ASSESSMENT CENTER
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'rgba(232, 57, 29, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main'
                }}>
                  <Assessment />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                    Assessment Center
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Track and conduct technical assessments assigned to you.
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <TextField
                  placeholder="Search student..."
                  size="small"
                  sx={{ bgcolor: 'white', width: { xs: '100%', md: 250 } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
                  }}
                />
                <IconButton sx={{ bgcolor: 'white', border: '1px solid', borderColor: '#E5E7EB', borderRadius: '6px', p: 1 }}>
                  <FilterList sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          {/* Interview List */}
          <Stack spacing={2}>
            {isLoading ? (
              <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="primary" thickness={6} />
              </Box>
            ) : (
              interviews.map((interview) => (
                <Card
                  key={interview._id}
                  onClick={() => navigate(`/interviews/${interview._id}`)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={7}>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main', fontWeight: 900, borderRadius: '6px', fontSize: '1.2rem', fontFamily: 'Outfit' }}>
                            {interview.student?.name?.[0]}
                          </Avatar>
                          <Box>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography variant="subtitle1" fontWeight={900} color="secondary" sx={{ fontFamily: 'Outfit', lineHeight: 1.2 }}>
                                {interview.student?.name}
                              </Typography>
                              {getStatusChip(interview.status)}
                            </Stack>
                            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: '8px' }}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Group sx={{ fontSize: 13, color: '#929292' }} />
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  {interview.student?.batch?.name || 'MERN-B1'}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarToday sx={{ fontSize: 13, color: '#929292' }} />
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  {format(new Date(interview.scheduledDate), 'dd MMM yyyy')}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Schedule sx={{ fontSize: 13, color: '#929292' }} />
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  {format(new Date(interview.scheduledDate), 'hh:mm a')}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pl: { md: 3 }, borderLeft: { md: '1px solid #E5E7EB' } }}>
                          <Box>
                            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 0.2, textTransform: 'uppercase' }}>MODULE ASSESSMENT</Typography>
                            <Typography variant="body2" fontWeight={800} color="secondary" sx={{ fontFamily: 'Outfit' }}>{interview.module?.name}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                            <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.05em' }}>DETAILS</Typography>
                            <ChevronRight sx={{ fontSize: 16 }} />
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}

            {interviews.length === 0 && !isLoading && (
              <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: '6px', borderStyle: 'dashed', borderColor: '#D1D5DB' }}>
                <EventBusy sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={900} color="text.primary" sx={{ textTransform: 'uppercase', mb: 0.5 }}>No Interviews Assigned</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>Your assessment queue is currently empty. Assigned interviews will appear here.</Typography>
              </Paper>
            )}
          </Stack>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default MyInterviews;

