### Nhật ký phát triển (Development Log)



#### 1) Mục tiêu dự án
- Xây dựng hệ thống Student Wellness gồm:
  - Frontend: Vite + React.
  - Backend: Node.js (TypeScript), Prisma, REST API, WebSocket.
  - CSDL: PostgreSQL; Redis (tùy chọn) cho rate-limit/cache.
  - Triển khai: linh hoạt theo Render/Railway/Vercel hoặc VPS + Docker.



#### 2) Mốc thời gian và cột mốc chính
- Khởi tạo repo và chuẩn hóa ignore
  - Commit: “Initial commit”
  - Thiết lập `.gitignore` ở root và `backend` để loại trừ `node_modules`, `dist`, `.env*`, uploads runtime…

- Bổ sung tài liệu và dữ liệu mẫu
  - Commit: “docs: add ML integration plan, roles, and sample datasets”
  - Thêm: `docs/ML_INTEGRATION_PLAN.md`, `docs/ROLES.md`, `docs/sample_datasets/*.csv`.

- Tính năng Backend (quản trị và dịch vụ dữ liệu/ML)
  - Commit: “feat(backend): add admin module (routes, services, controllers)”
  - Commit: “feat(backend): datasets and mlModels services updates; routes wiring; seed tweak”
  - Nội dung: module admin cơ bản, cập nhật service datasets/mlModels, chỉnh route wiring, tinh chỉnh seed Prisma.

- Tính năng Frontend (dashboards & quản lý dataset)
  - Commit: “feat(frontend): dashboards, dataset management updates; add admin console & permissions context; add dataset/mlModels services”
  - Nội dung: mở rộng màn hình dashboard, thêm Admin Console, Permissions Context, service gọi API datasets/mlModels.

- Dọn dẹp/nhất quán repo
  - Commit: “chore: track backend data config; ignore runtime uploads directory”
  - Ghi nhận cấu hình dữ liệu cần versioning, bỏ qua thư mục runtime `uploads`.



#### 3) Quy ước nhánh và quy trình làm việc (Workflow)
- Nhánh chính: `master` (có thể chuyển sang `main` nếu cần)
  - Luôn được giữ ở trạng thái deployable.
- Nhánh tính năng: `feature/<ten-tinh-nang>`
  - Quy trình: tạo nhánh → commit theo nhóm logic → PR → review → merge.
- Nhánh sửa lỗi khẩn: `hotfix/<mo-ta>`
  - Patch nhanh trực tiếp từ `master` và release ngay sau khi review.
- Commit message: theo kiểu conventional commits
  - `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `ci:`.



#### 4) Môi trường và biến môi trường
- Backend (tham khảo từ `backend/env.example`):
  - `DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public`
  - `JWT_SECRET=...`
  - `REDIS_URL=redis://host:6379` (nếu sử dụng)
  - `NODE_ENV=production`
  - `PORT` (theo nền tảng)
  - `ALLOWED_ORIGINS=https://yourfrontenddomain.com`
- Frontend:
  - `VITE_API_URL=https://api.yourdomain.com`
- Lưu ý: không commit `.env`, quản lý secret bằng môi trường hosting hoặc secret manager.



#### 5) Dữ liệu và migration
- ORM: Prisma
  - Phát triển: `npx prisma migrate dev`
  - Sản xuất: `npx prisma migrate deploy`
- Seed dữ liệu:
  - File: `backend/prisma/seed.ts`
  - Chạy seed chỉ khi cần, tuân theo idempotency để tránh nhân bản dữ liệu.



#### 6) Build & Deploy
- Phương án managed (Render/Vercel/Railway):
  - Backend: Build `npm ci && npm run build` trong `backend`, Start `npm run start` (hoặc `node dist/server.js`).
  - Migration: hook trước start chạy `npx prisma migrate deploy`.
  - Frontend: Vercel/Netlify build `npm ci && npm run build`, output `dist`.
  - Domain & HTTPS: dùng domain tùy chỉnh cho FE và subdomain `api.*` cho BE.

- Phương án VPS + Docker Compose:
  - Dịch vụ: `api`, `db` (Postgres), `redis` (tùy chọn), `proxy` (Caddy/NGINX).
  - HTTPS: tự động qua Caddy hoặc certbot cho NGINX.
  - CI/CD: GitHub Actions build/push image → VPS `docker compose pull && up -d`.



#### 7) CI/CD (đề xuất)
- Trigger: push/PR vào `master` và `feature/*`.
- Jobs:
  - Lint & type-check.
  - Build backend và frontend.
  - (Prod) Chạy migration trước khi deploy.
  - Deploy tự động lên Render/Vercel hoặc release images lên registry rồi cập nhật VPS.



#### 8) Kiểm thử và chất lượng
- Tầng unit/integration cho backend (vitest/jest): modules, services, middleware.
- Frontend: test UI critical paths (login, dashboards, dataset flows).
- E2E (tùy chọn): Playwright/Cypress cho các luồng người dùng chính.
- Health check: endpoint `/health` cho BE, giám sát uptime.



#### 9) Vận hành sau triển khai
- Giám sát & log: theo dõi 5xx, CPU/RAM, latency, error rate.
- Backup Postgres định kỳ (hằng ngày), test restore mỗi sprint.
- Bảo mật: rotate secrets định kỳ, giới hạn CORS, cập nhật dependencies bảo mật.
- Quy trình hotfix: phát hiện lỗi nghiêm trọng → tạo nhánh hotfix → test nhanh → deploy.



#### 10) Kế hoạch phát triển sắp tới (gợi ý)
- RBAC/Permissions đầy đủ (đồng bộ FE/BE).
- Tối ưu dữ liệu ML: pipeline import/transform/validate chuẩn hóa.
- Quan trắc hiệu năng: cache layer, index DB, profiling API.
- Tối ưu bundle FE: code splitting, lazy loading, image optimization.



#### 11) Mẫu Release Notes (template)
- Phiên bản: vX.Y.Z – Ngày phát hành: YYYY-MM-DD
- Tính năng mới
  - feat: …
- Sửa lỗi
  - fix: …
- Thay đổi không phá vỡ (chore/docs/refactor)
  - …
- Thay đổi phá vỡ (breaking change) nếu có
  - …
- Hướng dẫn nâng cấp
  - Migration, biến môi trường mới, lưu ý về cấu hình.


