# Hướng dẫn tạo dữ liệu sinh viên ảo

## Mô tả
Script `seed-students-virtual.js` tự động tạo 50 sinh viên ảo với dữ liệu ngẫu nhiên dựa trên các mẫu từ file CSV.

## Cấu trúc dữ liệu sinh viên

Mỗi sinh viên có các trường sau:

- **name**: Tên sinh viên (tự động tạo tên tiếng Việt)
- **gender**: Giới tính (Male/Female)
- **age**: Tuổi (18-34)
- **city**: Thành phố (các thành phố lớn ở Việt Nam)
- **academic_pressure**: Áp lực học tập (1-5)
- **cgpa**: Điểm trung bình tích lũy (5.0-10.0)
- **study_satisfaction**: Mức độ hài lòng với việc học (1-5)
- **sleep_duration**: Thời gian ngủ ("Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours")
- **dietary_habits**: Thói quen ăn uống ("Healthy", "Moderate", "Unhealthy")
- **degree**: Bậc học/Khóa học
- **work_study_hours**: Giờ làm việc/học (0-12)
- **financial_stress**: Căng thẳng tài chính (1-5)
- **family_his_of_mental_illness**: Tiền sử bệnh tâm thần trong gia đình ("Yes"/"No")
- **depression_truth**: Nhãn thật về trầm cảm (0/1)
- **depression_predicting**: Dự đoán từ ML model (null - sẽ được cập nhật sau)
- **validated**: Đã được xác thực chưa (false)

## Cách sử dụng

### Bước 1: Đảm bảo backend đang chạy

```bash
cd backend
npm run dev
```

Backend phải chạy ở `http://localhost:1337`

### Bước 2: Cấu hình thông tin admin

Mở file `seed-students-virtual.js` và cập nhật:

```javascript
const ADMIN_EMAIL = 'admin@example.com'; // Email admin của bạn
const ADMIN_PASSWORD = 'Admin123!'; // Mật khẩu admin của bạn
```

### Bước 3: Chạy script

```bash
cd backend
node seed-students-virtual.js
```

## Kết quả mong đợi

```
🔐 Logging in as admin...
✅ Login successful!

📝 Generated 50 virtual students

📝 Creating students in database...
✅ [1/50] Created: Nguyen Van An (Age: 24, CGPA: 7.85, Depression: 0)
✅ [2/50] Created: Tran Thi Binh (Age: 29, CGPA: 5.42, Depression: 1)
...

============================================================
✅ Seeding completed!
📊 Summary:
   - Total generated: 50
   - Successfully created: 50
   - Skipped (duplicates): 0
   - Errors: 0
============================================================

📈 Depression Statistics:
   - With depression risk: 23 (46.0%)
   - Without depression risk: 27 (54.0%)
```

## Thuật toán tính điểm trầm cảm

Script sử dụng heuristic đơn giản để tính điểm nguy cơ trầm cảm:

- Áp lực học tập ≥ 4: +0.2
- Mức độ hài lòng ≤ 2: +0.2
- Giờ học/làm ≥ 10: +0.15
- Căng thẳng tài chính ≥ 4: +0.2
- Ngủ ít hơn 5 giờ: +0.15
- CGPA < 6.0: +0.1

Nếu tổng điểm ≥ 0.5 → depression_truth = 1 (có nguy cơ trầm cảm)

## Tùy chỉnh

### Thay đổi số lượng sinh viên

Trong file `seed-students-virtual.js`, dòng 133:

```javascript
const students = generateStudents(50); // Đổi 50 thành số khác
```

### Thêm thành phố

Dòng 11-14:

```javascript
const vietnameseCities = [
  'Ho Chi Minh', 'Hanoi', 'Da Nang', 'Can Tho', 'Hai Phong',
  'Bien Hoa', 'Nha Trang', 'Hue', 'Vung Tau', 'Buon Ma Thuot',
  'Your City Here' // Thêm thành phố mới
];
```

### Thêm tên

Dòng 16-24:

```javascript
const firstNames = [
  'An', 'Binh', 'Cuong', ..., 'YourName' // Thêm tên mới
];
```

## Xử lý lỗi

### Lỗi 401 (Authentication failed)

- Kiểm tra backend đang chạy
- Kiểm tra email và password admin
- Đảm bảo tài khoản admin tồn tại

### Lỗi 400 (Bad Request)

- Có thể do dữ liệu trùng lặp
- Script sẽ tự động skip các sinh viên trùng

### Connection refused

- Backend chưa chạy hoặc chạy ở port khác
- Kiểm tra `API_URL` trong script

## Kiểm tra dữ liệu

Sau khi chạy xong, bạn có thể:

1. Kiểm tra qua Postman:
   - GET `http://localhost:1337/api/students`
   - Header: `Authorization: Bearer YOUR_JWT_TOKEN`

2. Kiểm tra qua Strapi Admin:
   - Mở `http://localhost:1337/admin`
   - Vào Content Manager → Students

## Ghi chú

- Script có delay 100ms giữa mỗi request để tránh quá tải server
- Dữ liệu được tạo ngẫu nhiên nhưng tuân theo các pattern thực tế
- Điểm CGPA, tuổi, và các chỉ số khác đều trong phạm vi hợp lý
- depression_predicting sẽ là null, cần chạy ML model để dự đoán sau
