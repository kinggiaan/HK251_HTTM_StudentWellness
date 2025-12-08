# 💻 Coding Standards

## 📋 General Guidelines

- **Write clean, readable code**: Code is read more often than written
- **Follow DRY principle**: Don't Repeat Yourself
- **Use meaningful names**: Variables and functions should be self-documenting
- **Keep functions small**: Each function should do one thing well
- **Comment when necessary**: Explain *why*, not *what*

---

## 🎯 TypeScript/JavaScript Standards

### Naming Conventions

```typescript
// ✅ Good
const studentData = [];
const API_BASE_URL = 'http://localhost:1337';
const MAX_RETRY_COUNT = 3;

function getUserById(id: number) {}
class StudentService {}
interface UserData {}
type RiskLevel = 'low' | 'medium' | 'high';

// ❌ Bad
const sd = [];
const apibaseurl = 'http://localhost:1337';
const max = 3;

function GetUserById(id: number) {}
class studentservice {}
interface userData {}
type risklevel = string;
```

**Rules:**
- **Variables**: camelCase (`studentData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Functions**: camelCase (`getUserData`, `calculateScore`)
- **Classes**: PascalCase (`StudentService`, `DataManager`)
- **Interfaces/Types**: PascalCase (`UserData`, `ApiResponse`)
- **Components**: PascalCase (`StudentCard`, `DashboardHeader`)

### File Naming

```
// ✅ Good
StudentCard.tsx
useAuth.ts
api.service.ts
helpers.ts
constants.ts

// ❌ Bad
student_card.tsx
UseAuth.ts
API.Service.ts
Helpers.ts
CONSTANTS.ts
```

**Rules:**
- **Components**: PascalCase (e.g., `StudentCard.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth.ts`)
- **Services**: camelCase with `.service.ts` suffix (e.g., `auth.service.ts`)
- **Utils**: camelCase (e.g., `helpers.ts`, `validators.ts`)

---

## ⚛️ React Component Standards

### Component Structure

```typescript
// ✅ Good
import React, { useState, useEffect } from 'react';
import { StudentData } from '@/types';
import { getStudents } from '@/services/api';
import './StudentCard.css';

interface StudentCardProps {
  studentId: number;
  onSelect?: (id: number) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  studentId, 
  onSelect 
}) => {
  // 1. State declarations
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Effects
  useEffect(() => {
    loadStudent();
  }, [studentId]);

  // 3. Event handlers
  const handleClick = () => {
    onSelect?.(studentId);
  };

  // 4. Helper functions
  const loadStudent = async () => {
    setLoading(true);
    try {
      const data = await getStudents(studentId);
      setStudent(data);
    } catch (error) {
      console.error('Failed to load student:', error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Early returns
  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  // 6. Main render
  return (
    <div className="student-card" onClick={handleClick}>
      <h3>{student.name}</h3>
      <p>{student.email}</p>
    </div>
  );
};
```

### Component Ordering

1. **Imports**: External, then internal
2. **Types/Interfaces**: Props, local types
3. **Component declaration**
4. **State hooks**: `useState`
5. **Context hooks**: `useContext`
6. **Other hooks**: `useEffect`, custom hooks
7. **Event handlers**: Functions starting with `handle`
8. **Helper functions**: Other internal functions
9. **Early returns**: Loading, error states
10. **Main render**: JSX

### Props Best Practices

```typescript
// ✅ Good: Explicit interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// ❌ Bad: Any type, inline props
export const Button = (props: any) => {
  return <button {...props}>{props.children}</button>;
};
```

---

## 🎨 Tailwind CSS Standards

### Class Ordering

```tsx
// ✅ Good: Logical ordering
<div className="
  flex items-center justify-between
  w-full max-w-4xl
  p-6 m-4
  bg-white border border-gray-200 rounded-lg
  shadow-lg hover:shadow-xl
  transition-all duration-300
">
  Content
</div>

// ❌ Bad: Random ordering
<div className="
  shadow-lg rounded-lg m-4 flex bg-white
  hover:shadow-xl w-full p-6 border
  items-center justify-between border-gray-200
  max-w-4xl transition-all duration-300
">
  Content
</div>
```

**Recommended ordering:**
1. Layout: `flex`, `grid`, `block`
2. Positioning: `relative`, `absolute`, `fixed`
3. Display: `hidden`, `inline`, `block`
4. Sizing: `w-`, `h-`, `max-`, `min-`
5. Spacing: `p-`, `m-`, `space-`
6. Typography: `text-`, `font-`, `leading-`
7. Colors: `bg-`, `text-`, `border-`
8. Borders: `border`, `rounded`
9. Effects: `shadow`, `opacity`
10. Transitions: `transition`, `duration`
11. Interactions: `hover:`, `focus:`

### Component-Specific Styles

```tsx
// ✅ Good: Reusable styles with Tailwind
const cardStyles = "bg-white border border-gray-200 rounded-lg p-6 shadow-lg";
const buttonPrimary = "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700";

<div className={cardStyles}>
  <button className={buttonPrimary}>Click me</button>
</div>

// ✅ Also good: Using CSS modules for complex styles
import styles from './Card.module.css';

<div className={styles.card}>
  Content
</div>
```

---

## 📡 API & Service Standards

### API Service Structure

```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:1337/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Functions

```typescript
// ✅ Good: Specific functions with types
export async function getStudents(
  page: number = 1,
  pageSize: number = 25
): Promise<StudentData[]> {
  try {
    const response = await api.get('/students', {
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
}

export async function getStudentById(id: number): Promise<StudentData> {
  const response = await api.get(`/students/${id}`);
  return response.data.data;
}

export async function createStudent(
  data: CreateStudentDTO
): Promise<StudentData> {
  const response = await api.post('/students', { data });
  return response.data.data;
}

// ❌ Bad: Generic function, no types
export async function fetchData(endpoint: string, params?: any): Promise<any> {
  return api.get(endpoint, { params });
}
```

---

## 🔒 Error Handling

### Try-Catch Best Practices

```typescript
// ✅ Good: Specific error handling
async function loadStudentData(id: number) {
  try {
    setLoading(true);
    setError(null);
    
    const data = await getStudentById(id);
    setStudent(data);
  } catch (error) {
    console.error('Failed to load student:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        setError('Student not found');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load student data');
      }
    } else {
      setError('An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
}

// ❌ Bad: Silent failure
async function loadStudentData(id: number) {
  try {
    const data = await getStudentById(id);
    setStudent(data);
  } catch (error) {
    // Error ignored
  }
}
```

---

## 🧪 Testing Standards

### Component Testing

```typescript
// StudentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentCard } from './StudentCard';

describe('StudentCard', () => {
  it('renders student name', () => {
    render(<StudentCard name="John Doe" email="john@example.com" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(
      <StudentCard 
        name="John Doe" 
        email="john@example.com"
        onSelect={handleSelect}
      />
    );
    
    fireEvent.click(screen.getByText('John Doe'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📝 Comments & Documentation

### When to Comment

```typescript
// ✅ Good: Explain complex logic
// Calculate weighted risk score based on multiple factors
// Weight distribution: GPA (30%), Attendance (25%), Mental Health (45%)
const riskScore = (
  gpa * 0.3 +
  attendanceRate * 0.25 +
  mentalHealthScore * 0.45
);

// ✅ Good: Explain workaround
// FIXME: Temporary workaround for API bug
// Remove this once backend fixes the response format
const normalizedData = data.items || data;

// ❌ Bad: Stating the obvious
// Set the name variable to "John"
const name = "John";

// ❌ Bad: Commented-out code (delete instead)
// const oldFunction = () => {
//   return something;
// };
```

### JSDoc for Functions

```typescript
/**
 * Calculates the student's risk level based on multiple factors
 * 
 * @param gpa - Student's GPA (0-4.0)
 * @param attendanceRate - Attendance percentage (0-100)
 * @param mentalHealthScore - Mental health assessment score (0-100)
 * @returns Risk level: 'low', 'medium', or 'high'
 * 
 * @example
 * ```typescript
 * const risk = calculateRiskLevel(3.5, 85, 70);
 * console.log(risk); // 'medium'
 * ```
 */
export function calculateRiskLevel(
  gpa: number,
  attendanceRate: number,
  mentalHealthScore: number
): RiskLevel {
  // Implementation
}
```

---

## 🔧 Git Commit Standards

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# ✅ Good
git commit -m "feat(dashboard): add student risk assessment chart"
git commit -m "fix(api): handle 404 error in student endpoint"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(auth): simplify login logic"

# ❌ Bad
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

---

## 📦 Import Organization

```typescript
// ✅ Good: Organized imports
// 1. External libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal modules (absolute imports)
import { StudentData } from '@/types';
import { getStudents } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

// 3. Components
import { StudentCard } from '@/components/StudentCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// 4. Styles
import './Dashboard.css';

// ❌ Bad: Random ordering
import './Dashboard.css';
import { StudentCard } from '@/components/StudentCard';
import axios from 'axios';
import React from 'react';
import { getStudents } from '@/services/api';
```

---

## 🎯 Code Quality Checklist

Before committing code, check:

- [ ] No console.log statements in production code
- [ ] No commented-out code
- [ ] All TypeScript types defined (no `any`)
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Edge cases considered (empty arrays, null values)
- [ ] Responsive design tested
- [ ] Accessibility attributes added (aria-labels, alt text)
- [ ] No hardcoded values (use constants)
- [ ] Code formatted (Prettier)
- [ ] No ESLint warnings

---

## 🛠️ Tools & Extensions

**Recommended VS Code Extensions:**
- ESLint
- Prettier
- TypeScript Error Translator
- Auto Rename Tag
- Tailwind CSS IntelliSense
- Error Lens

**Linting & Formatting:**
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 📚 Related Documentation

- [Project Structure](./PROJECT_STRUCTURE.md)
- [Component Guide](./COMPONENTS.md)
- [Git Workflow](./GIT_WORKFLOW.md)
