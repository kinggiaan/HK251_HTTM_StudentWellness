# How to run?
1. `python -m venv venv`
2. `source ./venv/bin/activate` (Linux/Mac) hoặc `.\venv\Scripts\activate` (Windows)
3. `pip install -r requirements.txt`
4. `python main.py`

ML Service sẽ chạy tại: **http://localhost:8000**

# Environment Variables (Required for Auto-Predict)

Để sử dụng tính năng **Auto-Predict** khi deploy model, bạn cần cấu hình file `.env`:

## Setup .env file:

1. Copy file template:
```bash
cp .env.template .env
```

2. Mở file `.env` và điền thông tin:
```env
# Strapi Backend URL
BACKEND_URL=http://localhost:1337

# Strapi User Credentials (user có quyền đọc/sửa students)
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
```

| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_URL` | No (default: `http://localhost:1337`) | URL của Strapi Backend |
| `ADMIN_EMAIL` | **Yes** | Email của user Strapi |
| `ADMIN_PASSWORD` | **Yes** | Password của user |

⚠️ **QUAN TRỌNG**: 
- File `.env` chứa thông tin nhạy cảm, **KHÔNG ĐƯỢC commit lên git**
- File `.env` đã được thêm vào `.gitignore`

## Tính năng Auto-Predict:
Khi deploy một preset, hệ thống sẽ tự động:
1. Đăng nhập vào Strapi với credentials từ `.env`
2. Lấy danh sách tất cả students
3. Chạy prediction cho từng student với model mới
4. Cập nhật kết quả `depression_predicting` vào database

# Available features:
```
[
  "Gender",
  "Age",
  "Academic Pressure",
  "CGPA",
  "Study Satisfaction",
  "Sleep Duration",
  "Dietary Habits",
  "Work/Study Hours",
  "Financial Stress",
  "Family History of Mental Illness",
]
```

# Example of config:
```
{
  "features": [
    "Gender",
    "Age",
    "Academic Pressure",
    "CGPA",
    "Study Satisfaction",
    "Sleep Duration",
    "Dietary Habits",
    "Work/Study Hours",
    "Financial Stress",
    "Family History of Mental Illness"
  ],
  "test_size": 0.2,
  "n_estimators": 500,
  "max_depth": null,
  "class_weight": "balanced"
}
```

# Prediction examples:
## Truth = 0:
```
{
  "id": 26,
  "Gender": "Male",
  "Age": 31,
  "City": "Srinagar",
  "Profession": "Student",
  "Academic Pressure": 3,
  "Work Pressure": 0,
  "CGPA": 7.03,
  "Study Satisfaction": 5,
  "Job Satisfaction": 0,
  "Sleep Duration": "'Less than 5 hours'",
  "Dietary Habits": "Healthy",
  "Degree": "BA",
  "Have you ever had suicidal thoughts ?": "No",
  "Work/Study Hours": 9,
  "Financial Stress": 1,
  "Family History of Mental Illness": "Yes"
}
```

## Truth = 1:
```
{
  "id": 62,
  "Gender": "Male",
  "Age": 31,
  "City": "Nashik",
  "Profession": "Student",
  "Academic Pressure": 2,
  "Work Pressure": 0,
  "CGPA": 8.38,
  "Study Satisfaction": 3,
  "Job Satisfaction": 0,
  "Sleep Duration": "'Less than 5 hours'",
  "Dietary Habits": "Moderate",
  "Degree": "LLB",
  "Have you ever had suicidal thoughts ?": "Yes",
  "Work/Study Hours": 2,
  "Financial Stress": 5,
  "Family History of Mental Illness": "No"
}
```