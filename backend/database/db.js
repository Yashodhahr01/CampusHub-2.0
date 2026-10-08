const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      users: [],
      students: [],
      faculty: [],
      departments: [],
      classrooms: [],
      timetables: [],
      reservations: [],
      notices: [],
      resources: [],
      events: [],
      questions: [],
      complaints: [],
      lost_found: [],
      projects: [],
      team_requests: [],
      notifications: [],
      knowledge_base: [],
      chat_sessions: [],
      chat_messages: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      } catch (err) {
        console.error('Error reading db.json, creating new database file:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  find(collection, predicateFn) {
    const items = this.get(collection);
    if (!predicateFn) return items;
    return items.filter(predicateFn);
  }

  findOne(collection, predicateFn) {
    const items = this.get(collection);
    return items.find(predicateFn) || null;
  }

  findById(collection, id) {
    return this.findOne(collection, item => String(item.id) === String(id));
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      id: item.id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    this.data[collection].push(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;

    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[collection][index];
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const index = this.data[collection].findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;
    this.data[collection].splice(index, 1);
    this.save();
    return true;
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
  }

  resetAll(newData) {
    this.data = newData;
    this.save();
  }
}

const db = new Database();
module.exports = db;
