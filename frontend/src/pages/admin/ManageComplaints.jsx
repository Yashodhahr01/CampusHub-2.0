import React, { useState, useEffect } from 'react';
import { AlertTriangle, Edit } from 'lucide-react';
import ComplaintCard from '../../components/ComplaintCard';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [activeUpdateModal, setActiveUpdateModal] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: 'In Progress',
    assignedTo: '',
    note: ''
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    api.get('/complaints').then(res => res.success && setComplaints(res.complaints || []));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/complaints/${activeUpdateModal.id}`, updateForm);
      if (res.success) {
        showToast('Complaint ticket updated successfully!', 'success');
        setActiveUpdateModal(null);
        fetchComplaints();
      }
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><AlertTriangle size={24} color="#ef4444" /> Manage Campus Complaints ({complaints.length})</h1>
          <p className="page-subtitle">Review, assign, and advance campus ticket resolution workflows</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {complaints.map(cmp => (
          <ComplaintCard 
            key={cmp.id} 
            complaint={cmp} 
            onUpdateStatus={c => {
              setActiveUpdateModal(c);
              setUpdateForm({ status: c.status, assignedTo: c.assignedTo || '', note: '' });
            }} 
          />
        ))}
      </div>

      {activeUpdateModal && (
        <div className="modal-overlay" onClick={() => setActiveUpdateModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Update Ticket Workflow</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>{activeUpdateModal.title}</p>

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group">
                <label className="form-label">Workflow Status</label>
                <select className="form-select" value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                  <option>Submitted</option>
                  <option>Under Review</option>
                  <option>Assigned</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Technician / Personnel</label>
                <input required type="text" className="form-input" placeholder="e.g. Electrician Team (Mr. Ramesh)" value={updateForm.assignedTo} onChange={e => setUpdateForm({ ...updateForm, assignedTo: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Update Note for Student</label>
                <textarea rows={3} className="form-textarea" placeholder="Note on current progress..." value={updateForm.note} onChange={e => setUpdateForm({ ...updateForm, note: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setActiveUpdateModal(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
