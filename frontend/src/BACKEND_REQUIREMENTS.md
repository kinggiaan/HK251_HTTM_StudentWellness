# Backend Requirements - Student Mental Health Dashboard

## 1. Tổng Quan Hệ Thống

### 1.1 Mô Tả Dự Án
Dashboard quản lý và theo dõi sức khỏe tâm thần sinh viên với 3 vai trò người dùng khác nhau:
- **Consultant**: Tư vấn viên - quản lý buổi tư vấn và theo dõi sinh viên
- **Teacher/Supervisor**: Giáo viên/Giám sát - xem tổng quan và phân tích xu hướng
- **Data Scientist**: Nhà khoa học dữ liệu - quản lý model ML, dataset và phân tích

### 1.2 Tech Stack Hiện Tại (Frontend)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Mock data trong `/data` folder

---

## 2. Vai Trò Người Dùng & Quyền Truy Cập

### 2.1 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| **Consultant** | - Xem danh sách sinh viên<br>- Xem chi tiết sinh viên<br>- Thêm/Sửa/Xóa sinh viên<br>- Quản lý buổi tư vấn<br>- Nhận thông báo sinh viên có risk cao<br>- Xuất báo cáo sinh viên |
| **Teacher/Supervisor** | - Xem dashboard tổng quan<br>- Xem thống kê và analytics<br>- Xem danh sách sinh viên (read-only)<br>- Xem chi tiết sinh viên (read-only)<br>- Nhận thông báo xu hướng và alerts |
| **Data Scientist** | - Quản lý ML models<br>- Upload/Export datasets<br>- Xem model metrics<br>- Configure model parameters<br>- Xem feature correlations<br>- Train/Deploy models |

---

## 3. Data Models

### 3.1 User Model
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  role: 'consultant' | 'teacher_supervisor' | 'data_scientist';
  fullName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

### 3.2 Student Model
```typescript
interface Student {
  id: string;
  studentId: string; // Mã sinh viên (e.g., "SV001")
  name: string;
  email: string;
  phone?: string;
  department?: string;
  year?: number;
  avatar?: string;
  
  // Mental Health Metrics
  stressLevel: number; // 1-10
  sleepHours: number; // hours per day
  riskScore: number; // 0-100
  
  // Status
  status: 'active' | 'inactive' | 'graduated';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Relationships
  consultantId?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastAssessment?: Date;
}
```

### 3.3 Mental Health Record Model
```typescript
interface MentalHealthRecord {
  id: string;
  studentId: string;
  
  // Assessment Data
  stressLevel: number;
  anxietyLevel: number;
  depressionLevel: number;
  sleepHours: number;
  sleepQuality: number; // 1-10
  
  // Calculated Metrics
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Context
  assessmentDate: Date;
  assessmentType: 'self' | 'consultant' | 'automated';
  notes?: string;
  
  // ML Predictions (if available)
  predictedRisk?: number;
  modelVersion?: string;
  
  createdAt: Date;
}
```

### 3.4 Counseling Session Model
```typescript
interface CounselingSession {
  id: string;
  studentId: string;
  consultantId: string;
  
  // Session Info
  sessionDate: Date;
  duration: number; // minutes
  sessionType: 'individual' | 'group' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  
  // Session Details
  topic?: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  
  // Assessment
  preSessioStress?: number;
  postSessionStress?: number;
  sessionOutcome?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.5 Notification Model
```typescript
interface Notification {
  id: string;
  userId: string;
  
  // Notification Content
  type: 'alert' | 'info' | 'warning' | 'success';
  category: 'student_risk' | 'session_reminder' | 'system' | 'model' | 'trend';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Related Entities
  relatedStudentId?: string;
  relatedSessionId?: string;
  
  // Status
  read: boolean;
  dismissed: boolean;
  
  createdAt: Date;
  readAt?: Date;
}
```

### 3.6 ML Model Configuration
```typescript
interface MLModelConfig {
  id: string;
  modelName: string;
  modelType: 'classification' | 'regression' | 'clustering';
  version: string;
  
  // Configuration
  algorithm: string; // e.g., "Random Forest", "SVM", "Neural Network"
  hyperparameters: Record<string, any>;
  features: string[];
  targetVariable: string;
  
  // Performance Metrics
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  
  // Dataset Info
  trainingDatasetId?: string;
  trainingSamples: number;
  testingSamples: number;
  
  // Status
  status: 'training' | 'trained' | 'deployed' | 'archived';
  isActive: boolean;
  
