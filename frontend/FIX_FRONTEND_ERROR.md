# 🔧 Sửa Lỗi: 'vite' is not recognized

## ❌ Lỗi
```
'vite' is not recognized as an internal or external command,
operable program or batch file.
```

## ✅ Giải Pháp

### Bước 1: Kiểm Tra Thư Mục

Bạn phải đang ở **root directory** của project, KHÔNG phải trong thư mục `src`!

```powershell
# Kiểm tra thư mục hiện tại
Get-Location
# Phải là: D:\HCMUT\HTTM\HTTM_Project

# Kiểm tra có file package.json không
Test-Path package.json
# Phải trả về: True
```

**Nếu bạn đang ở trong `src`:**
```powershell
cd ..
# Hoặc
cd D:\HCMUT\HTTM\HTTM_Project
```

### Bước 2: Cài Đặt Dependencies

```powershell
# Kiểm tra node_modules có tồn tại không
Test-Path node_modules

# Nếu không có, cài đặt:
npm install
```

### Bước 3: Chạy Lại

```powershell
npm run dev
```

## ✅ Checklist

- [ ] Đang ở root directory (`D:\HCMUT\HTTM\HTTM_Project`)
- [ ] Có file `package.json` trong thư mục hiện tại
- [ ] Đã chạy `npm install`
- [ ] Có folder `node_modules` trong thư mục hiện tại
- [ ] Có file `vite.config.mts` trong thư mục hiện tại

## 🔍 Kiểm Tra Nhanh

```powershell
# Chạy lệnh này để kiểm tra tất cả:
Get-Location
Write-Host "package.json: $(Test-Path package.json)"
Write-Host "node_modules: $(Test-Path node_modules)"
Write-Host "vite.config.mts: $(Test-Path vite.config.mts)"
```

Tất cả phải trả về `True`!

