const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { calculateClassroomStatuses } = require('../services/timetableEngine');
const seedDatabase = require('../database/seed');

const router = express.Router();

// GET SYSTEM ANALYTICS & DASHBOARD METRICS
router.get('/analytics', verifyToken, isAdmin, (req, res) => {
  const students = db.get('students');
  const faculty = db.get('faculty');
  const users = db.get('users');
  const rooms = calculateClassroomStatuses();
  const vacantRooms = rooms.filter(r => r.status === 'Vacant');
  const complaints = db.get('complaints');
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved');
  const events = db.get('events');
  const questions = db.get('questions');
  const pendingQuestions = questions.filter(q => q.status === 'Pending');

  // Chart data: Student activity / registrations per department
  const deptDistribution = {};
  students.forEach(s => {
    const dept = s.department || 'Other';
    deptDistribution[dept] = (deptDistribution[dept] || 0) + 1;
  });

  // Chart data: Classroom utilization
  const roomUtilization = {
    Vacant: vacantRooms.length,
    Occupied: rooms.filter(r => r.status === 'Occupied').length,
    Reserved: rooms.filter(r => r.status === 'Reserved').length
  };

  // Chart data: Complaint categories
  const complaintCategories = {};
  complaints.forEach(c => {
    complaintCategories[c.category] = (complaintCategories[c.category] || 0) + 1;
  });

  res.json({
    success: true,
    stats: {
      totalStudents: students.length,
      totalFaculty: faculty.length,
      activeUsers: users.length,
      availableClassrooms: vacantRooms.length,
      totalClassrooms: rooms.length,
      pendingComplaints: pendingComplaints.length,
      upcomingEvents: events.length,
      unansweredFacultyQuestions: pendingQuestions.length
    },
    charts: {
      deptDistribution,
      roomUtilization,
      complaintCategories
    }
  });
});

// GET / MANAGE ALL STUDENTS
router.get('/students', verifyToken, isAdmin, (req, res) => {
  const students = db.get('students');
  res.json({ success: true, count: students.length, students });
});

router.post('/students', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, usn, department, semester, section } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });

    const passwordHash = await bcrypt.hash(password || 'Student@123', 10);
    const userId = 'usr_std_' + Date.now();

    db.insert('users', {
      id: userId,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'student',
      avatar: `https://i.pravatar.cc/150?u=${userId}`
    });

    const newStudent = db.insert('students', {
      userId,
      name,
      email: email.toLowerCase(),
      usn: usn || `1DS21CS${Math.floor(100 + Math.random() * 800)}`,
      department: department || 'Computer Science & Engineering',
      semester: Number(semester) || 6,
      section: section || 'A',
      skills: ['React', 'Python'],
      interests: ['AI/ML', 'Web Dev'],
      gpa: 8.5
    });

    res.status(201).json({ success: true, message: 'Student created successfully', student: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/students/:id', verifyToken, isAdmin, (req, res) => {
  const std = db.findById('students', req.params.id);
  if (std && std.userId) {
    db.delete('users', std.userId);
  }
  db.delete('students', req.params.id);
  res.json({ success: true, message: 'Student deleted successfully' });
});

// GET / MANAGE ALL FACULTY
router.get('/faculty', verifyToken, isAdmin, (req, res) => {
  const faculty = db.get('faculty');
  res.json({ success: true, count: faculty.length, faculty });
});

router.post('/faculty', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, employeeId, department, designation, subjects, officeLocation } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email required' });

    const passwordHash = await bcrypt.hash(password || 'Faculty@123', 10);
    const userId = 'usr_fac_' + Date.now();

    db.insert('users', {
      id: userId,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'faculty',
      avatar: `https://i.pravatar.cc/150?u=${userId}`
    });

    const newFac = db.insert('faculty', {
      userId,
      name,
      email: email.toLowerCase(),
      employeeId: employeeId || `EMP_${Date.now()}`,
      department: department || 'Computer Science & Engineering',
      designation: designation || 'Assistant Professor',
      subjects: Array.isArray(subjects) ? subjects : (subjects ? subjects.split(',').map(s => s.trim()) : ['Computer Science']),
      officeLocation: officeLocation || 'Tech Tower TT-201',
      officeHours: 'Mon-Fri 2:00 PM - 4:00 PM'
    });

    res.status(201).json({ success: true, message: 'Faculty created successfully', faculty: newFac });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/faculty/:id', verifyToken, isAdmin, (req, res) => {
  const fac = db.findById('faculty', req.params.id);
  if (fac && fac.userId) {
    db.delete('users', fac.userId);
  }
  db.delete('faculty', req.params.id);
  res.json({ success: true, message: 'Faculty deleted successfully' });
});

// RESET DATABASE BACK TO SEED DATA (UTILITY FOR DEMO)
router.post('/reset-demo-data', verifyToken, isAdmin, async (req, res) => {
  await seedDatabase();
  res.json({ success: true, message: 'Database reset to initial demo state!' });
});

module.exports = router;
