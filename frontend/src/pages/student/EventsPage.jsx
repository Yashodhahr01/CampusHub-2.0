import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import EventCard from '../../components/EventCard';
import api from '../../services/api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [category, search]);

  const fetchEvents = () => {
    api.get('/events', { category, search }).then(res => res.success && setEvents(res.events || []));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Calendar size={24} color="#ec4899" /> Events & Club Activities</h1>
          <p className="page-subtitle">Discover hackathons, technical workshops, sports, and cultural fests</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input type="text" className="form-input" placeholder="Search events by title or venue..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option>All</option>
              <option>Hackathon</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Cultural</option>
              <option>Sports</option>
              <option>Technical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-cols-3">
        {events.map(evt => (
          <EventCard key={evt.id} event={evt} onRegistered={fetchEvents} />
        ))}
      </div>
    </div>
  );
}
