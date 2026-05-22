import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
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
  IconButton,
  LinearProgress,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Mail,
  Phone,
  LocationOn,
  School,
  People,
  EmojiEvents,
  Code,
  Assessment,
  Work,
  Description,
  Terminal,
  BarChart,
  VerifiedUser,
  NavigateNext,
  PhotoCamera,
  Edit,
  Save,
  Close,
  ContentCopy,
  CalendarMonth,
  Badge,
  CheckCircle,
  Warning,
  Schedule,
  Layers,
  Timelapse,
  TrendingUp,
  Groups,
  HowToReg,
  FlashOn,
  CheckBox
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import AppShell from '../components/layout/AppShell';
import * as userApi from '../api/users.api';

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
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)',
        }
      }
    }
  }
});

const MotionCard = motion(Card);

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.38, ease: [0.4, 0, 0.2, 1] }
  })
};

const PERFORMANCE_METRICS = [
  { label: 'Batches Managed', value: '08', icon: <Layers sx={{ fontSize: 18 }} />, color: '#E8391D', bg: 'rgba(232,57,29,0.08)' },
  { label: 'Mentored', value: '124', icon: <Groups sx={{ fontSize: 18 }} />, color: '#1565c0', bg: 'rgba(21,101,192,0.08)' },
  { label: 'Avg Attendance', value: '93.8%', icon: <TrendingUp sx={{ fontSize: 18 }} />, color: '#2e7d32', bg: 'rgba(46,125,50,0.08)' },
  { label: 'Scrum Completion', value: '89.4%', icon: <FlashOn sx={{ fontSize: 18 }} />, color: '#6a1b9a', bg: 'rgba(106,27,154,0.08)' },
  { label: 'Pass Rate', value: '82.1%', icon: <HowToReg sx={{ fontSize: 18 }} />, color: '#ed6c02', bg: 'rgba(237,108,2,0.08)' },
  { label: 'Leave Done', value: '42', icon: <CheckBox sx={{ fontSize: 18 }} />, color: '#00838f', bg: 'rgba(0,131,143,0.08)' },
];

const RECENT_ACTIVITY = [
  { actor: 'You', action: 'approved leave request for Ahmed Khan.', time: '2h ago', dot: 'bg-emerald-500' },
  { actor: 'You', action: 'scheduled React evaluation for B-1.', time: '5h ago', dot: 'bg-blue-500' },
  { actor: 'You', action: 'completed scrum sync review.', time: 'Yesterday', dot: 'bg-brand-orange' },
  { actor: 'You', action: 'marked B-2 attendance for the week.', time: '2 days ago', dot: 'bg-violet-500' },
];

