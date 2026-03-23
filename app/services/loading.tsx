export default function ServicesLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="h-8 w-40 bg-secondary-200 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-14 bg-secondary-200 rounded-2xl mb-4 animate-pulse" />
          <div className="h-6 w-3/4 bg-secondary-100 rounded-xl mx-auto animate-pulse" />
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl bg-white p-8 shadow-lg border border-secondary-200">
              <div className="w-14 h-14 bg-secondary-200 rounded-2xl mb-6 animate-pulse" />
              <div className="h-7 bg-secondary-200 rounded-xl mb-4 w-3/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-secondary-100 rounded animate-pulse" />
                <div className="h-4 bg-secondary-100 rounded animate-pulse w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
