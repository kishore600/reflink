// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import  Navbar from '@/components/layout/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [getCurrentUser, isAuthenticated]);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}