const TODAY_TASKS = [
  { text: '2 technical interviews scheduled today', done: false, icon: <Schedule sx={{ fontSize: 14 }} /> },
  { text: '3 leave requests awaiting your review', done: false, icon: <Timelapse sx={{ fontSize: 14 }} /> },
  { text: 'Attendance pending for B-2 cohort', done: false, icon: <Groups sx={{ fontSize: 14 }} /> },
  { text: 'Scrum incomplete in B-1 this morning', done: true, icon: <FlashOn sx={{ fontSize: 14 }} /> },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    phone: user?.phone || '',
    location: user?.location || '',
    email: user?.email || ''
  });

  const isInterviewer = user?.role === 'interviewer';
  const isFacilitator = user?.role === 'facilitator';
  const isStaff = isInterviewer || isFacilitator;

  const handleEditOpen = () => {
    setFormData({
      name: user?.name || '',
      headline: user?.headline || '',
      phone: user?.phone || '',
      location: user?.location || '',
      email: user?.email || ''
    });
    setIsEditing(true);
  };

  const handleEditClose = () => setIsEditing(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await userApi.updateMe(formData);
      setUser(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profilePic', file);

    setIsUploading(true);
    try {
      const res = await userApi.uploadProfilePic(uploadData);
      setUser(res.data);
    } catch (error) {
      console.error('Error uploading profile pic:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const serverBase = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  const getProfilePicUrl = () => {
    if (!user?.profilePic) return null;
    if (user.profilePic.startsWith('http')) return user.profilePic;
    return `${serverBase}${user.profilePic}?t=${new Date().getTime()}`;
  };

  const profilePicUrl = getProfilePicUrl();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2024';

  const staffId = user?._id ? `STX-${user._id.slice(-6).toUpperCase()}` : 'STX-XXXXXX';

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        <Box sx={{ width: '100%', py: 2.5, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

          {/* ─────────────── PAGE HEADER ─────────────── */}
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
              separator=">"
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
                MY PROFILE
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
                <VerifiedUser />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  MY IDENTITY
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Manage your personal information and professional credentials.
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* ─────────────── END PAGE HEADER ─────────────── */}

          {/* ═══════════════════════════════════════════════
              1. COMPACT HERO IDENTITY BANNER
          ═══════════════════════════════════════════════ */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0}>
            <Card sx={{
              background: 'linear-gradient(135deg, #1E2126 0%, #2a2f37 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative accent */}
              <Box sx={{
                position: 'absolute', top: 0, right: 0, width: 220, height: 220,
                background: 'radial-gradient(circle, rgba(232,57,29,0.18) 0%, transparent 70%)',
                borderRadius: '50%', transform: 'translate(40%, -40%)'
              }} />
              <Box sx={{
                position: 'absolute', bottom: 0, left: 0, width: 150, height: 150,
                background: 'radial-gradient(circle, rgba(232,57,29,0.08) 0%, transparent 70%)',
                borderRadius: '50%', transform: 'translate(-30%, 30%)'
              }} />

              <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>

                  {/* Left: Avatar + Identity */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    {/* Profile Image */}
                    <Box sx={{
                      position: 'relative',
                      '&:hover .upload-btn': { opacity: 1 }
                    }}>
                      <Avatar
                        src={profilePicUrl}
                        alt={user?.name}
                        sx={{
                          width: 84,
                          height: 84,
                          bgcolor: '#E8391D',
                          fontSize: '2rem',
                          fontWeight: 900,
                          fontFamily: 'Outfit',
                          border: '3px solid rgba(255,255,255,0.15)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                        }}
                      >
                        {user?.name?.[0]}
                      </Avatar>

                      {/* Verified badge */}
                      <Box sx={{
                        position: 'absolute', bottom: -2, right: -2,
                        width: 24, height: 24, borderRadius: '50%',
                        bgcolor: '#2e7d32', border: '2px solid #1E2126',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <CheckCircle sx={{ fontSize: 14, color: 'white' }} />
                      </Box>

                      {/* Upload hover overlay */}
                      <Tooltip title="Change Photo">
                        <Box
                          className="upload-btn"
                          onClick={() => fileInputRef.current.click()}
                          sx={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            bgcolor: 'rgba(0,0,0,0.55)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', opacity: 0,
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          {isUploading
                            ? <CircularProgress size={20} sx={{ color: 'white' }} />
                            : <PhotoCamera sx={{ color: 'white', fontSize: 20 }} />
                          }
                        </Box>
                      </Tooltip>

                      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    </Box>

                    {/* Name & Role */}
                    <Box>
                      <Typography sx={{
                        fontFamily: 'Outfit', fontWeight: 900,
                        fontSize: { xs: '1.3rem', md: '1.6rem' },
                        color: 'white', lineHeight: 1.15, mb: 0.4
                      }}>
                        {user?.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600, mb: 1.5 }}>
                        {user?.headline || (isFacilitator ? 'Lead Academic Facilitator' : isInterviewer ? 'Official Technical Evaluator' : 'Elite Student')}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: '6px' }}>
                        <Chip
                          label={user?.role?.toUpperCase() || 'FACILITATOR'}
                          size="small"
                          sx={{ bgcolor: '#E8391D', color: 'white', fontWeight: 900, fontSize: '0.65rem', borderRadius: 1.5 }}
                        />
                        <Chip
                          label="● ACTIVE"
                          size="small"
                          sx={{ bgcolor: 'rgba(46,125,50,0.25)', color: '#81c784', fontWeight: 900, fontSize: '0.65rem', border: '1px solid rgba(46,125,50,0.4)', borderRadius: 1.5 }}
                        />
                        <Chip
                          label="STAXHAUS INSTITUTE"
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: '0.6rem', borderRadius: 1.5 }}
                        />
                      </Stack>
                    </Box>
                  </Box>

                  {/* Right: Meta info + Edit button */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit sx={{ fontSize: '14px !important' }} />}
                      onClick={handleEditOpen}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        textTransform: 'uppercase',
                        '&:hover': { borderColor: '#E8391D', bgcolor: 'rgba(232,57,29,0.1)' }
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Stack spacing={0.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                      <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.08em' }}>
                        STAFF ID
                      </Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                        {staffId}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.08em', mt: 0.5 }}>
                        JOINED {joinedDate.toUpperCase()}
                      </Typography>
                    </Stack>
                  </Box>

                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* ═══════════════════════════════════════════════
              2. OPERATIONAL METRICS GRID (facilitator only)
          ═══════════════════════════════════════════════ */}
          {isFacilitator && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={1}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#929292', letterSpacing: '0.12em', mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart sx={{ fontSize: 14, color: '#E8391D' }} />
                  Operational Performance
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(3,1fr)', lg: 'repeat(6,1fr)' },
                  gap: 1.5
                }}>
                  {PERFORMANCE_METRICS.map((m, i) => (
                    <motion.div key={m.label} variants={fadeIn} initial="hidden" animate="visible" custom={i * 0.5 + 2}>
                      <Card sx={{
                        p: 2, textAlign: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }
                      }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: 2,
                          bgcolor: m.bg, color: m.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 1
                        }}>
                          {m.icon}
                        </Box>
                        <Typography sx={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.4rem', color: '#1E2126', lineHeight: 1 }}>
                          {m.value}
                        </Typography>
                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#929292', mt: 0.5, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.3 }}>
                          {m.label}
                        </Typography>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              3. MAIN TWO-COLUMN LAYOUT
          ═══════════════════════════════════════════════ */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1.4fr' },
            gap: 3,
            alignItems: 'stretch',
            width: '100%'
          }}>

            {/* ── LEFT COLUMN ── */}
            <Stack spacing={3} sx={{ height: '100%' }}>

                {/* Identity & Contact */}
                <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={3} style={{ display: 'flex', flex: 1, height: '100%' }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge sx={{ fontSize: 13, color: '#E8391D' }} />
                        Identity & Contact
                      </Typography>
                      <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                        {/* Email with copy */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box sx={{ mt: 0.2, color: '#929292' }}><Mail sx={{ fontSize: 15 }} /></Box>
                            <Box>
                              <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#929292', letterSpacing: '0.08em', textTransform: 'uppercase' }}>EMAIL ADDRESS</Typography>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2 }}>{user?.email}</Typography>
                            </Box>
                          </Box>
                          <Tooltip title={emailCopied ? 'Copied!' : 'Copy email'}>
                            <IconButton size="small" onClick={handleCopyEmail} sx={{ color: emailCopied ? '#2e7d32' : '#929292', mt: -0.5 }}>
                              <ContentCopy sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Divider />

                        {/* Phone */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ mt: 0.2, color: '#929292' }}><Phone sx={{ fontSize: 15 }} /></Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#929292', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PHONE NUMBER</Typography>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2 }}>{user?.phone || 'Not provided'}</Typography>
                          </Box>
                        </Box>

                        <Divider />

                        {/* Location */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ mt: 0.2, color: '#929292' }}><LocationOn sx={{ fontSize: 15 }} /></Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#929292', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LOCATION</Typography>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2 }}>{user?.location || 'Not provided'}</Typography>
                          </Box>
                        </Box>

                        <Divider />

                        {/* Department */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ mt: 0.2, color: '#929292' }}><Work sx={{ fontSize: 15 }} /></Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#929292', letterSpacing: '0.08em', textTransform: 'uppercase' }}>DEPARTMENT</Typography>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2 }}>Full Stack Development</Typography>
                          </Box>
                        </Box>

                        <Divider />

                        {/* Joined */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ mt: 0.2, color: '#929292' }}><CalendarMonth sx={{ fontSize: 15 }} /></Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#929292', letterSpacing: '0.08em', textTransform: 'uppercase' }}>JOINED DATE</Typography>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2 }}>{joinedDate}</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

            </Stack>

            {/* ── RIGHT COLUMN ── */}
            <Stack spacing={3}>

                {/* Active Assignments (facilitator only) */}
                {isFacilitator && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={4}>
                    <Card>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 2.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School sx={{ fontSize: 13, color: '#E8391D' }} />
                          Active Batch Assignments
                        </Typography>
                        <Grid container spacing={2.5}>
                          {[
                            { name: 'MERN-B1', students: 12, progress: 'Week 12', fill: 92, color: '#E8391D' },
                            { name: 'FS-JAVA-02', students: 8, progress: 'Week 08', fill: 65, color: '#1565c0' },
                          ].map((batch, i) => (
                            <Grid item xs={12} sm={6} key={batch.name}>
                              <Box sx={{
                                p: 2.5, borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': { borderColor: '#E8391D', bgcolor: 'rgba(232,57,29,0.01)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }
                              }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box>
                                    <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#1E2126', fontFamily: 'Outfit', letterSpacing: '-0.01em' }}>{batch.name}</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                      <Typography sx={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 600 }}>
                                        {batch.students} students
                                      </Typography>
                                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#D1D5DB' }} />
                                      <Typography sx={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 600 }}>
                                        {batch.progress}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                  <Chip
                                    label="ACTIVE"
                                    size="small"
                                    sx={{ 
                                      bgcolor: `${batch.color}15`, 
                                      color: batch.color, 
                                      fontWeight: 900, 
                                      fontSize: '0.62rem', 
                                      borderRadius: 1.5,
                                      border: `1px solid ${batch.color}30`
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={batch.fill}
                                    sx={{
                                      height: 6, borderRadius: 3, bgcolor: '#E5E7EB',
                                      '& .MuiLinearProgress-bar': { bgcolor: batch.color, borderRadius: 3 }
                                    }}
                                  />
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                    <Typography sx={{ fontSize: '0.62rem', color: '#6B7280', fontWeight: 750, letterSpacing: '0.04em' }}>
                                      COURSE COVERAGE
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.72rem', color: batch.color, fontWeight: 900 }}>
                                      {batch.fill}%
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Recent Operational Activity */}
                <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={5}>
                  <Card>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assessment sx={{ fontSize: 13, color: '#E8391D' }} />
                        Recent Operational Activity
                      </Typography>
                      <Box sx={{ pl: 2, borderLeft: '2px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 3.5, my: 1 }}>
                        {RECENT_ACTIVITY.map((item, i) => (
                          <Box key={i} sx={{ position: 'relative', pl: 1 }}>
                            {/* dot */}
                            <Box sx={{
                              position: 'absolute', left: -24, top: 4,
                              width: 10, height: 10, borderRadius: '50%',
                              bgcolor: i === 0 ? '#10B981' : i === 1 ? '#3B82F6' : i === 2 ? '#EF4444' : '#8B5CF6',
                              border: '2px solid white',
                              boxShadow: '0 0 0 2px #E5E7EB'
                            }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', lineHeight: 1.4 }}>
                                {item.actor}{' '}
                                <span style={{ fontWeight: 500, color: '#4B5563' }}>{item.action}</span>
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600 }}>
                                {item.time}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Student-only sections */}
                {!isStaff && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={5}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent sx={{ p: 2.5 }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Code sx={{ fontSize: 13, color: '#E8391D' }} />
                              Github Pulse
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                              {Array.from({ length: 50 }).map((_, i) => (
                                <Box key={i} sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: i % 7 === 0 ? 'primary.main' : 'action.hover' }} />
                              ))}
                            </Box>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#929292', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Commits Synced: 1,240
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent sx={{ p: 2.5 }}>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Terminal sx={{ fontSize: 13, color: '#E8391D' }} />
                              Skill Progress
                            </Typography>
                            <Stack spacing={2}>
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#1E2126' }}>EASY</Typography>
                                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#929292' }}>120/400</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={30} sx={{ height: 5, borderRadius: 3, bgcolor: '#F0F0F0' }} />
                              </Box>
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: '#1E2126' }}>MEDIUM</Typography>
                                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#929292' }}>95/800</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={12} sx={{ height: 5, borderRadius: 3, bgcolor: '#F0F0F0', '& .MuiLinearProgress-bar': { bgcolor: '#ed6c02' } }} />
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}

            </Stack>

          </Box>

        </Box>
      </AppShell>

      {/* ─────────────── EDIT PROFILE DIALOG (PRESERVED) ─────────────── */}
      <Dialog
        open={isEditing}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" fontWeight={900} sx={{ fontFamily: 'Outfit' }}>
            Edit Identity
          </Typography>
          <IconButton onClick={handleEditClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth label="Full Name" name="name"
            value={formData.name} onChange={handleInputChange}
            placeholder="e.g. Hrithic Raj"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            fullWidth label="Headline / Title" name="headline"
            value={formData.headline} onChange={handleInputChange}
            placeholder="e.g. Lead Academic Facilitator"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Phone Number" name="phone"
                value={formData.phone} onChange={handleInputChange}
                placeholder="+91 98765 43210"
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Location" name="location"
                value={formData.location} onChange={handleInputChange}
                placeholder="Bangalore, India"
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth label="Email Address" name="email"
            value={formData.email} onChange={handleInputChange}
            disabled helperText="Contact admin to change official email"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={handleEditClose} color="secondary" sx={{ fontWeight: 900 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            color="primary"
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <Save />}
            disabled={isSaving}
            sx={{ fontWeight: 900, px: 3, boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
};

export default Profile;
