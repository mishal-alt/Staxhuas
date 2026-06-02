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
  Link as MuiLink
} from '@mui/material';
import {
  People,
  CheckCircle,
  Schedule,
  ArrowForward,
  CalendarToday,
  AssignmentInd,
  NavigateNext,
  Dashboard as DashboardIcon,
  Assessment
} from '@mui/icons-material';

import * as interviewApi from '../../api/interviews.api';

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

const InterviewerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['my-assigned-interviews'],
    queryFn: () => interviewApi.getInterviews()
  });

  const interviews = interviewsRes?.data || [];
  const completedInterviews = interviews.filter(i => ['passed', 'failed', 're_interview_required', 'completed'].includes(i.status));
  const pendingInterviews = interviews.filter(i => !['passed', 'failed', 're_interview_required', 'completed'].includes(i.status));

  const stats = [
    { label: 'Assigned Total', value: interviews.length, icon: <People />, color: '#1976d2' },
    { label: 'Completed', value: completedInterviews.length, icon: <CheckCircle />, color: '#2e7d32' },
    { label: 'Pending Assessment', value: pendingInterviews.length, icon: <Schedule />, color: '#E8391D' },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', py: 2.5, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 2.5, pb: 8 }}>

        {/* Header */}
        <Box sx={{
          pt: 4,
          pb: 3,
          px: { xs: 3, md: 4.5 },
          mx: { xs: -3, md: -4.5 },
          mt: -2.5,
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          mb: 1,
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
                DASHBOARD
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                EVALUATOR DASHBOARD
              </Typography>
            </Breadcrumbs>

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
                <DashboardIcon />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  Evaluator Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Welcome back, <b>{user?.name}</b>. You have {pendingInterviews.length} pending evaluations.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<CalendarToday sx={{ color: 'primary.main !important', fontSize: '0.78rem' }} />}
              label={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
              sx={{
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '0.04em',
                px: 1,
                bgcolor: 'rgba(232, 57, 29, 0.04)',
                border: '1px solid rgba(232, 57, 29, 0.15)',
                color: 'primary.main',
                borderRadius: '6px',
                fontFamily: 'Outfit',
                height: 28
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => navigate('/reports')}
              startIcon={<Assessment sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '0.7rem',
                borderRadius: '6px',
                height: 28,
                py: 0.5,
                px: 1.5,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(232, 57, 29, 0.04)',
                  borderColor: 'primary.dark'
                }
              }}
            >
              Reports
            </Button>
          </Stack>
        </Box>

        {/* Quick Stats Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, minmax(0, 1fr))'
          },
          gap: 2
        }}>
          {stats.map((stat, i) => (
            <Box key={i} sx={{ minWidth: 0 }}>
              <Card sx={{ 
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                borderLeft: `4px solid ${stat.color}`,
                bgcolor: 'white',
                border: '1px solid #E5E7EB',
                borderLeftWidth: 4,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                height: '100%',
                '&:hover': { 
                  transform: 'translateY(-1.5px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                } 
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography 
                        variant="caption" 
                        fontWeight={900} 
                        color="text.secondary" 
                        sx={{ 
                          letterSpacing: '0.08em', 
                          fontSize: '0.62rem',
                          textTransform: 'uppercase',
                          display: 'block',
                          mb: 0.25
                        }}
                      >
                        {stat.label}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        fontWeight={950} 
                        color="secondary" 
                        sx={{ fontSize: '1.65rem', fontFamily: 'Outfit', lineHeight: 1.1 }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: `${stat.color}08`, 
                      color: stat.color, 
                      borderRadius: '6px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: `1px solid ${stat.color}12`
                    }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 16 } })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.55fr) minmax(320px, 0.85fr)'
          },
          alignItems: 'start',
          gap: 2.5
        }}>
          {/* Action List - Primary Column */}
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.5, borderBottom: '1px solid #E5E7EB' }}>
                <Typography variant="subtitle1" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                  <AssignmentInd sx={{ color: 'primary.main', fontSize: 16 }} /> UPCOMING SESSIONS
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/my-interviews')} 
                  endIcon={<ArrowForward sx={{ fontSize: 12 }} />} 
                  sx={{ 
                    fontWeight: 800, 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.01em', 
                    textTransform: 'none',
                    p: 0,
                    minWidth: 0,
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  View All
                </Button>
              </Box>

              <Stack spacing={1}>
                {pendingInterviews.slice(0, 5).map(interview => {
                  const hasMeetingLink = interview.meetingLink && !['passed', 'failed', 're_interview_required', 'completed'].includes(interview.status);
                  return (
                    <Card
                      key={interview._id}
                      sx={{ 
                        transition: 'all 0.15s ease-in-out', 
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer',
                        '&:hover': { 
                          borderColor: 'primary.main', 
                          bgcolor: 'rgba(232, 57, 29, 0.005)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        } 
                      }}
                      onClick={() => navigate(`/interviews/${interview._id}`)}
                    >
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ 
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'minmax(180px, 1fr) minmax(190px, 0.95fr) auto'
                          },
                          alignItems: { xs: 'stretch', sm: 'center' },
                          gap: 1.5,
                          width: '100%'
                        }}>
                          {/* LEFT: Student details */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                            <Avatar sx={{ 
                              bgcolor: 'secondary.main', 
                              color: 'white', 
                              fontWeight: 850, 
                              borderRadius: '4px',
                              width: 34,
                              height: 34,
                              fontSize: '0.85rem',
                              fontFamily: 'Outfit'
                            }}>
                              {interview.student?.name?.[0]}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" fontWeight={855} color="secondary" sx={{ fontFamily: 'Outfit', lineHeight: 1.2, mb: 0.1, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {interview.student?.name}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                <Chip 
                                  label={interview.student?.batch?.name || 'MERN-B1'} 
                                  size="small" 
                                  sx={{ 
                                    height: 15, 
                                    fontSize: '0.55rem', 
                                    fontWeight: 800, 
                                    bgcolor: 'rgba(30, 33, 38, 0.05)', 
                                    color: 'secondary.main', 
                                    borderRadius: '3px' 
                                  }} 
                                />
                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', minWidth: 0 }}>
                                  {interview.module?.name}
                                </Typography>
                              </Stack>
                            </Box>
                          </Box>

                          {/* CENTER: Interview schedule metadata */}
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 0.25,
                            pl: { sm: 2 },
                            borderLeft: { sm: '1px solid #E5E7EB' },
                            minWidth: 0
                          }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: 'wrap', rowGap: 0.25 }}>
                              <Typography 
                                variant="caption" 
                                fontWeight={855} 
                                color="primary.main" 
                                sx={{ 
                                  letterSpacing: '0.06em', 
                                  fontSize: '0.55rem', 
                                  textTransform: 'uppercase',
                                  bgcolor: 'rgba(232, 57, 29, 0.05)',
                                  px: 0.6,
                                  borderRadius: '2px'
                                }}
                              >
                                Technical
                              </Typography>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                Attempt #{(interview.reInterviewAttempt || 0) + 1}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ color: 'text.secondary', flexWrap: 'wrap', rowGap: 0.25 }}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarToday sx={{ fontSize: 10 }} />
                                <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>
                                  {interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase() : ''}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Schedule sx={{ fontSize: 10 }} />
                                <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>
                                  {interview.scheduledDate ? new Date(interview.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>

                          {/* RIGHT: Actions */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            justifyContent: 'flex-end', 
                            width: { xs: '100%', sm: 'auto' },
                            minWidth: { sm: 180 },
                            '& .MuiButton-root': { flexShrink: 0 }
                          }}>
                            {hasMeetingLink && (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                href={interview.meetingLink}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                  textTransform: 'none',
                                  fontWeight: 900,
                                  fontSize: '0.65rem',
                                  borderRadius: '3px',
                                  py: 0.3,
                                  px: 1.5,
                                  height: 25,
                                  boxShadow: 'none',
                                  letterSpacing: '0.02em',
                                  '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: 'none'
                                  }
                                }}
                              >
                                Join
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/interviews/${interview._id}`);
                              }}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                borderRadius: '3px',
                                py: 0.3,
                                px: 1.5,
                                height: 25,
                                borderColor: '#E5E7EB',
                                color: 'secondary.main',
                                '&:hover': {
                                  borderColor: 'secondary.main',
                                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                                }
                              }}
                            >
                              Evaluate
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
                {pendingInterviews.length === 0 && (
                  <Paper variant="outlined" sx={{ 
                    p: 4.5, 
                    textAlign: 'center', 
                    borderRadius: '6px', 
                    borderStyle: 'dashed', 
                    borderColor: '#D1D5DB',
                    bgcolor: 'transparent'
                  }}>
                    <AssignmentInd sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="subtitle2" fontWeight={850} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 0.5, letterSpacing: '0.04em' }}>
                      No Pending Sessions
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      You are completely caught up! New sessions assigned to you will appear here.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Stack>
          </Box>

          {/* History Column - Secondary Column */}
          <Box sx={{ minWidth: 0 }}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', pb: 0.5, borderBottom: '1px solid #E5E7EB', height: 24.5 }}>
                <Typography variant="subtitle1" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                  <CheckCircle sx={{ color: '#2e7d32', fontSize: 16 }} /> RECENTLY COMPLETED
                </Typography>
              </Box>

              <Stack spacing={1}>
                {completedInterviews.slice(0, 5).map(interview => {
                  const isPass = interview.status === 'passed';
                  const isReinterview = interview.status === 're_interview_required';
                  
                  let outcomeLabel = 'PASSED';
                  let outcomeBg = 'rgba(46, 125, 50, 0.06)';
                  let outcomeText = '#2e7d32';
                  let outcomeBorder = 'rgba(46, 125, 50, 0.15)';
                  let accentColor = '#2e7d32';
                  
                  if (interview.status === 'failed') {
                    outcomeLabel = 'FAILED';
                    outcomeBg = 'rgba(198, 40, 40, 0.06)';
                    outcomeText = '#c62828';
                    outcomeBorder = 'rgba(198, 40, 40, 0.15)';
                    accentColor = '#c62828';
                  } else if (isReinterview) {
                    outcomeLabel = 'RE-INTERVIEW';
                    outcomeBg = 'rgba(239, 108, 0, 0.06)';
                    outcomeText = '#ef6c00';
                    outcomeBorder = 'rgba(239, 108, 0, 0.15)';
                    accentColor = '#ef6c00';
                  }

                  const feedbackPreview = interview.remarks || interview.facilitatorEvaluation || '';

                  return (
                    <Card 
                      key={interview._id} 
                      sx={{ 
                        bgcolor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderLeft: `3px solid ${accentColor}`,
                        transition: 'all 0.15s ease-in-out',
                        '&:hover': {
                          borderColor: '#D1D5DB',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          
                          {/* Top row */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                              <Avatar sx={{ 
                                bgcolor: 'secondary.main', 
                                color: 'white', 
                                fontWeight: 850, 
                                borderRadius: '4px',
                                width: 32,
                                height: 32,
                                fontSize: '0.8rem',
                                fontFamily: 'Outfit'
                              }}>
                                {interview.student?.name?.[0]}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={850} color="secondary" sx={{ fontFamily: 'Outfit', fontSize: '0.82rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {interview.student?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {interview.module?.name}
                                </Typography>
                              </Box>
                            </Stack>
                            
                            <Chip 
                              label={outcomeLabel} 
                              size="small" 
                              sx={{ 
                                fontWeight: 850, 
                                fontSize: '0.58rem', 
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                bgcolor: outcomeBg,
                                color: outcomeText,
                                border: `1px solid ${outcomeBorder}`,
                                borderRadius: '3px',
                                height: 16,
                                flexShrink: 0
                              }} 
                            />
                          </Box>

                          {/* Remarks preview */}
                          {feedbackPreview && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                fontSize: '0.72rem', 
                                fontStyle: 'italic',
                                pl: 1,
                                borderLeft: '2px solid #E5E7EB',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              "{feedbackPreview}"
                            </Typography>
                          )}

                          {/* Footer details (timestamp, scores) */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5, borderTop: '1px dashed #E5E7EB' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.62rem' }}>
                              Score: <b>{interview.score || 0}</b> / {interview.maxScore || 40} ({Math.round(interview.percentage || 0)}%)
                            </Typography>
                            {interview.completedAt && (
                              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.62rem' }}>
                                {new Date(interview.completedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                              </Typography>
                            )}
                          </Box>

                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
                {completedInterviews.length === 0 && (
                  <Paper variant="outlined" sx={{ 
                    p: 4.5, 
                    textAlign: 'center', 
                    borderRadius: '6px', 
                    borderStyle: 'dashed', 
                    borderColor: '#D1D5DB',
                    bgcolor: 'transparent'
                  }}>
                    <CheckCircle sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="subtitle2" fontWeight={855} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 0.5, letterSpacing: '0.04em' }}>
                      No Completed Sessions Yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed assessments and scores will be archived here.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default InterviewerDashboard;
