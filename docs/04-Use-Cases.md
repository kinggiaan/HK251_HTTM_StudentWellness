# Use Cases Document

## 1. Tổng Quan

Tài liệu này mô tả các use case chính của hệ thống Student Mental Health Dashboard, bao gồm các kịch bản sử dụng cho từng vai trò người dùng.

## 2. Actors (Người Dùng)

### 2.1 Admin
- Quản lý toàn bộ hệ thống
- Quản lý users và students
- Xem tất cả dữ liệu và analytics

### 2.2 Consultant
- Quản lý students được assign
- Tạo và quản lý counseling sessions
- Xem mental health records của students
- Tạo notifications

### 2.3 Teacher/Supervisor
- Xem overview của students
- Xem analytics và trends
- Không thể chỉnh sửa dữ liệu

### 2.4 Data Scientist
- Quản lý ML models
- Upload và quản lý datasets
- Train và deploy models
- Xem analytics

## 3. Use Cases Chi Tiết

### UC-01: Đăng Nhập (Login)

**Actor**: Tất cả users

**Preconditions**: User có account hợp lệ

**Main Flow**:
1. User truy cập login page
2. Nhập email và password
3. Hệ thống validate credentials
4. Hệ thống tạo JWT tokens
5. Hệ thống redirect đến dashboard tương ứng với role

**Alternative Flows**:
- 3a. Invalid credentials → Hiển thị error message
- 3b. Account bị lock → Hiển thị thông báo

**Postconditions**: User đã đăng nhập và có thể truy cập hệ thống

---

### UC-02: Đăng Xuất (Logout)

**Actor**: Tất cả users

**Preconditions**: User đã đăng nhập

**Main Flow**:
1. User click nút logout
2. Hệ thống revoke refresh token
3. Hệ thống clear local storage
4. Hệ thống redirect đến login page

**Postconditions**: User đã đăng xuất, tokens bị invalidate

---

### UC-03: Quản Lý Students (Admin/Consultant)

**Actor**: Admin, Consultant

**Preconditions**: User đã đăng nhập

**Main Flow**:
1. User truy cập Students page
2. Hệ thống hiển thị danh sách students
   - Admin: Tất cả students
   - Consultant: Chỉ students được assign
3. User có thể:
   - Tìm kiếm students
   - Xem chi tiết student
   - Tạo student mới (Admin)
   - Cập nhật thông tin student
   - Xem mental health records của student

**Alternative Flows**:
- 3a. Consultant không thể tạo student cho consultant khác
- 3b. Consultant chỉ có thể xem students của mình

**Postconditions**: Students được quản lý thành công

---

### UC-04: Xem Mental Health Records

**Actor**: Admin, Consultant, Teacher/Supervisor

**Preconditions**: User đã đăng nhập

**Main Flow**:
1. User truy cập Mental Health Records page
2. Hệ thống hiển thị danh sách records với filters:
   - Student ID/Name
   - Date range
   - Risk level
   - Assessment type
3. User có thể:
   - Xem chi tiết record
   - Xem trends và charts
   - Export data

**Alternative Flows**:
- 2a. Consultant chỉ thấy records của students được assign
- 2b. Teacher chỉ có thể xem, không thể chỉnh sửa

**Postconditions**: User đã xem mental health records

---

### UC-05: Tạo Mental Health Record

**Actor**: Admin, Consultant

**Preconditions**: User đã đăng nhập, có student trong hệ thống

**Main Flow**:
1. User chọn student
2. User click "Create Record"
3. User nhập thông tin:
   - Stress level (1-10)
   - Anxiety level (1-10)
   - Depression level (1-10)
   - Sleep hours
   - Sleep quality (1-10)
   - Notes
4. Hệ thống tính toán risk score và risk level
5. Hệ thống lưu record
6. Hệ thống cập nhật student's latest assessment

**Alternative Flows**:
- 3a. Missing required fields → Hiển thị validation errors
- 4a. Risk level = critical → Tạo notification cho consultant

**Postconditions**: Mental health record được tạo thành công

---

### UC-06: Quản Lý Counseling Sessions

**Actor**: Admin, Consultant

**Preconditions**: User đã đăng nhập

**Main Flow**:
1. User truy cập Sessions page
2. Hệ thống hiển thị danh sách sessions
3. User có thể:
   - Tạo session mới
   - Xem chi tiết session
   - Cập nhật session (status, notes, outcomes)
   - Xóa session

**Alternative Flows**:
- 3a. Consultant chỉ có thể quản lý sessions của mình
- 3b. Consultant không thể assign session cho consultant khác

