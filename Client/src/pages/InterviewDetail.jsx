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
  NavigateNext,
  VideoCameraFront
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

const parseFeedback = (feedbackStr) => {
  let strengths = '';
  let weaknesses = '';
  if (feedbackStr) {
    const strengthsMatch = feedbackStr.match(/STRENGTHS:\s*([\s\S]*?)(?=\nWEAKNESSES:|$)/i);
    const weaknessesMatch = feedbackStr.match(/WEAKNESSES:\s*([\s\S]*?)$/i);
    if (strengthsMatch) strengths = strengthsMatch[1].trim();
    if (weaknessesMatch) weaknesses = weaknessesMatch[1].trim();
  }
  return { strengths, weaknesses };
};

const InterviewDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isInterviewer = user?.role === ROLES.INTERVIEWER;
  const assessmentPath = isInterviewer ? '/my-interviews' : '/interviews';
  
  const [formData, setFormData] = useState({
    technicalRating: '',
    communicationRating: '',
    attendanceRating: 10,
    disciplineRating: 10,
    strengths: '',
    weaknesses: '',
    remarks: '',
    recommendation: '',
  });

  const { data: interviewRes, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: () => interviewApi.getInterviewById(id),
    enabled: !!id
  });

  React.useEffect(() => {
    if (interviewRes?.data) {
      const interview = interviewRes.data;
      const { strengths, weaknesses } = parseFeedback(interview.interviewerFeedback);
      
      let recommendation = '';
      if (interview.status === 'passed') recommendation = 'pass';
      else if (interview.status === 'failed' || interview.status === 're_interview_required') recommendation = 'fail';

      setFormData({
        technicalRating: interview.reviewScore !== undefined && interview.reviewScore !== null ? interview.reviewScore : '',
        communicationRating: interview.taskScore !== undefined && interview.taskScore !== null ? interview.taskScore : '',
        attendanceRating: interview.attendanceScore || 10,
        disciplineRating: interview.disciplineScore || 10,
        strengths: strengths || '',
        weaknesses: weaknesses || '',
        remarks: interview.remarks || '',
        recommendation: recommendation,
      });
    }
  }, [interviewRes]);

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
    const tech = parseFloat(formData.technicalRating);
    const comm = parseFloat(formData.communicationRating);
    if (isNaN(tech) || tech < 0 || tech > 10 || isNaN(comm) || comm < 0 || comm > 10 || !formData.recommendation) {
      return toast.error('Please enter valid ratings (0-10) and a recommendation');
    }
    if (formData.strengths.length < 10) {
      return toast.error('Strengths feedback is too short (min 10 characters)');
    }

    submitMutation.mutate({
      reviewScore: tech,
      taskScore: comm,
      attendanceScore: 10,
      disciplineScore: 10,
      isPass: formData.recommendation === 'pass',
      interviewerFeedback: `STRENGTHS: ${formData.strengths}\nWEAKNESSES: ${formData.weaknesses}`,
      remarks: formData.remarks,
      reInterviewAttempt: interview.reInterviewAttempt || 0,
      maxReInterviewLimit: interview.maxReInterviewLimit || 2
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        <Box sx={{ width: '100%', py: 2.5, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{
            pt: 4,
            pb: 2.5,
            px: { xs: 3, md: 4.5 },
            mx: { xs: -3, md: -4.5 },
            mt: -2.5,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: 2
          }}>
            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />} 
              sx={{ mb: 1 }}
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
                width: 42,
                height: 42,
                borderRadius: '50%',
                bgcolor: 'rgba(232, 57, 29, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}>
                <AssignmentInd sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.35rem', color: '#1E2126', lineHeight: 1.2 }}>
                  Module Evaluation
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                  Score and provide feedback for {interview.student?.name}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Assessment Header Card */}
          <Card sx={{ borderLeft: '4px solid #E8391D', borderRadius: '6px', mb: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'center' }, 
                gap: 3, 
                width: '100%' 
              }}>
                
                {/* Student Info */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 50, height: 50, 
                      bgcolor: 'secondary.main', 
                      fontWeight: 900, fontSize: '1.25rem',
                      borderRadius: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                    }}
                  >
                    {interview.student?.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={900} color="secondary" sx={{ fontFamily: 'Outfit', lineHeight: 1.2, mb: 0.5 }}>
                      {interview.student?.name}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {interview.student?.batch?.name || 'MERN-B1'}
                      </Typography>
                      <Chip 
                        label={`ATTEMPT #${(interview.reInterviewAttempt || 0) + 1}`} 
                        color="primary" 
                        size="small" 
                        sx={{ 
                          fontWeight: 900, 
                          borderRadius: 1, 
                          height: 18, 
                          fontSize: '0.62rem',
                          bgcolor: 'primary.main',
                          color: 'white'
                        }} 
                      />
                    </Stack>
                  </Box>
                </Box>

                {/* Info Grid */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 3, sm: 6 }, 
                  flexWrap: 'wrap', 
                  flex: { md: 1 }, 
                  justifyContent: { md: 'center' } 
                }}>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.05em', mb: 0.5 }}>MODULE</Typography>
                    <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.8rem', color: '#1E2126' }}>{interview.module?.name || 'N/A'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.05em', mb: 0.5 }}>DATE</Typography>
                    <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.8rem', color: '#1E2126' }}>
                      {interview.scheduledDate 
                        ? new Date(interview.scheduledDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
                        : '05 MAY 2026'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.05em', mb: 0.5 }}>TIME</Typography>
                    <Typography variant="body2" fontWeight={800} sx={{ fontSize: '0.8rem', color: '#1E2126' }}>
                      {interview.scheduledDate
                        ? new Date(interview.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        : '10:30 AM'}
                    </Typography>
                  </Box>
                </Box>

                {/* Meeting CTA */}
                <Box sx={{ alignSelf: { xs: 'stretch', md: 'center' }, display: 'flex', justifyContent: 'flex-end' }}>
                  {interview.meetingLink && !['passed', 'failed', 're_interview_required', 'completed'].includes(interview.status) ? (
                    <Button
                      variant="contained"
                      color="primary"
                      href={interview.meetingLink}
                      target="_blank"
                      startIcon={<VideoCameraFront />}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        py: 1,
                        px: 2.5,
                        letterSpacing: '0.02em',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          boxShadow: '0 2px 6px rgba(232, 57, 29, 0.15)'
                        }
                      }}
                    >
                      Join Meeting
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center' }}>
                      <Chip 
                        label={['passed', 'failed', 're_interview_required', 'completed'].includes(interview.status) ? "Session Completed" : "Link Unavailable"}
                        variant="outlined"
                        color={['passed', 'failed', 're_interview_required', 'completed'].includes(interview.status) ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 800, borderRadius: 1 }}
                      />
                    </Box>
                  )}
                </Box>

              </Box>
            </CardContent>
          </Card>

          {/* Form and Guidelines Workspace */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 380px', lg: '1fr 400px' }, 
            gap: 3, 
            alignItems: 'stretch' 
          }}>
            
            {/* Form Column */}
            <Box sx={{ minWidth: 0, height: '100%' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                  <Typography variant="subtitle2" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, fontFamily: 'Outfit', color: 'secondary.main', letterSpacing: '0.05em' }}>
                    <Feedback color="primary" sx={{ fontSize: 18 }} /> MODULE EVALUATION WORKSPACE
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flex: 1 }}>
                    
                    {/* Ratings Inputs */}
                    <Grid container spacing={3}>
                      
                      {/* Technical Rating */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="TECHNICAL SKILLS (0-10)"
                          type="number"
                          fullWidth
                          value={formData.technicalRating}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setFormData({ ...formData, technicalRating: '' });
                            } else {
                              const parsed = parseFloat(val);
                              if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
                                setFormData({ ...formData, technicalRating: parsed });
                              }
                            }
                          }}
                          inputProps={{ min: 0, max: 10, step: 0.5 }}
                          placeholder="Enter score (0-10)"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.85rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: 'text.secondary' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 }
                            }
                          }}
                        />
                      </Grid>

                      {/* Communication Rating */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="COMMUNICATION SKILLS (0-10)"
                          type="number"
                          fullWidth
                          value={formData.communicationRating}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setFormData({ ...formData, communicationRating: '' });
                            } else {
                              const parsed = parseFloat(val);
                              if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
                                setFormData({ ...formData, communicationRating: parsed });
                              }
                            }
                          }}
                          inputProps={{ min: 0, max: 10, step: 0.5 }}
                          placeholder="Enter score (0-10)"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.85rem',
                              '& fieldset': { borderColor: '#E5E7EB' },
                              '&:hover fieldset': { borderColor: 'text.secondary' },
                              '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 }
                            }
                          }}
                        />
                      </Grid>

                    </Grid>

                    {/* Total Score summary box */}
                    {formData.technicalRating !== '' && formData.communicationRating !== '' && (
                      <Card variant="outlined" sx={{ borderRadius: '6px', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: '#C8E6C9', bgcolor: '#E8F5E9', boxShadow: 'none' }}>
                        <Typography variant="caption" fontWeight={900} color="#2E7D32" sx={{ letterSpacing: '0.05em' }}>TOTAL SCORE (WITH 20PT BASE ATTENDANCE/DISCIPLINE)</Typography>
                        <Typography variant="subtitle1" fontWeight={900} color="#2E7D32" sx={{ fontFamily: 'Outfit' }}>
                          {(() => {
                            const techVal = parseFloat(formData.technicalRating) || 0;
                            const commVal = parseFloat(formData.communicationRating) || 0;
                            const total = techVal + commVal + 20;
                            const perc = ((total / 40) * 100).toFixed(2);
                            return `${total} / 40 (${perc}%)`;
                          })()}
                        </Typography>
                      </Card>
                    )}

                    {/* Textual Feedback */}
                    <Stack spacing={3}>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, letterSpacing: '0.08em' }}>
                            <ThumbUp fontSize="small" /> KEY STRENGTHS
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={3} 
                            placeholder="What did the student do well? Be specific about technical implementations."
                            value={formData.strengths}
                            onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                p: 1.5,
                                fontSize: '0.85rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: 'text.secondary' },
                                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 }
                              }
                            }}
                         />
                      </Box>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, letterSpacing: '0.08em' }}>
                            <ThumbDown fontSize="small" /> AREAS FOR IMPROVEMENT
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={3} 
                            placeholder="Where did the student struggle? Provide constructive guidance."
                            value={formData.weaknesses}
                            onChange={(e) => setFormData({...formData, weaknesses: e.target.value})}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                p: 1.5,
                                fontSize: '0.85rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: 'text.secondary' },
                                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 }
                              }
                            }}
                         />
                      </Box>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="secondary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, letterSpacing: '0.08em' }}>
                            <Feedback fontSize="small" /> GENERAL REMARKS / EVALUATOR REMARKS
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={3} 
                            placeholder="Enter general remarks or session feedback notes here..."
                            value={formData.remarks}
                            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                p: 1.5,
                                fontSize: '0.85rem',
                                '& fieldset': { borderColor: '#E5E7EB' },
                                '&:hover fieldset': { borderColor: 'text.secondary' },
                                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1 }
                              }
                            }}
                         />
                      </Box>
                    </Stack>

                    {/* Final Recommendation Segment */}
                    <Box sx={{ pt: 2.5, borderTop: '1px solid #E5E7EB' }}>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1.5, textAlign: 'center', letterSpacing: '0.12em' }}>FINAL RECOMMENDATION</Typography>
                      <Grid container spacing={2}>
                        {[
                          { id: 'pass', label: 'PASS', color: '#2E7D32', bg: '#E8F5E9', border: '#C8E6C9', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
                          { id: 'fail', label: 'FAIL', color: '#C62828', bg: '#FFEBEE', border: '#FFCDD2', icon: <Cancel sx={{ fontSize: 16 }} /> },
                        ].map(rec => {
                          const isSelected = formData.recommendation === rec.id;
                          return (
                            <Grid item xs={6} key={rec.id}>
                              <Button
                                fullWidth
                                onClick={() => setFormData({...formData, recommendation: rec.id})}
                                variant={isSelected ? 'contained' : 'outlined'}
                                sx={{ 
                                  flexDirection: 'row', 
                                  py: 1.5, 
                                  gap: 1, 
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 900,
                                  letterSpacing: '0.08em',
                                  transition: 'all 0.2s ease',
                                  width: '100%',
                                  border: `1px solid ${isSelected ? rec.color : '#E5E7EB'}`,
                                  bgcolor: isSelected ? rec.bg : 'transparent',
                                  color: isSelected ? rec.color : 'text.secondary',
                                  '&:hover': {
                                    bgcolor: isSelected ? rec.bg : 'rgba(0, 0, 0, 0.02)',
                                    borderColor: isSelected ? rec.color : 'text.secondary',
                                  }
                                }}
                              >
                                {rec.icon}
                                {rec.label}
                              </Button>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>

                    {/* Action Button */}
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      sx={{ 
                        mt: 'auto',
                        py: 1.5, 
                        fontSize: '0.85rem', 
                        fontWeight: 900,
                        letterSpacing: '0.12em',
                        boxShadow: 'none',
                        borderRadius: '6px',
                        '&:hover': {
                          bgcolor: '#15171a',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                      disabled={submitMutation.isPending}
                      startIcon={<Save sx={{ fontSize: 18 }} />}
                    >
                      {submitMutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'Submit Evaluation'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Guidelines Column */}
            <Box sx={{ height: '100%' }}>
              <Stack spacing={2.5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                {/* Grading Instructions */}
                <Card sx={{ bgcolor: 'secondary.main', color: 'white', borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(30, 33, 38, 0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                       <Info sx={{ color: 'primary.main', fontSize: 18 }} />
                       <Typography variant="subtitle2" fontWeight={900} sx={{ letterSpacing: '0.08em', fontSize: '0.75rem', fontFamily: 'Outfit' }}>EVALUATOR INSTRUCTIONS</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem', lineHeight: 1.7, mb: 2 }}>
                      As an institutional evaluator, please score the candidate objectively based on their performance in the live assessment.
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem', lineHeight: 1.7 }}>
                      Your scores for Technical and Communication skills (out of 10) are added to standard default attendance and discipline scores (out of 10 each) to calculate the final score out of 40 points.
                    </Typography>
                    <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />
                    <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.68rem', display: 'block', fontStyle: 'italic' }}>
                      All evaluations are final and directly stored in the student progression database.
                    </Typography>
                  </CardContent>
                </Card>

                {/* Rubrics Cheat-Sheet */}
                <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                    <Typography variant="caption" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit', color: 'secondary.main', letterSpacing: '0.05em' }}>
                      <School sx={{ fontSize: 14, color: 'primary.main' }} /> EVALUATION RUBRICS
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    <Box>
                      <Typography variant="caption" fontWeight={900} color="secondary.main" sx={{ display: 'block', mb: 0.5, letterSpacing: '0.05em', fontSize: '0.68rem' }}>TECHNICAL SKILLS (0-10)</Typography>
                      <Stack spacing={0.75}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="9-10" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'success.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Exceptional. Clean logic, optimized code, independent solution.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="7-8" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'info.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Proficient. Correct implementation, minimal guidance needed.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="5-6" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'warning.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Competent. Logic is correct but code needs optimization.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="0-4" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'error.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Unsatisfactory. Logic errors, struggles with syntax.</Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Divider sx={{ opacity: 0.5 }} />

                    <Box>
                      <Typography variant="caption" fontWeight={900} color="secondary.main" sx={{ display: 'block', mb: 0.5, letterSpacing: '0.05em', fontSize: '0.68rem' }}>COMMUNICATION (0-10)</Typography>
                      <Stack spacing={0.75}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="9-10" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'success.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Articulate. Structured thoughts, explains code perfectly.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="7-8" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'info.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Good. Communicates concepts cleanly, minor pauses.</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <Chip label="0-6" size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 900, bgcolor: 'error.main', color: 'white', borderRadius: 0.5 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', lineHeight: 1.4 }}>Struggling. Hard to follow explanation of code logic.</Typography>
                        </Box>
                      </Stack>
                    </Box>

                  </CardContent>
                </Card>

              </Stack>
            </Box>

          </Box>
        </Box>
      </AppShell>
    </ThemeProvider>
  );
}

export default InterviewDetail;
