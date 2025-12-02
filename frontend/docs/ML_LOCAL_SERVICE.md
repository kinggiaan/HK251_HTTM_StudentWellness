## Local ML Service (Node)

Mục tiêu: chạy train cục bộ để test end-to-end trước khi đưa online.

### 1) Cấu trúc
```
ml-service/
  package.json
  tsconfig.json
  src/index.ts     # Express server: POST /train
```

### 2) Chạy service
```
cd ml-service
npm i
npm run dev
```
Service chạy ở `http://localhost:5001`.

### 3) Kết nối với Backend
- Backend cần biến môi trường:
```
ML_SERVICE_URL=http://localhost:5001
```
- Khi bấm Re-Train trên FE:
  - Backend gọi `POST /train` với payload:
    - `modelId`, `datasetId`, `datasetPath` (đường dẫn file CSV local), `algorithm`, `hyperparameters`, `features`, `targetVariable`, `trainTestSplit`.
  - Local service đọc file CSV (nếu có), tính toán số dòng và trả về metrics giả lập ổn định (accuracy/precision/recall/f1) dựa trên kích thước dữ liệu, giúp test UI/BE.

### 4) Lưu ý dataset
- Backend lưu file tại `backend/uploads/datasets/...`. `datasetPath` được backend gửi thẳng sang service, nên service đọc trực tiếp file CSV local.
- Có thể upload file mẫu: `docs/sample_datasets/unified_schema_sample.csv` trong UI Data Scientist.

### 5) Mở rộng sau này
- Thay `src/index.ts` bằng pipeline thật (Python/Sklearn/PyTorch) hoặc tách sang service Python, giữ nguyên hợp đồng API `/train`.
- Trả artifacts (confusion matrix/feature importance) để FE hiển thị.


