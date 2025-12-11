# 🚀 Hướng Dẫn Chạy Project - Step by Step

## Bước 1: Kiểm Tra Prerequisites

### 1.1 Kiểm tra Node.js
```bash
node --version
# Phải >= 20.11.0
```

### 1.2 Kiểm tra Docker
```bash
docker --version
docker compose version
```

### 1.3 Kiểm tra Docker Services đang chạy
```bash
cd backend
docker compose ps
```

Nếu chưa chạy, khởi động:
```bash
docker compose up -d postgres redis
```

## Bước 2: Setup Backend

### 2.1 Cài đặt Dependencies
```bash
cd backend
npm install
```

### 2.2 Tạo File .env
```bash
# Kiểm tra xem file .env đã có chưa
# Nếu chưa có, copy từ env.example:
Copy-Item env.example .env
```

**Nội dung file `.env` cần có:**
```
NODE_ENV=development
PORT=4000
HOST=0.0.0.0

DATABASE_URL=postgresql://admin:password@localhost:5432/mental_health_db
SHADOW_DATABASE_URL=postgresql://admin:password@localhost:5432/mental_health_db_shadow

JWT_SECRET=change-me
JWT_EXPIRY=24h
REFRESH_TOKEN_SECRET=change-me-too
REFRESH_TOKEN_EXPIRY=7d
BCRYPT_SALT_ROUNDS=12

REDIS_URL=redis://localhost:6379

FRONTEND_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

### 2.3 Chạy Database Migrations
```bash
npm run migrate:dev
```

**Nếu gặp lỗi về shadow database:**
```bash
# Tạo shadow database
docker compose exec postgres psql -U admin -d postgres -c "CREATE DATABASE mental_health_db_shadow;"

# Chạy lại migration
npm run migrate:dev
```

### 2.4 Seed Dữ Liệu Mẫu
```bash
npm run seed
```

### 2.5 Build Backend
```bash
npm run build
```

### 2.6 Chạy Backend Server
```bash
# Development mode (hot reload)
npm run dev

# Hoặc production mode
npm start
```

**Backend sẽ chạy tại: http://localhost:4000**

Kiểm tra:
- Mở browser: http://localhost:4000/health
- Hoặc: `curl http://localhost:4000/health`

## Bước 3: Setup Frontend

### 3.1 Cài đặt Dependencies
```bash
# Về root directory
cd ..

npm install
```

### 3.2 Tạo File .env
Tạo file `.env` trong root directory với nội dung:
```
VITE_API_BASE_URL=http://localhost:4000/api
```

**Hoặc dùng PowerShell:**
```powershell
echo "VITE_API_BASE_URL=http://localhost:4000/api" | Out-File -FilePath .env -Encoding utf8
```

### 3.3 Chạy Frontend

**⚠️ QUAN TRỌNG**: Đảm bảo bạn đang ở **root directory** (`D:\HCMUT\HTTM\HTTM_Project`), KHÔNG phải trong thư mục `src`!

```bash
# Kiểm tra bạn đang ở đúng thư mục
# Phải thấy file package.json và vite.config.mts

# Nếu đang ở trong thư mục src, quay về root:
cd ..  # hoặc cd D:\HCMUT\HTTM\HTTM_Project

# Cài đặt dependencies (nếu chưa có node_modules)
npm install

# Chạy frontend
npm run dev
```

**Frontend sẽ chạy tại: http://localhost:3000** (hoặc port khác nếu 3000 bị chiếm)

**Lưu ý**: Nếu gặp lỗi `'vite' is not recognized`:
1. ✅ Kiểm tra bạn đang ở root directory (có file `package.json`)
2. ✅ Chạy `npm install` để cài đặt dependencies
3. ✅ Đảm bảo `node_modules` folder tồn tại

## Bước 4: Đăng Nhập

Mở browser: **http://localhost:3000**

### Tài Khoản Test:

**Consultant:**
- Email: `consultant@university.edu`
- Password: `password123`

**Teacher:**
- Email: `teacher@university.edu`
- Password: `password123`

**Data Scientist:**
- Email: `datascientist@university.edu`
- Password: `password123`

**Admin:**
- Email: `admin@university.edu`
- Password: `password123`

## 📋 Checklist Nhanh

```
[ ] Node.js >= 20.11.0
[ ] Docker Desktop đang chạy
[ ] PostgreSQL & Redis containers đang chạy
[ ] Backend .env file đã tạo
[ ] Backend dependencies đã cài (npm install)
[ ] Database migrations đã chạy (npm run migrate:dev)
[ ] Seed data đã chạy (npm run seed)
[ ] Backend server đang chạy (npm run dev)
[ ] Frontend .env file đã tạo với VITE_API_BASE_URL
[ ] Frontend dependencies đã cài (npm install)
[ ] Frontend server đang chạy (npm run dev)
[ ] Đã mở http://localhost:3000 và thử đăng nhập
```

## 🔧 Troubleshooting

### Backend không kết nối được database
```bash
# Kiểm tra Docker services
cd backend
docker compose ps

# Nếu không chạy, khởi động lại
docker compose down
docker compose up -d postgres redis

# Đợi 10 giây rồi thử lại
npm run migrate:dev
```

### Frontend không kết nối được API
1. Kiểm tra backend đang chạy: http://localhost:4000/health
2. Kiểm tra file `.env` có `VITE_API_BASE_URL=http://localhost:4000/api`
3. Restart frontend server

### Port đã bị sử dụng
- Backend: Đổi `PORT=4001` trong `backend/.env`
- Frontend: Vite tự động chọn port khác

### Lỗi Prisma
```bash
cd backend
npm run prisma:generate
npm run migrate:dev
```

### Lỗi: "error from registry: denied" khi chạy docker compose
```bash
# Service ml-service không cần thiết cho backend cơ bản
# Chỉ chạy postgres và redis:
cd backend
docker compose up -d postgres redis
```

### Lỗi: "Database mental_health_db_shadow does not exist"
```bash
# Tạo shadow database cho Prisma migrations
cd backend
docker compose exec postgres psql -U admin -d postgres -c "CREATE DATABASE mental_health_db_shadow;"

# Chạy lại migration
npm run migrate:dev
```

## 📚 Các Lệnh Hữu Ích

### Backend
```bash
cd backend

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Test
npm run test

# Prisma Studio (xem database)
npm run prisma:studio

# Reset database
docker compose down -v
docker compose up -d postgres redis
npm run migrate:dev
npm run seed
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build
```

### Docker
```bash
cd backend

# Xem logs
docker compose logs -f

# Dừng services
docker compose down

# Khởi động services (chỉ postgres và redis, không cần ml-service)
docker compose up -d postgres redis

# Xem status
docker compose ps
```

## 🎯 Quy Trình Development Hàng Ngày

1. **Khởi động Docker services:**
   ```bash
   cd backend
   docker compose up -d postgres redis
   ```

2. **Chạy Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

3. **Chạy Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

4. **Mở browser:** http://localhost:3000

---

**Chúc bạn code vui vẻ! 🎉**

