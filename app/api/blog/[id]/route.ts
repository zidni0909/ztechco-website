export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { validateRequired, validateMinLength } from '@/lib/utils/validation';
import { handleError } from '@/lib/utils/errors';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { title, slug, excerpt, content, category, author, image_url, is_published } = body;

      // Validation
      if (!validateRequired(title)) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      if (!validateMinLength(title, 3)) {
        return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
      }

      await db.query(
        'UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author = ?, image_url = ?, is_published = ? WHERE id = ?',
        [title, slug || '', excerpt || '', content || '', category || '', author || '', image_url || '', is_published || false, params.id]
      );

      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      await db.query('DELETE FROM blog_posts WHERE id = ?', [params.id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}
