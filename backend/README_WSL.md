# Backend - WSL Quick Reference

## 🚀 Quick Start

```bash
# 1. Setup (chạy 1 lần)
cd backend
./scripts/wsl-setup.sh

# 2. Start services
./scripts/wsl-start-services.sh

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

- Chi tiết: `WSL_SETUP.md`
- Quick start: `QUICKSTART_WSL.md`


