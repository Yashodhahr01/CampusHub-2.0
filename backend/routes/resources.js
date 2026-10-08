const express = require('express');
const db = require('../database/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET ALL RESOURCES (WITH CATEGORY, SEMESTER, DEPARTMENT & SEARCH FILTERS)
router.get('/', (req, res) => {
  const { category, semester, department, subject, search } = req.query;
  let resources = db.get('resources');

  if (category && category !== 'All') {
    resources = resources.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }

  if (semester && semester !== 'All') {
    resources = resources.filter(r => Number(r.semester) === Number(semester));
  }

  if (department && department !== 'All') {
    resources = resources.filter(r => r.department.toLowerCase() === department.toLowerCase());
  }

  if (subject && subject !== 'All') {
    resources = resources.filter(r => r.subject.toLowerCase() === subject.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    resources = resources.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.uploadedByName.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: resources.length, resources });
});

// UPLOAD RESOURCE (FACULTY / ADMIN / STUDENT)
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, description, subject, semester, department, category, fileUrl, fileType, fileSize } = req.body;
    if (!title || !subject || !category) {
      return res.status(400).json({ success: false, message: 'Title, subject, and category are required' });
    }

    const newResource = db.insert('resources', {
      title,
      description: description || 'Academic resource uploaded for course study.',
      subject,
      semester: Number(semester) || 6,
      department: department || 'Computer Science & Engineering',
      category,
      fileUrl: fileUrl || '/uploads/Sample_Academic_Resource.pdf',
      fileType: fileType || 'PDF',
      fileSize: fileSize || '3.5 MB',
      uploadedBy: req.user.id,
      uploadedByName: req.user.name,
      downloadsCount: 0,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, message: 'Resource uploaded successfully', resource: newResource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// INCREMENT DOWNLOAD COUNTER
router.post('/:id/download', (req, res) => {
  const r = db.findById('resources', req.params.id);
  if (!r) return res.status(404).json({ success: false, message: 'Resource not found' });
  
  const updated = db.update('resources', req.params.id, {
    downloadsCount: (r.downloadsCount || 0) + 1
  });

  res.json({ success: true, downloadsCount: updated.downloadsCount });
});

// DELETE RESOURCE
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const deleted = db.delete('resources', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
