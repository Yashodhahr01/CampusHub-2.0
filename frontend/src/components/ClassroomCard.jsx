import React from 'react';
import { DoorClosed, Users, MapPin, Clock, Wifi, Monitor, CheckCircle, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ClassroomCard({ room, onReserve }) {
  const isVacant = room.status === 'Vacant';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{room.roomNumber}</h3>
            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <MapPin size={14} /> {room.building}, {room.floor}
            </div>
          </div>
          <StatusBadge status={room.status} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: '#475569', marginBottom: '1rem', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={14} color="#4f46e5" />
            <span>Cap: <b>{room.capacity}</b></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <DoorClosed size={14} color="#4f46e5" />
            <span>Type: <b>{room.type}</b></span>
          </div>
        </div>

        {/* Current status detail */}
        <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '1rem' }}>
          {room.status === 'Occupied' && (
            <div style={{ background: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #fecaca', color: '#b91c1c' }}>
              🔴 <b>Ongoing:</b> {room.currentClass}
            </div>
          )}
          {room.status === 'Reserved' && (
            <div style={{ background: '#fffbe6', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #fde68a', color: '#b45309' }}>
              🟡 <b>Reserved:</b> {room.currentClass}
            </div>
          )}
          {room.status === 'Vacant' && (
            <div style={{ background: '#ecfdf5', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #a7f3d0', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> Available until: <b>{room.availableUntil}</b>
            </div>
          )}
        </div>

        {/* Facilities tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {(room.facilities || []).map((fac, idx) => (
            <span key={idx} style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              {fac}
            </span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => onReserve && onReserve(room)}
          className={`btn ${isVacant ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ flex: 1 }}
        >
          {isVacant ? 'Request / Reserve Room' : 'View Schedule'}
        </button>
      </div>
    </div>
  );
}
