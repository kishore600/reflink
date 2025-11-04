// app/dashboard/sessions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { sessionsAPI } from '@/lib/api/sessions';
import { Session } from '@/types';
import SessionCard from '@/components/sessions/SessionCard';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'as-jobseeker' | 'as-employee'>('all');

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      const sessionsData = await sessionsAPI.getSessions(filter);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage your consulting sessions and track progress</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setFilter('as-jobseeker')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'as-jobseeker'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            As Job Seeker
          </button>
          <button
            onClick={() => setFilter('as-employee')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'as-employee'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            As Employee
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-6">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">💼</div>
            <p className="text-gray-500 text-lg mb-4">No sessions found</p>
            <p className="text-gray-600">
              {filter === 'as-jobseeker' 
                ? "You haven't booked any sessions yet."
                : filter === 'as-employee'
                ? "No one has booked your consulting offers yet."
                : "You don't have any sessions yet."
              }
            </p>
            {filter === 'as-jobseeker' && (
              <a 
                href="/discover" 
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Discover Talent
              </a>
            )}
          </div>
        ) : (
          sessions.map(session => (
            <SessionCard 
              key={session._id} 
              session={session} 
              onUpdate={fetchSessions}
            />
          ))
        )}
      </div>
    </div>
  );
}