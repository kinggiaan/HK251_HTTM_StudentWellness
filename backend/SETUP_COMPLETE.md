# ✅ Setup Hoàn Tất

## Đã Cài Đặt

- ✅ **Node.js**: v24.11.0 (tương thích với yêu cầu >=20.11.0)
- ✅ **Docker Desktop**: Đang chạy
- ✅ **PostgreSQL**: Container đang chạy
- ✅ **Redis**: Container đang chạy
- ✅ **Database**: Đã migrate và seed dữ liệu mẫu

## Trạng Thái Hiện Tại

### Services
- PostgreSQL: `localhost:5432` ✅
- Redis: `localhost:6379` ✅
- Backend API: `localhost:4000` (sẽ chạy khi start server)

### Database
- Database: `mental_health_db` ✅
- Shadow Database: `mental_health_db_shadow` ✅
- Migrations: Đã chạy ✅
- Seed Data: Đã tạo ✅

## Test Accounts

Sau khi seed, bạn có thể đăng nhập với:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | password123 |
| Consultant | consultant@university.edu | password123 |
| Teacher/Supervisor | teacher@university.edu | password123 |
| Data Scientist | datascientist@university.edu | password123 |

## Bước Tiếp Theo

### 1. Start Development Server

```powershell
cd D:\HCMUT\HTTM\HTTM_Project\backend
npm run dev
```

### 2. Test API

```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:4000/health

# Login test
$body = @{
    email = "admin@university.edu"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:4000/api/auth/login `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### 3. Xem Database

```powershell
npm run prisma:studio
```

Prisma Studio sẽ mở tại: `http://localhost:5555`

## Troubleshooting

### Server không start

1. Kiểm tra Docker services:
   ```powershell
   docker compose ps
   ```

2. Kiểm tra logs:
   ```powershell
   docker compose logs postgres
   docker compose logs redis
   ```

3. Restart services nếu cần:
   ```powershell
   .\scripts\windows-stop-services.ps1
   .\scripts\windows-start-services.ps1
   ```

### Database connection error

1. Kiểm tra `.env` file có `DATABASE_URL` đúng
2. Kiểm tra PostgreSQL container đang chạy:
   ```powershell
   docker ps --filter "name=postgres"
   ```

## Notes

- Node.js v24.11.0 hoạt động tốt với tất cả dependencies
- Tất cả migrations đã được apply thành công
- Seed data đã được tạo với 4 users và 3 students mẫu

