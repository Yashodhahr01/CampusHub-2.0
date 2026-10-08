import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DoorClosed, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, PieChartSummary } from '../../components/Charts';
import StatCard from '../../components/StatCard';
import api from '../../services/api';

export default function SystemAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(res => {
      if (res.success) {
        setData(res);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading Platform System Analytics...</div>;
  }

  const { stats, charts } = data;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BarChart3 size={24} color="#4f46e5" /> System Analytics & Usage Metrics</h1>
          <p className="page-subtitle">Real-time platform activity, classroom utilization, and department distribution</p>
        </div>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Active System Users" value={stats.activeUsers} icon={Users} color="#4f46e5" />
        <StatCard title="Classroom Vacancy Rate" value={`${Math.round((stats.availableClassrooms / stats.totalClassrooms) * 100)}%`} icon={DoorClosed} color="#10b981" />
        <StatCard title="Pending Help Tickets" value={stats.pendingComplaints} icon={AlertTriangle} color="#ef4444" />
        <StatCard title="Platform Uptime" value="99.98%" icon={Activity} color="#0284c7" />
      </div>

      <div className="grid-cols-2" style={{ gap: '1.75rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Department Enrolments</h3>
          <BarChart data={charts.deptDistribution} />
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Classroom Status Distribution</h3>
          <PieChartSummary data={charts.roomUtilization} />
        </div>
      </div>
    </div>
  );
}
