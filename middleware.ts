// import { getToken } from 'next-auth/jwt';
// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';

import { NextRequest, NextResponse } from 'next/server';
import { getUserAuth } from './libs/utils';

// export default withAuth(
//   async function middleware(req) {
//     const token = await getToken({ req });
//     const isAuth = !!token;

//     const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

//     if (isAuthPage) {
//       if (isAuth) {
//         return NextResponse.redirect(new URL('/', req.url));
//       }
//     } else {
//       if (!isAuth) {
//         let from = req.nextUrl.pathname;

//         if (req.nextUrl.search) {
//           from += req.nextUrl.search;
//         }

//         return NextResponse.redirect(new URL(`/auth?callbackUrl=${encodeURIComponent(from)}`, req.url));
//       }
//     }
//   },
//   {
//     callbacks: {
//       authorized: () => {
//         return true;
//       }
//     }
//   }
// );

// export const config = {
//   matcher: ['/((?!api|_next|.*\\..*).*)']
// };

export default async function middleware(req: NextRequest) {
  const userAuthCookie = req.cookies.get('userAuth');
  const userAuth = userAuthCookie ? JSON.parse(userAuthCookie.value) : null;
  const isAuth = !!userAuth;
  console.log(userAuth);

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/blogs', req.url));
    }
  } else {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
