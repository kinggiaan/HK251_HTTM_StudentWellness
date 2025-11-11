import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      email: 'admin@university.edu',
      password: await hashPassword('password123'),
      role: 'admin',
      fullName: 'System Administrator'
    }
  });
  console.log('✅ Created admin user:', admin.email);

  // Create consultant user
  const consultant = await prisma.user.upsert({
    where: { email: 'consultant@university.edu' },
    update: {},
    create: {
      email: 'consultant@university.edu',
      password: await hashPassword('password123'),
      role: 'consultant',
      fullName: 'Dr. Sarah Johnson'
    }
  });
  console.log('✅ Created consultant user:', consultant.email);

  // Create teacher/supervisor user
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@university.edu' },
    update: {},
    create: {
      email: 'teacher@university.edu',
      password: await hashPassword('password123'),
      role: 'teacher_supervisor',
      fullName: 'Prof. John Smith'
    }
  });
  console.log('✅ Created teacher/supervisor user:', teacher.email);

  // Create data scientist user
  const dataScientist = await prisma.user.upsert({
    where: { email: 'datascientist@university.edu' },
    update: {},
    create: {
      email: 'datascientist@university.edu',
      password: await hashPassword('password123'),
      role: 'data_scientist',
      fullName: 'Dr. Emily Chen'
    }
  });
  console.log('✅ Created data scientist user:', dataScientist.email);

  // Create sample students
  const students = await Promise.all([
    prisma.student.upsert({
      where: { studentId: 'SV001' },
      update: {},
      create: {
        studentId: 'SV001',
        name: 'Nguyen Van A',
        email: 'nguyenvana@student.edu',
        phone: '+84123456789',
        department: 'Computer Science',
        year: 3,
        stressLevel: 7,
        sleepHours: 6,
        riskScore: 75,
        riskLevel: 'high',
        status: 'active',
        consultantId: consultant.id
      }
    }),
    prisma.student.upsert({
      where: { studentId: 'SV002' },
      update: {},
      create: {
        studentId: 'SV002',
        name: 'Tran Thi B',
        email: 'tranthib@student.edu',
        phone: '+84987654321',
        department: 'Psychology',
        year: 2,
        stressLevel: 4,
        sleepHours: 8,
        riskScore: 35,
        riskLevel: 'low',
        status: 'active',
        consultantId: consultant.id
      }
    }),
    prisma.student.upsert({
      where: { studentId: 'SV003' },
      update: {},
      create: {
        studentId: 'SV003',
        name: 'Le Van C',
        email: 'levanc@student.edu',
        department: 'Engineering',
        year: 4,
        stressLevel: 9,
        sleepHours: 5,
        riskScore: 85,
        riskLevel: 'critical',
        status: 'active',
        consultantId: consultant.id
      }
    })
  ]);

  console.log(`✅ Created ${students.length} sample students`);

  // Create sample mental health records
  const student1 = students[0];
  if (student1) {
    await prisma.mentalHealthRecord.createMany({
      data: [
        {
          studentId: student1.id,
          stressLevel: 7,
          anxietyLevel: 6,
          depressionLevel: 5,
          sleepHours: 6,
          sleepQuality: 4,
          riskScore: 75,
          riskLevel: 'high',
          assessmentDate: new Date(),
          assessmentType: 'consultant',
          notes: 'Student reported increased academic pressure'
        },
        {
          studentId: student1.id,
          stressLevel: 6,
          anxietyLevel: 5,
          depressionLevel: 4,
          sleepHours: 7,
          sleepQuality: 5,
          riskScore: 65,
          riskLevel: 'medium',
          assessmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          assessmentType: 'self'
        }
      ]
    });
    console.log('✅ Created sample mental health records');
  }

  // Create sample counseling sessions
  if (student1) {
    await prisma.counselingSession.create({
      data: {
        studentId: student1.id,
        consultantId: consultant.id,
        sessionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 60,
        sessionType: 'individual',
        status: 'scheduled',
        topic: 'Stress management',
        notes: 'Initial consultation scheduled',
        followUpRequired: true
      }
    });
    console.log('✅ Created sample counseling session');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


