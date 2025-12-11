/**
 * Development utilities for easier debugging and testing
 */

/**
 * Force logout và quay về trang login
 * Hữu ích khi bạn muốn test trang login hoặc khi gặp lỗi và muốn reset
 */
export function forceLogout() {
  sessionStorage.setItem('forceLogout', 'true');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  window.location.reload();
}

/**
 * Clear tất cả dữ liệu và quay về trang login
 * Hữu ích khi gặp lỗi cache hoặc state bị lỗi
 */
export function clearAllAndLogout() {
  localStorage.clear();
  sessionStorage.clear();
  sessionStorage.setItem('forceLogout', 'true');
  window.location.reload();
}

/**
 * Expose utilities to window object in development mode
 */
if (import.meta.env.DEV) {
  (window as any).devUtils = {
    forceLogout,
    clearAllAndLogout,
    help: () => {
      console.log(`
🔧 Development Utilities
========================
- devUtils.forceLogout()       : Force logout và quay về trang login
- devUtils.clearAllAndLogout() : Clear tất cả storage và quay về login
- devUtils.help()              : Hiển thị hướng dẫn này

Ví dụ: Nếu bạn muốn test trang login, gõ: devUtils.forceLogout()
      `);
    }
  };
  
  console.log('🔧 Dev utilities loaded. Type "devUtils.help()" for more info.');
}
