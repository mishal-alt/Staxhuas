import React from 'react';
import {
  Typography,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  Box,
} from '@mui/material';
import { Assignment, NavigateNext } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

import AppShell from '../components/layout/AppShell';
import StudentPageLayout from '../components/layout/StudentPageLayout';
import TasksContent from '../features/tasks/TasksContent';

const theme = createTheme({
  palette: {
    primary: { main: '#E8391D' },
    secondary: { main: '#1E2126' },
    background: { default: '#F7F7F5' },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' },
  },
});

const StudentTasks = () => (
  <ThemeProvider theme={theme}>
    <AppShell fullWidth>
      <StudentPageLayout
        header={
          <>
            <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />} sx={{ mb: 1.5 }}>
              <MuiLink
                component={RouterLink}
                to="/dashboard"
                underline="none"
                color="text.secondary"
                sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
              >
                DASHBOARD
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>TASKS</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: 'rgba(232, 57, 29, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                }}
              >
                <Assignment />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  Tasks
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Everything you need to master this module.
                </Typography>
              </Box>
            </Box>
          </>
        }
      >
        <TasksContent isLoading={false} />
      </StudentPageLayout>
    </AppShell>
  </ThemeProvider>
);

export default StudentTasks;
