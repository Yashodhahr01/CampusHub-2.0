import React from 'react';
import { Sparkles, ShieldCheck, Award, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          About CampusHub 2.0
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>
          Unified Intelligence for Modern Higher Education
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '0.75rem' }}>
          Engineered to bridge communication, classroom occupancy, academic resources, and AI assistance across students, faculty, and college administration.
        </p>
      </div>

      <div className="grid-cols-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
        <div className="card">
          <ShieldCheck size={28} color="#4f46e5" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Our Mission</h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
            To eliminate administrative friction, enable instant classroom discovery, facilitate faculty consultation, and empower students with AI knowledge retrieval.
          </p>
        </div>

        <div className="card">
          <Award size={28} color="#0284c7" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Production Standards</h3>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
            Designed following modern SaaS design principles (Notion & Linear inspiration), clean RESTful APIs, JWT role authorization, and local RAG vector search abstractions.
          </p>
        </div>
      </div>
    </div>
  );
}
