import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Academic',
    priority: 'Normal'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    api.get('/notices').then(res => res.success && setNotices(res.notices || []));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/notices', form);
      if (res.success) {
        showToast('Notice published successfully!', 'success');
        setShowAddModal(false);
        fetchNotices();
      }
    } catch (err) {
      showToast('Failed to create notice', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      showToast('Notice deleted', 'success');
      fetchNotices();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Bell size={24} color="#3b82f6" /> Manage Notices ({notices.length})</h1>
          <p className="page-subtitle">Publish, edit, and moderate campus announcements</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Publish New Notice
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Posted By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map(n => (
              <tr key={n.id}>
                <td style={{ fontWeight: 600 }}>{n.title}</td>
                <td><span className="badge badge-info">{n.category}</span></td>
                <td><StatusBadge status={n.priority} /></td>
                <td>{n.date}</td>
                <td>{n.postedBy}</td>
                <td>
                  <button onClick={() => handleDelete(n.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Publish New Notice</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Notice Title</label>
                <input required type="text" className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Academic</option>
                    <option>Examination</option>
                    <option>Placement</option>
                    <option>Event</option>
                    <option>Scholarship</option>
                    <option>General</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea required rows={4} className="form-textarea" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
