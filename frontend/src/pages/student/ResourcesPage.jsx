import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Upload } from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState('All');
  const [semester, setSemester] = useState('All');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: 'Database Management Systems',
    semester: '6',
    category: 'Notes'
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchResources();
  }, [category, semester, search]);

  const fetchResources = () => {
    api.get('/resources', { category, semester, search }).then(res => res.success && setResources(res.resources || []));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/resources', uploadForm);
      if (res.success) {
        showToast('Resource uploaded successfully!', 'success');
        setShowUploadModal(false);
        fetchResources();
      }
    } catch (err) {
      showToast('Upload failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><BookOpen size={24} color="#f59e0b" /> Academic Resource Hub</h1>
          <p className="page-subtitle">Notes, previous year question papers, lab manuals, syllabus, and assignment guides</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
          <Upload size={16} /> Upload Notes / Resource
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input type="text" className="form-input" placeholder="Search by title, subject, or professor..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option>All</option>
              <option>Notes</option>
              <option>Previous Year Papers</option>
              <option>Lab Manuals</option>
              <option>Syllabus</option>
              <option>Assignments</option>
              <option>Reference Materials</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
              <option>All</option>
              <option value="4">Sem 4</option>
              <option value="6">Sem 6</option>
              <option value="7">Sem 7</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-cols-3">
        {resources.map(res => (
          <ResourceCard key={res.id} resource={res} />
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Upload Academic Resource</h3>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input required type="text" className="form-input" placeholder="e.g. DBMS Unit 1-5 Complete Handwritten Notes" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input required type="text" className="form-input" value={uploadForm.subject} onChange={e => setUploadForm({ ...uploadForm, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}>
                    <option>Notes</option>
                    <option>Previous Year Papers</option>
                    <option>Lab Manuals</option>
                    <option>Syllabus</option>
                    <option>Assignments</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-textarea" placeholder="Brief details about the resource content..." value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Upload PDF / File</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
