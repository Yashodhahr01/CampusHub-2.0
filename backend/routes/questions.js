const express = require('express');
const db = require('../database/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET QUESTIONS (Filter for student or faculty)
router.get('/', verifyToken, (req, res) => {
  let questions = db.get('questions');

  if (req.user.role === 'student') {
    const student = db.findOne('students', s => s.userId === req.user.id);
    if (student) {
      questions = questions.filter(q => q.studentId === student.id || q.studentName === req.user.name);
    }
  } else if (req.user.role === 'faculty') {
    const faculty = db.findOne('faculty', f => f.userId === req.user.id);
    if (faculty) {
      questions = questions.filter(q => q.facultyId === faculty.id || q.facultyName === req.user.name);
    }
  }

  const { status } = req.query;
  if (status && status !== 'All') {
    questions = questions.filter(q => q.status.toLowerCase() === status.toLowerCase());
  }

  res.json({ success: true, count: questions.length, questions });
});

// SUBMIT ACADEMIC QUESTION TO FACULTY (STUDENT)
router.post('/', verifyToken, (req, res) => {
  try {
    const { facultyId, subject, title, question, attachmentUrl } = req.body;
    if (!facultyId || !subject || !title || !question) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields' });
    }

    const faculty = db.findById('faculty', facultyId);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    const student = db.findOne('students', s => s.userId === req.user.id) || { id: 'std_temp', usn: '1DS21CS000' };

    const newQuestion = db.insert('questions', {
      studentId: student.id,
      studentName: req.user.name,
      studentUsn: student.usn,
      facultyId: faculty.id,
      facultyName: faculty.name,
      subject,
      title,
      question,
      status: 'Pending',
      answer: null,
      answeredAt: null,
      attachmentUrl: attachmentUrl || null
    });

    // Notify faculty user
    if (faculty.userId) {
      db.insert('notifications', {
        userId: faculty.userId,
        title: 'New Student Question Received',
        message: `${req.user.name} asked: "${title}"`,
        type: 'FACULTY_REPLY',
        read: false,
        link: '/faculty/questions'
      });
    }

    res.status(201).json({ success: true, message: 'Question submitted successfully to ' + faculty.name, question: newQuestion });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit question: ' + err.message });
  }
});

// FACULTY REPLY TO QUESTION
router.put('/:id/reply', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ success: false, message: 'Answer content is required' });
    }

    const q = db.findById('questions', id);
    if (!q) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const updated = db.update('questions', id, {
      answer,
      status: 'Answered',
      answeredAt: new Date().toISOString()
    });

    // Notify student user
    const studentObj = db.findById('students', q.studentId);
    if (studentObj && studentObj.userId) {
      db.insert('notifications', {
        userId: studentObj.userId,
        title: 'Faculty Answered Your Question',
        message: `${updated.facultyName} answered: "${q.title}"`,
        type: 'FACULTY_REPLY',
        read: false,
        link: '/student/ask-faculty'
      });
    }

    res.json({ success: true, message: 'Question answered successfully', question: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
