import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const accessTokenCookie = req.cookies.get('access_token');
  const accessToken = accessTokenCookie ? accessTokenCookie.value : null;
  const isAuth = !!accessToken;

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isMainPage = pathname === '/';

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/blogs', req.url));
    }
  } else {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
    if (isMainPage && isAuth) {
      return NextResponse.redirect(new URL('/blogs', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
