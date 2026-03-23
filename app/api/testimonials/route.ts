export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { validateRequired, validateMinLength } from '@/lib/utils/validation';
import { handleError } from '@/lib/utils/errors';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const search = searchParams.get('search');

      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM testimonials WHERE 1=1';
      const params: any[] = [];

      if (search) {
        query += ' AND (client_name LIKE ? OR testimonial LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [testimonials] = await db.query<RowDataPacket[]>(query, params);
      
      let countQuery = 'SELECT COUNT(*) as total FROM testimonials WHERE 1=1';
      const countParams: any[] = [];
      if (search) {
        countQuery += ' AND (client_name LIKE ? OR testimonial LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm);
      }
      
      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

      return NextResponse.json({
        testimonials,
        total: countResult[0]?.total || 0,
        page,
        limit,
      });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}

export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { client_name, client_company, client_position, testimonial, rating, image_url, is_published } = body;

      // Validation
      if (!validateRequired(client_name)) {
        return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
      }
      if (!validateRequired(testimonial)) {
        return NextResponse.json({ error: 'Testimonial is required' }, { status: 400 });
      }

      await db.query(
        'INSERT INTO testimonials (client_name, client_company, client_position, testimonial, rating, image_url, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [client_name, client_company || '', client_position || '', testimonial, rating || 5, image_url || '', is_published || false]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}
