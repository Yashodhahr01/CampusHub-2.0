import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login, loginDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      if (res.user.role === 'student') navigate('/student/dashboard');
      else if (res.user.role === 'faculty') navigate('/faculty/dashboard');
      else if (res.user.role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setLoading(true);
    try {
      const res = await loginDemo(role);
      showToast(`Logged in as Demo ${role.toUpperCase()}!`, 'success');
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--navbar-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: '#f8fafc' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Sign in to CampusHub 2.0</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Access your personalized smart ecosystem portal</p>
        </div>

        {/* 1-Click Demo Switcher Card */}
        <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} /> Quick Demo Login (No typing needed):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button onClick={() => handleDemoClick('student')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>🎓 Student</button>
            <button onClick={() => handleDemoClick('faculty')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>👨‍🏫 Faculty</button>
            <button onClick={() => handleDemoClick('admin')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>👑 Admin</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '1.75rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                required 
                type="email" 
                className="form-input" 
                placeholder="student@campushub.demo"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              required 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
