export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { validateRequired } from '@/lib/utils/validation';
import { handleError } from '@/lib/utils/errors';
import { authProtectedEndpoint } from '@/lib/api-auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();
      const { client_name, client_company, client_position, testimonial, rating, image_url, is_published } = body;

      // Validation
      if (!validateRequired(client_name)) {
        return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
      }
      if (!validateRequired(testimonial)) {
        return NextResponse.json({ error: 'Testimonial is required' }, { status: 400 });
      }

      await db.query(
        'UPDATE testimonials SET name = ?, company = ?, position = ?, content = ?, avatar_url = ?, rating = ?, is_published = ? WHERE id = ?',
        [client_name, client_company || '', client_position || '', testimonial, image_url || '', rating || 5, is_published || false, params.id]
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
      await db.query('DELETE FROM testimonials WHERE id = ?', [params.id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}
