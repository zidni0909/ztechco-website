'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        const sessionUser = data?.user;
        if (sessionUser) {
          setUser(sessionUser);
          setForm(prev => ({ ...prev, email: sessionUser.email || '' }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return setError('Tidak ada sesi pengguna');
    if (form.password && form.password !== form.confirmPassword) return setError('Password tidak cocok');

    try {
      setSaving(true);
      setError('');
      const payload: any = { email: form.email };
      if (form.password) payload.password = form.password;

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan profil');
      }

      router.refresh();
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      alert('Profil diperbarui');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Profil Saya</h1>
        <p className="text-gray-600 mb-6">Perbarui email atau password Anda</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (kosongkan jika tidak diubah)</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Menyimpan...' : 'Simpan Profil'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
