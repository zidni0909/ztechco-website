import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { notFound } from 'next/navigation';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import type { Metadata } from 'next';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/utils/seo';

async function getPost(slug: string) {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM blog_posts WHERE slug = ? AND is_published = true',
      [slug]
    );
    return rows[0];
  } catch {
    return null;
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [post, settings] = await Promise.all([getPost(params.slug), getSettings()]);

  if (!post) {
    notFound();
  }

  const articleJsonLd = generateArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    image_url: post.image_url,
    published_at: post.published_at,
    updated_at: post.updated_at,
    author_name: post.author_name,
    slug: post.slug,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://ztechco.my.id' },
    { name: 'Blog', url: 'https://ztechco.my.id/blog' },
    { name: post.title, url: `https://ztechco.my.id/blog/${post.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar settings={settings} />

      <article className="py-20 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="mb-6">
              <span className="text-sm bg-primary-100 text-primary-600 px-3 py-1 rounded">{post.category}</span>
              <span className="text-sm text-secondary-500 ml-4">{new Date(post.published_at).toLocaleDateString()}</span>
            </div>
            
            <h1 className="text-4xl font-bold text-secondary-900 mb-6">{post.title}</h1>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </article>

      <Footer settings={settings} />
    </>
  );
}