  // Metadata
  trainedBy: string; // userId
  trainedAt?: Date;
  deployedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.7 Dataset Model
```typescript
interface Dataset {
  id: string;
  name: string;
  description?: string;
  
  // Dataset Info
  fileUrl: string; // S3 or file storage URL
  fileName: string;
  fileSize: number; // bytes
  format: 'csv' | 'json' | 'excel';
  
  // Statistics
  totalSamples: number;
  features: string[];
  targetVariable?: string;
  
  // Data Quality
  completeness: number; // percentage
  missingValues: number; // percentage
  dataBalance: number; // percentage
  
  // Split Info
  trainingSplit: number; // percentage
  testingSplit: number; // percentage
  
  // Metadata
  uploadedBy: string; // userId
  uploadedAt: Date;
  lastUsedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. API Endpoints Specification

### 4.1 Authentication & Authorization

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "consultant@university.edu",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "consultant@university.edu",
      "role": "consultant",
      "fullName": "Dr. Sarah Johnson"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

#### POST `/api/auth/logout`
#### POST `/api/auth/refresh`
#### POST `/api/auth/change-password`

---

### 4.2 Student Management

#### GET `/api/students`
**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (tìm theo tên, mã SV)
- `riskLevel`: 'low' | 'medium' | 'high' | 'critical'
- `sortBy`: 'name' | 'riskScore' | 'lastAssessment'
- `order`: 'asc' | 'desc'

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "student-1",
        "studentId": "SV001",
        "name": "Nguyen Van A",
        "email": "nguyenvana@student.edu",
        "stressLevel": 7,
        "sleepHours": 6,
        "riskScore": 75,
        "riskLevel": "high",
        "lastAssessment": "2025-11-09T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

#### GET `/api/students/:id`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "student-1",
    "studentId": "SV001",
    "name": "Nguyen Van A",
    "email": "nguyenvana@student.edu",
    "phone": "+84123456789",
    "department": "Computer Science",
    "year": 3,
    "stressLevel": 7,
    "sleepHours": 6,
    "riskScore": 75,
    "riskLevel": "high",
    "status": "active",
    "consultant": {
      "id": "user-123",
      "fullName": "Dr. Sarah Johnson"
    },
    "recentRecords": [...],
    "upcomingSessions": [...],
    "createdAt": "2024-01-15T00:00:00Z",
    "lastAssessment": "2025-11-09T10:00:00Z"
  }
}
```

#### POST `/api/students`
**Request:**
```json
{
  "studentId": "SV150",
  "name": "Tran Thi B",
  "email": "tranthib@student.edu",
  "phone": "+84987654321",
  "department": "Psychology",
  "year": 2,
  "consultantId": "user-123"
}
```

#### PUT `/api/students/:id`
#### DELETE `/api/students/:id`

---

### 4.3 Mental Health Records

#### GET `/api/students/:studentId/health-records`
**Query Parameters:**
- `from`: Date (start date)
- `to`: Date (end date)
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "record-1",
      "studentId": "student-1",
      "stressLevel": 7,
      "anxietyLevel": 6,
      "depressionLevel": 5,
      "sleepHours": 6,
      "sleepQuality": 4,
      "riskScore": 75,
      "riskLevel": "high",
      "assessmentDate": "2025-11-09T10:00:00Z",
      "assessmentType": "consultant"
    }
  ]
}
```

#### POST `/api/students/:studentId/health-records`
**Request:**
```json
{
  "stressLevel": 7,
  "anxietyLevel": 6,
  "depressionLevel": 5,
  "sleepHours": 6,
  "sleepQuality": 4,
  "assessmentType": "consultant",
  "notes": "Student reported increased academic pressure"
}
```

---

### 4.4 Counseling Sessions

#### GET `/api/sessions`
**Query Parameters:**
- `studentId`: string
- `consultantId`: string
- `status`: 'scheduled' | 'completed' | 'cancelled'
- `from`: Date
- `to`: Date

#### POST `/api/sessions`
**Request:**
```json
{
  "studentId": "student-1",
  "consultantId": "user-123",
  "sessionDate": "2025-11-15T14:00:00Z",
  "duration": 60,
  "sessionType": "individual",
  "topic": "Stress management",
  "notes": "Initial consultation"
}
```

#### PUT `/api/sessions/:id`
#### DELETE `/api/sessions/:id`

---

### 4.5 Analytics & Statistics

#### GET `/api/analytics/overview`
**For Consultant Dashboard:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "highRiskStudents": 23,
    "scheduledSessions": 12,
    "completedSessionsThisWeek": 8,
    "averageStressLevel": 6.2,
    "trends": {
      "stressLevelChange": -5.2, // percentage
      "highRiskChange": 12.5
    }
  }
}
```

