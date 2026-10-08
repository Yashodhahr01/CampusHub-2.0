import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import ComplaintCard from '../../components/ComplaintCard';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Classroom issue',
    location: '',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    api.get('/complaints').then(res => res.success && setComplaints(res.complaints || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/complaints', form);
      if (res.success) {
        showToast('Complaint ticket registered successfully!', 'success');
        setShowSubmitModal(false);
        fetchComplaints();
      }
    } catch (err) {
      showToast('Submission failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><AlertTriangle size={24} color="#ef4444" /> Campus Complaints & Help Desk</h1>
          <p className="page-subtitle">Report classroom, lab, electrical, or infrastructure issues and track resolution progress</p>
        </div>
        <button onClick={() => setShowSubmitModal(true)} className="btn btn-primary">
          <Plus size={16} /> Submit New Complaint Ticket
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {complaints.map(cmp => (
          <ComplaintCard key={cmp.id} complaint={cmp} />
        ))}
      </div>

      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Register Complaint Ticket</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Issue Title</label>
                <input required type="text" className="form-input" placeholder="e.g. Broken HDMI port in A-204" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Classroom issue</option>
                    <option>Lab issue</option>
                    <option>Wi-Fi issue</option>
                    <option>Electrical issue</option>
                    <option>Infrastructure issue</option>
                    <option>Cleanliness</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Room Number</label>
                  <input required type="text" className="form-input" placeholder="e.g. A Block, Room A-204" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description of Problem</label>
                <textarea required rows={3} className="form-textarea" placeholder="Explain the malfunction or issue..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowSubmitModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
