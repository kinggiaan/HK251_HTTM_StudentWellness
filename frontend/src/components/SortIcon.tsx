import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortIconProps {
  direction: 'asc' | 'desc' | null;
  className?: string;
}

export function SortIcon({ direction, className = "w-4 h-4" }: SortIconProps) {
  if (direction === 'asc') {
    return <ArrowUp className={className} aria-hidden="true" />;
  }
  if (direction === 'desc') {
    return <ArrowDown className={className} aria-hidden="true" />;
  }
  return <ArrowUpDown className={`${className} text-gray-400`} aria-hidden="true" />;
}
