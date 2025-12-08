# User Guide: AI Features

## 1. Introduction

This guide explains how to use the AI-powered features of the Student Mental Health Dashboard. The system provides different capabilities based on your user role.

## 2. For Data Scientists

As a Data Scientist, your primary responsibility is to manage the Machine Learning lifecycle to ensure accurate risk predictions.

### 2.1 Accessing the Dashboard
1.  Log in with your Data Scientist credentials.
2.  Navigate to the **"Model Management"** tab in your dashboard.

### 2.2 Managing Datasets
Before training a model, you need to upload training data.
1.  Go to the **"Datasets"** section.
2.  Click **"Upload Dataset"**.
3.  Select a CSV file containing historical student mental health records.
    *   *Format Requirements:* The CSV must contain columns for `stress_level`, `anxiety_level`, `sleep_quality`, etc.
4.  The dataset will appear in the list with status "Ready".

### 2.3 Training a New Model
1.  Click **"Create New Model"**.
2.  **Configuration:**
    *   **Name:** Give your model a descriptive name (e.g., "Risk Predictor v2").
    *   **Algorithm:** Select an algorithm (e.g., Random Forest, Logistic Regression).
    *   **Hyperparameters:** Adjust settings if necessary (or use defaults).
3.  Click **"Create"**. The model will appear in the list with status `Created`.
4.  Select the model and click **"Train"**.
5.  Choose the **Dataset** you uploaded earlier.
6.  Click **"Start Training"**.
    *   *Note:* Training may take a few minutes. The status will change to `Training` and then `Trained`.

### 2.4 Evaluating & Deploying
1.  Once trained, click on the model to view **Metrics**:
    *   **Accuracy:** Overall correctness.
    *   **Precision/Recall:** Effectiveness in identifying high-risk students.
2.  If satisfied with the performance, click **"Deploy"**.
3.  **Confirm Deployment:** This will replace the currently active model. All new student assessments will now use this model for predictions.

---

## 3. For Consultants & Counselors

As a Consultant, you use AI insights to identify students who need immediate attention.

### 3.1 Viewing Student Risk Profiles
1.  Navigate to the **"Students"** list.
2.  The list shows a **Risk Score** column.
    *   🔴 **Red (High/Critical):** Immediate attention required.
    *   🟡 **Yellow (Medium):** Monitor closely.
    *   🟢 **Green (Low):** Healthy range.
3.  Click on a student's name to view their **Detailed Profile**.

### 3.2 Interpreting AI Predictions
In the Student Profile, look for the **"AI Risk Assessment"** card.
*   **Predicted Risk Score:** A number from 0-100 indicating the likelihood of mental health issues.
*   **Risk Factors:** The system may highlight contributing factors (e.g., "Low Sleep Quality", "High Academic Stress").
*   **Confidence:** The system's confidence in this prediction.

### 3.3 Taking Action
*   **Schedule Meeting:** Use the "Schedule" button to set up a counseling session.
*   **Add Notes:** Record your professional observations. These notes help validate or correct the AI's assessment over time.

---

## 4. For Teachers

Teachers have a limited view focused on academic support.

### 4.1 Class Overview
1.  Navigate to **"My Classes"**.
2.  You will see an aggregated **Class Wellness Score**.
3.  *Privacy Note:* You cannot see detailed mental health records or specific risk scores for individual students unless explicitly authorized.

### 4.2 Early Warning System
*   If a student's academic performance drops significantly, the system may cross-reference this with wellness trends and alert the school counselor (not the teacher directly, to preserve privacy).
