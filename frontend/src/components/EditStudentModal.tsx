import React, { useState } from 'react';
import { X, Save, User, GraduationCap, Heart, Users as UsersIcon } from 'lucide-react';
import { apiClient } from '../lib/api';
import type { Student } from '../services/students.service';
import { toast } from 'sonner';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditStudentModal({ student, onClose, onSuccess }: EditStudentModalProps) {
  const [formData, setFormData] = useState({
    name: student.name || '',
    age: student.age || '',
    gender: student.gender || '',
    city: student.city || '',
    cgpa: student.cgpa || '',
    degree: student.degree || '',
    academic_pressure: student.academic_pressure || '',
    study_satisfaction: student.study_satisfaction || '',
    work_study_hours: student.work_study_hours || '',
    sleep_duration: student.sleep_duration || '',
    dietary_habits: student.dietary_habits || '',
    financial_stress: student.financial_stress || '',
    family_his_of_mental_illness: student.family_his_of_mental_illness || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const age = Number(formData.age);
      if (age < 15 || age > 100) {
        newErrors.age = 'Age must be between 15 and 100';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Optional fields with validation
    if (formData.cgpa) {
      const cgpa = Number(formData.cgpa);
      if (cgpa < 0 || cgpa > 10) {
        newErrors.cgpa = 'CGPA must be between 0.0 and 10.0';
      }
    }

    if (formData.work_study_hours) {
      const hours = Number(formData.work_study_hours);
      if (hours < 0 || hours > 24) {
        newErrors.work_study_hours = 'Hours must be between 0 and 24';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!student.documentId) {
      toast.error('Student document ID not found');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data for API
      const updateData: any = {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender
      };

      // Add optional fields
      if (formData.city) updateData.city = formData.city;
      if (formData.cgpa) updateData.cgpa = Number(formData.cgpa);
      if (formData.degree) updateData.degree = formData.degree;
      if (formData.academic_pressure) updateData.academic_pressure = Number(formData.academic_pressure);
      if (formData.study_satisfaction) updateData.study_satisfaction = Number(formData.study_satisfaction);
      if (formData.work_study_hours) updateData.work_study_hours = Number(formData.work_study_hours);
      if (formData.sleep_duration) updateData.sleep_duration = formData.sleep_duration;
      if (formData.dietary_habits) updateData.dietary_habits = formData.dietary_habits;
      if (formData.financial_stress) updateData.financial_stress = Number(formData.financial_stress);
      if (formData.family_his_of_mental_illness) updateData.family_his_of_mental_illness = formData.family_his_of_mental_illness;

      await apiClient.put(`/api/students/${student.documentId}`, {
        data: updateData
      });

      toast.success('Student information updated successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to update student:', error);
      toast.error(error.message || 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] flex items-center gap-2">
              <User className="w-5 h-5" />
              Edit Student Information
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] flex items-center gap-2">
              <User className="w-4 h-4" />
              BASIC INFORMATION
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 font-['Poppins:Regular',sans-serif]">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="Enter age"
                  min="15"
                  max="100"
                />
                {errors.age && (
                  <p className="text-xs text-red-600 mt-1 font-['Poppins:Regular',sans-serif]">
                    {errors.age}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-600 mt-1 font-['Poppins:Regular',sans-serif]">
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              ACADEMIC INFORMATION
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CGPA */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  CGPA (Thang 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={(e) => handleChange('cgpa', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cgpa ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="0.00 - 10.00"
                  min="0"
                  max="10"
                />
                {errors.cgpa && (
                  <p className="text-xs text-red-600 mt-1 font-['Poppins:Regular',sans-serif]">
                    {errors.cgpa}
                  </p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Degree
                </label>
                <select
                  value={formData.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select degree</option>
                  <option value="First year">First year</option>
                  <option value="Second year">Second year</option>
                  <option value="Third year">Third year</option>
                  <option value="Fourth year">Fourth year</option>
                  <option value="Fifth year">Fifth year</option>
                </select>
              </div>

              {/* Academic Pressure */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Academic Pressure
                </label>
                <select
                  value={formData.academic_pressure}
                  onChange={(e) => handleChange('academic_pressure', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level</option>
                  <option value="1">1 - Very Low</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - High</option>
                  <option value="5">5 - Very High</option>
                </select>
                <p className="text-xs text-gray-500 mt-1 font-['Poppins:Regular',sans-serif]">
                  1 = Very Low, 5 = Very High
                </p>
              </div>

              {/* Study Satisfaction */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Study Satisfaction
                </label>
                <select
                  value={formData.study_satisfaction}
                  onChange={(e) => handleChange('study_satisfaction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level</option>
                  <option value="1">1 - Very Unsatisfied</option>
                  <option value="2">2 - Unsatisfied</option>
                  <option value="3">3 - Neutral</option>
                  <option value="4">4 - Satisfied</option>
                  <option value="5">5 - Very Satisfied</option>
                </select>
                <p className="text-xs text-gray-500 mt-1 font-['Poppins:Regular',sans-serif]">
                  1 = Very Unsatisfied, 5 = Very Satisfied
                </p>
              </div>

              {/* Work/Study Hours */}
              <div className="md:col-span-2">
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Work/Study Hours
                </label>
                <input
                  type="number"
                  value={formData.work_study_hours}
                  onChange={(e) => handleChange('work_study_hours', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.work_study_hours ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="Hours per day"
                  min="0"
                  max="24"
                />
                <p className="text-xs text-gray-500 mt-1 font-['Poppins:Regular',sans-serif]">
                  Average hours per day
                </p>
                {errors.work_study_hours && (
                  <p className="text-xs text-red-600 mt-1 font-['Poppins:Regular',sans-serif]">
                    {errors.work_study_hours}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Health & Lifestyle */}
          <div className="space-y-4">
            <h3 className="text-sm font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] flex items-center gap-2">
              <Heart className="w-4 h-4" />
              HEALTH & LIFESTYLE
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sleep Duration */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Sleep Duration
                </label>
                <select
                  value={formData.sleep_duration}
                  onChange={(e) => handleChange('sleep_duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select duration</option>
                  <option value="Less than 5 hours">Less than 5 hours</option>
                  <option value="5-6 hours">5-6 hours</option>
                  <option value="7-8 hours">7-8 hours</option>
                  <option value="More than 8 hours">More than 8 hours</option>
                </select>
              </div>

              {/* Dietary Habits */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Dietary Habits
                </label>
                <select
                  value={formData.dietary_habits}
                  onChange={(e) => handleChange('dietary_habits', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select habits</option>
                  <option value="Unhealthy">Unhealthy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Healthy">Healthy</option>
                </select>
              </div>

              {/* Financial Stress */}
              <div>
                <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                  Financial Stress
                </label>
                <select
                  value={formData.financial_stress}
                  onChange={(e) => handleChange('financial_stress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select level</option>
                  <option value="1">1 - Very Low</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - High</option>
                  <option value="5">5 - Very High</option>
                </select>
                <p className="text-xs text-gray-500 mt-1 font-['Poppins:Regular',sans-serif]">
                  1 = Very Low, 5 = Very High
                </p>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-4">
            <h3 className="text-sm font-['Poppins:SemiBold',sans-serif] text-[#0c1e33] flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              BACKGROUND
            </h3>
            
            <div>
              <label className="block text-xs font-['Poppins:Medium',sans-serif] text-[#495d72] mb-1">
                Family History of Mental Illness
              </label>
              <select
                value={formData.family_his_of_mental_illness}
                onChange={(e) => handleChange('family_his_of_mental_illness', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-['Poppins:Regular',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Warning Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-['Poppins:Regular',sans-serif] text-blue-800">
              ⚠️ Note: Changes will be saved immediately and may affect the student's mental health assessment.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 font-['Poppins:Medium',sans-serif] text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
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
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
