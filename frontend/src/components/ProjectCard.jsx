import React from 'react';
import { Users, Sparkles, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onApply }) {
  const matchScore = project.matchScore || 85;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
            {project.department}
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: matchScore >= 80 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#3b82f6',
            color: '#ffffff',
            padding: '0.25rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
          }}>
            <Sparkles size={12} /> Match Score: {matchScore}%
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          {project.title}
        </h3>

        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.4 }}>
          {project.description}
        </p>

        {/* Skills required */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>Required Skills:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {(project.requiredSkills || []).map((skill, i) => {
              const isMatched = (project.matchedSkills || []).includes(skill);
              return (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  background: isMatched ? '#dcfce7' : '#f1f5f9',
                  color: isMatched ? '#15803d' : '#475569',
                  border: isMatched ? '1px solid #86efac' : '1px solid #e2e8f0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {isMatched && <CheckCircle2 size={11} />} {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Lead: <b>{project.ownerName}</b> • Openings: <b style={{ color: '#059669' }}>{project.openPositions}</b>
        </div>
        <button onClick={() => onApply && onApply(project)} className="btn btn-primary btn-sm">
          Request to Join
        </button>
      </div>
    </div>
  );
}
