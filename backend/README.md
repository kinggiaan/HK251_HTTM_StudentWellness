# Backend Service - Student Mental Health Dashboard

## Kiến trúc & Công nghệ
- **Ngôn ngữ:** TypeScript (Node.js 20+, khuyến nghị 24 LTS)
- **Framework:** Express.js + Socket.IO cho realtime
- **ORM:** Prisma kết nối PostgreSQL
- **Auth:** JWT access token + refresh token, bcrypt hashing
- **Caching/Queueing:** Redis (tích hợp session cache / rate limit / pubsub realtime)
- **Validation:** Zod
- **Testing:** Vitest + Supertest
- **CI/CD:** Scripts npm (lint, test, build). Tài liệu deploy bằng Docker Compose.

## Cấu trúc thư mục
```
backend/
  prisma/
    schema.prisma        # Định nghĩa DB + generator
    seeds/               # Seed data
  src/
    app.ts               # Khởi tạo express app
    server.ts            # Bootstrap server + websocket
    config/              # Env, logger, db
    middleware/          # auth, error, validation, rate-limit
    utils/               # helper functions
    modules/
      auth/
      users/
      students/
      mentalHealth/
      sessions/
      notifications/
      analytics/
      datasets/
      mlModels/
    websocket/           # Socket channel definitions
  tests/                 # Integration/unit tests
  Dockerfile
  docker-compose.yml     # Dev stack (api + postgres + redis + ml-service stub)
  package.json
  tsconfig.json
  prisma/seed.ts
```

## Lộ trình triển khai
1. Khởi tạo dự án Node/TS, thiết lập lint/test/build.
2. Định nghĩa schema Prisma cho bảng: users, students, mental_health_records, counseling_sessions, notifications, ml_models, datasets, refresh_tokens, audit_logs.
3. Cài đặt middleware chung (logging, cors, helmet, rate limit).
4. Triển khai mô-đun lần lượt:
   - `auth`: đăng nhập, refresh, logout, change password.
   - `users`: CRUD cơ bản (phục vụ quản trị).
   - `students`: CRUD + phân trang + filter + RBAC.
   - `mentalHealth`: records CRUD, query theo range.
   - `sessions`: quản lý buổi tư vấn.
   - `notifications`: list, read, dismiss, real-time push.
   - `analytics`: tổng hợp thống kê (dùng prisma aggregate + caching).
   - `datasets` & `mlModels`: CRUD, upload, training triggers (mock service call tới `ML_SERVICE_URL`).
5. Tích hợp Socket.IO layer cho sự kiện realtime.
6. Thêm seed data, unit/integration tests, scripts CI.
7. Viết tài liệu deploy + cấu hình `.env.example`.

## Ghi chú
- Áp dụng RBAC theo `role` trong JWT payload + middleware `requireRole`.
- Endpoint ML training/deploy tạm thời gọi service giả (stub) qua HTTP; có thể thay bằng queue sau.
- Dùng S3 client abstraction (`@aws-sdk/client-s3`) nhưng trong dev dùng storage cục bộ (MinIO).
- Phân tách logic (`service` layer) để dễ test.


