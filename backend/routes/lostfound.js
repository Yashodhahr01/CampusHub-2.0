const express = require('express');
const db = require('../database/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET LOST & FOUND POSTS (WITH TYPE, CATEGORY, SEARCH)
router.get('/', (req, res) => {
  const { itemType, category, search } = req.query;
  let items = db.get('lost_found');

  if (itemType && itemType !== 'All') {
    items = items.filter(i => i.itemType.toUpperCase() === itemType.toUpperCase());
  }

  if (category && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => 
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q)
    );
  }

  items = items.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({ success: true, count: items.length, items });
});

// CREATE LOST / FOUND ITEM POST
router.post('/', verifyToken, (req, res) => {
  try {
    const { itemType, title, description, category, location, date, contactMethod, imageUrl } = req.body;
    if (!itemType || !title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Type, title, description, and location are required' });
    }

    const newItem = db.insert('lost_found', {
      userId: req.user.id,
      userName: req.user.name,
      userContact: contactMethod || req.user.email,
      itemType: itemType.toUpperCase(),
      title,
      description,
      category: category || 'Personal Belongings',
      location,
      date: date || new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      status: 'Open',
      potentialMatches: []
    });

    // Check potential matching opposite posts (Image/Text similarity logic)
    const oppositeType = itemType.toUpperCase() === 'LOST' ? 'FOUND' : 'LOST';
    const oppositeItems = db.get('lost_found').filter(i => i.itemType === oppositeType);

    const matches = oppositeItems.filter(op => {
      const catMatch = op.category.toLowerCase() === newItem.category.toLowerCase();
      const titleMatch = op.title.toLowerCase().split(' ').some(w => w.length > 3 && newItem.title.toLowerCase().includes(w));
      return catMatch && titleMatch;
    }).map(m => m.id);

    if (matches.length > 0) {
      db.update('lost_found', newItem.id, { potentialMatches: matches });
    }

    res.status(201).json({ success: true, message: `${itemType.toUpperCase()} item post created successfully!`, item: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// MARK RESOLVED / CLAIMED
router.put('/:id/resolve', verifyToken, (req, res) => {
  const updated = db.update('lost_found', req.params.id, { status: 'Resolved' });
  if (!updated) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, message: 'Item marked as resolved', item: updated });
});

module.exports = router;
