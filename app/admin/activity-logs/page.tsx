'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Eye } from 'lucide-react';
import SearchFilter from '@/components/admin/SearchFilter';
import Pagination from '@/components/admin/Pagination';

interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  table_name: string;
  record_id: number;
  old_values: string;
  new_values: string;
  ip_address: string;
  created_at: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchLogs();
  }, [currentPage, selectedAction, selectedTable]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (selectedAction) params.append('action', selectedAction);
      if (selectedTable) params.append('table', selectedTable);

      const response = await fetch(`/api/activity-logs?${params}`);
      const data = await response.json();
      setLogs(data.logs || []);
      setTotalItems(data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load activity logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: Record<string, any>) => {
    setSelectedAction(filters.action || '');
    setSelectedTable(filters.table || '');
    setCurrentPage(1);
  };

  const parseJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString || '{}');
    } catch {
      return {};
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      create: 'bg-green-100 text-green-700',
      update: 'bg-blue-100 text-blue-700',
      delete: 'bg-red-100 text-red-700',
      read: 'bg-gray-100 text-gray-700',
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  const filterDefinitions = [
    {
      key: 'action',
      label: 'Action',
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Read', value: 'read' },
      ],
    },
    {
      key: 'table',
      label: 'Table',
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Blog', value: 'blog' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Services', value: 'services' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Contact Messages', value: 'contact_messages' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">Track all system actions and changes</p>
        </div>

        {/* Search & Filter */}
        <SearchFilter
          onSearch={() => {}}
          onFilter={handleFilter}
          filterDefinitions={filterDefinitions}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading activity logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No activity logs found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Table</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Record ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IP Address</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log) => (
                      <>
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700">{log.user_id}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{log.table_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{log.record_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono text-xs">{log.ip_address}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {expandedId === log.id && (
                          <tr key={`details-${log.id}`} className="bg-gray-50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="space-y-4">
                                {log.old_values && log.action === 'update' && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Old Values:</h4>
                                    <pre className="bg-white p-3 rounded border border-gray-300 overflow-x-auto text-xs text-gray-700">
                                      {JSON.stringify(parseJson(log.old_values), null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.new_values && (
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                      {log.action === 'update' ? 'New Values:' : 'Values:'}
                                    </h4>
                                    <pre className="bg-white p-3 rounded border border-gray-300 overflow-x-auto text-xs text-gray-700">
                                      {JSON.stringify(parseJson(log.new_values), null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
