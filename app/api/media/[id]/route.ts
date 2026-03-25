export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { authProtectedEndpoint } from '@/lib/api-auth';
import { unlink } from 'fs/promises';
import { resolveLegacyUploadFilePath, resolveUploadFilePath } from '@/lib/uploads';

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
        const filename = String(file.file_path).split('/').pop();
        const candidates = filename
          ? [resolveUploadFilePath(filename), resolveLegacyUploadFilePath(filename)]
          : [];

        for (const filePath of candidates) {
          try {
            await unlink(filePath);
          } catch (err: any) {
            if (err?.code !== 'ENOENT') {
              console.error('Error deleting physical file:', err);
            }
          }
        }
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete media error:', error);
      return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
  });
}
