'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface BlogFormProps {
  post?: any;
  isEdit?: boolean;
}

export default function BlogForm({ post, isEdit }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image_url: post?.image_url || '',
    category: post?.category || 'technology',
    tags: post?.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '',
    is_published: post?.is_published || false,
  });

  const handleGenerateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...formData,
      tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
    };

    const url = isEdit ? `/api/blog/${post.id}` : '/api/blog';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push('/admin/blog');
      router.refresh();
    } else {
      alert('Error saving blog post');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <button
            type="button"
            onClick={handleGenerateSlug}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Auto Generate
          </button>
        </div>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="input-field"
          placeholder="blog-post-title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="input-field"
          rows={2}
          placeholder="Brief summary of the post"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="input-field"
          rows={8}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-field"
          >
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="design">Design</option>
            <option value="trends">Trends</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="input-field"
            placeholder="react, nextjs, typescript"
          />
        </div>
      </div>

      <ImageUpload
        value={formData.image_url}
        onChange={(url) => setFormData({ ...formData, image_url: url })}
        label="Featured Image"
        recommendedSize="1200 x 630 px (rasio 1.91:1)"
        maxSizeMB={2}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_published}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          className="w-4 h-4 text-primary-600 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">Publish</label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
