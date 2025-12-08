# 🔌 API Documentation

## 📡 Backend API (Strapi)

**Base URL**: `http://localhost:1337`

**Admin Panel**: `http://localhost:1337/admin`

**API Docs**: `http://localhost:1337/documentation`

---

## 🔐 Authentication

### Login
```http
POST /api/auth/local
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com",
    "role": {
      "id": 1,
      "name": "Data Scientist",
      "type": "data_scientist"
    }
  }
}
```

### Register
```http
POST /api/auth/local/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/users/me
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "role": {
    "id": 1,
    "name": "Data Scientist"
  }
}
```

---

## 👥 Users API

### List Users
```http
GET /api/users
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `_limit`: Number of items (default: 25)
- `_start`: Offset (default: 0)
- `_sort`: Sort field (e.g., `createdAt:DESC`)

**Response**:
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": {
      "id": 1,
      "name": "Administrator"
    }
  }
]
```

### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <jwt_token>
```

### Update User
```http
PUT /api/users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "username": "updated_username",
  "email": "newemail@example.com"
}
```

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <jwt_token>
```

---

## 🎓 Students API

### List Students
```http
GET /api/students
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `filters[name][$contains]`: Filter by name
- `filters[studentId][$eq]`: Filter by student ID
- `filters[riskLevel][$eq]`: Filter by risk level (low/medium/high)
- `pagination[page]`: Page number
- `pagination[pageSize]`: Items per page

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "studentId": "2211234",
        "name": "Nguyen Van A",
        "email": "nguyenvana@student.hcmut.edu.vn",
        "phone": "0901234567",
        "gpa": 3.5,
        "attendanceRate": 85.0,
        "mentalHealthScore": 70,
        "riskLevel": "medium",
        "lastAssessment": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 5,
      "total": 125
    }
  }
}
```

### Get Student by ID
```http
GET /api/students/:id
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "studentId": "2211234",
      "name": "Nguyen Van A",
      "email": "nguyenvana@student.hcmut.edu.vn",
      "phone": "0901234567",
      "gpa": 3.5,
      "attendanceRate": 85.0,
      "mentalHealthScore": 70,
      "riskLevel": "medium",
      "assessments": [
        {
          "id": 1,
          "date": "2024-01-15T10:30:00Z",
          "riskLevel": "medium",
          "confidence": 0.85
        }
      ]
    }
  }
}
```

### Create Student
```http
POST /api/students
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "data": {
    "studentId": "2211234",
    "name": "Nguyen Van A",
    "email": "nguyenvana@student.hcmut.edu.vn",
    "phone": "0901234567",
    "gpa": 3.5,
    "attendanceRate": 85.0
  }
}
```

### Update Student
```http
PUT /api/students/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "data": {
    "gpa": 3.7,
    "attendanceRate": 90.0,
    "mentalHealthScore": 75
  }
}
```

### Delete Student
```http
DELETE /api/students/:id
Authorization: Bearer <jwt_token>
```

---

## 🤖 ML Models API

### List Models
```http
GET /api/ml-models
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Student Risk Model v1",
        "version": "1.0.0",
        "algorithm": "Random Forest",
        "accuracy": 0.85,
        "precision": 0.82,
        "recall": 0.78,
        "f1Score": 0.80,
        "status": "active",
        "trainedAt": "2024-01-10T10:00:00Z"
      }
    }
  ]
}
```

### Get Model by ID
```http
GET /api/ml-models/:id
Authorization: Bearer <jwt_token>
```

### Train Model
```http
POST /api/ml-models/train
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "datasetId": 1,
  "algorithm": "random_forest",
  "hyperparameters": {
    "n_estimators": 100,
    "max_depth": 10,
    "min_samples_split": 2
  }
}
```

**Response**:
```json
{
  "jobId": "training_job_123",
  "status": "processing",
  "estimatedTime": "5 minutes"
}
```

### Get Training Status
```http
GET /api/ml-models/training-status/:jobId
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "jobId": "training_job_123",
  "status": "completed",
  "progress": 100,
  "result": {
    "modelId": 2,
    "accuracy": 0.87,
    "metrics": {
      "precision": 0.85,
      "recall": 0.83,
      "f1Score": 0.84
    }
  }
}
```

### Make Prediction
```http
POST /api/ml-models/predict
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "modelId": 1,
  "studentData": {
    "gpa": 3.5,
    "attendanceRate": 85.0,
    "mentalHealthScore": 70,
    "socialInteractionScore": 65
  }
}
```

**Response**:
```json
{
  "prediction": {
    "riskLevel": "medium",
    "confidence": 0.85,
    "factors": [
      {
        "factor": "Mental Health Score",
        "impact": "high",
        "value": 70
      },
      {
        "factor": "Social Interaction",
        "impact": "medium",
        "value": 65
      }
    ]
  }
}
```

---

## 📊 Datasets API

### List Datasets
```http
GET /api/datasets
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Student Wellness Data 2024",
        "description": "Training data for Q1 2024",
        "recordCount": 1500,
        "fileSize": "2.5 MB",
        "status": "processed",
        "uploadedAt": "2024-01-05T10:00:00Z",
        "uploadedBy": {
          "id": 1,
          "username": "admin"
        }
      }
    }
  ]
}
```

### Get Dataset by ID
```http
GET /api/datasets/:id
Authorization: Bearer <jwt_token>
```

### Upload Dataset
```http
POST /api/datasets
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: <file.csv>
data: {
  "name": "Dataset Name",
  "description": "Dataset description"
}
```

**Response**:
```json
{
  "data": {
    "id": 2,
    "attributes": {
      "name": "Dataset Name",
      "description": "Dataset description",
      "recordCount": 1000,
      "fileSize": "1.8 MB",
      "status": "processing"
    }
  }
}
```

### Delete Dataset
```http
DELETE /api/datasets/:id
Authorization: Bearer <jwt_token>
```

---

## 🔔 Notifications API

### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `filters[read][$eq]`: Filter by read status (true/false)
- `filters[type][$eq]`: Filter by type (info/warning/error)
- `sort`: Sort order (e.g., `createdAt:DESC`)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Model Training Complete",
        "message": "Your model has been successfully trained",
        "type": "info",
        "read": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

### Mark as Read
```http
PUT /api/notifications/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "data": {
    "read": true
  }
}
```

---

## 🤖 ML Service API (Python)

**Base URL**: `http://localhost:5000`

### Health Check
```http
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Train Model
```http
POST /train
Content-Type: application/json

{
  "dataset_path": "/path/to/dataset.csv",
  "algorithm": "random_forest",
  "hyperparameters": {
    "n_estimators": 100,
    "max_depth": 10
  }
}
```

### Predict
```http
POST /predict
Content-Type: application/json

{
  "model_id": "model_v1",
  "features": {
    "gpa": 3.5,
    "attendance_rate": 85.0,
    "mental_health_score": 70
  }
}
```

**Response**:
```json
{
  "prediction": "medium",
  "confidence": 0.85,
  "probabilities": {
    "low": 0.10,
    "medium": 0.85,
    "high": 0.05
  }
}
```

---

## 🔧 Error Responses

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Invalid request parameters",
    "details": {}
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "name": "UnauthorizedError",
    "message": "Missing or invalid credentials"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "An internal server error occurred"
  }
}
```

---

## 📚 Related Documentation

- [Quick Start](./QUICKSTART.md)
- [Database Schema](./DATABASE.md)
- [Frontend Integration](./FRONTEND_INTEGRATION.md)
- [Authentication Guide](./AUTHENTICATION.md)
