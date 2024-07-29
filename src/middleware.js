import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard"];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getToken({ req });

    if (token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
