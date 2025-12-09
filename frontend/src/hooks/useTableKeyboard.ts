import { useEffect, useRef, useState, useCallback } from 'react';

interface UseTableKeyboardOptions {
  rowCount: number;
  columnCount: number;
  onRowSelect?: (rowIndex: number) => void;
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation in tables
 * Supports: Tab, Arrow keys, Enter/Space for row selection
 */
export function useTableKeyboard({
  rowCount,
  columnCount,
  onRowSelect,
  enabled = true
}: UseTableKeyboardOptions) {
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [focusedCol, setFocusedCol] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const focusCell = useCallback((row: number, col: number) => {
    const tbody = tableRef.current?.querySelector('tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    const targetRow = rows[row];
    if (!targetRow) return;

    const cells = targetRow.querySelectorAll('td');
    const targetCell = cells[col];
    if (targetCell) {
      (targetCell as HTMLElement).focus();
    }
  }, []);

  useEffect(() => {
    if (!enabled || !tableRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Only handle if focus is within the table
      if (!tableRef.current?.contains(target)) return;

      // Ignore if typing in input/textarea
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedRow(prev => {
            const next = prev === null ? 0 : Math.min(prev + 1, rowCount - 1);
            focusCell(next, focusedCol ?? 0);
            return next;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedRow(prev => {
            const next = prev === null ? rowCount - 1 : Math.max(prev - 1, 0);
            focusCell(next, focusedCol ?? 0);
            return next;
          });
          break;

        case 'ArrowRight':
          e.preventDefault();
          setFocusedCol(prev => {
            const next = prev === null ? 0 : Math.min(prev + 1, columnCount - 1);
            focusCell(focusedRow ?? 0, next);
            return next;
          });
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setFocusedCol(prev => {
            const next = prev === null ? columnCount - 1 : Math.max(prev - 1, 0);
            focusCell(focusedRow ?? 0, next);
            return next;
          });
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedRow !== null && onRowSelect) {
            onRowSelect(focusedRow);
          }
          break;

        case 'Home':
          e.preventDefault();
          setFocusedRow(0);
          setFocusedCol(0);
          focusCell(0, 0);
          break;

        case 'End':
          e.preventDefault();
          setFocusedRow(rowCount - 1);
          setFocusedCol(columnCount - 1);
          focusCell(rowCount - 1, columnCount - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, rowCount, columnCount, focusedRow, focusedCol, onRowSelect, focusCell]);

  return {
    tableRef,
    focusedRow,
    focusedCol,
    setFocusedRow,
    setFocusedCol
  };
}
