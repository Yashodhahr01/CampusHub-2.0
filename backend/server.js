const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const classroomRoutes = require('./routes/classrooms');
const facultyRoutes = require('./routes/faculty');
const questionRoutes = require('./routes/questions');
const noticeRoutes = require('./routes/notices');
const resourceRoutes = require('./routes/resources');
const eventRoutes = require('./routes/events');
const teamRoutes = require('./routes/team');
const lostfoundRoutes = require('./routes/lostfound');
const complaintRoutes = require('./routes/complaints');
const aiRoutes = require('./routes/ai');
const knowledgeRoutes = require('./routes/knowledge');
const notificationRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static build files
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Root status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CampusHub 2.0 Backend Server',
    tagline: 'One Campus. Everything You Need.',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/lostfound', lostfoundRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// SPA fallback for frontend routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Backend Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 CampusHub 2.0 Backend Server Running on Port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
