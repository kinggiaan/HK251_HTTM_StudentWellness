# 🔧 Sửa Lỗi: Docker ML Service Registry Denied

## ❌ Lỗi
```
Error response from daemon: error from registry: denied
✘ ml-service Error error from registry: denied
```

## ✅ Giải Pháp

### Vấn Đề
Service `ml-service` đang cố pull image từ GitHub Container Registry và bị denied. Service này **KHÔNG CẦN THIẾT** cho việc chạy backend cơ bản.

### Cách Sửa

**Chỉ chạy các service cần thiết (postgres và redis):**

```powershell
cd backend
docker compose up -d postgres redis
```

**KHÔNG chạy:**
```powershell
docker compose up -d  # ❌ Sẽ cố pull ml-service và bị lỗi
```

### Kiểm Tra

```powershell
docker compose ps
```

Phải thấy:
- ✅ `postgres` - Running
- ✅ `redis` - Running
- ❌ `ml-service` - Không cần thiết

### Lưu Ý

- **PostgreSQL** và **Redis** là các service **BẮT BUỘC** cho backend
- **ML Service** chỉ cần khi bạn muốn test ML features (không bắt buộc)
- Backend vẫn chạy bình thường không có ML service

### Nếu Muốn Chạy Tất Cả Services (Bao Gồm ML)

Nếu bạn muốn chạy cả ML service, bạn cần:
1. Có quyền truy cập GitHub Container Registry
2. Hoặc build ML service locally
3. Hoặc comment out ml-service trong `docker-compose.yml`

**Comment out ml-service:**
```yaml
# ml-service:
#   image: ghcr.io/dub-co/mock-ml-service:latest
#   ports:
#     - '5000:5000'
```

---

**Khuyến nghị**: Chỉ chạy `postgres` và `redis` cho development.

