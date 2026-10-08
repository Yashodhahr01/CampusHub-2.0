import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function EventCard({ event, onRegistered }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [registered, setRegistered] = useState(
    event.registeredUserIds && user ? event.registeredUserIds.includes(user.id) : false
  );

  const handleRegister = async () => {
    try {
      const res = await api.post(`/events/${event.id}/register`);
      if (res.success) {
        setRegistered(true);
        showToast(res.message, 'success');
        if (onRegistered) onRegistered();
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ height: '150px', position: 'relative', overflow: 'hidden' }}>
          <img 
            src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'} 
            alt={event.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)'
          }}>
            {event.category}
          </span>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            {event.name}
          </h3>

          <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} color="#4f46e5" /> <b>Date:</b> {event.date}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} color="#4f46e5" /> <b>Time:</b> {event.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} color="#4f46e5" /> <b>Venue:</b> {event.venue}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Organized by {event.organizer}</span>
        {registered ? (
          <button disabled className="btn btn-secondary btn-sm" style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}>
            <CheckCircle size={14} /> Registered
          </button>
        ) : (
          <button onClick={handleRegister} className="btn btn-primary btn-sm">
            Register Now
          </button>
        )}
      </div>
    </div>
  );
}
