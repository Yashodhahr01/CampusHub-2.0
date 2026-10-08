import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Bot, DoorClosed, Users, MessageSquare, Bell, BookOpen, 
  Calendar, UserCheck, PackageSearch, AlertTriangle, User, ShieldCheck, 
  HelpCircle, Database, BarChart3, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user } = useAuth();
  if (!user) return null;

  const studentLinks = [
    { title: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { title: 'AI Campus Assistant', path: '/student/ai-assistant', icon: Bot, badge: 'AI' },
    { title: 'Classroom Vacancy', path: '/student/classroom-vacancy', icon: DoorClosed },
    { title: 'Faculty Directory', path: '/student/faculty-directory', icon: Users },
    { title: 'Ask Faculty', path: '/student/ask-faculty', icon: MessageSquare },
    { title: 'Smart Notices', path: '/student/notices', icon: Bell },
    { title: 'Resource Hub', path: '/student/resources', icon: BookOpen },
    { title: 'Events & Clubs', path: '/student/events', icon: Calendar },
    { title: 'Team Finder', path: '/student/team-finder', icon: UserCheck, badge: 'Smart' },
    { title: 'Lost & Found', path: '/student/lost-found', icon: PackageSearch },
    { title: 'Campus Complaints', path: '/student/complaints', icon: AlertTriangle },
    { title: 'Student Profile', path: '/student/profile', icon: User },
    { title: 'Notifications', path: '/student/notifications', icon: Bell }
  ];

  const facultyLinks = [
    { title: 'Faculty Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { title: 'Student Questions', path: '/faculty/questions', icon: MessageSquare },
    { title: 'Resource Library', path: '/faculty/resources', icon: BookOpen },
    { title: 'Faculty Profile', path: '/faculty/profile', icon: User },
    { title: 'Classroom Vacancy', path: '/student/classroom-vacancy', icon: DoorClosed },
    { title: 'Campus Notices', path: '/student/notices', icon: Bell },
    { title: 'Notifications', path: '/faculty/notifications', icon: Bell }
  ];

  const adminLinks = [
    { title: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'System Analytics', path: '/admin/analytics', icon: BarChart3 },
    { title: 'Manage Students', path: '/admin/students', icon: Users },
    { title: 'Manage Faculty', path: '/admin/faculty', icon: UserCheck },
    { title: 'Manage Classrooms', path: '/admin/classrooms', icon: DoorClosed },
    { title: 'Manage Notices', path: '/admin/notices', icon: Bell },
    { title: 'Manage Resources', path: '/admin/resources', icon: BookOpen },
    { title: 'Manage Events', path: '/admin/events', icon: Calendar },
    { title: 'Manage Complaints', path: '/admin/complaints', icon: AlertTriangle },
    { title: 'Manage Lost & Found', path: '/admin/lost-found', icon: PackageSearch },
    { title: 'AI Knowledge Base', path: '/admin/knowledge-base', icon: Database, badge: 'RAG' }
  ];

  let currentLinks = studentLinks;
  if (user.role === 'faculty') currentLinks = facultyLinks;
  if (user.role === 'admin') currentLinks = adminLinks;

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--navbar-height))',
      position: 'sticky',
      top: 'var(--navbar-height)',
      overflowY: 'auto',
      zIndex: 90
    }}>
      <div style={{ padding: '1rem', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
          {user.role} Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {currentLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onCloseMobile}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s'
                })}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{link.title}</span>
                {link.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: link.badge === 'AI' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--primary-light)',
                    color: link.badge === 'AI' ? '#ffffff' : 'var(--primary)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px'
                  }}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info in sidebar */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>
          <b>CampusHub 2.0</b> System v2.0
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Connected: Demo Local Engine
        </div>
      </div>
    </aside>
  );
}
