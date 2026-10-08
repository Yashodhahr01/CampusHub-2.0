import React, { useState, useEffect } from 'react';
import { DoorClosed, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';

export default function ManageClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    roomNumber: '',
    building: 'A Block',
    floor: '1st Floor',
    capacity: '60',
    type: 'Classroom',
    facilities: 'Projector, Wi-Fi, AC'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    api.get('/classrooms').then(res => res.success && setClassrooms(res.classrooms || []));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms', form);
      if (res.success) {
        showToast('Classroom created successfully!', 'success');
        setShowAddModal(false);
        fetchRooms();
      }
    } catch (err) {
      showToast('Failed to add classroom', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this classroom record?')) return;
    try {
      await api.delete(`/classrooms/${id}`);
      showToast('Classroom deleted', 'success');
      fetchRooms();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><DoorClosed size={24} color="#10b981" /> Manage Classrooms ({classrooms.length})</h1>
          <p className="page-subtitle">Add new rooms, update facilities, and set room schedules</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Classroom
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Building / Floor</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Facilities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.roomNumber}</td>
                <td>{c.building} ({c.floor})</td>
                <td>{c.type}</td>
                <td>{c.capacity} seats</td>
                <td><StatusBadge status={c.status} /></td>
                <td>{(c.facilities || []).join(', ')}</td>
                <td>
                  <button onClick={() => handleDelete(c.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Classroom</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input required type="text" className="form-input" placeholder="e.g. A-305 or TT-205" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} />
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Building</label>
                  <select className="form-select" value={form.building} onChange={e => setForm({ ...form, building: e.target.value })}>
                    <option>A Block</option>
                    <option>B Block</option>
                    <option>Tech Tower</option>
                    <option>ECE Block</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Floor</label>
                  <input required type="text" className="form-input" placeholder="2nd Floor" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} />
                </div>
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input required type="number" className="form-input" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Classroom</option>
                    <option>Lab</option>
                    <option>Seminar Hall</option>
                    <option>Auditorium</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Facilities (Comma separated)</label>
                <input type="text" className="form-input" value={form.facilities} onChange={e => setForm({ ...form, facilities: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Classroom</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
