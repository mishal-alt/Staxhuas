import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
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
  ThemeProvider,
  createTheme,
  Divider,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Search,
  FilterList,
  MoreVert,
  PersonAdd,
  School,
  TrendingUp,
  Mail,
  Group,
  NavigateNext
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';

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

const DUMMY_STUDENTS = [
  { id: 1, name: 'Hrithic Raj', email: 'hrithic@staxhaus.com', batch: 'MERN-B1', status: 'Active', progress: 'Module 4', color: '#2e7d32' },
  { id: 2, name: 'Ananya S', email: 'ananya@staxhaus.com', batch: 'MERN-B1', status: 'Active', progress: 'Module 4', color: '#2e7d32' },
  { id: 3, name: 'Mohammad Mishal', email: 'mishal@staxhaus.com', batch: 'MERN-B2', status: 'Active', progress: 'Module 1', color: '#2e7d32' },
  { id: 4, name: 'Sneha Kapoor', email: 'sneha@staxhaus.com', batch: 'MERN-B1', status: 'Discontinued', progress: 'Module 2', color: '#ed6c02' },
  { id: 5, name: 'Rahul V', email: 'rahul@staxhaus.com', batch: 'FS-JAVA-02', status: 'Active', progress: 'Module 8', color: '#2e7d32' },
];

const Students = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>

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
                  STUDENTS
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
                  <School fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Student Roster
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Manage and monitor students across your assigned batches
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}
            >
              Invite Student
            </Button>
          </Box>

          {/* KPI Grid - Real-time Analysis */}
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'Total Students', value: DUMMY_STUDENTS.length, icon: <Group />, color: '#1E2126' },
              { label: 'Active Students', value: DUMMY_STUDENTS.filter(s => s.status === 'Active').length, icon: <TrendingUp />, color: '#2e7d32' },
              { label: 'Discontinued', value: DUMMY_STUDENTS.filter(s => s.status === 'Discontinued').length, icon: <Mail />, color: '#E8391D' },
              { label: 'Active Batches', value: [...new Set(DUMMY_STUDENTS.map(s => s.batch))].length, icon: <School />, color: '#9c27b0' },
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

          {/* Table Container */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{
              p: 3,
              bgcolor: 'rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2
            }}>
              <TextField
                placeholder="Search students by name, email or batch..."
                size="small"
                sx={{ bgcolor: 'white', flex: 1, width: '100%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<FilterList />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 800,
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                  height: '40px'
                }}
              >
                Filter
              </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'white' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progress</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DUMMY_STUDENTS.map((student) => (
                    <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 900, borderRadius: 2 }}>{student.name[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={student.batch} size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="secondary">{student.progress}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.status}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            bgcolor: `${student.color}10`,
                            color: student.color,
                            border: `1px solid ${student.color}40`
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><MoreVert /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Students;
