# User Roles & Permissions

## 1. Tổng Quan

Tài liệu này mô tả chi tiết các vai trò người dùng và quyền hạn trong hệ thống Student Mental Health Dashboard.

## 2. Roles

### 2.1 Admin
**Mô tả**: Quản trị viên hệ thống với quyền truy cập đầy đủ

**Permissions**:
- ✅ Quản lý users (CRUD)
- ✅ Quản lý students (CRUD - tất cả students)
- ✅ Quản lý mental health records (CRUD)
- ✅ Quản lý counseling sessions (CRUD - tất cả sessions)
- ✅ Quản lý notifications (CRUD)
- ✅ Xem analytics (tất cả data)
- ✅ Quản lý ML models (CRUD)
- ✅ Quản lý datasets (CRUD)
- ✅ Xem audit logs

**Restrictions**: Không có

---

### 2.2 Consultant
**Mô tả**: Tư vấn viên - quản lý students được assign và counseling sessions

**Permissions**:
- ✅ Xem profile của chính mình
- ✅ Quản lý students được assign (CRUD)
- ✅ Xem mental health records của students được assign
- ✅ Tạo mental health records cho students được assign
- ✅ Quản lý counseling sessions của chính mình (CRUD)
- ✅ Xem notifications của chính mình
- ✅ Tạo notifications
- ✅ Xem analytics (chỉ students được assign)

**Restrictions**:
- ❌ Không thể quản lý users
- ❌ Không thể xem students của consultant khác
- ❌ Không thể tạo sessions cho consultant khác
- ❌ Không thể thay đổi consultantId của session
- ❌ Không thể quản lý ML models
- ❌ Không thể quản lý datasets

---

### 2.3 Teacher/Supervisor
**Mô tả**: Giáo viên/Giám sát - xem tổng quan và analytics (read-only)

**Permissions**:
- ✅ Xem profile của chính mình
- ✅ Xem danh sách students (read-only)
- ✅ Xem chi tiết student (read-only)
- ✅ Xem mental health records (read-only)
- ✅ Xem analytics và trends (read-only)
- ✅ Xem notifications của chính mình

**Restrictions**:
- ❌ Không thể tạo/sửa/xóa students
- ❌ Không thể tạo/sửa/xóa mental health records
- ❌ Không thể quản lý counseling sessions
- ❌ Không thể quản lý users
- ❌ Không thể quản lý ML models
- ❌ Không thể quản lý datasets
- ❌ Không thể tạo notifications

---

### 2.4 Data Scientist
**Mô tả**: Nhà khoa học dữ liệu - quản lý ML models và datasets

**Permissions**:
- ✅ Xem profile của chính mình
- ✅ Quản lý ML models (CRUD)
- ✅ Upload và quản lý datasets (CRUD)
- ✅ Train và deploy ML models
- ✅ Xem analytics và trends
- ✅ Xem notifications của chính mình

**Restrictions**:
- ❌ Không thể quản lý users
- ❌ Không thể quản lý students
- ❌ Không thể quản lý mental health records
- ❌ Không thể quản lý counseling sessions
- ❌ Không thể tạo notifications (trừ system notifications)

---

## 3. Permission Matrix

