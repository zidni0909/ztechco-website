import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import type { Metadata } from 'next';

async function getBlogPosts() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC'
    );
    return rows;
  } catch {
    return [];
  }
}

async function getSettings(): Promise<Record<string, string>> {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT `key`, `value` FROM settings');
    const settings: Record<string, string> = {};
    rows.forEach((row: any) => { settings[row.key] = row.value; });
    return settings;
  } catch {
    return {};
  }
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest news, insights, and updates from ZTech Grup',
  alternates: { canonical: '/blog' },
};

// Revalidate every 1 hour (3600 seconds) for ISR
export const revalidate = 3600;

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getBlogPosts(), getSettings()]);

  return (
    <>
      <Navbar settings={settings} />
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 pt-32 pb-20">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-200/15 to-transparent rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full text-sm font-medium mb-8 border border-primary-200/50">
              📚 Stories & Insights
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-secondary-900 mb-6">
              Our <span className="gradient-text">Blog</span>
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-600 leading-relaxed mb-8">
              Discover the latest insights, best practices, and industry trends from our team of experts. Stay informed and ahead of the curve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#blog-posts"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Read Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-secondary-50/30 to-white" id="blog-posts">
        <div className="container">
          {posts.length > 0 ? (
            <>
              <div className="mb-16">
                <p className="text-center text-secondary-600">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {posts.length}
                  </span>
                  {' '}posts available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any, index: number) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="group h-full">
                      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col border border-secondary-100 hover:border-primary-200/50">
                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                          {/* Placeholder Image with Zoom Effect */}
                          <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 ease-out bg-gradient-to-br from-primary-500 via-accent-400 to-primary-600">
                            <span className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
                              {'📝' + (index % 5)}
                            </span>
                          </div>

                          {/* Top Accent Line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary-600 shadow-lg">
                            {post.category || 'General'}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                          {/* Date */}
                          <div className="flex items-center gap-2 mb-4">
                            <time className="text-sm text-secondary-500 font-medium">
                              {new Date(post.published_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            <span className="text-secondary-300">•</span>
                            <span className="text-sm text-secondary-500">5 min read</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl md:text-2xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-secondary-600 mb-6 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Read More Link */}
                          <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 group-hover:translate-x-1 transition-all duration-300">
                            Read More
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7m0 0l-7 7m7-7H5" />
                            </svg>
                          </div>
                        </div>

                        {/* Bottom Shimmer */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-0 group-hover:opacity-100 animate-pulse"></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">No posts yet</h2>
              <p className="text-secondary-600 mx-auto max-w-md">
                We're working on amazing content. Check back soon for insights and updates!
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
