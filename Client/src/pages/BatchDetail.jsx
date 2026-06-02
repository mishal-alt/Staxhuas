import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
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
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Badge,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  LinearProgress,
  Autocomplete
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import {
  Mail,
  PersonOff,
  PersonAdd,
  School,
  MoreVert,
  Search,
  ArrowBack,
  Send,
  NavigateNext,
  Add,
  CloudUpload,
  Group,
  TrendingUp,
  Layers,
  EventAvailable,
  CalendarToday,
  AccessTime,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  RadioButtonUnchecked,
  Save,
  Warning,
  HourglassEmpty,
  FilterList,
  Visibility,
  Close,
  CheckCircleOutlined,
  Cancel,
  EventBusy,
  PlayArrow,
  DoneAll,
  Stop,
  Assignment,
  EditNote,
  Block,
  Speed,
  KeyboardArrowDown,
  KeyboardArrowUp,
  VideoCameraFront,
  Assessment,
  FileDownload,
  Schedule,
  Repeat,
  HowToReg,
  Refresh,
  Delete,
  Edit
} from '@mui/icons-material';
import { toast } from "sonner";

import AppShell from '../components/layout/AppShell';
import * as batchApi from '../api/batches.api';
import * as studentApi from '../api/students.api';
import * as invitationApi from '../api/invitations.api';
import * as interviewApi from '../api/interview.api.js';
import * as usersApi from '../api/users.api.js';
import * as attendanceApi from '../api/attendance.api.js';
import * as scrumApi from '../api/scrum.api.js';
import * as leaveApi from '../api/leaves.api.js';
import { STUDENT_STATUS } from '../utils/constants';

const STATUS_MAP = {
  'P': 'present',
  'A': 'absent',
  'L': 'leave',
  'H': 'half_day'
};

