const express = require('express');
const db = require('../database/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET NOTICES (FILTER BY CATEGORY, PRIORITY, SEARCH)
router.get('/', (req, res) => {
  const { category, priority, search } = req.query;
  let notices = db.get('notices');

  if (category && category !== 'All') {
    notices = notices.filter(n => n.category.toLowerCase() === category.toLowerCase());
  }

  if (priority && priority !== 'All') {
    notices = notices.filter(n => n.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    notices = notices.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q) ||
      n.postedBy.toLowerCase().includes(q)
    );
  }

  // Sort by date descending
  notices = notices.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({ success: true, count: notices.length, notices });
});

// CREATE NOTICE (ADMIN OR FACULTY)
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, content, category, priority, attachmentUrl } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: 'Title, content, and category are required' });
    }

    const newNotice = db.insert('notices', {
      title,
      content,
      category,
      priority: priority || 'Normal',
      date: new Date().toISOString().split('T')[0],
      postedBy: req.user.name + ` (${req.user.role.toUpperCase()})`,
      attachmentUrl: attachmentUrl || null
    });

    res.status(201).json({ success: true, message: 'Notice published successfully', notice: newNotice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE NOTICE
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const updated = db.update('notices', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice updated successfully', notice: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE NOTICE
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const deleted = db.delete('notices', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
