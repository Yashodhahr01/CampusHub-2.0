const db = require('../database/db');
const { calculateClassroomStatuses } = require('./timetableEngine');

/**
 * Intelligent Local RAG & Campus AI Assistant Service
 */
async function generateAIResponse(userMessage, sessionId = null) {
  const query = userMessage.toLowerCase().trim();

  // 1. Check if user is asking about classroom vacancy
  if (query.includes('vacant') || query.includes('empty classroom') || query.includes('available room') || query.includes('find a room')) {
    const rooms = calculateClassroomStatuses();
    const vacantRooms = rooms.filter(r => r.status === 'Vacant');

    if (vacantRooms.length === 0) {
      return {
        reply: "Currently, all classrooms in the database are occupied or reserved. Please check back later or view room schedules in the **Classroom Vacancy** section.",
        sources: ['Classroom Vacancy System', 'Live Timetable Engine']
      };
    }

    const roomList = vacantRooms.map(r => 
      `• **${r.roomNumber}** (${r.building}, ${r.floor}) — Capacity: ${r.capacity} | Facilities: ${r.facilities.join(', ')} (Available until ${r.availableUntil})`
    ).join('\n');

    return {
      reply: `Here are the classrooms currently **VACANT** on campus:\n\n${roomList}\n\n*You can request or reserve any of these classrooms from the **Classroom Vacancy** tab.*`,
      sources: ['Live Classroom Timetable DB', 'Campus Sensor Engine']
    };
  }

  // 2. Check if user is asking about faculty / professors / HOD
  if (query.includes('who teaches') || query.includes('faculty') || query.includes('professor') || query.includes('teacher') || query.includes('hod')) {
    const facultyList = db.get('faculty');
    const matchedFaculty = facultyList.filter(f => {
      const nameMatch = f.name.toLowerCase().includes(query);
      const subjectMatch = f.subjects.some(s => query.includes(s.toLowerCase()) || s.toLowerCase().includes(query));
      const deptMatch = query.includes(f.department.toLowerCase());
      return nameMatch || subjectMatch || deptMatch;
    });

    if (matchedFaculty.length > 0) {
      const details = matchedFaculty.map(f => 
        `### 👨‍🏫 ${f.name} (${f.designation})\n` +
        `- **Department:** ${f.department}\n` +
        `- **Subjects Handled:** ${f.subjects.join(', ')}\n` +
        `- **Office Location:** ${f.officeLocation}\n` +
        `- **Office Hours:** ${f.officeHours}\n` +
        `- **Email:** \`${f.email}\``
      ).join('\n\n');

      return {
        reply: `Here is the information from our Faculty Directory:\n\n${details}\n\n*You can also submit academic questions directly to faculty via the **Ask Faculty** page.*`,
        sources: ['Campus Faculty Directory', 'Department Records']
      };
    }
  }

  // 3. Check if user is asking about Hackathon / Events
  if (query.includes('hackathon') || query.includes('event') || query.includes('workshop') || query.includes('fest') || query.includes('contest')) {
    const events = db.get('events');
    const matchedEvents = events.filter(e => 
      e.name.toLowerCase().includes(query) || 
      e.category.toLowerCase().includes(query) || 
      e.description.toLowerCase().includes(query) ||
      query.includes('event') || query.includes('hackathon')
    );

    if (matchedEvents.length > 0) {
      const list = matchedEvents.map(e => 
        `### 🚀 ${e.name} (${e.category})\n` +
        `- **Date & Time:** ${e.date} | ${e.time}\n` +
        `- **Venue:** ${e.venue}\n` +
        `- **Organizer:** ${e.organizer}\n` +
        `- **Overview:** ${e.description}`
      ).join('\n\n');

      return {
        reply: `Here are the upcoming campus events:\n\n${list}\n\n*You can register for any event under the **Events & Clubs** section.*`,
        sources: ['Campus Events Calendar', 'Club Association DB']
      };
    }
  }

  // 4. Check if user is asking about resources / previous year papers / notes
  if (query.includes('previous year') || query.includes('pyq') || query.includes('notes') || query.includes('paper') || query.includes('manual') || query.includes('syllabus')) {
    const resources = db.get('resources');
    const matchedResources = resources.filter(r => 
      r.title.toLowerCase().includes(query) || 
      r.subject.toLowerCase().includes(query) || 
      r.category.toLowerCase().includes(query) ||
      query.includes('paper') || query.includes('notes')
    );

    if (matchedResources.length > 0) {
      const list = matchedResources.slice(0, 5).map(r => 
        `• **${r.title}** (${r.category} | ${r.subject}) — Uploaded by ${r.uploadedByName} (${r.fileSize})`
      ).join('\n');

      return {
        reply: `Found the following academic resources matching your search:\n\n${list}\n\n*Head over to **Resource Hub** to download the original PDF files.*`,
        sources: ['Academic Resource Library', 'Department Repository']
      };
    }
  }

  // 5. Search Knowledge Base using Vector / Keyword score algorithm (Local RAG)
  const kbEntries = db.get('knowledge_base');
  const scoredEntries = kbEntries.map(entry => {
    let score = 0;
    const titleTokens = entry.title.toLowerCase().split(/\s+/);
    const contentTokens = entry.content.toLowerCase().split(/\s+/);
    const tagTokens = (entry.tags || []).map(t => t.toLowerCase());

    const queryWords = query.split(/\s+/).filter(w => w.length > 2);

    queryWords.forEach(word => {
      if (titleTokens.some(t => t.includes(word))) score += 4;
      if (tagTokens.some(t => t.includes(word))) score += 3;
      if (contentTokens.some(c => c.includes(word))) score += 1;
    });

    return { entry, score };
  }).sort((a, b) => b.score - a.score);

  if (scoredEntries.length > 0 && scoredEntries[0].score >= 2) {
    const top = scoredEntries[0].entry;
    return {
      reply: `### ${top.title}\n\n${top.content}\n\n*Category: ${top.category}*`,
      sources: [`Knowledge Base [${top.category}]`, 'Campus AI RAG Store']
    };
  }

  // 6. Strict Fallback as required by prompt Section 7
  return {
    reply: "I couldn't find that information in the CampusHub knowledge base. Please contact the relevant department or administrator.",
    sources: ['CampusHub AI Knowledge Base']
  };
}

module.exports = {
  generateAIResponse
};
