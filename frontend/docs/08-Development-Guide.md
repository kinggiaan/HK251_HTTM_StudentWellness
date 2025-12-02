# Development Guide

## 1. Tổng Quan

Hướng dẫn này giúp developers setup môi trường phát triển và làm việc với codebase của Student Mental Health Dashboard.

## 2. Prerequisites

### 2.1 Required Software
- **Node.js**: v20+ (recommended: v24+)
- **npm**: v9+ (comes with Node.js)
- **Docker**: v20+ (for PostgreSQL và Redis)
- **Docker Compose**: v2+ (comes with Docker)
- **Git**: Latest version

### 2.2 Recommended Tools
- **VS Code**: Code editor
- **PostgreSQL Client**: pgAdmin hoặc DBeaver
- **Redis Client**: RedisInsight
- **Postman/Insomnia**: API testing

## 3. Project Structure

```
HTTM_Project/
├── backend/              # Backend application
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # Route definitions
│   │   ├── utils/       # Utility functions
│   │   └── config/      # Configuration
│   ├── prisma/          # Database schema & migrations
│   ├── tests/           # Test files
│   └── package.json
├── src/                 # Frontend application
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── lib/            # Library configs
├── docs/               # Documentation
└── package.json        # Root package.json
```

## 4. Setup Development Environment

### 4.1 Clone Repository
```bash
git clone <repository-url>
cd HTTM_Project
```

### 4.2 Backend Setup

#### 4.2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 4.2.2 Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env với các giá trị phù hợp
# DATABASE_URL, REDIS_URL, JWT_SECRET, etc.
```

#### 4.2.3 Start Docker Services
```bash
# Windows PowerShell
docker compose up -d postgres redis

# Hoặc sử dụng script
.\scripts\windows-start-services.ps1
```

#### 4.2.4 Database Setup
```bash
# Create shadow database (nếu chưa có)
docker compose exec postgres psql -U admin -d postgres -c "CREATE DATABASE mental_health_db_shadow;"

# Run migrations
npm run migrate:dev

# Seed database
npm run seed
```

#### 4.2.5 Start Backend Server
```bash
npm run dev
```

Backend sẽ chạy tại `http://localhost:4000`

### 4.3 Frontend Setup

#### 4.3.1 Install Dependencies
```bash
# Từ root directory
npm install
```

#### 4.3.2 Environment Configuration
```bash
# Tạo .env file trong root
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
```

#### 4.3.3 Start Frontend Dev Server
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000` (hoặc port khác nếu 3000 đã được sử dụng)

## 5. Development Workflow

### 5.1 Git Workflow

#### 5.1.1 Branch Naming
- `feature/feature-name`: New features
- `fix/bug-name`: Bug fixes
- `refactor/refactor-name`: Code refactoring
- `docs/docs-name`: Documentation updates

#### 5.1.2 Commit Messages
```
feat: Add student search functionality
fix: Fix login error handling
refactor: Improve API error responses
docs: Update API documentation
```

### 5.2 Code Style

#### 5.2.1 TypeScript
- Sử dụng TypeScript strict mode
- Explicit types cho function parameters và returns
- Avoid `any` type

#### 5.2.2 Naming Conventions
- **Files**: `kebab-case` (e.g., `student.service.ts`)
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

#### 5.2.3 Code Formatting
- Sử dụng Prettier (nếu có)
- 2 spaces indentation
- Trailing commas
- Single quotes cho strings

### 5.3 Module Development

#### 5.3.1 Tạo Module Mới

1. **Tạo folder structure**:
```
backend/src/modules/newModule/
├── newModule.schema.ts
├── newModule.service.ts
├── newModule.controller.ts
├── newModule.routes.ts
└── index.ts
```

2. **Define Schema** (Zod):
```typescript
// newModule.schema.ts
import { z } from 'zod';

