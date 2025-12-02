# Software Architecture Document

## 1. Tổng Quan

### 1.1 Mục Đích
Tài liệu này mô tả kiến trúc phần mềm của hệ thống **Student Mental Health Dashboard**, một hệ thống quản lý và giám sát sức khỏe tinh thần cho sinh viên.

### 1.2 Phạm Vi
- Kiến trúc tổng thể hệ thống
- Các thành phần chính
- Công nghệ sử dụng
- Mô hình triển khai

### 1.3 Đối Tượng Đọc
- Software Architects
- Developers
- DevOps Engineers
- Project Managers

## 2. Kiến Trúc Tổng Thể

### 2.1 Mô Hình Kiến Trúc
Hệ thống sử dụng kiến trúc **3-Tier Architecture** với các lớp:

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer (Frontend)         │
│         React + TypeScript + Vite              │
└─────────────────────────────────────────────────┘
                      ↕ HTTP/REST API
┌─────────────────────────────────────────────────┐
│          Application Layer (Backend)            │
│    Node.js + Express + TypeScript + Prisma     │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│            Data Layer (Database)                │
│         PostgreSQL + Redis                      │
└─────────────────────────────────────────────────┘
```

### 2.2 Các Thành Phần Chính

#### 2.2.1 Frontend (Presentation Layer)
- **Framework**: React 18+ với TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **UI Library**: Custom components với Tailwind CSS
- **HTTP Client**: Fetch API với custom wrapper
- **Real-time**: Socket.IO Client (tương lai)

**Cấu trúc thư mục:**
```
src/
├── components/      # React components
├── contexts/        # React contexts (Auth, etc.)
├── services/        # API services
├── hooks/          # Custom React hooks
├── utils/           # Utility functions
├── lib/             # Library configurations
└── data/            # Mock data (development)
```

#### 2.2.2 Backend (Application Layer)
- **Runtime**: Node.js với TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: Zod
- **Logging**: Pino
- **Real-time**: Socket.IO (tương lai)

**Cấu trúc thư mục:**
```
backend/
├── src/
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── students/    # Student management
│   │   ├── sessions/    # Counseling sessions
│   │   ├── notifications/ # Notifications
│   │   ├── analytics/   # Analytics
│   │   ├── mlModels/    # ML Models
│   │   └── datasets/    # Datasets
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration
│   └── routes/          # Route definitions
├── prisma/              # Database schema
└── tests/               # Test files
```

#### 2.2.3 Data Layer
- **Primary Database**: PostgreSQL
  - Lưu trữ dữ liệu chính (users, students, records, etc.)
  - ACID compliance
  - Relational data với foreign keys
  
- **Cache/Session Store**: Redis
  - Session management
  - Rate limiting
  - Pub/Sub cho real-time features

### 2.3 External Services

#### 2.3.1 ML Service (Tương lai)
- **Purpose**: Machine Learning model training và inference
- **Protocol**: REST API
- **Integration**: Backend gọi ML service qua HTTP

#### 2.3.2 File Storage (Tương lai)
- **Purpose**: Lưu trữ files (datasets, documents)
- **Options**: AWS S3, Google Cloud Storage, hoặc local storage

## 3. Kiến Trúc Module

### 3.1 Module Structure
Mỗi module trong backend tuân theo pattern:

```
module/
├── module.schema.ts      # Zod validation schemas
├── module.service.ts     # Business logic
├── module.controller.ts  # Request handlers
├── module.routes.ts    # Route definitions
└── index.ts             # Module exports
```

### 3.2 Module Dependencies

```
auth → users
students → users (consultant assignment)
sessions → students, users
notifications → users, students, sessions
analytics → students, sessions, mentalHealthRecords
mlModels → datasets
datasets → users (uploader)
```

## 4. Data Flow

### 4.1 Authentication Flow
```
User → Frontend → POST /auth/login
                → Backend validates credentials
                → Generate JWT tokens
                → Return tokens + user info
                → Frontend stores tokens
                → Subsequent requests include Bearer token
