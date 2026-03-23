'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from './ImageUpload';

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Settings saved successfully');
      router.refresh();
    } else {
      alert('Error saving settings');
    }
    setLoading(false);
  };

  const fields = [
    { key: 'site_title', label: 'Site Title' },
    { key: 'site_description', label: 'Site Description' },
    { key: 'hero_title', label: 'Hero Title' },
    { key: 'hero_subtitle', label: 'Hero Subtitle' },
    { key: 'contact_email', label: 'Contact Email' },
    { key: 'contact_phone', label: 'Contact Phone' },
    { key: 'contact_address', label: 'Contact Address' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
          <input
            type="text"
            value={formData[field.key] || ''}
            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
            className="input-field"
          />
        </div>
      ))}

      <ImageUpload
        value={formData.logo_url || ''}
        onChange={(url) => setFormData({ ...formData, logo_url: url })}
        label="Logo"
        recommendedSize="400 x 100 px (rasio 4:1, transparan PNG)"
        maxSizeMB={1}
        accept="image/png,image/svg+xml,image/webp"
      />

      <ImageUpload
        value={formData.favicon_url || ''}
        onChange={(url) => setFormData({ ...formData, favicon_url: url })}
        label="Favicon"
        recommendedSize="32 x 32 px atau 64 x 64 px (1:1 square)"
        maxSizeMB={0.5}
        accept="image/png,image/x-icon,image/svg+xml"
      />

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
