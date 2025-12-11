/**
 * Seed students data
 */

module.exports = {
  async up(db) {
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
        riskScore: 0.2,
        lastAssessment: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
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
        riskScore: 0.45,
        lastAssessment: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
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
        riskScore: 0.75,
        lastAssessment: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
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
        riskScore: 0.15,
        lastAssessment: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
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
        riskScore: 0.55,
        lastAssessment: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      }
    ];

    await db.query('INSERT INTO students (studentId, name, email, phone, dateOfBirth, address, enrollmentDate, major, department, year, gpa, status, riskLevel, stressLevel, sleepHours, riskScore, lastAssessment, createdAt, updatedAt, publishedAt) VALUES ?', 
      [students.map(s => [
        s.studentId, s.name, s.email, s.phone, s.dateOfBirth, s.address, 
        s.enrollmentDate, s.major, s.department, s.year, s.gpa, s.status, 
        s.riskLevel, s.stressLevel, s.sleepHours, s.riskScore, s.lastAssessment,
        s.createdAt, s.updatedAt, s.publishedAt
      ])]
    );
  },

  async down(db) {
    await db.query('DELETE FROM students WHERE studentId IN ("2211001", "2211002", "2211003", "2211004", "2211005")');
  }
};
