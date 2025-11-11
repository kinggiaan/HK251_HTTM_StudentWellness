# 🔧 Sửa Lỗi: Database `mental_health_db_shadow` does not exist

## ❌ Lỗi
```
Error: P1003
Database `mental_health_db_shadow` does not exist
```

## ✅ Giải Pháp

### Vấn Đề
Prisma cần một shadow database để thực hiện migrations. Database này không được tạo tự động.

### Cách Sửa

**Tạo shadow database:**

```powershell
cd backend
docker compose exec postgres psql -U admin -d postgres -c "CREATE DATABASE mental_health_db_shadow;"
```

**Sau đó chạy lại migration:**

```powershell
npm run migrate:dev
```

### Kiểm Tra

Sau khi tạo shadow database, migration sẽ chạy thành công:
```
Applying migration `20251110160122_init`
Your database is now in sync with your schema.
```

### Lưu Ý

- Shadow database chỉ cần cho `prisma migrate dev`
- Không cần cho `prisma migrate deploy` (production)
- Shadow database có thể bị xóa, Prisma sẽ tự động tạo lại khi cần

### Nếu Vẫn Gặp Lỗi

1. **Kiểm tra PostgreSQL đang chạy:**
   ```powershell
   docker compose ps
   ```

2. **Kiểm tra kết nối:**
   ```powershell
   docker compose exec postgres psql -U admin -d postgres -c "\l"
   ```

3. **Tạo thủ công nếu cần:**
   ```powershell
   docker compose exec postgres psql -U admin -d postgres
   ```
   Sau đó trong psql:
   ```sql
   CREATE DATABASE mental_health_db_shadow;
   \q
   ```

---

**Sau khi tạo shadow database, migration sẽ chạy thành công!**

