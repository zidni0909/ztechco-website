export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection failed',
      error: (error as Error).message
    }, { status: 500 });
  }
}
