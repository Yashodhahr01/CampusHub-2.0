import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Edit, Search } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AIKnowledgeBase() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    category: 'Faculty',
    title: '',
    content: '',
    tags: 'faculty, hours, office'
  });

  useEffect(() => {
    fetchKB();
  }, [category, search]);

  const fetchKB = () => {
    api.get('/knowledge', { category, search }).then(res => res.success && setItems(res.knowledgeBase || []));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/knowledge/${editItem.id}`, form);
        showToast('Knowledge base entry updated!', 'success');
      } else {
        await api.post('/knowledge', form);
        showToast('Knowledge base entry added!', 'success');
      }
      setShowAddModal(false);
      setEditItem(null);
      fetchKB();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete entry from AI Knowledge Base?')) return;
    try {
      await api.delete(`/knowledge/${id}`);
      showToast('Knowledge entry deleted', 'success');
      fetchKB();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      category: item.category,
      title: item.title,
      content: item.content,
      tags: (item.tags || []).join(', ')
    });
    setShowAddModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Database size={24} color="#6366f1" /> AI RAG Knowledge Base ({items.length})</h1>
          <p className="page-subtitle">College knowledge repository used by CampusHub AI Assistant to answer student questions</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ category: 'Faculty', title: '', content: '', tags: '' }); setShowAddModal(true); }} className="btn btn-primary">
          <Plus size={16} /> Add Knowledge Entry
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input type="text" className="form-input" placeholder="Search knowledge entries..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option>All</option>
              <option>Faculty</option>
              <option>Departments</option>
              <option>Courses</option>
              <option>Classrooms</option>
              <option>Notices</option>
              <option>Events</option>
              <option>Rules</option>
              <option>Resources</option>
              <option>FAQs</option>
              <option>Campus facilities</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(kb => (
          <div key={kb.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span className="badge badge-info" style={{ textTransform: 'none' }}>{kb.category}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.35rem' }}>{kb.title}</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(kb)} style={{ color: '#4f46e5' }}><Edit size={16} /></button>
                <button onClick={() => handleDelete(kb.id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#334155', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {kb.content}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(kb.tags || []).map((t, idx) => (
                <span key={idx} style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{editItem ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}</h3>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option>Faculty</option>
                  <option>Departments</option>
                  <option>Courses</option>
                  <option>Classrooms</option>
                  <option>Notices</option>
                  <option>Events</option>
                  <option>Rules</option>
                  <option>Resources</option>
                  <option>FAQs</option>
                  <option>Campus facilities</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input required type="text" className="form-input" placeholder="e.g. DBMS Mini Project Requirements" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Factual Content (Grounded Knowledge)</label>
                <textarea required rows={4} className="form-textarea" placeholder="Detailed factual information for AI RAG index..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (Comma separated)</label>
                <input type="text" className="form-input" placeholder="dbms, mini project, evaluation" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Save to KB'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
