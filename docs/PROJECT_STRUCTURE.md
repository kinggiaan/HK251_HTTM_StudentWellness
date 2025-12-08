# 📂 Project Structure

## 🏗️ Tổng Quan Cấu Trúc

```
HK251_HTTM_StudentWellness/
├── 📁 backend/              # Strapi Backend (Node.js)
├── 📁 frontend/             # React Frontend (Vite)
├── 📁 ml-service/           # Python ML Service
├── 📁 docs/                 # Documentation
├── 📁 tests/                # E2E Tests (Playwright)
├── 📁 .husky/              # Git hooks
├── 📄 README.md            # Project overview
└── 📄 .gitignore           # Git ignore rules
```

---

## 🎨 Frontend Structure

```
frontend/
├── 📁 src/
│   ├── 📁 components/       # React Components
│   │   ├── DataScientistDashboard.tsx    # ML Dashboard
│   │   ├── ConsultantDashboard.tsx       # Consultant View
│   │   ├── SupervisorDashboard.tsx       # Supervisor View
│   │   └── DatasetManagementSection.tsx  # Dataset Management
│   │
│   ├── 📁 contexts/         # React Contexts
│   │   ├── AuthContext.tsx              # Authentication
│   │   └── PermissionContext.tsx        # Permissions
│   │
│   ├── 📁 hooks/            # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   └── useStudents.ts
│   │
│   ├── 📁 services/         # API Services
│   │   ├── api.ts           # API client
│   │   ├── auth.service.ts  # Auth API
│   │   ├── ml.service.ts    # ML API
│   │   └── students.service.ts
│   │
│   ├── 📁 utils/            # Utility Functions
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   ├── 📁 styles/           # CSS Styles
│   │   └── index.css
│   │
│   ├── 📁 assets/           # Static Assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── 📄 App.tsx           # Main App Component
│   ├── 📄 main.tsx          # Entry Point
│   └── 📄 index.css         # Global Styles
│
├── 📁 public/               # Public Assets
│   └── robots.txt
│
├── 📁 docs/                 # Frontend Docs
│   ├── 01-Software-Architecture.md
│   ├── 02-System-Design.md
│   ├── 03-Database-Schema.md
│   ├── 04-Use-Cases.md
│   └── ...
│
├── 📄 package.json          # Dependencies
├── 📄 vite.config.ts        # Vite Config
├── 📄 tsconfig.json         # TypeScript Config
└── 📄 README.md
```

### Component Organization

#### 📊 Dashboard Components
- **DataScientistDashboard**: ML model management, training, datasets
- **ConsultantDashboard**: Student counseling interface
- **SupervisorDashboard**: Overview and management

#### 🔧 Feature Components
- **DatasetManagementSection**: Upload, manage ML datasets
- **ModelConfiguration**: Configure ML models
- **StudentRiskAssessment**: View risk predictions

#### 🎨 UI Components
- **NotificationPanel**: Display notifications
- **Sidebar**: Navigation sidebar
- **Modal dialogs**: Various dialogs

---

## 🔙 Backend Structure

```
backend/
├── 📁 src/
│   ├── 📁 api/              # API Endpoints
│   │   ├── 📁 user/         # User endpoints
│   │   ├── 📁 student/      # Student endpoints
│   │   ├── 📁 ml-model/     # ML Model endpoints
│   │   └── 📁 dataset/      # Dataset endpoints
│   │
│   ├── 📁 admin/            # Admin Panel Config
│   │   └── app.tsx
│   │
│   ├── 📁 extensions/       # Strapi Extensions
│   │   └── users-permissions/
│   │
│   └── 📄 index.ts          # Entry Point
│
├── 📁 config/               # Configuration
│   ├── admin.ts             # Admin config
│   ├── api.ts               # API config
│   ├── database.ts          # Database config
│   ├── middlewares.ts       # Middleware config
│   ├── plugins.ts           # Plugin config
│   └── server.ts            # Server config
│
├── 📁 database/
│   └── migrations/          # Database migrations
│
├── 📁 public/               # Public files
│   ├── uploads/             # Uploaded files
│   └── robots.txt
│
├── 📁 types/                # TypeScript types
│   └── generated/
│
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 .env.example          # Environment template
```

