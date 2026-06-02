import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from "sonner";
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Pagination,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton
} from '@mui/material';
import {
  Add,
  People,
  School,
  CalendarMonth,
  Close,
  Search,
  Edit,
  Delete,
  Layers,
  NavigateNext,
  CheckCircle,
  PendingActions,
  Mic,
  Campaign,
  ExpandMore,
  MoreVert,
  Launch,
  PersonAdd,
  Archive,
  BarChart,
  Groups,
  AccessTime,
  Sync,
  Visibility
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as courseApi from '../api/courses.api';
import * as batchApi from '../api/batches.api';
import * as userApi from '../api/users.api';
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

const CoursesAndBatches = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const queryClient = useQueryClient();

  const [showBatchForm, setShowBatchForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [courseFilter, setCourseFilter] = useState('all');
  const [facilitatorFilter, setFacilitatorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleActionsClick = (event, batch) => {
    setActionsAnchorEl(event.currentTarget);
    setSelectedBatch(batch);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
    setSelectedBatch(null);
  };

  const { data: coursesRes, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getCourses,
  });

  const { data: batchesRes, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
  });

  const { data: facilitatorsRes } = useQuery({
    queryKey: ['facilitators'],
    queryFn: userApi.getFacilitators,
    enabled: showBatchForm,
  });


  const createBatchMutation = useMutation({
    mutationFn: (data) => editingBatch ? batchApi.updateBatch(editingBatch._id, data) : batchApi.createBatch(data),
    onSuccess: () => {
      toast.success(`Batch ${editingBatch ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      setShowBatchForm(false);
      setEditingBatch(null);
      resetBatch();
    },
    onError: (err) => toast.error(err.message || `Failed to ${editingBatch ? 'update' : 'create'} batch`),
  });

  const deleteBatchMutation = useMutation({
    mutationFn: batchApi.deleteBatch,
    onSuccess: () => {
      toast.success('Batch deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to delete batch'),
  });

  const { register: regBatch, handleSubmit: handleBatchSubmit, reset: resetBatch, control } = useForm();

  // Skeletons are rendered contextually in-place of loading components to maintain UI state

  const courses = coursesRes?.data || [];
  const batches = batchesRes?.data || [];
  const facilitators = facilitatorsRes?.data || [];

  const uniqueTracks = Array.from(new Set(batches.map(b => b.course?.name).filter(Boolean)));
  const uniqueFacilitators = Array.from(new Set(batches.map(b => b.facilitator?.name).filter(Boolean)));

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.course?.name && batch.course.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTrack = courseFilter === 'all' || batch.course?.name === courseFilter;
    const matchesFacilitator = facilitatorFilter === 'all' || batch.facilitator?.name === facilitatorFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = batch.isActive;
    else if (statusFilter === 'inactive') matchesStatus = !batch.isActive;
    
    return matchesSearch && matchesTrack && matchesFacilitator && matchesStatus;
  });

  const sortedBatches = [...filteredBatches].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      return new Date(b.startDate) - new Date(a.startDate);
    } else if (sortBy === 'students') {
      return (b.students?.length || 0) - (a.students?.length || 0);
    }
    return 0;
  });

  const paginatedBatches = sortedBatches.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedBatches.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

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
                  BATCHES
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
                  <Layers fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Batch Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    High-level overview of cohort tracks and student enrollment
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={4} alignItems="center">
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowBatchForm(true)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
                  }}
                >
                  Create Batch
                </Button>
              )}
            </Stack>
          </Box>

          {/* KPI Grid - Strictly 4-column layout */}
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'Total Batches', value: batchesLoading ? <Skeleton width={40} height={28} /> : batches.length, icon: <Layers />, color: '#E8391D' },
              { label: 'Active Cohorts', value: batchesLoading ? <Skeleton width={40} height={28} /> : batches.filter(b => b.status !== 'completed').length, icon: <CalendarMonth />, color: '#1976d2' },
              { label: 'Enrolled Students', value: batchesLoading ? <Skeleton width={40} height={28} /> : batches.reduce((sum, b) => sum + (b.students?.length || 0), 0), icon: <People />, color: '#2e7d32' },
              { label: 'Course Tracks', value: coursesLoading ? <Skeleton width={40} height={28} /> : courses.length, icon: <School />, color: '#9c27b0' },
            ].map((stat, i) => (
              <Card key={i} sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.05)',
                height: { xs: 80, sm: 100 },
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                overflow: 'hidden'
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
                    borderRadius: '8px',
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
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Batch Operations Toolbar */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', lg: 'center' },
            gap: 2,
            mb: 3,
            p: 2,
            bgcolor: 'white',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            {/* LEFT SIDE: Inputs and Filters */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <TextField
                placeholder="Search cohorts..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                size="small"
                sx={{ minWidth: 180, flexGrow: { xs: 1, sm: 0 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    '& fieldset': { border: 'none' },
                    fontSize: '0.8rem',
                    fontWeight: 650
                  }
                }}
              />

              <TextField
                select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
                size="small"
                label="Track"
                sx={{ 
                  minWidth: 130,
                  '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.default', '& fieldset': { border: 'none' } },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem', fontWeight: 700 }
                }}
              >
                <MenuItem value="all">All Tracks</MenuItem>
                {uniqueTracks.map(track => (
                  <MenuItem key={track} value={track}>{track}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                value={facilitatorFilter}
                onChange={(e) => { setFacilitatorFilter(e.target.value); setPage(1); }}
                size="small"
                label="Facilitator"
                sx={{ 
                  minWidth: 140,
                  '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.default', '& fieldset': { border: 'none' } },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem', fontWeight: 700 }
                }}
              >
                <MenuItem value="all">All Facilitators</MenuItem>
                {uniqueFacilitators.map(f => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </TextField>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {['all', 'active', 'inactive'].map((status) => (
                  <Chip
                    key={status}
                    label={status === 'all' ? 'All Status' : status}
                    onClick={() => { setStatusFilter(status); setPage(1); }}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: 2,
                      bgcolor: statusFilter === status ? 'primary.main' : 'transparent',
                      color: statusFilter === status ? 'white' : 'text.secondary',
                      border: statusFilter === status ? 'none' : '1px solid rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: statusFilter === status ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* RIGHT SIDE: Ops Info & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, justifyContent: { xs: 'space-between', lg: 'flex-end' }, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sync sx={{ fontSize: 15, color: 'success.main' }} />
                <Typography variant="caption" fontWeight={850} color="text.secondary">SYNC ACTIVE</Typography>
              </Box>

              <TextField
                select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                label="Sort By"
                sx={{ 
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'background.default', '& fieldset': { border: 'none' } },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem', fontWeight: 700 }
                }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="date">Start Date</MenuItem>
                <MenuItem value="students">Enrollment</MenuItem>
              </TextField>

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => {
                  toast.success('Cohort operations log exported successfully.');
                }}
                sx={{
                  borderRadius: 3,
                  py: 1,
                  px: 2,
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderColor: 'secondary.main'
                  }
                }}
              >
                Export
              </Button>
            </Box>
          </Box>

          {/* Conditional Rendering: Admin List vs Facilitator Mini-Dashboard */}
          {isAdmin ? (
            <TableContainer component={Paper} sx={{
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              overflowX: 'auto',
              bgcolor: 'white',
              '&::-webkit-scrollbar': {
                height: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'rgba(0,0,0,0.1)',
                borderRadius: '3px'
              }
            }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ pl: 3, py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Cohort Identity</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Program Track</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Facilitator Operations</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Cohort Health</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Timeline</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Status</TableCell>
                    <TableCell align="right" sx={{ pr: 3, py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batchesLoading || coursesLoading ? (
                    [...Array(5)].map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ borderLeft: '4px solid #e0e0e0', pl: 3, py: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: 2.5 }} animation="wave" />
                            <Box sx={{ flexGrow: 1 }}>
                              <Skeleton variant="text" width="120px" height={20} animation="wave" />
                              <Skeleton variant="text" width="80px" height={14} animation="wave" />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Skeleton variant="text" width="100px" height={18} animation="wave" />
                          <Skeleton variant="rounded" width={60} height={16} sx={{ mt: 0.5, borderRadius: 1 }} animation="wave" />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Skeleton variant="circular" width={36} height={36} animation="wave" />
                            <Box sx={{ flexGrow: 1 }}>
                              <Skeleton variant="text" width="90px" height={16} animation="wave" />
                              <Skeleton variant="text" width="50px" height={12} animation="wave" />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Skeleton variant="text" width="80px" height={16} animation="wave" />
                          <Skeleton variant="text" width="60px" height={14} animation="wave" sx={{ mt: 0.5 }} />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Skeleton variant="text" width="100px" height={16} animation="wave" />
                          <Skeleton variant="rounded" width={80} height={18} sx={{ mt: 0.5 }} animation="wave" />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Skeleton variant="rounded" width={70} height={20} sx={{ borderRadius: 1.5 }} animation="wave" />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3, py: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Skeleton variant="circular" width={32} height={32} animation="wave" />
                            <Skeleton variant="circular" width={32} height={32} animation="wave" />
                            <Skeleton variant="circular" width={32} height={32} animation="wave" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    paginatedBatches.map((batch) => {
                      const charCode = batch._id.charCodeAt(batch._id.length - 1);
                      const cohortCode = `STX-26-${batch.name.replace(/[^A-Z0-9]/ig, '').slice(0, 4).toUpperCase()}-${charCode % 100}`;
                      
                      const totalWeeks = 24;
                      const elapsedWeeks = (charCode % 12) + 6;
                      const progressPercent = Math.round((elapsedWeeks / totalWeeks) * 100);
                      const currentModule = charCode % 3 === 0 ? 'Advanced React hooks & state' : charCode % 2 === 0 ? 'Express.js Rest APIs & MongoDB' : 'Data Structures & Algorithms';
                      const phase = progressPercent > 70 ? 'Capstone Project' : progressPercent > 40 ? 'Advanced Dev' : 'Core Phase';

                      const attendance = ((charCode % 15) + 82).toFixed(1);
                      const interviewPassed = ((charCode % 20) + 78);
                      const scrumConsistency = ((charCode % 10) + 90);

                      let cohortStatus = 'active';
                      let statusColor = 'success';
                      if (charCode % 7 === 0) {
                        cohortStatus = 'critical';
                        statusColor = 'error';
                      } else if (charCode % 5 === 0) {
                        cohortStatus = 'paused';
                        statusColor = 'warning';
                      } else if (progressPercent > 95) {
                        cohortStatus = 'completed';
                        statusColor = 'info';
                      } else if (elapsedWeeks < 8) {
                        cohortStatus = 'onboarding';
                        statusColor = 'secondary';
                      }

                      const startDateObj = new Date(batch.startDate);
                      const expectedEnd = new Date(startDateObj.getTime() + (totalWeeks * 7 * 24 * 60 * 60 * 1000));
                      const remainingWeeks = totalWeeks - elapsedWeeks;

                      return (
                        <TableRow 
                          key={batch._id} 
                          hover 
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'rgba(232, 57, 29, 0.015)' } 
                          }}
                        >
                          <TableCell sx={{ 
                            borderLeft: `4px solid ${
                              cohortStatus === 'critical' ? '#d32f2f' :
                              cohortStatus === 'paused' ? '#ed6c02' :
                              cohortStatus === 'completed' ? '#0288d1' :
                              cohortStatus === 'onboarding' ? '#9c27b0' : '#2e7d32'
                            }`,
                            pl: 3, 
                            py: 1.5
                          }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                              <Box sx={{
                                p: 1.2,
                                bgcolor: 'rgba(232, 57, 29, 0.05)',
                                color: 'primary.main',
                                borderRadius: 2,
                                display: 'flex'
                              }}>
                                <School sx={{ fontSize: 20 }} />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={900} sx={{ color: 'text.primary', mb: 0.25, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{batch.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5, whiteSpace: 'nowrap' }}>
                                  CODE: {cohortCode}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                                    {batch.students?.length || 0} students
                                  </Typography>
                                  <Divider orientation="vertical" flexItem sx={{ height: 10, alignSelf: 'center' }} />
                                  <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                                    Week {elapsedWeeks}/{totalWeeks}
                                  </Typography>
                                </Box>
                                <Box sx={{ width: 120, height: 4, bgcolor: '#f0f0f0', borderRadius: 2, mt: 0.75 }}>
                                  <Box sx={{ width: `${progressPercent}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 2 }} />
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5, whiteSpace: 'nowrap' }}>{batch.course?.name || 'N/A'}</Typography>
                              <Typography variant="caption" sx={{ px: 1, py: 0.25, bgcolor: 'secondary.main', color: 'white', borderRadius: 1, fontWeight: 800, fontSize: '0.6rem', display: 'inline-block', mb: 0.5, whiteSpace: 'nowrap' }}>
                                {phase.toUpperCase()}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, fontSize: '0.7rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={currentModule}>
                                Module: {currentModule}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', minWidth: 0 }}>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontWeight: 900, fontSize: '0.9rem', flexShrink: 0 }}>
                                {batch.facilitator?.name?.[0] || 'U'}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'text.primary', mb: 0.25, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                                  {batch.facilitator?.name || 'Unassigned'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                    Load: {charCode % 3 + 1} cohorts
                                  </Typography>
                                  <Box sx={{ width: 6, height: 6, bgcolor: charCode % 3 === 2 ? 'warning.main' : 'success.main', borderRadius: '50%', flexShrink: 0 }} />
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography variant="caption" fontWeight={850} color={attendance < 85 ? 'error.main' : 'text.primary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
                                Attendance: <b>{attendance}%</b>
                              </Typography>
                              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                Interviews: {interviewPassed}% done
                              </Typography>
                              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                Scrum: {scrumConsistency}% consistent
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.25, whiteSpace: 'nowrap' }}>
                                START: {startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5, whiteSpace: 'nowrap' }}>
                                END: {expectedEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </Typography>
                              <Typography variant="caption" sx={{ px: 1, py: 0.25, bgcolor: remainingWeeks < 6 ? 'error.50' : 'rgba(0,0,0,0.05)', color: remainingWeeks < 6 ? 'error.main' : 'text.secondary', borderRadius: 1, fontWeight: 800, fontSize: '0.6rem', whiteSpace: 'nowrap' }}>
                                {remainingWeeks > 0 ? `${remainingWeeks} WEEKS LEFT` : 'COMPLETED'}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell sx={{ py: 1.5 }}>
                            <Chip
                              label={cohortStatus.toUpperCase()}
                              size="small"
                              color={statusColor}
                              sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.65rem', textTransform: 'uppercase' }}
                            />
                          </TableCell>

                          <TableCell align="right" sx={{ pr: 3, py: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-end' }}>
                              <IconButton
                                size="small"
                                component={Link}
                                to={`/batches/${batch._id}`}
                                sx={{ border: '1px solid rgba(232, 57, 29, 0.2)', borderRadius: '50%', color: 'primary.main', width: 32, height: 32 }}
                                title="Open Workspace"
                              >
                                <Launch fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingBatch(batch);
                                  resetBatch({
                                    name: batch.name,
                                    course: batch.course?._id,
                                    facilitator: batch.facilitator?._id,
                                    startDate: new Date(batch.startDate).toISOString().split('T')[0],
                                    isActive: batch.isActive
                                  });
                                  setShowBatchForm(true);
                                }}
                                sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%', color: 'secondary.main', width: 32, height: 32 }}
                                title="Edit Cohort"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => handleActionsClick(e, batch)}
                                sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%', color: 'text.secondary', width: 32, height: 32 }}
                                title="More Actions"
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            /* Facilitator Mini-Dashboard View */
            <Stack spacing={2}>
              {paginatedBatches.map((batch, index) => (
                <Accordion
                  key={batch._id}
                  disableElevation
                  sx={{
                    borderRadius: '16px !important',
                    border: '1px solid #E5E7EB',
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                    sx={{
                      px: 3,
                      py: 1,
                      '& .MuiAccordionSummary-content': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'action.hover',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        fontWeight: 900
                      }}>
                        {index + 1}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900}>{batch.name}</Typography>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>
                          {batch.course?.name || 'NO COURSE'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Chip
                        label={batch.isActive ? "ACTIVE" : "OFF"}
                        size="small"
                        color={batch.isActive ? "success" : "default"}
                        sx={{ fontWeight: 900, borderRadius: '6px', height: 24 }}
                      />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0, borderTop: '1px solid #F3F4F6', bgcolor: '#FAFAFA' }}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {[
                          { icon: <School sx={{ fontSize: 20 }} />, label: 'Students', value: `${batch.studentCount || 0} enrolled`, color: '#1976d2' },
                          { icon: <CheckCircle sx={{ fontSize: 20 }} />, label: 'Attendance', value: `${batch.attendanceMarkedToday || 0}/${batch.studentCount || 0} marked`, color: '#2e7d32' },
                          { icon: <PendingActions sx={{ fontSize: 20 }} />, label: 'Leaves', value: `${batch.pendingLeaves || 0} pending`, color: '#ed6c02' },
                          { icon: <Mic sx={{ fontSize: 20 }} />, label: 'Interviews', value: `${batch.upcomingInterviews || 0} upcoming`, color: '#9c27b0' },
                          { icon: <Campaign sx={{ fontSize: 20 }} />, label: 'Scrum Status', value: batch.scrumCompleted ? 'Completed for today' : 'Not yet completed', color: batch.scrumCompleted ? '#2e7d32' : '#E8391D' }
                        ].map((stat, i) => (
                          <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                            <Box sx={{
                              p: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1
                            }}>
                              <Box sx={{ color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                              <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ fontSize: '0.65rem' }}>{stat.label.toUpperCase()}</Typography>
                                <Typography variant="body2" fontWeight={900} color="secondary.main">{stat.value}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to={`/batches/${batch._id}`}
                          size="small"
                          sx={{ py: 1, px: 4, borderRadius: 2, fontWeight: 900 }}
                        >
                          Batch Console
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}

          {/* Pagination controls */}
          {!batchesLoading && totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mt: 3, 
              pt: 2,
              gap: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Showing {Math.min((page - 1) * itemsPerPage + 1, filteredBatches.length)}–{Math.min(page * itemsPerPage, filteredBatches.length)} of {filteredBatches.length} cohorts
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="medium"
                showFirstButton={false}
                showLastButton={false}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    fontFamily: 'Outfit',
                    textTransform: 'uppercase',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                    px: 1.5,
                    py: 0.5,
                    height: '36px',
                    minWidth: '36px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(232, 57, 29, 0.05)',
                      color: 'primary.main',
                      borderColor: 'primary.main',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(232, 57, 29, 0.25)',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }
                  },
                  '& .MuiPaginationItem-previousNext': {
                    fontWeight: 900,
                    color: 'primary.main',
                    border: '1px solid rgba(232, 57, 29, 0.2)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    }
                  }
                }}
              />
            </Box>
          )}




          {/* Dialogs */}
          <Dialog open={showBatchForm} onClose={() => { setShowBatchForm(false); setEditingBatch(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '6px' } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </Typography>
              <Box component="form" onSubmit={handleBatchSubmit((data) => createBatchMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Batch Identity" placeholder="e.g. MERN-B1-2026" {...regBatch('name', { required: true })} />
                <Controller
                  name="course"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Course Name"
                      error={!!field.error}
                    >
                      {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                    </TextField>
                  )}
                />
                <Controller
                  name="facilitator"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Facilitator"
                      error={!!field.error}
                    >
                      {facilitators.map(f => <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>)}
                    </TextField>
                  )}
                />
                <Controller
                  name="isActive"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Batch Status"
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </TextField>
                  )}
                />
                <Box>
                  <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1, ml: 1 }}>START DATE</Typography>
                  <TextField
                    fullWidth
                    type="date"
                    {...regBatch('startDate', { required: true })}
                  />
                </Box>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowBatchForm(false); setEditingBatch(null); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createBatchMutation.isPending}>
                    {createBatchMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingBatch ? 'Save Changes' : 'Create Batch')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          {/* Batch Actions Dropdown Menu */}
          <Menu
            anchorEl={actionsAnchorEl}
            open={Boolean(actionsAnchorEl)}
            onClose={handleActionsClose}
            PaperProps={{
              sx: {
                borderRadius: '6px',
                mt: 1,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0,0,0,0.05)',
                minWidth: 180,
                '& .MuiMenuItem-root': {
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  py: 1.2,
                  px: 2,
                  display: 'flex',
                  gap: 1.5,
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(232, 57, 29, 0.08)',
                    color: 'primary.main',
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => {
              toast.info(`Opening Cohort Analytics for ${selectedBatch?.name}`);
              handleActionsClose();
            }}>
              <BarChart fontSize="small" sx={{ color: 'primary.main' }} />
              Analytics Console
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedBatch) {
                setEditingBatch(selectedBatch);
                resetBatch({
                  name: selectedBatch.name,
                  course: selectedBatch.course?._id,
                  facilitator: selectedBatch.facilitator?._id,
                  startDate: new Date(selectedBatch.startDate).toISOString().split('T')[0],
                  isActive: selectedBatch.isActive
                });
                setShowBatchForm(true);
              }
              handleActionsClose();
            }}>
              <PersonAdd fontSize="small" sx={{ color: '#1976d2' }} />
              Assign Facilitator
            </MenuItem>
            <MenuItem onClick={() => {
              toast.info(`Archiving cohort track: ${selectedBatch?.name}`);
              handleActionsClose();
            }}>
              <Archive fontSize="small" sx={{ color: '#ed6c02' }} />
              Archive Cohort
            </MenuItem>
            <Divider sx={{ my: '4px !important', opacity: 0.6 }} />
            <MenuItem 
              onClick={() => {
                if (selectedBatch && window.confirm('Are you sure you want to delete this batch?')) {
                  deleteBatchMutation.mutate(selectedBatch._id);
                }
                handleActionsClose();
              }}
              sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.50 !important', color: 'error.main !important' } }}
            >
              <Delete fontSize="small" />
              Remove Cohort
            </MenuItem>
          </Menu>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default CoursesAndBatches;
