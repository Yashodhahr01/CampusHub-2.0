import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AICampusAssistant from './pages/student/AICampusAssistant';
import ClassroomVacancy from './pages/student/ClassroomVacancy';
import FacultyDirectory from './pages/student/FacultyDirectory';
import AskFaculty from './pages/student/AskFaculty';
import NoticesPage from './pages/student/NoticesPage';
import ResourcesPage from './pages/student/ResourcesPage';
import EventsPage from './pages/student/EventsPage';
import TeamFinderPage from './pages/student/TeamFinderPage';
import LostFoundPage from './pages/student/LostFoundPage';
import ComplaintsPage from './pages/student/ComplaintsPage';
import StudentProfile from './pages/student/StudentProfile';
import NotificationsPage from './pages/student/NotificationsPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyQuestions from './pages/faculty/FacultyQuestions';
import FacultyResources from './pages/faculty/FacultyResources';
import FacultyProfile from './pages/faculty/FacultyProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageClassrooms from './pages/admin/ManageClassrooms';
import ManageNotices from './pages/admin/ManageNotices';
import ManageResources from './pages/admin/ManageResources';
import ManageEvents from './pages/admin/ManageEvents';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageLostFound from './pages/admin/ManageLostFound';
import AIKnowledgeBase from './pages/admin/AIKnowledgeBase';
import SystemAnalytics from './pages/admin/SystemAnalytics';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Authenticating user session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <div className="app-shell" style={{ flex: 1 }}>
        {user && <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />}
        
        <div className="main-content-wrapper">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student Protected Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/ai-assistant" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><AICampusAssistant /></ProtectedRoute>} />
            <Route path="/student/classroom-vacancy" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><ClassroomVacancy /></ProtectedRoute>} />
            <Route path="/student/faculty-directory" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><FacultyDirectory /></ProtectedRoute>} />
            <Route path="/student/ask-faculty" element={<ProtectedRoute allowedRoles={['student']}><AskFaculty /></ProtectedRoute>} />
            <Route path="/student/notices" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><NoticesPage /></ProtectedRoute>} />
            <Route path="/student/resources" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><ResourcesPage /></ProtectedRoute>} />
            <Route path="/student/events" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><EventsPage /></ProtectedRoute>} />
            <Route path="/student/team-finder" element={<ProtectedRoute allowedRoles={['student']}><TeamFinderPage /></ProtectedRoute>} />
            <Route path="/student/lost-found" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><LostFoundPage /></ProtectedRoute>} />
            <Route path="/student/complaints" element={<ProtectedRoute allowedRoles={['student']}><ComplaintsPage /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><NotificationsPage /></ProtectedRoute>} />

            {/* Faculty Protected Routes */}
            <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/questions" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyQuestions /></ProtectedRoute>} />
            <Route path="/faculty/resources" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyResources /></ProtectedRoute>} />
            <Route path="/faculty/profile" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyProfile /></ProtectedRoute>} />
            <Route path="/faculty/notifications" element={<ProtectedRoute allowedRoles={['faculty']}><NotificationsPage /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><ManageStudents /></ProtectedRoute>} />
            <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={['admin']}><ManageFaculty /></ProtectedRoute>} />
            <Route path="/admin/classrooms" element={<ProtectedRoute allowedRoles={['admin']}><ManageClassrooms /></ProtectedRoute>} />
            <Route path="/admin/notices" element={<ProtectedRoute allowedRoles={['admin']}><ManageNotices /></ProtectedRoute>} />
            <Route path="/admin/resources" element={<ProtectedRoute allowedRoles={['admin']}><ManageResources /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><ManageEvents /></ProtectedRoute>} />
            <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><ManageComplaints /></ProtectedRoute>} />
            <Route path="/admin/lost-found" element={<ProtectedRoute allowedRoles={['admin']}><ManageLostFound /></ProtectedRoute>} />
            <Route path="/admin/knowledge-base" element={<ProtectedRoute allowedRoles={['admin']}><AIKnowledgeBase /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><SystemAnalytics /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {user && <MobileNav />}
    </div>
  );
}

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <MainLayout />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
