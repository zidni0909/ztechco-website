'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Upload, Settings } from 'lucide-react';

interface Stats {
  users: number;
  blogs: number;
  portfolio: number;
  services: number;
  testimonials: number;
  activity_logs: number;
  contact_messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin-stats');
      const data = await res.json();
      setStats(data.stats);
      setError('');
    } catch (err) {
      setError('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/users/create" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-md transition-all flex items-center gap-3">
            <Users size={24} />
            <div>
              <div className="font-semibold">Add Admin</div>
              <div className="text-sm opacity-90">Create new admin user</div>
            </div>
          </Link>
          
          <Link href="/admin/website-editor" className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl shadow-md transition-all flex items-center gap-3">
            <Upload size={24} />
            <div>
              <div className="font-semibold">Upload Logo</div>
              <div className="text-sm opacity-90">Change website logo</div>
            </div>
          </Link>
          
          <Link href="/admin/users" className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl shadow-md transition-all flex items-center gap-3">
            <Settings size={24} />
            <div>
              <div className="font-semibold">Manage Admins</div>
              <div className="text-sm opacity-90">Edit users & passwords</div>
            </div>
          </Link>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
        
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading || !stats ? (
            <div className="col-span-3 text-center text-gray-500">Memuat statistik...</div>
          ) : (
            <>
              <StatCard label="Users" value={stats.users} />
              <StatCard label="Blogs" value={stats.blogs} />
              <StatCard label="Portfolio" value={stats.portfolio} />
              <StatCard label="Services" value={stats.services} />
              <StatCard label="Testimonials" value={stats.testimonials} />
              <StatCard label="Activity Logs" value={stats.activity_logs} />
              <StatCard label="Contact Messages" value={stats.contact_messages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
      <div className="text-2xl font-bold text-blue-600 mb-2">{value}</div>
      <div className="text-sm text-gray-700 font-medium">{label}</div>
    </div>
  );
}
