import TestimonialForm from '@/components/admin/TestimonialForm';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

async function getTestimonial(id: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM testimonials WHERE id = ?',
    [id]
  );
  return (rows as RowDataPacket[])[0];
}

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await getTestimonial(params.id);

  if (!testimonial) {
    return <div className="text-red-600">Testimonial not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Testimonial</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <TestimonialForm testimonial={testimonial} isEdit />
      </div>
    </div>
  );
}
