/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile/CreateConsultingOfferModal.tsx
'use client';

import { useState } from 'react';
import { usersAPI } from '@/lib/api/users';

interface CreateConsultingOfferModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  'code-review',
  'optimization', 
  'implementation',
  'audit',
  'consulting',
  'debugging',
  'architecture'
];

const difficulties = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function CreateConsultingOfferModal({ onClose, onSuccess }: CreateConsultingOfferModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    skills: [] as string[],
    benefits: '',
    category: 'consulting',
    difficulty: 'intermediate'
  });
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await usersAPI.createConsultingOffer(formData);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating offer:', error);
      alert(error.response?.data?.message || 'Failed to create consulting offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Create Consulting Offer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., React Performance Optimization"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what you'll help with, what problems you can solve, and what the session will cover..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <select
                required
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
                <option value={180}>180 minutes</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level *
              </label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Required
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Benefits / Outcomes *
            </label>
            <textarea
              required
              value={formData.benefits}
              onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="What will the person get out of this session? (e.g., '30-40% performance improvement', 'Production-ready implementation', etc.)"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}