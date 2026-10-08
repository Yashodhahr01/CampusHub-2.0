import React, { useState, useEffect } from 'react';
import { Users, Plus, Sparkles, UserCheck } from 'lucide-react';
import ProjectCard from '../../components/ProjectCard';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function TeamFinderPage() {
  const [projects, setProjects] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [applyModalProject, setApplyModalProject] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const { showToast } = useToast();

  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    department: 'Computer Science & Engineering',
    requiredSkills: 'React, Node.js, Python',
    interests: 'Web Development, AI/ML',
    teamSize: 4,
    openPositions: 3
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    api.get('/team').then(res => res.success && setProjects(res.projects || []));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/team', postForm);
      if (res.success) {
        showToast('Project posted successfully to Team Finder!', 'success');
        setShowPostModal(false);
        fetchProjects();
      }
    } catch (err) {
      showToast('Failed to post project', 'error');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/team/${applyModalProject.id}/request`, { message: applyMessage });
      if (res.success) {
        showToast(res.message, 'success');
        setApplyModalProject(null);
        setApplyMessage('');
      }
    } catch (err) {
      showToast(err.message || 'Application failed', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><UserCheck size={24} color="#8b5cf6" /> Smart Team Finder</h1>
          <p className="page-subtitle">Find teammates for hackathons, mini projects, and research papers matched by your profile skills & interests</p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="btn btn-primary">
          <Plus size={16} /> Post Project Listing
        </button>
      </div>

      {/* Info Banner */}
      <div className="card" style={{ marginBottom: '1.5rem', background: '#eef2ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Sparkles size={24} color="#4f46e5" />
        <div style={{ fontSize: '0.875rem', color: '#3730a3' }}>
          <b>Recommendation Algorithm Active:</b> Projects are automatically sorted by your skill compatibility score. Green highlighted badges indicate skills you possess!
        </div>
      </div>

      <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
        {projects.map(proj => (
          <ProjectCard key={proj.id} project={proj} onApply={p => setApplyModalProject(p)} />
        ))}
      </div>

      {/* Post Project Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Post Project Listing</h3>

            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input required type="text" className="form-input" placeholder="e.g. AI-Powered Smart Campus IoT Network" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Goals</label>
                <textarea required rows={3} className="form-textarea" placeholder="Explain what your team is building..." value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Required Teammate Skills (Comma separated)</label>
                <input required type="text" className="form-input" value={postForm.requiredSkills} onChange={e => setPostForm({ ...postForm, requiredSkills: e.target.value })} />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Total Team Size</label>
                  <input required type="number" className="form-input" value={postForm.teamSize} onChange={e => setPostForm({ ...postForm, teamSize: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Open Positions</label>
                  <input required type="number" className="form-input" value={postForm.openPositions} onChange={e => setPostForm({ ...postForm, openPositions: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowPostModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Project Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply / Request Modal */}
      {applyModalProject && (
        <div className="modal-overlay" onClick={() => setApplyModalProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Apply to Join: {applyModalProject.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Project Lead: {applyModalProject.ownerName}</p>

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label className="form-label">Message to Project Lead</label>
                <textarea required rows={4} className="form-textarea" placeholder="Introduce yourself and highlight your relevant experience..." value={applyMessage} onChange={e => setApplyMessage(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setApplyModalProject(null)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Send Join Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
