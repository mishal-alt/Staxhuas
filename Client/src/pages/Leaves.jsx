import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Stack, Chip, Avatar, Divider,
  Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, ThemeProvider, createTheme, Breadcrumbs, Link as MuiLink,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, Tooltip, Badge, Grid
} from '@mui/material';
import {
  CalendarMonth, CheckCircle, Cancel, Schedule, AssignmentTurnedIn,
  NavigateNext, Search, Warning, TrendingUp, People, FilterList,
  Visibility, BarChart, EventBusy, PriorityHigh, Groups
} from '@mui/icons-material';
import AppShell from '../components/layout/AppShell';
import * as leavesApi from '../api/leaves.api';

const theme = createTheme({
  palette: {
    primary: { main: '#E8391D' },
    secondary: { main: '#1E2126' },
    background: { default: '#F7F7F5' }
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 4 },
});

const STATUS_FILTERS = ['All', 'pending', 'approved', 'rejected'];

const getStatusStyle = (status) => {
  switch (status) {
    case 'approved': return { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'rgba(46,125,50,0.3)', label: 'Approved' };
    case 'rejected': return { bg: 'rgba(211,47,47,0.1)', color: '#d32f2f', border: 'rgba(211,47,47,0.3)', label: 'Rejected' };
    default: return { bg: 'rgba(237,108,2,0.1)', color: '#ed6c02', border: 'rgba(237,108,2,0.3)', label: 'Pending' };
  }
};

const getTypeColor = (type) => {
  const map = { sick: '#d32f2f', casual: '#1565c0', emergency: '#6a1b9a', academic: '#2e7d32', personal: '#ed6c02' };
  return map[type?.toLowerCase()] || '#555';
};

const daysBetween = (from, to) => {
  if (!from || !to) return 1;
  return Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
};

