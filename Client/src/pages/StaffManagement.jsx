import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  createTheme,
  TextField,
  MenuItem,
  Menu,
  IconButton,
  InputAdornment,
  Pagination,
  Dialog,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Shield,
  Mail,
  PersonAdd,
  Schedule,
  VerifiedUser,
  Email,
  SupervisorAccount,
  Add,
  Close,
  Send,
  Search,
  Edit,
  Delete,
  AccountCircle,
  NavigateNext,
  FilterList,
  Tune,
  AccessTime,
  TrendingUp,
  Assignment,
  Groups,
  Chat,
  MoreVert,
  Visibility,
  History,
  BarChart,
  Lock,
  Sync,
  GroupWork
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as userApi from '../api/users.api';
import * as invitationApi from '../api/invitations.api';
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

const StaffManagement = () => {
  const queryClient = useQueryClient();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [msgAnchorEl, setMsgAnchorEl] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleMsgClick = (event, member) => {
    setMsgAnchorEl(event.currentTarget);
    setSelectedStaff(member);
  };

  const handleMsgClose = () => {
    setMsgAnchorEl(null);
    setSelectedStaff(null);
  };

  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const [f, i] = await Promise.all([
        userApi.getFacilitators(),
        userApi.getInterviewers()
      ]);
      return [...(f?.data || []), ...(i?.data || [])];
    }
  });

  const { data: invitesRes, isLoading: invitesLoading } = useQuery({
    queryKey: ['invitations', 'staff'],
    queryFn: () => invitationApi.getInvitations()
  });

  const inviteMutation = useMutation({
    mutationFn: invitationApi.inviteStudent,
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      setShowInviteForm(false);
      reset();
    },
    onError: (err) => toast.error(err.message || 'Failed to send invitation')
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('Staff updated successfully');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setEditingStaff(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to update staff')
  });

  const deleteStaffMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      toast.success('Staff member removed');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to remove staff')
  });

  const { register, handleSubmit, reset } = useForm();

  // Skeletons are rendered contextually below to prevent blocking top sections

  const baseStaff = usersRes || [];
  
  const dummyStaff = [
    {
      _id: 'dummy_staff_1',
      name: 'Sarah Jenkins',
      email: 's.jenkins@staxhaus.com',
      role: ROLES.FACILITATOR
    },
    {
      _id: 'dummy_staff_2',
      name: 'Michael Chen',
      email: 'm.chen@staxhaus.com',
      role: ROLES.FACILITATOR
    },
    {
      _id: 'dummy_staff_3',
      name: 'Elena Rostova',
      email: 'e.rostova@staxhaus.com',
      role: ROLES.INTERVIEWER
    },
    {
      _id: 'dummy_staff_4',
      name: 'David Kalu',
      email: 'd.kalu@staxhaus.com',
      role: ROLES.FACILITATOR
    },
    {
      _id: 'dummy_staff_5',
      name: 'Aisha Rahman',
      email: 'a.rahman@staxhaus.com',
      role: ROLES.INTERVIEWER
    }
  ];

  const staff = [...baseStaff, ...dummyStaff];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedStaff = filteredStaff.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 12 }}>

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
                  STAFF
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
                  <SupervisorAccount fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Staff Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Control access and manage the Staxhaus facilitation team
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => setShowInviteForm(true)}
              startIcon={<Add />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}
            >
              Invite Staff
            </Button>
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
              { label: 'Total Team', value: usersLoading ? <Skeleton width={40} height={28} /> : staff.length, icon: <SupervisorAccount />, color: '#1E2126' },
              { label: 'Facilitators', value: usersLoading ? <Skeleton width={40} height={28} /> : staff.filter(u => u.role === 'facilitator').length, icon: <AccountCircle />, color: '#E8391D' },
              { label: 'Interviewers', value: usersLoading ? <Skeleton width={40} height={28} /> : staff.filter(u => u.role === 'interviewer').length, icon: <Shield />, color: '#1976d2' },
              { label: 'Open Invites', value: invitesLoading ? <Skeleton width={40} height={28} /> : (invitesRes?.data?.length || 0), icon: <Mail />, color: '#ed6c02' },
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
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Invite Staff Dialog */}
          <Dialog
            open={showInviteForm}
            onClose={() => { setShowInviteForm(false); reset(); }}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 6 } }}
          >
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>
                Invite New Staff
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit((data) => inviteMutation.mutate(data))}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  {...register('name', { required: true })}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  placeholder="e.g. john@staxhaus.com"
                  {...register('email', { required: true })}
                />
                <TextField
                  select
                  fullWidth
                  label="Assign Role"
                  defaultValue={ROLES.FACILITATOR}
                  {...register('role', { required: true })}
                >
                  <MenuItem value={ROLES.FACILITATOR}>Facilitator</MenuItem>
                  <MenuItem value={ROLES.INTERVIEWER}>Interviewer</MenuItem>
                </TextField>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button
                    onClick={() => { setShowInviteForm(false); reset(); }}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={inviteMutation.isPending}
                    startIcon={<Send />}
                  >
                    {inviteMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Send Invitation'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>


          {/* Operational Control Bar */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', lg: 'center' },
            gap: 2,
            mb: 2,
            p: 2,
            bgcolor: 'white',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
              <TextField
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                size="small"
                sx={{ minWidth: 280 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    bgcolor: 'background.default',
                    '& fieldset': { border: 'none' },
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }
                }}
              />
              <Divider orientation="vertical" flexItem sx={{ opacity: 0.6 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['all', ROLES.FACILITATOR, ROLES.INTERVIEWER].map((role) => (
                  <Chip
                    key={role}
                    label={role === 'all' ? 'All Roles' : role}
                    onClick={() => { setRoleFilter(role); setPage(1); }}
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: 2,
                      px: 1,
                      bgcolor: roleFilter === role ? 'primary.main' : 'transparent',
                      color: roleFilter === role ? 'white' : 'text.secondary',
                      border: roleFilter === role ? 'none' : '1px solid rgba(0,0,0,0.1)',
                      '&:hover': {
                        bgcolor: roleFilter === role ? 'primary.dark' : 'rgba(0,0,0,0.04)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: { xs: 'space-between', lg: 'flex-end' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sync sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary">Live Sync</Typography>
              </Box>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" fontWeight={800} color="text.primary">
                  {usersLoading ? (
                    <Skeleton width={100} height={16} />
                  ) : (
                    <>
                      {filteredStaff.length} <span style={{ color: '#888', fontWeight: 600 }}>Staff Members</span>
                    </>
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack spacing={4}>
            <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, pl: 1 }}>
              <GroupWork color="primary" /> Operational Staff Directory
            </Typography>

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
              <Table sx={{ minWidth: 700 }}>
                <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ pl: 3, py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff Member</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Operations</TableCell>
                    <TableCell sx={{ py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                    <TableCell align="right" sx={{ pr: 3, py: 1.5, fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersLoading || invitesLoading ? (
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
                          <Skeleton variant="rounded" width={80} height={20} sx={{ borderRadius: 1.5 }} animation="wave" />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Skeleton variant="text" width="80px" height={16} animation="wave" />
                          <Skeleton variant="text" width="100px" height={14} sx={{ mt: 0.5 }} animation="wave" />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Skeleton variant="rounded" width={70} height={20} sx={{ borderRadius: 2 }} animation="wave" />
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
                    paginatedStaff.map(member => {
                      // Mock deterministic operational data based on ID
                      const charCode = member._id.charCodeAt(member._id.length - 1);
                      const isActive = charCode % 3 !== 0;
                      const activeCohorts = (charCode % 4) + 1;
                      const responseTime = `${((charCode % 5) + 1.2).toFixed(1)}h`;
                      
                      return (
                        <TableRow 
                          key={member._id} 
                          sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': { 
                              bgcolor: 'rgba(232, 57, 29, 0.015)' 
                            }
                          }}
                        >
                          <TableCell sx={{ 
                            borderLeft: `4px solid ${isActive ? '#2e7d32' : '#ed6c02'}`,
                            pl: 3,
                            py: 1.5
                          }}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main', fontWeight: 900, borderRadius: 2.5, boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                                {member.name[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={900} sx={{ color: 'text.primary', lineHeight: 1.2, mb: 0.25 }}>{member.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                  <Mail sx={{ fontSize: 13 }} /> {member.email}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Typography variant="caption" sx={{ px: 1, py: 0.1, bgcolor: '#f0f0f0', borderRadius: 0.75, fontWeight: 800, fontSize: '0.55rem', color: '#666' }}>
                                    ID: {member._id.slice(-6).toUpperCase()}
                                  </Typography>
                                  <Typography variant="caption" sx={{ px: 1, py: 0.1, bgcolor: 'primary.50', color: 'primary.main', borderRadius: 0.75, fontWeight: 800, fontSize: '0.55rem' }}>
                                    ACADEMIC OPS
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <Chip label={member.role} size="small" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', borderRadius: 1.5, bgcolor: 'secondary.main', color: 'white' }} />
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography variant="caption" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
                                <Groups sx={{ fontSize: 15, color: 'primary.main' }} /> {activeCohorts} Cohorts
                              </Typography>
                              <Typography variant="caption" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <AccessTime sx={{ fontSize: 15, color: 'warning.main' }} /> {responseTime}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: isActive ? 'rgba(46, 125, 50, 0.08)' : 'rgba(237, 108, 2, 0.08)' }}>
                              <Box sx={{ width: 6, height: 6, bgcolor: isActive ? 'success.main' : 'warning.main', borderRadius: '50%' }} />
                              <Typography variant="caption" fontWeight={800} color={isActive ? 'success.main' : 'warning.main'} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                                {isActive ? 'Active Now' : 'Away'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 3, py: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <IconButton size="small" component={Link} to={`/staff/profile/${member._id}`} sx={{ border: '1px solid rgba(232, 57, 29, 0.2)', borderRadius: '50%', color: 'primary.main', width: 32, height: 32 }} title="View Profile">
                                <Visibility fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                sx={{ border: '1px solid rgba(232, 57, 29, 0.2)', borderRadius: '50%', color: 'primary.main', width: 32, height: 32 }} 
                                title="Message"
                                onClick={(e) => handleMsgClick(e, member)}
                              >
                                <Chat fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => { if (confirm(`Remove ${member.name} from staff?`)) deleteStaffMutation.mutate(member._id); }} sx={{ border: '1px solid rgba(211, 47, 47, 0.15)', borderRadius: '50%', width: 32, height: 32 }} title="Remove Staff">
                                <Delete fontSize="small" />
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

            {!usersLoading && filteredStaff.length === 0 && (
              <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 6, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.1)' }}>
                <Typography color="text.secondary" fontWeight={600} variant="body2">No matching staff members found.</Typography>
              </Paper>
            )}

            {/* Pagination footer */}
            {!usersLoading && totalPages > 1 && (
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
                  Showing {Math.min((page - 1) * itemsPerPage + 1, filteredStaff.length)}–{Math.min(page * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff members
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

            {/* NEW OPERATIONAL SECTIONS */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pl: 1 }}>
                <BarChart color="primary" /> Institution Level Operations
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'stretch' }}>
                {/* SECTION A & B */}
                <Stack spacing={3} sx={{ height: '100%' }}>
                  {/* Team Distribution */}
                  <Card sx={{ borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Groups sx={{ color: 'action.active' }} /> Team Distribution
                      </Typography>
                      <Stack spacing={2.5}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700}>Facilitators</Typography>
                            <Typography variant="caption" fontWeight={900}>45%</Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 6, bgcolor: '#f0f0f0', borderRadius: 3 }}>
                            <Box sx={{ width: '45%', height: '100%', bgcolor: 'primary.main', borderRadius: 3 }} />
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700}>Interviewers</Typography>
                            <Typography variant="caption" fontWeight={900}>35%</Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 6, bgcolor: '#f0f0f0', borderRadius: 3 }}>
                            <Box sx={{ width: '35%', height: '100%', bgcolor: 'secondary.main', borderRadius: 3 }} />
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700}>Mentors / Support</Typography>
                            <Typography variant="caption" fontWeight={900}>20%</Typography>
                          </Box>
                          <Box sx={{ width: '100%', height: 6, bgcolor: '#f0f0f0', borderRadius: 3 }}>
                            <Box sx={{ width: '20%', height: '100%', bgcolor: '#9c27b0', borderRadius: 3 }} />
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Active Operations Board */}
                  <Card sx={{ borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule sx={{ color: 'action.active' }} /> Active Operations Board
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, height: '100%' }}>
                            <Typography variant="h4" fontWeight={900} color="primary.main">12</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Live Sessions</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, height: '100%' }}>
                            <Typography variant="h4" fontWeight={900} color="warning.main">28</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Pending Evals</Typography>
                          </Box>
                        </Grid>
                       
                        <Grid item xs={6}>
                          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 3, height: '100%' }}>
                            <Typography variant="h4" fontWeight={900} color="text.primary">5</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Inactive Today</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Stack>

                {/* SECTION C & D */}
                <Stack spacing={3} sx={{ height: '100%' }}>
                  {/* Performance Snapshot */}
                  <Card sx={{ borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp sx={{ color: 'action.active' }} /> Performance Snapshot
                      </Typography>
                      <Stack spacing={2} divider={<Divider sx={{ opacity: 0.5 }} />} sx={{ height: '100%', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight={800}>Interview Completion</Typography>
                            <Typography variant="caption" color="text.secondary">Within 48hr SLA</Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={900} color="success.main">94%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight={800}>Attendance Marking</Typography>
                            <Typography variant="caption" color="text.secondary">Consistency rate</Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={900} color="primary.main">88%</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight={800}>Student Satisfaction</Typography>
                            <Typography variant="caption" color="text.secondary">Average rating</Typography>
                          </Box>
                          <Typography variant="subtitle1" fontWeight={900} color="text.primary">4.8/5</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Recent Admin Actions */}
                  <Card sx={{ borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History sx={{ color: 'action.active' }} /> Recent Admin Actions
                      </Typography>
                      <Stack spacing={2} sx={{ height: '100%', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box sx={{ mt: 0.5, p: 0.5, bgcolor: '#e3f2fd', color: '#1976d2', borderRadius: 1 }}>
                            <Lock sx={{ fontSize: 16 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>Permissions Updated</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">Granted Lead access to Sarah Jenkins.</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>2 hours ago</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box sx={{ mt: 0.5, p: 0.5, bgcolor: '#fbe9e7', color: '#d32f2f', borderRadius: 1 }}>
                            <Assignment sx={{ fontSize: 16 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>Batch Reassigned</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">Batch B-02 transferred to Michael Chen.</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>5 hours ago</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Box>
            </Box>
          </Stack>

          {/* Message Dropdown Menu */}
          <Menu
            anchorEl={msgAnchorEl}
            open={Boolean(msgAnchorEl)}
            onClose={handleMsgClose}
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
              toast.info(`Opening In-App Chat with ${selectedStaff?.name}`);
              handleMsgClose();
            }}>
              <Chat fontSize="small" sx={{ color: 'primary.main' }} />
              In-App Chat
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedStaff?.email) {
                window.location.href = `mailto:${selectedStaff.email}`;
              }
              handleMsgClose();
            }}>
              <Email fontSize="small" sx={{ color: '#1976d2' }} />
              Send Email
            </MenuItem>
            <MenuItem onClick={() => {
              toast.info(`Sending Quick Ping to ${selectedStaff?.name}`);
              handleMsgClose();
            }}>
              <Send fontSize="small" sx={{ color: '#2e7d32' }} />
              Quick Slack Ping
            </MenuItem>
          </Menu>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default StaffManagement;
