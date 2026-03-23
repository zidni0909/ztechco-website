import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import type { Metadata } from 'next';
import { generateBreadcrumbJsonLd } from '@/lib/utils/seo';
import ServicesGrid from './ServicesGrid';

const SITE_URL = 'https://ztechco.my.id';

async function getServices() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM services WHERE is_published = true ORDER BY `order` ASC'
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
  title: 'Services',
  description: 'Comprehensive technology solutions for your business - web development, mobile apps, UI/UX design, and consulting',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Our Services',
    description: 'Comprehensive technology solutions for your business - web development, mobile apps, UI/UX design, and consulting',
    url: `${SITE_URL}/services`,
    type: 'website',
  },
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Services', url: `${SITE_URL}/services` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar settings={settings} />

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-accent-50/20 pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent-200/15 to-transparent rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="container relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100/50 backdrop-blur-sm rounded-full border border-primary-200/30 mb-6">
            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-primary-700">What We Offer</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-secondary-900">
            Technology Solutions for <span className="gradient-text">Your Business</span>
          </h1>

          <p className="text-xl text-secondary-600 leading-relaxed">
            From web development to digital transformation, we provide comprehensive technology solutions tailored to drive your business forward.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <ServicesGrid services={JSON.parse(JSON.stringify(services))} />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Need a Custom Solution?</h2>
          <p className="text-xl opacity-90 mb-8">
            Every business is unique. Let's discuss your specific needs and create a tailored technology solution that drives results.
          </p>
          <a href="/contact" className="inline-block px-8 py-3 bg-white text-primary-600 font-bold rounded-2xl hover:bg-secondary-50 transition-all duration-300 hover:shadow-lg">
            Get Started Today
          </a>
        </div>
      </section>

      <Footer settings={settings} />
    </>
  );
}
