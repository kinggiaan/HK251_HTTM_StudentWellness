# Common Errors & Fixes - Dashboard Development

**Mục đích:** Tài liệu này ghi lại các lỗi thường gặp và cách sửa để tránh lặp lại trong tương lai.

**Cập nhật lần cuối:** 2025-01-XX

**Note:** Sidebar đã được đồng bộ giữa tất cả dashboards - Xem section "Sidebar Synchronization" bên dưới.

---

## 🔴 Critical Errors

### 1. ReferenceError: Variable Used Before Declaration

**Lỗi:**
```
Uncaught ReferenceError: Cannot access 'filteredRecords' before initialization
```

**Nguyên nhân:**
- Biến được sử dụng trong hook (như `useTableSort(filteredRecords)`) trước khi được định nghĩa
- Hoặc biến được sử dụng trong component con nhưng không được pass như prop

**Ví dụ lỗi:**
```tsx
// ❌ SAI - filteredRecords chưa được định nghĩa
const { sortedData } = useTableSort(filteredRecords);

// ... code khác ...

const filteredRecords = useMemo(() => {
  return data.filter(...);
}, [data]);
```

**Cách sửa:**
```tsx
// ✅ ĐÚNG - Định nghĩa trước khi sử dụng
const filteredRecords = useMemo(() => {
  return data.filter(...);
}, [data]);

const { sortedData } = useTableSort(filteredRecords);
```

**Files đã gặp:**
- `ConsultantDashboard.tsx` (dòng 169-170)
- `TeacherSupervisorDashboard.tsx` (dòng 171-172)
- `DataScientistDashboard.tsx` - `AnalyticsDashboard` component (dòng 414)

**Cách tránh:**
1. Luôn định nghĩa biến trước khi sử dụng trong hooks
2. Nếu component con cần data từ component cha, pass như prop
3. Sử dụng TypeScript để catch lỗi này sớm

---

### 2. Component Props Missing - Undefined Variable in Child Component

**Lỗi:**
```
Uncaught ReferenceError: latestTrained is not defined
at AnalyticsDashboard (DataScientistDashboard.tsx:414:18)
```

**Nguyên nhân:**
- Component con (`AnalyticsDashboard`) sử dụng biến từ component cha (`DataScientistDashboard`) nhưng không nhận như prop
- Biến được định nghĩa trong component cha nhưng component con không có access

**Ví dụ lỗi:**
```tsx
// ❌ SAI - Component con không có access đến latestTrained
function AnalyticsDashboard() {
  return <div>{latestTrained?.accuracy}</div>; // latestTrained is not defined
}

export function DataScientistDashboard() {
  const latestTrained = useMemo(...);
  return <AnalyticsDashboard />; // Không pass prop
}
```

**Cách sửa:**
```tsx
// ✅ ĐÚNG - Pass như prop
interface AnalyticsDashboardProps {
  latestTrained?: MLModel | null;
}

function AnalyticsDashboard({ latestTrained }: AnalyticsDashboardProps) {
  return <div>{latestTrained?.accuracy}</div>;
}

export function DataScientistDashboard() {
  const latestTrained = useMemo(...);
  return <AnalyticsDashboard latestTrained={latestTrained} />;
}
```

**Files đã gặp:**
- `DataScientistDashboard.tsx` - `AnalyticsDashboard` component

**Cách tránh:**
1. Luôn định nghĩa interface cho props của component
2. Sử dụng TypeScript để catch missing props
3. Nếu component con cần data, pass như prop thay vì rely on closure

---

## ⚠️ Syntax Errors

### 3. Template String Quote Conflict

**Lỗi:**
```
Expected '</', got 'Poppins'
```

**Nguyên nhân:**
- Dấu nháy đơn trong Tailwind class name gây xung đột với template string dùng dấu nháy đơn

**Ví dụ lỗi:**
```tsx
// ❌ SAI - Quote conflict
className={`... ${
  col.key === 'studentName'
    ? 'font-['Poppins:Medium',sans-serif] ...'  // Lỗi ở đây
    : '...'
}`}
```

