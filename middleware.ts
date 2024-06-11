import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.url === '/') {
    return NextResponse.redirect(new URL('/blogs', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
