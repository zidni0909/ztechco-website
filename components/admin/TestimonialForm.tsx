'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface TestimonialFormProps {
  testimonial?: any;
  isEdit?: boolean;
}

export default function TestimonialForm({ testimonial, isEdit }: TestimonialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    position: testimonial?.position || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    avatar_url: testimonial?.avatar_url || '',
    rating: testimonial?.rating || 5,
    is_published: testimonial?.is_published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/testimonials/${testimonial.id}` : '/api/testimonials';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/admin/testimonials');
      router.refresh();
    } else {
      alert('Error saving testimonial');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="input-field"
            placeholder="CEO, Manager, etc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="input-field"
            placeholder="Company name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="input-field"
          rows={4}
          placeholder="What they said about us..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ImageUpload
          value={formData.avatar_url}
          onChange={(url) => setFormData({ ...formData, avatar_url: url })}
          label="Avatar / Photo"
          recommendedSize="200 x 200 px (1:1 square)"
          maxSizeMB={1}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            className="input-field"
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
      </div>

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
