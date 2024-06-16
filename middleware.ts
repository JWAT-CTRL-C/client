import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const userAuthCookie = req.cookies.get('userAuth');
  const userAuth = userAuthCookie ? JSON.parse(userAuthCookie.value) : null;
  const isAuth = !!userAuth;

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isMainPage = pathname === '/';

  if (isAuthPage || isMainPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/blogs', req.url));
    }
  } else {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/blogs', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
