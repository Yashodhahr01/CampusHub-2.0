const express = require('express');
const db = require('../database/db');
const { calculateClassroomStatuses } = require('../services/timetableEngine');

const router = express.Router();

// GLOBAL SEARCH API
router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ success: true, results: { faculty: [], notices: [], resources: [], events: [], classrooms: [] } });
  }

  const query = q.toLowerCase();

  // Search faculty
  const faculty = db.get('faculty').filter(f => 
    f.name.toLowerCase().includes(query) ||
    f.department.toLowerCase().includes(query) ||
    f.subjects.some(s => s.toLowerCase().includes(query))
  );

  // Search notices
  const notices = db.get('notices').filter(n => 
    n.title.toLowerCase().includes(query) ||
    n.category.toLowerCase().includes(query) ||
    n.content.toLowerCase().includes(query)
  );

  // Search resources
  const resources = db.get('resources').filter(r => 
    r.title.toLowerCase().includes(query) ||
    r.subject.toLowerCase().includes(query) ||
    r.category.toLowerCase().includes(query)
  );

  // Search events
  const events = db.get('events').filter(e => 
    e.name.toLowerCase().includes(query) ||
    e.category.toLowerCase().includes(query) ||
    e.venue.toLowerCase().includes(query)
  );

  // Search classrooms
  const classrooms = calculateClassroomStatuses().filter(c => 
    c.roomNumber.toLowerCase().includes(query) ||
    c.building.toLowerCase().includes(query) ||
    c.type.toLowerCase().includes(query)
  );

  res.json({
    success: true,
    query: q,
    results: {
      faculty: faculty.slice(0, 5),
      notices: notices.slice(0, 5),
      resources: resources.slice(0, 5),
      events: events.slice(0, 5),
      classrooms: classrooms.slice(0, 5)
    }
  });
});

module.exports = router;
