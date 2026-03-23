export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      const [rows] = await db.query('SELECT * FROM content_schedule WHERE id = ?', [params.id]);
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ schedule: rows[0] });
    } catch (error) {
      console.error('Get schedule error:', error);
      return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
    }
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { title, publish_at, status, meta } = body;
      const fields: string[] = [];
      const values: any[] = [];

      if (publish_at !== undefined) {
        fields.push('scheduled_time = ?');
        values.push(publish_at);
      }
      if (status !== undefined) {
        fields.push('status = ?');
        values.push(status);
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }

      const query = `UPDATE content_schedule SET ${fields.join(', ')} WHERE id = ?`;
      values.push(params.id);

      await db.query(query, values);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Update schedule error:', error);
      return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      await db.query('DELETE FROM content_schedule WHERE id = ?', [params.id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete schedule error:', error);
      return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
    }
  });
}
