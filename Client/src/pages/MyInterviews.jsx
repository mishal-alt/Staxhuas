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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showOnlyScheduled, setShowOnlyScheduled] = React.useState(false);

  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['my-interviews-list'],
    queryFn: () => interviewApi.getInterviews()
  });

  const interviews = interviewsRes?.data || [];

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

  const filteredInterviews = interviews.filter((interview) => {
    const studentName = interview.student?.name?.toLowerCase() || '';
    const moduleName = interview.module?.name?.toLowerCase() || '';
    const batchName = interview.student?.batch?.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = studentName.includes(query) || moduleName.includes(query) || batchName.includes(query);
    const matchesStatus = !showOnlyScheduled || ['scheduled', 'in_progress', 'in-progress'].includes(interview.status);
    
    return matchesSearch && matchesStatus;
  });

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

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
                <TextField
                  placeholder="Search student, batch, module..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    bgcolor: 'white',
                    width: { xs: '100%', md: 280 },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.85rem',
                      height: 40,
                      '& fieldset': { borderColor: '#E5E7EB' },
                      '&:hover fieldset': { borderColor: 'text.secondary' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary', fontSize: 18 }} />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant={showOnlyScheduled ? 'contained' : 'outlined'}
                  color={showOnlyScheduled ? 'primary' : 'secondary'}
                  onClick={() => setShowOnlyScheduled(!showOnlyScheduled)}
                  startIcon={<FilterList sx={{ fontSize: 16 }} />}
                  sx={{
                    height: 40,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.02em',
                    borderColor: showOnlyScheduled ? 'primary.main' : '#E5E7EB',
                    color: showOnlyScheduled ? 'white' : 'text.secondary',
                    px: 2,
                    borderRadius: '6px',
                    '&:hover': {
                      borderColor: showOnlyScheduled ? 'primary.dark' : 'text.primary',
                      bgcolor: showOnlyScheduled ? 'primary.dark' : 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  {showOnlyScheduled ? 'Scheduled Only' : 'All Statuses'}
                </Button>
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
              filteredInterviews.map((interview) => (
                <Card
                  key={interview._id}
                  onClick={() => navigate(`/interviews/${interview._id}`)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid #E5E7EB',
                    bgcolor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: 'primary.main',
                      boxShadow: '0 10px 20px -5px rgba(232, 57, 29, 0.05), 0 4px 8px -2px rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', md: 'row' }, 
                      alignItems: { xs: 'stretch', md: 'center' }, 
                      justifyContent: 'space-between', 
                      gap: { xs: 2.5, md: 3 }, 
                      width: '100%' 
                    }}>
                      
                      {/* Left Side: Student Profile & Schedule */}
                      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 44, 
                              height: 44, 
                              bgcolor: 'secondary.main', 
                              color: 'white',
                              fontWeight: 850, 
                              borderRadius: '6px', 
                              fontSize: '1.1rem', 
                              fontFamily: 'Outfit',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}
                          >
                            {interview.student?.name?.[0]}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={800} color="secondary" sx={{ fontFamily: 'Outfit', lineHeight: 1.2, mb: 0.5, fontSize: '0.95rem' }}>
                              {interview.student?.name}
                            </Typography>
                            
                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ gap: '6px' }}>
                              <Chip 
                                label={interview.student?.batch?.name || 'MERN-B1'} 
                                size="small" 
                                sx={{ 
                                  height: 18, 
                                  fontSize: '0.62rem', 
                                  fontWeight: 800, 
                                  bgcolor: 'rgba(30, 33, 38, 0.05)', 
                                  color: 'secondary.main', 
                                  borderRadius: '4px' 
                                }} 
                              />
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarToday sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  {format(new Date(interview.scheduledDate), 'dd MMM yyyy')}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Schedule sx={{ fontSize: 12, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                  {format(new Date(interview.scheduledDate), 'hh:mm a')}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Center: Assessment Metadata */}
                      <Box sx={{ 
                        pl: { md: 4 }, 
                        borderLeft: { md: '1px solid #F1F1EF' },
                        flex: 1,
                        width: { xs: '100%', md: 'auto' },
                        mt: { xs: 1, md: 0 }
                      }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography 
                            variant="caption" 
                            fontWeight={855} 
                            color="primary.main" 
                            sx={{ 
                              letterSpacing: '0.08em', 
                              fontSize: '0.62rem', 
                              textTransform: 'uppercase',
                              bgcolor: 'rgba(232, 57, 29, 0.05)',
                              px: 1,
                              py: 0.2,
                              borderRadius: '3px'
                            }}
                          >
                            Technical Round
                          </Typography>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            • Attempt #{(interview.reInterviewAttempt || 0) + 1}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={850} color="secondary" sx={{ fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                          {interview.module?.name}
                        </Typography>
                      </Box>

                      {/* Right Side: Status & Actions */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        justifyContent: { xs: 'space-between', md: 'flex-end' },
                        width: { xs: '100%', md: 'auto' },
                        ml: { md: 'auto' },
                        mt: { xs: 1, md: 0 }
                      }}>
                        {getStatusChip(interview.status)}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {interview.meetingLink && !['passed', 'failed', 're_interview_required', 'completed'].includes(interview.status) && (
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
                                fontSize: '0.7rem',
                                borderRadius: '6px',
                                py: 0.5,
                                px: 1.8,
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
                              fontSize: '0.7rem',
                              borderRadius: '6px',
                              py: 0.5,
                              px: 1.8,
                              borderColor: '#E5E7EB',
                              color: 'secondary.main',
                              '&:hover': {
                                borderColor: 'secondary.main',
                                bgcolor: 'rgba(0, 0, 0, 0.02)'
                              }
                            }}
                          >
                            Details
                          </Button>
                        </Box>
                      </Box>

                    </Box>
                  </CardContent>
                </Card>
              ))
            )}

            {filteredInterviews.length === 0 && !isLoading && (
              <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: '6px', borderStyle: 'dashed', borderColor: '#D1D5DB' }}>
                <EventBusy sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
                <Typography variant="subtitle1" fontWeight={900} color="text.primary" sx={{ textTransform: 'uppercase', mb: 0.5 }}>
                  {searchQuery ? 'No matching assessments' : 'No Interviews Assigned'}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {searchQuery 
                    ? `We couldn't find any assessments matching "${searchQuery}". Try adjusting your search query.`
                    : 'Your assessment queue is currently empty. Assigned interviews will appear here.'}
                </Typography>
              </Paper>
            )}
          </Stack>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default MyInterviews;

