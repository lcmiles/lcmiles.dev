import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 30; // 30 requests per minute

    const record = rateLimit.get(ip);
    
    if (!record || now > record.resetTime) {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (record.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
