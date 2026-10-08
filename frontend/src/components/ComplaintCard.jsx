import React from 'react';
import { MapPin, Clock, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ComplaintCard({ complaint, onUpdateStatus }) {
  const steps = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const currentIndex = steps.indexOf(complaint.status);

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
            {complaint.category}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>{complaint.title}</h3>
          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
            <MapPin size={14} /> {complaint.location} • Reported by {complaint.userName}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1.25rem' }}>{complaint.description}</p>

      {/* Progress Workflow Stepper */}
      <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Progress Tracking:</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCompleted ? '#4f46e5' : '#e2e8f0',
                    color: isCompleted ? '#ffffff' : '#94a3b8',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#4f46e5' : '#64748b', marginTop: '0.2rem', textAlign: 'center' }}>
                    {step}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div style={{ height: '2px', flex: 1, background: idx < currentIndex ? '#4f46e5' : '#e2e8f0', margin: '0 -10px', marginTop: '-12px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {onUpdateStatus && (
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button onClick={() => onUpdateStatus(complaint)} className="btn btn-secondary btn-sm">
            Update Workflow Status
          </button>
        </div>
      )}
    </div>
  );
}
