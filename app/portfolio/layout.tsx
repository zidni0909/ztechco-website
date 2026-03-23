import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore our curated collection of innovative project solutions and digital experiences',
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
