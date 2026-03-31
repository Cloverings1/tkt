import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import type { SessionPayload, OrgRole } from "./types"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE_NAME = "tkt-session"
const EXPIRY_DAYS = 7

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(payload: { sub: string; orgId: string; role: OrgRole }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .setIssuedAt()
    .sign(secret)
}

export async function verifyToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret)
  return payload as unknown as SessionPayload
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * EXPIRY_DAYS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
