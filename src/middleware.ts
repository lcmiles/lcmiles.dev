import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const method = request.method;
  const pathname = request.nextUrl.pathname;
  const startTime = Date.now();
  
  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 30; // 30 requests per minute

    const record = rateLimit.get(ip);
    
    if (!record || now > record.resetTime) {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (record.count >= maxRequests) {
      console.log(`Rate limit exceeded for ${ip}`);
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  }

  const response = NextResponse.next();
  
  // Log request with status code and duration
  const duration = Date.now() - startTime;
  console.log(`${new Date().toISOString()} ${response.status} [${method}] ${pathname} - ${ip} (${duration}ms)`);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
