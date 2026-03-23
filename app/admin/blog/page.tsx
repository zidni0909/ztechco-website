import Link from 'next/link';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import DeleteButton from '@/components/admin/DeleteButton';

async function getBlogPosts() {
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM blog_posts ORDER BY created_at DESC');
  return rows;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
        <Link href="/admin/blog/create" className="btn-primary">+ Create New Post</Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post: any) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.excerpt?.substring(0, 60)}...</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-blue-600 hover:text-blue-800">Edit</Link>
                  <DeleteButton id={post.id} type="blog" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
