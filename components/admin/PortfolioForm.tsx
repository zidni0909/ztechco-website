'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

interface PortfolioFormProps {
  item?: any;
  isEdit?: boolean;
}

export default function PortfolioForm({ item, isEdit }: PortfolioFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    client: item?.client || '',
    project_url: item?.project_url || '',
    is_published: item?.is_published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/portfolio/${item.id}` : '/api/portfolio';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push('/admin/portfolio');
      router.refresh();
    } else {
      alert('Error saving portfolio item');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            className="input-field"
            placeholder="Client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
          <input
            type="text"
            value={formData.project_url}
            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
            className="input-field"
            placeholder="https://..."
          />
        </div>
      </div>

      <ImageUpload
        value={formData.image_url}
        onChange={(url) => setFormData({ ...formData, image_url: url })}
        label="Project Image"
        recommendedSize="1200 x 800 px (rasio 3:2)"
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
