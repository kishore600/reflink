// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Sessions', href: '/dashboard/sessions', icon: '💼' },
  { name: 'Referrals', href: '/dashboard/referrals', icon: '🔗' },
  { name: 'My Profile', href: '/profile/[username]', icon: '👤' },
  { name: 'Discover', href: '/discover', icon: '🔍' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const href = item.href === '/profile/[username]' ? `/profile/${user?.username}` : item.href;
          const isActive = pathname === href;

          return (
            <Link
              key={item.name}
              href={href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-black hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}