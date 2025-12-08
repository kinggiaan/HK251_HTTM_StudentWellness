# Frontend Architecture

## 1. Overview

The frontend of the Student Mental Health Dashboard is built using a modern, component-based architecture designed for performance, maintainability, and scalability. It leverages the React ecosystem to provide a responsive and interactive user experience.

**Tech Stack:**
- **Framework:** React 18
- **Build Tool:** Vite (for fast development and optimized builds)
- **Language:** TypeScript (for type safety and developer experience)
- **Styling:** Tailwind CSS (utility-first CSS) + Custom Glassmorphism Design System
- **Routing:** React Router v6
- **State Management:** React Context API + Hooks
- **HTTP Client:** Axios (via a centralized `apiClient` wrapper)
- **Icons:** Lucide React

## 2. Directory Structure

The `src` directory is organized by feature and technical role:

```
src/
├── assets/             # Static assets (images, fonts, global styles)
├── components/         # Reusable UI components
│   ├── common/         # Generic components (Button, Card, Input, Modal)
│   ├── layout/         # Layout components (Sidebar, Header, DashboardLayout)
│   ├── dashboard/      # Dashboard-specific widgets and views
│   └── ...
├── contexts/           # React Context definitions (AuthContext, ThemeContext)
├── data/               # Mock data and static constants
├── hooks/              # Custom React Hooks (useAuth, useForm, etc.)
├── lib/                # Library configurations (axios setup, utils)
├── pages/              # Top-level page components (mapped to routes)
├── services/           # API integration modules
│   ├── auth.service.ts
│   ├── mentalHealth.service.ts
│   ├── mlModels.ts
│   └── ...
├── types/              # TypeScript type definitions (interfaces, types)
├── utils/              # Helper functions and formatters
├── App.tsx             # Root component with Routing setup
└── main.tsx            # Entry point
```

## 3. Key Architectural Patterns

### 3.1 Component Design
We follow the **Atomic Design** philosophy loosely:
- **Atoms:** Basic building blocks like `Button`, `Input`, `Badge`.
- **Molecules:** Combinations of atoms like `SearchInput` (Input + Icon), `UserCard`.
- **Organisms:** Complex sections like `Sidebar`, `TopBar`, `StudentList`.
- **Templates/Pages:** Full page layouts combining organisms.

Components are functional and use Hooks for logic. Props are typed using TypeScript interfaces.

### 3.2 Styling System (Glassmorphism)
The application uses a custom Glassmorphism design system implemented via Tailwind CSS.
- **Backgrounds:** Translucent backgrounds with blur effects (`backdrop-blur`).
- **Borders:** Subtle white/transparent borders to create depth.
- **Shadows:** Soft, multi-layered shadows.
- **Colors:** A semantic color palette defined in `tailwind.config.js` (Primary, Secondary, Success, Warning, Danger).

Example usage:
```tsx
<div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6">
  {/* Content */}
</div>
```

### 3.3 State Management
- **Global State:** Handled via React Context.
  - `AuthContext`: Manages user authentication state (user, token, login/logout).
  - `ToastContext` (if applicable): Manages global notifications.
- **Local State:** Managed within components using `useState` and `useReducer`.
- **Server State:** Data fetching is encapsulated in `services/` and often managed with `useEffect` or custom hooks in the consuming components.

### 3.4 API Integration
All API calls are routed through a centralized `apiClient` instance (in `src/lib/api.ts`).
- **Interceptors:** Automatically attach JWT tokens to requests and handle 401/403 errors globally.
- **Services:** Each domain (Auth, Students, ML) has a dedicated service file in `src/services/` that exports typed functions for API endpoints.

### 3.5 Routing & Role-Based Access Control (RBAC)
- **Public Routes:** Login, Register, Landing Page.
- **Protected Routes:** Wrapped in a `ProtectedRoute` component that checks for a valid token.
- **Role-Based Routes:** Routes can restrict access based on user roles (`consultant`, `teacher`, `data_scientist`, `admin`). If a user lacks permission, they are redirected to an unauthorized page or their dashboard.

## 4. Development Workflow

1.  **Create Component:** Add new UI elements in `src/components`.
2.  **Define Types:** Add interfaces in `src/types` or co-locate with the component/service.
3.  **Implement Service:** Add API methods in `src/services`.
4.  **Assemble Page:** Compose components in `src/pages`.
5.  **Add Route:** Register the new page in `App.tsx`.

## 5. Performance Optimization
- **Code Splitting:** Lazy loading of page components using `React.lazy` and `Suspense`.
- **Memoization:** Use `useMemo` and `useCallback` for expensive calculations and to prevent unnecessary re-renders.
- **Asset Optimization:** SVGs are used for icons; images are optimized by Vite.
