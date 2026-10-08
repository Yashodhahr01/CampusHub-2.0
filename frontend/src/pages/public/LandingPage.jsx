import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Bot, DoorClosed, Users, BookOpen, Calendar, ArrowRight, ShieldCheck, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async (role) => {
    await loginDemo(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      {/* Hero Header Banner */}
      <section style={{
        padding: '5rem 2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#eef2ff',
          color: '#4f46e5',
          fontSize: '0.85rem',
          fontWeight: 700,
          padding: '0.35rem 1rem',
          borderRadius: '30px',
          marginBottom: '1.5rem',
          border: '1px solid #c7d2fe'
        }}>
          <Sparkles size={16} /> CampusHub 2.0 — Next-Gen Smart College Ecosystem
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
          color: '#0f172a'
        }}>
          One Campus. <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Everything You Need.</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#475569',
          maxWidth: '750px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          CampusHub 2.0 brings your college's classrooms, faculty, resources, notices, events, and AI assistance into one intelligent platform.
        </p>

        {/* Hero CTA buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          {user ? (
            <Link to={user.role === 'student' ? '/student/dashboard' : (user.role === 'faculty' ? '/faculty/dashboard' : '/admin/dashboard')} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '10px' }}>
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '10px' }}>
                Explore CampusHub <ArrowRight size={18} />
              </Link>
              <Link to="/student/ai-assistant" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '10px' }}>
                <Bot size={18} color="#4f46e5" /> Try AI Assistant
              </Link>
            </>
          )}
        </div>

        {/* Demo Accounts Quick Login Bar */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto 4rem',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#f59e0b" /> Instant Demo Access — 1-Click Login:
          </div>
          <div className="grid-cols-3" style={{ gap: '1rem' }}>
            <div onClick={() => handleDemoClick('student')} style={demoBoxStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4f46e5' }}>🎓 Student Account</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>student@campushub.demo</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Password: Student@123</div>
            </div>
            <div onClick={() => handleDemoClick('faculty')} style={demoBoxStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0284c7' }}>👨‍🏫 Faculty Account</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>faculty@campushub.demo</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Password: Faculty@123</div>
            </div>
            <div onClick={() => handleDemoClick('admin')} style={demoBoxStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#059669' }}>👑 Admin Account</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>admin@campushub.demo</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Password: Admin@123</div>
            </div>
          </div>
        </div>

        {/* Realistic Interactive SaaS Dashboard Preview Visual */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12)',
          padding: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '0.5rem' }}>CampusHub 2.0 Live Portal Preview</span>
          </div>

          <div className="grid-cols-3" style={{ gap: '1.25rem' }}>
            <div style={heroWidgetStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Bot size={16} /> CampusHub AI Assistant
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>"Which classrooms are vacant right now?"</p>
              <div style={{ fontSize: '0.78rem', color: '#059669', background: '#ecfdf5', padding: '0.4rem 0.6rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                ✓ Room A-101 (60 cap) & TT-101 (45 cap) are VACANT until 4:30 PM.
              </div>
            </div>

            <div style={heroWidgetStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <DoorClosed size={16} /> Vacant Classroom Radar
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>ROOM A-204 — VACANT 🟢</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Capacity: 40 | Facilities: Projector, Wi-Fi, AC</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '0.6rem', width: '100%' }}>Reserve Room</button>
            </div>

            <div style={heroWidgetStyle}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Calendar size={16} /> Flagship Events
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>HackCampus 2026 (24hr)</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Oct 24-25 • Tech Tower Auditorium</div>
              <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>Registration Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '4rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
            Built for Modern Engineering Ecosystems
          </h2>

          <div className="grid-cols-3" style={{ gap: '1.5rem' }}>
            <div className="card">
              <Bot size={32} color="#4f46e5" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Campus Assistant</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>RAG-powered AI assistant pre-trained on college syllabi, faculty hours, schedules, and campus facilities.</p>
            </div>
            <div className="card">
              <DoorClosed size={32} color="#0284c7" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Classroom Vacancy Engine</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Real-time schedule calculator displaying vacant rooms, current classes, and instant reservation workflows.</p>
            </div>
            <div className="card">
              <Users size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart Team Finder</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Algorithmic skill & interest matching engine to assemble hackathon and project teams with match percentage scores.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const demoBoxStyle = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

const heroWidgetStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '1rem'
};
