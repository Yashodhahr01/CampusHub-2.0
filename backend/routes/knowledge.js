const express = require('express');
const db = require('../database/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET KNOWLEDGE BASE ENTRIES
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let kb = db.get('knowledge_base');

  if (category && category !== 'All') {
    kb = kb.filter(k => k.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    kb = kb.filter(k => 
      k.title.toLowerCase().includes(q) ||
      k.content.toLowerCase().includes(q) ||
      (k.tags && k.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  res.json({ success: true, count: kb.length, knowledgeBase: kb });
});

// ADMIN: CREATE KNOWLEDGE ITEM
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const { category, title, content, tags } = req.body;
    if (!category || !title || !content) {
      return res.status(400).json({ success: false, message: 'Category, title, and content are required' });
    }

    const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

    const newItem = db.insert('knowledge_base', {
      category,
      title,
      content,
      tags: parsedTags,
      updatedBy: req.user.name,
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, message: 'Knowledge base entry added!', item: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: UPDATE KNOWLEDGE ITEM
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : undefined;

    const updated = db.update('knowledge_base', req.params.id, {
      ...rest,
      ...(parsedTags && { tags: parsedTags }),
      updatedBy: req.user.name,
      updatedAt: new Date().toISOString()
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Knowledge entry not found' });
    res.json({ success: true, message: 'Knowledge base entry updated', item: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: DELETE KNOWLEDGE ITEM
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  const deleted = db.delete('knowledge_base', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, message: 'Item deleted from Knowledge Base' });
});

module.exports = router;
