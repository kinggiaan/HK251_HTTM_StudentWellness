# ⚠️ STRAPI API TOKEN BỊ LỖI - CẦN TẠO MỚI

## Vấn đề hiện tại:
Token trong .env file bị lỗi 401 Unauthorized - token không hợp lệ hoặc đã expired.

## ✅ CÁCH SỬA (5 PHÚT):

### Bước 1: Mở Strapi Admin
Truy cập: http://localhost:1337/admin

### Bước 2: Tạo Token Mới
1. Đăng nhập với tài khoản admin
2. Vào **Settings** (⚙️) → **Global Settings** → **API Tokens**
3. Click **"Create new API Token"**

### Bước 3: Cấu hình Token
```
Name: ML Service Token
Description: Token for ML predictions and student updates
Token type: Full Access  ⬅️ BẮT BUỘC!
Token duration: Unlimited
```

### Bước 4: Copy Token
- Sau khi tạo, token sẽ hiển thị **CHỈ 1 LẦN DUY NHẤT**
- Copy toàn bộ token (rất dài, khoảng 200-300 ký tự)

### Bước 5: Update .env File
Mở file: `d:\HCMUT\HTTM\HTTM_Project\ml-service\.env`

Thay dòng này:
```
STRAPI_API_TOKEN=e6849a7797bb4f043c6bf6363668745d9842e3bc0552665f153f111f342c967511d35bc72605515103684f84aa7ccd49a5fd132abb778ca669c75477321ee1cfb8601ff62ebd5d58e57fd69165e88345c62b45b408005f4f74c59b1d9450d662b901ac1b1e9dd545dc2f2e41aad11868fa451b2541ef64f6a4636af8ae5ff111
```

Bằng:
```
STRAPI_API_TOKEN=<PASTE_TOKEN_MỚI_VÀO_ĐÂY>
```

### Bước 6: Restart ML Service
```powershell
cd ml-service
.\venv\Scripts\Activate.ps1
python .\main.py
```

### Bước 7: Test Deploy
1. Mở DataScientist dashboard
2. Click Deploy button
3. Xem terminal ML service → phải thấy:
   ```
   ✅ Found 52 students
   ✅ Updated successfully
   ```

## 🔍 KIỂM TRA TOKEN MỚI:

Sau khi tạo token mới, test bằng PowerShell:
```powershell
$token = "<PASTE_TOKEN_MỚI>"
$headers = @{"Authorization"="Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:1337/api/students?pagination[limit]=1" -Headers $headers
```

Nếu thành công, sẽ thấy data students. Nếu vẫn 401, kiểm tra:
- Token type phải là "Full Access"
- Không có dấu cách thừa khi copy
- Backend Strapi đang chạy
