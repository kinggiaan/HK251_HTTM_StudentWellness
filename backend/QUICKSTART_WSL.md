# Quick Start - WSL

Hướng dẫn nhanh để chạy backend trên WSL.

## 🚀 Quick Start (3 bước)

### 1. Setup (chạy 1 lần)

```bash
cd backend
chmod +x scripts/*.sh  # Nếu cần
./scripts/wsl-setup.sh
```

### 2. Start Services

```bash
./scripts/wsl-start-services.sh
```

### 3. Run Migrations & Start Server

```bash
npm run migrate:dev
npm run dev
```

✅ Server chạy tại: `http://localhost:4000`

## 📋 Checklist

- [ ] Node.js 20+ đã cài
- [ ] Docker đã cài và chạy
- [ ] Đã chạy `./scripts/wsl-setup.sh`
- [ ] File `.env` đã được tạo và cấu hình
- [ ] Services đang chạy (PostgreSQL, Redis)
- [ ] Đã chạy migrations
- [ ] Server đang chạy

## 🔧 Troubleshooting

### Lỗi: "Cannot connect to Docker daemon"

```bash
# Khởi động Docker service
sudo service docker start

# Hoặc đảm bảo Docker Desktop đang chạy trên Windows
```

### Lỗi: "Port already in use"

```bash
# Kiểm tra port
sudo lsof -i :5432
sudo lsof -i :6379

# Dừng process hoặc đổi port trong docker-compose.yml
```

### Lỗi: "Permission denied"

```bash
chmod +x scripts/*.sh
```

## 📚 Chi tiết

Xem file `WSL_SETUP.md` để biết hướng dẫn chi tiết.