export const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    // ...
  })
});
```

3. **Implement Service**:
```typescript
// newModule.service.ts
export async function create(input: CreateInput, context: RequestContext) {
  // Business logic
  // Database operations
  // Return result
}
```

4. **Create Controller**:
```typescript
// newModule.controller.ts
export const createHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await create(body, buildContext(req));
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: result
  });
});
```

5. **Define Routes**:
```typescript
// newModule.routes.ts
router.post('/', authenticate, validateRequest(createSchema), createHandler);
```

6. **Register Routes**:
```typescript
// backend/src/routes/index.ts
router.use('/new-module', newModuleRouter);
```

## 6. Testing

### 6.1 Running Tests

```bash
# Backend tests
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### 6.2 Writing Tests

#### 6.2.1 Unit Tests
```typescript
import { describe, it, expect } from 'vitest';
import { calculateRiskScore } from './utils';

describe('calculateRiskScore', () => {
  it('should calculate risk score correctly', () => {
    const score = calculateRiskScore(7, 6, 5);
    expect(score).toBe(75);
  });
});
```

#### 6.2.2 Integration Tests
```typescript
import request from 'supertest';
import app from '../app';

describe('POST /api/students', () => {
  it('should create a student', async () => {
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: 'SV001',
        name: 'Test Student',
        email: 'test@student.edu'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.studentId).toBe('SV001');
  });
});
```

## 7. Database Management

### 7.1 Migrations

```bash
# Create migration
npm run migrate:dev -- --name migration_name

# Apply migrations
npm run migrate:deploy

# Reset database (development only)
npm run migrate:reset
```

### 7.2 Prisma Studio

```bash
# Open Prisma Studio (GUI for database)
npm run prisma:studio
```

### 7.3 Seed Data

```bash
# Run seed script
npm run seed

# Seed chỉ chạy trong development
```

## 8. Debugging

### 8.1 Backend Debugging

#### 8.1.1 VS Code Debug Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

#### 8.1.2 Logging
```typescript
import logger from '../config/logger';

logger.info('Processing request', { userId, action });
logger.error('Error occurred', { error, context });
```

### 8.2 Frontend Debugging

#### 8.2.1 React DevTools
- Install React DevTools browser extension
- Inspect component state và props

#### 8.2.2 Console Logging
```typescript
console.log('Debug info', { data });
console.error('Error', error);
```

## 9. Common Tasks

### 9.1 Add New API Endpoint

1. Define schema trong `module.schema.ts`
2. Implement service function trong `module.service.ts`
3. Create controller handler trong `module.controller.ts`
4. Add route trong `module.routes.ts`
5. Test endpoint với Postman/Insomnia

### 9.2 Add New Database Table

1. Update `prisma/schema.prisma`
2. Create migration: `npm run migrate:dev`
3. Update seed nếu cần
4. Update types và services

### 9.3 Add New Frontend Component

1. Create component file trong `src/components/`
2. Import và sử dụng trong parent component
3. Add styles với Tailwind CSS
4. Test component rendering

## 10. Troubleshooting

### 10.1 Common Issues

#### Database Connection Error
```bash
# Check Docker containers
docker compose ps

# Restart containers
docker compose restart postgres
```

#### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :4000

# Kill process (Windows)
taskkill /PID <pid> /F
```

#### Module Not Found
```bash
# Clear node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

### 10.2 Getting Help

- Check existing documentation trong `docs/`
- Review error logs
- Check GitHub issues (nếu có)
- Contact team lead

## 11. Best Practices

### 11.1 Code Quality
- Write clean, readable code
- Follow existing patterns
- Add comments cho complex logic
- Keep functions small và focused

### 11.2 Security
- Never commit secrets
- Validate all inputs
- Use parameterized queries (Prisma handles this)
- Follow principle of least privilege

### 11.3 Performance
- Use pagination cho large datasets
- Optimize database queries
- Cache frequently accessed data
- Minimize API calls từ frontend

## 12. References

- [Software Architecture](./01-Software-Architecture.md)
- [API Documentation](./06-API-Documentation.md)
- [Code Standards](./10-Code-Standards.md)
- [Testing Guide](./09-Testing-Guide.md)


