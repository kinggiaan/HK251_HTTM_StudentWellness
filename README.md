# Project: Student Wellness Management

# Team:
1. Duong Gia An - 2470293
2. Vo Duong Xuan Nguyen - 2470738
3. Huynh Duc Nham - 2570276

# Deployment Guide

This guide provides step-by-step instructions to deploy the Student Wellness Management System. The system consists of three main components:
1.  **Backend**: Strapi (Node.js) - Headless CMS & API
2.  **ML Service**: FastAPI (Python) - Machine Learning Model Server
3.  **Frontend**: React (Vite) - User Interface

---

## 1. Prerequisites

Before starting, ensure you have the following installed:
-   **Node.js**: v18 or v20 (Recommended)
-   **npm** or **yarn**
-   **Python**: v3.9+
-   **Git**

---

## 2. Manual Deployment (Development/Testing)

This method is suitable for local development or simple server testing.

### Step 1: Backend (Strapi)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the `backend` folder (copy from `.env.example` if available). Basic configuration:
    ```env
    HOST=0.0.0.0
    PORT=1337
    APP_KEYS=toBeModified1,toBeModified2
    API_TOKEN_SALT=tobemodified
    ADMIN_JWT_SECRET=tobemodified
    TRANSFER_TOKEN_SALT=tobemodified
    # Database config (default is SQLite, no extra config needed for quick start)
    JWT_SECRET=tobemodified
    ```

4.  Build and Start:
    ```bash
    npm run build
    npm run develop
    ```
    *   **Admin Panel**: `http://localhost:1337/admin`
    *   **API Endpoint**: `http://localhost:1337/api`

### Step 2: ML Service (Python)

1.  Navigate to the ML service directory:
    ```bash
    cd ml-service
    ```

2.  Create a Virtual Environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # Linux/Mac
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install Dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Start the Service:
    ```bash
    python main.py
    ```
    *   **Service URL**: `http://localhost:8000`
    *   **Docs**: `http://localhost:8000/docs`

### Step 3: Frontend (React)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install Dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the `frontend` folder:
    ```env
    # URL to the Strapi Backend API
    VITE_API_BASE_URL=http://localhost:1337/api
    ```

4.  Start the Development Server:
    ```bash
    npm run dev
    ```
    *   **Application URL**: `http://localhost:5173`

### Step 4: Use with demo accounts

You can log in using the following pre-created demo accounts:

- supervisor@gmail.com/12345678  
- engineer@gmail.com/12345678  
- consultant@gmail.com/12345678  

---

## 3. Production Build (Manual)

To run the application in a production-like mode:

### Backend
```bash
cd backend
npm run build
npm run start
```

### ML Service
Use a production server like Gunicorn (Linux/Mac):
```bash
cd ml-service
# Example (requires gunicorn installation):
# gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```
*On Windows, continuing to run `python main.py` is acceptable for simple usage, or use `waitress`.*

### Frontend
Build static files for serving:
```bash
cd frontend
npm run build
```
The output will be in `frontend/dist`. You can serve this folder using Nginx, Apache, or `serve`:
```bash
npx serve -s dist
```

---

## 4. Troubleshooting

*   **Port Conflicts**:
    *   Ensure ports `1337` (Backend), `8000` (ML), and `5173` (Frontend) are free.
*   **Database Locking (SQLite)**:
    *   If you see database lock errors in Backend, ensure only one instance of Strapi is running.
*   **CORS Issues**:
    *   If Frontend cannot talk to Backend, check `config/middlewares.ts` in Backend to ensure CORS is enabled and allows the frontend origin.

