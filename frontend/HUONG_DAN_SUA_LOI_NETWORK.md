# 🔧 Hướng Dẫn Sửa Lỗi Network Error

## ❌ Lỗi Hiện Tại
```
Network error. Please check your connection.
```

## ✅ Các Bước Sửa

### Bước 1: Tạo File .env cho Frontend

**Tạo file `.env` trong root directory** (`D:\HCMUT\HTTM\HTTM_Project`):

**Cách 1: Dùng PowerShell**
```powershell
cd D:\HCMUT\HTTM\HTTM_Project
"VITE_API_BASE_URL=http://localhost:4000/api" | Out-File -FilePath .env -Encoding utf8
```

**Cách 2: Tạo thủ công**
1. Tạo file mới tên `.env` (không có extension)
2. Thêm dòng: `VITE_API_BASE_URL=http://localhost:4000/api`
3. Lưu file

### Bước 2: Kiểm Tra Port Frontend Đang Chạy

Mở terminal đang chạy `npm run dev`, xem dòng:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:XXXX/
```

Ghi nhớ port `XXXX` (có thể là 3000, 5173, hoặc port khác).

### Bước 3: Cập Nhật CORS trong Backend

**Nếu frontend chạy trên port 3000:**
```powershell
cd backend
# Mở file .env và sửa dòng FRONTEND_ORIGIN thành:
FRONTEND_ORIGIN=http://localhost:3000
```

**Nếu frontend chạy trên port 5173:**
```powershell
cd backend
# Giữ nguyên:
FRONTEND_ORIGIN=http://localhost:5173
```

**Sau khi sửa, restart backend:**
1. Dừng backend (Ctrl+C)
2. Chạy lại: `npm run dev`

### Bước 4: Restart Frontend

**QUAN TRỌNG**: Sau khi tạo file `.env`:

1. Dừng frontend server (Ctrl+C)
2. Chạy lại:
   ```powershell
   npm run dev
   ```

## ✅ Kiểm Tra

### 1. Kiểm Tra Backend
```powershell
curl http://localhost:4000/health
```
Phải thấy: `{"status":"ok",...}`

### 2. Kiểm Tra File .env
```powershell
Get-Content .env
```
Phải thấy: `VITE_API_BASE_URL=http://localhost:4000/api`

### 3. Kiểm Tra CORS
- Mở browser DevTools (F12)
- Tab Console
- Thử login
- Nếu có lỗi CORS, kiểm tra lại `FRONTEND_ORIGIN` trong `backend/.env`

## 🎯 Tóm Tắt Nhanh

```powershell
# 1. Tạo .env cho frontend
cd D:\HCMUT\HTTM\HTTM_Project
"VITE_API_BASE_URL=http://localhost:4000/api" | Out-File -FilePath .env -Encoding utf8

# 2. Kiểm tra port frontend (xem terminal npm run dev)

# 3. Cập nhật backend/.env nếu cần
# FRONTEND_ORIGIN=http://localhost:XXXX (XXXX = port frontend)

# 4. Restart cả backend và frontend
```

---

**Sau khi làm xong, thử login lại!**

