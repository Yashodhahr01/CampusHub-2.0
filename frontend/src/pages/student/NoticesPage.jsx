import React, { useState, useEffect } from 'react';
import { Bell, Search, Filter } from 'lucide-react';
import NoticeCard from '../../components/NoticeCard';
import api from '../../services/api';

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/notices', { category, priority, search }).then(res => res.success && setNotices(res.notices || []));
  }, [category, priority, search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Bell size={24} color="#3b82f6" /> Smart Campus Notices</h1>
          <p className="page-subtitle">Official announcements, academic schedules, placements, and exam notifications</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input type="text" className="form-input" placeholder="Search notices by keyword or poster..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option>All</option>
              <option>Academic</option>
              <option>Examination</option>
              <option>Placement</option>
              <option>Event</option>
              <option>Scholarship</option>
              <option>General</option>
              <option>Emergency</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '130px' }}>
            <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option>All</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Normal</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices.map(notice => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>
    </div>
  );
}
