import { useState, useEffect, useMemo } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  visible: boolean;
  priority: number; // Lower number = higher priority (shown by default)
  sortable?: boolean;
}

const DEFAULT_COLUMNS: TableColumn[] = [
  { key: 'studentName', label: 'Student Name', visible: true, priority: 1, sortable: true },
  { key: 'age', label: 'Age', visible: true, priority: 2, sortable: true },
  { key: 'course', label: 'Course', visible: true, priority: 3, sortable: true },
  { key: 'stressLevel', label: 'Stress Level', visible: true, priority: 4, sortable: true },
  { key: 'moodRating', label: 'Mood Rating', visible: true, priority: 5, sortable: true },
  { key: 'riskLevel', label: 'Risk Level', visible: true, priority: 6, sortable: true },
  { key: 'sleepHours', label: 'Sleep Hours', visible: true, priority: 7, sortable: true },
  { key: 'counselingSessions', label: 'Counseling Sessions', visible: true, priority: 8, sortable: true },
  { key: 'depressionScore', label: 'Depression Score', visible: false, priority: 9 },
  { key: 'anxietyScore', label: 'Anxiety Score', visible: false, priority: 10 },
  { key: 'sleepQuality', label: 'Sleep Quality', visible: false, priority: 11 },
  { key: 'physicalActivity', label: 'Physical Activity', visible: false, priority: 12 },
  { key: 'dietQuality', label: 'Diet Quality', visible: false, priority: 13 },
  { key: 'socialSupport', label: 'Social Support', visible: false, priority: 14 },
  { key: 'substanceUse', label: 'Substance Use', visible: false, priority: 15 },
  { key: 'familyHistory', label: 'Family History', visible: false, priority: 16 },
  { key: 'chronicIllness', label: 'Chronic Illness', visible: false, priority: 17 },
  { key: 'financialStress', label: 'Financial Stress', visible: false, priority: 18 },
  { key: 'semesterCreditLoad', label: 'Credit Load', visible: false, priority: 19 },
  { key: 'lastCheckIn', label: 'Last Check-In', visible: false, priority: 20 },
  { key: 'notes', label: 'Notes', visible: false, priority: 21 },
];

const STORAGE_KEY = 'dashboard:table-columns';

export function useTableColumns(initialColumns?: TableColumn[]) {
  const [columns, setColumns] = useState<TableColumn[]>(() => {
    // Try to load from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to load columns from localStorage:', error);
      }
    }

    // Use provided or default
    return initialColumns || DEFAULT_COLUMNS;
  });

  // Save to localStorage whenever columns change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to save columns to localStorage:', error);
      }
    }
  }, [columns]);

  const visibleColumns = useMemo(() => {
    return columns.filter(col => col.visible).sort((a, b) => a.priority - b.priority);
  }, [columns]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const resetColumns = () => {
    setColumns(initialColumns || DEFAULT_COLUMNS);
  };

  const showAllColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const hideAllColumns = () => {
    setColumns(prev => {
      // Prevent hiding all columns: keep at least one visible
      const visibleCount = prev.filter(col => col.visible).length;
      if (visibleCount <= 1 || prev.length === 0) {
        // Do nothing if only one or zero columns are visible, or array is empty
        return prev;
      }
      // Hide all columns except the first visible one
      let firstVisibleIdx = prev.findIndex(col => col.visible);
      if (firstVisibleIdx === -1) firstVisibleIdx = 0;
      return prev.map((col, idx) =>
        idx === firstVisibleIdx ? { ...col, visible: true } : { ...col, visible: false }
      );
    });
  };

  return {
    columns,
    visibleColumns,
    toggleColumn,
    resetColumns,
    showAllColumns,
    hideAllColumns,
    setColumns
  };
}
