'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import SearchFilter from '@/components/admin/SearchFilter';
import Pagination from '@/components/admin/Pagination';
import BulkActions, { BulkSelectCheckbox } from '@/components/admin/BulkActions';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchQuery) params.append('search', searchQuery);
      if (selectedRole) params.append('role', selectedRole);

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();
      setUsers(data.users || []);
      setTotalItems(data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (filters: Record<string, any>) => {
    setSelectedRole(filters.role || '');
    setCurrentPage(1);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        setTotalItems(totalItems - 1);
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedUsers.length) return;

    try {
      if (action === 'delete') {
        if (!confirm(`Delete ${selectedUsers.length} user(s)?`)) return;
        
        for (const id of selectedUsers) {
          await fetch(`/api/users/${id}`, { method: 'DELETE' });
        }
        setUsers(users.filter(u => !selectedUsers.includes(u.id)));
        setTotalItems(totalItems - selectedUsers.length);
      }

      setSelectedUsers([]);
    } catch (err) {
      setError(`Failed to execute bulk action`);
      console.error(err);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    }
  };

  const filterDefinitions = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage system users and permissions</p>
          </div>
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add User
          </Link>
        </div>

        {/* Search & Filter */}
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          filterDefinitions={filterDefinitions}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <BulkActions
            selectedItems={selectedUsers}
            totalItems={users.length}
            onSelectAll={handleSelectAll}
            onSelect={handleSelectUser}
            onAction={handleBulkAction}
            actions={[
              { label: 'Delete', key: 'delete', className: 'text-red-600' },
            ]}
          />
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <BulkSelectCheckbox
                          selected={selectedUsers.length === users.length && users.length > 0}
                          onSelect={() => handleSelectAll(!(selectedUsers.length === users.length && users.length > 0))}
                          indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <BulkSelectCheckbox
                            id={user.id}
                            selected={selectedUsers.includes(user.id)}
                            onSelect={(id) => handleSelectUser(id || user.id, !selectedUsers.includes(user.id))}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-3">
                            <Link
                              href={`/admin/users/${user.id}/edit`}
                              className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
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
