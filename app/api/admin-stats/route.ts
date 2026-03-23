export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const safe = async (table: string) => {
        try {
          const [res] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM ${table}`);
          return (res as RowDataPacket[])[0]?.total || 0;
        } catch (e) {
          console.warn(`Table ${table} missing/error:`, (e as any).message);
          return 0;
        }
      };

      const users = await safe('users');
      const blogs = await safe('blog_posts');
      const portfolio = await safe('portfolio');
      const services = await safe('services');
      const testimonials = await safe('testimonials');
      const activity_logs = await safe('activity_logs');
      const contact_messages = await safe('contact_messages');

      return NextResponse.json({
        stats: {
          users,
          blogs,
          portfolio,
          services,
          testimonials,
          activity_logs,
          contact_messages,
        }
      });
    } catch (error) {
      console.error('Admin stats error:', error);
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
  });
}
