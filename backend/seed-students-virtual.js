/**
 * Seed 50 virtual students based on CSV data patterns
 * Run: node seed-students-virtual.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:1337';

// Option 1: Use API Token (recommended - get from Strapi Admin -> Settings -> API Tokens)
const API_TOKEN = 'eb45693df497a0f77642e0e4257d15ca263ed2100262a579f89b932b5cffe9856e602c478a62b6a50b6cf1dcbc1a1ef1a865e210d2a9676871ec830e8196fb54f097b8ad090022da2d9251b17854c315c8b847c2d407b9eb2f5d8521e388ce583da57aac15452830cbf1dfb02212d6840ca9b2fa47276b7695741cd3b9892ce6';

// Option 2: Use User Authentication (need to create a User in Content Manager first)
const USER_EMAIL = 'admin@gmail.com';
const USER_PASSWORD = 'example';

// Choose authentication method: 'token' or 'login'
const AUTH_METHOD = 'token'; // Change to 'token' if using API Token

// Data based on the CSV patterns
const vietnameseCities = [
  'Ho Chi Minh', 'Hanoi', 'Da Nang', 'Can Tho', 'Hai Phong',
  'Bien Hoa', 'Nha Trang', 'Hue', 'Vung Tau', 'Buon Ma Thuot'
];

const firstNames = [
  'An', 'Binh', 'Cuong', 'Dung', 'Em', 'Giang', 'Huy', 'Khanh', 'Linh', 'Minh',
  'Nam', 'Phat', 'Quang', 'Son', 'Tuan', 'Uyen', 'Van', 'Xuan', 'Yen', 'Zung'
];

const lastNames = [
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Huynh', 'Vo', 'Vu', 'Dang', 'Bui',
  'Do', 'Ngo', 'Duong', 'Ly'
];

const degrees = [
  'First year', 'Second year', 'Third year', 'Fourth year',
  'BSc', 'BE', 'B.Tech', 'B.Com', 'BBA', 'BA', 'BCA',
  'MSc', 'M.Tech', 'MBA', 'MA', 'MCA'
];

const sleepDurations = [
  'Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'
];

const dietaryHabits = [
  'Healthy', 'Moderate', 'Unhealthy'
];

const genders = ['Male', 'Female'];

// Generate random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random element from array
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random decimal between min and max
function randomDecimal(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate Vietnamese name
function generateName() {
  const lastName = randomElement(lastNames);
  const middleName = randomElement(['Van', 'Thi', 'Minh', 'Hoang', 'Thanh', 'Anh', 'Kim', 'Ngoc']);
  const firstName = randomElement(firstNames);
  return `${lastName} ${middleName} ${firstName}`;
}

// Generate students
function generateStudents(count) {
  const students = [];
  
  for (let i = 0; i < count; i++) {
    const age = randomInt(18, 34);
    const gender = randomElement(genders);
    const cgpa = randomDecimal(5.0, 10.0);
    const academicPressure = randomInt(1, 5);
    const studySatisfaction = randomInt(1, 5);
    const workStudyHours = randomInt(0, 12);
    const financialStress = randomInt(1, 5);
    
    // Calculate depression risk based on factors (simple heuristic)
    let depressionScore = 0;
    if (academicPressure >= 4) depressionScore += 0.2;
    if (studySatisfaction <= 2) depressionScore += 0.2;
    if (workStudyHours >= 10) depressionScore += 0.15;
    if (financialStress >= 4) depressionScore += 0.2;
    if (sleepDurations[i % sleepDurations.length] === 'Less than 5 hours') depressionScore += 0.15;
    if (cgpa < 6.0) depressionScore += 0.1;
    
    const depression = depressionScore >= 0.5 ? 1 : 0;
    
    const student = {
      name: generateName(),
      gender: gender,
      age: age,
      city: randomElement(vietnameseCities),
      academic_pressure: academicPressure,
      cgpa: cgpa,
      study_satisfaction: studySatisfaction,
      sleep_duration: randomElement(sleepDurations),
      dietary_habits: randomElement(dietaryHabits),
      degree: randomElement(degrees),
      work_study_hours: workStudyHours,
      financial_stress: financialStress,
      family_his_of_mental_illness: randomElement(['Yes', 'No']),
      depression_truth: depression,
      depression_predicting: null, // Will be filled by ML model
      validated: false
    };
    
    students.push(student);
  }
  
  return students;
}

async function seedStudents() {
  try {
    let jwt;
    
    if (AUTH_METHOD === 'token') {
      console.log('🔐 Using API Token authentication...');
      if (API_TOKEN === 'YOUR_API_TOKEN_HERE') {
        console.error('❌ Please set your API_TOKEN in the script!');
        console.error('📝 Get it from: Strapi Admin -> Settings -> API Tokens -> Create new');
        process.exit(1);
      }
      jwt = API_TOKEN;
      console.log('✅ API Token configured!');
    } else {
      console.log('🔐 Logging in with user credentials...');
      console.log('📧 Email:', USER_EMAIL);
      
      try {
        // Login to get JWT token
        const loginResponse = await axios.post(`${API_URL}/api/auth/local`, {
          identifier: USER_EMAIL,
          password: USER_PASSWORD
        });

        jwt = loginResponse.data.jwt;
        console.log('✅ Login successful!');
      } catch (error) {
        console.error('❌ Login failed!');
        console.error('\n⚠️  Common issues:');
        console.error('1. You need a USER account (not Admin account)');
        console.error('2. Create User: Strapi Admin -> Content Manager -> User -> Create New');
        console.error('3. Set: confirmed=true, blocked=false, role=Authenticated');
        console.error('4. Or use API Token instead (set AUTH_METHOD to "token")');
        throw error;
      }
    }

    // Generate 50 virtual students
    const students = generateStudents(50);
    console.log(`\n📝 Generated ${students.length} virtual students`);

    // Create students
    console.log('\n📝 Creating students in database...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
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
        successCount++;
        console.log(`✅ [${i + 1}/${students.length}] Created: ${student.name} (Age: ${student.age}, CGPA: ${student.cgpa}, Depression: ${student.depression_truth})`);
      } catch (error) {
        if (error.response?.status === 400) {
          skipCount++;
          console.log(`⚠️  [${i + 1}/${students.length}] Skipped: ${student.name} (already exists)`);
        } else {
          errorCount++;
          console.error(`❌ [${i + 1}/${students.length}] Failed: ${student.name}:`, error.response?.data?.error?.message || error.message);
        }
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total generated: ${students.length}`);
    console.log(`   - Successfully created: ${successCount}`);
    console.log(`   - Skipped (duplicates): ${skipCount}`);
    console.log(`   - Errors: ${errorCount}`);
    console.log('='.repeat(60));
    
    // Statistics
    const depressionCount = students.filter(s => s.depression_truth === 1).length;
    const noDepressionCount = students.filter(s => s.depression_truth === 0).length;
    console.log(`\n📈 Depression Statistics:`);
    console.log(`   - With depression risk: ${depressionCount} (${(depressionCount/students.length*100).toFixed(1)}%)`);
    console.log(`   - Without depression risk: ${noDepressionCount} (${(noDepressionCount/students.length*100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.response?.data?.error || error.message);
    if (error.response?.status === 401) {
      console.error('\n⚠️  Authentication failed. Please check:');
      console.error('   1. Backend server is running (npm run dev)');
      console.error('   2. Admin email and password are correct');
      console.error('   3. Admin account exists in the system');
    }
    process.exit(1);
  }
}

// Run the seed
seedStudents();
