# 🚀 Quick Start Guide

## Mục Lục
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt Nhanh](#cài-đặt-nhanh)
- [Chạy Development](#chạy-development)
- [Kiểm Tra](#kiểm-tra)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu Cầu Hệ Thống

### Bắt Buộc
- **Node.js**: v20.11.0 trở lên (khuyến nghị v24 LTS)
- **npm**: v10.0.0 trở lên
- **Git**: Latest version

### Tùy Chọn (cho full development)
- **Docker Desktop**: Cho PostgreSQL và Redis
- **Python**: v3.9+ (cho ML service)
- **PostgreSQL**: v14+ (nếu không dùng Docker)

### Kiểm Tra Version
```bash
node --version    # >= v20.11.0
npm --version     # >= v10.0.0
git --version     # any recent version
```

---

## ⚡ Cài Đặt Nhanh

### 1️⃣ Clone Repository

```bash
git clone https://github.com/kinggiaan/HK251_HTTM_StudentWellness.git
cd HK251_HTTM_StudentWellness
```

### 2️⃣ Cài Đặt Backend

```bash
cd backend

# Cài dependencies
npm install

# Copy environment file
cp .env.example .env

# Build project
npm run build
```

### 3️⃣ Cài Đặt Frontend

```bash
cd ../frontend

# Cài dependencies
npm install
```

### 4️⃣ Khởi Động Database (Optional - dùng Docker)

```bash
cd ../backend

# Windows PowerShell
.\scripts\windows-start-services.ps1

# Hoặc dùng Docker Compose
docker-compose up -d
```

---

## 🎮 Chạy Development

### Backend Server (Port 1337)

```bash
cd backend
npm start
```

✅ Backend ready tại: `http://localhost:1337`

**Admin Panel:**
- URL: `http://localhost:1337/admin`
- Email: `huynhducnham@gmail.com`
- Password: `Nham12345@@`

### Frontend Server (Port 3000)

```bash
# Mở terminal MỚI
cd frontend
npm run dev
```

✅ Frontend ready tại: `http://localhost:3000`

### ML Service (Port 5000) - Optional

```bash
# Mở terminal MỚI
cd ml-service

# Tạo virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run service
python app.py
```

✅ ML Service ready tại: `http://localhost:5000`

---

## ✅ Kiểm Tra

### 1. Backend Health Check
```bash
# Mở browser
http://localhost:1337/admin

# Hoặc dùng curl
curl http://localhost:1337/_health
```

### 2. Frontend Health Check
```bash
# Mở browser
http://localhost:3000

# Nên thấy trang login
```

### 3. Database Connection
```bash
cd backend
npm run strapi console

# Trong console:
strapi.db.query('api::user.user').findMany()
```

---

## 🚦 Development Workflow

### 1. Tạo Feature Branch
```bash
git checkout -b feature/ten-feature
```

### 2. Làm Việc & Commit
```bash
git add .
git commit -m "feat: mô tả thay đổi"
```

### 3. Push & Create PR
```bash
git push origin feature/ten-feature
# Tạo Pull Request trên GitHub
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Backend (1337):**
```powershell
# Windows - Kill process on port 1337
netstat -ano | findstr :1337
taskkill /PID <PID> /F
```

**Frontend (3000):**
```powershell
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Node Modules Issues
```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues
```bash
# Restart Docker services
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart postgres

# Check connection trong .env
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
```

### Build Errors
```bash
# Clear cache
npm cache clean --force

# Rebuild
npm run build
```

---

## 📱 Các URL Quan Trọng

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | (User accounts) |
| Backend Admin | http://localhost:1337/admin | huynhducnham@gmail.com / Nham12345@@ |
| API Docs | http://localhost:1337/documentation | (Same as admin) |
| ML Service | http://localhost:5000 | No auth |
| PostgreSQL | localhost:5432 | strapi / strapi |
| Redis | localhost:6379 | No password |

---

## 📚 Next Steps

- Đọc [Project Structure](./PROJECT_STRUCTURE.md) để hiểu cấu trúc
- Xem [API Documentation](./API.md) để biết các endpoints
- Tham khảo [Component Guide](./COMPONENTS.md) khi tạo components mới
- Follow [Coding Standards](./CODING_STANDARDS.md) khi code

---

## 💡 Tips

1. **Hot Reload**: Frontend tự động reload khi bạn save file
2. **Backend Restart**: Cần restart backend khi sửa config
3. **Database Reset**: `npm run strapi db:reset` (⚠️ xóa hết data!)
4. **Clear Cache**: `Ctrl + Shift + R` trong browser
5. **Check Logs**: Luôn xem terminal logs khi có lỗi

---

## 🆘 Need Help?

- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Read [FAQ](./FAQ.md)
- Contact team lead
