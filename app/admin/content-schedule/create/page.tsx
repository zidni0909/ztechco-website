'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content_type: 'blog',
    content_id: '',
    publish_at: '',
    meta: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.publish_at) {
      setError('Publish date wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const body = {
        title: form.title,
        content_type: form.content_type,
        content_id: form.content_id ? Number(form.content_id) : null,
        publish_at: form.publish_at,
        meta: form.meta ? JSON.parse(form.meta) : {},
      };

      const res = await fetch('/api/content-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal membuat schedule');
      }

      router.push('/admin/content-schedule');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat schedule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/content-schedule" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={18} /> Kembali
        </Link>

        <h1 className="text-2xl font-bold mb-2">Buat Jadwal Konten</h1>
        <p className="text-gray-600 mb-6">Buat entri jadwal untuk mempublikasikan konten otomatis.</p>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Konten</label>
              <select name="content_type" value={form.content_type} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option value="blog">Blog</option>
                <option value="portfolio">Portfolio</option>
                <option value="services">Services</option>
                <option value="testimonials">Testimonial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content ID (opsional)</label>
              <input name="content_id" value={form.content_id} onChange={handleChange} className="w-full px-3 py-2 border rounded" placeholder="ID konten jika ada" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish At</label>
              <input name="publish_at" type="datetime-local" value={form.publish_at} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta (JSON, opsional)</label>
              <textarea name="meta" value={form.meta} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded" placeholder='{"key":"value"}' />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Menyimpan...' : 'Buat Jadwal'}</button>
              <Link href="/admin/content-schedule" className="px-4 py-2 border rounded text-gray-700">Batal</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
