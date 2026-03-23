'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    content_type: 'blog',
    content_id: '',
    publish_at: '',
    status: 'scheduled',
    meta: '',
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/content-schedule/${id}`);
        const data = await res.json();
        const s = data.schedule;
        if (s) {
          setForm({
            title: s.title || '',
            content_type: s.content_type || 'blog',
            content_id: s.content_id ? String(s.content_id) : '',
            publish_at: s.publish_at ? new Date(s.publish_at).toISOString().slice(0,16) : '',
            status: s.status || 'scheduled',
            meta: '',
          });
        }
      } catch (err) {
        setError('Gagal memuat data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      const body = {
        publish_at: form.publish_at,
        status: form.status,
      };

      const res = await fetch(`/api/content-schedule/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan');
      }

      router.push('/admin/content-schedule');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/content-schedule" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft size={18} /> Kembali
        </Link>

        <h1 className="text-2xl font-bold mb-2">Edit Jadwal</h1>
        <p className="text-gray-600 mb-6">Perbarui jadwal publikasi</p>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish At</label>
              <input name="publish_at" type="datetime-local" value={form.publish_at} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta (JSON)</label>
              <textarea name="meta" value={form.meta} onChange={handleChange} rows={6} className="w-full px-3 py-2 border rounded" />
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
              <Link href="/admin/content-schedule" className="px-4 py-2 border rounded text-gray-700">Batal</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
