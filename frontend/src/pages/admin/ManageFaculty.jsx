import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'Faculty@123',
    employeeId: '',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    subjects: 'DBMS, Operating Systems',
    officeLocation: 'Tech Tower TT-201'
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = () => {
    api.get('/admin/faculty').then(res => res.success && setFaculty(res.faculty || []));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/faculty', form);
      if (res.success) {
        showToast('Faculty member added successfully!', 'success');
        setShowAddModal(false);
        fetchFaculty();
      }
    } catch (err) {
      showToast('Failed to add faculty', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await api.delete(`/admin/faculty/${id}`);
      showToast('Faculty deleted', 'success');
      fetchFaculty();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users size={24} color="#0284c7" /> Manage Faculty ({faculty.length})</h1>
          <p className="page-subtitle">Add, edit, and manage faculty member profiles</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Faculty Member
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Office</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map(f => (
              <tr key={f.id}>
                <td style={{ fontWeight: 600 }}>{f.name}</td>
                <td><span className="badge badge-info">{f.employeeId}</span></td>
                <td>{f.designation}</td>
                <td>{f.department}</td>
                <td>{f.officeLocation}</td>
                <td>
                  <button onClick={() => handleDelete(f.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Add Faculty Member</h3>
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
                  <label className="form-label">Employee ID</label>
                  <input required type="text" className="form-input" placeholder="EMP_CSE_05" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input required type="text" className="form-input" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Faculty Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
