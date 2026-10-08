import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, DoorClosed, AlertTriangle, Calendar, MessageSquare, Database, 
  BarChart3, ShieldCheck, Sparkles, RefreshCw 
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { BarChart, PieChartSummary } from '../../components/Charts';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = () => {
    setLoading(true);
    api.get('/admin/analytics').then(res => {
      if (res.success) {
        setData(res);
      }
    }).finally(() => setLoading(false));
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset database back to initial clean demo data state?')) return;
    try {
      await api.post('/admin/reset-demo-data');
      showToast('Database reset to fresh demo data!', 'success');
      fetchAnalytics();
    } catch (err) {
      showToast('Reset failed', 'error');
    }
  };

  if (loading) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading Admin Analytics Dashboard...</div>;
  }

  const { stats, charts } = data;

  return (
    <div className="page-container">
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
          <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <ShieldCheck size={16} /> CampusHub Admin Control Center
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>System Administration Dashboard 👋</h1>
          <p style={{ fontSize: '0.9rem', color: '#dcfce7', marginTop: '0.2rem' }}>
            Full system control over students, faculty, classrooms, AI knowledge base, and campus tickets
          </p>
        </div>

        <button onClick={handleResetDemoData} className="btn" style={{ background: '#ffffff', color: '#047857' }}>
          <RefreshCw size={16} /> Reset Demo Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="#4f46e5" />
        <StatCard title="Total Faculty" value={stats.totalFaculty} icon={Users} color="#0284c7" />
        <StatCard title="Available Rooms" value={stats.availableClassrooms} icon={DoorClosed} color="#10b981" subtitle={`Out of ${stats.totalClassrooms}`} />
        <StatCard title="Pending Complaints" value={stats.pendingComplaints} icon={AlertTriangle} color="#ef4444" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid-cols-2" style={{ gap: '1.75rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="#4f46e5" /> Student Distribution by Department
          </h3>
          <BarChart data={charts.deptDistribution} />
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DoorClosed size={18} color="#10b981" /> Live Classroom Utilization
          </h3>
          <PieChartSummary data={charts.roomUtilization} />
        </div>
      </div>

      {/* Management Quick Navigation Grid */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Admin Management Modules</h3>
        <div className="grid-cols-4" style={{ gap: '1rem' }}>
          <button onClick={() => navigate('/admin/students')} className="btn btn-secondary" style={modStyle}>🎓 Manage Students</button>
          <button onClick={() => navigate('/admin/faculty')} className="btn btn-secondary" style={modStyle}>👨‍🏫 Manage Faculty</button>
          <button onClick={() => navigate('/admin/classrooms')} className="btn btn-secondary" style={modStyle}>🚪 Manage Classrooms</button>
          <button onClick={() => navigate('/admin/knowledge-base')} className="btn btn-secondary" style={modStyle}>🤖 AI Knowledge Base</button>
          <button onClick={() => navigate('/admin/notices')} className="btn btn-secondary" style={modStyle}>🔔 Manage Notices</button>
          <button onClick={() => navigate('/admin/resources')} className="btn btn-secondary" style={modStyle}>📚 Manage Resources</button>
          <button onClick={() => navigate('/admin/events')} className="btn btn-secondary" style={modStyle}>📅 Manage Events</button>
          <button onClick={() => navigate('/admin/complaints')} className="btn btn-secondary" style={modStyle}>⚠️ Manage Complaints</button>
        </div>
      </div>
    </div>
  );
}

const modStyle = {
  justifyContent: 'flex-start',
  padding: '0.75rem 1rem',
  fontSize: '0.875rem'
};
