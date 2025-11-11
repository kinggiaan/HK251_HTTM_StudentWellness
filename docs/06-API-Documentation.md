# API Documentation

## 1. Tổng Quan

Tài liệu này mô tả chi tiết tất cả API endpoints của hệ thống Student Mental Health Dashboard.

**Base URL**: `http://localhost:4000/api` (development)

**Authentication**: JWT Bearer Token (trừ auth endpoints)

**Response Format**: JSON

## 2. Authentication Endpoints

### 2.1 POST `/auth/login`

Đăng nhập và nhận JWT tokens.

**Request Body**:
```json
{
  "email": "consultant@university.edu",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "consultant@university.edu",
      "fullName": "Dr. Sarah Johnson",
      "role": "consultant",
      "avatarUrl": null
    },
    "token": {
      "accessToken": "jwt-access-token",
      "refreshToken": "jwt-refresh-token",
      "expiresIn": 900
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing fields

---

### 2.2 POST `/auth/refresh`

Refresh access token bằng refresh token.

**Request Body**:
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response** (200 OK): Tương tự `/auth/login`

**Error Responses**:
- `401 Unauthorized`: Invalid/expired refresh token

---

### 2.3 POST `/auth/logout`

Đăng xuất và revoke refresh token.

**Request Body**:
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2.4 POST `/auth/change-password`

Đổi mật khẩu (yêu cầu authentication).

**Request Body**:
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

**Response** (204 No Content)

**Error Responses**:
- `401 Unauthorized`: Current password incorrect
- `400 Bad Request`: Validation errors

---

## 3. User Management Endpoints

### 3.1 GET `/users`

Lấy danh sách users (Admin only).

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `search`: string (tìm theo email, fullName)
- `role`: UserRole (filter by role)
- `sortBy`: 'email' | 'fullName' | 'createdAt'
- `order`: 'asc' | 'desc'

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user@university.edu",
        "fullName": "User Name",
        "role": "consultant",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### 3.2 GET `/users/:id`

Lấy chi tiết user.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@university.edu",
    "fullName": "User Name",
    "role": "consultant",
    "avatarUrl": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2025-11-10T10:00:00Z"
  }
}
```

---

### 3.3 POST `/users`

Tạo user mới (Admin only).

**Request Body**:
```json
{
  "email": "newuser@university.edu",
  "password": "password123",
  "fullName": "New User",
  "role": "consultant"
}
```

**Response** (201 Created): Tương tự GET `/users/:id`

---

### 3.4 PUT `/users/:id`

Cập nhật user (Admin only).

**Request Body** (tất cả fields optional):
```json
{
  "fullName": "Updated Name",
  "role": "admin",
  "avatarUrl": "https://..."
}
```

**Response** (200 OK): Updated user object

---

### 3.5 DELETE `/users/:id`

Xóa user (Admin only, soft delete).

**Response** (204 No Content)

---

## 4. Student Management Endpoints

### 4.1 GET `/students`

Lấy danh sách students.

**Query Parameters**:
- `page`: number
- `limit`: number (default: 20, max: 100)
- `search`: string
- `riskLevel`: RiskLevel
- `status`: StudentStatus
- `consultantId`: UUID
- `sortBy`: 'name' | 'riskScore' | 'lastAssessment'
- `order`: 'asc' | 'desc'

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "studentId": "SV001",
        "name": "Nguyen Van A",
        "email": "student@edu",
        "department": "Computer Science",
        "year": 3,
        "stressLevel": 7,
        "sleepHours": 6,
        "riskScore": 75,
        "riskLevel": "high",
        "status": "active",
        "consultant": {
          "id": "uuid",
          "fullName": "Dr. Sarah Johnson"
        },
        "lastAssessment": "2025-11-10T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

**Note**: Consultant chỉ thấy students được assign.

---

### 4.2 GET `/students/:id`

