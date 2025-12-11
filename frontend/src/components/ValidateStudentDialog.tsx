import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { studentsService, type Student } from '../services/students.service';
import { toast } from 'sonner';

interface ValidateStudentDialogProps {
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}

export function ValidateStudentDialog({ student, onClose, onSuccess }: ValidateStudentDialogProps) {
  const [validated, setValidated] = useState(student.validated || false);
  const [depressionTruth, setDepressionTruth] = useState<number>(student.depression_truth ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidate = async () => {
    if (!student.documentId) {
      toast.error('Student document ID not found');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update validated status
      await studentsService.validateStudent(student.documentId, validated);
      
      // Update depression truth
      await studentsService.updateDepressionStatus(
        student.documentId,
        depressionTruth,
        student.depression_predicting
      );

      toast.success('Student validation updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to update student validation:', error);
      toast.error(error.message || 'Failed to update validation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-['Poppins:SemiBold',sans-serif] text-[#0c1e33]">
              Validate Student
            </h2>
            <p className="text-sm font-['Poppins:Regular',sans-serif] text-[#495d72] mt-1">
              {student.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-['Poppins:Medium',sans-serif] text-[#495d72]">
                ML Prediction:
              </span>
              <span className={`font-['Poppins:SemiBold',sans-serif] ${
                student.depression_predicting === 1 ? 'text-red-600' : 'text-green-600'
              }`}>
                {student.depression_predicting === 1 ? 'Depression Risk' : 'No Risk'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-['Poppins:Medium',sans-serif] text-[#495d72]">
                Current Status:
              </span>
              <span className={`font-['Poppins:SemiBold',sans-serif] ${
                student.validated ? 'text-green-600' : 'text-gray-600'
              }`}>
                {student.validated ? 'Validated' : 'Not Validated'}
              </span>
            </div>
          </div>

          {/* Validation Checkbox */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <input
                type="checkbox"
                checked={validated}
                onChange={(e) => setValidated(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-sm">
                  Mark as Validated
                </span>
                <p className="text-xs font-['Poppins:Regular',sans-serif] text-[#495d72] mt-1">
                  Confirm that this student's assessment has been reviewed
                </p>
              </div>
              {validated && <Check className="w-5 h-5 text-green-600" />}
            </label>
          </div>

          {/* Depression Truth Selection */}
          <div className="space-y-3">
            <label className="block font-['Poppins:Medium',sans-serif] text-[#0c1e33] text-sm">
              Consultant Assessment
            </label>
            <p className="text-xs font-['Poppins:Regular',sans-serif] text-[#495d72] -mt-2">
              Based on your professional evaluation, confirm the depression status
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDepressionTruth(0)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  depressionTruth === 0
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Check className={`w-6 h-6 ${depressionTruth === 0 ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`font-['Poppins:SemiBold',sans-serif] text-sm ${
                    depressionTruth === 0 ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    No Depression
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDepressionTruth(1)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  depressionTruth === 1
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className={`w-6 h-6 ${depressionTruth === 1 ? 'text-red-600' : 'text-gray-400'}`} />
                  <span className={`font-['Poppins:SemiBold',sans-serif] text-sm ${
                    depressionTruth === 1 ? 'text-red-700' : 'text-gray-600'
                  }`}>
                    Has Depression
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Warning if prediction differs */}
          {student.depression_predicting !== undefined && depressionTruth !== student.depression_predicting && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-['Poppins:Regular',sans-serif] text-amber-800">
                <strong>Note:</strong> Your assessment differs from the ML prediction. This will be recorded for model improvement.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 font-['Poppins:Medium',sans-serif] text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleValidate}
            disabled={isSubmitting}
            className="px-4 py-2 font-['Poppins:SemiBold',sans-serif] text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Validation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
