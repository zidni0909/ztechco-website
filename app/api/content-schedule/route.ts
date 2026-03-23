export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { title, content_type, content_id, publish_at, meta } = body;

      if (!content_type || !publish_at) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const [result] = await db.query(
        'INSERT INTO content_schedule (content_type, content_id, scheduled_time, action, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [content_type, content_id || null, publish_at, 'publish', 'scheduled']
      );

      // @ts-ignore
      const insertId = (result as any).insertId;
      return NextResponse.json({ success: true, id: insertId }, { status: 201 });
    } catch (error) {
      console.error('Create schedule error:', error);
      return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
  });
}

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const status = searchParams.get('status');
      const content_type = searchParams.get('content_type');
      const search = searchParams.get('search');

      const offset = (page - 1) * limit;
      let query = "SELECT id, content_type, content_id, scheduled_time AS publish_at, status, CONCAT(content_type, '#', content_id) AS title FROM content_schedule WHERE 1=1";
      const params: any[] = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (content_type) {
        query += ' AND content_type = ?';
        params.push(content_type);
      }
      if (search) {
        query += ' AND (content_type LIKE ? OR CAST(content_id AS CHAR) LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY scheduled_time DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [schedules] = await db.query<RowDataPacket[]>(query, params);

      // count
      let countQuery = 'SELECT COUNT(*) as total FROM content_schedule WHERE 1=1';
      const countParams: any[] = [];
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }
      if (content_type) {
        countQuery += ' AND content_type = ?';
        countParams.push(content_type);
      }
      if (search) {
        countQuery += ' AND title LIKE ?';
        countParams.push(`%${search}%`);
      }

      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

      return NextResponse.json({ schedules, total: countResult[0].total, page, limit });
    } catch (error) {
      console.error('Get schedules error:', error);
      return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
    }
  });
}
