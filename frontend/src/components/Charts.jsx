import React from 'react';

export function BarChart({ data = {}, colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b'] }) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const max = Math.max(...values, 1);

  return (
    <div style={{ width: '100%', padding: '1rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {keys.map((key, idx) => {
          const val = data[key];
          const pct = Math.round((val / max) * 100);
          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                <span>{key}</span>
                <span>{val}</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: colors[idx % colors.length],
                  borderRadius: '5px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PieChartSummary({ data = {} }) {
  const keys = Object.keys(data);
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  const colors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
        {keys.map((key, idx) => {
          const pct = (data[key] / total) * 100;
          return (
            <div 
              key={key} 
              style={{ width: `${pct}%`, background: colors[idx % colors.length] }} 
              title={`${key}: ${data[key]}`}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
        {keys.map((key, idx) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[idx % colors.length] }} />
            <span>{key}: <b>{data[key]}</b></span>
          </div>
        ))}
      </div>
    </div>
  );
}