**Postconditions**: Sessions được quản lý thành công

---

### UC-07: Tạo Counseling Session

**Actor**: Admin, Consultant

**Preconditions**: User đã đăng nhập, có student trong hệ thống

**Main Flow**:
1. User chọn student
2. User click "Create Session"
3. User nhập thông tin:
   - Session date & time
   - Duration
   - Session type (individual/group)
   - Topic
   - Notes
4. Hệ thống tạo session với status "scheduled"
5. Hệ thống tạo notification cho student (tương lai)

**Alternative Flows**:
- 1a. Consultant chỉ có thể tạo session cho students được assign
- 3a. Missing required fields → Validation errors

**Postconditions**: Counseling session được tạo thành công

---

### UC-08: Xem Notifications

**Actor**: Tất cả users

**Preconditions**: User đã đăng nhập

**Main Flow**:
1. User click notification icon
2. Hệ thống hiển thị danh sách notifications
3. User có thể:
   - Xem chi tiết notification
   - Mark as read
   - Dismiss notification
   - Mark all as read

**Postconditions**: User đã xem notifications

---

### UC-09: Xem Analytics Dashboard

**Actor**: Admin, Consultant, Teacher/Supervisor, Data Scientist

**Preconditions**: User đã đăng nhập

**Main Flow**:
1. User truy cập Analytics page
2. Hệ thống hiển thị:
   - Overview metrics (total students, high risk, sessions)
   - Student distribution (by risk level, department)
   - Trends (stress, anxiety, depression over time)
   - Charts và visualizations
3. User có thể filter theo:
   - Date range
   - Consultant (Admin only)
   - Department

**Alternative Flows**:
- 2a. Consultant chỉ thấy analytics của students được assign
- 2b. Teacher chỉ có thể xem, không thể export

**Postconditions**: User đã xem analytics

---

### UC-10: Quản Lý ML Models (Data Scientist)

**Actor**: Admin, Data Scientist

**Preconditions**: User đã đăng nhập với role data_scientist hoặc admin

**Main Flow**:
1. User truy cập ML Models page
2. Hệ thống hiển thị danh sách models
3. User có thể:
   - Tạo model mới
   - Xem chi tiết model
   - Train model với dataset
   - Deploy model
   - Xóa model (nếu không active)

**Alternative Flows**:
- 3a. Model phải được train trước khi deploy
- 3b. Chỉ một model active per type

**Postconditions**: ML models được quản lý thành công

---

### UC-11: Upload Dataset

**Actor**: Admin, Data Scientist

**Preconditions**: User đã đăng nhập với role data_scientist hoặc admin

**Main Flow**:
1. User truy cập Datasets page
2. User click "Upload Dataset"
3. User chọn file (CSV, JSON, Excel)
4. User nhập metadata (name, description)
5. Hệ thống upload file
6. Hệ thống parse và analyze dataset
7. Hệ thống lưu dataset info và statistics

**Alternative Flows**:
- 3a. Invalid file format → Error message
- 3b. File quá lớn → Error message
- 6a. Parse error → Error message với details

**Postconditions**: Dataset được upload thành công

---

### UC-12: Train ML Model

**Actor**: Admin, Data Scientist

**Preconditions**: User đã đăng nhập, có model và dataset

**Main Flow**:
1. User chọn model
2. User click "Train"
3. User chọn dataset
4. User config train/test split (optional)
5. Hệ thống gọi ML service để train
6. Hệ thống cập nhật model với metrics (accuracy, precision, recall, F1)
7. Hệ thống hiển thị training results

**Alternative Flows**:
- 5a. ML service unavailable → Error message
- 5b. Training failed → Error message với details

**Postconditions**: Model được train thành công

---

### UC-13: Deploy ML Model

**Actor**: Admin, Data Scientist

**Preconditions**: User đã đăng nhập, model đã được train

**Main Flow**:
1. User chọn trained model
2. User click "Deploy"
3. Hệ thống deactivate các models cùng type khác
4. Hệ thống activate model này
5. Hệ thống cập nhật status thành "deployed"

**Alternative Flows**:
- 2a. Model chưa được train → Error message
- 2b. Model đã deployed → Confirmation message

**Postconditions**: Model được deploy thành công

---

### UC-14: Quản Lý Users (Admin Only)

**Actor**: Admin

**Preconditions**: User đã đăng nhập với role admin

**Main Flow**:
1. User truy cập Users page
2. Hệ thống hiển thị danh sách users
3. User có thể:
   - Tạo user mới
   - Xem chi tiết user
   - Cập nhật user (role, status)
   - Xóa user (soft delete)

