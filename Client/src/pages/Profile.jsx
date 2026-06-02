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
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
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
  CheckBox,
  CloudUpload,
  Delete,
  OpenInNew,
  InsertDriveFile,
  ArrowDropDown,
  Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import AppShell from '../components/layout/AppShell';
import StudentPageLayout from '../components/layout/StudentPageLayout';
import { ROLES } from '../utils/constants';
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

const INTERVIEWER_METRICS = [
  { label: 'Interviews Done', value: '48', icon: <Layers sx={{ fontSize: 18 }} />, color: '#E8391D', bg: 'rgba(232,57,29,0.08)' },
  { label: 'Pending Reviews', value: '02', icon: <Timelapse sx={{ fontSize: 18 }} />, color: '#1565c0', bg: 'rgba(21,101,192,0.08)' },
  { label: 'Avg Evaluation Score', value: '7.8/10', icon: <TrendingUp sx={{ fontSize: 18 }} />, color: '#2e7d32', bg: 'rgba(46,125,50,0.08)' },
  { label: 'Feedback SLA', value: '99%', icon: <CheckCircle sx={{ fontSize: 18 }} />, color: '#6a1b9a', bg: 'rgba(106,27,154,0.08)' },
  { label: 'Batches Assigned', value: '03', icon: <Groups sx={{ fontSize: 18 }} />, color: '#ed6c02', bg: 'rgba(237,108,2,0.08)' },
  { label: 'Hours Evaluated', value: '36h', icon: <Schedule sx={{ fontSize: 18 }} />, color: '#00838f', bg: 'rgba(0,131,143,0.08)' },
];

const RECENT_ACTIVITY_FACILITATOR = [
  { actor: 'You', action: 'approved leave request for Ahmed Khan.', time: '2h ago', dot: 'bg-emerald-500' },
  { actor: 'You', action: 'scheduled React evaluation for B-1.', time: '5h ago', dot: 'bg-blue-500' },
  { actor: 'You', action: 'completed scrum sync review.', time: 'Yesterday', dot: 'bg-brand-orange' },
  { actor: 'You', action: 'marked B-2 attendance for the week.', time: '2 days ago', dot: 'bg-violet-500' },
];

const RECENT_ACTIVITY_INTERVIEWER = [
  { actor: 'You', action: "submitted feedback for Ahmed Khan's React evaluation.", time: '2h ago', dot: 'bg-emerald-500' },
  { actor: 'You', action: 'completed Javascript assessment for B-1.', time: '5h ago', dot: 'bg-blue-500' },
  { actor: 'You', action: 'joined FSD-COHORT-2026 interview panel.', time: 'Yesterday', dot: 'bg-brand-orange' },
  { actor: 'You', action: 'graded HTML/CSS Lab for student Sara Ali.', time: '3 days ago', dot: 'bg-violet-500' },
];

const TODAY_TASKS = [
  { text: '2 technical interviews scheduled today', done: false, icon: <Schedule sx={{ fontSize: 14 }} /> },
  { text: '3 leave requests awaiting your review', done: false, icon: <Timelapse sx={{ fontSize: 14 }} /> },
  { text: 'Attendance pending for B-2 cohort', done: false, icon: <Groups sx={{ fontSize: 14 }} /> },
  { text: 'Scrum incomplete in B-1 this morning', done: true, icon: <FlashOn sx={{ fontSize: 14 }} /> },
];

