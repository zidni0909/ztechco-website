export default function BlogPostLoading() {
  return (
    <div className="min-h-screen">
      <div className="py-20 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="flex gap-4 mb-6">
              <div className="h-6 w-20 bg-secondary-200 rounded animate-pulse" />
              <div className="h-6 w-32 bg-secondary-100 rounded animate-pulse" />
            </div>
            <div className="h-10 bg-secondary-200 rounded-xl mb-6 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-4 bg-secondary-100 rounded animate-pulse" style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
