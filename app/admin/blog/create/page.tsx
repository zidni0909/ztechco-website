import BlogForm from '@/components/admin/BlogForm';

export default function CreateBlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Blog Post</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <BlogForm />
      </div>
    </div>
  );
}
