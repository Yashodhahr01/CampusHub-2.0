import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: 'Database Management Systems',
    semester: '6',
    department: 'Computer Science & Engineering',
    category: 'Notes'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    api.get('/resources').then(res => res.success && setResources(res.resources || []));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources', form);
      if (res.success) {
        showToast('Resource uploaded!', 'success');
        setShowAddModal(false);
        fetchResources();
      }
    } catch (err) {
      showToast('Upload failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource entry?')) return;
    try {
      await api.delete(`/resources/${id}`);
      showToast('Resource deleted', 'success');
      fetchResources();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BookOpen size={24} color="#f59e0b" /> Manage Academic Resources ({resources.length})</h1>
          <p className="page-subtitle">Upload and moderate notes, previous year papers, and syllabus resources</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Upload New Resource
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Semester</th>
              <th>Uploaded By</th>
              <th>Downloads</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.title}</td>
                <td>{r.subject}</td>
                <td><span className="badge badge-info">{r.category}</span></td>
                <td>Sem {r.semester}</td>
                <td>{r.uploadedByName}</td>
                <td>{r.downloadsCount || 0}</td>
                <td>
                  <button onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Upload Academic Resource</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input required type="text" className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input required type="text" className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Notes</option>
                    <option>Previous Year Papers</option>
                    <option>Lab Manuals</option>
                    <option>Syllabus</option>
                    <option>Assignments</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
