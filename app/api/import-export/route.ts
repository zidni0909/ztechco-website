export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { authProtectedEndpoint } from '@/lib/api-auth';

// Export all data as JSON
export async function GET(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      // Example: Export users, blog posts, media files
      const [users] = await db.query('SELECT * FROM users');
      const [blogPosts] = await db.query('SELECT * FROM blog_posts');
      const [mediaFiles] = await db.query('SELECT * FROM media_files');
      // Add more tables as needed
      const exportData = {
        users,
        blogPosts,
        mediaFiles,
      };
      const json = JSON.stringify(exportData, null, 2);
      return new NextResponse(json, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="exported-data.json"',
        },
      });
    } catch (error) {
      console.error('Export error:', error);
      return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
    }
  });
}

// Import data from JSON
export async function POST(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const text = await file.text();
      const data = JSON.parse(text);
      // Example: Import users, blog posts, media files
      if (data.users) {
        for (const user of data.users) {
          // Upsert user (skip if exists)
          await db.query('INSERT IGNORE INTO users SET ?', user);
        }
      }
      if (data.blogPosts) {
        for (const post of data.blogPosts) {
          await db.query('INSERT IGNORE INTO blog_posts SET ?', post);
        }
      }
      if (data.mediaFiles) {
        for (const file of data.mediaFiles) {
          await db.query('INSERT IGNORE INTO media_files SET ?', file);
        }
      }
      // Add more tables as needed
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Import error:', error);
      return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
    }
  });
}
