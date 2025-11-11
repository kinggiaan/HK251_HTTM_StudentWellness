## ML Integration Plan (Local-first, Cloud-ready)

This document outlines how the Data Scientist features integrate across UI and Backend, where training data resides, how training is executed, and how results are displayed and analyzed. The plan prioritizes a local-first setup that can scale to online (cloud) environments with minimal changes.

### 1) Architecture Overview
- Frontend (FE):
  - Components: `DataScientistDashboard`, `DatasetManagementSection`, `ModelConfigDialog`.
  - Services: `src/services/datasets.ts` (list/upload), planned `src/services/mlModels.ts` (list/create/train/deploy).
  - Permissions: Data Scientist role controls visibility/actions.
- Backend (BE):
  - Datasets: `backend/src/modules/datasets` (list/upload/preview/statistics/delete).
  - ML Models: `backend/src/modules/mlModels` (list/create/update/train/deploy/delete).
  - Analytics: `backend/src/modules/analytics` (overview/distribution/trends).
  - Permissions admin: `backend/src/modules/admin/permissions.routes.ts`.
  - Persistence: Prisma models `Dataset` and `MLModel` already defined.

### 2) Storage Strategy (Local-first)
- Goal: single code path that works locally and online.
- Local (dev): Use local disk or MinIO (S3-compatible) for object storage.
- Cloud (prod): Use S3/GCS/Azure Blob with the same storage adapter interface.
- Backend will store dataset metadata in DB plus a `fileUrl` or `storageKey`. When training or previewing, BE issues a short-lived URL if using object storage.

Suggested environment variables:
```
STORAGE_DRIVER=local            # local | s3 | gcs | azure
LOCAL_STORAGE_DIR=./backend/uploads
S3_ENDPOINT=http://localhost:9000   # if using MinIO locally
S3_REGION=ap-southeast-1
S3_BUCKET=httm-ml
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
URL_EXPIRE_SECONDS=3600
MAX_UPLOAD_SIZE_MB=200
ML_SERVICE_URL=http://localhost:5001   # if training is delegated to a separate service
```

Local-first defaults:
- Use `STORAGE_DRIVER=local`, save uploaded files to `LOCAL_STORAGE_DIR`.
- Keep training in the main BE process (mock/synchronous) initially; optionally split into a separate ML service later.

### 3) Dataset Lifecycle
1. Upload (UI → BE):
   - UI: `POST /ml/datasets/upload` (multipart) with file + name (+ description).
   - BE: store file (local), extract metadata (format, size, sample count, optional basic stats), persist `Dataset`.
2. List/View:
   - UI: `GET /ml/datasets` with pagination and filters.
   - BE: return datasets and metadata (including `totalSamples`, `format`, timestamps).
3. Preview/Statistics (optional enhancements):
   - UI: `GET /ml/datasets/:id/preview` to render sample rows.
   - UI: `GET /ml/datasets/:id/statistics` for data completeness, missing values, balance.
4. Delete (optional): `DELETE /ml/datasets/:id` with role checks.

Notes:
- For local disk, `fileUrl` can be an internal path; preview/training reads directly.
- For cloud, BE should generate presigned URLs for read access when needed.

### 4) Model Lifecycle
1. Create model:
   - UI: `POST /ml/models` with `modelName`, `modelType`, `algorithm`, `hyperparameters`, `features`, `targetVariable`, optional `version`.
   - BE: create `MLModel` with status `training|trained|deployed|archived` (initially not trained).
2. Train model:
   - UI: `POST /ml/models/:id/train` payload: `{ datasetId, trainTestSplit, ... }`.
   - BE (local-first): reads dataset file from `LOCAL_STORAGE_DIR`, runs a synthetic/mocked training pipeline (or simple real one), computes metrics (accuracy, precision, recall, f1Score), updates `MLModel` fields (`status='trained'`, `trainedAt`, metrics, links `trainingDatasetId`).
   - BE (cloud-ready path): generates presigned dataset URL and calls `ML_SERVICE_URL` with job params; receives metrics via webhook or polling; updates `MLModel` upon completion.
3. Deploy model:
   - UI: `POST /ml/models/:id/deploy`.
   - BE: set `isActive=true`, `status='deployed'`, `deployedAt`. Optionally deactivate other active models of same `modelType`.
4. Update/Delete model:
   - UI: `PUT /ml/models/:id`, `DELETE /ml/models/:id`.
   - BE: update metadata or remove model records with constraints.

### 5) Results Display & Analysis (UI)
- Model overview cards: show latest trained model metrics (accuracy, precision, recall, f1Score), version, trained/deployed timestamps, features used.
- Confusion matrices/feature importance:
  - Phase 1: placeholders/mock charts.
  - Phase 2: return from train response (or a `GET /ml/models/:id/artifacts` endpoint) to render true plots.
- Dataset management section:
  - Show total samples, train/test split summary derived from `totalSamples` and selected split.
  - Provide quick data quality indicators: completeness/missing/balance (if available from `/statistics`).

### 6) Security & Compliance
- RBAC: Restrict `/ml/models/*` and `/ml/datasets/*` to `admin` and `data_scientist`.
- Data protection:
  - Avoid storing PII in datasets used for ML where possible.
  - Consider pseudonymization before export to external ML service.
- Storage:
  - Local dev: files remain local and private.
  - Cloud: private buckets, short-lived presigned URLs, server-side encryption.

### 7) Phased Roadmap
- Phase A (Local-first MVP):
  - Use `STORAGE_DRIVER=local`, finish UI wiring for datasets (done) and models (list/create/train/deploy).
  - Implement synchronous training in BE with mock metrics (or a simple baseline model).
  - Display metrics in `DataScientistDashboard` from `GET /ml/models`.
- Phase B (Async jobs & artifacts):
  - Introduce job queue or external `ML_SERVICE_URL` for async training.
  - Add endpoints to retrieve training artifacts (confusion matrix, feature importance).
  - Add presigned URL generation for cloud storage.
- Phase C (Cloud-ready):
  - Switch to S3/GCS/Azure via `STORAGE_DRIVER`.
  - Enable retention policy, encryption, and audit logs.

### 8) API Mapping (Existing/Planned)
- Datasets:
  - `GET /ml/datasets` (exists)
  - `POST /ml/datasets/upload` (exists)
  - `GET /ml/datasets/:id` (exists)
  - `GET /ml/datasets/:id/preview` (exists)
  - `GET /ml/datasets/:id/statistics` (exists)
  - `DELETE /ml/datasets/:id` (exists)
- ML Models:
  - `GET /ml/models` (exists)
  - `POST /ml/models` (exists)
  - `PUT /ml/models/:id` (exists)
  - `POST /ml/models/:id/train` (exists)
  - `POST /ml/models/:id/deploy` (exists)
  - `DELETE /ml/models/:id` (exists)

### 9) Local Setup Checklist
1. Ensure `.env` (or env vars) includes:
```
STORAGE_DRIVER=local
LOCAL_STORAGE_DIR=./backend/uploads
URL_EXPIRE_SECONDS=3600
ML_SERVICE_URL=
```
2. Create directory `./backend/uploads` (writeable).
3. Run backend and frontend normally; upload datasets via UI; train model from UI.
4. Verify metrics show in the Data Scientist dashboard after training.

— End of document —


