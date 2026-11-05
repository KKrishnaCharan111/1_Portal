import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Login } from './pages/auth/Login';
import { DashboardRouter } from './pages/dashboard/DashboardRouter';
import { AcademicsPage } from './pages/academics/AcademicsPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { TimetablePage } from './pages/timetable/TimetablePage';
import { ExaminationsPage } from './pages/examinations/ExaminationsPage';
import { CampusLifePage } from './pages/campus/CampusLifePage';
import { CareerPage } from './pages/career/CareerPage';
import { LibraryPage } from './pages/library/LibraryPage';
import { FeesPage } from './pages/fees/FeesPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { AIAssistantPage } from './pages/ai/AIAssistantPage';
import { SupportPage } from './pages/support/SupportPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated Portal Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardRouter />} />
              <Route path="academics" element={<AcademicsPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="timetable" element={<TimetablePage />} />
              <Route path="examinations" element={<ExaminationsPage />} />
              <Route path="campus" element={<CampusLifePage />} />
              <Route path="career" element={<CareerPage />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="fees" element={<FeesPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};
export default App;
