// app/dashboard/referrals/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { referralsAPI } from '@/lib/api/referrals';
import { Referral } from '@/types';
import ReferralCard from '@/components/referrals/ReferralCard';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'as-jobseeker' | 'as-employee'>('all');

  useEffect(() => {
    fetchReferrals();
  }, [filter]);

  const fetchReferrals = async () => {
    try {
      const referralsData = await referralsAPI.getReferrals(filter);
      setReferrals(referralsData);
    } catch (error) {
      console.error('Error fetching referrals:', error);
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
        <h1 className="text-3xl font-bold text-gray-100 mb-2">My Referrals</h1>
        <p className="text-gray-500">Track your referral requests and application status</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {referrals.filter(r => r.status === 'submitted').length}
          </div>
          <div className="text-sm text-gray-600">Submitted</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {referrals.filter(r => r.status === 'under-review').length}
          </div>
          <div className="text-sm text-gray-600">Under Review</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {referrals.filter(r => r.status === 'interview').length}
          </div>
          <div className="text-sm text-gray-600">Interview</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {referrals.filter(r => r.status === 'hired').length}
          </div>
          <div className="text-sm text-gray-600">Hired</div>
        </div>
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
            All Referrals
          </button>
          <button
            onClick={() => setFilter('as-jobseeker')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'as-jobseeker'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received Referrals
          </button>
          <button
            onClick={() => setFilter('as-employee')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'as-employee'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Given Referrals
          </button>
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-6">
        {referrals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-gray-500 text-lg mb-4">No referrals found</p>
            <p className="text-gray-600">
              {filter === 'as-jobseeker' 
                ? "You haven't received any referrals yet. Complete sessions to get referrals!"
                : filter === 'as-employee'
                ? "You haven't given any referrals yet. Complete sessions and refer candidates!"
                : "You don't have any referrals yet."
              }
            </p>
          </div>
        ) : (
          referrals.map(referral => (
            <ReferralCard 
              key={referral._id} 
              referral={referral} 
              onUpdate={fetchReferrals}
            />
          ))
        )}
      </div>
    </div>
  );
}