const REVERSE_STATUS_MAP = {
  'present': 'P',
  'absent': 'A',
  'leave': 'L',
  'half_day': 'H'
};

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
          borderRadius: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
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
    }
  }
});

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const { data: batchRes, isLoading: batchLoading } = useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchApi.getBatch(id),
  });

  const { data: studentsRes, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', id],
    queryFn: () => studentApi.getStudentsByBatch(id),
  });

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [scrumCompleted, setScrumCompleted] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});

  const { data: attendanceRes, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', id, attendanceDate.toISOString().split('T')[0]],
    queryFn: () => attendanceApi.getAttendanceForDate(id, attendanceDate.toISOString().split('T')[0]),
    enabled: !!id,
  });

  const markSingleAttendanceMutation = useMutation({
    mutationFn: (data) => attendanceApi.markSingleAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', id, attendanceDate.toISOString().split('T')[0]] });
      toast.success('Attendance marked successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error marking attendance')
  });

  const bulkMarkAttendanceMutation = useMutation({
    mutationFn: (data) => attendanceApi.bulkMarkAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', id, attendanceDate.toISOString().split('T')[0]] });
      toast.success('Bulk attendance marked successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error marking bulk attendance')
  });

  React.useEffect(() => {
    if (attendanceRes?.data) {
      const newAttendanceMap = {};
      const newRemarksMap = {};
      attendanceRes.data.forEach(record => {
        newAttendanceMap[record.student._id] = REVERSE_STATUS_MAP[record.status];
        newRemarksMap[record.student._id] = record.remarks || '';
      });
      setAttendanceMap(newAttendanceMap);
      setRemarksMap(newRemarksMap);
    } else {
      setAttendanceMap({});
      setRemarksMap({});
    }
  }, [attendanceRes]);

  // Leaves state
  const { data: leavesRes, isLoading: leavesLoading } = useQuery({
    queryKey: ['leaves', id],
    queryFn: () => leaveApi.getLeaveRequests({ batch: id }),
    enabled: !!id,
  });

  const approveLeaveMutation = useMutation({
    mutationFn: (leaveId) => leaveApi.approveLeaveRequest({ id: leaveId, remarks: 'Approved from Batch Detail' }),
    onSuccess: () => {
      toast.success('Leave approved successfully');
      queryClient.invalidateQueries({ queryKey: ['leaves', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error approving leave')
  });

  const rejectLeaveMutation = useMutation({
    mutationFn: (leaveId) => leaveApi.rejectLeaveRequest({ id: leaveId, remarks: 'Rejected from Batch Detail' }),
    onSuccess: () => {
      toast.success('Leave rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['leaves', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error rejecting leave')
  });

  const cancelLeaveMutation = useMutation({
    mutationFn: (leaveId) => leaveApi.cancelLeaveRequest({ id: leaveId, remarks: 'Cancelled' }),
    onSuccess: () => {
      toast.success('Leave cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['leaves', id] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error cancelling leave')
  });
  const [leaveSearch, setLeaveSearch] = useState('');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('All');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('All');
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [leaveDetailOpen, setLeaveDetailOpen] = useState(false);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState(null);

  // Scrum Session State
  const [localScrumEntries, setLocalScrumEntries] = useState([]); // Array of { studentId, isPresent, yesterdayProgress, todayPlan, blockers, blockerStatus, actionItems }
  const [scrumEditModal, setScrumEditModal] = useState({ open: false, studentId: null, field: null, title: '' });
  const [scrumStatus, setScrumStatus] = useState('Not Started');
  const [scrumStartTime, setScrumStartTime] = useState(null);
  const [scrumData, setScrumData] = useState({});
  const [scrumDate, setScrumDate] = useState(new Date());
  const [scrumEditMode, setScrumEditMode] = useState(false);
  const [savingStudentId, setSavingStudentId] = useState(null);

  const { data: scrumsRes } = useQuery({
    queryKey: ['scrums', id],
    queryFn: () => scrumApi.getScrums(id),
    enabled: !!id,
  });

  const saveScrumMutation = useMutation({
    mutationFn: (data) => scrumApi.logScrum(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scrums', id] });
      if (variables.status === 'Completed') {
        queryClient.invalidateQueries({ queryKey: ['attendance', id, new Date().toISOString().split('T')[0]] });
        localStorage.removeItem(`scrum_draft_${id}`);
        toast.success('Daily Scrum Session Completed and Saved');
      } else {
        toast.success('Scrum progress saved to database');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving scrum session');
    }
  });

  const saveScrumDraft = (statusVal, startTimeVal, dataVal) => {
    try {
      const todayStr = new Date().toLocaleDateString();
      localStorage.setItem(`scrum_draft_${id}`, JSON.stringify({
        date: todayStr,
        status: statusVal,
        startTime: startTimeVal,
        data: dataVal
      }));
    } catch (e) {
      console.error('Error saving local scrum draft', e);
    }
  };

  // Helper to parse a scrum call document into scrumData map
  const parseScrumEntries = (scrumDoc) => {
    const result = {};
    scrumDoc.entries.forEach(entry => {
      const studentId = entry.student?._id || entry.student;
      let yesterday = '', today = '', status = 'No Update';
      if (entry.progressUpdate) {
        entry.progressUpdate.split('\n').forEach(line => {
          if (line.startsWith('Yesterday: ')) yesterday = line.replace('Yesterday: ', '');
          else if (line.startsWith('Today: ')) today = line.replace('Today: ', '');
          else if (line.startsWith('Status: ')) status = line.replace('Status: ', '');
        });
      }
      let blocker = 'No Issues', blockerNote = '';
      if (entry.blockers && !entry.blockers.startsWith('No Issues')) {
        const dashIndex = entry.blockers.indexOf(' - ');
        if (dashIndex !== -1) {
          blocker = entry.blockers.substring(0, dashIndex);
          blockerNote = entry.blockers.substring(dashIndex + 3);
        } else { blocker = entry.blockers; }
      }
      result[studentId] = { yesterday, today, blocker, blockerNote, notes: entry.actionItems || '', status };
    });
    return result;
  };

  React.useEffect(() => {
    if (scrumsRes?.data) {
      const selectedDateStr = scrumDate.toDateString();
      const matchingScrum = scrumsRes.data.find(s => new Date(s.date).toDateString() === selectedDateStr);
      const isToday = new Date().toDateString() === selectedDateStr;

      if (matchingScrum) {
        const dbStatus = matchingScrum.status || 'Completed';
        setScrumStatus(dbStatus);
        setScrumEditMode(false);
        if (matchingScrum.startTime) {
          setScrumStartTime(matchingScrum.startTime);
        } else if (matchingScrum.createdAt) {
          setScrumStartTime(new Date(matchingScrum.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        setScrumData(parseScrumEntries(matchingScrum));
        if (dbStatus === 'Completed' && isToday) {
          localStorage.removeItem(`scrum_draft_${id}`);
        }
      } else if (isToday) {
        // No DB scrum for today — try local draft
        try {
          const rawDraft = localStorage.getItem(`scrum_draft_${id}`);
          if (rawDraft) {
            const draft = JSON.parse(rawDraft);
            if (draft.date === new Date().toLocaleDateString()) {
              setScrumStatus(draft.status || 'Not Started');
              setScrumStartTime(draft.startTime || null);
              setScrumData(draft.data || {});
              setScrumEditMode(false);
              return;
            }
          }
        } catch (e) { console.error('Failed to parse local scrum draft', e); }
        setScrumStatus('Not Started');
        setScrumStartTime(null);
        setScrumData({});
        setScrumEditMode(false);
      } else {
        // Past date with no scrum
        setScrumStatus('No Record');
        setScrumStartTime(null);
        setScrumData({});
        setScrumEditMode(false);
      }
    }
  }, [scrumsRes, id, scrumDate]);

  const { data: interviewsRes, isLoading: interviewsLoading } = useQuery({
    queryKey: ['interviews', id],
    queryFn: () => interviewApi.getInterviews({ batch: id }),
  });

  const { data: interviewersRes } = useQuery({
    queryKey: ['interviewers'],
    queryFn: () => usersApi.getInterviewers(),
  });

  const scheduleMutation = useMutation({
    mutationFn: interviewApi.createInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', id] });
      toast.success('Interview scheduled successfully');
      setScheduleModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error scheduling interview')
  });

  const scoreMutation = useMutation({
    mutationFn: ({ intvId, data }) => interviewApi.recordScore(intvId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', id] });
      toast.success('Score recorded successfully');
      setScoreModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error recording score')
  });

  const reInterviewMutation = useMutation({
    mutationFn: ({ intvId, data }) => interviewApi.createReInterview(intvId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', id] });
      toast.success('Re-interview scheduled successfully');
      setReInterviewModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error scheduling re-interview')
  });

  const updateInterviewMutation = useMutation({
    mutationFn: ({ intvId, data }) => interviewApi.updateInterview(intvId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', id] });
      toast.success('Interview updated successfully');
      setScheduleModalOpen(false);
      setIsEditingInterview(false);
      setSelectedInterviewForEdit(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error updating interview')
  });

  const deleteInterviewMutation = useMutation({
    mutationFn: interviewApi.deleteInterview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews', id] });
      toast.success('Interview deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error deleting interview')
  });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [reInterviewModalOpen, setReInterviewModalOpen] = useState(false);
  const [selectedInterviewForScore, setSelectedInterviewForScore] = useState(null);
  const [isEditingInterview, setIsEditingInterview] = useState(false);
  const [selectedInterviewForEdit, setSelectedInterviewForEdit] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({ student: '', module: '', scheduledDate: '', scheduledTime: '', mode: 'online', interviewer: '', generateMeetLink: true });
  const [scoreForm, setScoreForm] = useState({ reviewScore: '', taskScore: '', attendanceScore: '', disciplineScore: '', facilitatorEvaluation: '', isPass: true, reInterviewAttempt: 0, maxReInterviewLimit: 2 });
  const [interviewSearch, setInterviewSearch] = useState('');
  const [interviewStatusFilter, setInterviewStatusFilter] = useState('All');
  const [interviewDetailModal, setInterviewDetailModal] = useState({ open: false, interview: null });

  const getInterviewStatusStyle = (status) => {
    switch (status) {
      case 'scheduled': return { bg: 'rgba(21,101,192,0.1)', color: '#1565c0', border: 'rgba(21,101,192,0.3)', label: 'Scheduled' };
      case 'in_progress': return { bg: 'rgba(156,39,176,0.1)', color: '#9c27b0', border: 'rgba(156,39,176,0.3)', label: 'In Progress' };
      case 'completed': return { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'rgba(46,125,50,0.3)', label: 'Completed' };
      case 'passed': return { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'rgba(46,125,50,0.3)', label: 'Passed' };
      case 'failed': return { bg: 'rgba(211,47,47,0.1)', color: '#d32f2f', border: 'rgba(211,47,47,0.3)', label: 'Failed' };
      case 're_interview_required': return { bg: 'rgba(211,47,47,0.1)', color: '#d32f2f', border: 'rgba(211,47,47,0.3)', label: 'Re-Interview Required' };
      default: return { bg: 'rgba(0,0,0,0.06)', color: '#666', border: 'transparent', label: 'Unknown' };
    }
  };

  const handleUpdateScrum = (studentId, field, value) => {
    setScrumData(prev => {
      const updated = {
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {
            yesterday: '',
            today: '',
            blocker: 'No Issues',
            blockerNote: '',
            notes: '',
            status: 'No Update'
          }),
          [field]: value
        }
      };
      saveScrumDraft(scrumStatus, scrumStartTime, updated);
      return updated;
    });
  };

  const getScrumStatusColor = (status) => {
    switch (status) {
      case 'On Track': return '#2e7d32';
      case 'Delayed': return '#ed6c02';
      case 'Blocked': return '#d32f2f';
      default: return '#9e9e9e';
    }
  };

  const startScrumSession = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setScrumStatus('In Progress');
    setScrumStartTime(timeStr);
    saveScrumDraft('In Progress', timeStr, scrumData);
    toast.success('Daily Scrum Session Started');
  };

  const buildScrumPayload = (statusVal, overrideDate) => {
    const targetDate = overrideDate || scrumDate;
    const entries = students.map((student) => {
      const data = scrumData[student._id] || {};
      const isPresent = attendanceMap[student._id] !== 'A';
      const yesterdayText = data.yesterday ? `Yesterday: ${data.yesterday}` : '';
      const todayText = data.today ? `Today: ${data.today}` : '';
      const statusText = data.status ? `Status: ${data.status}` : '';
      const progressUpdate = [yesterdayText, todayText, statusText].filter(Boolean).join('\n') || 'No Update';
      const blockers = data.blocker !== 'No Issues'
        ? `${data.blocker}${data.blockerNote ? ` - ${data.blockerNote}` : ''}`
        : 'No Issues';
      return { student: student._id, isPresent, progressUpdate, blockers, actionItems: data.notes || '' };
    });
    return {
      batch: id,
      date: targetDate.toISOString(),
      agenda: `Daily Morning Scrum - ${targetDate.toLocaleDateString()}`,
      status: statusVal,
      startTime: scrumStartTime,
      entries
    };
  };

  const handleSaveProgress = () => {
    const payload = buildScrumPayload('In Progress');
    if (payload.entries.length === 0) { toast.error('No students in batch to log scrum call.'); return; }
    saveScrumMutation.mutate(payload);
  };

  const completeScrumSession = () => {
    const payload = buildScrumPayload('Completed');
    if (payload.entries.length === 0) { toast.error('No students in batch to log scrum call.'); return; }
    saveScrumMutation.mutate(payload);
    setScrumEditMode(false);
  };

  const restartScrumSession = () => {
    setScrumStatus('Not Started');
    setScrumStartTime(null);
    setScrumData({});
    setScrumEditMode(false);
    localStorage.removeItem(`scrum_draft_${id}`);
    toast.success('Scrum session restarted');
  };

  const handleSaveStudentRow = async (student) => {
    if (students.length === 0) { toast.error('No students found.'); return; }
    setSavingStudentId(student._id);
    const data = scrumData[student._id] || {};
    const isPresent = attendanceMap[student._id] !== 'A';
    const yesterdayText = data.yesterday ? `Yesterday: ${data.yesterday}` : '';
    const todayText = data.today ? `Today: ${data.today}` : '';
    const statusText = data.status ? `Status: ${data.status}` : '';
    const progressUpdate = [yesterdayText, todayText, statusText].filter(Boolean).join('\n') || 'No Update';
    const blockers = data.blocker !== 'No Issues'
      ? `${data.blocker}${data.blockerNote ? ` - ${data.blockerNote}` : ''}`
      : 'No Issues';
    // Build full payload (upsert) with all students, patching this student's data
    const allEntries = students.map((s) => {
      const d = scrumData[s._id] || {};
      const sYesterday = d.yesterday ? `Yesterday: ${d.yesterday}` : '';
      const sToday = d.today ? `Today: ${d.today}` : '';
      const sStatusText = d.status ? `Status: ${d.status}` : '';
      const sProgress = [sYesterday, sToday, sStatusText].filter(Boolean).join('\n') || 'No Update';
      const sBlockers = d.blocker !== 'No Issues'
        ? `${d.blocker}${d.blockerNote ? ` - ${d.blockerNote}` : ''}`
        : 'No Issues';
      return { student: s._id, isPresent: attendanceMap[s._id] !== 'A', progressUpdate: sProgress, blockers: sBlockers, actionItems: d.notes || '' };
    });
    const payload = {
      batch: id,
      date: scrumDate.toISOString(),
      agenda: `Daily Morning Scrum - ${scrumDate.toLocaleDateString()}`,
      status: scrumStatus === 'Completed' ? 'Completed' : 'In Progress',
      startTime: scrumStartTime,
      entries: allEntries
    };
    try {
      await scrumApi.logScrum(payload);
      queryClient.invalidateQueries({ queryKey: ['scrums', id] });
      toast.success(`Saved ${student.name}'s entry`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to save ${student.name}'s entry`);
    } finally {
      setSavingStudentId(null);
    }
  };

  // Scrum date navigation helpers
  const isScrumToday = new Date().toDateString() === scrumDate.toDateString();
  const scrumGoToPrevDay = () => setScrumDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d; });
  const scrumGoToNextDay = () => setScrumDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 1); return d; });
  const scrumGoToToday = () => { setScrumDate(new Date()); };


  // Leave helpers
  const getLeaveStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32', border: 'rgba(46,125,50,0.3)' };
      case 'Rejected': return { bg: 'rgba(211,47,47,0.1)', color: '#d32f2f', border: 'rgba(211,47,47,0.3)' };
      default: return { bg: 'rgba(230,81,0,0.1)', color: '#e65100', border: 'rgba(230,81,0,0.3)' };
    }
  };

  const getLeaveTypeStyle = (type) => {
    switch (type) {
      case 'Sick': return { bg: 'rgba(21,101,192,0.1)', color: '#1565c0' };
      case 'Casual': return { bg: 'rgba(46,125,50,0.1)', color: '#2e7d32' };
      case 'Emergency': return { bg: 'rgba(198,40,40,0.1)', color: '#c62828' };
      default: return { bg: 'rgba(0,0,0,0.06)', color: '#666' };
    }
  };

  const handleLeaveAction = (leaveId, newStatus) => {
    if (newStatus === 'approved') approveLeaveMutation.mutate(leaveId);
    else if (newStatus === 'rejected') rejectLeaveMutation.mutate(leaveId);
    else if (newStatus === 'cancelled') cancelLeaveMutation.mutate(leaveId);
    if (selectedLeaveDetail?._id === leaveId) setSelectedLeaveDetail(prev => ({ ...prev, status: newStatus }));
  };

  const toggleLeaveSelection = (id) => {
    setSelectedLeaves(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const bulkLeaveAction = (newStatus) => {
    selectedLeaves.forEach(leaveId => {
      if (newStatus === 'Approved') approveLeaveMutation.mutate(leaveId);
      if (newStatus === 'Rejected') rejectLeaveMutation.mutate(leaveId);
    });
    setSelectedLeaves([]);
  };

  const inviteMutation = useMutation({
    mutationFn: (email) => invitationApi.inviteStudent({ email, role: 'student', batch: id }),
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      setInviteEmail('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send invite');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ studentId, data }) => studentApi.changeStudentStatus(studentId, data),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['students', id] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status');
    }
  });

  if (batchLoading || studentsLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const batch = batchRes?.data;
  const students = studentsRes?.data || [];

  // Derived attendance stats (must be after students is defined)
  const attendanceCounts = students.reduce((acc, s) => {
    const status = attendanceMap[s._id];
    if (status === 'P') acc.present++;
    else if (status === 'A') acc.absent++;
    else if (status === 'L') acc.leave++;
    else if (status === 'H') acc.half++;
    else acc.unmarked++;
    return acc;
  }, { present: 0, absent: 0, leave: 0, half: 0, unmarked: 0 });

  const belowThreshold = students.filter(s => attendanceMap[s._id] === 'A');

  // Derived leaves data
  const leaveDataArray = leavesRes?.data || [];
  
  const filteredLeaves = leaveDataArray.filter(l => {
    const q = leaveSearch.toLowerCase();
    const studentName = l.student?.name || '';
    const studentEmail = l.student?.email || '';
    const matchesSearch = studentName.toLowerCase().includes(q) || studentEmail.toLowerCase().includes(q);
    const matchesStatus = leaveStatusFilter === 'All' || l.status === leaveStatusFilter.toLowerCase();
    const matchesType = leaveTypeFilter === 'All' || l.leaveType === leaveTypeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const leaveKPIs = [
    { label: 'Total This Month', value: leaveDataArray.length, color: '#1E2126', icon: <EventBusy sx={{ fontSize: 22 }} /> },
    { label: 'Pending', value: leaveDataArray.filter(l => l.status === 'pending').length, color: '#e65100', icon: <HourglassEmpty sx={{ fontSize: 22 }} /> },
    { label: 'Approved', value: leaveDataArray.filter(l => l.status === 'approved').length, color: '#2e7d32', icon: <CheckCircleOutlined sx={{ fontSize: 22 }} /> },
    { label: 'Rejected', value: leaveDataArray.filter(l => l.status === 'rejected').length, color: '#d32f2f', icon: <Cancel sx={{ fontSize: 22 }} /> },
  ];

  const scrumKPIs = [
    { label: 'Present', value: attendanceCounts.present, icon: <CheckCircle />, color: '#2e7d32' },
    { label: 'Absent', value: attendanceCounts.absent, icon: <RadioButtonUnchecked />, color: '#d32f2f' },
    { label: 'On Leave', value: attendanceCounts.leave, icon: <HourglassEmpty />, color: '#7b1fa2' },
    { label: 'Blocked', value: localScrumEntries.filter(d => d.blockerStatus && d.blockerStatus !== 'None').length, icon: <Block />, color: '#E8391D' },
  ];

  const interviews = Array.isArray(interviewsRes) ? interviewsRes : (interviewsRes?.data?.data || interviewsRes?.data || []);

  const interviewKPIs = [
    { label: 'Scheduled', value: interviews.filter(i => i.status === 'scheduled').length, icon: <Schedule />, color: '#1565c0' },
    { label: 'Completed', value: interviews.filter(i => i.status === 'completed' || i.status === 'passed').length, icon: <CheckCircle />, color: '#2e7d32' },
    { label: 'Pending Eval', value: interviews.filter(i => i.status === 'in_progress' || i.status === 'pending').length, icon: <HourglassEmpty />, color: '#e65100' },
    { label: 'Failed / Re-Int', value: interviews.filter(i => i.status === 'failed' || i.status === 're_interview_required').length, icon: <Warning />, color: '#d32f2f' },
  ];

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMutation.mutate(inviteEmail);
  };

  const handleStatusChange = (studentId, currentStatus) => {
    const newStatus = currentStatus === STUDENT_STATUS.ACTIVE ? STUDENT_STATUS.DISCONTINUED : STUDENT_STATUS.ACTIVE;
    const remark = prompt(`Enter mandatory remark for changing status to ${newStatus}:`);
    if (remark && remark.length >= 5) {
      statusMutation.mutate({ studentId, data: { status: newStatus, remark } });
    } else if (remark) {
      toast.error('Remark must be at least 5 characters');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case STUDENT_STATUS.ACTIVE: return 'success';
      case STUDENT_STATUS.DISCONTINUED: return 'warning';
      case STUDENT_STATUS.TERMINATED: return 'error';
      default: return 'default';
    }
  };

  const markStudent = (studentId, code) => {
    if (!code) return; // Ignore if unmarking
    const status = STATUS_MAP[code];
    if (status) {
      // Optimistic update
      setAttendanceMap(prev => ({ ...prev, [studentId]: code }));
      markSingleAttendanceMutation.mutate({
        batchId: id,
        studentId,
        date: attendanceDate.toISOString(),
        status,
        remarks: remarksMap[studentId] || ''
      });
    }
  };

  const markAll = (code) => {
    const status = STATUS_MAP[code];
    if (status) {
      const records = students.map(s => ({
        studentId: s._id,
        status,
        remarks: remarksMap[s._id] || ''
      }));
      // Optimistic update
      const newMap = {};
      students.forEach(s => newMap[s._id] = code);
      setAttendanceMap(prev => ({ ...prev, ...newMap }));
      
      bulkMarkAttendanceMutation.mutate({
        batchId: id,
        date: attendanceDate.toISOString(),
        attendanceRecords: records
      });
    }
  };

  const handleRemarkBlur = (studentId) => {
    const statusCode = attendanceMap[studentId];
    if (statusCode) {
      const status = STATUS_MAP[statusCode];
      markSingleAttendanceMutation.mutate({
        batchId: id,
        studentId,
        date: attendanceDate.toISOString(),
        status,
        remarks: remarksMap[studentId] || ''
      });
    } else if (remarksMap[studentId]) {
       // If there's a remark but no status, we could enforce a status or default to present
       toast.warning("Please mark attendance status before saving remarks.");
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'P': return { label: 'PRESENT', bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
      case 'A': return { label: 'ABSENT', bg: '#ffebee', text: '#c62828', border: '#ef9a9a' };
      case 'L': return { label: 'LEAVE', bg: '#f3e5f5', text: '#6a1b9a', border: '#ce93d8' };
      case 'H': return { label: 'HALF DAY', bg: '#fff3e0', text: '#ef6c00', border: '#ffcc80' };
      default: return { label: 'NOT MARKED', bg: 'transparent', text: 'text.disabled', border: 'transparent' };
    }
  };

  const formatDisplayDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const goToPrevDay = () => setAttendanceDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
  const goToNextDay = () => setAttendanceDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
  const goToToday = () => setAttendanceDate(new Date());

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 4 }, pb: { xs: 10, md: 8 } }}>

          {/* Header */}
          <Box sx={{
            pt: { xs: 2, md: 4 },
            pb: { xs: 2, md: 3 },
            px: { xs: 2, md: 6 },
            mx: { xs: -2, md: -6 },
            mt: { xs: -2, md: -6 },
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: { xs: 1, md: 3 }
          }}>
            <Breadcrumbs separator=">" sx={{ mb: 1 }}>
              <MuiLink component={Link} to="/dashboard" underline="none" color="text.secondary"
                sx={{ fontSize: '0.7rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}>DASHBOARD</MuiLink>
              <MuiLink component={Link} to="/batches" underline="none" color="text.secondary"
                sx={{ fontSize: '0.7rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}>BATCHES</MuiLink>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.primary' }}>DETAIL</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '50%',
                  bgcolor: 'rgba(232, 57, 29, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'primary.main', flexShrink: 0
                }}>
                  <School sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography variant="h4" fontWeight={900}
                      sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, color: '#1E2126', lineHeight: 1.2, textTransform: 'uppercase' }}>
                      {batch?.name}
                    </Typography>
                    <Chip label="MANAGED" size="small"
                      sx={{ bgcolor: 'rgba(232,57,29,0.1)', color: 'primary.main', fontWeight: 900, borderRadius: 2, fontSize: '0.55rem' }} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                    Facilitator: <b>{batch?.facilitator?.name}</b>
                  </Typography>
                </Box>
              </Box>

              {/* Date/Time — hidden on xs */}
              <Box sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center', gap: 2, px: 2.5, py: 1,
                borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)',
                bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarToday sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="subtitle2" fontWeight={900} color="secondary" sx={{ letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                    {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', borderColor: 'rgba(0,0,0,0.1)' }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime sx={{ fontSize: 18, color: 'text.disabled' }} />
                  <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Typography>
                </Stack>
              </Box>

              {/* Compact date badge — xs only */}
              <Box sx={{
                display: { xs: 'flex', sm: 'none' },
                alignItems: 'center', gap: 1, px: 1.5, py: 0.5,
                borderRadius: 2, bgcolor: 'rgba(232,57,29,0.07)', color: 'primary.main'
              }}>
                <CalendarToday sx={{ fontSize: 14 }} />
                <Typography variant="caption" fontWeight={900} sx={{ fontSize: '0.65rem' }}>
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* KPI Grid - Daily Batch Analysis */}
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2,
            mb: 3
          }}>
            {(() => {
              if (activeTab === 0) {
                return [
                  { label: "Today's Attendance", value: '92%', icon: <EventAvailable />, color: '#2e7d32' },
                  { label: 'Present Students', value: `${students.length > 0 ? students.length - 1 : 0}/${students.length}`, icon: <Group />, color: '#1E2126' },
                  { label: 'Late Arrivals', value: '01', icon: <TrendingUp />, color: '#E8391D' },
                  { label: 'Pending Leaves', value: '02', icon: <Layers />, color: '#9c27b0' },
                ];
              } else if (activeTab === 2) {
                return leaveKPIs;
              } else if (activeTab === 3) {
                return scrumKPIs;
              } else if (activeTab === 4) {
                return interviewKPIs;
              } else if (activeTab === 5) {
                return [
                  { label: 'Active Students', value: students.filter(s => s.status === STUDENT_STATUS.ACTIVE).length, color: '#2e7d32', icon: <HowToReg /> },
                  { label: 'Avg Attendance', value: '92.4%', color: '#1565c0', icon: <CalendarToday /> },
                  { label: 'Interview Pass', value: `${interviews.length > 0 ? Math.round((interviews.filter(i => i.status === 'passed').length / interviews.length) * 100) : 0}%`, color: '#E8391D', icon: <TrendingUp /> },
                  { label: 'Scrum Participation', value: '95.1%', color: '#7b1fa2', icon: <Speed /> },
                ];
              } else {
                return [
                  { label: 'Present Today', value: attendanceCounts.present, icon: <CheckCircle />, color: '#2e7d32' },
                  { label: 'Absent Today', value: attendanceCounts.absent, icon: <RadioButtonUnchecked />, color: '#d32f2f' },
                  { label: 'On Leave', value: attendanceCounts.leave, icon: <HourglassEmpty />, color: '#7b1fa2' },
                  { label: 'Half Day', value: attendanceCounts.half, icon: <EventAvailable />, color: '#e65100' },
                ];
              }
            })().map((stat, i) => (
              <Card key={i} sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.08)',
                height: 90,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'white'
              }}>
                <CardContent sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                  '&:last-child': { pb: 2 }
                }}>
                  <Box sx={{
                    p: 1.2,
                    bgcolor: `${stat.color}10`,
                    color: stat.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={900}
                      color="text.secondary"
                      sx={{ letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem', lineHeight: 1 }}
                    >
                      {stat.label.toUpperCase()}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      sx={{ color: 'secondary.main', mt: 0.5, lineHeight: 1 }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>



          {/* Batch Management Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                '& .MuiTabs-scrollButtons': { color: 'primary.main' },
                '& .MuiTab-root': {
                  fontWeight: 900,
                  fontSize: { xs: '0.65rem', md: '0.85rem' },
                  letterSpacing: '0.02em',
                  px: { xs: 1.5, md: 3 },
                  minWidth: { xs: 'auto', md: 80 },
                  minHeight: 44,
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'primary.main' }
                }
              }}
            >
              <Tab label="Students" />
              <Tab label="Attendance" />
              <Tab label="Leaves" />
              <Tab label="Scrum" />
              <Tab label="Interviews" />
              <Tab label="Analytics" />
            </Tabs>
          </Box>

          {/* Students Tab */}
          {activeTab === 0 && (
            <>
              {/* Desktop table */}
              <Card sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 2, overflow: 'hidden', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: 'rgba(247, 247, 245, 0.5)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', py: 2 }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Attendance</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Leaves</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Curr. Module</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                        <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'rgba(247, 247, 245, 0.8)' } }}>
                          <TableCell 
                            onClick={() => navigate(`/student-profile/${student._id}`)}
                            sx={{ 
                              py: 3,
                              cursor: 'pointer',
                              '&:hover .student-name': { color: 'primary.main' }
                            }}
                          >
                            <Stack 
                              direction="row" 
                              spacing={2} 
                              alignItems="center"
                            >
                              <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, fontWeight: 900, width: 40, height: 40 }}>{student.name[0]}</Avatar>
                              <Box>
                                <Typography 
                                  className="student-name"
                                  variant="subtitle2" 
                                  fontWeight={800} 
                                  sx={{ 
                                    color: 'secondary.main', 
                                    lineHeight: 1.2,
                                    transition: 'color 0.15s ease'
                                  }}
                                >
                                  {student.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>{student.email}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip label={student.status.toLowerCase()} size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', bgcolor: student.status === STUDENT_STATUS.ACTIVE ? '#228B22' : 'rgba(0,0,0,0.06)', color: student.status === STUDENT_STATUS.ACTIVE ? 'white' : 'text.secondary', borderRadius: 1.5, height: 20 }} />
                          </TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>94%</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={700}>3/10</Typography></TableCell>
                          <TableCell><Typography variant="body2" fontWeight={600} color="text.secondary">React Foundations</Typography></TableCell>
                          <TableCell align="right"><IconButton size="small" sx={{ color: 'text.disabled' }}><MoreVert /></IconButton></TableCell>
                        </TableRow>
                      ))}
                      {students.length === 0 && (
                        <TableRow><TableCell colSpan={6} sx={{ py: 12, textAlign: 'center' }}><Typography color="text.secondary" fontWeight={600}>No students found.</Typography></TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Mobile card list */}
              <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
                {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                  <Card key={student._id} sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack 
                        direction="row" 
                        spacing={1.5} 
                        alignItems="center" 
                        sx={{ 
                          mb: 1.5,
                          cursor: 'pointer',
                          '&:hover .student-name': { color: 'primary.main' }
                        }}
                        onClick={() => navigate(`/student-profile/${student._id}`)}
                      >
                        <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, fontWeight: 900, width: 40, height: 40, fontSize: '1rem' }}>{student.name[0]}</Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            className="student-name"
                            variant="subtitle2" 
                            fontWeight={800} 
                            color="secondary" 
                            noWrap
                            sx={{ transition: 'color 0.15s ease' }}
                          >
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{student.email}</Typography>
                        </Box>
                        <Chip label={student.status.toLowerCase()} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: student.status === STUDENT_STATUS.ACTIVE ? '#228B22' : 'rgba(0,0,0,0.06)', color: student.status === STUDENT_STATUS.ACTIVE ? 'white' : 'text.secondary', borderRadius: 1.5, flexShrink: 0 }} />
                      </Stack>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Box sx={{ bgcolor: 'rgba(46,125,50,0.08)', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
                          <Typography variant="caption" fontWeight={900} color="#2e7d32" sx={{ fontSize: '0.65rem' }}>ATTENDANCE: 94%</Typography>
                        </Box>
                        <Box sx={{ bgcolor: 'rgba(21,101,192,0.08)', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
                          <Typography variant="caption" fontWeight={900} color="#1565c0" sx={{ fontSize: '0.65rem' }}>LEAVES: 3/10</Typography>
                        </Box>
                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.04)', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
                          <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ fontSize: '0.65rem' }}>React Foundations</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
                {students.length === 0 && (
                  <Box sx={{ py: 8, textAlign: 'center' }}><Typography color="text.secondary" fontWeight={600}>No students found.</Typography></Box>
                )}
              </Stack>
            </>
          )}

          {/* ============== ATTENDANCE TAB PANEL ============== */}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Top Bar: Date Nav + Scrum Status */}
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>

                    {/* Date Navigator */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton onClick={goToPrevDay} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                        <ChevronLeft />
                      </IconButton>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: 2.5, py: 1, borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.1)', bgcolor: 'rgba(0,0,0,0.01)'
                      }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={900} color="secondary">
                          {formatDisplayDate(attendanceDate).toUpperCase()}
                        </Typography>
                      </Box>
                      <IconButton onClick={goToNextDay} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                        <ChevronRight />
                      </IconButton>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={goToToday}
                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', px: 2 }}
                      >
                        Today
                      </Button>
                    </Stack>

                  </Box>
                </CardContent>
              </Card>

              {/* Warning Banner */}
              {belowThreshold.length > 0 && (
                <Alert
                  severity="warning"
                  icon={<Warning />}
                  sx={{ borderRadius: 2, border: '1px solid rgba(237,108,2,0.3)' }}
                >
                  <AlertTitle sx={{ fontWeight: 900, fontSize: '0.85rem' }}>ATTENDANCE WARNING</AlertTitle>
                  <strong>{belowThreshold.length} student{belowThreshold.length > 1 ? 's' : ''}</strong> marked absent today — review before saving.
                </Alert>
              )}

              {/* Bulk Actions */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', mr: 0.5, flexShrink: 0 }}>BULK MARK:</Typography>
                {[{ code: 'P', label: 'All Present', color: '#2e7d32' },
                { code: 'A', label: 'All Absent', color: '#d32f2f' },
                { code: 'L', label: 'All Leave', color: '#7b1fa2' },
                { code: 'H', label: 'Half Day', color: '#e65100' },
                ].map(({ code, label, color }) => (
                  <Button
                    key={code}
                    size="small"
                    onClick={() => markAll(code)}
                    sx={{
                      fontWeight: 900, fontSize: '0.7rem', px: { xs: 1.5, md: 2 },
                      borderRadius: 2, textTransform: 'uppercase',
                      bgcolor: `${color}12`, color,
                      border: `1px solid ${color}40`,
                      '&:hover': { bgcolor: `${color}20` },
                      minWidth: 'unset'
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{label}</Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{code}</Box>
                  </Button>
                ))}
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setAttendanceMap({})}
                    sx={{ borderRadius: 2, fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              {/* Attendance Table — desktop */}
              <Card sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 2, overflow: 'hidden', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'rgba(247,247,245,0.8)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', py: 2 }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Quick Mark</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => {
                        const status = attendanceMap[student._id];
                        const style = getAttendanceStatusColor(status);
                        return (
                          <TableRow key={student._id} sx={{ bgcolor: style.bg, borderLeft: `3px solid ${status ? style.border : 'transparent'}`, transition: 'all 0.15s ease', '&:hover': { filter: 'brightness(0.97)' } }}>
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 36, height: 36, fontSize: '0.9rem', fontWeight: 900 }}>{student.name[0]}</Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={800} color="secondary" sx={{ lineHeight: 1.2 }}>{student.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={0.8}>
                                {[{ code: 'P', color: '#2e7d32' }, { code: 'A', color: '#d32f2f' }, { code: 'L', color: '#7b1fa2' }, { code: 'H', color: '#e65100' }].map(({ code, color }) => (
                                  <Box key={code} onClick={() => markStudent(student._id, status === code ? undefined : code)}
                                    sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer', fontWeight: 900, fontSize: '0.75rem', bgcolor: status === code ? color : `${color}15`, color: status === code ? 'white' : color, border: `1.5px solid ${status === code ? color : `${color}40`}`, transition: 'all 0.15s ease', '&:hover': { bgcolor: status === code ? color : `${color}30` }, userSelect: 'none' }}
                                  >{code}</Box>
                                ))}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              {status ? (
                                <Chip label={style.label} size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', bgcolor: style.bg, color: style.text, border: `1px solid ${style.border}`, borderRadius: 1.5 }} />
                              ) : (
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>Not marked</Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ minWidth: 200 }}>
                              <TextField size="small" placeholder="Optional remark..." value={remarksMap[student._id] || ''} onChange={e => setRemarksMap(prev => ({ ...prev, [student._id]: e.target.value }))} onBlur={() => handleRemarkBlur(student._id)} InputProps={{ sx: { borderRadius: 2, fontSize: '0.8rem', bgcolor: 'rgba(255,255,255,0.8)' } }} sx={{ width: '100%' }} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {students.length === 0 && (
                        <TableRow><TableCell colSpan={4} sx={{ py: 12, textAlign: 'center' }}><Typography color="text.secondary" fontWeight={600}>No students.</Typography></TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Attendance Mobile Card List */}
              <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' } }}>
                {students.map((student) => {
                  const status = attendanceMap[student._id];
                  const style = getAttendanceStatusColor(status);
                  return (
                    <Card key={student._id} sx={{ borderRadius: 2, border: `2px solid ${status ? style.border : 'rgba(0,0,0,0.06)'}`, bgcolor: style.bg || 'white', transition: 'all 0.2s ease' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        {/* Student info */}
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 38, height: 38, fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>{student.name[0]}</Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="secondary" noWrap>{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{student.email}</Typography>
                          </Box>
                          {status && <Chip label={style.label} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: style.bg, color: style.text, border: `1px solid ${style.border}`, borderRadius: 1.5, flexShrink: 0 }} />}
                        </Stack>

                        {/* Large touch-friendly mark buttons in 2x2 grid */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
                          {[
                            { code: 'P', color: '#2e7d32', label: 'Present' },
                            { code: 'A', color: '#d32f2f', label: 'Absent' },
                            { code: 'L', color: '#7b1fa2', label: 'On Leave' },
                            { code: 'H', color: '#e65100', label: 'Half Day' }
                          ].map(({ code, color, label }) => (
                            <Box key={code} onClick={() => markStudent(student._id, status === code ? undefined : code)}
                              sx={{
                                py: 1, px: 1.5, borderRadius: 2, cursor: 'pointer', textAlign: 'center',
                                bgcolor: status === code ? color : `${color}12`,
                                color: status === code ? 'white' : color,
                                border: `1.5px solid ${status === code ? color : `${color}40`}`,
                                transition: 'all 0.15s ease', userSelect: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5
                              }}
                            >
                              <Typography variant="caption" fontWeight={900} sx={{ fontSize: '0.7rem', lineHeight: 1 }}>{code} — {label}</Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Remark field */}
                        <TextField size="small" fullWidth placeholder="Optional remark..." value={remarksMap[student._id] || ''} onChange={e => setRemarksMap(prev => ({ ...prev, [student._id]: e.target.value }))} onBlur={() => handleRemarkBlur(student._id)} InputProps={{ sx: { borderRadius: 2, fontSize: '0.8rem', bgcolor: 'rgba(255,255,255,0.8)' } }} />
                      </CardContent>
                    </Card>
                  );
                })}
                {students.length === 0 && (
                  <Box sx={{ py: 8, textAlign: 'center' }}><Typography color="text.secondary" fontWeight={600}>No students.</Typography></Box>
                )}
              </Stack>



            </Box>

          )}

          {/* ============== LEAVES TAB PANEL ============== */}
          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>



              {/* Filter Bar */}
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      placeholder="Search student..."
                      size="small"
                      value={leaveSearch}
                      onChange={e => setLeaveSearch(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
                        sx: { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)', width: 240, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } }
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Status</InputLabel>
                      <Select value={leaveStatusFilter} label="Status" onChange={e => setLeaveStatusFilter(e.target.value)} sx={{ borderRadius: 2, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } }}>
                        {['All', 'Pending', 'Approved', 'Rejected'].map(s => <MenuItem key={s} value={s} sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel sx={{ fontSize: '0.8rem', fontWeight: 700 }}>Type</InputLabel>
                      <Select value={leaveTypeFilter} label="Type" onChange={e => setLeaveTypeFilter(e.target.value)} sx={{ borderRadius: 2, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } }}>
                        {['All', 'Sick', 'Casual', 'Emergency'].map(t => <MenuItem key={t} value={t} sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      {selectedLeaves.length > 0 && (
                        <>
                          <Button size="small" onClick={() => bulkLeaveAction('Approved')} sx={{ bgcolor: 'rgba(46,125,50,0.1)', color: '#2e7d32', fontWeight: 900, borderRadius: 2, fontSize: '0.72rem', '&:hover': { bgcolor: 'rgba(46,125,50,0.2)' } }}>
                            Approve ({selectedLeaves.length})
                          </Button>
                          <Button size="small" onClick={() => bulkLeaveAction('Rejected')} sx={{ bgcolor: 'rgba(211,47,47,0.1)', color: '#d32f2f', fontWeight: 900, borderRadius: 2, fontSize: '0.72rem', '&:hover': { bgcolor: 'rgba(211,47,47,0.2)' } }}>
                            Reject ({selectedLeaves.length})
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Leave Table */}
              <Card sx={{ borderRadius: 2, overflow: 'hidden', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead sx={{ bgcolor: 'rgba(247,247,245,0.8)' }}>
                      <TableRow>
                        <TableCell padding="checkbox" sx={{ pl: 2 }}>
                          <Checkbox
                            size="small"
                            indeterminate={selectedLeaves.length > 0 && selectedLeaves.length < filteredLeaves.length}
                            checked={filteredLeaves.length > 0 && selectedLeaves.length === filteredLeaves.length}
                            onChange={e => setSelectedLeaves(e.target.checked ? filteredLeaves.map(l => l._id) : [])}
                          />
                        </TableCell>
                        {['Student', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Applied On', 'Actions'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em', py: 2, color: 'text.secondary' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLeaves.map((leave) => {
                        const ss = getLeaveStatusStyle(leave.status.charAt(0).toUpperCase() + leave.status.slice(1));
                        const ts = getLeaveTypeStyle(leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1));
                        const isSelected = selectedLeaves.includes(leave._id);
                        return (
                          <TableRow key={leave._id} sx={{ bgcolor: isSelected ? 'rgba(232,57,29,0.03)' : 'transparent', '&:hover': { bgcolor: 'rgba(247,247,245,0.9)' }, transition: 'background 0.15s' }}>
                            <TableCell padding="checkbox" sx={{ pl: 2 }}>
                              <Checkbox size="small" checked={isSelected} onChange={() => toggleLeaveSelection(leave._id)} />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 34, height: 34, fontSize: '0.85rem', fontWeight: 900 }}>{(leave.student?.name || '?')[0]}</Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={800} color="secondary" sx={{ lineHeight: 1.2 }}>{leave.student?.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{leave.student?.email}</Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Chip label={leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', bgcolor: ts.bg, color: ts.color, borderRadius: 1.5, height: 22 }} />
                            </TableCell>
                            <TableCell><Typography variant="body2" fontWeight={700}>{formatDisplayDate(new Date(leave.fromDate))}</Typography></TableCell>
                            <TableCell><Typography variant="body2" fontWeight={700}>{formatDisplayDate(new Date(leave.toDate))}</Typography></TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.06)', fontWeight: 900, fontSize: '0.8rem', color: 'secondary.main' }}>{leave.totalDays}</Box>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 160 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>{leave.reason}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)} size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', bgcolor: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, borderRadius: 1.5, height: 22 }} />
                            </TableCell>
                            <TableCell><Typography variant="body2" color="text.secondary" fontWeight={600}>{formatDisplayDate(new Date(leave.appliedAt))}</Typography></TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="View Details">
                                  <IconButton size="small" onClick={() => { setSelectedLeaveDetail(leave); setLeaveDetailOpen(true); }} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                    <Visibility sx={{ fontSize: 17 }} />
                                  </IconButton>
                                </Tooltip>
                                {leave.status === 'pending' && (
                                  <>
                                    <Tooltip title="Approve">
                                      <IconButton size="small" onClick={() => handleLeaveAction(leave._id, 'approved')} sx={{ color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46,125,50,0.1)' } }}>
                                        <CheckCircleOutlined sx={{ fontSize: 17 }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                      <IconButton size="small" onClick={() => handleLeaveAction(leave._id, 'rejected')} sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211,47,47,0.1)' } }}>
                                        <Cancel sx={{ fontSize: 17 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {filteredLeaves.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} sx={{ py: 10, textAlign: 'center' }}>
                            <EventBusy sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>No leave requests found.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

            </Box>
          )}

          {/* ============== SCRUM TAB PANEL ============== */}
          {activeTab === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Date Navigator */}
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <IconButton onClick={scrumGoToPrevDay} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                      <ChevronLeft />
                    </IconButton>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1,
                      px: 2.5, py: 1, borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.1)', bgcolor: 'rgba(0,0,0,0.01)'
                    }}>
                      <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="subtitle2" fontWeight={900} color="secondary">
                        {formatDisplayDate(scrumDate).toUpperCase()}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={scrumGoToNextDay}
                      disabled={isScrumToday}
                      size="small"
                      sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}
                    >
                      <ChevronRight />
                    </IconButton>
                    {!isScrumToday && (
                      <Button
                        size="small" variant="outlined" color="primary"
                        onClick={scrumGoToToday}
                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', px: 2 }}
                      >
                        Today
                      </Button>
                    )}
                    {scrumStatus === 'No Record' && (
                      <Chip label="NO SCRUM RECORDED" size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: 'rgba(0,0,0,0.05)', color: 'text.secondary', borderRadius: 1.5 }} />
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Scrum Control Header */}
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        bgcolor: scrumStatus === 'Completed' ? 'rgba(46,125,50,0.1)' : scrumStatus === 'In Progress' ? 'rgba(232,57,29,0.1)' : 'rgba(0,0,0,0.05)',
                        color: scrumStatus === 'Completed' ? '#2e7d32' : scrumStatus === 'In Progress' ? 'primary.main' : 'text.disabled',
                        p: 1.5, borderRadius: 2, display: 'flex'
                      }}>
                        <Assignment fontSize="medium" />
                      </Box>
                      <Box>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography variant="h6" fontWeight={900} color="secondary" sx={{ fontSize: '1rem', letterSpacing: '0.02em' }}>
                            DAILY MORNING SCRUM
                          </Typography>
                          <Chip
                            label={(scrumEditMode && scrumStatus === 'Completed') ? 'EDITING' : scrumStatus.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 900, fontSize: '0.6rem',
                              bgcolor: scrumEditMode ? 'rgba(21,101,192,0.1)' : scrumStatus === 'Completed' ? 'rgba(46,125,50,0.1)' : scrumStatus === 'In Progress' ? 'rgba(232,57,29,0.1)' : 'rgba(0,0,0,0.05)',
                              color: scrumEditMode ? '#1565c0' : scrumStatus === 'Completed' ? '#2e7d32' : scrumStatus === 'In Progress' ? 'primary.main' : 'text.disabled',
                              borderRadius: 1.5, border: '1px solid currentColor'
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Session: {scrumStartTime ? `Started at ${scrumStartTime}` : 'Not yet started'} | Date: {formatDisplayDate(scrumDate)}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={2}>
                      {scrumStatus === 'Not Started' && isScrumToday ? (
                        <Button
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={startScrumSession}
                          sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#000' } }}
                        >
                          Start Scrum
                        </Button>
                      ) : scrumStatus === 'In Progress' || (scrumStatus === 'Completed' && scrumEditMode) ? (
                        <>
                          <Button variant="outlined" color="secondary" startIcon={<Save />} onClick={handleSaveProgress} disabled={saveScrumMutation.isPending}>
                            Save Progress
                          </Button>
                          <Button variant="contained" color="primary" startIcon={<DoneAll />} onClick={completeScrumSession} disabled={saveScrumMutation.isPending}>
                            Complete Scrum
                          </Button>
                          {scrumEditMode && (
                            <Button variant="outlined" color="inherit" onClick={() => setScrumEditMode(false)} sx={{ borderRadius: 2 }}>
                              Cancel
                            </Button>
                          )}
                        </>
                      ) : scrumStatus === 'Completed' ? (
                        <Stack direction="row" spacing={1.5}>
                          <Button variant="outlined" color="primary" startIcon={<Edit fontSize="small" />} onClick={() => setScrumEditMode(true)} sx={{ borderRadius: 2 }}>
                            Edit Scrum
                          </Button>
                          {isScrumToday && (
                            <Button variant="outlined" color="error" startIcon={<Refresh fontSize="small" />} onClick={restartScrumSession} sx={{ borderRadius: 2 }}>
                              Restart
                            </Button>
                          )}
                        </Stack>
                      ) : scrumStatus === 'No Record' ? (
                        isScrumToday ? (
                          <Button variant="contained" startIcon={<PlayArrow />} onClick={startScrumSession} sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: '#000' } }}>
                            Start Scrum
                          </Button>
                        ) : null
                      ) : null}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              {(scrumStatus === 'Not Started' || scrumStatus === 'No Record') ? (
                <Box sx={{ py: 12, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 3, border: '2px dashed rgba(0,0,0,0.05)' }}>
                  <Assignment sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" fontWeight={800} color="text.secondary" gutterBottom>
                    {scrumStatus === 'No Record' ? `No scrum recorded for ${formatDisplayDate(scrumDate)}.` : "Today's scrum session has not started yet."}
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
                    {scrumStatus === 'No Record' ? 'Navigate to a different date or go to Today.' : 'Start the session to begin recording student progress and participation.'}
                  </Typography>
                  {isScrumToday && scrumStatus !== 'No Record' && (
                    <Button variant="contained" size="large" startIcon={<PlayArrow />} onClick={startScrumSession}>
                      Start Today's Scrum
                    </Button>
                  )}
                </Box>
              ) : (
                <>
                  {/* Scrum Desktop Table */}
                  <Card sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 2, overflow: 'hidden', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                    <TableContainer sx={{ maxHeight: '70vh' }}>
                      <Table stickyHeader sx={{ minWidth: 1200 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Student Info</TableCell>
                            <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Attendance</TableCell>
                            <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Yesterday's Progress</TableCell>
                            <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Today's Plan</TableCell>
                            <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Blockers</TableCell>
                            <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Notes & Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB', zIndex: 3 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {students.map((student) => {
                            const data = scrumData[student._id] || { yesterday: '', today: '', blocker: 'No Issues', blockerNote: '', notes: '', status: 'No Update' };
                            const attendance = attendanceMap[student._id];
                            const isEditable = scrumStatus === 'In Progress' || (scrumStatus === 'Completed' && scrumEditMode);
                            return (
                              <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                                <TableCell sx={{ py: 2, verticalAlign: 'top', minWidth: 200 }}>
                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 36, height: 36, fontSize: '0.85rem', fontWeight: 900 }}>{student.name[0]}</Avatar>
                                    <Box>
                                      <Typography variant="subtitle2" fontWeight={800} color="secondary" sx={{ lineHeight: 1.2 }}>{student.name}</Typography>
                                      <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                                    </Box>
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ verticalAlign: 'top' }}>
                                  <Stack direction="row" spacing={0.5}>
                                    {['P', 'A'].map((code) => (
                                      <Box key={code} onClick={() => markStudent(student._id, attendance === code ? undefined : code)}
                                        sx={{ width: 28, height: 28, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', bgcolor: attendance === code ? (code === 'P' ? '#2e7d32' : '#d32f2f') : 'rgba(0,0,0,0.04)', color: attendance === code ? 'white' : 'text.secondary', transition: 'all 0.2s', '&:hover': { bgcolor: attendance === code ? undefined : 'rgba(0,0,0,0.1)' } }}
                                      >{code}</Box>
                                    ))}
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ minWidth: 250, verticalAlign: 'top' }}>
                                  <Box onClick={() => isEditable && setScrumEditModal({ open: true, studentId: student._id, field: 'yesterday', title: "Yesterday's Progress" })}
                                    sx={{ minHeight: 52, p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, cursor: isEditable ? 'pointer' : 'default', bgcolor: isEditable ? 'rgba(0,0,0,0.01)' : 'rgba(0,0,0,0.005)', fontSize: '0.8rem', color: data.yesterday ? 'text.primary' : 'text.disabled', whiteSpace: 'pre-wrap', wordBreak: 'break-word', '&:hover': isEditable ? { bgcolor: 'rgba(0,0,0,0.03)' } : {} }}
                                  >{data.yesterday || (isEditable ? "Click to add progress..." : "—")}</Box>
                                </TableCell>
                                <TableCell sx={{ minWidth: 250, verticalAlign: 'top' }}>
                                  <Box onClick={() => isEditable && setScrumEditModal({ open: true, studentId: student._id, field: 'today', title: "Today's Plan" })}
                                    sx={{ minHeight: 52, p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, cursor: isEditable ? 'pointer' : 'default', bgcolor: isEditable ? 'rgba(0,0,0,0.01)' : 'rgba(0,0,0,0.005)', fontSize: '0.8rem', color: data.today ? 'text.primary' : 'text.disabled', whiteSpace: 'pre-wrap', wordBreak: 'break-word', '&:hover': isEditable ? { bgcolor: 'rgba(0,0,0,0.03)' } : {} }}
                                  >{data.today || (isEditable ? "Click to add plan..." : "—")}</Box>
                                </TableCell>
                                <TableCell sx={{ minWidth: 200, verticalAlign: 'top' }}>
                                  <Stack spacing={1}>
                                    <FormControl size="small" fullWidth disabled={!isEditable}>
                                      <Select value={data.blocker} onChange={(e) => isEditable && handleUpdateScrum(student._id, 'blocker', e.target.value)} sx={{ borderRadius: 2, fontSize: '0.8rem', fontWeight: 700 }}>
                                        {['No Issues', 'Technical Issue', 'Laptop Issue', 'Internet Problem', 'Personal Reason', 'Waiting for Review', 'Lack of Progress'].map(opt => (<MenuItem key={opt} value={opt} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{opt}</MenuItem>))}
                                      </Select>
                                    </FormControl>
                                    {data.blocker !== 'No Issues' && (<TextField size="small" fullWidth placeholder="Blocker note..." value={data.blockerNote} onChange={(e) => isEditable && handleUpdateScrum(student._id, 'blockerNote', e.target.value)} disabled={!isEditable} InputProps={{ sx: { fontSize: '0.75rem', borderRadius: 1.5 } }} />)}
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ minWidth: 180, verticalAlign: 'top' }}>
                                  <Stack spacing={1}>
                                    <Box onClick={() => isEditable && setScrumEditModal({ open: true, studentId: student._id, field: 'notes', title: "Facilitator Notes" })}
                                      sx={{ minHeight: 36, p: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1.5, cursor: isEditable ? 'pointer' : 'default', bgcolor: isEditable ? 'rgba(0,0,0,0.01)' : 'rgba(0,0,0,0.005)', fontSize: '0.75rem', color: data.notes ? 'text.primary' : 'text.disabled', whiteSpace: 'pre-wrap', wordBreak: 'break-word', display: 'flex', alignItems: 'center', '&:hover': isEditable ? { bgcolor: 'rgba(0,0,0,0.03)' } : {} }}
                                    >{data.notes || (isEditable ? "Add notes..." : "—")}</Box>
                                    <FormControl size="small" fullWidth disabled={!isEditable}>
                                      <Select value={data.status} onChange={(e) => isEditable && handleUpdateScrum(student._id, 'status', e.target.value)} sx={{ borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 900, bgcolor: `${getScrumStatusColor(data.status)}15`, color: getScrumStatusColor(data.status), '& fieldset': { border: 'none' } }}>
                                        {['On Track', 'Delayed', 'Blocked', 'No Update'].map(opt => (<MenuItem key={opt} value={opt} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{opt}</MenuItem>))}
                                      </Select>
                                    </FormControl>
                                  </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                                  <Tooltip title={isEditable ? `Save ${student.name}'s entry to DB` : 'Enable Edit mode to modify'}>
                                    <span>
                                      <IconButton size="small" onClick={() => handleSaveStudentRow(student)} disabled={savingStudentId === student._id} sx={{ color: savingStudentId === student._id ? 'text.disabled' : 'primary.main', '&:hover': { bgcolor: 'rgba(232,57,29,0.08)' } }}>
                                        {savingStudentId === student._id ? <CircularProgress size={16} color="inherit" /> : <Save sx={{ fontSize: 18 }} />}
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>

                  {/* Scrum Mobile Card List */}
                  <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
                    {students.map((student) => {
                      const data = scrumData[student._id] || { yesterday: '', today: '', blocker: 'No Issues', blockerNote: '', notes: '', status: 'No Update' };
                      const attendance = attendanceMap[student._id];
                      const isEditable = scrumStatus === 'In Progress' || (scrumStatus === 'Completed' && scrumEditMode);
                      return (
                        <Card key={student._id} sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.07)', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            {/* Header row */}
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                              <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 40, height: 40, fontWeight: 900, fontSize: '1rem', flexShrink: 0 }}>{student.name[0]}</Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={800} color="secondary" noWrap>{student.name}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{student.email}</Typography>
                              </Box>
                              <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                                {['P', 'A'].map((code) => (
                                  <Box key={code} onClick={() => markStudent(student._id, attendance === code ? undefined : code)}
                                    sx={{ width: 32, height: 32, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', bgcolor: attendance === code ? (code === 'P' ? '#2e7d32' : '#d32f2f') : 'rgba(0,0,0,0.05)', color: attendance === code ? 'white' : 'text.secondary', transition: 'all 0.2s' }}
                                  >{code}</Box>
                                ))}
                              </Stack>
                              <Chip label={data.status} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem', bgcolor: `${getScrumStatusColor(data.status)}15`, color: getScrumStatusColor(data.status), borderRadius: 1.5, flexShrink: 0 }} />
                            </Stack>

                            {/* Yesterday */}
                            <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>YESTERDAY</Typography>
                            <Box onClick={() => isEditable && setScrumEditModal({ open: true, studentId: student._id, field: 'yesterday', title: "Yesterday's Progress" })}
                              sx={{ minHeight: 44, p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, cursor: isEditable ? 'pointer' : 'default', bgcolor: isEditable ? 'rgba(0,0,0,0.01)' : 'rgba(0,0,0,0.005)', fontSize: '0.82rem', color: data.yesterday ? 'text.primary' : 'text.disabled', mb: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >{data.yesterday || (isEditable ? "Tap to add yesterday's progress..." : "—")}</Box>

                            {/* Today */}
                            <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>TODAY</Typography>
                            <Box onClick={() => isEditable && setScrumEditModal({ open: true, studentId: student._id, field: 'today', title: "Today's Plan" })}
                              sx={{ minHeight: 44, p: 1.5, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, cursor: isEditable ? 'pointer' : 'default', bgcolor: isEditable ? 'rgba(0,0,0,0.01)' : 'rgba(0,0,0,0.005)', fontSize: '0.82rem', color: data.today ? 'text.primary' : 'text.disabled', mb: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >{data.today || (isEditable ? "Tap to add today's plan..." : "—")}</Box>

                            {/* Blocker + Status row */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                              <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>BLOCKER</Typography>
                                <FormControl size="small" fullWidth disabled={!isEditable}>
                                  <Select value={data.blocker} onChange={(e) => isEditable && handleUpdateScrum(student._id, 'blocker', e.target.value)} sx={{ borderRadius: 2, fontSize: '0.75rem', fontWeight: 700 }}>
                                    {['No Issues', 'Technical Issue', 'Laptop Issue', 'Internet Problem', 'Personal Reason', 'Waiting for Review', 'Lack of Progress'].map(opt => (<MenuItem key={opt} value={opt} sx={{ fontSize: '0.8rem' }}>{opt}</MenuItem>))}
                                  </Select>
                                </FormControl>
                              </Box>
                              <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>STATUS</Typography>
                                <FormControl size="small" fullWidth disabled={!isEditable}>
                                  <Select value={data.status} onChange={(e) => isEditable && handleUpdateScrum(student._id, 'status', e.target.value)} sx={{ borderRadius: 2, fontSize: '0.75rem', fontWeight: 900, bgcolor: `${getScrumStatusColor(data.status)}15`, color: getScrumStatusColor(data.status), '& fieldset': { border: 'none' } }}>
                                    {['On Track', 'Delayed', 'Blocked', 'No Update'].map(opt => (<MenuItem key={opt} value={opt} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{opt}</MenuItem>))}
                                  </Select>
                                </FormControl>
                              </Box>
                            </Box>

                            {data.blocker !== 'No Issues' && (
                              <TextField size="small" fullWidth placeholder="Blocker note..." value={data.blockerNote} onChange={(e) => isEditable && handleUpdateScrum(student._id, 'blockerNote', e.target.value)} disabled={!isEditable} sx={{ mb: 1.5 }} InputProps={{ sx: { fontSize: '0.8rem', borderRadius: 1.5 } }} />
                            )}

                            {/* Notes + Save */}
                            <Stack direction="row" spacing={1} alignItems="flex-start">
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>NOTES</Typography>
                                <Box onClick={() => isEditable && setScrumEditModal({ open: true, studentId: student._id, field: 'notes', title: "Facilitator Notes" })}
                                  sx={{ minHeight: 36, p: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1.5, cursor: isEditable ? 'pointer' : 'default', bgcolor: isEditable ? 'rgba(0,0,0,0.01)' : 'rgba(0,0,0,0.005)', fontSize: '0.8rem', color: data.notes ? 'text.primary' : 'text.disabled', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                >{data.notes || (isEditable ? "Add notes..." : "—")}</Box>
                              </Box>
                              <Tooltip title={isEditable ? `Save ${student.name}'s entry` : 'Enable Edit mode'}>
                                <span>
                                  <IconButton size="small" onClick={() => handleSaveStudentRow(student)} disabled={savingStudentId === student._id} sx={{ mt: 2.8, color: savingStudentId === student._id ? 'text.disabled' : 'primary.main', border: '1px solid rgba(232,57,29,0.2)', borderRadius: 1.5, '&:hover': { bgcolor: 'rgba(232,57,29,0.08)' } }}>
                                    {savingStudentId === student._id ? <CircularProgress size={16} color="inherit" /> : <Save sx={{ fontSize: 18 }} />}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                </>
              )}
            </Box>
          )}

          {/* ============== INTERVIEWS TAB PANEL ============== */}
          {activeTab === 4 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Header / Actions */}
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                <CardContent sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(232,57,29,0.1)', color: 'primary.main', p: 1.5, borderRadius: 2, display: 'flex' }}>
                      <Assessment fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={900} color="secondary" sx={{ fontSize: '1rem', letterSpacing: '0.02em' }}>
                        MODULE EVALUATIONS
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Manage end-of-module student interviews and re-evaluations.
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined" color="secondary" size="small"
                      startIcon={<CalendarToday fontSize="small" />}
                      sx={{ borderRadius: 1.5, fontWeight: 800, textTransform: 'none' }}
                      onClick={() => {
                        const token = localStorage.getItem('accessToken');
                        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/google/auth?token=${encodeURIComponent(token)}&state=${id}`;
                      }}
                    >
                      Connect Google Calendar
                    </Button>
                    <Button variant="outlined" color="primary" startIcon={<Schedule fontSize="small" />} size="small" sx={{ borderRadius: 1.5, fontWeight: 800 }} onClick={() => setScheduleModalOpen(true)}>Schedule Interview</Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Filters */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  size="small" placeholder="Search student or module..."
                  value={interviewSearch} onChange={(e) => setInterviewSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                    sx: { borderRadius: 2, bgcolor: 'white', minWidth: 260 }
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                  {['All', 'Scheduled', 'Pending', 'In Progress', 'Completed', 'Passed', 'Failed', 'Re-Interview Required'].map(status => (
                    <Chip
                      key={status} label={status}
                      onClick={() => setInterviewStatusFilter(status)}
                      sx={{
                        fontWeight: 800, fontSize: '0.7rem', borderRadius: 1.5, cursor: 'pointer',
                        bgcolor: interviewStatusFilter === status ? 'secondary.main' : 'white',
                        color: interviewStatusFilter === status ? 'white' : 'text.secondary',
                        border: interviewStatusFilter === status ? 'none' : '1px solid rgba(0,0,0,0.1)'
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Main Interview Table */}
              <Card sx={{ borderRadius: 2, overflow: 'visible', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 1200 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Module</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Schedule</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Interviewer</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Score</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Attempts</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Link</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem', bgcolor: '#F9FAFB' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interviews
                        .filter(i => interviewStatusFilter === 'All' || i.status === interviewStatusFilter.toLowerCase().replace(' ', '_'))
                        .filter(i => i.student?.name?.toLowerCase().includes(interviewSearch.toLowerCase()) || i.module?.toLowerCase().includes(interviewSearch.toLowerCase()))
                        .map((intv) => {
                          const st = getInterviewStatusStyle(intv.status);
                          return (
                            <TableRow key={intv._id} hover sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                              <TableCell sx={{ py: 2 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Avatar sx={{ bgcolor: 'secondary.main', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 900, borderRadius: 2 }}>{intv.student?.name?.[0]}</Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight={800} color="secondary">{intv.student?.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{intv.student?.email}</Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={700} color="secondary">{intv.module}</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={st.label} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', bgcolor: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 1.5 }} />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={700}>{new Date(intv.scheduledDate).toLocaleDateString()}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>{intv.scheduledTime} • {intv.mode}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={700} color="text.primary">{intv.interviewer?.name || 'Unassigned'}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={900} color={intv.score == null ? 'text.disabled' : 'primary.main'}>{intv.score != null ? `${intv.score}/${intv.maxScore}` : '-'}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={800} color={intv.reInterviewAttempt >= intv.maxReInterviewLimit ? 'error.main' : 'text.secondary'}>{intv.reInterviewAttempt}/{intv.maxReInterviewLimit}</Typography>
                              </TableCell>
                              <TableCell>
                                {intv.meetingLink ? (
                                  <Button
                                    size="small" variant="outlined"
                                    startIcon={['passed', 'failed', 're_interview_required', 'completed'].includes(intv.status) ? null : <VideoCameraFront />}
                                    href={['passed', 'failed', 're_interview_required', 'completed'].includes(intv.status) ? null : intv.meetingLink}
                                    target="_blank"
                                    disabled={['passed', 'failed', 're_interview_required', 'completed'].includes(intv.status)}
                                    sx={{
                                      borderRadius: 1.5, textTransform: 'none', fontSize: '0.65rem', py: 0.5,
                                      borderColor: ['passed', 'failed', 're_interview_required', 'completed'].includes(intv.status) ? 'rgba(0,0,0,0.1)' : 'primary.main',
                                      color: ['passed', 'failed', 're_interview_required', 'completed'].includes(intv.status) ? 'text.disabled' : 'primary.main'
                                    }}
                                  >
                                    {['passed', 'failed', 're_interview_required', 'completed'].includes(intv.status) ? 'Finished' : 'Join'}
                                  </Button>
                                ) : (
                                  <Typography variant="caption" color="text.disabled">-</Typography>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                  {(intv.status === 'failed' || intv.status === 're_interview_required') && intv.reInterviewAttempt < intv.maxReInterviewLimit && (
                                    <Tooltip title="Schedule Re-Interview">
                                      <IconButton size="small" color="error" onClick={() => { setSelectedInterviewForScore(intv); setReInterviewModalOpen(true); }}><Repeat fontSize="small" /></IconButton>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Edit Interview">
                                    <IconButton size="small" color="secondary" onClick={() => {
                                      setSelectedInterviewForEdit(intv);
                                      setIsEditingInterview(true);
                                      setScheduleForm({
                                        student: intv.student?._id || intv.student || '',
                                        module: intv.module || '',
                                        scheduledDate: intv.scheduledDate ? new Date(intv.scheduledDate).toISOString().split('T')[0] : '',
                                        scheduledTime: intv.scheduledTime || '',
                                        mode: intv.mode || 'online',
                                        interviewer: intv.interviewer?._id || intv.interviewer || '',
                                        generateMeetLink: true
                                      });
                                      setScheduleModalOpen(true);
                                    }}><Edit fontSize="small" /></IconButton>
                                  </Tooltip>
                                  <Tooltip title="View Details">
                                    <IconButton size="small" onClick={() => setInterviewDetailModal({ open: true, interview: intv })}><Visibility fontSize="small" /></IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete Interview">
                                    <IconButton size="small" color="error" onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this interview?')) {
                                        deleteInterviewMutation.mutate(intv._id);
                                      }
                                    }}><Delete fontSize="small" /></IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {interviews.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} sx={{ py: 10, textAlign: 'center' }}>
                            <VideoCameraFront sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>No interviews scheduled for this batch yet.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}

          {/* ============== ANALYTICS TAB PANEL ============== */}
          {activeTab === 5 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', overflowX: 'hidden' }}>

              {/* 1. Header: Health & Filters */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2.5,
                bgcolor: 'white',
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
              }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>BATCH STATUS</Typography>
                    <Chip
                      label="🟢 HEALTHY & ACTIVE"
                      sx={{
                        bgcolor: 'rgba(46,125,50,0.08)',
                        color: '#2e7d32',
                        fontWeight: 900,
                        fontSize: '0.75rem',
                        borderRadius: 2,
                        px: 1,
                        border: '1px solid rgba(46,125,50,0.2)'
                      }}
                    />
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>CURRENT MODULE</Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="secondary">React Foundations</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>FILTER BY:</Typography>
                  <Select
                    size="small"
                    value="Last 30 Days"
                    sx={{ minWidth: 140, height: 36, fontSize: '0.75rem', fontWeight: 800, borderRadius: 2, bgcolor: '#f9fafb' }}
                  >
                    <MenuItem value="This Week">This Week</MenuItem>
                    <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                    <MenuItem value="This Module">This Module</MenuItem>
                  </Select>
                  <Button variant="outlined" size="small" startIcon={<Refresh />} sx={{ height: 36, borderRadius: 2, fontSize: '0.7rem' }}>Refresh</Button>
                </Stack>
              </Box>

              {/* 3. Row 1: Attendance Trend & Interview Outcomes */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
                gap: 3,
                width: '100%'
              }}>
                <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" fontWeight={900}>ATTENDANCE PERFORMANCE TREND</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="Current Week" size="small" sx={{ fontSize: '0.65rem', fontWeight: 800 }} />
                    </Stack>
                  </Box>
                  <CardContent sx={{ pt: 4 }}>
                    <Box sx={{ height: 280, width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { day: 'Mon', rate: 94 }, { day: 'Tue', rate: 88 }, { day: 'Wed', rate: 91 },
                          { day: 'Thu', rate: 95 }, { day: 'Fri', rate: 89 }, { day: 'Sat', rate: 92 },
                          { day: 'Sun', rate: 94 },
                        ]}>
                          <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E8391D" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="#E8391D" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#6B7280' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#6B7280' }} domain={[0, 100]} />
                          <RechartsTooltip
                            contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', fontWeight: 800, fontSize: '0.85rem' }}
                          />
                          <Area type="monotone" dataKey="rate" stroke="#E8391D" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" fontWeight={900}>INTERVIEW OUTCOMES</Typography>
                  </Box>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 65px)' }}>
                    <Box sx={{ height: 260, width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Passed', value: interviews.filter(i => i.status === 'passed').length || 1, color: '#2e7d32' },
                              { name: 'Failed', value: interviews.filter(i => i.status === 'failed' || i.status === 're_interview_required').length || 0.1, color: '#d32f2f' },
                              { name: 'Scheduled', value: interviews.filter(i => i.status === 'scheduled' || i.status === 'in_progress').length || 0.1, color: '#1565c0' },
                            ]}
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {[0, 1, 2].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#2e7d32', '#d32f2f', '#1565c0'][index]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '0.75rem', fontWeight: 700 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* 4. Row 2: Leave Usage & Scrum Trend */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
                gap: 3,
                width: '100%'
              }}>
                <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" fontWeight={900}>LEAVE DISTRIBUTION</Typography>
                  </Box>
                  <CardContent>
                    <Box sx={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { type: 'Sick', count: 12 },
                          { type: 'Casual', count: 8 },
                          { type: 'Emergency', count: 4 },
                          { type: 'Other', count: 2 },
                        ]} layout="vertical" margin={{ left: -10, right: 20 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="type" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#1E2126' }} />
                          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                            {[0, 1, 2, 3].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#1E2126', '#E8391D', '#e65100', '#7b1fa2'][index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={800}>TOTAL REQUESTS: 26</Typography>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" fontWeight={900}>SCRUM COMPLETION RATE (%)</Typography>
                  </Box>
                  <CardContent sx={{ pt: 3 }}>
                    <Box sx={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { date: '05/10', rate: 98 }, { date: '05/11', rate: 92 }, { date: '05/12', rate: 100 },
                          { date: '05/13', rate: 85 }, { date: '05/14', rate: 96 }, { date: '05/15', rate: 94 },
                          { date: '05/16', rate: 97 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} domain={[0, 100]} />
                          <Bar dataKey="rate" fill="#7b1fa2" radius={[6, 6, 0, 0]} barSize={35} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* 5. Row 3: Risk Table (8) & Alerts/Leaderboard (4) */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' },
                gap: 3,
                width: '100%'
              }}>
                <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(211,47,47,0.02)' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Warning sx={{ color: '#d32f2f' }} />
                      <Typography variant="subtitle2" fontWeight={900} color="#d32f2f">PRIORITY RISK MONITORING</Typography>
                    </Stack>
                    <Button size="small" sx={{ fontSize: '0.65rem', color: '#d32f2f', fontWeight: 900 }}>Export List</Button>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem', py: 2 }}>STUDENT</TableCell>
                          <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>RISK</TableCell>
                          <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ATTENDANCE</TableCell>
                          <TableCell sx={{ fontWeight: 900, fontSize: '0.7rem' }}>INT. SCORE</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.7rem' }}>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.slice(0, 5).map((student, idx) => {
                          const isRisk = attendanceMap[student._id] === 'A' || idx === 0 || idx === 2;
                          return (
                            <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                              <TableCell sx={{ py: 2 }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', fontWeight: 900, bgcolor: 'secondary.main', borderRadius: 1.5 }}>{student.name[0]}</Avatar>
                                  <Box>
                                    <Typography variant="body2" fontWeight={800} color="secondary" sx={{ fontSize: '0.8rem', lineHeight: 1 }}>{student.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{student.email}</Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={isRisk ? "CRITICAL" : "LOW"}
                                  size="small"
                                  sx={{
                                    height: 20, fontSize: '0.6rem', fontWeight: 900,
                                    bgcolor: isRisk ? 'rgba(211,47,47,0.1)' : 'rgba(46,125,50,0.1)',
                                    color: isRisk ? '#d32f2f' : '#2e7d32',
                                    borderRadius: 1.5
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight={800} color={isRisk ? "error.main" : "secondary"}>{isRisk ? "64%" : "98%"}</Typography>
                                  <LinearProgress variant="determinate" value={isRisk ? 64 : 98} sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { bgcolor: isRisk ? '#d32f2f' : '#2e7d32' } }} />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight={800} color={isRisk ? "error.main" : "primary.main"}>{isRisk ? "Failed" : "28/40"}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Button size="small" variant="contained" sx={{ py: 0.5, px: 1, minWidth: 0, fontSize: '0.65rem', borderRadius: 1.5, bgcolor: isRisk ? '#d32f2f' : 'secondary.main' }}>Resolve</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
                <Stack spacing={3} sx={{ height: '100%' }}>
                  {/* Alerts Card */}
                  <Card sx={{ border: '1px solid rgba(232, 57, 29, 0.15)', bgcolor: 'rgba(232, 57, 29, 0.02)' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(232, 57, 29, 0.1)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="subtitle2" fontWeight={900} color="primary.main">OPERATIONAL ALERTS</Typography>
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1.5}>
                        {[
                          { text: 'Ahmed Khan leave limit nearing (9/10)', type: 'error' },
                          { text: '3 students below 75% attendance', type: 'warning' },
                          { text: 'Interviews pending evaluation: 4', type: 'info' },
                        ].map((alert, i) => (
                          <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
                            <Box sx={{ width: 4, height: 'auto', borderRadius: 2, bgcolor: alert.type === 'error' ? '#d32f2f' : alert.type === 'warning' ? '#ed6c02' : '#0288d1' }} />
                            <Typography variant="caption" fontWeight={800} color="secondary" sx={{ lineHeight: 1.4 }}>{alert.text}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Leaderboard Card */}
                  <Card sx={{ flexGrow: 1, border: '1px solid rgba(0,0,0,0.06)' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp sx={{ fontSize: 18, color: '#2e7d32' }} />
                      <Typography variant="subtitle2" fontWeight={900}>TOP PERFORMERS</Typography>
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        {[
                          { name: 'Sara Ali', stat: '98.5% Score', badge: 'GOLD' },
                          { name: 'Umar Farooq', stat: '96.2% Score', badge: 'SILVER' },
                          { name: 'Zaid Mirza', stat: '95.0% Score', badge: 'BRONZE' },
                        ].map((st, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <Avatar sx={{
                              mr: 2,
                              width: 28, height: 28,
                              bgcolor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32',
                              fontWeight: 900, fontSize: '0.7rem', color: 'white'
                            }}>{idx + 1}</Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={900} sx={{ fontSize: '0.75rem' }}>{st.name}</Typography>
                              <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ fontSize: '0.6rem' }}>{st.badge}</Typography>
                            </Box>
                            <Typography variant="subtitle2" fontWeight={900} color="primary.main">{st.stat}</Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Box>

            </Box>
          )}

        </Box>

        {/* ======= LEAVE DETAIL MODAL ======= */}
        <Dialog open={leaveDetailOpen} onClose={() => setLeaveDetailOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          {selectedLeaveDetail && (
            <>
              <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1rem', letterSpacing: '0.05em' }}>LEAVE REQUEST DETAILS</Typography>
                  <Typography variant="caption" color="text.secondary">Applied on {selectedLeaveDetail.appliedOn}</Typography>
                </Box>
                <IconButton size="small" onClick={() => setLeaveDetailOpen(false)}><Close /></IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 48, height: 48, fontWeight: 900 }}>{selectedLeaveDetail.studentName[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={900} color="secondary">{selectedLeaveDetail.studentName}</Typography>
                      <Typography variant="caption" color="text.secondary">{selectedLeaveDetail.studentEmail}</Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Chip label={selectedLeaveDetail.status} size="small" sx={{ fontWeight: 900, ...(() => { const s = getLeaveStatusStyle(selectedLeaveDetail.status); return { bgcolor: s.bg, color: s.color, border: `1px solid ${s.border}` }; })(), borderRadius: 1.5 }} />
                    </Box>
                  </Stack>
                  <Divider />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {[
                      { label: 'Leave Type', value: selectedLeaveDetail.type },
                      { label: 'Duration', value: `${selectedLeaveDetail.days} day(s)` },
                      { label: 'From Date', value: selectedLeaveDetail.fromDate },
                      { label: 'To Date', value: selectedLeaveDetail.toDate },
                    ].map(({ label, value }) => (
                      <Box key={label} sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 1.5 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6rem' }}>{label}</Typography>
                        <Typography variant="body2" fontWeight={800} color="secondary" sx={{ mt: 0.3 }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, p: 2 }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.6rem' }}>REASON</Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, lineHeight: 1.7 }}>{selectedLeaveDetail.reason}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={selectedLeaveDetail.days * 10} sx={{ borderRadius: 4, height: 6, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { bgcolor: selectedLeaveDetail.days > 3 ? '#d32f2f' : '#2e7d32', borderRadius: 4 } }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>{selectedLeaveDetail.days} of 10 leave days used this month</Typography>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={() => setLeaveDetailOpen(false)} sx={{ color: 'text.secondary', fontWeight: 800, borderRadius: 2 }}>Close</Button>
                {selectedLeaveDetail.status === 'Pending' && (
                  <>
                    <Button onClick={() => { handleLeaveAction(selectedLeaveDetail.id, 'Rejected'); setLeaveDetailOpen(false); }} variant="outlined" color="error" sx={{ borderRadius: 2, fontWeight: 900, borderWidth: 2 }}>Reject</Button>
                    <Button onClick={() => { handleLeaveAction(selectedLeaveDetail.id, 'Approved'); setLeaveDetailOpen(false); }} variant="contained" sx={{ borderRadius: 2, fontWeight: 900, bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>Approve</Button>
                  </>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* ======= SCRUM EDIT MODAL ======= */}
        <Dialog open={scrumEditModal.open} onClose={() => setScrumEditModal({ ...scrumEditModal, open: false })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {scrumEditModal.title}
            </Typography>
            <IconButton size="small" onClick={() => setScrumEditModal({ ...scrumEditModal, open: false })}><Close /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            {scrumEditModal.open && (
              <TextField
                autoFocus
                multiline
                rows={6}
                fullWidth
                placeholder="Start typing..."
                value={scrumData[scrumEditModal.studentId]?.[scrumEditModal.field] || ''}
                onChange={(e) => handleUpdateScrum(scrumEditModal.studentId, scrumEditModal.field, e.target.value)}
                InputProps={{ sx: { fontSize: '0.9rem', borderRadius: 2, bgcolor: 'rgba(0,0,0,0.01)' } }}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setScrumEditModal({ ...scrumEditModal, open: false })} variant="contained" sx={{ borderRadius: 2, fontWeight: 900 }}>Done</Button>
          </DialogActions>
        </Dialog>

        {/* ======= INTERVIEW DETAIL MODAL ======= */}
        <Dialog open={interviewDetailModal.open} onClose={() => setInterviewDetailModal({ open: false, interview: null })} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          {interviewDetailModal.interview && (
            <>
              <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}>
                    Interview Details
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {interviewDetailModal.interview.module} Module
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setInterviewDetailModal({ open: false, interview: null })}><Close /></IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>STUDENT</Typography>
                    <Typography variant="body2" fontWeight={800} color="secondary">{interviewDetailModal.interview.student?.name}</Typography>
                    <Typography variant="caption" color="text.disabled">{interviewDetailModal.interview.student?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>INTERVIEWER</Typography>
                    <Typography variant="body2" fontWeight={800} color="secondary">{interviewDetailModal.interview.interviewer?.name || 'Unassigned'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>SCHEDULE</Typography>
                    <Typography variant="body2" fontWeight={800} color="secondary">{new Date(interviewDetailModal.interview.scheduledDate).toLocaleDateString()}</Typography>
                    <Typography variant="caption" color="text.disabled">{interviewDetailModal.interview.scheduledTime} ({interviewDetailModal.interview.mode})</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>RESULT</Typography>
                    <Typography variant="body2" fontWeight={900} color="primary.main" sx={{ fontSize: '1.2rem' }}>{interviewDetailModal.interview.score != null ? `${interviewDetailModal.interview.score}/${interviewDetailModal.interview.maxScore}` : 'Pending'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>FACILITATOR EVALUATION</Typography>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                      <Typography variant="body2" color={interviewDetailModal.interview.facilitatorEvaluation ? "text.primary" : "text.disabled"}>
                        {interviewDetailModal.interview.facilitatorEvaluation || "No evaluation notes provided."}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={() => setInterviewDetailModal({ open: false, interview: null })} variant="outlined" color="secondary" sx={{ borderRadius: 2, fontWeight: 800 }}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* ======= SCHEDULE INTERVIEW MODAL ======= */}
        <Dialog open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem' }}>{isEditingInterview ? 'Edit Interview' : 'Schedule Interview'}</Typography>
            </Box>
            <IconButton size="small" onClick={() => {
              setScheduleModalOpen(false);
              setIsEditingInterview(false);
              setSelectedInterviewForEdit(null);
            }}><Close /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Autocomplete
              options={studentsRes?.data || []}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={studentsRes?.data?.find(s => s._id === scheduleForm.student) || null}
              onChange={(e, newValue) => setScheduleForm({ ...scheduleForm, student: newValue ? newValue._id : '' })}
              renderInput={(params) => <TextField {...params} label="Student" size="small" />}
              fullWidth
            />
            <FormControl fullWidth size="small">
              <InputLabel>Interviewer</InputLabel>
              <Select label="Interviewer" value={scheduleForm.interviewer} onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}>
                <MenuItem value=""><em>None (Facilitator will conduct)</em></MenuItem>
                {(interviewersRes?.data?.data || interviewersRes?.data || []).map(i => (
                  <MenuItem key={i._id} value={i._id}>{i.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Module</InputLabel>
              <Select label="Module" value={scheduleForm.module} onChange={(e) => setScheduleForm({ ...scheduleForm, module: e.target.value })}>
                {['HTML & CSS', 'JavaScript Basics', 'React Foundations', 'Node.js Basics', 'Backend APIs', 'MongoDB Aggregation', 'Full Stack Integration'].map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Date" type="date" size="small" fullWidth
                value={scheduleForm.scheduledDate} onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                sx={{
                  '& input::-webkit-datetime-edit': { color: scheduleForm.scheduledDate ? 'inherit' : 'transparent' },
                  '& input:focus::-webkit-datetime-edit': { color: 'inherit' }
                }}
              />
              <TextField
                label="Time" type="time" size="small" fullWidth
                value={scheduleForm.scheduledTime} onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                sx={{
                  '& input::-webkit-datetime-edit': { color: scheduleForm.scheduledTime ? 'inherit' : 'transparent' },
                  '& input:focus::-webkit-datetime-edit': { color: 'inherit' }
                }}
              />
            </Stack>
            <FormControl fullWidth size="small">
              <InputLabel>Mode</InputLabel>
              <Select
                label="Mode"
                value={scheduleForm.mode}
                onChange={(e) => setScheduleForm({
                  ...scheduleForm,
                  mode: e.target.value,
                  generateMeetLink: e.target.value === 'online'
                })}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            {scheduleForm.mode === 'online' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Checkbox size="small" checked={scheduleForm.generateMeetLink} onChange={(e) => setScheduleForm({ ...scheduleForm, generateMeetLink: e.target.checked })} />
                <Typography variant="caption" fontWeight={800} color="primary.main">Auto-generate Google Meet link</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => {
              setScheduleModalOpen(false);
              setIsEditingInterview(false);
              setSelectedInterviewForEdit(null);
            }} color="secondary" sx={{ fontWeight: 800 }}>Cancel</Button>
            <Button onClick={() => {
              const payload = { ...scheduleForm, batch: id, course: batch?.course?._id };
              if (!payload.interviewer) delete payload.interviewer;
              if (isEditingInterview && selectedInterviewForEdit) {
                updateInterviewMutation.mutate({ intvId: selectedInterviewForEdit._id, data: payload });
              } else {
                scheduleMutation.mutate(payload);
              }
            }} variant="contained" color="primary" sx={{ fontWeight: 800 }}>{isEditingInterview ? 'Save Changes' : 'Schedule'}</Button>
          </DialogActions>
        </Dialog>

        {/* ======= RECORD SCORE MODAL ======= */}
        <Dialog open={scoreModalOpen} onClose={() => setScoreModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <School color="primary" />
              <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.2rem' }}>Performance Scores</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setScoreModalOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#fafafa' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 3, borderColor: '#1976d2', height: '100%', bgcolor: '#fff' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#1976d2" sx={{ mb: 3 }}>Academic Performance</Typography>
                  <Stack spacing={3}>
                    <TextField label="Review Score (out of 10)" type="number" size="small" fullWidth value={scoreForm.reviewScore} onChange={(e) => setScoreForm({ ...scoreForm, reviewScore: e.target.value })} inputProps={{ min: 0, max: 10, step: 0.5 }} />
                    <TextField label="Task Score (out of 10)" type="number" size="small" fullWidth value={scoreForm.taskScore} onChange={(e) => setScoreForm({ ...scoreForm, taskScore: e.target.value })} inputProps={{ min: 0, max: 10, step: 0.5 }} />
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 3, borderColor: '#9c27b0', height: '100%', bgcolor: '#fff' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#9c27b0" sx={{ mb: 3 }}>Other Metrics</Typography>
                  <Stack spacing={3}>
                    <TextField label="Attendance (out of 10)" type="number" size="small" fullWidth value={scoreForm.attendanceScore} onChange={(e) => setScoreForm({ ...scoreForm, attendanceScore: e.target.value })} inputProps={{ min: 0, max: 10, step: 0.5 }} />
                    <TextField label="Discipline (out of 10)" type="number" size="small" fullWidth value={scoreForm.disciplineScore} onChange={(e) => setScoreForm({ ...scoreForm, disciplineScore: e.target.value })} inputProps={{ min: 0, max: 10, step: 0.5 }} />
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            <Card variant="outlined" sx={{ borderRadius: 2, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: '#2e7d32', bgcolor: '#f1f8e9' }}>
              <Typography variant="subtitle1" fontWeight={900} color="#1b5e20">Total Score</Typography>
              <Typography variant="h5" fontWeight={900} color="#1b5e20">{(() => {
                const r = Number(scoreForm.reviewScore) || 0;
                const t = Number(scoreForm.taskScore) || 0;
                const a = Number(scoreForm.attendanceScore) || 0;
                const d = Number(scoreForm.disciplineScore) || 0;
                const total = r + t + a + d;
                const perc = ((total / 40) * 100).toFixed(2);
                return `${total} / 40 (${perc}%)`;
              })()}</Typography>
            </Card>

            <Stack direction="row" spacing={2}>
              <TextField label="Current Attempt" type="number" size="small" fullWidth value={scoreForm.reInterviewAttempt} onChange={(e) => setScoreForm({ ...scoreForm, reInterviewAttempt: e.target.value })} inputProps={{ min: 0 }} />
              <TextField label="Max Re-Interview Limit" type="number" size="small" fullWidth value={scoreForm.maxReInterviewLimit} onChange={(e) => setScoreForm({ ...scoreForm, maxReInterviewLimit: e.target.value })} inputProps={{ min: 1 }} />
            </Stack>

            <TextField label="Facilitator Evaluation" multiline rows={3} size="small" fullWidth value={scoreForm.facilitatorEvaluation} onChange={(e) => setScoreForm({ ...scoreForm, facilitatorEvaluation: e.target.value })} sx={{ bgcolor: '#fff' }} />
            <FormControl fullWidth size="small" sx={{ bgcolor: '#fff' }}>
              <InputLabel>Result</InputLabel>
              <Select label="Result" value={scoreForm.isPass} onChange={(e) => setScoreForm({ ...scoreForm, isPass: e.target.value })}>
                <MenuItem value={true}>Passed</MenuItem>
                <MenuItem value={false}>Failed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <Button onClick={() => setScoreModalOpen(false)} color="secondary" sx={{ fontWeight: 800 }}>Cancel</Button>
            <Button onClick={() => scoreMutation.mutate({ intvId: selectedInterviewForScore._id, data: scoreForm })} variant="contained" color="primary" sx={{ fontWeight: 800 }}>Save Score</Button>
          </DialogActions>
        </Dialog>

        {/* ======= SCHEDULE RE-INTERVIEW MODAL ======= */}
        <Dialog open={reInterviewModalOpen} onClose={() => setReInterviewModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={900} sx={{ fontSize: '1.1rem' }}>Schedule Re-Interview</Typography>
              <Typography variant="caption" color="error.main" fontWeight={700}>Attempt {selectedInterviewForScore ? selectedInterviewForScore.reInterviewAttempt + 1 : 1} of {selectedInterviewForScore?.maxReInterviewLimit}</Typography>
            </Box>
            <IconButton size="small" onClick={() => setReInterviewModalOpen(false)}><Close /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Date" type="date" size="small" fullWidth
                value={scheduleForm.scheduledDate} onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                sx={{
                  '& input::-webkit-datetime-edit': { color: scheduleForm.scheduledDate ? 'inherit' : 'transparent' },
                  '& input:focus::-webkit-datetime-edit': { color: 'inherit' }
                }}
              />
              <TextField
                label="Time" type="time" size="small" fullWidth
                value={scheduleForm.scheduledTime} onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                sx={{
                  '& input::-webkit-datetime-edit': { color: scheduleForm.scheduledTime ? 'inherit' : 'transparent' },
                  '& input:focus::-webkit-datetime-edit': { color: 'inherit' }
                }}
              />
            </Stack>
            <FormControl fullWidth size="small">
              <InputLabel>Mode</InputLabel>
              <Select
                label="Mode"
                value={scheduleForm.mode}
                onChange={(e) => setScheduleForm({
                  ...scheduleForm,
                  mode: e.target.value,
                  generateMeetLink: e.target.value === 'online'
                })}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
            {scheduleForm.mode === 'online' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Checkbox size="small" checked={scheduleForm.generateMeetLink} onChange={(e) => setScheduleForm({ ...scheduleForm, generateMeetLink: e.target.checked })} />
                <Typography variant="caption" fontWeight={800} color="primary.main">Auto-generate Google Meet link</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setReInterviewModalOpen(false)} color="secondary" sx={{ fontWeight: 800 }}>Cancel</Button>
            <Button onClick={() => reInterviewMutation.mutate({ intvId: selectedInterviewForScore._id, data: { scheduledDate: scheduleForm.scheduledDate, scheduledTime: scheduleForm.scheduledTime, mode: scheduleForm.mode, generateMeetLink: scheduleForm.generateMeetLink } })} variant="contained" color="error" sx={{ fontWeight: 800 }}>Schedule Re-Interview</Button>
          </DialogActions>
        </Dialog>

      </AppShell>
    </ThemeProvider>
  );
};

export default BatchDetail;
