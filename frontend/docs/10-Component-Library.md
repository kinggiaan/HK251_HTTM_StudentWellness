# Component Library & Design System

## 1. Design Philosophy: Glassmorphism

The application adopts a **Glassmorphism** design language to create a modern, clean, and professional interface suitable for a mental health platform.

**Key Characteristics:**
- **Translucency:** Elements look like frosted glass, allowing the background to blur through.
- **Hierarchy:** Depth is established using shadows, borders, and layering (z-index).
- **Vibrancy:** Subtle gradients and vivid accent colors (Blue, Indigo, Teal) against a neutral background.
- **Accessibility:** High contrast text and clear visual indicators ensure usability.

## 2. Color Palette

Defined in `tailwind.config.js`.

| Semantic Name | Color Code | Usage |
| :--- | :--- | :--- |
| **Primary** | `blue-600` (#2563EB) | Main actions, active states, branding. |
| **Secondary** | `slate-600` (#475569) | Secondary text, inactive icons. |
| **Success** | `emerald-500` (#10B981) | Positive status, low risk, completion. |
| **Warning** | `amber-500` (#F59E0B) | Medium risk, alerts, pending actions. |
| **Danger** | `rose-500` (#F43F5E) | High risk, delete actions, errors. |
| **Background** | `slate-50` (#F8FAFC) | App background. |
| **Surface** | `white/80` (backdrop-blur) | Cards, sidebars, modals. |

## 3. Core Components

These components are located in `src/components/common/`.

### 3.1 Button
A versatile button component with variants.

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Save Changes
</Button>
```
- **Variants:** `primary`, `secondary`, `outline`, `danger`, `ghost`.
- **Sizes:** `sm`, `md`, `lg`.

### 3.2 Card
The fundamental container for content. Applies the glassmorphism effect automatically.

```tsx
<Card className="p-6">
  <h3 className="text-lg font-bold">Card Title</h3>
  <p>Content goes here...</p>
</Card>
```

### 3.3 Input / Select
Form controls with consistent styling, focus states, and error handling.

```tsx
<Input 
  label="Email Address" 
  type="email" 
  placeholder="user@example.com" 
  error={errors.email} 
/>
```

### 3.4 Badge
Used for status indicators (e.g., Risk Level, Model Status).

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Training</Badge>
```

### 3.5 Modal
A dialog overlay for critical actions or forms.

```tsx
<Modal isOpen={isOpen} onClose={closeModal} title="Confirm Delete">
  <p>Are you sure?</p>
  <div className="flex justify-end gap-2 mt-4">
    <Button variant="ghost" onClick={closeModal}>Cancel</Button>
    <Button variant="danger" onClick={confirm}>Delete</Button>
  </div>
</Modal>
```

## 4. Typography

We use a standard sans-serif font stack (Inter/System UI) for readability.

- **Headings:** Bold, dark slate colors (`text-slate-900`).
- **Body:** Regular weight, slate gray (`text-slate-600`).
- **Small/Meta:** Smaller size, lighter gray (`text-slate-500`).

## 5. Icons

We use **Lucide React** for iconography. Icons should be used consistently to enhance visual scanning.

- **Navigation:** `LayoutDashboard`, `Users`, `FileText`, `Settings`.
- **Actions:** `Plus`, `Trash2`, `Edit`, `Download`.
- **Status:** `CheckCircle`, `AlertTriangle`, `XCircle`.

## 6. Responsive Design

All components are mobile-first.
- **Mobile:** Single column layouts, hidden sidebars (hamburger menu).
- **Tablet:** Grid layouts (2 columns).
- **Desktop:** Full dashboard view with persistent sidebar.

## 7. Usage Guidelines

1.  **Consistency:** Always use the `Card` component for grouping related content.
2.  **Spacing:** Use Tailwind's spacing scale (`p-4`, `m-6`, `gap-4`) to maintain rhythm.
3.  **Feedback:** Always provide visual feedback for interactions (hover states, loading spinners, toast notifications).
