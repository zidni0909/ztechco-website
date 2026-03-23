import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import Link from 'next/link';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';
import HeroSection from '@/components/frontend/HeroSection';
import ServicesSection from '@/components/frontend/ServicesSection';
import StatsSection from '@/components/frontend/StatsSection';
import CTASection from '@/components/frontend/CTASection';

async function getSettings() {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM settings');
    const settings: Record<string, string> = {};
    rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch {
    return {
      hero_title: 'Solusi Teknologi Terpercaya untuk Masa Depan Bisnis Anda',
      hero_subtitle: 'Kami menghadirkan inovasi teknologi terdepan dengan layanan profesional yang membantu bisnis Anda berkembang pesat di era digital'
    };
  }
}

async function getServices() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM services WHERE is_published = true ORDER BY `order` ASC LIMIT 6'
    );
    return rows;
  } catch {
    return [];
  }
}

export default async function Home() {
  const settings = await getSettings();
  const services = await getServices();

  return (
    <>
      <Navbar settings={settings} />
      <HeroSection settings={settings} />
      <StatsSection settings={settings} />
      <ServicesSection services={services} />
      <CTASection settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
