# Frontend Testing Strategy

## 1. Overview

This document outlines the testing strategy for the frontend application, ensuring reliability for both standard UI components and AI-integrated features.

## 2. Testing Levels

### 2.1 Unit Testing
*   **Tools:** Vitest, React Testing Library.
*   **Scope:** Individual components, utility functions, and hooks.
*   **Focus:**
    *   Rendering correctness.
    *   User interaction handling (clicks, inputs).
    *   State updates.
    *   **AI Components:** Mocking the `riskScore` props to ensure correct color coding (Red/Yellow/Green) is applied.

### 2.2 Integration Testing
*   **Tools:** Vitest.
*   **Scope:** Interaction between parent/child components and Context providers.
*   **Focus:**
    *   **Auth Flow:** Login -> Token Storage -> Protected Route Access.
    *   **Data Fetching:** Mocking API responses from `src/services` to test how components handle Loading, Success, and Error states.

### 2.3 End-to-End (E2E) Testing
*   **Tools:** Playwright (recommended) or Cypress.
*   **Scope:** Full user workflows.
*   **Key Scenarios:**
    1.  **Login:** User logs in and is redirected to the correct dashboard based on role.
    2.  **Model Training (Data Scientist):** Upload dataset -> Create Model -> Click Train -> Verify Status Change.
    3.  **Risk Assessment (Consultant):** Open Student List -> Verify Risk Badges appear.

## 3. Mocking AI Data

Since AI predictions are probabilistic and backend-dependent, we use **Mock Data** for frontend testing to ensure deterministic results.

### 3.1 Mock Objects
Located in `src/data/mocks.ts` (or similar).

```typescript
export const mockMLModel = {
  id: 'model-123',
  name: 'Test Model A',
  status: 'trained',
  accuracy: 0.95,
  createdAt: '2023-10-01T10:00:00Z'
};

export const mockPrediction = {
  studentId: 'std-001',
  riskScore: 85, // High Risk
  riskLevel: 'critical',
  factors: ['sleep', 'anxiety']
};
```

### 3.2 Service Mocking
When testing components that call `mlModels.listModels()`, we intercept the call and return `[mockMLModel]`.

## 4. Accessibility Testing (A11y)

*   **Tools:** `axe-core`, ESLint plugin `jsx-a11y`.
*   **Requirement:** All AI visualizations (charts, risk badges) must have text alternatives (ARIA labels) for screen readers.
    *   *Bad:* `<div class="bg-red-500"></div>`
    *   *Good:* `<div class="bg-red-500" role="status" aria-label="Critical Risk"></div>`

## 5. Continuous Integration (CI)

Tests should run automatically on every Pull Request.
*   **Lint:** `npm run lint`
*   **Unit/Integration:** `npm run test`
*   **Build:** `npm run build` (ensures no type errors)
