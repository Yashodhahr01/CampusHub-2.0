import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Bell, BookOpen, Calendar, DoorClosed, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ faculty: [], notices: [], resources: [], events: [], classrooms: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ faculty: [], notices: [], resources: [], events: [], classrooms: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/search', { q: query });
        if (res.success) {
          setResults(res.results);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const hasResults = Object.values(results).some(arr => arr.length > 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '700px', padding: 0 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', gap: '0.75rem' }}>
          <Search size={20} color="#64748b" />
          <input
            type="text"
            placeholder="Search faculty, notices, resources, events, classrooms..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem' }}
          />
          <button onClick={onClose} style={{ padding: '0.2rem' }}><X size={18} color="#64748b" /></button>
        </div>

        <div style={{ padding: '1.25rem', maxHeight: '420px', overflowY: 'auto' }}>
          {loading && <div style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>Searching CampusHub database...</div>}

          {!loading && !query && (
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
              Type a keyword like <b>"Ananya"</b>, <b>"DBMS"</b>, <b>"A-204"</b>, or <b>"Hackathon"</b>...
            </div>
          )}

          {!loading && query && !hasResults && (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No results found for "{query}".</div>
          )}

          {results.faculty.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} /> Faculty ({results.faculty.length})
              </div>
              {results.faculty.map(f => (
                <div key={f.id} onClick={() => handleNavigate('/student/faculty-directory')} style={itemStyle}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.department} • {f.subjects.join(', ')}</div>
                  </div>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}

          {results.classrooms.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DoorClosed size={14} /> Classrooms ({results.classrooms.length})
              </div>
              {results.classrooms.map(c => (
                <div key={c.id} onClick={() => handleNavigate('/student/classroom-vacancy')} style={itemStyle}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.roomNumber} ({c.building})</div>
                    <div style={{ fontSize: '0.75rem', color: c.status === 'Vacant' ? '#059669' : '#dc2626' }}>
                      Status: {c.status} • Capacity: {c.capacity}
                    </div>
                  </div>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}

          {results.notices.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bell size={14} /> Notices ({results.notices.length})
              </div>
              {results.notices.map(n => (
                <div key={n.id} onClick={() => handleNavigate('/student/notices')} style={itemStyle}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.category} • {n.date}</div>
                  </div>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}

          {results.resources.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={14} /> Resources ({results.resources.length})
              </div>
              {results.resources.map(r => (
                <div key={r.id} onClick={() => handleNavigate('/student/resources')} style={itemStyle}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.category} • {r.subject}</div>
                  </div>
                  <ArrowRight size={14} color="#94a3b8" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background 0.15s',
  marginBottom: '0.35rem',
  border: '1px solid #f1f5f9'
};
