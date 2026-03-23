export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { handleError } from '@/lib/utils/errors';
import { authProtectedEndpoint } from '@/lib/api-auth';
import { RowDataPacket } from 'mysql2';

// Whitelist of keys safe to expose publicly
const PUBLIC_SETTINGS_KEYS = new Set([
  'site_title', 'site_description', 'logo_url', 'favicon_url',
  'contact_email', 'contact_phone', 'contact_address', 'contact_working_hours',
  'social_github', 'social_twitter', 'social_linkedin', 'social_instagram',
  'social_facebook', 'social_youtube', 'social_tiktok',
  'about_title', 'about_subtitle', 'about_why_title', 'about_why_text', 'about_features',
  'hero_title', 'hero_subtitle', 'hero_badge',
  'footer_text', 'footer_copyright',
]);

// Public GET - frontend components need settings without auth
export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT `key`, `value` FROM settings');
    const settings: Record<string, any> = {};
    (rows || []).forEach(r => {
      if (!PUBLIC_SETTINGS_KEYS.has(r.key)) return;
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    });
    return NextResponse.json({ settings });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

// All keys that admins are allowed to write
const ALLOWED_SETTINGS_KEYS = new Set([
  ...PUBLIC_SETTINGS_KEYS,
  'navbar_cta_text', 'og_image_url',
  'hero_features',
  'stats_title', 'stats_subtitle', 'stats_items',
  'cta_badge', 'cta_title', 'cta_subtitle',
]);

export async function PUT(request: NextRequest) {
  return authProtectedEndpoint(request, async () => {
    try {
      const body = await request.json();

      if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
      }

      for (const [key, value] of Object.entries(body)) {
        if (!ALLOWED_SETTINGS_KEYS.has(key)) continue; // skip unknown keys
        const v = typeof value === 'string' ? value : JSON.stringify(value);
        await db.query(
          'INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
          [key, v]
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      const { message, statusCode } = handleError(error);
      return NextResponse.json({ error: message }, { status: statusCode });
    }
  });
}
