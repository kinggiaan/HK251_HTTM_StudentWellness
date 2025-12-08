# Frontend-Backend Integration Patterns

## 1. Overview

This document details the patterns and practices used for communication between the React Frontend and the Node.js Backend.

## 2. API Client (`src/lib/api.ts`)

We use a custom `ApiClient` class (wrapping `fetch`) to handle all HTTP requests. This ensures consistent configuration, error handling, and authentication.

### 2.1 Configuration
*   **Base URL:** Loaded from `VITE_API_BASE_URL` (default: `http://localhost:4000/api`).
*   **Headers:** Automatically sets `Content-Type: application/json` (unless sending FormData).

### 2.2 Authentication Injection
The client automatically attaches the JWT Access Token to the `Authorization` header of every request if a token exists in `localStorage`.

```typescript
// Internal logic in ApiClient
if (this.accessToken) {
  headers['Authorization'] = `Bearer ${this.accessToken}`;
}
```

### 2.3 Response Normalization
The backend is expected to return responses in a standard format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```
The `ApiClient` unwraps this response and returns `data` directly to the caller, or throws an error if `success` is false.

## 3. Authentication Flow

### 3.1 Login
1.  **User** submits credentials via `LoginForm`.
2.  **Service** calls `authService.login()`.
3.  **Backend** validates and returns `{ user, token: { accessToken, refreshToken } }`.
4.  **Frontend** stores `accessToken` in `localStorage` and updates `AuthContext`.
5.  **ApiClient** is updated with the new token.

### 3.2 Token Refresh (Silent)
*   *Current Implementation:* The frontend stores the `refreshToken`.
*   *Strategy:* When a 401 error occurs, the `ApiClient` should intercept the error, call `/auth/refresh` with the refresh token, update the access token, and retry the original request. (Note: Check `src/lib/api.ts` for exact implementation details).

### 3.3 Logout
1.  **User** clicks Logout.
2.  **Service** calls `/auth/logout` to invalidate the refresh token on the server.
3.  **Frontend** clears `localStorage` and resets `AuthContext`.

## 4. Data Fetching Patterns

### 4.1 Service Layer
All API calls are encapsulated in `src/services/`. Components **never** call `fetch` or `apiClient` directly.

*   **Good:** `await studentsService.getAll()`
*   **Bad:** `await apiClient.get('/students')`

### 4.2 Loading & Error States
Components typically use a standard pattern:

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await service.getData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

## 5. File Uploads

For uploading datasets (Data Scientist feature), we use `FormData`.

```typescript
// src/services/datasets.ts
upload(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  // ApiClient detects FormData and skips setting Content-Type to application/json
  // allowing the browser to set the correct boundary.
  return apiClient.post('/ml/datasets/upload', formData);
}
```

## 6. Error Handling

### 6.1 API Errors
The backend returns errors in this format:
```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```
The `ApiClient` throws an `ApiError` object containing these details, which can be caught by the UI to display Toast notifications.

### 6.2 Network Errors
If the backend is unreachable, `ApiClient` throws a generic "Network Error". The UI should handle this gracefully (e.g., "Server is offline, please try again later").
