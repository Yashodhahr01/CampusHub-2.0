import React from 'react';
import { Bell, Calendar, User, AlertCircle, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function NoticeCard({ notice }) {
  const isUrgent = notice.priority === 'Urgent';

  return (
    <div className="card" style={{
      borderLeft: isUrgent ? '4px solid #ef4444' : '1px solid #e2e8f0',
      background: isUrgent ? '#fff5f5' : '#ffffff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#4f46e5', background: '#eef2ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
          {notice.category}
        </span>
        <StatusBadge status={notice.priority} />
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
        {notice.title}
      </h3>

      <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem', lineHeight: 1.5 }}>
        {notice.content}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={13} /> {notice.postedBy}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} /> {notice.date}
        </span>
      </div>
    </div>
  );
}
