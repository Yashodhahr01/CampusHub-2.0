# CampusHub 2.0 — Smart College Ecosystem 🎓🤖

> **"One Campus. Everything You Need."**
> A production-grade, full-stack smart college ecosystem designed for engineering students, faculty, and administrators.

---

## 🌟 Executive Overview & Highlights

CampusHub 2.0 transforms traditional college administration into a sleek, SaaS-driven digital workspace. It unifies:
1. **CampusHub AI (RAG Assistant)**: Answers college inquiries with grounded citations and local knowledge base fallback.
2. **Classroom Vacancy Radar**: Live dynamic room status (🟢 Vacant, 🔴 Occupied, 🟡 Reserved) based on timetable schedules and reservations.
3. **Faculty Directory & Q&A**: Direct academic consultation channel between students and professors.
4. **Smart Team Finder**: Algorithmic match scoring (e.g. `Match Score: 87%`) matching project leads with skilled teammates.
5. **Academic Resource Hub**: Notes, previous year question papers (PYQs), syllabus, and lab manuals repository.
6. **Campus Help Desk & Complaints**: 5-stage progress workflow (`Submitted` -> `Under Review` -> `Assigned` -> `In Progress` -> `Resolved`).
7. **Lost & Found System**: Keyword & category item matching engine.
8. **Events & Club Management**: 1-click registration for hackathons, workshops, and fests.
9. **Role-Based Workspaces**: Tailored dashboards for **Students**, **Faculty**, and **Admins**.

---

## 🔑 Demo Login Credentials

The system includes pre-seeded demo accounts with 1-click quick switcher buttons in the navbar:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `student@campushub.demo` | `Student@123` | Dashboard, AI Chatbot, Room Reservations, Team Finder, Ask Faculty, Resources, Complaints |
| **👨‍🏫 Faculty** | `faculty@campushub.demo` | `Faculty@123` | Faculty Dashboard, Answer Student Queries, Upload Materials, Office Hours Profile |
| **👑 Admin** | `admin@campushub.demo` | `Admin@123` | Full Analytics, User Management, AI Knowledge Base, Classrooms, Notices, Complaints Workflow |

---

## 🏗️ System Architecture

```
CampusHub 2.0 /
├── backend/
│   ├── database/
│   │   ├── db.js           # Atomic JSON database manager with indexing & transaction safety
│   │   └── seed.js         # Massive seed data generator (20 students, 10 faculty, 15 classrooms, timetables)
│   ├── middleware/
│   │   └── auth.js         # JWT verification & RBAC authorization
│   ├── services/
│   │   ├── aiService.js    # RAG knowledge search engine with source citations
│   │   └── timetableEngine.js # Live classroom vacancy status calculation engine
│   ├── routes/             # REST API endpoints (Auth, Classrooms, Faculty, Questions, Notices, etc.)
│   └── server.js           # Express API server on Port 5000
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components (Navbar, Sidebar, StatCard, ClassroomCard, etc.)
    │   ├── context/        # AuthContext (JWT & Demo switcher) & ToastContext
    │   ├── pages/          # 35 Complete Pages across Public, Student, Faculty, and Admin modules
    │   ├── services/       # Fetch API client wrapper
    │   └── index.css       # Clean SaaS Design System (Inter / Plus Jakarta Sans)
    ├── index.html
    └── vite.config.js
```

---

## 🛠️ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populate database with rich realistic demo dataset
npm start        # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Vite React dev server on http://localhost:5173
```

---

## 📡 Key API Endpoint Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create new student/faculty account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/auth/me` — Fetch active logged in user profile

### Classroom Vacancy (`/api/classrooms`)
- `GET /api/classrooms` — Get all classrooms with dynamic live statuses
- `GET /api/classrooms/available` — Filter classrooms available now
- `POST /api/classrooms/reserve` — Reserve a vacant room

### CampusHub AI (`/api/ai`)
- `POST /api/ai/chat` — Submit query to AI assistant, returns answer + grounded sources
- `GET /api/ai/sessions` — Fetch user conversation history

### Admin Analytics (`/api/admin`)
- `GET /api/admin/analytics` — Platform analytics stats & chart data
- `POST /api/admin/reset-demo-data` — Reset database to clean demo state

---

## 🔮 Future Enhancement Suggestions

1. **IoT Sensor Integration**: Connect ESP32/Raspberry Pi motion sensors for real-time classroom occupancy detection.
2. **Vector Database**: Upgrade local RAG search to Pinecone or ChromaDB for large-scale document embeddings.
3. **Push Notifications**: Integrate WebPush API / Firebase Cloud Messaging for instant mobile push notifications.
4. **Attendance System**: Add QR code scan-in for automated lecture attendance tracking.
