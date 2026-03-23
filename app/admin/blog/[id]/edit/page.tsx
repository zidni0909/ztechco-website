import BlogForm from '@/components/admin/BlogForm';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

async function getBlogPost(id: string) {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM blog_posts WHERE id = ?',
    [id]
  );
  return (rows as RowDataPacket[])[0];
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  if (!post) {
    return <div className="text-red-600">Blog post not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Blog Post</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <BlogForm post={post} isEdit />
      </div>
    </div>
  );
}