#### GET `/api/analytics/students/distribution`
**Response:**
```json
{
  "success": true,
  "data": {
    "byRiskLevel": {
      "low": 45,
      "medium": 62,
      "high": 30,
      "critical": 13
    },
    "byDepartment": {
      "Computer Science": 45,
      "Psychology": 32,
      "Engineering": 50,
      "Business": 23
    }
  }
}
```

#### GET `/api/analytics/trends`
**Query Parameters:**
- `metric`: 'stress' | 'anxiety' | 'depression' | 'sleep'
- `period`: '7d' | '30d' | '90d' | '1y'
- `groupBy`: 'day' | 'week' | 'month'

**Response:**
```json
{
  "success": true,
  "data": {
    "metric": "stress",
    "period": "30d",
    "dataPoints": [
      {
        "date": "2025-10-10",
        "average": 6.5,
        "min": 3,
        "max": 9,
        "samples": 120
      }
    ]
  }
}
```

---

### 4.6 Notifications

#### GET `/api/notifications`
**Query Parameters:**
- `read`: boolean
- `category`: string
- `limit`: number

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-1",
      "type": "alert",
      "category": "student_risk",
      "title": "High Risk Alert",
      "message": "Student SV001 has been flagged as high risk",
      "priority": "urgent",
      "relatedStudentId": "student-1",
      "read": false,
      "createdAt": "2025-11-10T09:30:00Z"
    }
  ]
}
```

#### PUT `/api/notifications/:id/read`
#### PUT `/api/notifications/:id/dismiss`
#### DELETE `/api/notifications/:id`

---

### 4.7 ML Model Management (Data Scientist)

#### GET `/api/ml/models`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "model-1",
      "modelName": "Mental Health Risk Predictor",
      "version": "v2.1.0",
      "algorithm": "Random Forest",
      "accuracy": 0.89,
      "precision": 0.87,
      "recall": 0.91,
      "f1Score": 0.89,
      "status": "deployed",
      "isActive": true,
      "trainedAt": "2025-11-01T00:00:00Z",
      "features": ["stressLevel", "sleepHours", "anxietyLevel", "depressionLevel"]
    }
  ]
}
```

#### POST `/api/ml/models`
**Request:**
```json
{
  "modelName": "New Risk Model",
  "algorithm": "SVM",
  "hyperparameters": {
    "kernel": "rbf",
    "C": 1.0,
    "gamma": "scale"
  },
  "features": ["stressLevel", "sleepHours", "anxietyLevel"],
  "targetVariable": "riskLevel"
}
```

#### POST `/api/ml/models/:id/train`
**Request:**
```json
{
  "datasetId": "dataset-1",
  "trainTestSplit": 0.8
}
```

#### POST `/api/ml/models/:id/deploy`
#### PUT `/api/ml/models/:id`
#### DELETE `/api/ml/models/:id`

---

### 4.8 Dataset Management

#### GET `/api/ml/datasets`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dataset-1",
      "name": "Student Mental Health Data Q4 2025",
      "fileName": "mental_health_q4_2025.csv",
      "fileSize": 2048576,
      "format": "csv",
      "totalSamples": 1500,
      "features": ["stress", "anxiety", "sleep_hours", "risk_score"],
      "completeness": 98.5,
      "missingValues": 1.5,
      "dataBalance": 85,
      "uploadedAt": "2025-11-01T10:00:00Z"
    }
  ]
}
```

#### POST `/api/ml/datasets/upload`
**Request:** `multipart/form-data`
```
file: CSV file
name: "Dataset name"
description: "Optional description"
```

#### GET `/api/ml/datasets/:id/preview`
**Response:**
```json
{
  "success": true,
  "data": {
    "headers": ["stress", "anxiety", "sleep_hours", "risk_score"],
    "rows": [
      [7, 6, 6, 75],
      [5, 4, 7, 45]
    ],
    "totalRows": 1500
  }
}
```

#### GET `/api/ml/datasets/:id/statistics`
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSamples": 1500,
      "features": 8,
      "completeness": 98.5
    },
    "featureStats": {
      "stress": {
        "mean": 6.2,
        "std": 1.8,
        "min": 1,
        "max": 10,
        "missing": 12
      }
    },
    "correlationMatrix": [[1.0, 0.45, -0.32], ...]
  }
}
```

#### DELETE `/api/ml/datasets/:id`

---

## 5. Database Schema (PostgreSQL)

### 5.1 Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('consultant', 'teacher_supervisor', 'data_scientist')),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(100),
  year INTEGER,
  avatar_url TEXT,
  
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  sleep_hours DECIMAL(4,2),
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  
  consultant_id UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_assessment TIMESTAMP
);

