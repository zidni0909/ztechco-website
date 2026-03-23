export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent } = body;

      await db.query(
        'INSERT INTO activity_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, action, table_name, record_id, JSON.stringify(old_values), JSON.stringify(new_values), ip_address, user_agent]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Activity log error:', error);
      return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
    }
  });
}

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const user_id = searchParams.get('user_id');
      const action = searchParams.get('action');
      const table = searchParams.get('table');

      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM activity_logs WHERE 1=1';
      const params: any[] = [];

      if (user_id) {
        query += ' AND user_id = ?';
        params.push(user_id);
      }
      if (action) {
        query += ' AND action = ?';
        params.push(action);
      }
      if (table) {
        query += ' AND table_name = ?';
        params.push(table);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [logs] = await db.query<RowDataPacket[]>(query, params);
      
      // Build count query with same filters
      let countQuery = 'SELECT COUNT(*) as total FROM activity_logs WHERE 1=1';
      const countParams: any[] = [];
      if (user_id) {
        countQuery += ' AND user_id = ?';
        countParams.push(user_id);
      }
      if (action) {
        countQuery += ' AND action = ?';
        countParams.push(action);
      }
      if (table) {
        countQuery += ' AND table_name = ?';
        countParams.push(table);
      }

      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

      return NextResponse.json({
        logs,
        total: countResult[0].total,
        page,
        limit,
      });
    } catch (error) {
      console.error('Get logs error:', error);
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
  });
}
