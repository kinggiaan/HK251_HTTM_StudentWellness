export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  studentId: string;
  major: string;
  year: string;
  gpa: number;
  status: "active" | "inactive" | "graduated" | "suspended";
  avatar?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  courses: Array<{
    id: string;
    name: string;
    code: string;
    credits: number;
    grade: string;
    semester: string;
  }>;
  attendance: {
    present: number;
    absent: number;
    late: number;
    totalClasses: number;
  };
  performance: Array<{
    semester: string;
    gpa: number;
    credits: number;
  }>;
}

export const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "2003-05-15",
    address: "123 Campus Drive, University City, CA 90210",
    enrollmentDate: "2021-09-01",
    studentId: "STU2021001",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.85,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Father",
      phone: "+1 (555) 987-6543"
    },
    courses: [
      {
        id: "c1",
        name: "Data Structures and Algorithms",
        code: "CS301",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c2",
        name: "Database Systems",
        code: "CS320",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c3",
        name: "Web Development",
        code: "CS350",
        credits: 3,
        grade: "B+",
        semester: "Fall 2024"
      },
      {
        id: "c4",
        name: "Operating Systems",
        code: "CS410",
        credits: 4,
        grade: "A",
        semester: "Fall 2024"
      },
      {
        id: "c5",
        name: "Software Engineering",
        code: "CS405",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 142,
      absent: 5,
      late: 8,
      totalClasses: 155
    },
    performance: [
      {
        semester: "Fall 2021",
        gpa: 3.6,
        credits: 15
      },
      {
        semester: "Spring 2022",
        gpa: 3.75,
        credits: 16
      },
      {
        semester: "Fall 2022",
        gpa: 3.8,
        credits: 15
      },
      {
        semester: "Spring 2023",
        gpa: 3.85,
        credits: 17
      },
      {
        semester: "Fall 2023",
        gpa: 3.9,
        credits: 16
      },
      {
        semester: "Spring 2024",
        gpa: 3.88,
        credits: 15
      }
    ]
  },
  {
    id: "2",
    firstName: "Marcus",
    lastName: "Chen",
    email: "marcus.chen@university.edu",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "2002-08-22",
    address: "456 University Ave, College Town, CA 90211",
    enrollmentDate: "2020-09-01",
    studentId: "STU2020045",
    major: "Business Administration",
    year: "Senior",
    gpa: 3.65,
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    emergencyContact: {
      name: "Lisa Chen",
      relationship: "Mother",
      phone: "+1 (555) 876-5432"
    },
    courses: [
      {
        id: "c6",
        name: "Strategic Management",
        code: "BA401",
        credits: 3,
        grade: "B+",
        semester: "Fall 2024"
      },
      {
        id: "c7",
        name: "Marketing Analytics",
        code: "BA350",
        credits: 3,
        grade: "A-",
        semester: "Fall 2024"
      },
      {
        id: "c8",
        name: "Financial Management",
        code: "BA320",
        credits: 4,
        grade: "B",
        semester: "Fall 2024"
      },
      {
        id: "c9",
        name: "International Business",
        code: "BA415",
        credits: 3,
        grade: "A",
        semester: "Fall 2024"
      }
    ],
    attendance: {
      present: 118,
      absent: 8,
      late: 12,
      totalClasses: 138
    },
    performance: [
      {
        semester: "Fall 2020",
        gpa: 3.4,
        credits: 14
      },
      {
        semester: "Spring 2021",
        gpa: 3.55,
        credits: 15
      },
      {
        semester: "Fall 2021",
        gpa: 3.6,
        credits: 16
      },
      {
        semester: "Spring 2022",
        gpa: 3.7,
        credits: 15
      },
      {
        semester: "Fall 2022",
        gpa: 3.68,
        credits: 16
      },
      {
        semester: "Spring 2023",
        gpa: 3.72,
        credits: 15
      },
      {
        semester: "Fall 2023",
        gpa: 3.65,
        credits: 13
      }
    ]
  }
];
