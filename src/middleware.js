import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Only allow access to dashboard routes if user is authenticated
        if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
          return false;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*']
};
