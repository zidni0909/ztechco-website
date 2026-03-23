import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import ServiceForm from '@/components/admin/ServiceForm';

async function getService(id: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM services WHERE id = ?',
    [id]
  );
  return rows[0];
}

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await getService(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Service</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <ServiceForm service={service} isEdit />
      </div>
    </div>
  );
}
