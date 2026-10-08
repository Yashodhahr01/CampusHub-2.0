const express = require('express');
const db = require('../database/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET EVENTS
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let events = db.get('events');

  if (category && category !== 'All') {
    events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    events = events.filter(e => 
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: events.length, events });
});

// REGISTER FOR EVENT
router.post('/:id/register', verifyToken, (req, res) => {
  try {
    const event = db.findById('events', req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const registered = event.registeredUserIds || [];
    if (registered.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event!' });
    }

    registered.push(req.user.id);
    const updated = db.update('events', req.params.id, { registeredUserIds: registered });

    // Send notification
    db.insert('notifications', {
      userId: req.user.id,
      title: 'Event Registration Confirmed!',
      message: `You are registered for "${event.name}" on ${event.date} at ${event.venue}.`,
      type: 'EVENT_REMINDER',
      read: false,
      link: '/student/events'
    });

    res.json({ success: true, message: `Successfully registered for ${event.name}!`, event: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: CREATE EVENT
router.post('/', verifyToken, isAdmin, (req, res) => {
  try {
    const { name, description, category, date, time, venue, organizer, registrationUrl, posterUrl, capacity } = req.body;
    if (!name || !date || !venue) {
      return res.status(400).json({ success: false, message: 'Event name, date, and venue are required' });
    }

    const newEvent = db.insert('events', {
      name,
      description: description || 'Exciting upcoming event on campus.',
      category: category || 'Technical',
      date,
      time: time || '10:00 AM',
      venue,
      organizer: organizer || 'Campus Hub Committee',
      registrationUrl: registrationUrl || '#',
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      registeredUserIds: [],
      capacity: Number(capacity) || 100
    });

    res.status(201).json({ success: true, message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ADMIN: UPDATE / DELETE
router.put('/:id', verifyToken, isAdmin, (req, res) => {
  const updated = db.update('events', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });
  res.json({ success: true, message: 'Event updated', event: updated });
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  const deleted = db.delete('events', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
  res.json({ success: true, message: 'Event deleted' });
});

module.exports = router;
