import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const accessTokenCookie = req.cookies.get('access_token');
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  const isAuth = !!accessToken;

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)']
};
