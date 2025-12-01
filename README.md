
  # Student Mental Health Dashboard

  Monorepo gồm 3 ứng dụng chính:
  - Frontend (React + Vite) ở root repo
  - Backend (Node + Express + Prisma) trong thư mục `backend/`
  - ML Local Service (Express) trong thư mục `ml-service/`

  ## Cấu trúc tổng quan

  - Frontend:
    - `src/components/` – các màn hình/dashboards theo vai trò (`AdminConsole`, `ConsultantDashboard`, `DataScientistDashboard`, `TeacherSupervisorDashboard`, …) và thư mục `ui/` cho các component chia sẻ.
    - `src/services/` – tầng gọi API theo module backend (`auth.service.ts`, `students.service.ts`, `datasets.ts`, `mlModels.ts`, `mentalHealth.service.ts`).
    - `src/contexts/` – Auth, Permissions, …
    - `src/lib/api.ts` – API client dùng chung (base URL, token, handle lỗi).
  - Backend:
    - `backend/src/modules/*` – các module business: `auth`, `users`, `students`, `sessions`, `datasets`, `mlModels`, `analytics`, …
    - Mỗi module chuẩn theo pattern: `*.schema.ts`, `*.service.ts`, `*.controller.ts`, `*.routes.ts`, `index.ts`.
  - ML Service:
    - `ml-service/src/index.ts` – entry khởi động server.
    - `ml-service/src/app.ts` – khởi tạo Express app, middleware, routes.
    - `ml-service/src/routes/*` – `health.routes.ts`, `train.routes.ts`.
    - `ml-service/src/services/training.service.ts` – logic train + gọi utils.
    - `ml-service/src/utils/*` – đọc CSV, tính metrics mock.

  ## Chạy project

  1. Cài dependencies ở root:
     - `npm install`
  2. Chạy backend:
     - `cd backend`
     - `npm install`
     - `npm run dev`
  3. Chạy frontend:
     - Quay lại root: `cd ..`
     - `npm run dev`
  4. (Tuỳ chọn) Chạy ML local service:
     - `cd ml-service`
     - `npm install`
     - `npm run dev`

  