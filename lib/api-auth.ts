import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

export async function authProtectedEndpoint(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  try {
    // First try Authorization header with JWT issued by /api/auth/token
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const raw = authHeader.slice(7);
      try {
        const decoded = jwt.verify(raw, process.env.NEXTAUTH_SECRET || 'devsecret');
        // attach decoded token to request if needed by handlers (not used currently)
        return await handler(request);
      } catch (e) {
        // fall through to next-auth token check
        console.warn('Bearer token verify failed, falling back to next-auth getToken');
      }
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return await handler(request);
  } catch (error) {
    console.error('API Auth Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
