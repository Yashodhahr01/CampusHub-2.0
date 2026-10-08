import React from 'react';
import { User, BookOpen, MapPin, Clock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function FacultyProfile() {
  const { user } = useAuth();
  const profile = user?.profile || {
    employeeId: 'EMP_CSE_01',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    subjects: ['Database Management Systems', 'Advanced Database Systems'],
    officeLocation: 'Tech Tower, Room TT-304',
    officeHours: 'Mon-Fri: 2:00 PM - 4:00 PM'
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><User size={24} color="#0284c7" /> Faculty Profile</h1>
          <p className="page-subtitle">Personal information, office hours, and subjects handled</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <img 
          src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} 
          alt={user?.name}
          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #cbd5e1' }}
        />
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{user?.name}</h2>
          <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>{profile.designation} • {profile.department}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Employee ID: {profile.employeeId}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Office & Consultation Hours</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#0284c7" /> <b>Office Location:</b> {profile.officeLocation}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#0284c7" /> <b>Consultation Hours:</b> {profile.officeHours}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="#0284c7" /> <b>Subjects Handled:</b> {(profile.subjects || []).join(', ')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} color="#0284c7" /> <b>Email:</b> {user?.email}
          </div>
        </div>
      </div>
    </div>
  );
}
