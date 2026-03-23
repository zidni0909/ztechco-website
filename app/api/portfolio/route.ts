export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { validateRequired, validateMinLength } from '@/lib/utils/validation';
import { handleError } from '@/lib/utils/errors';
import { authProtectedEndpoint } from '@/lib/api-auth';

// Public GET for frontend (no auth) + admin with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const showAll = searchParams.get('all'); // admin: show unpublished too

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM portfolio WHERE 1=1';
    const params: any[] = [];

    // Public requests only see published items
    if (!showAll) {
      query += ' AND is_published = true';
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [items] = await db.query<RowDataPacket[]>(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM portfolio WHERE 1=1';
    const countParams: any[] = [];
    if (!showAll) {
      countQuery += ' AND is_published = true';
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

    return NextResponse.json({
      items,
      total: countResult[0]?.total || 0,
      page,
      limit,
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { title, description, category, image_url, project_url, client, is_published } = body;

      // Validation
      if (!validateRequired(title)) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      if (!validateMinLength(title, 3)) {
        return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
      }

      await db.query(
        'INSERT INTO portfolio (title, description, category, image_url, project_url, client, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description || '', category || '', image_url || '', project_url || '', client || '', is_published || false]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}
