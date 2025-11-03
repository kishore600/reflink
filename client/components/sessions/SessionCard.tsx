// components/sessions/SessionCard.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { sessionsAPI } from '@/lib/api/sessions';
import { Session } from '@/types';

interface SessionCardProps {
  session: Session;
  onUpdate: () => void;
}

export default function SessionCard({ session, onUpdate }: SessionCardProps) {
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState(session.meetingLink || '');
  const [notes, setNotes] = useState(session.notes || '');

  const isJobSeeker = session.jobSeeker._id === user?._id;
  const otherUser = isJobSeeker ? session.employee : session.jobSeeker;

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await sessionsAPI.updateSessionStatus(session._id, {
        status: newStatus,
        meetingLink: session.meetingLink,
        notes: session.notes,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDetails = async () => {
    setIsUpdating(true);
    try {
      await sessionsAPI.updateSessionStatus(session._id, {
        status: session.status,
        meetingLink,
        notes,
      });
      setShowUpdateModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating session details:', error);
      alert('Failed to update session details');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {session.consultingOffer.title}
            </h3>
            <p className="text-black mb-1">
              with <span className="font-medium">{otherUser.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              {new Date(session.scheduledAt).toLocaleDateString()} • {session.duration} minutes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
            {!isJobSeeker && session.status === 'scheduled' && (
              <button
                onClick={() => setShowUpdateModal(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Update
              </button>
            )}
          </div>
        </div>

        {session.notes && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">{session.notes}</p>
          </div>
        )}

        {session.meetingLink && (
          <div className="mb-4">
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              🔗 Join Meeting
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {session.status === 'scheduled' && (
            <>
              <button
                onClick={() => handleStatusUpdate('in-progress')}
                disabled={isUpdating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                Start Session
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdating}
                className="border border-red-600 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
          {session.status === 'in-progress' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={isUpdating}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Session Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateDetails}
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}