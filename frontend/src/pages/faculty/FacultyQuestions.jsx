import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';

export default function FacultyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    api.get('/questions').then(res => res.success && setQuestions(res.questions || []));
  };

  const handleReplySubmit = async (id, e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await api.put(`/questions/${id}/reply`, { answer: replyText });
      if (res.success) {
        showToast('Answer sent to student successfully!', 'success');
        setActiveReplyId(null);
        setReplyText('');
        fetchQuestions();
      }
    } catch (err) {
      showToast('Failed to post reply', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><MessageSquare size={24} color="#0284c7" /> Student Academic Questions</h1>
          <p className="page-subtitle">Review questions submitted by students and post answers</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {questions.map(q => (
          <div key={q.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {q.subject}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>{q.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Asked by <b>{q.studentName}</b> ({q.studentUsn})
                </div>
              </div>
              <StatusBadge status={q.status} />
            </div>

            <p style={{ fontSize: '0.9rem', color: '#334155', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', lineHeight: 1.5 }}>
              "{q.question}"
            </p>

            {q.answer ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem', borderRadius: '8px', color: '#047857', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>💬 Your Response:</div>
                {q.answer}
              </div>
            ) : (
              <div>
                {activeReplyId === q.id ? (
                  <form onSubmit={e => handleReplySubmit(q.id, e)} style={{ marginTop: '0.75rem' }}>
                    <textarea 
                      required 
                      rows={4} 
                      className="form-textarea" 
                      placeholder="Type your explanation or solution here..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      style={{ marginBottom: '0.75rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => setActiveReplyId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                      <button type="submit" className="btn btn-primary btn-sm"><Send size={14} /> Send Answer</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => { setActiveReplyId(q.id); setReplyText(''); }} className="btn btn-primary btn-sm">
                    Reply to Student
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
