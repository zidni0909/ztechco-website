import Link from 'next/link';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import DeleteButton from '@/components/admin/DeleteButton';

async function getPortfolio() {
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM portfolio ORDER BY created_at DESC');
  return rows;
}

export default async function PortfolioPage() {
  const portfolio = await getPortfolio();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Portfolio</h1>
        <Link href="/admin/portfolio/create" className="btn-primary">+ Add Portfolio Item</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item: any) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {item.image_url && (
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.client}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${item.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {item.is_published ? 'Published' : 'Draft'}
              </span>
              <div className="mt-4 flex gap-2">
                <Link href={`/admin/portfolio/${item.id}/edit`} className="text-blue-600 text-sm">Edit</Link>
                <DeleteButton id={item.id} type="portfolio" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