| Feature | Admin | Consultant | Teacher | Data Scientist |
|---------|-------|------------|---------|----------------|
| **Users** |
| View all users | ✅ | ❌ | ❌ | ❌ |
| Create user | ✅ | ❌ | ❌ | ❌ |
| Update user | ✅ | ❌ | ❌ | ❌ |
| Delete user | ✅ | ❌ | ❌ | ❌ |
| **Students** |
| View all students | ✅ | ❌ | ✅ (read) | ❌ |
| View assigned students | ✅ | ✅ | ✅ (read) | ❌ |
| Create student | ✅ | ✅ (assigned only) | ❌ | ❌ |
| Update student | ✅ | ✅ (assigned only) | ❌ | ❌ |
| Delete student | ✅ | ✅ (assigned only) | ❌ | ❌ |
| **Mental Health Records** |
| View all records | ✅ | ❌ | ✅ (read) | ❌ |
| View assigned records | ✅ | ✅ | ✅ (read) | ❌ |
| Create record | ✅ | ✅ (assigned only) | ❌ | ❌ |
| Update record | ✅ | ✅ (assigned only) | ❌ | ❌ |
| Delete record | ✅ | ✅ (assigned only) | ❌ | ❌ |
| **Counseling Sessions** |
| View all sessions | ✅ | ❌ | ❌ | ❌ |
| View own sessions | ✅ | ✅ | ❌ | ❌ |
| Create session | ✅ | ✅ (own only) | ❌ | ❌ |
| Update session | ✅ | ✅ (own only) | ❌ | ❌ |
| Delete session | ✅ | ✅ (own only) | ❌ | ❌ |
| **Notifications** |
| View own notifications | ✅ | ✅ | ✅ | ✅ |
| Create notification | ✅ | ✅ | ❌ | ❌ |
| **Analytics** |
| View all analytics | ✅ | ❌ | ✅ (read) | ✅ |
| View assigned analytics | ✅ | ✅ | ✅ (read) | ✅ |
| **ML Models** |
| View models | ✅ | ❌ | ❌ | ✅ |
| Create model | ✅ | ❌ | ❌ | ✅ |
| Train model | ✅ | ❌ | ❌ | ✅ |
| Deploy model | ✅ | ❌ | ❌ | ✅ |
| Delete model | ✅ | ❌ | ❌ | ✅ |
| **Datasets** |
| View datasets | ✅ | ❌ | ❌ | ✅ |
| Upload dataset | ✅ | ❌ | ❌ | ✅ |
| Delete dataset | ✅ | ❌ | ❌ | ✅ |

## 4. RBAC Implementation

### 4.1 Backend Implementation

**Middleware**: `authorize([UserRole.admin, UserRole.consultant])`

**Service Layer**: Kiểm tra permissions trong service functions

**Example**:
```typescript
// In student.service.ts
if (context.role === 'consultant') {
  where.consultantId = context.userId; // Only see assigned students
}
```

### 4.2 Frontend Implementation

**Route Protection**: Dựa trên user role

**Component Level**: Ẩn/hiện features dựa trên permissions

**Example**:
```typescript
// In App.tsx
const roleMap = {
  consultant: "consultant",
  teacher_supervisor: "teacher",
  data_scientist: "dataScientist",
  admin: "consultant" // Admin can access consultant dashboard
};
```

## 5. Data Filtering Rules

### 5.1 Consultant
- **Students**: Chỉ thấy students có `consultantId = currentUserId`
- **Sessions**: Chỉ thấy sessions có `consultantId = currentUserId`
- **Records**: Chỉ thấy records của students được assign

### 5.2 Teacher/Supervisor
- **Students**: Thấy tất cả students (read-only)
- **Records**: Thấy tất cả records (read-only)
- **Analytics**: Thấy analytics của tất cả students

### 5.3 Data Scientist
- **Students**: Không thấy
- **Analytics**: Thấy analytics tổng thể (không filter theo consultant)

## 6. Security Considerations

### 6.1 Token-based Authentication
- JWT tokens chứa user role
- Backend validate role cho mỗi request
- Frontend không thể bypass role checks

### 6.2 Data Isolation
- Consultant chỉ thấy data của mình
- Database queries tự động filter theo role
- Không có data leakage giữa consultants

### 6.3 Audit Logging
- Tất cả actions được log với userId và role
- Admin có thể xem audit logs
- Compliance và security auditing

## 7. Future Enhancements

### 7.1 Granular Permissions
- Permission-based thay vì role-based
- Custom roles với specific permissions
- Permission inheritance

### 7.2 Multi-tenant Support
- Organization-level isolation
- Department-level permissions
- Hierarchical access control

## 8. References

- [Use Cases](./04-Use-Cases.md)
- [Software Architecture](./01-Software-Architecture.md)
- [Security Architecture](./14-Security-Architecture.md)


