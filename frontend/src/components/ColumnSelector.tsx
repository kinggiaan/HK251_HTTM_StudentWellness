import React, { useState } from 'react';
import { Settings2, X, Check } from 'lucide-react';
import { TableColumn } from '../hooks/useTableColumns';

interface ColumnSelectorProps {
  columns: TableColumn[];
  onToggle: (key: string) => void;
  onReset: () => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export function ColumnSelector({
  columns,
  onToggle,
  onReset,
  onShowAll,
  onHideAll
}: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const visibleCount = columns.filter(c => c.visible).length;
  const totalCount = columns.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Column selector: ${visibleCount} of ${totalCount} columns visible`}
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-2 text-sm font-['Poppins:Medium',sans-serif] text-[#495d72] bg-[#f5f6f8] hover:bg-[#e9ebef] rounded-[4px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Settings2 className="w-4 h-4" aria-hidden="true" />
        <span>Columns ({visibleCount}/{totalCount})</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-[280px] bg-white border border-[#ced8e5] rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
            <div className="p-4 border-b border-[#ced8e5] sticky top-0 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-sm">
                  Select Columns
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close column selector"
                  className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  <X className="w-4 h-4 text-[#495d72]" aria-hidden="true" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={onShowAll}
                  className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Show All
                </button>
                <button
                  onClick={onHideAll}
                  className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  Hide All
                </button>
                <button
                  onClick={onReset}
                  className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="p-2">
              {columns.map((column) => (
                <label
                  key={column.key}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => onToggle(column.key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    aria-label={`Toggle ${column.label} column`}
                  />
                  <span className="flex-1 text-sm font-['Poppins:Regular',sans-serif] text-[#0c1e33]">
                    {column.label}
                  </span>
                  {column.visible && (
                    <Check className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  )}
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
