const express = require('express');
const db = require('../database/db');
const { verifyToken } = require('../middleware/auth');
const { generateAIResponse } = require('../services/aiService');

const router = express.Router();

// GET CHAT SESSIONS FOR LOGGED IN USER
router.get('/sessions', verifyToken, (req, res) => {
  const sessions = db.get('chat_sessions').filter(s => s.userId === req.user.id);
  res.json({ success: true, sessions });
});

// GET MESSAGES IN A SESSION
router.get('/sessions/:id/messages', verifyToken, (req, res) => {
  const messages = db.get('chat_messages').filter(m => m.sessionId === req.params.id);
  res.json({ success: true, messages });
});

// SEND MESSAGE TO CAMPUSHUB AI
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const newSession = db.insert('chat_sessions', {
        userId: req.user.id,
        title: message.length > 30 ? message.substring(0, 30) + '...' : message
      });
      activeSessionId = newSession.id;
    }

    // Save user message
    const userMsg = db.insert('chat_messages', {
      sessionId: activeSessionId,
      role: 'user',
      content: message,
      sources: []
    });

    // Generate AI response via aiService
    const aiResult = await generateAIResponse(message, activeSessionId);

    // Save assistant message
    const assistantMsg = db.insert('chat_messages', {
      sessionId: activeSessionId,
      role: 'assistant',
      content: aiResult.reply,
      sources: aiResult.sources || []
    });

    res.json({
      success: true,
      sessionId: activeSessionId,
      userMessage: userMsg,
      reply: assistantMsg
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI processing error: ' + err.message });
  }
});

// DELETE CHAT SESSION
router.delete('/sessions/:id', verifyToken, (req, res) => {
  db.delete('chat_sessions', req.params.id);
  const messages = db.get('chat_messages').filter(m => m.sessionId !== req.params.id);
  db.set('chat_messages', messages);
  res.json({ success: true, message: 'Chat session deleted' });
});

module.exports = router;
