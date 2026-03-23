import Link from 'next/link';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import DeleteButton from '@/components/admin/DeleteButton';

async function getServices() {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM services ORDER BY `order` ASC'
  );
  return rows;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <Link href="/admin/services/create" className="btn-primary">
          + Add Service
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((service: any) => (
              <tr key={service.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{service.title}</div>
                  <div className="text-sm text-gray-500">{service.description.substring(0, 60)}...</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{service.order}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${service.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {service.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/services/edit/${service.id}`} className="text-blue-600 hover:text-blue-800">
                    Edit
                  </Link>
                  <DeleteButton id={service.id} type="services" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
