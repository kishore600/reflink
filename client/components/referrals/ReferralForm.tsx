/* eslint-disable @typescript-eslint/no-explicit-any */
// components/referrals/ReferralForm.tsx
'use client';

import { useState } from 'react';
import { referralsAPI } from '@/lib/api/referrals';
import { Referral } from '@/types';

interface ReferralFormProps {
  sessionId: string;
  existingReferral?: Referral;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReferralForm({ sessionId, existingReferral, onClose, onSuccess }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    company: existingReferral?.company || '',
    position: existingReferral?.position || '',
    jobDescription: existingReferral?.jobDescription || '',
    applicationLink: existingReferral?.applicationLink || '',
    employeeNotes: existingReferral?.employeeNotes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingReferral) {
        // For now, we'll create a new referral since update isn't implemented
        await referralsAPI.submitReferral({
          sessionId,
          ...formData,
        });
      } else {
        await referralsAPI.submitReferral({
          sessionId,
          ...formData,
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting referral:', error);
      alert(error.response?.data?.message || 'Failed to submit referral');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-black">
          {existingReferral ? 'Update Referral' : 'Submit Referral'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Google, Microsoft"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
              rows={3}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the role and requirements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Link
            </label>
            <input
              type="url"
              value={formData.applicationLink}
              onChange={(e) => setFormData(prev => ({ ...prev, applicationLink: e.target.value }))}
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://company.com/careers/position"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Notes *
            </label>
            <textarea
              required
              value={formData.employeeNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, employeeNotes: e.target.value }))}
              rows={4}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Why are you recommending this candidate? What impressed you about their work?"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : (existingReferral ? 'Update Referral' : 'Submit Referral')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}