```

### 4.2 Data Fetching Flow
```
Frontend → API Client → Express Middleware (Auth)
                      → Controller → Service
                      → Prisma ORM → PostgreSQL
                      → Response → Frontend
```

### 4.3 Real-time Flow (Tương lai)
```
Event → Backend → Socket.IO Server
                → Redis Pub/Sub
                → Socket.IO Clients (Frontend)
                → UI Update
```

## 5. Security Architecture

### 5.1 Authentication
- **JWT Access Tokens**: Short-lived (15 phút)
- **JWT Refresh Tokens**: Long-lived (7 ngày)
- **Token Storage**: 
  - Access token: Memory (không lưu localStorage)
  - Refresh token: localStorage (có thể cải thiện với httpOnly cookies)

### 5.2 Authorization
- **Role-Based Access Control (RBAC)**
- **Roles**: admin, consultant, teacher_supervisor, data_scientist
- **Permission Matrix**: Xem [User Roles & Permissions](./05-User-Roles-Permissions.md)

### 5.3 Data Protection
- **Password Hashing**: bcrypt với salt rounds
- **HTTPS**: Bắt buộc trong production
- **CORS**: Configured cho frontend origin
- **Rate Limiting**: Redis-based (tương lai)
- **Input Validation**: Zod schemas

## 6. Scalability & Performance

### 6.1 Horizontal Scaling
- **Stateless Backend**: Có thể scale horizontally
- **Database**: PostgreSQL với connection pooling
- **Cache**: Redis để giảm database load

### 6.2 Performance Optimization
- **Database Indexing**: Trên các fields thường query
- **Pagination**: Tất cả list endpoints
- **Caching**: Redis cho frequently accessed data
- **Lazy Loading**: Frontend code splitting

## 7. Deployment Architecture

### 7.1 Development Environment
```
Frontend (Vite Dev Server) → Backend (Node.js) → Docker Compose (PostgreSQL + Redis)
```

### 7.2 Production Environment (Đề xuất)
```
CDN/Static Hosting (Frontend)
    ↓
Load Balancer
    ↓
Backend Servers (Node.js - Multiple Instances)
    ↓
PostgreSQL (Primary + Replica)
Redis Cluster
```

## 8. Technology Stack

### 8.1 Frontend
- React 18+
- TypeScript 5+
- Vite 5+
- Tailwind CSS
- Sonner (Toast notifications)
- Socket.IO Client (tương lai)

### 8.2 Backend
- Node.js 20+
- TypeScript 5+
- Express.js 4+
- Prisma 5+
- PostgreSQL 15+
- Redis 7+
- JWT (jsonwebtoken)
- Zod (validation)
- Pino (logging)
- Socket.IO (tương lai)

### 8.3 DevOps
- Docker & Docker Compose
- npm scripts
- Git

## 9. Non-Functional Requirements

### 9.1 Performance
- API Response Time: < 200ms (p95)
- Page Load Time: < 2s
- Database Query Time: < 100ms (p95)

### 9.2 Availability
- Target: 99.9% uptime
- Health checks và monitoring

### 9.3 Security
- OWASP Top 10 compliance
- Regular security audits
- Dependency updates

### 9.4 Maintainability
- Code coverage: > 80%
- Documentation: Up-to-date
- Code reviews: Required

## 10. Future Enhancements

### 10.1 Planned Features
- Real-time notifications với Socket.IO
- ML model integration
- File upload/storage
- Advanced analytics dashboard
- Mobile app (React Native)

### 10.2 Infrastructure
- CI/CD pipeline
- Automated testing
- Monitoring & alerting (Prometheus, Grafana)
- Log aggregation (ELK stack)

## 11. References

- [System Design](./02-System-Design.md)
- [API Documentation](./06-API-Documentation.md)
- [Database Schema](./03-Database-Schema.md)
- [Deployment Guide](./11-Deployment-Guide.md)


