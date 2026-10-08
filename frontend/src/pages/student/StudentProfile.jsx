import React from 'react';
import { User, Mail, Shield, BookOpen, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user } = useAuth();
  const profile = user?.profile || {
    usn: '1DS21CS108',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'B',
    gpa: 8.9,
    skills: ['React', 'Node.js', 'Python', 'SQL', 'UI/UX Design'],
    interests: ['Web Development', 'AI/ML', 'Cloud Computing'],
    bio: 'Full-stack enthusiast interested in scalable SaaS products and AI integration.'
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><User size={24} color="#4f46e5" /> Student Profile</h1>
          <p className="page-subtitle">Personal information, academic standing, and skill portfolio</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <img 
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
          alt={user?.name}
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #cbd5e1' }}
        />
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{user?.name}</h2>
          <div style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600 }}>USN: {profile.usn}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{profile.department} • Semester {profile.semester} ({profile.section})</div>
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={18} color="#f59e0b" /> Academic Overview
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>Current Cumulative GPA</span>
              <span style={{ fontWeight: 800, color: '#059669' }}>{profile.gpa} / 10.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', pb: '0.4rem' }}>
              <span style={{ color: '#64748b' }}>Email</span>
              <span style={{ fontWeight: 600 }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Attendance Standing</span>
              <span style={{ fontWeight: 700, color: '#047857' }}>88.5% (Good)</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} color="#8b5cf6" /> Skills & Domain Interests
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>Technical Skills:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(profile.skills || []).map((s, i) => (
                <span key={i} style={{ fontSize: '0.78rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>Interests:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(profile.interests || []).map((int, i) => (
                <span key={i} style={{ fontSize: '0.78rem', background: '#f1f5f9', color: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {int}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
