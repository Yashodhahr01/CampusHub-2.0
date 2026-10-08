import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = '#4f46e5', subtitle }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
