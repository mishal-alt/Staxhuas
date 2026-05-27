import React from 'react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import AdminDashboard from '../features/reports/AdminDashboard';
import FacilitatorDashboard from '../features/reports/FacilitatorDashboard';
import StudentDashboard from '../features/reports/StudentDashboard';
import InterviewerDashboard from '../features/reports/InterviewerDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AppShell fullWidth={user?.role === ROLES.STUDENT}>
      {user?.role === ROLES.ADMIN && <AdminDashboard />}
      {user?.role === ROLES.FACILITATOR && <FacilitatorDashboard user={user} />}
      {user?.role === ROLES.STUDENT && <StudentDashboard user={user} />}
      {user?.role === ROLES.INTERVIEWER && <InterviewerDashboard user={user} />}
    </AppShell>
  );
};


export default Dashboard;
