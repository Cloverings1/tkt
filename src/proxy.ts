import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  const token = request.cookies.get("tkt-session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
