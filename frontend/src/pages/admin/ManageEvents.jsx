import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Hackathon',
    date: '2026-10-24',
    time: '09:00 AM',
    venue: 'Tech Tower Auditorium',
    organizer: 'Campus Tech Club'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    api.get('/events').then(res => res.success && setEvents(res.events || []));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/events', form);
      if (res.success) {
        showToast('Event created successfully!', 'success');
        setShowAddModal(false);
        fetchEvents();
      }
    } catch (err) {
      showToast('Failed to create event', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try {
      await api.delete(`/events/${id}`);
      showToast('Event deleted', 'success');
      fetchEvents();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Calendar size={24} color="#ec4899" /> Manage Events ({events.length})</h1>
          <p className="page-subtitle">Create hackathons, workshops, seminars, and campus club activities</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Create New Event
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Category</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Organizer</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 600 }}>{e.name}</td>
                <td><span className="badge badge-info">{e.category}</span></td>
                <td>{e.date} ({e.time})</td>
                <td>{e.venue}</td>
                <td>{e.organizer}</td>
                <td>{e.registeredUserIds ? e.registeredUserIds.length : 0} enrolled</td>
                <td>
                  <button onClick={() => handleDelete(e.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Create Campus Event</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input required type="text" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Hackathon</option>
                    <option>Workshop</option>
                    <option>Seminar</option>
                    <option>Cultural</option>
                    <option>Sports</option>
                    <option>Technical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input required type="text" className="form-input" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
                </div>
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input required type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input required type="text" className="form-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
