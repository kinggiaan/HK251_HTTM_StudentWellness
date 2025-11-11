# Quick Start - Windows

Hướng dẫn nhanh để chạy backend trên Windows.

## 🚀 Quick Start (3 bước)

### 1. Setup (chạy 1 lần)

#### PowerShell (Khuyến nghị)

```powershell
cd backend
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser  # Nếu cần
.\scripts\windows-setup.ps1
```

#### Command Prompt

```cmd
cd backend
scripts\windows-setup.bat
```

### 2. Start Services

#### PowerShell

```powershell
.\scripts\windows-start-services.ps1
```

#### Command Prompt

```cmd
scripts\windows-start-services.bat
```

### 3. Run Migrations & Start Server

```cmd
npm run migrate:dev
npm run seed
npm run dev
```

✅ Server chạy tại: `http://localhost:4000`

## 📋 Checklist

- [x] Node.js 20+ đã cài (✅ v24.11.0)
- [ ] Docker Desktop đã cài và chạy
- [ ] Đã chạy setup script
- [ ] File `.env` đã được tạo và cấu hình
- [ ] Services đang chạy (PostgreSQL, Redis)
- [ ] Đã chạy migrations
- [ ] Đã chạy seed
- [ ] Server đang chạy

## 🔧 Troubleshooting

### Lỗi: "Cannot connect to Docker daemon"

- Đảm bảo Docker Desktop đang chạy
- Kiểm tra Docker Desktop trong system tray
- Restart Docker Desktop

### Lỗi: "Execution Policy"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi: "Port already in use"

```powershell
# PowerShell
Get-NetTCPConnection -LocalPort 5432
Get-NetTCPConnection -LocalPort 6379
```

```cmd
# Command Prompt
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```

## 📝 Test Accounts

Sau khi chạy seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | password123 |
| Consultant | consultant@university.edu | password123 |
| Teacher | teacher@university.edu | password123 |
| Data Scientist | datascientist@university.edu | password123 |

## 🔗 Endpoints

- Health: `http://localhost:4000/health`
- API: `http://localhost:4000/api`
- Login: `POST http://localhost:4000/api/auth/login`

## 📚 Chi tiết

Xem file `WINDOWS_SETUP.md` để biết hướng dẫn chi tiết.


