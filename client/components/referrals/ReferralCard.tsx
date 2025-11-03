// components/referrals/ReferralCard.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { referralsAPI } from '@/lib/api/referrals';
import { Referral } from '@/types';
import ReferralForm from './ReferralForm';

interface ReferralCardProps {
  referral: Referral;
  onUpdate: () => void;
}

export default function ReferralCard({ referral, onUpdate }: ReferralCardProps) {
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReferralForm, setShowReferralForm] = useState(false);

  const isEmployee = referral.employee._id === user?._id;
  const otherUser = isEmployee ? referral.jobSeeker : referral.employee;

  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    setIsUpdating(true);
    try {
      await referralsAPI.updateReferralStatus(referral._id, {
        status: newStatus,
        notes,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating referral:', error);
      alert('Failed to update referral status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = () => {
    if (!isEmployee) {
      switch (referral.status) {
        case 'submitted':
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('under-review', 'Application under review')}
                disabled={isUpdating}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
              >
                Under Review
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected', 'Application rejected')}
                disabled={isUpdating}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          );
        case 'under-review':
          return (
            <button
              onClick={() => handleStatusUpdate('interview', 'Interview scheduled')}
              disabled={isUpdating}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Schedule Interview
            </button>
          );
        case 'interview':
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('hired', 'Candidate hired!')}
                disabled={isUpdating}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                Hired
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected', 'Not selected after interview')}
                disabled={isUpdating}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {referral.position} at {referral.company}
            </h3>
            <p className="text-black mb-1">
              {isEmployee ? 'You referred' : 'Referred by'} <span className="font-medium">{otherUser.name}</span>
            </p>
            {referral.employeeNotes && (
              <p className="text-sm text-black mt-2">{referral.employeeNotes}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(referral.status)}`}>
            {referral.status.replace('-', ' ')}
          </span>
        </div>

        {referral.jobDescription && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">{referral.jobDescription}</p>
          </div>
        )}

        {referral.applicationLink && (
          <div className="mb-4">
            <a
              href={referral.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              🔗 View Job Posting
            </a>
          </div>
        )}

        {/* Interview Updates */}
        {referral.interviewUpdates && referral.interviewUpdates.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Interview Updates</h4>
            <div className="space-y-2">
              {referral.interviewUpdates.map((update, index) => (
                <div key={index} className="text-sm text-black">
                  <span className="font-medium">{update.stage}</span> - {new Date(update.date).toLocaleDateString()}
                  {update.notes && <span>: {update.notes}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {getStatusActions()}
          {isEmployee && referral.status === 'submitted' && (
            <button
              onClick={() => setShowReferralForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Edit Referral
            </button>
          )}
        </div>
      </div>

      {/* Referral Form Modal */}
      {showReferralForm && (
        <ReferralForm
          sessionId={referral.session._id as string}
          existingReferral={referral}
          onClose={() => setShowReferralForm(false)}
          onSuccess={() => {
            setShowReferralForm(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}