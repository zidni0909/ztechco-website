import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

const SITE_URL = 'https://ztechco.my.id';

async function getSettings(): Promise<Record<string, string>> {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT `key`, `value` FROM settings');
    const settings: Record<string, string> = {};
    rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.site_title || 'ZTech Grup';
  const description = settings.site_description || 'Leading technology solutions provider';

  return {
    title: {
      default: `${title} - Technology Solutions`,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: SITE_URL,
      siteName: title,
      title: `${title} - Technology Solutions`,
      description,
      images: [
        {
          url: settings.logo_url || '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Technology Solutions`,
      description,
      images: [settings.logo_url || '/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // User will add their Google Search Console verification code here
      // google: 'your-verification-code',
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const title = settings.site_title || 'ZTech Grup';
  const description = settings.site_description || 'Leading technology solutions provider';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: title,
    url: SITE_URL,
    logo: settings.logo_url ? `${SITE_URL}${settings.logo_url}` : undefined,
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.contact_address || 'Jakarta, Indonesia',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.contact_phone || '',
      email: settings.contact_email || '',
      contactType: 'customer service',
    },
    sameAs: [
      settings.social_github,
      settings.social_twitter,
      settings.social_linkedin,
      settings.social_instagram,
    ].filter(url => url && url !== '#'),
  };

  return (
    <html lang="id" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
