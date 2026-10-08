import React, { useState, useEffect } from 'react';
import { DoorClosed, Search, Filter, Clock, Calendar, CheckCircle } from 'lucide-react';
import ClassroomCard from '../../components/ClassroomCard';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ClassroomVacancy() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    building: 'All',
    type: 'All',
    status: 'All',
    capacity: ''
  });

  const [reserveModalRoom, setReserveModalRoom] = useState(null);
  const [reserveForm, setReserveForm] = useState({
    purpose: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '16:00'
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchClassrooms();
  }, [filters]);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/classrooms', filters);
      if (res.success) {
        setClassrooms(res.classrooms || []);
      }
    } catch (err) {
      showToast('Failed to load classrooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms/reserve', {
        classroomId: reserveModalRoom.id,
        ...reserveForm
      });
      if (res.success) {
        showToast('Classroom reserved successfully!', 'success');
        setReserveModalRoom(null);
        fetchClassrooms();
      }
    } catch (err) {
      showToast(err.message || 'Reservation failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <DoorClosed size={24} color="#10b981" /> Classroom Vacancy Radar
          </h1>
          <p className="page-subtitle">Live room availability based on current timetables, active lectures, and reservations</p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label">Building</label>
            <select className="form-select" value={filters.building} onChange={e => setFilters({ ...filters, building: e.target.value })}>
              <option>All</option>
              <option>A Block</option>
              <option>B Block</option>
              <option>Tech Tower</option>
              <option>ECE Block</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label">Type</label>
            <select className="form-select" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
              <option>All</option>
              <option>Classroom</option>
              <option>Lab</option>
              <option>Seminar Hall</option>
              <option>Auditorium</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label">Status</label>
            <select className="form-select" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
              <option>All</option>
              <option>Vacant</option>
              <option>Occupied</option>
              <option>Reserved</option>
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button 
              onClick={() => setFilters({ ...filters, status: filters.status === 'Vacant' ? 'All' : 'Vacant' })}
              className={`btn ${filters.status === 'Vacant' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.65rem 1rem' }}
            >
              🟢 Available Now Only
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Calculating live room availability...</div>
      ) : (
        <div className="grid-cols-3">
          {classrooms.map(room => (
            <ClassroomCard key={room.id} room={room} onReserve={r => setReserveModalRoom(r)} />
          ))}
        </div>
      )}

      {/* Reservation Modal */}
      {reserveModalRoom && (
        <div className="modal-overlay" onClick={() => setReserveModalRoom(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Reserve Room {reserveModalRoom.roomNumber} ({reserveModalRoom.building})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Capacity: {reserveModalRoom.capacity} • Facilities: {(reserveModalRoom.facilities || []).join(', ')}
            </p>

            <form onSubmit={handleReserveSubmit}>
              <div className="form-group">
                <label className="form-label">Purpose / Reason for Reservation</label>
                <input required type="text" className="form-input" placeholder="e.g. Mini Project Group Discussion, IEEE Meeting" value={reserveForm.purpose} onChange={e => setReserveForm({ ...reserveForm, purpose: e.target.value })} />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input required type="time" className="form-input" value={reserveForm.startTime} onChange={e => setReserveForm({ ...reserveForm, startTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input required type="time" className="form-input" value={reserveForm.endTime} onChange={e => setReserveForm({ ...reserveForm, endTime: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setReserveModalRoom(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
