# 🔧 Sửa Lỗi: Network Error - Cannot Connect to API

## ❌ Lỗi
```
Network error. Please check your connection.
```

## ✅ Giải Pháp

### Bước 1: Tạo File .env cho Frontend

Tạo file `.env` trong **root directory** (`D:\HCMUT\HTTM\HTTM_Project`) với nội dung:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

**Cách tạo (PowerShell):**
```powershell
cd D:\HCMUT\HTTM\HTTM_Project
echo "VITE_API_BASE_URL=http://localhost:4000/api" | Out-File -FilePath .env -Encoding utf8
```

**Hoặc tạo thủ công:**
1. Tạo file mới tên `.env` trong root directory
2. Thêm dòng: `VITE_API_BASE_URL=http://localhost:4000/api`
3. Lưu file

### Bước 2: Kiểm Tra Backend Đang Chạy

```powershell
# Kiểm tra backend health
curl http://localhost:4000/health

# Hoặc mở browser: http://localhost:4000/health
```

Phải thấy response:
```json
{"status":"ok","environment":"development","timestamp":"..."}
```

**Nếu backend chưa chạy:**
```powershell
cd backend
npm run dev
```

### Bước 3: Kiểm Tra CORS Configuration

Kiểm tra file `backend/.env` có:
```
FRONTEND_ORIGIN=http://localhost:3000
```

**Nếu frontend chạy trên port khác (ví dụ 5173), cập nhật:**
```
FRONTEND_ORIGIN=http://localhost:5173
```

Sau đó **restart backend server**.

### Bước 4: Restart Frontend Server

**QUAN TRỌNG**: Sau khi tạo file `.env`, bạn **PHẢI restart** frontend server:

1. Dừng frontend server (Ctrl+C trong terminal đang chạy `npm run dev`)
2. Chạy lại:
   ```powershell
   npm run dev
   ```

Vite sẽ load lại environment variables từ file `.env`.

## 🔍 Kiểm Tra Nhanh

### Checklist:
- [ ] File `.env` tồn tại trong root directory
- [ ] File `.env` có nội dung: `VITE_API_BASE_URL=http://localhost:4000/api`
- [ ] Backend đang chạy (http://localhost:4000/health trả về OK)
- [ ] Backend `.env` có `FRONTEND_ORIGIN` đúng với port frontend
- [ ] Frontend server đã được restart sau khi tạo `.env`

### Test Kết Nối:

1. **Test Backend:**
   ```powershell
   curl http://localhost:4000/health
   ```

2. **Test API từ Browser:**
   - Mở: http://localhost:4000/api/auth/login
   - Phải thấy error về method (POST required) - điều này OK, nghĩa là API đang chạy

3. **Test từ Frontend Console:**
   - Mở browser DevTools (F12)
   - Tab Network
   - Thử login
   - Xem request có được gửi đến `http://localhost:4000/api/auth/login` không

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch"
- Backend chưa chạy → Chạy `cd backend && npm run dev`
- Port backend sai → Kiểm tra `backend/.env` có `PORT=4000`
- Firewall chặn → Tắt firewall tạm thời để test

### Lỗi: CORS Error
- Kiểm tra `backend/.env` có `FRONTEND_ORIGIN=http://localhost:3000` (hoặc port frontend đang dùng)
- Restart backend sau khi sửa `.env`

### Lỗi: 404 Not Found
- Kiểm tra API URL trong frontend `.env`: `VITE_API_BASE_URL=http://localhost:4000/api`
- Đảm bảo có `/api` ở cuối

### Environment Variables Không Load
- **PHẢI restart frontend** sau khi tạo/sửa `.env`
- Vite chỉ load env variables khi khởi động
- Kiểm tra tên file là `.env` (không phải `.env.txt`)

## 📝 Lưu Ý

- File `.env` phải ở **root directory** của frontend (cùng cấp với `package.json`)
- Sau khi sửa `.env`, **luôn restart** frontend server
- Backend và frontend phải chạy **đồng thời**

---

**Sau khi làm các bước trên, thử login lại!**

