import Link from 'next/link';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import DeleteButton from '@/components/admin/DeleteButton';

async function getTestimonials() {
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM testimonials ORDER BY created_at DESC');
  return rows;
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Testimonials</h1>
        <Link href="/admin/testimonials/create" className="btn-primary">+ Create New Testimonial</Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {testimonials.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.position}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.company}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{'⭐'.repeat(item.rating)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${item.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/testimonials/${item.id}/edit`} className="text-blue-600 hover:text-blue-800">Edit</Link>
                  <DeleteButton id={item.id} type="testimonials" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
