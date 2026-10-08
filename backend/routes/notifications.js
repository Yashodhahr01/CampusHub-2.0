const express = require('express');
const db = require('../database/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET USER NOTIFICATIONS
router.get('/', verifyToken, (req, res) => {
  const notifs = db.get('notifications').filter(n => n.userId === req.user.id);
  const unreadCount = notifs.filter(n => !n.read).length;
  
  const sorted = notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, unreadCount, notifications: sorted });
});

// MARK ALL AS READ OR SINGLE READ
router.put('/read-all', verifyToken, (req, res) => {
  const notifs = db.get('notifications');
  let count = 0;
  notifs.forEach(n => {
    if (n.userId === req.user.id && !n.read) {
      n.read = true;
      count++;
    }
  });
  db.save();
  res.json({ success: true, message: `Marked ${count} notifications as read` });
});

router.put('/:id/read', verifyToken, (req, res) => {
  const updated = db.update('notifications', req.params.id, { read: true });
  res.json({ success: true, notification: updated });
});

module.exports = router;
