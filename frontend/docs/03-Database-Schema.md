# Database Schema Documentation

## 1. Tổng Quan

Tài liệu này mô tả chi tiết database schema của hệ thống Student Mental Health Dashboard, sử dụng PostgreSQL với Prisma ORM.

## 2. Entity Relationship Diagram (ERD)

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│   User   │─────────│ Student  │─────────│  Record  │
└──────────┘         └──────────┘         └──────────┘
     │                    │
     │                    │
     │              ┌──────────┐
     └──────────────│ Session │
                    └──────────┘
     │
     │
┌──────────┐
│Notification│
└──────────┘

┌──────────┐         ┌──────────┐
│ MLModel  │─────────│ Dataset │
└──────────┘         └──────────┘
     │
     │
┌──────────┐
│RefreshToken│
└──────────┘

┌──────────┐
│AuditLog │
└──────────┘
```

## 3. Tables Chi Tiết

### 3.1 User

**Mô tả**: Lưu trữ thông tin người dùng hệ thống (admin, consultant, teacher, data scientist)

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | String | UNIQUE, NOT NULL | Email đăng nhập |
| password | String | NOT NULL | Password đã hash (bcrypt) |
| role | UserRole | NOT NULL | Vai trò: admin, consultant, teacher_supervisor, data_scientist |
| fullName | String | NOT NULL | Tên đầy đủ |
| avatarUrl | String | NULLABLE | URL avatar |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| updatedAt | DateTime | NOT NULL | Ngày cập nhật |
| lastLogin | DateTime | NULLABLE | Lần đăng nhập cuối |

**Relationships**:
- `students` (1:N) - Students được assign cho consultant
- `sessions` (1:N) - Counseling sessions của consultant
- `notifications` (1:N) - Notifications của user
- `mlModels` (1:N) - ML models được train bởi user
- `datasets` (1:N) - Datasets được upload bởi user
- `refreshTokens` (1:N) - Refresh tokens của user
- `auditLogs` (1:N) - Audit logs của user

**Indexes**:
- `email` (unique)

---

### 3.2 Student

**Mô tả**: Lưu trữ thông tin sinh viên

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| studentId | String | UNIQUE, NOT NULL | Mã sinh viên (e.g., "SV001") |
| name | String | NOT NULL | Tên sinh viên |
| email | String | UNIQUE, NOT NULL | Email sinh viên |
| phone | String | NULLABLE | Số điện thoại |
| department | String | NULLABLE | Khoa/ngành |
| year | Integer | NULLABLE | Năm học |
| avatarUrl | String | NULLABLE | URL avatar |
| stressLevel | SmallInt | NULLABLE | Mức độ stress (1-10) |
| sleepHours | Decimal(4,2) | NULLABLE | Số giờ ngủ/ngày |
| riskScore | SmallInt | NULLABLE | Risk score (0-100) |
| riskLevel | RiskLevel | NULLABLE | low, medium, high, critical |
| status | StudentStatus | NOT NULL, DEFAULT 'active' | active, inactive, graduated |
| consultantId | UUID | NULLABLE, FK | Consultant được assign |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| updatedAt | DateTime | NOT NULL | Ngày cập nhật |
| lastAssessment | DateTime | NULLABLE | Lần đánh giá cuối |

**Relationships**:
- `consultant` (N:1) - Consultant được assign
- `records` (1:N) - Mental health records
- `sessions` (1:N) - Counseling sessions
- `notifications` (1:N) - Notifications liên quan

**Indexes**:
- `studentId` (unique)
- `email` (unique)
- `consultantId` (idx_students_consultant)
- `riskLevel` (idx_students_risk_level)
- `status` (idx_students_status)

---

### 3.3 MentalHealthRecord

**Mô tả**: Lưu trữ các bản ghi đánh giá sức khỏe tinh thần

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| studentId | UUID | NOT NULL, FK | Student ID |
| stressLevel | SmallInt | NOT NULL | Mức độ stress (1-10) |
| anxietyLevel | SmallInt | NOT NULL | Mức độ lo âu (1-10) |
| depressionLevel | SmallInt | NOT NULL | Mức độ trầm cảm (1-10) |
| sleepHours | Decimal(4,2) | NOT NULL | Số giờ ngủ |
| sleepQuality | SmallInt | NOT NULL | Chất lượng giấc ngủ (1-10) |
| riskScore | SmallInt | NOT NULL | Risk score tính toán (0-100) |
| riskLevel | RiskLevel | NOT NULL | low, medium, high, critical |
| assessmentDate | DateTime | NOT NULL | Ngày đánh giá |
| assessmentType | AssessmentType | NOT NULL | self, consultant, automated |
| notes | String | NULLABLE | Ghi chú |
| predictedRisk | SmallInt | NULLABLE | Risk dự đoán bởi ML model |
| modelVersion | String | NULLABLE | Version của ML model |
| createdAt | DateTime | NOT NULL | Ngày tạo |

**Relationships**:
- `student` (N:1) - Student liên quan

**Indexes**:
- `studentId` (idx_health_records_student)
- `assessmentDate` (idx_health_records_date)

---

### 3.4 CounselingSession

**Mô tả**: Lưu trữ các buổi tư vấn

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| studentId | UUID | NOT NULL, FK | Student ID |
| consultantId | UUID | NOT NULL, FK | Consultant ID |
| sessionDate | DateTime | NOT NULL | Ngày giờ buổi tư vấn |
| duration | Integer | NULLABLE | Thời lượng (phút) |
| sessionType | SessionType | NOT NULL | individual, group, emergency |
| status | SessionStatus | NOT NULL, DEFAULT 'scheduled' | scheduled, completed, cancelled, no_show |
| topic | String | NULLABLE | Chủ đề tư vấn |
| notes | String | NULLABLE | Ghi chú |
| followUpRequired | Boolean | NOT NULL, DEFAULT false | Cần follow-up |
| followUpDate | DateTime | NULLABLE | Ngày follow-up |
| preSessionStress | SmallInt | NULLABLE | Stress level trước session (1-10) |
| postSessionStress | SmallInt | NULLABLE | Stress level sau session (1-10) |
| sessionOutcome | String | NULLABLE | Kết quả session |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| updatedAt | DateTime | NOT NULL | Ngày cập nhật |

**Relationships**:
- `student` (N:1) - Student liên quan
- `consultant` (N:1) - Consultant liên quan
- `notifications` (1:N) - Notifications liên quan

**Indexes**:
- `studentId` (idx_sessions_student)
- `consultantId` (idx_sessions_consultant)
- `sessionDate` (idx_sessions_date)

---

### 3.5 Notification

**Mô tả**: Lưu trữ thông báo cho users

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| userId | UUID | NOT NULL, FK | User ID |
| type | NotificationType | NOT NULL | alert, info, warning, success |
| category | NotificationCategory | NOT NULL | student_risk, session_reminder, system, model, trend |
| title | String | NOT NULL | Tiêu đề |
| message | String | NOT NULL | Nội dung |
| priority | NotificationPriority | NOT NULL | low, medium, high, urgent |
| relatedStudentId | UUID | NULLABLE, FK | Student liên quan |
| relatedSessionId | UUID | NULLABLE, FK | Session liên quan |
| read | Boolean | NOT NULL, DEFAULT false | Đã đọc |
| dismissed | Boolean | NOT NULL, DEFAULT false | Đã dismiss |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| readAt | DateTime | NULLABLE | Ngày đọc |

**Relationships**:
- `user` (N:1) - User nhận notification
- `relatedStudent` (N:1) - Student liên quan (optional)
- `relatedSession` (N:1) - Session liên quan (optional)

**Indexes**:
- `userId` (idx_notifications_user)
- `read` (idx_notifications_read)

---

### 3.6 MLModel

**Mô tả**: Lưu trữ cấu hình và thông tin ML models

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| modelName | String | NOT NULL | Tên model |
| modelType | ModelType | NOT NULL | classification, regression, clustering |
| version | String | NOT NULL | Version (e.g., "v241101-1430") |
| algorithm | String | NOT NULL | Thuật toán (e.g., "Random Forest") |
| hyperparameters | JSON | NULLABLE | Hyperparameters |
| features | JSON | NULLABLE | Danh sách features |
| targetVariable | String | NULLABLE | Target variable |
| accuracy | Decimal(5,4) | NULLABLE | Độ chính xác |
| precision | Decimal(5,4) | NULLABLE | Precision |
| recall | Decimal(5,4) | NULLABLE | Recall |
| f1Score | Decimal(5,4) | NULLABLE | F1 Score |
| trainingDatasetId | UUID | NULLABLE, FK | Dataset dùng để train |
| trainingSamples | Integer | NULLABLE | Số samples training |
| testingSamples | Integer | NULLABLE | Số samples testing |
| status | ModelStatus | NOT NULL | training, trained, deployed, archived |
| isActive | Boolean | NOT NULL, DEFAULT false | Model đang active |
| trainedById | UUID | NULLABLE, FK | User train model |
| trainedAt | DateTime | NULLABLE | Ngày train |
| deployedAt | DateTime | NULLABLE | Ngày deploy |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| updatedAt | DateTime | NOT NULL | Ngày cập nhật |

**Relationships**:
- `trainingDataset` (N:1) - Dataset dùng để train
- `trainedBy` (N:1) - User train model

---

### 3.7 Dataset

**Mô tả**: Lưu trữ thông tin datasets

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | String | NOT NULL | Tên dataset |
| description | String | NULLABLE | Mô tả |
| fileUrl | String | NOT NULL | URL file |
| fileName | String | NOT NULL | Tên file |
| fileSize | BigInt | NULLABLE | Kích thước file (bytes) |
| format | String | NOT NULL | csv, json, excel |
| totalSamples | Integer | NULLABLE | Tổng số samples |
| features | JSON | NULLABLE | Danh sách features |
| targetVariable | String | NULLABLE | Target variable |
| completeness | Decimal(5,2) | NULLABLE | Độ đầy đủ (%) |
| missingValues | Decimal(5,2) | NULLABLE | Missing values (%) |
| dataBalance | Decimal(5,2) | NULLABLE | Độ cân bằng data |
| trainingSplit | Decimal(5,2) | NULLABLE | Training split (%) |
| testingSplit | Decimal(5,2) | NULLABLE | Testing split (%) |
| uploadedById | UUID | NULLABLE, FK | User upload |
| uploadedAt | DateTime | NOT NULL | Ngày upload |
| lastUsedAt | DateTime | NULLABLE | Lần sử dụng cuối |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| updatedAt | DateTime | NOT NULL | Ngày cập nhật |

**Relationships**:
- `uploadedBy` (N:1) - User upload dataset
- `models` (1:N) - ML models sử dụng dataset

---

### 3.8 RefreshToken

**Mô tả**: Lưu trữ refresh tokens cho authentication

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| token | String | UNIQUE, NOT NULL | Hashed token |
| userId | UUID | NOT NULL, FK | User ID |
| expiresAt | DateTime | NOT NULL | Ngày hết hạn |
| createdAt | DateTime | NOT NULL | Ngày tạo |
| revoked | Boolean | NOT NULL, DEFAULT false | Đã revoke |
| revokedAt | DateTime | NULLABLE | Ngày revoke |
| replacedBy | UUID | NULLABLE | Token thay thế |

**Relationships**:
- `user` (N:1) - User sở hữu token

**Indexes**:
- `token` (unique)

---

### 3.9 AuditLog

**Mô tả**: Lưu trữ audit logs cho các actions quan trọng

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| userId | UUID | NULLABLE, FK | User thực hiện action |
| action | String | NOT NULL | Tên action (e.g., "student.create") |
| resource | String | NULLABLE | Resource ID |
| metadata | JSON | NULLABLE | Metadata bổ sung |
| ip | String | NULLABLE | IP address |
| userAgent | String | NULLABLE | User agent |
| success | Boolean | NOT NULL, DEFAULT true | Action thành công |
| createdAt | DateTime | NOT NULL | Ngày tạo |

**Relationships**:
- `user` (N:1) - User thực hiện action

**Indexes**:
- `userId`
- `createdAt`

## 4. Enums

### 4.1 UserRole
- `admin` - Quản trị viên
- `consultant` - Tư vấn viên
- `teacher_supervisor` - Giáo viên/Giám sát
- `data_scientist` - Nhà khoa học dữ liệu

### 4.2 StudentStatus
- `active` - Đang hoạt động
- `inactive` - Không hoạt động
- `graduated` - Đã tốt nghiệp

### 4.3 RiskLevel
- `low` - Rủi ro thấp
- `medium` - Rủi ro trung bình
- `high` - Rủi ro cao
- `critical` - Rủi ro nghiêm trọng

### 4.4 AssessmentType
- `self` - Tự đánh giá
- `consultant` - Đánh giá bởi consultant
- `automated` - Đánh giá tự động

### 4.5 SessionType
- `individual` - Tư vấn cá nhân
- `group` - Tư vấn nhóm
- `emergency` - Tư vấn khẩn cấp

### 4.6 SessionStatus
- `scheduled` - Đã lên lịch
- `completed` - Đã hoàn thành
- `cancelled` - Đã hủy
- `no_show` - Không đến

### 4.7 NotificationType
- `alert` - Cảnh báo
- `info` - Thông tin
- `warning` - Cảnh báo
- `success` - Thành công

### 4.8 NotificationCategory
- `student_risk` - Rủi ro sinh viên
- `session_reminder` - Nhắc nhở session
- `system` - Hệ thống
- `model` - ML Model
- `trend` - Xu hướng

### 4.9 NotificationPriority
- `low` - Thấp
- `medium` - Trung bình
- `high` - Cao
- `urgent` - Khẩn cấp

### 4.10 ModelType
- `classification` - Phân loại
- `regression` - Hồi quy
- `clustering` - Phân cụm

### 4.11 ModelStatus
- `training` - Đang train
- `trained` - Đã train
- `deployed` - Đã deploy
- `archived` - Đã lưu trữ

## 5. Constraints & Rules

### 5.1 Foreign Key Constraints
- `Student.consultantId` → `User.id` (ON DELETE SET NULL)
- `MentalHealthRecord.studentId` → `Student.id` (ON DELETE CASCADE)
- `CounselingSession.studentId` → `Student.id` (ON DELETE CASCADE)
- `CounselingSession.consultantId` → `User.id`
- `Notification.userId` → `User.id` (ON DELETE CASCADE)
- `MLModel.trainingDatasetId` → `Dataset.id`
- `MLModel.trainedById` → `User.id`
- `Dataset.uploadedById` → `User.id`
- `RefreshToken.userId` → `User.id` (ON DELETE CASCADE)
- `AuditLog.userId` → `User.id`

### 5.2 Business Rules
1. **Student Assignment**: Một student chỉ có thể được assign cho một consultant
2. **Active Model**: Chỉ một model active per modelType
3. **Risk Calculation**: Risk score được tính từ stress, anxiety, depression levels
4. **Token Expiry**: Refresh tokens tự động expire sau 7 ngày
5. **Cascade Deletes**: Xóa student sẽ xóa tất cả records và sessions

## 6. Indexes Strategy

### 6.1 Performance Indexes
- Foreign keys đều có indexes
- Frequently queried fields (riskLevel, status, dates)
- Composite indexes cho queries phức tạp (tương lai)

### 6.2 Unique Constraints
- `User.email`
- `Student.studentId`
- `Student.email`
- `RefreshToken.token`

## 7. Migration Strategy

### 7.1 Prisma Migrations
- Sử dụng Prisma Migrate cho schema changes
- Migrations được version control
- Shadow database cho development

### 7.2 Data Migrations
- Seed data cho development
- Migration scripts cho production data

## 8. References

- [Prisma Schema](../backend/prisma/schema.prisma)
- [Software Architecture](./01-Software-Architecture.md)
- [API Documentation](./06-API-Documentation.md)


