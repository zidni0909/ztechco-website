import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const isContactEndpoint = pathname === '/api/contact-messages' && request.method === 'POST';
    const limit = isContactEndpoint ? 5 : 60;
    const windowMs = 60 * 1000; // 1 minute
    const rateLimitKey = isContactEndpoint ? `contact:${ip}` : `api:${ip}`;

    if (isRateLimited(rateLimitKey, limit, windowMs)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.next();
  }

  // Skip middleware for login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check authentication for non-login admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}
