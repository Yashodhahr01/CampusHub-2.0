const bcrypt = require('bcryptjs');
const db = require('./db');

async function seedDatabase() {
  console.log('🌱 Starting CampusHub 2.0 Database Seeding...');

  const defaultPasswordHash = await bcrypt.hash('Student@123', 10);
  const facultyPasswordHash = await bcrypt.hash('Faculty@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // 1. USERS & PROFILES (Student, Faculty, Admin)
  const users = [
    {
      id: 'usr_student_demo',
      name: 'Varun Sharma',
      email: 'student@campushub.demo',
      passwordHash: defaultPasswordHash,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_faculty_demo',
      name: 'Dr. Ananya Rao',
      email: 'faculty@campushub.demo',
      passwordHash: facultyPasswordHash,
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr_admin_demo',
      name: 'Admin Chief',
      email: 'admin@campushub.demo',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    }
  ];

  // 19 additional students (Total 20)
  const studentNames = [
    'Aarav Patel', 'Diya Sengupta', 'Rohan Mehta', 'Sneha Kulkarni', 'Aditya Verma',
    'Ananya Deshmukh', 'Karan Nair', 'Pooja Hegde', 'Vikram Joshi', 'Neha Reddy',
    'Siddharth Malhotra', 'Ishita Bannerjee', 'Rahul Kapoor', 'Tanvi Singhal', 'Manish Iyer',
    'Preeti Rathi', 'Harsh Vardhan', 'Kavya Swaminathan', 'Rishabh Pant'
  ];

  const depts = ['Computer Science & Engineering', 'Information Science & Engineering', 'Artificial Intelligence & Data Science', 'Electronics & Communication Engineering'];
  const skillsList = ['React', 'Node.js', 'Python', 'Machine Learning', 'Java', 'SQL', 'UI/UX Design', 'Cybersecurity', 'C++', 'Docker', 'Flutter', 'Data Structures'];
  const interestsList = ['AI/ML', 'Web Development', 'Blockchain', 'Cloud Computing', 'Competitive Programming', 'IoT', 'Mobile Apps', 'Open Source'];

  const students = [
    {
      id: 'std_demo',
      userId: 'usr_student_demo',
      name: 'Varun Sharma',
      usn: '1DS21CS108',
      email: 'student@campushub.demo',
      department: 'Computer Science & Engineering',
      semester: 6,
      section: 'B',
      skills: ['React', 'Node.js', 'Python', 'SQL', 'UI/UX Design'],
      interests: ['Web Development', 'AI/ML', 'Cloud Computing'],
      gpa: 8.9,
      phone: '+91 98765 43210',
      bio: 'Full-stack enthusiast interested in scalable SaaS products and AI integration.'
    }
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const userId = `usr_std_${i + 1}`;
    const stdId = `std_${i + 1}`;
    const dept = depts[i % depts.length];
    const sem = (i % 4) * 2 + 2; // 2, 4, 6, 8
    const sec = String.fromCharCode(65 + (i % 3)); // A, B, C
    const s1 = skillsList[i % skillsList.length];
    const s2 = skillsList[(i + 3) % skillsList.length];
    const s3 = skillsList[(i + 7) % skillsList.length];
    const int1 = interestsList[i % interestsList.length];
    const int2 = interestsList[(i + 2) % interestsList.length];

    users.push({
      id: userId,
      name: studentNames[i],
      email: `student${i + 1}@campushub.demo`,
      passwordHash: defaultPasswordHash,
      role: 'student',
      avatar: `https://i.pravatar.cc/150?u=${stdId}`,
      createdAt: new Date().toISOString()
    });

    students.push({
      id: stdId,
      userId: userId,
      name: studentNames[i],
      usn: `1DS21CS${100 + i + 1}`,
      email: `student${i + 1}@campushub.demo`,
      department: dept,
      semester: sem,
      section: sec,
      skills: [s1, s2, s3],
      interests: [int1, int2],
      gpa: Number((7.5 + (i % 25) * 0.1).toFixed(1)),
      phone: `+91 98765 ${10000 + i}`,
      bio: `Engineering student passionate about ${int1} and software development.`
    });
  }

  // 10 Faculty members
  const facultyData = [
    {
      id: 'fac_demo',
      userId: 'usr_faculty_demo',
      name: 'Dr. Ananya Rao',
      employeeId: 'EMP_CSE_01',
      email: 'faculty@campushub.demo',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      subjects: ['Database Management Systems', 'Advanced Database Systems', 'Data Mining'],
      officeLocation: 'Tech Tower, Room TT-304',
      officeHours: 'Mon-Fri: 2:00 PM - 4:00 PM',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_2',
      userId: 'usr_fac_2',
      name: 'Prof. Rahul Kumar',
      employeeId: 'EMP_CSE_02',
      email: 'rahul.kumar@campushub.demo',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      subjects: ['Operating Systems', 'System Software', 'Linux Kernel Architecture'],
      officeLocation: 'A Block, Room A-210',
      officeHours: 'Tue-Thu: 11:00 AM - 1:00 PM',
      phone: '+91 98222 33445',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_3',
      userId: 'usr_fac_3',
      name: 'Prof. Priya Sharma',
      employeeId: 'EMP_CSE_03',
      email: 'priya.sharma@campushub.demo',
      department: 'Computer Science & Engineering',
      designation: 'Professor & HOD',
      subjects: ['Computer Networks', 'Network Security', 'Distributed Systems'],
      officeLocation: 'Tech Tower, Room TT-301 (HOD Cabin)',
      officeHours: 'Mon-Wed: 3:00 PM - 5:00 PM',
      phone: '+91 98333 44556',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_4',
      userId: 'usr_fac_4',
      name: 'Dr. Rajesh Natarajan',
      employeeId: 'EMP_AI_01',
      email: 'rajesh.n@campushub.demo',
      department: 'Artificial Intelligence & Data Science',
      designation: 'Professor',
      subjects: ['Machine Learning', 'Deep Learning', 'Neural Networks'],
      officeLocation: 'Tech Tower, Room TT-405',
      officeHours: 'Mon-Fri: 10:00 AM - 12:00 PM',
      phone: '+91 98444 55667',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_5',
      userId: 'usr_fac_5',
      name: 'Prof. Meera Kulkarni',
      employeeId: 'EMP_ISE_01',
      email: 'meera.k@campushub.demo',
      department: 'Information Science & Engineering',
      designation: 'Associate Professor',
      subjects: ['Object Oriented Programming with Java', 'Web Technologies', 'Software Engineering'],
      officeLocation: 'B Block, Room B-105',
      officeHours: 'Wed-Fri: 1:30 PM - 3:30 PM',
      phone: '+91 98555 66778',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_6',
      userId: 'usr_fac_6',
      name: 'Dr. Suresh Varma',
      employeeId: 'EMP_ECE_01',
      email: 'suresh.v@campushub.demo',
      department: 'Electronics & Communication Engineering',
      designation: 'Professor',
      subjects: ['Digital Signal Processing', 'Microprocessors & Microcontrollers', 'VLSI Design'],
      officeLocation: 'ECE Block, Room E-202',
      officeHours: 'Mon-Thu: 2:00 PM - 4:00 PM',
      phone: '+91 98666 77889',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_7',
      userId: 'usr_fac_7',
      name: 'Prof. Kavita Reddy',
      employeeId: 'EMP_CSE_04',
      email: 'kavita.r@campushub.demo',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      subjects: ['Design & Analysis of Algorithms', 'Data Structures & Applications'],
      officeLocation: 'A Block, Room A-212',
      officeHours: 'Mon-Fri: 11:00 AM - 12:30 PM',
      phone: '+91 98777 88990',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_8',
      userId: 'usr_fac_8',
      name: 'Dr. Amit Trivedi',
      employeeId: 'EMP_AI_02',
      email: 'amit.t@campushub.demo',
      department: 'Artificial Intelligence & Data Science',
      designation: 'Associate Professor',
      subjects: ['Natural Language Processing', 'Computer Vision', 'Data Visualization'],
      officeLocation: 'Tech Tower, Room TT-410',
      officeHours: 'Tue-Fri: 3:00 PM - 4:30 PM',
      phone: '+91 98888 99001',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_9',
      userId: 'usr_fac_9',
      name: 'Prof. Sunita Pillai',
      employeeId: 'EMP_ISE_02',
      email: 'sunita.p@campushub.demo',
      department: 'Information Science & Engineering',
      designation: 'Assistant Professor',
      subjects: ['Cloud Computing', 'DevOps & Microservices', 'Cyber Law & Ethics'],
      officeLocation: 'B Block, Room B-108',
      officeHours: 'Mon-Wed: 10:30 AM - 12:30 PM',
      phone: '+91 98999 00112',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fac_10',
      userId: 'usr_fac_10',
      name: 'Dr. Vikram Malhotra',
      employeeId: 'EMP_ECE_02',
      email: 'vikram.m@campushub.demo',
      department: 'Electronics & Communication Engineering',
      designation: 'Associate Professor',
      subjects: ['Embedded Systems', 'IoT Architectures', 'Wireless Communication'],
      officeLocation: 'ECE Block, Room E-205',
      officeHours: 'Thu-Sat: 1:00 PM - 3:00 PM',
      phone: '+91 98000 11223',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const faculty = [];
  for (let f of facultyData) {
    if (!users.find(u => u.id === f.userId)) {
      users.push({
        id: f.userId,
        name: f.name,
        email: f.email,
        passwordHash: facultyPasswordHash,
        role: 'faculty',
        avatar: f.avatar,
        createdAt: new Date().toISOString()
      });
    }
    faculty.push(f);
  }

  // 15 CLASSROOMS & LABS
  const classrooms = [
    {
      id: 'room_a101',
      roomNumber: 'A-101',
      building: 'A Block',
      floor: '1st Floor',
      capacity: 60,
      type: 'Classroom',
      facilities: ['Projector', 'Smart Board', 'Wi-Fi', 'AC'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '4:30 PM'
    },
    {
      id: 'room_a102',
      roomNumber: 'A-102',
      building: 'A Block',
      floor: '1st Floor',
      capacity: 60,
      type: 'Classroom',
      facilities: ['Projector', 'Wi-Fi'],
      status: 'Occupied',
      currentClass: 'DBMS Lecture (6th Sem CSE B)',
      availableFrom: '11:15 AM',
      availableUntil: '4:30 PM'
    },
    {
      id: 'room_a201',
      roomNumber: 'A-201',
      building: 'A Block',
      floor: '2nd Floor',
      capacity: 50,
      type: 'Classroom',
      facilities: ['Projector', 'Smart Board', 'Wi-Fi'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '2:00 PM'
    },
    {
      id: 'room_a204',
      roomNumber: 'A-204',
      building: 'A Block',
      floor: '2nd Floor',
      capacity: 40,
      type: 'Classroom',
      facilities: ['Projector', 'Smart Board', 'Wi-Fi', 'AC'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '4:00 PM'
    },
    {
      id: 'room_a301',
      roomNumber: 'A-301',
      building: 'A Block',
      floor: '3rd Floor',
      capacity: 70,
      type: 'Seminar Hall',
      facilities: ['Projector', 'Audio System', 'AC', 'Wi-Fi'],
      status: 'Reserved',
      currentClass: 'Guest Seminar on AI Ethics',
      availableFrom: '3:00 PM',
      availableUntil: '5:00 PM'
    },
    {
      id: 'room_b101',
      roomNumber: 'B-101',
      building: 'B Block',
      floor: '1st Floor',
      capacity: 60,
      type: 'Classroom',
      facilities: ['Projector', 'Wi-Fi'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '10:00 AM',
      availableUntil: '1:00 PM'
    },
    {
      id: 'room_b201',
      roomNumber: 'B-201',
      building: 'B Block',
      floor: '2nd Floor',
      capacity: 55,
      type: 'Classroom',
      facilities: ['Projector', 'Smart Board', 'Wi-Fi'],
      status: 'Occupied',
      currentClass: 'Web Tech Lab Theory (4th Sem ISE)',
      availableFrom: '12:00 PM',
      availableUntil: '3:30 PM'
    },
    {
      id: 'room_tt101',
      roomNumber: 'TT-101 (CSE Lab 1)',
      building: 'Tech Tower',
      floor: '1st Floor',
      capacity: 45,
      type: 'Lab',
      facilities: ['Computers (45)', 'AC', 'High-Speed Wi-Fi', 'Projector'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '5:00 PM'
    },
    {
      id: 'room_tt102',
      roomNumber: 'TT-102 (CSE Lab 2)',
      building: 'Tech Tower',
      floor: '1st Floor',
      capacity: 45,
      type: 'Lab',
      facilities: ['Computers (45)', 'AC', 'High-Speed Wi-Fi', 'Smart Board'],
      status: 'Occupied',
      currentClass: 'Operating Systems Lab (Section A)',
      availableFrom: '1:15 PM',
      availableUntil: '4:30 PM'
    },
    {
      id: 'room_tt201',
      roomNumber: 'TT-201 (AI/ML Lab)',
      building: 'Tech Tower',
      floor: '2nd Floor',
      capacity: 40,
      type: 'Lab',
      facilities: ['GPU Workstations (40)', 'AC', 'High-Speed Wi-Fi', 'Projector'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '4:00 PM'
    },
    {
      id: 'room_tt202',
      roomNumber: 'TT-202 (Cloud Lab)',
      building: 'Tech Tower',
      floor: '2nd Floor',
      capacity: 40,
      type: 'Lab',
      facilities: ['Computers (40)', 'AC', 'Wi-Fi'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '5:00 PM'
    },
    {
      id: 'room_tt501',
      roomNumber: 'TT-501 (Auditorium)',
      building: 'Tech Tower',
      floor: '5th Floor',
      capacity: 350,
      type: 'Auditorium',
      facilities: ['Stage Sound System', 'Dual Projectors', 'AC', 'VIP Lounge'],
      status: 'Reserved',
      currentClass: 'Annual TechFest Orientation',
      availableFrom: '4:00 PM',
      availableUntil: '6:00 PM'
    },
    {
      id: 'room_e101',
      roomNumber: 'E-101',
      building: 'ECE Block',
      floor: '1st Floor',
      capacity: 60,
      type: 'Classroom',
      facilities: ['Projector', 'Wi-Fi'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '9:00 AM',
      availableUntil: '3:00 PM'
    },
    {
      id: 'room_e201',
      roomNumber: 'E-201 (VLSI Lab)',
      building: 'ECE Block',
      floor: '2nd Floor',
      capacity: 35,
      type: 'Lab',
      facilities: ['DSP Trainers', 'Computers', 'AC', 'Oscilloscopes'],
      status: 'Vacant',
      currentClass: null,
      availableFrom: '10:00 AM',
      availableUntil: '4:30 PM'
    },
    {
      id: 'room_a105',
      roomNumber: 'A-105',
      building: 'A Block',
      floor: '1st Floor',
      capacity: 50,
      type: 'Classroom',
      facilities: ['Projector', 'Smart Board'],
      status: 'Occupied',
      currentClass: 'Algorithms Lecture (4th Sem CSE)',
      availableFrom: '11:00 AM',
      availableUntil: '2:30 PM'
    }
  ];

  // TIMETABLES FOR ROOMS
  const timetables = [
    { id: 'tt_1', classroomId: 'room_a102', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'DBMS', professorId: 'fac_demo', section: '6th Sem CSE B' },
    { id: 'tt_2', classroomId: 'room_a102', dayOfWeek: 'Monday', startTime: '10:15', endTime: '11:15', subject: 'Operating Systems', professorId: 'fac_2', section: '6th Sem CSE B' },
    { id: 'tt_3', classroomId: 'room_tt102', dayOfWeek: 'Monday', startTime: '11:15', endTime: '13:15', subject: 'OS Lab', professorId: 'fac_2', section: '6th Sem CSE A' },
    { id: 'tt_4', classroomId: 'room_a201', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '11:00', subject: 'Computer Networks', professorId: 'fac_3', section: '6th Sem CSE A' },
    { id: 'tt_5', classroomId: 'room_tt201', dayOfWeek: 'Wednesday', startTime: '11:15', endTime: '13:15', subject: 'Machine Learning Lab', professorId: 'fac_4', section: '6th Sem AI&DS' },
    { id: 'tt_6', classroomId: 'room_b201', dayOfWeek: 'Thursday', startTime: '10:15', endTime: '12:00', subject: 'Web Technologies', professorId: 'fac_5', section: '4th Sem ISE' }
  ];

  // 15 NOTICES
  const notices = [
    {
      id: 'not_1',
      title: '6th Semester Mini Project Mid-Term Review Schedule',
      content: 'All 6th Semester CSE & ISE students are hereby notified that the Mid-Term Mini Project evaluations will take place from October 14th to October 16th, 2026. Teams must bring printed synopsis reports and demo working code.',
      category: 'Academic',
      priority: 'Urgent',
      date: '2026-10-06',
      postedBy: 'HOD, CSE Dept',
      attachmentUrl: '#'
    },
    {
      id: 'not_2',
      title: 'Campus Recruitment Drive: TechCorp Systems (Package 14 LPA)',
      content: 'Placement cell is organizing a campus drive for TechCorp Systems for final year CSE, ISE, and ECE students. Registration deadline is October 10th, 5:00 PM via student portal.',
      category: 'Placement',
      priority: 'High',
      date: '2026-10-05',
      postedBy: 'Training & Placement Office',
      attachmentUrl: '#'
    },
    {
      id: 'not_3',
      title: 'Annual Hackathon: HackCampus 2026 Registration Open!',
      content: 'The 24-Hour Annual National Hackathon HackCampus 2026 is scheduled for October 24-25. Cash prizes worth ₹2,00,000. Open to all branches and years. Register your team now!',
      category: 'Event',
      priority: 'High',
      date: '2026-10-04',
      postedBy: 'Campus Club Council',
      attachmentUrl: '#'
    },
    {
      id: 'not_4',
      title: 'Revised End-Semester Exam Time Table Released',
      content: 'The draft timetable for 4th and 6th Semester theory examinations commencing November 15th, 2026 has been published. Any clash notifications must be submitted to the Controller of Exams before Oct 12th.',
      category: 'Examination',
      priority: 'Urgent',
      date: '2026-10-03',
      postedBy: 'Controller of Examinations',
      attachmentUrl: '#'
    },
    {
      id: 'not_5',
      title: 'Merit Scholarship 2026 Application Portal Live',
      content: 'Applications are invited from students who scored above 8.5 CGPA in the previous academic year for the Alumni Sponsored Merit Scholarships. Check student service tab to apply.',
      category: 'Scholarship',
      priority: 'Normal',
      date: '2026-10-02',
      postedBy: 'Student Welfare Cell',
      attachmentUrl: '#'
    },
    {
      id: 'not_6',
      title: 'Maintenance of Central Library Server on Saturday',
      content: 'The digital library portal and e-resource access will be offline for routine server upgrades this Saturday from 10:00 PM to 4:00 AM.',
      category: 'General',
      priority: 'Normal',
      date: '2026-10-01',
      postedBy: 'IT Infrastructure Dept',
      attachmentUrl: '#'
    },
    {
      id: 'not_7',
      title: 'Workshop on Cloud Native Architectures & Kubernetes',
      content: 'Department of ISE in collaboration with AWS User Group is hosting a 2-day hands-on workshop on Docker & Kubernetes on October 18-19 in Tech Tower Lab 1.',
      category: 'Academic',
      priority: 'Normal',
      date: '2026-09-30',
      postedBy: 'Prof. Sunita Pillai',
      attachmentUrl: '#'
    },
    {
      id: 'not_8',
      title: 'Emergency Power Outage in B-Block Annex',
      content: 'Scheduled transformer replacement will cause temporary power outage in B-Block Rooms B-101 to B-110 on Friday between 1:00 PM and 3:00 PM.',
      category: 'Emergency',
      priority: 'Urgent',
      date: '2026-09-29',
      postedBy: 'Campus Maintenance Office',
      attachmentUrl: '#'
    },
    {
      id: 'not_9',
      title: 'IEEE Student Branch Membership Drive 2026-27',
      content: 'Join the IEEE Student Branch to get access to research publications, international webinars, and project grants. Early bird discounts available till Oct 15.',
      category: 'Event',
      priority: 'Normal',
      date: '2026-09-28',
      postedBy: 'IEEE Student Counselor',
      attachmentUrl: '#'
    },
    {
      id: 'not_10',
      title: 'Notice regarding mandatory attendance requirement (75%)',
      content: 'Students are advised to strictly maintain a minimum of 75% attendance in all theory and laboratory subjects to be eligible for hall tickets.',
      category: 'Academic',
      priority: 'High',
      date: '2026-09-25',
      postedBy: 'Dean of Academics',
      attachmentUrl: '#'
    }
  ];

  // 20 ACADEMIC RESOURCES
  const resources = [
    {
      id: 'res_1',
      title: 'Database Management Systems Complete Handwritten Notes (Unit 1 to 5)',
      description: 'Comprehensive notes covering ER diagrams, Relational Algebra, SQL, Normalization (1NF to BCNF), and Transaction Processing.',
      subject: 'Database Management Systems',
      semester: 6,
      department: 'Computer Science & Engineering',
      category: 'Notes',
      fileUrl: '/uploads/DBMS_Complete_Notes.pdf',
      fileType: 'PDF',
      fileSize: '4.8 MB',
      uploadedBy: 'fac_demo',
      uploadedByName: 'Dr. Ananya Rao',
      downloadsCount: 142,
      date: '2026-09-20'
    },
    {
      id: 'res_2',
      title: 'DBMS Previous 5 Years VTU/Autonomous Question Papers Collection',
      description: 'Solved question papers from 2021 to 2025 with step-by-step SQL solutions and schema diagrams.',
      subject: 'Database Management Systems',
      semester: 6,
      department: 'Computer Science & Engineering',
      category: 'Previous Year Papers',
      fileUrl: '/uploads/DBMS_PYQ_2021_2025.pdf',
      fileType: 'PDF',
      fileSize: '8.2 MB',
      uploadedBy: 'fac_demo',
      uploadedByName: 'Dr. Ananya Rao',
      downloadsCount: 230,
      date: '2026-09-18'
    },
    {
      id: 'res_3',
      title: 'Operating Systems Lab Manual & Practice Code Solutions',
      description: 'Lab manual containing C code implementations for CPU Scheduling algorithms, Dining Philosophers, Banker\'s Algorithm, and Page Replacement.',
      subject: 'Operating Systems',
      semester: 6,
      department: 'Computer Science & Engineering',
      category: 'Lab Manuals',
      fileUrl: '/uploads/OS_Lab_Manual_2026.pdf',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      uploadedBy: 'fac_2',
      uploadedByName: 'Prof. Rahul Kumar',
      downloadsCount: 185,
      date: '2026-09-22'
    },
    {
      id: 'res_4',
      title: 'Machine Learning Algorithms Quick Formula Sheet & Cheatsheet',
      description: 'One-pager summary of Linear Regression, Logistic Regression, Decision Trees, SVM, KNN, and K-Means Clustering math.',
      subject: 'Machine Learning',
      semester: 6,
      department: 'Artificial Intelligence & Data Science',
      category: 'Reference Materials',
      fileUrl: '/uploads/ML_Cheatsheet.pdf',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadedBy: 'fac_4',
      uploadedByName: 'Dr. Rajesh Natarajan',
      downloadsCount: 310,
      date: '2026-09-25'
    },
    {
      id: 'res_5',
      title: 'Computer Networks Packet Tracer Lab Guide & Topologies',
      description: 'Step-by-step Cisco Packet Tracer tutorial for configuring Subnetting, RIP, OSPF, and VLANs.',
      subject: 'Computer Networks',
      semester: 6,
      department: 'Computer Science & Engineering',
      category: 'Lab Manuals',
      fileUrl: '/uploads/CN_PacketTracer_Guide.pdf',
      fileType: 'PDF',
      fileSize: '5.5 MB',
      uploadedBy: 'fac_3',
      uploadedByName: 'Prof. Priya Sharma',
      downloadsCount: 175,
      date: '2026-09-28'
    },
    {
      id: 'res_6',
      title: 'Web Technologies Full Course Syllabus & Mini Project Guidelines 2026',
      description: 'Official course outline, grading rubric, and project submission guidelines for HTML5, CSS3, JS, React, and Node.js.',
      subject: 'Web Technologies',
      semester: 4,
      department: 'Information Science & Engineering',
      category: 'Syllabus',
      fileUrl: '/uploads/WebTech_Syllabus_2026.pdf',
      fileType: 'PDF',
      fileSize: '1.2 MB',
      uploadedBy: 'fac_5',
      uploadedByName: 'Prof. Meera Kulkarni',
      downloadsCount: 95,
      date: '2026-09-15'
    },
    {
      id: 'res_7',
      title: 'Design & Analysis of Algorithms Assignment 1 & 2 Questions with Hints',
      description: 'Problem set on Divide and Conquer, Dynamic Programming (0/1 Knapsack, LCS, Matrix Chain), and Greedy Methods.',
      subject: 'Design & Analysis of Algorithms',
      semester: 4,
      department: 'Computer Science & Engineering',
      category: 'Assignments',
      fileUrl: '/uploads/DAA_Assignment_1_2.pdf',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      uploadedBy: 'fac_7',
      uploadedByName: 'Prof. Kavita Reddy',
      downloadsCount: 160,
      date: '2026-09-29'
    },
    {
      id: 'res_8',
      title: 'Deep Learning PyTorch Code Samples & Jupyter Notebooks',
      description: 'CNN, RNN, and Transformer implementation notebooks with pretrained weights and dataset loaders.',
      subject: 'Deep Learning',
      semester: 7,
      department: 'Artificial Intelligence & Data Science',
      category: 'Notes',
      fileUrl: '/uploads/DeepLearning_Notebooks.zip',
      fileType: 'ZIP',
      fileSize: '14.5 MB',
      uploadedBy: 'fac_4',
      uploadedByName: 'Dr. Rajesh Natarajan',
      downloadsCount: 220,
      date: '2026-10-01'
    }
  ];

  // 10 EVENTS & CLUBS
  const events = [
    {
      id: 'evt_1',
      name: 'HackCampus 2026 — 24hr Flagship Hackathon',
      description: 'Build innovative solutions for Smart Cities, Healthcare, and Campus Automation. Mentorship by industry engineers from Google & Microsoft. Exciting cash prizes, swags, and internship offers!',
      category: 'Hackathon',
      date: '2026-10-24',
      time: '09:00 AM - Oct 25, 09:00 AM',
      venue: 'Tech Tower Auditorium (TT-501)',
      organizer: 'CampusHub Tech Club & CSE Dept',
      registrationUrl: '#',
      posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80',
      registeredUserIds: ['usr_student_demo', 'usr_std_1', 'usr_std_2'],
      capacity: 200
    },
    {
      id: 'evt_2',
      name: 'AI & Generative AI Workshop with Hands-on LLM Fine-Tuning',
      description: 'Learn how to build full-stack RAG pipelines, deploy Ollama locally, and integrate OpenAI APIs into modern web apps.',
      category: 'Workshop',
      date: '2026-10-18',
      time: '10:00 AM - 04:00 PM',
      venue: 'AI/ML Lab (TT-201)',
      organizer: 'Department of AI & Data Science',
      registrationUrl: '#',
      posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      registeredUserIds: ['usr_student_demo', 'usr_std_3'],
      capacity: 50
    },
    {
      id: 'evt_3',
      name: 'Cybersecurity & Ethical Hacking Bootcamp',
      description: 'Demonstration of penetration testing, web app vulnerability scanning (OWASP Top 10), and Capture The Flag (CTF) challenges.',
      category: 'Technical',
      date: '2026-10-20',
      time: '02:00 PM - 05:00 PM',
      venue: 'CSE Lab 1 (TT-101)',
      organizer: 'CyberSec Student Group',
      registrationUrl: '#',
      posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      registeredUserIds: ['usr_std_4', 'usr_std_5'],
      capacity: 60
    },
    {
      id: 'evt_4',
      name: 'Annual Cultural Fest — Rhythm 2026 Night',
      description: 'Music bands, dance crew battles, fashion show, and live concert performance by famous indie artists.',
      category: 'Cultural',
      date: '2026-11-05',
      time: '05:00 PM - 10:00 PM',
      venue: 'Main Campus Open Air Theater',
      organizer: 'Student Cultural Committee',
      registrationUrl: '#',
      posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      registeredUserIds: ['usr_student_demo'],
      capacity: 1000
    },
    {
      id: 'evt_5',
      name: 'Inter-College Football & Cricket Tournament',
      description: 'Annual inter-departmental sports championship. Trophy and medals for top 3 winning teams.',
      category: 'Sports',
      date: '2026-10-28',
      time: '08:00 AM onwards',
      venue: 'Campus Sports Ground',
      organizer: 'Department of Physical Education',
      registrationUrl: '#',
      posterUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
      registeredUserIds: [],
      capacity: 16
    }
  ];

  // 10 QUESTIONS TO FACULTY
  const questions = [
    {
      id: 'q_1',
      studentId: 'std_demo',
      studentName: 'Varun Sharma',
      studentUsn: '1DS21CS108',
      facultyId: 'fac_demo',
      facultyName: 'Dr. Ananya Rao',
      subject: 'Database Management Systems',
      title: 'Difference between B-Tree and B+ Tree indexing performance in DBMS',
      question: 'Respected Ma\'am, while studying indexing methods, I had a doubt regarding why B+ Trees are preferred over B-Trees in disk-backed relational databases like MySQL/InnoDB. Is it primarily due to sequential range queries?',
      status: 'Answered',
      answer: 'Hello Varun! Excellent question. Yes! In a B+ Tree, all data records/pointers are stored strictly at the leaf nodes, which are linked together as a doubly linked list. This allows efficient range scans by jumping across leaf nodes without traversing back up to parent nodes. Additionally, internal nodes only store keys, so more keys fit into a single disk page, reducing I/O depth.',
      answeredAt: '2026-10-07T14:30:00.000Z',
      attachmentUrl: null
    },
    {
      id: 'q_2',
      studentId: 'std_1',
      studentName: 'Aarav Patel',
      studentUsn: '1DS21CS101',
      facultyId: 'fac_2',
      facultyName: 'Prof. Rahul Kumar',
      subject: 'Operating Systems',
      title: 'Clarification on Banker\'s Algorithm Deadlock Avoidance Safety State',
      question: 'Sir, in the Banker\'s algorithm problem given in Assignment 2, if the available resources equal the need vector for process P2, can P2 release all its allocated resources immediately?',
      status: 'Pending',
      answer: null,
      answeredAt: null,
      attachmentUrl: null
    },
    {
      id: 'q_3',
      studentId: 'std_demo',
      studentName: 'Varun Sharma',
      studentUsn: '1DS21CS108',
      facultyId: 'fac_3',
      facultyName: 'Prof. Priya Sharma',
      subject: 'Computer Networks',
      title: 'TCP 3-Way Handshake SYN Flood Attack Defense Mechanisms',
      question: 'Ma\'am, how does SYN Cookies technique prevent half-open TCP connections from overflowing the backlog queue in Linux servers?',
      status: 'Pending',
      answer: null,
      answeredAt: null,
      attachmentUrl: null
    }
  ];

  // 10 COMPLAINTS
  const complaints = [
    {
      id: 'cmp_1',
      userId: 'usr_student_demo',
      userName: 'Varun Sharma',
      userRole: 'student',
      userUsn: '1DS21CS108',
      title: 'Projector HDMI port damaged in Classroom A-204',
      description: 'The overhead projector in A-204 has a loose HDMI input port causing screen flicker and green tint during class lectures.',
      category: 'Classroom issue',
      location: 'A Block, Room A-204',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Electrician Team (Mr. Ramesh)',
      createdAt: '2026-10-06T09:15:00.000Z',
      updatedAt: '2026-10-07T11:00:00.000Z',
      updatesHistory: [
        { status: 'Submitted', timestamp: '2026-10-06T09:15:00.000Z', note: 'Complaint registered by student.' },
        { status: 'Under Review', timestamp: '2026-10-06T11:00:00.000Z', note: 'Reviewed by Estate Admin.' },
        { status: 'Assigned', timestamp: '2026-10-06T14:20:00.000Z', note: 'Assigned to Mr. Ramesh for HDMI cable replacement.' },
        { status: 'In Progress', timestamp: '2026-10-07T11:00:00.000Z', note: 'Replacement cable ordered, technician on site.' }
      ]
    },
    {
      id: 'cmp_2',
      userId: 'usr_std_2',
      userName: 'Rohan Mehta',
      userRole: 'student',
      userUsn: '1DS21CS103',
      title: 'Wi-Fi access point in Tech Tower 2nd Floor disconnecting frequently',
      description: 'The AP labeled TT_WIFI_2F drops connection every 10 minutes when more than 20 students connect in the AI/ML Lab.',
      category: 'Wi-Fi issue',
      location: 'Tech Tower 2nd Floor Corridor',
      priority: 'Medium',
      status: 'Under Review',
      assignedTo: 'IT Network Team',
      createdAt: '2026-10-07T10:30:00.000Z',
      updatedAt: '2026-10-07T10:30:00.000Z',
      updatesHistory: [
        { status: 'Submitted', timestamp: '2026-10-07T10:30:00.000Z', note: 'Complaint submitted.' }
      ]
    },
    {
      id: 'cmp_3',
      userId: 'usr_std_5',
      userName: 'Aditya Verma',
      userRole: 'student',
      userUsn: '1DS21CS105',
      title: 'AC temperature control not working in CSE Lab 1 (TT-101)',
      description: 'The central AC unit is running continuously at 16°C and remote control buttons are unresponsive.',
      category: 'Lab issue',
      location: 'Tech Tower, Room TT-101',
      priority: 'Low',
      status: 'Resolved',
      assignedTo: 'HVAC Maintenance',
      createdAt: '2026-10-02T14:00:00.000Z',
      updatedAt: '2026-10-04T16:00:00.000Z',
      updatesHistory: [
        { status: 'Submitted', timestamp: '2026-10-02T14:00:00.000Z', note: 'Reported by student.' },
        { status: 'Resolved', timestamp: '2026-10-04T16:00:00.000Z', note: 'Thermostat sensor reset and remote batteries replaced.' }
      ]
    }
  ];

  // 10 LOST & FOUND
  const lostFound = [
    {
      id: 'lf_1',
      userId: 'usr_std_3',
      userName: 'Sneha Kulkarni',
      userContact: 'sneha.k@campushub.demo | Ph: 9876543213',
      itemType: 'LOST',
      title: 'Blue Water Bottle (Hydro Flask 800ml)',
      description: 'Lost a dark blue stainless steel water bottle with a laptop sticker of Python logo near A-Block 2nd floor stairs.',
      category: 'Personal Belongings',
      location: 'A-Block 2nd Floor Staircase',
      date: '2026-10-07',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
      status: 'Open',
      potentialMatches: ['lf_2']
    },
    {
      id: 'lf_2',
      userId: 'usr_std_6',
      userName: 'Ananya Deshmukh',
      userContact: 'ananya.d@campushub.demo',
      itemType: 'FOUND',
      title: 'Found Blue Stainless Steel Flask',
      description: 'Found a blue metallic water bottle left on the bench near A-202 classroom around 3:30 PM today. Kept with floor supervisor.',
      category: 'Personal Belongings',
      location: 'Near A-202 Classroom',
      date: '2026-10-07',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
      status: 'Open',
      potentialMatches: ['lf_1']
    },
    {
      id: 'lf_3',
      userId: 'usr_student_demo',
      userName: 'Varun Sharma',
      userContact: 'student@campushub.demo',
      itemType: 'LOST',
      title: 'College Student ID Card - Varun Sharma (1DS21CS108)',
      description: 'Misplaced my college identity card in a transparent card holder during the lunchtime in the Central Library.',
      category: 'ID Card / Documents',
      location: 'Central Library 1st Floor Reading Room',
      date: '2026-10-06',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      status: 'Open',
      potentialMatches: []
    }
  ];

  // 10 PROJECTS FOR TEAM FINDER
  const projects = [
    {
      id: 'proj_1',
      title: 'CampusHub AI Assistant & Vacancy Automation',
      description: 'Building an intelligent microservice that analyzes IoT door sensors and timetable datasets to provide real-time classroom availability and automated room reservation approval.',
      department: 'Computer Science & Engineering',
      requiredSkills: ['React', 'Node.js', 'Python', 'Machine Learning', 'SQL'],
      interests: ['AI/ML', 'Web Development', 'Cloud Computing'],
      teamSize: 4,
      currentMembersCount: 2,
      openPositions: 2,
      ownerId: 'std_demo',
      ownerName: 'Varun Sharma',
      ownerUsn: '1DS21CS108',
      members: [
        { studentId: 'std_demo', name: 'Varun Sharma', role: 'Full-Stack Lead' },
        { studentId: 'std_1', name: 'Aarav Patel', role: 'Backend Engineer' }
      ]
    },
    {
      id: 'proj_2',
      title: 'DeCentralized Student Credential Verification on Polygon',
      description: 'A Web3 dApp for instant verification of academic transcripts and graduation certificates using smart contracts.',
      department: 'Computer Science & Engineering',
      requiredSkills: ['Solidity', 'React', 'Node.js', 'Cybersecurity'],
      interests: ['Blockchain', 'Web Development'],
      teamSize: 3,
      currentMembersCount: 1,
      openPositions: 2,
      ownerId: 'std_3',
      ownerName: 'Rohan Mehta',
      ownerUsn: '1DS21CS103',
      members: [
        { studentId: 'std_3', name: 'Rohan Mehta', role: 'Smart Contract Dev' }
      ]
    },
    {
      id: 'proj_3',
      title: 'Autonomous Drone Navigation for Campus Delivery',
      description: 'Developing a ROS2 software stack for automated delivery of emergency medical kits across campus buildings using Computer Vision.',
      department: 'Artificial Intelligence & Data Science',
      requiredSkills: ['Python', 'C++', 'Computer Vision', 'Machine Learning'],
      interests: ['AI/ML', 'IoT'],
      teamSize: 4,
      currentMembersCount: 2,
      openPositions: 2,
      ownerId: 'std_4',
      ownerName: 'Sneha Kulkarni',
      ownerUsn: '1DS21CS104',
      members: [
        { studentId: 'std_4', name: 'Sneha Kulkarni', role: 'Computer Vision Lead' },
        { studentId: 'std_5', name: 'Aditya Verma', role: 'ROS Hardware Integrator' }
      ]
    }
  ];

  // AI KNOWLEDGE BASE FOR RAG & CHATBOT
  const knowledgeBase = [
    {
      id: 'kb_1',
      category: 'Faculty',
      title: 'Faculty List & Contact Information',
      content: 'Dr. Ananya Rao is Associate Professor in CSE teaching DBMS. Office: TT-304. Hours: Mon-Fri 2-4 PM. Prof. Rahul Kumar teaches Operating Systems (Office A-210). Prof. Priya Sharma is HOD CSE teaching Computer Networks (Office TT-301). Dr. Rajesh Natarajan teaches Machine Learning (Office TT-405). Prof. Meera Kulkarni teaches Web Technologies in ISE Dept (Office B-105).',
      tags: ['faculty', 'professors', 'hod', 'teachers', 'office hours', 'contact']
    },
    {
      id: 'kb_2',
      category: 'Classrooms',
      title: 'Classroom & Lab Locations & Vacancy Rules',
      content: 'A Block contains Classrooms A-101, A-102, A-201, A-204, and Seminar Hall A-301. B Block contains B-101, B-201. Tech Tower contains CSE Lab 1 (TT-101), CSE Lab 2 (TT-102), AI/ML Lab (TT-201), Cloud Lab (TT-202), and Auditorium (TT-501). Vacant classrooms can be reserved by students for group study or project work via the Classroom Vacancy tab.',
      tags: ['classrooms', 'labs', 'vacancy', 'vacant rooms', 'auditorium', 'buildings']
    },
    {
      id: 'kb_3',
      category: 'Courses',
      title: 'Computer Science & Engineering Curriculum Overview',
      content: '6th Semester CSE core subjects include Database Management Systems (DBMS), Operating Systems (OS), Computer Networks (CN), and Mini Project. Electives include Machine Learning, Cloud Computing, and Mobile Application Development. Mini Project mid-term evaluation requires 15-page synopsis report and working prototype.',
      tags: ['syllabus', 'courses', 'subjects', 'dbms', 'mini project', 'requirements']
    },
    {
      id: 'kb_4',
      category: 'Rules',
      title: 'Campus Regulations & Attendance Criteria',
      content: 'Students must maintain a minimum of 75% attendance in theory and lab classes to be eligible for end-semester exams. Campus ID card must be displayed at all times. Library books can be issued for 14 days up to 4 books per student.',
      tags: ['attendance', 'rules', 'library', 'id card', 'hall ticket']
    },
    {
      id: 'kb_5',
      category: 'Events',
      title: 'HackCampus 2026 & Campus Events',
      content: 'HackCampus 2026 is the 24-hour flagship hackathon on Oct 24-25 in Tech Tower Auditorium. Cash prizes total ₹2,00,000. Cultural Fest Rhythm 2026 is scheduled for Nov 5th. AI & GenAI Workshop is on Oct 18th in TT-201.',
      tags: ['hackathon', 'events', 'workshop', 'cultural fest', 'hackcampus']
    },
    {
      id: 'kb_6',
      category: 'Campus facilities',
      title: 'College Amenities & Facilities',
      content: 'The Central Library is located on the 1st floor of Main Academic Block. Canteen is behind B-Block offering North/South Indian meals. Sports Complex includes indoor badminton court, gym, and outdoor football ground.',
      tags: ['canteen', 'library', 'sports', 'gym', 'amenities', 'facility']
    },
    {
      id: 'kb_7',
      category: 'FAQs',
      title: 'Frequently Asked Questions (FAQs)',
      content: 'Q: How to reset password? A: Contact IT Desk or click Forgot Password on login page. Q: How to report broken equipment? A: Submit a complaint under the Complaints section in CampusHub 2.0. Q: Where are previous year papers? A: Go to Resources section and filter by Previous Year Papers.',
      tags: ['faq', 'help', 'question', 'password', 'previous year papers', 'notes']
    }
  ];

  // NOTIFICATIONS
  const notifications = [
    {
      id: 'notif_1',
      userId: 'usr_student_demo',
      title: 'Faculty Answered Your Question',
      message: 'Dr. Ananya Rao replied to your query regarding "Difference between B-Tree and B+ Tree indexing performance".',
      type: 'FACULTY_REPLY',
      read: false,
      createdAt: '2026-10-07T14:30:00.000Z',
      link: '/student/ask-faculty'
    },
    {
      id: 'notif_2',
      userId: 'usr_student_demo',
      title: 'Complaint Status Updated',
      message: 'Your complaint regarding "Projector HDMI port in A-204" is now IN PROGRESS.',
      type: 'COMPLAINT_UPDATE',
      read: false,
      createdAt: '2026-10-07T11:00:00.000Z',
      link: '/student/complaints'
    },
    {
      id: 'notif_3',
      userId: 'usr_student_demo',
      title: 'New Notice Posted',
      message: '6th Semester Mini Project Mid-Term Review Schedule has been announced.',
      type: 'NEW_NOTICE',
      read: true,
      createdAt: '2026-10-06T09:00:00.000Z',
      link: '/student/notices'
    }
  ];

  // Set all collections into db instance
  db.resetAll({
    users,
    students,
    faculty,
    departments: [
      { id: 'dept_1', code: 'CSE', name: 'Computer Science & Engineering', HOD: 'Prof. Priya Sharma', totalStudents: 480, totalFaculty: 24 },
      { id: 'dept_2', code: 'ISE', name: 'Information Science & Engineering', HOD: 'Prof. Meera Kulkarni', totalStudents: 360, totalFaculty: 18 },
      { id: 'dept_3', code: 'AI&DS', name: 'Artificial Intelligence & Data Science', HOD: 'Dr. Rajesh Natarajan', totalStudents: 240, totalFaculty: 12 },
      { id: 'dept_4', code: 'ECE', name: 'Electronics & Communication Engineering', HOD: 'Dr. Suresh Varma', totalStudents: 420, totalFaculty: 22 }
    ],
    classrooms,
    timetables,
    reservations: [
      {
        id: 'resv_1',
        classroomId: 'room_a301',
        userId: 'usr_student_demo',
        userName: 'Varun Sharma',
        userRole: 'student',
        purpose: 'IEEE Student Branch Committee Meeting',
        date: '2026-10-09',
        startTime: '15:00',
        endTime: '17:00',
        status: 'Approved'
      }
    ],
    notices,
    resources,
    events,
    questions,
    complaints,
    lost_found: lostFound,
    projects,
    team_requests: [],
    notifications,
    knowledge_base: knowledgeBase,
    chat_sessions: [
      { id: 'cs_demo', userId: 'usr_student_demo', title: 'Classroom Availability Inquiry', createdAt: '2026-10-07T10:00:00.000Z', updatedAt: '2026-10-07T10:05:00.000Z' }
    ],
    chat_messages: [
      {
        id: 'msg_1',
        sessionId: 'cs_demo',
        role: 'user',
        content: 'Which classrooms are vacant right now?',
        sources: [],
        createdAt: '2026-10-07T10:00:00.000Z'
      },
      {
        id: 'msg_2',
        sessionId: 'cs_demo',
        role: 'assistant',
        content: 'Based on current live timetable & reservation data, the following classrooms are **VACANT right now**:\n\n1. **Room A-101** (A Block, 1st Floor) — Capacity: 60 (Available until 4:30 PM)\n2. **Room A-201** (A Block, 2nd Floor) — Capacity: 50 (Available until 2:00 PM)\n3. **Room A-204** (A Block, 2nd Floor) — Capacity: 40 (Available until 4:00 PM)\n4. **Tech Tower CSE Lab 1 (TT-101)** — Capacity: 45 (Available until 5:00 PM)\n5. **Tech Tower AI/ML Lab (TT-201)** — Capacity: 40 (Available until 4:00 PM)\n\nWould you like to reserve any of these classrooms for study or project work?',
        sources: ['Classroom Vacancy System', 'Campus Timetable DB'],
        createdAt: '2026-10-07T10:00:05.000Z'
      }
    ]
  });

  console.log('✅ CampusHub 2.0 Database successfully seeded!');
  console.log('   👤 Demo Student: student@campushub.demo / Student@123');
  console.log('   👨‍🏫 Demo Faculty: faculty@campushub.demo / Faculty@123');
  console.log('   👑 Demo Admin:   admin@campushub.demo / Admin@123');
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
