import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeStudentStatus } from '../../api/students.api';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
  TextField, 
  InputAdornment, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Divider as MuiDivider,
  TablePagination
} from '@mui/material';
import { 
  Search, 
  Edit,
  Delete,
  Message,
  Gavel,
  Send,
  Email,
  Badge,
  CalendarMonth,
  School,
  WarningAmber,
  FiberManualRecord
} from '@mui/icons-material';

const INITIAL_STUDENTS = [
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

const AttendanceRoster = ({ batchId, searchQuery = '', sortBy = 'name', statusFilter = 'all', dbStudents = [] }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('staxhaus_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Sync real database students with our local storage roster
  useEffect(() => {
    if (!dbStudents || dbStudents.length === 0) return;

    // Load existing roster from localStorage
    const saved = localStorage.getItem('staxhaus_students');
    let localRoster = saved ? JSON.parse(saved) : INITIAL_STUDENTS;

    let updated = false;

    // Map each dbStudent to a roster entry
    const mergedRoster = dbStudents.map(dbStudent => {
      // Find in localStorage roster
      let existing = localRoster.find(s => s._id === dbStudent._id || s.email === dbStudent.email);
      if (existing) {
        // If status in dbStudent has changed (e.g. from changeStudentStatus API), update it
        const dbStatusMapped = dbStudent.status === 'active' ? 'Active' : dbStudent.status === 'discontinued' ? 'Suspended' : dbStudent.status === 'terminated' ? 'Terminated' : dbStudent.status;
        if (existing.status !== dbStatusMapped) {
          existing.status = dbStatusMapped;
          updated = true;
        }
        // Save database _id if not present
        if (!existing._id) {
          existing._id = dbStudent._id;
          updated = true;
        }
        return existing;
      } else {
        // Create new entry
        const status = dbStudent.status === 'active' ? 'Active' : dbStudent.status === 'discontinued' ? 'Suspended' : dbStudent.status === 'terminated' ? 'Terminated' : (dbStudent.status || 'Active');
        const newEntry = {
          id: localRoster.length + 1 + Math.random(), // unique local id
          _id: dbStudent._id,
          name: dbStudent.name,
          email: dbStudent.email,
          status: status,
          batch: dbStudent.batchName || 'B-1',
          batchId: dbStudent.batch,
          joinDate: dbStudent.createdAt ? new Date(dbStudent.createdAt).toISOString().split('T')[0] : '2023-10-15',
          course: dbStudent.courseName || 'Full Stack Development',
          attendance: `${dbStudent.attendancePercentage || 94}%`,
          academicHealth: dbStudent.attendancePercentage && dbStudent.attendancePercentage < 75 ? 'Critical Risk' : 'Good Standing',
          interviewStatus: 'Scheduled',
          leaveStatus: 'None'
        };
        localRoster.push(newEntry);
        updated = true;
        return newEntry;
      }
    });

    if (updated) {
      localStorage.setItem('staxhaus_students', JSON.stringify(localRoster));
    }

    setStudents(mergedRoster);
  }, [dbStudents]);

  useEffect(() => {
    // Only update localStorage if students contains data and it's not a pure initial load
    if (students.length > 0) {
      const saved = localStorage.getItem('staxhaus_students');
      let currentRoster = saved ? JSON.parse(saved) : INITIAL_STUDENTS;
      // Sync local updates back to the roster store
      const updatedRoster = currentRoster.map(rItem => {
        const match = students.find(s => s.id === rItem.id || s._id === rItem._id || s.email === rItem.email);
        return match ? { ...rItem, ...match } : rItem;
      });
      localStorage.setItem('staxhaus_students', JSON.stringify(updatedRoster));
    }
  }, [students]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Standard senior developer density defaults to 10 rows
  
  // Dialog States
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form States
  const [adminAction, setAdminAction] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [messageText, setMessageText] = useState('');
  const [editForm, setEditForm] = useState({ name: '', email: '', status: '', batch: '' });

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = batchId === 'all' || s.batchId === batchId || s.batch === batchId;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesBatch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'joinDate') return new Date(b.joinDate) - new Date(a.joinDate);
    if (sortBy === 'attendance') return parseInt(b.attendance) - parseInt(a.attendance);
    return 0;
  });

  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAction = (student) => {
    setSelectedStudent(student);
    setOpenActionDialog(true);
  };

  const handleOpenMessage = (student) => {
    setSelectedStudent(student);
    setOpenMessageDialog(true);
  };

  const handleOpenView = (student) => {
    navigate(`/student-profile/${student._id || student.id}`);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({ name: student.name, email: student.email, status: student.status, batch: student.batch });
    setOpenEditDialog(true);
  };

  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenActionDialog(false);
    setOpenMessageDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setAdminAction('');
    setActionReason('');
    setMessageText('');
  };

  // Real actions
  const handleSaveEdit = () => {
    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...editForm } : s));
    handleClose();
  };

  const handleDeleteConfirm = () => {
    setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
    handleClose();
  };

  const handleConfirmAction = async () => {
    let backendStatus = '';
    if (adminAction === 'terminate') {
      backendStatus = 'terminated';
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, status: 'Terminated' } : s));
    } else if (adminAction === 'suspend') {
      backendStatus = 'discontinued';
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, status: 'Suspended' } : s));
    } else if (adminAction === 'warn') {
      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, academicHealth: 'Needs Review' } : s));
    }

    // Call backend API if it's a real db student and status changes
    if (selectedStudent._id && backendStatus) {
      try {
        await changeStudentStatus(selectedStudent._id, {
          status: backendStatus,
          remark: actionReason || 'Disciplinary action applied from facilitator console'
        });
      } catch (err) {
        console.error("Failed to update student status in backend:", err);
      }
    }
    handleClose();
  };

  const handleSendMessage = () => {
    console.log(`Sending message to ${selectedStudent.name}: ${messageText}`);
    handleClose();
  };

  return (
    <>
      <Card sx={{ 
        borderRadius: '8px', 
        overflow: 'hidden', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)', 
        border: '1px solid rgba(0,0,0,0.06)',
        bgcolor: 'white'
      }}>
        <Box sx={{ 
          py: 2, 
          px: 3, 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 2
        }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>
              Student Directory
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 500 }}>
              {batchId === 'all' ? 'Showing all enrolled students across batches' : `Active student list for batch ${batchId}`}
            </Typography>
          </Box>

          <Chip 
            label={`${filteredStudents.length} Students`} 
            size="small" 
            sx={{ 
              fontWeight: 600, 
              fontSize: '0.75rem', 
              borderRadius: '6px',
              bgcolor: '#1E2126',
              color: 'white',
              height: '22px'
            }} 
          />
        </Box>

        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', bgcolor: 'rgba(0,0,0,0.01)' }}>
                  <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5, pl: 3 }}>Student Info</TableCell>
                  <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5 }}>Batch / Enrolled</TableCell>
                  <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5 }}>Attendance</TableCell>
                  <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5 }}>Academic Health</TableCell>
                  <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5 }}>Interviews</TableCell>
                  <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5 }}>Leave Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.675rem', letterSpacing: '0.08em', color: '#4b5563', py: 1.5, pr: 3 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => {
                  const isLowAttendance = parseInt(student.attendance) < 75;
                  const isSuspended = student.status === 'Suspended';
                  const isTerminated = student.status === 'Terminated';
                  
                  return (
                    <TableRow 
                      key={student.id} 
                      sx={{ 
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' },
                        opacity: isTerminated ? 0.55 : 1,
                        bgcolor: isTerminated ? 'rgba(0,0,0,0.01)' : 'inherit'
                      }}
                    >
                      {/* 1. Student Info */}
                      <TableCell 
                        onClick={() => handleOpenView(student)}
                        sx={{ 
                          py: 1.25, 
                          pl: 3,
                          cursor: 'pointer',
                          '&:hover .student-name': { color: 'primary.main' }
                        }}
                      >
                        <Stack 
                          direction="row" 
                          spacing={1.5} 
                          alignItems="center"
                        >
                          <Avatar sx={{ 
                            width: 30, 
                            height: 30, 
                            bgcolor: isTerminated ? '#9ca3af' : isSuspended ? '#f59e0b' : '#1E2126', 
                            fontSize: '0.8rem', 
                            fontWeight: 700, 
                            borderRadius: '6px',
                            fontFamily: 'Outfit'
                          }}>
                            {student.name[0]}
                          </Avatar>
                          <Box>
                            <Typography 
                              className="student-name"
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.825rem', 
                                color: '#111827',
                                transition: 'color 0.15s ease',
                                textDecoration: isTerminated ? 'line-through' : 'none' 
                              }}
                            >
                              {student.name}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: '#6b7280', 
                              fontWeight: 500,
                              fontSize: '0.7rem' 
                            }}>
                              {student.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* 2. Batch / Enrolled */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Box>
                          <Chip 
                            label={student.batch} 
                            size="small" 
                            sx={{ 
                              fontWeight: 700, 
                              borderRadius: '4px', 
                              height: '20px', 
                              fontSize: '0.675rem',
                              bgcolor: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid rgba(0,0,0,0.04)'
                            }} 
                          />
                          <Typography variant="caption" display="block" sx={{ color: '#9ca3af', fontSize: '0.65rem', mt: 0.25, fontWeight: 500 }}>
                            Joined {student.joinDate}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* 3. Attendance */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Box sx={{ width: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ 
                              fontWeight: 700, 
                              fontSize: '0.725rem',
                              color: isLowAttendance ? '#ef4444' : '#374151' 
                            }}>
                              {student.attendance}
                            </Typography>
                            {isLowAttendance && (
                              <Tooltip title="Critical Attendance Risk (< 75%)">
                                <WarningAmber sx={{ color: '#ef4444', fontSize: 13, ml: 0.5 }} />
                              </Tooltip>
                            )}
                          </Box>
                          <Box sx={{ width: '100%', height: 4, bgcolor: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ 
                              width: student.attendance, 
                              height: '100%', 
                              bgcolor: isLowAttendance ? '#ef4444' : parseInt(student.attendance) < 90 ? '#f59e0b' : '#10b981',
                              borderRadius: 2 
                            }} />
                          </Box>
                        </Box>
                      </TableCell>

                      {/* 4. Academic Health */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <FiberManualRecord sx={{ 
                            fontSize: 8, 
                            color: 
                              student.academicHealth === 'Excellent' ? '#10b981' :
                              student.academicHealth === 'Good Standing' ? '#3b82f6' :
                              student.academicHealth === 'Needs Review' ? '#f59e0b' : '#ef4444'
                          }} />
                          <Typography variant="body2" sx={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            color: 
                              student.academicHealth === 'Excellent' ? '#047857' :
                              student.academicHealth === 'Good Standing' ? '#1d4ed8' :
                              student.academicHealth === 'Needs Review' ? '#b45309' : '#b91c1c'
                          }}>
                            {student.academicHealth}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* 5. Interviews */}
                      <TableCell sx={{ py: 1.25 }}>
                        <Chip 
                          label={student.interviewStatus} 
                          size="small" 
                          sx={{ 
                            fontWeight: 600, 
                            borderRadius: '4px', 
                            height: '20px', 
                            fontSize: '0.675rem',
                            bgcolor: 
                              student.interviewStatus === 'Mock Cleared' ? 'rgba(16, 185, 129, 0.08)' :
                              student.interviewStatus === 'Scheduled' ? 'rgba(59, 130, 246, 0.08)' :
                              student.interviewStatus === 'Pending Review' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(156, 163, 175, 0.08)',
                            color: 
                              student.interviewStatus === 'Mock Cleared' ? '#047857' :
                              student.interviewStatus === 'Scheduled' ? '#1d4ed8' :
                              student.interviewStatus === 'Pending Review' ? '#b45309' : '#4b5563',
                          }} 
                        />
                      </TableCell>

                      {/* 6. Leave status */}
                      <TableCell sx={{ py: 1.25 }}>
                        {student.leaveStatus !== 'None' ? (
                          <Chip 
                            label={student.leaveStatus} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600, 
                              borderRadius: '4px', 
                              height: '20px', 
                              fontSize: '0.675rem',
                              bgcolor: student.leaveStatus === 'Active Leave' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                              color: student.leaveStatus === 'Active Leave' ? '#b91c1c' : '#b45309',
                            }} 
                          />
                        ) : (
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.7rem' }}>
                            None active
                          </Typography>
                        )}
                      </TableCell>

                      {/* 7. Status */}
                      <TableCell align="center" sx={{ py: 1.25 }}>
                        <Chip 
                          label={student.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 700, 
                            fontSize: '0.675rem',
                            borderRadius: '6px',
                            height: '20px',
                            bgcolor: 
                              student.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 
                              student.status === 'Terminated' ? 'rgba(239, 68, 68, 0.1)' : 
                              student.status === 'Suspended' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(156, 163, 175, 0.1)', 
                            color: 
                              student.status === 'Active' ? '#10b981' : 
                              student.status === 'Terminated' ? '#ef4444' : 
                              student.status === 'Suspended' ? '#f59e0b' : '#6b7280',
                            minWidth: 70
                          }} 
                        />
                      </TableCell>

                      {/* 8. Actions */}
                      <TableCell align="right" sx={{ py: 1.25, pr: 3 }}>
                        <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                          <Tooltip title={isTerminated ? "Cannot message terminated student" : "Send Message"}>
                            <span>
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenMessage(student)} 
                                disabled={isTerminated}
                                sx={{ 
                                  color: '#6b7280',
                                  borderRadius: '6px',
                                  p: 0.75,
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', color: 'primary.main' }
                                }}
                              >
                                <Message sx={{ fontSize: 16 }} />
                              </IconButton>
                            </span>
                          </Tooltip>

                          <Tooltip title="Administrative Action">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenAction(student)}
                              sx={{ 
                                color: '#6b7280',
                                borderRadius: '6px',
                                p: 0.75,
                                '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }
                              }}
                            >
                              <Gavel sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>



                          <Tooltip title={isTerminated ? "Cannot edit terminated student" : "Edit Info"}>
                            <span>
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenEdit(student)} 
                                disabled={isTerminated}
                                sx={{ 
                                  color: '#6b7280',
                                  borderRadius: '6px',
                                  p: 0.75,
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', color: '#3b82f6' }
                                }}
                              >
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                            </span>
                          </Tooltip>

                          <Tooltip title="Delete Record">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenDelete(student)}
                              sx={{ 
                                color: '#ef4444',
                                borderRadius: '6px',
                                p: 0.75,
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#b91c1c' }
                              }}
                            >
                              <Delete sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        No students match the current filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              bgcolor: 'rgba(0,0,0,0.01)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                color: '#4b5563'
              },
              '& .MuiTablePagination-select': {
                fontWeight: 700
              }
            }}
          />
        </CardContent>
      </Card>


      {/* Edit Student Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.1rem', 
          color: '#111827', 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          py: 2.2, 
          px: 3 
        }}>
          Edit Student Information
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '24px !important' }}>
          <Stack spacing={2.5}>
            <TextField 
              label="Full Name" 
              fullWidth 
              size="small"
              value={editForm.name} 
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem' } }}
            />
            <TextField 
              label="Email Address" 
              fullWidth 
              size="small"
              value={editForm.email} 
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem' } }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editForm.status}
                    label="Status"
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    sx={{ borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                 <TextField 
                  label="Batch" 
                  fullWidth 
                  size="small"
                  value={editForm.batch} 
                  onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem' } }}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              fontWeight: 600, 
              color: '#4b5563', 
              textTransform: 'none',
              fontSize: '0.8rem',
              borderRadius: '6px',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              boxShadow: 'none',
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: '#b91c1c', boxShadow: 'none' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.1rem', 
          color: '#111827', 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          py: 2.2, 
          px: 3 
        }}>
          Confirm Student Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '20px !important' }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#4b5563' }}>
            Are you absolutely sure you want to delete the student record for <strong>{selectedStudent?.name}</strong>? All attendance logs, profile details, and evaluation indicators will be permanently purged. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              fontWeight: 600, 
              color: '#4b5563', 
              textTransform: 'none',
              fontSize: '0.8rem',
              borderRadius: '6px',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error" 
            sx={{ 
              boxShadow: 'none',
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Delete Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Administrative Action Dialog */}
      <Dialog 
        open={openActionDialog} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.1rem', 
          color: '#111827', 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          py: 2.2, 
          px: 3 
        }}>
          Administrative Action
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '24px !important' }}>
          <Stack spacing={2.5}>
            <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.825rem' }}>
              Enforce disciplinary or status changes for <strong>{selectedStudent?.name}</strong>.
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Action Type</InputLabel>
              <Select
                value={adminAction}
                label="Action Type"
                onChange={(e) => setAdminAction(e.target.value)}
                sx={{ borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <MenuItem value="warn">Official Academic Warning</MenuItem>
                <MenuItem value="suspend">Temporary Suspension</MenuItem>
                <MenuItem value="terminate">Immediate Termination (Expel)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Action Reason & Reference Details"
              multiline
              rows={3}
              fullWidth
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="State clear reasons or log details for future administrative reference..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              fontWeight: 600, 
              color: '#4b5563', 
              textTransform: 'none',
              fontSize: '0.8rem',
              borderRadius: '6px',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color="error" 
            disableElevation
            disabled={!adminAction}
            sx={{ 
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { boxShadow: 'none' }
            }}
          >
            Confirm Action
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog 
        open={openMessageDialog} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.1rem', 
          color: '#111827', 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          py: 2.2, 
          px: 3 
        }}>
          Direct Faciliator Message
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '20px !important' }}>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: '#4b5563', fontSize: '0.825rem' }}>
              Send an instant notification/email copy to <strong>{selectedStudent?.name}</strong>.
            </Typography>
            <TextField
              autoFocus
              label="Message Body"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter message text, warning warning, or action details..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.85rem' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              fontWeight: 600, 
              color: '#4b5563', 
              textTransform: 'none',
              fontSize: '0.8rem',
              borderRadius: '6px',
            }}
          >
            Discard
          </Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            disableElevation
            startIcon={<Send sx={{ fontSize: 12 }} />}
            disabled={!messageText}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              boxShadow: 'none',
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              '&:hover': { bgcolor: '#b91c1c', boxShadow: 'none' }
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttendanceRoster;
