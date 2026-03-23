'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, type }: { id: number; type: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });

    if (res.ok) {
      router.refresh();
    } else {
      alert('Failed to delete');
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
      Delete
    </button>
  );
}
