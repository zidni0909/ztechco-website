export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { status, reply_message, replied_by } = body;

      let query = 'UPDATE contact_messages SET';
      const fields = [];
      const values: any[] = [];

      if (status) {
        fields.push('status = ?');
        values.push(status);
      }
      if (reply_message !== undefined) {
        fields.push('reply_message = ?');
        values.push(reply_message);
      }
      if (replied_by) {
        fields.push('replied_by = ?');
        values.push(replied_by);
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }

      query += ' ' + fields.join(', ') + ' WHERE id = ?';
      values.push(params.id);

      await db.query(query, values);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Update message error:', error);
      return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      await db.query('DELETE FROM contact_messages WHERE id = ?', [params.id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete message error:', error);
      return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
  });
}
