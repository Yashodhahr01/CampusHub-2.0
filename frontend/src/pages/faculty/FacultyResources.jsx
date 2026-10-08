import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function FacultyResources() {
  const [resources, setResources] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: 'Database Management Systems',
    semester: '6',
    category: 'Notes'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    api.get('/resources').then(res => res.success && setResources(res.resources || []));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources', form);
      if (res.success) {
        showToast('Resource uploaded successfully!', 'success');
        setShowUploadModal(false);
        fetchResources();
      }
    } catch (err) {
      showToast('Upload failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
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
          <h1 className="page-title"><BookOpen size={24} color="#0284c7" /> Faculty Resource Management</h1>
          <p className="page-subtitle">Upload unit notes, question papers, and lab manuals for students</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
          <Upload size={16} /> Upload New Material
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Downloads</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.title}</td>
                <td>{r.subject}</td>
                <td><span className="badge badge-info">{r.category}</span></td>
                <td>{r.downloadsCount || 0}</td>
                <td>{r.date}</td>
                <td>
                  <button onClick={() => handleDelete(r.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Upload Study Material</h3>
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input required type="text" className="form-input" placeholder="e.g. DBMS Unit 1 Notes" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
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
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
