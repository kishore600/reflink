/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/profile/[username]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usersAPI } from '@/lib/api/users';
import { User, ConsultingOffer } from '@/types';
import ConsultingOffers from '@/components/profile/ConsultingOffers';
import SkillsSection from '@/components/profile/SkillsSection';

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await usersAPI.getUserProfile(username);
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
        <p className="text-black">{error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center space-x-2">
                {user.isAvailable && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    🔥 Available
                  </span>
                )}
              </div>
            </div>
            <p className="text-xl text-black mb-3">
              {user.title} • {user.experience}
            </p>
            <p className="text-gray-500 mb-4 max-w-2xl">
              {user.bio || 'No bio provided yet.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center">
                🔄 <span className="ml-1">Available for {user.availableSlots} sessions this week</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                ✅ <span className="ml-1">{user.completedSessions} sessions completed</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                📍 <span className="ml-1">{user.location}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Referral Ask & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              🎯 Looking For
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Desired Roles:</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.desiredRoles.map(role => (
                    <span key={role} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Target Companies:</h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  {user.targetCompanies.map(company => (
                    <div key={company} className="bg-gray-100 p-3 rounded-lg flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded mr-2 flex items-center justify-center text-xs font-bold text-gray-700">
                        {company.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{company}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-2">Preferences:</h3>
                <div className="space-y-2 text-sm text-black">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium text-gray-800">{user.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remote Policy:</span>
                    <span className="font-medium text-gray-800">{user.remotePolicy}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <SkillsSection skills={user.skills} />
        </div>

        {/* Column 2: Consulting Offers */}
        <div className="lg:col-span-2">
          <ConsultingOffers 
            offers={user.consultingOffers as ConsultingOffer[]} 
            userId={user._id}
            username={user.username}
          />
        </div>
      </div>

      {/* Success Stories */}
      {user.successStories && user.successStories.length > 0 && (
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-500 flex items-center">
            💬 Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.successStories.map((story, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                <p className="text-gray-700 italic">"{story.testimonial}"</p>
                <p className="text-sm text-black mt-3 font-semibold">
                  — {story.employee} at {story.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}