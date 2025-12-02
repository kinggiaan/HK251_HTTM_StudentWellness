# Hướng Dẫn Chạy Project - Student Mental Health Dashboard

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: v20.11.0 trở lên (khuyến nghị v24 LTS)
- **Docker & Docker Compose**: Để chạy PostgreSQL và Redis
- **npm** hoặc **yarn**: Package manager

## 🚀 Cách Chạy Nhanh

### Bước 1: Kiểm Tra Node.js Version

```bash
node --version
# Phải >= 20.11.0
```

Nếu chưa có hoặc version cũ, tải từ: https://nodejs.org/

### Bước 2: Khởi Động Backend Services (PostgreSQL & Redis)

Mở terminal/PowerShell và chạy:

**Trên Windows (PowerShell):**
```powershell
cd backend
.\scripts\windows-start-services.ps1
```

**Hoặc dùng Docker Compose trực tiếp:**
```bash
cd backend
docker compose up -d postgres redis
```

Kiểm tra services đang chạy:
```bash
docker compose ps
```

### Bước 3: Setup Backend

```bash
cd backend

# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env từ template
Copy-Item env.example .env
# (Hoặc tạo thủ công file .env với nội dung từ env.example)

# 3. Chạy database migrations
npm run migrate:dev

# 4. Seed dữ liệu mẫu (tạo users, students, records)
npm run seed

# 5. Build TypeScript
npm run build
```

### Bước 4: Chạy Backend Server

```bash
# Development mode (với hot reload)
npm run dev

# Hoặc production mode
npm start
```

Backend sẽ chạy tại: **http://localhost:4000**

Kiểm tra health check:
```bash
curl http://localhost:4000/health
```

### Bước 5: Setup Frontend

Mở terminal/PowerShell mới:

```bash
# Về root directory
cd ..

# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env
# Tạo file .env trong root directory với nội dung:
# VITE_API_BASE_URL=http://localhost:4000/api
```

Tạo file `.env`:
```bash
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
```

### Bước 6: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000** (hoặc port khác nếu 3000 bị chiếm)

## 🔐 Tài Khoản Đăng Nhập Mẫu

Sau khi chạy `npm run seed`, bạn có thể đăng nhập với:

### Consultant (Tư vấn viên)
- **Email**: `consultant@university.edu`
- **Password**: `password123`

### Teacher/Supervisor (Giáo viên/Giám sát)
- **Email**: `teacher@university.edu`
- **Password**: `password123`

### Data Scientist (Nhà khoa học dữ liệu)
- **Email**: `datascientist@university.edu`
- **Password**: `password123`

### Admin
- **Email**: `admin@university.edu`
- **Password**: `password123`

## 📝 Kiểm Tra Kết Nối

### 1. Kiểm Tra Backend
```bash
# Health check
curl http://localhost:4000/health

# Hoặc mở browser: http://localhost:4000/health
```

### 2. Kiểm Tra Database
```bash
cd backend
npm run prisma:studio
# Mở Prisma Studio tại: http://localhost:5555
```

### 3. Kiểm Tra Frontend
- Mở browser: http://localhost:3000
- Thử đăng nhập với một trong các tài khoản trên

## 🛠️ Troubleshooting

### Lỗi: "Database server was reached but timed out"
```bash
# Dừng và khởi động lại Docker services
cd backend
docker compose down
docker compose up -d postgres redis

# Đợi 5-10 giây rồi thử lại
npm run migrate:dev
```

### Lỗi: "Port 4000 already in use"
```bash
# Tìm process đang dùng port 4000
netstat -ano | findstr :4000

# Hoặc đổi port trong backend/.env
PORT=4001
```

### Lỗi: "Port 3000 already in use"
- Vite sẽ tự động chọn port khác (3001, 3002, ...)
- Hoặc đổi port trong `vite.config.ts`

### Lỗi: "Cannot connect to API"
- Kiểm tra backend đang chạy: http://localhost:4000/health
- Kiểm tra CORS trong `backend/src/app.ts`
- Kiểm tra `VITE_API_BASE_URL` trong frontend `.env`

### Lỗi: "Prisma schema validation"
```bash
# Đảm bảo file .env tồn tại
cd backend
Copy-Item env.example .env

# Generate Prisma client
npm run prisma:generate
```

## 📂 Cấu Trúc Project

```
HTTM_Project/
├── backend/              # Backend API (Node.js + Express + Prisma)
│   ├── src/
│   ├── prisma/
│   ├── scripts/
│   └── package.json
├── src/                  # Frontend (React + Vite)
│   ├── components/
│   ├── services/
│   ├── contexts/
│   └── hooks/
└── package.json          # Frontend package.json
```

## 🔄 Quy Trình Development

### 1. Khởi động lần đầu:
```bash
# Terminal 1: Backend services
cd backend
docker compose up -d

# Terminal 2: Backend API
cd backend
npm run dev

# Terminal 3: Frontend
npm run dev
```

### 2. Khi có thay đổi database schema:
```bash
cd backend
npm run migrate:dev
npm run prisma:generate
```

### 3. Khi cần reset database:
```bash
cd backend
docker compose down -v
docker compose up -d
npm run migrate:dev
npm run seed
```

## 📚 Tài Liệu Tham Khảo

- Backend README: `backend/README.md`
- Backend Requirements: `src/BACKEND_REQUIREMENTS.md`
- Windows Setup: `backend/WINDOWS_SETUP.md`
- WSL Setup: `backend/WSL_SETUP.md`

## ✅ Checklist Trước Khi Chạy

- [ ] Node.js >= 20.11.0 đã cài đặt
- [ ] Docker Desktop đang chạy
- [ ] Backend `.env` file đã tạo
- [ ] Frontend `.env` file đã tạo với `VITE_API_BASE_URL`
- [ ] Database migrations đã chạy
- [ ] Seed data đã chạy
- [ ] Backend server đang chạy (port 4000)
- [ ] Frontend dev server đang chạy (port 3000)

---

**Lưu ý**: Nếu gặp lỗi, kiểm tra logs trong terminal hoặc xem phần Troubleshooting ở trên.

