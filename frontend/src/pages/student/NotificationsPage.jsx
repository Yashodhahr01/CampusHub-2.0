import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    api.get('/notifications').then(res => res.success && setNotifications(res.notifications || []));
  };

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all');
    showToast('All notifications marked as read', 'success');
    fetchNotifications();
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Bell size={24} color="#4f46e5" /> Notification Center</h1>
          <p className="page-subtitle">Real-time alerts for faculty answers, notices, event reminders, and complaint updates</p>
        </div>
        <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
          <CheckCircle size={14} /> Mark All as Read
        </button>
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No notifications found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => navigate(n.link || '#')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '8px',
                  background: n.read ? '#ffffff' : '#eef2ff',
                  border: n.read ? '1px solid #e2e8f0' : '1px solid #c7d2fe',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{n.title}</div>
                  <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>{n.message}</div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
