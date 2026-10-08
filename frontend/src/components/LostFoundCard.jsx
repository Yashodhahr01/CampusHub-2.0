import React from 'react';
import { MapPin, Calendar, Phone, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function LostFoundCard({ item, onResolve }) {
  const { showToast } = useToast();
  const isLost = item.itemType === 'LOST';

  const handleResolve = async () => {
    try {
      await api.put(`/lostfound/${item.id}/resolve`);
      showToast('Item status updated to Resolved', 'success');
      if (onResolve) onResolve();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
          <img 
            src={item.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80'} 
            alt={item.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: isLost ? '#ef4444' : '#10b981',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '4px'
          }}>
            {item.itemType}
          </span>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}>{item.category}</div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{item.title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem' }}>{item.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={13} /> {item.location}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={13} /> {item.date}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={13} /> {item.userContact}</div>
          </div>

          {item.potentialMatches && item.potentialMatches.length > 0 && (
            <div style={{ marginTop: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} /> Possible Match Found in System!
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: item.status === 'Resolved' ? '#059669' : '#b45309', fontWeight: 600 }}>
          Status: {item.status}
        </span>
        {item.status !== 'Resolved' && (
          <button onClick={handleResolve} className="btn btn-secondary btn-sm">
            Mark Claimed / Resolved
          </button>
        )}
      </div>
    </div>
  );
}
