# How to run?
1. `python -m venv venv`
2. `source ./venv/bin/activate`
3. `pip install -r requirements.txt`
4. `python main.py`

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