import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  Chip,
  Avatar,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  ThemeProvider,
  createTheme,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Alert,
  AlertTitle,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  School,
  TrendingUp,
  Email,
  CalendarMonth,
  Gavel,
  Message,
  WarningAmber,
  CheckCircle,
  Cancel,
  AddComment,
  Edit,
  Delete,
  Phone,
  LocationOn,
  ContactPhone,
  Badge,
  Schedule,
  Check,
  Block,
  ChevronLeft,
  ChevronRight,
  PhotoCamera
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import AppShell from '../components/layout/AppShell';
import { uploadFile, getUserById, updateUser } from '../api/users.api';
import { changeStudentStatus } from '../api/students.api';

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
    h6: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          backgroundImage: 'none'
        }
      }
    }
  }
});

// Standard seed data
const DEFAULT_ROSTER = [
  { id: 1, name: 'Hrithic Raj', email: 'hrithic.raj@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '92%', academicHealth: 'Excellent', interviewStatus: 'Mock Cleared', leaveStatus: 'None' },
  { id: 2, name: 'Ananya S', email: 'ananya.s@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-15', course: 'UI/UX Design', attendance: '95%', academicHealth: 'Good Standing', interviewStatus: 'Scheduled', leaveStatus: 'None' },
  { id: 3, name: 'Mohammad Mishal', email: 'mishal@staxhaus.com', status: 'Inactive', batch: 'B-2', joinDate: '2023-09-20', course: 'Data Science', attendance: '45%', academicHealth: 'Critical Risk', interviewStatus: 'Not Started', leaveStatus: 'Active Leave' },
  { id: 4, name: 'Sneha Kapoor', email: 'sneha.k@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '88%', academicHealth: 'Good Standing', interviewStatus: 'Mock Cleared', leaveStatus: 'None' },
  { id: 5, name: 'Rahul V', email: 'rahul.v@staxhaus.com', status: 'Active', batch: 'B-3', joinDate: '2024-01-05', course: 'Mobile App Development', attendance: '91%', academicHealth: 'Good Standing', interviewStatus: 'Pending Review', leaveStatus: 'None' },
  { id: 6, name: 'Priya Mani', email: 'priya.m@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '97%', academicHealth: 'Excellent', interviewStatus: 'Mock Cleared', leaveStatus: 'None' },
  { id: 7, name: 'Arun Kumar', email: 'arun@staxhaus.com', status: 'Active', batch: 'B-2', joinDate: '2023-11-05', course: 'Cyber Security', attendance: '85%', academicHealth: 'Needs Review', interviewStatus: 'Scheduled', leaveStatus: 'None' },
  { id: 8, name: 'Divya Nair', email: 'divya@staxhaus.com', status: 'Active', batch: 'B-3', joinDate: '2023-12-10', course: 'Cloud Computing', attendance: '90%', academicHealth: 'Good Standing', interviewStatus: 'Mock Cleared', leaveStatus: 'None' },
  { id: 9, name: 'Karthik Raja', email: 'karthik@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2024-01-15', course: 'Full Stack Development', attendance: '68%', academicHealth: 'Needs Review', interviewStatus: 'Not Started', leaveStatus: 'Pending Approval' },
  { id: 10, name: 'Meera Jasmine', email: 'meera@staxhaus.com', status: 'Inactive', batch: 'B-2', joinDate: '2023-08-25', course: 'Data Science', attendance: '30%', academicHealth: 'Critical Risk', interviewStatus: 'Not Started', leaveStatus: 'None' },
  { id: 11, name: 'Sanjay Dutt', email: 'sanjay@staxhaus.com', status: 'Active', batch: 'B-3', joinDate: '2024-02-01', course: 'Mobile App Development', attendance: '88%', academicHealth: 'Good Standing', interviewStatus: 'Mock Cleared', leaveStatus: 'Active Leave' },
  { id: 12, name: 'Lekshmi S', email: 'lekshmi@staxhaus.com', status: 'Active', batch: 'B-1', joinDate: '2023-10-12', course: 'Full Stack Development', attendance: '94%', academicHealth: 'Excellent', interviewStatus: 'Mock Cleared', leaveStatus: 'None' }
];

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = parseInt(id, 10);

  // Load from local storage sync with AttendanceRoster
  const [roster, setRoster] = useState(() => {
    const saved = localStorage.getItem('staxhaus_students');
    return saved ? JSON.parse(saved) : DEFAULT_ROSTER;
  });

  const studentInfo = roster.find(s => s.id === studentId) || roster.find(s => s._id === id) || roster[0];

  // Fetch real student from backend if the ID is a MongoDB ObjectId (24-char hex)
  useEffect(() => {
    const fetchStudent = async () => {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isObjectId) {
        try {
          const res = await getUserById(id);
          const user = res.data?.data || res.data;
          if (user) {
            setRoster(prevRoster => {
              const exists = prevRoster.find(s => s._id === user._id || s.email === user.email);
              if (!exists) {
                const newStudent = {
                  id: prevRoster.length + 1,
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  status: 'Active',
                  batch: user.batch || 'B-1',
                  joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2023-10-15',
                  course: user.course || 'Full Stack Development',
                  attendance: '94%',
                  academicHealth: 'Good Standing',
                  interviewStatus: 'Scheduled',
                  leaveStatus: 'None',
                  phone: user.phone || '',
                  address: user.address || '',
                  emergencyContact: user.emergencyContact || ''
                };
                const updated = [...prevRoster, newStudent];
                localStorage.setItem('staxhaus_students', JSON.stringify(updated));
                return updated;
              } else {
                const updated = prevRoster.map(s => {
                  if (s._id === user._id || s.email === user.email) {
                    return {
                      ...s,
                      phone: user.phone || s.phone || '',
                      address: user.address || s.address || '',
                      emergencyContact: user.emergencyContact || s.emergencyContact || '',
                      profilePic: user.profilePic || s.profilePic
                    };
                  }
                  return s;
                });
                localStorage.setItem('staxhaus_students', JSON.stringify(updated));
                return updated;
              }
            });
          }
        } catch (err) {
          console.error("Error fetching user from backend:", err);
        }
      }
    };
    fetchStudent();
  }, [id]);

  // Month selection state for heatmap
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 23)); // SAT, MAY 23, 2026

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const getMonthYearString = () => {
    const options = { month: 'long', year: 'numeric' };
    const formatted = currentDate.toLocaleDateString('en-US', options);
    return formatted.toUpperCase();
  };

  // Profile image upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profilePic', file);

    setIsUploading(true);
    try {
      const res = await uploadFile(uploadData);
      const imageUrl = res.data.data.url;

      // Update student profilePic in roster stored in localStorage
      const updatedRoster = roster.map(s => {
        if (s.id === studentId) {
          return { ...s, profilePic: imageUrl };
        }
        return s;
      });
      setRoster(updatedRoster);
      localStorage.setItem('staxhaus_students', JSON.stringify(updatedRoster));
    } catch (error) {
      console.error('Error uploading profile pic:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Specific detailed operational data depending on student status/health
  const getStudentSpecificDetails = () => {
    const health = studentInfo.academicHealth;
    const isCritical = health === 'Critical Risk' || parseInt(studentInfo.attendance) < 75;
    const isNeedsReview = health === 'Needs Review';
    const isExcellent = health === 'Excellent';

    // Generative profiles based on actual student status
    return {
      phone: studentInfo.phone || (studentId === 2 ? '+91 98452 38459' : studentId === 3 ? '+91 90082 11204' : `+91 9745${50000 + studentId}`),
      address: studentInfo.address || (studentId === 2 ? 'Flat 302, Starlight Residency, Koramangala, Bengaluru' : 'No. 45, Crescent Heights, MG Road, Bengaluru'),
      emergencyContact: studentInfo.emergencyContact || (studentId === 2 ? 'Sundar S. (Father) - +91 98452 38450' : 'M. Ali (Uncle) - +91 90082 11200'),
      department: studentInfo.course.includes('Development') ? 'Software Engineering' : studentInfo.course.includes('UX') ? 'Design & Human Factors' : 'Data & Analytics',
      currentModule: isExcellent ? 'Module 5: System Architecture & Scale' : isCritical ? 'Module 2: Advanced Programming Concepts' : 'Module 3: Core Database Systems',
      studentCode: `STX-${studentInfo.joinDate.split('-')[0]}-${String(studentInfo.id).padStart(3, '0')}`,
      
      // Summary Metrics
      interviewScore: isExcellent ? '9.4 / 10' : isCritical ? '4.8 / 10' : isNeedsReview ? '6.5 / 10' : '8.2 / 10',
      interviewScoreTrend: isExcellent ? '+0.4' : isCritical ? '-1.2' : '+0.1',
      scrumConsistency: isExcellent ? '98%' : isCritical ? '35%' : isNeedsReview ? '72%' : '88%' ,
      scrumTrend: isExcellent ? 'Optimal' : isCritical ? 'Critical Lag' : 'Minor Gaps',
      leaveCount: isCritical ? 6 : isExcellent ? 1 : 3,
      leaveTrend: isCritical ? 'Frequent' : 'Normal',
      
      // Academic Charts & Indicators
      weeklyAttendance: [
        { week: 'W1', attendance: isCritical ? 40 : 85 },
        { week: 'W2', attendance: isCritical ? 35 : 90 },
        { week: 'W3', attendance: isCritical ? 48 : 88 },
        { week: 'W4', attendance: isCritical ? 30 : 92 },
        { week: 'W5', attendance: isCritical ? 45 : parseInt(studentInfo.attendance) }
      ],
      moduleCompletion: isExcellent ? 88 : isCritical ? 32 : 60,
      assignmentRate: isExcellent ? 96 : isCritical ? 40 : 78,
      mockInterviewScores: [
        { topic: 'DSA Basics', score: isExcellent ? 90 : isCritical ? 50 : 70 },
        { topic: 'React & DOM', score: isExcellent ? 95 : isCritical ? 45 : 78 },
        { topic: 'Node API', score: isExcellent ? 92 : isCritical ? 30 : 65 }
      ],
      technicalRating: isExcellent ? 'A+' : isCritical ? 'D' : isNeedsReview ? 'C+' : 'B+',

      // Scrum
      scrumTimeline: [
        { date: '2026-05-22', update: isCritical ? 'No update logged (Absent).' : 'Worked on routing, completed breadcrumbs. Peer reviews pending.', status: isCritical ? 'Missed' : 'Completed', blocker: 'None' },
        { date: '2026-05-21', update: isCritical ? 'Struggled with API integration. Left mid-day.' : 'Implementing dashboard grid, alignment of KPI cards completed.', status: isCritical ? 'Partial' : 'Completed', blocker: 'CORS Issues' },
        { date: '2026-05-20', update: 'API integration started, minor blockers in Axios setup.', status: 'Completed', blocker: 'None' }
      ],

      // Evaluation History
      interviewList: [
        { date: '2026-05-18', round: 'Technical Review - Module 2', interviewer: 'Anand K.', status: isCritical ? 'Fail' : 'Pass', feedback: isCritical ? 'Core React concepts are weak. Lacks confidence in state hooks.' : 'Excellent state management grasp. Code structure is premium.' },
        { date: '2026-05-10', round: 'Facilitator Assessment - Module 1', interviewer: 'Siddharth S.', status: 'Pass', feedback: 'Satisfactory programming logic. Completed assignments on time.' }
      ],

      // Leave Intelligence
      leavesHistory: [
        { date: '2026-05-15', duration: '2 Days', type: 'Medical', reason: 'Severe Migraine', status: 'Approved' },
        { date: '2026-05-02', duration: '1 Day', type: 'Personal', reason: 'Family Function', status: isCritical ? 'Rejected (Repeated Requests)' : 'Approved' }
      ],
      lateArrivals: isCritical ? 8 : isExcellent ? 0 : 2,

      // Risk Status
      riskSeverity: isCritical ? 'CRITICAL RISK' : isNeedsReview ? 'WARN / NEEDS REVIEW' : 'EXCELLENT STANDING',
      riskColor: isCritical ? '#ef4444' : isNeedsReview ? '#f59e0b' : '#10b981',
      facilitatorRecommendation: isCritical 
        ? 'Mandatory 1-on-1 counseling session required. Block next module admission until assessment is cleared. Send official warning letter to guardian.' 
        : isNeedsReview 
          ? 'Assign supplementary assignments on React hooks. Recommend attending peer scrum sessions.' 
          : 'Excellent progress. Nominate for student peer facilitator role to guide junior students.',
      suggestedActions: isCritical 
        ? ['Schedule Mandatory 1-on-1', 'Lock Next Module', 'Send Warning Notification'] 
        : isNeedsReview 
          ? ['Assign Supplementary Task', 'Recommend Peer Group'] 
          : ['Nominate for Peer Mentor', 'Grant Module Acceleration']
    };
  };

  const details = getStudentSpecificDetails();

  // LeetCode Stats Generator
  const getLeetcodeStats = () => {
    if (studentId === 2) {
      return { solved: 62, easy: 58, medium: 4, hard: 0 };
    }
    const health = studentInfo.academicHealth;
    const isCritical = health === 'Critical Risk' || parseInt(studentInfo.attendance) < 75;
    const isExcellent = health === 'Excellent';
    
    if (isExcellent) {
      return { solved: 148, easy: 102, medium: 38, hard: 8 };
    } else if (isCritical) {
      return { solved: 14, easy: 12, medium: 2, hard: 0 };
    } else {
      return { solved: 48, easy: 40, medium: 8, hard: 0 };
    }
  };

  const leetcode = getLeetcodeStats();
  const githubContributionsCount = studentId === 2 
    ? 159 
    : studentInfo.academicHealth === 'Excellent' 
      ? 312 
      : studentInfo.academicHealth === 'Critical Risk' || parseInt(studentInfo.attendance) < 75
        ? 18 
        : 85;

  // Dossier Edit state
  const [isEditDossierOpen, setIsEditDossierOpen] = useState(false);
  const [dossierForm, setDossierForm] = useState({ phone: '', address: '', emergencyContact: '' });
  const [isSavingDossier, setIsSavingDossier] = useState(false);
  const [dossierError, setDossierError] = useState(null);

  const handleOpenEditDossier = () => {
    setDossierForm({
      phone: details.phone || '',
      address: details.address || '',
      emergencyContact: details.emergencyContact || ''
    });
    setDossierError(null);
    setIsEditDossierOpen(true);
  };

  const handleSaveDossier = async (e) => {
    e.preventDefault();
    setIsSavingDossier(true);
    setDossierError(null);
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      if (isObjectId) {
        await updateUser(id, dossierForm);
      }
      
      const updatedRoster = roster.map(s => {
        if (s._id === id || s.id === studentId) {
          return {
            ...s,
            phone: dossierForm.phone,
            address: dossierForm.address,
            emergencyContact: dossierForm.emergencyContact
          };
        }
        return s;
      });
      setRoster(updatedRoster);
      localStorage.setItem('staxhaus_students', JSON.stringify(updatedRoster));
      setIsEditDossierOpen(false);
    } catch (err) {
      console.error('Failed to update student profile:', err);
      setDossierError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSavingDossier(false);
    }
  };

  // Local state for Facilitator Notes
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`staxhaus_profile_notes_${studentId}`);
    if (saved) return JSON.parse(saved);
    
    // Seed initial remarks
    const initialRemarks = [
      { id: 1, date: '2026-05-19', author: 'Facilitator Anand', content: studentInfo.academicHealth === 'Critical Risk' ? 'Extreme lack of participation. Attendance is far below minimum requirements. Multiple blockers reported but did not seek help.' : 'Demonstrates great technical depth and assists peers during scrum. Highly regular and recommended for leadership tasks.' },
      { id: 2, date: '2026-05-12', author: 'Interviewer Siddharth', content: studentInfo.academicHealth === 'Critical Risk' ? 'Needs significant improvement in basics of Javascript and React.' : 'Cleared technical mock with high performance. Coding conventions are clean.' }
    ];
    localStorage.setItem(`staxhaus_profile_notes_${studentId}`, JSON.stringify(initialRemarks));
    return initialRemarks;
  });

  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      author: 'Facilitator Anand', // Logged in user mock
      content: newNote.trim()
    };
    
    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem(`staxhaus_profile_notes_${studentId}`, JSON.stringify(updated));
    setNewNote('');
  };

  const handleEditNote = (noteId, content) => {
    setEditingNoteId(noteId);
    setEditText(content);
  };

  const handleSaveEditNote = (noteId) => {
    const updated = notes.map(n => n.id === noteId ? { ...n, content: editText } : n);
    setNotes(updated);
    localStorage.setItem(`staxhaus_profile_notes_${studentId}`, JSON.stringify(updated));
    setEditingNoteId(null);
    setEditText('');
  };

  const handleDeleteNote = (noteId) => {
    const updated = notes.filter(n => n.id !== noteId);
    setNotes(updated);
    localStorage.setItem(`staxhaus_profile_notes_${studentId}`, JSON.stringify(updated));
  };

  // Status Action (Warn, Suspend, Terminate) directly from profile
  const handleUpdateStatus = async (newStatus, healthChange = null) => {
    const updatedRoster = roster.map(s => {
      if (s.id === studentId || (s._id && s._id === id)) {
        return {
          ...s,
          status: newStatus,
          ...(healthChange ? { academicHealth: healthChange } : {})
        };
      }
      return s;
    });
    setRoster(updatedRoster);
    localStorage.setItem('staxhaus_students', JSON.stringify(updatedRoster));

    // Call backend API if it's a real db student (MongoDB ObjectId)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (isObjectId) {
      let backendStatus = '';
      if (newStatus === 'Active') backendStatus = 'active';
      else if (newStatus === 'Suspended') backendStatus = 'discontinued';
      else if (newStatus === 'Terminated') backendStatus = 'terminated';

      if (backendStatus) {
        try {
          await changeStudentStatus(id, {
            status: backendStatus,
            remark: `Status changed to ${newStatus} from Student Operational Dossier profile panel.`
          });
        } catch (err) {
          console.error("Failed to update student status in backend:", err);
        }
      }
    }
  };

  // Generate heatmap items based on the selected month
  const renderHeatmap = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isCritical = parseInt(studentInfo.attendance) < 75;
    const items = [];
    for (let i = 1; i <= daysInMonth; i++) {
      let type = 'present';
      if (isCritical) {
        if ((i + month) % 3 === 0) type = 'absent';
        else if ((i + month) % 7 === 0) type = 'leave';
      } else {
        if ((i * (month + 1)) % 15 === 0) type = 'leave';
        else if ((i * (month + 2)) % 24 === 0) type = 'absent';
      }
      items.push(type);
    }

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 1.2, mt: 1.5, width: '100%', maxWidth: '380px' }}>
        {items.map((type, idx) => (
          <Tooltip key={idx} title={`Day ${idx + 1}: ${type.toUpperCase()}`}>
            <Box
              sx={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: '6px',
                bgcolor: 
                  type === 'present' ? '#22c55e' : // Pure green color
                  type === 'absent' ? '#ef4444' : '#f59e0b',
                opacity: 0.9,
                transition: 'transform 0.15s',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.15)', opacity: 1 }
              }}
            />
          </Tooltip>
        ))}
      </Box>
    );
  };

  // Generate GitHub contributions grid
  const renderGithubGrid = () => {
    const rows = 7;
    const cols = 45;
    const grid = [];
    
    const isCritical = studentInfo.academicHealth === 'Critical Risk' || parseInt(studentInfo.attendance) < 75;
    
    for (let r = 0; r < rows; r++) {
      const rowCells = [];
      for (let c = 0; c < cols; c++) {
        let level = 0;
        
        if (!isCritical) {
          // Create clusters matching Ananya's profile or general standing
          if (c >= 10 && c <= 13) {
            if ((r + c) % 3 === 0) level = 1;
            else if ((r * c) % 5 === 0) level = 2;
          }
          if (c >= 17 && c <= 20) {
            if ((r + c) % 4 === 0) level = 2;
            else if ((r * c) % 3 === 0) level = 3;
            else if (r === 2 || r === 5) level = 1;
          }
          if (c >= 30 && c <= 34) {
            if ((r + c) % 2 === 0) level = 3;
            else if ((r * c) % 3 === 0) level = 4;
            else level = 2;
          }
          if (c % 8 === 0 && r % 3 === 0 && level === 0) level = 1;
          if (c % 11 === 0 && r % 4 === 0 && level === 0) level = 2;
        } else {
          // Critical risk has very few dots
          if (c === 5 && r === 2) level = 1;
          if (c === 15 && r === 4) level = 2;
          if (c === 32 && r === 1) level = 1;
        }
        
        rowCells.push(level);
      }
      grid.push(rowCells);
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '2px' } }}>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-[4px] justify-between min-w-[550px]">
            {Array.from({ length: cols }).map((_, cIdx) => {
              const lvl = grid[rIdx][cIdx];
              return (
                <Box
                  key={cIdx}
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    bgcolor: 
                      lvl === 1 ? '#9be9a8' :
                      lvl === 2 ? '#40c463' :
                      lvl === 3 ? '#30a14e' :
                      lvl === 4 ? '#216e39' : '#ebedf0',
                    transition: 'transform 0.1s',
                    '&:hover': { transform: 'scale(1.25)', zIndex: 10 }
                  }}
                />
              );
            })}
          </div>
        ))}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell fullWidth={true}>
        <Box sx={{ px: 4, pt: 3, pb: 8, bgcolor: '#F7F7F5', minHeight: '100vh' }}>
          
          {/* Header Actions / Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Breadcrumbs separator=">" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/dashboard"
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  DASHBOARD
                </MuiLink>
                <MuiLink
                  component={Link}
                  to="/student-management"
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  STUDENT MANAGEMENT
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  STUDENT OPERATIONAL PROFILE
                </Typography>
              </Breadcrumbs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => navigate('/student-management')} sx={{ bgcolor: 'white', border: '1px solid #E5E7EB', p: 0.75, borderRadius: '8px' }}>
                  <ArrowBack sx={{ fontSize: 18, color: '#1E2126' }} />
                </IconButton>
                <Typography variant="h5" fontWeight={900} sx={{ color: '#1E2126', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                  Student Dossier
                </Typography>
              </Box>
            </Box>
            
            {/* Quick Status Enforcer Buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleUpdateStatus('Active', 'Good Standing')}
                disabled={studentInfo.status === 'Active'}
                sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#10b981', borderColor: '#10b981' }}
              >
                Mark Active
              </Button>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => handleUpdateStatus('Suspended', 'Needs Review')}
                disabled={studentInfo.status === 'Suspended'}
                sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
              >
                Suspend
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleUpdateStatus('Terminated', 'Critical Risk')}
                disabled={studentInfo.status === 'Terminated'}
                sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
              >
                Terminate
              </Button>
            </Stack>
          </Box>

          {/* 1. TOP PROFILE HERO SECTION */}
          <Card sx={{ mb: 4, overflow: 'visible', position: 'relative', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="stretch">
                
                {/* Left Side: Avatar and Quick Metadata */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 3.5 }}>
                    <Box sx={{ position: 'relative', '&:hover .upload-btn': { opacity: 1 } }}>
                      <Avatar
                        src={studentInfo.profilePic}
                        sx={{
                          width: 88,
                          height: 88,
                          bgcolor: studentInfo.status === 'Terminated' ? '#ef4444' : studentInfo.status === 'Suspended' ? '#f59e0b' : '#1E2126',
                          fontSize: '2.5rem',
                          fontWeight: 900,
                          borderRadius: '16px',
                          fontFamily: 'Outfit',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                      >
                        {studentInfo.name[0]}
                      </Avatar>

                      {/* Upload hover overlay */}
                      <Tooltip title="Change Photo">
                        <Box
                          className="upload-btn"
                          onClick={() => fileInputRef.current.click()}
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '16px',
                            bgcolor: 'rgba(0,0,0,0.55)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                          }}
                        >
                          {isUploading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                          ) : (
                            <PhotoCamera sx={{ color: 'white', fontSize: 24 }} />
                          )}
                        </Box>
                      </Tooltip>

                      <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Box>
                    
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E2126', fontFamily: 'Outfit' }}>
                          {studentInfo.name}
                        </Typography>
                        <Chip
                          label={studentInfo.status}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.675rem',
                            height: '20px',
                            bgcolor: 
                              studentInfo.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 
                              studentInfo.status === 'Terminated' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: 
                              studentInfo.status === 'Active' ? '#10b981' : 
                              studentInfo.status === 'Terminated' ? '#ef4444' : '#f59e0b',
                            borderRadius: '6px'
                          }}
                        />
                      </Stack>
                      
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }} sx={{ color: '#4b5563', fontSize: '0.85rem', mt: 1.5, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email sx={{ fontSize: 16, color: '#9ca3af' }} />
                          <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>
                            {studentInfo.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Badge sx={{ fontSize: 16, color: '#9ca3af' }} />
                          <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500, fontSize: '0.85rem' }}>
                            ID: <strong>{details.studentCode}</strong>
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1.2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Chip label={`Batch: ${studentInfo.batch}`} size="small" sx={{ fontWeight: 800, borderRadius: '4px', bgcolor: '#FEE2E2', color: '#EF4444', height: '24px', fontSize: '0.75rem' }} />
                        <Chip label={studentInfo.course} size="small" sx={{ fontWeight: 700, borderRadius: '4px', bgcolor: '#F3F4F6', color: '#4B5563', height: '24px', fontSize: '0.75rem' }} />
                        <Chip label={details.currentModule} size="small" sx={{ fontWeight: 800, borderRadius: '4px', bgcolor: '#1E2126', color: 'white', height: '24px', fontSize: '0.75rem' }} />
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Right Side: Profile Information Dossier */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ borderLeft: { xs: 'none', md: '1px solid rgba(0,0,0,0.06)' }, pl: { xs: 0, md: 4 }, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1E2126', fontFamily: 'Outfit', fontSize: '0.85rem' }}>
                        Profile Information Dossier
                      </Typography>
                      <Tooltip title="Edit Dossier">
                        <IconButton 
                          size="small" 
                          onClick={handleOpenEditDossier}
                          sx={{ 
                            color: '#1E2126', 
                            p: 0.5,
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } 
                          }}
                        >
                          <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />
                    
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Phone sx={{ color: '#9ca3af', fontSize: 16, mt: 0.2 }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>CONTACT PHONE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E2126', fontSize: '0.825rem' }}>{details.phone}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <LocationOn sx={{ color: '#9ca3af', fontSize: 16, mt: 0.2 }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>ADDRESS</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E2126', fontSize: '0.8rem', lineHeight: 1.35 }}>{details.address}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <ContactPhone sx={{ color: '#9ca3af', fontSize: 16, mt: 0.2 }} />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>EMERGENCY PHONE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E2126', fontSize: '0.8rem' }}>{details.emergencyContact}</Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ borderStyle: 'dashed', my: 0.5, borderColor: 'rgba(0,0,0,0.1)' }} />

                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>DEPARTMENT</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E2126', fontSize: '0.8rem' }}>{details.department}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>JOINED DATE</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E2126', fontSize: '0.8rem' }}>{studentInfo.joinDate}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>STANDING</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: studentInfo.academicHealth === 'Critical Risk' ? '#EF4444' : studentInfo.academicHealth === 'Needs Review' ? '#F59E0B' : '#10B981', fontSize: '0.8rem' }}>
                            {studentInfo.academicHealth}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', fontSize: '0.625rem' }}>TRACK</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E2126', fontSize: '0.8rem' }}>
                            {studentInfo.course.split(' ')[0]} Specialist
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

              </Grid>
            </CardContent>
          </Card>

          {/* 1.5. OPERATIONAL SUMMARY KPI CARDS ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { 
                label: 'Attendance', 
                labelSuffix: '%', 
                value: studentInfo.attendance, 
                trend: parseInt(studentInfo.attendance) >= 75 ? 'Healthy' : 'Deficit', 
                trendColor: parseInt(studentInfo.attendance) >= 75 ? '#10b981' : '#ef4444', 
                percent: parseInt(studentInfo.attendance) 
              },
              { 
                label: 'Interview Score', 
                labelSuffix: '', 
                value: details.interviewScore, 
                trend: details.interviewScoreTrend, 
                trendColor: parseFloat(details.interviewScore) >= 7.0 ? '#10b981' : '#ef4444', 
                percent: parseFloat(details.interviewScore) * 10 
              },
              { 
                label: 'Scrum Status', 
                labelSuffix: '', 
                value: details.scrumConsistency, 
                trend: details.scrumTrend === 'Optimal' ? 'Optimal' : details.scrumTrend === 'Critical Lag' ? 'Critical' : 'Warning', 
                trendColor: details.scrumTrend === 'Optimal' ? '#10b981' : details.scrumTrend === 'Critical Lag' ? '#ef4444' : '#f59e0b', 
                percent: parseInt(details.scrumConsistency) 
              },
              { 
                label: 'Leave Count', 
                labelSuffix: '', 
                value: `${details.leaveCount} DAYS`, 
                trend: details.leaveTrend === 'Normal' ? 'Normal' : 'Frequent', 
                trendColor: details.leaveCount > 4 ? '#ef4444' : '#9ca3af', 
                percent: Math.max(0, 100 - (details.leaveCount * 15)) 
              }
            ].map((card, i) => (
              <Card key={i} sx={{ bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', boxShadow: 'none' }}>
                <CardContent sx={{
                  p: 3,
                  '&:last-child': { pb: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.675rem' }}>
                      {card.label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: card.trendColor, fontSize: '0.675rem', textTransform: 'uppercase' }}>
                      {card.label === 'Attendance' ? `%${card.trend}` : card.trend}
                    </Typography>
                  </Box>
                  <Box sx={{ my: 0.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E2126', fontSize: '1.75rem', fontFamily: 'Outfit' }}>
                      {card.value}
                    </Typography>
                  </Box>
                  {/* Progress bar line */}
                  <Box sx={{ width: '80%', height: 4, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ width: `${Math.min(100, Math.max(0, card.percent))}%`, height: '100%', bgcolor: card.trendColor }} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* MAIN WIDGETS ROW-BY-ROW GRID */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* ROW 1: Academic Performance & Operational Risk Advisory (2/3 & 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Academic Analytics */}
              <div className="lg:col-span-2">
                <Card sx={{ bgcolor: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E2126' }}>
                        Academic Performance & Attendance Trends
                      </Typography>
                    </Box>
                    <Chip label={`Technical Standing: ${details.technicalRating}`} size="small" sx={{ fontWeight: 800, borderRadius: '4px', bgcolor: 'rgba(59, 130, 246, 0.08)', color: '#1d4ed8' }} />
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Grid container spacing={3}>
                      {/* Left: Progress gauges */}
                      <Grid item xs={12} sm={5}>
                        <Stack spacing={2.5}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: '#4b5563' }}>Module Completion Progress</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>{details.moduleCompletion}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={details.moduleCompletion} sx={{ height: 6, borderRadius: 3, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} />
                          </Box>

                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: '#4b5563' }}>Assignment Completion Rate</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981' }}>{details.assignmentRate}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={details.assignmentRate} sx={{ height: 6, borderRadius: 3, bgcolor: '#f3f4f6', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                          </Box>

                          <Box sx={{ pt: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                              MOCK INTERVIEW TOPIC RATINGS
                            </Typography>
                            <Stack spacing={1.2}>
                              {details.mockInterviewScores.map((score, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="caption" sx={{ width: 85, fontWeight: 600, color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {score.topic}
                                  </Typography>
                                  <Box sx={{ flexGrow: 1, height: 4, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                                    <Box sx={{ width: `${score.score}%`, height: '100%', bgcolor: score.score >= 80 ? '#10b981' : score.score >= 60 ? '#f59e0b' : '#ef4444' }} />
                                  </Box>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E2126', minWidth: 25, textAlign: 'right' }}>
                                    {score.score}%
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Right: Recharts Trend Line */}
                      <Grid item xs={12} sm={7}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                            WEEKLY ATTENDANCE MONITOR (5-WEEK ROLLING)
                          </Typography>
                          <Box sx={{ width: '100%', height: 160 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={details.weeklyAttendance} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E8391D" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#E8391D" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="week" stroke="#9CA3AF" fontSize={10} fontWeight={600} tickLine={false} />
                                <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} fontWeight={600} tickLine={false} />
                                <RechartsTooltip contentStyle={{ fontSize: '0.75rem', borderRadius: 8 }} />
                                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#E8391D" strokeWidth={2} fillOpacity={1} fill="url(#colorAttendance)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Advisory */}
              <div className="lg:col-span-1">
                <Card sx={{ bgcolor: 'white', borderLeft: `5px solid ${details.riskColor}`, height: '100%' }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WarningAmber sx={{ color: details.riskColor }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E2126' }}>
                          Operational Risk Advisory
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 1.5 }}>
                        <Chip
                          label={details.riskSeverity}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            fontSize: '0.7rem',
                            bgcolor: `${details.riskColor}15`,
                            color: details.riskColor,
                            px: 1
                          }}
                        />
                      </Box>

                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                        FACILITATOR INTERVENTION DIRECTIVE:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.775rem', lineHeight: 1.4, bgcolor: '#F9FAFB', p: 1.5, borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                        {details.facilitatorRecommendation}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                        SUGGESTED DISCIPLINARY ACTIONS
                      </Typography>
                      <Stack spacing={1}>
                        {details.suggestedActions.map((action, i) => (
                          <Button
                            key={i}
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              bgcolor: '#1E2126',
                              color: 'white',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              py: 0.5,
                              boxShadow: 'none',
                              borderRadius: '6px',
                              '&:hover': { bgcolor: '#0f1113', boxShadow: 'none' }
                            }}
                          >
                            {action}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* ROW 2: Attendance Heatmap & Leaves Monitor (Full Width) */}
            <div className="w-full">
              {/* Attendance & Heatmap */}
              <Card sx={{ bgcolor: 'white' }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E2126' }}>
                      Attendance Intelligence & Leaves Monitor
                    </Typography>
                  </Box>
                  <Chip label={`Late Arrivals: ${details.lateArrivals}`} size="small" sx={{ fontWeight: 800, borderRadius: '4px', bgcolor: details.lateArrivals > 5 ? 'rgba(239, 68, 68, 0.08)' : '#f3f4f6', color: details.lateArrivals > 5 ? '#ef4444' : '#4b5563' }} />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Left: Heatmap Grid */}
                    <div className="w-full">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#9ca3af', letterSpacing: '0.05em' }}>
                          MONTHLY ATTENDANCE HEATMAP
                        </Typography>
                        
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton 
                            onClick={handlePrevMonth} 
                            size="small"
                            sx={{ 
                              width: 32,
                              height: 32,
                              border: '1px solid #E5E7EB', 
                              bgcolor: 'white',
                              borderRadius: '50%',
                              color: '#9CA3AF',
                              transition: 'all 0.2s',
                              '&:hover': { bgcolor: '#F3F4F6', color: '#1E2126', borderColor: '#929292' }
                            }}
                          >
                            <ChevronLeft sx={{ fontSize: 18 }} />
                          </IconButton>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            px: 1.5, 
                            py: 0.5, 
                            height: 32,
                            border: '1px solid #E5E7EB', 
                            borderRadius: '8px', 
                            bgcolor: 'white' 
                          }}>
                            <CalendarMonth sx={{ fontSize: 16, color: '#E8391D' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0b57d0', fontSize: '0.725rem', letterSpacing: '0.02em', fontFamily: 'Outfit' }}>
                              {getMonthYearString()}
                            </Typography>
                          </Box>
                          
                          <IconButton 
                            onClick={handleNextMonth} 
                            size="small"
                            sx={{ 
                              width: 32,
                              height: 32,
                              border: '1px solid #E5E7EB', 
                              bgcolor: 'white',
                              borderRadius: '50%',
                              color: '#9CA3AF',
                              transition: 'all 0.2s',
                              '&:hover': { bgcolor: '#F3F4F6', color: '#1E2126', borderColor: '#929292' }
                            }}
                          >
                            <ChevronRight sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </Box>
                      {renderHeatmap()}
                      
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 10, height: 10, bgcolor: '#22c55e', borderRadius: '3px' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280' }}>Present</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 10, height: 10, bgcolor: '#ef4444', borderRadius: '3px' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280' }}>Absent</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 10, height: 10, bgcolor: '#f59e0b', borderRadius: '3px' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280' }}>Leave</Typography>
                        </Box>
                      </Stack>

                      {parseInt(studentInfo.attendance) < 75 && (
                        <Alert severity="error" sx={{ mt: 2.5, borderRadius: '8px', py: 0.25, px: 1.5, '& .MuiAlert-icon': { fontSize: 16 } }}>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>
                            Attendance under 75% threshold
                          </Typography>
                        </Alert>
                      )}
                    </div>

                    {/* Right: Leave History Table */}
                    <div className="w-full">
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                        LEAVE RECORD BREAKDOWN
                      </Typography>
                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', width: '100%' }}>
                        <Table size="small" sx={{ width: '100%' }}>
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.01)' }}>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.625rem', py: 1.25 }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.625rem', py: 1.25 }}>Type</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.625rem', py: 1.25 }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {details.leavesHistory.map((leave, idx) => (
                              <TableRow key={idx}>
                                <TableCell sx={{ py: 1.25, fontSize: '0.725rem', color: '#1E2126' }}>{leave.date}</TableCell>
                                <TableCell sx={{ py: 1.25, fontSize: '0.725rem', color: '#4b5563' }}>{leave.type}</TableCell>
                                <TableCell sx={{ py: 1.25 }}>
                                  <Chip
                                    label={leave.status.split(' ')[0]}
                                    size="small"
                                    sx={{
                                      height: 18,
                                      fontSize: '0.625rem',
                                      fontWeight: 700,
                                      bgcolor: leave.status.includes('Approved') ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                      color: leave.status.includes('Approved') ? '#047857' : '#ef4444'
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROW 2.5: GitHub Contributions & LeetCode Statistics (2/3 & 1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* GitHub Contribution Heatmap */}
              <div className="lg:col-span-2">
                <Card sx={{ bgcolor: 'white', height: '100%' }}>
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: '#1E2126', mb: 2, letterSpacing: 'normal', fontFamily: 'Outfit' }}>
                      Github Contribution
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full max-w-[650px]">
                        {/* Month labels */}
                        <div className="flex justify-between pl-2 pr-2 mb-2 text-[10px] font-bold text-gray-500 min-w-[550px] select-none">
                          <span>Jun</span>
                          <span>Jul</span>
                          <span>Aug</span>
                          <span>Sep</span>
                          <span>Oct</span>
                          <span>Nov</span>
                          <span>Dec</span>
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                        </div>
                        {/* Heatmap Grid */}
                        {renderGithubGrid()}
                        {/* Bottom stats & legend */}
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500 min-w-[550px] px-1 select-none">
                          <span className="font-semibold">{githubContributionsCount} contributions in the last year</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold">Less</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ebedf0]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#9be9a8]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#40c463]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#30a14e]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#216e39]" />
                            <span className="text-[10px] font-bold">More</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* LeetCode stats */}
              <div className="lg:col-span-1">
                <Card sx={{ bgcolor: '#1E2126', color: 'white', height: '100%' }}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2.5">
                        <svg viewBox="0 0 24 24" width="22" height="22" style={{ fill: 'none', stroke: '#FFA116', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', marginTop: '2px' }}>
                          <path d="M16 8 L8 12 L16 16" />
                          <path d="M12 4 A 8 8 0 1 0 12 20" strokeDasharray="38, 12" />
                        </svg>
                        <div>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                            Leetcode
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600 }}>
                            statics
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 items-center my-4">
                      {/* Large count */}
                      <div className="col-span-2">
                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', lineHeight: 1, fontFamily: 'Outfit' }}>
                          {leetcode.solved}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, display: 'block', mt: 0.5, lineHeight: 1.2 }}>
                          Solved<br/>Problems
                        </Typography>
                      </div>

                      {/* Right breakdown */}
                      <div className="col-span-3 border-l border-gray-700 pl-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 600 }}>Easy</Typography>
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 800 }}>{leetcode.easy}</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 600 }}>Medium</Typography>
                          <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 800 }}>{leetcode.medium}</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 600 }}>Hard</Typography>
                          <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 800 }}>{leetcode.hard}</Typography>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* ROW 3: Interview History (Full Width) */}
            <div className="w-full">
              <Card sx={{ bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E2126' }}>
                      Interview & Assessment Evaluation History
                    </Typography>
                  </Box>
                  <Chip label={`Status: ${studentInfo.interviewStatus}`} size="small" sx={{ fontWeight: 800, borderRadius: '4px', bgcolor: '#1E2126', color: 'white' }} />
                </Box>
                <CardContent sx={{ p: 0 }}>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', bgcolor: 'rgba(0,0,0,0.01)' }}>
                          <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.625rem', py: 1, pl: 3 }}>Assessment Round</TableCell>
                          <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.625rem', py: 1 }}>Interviewer</TableCell>
                          <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.625rem', py: 1 }}>Result</TableCell>
                          <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.625rem', py: 1, pr: 3 }}>Interviewer Remarks</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {details.interviewList.map((interview, idx) => (
                          <TableRow key={idx} sx={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                            <TableCell sx={{ py: 1.25, pl: 3, fontWeight: 700, fontSize: '0.75rem', color: '#1E2126' }}>
                              {interview.round}
                            </TableCell>
                            <TableCell sx={{ py: 1.25, fontSize: '0.75rem', color: '#4b5563' }}>
                              {interview.interviewer} <span className="text-gray-400 text-xs block">{interview.date}</span>
                            </TableCell>
                            <TableCell sx={{ py: 1.25 }}>
                              <Chip
                                label={interview.status}
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: '0.575rem',
                                  fontWeight: 700,
                                  bgcolor: interview.status === 'Pass' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                  color: interview.status === 'Pass' ? '#047857' : '#ef4444'
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1.25, pr: 3, fontSize: '0.725rem', color: '#6b7280', maxWidth: '350px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'normal', lineHeight: 1.3 }}>
                              {interview.feedback}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </div>

            {/* ROW 4: Chronological Notes (Form and Feed side-by-side inside notes card!) */}
            <Card sx={{ bgcolor: 'white' }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddComment sx={{ color: 'primary.main', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1E2126' }}>
                    Chronological Facilitator Notes
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Notes Form */}
                  <div className="lg:col-span-1 flex flex-col justify-between">
                    <Box component="form" onSubmit={handleAddNote} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                          ADD PROFESSIONAL OBSERVATION
                        </Typography>
                        <TextField
                          placeholder="Log professional updates, behavioral warnings, or progress remarks..."
                          multiline
                          rows={4}
                          fullWidth
                          size="small"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              bgcolor: '#F9FAFB'
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="small"
                          disabled={!newNote.trim()}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            py: 0.75,
                            px: 2.5,
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#b91c1c', boxShadow: 'none' }
                          }}
                        >
                          Log Note
                        </Button>
                      </Box>
                    </Box>
                  </div>

                  {/* Right Notes feed list */}
                  <div className="lg:col-span-2 border-l border-gray-100 pl-0 lg:pl-6">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                      LOGGED NOTES TIMELINE
                    </Typography>
                    <Stack spacing={1.5} sx={{ maxHeight: '240px', overflowY: 'auto', pr: 0.5 }}>
                      {notes.map((note) => (
                        <Box
                          key={note.id}
                          sx={{
                            p: 1.5,
                            borderRadius: '8px',
                            bgcolor: '#F9FAFB',
                            border: '1px solid rgba(0,0,0,0.03)'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E2126', display: 'block' }}>
                                {note.author}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.625rem' }}>
                                Logged on {note.date}
                              </Typography>
                            </Box>
                            
                            {/* Edit / Delete Actions */}
                            <Stack direction="row" spacing={0.5}>
                              {editingNoteId === note.id ? (
                                <IconButton size="small" onClick={() => handleSaveEditNote(note.id)} sx={{ p: 0.5, color: '#10b981' }}>
                                  <Check sx={{ fontSize: 13 }} />
                                </IconButton>
                              ) : (
                                <IconButton size="small" onClick={() => handleEditNote(note.id, note.content)} sx={{ p: 0.5, color: '#9ca3af' }}>
                                  <Edit sx={{ fontSize: 12 }} />
                                </IconButton>
                              )}
                              <IconButton size="small" onClick={() => handleDeleteNote(note.id)} sx={{ p: 0.5, color: '#ef4444' }}>
                                  <Delete sx={{ fontSize: 12 }} />
                              </IconButton>
                            </Stack>
                          </Box>

                          {editingNoteId === note.id ? (
                            <TextField
                              multiline
                              fullWidth
                              size="small"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.775rem', bgcolor: 'white' } }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.75rem', lineHeight: 1.4 }}>
                              {note.content}
                            </Typography>
                          )}
                        </Box>
                      ))}

                      {notes.length === 0 && (
                        <Typography variant="caption" align="center" sx={{ color: '#9ca3af', display: 'block', py: 2 }}>
                          No facilitator logs available for this student.
                        </Typography>
                      )}
                    </Stack>
                  </div>

                </div>
              </CardContent>
            </Card>

          </Box>
          
        </Box>

        {/* Edit Dossier Dialog */}
        <Dialog 
          open={isEditDossierOpen} 
          onClose={() => setIsEditDossierOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: '#1E2126', pb: 1 }}>
            Edit Profile Dossier
          </DialogTitle>
          <Box component="form" onSubmit={handleSaveDossier}>
            <DialogContent sx={{ pt: 1, pb: 2 }}>
              <Stack spacing={2.5}>
                {dossierError && (
                  <Alert severity="error" sx={{ borderRadius: '8px' }}>
                    {dossierError}
                  </Alert>
                )}
                
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', mb: 1, fontSize: '0.625rem' }}>
                    CONTACT PHONE
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={dossierForm.phone}
                    onChange={(e) => setDossierForm({ ...dossierForm, phone: e.target.value })}
                    placeholder="+91 974550006"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.825rem',
                        bgcolor: '#F9FAFB'
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', mb: 1, fontSize: '0.625rem' }}>
                    ADDRESS
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    value={dossierForm.address}
                    onChange={(e) => setDossierForm({ ...dossierForm, address: e.target.value })}
                    placeholder="No. 45, Crescent Heights, MG Road, Bengaluru"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.825rem',
                        bgcolor: '#F9FAFB'
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', display: 'block', mb: 1, fontSize: '0.625rem' }}>
                    EMERGENCY PHONE
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={dossierForm.emergencyContact}
                    onChange={(e) => setDossierForm({ ...dossierForm, emergencyContact: e.target.value })}
                    placeholder="M. Ali (Uncle) - +91 90082 11200"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        fontSize: '0.825rem',
                        bgcolor: '#F9FAFB'
                      }
                    }}
                  />
                </Box>
              </Stack>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button 
                onClick={() => setIsEditDossierOpen(false)}
                sx={{ 
                  color: '#4B5563', 
                  fontWeight: 700, 
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSavingDossier}
                variant="contained"
                sx={{ 
                  bgcolor: '#1E2126', 
                  color: 'white',
                  fontWeight: 700, 
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2,
                  '&:hover': { bgcolor: '#000000' }
                }}
              >
                {isSavingDossier ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </AppShell>
    </ThemeProvider>
  );
};

export default StudentProfile;
