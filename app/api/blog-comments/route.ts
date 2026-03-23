export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const status = searchParams.get('status') || 'pending';
      const blog_id = searchParams.get('blog_id');

      const offset = (page - 1) * limit;
      let query = 'SELECT bc.*, b.title as blog_title FROM blog_comments bc LEFT JOIN blog b ON bc.blog_id = b.id WHERE 1=1';
      const params: any[] = [];

      if (status) {
        query += ' AND bc.status = ?';
        params.push(status);
      }
      if (blog_id) {
        query += ' AND bc.blog_id = ?';
        params.push(blog_id);
      }

      query += ' ORDER BY bc.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [comments] = await db.query<RowDataPacket[]>(query, params);

      let countQuery = 'SELECT COUNT(*) as total FROM blog_comments WHERE 1=1';
      const countParams: any[] = [];
      if (status) {
        countQuery += ' AND status = ?';
        countParams.push(status);
      }
      if (blog_id) {
        countQuery += ' AND blog_id = ?';
        countParams.push(blog_id);
      }

      const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);

      return NextResponse.json({
        comments,
        total: countResult[0].total,
        page,
        limit,
      });
    } catch (error) {
      console.error('Get comments error:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  // Public endpoint for comment submission
  try {
    const body = await request.json();
    const { blog_id, author_name, author_email, content } = body;

    if (!blog_id || !author_name || !author_email || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO blog_comments (blog_id, author_name, author_email, content, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [blog_id, author_name, author_email, content, 'pending']
    );

    return NextResponse.json({ success: true, message: 'Comment submitted for moderation' }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
