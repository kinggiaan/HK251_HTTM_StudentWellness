/**
 * Seed students via Strapi API
 * Run: node seed-students.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@example.com'; // Change to your admin email
const ADMIN_PASSWORD = 'Admin123!'; // Change to your admin password

const students = [
  {
    studentId: "2211001",
    name: "Nguyen Van An",
    email: "nguyenvanan@student.hcmut.edu.vn",
    phone: "0901234567",
    dateOfBirth: "2004-05-15",
    address: "123 Ly Thuong Kiet, District 10, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Computer Science",
    department: "Computer Science",
    year: 3,
    gpa: 3.5,
    status: "active",
    riskLevel: "low",
    stressLevel: 3,
    sleepHours: 7,
    riskScore: 0.2
  },
  {
    studentId: "2211002",
    name: "Tran Thi Binh",
    email: "tranthibinh@student.hcmut.edu.vn",
    phone: "0902345678",
    dateOfBirth: "2004-08-22",
    address: "456 Nguyen Thi Minh Khai, District 3, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Computer Science",
    department: "Computer Science",
    year: 3,
    gpa: 3.8,
    status: "active",
    riskLevel: "medium",
    stressLevel: 5,
    sleepHours: 6,
    riskScore: 0.45
  },
  {
    studentId: "2211003",
    name: "Le Van Cuong",
    email: "levancuong@student.hcmut.edu.vn",
    phone: "0903456789",
    dateOfBirth: "2004-03-10",
    address: "789 Vo Van Tan, District 3, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Electrical Engineering",
    department: "Electrical Engineering",
    year: 3,
    gpa: 3.2,
    status: "active",
    riskLevel: "high",
    stressLevel: 7,
    sleepHours: 5,
    riskScore: 0.75
  },
  {
    studentId: "2211004",
    name: "Pham Thi Duyen",
    email: "phamthiduyen@student.hcmut.edu.vn",
    phone: "0904567890",
    dateOfBirth: "2004-11-05",
    address: "321 Le Duan, District 1, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Mechanical Engineering",
    department: "Mechanical Engineering",
    year: 3,
    gpa: 3.6,
    status: "active",
    riskLevel: "low",
    stressLevel: 2,
    sleepHours: 8,
    riskScore: 0.15
  },
  {
    studentId: "2211005",
    name: "Hoang Van Ey",
    email: "hoangvaney@student.hcmut.edu.vn",
    phone: "0905678901",
    dateOfBirth: "2004-07-18",
    address: "654 Tran Hung Dao, District 5, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Civil Engineering",
    department: "Civil Engineering",
    year: 3,
    gpa: 3.4,
    status: "active",
    riskLevel: "medium",
    stressLevel: 6,
    sleepHours: 6,
    riskScore: 0.55
  },
  {
    studentId: "2211006",
    name: "Do Thi Giang",
    email: "dothigiang@student.hcmut.edu.vn",
    phone: "0906789012",
    dateOfBirth: "2004-09-25",
    address: "987 Hai Ba Trung, District 1, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Chemical Engineering",
    department: "Chemical Engineering",
    year: 3,
    gpa: 3.7,
    status: "active",
    riskLevel: "low",
    stressLevel: 3,
    sleepHours: 7,
    riskScore: 0.25
  },
  {
    studentId: "2211007",
    name: "Vo Van Hai",
    email: "vovanhai@student.hcmut.edu.vn",
    phone: "0907890123",
    dateOfBirth: "2004-04-12",
    address: "246 Cach Mang Thang 8, District 10, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Computer Science",
    department: "Computer Science",
    year: 3,
    gpa: 3.3,
    status: "active",
    riskLevel: "medium",
    stressLevel: 5,
    sleepHours: 6,
    riskScore: 0.5
  },
  {
    studentId: "2211008",
    name: "Nguyen Thi Ivy",
    email: "nguyenthiivy@student.hcmut.edu.vn",
    phone: "0908901234",
    dateOfBirth: "2004-06-30",
    address: "135 Dien Bien Phu, District Binh Thanh, HCMC",
    enrollmentDate: "2022-09-01",
    major: "Industrial Engineering",
    department: "Industrial Engineering",
    year: 3,
    gpa: 3.9,
    status: "active",
    riskLevel: "low",
    stressLevel: 2,
    sleepHours: 8,
    riskScore: 0.1
  }
];

async function seedStudents() {
  try {
    console.log('🔐 Logging in as admin...');
    
    // Login to get JWT token
    const loginResponse = await axios.post(`${API_URL}/api/auth/local`, {
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const jwt = loginResponse.data.jwt;
    console.log('✅ Login successful!');

    // Create students
    console.log('\n📝 Creating students...');
    for (const student of students) {
      try {
        const response = await axios.post(
          `${API_URL}/api/students`,
          { data: student },
          {
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`✅ Created student: ${student.name} (${student.studentId})`);
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`⚠️  Student ${student.studentId} already exists, skipping...`);
        } else {
          console.error(`❌ Failed to create student ${student.studentId}:`, error.response?.data?.error || error.message);
        }
      }
    }

    console.log('\n✅ Seeding completed!');
    console.log(`📊 Total students: ${students.length}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.response?.data?.error || error.message);
    process.exit(1);
  }
}

// Run the seed
seedStudents();
