# WSL Setup Guide

Hướng dẫn thiết lập và chạy backend trên Windows Subsystem for Linux (WSL).

## Yêu Cầu

- WSL 2 đã được cài đặt
- Ubuntu hoặc distribution Linux khác trên WSL
- Windows 10/11 với WSL 2 support

## Bước 1: Cài Đặt Dependencies

### Tự động (Khuyến nghị)

Chạy script setup tự động:

```bash
cd backend
chmod +x scripts/wsl-setup.sh
./scripts/wsl-setup.sh
```

Script này sẽ:
- Kiểm tra và cài đặt Node.js 20+ (khuyến nghị 24 LTS) nếu cần
- Kiểm tra và cài đặt Docker nếu cần
- Cài đặt npm dependencies
- Tạo file `.env` từ `env.example`
- Generate Prisma Client

### Thủ công

Nếu muốn cài đặt thủ công:

```bash
# Cài Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài Docker (nếu chưa có)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out và log in lại để áp dụng group changes

# Cài dependencies
cd backend
npm install
npm run prisma:generate
```

## Bước 2: Cấu Hình Environment

1. Copy file `.env` từ `env.example`:

```bash
cp env.example .env
```

2. Chỉnh sửa file `.env` với các giá trị phù hợp:

```bash
nano .env  # hoặc dùng editor khác
```

**Quan trọng**: Đảm bảo các giá trị sau được cấu hình đúng:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key cho JWT (nên generate random)
- `REFRESH_TOKEN_SECRET`: Secret key cho refresh token
- `REDIS_URL`: Redis connection string

Để generate JWT secrets:

```bash
openssl rand -hex 32  # Copy output làm JWT_SECRET
openssl rand -hex 32  # Copy output làm REFRESH_TOKEN_SECRET
```

## Bước 3: Khởi Động Services

### Sử dụng Docker Compose (Khuyến nghị)

```bash
# Start PostgreSQL và Redis
chmod +x scripts/wsl-start-services.sh
./scripts/wsl-start-services.sh
```

Hoặc thủ công:

```bash
docker compose up -d postgres redis
```

### Kiểm tra services đang chạy:

```bash
docker compose ps
```

Bạn sẽ thấy:
- `postgres` chạy trên port 5432
- `redis` chạy trên port 6379

## Bước 4: Chạy Database Migrations

```bash
npm run migrate:dev
```

Lệnh này sẽ:
- Tạo database schema
- Chạy tất cả migrations
- Generate Prisma Client nếu cần

## Bước 5: Seed Database (Tùy chọn)

Nếu có seed data:

```bash
npm run seed
```

## Bước 6: Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:4000`

Kiểm tra health endpoint:

```bash
curl http://localhost:4000/health
```

## Các Lệnh Hữu Ích

### Quản lý Services

```bash
# Start services
./scripts/wsl-start-services.sh

# Stop services
./scripts/wsl-stop-services.sh

# Xem logs
docker compose logs -f postgres
docker compose logs -f redis

# Restart services
docker compose restart postgres redis
```

### Database

```bash
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

```bash
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

1. Đảm bảo Docker Desktop đang chạy trên Windows
2. Hoặc cài Docker daemon trực tiếp trên WSL:

```bash
sudo service docker start
```

### Port đã được sử dụng

Nếu port 5432 hoặc 6379 đã được sử dụng:

1. Tìm process đang dùng port:

```bash
sudo lsof -i :5432
sudo lsof -i :6379
```

2. Dừng process hoặc đổi port trong `docker-compose.yml`

### Database connection error

Kiểm tra:
- PostgreSQL container đang chạy: `docker compose ps`
- Connection string trong `.env` đúng
- Database đã được tạo: `npm run migrate:dev`

### Permission denied

Nếu gặp lỗi permission:

```bash
chmod +x scripts/*.sh
```

Hoặc chạy với sudo (không khuyến nghị):

```bash
sudo ./scripts/wsl-setup.sh
```

### Node version không đúng

Nếu Node.js version < 20:

```bash
# Sử dụng nvm (khuyến nghị)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## Cấu Trúc Thư Mục

```
backend/
├── scripts/
│   ├── wsl-setup.sh          # Setup script
│   ├── wsl-start-services.sh  # Start Docker services
│   └── wsl-stop-services.sh  # Stop Docker services
├── prisma/
│   └── schema.prisma         # Database schema
├── src/                      # Source code
├── .env                      # Environment variables (tạo từ env.example)
├── docker-compose.yml        # Docker services config
└── package.json              # Dependencies và scripts
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
- Health check: `curl http://localhost:4000/health`
- Database: `npm run prisma:studio`


