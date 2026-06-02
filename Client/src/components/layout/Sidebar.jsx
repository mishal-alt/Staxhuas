import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, BookOpen, Calendar, BookOpenCheck, Settings, LogOut, ClipboardList, Trophy, User, Mail, Layers } from 'lucide-react';



import { useAuth } from '../../context/AuthContext';
import { Logo } from "@/components/ui/logo";
import { ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();

  const allLinks = [
    // General Links
    { name: 'My Profile', path: '/profile', icon: <User size={20} />, roles: [ROLES.FACILITATOR, ROLES.STUDENT, ROLES.INTERVIEWER] },

    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: [ROLES.ADMIN, ROLES.FACILITATOR, ROLES.STUDENT, ROLES.INTERVIEWER] },

    // Facilitator Exclusive (The 10-page list)
    { name: 'Batches', path: '/batches', icon: <BookOpen size={20} />, roles: [ROLES.FACILITATOR] },
    { name: 'Student Management', path: '/student-management', icon: <Calendar size={20} />, roles: [ROLES.FACILITATOR] },
    { name: 'Interviews', path: '/interviews', icon: <BookOpenCheck size={20} />, roles: [ROLES.FACILITATOR] },
    { name: 'Invitations', path: '/invitations', icon: <Mail size={20} />, roles: [ROLES.FACILITATOR] },
    { name: 'Reports', path: '/reports', icon: <Trophy size={20} />, roles: [ROLES.FACILITATOR] },

    // Admin Exclusive
    { name: 'Staff Management', path: '/staff', icon: <Users size={20} />, roles: [ROLES.ADMIN] },
    { name: 'Batch Management', path: '/batches', icon: <Layers size={20} />, roles: [ROLES.ADMIN] },
    { name: 'Course Management', path: '/course-management', icon: <BookOpen size={20} />, roles: [ROLES.ADMIN] },
    { name: 'Student Management', path: '/student-management', icon: <Calendar size={20} />, roles: [ROLES.ADMIN] },
    { name: 'All Invitations', path: '/invitations', icon: <Mail size={20} />, roles: [ROLES.ADMIN] },

    // Role Specifics
    { name: 'My Interviews', path: '/my-interviews', icon: <BookOpenCheck size={20} />, roles: [ROLES.INTERVIEWER] },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} />, roles: [ROLES.STUDENT] },
    { name: 'Courses', path: '/courses', icon: <BookOpen size={20} />, roles: [ROLES.STUDENT] },
    { name: 'Attendance', path: '/attendance', icon: <Calendar size={20} />, roles: [ROLES.STUDENT] },
    { name: 'Tasks', path: '/tasks', icon: <ClipboardList size={20} />, roles: [ROLES.STUDENT] },
    { name: 'Academics', path: '/academics', icon: <BookOpenCheck size={20} />, roles: [ROLES.STUDENT] },






  ];

  const links = allLinks.filter(link => link.roles.includes(user?.role));




  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-brand-charcoal text-white transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-800 bg-black/10 relative text-white px-0 overflow-hidden">
          <Logo className="h-24 w-full" />
          <button onClick={toggleSidebar} className="absolute right-4 md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive
                  ? 'bg-brand-orange text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

