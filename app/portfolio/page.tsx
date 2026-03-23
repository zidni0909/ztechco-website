import type { Metadata } from 'next';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import PortfolioContent from './PortfolioContent';
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
  return {
    title: 'Portfolio',
    description: 'Explore our portfolio of innovative technology solutions, web development projects, and digital transformation case studies.',
    alternates: { canonical: '/portfolio' },
    openGraph: {
      title: 'Portfolio',
      description: 'Explore our portfolio of innovative technology solutions and digital transformation projects.',
      url: `${SITE_URL}/portfolio`,
      type: 'website',
    },
  };
}

export const revalidate = 3600;

export default async function PortfolioPage() {
  const settings = await getSettings();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Portfolio', url: `${SITE_URL}/portfolio` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PortfolioContent settings={settings} />
    </>
  );
}