### API Structure

```
API Endpoints:
├── /api/auth/               # Authentication
│   ├── POST /local          # Login
│   ├── POST /register       # Register
│   └── GET /me              # Get current user
│
├── /api/users               # Users
│   ├── GET /users           # List users
│   ├── GET /users/:id       # Get user
│   ├── PUT /users/:id       # Update user
│   └── DELETE /users/:id    # Delete user
│
├── /api/students            # Students
│   ├── GET /students        # List students
│   ├── GET /students/:id    # Get student
│   ├── POST /students       # Create student
│   ├── PUT /students/:id    # Update student
│   └── DELETE /students/:id # Delete student
│
├── /api/ml-models           # ML Models
│   ├── GET /ml-models       # List models
│   ├── POST /ml-models/train      # Train model
│   └── POST /ml-models/predict    # Make prediction
│
└── /api/datasets            # Datasets
    ├── GET /datasets        # List datasets
    ├── POST /datasets       # Upload dataset
    └── DELETE /datasets/:id # Delete dataset
```

---

## 🤖 ML Service Structure

```
ml-service/
├── 📁 models/               # Trained models
│   └── student_risk_model.pkl
│
├── 📁 datasets/             # Training datasets
│   └── students_data.csv
│
├── 📁 src/                  # Source code
│   ├── train.py             # Model training
│   ├── predict.py           # Predictions
│   ├── preprocessing.py     # Data preprocessing
│   └── utils.py             # Utilities
│
├── 📄 app.py                # Flask API
├── 📄 requirements.txt      # Python dependencies
└── 📄 README.md
```

---

## 🧪 Tests Structure

```
tests/
├── 📁 e2e/                  # E2E Tests
│   ├── login-and-dashboard.spec.ts
│   ├── smoke.spec.ts
│   └── helpers/
│       └── test-helpers.ts
│
├── 📁 unit/                 # Unit Tests
│   └── (future)
│
├── 📄 playwright.config.ts  # Playwright config
└── 📄 README.md
```

---

## 📋 Configuration Files

### Root Level
- **README.md**: Project overview
- **package.json**: Root dependencies (for E2E tests)
- **.gitignore**: Git ignore rules
- **.env**: Environment variables (not committed)

### Frontend
- **vite.config.ts**: Vite bundler configuration
- **tsconfig.json**: TypeScript configuration
- **package.json**: Frontend dependencies
- **index.html**: HTML entry point

### Backend
- **tsconfig.json**: TypeScript configuration
- **package.json**: Backend dependencies
- **.env**: Strapi environment variables
- **database.ts**: Database configuration
- **server.ts**: Server configuration

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `DataScientistDashboard.tsx`)
- **Utilities**: camelCase (e.g., `helpers.ts`)
- **Styles**: kebab-case (e.g., `dashboard-styles.css`)
- **Tests**: `*.spec.ts` or `*.test.ts`

### Folders
- **lowercase**: All folder names (e.g., `components/`, `services/`)

### Code
- **Components**: PascalCase (e.g., `StudentCard`)
- **Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `StudentData`)

---

## 🔗 Module Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "@radix-ui/*": "UI components",
  "recharts": "Charting library",
  "tailwindcss": "CSS framework"
}
```

### Backend Dependencies
```json
{
  "@strapi/strapi": "CMS framework",
  "pg": "PostgreSQL driver",
  "redis": "Redis client"
}
```

### ML Service Dependencies
```python
flask==2.x
pandas==2.x
scikit-learn==1.x
numpy==1.x
```

---

## 📚 Related Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [API Documentation](./API.md)
- [Component Guide](./COMPONENTS.md)
- [Coding Standards](./CODING_STANDARDS.md)