-- Mental health records table
CREATE TABLE mental_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
  depression_level INTEGER CHECK (depression_level BETWEEN 1 AND 10),
  sleep_hours DECIMAL(4,2),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  
  assessment_date TIMESTAMP NOT NULL,
  assessment_type VARCHAR(20) CHECK (assessment_type IN ('self', 'consultant', 'automated')),
  notes TEXT,
  
  predicted_risk INTEGER,
  model_version VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Counseling sessions table
CREATE TABLE counseling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES users(id),
  
  session_date TIMESTAMP NOT NULL,
  duration INTEGER, -- minutes
  session_type VARCHAR(20) CHECK (session_type IN ('individual', 'group', 'emergency')),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  
  topic VARCHAR(255),
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP,
  
  pre_session_stress INTEGER,
  post_session_stress INTEGER,
  session_outcome TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(20) CHECK (type IN ('alert', 'info', 'warning', 'success')),
  category VARCHAR(50) CHECK (category IN ('student_risk', 'session_reminder', 'system', 'model', 'trend')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  related_student_id UUID REFERENCES students(id),
  related_session_id UUID REFERENCES counseling_sessions(id),
  
  read BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

-- ML models table
CREATE TABLE ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name VARCHAR(255) NOT NULL,
  model_type VARCHAR(50) CHECK (model_type IN ('classification', 'regression', 'clustering')),
  version VARCHAR(50) NOT NULL,
  
  algorithm VARCHAR(100) NOT NULL,
  hyperparameters JSONB,
  features JSONB,
  target_variable VARCHAR(100),
  
  accuracy DECIMAL(5,4),
  precision DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  
  training_dataset_id UUID REFERENCES datasets(id),
  training_samples INTEGER,
  testing_samples INTEGER,
  
  status VARCHAR(20) CHECK (status IN ('training', 'trained', 'deployed', 'archived')),
  is_active BOOLEAN DEFAULT false,
  
  trained_by UUID REFERENCES users(id),
  trained_at TIMESTAMP,
  deployed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datasets table
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  format VARCHAR(20) CHECK (format IN ('csv', 'json', 'excel')),
  
  total_samples INTEGER,
  features JSONB,
  target_variable VARCHAR(100),
  
  completeness DECIMAL(5,2),
  missing_values DECIMAL(5,2),
  data_balance DECIMAL(5,2),
  
  training_split DECIMAL(5,2),
  testing_split DECIMAL(5,2),
  
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_students_consultant ON students(consultant_id);
CREATE INDEX idx_students_risk_level ON students(risk_level);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_health_records_student ON mental_health_records(student_id);
CREATE INDEX idx_health_records_date ON mental_health_records(assessment_date);
CREATE INDEX idx_sessions_student ON counseling_sessions(student_id);
CREATE INDEX idx_sessions_consultant ON counseling_sessions(consultant_id);
CREATE INDEX idx_sessions_date ON counseling_sessions(session_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_ml_models_active ON ml_models(is_active);
```

---

## 6. Real-time Features (WebSocket)

### 6.1 WebSocket Events

**Client → Server:**
```javascript
// Subscribe to notifications
socket.emit('subscribe:notifications', { userId: 'user-123' });

// Subscribe to student updates
socket.emit('subscribe:student', { studentId: 'student-1' });
```

**Server → Client:**
```javascript
// New notification
socket.on('notification:new', (notification) => {
  // Handle new notification
});

// Student risk level changed
socket.on('student:risk_updated', (data) => {
  // { studentId, oldRiskLevel, newRiskLevel, riskScore }
});

// Model training completed
socket.on('model:training_complete', (data) => {
  // { modelId, status, accuracy, ... }
});
```

---

## 7. File Storage

### 7.1 S3 Bucket Structure
```
/avatars
  /users
    - user-123.jpg
  /students
    - student-1.jpg

/datasets
  /uploads
    - dataset-123.csv
  /processed
    - dataset-123-processed.csv

/models
  /artifacts
    - model-v1.pkl
    - model-v2.pkl
  /checkpoints
    - model-checkpoint-epoch-10.pkl

/exports
  /reports
    - student-report-2025-11.pdf
  /data
    - export-2025-11-10.csv
```

---

## 8. Security Considerations

### 8.1 Authentication
- JWT tokens với expiry 24 giờ
- Refresh tokens với expiry 7 ngày
- Password hashing với bcrypt (cost factor 12)
- Rate limiting cho login attempts

### 8.2 Authorization
- Role-based access control (RBAC)
- API endpoint protection theo role
- Resource-level permissions (consultant chỉ xem students của mình)

### 8.3 Data Protection
- HTTPS only
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Input validation & sanitization
- Sensitive data encryption at rest

### 8.4 Privacy & GDPR Compliance
- Student data anonymization cho research
- Data retention policies
- Right to be forgotten implementation
- Audit logs cho data access
- Consent management

---

## 9. Performance Optimization

### 9.1 Database
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas cho analytics queries

### 9.2 Caching
- Redis cho:
  - Session management
  - Frequently accessed data
  - Analytics aggregations
  - ML model predictions cache

### 9.3 API
- Pagination cho large datasets
- Field filtering (GraphQL style)
- Compression (gzip)
- CDN cho static assets

---

## 10. Monitoring & Logging

### 10.1 Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic / DataDog)
- API response times
- Database query performance

### 10.2 Logging
```typescript
// Log structure
{
  timestamp: '2025-11-10T10:30:00Z',
  level: 'info' | 'warn' | 'error',
  service: 'api',
  userId: 'user-123',
  action: 'student.create',
  resource: 'student-1',
  ip: '192.168.1.1',
  userAgent: '...',
  duration: 120, // ms
  success: true,
  error?: { message, stack }
}
```

### 10.3 Metrics to Track
- API request count & latency
- Error rates by endpoint
- Active users
- Database connection pool usage
- ML model prediction latency
- WebSocket connection count

---

## 11. Development Roadmap

### Phase 1: Core Backend (Week 1-2)
- [ ] Setup project structure
- [ ] Database setup & migrations
- [ ] Authentication & Authorization
- [ ] User management APIs
- [ ] Student CRUD APIs
- [ ] Basic testing

### Phase 2: Mental Health Features (Week 3-4)
- [ ] Mental health records APIs
- [ ] Counseling session management
- [ ] Analytics & statistics APIs
- [ ] Notification system
- [ ] Real-time updates (WebSocket)

### Phase 3: ML Integration (Week 5-6)
- [ ] Dataset upload & management
- [ ] ML model configuration APIs
- [ ] Model training pipeline
- [ ] Prediction APIs
- [ ] Feature correlation analysis

### Phase 4: Advanced Features (Week 7-8)
- [ ] Export functionality
- [ ] Reporting system
- [ ] Advanced analytics
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation

---

## 12. Testing Strategy

### 12.1 Unit Tests
- Service layer logic
- Utility functions
- Data validation

### 12.2 Integration Tests
- API endpoints
- Database operations
- Authentication flow
- ML model integration

### 12.3 E2E Tests
- Critical user flows
- Role-based access
- Data consistency

### 12.4 Load Testing
- Concurrent users
- API throughput
- Database performance

---

## 13. Deployment

### 13.1 Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_POOL_SIZE=20

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=mental-health-dashboard
S3_REGION=us-east-1

# Redis
REDIS_URL=redis://localhost:6379

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@university.edu
SMTP_PASS=your-password

# ML Service
ML_SERVICE_URL=http://ml-service:5000

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### 13.2 Docker Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mental_health_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  ml-service:
    build: ./ml-service
    ports:
      - "5000:5000"
```

---

## 14. API Documentation

Recommend sử dụng:
- **Swagger/OpenAPI** cho API documentation
- **Postman Collections** cho testing
- **GraphQL Playground** (nếu dùng GraphQL)

---

## 15. Support & Maintenance

### 15.1 Backup Strategy
- Daily database backups
- S3 versioning cho files
- Point-in-time recovery
- Disaster recovery plan

### 15.2 Update Strategy
- Rolling updates (zero downtime)
- Database migration strategy
- Backward compatibility
- Rollback procedures

---

## Appendix A: Current Frontend Mock Data Structure

### A.1 Mock Students (`/data/mockStudentsExtended.ts`)
```typescript
{
  id: string;
  studentId: string;
  name: string;
  stressLevel: number;
  sleepHours: number;
  counselingSessions: number;
  riskAssessment: string;
}
```

### A.2 Mock Mental Health (`/data/mockMentalHealth.ts`)
```typescript
{
  id: string;
  studentId: string;
  date: string;
  stressLevel: number;
  anxietyLevel: number;
  depressionLevel: number;
  sleepHours: number;
  physicalActivity: number;
  socialInteraction: number;
  academicPerformance: number;
  notes: string;
}
```

### A.3 Mock Notifications (`/data/mockNotificationsByRole.ts`)
```typescript
{
  id: string;
  type: string;
  message: string;
  timestamp: string;
  priority: string;
  read: boolean;
}
```

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Contact:** Data Science Team / Development Team
