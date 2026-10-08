import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    usn: '',
    semester: '6',
    section: 'A',
    skills: 'React, Node.js, Python',
    interests: 'Web Development, AI/ML',
    employeeId: '',
    subjects: 'DBMS, Operating Systems',
    officeLocation: 'Tech Tower TT-201',
    officeHours: 'Mon-Fri 2:00 PM - 4:00 PM'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register({ ...formData, role });
      showToast('Registration successful! Welcome to CampusHub 2.0', 'success');
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '2rem 1rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Join CampusHub 2.0</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Create your smart campus profile</p>
        </div>

        <div className="card">
          {/* Role selector tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {['student', 'faculty', 'admin'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  textTransform: 'capitalize',
                  background: role === r ? '#ffffff' : 'transparent',
                  color: role === r ? '#4f46e5' : '#64748b',
                  boxShadow: role === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input required type="password" className="form-input" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                  <option>Computer Science & Engineering</option>
                  <option>Information Science & Engineering</option>
                  <option>Artificial Intelligence & Data Science</option>
                  <option>Electronics & Communication Engineering</option>
                </select>
              </div>
            </div>

            {/* Role specific fields */}
            {role === 'student' && (
              <>
                <div className="grid-cols-3" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">USN Number</label>
                    <input required type="text" className="form-input" placeholder="1DS21CS108" value={formData.usn} onChange={e => setFormData({ ...formData, usn: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select className="form-select" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                      <option>2</option>
                      <option>4</option>
                      <option>6</option>
                      <option>8</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Section</label>
                    <input type="text" className="form-input" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Skills (Comma separated)</label>
                  <input type="text" className="form-input" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                </div>

                <div className="form-group">
                  <label className="form-label">Domains / Interests</label>
                  <input type="text" className="form-input" value={formData.interests} onChange={e => setFormData({ ...formData, interests: e.target.value })} />
                </div>
              </>
            )}

            {role === 'faculty' && (
              <>
                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input required type="text" className="form-input" placeholder="EMP_CSE_01" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subjects Handled</label>
                    <input type="text" className="form-input" value={formData.subjects} onChange={e => setFormData({ ...formData, subjects: e.target.value })} />
                  </div>
                </div>

                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Office Location</label>
                    <input type="text" className="form-input" value={formData.officeLocation} onChange={e => setFormData({ ...formData, officeLocation: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Office Hours</label>
                    <input type="text" className="form-input" value={formData.officeHours} onChange={e => setFormData({ ...formData, officeHours: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
              {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
