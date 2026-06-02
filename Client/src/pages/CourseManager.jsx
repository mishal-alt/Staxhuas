import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
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
  MenuItem,
  Dialog,
  IconButton,
  Chip,
  Paper,
  Divider,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Add,
  School,
  Close,
  ExpandMore,
  Book,
  Assignment,
  Settings,
  ChevronRight,
  Edit,
  Delete,
  AccessTime,
  NavigateNext
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as courseApi from '../api/courses.api';

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
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '10px 20px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0,0,0,0.03)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          }
        }
      }
    }
  }
});

const CourseManager = () => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const detailsRef = useRef(null);

  const { data: coursesRes, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getCourses,
  });

  const { data: modulesRes, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', selectedCourse?._id],
    queryFn: () => courseApi.getModules(selectedCourse._id),
    enabled: !!selectedCourse?._id,
  });

  const createCourseMutation = useMutation({
    mutationFn: (data) => {
      if (editingCourse) {
        return courseApi.updateCourse(editingCourse._id, data);
      }
      return courseApi.createCourse(data);
    },
    onSuccess: () => {
      toast.success(editingCourse ? 'Course updated' : 'Course created');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setShowCourseForm(false);
      setEditingCourse(null);
      resetCourse();
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id) => courseApi.deleteCourse(id),
    onSuccess: () => {
      toast.success('Course track deleted');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setSelectedCourse(null);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const createModuleMutation = useMutation({
    mutationFn: (data) => {
      if (editingModule) {
        return courseApi.updateModule(editingModule._id, data);
      }
      const payload = {
        ...data,
        orderIndex: modules.length + 1
      };
      return courseApi.createModule(selectedCourse._id, payload);
    },
    onSuccess: () => {
      toast.success(editingModule ? 'Module updated' : 'Module created');
      queryClient.invalidateQueries({ queryKey: ['modules', selectedCourse?._id] });
      setShowModuleForm(false);
      setEditingModule(null);
      resetModule();
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => {
      if (editingTask) {
        return courseApi.updateTask(editingTask._id, data);
      }
      return courseApi.createTask(activeModuleId, data);
    },
    onSuccess: () => {
      toast.success(editingTask ? 'Task updated' : 'Task created');
      queryClient.invalidateQueries({ queryKey: ['modules', selectedCourse?._id] });
      setShowTaskForm(false);
      setEditingTask(null);
      resetTask();
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (id) => courseApi.deleteModule(id),
    onSuccess: () => {
      toast.success('Module deleted');
      queryClient.invalidateQueries({ queryKey: ['modules', selectedCourse?._id] });
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => courseApi.deleteTask(id),
    onSuccess: () => {
      toast.success('Task deleted');
      queryClient.invalidateQueries({ queryKey: ['modules', selectedCourse?._id] });
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const { register: regCourse, handleSubmit: handleCourseSubmit, reset: resetCourse } = useForm();
  const { register: regModule, handleSubmit: handleModuleSubmit, reset: resetModule } = useForm();
  const { register: regTask, handleSubmit: handleTaskSubmit, reset: resetTask } = useForm();

  if (coursesLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const courses = coursesRes?.data || [];
  const modules = modulesRes?.data || [];
  const activeModule = modules.find(m => m._id === activeModuleId);

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
                  COURSES
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
                  <Book fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Course Manager
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Design and refine your master course tracks
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCourseForm(true)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}
            >
              New Course
            </Button>
          </Box>


          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>

                {/* Course Selection Cards - Top Wrapping Layout */}
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 1.5, sm: 2 },
                  pb: 2,
                  px: { xs: 1, sm: 2 }
                }}>
                  {courses.map((course) => (
                    <Card
                      key={course._id}
                      onClick={() => {
                        setSelectedCourse(course);
                        setTimeout(() => {
                          detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      sx={{
                        width: { xs: 'calc(50% - 12px)', sm: 230 },
                        minWidth: { xs: 'auto', sm: 230 },
                        height: { xs: 110, sm: 140 },
                        flexShrink: 0,
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: selectedCourse?._id === course._id ? 'primary.main' : 'rgba(0,0,0,0.04)',
                        background: 'white',
                        boxShadow: selectedCourse?._id === course._id ? '0 12px 24px rgba(232, 57, 29, 0.12)' : '0 4px 12px rgba(0,0,0,0.03)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
                          borderColor: selectedCourse?._id === course._id ? 'primary.main' : 'rgba(232, 57, 29, 0.3)'
                        }
                      }}
                    >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900} sx={{
                          lineHeight: 1.2,
                          mb: 0.5,
                          color: selectedCourse?._id === course._id ? 'primary.main' : 'text.primary'
                        }}>
                          {course.name}
                        </Typography>
                        <Chip
                          label={`${course.durationMonths} MONTHS`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            bgcolor: selectedCourse?._id === course._id ? 'primary.main' : 'rgba(0,0,0,0.05)',
                            color: selectedCourse?._id === course._id ? 'white' : 'text.secondary'
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ChevronRight sx={{
                          color: selectedCourse?._id === course._id ? 'primary.main' : 'text.disabled',
                          transform: selectedCourse?._id === course._id ? 'translateX(4px)' : 'none',
                          transition: 'transform 0.2s'
                        }} />
                      </Box>

                      {/* Subtle background decoration */}
                      <School sx={{
                        position: 'absolute',
                        right: -10,
                        bottom: -10,
                        fontSize: 80,
                        opacity: selectedCourse?._id === course._id ? 0.08 : 0.03,
                        color: 'primary.main',
                        transform: 'rotate(-15deg)'
                      }} />
                    </CardContent>
                  </Card>
                ))}

                {courses.length === 0 && (
                  <Paper sx={{
                    p: 4,
                    flexGrow: 1,
                    textAlign: 'center',
                    bgcolor: 'action.hover',
                    borderRadius: 4,
                    border: '1px dashed rgba(0,0,0,0.1)'
                  }}>
                    <Typography variant="body2" color="text.secondary">No courses found. Create your first course track.</Typography>
                  </Paper>
                )}
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ opacity: 0.6 }} />

          <Box sx={{ mt: 1 }} ref={detailsRef}>
            {/* Course Detail / Modules - Bottom Layout */}
            <Box sx={{ width: '100%', scrollMarginTop: '20px' }}>
              {selectedCourse ? (
                <Stack spacing={4}>
                  <Box sx={{
                    p: { xs: 2.5, sm: 4 },
                    bgcolor: 'secondary.main',
                    color: 'white',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover .course-header-actions': { opacity: 1 }
                  }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h5" fontWeight={900} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{selectedCourse.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: { xs: '100%', sm: '80%' } }}>{selectedCourse.description}</Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      className="course-header-actions"
                      sx={{
                        opacity: { xs: 1, sm: 0 },
                        transition: 'opacity 0.2s',
                        position: 'absolute',
                        top: { xs: 12, sm: 24 },
                        right: { xs: 12, sm: 24 },
                        zIndex: 2
                      }}
                    >
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }} onClick={() => {
                        setEditingCourse(selectedCourse);
                        resetCourse(selectedCourse);
                        setShowCourseForm(true);
                      }}>
                        <Edit sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }} onClick={() => {
                        if (confirm('Delete this course track?')) deleteCourseMutation.mutate(selectedCourse._id);
                      }}>
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setShowModuleForm(true)}
                      sx={{
                        position: 'absolute',
                        bottom: { xs: 12, sm: 24 },
                        right: { xs: 12, sm: 24 },
                        zIndex: 2,
                        borderRadius: 2,
                        px: { xs: 1.5, sm: 3 },
                        py: { xs: 0.8, sm: 1 },
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        minWidth: 'auto',
                        bgcolor: 'white',
                        color: 'secondary.main',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Add Module</Box>
                      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
                    </Button>

                    <School sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 180, opacity: 0.05, transform: 'rotate(-15deg)' }} />
                  </Box>

                  <Typography variant="h6" color="secondary" sx={{ fontWeight: 800, mt: 1 }}>
                    Modules & Learning Path
                  </Typography>

                  <Stack spacing={2}>
                    {modulesLoading ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                    ) : modules.map((module, index) => (
                      <Accordion key={module._id} sx={{
                        borderRadius: '4px !important',
                        '&:before': { display: 'none' },
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: 'none',
                        '&.Mui-expanded': { border: '2px solid #E8391D' },
                        '&:hover .module-actions': { opacity: 1 }
                      }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'primary.main' }}>
                              {index + 1}
                            </Box>
                            <Typography fontWeight={900} sx={{ flexGrow: 1 }}>{module.name}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2, color: 'text.secondary' }}>
                              <AccessTime sx={{ fontSize: 16 }} />
                              <Typography variant="caption" fontWeight={700}>{module.durationWeeks} WEEKS</Typography>
                            </Stack>
                            <Stack direction="row" className="module-actions" sx={{ 
                              opacity: { xs: 1, sm: 0 }, 
                              transition: 'opacity 0.2s' 
                            }}>
                              <IconButton size="small" color="primary" onClick={(e) => {
                                e.stopPropagation();
                                setEditingModule(module);
                                resetModule(module);
                                setShowModuleForm(true);
                              }}><Edit sx={{ fontSize: 18 }} /></IconButton>
                              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); if (confirm('Delete module?')) deleteModuleMutation.mutate(module._id); }}><Delete sx={{ fontSize: 18 }} /></IconButton>
                            </Stack>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
                          <Stack spacing={3}>
                            <Typography variant="body2" color="text.secondary">{module.description}</Typography>
                            <Divider />
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">TASKS & ASSIGNMENTS</Typography>
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<Add sx={{ fontSize: 16 }} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveModuleId(module._id);
                                    setEditingTask(null);
                                    resetTask({ title: '', type: '', week: '', description: '' });
                                    setShowTaskForm(true);
                                  }}
                                  sx={{ fontSize: '0.65rem' }}
                                >
                                  Add Task
                                </Button>
                              </Box>
                              <Stack spacing={1}>
                                {module.tasks?.map((task) => (
                                  <Paper key={task._id} elevation={0} sx={{
                                    p: 2,
                                    bgcolor: 'action.hover',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: { xs: 2, sm: 0 },
                                    '&:hover .task-actions': { opacity: 1 }
                                  }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Assignment sx={{ fontSize: 18, color: 'text.secondary' }} />
                                      <Typography variant="body2" fontWeight={700}>{task.title}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
                                      <Box className="task-actions" sx={{ 
                                        opacity: { xs: 1, sm: 0 }, 
                                        transition: 'opacity 0.2s' 
                                      }}>
                                        <IconButton size="small" color="primary" onClick={() => {
                                          setActiveModuleId(module._id);
                                          setEditingTask(task);
                                          resetTask(task);
                                          setShowTaskForm(true);
                                        }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => { if (confirm('Delete task?')) deleteTaskMutation.mutate(task._id); }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                                      </Box>
                                      {task.week && <Chip label={`WEEK ${task.week}`} size="small" color="secondary" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />}
                                      <Chip label={task.type} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
                                    </Stack>
                                  </Paper>
                                ))}
                                {(!module.tasks || module.tasks.length === 0) && (
                                  <Typography variant="caption" color="text.disabled" fontStyle="italic">No tasks defined for this module.</Typography>
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    {modules.length === 0 && !modulesLoading && (
                      <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 8, border: '2px dashed rgba(0,0,0,0.05)' }}>
                        <Typography variant="body1" fontWeight={700} color="text.secondary">No modules defined yet.</Typography>
                        <Typography variant="body2" color="text.disabled">Start building the learning path for this track.</Typography>
                      </Paper>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Box sx={{
                  height: '40vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 3,
                  px: 4,
                  bgcolor: 'white',
                  borderRadius: 4,
                  border: '2px dashed rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: '50%' }}>
                    <School sx={{ fontSize: 60, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="h6" color="text.disabled" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Select a course track to manage details
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Dialogs */}
          <Dialog open={showCourseForm} onClose={() => { setShowCourseForm(false); setEditingCourse(null); resetCourse(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>{editingCourse ? 'Edit Course Track' : 'Add Course Track'}</Typography>
              <Box component="form" onSubmit={handleCourseSubmit((data) => createCourseMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Track Name" placeholder="e.g. Full Stack Development" {...regCourse('name', { required: true })} />
                <TextField fullWidth type="number" label="Duration (Months)" {...regCourse('durationMonths', { required: true, min: 1 })} />
                <TextField fullWidth multiline rows={4} label="Description" placeholder="Briefly describe the learning path..." {...regCourse('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowCourseForm(false); setEditingCourse(null); resetCourse(); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createCourseMutation.isPending}>
                    {createCourseMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingCourse ? 'Update Track' : 'Create Track')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          <Dialog open={showModuleForm} onClose={() => { setShowModuleForm(false); setEditingModule(null); resetModule(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>{editingModule ? 'Edit Module' : 'Add Module'}</Typography>
              <Box component="form" onSubmit={handleModuleSubmit((data) => createModuleMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Module Name" placeholder="e.g. Introduction to React" {...regModule('name', { required: true })} />
                <TextField fullWidth type="number" label="Duration (Weeks)" {...regModule('durationWeeks', { required: true, min: 1 })} />
                <TextField fullWidth multiline rows={3} label="Module Description" {...regModule('description')} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowModuleForm(false); setEditingModule(null); resetModule(); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createModuleMutation.isPending}>
                    {createModuleMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingModule ? 'Update Module' : 'Add Module')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          <Dialog open={showTaskForm} onClose={() => { setShowTaskForm(false); setEditingTask(null); resetTask(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>{editingTask ? 'Edit Task' : 'Add Task'}</Typography>
              <Box component="form" onSubmit={handleTaskSubmit((data) => createTaskMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Task Title" placeholder="e.g. Build a Todo List" {...regTask('title', { required: true })} />
                <TextField select fullWidth label="Task Type" {...regTask('type', { required: true })}>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="personal">Personal / Soft Skills</MenuItem>
                </TextField>
                {activeModule && (
                  <TextField select fullWidth label="Assigned Week" defaultValue="" {...regTask('week', { required: true, valueAsNumber: true })}>
                    {[...Array(activeModule.durationWeeks || 1)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>Week {i + 1}</MenuItem>
                    ))}
                  </TextField>
                )}
                <TextField fullWidth multiline rows={3} label="Task Description" {...regTask('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowTaskForm(false); setEditingTask(null); resetTask(); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingTask ? 'Update Task' : 'Add Task')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default CourseManager;
