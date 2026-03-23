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
      let query = 'SELECT * FROM services WHERE 1=1';
      const params: any[] = [];

      if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ' ORDER BY `order` ASC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [services] = await db.query<RowDataPacket[]>(query, params);
      
      let countQuery = 'SELECT COUNT(*) as total FROM services WHERE 1=1';
      const countParams: any[] = [];
      if (search) {
        countQuery += ' AND (title LIKE ? OR description LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm);
      }
      
      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

      return NextResponse.json({
        services,
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
      const { title, description, icon, image_url, order, is_published } = body;

      // Validation
      if (!validateRequired(title)) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      if (!validateMinLength(title, 3)) {
        return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
      }
      if (!validateRequired(description)) {
        return NextResponse.json({ error: 'Description is required' }, { status: 400 });
      }

      await db.query(
        'INSERT INTO services (title, description, icon, image_url, `order`, is_published) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, icon || '', image_url || '', order || 0, is_published || false]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}
