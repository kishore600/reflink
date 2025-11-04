/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/referrals/create/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sessionsAPI } from '@/lib/api/sessions';
import { Session } from '@/types';
import ReferralForm from '@/components/referrals/ReferralForm';

export default function CreateReferralPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s._id === sessionId);
      if (session) {
        setSelectedSession(session);
      }
    }
  }, [sessionId, sessions]);

  const fetchCompletedSessions = async () => {
    try {
      const sessionsData = await sessionsAPI.getSessions('as-employee');
      const completedSessions = sessionsData.filter(
        (session:any) => session.status === 'completed' && !session.referralSubmitted
      );
      setSessions(completedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferralSuccess = () => {
    router.push('/dashboard/referrals');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-2">Create Referral</h1>
        <p className="text-gray-600">Submit a referral for a completed consulting session</p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">No Sessions Available</h2>
          <p className="text-gray-600 mb-6">
            You need to complete consulting sessions before you can submit referrals.
          </p>
          <a 
            href="/dashboard/sessions" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            View Sessions
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Selection */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Session</h2>
            <p className="text-gray-600 mb-6">
              Choose a completed session to refer the candidate
            </p>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sessions.map(session => (
                <div
                  key={session._id}
                  onClick={() => setSelectedSession(session)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSession?._id === session._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {session.consultingOffer.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {session.duration} mins
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    with <span className="font-medium">{session.jobSeeker.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.scheduledAt).toLocaleDateString()}
                  </p>
                  {session.notes && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      {session.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Referral Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {selectedSession ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Refer {selectedSession.jobSeeker.name}
                </h2>
                <ReferralForm
                  sessionId={selectedSession._id}
                  onClose={() => router.push('/dashboard/referrals')}
                  onSuccess={handleReferralSuccess}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">👆</div>
                <p className="text-gray-600">Select a session to create a referral</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}