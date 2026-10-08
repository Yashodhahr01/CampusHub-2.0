const express = require('express');
const db = require('../database/db');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { calculateClassroomStatuses } = require('../services/timetableEngine');

const router = express.Router();

// GET ALL CLASSROOMS WITH LIVE STATUSES
router.get('/', (req, res) => {
  const { building, floor, capacity, type, status, time, day } = req.query;

  let rooms = calculateClassroomStatuses(time, day);

  if (building && building !== 'All') {
    rooms = rooms.filter(r => r.building.toLowerCase() === building.toLowerCase());
  }
  if (floor && floor !== 'All') {
    rooms = rooms.filter(r => r.floor.toLowerCase() === floor.toLowerCase());
  }
  if (type && type !== 'All') {
    rooms = rooms.filter(r => r.type.toLowerCase() === type.toLowerCase());
  }
  if (status && status !== 'All') {
    rooms = rooms.filter(r => r.status.toLowerCase() === status.toLowerCase());
  }
  if (capacity) {
    rooms = rooms.filter(r => r.capacity >= Number(capacity));
  }

  res.json({ success: true, count: rooms.length, classrooms: rooms });
});

// GET AVAILABLE NOW CLASSROOMS
router.get('/available', (req, res) => {
  const rooms = calculateClassroomStatuses();
  const available = rooms.filter(r => r.status === 'Vacant');
  res.json({ success: true, count: available.length, classrooms: available });
});

// RESERVE A CLASSROOM (STUDENT / FACULTY)
router.post('/reserve', verifyToken, (req, res) => {
  try {
    const { classroomId, purpose, date, startTime, endTime } = req.body;
    if (!classroomId || !purpose || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Please provide all reservation details' });
    }

    const room = db.findById('classrooms', classroomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }

    const reservation = db.insert('reservations', {
      classroomId,
      roomNumber: room.roomNumber,
      building: room.building,
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      purpose,
      date,
      startTime,
      endTime,
      status: 'Approved'
    });

    // Create notification for admin / user
    db.insert('notifications', {
      userId: req.user.id,
      title: 'Classroom Reserved Successfully',
      message: `Reservation confirmed for ${room.roomNumber} on ${date} (${startTime} - ${endTime}).`,
      type: 'RESERVATION_UPDATE',
      read: false,
      link: '/student/classroom-vacancy'
    });

    res.status(201).json({ success: true, message: 'Classroom reserved successfully', reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Reservation failed: ' + err.message });
  }
});

// ADMIN: CREATE CLASSROOM
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const { roomNumber, building, floor, capacity, type, facilities } = req.body;
    if (!roomNumber || !building || !capacity) {
      return res.status(400).json({ success: false, message: 'Room number, building, and capacity are required' });
    }

    const newRoom = db.insert('classrooms', {
      roomNumber,
      building,
      floor: floor || '1st Floor',
      capacity: Number(capacity),
      type: type || 'Classroom',
      facilities: Array.isArray(facilities) ? facilities : (facilities ? facilities.split(',').map(f => f.trim()) : ['Projector', 'Wi-Fi']),
      status: 'Vacant',
      availableFrom: '9:00 AM',
      availableUntil: '5:00 PM'
    });

    res.status(201).json({ success: true, message: 'Classroom created successfully', classroom: newRoom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: UPDATE CLASSROOM
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.update('classrooms', id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }
    res.json({ success: true, message: 'Classroom updated successfully', classroom: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: DELETE CLASSROOM
router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.delete('classrooms', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Classroom not found' });
    }
    res.json({ success: true, message: 'Classroom deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
