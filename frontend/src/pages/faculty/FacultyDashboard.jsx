import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, BookOpen, Users, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    api.get('/questions').then(res => res.success && setQuestions(res.questions || []));
    api.get('/resources').then(res => res.success && setResources(res.resources || []));
  }, []);

  const pendingQuestions = questions.filter(q => q.status === 'Pending');
  const answeredQuestions = questions.filter(q => q.status === 'Answered');

  return (
    <div className="page-container">
      {/* Faculty Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#bae6fd', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <Sparkles size={16} /> CampusHub Faculty Portal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Welcome, {user?.name || 'Professor'} 👋</h1>
          <p style={{ fontSize: '0.9rem', color: '#e0f2fe', marginTop: '0.2rem' }}>
            Department of {user?.profile?.department || 'Computer Science & Engineering'} • Employee ID: <b>{user?.profile?.employeeId || 'EMP_CSE_01'}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/faculty/questions')} className="btn" style={{ background: '#ffffff', color: '#0284c7' }}>
            <MessageSquare size={16} /> Answer Student Qs ({pendingQuestions.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Pending Questions" value={pendingQuestions.length} icon={Clock} color="#ef4444" subtitle="Awaiting Your Response" />
        <StatCard title="Answered Questions" value={answeredQuestions.length} icon={CheckCircle} color="#10b981" subtitle="Students Guided" />
        <StatCard title="Uploaded Resources" value={resources.length} icon={BookOpen} color="#3b82f6" subtitle="Notes & Question Papers" />
        <StatCard title="Students Helped" value={140 + answeredQuestions.length * 5} icon={Users} color="#8b5cf6" subtitle="Academic Reach" />
      </div>

      {/* Pending Questions Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Questions Awaiting Your Response</h3>
          <Link to="/faculty/questions" style={{ fontSize: '0.825rem', fontWeight: 600 }}>View All Questions</Link>
        </div>

        {pendingQuestions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>🎉 All student queries have been answered!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingQuestions.map(q => (
              <div key={q.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{q.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Asked by <b>{q.studentName}</b> ({q.studentUsn}) • Subject: <b>{q.subject}</b>
                  </div>
                </div>
                <button onClick={() => navigate('/faculty/questions')} className="btn btn-primary btn-sm">
                  Reply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
