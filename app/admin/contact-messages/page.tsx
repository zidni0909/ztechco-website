'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, Check } from 'lucide-react';
import SearchFilter from '@/components/admin/SearchFilter';
import Pagination from '@/components/admin/Pagination';
import BulkActions, { BulkSelectCheckbox } from '@/components/admin/BulkActions';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  reply?: string;
  created_at: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const itemsPerPage = 20;

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchQuery, selectedStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (searchQuery) params.append('search', searchQuery);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(`/api/contact-messages?${params}`);
      const data = await response.json();
      setMessages(data.messages || []);
      setTotalItems(data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load messages');
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
    setSelectedStatus(filters.status || '');
    setCurrentPage(1);
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        setTotalItems(totalItems - 1);
      } else {
        setError('Failed to delete message');
      }
    } catch (err) {
      setError('Failed to delete message');
      console.error(err);
    }
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'replied',
          reply: replyText,
        }),
      });

      if (response.ok) {
        setReplyingTo(null);
        setReplyText('');
        fetchMessages();
      } else {
        setError('Failed to send reply');
      }
    } catch (err) {
      setError('Failed to send reply');
      console.error(err);
    }
  };

  const handleMarkAs = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchMessages();
      } else {
        setError('Failed to update message');
      }
    } catch (err) {
      setError('Failed to update message');
      console.error(err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedMessages.length) return;

    try {
      if (action === 'delete') {
        if (!confirm(`Delete ${selectedMessages.length} message(s)?`)) return;
        for (const id of selectedMessages) {
          await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
        }
        setMessages(messages.filter(m => !selectedMessages.includes(m.id)));
        setTotalItems(totalItems - selectedMessages.length);
      } else if (action === 'mark-read' || action === 'mark-replied' || action === 'mark-archived') {
        const statusMap = { 'mark-read': 'read', 'mark-replied': 'replied', 'mark-archived': 'archived' };
        for (const id of selectedMessages) {
          await fetch(`/api/contact-messages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: statusMap[action as keyof typeof statusMap] }),
          });
        }
        fetchMessages();
      }

      setSelectedMessages([]);
    } catch (err) {
      setError(`Failed to execute bulk action`);
      console.error(err);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(messages.map(m => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, id]);
    } else {
      setSelectedMessages(selectedMessages.filter(mid => mid !== id));
    }
  };

  const filterDefinitions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      read: 'bg-gray-100 text-gray-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
              <p className="text-gray-600 mt-1">Manage contact form submissions</p>
            </div>
          </div>
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
        {selectedMessages.length > 0 && (
          <BulkActions
            selectedItems={selectedMessages}
            totalItems={messages.length}
            onSelectAll={handleSelectAll}
            onSelect={handleSelectMessage}
            onAction={handleBulkAction}
            actions={[
              { label: 'Mark as Read', key: 'mark-read' },
              { label: 'Mark as Replied', key: 'mark-replied' },
              { label: 'Archive', key: 'mark-archived' },
              { label: 'Delete', key: 'delete', className: 'text-red-600' },
            ]}
          />
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl">No messages found</div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div
                    className={`p-6 ${msg.status === 'new' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    {/* Message Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        <BulkSelectCheckbox
                          id={msg.id}
                          selected={selectedMessages.includes(msg.id)}
                          onSelect={(id) => handleSelectMessage(id || msg.id, !selectedMessages.includes(msg.id))}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Mail size={20} className="text-gray-400" />
                            <div>
                              <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                              <p className="text-sm text-gray-600">{msg.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(msg.status)}`}>
                          {msg.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="mt-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    {/* Reply Section */}
                    {msg.reply && (
                      <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm font-medium text-green-900 mb-1">Reply:</p>
                        <p className="text-sm text-green-800 whitespace-pre-wrap">{msg.reply}</p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === msg.id && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleReply(msg.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Send Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      {msg.status !== 'replied' && !replyingTo && (
                        <button
                          onClick={() => setReplyingTo(msg.id)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                        >
                          Reply
                        </button>
                      )}
                      {msg.status === 'new' && (
                        <button
                          onClick={() => handleMarkAs(msg.id, 'read')}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Check size={16} />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

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
