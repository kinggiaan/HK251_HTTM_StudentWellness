# Backend - Windows Quick Reference

## 🚀 Quick Start

### PowerShell

```powershell
# 1. Setup (chạy 1 lần)
cd backend
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser  # Nếu cần
.\scripts\windows-setup.ps1

# 2. Start services
.\scripts\windows-start-services.ps1

# 3. Setup database
npm run migrate:dev
npm run seed

# 4. Start server
npm run dev
```

### Command Prompt

```cmd
# 1. Setup (chạy 1 lần)
cd backend
scripts\windows-setup.bat

# 2. Start services
scripts\windows-start-services.bat

# 3. Setup database
npm run migrate:dev
npm run seed

# 4. Start server
npm run dev
```

## 📝 Test Accounts

Sau khi chạy seed, bạn có thể đăng nhập với:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | password123 |
| Consultant | consultant@university.edu | password123 |
| Teacher/Supervisor | teacher@university.edu | password123 |
| Data Scientist | datascientist@university.edu | password123 |

## 🔗 Endpoints

- Health: `http://localhost:4000/health`
- API: `http://localhost:4000/api`
- Login: `POST http://localhost:4000/api/auth/login`

## 📚 Documentation

- Chi tiết: `WINDOWS_SETUP.md`
- Quick start: `QUICKSTART_WINDOWS.md`