**Cách sửa:**
```tsx
// ✅ ĐÚNG - Dùng dấu nháy kép bên ngoài
className={`... ${
  col.key === 'studentName'
    ? "font-['Poppins:Medium',sans-serif] ..."  // Dấu nháy kép bên ngoài
    : '...'
}`}
```

**Files đã gặp:**
- `ConsultantDashboard.tsx` (dòng 479)
- `TeacherSupervisorDashboard.tsx` (dòng 542)

**Cách tránh:**
1. Luôn dùng dấu nháy kép (`"`) cho template strings chứa Tailwind classes với dấu nháy đơn
2. Hoặc escape dấu nháy đơn: `'font-[\'Poppins:Medium\',sans-serif]'`
3. Prefer dấu nháy kép cho template strings

---

## 🌐 Network & API Errors

### 4. Unhandled API Errors Causing UI Crashes

**Lỗi:**
```
Failed to load resource: the server responded with a status of 404 (Not Found)
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

**Nguyên nhân:**
- API calls fail nhưng không có error handling
- Toast errors hiển thị cho cả expected errors (404/500 khi backend chưa ready)
- Component crash khi data undefined

**Ví dụ lỗi:**
```tsx
// ❌ SAI - Không handle errors, show toast cho mọi error
async function reloadModels() {
  const res = await listModels(...);
  setModels(res.items ?? []);
  // Nếu API fail → crash
}
```

**Cách sửa:**
```tsx
// ✅ ĐÚNG - Handle errors gracefully
async function reloadModels() {
  try {
    setIsLoadingModels(true);
    const res = await listModels(...);
    setModels(res.items ?? []);
  } catch (e: any) {
    // Chỉ show toast cho unexpected errors
    const status = e?.response?.status;
    if (status && status !== 404 && status !== 500) {
      toast.error(e?.message ?? "Failed to load models");
    }
    // Set fallback để component vẫn hoạt động
    setModels([]);
  } finally {
    setIsLoadingModels(false);
  }
}
```

**Files đã gặp:**
- `DataScientistDashboard.tsx` - `reloadModels()`, `handleRetrain()`

**Cách tránh:**
1. Luôn wrap API calls trong try-catch
2. Set fallback values (empty arrays, null) khi error
3. Chỉ show toast cho unexpected errors (không phải 404/500 khi backend chưa ready)
4. Sử dụng optional chaining (`?.`) khi access nested properties

---

## 🎨 UI/UX Errors

### 5. Emoji Icons Instead of SVG Icons

**Lỗi:**
- Sử dụng emoji (📊, ✅, 🧪, 📅) như UI icons thay vì SVG icons

**Nguyên nhân:**
- Không tuân theo UI-UX-Pro-Max guidelines
- Emoji không professional và không consistent

**Ví dụ lỗi:**
```tsx
// ❌ SAI - Dùng emoji
<span className="text-3xl">📊</span>
<span className="text-3xl">✅</span>
```

**Cách sửa:**
```tsx
// ✅ ĐÚNG - Dùng Lucide icons
import { BarChart3, CheckCircle2, FlaskConical, Calendar } from "lucide-react";

