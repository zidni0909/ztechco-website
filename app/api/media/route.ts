export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { authProtectedEndpoint } from '@/lib/api-auth';
import { writeFile } from 'fs/promises';
import { buildUploadPublicPath, ensureUploadDir, resolveUploadFilePath } from '@/lib/uploads';

export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');

      const offset = (page - 1) * limit;

      let files: RowDataPacket[] = [];
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          'SELECT id, filename, file_path, file_size, mime_type, uploaded_by, created_at FROM media_files ORDER BY created_at DESC LIMIT ? OFFSET ?',
          [limit, offset]
        );
        files = rows;
      } catch (error: any) {
        if (error?.code === 'ER_BAD_FIELD_ERROR' || String(error?.message || '').includes('Unknown column')) {
          const [rows] = await db.query<RowDataPacket[]>(
            'SELECT id, filename, file_path, file_size, file_type AS mime_type, uploaded_by, created_at FROM media_files ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
          );
          files = rows;
        } else {
          throw error;
        }
      }

      const [countResult] = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM media_files'
      );

      return NextResponse.json({
        files,
        total: countResult[0].total,
        page,
        limit,
      });
    } catch (error) {
      console.error('Get media error:', error);
      return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      // Validate mime type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'File type not allowed. Allowed: JPEG, PNG, WebP, GIF, SVG, PDF' }, { status: 400 });
      }

      // Validate file size (2MB for images, 5MB for other files)
      const isImage = file.type.startsWith('image/');
      const maxSize = isImage ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ error: `File size exceeds ${isImage ? '2MB' : '5MB'} limit` }, { status: 400 });
      }

      // Create upload directory if it doesn't exist
      await ensureUploadDir();

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const ext = file.name.split('.').pop();
      const filename = `${timestamp}-${random}.${ext}`;
      const filepath = resolveUploadFilePath(filename);
      const publicPath = buildUploadPublicPath(filename);

      // Save file
      const bytes = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(bytes));

      // Store in database (support old/new schema variants)
      try {
        await db.query(
          'INSERT INTO media_files (filename, original_name, file_path, file_size, mime_type, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [filename, file.name, publicPath, file.size, file.type, 1]
        );
      } catch (error: any) {
        if (error?.code === 'ER_BAD_FIELD_ERROR' || String(error?.message || '').includes('Unknown column')) {
          await db.query(
            'INSERT INTO media_files (filename, original_filename, file_path, file_size, file_type, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [filename, file.name, publicPath, file.size, file.type, 1]
          );
        } else {
          throw error;
        }
      }

      return NextResponse.json(
        { success: true, filename, path: publicPath },
        { status: 201 }
      );
    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
  });
}
