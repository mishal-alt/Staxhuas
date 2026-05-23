import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '../components/layout/ProtectedRoute';
import Login from '../pages/Login';
import AcceptInvite from '../pages/AcceptInvite';
import Dashboard from '../pages/Dashboard';
import CoursesAndBatches from '../pages/CoursesAndBatches';
import BatchDetail from '../pages/BatchDetail';
import StudentManagement from '../pages/StudentManagement';
import ScrumAndInterviews from '../pages/ScrumAndInterviews';
import StaffManagement from '../pages/StaffManagement';
import StaffProfile from '../pages/StaffProfile';
import StudentAcademics from '../pages/StudentAcademics';
import StudentTasks from '../pages/StudentTasks';
import Profile from '../pages/Profile';
import Leaderboard from '../pages/Leaderboard';
import MyInterviews from '../pages/MyInterviews';
import InterviewDetail from '../pages/InterviewDetail';
import Students from '../pages/Students';
import Leaves from '../pages/Leaves';
import ScrumManagement from '../pages/ScrumManagement';
import EvaluationManagement from '../pages/EvaluationManagement';
import Invitations from '../pages/Invitations';
import Reports from '../pages/Reports';
import CourseManager from '../pages/CourseManager';
import StudentProfile from '../pages/StudentProfile';
import { useAuth } from '../context/AuthContext';




import { ROLES } from '../utils/constants';

const StudentAcademicsWrapper = () => {
  const { user } = useAuth();
  return user?.role === ROLES.STUDENT ? <StudentAcademics /> : <ScrumAndInterviews />;
};

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/accept-invite" element={<PublicRoute><AcceptInvite /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/batches" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><CoursesAndBatches /></ProtectedRoute>} />
      <Route path="/batches/:id" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><BatchDetail /></ProtectedRoute>} />
      <Route path="/student-management" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR, ROLES.STUDENT]}><StudentManagement /></ProtectedRoute>} />
      <Route path="/leaves" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR, ROLES.STUDENT]}><Leaves /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><Students /></ProtectedRoute>} />
      <Route path="/scrum" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><ScrumManagement /></ProtectedRoute>} />
      <Route path="/interviews" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><EvaluationManagement /></ProtectedRoute>} />
      <Route path="/invitations" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><Invitations /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR]}><Reports /></ProtectedRoute>} />
      <Route path="/academics" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR, ROLES.STUDENT, ROLES.INTERVIEWER]}><StudentAcademicsWrapper /></ProtectedRoute>} />

      <Route path="/my-interviews" element={<ProtectedRoute allowedRoles={[ROLES.INTERVIEWER]}><MyInterviews /></ProtectedRoute>} />
      <Route path="/interviews/:id" element={<ProtectedRoute allowedRoles={[ROLES.INTERVIEWER]}><InterviewDetail /></ProtectedRoute>} />

      <Route path="/staff" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><StaffManagement /></ProtectedRoute>} />
      <Route path="/staff/profile/:id" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><StaffProfile /></ProtectedRoute>} />
      <Route path="/course-management" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><CourseManager /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><StudentTasks /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/student-profile/:id" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACILITATOR, ROLES.STUDENT, ROLES.INTERVIEWER]}><StudentProfile /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>

  );
};

export default AppRoutes;