<BarChart3 className="w-8 h-8 text-blue-600" aria-hidden="true" />
<CheckCircle2 className="w-8 h-8 text-green-600" aria-hidden="true" />
```

**Files đã gặp:**
- `DatasetManagementSection.tsx` - Multiple emojis
- `DataScientistDashboard.tsx` - Emoji icons (đã fix)

**Cách tránh:**
1. Luôn dùng SVG icons từ Lucide React hoặc Heroicons
2. Thêm `aria-hidden="true"` cho decorative icons
3. Check UI-UX-Pro-Max guidelines trước khi commit

---

## 📋 Checklist Trước Khi Commit

### Code Quality
- [ ] Không có biến undefined (check với TypeScript)
- [ ] Tất cả props được định nghĩa trong interface
- [ ] Template strings không có quote conflicts
- [ ] API calls có error handling với fallback values

### UI/UX
- [ ] Không có emoji icons (dùng Lucide/Heroicons)
- [ ] Icons có `aria-hidden="true"` nếu decorative
- [ ] Hover states không gây layout shift
- [ ] Focus states visible cho keyboard navigation

### Network
- [ ] API errors được handle gracefully
- [ ] Fallback values được set khi error
- [ ] Toast chỉ hiển thị cho unexpected errors
- [ ] Component vẫn hoạt động khi API fails

### TypeScript
- [ ] Không có `any` types (trừ error handling)
- [ ] Props interfaces được định nghĩa
- [ ] Optional chaining (`?.`) cho nested access
- [ ] Null checks cho potentially undefined values

---

## 🔍 Debugging Tips

### Khi gặp "Variable is not defined":
1. Check xem biến có được định nghĩa trước khi sử dụng không
2. Check xem component con có cần prop từ component cha không
3. Check scope của biến (component level vs function level)

### Khi gặp Template String errors:
1. Check quote types (single vs double)
2. Escape special characters nếu cần
3. Prefer double quotes cho template strings

### Khi gặp API errors:
1. Check network tab để xem status code
2. Handle 404/500 gracefully (expected khi backend chưa ready)
3. Set fallback values để component không crash
4. Chỉ show toast cho unexpected errors

---

## 📚 Related Documents

- `DASHBOARD_IMPROVEMENT_PLAN.md` - Full improvement plan
- `UI_UX_PROJECT_STATUS.md` - Project status
- `.github/prompts/ui-ux-pro-max.prompt.md` - UI-UX guidelines

---

## 🎨 Sidebar Synchronization

### Design System - Unified Sidebar Style

**Reference:** DataScientistDashboard sidebar (được chọn làm chuẩn)

**Key Design Elements:**
- **Background:** Gradient `linear-gradient(180deg, #0a1628 0%, #0c1e33 50%, #142c47 100%)`
- **Width:** `200px` (consistent across all dashboards)
- **Active State:** Purple highlight `bg-purple-500/20` với `border-l-2 border-purple-400`
- **Hover State:** `hover:bg-white/5` cho inactive items
- **Layout:** Flexbox với `flex flex-col` (modern, không dùng absolute positioning)
- **Borders:** `border-white/20` cho separators
- **Icons:** White SVG icons, consistent sizing
- **Typography:** `font-['Poppins:Medium',sans-serif] text-xs text-white`

**Implementation Pattern:**
```tsx
function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <div 
      className="fixed top-0 left-0 h-screen w-[200px] z-50 flex flex-col overflow-y-auto shadow-xl"
      style={{ 
        background: 'linear-gradient(180deg, #0a1628 0%, #0c1e33 50%, #142c47 100%)',
        zIndex: 50
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-white/20">
        {/* Logo icon + title */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <button className={`
          w-full flex items-center gap-2 px-3 py-2 rounded text-white text-xs 
          font-['Poppins:Medium',sans-serif] transition-all
          ${isActive 
            ? "bg-purple-500/20 font-semibold border-l-2 border-purple-400" 
            : "hover:bg-white/5"
          }
        `}>
          {/* Icon + Text */}
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="px-2 pb-4 space-y-1 border-t border-white/20 pt-4">
        {/* Logout, Help buttons */}
      </div>
    </div>
  );
}
```

**Files Updated:**
- ✅ `ConsultantDashboard.tsx` - Sidebar refactored
- ✅ `TeacherSupervisorDashboard.tsx` - Sidebar refactored
- ✅ `DataScientistDashboard.tsx` - Reference implementation

**Content Margin:**
- Updated from `ml-[275.351px]` to `ml-[200px]` to match new sidebar width

**Benefits:**
- Consistent visual design across all dashboards
- Modern flexbox layout (easier to maintain)
- Better accessibility (proper button elements)
- Purple active state provides clear visual feedback
- Gradient background adds depth and professionalism

---

**Note:** Tài liệu này sẽ được cập nhật khi phát hiện thêm lỗi mới.
