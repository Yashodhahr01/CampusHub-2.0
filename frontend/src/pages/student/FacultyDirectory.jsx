import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import FacultyCard from '../../components/FacultyCard';
import api from '../../services/api';

export default function FacultyDirectory() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/faculty', { search, department }).then(res => res.success && setFaculty(res.faculty || []));
  }, [search, department]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users size={24} color="#4f46e5" /> Faculty Directory</h1>
          <p className="page-subtitle">View professor profiles, subjects, office hours, and submit questions</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, position: 'relative' }}>
            <input type="text" className="form-input" placeholder="Search by name, subject, or department..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
              <option>All</option>
              <option>Computer Science & Engineering</option>
              <option>Information Science & Engineering</option>
              <option>Artificial Intelligence & Data Science</option>
              <option>Electronics & Communication Engineering</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-cols-3">
        {faculty.map(f => (
          <FacultyCard key={f.id} faculty={f} onAskQuestion={() => navigate('/student/ask-faculty', { state: { facultyId: f.id } })} />
        ))}
      </div>
    </div>
  );
}
