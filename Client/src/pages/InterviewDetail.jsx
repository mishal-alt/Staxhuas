import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CircularProgress,
Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Chip, 
  Avatar, 
  Divider,
  Paper,
  IconButton,
  TextField,
  Rating,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  School, 
  CalendarToday, 
  Schedule, 
  Star, 
  CheckCircle, 
  Cancel, 
  Info, 
  Save, 
  AssignmentInd,
  Feedback,
  ThumbUp,
  ThumbDown,
  NavigateNext
} from '@mui/icons-material';
import { toast } from "sonner";

import AppShell from '../components/layout/AppShell';
import * as interviewApi from '../api/interviews.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

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

const InterviewDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isInterviewer = user?.role === ROLES.INTERVIEWER;
  const assessmentPath = isInterviewer ? '/my-interviews' : '/interviews';
  
  const [formData, setFormData] = useState({
    technicalRating: 0,
    communicationRating: 0,
    strengths: '',
    weaknesses: '',
    recommendation: '',
  });

  const { data: interviewRes, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: () => interviewApi.getInterviewById(id),
    enabled: !!id
  });

  const submitMutation = useMutation({
    mutationFn: (data) => interviewApi.scoreInterview(id, data),
    onSuccess: () => {
      toast.success('Feedback submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['interview', id] });
      navigate('/my-interviews');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit feedback');
    }
  });

  if (isLoading) return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    </AppShell>
  );

  const interview = interviewRes?.data;
  if (!interview) return (
    <AppShell>
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Interview session not found.</Typography>
        <Button onClick={() => navigate('/my-interviews')} sx={{ mt: 2 }}>Return to List</Button>
      </Box>
    </AppShell>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.technicalRating || !formData.communicationRating || !formData.recommendation) {
      return toast.error('Please complete all ratings and recommendations');
    }
    if (formData.strengths.length < 10) {
      return toast.error('Strengths feedback is too short (min 10 characters)');
    }

    submitMutation.mutate({
      ...formData,
      status: 'scored',
      interviewerFeedback: `STRENGTHS: ${formData.strengths}\nWEAKNESSES: ${formData.weaknesses}\nRECOMMENDATION: ${formData.recommendation}`
    });
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
              <MuiLink 
                component={RouterLink} 
                to={assessmentPath} 
                underline="none" 
                color="text.secondary" 
                sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
              >
                ASSESSMENTS
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                EVALUATION
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={() => navigate(assessmentPath)}
                sx={{ bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '6px', p: 1 }}
              >
                <ChevronLeft />
              </IconButton>
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
                <AssignmentInd />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  Module Evaluation
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Score and provide feedback for {interview.student?.name}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Sidebar info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ borderTop: '4px solid #E8391D' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 80, height: 80, 
                        bgcolor: 'secondary.main', 
                        mx: 'auto', mb: 2, 
                        fontWeight: 900, fontSize: '2rem',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      {interview.student?.name?.[0]}
                    </Avatar>
                    <Typography variant="h6" fontWeight={900} color="secondary" sx={{ fontFamily: 'Outfit', mb: 0.5 }}>
                      {interview.student?.name}
                    </Typography>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', display: 'block', mb: 2 }}>
                      {interview.student?.batch?.name || 'MERN-B1'}
                    </Typography>
                    
                    <Box sx={{ mb: 2.5 }}>
                       <Chip label={`ATTEMPT #${interview.attemptNumber}`} color="primary" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
                    </Box>

                    <Divider sx={{ my: 2.5, opacity: 0.1 }} />

                    <Stack spacing={2} sx={{ textAlign: 'left' }}>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <School sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ fontSize: '0.65rem' }}>MODULE</Typography>
                             <Typography variant="body2" fontWeight={800}>{interview.module?.name}</Typography>
                          </Box>
                       </Stack>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <CalendarToday sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ fontSize: '0.65rem' }}>DATE</Typography>
                             <Typography variant="body2" fontWeight={800}>
                               {interview.scheduledDate 
                                 ? new Date(interview.scheduledDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
                                 : '05 MAY 2026'}
                             </Typography>
                          </Box>
                       </Stack>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <Schedule sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ fontSize: '0.65rem' }}>TIME</Typography>
                             <Typography variant="body2" fontWeight={800}>
                               {interview.scheduledDate
                                 ? new Date(interview.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                 : '10:30 AM'}
                             </Typography>
                          </Box>
                       </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                       <Info sx={{ color: 'primary.main', fontSize: 20 }} />
                       <Typography variant="subtitle2" fontWeight={900} sx={{ letterSpacing: '0.05em' }}>EVALUATOR NOTE</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic', fontSize: '0.78rem', lineHeight: 1.6 }}>
                      "Detail the qualitative performance of the candidate. Your recommendation directly influences the academic progression of the student."
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Evaluation Form */}
            <Grid item xs={12} md={8}>
              <Card>
                <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                   <Typography variant="subtitle1" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: 'Outfit' }}>
                      <Feedback color="primary" /> EVALUATION FEEDBACK
                   </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    
                    {/* Ratings */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1.5, letterSpacing: '0.08em' }}>TECHNICAL SKILLS (1-10)</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <Button
                              key={num}
                              onClick={() => setFormData({...formData, technicalRating: num})}
                              variant={formData.technicalRating === num ? 'contained' : 'outlined'}
                              sx={{ 
                                minWidth: 36, width: 36, height: 36, p: 0, 
                                borderRadius: 1.5, 
                                fontWeight: 900,
                                transition: 'all 0.15s ease',
                                transform: formData.technicalRating === num ? 'scale(1.08)' : 'none'
                              }}
                            >
                              {num}
                            </Button>
                          ))}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1.5, letterSpacing: '0.08em' }}>COMMUNICATION (1-10)</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <Button
                              key={num}
                              onClick={() => setFormData({...formData, communicationRating: num})}
                              variant={formData.communicationRating === num ? 'contained' : 'outlined'}
                              sx={{ 
                                minWidth: 36, width: 36, height: 36, p: 0, 
                                borderRadius: 1.5, 
                                fontWeight: 900,
                                transition: 'all 0.15s ease',
                                transform: formData.communicationRating === num ? 'scale(1.08)' : 'none'
                              }}
                            >
                              {num}
                            </Button>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>

                    {/* Textual Feedback */}
                    <Stack spacing={3}>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, letterSpacing: '0.08em' }}>
                            <ThumbUp fontSize="small" /> KEY STRENGTHS
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={4} 
                            placeholder="What did the student do well? Be specific about technical implementations."
                            value={formData.strengths}
                            onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                         />
                      </Box>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, letterSpacing: '0.08em' }}>
                            <ThumbDown fontSize="small" /> AREAS FOR IMPROVEMENT
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={4} 
                            placeholder="Where did the student struggle? Provide constructive guidance."
                            value={formData.weaknesses}
                            onChange={(e) => setFormData({...formData, weaknesses: e.target.value})}
                         />
                      </Box>
                    </Stack>

                    {/* Final Recommendation */}
                    <Box sx={{ pt: 3, borderTop: '1px solid #E5E7EB' }}>
                       <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'center', letterSpacing: '0.15em' }}>FINAL RECOMMENDATION</Typography>
                       <Grid container spacing={2}>
                          {[
                            { id: 'pass', label: 'PASS', color: 'success', icon: <CheckCircle /> },
                            { id: 'improvement', label: 'NEEDS IMPROVEMENT', color: 'info', icon: <Info /> },
                            { id: 'fail', label: 'FAIL', color: 'error', icon: <Cancel /> },
                          ].map(rec => (
                            <Grid item xs={4} key={rec.id}>
                               <Button
                                  fullWidth
                                  onClick={() => setFormData({...formData, recommendation: rec.id})}
                                  variant={formData.recommendation === rec.id ? 'contained' : 'outlined'}
                                  color={rec.color}
                                  sx={{ 
                                    flexDirection: 'column', 
                                    py: 2, 
                                    gap: 0.75, 
                                    borderRadius: 1.5,
                                    borderWidth: '1.5px',
                                    '&:hover': { borderWidth: '1.5px' }
                                  }}
                               >
                                  {rec.icon}
                                  <Typography variant="caption" fontWeight={900} sx={{ fontSize: '0.68rem' }}>{rec.label}</Typography>
                               </Button>
                            </Grid>
                          ))}
                       </Grid>
                    </Box>

                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      sx={{ py: 1.5, fontSize: '0.9rem', boxShadow: 'none' }}
                      disabled={submitMutation.isPending}
                      startIcon={<Save />}
                    >
                      {submitMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Submit Evaluation'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default InterviewDetail;

