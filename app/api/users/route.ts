export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const search = searchParams.get('search');
      const role = searchParams.get('role');

      const offset = (page - 1) * limit;
      let query = 'SELECT id, email, role, created_at FROM users WHERE 1=1';
      const params: any[] = [];

      if (search) {
        query += ' AND email LIKE ?';
        params.push(`%${search}%`);
      }
      if (role) {
        query += ' AND role = ?';
        params.push(role);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [users] = await db.query<RowDataPacket[]>(query, params);
      
      // Safe count query with separate params
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      const countParams: any[] = [];
      if (search) {
        countQuery += ' AND email LIKE ?';
        countParams.push(`%${search}%`);
      }
      if (role) {
        countQuery += ' AND role = ?';
        countParams.push(role);
      }
      
      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams.length > 0 ? countParams : []);

      return NextResponse.json({
        users: users || [],
        total: (countResult as RowDataPacket[])[0]?.total || 0,
        page,
        limit,
      });
    } catch (error) {
      console.error('Get users error:', error);
      return NextResponse.json({ error: 'Failed to fetch users', details: (error as Error).message }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { email, password, role = 'user' } = body;

      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      // Check if email already exists
      const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if ((existing as RowDataPacket[]).length > 0) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      await db.query(
        'INSERT INTO users (email, password, role, is_active, created_at) VALUES (?, ?, ?, true, NOW())',
        [email, hashedPassword, role]
      );

      return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
      console.error('Create user error:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  });
}
