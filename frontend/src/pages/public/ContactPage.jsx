import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Thank you! Your message has been sent to CampusHub administration.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Contact CampusHub Team</h1>
        <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Have questions about deployment, API integrations, or campus registration?</p>
      </div>

      <div className="grid-cols-2" style={{ gap: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Get in Touch</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin color="#4f46e5" size={20} /> Campus Tech Tower, Block A, Room 101
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail color="#4f46e5" size={20} /> support@campushub.demo
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone color="#4f46e5" size={20} /> +91 80 2666 0000
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea required rows={3} className="form-textarea" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
