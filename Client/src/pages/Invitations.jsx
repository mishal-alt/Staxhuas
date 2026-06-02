import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Menu,
  Divider
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import * as invitationApi from '../api/invitations.api';
import * as batchApi from '../api/batches.api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Refresh,
  Cancel,
  Mail,
  PersonAdd,
  CheckCircle,
  Schedule,
  History,
  NavigateNext,
  ContentCopy,
  Block,
  MoreVert,
  Search,
  Clear,
  School,
  DoneAll,
  Warning,
  KeyboardArrowDown
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';

// Custom theme to match Staxhaus brand
const theme = createTheme({
  palette: {
    primary: {
      main: '#E8391D', // Brand Orange
    },
    secondary: {
      main: '#1E2126', // Brand Charcoal
    },
    background: {
      default: '#F7F7F5',
    }
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' },
    h6: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' },
  },
  shape: {
    borderRadius: 6,
  },
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
        }
      }
    }
  }
});

const Invitations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Slightly higher density
  const [open, setOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', batch: '' });

  // Action Menu Anchor & Context
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuInvite, setMenuInvite] = useState(null);

  // Operational Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: invitationsRes, isLoading: invitationsLoading } = useQuery({
    queryKey: ['invitations'],
    queryFn: () => invitationApi.getInvitations('all'), // Requests all invitations
  });

  const { data: batchesRes } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
  });

  const inviteMutation = useMutation({
    mutationFn: (data) => invitationApi.inviteStudent(data),
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      setOpen(false);
      setInviteForm({ name: '', email: '', batch: '' });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    }
  });

  const revokeMutation = useMutation({
    mutationFn: (id) => invitationApi.revokeInvitation(id),
    onSuccess: () => {
      toast.success('Invitation revoked successfully');
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to revoke invitation');
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.batch) {
      toast.error('Please fill in all required fields');
      return;
    }
    inviteMutation.mutate({
      email: inviteForm.email,
      name: inviteForm.name,
      batch: inviteForm.batch,
      role: 'student'
    });
  };

  const batches = batchesRes?.data || [];
  const invitations = invitationsRes?.data || [];

  // Helper: Compute invite status client side
  const getDisplayStatus = (invite) => {
    if (invite.status === 'accepted') return 'accepted';
    if (invite.status === 'revoked') return 'revoked';
    
    // Check if expired
    const isExpired = new Date(invite.expiresAt) < new Date();
    if (isExpired) return 'expired';
    
    return 'pending';
  };

  // Helper: Convert status to color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ed6c02'; // Orange
      case 'accepted': return '#2e7d32'; // Green
      case 'expired': return '#d32f2f'; // Red
      case 'revoked': return '#757575'; // Grey
      default: return '#666';
    }
  };

  // Helper: format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  // Handler: Copy Secure Invite Link to Clipboard
  const handleCopyLink = (token) => {
    const link = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied to clipboard!');
  };

  // Handler: Resend invite (revoke and recreate if necessary)
  const handleResend = async (invite) => {
    const displayStatus = getDisplayStatus(invite);
    try {
      if (displayStatus === 'pending' || displayStatus === 'expired') {
        await invitationApi.revokeInvitation(invite._id);
      }
      inviteMutation.mutate({
        name: invite.name,
        email: invite.email,
        batch: invite.batch?._id || invite.batch,
        role: invite.role || 'student'
      });
      handleMenuClose();
    } catch (err) {
      toast.error('Failed to resend invitation: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handler: Quick re-invite (pre-fills the dialog)
  const handleQuickReinvite = (invite) => {
    setInviteForm({
      name: invite.name,
      email: invite.email,
      batch: invite.batch?._id || invite.batch || ''
    });
    setOpen(true);
    handleMenuClose();
  };

  // Action Menu Handlers
  const handleMenuOpen = (event, invite) => {
    setAnchorEl(event.currentTarget);
    setMenuInvite(invite);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuInvite(null);
  };

  // Filter & Sort Logic
  const filteredInvites = invitations.filter((invite) => {
    const displayStatus = getDisplayStatus(invite);

    // 1. Search filter (Name / Email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = (invite.name || '').toLowerCase().includes(query);
      const emailMatch = (invite.email || '').toLowerCase().includes(query);
      if (!nameMatch && !emailMatch) return false;
    }

    // 2. Batch filter
    if (selectedBatch !== 'all') {
      const inviteBatchId = invite.batch?._id || invite.batch;
      if (inviteBatchId !== selectedBatch) return false;
    }

    // 3. Status filter
    if (selectedStatus !== 'all') {
      if (displayStatus !== selectedStatus) return false;
    }

    // 4. Date Sent filter
    if (dateFilter !== 'all') {
      const createdAt = new Date(invite.createdAt);
      const now = new Date();
      if (dateFilter === 'today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (createdAt < today) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (createdAt < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (createdAt < monthAgo) return false;
      }
    }

    return true;
  });

  const sortedInvites = [...filteredInvites].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const paginatedInvites = sortedInvites.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedInvites.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ pb: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Header */}
          <Box sx={{
            pt: 3,
            pb: 2,
            px: 6,
            mx: -6,
            mt: -4.5,
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
                  ONBOARDING
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
                  <Mail fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Student Onboarding
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Issue new invitations and track your student setup progress
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleOpen}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}
            >
              New Invite
            </Button>
          </Box>

          {/* New Invite Dialog */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' } }}>
            <DialogTitle sx={{ 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              pt: 4, 
              px: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 1.5, display: 'flex' }}>
                <PersonAdd fontSize="small" />
              </Box>
              Send New Invitation
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent sx={{ px: 4, pb: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                  Enter student details below to send a secure invitation link to their email.
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Recipient Full Name"
                    placeholder="e.g. John Doe"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Email Address"
                    type="email"
                    placeholder="student@staxhaus.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                  <TextField
                    select
                    fullWidth
                    required
                    label="Assign to Batch"
                    value={inviteForm.batch}
                    onChange={(e) => setInviteForm({ ...inviteForm, batch: e.target.value })}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  >
                    {batches.map((batch) => (
                      <MenuItem key={batch._id} value={batch._id}>
                        {batch.name}
                      </MenuItem>
                    ))}
                    {batches.length === 0 && (
                      <MenuItem disabled>No active batches found</MenuItem>
                    )}
                  </TextField>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3, px: 4, borderTop: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
                <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={inviteMutation.isPending}
                  startIcon={inviteMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  sx={{ px: 4 }}
                >
                  {inviteMutation.isPending ? 'Processing...' : 'Send Invite'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* KPI Grid */}
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'Total Sent', value: invitations.length, icon: <Mail />, color: '#1E2126' },
              { label: 'Pending Invites', value: invitations.filter(i => getDisplayStatus(i) === 'pending').length, icon: <Schedule />, color: '#E8391D' },
              { label: 'Accepted', value: invitations.filter(i => getDisplayStatus(i) === 'accepted').length, icon: <CheckCircle />, color: '#2e7d32' },
              { label: 'Expired', value: invitations.filter(i => getDisplayStatus(i) === 'expired').length, icon: <History />, color: '#9e9e9e' },
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
                      {stat.value.toString().padStart(2, '0')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Onboarding Pipeline / Funnel Tracker */}
          <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.06)',
            p: 2.5,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mx: 0.5
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                Onboarding Pipeline & Conversion
              </Typography>
              <Chip
                label={`Acceptance Rate: ${invitations.length > 0 ? Math.round((invitations.filter(i => getDisplayStatus(i) === 'accepted').length / invitations.length) * 100) : 0}%`}
                size="small"
                sx={{
                  fontWeight: 900,
                  bgcolor: 'secondary.main',
                  color: 'white',
                  borderRadius: 1.5,
                  fontSize: '0.65rem',
                  height: 20
                }}
              />
            </Box>
            
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              {/* Step 1: Invited */}
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(30, 33, 38, 0.05)',
                    color: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem'
                  }}>
                    1
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.6rem', letterSpacing: '0.05em' }}>INVITED</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.8rem' }}>
                      {invitations.length} Total Sent
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Connector line 1 */}
              <Grid item xs={12} sm={0.5} sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
                <Typography color="text.secondary" sx={{ opacity: 0.3, fontWeight: 900, fontSize: '0.8rem' }}>➔</Typography>
              </Grid>

              {/* Step 2: Pending Setup */}
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(232, 57, 29, 0.05)',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem'
                  }}>
                    2
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.6rem', letterSpacing: '0.05em' }}>PENDING SETUP</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.8rem' }}>
                      {invitations.filter(i => getDisplayStatus(i) === 'pending').length} Awaiting Action
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Connector line 2 */}
              <Grid item xs={12} sm={0.5} sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
                <Typography color="text.secondary" sx={{ opacity: 0.3, fontWeight: 900, fontSize: '0.8rem' }}>➔</Typography>
              </Grid>

              {/* Step 3: Enrolled */}
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'rgba(46, 125, 50, 0.05)',
                    color: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem'
                  }}>
                    3
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.6rem', letterSpacing: '0.05em' }}>ONBOARDED</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '0.8rem' }}>
                      {invitations.filter(i => getDisplayStatus(i) === 'accepted').length} Joined Batches
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Warnings details */}
              <Grid item xs={12} sm={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: { xs: 'flex-start', sm: 'flex-end' }, pl: { xs: 0, sm: 2 }, borderLeft: { xs: 'none', sm: '1px solid rgba(0,0,0,0.08)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#d32f2f' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem' }}>
                      {invitations.filter(i => getDisplayStatus(i) === 'expired').length} Expired
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'text.disabled' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem' }}>
                      {invitations.filter(i => getDisplayStatus(i) === 'revoked').length} Revoked
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Main Table Operations Section */}
          <Card sx={{ overflow: 'visible', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
            
            {/* Operational Filter Toolbar */}
            <Box sx={{
              p: 2.5,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: 'background.paper',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px'
            }}>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ flexGrow: 1, alignItems: 'center' }}>
                  {/* Search input */}
                  <TextField
                    size="small"
                    placeholder="Search email or recipient name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    InputProps={{
                      startAdornment: <Search fontSize="small" sx={{ color: 'text.secondary', mr: 1, opacity: 0.6 }} />,
                      sx: { borderRadius: '6px', fontSize: '0.8rem', width: { xs: '100%', sm: 260 }, bgcolor: '#f9f9f9', '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' } }
                    }}
                  />

                  {/* Batch Select */}
                  <TextField
                    select
                    size="small"
                    value={selectedBatch}
                    onChange={(e) => {
                      setSelectedBatch(e.target.value);
                      setPage(1);
                    }}
                    InputProps={{ sx: { borderRadius: '6px', fontSize: '0.8rem', minWidth: 150, bgcolor: '#f9f9f9', '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' } } }}
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="all">All Batches</MenuItem>
                    {batches.map((batch) => (
                      <MenuItem key={batch._id} value={batch._id}>
                        {batch.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Status Select */}
                  <TextField
                    select
                    size="small"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setPage(1);
                    }}
                    InputProps={{ sx: { borderRadius: '6px', fontSize: '0.8rem', minWidth: 140, bgcolor: '#f9f9f9', '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' } } }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                    <MenuItem value="revoked">Revoked</MenuItem>
                  </TextField>

                  {/* Date Filter Select */}
                  <TextField
                    select
                    size="small"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setPage(1);
                    }}
                    InputProps={{ sx: { borderRadius: '6px', fontSize: '0.8rem', minWidth: 140, bgcolor: '#f9f9f9', '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' } } }}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Sent Today</MenuItem>
                    <MenuItem value="week">Sent This Week</MenuItem>
                    <MenuItem value="month">Sent This Month</MenuItem>
                  </TextField>

                  {/* Sort Filter Select */}
                  <TextField
                    select
                    size="small"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    InputProps={{ sx: { borderRadius: '6px', fontSize: '0.8rem', minWidth: 130, bgcolor: '#f9f9f9', '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' } } }}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                  </TextField>
                </Stack>

                {/* Reset filters action */}
                {(searchQuery || selectedBatch !== 'all' || selectedStatus !== 'all' || dateFilter !== 'all' || sortBy !== 'newest') && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBatch('all');
                      setSelectedStatus('all');
                      setDateFilter('all');
                      setSortBy('newest');
                      setPage(1);
                    }}
                    startIcon={<Clear fontSize="small" />}
                    sx={{ fontSize: '0.75rem', fontWeight: 800, borderRadius: '8px', py: 0.6 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>

              {/* Filter Chips */}
              {(searchQuery || selectedBatch !== 'all' || selectedStatus !== 'all' || dateFilter !== 'all') && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                  {searchQuery && (
                    <Chip
                      label={`Search: "${searchQuery}"`}
                      size="small"
                      onDelete={() => setSearchQuery('')}
                      sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  )}
                  {selectedBatch !== 'all' && (
                    <Chip
                      label={`Batch: ${batches.find(b => b._id === selectedBatch)?.name || 'Selected'}`}
                      size="small"
                      onDelete={() => setSelectedBatch('all')}
                      sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  )}
                  {selectedStatus !== 'all' && (
                    <Chip
                      label={`Status: ${selectedStatus.toUpperCase()}`}
                      size="small"
                      onDelete={() => setSelectedStatus('all')}
                      sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  )}
                  {dateFilter !== 'all' && (
                    <Chip
                      label={`Date: ${dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month'}`}
                      size="small"
                      onDelete={() => setDateFilter('all')}
                      sx={{ borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}
                    />
                  )}
                </Stack>
              )}
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table sx={{ minWidth: 650 }} size="small">
                <TableHead sx={{ bgcolor: '#f9f9f9', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', py: 1.8, fontSize: '0.7rem', pl: 3 }}>Recipient Identity</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>Target Batch</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>Sent Timeline</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>Expiry & Progress</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem', pr: 3 }}>Operations</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invitationsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={30} sx={{ mb: 2 }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Loading invitations grid...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedInvites.map((invite) => {
                    const displayStatus = getDisplayStatus(invite);
                    const isPendingActive = displayStatus === 'pending';
                    const isExpired = displayStatus === 'expired';
                    
                    // Match batch object
                    const matchedBatch = batches.find(b => b._id === invite.batch);
                    const batchName = matchedBatch ? matchedBatch.name : (invite.batch?.name || 'Unassigned');

                    // Compute days until expiry or days ago expired
                    const now = new Date();
                    const expiryDate = new Date(invite.expiresAt);
                    const daysLeft = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));
                    
                    // Workflow Flag: Resend recommended if pending active and older than 5 days
                    const isOldPending = isPendingActive && (now - new Date(invite.createdAt) > 5 * 24 * 60 * 60 * 1000);

                    return (
                      <TableRow 
                        key={invite._id} 
                        sx={{ 
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' }, 
                          transition: 'background-color 0.2s ease',
                          borderBottom: '1px solid rgba(0,0,0,0.04)' 
                        }}
                      >
                        {/* Recipient Cell */}
                        <TableCell sx={{ py: 1.5, pl: 3 }}>
                          <Stack direction="row" spacing={1.8} alignItems="center">
                            <Box sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: 'secondary.main', 
                              color: 'white', 
                              borderRadius: '8px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontWeight: 900,
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}>
                              {invite.name ? invite.name[0] : invite.email[0].toUpperCase()}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'secondary.main', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {invite.name || 'Invited Student'}
                                </Typography>
                                {invite.role && invite.role !== 'student' && (
                                  <Chip
                                    label={invite.role.toUpperCase()}
                                    size="small"
                                    sx={{ height: 16, fontSize: '0.55rem', fontWeight: 900, bgcolor: 'rgba(30,33,38,0.08)', color: 'secondary.main', borderRadius: '4px' }}
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {invite.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* Batch Cell */}
                        <TableCell>
                          <Stack direction="row" spacing={0.8} alignItems="center">
                            <School fontSize="small" sx={{ opacity: 0.5, fontSize: '1rem', color: 'secondary.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main', fontSize: '0.8rem' }}>
                              {batchName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Sent Timeline Cell */}
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main', fontSize: '0.8rem' }}>
                              {new Date(invite.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>
                              {getRelativeTime(invite.createdAt)}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Expiry & Progress Cell */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {displayStatus === 'accepted' ? (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <DoneAll sx={{ color: 'success.main', fontSize: '0.95rem' }} />
                                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.75rem' }}>
                                  Setup Completed
                                </Typography>
                              </Stack>
                            ) : displayStatus === 'revoked' ? (
                              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, fontSize: '0.75rem' }}>
                                Access Revoked
                              </Typography>
                            ) : isExpired ? (
                              <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.75rem' }}>
                                Expired {getRelativeTime(invite.expiresAt)}
                              </Typography>
                            ) : (
                              <Box>
                                <Typography variant="caption" sx={{ color: daysLeft <= 2 ? 'warning.main' : 'text.secondary', fontWeight: 700, fontSize: '0.75rem' }}>
                                  {daysLeft} days remaining
                                </Typography>
                                {isOldPending && (
                                  <Tooltip title="Awaiting registration details for over 5 days. Resend recommended.">
                                    <Warning sx={{ color: 'warning.main', fontSize: '0.9rem', ml: 0.5, verticalAlign: 'middle' }} />
                                  </Tooltip>
                                )}
                              </Box>
                            )}
                          </Box>
                        </TableCell>

                        {/* Status Cell */}
                        <TableCell align="center">
                          <Chip
                            label={displayStatus.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 900,
                              fontSize: '0.62rem',
                              height: 18,
                              bgcolor: `${getStatusColor(displayStatus)}12`,
                              color: getStatusColor(displayStatus),
                              border: `1px solid ${getStatusColor(displayStatus)}30`,
                              borderRadius: '6px',
                              letterSpacing: '0.02em'
                            }}
                          />
                        </TableCell>

                        {/* Operations Cell */}
                        <TableCell align="right" sx={{ pr: 3 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                            {isPendingActive ? (
                              <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => handleCopyLink(invite.token)}
                                startIcon={<ContentCopy sx={{ fontSize: '0.8rem' }} />}
                                sx={{ 
                                  height: 28, 
                                  fontSize: '0.7rem', 
                                  fontWeight: 800, 
                                  borderRadius: '8px', 
                                  px: 1.5, 
                                  py: 0,
                                  textTransform: 'none',
                                  borderColor: 'rgba(0,0,0,0.12)',
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.2)' }
                                }}
                              >
                                Copy Link
                              </Button>
                            ) : (isExpired || displayStatus === 'revoked') ? (
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => handleResend(invite)}
                                disabled={inviteMutation.isPending}
                                startIcon={<Refresh sx={{ fontSize: '0.8rem' }} />}
                                sx={{ 
                                  height: 28, 
                                  fontSize: '0.7rem', 
                                  fontWeight: 800, 
                                  borderRadius: '8px', 
                                  px: 1.5, 
                                  py: 0,
                                  textTransform: 'none'
                                }}
                              >
                                Resend
                              </Button>
                            ) : (
                              <Button
                                size="small"
                                variant="text"
                                color="inherit"
                                onClick={() => navigate(`/student-management?search=${invite.email}`)}
                                sx={{ 
                                  height: 28, 
                                  fontSize: '0.7rem', 
                                  fontWeight: 800, 
                                  borderRadius: '8px', 
                                  px: 1.5, 
                                  textTransform: 'none',
                                  opacity: 0.8
                                }}
                              >
                                View Profile
                              </Button>
                            )}

                            {/* Actions Dropdown */}
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleMenuOpen(e, invite)}
                              sx={{ 
                                borderRadius: '8px', 
                                border: '1px solid rgba(0,0,0,0.05)', 
                                p: 0.5,
                                bgcolor: anchorEl && menuInvite?._id === invite._id ? 'rgba(0,0,0,0.04)' : 'transparent'
                              }}
                            >
                              <MoreVert sx={{ fontSize: '1rem', color: 'secondary.main' }} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!invitationsLoading && sortedInvites.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, maxWidth: 420, mx: 'auto' }}>
                          <Box sx={{
                            width: 54,
                            height: 54,
                            borderRadius: '50%',
                            bgcolor: 'rgba(232, 57, 29, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.main',
                            mb: 1
                          }}>
                            <Mail sx={{ fontSize: 26 }} />
                          </Box>
                          <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
                            No active invitations found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500, px: 2, fontSize: '0.8rem' }}>
                            We couldn't find any invitations matching the current search parameters or filter configurations. Reset filters to view all records.
                          </Typography>
                          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="inherit"
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedBatch('all');
                                setSelectedStatus('all');
                                setDateFilter('all');
                                setSortBy('newest');
                                setPage(1);
                              }}
                              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 800, height: 32, fontSize: '0.75rem', px: 2 }}
                            >
                              Reset Filters
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={handleOpen}
                              sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 800, height: 32, fontSize: '0.75rem', px: 2 }}
                            >
                              New Invitation
                            </Button>
                          </Stack>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination block */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, bgcolor: 'background.paper', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="small"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 900,
                      borderRadius: '8px',
                      '&.Mui-selected': {
                        boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)',
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Card>

          {/* Operations Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: '6px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                minWidth: 190,
                mt: 0.5,
                '& .MuiMenuItem-root': {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  py: 1,
                  px: 2,
                  gap: 1.5,
                  color: 'secondary.main',
                  '& svg': {
                    fontSize: '1rem',
                    opacity: 0.7
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', fontSize: '0.62rem', letterSpacing: '0.05em' }}>
                INVITATION CONTROL
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            
            {/* Copy Secure Link */}
            <MenuItem onClick={() => {
              handleCopyLink(menuInvite?.token);
              handleMenuClose();
            }}>
              <ContentCopy />
              Copy Secure Link
            </MenuItem>

            {/* Quick Re-invite (Pre-fill Form) */}
            <MenuItem onClick={() => handleQuickReinvite(menuInvite)}>
              <PersonAdd />
              Quick Re-invite
            </MenuItem>

            {/* Trigger Resend Email */}
            {menuInvite && getDisplayStatus(menuInvite) !== 'accepted' && (
              <MenuItem onClick={() => handleResend(menuInvite)}>
                <Refresh />
                Resend Email Invite
              </MenuItem>
            )}

            {/* Revoke Option */}
            {menuInvite && getDisplayStatus(menuInvite) === 'pending' && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem 
                  onClick={() => handleRevoke(menuInvite._id)}
                  disabled={revokeMutation.isPending}
                  sx={{ color: '#d32f2f !important' }}
                >
                  <Block sx={{ color: '#d32f2f' }} />
                  Revoke Access
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Invitations;
