import { Student } from "./mockStudents";

export const extendedMockStudents: Student[] = [
  {
    id: "3",
    firstName: "Duong",
    lastName: "Gia An",
    email: "duong.giaan@university.edu",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "2001-03-12",
    address: "789 Student Lane, Campus City, CA 90212",
    enrollmentDate: "2019-09-01",
    studentId: "STU2019023",
    major: "Computer Science",
    year: "Senior",
    gpa: 3.72,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Duong Van Minh",
      relationship: "Father",
      phone: "+1 (555) 765-4321"
    },
    courses: [
      {
        id: "c10",
        name: "Machine Learning",
        code: "CS450",
        credits: 4,
        grade: "B+",
        semester: "Fall 2024"
      },
      {
        id: "c11",
        name: "Computer Networks",
        code: "CS430",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c12",
        name: "Software Architecture",
        code: "CS460",
        credits: 3,
        grade: "B",
        semester: "Fall 2024"
      },
      {
        id: "c13",
        name: "Cybersecurity",
        code: "CS440",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 125,
      absent: 10,
      late: 15,
      totalClasses: 150
    },
    performance: [
      {
        semester: "Fall 2019",
        gpa: 3.5,
        credits: 15
      },
      {
        semester: "Spring 2020",
        gpa: 3.6,
        credits: 16
      },
      {
        semester: "Fall 2020",
        gpa: 3.7,
        credits: 15
      },
      {
        semester: "Spring 2021",
        gpa: 3.75,
        credits: 17
      },
      {
        semester: "Fall 2021",
        gpa: 3.8,
        credits: 16
      },
      {
        semester: "Spring 2022",
        gpa: 3.7,
        credits: 15
      },
      {
        semester: "Fall 2022",
        gpa: 3.65,
        credits: 14
      },
      {
        semester: "Spring 2023",
        gpa: 3.72,
        credits: 16
      }
    ]
  },
  {
    id: "4",
    firstName: "Huynh",
    lastName: "Duc Nham",
    email: "huynh.ducnham@university.edu",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "2002-07-08",
    address: "321 College Blvd, University City, CA 90213",
    enrollmentDate: "2020-09-01",
    studentId: "STU2020067",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.78,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Huynh Thi Mai",
      relationship: "Mother",
      phone: "+1 (555) 654-3210"
    },
    courses: [
      {
        id: "c14",
        name: "Algorithms Analysis",
        code: "CS310",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c15",
        name: "Mobile App Development",
        code: "CS370",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c16",
        name: "Cloud Computing",
        code: "CS380",
        credits: 3,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c17",
        name: "Computer Graphics",
        code: "CS390",
        credits: 4,
        grade: "B+",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 138,
      absent: 4,
      late: 6,
      totalClasses: 148
    },
    performance: [
      {
        semester: "Fall 2020",
        gpa: 3.65,
        credits: 15
      },
      {
        semester: "Spring 2021",
        gpa: 3.7,
        credits: 16
      },
      {
        semester: "Fall 2021",
        gpa: 3.75,
        credits: 15
      },
      {
        semester: "Spring 2022",
        gpa: 3.8,
        credits: 17
      },
      {
        semester: "Fall 2022",
        gpa: 3.78,
        credits: 16
      },
      {
        semester: "Spring 2023",
        gpa: 3.82,
        credits: 15
      }
    ]
  },
  {
    id: "5",
    firstName: "Vo Duong Xuan",
    lastName: "Nguyen",
    email: "vo.nguyen@university.edu",
    phone: "+1 (555) 567-8901",
    dateOfBirth: "2002-11-25",
    address: "654 Academic Way, College Town, CA 90214",
    enrollmentDate: "2020-09-01",
    studentId: "STU2020089",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.45,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Vo Thi Lan",
      relationship: "Mother",
      phone: "+1 (555) 789-0123"
    },
    courses: [
      {
        id: "c18",
        name: "Data Mining",
        code: "CS420",
        credits: 4,
        grade: "C+",
        semester: "Fall 2024"
      },
      {
        id: "c19",
        name: "Artificial Intelligence",
        code: "CS455",
        credits: 3,
        grade: "B-",
        semester: "Fall 2024"
      },
      {
        id: "c20",
        name: "Distributed Systems",
        code: "CS465",
        credits: 3,
        grade: "C",
        semester: "Fall 2024"
      },
      {
        id: "c21",
        name: "Computer Vision",
        code: "CS475",
        credits: 4,
        grade: "B",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 110,
      absent: 18,
      late: 20,
      totalClasses: 148
    },
    performance: [
      {
        semester: "Fall 2020",
        gpa: 3.2,
        credits: 14
      },
      {
        semester: "Spring 2021",
        gpa: 3.3,
        credits: 15
      },
      {
        semester: "Fall 2021",
        gpa: 3.4,
        credits: 15
      },
      {
        semester: "Spring 2022",
        gpa: 3.5,
        credits: 16
      },
      {
        semester: "Fall 2022",
        gpa: 3.45,
        credits: 15
      },
      {
        semester: "Spring 2023",
        gpa: 3.38,
        credits: 14
      }
    ]
  },
  {
    id: "6",
    firstName: "Nguyen",
    lastName: "Van Teo",
    email: "nguyen.vanteo@university.edu",
    phone: "+1 (555) 678-9012",
    dateOfBirth: "2004-01-15",
    address: "987 Engineering Dr, Campus City, CA 90215",
    enrollmentDate: "2022-09-01",
    studentId: "STU2022034",
    major: "Mechanical Engineering",
    year: "Sophomore",
    gpa: 3.92,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Nguyen Van Hai",
      relationship: "Father",
      phone: "+1 (555) 890-1234"
    },
    courses: [
      {
        id: "c22",
        name: "Thermodynamics",
        code: "ME301",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c23",
        name: "Fluid Mechanics",
        code: "ME320",
        credits: 3,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c24",
        name: "Materials Science",
        code: "ME310",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c25",
        name: "Manufacturing Processes",
        code: "ME330",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 145,
      absent: 2,
      late: 3,
      totalClasses: 150
    },
    performance: [
      {
        semester: "Fall 2022",
        gpa: 3.85,
        credits: 16
      },
      {
        semester: "Spring 2023",
        gpa: 3.9,
        credits: 17
      },
      {
        semester: "Fall 2023",
        gpa: 3.95,
        credits: 16
      },
      {
        semester: "Spring 2024",
        gpa: 3.92,
        credits: 15
      }
    ]
  },
  {
    id: "7",
    firstName: "Le",
    lastName: "Thi Be",
    email: "le.thibe@university.edu",
    phone: "+1 (555) 789-0123",
    dateOfBirth: "2003-09-30",
    address: "456 Tech Street, University City, CA 90216",
    enrollmentDate: "2021-09-01",
    studentId: "STU2021056",
    major: "Electrical Engineering",
    year: "Junior",
    gpa: 3.68,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Le Van Thanh",
      relationship: "Father",
      phone: "+1 (555) 901-2345"
    },
    courses: [
      {
        id: "c26",
        name: "Circuit Analysis",
        code: "EE301",
        credits: 4,
        grade: "B+",
        semester: "Fall 2024"
      },
      {
        id: "c27",
        name: "Digital Signal Processing",
        code: "EE320",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c28",
        name: "Power Systems",
        code: "EE310",
        credits: 3,
        grade: "B",
        semester: "Fall 2024"
      },
      {
        id: "c29",
        name: "Control Systems",
        code: "EE330",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 130,
      absent: 8,
      late: 10,
      totalClasses: 148
    },
    performance: [
      {
        semester: "Fall 2021",
        gpa: 3.5,
        credits: 15
      },
      {
        semester: "Spring 2022",
        gpa: 3.6,
        credits: 16
      },
      {
        semester: "Fall 2022",
        gpa: 3.65,
        credits: 15
      },
      {
        semester: "Spring 2023",
        gpa: 3.7,
        credits: 17
      },
      {
        semester: "Fall 2023",
        gpa: 3.68,
        credits: 16
      },
      {
        semester: "Spring 2024",
        gpa: 3.72,
        credits: 15
      }
    ]
  },
  {
    id: "8",
    firstName: "Truong",
    lastName: "Van Tuan",
    email: "truong.vantuan@university.edu",
    phone: "+1 (555) 890-1234",
    dateOfBirth: "2000-05-20",
    address: "123 Innovation Ave, College Town, CA 90217",
    enrollmentDate: "2018-09-01",
    studentId: "STU2018012",
    major: "Electrical Engineering",
    year: "Graduate",
    gpa: 3.88,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Truong Thi Hoa",
      relationship: "Mother",
      phone: "+1 (555) 012-3456"
    },
    courses: [
      {
        id: "c30",
        name: "Advanced Electronics",
        code: "EE501",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c31",
        name: "VLSI Design",
        code: "EE520",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c32",
        name: "Wireless Communications",
        code: "EE510",
        credits: 3,
        grade: "A",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 142,
      absent: 3,
      late: 4,
      totalClasses: 149
    },
    performance: [
      {
        semester: "Fall 2018",
        gpa: 3.7,
        credits: 15
      },
      {
        semester: "Spring 2019",
        gpa: 3.75,
        credits: 16
      },
      {
        semester: "Fall 2019",
        gpa: 3.8,
        credits: 15
      },
      {
        semester: "Spring 2020",
        gpa: 3.82,
        credits: 17
      },
      {
        semester: "Fall 2020",
        gpa: 3.85,
        credits: 16
      },
      {
        semester: "Spring 2021",
        gpa: 3.88,
        credits: 15
      },
      {
        semester: "Fall 2021",
        gpa: 3.9,
        credits: 14
      },
      {
        semester: "Spring 2022",
        gpa: 3.88,
        credits: 16
      }
    ]
  },
  {
    id: "9",
    firstName: "Huynh",
    lastName: "Thi Ngoc",
    email: "huynh.thingoc@university.edu",
    phone: "+1 (555) 901-2345",
    dateOfBirth: "2002-12-10",
    address: "789 Green Campus, University City, CA 90218",
    enrollmentDate: "2020-09-01",
    studentId: "STU2020078",
    major: "Environmental Science",
    year: "Junior",
    gpa: 3.62,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Huynh Van Binh",
      relationship: "Father",
      phone: "+1 (555) 123-4567"
    },
    courses: [
      {
        id: "c33",
        name: "Ecology",
        code: "ENV301",
        credits: 4,
        grade: "B+",
        semester: "Fall 2024"
      },
      {
        id: "c34",
        name: "Environmental Policy",
        code: "ENV320",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c35",
        name: "Sustainability Studies",
        code: "ENV310",
        credits: 3,
        grade: "B",
        semester: "Fall 2024"
      },
      {
        id: "c36",
        name: "Climate Change Science",
        code: "ENV330",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 128,
      absent: 9,
      late: 11,
      totalClasses: 148
    },
    performance: [
      {
        semester: "Fall 2020",
        gpa: 3.45,
        credits: 15
      },
      {
        semester: "Spring 2021",
        gpa: 3.55,
        credits: 16
      },
      {
        semester: "Fall 2021",
        gpa: 3.6,
        credits: 15
      },
      {
        semester: "Spring 2022",
        gpa: 3.65,
        credits: 17
      },
      {
        semester: "Fall 2022",
        gpa: 3.62,
        credits: 16
      },
      {
        semester: "Spring 2023",
        gpa: 3.68,
        credits: 15
      }
    ]
  }
];
