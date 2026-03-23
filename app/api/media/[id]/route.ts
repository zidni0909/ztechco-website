export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { authProtectedEndpoint } from '@/lib/api-auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return authProtectedEndpoint(request, async () => {
    try {
      // Get file info from database
      const [files] = await db.query(
        'SELECT file_path FROM media_files WHERE id = ?',
        [params.id]
      );

      if (!Array.isArray(files) || files.length === 0) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }

      const file = files[0] as any;
      
      // Delete from database
      await db.query('DELETE FROM media_files WHERE id = ?', [params.id]);

      // Delete physical file if it exists
      if (file.file_path) {
        try {
          const filePath = join(process.cwd(), 'public', file.file_path.replace(/^\//, ''));
          await unlink(filePath);
        } catch (err) {
          console.error('Error deleting physical file:', err);
          // Continue anyway, file is deleted from DB
        }
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete media error:', error);
      return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
  });
}
