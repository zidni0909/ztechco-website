export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { authProtectedEndpoint } from '@/lib/api-auth';
import { validateEmail } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    // No auth needed for contact form submission
    const body = await request.json();
    const { name, email, phone, subject, message, website } = body;

    // Honeypot: reject if filled (bot)
    if (website) {
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || '', subject || '', message]
    );

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const status = searchParams.get('status');
      const search = searchParams.get('search');

      const offset = (page - 1) * limit;
      let query = 'SELECT * FROM contact_messages WHERE 1=1';
      const params: any[] = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        query += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [messages] = await db.query<RowDataPacket[]>(query, params);

      let countQuery = 'SELECT COUNT(*) as total FROM contact_messages WHERE 1=1';
      const countParams: any[] = [];
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }
      if (search) {
        countQuery += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }
      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

      return NextResponse.json({
        messages,
        total: countResult[0].total,
        page,
        limit,
      });
    } catch (error) {
      console.error('Get messages error:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
  });
}
