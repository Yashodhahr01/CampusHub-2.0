import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, DoorClosed, Users, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileNav() {
  const { user } = useAuth();
  if (!user) return null;

  const dashboardPath = user.role === 'student' ? '/student/dashboard' : (user.role === 'faculty' ? '/faculty/dashboard' : '/admin/dashboard');

  return (
    <nav className="mobile-bottom-bar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      display: 'none',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 300,
      boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'
    }}>
      <NavLink to={dashboardPath} style={mobileLinkStyle}>
        <LayoutDashboard size={20} />
        <span style={{ fontSize: '0.7rem' }}>Dashboard</span>
      </NavLink>

      <NavLink to="/student/ai-assistant" style={mobileLinkStyle}>
        <Bot size={20} />
        <span style={{ fontSize: '0.7rem' }}>AI</span>
      </NavLink>

      <NavLink to="/student/classroom-vacancy" style={mobileLinkStyle}>
        <DoorClosed size={20} />
        <span style={{ fontSize: '0.7rem' }}>Vacancy</span>
      </NavLink>

      <NavLink to="/student/faculty-directory" style={mobileLinkStyle}>
        <Users size={20} />
        <span style={{ fontSize: '0.7rem' }}>Faculty</span>
      </NavLink>

      <NavLink to="/student/notices" style={mobileLinkStyle}>
        <Bell size={20} />
        <span style={{ fontSize: '0.7rem' }}>Notices</span>
      </NavLink>
    </nav>
  );
}

const mobileLinkStyle = ({ isActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: isActive ? '#4f46e5' : '#64748b',
  textDecoration: 'none'
});
