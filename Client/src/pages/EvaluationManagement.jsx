import React, { useState, useMemo } from 'react';
import {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Menu,
  TablePagination,
  InputAdornment,
  Slider
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Assessment,
  Person,
  Star,
  ChevronRight,
  Schedule,
  CheckCircle,
  Info,
  Assignment,
  NavigateNext,
  Groups,
  Search,
  FilterList,
  Close,
  MoreVert,
  Edit,
  Delete,
  Refresh,
  School,
  StarBorder,
  Repeat,
  WarningAmber,
  VideoCall,
  Place,
  CalendarToday,
  PlayArrow,
  Check,
  ScheduleSend
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as interviewApi from '../api/interview.api';
import * as batchApi from '../api/batches.api';
import * as usersApi from '../api/users.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { toast } from "sonner";

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
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '10px 20px',
        }
      }
    },
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

const EvaluationManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['all-interviews', user?._id],
    queryFn: () => interviewApi.getInterviews(
      user?.role === ROLES.FACILITATOR ? { facilitator: user._id } : {}
    ),
    enabled: !!user?._id
  });

  const { data: batchesRes } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches
  });

  const { data: interviewersRes } = useQuery({
    queryKey: ['interviewers'],
    queryFn: usersApi.getInterviewers
  });

  const interviews = Array.isArray(interviewsRes) ? interviewsRes : (interviewsRes?.data?.data || interviewsRes?.data || []);
  const batches = batchesRes?.data || [];
  const interviewers = interviewersRes?.data || [];

  // Stats calculation (Exactly as before, using raw interviews list)
  const toSchedule = interviews.filter(i => i.status === 'scheduled').length;
  const pendingScores = interviews.filter(i => i.status === 'in_progress').length;
  const completed = interviews.filter(i => i.status === 'passed' || i.status === 'failed').length;
  const passed = interviews.filter(i => i.status === 'passed').length;
  const passRate = completed > 0 ? Math.round((passed / completed) * 100) : 0;
  const reInterviews = interviews.filter(i => i.status === 're_interview_required').length;

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInterviewer, setFilterInterviewer] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Menu State for Row Actions
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Dialog States
  const [openScoreDialog, setOpenScoreDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [openReInterviewDialog, setOpenReInterviewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form States
  const [scoreForm, setScoreForm] = useState({
    reviewScore: '',
    taskScore: '',
    attendanceScore: '',
    disciplineScore: '',
    facilitatorEvaluation: '',
    isPass: true,
    reInterviewAttempt: 0,
    maxReInterviewLimit: 2
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    mode: 'online',
    interviewer: '',
    generateMeetLink: true
  });

  const [reInterviewForm, setReInterviewForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    mode: 'online',
    generateMeetLink: true
  });

  // Calculate unique module names from list
  const uniqueModules = useMemo(() => {
    const modules = new Set();
    interviews.forEach(i => {
      if (i.module) modules.add(i.module.trim());
    });
    return Array.from(modules);
  }, [interviews]);

  // Mutations
  const recordScoreMutation = useMutation({
    mutationFn: ({ id, data }) => interviewApi.recordScore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-interviews'] });
      toast.success('Evaluation scored successfully');
      setOpenScoreDialog(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error recording evaluation score');
    }
  });

  const updateInterviewMutation = useMutation({
    mutationFn: ({ id, data }) => interviewApi.updateInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-interviews'] });
      toast.success('Interview rescheduled successfully');
      setOpenRescheduleDialog(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error updating interview details');
    }
  });

  const reInterviewMutation = useMutation({
    mutationFn: ({ id, data }) => interviewApi.createReInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-interviews'] });
      toast.success('Re-interview scheduled successfully');
      setOpenReInterviewDialog(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error scheduling re-interview');
    }
  });

  const deleteInterviewMutation = useMutation({
    mutationFn: (id) => interviewApi.deleteInterview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-interviews'] });
      toast.success('Evaluation cancelled successfully');
      setOpenDeleteDialog(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error cancelling evaluation');
    }
  });

  // Action Menu Helpers
  const handleOpenMenu = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(item);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleOpenScore = () => {
    if (!selectedRow) return;
    setScoreForm({
      reviewScore: selectedRow.reviewScore !== undefined && selectedRow.reviewScore !== null ? selectedRow.reviewScore : '',
      taskScore: selectedRow.taskScore !== undefined && selectedRow.taskScore !== null ? selectedRow.taskScore : '',
      attendanceScore: selectedRow.attendanceScore !== undefined && selectedRow.attendanceScore !== null ? selectedRow.attendanceScore : '',
      disciplineScore: selectedRow.disciplineScore !== undefined && selectedRow.disciplineScore !== null ? selectedRow.disciplineScore : '',
      facilitatorEvaluation: selectedRow.facilitatorEvaluation || '',
      isPass: selectedRow.status === 'failed' || selectedRow.status === 're_interview_required' ? false : true,
      reInterviewAttempt: selectedRow.reInterviewAttempt || 0,
      maxReInterviewLimit: selectedRow.maxReInterviewLimit || 2
    });
    setOpenScoreDialog(true);
    handleCloseMenu();
  };

  const handleOpenReschedule = () => {
    if (!selectedRow) return;
    const datePart = selectedRow.scheduledAt ? selectedRow.scheduledAt.split('T')[0] : '';
    let timePart = '';
    if (selectedRow.scheduledAt) {
      const d = new Date(selectedRow.scheduledAt);
      if (!isNaN(d.getTime())) {
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        timePart = `${hrs}:${mins}`;
      }
    }

    setRescheduleForm({
      scheduledDate: datePart,
      scheduledTime: timePart,
      mode: selectedRow.mode || 'online',
      interviewer: selectedRow.interviewer?._id || selectedRow.interviewer || '',
      generateMeetLink: selectedRow.meetLink ? false : true
    });
    setOpenRescheduleDialog(true);
    handleCloseMenu();
  };

  const handleOpenReInterview = () => {
    if (!selectedRow) return;
    setReInterviewForm({
      scheduledDate: '',
      scheduledTime: '',
      mode: 'online',
      generateMeetLink: true
    });
    setOpenReInterviewDialog(true);
    handleCloseMenu();
  };

  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  // Helper date formatter
  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Check if evaluation is overdue
  const checkOverdue = (item) => {
    if (item.status !== 'scheduled' && item.status !== 'in_progress') return false;
    if (!item.scheduledAt) return false;
    const scheduled = new Date(item.scheduledAt);
    const now = new Date();
    // Overdue if scheduled more than 1 hour ago
    return now.getTime() - scheduled.getTime() > 60 * 60 * 1000;
  };

  // Memoized Filter & Search Logic
  const filteredInterviews = useMemo(() => {
    return interviews.filter(item => {
      const studentName = item.student?.name || '';
      const moduleName = item.module || '';
      const matchesSearch =
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moduleName.toLowerCase().includes(searchQuery.toLowerCase());

      const batchId = item.batch?._id || item.batch || '';
      const matchesBatch = filterBatch === 'all' || batchId === filterBatch;

      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

      const interviewerId = item.interviewer?._id || item.interviewer || '';
      const matchesInterviewer =
        filterInterviewer === 'all' ? true :
        filterInterviewer === 'unassigned' ? !interviewerId :
        interviewerId === filterInterviewer;

      const matchesModule = filterModule === 'all' || (item.module && item.module.toLowerCase() === filterModule.toLowerCase());

      let matchesDate = true;
      if (filterDate && item.scheduledAt) {
        const itemDateStr = item.scheduledAt.split('T')[0];
        matchesDate = itemDateStr === filterDate;
      }

      return matchesSearch && matchesBatch && matchesStatus && matchesInterviewer && matchesModule && matchesDate;
    });
  }, [interviews, searchQuery, filterBatch, filterStatus, filterInterviewer, filterModule, filterDate]);

  // Sorting: most recent scheduled date first
  const sortedInterviews = useMemo(() => {
    return [...filteredInterviews].sort((a, b) => {
      const dateA = a.scheduledAt ? new Date(a.scheduledAt) : new Date(0);
      const dateB = b.scheduledAt ? new Date(b.scheduledAt) : new Date(0);
      return dateB - dateA;
    });
  }, [filteredInterviews]);

  // Paginated List
  const paginatedInterviews = useMemo(() => {
    return sortedInterviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedInterviews, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper live total score calculator
  const liveTotalScore = useMemo(() => {
    const rev = Number(scoreForm.reviewScore) || 0;
    const tsk = Number(scoreForm.taskScore) || 0;
    const att = Number(scoreForm.attendanceScore) || 0;
    const dis = Number(scoreForm.disciplineScore) || 0;
    return rev + tsk + att + dis;
  }, [scoreForm.reviewScore, scoreForm.taskScore, scoreForm.attendanceScore, scoreForm.disciplineScore]);

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

          {/* Header (Exactly as before) */}
          <Box sx={{
            pt: 4,
            pb: 3,
            px: 6,
            mx: -6,
            mt: -6,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: 3
          }}>
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
                EVALUATIONS
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
                <Assessment fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                  Module Evaluations
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Schedule interviews, assign interviewers, and record final scores
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats Section - Standardized 4-Box Grid (Exactly as before) */}
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'To Schedule', count: String(toSchedule).padStart(2, '0'), color: '#E8391D', icon: <Schedule /> },
              { label: 'Pending Scores', count: String(pendingScores).padStart(2, '0'), color: '#1E2126', icon: <Assignment /> },
              { label: 'Pass Rate', count: `${passRate}%`, color: '#2e7d32', icon: <CheckCircle /> },
              { label: 'Re-Interviews', count: String(reInterviews).padStart(2, '0'), color: '#d32f2f', icon: <Info /> },
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
                overflow: 'hidden',
                bgcolor: 'white'
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
                      {stat.count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Operational Filter Toolbar */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            p: 2,
            bgcolor: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {/* Student or Module Search */}
            <TextField
              placeholder="Search student or module..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '10px', 
                  bgcolor: '#F9FAFB', 
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' }
                }
              }}
              sx={{ flexGrow: 1, minWidth: '220px' }}
            />

            {/* Batch Filter */}
            <FormControl size="small" sx={{ minWidth: '130px' }}>
              <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Batch</InputLabel>
              <Select
                label="Batch"
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                sx={{ 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' }
                }}
              >
                <MenuItem value="all" sx={{ fontWeight: 600 }}>All Batches</MenuItem>
                {batches.map(b => (
                  <MenuItem key={b._id} value={b._id} sx={{ fontWeight: 500 }}>{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Evaluation Status Filter */}
            <FormControl size="small" sx={{ minWidth: '130px' }}>
              <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Status</InputLabel>
              <Select
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' }
                }}
              >
                <MenuItem value="all" sx={{ fontWeight: 600 }}>All Statuses</MenuItem>
                <MenuItem value="scheduled" sx={{ fontWeight: 500 }}>Scheduled</MenuItem>
                <MenuItem value="in_progress" sx={{ fontWeight: 500 }}>In Progress</MenuItem>
                <MenuItem value="passed" sx={{ fontWeight: 500 }}>Passed</MenuItem>
                <MenuItem value="failed" sx={{ fontWeight: 500 }}>Failed</MenuItem>
                <MenuItem value="re_interview_required" sx={{ fontWeight: 500 }}>Re-Interview Required</MenuItem>
              </Select>
            </FormControl>

            {/* Interviewer Filter */}
            <FormControl size="small" sx={{ minWidth: '150px' }}>
              <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Interviewer</InputLabel>
              <Select
                label="Interviewer"
                value={filterInterviewer}
                onChange={(e) => setFilterInterviewer(e.target.value)}
                sx={{ 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' }
                }}
              >
                <MenuItem value="all" sx={{ fontWeight: 600 }}>All Interviewers</MenuItem>
                <MenuItem value="unassigned" sx={{ fontWeight: 500 }}>Unassigned</MenuItem>
                {interviewers.map(i => (
                  <MenuItem key={i._id} value={i._id} sx={{ fontWeight: 500 }}>{i.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Module Filter */}
            <FormControl size="small" sx={{ minWidth: '130px' }}>
              <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 700 }}>Module</InputLabel>
              <Select
                label="Module"
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                sx={{ 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' }
                }}
              >
                <MenuItem value="all" sx={{ fontWeight: 600 }}>All Modules</MenuItem>
                {uniqueModules.map(mod => (
                  <MenuItem key={mod} value={mod.toLowerCase()} sx={{ fontWeight: 500 }}>{mod.toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Filter */}
            <TextField
              type="date"
              size="small"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder="Filter by date"
              InputProps={{
                sx: { 
                  borderRadius: '10px', 
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' }
                }
              }}
              sx={{ minWidth: '140px' }}
            />

            {/* Clear Button */}
            {(searchQuery || filterBatch !== 'all' || filterStatus !== 'all' || filterInterviewer !== 'all' || filterModule !== 'all' || filterDate) && (
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setSearchQuery('');
                  setFilterBatch('all');
                  setFilterStatus('all');
                  setFilterInterviewer('all');
                  setFilterModule('all');
                  setFilterDate('');
                }}
                startIcon={<Refresh />}
                sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {/* Evaluations Workspace Grid */}
          <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F9FAFB', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary', pl: 3 }}>Student & Module</TableCell>
                    <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary' }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary' }}>Scheduled Details & Mode</TableCell>
                    <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary' }}>Assigned Interviewer</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary' }}>Evaluation Score</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', py: 1.5, fontSize: '0.7rem', color: 'text.secondary', pr: 3 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ letterSpacing: '0.1em' }}>LOADING OPERATION WORKSPACE...</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : paginatedInterviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 4 }}>
                          <Info sx={{ color: 'text.secondary', opacity: 0.3, fontSize: 40 }} />
                          <Typography variant="subtitle2" color="text.secondary" fontWeight={800}>NO EVALUATIONS MATCH THE ACTIVE FILTERS</Typography>
                          <Typography variant="caption" color="text.secondary">Try resetting your filter options above</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : paginatedInterviews.map((item) => {
                    const overdue = checkOverdue(item);
                    return (
                      <TableRow 
                        key={item._id} 
                        sx={{ 
                          height: '52px', 
                          borderBottom: '1px solid rgba(0,0,0,0.04)',
                          transition: 'background-color 0.15s ease',
                          '&:hover': { bgcolor: '#F9FAFB' } 
                        }}
                      >
                        {/* Student & Module */}
                        <TableCell sx={{ py: 1.25, pl: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar 
                              sx={{ 
                                width: 28, 
                                height: 28, 
                                fontSize: '0.75rem', 
                                fontWeight: 900,
                                bgcolor: item.status === 'passed' ? 'success.main' : 'secondary.main',
                                color: 'white'
                              }}
                            >
                              {(item.student?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" fontWeight={800} color="secondary.main" sx={{ fontSize: '0.825rem', lineHeight: 1.2 }}>
                                {item.student?.name || 'Unknown Student'}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.7rem' }}>
                                  {item.student?.email || 'N/A'}
                                </Typography>
                                <Divider orientation="vertical" flexItem sx={{ height: 10, alignSelf: 'center', bgcolor: 'rgba(0,0,0,0.1)' }} />
                                <Chip 
                                  label={item.module?.toUpperCase() || 'MODULE'} 
                                  size="small" 
                                  sx={{ 
                                    height: '16px', 
                                    fontSize: '0.625rem', 
                                    fontWeight: 900,
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    bgcolor: 'rgba(232, 57, 29, 0.08)',
                                    color: 'primary.main',
                                    border: '1px solid rgba(232, 57, 29, 0.15)'
                                  }} 
                                />
                              </Stack>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Batch */}
                        <TableCell sx={{ py: 1.25 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Groups sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.7 }} />
                            <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem', color: 'secondary.main' }}>
                              {item.batch?.name || 'N/A'}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Scheduled Details & Mode */}
                        <TableCell sx={{ py: 1.25 }}>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <CalendarToday sx={{ fontSize: 13, color: overdue ? '#d32f2f' : 'text.secondary' }} />
                              <Typography 
                                variant="body2" 
                                fontWeight={700} 
                                sx={{ 
                                  fontSize: '0.775rem', 
                                  color: overdue ? '#d32f2f' : 'secondary.main' 
                                }}
                              >
                                {formatDateTime(item.scheduledAt)}
                              </Typography>
                              {overdue && (
                                <Tooltip title="This scheduled evaluation has passed its date without being graded.">
                                  <Chip 
                                    icon={<WarningAmber style={{ fontSize: 11, color: '#d32f2f' }} />}
                                    label="OVERDUE" 
                                    size="small"
                                    sx={{ 
                                      height: 16, 
                                      fontSize: '0.55rem', 
                                      fontWeight: 900, 
                                      bgcolor: 'rgba(211, 47, 47, 0.08)', 
                                      color: '#d32f2f',
                                      border: '1px solid rgba(211, 47, 47, 0.2)',
                                      pl: 0.5
                                    }} 
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.4 }}>
                              <Chip
                                icon={item.mode === 'online' ? <VideoCall style={{ fontSize: 11, color: '#0288d1' }} /> : <Place style={{ fontSize: 11, color: '#455a64' }} />}
                                label={item.mode === 'online' ? 'Online' : 'Offline'}
                                size="small"
                                sx={{
                                  height: '16px',
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  bgcolor: item.mode === 'online' ? 'rgba(2, 136, 209, 0.06)' : 'rgba(0,0,0,0.05)',
                                  color: item.mode === 'online' ? '#0288d1' : '#455a64',
                                  '& .MuiChip-icon': { ml: '2px', mr: '-2px' }
                                }}
                              />
                              {item.mode === 'online' && item.meetLink && (
                                <MuiLink 
                                  href={item.meetLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  sx={{ 
                                    fontSize: '0.65rem', 
                                    fontWeight: 700, 
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.2,
                                    '&:hover': { textDecoration: 'underline' }
                                  }}
                                >
                                  Join Meet
                                </MuiLink>
                              )}
                            </Stack>
                          </Box>
                        </TableCell>

                        {/* Assigned Interviewer */}
                        <TableCell sx={{ py: 1.25 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 18, height: 18, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.06)', color: 'text.secondary' }}>
                              <Person sx={{ fontSize: 12 }} />
                            </Avatar>
                            <Typography 
                              variant="body2" 
                              fontWeight={700} 
                              sx={{ 
                                fontSize: '0.775rem', 
                                color: item.interviewer?.name ? 'secondary.main' : 'text.secondary',
                                fontStyle: item.interviewer?.name ? 'normal' : 'italic'
                              }}
                            >
                              {item.interviewer?.name || 'Not Assigned'}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Status (Stripe Style Badger) */}
                        <TableCell align="center" sx={{ py: 1.25 }}>
                          <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 0.4 }}>
                            <Chip
                              label={item.status?.replace(/_/g, ' ').toUpperCase()}
                              size="small"
                              sx={{
                                height: '18px',
                                fontWeight: 900,
                                borderRadius: '4px',
                                fontSize: '0.6rem',
                                border: '1px solid',
                                bgcolor: 
                                  item.status === 'passed' ? 'rgba(46, 125, 50, 0.08)' :
                                  item.status === 'failed' ? 'rgba(211, 47, 47, 0.08)' :
                                  item.status === 're_interview_required' ? 'rgba(232, 57, 29, 0.08)' :
                                  item.status === 'in_progress' ? 'rgba(237, 108, 2, 0.08)' :
                                  'rgba(2, 136, 209, 0.08)',
                                color: 
                                  item.status === 'passed' ? '#2e7d32' :
                                  item.status === 'failed' ? '#d32f2f' :
                                  item.status === 're_interview_required' ? '#E8391D' :
                                  item.status === 'in_progress' ? '#ed6c02' :
                                  '#0288d1',
                                borderColor: 
                                  item.status === 'passed' ? 'rgba(46, 125, 50, 0.2)' :
                                  item.status === 'failed' ? 'rgba(211, 47, 47, 0.2)' :
                                  item.status === 're_interview_required' ? 'rgba(232, 57, 29, 0.2)' :
                                  item.status === 'in_progress' ? 'rgba(237, 108, 2, 0.2)' :
                                  'rgba(2, 136, 209, 0.2)'
                              }}
                            />
                            {item.reInterviewAttempt > 0 && (
                              <Typography variant="caption" sx={{ fontSize: '0.625rem', fontWeight: 800, color: 'text.secondary' }}>
                                Attempt {item.reInterviewAttempt + 1} of {item.maxReInterviewLimit || 2}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        {/* Evaluation Score (with Hover Subscores details) */}
                        <TableCell sx={{ py: 1.25 }}>
                          {item.score !== undefined && item.score !== null ? (
                            <Tooltip
                              title={
                                <Box sx={{ p: 0.5 }}>
                                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.2)', pb: 0.5, mb: 0.5 }}>Sub-Scores Breakdowns</Typography>
                                  <Grid container spacing={1} sx={{ width: 180 }}>
                                    <Grid item xs={8}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Technical Concepts:</Typography></Grid>
                                    <Grid item xs={4} align="right"><Typography variant="caption" fontWeight={900}>{item.reviewScore || 0}/10</Typography></Grid>
                                    <Grid item xs={8}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Practical Task:</Typography></Grid>
                                    <Grid item xs={4} align="right"><Typography variant="caption" fontWeight={900}>{item.taskScore || 0}/10</Typography></Grid>
                                    <Grid item xs={8}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Attendance:</Typography></Grid>
                                    <Grid item xs={4} align="right"><Typography variant="caption" fontWeight={900}>{item.attendanceScore || 0}/10</Typography></Grid>
                                    <Grid item xs={8}><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Discipline / Comm:</Typography></Grid>
                                    <Grid item xs={4} align="right"><Typography variant="caption" fontWeight={900}>{item.disciplineScore || 0}/10</Typography></Grid>
                                  </Grid>
                                  {item.facilitatorEvaluation && (
                                    <>
                                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mt: 1, borderTop: '1px solid rgba(255,255,255,0.2)', pt: 0.5 }}>Facilitator Feedback:</Typography>
                                      <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', maxWidth: 180, whiteSpace: 'normal', color: 'rgba(255,255,255,0.8)' }}>"{item.facilitatorEvaluation}"</Typography>
                                    </>
                                  )}
                                </Box>
                              }
                              arrow
                            >
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                <Star sx={{ color: '#FFB400', fontSize: 15 }} />
                                <Typography variant="subtitle2" fontWeight={900} sx={{ fontSize: '0.8rem', color: 'secondary.main' }}>
                                  {item.score}/{item.maxScore || 40}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                                  ({Math.round((item.score / (item.maxScore || 40)) * 100)}%)
                                </Typography>
                              </Box>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" fontWeight={800} sx={{ color: 'text.secondary', opacity: 0.5, letterSpacing: '0.02em' }}>
                              PENDING SCORES
                            </Typography>
                          )}
                        </TableCell>

                        {/* Action Dropdown trigger */}
                        <TableCell align="right" sx={{ py: 1.25, pr: 3 }}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleOpenMenu(e, item)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.03)' } }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={sortedInterviews.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ 
                borderTop: '1px solid rgba(0,0,0,0.06)',
                bgcolor: 'white',
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.secondary'
                },
                '& .MuiTablePagination-select': {
                  fontSize: '0.75rem',
                  fontWeight: 600
                }
              }}
            />
          </Card>
        </Box>
      </AppShell>

      {/* Row Actions Dropdown Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            py: 0.5,
            minWidth: '160px'
          }
        }}
      >
        <MenuItem 
          onClick={handleOpenScore} 
          sx={{ py: 1, fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1.5 }}
        >
          <Assessment fontSize="small" sx={{ color: 'text.secondary' }} />
          {selectedRow?.status === 'passed' || selectedRow?.status === 'failed' ? 'Edit Evaluation Score' : 'Record Evaluation Score'}
        </MenuItem>

        <MenuItem 
          onClick={handleOpenReschedule}
          sx={{ py: 1, fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1.5 }}
        >
          <Edit fontSize="small" sx={{ color: 'text.secondary' }} />
          Reschedule & Assign
        </MenuItem>

        {selectedRow && (selectedRow.status === 'failed' || selectedRow.status === 're_interview_required') && (selectedRow.reInterviewAttempt || 0) < (selectedRow.maxReInterviewLimit || 2) && (
          <MenuItem 
            onClick={handleOpenReInterview}
            sx={{ py: 1, fontSize: '0.8rem', fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            <Repeat fontSize="small" />
            Schedule Re-Interview
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5, borderColor: 'rgba(0,0,0,0.04)' }} />

        <MenuItem 
          onClick={handleOpenDelete}
          sx={{ py: 1, fontSize: '0.8rem', fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1.5 }}
        >
          <Delete fontSize="small" />
          Cancel Evaluation
        </MenuItem>
      </Menu>

      {/* MODAL 1: RECORD SCORE DIALOG */}
      <Dialog 
        open={openScoreDialog} 
        onClose={() => setOpenScoreDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem', color: 'secondary.main' }}>
                RECORD EVALUATION SCORE
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Grade {selectedRow?.student?.name} for Module: {selectedRow?.module?.toUpperCase()}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenScoreDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Subscores sliders */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" fontWeight={800} color="secondary.main">
                TECHNICAL CONCEPTS REVIEW (OUT OF 10)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={Number(scoreForm.reviewScore) || 0}
                  onChange={(e, val) => setScoreForm({ ...scoreForm, reviewScore: val })}
                  min={0}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                  sx={{ flexGrow: 1 }}
                />
                <TextField 
                  type="number" 
                  size="small" 
                  value={scoreForm.reviewScore}
                  onChange={(e) => setScoreForm({ ...scoreForm, reviewScore: Math.max(0, Math.min(10, Number(e.target.value))) })}
                  inputProps={{ min: 0, max: 10, step: 0.5 }} 
                  sx={{ width: 65 }}
                />
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" fontWeight={800} color="secondary.main">
                PRACTICAL TASK EXECUTION (OUT OF 10)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={Number(scoreForm.taskScore) || 0}
                  onChange={(e, val) => setScoreForm({ ...scoreForm, taskScore: val })}
                  min={0}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                  sx={{ flexGrow: 1 }}
                />
                <TextField 
                  type="number" 
                  size="small" 
                  value={scoreForm.taskScore}
                  onChange={(e) => setScoreForm({ ...scoreForm, taskScore: Math.max(0, Math.min(10, Number(e.target.value))) })}
                  inputProps={{ min: 0, max: 10, step: 0.5 }} 
                  sx={{ width: 65 }}
                />
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" fontWeight={800} color="secondary.main">
                ATTENDANCE & PUNCTUALITY (OUT OF 10)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={Number(scoreForm.attendanceScore) || 0}
                  onChange={(e, val) => setScoreForm({ ...scoreForm, attendanceScore: val })}
                  min={0}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                  sx={{ flexGrow: 1 }}
                />
                <TextField 
                  type="number" 
                  size="small" 
                  value={scoreForm.attendanceScore}
                  onChange={(e) => setScoreForm({ ...scoreForm, attendanceScore: Math.max(0, Math.min(10, Number(e.target.value))) })}
                  inputProps={{ min: 0, max: 10, step: 0.5 }} 
                  sx={{ width: 65 }}
                />
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" fontWeight={800} color="secondary.main">
                DISCIPLINE & ATTITUDE (OUT OF 10)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={Number(scoreForm.disciplineScore) || 0}
                  onChange={(e, val) => setScoreForm({ ...scoreForm, disciplineScore: val })}
                  min={0}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                  sx={{ flexGrow: 1 }}
                />
                <TextField 
                  type="number" 
                  size="small" 
                  value={scoreForm.disciplineScore}
                  onChange={(e) => setScoreForm({ ...scoreForm, disciplineScore: Math.max(0, Math.min(10, Number(e.target.value))) })}
                  inputProps={{ min: 0, max: 10, step: 0.5 }} 
                  sx={{ width: 65 }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Live Preview Box */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              borderRadius: '12px', 
              bgcolor: liveTotalScore >= 24 ? 'rgba(46, 125, 50, 0.03)' : 'rgba(211, 47, 47, 0.03)', 
              borderColor: liveTotalScore >= 24 ? 'rgba(46, 125, 50, 0.2)' : 'rgba(211, 47, 47, 0.2)',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <Box>
              <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', letterSpacing: '0.05em' }}>
                CUMULATIVE PERFORMANCE GRADE
              </Typography>
              <Typography variant="h5" fontWeight={900} color={liveTotalScore >= 24 ? '#2e7d32' : '#d32f2f'} sx={{ fontFamily: 'Outfit' }}>
                {liveTotalScore} / 40 ({Math.round((liveTotalScore / 40) * 100)}%)
              </Typography>
            </Box>
            <Chip 
              icon={liveTotalScore >= 24 ? <Check style={{ fontSize: 13, color: '#2e7d32' }} /> : <WarningAmber style={{ fontSize: 13, color: '#d32f2f' }} />}
              label={liveTotalScore >= 24 ? 'RECOMMENDED: PASS' : 'RECOMMENDED: FAIL'} 
              size="small"
              sx={{ 
                fontWeight: 900, 
                fontSize: '0.65rem',
                bgcolor: liveTotalScore >= 24 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                color: liveTotalScore >= 24 ? '#2e7d32' : '#d32f2f',
                border: '1px solid',
                borderColor: liveTotalScore >= 24 ? 'rgba(46, 125, 50, 0.2)' : 'rgba(211, 47, 47, 0.2)',
                pl: 0.5
              }} 
            />
          </Paper>

          {/* Result Outcome Selector */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontWeight: 600 }}>Result Outcome</InputLabel>
              <Select
                label="Result Outcome"
                value={scoreForm.isPass}
                onChange={(e) => setScoreForm({ ...scoreForm, isPass: e.target.value })}
                sx={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <MenuItem value={true} sx={{ fontWeight: 600, color: '#2e7d32' }}>Passed (Clear Module)</MenuItem>
                <MenuItem value={false} sx={{ fontWeight: 600, color: '#d32f2f' }}>Failed / Re-Interview Required</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <TextField 
                label="Current Attempt" 
                type="number" 
                size="small" 
                fullWidth 
                value={scoreForm.reInterviewAttempt} 
                onChange={(e) => setScoreForm({ ...scoreForm, reInterviewAttempt: Number(e.target.value) })}
                inputProps={{ min: 0 }} 
                sx={{ '& fieldset': { borderRadius: '10px' } }}
              />
              <TextField 
                label="Max Attempt Limit" 
                type="number" 
                size="small" 
                fullWidth 
                value={scoreForm.maxReInterviewLimit} 
                onChange={(e) => setScoreForm({ ...scoreForm, maxReInterviewLimit: Number(e.target.value) })}
                inputProps={{ min: 1 }} 
                sx={{ '& fieldset': { borderRadius: '10px' } }}
              />
            </Stack>
          </Box>

          {/* Qualitative Feedback Evaluation */}
          <TextField
            label="Qualitative Facilitator Evaluation"
            multiline
            rows={3}
            fullWidth
            value={scoreForm.facilitatorEvaluation}
            onChange={(e) => setScoreForm({ ...scoreForm, facilitatorEvaluation: e.target.value })}
            placeholder="Document technical feedback, weaknesses to address, and final recommendation notes..."
            InputProps={{
              sx: { borderRadius: '12px', fontSize: '0.85rem' }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={() => setOpenScoreDialog(false)} 
            color="secondary" 
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={recordScoreMutation.isLoading}
            onClick={() => {
              recordScoreMutation.mutate({ 
                id: selectedRow._id, 
                data: scoreForm 
              });
            }}
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            {recordScoreMutation.isLoading ? 'SAVING...' : 'SAVE EVALUATION'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 2: RESCHEDULE / REASSIGN DIALOG */}
      <Dialog 
        open={openRescheduleDialog} 
        onClose={() => setOpenRescheduleDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem', color: 'secondary.main' }}>
                RESCHEDULE & ASSIGN EVALUATION
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Modify schedule or change interviewer for {selectedRow?.student?.name}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenRescheduleDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Evaluation Date"
              type="date"
              size="small"
              fullWidth
              value={rescheduleForm.scheduledDate}
              onChange={(e) => setRescheduleForm({ ...rescheduleForm, scheduledDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ '& fieldset': { borderRadius: '10px' } }}
            />
            <TextField
              label="Evaluation Time"
              type="time"
              size="small"
              fullWidth
              value={rescheduleForm.scheduledTime}
              onChange={(e) => setRescheduleForm({ ...rescheduleForm, scheduledTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ '& fieldset': { borderRadius: '10px' } }}
            />
          </Stack>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontWeight: 600 }}>Assigned Interviewer</InputLabel>
            <Select
              label="Assigned Interviewer"
              value={rescheduleForm.interviewer}
              onChange={(e) => setRescheduleForm({ ...rescheduleForm, interviewer: e.target.value })}
              sx={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 500 }}
            >
              <MenuItem value="" sx={{ fontStyle: 'italic' }}>Unassigned</MenuItem>
              {interviewers.map(i => (
                <MenuItem key={i._id} value={i._id} sx={{ fontWeight: 500 }}>{i.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontWeight: 600 }}>Evaluation Mode</InputLabel>
            <Select
              label="Evaluation Mode"
              value={rescheduleForm.mode}
              onChange={(e) => setRescheduleForm({ 
                ...rescheduleForm, 
                mode: e.target.value,
                generateMeetLink: e.target.value === 'online'
              })}
              sx={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <MenuItem value="online" sx={{ fontWeight: 500 }}>Online Session</MenuItem>
              <MenuItem value="offline" sx={{ fontWeight: 500 }}>In-Person Evaluation</MenuItem>
            </Select>
          </FormControl>

          {rescheduleForm.mode === 'online' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0.5 }}>
              <Checkbox 
                size="small" 
                checked={rescheduleForm.generateMeetLink} 
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, generateMeetLink: e.target.checked })} 
              />
              <Typography variant="caption" fontWeight={800} color="primary.main">
                Auto-generate Google Meet video link
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={() => setOpenRescheduleDialog(false)} 
            color="secondary" 
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            disabled={updateInterviewMutation.isLoading}
            onClick={() => {
              const payload = {
                student: selectedRow.student?._id || selectedRow.student,
                module: selectedRow.module,
                scheduledDate: rescheduleForm.scheduledDate,
                scheduledTime: rescheduleForm.scheduledTime,
                mode: rescheduleForm.mode,
                generateMeetLink: rescheduleForm.generateMeetLink,
                batch: selectedRow.batch?._id || selectedRow.batch,
                course: selectedRow.course?._id || selectedRow.course
              };
              if (rescheduleForm.interviewer) {
                payload.interviewer = rescheduleForm.interviewer;
              }
              
              updateInterviewMutation.mutate({ 
                id: selectedRow._id, 
                data: payload 
              });
            }}
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            {updateInterviewMutation.isLoading ? 'SAVING...' : 'SAVE CHANGES'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 3: SCHEDULE RE-INTERVIEW DIALOG */}
      <Dialog 
        open={openReInterviewDialog} 
        onClose={() => setOpenReInterviewDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem', color: 'error.main' }}>
                SCHEDULE RE-INTERVIEW
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Spawn Re-interview Attempt {selectedRow ? (selectedRow.reInterviewAttempt || 0) + 2 : 2} of {selectedRow?.maxReInterviewLimit || 2} for {selectedRow?.student?.name}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenReInterviewDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Re-Interview Date"
              type="date"
              size="small"
              fullWidth
              value={reInterviewForm.scheduledDate}
              onChange={(e) => setReInterviewForm({ ...reInterviewForm, scheduledDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ '& fieldset': { borderRadius: '10px' } }}
            />
            <TextField
              label="Re-Interview Time"
              type="time"
              size="small"
              fullWidth
              value={reInterviewForm.scheduledTime}
              onChange={(e) => setReInterviewForm({ ...reInterviewForm, scheduledTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ '& fieldset': { borderRadius: '10px' } }}
            />
          </Stack>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontWeight: 600 }}>Evaluation Mode</InputLabel>
            <Select
              label="Evaluation Mode"
              value={reInterviewForm.mode}
              onChange={(e) => setReInterviewForm({ 
                ...reInterviewForm, 
                mode: e.target.value,
                generateMeetLink: e.target.value === 'online'
              })}
              sx={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <MenuItem value="online" sx={{ fontWeight: 500 }}>Online Session</MenuItem>
              <MenuItem value="offline" sx={{ fontWeight: 500 }}>In-Person Evaluation</MenuItem>
            </Select>
          </FormControl>

          {reInterviewForm.mode === 'online' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 0.5 }}>
              <Checkbox 
                size="small" 
                checked={reInterviewForm.generateMeetLink} 
                onChange={(e) => setReInterviewForm({ ...reInterviewForm, generateMeetLink: e.target.checked })} 
              />
              <Typography variant="caption" fontWeight={800} color="primary.main">
                Auto-generate Google Meet video link
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={() => setOpenReInterviewDialog(false)} 
            color="secondary" 
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            disabled={reInterviewMutation.isLoading}
            onClick={() => {
              reInterviewMutation.mutate({ 
                id: selectedRow._id, 
                data: reInterviewForm 
              });
            }}
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            {reInterviewMutation.isLoading ? 'SCHEDULING...' : 'SCHEDULE RE-INTERVIEW'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 4: CANCEL / DELETE CONFIRMATION */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem', color: 'error.main' }}>
            CANCEL MODULE EVALUATION
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.5 }}>
            Are you sure you want to cancel the scheduled evaluation for **{selectedRow?.student?.name}** (Module: {selectedRow?.module?.toUpperCase()})?
            This operation will permanently delete the evaluation record.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)} 
            color="secondary" 
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            color="error"
            disabled={deleteInterviewMutation.isLoading}
            onClick={() => {
              deleteInterviewMutation.mutate(selectedRow._id);
            }}
            sx={{ fontWeight: 800, fontSize: '0.75rem' }}
          >
            {deleteInterviewMutation.isLoading ? 'CANCELLING...' : 'CONFIRM CANCEL'}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default EvaluationManagement;
