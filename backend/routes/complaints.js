const express = require('express');
const db = require('../database/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET COMPLAINTS (Student gets own complaints, Admin gets all)
router.get('/', verifyToken, (req, res) => {
  let complaints = db.get('complaints');

  if (req.user.role === 'student') {
    complaints = complaints.filter(c => c.userId === req.user.id || c.userName === req.user.name);
  }

  const { category, priority, status } = req.query;

  if (category && category !== 'All') {
    complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  if (priority && priority !== 'All') {
    complaints = complaints.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  }

  if (status && status !== 'All') {
    complaints = complaints.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }

  complaints = complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, count: complaints.length, complaints });
});

// SUBMIT NEW COMPLAINT
router.post('/', verifyToken, (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Title, description, and location are required' });
    }

    const student = db.findOne('students', s => s.userId === req.user.id) || { usn: '1DS21CS108' };

    const newComplaint = db.insert('complaints', {
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      userUsn: student.usn || 'N/A',
      title,
      description,
      category: category || 'Classroom issue',
      location,
      priority: priority || 'Medium',
      status: 'Submitted',
      assignedTo: 'Unassigned',
      updatesHistory: [
        { status: 'Submitted', timestamp: new Date().toISOString(), note: 'Complaint ticket created by user.' }
      ]
    });

    res.status(201).json({ success: true, message: 'Complaint registered successfully!', complaint: newComplaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE COMPLAINT STATUS WORKFLOW (ADMIN)
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { status, assignedTo, note } = req.body;
    const complaint = db.findById('complaints', req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint ticket not found' });

    const validStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status workflow step' });
    }

    const history = complaint.updatesHistory || [];
    const newStatus = status || complaint.status;

    history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus} by admin.`
    });

    const updated = db.update('complaints', req.params.id, {
      status: newStatus,
      assignedTo: assignedTo || complaint.assignedTo,
      updatesHistory: history
    });

    // Notify student user
    db.insert('notifications', {
      userId: complaint.userId,
      title: `Complaint Status Updated: ${newStatus}`,
      message: `Your ticket "${complaint.title}" is now ${newStatus}.`,
      type: 'COMPLAINT_UPDATE',
      read: false,
      link: '/student/complaints'
    });

    res.json({ success: true, message: 'Complaint updated successfully', complaint: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
