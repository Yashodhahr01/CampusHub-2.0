const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, usn, semester, section, skills, interests, employeeId, subjects, officeLocation, officeHours } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now();

    const user = db.insert('users', {
      id: userId,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatar: `https://i.pravatar.cc/150?u=${userId}`
    });

    if (role === 'student') {
      db.insert('students', {
        userId,
        name,
        email: email.toLowerCase(),
        usn: usn || `1DS21CS${Math.floor(100 + Math.random() * 800)}`,
        department: department || 'Computer Science & Engineering',
        semester: Number(semester) || 6,
        section: section || 'A',
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['React', 'Python']),
        interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map(i => i.trim()) : ['Web Development', 'AI/ML']),
        gpa: 8.5
      });
    } else if (role === 'faculty') {
      db.insert('faculty', {
        userId,
        name,
        email: email.toLowerCase(),
        employeeId: employeeId || `EMP_FAC_${Math.floor(100 + Math.random() * 800)}`,
        department: department || 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        subjects: Array.isArray(subjects) ? subjects : (subjects ? subjects.split(',').map(s => s.trim()) : ['Computer Science']),
        officeLocation: officeLocation || 'Tech Tower, Room 201',
        officeHours: officeHours || 'Mon-Fri: 2:00 PM - 4:00 PM'
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const userSafe = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    res.status(201).json({ success: true, message: 'Registration successful', token, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    let profileDetails = {};
    if (user.role === 'student') {
      profileDetails = db.findOne('students', s => s.userId === user.id) || {};
    } else if (user.role === 'faculty') {
      profileDetails = db.findOne('faculty', f => f.userId === user.id) || {};
    }

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profile: profileDetails
    };

    res.json({ success: true, message: 'Login successful', token, user: userSafe });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed: ' + err.message });
  }
});

// GET CURRENT LOGGED IN USER (ME)
router.get('/me', verifyToken, (req, res) => {
  let profileDetails = {};
  if (req.user.role === 'student') {
    profileDetails = db.findOne('students', s => s.userId === req.user.id) || {};
  } else if (req.user.role === 'faculty') {
    profileDetails = db.findOne('faculty', f => f.userId === req.user.id) || {};
  }

  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      profile: profileDetails
    }
  });
});

module.exports = router;
