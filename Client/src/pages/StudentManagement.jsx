import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  ThemeProvider,
  createTheme,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  Autocomplete,
  Menu,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';

import AppShell from '../components/layout/AppShell';
import AttendanceRoster from '../features/attendance/AttendanceRoster';
import StudentAttendanceAndLeaves from '../features/attendance/StudentAttendanceAndLeaves';
import * as batchApi from '../api/batches.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { Search, FilterList, Sort, School, NavigateNext, Group, TrendingUp, Mail, Layers } from '@mui/icons-material';

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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.03)',
        }
      }
    }
  }
});

const StudentManagement = () => {
  const { user } = useAuth();
  const isStudent = user?.role === ROLES.STUDENT;

  const { data: batchesRes, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
    enabled: !isStudent
  });

  const batches = batchesRes?.data || [];
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort and Filter State
  const [sortBy, setSortBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortAnchor, setSortAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const handleSortClick = (event) => setSortAnchor(event.currentTarget);
  const handleFilterClick = (event) => setFilterAnchor(event.currentTarget);
  const handleSortClose = (value) => {
    if (value) setSortBy(value);
    setSortAnchor(null);
  };
  const handleFilterClose = (value) => {
    if (value) setStatusFilter(value);
    setFilterAnchor(null);
  };

  if (isStudent) {
    return (
      <AppShell>
        <StudentAttendanceAndLeaves />
      </AppShell>
    );
  }

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
            mb: 3
          }}>
            <Breadcrumbs
              separator=">"
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
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(232, 57, 29, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}>
                <School />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  STUDENT MANAGEMENT
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Manage students, batches and performance
                </Typography>
              </Box>
            </Box>
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
              { label: 'Total Students', value: '42', icon: <Group />, color: '#1E2126' },
              { label: 'Active Students', value: '38', icon: <TrendingUp />, color: '#2e7d32' },
              { label: 'On Leave', value: '04', icon: <Mail />, color: '#E8391D' },
              { label: 'Active Batches', value: batches.length || '07', icon: <Layers />, color: '#9c27b0' },
            ].map((stat, i) => (
              <Card key={i} sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.05)',
                height: { xs: 80, sm: 100 },
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                overflow: 'hidden',
                bgcolor: 'white'
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

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            px: 0.5,
            mb: 2.5
          }}>
            {/* Left: Status Filter Pills (Linear/Stripe style) */}
            <Box sx={{
              display: 'flex',
              gap: 0.5,
              overflowX: 'auto',
              pb: { xs: 1, md: 0 },
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}>
              {['all', 'Active', 'Inactive', 'Suspended', 'Terminated'].map((status) => {
                const isActive = statusFilter === status;
                return (
                  <Button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    size="small"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '6px',
                      textTransform: 'none',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.8rem',
                      color: isActive ? 'white' : '#4b5563',
                      bgcolor: isActive ? '#1E2126' : 'transparent',
                      border: isActive ? '1px solid #1E2126' : '1px solid transparent',
                      minWidth: 'auto',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: isActive ? '#1E2126' : 'rgba(0,0,0,0.04)',
                      }
                    }}
                  >
                    {status === 'all' ? 'All Status' : status}
                  </Button>
                );
              })}
            </Box>

            {/* Right: Search, Batch Select & Sort */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}>
              {/* Batch Select (Highly compact Autocomplete) */}
              <Autocomplete
                size="small"
                options={[{ _id: 'all', name: 'All Batches' }, ...batches]}
                getOptionLabel={(option) => option.name || ''}
                value={[{ _id: 'all', name: 'All Batches' }, ...batches].find(b => b._id === selectedBatch) || null}
                onChange={(event, newValue) => {
                  setSelectedBatch(newValue ? newValue._id : 'all');
                }}
                sx={{ 
                  width: { xs: '100%', sm: 160 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    bgcolor: 'white',
                    fontSize: '0.8rem',
                    py: 0,
                    height: '32px',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.15)' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Batch"
                  />
                )}
              />

              {/* Student Search */}
              <TextField
                placeholder="Filter by name or email..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  width: { xs: '100%', sm: 220 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    bgcolor: 'white',
                    fontSize: '0.8rem',
                    height: '32px',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.15)' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 16, color: '#9ca3af' }} />
                    </InputAdornment>
                  )
                }}
              />

              {/* Sort Trigger Button */}
              <Button
                onClick={handleSortClick}
                size="small"
                variant="outlined"
                startIcon={<Sort sx={{ fontSize: 14 }} />}
                sx={{
                  px: 1.5,
                  height: '32px',
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: '#374151',
                  borderColor: 'rgba(0,0,0,0.08)',
                  bgcolor: 'white',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'rgba(0,0,0,0.15)',
                    bgcolor: 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                Sort: {sortBy === 'name' ? 'Name' : sortBy === 'joinDate' ? 'Join Date' : 'Attendance'}
              </Button>
            </Box>
          </Box>

          {/* Sort Menu */}
          <Menu
            anchorEl={sortAnchor}
            open={Boolean(sortAnchor)}
            onClose={() => handleSortClose()}
            PaperProps={{ 
              elevation: 3,
              sx: { 
                borderRadius: '8px', 
                mt: 1, 
                minWidth: 150,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.825rem',
                  py: 1,
                  px: 2,
                  fontWeight: 500,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(232, 57, 29, 0.08)',
                    fontWeight: 700,
                    color: 'primary.main'
                  }
                }
              } 
            }}
          >
            <MenuItem onClick={() => handleSortClose('name')} selected={sortBy === 'name'}>Sort by Name</MenuItem>
            <MenuItem onClick={() => handleSortClose('joinDate')} selected={sortBy === 'joinDate'}>Sort by Join Date</MenuItem>
            <MenuItem onClick={() => handleSortClose('attendance')} selected={sortBy === 'attendance'}>Sort by Attendance</MenuItem>
          </Menu>

          {/* Content */}
          <Box sx={{ mt: 0 }}>
            <AttendanceRoster
              batchId={selectedBatch}
              searchQuery={searchQuery}
              sortBy={sortBy}
              statusFilter={statusFilter}
            />
          </Box>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default StudentManagement;
