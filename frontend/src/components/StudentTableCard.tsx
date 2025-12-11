import React from 'react';
import { MentalHealthRecord } from '../data/mockMentalHealth';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StudentTableCardProps {
  record: MentalHealthRecord;
  onSelect?: (record: MentalHealthRecord) => void;
}

export function StudentTableCard({ record, onSelect }: StudentTableCardProps) {
  const getRiskLevelIcon = (level: string) => {
    if (level === 'high') {
      return <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />;
    }
    if (level === 'moderate') {
      return <AlertTriangle className="w-4 h-4 text-orange-600" aria-hidden="true" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-green-600" aria-hidden="true" />;
  };

  const getRiskLevelColor = (level: string) => {
    if (level === 'high') return 'text-red-700 bg-red-50 border-red-200';
    if (level === 'moderate') return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 1) return 'bg-[#cbe6f0]';
    if (level === 2) return 'bg-[#cbe6f0]';
    if (level === 3) return 'bg-[#f4bd50]';
    if (level === 4) return 'bg-[#ffaa9f]';
    return 'bg-[#ed6a5e]';
  };

  return (
    <div
      onClick={() => onSelect?.(record)}
      className="bg-white border border-[#ced8e5] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      tabIndex={0}
      role="button"
      aria-label={`View details for ${record.studentName}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(record);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] text-base mb-1">
            {record.studentName}
          </h3>
          <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] text-sm">
            {record.course} • Age {record.age}
          </p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getRiskLevelColor(record.riskLevel)}`}>
          {getRiskLevelIcon(record.riskLevel)}
          <span className="font-['Poppins:SemiBold',sans-serif] text-xs capitalize">
            {record.riskLevel}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#f4f6f7] rounded p-2">
          <p className="text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">Stress Level</p>
          <span className={`${getStressLevelColor(record.stressLevel)} px-2 py-1 rounded font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-xs inline-block`}>
            {record.stressLevel}/5
          </span>
        </div>
        <div className="bg-[#f4f6f7] rounded p-2">
          <p className="text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">Mood Rating</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-sm">{record.moodRating}/5</p>
        </div>
        <div className="bg-[#f4f6f7] rounded p-2">
          <p className="text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">Sleep Hours</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-sm">{record.sleepHours}h</p>
        </div>
        <div className="bg-[#f4f6f7] rounded p-2">
          <p className="text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">Sessions</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[#0c1e33] text-sm">{record.counselingSessions}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="pt-3 border-t border-[#ced8e5]">
        <p className="text-xs font-['Poppins:Regular',sans-serif] text-[#495d72] line-clamp-2">
          {record.notes || 'No additional notes'}
        </p>
      </div>
    </div>
  );
}
