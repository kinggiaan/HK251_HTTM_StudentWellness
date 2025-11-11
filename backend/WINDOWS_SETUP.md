# Windows Setup Guide

Hướng dẫn thiết lập và chạy backend trên Windows.

## Yêu Cầu

- Windows 10/11
- Node.js 20+ (khuyến nghị 24 LTS) ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- PowerShell 5.1+ hoặc Command Prompt

## Bước 1: Cài Đặt Dependencies

### Tự động (Khuyến nghị)

#### PowerShell (Khuyến nghị)

Mở PowerShell và chạy:

```powershell
cd backend
.\scripts\windows-setup.ps1
```

Nếu gặp lỗi execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\windows-setup.ps1
```

#### Command Prompt (Batch)

Mở Command Prompt và chạy:

```cmd
cd backend
scripts\windows-setup.bat
```

Script này sẽ:
- Kiểm tra Node.js và npm
- Kiểm tra Docker
- Cài đặt npm dependencies
- Tạo file `.env` từ `env.example`
- Generate Prisma Client
- Tạo JWT secrets tự động

### Thủ công

Nếu muốn cài đặt thủ công:

1. **Cài Node.js 20+ (khuyến nghị 24 LTS)**
   - Download từ: https://nodejs.org/
   - Hoặc dùng winget: `winget install OpenJS.NodeJS.LTS`
   - ✅ Đã kiểm tra: Node.js v24.11.0 hoạt động tốt

2. **Cài Docker Desktop**
   - Download từ: https://www.docker.com/products/docker-desktop/
   - Hoặc dùng winget: `winget install Docker.DockerDesktop`
   - Khởi động Docker Desktop

3. **Cài dependencies**
   ```cmd
   cd backend
   npm install
   npm run prisma:generate
   ```

## Bước 2: Cấu Hình Environment

1. Copy file `.env` từ `env.example`:

```cmd
copy env.example .env
```

Hoặc trong PowerShell:

```powershell
Copy-Item env.example .env
```

2. Chỉnh sửa file `.env` với các giá trị phù hợp:

```cmd
notepad .env
```

**Quan trọng**: Đảm bảo các giá trị sau được cấu hình đúng:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key cho JWT (đã được generate tự động)
- `REFRESH_TOKEN_SECRET`: Secret key cho refresh token (đã được generate tự động)
- `REDIS_URL`: Redis connection string

## Bước 3: Khởi Động Services

### Sử dụng PowerShell

```powershell
.\scripts\windows-start-services.ps1
```

### Sử dụng Command Prompt

```cmd
scripts\windows-start-services.bat
```

Hoặc thủ công:

```cmd
docker compose up -d postgres redis
```

### Kiểm tra services đang chạy:

```cmd
docker compose ps
```

Bạn sẽ thấy:
- `postgres` chạy trên port 5432
- `redis` chạy trên port 6379

## Bước 4: Chạy Database Migrations

```cmd
npm run migrate:dev
```

Lệnh này sẽ:
- Tạo database schema
- Chạy tất cả migrations
- Generate Prisma Client nếu cần

## Bước 5: Seed Database (Tùy chọn)

Nếu có seed data:

```cmd
npm run seed
```

## Bước 6: Chạy Development Server

```cmd
npm run dev
```

Server sẽ chạy tại: `http://localhost:4000`

Kiểm tra health endpoint:

```cmd
curl http://localhost:4000/health
```

Hoặc mở browser: http://localhost:4000/health

## Các Lệnh Hữu Ích

### Quản lý Services

#### PowerShell

```powershell
# Start services
.\scripts\windows-start-services.ps1

# Stop services
.\scripts\windows-stop-services.ps1

# View logs
docker compose logs -f postgres
docker compose logs -f redis

# Restart services
docker compose restart postgres redis
```

#### Command Prompt

```cmd
# Start services
scripts\windows-start-services.bat

# Stop services
scripts\windows-stop-services.bat

# View logs
docker compose logs -f postgres
docker compose logs -f redis

# Restart services
docker compose restart postgres redis
```

### Database

```cmd
# Chạy migrations
npm run migrate:dev

# Reset database (xóa và tạo lại)
npx prisma migrate reset

# Xem database với Prisma Studio
npm run prisma:studio

# Generate Prisma Client
npm run prisma:generate
```

### Development

```cmd
# Chạy dev server với hot reload
npm run dev

# Build production
npm run build

# Chạy production
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## Troubleshooting

### Docker không chạy

Nếu gặp lỗi "Cannot connect to Docker daemon":

1. Đảm bảo Docker Desktop đang chạy
2. Kiểm tra Docker Desktop trong system tray
3. Restart Docker Desktop nếu cần

### Port đã được sử dụng

Nếu port 5432 hoặc 6379 đã được sử dụng:

1. Tìm process đang dùng port:

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

2. Dừng process hoặc đổi port trong `docker-compose.yml`

### Database connection error

Kiểm tra:
- PostgreSQL container đang chạy: `docker compose ps`
- Connection string trong `.env` đúng
- Database đã được tạo: `npm run migrate:dev`

### Permission denied (PowerShell)

Nếu gặp lỗi execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node version không đúng

Nếu Node.js version < 20:

1. Download Node.js 20+ từ https://nodejs.org/
2. Hoặc sử dụng nvm-windows:

```cmd
# Install nvm-windows from https://github.com/coreybutler/nvm-windows
nvm install 20
nvm use 20
```

### Docker Compose không tìm thấy

Nếu gặp lỗi "docker compose" không tìm thấy:

1. Đảm bảo Docker Desktop đã cài đặt đầy đủ
2. Thử dùng `docker-compose` (với dấu gạch ngang)
3. Restart Docker Desktop

## Cấu Trúc Thư Mục

```
backend/
├── scripts/
│   ├── windows-setup.ps1          # Setup script (PowerShell)
│   ├── windows-setup.bat           # Setup script (Batch)
│   ├── windows-start-services.ps1  # Start services (PowerShell)
│   ├── windows-start-services.bat  # Start services (Batch)
│   ├── windows-stop-services.ps1   # Stop services (PowerShell)
│   └── windows-stop-services.bat   # Stop services (Batch)
├── prisma/
│   └── schema.prisma               # Database schema
├── src/                             # Source code
├── .env                             # Environment variables (tạo từ env.example)
├── docker-compose.yml               # Docker services config
└── package.json                     # Dependencies và scripts
```

## Next Steps

Sau khi setup xong:

1. ✅ Services đang chạy (PostgreSQL, Redis)
2. ✅ Database đã migrate
3. ✅ Server đang chạy trên port 4000
4. 🔄 Tiếp tục implement các modules còn lại
5. 🔄 Kết nối với frontend

## Liên Hệ

Nếu gặp vấn đề, kiểm tra:
- Logs: `docker compose logs`
- Health check: `curl http://localhost:4000/health` hoặc mở browser
- Database: `npm run prisma:studio`


