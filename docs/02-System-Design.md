# System Design Document

## 1. Tổng Quan

Tài liệu này mô tả thiết kế chi tiết của hệ thống Student Mental Health Dashboard, bao gồm các design patterns, data flow, và component interactions.

## 2. Design Principles

### 2.1 Separation of Concerns
- **Frontend**: UI/UX, user interactions
- **Backend**: Business logic, data processing
- **Database**: Data persistence

### 2.2 Modularity
- Feature-based modules trong backend
- Component-based architecture trong frontend
- Reusable utilities và services

### 2.3 Scalability
- Stateless backend design
- Horizontal scaling support
- Database indexing strategy

### 2.4 Security First
- Authentication & authorization ở mọi layer
- Input validation
- Audit logging

## 3. Component Architecture

### 3.1 Frontend Components

```
App
├── AuthProvider (Context)
│   ├── LoginPage
│   └── Dashboard Router
│       ├── ConsultantDashboard
│       │   ├── Sidebar
│       │   ├── Header
│       │   ├── StudentsTable
│       │   └── Analytics
│       ├── TeacherSupervisorDashboard
│       └── DataScientistDashboard
└── Services Layer
    ├── auth.service
    ├── students.service
    └── mentalHealth.service
```

### 3.2 Backend Modules

```
Backend
├── Modules (Feature-based)
│   ├── auth/
│   │   ├── auth.schema.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.routes.ts
│   ├── students/
│   ├── sessions/
│   ├── notifications/
│   ├── analytics/
│   ├── mlModels/
│   └── datasets/
├── Middleware
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── validateRequest.ts
│   └── errorHandler.ts
└── Utils
    ├── jwt.ts
    ├── password.ts
    └── logger.ts
```

## 4. Data Flow Patterns

### 4.1 Request Flow

```
Client Request
    ↓
Express Router
    ↓
Authentication Middleware (JWT)
    ↓
Authorization Middleware (RBAC)
    ↓
Validation Middleware (Zod)
    ↓
Controller
    ↓
Service (Business Logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response (JSON)
```

### 4.2 Authentication Flow

```
1. User Login
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT tokens (access + refresh)
   ↓
4. Store refresh token in database
   ↓
5. Return tokens to frontend
   ↓
6. Frontend stores refresh token
   ↓
7. Subsequent requests include access token
   ↓
8. Access token expires → Use refresh token
   ↓
9. Get new access token
```

### 4.3 Real-time Flow (Future)

```
Event Trigger (e.g., new notification)
    ↓
Backend Service
    ↓
Socket.IO Server
    ↓
Redis Pub/Sub
    ↓
Socket.IO Clients (Frontend)
    ↓
UI Update
```

## 5. Design Patterns

### 5.1 Repository Pattern (via Prisma)
- Prisma Client acts as repository
- Service layer abstracts database operations
- Easy to swap data sources

### 5.2 Service Layer Pattern
- Business logic trong service layer
- Controllers chỉ handle HTTP requests/responses
- Reusable services

### 5.3 Middleware Pattern
- Authentication middleware
- Authorization middleware
- Validation middleware
- Error handling middleware

### 5.4 Context Pattern (Frontend)
- AuthContext cho authentication state
- Global state management
- Provider pattern

## 6. Database Design Patterns

### 6.1 Normalization
- 3NF normalization
- Foreign key relationships
- Indexes cho performance

### 6.2 Soft Deletes (Future)
- `deletedAt` timestamp
- Filter deleted records in queries

### 6.3 Audit Trail
- AuditLog table cho tất cả important actions
- User, action, resource, metadata
- Compliance và security

## 7. API Design Patterns

### 7.1 RESTful API
- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes

### 7.2 Response Format
```json
{
  "success": true,
  "data": {...},
  "pagination": {...} // For list endpoints
}
```

### 7.3 Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": {...} // Validation errors
}
```

## 8. Security Design

### 8.1 Authentication
- JWT tokens (access + refresh)
- Token rotation
- Token revocation

### 8.2 Authorization
- Role-Based Access Control (RBAC)
- Permission checks ở service layer
- Data filtering based on role

### 8.3 Data Protection
- Password hashing (bcrypt)
- Input sanitization
- SQL injection prevention (Prisma)
- XSS prevention

## 9. Performance Design

### 9.1 Caching Strategy
- Redis cho session data
- Cache frequently accessed data
- Cache invalidation strategy

### 9.2 Database Optimization
- Indexes trên frequently queried fields
- Pagination cho large datasets
- Query optimization

### 9.3 Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

## 10. Error Handling Design

### 10.1 Backend Error Handling
```
Error occurs
    ↓
Service throws AppError
    ↓
Error Handler Middleware catches
    ↓
Log error (Pino)
    ↓
Return formatted error response
```

### 10.2 Frontend Error Handling
```
API call fails
    ↓
API Client catches error
    ↓
Transform to user-friendly message
    ↓
Show toast notification
    ↓
Update UI state
```

## 11. Logging Design

### 11.1 Structured Logging
- Pino logger
- JSON format
- Log levels (error, warn, info, debug)

### 11.2 Log Categories
- Request logs
- Error logs
- Audit logs
- Performance logs

## 12. Testing Design

### 12.1 Testing Pyramid
```
        /\
       /  \  E2E Tests (few)
      /____\
     /      \  Integration Tests
    /________\
   /          \  Unit Tests (many)
  /____________\
```

### 12.2 Test Types
- **Unit Tests**: Services, utilities
- **Integration Tests**: API endpoints
- **E2E Tests**: User workflows

## 13. Deployment Design

### 13.1 Development
```
Frontend (Vite Dev Server)
    ↓
Backend (Node.js)
    ↓
Docker Compose
    ├── PostgreSQL
    └── Redis
```

### 13.2 Production (Recommended)
```
CDN/Static Hosting (Frontend)
    ↓
Load Balancer
    ↓
Backend Servers (Multiple Instances)
    ↓
Database Cluster
    ├── PostgreSQL Primary
    ├── PostgreSQL Replica
    └── Redis Cluster
```

## 14. Monitoring Design

### 14.1 Application Monitoring
- Health check endpoints
- Performance metrics
- Error tracking

### 14.2 Infrastructure Monitoring
- Server resources
- Database performance
- Network latency

## 15. References

- [Software Architecture](./01-Software-Architecture.md)
- [API Documentation](./06-API-Documentation.md)
- [Database Schema](./03-Database-Schema.md)


