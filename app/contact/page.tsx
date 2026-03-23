import type { Metadata } from 'next';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import ContactContent from './ContactContent';
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
  const description = 'Contact ZTech Grup for professional technology solutions. Get in touch via email, phone, or visit our office.';

  return {
    title: 'Contact Us',
    description,
    alternates: { canonical: '/contact' },
    openGraph: {
      title: 'Contact Us',
      description,
      url: `${SITE_URL}/contact`,
      type: 'website',
    },
  };
}

export const revalidate = 3600;

export default async function ContactPage() {
  const settings = await getSettings();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Contact', url: `${SITE_URL}/contact` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ContactContent settings={settings} />
    </>
  );
}
