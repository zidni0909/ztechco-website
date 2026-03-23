'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Check, Trash2 } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';

interface Comment {
  id: number;
  blog_id: number;
  blog_title: string;
  author_name: string;
  author_email: string;
  content: string;
  status: string;
  created_at: string;
}

export default function CommentsModerationPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(`/api/blog-comments?${params}`);
      const data = await response.json();
      setComments(data.comments || []);
      setTotalItems(data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/blog-comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchComments();
      } else {
        setError('Failed to moderate comment');
      }
    } catch (err) {
      setError('Failed to moderate comment');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const response = await fetch(`/api/blog-comments/${id}`, { method: 'DELETE' });
      if (response.ok) fetchComments();
      else setError('Failed to delete comment');
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Comments Moderation</h1>
          <p className="text-gray-600 mt-1">Review and moderate blog comments</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No comments found</div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {comments.map((c) => (
                  <div key={c.id} className="p-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{c.author_name} <span className="text-xs text-gray-500">on {c.blog_title}</span></h3>
                      <p className="text-sm text-gray-600 mt-2">{c.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(c.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm"><span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{c.status}</span></div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleModerate(c.id, 'approved')} className="px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded">Approve</button>
                        <button onClick={() => handleModerate(c.id, 'rejected')} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">Reject</button>
                        <button onClick={() => handleDelete(c.id)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
