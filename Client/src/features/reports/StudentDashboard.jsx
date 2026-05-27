import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { CalendarToday, NavigateNext, Dashboard as DashboardIcon } from '@mui/icons-material';

import StudentPageLayout from '../../components/layout/StudentPageLayout';
import StudentIntelligenceContent from './student-dashboard/StudentIntelligenceContent';

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

const StudentDashboard = ({ user }) => {
  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <ThemeProvider theme={theme}>
      <StudentPageLayout
        header={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />}
                sx={{ mb: 1.5 }}
              >
                <MuiLink
                  component={RouterLink}
                  to="/dashboard"
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  STAXHAUS
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  DASHBOARD
                </Typography>
              </Breadcrumbs>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)',
                  }}
                >
                  <DashboardIcon />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color="text.primary"
                    sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}
                  >
                    Student Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Hi {firstName}, welcome back to your academic portal.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Chip
              icon={<CalendarToday sx={{ color: 'primary.main !important' }} />}
              label={new Date()
                .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                .toUpperCase()}
              sx={{
                fontWeight: 900,
                px: 2,
                bgcolor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 3,
                fontFamily: 'Outfit',
              }}
            />
          </Box>
        }
      >
        <StudentIntelligenceContent user={user} isLoading={!user} />
      </StudentPageLayout>
    </ThemeProvider>
  );
};

export default StudentDashboard;
