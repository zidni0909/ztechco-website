import type { Metadata } from 'next';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import AboutContent from './AboutContent';
import { generateBreadcrumbJsonLd } from '@/lib/utils/seo';

const SITE_URL = 'https://ztechco.my.id';

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.about_title || 'About Us';
  const description = settings.about_subtitle || 'Learn about ZTech Grup - your trusted technology partner with 5+ years of expertise in digital transformation.';

  return {
    title,
    description,
    alternates: { canonical: '/about' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/about`,
      type: 'website',
    },
  };
}

export const revalidate = 3600;

export default async function AboutPage() {
  const settings = await getSettings();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'About', url: `${SITE_URL}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AboutContent settings={settings} />
    </>
  );
}
