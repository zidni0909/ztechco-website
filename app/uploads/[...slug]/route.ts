import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { basename } from 'path';
import { buildUploadPublicPath, resolveLegacyUploadFilePath, resolveUploadFilePath } from '@/lib/uploads';

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slug = params.slug || [];
    if (slug.length === 0) {
      return new NextResponse('Not found', { status: 404 });
    }

    const unsafeFilename = slug[slug.length - 1] || '';
    const filename = basename(unsafeFilename);

    if (!filename || filename !== unsafeFilename) {
      return new NextResponse('Invalid file path', { status: 400 });
    }

    const candidates = [
      resolveUploadFilePath(filename),
      resolveLegacyUploadFilePath(filename),
    ];

    const filePath = candidates.find((candidate) => existsSync(candidate));
    if (!filePath) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${filename}"`,
        'X-Upload-Url': buildUploadPublicPath(filename),
      },
    });
  } catch (error) {
    console.error('Serve upload error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