Lấy chi tiết student.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "SV001",
    "name": "Nguyen Van A",
    "email": "student@edu",
    "phone": "+84123456789",
    "department": "Computer Science",
    "year": 3,
    "stressLevel": 7,
    "sleepHours": 6,
    "riskScore": 75,
    "riskLevel": "high",
    "status": "active",
    "consultant": {
      "id": "uuid",
      "fullName": "Dr. Sarah Johnson",
      "email": "consultant@university.edu"
    },
    "recentRecords": [...],
    "upcomingSessions": [...],
    "createdAt": "2024-01-01T00:00:00Z",
    "lastAssessment": "2025-11-10T00:00:00Z"
  }
}
```

---

### 4.3 POST `/students`

Tạo student mới.

**Request Body**:
```json
{
  "studentId": "SV150",
  "name": "Tran Thi B",
  "email": "tranthib@student.edu",
  "phone": "+84987654321",
  "department": "Psychology",
  "year": 2,
  "consultantId": "uuid" // Optional, defaults to current user if consultant
}
```

**Response** (201 Created): Student object

---

### 4.4 PUT `/students/:id`

Cập nhật student.

**Request Body** (tất cả fields optional):
```json
{
  "name": "Updated Name",
  "phone": "+84999999999",
  "department": "Engineering",
  "status": "inactive"
}
```

**Response** (200 OK): Updated student object

---

### 4.5 DELETE `/students/:id`

Xóa student.

**Response** (204 No Content)

---

## 5. Mental Health Records Endpoints

### 5.1 GET `/students/:studentId/health-records`

Lấy danh sách mental health records của student.

**Query Parameters**:
- `from`: Date (ISO string)
- `to`: Date (ISO string)
- `limit`: number
- `sortBy`: 'assessmentDate'
- `order`: 'asc' | 'desc'

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "stressLevel": 7,
      "anxietyLevel": 6,
      "depressionLevel": 5,
      "sleepHours": 6,
      "sleepQuality": 4,
      "riskScore": 75,
      "riskLevel": "high",
      "assessmentDate": "2025-11-10T00:00:00Z",
      "assessmentType": "consultant",
      "notes": "Student reported increased academic pressure",
      "createdAt": "2025-11-10T00:00:00Z"
    }
  ]
}
```

---

### 5.2 POST `/students/:studentId/health-records`

Tạo mental health record mới.

**Request Body**:
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

**Response** (201 Created): Record object

**Note**: Risk score và risk level được tính tự động.

---

### 5.3 GET `/health-records/:id`

Lấy chi tiết record.

**Response** (200 OK): Record object

---

### 5.4 PUT `/health-records/:id`

Cập nhật record.

**Request Body** (tất cả fields optional):
```json
{
  "stressLevel": 6,
  "notes": "Updated notes"
}
```

**Response** (200 OK): Updated record object

---

### 5.5 DELETE `/health-records/:id`

Xóa record.

**Response** (204 No Content)

---

## 6. Counseling Sessions Endpoints

### 6.1 GET `/sessions`

Lấy danh sách counseling sessions.

