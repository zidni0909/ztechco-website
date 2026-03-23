'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchFilter from '@/components/admin/SearchFilter';
import Pagination from '@/components/admin/Pagination';
import { Trash2, Plus } from 'lucide-react';

interface Schedule {
  id: number;
  title: string;
  content_type: string;
  content_id: number | null;
  publish_at: string;
  status: string;
}

export default function ContentSchedulePage() {
  const [items, setItems] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const itemsPerPage = 20;

  useEffect(() => {
    fetchItems();
  }, [currentPage, searchQuery, selectedStatus]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchQuery) params.append('search', searchQuery);
      if (selectedStatus) params.append('status', selectedStatus);

      const res = await fetch(`/api/content-schedule?${params}`);
      const data = await res.json();
      setItems(data.schedules || []);
      setTotalItems(data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load schedules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: Record<string, any>) => {
    setSelectedStatus(filters.status || '');
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this schedule?')) return;
    try {
      const res = await fetch(`/api/content-schedule/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter(i => i.id !== id));
        setTotalItems(totalItems - 1);
      } else {
        setError('Failed to delete schedule');
      }
    } catch (err) {
      setError('Failed to delete schedule');
      console.error(err);
    }
  };

  const filterDefinitions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Published', value: 'published' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Scheduling</h1>
            <p className="text-gray-600 mt-1">Manage scheduled publishes and campaigns</p>
          </div>
          <Link href="/admin/content-schedule/create" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <Plus size={16} />
            New Schedule
          </Link>
        </div>

        <SearchFilter onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }} onFilter={handleFilter} filterDefinitions={filterDefinitions} />

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading schedules...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No scheduled items found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Publish At</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700">{item.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.content_type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.publish_at).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <Link href={`/admin/content-schedule/${item.id}/edit`} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">Edit</Link>
                            <button onClick={() => handleDelete(item.id)} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded flex items-center gap-2"><Trash2 size={14} />Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