// ─────────────── GITHUB CONTRIBUTION HEATMAP ───────────────
const GithubContribution = () => {
  const { user, setUser } = useAuth();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    if (!user?.socialLinks?.github) return;
    setSyncing(true);
    try {
      const res = await userApi.syncSocialStats('me');
      const updatedUser = res.data?.data || res.data;
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('GitHub sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  React.useEffect(() => {
    if (user?.socialLinks?.github && !user?.githubStats?.lastSynced) {
      handleSync();
    }
  }, [user?.socialLinks?.github, user?.githubStats?.lastSynced]);

  const weeks = 53;
  const daysPerWeek = 7;
  const colors = ['#EBEDF0', '#9BE9A8', '#40C463', '#30A14E', '#216E39'];

  const contributionsMap = React.useMemo(() => {
    const map = new Map();
    if (user?.githubStats?.contributions) {
      user.githubStats.contributions.forEach(c => {
        map.set(c.date, c);
      });
    }
    return map;
  }, [user?.githubStats?.contributions]);

  const monthLabels = React.useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    let lastWeek = -1;
    const today = new Date();
    
    for (let w = 0; w < 53; w++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - today.getDay() - (52 - w) * 7);
      const month = targetDate.getMonth();
      if (month !== lastMonth) {
        if (lastWeek === -1 || w - lastWeek >= 3) {
          labels.push({
            name: targetDate.toLocaleDateString('en-US', { month: 'short' }),
            week: w
          });
          lastWeek = w;
        }
        lastMonth = month;
      }
    }
    return labels;
  }, []);

  const totalContributions = user?.githubStats?.totalContributions || 0;

  const fmtDate = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Card sx={{ bgcolor: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', p: 4, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', mb: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontFamily: 'Outfit', fontWeight: 500, color: '#1E2126', textTransform: 'none', letterSpacing: 'normal', fontSize: '1.4rem' }}>
          Github Contribution
        </Typography>
        {user?.socialLinks?.github && (
          <IconButton 
            onClick={handleSync} 
            disabled={syncing}
            size="small" 
            sx={{ position: 'absolute', right: 0 }}
          >
            {syncing ? <CircularProgress size={18} sx={{ color: '#1E2126' }} /> : <Refresh sx={{ fontSize: 18, color: '#1E2126' }} />}
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 4, borderColor: '#F3F4F6' }} />
      
      <Box sx={{ overflowX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {!user?.socialLinks?.github ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'gray', fontFamily: 'Outfit' }}>
              Please add your GitHub Username in the Edit Social Links section to display your contributions.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ minWidth: 780, width: '100%', px: 2 }}>
            {/* Month Labels aligned to grid columns */}
            <Box sx={{ position: 'relative', height: 20, mb: 1, display: 'flex', pl: '12px' }}>
              {monthLabels.map((mw) => (
                <Typography 
                  key={mw.week} 
                  variant="caption" 
                  sx={{ 
                    position: 'absolute', 
                    left: `${(mw.week / 53) * 100}%`,
                    transform: 'translateX(-50%)',
                    color: '#1E2126', 
                    fontWeight: 500, 
                    fontSize: '0.8rem',
                    fontFamily: 'Outfit'
                  }}
                >
                  {mw.name}
                </Typography>
              ))}
            </Box>

            {/* Grid Container */}
            <Box sx={{ display: 'flex', gap: '4px' }}>
              {/* Weeks Columns */}
              <Box sx={{ display: 'flex', gap: '5.5px', flexGrow: 1, justifyContent: 'space-between' }}>
                {Array.from({ length: weeks }).map((_, wIdx) => (
                  <Box key={wIdx} sx={{ display: 'flex', flexDirection: 'column', gap: '5.5px' }}>
                    {Array.from({ length: daysPerWeek }).map((_, dIdx) => {
                      const today = new Date();
                      const targetDate = new Date(today);
                      targetDate.setDate(today.getDate() - today.getDay() + dIdx - (52 - wIdx) * 7);
                      const dateStr = targetDate.toISOString().split('T')[0];
                      const dayData = contributionsMap.get(dateStr) || { count: 0, level: 0 };
                      
                      return (
                        <Tooltip key={dIdx} title={`${dayData.count} contributions on ${fmtDate(dateStr)}`} arrow>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '2px',
                              bgcolor: colors[dayData.level],
                              transition: 'transform 0.1s',
                              '&:hover': { transform: 'scale(1.25)', cursor: 'pointer' }
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bottom Info and Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#1E2126', fontWeight: 500, fontSize: '0.82rem', fontFamily: 'Outfit' }}>
                {totalContributions} contributions in the last year
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#1E2126', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'Outfit' }}>Less</Typography>
                {colors.map((color, idx) => (
                  <Box key={idx} sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: color }} />
                ))}
                <Typography variant="caption" sx={{ color: '#1E2126', fontWeight: 500, fontSize: '0.8rem', fontFamily: 'Outfit' }}>More</Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

// ─────────────── LEETCODE STATS CARD ───────────────
const LeetcodeStats = () => {
  const { user, setUser } = useAuth();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    if (!user?.socialLinks?.leetcode) return;
    setSyncing(true);
    try {
      const res = await userApi.syncSocialStats('me');
      const updatedUser = res.data?.data || res.data;
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('LeetCode sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  React.useEffect(() => {
    if (user?.socialLinks?.leetcode && !user?.leetcodeStats?.lastSynced) {
      handleSync();
    }
  }, [user?.socialLinks?.leetcode, user?.leetcodeStats?.lastSynced]);

  const stats = user?.leetcodeStats || { solved: 0, easy: 0, medium: 0, hard: 0 };

  return (
    <Card sx={{
      bgcolor: '#262626', // Dark gray card background matching the screenshot
      color: 'white',
      borderRadius: '16px',
      p: 3,
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: 'none',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Top logo & title with Sync Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.102 17.93l-2.697 2.607c-.466.45-1.211.45-1.677 0l-8.479-8.192a3.86 3.86 0 010-5.614L7.382 2.6c.466-.45 1.211-.45 1.677 0l8.479 8.192c.92.89.92 2.333 0 3.223l-3.392 3.277c-.466.45-1.211.45-1.677 0l-5.652-5.462a.772.772 0 010-1.123c.31-.3.814-.3 1.125 0l4.527 4.373 2.825-2.73" stroke="#FFA116" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              Leetcode
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', display: 'block', mt: -0.2 }}>
              statics
            </Typography>
          </Box>
        </Box>
        {user?.socialLinks?.leetcode && (
          <IconButton 
            onClick={handleSync} 
            disabled={syncing}
            size="small" 
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
          >
            {syncing ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Refresh sx={{ fontSize: 16, color: 'white' }} />}
          </IconButton>
        )}
      </Box>

      {/* Main Content Layout */}
      {!user?.socialLinks?.leetcode ? (
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit' }}>
            Please add your LeetCode Username in the Edit Social Links section to display your stats.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          {/* Left Side: Big Count */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontFamily: 'Outfit, Roboto, sans-serif', fontWeight: 900, fontSize: '3.6rem', color: 'white', lineHeight: 1 }}>
              {stats.solved}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', mt: 1, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>
              Solved<br />Problems
            </Typography>
          </Box>

          {/* Right Side: Difficulties */}
          <Stack spacing={1.5} sx={{ minWidth: 100 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)' }}>
                Easy
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#4ECA73' }}>
                {stats.easy}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)' }}>
                Medium
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#D4B13B' }}>
                {stats.medium}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)' }}>
                Hard
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#EF4444' }}>
                {stats.hard}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Card>
  );
};

// ─────────────── ACADEMIC INFO CARD ───────────────
const AcademicInfo = () => {
  // ── Field data ──
  const fields = [
    { label: 'Branch',       value: 'Kakkanchery' },
    { label: 'Space',        value: 'Horthus (Neo Space 2)' },
    { label: 'Week',         value: '24' },
    { label: 'Advisor',      value: 'MUHAMMED NIYAS T.K' },
    { label: 'Mentor',       value: 'HRITHIC RAJ P' },
    { label: 'Qualification', value: 'Plus two' },
    { label: 'Joining Date', value: '30 Jul 2025' },
    { label: 'Course Type',  value: 'Offline BootCamp' },
    { label: 'Domain',       value: 'MERN Stack' },
    { label: 'Department',   value: 'Full Stack Development' },
  ];

  // ── Refs for file inputs ──
  const resumeInputRef = React.useRef(null);
  const docInputRef    = React.useRef(null);

  // ── Social links (fetched from user database with useAuth) ──
  const { user, setUser } = useAuth();
  const [socialLinks, setSocialLinks] = React.useState({
    linkedin: user?.socialLinks?.linkedin || '',
    github:   user?.socialLinks?.github   || '',
    leetcode: user?.socialLinks?.leetcode || '',
  });

  React.useEffect(() => {
    if (user?.socialLinks) {
      setSocialLinks({
        linkedin: user.socialLinks.linkedin || '',
        github:   user.socialLinks.github   || '',
        leetcode: user.socialLinks.leetcode || '',
      });
    }
  }, [user?.socialLinks]);

  const [editOpen, setEditOpen]   = React.useState(false);
  const [editDraft, setEditDraft] = React.useState({ ...socialLinks });

  // ── Document state ──
  const [documents, setDocuments] = React.useState([]);
  const [docsLoaded, setDocsLoaded] = React.useState(false);
  const [uploading, setUploading]   = React.useState(false);
  const [uploadPct, setUploadPct]   = React.useState(0);
  const [deletingId, setDeletingId] = React.useState(null);
  const [snack, setSnack]           = React.useState({ open: false, msg: '', sev: 'success' });

  // ── Dropdown anchor state ──
  const [resumeAnchor, setResumeAnchor] = React.useState(null);
  const [docAnchor, setDocAnchor]       = React.useState(null);

  // ── Fetch documents (always fresh on call, uses docsLoaded flag only for menu re-opens) ──
  const fetchDocs = async () => {
    try {
      const res = await userApi.getMyDocuments();
      setDocuments(res.data?.data || []);
      setDocsLoaded(true);
    } catch (e) {
      console.error('Failed to load documents', e);
      setDocsLoaded(true);
    }
  };

  // Load once on mount so files are ready before first click
  React.useEffect(() => { fetchDocs(); }, []);

  const handleResumeMenuOpen  = async (e) => { setResumeAnchor(e.currentTarget); if (!docsLoaded) await fetchDocs(); };
  const handleResumeMenuClose = () => setResumeAnchor(null);
  const handleDocMenuOpen     = async (e) => { setDocAnchor(e.currentTarget);   if (!docsLoaded) await fetchDocs(); };
  const handleDocMenuClose    = () => setDocAnchor(null);

  // ── Upload handler ──
  const handleUpload = async (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true); setUploadPct(0);
    setResumeAnchor(null); setDocAnchor(null);
    try {
      const res = await userApi.uploadStudentDocument(file, docType, file.name, setUploadPct);
      setDocuments(res.data?.data || []);
      setDocsLoaded(true);
      setSnack({ open: true, msg: `${docType === 'resume' ? 'Resume' : 'Document'} uploaded successfully!`, sev: 'success' });
    } catch (err) {
      setSnack({ open: true, msg: 'Upload failed. Please try again.', sev: 'error' });
    } finally {
      setUploading(false); setUploadPct(0);
    }
  };

  // ── Delete handler ──
  const handleDelete = async (docId) => {
    setDeletingId(docId);
    try {
      await userApi.deleteMyDocument(docId);
      setDocuments(prev => prev.filter(d => d._id !== docId));
      setSnack({ open: true, msg: 'Deleted successfully.', sev: 'success' });
    } catch {
      setSnack({ open: true, msg: 'Delete failed.', sev: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  // ── Social links helpers ──
  const handleOpenEdit    = () => { setEditDraft({ ...socialLinks }); setEditOpen(true); };
  const handleCloseEdit   = () => setEditOpen(false);
  const handleSaveEdit    = async () => {
    try {
      const res = await userApi.updateMe({ socialLinks: editDraft });
      const updatedUser = res.data?.data || res.data;
      if (updatedUser) {
        setUser(updatedUser);
        setSocialLinks(updatedUser.socialLinks || {});
      }
      setSnack({ open: true, msg: 'Links updated and statistics synced successfully.', sev: 'success' });
      setEditOpen(false);
    } catch (err) {
      console.error('Failed to update social links', err);
      setSnack({ open: true, msg: 'Failed to update links.', sev: 'error' });
    }
  };
  const openLink = (type) => {
    const map = {
      linkedin: `https://linkedin.com/in/${socialLinks.linkedin}`,
      github:   `https://github.com/${socialLinks.github}`,
      leetcode: `https://leetcode.com/${socialLinks.leetcode}`,
    };
    if (!socialLinks[type]) { setEditOpen(true); return; }
    window.open(map[type], '_blank', 'noopener,noreferrer');
  };

  // ── Brand SVG icons (defined inline so they can reference state) ──
  const LinkedInIcon  = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="3" fill="#0A66C2"/><path d="M7.5 10H5V19H7.5V10ZM6.25 9C5.42 9 4.75 8.33 4.75 7.5S5.42 6 6.25 6 7.75 6.67 7.75 7.5 7.08 9 6.25 9Z" fill="white"/><path d="M19 13.5C19 11.57 17.93 10 16 10c-1.2 0-2.1.6-2.5 1.5V10H11v9h2.5v-4.5c0-1.1.7-2 1.75-2s1.25.8 1.25 2V19H19v-5.5Z" fill="white"/></svg>);
  const GitHubIcon    = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>);
  const LeetCodeIcon  = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16.102 17.93l-2.697 2.607c-.466.45-1.211.45-1.677 0l-8.479-8.192a3.86 3.86 0 010-5.614L7.382 2.6c.466-.45 1.211-.45 1.677 0l8.479 8.192c.92.89.92 2.333 0 3.223l-3.392 3.277c-.466.45-1.211.45-1.677 0l-5.652-5.462a.772.772 0 010-1.123c.31-.3.814-.3 1.125 0l4.527 4.373 2.825-2.73" stroke="#FFA116" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);

  // ── doc type filter helper ──
  const resumeDocs = documents.filter(d => d.type === 'resume');
  const otherDocs  = documents.filter(d => d.type === 'document');
  const fmtDate    = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  // ── Shared doc button style factory ──
  const docBtnSx = (color, hoverColor) => ({
    fontWeight: 800,
    fontSize: '0.72rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: '6px',
    py: 1,
    boxShadow: `0 4px 12px ${color}55`,
    '&:hover': { boxShadow: `0 6px 16px ${color}77`, bgcolor: hoverColor },
  });

  return (
    <>
      {/* Hidden file inputs */}
      <input ref={resumeInputRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={e => handleUpload(e, 'resume')} />
      <input ref={docInputRef}    type="file" hidden accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={e => handleUpload(e, 'document')} />

      <Card sx={{ bgcolor: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'visible' }}>
        <CardContent sx={{ p: 2.5 }}>

          {/* ── Section Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <School sx={{ fontSize: 14, color: '#E8391D' }} />
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 900, color: '#6B7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Academic Info
            </Typography>
          </Box>

          {/* ── Info Fields: clean 2-col grid ── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, mb: 0 }}>
            {fields.map((field, idx) => (
              <Box
                key={field.label}
                sx={{
                  py: 1.4,
                  px: 0,
                  borderBottom: idx < fields.length - (fields.length % 2 === 0 ? 2 : 1) ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  gridColumn: field.label === 'Domain' && fields.length % 2 !== 0 ? 'span 2' : 'span 1',
                  pr: idx % 2 === 0 ? 2 : 0,
                  pl: idx % 2 !== 0 ? 2 : 0,
                  borderRight: idx % 2 === 0 && idx < fields.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                }}
              >
                <Typography sx={{ fontSize: '0.63rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.07em', textTransform: 'uppercase', mb: 0.4 }}>
                  {field.label}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E2126', lineHeight: 1.3 }}>
                  {field.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mt: 2, mb: 2.5, borderColor: 'rgba(0,0,0,0.06)' }} />

          {/* ── Upload Progress ── */}
          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280' }}>Uploading…</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1E2126' }}>{uploadPct}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={uploadPct} sx={{ height: 4, borderRadius: 0, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: '#7C3AED' } }} />
            </Box>
          )}

          {/* ── Resume & Documents Buttons ── */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>

            {/* RESUME button + dropdown */}
            <Button
              id="btn-resume-menu"
              variant="contained"
              size="small"
              fullWidth
              endIcon={<ArrowDropDown sx={{ fontSize: 18 }} />}
              onClick={handleResumeMenuOpen}
              disabled={uploading}
              sx={{
                bgcolor: '#7C3AED',
                color: 'white',
                justifyContent: 'space-between',
                pl: 1.5,
                pr: 1,
                ...docBtnSx('#7C3AED', '#6D28D9'),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                RESUME
              </Box>
            </Button>
            <Menu
              anchorEl={resumeAnchor}
              open={Boolean(resumeAnchor)}
              onClose={handleResumeMenuClose}
              PaperProps={{ sx: { minWidth: 280, borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', mt: 0.5 } }}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
              {/* Upload new */}
              <MenuItem onClick={() => { resumeInputRef.current.click(); handleResumeMenuClose(); }} sx={{ py: 1.25, gap: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 0 }}><CloudUpload sx={{ fontSize: 18, color: '#7C3AED' }} /></ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E2126' }}>Upload New Resume</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF' }}>PDF, DOC, DOCX · max 10MB</Typography>}
                />
              </MenuItem>
              {resumeDocs.length > 0 && <Divider sx={{ my: 0.5 }} />}
              {/* Existing resumes */}
              {resumeDocs.map(doc => (
                <MenuItem key={doc._id} disableRipple sx={{ py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  <ListItemIcon sx={{ minWidth: 0 }}><InsertDriveFile sx={{ fontSize: 18, color: '#7C3AED' }} /></ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1E2126', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</Typography>}
                    secondary={<Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{fmtDate(doc.uploadedAt)}</Typography>}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                    <Tooltip title="Open file">
                      <IconButton size="small" onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')} sx={{ color: '#6B7280', '&:hover': { color: '#1E2126' } }}>
                        <OpenInNew sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(doc._id)} disabled={deletingId === doc._id} sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                        {deletingId === doc._id ? <CircularProgress size={13} sx={{ color: '#EF4444' }} /> : <Delete sx={{ fontSize: 14 }} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </MenuItem>
              ))}
              {resumeDocs.length === 0 && docsLoaded && (
                <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>No resume uploaded yet</Typography>
                </Box>
              )}
            </Menu>

            {/* DOCUMENTS button + dropdown */}
            <Button
              id="btn-documents-menu"
              variant="contained"
              size="small"
              fullWidth
              endIcon={<ArrowDropDown sx={{ fontSize: 18 }} />}
              onClick={handleDocMenuOpen}
              disabled={uploading}
              sx={{
                bgcolor: '#2563EB',
                color: 'white',
                justifyContent: 'space-between',
                pl: 1.5,
                pr: 1,
                ...docBtnSx('#2563EB', '#1D4ED8'),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                DOCS
              </Box>
            </Button>
            <Menu
              anchorEl={docAnchor}
              open={Boolean(docAnchor)}
              onClose={handleDocMenuClose}
              PaperProps={{ sx: { minWidth: 280, borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', mt: 0.5 } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { docInputRef.current.click(); handleDocMenuClose(); }} sx={{ py: 1.25, gap: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 0 }}><CloudUpload sx={{ fontSize: 18, color: '#2563EB' }} /></ListItemIcon>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1E2126' }}>Upload New Document</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF' }}>PDF, DOC, DOCX, Image · max 10MB</Typography>}
                />
              </MenuItem>
              {otherDocs.length > 0 && <Divider sx={{ my: 0.5 }} />}
              {otherDocs.map(doc => (
                <MenuItem key={doc._id} disableRipple sx={{ py: 1.25, gap: 1.5, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                  <ListItemIcon sx={{ minWidth: 0 }}><InsertDriveFile sx={{ fontSize: 18, color: '#2563EB' }} /></ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1E2126', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</Typography>}
                    secondary={<Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{fmtDate(doc.uploadedAt)}</Typography>}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                    <Tooltip title="Open file">
                      <IconButton size="small" onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')} sx={{ color: '#6B7280', '&:hover': { color: '#1E2126' } }}>
                        <OpenInNew sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(doc._id)} disabled={deletingId === doc._id} sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                        {deletingId === doc._id ? <CircularProgress size={13} sx={{ color: '#EF4444' }} /> : <Delete sx={{ fontSize: 14 }} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </MenuItem>
              ))}
              {otherDocs.length === 0 && docsLoaded && (
                <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>No documents uploaded yet</Typography>
                </Box>
              )}
            </Menu>
          </Box>

          {/* ── Social Profile Links – icon only, no bg, no border ── */}
          <Box sx={{ display: 'flex', gap: 0, mb: 2 }}>
            {[
              { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, activeColor: '#0A66C2', hoverBg: 'rgba(10,102,194,0.07)' },
              { key: 'github',   label: 'GitHub',   Icon: GitHubIcon,   activeColor: '#1E2126', hoverBg: 'rgba(30,33,38,0.07)' },
              { key: 'leetcode', label: 'LeetCode', Icon: LeetCodeIcon, activeColor: '#B45309', hoverBg: 'rgba(255,161,22,0.1)' },
            ].map(({ key, label, Icon, activeColor, hoverBg }) => (
              <Tooltip key={key} title={socialLinks[key] ? `${key === 'linkedin' ? 'linkedin.com/in/' : key === 'github' ? 'github.com/' : 'leetcode.com/'}${socialLinks[key]}` : `Set ${label} username`}>
                <Button
                  id={`btn-open-${key}`}
                  variant="text"
                  size="small"
                  fullWidth
                  onClick={() => openLink(key)}
                  sx={{
                    color: socialLinks[key] ? activeColor : '#9CA3AF',
                    borderRadius: '6px',
                    py: 1,
                    fontWeight: 800,
                    fontSize: '0.6rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    flexDirection: 'column',
                    gap: 0.5,
                    minWidth: 0,
                    bgcolor: 'transparent',
                    border: 'none',
                    transition: 'all 0.18s',
                    '&:hover': { bgcolor: hoverBg, color: activeColor },
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </Button>
              </Tooltip>
            ))}
          </Box>

          {/* ── Edit Social Links ── */}
          <Button
            id="btn-edit-social-links"
            variant="outlined"
            size="small"
            fullWidth
            startIcon={<Edit sx={{ fontSize: 14 }} />}
            onClick={handleOpenEdit}
            sx={{
              borderColor: '#E5E7EB', color: '#6B7280', borderRadius: '6px',
              py: 0.85, fontWeight: 700, fontSize: '0.7rem',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              '&:hover': { borderColor: '#1E2126', color: '#1E2126', bgcolor: 'rgba(0,0,0,0.02)' }
            }}
          >
            Edit Social Links
          </Button>
        </CardContent>
      </Card>

      {/* ── Snackbar feedback ── */}
      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.sev} sx={{ fontWeight: 700, fontSize: '0.82rem', borderRadius: '6px' }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>

      {/* ── Edit Social Links Dialog ── */}
      <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '6px', p: 0.5 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit sx={{ fontSize: 18, color: '#E8391D' }} />
            <Typography variant="subtitle1" fontWeight={900} sx={{ fontFamily: 'Outfit' }}>Edit Social Links</Typography>
          </Box>
          <IconButton onClick={handleCloseEdit} size="small"><Close sx={{ fontSize: 16 }} /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2.5 }}>
          {[
            { key: 'linkedin', label: 'LinkedIn Username', placeholder: 'e.g. john-doe-123', hint: 'linkedin.com/in/[username]', Icon: LinkedInIcon },
            { key: 'github',   label: 'GitHub Username',   placeholder: 'e.g. johndoe',       hint: 'github.com/[username]',   Icon: GitHubIcon },
            { key: 'leetcode', label: 'LeetCode Username', placeholder: 'e.g. johndoe',       hint: 'leetcode.com/[username]', Icon: LeetCodeIcon },
          ].map(({ key, label, placeholder, hint, Icon }) => (
            <TextField
              key={key}
              fullWidth
              label={label}
              placeholder={placeholder}
              value={editDraft[key]}
              onChange={(e) => setEditDraft(d => ({ ...d, [key]: e.target.value }))}
              InputProps={{
                startAdornment: (<Box sx={{ mr: 1, display: 'flex', alignItems: 'center', color: '#1E2126' }}><Icon /></Box>),
                sx: { borderRadius: '6px', fontSize: '0.875rem' }
              }}
              helperText={hint}
              size="small"
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
          <Button onClick={handleCloseEdit} sx={{ fontWeight: 700, color: '#6B7280', borderRadius: '6px', fontSize: '0.8rem' }}>Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<Save sx={{ fontSize: 16 }} />}
            sx={{ fontWeight: 900, bgcolor: '#1E2126', color: 'white', borderRadius: '6px', px: 2.5, fontSize: '0.8rem', boxShadow: 'none', '&:hover': { bgcolor: '#0f1113', boxShadow: 'none' } }}
          >
            Save Links
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


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
  const isStudent = user?.role === ROLES.STUDENT;
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

  const profileHeader = (
    <>
      <Breadcrumbs separator=">" sx={{ mb: 1.5 }}>
        <MuiLink
          component={RouterLink}
          to="/dashboard"
          underline="none"
          color="text.secondary"
          sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
        >
          DASHBOARD
        </MuiLink>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>MY PROFILE</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'rgba(232, 57, 29, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
          }}
        >
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
    </>
  );

  const profileBody = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: isStudent ? 0 : 8 }}>

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
                {/* Identity & Contact */}
                <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={3} style={{ display: 'flex' }}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 2.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge sx={{ fontSize: 13, color: '#E8391D' }} />
                        Identity & Contact
                      </Typography>
                      <Stack spacing={2.5}>
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
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2, lineHeight: 1.4 }}>{user?.location || user?.address || 'Not provided'}</Typography>
                          </Box>
                        </Box>

                        <Divider />

                        {/* Address */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{ mt: 0.2, color: '#929292' }}><LocationOn sx={{ fontSize: 15 }} /></Box>
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#929292', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ADDRESS</Typography>
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E2126', mt: 0.2, lineHeight: 1.4 }}>{user?.address || user?.location || 'Not provided'}</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* LeetCode stats for student only */}
                {!isStaff && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={4}>
                    <LeetcodeStats />
                  </motion.div>
                )}
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

                {/* Assigned Evaluation Batches (interviewer only) */}
                {isInterviewer && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={4}>
                    <Card>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 2.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <School sx={{ fontSize: 13, color: '#E8391D' }} />
                          Assigned Evaluation Batches
                        </Typography>
                        <Grid container spacing={2.5}>
                          {[
                            { name: 'MERN-B1', students: 12, pendingInterviews: 2, fill: 83, color: '#E8391D' },
                            { name: 'FS-JAVA-02', students: 8, pendingInterviews: 0, fill: 100, color: '#1565c0' },
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
                                        {batch.pendingInterviews} pending
                                      </Typography>
                                    </Stack>
                                  </Box>
                                  <Chip
                                    label={batch.pendingInterviews > 0 ? "PENDING" : "COMPLETED"}
                                    size="small"
                                    sx={{ 
                                      bgcolor: batch.pendingInterviews > 0 ? 'rgba(237,108,2,0.15)' : 'rgba(46,125,50,0.15)', 
                                      color: batch.pendingInterviews > 0 ? '#ed6c02' : '#2e7d32', 
                                      fontWeight: 900, 
                                      fontSize: '0.62rem', 
                                      borderRadius: 1.5,
                                      border: `1px solid ${batch.pendingInterviews > 0 ? 'rgba(237,108,2,0.3)' : 'rgba(46,125,50,0.3)'}`
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
                                      EVALUATION COMPLETION
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

                {/* Recent Operational Activity (staff only) */}
                {isStaff && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={5}>
                    <Card>
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#929292', letterSpacing: '0.1em', mb: 3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Assessment sx={{ fontSize: 13, color: '#E8391D' }} />
                          Recent Operational Activity
                        </Typography>
                        <Box sx={{ pl: 2, borderLeft: '2px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 3.5, my: 1 }}>
                          {(isInterviewer ? RECENT_ACTIVITY_INTERVIEWER : RECENT_ACTIVITY_FACILITATOR).map((item, i) => (
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
                )}

                {/* Academic Info for student only */}
                {!isStaff && (
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={5.5}>
                    <AcademicInfo />
                  </motion.div>
                )}
            </Stack>

          </Box>

          {/* Github Contribution Heatmap for student only */}
          {!isStaff && (
            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={6}>
              <GithubContribution />
            </motion.div>
          )}

    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        {isStudent ? (
          <StudentPageLayout header={profileHeader}>{profileBody}</StudentPageLayout>
        ) : (
          <>
            <Box sx={{ width: '100%', py: 2.5, px: { xs: 3, md: 4.5 }, display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>
              <Box
                sx={{
                  pt: 4,
                  pb: 3,
                  px: { xs: 3, md: 4.5 },
                  mx: { xs: -3, md: -4.5 },
                  mt: -2.5,
                  background: 'white',
                  borderBottom: '1px solid #E5E7EB',
                  mb: 3,
                }}
              >
                {profileHeader}
              </Box>
              {profileBody}
            </Box>
          </>
        )}
      </AppShell>

      {/* ─────────────── EDIT PROFILE DIALOG (PRESERVED) ─────────────── */}
      <Dialog
        open={isEditing}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 6, p: 1 } }}
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
