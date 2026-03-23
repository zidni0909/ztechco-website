'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/website-editor', label: 'Website Editor', icon: '🎨' },
  { href: '/admin/services', label: 'Services', icon: '⚙️' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '💼' },
  { href: '/admin/blog', label: 'Blog', icon: '📝' },
  { href: '/admin/comments', label: 'Comments', icon: '💬' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { href: '/admin/media', label: 'Media Library', icon: '📁' },
  { href: '/admin/contact-messages', label: 'Messages', icon: '📩' },
  { href: '/admin/content-schedule', label: 'Scheduler', icon: '📅' },
  { href: '/admin/import-export', label: 'Import/Export', icon: '🔄' },
  { href: '/admin/activity-logs', label: 'Activity Logs', icon: '📋' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary-600">ZTech Grup</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              (item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href))
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