**Alternative Flows**:
- 3a. Không thể xóa chính mình
- 3b. Không thể thay đổi role của chính mình

**Postconditions**: Users được quản lý thành công

---

## 4. Use Case Diagram

```
┌─────────────┐
│    Admin    │
└──────┬──────┘
       │
       ├─ UC-01: Login
       ├─ UC-02: Logout
       ├─ UC-03: Manage Students
       ├─ UC-04: View Mental Health Records
       ├─ UC-05: Create Mental Health Record
       ├─ UC-06: Manage Sessions
       ├─ UC-09: View Analytics
       ├─ UC-10: Manage ML Models
       ├─ UC-11: Upload Dataset
       ├─ UC-12: Train Model
       ├─ UC-13: Deploy Model
       └─ UC-14: Manage Users

┌─────────────┐
│ Consultant  │
└──────┬──────┘
       │
       ├─ UC-01: Login
       ├─ UC-02: Logout
       ├─ UC-03: Manage Students (assigned only)
       ├─ UC-04: View Mental Health Records
       ├─ UC-05: Create Mental Health Record
       ├─ UC-06: Manage Sessions (own only)
       ├─ UC-07: Create Session
       └─ UC-09: View Analytics (assigned students)

┌─────────────┐
│   Teacher   │
└──────┬──────┘
       │
       ├─ UC-01: Login
       ├─ UC-02: Logout
       ├─ UC-04: View Mental Health Records (read-only)
       └─ UC-09: View Analytics (read-only)

┌─────────────┐
│Data Scientist│
└──────┬──────┘
       │
       ├─ UC-01: Login
       ├─ UC-02: Logout
       ├─ UC-09: View Analytics
       ├─ UC-10: Manage ML Models
       ├─ UC-11: Upload Dataset
       ├─ UC-12: Train Model
       └─ UC-13: Deploy Model
```

## 5. User Stories

### Epic 1: Authentication & Authorization
- **US-1.1**: Là một user, tôi muốn đăng nhập để truy cập hệ thống
- **US-1.2**: Là một user, tôi muốn đăng xuất để bảo mật tài khoản
- **US-1.3**: Là một user, tôi muốn session được tự động refresh để không bị logout giữa chừng

### Epic 2: Student Management
- **US-2.1**: Là một consultant, tôi muốn xem danh sách students được assign để quản lý
- **US-2.2**: Là một admin, tôi muốn tạo student mới để thêm vào hệ thống
- **US-2.3**: Là một consultant, tôi muốn tìm kiếm student để nhanh chóng tìm thấy

### Epic 3: Mental Health Tracking
- **US-3.1**: Là một consultant, tôi muốn tạo mental health record để theo dõi tình trạng student
- **US-3.2**: Là một consultant, tôi muốn xem lịch sử mental health records để thấy trends
- **US-3.3**: Là một consultant, tôi muốn hệ thống tự động tính risk score để đánh giá mức độ rủi ro

### Epic 4: Counseling Sessions
- **US-4.1**: Là một consultant, tôi muốn tạo counseling session để lên lịch tư vấn
- **US-4.2**: Là một consultant, tôi muốn cập nhật session outcome sau khi hoàn thành
- **US-4.3**: Là một consultant, tôi muốn xem upcoming sessions để chuẩn bị

### Epic 5: Analytics & Reporting
- **US-5.1**: Là một admin, tôi muốn xem overview metrics để nắm tình hình tổng thể
- **US-5.2**: Là một teacher, tôi muốn xem trends để hiểu xu hướng sức khỏe tinh thần
- **US-5.3**: Là một consultant, tôi muốn xem analytics của students được assign

### Epic 6: ML Models
- **US-6.1**: Là một data scientist, tôi muốn upload dataset để train models
- **US-6.2**: Là một data scientist, tôi muốn train model để tạo predictive models
- **US-6.3**: Là một data scientist, tôi muốn deploy model để sử dụng trong production

## 6. Acceptance Criteria

Mỗi use case cần đáp ứng:
- ✅ Functional requirements được implement đúng
- ✅ Security requirements (authentication, authorization)
- ✅ Performance requirements (response time < 200ms)
- ✅ Error handling và validation
- ✅ User-friendly error messages
- ✅ Audit logging cho các actions quan trọng

## 7. References

- [User Roles & Permissions](./05-User-Roles-Permissions.md)
- [API Documentation](./06-API-Documentation.md)
- [Software Architecture](./01-Software-Architecture.md)


