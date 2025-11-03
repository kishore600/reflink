// app/discover/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { usersAPI } from '@/lib/api/users';
import { User } from '@/types';
import Link from 'next/link';

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers(filters);
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        <h1 className="text-3xl font-bold text-gray-300 mb-2">Discover Talent</h1>
        <p className="text-gray-500">
          Find skilled developers and book consulting sessions with them.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Skill
            </label>
            <input
              type="text"
              placeholder="e.g., React, Node.js, Python"
              value={filters.skill}
              onChange={(e) => setFilters(prev => ({ ...prev, skill: e.target.value }))}
              className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Role
            </label>
            <input
              type="text"
              placeholder="e.g., Frontend, Backend, Full-Stack"
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user._id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-black">{user.title}</p>
              </div>
            </div>

            <p className="text-black text-sm mb-4 line-clamp-2">
              {user.bio || 'No bio provided yet.'}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {user.skills.slice(0, 3).map(skill => (
                <span key={skill.name} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                  {skill.name}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="text-gray-500 text-xs">+{user.skills.length - 3} more</span>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>✅ {user.completedSessions} sessions</span>
              <span>👁️ {user.profileViews} views</span>
            </div>

            <Link 
              href={`/profile/${user.username}`}
              className="w-full mt-4 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors block"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found matching your filters.</p>
          <button 
            onClick={() => setFilters({ skill: '', role: '' })}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}