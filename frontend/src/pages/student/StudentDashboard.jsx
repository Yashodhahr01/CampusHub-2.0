import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, DoorClosed, MessageSquare, BookOpen, Users, Calendar, AlertTriangle, 
  Bell, ArrowRight, Sparkles, CheckCircle2, Clock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    unreadNotices: 3,
    availableClassrooms: 5,
    upcomingEvents: 4,
    pendingQuestions: 2
  });

  const [recentNotices, setRecentNotices] = useState([]);
  const [vacantRooms, setVacantRooms] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);

  useEffect(() => {
    // Fetch live dashboard metrics
    api.get('/classrooms/available').then(res => res.success && setVacantRooms(res.classrooms || [])).catch(() => {});
    api.get('/notices').then(res => res.success && setRecentNotices((res.notices || []).slice(0, 3))).catch(() => {});
    api.get('/questions').then(res => res.success && setMyQuestions((res.questions || []).slice(0, 3))).catch(() => {});
  }, []);

  const studentProfile = user?.profile || { department: 'Computer Science & Engineering', semester: 6, usn: '1DS21CS108' };

  return (
    <div className="page-container">
      {/* Top Banner Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <Sparkles size={16} /> CampusHub Student Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Good morning, {user?.name || 'Student'} 👋</h1>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
            Sem {studentProfile.semester || 6} • {studentProfile.department} • USN: <b>{studentProfile.usn || '1DS21CS108'}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/student/ai-assistant" className="btn" style={{ background: '#4f46e5', color: '#ffffff', border: 'none' }}>
            <Bot size={16} /> Ask Campus AI
          </Link>
          <Link to="/student/classroom-vacancy" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
            <DoorClosed size={16} /> Vacant Rooms
          </Link>
        </div>
      </div>

      {/* 4 Core Statistics Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Available Classrooms" value={vacantRooms.length || 5} icon={DoorClosed} color="#10b981" subtitle="Vacant Right Now" />
        <StatCard title="Unread Notices" value={recentNotices.length || 3} icon={Bell} color="#3b82f6" subtitle="Academic & Exam" />
        <StatCard title="Upcoming Events" value={4} icon={Calendar} color="#f59e0b" subtitle="Hackathons & Fests" />
        <StatCard title="Pending Questions" value={myQuestions.filter(q => q.status === 'Pending').length || 1} icon={MessageSquare} color="#8b5cf6" subtitle="Awaiting Faculty Reply" />
      </div>

      {/* Quick Action Section: "Need something?" */}
      <div className="card" style={{ marginBottom: '2rem', background: '#ffffff', border: '1px solid #c7d2fe' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#4f46e5" /> Need something? Quick Actions:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button onClick={() => navigate('/student/ai-assistant')} className="btn btn-secondary btn-sm" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
            🤖 Ask AI Assistant
          </button>
          <button onClick={() => navigate('/student/classroom-vacancy')} className="btn btn-secondary btn-sm">
            🚪 Find Classroom
          </button>
          <button onClick={() => navigate('/student/ask-faculty')} className="btn btn-secondary btn-sm">
            👨‍🏫 Ask Faculty
          </button>
          <button onClick={() => navigate('/student/team-finder')} className="btn btn-secondary btn-sm">
            🤝 Find Teammates
          </button>
          <button onClick={() => navigate('/student/complaints')} className="btn btn-secondary btn-sm">
            ⚠️ Report Campus Issue
          </button>
        </div>
      </div>

      {/* Dashboard Main Grid Content */}
      <div className="grid-cols-2" style={{ gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Live Vacant Classrooms */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DoorClosed size={18} color="#10b981" /> Vacant Classrooms Available Now
            </h3>
            <Link to="/student/classroom-vacancy" style={{ fontSize: '0.8rem', fontWeight: 600 }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vacantRooms.slice(0, 3).map(room => (
              <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{room.roomNumber} ({room.building})</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cap: {room.capacity} • {room.type} • Available until {room.availableUntil}</div>
                </div>
                <StatusBadge status="Vacant" />
              </div>
            ))}
          </div>
        </div>

        {/* Important Campus Notices */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} color="#3b82f6" /> Important Notices
            </h3>
            <Link to="/student/notices" style={{ fontSize: '0.8rem', fontWeight: 600 }}>View All Notices</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentNotices.slice(0, 3).map(notice => (
              <div key={notice.id} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>{notice.category}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{notice.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{notice.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