**Query Parameters**:
- `page`: number
- `limit`: number
- `studentId`: UUID
- `consultantId`: UUID
- `status`: SessionStatus
- `sessionType`: SessionType
- `from`: Date
- `to`: Date
- `sortBy`: 'sessionDate' | 'createdAt' | 'updatedAt'
- `order`: 'asc' | 'desc'

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "studentId": "uuid",
        "consultantId": "uuid",
        "sessionDate": "2025-11-15T14:00:00Z",
        "duration": 60,
        "sessionType": "individual",
        "status": "scheduled",
        "topic": "Stress management",
        "notes": "Initial consultation",
        "followUpRequired": true,
        "student": {
          "id": "uuid",
          "studentId": "SV001",
          "name": "Nguyen Van A"
        },
        "consultant": {
          "id": "uuid",
          "fullName": "Dr. Sarah Johnson"
        }
      }
    ],
    "pagination": {...}
  }
}
```

---

### 6.2 POST `/sessions`

Tạo counseling session mới.

**Request Body**:
```json
{
  "studentId": "uuid",
  "consultantId": "uuid", // Optional, defaults to current user
  "sessionDate": "2025-11-15T14:00:00Z",
  "duration": 60,
  "sessionType": "individual",
  "status": "scheduled",
  "topic": "Stress management",
  "notes": "Initial consultation",
  "followUpRequired": true
}
```

**Response** (201 Created): Session object

---

### 6.3 GET `/sessions/:id`

Lấy chi tiết session.

**Response** (200 OK): Session object với student và consultant info

---

### 6.4 PUT `/sessions/:id`

Cập nhật session.

**Request Body** (tất cả fields optional):
```json
{
  "status": "completed",
  "notes": "Session completed successfully",
  "postSessionStress": 5,
  "sessionOutcome": "Positive progress"
}
```

**Response** (200 OK): Updated session object

---

### 6.5 DELETE `/sessions/:id`

Xóa session.

**Response** (204 No Content)

---

## 7. Notifications Endpoints

### 7.1 GET `/notifications`

Lấy danh sách notifications của current user.

**Query Parameters**:
- `page`: number
- `limit`: number
- `type`: NotificationType
- `category`: NotificationCategory
- `priority`: NotificationPriority
- `read`: boolean
- `dismissed`: boolean

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "type": "alert",
        "category": "student_risk",
        "title": "High Risk Alert",
        "message": "Student SV001 has been flagged as high risk",
        "priority": "urgent",
        "relatedStudentId": "uuid",
        "relatedStudent": {
          "id": "uuid",
          "studentId": "SV001",
          "name": "Nguyen Van A"
        },
        "read": false,
        "dismissed": false,
        "createdAt": "2025-11-10T09:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### 7.2 GET `/notifications/unread-count`

Lấy số lượng notifications chưa đọc.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### 7.3 POST `/notifications`

Tạo notification mới (Admin hoặc system).

**Request Body**:
```json
{
  "userId": "uuid", // Optional, defaults to current user
  "type": "alert",
  "category": "student_risk",
  "title": "High Risk Alert",
  "message": "Student has been flagged as high risk",
  "priority": "urgent",
  "relatedStudentId": "uuid" // Optional
}
```

**Response** (201 Created): Notification object

---

### 7.4 PATCH `/notifications/:id/read`

Đánh dấu notification đã đọc.

**Response** (200 OK): Updated notification object

---

### 7.5 PATCH `/notifications/:id/dismiss`

Dismiss notification.

**Response** (200 OK): Updated notification object

---

### 7.6 POST `/notifications/mark-all-read`

Đánh dấu tất cả notifications đã đọc.

**Response** (200 OK):
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 7.7 DELETE `/notifications/:id`

Xóa notification.

**Response** (204 No Content)

---

## 8. Analytics Endpoints

### 8.1 GET `/analytics/overview`

Lấy overview metrics.

**Query Parameters**:
- `consultantId`: UUID (Admin only)
- `from`: Date
- `to`: Date

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "highRiskStudents": 23,
    "scheduledSessions": 12,
    "completedSessionsThisPeriod": 8,
    "averageStressLevel": 6.2,
    "trends": {
      "highRiskChange": 12.5 // percentage
    }
  }
}
```

---

### 8.2 GET `/analytics/students/distribution`

Lấy phân bố students.

**Query Parameters**:
- `consultantId`: UUID (Admin only)

**Response** (200 OK):
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
      "Engineering": 50
    }
  }
}
```

---

### 8.3 GET `/analytics/trends`

Lấy trends data.

**Query Parameters**:
- `metric`: 'stress' | 'anxiety' | 'depression' | 'sleep'
- `period`: '7d' | '30d' | '90d' | '1y'
- `groupBy`: 'day' | 'week' | 'month'
- `consultantId`: UUID (Admin only)

**Response** (200 OK):
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

### 8.4 GET `/analytics/students/stats`

Lấy statistics về students.

**Query Parameters**:
- `consultantId`: UUID (Admin only)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "activeStudents": 145,
    "inactiveStudents": 5,
    "averageStressLevel": 6.2,
    "averageSleepHours": 7.5,
    "averageRiskScore": 45.3
  }
}
```

