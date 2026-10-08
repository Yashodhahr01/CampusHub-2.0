import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, BookOpen } from 'lucide-react';

export default function FacultyCard({ faculty, onAskQuestion }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <img 
            src={faculty.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} 
            alt={faculty.name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
          />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{faculty.name}</h3>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4f46e5' }}>{faculty.designation}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{faculty.department}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={14} color="#64748b" />
            <span><b>Subjects:</b> {(faculty.subjects || []).join(', ')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} color="#64748b" />
            <span><b>Office:</b> {faculty.officeLocation}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} color="#64748b" />
            <span><b>Hours:</b> {faculty.officeHours}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
        <button onClick={() => onAskQuestion && onAskQuestion(faculty)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          <MessageSquare size={14} /> Ask Question
        </button>
      </div>
    </div>
  );
}
