# 📖 Hướng Dẫn Chạy Project - Tiếng Việt

## 🎯 Tổng Quan

Project này gồm 2 phần:
- **Backend**: API server chạy trên port 4000
- **Frontend**: Web app chạy trên port 3000

## ⚡ Cách Chạy Nhanh Nhất

### Option 1: Dùng Script Tự Động (Khuyến nghị)

```powershell
.\start-project.ps1
```

Script này sẽ tự động:
- ✅ Kiểm tra Node.js và Docker
- ✅ Khởi động PostgreSQL & Redis
- ✅ Tạo file .env nếu chưa có
- ✅ Cài đặt dependencies
- ✅ Chạy migrations và seed data

Sau đó bạn chỉ cần:
1. Mở Terminal 1: `cd backend` → `npm run dev`
2. Mở Terminal 2: `npm run dev`
3. Mở browser: http://localhost:3000

### Option 2: Chạy Thủ Công

## 📋 Bước 1: Chuẩn Bị

### 1.1 Kiểm Tra Node.js
```bash
node --version
# Phải >= 20.11.0 (Bạn đang có v24.11.0 ✅)
```

### 1.2 Kiểm Tra Docker
```bash
docker --version
docker compose version
```

### 1.3 Khởi Động Docker Services
```bash
cd backend
docker compose up -d postgres redis
```

Kiểm tra:
```bash
docker compose ps
# Phải thấy postgres và redis đang chạy
```

## 📋 Bước 2: Setup Backend

### 2.1 Cài Đặt Dependencies
```bash
cd backend
npm install
```

### 2.2 Tạo File .env
```bash
# Nếu chưa có file .env
Copy-Item env.example .env
```

### 2.3 Chạy Database Migrations
```bash
npm run migrate:dev
```

Nếu gặp lỗi về shadow database:
```bash
docker compose exec postgres psql -U admin -c "CREATE DATABASE mental_health_db_shadow;"
npm run migrate:dev
```

### 2.4 Seed Dữ Liệu Mẫu
```bash
npm run seed
```

Tài khoản sẽ được tạo:
- Consultant: `consultant@university.edu` / `password123`
- Teacher: `teacher@university.edu` / `password123`
- Data Scientist: `datascientist@university.edu` / `password123`
- Admin: `admin@university.edu` / `password123`

### 2.5 Chạy Backend
```bash
npm run dev
```

Backend sẽ chạy tại: **http://localhost:4000**

Kiểm tra: Mở http://localhost:4000/health

## 📋 Bước 3: Setup Frontend

### 3.1 Cài Đặt Dependencies
```bash
# Về root directory
cd ..
npm install
```

### 3.2 Tạo File .env
Tạo file `.env` trong root với nội dung:
```
VITE_API_BASE_URL=http://localhost:4000/api
```

Hoặc dùng PowerShell:
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

Frontend sẽ chạy tại: **http://localhost:3000**

**Lưu ý**: Nếu gặp lỗi `'vite' is not recognized`:
1. ✅ Kiểm tra bạn đang ở root directory (có file `package.json`)
2. ✅ Chạy `npm install` để cài đặt dependencies
3. ✅ Đảm bảo `node_modules` folder tồn tại

## 📋 Bước 4: Đăng Nhập

1. Mở browser: **http://localhost:3000**
2. Đăng nhập với một trong các tài khoản:
   - **Consultant**: `consultant@university.edu` / `password123`
   - **Teacher**: `teacher@university.edu` / `password123`
   - **Data Scientist**: `datascientist@university.edu` / `password123`

## 🔧 Xử Lý Lỗi Thường Gặp

### ❌ Lỗi: "Database server was reached but timed out"
```bash
cd backend
docker compose down
docker compose up -d postgres redis
# Đợi 10 giây
npm run migrate:dev
```

### ❌ Lỗi: "Port 4000 already in use"
- Tìm process đang dùng port 4000 và tắt nó
- Hoặc đổi port trong `backend/.env`: `PORT=4001`

### ❌ Lỗi: "Cannot connect to API"
1. Kiểm tra backend đang chạy: http://localhost:4000/health
2. Kiểm tra file `.env` có `VITE_API_BASE_URL=http://localhost:4000/api`
3. Restart frontend server

### ❌ Lỗi: "Prisma schema validation"
```bash
cd backend
npm run prisma:generate
npm run migrate:dev
```

## 📚 Các Lệnh Hữu Ích

### Backend
```bash
cd backend

# Development (hot reload)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Prisma Studio (xem database)
npm run prisma:studio

# Reset database
docker compose down -v
docker compose up -d
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

# Khởi động services
docker compose up -d

# Xem status
docker compose ps
```

## ✅ Checklist

Trước khi chạy, đảm bảo:
- [x] Node.js >= 20.11.0 ✅ (Bạn có v24.11.0)
- [x] Docker Desktop đang chạy
- [x] PostgreSQL & Redis containers đang chạy
- [x] Backend `.env` file đã tạo ✅
- [x] Frontend `.env` file đã tạo ✅
- [ ] Backend dependencies đã cài (`npm install`)
- [ ] Database migrations đã chạy (`npm run migrate:dev`)
- [ ] Seed data đã chạy (`npm run seed`)
- [ ] Backend server đang chạy (`npm run dev`)
- [ ] Frontend server đang chạy (`npm run dev`)

## 🎯 Quy Trình Hàng Ngày

1. **Khởi động Docker:**
   ```bash
   cd backend
   docker compose up -d
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

