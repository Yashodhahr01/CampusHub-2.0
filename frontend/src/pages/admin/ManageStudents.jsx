import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'Student@123',
    usn: '',
    department: 'Computer Science & Engineering',
    semester: '6',
    section: 'A'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    api.get('/admin/students').then(res => res.success && setStudents(res.students || []));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/students', form);
      if (res.success) {
        showToast('Student created successfully!', 'success');
        setShowAddModal(false);
        fetchStudents();
      }
    } catch (err) {
      showToast('Failed to add student', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      showToast('Student deleted', 'success');
      fetchStudents();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users size={24} color="#4f46e5" /> Manage Students ({students.length})</h1>
          <p className="page-subtitle">Add, inspect, search, and manage student accounts</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Student
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>USN</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td><span className="badge badge-info">{s.usn}</span></td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>Sem {s.semester} ({s.section})</td>
                <td>
                  <button onClick={() => handleDelete(s.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Student</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input required type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">USN</label>
                  <input required type="text" className="form-input" placeholder="1DS21CS115" value={form.usn} onChange={e => setForm({ ...form, usn: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select className="form-select" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                    <option>2</option>
                    <option>4</option>
                    <option>6</option>
                    <option>8</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Student Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