---

## 9. ML Models Endpoints (Data Scientist)

### 9.1 GET `/ml/models`

Lấy danh sách ML models.

**Query Parameters**:
- `page`: number
- `limit`: number
- `modelType`: ModelType
- `status`: ModelStatus
- `isActive`: boolean
- `search`: string
- `sortBy`: 'modelName' | 'version' | 'createdAt' | 'accuracy'
- `order`: 'asc' | 'desc'

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "modelName": "Mental Health Risk Predictor",
        "modelType": "classification",
        "version": "v241101-1430",
        "algorithm": "Random Forest",
        "accuracy": 0.89,
        "precision": 0.87,
        "recall": 0.91,
        "f1Score": 0.89,
        "status": "deployed",
        "isActive": true,
        "trainedAt": "2025-11-01T00:00:00Z",
        "deployedAt": "2025-11-02T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### 9.2 POST `/ml/models`

Tạo ML model mới.

**Request Body**:
```json
{
  "modelName": "New Risk Model",
  "modelType": "classification",
  "algorithm": "SVM",
  "hyperparameters": {
    "kernel": "rbf",
    "C": 1.0
  },
  "features": ["stressLevel", "sleepHours", "anxietyLevel"],
  "targetVariable": "riskLevel",
  "version": "v1.0.0" // Optional, auto-generated if not provided
}
```

**Response** (201 Created): Model object

---

### 9.3 POST `/ml/models/:id/train`

Train model với dataset.

**Request Body**:
```json
{
  "datasetId": "uuid",
  "trainTestSplit": 0.8 // Optional, default: 0.8
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "trained",
    "accuracy": 0.89,
    "precision": 0.87,
    "recall": 0.91,
    "f1Score": 0.89,
    "trainedAt": "2025-11-10T10:00:00Z"
  }
}
```

---

### 9.4 POST `/ml/models/:id/deploy`

Deploy model (chỉ model đã trained).

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isActive": true,
    "status": "deployed",
    "deployedAt": "2025-11-10T10:00:00Z"
  }
}
```

**Note**: Deploy một model sẽ tự động deactivate các models cùng type khác.

---

## 10. Datasets Endpoints (Data Scientist)

### 10.1 GET `/ml/datasets`

Lấy danh sách datasets.

**Query Parameters**:
- `page`: number
- `limit`: number
- `format`: 'csv' | 'json' | 'excel'
- `search`: string
- `sortBy`: 'name' | 'uploadedAt' | 'totalSamples' | 'fileSize'
- `order`: 'asc' | 'desc'

**Response** (200 OK): Tương tự ML models

---

### 10.2 POST `/ml/datasets/upload`

Upload dataset file.

**Request**: `multipart/form-data`
- `file`: File (CSV, JSON, Excel)
- `name`: string
- `description`: string (optional)

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mental Health Dataset",
    "fileName": "dataset.csv",
    "fileSize": 1024000,
    "format": "csv",
    "uploadedAt": "2025-11-10T10:00:00Z"
  }
}
```

---

### 10.3 GET `/ml/datasets/:id/preview`

Preview dataset (first 5 rows).

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "headers": ["stressLevel", "anxietyLevel", "riskLevel"],
    "rows": [
      [7, 6, "high"],
      [5, 4, "medium"]
    ],
    "totalRows": 1000
  }
}
```

---

### 10.4 GET `/ml/datasets/:id/statistics`

Lấy statistics của dataset.

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSamples": 1000,
      "features": 15,
      "completeness": 95.5
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

---

## 11. Error Responses

Tất cả endpoints có thể trả về các error responses sau:

### 11.1 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 11.2 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 11.3 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 11.4 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 11.5 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 12. Rate Limiting

- **Authentication endpoints**: 5 requests/minute
- **Other endpoints**: 100 requests/minute

## 13. References

- [Software Architecture](./01-Software-Architecture.md)
- [User Roles & Permissions](./05-User-Roles-Permissions.md)
- [Database Schema](./03-Database-Schema.md)


