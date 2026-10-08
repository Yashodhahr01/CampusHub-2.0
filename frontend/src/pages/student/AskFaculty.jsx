import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';

export default function AskFaculty() {
  const location = useLocation();
  const { showToast } = useToast();

  const [facultyList, setFacultyList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    facultyId: location.state?.facultyId || '',
    subject: 'Database Management Systems',
    title: '',
    question: ''
  });

  useEffect(() => {
    api.get('/faculty').then(res => {
      if (res.success) {
        setFacultyList(res.faculty || []);
        if (!formData.facultyId && res.faculty.length > 0) {
          setFormData(prev => ({ ...prev, facultyId: res.faculty[0].id }));
        }
      }
    });
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    api.get('/questions').then(res => res.success && setQuestions(res.questions || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/questions', formData);
      if (res.success) {
        showToast(res.message, 'success');
        setFormData(prev => ({ ...prev, title: '', question: '' }));
        fetchQuestions();
      }
    } catch (err) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><MessageSquare size={24} color="#4f46e5" /> Ask Faculty</h1>
          <p className="page-subtitle">Submit academic questions directly to professors and track responses</p>
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        {/* Form to submit question */}
        <form onSubmit={handleSubmit} className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Submit Academic Query</h3>

          <div className="form-group">
            <label className="form-label">Select Professor</label>
            <select className="form-select" value={formData.facultyId} onChange={e => setFormData({ ...formData, facultyId: e.target.value })}>
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input required type="text" className="form-input" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Topic / Question Title</label>
            <input required type="text" className="form-input" placeholder="e.g. B+ Tree indexing performance in MySQL" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Question</label>
            <textarea required rows={4} className="form-textarea" placeholder="Explain your doubt clearly..." value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
            <Send size={16} /> Submit Question to Faculty
          </button>
        </form>

        {/* History of Questions & Answers */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Questions ({questions.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map(q => (
              <div key={q.id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {q.subject}
                    </span>
                    <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a', marginTop: '0.3rem' }}>{q.title}</h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>To: <b>{q.facultyName}</b></div>
                  </div>
                  <StatusBadge status={q.status} />
                </div>

                <p style={{ fontSize: '0.85rem', color: '#334155', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                  "{q.question}"
                </p>

                {q.answer ? (
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem', borderRadius: '8px', color: '#047857', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>💬 Answer from {q.facultyName}:</div>
                    {q.answer}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> Awaiting professor's reply...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
