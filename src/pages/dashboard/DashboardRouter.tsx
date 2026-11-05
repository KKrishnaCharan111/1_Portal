import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { FacultyDashboard } from './FacultyDashboard';
import { ParentDashboard } from './ParentDashboard';
import { HODDashboard } from './HODDashboard';
import { AdminDashboard } from './AdminDashboard';
import { PrincipalDashboard } from './PrincipalDashboard';

export const DashboardRouter: React.FC = () => {
  const { role } = useAuth();

  switch (role) {
    case 'faculty':
      return <FacultyDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'hod':
      return <HODDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'principal':
      return <PrincipalDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};
