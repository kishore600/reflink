// components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Don't render auth-dependent content until mounted
  if (!isMounted) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - always visible */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RL</span>
                </div>
                <span className="font-bold text-xl text-gray-900 hidden sm:block">
                  RefLink
                </span>
              </Link>
            </div>
            {/* Empty space for right section during SSR */}
            <div className="w-32"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                RefLink
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Only render when authenticated AND mounted */}
          {isAuthenticated && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/discover" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Discover
                </Link>
                <Link href={`/profile/${user?.username}`} className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  My Profile
                </Link>
              </div>
            </div>
          )}

          {/* Right Section - Only render when mounted */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}