const Leaves = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [detailLeave, setDetailLeave] = useState(null);

  const { data: res, isLoading } = useQuery({
    queryKey: ['leaves-global'],
    queryFn: () => leavesApi.getLeaves(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status }) => leavesApi.reviewLeave(id, { status }),
    onSuccess: (_, vars) => {
      toast.success(`Leave ${vars.status === 'approved' ? 'Approved' : 'Rejected'}`);
      queryClient.invalidateQueries({ queryKey: ['leaves-global'] });
      setDetailLeave(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed'),
  });

  const leaves = useMemo(() => res?.data?.data || res?.data || [], [res]);

  const filtered = useMemo(() => leaves.filter(l => {
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || l.student?.name?.toLowerCase().includes(q)
      || l.batch?.name?.toLowerCase().includes(q)
      || l.leaveType?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }), [leaves, statusFilter, search]);

  // KPI
  const pending = leaves.filter(l => l.status === 'pending').length;
  const approved = leaves.filter(l => l.status === 'approved').length;
  const rejected = leaves.filter(l => l.status === 'rejected').length;
  const total = leaves.length;

  // Batch insights
  const batchMap = useMemo(() => {
    const m = {};
    leaves.forEach(l => {
      const name = l.batch?.name || 'Unknown';
      m[name] = (m[name] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [leaves]);

  // Leave type distribution
  const typeMap = useMemo(() => {
    const m = {};
    leaves.forEach(l => { const t = l.leaveType || 'Other'; m[t] = (m[t] || 0) + 1; });
    return Object.entries(m);
  }, [leaves]);

  const kpis = [
    { label: 'Pending', value: pending, color: '#ed6c02', icon: <Schedule /> },
    { label: 'Approved', value: approved, color: '#2e7d32', icon: <CheckCircle /> },
    { label: 'Rejected', value: rejected, color: '#d32f2f', icon: <Cancel /> },
    { label: 'Total Requests', value: total, color: '#1E2126', icon: <AssignmentTurnedIn /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

          {/* Header */}
          <Box sx={{ pt: 4, pb: 3, px: 6, mx: -6, mt: -6, background: 'white', borderBottom: '1px solid #E5E7EB', mb: 1 }}>
            <Breadcrumbs separator=">" sx={{ mb: 1.5 }}>
              <MuiLink component={Link} to="/dashboard" underline="none" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>DASHBOARD</MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>LEAVE MANAGEMENT</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
                  <EventBusy />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                    LEAVE MANAGEMENT CENTER
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Institute-wide leave control & monitoring across all batches
                  </Typography>
                </Box>
              </Box>
              {pending > 0 && (
                <Chip icon={<PriorityHigh sx={{ fontSize: 14 }} />} label={`${pending} Pending Action`} color="warning" sx={{ fontWeight: 900, fontSize: '0.75rem', borderRadius: 2 }} />
              )}
            </Box>
          </Box>

          {/* KPI Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2 }}>
            {kpis.map((k, i) => (
              <Card key={i} sx={{ border: '1px solid rgba(0,0,0,0.05)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, bgcolor: `${k.color}15`, color: k.color, borderRadius: 2, display: 'flex', flexShrink: 0 }}>
                    {React.cloneElement(k.icon, { sx: { fontSize: 22 } })}
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em', fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>{k.label.toUpperCase()}</Typography>
                    <Typography variant="h4" fontWeight={900} color="secondary" sx={{ fontSize: '1.8rem', lineHeight: 1.1, mt: 0.3 }}>{k.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Smart Alerts */}
          {pending > 0 && (
            <Card sx={{ border: '1px solid rgba(237,108,2,0.25)', bgcolor: 'rgba(237,108,2,0.04)' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Warning sx={{ color: '#ed6c02', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={800} color="#7c4700">
                    ⚠ {pending} leave request{pending > 1 ? 's' : ''} awaiting your review
                    {batchMap[0] ? ` · Highest pending: ${batchMap[0][0]} (${batchMap[0][1]} requests)` : ''}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Filters & Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small" placeholder="Search student, batch, type..." value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
            />
            <Stack direction="row" spacing={1}>
              {STATUS_FILTERS.map(s => (
                <Chip
                  key={s} label={s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                  onClick={() => setStatusFilter(s)} size="small"
                  sx={{
                    fontWeight: 800, cursor: 'pointer', borderRadius: 1.5,
                    bgcolor: statusFilter === s ? 'secondary.main' : 'white',
                    color: statusFilter === s ? 'white' : 'text.secondary',
                    border: statusFilter === s ? 'none' : '1px solid rgba(0,0,0,0.1)'
                  }}
                />
              ))}
            </Stack>
            <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ ml: 'auto' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Main Table */}
          <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', overflow: 'visible' }}>
            {isLoading && <LinearProgress color="primary" />}
            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {['Student', 'Batch', 'Type', 'Duration', 'Days', 'Reason', 'Status', 'Requested', 'Actions'].map(col => (
                      <TableCell key={col} sx={{ fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', bgcolor: '#F9FAFB', py: 1.5, whiteSpace: 'nowrap' }}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}>
                        <Typography color="text.disabled" fontWeight={700}>No leave requests found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map(leave => {
                    const st = getStatusStyle(leave.status);
                    const days = daysBetween(leave.fromDate || leave.startDate, leave.toDate || leave.endDate);
                    return (
                      <TableRow key={leave._id} hover sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 900, borderRadius: 2 }}>{leave.student?.name?.[0] || '?'}</Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={800} color="secondary" sx={{ fontSize: '0.8rem' }}>{leave.student?.name || 'Unknown'}</Typography>
                              <Typography variant="caption" color="text.disabled">{leave.student?.email}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.78rem' }}>{leave.batch?.name || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={leave.leaveType || 'General'} size="small" sx={{ fontWeight: 800, fontSize: '0.6rem', bgcolor: `${getTypeColor(leave.leaveType)}15`, color: getTypeColor(leave.leaveType), borderRadius: 1 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            {leave.fromDate ? new Date(leave.fromDate).toLocaleDateString() : '-'}
                            {leave.toDate && leave.toDate !== leave.fromDate ? ` → ${new Date(leave.toDate).toLocaleDateString()}` : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={900} color={days >= 3 ? 'error.main' : 'text.primary'}>{days}d</Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {leave.reason || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={st.label} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', bgcolor: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 1.5 }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.disabled" fontWeight={700}>
                            {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => setDetailLeave(leave)}>
                                <Visibility sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            {leave.status === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton size="small" sx={{ color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46,125,50,0.1)' } }}
                                    onClick={() => reviewMutation.mutate({ id: leave._id, status: 'approved' })}>
                                    <CheckCircle sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton size="small" sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' } }}
                                    onClick={() => reviewMutation.mutate({ id: leave._id, status: 'rejected' })}>
                                    <Cancel sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Bottom Insights Row */}
          <Grid container spacing={2}>

            {/* Batch Insights */}
            <Grid item xs={12} md={6}>
              <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Groups sx={{ fontSize: 18, color: 'secondary.main' }} />
                  <Typography variant="subtitle2" fontWeight={900}>BATCH LEAVE INSIGHTS</Typography>
                </Box>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {batchMap.length === 0 ? (
                    <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 2 }}>No data yet</Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {batchMap.slice(0, 6).map(([name, count]) => (
                        <Box key={name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={700} color="secondary">{name}</Typography>
                            <Typography variant="caption" fontWeight={900} color="primary">{count} request{count > 1 ? 's' : ''}</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(100, (count / Math.max(...batchMap.map(b => b[1]))) * 100)}
                            sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#E8391D', borderRadius: 3 } }} />
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Leave Type Distribution */}
            <Grid item xs={12} md={6}>
              <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart sx={{ fontSize: 18, color: 'secondary.main' }} />
                  <Typography variant="subtitle2" fontWeight={900}>LEAVE TYPE DISTRIBUTION</Typography>
                </Box>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {typeMap.length === 0 ? (
                    <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 2 }}>No data yet</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {typeMap.map(([type, count]) => (
                        <Box key={type} sx={{ p: 1.5, borderRadius: 2, bgcolor: `${getTypeColor(type)}10`, border: `1px solid ${getTypeColor(type)}30`, minWidth: 90, textAlign: 'center' }}>
                          <Typography variant="h5" fontWeight={900} sx={{ color: getTypeColor(type), lineHeight: 1 }}>{count}</Typography>
                          <Typography variant="caption" fontWeight={800} sx={{ color: getTypeColor(type), fontSize: '0.6rem', textTransform: 'uppercase' }}>{type}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

          </Grid>

        </Box>

        {/* Detail Modal */}
        <Dialog open={!!detailLeave} onClose={() => setDetailLeave(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          {detailLeave && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box>
                  <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1rem' }}>LEAVE REQUEST DETAILS</Typography>
                  <Typography variant="caption" color="text.secondary">Submitted on {detailLeave.createdAt ? new Date(detailLeave.createdAt).toLocaleString() : '-'}</Typography>
                </Box>
                <Chip label={getStatusStyle(detailLeave.status).label} size="small"
                  sx={{ fontWeight: 900, bgcolor: getStatusStyle(detailLeave.status).bg, color: getStatusStyle(detailLeave.status).color, border: `1px solid ${getStatusStyle(detailLeave.status).border}` }} />
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 48, height: 48, fontWeight: 900, fontSize: '1.2rem' }}>{detailLeave.student?.name?.[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={900} color="secondary">{detailLeave.student?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{detailLeave.student?.email}</Typography>
                    </Box>
                    <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                      <Typography variant="caption" color="text.disabled" fontWeight={700}>BATCH</Typography>
                      <Typography variant="body2" fontWeight={900} color="secondary">{detailLeave.batch?.name || '-'}</Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {[
                      { label: 'Leave Type', value: detailLeave.leaveType || 'General' },
                      { label: 'Duration', value: `${daysBetween(detailLeave.fromDate, detailLeave.toDate)} day(s)` },
                      { label: 'From Date', value: detailLeave.fromDate ? new Date(detailLeave.fromDate).toLocaleDateString() : '-' },
                      { label: 'To Date', value: detailLeave.toDate ? new Date(detailLeave.toDate).toLocaleDateString() : '-' },
                    ].map(({ label, value }) => (
                      <Box key={label} sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 1.5 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6rem' }}>{label}</Typography>
                        <Typography variant="body2" fontWeight={800} color="secondary" sx={{ mt: 0.3 }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 2 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6rem', display: 'block', mb: 0.5 }}>REASON</Typography>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7 }}>{detailLeave.reason || 'No reason provided.'}</Typography>
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={() => setDetailLeave(null)} sx={{ color: 'text.secondary', fontWeight: 800 }}>Close</Button>
                {detailLeave.status === 'pending' && (
                  <>
                    <Button variant="outlined" color="error" sx={{ fontWeight: 900, borderWidth: 2, borderRadius: 2 }}
                      onClick={() => reviewMutation.mutate({ id: detailLeave._id, status: 'rejected' })}>
                      Reject
                    </Button>
                    <Button variant="contained" sx={{ fontWeight: 900, borderRadius: 2, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                      onClick={() => reviewMutation.mutate({ id: detailLeave._id, status: 'approved' })}>
                      Approve
                    </Button>
                  </>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

      </AppShell>
    </ThemeProvider>
  );
};

export default Leaves;
