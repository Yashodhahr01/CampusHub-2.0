const db = require('../database/db');

function calculateClassroomStatuses(queryTimeStr = null, queryDayStr = null) {
  const classrooms = db.get('classrooms');
  const timetables = db.get('timetables');
  const reservations = db.get('reservations');

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const currentDay = queryDayStr || days[now.getDay()];
  
  // Format HH:MM
  let currentTime = queryTimeStr;
  if (!currentTime) {
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    currentTime = `${hours}:${mins}`;
  }

  const updatedClassrooms = classrooms.map(room => {
    // Check if room has an ongoing class in timetable for current day & time
    const ongoingClass = timetables.find(t => {
      if (t.classroomId !== room.id) return false;
      if (t.dayOfWeek.toLowerCase() !== currentDay.toLowerCase()) return false;
      return currentTime >= t.startTime && currentTime <= t.endTime;
    });

    // Check if room has an approved reservation for today & current time
    const todayStr = now.toISOString().split('T')[0];
    const ongoingReservation = reservations.find(r => {
      if (r.classroomId !== room.id) return false;
      if (r.status !== 'Approved') return false;
      if (r.date && r.date !== todayStr) return false;
      return currentTime >= r.startTime && currentTime <= r.endTime;
    });

    let status = 'Vacant';
    let currentClass = null;
    let availableFrom = room.availableFrom || '09:00 AM';
    let availableUntil = room.availableUntil || '05:00 PM';

    if (ongoingClass) {
      status = 'Occupied';
      currentClass = `${ongoingClass.subject} (${ongoingClass.section})`;
      availableFrom = ongoingClass.endTime;
    } else if (ongoingReservation) {
      status = 'Reserved';
      currentClass = `Reserved: ${ongoingReservation.purpose}`;
      availableFrom = ongoingReservation.endTime;
    }

    return {
      ...room,
      status,
      currentClass,
      availableFrom,
      availableUntil
    };
  });

  return updatedClassrooms;
}

module.exports = {
  calculateClassroomStatuses
};
