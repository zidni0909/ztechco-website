import PortfolioForm from '@/components/admin/PortfolioForm';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

async function getPortfolioItem(id: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM portfolio WHERE id = ?',
    [id]
  );
  return (rows as RowDataPacket[])[0];
}

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  const item = await getPortfolioItem(params.id);

  if (!item) {
    return <div className="text-red-600">Portfolio item not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Portfolio Item</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <PortfolioForm item={item} isEdit />
      </div>
    </div>
  );
}
