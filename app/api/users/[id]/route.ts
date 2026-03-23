export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { email, role, is_active, password } = body;

      let query = 'UPDATE users SET';
      const fields = [];
      const values: any[] = [];

      if (email) {
        fields.push('email = ?');
        values.push(email);
      }
      if (role) {
        fields.push('role = ?');
        values.push(role);
      }
      if (is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(is_active);
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push('password = ?');
        values.push(hashedPassword);
      }

      if (fields.length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }

      query += ' ' + fields.join(', ') + ' WHERE id = ?';
      values.push(params.id);

      await db.query(query, values);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Update user error:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      await db.query('DELETE FROM users WHERE id = ?', [params.id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete user error:', error);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  });
}
