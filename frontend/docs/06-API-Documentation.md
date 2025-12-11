# API Documentation

## 1. Tổng Quan

Tài liệu này mô tả chi tiết tất cả API endpoints của hệ thống Student Mental Health Dashboard, dựa trên Postman Collections.

**Base URL**: `http://localhost:1337/api` (development)

**Authentication**: JWT Bearer Token (trừ auth endpoints)

**Response Format**: JSON

## 2. Authentication (Auth)

### 2.1 Đăng nhập
**POST** `/auth/local`

Đăng nhập và nhận JWT tokens.

**Request Body**:
```json
{
    "identifier": "engineer",
    "password": "password123"
}
```

**Response**:
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "username": "engineer",
        "email": "engineer@example.com",
        "provider": "local",
        "confirmed": true,
        "blocked": false,
        "createdAt": "2023-10-27T00:00:00.000Z",
        "updatedAt": "2023-10-27T00:00:00.000Z"
    }
}
```

### 2.2 Thông tin cá nhân
**GET** `/users/me?populate=*`

Lấy thông tin chi tiết của user đang đăng nhập.

**Headers**:
- `Authorization`: `Bearer <token>`

---

## 3. Quản lý Sinh viên (Students)

### 3.1 Tạo mới sinh viên
**POST** `/students`

**Request Body**:
```json
{
    "data": {
        "name": "Student 1",
        "age": 20,
        "cgpa": 9.2,
        "city": "Ho Chi Minh",
        "academic_pressure": 2,
        "study_satisfaction": 2,
        "sleep_duration": "Less than 5 hours",
        "dietary_habits": "Moderate",
        "degree": "First year",
        "work_study_hours": 3,
        "gender": "Female",
        "financial_stress": 2,
        "family_his_of_mental_illness": "No"
    }
}
```

### 3.2 Lấy danh sách sinh viên
**GET** `/students`

### 3.3 Lấy thông tin chi tiết sinh viên
**GET** `/students/:documentId`

### 3.4 Cập nhật thông tin sinh viên
**PUT** `/students/:documentId`

**Request Body**:
```json
{
    "data": {
        "name": "Updated Name",
        ...
    }
}
```

### 3.5 Xóa sinh viên
**DELETE** `/students/:documentId`

### 3.6 Validate kết quả dự đoán (Consultant)
**PUT** `/students/:documentId`

**Request Body**:
```json
{
    "data": {
        "validated": true
    }
}
```

### 3.7 Đặt nhãn đúng và kết quả dự đoán
**PUT** `/students/:documentId`

**Request Body**:
```json
{
    "data": {
        "depression_truth": 0,
        "depression_predicting": 0
    }
}
```

---

## 4. Machine Learning (ML)

### 4.1 Tạo mới Preset (Model + Dataset)
**POST** `/ml/presets`

**Content-Type**: `multipart/form-data`

**Body**:
- `file`: File CSV dataset
- `preset_name`: Tên preset (ví dụ: "preset2")
- `config`: JSON string config (ví dụ: `{}`)

### 4.2 Danh sách Preset
**GET** `/ml/presets`

### 4.3 Xóa Preset
**DELETE** `/ml/presets/:presetName`

### 4.4 Config Preset
**PUT** `/ml/presets/:presetName`

**Request Body**:
```json
{
  "features": ["Gender", "Age", ...],
  "test_size": 0.2,
  "n_estimators": 500,
  "max_depth": null,
  "class_weight": "balanced"
}
```

### 4.5 Xem Config Preset
**GET** `/ml/presets/:presetName/config`

### 4.6 Retrain Model
**POST** `/ml/presets/:preset_name/retrain`

### 4.7 Xem trạng thái Training
**GET** `/ml/presets/:preset_name/state`

### 4.8 Xem Performance
**GET** `/ml/presets/:preset_name/performance`

### 4.9 Xem Analysis
**GET** `/ml/presets/:preset_name/analysis`

### 4.10 Xem Plots
**GET** `/ml/presets/:preset_name/plots`

### 4.11 Dự đoán (Predict)
**POST** `/ml/presets/:preset_name/predict`

**Request Body**:
```json
{
  "id": 62,
  "Gender": "Male",
  "Age": 31,
  ...
}
```


