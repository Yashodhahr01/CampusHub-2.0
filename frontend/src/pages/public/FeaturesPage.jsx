import React from 'react';
import { Bot, DoorClosed, Users, BookOpen, Calendar, PackageSearch, AlertTriangle, Bell, ShieldCheck } from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    { title: 'AI Campus Assistant (RAG)', desc: 'Answers questions about syllabus, faculty office hours, exam dates, and campus facilities with sources.', icon: Bot, color: '#4f46e5' },
    { title: 'Classroom Vacancy System', desc: 'Calculates room availability based on live timetable schedules, ongoing lectures, and room reservations.', icon: DoorClosed, color: '#0284c7' },
    { title: 'Faculty Directory & Q&A', desc: 'Allows students to view office hours and ask academic questions with faculty response workflow.', icon: Users, color: '#10b981' },
    { title: 'Resource Hub Library', desc: 'Download unit notes, previous year question papers, lab manuals, and syllabus files.', icon: BookOpen, color: '#f59e0b' },
    { title: 'Smart Team Finder', desc: 'Matches project teammates using skill set scoring and domain interest indicators.', icon: Users, color: '#8b5cf6' },
    { title: 'Events & Club Portal', desc: 'Event listings for hackathons, workshops, cultural fests with instant 1-click registration.', icon: Calendar, color: '#ec4899' },
    { title: 'Campus Complaints', desc: '5-stage progress tracking workflow for classroom, lab, and campus infrastructure issues.', icon: AlertTriangle, color: '#ef4444' },
    { title: 'Lost & Found System', desc: 'Item reporting with keyword and category matching engine to reconnect lost items with owners.', icon: PackageSearch, color: '#06b6d4' }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>Platform Core Features</h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', marginTop: '0.5rem' }}>Comprehensive tools designed specifically for engineering students, faculty, and college administrators.</p>
      </div>

      <div className="grid-cols-3" style={{ gap: '1.5rem' }}>
        {featureList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="card">
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: f.color }}>
                <Icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
