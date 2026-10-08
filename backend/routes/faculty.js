const express = require('express');
const db = require('../database/db');

const router = express.Router();

// GET FACULTY DIRECTORY (WITH SEARCH & DEPARTMENT FILTER)
router.get('/', (req, res) => {
  const { search, department, subject } = req.query;

  let facultyList = db.get('faculty');

  if (department && department !== 'All') {
    facultyList = facultyList.filter(f => f.department.toLowerCase() === department.toLowerCase());
  }

  if (subject && subject !== 'All') {
    facultyList = facultyList.filter(f => f.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase())));
  }

  if (search) {
    const q = search.toLowerCase();
    facultyList = facultyList.filter(f => 
      f.name.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q) ||
      f.subjects.some(s => s.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: facultyList.length, faculty: facultyList });
});

// GET SINGLE FACULTY DETAILS
router.get('/:id', (req, res) => {
  const f = db.findById('faculty', req.params.id);
  if (!f) {
    return res.status(404).json({ success: false, message: 'Faculty member not found' });
  }
  res.json({ success: true, faculty: f });
});

module.exports = router;
